Vue.component('property',{
    template:'<tr><td>{{chname}}</td><td>{{propkey}}</td><td><input :type="type" v-model="value" @keyup="on_change"></td></tr>',
    props: ['chname','propkey'],
    data: function(){
        return {
            type: "text",             //属性的数据类型
            value: "",         //属性的值
        }
    },
    computed:{
        paramString: function(){
            return this.propkey + "={" + this.value + "},";
        }
    },
    methods:{
        on_change: function(){
            if(this.value!="")
                app.param = this.paramString;
            else
                app.param = "";
        }
    }
});

var app = new Vue({
    el: '#app',
    data:{
        series: "",
        param: "",
        premable:"\\documentclass[tikz]{standalone}\n\
\\usepackage{pgfplots}\n\
\\pgfplotsset{compat=1.14}\n\
\\begin{document}\n\
\\begin{tikzpicture}",
        suffix:"\\end{tikzpicture}\n\
\\end{document}",
        curl:"",
    },
    computed:{
        content: function(){
            return "\\begin{axis}["+this.param+"]\n "+this.series+"\n\\end{axis}";
        },
        file: function(){
            return this.premable+this.content+this.suffix;
        },
    },
    methods:{
        onFunctionEnter: function(){
            app.series = "Funtion";
        },
        onFunctionLeave: function() {
            app.series = "";
        },
        onPlotEnter: function() {
            app.series = "Plot";
        },
        onPlotLeave: function() {
            app.series = "";
        },
        compile: function() {
            // 清除换行无效符号
            app.curl = "https://latexonline.cc/compile?text="+this.file.replace(/[\r\n]/g,"");
        }
    }
});