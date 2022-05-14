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
    // charPos表示已读取的输入串字符的位置，step表示语法分析第几步
    let charPos = 0, step = 0

    LR: while(true) {
        let char = input[charPos]
        // 如果当前指针所指输入串位置的符号不为终结符#，那么令当前符号和当前栈顶状态进行分析
        let state = getTop(stateStack)
        let col = action[0].indexOf(char), act = action[state + 1][col]
        if(!act) {
            console.log("语法分析出错")
            break LR
        } else if(act[0] == "S") {
            // 打印语法分析步骤
            console.log(`(${++step})\t${stateStack.join("")}\t${charStack.join("")}\t${input.slice(charPos).join("")}\t${act}\t`)
            // 进行移进
            // 注意act.slice(1)表示移进的状态，不能用act[1]表示，因为状态可能不是个位数
            let nextState = parseInt(act.slice(1))
            stateStack.push(nextState)
            charStack.push(char)
            charPos ++
        } else if(act == "acc") {
            // 打印语法分析步骤
            console.log(`(${++step})\t${stateStack.join("")}\t${charStack.join("")}\t${input.slice(charPos).join("")}\t${act}\t`)
            console.log("语法分析完成")
            break LR
        } else {
            // 打印语法分析步骤
            let outputPart = `(${++step})\t${stateStack.join("")}\t${charStack.join("")}\t${input.slice(charPos).join("")}\t${act}\t`
            // 进行规约
            let expIndex = parseInt(act.slice(1))
            let exp = G.P[expIndex], leftExp = exp[0], rightExp = exp[1], len = rightExp.length
            // 符号栈和状态栈弹出状态进行规约
            for(let i = 0; i < len; i ++) {
                stateStack.pop()
                charStack.pop()
            }
            // 符号规约结果入栈
            charStack.push(leftExp)
            // 状态规约结果需要到goto表中寻找
            let state = getTop(stateStack), nextState = goto[state + 1][goto[0].indexOf(leftExp)]
            // 打印语法分析步骤
            console.log(outputPart + nextState)
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
    let input = ["a", "b", "b", "#"]

    console.log("步骤\t", "状态栈\t", "符号栈\t", "输入串\t", "Action\t", "GOTO\t")

    test(input, action, goto, G)
}

work()