define(["require", "exports", "aurelia-http-client"], function (require, exports, auhc) {
    var url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=rainier&tagmode=any&format=json";
    var url_pk = "http://lisk.ntelo.net/api/accounts?address=10339669348282661060L";
    var url_voter = "http://lisk.ntelo.net/api/delegates/voters?publicKey=07bf1e1d568f258118a2731f43257923d2993510643287b96f852686831423f6";
    var Home = (function () {
        function Home(http) {
            this.http = http;
            this.heading = "Get who voted on your Lisk Node!";
            this.publicKey = "";
            this.liskAddr = "";
            this.username = "";
            this.accounts = [];
            this.voters = [];
            http.configure(function (config) {
                config
                    .withHeader("Content-Type", "application/json; charset=utf-8");
            });
        }
        Home.prototype.getPublicKey = function () {
            alert('Wait a couple a seconds Lisker we are processing your request!');
            // toastr.info('Wait a couple a seconds Lisker we are processing your request!');
            this.voters = [];
            var self = this;
            $.ajax({
                type: 'GET',
                url: 'http://5.189.153.97:7000/api/accounts?address=' + this.liskAddr,
                async: false,
                jsonpCallback: 'jsonCallback',
                // contentType: "application/json",
                //dataType: 'jsonp',
                success: function (json) {
                    self.username = json.account.username;
                    self.publicKey = json.account.publicKey;
                    self.heading = json.account.username + ' ' + json.account.publicKey;
                    if (json.account.publicKey)
                        self.getVotes();
                    //alert(json);
                },
                error: function (e) {
                    console.log("error");
                }
            });
        };
        Home.prototype.setDelegateName = function (adrr, index) {
            var self = this;
            $.ajax({
                type: 'GET',
                url: 'http://5.189.153.97:7000/api/accounts?address=' + adrr,
                async: false,
                jsonpCallback: 'jsonCallback',
                // contentType: "application/json",
                //dataType: 'jsonp',
                success: function (json) {
                    //self.accounts[index].address = json.account.username;
                    self.voters.push(json.account.username + '  - publicKey:' + json.account.publicKey);
                    //alert(json);
                },
                error: function (e) {
                    return "";
                    // console.log("error");
                }
            });
        };
        Home.prototype.getVotes = function () {
            //http://5.189.153.97:7000/api/delegates/voters?publicKey=07bf1e1d568f258118a2731f43257923d2993510643287b96f852686831423f6
            var self = this;
            $.ajax({
                type: 'GET',
                url: 'http://5.189.153.97:7000/api/delegates/voters?publicKey=' + this.publicKey,
                async: false,
                jsonpCallback: 'jsonCallback',
                // contentType: "application/json",
                //dataType: 'jsonp',
                success: function (json) {
                    self.accounts = json.accounts;
                    for (var i = 0; i < self.accounts.length; i++) {
                        self.setDelegateName(self.accounts[i].address, i);
                    }
                    alert('DONE! Please contribute to NTELO in Mainnet');
                },
                error: function (e) {
                    console.log("error");
                }
            });
        };
        Home.inject = [auhc.HttpClient];
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
//# sourceMappingURL=home.js.map