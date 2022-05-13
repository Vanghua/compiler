let { getFirst } = require("./getFirst.js")
let { Edges, Nodes } = require("../数据结构/DFA.js")

// LR1分析中的求项目集空闭包函数
function getClosure(I, G) {
    for(let p of I) {
        // rightExp表示产生式右侧，pos表示·在表达式右侧的位置，len表示表达式右侧的长度
        let rightExp = p[1], pos = rightExp.indexOf("·"), len = rightExp.length
        if(pos != len - 1) {
            // 当·不在产生式末尾时做如下处理
            // nextChar表示·后面下一个符号，isInVs表示该符号是否是非终结符，nextCharPos表示当前非终结符在产生式右侧的位置
            let nextChar = rightExp[pos + 1], isInVs = G.Vs.indexOf(nextChar) == -1 ? false : true, nextCharPos = pos + 1

            if(isInVs) {
                // 如果是非终结符，需要添加新的项目，在添加新项目前，先找到其向前搜索符
                // rest表示参与计算新加入项目的向前搜索符的中间参数。实际含义就是“该非终结符后面的符号串”再加上“当前项目的向前搜索符”，用数组存储
                // forward表示新添加的项目的向前搜索符集合
                let rest, forward = []
                if(nextCharPos == len - 1) {
                    // 如果该非终结符在产生式末尾，那么rest为”当前项目的向前搜索符“
                    loop: for(let i = 0; i < p[2].length; i ++) {
                        rest = [p[2][i]]
                        if(rest.length == 1 && rest[0] == "#") {
                            // 如果当前项目的向前搜索符只有#，且非终结符位于产生式末尾，那么不需要计算
                            forward.push("#")
                            break loop
                        }
                        let firstSet = []
                        getFirst(rest, firstSet, [], G)
                        // 把求出的first集作为可能的向前搜索符加入向前搜索符集合中
                        forward = [...forward, ...firstSet]
                    }
                } else {
                    // 如果该非终结符不在产生式末尾，那么rest为“该非终结符后面的符号串”再加上“当前项目的向前搜索符”
                    rest = rightExp.slice(nextCharPos + 1)
                    for(let i = 0; i < p[2].length; i ++) {
                        rest.push(p[2][i])
                        let firstSet = []
                        getFirst(rest, firstSet, [], G)
                        forward = [...forward, ...firstSet]
                    }
                }

                // 如果是非终结符，那么需要在该项目集中添加新的项目
                for(let pp of G.expand) {
                    // leftExp表示产生式左侧，rightExp表示产生式右侧
                    let leftExp = pp[0], rightExp = pp[1]
                    if(leftExp == nextChar && rightExp[0] == "·")
                        // 如果存在一个项目产生式，左侧是当前非终结符，且右侧第一个符号是项目符号。那么将其加入当前项目集，其向前搜索符上述代码已求解
                        I.push([pp, forward])
                }
            }
        }
    }
    return I
}

// 判断该项目集在总项目集中是否存在
function judSameItem(ISet, I) {
    for(let [index, item] of ISet.entries()) {
        // 对于总项目集中的每个项目而言，都要和项目I比较，查看两者是否相等
        // 下面利用集合的性质来作比较，copyItem是item项目集特殊处理后转为的集合，copyI是I项目集特殊处理后转为的集合
        let copyItem = new Set(), copyI = new Set()
        for(let p of item)
            // item项目集中每个项目产生式转为字符串，加入集合
            copyItem.add([p[0], p[1], p[2].sort()].join(""))
        for(let pp of I)
            // I项目集中每个项目产生式转为字符串，加入集合
            copyI.add([pp[0], pp[1], pp[2].sort()].join())

        if(copyItem.size == copyI.size) {
            // 如果两者集合大小相同，说明有可能相等。下面计算两者并集。
            let copyUnion = new Set([...copyItem, ...copyI])
            // 如果并集和原集合大小相同，那么说明项目集相等
            if(copyUnion.size == copyItem.size)
                // 如果相同，则返回已存在的该项目集在总项目集中的下标
                return index
        }
    }
    return false
}

// LR1分析中的项目集转换GO函数
function go(I, ISet, G) {
    for(let p of I) {
        let rightExp = p[1], pos = rightExp.indexOf("·"), len = rightExp.length
        if(pos == len - 1)
            continue
        // 声明由当前项目集转移到下一个项目集INext，以及项目集的初始项目产生式nextExp
        let INext = [],nextExp = [...rightExp]
        // 实现项目符号后移一个字符（现在下一个字符后面添加项目符号，之后删除原项目符号）
        nextExp.splice(pos + 2, 0, "·")
        nextExp.splice(pos, 1)
        // 下一个项目集的初始项目产生式就是nextExp
        INext.push(nextExp)
        // 判断该项目集是否存在
        let isExist = judSameItem(ISet, INext)
        if(!isExist)
            ISet.push(getClosure(I, G))
    }
}

function init(G) {
    let len = G.expand.length
    // 初始状态集一定含有S'->S，在getItem函数中扩展文法时，将S'->S放置到项目表达式的倒数第二个位置上
    let I0 = []
    // LR1分析需要加上向前搜索符，初始产生式的向前搜索符为#
    I0.push([...G.expand[len - 2], ["#"]])
    // 求I0的空闭包
    I0 = getClosure(I0, G)

    // 初始化项目及集，并加入I0项目集
    let ISet = []
    ISet.push(I0)

    // 初始化存储DFA的邻接表，并加入I0项目集顶点
    let nodes = []
    nodes.push(new Nodes(I0, {}))
}

function LRAnalysis() {

}

let { getItem } = require("./getItem.js")