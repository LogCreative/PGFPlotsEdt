// 国际化
var i18n = new VueI18n({
    locale: in_lang,
    messages:{
        cn: cn,
        en: en
    }
});

// Use JSON
// i18n.cn = fetch('lang/cn.json').then(res=>res.json()).then(data=>{
//     i18n.setLocaleMessage('cn',Object.assign(data));
// });
// i18n.en = fetch('lang/en.json').then(res=>res.json()).then(data=>{
//     i18n.setLocaleMessage('en',Object.assign(data));
// });

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
                        globalparamDic["cycle list/"] = cyclelist_default;
                        for(var key in colorbrewerDic){
                            colorDic[key] = colorbrewerDic[key];
                            globalparamDic["colormap/"][1][key] = colorbrewerDic[key];
                            globalparamDic["cycle list/"][1][key] = colorbrewerDic[key];
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
                            delete globalparamDic["colormap/"][1][key];
                            delete globalparamDic["cycle list/"][1][key];
                        }
                        delete globalparamDic["cycle list/"];
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
            optionalCommands: this.global?globalparamDic:{},
            matchedCommands: sparamDic,
            submenu: {},
            eq: false,
        }
    },
    mounted: function () {
        var me = this;
        this.refresh3D(this.etd);
        libChangeEvent.$on('lib-change',function () {
            if(me.global) me.optionalCommands = globalparamDic; // Force update
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
                if(this.global && globalparamDic.hasOwnProperty("cycle list/") && _command=="cycle list/")         // FIXME: 手动覆写，因为 cycle list 和 cycle list/ 重复
                    this.bestMatch = ["<b>cycle list</b>/",globalparamDic["cycle list/"],true];
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
                                var subChar = subcom.substring(barIndex+1,subcom.length);
                                if(slash!=-1){
                                    var maxt;
                                    switch(subkeyDic[3]){
                                        case 'seq': maxt = 9; break;
                                        case 'div': maxt = 11;break;
                                        case 'qual': maxt = subkeyDic[4];break;
                                    }

                                    var generateColors = function(indexArray) {
                                        var colors = [];
                                        for(var i in indexArray)
                                            colors.push(colorVector[indexArray[i]]);
                                        return colors;
                                    }

                                    for(var i = 3; i <= maxt; ++i){
                                        if(barIndex==subcom.length-1)
                                            me.submenu["<b>" + subkey + "</b>" + i] = ["","colors",generateColors(colorbrewerArrayDic[subkeyDic[3]][i])];
                                        else if(subChar == i)
                                            me.submenu['<b>' + subkey + i + '</b>'] = ["","colors",generateColors(colorbrewerArrayDic[subkeyDic[3]][i])];
                                    }

                                    var suplk = "";
                                    if(barIndex==subcom.length-1) suplk = "<b>" + subkey + "</b>" + "CM";
                                    else if(subChar=="C") suplk = "<b>" + subkey + "C</b>" + "M";
                                    else if(subChar=="CM") suplk = "<b>" + subkey + "CM</b>";
                                    if(suplk!=""){
                                        var indexArray = [];
                                        for(var i = 0; i<=maxt; ++i)
                                            indexArray.push(i);
                                        me.submenu[suplk] = ["","colors",generateColors(indexArray)];
                                    }
                                }
                                else{
                                    for(var i = 0; i < colorVector.length; ++i){
                                        if(barIndex==subcom.length-1)
                                            me.submenu["<b>" + subkey + "</b>" +  String.fromCharCode(65+i)] = ["","color",colorVector[i]];
                                        else if(subChar == String.fromCharCode(65+i))
                                            me.submenu['<b>' + subkey + String.fromCharCode(65+i) + '</b>'] = ["","color",colorVector[i]];
                                    }
                                }
                            } 
                            else if (!colormapMenu)
                                me.submenu[highlightCommand(subkey,subcom)] = subkeyDic;
                        }
                    }
                    var FirstSubKey = Object.keys(me.submenu)[0];
                    if(FirstSubKey){
                        FirstSubKey = getUnwrappedCommand(FirstSubKey);
                        if(dic[realbm][1][FirstSubKey] && dic[realbm][1][FirstSubKey][1]=='url')
                            app.purl = 'res/' + dic[realbm][1][FirstSubKey][2];
                        else app.purl = '';
                    }
                };
                var dli = (eq!=-1?eq:slash+1);
                if(realbm==_command.substring(0,dli)){
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
                if(app) app.purl="";
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
        inparam: String,
        indata: String,  
        instruct: Array,         
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
    mounted: function (){
        if(this.inparam)
            this.param = this.inparam;
        if(this.instruct){
            for(var k in this.instruct){
                switch(this.instruct[k]){
                    case 'td': 
                        this.etd = true; 
                        app.td = true; 
                        break;
                    case 'cycle': 
                        this.cycle = true; 
                        break;
                    case 'statistics': 
                        app.packages[4] = "\\usepgfplotslibrary{statistics}\n"; 
                        if(app.manual) manuallibchange(app.packages[4]);
                        updatePkg(); 
                        this.updater(); 
                        break;
                    case 'polaraxis':
                        app.packages[6] = "\\usepgfplotslibrary{polar}\n";
                        app.enablepolar = true;
                        updatePkg();
                        app.axistype = "4";
                        if(app.manual){
                            manuallibchange(app.packages[6]);
                            var mf = document.getElementById('manualfile');
                            mf.innerHTML = mf.innerHTML.replace("\\begin{axis}", "\\begin{polaraxis}");
                        }
                        break;
                }
            }
        }
    },
    components:{
        parambar
    },
    methods:{
        moveUp: function(){
            delete seriesList[this.idInner];
            this.idInner = ++seriescnt;
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
            app.purl = "";
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
            this.updater();
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

// 数据源更新事件
var SourceUpdateEvent = new Vue();

// 读文件
var readFile = function(e){
    var selectedFile = e.target.files[0];
    if(!selectedFile) {
        this.datat = "";
        this.updater();
        return ;
    }
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
                .replace(/[\t|,]/g,' ')
                .replace(/\s+/g,' ') + '\\\\';
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
});

// 颜色序列预览盒
Vue.component('colorsbox',{
    template:'#colorsboxtpl',
    props:['colors'],
});

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
    mounted: function(){
        if(this.indata){
            var expcomp = this.indata.split(',');
            if(!expcomp[0] && !expcomp[1] && expcomp[2]) this.expression3 = expcomp[2];
            else if (expcomp[0] && !expcomp[1] && !expcomp[2]) this.expression = expcomp[0];
            else {
                this.expression = expcomp[0];
                this.expression2 = expcomp[1];
                this.expression3 = expcomp[2];
            }
            this.updater();
        }
    },
    methods:{
        on_change: function(){
            this.updater();
            this.showfunction();
        },
        updater: function(){
            var me = this;
            var applyExp = function(exp){
                seriesList[me.idInner] = ["\\addplot" + (me.etd?"3":"") + (me.plus?"+":"") +" [" + me.param + "] "+ exp + (me.cycle?" \\closedcycle":"") + ";",me.legend,me.show,false];
            };
            if(!this.etd)
                applyExp("{" + this.expression + "}");
            else if (this.expression=="" && this.expression2=="")
                applyExp("{" + this.expression3 + "}");
            else
                applyExp("({" + this.expression + "},{" + this.expression2 + "},{" + this.expression3 + "})");
            updateSeries();
        },
        showfunction: function(){
            var passExp = function(exp){
                return exp.replace(/\+/g, "%2B").replace(/\s+/g,"%20");
            };
            if(!this.etd)
                app.purl = "res/function/func2tex.html?x=" + passExp(this.expression);
            else if (this.expression=="" && this.expression2=="")
                app.purl = "res/function/func2tex.html?z=" + passExp(this.expression3);
            else
                app.purl = "res/function/func2tex.html?x=" + passExp(this.expression) + "&y=" + passExp(this.expression2) + "&z=" + passExp(this.expression3);
        },
        clearfunction: function(){
            app.purl = "";
        }
    }
});

// 坐标数据工具栏（子组件）
Vue.component('coordbar',{
    template: "#coordbartpl",
    props: ["cdata","td"],
    data: function() {
        return {
            shown: false,
            addtext: "",
            icdata: this.cdata,
            validation: true,
        }
    },
    watch:{
        td(){
            this.validation = true;
        },
        icdata(_newdata){
            this.$parent.cdata = _newdata;
        }
    },
    methods:{
        barfocus: function (e) {
            this.$refs.coordtextb.focus();
        },
        barblur: function (e) {
            this.$parent.shown = false;
        },
        addcoord: function (e) {
            var me = this;
            var fromreg = (this.td?/(\S+)\s+(\S+)\s+(\S+)/:/(\S+)\s+(\S+)/);
            var toform = (this.td?" ($1,$2,$3)":" ($1,$2)");
            var appender = function () {
                me.icdata += " " + me.addtext.replace(fromreg,toform).replace(/\s+/g,"");
                me.addtext = "";
            };
            if(e.key=='Enter')
                appender();
            else if(e.key==' '){
                var matches = fromreg.exec(this.addtext);
                if(matches!=null&&matches[1]!=null&&matches[2]!=null&&(!this.td||matches[3]!=null))
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
        group: function () {
            var _cdata = this.icdata;
            var brareg = /\(\S+,\S+,\S+\)/g;
            var coordsarray = [];
            while((coord=brareg.exec(_cdata))!=null){
                var coorreg = /\((\S+),(\S+),(\S+)\)/;
                var coords = coorreg.exec(coord);
                coordsarray.push([coords[1],coords[2],coords[3]]);
            }
            coordsarray.sort((a,b)=>{
                if(a[1]==b[1])
                    return a[0]-b[0];
                return a[1]-b[1];
            });
            var cdata_ = "";
            var prevy = "";
            var prevx = "";
            var first = true;
            var prevcnt = -1;
            var curcnt = 0;
            var validation = true;

            var validate = function() {
                if(prevcnt!=-1 && curcnt!=prevcnt) validation = false;
                else {
                    prevcnt = curcnt; 
                    curcnt = 0;
                }
            };

            for(var i in coordsarray){
                if(coordsarray[i][0]==prevx && coordsarray[i][1]==prevy) continue; // 防止重复项
                if (first) first = false;
                else if (coordsarray[i][1]!=prevy){
                    validate();
                    cdata_ += "\\par\n";                // 回车会被吞掉
                }            
                cdata_ += " (" + coordsarray[i][0] + "," + coordsarray[i][1] + "," + coordsarray[i][2] + ")";
                prevx = coordsarray[i][0];
                prevy = coordsarray[i][1];
                curcnt++;
            }
            validate();
            
            this.validation = validation;
            this.icdata = cdata_;
        },
        format: function() {
            var _cdata = this.icdata;
            var fromreg = (this.td?/([(\d|\-).]+)[,\s+\t]([(\d|\-).]+)[,\s+\t]([(\d|\-).]+)/gm:/([(\d|\-).]+)[,\s+\t]([(\d|\-).]+)/gm);
            var toform = (this.td?"($1,$2,$3)":"($1,$2)");
            _cdata = _cdata.replace(/[()]/gm,"").replace(fromreg,toform);
            this.icdata = _cdata;
        }
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
    mounted: function(){
        if(this.indata)
            this.cdata = this.indata;
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
    }
});

// 表格参数组件
Vue.component('tableparambar',{
    template: '#tableparamtpl',
    props: ['datat','etd'],
    data: function(){
        return {
            colname:[],
            symbolic:[],
            symbolicsets:[],
        }
    },
    watch:{
        datat(_datat){
            this.colname = [];
            this.symbolic = [];
            this.symbolicsets = [];
            this.$parent.tableaxis = "";
            if(!_datat) {
                return ;
            }
            var header = this.datat.substring(0,this.datat.indexOf("\\\\"));
            this.colname = header.split(" ");
            this.symbolic_test();
            this.$refs.tableform.reset();
            this.$parent.updater();
        },
    },
    methods:{
        symbolic_test: function(){
            var filelines = this.datat.split("\\\\");
            for(var i in filelines){
                if(i==0) continue;              // skip the header
                var rowcol = filelines[i].split(" ");
                for(var j in rowcol)
                    if(/[^(\d|e|\-|\s|.)]+/.exec(rowcol[j])!=null)
                        this.symbolic[j] = true;
            }
        },
        get_symbolic_set_str: function(index){
            var getsetstr = function(set){
                var setstr = "";
                for(let item of set)
                    setstr += item + ",";
                return setstr.substring(0,setstr.length-1);
            }
            if(this.symbolicsets[index])
                return getsetstr(this.symbolicsets[index]); // cached
            var filelines = this.datat.split("\\\\");
            var symbolicset = new Set();
            for(var i in filelines){
                if(i==0) continue;              // skip the header
                var rowcol = filelines[i].split(" ");
                symbolicset.add(rowcol[index]);
            }
            symbolicset.delete("");
            this.symbolicsets[index] = symbolicset;
            return getsetstr(symbolicset);
        },
        axis_change: function(){
            var selection = new FormData(this.$refs.tableform);
            var tableaxis = "";
            var symbolicparam = "";
            for(const entry of selection){
                tableaxis += entry[0] + "=" + entry[1] + ",";
                for(var i in this.colname)
                    if(this.colname[i]==entry[1] && this.symbolic[i])
                        symbolicparam += "symbolic " + entry[0] + " coords={" + this.get_symbolic_set_str(i) + "},\n";
            }
            this.$parent.tableaxis = tableaxis;
            this.$parent.updater();
            app.symbolicparam = symbolicparam;
        },
        tableparam_losefocus: function(){
            this.$parent.tableparambar = false;
        }
    }
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
    watch:{
        datat(_datat){
            SourceUpdateEvent.$emit('source-change',sourceNameList[this.idInner],this.idInner);
        }
    },
    methods:{
        moveUp: function(){
            delete sourceList[this.idInner];
            delete sourceNameList[this.idInner];
            this.idInner = ++sourcecnt;
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
            tableaxis: "",
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
        if(this.indata){
            this.datat = this.indata;
            this.updater();
        }
        var clearSelect = function(){
            me.sourceSelect="...";
            me.datat="";
            me.tableaxis = "";
            me.updater();
        };
        SourceUpdateEvent.$on('source-name-change',function(molist,id){
            if(me.sourceSelect==molist[id])
                clearSelect();
            me.$set(me.sourceNameList,molist);
        });
        SourceUpdateEvent.$on('source-change',function(name,id){
            if(me.sourceSelect==name)
                me.datat = me.get_pdatat(sourceList[id][0]);
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
    watch:{
        sourceSelect(ss){
            if(ss=="..."){
                this.datat = "";
                this.tableaxis = "";
            }
            else
                for(var i in sourceNameList)
                    if(sourceNameList[i]==ss)
                        this.datat = this.get_pdatat(sourceList[i][0]);
            this.updater();
        }
    },
    methods:{
        get_pdatat: function(sourceitem){
            if(datat = /\{(.+)\}\{(.+)\}/.exec(sourceitem))
                return datat[1];
            else return null;
        },
        on_change: function(){
            if(this.sourceSelect==null)
                this.sourceSelect="...";
            this.updater();
        },
        updater: function(){
            seriesList[this.idInner] = [(this.etd? ("\\addplot3" + (this.plus?"+":"") + " ["):("\\addplot"+ (this.plus?"+":"") +" [")) + this.param + "] table[" + (this.sourceSelect=="..." ? "row sep=crcr," : "") + this.tableaxis + this.tableparam + "] {" + (this.sourceSelect=="..." ? this.datat : "\\" + this.sourceSelect) + "}" + (this.cycle?" \\closedcycle":"") + ";",this.legend,this.show,false];
            updateSeries();
        },
        readFile: readFile,
        tableparam_focused: function(){
            this.tableparambar = true;
        },
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

var updateParamDic = function(){
    app.param = "";
    for(var key in paramDic)
        if(paramDic[key]!=""){
            switch (key) {
                case "view":case "zlabel":case "zmin":case "zmax":case "axis z line":
                    if(!app.td) continue;
                    break;
                case "legend pos":
                    if(!app.enableLegend) continue;
                    break;
                default:
                    break;
            }
            app.param += key + "=" + paramDic[key] + ",\n";
        }
            
};

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
            paramDic[this.propkey] = "{" + this.value + "}";
            updateParamDic();
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

// 视图组件
Vue.component('viewproperty',{
    mixins: [propMixins],
    template:'#viewtpl',
    props: ['type'],
    data: function(){
        return {
            valuex: "",
            drag: false,
            prevx: 0,
        }
    },
    computed:{
        viewpurl: function(){
            return "res/view/view.html?x=" + this.value + "&y=" + this.valuex;
        }
    },
    methods:{
        onvichange: function(){
            if(this.value=="" || this.valuex==""){
                paramDic[this.propkey] = "";
                app.purl = "";
            }
            else {
                paramDic[this.propkey] = "{" + this.value + "}{" + this.valuex + "}";
                app.purl = this.viewpurl;
            }
            updateParamDic();
        },
        clearview: function(){
            app.purl = "";
        },
        showview: function(){
            if(this.value!="" && this.valuex!="")
                app.purl = this.viewpurl;
        },
        dragrefresh: function(){
            this.drag = false;
            app.purl = this.viewpurl;
            this.onvichange();
        },
        dragstart: function(e){
            this.drag = true;
            this.prevx = e.offsetX;
            this.showview();
        },
        dragging: function(e){
            var pos = e.offsetX;
            if(pos<=5 || pos>=95)
                this.dragrefresh();
            if(this.drag){
                if(this.value=="") this.value = 25;
                if(this.valuex=="") this.valuex = 30;
                if(e.path[0].id=='xrotater') this.value = parseInt(this.value) + pos - this.prevx;
                else if(e.path[0].id=='yrotater') this.valuex = parseInt(this.valuex) + pos - this.prevx;
                this.prevx = pos;
            }
        },
        dragend: function(e){
            this.dragrefresh();
        }
    }
});

// 模板按钮
Vue.component('tplbutton', {
    template: '#tplbutton',
    props:{
        tplname: String,
        tplid: Number,
    },
    computed:{
        iconadd: function(){
            return "res/tpl/icon/" + this.tplid + "i.svg";
        }
    },
    methods:{
        addtpl: function(){
            var tpldata = tpl_dict[this.tplid];
            
            switch(tpldata[0]){
                case 'expression':
                    app.expressions.push({
                        id: ++seriescnt,
                        inparam: tpldata[1],
                        indata: tpldata[2],
                        instruct: tpldata[3]?tpldata[3]:null,
                    });
                    break;
                case 'coordinate':
                    app.coordinates.push({
                        id: ++seriescnt,
                        inparam: tpldata[1],
                        indata: tpldata[2],
                        instruct: tpldata[3]?tpldata[3]:null,
                    });
                    break;
                case 'table':
                    app.tableps.push({
                        id: ++seriescnt,
                        inparam: tpldata[1],
                        indata: tpldata[2],
                        instruct: tpldata[3]?tpldata[3]:null,
                    });
                    break;
            }
        },
        preview: function(){
            app.purl = "res/tpl/svg/" + this.tplid + ".svg";
        },
        flush: function(){
            app.purl = "";
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

tdClick = function(obj){
    app.td = !app.td;
    updateParamDic();
    app.td = !app.td;
}

legendClick = function(obj){
    app.enableLegend = !app.enableLegend;
    updateParamDic();
    app.enableLegend = !app.enableLegend;
}

sourceClick = function(obj){
    app.enablesource = !app.enablesource;
    updateSeries();
    SourceUpdateEvent.$emit('source-disabled',app.enablesource);
    app.enablesource = !app.enablesource;
}

const t_premable = "\\begin{tikzpicture}\n"

const tp_premable = "\\begin{tikzpicture}\n\\tikzset{\n every pin/.style={fill=yellow!50!white,rectangle,rounded corners=3pt,font=\\tiny},\n small dot/.style={fill=black,circle,scale=0.3},\n}\n"

var app = new Vue({
    el: '#app',
    i18n,
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
        symbolicparam: "",
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
        purl:"",
    },
    mounted: function (){
        this.dc_content = this.content;
        this.changelang(in_lang);
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
            if (app.manual) manualrefresh();
        },
    },
    computed:{
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
            + this.param + this.symbolicparam + this.surplusparam +"]\n"
            + this.series
            + (this.enableLegend?" \\legend{" + this.legend +"}\n":"")
            + "\\end{"+ axistypename + "}\n\\end{tikzpicture}\n";
        },
        file: function(){
            return this.premable + this.content + this.suffix;
        },
    },
    methods:{
        hintDrawCode: function () { this.dc_content = this.content; hintCode("#texContent"); },
        blurDrawCode: function () { blurCode("#texContent") },
        hintAllCode: function () { this.dc_content = this.content; hintCode("#texAllCode"); },
        warnAllCode: function () { this.dc_content = this.content; warnCode("#texAllCode"); },
        blurAllCode: function () { blurCode("#texAllCode") },
        animbck: function () { animback(); },
        animfwd: function () { animforward(); },
        togglelang: function(){
            if(i18n.locale=='cn') this.changelang('en');
            else this.changelang('cn');
        },
        changelang: function(newlang) {
            var newscript = document.createElement('script');
            newscript.setAttribute('type','text/javascript');
            newscript.setAttribute('id','langdict');
            var head = document.getElementsByTagName('head')[0];
            var oldscript = document.getElementById('langdict');
            i18n.locale = newlang;
            newscript.setAttribute('src','lang/dict_' + newlang + '.js');
            head.appendChild(newscript);
            if(oldscript) head.removeChild(oldscript);
        },
        copytip: function() {
            var cpytip = document.getElementById('cpytip');
            if(cpytip.classList.contains('playfadeout'))
                cpytip.className = 'restartfadeout';
            else cpytip.className = 'playfadeout';
        },
        compile: function() {
            app.purl="";
            var urlencoder = function(str){
                // +属于url保留符号，需要转义为%2B才可以使用。
                // 全局匹配
                return str.replace(/\%.+/g,"").replace(/[+]/g,"%2B");
            };
            if(!app.manual)
                app.curl = "https://latexonline.cc/compile?text="+urlencoder(this.file);
            else app.curl = "https://latexonline.cc/compile?text="+urlencoder(document.getElementById('manualfile').value);
        }
    },
});