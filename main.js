// 更新库列表
var updatePkg = function(){
    var pkgstr = "";
    for(pkg in app.packages)
        pkgstr += app.packages[pkg];
    app.pkgstr = pkgstr;
};

// 库组件
Vue.component('lib',{
    template: '#libtpl',
    props: {
        id: Number,
        category: String,
        chname: String,
        libname: String,
    },
    data: function(){
        return {
            enabled: false,
        }
    },
    methods: {
        onlibchange: function(){
            if(this.enabled)
                app.packages[this.id] = "\\use" + this.category + "library{" + this.libname + "}\n";
            else delete app.packages[this.id];
            updatePkg();
        }
    },
});

// 系列表
var seriesList = new Array();
// 系列计数
var seriescnt = 0;

// 更新数据系列
var updateSeries = function(){
    app.series = "";
    app.legend = "";
    for(var s in seriesList){
        app.series += ' ' + seriesList[s][0] + '\n';
        app.legend += seriesList[s][1] + ',';
    }
};

// 系列公用属性
var seriesMixin = {
    created: function(){
        this.etd = app.td;
    },
    data: function(){
        return {
            etd: false,
            plus: false,
            cycle: false,
            param: "",
            legend: "",
            enabled: true,
        }
    },
    props: {
        id: Number,
    },
    methods:{
        deleteComp: function(){
            delete seriesList[this.id];
            updateSeries();
            this.enabled = false;
        },
        on_change: function(){
            this.updater(this.etd,this.plus,this.cycle);
        },
        ontdchange: function(){
            this.updater(!this.etd,this.plus,this.cycle);
        },
        onpchange: function(){
            this.updater(this.etd,!this.plus,this.cycle);
        },
        oncchange: function(){
            this.updater(this.etd,this.plus,!this.cycle);
        }
    }
};

// 缩小第一坐标的文本框宽度
Vue.directive('minimize',function(el,binding){
    if(binding.value){
        el.style.width = '40px';
        el.placeholder = 'x轴';
    } else {
        el.style.width = '80px';
        el.placeholder = '函数';
    }
});

var addexprClick = function(){
    app.expressions.push({
        id: ++seriescnt,
    });
};

var addcoordClick = function(){
    var cnt = app.coordinates.length;
    app.coordinates.push({
        id: ++seriescnt,
    });
};

var addtableClick = function(){
    var cnt = app.tableps.length;
    app.tableps.push({
        id: ++seriescnt,
    });
};

// 函数组件
Vue.component('expression',{
    mixins: [seriesMixin],
    template:'#exprtpl',
    data: function(){
        return {
            expression: "",
            expression2: "",
            expression3: "",
        }
    },
    methods:{
        updater: function(td,plus,cycle){
            if(!td)
                seriesList[this.id] = ["\\addplot" + (plus?"+":"") +" [" + this.param + "] {" + this.expression + "}" + (cycle?" \\closedcycle":"") + ";",this.legend];
            else if (this.expression=="" && this.expression2=="")
                seriesList[this.id] = ["\\addplot3" + (plus?"+":"") +" [" + this.param + "] {" + this.expression3 + "}" + (cycle?" \\closedcycle":"") + ";",this.legend];
            else
                seriesList[this.id] = ["\\addplot3" + (plus?"+":"") +" [" + this.param + "] ({" + this.expression + "},{" + this.expression2 + "},{" + this.expression3 + "})" + (cycle?" \\closedcycle":"") + ";", this.legend];
            updateSeries();
        },
    }
});

// 坐标组件
Vue.component('coordinate',{
    mixins: [seriesMixin],
    template:'#coordtpl',
    data: function() {
        return {
            data: "",
        }
    },
    methods:{
        updater: function(td,plus,cycle){
            seriesList[this.id] = [(td? ("\\addplot3" + (plus?"+":"") + " ["):("\\addplot"+ (plus?"+":"") +" [")) + this.param + "] coordinates {" + this.data + "}" + (cycle?" \\closedcycle":"") + ";",this.legend];
            updateSeries();
        }
    }
});

// 文件组件
Vue.component('tablep',{
    mixins: [seriesMixin],
    template: '#tableptpl',
    data: function() {
        return {
            fileName: "",
            datat: "",
            tableparam: "",
        }
    },
    methods:{
        updater: function(td,plus,cycle){
            seriesList[this.id] = [(td? ("\\addplot3" + (plus?"+":"") + " ["):("\\addplot"+ (plus?"+":"") +" [")) + this.param + "] table[row sep=crcr," + this.tableparam + "] {" + this.datat + "}" + (cycle?" \\closedcycle":"") + ";",this.legend];
            updateSeries();
        },
        readFile: function(e){
            var selectedFile = e.target.files[0];
            this.fileName = selectedFile.name;
            var reader = new FileReader();
            reader.readAsText(selectedFile);
            var that = this;
            reader.onload = function(){
                // 换行替换为双斜杠，制表符替换为空格
                // 适应 CRLF 和 LF 的替换环境
                that.datat = 
                    (this.result).replace(/[\r]/g,'')
                        .replace(/[\n]/g,'\\\\')
                        .replace(/[\t|,]/g,' ') + '\\\\';
                that.updater(that.etd,that.plus,that.cycle);
            };
        }
    }
});

// 参数字典
var paramDic = new Array();

var propMixins = {
    props: {
        chname: String,
        propkey: String
    },
    data: function(){
        return {
            value: "",
        }
    },
    methods:{
        on_change: function(){
            paramDic[this.propkey] = this.value;

            app.param = "";
            for(var key in paramDic)
                if(paramDic[key]!="")
                    app.param += key + "={" + paramDic[key] + "},\n";
            
        }
    }
};

Vue.component('propertyselect',{
    mixins: [propMixins],
    template:'#propertyselecttpl',
    props:{
        options: Array,
    },
});

// 属性组件
Vue.component('property',{
    mixins: [propMixins],
    template:'#propertytpl',
});

var s_premable = "\\documentclass[tikz]{standalone}\n\
\\usepackage{pgfplots}\n\
\\pgfplotsset{compat=1.14}\n";

var s_suffix = "\\end{document}";

chnClick = function(obj){
    if(obj.checked){
        app.packages[0] = "\\usepackage{CJKutf8}\n";
        app.e_premable = "\\begin{document}\n\\begin{CJK}{UTF8}{gbsn}\n";
        app.suffix = "\\end{CJK}\n" + s_suffix;
    } else {
        delete app.packages[0];
        app.e_premable = "\\begin{document}\n";
        app.suffix = s_suffix;
    }
    updatePkg();
};

var gomanual = function(){
    var mf = document.getElementById('manualfile');
    mf.innerHTML = app.file;
    mf.style.display = 'block';
    document.getElementById('settings').style.display = 'none';
    document.getElementById('auto').style.display = 'none';
    app.manual = true;
};

var app = new Vue({
    el: '#app',
    data:{
        td: false,
        enableLegend: false,
        manual: false,
        series: "",
        param: "",
        surplusparam: "",
        packages: ["\\usepackage{CJKutf8}\n"],
        pkgstr: "\\usepackage{CJKutf8}\n",
        e_premable: "\\begin{document}\n\\begin{CJK}{UTF8}{gbsn}\n",
        suffix: "\\end{CJK}\n" + s_suffix,
        curl:"",
        expressions:[],
        coordinates:[],
        tableps:[],
        legend: "",
    },
    computed:{
        premable: function(){
            return s_premable + this.pkgstr + this.e_premable;
        },
        content: function(){
            return "\\begin{tikzpicture}\n\\begin{axis}["+this.param + this.surplusparam +"]\n"
            + this.series
            + (this.enableLegend?" \\legend{" + this.legend +"}\n":"")
            + "\\end{axis}\n\\end{tikzpicture}\n";
        },
        file: function(){
            return this.premable + this.content + this.suffix;
        },
    },
    methods:{
        compile: function() {
            // +属于url保留符号，需要转义为%2B才可以使用。
            // 全局匹配
            if(!app.manual)
                app.curl = "https://latexonline.cc/compile?text="+this.file.replace(/[+]/g,"%2B");
            else
                app.curl = "https://latexonline.cc/compile?text="+document.getElementById('manualfile').value.replace(/[+]/g,"%2B");
        }
    }
});