define(["require", "exports", "aurelia-http-client", './app-state'], function (require, exports, auhc, app_state_1) {
    "use strict";
    //var baseUrl: string = './LiskService.asmx/';
    var baseUrl = '';
    var Peers = (function () {
        function Peers(http, appState) {
            this.http = http;
            baseUrl = appState.baseUrl;
            this.heading = "Peers Blocks DashBoard";
            this.blockx100 = [];
            this.blockstatus = [];
            this.peers = [];
        }
        Peers.prototype.activate = function () {
            return Promise.all([this.GetPeersBlockGroup(), this.GetPeersStatusGroup(), this.GetPeersList()])
                .then(function (results) {
                return results;
            });
        };
        Peers.prototype.LoadData = function () {
            try {
                this.LoadChartPeersBlockGroup();
                this.LoadChartPeersStatusGroup();
                this.loadGrid();
            }
            catch (ex) {
            }
        };
        Peers.prototype.GetPeersBlockGroup = function () {
            var self = this;
            var url = baseUrl + 'GetPeersBlockGroup';
            try {
                return $.ajax({
                    type: "POST",
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        self.blockx100 = response.d;
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
        Peers.prototype.GetPeersStatusGroup = function () {
            var self = this;
            var url = baseUrl + 'GetPeersStates';
            try {
                return $.ajax({
                    type: "POST",
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        self.blockstatus = response.d;
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
        Peers.prototype.GetPeersList = function () {
            var self = this;
            var url = baseUrl + 'GetPeers';
            try {
                return $.ajax({
                    type: "POST",
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        self.peers = response.d;
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
        //LoadChartPeersBlockGroup_() {
        //    var self = this;
        //    var options: DevExpress.viz.charts.dxPieChartOptions = {
        //        //size: {
        //        //    width: 600
        //        //},
        //        dataSource: self.blockx100,
        //        title: "Peers by Current Block x 1000",
        //        series: [{
        //            argumentField: "Blockx100",
        //            valueField: "NumberPeers",
        //            label: {
        //                visible: true,
        //                connector: {
        //                    visible: true,
        //                    width: 1
        //                }
        //            },
        //            name: "Block x 100 Peers Group"
        //        }],
        //    };
        //    $('#containerblockx100').dxPieChart(options);
        //}
        Peers.prototype.LoadChartPeersBlockGroup = function () {
            var self = this;
            var options = {
                title: "Peers by Current Block x 1000",
                dataSource: self.blockx100,
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
                    argumentField: 'Blockx100',
                    type: 'bar',
                    label: {
                        visible: true,
                        connector: { visible: true },
                        format: 'largeNumber',
                        precision: 0,
                        alignment: 'left'
                    }
                },
                series: [{
                        argumentField: "Blockx100",
                        valueField: "NumberPeers",
                        name: "Current Block x 1000",
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
            $('#containerblockx100').dxChart(options);
        };
        Peers.prototype.LoadChartPeersStatusGroup = function () {
            var self = this;
            var options = {
                //size: {
                //    width: 500
                //},
                dataSource: self.blockstatus,
                title: "Peers by Status",
                series: [{
                        argumentField: "state",
                        valueField: "NumberStates",
                        label: {
                            visible: true,
                            connector: {
                                visible: true,
                                width: 1
                            }
                        },
                        name: "Status Peers Group"
                    }],
            };
            $('#containerblockstatus').dxPieChart(options);
        };
        Peers.prototype.loadGrid = function () {
            var self = this;
            $("#gridpeers").dxDataGrid({
                dataSource: self.peers,
                //dataSource: self.ds,
                //height: function () {
                //    return window.innerHeight - $('#footer').height() - $('.navbar').height() - $('.card').height() - 20;
                //},
                height: 800,
                columns: [
                    { dataField: 'ip', caption: 'ip' },
                    { dataField: 'port', caption: 'port' },
                    { dataField: 'height' },
                    { dataField: 'PeersBlockx100', caption: 'CurrentBlock x 1000' },
                    { dataField: 'stateStr' },
                    { dataField: 'os' },
                    { dataField: 'version' }
                ],
                selection: { mode: 'single' },
                groupPanel: {
                    visible: true
                },
                columnAutoWidth: true,
                paging: { pageSize: 100 },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [100, 200, 300, 1500]
                },
                headerFilter: {
                    visible: true
                },
                filterRow: { visible: true },
                hoverStateEnabled: true,
                rowAlternationEnabled: true
            });
        };
        Peers.prototype.ShowError = function (response) {
            DevExpress.ui.notify(JSON.stringify(response), "error", 5000);
            //alert(JSON.stringify(response));
        };
        Peers.prototype.attached = function () {
            this.LoadData();
        };
        Peers.inject = [auhc.HttpClient, app_state_1.AppState];
        return Peers;
    })();
    exports.Peers = Peers;
});
//# sourceMappingURL=peers.js.map