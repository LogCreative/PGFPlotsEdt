// 渲染顺序会导致设定的相反性

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

// 删除线样式
Vue.directive('soutline',function(el,binding){
    if(binding.value){
        el.style['text-decoration'] = 'none';
        el.style['color'] = '#666';
    } else {
        el.style['text-decoration'] = 'line-through';
        el.style['color'] = '#999';
    }
});