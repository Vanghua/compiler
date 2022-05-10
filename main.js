// 引入缓冲区读模块
let { open, read } = require("./词法分析器/read.js")
// 引入词法分析器模块
let { init, work } = require("./词法分析器/analysis.js")
// 引入词法分析器测试模块
let { init: testInit, work: testWork } = require("./词法分析器/词法分析器测试/write.js")

;(async () => {
    try {
        // 尝试打开待编译文件
        let fd = await open("./待编译文件/test.txt")
        // 初始化词法分析器模块
        init(fd, read)
        // 运行词法分析器模块并接收词素集
        let tokens = await work()
        // 初始化词法分析器测试模块
        testInit(tokens)
        // 运行词法分析器模块
        await testWork()
        console.log("词法分析成功")

        
    } catch(err) {
        console.log(err)
    }
})();