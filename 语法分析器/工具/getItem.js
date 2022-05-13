function getItem(G) {
    // 扩展文法
    G.Vs.push("S'")
    G.P.push(["S'", [G.S]])
    G.S = "S'"
    for(let p of G.P) {
        let len = p[1].length
        for(let i = 0; i <= len; i ++) {
            // 在项目产生式生成时，为了不影响原产生式，不能直接在原产生式上操作，需要先进行浅拷贝
            let rightExp = [...p[1]]
            rightExp.splice(i, 0, "·")
            G.expand.push([p[0], rightExp])
        }
    }
    return G
}

module.exports.getItem = getItem