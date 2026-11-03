Ext.define('ConfContratacion.view.CompartWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.compartwindow',
    layout: 'border',
    height: 500,
    resizable: false,
    initComponent: function () {
        this.getLang();

        this.concept = 'compartimentaci&oacute;n';

        this.form = this.createForm();

        this.gpFiltros = Ext.create('ConfContratacion.view.GridFiltros', {
            region: 'center',
            modelName: this.modelName
        });

        this.items = [this.form, this.gpFiltros];

        this.callParent();
    },

    createForm: function () {
        this.hdIdCompartimentacion = Ext.create('Ext.form.field.Hidden', {
            name: 'idcompartimentacion'
        });

        this.stRol = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [
                {name: 'idrol'},
                {name: 'denominacion'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getRoles'}, ModuleMgr.get('ConfContratacion')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                }
            }
        });

        this.hdRol = Ext.create('Ext.form.field.Hidden', {
            name: 'idrol'
        });

        this.cmbRol = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Rol',
            store: this.stRol,
            queryMode: 'local',
            typeAhead: true,
            flex: 1,
            displayField: 'denominacion',
            valueField: 'denominacion',
            allowBlank: false,
            name: 'nombrerol',
            localId: 'idrol',
            listConfig: {
                loadingText: 'Cargando...',
                emptyText: '<div class="x-grid-empty">' + 'No existen datos que mostrar.' + '</div>'
            }
        });

        return Ext.create('Ext.form.Panel', {
            layout: 'column',
            region: 'north',
            border: false,
            fieldDefaults: {
                labelAlign: 'top'
            },
            bodyStyle: 'background:#DFE9F6; padding:5px',
            defaults: {
                bodyStyle: 'background:#DFE9F6;',
                border: false
            },
            trackResetOnLoad: true,
            items: [this.hdIdCompartimentacion,
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.hdRol, this.cmbRol]
                }
            ]
        });
    }
});
