define(["require", "exports", "aurelia-http-client"], function (require, exports, auhc) {
    "use strict";
    var baseUrl = './LiskService.asmx/';
    var baseurlLisk = "http://5.189.153.97:7000";
    var nodestats = (function () {
        function nodestats(http) {
            this.http = http;
            this.heading = "Node last 48h Stats";
            this.nodeStatsData = [];
            this.liskAddr = "";
            this.username = "";
        }
        nodestats.prototype.loadCharts = function () {
            this.loadChartForgers();
            //this.loadChartBlocks();
        };
        nodestats.prototype.GetEvolutionStats = function () {
            if (this.liskAddr.length > 0) {
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
        nodestats.prototype.loadChartForgers = function () {
            var self = this;
            var options = {
                title: "Forging Evolution By Hour",
                dataSource: self.nodeStatsData.evolutionData,
                palette: 'Soft Pastel',
                tooltip: {
                    enabled: true
                },
                equalBarWidth: false,
                legend: { visible: true },
                commonSeriesSettings: {
                    argumentField: 'hour',
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
                        argumentField: "hour",
                        valueField: "forged",
                        name: "forged",
                        type: "line",
                        color: '#5684b8'
                    }],
                argumentAxis: {
                    type: 'discrete',
                    //tickInterval: 5,
                    label: {
                        overlappingBehavior: { mode: 'rotate', rotationAngle: 25 }
                    }
                },
            };
            $('#forged').dxChart(options);
            var gauge = $("#forged1").dxCircularGauge({
                scale: {
                    startValue: 100,
                    endValue: 1500,
                    tickInterval: 100,
                    label: {
                        customizeText: function (arg) {
                            return arg.valueText + " LISK";
                        }
                    }
                },
                tooltip: { enabled: true },
                title: {
                    text: "Total Forging Last 48h",
                    font: { size: 28 }
                },
                value: self.nodeStatsData.forgedTotal
            }).dxCircularGauge("#forged1");
        };
        nodestats.prototype.loadChartBlocks = function () {
            var self = this;
            var options = {
                title: "Produced Blocks Evolution By Hour",
                dataSource: self.nodeStatsData.evolutionData,
                palette: 'Soft Pastel',
                tooltip: {
                    enabled: true
                },
                equalBarWidth: false,
                legend: { visible: true },
                commonSeriesSettings: {
                    argumentField: 'hour',
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
                        argumentField: "hour",
                        valueField: "producedblocks",
                        name: "Produced Blocks",
                        type: "line",
                        color: '#5684b8'
                    }],
                argumentAxis: {
                    type: 'discrete',
                    //tickInterval: 5,
                    label: {
                        overlappingBehavior: { mode: 'rotate', rotationAngle: 25 }
                    }
                },
            };
            $('#producedblocks').dxChart(options);
            var gauge = $("#producedblocks1").dxCircularGauge({
                scale: {
                    startValue: 10,
                    endValue: 250,
                    tickInterval: 25,
                    label: {
                        customizeText: function (arg) {
                            return arg.valueText + " Blocks";
                        }
                    }
                },
                tooltip: { enabled: true },
                title: {
                    text: "Total Blocks Last 48h",
                    font: { size: 28 }
                },
                value: self.nodeStatsData.producedblocks
            }).dxCircularGauge("#producedblocks1");
        };
        nodestats.prototype.ShowError = function (response) {
            DevExpress.ui.notify(JSON.stringify(response), "error", 10000);
            //alert(JSON.stringify(response));
        };
        nodestats.prototype.attached = function () {
            DevExpress.ui.notify('Hello Delegate, Please contribute to NTELO in Mainnet', 'info', 5000);
        };
        nodestats.inject = [auhc.HttpClient];
        return nodestats;
    })();
    exports.nodestats = nodestats;
});
