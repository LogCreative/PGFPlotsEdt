var left = document.getElementById('drag-left');
var middle = document.getElementById('drag-middle');
var right = document.getElementById('drag-right');
var barl = document.getElementById('dragbarl');
var barr = document.getElementById('dragbarr');
var preview = document.getElementById('compilePrev');

const dragl = (e) => {
    document.selection ? document.selection.empty() : window.getSelection().removeAllRanges();
    left.style.width = (e.pageX - barl.offsetWidth / 2) + 'px';
}

barl.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', dragl);
});

barl.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', dragl);
});

const dragr = (e) => {
    document.selection ? document.selection.empty() : window.getSelection().removeAllRanges();
    right.style.width = (window.innerWidth - e.pageX - barl.offsetWidth) + 'px';
}

barr.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', dragr);
});

barr.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', dragr);
});