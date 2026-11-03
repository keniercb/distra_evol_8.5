/**
 * @author Ing. Javier Rodriguez Lopez
 * @package PVD Comun
 * @version 1.0
 * @description Componente para representar estructuras gerarquicas.
 */
Ext.ns('Ext.components');
Ext.components.cmpCantEvalChart = Ext.extend(Ext.Panel, {
    layout: 'fit',
    initComponent: function () {
        var self = this;
        this.valX = null;
        this.valY = null;

        this.chart = null;

        Ext.components.cmpCantEvalChart.superclass.initComponent.call(this);
    },
    paint: function (data) {
        this.chart = new Highcharts.Chart({
            chart: {
                renderTo: this.body.dom,
                defaultSeriesType: 'line'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                    text: 'Resultado de la evaluación'
                }
            },
            yAxis: {
                title: {
                    text: 'Cantidad de personas'
                }
            },
            series: [
                {
                    name: 'Evaluaciones',
                    data: data
                }
            ]
        });
//        this.chart.series[0].setData(data, true);

    }
});