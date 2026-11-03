Ext.ns('Maestro.ConfigurarReporte.view');

Ext.override(Ext.form.TextArea, {
    initComponent : Ext.form.TextArea.prototype.initComponent.createSequence(function () {
        this.maskRe = null;
        this.vtype = null;
    })
});

Maestro.ConfigurarReporte.view.EditFilter = Ext.extend(Ext.Window, {
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

        Maestro.ConfigurarReporte.view.EditFilter.superclass.initComponent.call(this);
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

        me.initBasicFields();
        me.initFilterNumericFields();
        me.initFilterTextoFields();
        me.initFilterNomencladorFields();

        me.form = new Ext.FormPanel({
            frame : true,
            labelAlign: 'top',
            bodyStyle : {padding: '10px 10px 10px 10px'},
            width :320,
            autoHeight : true,
            items: [
                {xtype: 'hidden', name: 'idfiltro', value: 0},
                {
                    layout:'column',
                    border:false,
                    items:[
                            {columnWidth: 0.8, border:false, layout: 'form', items: [me.tfDenominacion]},
                            {columnWidth: 0.2, border:false, layout: 'form', items: [me.nfOrden]}
                        ]
                },{
                    layout:'column',
                    border:false,
                    items:[
                            {columnWidth: 0.65, border:false, layout: 'form', items: [me.tfParamName]},
                            {columnWidth: 0.35, border:false, layout: 'form', items: [me.nfAnchoColumna]}
                        ]
                },{
                    layout:'column',
                    border:false,
                    items:[
                            {columnWidth: 0.5, border:false, layout: 'form', items: [me.cbJavaTypes]},
                        ]
                },{
                    layout:'column',
                    border:false,
                    items:[
                        {columnWidth: 0.5, border:false, layout: 'form', items: [me.nfMinLength]},
                        {columnWidth: 0.5, border:false, layout: 'form', items: [me.nfMaxLength]}
                    ]
                },{
                    layout:'column',
                    border:false,
                    items:[
                        {columnWidth: 0.5, border:false, layout: 'form', items: [me.nfMinValue]},
                        {columnWidth: 0.5, border:false, layout: 'form', items: [me.nfMaxValue]}
                    ]
                },{
                    layout:'column',
                    border:false,
                    items:[
                        {columnWidth: 0.5, border:false, layout: 'form', items: [me.tfDisplayField]},
                        {columnWidth: 0.5, border:false, layout: 'form', items: [me.tfValueField]}
                    ]
                },{
                    style: 'margin-bottom: 0px;',
                    xtype: 'fieldset',
                    title: Maestro.ConfigurarReporte.idiom.lbFsFuenteDatos,
                    autoHeight: true,
                    items: [me.rbSql, me.taSql, me.rbService, me.taService,]
                }
            ]
        });
        
        me.items = [me.form];
    },
    initBasicFields: function(){
        var me = this,
            idiom = Maestro.ConfigurarReporte.idiom;

        me.tfDenominacion = new Ext.form.TextField({
            fieldLabel: idiom.lbColDenominacion,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'denominacion',
            anchor: '90%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            regexText: idiom.validationOnlyAlphaSpacer,
            maxLength: 100,
            maxLengthText: idiom.validationMaxLength_100,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });
        
        me.tfParamName = new Ext.form.TextField({
            fieldLabel: idiom.lbColParamName,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'nombreparametro',
            anchor: '90%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d_]+(\d*)?)+$/,
            regexText: idiom.validationOnlyAlphaUndescore,
            maxLength: 50,
            maxLengthText: idiom.validationMaxLength_50,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });

        me.nfOrden = new Ext.form.NumberField({
            fieldLabel: idiom.lbColOrden,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'orden',
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false, 
            maxValue: 99,
            maxText: idiom.validationMaxMinValueOrden,
            minValue: 1,
            minText: idiom.validationMaxMinValueOrden,
            invalidText: idiom.validationMaxMinValueOrden,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });

        me.nfAnchoColumna = new Ext.form.NumberField({
            fieldLabel: idiom.lbFieldAnchoColumna,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'anchocolumna',
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false, 
            maxValue: 999,
            maxText: idiom.validationMaxMinValue_999,
            minValue: 1,
            minText: idiom.validationMaxMinValue_999,
            invalidText: idiom.validationMaxMinValue_999,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });

        var store = new Ext.data.SimpleStore({
            fields: ['javatype'],
            data : [
                ['Number'],
                ['Double'],
                ['Float'],
                ['Integer'],
                ['Long'],
                ['Short'],
                ['Bigdecimal'],
            ]
        });

        me.cbJavaTypes = new Ext.form.ComboBox({
            fieldLabel: idiom.lbFieldJavaStype,
            labelSeparator: ':'+ me.getTagRequiredField(),
            anchor: '100%',
            store: store,
            valueField: 'javatype', 
            displayField: 'javatype', 
            hiddenName: 'javatype',
            triggerAction: 'all',
            forceSelection: true,
            mode: 'local', 
            emptyText: Maestro.Reporte.idiom.emptyFieldText,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });
    },
    initFilterNumericFields: function(){
        var me = this,
            idiom = Maestro.ConfigurarReporte.idiom;

        me.nfMinValue = new Ext.form.NumberField({
            fieldLabel: idiom.lbFieldMinValue,
            name: 'valorminimo',
            anchor: '90%',
            allowDecimals: false,
            allowNegative: false, 
            maxValue: 999999,
            maxText: idiom.validationMaxMinValue_999999,
            minValue: 1,
            minText: idiom.validationMaxMinValue_999999,
            invalidText: idiom.validationMaxMinValue_999999,
        });

         me.nfMaxValue = new Ext.form.NumberField({
            fieldLabel: idiom.lbFieldMaxValue,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'valormaximo',
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false, 
            maxValue: 999999,
            maxText: idiom.validationMaxMinValue_999999,
            minValue: 1,
            minText: idiom.validationMaxMinValue_999999,
            invalidText: idiom.validationMaxMinValue_999999,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });
    },
    initFilterTextoFields: function(){
        var me = this,
            idiom = Maestro.ConfigurarReporte.idiom;
            
        me.nfMinLength = new Ext.form.NumberField({
            fieldLabel: idiom.lbFieldMinLength,
            name: 'longitudminima',
            anchor: '90%',
            allowDecimals: false,
            allowNegative: false, 
            maxValue: 999,
            maxText: idiom.validationMaxMinValue_999,
            minValue: 1,
            minText: idiom.validationMaxMinValue_999,
            invalidText: idiom.validationMaxMinValue_999,
        });

        me.nfMaxLength = new Ext.form.NumberField({
            fieldLabel: idiom.lbFieldMaxLength,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'longitudmaxima',
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false, 
            maxValue: 999,
            maxText: idiom.validationMaxMinValue_999,
            minValue: 1,
            minText: idiom.validationMaxMinValue_999,
            invalidText: idiom.validationMaxMinValue_999,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });
    },
    initFilterNomencladorFields: function(){
        var me = this,
            idiom = Maestro.ConfigurarReporte.idiom;
            
         me.tfDisplayField = new Ext.form.TextField({
            fieldLabel: idiom.lbFieldDesplayField,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'nomdenominacion',
            anchor: '90%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d_]+(\d*)?)+$/,
            regexText: idiom.validationOnlyAlphaUndescore,
            maxLength: 100,
            maxLengthText: idiom.validationMaxLength_100,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });

        me.tfValueField = new Ext.form.TextField({
            fieldLabel: idiom.lbFieldValueField,
            labelSeparator: ':'+ me.getTagRequiredField(),
            name: 'nomidentificador',
            anchor: '100%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d_]+(\d*)?)+$/,
            regexText: idiom.validationOnlyAlphaUndescore,
            maxLength: 100,
            maxLengthText: idiom.validationMaxLength_100,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
        });

        me.rbSql = new Ext.form.Radio({
            checked: true,
            itemCls : 'filter-radio',
            hideLabel: true, 
            boxLabel: idiom.lbFieldSql,
            name: 'tipofuentedatos',
            inputValue: 0, 
        });

        me.taSql = new Ext.form.TextArea({
            itemCls : 'filter-textarea',
            hideLabel: true, 
            name: 'sentenciasql',
            anchor: '100%',
            maxLength: 255,
            maxLengthText: idiom.validationMaxLength_255,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
            height: 40,
        });

        me.rbService = new Ext.form.Radio({
            itemCls : 'filter-radio',
            hideLabel: true, 
            boxLabel: idiom.lbFieldService,
            name: 'tipofuentedatos',
            inputValue: 1, 
        });

         me.taService = new Ext.form.TextArea({
            itemCls : 'filter-textarea',
            hideLabel: true, 
            name: 'nomservicio',
            anchor: '100%',
            maxLength: 255,
            maxLengthText: idiom.validationMaxLength_255,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
            height: 40, 
        });
    },
    getTagRequiredField : function(){
        return '<span style="color:red;font-weight:bold">*</span>';
    },
    updateFieldsByFilterType: function(type){
        var me = this;

        me.hideExtraFields();

        switch(type){
            case 1: me.showTextFilterFields();break;
            case 2: me.showDateFilterFields();break;
            case 3: me.showNumericFilterFields();break;
            case 4: me.showNomencladorFilterFields();break;
            case 5: me.showEstructuraFilterFields();break;
        }
    },
    hideExtraFields: function(){
        var me = this,
            elemtDelete = me.form.items.getRange(2),
            lg = elemtDelete.length,
            fieldsDisable = ['cbJavaTypes', 'nfMinValue', 'nfMaxValue', 'nfMinLength', 'nfMaxLength', 'tfDisplayField', 'tfValueField', 'rbSql', 'taSql', 'rbService', 'taService'];

        for(var i=1; i<lg; i++)
            elemtDelete[i].hide();

        for(var x=0; x<10;x++)
            me[fieldsDisable[x]].disable();

    },
    showTextFilterFields: function(){
        this.nfMinLength.enable();
        this.nfMaxLength.enable();
        this.form.items.get(4).show();
    },
    showDateFilterFields: function(){},
    showNumericFilterFields: function(){
        this.nfMinValue.enable();
        this.nfMaxValue.enable();
        this.cbJavaTypes.enable();

        this.form.items.get(3).show();
        this.form.items.get(5).show();
    },
    showNomencladorFilterFields: function(){
        this.cbJavaTypes.enable();
        this.tfDisplayField.enable();
        this.tfValueField.enable();
        this.rbSql.enable();
        this.taSql.enable();
        this.rbService.enable();
        this.taService.enable();

        this.form.items.get(3).show();
        this.form.items.get(6).show();
        this.form.items.get(7).show();
    },
    showEstructuraFilterFields: function(){
        this.cbJavaTypes.enable();
        this.form.items.get(3).show();
    }
});