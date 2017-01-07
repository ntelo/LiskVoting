define(["require", "exports", "aurelia-http-client", './app-state'], function (require, exports, auhc, app_state_1) {
    "use strict";
    //var baseUrl: string = './LiskService.asmx/';
    var baseUrl = '';
    var Accounts = (function () {
        function Accounts(http, appState) {
            this.http = http;
            this.heading = "Accounts DashBoard";
            this.top25MBalance = [];
            this.listBalance = [];
            // this.appState = appState;
            baseUrl = appState.baseUrl;
        }
        Accounts.prototype.activate = function () {
            return Promise.all([this.GetTop25Top25Balance(), this.GetallBalance()])
                .then(function (results) {
                return results;
            });
        };
        Accounts.prototype.LoadData = function () {
            try {
                this.loadChartTop25Balance();
                this.loadGrid();
            }
            catch (ex) {
            }
        };
        Accounts.prototype.GetTop25Top25Balance = function () {
            var self = this;
            var url = baseUrl + 'GetMenAccountsTop25Balance';
            try {
                return $.ajax({
                    type: "POST",
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        self.top25MBalance = response.d;
                        self.loadChartTop25Balance();
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
        Accounts.prototype.loadChartTop25Balance = function () {
            var self = this;
            var options = {
                title: "Accounts Top 25 Balance %Total",
                dataSource: self.top25MBalance,
                palette: 'Soft Pastel',
                tooltip: {
                    enabled: true
                },
                equalBarWidth: false,
                legend: {
                    verticalAlignment: 'bottom',
                    horizontalAlignment: 'center'
                },
                commonSeriesSettings: {
                    argumentField: 'username',
                    type: 'bar',
                    label: {
                        visible: true,
                        connector: { visible: true },
                        format: 'largeNumber',
                        precision: 2,
                        alignment: 'left'
                    }
                },
                series: [{
                        argumentField: "username",
                        valueField: "balancePercentTotal",
                        name: "balancePercentTotal",
                        type: "bar",
                        color: '#20A8D8'
                    }],
                argumentAxis: {
                    type: 'discrete',
                    //tickInterval: 5,
                    label: {
                        overlappingBehavior: { mode: 'rotate', rotationAngle: 65 }
                    }
                },
            };
            $('#containertop25Balance').dxChart(options);
        };
        Accounts.prototype.GetallBalance = function () {
            var self = this;
            var url = baseUrl + 'GetMenAccounts';
            try {
                return $.ajax({
                    type: "POST",
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        self.listBalance = response.d;
                        //self.loadGrid();
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
        Accounts.prototype.loadGrid = function () {
            var self = this;
            $("#gridContainermenaccounts").dxDataGrid({
                dataSource: self.listBalance,
                //dataSource: self.ds,
                //height: function () {
                //    return window.innerHeight - $('#footer').height() - $('.navbar').height() - $('.card').height() - 20;
                //},
                height: 800,
                columns: [
                    { dataField: 'rate', caption: 'Rank' },
                    { dataField: 'username' },
                    { dataField: 'address' },
                    //{ dataField: 'isDelegate' },
                    { dataField: 'balance' },
                    { dataField: 'balancePercentTotal' },
                    { dataField: 'vote' },
                    { dataField: 'votePercentTotal' },
                    { dataField: 'producedblocks' },
                    { dataField: 'missedblocks' },
                    { dataField: 'fees' },
                    { dataField: 'rewards' }
                ],
                selection: { mode: 'single' },
                groupPanel: {
                    visible: true
                },
                columnAutoWidth: true,
                paging: { pageSize: 100 },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [200, 300, 400, 500, 1000, 1500]
                },
                headerFilter: {
                    visible: true
                },
                filterRow: { visible: true },
                hoverStateEnabled: true,
                rowAlternationEnabled: true
            });
        };
        Accounts.prototype.ShowError = function (response) {
            DevExpress.ui.notify(JSON.stringify(response), "error", 5000);
            //alert(JSON.stringify(response));
        };
        Accounts.prototype.attached = function () {
            this.LoadData();
            // DevExpress.ui.notify('Hello Delegate, Please contribute to NTELO in Mainnet', 'info', 5000);
        };
        Accounts.inject = [auhc.HttpClient, app_state_1.AppState];
        return Accounts;
    })();
    exports.Accounts = Accounts;
});
//# sourceMappingURL=accounts.js.map