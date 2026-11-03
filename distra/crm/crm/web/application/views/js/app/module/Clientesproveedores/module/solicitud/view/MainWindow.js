Ext.define('GestionOportunidad.view.MainWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.scp_mainwindow',

    autoScroll: false,
    maximizable: true,
    initComponent: function () {
        this.createInitialConfig();
        this.refhelp = '';
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        me.idoportunidad = Ext.create('Ext.form.field.Hidden', {
            name: 'idoportunidad'
        });

        me.nombre = Ext.create('Ext.form.field.Text', {
            fieldLabel: this.etiquetas.lbNombre,
            name: 'denominacion',
            anchor: '98%',
            allowBlank: false,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\,\-\.\(\)\+\{\}\[\]]+$/,
            enforceMaxLength: true,
            maxLength: 50,
            first: true
        });

        me.prioridad = new Ext.form.ComboBox({
            store: Ext.create('GestionOportunidad.store.Prioridad'),
            fieldLabel: me.etiquetas.lbPrioridad,
            anchor: '98%',
            name: 'idprioridad',
            forceSelection: true,
            triggerAction: 'all',
            editable: true,
            typeAhead: true,
            valueField: 'idprioridad',
            displayField: 'denominacion',
            mode: 'local',
            allowBlank: false

        });

        me.tipo = new Ext.form.ComboBox({
            store: Ext.create('GestionOportunidad.store.Tipo'),
            fieldLabel: me.etiquetas.lbTipo,
            anchor: '98%',
            name: 'idtipo',
            forceSelection: true,
            triggerAction: 'all',
            editable: true,
            typeAhead: true,
            valueField: 'idtipo',
            displayField: 'denominacion',
            mode: 'local',
            allowBlank: false
        });

        me.campannaasociada = new Ext.form.ComboBox({
            store: Ext.create('GestionOportunidad.store.CampannaAsociada'),
            fieldLabel: me.etiquetas.lbCampannaAsociada,
            anchor: '98%',
            name: 'idcampanna',
            forceSelection: true,
            triggerAction: 'all',
            editable: true,
            typeAhead: true,
            valueField: 'idcampanna',
            displayField: 'denominacion',
            queryMode: 'remote',
            queryParam: 'denominacion',
            queryDelay: 400,
            minChars: 1,
            pageSize: 10,
            allowBlank: false
        });

        me.creadopor = new Ext.form.ComboBox({
            store: Ext.create('GestionOportunidad.store.CreadoPor'),
            fieldLabel: me.etiquetas.lbCreadopor,
            anchor: '98%',
            name: 'idusuario',
            //forceSelection: true,
            triggerAction: 'all',
            editable: true,
            typeAhead: true,
            valueField: 'idusuario',
            displayField: 'nombreusuario',
            queryMode: 'remote',
            queryParam: 'nombre',
            queryDelay: 400,
            minChars: 1,
            pageSize: 10,
            allowBlank: false
        });

        me.canal = new Ext.form.ComboBox({
            store: Ext.create('GestionOportunidad.store.Canal'),
            fieldLabel: me.etiquetas.lbCanal,
            anchor: '98%',
            name: 'idcanal',
            forceSelection: true,
            triggerAction: 'all',
            editable: true,
            typeAhead: true,
            valueField: 'idcanal',
            displayField: 'denominacion',
            mode: 'local',
            allowBlank: false
        });

        me.grid = Ext.create('GestionOportunidad.view.ClienteGrid', {
            //anchor: '99%'
        });
        me.descripcion = Ext.create('Ext.form.field.TextArea', {
            name: 'descripcion',
            maxLength: 255

        });

        me.tabpanel = Ext.widget('tabpanel', {
            activeTab: 0,
            anchor: '99%',
            border: false,
            items: [{
                title: me.etiquetas.lbListadoCliente,
                layout: 'fit',
                items: me.grid
            }, {
                title: me.etiquetas.lbDescripcion,
                layout: 'fit',
                items: [me.descripcion]
            }
            ]
        });


        me.customFormaa = Ext.create('Ext.ux.CustomForm', {
            bodyStyle: 'background:#DFE9F6;',//padding: 5px 20px 5px 5px;
            margin: '5 5 0 5',
            layout: 'border',
            items: [{
                region: 'north',
                layout: 'column',
                height: 190,
                defaults: {
                    columnWidth: .5,
                    layout: 'anchor',
                    bodyStyle: 'background:#DFE9F6;',
                    border: false
                },
                items: [{
                    items: me.idoportunidad
                }, {
                    items: me.nombre
                }, {
                    items: me.tipo
                }, {
                    items: me.campannaasociada
                }, {
                    items: me.canal
                }, {
                    columnWidth: .5,
                    items: {
                        xtype: 'numberfield',
                        fieldLabel: me.etiquetas.lbIngreso,
                        name: 'ingresoestimado',
                        noactions: true,
                        anchor: '98%',
                        allowDecimals: true,
                        decimalPrecision: 2,
                        decimalSeparator: '.',
                        regex: /^[0-9\.]+$/,
                        enforceMaxLength: true,
                        maxLength: 10

                    }
                }, {
                    items: me.prioridad
                }, {
                    items: me.creadopor
                }, {
                    items: {
                        xtype: 'datefield',
                        anchor: '98%',
                        fieldLabel: 'Fecha',
                        name: 'fecha',
                        value: new Date(),
                        allowBlank: false

                    }
                }]
            }, {
                region: 'center',
                layout: 'fit',
                items: me.tabpanel
            }
            ]
        });


        me.items = me.customFormaa;
    }
});

