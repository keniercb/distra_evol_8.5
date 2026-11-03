Ext.ns('Pvd.Evaluaciones.Resumenprocesoevaluativo');
Ext.QuickTips.init();

//Vista del modulo Resumen del proceso evaluativo.
Pvd.Evaluaciones.Resumenprocesoevaluativo.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del modulo Resumen del proceso evaluativo (Tipo: Pvd.Evaluaciones.Resumenprocesoevaluativo.Modelo).
     */
    init: function (perfil, idioma, modelo) {
       this.idpreprocesoevaluativo = null;
        this.idestructura = null;
        var self = this;

        /**
         * Boton para mostrar el resumen del proceso evaluativo.
         * @type {Ext.Button}
         */
        this.btnSelProcEval = new Ext.Button({
            text: idioma.lbBtnResumenProcEval,
            tooltip: idioma.ttpResumenProcEval,
            iconCls: 'book_open',
            disabled: true
        });
        /**
         * Boton para mostrar el organigrama del proceso evaluativo seleccionado.
         * @type {Ext.Button}
         */
        this.btnOrganigrama = new Ext.Button({
            text: idioma.lbBtnOrganigrama,
            tooltip: idioma.ttpBtnOrganigrama,
            iconCls: 'chart_organization',
            disabled: true
        });

        this.btnAyudaTP = new Ext.Button({
            id: 'ayudaTPResumen' ,
            text: idioma.lbBtnAyuda,
            tooltip: idioma.ttipBtnAyuda,
            iconCls: 'ayuda'
          /*  handler: function () {
                //var title = '';
                //var referencia = 'evaluaciones/prepprocesoevaluativo';
                // help.show(title, referencia);
            }*/
        });


        /**
         * Componente Listar procesos evaluativos.
         */
        var url = '/pvd/evaluaciones/procesoevaluativo/index.php/prepararproceso/todospreprocesosevaluativos';
        this.gpListProces = new Ext.PVD.Evaluaciones.ListProcesoEvaluativo({
            title: idioma.lbWinListProcEval,
            region: 'center',
            url: url,
            //url:http:pvd/evaluaciones/procesoevaluativo/index.php/resumenprocesoevaluativo/pvd/evaluaciones/procesoevaluativo/index.php/prepararproceso/todospreprocesosevaluativos
            margins: '5 5 5 5',
            width: '100%'
        });
        var map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'h',
                alt: true,
                fn: function () {
                    self.btnAyudaTP.handler();
                }
            }
        ]);
        this.PanelPadre = new Ext.Panel({
            region: 'center',
            margins: '5 5 5 5',
            width: 400,
            height: 400,
            layout: 'border',
            tbar: [this.btnSelProcEval, this.btnOrganigrama, '->', this.btnAyudaTP],
            items: [this.gpListProces],
            keys: map
        });

        /**
         * Ventana para mostar el grid Listado de procesos evaluativos.
         * @type {Ext.Window}
         */
        this.viewport = new Ext.Viewport({
            layout: 'border',
            items: [this.PanelPadre]
        });

        /**
         * Componente para listar la estructura de la entidad.
         * @type {Ext.pvd.persona.buscarestructura.panelBuscarestructura}
         */
        this.pEstructEval = new Ext.tree.TreePanel({
		    title: 'Estructura evaluativa',
            margins: '5 0 5 5',
            cmargins: '5 5 5 5',
            region: 'west',
			id:'estructuraeval',
            collapsible: true,
            width: '30%',
            split: true,
            animate: true,
            rootVisible: true,
            root: modelo.rootEstrucEval,
            loader: modelo.loaderEstrucEval
        });
     
		 this.pEstructCompcion = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
			id:'estruct'
        });		
        /**
         * Column model del grid Resumen del proceso evaluativo.
         * @type {Ext.grid.ColumnModel}
         */
        this.colResumenProcEval = [
            {
                header: idioma.lbHeaderEstDesarrollo,
                dataIndex: 'estadodesarrollo',
                width: 110,
                align: 'center',
                menuDisabled: true,
                renderer: function (val) {
                    if (val == null) {
                        return 'Sin Estado';
                    } else {
                        return val;
                    }
                }
            },
            {header: idioma.lbHeaderFisico, dataIndex: 'total', width: 50, align: 'center', menuDisabled: true},
            {header: '%', dataIndex: 'porcientototal', width: 50, align: 'center', menuDisabled: true},
            {header: 'Por evaluar', dataIndex: 'porevaluar', width: 80, align: 'center', menuDisabled: true},
            {header: idioma.lbColEvaluados, dataIndex: 'evaluado', width: 80, align: 'center', menuDisabled: true},
            {header: idioma.lbColNoevaluados, dataIndex: 'noevaluado', width: 80, align: 'center', menuDisabled: true},
            {header: idioma.lbColDesacuerdo, dataIndex: 'desacuerdo', width: 80, align: 'center', menuDisabled: true},
            {header: idioma.lbColReclamacion, dataIndex: 'reclamacion', width: 80, align: 'center', menuDisabled: true},
            {header: 'Promedio', dataIndex: 'promedio', width: 90, align: 'center', menuDisabled: true}
        ];

        /**
         * Selector del grid Resumen del proceso evaluativo.
         * @type {Ext.grid.RowSelectionModel}
         */
        this.smResumenProcEval = new Ext.grid.CellSelectionModel();

        /**
         * Boton para exportar el resumen del proceso evaluativo.
         * @type {Ext.Button}
         */
        this.btnExportProcEval = new Ext.Button({
            id: 'btnSelecPrEva',
            text: idioma.lbbtnExportProcEval,
            tooltip: idioma.lbToolTipExportProcEval,
            iconCls: 'exportar',
            handler: function () {
                this.fireEvent('showExportar');
            }
        });
        this.btnGraficar = new Ext.Button({
            text: 'Graficar',
//            tooltip: self.labels.ttpBtnGraficar,
            iconCls: 'chart_bar',
            handler: function () {
                this.fireEvent('graficar');
            }
        });

        this.btnVerPersonasEvaluadas = new Ext.Button({
            text: 'Personas evaluadas',
            tooltip: 'Ver personas evaluadas',
            iconCls: 'ver',
            handler: function () {
                this.fireEvent('ver');
            }
        });

        var pNivel = [
            {},
            {},
            {},
            {header: idioma.lbHeaderCantaEval, align: 'center', colspan: 3},
            {header: idioma.lbHeaderCantEval, align: 'center', colspan: 2},
            {}
        ];

        var group = new Ext.ux.grid.ColumnHeaderGroup({
            rows: [pNivel]
        });

        /**
         * Grid Panel para listar el resumen del proceso evaluativo.
         * @type {Ext.grid.GridPanel}
         */

        this.gpResumenProcEval = new Ext.grid.GridPanel({
            region: 'north',
            split: true,
            margins: '5 5 0 5',
            height: 240,
            autoScroll: true,
            parent: self,
            tbar: [this.btnExportProcEval,this.btnGraficar,this.btnVerPersonasEvaluadas],
            title: idioma.lbGPResumenProcEval,
            store: modelo.stResumenProcEval,
            sm: this.smResumenProcEval,
            plugins: group,
            loadMask: {
                msg: 'Cargando...'
            },
            columns: this.colResumenProcEval,
            viewConfig: {
                getRowClass: function (record, index, rowParams, st) {
                    if (index == st.getCount() - 1) {
                        rowParams.tstyle += 'background-color:#C0C0C0;';
                    }
                }
            }
        });

       /* this.chartEvaluaciones = new Ext.components.HighchartPanel({
            title: idioma.lbGraficoResumen,
            region: 'center',
            margins: '0 5 5 5',
            chartConfig: {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: 'black',
                            distance: -20,
                            formatter: function () {
                                return this.y;
                            }
                        }
                    }
                },
                series: [
                    {
                        type: 'bar',
                        name: 'average',
                        data: []
                    }
                ]
            }
        });*/

        this.chartEvaluaciones = new Ext.components.HighchartPanel({
            title: idioma.lbGraficoResumen,
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
                        text: 'Estructura seleccionada'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Cantidad'
                    }
                },
                series: []
            }
        });

        /******************************GRAFICO DISPERSION****************************************/
        this.dispersionChart = new Ext.components.HighchartPanel({
            title:idioma.lbChartEvalPerson,
            disabled:false,
            chartConfig: {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        text: 'Personas'
                    },
                    categories: this.xCategories,
                    labels: {
                        rotation: -45,
                        align: 'right',
                        style: {
                            fontSize: '12px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Resultado'
                    }
                },
                tooltip: {
                    useHTML: true,
                    formatter: function () {
                        if(this.series.options.data[this.point.x].promedio == null && this.series.options.data[this.point.x].promedioevaluado == null)
                        {
                            var s = '';
                            if (this.series.name == 'average') {
                                s = this.point.name + ': <b>' + this.y + '</b>';
                            }
                            else
                            {
                                if (this.series.options.data[this.point.x].extension) {
                                    var srcFoto = 'data:image/png;base64,' + this.series.options.data[this.point.x].extension;
                                }
                                else
                                if(this.series.options.data[this.point.x].sexo ==1){
                                    var srcFoto = '/pvd/persona/views/images/persona/no-photo-male.png';
                                }
                                else
                                {
                                    var srcFoto = '/pvd/persona/views/images/persona/no-photo-female.png';
                                }

                                s = '<div style="align:center;"><img src="' + srcFoto + '" width="90" height="90" border="0"/></div>';
                                s += '<div><b>'+ this.point.category + '</b></div>';
                                s += '<span>Resultado: <b>' + this.y + '</b></span>';
                            }
                            return s;
                        }
                        else
                        if(this.series.options.data[this.point.x].promedio != null)
                        {
                            var s = '';
                            if (this.series.name == 'average') {
                                s = this.point.name + ': <b>' + this.y + '</b>';
                            } else {
                                s += '<span>Promedio general: <b>' + this.y + '</b></span>';
                            }
                            return s;
                        }
                        else
                        if(this.series.options.data[this.point.x].promedioevaluado != null)
                        {
                            var s = '';
                            if (this.series.name == 'average') {
                                s = this.point.name + ': <b>' + this.y + '</b>';
                            } else {
                                s += '<span>Promedio de evaluación por dominio: <b>' + this.y + '</b></span>';
                            }
                            return s;
                        }

                    }
                },
                series: [
                 /*   {
                        type: 'pie',
                        name: 'average',
                        data: [],
                        center: [100, 70],
                        size: 100,
                        showInLegend: true,
                        dataLabels: {
                            enabled: true,
                            color: 'black',
                            distance: -20,
                            formatter: function () {
                                return this.y;
                            }
                        }
                    } */ {name: 'Personas evaluadas'},{name: 'Promedio general'},{name: 'Promedio de evaluación por dominio'}

                ]
            }
        });

        var map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'e',
                alt: true,
                fn: function () {
                    self.btnExportProcEval.handler();
                }
            }
        ]);
        /********************************************************************************************************************************************/

        /************************************************PANEL NUEVO DE DISPERSION******************************************************************/

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

        this.btnGraficarDispersion = new Ext.Button({
            text: 'Graficar',
            iconCls: 'chart_bar',
            handler: function () {
                this.fireEvent('graficardispersion');
            }
        });

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
            loader: modelo.tlIndicadores ,
            tbar: [self.btnGraficarDispersion, '->', btnExpandAllNodes, btnColapseAllNodes],
            root: {
                text: 'Raiz',
                id: 'raizProceso'
            }
        });
        this.pChart = new Ext.components.HighchartPanel({
            title: 'Personas por evaluaciones',
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
        this.pContenedor = new Ext.Panel({
            bodyBorder: false,
            title:'Gráfico por períodos',
            disabled:true,
            region: 'center',
            layout: 'border',
            items: [this.tpProceso, this.pChart]
        });
        /*******************************************************************************************************************************************/

        /******************************************PANEL NUEVO DE DISPERSION DE LA PERSONA***********************************************************/
        var btnExpandAllNodesP = new Ext.Button({
            tooltip: 'Expandir todos los nodos',
            iconCls: 'expand_all',
            handler: function () {
                self.tpProceso.expandAll();
            }
        });

        var btnColapseAllNodesP = new Ext.Button({
            tooltip: 'Contraer todos los nodos',
            iconCls: 'collapse_all',
            handler: function () {
                self.tpProceso.collapseAll();
            }
        });

        this.btnGraficarDispersionP = new Ext.Button({
            text: 'Graficar',
            iconCls: 'chart_bar',
            handler: function () {
                this.fireEvent('graficardispersionP');
            }
        });
        this.tpProcesoPP = new Ext.tree.TreePanel({
            region: 'west',
           // title: 'Listado de Personas',
            animate: true,
            containerScroll: true,
            autoScroll: true,
            rootVisible: false,
            collapsible: true,
            split: true,
            minWidth: 100,
            margins: '5 0 5 5',
            cmargins: '5 5 5 5',
            width: '40%',
            layout: 'fit',
            loader: modelo.tlIndicadores ,
            root: {
                text: 'Raiz',
                id: 'raizProcesoPP'
            }
        });

        this.tpProcesoP = new Ext.tree.TreePanel({
            region: 'center',
            //title: 'Listado de Personas',
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
            loader: modelo.tlIndicadoresP ,
            //tbar: [self.btnGraficarDispersionP, '->', btnExpandAllNodesP, btnColapseAllNodesP],
            root: {
                text: 'Raiz',
                id: 'raizProcesoP'
            }
        });
        this.pContenedorPP = new Ext.Panel({
            bodyBorder: false,
            title:'Listado de períodos y personas evaluadas',
            width: '30%',
            tbar: [self.btnGraficarDispersionP, '->', btnExpandAllNodesP, btnColapseAllNodesP],
            region: 'west',
            layout: 'border',
            items: [this.tpProcesoPP, this.tpProcesoP]
        });
        this.pChartP = new Ext.components.HighchartPanel({
            title: 'Personas por evaluaciones',
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
                        text: 'Personas'
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
        this.pContenedorP = new Ext.Panel({
            bodyBorder: false,
            disabled:true,
            title:'Gráfico por personas',
            region: 'center',
            layout: 'border',
            items: [this.pContenedorPP, this.pChartP]
        });
        /********************************************************************************************************************************************/

        this.winResumenProcEval = new Ext.Window({
            title: idioma.lbWinResumenProcEval,
            modal: true,
            parent: self,
            closeAction: 'hide',
            layout: 'border',
            items: [
			   {
                    region: 'west',
                    xtype: 'tabpanel',
                    activeTab: 0,
                    margins: '5 5 5 0',
                    width: '30%',
                    deferredRender: false, //Propiedad importante que renderiza tab del tabpanel
                    items: [
                        {
                            title: idioma.lbPBuscarEstruc,
                            margins: '5 0 5 5',
                            cmargins: '5 5 5 5',
                            region: 'west',
                            collapsible: true,
                            width: '30%',
                            split: true,
                            layout: 'fit',
                            items: this.pEstructCompcion
                        },
                        this.pEstructEval
                    ]
                },
                {
                    region: 'center',
                    xtype: 'tabpanel',
                    activeTab: 0,
                    margins: '5 5 5 0',
                    width: '70%',
                    deferredRender: false, //Propiedad importante que renderiza tab del tabpanel
                    items: [
                        {
                            xtype: 'panel',
                            layout: 'border',
                            title: 'Resumen',
                            items: [this.gpResumenProcEval, this.chartEvaluaciones]
                        },
                        this.pContenedor,this.pContenedorP,this.dispersionChart
                    ]
                }		
				
                
            ],
            keys: [map]
        })
    }
}

//Inicializando la vista.
UCID.portal.cargarEtiquetas('resumenprocesoevaluativo', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    labels = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Evaluaciones.Resumenprocesoevaluativo.Modelo;
    modelo.init();


    //Inicializando la vista.
    var vista = Pvd.Evaluaciones.Resumenprocesoevaluativo.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Evaluaciones.Resumenprocesoevaluativo.Controlador.init(idioma, vista, modelo);

});
