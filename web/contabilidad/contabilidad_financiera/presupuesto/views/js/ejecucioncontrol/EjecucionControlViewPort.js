/**
 * Created by Emmanuel on 12/5/2017.
 */
/**
 *
 */
Ext.namespace('Contabilidad.AnalizarDesagregacionViewPort');
Ext.QuickTips.init();

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        new Contabilidad.AnalizarDesagregacionViewPort.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
    }
});

Contabilidad.AnalizarDesagregacionViewPort.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            idioma: params.idioma,
        });

        this.crearMenu();
        this.crearGrid();
        this.PanelAnalisis = new Ext.Panel({
            id: "analisis",
            border: false,
            frame: false,
            layout: 'border',
            items: [
                this.PanelMenu,
                this.PanelGrid
            ]
        });

        this.exampleDataGraph=[
            ['Gastos','Gastos por períodos'],
            ['Gastos','Ingresos por períodos'],
            ['Gastos','Otros conceptos por períodos'],
        ];
        this.storeGraph = new Ext.data.SimpleStore({
            fields: ['abbr', 'state'],
            data : this.exampleDataGraph
        });
        this.comboGraph = new Ext.form.ComboBox({
            store: this.storeGraph,
            displayField:'state',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText:'Seleccione período ...',
            selectOnFocus:true,
        });

        this.stMenu.load();

        this.items=this.PanelAnalisis;

        this.initEventos();

        Contabilidad.AnalizarDesagregacionViewPort.Viewport.superclass.constructor.call(this, params);
    },
    crearGrid: function () {

        this.exampleData=[
            ['1','Enero'],
            ['1','Febrero'],
            ['1','Marzo'],
            ['1','Abril'],
            ['1','Mayo'],
            ['1','Junio'],
            ['1','Julio'],
            ['1','Agosto'],
            ['1','Septiembre'],
            ['1','Octubre'],
            ['1','Noviembre'],
            ['1','Diciembre']
        ];
        this.store = new Ext.data.SimpleStore({
            fields: ['abbr', 'state'],
            data : this.exampleData
        });
        this.combo = new Ext.form.ComboBox({
            store: this.store,
            displayField:'state',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText:'Seleccione período ...',
            selectOnFocus:true,
        });

        this.exampleDataEjercicio=[
            ['1','2014'],
            ['1','2015'],
            ['1','2016'],
            ['1','2017'],
            ['1','2018'],
            ['1','2019'],
            ['1','2020']
        ];
        this.storeEjercicio = new Ext.data.SimpleStore({
            fields: ['abbr', 'state'],
            data : this.exampleDataEjercicio
        });

        this.comboEjercicio = new Ext.form.ComboBox({
            store: this.storeEjercicio,
            displayField:'state',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText:'Seleccione ejercicio ...',
            selectOnFocus:true,
        });

        this.btnGraficar = new Ext.Button({
            iconCls: 'guardar',
            disabled:false,
            text: 'Graficar',
            tooltip: 'Cambiar esto****',

        });
        this.btnAyudaEjecucionControl = new Ext.Button({
            id: 'btnAyudaEjecucionControl',
            text: this.idioma.lbbtnayuda,
            tooltip: this.idioma.tooltipayuda,
            iconCls: 'ayuda'
        });

        this.btnExportar = new Ext.Button({
            iconCls: 'exportar',
            disabled:false,
            text: 'Exportar',
            tooltip: 'Cambiar esto****',

        });
        this.btnBusqueda = new Ext.Button({
            iconCls: 'buscar',
            disabled:false,
            text: 'Búsqueda avanzada',
            tooltip: 'Cambiar esto****',

        });

        this.myData = [
            ['3392','5000 Salarios','3392','456','45','78','56','-','45','56','37','67','42'],
            ['4523','5001 Salario','132','12','82','46','24','-','46','82','24','150','46'],
            ['3392','5002 Pago por Resultado Empresarial','45','3','78','70','12','-','67','82','47','150','36'],
            ['3392','5003 Vacaciones','432','78','3','45','54','-','1652','12','12','21','23'],
            ['3392','5004 Haberes Militares','32','8','82','69','68','-','28','21','56','23','23'],
            ['3392','5009 SALARIOS','67','45','82','54','45','-','89','82','45','69','45'],
            ['3392','7000 DEPRECIACIÓN Y AMORTIZACIÓN','87','28','45','78','36','-','36','57','45','57','35'],
        ];
        this.store = new Ext.data.SimpleStore({
            fields: [
                {name: 'company'},
                {name: 'req1'},
                {name: 'req2'},
                {name: 'req3'},
                {name: 'req4'},
                {name: 'req5'},
                {name: 'req6'},
                {name: 'req7'},
                {name: 'req8'},
                {name: 'req9'},
                {name: 'req10'},
                {name: 'req11'},
                {name: 'req12'},
            ],
            baseParams: {start:0 , limit: 20}
        });
        this.paginToolbar = new Ext.Cont.PagingToolbar({
            pageSize: 20,
            displayInfo: true,
            clearFilter: true,
            displayMsg: this.idioma.lbDisplayMsg,
            emptyMsg: this.idioma.lbEmptyMsg,
            firstText: this.idioma.lbPrimeraPagina,
            lastText: this.idioma.lbUltimaPagina,
            store: this.store
        });

        this.grid = new Ext.grid.GridPanel({
            store: this.store,

            columns: [
                {id:'company',header: "Company", width: 160, sortable: true, dataIndex: 'company',hidden:true},
                {header: "Elementos", width: 75, sortable: true, dataIndex: 'req1'},
                {header: "Plan Anual", width: 75, sortable: true, dataIndex: 'req2'},
                {header: "Plan del Periodo", width: 75, sortable: true, dataIndex: 'req3'},
                {header: "Real", width: 85, sortable: true, dataIndex: 'req4'},
                {header: "Variación", width: 85, sortable: true, dataIndex: 'req5'},
                {header: "%", width: 85, sortable: true, dataIndex: 'req6'},
                {header: "Observación", width: 85, sortable: true, dataIndex: 'req7'},
                {header: "Plan Anual hasta la Fecha", width: 85, sortable: true, dataIndex: 'req8'},
                {header: "Plan del Período hasta la Fecha", width: 85, sortable: true, dataIndex: 'req9'},
                {header: "Real hasta la Fecha", width: 85, sortable: true, dataIndex: 'req10'},
                {header: "Variación hasta la Fecha", width: 85, sortable: true, dataIndex: 'req11'},
                {header: "% hasta la Fecha", width: 85, sortable: true, dataIndex: 'req12'},
            ],
            //stripeRows: true,
            autoExpandColumn: 'company',
            height:'100%',
           width:'100%',
            tbar: [
            new Ext.app.SearchField({
                store: this.stMenu,
                width:280
            })
        ],
            viewConfig: {
                forceFit: true
            },
            bbar: this.paginToolbar
        });
        this.store.loadData(this.myData);

        this.PanelGridAux = new Ext.Panel({
            region      : 'center',
            layout:'fit',
            tbar: [this.btnGraficar,this.btnExportar,this.btnBusqueda],
            items:[this.grid]
        })
        this.PanelGrid = new Ext.Panel({
            region      : 'center',
            layout:'fit',
            title: 'Ejecución del presupuesto planificado',
            tbar: ['Ejercicio contable', ' ', '-',this.comboEjercicio ,' ','Período contable', ' ', '-', this.combo ,'->',this.btnAyudaEjecucionControl],
            items:[this.PanelGridAux]
        })


    },
    crearMenu : function () {
        this.stMenu = new Ext.data.JsonStore({
            scope:this,
            url: 'obtenerEstructurasPadre',
            autoload: false,
            root: 'datos',
            fields: [
                {
                    name: 'codigocentrogrupo'
                }, {
                    name: 'concat'
                }, {
                    name: 'concatpadre'
                }, {
                    name: 'descripcioncentrogrupo'
                }, {
                    name: 'idanalisis'
                }, {
                    name: 'idcentrogrupo'
                }, {
                    name: 'idcuenta'
                }, {
                    name: 'idestado'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'idformato'
                }, {
                    name: 'idpadre'
                }, {
                    name: 'idtipo'
                }, {
                    name: 'nivel'
                }, {
                    name: 'ordender'
                }, {
                    name: 'ordenizq'
                }, {
                    name: 'text'
                }
            ]
        })
        this.arbol = new Ext.tree.TreePanel({
            region: 'center',
            layout: 'fit',
            split: true,
            margins: '3 0 0 3',
            autoScroll: true,
            rootVisible: false,
            root: new Ext.tree.TreeNode({
                draggable: false,
                expanded: true,
                id: '0'
            })
        });

        this.PanelMenu = new Ext.Panel({
            title: this.idioma.lbCentroCosto,
            region      : 'west',
            collapsible : true,
            margins     : '3 0 3 3',
            cmargins    : '3 3 3 3',
            tbar: [
                new Ext.app.SearchField({
                    store: this.stMenu,
                    width:280
                })
            ],
            items:[this.arbol]
        })
    },
    fGraph: function() {
        this.data = [{"name":"CON ERROR","y":25.81,"cant":"8","sliced":false},
            {"name":"ASENTADO","y":35.48,"cant":"11","sliced":false},
            {"name":"TERMINADO","y":6.45,"cant":"2","sliced":false},
            {"name":"SIN ERROR","y":22.58,"cant":"7","sliced":false},
            {"name":"ANULADO","y":9.68,"cant":"3","sliced":false}];


            w_graficar = new Ext.Window({
                title: 'Graficar',
                closable: true,
                height: 400,
                html: '<div id="container" style="width: 630px; height: 370px; margin: 0 auto"></div>',
                layout: 'fit',
                modal: true,
                resizable: false,
                constrain: true,
                width: 630,
                tbar:this.comboGraph,
                listeners: {

                }
            });
            w_graficar.show();




    },
    initEventos : function () {
        this.stMenu.on({
            scope : this,
            load : function (store,records) {
                var rootNode = store.scope.arbol.getRootNode()
                while (rootNode.firstChild) {
                    rootNode.removeChild(rootNode.firstChild);
                }
                var nodo =  this.arbol.getRootNode();
                nodo.appendChild([new Ext.tree.TreeNode({
                    scope : this,
                    text: this.idioma.lbNodoCentroCosto,
                    id: -1,
                    listeners: {


                    }
                })]);
                nodo.appendChild([new Ext.tree.TreeNode({
                    scope : this,
                    text: this.idioma.lbNodoIngresos,
                    id: -2,
                    listeners: {

                        scope : this,
                        'click': function(nodo, evento) {
                            if(this.store.scope.PanelGridDesagregacion.cbEjercicio.isValid()) {
                                this.store.scope.PanelGridDesagregacion.idCentroCostoSeleccionado=record.data.idcentrogrupo;
                                this.store.scope.PanelGridDesagregacion.textCentroCostoSeleccionado=record.data.text;
                                this.store.scope.PanelGridDesagregacion.reconfigurarGrid(this.store.scope.PanelGridDesagregacion.cbEjercicio.getValue(),
                                    this.store.scope.PanelGridDesagregacion.cbEjercicio.getRawValue(), this.store.scope.PanelGridDesagregacion.idioma, this.data.idcentrogrupo);
                                this.store.scope.tipoSelecionado=1;
                            }
                            else
                            {
                                mostrarMensaje(1, this.store.scope.idioma.msgSeleccionaEjercicio);
                            }
                        }
                    }
                })]);
                nodo.appendChild([new Ext.tree.TreeNode({
                    scope : this,
                    text: this.idioma.lbNodoOtrosConceptos,
                    id: -3,
                    listeners: {

                        scope : this,
                        'click': function(nodo, evento) {
                            if(this.PanelGridDesagregacion.cbEjercicio.isValid()) {
                                this.PanelGridDesagregacion.reconfigurarGrid(this.PanelGridDesagregacion.cbEjercicio.getValue(),
                                    this.PanelGridDesagregacion.cbEjercicio.getRawValue(), this.PanelGridDesagregacion.idioma);
                                this.tipoSelecionado=3;
                            }
                            else
                            {
                                mostrarMensaje(1, this.idioma.msgSeleccionaEjercicio);
                            }
                        }
                    }
                })]);
                store.each(function (record,scope) {

                    if(record.data.idcentrogrupo == record.data.idpadre || this.store.reader.jsonData.esBusqueda=='true')
                    {
                        var nodo = this.store.scope.arbol.getNodeById(-1);
                    }
                    else
                    {
                        var nodo = this.store.scope.arbol.getNodeById( record.data.idpadre);
                    }
                    nodo.appendChild([new Ext.tree.TreeNode({
                        scope : this,
                        text: record.data.text,
                        id: record.data.idcentrogrupo,
                        listeners: {
                            scope : this,
                            'click': function(nodo, evento) {
                                if(this.store.scope.PanelGridDesagregacion.cbEjercicio.isValid()) {
                                    this.store.scope.PanelGridDesagregacion.idCentroCostoSeleccionado=record.data.idcentrogrupo;
                                    this.store.scope.PanelGridDesagregacion.textCentroCostoSeleccionado=record.data.text;
                                    this.store.scope.PanelGridDesagregacion.reconfigurarGrid(this.store.scope.PanelGridDesagregacion.cbEjercicio.getValue(),
                                        this.store.scope.PanelGridDesagregacion.cbEjercicio.getRawValue(), this.store.scope.PanelGridDesagregacion.idioma, this.data.idcentrogrupo);
                                    this.store.scope.tipoSelecionado=1;
                                }
                                else
                                {
                                    mostrarMensaje(1, this.store.scope.idioma.msgSeleccionaEjercicio);
                                }
                            }
                        }
                    })]);
                })
            }
        });
        this.btnGraficar.on({
            scope:this,
            click: function () {
                this.fGraph();
            }
        })
        this.comboGraph.on({
            scope:this,
            select: function (combo, record, index) {
                if(index==0){
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Resumen del presupuesto de Gastos por períodos'
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: [
                                'Junio',
                                'Junio hasta la fecha'
                            ],
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Pesos (miles de pesos)'
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} miles de pesos</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: 'Plan del año',
                            data: [49.9, 71.5]

                        }, {
                            name: 'Real actual del año',
                            data: [43.6, 78.8]

                        }, {
                            name: 'Real del año anterior',
                            data: [48.9, 88.8]

                        }]
                    });
                }
                if(index==1){
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Resumen del presupuesto de Ingresos por períodos'
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: [
                                'Junio',
                                'Junio hasta la fecha'
                            ],
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Pesos (miles de pesos)'
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} miles de pesos</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: 'Plan del año',
                            data: [19.9, 31.5]

                        }, {
                            name: 'Real actual del año',
                            data: [13.6, 38.8]

                        }, {
                            name: 'Real del año anterior',
                            data: [18.9, 38.8]

                        }]
                    });
                }
                if(index==2){
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Resumen del presupuesto de Otros conceptos por períodos'
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: [
                                'Junio',
                                'Junio hasta la fecha'
                            ],
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Pesos (miles de pesos)'
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} miles de pesos</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: 'Plan del año',
                            data: [99.9, 131.5]

                        }, {
                            name: 'Real actual del año',
                            data: [93.6, 138.8]

                        }, {
                            name: 'Real del año anterior',
                            data: [98.9, 138.8]

                        }]
                    });
                }
            }
        })
    }

});

Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.app.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',

    onTrigger1Click : function(){
        if(this.hasSearch){
            this.el.dom.value = '';
            var o = {start: 0};
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = '';
            this.store.reload({params:o});
            this.triggers[0].hide();
            this.hasSearch = false;
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        if(v.length < 1){
            this.onTrigger1Click();
            return;
        }
        var o = {start: 0};
        this.store.baseParams = this.store.baseParams || {};
        this.store.baseParams[this.paramName] = v;
        this.store.reload({params:o});
        this.hasSearch = true;
        this.triggers[0].show();
    }
});
