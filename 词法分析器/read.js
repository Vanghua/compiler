let fs = require("fs")

// 设置缓冲区大小为32，C语言标识符允许的最长字符长度为32。
const bufLength = 32
// 分配缓冲区以及设置文件读取偏移量
let readBuffer = Buffer.allocUnsafe(bufLength), position = 0

function open(fileName) {
    return new Promise((res, rej) => {
        fs.open(fileName, "r", function(err, fd) {
            if(err)
                rej(void 0)
            res(fd)
        })
    })
}

function read(fd) {
    return new Promise((res, rej) => {
        fs.read(fd, readBuffer, 0,32, position, function(err,bytesRead, buffer) {
            if(err)
                rej("读取文件出错")
            position += 32
            let cString = buffer.toString().split("")
            if(bytesRead < 32)
                cString[bytesRead] = "eof"
            res(cString)
        })
    })
}

module.exports = {
    open, read
}