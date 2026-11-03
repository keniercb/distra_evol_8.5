Ext.ns('Ext.components.Evaluaciones');
Ext.components.Evaluaciones.gpListProcesEvaluativos = Ext.extend(Ext.grid.GridPanel, {
    //autoscroll: true,
    view: new Ext.grid.GroupingView({
        forceFit: true,
        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Procesos" : "Proceso"]})'
    }),
    autoExpandColumn: 'expandir',
    initComponent: function () {
        var self = this;

        this.store = new Ext.data.GroupingStore({
            sortInfo: {field: 'tipoproceso', direction: 'ASC'},
            groupField: 'denom',
            url: '/pvd/evaluaciones/procesoevaluativo/index.php/prepararproceso/getProcesosEvalPlanillaActiva',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {name: 'idpreprocesoevaluativo', type: 'int'},
                {name: 'iddefprocesoevaluativo'},
                {name: 'fechainicioevalua'},
                {name: 'fechafinevalua'},
                {name: 'fechainicioproceso'},
                {name: 'fechafinproceso'},
                {name: 'denom'},
                {name: 'fechacomienzo'},
                {name: 'idtipoprocesoevaluativo'},
                {name: 'evaluadoresevaluados'},
                {name: 'comisionevaluacion'},
                {name: 'orden'},
                {name: 'tipoproceso'},
                {name: 'autoevaluacion'},
                {name: 'puedereclamar'},
                {name: 'opinionevaluado'},
                {name: 'idplanilla'}
            ])
        });

        this.columns = [
            {header: 'Denominaci&oacute;n', sortable: true, dataIndex: 'denom', hidden: true},
            {id: 'expandir', header: 'Tipo de proceso', width: 250, sortable: true, dataIndex: 'tipoproceso'},
            {header: 'Fecha inicio evalúa', width: 150, sortable: true, dataIndex: 'fechainicioevalua', renderer: PVD.formatDate},
            {header: 'Fecha fin evalúa', width: 150, sortable: true, dataIndex: 'fechafinevalua', renderer: PVD.formatDate}
        ];

        this.bbar = new Ext.PagingToolbar({
            pageSize: (self.pageSize) ? self.pageSize : 10,
            store: self.store,
            displayInfo: true,
            displayMsg: self.labels.lbDisplayMsg,
            emptyMsg: self.labels.lbEmptyMsg
        });

        /**
         * Campos de busqueda
         */
        this.stProceso = new Ext.data.JsonStore({
            url: '/pvd/evaluaciones/procesoevaluativo/index.php/tipoproceso/todostipoprocesos',
            root: 'datos',
            fields: [
                {name: 'idtipoprocesoevaluativo'},
                {name: 'denom'}
            ]
        });

        this.cbProceso = new Ext.form.ComboBox({
            store: this.stProceso,
            fieldLabel: 'Proceso',
            valueField: 'idtipoprocesoevaluativo',
            hiddenName: 'idtipoprocesoevaluativo',
            editable: false,
            displayField: 'denom',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            anchor: '50%'
        });

        this.stDenominacion = new Ext.data.JsonStore({
            url: '/pvd/evaluaciones/procesoevaluativo/index.php/definirproceso/todosdefinirprocesosevaluativos',
            root: 'datos',
            fields: [
                {name: 'iddefprocesoevaluativo'},
                {name: 'denom'}
            ]
        });

        this.cbDenominacion = new Ext.form.ComboBox({
            store: this.stDenominacion,
            valueField: 'iddefprocesoevaluativo',
            hiddenName: 'iddefprocesoevaluativo',
            editable: false,
            displayField: 'denom',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            anchor: '50%',
            minLength: 3,
            maxLength: 100,
            width: 250
        });
        this.btnLimpiar = new Ext.Button({
            text: 'Limpiar',
            tooltip: 'Limpiar filtro <b>(Alt+L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                self.cbDenominacion.reset();
                self.cbProceso.reset();
                self.store.load({params: {start: 0, limit: 15}});
            }
        });

        this.btnBuscar = new Ext.Button({
            text: 'Buscar',
            tooltip: 'Buscar tipo proceso <b>(Alt+B)</b>',
            iconCls: 'buscar',
            handler: function () {
                if (self.cbDenominacion.getValue() > 0 || self.cbProceso.getValue() > 0) {
                    self.store.load({
                        params: {
                            start: 0,
                            limit: 15,
                            iddefprocesoevaluativo: self.cbDenominacion.getValue(),
                            idtipoprocesoevaluativo: self.cbProceso.getValue()
                        }
                    });
                }
            }
        });

        /*Fin de los campos de busqueda*/
        this.store.on('load', function () {
            this.stProceso.baseParams.limit = 15;
            this.stProceso.baseParams.start = 0;
            this.stProceso.load();
            this.stDenominacion.baseParams.limit = 15;
            this.stDenominacion.baseParams.start = 0;
            this.stDenominacion.load();
            self.btnBuscar.focus();
        }, this)

        this.keys = [
            {
                key: 'l',
                alt: true,
                fn: function () {
                    self.btnLimpiar.handler();
                }
            },
            {
                key: 'b',
                alt: true,
                fn: function () {
                    self.btnBuscar.handler();
                }
            }
        ];

        this.tbar = [' Proceso evaluativo:', this.cbDenominacion, ' Tipo de proceso evaluativo:', this.cbProceso, this.btnBuscar, this.btnLimpiar];
        this.sm = new Ext.grid.RowSelectionModel({singleSelect: true});
        this.loadMask = {msg: self.labels.lbGridLoadMask};
        Ext.components.Evaluaciones.gpListProcesEvaluativos.superclass.initComponent.call(this);
    }
});
