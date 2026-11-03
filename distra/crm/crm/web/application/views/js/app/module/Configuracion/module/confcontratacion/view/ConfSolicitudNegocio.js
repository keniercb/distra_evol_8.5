Ext.define('ConfContratacion.view.ConfSolicitudNegocio', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confsolicitudnegocio',
    frame: true,
    border: false,
    layout: 'border',
    trackResetOnLoad: true,
    defaults: {
        style: 'margin:5px 5px;',
        bodyStyle: 'background:#DFE9F6;padding:5px;',
        border: false
    },
    fieldDefaults: {labelAlign: 'top'},
    initComponent: function () {
        this.getLang();
        this.hdidcomitegestor = Ext.create('Ext.form.field.Hidden',{
            name:'idcontratogestordocumental'
        });

        this.active = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'activo',
            allowBlank: true,
            labelWidth: 180,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'top',
            fieldLabel: this.etiquetas.lbGestorDocumental
        };

        this.cbEstadoSolicitudInsert = Ext.create('Ext.form.field.ComboBox',{
            fieldLabel: this.etiquetas.lbEstadoListaSD,
            validateOnBlur: true,
            enableKeyEvents: true,
            multiSelect: false,
            queryMode: 'local',
            name: 'idestado',
            listEmptyText: 'No existen datos que mostrar.',
            displayField: 'denominacion',
            valueField: 'idestado',
            width: 200,
            store: Ext.create('ConfContratacion.store.Estado')
        });

       this.hdspace = Ext.create('Ext.form.field.Hidden',{
            name:'idespaciotrabajo'
        });

        this.sfspace = Ext.create('Ext.ux.SelectField', {
            fieldLabel: 'Espacio de trabajo',
            name: 'espaciotrabajo',
            labelAlign: 'top',
            labelStyle: 'margin:5px',
            anchor: '50%',
            localId: 'idespaciotrabajo',
            allowBlank: false
        });

        this.repositorioclientes = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'repositorioclientes',
            allowBlank: true,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'top',
            fieldLabel: "Repositorio de clientes/proveedores"
        };


        this.items = [
            {
                region:'north',
                layout: 'vbox',
                height:170,
                items: [
                    this.cbEstadoSolicitudInsert,
                    this.active,
                    this.hdidcomitegestor,
                    this.repositorioclientes
                ]
            }, {
                region:'center',
                layout: 'anchor',
                disabled:true,
                name:'fpcontractspaces',
                items: [this.hdspace,this.sfspace]
            }];

        this.btnSave = Ext.create('Ext.Button', {
            text: this.etiquetas.lbSave,
            tooltip: this.etiquetas.qtipApply,
            iconCls: 'guardar',
            disabled: true,
            action: 'save'
        });

        this.btnCancel = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnCancel,
            tooltip: this.etiquetas.qtipCancel,
            iconCls: 'cancelar',
            action: 'cancel'
        });

        this.buttons = [this.btnCancel, this.btnSave];

        this.callParent();
    }
});
