define(["require", "exports", "./appServices"], function (require, exports, appServices_1) {
    "use strict";
    var baseurl = "http://5.189.153.97:7000";
    var Home = (function () {
        //constructor(private http: auhc.HttpClient, services: appServices) {
        function Home(services) {
            this.heading = "Get who voted in your Lisk Node,and if you voted back!";
            this.publicKey = "";
            this.liskAddr = "";
            this.username = "";
            this.accounts = [];
            this.voters = [];
            this.isloading = false;
            this.services = services;
            //http.configure(config => {
            //    config
            //        .withHeader("Content-Type", "application/json; charset=utf-8");
            //});
            this.GetVotersInMyAccount();
        }
        Home.prototype.GetVotersInMyAccount = function () {
            this.services.GetVotersInAccount("10339669348282661060L").then(function (res) {
                alert(res);
            });
        };
        Home.prototype.getPublicKey = function () {
            //var self = this;
            //this.isloading = true;
            //this.getMyVotes().then(()=>{
            //    self.getMyPublicKey()
            //     //setTimeout(() => self.getPublicKey_(), 100);
            //});
        };
        Home.prototype.getMyVotes = function () {
            //var sel = this;
            //var url = baseurl + "/api/accounts/delegates/?address=" + this.liskAddr;
            //return this.http.get(url)
            //    .then(response => {
            //        sel.myVotes = response.content.delegates;
            //        return response.content.delegates;
            //    }).catch(Response=> {
            //        this.ShowError(Response);
            //    });
        };
        Home.prototype.getMyPublicKey = function () {
            this.voters = [];
            this.listdata = [];
            var self = this;
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
        Home.prototype.getWhoVotedMe = function () {
            //var url = baseurl + '/api/delegates/voters?publicKey=' + this.publicKey;
            // this.http.get(url)
            //    .then(response => {
            //         this.prepareVotes(response.content.accounts);
            //    }).catch(Response=> {
            //        this.ShowError("getWhoVotedMe" + Response);
            //    });
        };
        Home.prototype.prepareVotes = function (accounts) {
            //this.accounts = accounts;
            //for (var i = 0; i < this.accounts.length; i++) {
            //    this.setDelegateName(this.accounts[i].address, i).then(() => { }).then(() => {
            //        this.refreshGrid();
            //    });
            //}
            //DevExpress.ui.notify('Hey ' + this.username + ' you have ' + this.accounts.length.toString() + '! Please contribute to NTELO in Mainnet', 'success', 5000);
            //this.refreshGrid();
            //this.isloading = false;
        };
        Home.prototype.setDelegateName = function (adrr, index) {
            //this.processing = ' Votes: ' + this.accounts.length.toString();
            //var url = baseurl + '/api/accounts?address=' + adrr;
            //return this.http.get(url)
            //    .then(response => {
            //        var votedBacck = " NO ";
            //        var produtivity = "?";
            //        var rate = "?";
            //        var producedblocks = "?";
            //        var missedblocks = "";
            //        var exists: any = this.myVotes.find(x=> x.address === response.content.account.address);
            //        if (exists) {
            //            votedBacck = "YES";
            //            produtivity = exists.productivity;
            //            rate = exists.rate;
            //            producedblocks = exists.producedblocks;
            //            missedblocks = exists.missedblocks;
            //        }
            //        var data: any = {};
            //        data.address = response.content.account.address;
            //        data.username = response.content.account.username;
            //        data.votedBacck = votedBacck;
            //        data.rate = rate;
            //        data.producedblocks = producedblocks;
            //        data.missedblocks = missedblocks;
            //        data.produtivity = produtivity;
            //        data.balance = response.content.account.balance;
            //        if (response.content.account.username) {
            //            if (exists)
            //                this.listdata.push(data);
            //            else {
            //                return this.getDelegate(response.content.account.username).then((response) => {
            //                    data.produtivity = response.produtivity;
            //                    data.rate = response.rate;
            //                    data.producedblocks = response.producedblocks;
            //                    data.missedblocks = response.missedblocks;
            //                    this.listdata.push(data);
            //                })
            //            }
            //        }
            //    }).catch(Response=> {
            //        //this.ShowError("setDelegateName" + Response);
            //    });
        };
        Home.prototype.getDelegate = function (username) {
            ////http://164.132.201.52:7000/api/delegates/get?username=NTELO
            //var url = baseurl + '/api/delegates/get?username=' + username;
            //return this.http.get(url)
            //    .then(response => {
            //        return response.content.delegate;
            //    }).catch(Response=> {
            //        this.ShowError("getDelegate" + Response);
            //    });
        };
        Home.prototype.refreshGrid = function () {
            //var datasource = this.listdata;
            //$("#gridContainer").dxDataGrid({
            //    dataSource: datasource,
            //    columns: [
            //        { dataField: 'username' },
            //        { dataField: 'address' },
            //        { dataField: 'votedBacck',caption:'you voted back?' },
            //        { dataField: 'rate', caption: 'rank'  },
            //        { dataField: 'producedblocks' },
            //        { dataField: 'missedblocks' },
            //        { dataField: 'produtivity', caption:'productivity' },
            //        { dataField: 'balance' }
            //    ],
            //    selection: { mode: 'single' },
            //    groupPanel: {
            //        visible: true
            //    },
            //    paging: { pageSize: 200 },
            //    pager: {
            //        showPageSizeSelector: true,
            //        allowedPageSizes: [100,200,300]
            //    },
            //    hoverStateEnabled: true,
            //    rowAlternationEnabled: true
            //});
        };
        Home.prototype.ShowError = function (response) {
            DevExpress.ui.notify(JSON.stringify(response), "error", 3000);
            //alert(JSON.stringify(response));
        };
        Home.prototype.attached = function () {
            DevExpress.ui.notify('Hello Delegate, please get who voted on your node, be patient, execution time depends on number of votes you have! \n Please contribute to NTELO in Mainnet', 'info', 10000);
        };
        //static inject = [auhc.HttpClient, appServices];
        Home.inject = [appServices_1.appServices];
        return Home;
    })();
    exports.Home = Home;
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
//# sourceMappingURL=home - Copy.js.map