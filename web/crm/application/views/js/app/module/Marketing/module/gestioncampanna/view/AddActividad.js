Ext.define('GestionCampanna.view.AddActividad', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.addactividad',

    autoScroll: false,
    maximizable: true,
    initComponent: function () {
        this.createInitialConfig();

        this.refhelp = this.action + '_dat_actividad';
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        me.defaultFocus = me.nombre;

        me.idactividad = Ext.create('Ext.form.field.Hidden', {
            name: 'idactividad'
        });

        me.idcampanna = Ext.create('Ext.form.field.Hidden', {
            name: 'idcampanna',
            value: me.campanna

        });
        me.denomcanal = Ext.create('Ext.form.field.Hidden', {
            name: 'denomcanal'
        });
        me.denomprioridad = Ext.create('Ext.form.field.Hidden', {
            name: 'denomprioridad'
        });

        me.nombre = Ext.create('Ext.form.field.Text', {
            fieldLabel: this.etiquetas.lbNombre,
            name: 'denominacion',
            anchor: '98%',
            allowBlank: false,
            blankText: me.etiquetas.ValidacionCampoObligatorio,
            enforceMaxLength: true,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\,\-\.\(\)\+\{\}\[\]]+$/,
            maxLength: 50,
            first: true
        });
        me.presupuesto = Ext.create('Ext.form.field.Number', {
            fieldLabel: this.etiquetas.clCostoVariable,
            name: 'presupuesto',
            anchor: '98%',
            allowBlank: false,
            allowDecimals: true,
            decimalPrecision: 2,
            regex: /^[0-9\.]+$/,
            maxLength: 10,
            decimalSeparator: '.',
            enforceMaxLength: true,
            maxValue: me.costodisponible
        });

        me.costodisponible = Ext.create('Ext.form.field.Text', {
            fieldLabel: this.etiquetas.lbCostoDisponible,
            name: 'costodisponible',
            anchor: '98%',
            readOnly: true,
            value: me.costodisponible
        });

        me.canal = new Ext.form.ComboBox({
            store: Ext.create('GestionCampanna.store.Canal'),
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

        me.fechainicio = Ext.create('Ext.form.field.Date', {
            columnWidth: .247,
            anchor: '98%',
            fieldLabel: me.etiquetas.clFechaInicio,
            name: 'fechainicio',
            //endDateField: 'fechafin',
            format: 'd/m/Y',
            allowBlank: false,
            value: me.finicio,
            minValue: me.finicio,
            maxValue: me.ffin
        });

        me.fechafin = Ext.create('Ext.form.field.Date', {
            columnWidth: .247,
            anchor: '98%',
            fieldLabel: me.etiquetas.clFechaFin,
            name: 'fechafin',
            //startDateField: 'fechainicio',
            format: 'd/m/Y',
            allowBlank: false,
            minValue: me.finicio,
            maxValue: me.ffin
        });

        me.clientegrid = Ext.create('GestionCampanna.view.ClienteGrid');

        me.descripcion = Ext.create('Ext.form.field.TextArea', {
            name: 'descripcion',
            maxLength: 255

        });

        me.tabpanel = Ext.widget('tabpanel', {
            activeTab: 0,
            anchor: '99%',
            items: [{
                title: me.etiquetas.lbListadoCliente,
                layout: 'fit',
                items: me.clientegrid
            }, {
                border: false,
                title: me.etiquetas.tbDescripcion,
                layout: 'fit',
                items: [me.descripcion]
            }]
        });

        me.customForm = Ext.create('Ext.ux.CustomForm', {
            bodyStyle: 'background:#DFE9F6;',//padding: 5px 20px 5px 5px;
            margin: '5 5 0 5',
            layout: 'border',
            items: [{
                region: 'north',
                layout: 'column',
                height: 150,
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
                    columnWidth: .247,
                    items: me.presupuesto
                }, {
                    columnWidth: .247,
                    items: me.costodisponible
                }, {
                    items: [me.canal, me.denomcanal]
                }, {
                    items: [me.prioridad, me.denomprioridad]
                }, {
                    items: me.fechainicio
                }, {
                    items: me.fechafin
                }]
            }, {
                region: 'center',
                layout: 'fit',
                items: me.tabpanel
            }]
        });

        me.items = me.customForm;


    }
});