define(["require", "exports"], function (require, exports) {
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.title = "LISK Voting by NTELO";
            config.map([
                { route: ["", "dashboard"], moduleId: "views/dashboard", nav: true, title: "DashBoard" },
                //{ route: "accounts", moduleId: "views/accounts", nav: true, title: "Accounts Stats" },
                { route: "peers", moduleId: "views/peers", nav: true, title: "Peers Stats" },
                //{ route: "nodestatsforgers", moduleId: "views/nodestatsforgers", nav: true, title: "Forging 48h Stats" },
                //{ route: "nodestatsblocks", moduleId: "views/nodestatsblocks", nav: true, title: "Blocks 48h Stats" },
                //{ route: "nodestatsvotes", moduleId: "views/nodestatsvotes", nav: true, title: "Votes 48h Stats" },
                { route: "home", moduleId: "views/home", nav: true, title: "Votes in Delegate" },
                { route: "delegates", moduleId: "views/delegates", nav: true, title: "Votes to Delegate" },
                { route: "top202", moduleId: "views/top202", nav: true, title: "Top 202 Delegate Stats" }
            ]);
        };
        ;
        App.prototype.gopage = function (route) {
            this.ativeroute = route;
            $(".nav-link").removeClass("active");
            $('#' + this.ativeroute).addClass("active");
            this.router.navigate(route);
            //alert(this.router.currentInstruction.params)
        };
        App.prototype.attached = function () {
            $.getScript("assets/js/app.js", function () {
                $('head').append(' <link rel="stylesheet" type="text/css" href="http://cdn3.devexpress.com/jslib/15.2.9/css/dx.common.css" />');
                $('head').append(' <link rel="stylesheet" type="text/css" href="http://cdn3.devexpress.com/jslib/15.2.9/css/dx.light.css" />');
            });
            var hash = location.hash.slice(1);
            if (hash != "") {
                //hash.replace('/', '');
                this.gopage(hash.replace('/', ''));
            }
            else {
                this.gopage("dashboard");
            }
        };
        return App;
    })();
    exports.App = App;
});
//# sourceMappingURL=app.js.map