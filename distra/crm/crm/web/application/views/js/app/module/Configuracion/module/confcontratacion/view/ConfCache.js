Ext.define('ConfContratacion.view.ConfCache', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confcache',
    frame: true,
    border: false,
    layout: 'border',
    trackResetOnLoad: true,
    defaults: {
        style: 'margin:5px 0px;',
        bodyStyle: 'background:#DFE9F6;padding:5px;',
        border: false
    },

    initComponent: function () {
        this.getLang();

        this.hdidcomitegestor = Ext.create('Ext.form.field.Hidden',{
            name:'idcontratocontabilidad'
        });

        this.active = {
            xtype: 'toggleslidefield',
            // allowBlank:false,
            labelSeparator: '',
            name: 'activo',
            // allowBlank: true,
            labelWidth: 180,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'top',
            fieldLabel: this.etiquetas.lbContabilidad,
        };

        // this.hdspace = Ext.create('Ext.form.field.Hidden',{
        //     name:'idespaciotrabajo'
        // });
        //
        // this.sfspace = Ext.create('Ext.ux.SelectField', {
        //     fieldLabel: 'Espacio de trabajo',
        //     name: 'espaciotrabajo',
        //     labelAlign: 'top',
        //     labelStyle: 'margin:5px',
        //     anchor:'50%',
        //     localId:'idespaciotrabajo',
        //     allowBlank:false
        // });

        this.items = [
            {
                region:'north',
                layout: 'hbox',
                height:60,
                items: [
                    {
                        xtype: 'textfield',
                        readOnly: true,
                        fieldLabel: 'Espacio utilizado',
                        labelAlign: 'top',
                        width: 120,
                        name: 'displaysize',
                        fieldStyle: 'text-align: right;',

                    },
                    {
                        xtype: 'button',
                        tooltip: 'Actualizar',
                        iconCls: 'icondistra-actualizar icon-small',
                        action: 'actualizar',
                        margin: '18 0 0 0'
                    },
                    {
                        xtype: 'button',
                        text: 'Limpiar',
                        tooltip: 'Limpiar archivos temporales',
                        iconCls: 'icondistra-limpiar icon-small',
                        action: 'limpiarcache',
                        margin: '18 0 0 5'
                    }
                ]
            },
            // {
            //     region:'center',
            //     layout: 'anchor',
            //     disabled:true,
            //     name:'fpcontractspace',
            //     items: [this.hdspace,this.sfspace]
            // }
        ];

        // this.btnSave = Ext.create('Ext.Button',{
        //     text: this.etiquetas.lbSave,
        //     tooltip: this.etiquetas.qtipApply,
        //     iconCls: 'guardar',
        //     disabled: true,
        //     action: 'save'
        // });
        //
        // this.btnCancel = Ext.create('Ext.Button',{
        //     text: this.etiquetas.lbBtnCancel,
        //     tooltip: this.etiquetas.qtipCancel,
        //     iconCls: 'cancelar',
        //     action: 'cancel'
        // });
        //
        // this.buttons = [this.btnCancel,this.btnSave];

        this.callParent();
    }
});
