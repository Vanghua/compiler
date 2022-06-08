let http = require("http")
let fs = require("fs")
let fss = fs.promises
let { run } = require("./main.js")

http.createServer(async function(req, res) {
    if(req.url.includes("html")) {
        fss.readFile("." + req.url).then(data => {
            res.writeHead(200, {
                "Content-Type": "text/html"
            })
            res.write(data)
            res.end()
        })
    } else if(req.url.includes("js")) {
        fss.readFile("." + req.url).then(data => {
            res.writeHead(200, {
                "Content-Type": "text/javascript"
            })
            res.write(data)
            res.end()
        })
    } else if(req.url.includes("analysis")) {
        let chunk = ""
        req.on("data", function(data) {
            chunk += data
        })
        req.on("end", async function() {
            let buf = Buffer.from(chunk, 'utf8')
            await fss.writeFile("./词法分析器/待编译文件/test.txt", buf)
            try {
                let {root, tokens, errors} = await run()
                res.write(JSON.stringify({ root, tokens, errors }))
                res.end()
            } catch(err) {
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                res.write(err)
                res.end()
            }
        })
    }
}).listen(3000)