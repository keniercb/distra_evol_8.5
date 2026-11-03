Ext.define('ConfContratacion.view.WindowRule', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowrule',
    layout: 'fit',
    initComponent: function () {
        this.getLang();

        this.concept = 'Regla';

        this.hdType = Ext.create('Ext.form.field.Hidden', {
            name: 'idtiporegla'
        });

        this.cmbType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Tipo',
            store: Ext.create('ConfContratacion.store.RuleTypes'),
            queryMode: 'local',
            displayField: 'tiporegla',
            valueField: 'tiporegla',
            allowBlank: false,
            forceSelection: true,
            name: 'tiporegla',
            localId: 'idtiporegla'
        });

        this.stRol = Ext.create('Ext.data.Store', {
            model: 'ConfContratacion.model.Rol',
            storeId: 'stReglaRol'
        });

        this.hdRol = Ext.create('Ext.form.field.Hidden', {
            name: 'idrol'
        });

        this.cmbRol = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Rol',
            store: this.stRol,
            queryMode: 'local',
            displayField: 'denominacion',
            valueField: 'denominacion',
            allowBlank: false,
            forceSelection: true,
            name: 'nombrerol',
            localId: 'idrol'
        });

        this.nfvalue = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Cantidad',
            name: 'valor',
            allowBlank: false,
            minValue: 1
        });

        this.form = Ext.create('Ext.form.Panel', {
            layout: 'column',
            border: false,
            fieldDefaults: {
                labelAlign: 'top'
            },
            bodyStyle: 'background:#DFE9F6; padding:5px',
            border: false,
            defaults: {
                bodyStyle: 'background:#DFE9F6;',
                border: false
            },
            trackResetOnLoad: true,
            items: [
                {
                    columnWidth: 1,
                    layout: 'form',
                    selector: 'col1',
                    items: [this.hdType, this.cmbType]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    selector: 'col2',
                    items: [this.hdRol, this.cmbRol]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    selector: 'col3',
                    hidden: true,
                    disabled: true,
                    items: [this.nfvalue]
                }
            ]
        });
        this.items = [this.form];
        this.callParent();
    }
});
