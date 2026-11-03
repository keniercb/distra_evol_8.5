Ext.define('Reportes.view.WinEditFiltro', {
    extend: 'Ext.window.Window',
    alias: 'widget.wineditfiltro',
    frame: false,
    margin: false,
    border: false,
    width: 350,
    closable : true,
    closeAction: 'hide',
    modal: true,
    actionInsert: true,
    resizable:false,
    filtertype: 0,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.initBody();

        me.initButtons();

        me.callParent();

        me.formFiltro.on('validitychange', function(form, valid){
            me.down('button[action=aceptar]').setDisabled(!valid);
        }, me);
    },
    initBody: function(){
        var me = this;

        me.formFiltro = Ext.create('Ext.form.Panel', {
            border: false,
            bodyStyle : {padding: '10px 10px 10px 10px'},
            frame: true,
            fieldDefaults: {
                labelAlign: 'top',
                blankText: me.etiquetas.vBlankText
            },
            layout: 'form',
            items: [].concat(
                this.getBasicFields(),
                this.getNumericFilterFields(),
                this.getTextFilterFields(),
                this.getNomFilterFields(),
                // this.getEstructuraFilterFields(),
                [{xtype: 'hidden', name: 'idfiltro', value: 0}]
            )
        });

        me.items = [me.formFiltro];
    },
    getBasicFields: function(){
        var me = this;

        var storeJavaType = Ext.create('Ext.data.ArrayStore',{
            fields: ['javatype'],
            data : [
                ['java.lang.Number'],
                ['java.lang.Double'],
                ['java.lang.Float'],
                ['java.lang.Integer'],
                ['java.lang.Long'],
                ['java.lang.Short'],
                ['java.math.Bigdecimal'],
                ['java.lang.String']

            ]
        });

        return [{
            layout: 'column',
            border: false,
            bodyStyle: 'background:#DFE9F6;',
            items: [
                {
                    xtype: 'textfield',
                    columnWidth: 0.7,
                    fieldLabel: me.etiquetas.lbDenominacion,
                    name: 'denominacion',
                    anchor: '90%',
                    margin: '0 10 0 0',
                    regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
                    regexText: me.etiquetas.validationOnlyAlphaSpacer,
                    maxLength: 150,
                    maxLengthText: me.etiquetas.validationMaxLength_150,
                    allowBlank: false
                },{
                    xtype: 'numberfield',
                    name: 'orden',
                    columnWidth: 0.3,
                    fieldLabel: me.etiquetas.lbOrdenMostrar,
                    allowDecimals: false,
                    allowNegative: false,
                    maxValue: 99,
                    maxText: me.etiquetas.validationMaxMinValueOrden,
                    minValue: 1,
                    minText: me.etiquetas.validationMaxMinValueOrden,
                    invalidText: me.etiquetas.validationMaxMinValueOrden,
                    allowBlank: false
                }
            ]
        },{
            layout: 'column',
            border: false,
            bodyStyle: 'background:#DFE9F6;',
            items: [
                {
                    xtype: 'textfield',
                    columnWidth: 0.65,
                    fieldLabel: me.etiquetas.lbNombreParametro,
                    name: 'nombreparametro',
                    anchor: '90%',
                    margin: '0 10 0 0',
                    regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d_]+(\d*)?)+$/,
                    regexText: me.etiquetas.validationNombreParametro,
                    maxLength: 50,
                    maxLengthText: me.etiquetas.validationMaxLength_50,
                    allowBlank: false
                },{
                    xtype: 'numberfield',
                    name: 'anchocolumna',
                    columnWidth: 0.35,
                    fieldLabel: me.etiquetas.lbAnchoColumna,
                    allowDecimals: false,
                    allowNegative: false,
                    maxValue: 999,
                    maxText: me.etiquetas.validationMaxMinValueAnchColumna,
                    minValue: 1,
                    minText: me.etiquetas.validationMaxMinValueAnchColumna,
                    invalidText: me.etiquetas.validationMaxMinValueAnchColumna,
                    allowBlank: false
                }
            ]
        },{
            xtype: 'combobox',
            fieldLabel:  me.etiquetas.lbJavaType,
            store: storeJavaType,
            valueField: 'javatype',
            displayField: 'javatype',
            hiddenName: 'javatype',
            triggerAction: 'all',
            forceSelection: true,
            name: 'javatype',
            mode: 'local',
            emptyText: me.etiquetas.lbEmptyText,
            allowBlank: false
        }];
    },
    getNumericFilterFields: function(){
        var me = this;

        return  [{
            layout: 'column',
            border: false,
            bodyStyle: 'background:#DFE9F6;',
            name: 'pnumeric',
            items: [
                {
                    xtype: 'numberfield',
                    name: 'valorminimo',
                    columnWidth: 0.54,
                    fieldLabel: me.etiquetas.lbMinValue,
                    anchor: '90%',
                    margin: '0 10 0 0',
                    maxValue: 999999,
                    maxText: me.etiquetas.validationMaxMinValue_999999,
                    minValue: 1,
                    minText: me.etiquetas.validationMaxMinValue_999999,
                    invalidText: me.etiquetas.validationMaxMinValue_999999,
                    allowDecimals: false,
                    allowNegative: false,
                    allowBlank: false
                },{
                    xtype: 'numberfield',
                    name: 'valormaximo',
                    columnWidth: 0.46,
                    fieldLabel: me.etiquetas.lbMaxValue,
                    maxValue: 999999,
                    maxText: me.etiquetas.validationMaxMinValue_999999,
                    minValue: 1,
                    minText: me.etiquetas.validationMaxMinValue_999999,
                    invalidText: me.etiquetas.validationMaxMinValue_999999,
                    allowDecimals: false,
                    allowNegative: false,
                    allowBlank: false
                }
            ]
        }];
    },
    getTextFilterFields: function(){
        var me = this;

        return [
            {
                layout: 'column',
                border: false,
                bodyStyle: 'background:#DFE9F6;',
                name: 'ptext',
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'longitudminima',
                        columnWidth: 0.54,
                        fieldLabel: me.etiquetas.lbMinLength,
                        anchor: '90%',
                        margin: '0 10 0 0',
                        maxValue: 999,
                        maxText: me.etiquetas.validationMaxMinValue_999,
                        minValue: 1,
                        minText: me.etiquetas.validationMaxMinValue_999,
                        invalidText: me.etiquetas.validationMaxMinValue_999,
                        allowDecimals: false,
                        allowNegative: false,
                        allowBlank: false
                    },{
                        xtype: 'numberfield',
                        name: 'longitudmaxima',
                        columnWidth: 0.46,
                        fieldLabel: me.etiquetas.lbMaxLength,
                        maxValue: 999,
                        maxText: me.etiquetas.validationMaxMinValue_999,
                        minValue: 1,
                        minText: me.etiquetas.validationMaxMinValue_999,
                        invalidText: me.etiquetas.validationMaxMinValue_999,
                        allowDecimals: false,
                        allowNegative: false,
                        allowBlank: false
                    }
                ]
            }
        ];
    },
    getNomFilterFields: function(){
        var me = this;

        return [{
            layout: 'column',
            border: false,
            bodyStyle: 'background:#DFE9F6;',
            name: 'pnomenclador',
            items: [
                {
                    xtype: 'textfield',
                    columnWidth: 0.54,
                    fieldLabel: me.etiquetas.lbCampoMostrar,
                    name: 'nomdenominacion',
                    anchor: '90%',
                    margin: '0 10 0 0',
                    regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d_]+(\d*)?)+$/,
                    regexText: me.etiquetas.validationNombreParametro,
                    maxLength: 100,
                    maxLengthText: me.etiquetas.validationMaxLength_100,
                    allowBlank: false
                },{
                    xtype: 'textfield',
                    name: 'nomidentificador',
                    fieldLabel: me.etiquetas.lbCampoValor,
                    columnWidth: 0.46,
                    regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d_]+(\d*)?)+$/,
                    regexText: me.etiquetas.validationNombreParametro,
                    maxLength: 100,
                    maxLengthText: me.etiquetas.validationMaxLength_100,
                    allowBlank: false
                },{
                    xtype: 'checkboxfield',
                    name: 'multipleseleccion',
                    boxLabel: me.etiquetas.lbCheckMultipleSeleccion,
                    columnWidth: 0.5,
                    inputValue: 1,
                    uncheckedValue: 0
                },{
                    xtype: 'checkboxfield',
                    name: 'paginado',
                    boxLabel: me.etiquetas.lbCheckPaginado,
                    columnWidth: 0.5,
                    inputValue: 1,
                    uncheckedValue: 0
                },
            ]
        },{
            xtype: 'fieldset',
            style: 'margin-bottom: 0px;',
            title: me.etiquetas.lbFsFuenteDatos,
            autoHeight: true,
            name: 'fsnomenclador',
            items: [{
                xtype: 'radio',
                name: 'tipofuentedatos',
                action: 'rdsql',
                inputValue: 0,
                checked: true,
                boxLabel: me.etiquetas.lbFieldSql
            },{
                xtype: 'textarea',
                hideLabel: true,
                name: 'sentenciasql',
                maxLengthText: me.etiquetas.validationMaxLength_255,
                allowBlank: false,
                anchor: '100%',
                height: 100
            },{
                xtype: 'radio',
                name: 'tipofuentedatos',
                action: 'rdservicio',
                inputValue: 1,
                boxLabel: me.etiquetas.lbFieldServicio
            },{
                xtype: 'textarea',
                hideLabel: true,
                name: 'nomservicio',
                maxLengthText: me.etiquetas.validationMaxLength_255,
                allowBlank: false,
                anchor: '100%',
                height: 100
            }]
        }];
    },
    getEstructuraFilterFields: function(){
        return [{
            // xtype: 'fieldset',
            // title: 'Estructuras',
            layout: 'anchor',
            border: false,
            bodyStyle: 'background:#DFE9F6;',
            name: 'pestructura',
            autoHeight: true,
            // height: 250,
            items: [
                {
                    xtype: 'checkboxfield',
                    name: 'estructurapropia',
                    boxLabel: 'Ver sólo estructura propia',
                    // columnWidth: 0.5,
                    anchor: '100%',
                    inputValue: 1,
                    uncheckedValue: 0,
                    action: 'setestructurapropia'
                },
                Ext.create('GestionContrato.view.SearchCmbArea', {
                    fieldLabel: 'Estructuras',
                    labelAlign: 'top',
                    name: 'estructuras',
                    // hideLabel: true,
                    // maxWidth: 250,
                    // minWidth: 150,
                    // width: 200,
                    editable: false,
                    anchor: '100%',
                    searchTooltip: 'Buscar',
                    clearTooltip: 'Limpiar filtro',
                    emptyText: 'Seleccione el \xE1rea...',
                    searchButton:false
                })

                // Ext.create('Ext.tree.Panel', {
                //     itemId: 'tree_estructura',
                //     name: 'tree_estructura',
                //     height: 250,
                //     margin: '0 0 10 0',
                //     rootVisible: true,
                //     frame: false,
                //     autoScroll: true,
                //     store: Ext.create('Ext.data.TreeStore', {
                //         proxy: {
                //             type: 'ajax',
                //             url: UtilsFn.buildUrl({action: 'getEstructuras'}, ModuleMgr.get('Nomencladores')),
                //             reader: {
                //                 type: 'json',
                //                 totalProperty: 'total',
                //                 successProperty: 'success'
                //             }
                //         },
                //         root: {
                //             text: 'Dominio de entidades',
                //             id: '0',
                //             expanded: true
                //         }
                //     })
                // })
            ]
        }]
    },
    initButtons: function(){
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                action: 'cerrar'
            },{
                text: me.etiquetas.lbBtnAccept,
                iconCls: 'icondistra-aceptar',
                tooltip: me.etiquetas.qtipAccept,
                disabled: true,
                action: 'aceptar'
            }
        ];
    },
    initState: function(){
        var me = this;
        me.setTitle( me.etiquetas[(me.actionInsert)?'titleWinAdicionarFiltro':'titleWinModificarFiltro'] );
    },
    updateFieldsByFilterType: function(filtertype){
        var me = this,
            form = me.formFiltro;

        me.filtertype = filtertype;

        me.hideFieldsTypes();
        // console.log('filtertype:', filtertype)
        switch(filtertype){
            case 1:
                form.down('field[name=longitudminima]').enable();
                form.down('field[name=longitudmaxima]').enable();
                form.down('container[name=ptext]').show();
                break;
            case 3:
                form.down('field[name=javatype]').enable();
                form.down('field[name=javatype]').show();

                form.down('field[name=valorminimo]').enable();
                form.down('field[name=valormaximo]').enable();
                form.down('container[name=pnumeric]').show();
                break;
            case 4:
                form.down('field[name=javatype]').enable();
                form.down('field[name=javatype]').show();

                form.down('field[name=nomdenominacion]').enable();
                form.down('field[name=nomidentificador]').enable();
                form.down('container[name=pnomenclador]').show();


                var fieldrdsql = form.down('field[action=rdsql]');
                fieldrdsql.enable();

                form.down('field[name=sentenciasql]').enable();
                form.down('field[action=rdservicio]').enable();
                form.down('field[name=nomservicio]').enable();
                form.down('fieldset[name=fsnomenclador]').show();

                fieldrdsql.fireEvent('change', fieldrdsql, true);
                break;
            case 5:
                console.log('tamo aqui1')
                // form.down('field[name=nombreparametro]').setReadOnly(true);
                // form.down('field[name=nombreparametro]').setValue('idestructuracomun');
                // form.down('field[name=orden]').setValue(99);
                // form.down('field[name=anchocolumna]').setDisabled(true);
                // form.down('field[name=estructuras]').enable();
                // form.down('field[name=estructurapropia]').enable();
                // form.down('container[name=pestructura]').show();
                // form.down('field[name=javatype]').enable();
                // form.down('field[name=javatype]').show();
                break;
        }

        me.center();
    },
    hideFieldsTypes: function(){
        var me = this,
            form = me.formFiltro,
            elemNameDisable = [
                'javatype', 'valorminimo', 'valormaximo', 'longitudminima', 'longitudmaxima', 'nomdenominacion',
                'nomidentificador', 'tipofuentedatos', 'sentenciasql', 'nomservicio', 'estructurapropia', 'estructuras'
            ],
            elemNameHide = [
                'javatype', 'pnumeric', 'ptext', 'pnomenclador', 'fsnomenclador', 'pestructura'
            ];

        form.cascade(function(comp){
            if(elemNameDisable.indexOf(comp.name) != -1)
                comp.disable();
            if(elemNameHide.indexOf(comp.name) != -1)
                comp.hide();
        }, me);
    },
    resetComponents: function(){
        var me = this;

        me.formFiltro.getForm().reset();
        me.formFiltro.down('field:first').focus(false, 500);
    },
    loadValues: function(val){
        var me = this;
        me.formFiltro.getForm().loadRecord(val);
        if(val.data['idestructuras'] && me.formFiltro.down('field[name=estructuras]')){
            me.formFiltro.down('field[name=estructuras]').idValue=val.data['idestructuras'].split(',');
        }
    },
    setActionInsert: function(action){
        this.actionInsert = !!action;
    },
    getActionInsert: function(){
        return this.actionInsert;
    },
    show:function(filtertype){
        var me = this;

        me.initState();

        me.callParent();

        me.updateFieldsByFilterType(filtertype);
        me.resetComponents();

    }
});
