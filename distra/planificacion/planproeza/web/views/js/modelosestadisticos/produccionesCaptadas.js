function cargarproduccionesCaptadas() {
    pGenproduccionesCaptadas1 = new Ext.Panel({
        id: 'pGenproduccionesCaptadas1',
        layout: 'fit',
        region: 'west',
        width: '50%',
        height: '80%',
        bodyBorder: false,
        html: '<div id="idpGenproduccionesCaptadas1" margin: 0 auto"></div>'
    });
    pGenproduccionesCaptadas2 = new Ext.Panel({
        id: 'pGenproduccionesCaptadas2',
        layout: 'fit',
        region: 'center',
        width: '50%',
        height: '80%',
        bodyBorder: false,
        html: '<div id="idpGenproduccionesCaptadas2" margin: 0 auto"></div>'
    });
}
function produccionesCaptadas(varidejercicio) {
    //llamada al metodo de graficar para traer los datos en el formato deseado
    Ext.Ajax.request({
        url: '/planificacion/planproeza/index.php/modelosestadisticos/graficarProduccionesCaptadas',
        method: 'POST',
        params: {
            //implementar lo del orden en la vista cuando lo analista decida donde va
            //lo mismo con el paginado
            //por ahora se ordena ascendentemente
            orden: 1,
            idejercicio: varidejercicio
        },
        callback: function (options, success, response) {
            resp = Ext.decode(response.responseText);
            $('#idpGenproduccionesCaptadas1').highcharts({
                chart: {
                    height: 400, //_this.plannordir_p1.getInnerHeight(),
                    type: 'column'
                },
                title: {
                    text: 'Cantidad de demandas aprobadas por el Rector'
                },
                tooltip: {
                    pointFormat: '<b>Cantidad: {point.y}</b>'
                },
                legend: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: 'Cantidad'
                    }
                }, plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        },
                        shadow: true
                    },
                    column: {
                        pointPadding: 0.2
                    }
                },
                xAxis: {
                    categories: ['Aprobado rector', 'Otras aprobaciones']
                },
                credits: {
                    enabled: false
                }, series: [{
                        colorByPoint: true,
                        data: resp.data
                    }]
            });
            $('#idpGenproduccionesCaptadas2').highcharts({
                chart: {
                    height: 400, //_this.plannordir_p1.getInnerHeight(),
                    type: 'column'
                },
                title: {
                    text: 'Importe de demandas aprobadas por el Rector'
                },
                tooltip: {
                    pointFormat: '<b>Importe: {point.y}</b>'
                },
                legend: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: 'Importe'
                    }
                }, plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        },
                        shadow: true
                    },
                    column: {
                        pointPadding: 0.2
                    }
                },
                xAxis: {
                    categories: ['Aprobado rector', 'Otras aprobaciones']
                },
                credits: {
                    enabled: false
                }, series: [{
                        colorByPoint: true,
                        data: resp.dataV
                    }]
            });
            mymask.hide();
        }
    });
}
