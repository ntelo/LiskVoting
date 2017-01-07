"use strict";
import auhc = require("aurelia-http-client");
import {AppState} from './app-state';

//var baseUrl: string = './LiskService.asmx/';
//var baseurlLisk = "http://5.189.153.97:7000";
var baseUrl: string = '';
var baseurlLisk: string = '';



export class nodestatsforgers {
    static inject = [auhc.HttpClient, AppState];

    public heading: string;
    public nodeStatsData: any;
    public liskAddr: string;
    public username: string;
   

    constructor(private http: auhc.HttpClient, appState: AppState) {

        baseUrl = appState.baseUrl;
        baseurlLisk = appState.liskBaseUrl;
        this.heading = "Node last 48h Stats";
        this.nodeStatsData = [];
        this.liskAddr = "";
        this.username = "";

    }

    loadCharts() {

        this.loadChartForgers();
        //this.loadChartBlocks();
    }
    
    GetEvolutionStats() {

        if (this.liskAddr.length > 0) {

            this.setCookie("cookieAddrs", this.liskAddr, 30);
            var self = this;
            var url = baseUrl + 'GetEvolutionStats';
            var data: any = {};
            data.address = this.liskAddr;
            return $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    self.nodeStatsData = response.d;
                    self.heading = "Node last 48h Stats, last sync " + response.d.lastdatestr;
                    self.loadCharts();

                    return response.d;
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });


        }

      

    }
  
    loadChartForgers() {

        var self = this;


        var options: DevExpress.viz.charts.dxChartOptions = {
            title: "Forging By Hour",
            dataSource: self.nodeStatsData.evolutionData,
            palette: 'Soft Pastel',
            tooltip: {
                enabled: true
            },
            equalBarWidth: false,
            //legend: { visible: true, position: 'top' },
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center'
            },
            commonSeriesSettings: {
                argumentField: 'HourSequence',
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
                argumentField: "HourSequence",
                valueField: "forged",
                name: "forged",
                type: "line",
                color: '#5684b8'


            }],
            argumentAxis: {
                type: 'discrete',
                //tickInterval: 5,
                label: {
                    overlappingBehavior: { mode: 'rotate', rotationAngle: 45 }
                }
            },
        };
        $('#forged').dxChart(options);


        var gauge = $("#forged1").dxCircularGauge({
            scale: {
                startValue: 0,
                endValue: 2500,
                tickInterval: 100,
                label: {
                    customizeText: function (arg) {
                        return arg.valueText + " LISK";
                    }
                }
            },
            tooltip: { enabled: true },
            title: {
                text: "Last 48h (" + self.nodeStatsData.forgedTotal+")",
                font: { size: 28 }
            },
            value: self.nodeStatsData.forgedTotal
            //subvalues: [12, 23]
        }).dxCircularGauge("#forged1");

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
    


    private ShowError(response: any) {
        DevExpress.ui.notify(JSON.stringify(response), "error", 10000);
        //alert(JSON.stringify(response));
    }

    attached() {

        var cookieAddrs: string = this.getCookie("cookieAddrs");
        if (cookieAddrs.length > 0) {

            this.liskAddr = cookieAddrs;
            this.GetEvolutionStats();
        }

        //DevExpress.ui.notify('Hello Delegate, Please contribute to NTELO in Mainnet', 'info', 5000);

    }



}

