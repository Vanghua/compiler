/* @params
symbols表示待求的串，是一个数组
result表示first集合结果
vis表示已求过first集的非终结符，用于避免左递归
G表示文法
*/
// 求某个串货非终结符的first集函数
function getFirst(symbols, result, vis, G) {
    // 遍历待求串
    let len = symbols.length
    for(let i = 0; i < len; i ++) {
        // isVt用于判断当前字符是否是终结符
        let s = symbols[i], isVt = G.Vt.indexOf(s) == -1 ? false : true
        if(isVt)
            // 如果是终结符，则可说明其一定属于该串的first集（当然并非该串的所有终结符都会被加入，下面有提前退出条件）
            result.push(s)
        else if(!isVt && !vis[s]) {
            // 如果是非终结符且没有被求过first集，则计算first集。求过first集的不再重复计算，避免循环左递归
            for(let p of G.P)
                if(p[0] == s) {
                    vis[s] = true
                    getFirst(p[1], result, vis, G)
                    vis[s] = false
                }
        }
        // 从result中弹出空串，用"\0"表示空串
        // 这表示只有在当前字符是当前串的最后一个字符且能推导出空串时，空串才属于first集合。如果串中某一个非终结符不是最后一个字符，且能推出空串，那么空串不属于first集
        if(result[result.length - 1] == "\0")
            result.pop()
        // isNull表示是否能够推导出空串
        let isNull = nullable(s, [], G)
        if(!isNull)
            // 如果当前字符不能推导出空串，那么该串的first集已求出，即为result
            // 当前字符可能是终结符，也可能是不能多步推导出空串的非终结符
            break
        else if(isNull && i == len - 1)
            // 只有在当前字符是当前串的最后一个字符且能推导出空串时，空串才属于first集合
            result.push("\0")
    }
}

/* @params
symbols表示待求的串
vis表示已求过是否能推导出空串的非终结符，用于避免左递归
G表示文法
*/
// 求某个串是否能推导出空串
function nullable(symbols, vis, G) {
    // 遍历该串的每个字符
    for(let s of symbols) {
        // isVt表示s是否是终结符
        let isVt = G.Vt.indexOf(s) == -1 ? false : true
        if(isVt && s != "\0")
            // 如果s是终结符且如果s不是空串，那么说明此时该串在此一定直接推不出空串
            return false
        else if(!isVt) {
            if (!vis[s]) {
                // 如果是非终结符且没有计算过该非终结符能否推导出空串，则进行计算
                // 遍历该非终结符的每个产生式
                for (let p of G.P) {
                    if (p[0] == s) {
                        vis[s] = true
                        let isNull = nullable(p, vis, G)
                        vis[s] = false
                        if(isNull)
                            // 如果能推导出空串，则直接跳出循环
                            break
                        else
                            // 如果一定不能直接推导出空串，则直接返回false
                            return false
                    }
                }
            } else
                // 因为外层nullable函数已经处理过符号s,如果本符号串能够推导出ε,则表示s一定通过其他的直接推导得到ε,所以这里直接返回false
                return false
        }
    }
    return true
}

module.exports = {
    getFirst
}