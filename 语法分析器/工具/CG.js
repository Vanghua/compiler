// C语言文法
let statement = [
    // 语句
    ["statement", ["allTypeStatement", ";"]],
    ["statement", [";"]], // 语句可以为空
    ["allTypeStatement", ["declaration"]], // 语句可以推导出声明语句
    ["allTypeStatement", ["assignment"]], // 语句可以推导出赋值语句

    // 不带赋初值的基本类型声明语句
    ["basicDeclaration", ["primaryType", "identifier_list"]], // <声明语句> => <基本类型><标识符列表>
    ["primaryType", ["char"]], // <基本类型> => <对应的词法分析种别码表中的终结符>
    ["primaryType", ["int"]],
    ["primaryType", ["long"]],
    ["primaryType", ["short"]],
    ["primaryType", ["unsigned"]],
    ["primaryType", ["float"]],
    ["primaryType", ["double"]],
    ["identifier_list", ["identifier"]],    // <标识符列表> => <标识符>
    ["identifier_list", ["identifier", ",", "identifier_list"]], // <标识符列表> => <标识符><,><标识符列表>
    // 带有赋初值的基本类型声明语句
    ["valueDeclaration", ["primaryType", "assignment"]],
    // 两者混合的基本类型声明语句
    ["crossDeclaration", ["primaryType", "crossDeclaration_type"]],
    ["crossDeclaration_type", ["identifier_list"]], // 可以是多个标识符
    ["crossDeclaration_type", ["assignment"]], // 可以是多个赋值语句
    ["crossDeclaration_type", ["assignment_type", ",", "identifier"]], // 标识符和赋值语句混合
    ["crossDeclaration_type", ["assignment_type", ",", "identifier", ",", "crossDeclaration_type"]], // 多个标识符和赋值语句混合
    ["crossDeclaration_type", ["identifier", ",", "assignment_type"]], // 赋值语句和标识符混合
    ["crossDeclaration_type", ["identifier", ",", "assignment_type", ",", "crossDeclaration_type"]], // 多个赋值语句和标识符混合
    // 赋值语句
    ["declaration", ["basicDeclaration"]],
    ["declaration", ["valueDeclaration"]],
    ["declaration", ["crossDeclaration"]],


    // 基本类型赋值语句
    ["assignment", ["assignment_list"]], // <赋值语句> => <赋值语句列表>
    ["assignment_type", ["identifier", "=", "identifier"]], // 变量赋值给另一个变量
    ["assignment_type", ["identifier", "=", "constant"]], // 常数赋给一个变量
    ["assignment_type", ["identifier", "=", "character"]], // 字符赋给一个变量
    ["assignment_type", ["identifier", "=", "string"]], // 字符串赋给一个变量
    ["assignment_list", ["assignment_type"]], // 赋值语句列表本身可以推出一个赋值语句
    ["assignment_list", ["assignment_type", ",", "assignment_list"]], // 赋值语句列表本身可以推出多个赋值语句

    // 选择语句
    ["onlyIfChoice", ["if", "(", "statement",")", "block"]], // <仅含有单个if的选择语句> => <if><终结符"("><语句><终结符")"><语句块>
    ["ifElseIfChoice", ["onlyIfChoice"]], // if,elseif语句可以只是if语句
    ["ifElseIfChoice", ["onlyIfChoice", "else", "ifElseIfChoice"]], // if,elseif语句可以是if+else+多条ifElse语句组成
    ["ifElseChoice", ["onlyIfChoice"]], // if,else语句可以只是if语句

    // 代码块
    ["block", ["statement"]], // 代码块可以是一条不被大括号包围的语句
    ["block", ["{", "multiStatement", "}"]], // 代码块可以是多条语句

    // 多条语句
    ["multiStatement", ["statement"]], // 多条语句可以是一条语句
    ["multiStatement", ["statement", "multiStatement"]], // 多条语句可以由多个一条语句组成

    // 程序入口
    ["program", ["block"]], // 可以是代码块
    ["program", ["multiStatement"]], // 可以是多条语句
]

// 终结符
let Vt = [
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
    'volatile', 'while',    '-',
    '--',       '-=',       '->',
    '!',        '!=',       '%',
    '%=',       '&',        '&&',
    '&=',       '(',        ')',
    '*',        '*=',       ',',
    '.',        '/',        '/=',
    ':',        ';',        '?',
    '[',        ']',        '^',
    '^=',       '{',        '}',
    '|',        '||',       '|=',
    '~',        '+',        '++',
    '+=',       '<',        '<<',
    '<<=',      '<=',       '=',
    '==',       '>',        '>=',
    '>>',       '>>=',      '"',
    'constant', 'identifier',   "'",
    'character','string'
]

// 非终结符
let Vs = [
    'statement',    'allTypeStatement', 'declaration',
    'primaryType',  'identifier_list',  'assignment',
    'assignment_list',  'assignment_type', 'onlyIfChoice',
    'ifElseIfChoice',   'ifElseChoice', 'block',
    'multiStatement',   'crossDeclaration', 'basicDeclaration',
    'valueDeclaration', 'crossDeclaration_type',    'program'
]

let G = {
    S: "program",
    Vt: Vt,
    Vs: Vs,
    P: statement,
    expand: []
}

module.exports.G = G