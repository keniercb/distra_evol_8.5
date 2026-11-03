Ext.define('ConfigFormatoNumContrato.view.FpFormatoNumContrato', {
    extend: 'Ext.form.Panel',
    alias: 'widget.fpformatonumcontrato',
    bodyPadding: 5,
    bodyBorder: false,
    border: false,
    frame: true,
    fieldDefaults: {
        labelAlign: 'top',
    },
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        var data = [
            {
                id: "1",
                name: this.etiquetas.lbAmbos
            },
            {
                id: "2",
                name: this.etiquetas.lbCliente
            },
            {
                id: "3",
                name: this.etiquetas.lbProveedor
            },
            {
                id: "4",
                name: this.etiquetas.lbCompra
            }
        ];

        Ext.define('TipoContrato', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id'},
                {name: 'name'}
            ]
        });

        this.hfIdentidad = Ext.create('Ext.form.field.Hidden', {
            name: 'identidadformatonumcontrato',
            value: 0
        });

        this.cmbDestino = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: this.etiquetas.lbContratoDestino,
            anchor: '100%',
            validateOnBlur: true,
            forceSelection: true,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            value: "1",
            store: Ext.create('Ext.data.Store', {
                model: 'TipoContrato',
                data: data
            }),
            allowBlank: false,
            name: 'contratodestino'
        });

        this.cmbFormato = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: this.etiquetas.lbFormato,
            anchor: '100%',
            validateOnBlur: true,
            forceSelection: true,
            multiSelect: false,
            editable: false,
            queryMode: 'local',
            typeAhead: true,
            displayField: 'denominacion',
            valueField: 'idformatonumcontrato',
            listLoadingText: this.etiquetas.msgLoading,
            listEmptyText: this.etiquetas.msgNoDataLoaded,
            store: Ext.create('ConfigFormatoNumContrato.store.FormatoNumContrato'),
            allowBlank: false,
            name: 'idformatonumcontrato',
        });

        this.ejemplo=Ext.create('Ext.form.field.Text',{
            anchor: '100%',
            fieldLabel: 'Ejemplo',
            readOnly: true,
            name: 'preview',
            // hidden: true
        })

        me.items = [this.hfIdentidad, this.cmbDestino, this.cmbFormato, this.ejemplo];


        me.callParent();
    }
});
