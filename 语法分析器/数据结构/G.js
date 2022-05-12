const {throwError} = require("../utils.js");

class G {
    constructor(Vt, Vs, P, S) {
        this.Vt = Vt
        this.Vs = Vs
        this.P = P
        this.S = S
        // expand保存语法分析LR分析中的扩展文法中的项目产生式
        this.expand = []
        return new Proxy(this, {
            set(target, p, value, receiver) {
                if((p == "Vt" || "Vs" || "P" || "expand") && !Array.isArray(value)) {
                    throwError("类型错误", "文法的终结符，非终结符，产生式，项目产生式应该为数组类型")
                    value = []
                }
                if(p == "S" && typeof value != 'string') {
                    throwError("类型错误", "文法的初始字符应该为字符串类型")
                    value = ""
                }
                return Reflect.set(target, p, value, receiver)
            }
        })
    }
}

module.exports.G = G

// let G = {
//     Vt: ["a", "d", "ε"],
//     Vs: ["A", "S"],
//     P: [["S", "aA"], ["S", "d"], ["A", "bAS"], ["A", "ε"]],
//     S: "S"
// }

// let G = {
//     Vt: ["a", "b", "ε"],
//     Vs: ["S", "E", "B"],
//     P: [["S", "E"], ["E", "BB"], ["B", "aB"], ["B", "b"]],
//     S: "S"
// }

// let G = {
//     Vt: ["d", "b", "ε"],
//     Vs: ["S", "A", "C"],
//     P: [["S", "A"], ["A", "C"], ["C", "Ab"], ["C", "d"]],
//     S: "S"
// }