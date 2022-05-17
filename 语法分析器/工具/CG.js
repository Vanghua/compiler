// C语言文法
let statement = [
    // 语句
    ["statement", [";"]], // 语句可以为空
    ["statement", ["exp", ";"]],
    ["statement", ["onlyIfChoice"]],
    ["statement", ["ifElseIfChoice"]],
    ["statement", ["ifElseChoice"]],
    ["statement", ["loopStatement"]],
    // 表达式
    ["exp", ["declaration"]],
    ["exp", ["assignment"]],
    ["exp", ["calStatement"]],
    ["exp", ["cpStatement"]],

    // 声明语句
    ["declaration", ["basicDeclaration"]], // 赋值或不赋值的基本类型声明语句
    ["declaration", ["structDeclaration"]], // 赋值或者不赋值的结构体声明语句
    ["declaration", ["primaryFunctionDeclaration"]], // 不带赋值的函数声明语句
    // 基本类型声明语句
    ["basicDeclaration", ["primaryType", "identifier_list"]],
    ["primaryType", ["char"]],
    ["primaryType", ["int"]],
    ["primaryType", ["const", "int"]],
    ["primaryType", ["long"]],
    ["primaryType", ["const", "long"]],
    ["primaryType", ["short"]],
    ["primaryType", ["const", "short"]],
    ["primaryType", ["unsigned"]],
    ["primaryType", ["float"]],
    ["primaryType", ["const", "float"]],
    ["primaryType", ["double"]],
    ["primaryType", ["const", "double"]],
    ["identifier_list", ["identifier"]], // <标识符列表> => <标识符>
    ["identifier_list", ["assignment"]], // <标识符列表> => <赋值语句>
    ["identifier_list", ["identifier", ",", "identifier_list"]], // <标识符列表> => <标识符><,><标识符列表>
    ["identifier_list", ["assignment", ",", "identifier_list"]], // <标识符列表> => <标识符><,><标识符列表>
    // 多条声明语句
    ["multiDeclaration", ["declaration", ";"]], // 多条基本类型声明语句可以推出一条声明语句
    ["multiDeclaration", ["multiDeclaration", "declaration", ";"]], // 多条基本类型声明语句可以推出多条声明语句
    // 函数声明语句
    // 无赋值的函数声明语句
    ["primaryFunctionDeclaration", ["primaryType", "identifier", "(", "declaration_list", ")"]],
    ["primaryFunctionDeclaration", ["void", "identifier", "(", "declaration_list", ")"]],
    ["primaryFunctionDeclaration", ["primaryType", "identifier", "(", ")"]],
    ["primaryFunctionDeclaration", ["void", "identifier", "(", ")"]],
    // 函数声明时的参数列表
    ["declaration_list", ["primaryType", "identifier"]],
    ["declaration_list", ["primaryType", "identifier", "declaration_list", ","]],
    // 赋值的函数声明语句
    ["valueFunctionDeclaration", ["primaryFunctionDeclaration", "{", "multiStatement", "}"]], // 带有赋值的函数声明特殊，不需要；结尾

    // 基本类型赋值语句
    ["assignment", ["identifier", "=", "identifier"]], // 变量赋值给另一个变量
    ["assignment", ["identifier", "=", "constant"]], // 常数赋给一个变量
    ["assignment", ["identifier", "=", "character"]], // 字符赋给一个变量
    ["assignment", ["identifier", "=", "string"]], // 字符串赋给一个变量
    ["assignment", ["identifier", "=", "identifier", "+", "identifier"]], // 假的
    ["assignment", ["identifier", "=", "identifier", "assignment"]],
    ["assignment", ["identifier", "=", "constant", "assignment"]],
    ["assignment", ["identifier", "=", "character", "assignment"]],
    ["assignment", ["identifier", "=", "string", "assignment"]],
    ["assignment", ["identifier", "+=", "identifier"]],
    ["assignment", ["identifier", "-=", "identifier"]],
    ["assignment", ["identifier", "*=", "identifier"]],
    ["assignment", ["identifier", "/=", "identifier"]],
    ["assignment", ["identifier", "%=", "identifier"]],
    ["assignment", ["identifier", "+=", "constant"]],
    ["assignment", ["identifier", "-=", "constant"]],
    ["assignment", ["identifier", "*=", "constant"]],
    ["assignment", ["identifier", "/=", "constant"]],
    ["assignment", ["identifier", "%=", "constant"]],
    ["assignment", ["identifier", "+=", "character"]],
    ["assignment", ["identifier", "-=", "character"]],
    ["assignment", ["identifier", "*=", "character"]],
    ["assignment", ["identifier", "/=", "character"]],
    ["assignment", ["identifier", "%=", "character"]],

    // 运算语句
    ["calChar", ["identifier"]],
    ["calChar", ["constant"]],
    ["calStatement", ["calChar", "+", "calChar"]],
    ["calStatement", ["calChar", "++"]],
    ["calStatement", ["calChar", "--"]],
    ["calStatement", ["calChar", "*", "calChar"]],
    ["calStatement", ["calChar", "/", "calChar"]],
    ["calStatement", ["calChar", "%", "calChar"]],

    // 比较语句
    ["cpStatement", ["calChar", "<", "calChar"]],
    ["cpStatement", ["calChar", "<=", "calChar"]],
    ["cpStatement", ["calChar", ">", "calChar"]],
    ["cpStatement", ["calChar", ">=", "calChar"]],
    ["cpStatement", ["calChar", "==", "calChar"]],

    // 选择语句
    ["onlyIfChoice", ["if", "(", "exp", ")", "block"]], // <仅含有单个if的选择语句> => <if><终结符"("><语句><终结符")"><语句块>
    ["ifElseIfChoice", ["onlyIfChoice"]], // if,elseif语句可以只是if语句
    ["ifElseIfChoice", ["onlyIfChoice", "else", "ifElseIfChoice"]], // if,elseif语句可以是if+else+多条ifElse语句组成
    ["ifElseChoice", ["onlyIfChoice", "else", "block"]], // if,else语句可以只是if语句

    // 循环语句
    ["loopStatement", ["for", "(", "declaration", ";", "cpStatement", ";", "calStatement", ")", "block"]],
    ["loopStatement", ["while", "(", "cpStatement", ")", "block"]],

    // 代码块
    ["block", ["statement"]], // 代码块可以是一条不被大括号包围的语句
    ["block", ["{", "statement", "}"]], // 代码块可以是多条语句

    // 多条语句
    ["multiStatement", ["statement"]], // 多条语句可以是一条语句
    ["multiStatement", ["statement", "multiStatement"]], // 多条语句可以由多个一条语句组成

    // 程序入口
    ["program", ["valueFunctionDeclaration"]], // 可以是带有赋值的函数声明
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
    'character','string',   '\x00'
]

// 非终结符
let Vs = [
    'statement',    'allTypeStatement', 'declaration',
    'primaryType',  'identifier_list',  'assignment',
    'assignment_list',  'assignment_type', 'onlyIfChoice',
    'ifElseIfChoice',   'ifElseChoice', 'block',
    'multiStatement',   'basicDeclaration', 'program',
    'multiDeclaration', 'primaryFunctionDeclaration', 'valueFunctionDeclaration',
    'declaration_list', 'program', 'multiFunction',
    'exp',  'calStatement', 'calChar',
    'cpStatement',  'loopStatement'
]

let G = {
    S: "program",
    Vt: Vt,
    Vs: Vs,
    P: statement,
    expand: []
}

module.exports.G = G