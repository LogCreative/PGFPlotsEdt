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

    if(app.enablesource)
        for(var s in sourceList)
            if(sourceList[s][1])
                app.series += sourceList[s][0] + '\n';

    for(var s in seriesList){
        if (seriesList[s][2]==true &&                       // 显示
            (seriesList[s][3]==false || app.enablepin))     // 标注特集
            app.series += ' ' + seriesList[s][0] + '\n';
        if(seriesList[s][1]!=false){                        // 是否有图例
            app.legend += seriesList[s][1] + ',';
        }
    }
};

// 系列公用属性
var seriesMixin = {
    created: function(){
        this.etd = app.td;
    },
    data: function(){
        return {
            idInner: this.id,       // Real ID
            etd: false,
            plus: false,
            cycle: false,
            param: "",
            legend: "",
            enabled: true,
            show: true,
        }
    },
    props: {
        id: Number,                 // Initial Value Only
        ontd: Boolean,
        onlegend: Boolean,
    },
    methods:{
        moveUp: function(){
            delete seriesList[this.idInner];
            this.idInner = ++seriescnt;
            // this.sortUpdater();
            this.on_change();
        },
        deleteComp: function(){
            delete seriesList[this.idInner];
            updateSeries();
            this.enabled = false;
        },
        on_change: function(){
            this.updater();
        },
        onschange: function(){
            this.show = !this.show;
            this.on_change();
            this.show = !this.show;
        },
        ontdchange: function(){
            this.etd = !this.etd;
            this.on_change();
            this.etd = !this.etd;
        },
        onpchange: function(){
            this.plus = !this.plus;
            this.on_change();
            this.plus = !this.plus;
        },
        oncchange: function(){
            this.cycle = !this.cycle;
            this.on_change();
            this.cycle = !this.cycle;
        }
    },
    filters:{
        addZero(value){
            if(typeof value != 'number')
                return '';
            
            if(value<10)
                return "0" + value;
            else return "" + value;
        },
    }
};

// 数据源名表
var sourceNameList = ['...'];
// 数据源表
var sourceList = new Array();
// 数据源计数
var sourcecnt = 0;

var addsourceClick = function(){
    app.sources.push({
        id: ++sourcecnt,
    });
};

var addexprClick = function(){
    app.expressions.push({
        id: ++seriescnt,
    });
};

var addcoordClick = function(){
    app.coordinates.push({
        id: ++seriescnt,
    });
};

var addtableClick = function(){
    app.tableps.push({
        id: ++seriescnt,
    });
};

var addnodeClick = function(){
    app.nodeps.push({
        id: ++seriescnt,
    });
};

// 排序更新事件
// var SortEvent = new Vue();

// 数据源更新事件
var SourceUpdateEvent = new Vue();

// 读文件
var readFile = function(e){
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
        that.updater();
    };
};

// 数据源组件
Vue.component('Tsource',{
    mixins: [seriesMixin],
    template:'#sourcetpl',
    data: function() {
        return {
            sourceName: "",
            fileName: "",
            datat: "",
            tableparam: "",
        }
    },
    methods:{
        moveUp: function(){
            delete sourceList[this.idInner];
            delete sourceNameList[this.idInner];
            this.idInner = ++sourcecnt;
            // this.sortUpdater();
            this.on_change();
        },
        deleteCommon: function(){
            SourceUpdateEvent.$emit('source-deleted',sourceNameList[this.idInner]);
            delete sourceList[this.idInner];
            delete sourceNameList[this.idInner];
            updateSeries();
        },
        deleteComp: function(){                 // 覆盖父类函数
            this.deleteCommon();
            this.enabled = false;
        },
        on_change: function(){
            SourceUpdateEvent.$emit('source-name-change',sourceNameList,this.idInner);
            this.updater();
        },
        onschange: function(){
            this.show = !this.show;
            this.on_change();
            if(this.show)
                sourceNameList[this.idInner] = this.sourceName;
            else
                this.deleteCommon();
            this.show = !this.show;
        },
        updater: function(){
            sourceNameList[this.idInner] = this.sourceName;
            sourceList[this.idInner] = [" \\pgfplotstableread [row sep=crcr] {" + this.datat + "}{\\" + this.sourceName + "}",this.show];
            this.$forceUpdate();
            updateSeries();
        },
        readFile: readFile,
    }
});

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
        updater: function(){
            if(!this.etd)
                seriesList[this.idInner] = ["\\addplot" + (this.plus?"+":"") +" [" + this.param + "] {" + this.expression + "}" + (this.cycle?" \\closedcycle":"") + ";",this.legend,this.show,false];
            else if (this.expression=="" && this.expression2=="")
                seriesList[this.idInner] = ["\\addplot3" + (this.plus?"+":"") +" [" + this.param + "] {" + this.expression3 + "}" + (this.cycle?" \\closedcycle":"") + ";",this.legend,this.show,false];
            else
                seriesList[this.idInner] = ["\\addplot3" + (this.plus?"+":"") +" [" + this.param + "] ({" + this.expression + "},{" + this.expression2 + "},{" + this.expression3 + "})" + (this.cycle?" \\closedcycle":"") + ";", this.legend,this.show,false];
            updateSeries();
        },
        // sortUpdater: function(){
        //     this.updater(this.td,this.plus,this.cycle);
        //     SortEvent.$emit('sort-event',this.$options.name)
        //     // expressions.sort((a,b) => a.idInner - b.idInner)
        // }
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
        updater: function(){
            seriesList[this.idInner] = [(this.etd? ("\\addplot3" + (this.plus?"+":"") + " ["):("\\addplot"+ (this.plus?"+":"") +" [")) + this.param + "] coordinates {" + this.data + "}" + (this.cycle?" \\closedcycle":"") + ";",this.legend,this.show,false];
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
            sourceNameList: sourceNameList,
            sourceSelect: "...",
            fileName: "",
            datat: "",
            tableparam: "",
            ind: 0,
        }
    },
    props:{
        enablesource: Boolean,
    },
    mounted: function() {
        me = this;
        var clearSelect = function(){
            me.sourceSelect="...";
            me.updater();
        };
        SourceUpdateEvent.$on('source-name-change',function(molist,id){
            if(me.sourceSelect==molist[id])
                clearSelect();
            me.$set(me.sourceNameList,molist);
        });
        SourceUpdateEvent.$on('source-deleted',function(obj){
            if(me.sourceSelect==obj)
                clearSelect();
        });
        SourceUpdateEvent.$on('source-disabled',function(obj){
            if(!obj)
                clearSelect();
        });
    },
    methods:{
        // refreshList: function(){         // refresh is so slow.
        //     this.$set(this.sourceNameList, sourceNameList);
        // },
        on_change: function(){
            if(this.sourceSelect==null)
                this.sourceSelect="...";
            this.updater();
        },
        updater: function(){
            console.log(this.sourceSelect);
            seriesList[this.idInner] = [(this.etd? ("\\addplot3" + (this.plus?"+":"") + " ["):("\\addplot"+ (this.plus?"+":"") +" [")) + this.param + "] table[" + (this.sourceSelect=="..." ? "row sep=crcr," : "") + this.tableparam + "] {" + (this.sourceSelect=="..." ? this.datat : "\\" + this.sourceSelect) + "}" + (this.cycle?" \\closedcycle":"") + ";",this.legend,this.show,false];
            updateSeries();
        },
        readFile: readFile,
    }
});

// 标注组件
Vue.component('node',{
    mixins: [seriesMixin],
    template:'#nodetpl',
    data: function() {
        return {
            pin: "",
            pos: "",
        }
    },
    methods:{
        updater: function(){
            if(this.etd)
                seriesList[this.idInner] = ["\\node [small dot,pin=" + this.param + ":{" + this.pin + "}] at (axis description cs:" + this.pos + ") {};",false,this.show,true]; 
            else seriesList[this.idInner] = ["\\node [font=\\tiny] at (axis description cs:" + this.pos + ") {" + this.pin + "};",false,this.show,true]; 
            updateSeries();
        },
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

// 属性选择器
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

pinClick = function(obj){
    app.enablepin = !app.enablepin;
    updateSeries();
    app.enablepin = !app.enablepin;
}

sourceClick = function(obj){
    app.enablesource = !app.enablesource;
    updateSeries();
    SourceUpdateEvent.$emit('source-disabled',app.enablesource);
    app.enablesource = !app.enablesource;
}

var gomanual = function(){
    var mf = document.getElementById('manualfile');
    mf.innerHTML = app.file;
    mf.style.display = 'block';
    document.getElementById('settings').style.display = 'none';
    document.getElementById('auto').style.display = 'none';
    app.manual = true;
    // Split(['#panel-one','#panel-two']);
};

const t_premable = "\\begin{tikzpicture}\n\\begin{axis}["

const tp_premable = "\\begin{tikzpicture}\n\\tikzset{\n every pin/.style={fill=yellow!50!white,rectangle,rounded corners=3pt,font=\\tiny},\n small dot/.style={fill=black,circle,scale=0.3},\n}\n\\begin{axis}["

var app = new Vue({
    el: '#app',
    data:{
        td: false,
        enableLegend: true,
        enablepin: false,
        enablesource: true,
        manual: false,
        series: "",
        param: "",
        surplusparam: "",
        packages: ["\\usepackage{CJKutf8}\n"],
        pkgstr: "\\usepackage{CJKutf8}\n",
        e_premable: "\\begin{document}\n\\begin{CJK}{UTF8}{gbsn}\n",
        suffix: "\\end{CJK}\n" + s_suffix,
        curl:"",
        sources:[],
        expressions:[],
        coordinates:[],
        tableps:[],
        nodeps:[],
        legend: "",
    },
    // mounted: function() {
    //     var me = this;
    //     SortEvent.$on('sort-event', function(cate){
    //         me.expressions.sort((a,b)=> a.innerId - b.innerId);
            
    //         console.log(cate);
    //     });
    // },
    computed:{
        // sortedExpressions: function(){
        //     return this.sortById(this.expressions);
        // },
        premable: function(){
            return s_premable + this.pkgstr + this.e_premable;
        },
        content: function(){
            return (this.enablepin ? tp_premable : t_premable) 
            + this.param + this.surplusparam +"]\n"
            + this.series
            + (this.enableLegend?" \\legend{" + this.legend +"}\n":"")
            + "\\end{axis}\n\\end{tikzpicture}\n";
        },
        file: function(){
            return this.premable + this.content + this.suffix;
        },
    },
    methods:{
        // sortById: function(array) {
        //     return array.sort((a,b) => a.innerId - b.innerId);
        // },
        compile: function() {
            // +属于url保留符号，需要转义为%2B才可以使用。
            // 全局匹配
            if(!app.manual)
                app.curl = "https://latexonline.cc/compile?text="+this.file.replace(/[+]/g,"%2B");
            else
                app.curl = "https://latexonline.cc/compile?text="+document.getElementById('manualfile').value.replace(/[+]/g,"%2B");
        }
    },
});