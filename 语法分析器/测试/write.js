let fs = require("fs").promises

async function write(action, goto, s) {
    // 写语法分析过程
    let buf = Buffer.from(s, 'utf8')
    await fs.writeFile("./procedure.txt", buf)

    // 写action表
    for(let i = 0; i < action.length; i ++)
        action[i] = action[i].join("\t")
    action = action.join("\n")
    buf = Buffer.from(action)
    await fs.writeFile("./action.txt", buf)

    // 写goto表
    for(let i = 0; i < goto.length; i ++)
        goto[i] = goto[i].join("\t")
    goto = goto.join("\n")
    buf = Buffer.from(goto)
    await fs.writeFile("./goto.txt", buf)
}

module.exports.write = write