let { LR1 } = require("../工具/LR1.js")

// 获取栈顶元素但不弹出
const getTop = stack => stack[stack.length - 1]

// 测试LR1分析函数
function test(input, action, goto, G) {
    // 声明状态栈和符号栈
    let stateStack = [], charStack = []
    // 初始化状态栈和符号栈
    stateStack.push(0)
    charStack.push("#")

    let len = input.length
    for(let i = 0; i < len;) {
        // 获取当前状态和当前输入符号
        let state = getTop(stateStack), char = input[i]

        if(char == "#") {
            // 当输入结束但符号栈和状态栈不为空时，根据当前符号栈栈顶元素，去action表和goto表中寻找指示
            char = getTop(charStack)
            let gotoPos = G.Vs.indexOf(char)
            if(gotoPos != -1)
                // 如果是非终结符那么去goto表找
                stateStack.push(goto[state + 1][gotoPos])
            // 如果是终结符按照下述操作即可
        }

        let pos = action[0].indexOf(char)
        if(pos == -1) {
            // 错误处理
            console.log("语法分析出错")
            return
        }

        // 获取action表中指定动作
        let act = action[state + 1][pos]
        if(act[0] == "S") {
            // 移进动作
            let nextState = act[1]
            stateStack.push(parseInt(nextState))
            charStack.push(char)
            i ++
        } else if(act == "acc") {
            // 语法分析结束动作
            console.log("语法分析完成")
        } else {
            // 规约动作
            let expIndex = act[1]
            // 使用exp产生式进行规约，rightExpLen表示产生式右侧符号个数，vs表示产生式左侧的非终结符
            let exp = G.P[expIndex], rightExpLen = exp[1].length, vs = exp[0]
            // 规约时先弹出符号栈和状态栈中指定个数的内容
            for(let i = 0; i < rightExpLen; i ++) {
                stateStack.pop()
                charStack.pop()
            }
            // 符号栈压入规约的非终结符
            charStack.push(vs)
            // 状态栈压入在当前栈顶状态下面临当前非终结符时goto表指定的状态
            let state = getTop(stateStack), nextState = goto[state + 1][goto[0].indexOf(vs)]
            stateStack.push(nextState)
        }
    }
}

function work() {
    let G = {
        Vt: ["a", "b"],
        Vs: ["S", "B"],
        P: [["S", ["B", "B"]], ["B", ["a", "B"]], ["B", ["b"]]],
        expand: [],
        S: "S"
    }
    let { action, goto } = LR1(G)
    console.log(action, goto)
    let input = "abb#"
    test(input, action, goto, G)
}

work()