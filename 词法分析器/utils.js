let { type, reserveWords } = require("./type.js")

module.exports = {
    // 抛出词法分析，语法分析错误
    throwAnalysisError: function(row, line, errorType, msg) {
        console.log(`${errorType}！，该错误发生在第${row}行，第${line}列，${msg}`)
    },

    // 抛出运行时错误
    throwError: function(errorType, msg) {
        console.log(`${errorType}！，${msg}`)
    },

    // 判断是否为字母
    judAlphabet(c) {
        if(c.length != 1)
            return 0
        let val = c.charCodeAt(0)
        return val >= 97 && val <= 122 || val >= 65 && val <= 90 ? "alphabet" : false
    },

    // 判断是否为数字
    judNumber(c) {
        let val = c.charCodeAt(0)
        return val >= 48 && val <= 57 ? "number" : false
    },

    // 判断是否为下划线
    jud_: c => c == "_" ? "_" : false,

    // 判断是否是空格
    judBlank: c => c == " " ? " " : false,

    // 判断是否是回车
    judEnter: c => c == "\r" ? "\r" : false,

    // 判断是否是换行
    judNewLine: c => c == "\n" ? "\n" : false,

    // 判断是否为水平制表符
    judTab: c => c == "\t" ? "\t" : false,

    // 判断词素是否全部由字母组成
    judAllAlphabet: function(s) {
        return Array.prototype.every.call(s, function (c) {
            return this.judAlphabet(c)
        }, this)
    },

    // 判断是否是保留字，采用折半查找
    judReserve: function(s) {
        let l = 0, r = reserveWords.length - 1, mid
        while(l <= r) {
            mid = (l + r) >> 1
            if(reserveWords[mid] == s)
                return mid
            else if(reserveWords[mid] > s)
                r = mid - 1
            else
                l = mid + 1
        }
        return -1
    },

    // 判断到达接收态时是标识符还是保留字
    judIdentifierOrReverse: function(s) {
        if(this.judAllAlphabet(s)) {
            let num = this.judReserve(s)
            // 只有num不为-1时才是保留字，其余都是标识符，其种类码为81
            if(num != -1)
                return num
            else
                return 81
        }
        return 81
    },

    // 判断是否是小数中的点
    judPoint: c => c == "." ? "." : false,

    // 选择状态
    stateSelect: c => {
        switch (c) {
            case "+":
                return 6
            case "-":
                return 10
            case "*":
                return 15
            case "/":
                return 18
            case "<":
                return 21
            case ">":
                return 27
            case "&":
                return 33
            case "|":
                return 37
            case "!":
                return 41
            case "^":
                return 44
            case "%":
                return 47
            case "(":
                return 50
            case ")":
                return 51
            case "[":
                return 52
            case "]":
                return 53
            case "{":
                return 54
            case "}":
                return 55
            case "=":
                return 56
            case ",":
                return 59
            case ".":
                return 60
            case ":":
                return 61
            case ";":
                return 62
            case "~":
                return 63
            case '"':
                return 64
            case "'":
                return 65
        }
    }
}