function Compile(el, vm) {
    // 保存vm到compile对象
    this.$vm = vm;
    // 将el对应的元素对象保存到compile对象中
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);

    // 如果有el元素
    if (this.$el) {
        // 1. 取出el元素中所有子节点保存到一个fragment对象中
        this.$fragment = this.node2Fragment(this.$el);
        // 2. 编译fragment中所有层次子节点
        this.init();
        // 3. 将编译好的fragment添加到页面中的el元素中
        this.$el.appendChild(this.$fragment);
    }
}

Compile.prototype = {
    node2Fragment: function(el) {
        // 创建空的fragment
        var fragment = document.createDocumentFragment(),
            child;

        // 将原生节点拷贝到fragment
        // 将el中所有子节点转移到fragment
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }

        // 返回fragment
        return fragment;
    },

    init: function() {
        // 编译指定元素（所有层次的子节点）
        this.compileElement(this.$fragment);
    },

    compileElement: function(el) {
        // 去除最外层所有子节点
        var childNodes = el.childNodes,
            // 保存compile对象
            me = this;

        // 遍历所有子节点（text/element）
        [].slice.call(childNodes).forEach(function(node) {
            // 得到节点的文本内容
            var text = node.textContent;
            // 创建正则对象（匹配大括号表达式）
            var reg = /\{\{(.*)\}\}/;

            // 判断节点是否是一个元素节点
            if (me.isElementNode(node)) {
                // 编译元素节点（解析指令）
                me.compile(node);
            } else if (me.isTextNode(node) && reg.test(text)) {
                // 判断节点是否是大括号格式的文本节点
                // 编译大括号表达式文本节点
                me.compileText(node, RegExp.$1);
            }

            // 如果当前节点还有子节点，通过递归调用实现所有层次节点的编译
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    },

    compile: function(node) {
        var nodeAttrs = node.attributes,
            me = this;

        [].slice.call(nodeAttrs).forEach(function(attr) {
            var attrName = attr.name;
            if (me.isDirective(attrName)) {
                var exp = attr.value;
                var dir = attrName.substring(2);
                // 事件指令
                if (me.isEventDirective(dir)) {
                    compileUtil.eventHandler(node, me.$vm, exp, dir);
                    // 普通指令
                } else {
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                }

                node.removeAttribute(attrName);
            }
        });
    },

    compileText: function(node, exp) {
        compileUtil.text(node, this.$vm, exp);
    },

    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },

    isEventDirective: function(dir) {
        return dir.indexOf('on') === 0;
    },

    isElementNode: function(node) {
        return node.nodeType == 1;
    },

    isTextNode: function(node) {
        return node.nodeType == 3;
    }
};

// 指令处理集合
// 包含多个解析指令的方法的工具对象
var compileUtil = {
    // 解析v-text/{{}}
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },

    // 解析v-html
    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },

    // 解析v-model
    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        // 解析v-class
        var me = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }

            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },

    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },

    bind: function(node, vm, exp, dir) {
        // 得到更新节点的函数
        var updaterFn = updater[dir + 'Updater'];
        // 调用函数更新节点
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        new Watcher(vm, exp, function(value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },

    // 事件处理
    eventHandler: function(node, vm, exp, dir) {
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },

    // 从vm得到表达式所对应的值
    _getVMVal: function(vm, exp) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    },

    _setVMVal: function(vm, exp, value) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        });
    }
};

// 包含多个更新节点的方法的工具对象
var updater = {
    // 更新节点的textContent属性值
    textUpdater: function(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    // 更新节点的innerContent属性值
    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },

    // 更新节点的className属性值
    classUpdater: function(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },

    // 更新节点的value属性值
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
};