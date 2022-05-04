let { open, read } = require("./read.js")
let { init, work } = require("./analysis.js")
;(async () => {
    try {
        let fd = await open("./test.txt")
        init(fd, read)
        await work()
    } catch(err) {
        console.log(err)
    }
})();