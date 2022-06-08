// 当在action表中找不到对应的动作时交给错误处理程序处理。错误处理程序能够预测出错位置的修复方案，并依据给修复方案继续编译。
// 下面的修复方案是通过填充字符来解决，虽然有些错误可以简单的删除字符，但是本方法基于字符填充来解决错误。
// 待完成
const { throwAnalysisError } = require("../../词法分析器/utils.js");

function handleError(token, state, action) {
    // fix为预测的修复方案，res为实际要填充的内容
    let fix = [], res = []
    for(let i = 1; i < action[0].length; i ++) {
        let act = action[state + 1][i]
        if(act) {
            if(act[0]) {
                let Vt = action[0][i]
                if (Vt != "#" && Vt != "\x00")
                    fix.push(Vt)
            }
        }
    }

    fix.forEach(el => {
        switch(el) {
            case "constant":
                // 如果需要填补数值，那么填补0
                res.push(0)
                break
            case "identifier":
                // 如果需要填补标识符，那么填补一个未声明的标识符
                res.push("undefined_identifier")
                break
            case "character":
                // 如果需要填补字符，那么填补一个空字符
                res.push("\x00")
                break
            case "string":
                // 如果需要填补字符串，那么填补一个空字符串
                res.push("\x00")
                break
            default:
                // 其它情况直接进行填补就行
                res.push(el)
        }
    })

    // output为原来抛出错误版本中显示错误内容的字符串，在当前版本下可以用来debug
    // let output = throwAnalysisError(token.row, token.col, "语法错误", `${token.content}后不符合C语言语法<br>`)
    // output += "建议填补以下符号 " + fix.join(",")
    // return new Promise((res, rej) => {
    //     rej(output)
    // })

    // 如果预测结果为空，res数组第一个预测结果设置为null，用于外界判断预测结果。
    if(!res.length)
        res.push(null)
    return res
}

module.exports.handleError = handleError