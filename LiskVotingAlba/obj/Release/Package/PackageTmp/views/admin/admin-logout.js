var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-router", "views/app-state"], function (require, exports, aurelia_framework_1, aurelia_router_1, app_state_1) {
    var AdminLogout = (function () {
        function AdminLogout(appState) {
            this.appState = appState;
            this.heading = "Logout";
        }
        AdminLogout.prototype.canActivate = function () {
            this.appState.logout();
            return new aurelia_router_1.Redirect("#/", {});
        };
        AdminLogout = __decorate([
            aurelia_framework_1.inject(app_state_1.AppState), 
            __metadata('design:paramtypes', [app_state_1.AppState])
        ], AdminLogout);
        return AdminLogout;
    })();
    exports.AdminLogout = AdminLogout;
});
//# sourceMappingURL=admin-logout.js.map