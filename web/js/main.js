var app = new Vue({
    el: '#app',
    data:{
        series: null,
        axis: null,
        param: null
    },
    methods:{
        onFunctionEnter: function(){
            app.series = "Funtion";
        },
        onFunctionLeave: function() {
            app.series = null;
        },
        onPlotEnter: function() {
            app.series = "Plot";
        },
        onPlotLeave: function() {
            app.series = null;
        }
    }
});