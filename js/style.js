/*
 * Copyright (c) Log Creative 2020--2024,
 * released under the GNU Affero General Public License v3.
 */

// 采用 highlight.js 库
Vue.use(hljs.vuePlugin);

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
    if (spliters.length > 0) {
        var pone = document.getElementById('panel-one');
        var ptwo = document.getElementById('panel-two');
        var pthree = document.getElementById('panel-three');
        spliters[0].style.setProperty('--spliterHeight', Math.max(  
            parseInt(getComputedStyle(pone).width)==0? 0 : parseInt(getComputedStyle(pone).height),
            parseInt(getComputedStyle(ptwo).width)==0? 0 : parseInt(getComputedStyle(ptwo).height)) + 'px');
        spliters[1].style.setProperty('--spliterHeight', Math.max(
            parseInt(getComputedStyle(ptwo).width)==0? 0 : parseInt(getComputedStyle(ptwo).height),
            parseInt(getComputedStyle(pthree).width)==0? 0 : parseInt(getComputedStyle(pthree).height)) + 'px');
        if (parseInt(getComputedStyle(pthree).width)==0) pthree.style.height="0px";
        else pthree.style.height="auto";
    }
};

// 手动模式
var gomanual = function(){
    document.getElementById('settings').style.display = 'none';
    document.getElementById('auto').style.display = 'none';
    document.getElementById('panel-vtwo').style.display = 'none';
    if(instance)
        instance.collapse(2);
    document.getElementById('panel-three').style.width = '0px';
    document.getElementById('compilePrev').style.height = '430px';
    document.getElementById('stylePrev').style.height = '430px';
    document.getElementById('manualfile').style.display = 'block';
    document.getElementById('code').style.display = 'block';
    app.manual = true;
    setSpliterHeight();
    var editor = ace.edit("manualfile");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.on("change", function(e){
        editor.execCommand("startAutocomplete");
    })
    langTools=ace.require("ace/ext/language_tools");
    langTools.setCompleters([customCompleter]);
    editor.setTheme("ace/theme/textmate");
    editor.session.setMode("ace/mode/latex");
    editor.session.setValue(app.file);
    editor.session.setUseWrapMode(true);
    editor.commands.addCommand({
        name: 'compile',
        bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
        exec: function() {
            app.compile();
        },
        readOnly: false
    });
};

var manualrefresh = function(){
    var editor = ace.edit("manualfile");
    var code = editor.getValue();
    var newseries = seriesList[seriescnt][0];
    code = code.replace("\\end{axis}", newseries + "\n\\end{axis}");
    editor.setValue(code);
};

var manuallibchange = function(libstr){
    var editor = ace.edit("manualfile");
    var code = editor.getValue();
    if (code.indexOf(libstr) === -1) {
        code = code.replace("\\begin{document}", libstr + "\\begin{document}");
        editor.setValue(code);
    }
};

getCodeDiff = function(oldcode, newcode){
    // return the the changed line number in newcode
    var oldlines = oldcode.split('\n');
    var newlines = newcode.split('\n');
    var minLineLength = Math.min(oldlines.length, newlines.length);
    var start_row = 0, end_row = newlines.length - 1;
    var start_col = 0, end_col = -1;
    var oldRow, newRow, minRowLength = 0;
    for (var i = 0; i < minLineLength; i++) {
        oldRow = oldlines[i];
        newRow = newlines[i];
        if (oldRow !== newRow) {
           start_row = i;
           minRowLength = Math.min(oldRow.length, newRow.length);
           start_col = minRowLength;
           for (var j = 0; j < minRowLength; j++) {
               if (oldRow[j] !== newRow[j]) {
                   start_col = j;
                   break;
               }
           }
           break;
        }
    }
    for (var i = 0; i < minLineLength - start_row; i++) {
        oldRow = oldlines[oldlines.length - 1 - i];
        newRow = newlines[newlines.length - 1 - i];
        if (oldRow !== newRow) {
            end_row = newlines.length - 1 - i;
            minRowLength = Math.min(oldRow.length, newRow.length);
            end_col = 1;
            for (var j = 0; j < minRowLength; j++) {
                if (oldRow[oldRow.length - 1 - j] !== newRow[newRow.length - 1 - j]) {
                    end_col = newRow.length - j;
                    break;
                }
            }
            break;
        } else {
            end_row = newlines.length - 1 - i;
            end_col = 0;
        }
    }
    return {start: {row: start_row, column: start_col}, end: {row: end_row, column: end_col}};
};

generateCodeClick = function(obj) {
    if (app.llm) {
        var editor = ace.edit("manualfile");
        var prompt_input = document.getElementById('code_prompt');
        var generate_btn = document.getElementById('code_generate');
        var code_accept_btn = document.getElementById('code_accept');
        var code_reject_btn = document.getElementById('code_reject');
        var generating = document.getElementById('generating');
        var prompt = prompt_input.value;
        if (prompt !== "") {
            var code = editor.getValue();
            var request = new XMLHttpRequest();
            request.open('POST', "/llm", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = function() {
                var new_code = request.responseText;
                // only fully update when the new code is different
                var oldlines = code.split('\n');
                var newlines = new_code.split('\n');
                var composed_lines = oldlines;
                if (oldlines.length > newlines.length && code.startsWith(new_code)) {
                    for (var i = 0; i < newlines.length; i++) {
                        composed_lines[i] = newlines[i];
                    }
                    editor.setValue(composed_lines.join('\n'));
                    editor.clearSelection();
                    editor.selection.moveCursorToPosition({row: newlines.length - 1, column: newlines[newlines.length - 1].length});
                    editor.selection.setSelectionRange({start: {row: 0, column: 0}, end: {row: newlines.length - 1, column: newlines[newlines.length - 1].length}});
                } else {
                    editor.setValue(new_code);
                }
                if (request.readyState == XMLHttpRequest.DONE) {
                    var diffRange = getCodeDiff(code, new_code);
                    editor.clearSelection();
                    editor.selection.moveCursorToPosition({row: diffRange.end.row, column: diffRange.end.column});
                    editor.selection.setSelectionRange(diffRange);
                    generate_btn.style.display = 'none';
                    code_accept_btn.style.display = 'inline-block';
                    code_reject_btn.style.display = 'inline-block';
                    generating.style.display = 'none';
                }
            }
            request.send(JSON.stringify({code: code, prompt: prompt}));
            generate_btn.disabled = true;
            generating.style.display = 'inline-block';
            code_accept_btn.addEventListener('click', function() {
                editor.clearSelection();
                prompt_input.value = '';
                generate_btn.disabled = false;
                generate_btn.style.display = 'inline-block';
                code_accept_btn.style.display = 'none';
                code_reject_btn.style.display = 'none';
            });
            code_reject_btn.addEventListener('click', function() {
                editor.setValue(code);
                editor.clearSelection();
                generate_btn.disabled = false;
                generate_btn.style.display = 'inline-block';
                code_accept_btn.style.display = 'none';
                code_reject_btn.style.display = 'none';
            });
        }
    }
}

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

var about = function(){
    var nav = document.getElementsByClassName('nav')[0];
    var logo = document.getElementById('logo');
    var extlinks = document.getElementById('extlinks');
    var template = document.getElementById('template');
    var poweredby = document.getElementById('poweredby');
    var about = document.getElementById('about');
    if (nav.style.height == '100vh') {
        // collapse
        nav.style.height = '100%';
        logo.style.float = 'left';
        logo.style.marginTop = '3px';
        nav.style.textAlign = 'left';
        extlinks.style.float = 'right';
        extlinks.style.textAlign = 'right';
        poweredby.style.justifyContent = 'flex-end';
        about.style.display = 'none';
    } else {
        // expand
        nav.style.height = '100vh';
        logo.style.float = 'none';
        logo.style.marginTop = '5vh';
        nav.style.textAlign = 'center';
        extlinks.style.float = 'none';
        extlinks.style.textAlign = 'center';
        poweredby.style.justifyContent = 'center';
        about.style.display = 'block';
    }
}

// Version
document.getElementById("version").innerHTML = version;