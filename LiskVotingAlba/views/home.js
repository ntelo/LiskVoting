define(["require", "exports", "aurelia-http-client", './app-state'], function (require, exports, auhc, app_state_1) {
    "use strict";
    //var baseurl = "http://164.132.201.52:7000";
    var baseurl = "";
    var home = (function () {
        function home(http, appState) {
            this.http = http;
            baseurl = appState.liskBaseUrl;
            this.heading = "Get who voted in your Lisk Node,and if you voted back!";
            this.publicKey = "";
            this.liskAddr = "";
            this.username = "";
            this.accounts = [];
            this.voters = [];
            this.isloading = false;
        }
        home.prototype.getPublicKey = function () {
            var self = this;
            this.refreshGrid();
            this.getMyVotes().then(function () {
                self.getMyPublicKey();
            });
        };
        home.prototype.getMyVotes = function () {
            var _this = this;
            var sel = this;
            // this.appState.address = this.liskAddr;
            var url = baseurl + "/api/accounts/delegates/?address=" + this.liskAddr;
            return this.http.get(url)
                .then(function (response) {
                sel.myVotes = response.content.delegates;
                return response.content.delegates;
            }).catch(function (Response) {
                _this.ShowError(Response);
            });
        };
        home.prototype.getMyPublicKey = function () {
            this.voters = [];
            this.listdata = [];
            var self = this;
            this.setCookie("cookieAddrs", this.liskAddr, 30);
            $.ajax({
                type: 'GET',
                url: baseurl + '/api/accounts?address=' + this.liskAddr,
                async: false,
                jsonpCallback: 'jsonCallback',
                // contentType: "application/json",
                //dataType: 'jsonp',
                success: function (json) {
                    self.username = json.account.username ? json.account.username : "";
                    self.publicKey = json.account.publicKey;
                    self.heading = json.account.username;
                    if (json.account.publicKey) {
                        self.getWhoVotedMe();
                    }
                    self.heading = "List off who voted in your Lisk Node! " + self.username;
                },
                error: function (e) {
                    console.log("error");
                    this.isloading = false;
                }
            });
        };
        home.prototype.getWhoVotedMe = function () {
            var _this = this;
            var url = baseurl + '/api/delegates/voters?publicKey=' + this.publicKey;
            this.http.get(url)
                .then(function (response) {
                _this.prepareVotes(response.content.accounts);
            }).catch(function (Response) {
                _this.ShowError("getWhoVotedMe" + Response);
            });
        };
        home.prototype.prepareVotes = function (accounts) {
            var _this = this;
            this.accounts = accounts;
            for (var i = 0; i < this.accounts.length; i++) {
                this.setDelegateName(this.accounts[i].address, this.accounts[i].username, i).then(function () { }).then(function () {
                    _this.refreshGrid();
                });
            }
            //DevExpress.ui.notify('Hey ' + this.username + ' you have ' + this.accounts.length.toString() + '! Please contribute to NTELO in Mainnet', 'success', 5000);
            this.refreshGrid();
            this.isloading = false;
        };
        home.prototype.setDelegateName = function (adrr, username, index) {
            var _this = this;
            this.processing = ' Votes: ' + this.accounts.length.toString();
            var url = baseurl + '/api/accounts?address=' + adrr;
            return this.http.get(url)
                .then(function (response) {
                var votedBacck = " NO ";
                var produtivity = "?";
                var rate = "?";
                var producedblocks = "?";
                var missedblocks = "";
                var exists = _this.myVotes.find(function (x) { return x.address === response.content.account.address; });
                if (exists) {
                    votedBacck = "YES";
                    produtivity = exists.productivity;
                    rate = exists.rate;
                    producedblocks = exists.producedblocks;
                    missedblocks = exists.missedblocks;
                }
                var data = {};
                data.address = response.content.account.address;
                data.username = username;
                data.votedBacck = votedBacck;
                data.rate = rate;
                data.producedblocks = producedblocks;
                data.missedblocks = missedblocks;
                data.produtivity = produtivity;
                data.balance = response.content.account.balance;
                _this.listdata.push(data);
                //if (adrr!='') {
                // //   this.listdata.push(data);
                //    //services changed
                //       if (exists)
                //        this.listdata.push(data);
                //    else {
                //           //return this.getDelegate(response.content.account.address).then((response) => {
                //           return this.getDelegateName(adrr).then((response) => {
                //               if (response.d != undefined)
                //                   data.username = response.d.username;
                //               else {
                //                   data.username = "?";
                //               }
                //            this.listdata.push(data);
                //        })
                //    }
                //}
            }).catch(function (Response) {
                //this.ShowError("setDelegateName" + Response);
            });
        };
        home.prototype.getDelegateName = function (address) {
            var baseUrlService = './LiskService.asmx/';
            var self = this;
            var url = baseUrlService + 'GetDelegate202';
            var data = {};
            data.address = address;
            return $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    return response;
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        };
        //getDelegate(username: any) {
        //    //http://164.132.201.52:7000/api/delegates/get?username=NTELO
        //    var url = baseurl + '/api/delegates/get?username=' + username;
        //    return this.http.get(url)
        //        .then(response => {
        //            return response.content.delegate;
        //        }).catch(Response=> {
        //            this.ShowError("getDelegate" + Response);
        //        });
        //}
        home.prototype.refreshGrid = function () {
            var self = this;
            var datasource = this.listdata;
            $("#gridContainer").dxDataGrid({
                dataSource: datasource,
                height: function () {
                    return window.innerHeight - $('#footer').height() - $('.navbar').height() - $('.card').height() - 20;
                },
                columns: [
                    { dataField: 'username' },
                    { dataField: 'address' },
                    { dataField: 'votedBacck', caption: 'you voted back?' },
                    { dataField: 'rate', caption: 'rank' },
                    { dataField: 'producedblocks' },
                    { dataField: 'missedblocks' },
                    { dataField: 'produtivity', caption: 'productivity' },
                    { dataField: 'balance' }
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
        home.prototype.setCookie = function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        };
        home.prototype.getCookie = function (cname) {
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
        home.prototype.ShowError = function (response) {
            // DevExpress.ui.notify(JSON.stringify(response), "error", 3000);
            //alert(JSON.stringify(response));
        };
        home.prototype.attached = function () {
            var cookieAddrs = this.getCookie("cookieAddrs");
            if (cookieAddrs.length > 0)
                this.liskAddr = cookieAddrs;
            // this.refreshGrid();
            // DevExpress.ui.notify('Hello Delegate, please get who voted on your node, be patient, execution time depends on number of votes you have! \n Please contribute to NTELO in Mainnet', 'info', 10000);
        };
        home.inject = [auhc.HttpClient, app_state_1.AppState];
        return home;
    })();
    exports.home = home;
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
//# sourceMappingURL=home.js.map