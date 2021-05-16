// 采用 highlight.js 库
Vue.use(hljs.vuePlugin);
// 采用 vue-i18n 国际化
Vue.use(VueI18n);
var in_lang;
if(in_lang = /lang=(\w+)/.exec(window.location.href))
    in_lang = in_lang[1];
else in_lang = 'en';

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
    var editor = ace.edit("manualfile");
    editor.setTheme("ace/theme/textmate");
    editor.session.setMode("ace/mode/latex");
    editor.session.setValue(app.file);
    editor.session.setUseWrapMode(true);
    document.getElementById('settings').style.display = 'none';
    document.getElementById('auto').style.display = 'none';
    document.getElementById('panel-vtwo').style.display = 'none';
    document.getElementById('panel-two').style.width = "calc(70% - 15px)";
    document.getElementById('panel-three').style.width = '0px';
    document.getElementById('compilePrev').style.height = '430px';
    document.getElementById('stylePrev').style.height = '430px';
    app.manual = true;
    // Split(['#panel-one','#panel-two']);
};

var manualrefresh = function(){
    var editor = ace.edit("manualfile");
    var code = editor.getValue();
    var newseries = seriesList[seriescnt][0];
    code = code.replace("\\end{axis}", newseries + "\n\\end{axis}");
    editor.setValue(code);
};

var manuallibchange = function(libstr){
    var mf = document.getElementById('manualfile');
    mf.innerHTML = mf.innerHTML.replace("\\begin{document}", libstr + "\\begin{document}");
};

// 交互式动态 logo

var anim_mutex = false;
var anim_index = 46;
var get_anim_str = function(){
    return "res/logo/anim/animatedlogo-frame" + (Array(2).join(0) + anim_index).slice(-2) + ".svg";
};

// Pre-load
while(--anim_index){
    var preloadLink = document.createElement("link");
    preloadLink.href = get_anim_str();
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    document.head.appendChild(preloadLink);
}

anim_index = 46;

var animback = function(){
    var back_anim = function (){
        var logo = document.getElementById('logo');
        logo.src = get_anim_str();
        if(anim_index - 1<0 || !anim_mutex){
            clearInterval(back_anim_t);
            anim_mutex = false;
        } else --anim_index;
    };

    var back_anim_t;
    if(!anim_mutex){
        anim_mutex = true;
        anim_index = 46;
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
        if(anim_index + 1>46 || !anim_mutex) {
            clearInterval(forward_anim_t);
            anim_mutex = false;
        } else ++anim_index;
    };

    var forward_anim_t;
    if(!anim_mutex){
        anim_index = 0;
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

// Version
document.getElementById("version").innerHTML = 'v2';