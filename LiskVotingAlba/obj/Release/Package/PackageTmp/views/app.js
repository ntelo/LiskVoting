define(["require", "exports"], function (require, exports) {
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.title = "Delegate Votes";
            config.map([
                { route: ["", "home"], moduleId: "views/home", nav: true, title: "home" }
            ]);
        };
        ;
        return App;
    })();
    exports.App = App;
});
//# sourceMappingURL=app.js.map