# less 即学即用

## 1. less简介

### 1.1 less介绍

- less http://lesscss.cn/
- Less类似于Jquery
  - LESS CSS是一种动态样式语言，属于CSS预处理语言的一种，它使用类似CSS的语法，为CSS赋予了动态语言的特征，如变量、继承、运算、函数等，更方便CSS的编写和维护。

### 1.2 Koala的基本使用

- 编译工具
  - Koala http://koala-app.com/index-zh.html
  - Node.js 库
  - 浏览器端使用

## 2. less 语法详解

### 2.1 less中的注释

```less
/*我是被编译的*/

//不会被编译的
```

### 2.2 变量

```less
// less中的变量
// less中想声明变量的话一定要用 @开头，例如：@变量名：值；
@test_width: 300px;

.box {
  width: @test_width;
  height: @test_width;
  background-color: yellow;
}
```

### 2.3 混合

```less
// 混合
.border {
  border: 5px solid pink;
}
// 混合 - 可带参数的
.border_02(@border_width) {
  border: solid yellow @border_width;
}
.test_hunhe {
  .border_02(30px)
}
// 混合 - 默认带值
.border_03(@border_width: 10px) {
  border: solid green @border_width;
}
.test_hunhe_03 {
  .border_03()
}
// 混合的例子
.border_radius(@raidus: 5px) {
  -webkit-border-radius: @raidus;
  -moz-border-radius: @raidus;
  border-radius: @raidus;
}
.radius_test {
  width: 100px;
  height: 40px;
  background-color: green;
  .border_radius(10px)
}
```

### 2.4 匹配模式

- 相当于JS中的if，但不完全是
- 满足条件后才能匹配

```java
<div class="sanjiao"></div>
```

```less
// 匹配模式
.triangle(left, @w:5px, @c:#ccc) {
  border-width: @w;
  border-color: @c transparent transparent transparent;
  border-style: solid dashed dashed dashed;
}
.triangle(bottom, @w:5px, @c:#ccc) {
  border-width: @w;
  border-color: transparent @c transparent transparent;
  border-style: dashed solid dashed dashed;
}
.triangle(top, @w:5px, @c:#ccc) {
  border-width: @w;
  border-color: transparent transparent @c transparent;
  border-style: dashed dashed solid dashed;
}
.triangle(right, @w:5px, @c:#ccc) {
  border-width: @w;
  border-color: transparent transparent transparent @c;
  border-style: dashed dashed dashed solid;
}
.sanjiao {
  width: 0;
  .triangle(bottom, 100px)
}
```

### 2.5 运算

- 任何数字、颜色或者变量都可以参与运算，运算应该被包裹在括号中，例如：= - * /*

```less
// 运算
@test_01: 300px;
.box_02 {
  width: @test_01 + 20;
  color: #ccc - 10;
}
```

### 2.6 嵌套规则

- 两种用法
  - `&` 对伪类使用 `hover` 或 `focus`
  - 对连接的使用 `&-item`

### 2.7 @arguments变量

- `@arguments` 包含了所有传递进来的参数，如果不想单独处理每一个参数的话就可以这样写：

```less
// @arguments变量
.border_arg(@w: 30px, @c: red, @xx: solid) {
  border: @arguments;
}
.test_arguments {
  .border_arg()
}
```

### 2.8 避免编译、!important 以及总结

## 3. less 简单的项目实战

### 3.1 less综合案例 - 头部

### 3.2 less综合案例 - 列表

### 3.3 less综合案例 - 细节