// file为文件标识符，read为读取文件的函数，这些变量由初始化函数赋初值
let file, read
// CommonJS模块规范旨在模块间隔离，模块间传递参数可以让模块提供一个初始化函数，把外部变量传递进来
function init(fd, rd) {
    file = fd
    read = rd
}

let utils = require("./utils.js")
let { Token } = require("./数据结构/Token.js")

// 声明词素首指针lex_begin，尾指针forward，DFA当前状态state
let lex_begin = 0, forward = 0, state = 0
// 声明缓冲区中内容buffer，保留缓冲区中内容reserveBuffer，保留缓冲区用在词素被缓冲区截断时，把后续内容读入保留缓冲区
let buffer = "", reserveBuffer = ""
// 声明当前使用的缓冲区nowBuffer，当词素被截断时，buffer和reserveBuffer会交替使用。
let nowBuffer = ""
// 声明当前词素首指针和尾指针在哪个缓冲区中
let beginPos, forwardPos
// 记录词法分析的所有token
let tokens = []
// 记录当前代码的行和列，初始时没有读入字符，列为0，行为1，当读入字符时列加1
let row = 1, col = 0

// 当词素被缓冲区截断时需要将后续内容读入另一个缓冲区
async function reRead() {
    // 将后续内容读入空闲缓冲区
    if(nowBuffer == buffer) {
        reserveBuffer = await read(file)
        nowBuffer = reserveBuffer
    } else {
        buffer = await read(file)
        nowBuffer = buffer
    }
    // 词素尾指针为0，指向新缓冲区的第一个字符。更新尾指针在当前缓冲区中
    forward = 0
    forwardPos = nowBuffer
}

// 根据当前字符更新当前词素尾指针的行列信息
function updateRowCol(c) {
    // 如果当前字符不是换行，那么列数加1。
    if(c !== "\n")
        col++
    // 如果当前字符是换行，那么行数加1，列数置为0
    if(c == "\n")
        row ++, col = 0
    return c
}

// 获取当前缓冲区下一个字符
async function nextChar() {
    // 如果词素尾指针没有到缓冲区末尾，说明不存在截断问题，当缓冲区为32字节时，forward最大为31
    if(forward < nowBuffer.length)
        // 返回当前字符，在返回前先计算行列信息
        return updateRowCol(nowBuffer[forward++])
    // 此时词素被截断，将后续内容读入空闲缓冲区
    await reRead()
        return updateRowCol(nowBuffer[forward ++])
}

// 生成当前词素对应的token
function getToken(tokenType) {
    let token = new Token()
    // beginPos和forwardPos表示首尾指针所在的缓冲区
    if(beginPos == forwardPos)
        // 如果首尾指针都在同一个缓冲区内，那么直接截取首尾之间的字符即可
        token.content = beginPos.slice(lex_begin, forward).join("")
    else
        // 首尾指针不在同一个缓冲区内，分开截取字符
        token.content = beginPos.slice(lex_begin).join("") + forwardPos.slice(0, forward).join("")
    // 记录当前词素的行列信息，方便错误提示
    token.row = row
    token.col = col - token.content.length + 1

    // 如果是标识符或关键字，那么需要考虑是标识符还是关键字
    if(tokenType == "identifier or key") {
        if(utils.judAllAlphabet(token.content)) {
            let num = utils.judReserve(token.content)
            if(num != -1)
                tokenType = "nums"
        }
        else
            tokenType = "identifier"
    }

    token.type = tokenType
    tokens.push(token)
}

async function work() {
    // 初始化当前缓冲区nowBuffer内容，正在使用的缓冲区buffer内容，更新首尾指针当前所在缓冲区
    beginPos = forwardPos = nowBuffer = buffer = await read(file)
    let c, isFinished = false
    while(1) {
        if(isFinished)
            break
        switch (state) {
            case 0:
                c = await nextChar()
                if(utils.judBlank(c) || utils.judEnter(c) || utils.judNewLine(c)) {
                    ++ lex_begin
                    // 除了词素尾指针在扫描词素字符时可能越过当前缓冲区，还有一种情况是词素首指针和尾指针相等，
                    // 两者一直在扫描空格换行和回车，此时两者共同越过缓冲区
                    // 当尾指针的位置是缓冲区大小加1，说明已经越过缓冲区一位，此时尾指针刚好在nextChar中被放置到新的缓冲区中，于是此时更新词素首指针的位置
                    if(lex_begin == nowBuffer.length + 1) {
                        lex_begin = 1
                        beginPos = forwardPos
                    }
                }
                else if(utils.judAlphabet(c) || utils.jud_(c))
                    state = 1
                else if(utils.judNumber(c))
                    state = 3
                break
            case 1:
                c = await nextChar()
                if(utils.judAlphabet(c) || utils.judNumber(c) || utils.jud_(c))
                    state = 1
                else
                    state = 2
                break
            case 2:
                // 当前标识符已经识别完，回退到初始状态
                state = 0
                // 尾指针多读了一位，当读入非字母数字下划线时会进入状态2，此时尾指针是当前读入的非字母数字下划线的下一位，同时记录的列也要随之减1
                forward -= 1
                col -= 1

                // 生成当前标识符对应的token
                getToken("identifier or key")
                // 查看当前代码是否读完
                if(c == "eof") {
                    isFinished = true
                    console.log(tokens)
                }

                // 如果代码没有读完，那么令词素首指针和尾指针到达相同位置，开始新的词素识别
                lex_begin = forward
                // 如果两个指针不在同一个缓冲区内，那么把首指针放入尾指针所在缓冲区
                if(beginPos != forwardPos)
                    beginPos = forwardPos
                break
            case 3:
                console.log("词法错误")
                isFinished = true
                break
        }
    }
}

module.exports = {
    init, work
}