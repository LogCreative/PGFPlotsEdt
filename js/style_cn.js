// 采用 highlight.js 库
Vue.use(hljs.vuePlugin);

var default_title = "PGFPlots 统计绘图编辑器";

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

Vue.directive('threetip',function (el,binding) {
    if(binding.value)
        el.placeholder = 'x y z 按回车添加项';
    else el.placeholder = 'x y 按回车添加项';
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
    spliters[0].style.setProperty('--spliterHeight', Math.max(  
        pone.style.width==0? 0 : parseInt(getComputedStyle(pone).height),
        ptwo.style.width==0? 0 : parseInt(getComputedStyle(ptwo).height)) + 'px');
    spliters[1].style.setProperty('--spliterHeight', Math.max(
        ptwo.style.width==0? 0 : parseInt(getComputedStyle(ptwo).height),
        pthree.style.width==0? 0 : parseInt(getComputedStyle(pthree).height)) + 'px');
};

// 手动模式
var gomanual = function(){
    var mf = document.getElementById('manualfile');
    mf.innerHTML = app.file;
    mf.style.display = 'block';
    document.getElementById('settings').style.display = 'none';
    document.getElementById('auto').style.display = 'none';
    document.getElementById('panel-vtwo').style.display = 'none';
    document.getElementById('panel-three').style.width = '0px';
    document.getElementById('panel-two').style.width = window.innerWidth - document.getElementById('panel-one').style.width;
    document.getElementById('compilePrev').style.height = '430px';
    app.manual = true;
    // Split(['#panel-one','#panel-two']);
};

var anim_mutex = false;
var index = 46;
var get_anim_str = function(){
    return "res/logo/anim/animatedlogo-frame" + (Array(2).join(0) + index).slice(-2) + ".svg";
};

var animback = function(){
    var back_anim = function (){
        var logo = document.getElementById('logo');
        logo.src = get_anim_str();
        if(index - 1<0 || !anim_mutex){
            clearInterval(back_anim_t);
            anim_mutex = false;
        } else --index;
    };

    var back_anim_t;
    if(!anim_mutex){
        anim_mutex = true;
        index = 46;
        back_anim_t = setInterval(back_anim, 30);
    } else {
        anim_mutex = false;
        var waiter = setInterval(function(){
            anim_mutex = true;
            back_anim_t = setInterval(back_anim, 30);
            clearInterval(waiter);
        },30);
    }
    
};

var animforward = function(){
    var forward_anim = function (){
        var logo = document.getElementById('logo');
        logo.src = get_anim_str();
        if(index + 1>46 || !anim_mutex) {
            clearInterval(forward_anim_t);
            anim_mutex = false;
        } else ++index;
    };

    var forward_anim_t;
    if(!anim_mutex){
        index = 0;
        anim_mutex = true;
        forward_anim_t = setInterval(forward_anim, 30);
    } else {
        anim_mutex = false;
        var waiter = setInterval(function(){
            anim_mutex = true;
            forward_anim_t = setInterval(forward_anim, 30);
            clearInterval(waiter);
        },30);
    }    
};

// Pre-load
while(--index){
    var preloadLink = document.createElement("link");
    preloadLink.href = get_anim_str();
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    document.head.appendChild(preloadLink);
}

index = 46;