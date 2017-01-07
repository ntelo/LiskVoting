define(["require", "exports", "aurelia-http-client", './app-state'], function (require, exports, auhc, app_state_1) {
    "use strict";
    //var baseUrl: string = './LiskService.asmx/';
    //var baseurlLisk = "http://5.189.153.97:7000";
    var baseUrl = '';
    var baseurlLisk = '';
    var nodestatsvotes = (function () {
        function nodestatsvotes(http, appState) {
            this.http = http;
            baseUrl = appState.baseUrl;
            baseurlLisk = appState.liskBaseUrl;
            this.heading = "Node last 48h Votes Stats";
            this.nodeStatsData = [];
            this.liskAddr = "";
            this.username = "";
        }
        nodestatsvotes.prototype.loadCharts = function () {
            this.loadChartVotes();
        };
        nodestatsvotes.prototype.GetEvolutionStats = function () {
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
        nodestatsvotes.prototype.setCookie = function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        };
        nodestatsvotes.prototype.getCookie = function (cname) {
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
        nodestatsvotes.prototype.loadChartVotes = function () {
            var self = this;
            try {
                var votesreceived = $("#votesreceived").dxCircularGauge({
                    scale: {
                        startValue: 0,
                        endValue: 300,
                        tickInterval: 10,
                        label: {
                            customizeText: function (arg) {
                                return arg.valueText + " Votes";
                            }
                        }
                    },
                    tooltip: { enabled: true },
                    title: {
                        text: "Votes Received Last 48h (" + self.nodeStatsData.votesreceivedTotal + ")",
                        font: { size: 28 }
                    },
                    value: self.nodeStatsData.votesreceivedTotal
                }).dxCircularGauge("#votesreceived");
            }
            catch (err) {
            }
            try {
                var votesmade = $("#votesmade").dxCircularGauge({
                    scale: {
                        startValue: 0,
                        endValue: 102,
                        tickInterval: 10,
                        label: {
                            customizeText: function (arg) {
                                return arg.valueText + " Votes";
                            }
                        }
                    },
                    tooltip: { enabled: true },
                    title: {
                        text: "Votes Made Last 48h (" + self.nodeStatsData.votesmadeTotal + ")",
                        font: { size: 28 }
                    },
                    value: self.nodeStatsData.votesmadeTotal
                }).dxCircularGauge("#votesmade");
            }
            catch (err) {
            }
        };
        nodestatsvotes.prototype.ShowError = function (response) {
            DevExpress.ui.notify(JSON.stringify(response), "error", 10000);
            //alert(JSON.stringify(response));
        };
        nodestatsvotes.prototype.attached = function () {
            var self = this;
            var cookieAddrs = this.getCookie("cookieAddrs");
            if (cookieAddrs.length > 0) {
                this.liskAddr = cookieAddrs;
                this.GetEvolutionStats();
            }
            //DevExpress.ui.notify('Hello Delegate, Please contribute to NTELO in Mainnet', 'info', 5000);
        };
        nodestatsvotes.inject = [auhc.HttpClient, app_state_1.AppState];
        return nodestatsvotes;
    })();
    exports.nodestatsvotes = nodestatsvotes;
});
//# sourceMappingURL=nodestatsvotes.js.map