const { LR1Table } = require("./工具/getTable.js");
let { TNode } = require("./数据结构/SyntaxTree.js")
let { write } = require("./测试/write.js")

// 获取栈顶元素但不弹出
const getTop = stack => stack[stack.length - 1]

// LR1分析函数
function analysis(input, action, goto, G) {
    // 声明状态栈和符号栈和语法树节点栈和语法树当前树根
    let stateStack = [], charStack = [], nodeStack = [], root
    // 初始化状态栈和符号栈
    stateStack.push(0)
    charStack.push("#")
    // charPos表示已读取的输入串字符的位置，step表示语法分析第几步
    let charPos = 0, step = 0
    // 语法分析过程表
    let s = "步骤\t状态栈\t符号栈\t输入串\tAction\tGOTO\t\n"

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
            s += `(${++step})\t${stateStack.join("")}\t${charStack.join("")}\t${input.slice(charPos).join("")}\t${act}\t\n`
            // 进行移进
            // 注意act.slice(1)表示移进的状态，不能用act[1]表示，因为状态可能不是个位数（eg：S19表示移进到19号状态）
            let nextState = parseInt(act.slice(1))
            stateStack.push(nextState)
            charStack.push(char)
            nodeStack.push(new TNode(char))
            charPos ++
        } else if(act == "acc") {
            // 语法分析步骤
            s += `(${++step})\t${stateStack.join("")}\t${charStack.join("")}\t${input.slice(charPos).join("")}\t${act}\t\n`
            break LR
        } else {
            // 打印语法分析步骤
            let outputPart = `(${++step})\t${stateStack.join("")}\t${charStack.join("")}\t${input.slice(charPos).join("")}\t${act}\t`
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
    return { s, root }
}

// LR1语法分析控制程序
async function work() {
    // 获取文法G
    let G = {
        Vt: ["+", "*", "(", ")", "i"],
        Vs: ["E", "T", "F"],
        P: [["E", ["E", "+", "T"]], ["E", ["T"]], ["T", ["T", "*", "F"]], ["T", ["F"]], ["F", ["(", "E", ")"]], ["F", ["i"] ]],
        expand: [],
        S: "E"
    }
    // 获取action表和goto表
    let { action, goto } = LR1Table(G)
    // 获取词法分析的tokens
    let input = ["i", "+", "i", "*", "i", "#"]
    // 进行LR1语法分析
    let { s, root } = analysis(input, action, goto, G)
    // 讲语法分析过程打印出来
    await write(action, goto, s)
    // 返回语法分析结果：语法树
    return root
}

module.exports = {
    work
}