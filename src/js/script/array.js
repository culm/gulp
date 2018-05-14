;
/**
* 索引
*/
Array.prototype.indexOf = function(val) {
    var len = this.length, i = 0;
    for (; i < len; i++) {
        if (this[i] === val) return i;
    }
    return -1;
};
/**
* 删除指定元素
*/
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};