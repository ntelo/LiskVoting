define(["require", "exports"], function (require, exports) {
    var AppState = (function () {
        function AppState() {
            this.baseUrl = './LiskService.asmx/';
            //public liskBaseUrl: string = 'http://5.189.153.97:8000';
            this.liskBaseUrl = 'https://login.lisk.io';
        }
        return AppState;
    })();
    exports.AppState = AppState;
});
//# sourceMappingURL=app-state.js.map