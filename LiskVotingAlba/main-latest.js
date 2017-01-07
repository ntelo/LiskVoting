var origin = window.location.origin;
var pathname = window.location.pathname;
var baseUrl = origin + pathname.toLowerCase().replace("index.html", "");

require.config({
    baseUrl: baseUrl,
    paths: {
        aurelia: baseUrl + "/scripts/aurelia",
        views: baseUrl + "/views",
        underscore: baseUrl + "/scripts/underscore/underscore.min",
        webcomponentsjs: baseUrl + "/scripts/webcomponentsjs",
        'core-js': baseUrl + "/scripts/core-js/client/core.min"
    },
    shim: {
        underscore: {
            exports: "_"
        }
    }
});

require(["aurelia/aurelia-bundle-latest"], function (au) {
    require(["aurelia-bootstrapper"], function (b) {
    });
});
