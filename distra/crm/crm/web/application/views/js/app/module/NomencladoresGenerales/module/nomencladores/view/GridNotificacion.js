Ext.define('Nomencladores.view.GridNotificacion', {
    extend: 'Ext.form.field.Base',
    // extend: 'Ext.grid.Panel',
    alias: 'widget.gridnotificacion',
    errors: new Array(),

    preventMark: false,
    hidden: true,
    border: false,
    width: 572,
    hideLabel: true,
    fieldSubTpl: ['<div id="{id}" class="{fieldCls}"></div>', {}],
    data: [],
    originalValue: '',
    initComponent: function () {
        var me=this;
        // this.etiquetas = LangMgr.getLang(this);
        // this.blankText = this.etiquetas.vBlankText;
        // this.originalValue = [];

        // me.store=Ext.create('Ext.data.Store',{
        //     fields:['persona', 'correo'],
        //     data:[{'persona': 'aaaa', 'persona': 'bbbbbb'}]
        // });
        //
        // me.columns=[
        //     {text:'Persona', dataIndex: 'persona'},
        //     {text:'Correo', dataIndex: 'persona'},
        // ];

        // me.items=[
        //     Ext.create('Ext.grid.Panel',{
        //         store: Ext.create('Ext.data.Store',{
        //             fields:['persona', 'correo'],
        //             data:[{'persona': 'aaaa', 'persona': 'bbbbbb'}]
        //         }),
        //         columns: [
        //             {text:'Persona', dataIndex: 'persona'},
        //             {text:'Correo', dataIndex: 'persona'},
        //         ]
        //     })
        // ];
        function mostrarTooltip(value, meta) {
            if(value)
                meta.tdAttr='data-qtip="'+value+'"';
            return value;
        }

        this.grid=Ext.create('Ext.grid.Panel',{
            title: 'Notificar a',
            itemId: 'griddestinatarios',
            selType: 'checkboxmodel',
            // minHeight: 50,
            // maxHeight: 130,
            store: Ext.create('Ext.data.Store',{
                fields:['persona', 'correo', 'rol', 'nombreusuario'],
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'cargarCorreos'}, ModuleMgr.get('Nomencladores')),
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        root: 'data',
                        totalProperty: 'cant',
                        successProperty: 'success'
                    },
                },
                listeners:{
                    beforeload: function(){
                        // console.log('beforeload 2')
                        me.grid.maskload = new Ext.LoadMask(me.grid.getEl(), {msg: 'Cargando...'});
                        me.grid.maskload.show();
                    },
                    load: function(yo){
                        console.log('load', me.originalValue, me.value, me)
                        // me.grid.setLoading(false);
                        if(me.grid.maskload)me.grid.maskload.hide();
                        if(me.value){
                            Ext.decode(me.value).forEach(function(x){
                                var find=me.grid.getStore().findRecord('correo', x, 0, false, true, true);
                                if(find)
                                    me.grid.getSelectionModel().select(find, true);
                            })
                        }
                        // Ext.decode(me.originalValue)
                    }
                }
            }),
            columns: [
                {text:'Correo', dataIndex: 'correo', flex:1, renderer: mostrarTooltip},
                {text:'Usuario', dataIndex: 'nombreusuario', flex: 1, renderer: mostrarTooltip},
                // {text:'Persona', dataIndex: 'persona', flex: 1, renderer: mostrarTooltip},
                {text:'Rol', dataIndex: 'rol', flex: 1, renderer: mostrarTooltip},
            ]
        });

        this.bodyContainer = Ext.create('Ext.container.Container', {
            flex: 1,
            height: 135,
            // minHeight: 50,
            // maxHeight: 130,
            layout: 'fit',
            items: this.grid

        });
        // var styleLeaf = document.createElement('style');

        // styleLeaf.innerHTML = ".x-form-invalid-field #rightgrid-body{" +
        //     "border-color: #C30;" +
        //     "border-width: 1px !important;" +
        //     "background-image: url(\"../../lib/4.2/resources/ext-theme-classic/images/grid/invalid_line.gif\");" +
        //     "background-repeat: repeat-x;" +
        //     "background-position: center bottom;" +
        //     "}" +
        //     ".x-html-editor-input {border-width: 1px !important;}";
        //
        // document.body.appendChild(styleLeaf);

        me.callParent(arguments);
        // this.defineEvents();
    },
    onRender: function (ct, position) {
        // console.log('RENDER')
        var _this = this;
        _this.setVisible(false);
        _this.up('window').doLayout();
        _this.callParent(arguments);
        _this.bodyContainer.render(_this.inputEl);
        setTimeout(function(){
            if(_this.up('customform')) {
                var query=_this.up('customform').query('[identifier=true]');
                if(query.length>0){
                    _this.grid.getStore().proxy.extraParams[query[0].name] = query[0].getValue();
                    var notificar=_this.up('customform').getForm().findField('notificar');
                    if (notificar) {
                        notificar.on('change', function (yo) {
                            _this.setVisible(yo.getValue());
                            if (yo.getValue()) {
                                _this.grid.getStore().load();
                            }
                            // else{
                            //     _this.grid.getStore().removeAll();
                            // }
                        })
                        notificar.fireEvent('change', notificar);
                    }
                }
            }
        }, 1000)

    },
    afterComponentLayout: function (width) {
        this.callParent();
        this.bodyContainer.initialConfig.width = width;
        this.bodyContainer.setWidth(width);
    },
    // hide: function(){
    //     this.setVisible(false);
    // },
    getValue: function () {
        var value = new Array();
        Ext.each(this.grid.getSelectionModel().getSelection(), function (record) {
            // value.push(record.get('idrol'));
            value.push(record.get('correo'));
        });
        return value;
    },
    getSubmitValue: function () {
        var value = Ext.encode(this.getValue());
        console.log('submit:', value)
        return value;
    },
    reset: function () {
        this.grid.getSelectionModel().deselectAll();
        this.grid.getStore().removeAll();
    },
    isEmpty: function () {
        var value = this.getValue();
        // console.log('is empty', value)
        if (Ext.isEmpty(value)) {
            this.addError(this.blankText);
        } else {
            this.removeError(this.blankText);
        }
    },
    isValid: function () {
        if(this.up('customform').getForm().findField('notificar') &&
            this.up('customform').getForm().findField('notificar').getValue())
            return !Ext.isEmpty(this.getValue());
        return true;
    },
    setValue: function(value){
        console.log('SET VALUE', value)
        this.originalValue=value;
        this.value=value;
        console.log('this.originalValue:', this.originalValue, this.value)
    }

});
