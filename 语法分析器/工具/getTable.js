let { getFirst } = require("./getFirst.js")
let { Edges, Nodes } = require("../数据结构/DFA.js")
let { getItem } = require("./getItem.js")

// update函数功能：得到新的向前搜索符后更新项目集的产生式（一个产生式的向前搜索符不一定能一次性求完）
function update(I, exp, Vs, vis) {
    let stringExp = [exp[0], exp[1].join("")].join(""), pointPos = exp[1].indexOf("·"), len = exp[1].length
    if(vis[stringExp])
        return
    // 给更新产生式做标记，防止循环左递归更新
    vis[stringExp] = true
    // 用于判断是否在项目集中找到了需要更新的项目，如果没有找到，说明这是一个新项目，不需要更新项目集，直接加入项目集即可
    let hasFindSame = false
    for(let p of I) {
        let stringP = [p[0], p[1].join("")].join("")
        // 如果项目集I中的产生式左右侧都和exp相等的话，那么I的该产生式的向前搜索符集合与exp合并
        if(stringExp == stringP) {
            hasFindSame = true
            let setP = new Set(p[2]), setExp = new Set(exp[2]), setUnion = new Set([...setP, ...setExp])
            p[2] = [...setUnion]
        }
    }
    // 如果没有找到可更新产生式，说明这是一个新产生式。直接加入项目集即可。
    if(!hasFindSame)
        return false
    // 到此为止exp已经把项目集I中与其产生式相等的产生式的向前搜索符更新完毕。但是如果exp中的·后面是非终结符，我们要继续更新。
    if(pointPos < len - 1) {
        let nextChar = exp[1][pointPos + 1], isVs = Vs.indexOf(nextChar) == -1 ? false : true
        if(isVs) {
            // 如果当前·后是非终结符，那么继续更新
            for(let p of I) {
                // 在I中找到产生式左侧是该非终结符且右侧第一个符号为·的产生式，需要更新之。
                if(p[0] == nextChar && p[1][0] == "·")
                    update(I, [p[0], p[1], exp[2]], Vs, vis)
            }
        }
    }
    return true
}

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
                        let firstSet = []
                        getFirst(rest, firstSet, [], G)
                        // firstSet求出来一定是数组，规定如果是空时，getFirst返回["\0"]，即["\x00"]。此时按照LR1向前搜索符要求，应为#
                        if(firstSet[0] == "\x00")
                            firstSet = ["#"]
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
                loop: for(let pp of G.expand) {
                    // LExp表示产生式左侧，RExp表示产生式右侧
                    let LExp = pp[0], RExp = pp[1]
                    if(LExp == nextChar && RExp[0] == "·") {
                        let newExp = [...pp, forward]
                        // hasFindSame表示newExp是否在I项目集中找到相同的产生式。在调用update时也会对与newExp相同的产生式进行向前搜索符更新
                        let hasFindSame = update(I, newExp, G.Vs, [])
                        if(hasFindSame)
                            continue loop
                        // 如果存在一个项目产生式，左侧是当前非终结符，且右侧第一个符号是项目符号。那么将其加入当前项目集，其向前搜索符上述代码已求解
                        I.push(newExp)
                    }
                }
            }
        }
    }
    return I
}

// 项目集序列化函数
function toString(I) {
    let res = []
    for(let [index, p] of I.entries()) {
        res[index] = []
        res[index][0] = p[0]
        res[index][1] = p[1].join("")
        res[index][2] = p[2].join("")
    }
    return res.join("")
}

// 判断该项目集在总项目集中是否存在
function judSameItem(ISet, I) {
    // 通过项目集序列化函数来判断字符串是否相等即可
    let toStringI = toString(I)
    for(let item of ISet) {
        let toStringItem = toString(item)
        if(toStringI == toStringItem)
            return true
    }
    return false
}

// LR1分析中的项目集转换GO函数
// cnt表示当前项目集的编号，从0开始编号
function go(I, ISet, G, nodes) {
    // allNext表示在当前项目集下，按·后面的字符对产生式进行分类的映射，每一个映射都会转移到下一个项目集
    let allINext = new Map()
    for(let p of I) {
        let rightExp = p[1], pos = rightExp.indexOf("·"), len = rightExp.length, leftExp = p[0], forward = p[2]
        if(pos == len - 1)
            continue
        // char表示·后面的字符
        let char = rightExp[pos + 1]
        // 对rightExp浅拷贝，后续要让·后移一位，不能影响文法
        let nextExp = [...rightExp]
        // 实现项目符号后移一个字符（现在下一个字符后面添加项目符号，之后删除原项目符号）
        nextExp.splice(pos + 2, 0, "·")
        nextExp.splice(pos, 1)

        // 向映射中添加分类的项目集
        if(!allINext.get(char))
            allINext.set(char, [])
        let items = allINext.get(char)
        items.push([leftExp, nextExp, forward])
        allINext.set(char ,items)
    }

    // 对allINext中分好类的项目产生式集求空闭包
    allINext.forEach((item, char) => {
        // I表示一个映射中的项目集，char表示一个映射中的字符
        let INext = getClosure(item, G)
        // 判断该项目集是否在总项目集中存在
        let isExist = judSameItem(ISet, INext)
        // 如果I不存在那么在邻接表顶点中添加
        if(!nodes[toString(I)])
            nodes[toString(I)] = new Nodes(I, [])
        // 如果INext不存在那么在邻接表顶点中添加
        if(!nodes[toString(INext)])
            nodes[toString(INext)] = new Nodes(INext, [])
        // 添加一条I到INext的边
        nodes[toString(I)].firstEdge.push(new Edges(char, INext, []))
        if(!isExist) {
            // 如果该项目在项目集中不存在，那么在总项目集种添加它，并求它能转换到的新状态
            ISet.push(INext)
            go(INext, ISet, G, nodes)
        }
    })
}

// 将状态集映射为数值，表示action表中的状态
function makeMap(ISet, nodes) {
    // action表状态用数值表示，但是邻接表中状态都是项目集或者项目集的序列化形式，现在需要将它们映射为数值，保存在itemNum字段中
    for(let [index, item] of ISet.entries()) {
        // 获得项目集的序列化形式
        let string = toString(item)
        // 在邻接表对应顶点中存储映射的数值
        nodes[string].itemNum = index
        nodes[index] = nodes[string]
    }
    // 把邻接表中的状态转的字符串形式化为数值形式
    for(let item of ISet) {
        // 获得项目集的序列化形式
        let string = toString(item)
        for(let edge of nodes[string].firstEdge) {
            // 获得临接顶点项目集的序列化形式
            let s = toString(edge.item)
            // 在邻接表对应边中存储映射的数值
            edge.itemNum = nodes[s].itemNum
        }
    }
}

// 产生式寻找函数，在填入规约要求时，需要知道用原来产生式中哪一个进行规约
function find(P, exp) {
    // 获取待寻找产生式的序列化形式，方便比较
    let stringExp = [exp[0], exp[1].join("")].join("")
    for(let [index, p] of P.entries()) {
        let stringP = [p[0], p[1].join("")].join("")
        if(stringP == stringExp)
            if(index != P.length - 1)
                // 在getItem函数中进行了文法扩展，在函数中把扩展文法的入口产生式放在了末尾，如果是入口产生式进行规约，那么返回-1，入口产生式不应该规约，应该是acc
                return index
            else
                return -1
    }
    return -1
}

// 将得到的DFA邻接表转换为action表和goto表
function getTable(ISet, nodes, G) {
    // action表行个数，第0行为行表头，第1行到第rowNum行为状态，考虑第0行为表头因此数目加一
    let rowNum = ISet.length + 1
    // action表列个数，第0列为列表头，第一列到第colNum列为终结符，需要再加上#数目加一，考虑第0列为表头因此数目再加一
    let colNum = G.Vt.length + 2

    // 申请一个动态二维数组存储action表
    let action = Array(rowNum)
    for(let i = 0; i < rowNum; i ++)
        action[i] = Array(colNum)

    // 设置action表行表头，全部为终结符
    for(let [index, s] of G.Vt.entries())
        action[0][index + 1] = s
    action[0][colNum - 1] = "#"

    // 对邻接表存储的状态做映射，action表goto表需要数值表示状态，把之前用字符串或对象存储的状态映射为数值
    makeMap(ISet, nodes)

    // 设置action表列头
    for(let [index, { itemNum }] of nodes.entries())
        action[index + 1][0] = itemNum

    // 遍历邻接表，填入action表内容
    for(let i = 0; i < ISet.length; i ++) {
        let edges = nodes[i].firstEdge
        // 需要移进的情况填入action表
        for(let j = 0; j < edges.length; j ++) {
            if(G.Vt.indexOf(edges[j].val) != -1)
                // 如果边上是终结符才考虑填入action表
                action[i + 1][action[0].indexOf(edges[j].val)] = `S${edges[j].itemNum}`
            // 如果边上是非终结符S（S表示原文法的开始符号），那么在#那一列填上acc
            else if(edges[j].val == G.expand[G.expand.length - 1][1][0])
                action[edges[j].itemNum + 1][colNum - 1] = "acc"
        }
        // 需要规约的情况填入action表
        for(let item of ISet[i]) {
            let rightExp = item[1], forward = item[2], len = rightExp.length, lenF = forward.length
            // 如果当前项目集中含有需要规约的产生式
            if(rightExp[len - 1] == "·") {
                // 获取原始的不带项目符号的产生式originalRightExp右侧
                let originalRightExp = [...rightExp]
                originalRightExp.splice(originalRightExp.indexOf("·"), 1)
                // 获取原始产生式
                let originalExp = [item[0], originalRightExp]
                // 查找这是第几个产生式，以便于填入action表“需要用原来第几个产生式进行规约”
                let num = find(G.P, originalExp)
                if(num == -1)
                    // 如果num=-1，说明这是接收状态，应填入acc，而不是规约符号
                    continue
                for(let fChar of forward)
                    action[i + 1][action[0].indexOf(fChar)] = `r${num}`
            }
        }
    }

    // 获取goto表
    // goto表行数和action表一样
    // goto表列数是非终结符个数减一，即去掉扩展文法的S'。但是考虑第一列为列头，所以再加一。最后列数为非终结符个数
    colNum = G.Vs.length

    // 动态申请二维数组存储goto表
    let goto = Array(rowNum)
    for(let i = 0; i < rowNum; i ++)
        goto[i] = Array(colNum)

    // 设置goto表列头
    for(let [index, { itemNum }] of nodes.entries())
        goto[index + 1][0] = itemNum

    // 设置goto表行头
    for(let [index, s] of G.Vs.entries())
        if(s !== "S'")
        goto[0][index + 1] = s

    // 遍历邻接表填入goto表
    for(let i = 0; i < ISet.length; i ++) {
        let edges = nodes[i].firstEdge
        // 需要移进的情况填入action表
        for(let j = 0; j < edges.length; j ++) {
            if(G.Vs.indexOf(edges[j].val) != -1)
                // 如果边上是非终结符才填入goto表
                goto[i + 1][goto[0].indexOf(edges[j].val)] = edges[j].itemNum
        }
    }
    return { action, goto }
}

// 计算action表和goto表函数
function LR1Table(G) {
    // 将原始文法转换为扩展文法
    G = getItem(G)
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
    // 邻接表顶点集数组下标为字符串，相当于成为了数组属性
    nodes[toString(I0)] = new Nodes(I0, [])

    // 开始求所有的项目集
    go(I0, ISet, G, nodes)

    // 根据go函数计算出的DFA的邻接表来计算action表和goto表
    return getTable(ISet, nodes, G)
}

module.exports.LR1Table = LR1Table