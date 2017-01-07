"use strict";
import auhc = require("aurelia-http-client");
import {AppState} from './app-state';

//var baseUrl: string = './LiskService.asmx/';
var baseUrl: string = '';


export class Peers {
    static inject = [auhc.HttpClient, AppState];

    public heading: string;


    public blockx100: any;
    public blockstatus: any;
    public peers: any;
   

    constructor(private http: auhc.HttpClient, appState: AppState) {

        baseUrl = appState.baseUrl;
        this.heading = "Peers Blocks DashBoard";

        this.blockx100 = [];
        this.blockstatus = [];
        this.peers = [];
    }

    activate() {

        return Promise.all([this.GetPeersBlockGroup(), this.GetPeersStatusGroup(), this.GetPeersList()])
            .then(function (results) {
                return results;
            });

    }



    LoadData() {

        try {

            this.LoadChartPeersBlockGroup();
            this.LoadChartPeersStatusGroup();
            this.loadGrid();
           
            //this.loadGrid();
        }
        catch (ex)
        {
        }
       
    }

    GetPeersBlockGroup() {
        var self = this;
        var url = baseUrl + 'GetPeersBlockGroup';

        try {

            return $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    self.blockx100 = response.d;

                   
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
    GetPeersStatusGroup() {
        var self = this;
        var url = baseUrl + 'GetPeersStates';

        try {

            return $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    self.blockstatus = response.d;


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
    GetPeersList() {
        var self = this;
        var url = baseUrl + 'GetPeers';

        try {

            return $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    self.peers = response.d;


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

    //LoadChartPeersBlockGroup_() {

    //    var self = this;
    //    var options: DevExpress.viz.charts.dxPieChartOptions = {
    //        //size: {
    //        //    width: 600
    //        //},
    //        dataSource: self.blockx100,
    //        title: "Peers by Current Block x 1000",

    //        series: [{
    //            argumentField: "Blockx100",
    //            valueField: "NumberPeers",
    //            label: {
    //                visible: true,
    //                connector: {
    //                    visible: true,
    //                    width: 1
    //                }
    //            },
    //            name: "Block x 100 Peers Group"

    //        }],
         

    //    };

    //    $('#containerblockx100').dxPieChart(options);

    //}
    LoadChartPeersBlockGroup() {

        var self = this;


        var options: DevExpress.viz.charts.dxChartOptions = {
            title: "Peers by Current Block x 1000",
            dataSource: self.blockx100,
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
                argumentField: 'Blockx100',
                type: 'bar',
                label: {
                    visible: true,
                    connector: { visible: true },
                    format: 'largeNumber',
                    precision: 0,
                    alignment: 'left'
                }
            },
            series: [{
                argumentField: "Blockx100",
                valueField: "NumberPeers",
                name: "Current Block x 1000",
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


        $('#containerblockx100').dxChart(options);

    }

    LoadChartPeersStatusGroup() {

        var self = this;
        var options: DevExpress.viz.charts.dxPieChartOptions = {
            //size: {
            //    width: 500
            //},
            dataSource: self.blockstatus,
            title: "Peers by Status",

            series: [{
                argumentField: "state",
                valueField: "NumberStates",
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1
                    }
                },
                name: "Status Peers Group"

            }],
            //legend: {
            //    verticalAlignment: 'bottom',
            //    horizontalAlignment: 'center'
            //}

        };

        $('#containerblockstatus').dxPieChart(options);

    }


    loadGrid() {

        var self = this;
        $("#gridpeers").dxDataGrid({
            dataSource: self.peers,
            //dataSource: self.ds,
            //height: function () {
            //    return window.innerHeight - $('#footer').height() - $('.navbar').height() - $('.card').height() - 20;
            //},
            height:800,
            columns: [

                { dataField: 'ip', caption: 'ip' },
                { dataField: 'port', caption: 'port' },
                { dataField: 'height' },
                { dataField: 'PeersBlockx100', caption: 'CurrentBlock x 1000' } ,
                { dataField: 'stateStr' },
                { dataField: 'os' },
                { dataField: 'version' }

           
            ],
            selection: { mode: 'single' },
            groupPanel: {
                visible: true
            },
            columnAutoWidth: true,
            paging: { pageSize: 100 },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [100, 200, 300,1500]
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
        
    }



}

