var gulp = require('gulp'); 
var task = require('./hejin-build');

/**
 * ukang项目
 * @description [单据上传页面]
 * @interface ukang-dev [打包前端代码包]
 * @interface ukang-emu [打包前端代码包，带测试地址127.0.0.1:3000]
 * @interface ukang-pro [打包前端代码包，压缩合并，可直接上线]
 */
task('ukang',{
    config: [
        "./config/json/common.json",
        "./config/json/widget.json",
        "./config/json/ukang.json"
    ]
})

/**
 * admin项目
 * @description [单据管理后台]
 * @interface admin-dev [打包前端代码包]
 * @interface admin-emu [打包前端代码包，带测试地址127.0.0.1:3000]
 * @interface admin-pro [打包前端代码包，压缩合并，可直接上线]
 */ 
task('admin',{
    ServerPath:"/ukang-admin-web/",
})

/**
 * fesco项目
 * @description [和fesco对接的前端页面]
 * @interface fesco-dev [打包前端代码包]
 * @interface fesco-emu [打包前端代码包，带测试地址127.0.0.1:3000]
 * @interface fesco-pro [打包前端代码包，压缩合并，可直接上线]
 */ 
task('fesco',{
    single: true,
    config: [
        "./config/json/fesco.json",
    ],
    uri: {
        'dev': 'http://tfespage.itpin.net',
        "pro": 'http://wxfwh.fesco.com.cn'
    },
    statics : {
        "ServerPath": '/chealth-app-web/',
        "imagePath": "./style/images/"
    },
    imagePath: {
        'dev': "./css/fesco/images",
        "pro": "./style/images/"
    }
})

/**
 * taibao项目
 * @description [太保金饭碗对接的前端页面]
 * @interface taibao-dev [打包前端代码包]
 * @interface taibao-emu [打包前端代码包，带测试地址127.0.0.1:3000]
 * @interface taibao-pro [打包前端代码包，压缩合并，可直接上线]
 */ 
task('taibao',{
    config: [
        "./config/json/widget.json",
        "./config/json/taibao.json",
    ]
})

/**
 * taibaojiankang项目
 * @description [太保移动对接的前端页面]
 * @interface taibaojiankang-dev [打包前端代码包]
 * @interface taibaojiankang-emu [打包前端代码包，带测试地址127.0.0.1:3000]
 * @interface taibaojiankang-pro [打包前端代码包，压缩合并，可直接上线]
 */
task('taibaojiankang',{
    config: [
        "./config/json/widget.json",
        "./config/json/taibaojiankang.json",
    ],
    uri: {
        "dev": 'http://182.150.61.49',
        "pro": 'https://blifesit.cpic.com.cn'
    },
    ossBucket: {
        "dev": 'hejin-internal-test',
        "pro": 'hejin-product'
    },
    ossDirName: {
        "dev": 'test',
        "pro": 'app/taibao'
    }
})

