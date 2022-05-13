const { throwError } = require("../../词法分析器/utils.js");
class Edges {
    constructor(val, item, next) {
        this.val = val ?? ""
        this.item = item ?? {}
        // 状态对应的数值，item是状态集，itemNum表示该状态集对应action表中的状态值
        this.itemNum = -1
        this.next = next ?? []
        return new Proxy(this, {
            set(target, p, value, receiver) {
                if(p == "val" && typeof value != 'string') {
                    throwError("类型错误", "DFA中描述边权应为字符串类型，表示一个符号")
                    value = ""
                } else if(p == "item" && (value == null || typeof value != "object")) {
                    throwError("类型错误", "DFA中描述下一个顶点应为对象，表示下一个项目集")
                    value = {}
                } else if(p == "next" && Object.prototype.toString.call(p).slice(8, -1) != "Edges") {
                    throwError("类型错误", "DFA中描述下一个边的类型应为Edges类")
                    value = new Edges()
                }
                return Reflect.set(target, p, value, receiver)
            }
        })
    }
    get [Symbol.toStringTag]() {
        return "Edges"
    }
}

class Nodes {
    constructor(item, firstEdge) {
        this.item = item ?? []
        this.firstEdge = firstEdge ?? new Set()
        // 状态对应的数值，item是状态集，itemNum表示该状态集对应action表中的状态值
        this.itemNum = -1
        return new Proxy(this, {
            set(target, p, value, receiver) {
                if(p == "item" && !Array.isArray(p)) {
                    throwError("类型错误", "DFA中顶点集中描述项目集的字段应为数组")
                    value = []
                } else if(p == "firstEdge" && Object.prototype.toString.call(p).slice(8, -1) != "Edges") {
                    throwError("类型错误", "DFA中顶点集中第一条边的字段应该为Edges类")
                    value = new Edges()
                }
                return Reflect.set(target, p, value, receiver)
            }
        })
    }
    get [Symbol.toStringTag]() {
        return "Nodes"
    }
}

module.exports = {
    Nodes, Edges
}