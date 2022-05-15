let { type } = require("../../词法分析器/type.js")
const {Token} = require("../../词法分析器/数据结构/Token");
// 将token转换为适合语法分析的形式
function changeToken(tokens) {
    let input = []
    tokens.forEach(token => {
        let index = token.type
        switch (index) {
            case 80:
                input.push("constant")
                break
            case 81:
                input.push("identifier")
                break
            case 83:
                input.push("character")
                break
            case 84:
                input.push("string")
                break
            default:
                input.push(type[index - 1][0])
        }
    })
    input.push("#")
    return input
}

module.exports = {
    changeToken
}