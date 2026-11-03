Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.EditReporte = Ext.extend(Ext.Window, {
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

        Maestro.ConfigurarReporte.view.EditReporte.superclass.initComponent.call(this);
    },
    initButtons: function(){
        var me = this,
            idiom = Maestro.ConfigurarReporte.idiom;

        me.btnCancel = new Ext.Button({
            iconCls : 'cancelar', 
            text : idiom.lbBtnCancel,
            tooltip : idiom.lbTtpBtnCancel,
        });

        me.btnAccept = new Ext.Button({
            iconCls : 'aceptar', 
            text : idiom.lbBtnAccept,
            tooltip : idiom.lbTtpBtnAccept,
        });

        me.buttons = [me.btnCancel, me.btnAccept];
    },
    initForm: function(){
        var me = this,
            idiom = Maestro.ConfigurarReporte.idiom;
       
        me.tfDenominacion = new Ext.form.TextField({
            fieldLabel: idiom.lbColDenominacion,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'denominacion',
            anchor: '90%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            regexText: idiom.validationOnlyAlphaSpacer,
            maxLength: 150,
            maxLengthText: idiom.validationMaxLength_150,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });

        me.checkbAgrupador = new Ext.form.Checkbox({
            name: 'agrupador',
            inputValue: 1,
            fieldLabel: '',
            labelSeparator: '',
            boxLabel: idiom.lbFieldAgrupador
        });

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

         me.checkbGeneral = new Ext.form.Checkbox({
            name: 'general',
            inputValue: 1,
            fieldLabel: '',
            labelSeparator: '',
            boxLabel: idiom.lbFieldGeneral
        });

        var store = new Ext.data.SimpleStore({
            fields: ['tipocontenido', 'denominacion'],
            data : [
                [1, idiom.reportContentTypeServerFile],
                [2, idiom.reportContentTypeJasperFile],
                [3, idiom.reportContentTypeComponent],
            ]
        });

        me.cbContentType = new Ext.form.ComboBox({
            fieldLabel: idiom.lbFieldContentType,
            labelSeparator: ':'+ me.getTagRequiredField(),
            anchor: '100%',
            store: store,
            valueField: 'tipocontenido', 
            displayField: 'denominacion', 
            hiddenName: 'tipocontenido',
            triggerAction: 'all',
            forceSelection: true,
            mode: 'local', 
            emptyText: idiom.emptyFieldText,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });

        me.tfRecurso = new Ext.form.TextField({
            fieldLabel: idiom.lbColRecurso,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'recurso',
            anchor: '100%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\.]+(\d*)?)+$/,
            regexText: idiom.validationRecurso,
            maxLength: 100,
            maxLengthText: idiom.validationMaxLength_100,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });

        me.tfUrl = new Ext.form.TextField({
            fieldLabel: idiom.lbFieldUrl,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'url',
            anchor: '100%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\/\.]+(\d*)?)+$/,
            regexText: idiom.validationUrl,
            maxLength: 150,
            maxLengthText: idiom.validationMaxLength_150,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });

        me.tfComponentName = new Ext.form.TextField({
            fieldLabel: idiom.lbFieldComponentName,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'nombrecomponente',
            anchor: '100%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\.]+(\d*)?)+$/,
            regexText: idiom.validationComponentName,
            maxLength: 100,
            maxLengthText: idiom.validationMaxLength_100,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });
        
        me.checkbFormatoExcel = new Ext.form.Checkbox({
            name: 'otroformato',
            inputValue: 1,
            fieldLabel: '',
            labelSeparator: '',
            hidden: true,
            boxLabel: idiom.lbFieldFormatoExcel
        });

        me.form = new Ext.FormPanel({
            frame : true,
            labelAlign: 'top',
            bodyStyle : {padding: '10px 10px 10px 10px'},
            width :350,
            autoHeight : true,
            items: [
                {xtype: 'hidden', name: 'idreporte', value: 0},
                {
                    layout:'column',
                    border:false,
                    items:[
                            {columnWidth: 0.75, border:false, layout: 'form', items: [me.tfDenominacion]},
                            {columnWidth: 0.25, border:false, layout: 'form', items: [me.checkbAgrupador]},
                        ]
                },
                {
                    layout:'column',
                    border:false,
                    items:[
                            {columnWidth: 0.75, border:false, layout: 'form', items: [me.tfIdentificador]},
                            {columnWidth: 0.25, border:false, layout: 'form', items: [me.checkbGeneral]},
                        ]
                },
                 me.cbContentType,
                {
                    layout:'column',
                    border:false,
                    items:[
                        {columnWidth: 1, border:false, layout: 'form', items: [me.tfRecurso]},
                        {columnWidth: 1, border:false, layout: 'form', items: [me.tfUrl]},
                        {columnWidth: 1, border:false, layout: 'form', items: [me.tfComponentName]},
                        {columnWidth: 1, border:false, layout: 'form', items: [me.checkbFormatoExcel]}
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