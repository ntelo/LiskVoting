 "use strict";
import auhc = require("aurelia-http-client");
import {AppState} from './app-state';

//var baseUrl: string = './LiskService.asmx/';
var baseUrl: string = '';


export class Dashboard {
    static inject = [auhc.HttpClient, AppState];

    public heading: string;


    public top25Missers24H: any;
    public top25MForgers24H: any;
    public topForgers: any;
    public topMissers: any;
    public instantStats24: any;

    constructor(private http: auhc.HttpClient, appState: AppState) {

        baseUrl = appState.baseUrl;
        this.heading = "Lisk DashBoard";

        this.top25Missers24H = [];
        this.top25MForgers24H = [];
        this.topForgers = [];
        this.topMissers = [];
        this.instantStats24 = [];



    }

    activate() {

        //return Promise.all([this.GetTop25MissersInstantStats24h(), this.GetTopForgers(), this.GetTopMissers(), this.GetTop25MForgersInstantStats24h(), this.GetInstantStats24h()])
        //    .then(function (results) {
        //        return results;
        //    });

        return Promise.all([ this.GetTopForgers(), this.GetTopMissers(), this.GetInstantStats24h()])
            .then(function (results) {
                return results;
            });

    }



    LoadData() {

        try {

            this.loadGrid();
           // this.loadChartBlockMissers();
            this.loadChartForgers();
            this.loadChartMissers();
          //  this.loadCharForgers24();
        }
        catch (ex)
        {
        }
       
    }

    

    GetInstantStats24h() {
        var self = this;
        var url = baseUrl + 'GetInstantStats24h';


        try {

            return $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    self.instantStats24 = response.d;

                   // self.loadChartBlockMissers();
                    return response.d;
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });

        }
        catch (ex) {
        }

      

    }

    loadGrid() {
       
        var self = this;
        $("#gridContainer").dxDataGrid({
            dataSource: self.instantStats24,
            //dataSource: self.ds,
            columns: [
               
                { dataField: 'rate' },
                { dataField: 'username' },
                { dataField: 'producedblocks' },
                { dataField: 'missedblocks' },
              
                { dataField: 'productivity' },
                { dataField: 'address' },
                { dataField: 'publicKey' }
                //{ dataField: 'date', caption: 'Date sync' }


            ],
            selection: { mode: 'single' },
            groupPanel: {
                visible: true
            },
            columnAutoWidth: true,
            paging: { pageSize: 10 },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [20, 50, 101]
            },
            headerFilter: {
                visible: true
            },
            filterRow: { visible: true },
            hoverStateEnabled: true,
            rowAlternationEnabled: true
         

        });
    }

    


    GetTopForgers() {
        var self = this;
        var url = baseUrl + 'GetTopForgers';
        this.topForgers = [];


        try {

            return $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    self.topForgers = response.d;

                    self.loadChartForgers();
                    return response.d;
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });

        }
        catch (ex) {
        }

    

    }

    GetTopMissers() {
        var self = this;
        var url = baseUrl + 'GetTopMissedBlockers';
        this.topForgers = [];


        try {

            return $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    self.topMissers = response.d;

                    self.loadChartMissers();
                    return response.d;
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });

        }
        catch (ex) {
        }

     

    }

    loadChartMissers() {

        var self = this;
        var options: DevExpress.viz.charts.dxPieChartOptions = {
            size: {
                width: 500
            },
            dataSource: self.topMissers,
            title: "Top 10 Missed Blocks AllTD",

            series: [{
                argumentField: "username",
                valueField: "missedblocks",
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1
                    }
                },
                name: "missed Blocks"

            }],

        };

        $('#containerMissers').dxPieChart(options);

    }
    loadChartForgers() {

        var self = this;
        var options: DevExpress.viz.charts.dxPieChartOptions = {
            size: {
                width: 500
            },
            dataSource: self.topForgers,
            title: "Top 10 Forgers AllTD",

            series: [{
                argumentField: "username",
                valueField: "producedblocks",
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1
                    }
                },
                name: "Forging"
                // ,type: "bar",
                // color: '#ffa500'

            }],

        };

        $('#containerForgers').dxPieChart(options);

    }

    


    private ShowError(response: any) {
        DevExpress.ui.notify(JSON.stringify(response), "error", 10000);
        //alert(JSON.stringify(response));
    }

    attached() {



        this.LoadData();
        this.loadGrid();


       // DevExpress.ui.notify('Hello Delegate, Please contribute to NTELO in Mainnet', 'info', 5000);



    }



}

