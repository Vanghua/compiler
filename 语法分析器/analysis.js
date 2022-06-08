const { LR1Table } = require("./工具/getTable.js");
let { TNode } = require("./数据结构/SyntaxTree.js")
let { write } = require("./测试/write.js")
let { throwAnalysisError } = require("../词法分析器/utils.js")
const { deepClone } = require("./工具/deepClone.js")
const { handleError } = require("./工具/handleError.js")
const { Token } = require("../词法分析器/数据结构/Token");

// 获取栈顶元素但不弹出
const getTop = stack => stack[stack.length - 1]

// LR1分析函数
async function analysis(input, action, goto, G, tokens) {
    // 声明状态栈和符号栈\和语法树节点栈和语法树当前树根
    let stateStack = [], charStack = [], nodeStack = [], root
    // 初始化状态栈和符号栈和token栈
    stateStack.push(0)
    charStack.push("#")
    // 编译中遇到的错误信息集
    let errors = ""

    // charPos表示已读取的输入串字符的位置，step表示语法分析第几步
    let charPos = 0, step = 0
    // 语法分析过程表
    let s = "步骤\t状态栈\t符号栈\t输入串\tAction\tGOTO\t\n"
    while(true) {
        let char = input[charPos]
        // 如果当前指针所指输入串位置的符号不为终结符#，那么令当前符号和当前栈顶状态进行分析
        let state = getTop(stateStack)
        let col = action[0].indexOf(char), act = action[state + 1][col]
        if(!act) {
            // 如果找不到，那么交给错误处理程序处理。错误处理程序能够预测错误的修复方案并修复，从而进行后续的编译
            // return handleError(...)是老版本的错误处理，遇到错误直接抛出，并对当前错误做出预测
            // return handleError(tokens[charPos - 1], state, action)

            // fixedChar表示错误处理程序预测的修补符号。每次遇到错误时都会做出预测尽量弥补，直到预测结果为空或编译结束才抛出错误。
            let token = tokens[charPos - 1]
            let fixedChar = handleError(token, state, action)[0]
            // 如果无法预测（即：当前状态只有唯一的接收非终结符时，那么直接抛出错误）
            if(!fixedChar)
                return new Promise((res, rej) => {
                    rej(throwAnalysisError(token.row, token.col, "语法错误", `${token.content}后不符合C语言语法<br>`))
                })
            // 将预测的结果填入输入代码，需要修改输入代码和token信息
            input.splice(charPos, 0, fixedChar)
            let t = new Token()
            t.content = fixedChar
            tokens.splice(charPos, 0, t)

            // 保存错误信息
            errors += throwAnalysisError(token.row, token.col, "语法错误", `${token.content}后不符合C语言语法<br>`)
        } else if(act[0] == "S") {
            // 打印语法分析步骤
            s += `(${++step})\t${stateStack.join("")}\t${charStack.join("")}\t${input.slice(charPos).join(" ")}\t${act}\t\n`
            // 进行移进
            // 注意act.slice(1)表示移进的状态，不能用act[1]表示，因为状态可能不是个位数（eg：S19表示移进到19号状态）
            let nextState = parseInt(act.slice(1))
            stateStack.push(nextState)
            charStack.push(char)
            nodeStack.push(new TNode(tokens[charPos].content))
            charPos ++
        } else if(act == "acc") {
            // 语法分析步骤
            s += `(${++step})\t${stateStack.join("")}\t${charStack.join("")}\t${input.slice(charPos).join(" ")}\t${act}\t\n`
            return Promise.resolve({ s, root, errors })
        } else {
            // 打印语法分析步骤
            let outputPart = `(${++step})\t${stateStack.join("")}\t${charStack.join("")}\t${input.slice(charPos).join(" ")}\t${act}\t`
            // 进行规约
            let expIndex = parseInt(act.slice(1))
            let exp = G.P[expIndex], leftExp = exp[0], rightExp = exp[1], len = rightExp.length, children = []
            // 符号栈和状态栈弹出状态进行规约
            for(let i = 0; i < len; i ++) {
                stateStack.pop()
                charStack.pop()
                // 规约时语法树收集当前规约时出栈的节点，作为子节点
                children.push(nodeStack.pop())
            }
            // 符号规约结果入栈
            charStack.push(leftExp)
            // 此时规约符号为children的父节点
            root = new TNode(leftExp)
            root.children = children.reverse()
            // 状态规约结果需要到goto表中寻找
            let state = getTop(stateStack), nextState = goto[state + 1][goto[0].indexOf(leftExp)]
            // 打印语法分析步骤
            s += outputPart + nextState + "\n"
            stateStack.push(nextState)
            nodeStack.push(root)
        }
    }
    return { s, root, errors }
}

// LR1语法分析控制程序
async function work(G, tokens, input) {
    try {
        // 为了程序能多次运行（在服务器运行），以及安全性考虑，这里对G做深拷贝
        G = deepClone(G)
        // 获取action表和goto表
        let {action, goto} = LR1Table(G)
        // 进行LR1语法分析
        let {s, root, errors} = await analysis(input, action, goto, G, tokens)
        // 讲语法分析过程打印出来
        await write(action, goto, s)
        // 返回语法分析结果：语法树，所有语法错误信息
        return Promise.resolve({
            root, errors
        })
    } catch(err) {
        return new Promise((res, rej) => {
            rej(err)
        })
    }
}

module.exports = {
    work
}