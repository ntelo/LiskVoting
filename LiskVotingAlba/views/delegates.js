define(["require", "exports", "aurelia-http-client", './app-state'], function (require, exports, auhc, app_state_1) {
    "use strict";
    //var liskBaseUrl = "http://164.132.201.52:7000";
    var liskBaseUrl = "";
    var Delegates = (function () {
        // public appState: AppState;
        function Delegates(http, appState) {
            this.http = http;
            this.heading = "Get your delegate votes,and if they voted back on you!";
            this.publicKey = "";
            this.liskAddr = "";
            this.username = "";
            this.accounts = [];
            this.voters = [];
            this.isloading = false;
            this.griddata = [];
            liskBaseUrl = appState.liskBaseUrl;
        }
        Delegates.prototype.getPublicKey = function () {
            var self = this;
            this.griddata = [];
            this.refreshGrid();
            return this.getMyVotes().then(function () {
                self.getMyPublicKey();
                //setTimeout(() => self.getPublicKey_(), 100);
            });
        };
        Delegates.prototype.getMyPublicKey = function () {
            this.voters = [];
            this.griddata = [];
            var self = this;
            this.setCookie("cookieAddrs", this.liskAddr, 30);
            $.ajax({
                type: 'GET',
                url: liskBaseUrl + '/api/accounts?address=' + this.liskAddr,
                async: false,
                jsonpCallback: 'jsonCallback',
                // contentType: "application/json",
                //dataType: 'jsonp',
                success: function (json) {
                    self.username = json.account.username ? json.account.username : "";
                    self.publicKey = json.account.publicKey;
                    self.heading = json.account.username;
                    if (json.account.publicKey) {
                        self.getWhoVotedMe().then(function () {
                            self.refreshGrid();
                        });
                    }
                    //self.heading = "List off your delegates, see who voted in your Node! " + self.username;
                },
                error: function (e) {
                    console.log("error");
                    this.isloading = false;
                }
            });
        };
        Delegates.prototype.getWhoVotedMe = function () {
            var _this = this;
            var url = liskBaseUrl + '/api/delegates/voters?publicKey=' + this.publicKey;
            return this.http.get(url)
                .then(function (response) {
                _this.griddata = [];
                _this.voters = response.content.accounts;
                var novoter = 0;
                for (var i = 0; i < _this.myVotes.length; i++) {
                    var data = {};
                    data.username = _this.myVotes[i].username;
                    data.address = _this.myVotes[i].address;
                    data.rate = _this.myVotes[i].rate;
                    data.votedonu = "NO";
                    data.producedblocks = _this.myVotes[i].producedblocks;
                    data.missedblocks = _this.myVotes[i].missedblocks;
                    data.produtivity = _this.myVotes[i].produtivity;
                    data.balance = _this.myVotes[i].balance;
                    var exists = _this.voters.find(function (x) { return x.address === data.address; });
                    if (exists) {
                        data.votedonu = "YES";
                    }
                    else {
                        novoter += 1;
                    }
                    _this.griddata.push(data);
                }
                //if (novoter>0)
                //    DevExpress.ui.notify('In all your votes you have ' + novoter.toString() + ' that did not vote in your node !!!', 'error', 20000);
                //else
                //    DevExpress.ui.notify('all voted on your node', 'info', 10000);
                _this.heading = _this.username + ' Voted in ' + _this.myVotes.length.toString() + ' and number of delegates that did not vote on are ' + novoter.toString();
                return response.content;
                // this.prepareVotes(response.content.accounts);
            }).catch(function (Response) {
                _this.ShowError("getWhoVotedMe" + Response);
            });
        };
        Delegates.prototype.getMyVotes = function () {
            var _this = this;
            var sel = this;
            var url = liskBaseUrl + "/api/accounts/delegates/?address=" + this.liskAddr;
            return this.http.get(url)
                .then(function (response) {
                sel.myVotes = response.content.delegates;
                return response.content.delegates;
            }).catch(function (Response) {
                _this.ShowError(Response);
            });
        };
        Delegates.prototype.refreshGrid = function () {
            var self = this;
            var datasource = this.griddata;
            $("#gridContainer").dxDataGrid({
                dataSource: datasource,
                height: function () {
                    return window.innerHeight - $('#footer').height() - $('.navbar').height() - $('.card').height() - 20;
                },
                columns: [
                    { dataField: 'username' },
                    { dataField: 'address' },
                    { dataField: 'votedonu', caption: 'voted on you back?' },
                    { dataField: 'rate', caption: 'rank' },
                    { dataField: 'producedblocks' },
                    { dataField: 'missedblocks' }
                ],
                selection: { mode: 'single' },
                columnAutoWidth: true,
                groupPanel: {
                    visible: true
                },
                headerFilter: {
                    visible: true
                },
                filterRow: { visible: true },
                paging: { pageSize: 20 },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [25, 50, 100, 150, 200, 250, 500, 1000]
                },
                hoverStateEnabled: true,
                rowAlternationEnabled: true,
                onSelectionChanged: function (selectedItems) {
                    var data = selectedItems.selectedRowsData[0];
                    if (data) {
                        //$(".employeeNotes").text(data.Notes);
                        //$(".employeePhoto").attr("src", data.Picture);
                        // alert(data.address);
                        self.liskAddr = data.address;
                        DevExpress.ui.notify('You have change Address to ' + data.username + ' - ' + data.address + ' Please Search Again ! Please contribute to NTELO in Mainnet', 'warning', 5000);
                    }
                }
            });
        };
        Delegates.prototype.ShowError = function (response) {
            DevExpress.ui.notify(JSON.stringify(response), "error", 3000);
            //alert(JSON.stringify(response));
        };
        Delegates.prototype.setCookie = function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        };
        Delegates.prototype.getCookie = function (cname) {
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
        Delegates.prototype.attached = function () {
            var cookieAddrs = this.getCookie("cookieAddrs");
            if (cookieAddrs.length > 0)
                this.liskAddr = cookieAddrs;
            //DevExpress.ui.notify('Hello Delegate, Please contribute to NTELO in Mainnet', 'info', 10000);
            // this.refreshGrid();
        };
        Delegates.inject = [auhc.HttpClient, app_state_1.AppState];
        return Delegates;
    })();
    exports.Delegates = Delegates;
    var UpperValueConverter = (function () {
        function UpperValueConverter() {
        }
        UpperValueConverter.prototype.toView = function (value) {
            return value && value.toUpperCase();
        };
        return UpperValueConverter;
    })();
    exports.UpperValueConverter = UpperValueConverter;
});
//# sourceMappingURL=delegates.js.map