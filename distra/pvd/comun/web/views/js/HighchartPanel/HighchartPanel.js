/**
 * @author Ing. Javier Rodriguez Lopez
 * @package Evaluaciones
 * @version 1.0
 * @date 25-03-2014
 * @description Componente para representar graficas.
 */
Ext.ns('Ext.components');

Ext.components.HighchartPanel = Ext.extend(Ext.Panel, {
    initComponent: function () {
        this.chart = null;

        //Renderiza el grafico
        this.on('render', this.renderChart, this);

        this.tbar = ['->',
            {
                iconCls: 'chart_line',
				tooltip: "Gr&aacute;fica lineal",
                handler: function(){
                    this.changeType('line');
                }.createDelegate(this)
            },
            {
                iconCls: 'chart_curve',
				tooltip: "Gr&aacute;fica de curva",
                handler: function(){
                    this.changeType('spline');
                }.createDelegate(this)
            },
            {
                iconCls: 'chart_bar',
				tooltip: "Gr&aacute;fica de barra",
                handler: function(){
                    this.changeType('bar');
                }.createDelegate(this)
            },
            //Comentariado por tener problemas la libreria con el tooltip
            {
                iconCls: 'chart_pie',
                handler: function(){
                    this.changeType('pie');
                }.createDelegate(this)
            },
            '-',
            //{
            //    iconCls: 'exportar',
            //    tooltip: 'Exportar',
            //    handler: function () {
            //        this.chart.exportChart();
            //    }.createDelegate(this)
            //},
            {
                iconCls: 'imprimir',
                tooltip: 'Imprimir',
                handler: function () {
                    this.chart.print();
                }.createDelegate(this)
            }
        ];

        Ext.components.HighchartPanel.superclass.initComponent.call(this);

        this.on('resize', function (cmp) {
            this.chart.setSize(cmp.body.getBox().width, cmp.body.getBox().height);
        }, this);
    },
    renderChart: function () {
        var currConfig = this.chartConfig;
        currConfig.credits = {
            enabled: false
        };
        currConfig.exporting = {
            enabled: false
        };

//        var defaultOptions = {
//            chart: {
//                renderTo: this.body.dom
//            },
//            credits: {
//                enabled: false
//            }
//        }
//
//        //Aplica las propiedades por defecto
//        for (var p in defaultOptions) {
//            Ext.apply(currConfig[p], defaultOptions[p]);
//        }

        Ext.apply(currConfig.chart, {
            renderTo: this.body.dom
        });

        //Crea el grafico
        this.chart = new Highcharts.Chart(currConfig);
    },
    changeType: function(type){
        //Redefine el tipo de grafica defecto
        this.chart.options.chart.defaultSeriesType = type;

        Ext.each(this.chart.series, function(serie){
            serie.update({
                type: type
            });
        });
    }
});