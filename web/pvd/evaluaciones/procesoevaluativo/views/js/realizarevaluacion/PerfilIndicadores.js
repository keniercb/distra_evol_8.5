/**
 * Interfaz para mostrar perfil de indicadores
 *
 * @author Ing. Javier Rodriguez Lopez
 * @package PVD
 * @subpackage Evaluaciones
 */

Ext.ns('Ext.Evaluaciones');
Ext.Evaluaciones.PerfilIndicadores = Ext.extend(Ext.Window, {
    layout: 'border',
    title: 'Perfil de indicadores',
    modal: true,
    initComponent: function () {
        var self = this;

        var btnExpandAllNodes = new Ext.Button({
            tooltip: 'Expandir todos los nodos',
            iconCls: 'expand_all',
            handler: function () {
                self.tpPlanilla.expandAll();
            }
        });

        var btnColapseAllNodes = new Ext.Button({
            tooltip: 'Contraer todos los nodos',
            iconCls: 'collapse_all',
            handler: function () {
                self.tpPlanilla.collapseAll();
            }
        });

        var btnGraficar = new Ext.Button({
            text: 'Graficar',
//            tooltip: self.labels.ttpBtnGraficar,
            iconCls: 'chart_bar',
            handler: graficar
        });

        var tlIndicadores = new Ext.tree.TreeLoader({
            dataUrl: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/cargarPlanillaPerfil',
            timeOut: 500000,
            baseParams: {
                idnodo: -1,
                idplanilla:self.idplanilla

            },
            listeners: {
                beforeload: function (cargadorIndicadores, node, response) {
                    if (node.id == 'raizPlanilla') {
                        cargadorIndicadores.baseParams.idnodo = node.id;
                        //cargadorIndicadores.baseParams.idpersona = self.personas.data.idpersona;
                        cargadorIndicadores.baseParams.idpersonaevaluacion = self.idpersonaevaluacion;

                    }
                    else {
                        //cargadorIndicadores.baseParams.idpersona = self.personas.data.idpersona;
                        cargadorIndicadores.baseParams.idpersonaevaluacion = self.idpersonaevaluacion;
                        cargadorIndicadores.baseParams.idnodo = node.id;
                    }
                },
                load: function (cargadorIndicadores, node, response) {
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

        this.tpPlanilla = new Ext.tree.TreePanel({
            region: 'west',
            title: 'Planilla evaluativa',
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
                id: 'raizPlanilla'
            }
        });

        this.pChart = new Ext.components.HighchartPanel({
            title: 'Perfil de indicadores',
            region: 'center',
            margins: '5 5 5 0',
            width: '70%',
            chartConfig: {
                chart: {
                },
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        text: 'Indicadores'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Evaluación'
                    }
                },
//                tooltip: {
//                    formatter: function () {
//                        return this.y + ' personas evaluadas con ' + this.x;
//                    }
//                },
                series: []
            }
        });

        this.items = [this.tpPlanilla, this.pChart];
        Ext.Evaluaciones.PerfilIndicadores.superclass.initComponent.call(this);

        function graficar() {
            var arrNodos = self.tpPlanilla.getChecked();
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
//
                var arrIdpersonaevaluacion = new Array();
                Ext.each(self.personas, function (record) {
                    arrIdpersonaevaluacion.push(parseInt(record.get('idpersonaevaluacion')));
                }, this);


//                Ext.each(st.reader.jsonData.evalByPerson, function (obj) {
//                    var aux = new Array();
//                    aux[0] = obj.idpersona;
//                    aux[1] = parseInt(obj.valor);
//
//                    if(obj.extension){
//                        aux['extension'] = obj.extension;
//                    }
//                    dataEvalByPerson.push(aux);
//                    xCategories.push(obj.nombre + ' ' + obj.papel + ' ' + obj.sapel);
//                });


                self.pChart.chart.xAxis[0].setCategories(xCategories);
//

                PVD.mostrarMascara('loadresultados', 'Por favor espere...', 'Cargando resultados de los indicadores');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/getserie',
                    method: 'POST',
                    params: {
                        arrInd: Ext.encode(arrIds),
                        arrIdpersonaevaluacion: Ext.encode(arrIdpersonaevaluacion)
                    },
                    callback: function (options, success, response) {
                        var series = Ext.util.JSON.decode(response.responseText);

                       while (self.pChart.chart.series.length > 0) {
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
                mostrarMensaje(1, 'Debe seleccionar al menos un indicador.');
            }
        }
    }
});