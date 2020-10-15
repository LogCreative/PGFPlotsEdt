var seriesList = new Array();

var addClick = function(){
    var cnt = app.comps.length;
    app.comps.push({
        id: ++cnt,
    });
};

// 更新数据系列
var updateSeries = function(){
    app.series = "";
    for(var s in seriesList)
        app.series += ' ' + seriesList[s] + '\n';
};

// 系列公用属性
var seriesMixin = {
    data: function(){
        return {
            etd: false,
            param: "",
        }
    },
    props: {
        id: Number,
    },
    methods:{
        on_change: function(){
            this.updater(this.etd);
        },
        ontdchange: function(){
            this.updater(!this.etd);
        }
    }
};

// 缩小第一坐标的文本框宽度
Vue.directive('minimize',function(el,binding){
    if(binding.value){
        el.style.width = '40px';
        el.placeholder = 'x轴';
    } else {
        el.style.width = '120px';
        el.placeholder = '函数';
    }
});

// 函数组件
Vue.component('expression',{
    mixins: [seriesMixin],
    template:'<div><td class="type">函数</td><td><input type="checkbox" class="td" @click="ontdchange" v-model="etd" >3D</td><td><input type="text" class="param" placeholder="参数" v-model="param" @keyup="on_change"></td><td><input type="text" class="coord" placeholder="函数" v-model="expression" @keyup="on_change" v-minimize="etd"></td><td v-show="etd"><input type="text" class="coord2" placeholder="y轴" v-model="expression2" @keyup="on_change"></td><td v-show="etd"><input type="text" v-model="expression3" class="coord3" placeholder="z轴" @keyup="on_change"></td></div>',
    data: function(){
        return {
            expression: "",
            expression2: "",
            expression3: "",
        }
    },
    methods:{
        updater: function(td){
            if(td) seriesList[this.id] = "\\addplot3 [" + this.param + "] ({" + this.expression + "},{" + this.expression2 + "},{" + this.expression3 + "});";
            else seriesList[this.id] = "\\addplot [" + this.param + "] {" + this.expression + "};";
            updateSeries();
        },
    }
});

// 坐标组件
Vue.component('coordinates',{
    mixins: [seriesMixin],
    template:'<tr><td class="type">坐标</td><td><input type="checkbox" class="td" @click="ontdchange" v-model="etd" >3D</td><td><input type="text" class="param" v-model="param" @keyup="on_change" placeholder="参数"></td><td><input type="text" class="coord" v-model="data" @keyup="on_change" placeholder="坐标数据"></td></tr>',
    data: function() {
        return {
            data: "",
        }
    },
    methods:{
        updater: function(td){
            seriesList[this.id] = (td?"\\addplot3 [":"\\addplot [") + this.param + "] coordinates {" + this.data + "};";
            updateSeries();
        }
    }
});

// 文件组件
Vue.component('tablep',{
    mixins: [seriesMixin],
    template: '<tr><td class="type">文件</td><td><input type="checkbox" class="td" @click="ontdchange" v-model="etd">3D</td><td><input type="text" class="param" v-model="param" @keyup="on_change" placeholder="参数"></td><td><input type="text" class="coord" v-model="datat" @keyup="on_change" placeholder="数据表"></td></tr>',
    data: function() {
        return {
            datat: "",
        }
    },
    methods:{
        updater: function(td){
            seriesList[this.id] = (td?"\\addplot3 [":"\\addplot [") + this.param + "] table {" + this.datat + "};";
            updateSeries();
        }
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

var app = new Vue({
    el: '#app',
    data:{
        td: false,
        series: "",
        param: "",
        premable: s_premable + "\\begin{CJK}{UTF8}{gbsn}\n",
        suffix: "\\end{CJK}\n" + s_suffix,
        curl:"",
        comps:[],
    },
    computed:{
        content: function(){
            return "\\begin{tikzpicture}\n\\begin{axis}["+this.param+"]\n"+this.series+"\\end{axis}\n\\end{tikzpicture}";
        },
        file: function(){
            return this.premable+this.content+this.suffix;
        },
    },
    methods:{
        compile: function() {
            // +属于url保留符号，需要转义为%2B才可以使用。
            app.curl = "https://latexonline.cc/compile?text="+this.file.replace("+","%2B");
        }
    }
});