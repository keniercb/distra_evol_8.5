Ext.ns('PVD.Graficas');
//Configuración por defecto de la gráfica.
PVD.Graficas.DefaultConfig = {
    colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
};

PVD.Graficas.Contenedor = Ext.extend(Ext.Panel, {
    id: 'contenedorChart',
    layout: 'column',
    border: false,
    bodyStyle: 'background-color: #d9e8fb',
    autoScroll: true,
    initComponent: function () {
        var self = this;
        this.on('beforerender', function () {
            adicionarPaneles(self.config, self.columnas);
        });
        this.on('afterlayout', function () {
            graficar(self.config, self.columnas, self.idpanel);
        });
        PVD.Graficas.Contenedor.superclass.initComponent.call(this);
    }
});

/**
 * @method adicionarPaneles Adiciona los paneles que contendrán las gráficas al contenedor "PVD.Graficas.Contenedor".
 * @param configCharts Arreglo con la configuración de cada una de las gráficas.
 * @param nc Número de columnas en que se dividira el contenedor de las gráficas.
 */
function adicionarPaneles(configCharts, nc) {
    var columns = (nc) ? 1/((configCharts.length < nc) ? configCharts.length : nc) : 1;
    for (var i = 0; i < configCharts.length; i++) {
        Ext.getCmp('contenedorChart').add({
            id: 'panel' + i,
            border: false,
            columnWidth: columns,
            xtype: 'panel',
            layout: 'fit',
            html: '<div id="chartpanel_' + i + '" class="chartpanel_'+ i +' " style="background-color: #d9e8fb"></div>'
        });
    }
}

function graficar(configCharts, nc, idpanel) {
    var altura = 275;
    if (idpanel) {
        var nrow = (configCharts.length%nc == 0) ? (configCharts.length / nc) : Math.trunc((configCharts.length / nc )) + 1;
        altura = (Ext.getCmp(idpanel).getEl().getHeight() / nrow < altura) ? altura : (Ext.getCmp(idpanel).getEl().getHeight() / nrow);
    }
    for (var i = 0; i < configCharts.length; i++) {
        var chart = {};
        if (configCharts[i].highchartsConfig) {
            chart = configCharts[i].highchartsConfig;
        } else {
            chart = {
                chart: {
                    height: altura,
                    marginTop: 35,
                    type: configCharts[i].tipo,
                    backgroundColor: '#ffffff',
                    borderColor: '#99bbe8',
                    borderRadius: 15,
                    borderWidth: 1
                },
                colors: (configCharts[i].colores) ? configCharts[i].colores : PVD.Graficas.DefaultConfig.colors,
                xAxis: getXAxis(configCharts[i].x),
                yAxis: getYAxis(configCharts[i].y),
                tooltip: getToolTips(configCharts[i].tooltip),
                credits: getCreditos(configCharts[i].creditos),
                series: getSeries(configCharts[i].tipo, configCharts[i].series),
                plotOptions: getPlotOptions(configCharts[i].tipo)
            };
            if (configCharts[i].titulo) chart.title = getTitulo(configCharts[i].titulo);
            if (configCharts[i].creditos) chart.credits = getCreditos(configCharts[i].creditos);
        }
        Highcharts.chart('chartpanel_'  + i, chart);
        var div = document.getElementById('chartpanel_'  + i);
        var container = div.getElementsByClassName('highcharts-container');
       // var btnDownload = document.createElement('div');
       // btnDownload.setAttribute("class", "icondistra-descargar");
       // btnDownload.style = 'position: relative; top:-25; left: 10';
       // btnDownload.setAttribute("onclick", "ExportarPNG(" + i + ")");
       // container[0].appendChild(btnDownload);
    }
}

function ExportarPNG(i) {
    try {
        var idPanelChart = 'chartpanel_' + i;
        var div = document.getElementById(idPanelChart);
        var svg = div.getElementsByTagName('svg')[0];
        var canvas = document.createElement('canvas');
        canvas.width = svg.getAttribute('width');
        canvas.height = svg.getAttribute('height');
        var context = canvas.getContext('2d');
        context.ignoreClearRect = true;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, svg.getAttribute('width'), svg.getAttribute('height'));
        canvg(canvas, svg.outerHTML, {
            ignoreMouse: true,
            ignoreAnimation: false,
            ignoreDimensions: true
        });
        Canvas2Image.saveAsPNG(canvas);
    } catch (e) {
        mostrarMensaje(6, 'Ha ocurrido un error durante la descarga. Por favor recargue la p&aacute;gina y vuelva a intentarlo.');
    }
}

function getTitulo(titulo) {
    var title = {style: {"color": "#15428b", "fontSize": "14px"}, text: ''};
    if (titulo)
        title.text = titulo;
    return title;
}

function getCreditos(creditsConfig) {
    var credits = {
        enabled: true,
        href: "http://www.xetid.cu",
        style: {color: '#1AA327', cursor: 'pointer', fontSize: '10px'},
        text: "Distra - XETID"
    };
    if (creditsConfig) {
        if (creditsConfig.texto)
            credits.text = titleConfig.texto;
        if (creditsConfig.color)
            credits.style.color = creditsConfig.color;
        if (creditsConfig.referencia)
            credits.href = creditsConfig.referencia;
    }
    return credits;
}

function getSeries(chartType, seriesConfig) {
    var series = [];
    if(chartType === 'pie') {
        for (var i = 0; i < seriesConfig.length; i++) {
            var serie = {name: seriesConfig[i].nombre};
            var validar = validarDatosSeries(seriesConfig[i].datos);
            if (validar == 3) {
                var arrSerie = [];
                for (var k = 0; k < seriesConfig[i].datos.length; k++) {
                    var obj = {
                        y: seriesConfig[i].datos[k].y,
                        name: seriesConfig[i].datos[k].nombre,
                        color: seriesConfig[i].datos[k].color
                    };
                    arrSerie.push(obj);
                }
                serie.data = arrSerie;
            } else {
                serie.data = seriesConfig[i].datos;
            }
            series.push(serie);
        }
    } else {
        for (var i = 0; i < seriesConfig.length; i++) {
            var serie = {name: seriesConfig[i].nombre, data: []};
            var validar = validarDatosSeries(seriesConfig[i].datos);
            if (validar == 3) {
                var arrSerie = [];
                for (var k = 0; k < seriesConfig[i].datos.length; k++) {
                    var obj = {
                        x: seriesConfig[i].datos[k].x,
                        y: seriesConfig[i].datos[k].y,
                        name: seriesConfig[i].datos[k].nombre,
                        color: seriesConfig[i].datos[k].color
                    };
                    arrSerie.push(obj);
                }
                serie.data = arrSerie;
            } else {
                var arrSerie = [];
                for (var k = 0; k < seriesConfig[i].datos.length; k++){
                    arrSerie.push(seriesConfig[i].datos[k]);
                }
                serie.data = seriesConfig[i].datos;
            }
            series.push(serie);
        }
    }
    return series;
}

function validarDatosSeries(obj) {
    if (Array.isArray(obj)) {
        if (Array.isArray(obj[0])) {
            return 2;
        } else {
            if(isNaN(obj[0]))
                return 3;
        }
    } else {
        return 1;
    }
}

function getPlotOptions(chartType) {
    var plotOptions = {};
    if(chartType == 'pie') {
        plotOptions = {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        }
    }
    if(chartType == 'bar') {
        plotOptions = {
            series: {
                stacking: 'normal'
            }
        };
    }
    return plotOptions;
}

function getXAxis(axisConfig) {
    var axis = {
        title: {
            text: (axisConfig.titulo) ? axisConfig.titulo : null
        },
        categories: (axisConfig.categorias) ? axisConfig.categorias : null
    };
    if (axisConfig.etiquetasAbs) {
        axis.labels = {
            formatter: function () {
                return Math.abs(this.value);
            }
        }
    }
    return axis;
}

function getYAxis(axisConfig) {
    var axis = {
        title: {
            text: (axisConfig.titulo) ? axisConfig.titulo : null
        },
        categories: (axisConfig.categorias) ? axisConfig.categorias : null
    };
    if (axisConfig.etiquetasAbs) {
        axis.labels = {
            formatter: function () {
                return Math.abs(this.value);
            }
        }
    }
    return axis;
}

function getToolTips(tooltipConfig) {
    var tooltip = {};
    if (typeof tooltipConfig != 'undefined') {
        if (tooltipConfig.valorAbs) {
            tooltip.formatter = function () {
                return this.point.category + '<br/>' +
                    '<span style="color: ' + this.point.color + '">\u25CF</span> ' + this.series.name + ': <b>' + Math.abs(this.point.y) + '</b>';
            }
        }
        if (tooltipConfig.sufijo) {
            tooltip.valueSuffix = ' ' + tooltipConfig.sufijo;
        }
    }
    return tooltip;
}

/*Ejemplo de la configuración*/
var configChartExample = {
    titulo: 'Titulo de la gráfica',
    colores: ['#8085e9','#2b908f'], //Arreglo de colores
    creditos: {
        texto: 'XETID',
        color: '#999999',
        referencia: 'http://www.xetid.cu'
    },
    series: [{
        nombre: 'Nombre de la serie', //Nombre de la serie para mostrar en la leyenda, tooltips, etc.
        datos: []
        /**
         * Tipo de gráfica: *
         * [1, 3, 8, 2] Arreglo con valores numéricos. Los valores en el eje x se calculan automaticamente, comenzando
         *              en 0 e incrementándose en 1. Si el eje x tiene categorías definidas, se emplearán las mismas.
         * [[0, 5], [1, 4], [2, 3]] Arreglo de arreglos con 2 valores. En este caso los valores corresponden a x, y
         *              respectivamente. Si el primer elemento es una cadena, se aplica como el nombre del punto y se
         *              deduce el valor de x.
         * [{x: 1, y: 9, nombre: 'Nombre del punto 1', color: '#00FF00'},
         *  {x: 2, y: 8, nombre: 'Nombre del punto 2', color: '#FF00FF'}] Arreglo de objetos con valores nombrados.
         *
         * Tipo de gráfica: Pastel (Se recomienda la segunda variante)
         * [1, 3, 8, 2] Arreglo con valores numéricos. Los valores en el eje x se calculan automaticamente, comenzando
         *              en 0 e incrementándose en 1. Si el eje x tiene categorías definidas, se emplearán las mismas.
         * [{y: 9, nombre: 'Nombre del punto 1', color: '#00FF00'},
         *  {y: 8, nombre: 'Nombre del punto 2', color: '#FF00FF'}] Arreglo de objetos con valores nombrados. Solo se
         *              representan los valores del eje y
         */
    }],
    x: {
        etiquetasPositivas: true //Default: false. Para mostrar los valores numericos positivos en las etiquetas para la parte negativa.
    },
    y: {
        etiquetasPositivas: true //Default: false. Para mostrar los valores numericos positivos en las etiquetas para la parte negativa.
    }
};