// 采用 highlight.js 库
Vue.use(hljs.vuePlugin);

var default_title = "PGFPlots 代码生成器";

// 渲染顺序会导致设定的相反性

// 缩小第一坐标的文本框宽度
Vue.directive('minimize',function(el,binding){
    if(binding.value){
        el.style.width = '40px';
        el.placeholder = 'x轴';
    } else {
        el.style.width = '80px';
        el.placeholder = '函数式(x)';
    }
});

// 删除线样式
Vue.directive('soutline',function(el,binding){
    if(binding.value){
        // el.style['text-decoration'] = 'none';
        el.style['color'] = '#666';
        el.style['opacity'] = '1.0';
    } else {
        // el.style['text-decoration'] = 'line-through';
        el.style['color'] = '#999';
        el.style['opacity'] = '0.5';
    }
});

// 验证名称的合法性
Vue.directive('validate',function(el,binding){
    if(binding.value==''||                      // 是否为空
        new RegExp("[0-9]").test(binding.value) // 是否存在数字
        ){
        // el.style['background-color']= "lightgray";
        el.style['border']= "2px solid red";
        // el.style['padding'] = '1px 2px';
    }
    else{ 
        // el.style['background-color']= "white";
        el.style['border']= "0.5px solid grey";
        // el.style['padding'] = '1px 3px';
    }
});

// 显示复制区域

var highlightCode = function (qselector,bcolor) {
    var x = document.querySelectorAll(qselector);
    for(var i = 0; i < x.length; ++i){
        x[i].style['border']="2px solid " + bcolor;
    }
}

var hintCode = function (qselector) {
    highlightCode(qselector,"green");
}

var warnCode = function (qselector) {
    highlightCode(qselector,"orange");
}

var blurCode = function (qselector) {
    highlightCode(qselector,"transparent");
}

// 设置分割栏的高度
var setSpliterHeight = function () {
    var spliters = document.getElementsByClassName('gutter gutter-horizontal');
    var pone = document.getElementById('panel-one');
    var ptwo = document.getElementById('panel-two');
    var pthree = document.getElementById('panel-three');
    var spliterHeight = Math.max(  
        pone.style.width==0? 0 : parseInt(getComputedStyle(pone).height),
        ptwo.style.width==0? 0 : parseInt(getComputedStyle(ptwo).height),
        pthree.style.width==0? 0 : parseInt(getComputedStyle(pthree).height)
    );
    for(var i = 0; i < spliters.length; ++i)
        spliters[i].style.setProperty('--spliterHeight', spliterHeight + 'px');
};