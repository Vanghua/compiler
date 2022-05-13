const { throwError } = require("../utils.js");

class G {
    constructor(Vt, Vs, P, S) {
        this.Vt = Vt
        this.Vs = Vs
        this.P = P
        this.S = S
        // expand保存语法分析LR分析中的扩展文法中的项目产生式
        this.expand = []
        // 关于G文法的格式说明参见initG.js
        return new Proxy(this, {
            set(target, p, value, receiver) {
                if((p == "Vt" || "Vs" || "P" || "expand") && !Array.isArray(value)) {
                    throwError("类型错误", "文法的终结符，非终结符，产生式，项目产生式应该为数组类型")
                    // 特别地对产生式进行详细检查
                    if(p == "P")
                        if(p.length != 2 || typeof p[0] != "string" || !Array.isArray(p[1]))
                            throwError("类型错误", "文法产生式输入格式有误，格式为'[产生式左侧非终结符，[产生式右侧若干符号]]'")
                    // 特别地对项目产生式进行详细检查
                    if(p == "expand")
                        if(p.length != 3 || typeof p[0] != "string" || !Array.isArray(p[1]) || !Array.isArray(p[2]))
                            throwError("类型错误", "文法产生式输入格式有误，格式为'[产生式左侧非终结符，[产生式右侧若干符号]，[若干可能的向前搜索符号]]'")
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
    get [Symbol.toStringTag]() {
        return "G"
    }
}

module.exports.G = G