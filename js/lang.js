// 采用 vue-i18n 国际化
Vue.use(VueI18n);
var in_lang = 'en';
if(in_lang = /lang=(\w+)/.exec(window.location.href)){
    in_lang = in_lang[1];
    // legacy identifier
    if(in_lang == 'cn')
        in_lang = 'chs';
}
else in_lang = 'en';

lang_messages = {
    chs: chs,
    en: en
}

var default_title;
var changelang = function(newlang) {
    var newscript = document.createElement('script');
    newscript.setAttribute('type','text/javascript');
    newscript.setAttribute('id','langdict');
    var head = document.getElementsByTagName('head')[0];
    var oldscript = document.getElementById('langdict');
    newscript.setAttribute('src','lang/dict_' + newlang + '.js');
    head.appendChild(newscript);
    if(oldscript) head.removeChild(oldscript);

    default_title = lang_messages[newlang]["PGFPlotsEdt"];
    
    // 渲染顺序会导致设定的相反性
    
    // 缩小第一坐标的文本框宽度
    Vue.directive('minimize',function(el,binding){
        if(binding.value){
            el.style.width = '40px';
            el.placeholder = lang_messages[newlang]["series"]["funcx"];
        } else {
            el.style.width = '80px';
            el.placeholder = lang_messages[newlang]["series"]["funcxfull"];
        }
    });
    
    Vue.directive('threetip',function (el,binding) {
        if(binding.value)
            el.placeholder = lang_messages[newlang]["series"]["threetip"];
        else el.placeholder = lang_messages[newlang]["series"]["twotip"];
    });

    Vue.directive('threenode',function (el,binding) {
        if(binding.value)
            el.placeholder = 'x,y,z';
        else el.placeholder = 'x,y';
    })

}
changelang(in_lang);
setTimeout(() => {
    langChangeEvent.$emit('lang-change');
}, 500);            // wait for js loading...
