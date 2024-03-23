if(document.body.clientWidth>900){
    // 启用split
    var instance = Split(['#panel-one','#panel-two','#panel-three'],{
        sizes:[30,35,35],
        minSize: [300,300,0],
        direction: 'horizontal',
        onDrag: setSpliterHeight,
    });
    document.querySelectorAll('.container details').forEach(element => {
        element.addEventListener("toggle", setSpliterHeight);
    });
    document.querySelector('#data').addEventListener('mouseleave', setSpliterHeight);
    document.getElementById('codedetail').open = true;
    setSpliterHeight();
}
else
    document.getElementById('codedetail').open = false;
