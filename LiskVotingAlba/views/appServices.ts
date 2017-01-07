
//import auhc = require("aurelia-http-client");
//import json = require("aurelia-http-client");

//var baseUrl: string = './LiskService.asmx/';


//export class appServices {

//    address: string = '';
//    username: string = '';
//    publicKey: string = '';
//    VotersInAcount: Array<any>;    
 
//    static inject = [auhc.HttpClient, json.HttpClient];

//    constructor(private http: auhc.HttpClient, private json: json.HttpClient) {

                   
//        http.configure(config => {
//            config
//                .withHeader("Content-Type", "application/json; charset=utf-8");
//        });

//        this.address = '';
//    }

//    GetVotersInAccount(address: string) {

//        var url = baseUrl + 'GetVotersInAccount';
//        var data: any = {};
//        data.address = address;
//        this.address = address;
//        this.VotersInAcount = [];


//        return this.http.post(url, JSON.stringify(data))
//            .then(response => {

//                this.address = response.content.d.LiskAccount.account.address;
//                this.username = response.content.d.LiskAccount.account.username;
//                this.publicKey = response.content.d.LiskAccount.account.publicKey;

//                this.VotersInAcount = response.content.d.VotersInAcount;
//                return response.content.d;
                  
//            }).catch(Response=> {
//                this.ShowError(Response);
//                //DevExpress.ui.notify("error.....", "error", 2000);
//            });
//    }

//    private ShowError(response: any) {
//        // DevExpress.ui.notify(JSON.stringify(response), "error", 3000);
//        alert(JSON.stringify(response));
//    }


//}
