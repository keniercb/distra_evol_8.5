Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.EditModule = Ext.extend(Ext.Window, {
	modal: true,
    closeAction: 'hide',
    constrain: true,
    autoHeight: true,
    resizable:false,
    layout: 'fit',
    border : false,
    initComponent: function(){
        var me = this,
            viewsRequired = (me.required)?me.required.views : null;

        me.initButtons();

        me.initForm();

        Maestro.ConfigurarReporte.view.EditModule.superclass.initComponent.call(this);
    },
    initButtons: function(){
        var me = this,
            idiom = Maestro.ConfigurarReporte.idiom;

        me.btnCancel = new Ext.Button({
            iconCls : 'cancelar', 
            text : idiom.lbBtnCancel,
            tooltip : idiom.lbTtpBtnCancel,
        });

        me.btnApply = new Ext.Button({
            iconCls : 'aplicar', 
            text : idiom.lbBtnApply,
            tooltip : idiom.lbTtpBtnApply,
        });

        me.btnAccept = new Ext.Button({
            iconCls : 'aceptar', 
            text : idiom.lbBtnAccept,
            tooltip : idiom.lbTtpBtnAccept,
        });

        me.buttons = [me.btnCancel, me.btnApply, me.btnAccept];
    },
    initForm: function(){
        var me = this,
            idiom = Maestro.ConfigurarReporte.idiom;
       
        me.tfIdentificador = new Ext.form.TextField({
            fieldLabel: idiom.lbColIdentificador,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'identificador',
            anchor: '90%',
            regex: /^[0-9a-zA-Z]+$/,
            regexText: idiom.validationOnlyAlpha,
            maxLength: 50,
            maxLengthText: idiom.validationMaxLength_50,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });

        me.tfDenominacion = new Ext.form.TextField({
            fieldLabel: idiom.lbColDenominacion,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'denominacion',
            anchor: '100%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            regexText: idiom.validationOnlyAlphaSpacer,
            maxLength: 150,
            maxLengthText: idiom.validationMaxLength_150,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });
 
        me.form = new Ext.FormPanel({
            frame : true,
            labelAlign: 'top',
            bodyStyle : {padding: '10px 10px 10px 10px'},
            width :300,
            autoHeight : true,
            items: [
                {xtype: 'hidden', name: 'idmodulo', value: 0},
                {
                    layout:'column',
                    border:false,
                    items:[
                            {columnWidth: 0.4, border:false, layout: 'form', items: [me.tfIdentificador]},
                            {columnWidth: 0.6, border:false, layout: 'form', items: [me.tfDenominacion]}
                        ]
                }
            ]
        });

        me.items = [me.form];
    },
    getTagRequiredField : function(){
        return '<span style="color:red;font-weight:bold">*</span>';
    },
});