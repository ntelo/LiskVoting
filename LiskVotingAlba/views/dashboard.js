define(["require", "exports", "aurelia-http-client", './app-state'], function (require, exports, auhc, app_state_1) {
    "use strict";
    //var baseUrl: string = './LiskService.asmx/';
    var baseUrl = '';
    var Dashboard = (function () {
        function Dashboard(http, appState) {
            this.http = http;
            baseUrl = appState.baseUrl;
            this.heading = "Lisk DashBoard";
            this.top25Missers24H = [];
            this.top25MForgers24H = [];
            this.topForgers = [];
            this.topMissers = [];
            this.instantStats24 = [];
        }
        Dashboard.prototype.activate = function () {
            //return Promise.all([this.GetTop25MissersInstantStats24h(), this.GetTopForgers(), this.GetTopMissers(), this.GetTop25MForgersInstantStats24h(), this.GetInstantStats24h()])
            //    .then(function (results) {
            //        return results;
            //    });
            return Promise.all([this.GetTopForgers(), this.GetTopMissers(), this.GetInstantStats24h()])
                .then(function (results) {
                return results;
            });
        };
        Dashboard.prototype.LoadData = function () {
            try {
                this.loadGrid();
                // this.loadChartBlockMissers();
                this.loadChartForgers();
                this.loadChartMissers();
            }
            catch (ex) {
            }
        };
        Dashboard.prototype.GetInstantStats24h = function () {
            var self = this;
            var url = baseUrl + 'GetInstantStats24h';
            try {
                return $.ajax({
                    type: "POST",
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        self.instantStats24 = response.d;
                        // self.loadChartBlockMissers();
                        return response.d;
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
                        console.log(xmlHttpRequest.responseText);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
            catch (ex) {
            }
        };
        Dashboard.prototype.loadGrid = function () {
            var self = this;
            $("#gridContainer").dxDataGrid({
                dataSource: self.instantStats24,
                //dataSource: self.ds,
                columns: [
                    { dataField: 'rate' },
                    { dataField: 'username' },
                    { dataField: 'producedblocks' },
                    { dataField: 'missedblocks' },
                    { dataField: 'productivity' },
                    { dataField: 'address' },
                    { dataField: 'publicKey' }
                ],
                selection: { mode: 'single' },
                groupPanel: {
                    visible: true
                },
                columnAutoWidth: true,
                paging: { pageSize: 10 },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [20, 50, 101]
                },
                headerFilter: {
                    visible: true
                },
                filterRow: { visible: true },
                hoverStateEnabled: true,
                rowAlternationEnabled: true
            });
        };
        Dashboard.prototype.GetTopForgers = function () {
            var self = this;
            var url = baseUrl + 'GetTopForgers';
            this.topForgers = [];
            try {
                return $.ajax({
                    type: "POST",
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        self.topForgers = response.d;
                        self.loadChartForgers();
                        return response.d;
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
                        console.log(xmlHttpRequest.responseText);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
            catch (ex) {
            }
        };
        Dashboard.prototype.GetTopMissers = function () {
            var self = this;
            var url = baseUrl + 'GetTopMissedBlockers';
            this.topForgers = [];
            try {
                return $.ajax({
                    type: "POST",
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        self.topMissers = response.d;
                        self.loadChartMissers();
                        return response.d;
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
                        console.log(xmlHttpRequest.responseText);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
            catch (ex) {
            }
        };
        Dashboard.prototype.loadChartMissers = function () {
            var self = this;
            var options = {
                size: {
                    width: 500
                },
                dataSource: self.topMissers,
                title: "Top 10 Missed Blocks AllTD",
                series: [{
                        argumentField: "username",
                        valueField: "missedblocks",
                        label: {
                            visible: true,
                            connector: {
                                visible: true,
                                width: 1
                            }
                        },
                        name: "missed Blocks"
                    }],
            };
            $('#containerMissers').dxPieChart(options);
        };
        Dashboard.prototype.loadChartForgers = function () {
            var self = this;
            var options = {
                size: {
                    width: 500
                },
                dataSource: self.topForgers,
                title: "Top 10 Forgers AllTD",
                series: [{
                        argumentField: "username",
                        valueField: "producedblocks",
                        label: {
                            visible: true,
                            connector: {
                                visible: true,
                                width: 1
                            }
                        },
                        name: "Forging"
                    }],
            };
            $('#containerForgers').dxPieChart(options);
        };
        Dashboard.prototype.ShowError = function (response) {
            DevExpress.ui.notify(JSON.stringify(response), "error", 10000);
            //alert(JSON.stringify(response));
        };
        Dashboard.prototype.attached = function () {
            this.LoadData();
            this.loadGrid();
            // DevExpress.ui.notify('Hello Delegate, Please contribute to NTELO in Mainnet', 'info', 5000);
        };
        Dashboard.inject = [auhc.HttpClient, app_state_1.AppState];
        return Dashboard;
    })();
    exports.Dashboard = Dashboard;
});
//# sourceMappingURL=dashboard.js.map