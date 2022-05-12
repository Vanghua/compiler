function getClosure(I, G) {
    for(let p of I) {
        // rightExp表示产生式右侧，pos表示·在表达式右侧的位置，len表示表达式右侧的长度
        let rightExp = p[1], pos = rightExp.indexOf("·"), len = rightExp.length
        if(pos != len - 1) {
            // nextChar表示·后面下一个符号，isInVs表示该符号是否是非终结符，nextCharPos表示当前非终结符在产生式右侧的位置
            let nextChar = rightExp[pos + 1], isInVs = G.Vs.indexOf(nextChar) == -1 ? false : true, nextCharPos = pos + 1

            // rest表示参与计算新加入项目的向前搜索符的中间参数
            let rest
            if(nextCharPos == len - 1) {
                for(let i = 0; i < p[3].length; i ++)
                    rest = p[3][i]
            } else {
                rest = rightExp.slice(nextCharPos + 1)
                for(let i = 0; i < p[3].length; i ++)
                    rest += p[3][i]
            }

            if(isInVs) {
                // 如果是非终结符，那么需要在该项目集中添加新的项目
                for(let pp of G.expand) {
                    // leftExp表示产生式左侧，rightExp表示产生式右侧
                    let leftExp = pp[0], rightExp = pp[1]
                    if(leftExp == nextChar)
                        if(rightExp[0] == "·") {
                            // 如果存在一个项目产生式，左侧是当前非终结符，且右侧第一个符号是项目符号，那么处理后加入当前项目集
                        }
                }
            }
        }
    }
}

function go(I, s) {

}

function init(G) {
    let len = G.expand.length
    // 初始状态集一定含有S'->S，在getItem函数中扩展文法时，将S'->S放置到项目表达式的倒数第二个位置上
    let I0 = []
    // LR1分析需要加上向前搜索符，初始产生式的向前搜索符为#
    I0.push([...G.expand[len - 2], ["#"]])
    getClosure(I0)
}

let G = {
    Vt: ["a", "b", "ε"],
    Vs: ["S", "E", "B"],
    P: [["S", "E"], ["E", "BB"], ["B", "aB"], ["B", "b"]],
    expand: [],
    S: "S"
}

let { getItem } = require("./getItem.js")

init(getItem(G))