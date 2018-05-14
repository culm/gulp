;(function (A) {

    var local = function () { },
        L = localStorage;

    /// <summary>
    /// 设置将指定的值存放在localstorage的指定键值下
    /// </summary>
    /// <param name="key">键值</param>
    /// <param name="value">值</param>
    local.setItem = function (key, value) {
        L.setItem(key, JSON.stringify(value));
    }
    /// <summary>
    /// 获取指定键值下的值
    /// </summary>
    /// <param name="key">键值</param>
    local.getItem = function (key) {
        var d = L.getItem(key);
        if (!d) return d;
        return JSON.parse(d);
        //return JSON.parse(L.getItem(key))
    }
    /// <summary>
    /// 移除指定键值下的值
    /// </summary>
    /// <param name="key">键值</param>
    local.remove = function (key) {
        L.removeItem(key);
    }
    /// <summary>
    /// 移除localStorage下所有存储的值
    /// </summary>
    local.clear = function () {
        L.clear();
    }
    local.length = function(){
        return L.length;
    }

    A.widget.local = local;
})(my);