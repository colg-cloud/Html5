var a = 10  // 局部变量
b = 20      // 全局变量

/*
  在node中有一个全局对象 global, 它的作用和网页中window类似
    在全局中创建的变量都会作为global的属性保存
    在全局中创建的函数都会作为global的方法保存

  当node在执行模块中的代码时, 它会首先在代码的最顶部, 添加如下代码
    function (exports, require, module, __filename, __dirname) {

  在代码的最底部, 添加如下代码
    }

  实际上模块中的代码都是包装在一个函数中执行的, 并且在函数执行时, 同时传递进了5个实参
    exports
      - 该对象用来将变量或函数暴露到外部
    require
      - 函数, 用来引入外部的模块
    module
      - module代表的是当前模块本身
      - exports就是module的属性
      - 既可以使用exports导出, 也可以使用module.exports导出
    __dirname
      - 当前模块所在文件夹的的完整目录
      - D:\workspace-all\atguigu\Html5\11_NodeJs\01_node
    __filename
      - 当前模块的完整路径
      - D:\workspace-all\atguigu\Html5\11_NodeJs\01_node\05_module.js
 */

console.log(global.a) // undefined
console.log(global.b) // 20

/*
  arguments.callee
    - 这个属性保存的是当前执行的函数对象
 */
// console.log(arguments)
// console.log(arguments.callee.toString())
// console.log(arguments.length)
console.log(exports)
console.log(module.exports)
console.log(__dirname)
console.log(__filename)