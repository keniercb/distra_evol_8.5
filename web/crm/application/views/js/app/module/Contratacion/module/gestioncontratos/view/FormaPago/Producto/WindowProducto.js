Ext.define('GestionContrato.view.FormaPago.Producto.WindowProducto', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowproducto',
    autoScroll: false,
    maximizable: true,
    refhelp: '',
    layout: 'border',
    height: 670,
    width: 700,
    planificacion: false,
    btnApply:true,
    action:'add',
    closeAction: 'hide',
    withDatosAdicionales: true,
    storeId: 'stProducto',
    initComponent: function () {
        this.createInitialConfig();

        this.callParent();
    },
    createInitialConfig: function () {
        var me = this,
            bodyHeight = Ext.getBody().dom.offsetHeight;

        this.height = this.height >= bodyHeight ? bodyHeight - 20 : this.height;

        this.etiquetas = LangMgr.getLang(this);

        // this.title = 'Seleccionar';
        this.title = this.etiquetas.titleSelecProd;
        // this.action = 'select';

        me.store = Ext.create('GestionContrato.store.Producto', {
            storeId: me.storeId
            // filters: [{property: 'tipo', value: me.planificacion ? 2 : 1}]
        });

        if(me.filtros)
            me.store.proxy.extraParams=me.filtros;
        me.store.proxy.extraParams.tipo=me.planificacion ? 2 : 1;
        // if(me.idnaturaleza)
        //     me.store.proxy.extraParams.idnaturaleza=me.idnaturaleza;
        me.store.load();

        this.cmbTipoPrecio = new Ext.create('Ext.form.ComboBox', {
            store: Ext.create('GestionContrato.store.TipoPrecio'),
            fieldLabel: me.etiquetas.lbTipoPrecio,
            labelWidth: 75,
            name: 'tipoprecio',
            queryMode: 'local',
            width: 320,
            valueField: 'idtipoprecio',
            displayField: 'denominacion',
            typeAhead: true
        });

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            itemId: 'searchfield',
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            first: true
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            multiSelect: true,
            selType: 'checkboxmodel',
            region:'center',
            plugins:[
                Ext.create('CRM.plugins.ResaltarFiltrosPlugin',{
                    campos: [{
                        'itemId': 'searchfield',
                        'dataIndex': ['denominacion'],
                        // 'color': '#e6d083'
                    }]
                })
            ],
            columns: [
                {
                    text: this.etiquetas.lbCodigoProveedor,
                    dataIndex: 'codigoproveedor',
                },
                {
                    text: this.etiquetas.lbName,
                    dataIndex: 'denominacion',
                    flex: 1
                }, {
                    text: 'CUP',
                    dataIndex: 'precio',
                    width:100,
                    renderer: function (value) {
                        return Ext.util.Format.currency(value);
                    }
                }, {
                    text: 'CUC',
                    dataIndex: 'preciodivisa',
                    width:100,
                    renderer: function (value) {
                        return Ext.util.Format.currency(value);
                    }
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    enableOverflow: true,
                    items: [
                        this.cmbTipoPrecio,
                        '->',
                        this.searchfield
                    ]
                },
                {
                    xtype: 'pagingtoolbar',
                    store: me.store,
                    pageNumb: true,
                    dock: 'bottom',
                    displayInfo: true
                }
            ]
        });
        var items = [me.grid];
        if(me.withDatosAdicionales){
            me.datosAdicionales=Ext.create('Ext.form.Panel',{
                title:'Adicionar datos adicionales',
                // collapsible:true,
                collapsed:true,
                // height:300,
                region:'south',
                layout:'column',
                defaults:{
                    margin: 5,
                    columnWidth: 0.5
                },
                items:[

                ]
            });
            me.grid.selModel.on('selectionchange', function(yo, select){
                me.datosAdicionales.removeAll();
                me.datosAdicionales.collapse();
                if(select.length==1) {
                    if (select[0].get('arridtablas') && select[0].get('arridtablas') != '-1,-1,-1,-1') {
                        me.datosAdicionales.maskL = new Ext.LoadMask(me.el, {
                            msg: 'Cargando datos adicionales'
                        });
                        me.datosAdicionales.maskL.show();
                        me.peticion = Ext.Ajax.request({
                            method: "POST",
                            url: UtilsFn.buildUrl({action: 'obtenerAtributosVehiculos'}, ModuleMgr.get('GestionContrato')),
                            scope: this,
                            params: {
                                arridtablas: select[0].get('arridtablas'),
                                idindicador: select[0].get('idindicador')
                            },
                            callback: function (options, success, response) {
                                if(me.datosAdicionales.maskL)me.datosAdicionales.maskL.hide();
                                var datos = Ext.decode(response.responseText);
                                if (datos.length > 0) {
                                    me.datosAdicionales.expand();

                                    //NUEVA FORMA

                                    Ext.each(datos, function (value, index) {
                                        var aux=value.codigoui.split('({'),
                                            aux2=aux[0].split('.'),
                                            tipo=aux2[aux2.length-1],
                                            campo=Ext.decode('{'+aux[1].split(');')[0]);
                                        switch(tipo){
                                            case 'TextField':
                                                campo.xtype='textfield';
                                                break;
                                            case 'NumberField':
                                                campo.xtype='numberfield';
                                                break;
                                            case 'ComboBox':
                                                campo.xtype='combo';
                                                break;
                                            case 'Checkbox':
                                                campo.xtype='checkbox';
                                                break;
                                            default:
                                                campo.xtype='textfield';
                                        }
                                        campo.name=value.nombre;
                                        campo.labelAlign='top';
                                        if (campo.xtype == 'combo') {
                                            campo.mode='local';
                                            campo.lazyRender=true;
                                            campo.typeAhead=true;
                                            campo.triggerAction='all';
                                            campo.editable=false;
                                            var tupla=campo;
                                            var str = tupla.store.replace("new Ext.data.JsonStore({", '');
                                            str = str.replace("})", '');

                                            var config = Ext.decode("{" + str + "}");

                                            var _data = Array();
                                            var _fields = Array();

                                            for (var i = 0; i < config.data.length; i++) {
                                                var _subData = Array();

                                                for (var key in config.data[i]) {
                                                    _subData.push(config.data[i][key]);
                                                }

                                                if (_subData.length > 0) {
                                                    _data.push(_subData.reverse());
                                                }
                                            }

                                            var store = new Ext.data.SimpleStore({
                                                fields: config.fields,
                                                data: _data
                                            });
                                            campo.store=store;
                                        }
                                        me.datosAdicionales.add(campo);
                                    });
                                    var aux=me.gridproducto.getStore().findRecord('idindicador', select[0].get('idindicador'));
                                    if(aux){
                                        var jsondato=aux.get('datos_json');
                                        if(typeof jsondato =='string') {
                                            jsondato = Ext.decode(jsondato);
                                        }
                                        var dato={getData:function(){return jsondato}};
                                        me.datosAdicionales.getForm().loadRecord(dato);
                                    }
                                }
                            }
                        });
                    }
                }
            });
            items.push(me.datosAdicionales);
        }



        // me.items = [me.grid, me.datosAdicionales];
        // if(me.withDatosAdicionales)me.add(me.datosAdicionales)
        me.items=items;

        // this.cmbTipoPrecio = new Ext.create('Ext.form.ComboBox', {
        //     store: Ext.create('GestionContrato.store.TipoPrecio'),
        //     fieldLabel: me.etiquetas.lbTipoPrecio,
        //     labelWidth: 75,
        //     name: 'tipoprecio',
        //     queryMode: 'local',
        //     width: 320,
        //     valueField: 'idtipoprecio',
        //     displayField: 'denominacion',
        //     typeAhead: true
        // });
        //
        // this.searchfield = Ext.create('Ext.ux.SearchField', {
        //     itemId: 'searchfield',
        //     flex: 1,
        //     maxWidth: 250,
        //     minWidth: 150,
        //     first: true
        // });

        // this.tbar = Ext.create('Ext.toolbar.Toolbar', {
        //     enableOverflow: true,
        //     items: [
        //         this.cmbTipoPrecio,
        //         '->',
        //         this.searchfield
        //     ]
        // });
    },
    rendererClasificacion: function (value, metadata, record) {
        var icono = 'icondistra-',
            tipo = this.etiquetas.lbProd;
        if (value == 1) {
            icono += 'producto';
        } else {
            icono += 'servicio';
            tipo = this.etiquetas.lbServ;
        }
        metadata.innerCls = icono;
        metadata.tdAttr = 'data-qtip="' + tipo + '"';
    }
});