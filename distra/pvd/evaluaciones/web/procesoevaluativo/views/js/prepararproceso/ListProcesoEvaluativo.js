Ext.ns('Ext.PVD.Evaluaciones');
Ext.PVD.Evaluaciones.ListProcesoEvaluativo = Ext.extend(Ext.ux.maximgb.treegrid.GridPanel, {
    stripeRows: true,
    autoExpandColumn: 'expandir',
    master_column_id: 'expandir',
    title: 'Listado de procesos evaluativos',
    root_title: 'Procesos evaluativos',
    viewConfig: {
        forcefit: true
    },
    loadMask: {
        msg: 'Cargando...'
    },
    initComponent: function () {
        var self = this;

        this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            //autoLoad: true,
            remoteSort: true,
            url: this.url,
            listeners: {
                beforeexpandnode: function (st, record) {
                    st.baseParams.idpreprocesoevaluativo = record.get('idpreprocesoevaluativo');
                    st.baseParams.estado = self.estado;
                },
                beforeload: function (st, options) {
                    //Validacion para que no expanda los nodos hijos
                    if (st.active_node && st.active_node.data._is_leaf) {
                        return false;
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                    id: 'idpreprocesoevaluativo',
                    root: 'datos',
                    total: 'cantidad',
                    successProperty: 'success'
                },
                [
                    {
                        name: 'idpreprocesoevaluativo'
                    },
                    {
                        name: 'denominacion'
                    },
                    {
                        name: '_parent'
                    },
                    {
                        name: '_is_leaf'
                    },
                    {
                        name: 'iddefprocesoevaluativo'
                    },
                    {
                        name: 'idperiodoproceso'
                    },
                    {
                        name: 'fechainicio'
                    },
                    {
                        name: 'fechafin'
                    },
                    {
                        name: 'fechainicioevalua'
                    },
                    {
                        name: 'fechafinevalua'
                    },
                    {
                        name: 'restan'
                    },
                    {
                        name: 'idescala'
                    },
                    {
                        name: 'estado'
                    },
                    {
                        name: 'opinionevaluado'
                    },
                    {
                        name: 'puedereclamar'
                    },
                    {
                        name: 'idtipoestructura'
                    },{
                    name: 'planilla'
                }
                ]
            )
        });

        this.columns = [
            {
                id: 'expandir',
                header: 'Denominaci&oacute;n',
                width: 130,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: function (value, meta, record) {
                    var iconCls = 'gear';
                    if (record.get('_is_leaf') == true) {
                        iconCls = 'date'
                    }
                    return "<div class='" + iconCls + "' style='width: 16px; height: 16px;'><p style='margin-left: 20px; margin-top: 2px;'>" + value + "</p></div>";
                }
            },
            {
                header: 'Fecha inicio',
                width: 90,
                dataIndex: 'fechainicio'
            },
            {
                header: 'Fecha fin',
                width: 90,
                dataIndex: 'fechafin'
            },
            {
                header: 'Restan',
                width: 70,
                dataIndex: 'restan',
                tooltip: 'Dias para finalizar el proceso',
                renderer: showDiazRestantes
            },
            {
                header: 'Estado',
                width: 70,
                dataIndex: 'estado',
                tooltip: 'Estado del proceso evaluativo',
                renderer: showEstado
            }
        ];

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.search = new Ext.form.TextField({
            id: 'search' + self.id,
            anchor: '100%',
            minLength: 3,
            maxLength: 100,
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            listeners: {
                specialkey: function (t, e) {
                    if (e.keyCode == 13 && self.search.isValid()) {
                        self.btnBuscar.handler();
                    }
                }.createDelegate(this)
            }
        });

        this.dfFrom = new Ext.form.DateField({
            name: 'fdesde',
            id: 'fdesde' + self.id,
            anchor: '100%',
            format: 'd/m/Y',
            vtype: 'daterange',
            endDateField: 'fhasta' + self.id,
            listeners: {
                specialkey: function (t, e) {
                    if (e.keyCode == 13) {
                        self.btnBuscar.handler();
                    }
                }
            }

        });

        this.dfUp = new Ext.form.DateField({
            name: 'fhasta',
            id: 'fhasta' + self.id,
            anchor: '100%',
            format: 'd/m/Y',
            value: '',
            vtype: 'daterange',
            startDateField: 'fdesde' + self.id,
            listeners: {
                specialkey: function (t, e) {
                    if (e.keyCode == 13) {
                        self.btnBuscar.handler();
                    }
                }
            }
        });

        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            id: 'btnBuscar' + self.id,
            tooltip: 'Buscar proceso o período evaluativo <b>(Alt+B)</b>',
            text: 'Buscar',
            handler: function () {
                if (self.search.isValid()) {
                    self.store.baseParams.denominacion = self.search.getValue();
                    self.store.baseParams.fdesde = self.dfFrom.getRawValue();
                    self.store.baseParams.fhasta = self.dfUp.getRawValue();
                    self.store.load({params: {

                        start: 0,
                        limit: 15
                    }});
                }
            }.createDelegate(this)
        });

        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar' + self.id,
            text: 'Limpiar',
            tooltip: 'Limpiar filtros <b>(Alt+L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                self.search.setValue('');
                self.dfFrom.reset();
                self.dfUp.reset();
                self.store.baseParams.idpreprocesoevaluativo = '';
                self.store.baseParams.denominacion = '';
                self.store.baseParams.fdesde = '';
                self.store.baseParams.fhasta = '';
                self.store.load({params: {start: 0, limit: 15}})
            }
        });
        this.tbar = ['Denominación: ', this.search, ' ', 'Fecha inicio: ', this.dfFrom, ' ', 'Fecha fin: ', this.dfUp, '', this.btnBuscar, this.btnLimpiar];

        this.bbar = new Ext.ux.maximgb.treegrid.PagingToolbar({
            pageSize: 15,
            store: this.store,
            displayInfo: true
        });

        this.key = [
            {
                key: 'b',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnBuscar.disabled) {
                        self.btnBuscar.handler();
                    }

                }
            },
            {
                key: 'l',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.btnLimpiar.handler();
                    }
                }
            }
        ];

        Ext.PVD.Evaluaciones.ListProcesoEvaluativo.superclass.initComponent.call(this);

        function showDiazRestantes(val) {
            if (Ext.isEmpty(val)) {
                return '';
            } else if (val === 0) {
                return '<b style="color:blue;">Conluido</b>';
            } else {
                return '<b>' + val + ' d&iacute;as</b>';
            }
        }
        function showEstado(val) {
            if (Ext.isEmpty(val)) {
                return '';
            } else if (val == 1) {
                return '<b style="color:green;">Abierto</b>';
            } else {
                return '<b style="color:red;">Cerrado</b>';
            }
        }

    }
});
