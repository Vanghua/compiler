let fs = require("fs").promises

// 词法分析器测试模块初始化函数
let tokens
function init(Tokens) {
    tokens = Tokens
}

async function work() {
    let len = tokens.length
    for(let i = 0; i < len; i ++)
        tokens[i] = tokens[i].toString()
    tokens = tokens.join("\n")
    let buf = Buffer.from(tokens, 'utf8');
    return fs.writeFile("./词法分析器测试/result.txt", buf)
}

module.exports = {
    init, work
}