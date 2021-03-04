// 采用 highlight.js 库
Vue.use(hljs.vuePlugin);

// 更新库列表
var updatePkg = function(){
    var pkgstr = "";
    for(pkg in app.packages)
        pkgstr += app.packages[pkg];
    app.pkgstr = pkgstr;
};

// 库更新事件
var libChangeEvent = new Vue();

// 库组件
Vue.component('lib',{
    template: '#libtpl',
    props: {
        id: Number,
        category: String,
        chname: String,
        libname: String,
        customized: String,
    },
    data: function(){
        return {
            enabled: false,
        }
    },
    methods: {
        onlibchange: function(){
            if(this.enabled){
                if(this.customized=="0")
                    app.packages[this.id] = "\\use" + this.category + "library{" + this.libname + "}\n";
                else app.packages[this.id] = "\\" + this.category + "{" + this.libname + "}\n";
                if(this.id==1)
                    for(var key in plotmarksDic)
                        sparamDic["mark"][1][key] = plotmarksDic[key];
                else if (this.id==2)
                    for(var key in colorbrewerDic)
                        colorDic[key] = colorbrewerDic[key];
                else if (this.id==4)
                    for(var key in statisticsDic)
                        sparamDic[key] = statisticsDic[key];
                else if (this.id==6)
                    app.enablepolar = true;
            }
            else{
                delete app.packages[this.id];
                if(this.id==1)
                    for(var key in plotmarksDic)
                        delete sparamDic["mark"][1][key];
                else if(this.id==2)
                    for(var key in colorbrewerDic)
                        delete colorDic[key];
                else if(this.id==4)
                    for(var key in statisticsDic)
                        delete sparamDic[key];
                else if(this.id==6){
                    if(app.axistype=="4")
                        app.axistype = "0";
                    app.enablepolar = false;
                }
            }
            updatePkg();
            if(this.id)
                libChangeEvent.$emit('lib-change');
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

var getUnwrappedCommand = function (_wrap_comm) {
    return _wrap_comm.replace(/<\/?.+?\/?>/g,'');
};

// ----------------------------------------------------------------------------
// Code from https://github.com/axismaps/colorbrewer/blob/master/colorbrewer.js

var hexToRgb = function(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ( (1 << 24) | (r << 16) | (g << 8) | b ).toString(16).slice(1);
}

//------------------------------------------------------------------------------

var getGradientColorCode = function (_begin,_mid,_end,_portion) {
    // if(_mid=""){
        var begin = hexToRgb(_begin);
        var end = hexToRgb(_end);
        // console.log(begin);
        var result = {
            r: begin["r"] + (end["r"]-begin["r"])*_portion,
            g: begin["g"] + (end["g"]-begin["g"])*_portion,
            b: begin["b"] + (end["b"]-begin["b"])*_portion,
        };
        return rgbToHex(result["r"],result["g"],result["b"]);
    // }
};

// 参数工具栏（子组件）
var parambar = Vue.component('parambar',{
    template: "#parambartpl",
    props:{
        command: String,
        etd: Boolean,
        global: Boolean,
    },
    data: function(){
        return {
            bestMatch:["no","no"],
            optionalCommands: (this.global ? globalparamDic : {}),
            matchedCommands: sparamDic,
            submenu: {},
            eq: false,
        }
    },
    mounted: function () {
        var me = this;
        this.refreshList(this.command);
        libChangeEvent.$on('lib-change',function () {
            me.refreshList(me.command);
        });
    },
    watch:{
        etd(_td){
            if(_td)
                for(var k in etdparamDic)
                    this.optionalCommands[k] = etdparamDic[k];
            else
                for(var k in etdparamDic)
                    delete this.optionalCommands[k];
            this.refreshList(this.command);
        },
        command(_command){
            this.refreshList(_command);
        },
    },
    methods:{
        refreshList: function(_command) {
            this.submenu = {};
            var eq = _command.indexOf('=');
            var highlightCommand = function (key,_command) {
                var begin = key.indexOf(_command);
                if(begin!=-1){
                    var end = begin + _command.length;
                    return key.substring(0,begin) + '<b>'
                    + key.substring(begin,end) + '</b>' 
                    + key.substring(end,key.length);
                }
                return _command;
            }
            if(eq!=-1){  // 先看有没有等号
                this.eq = true;
                var bm = this.bestMatch[0];
                var realbm = getUnwrappedCommand(bm);
                var me = this;
                var checkingSubDic = function (dic) {
                    for(var subkey in dic[realbm][1]){
                        var subcom = _command.substring(eq+1,_command.length);
                        if(subkey.indexOf(subcom)!=-1){
                            var subkeyDic = dic[realbm][1][subkey];
                            if(subcom.indexOf('-')!=-1 && subkeyDic[1]=='colormap'){ // 产生渐变命令
                                me.submenu = {};
                                if(subkeyDic[2][1]==""){
                                    var genKey = function (_ord) {
                                        return subkey + _ord;
                                    }
                                    var colormapDic = {};
                                    var MAXRANGE = 12;
                                    for(var i = 0; i<=MAXRANGE; ++i){
                                        colormapDic[genKey(String.fromCharCode(65+i))]=["","color",getGradientColorCode(subkeyDic[2][0],subkeyDic[2][1],subkeyDic[2][2],i*1.0/MAXRANGE)];
                                    }
                                }
                                me.submenu = colormapDic;
                            } 
                            else me.submenu[highlightCommand(subkey,subcom)] = subkeyDic;
                        }
                    }
                };
                if(getUnwrappedCommand(bm)==_command.substring(0,eq)){
                    if (this.optionalCommands.hasOwnProperty(realbm))
                        checkingSubDic(this.optionalCommands);
                    else if (sparamDic.hasOwnProperty(realbm))
                        checkingSubDic(sparamDic);
                }
                else this.bestMatch = ["no","no"];
            }
            else {      // 否则再刷新列表
                this.eq = false;
                this.matchedCommands = {};
                this.bestMatch = ["no","no"];
                var bestMatchNum = 1000;
                var me = this;
                var checkingDic = function (dic) {
                    for(var key in dic){
                        var begin = key.indexOf(_command);
                        if(begin!=-1){
                            var newkey = highlightCommand(key,_command);
                            me.matchedCommands[newkey] = dic[key];
                            var matchLeft = key.length - _command.length;
                            if(matchLeft<bestMatchNum){
                                var haseq = !(dic[key][1]==null);
                                me.bestMatch = [newkey,dic[key],haseq];
                                bestMatchNum = matchLeft;
                            }
                        }  
                    } 
                }
                checkingDic(this.optionalCommands);
                checkingDic(sparamDic);
                if(_command=='')
                    this.bestMatch=["no","no"];
                if(this.bestMatch!=["no","no"])
                    delete this.matchedCommands[this.bestMatch[0]];
            }
        }
    },
});

// 系列公用属性
var seriesMixin = {
    props: {
        id: Number,                 // Initial Value Only
        ontd: Boolean,
        onlegend: Boolean,
    },
    data: function(){
        return {
            idInner: this.id,       // Real ID
            etd: this.ontd,
            plus: false,
            cycle: false,
            param: "",
            legend: "",
            enabled: true,
            show: true,
            paramfoc: false,
            command:"",
            bestMatch:[],
        }
    },
    components:{
        parambar
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
        },
        param_focused: function(){
            this.paramfoc = true;
        },
        param_losefocus: function(){
            this.paramfoc = false;
        },
        onpachange: function(e){
            var index = this.param.lastIndexOf(',');
            if(e.key=='Enter'){         // 自动填充
                //得到最佳匹配
                var subbar = this.$refs.subparambar;
                var curBestMatch = subbar.bestMatch;
                if(curBestMatch[0]!="no"){
                    //替换 并确定是否需要等号
                    var replace_ = this.param.substring(0,index+1) + getUnwrappedCommand(curBestMatch[0]) + (curBestMatch[2]?"=":",");
                    var FirstSubKey = Object.keys(subbar.submenu)[0];
                    if(this.param.substring(index+1,this.param.length).indexOf('=')!=-1 && FirstSubKey)     // 子菜单自动填充
                        replace_ = replace_ + getUnwrappedCommand(FirstSubKey) + ',';
                    this.param = replace_;
                }
            }
            // 提取最后一个逗号后的command
            var comma = this.param.lastIndexOf(',');
            this.command = this.param.substring(comma+1,this.param.length).trim();          // 清除头尾空格
            this.on_change();
        },
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

// 颜色预览盒
Vue.component('colorbox',{
    template: '<div class="colorbox" :style="\'background-color:\' + color + \';\'">&nbsp;</div>',
    props:['color'],
});

// 渐变预览盒
Vue.component('colormapbox',{
    template:'<div class="colormapbox" :style="\'background-image: linear-gradient(to right, \' + colormap + \');\'">&nbsp;</div>',
    props:['colormap'],
})

// 增补参数组件
Vue.component('surplus',{
    mixins: [seriesMixin],
    template:'#surplustpl',
    props:['intd'],
    methods:{
        updater: function () {
            app.surplusparam = this.param;
        },
    },
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

// 坐标数据工具栏（子组件）
Vue.component('coordbar',{
    template: "#coordbartpl",
});

// 坐标组件
Vue.component('coordinate',{
    mixins: [seriesMixin],
    template:'#coordtpl',
    data: function() {
        return {
            data: "",
            coordbar:false,
        }
    },
    methods:{
        updater: function(){
            seriesList[this.idInner] = [(this.etd? ("\\addplot3" + (this.plus?"+":"") + " ["):("\\addplot"+ (this.plus?"+":"") +" [")) + this.param + "] coordinates {" + this.data + "}" + (this.cycle?" \\closedcycle":"") + ";",this.legend,this.show,false];
            updateSeries();
        },
        coord_focused: function(){
            this.coordbar = true;
        },
        coord_losefocus: function(){
            this.coordbar = false;
        }
    }
});

Vue.component('tableparambar',{
    template: '#tableparamtpl',
});

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
            sourceList[this.idInner] = [" \\pgfplotstableread [row sep=crcr] {" + this.datat + "}{\\" + this.sourceName + "};",this.show];
            this.$forceUpdate();
            updateSeries();
        },
        readFile: readFile,
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
            tableparambar:false,
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
            seriesList[this.idInner] = [(this.etd? ("\\addplot3" + (this.plus?"+":"") + " ["):("\\addplot"+ (this.plus?"+":"") +" [")) + this.param + "] table[" + (this.sourceSelect=="..." ? "row sep=crcr," : "") + this.tableparam + "] {" + (this.sourceSelect=="..." ? this.datat : "\\" + this.sourceSelect) + "}" + (this.cycle?" \\closedcycle":"") + ";",this.legend,this.show,false];
            updateSeries();
        },
        readFile: readFile,
        tableparam_focused: function(){
            this.tableparambar = true;
        },
        tableparam_losefocus: function(){
            this.tableparambar = false;
        }
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
    document.getElementById('panel-vtwo').style.display = 'none';
    document.getElementById('panel-three').style.width = '0px';
    document.getElementById('panel-two').style.width = window.innerWidth - document.getElementById('panel-one').style.width;
    document.getElementById('compilePrev').style.height = '430px';
    app.manual = true;
    // Split(['#panel-one','#panel-two']);
};

const t_premable = "\\begin{tikzpicture}\n"

const tp_premable = "\\begin{tikzpicture}\n\\tikzset{\n every pin/.style={fill=yellow!50!white,rectangle,rounded corners=3pt,font=\\tiny},\n small dot/.style={fill=black,circle,scale=0.3},\n}\n"

var app = new Vue({
    el: '#app',
    data:{
        td: false,
        enableLegend: false,
        enablepin: false,
        enablesource: false,
        enablepolar: false,
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
        axistype: "0",
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
        content: function(){    // TODO: dynamic cursor here
            var axistypename;
            switch(this.axistype){
                case "0": axistypename = "axis"; break;
                case "1": axistypename = "semilogxaxis"; break;
                case "2": axistypename = "semilogyaxis"; break;
                case "3": axistypename = "loglogaxis"; break;
                case "4": axistypename = "polaraxis";
                break;
            }
            return (this.enablepin ? tp_premable : t_premable)
            + "\\begin{" + axistypename + "}["
            + this.param + this.surplusparam +"]\n"
            + this.series
            + (this.enableLegend?" \\legend{" + this.legend +"}\n":"")
            + "\\end{"+ axistypename + "}\n\\end{tikzpicture}\n";
        },
        file: function(){
            return this.premable + this.content + this.suffix;
        },
    },
    methods:{
        // sortById: function(array) {
        //     return array.sort((a,b) => a.innerId - b.innerId);
        // },
        hintDrawCode: function () { hintCode("#texContent"); },
        blurDrawCode: function () { blurCode("#texContent") },
        hintAllCode: function () { hintCode("#texAllCode"); },
        warnAllCode: function () { warnCode("#texAllCode"); },
        blurAllCode: function () { blurCode("#texAllCode") },
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