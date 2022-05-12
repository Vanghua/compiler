function getItem(G) {
    // 扩展文法
    G.S = "S'"
    G.Vs.push("S'")
    G.P.push(["S'", "S"])
    for(let p of G.P) {
        let len = p[1].length
        for(let i = 0; i <= len; i ++) {
            let s = p[1].split("")
            s.splice(i, 0, "·")
            G.expand.push([p[0], s.join("")])
        }
    }
    return G
}

module.exports.getItem = getItem