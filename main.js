// 引入缓冲区读模块
let { open, read, reset } = require("./词法分析器/read.js")
// 引入词法分析器模块
let { init, work } = require("./词法分析器/analysis.js")
// 引入词法分析器测试模块
let { init: testInit, work: testWork } = require("./词法分析器/词法分析器测试/write.js")
// 引入C语言文法
let { G } = require("./语法分析器/工具/CG.js")
// 引入Token加工函数
let { changeToken } = require("./语法分析器/工具/changeToken.js")
// 引入语法分析器测试模块
let { work: SyntaxWork } = require("./语法分析器/analysis.js")

async function run() {
    try {
        // 尝试打开待编译文件
        let fd = await open("./词法分析器/待编译文件/test.txt")
        // 初始化缓冲区位移量
        reset()
        // 初始化词法分析器模块
        init(fd, read)
        // 运行词法分析器模块并接收词素集
        let tokens = await work()
        // 初始化词法分析器测试模块
        testInit(tokens)
        // 运行词法分析器模块
        await testWork()
        // 把token中加工成输入串
        let input = changeToken(tokens)
        // 运行语法分析器
        let root = await SyntaxWork(G, tokens, input)
        // 返回词法分析和语法分析结果
        return {
            root, tokens
        }
    } catch(err) {
        return new Promise((res, rej) => {
            rej(err)
        })
    }
}

module.exports.run = run