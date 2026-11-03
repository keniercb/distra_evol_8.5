/**
 * Interfaz para mostrar perfil de indicadores
 *
 * @author Ing. Javier Rodriguez Lopez
 * @package PVD
 * @subpackage Evaluaciones
 */

Ext.ns('Ext.Evaluaciones');
Ext.Evaluaciones.PerfilPeriodo = Ext.extend(Ext.Window, {
    layout: 'border',
    title: 'Perfil de evaluaciones por trimestre',
    modal: true,
    initComponent: function () {
        var self = this;

        var btnExpandAllNodes = new Ext.Button({
            tooltip: 'Expandir todos los nodos',
            iconCls: 'expand_all',
            handler: function () {
                self.tpProceso.expandAll();
            }
        });

        var btnColapseAllNodes = new Ext.Button({
            tooltip: 'Contraer todos los nodos',
            iconCls: 'collapse_all',
            handler: function () {
                self.tpProceso.collapseAll();
            }
        });

        var btnGraficar = new Ext.Button({
            text: 'Graficar',
//            tooltip: self.labels.ttpBtnGraficar,
            iconCls: 'chart_bar',
            handler: graficar
        });

            var tlIndicadores = new Ext.tree.TreeLoader({
            dataUrl: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/cargarpreprocesosevaluativos',
            baseParams: {
                idnodo: -1,
                idpreprocesoevaluativo:self.idpreprocesoevaluativo

            },
            listeners: {
               beforeload: function (cargadorProceso, node, response) {				   
                    if (node.id == 'raizProceso') {
                        cargadorProceso.baseParams.idnodo = node.id;
                        cargadorProceso.baseParams.idpersona = self.idpersona;
                        cargadorProceso.baseParams.idpersonaevaluacion = self.idpersonaevaluacion;
                    }
                    else {
                        cargadorProceso.baseParams.idpersonaevaluacion = self.idpersonaevaluacion;
                        cargadorProceso.baseParams.idpersona = self.idpersona;
                        cargadorProceso.baseParams.idnodo = node.id;
                    }
                },
                load: function (cargadorProceso, node, response) {
                    node.expand(true, true);
                }
            }
        });

        var kmIndicador = [
            {
                key: 'g',
                alt: true,
                fn: function () {
                    btnGraficar.handler();
                }
            }
        ];

       this.tpProceso = new Ext.tree.TreePanel({
            region: 'west',
            title: 'Proceso evaluativo',
            animate: true,
            containerScroll: true,
            autoScroll: true,
            rootVisible: false,
            collapsible: true,
            split: true,
            minWidth: 100,
            margins: '5 0 5 5',
            cmargins: '5 5 5 5',
            width: '35%',
            layout: 'fit',
            loader: tlIndicadores,
            keys: kmIndicador,
            tbar: [btnGraficar, '->', btnExpandAllNodes, btnColapseAllNodes],
            root: {
                text: 'Raiz',
                id: 'raizProceso'
            }
        });

        this.pChart = new Ext.components.HighchartPanel({
            title: 'Perfil de evaluaciones',
            region: 'center',
            margins: '5 5 5 0',
            width: '70%',
            chartConfig: {
                chart: {
					type:'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        text: 'Periodos'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Evaluación'
                    }
                },
                series: []
            }
        });

        this.items = [this.tpProceso, this.pChart];
        Ext.Evaluaciones.PerfilPeriodo.superclass.initComponent.call(this);

        function graficar() {
			
            var arrNodos = self.tpProceso.getChecked();           
            if (arrNodos.length > 0) {
                var ticks = new Array();
                var arrIds = new Array();
                var xCategories = new Array();
//                //Se prepara la columna y que muestra los nombres de los indicadores
                for (var i = 0; i < arrNodos.length; i++) {
                    var aux = [i + 1, arrNodos[i].text];
                    arrIds[i] = parseInt(arrNodos[i].id);
                    ticks.push(aux)
                    xCategories.push(arrNodos[i].text);
                }

                var arrIdpersonaevaluacion = new Array();
                Ext.each(self.personas, function (record) {
                    arrIdpersonaevaluacion.push(parseInt(record.get('idpersona')));
                }, this);

                self.pChart.chart.xAxis[0].setCategories(xCategories);
                
                PVD.mostrarMascara('loadresultados', 'Por favor espere...', 'Cargando resultados de los periodos');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/getserieperiodo',
                    method: 'POST',
                    params: {
                        arrInd: Ext.encode(arrIds),
                        arrIdpersonaevaluacion: Ext.encode(arrIdpersonaevaluacion)
                    },
                    callback: function (options, success, response) {
                        var series = Ext.util.JSON.decode(response.responseText);

                        while(self.pChart.chart.series.length > 0){
                            self.pChart.chart.series[0].remove(true);
                        }
            
                        Ext.each(series, function (serie) {
							self.pChart.chart.addSeries(serie);
							
                        });

                        PVD.ocultarMascara('loadresultados');
                    }
                });
            }
            else {
                mostrarMensaje(1, 'Debe seleccionar al menos un periodo.');
            }
        }
    }
});
