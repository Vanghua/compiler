// 保留字表，已按照字典序排序，便于折半查找
const reserveWords = [
    'auto',     'break',    'case',
    'char',     'const',    'continue',
    'default',  'do',       'double',
    'else',     'enum',     'extern',
    'float',    'for',      'goto',
    'if',       'int',      'long',
    'register', 'return',   'short',
    'signed',   'sizeof',   'static',
    'struct',   'switch',   'typedef',
    'union',    'unsigned', 'void',
    'volatile', 'while'
]

// 种别码表
let type = [
    ['auto', 1],     ['break', 2],    ['case', 3],
    ['char', 4],     ['const', 5],    ['continue', 6],
    ['default', 7],  ['do', 8],       ['double', 9],
    ['else', 10],     ['enum', 11],     ['extern', 12],
    ['float', 13],    ['for', 14],      ['goto', 15],
    ['if', 16],       ['int', 17],      ['long', 18],
    ['register', 19], ['return', 20],   ['short', 21],
    ['signed', 22],   ['sizeof', 23],   ['static', 24],
    ['struct', 25],   ['switch', 26],   ['typedef', 27],
    ['union', 28],    ['unsigned', 29], ['void', 30],
    ['volatile', 31], ['while', 32]
]

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

    // 判断词素是否全部由字母组成
    judAllAlphabet: function(s) {
        return Array.prototype.every.call(s, function (c) {
            return this.judAlphabet(c)
        }, this)
    },

    // 判断是否是保留字，采用折半查找
    judReserve: function(s) {
        let l = 0, r = reserveWords.length - 1, mid
        while(l < r) {
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
}