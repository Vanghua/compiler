let fs = require("fs")

// 设置缓冲区大小为32，C语言标识符允许的最长字符长度为32。
const bufLength = 32
// 分配缓冲区以及设置文件读取偏移量
let readBuffer = Buffer.allocUnsafe(bufLength), position = 0

function open(fileName) {
    return new Promise((res, rej) => {
        fs.open(fileName, "r", function(err, fd) {
            if(err)
                rej(err)
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

            let len = buffer.length, cString = []
            // 注意把buffer缓冲区处理成字符数组的处理方式，在unicode的utf8下，英文占一个字节，中文占3个字节。
            // 如果使用buffer.toString().split("")那么中文对应的三个字节会被加载成一个字符放入字符数组cString，这不是我们期望的，这样字符数组的长度达不到32。
            // 在这里我们手动处理buffer缓冲区，把每8位即1字节转化成unicode字符，这样转化成的unicode字符实际上是乱码，不在82位C语言种别码表中。
            // C语言不允许中文命名变量，对于注释，词法分析器需要略过。使用上述方法可以保证正确略过，否则长度错误的字符数组会导致很多难以理解的错误。
            for(let i = 0; i < len; i ++)
                cString.push(String.fromCharCode(buffer[i]))
            if(bytesRead < 32)
                cString[bytesRead] = "eof"
            res(cString)
        })
    })
}

// 重置函数，当需要重新读取文件时应该重置缓冲区位移标志position
function reset() {
    position = 0
}

module.exports = {
    open, read, reset
}