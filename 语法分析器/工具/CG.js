// C语言文法

let declare = []



let G = {
    S: "S",
    Vt: ["main", "(", ")", ""],
    Vs: [],
    P: [
        ["Program", ["IntType", "MainFunc","Block"]],
        ["MainFunc", ["main", "(", ")"]]
        ["IntType", ["int"]]
    ],
    expand: []
}

module.exports.G = G