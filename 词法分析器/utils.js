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
        return val >= 97 && val <= 122 || val >= 65 && val <= 90 ? "alphabet" : 0
    },

    // 判断是否为数字
    judNumber(c) {
        let val = c.charCodeAt(0)
        return val >= 48 && val <= 57 ? "number" : 0
    },

    // 判断是否为下划线
    jud_: c => c == "_" ? "_" : 0,

    // 判断是否是空格
    judBlank: c => c == " " ? " " : 0,

    // 判断是否是回车
    judEnter: c => c == "\r" ? "\r" : 0,

    // 判断是否是换行
    judNewLine: c => c == "\n" ? "\n" : 0,

    // 判断是否是保留字
    judReserve: s => reserveWords.find(el => el == s ? true : false),
}