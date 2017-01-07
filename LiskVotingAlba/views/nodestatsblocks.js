define(["require", "exports", "aurelia-http-client", './app-state'], function (require, exports, auhc, app_state_1) {
    "use strict";
    //var baseUrl: string = './LiskService.asmx/';
    //var baseurlLisk = "http://5.189.153.97:7000";
    var baseUrl = '';
    var baseurlLisk = '';
    var nodestatsblocks = (function () {
        function nodestatsblocks(http, appState) {
            this.http = http;
            this.heading = "Node last 48h Stats";
            baseUrl = appState.baseUrl;
            baseurlLisk = appState.liskBaseUrl;
            this.nodeStatsData = [];
            this.liskAddr = "";
            this.username = "";
        }
        nodestatsblocks.prototype.loadCharts = function () {
            this.loadChartBlocks();
        };
        nodestatsblocks.prototype.GetEvolutionStats = function () {
            if (this.liskAddr.length > 0) {
                this.setCookie("cookieAddrs", this.liskAddr, 30);
                var self = this;
                var url = baseUrl + 'GetEvolutionStats';
                var data = {};
                data.address = this.liskAddr;
                return $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        self.nodeStatsData = response.d;
                        self.heading = "Node last 48h Stats, last sync " + response.d.lastdatestr;
                        self.loadCharts();
                        return response.d;
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
                        console.log(xmlHttpRequest.responseText);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
        };
        nodestatsblocks.prototype.setCookie = function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        };
        nodestatsblocks.prototype.getCookie = function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        };
        nodestatsblocks.prototype.loadChartBlocks = function () {
            var self = this;
            var options = {
                title: "Blocks By Hour",
                dataSource: self.nodeStatsData.evolutionData,
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
                    argumentField: 'HourSequence',
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
                        argumentField: "HourSequence",
                        valueField: "producedblocks",
                        name: "Produced Blocks",
                        type: "line",
                        color: '#5684b8'
                    }, {
                        argumentField: "HourSequence",
                        valueField: "missedblocks",
                        name: "Missed Blocks",
                        type: "line",
                        color: '#e56e6e'
                    }],
                argumentAxis: {
                    type: 'discrete',
                    //tickInterval: 5,
                    label: {
                        overlappingBehavior: { mode: 'rotate', rotationAngle: 45 }
                    }
                },
            };
            $('#producedblocks').dxChart(options);
            var gauge = $("#producedblocks1").dxCircularGauge({
                scale: {
                    startValue: 10,
                    endValue: 500,
                    tickInterval: 25,
                    label: {
                        customizeText: function (arg) {
                            return arg.valueText + " Blocks";
                        }
                    }
                },
                tooltip: { enabled: true },
                title: {
                    text: "Last 48h (" + self.nodeStatsData.producedblocks + ")",
                    font: { size: 28 }
                },
                value: self.nodeStatsData.producedblocks
            }).dxCircularGauge("#producedblocks1");
        };
        nodestatsblocks.prototype.ShowError = function (response) {
            DevExpress.ui.notify(JSON.stringify(response), "error", 10000);
            //alert(JSON.stringify(response));
        };
        nodestatsblocks.prototype.attached = function () {
            var self = this;
            var cookieAddrs = this.getCookie("cookieAddrs");
            if (cookieAddrs.length > 0) {
                this.liskAddr = cookieAddrs;
                this.GetEvolutionStats();
            }
            //DevExpress.ui.notify('Hello Delegate, Please contribute to NTELO in Mainnet', 'info', 5000);
        };
        nodestatsblocks.inject = [auhc.HttpClient, app_state_1.AppState];
        return nodestatsblocks;
    })();
    exports.nodestatsblocks = nodestatsblocks;
});
//# sourceMappingURL=nodestatsblocks.js.map