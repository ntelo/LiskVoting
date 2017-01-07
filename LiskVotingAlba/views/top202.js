define(["require", "exports", "aurelia-http-client", './app-state'], function (require, exports, auhc, app_state_1) {
    "use strict";
    var baseUrl = '';
    var baseurlLisk = '';
    var Top202 = (function () {
        function Top202(http, appState) {
            this.http = http;
            baseUrl = appState.baseUrl;
            baseurlLisk = appState.liskBaseUrl;
            this.heading = "Get Top 202 Delegate Vote Statistics!. And if they voted on you?";
            this.liskAddr = "";
            this.currentliskAddr = "";
            this.username = "";
            this.isloading = false;
            this.griddata = [];
            this.myVotes = [];
            var self = this;
        }
        Top202.prototype.GetData = function () {
            var _this = this;
            this.refreshGrid();
            var self = this;
            if (this.liskAddr.length > 0) {
                this.setCookie("cookieAddrs", this.liskAddr, 30);
                this.griddata = [];
                this.refreshGrid();
                $("#gridContainer").dxDataGrid('instance').beginCustomLoading("Loading");
                this.getMyVotes().then(function () {
                    _this.Get202Statistics().then(function (response) {
                        _this.refreshGrid();
                        //self.griddata = response;
                        $("#gridContainer").dxDataGrid('instance').endCustomLoading();
                    });
                });
            }
        };
        Top202.prototype.Get202Statistics = function () {
            var self = this;
            var url = baseUrl + 'GetTop202Stats';
            var data = {};
            data.address = self.liskAddr;
            //DevExpress.ui.notify('Top 202 statistics are refresh every 3 min with BlockChain!!!!','warning' ,6000);
            return $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    var prepareResult;
                    prepareResult = response.d;
                    var data = {};
                    for (var i = 0; i < prepareResult.length; i++) {
                        var votedBacck = "NO";
                        var exists = self.myVotes.find(function (x) { return x.address === prepareResult[i].address; });
                        if (exists) {
                            votedBacck = "YES";
                        }
                        data = new Object();
                        data.votedBacck = votedBacck;
                        data.username = prepareResult[i].username;
                        data.address = prepareResult[i].address;
                        data.rate = prepareResult[i].rate;
                        data.VotedOnMe = prepareResult[i].VotedOnMe;
                        data.productivity = prepareResult[i].productivity;
                        data.NumberVotesMade = prepareResult[i].NumberVotesMade;
                        data.producedblocks = prepareResult[i].producedblocks;
                        data.missedblocks = prepareResult[i].missedblocks;
                        data.NumberVotesReceived = prepareResult[i].NumberVotesReceived;
                        data.Forged = prepareResult[i].Forged;
                        data.balance = prepareResult[i].balance;
                        data.NumberVotesReceivedWithoutTop200 = prepareResult[i].NumberVotesReceivedWithoutTop200;
                        self.griddata.push(data);
                    }
                    return response.d;
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        };
        Top202.prototype.getMyVotes = function () {
            var _this = this;
            var sel = this;
            // this.appState.address = this.liskAddr;
            var url = baseurlLisk + "/api/accounts/delegates/?address=" + this.liskAddr;
            return this.http.get(url)
                .then(function (response) {
                sel.myVotes = response.content.delegates;
                return response.content.delegates;
            }).catch(function (Response) {
                _this.ShowError(Response);
            });
        };
        Top202.prototype.refreshGrid = function () {
            var datasource = this.griddata;
            var self = this;
            $("#gridContainer").dxDataGrid({
                dataSource: self.griddata,
                height: function () {
                    return window.innerHeight - $('#footer').height() - $('.navbar').height() - $('.card').height() - 20;
                },
                //dataSource: self.ds,
                columns: [
                    { dataField: 'rate', caption: 'rank' },
                    { dataField: 'username' },
                    { dataField: 'address' },
                    {
                        dataField: 'VotedOnMe',
                        caption: 'voted on u?',
                        calculateCellValue: function (data) {
                            return data.VotedOnMe == 1 ? "YES" : "NO";
                        }
                    },
                    { dataField: 'votedBacck', caption: 'you voted back?' },
                    {
                        dataField: 'NumberVotesMade',
                        caption: 'VotesMade'
                    },
                    { dataField: 'NumberVotesReceived', caption: 'VotesReceived' },
                    { dataField: 'Forged' },
                    { dataField: 'balance' },
                    { dataField: 'productivity' },
                    { dataField: 'producedblocks' },
                    { dataField: 'missedblocks' },
                    { dataField: 'NumberVotesReceivedWithoutTop200', caption: 'Votes received below 202' },
                ],
                selection: { mode: 'single' },
                groupPanel: {
                    visible: true
                },
                columnAutoWidth: true,
                paging: { pageSize: 20 },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [20, 50, 101, 202]
                },
                headerFilter: {
                    visible: true
                },
                filterRow: { visible: true },
                hoverStateEnabled: true,
                rowAlternationEnabled: true,
                onSelectionChanged: function (selectedItems) {
                    var data = selectedItems.selectedRowsData[0];
                    if (data) {
                        self.liskAddr = data.address;
                        //DevExpress.ui.notify('You have change Address to ' + data.username + ' - ' + data.address + ' Please Search Again ! Please contribute to NTELO in Mainnet', 'warning', 3000);
                        self.heading = "Get Top 202 Delegate Vote Statistics!. And if they voted on you" + data.username + "?";
                    }
                }
            });
        };
        Top202.prototype.setCookie = function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        };
        Top202.prototype.getCookie = function (cname) {
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
        Top202.prototype.ShowError = function (response) {
            DevExpress.ui.notify(JSON.stringify(response), "error", 10000);
            //alert(JSON.stringify(response));
        };
        Top202.prototype.attached = function () {
            var cookieAddrs = this.getCookie("cookieAddrs");
            if (cookieAddrs.length > 0) {
                this.liskAddr = cookieAddrs;
            }
        };
        Top202.inject = [auhc.HttpClient, app_state_1.AppState];
        return Top202;
    })();
    exports.Top202 = Top202;
});
//# sourceMappingURL=top202.js.map