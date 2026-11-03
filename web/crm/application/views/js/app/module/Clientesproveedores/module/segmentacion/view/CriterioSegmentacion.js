Ext.define('Segmentacion.view.CriterioSegmentacion', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.CriterioSegmentacion',

    autoScroll: true,
    maximizable: true,
    layout: 'column',
    margin: '0 0 5 0',

    initComponent: function () {
        this.createInitialConfig();
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.label = Ext.create('Ext.form.Label', {
            text: me.fieldLabel,
            margin: '15 0 0 5',
            columnWidth: 0.2,
            style: 'font-weight:bold'
        });
        var dataStore;
        if (me.context == 'segmentacionwindowpregunta' && me.dataType != 'alphanumeric') {console.log(me.dataType)
            dataStore = [
                {"value": "igual", "name": me.etiquetas.lbIgual},
                {"value": "mayorigual", "name": me.etiquetas.lbMayorIgual},
                {"value": "menorigual", "name": me.etiquetas.lbMenorIgual},
                {"value": "moyor", "name": me.etiquetas.lbMayor},
                {"value": "menor", "name": me.etiquetas.lbMenor},
            ];
        } else {
            dataStore = [
                {"value": "igual", "name": me.etiquetas.lbIgual},
                {"value": "parcialigual", "name": me.etiquetas.lbParcialIgual},
            ];
        }
        me.storeCombo = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: dataStore
        });
        me.combo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbOperador,
            emptyText: me.etiquetas.lbSeleccioneOperador,
            store: me.storeCombo,
            queryMode: 'local',
            autoSelect: true,
            forceSelection: true,
            context: 'operador',
            allowBlank: false,
            width: 150,
            displayField: 'name',
            valueField: 'value'
        });
        me.radio = Ext.create('Ext.form.RadioGroup', {
            anchor: 'none',
            width: 128,
            vertical: true,
            columns: 1,
            layout: {
                autoFlex: true
            },
            defaults: {
                name:  me.mapping,
                margin: '0 15 0 0'
            },
            items: [{
                inputValue: 'obtenervalues',
                boxLabel: me.etiquetas.lbObtenerValores,
                checked: true
            }, {
                inputValue: 'proporcionarvalor',
                boxLabel: me.etiquetas.lbProporcionarValor
            }]
        });
        me.cmbfieldselect = Ext.create('Ext.ux.CmbSelectField', {
            name: me.name,
            //fieldLabel: fieldLabel,
            mapping: me.mapping,
            localId: me.localId,
            module: me.module,
            noactions: true,
            displayField: me.name,
            valueField: me.localId,
            allowBlank: false,
            columnWidth: 0.8,
            margin: '10 10 0 0',
            forceSelection: true,
            filters: me.filters
        });
        me.campoValor = Ext.create('Ext.form.field.Text', {
            name: me.name,
            allowBlank: false,
            hidden: true,
            columnWidth: 0.8,
            margin: '10 10 0 0',
        });
        me.panel = Ext.create('Ext.panel.Panel', {
            bodyStyle: 'background:#DFE9F6;',
            border: false,
            layout: 'column',
            columnWidth: 1,
            //disabled: true,
            defaults: {
                anchor: '99%',
                margin: '0 5 5 5',
                bodyStyle: 'background:#DFE9F6;',
                border: true,
            },
            margin: 0,
            items: [
                me.label,
                me.combo,
                Ext.create('Ext.panel.Panel', {
                    bodyStyle: 'background:#DFE9F6;',
                    border: false,
                    layout: 'column',
                    //disabled: true,
                    //width: 150,
                    defaults: {
                        anchor: '99%',
                        margin: 0,
                        columnWidth: 1,
                        bodyStyle: 'background:#DFE9F6;',
                    },
                    margin: 0,
                    items: [me.radio]
                }),
                Ext.create('Ext.form.field.Hidden', {
                    name: me.localId
                }),
                me.cmbfieldselect,
                me.campoValor,
                {
                    xtype: 'button',
                    iconCls: 'icondistra-eliminar',
                    action: 'eliminar',
                    width: 23,
                    height: 23,
                    tooltip: me.etiquetas.lbEliminar+ " " + me.etiquetas.lbSegmento.toLowerCase(),
                    margin: '10 5 0 0'
                }
            ]
        });

        me.items = [me.panel];

    }
});
