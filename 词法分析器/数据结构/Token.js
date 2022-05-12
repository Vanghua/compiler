let { throwError } = require("../utils.js")

class Token {
    constructor() {
        this.content = ""
        this.row = -1
        this.col = -1
        this.type = undefined
        return new Proxy(this, {
            set(target, p, value, receiver) {
                if(p == "content" && typeof value != 'string') {
                    throwError("类型错误", "token的content类型应为字符串")
                    value = ""
                }
                if((p == "row" || p == "col") && typeof value != 'number') {
                    throwError("类型错误", "token的row和line和type类型应为数值")
                    value = -1
                }
                return Reflect.set(target, p, value, receiver)
            }
        })
    }
    toString() {
        return `{ content: ${this.content}, row: ${this.row}, col: ${this.col}, type: ${this.type} }`
    }
}

module.exports.Token = Token