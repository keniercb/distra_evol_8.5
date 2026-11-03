Ext.define('GestionContrato.view.TabHitosAdicional', {
    extend: 'Ext.panel.Panel',
    title: 'Datos hitos',
    alias: 'widget.tabhitosadicional',
    itemId: 'tabhitosadicional',
    layout: 'border',
    initComponent: function(){
        var me=this;
        this.etiquetas = LangMgr.getLang(this);
        var gridhitos=Ext.create('Ext.grid.Panel',{
            title: 'Hitos',
            flex:1,
            region: 'center',
            itemId: 'gridhitosadicional',
            store: Ext.create('Ext.data.Store',{
                fields: ['numero', 'descripcion', 'moneda', 'monto',  'montototal', 'fechafin', 'meses',
                    'pago', 'vigencia', 'unidadtiempo', 'idhito', 'idarea', 'nombrearea',
                    'indicadores', 'arrayIndicadores', 'idperiodicidad', 'periodicidad', 'fechainicio',
                    'inicial', 'idlineanegocio', 'lineanegocio', 'productoasociado', 'idproductoasociado'
                ],
                data: [],
                listeners:{
                    datachanged: function(yo){
                        yo.getRange().forEach(function(x){
                            if(x.get('indicadores') && x.get('indicadores').length>0 && x.get('indicadores')[0]['productoasociado']){
                                x.set('productoasociado', x.get('indicadores')[0]['productoasociado']);
                                x.set('idproductoasociado', x.get('indicadores')[0]['idproductoasociado']);
                            }
                        });
                    }
                }
            }),
            columns:[
                {
                    text: me.etiquetas.lbNumber,
                    // xtype: 'templatecolumn',
                    minWidth: 48,
                    width: 48,
                    dataIndex: 'numero'
                    // tpl: new Ext.XTemplate('<div>{numero}</div>')
                }, {
                    text: me.etiquetas.lbDescripcion,
                    minWidth: 35,
                    flex: 1,
                    dataIndex: 'descripcion',
                    renderer: function(value, meta){
                        if(value)meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: 'Servicio',
                    flex:1,
                    minWidth: 40,
                    dataIndex: 'indicadores',
                    renderer: function(valor, meta){
                        var result='';
                        if(valor && valor.length>0){
                            result=valor[0]['denominacion'];
                            meta.tdAttr = 'data-qtip="' + result + '"';
                        }
                        return result;
                    }
                },
                {
                    text: 'Producto',
                    flex: 1,
                    dataIndex: 'productoasociado',
                    renderer: function(valor, meta){
                        // var result='';
                        // console.log('y entonces', valor.length)
                        // if(valor && valor.length>0){
                        //     result=valor[0]['productoasociado'];
                        //     meta.tdAttr = 'data-qtip="' + result + '"';
                        // }
                        // return result;
                        if(valor)meta.tdAttr = 'data-qtip="' + valor + '"';
                        return valor;
                    }
                },
                {
                    text: 'Linea de negocio',
                    flex: 1,
                    dataIndex: 'lineanegocio',
                    renderer: function(value, meta){
                        if(value)meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }
            ],
            selModel: Ext.create('Ext.selection.CheckboxModel',{
                listeners: {
                    // beforeselect: function(){
                    //     if(me.)
                    // },
                    selectionchange: function(sm, records){
                        me.down('#paneladicionalhitos').setDisabled(records.length==0);
                        me.limpiarValores();
                        console.log('select', records[0].get('productoasociado'), records)
                        if(records.length==1) {
                            me.down('#paneladicionalhitos').getForm().loadRecord(records[0]);
                            me.down('#productoasociado').setValue(records[0].get('productoasociado'));
                            me.down('#idproductoasociado').setValue(records[0].get('idproductoasociado'));
                            if(records[0].get('idlineanegocio'))
                                me.down('#seleccionarproducto').idnaturaleza=records[0].get('idlineanegocio');
                            me.down('#fieldsetproductoasociado').setDisabled(records[0].get('indicadores').length==0 || !records[0].get('idlineanegocio'));
                        }else if(records.length>1){
                            // me.down('#paneladicionalhitos').getForm().reset();
                            var finded=records.some(function(x){return x.get('indicadores').length==0;});
                            // console.log('>1', finded)
                            // me.down('#fieldsetproductoasociado').setDisabled(finded);
                        }else{
                            // me.down('#paneladicionalhitos').getForm().reset(true);
                        }
                    }
                }
            })
        });
        var paneladicional=Ext.create('Ext.form.Panel',{
            title: 'Información adicional',
            itemId: 'paneladicionalhitos',
            bodyStyle: 'background:#DFE9F6;',
            trackResetOnLoad: true,
            // flex:1,
            region: 'south',
            layout: 'hbox',
            disabled: true,
            items:[
                Ext.create('Ext.form.field.Hidden', {
                    itemId: 'idlineanegocio',
                    name: 'idlineanegocio'
                }),
                // Ext.create('Ext.ux.CmbSelectField', {
                Ext.create('Ext.form.ComboBox', {
                    fieldLabel: 'Linea de negocio',
                    labelAlign: 'top',
                    // fieldLabel: me.context == "proveedor" ? me.etiquetas.lbOrganismo:me.etiquetas.lbEsquema,
                    itemId: 'lineanegocio',
                    name: 'lineanegocio',
                    mapping: 'NomLineaNegocio.denominacion',
                    // localId: 'idlineanegocio',
                    module: 'Nomencladores',
                    // allowBlank: false,
                    gen: 'f',
                    filters: {},
                    //disabled: true,
                    flex: 2,
                    margin: '10 5 10 10',
                    pageSize: 20,
                    valueField: 'idnaturaleza',
                    displayField: 'denominacion',
                    queryParam: 'denominacion',
                    // forceSelection: true,
                    store: Ext.create('Ext.data.Store',{
                        fields:['idnaturaleza', 'denominacion'],
                        proxy: {
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'cargarNaturalezas'}, ModuleMgr.get('GestionContrato')),
                            actionMethods: {
                                read: 'POST'
                            },
                            reader: {
                                root: 'data',
                                totalProperty: 'total',
                                successProperty: 'success'
                            }
                        },
                        pageSize: 20
                    }),
                    listeners:{
                        select: function(yo, records){
                            if(yo.getValue()){
                                var seleccionado=me.down('#gridhitosadicional').getSelectionModel().getSelection();
                                me.down('#idlineanegocio').setValue(records[0].get('idnaturaleza'));
                                with(me.down('#fieldsetproductoasociado')){
                                    setDisabled(seleccionado[0].get('indicadores').length==0);
                                    down('#productoasociado').setValue('');
                                    down('#idproductoasociado').setValue('');
                                    // down('#seleccionarproducto').setDisabled(seleccionado[0].get('indicadores').length==0);
                                    // down('#limpiarproducto').setDisabled(seleccionado[0].get('indicadores').length==0);
                                    down('#seleccionarproducto').idnaturaleza=records[0].get('idnaturaleza');
                                }
                            }
                            // me.down('#idlineanegocio').setValue(records[0].get('idlineanegocio'))
                        },
                        change: function(yo, value){
                            // console.log('value', value)
                            if(!value || value==''){
                                me.down('#idlineanegocio').setValue('');
                                // me.down('#fieldsetproductoasociado').setDisabled(true)
                                with(me.down('#fieldsetproductoasociado')){
                                    setDisabled(true);
                                    down('#productoasociado').setValue('');
                                    down('#idproductoasociado').setValue('');
                                    // down('#seleccionarproducto').setDisabled(true);
                                    // down('#limpiarproducto').setDisabled(true);
                                }
                            }
                        }
                    }
                }),
                {
                    xtype: 'fieldset',
                    title: 'Producto asociado',
                    itemId: 'fieldsetproductoasociado',
                    margin: '5 10 10 5',
                    flex:3,
                    layout: 'hbox',
                    disabled: true,
                    items:[
                        Ext.create('Ext.form.field.Hidden', {
                            itemId: 'idproductoasociado',
                            name: 'idproductoasociado'
                        }),
                        {
                            xtype: 'textfield',
                            itemId: 'productoasociado',
                            name: 'productoasociado',
                            flex:1,
                            readOnly: true,
                            margin: '5 0 10 0'
                        },
                        {
                            xtype: 'button',
                            text: 'Seleccionar',
                            itemId: 'seleccionarproducto',
                            tooltip: 'Seleccionar producto asociado al servicio',
                            iconCls: 'aceptar',
                            // action: 'addprod',
                            margin: '5 0 10 0',
                            handler: function() {
                                if(!me.winProducto) {
                                    // console.log('no existe')
                                    me.winProducto = Ext.create('GestionContrato.view.FormaPago.Producto.WindowProducto', {
                                        title: me.etiquetas.titleSelecProducto,
                                        btnApply: false,
                                        height: window.innerHeight * 0.90,
                                        width: window.innerWidth * 0.8,
                                        // closeAction: 'destroy',
                                        withDatosAdicionales: false,
                                        itemId: 'winproductoasociado',
                                        // filtros: {},
                                        listeners: {
                                            close: function (yo) {
                                                yo.grid.getSelectionModel().deselectAll();
                                            }
                                        }
                                        // gridproducto: myButton.up('gridpanel')
                                    });
                                    me.winProducto.show(null, function () {
                                        // me.winProducto.btnAplicar.setVisible(false);
                                        me.winProducto.btnAceptar.action = null;
                                        // console.log('me.winProducto:', me.winProducto)
                                        me.winProducto.btnAceptar.setHandler(function () {
                                            var gridproductos = me.winProducto.grid,
                                                seleccion = gridproductos.getSelectionModel().getSelection();
                                            if (seleccion.length == 1) {
                                                me.down('#productoasociado').setValue(seleccion[0].get('denominacion'));
                                                me.down('#idproductoasociado').setValue(seleccion[0].get('idindicador'));
                                                me.winProducto.close();
                                            } else {
                                                mostrarMensaje(8, 'Debe haber seleccionado un producto.')
                                            }
                                        })
                                    });
                                } else {
                                    me.winProducto.show();
                                }
                                // with (me.winProducto.grid.getStore()) {
                                    var storeP=me.winProducto.grid.getStore();
                                    if(!storeP.proxy.extraParams.idnaturaleza || (storeP.proxy.extraParams.idnaturaleza &&
                                        storeP.proxy.extraParams.idnaturaleza!=me.down('#seleccionarproducto').idnaturaleza)){
                                        // if (storeP.isLoading()) {
                                        //     Ext.Ajax.abort(storeP.proxy.activeRequest);
                                        //     delete storeP.proxy.activeRequest;
                                        // }
                                        storeP.proxy.extraParams.idnaturaleza=me.down('#seleccionarproducto').idnaturaleza;
                                        storeP.load();
                                        // console.log('idnaturaleza:', me.down('#seleccionarproducto').idnaturaleza)
                                    }

                                // }
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Limpiar',
                            itemId: 'limpiarproducto',
                            tooltip: 'Limpiar producto seleccionado',
                            iconCls: 'limpiar',
                            margin: '5 0 10 0',
                            handler: function(){
                                me.down('#productoasociado').setValue('');
                                me.down('#idproductoasociado').setValue('');
                            }
                        },
                    ]
                },

                {
                    xtype: 'button',
                    text: 'Guardar',
                    tooltip: 'Guardar datos a hito',
                    iconCls: 'aceptar',
                    itemId: 'guardardatoshito',
                    disabled: true,
                    margin: '28 5 0 0',
                    handler: function(){
                        // console.log(me.down('#paneladicionalhitos').query('[name]'));
                        me.down('#gridhitosadicional').getSelectionModel().getSelection().forEach(function(x){
                            with(x){
                                // me.down('#paneladicionalhitos').query('[name]').forEach(function(x) {
                                //     set(x.name, x.getValue());
                                //     x.resetOriginalValue();
                                // });
                                set('idlineanegocio', me.down('#idlineanegocio').getValue());
                                set('lineanegocio', me.down('#lineanegocio').getRawValue());
                                set('idproductoasociado', me.down('#idproductoasociado').getValue());
                                set('productoasociado', me.down('#productoasociado').getValue());
                                if(get('indicadores') && get('indicadores').length>0){
                                    indicadores=get('indicadores');
                                    indicadores[0]['idproductoasociado']=me.down('#idproductoasociado').getValue();
                                    indicadores[0]['productoasociado']=me.down('#productoasociado').getValue();
                                    set('indicadores', indicadores);
                                    if(me.down('#idproductoasociado').getValue()){
                                        set('arrayIndicadores', {modificados: indicadores,eliminados:[]})
                                    }else{
                                        set('arrayIndicadores', '');
                                    }
                                }
                                me.down('#gridhitosadicional').getStore().fireEvent('update', me.down('#gridhitosadicional').getStore(), this);
                            }
                            me.down('#idlineanegocio').resetOriginalValue();
                            me.down('#lineanegocio').resetOriginalValue();
                            me.down('#idproductoasociado').resetOriginalValue();
                            me.down('#productoasociado').resetOriginalValue();
                        })

                        // console.log(me.down('#gridhitosadicional').getSelectionModel().getSelection()[0])
                        // me.down('#guardardatoshito').setDisabled(true);
                    }
                }
            ],
            listeners:{
                dirtychange: function(form, dirty){
                    // console.log('is dirty yeah', dirty)
                    me.down('#guardardatoshito').setDisabled(!dirty);
                }
            }
        });
        me.items=[gridhitos, paneladicional];

        me.callParent();
    },
    limpiarValores: function(){
        var me=this;
        me.down('#idlineanegocio').setValue('');
        me.down('#lineanegocio').setValue('');
        me.down('#idproductoasociado').setValue('');
        me.down('#productoasociado').setValue('');
    }
});