const { throwError } = require("../utils.js");
class Edges {
    constructor() {
        this.val = ""
        this.next = {}
        return new Proxy(this, {
            set(target, p, value, receiver) {
                if(p == "val" && typeof value != 'string') {
                    throwError("类型错误", "DFA中描述边权应为字符串类型，表示一个符号")
                    value = ""
                } else if(p == "next" && (value == null || typeof value != "object")) {
                    throwError("类型错误", "DFA中描述下一个顶点应为对象，表示下一个项目集")
                    value = {}
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
        this.firstEdge = firstEdge ?? {}
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