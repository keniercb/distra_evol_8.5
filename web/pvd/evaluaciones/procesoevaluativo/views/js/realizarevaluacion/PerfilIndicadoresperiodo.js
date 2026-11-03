/**
 * Interfaz para mostrar perfil de indicadores
 *
 * @author Ing. Javier Rodriguez Lopez
 * @package PVD
 * @subpackage Evaluaciones
 */

Ext.ns('Ext.Evaluaciones');
Ext.Evaluaciones.Periodo = Ext.extend(Ext.grid.GridPanel, {
    stripeRows: true,
    layout:'fit',
    border: false,
    initComponent: function () {
        var self = this;

        this.store = new Ext.data.Store({
            url: 'todosperiodos',
            baseParams:{
                start:0,
                limit:10,
                idplanilla: self.idplanilla,
                idmodelo: self.idmodelo,
                idpreprocesoevaluativo: self.idpreprocesoevaluativo
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {name: 'idperiodoproceso'},
                {name: 'denominacion'},
                {name: 'fdesde'},
                {name: 'fhasta'}

            ])
        });

        this.obj = new Ext.app.SearchField({
            store: this.store,
            emptyText: 'Criterio a buscar...'
        });

        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function(sm) {
                    if (sm.hasSelection()) {

                    }
                }
            }
        });


        this.columns = [this.sm,

            {
                header: 'Períodos',
                sortable: true,
                width: 350,
                resizable: true,
                dataIndex: 'denominacion'

            },
            {
                header: 'Fecha inicio',
                sortable: true,
                width: 350,
                resizable: true,
                dataIndex: 'fdesde'

            },
            {
                header: 'Fecha fin',
                sortable: true,
                width: 350,
                resizable: true,
                dataIndex: 'fhasta'

            }

        ];


        this.loadMask = {
            msg: 'Cargando...'
        };

        this.tbar = [this.obj],

            this.bbar = new Ext.PagingToolbar({
                pageSize: 10,
                store: this.store,
                displayInfo: true
            });


        Ext.Evaluaciones.Periodo.superclass.initComponent.call(this);

    }

});
Ext.Evaluaciones.PerfilIndicadoresperiodo = Ext.extend(Ext.Window, {
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
            iconCls: 'chart_bar',
            handler: function () {
                self.wdperiodo.show();
                self.gridperiodo.store.load({
                        params:{
                            start:0,
                            limit:10,
                            idplanilla: self.idplanilla,
                            idmodelo: self.idmodelo,
                            idpreprocesoevaluativo: self.idpreprocesoevaluativo
                        }
                    }
                )
            }
        });

        this.gridperiodo = new  Ext.Evaluaciones.Periodo({
            width:730,
            height:800,
            region:'center',
            id:'periodo',
            idplanilla: self.idplanilla,
            idmodelo: self.idmodelo,
            idpreprocesoevaluativo: self.idpreprocesoevaluativo
        });
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana',
            iconCls: 'cancelar',
            handler: function () {
                self.wdperiodo.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            text:'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            iconCls: 'aceptar',
            handler: graficar
        });

        this.wdperiodo = new Ext.Window({
            title: 'Listado de períodos evaluativos para comparar',
            autoScroll: true,
            width: '50%',
            height: 550,
            layout: 'border',
            closable: true,
            resizable: false,
            closeAction: 'hide',
            items: [
                self.gridperiodo
            ],
            modal: true,
            buttons: [
                self.btnCancelar,
                self.btnAceptar
            ]
        });

        var tlIndicadores = new Ext.tree.TreeLoader({
            dataUrl: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/cargarPlanillaPerfil',
            baseParams: {
                idnodo: -1,
                idplanilla:self.idplanilla

            },
            listeners: {
                beforeload: function (cargadorIndicadores, node, response) {
                    if (node.id == 'raizPlanilla') {
                        cargadorIndicadores.baseParams.idnodo = node.id;
                        cargadorIndicadores.baseParams.idpersona = self.idpersona;
                        cargadorIndicadores.baseParams.idpersonaevaluacion = self.idpersonaevaluacion;
                    }
                    else {
                        cargadorIndicadores.baseParams.idpersonaevaluacion = self.idpersonaevaluacion;
                        cargadorIndicadores.baseParams.idpersona = self.idpersona;
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
            title: 'Perfil de indicadores de:' + ' ' + self.nombrecompleto + '.',
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
                series: []
            }
        });

        this.items = [this.tpPlanilla, this.pChart];
        Ext.Evaluaciones.PerfilIndicadoresperiodo.superclass.initComponent.call(this);

        function graficar() {
            self.wdperiodo.hide();
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

               var periodo =  self.gridperiodo.getSelectionModel().getSelections();

                var arrIdperiodo = new Array();
                Ext.each(periodo, function (record) {
                    arrIdperiodo.push(parseInt(record.get('idperiodoproceso')));
                }, this);

                var arrIdpersonaevaluacion = new Array();
                Ext.each(self.personas, function (record) {
                    arrIdpersonaevaluacion.push(parseInt(record.get('idpersonaevaluacion')));
                }, this);

                self.pChart.chart.xAxis[0].setCategories(xCategories);
//

                PVD.mostrarMascara('loadresultados', 'Por favor espere...', 'Cargando resultados de los indicadores');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/getseriepersona',
                    method: 'POST',
                    params: {
                        arrInd: Ext.encode(arrIds),
                        arrIdperiodo: Ext.encode(arrIdperiodo),
                        arrIdpersonaevaluacion: Ext.encode(arrIdpersonaevaluacion),
                        idpersona: self.idpersona,

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