"use strict";
import auhc = require("aurelia-http-client");
import {AppState} from './app-state';

//var liskBaseUrl = "http://164.132.201.52:7000";
var liskBaseUrl = "";


export class Delegates {
    static inject = [auhc.HttpClient, AppState];

    public heading: string;
    public liskAddr: string;
    public publicKey: string;
    public username: string;
    public accounts: Array<any>;
    public voters: Array<any>;
    public processing: string;
    public isloading: boolean;
    public myVotes: Array<any>;
    public griddata: Array<any>;
   // public appState: AppState;

    constructor(private http: auhc.HttpClient, appState: AppState){
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


    getPublicKey() {

        var self = this;
        this.griddata = [];
        this.refreshGrid();
        return this.getMyVotes().then(() => {

            self.getMyPublicKey()
             //setTimeout(() => self.getPublicKey_(), 100);

        });
      
    }
    getMyPublicKey() {


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
                    self.getWhoVotedMe().then(() => {
                        
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
    }


    getWhoVotedMe() {

        var url = liskBaseUrl + '/api/delegates/voters?publicKey=' + this.publicKey;

        return this.http.get(url)
            .then(response => {

                this.griddata = [];
               
                this.voters= response.content.accounts;
                var novoter = 0;
                for (var i = 0; i < this.myVotes.length; i++) {
                    var data: any = {};
                    data.username = this.myVotes[i].username;
                    data.address = this.myVotes[i].address;

                    data.rate = this.myVotes[i].rate;
                    data.votedonu = "NO";
                    data.producedblocks = this.myVotes[i].producedblocks;
                    data.missedblocks = this.myVotes[i].missedblocks;
                    data.produtivity = this.myVotes[i].produtivity;
                    data.balance = this.myVotes[i].balance;

                    var exists: any = this.voters.find(x=> x.address === data.address);
                    if (exists) {


                        data.votedonu = "YES"
                    }
                    else
                    {
                        novoter += 1;
                    }

                    this.griddata.push(data);

                }
                //if (novoter>0)
                //    DevExpress.ui.notify('In all your votes you have ' + novoter.toString() + ' that did not vote in your node !!!', 'error', 20000);
                //else
                //    DevExpress.ui.notify('all voted on your node', 'info', 10000);


                this.heading = this.username + ' Voted in ' + this.myVotes.length.toString() + ' and number of delegates that did not vote on are ' + novoter.toString();

                return response.content;

               
                // this.prepareVotes(response.content.accounts);
              
            }).catch(Response=> {
                this.ShowError("getWhoVotedMe" + Response);

            });
    }

    getMyVotes() {

        var sel = this;

        var url = liskBaseUrl + "/api/accounts/delegates/?address=" + this.liskAddr;

        return this.http.get(url)
            .then(response => {

                sel.myVotes = response.content.delegates;
                return response.content.delegates;
            }).catch(Response=> {
                this.ShowError(Response);

            });
    }


    
    refreshGrid() {
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
                { dataField: 'votedonu',caption:'voted on you back?' },
                { dataField: 'rate', caption: 'rank'  },
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
                allowedPageSizes: [25,50, 100, 150, 200, 250, 500, 1000]
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
                    // self.getMyPublicKey();
                    
                }
            }
        
        });
    }

    private ShowError(response: any) {
         DevExpress.ui.notify(JSON.stringify(response), "error", 3000);
        //alert(JSON.stringify(response));
    }

    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    getCookie(cname) {
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
    }

    attached() {

        var cookieAddrs: string = this.getCookie("cookieAddrs");
        if (cookieAddrs.length > 0)
            this.liskAddr = cookieAddrs;

        //DevExpress.ui.notify('Hello Delegate, Please contribute to NTELO in Mainnet', 'info', 10000);

       // this.refreshGrid();

    }



}

export class UpperValueConverter {
    toView(value) {
        return value && value.toUpperCase();
    }
}
