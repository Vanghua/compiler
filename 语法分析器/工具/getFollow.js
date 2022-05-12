let { getFirst } = require("./getFirst.js")

function init(G) {
    // map映射表示，一个符号对应着自己的Follow集，Follow集设置为一个集合
    let map = new Map()
    // 初始阶段每个符号的Follow集都为空集，
    for(let s of G.Vs)
        map.set(s, new Set())
    // 开始符号的Follow集一定包括"#"
    map.set(G.S, map.get(G.S).add("#"))
    return map
}

/* @params
A表示待求Follow集的非终结符
vis是布尔数组，表示某个非终结符是否求过Follow集（注：字符串作为数组下标会添加为数组对象的属性，就像对象[]风格设置属性）
map表示某个非终结符与其Follow集的映射
G表示文法
*/
// 求某个非终结符A的Follow集。注意：只能求非终结符的Follow集不能求串的Follow集，且该非终结符必须在产生式右侧出现
function getFollow(A, map, vis, G) {
    // 当前非终结符的Follow集已被求，避免循环递归
    vis[A] = true
    // 枚举所有产生式，处理产生式右侧含有该非终结符的产生式
    for(let p of G.P) {
        // rightExp表示产生式右侧，leftExp表示产生式左侧
        let rightExp = p[1], leftExp = p[0], len = rightExp.length
        // pos表示该非终结符在产生式右侧的位置，isInExp表示该非终结符在当前产生式右侧是否存在，isMidPos表示该非终结符是否在产生式右侧非末尾位置
        let pos = rightExp.indexOf(A), isInExp = pos == -1 ? false : true, isMidPos = pos < len - 1 ? true : false
        if(isInExp) {
            // 如果当前产生式右侧含有当前非终结符
            if(isMidPos) {
                // 如果非终结符在产生式右侧的中部。此时求非终结符右侧的串的first集。此时可表示为P->αAβ
                // β表示该终结符右侧的串
                let β = rightExp.slice(pos + 1)
                // first用来接收first集
                let first = []
                getFirst(β, first, [], G)
                // isExistEmpty表示first集中是否有空串
                let isExistEmpty = first.indexOf("ε") == -1 ? false : true

                if(!isExistEmpty) {
                    // 如果first集中没有空串，那么Follow(A) = Follow(A) ∪ first(β)
                    // 这里Follow集存储选用Set是因为该API可以自动去重
                    map.set(A, new Set([...map.get(A), ... first]))
                } else {
                    // 如果first集中有空串，那么A的Follow集此时无法判断，应与表达式左侧的非终结符的Follow集合并
                    // Follow(A) = Follow(A) ∪ first(β) - {ε}
                    // Follow(A) = Follow(A) ∪ Follow(P)
                    first.splice(first.indexOf("ε"), 1)
                    map.set(A, new Set([...map.get(A), ...first]))
                    // 若Follow(p)未求过，则先求Follow(p)
                    if(!vis[leftExp])
                        getFollow(leftExp, map, vis, G)
                    map.set(A, new Set([...map.get(A), ...map.get(leftExp)]))
                }
            } else {
                // 此时可表示为P->αA
                if(!vis[leftExp])
                    getFollow(leftExp, map, vis, G)
                map.set(A, new Set([...map.get(A), ...map.get(leftExp)]))
            }
        }
    }
}

// 计算所有非终结符的Follow集，返回格式是非终结符与其Follow集的映射
function getAllFollow(G) {
    let map = init(G), vis = []
    for(let vs of G.Vs)
        getFollow(vs, map, vis, G)
    return map
}

module.exports = {
    getAllFollow
}