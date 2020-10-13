Vue.component('expression',{
    template:'<tr><td>函数</td><td><input type="text" v-model="param" @keyup="on_change"></td><td><input type="text" v-model="expression" @keyup="on_change"></td></tr>',
    data: function(){
        return {
            param: "",
            expression: "",
        }
    },
    methods:{
        on_change: function(){
            if(!app.td)
                app.series = "\\addplot [" + this.param + "] {" + this.expression + "};";
            else
                app.series = "\\addplot3 [" + this.param + "] (" + this.expression + ");";
        },
    }
});

// 参数字典
var paramDic = new Array();

// 属性组件
Vue.component('property',{
    template:'<tr><td>{{chname}}</td><td>{{propkey}}</td><td><input type="text" v-model="value" @keyup="on_change"></td></tr>',
    props: ['chname','propkey'],
    data: function(){
        return {
            // type: "text",             //属性的数据类型
            value: "",                //属性的值
        }
    },
    methods:{
        on_change: function(){
            paramDic[this.propkey] = this.value;

            app.param = "";
            for(var key in paramDic)
                if(paramDic[key]!="")
                    app.param += key + "={" + paramDic[key] + "},";
            
        }
    }
});

var s_premable = "\\documentclass[tikz]{standalone}\n\
\\usepackage{pgfplots}\n\
\\usepackage{CJKutf8}\n\
\\pgfplotsset{compat=1.14}\n\
\\begin{document}\n";

var s_suffix = "\\end{document}";

chnClick = function(obj){
    if(obj.checked){
        app.premable = s_premable + "\\begin{CJK}{UTF8}{gbsn}\n";
        app.suffix = "\\end{CJK}\n" + s_suffix;
    } else {
        app.premable = s_premable;
        app.suffix = s_suffix;
    }
};

tdClick = function(){

};

var app = new Vue({
    el: '#app',
    data:{
        td: false,
        series: "",
        param: "",
        premable: s_premable + "\\begin{CJK}{UTF8}{gbsn}\n",
        suffix: "\\end{CJK}\n" + s_suffix,
        curl:"",
    },
    computed:{
        content: function(){
            return "\\begin{tikzpicture}\n\\begin{axis}["+this.param+"]\n "+this.series+"\n\\end{axis}\n\\end{tikzpicture}";
        },
        file: function(){
            return this.premable+this.content+this.suffix;
        },
    },
    methods:{
        compile: function() {
            // 清除换行无效符号
            app.curl = "https://latexonline.cc/compile?text="+this.file.replace(/[\r\n]/g,"");
        }
    }
});