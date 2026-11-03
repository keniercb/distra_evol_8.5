/**
 * @author Ing. Javier Rodriguez Lopez
 * @package Evaluaciones
 * @version 1.0
 * @date 25-03-2014
 * @description Componente para representar graficas.
 */
Ext.ns('Ext.components');

Ext.components.HighchartPanel = Ext.extend(Ext.Panel, {
    chartType:(this.chartType)?this.chartType:'bar',
    chartDatas:(this.chartDatas)?this.chartDatas:{name:'sin datos',data:[['data',0]]},
    chartTitle:(this.chartTitle)?this.chartTitle:'Gráfica',
    chartDataElement:(this.chartDataElement)?this.chartDataElement:'Datos',
    chartCategories:(this.chartCategories)?this.chartCategories:['Categorias'],
    initComponent: function () {
        this.chart = null;

        //Renderiza el grafico
        this.on('render', this.renderChart, this);

        this.tbar = ['->',
            {
                iconCls: 'chart_line',
				tooltip: "Gr&aacute;fica lineal",
                handler: function(){
                    this.chartType = 'line'
                    this.renderChart();
//                    this.changeType('line');
                }.createDelegate(this)
            },
            {
                iconCls: 'chart_curve',
				tooltip: "Gr&aacute;fica de curva",
                handler: function(){
                    this.chartType = 'spline'
                    this.renderChart();
//                    this.changeType('spline');
                }.createDelegate(this)
            },
            {
                iconCls: 'chart_bar',
				tooltip: "Gr&aacute;fica de barra",
                handler: function(){
                    this.chartType = 'column'
                    this.renderChart();
//                    this.changeType('bar');
                }.createDelegate(this)
            },
            //Comentariado por tener problemas la libreria con el tooltip
            {
                iconCls: 'chart_pie',
                handler: function(){
                    this.chartType = 'pie'
                    this.renderChart();
//                    this.changeType('pie');
                }.createDelegate(this)
            },
            '-',
            {
                iconCls: 'disk',
                tooltip: 'Exportar',
                handler: function () {
                    this.chart.exportChart();
                }.createDelegate(this)
            },
            {
                iconCls: 'print',
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
        var currConfig = this.SetConfig(this.chartType);
        currConfig.credits = {
            enabled: false
        };
        currConfig.exporting = {
            enabled: false
        };
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
    },
    SetConfig: function(charttype){
        var currConfig = null;
        var datos = this.chartDatas;
        var data = this.formatData(datos,charttype)
        if(charttype == 'pie')
        {
            currConfig = {
                chart: {type: charttype},
                title: {text: this.chartTitle},
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                            enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        },
                        showInLegend: true
                    }
                },
                series: data
            }
        }
        else
        {
            currConfig = {
                chart: {type: charttype},
                title: {text: this.chartTitle},
                xAxis       : {categories : this.chartCategories},
                yAxis       : {title : {text : this.chartDataElement}},
                series:data[1].data
            }
        }
        return currConfig;
    },
    formatData: function(chartDataArray,charttype){
        var result = new Array();
        if(charttype == 'pie')
        {
            result[0]={name:this.chartDataElement,data:chartDataArray.data};
        }
        else
        {
            var ejex = chartDataArray.name
            var serie = new Array();

           Ext.each(chartDataArray.data,function(dato){
       
                  if(dato instanceof Array)
                  {
                      var x = new Array();

                    for(q=1;q<dato.length;q++)
                        x.push(dato[q]);
                      serie.push({name:dato[0],data:x});
                      result[0] = ejex;
                      result[1] =  {
                          data:serie
                      };
                  }
                  else
                  {
                      var x = new Array();
                      x[0] = dato.y;
                      serie.push({name:dato.name,data:x});
                      var dat = new Array();
                      result[0] = ejex;
                      result[1] = {
                          data:serie
                      };
                  }
            });
        }
        return result;
    }
});