const { throwError } = require("../../词法分析器/utils.js");

class TNode {
    constructor(data) {
        this.data = data ?? {}
        this.children = []
    }
    get [Symbol.toStringTag]() {
        return "TNode"
    }
}


module.exports = {
    TNode
}