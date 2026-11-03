/**
 * @modified Ing. Yalenis Arcos Valdes
 * @package Evaluaciones
 * @version 1.0
 * @date 02-10-2017
 * @description Componente para representar graficas.
 */
Ext.ns('Ext.components');

Ext.components.HighchartPanel = Ext.extend(Ext.Panel, {
    chartType:(this.chartType)?this.chartType:'bar',
    chartDatas:(this.chartDatas)?this.chartDatas:{name:'sin datos',data:[['data',0]]},
    chartTitle:(this.chartTitle)?this.chartTitle:'Gráfica',
    chartDataElement:(this.chartDataElement)?this.chartDataElement:'Datos',
    chartCategories:(this.chartCategories)?this.chartCategories:['Categorias'],
    scrollbar:(this.scrollbar)?this.scrollbar:{enabled:true},
    xAxisMin:(this.xAxisMin)?this.xAxisMin:0,
    xAxisMax:(this.xAxisMax)?this.xAxisMax:0,
    yAxisTitle: (this.yAxisTitle)?this.yAxisTitle:'Valores',
    dataLabels: (this.dataLabels)?this.dataLabels:false,
    initComponent: function () {
        this.chart = null;

        //Renderiza el grafico
        this.on('render', this.renderChart, this);

        this.tbar = ['->',
            {
                iconCls: 'chart_line',
                tooltip: "Gr&aacute;fica lineal por hora",
                handler: function(){
                    this.chartType = 'dtline'
                    this.renderChart();
//                    this.changeType('line');
                }.createDelegate(this),
                hidden:true
            },
            {
                iconCls: 'chart_line',
				tooltip: "Gr&aacute;fica lineal",
                handler: function(){
                    this.chartType = 'line'
                    this.renderChart();
//                    this.changeType('line');
                }.createDelegate(this),
                hidden:true
            },
            {
                iconCls: 'chart_curve',
				tooltip: "Gr&aacute;fica de curva",
                handler: function(){
                    this.chartType = 'spline'
                    this.renderChart();
//                    this.changeType('spline');
                }.createDelegate(this),
                hidden:true
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
                iconCls: 'exportar',
                tooltip: 'Exportar',
                handler: function () {
                    this.chart.exportChart();
                }.createDelegate(this)
            },
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
        var dataf = this.formatData(datos,charttype)
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
                                format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f} %)'
                        },
                        showInLegend: true
                    }
                },
                series: dataf
            }
        }else if(charttype == 'dtline'){
            currConfig = {
                chart: {type: 'line'},
                title: {text: this.chartTitle},
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: this.dataLabels
                        }
                    }
                },
                xAxis       : {categories : this.chartCategories, min: this.xAxisMin,max:this.xAxisMax},
                yAxis       : {type: 'datetime',title: {
                    text: this.yAxisTitle
                }, //y-axis will be in milliseconds
                    dateTimeLabelFormats: { //force all formats to be hour:minute:second
                        second: '%H:%M',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%H:%M',
                        week: '%H:%M',
                        month: '%H:%M',
                        year: '%H:%M'
                    }},
                tooltip: {
                    formatter: function(){
                        var d= new Date(this.point.y);
                        d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
                        var hd = new Date(d);
                        var h=hd.getHours();
                        var m=hd.getMinutes();

                        if (h < 10) {
                            h = "0" + h;
                        }

                        if (m < 10) {
                            m = "0" + m;
                        }

                        var hora = h+':'+m;
                        return '<span style="color:'+this.point.series.color+'">\u25CF</span> '+this.series.name+': <b>'+hora+'</b><br/>';
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    borderWidth: 0
                },
                series:dataf,
                scrollbar : {enabled:this.scrollbar.enabled}
            }
        }
        else
        {
            currConfig = {
                chart: {type: charttype},
                title: {text: this.chartTitle},
                xAxis       : {categories : this.chartCategories, min: this.xAxisMin,max:this.xAxisMax},
                yAxis       : {title : {text : this.chartDataElement}},
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: this.dataLabels
                        }
                    }
                },
                series:dataf[1].data,
                scrollbar : {enabled:this.scrollbar.enabled}
            }
        }
        return currConfig;
    },
    formatData: function(chartDataArray,charttype){
        var result = new Array();
        if(charttype == 'pie')
        {
            result[0]={name:this.chartDataElement,data:chartDataArray.data};
        } else if(charttype == 'dtline') {
            result = chartDataArray.data;
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