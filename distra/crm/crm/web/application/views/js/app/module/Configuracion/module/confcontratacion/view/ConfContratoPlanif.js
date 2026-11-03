Ext.define('ConfContratacion.view.ConfContratoPlanif', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confcontratoplanif',
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
            name:'idcontratoplanificacion'
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
            fieldLabel: this.etiquetas.lbPlanificacion,
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
                layout: 'form',
                height:60,
                items: [this.hdidcomitegestor,this.active/*,{xtype:'textfield', allowBlank:false}*/]
            },
            // {
            //     region:'center',
            //     layout: 'anchor',
            //     disabled:true,
            //     name:'fpcontractspace',
            //     items: [this.hdspace,this.sfspace]
            // }
            ];

        this.btnSave = Ext.create('Ext.Button',{
            text: this.etiquetas.lbSave,
            tooltip: this.etiquetas.qtipApply,
            iconCls: 'guardar',
            disabled: true,
            action: 'save'
        });

        this.btnCancel = Ext.create('Ext.Button',{
            text: this.etiquetas.lbBtnCancel,
            tooltip: this.etiquetas.qtipCancel,
            iconCls: 'cancelar',
            action: 'cancel'
        });

        this.buttons = [this.btnCancel,this.btnSave];

        this.callParent();
    }
});
