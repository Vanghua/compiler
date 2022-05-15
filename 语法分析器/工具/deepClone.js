function deepClone(obj) {
    let wm = new WeakMap()

    // 深复制非函数属性
    function copy(key, value, target, obj) {
        // 深复制要复制属性的特性
        if (value instanceof Object) {
            let descriptor = Object.getOwnPropertyDescriptor(obj, key)
            // 如果是引用类型，那么就递归继续复制
            descriptor.value = clone(value)
            Object.defineProperty(target, key, descriptor)
        } else
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(obj, key))
    }

    function clone(obj) {
        // 深复制函数参数必须是对象
        obj = obj instanceof Object ? obj : Object(obj)

        // JavaScript特殊内置对象处理
        if (obj instanceof Date) return new Date(obj)
        if (obj instanceof RegExp) return new RegExp(obj)

        if (wm.has(obj))
            return wm.get(obj)

        let target
        // JavaScript非特殊对象处理
        if (typeof obj === "object")
            // 保持继承链
            target = new obj.constructor()
        else if (typeof obj === "function")
            return obj
        else if (Array.isArray(obj))
            target = new Array

        // 解决循环引用
        wm.set(obj, target)

        // 复制所有非符号自有可枚举属性及其特性
        Object.entries(obj).forEach(([key, value]) => copy(key, value, target, obj))

        // 复制所有符号自有可枚举属性及其特性
        Object.getOwnPropertySymbols(obj).forEach(key => {
            if (Object.getOwnPropertyDescriptor(obj, key).enumerable)
                copy(key, obj[key], target, obj)
        })

        return target
    }

    return clone(obj)
}

module.exports.deepClone = deepClone