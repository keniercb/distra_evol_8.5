Ext.define('ConfContratacion.view.TrasitionPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.trasitionpanel',
    border: false,
    frame: false,
    margin: false,
    height: 550,
    layout: 'border',
    requires: [
        'Ext.grid.*',
        'Ext.grid.plugin.CellEditing',
        'ConfContratacion.view.GridRules'
    ],
    initComponent: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);

        this.title = this.etiquetas.lbTransiciones;

        this.stTransition = Ext.create('ConfContratacion.store.Transitions');

        this.storeComboComite = Ext.create('Ext.data.Store', {
            fields: [
                'idcomitegeneral', 'nombre', 'idproceso',
                'proceso', 'pordefecto', 'descripcion'
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getConfComite'}, ModuleMgr.get('ConfContratacion')),
                reader: {
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success'
                }
            }
        });

        me.comboComite = Ext.create('Ext.form.field.ComboBox', {
            store: this.storeComboComite,
            valueField: 'idcomitegeneral',
            displayField: 'nombre',
            queryMode: 'local'
        });

        this.cmTransition = [
            {
                text: 'Estado inicial',
                sortable: false,
                dataIndex: 'nombreestadoinicial',
                flex: 1
            },
            {
                text: 'Estado final',
                sortable: false,
                dataIndex: 'nombreestadofinal',
                flex: 1
            },
            {
                text: 'Comite',
                dataIndex: 'idcomite',
                flex: 1,
                editor: me.comboComite,
                renderer: function (value, meta, record) {
                    var editor = meta.column.getEditor(record);
                    //editor.store.load()
                    var storeRecord = null;
                    for (var i in editor.store.data.items) {
                        if (editor.store.data.items[i].get('idcomitegeneral') == value)
                            storeRecord = editor.store.data.items[i];
                    }
                    if (storeRecord) {
                        return storeRecord.data[editor.displayField];
                    } else {
                        return null;
                    }
                }
            }
        ];

        this.gpTransition = Ext.create('Ext.grid.Panel', {
            name: 'gpTransition',
            region: 'west',
            border: false,
            frame: false,
            flex: 0.5,
            columns: this.cmTransition,
            store: this.stTransition,
            viewConfig: {
                stripeRows: true
            },
            features: [{ftype: 'grouping', groupHeaderTpl: 'Proceso: {name}'}],
            selModel: {mode: 'MULTI'},
            selType: 'checkboxmodel',
            autoScroll: true,
            plugins: [
                new Ext.grid.plugin.CellEditing({
                    clicksToEdit: 2,
                    listeners: {
                        edit: function (yo, obj) {

                        }
                    }
                })
            ]
        });

        this.btnAdd = this.gpTransition.btnAdd = Ext.create('Ext.Button', {
            action: 'addtransition',
            iconCls: 'adicionar',
            text: 'Adicionar',
            tooltip: ''
        });

        this.btnDel = this.gpTransition.btnDel = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'deltransition',
            disabled: true,
            text: this.etiquetas.lbBtnDel,
            tooltip: ''
        });

        this.stRol = Ext.create('ConfContratacion.store.Roles');

        this.cmRol = [
            {
                text: 'Rol',
                sortable: false,
                dataIndex: 'denominacion',
                flex: 1
            },
            {
                text: 'Abreviatura',
                sortable: false,
                dataIndex: 'abreviatura',
                flex: 1
            }
        ];

        this.gpRol = Ext.create('Ext.grid.Panel', {
            //title: 'Roles',
            region: 'center',
            border: false,
            frame: false,
            flex: 0.5,
            margin: '0 0 0 5',
            columns: this.cmRol,
            store: this.stRol,
            autoScroll: true,
            features: [{ftype: 'grouping', groupHeaderTpl: 'Proceso: {name}'}],
            viewConfig: {
                stripeRows: true
            }
        });

        this.gpRules = Ext.create('ConfContratacion.view.GridRules', {
            region: 'south',
            collapsible:true,
            flex:0.3,
            minHeight: 150,
            disabled: true
        });

        this.items = [this.gpTransition, this.gpRol, this.gpRules];

        this.tbar = [this.btnAdd, this.btnDel];

        this.callParent();
    }
});

