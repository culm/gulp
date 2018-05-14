/// <summary>
/// 日期拷贝
/// </summary>
/// <return>日期对象</return>
Date.prototype.copy = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
}
Date.prototype.clone = function () {
    var d = new Date(this.getTime());
    return d;
}
/*
 * 日期比较
 */
Date.prototype.compare = function (date) {
    return this.getTime() - date.getTime();
}

Date.prototype.toString = function (format) {
    if (!format || typeof format != 'string')
        format = "yyyy-MM-dd";

    format = format.replace(/yyyy/, this.getFullYear())
      .replace(/yy/, this.getFullYear().toString().substring(2))
      .replace(/y/, this.getFullYear().toString().substring(2).trimLeft("0"))
      .replace(/MM/, (this.getMonth() + 1).toString().padLeft('0', 2))
      .replace(/dd/, this.getDate().toString().padLeft('0', 2))
      .replace(/M/, (this.getMonth() + 1))
      .replace(/d/, this.getDate().toString())
      .replace(/HH/, this.getHours().toString().padLeft('0', 2))
      .replace(/hh/, (this.getHours() > 12 ? (this.getHours() - 12) : this.getHours()).toString().padLeft('0', 2))
      .replace(/mm/, this.getMinutes().toString().padLeft('0', 2))
      .replace(/ss/, this.getSeconds().toString().padLeft('0', 2))
      .replace(/H/, this.getHours())
      .replace(/h/, (this.getHours() > 12 ? (this.getHours() - 12) : this.getHours()))
      .replace(/m/, this.getMinutes())
      .replace(/s/, this.getSeconds());
    date = null;
    return format;
}

Date.prototype.addDays = function (d) {
    this.setDate(this.getDate() + d);
};

Date.prototype.addWeeks = function (w) {
    this.addDays(w * 7);
};

Date.prototype.addMonths = function (m) {
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);
    if (this.getDate() < d)
        this.setDate(0);
};

Date.prototype.addYears = function (y) {
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);
    if (m < this.getMonth()) {
        this.setDate(0);
    }
};

var DateHelper = {
    getCurrentDate: function () {
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = myDate.getDate();
        return year + "-" + month + "-" + day;
    },
    compare: function (a, b) {
        var date1 = this.string2Date(a);
        var date2 = this.string2Date(b);
        return date1 > date2;
    },
    string2Date: function (v) {
        if (typeof v == "string") {
            var d = new Date(Date.parse(v.replace(/-/g, "/")));
            return d;
        } else {
            return v;
        }
    },
    weekOfDay: function (d) {
        var dt = this.string2Date(d)
        var y = dt.getFullYear()
        var start = "1/1/" + y
        start = this.string2Date(start)
        starts = start.valueOf()
        startweek = start.getDay()
        dtweek = dt.getDay()
        var days = Math.round((dt.valueOf() - start.valueOf()) / (24 * 60 * 60 * 1000)) - (7 - startweek) - dt.getDay() - 1
        days = Math.floor(days / 7)
        return (days + 2);
    },
    addMinute: function (date, minute) {
        if (typeof date == "string") {
            var d = new Date(Date.parse(date.replace(/-/g, "/")));
            date = d;
        }
        var nd = date;
        nd = nd.valueOf();
        nd = nd + minute * 60 * 1000;
        nd = new Date(nd);

        var y = nd.getFullYear();
        var m = nd.getMonth() + 1;
        var d = nd.getDate();
        var hour = nd.getHours();
        var min = nd.getMinutes();
        var seconds = nd.getSeconds();
        if (m <= 9)
            m = "0" + m;
        if (d <= 9)
            d = "0" + d;
        if (hour <= 9)
            hour = "0" + hour;
        if (min <= 9)
            min = "0" + min;
        if (seconds <= 9)
            seconds = "0" + seconds;
        var cdate = y + "-" + m + "-" + d + " " + hour + ":" + min + ":" + seconds;
        return cdate;
    },
    addDays: function (date, days) {
        var nd = this.string2Date(date);
        nd = nd.valueOf();
        nd = nd + days * 24 * 60 * 60 * 1000;
        nd = new Date(nd);

        var y = nd.getFullYear();
        var m = nd.getMonth() + 1;
        var d = nd.getDate();
        if (m <= 9)
            m = "0" + m;
        if (d <= 9)
            d = "0" + d;
        var cdate = y + "-" + m + "-" + d;
        return cdate;
    },
    /**
     * 两个日期的差值(d1 - d2).
     * @param  {string} d1 日期1
     * @param  {string} d2 日期2
     * @return {decimal}    返回差值（天）
     */
    dateDiff: function (d1, d2) {
        var day = 24 * 60 * 60 * 1000;
        try {
            var dateArr = d1.split("-");
            var checkDate = new Date();
            checkDate.setFullYear(dateArr[0], dateArr[1] - 1, dateArr[2]);
            var checkTime = checkDate.getTime();

            var dateArr2 = d2.split("-");
            var checkDate2 = new Date();
            checkDate2.setFullYear(dateArr2[0], dateArr2[1] - 1, dateArr2[2]);
            var checkTime2 = checkDate2.getTime();

            var cha = (checkTime - checkTime2) / day;
            return cha;
        } catch (e) {
            return false;
        }
    }
}

