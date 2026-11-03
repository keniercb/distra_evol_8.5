Ext.define('Nomencladores.view.ElementosFormatoNumCont', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.elementosformatonumcont',

    requires: [
        'Ext.grid.*',
        'Ext.layout.container.HBox'
    ],
    errors: new Array(),
    preventMark: false,

    border: false,
    width: 572,
    hideLabel: true,
    fieldSubTpl: ['<div id="{id}" class="{fieldCls}"></div>', {}],

    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);
        this.blankText = this.etiquetas.vBlankText;
        this.listObjWinEdit = new Ext.util.MixedCollection();
        this.createBody();
        // this.a=false;

        //agregando los estilos del componente
        var styleLeaf = document.createElement('style');

        styleLeaf.innerHTML = ".x-form-invalid-field #gpformatonumcontratoelem-body{" +
        "border-color: #C30;" +
        "border-width: 1px !important;" +
        "background-image: url(\"../../lib/4.2/resources/ext-theme-classic/images/grid/invalid_line.gif\");" +
        "background-repeat: repeat-x;" +
        "background-position: center bottom;" +
        "}" +
        ".x-html-editor-input {border-width: 1px !important;}";

        document.body.appendChild(styleLeaf);

        this.callParent(arguments);
        this.defineEvents();
    },
    onRender: function (ct, position) {
        var _this = this;
        _this.callParent(arguments);
        _this.bodyContainer.render(_this.inputEl);
    },
    afterComponentLayout: function (width) {
        this.callParent();
        this.bodyContainer.initialConfig.width = width;
        this.bodyContainer.setWidth(width);
    },
    createBody: function () {
        var _this=this;
        this.btnAdicionar = Ext.create('Ext.button.Button', {
            text: this.etiquetas.titleAdd,
            tooltip: this.etiquetas.qtipAddElemento,
            iconCls: 'adicionar',
            menu: this.getMenuTiposElementos()
        });

        this.btnModificar = Ext.create('Ext.button.Button', {
            text: this.etiquetas.titleMod,
            tooltip: this.etiquetas.qtipModElemento,
            iconCls: 'modificar',
            disabled: true
        });

        this.btnEliminar = Ext.create('Ext.button.Button', {
            text: this.etiquetas.titleDel,
            tooltip: this.etiquetas.qtipDelElemento,
            iconCls: 'eliminar',
            disabled: true
        });

        Ext.define('elementos',{
            extend: 'Ext.data.Model',
            fields: [
                {name: 'idformatonumcontratoelemento'},
                {name: 'denominacion'},
                {name: 'ejemplo'},
                {name: 'orden', type: 'int'},
                {name: 'tipo'},
                {name: 'tipoinfo'},
                {name: 'idformatonumcontrato'},
                {name: 'caracteres'},
                            ]
        });

        this.stElementos = Ext.create('Ext.data.Store', {
            model: 'elementos',
            // listeners:{
            //     datachanged: function () {
            //         console.log('haciendo datachange');
            //         // console.log('ssssssss2',_this.a,_this);
            //         // console.log(_this.up('form').getForm().findField('changegrid'))
            //
            //
            //     }
            // }
        });

        this.gpElementos = Ext.create('Ext.grid.Panel', {
            selType: 'checkboxmodel',
            id: 'gpformatonumcontratoelem',
            viewConfig: {},
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar],
            store: this.stElementos,
            columns: [
                {text: this.etiquetas.lbliteraldenominacion, flex: 2, sortable: true, dataIndex: 'denominacion'},
                {text: this.etiquetas.lbejemplo, flex: 1, sortable: true, dataIndex: 'ejemplo'},
                {text: this.etiquetas.lbtipo, flex: 1, sortable: true, dataIndex: 'tipo', renderer: function(val){
                        switch(val){
                            case '1': return this.etiquetas.lbActionElemTypeText; break;
                            case '2': return this.etiquetas.lbActionElemTypeDate; break;
                            case '3': return this.etiquetas.lbActionElemTypeNumeric; break;
                            case '4': return this.etiquetas.lbActionElemTypeNomenclador; break;
                            case '5': return this.etiquetas.lbActionElemTypeParametro; break;
                            case '6': return this.etiquetas.lbActionElemTypeMarco; break;
                            case '7': return this.etiquetas.lbActionElemTypeEspecifico; break;
                            case '8': return this.etiquetas.lbActionElemTypeSuplemento; break;
                        }
                    }, scope: this
                },
                {text: 'Orden', width: 43, align: 'right', sortable: true, dataIndex: 'orden'},
            ],
            stripeRows: true,
            title:this.etiquetas.titleListElementos
        });

        this.bodyContainer = Ext.create('Ext.container.Container', {
            flex: 1,
            height: 230,
            layout: {
                type: 'fit',
            },
            items: this.gpElementos
        });

        //title:this.etiquetas.titlePrueba
    },
    getMenuTiposElementos: function(){
        var me = this;

        me.menuElementsTypes = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: this.etiquetas.lbActionElemTypeText,
                    elemType: 1,
                },{
                    text: this.etiquetas.lbActionElemTypeDate,
                    elemType: 2,
                },{
                    text: this.etiquetas.lbActionElemTypeNumeric,
                    elemType: 3,
                },{
                    text: this.etiquetas.lbActionElemTypeNomenclador,
                    elemType: 4,
                },{
                    text: this.etiquetas.lbActionElemTypeParametro,
                    elemType: 5,
                },{
                    text: this.etiquetas.lbActionElemTypeMarco,
                    elemType: 6,
                },{
                    text: this.etiquetas.lbActionElemTypeEspecifico,
                    elemType: 7,
                },{
                    text: this.etiquetas.lbActionElemTypeSuplemento,
                    elemType: 8,
                }
            ]
        });

        return me.menuElementsTypes;
    },
    defineEvents: function () {

        this.menuElementsTypes.on({
            scope: this,
            click: function(menu, item){
                if(item){
                    var win = this.getWinEdiByType(item.elemType);
                    win.setStateInsert(true);
                    win.show();
                }
            }
        });

        this.gpElementos.getSelectionModel().on({
            scope: this,
            selectionchange: function (sm, selected) {
                this.btnModificar[(sm.getCount() == 1)?'enable':'disable']();
                this.btnEliminar[(sm.getCount() > 0)?'enable':'disable']();
            }
        });

        this.btnModificar.on('click', function(){
            var sm = this.gpElementos.getSelectionModel();
            if(sm.getCount() == 1){
                var win = this.getWinEdiByType(sm.getSelection()[0].get('tipo'));
                win.setStateInsert(false);
                win.show();
                win.loadRecord(sm.getSelection()[0]);
            }
        }, this);

        this.btnEliminar.on('click', function(){
            var sm = this.gpElementos.getSelectionModel(),
                me = this;
            if(sm.getCount() > 0){
                mostrarMensaje(2, this.etiquetas.msgDeleteElementos, function (btn) {
                        if (btn === 'ok') {
                            me.stElementos.remove(sm.getSelection());
                        }
                    }
                )
            }
        }, this);
    },
    getWinEdiByType: function(type){
        if( !this.listObjWinEdit.containsKey(type) ){
            this.listObjWinEdit.add(type, this.getFactoryWinByType(parseInt(type)));
        }
        return this.listObjWinEdit.get(type);
    },
    getFactoryWinByType: function(type){

        var name = '', me=this;

        switch(type){
            case 1: name = 'Nomencladores.view.ElementosFormatoNumContWinEditTexto';break;
            case 2: name = 'Nomencladores.view.ElementosFormatoNumContWinEditFecha';break;
            case 3: name = 'Nomencladores.view.ElementosFormatoNumContWinEditNumerico';break;
            case 4: name = 'Nomencladores.view.ElementosFormatoNumContWinEditNomenclador';break;
            case 5: name = 'Nomencladores.view.ElementosFormatoNumContWinEditParametro';break;
            case 6: name = 'Nomencladores.view.ElementosFormatoNumContWinEditMarco';break;
            case 7: name = 'Nomencladores.view.ElementosFormatoNumContWinEditEspecifico';break;
            case 8: name = 'Nomencladores.view.ElementosFormatoNumContWinEditSuplemento';break;
        }
        
        var win =  Ext.create(name);
       
        win.down('button[itemId=btnaceptar]').on('click', function(){
            // console.log('dddd',win.getStateInsert())
            if(win.getStateInsert())
                this.insertElementosGrid(win.getFormValues());
            else
                this.modificarElementosGrid(win);
            win.hide();
            console.log('this.:',this.up('window'))
            console.log('this2.:',this.up('window').btnAceptar)
            // console.log('this.bodyContainer:',this.bodyContainer)
            // console.log('this.bodyContainer2:',this.bodyContainer.up('window'))
            // setTimeout(function(){
            //     me.up('window').btnAceptar.setDisabled(false);
            // },1000)

            // this.bodyContainer.btnAplicarExtend.disabled(false);
                    }, this);

        win.down('button[itemId=btnaplicar]').on('click', function(){
            this.insertElementosGrid(win.getFormValues());
            win.resetForm();
        }, this);

        return win;
    },
    insertElementosGrid: function(values){
        this.stElementos.add( new Ext.create('elementos', values) );
        this.stElementos.sort('orden', 'ASC');
    },

    modificarElementosGrid: function(win){
        console.log('ventana:', win);
        var me= this;
        var values=win.getFormValues();
        var record = this.gpElementos.getSelectionModel().getSelection()[0];//record toma el elemento modificado con los valores anteriores y otras caracteristicas
        console.log('record:', values);
        var cambios=false;
        for(var i in values){
            if(i == 'caracteres'){
                    if(record.get('tipoinfo').caracteres!=values[i]){
                    // var tipoinfo={};
                    // tipoinfo.idformatonumcontratoelemento= record.get('tipoinfo').idformatonumcontratoelemento;
                    // tipoinfo.caracteres= values[i];
                    var tipoinfo=win.getTypeValues();
                    record.set('tipoinfo', tipoinfo);
                    cambios=true;
                }
            }
            // else if(i == 'longitud'){
            //     console.log(record.get('longitud'), '-',values[i])
            //     if(record.get('longitud')!= values[i]){
            //         console.log('rrr')
            //         var tipoinfo=win.getTypeValues();
            //         record.set('tipoinfo', tipoinfo);
            //         cambios=true;
            //     }
            // }
            else if(record.get(i)+''!=values[i]+''){
                record.set(i, values[i]);
                var tipoinfo=win.getTypeValues();
                record.set('tipoinfo', tipoinfo);
                cambios=true;
            }
        }

        if(cambios)
            me.up('form').getForm().findField('changegrid').setValue('valido');

        this.stElementos.sort('orden', 'ASC');

    },
    setValue: function (value) {
        if (value) {
            this.stElementos.loadData(value);
        }
    },
    getValue: function(){
        var result = new Array();

        this.stElementos.each( function(record){
            result.push(record.getData());
        }, this);

        return result;
    },
    getSubmitValue: function () {
        var value = Ext.encode(this.getValue());
        return value;
    },
    reset: function () {
        var _this = this;
        this.preventMark = true;
        this.stElementos.removeAll();
        this.preventMark = false;
    },
    isEmpty: function () {
        var value = this.getValue();

        if (Ext.isEmpty(value)) {
            this.addError(this.blankText);
        } else {
            this.removeError(this.blankText);
        }
    },
    getErrors: function () {
        if (this.allowBlank === false) {
            this.isEmpty();
        }
        return this.errors;
    },
    addError: function (error) {
        if (this.errors.indexOf(error) == -1) {
            this.errors.push(error);
        }
    },
    removeError: function (error) {
        var pos = this.errors.indexOf(error);
        if (pos != -1) {
            this.errors.splice(pos, 1);
        }
    },
    isValid: function () {
        var _this = this,
            disabled = _this.disabled,
            validate = _this.forceValidation || !disabled;
        return validate ? _this.validateValue() : disabled;
    },
    validateValue: function () {
        var _this = this,
            errors = _this.getErrors(),
            //realWidth = _this.rightGrid.initialConfig.width,
            isValid = Ext.isEmpty(errors);
        /*if (!_this.preventMark) {
            if (isValid) {
                _this.clearInvalid();
                //_this.rightGrid.setWidth(realWidth);
            } else {
                _this.markInvalid(errors[0]);
                //_this.rightGrid.setWidth(realWidth - 15);
            }
        }*/

        return isValid;
    },
    onDestroy: function () {
        this.gpElementos.destroy();
    }
});

Ext.define('Nomencladores.view.ElementosFormatoNumContWinEdit', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    closeAction: 'hide',
    modal: true,
    resizable: false,
    bodyBorder: false,
    border : false,
    stateInsert: true,
    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);

        this.buttons= [
            {
                text: this.etiquetas.lbBtnCancel,
                tooltip: this.etiquetas.qtipCancel,
                iconCls: 'cancelar',
                handler: this.onClickBtnCancelar,
                scope: this,
            },{
                text: this.etiquetas.lbBtnApply,
                tooltip: this.etiquetas.qtipApply,
                iconCls: 'aplicar',
                itemId: 'btnaplicar'
            },{
                text: this.etiquetas.lbBtnAccept,
                tooltip: this.etiquetas.qtipAccept,
                iconCls: 'aceptar',
                itemId: 'btnaceptar'
            }
        ];

        this.items = Ext.create('Ext.form.Panel', {
            bodyPadding: 5,
            bodyBorder: false,
            border : false,
            frame: true,
            width: 350,
            itemId: 'formpanel',
            fieldDefaults: {
                labelAlign: 'top',
            },
            items: this.getFormItems(),
            listeners: {
                validitychange: function(elem, valid){
                    var functName = (valid)?'enable':'disable';

                    this.down('button[itemId=btnaceptar]')[functName]();
                    this.down('button[itemId=btnaplicar]')[functName]();
                },
                render: function(elem){
                    var functName = (elem.isValid())?'enable':'disable';

                    this.down('button[itemId=btnaceptar]')[functName]();
                    this.down('button[itemId=btnaplicar]')[functName]();
                },
                scope: this
            }
        });

        this.callParent(arguments);

        this.on('show', function(){
            this.down('button[itemId=btnaplicar]')[(this.stateInsert)?'show':'hide']();
            this.resetForm();

            var titleAction = this.etiquetas[(this.stateInsert)?'qtipAddElemento':'qtipModElemento'];
            this.setTitle(titleAction+' '+this.getWindowEditType());
        }, this);
    },
    getBaseItems: function() {
        return [
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'textfield',
                        flex:1,
                        margin: '0 10 0 0',
                        fieldLabel: this.etiquetas.lbliteraldenominacion,
                        maxLength: 100,
                        allowBlank: false,
                        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
                        regexText: this.etiquetas.vAlphanum,
                        name: 'denominacion'
                    },{
                        xtype: 'textfield',
                        flex:1,
                        margin: '0 10 0 0',
                        fieldLabel: this.etiquetas.lbejemplo,
                        maxLength: 50,
                        allowBlank: false,
                        name: 'ejemplo'
                    },{
                        xtype: 'numberfield',
                        width:50,
                        fieldLabel: this.etiquetas.lborden,
                        maxLength: 2,
                        allowBlank: false,
                        allowDecimals: false,
                        allowExponential: false,
                        minValue: 1,
                        name: 'orden'
                    },
                ]
            }
        ];
    },
    getFormItems: function(){
        return this.getBaseItems();
    },
    getWindowEditType: function(){
        return '';
    },
    onClickBtnCancelar: function(){
        this.hide();
    },
    setStateInsert: function(val){
        console.log('valor:',val);
        this.stateInsert = val;
    },
    getStateInsert: function(){
        return this.stateInsert;
    },
    resetForm: function(){
        this.down('form').getForm().reset();
        this.resetTypeField();
        this.down('field:first').focus(false, 500);
    },
    loadRecord: function(record){
        this.down('form').loadRecord(record);
        this.loadTypeValues(record.get('tipoinfo'));
    },
    getFormValues: function(){
        var values = this.down('form').getValues();
        values['tipoinfo'] = this.getTypeValues();

        return values
    },
    resetTypeField: function(){},
    loadTypeValues: function(val){},
    getTypeValues: function(){}
});

Ext.define('Nomencladores.view.ElementosFormatoNumContWinEditNumerico', {
    extend: 'Nomencladores.view.ElementosFormatoNumContWinEdit',
    getFormItems: function(){
        var  formItems = this.getBaseItems();

        formItems.push({xtype: 'hidden', name: 'tipo', value: 3});
        formItems.push({
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'numberfield',
                    width:100,
                    fieldLabel: this.etiquetas.lblongitud,
                    margin: '0 15 0 0',
                    maxLength: 2,
                    allowBlank: false,
                    allowDecimals: false,
                    allowExponential: false,
                    minValue: 1,
                    name: 'longitud'
                },{
                    xtype: 'checkbox',
                    margin: '17 0 0 0',
                    boxLabel: this.etiquetas.lbincluircerosizquierda,
                    inputValue: '1',
                    flex:1,
                    name: 'incluircerosizquierda'
                }
            ]
        });

        return formItems;

    },
    getWindowEditType: function(){
        return LangMgr.getLang(this).lbActionElemTypeNumeric.toLowerCase();
    },
    loadTypeValues: function(val){
        for(var i in val){
            if(i == 'longitud')
                this.down('field[name=longitud]').setValue(val[i]);

            if(i == 'incluircerosizquierda')
                this.down('field[name=incluircerosizquierda]').setValue(val[i]);
        }
    },
    getTypeValues: function(){
        return {
            'longitud' : this.down('field[name=longitud]').getValue(),
            'incluircerosizquierda' : this.down('field[name=incluircerosizquierda]').getValue(),
        }
    }
});

Ext.define('Nomencladores.view.ElementosFormatoNumContWinEditTexto', {
    extend: 'Nomencladores.view.ElementosFormatoNumContWinEdit',
    getFormItems: function(){
        var  formItems = this.getBaseItems();

        formItems.push({xtype: 'hidden', name: 'tipo', value: 1});
        formItems.push({
            xtype: 'textfield',
            width:  '49%',
            fieldLabel: this.etiquetas.lbcaracteres,
            maxLength: 50,
            allowBlank: false,
            name: 'caracteres'
        });

        return formItems;

    },
    getWindowEditType: function(){
        return LangMgr.getLang(this).lbActionElemTypeText.toLowerCase();
    },
    loadTypeValues: function(val){
        for(var i in val){
            if(i == 'caracteres')
                this.down('field[name=caracteres]').setValue(val[i]);
        }
    },
    getTypeValues: function(){
        return {
            'caracteres' : this.down('field[name=caracteres]').getValue(),
        }
    }
});

Ext.define('Nomencladores.view.ElementosFormatoNumContWinEditFecha', {
    extend: 'Nomencladores.view.ElementosFormatoNumContWinEdit',
    getFormItems: function(){
        var  formItems = this.getBaseItems();

        formItems.push({xtype: 'hidden', name: 'tipo', value: 2});
        formItems.push({
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: this.etiquetas.lbformato,
                    margin: '0 15 0 0',
                    width: 100,
                    maxLength: 10,
                    allowBlank: false,
                    name: 'formato'
                },{
                    xtype: 'checkbox',
                    margin: '17 10 0 0',
                    boxLabel: this.etiquetas.lbgenerada,
                    inputValue: '1',
                    name: 'generada',
                    listeners: {
                        change: function(elem, checked){
                            var fieldNombreParam = this.down('field[name=nombreparametro]');

                            fieldNombreParam.reset();
                            fieldNombreParam.setDisabled(checked);
                        },
                        scope: this
                    }
                },{
                    xtype: 'textfield',
                    fieldLabel: this.etiquetas.lbnombreparametro,
                    name: 'nombreparametro',
                    flex:1,
                    maxLength: 50,
                    allowBlank: false,
                    regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ.\d]+(\d*)?)+$/,
                    regexText: this.etiquetas.vAlphanum,
                    name: 'nombreparametro',
                }
            ]
        });

        return formItems;

    },
    getWindowEditType: function(){
        return LangMgr.getLang(this).lbActionElemTypeDate.toLowerCase();
    },
    loadTypeValues: function(val){
        for(var i in val){
            if(i == 'formato')
                this.down('field[name=formato]').setValue(val[i]);

            if(i == 'generada')
                this.down('field[name=generada]').setValue(val[i]);

            if(i == 'nombreparametro')
                this.down('field[name=nombreparametro]').setValue(val[i]);
        }
    },
    getTypeValues: function(){
        return {
            'formato' : this.down('field[name=formato]').getValue(),
            'generada' : this.down('field[name=generada]').getValue(),
            'nombreparametro' : this.down('field[name=nombreparametro]').getValue(),
        }
    }
});

Ext.define('Nomencladores.view.ElementosFormatoNumContWinEditNomenclador', {
    extend: 'Nomencladores.view.ElementosFormatoNumContWinEdit',
    asociatevalues: null,
    getFormItems: function(){
        var formItems = this.getBaseItems();

        formItems.push({xtype: 'hidden', name: 'tipo', value: 4});
        var store = Ext.create('Ext.data.Store', {
            fields: ['idnomenclador', 'denominacion', 'nombreparametro'],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getFormatoNumContratoNomencladores'}, ModuleMgr.get('Nomencladores')),
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                }
            }
        });
        store.load();

        formItems.push({
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'combobox',
                    fieldLabel: this.etiquetas.lbnomenclador,
                    margin: '0 15 0 0',
                    flex:1,
                    validateOnBlur: true,
                    forceSelection: true,
                    multiSelect: false,
                    editable: false,
                    queryMode: 'local',
                    typeAhead: true,
                    displayField: 'denominacion',
                    valueField: 'idnomenclador',
                    listLoadingText: this.etiquetas.msgLoading,
                    listEmptyText: this.etiquetas.msgNoDataLoaded,
                    store: store,
                    allowBlank: false,
                    name: 'idnomenclador',
                    listeners: {
                        scope: this,
                        change: function(cb, newValue){
                            if(newValue) {
                                this.gridElem.getStore().load({params: {idnom: newValue}});

                            }
                        },
                        select: function(cb, record){
                            if(cb.getValue() && record.length>0){
                                console.log(record)
                                this.down('form').getForm().findField('nombreparametro').setValue(record[0].get('nombreparametro'));
                            }
                        }
                    }
                },{
                    xtype: 'textfield',
                    fieldLabel: this.etiquetas.lbnombreparametro,
                    flex:1,
                    maxLength: 50,
                    allowBlank: false,
                    regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ.\d]+(\d*)?)+$/,
                    regexText: this.etiquetas.vAlphanum,
                    name: 'nombreparametro',
                }
            ]
        });

        this.initGridElem();
        formItems.push(this.gridElem);

        return formItems;
    },
    initGridElem: function(){
        var _this = this
        this.storeGridElem =  Ext.create('Ext.data.Store', {
            fields: ['idnomelement', 'nomvalor', 'asociatevalue'],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getFormatoNumContratoNomencladoresElem'}, ModuleMgr.get('Nomencladores')),
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function(){
                    _this.loadAsociatesValues(_this.asociatevalues);
                },
                // scope: this
            }
        });

        this.gridElem = Ext.create('Ext.grid.Panel', {
            title: this.etiquetas.titleGridElementosNom,
            height: 150,
            margin: '10 0 0 0',
            plugins: [new Ext.grid.plugin.CellEditing({
                clicksToEdit: 1
            })],
            selModel: {
                selType: 'cellmodel'
            },
            store: this.storeGridElem,
            columns: [
                {header: this.etiquetas.lbelemento, flex: 1, sortable: true, dataIndex: 'nomvalor'},
                {header: this.etiquetas.lbvalor, flex: 1, sortable: true, dataIndex: 'asociatevalue',
                    editor: {
                        allowBlank: false,
                    }
                }
            ]
        });
    },
    getWindowEditType: function(){
        return LangMgr.getLang(this).lbActionElemTypeNomenclador.toLowerCase();
    },
    resetTypeField: function(){
        if(this.stateInsert){
            this.gridElem.getStore().reload({params: {idnom: 0}});
            this.asociatevalues = null;
        }
    },
    loadTypeValues: function(val){

        for(var i in val){
            if(i == 'idnomenclador')
                this.down('field[name=idnomenclador]').setValue(parseInt(val[i]));
            if(i == 'nombreparametro')
                this.down('field[name=nombreparametro]').setValue(val[i]);
            if(i == 'NomFormatoNumContratoElementoNomencladorValor')
                this.asociatevalues = val[i];
        }
    },
    getTypeValues: function(){
        var nomval = new Array();
        this.storeGridElem.each(function(elem){
            nomval.push({
                'idnomencladorelemento' : elem.get('idnomelement'),
                'valor' : elem.get('asociatevalue'),
            });
        }, this);

        return {
            'idnomenclador' : this.down('field[name=idnomenclador]').getValue(),
            'nombreparametro' : this.down('field[name=nombreparametro]').getValue(),
            'NomFormatoNumContratoElementoNomencladorValor': nomval,
        }
    },
    loadAsociatesValues: function(val){
        Ext.each(val, function(elem){
            var record = this.storeGridElem.findRecord('idnomelement', elem['idnomencladorelemento']);
            if(record)
                record.set('asociatevalue', elem['valor']);
        }, this);
    }
});

Ext.define('Nomencladores.view.ElementosFormatoNumContWinEditParametro', {
    extend: 'Nomencladores.view.ElementosFormatoNumContWinEdit',
    getFormItems: function(){
        var formItems = this.getBaseItems();

        formItems.push({xtype: 'hidden', name: 'tipo', value: 5});

        formItems.push({
            xtype: 'textfield',
            fieldLabel: this.etiquetas.lbnombreparametro,
            name: 'nombreparametro',
            width:150,
            maxLength: 50,
            allowBlank: false,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ.\d]+(\d*)?)+$/,
            regexText: this.etiquetas.vAlphanum,
        });

        return formItems;
    },
    getWindowEditType: function(){
        return LangMgr.getLang(this).lbActionElemTypeParametro.toLowerCase();
    },
    loadTypeValues: function(val){
        for(var i in val){
            if(i == 'nombreparametro')
                this.down('field[name=nombreparametro]').setValue(val[i]);
        }
    },
    getTypeValues: function(){
        return {
            'nombreparametro' : this.down('field[name=nombreparametro]').getValue(),
        }
    }
});

Ext.define('Nomencladores.view.ElementosFormatoNumContWinEditConsecutivo', {
    extend: 'Nomencladores.view.ElementosFormatoNumContWinEdit',
    getConsecItems: function(){
        return {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'numberfield',
                    width:100,
                    fieldLabel: this.etiquetas.lblongitud,
                    margin: '0 15 0 0',
                    maxLength: 2,
                    allowBlank: false,
                    allowDecimals: false,
                    allowExponential: false,
                    minValue: 1,
                    name: 'longitud'
                },{
                    xtype: 'checkbox',
                    margin: '17 0 0 0',
                    boxLabel: this.etiquetas.lbincluircerosizquierda,
                    inputValue: '1',
                    flex:1,
                    name: 'incluircerosizquierda'
                }
            ]
        };
    },
    loadTypeValues: function(val){
        for(var i in val){
            if(i == 'longitud')
                this.down('field[name=longitud]').setValue(val[i]);

            if(i == 'incluircerosizquierda')
                this.down('field[name=incluircerosizquierda]').setValue(val[i]);
        }
    },
    getTypeValues: function(){
        return {
            'longitud' : this.down('field[name=longitud]').getValue(),
            'incluircerosizquierda' : this.down('field[name=incluircerosizquierda]').getValue(),
        }
    }
});

Ext.define('Nomencladores.view.ElementosFormatoNumContWinEditMarco', {
    extend: 'Nomencladores.view.ElementosFormatoNumContWinEditConsecutivo',
    getFormItems: function(){
        var  formItems = this.getBaseItems();

        formItems.push({xtype: 'hidden', name: 'tipo', value: 6});
        formItems.push(this.getConsecItems());
        return formItems;
    },
    getWindowEditType: function(){
        return LangMgr.getLang(this).lbActionElemTypeMarco.toLowerCase();
    },
});

Ext.define('Nomencladores.view.ElementosFormatoNumContWinEditEspecifico', {
    extend: 'Nomencladores.view.ElementosFormatoNumContWinEditConsecutivo',
    getFormItems: function(){
        var  formItems = this.getBaseItems();

        formItems.push({xtype: 'hidden', name: 'tipo', value: 7});
        formItems.push(this.getConsecItems());
        return formItems;
    },
    getWindowEditType: function(){
        return LangMgr.getLang(this).lbActionElemTypeEspecifico.toLowerCase();
    },
});

Ext.define('Nomencladores.view.ElementosFormatoNumContWinEditSuplemento', {
    extend: 'Nomencladores.view.ElementosFormatoNumContWinEditConsecutivo',
    getFormItems: function(){
        var  formItems = this.getBaseItems();

        formItems.push({xtype: 'hidden', name: 'tipo', value: 8});
        formItems.push(this.getConsecItems());
        return formItems;
    },
    getWindowEditType: function(){
        return LangMgr.getLang(this).lbActionElemTypeSuplemento.toLowerCase();
    },
});
