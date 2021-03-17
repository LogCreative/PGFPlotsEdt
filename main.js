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
                switch(this.id){
                    case 1:
                        for(var key in plotmarksDic)
                            sparamDic["mark"][1][key] = plotmarksDic[key];
                        break;
                    case 2:
                        for(var key in colorbrewerDic){
                            colorDic[key] = colorbrewerDic[key];
                            keyp = key.substring(0,key.length-1);
                            globalparamDic["colormap/"][1][keyp] = colorbrewerDic[key];
                        }
                        break;
                    case 3:
                        for(var key in colormapsDic)
                            globalparamDic["colormap/"][1][key] = colormapsDic[key];
                        break;
                    case 4:
                        for(var key in statisticsDic)
                            sparamDic[key] = statisticsDic[key];
                        break;
                    case 6:
                        app.enablepolar = true;
                        break;
                }
            }
            else{
                delete app.packages[this.id];
                switch(this.id){
                    case 1:
                        for(var key in plotmarksDic)
                            delete sparamDic["mark"][1][key];
                        break;
                    case 2:
                        for(var key in colorbrewerDic){
                            delete colorDic[key];
                            keyp = key.substring(0,key.length-1);
                            delete globalparamDic["colormap/"][1][keyp];
                        }
                        break;
                    case 3:
                        for(var key in colormapsDic)
                            delete globalparamDic["colormap/"][1][key];
                        break;
                    case 4:
                        for(var key in statisticsDic)
                            delete sparamDic[key];
                        break;
                    case 6:
                        if(app.axistype=="4")
                            app.axistype = "0";
                        app.enablepolar = false;
                        break;
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
        this.refresh3D(this.etd);
        libChangeEvent.$on('lib-change',function () {
            me.refreshList(me.command);
        });
    },
    watch:{
        etd(_td){
           this.refresh3D(_td);
        },
        command(_command){
            this.refreshList(_command);
        },
    },
    methods:{
        refresh3D: function(_td) {
            if(_td)
                for(var k in etdparamDic)
                    this.optionalCommands[k] = etdparamDic[k];
            else
                for(var k in etdparamDic)
                    delete this.optionalCommands[k];
            this.refreshList(this.command);
        },
        refreshList: function(_command) {
            this.submenu = {};
            var eq = _command.indexOf('=');
            var slash = _command.indexOf('/');
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
            if(eq!=-1 || slash!=-1){  // 先看有没有等号或/号
                this.eq = true;
                var bm = this.bestMatch[0];
                var realbm = getUnwrappedCommand(bm);
                var me = this;
                var checkingSubDic = function (dic) {
                    var colormapMenu = false;
                    var dliin = (eq!=-1?eq:slash)+1;
                    for(var subkey in dic[realbm][1]){
                        var subcom = _command.substring(dliin,_command.length);
                        var barIndex = subcom.indexOf('-');
                        if((barIndex != -1 && subkey.indexOf(subcom.substring(0,barIndex+1)) != -1) || subkey.indexOf(subcom)!=-1){
                            var subkeyDic = dic[realbm][1][subkey];
                            if(barIndex!=-1 && subkeyDic[1]=='colormap' && subcom.substring(0,barIndex+1)==subkey){ // 产生渐变命令
                                colormapMenu = true;
                                me.submenu = {};
                                var colorVector = subkeyDic[2].split(",");
                                if(barIndex==subcom.length-1){
                                    for(var i = 0; i < colorVector.length; ++i)
                                        me.submenu["<b>" + subkey + "</b>" +  String.fromCharCode(65+i)] = ["","color",colorVector[i]];
                                } else {
                                    var subChar = subcom.substring(barIndex+1,subcom.length);
                                    for(var i = 0; i < colorVector.length; ++i){
                                        if(subChar == String.fromCharCode(65+i))
                                            me.submenu['<b>' + subkey + String.fromCharCode(65+i) + '</b>'] = ["","color",colorVector[i]];
                                    }
                                }
                            } 
                            else if (!colormapMenu) me.submenu[highlightCommand(subkey,subcom)] = subkeyDic;
                        }
                    }
                };
                var dli = (eq!=-1?eq:slash+1);
                if(getUnwrappedCommand(bm)==_command.substring(0,dli)){
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
                    var uncum = getUnwrappedCommand(curBestMatch[0]);
                    var replace_ = this.param.substring(0,index+1) + uncum + (uncum.charAt(uncum.length-1)=='/'?'':(curBestMatch[2]?"=":","));
                    if(curBestMatch[2])
                        curBestMatch[0] = '<b>' + uncum + '</b>';
                    var FirstSubKey = Object.keys(subbar.submenu)[0];
                    var _command = this.param.substring(index+1,this.param.length);
                    if((_command.indexOf('=')!=-1 || _command.indexOf('/')!=-1) && FirstSubKey)     // 子菜单自动填充
                        replace_ = replace_ + getUnwrappedCommand(FirstSubKey) + (FirstSubKey.charAt(FirstSubKey.length-1)=='-'?'':',');
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
    props: ["cdata"],
    data: function() {
        return {
            shown: false,
            addtext: "",
            icdata: this.cdata,
        }
    },
    methods:{
        close: function () {
            this.$parent.cdata = this.icdata;
            this.$parent.shown = false;
        },
        addcoord: function (e) {
            var me = this;
            var appender = function () {
                me.icdata += " " + me.addtext.replace(/(\S+)\s+(\S+)/," ($1,$2)").replace(/\s+/g,"");
                me.addtext = "";
            };
            if(e.key=='Enter')
                appender();
            else if(e.key==' '){
                var matches = /(\S+)\s+(\S+)/.exec(this.addtext);
                if(matches!=null&&matches[1]!=null&&matches[2]!=null)
                    appender();
            }
        },
        sort: function () {
            var _cdata = this.icdata;
            var brareg = /\(\S+,\S+\)/g;
            var coordsarray = [];
            while((coord=brareg.exec(_cdata))!=null){
                var coorreg = /\((\S+),(\S+)\)/;
                var coords = coorreg.exec(coord);
                coordsarray.push([coords[1],coords[2]]);
            }
            coordsarray.sort((a,b)=>a[0] - b[0]);
            var cdata_ = "";
            for(var i in coordsarray)
                cdata_ += " (" + coordsarray[i][0] + "," + coordsarray[i][1] + ")";
            this.icdata = cdata_;
        },
    }
});

// 坐标组件
Vue.component('coordinate',{
    mixins: [seriesMixin],
    template:'#coordtpl',
    data: function() {
        return {
            prevdata: "",
            cdata: "",               // 可以被坐标数据工具栏改变
            shown: false,
        }
    },
    watch:{
        cdata(){
            this.updater();
        }
    },
    methods:{
        updater: function(){
            seriesList[this.idInner] = [(this.etd? ("\\addplot3" + (this.plus?"+":"") + " ["):("\\addplot"+ (this.plus?"+":"") +" [")) + this.param + "] coordinates {" + this.cdata + "}" + (this.cycle?" \\closedcycle":"") + ";",this.legend,this.show,false];
            updateSeries();
        },
        coord_focused: function(){
            this.prevdata = this.cdata;
            this.shown = true;
        }, 
        coord_losefocus: function() {
            // if (this.prevdata==this.data)
            //     this.$refs.subcoordbar.shown = false;
        },
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

// 标题组件
Vue.component('titleproperty',{
    mixins: [propMixins],
    template:'#titletpl',
    methods:{
        ontichange: function () {
            if(this.value=="")
                document.title = default_title;
            else
                document.title = this.value;
            this.on_change();
        }
    }
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
        dc_content: "",
    },
    // mounted: function() {
    //     var me = this;
    //     SortEvent.$on('sort-event', function(cate){
    //         me.expressions.sort((a,b)=> a.innerId - b.innerId);
            
    //         console.log(cate);
    //     });
    // },
    mounted:function (){
        this.dc_content = this.content;
    },
    watch:{
        content(_new,_old){
            var maxlength = _new.length>_old.length?_old.length:_new.length;
            for(var i = 0; i < maxlength; ++i){
                if(_new[i]!=_old[i]){
                    var split;
                    var cursor;
                    if(_new.length>_old.length){
                        split = i+1;
                        cursor = '▮';
                    } else {
                        split = i;
                        cursor = '▯';
                    }
                    this.dc_content = _new.substring(0,split) + cursor + _new.substring(split,_new.length);
                    break;
                }
            }
            setSpliterHeight();
        },
    },
    computed:{
        // sortedExpressions: function(){
        //     return this.sortById(this.expressions);
        // },
        premable: function(){
            return s_premable + this.pkgstr + this.e_premable;
        },
        content: function(){
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
        hintDrawCode: function () { this.dc_content = this.content; hintCode("#texContent"); },
        blurDrawCode: function () { blurCode("#texContent") },
        hintAllCode: function () { this.dc_content = this.content; hintCode("#texAllCode"); },
        warnAllCode: function () { this.dc_content = this.content; warnCode("#texAllCode"); },
        blurAllCode: function () { blurCode("#texAllCode") },
        // drawHover: function () { this.dc_content = this.content; },
        compile: function() {
            // +属于url保留符号，需要转义为%2B才可以使用。
            // 全局匹配
            if(!app.manual)
                app.curl = "https://latexonline.cc/compile?text="+this.file.replace(/[+]/g,"%2B");
            else
                app.curl = "https://latexonline.cc/compile?command=lualatex&text="+document.getElementById('manualfile').value.replace(/[+]/g,"%2B");
        }
    },
});