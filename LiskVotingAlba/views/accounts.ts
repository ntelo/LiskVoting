"use strict";
import auhc = require("aurelia-http-client");
import {AppState} from './app-state';

//var baseUrl: string = './LiskService.asmx/';
var baseUrl: string = '';

export class Accounts {
    static inject = [auhc.HttpClient, AppState];

    public heading: string;

   
    public top25MBalance: any;
    public listBalance: any;
   

    constructor(private http: auhc.HttpClient, appState:AppState) {
        this.heading = "Accounts DashBoard";

        this.top25MBalance = [];
        this.listBalance = [];

       // this.appState = appState;
        baseUrl = appState.baseUrl;

    }

    activate() {

        return Promise.all([this.GetTop25Top25Balance(), this.GetallBalance()])
            .then(function (results) {
                return results;
            });

    }



    LoadData() {

        try {

         
            this.loadChartTop25Balance();
            this.loadGrid();
        }
        catch (ex)
        {
        }
       
    }

    GetTop25Top25Balance() {
        var self = this;
        var url = baseUrl + 'GetMenAccountsTop25Balance';

        try {

            return $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    self.top25MBalance = response.d;

                    self.loadChartTop25Balance();
                    return response.d;
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
        catch(ex)
        {

        }
      

    }

   

    loadChartTop25Balance() {

        var self = this;


        var options: DevExpress.viz.charts.dxChartOptions = {
            title: "Accounts Top 25 Balance %Total",
            dataSource: self.top25MBalance,
            palette: 'Soft Pastel',
            tooltip: {
                enabled: true
            },
            equalBarWidth: false,
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center'
            },
            commonSeriesSettings: {
                argumentField: 'username',
                type: 'bar',
                label: {
                    visible: true,
                    connector: { visible: true },
                    format: 'largeNumber',
                    precision: 2,
                    alignment: 'left'
                }
            },
            series: [{
                argumentField: "username",
                valueField: "balancePercentTotal",
                name: "balancePercentTotal",
                type: "bar",
                color: '#20A8D8'
            }],
            argumentAxis: {
                type: 'discrete',
                //tickInterval: 5,
                label: {
                    overlappingBehavior: { mode: 'rotate', rotationAngle: 65 }
                }
            },
        };


        $('#containertop25Balance').dxChart(options);

    }

    GetallBalance() {
        var self = this;
        var url = baseUrl + 'GetMenAccounts';

        try {

            return $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    self.listBalance = response.d;

                    //self.loadGrid();
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
        $("#gridContainermenaccounts").dxDataGrid({
            dataSource: self.listBalance,
            //dataSource: self.ds,
            //height: function () {
            //    return window.innerHeight - $('#footer').height() - $('.navbar').height() - $('.card').height() - 20;
            //},
            height:800,
            columns: [

                { dataField: 'rate',caption:'Rank' },
                { dataField: 'username' },
                { dataField: 'address' },

                //{ dataField: 'isDelegate' },

                { dataField: 'balance' },
                { dataField: 'balancePercentTotal' },
                { dataField: 'vote' },
                { dataField: 'votePercentTotal' },
                { dataField: 'producedblocks' },
                { dataField: 'missedblocks' },
                { dataField: 'fees' },
                { dataField: 'rewards' }
                //{ dataField: 'date', caption: 'Date sync' }


            ],
            selection: { mode: 'single' },
            groupPanel: {
                visible: true
            },
            columnAutoWidth: true,
            paging: { pageSize: 100 },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [200, 300, 400, 500,1000,1500]
            },
            headerFilter: {
                visible: true
            },
            filterRow: { visible: true },
            hoverStateEnabled: true,
            rowAlternationEnabled: true


        });
    }


    


    private ShowError(response: any) {
        DevExpress.ui.notify(JSON.stringify(response), "error", 5000);
        //alert(JSON.stringify(response));
    }

    attached() {



        this.LoadData();


       // DevExpress.ui.notify('Hello Delegate, Please contribute to NTELO in Mainnet', 'info', 5000);



    }



}

