/*
 * Clase controladora para manejar la interfaz del componente de graficador.
 * @author Yulier Camilo Garrido Garrido
 * fecha de creación 10/3/2014
 * @version 1.0
 */
Ext.ns('Std.Base.Graficador');
Std.Base.Graficador.GraficadorController = Ext.extend(Std.Base.Controller, {
    /*
     * @author Yulier Camilo Garrido Garrido
     * fecha de creación 10/3/2014
     * @version 1.0
     */
    constructor: function() {
        var config = {
            labels: Std.Base.Graficador.Etiquetas,
            globals: {
                dirImg: Std.Base.Graficador.Imagenes
            }
        };
        this.init(config);
    },
    /*Funsion que permite traer los datos de un contrlador
     * @author Yulier Camilo Garrido Garrido
     * fecha de creación 10/3/2014
     * @version 1.0
     */
    recargarDatos: function(objeto) {
        var me = this;
        //Std.Base.Utiles.mostrarMascara('chart', '', 'Cargando datos...');
        Ext.Ajax.request({
            url: objeto.url,
            method: 'POST',
            params: {data: Ext.encode(objeto.filtro)},
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                var div = document.getElementById('char-' + objeto.idpanel);
                if (div)
                    div.remove();
                switch (objeto.tipo) {
                    case 'barra':
                        me.graficoBarras({
                            el: objeto.el,
                            data: responseData.data,
                            titulo: objeto.titulo,
                            previa: objeto.previa
                        });
                        break;
                    case 'pastel':
                        me.graficoPie({
                            el: objeto.el,
                            data: responseData.data,
                            titulo: objeto.titulo,
                            previa: objeto.previa
                        });
                        break;
                    case 'linea':
                        me.graficoLine({
                            el: objeto.el,
                            data: responseData.data,
                            titulo: objeto.titulo,
                            previa: objeto.previa
                        });
                        break;
                    case 'stacked':
                        me.graficoStackedBarras({
                            el: objeto.el,
                            data: responseData.data,
                            titulo: objeto.titulo,
                            previa: objeto.previa
                        });
                        break;
                }
            }
        });
    },
    /*Funsion que permite pintar un grafico de barra
     * @author Yulier Camilo Garrido Garrido
     * fecha de creación 10/3/2014
     * @version 1.0
     */
    graficoBarras: function(objeto) {
        var data = [];
        var categories = [];
        Ext.each(objeto.data, function(item) {
            data.push(Number(item[1]));
            categories.push(item[0]);
        });
        var div = Ext.DomHelper.append(objeto.el, {
            border: false,
            id: 'char-' + objeto.el.id
        });
        chart = new Highcharts.Chart({
            chart: {
                renderTo: div,
                type: 'column',
                margin: [50, 50, 20, 80]
            },
            title: {
                text: objeto.titulo
            },
            xAxis: {
                categories: categories,
                labels: {
                    rotation: -90,
                    align: 'bottom',
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif',
                        color: 'black'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Notams por Fir'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.x + '</b>: ' + Highcharts.numberFormat(this.y, 0);
                }
            },
            series: [{
                    name: 'Population',
                    data: data,
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        x: -3,
                        y: 10,
                        formatter: function() {
                            return this.y;
                        },
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
        });
    },
    /*Funsion que permite pintar un grafico de pie
     * @author Yulier Camilo Garrido Garrido
     * fecha de creación 10/3/2014
     * @version 1.0
     */
    graficoPie: function(objeto) {
        var data = [];
        Ext.each(objeto.data, function(item, index) {
            data.push([item[0], Number(item[1])]);
        });
        var div = Ext.DomHelper.append(objeto.el, {
            border: false,
            id: 'char-' + objeto.el.id
        });
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: div,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: objeto.titulo
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.point.name + '</b>: ' + Math.round(this.percentage) + ' %';//'<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: data
                }]
        });
    },
    /*Funsion que permite pintar un grafico linea
     * @author Yulier Camilo Garrido Garrido
     * fecha de creación 10/3/2014
     * @version 1.0
     */
    graficoLine: function(objeto) {
        var data = [];
        var categories = [];
        Ext.each(objeto.data, function(item) {
            data.push(Number(item[1]));
            categories.push(item[0]);
        });

        var div = Ext.DomHelper.append(objeto.el, {
            border: false,
            id: 'char-' + objeto.el.id
        });

        chart = new Highcharts.Chart({
            chart: {
                renderTo: div,
                type: 'spline'
            },
            title: {
                text: objeto.titulo
            },
            xAxis: {
                categories: categories,
                labels: {
                    formatter: function() {
                        var hora = (this.value + '').split(':');
                        if (hora.length = 3)
                            if (hora[1] === '00' && hora[2] === '00')
                                return hora[0] + ':' + hora[1];
                            else
                                return '';
                        else
                            return this.value;
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Cantidad'
                },
                labels: {
                    formatter: function() {
                        return this.value;
                    }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }
            },
            series: [{
                    name: 'Notams',
                    marker: {
                        symbol: 'circle'
                    },
                    data: data
                }]
        });
    }, graficoStackedBarras: function(objeto) {
        var objeto = {
            categories: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            series: [{name: "Antilla", data: [65, 45, 98, 89, 98, 89, 78, 34, 54, 66, 78, 5]}, 
                    {name: "Banes", data: [100, 78, 52, 10, 48, 45, 89, 5, 100, 32, 56, 42]}, 
                    {name: "Mayari", data: [86, 42, 52, 89, 47, 24, 88, 65, 32, 56, 82, 24]}, 
                    {name: "Moa", data: [65, 92, 65, 85, 43, 98, 94, 100, 10, 61, 52, 23]}]
        };
        var categories = objeto.categories;
        var series = objeto.series;
        var div = Ext.DomHelper.append(objeto.el, {
            border: false,
            id: 'char-' + objeto.el.id,
            style: 'height: 80%;'
        });
        chart = new Highcharts.Chart({
            chart: {
                renderTo: div,
                type: 'column'
            },
            title: {
                text: objeto.titulo
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: objeto.yLabel
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -100,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: series
        });
    }

});