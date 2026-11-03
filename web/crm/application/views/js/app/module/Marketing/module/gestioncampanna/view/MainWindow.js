Ext.define('GestionCampanna.view.MainWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.gc_mainwindow',

    autoScroll: true,
    maximizable: true,
    initComponent: function () {
        this.createInitialConfig();

        this.layout = 'border';
        this.refhelp = this.action + '_dat_campanna';
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        me.idcampanna = Ext.create('Ext.form.field.Hidden', {
            name: 'idcampanna'
        });

        me.nombre = Ext.create('Ext.form.field.Text', {
            fieldLabel: this.etiquetas.lbNombre,
            name: 'denominacion',
            anchor: '98%',
            allowBlank: false,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\,\-\.\(\)\+\{\}\[\]]+$/,
            maxLength: 50,
            enforceMaxLength: true,
            first: true
        });

        me.codigo = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbCodigo,
            name: 'codigo',
            flex: 1,
            anchor: '98%',
            allowBlank: false,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\,\-\.\(\)\+\{\}\[\]]+$/,
            maxLength: 50,
            enforceMaxLength: true
        });

        me.moneda = new Ext.form.ComboBox({
            store: Ext.create('GestionCampanna.store.Moneda'),
            fieldLabel: me.etiquetas.lbMoneda,
            anchor: '98%',
            name: 'idmoneda',
            triggerAction: 'all',
            editable: true,
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            queryMode: 'remote',
            queryParam: 'codigoiso',
            queryDelay: 400,
            minChars: 1,
            pageSize: 10,
            allowBlank: false
        });

        me.creadopor = new Ext.form.ComboBox({
            store: Ext.create('GestionCampanna.store.CreadoPor'),
            fieldLabel: me.etiquetas.lbCreadopor,
            anchor: '98%',
            name: 'idusuario',
            triggerAction: 'all',
            editable: true,
            valueField: 'idusuario',
            displayField: 'nombreusuario',
            queryMode: 'remote',
            queryParam: 'nombre',
            queryDelay: 400,
            minChars: 1,
            pageSize: 10,
            allowBlank: false
        });

        me.costofijo = Ext.create('Ext.form.field.Number', {
            fieldLabel: me.etiquetas.lbCostoFijo,
            name: 'costofijo',
            anchor: '98%',
            allowBlank: false,
            allowDecimals: true,
            regex: /^[0-9\.]+$/,
            decimalPrecision: 2,
            decimalSeparator: '.',
            enforceMaxLength: true,
            maxLength: 10
        });

        me.costodisponible = Ext.create('Ext.form.field.Text', {
            fieldLabel: this.etiquetas.lbCostoDisponible,
            name: 'costodisponible',
            anchor: '98%',
            readOnly: true
        });

        me.respuestaesperada = Ext.create('Ext.form.field.Number', {
            fieldLabel: me.etiquetas.lbRespuestaEsperada,
            name: 'cantrespuestas',
            anchor: '98%',
            maskRe: /^[0-9]+$/,
            enforceMaxLength: true,
            maxLength: 10
        });

        me.fechainicio = Ext.create('Ext.form.field.Date', {
            columnWidth: .247,
            anchor: '98%',
            fieldLabel: me.etiquetas.clFechaInicio,
            name: 'fechainicio',
            endDateField: 'fechafin',
            format: 'd/m/Y',
            allowBlank: false
        });

        me.fechafin = Ext.create('Ext.form.field.Date', {
            columnWidth: .247,
            anchor: '98%',
            fieldLabel: me.etiquetas.clFechaFin,
            name: 'fechafin',
            startDateField: 'fechainicio',
            format: 'd/m/Y',
            allowBlank: false
        });

        me.prioridad = new Ext.form.ComboBox({
            store: Ext.create('GestionCampanna.store.Prioridad'),
            fieldLabel: me.etiquetas.lbprioridad,
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

        me.gridproducto = Ext.create('GestionCampanna.view.ProductGrid');

        me.gridactividad = Ext.create('GestionCampanna.view.ActividadGrid');

        me.descripcion = Ext.create('Ext.form.field.TextArea', {
            name: 'descripcion',
            maxLength: 255

        });

        me.tabpanel = Ext.widget('tabpanel', {
            activeTab: 0,
            anchor: '99%',
            border: false,
            items: [{
                title: me.etiquetas.tbProductoServicio,
                layout: 'fit',
                border: false,
                items: me.gridproducto
            }, {
                border: false,
                title: me.etiquetas.tbActividad,
                layout: 'fit',
                items: me.gridactividad

            }, {
                border: false,
                title: me.etiquetas.tbDescripcion,
                layout: 'fit',
                items: [me.descripcion]

            }]
        });

        me.customFor = Ext.create('Ext.ux.CustomForm', {
            bodyStyle: 'background:#DFE9F6;',//padding: 5px 20px 5px 5px;
            margin: '5 5 0 5',
            layout: 'column',
            region: 'north',
            defaults: {
                columnWidth: .5,
                layout: 'anchor',
                bodyStyle: 'background:#DFE9F6;',
                border: false
            },
            items: [{
                items: me.idcampanna
            }, {
                items: me.nombre
            }, {
                items: me.codigo
            }, {
                items: me.moneda
            }, {
                columnWidth: .247,
                items: me.costofijo
            }, {
                columnWidth: .247,
                items: me.costodisponible
            }, {
                items: me.prioridad
            }, {
                items: me.creadopor
            }, {
                items: me.respuestaesperada
            }, {
                columnWidth: .247,
                items: me.fechainicio
            }, {
                columnWidth: .247,
                items: me.fechafin
            }]
        });

        me.items = [me.customFor,
            {
                region: 'center',
                layout: 'fit',
                border: false,
                items: me.tabpanel
            }
        ];
    }
})
;