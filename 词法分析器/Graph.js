class Graph {
    constructor(stateNum) {
        this.states = new Array(stateNum)
        for(let i = 0; i < stateNum; i ++)
            this.states[i] = {
                size: 0,
                next: []
            }
        this.stateNum = stateNum
        this.edgeNum = 0
    }

    add(u, v, edgeInfo) {
        this.states[u].next.push({
            edgeInfo: edgeInfo,
            v: v
        })
        this.states[u].size ++
    }
}

module.exports = {
    Graph: Graph
}