Ext.ns('Ext.PVD.Evaluaciones');
Ext.PVD.Evaluaciones.ComboBoxEscala = Ext.extend(Ext.form.ComboBox, {
    valueField: 'valor',
    hiddenName: 'valor',
    editable: false,
    allowBlank: false,
    displayField: 'denom',
    typeAhead: true,
    mode: 'remote',
    triggerAction: 'all',
    emptyText: 'Seleccione',
    selectOnFocus: true,
    tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
    initComponent: function() {
        var self = this;

        self.store = new Ext.data.Store({
            url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/cargarEscala',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'valor'},
                {name: 'denom'}
            ]),
            listeners: {
                beforeload: function (st, options) {
                    st.baseParams.idescala = self.idescala;
                }
            }
        });

        this.on('beforequery', function (evt) {
            self.store.load();
        });
        Ext.PVD.Evaluaciones.ComboBoxEscala.superclass.initComponent.call(this);
    }
});

Ext.PVD.Evaluaciones.CmpPlanillaEvaluativa = Ext.extend(Ext.ux.maximgb.treegrid.GridPanel, {
    stripeRows: true,
    autoExpandColumn: 'expandir',
    master_column_id: 'expandir',
    title: 'Planilla evaluativa',
    root_title: 'Indicadores',
    loadMask: {
        msg: 'Cargando...'
    },
    clicksToEdit: 1,
    initComponent: function () {
        var self = this;
		this.addEvents('evalIndChanged');

        var stEvaluacion = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            autoLoad: true,
            url: this.url,
            listeners: {
                beforeexpandnode: function (st, record) {
                    st.baseParams._id = record.get('_id');
                },
                beforeload: function (st, options) {
                    st.baseParams = self.baseParams;
                }
            },
            reader: new Ext.data.JsonReader({
                    id: '_id',
                    root: 'data',
                    successProperty: 'success'
                },
                [
                    {
                        name: '_id'
                    },
                    {
                        name: 'idindicador'
                    },
                    {
                        name: 'complementotextual'
                    },
                    {
                        name: 'valorComplementotextual'
                    },
                    {
                        name: 'denom'
                    },
                    {
                        name: 'descripcion'
                    },
                    {
                        name: 'ayuda'
                    },
                    {
                        name: '_parent'
                    },
                    {
                        name: '_is_leaf'
                    },
                    {
                        name: 'idescala'
                    },
                    {
                        name: 'escalaNumerica'
                    },
                    {
                        name: 'valor'
                    },
                    {
                        name: 'valorMostrar'
                    },
                    {
                        name: 'calculado'
                    },
                    {
                        name: 'idexpresionmatematica'
                    },
                    {
                        name: 'idindicadorevaluacion'
                    }
                ]
            )
        });
        this.store = stEvaluacion;

        var cmEvaluacion = [
            {
                id: 'expandir',
                header: "Indicador",
                width: 200,
                sortable: true,
                dataIndex: 'denom',
                renderer: self.showImageTipoIndicador
            },
            {
                header: "Evaluaci&oacute;n",
                width: 140,
                dataIndex: 'valorMostrar'
                //editor: this.editable ? cbEscala : null
            }
        ];
        this.columns = cmEvaluacion;

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        Ext.PVD.Evaluaciones.CmpPlanillaEvaluativa.superclass.initComponent.call(this);

        this.on('load', function (st, node) {
            node.expand();
        });

        this.on('beforeedit', function (obj) {
            if (!obj.record.get('idescala')) {
                return false;
            }
        });

        this.on('cellclick', function (grid, rowIndex, columnIndex, e) {
            if(columnIndex == 1){
                var record = grid.getStore().getAt(rowIndex);
                var editor;

                //Implementar la validacion del campo numerico aqui
                if(record.data.escalaNumerica && record.data.escalaNumerica.representacion == 1) {
                    editor = new Ext.form.NumberField({
                        allowBlank: false,
                        minValue: record.get('escalaNumerica').valorinicial,
                        maxValue: record.get('escalaNumerica').valorfinal,
                        decimalPrecision: record.get('escalaNumerica').precision
                    });
                } else {
                    editor = new Ext.PVD.Evaluaciones.ComboBoxEscala({
                        idescala: record.get('idescala')
                    });
                }
                cmEvaluacion[columnIndex].editor = editor;
                self.reconfigure(stEvaluacion, new Ext.grid.ColumnModel(cmEvaluacion));
            }
        });

        this.on('afteredit', function (object) {
            if (object.column == 1) {
                object.record.set('valor', object.value);
                object.record.set('valorMostrar', object.value);
                //if(object.record.get('idescala') != '') {
                //    object.record.set('valor', object.value);
                //    object.record.set('valorMostrar', object.value);
                //} else {
                //    object.record.set('valor', object.value);
                //    object.record.set('valorMostrar', object.value);
                //}
                this.fireEvent('evalIndChanged', object.record);
            }
        },this);
    },
    showValEval: function (val, fn, record) {
        if (record.get('idexpresionmatematica') && record.get('valor')) {
            return '<b>' + val + '</b>';
        } else {
            return val;
        }
    }
});