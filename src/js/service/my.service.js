;
(function(A) {
    A.service = {
        networkError: function(defer, info) {
            var res = {
                'rtnCode': '-2000',
                'rtnMsg': info.responseText
            };
            defer.reject(res);
        },
        callbackProcess: function(defer, res) {
            if (res.rtnCode === '2000') {
                defer.resolve(res);
            } else if (res.rtnCode === '2001') {
                defer.notLogin(res);
            } else {
                defer.reject(res);
            }
        }
    }
})(my)
