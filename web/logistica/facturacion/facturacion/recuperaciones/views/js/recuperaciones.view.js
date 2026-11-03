Ext.ns('LOG.fac.Recuperaciones');

LOG.fac.Recuperaciones.Vista = Ext.extend(Ext.Viewport, {
    sufijoTab: 'tab',
    layout: 'border',
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        /**
         *  Árbol para la navegación
         */
        this.treeMenu = new Ext.tree.TreePanel({
            title: this.idioma.tlPanel,
            region: 'west',
            id: 'idvpnomencladores',
            width: 280,
            minSize: 175,
            maxSize: 500,
            collapsible: true,
            margins: '0 0 0 0',
            cmargins: '0 0 0 0',
            rootVisible: false,
            lines: false,
            autoScroll: true,
            titleCollapse: true,
            root: new Ext.tree.TreeNode({
                text: '',
                draggable: false,
                expanded: true,
                id: '0'
            })
        });

        /**
         *  Panel central donde se mostrarán los nomencladores correspondientes a
         *  los elementos seleccionados en el menú de la interfaz
         */
        this.panelContenedor = new Ext.TabPanel({
            region: 'center',
            frame: true,
            minTabWidth: 135,
            tabWidth: 210,
            enableTabScroll: true,
            layoutOnTabChange: true,
            id: 'tabPanelCentral'
        });
        this.items = [_this.treeMenu, _this.panelContenedor];
        LOG.fac.Recuperaciones.Vista.superclass.constructor.call(this, arguments);
    },
    /**
     *  NOTA: El id del nodo debe coincidor con el nombre de la clase que
     *        implementa el contenido del tab correpondiente Ej: Si la clase
     *        que implementa el contenido es Ext.erp.naturaleza, el id del
     *        nodo debe ser naturaleza.
     *
     *  @param text             Texto que mostrará el nodo en el árbol menú
     *  @param id               Identificador del nodo
     *  @param urlController    Dirección de la controladora correspondiente al componente
     *                           correspondiente al nodo Ejemplo:
     *                           '/configuracion/nomencladores/index.php/naturaleza/'
     */
    addNodoTree: function (text, id, urlController, deposito, isTemplate) {
        var _this = this;
        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: text,
            id: id,
            iconCls: 'historial',
            urlController: urlController,
            deposito: deposito,
            isTemplate: (isTemplate != undefined) ? isTemplate : true,
            listeners: {
                'click': function (nodo, evento) {
                    _this.selectTab(nodo);
                }
            }
        }));
    },
    /**
     *  Esta función permite seleccionar el componente relacionado a un elemento
     *  del menú, si el elemento esta creado, lo selecciona, sino lo crea y selecciona
     *
     *  @param nodo Elemento del menú
     */
    selectTab: function (nodo) {
        var _this = this;
        var idTab = this.sufijoTab + nodo.id;
        var neededTab = this.panelContenedor.getItem(idTab);
        if (neededTab) {
            this.panelContenedor.activate(neededTab);
        } else {
            _this.addTab(nodo, idTab);
        }
    },
    /*
     *  Crea componente correspondiente a un elemento del menú
     *
     *  @param nodo     Elemento del menú seleccionado
     *  @param idTab    Identificador del nuevo componente a crear ( sufijoTab + idnodo )
     */
    addTab: function (nodo, idTab) {
        var _this = this;
        var tabContenido = new Ext.erp[nodo.id]({});
        if (nodo.attributes.deposito == true) {
            tabContenido.attachPlugin(new LOG.lb.plugin.ComboDepositos());
        }
        if (nodo.attributes.isTemplate == true) {
            tabContenido.init();
            var vista = tabContenido.view();
            vista.setTitle(nodo.text);
            vista.id = idTab;
            vista.closable = true;
            _this.panelContenedor.add(vista).show();
        } else {
            tabContenido.setTitle(nodo.text);
            tabContenido.id = idTab;
            tabContenido.closable = true;
            _this.panelContenedor.add(tabContenido).show();
        }
        _this.doLayout();
    }
});
/**
 *
 */
LOG.fac.Recuperaciones.gdGeneric = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'panel',
    bbarVisible: false,
    autoLoad: false,
    idItem:'',
    expander: false,
    constructor: function (config) {
        this.idioma = config.idioma;
        this.header = config.header;
        this.tltWinAdd = config.tltWinAdd;
        this.type = config.type;
        this.idItem = config.idItem;
        this.bbarVisible = config.bbarVisible || false;
        this.expander = config.expander || false;
        LOG.fac.Recuperaciones.gdGeneric.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        if(this.type == 'productos'){
            this.addGridColumn({
                header: this.idioma.clnCodigo,
                width: 100,
                dataIndex: 'codigo',
                default: true
            });
            if(this.idItem == 'productonat') {
                this.addGridColumn({
                    dataIndex: 'facturas',
                    default: true
                });
                this.addGridColumn({
                    header: this.idioma.clnCodigo +' proveedor',
                    width: 150,
                    dataIndex: 'numeropieza',
                    default: true
                });
                this.addGridColumn({
                    header: 'Naturaleza',
                    width: 200,
                    dataIndex: 'naturaleza',
                    default: true
                });
            }
            this.addGridColumn({
                header: this.idioma.clnDenominacion,
                width: 300,
                dataIndex: 'denominacion',
                default: true,
                autoExpand: true
            });
            this.addGridColumn({
                header: this.idioma.clnUM,
                width: 50,
                dataIndex: 'umedida',
                default: true
            });
            this.addGridColumn({dataIndex: 'idproducto'});
            return;
        }
        if(this.type == 'productospv'){
            this.addGridColumn({
                header: this.idioma.clnDenominacion,
                width: 300,
                dataIndex: 'producto',
                default: true,
                autoExpand: true
            });
            this.addGridColumn({
                header: 'Precio',
                width: 100,
                dataIndex: 'precio',
                default: true
            });
            this.addGridColumn({
                header: 'Precio de venta',
                width: 100,
                dataIndex: 'precioventa',
                default: true
            });
            this.addGridColumn({dataIndex: 'idproducto'});
            return;
        }
        if(this.type == 'servicios') {
            this.addGridColumn({
                header: this.idioma.clnCodigo,
                width: 200,
                dataIndex: 'codigo',
                autoExpand: true,
                default: true
            });
            this.addGridColumn({
                header: this.idioma.clnDenominacion,
                width: 200,
                dataIndex: 'denominacion',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.clnTarifa,
                width: 200,
                dataIndex: 'precio',
                autoExpand: true,
                default: true
            });

            return;
        }
        if(this.type == 'documento') {
            this.addGridColumn({
                dataIndex: 'iddocumento',
                default: true
            });
            this.addGridColumn({
                header: 'No. Documento',
                width: 200,
                dataIndex: 'nrodoc',
                default: true
            });
            this.addGridColumn({
                header: 'Fecha',
                width: 200,
                dataIndex: 'fechacontable',
                default: true
            });

            return;
        } else {
            this.addGridColumn({
                header: this.header,
                width: 200,
                dataIndex: 'nombre',
                autoExpand: true,
                default: true
            });
        }
        this.addGridColumn({dataIndex: 'idclientesproveedores'});
    },

    view: function () {
        var me = this;
        /*LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            handler: function () {
                var list = new LOG.util.List();
                console.info(list.arrayData);
                var selections = me.getSmPrincipal().getSelections();
                var items = me.getStorePrincipal().data.items;
                Ext.each(items, function (record) {
                    list.add(record);
                });
                me.getStorePrincipal().removeAll();
                for (var i = 0, len = items.length; i < len; i++) {
                    for (var j = 0, len2 = list.count(); j < len2; j++) {
                        var item1 = (list.getItem(j).data && list.getItem(j).data.idclientesproveedores) ? list.getItem(j).data.idclientesproveedores : list.getItem(j).data.idproducto;
                        var item2 = items[i].data.idclientesproveedores ? items[i].data.idclientesproveedores : items[i].data.idproducto;
                        if (list.getItem(j) && item1 == item2) {
                            list.delete(i);
                        }
                    }
                }
                me.getStorePrincipal().add(list.getArray());
            }
        });*/

        return LOG.fac.Recuperaciones.gdGeneric.superclass.view.call(this);
    },
    render: function () {
        var me = this;
        if (me.expander) {
            me.addGridPlugin(me.expander);        
        }
        var p = LOG.fac.Recuperaciones.gdGeneric.superclass.render.call(this);
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function (e, sm) {
            var rd = sm.getSelections();
            if(!me.expander){
              if (rd.length > 0) {
                if (e === 'selectionchange') {
                    me.listaBotones.getItem(1).enable();
                }
              } else {
                  me.listaBotones.getItem(1).disable();
              }
            }
        }, 'PANELGENERIC');
        this.getStorePrincipal().on('load', function(st){
            if (st.data.items.length > 0 && (st.data.items[0].json && st.data.items[0].json.facturas)){
                if(me.rowexp == undefined){
                    me.rowexp = true;
                    me.insertGridColumn(me.expander, 0);
                    var listaColumnas = LOG.util.UIManager.proccessColumns(me.listaColumnas, me.getGridPrincipal().getSelectionModel());
                    var columnas = new Ext.grid.ColumnModel(listaColumnas.columns);
                    me.getGridPrincipal().reconfigure(me.getStorePrincipal(), columnas);
                }
            }

        });
        this.getStorePrincipal().idItem = this.idItem;
        return p;
    }
});


LOG.fac.Recuperaciones.gdAddClientTransp = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'ventana',
    constructor: function (config) {
        this.idioma = config.idioma;
        this.header = config.header;
        this.stExterno = config.stExterno;
        this.urlBusquedaGridPrincipal = config.type == 'productos' ? 'cargarProductos' : 'cargarClienteTransportador';
        this.type = config.type;
        LOG.fac.Recuperaciones.gdAddClientTransp.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        if(this.type == 'productos'){
            this.addGridColumn({
                header: this.idioma.clnCodigo,
                width: 200,
                dataIndex: 'codigo',
                autoExpand: true,
                default: true
            });
            this.addGridColumn({
                header: this.idioma.clnCodigoProveedor,
                width: 200,
                dataIndex: 'codigoproveedor',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.clnDenominacion,
                width: 200,
                dataIndex: 'denominacion',
                default: true
            });
            this.addGridColumn({dataIndex: 'idproducto'});
            return;
        }
        this.addGridColumn({
            header: this.header,
            width: 200,
            dataIndex: 'nombre',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({dataIndex: 'idclientesproveedores'});
    },
    view: function () {
        var me = this;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            handler: function () {
                var list = new LOG.util.List();
                var selections = me.getSmPrincipal().getSelections();
                Ext.each(selections, function (record) {
                    list.add(record);
                });
                me.stExterno.add(list.getArray());
                me.getVistaPrincipal().close();
            }
        });
        return LOG.fac.Recuperaciones.gdAddClientTransp.superclass.view.call(this);
    },
    render: function () {
        var p = LOG.fac.Recuperaciones.gdAddClientTransp.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function (e, sm) {
            if(typeof sm != undefined) {
                var rd = sm.getSelections();
                if (rd.length > 0) {
                    if (e === 'selectionchange') {
                        me.getVistaPrincipal().listaBotones.getItem(2).enable();
                    }
                } else {
                    me.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        }, 'WINCLIENTTRANSP');
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e, st, rd) {
            if (e == 'load') {
                var list = new LOG.util.List();
                Ext.each(rd, function (record) {
                    list.add(record);
                });
                st.removeAll();
                var items = me.stExterno.data.items;
                for (var i = 0, len = items.length; i < len; i++) {
                    for (var j = 0, len2 = list.count(); j < len2; j++) {
                        var item1 = (list.getItem(j) && list.getItem(j).data.idclientesproveedores) ? list.getItem(j).data.idclientesproveedores : list.getItem(j).data.idproducto;
                        var item2 = items[i].data.idclientesproveedores ? items[i].data.idclientesproveedores : items[i].data.idproducto;
                        if (list.getItem(j) && item1 == item2) {
                            list.delete(j);
                        }
                    }
                }
                st.add(list.getArray());
                if (list.count() > 0) {
                    me.getSmPrincipal().selectFirstRow();
                }
            }
        }, 'WINCLIENTTRANSP');
        return p;
    }
});

Ext.erp.ventanaClientes = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma =  LOG.fac.Recuperaciones.Idioma;
        config.modoSeleccion = 3;
        config.autoLoad = false;
        config.busquedaBasica = true;
        //this.dirController = '/logistica/utiles/plugin/index.php/sistemasexternos';
        this.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones';
        config.formaVisualizacion = 'ventana';
        config.autoSelect = false;
        config = Ext.apply(_this, config);
        Ext.erp.ventanaClientes.superclass.constructor.call(this, config);
        this.concepto = _this.concepto;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimpleC;

    },
    init: function () {
        var _this = this;
        Ext.erp.ventanaClientes.superclass.init.call(this);
        _this.getVistaPrincipal().width = 700;
        _this.getVistaPrincipal().height = 400;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();


    },
    initDefaultColumns: function () {
        var _this = this;

    },
    render: function () {
        var _this = this;
        var p = Ext.erp.ventanaClientes.superclass.render.call(this);
        _this.getGridPrincipal().toolbars[0].items.items[1].regex = LOG.util.Regex.cadena;
        _this.getGridPrincipal().toolbars[0].items.items[1].invalidText = this.idioma.txtInvalidCliente;
        _this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function(e) {
            if (e == 'selectionchange') {
                if (this.getCount()> 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }else{
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.initBaseParams.tipocliente = _this.tipocliente;
                st.initBaseParams.idclientesproveedores = _this.idclientesproveedores;
                st.baseParams.start = 0;
                st.baseParams.limit = 30;
            }
        });
        return p;
    }
});

Ext.erp.ventanaDocumento = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma =  LOG.fac.Recuperaciones.Idioma;
        config.modoSeleccion = 3;
        config.autoLoad = false;
        config.busquedaBasica = true;
        //this.dirController = '/logistica/utiles/plugin/index.php/sistemasexternos';
        this.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones';
        config.formaVisualizacion = 'ventana';
        config.autoSelect = false;
        this.iddeposito = config.iddeposito;
        config = Ext.apply(_this, config);
        Ext.erp.ventanaDocumento.superclass.constructor.call(this, config);
        this.concepto = _this.concepto;
        _this.textBusquedaSimple = 'No. de documento';

    },
    init: function () {
        var _this = this;
        Ext.erp.ventanaDocumento.superclass.init.call(this);
        _this.getVistaPrincipal().width = 700;
        _this.getVistaPrincipal().height = 400;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();


    },
    initDefaultColumns: function () {
        var _this = this;

    },
    render: function () {
        var _this = this;
        var p = Ext.erp.ventanaDocumento.superclass.render.call(this);
        _this.getGridPrincipal().toolbars[0].items.items[1].regex = LOG.util.Regex.cadena;
        _this.getGridPrincipal().toolbars[0].items.items[1].invalidText = this.idioma.txtInvalidCliente;
        _this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function(e) {
            if (e == 'selectionchange') {
                if (this.getCount()> 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }else{
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.initBaseParams.iddocumentos = _this.iddocumentos;
                st.initBaseParams.iddeposito = _this.iddeposito;
                st.initBaseParams.idsubsistema = LOG.util.Subsistemas.inventario;
                st.baseParams.start = 0;
                st.baseParams.limit = 30;
            }
        });
        return p;
    },
    createComboDeposito: function () {
        var _this = this;
        _this.comboDepositos = new LOG.util.ComboBox({
            editable: false,
            url: '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/cargardepositos',
            hiddenName: 'iddeposito',
            valueField: 'iddeposito',
            displayField: 'deposito',
            mode: 'remote',
            editable: false,
            listeners: {
                select: function (cmb, rd) {
                    _this.getGridPrincipal().getStore().removeAll();
                    _this.getGridPrincipal().getStore().initBaseParams.iddeposito = cmb.getValue();
                    _this.getGridPrincipal().getStore().initBaseParams.idsubsistema = LOG.util.Subsistemas.inventario;
                    _this.getGridPrincipal().getStore().load();
                }
            }
        });
        return {
            border: false,
            tbar: ['-', '->', new Ext.form.Label({text: _this.idioma.cbDepositos}), '&nbsp', _this.comboDepositos]
        };
    }
});
Ext.erp.ventanaOrganismo = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma =  LOG.fac.Recuperaciones.Idioma;
        config.modoSeleccion = 3;
        config.autoLoad = false;
        config.busquedaBasica = true;
        //this.dirController = '/logistica/utiles/plugin/index.php/sistemasexternos';
        this.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones';
        config.formaVisualizacion = 'ventana';
        config.autoSelect = false;
        config = Ext.apply(_this, config);
        Ext.erp.ventanaOrganismo.superclass.constructor.call(this, config);
        this.concepto = _this.concepto;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimpleC;

    },
    init: function () {
        var _this = this;
        Ext.erp.ventanaOrganismo.superclass.init.call(this);
        _this.getVistaPrincipal().width = 700;
        _this.getVistaPrincipal().height = 400;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();


    },
    initDefaultColumns: function () {
        var _this = this;

    },
    // render: function () {
    //     var _this = this;
    //     var p = Ext.erp.ventanaClientes.superclass.render.call(this);
    //     _this.getGridPrincipal().toolbars[0].items.items[1].regex = LOG.util.Regex.cadena;
    //     _this.getGridPrincipal().toolbars[0].items.items[1].invalidText = this.idioma.txtInvalidCliente;
    //     _this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function(e) {
    //         if (e == 'selectionchange') {
    //             if (this.getCount()> 0) {
    //                 _this.getVistaPrincipal().listaBotones.getItem(2).enable();
    //             }else{
    //                 _this.getVistaPrincipal().listaBotones.getItem(2).disable();
    //             }
    //         }
    //     });
    //     _this.getStorePrincipal().on({
    //         'beforeload': function (st) {
    //             st.initBaseParams.tipocliente = _this.tipocliente;
    //             st.initBaseParams.idclientesproveedores = _this.idclientesproveedores;
    //             st.baseParams.start = 0;
    //             st.baseParams.limit = 30;
    //         }
    //     });
    //     return p;
    // }
});



Ext.erp.winServActv = Ext.extend(LOG.util.UITabTemplate, {
    constructor: function(config) {
        this.idioma = config.idioma;
        Ext.erp.winServActv.superclass.constructor.call(this, config);
    }
});

Ext.erp.GridServActiv = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.autoSelect = false;
        this.idseleccionados = config.idseleccionados;
        this.iddocumento = config.iddocumento;
        switch (config.idComponent) {
            case 0:
                this.urlBusquedaGridPrincipal = '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador';
                break;
            case 1:
                this.urlBusquedaGridPrincipal = 'cargarActividades';
                break;
        }
        Ext.erp.GridServActiv.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: (_this.idComponent == 0 )?'idindicador':'idactividad',
            default: true
        });
        if(_this.idComponent == 0){
            this.addGridColumn({
                header: this.idioma.gcHabilitado,
                width: 100,
                dataIndex: 'activo',
                default: true,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'log-activo';
                    } else {
                        metaData.css = 'log-inactivo';
                    }
                    return '';
                }
            });
        }
        this.addGridColumn({
            header: this.idioma.gcCodigo,
            width: 100,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcDenominacion,
            width: 100,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });
        if(_this.idComponent == 1){
            this.addGridColumn({
                header: this.idioma.gcTarifa,
                width: 100,
                dataIndex: 'precio',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcNaturaleza,
                width: 100,
                dataIndex: 'naturaleza',
                default: true
            });
        }

    },
    render: function() {
        var render = Ext.erp.GridServActiv.superclass.render.call(this);
        var _this = this;
        if(_this.idComponent == 0){
            LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
                idEspecialidad: 1,
                tipo: 2,
                activo: 1,
                idseleccionados: _this.idseleccionados,
                grid: 1
            });
        }else{
            LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
                idseleccionados: _this.idseleccionados,
                iddocumento: _this.iddocumento
            });
        }
        this.getStorePrincipal().load();
        return render;
    }
});

