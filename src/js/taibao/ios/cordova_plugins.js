cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "takephoto.js",
        "id": "com.hejin.takephoto.takephoto",
        "pluginId": "com.hejin.takephoto",
        "clobbers": [
            "cordova.plugins.takephoto"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.hejin.takephoto": "1.0.0"
}
// BOTTOM OF METADATA
});