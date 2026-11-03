Ext.ns('Ext.erp');
Ext.ns('Ext.aft.Conf');
//Panel general
Ext.erp.confsistemamedioactividad = Ext.extend(LOG.util.Panel, {
    panelSistemas: undefined,
    panelActividades: undefined,
    panelMedios: undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'center';
        this.frame = true;
        this.loadMask = true;
        this.idioma = config.idioma;
        this.title = 'Relacionador';
        this.bildComponents();
        Ext.apply(this, {
            tbar:['->',LOG.util.Prototipos.botonAyuda({})],
            layout: 'border',
            items: [
                this.panelSistemas,
                {region: 'center', items: [this.panelMedios, this.panelActividades]}
            ]
        });
        Ext.erp.confsistemamedioactividad.superclass.constructor.call(this, config);
        var _this = this;
        this.on({
            resize: function () {
                var mitad = (_this.getHeight() / 2) - 20;
                _this.panelMedios.setHeight(mitad);
                _this.panelActividades.setHeight(mitad);
            }
        });
        this.panelSistemas.on({
            'setidsitema':function(id){
                _this.panelActividades.setIdnomsistemamedio(id);
                _this.panelMedios.setIdnomsistemamedio(id);
            }
        })
    },
    bildComponents: function () {
        this.panelSistemas = new Ext.aft.Conf.sistemasPanel({idioma: this.idioma});
        this.panelActividades = new Ext.aft.Conf.ActividadesPanel({idioma: this.idioma});
        this.panelMedios = new Ext.aft.Conf.MediosPanel({idioma: this.idioma});
    }
});
//Componentes de sistema
Ext.aft.Conf.sistemasPanel = Ext.extend(LOG.util.Panel, {
    arbolSistemas: undefined,
    btnAdicionar: undefined,
    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'west';
        this.loadMask = true;
        this.title = 'Sistemas';
        this.idioma = config.idioma;
        //this.collapsible=true;
        this.width = 200;
        this.bindComponents();
        this.bildArbol();
        Ext.apply(this, {
            tbar: [this.btnAdicionar, '-', this.btnEliminar],
            labelAlign: 'top',
            width: 255,
            minSize: 255,
            maxSize: 500,
            frame: true,
            layout: 'border',
            margins: '0 2 0 0',
            animate: false,
            border: true,
            split: true,
            items: [this.arbolSistemas]
        });
        Ext.aft.Conf.sistemasPanel.superclass.constructor.call(this, config);
        this.addEvents('setidsitema');

    },
    bildArbol: function () {
        var _this = this;
        Ext.tree.TreeNodeUICheckHideShow = Ext.extend(Ext.tree.TreeNodeUI, {
            toggleVisibleCheckbox: function (state) {
                this.checkbox.visible = state;
                Ext.DomHelper.applyStyles(this.checkbox, {visibility: 'hidden', display: 'none'});
            }
        });
        this.arbolSistemas = new Ext.tree.TreePanel({
            useArrows: true,
            border: false,
            bodyBorder: false,
            region: 'center',
            containerRegion: 'west',
            enableDD: true,
            autoScroll: true,
            style: 'margin: 2 2 2 2',
            frame: true,
            layout: 'fit',
            bodyStyle: 'background-color: white',
            change: false,
            split: true,
            loader: new Ext.tree.TreeLoader({
                dataUrl: '/logistica/activos_fijos/configuracion/index.php/confsistemamedioactividad/cargarSistema',
                uiProviders: {
                    'ui': Ext.tree.TreeNodeUICheckHideShow
                },
                listeners: {
                    //'beforeload': function (atreeloader, anode, obj) {
                    //    atreeloader.baseParams = {};
                    //    atreeloader.baseParams.nivel = (anode.isRoot)?3:4;
                    //    atreeloader.baseParams.arbol = 1;
                    //},
                    //'load': function(loader, node, respo){
                    //    if(node.attributes.checked){
                    //        Ext.each( node.childNodes, function(hijo){
                    //            hijo.attributes.checked = true;
                    //            hijo.getUI().toggleCheck(true);
                    //            if(_this.esta(hijo, _this.listaSeleccionados)==-1){
                    //                _this.listaSeleccionados.add(hijo);
                    //            }
                    //        });
                    //    }
                    //}
                }
            }),
            listeners: {
                'click': function (node, e) {
                    _this.nodoSeleccionado = node;
                    if (node.getDepth() == 0) {
                        _this.btnAdicionar.enable();
                        _this.btnEliminar.disable();
                        _this.fireEvent('setidsitema',null);
                    }
                    else {
                        _this.btnAdicionar.disable();
                        _this.btnEliminar.enable();
                        _this.fireEvent('setidsitema',node.attributes.idnomsistemamedio);
                    }
                },
                expandnode:function(nd){
                    _this.nodoSeleccionado = undefined;
                    _this.btnAdicionar.disable();
                    _this.btnEliminar.disable();
                    _this.fireEvent('setidsitema',null);
                }
            }
        });
       this.recargarArbol();
    },
    bindComponents: function () {
        var _this = this;
        this.modelo = new Ext.aft.Conf.SistemasModel({idioma:this.idioma});
        this.btnAdicionar = new LOG.util.Prototipos.botonAdicionar({
            tooltip: 'Adicionar sistema',
            disabled: true,
            handler: function () {
                var add = new Ext.aft.Conf.AdicionarSistemaWindow({
                    height: 100,
                    width: 400,
                    title: _this.idioma.tlAdicionarSistemas,
                    idioma: _this.idioma
                });
                add.show();
                add.aceptarFn = function(){
                    var denomina = add.getDenominacion();
                    _this.modelo.adicionarSistema({denominacion:denomina},function(val){
                       _this.recargarArbol();
                    })
                }
            }
        });
        this.btnEliminar = new LOG.util.Prototipos.botonEliminar({
            tooltip: 'Eliminar sistema',
            disabled: true,
            handler:function(){
                _this.modelo.eliminarSistema({
                    iddatsistemamedioentidad:_this.nodoSeleccionado.id,
                        idnomsistemamedio: _this.nodoSeleccionado.attributes.idnomsistemamedio},
                    function(value){
                    _this.recargarArbol();
                });
            }
        });
    },
    recargarArbol: function(){
        var padreArbolSistemas = new Ext.tree.AsyncTreeNode({
            text: 'Sistema',
            expandable: true,
            expanded: true,
            animate: true,
            id: 0
        });
        this.arbolSistemas.setRootNode(padreArbolSistemas);
        this.arbolSistemas.getRootNode().expand();
    }
});
Ext.aft.Conf.AdicionarSistemaWindow = Ext.extend(LOG.util.Window, {
    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'center';
        this.frame = true;
        this.loadMask = true;
        this.idioma = config.idioma;
        this.resizable = false;
        this.bildComponents();
        Ext.apply(this, {
            items: [new LOG.util.UIManager.initForm({region: 'center', frame: true, items: [this.tfDenominacion]})]
        });
        Ext.aft.Conf.AdicionarSistemaWindow.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable()
    },
    bildComponents: function () {
        var _this = this;
        this.tfDenominacion = new LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank:false,
            enableKeyEvents:true,
            listeners:{
                keyup : function(){
                    if(this.isValid()){
                        _this.listaBotones.getItem(2).enable()
                    }
                    else  _this.listaBotones.getItem(2).disable();
                }
            }
        });
    },
    getDenominacion:function(){
        return this.tfDenominacion.getValue();
    }
});
//Componentes de medios
Ext.aft.Conf.MediosPanel = Ext.extend(LOG.util.Panel, {
    gridMedios: undefined,
    vistaMedios: undefined,
    idioma: undefined,
    modelo:undefined,
    idnomsistemamedio:undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'nort';
        this.frame = true;
        this.loadMask = true;
        this.title = 'Medio';
        this.idioma = config.idioma;
        this.modelo = new Ext.aft.Conf.SistemasModel({idioma:this.idioma});
        this.bildComponents();
        this.vistaMedios = this.gridMedios.view();
        Ext.apply(this, {
            items: [this.vistaMedios]
        });
        Ext.aft.Conf.MediosPanel.superclass.constructor.call(this, config);
        var _this = this;
        this.on({
            resize: function () {
                _this.vistaMedios.setHeight(_this.getHeight() - 40);
            }
        })
    },
    bildComponents: function () {
        this.gridMedios = new Ext.aft.Conf.gridMediosSis({idioma: this.idioma, modelo:this.modelo});
        this.gridMedios.init();
    },
    setIdnomsistemamedio:function(id){
        this.idnomsistemamedio = id;
        this.gridMedios.setIdnomsistemamedio(id);
    }
});
Ext.aft.Conf.gridMediosSis = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.dirController = '/logistica/activos_fijos/configuracion/index.php/confsistemamedioactividad';
        this.urlBusquedaGridPrincipal = 'cargarMediosSistema';
        Ext.aft.Conf.gridMediosSis.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: this.idioma.cgCodigo,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgDenominacion,
            id: 'denominacionMed',
            default: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: LOG.util.Idioma.lbBtnAdicionar || this.idioma.lbBtnAdicionar,
            tooltip: this.idioma.ttBtnAdicionarMedios,
            handler: function () {
                var select = new Ext.aft.Conf.gridMediosSis({
                    formaVisualizacion: 'ventana',
                    idioma: _this.idioma,
                    autoLoad: true,
                    panelBotonesVisible: false,
                    usarAplicar: false,
                    dirController: '/logistica/activos_fijos/configuracion/index.php/confsistemamedioactividad',
                    urlBusquedaGridPrincipal: 'cargarMedios',
                    initDefaultButtons: function () {
                    }
                });
                select.init();
                select.view();
                select.getVistaPrincipal().setHeight(400);
                select.getVistaPrincipal().setWidth(600);
                select.getVistaPrincipal().listaBotones.getItem(1).hide();
                select.getVistaPrincipal().setTitle(_this.idioma.tlSeleccionarMedios);
                select.getVistaPrincipal().aceptarFn = function () {
                    var records = select.getSmPrincipal().getSelections();
                    var aux = new Array();
                    Ext.each(records, function(rec){
                        aux.push(rec.data.idindicador);
                    });
                    _this.modelo.adicionarMedio({medios:aux, idnomsistemamedio:_this.idnomsistemamedio},
                        function(val){
                            _this.getStorePrincipal().load();
                        }
                    );
                }

            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'eliminar',
                text: LOG.util.Idioma.lbBtnEliminar,
                tooltip: this.idioma.ttBtnEliminarMedios,
                handler: function () {
                    var records = _this.getSmPrincipal().getSelections();
                    var aux = new Array();
                    Ext.each(records, function (record) {
                        aux.push(record.data.idindicador);
                    });
                    _this.modelo.eliminarMedio({idindicador:Ext.encode(aux),
                            idnomsistemamedio:_this.idnomsistemamedio},
                        function(val){
                            _this.getStorePrincipal().load();
                        })
                },
                controlFn: function (b, _caller) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if(_this.idnomsistemamedio) {
                            if (e == 'rowselect') {
                                b.enable();
                            }
                            if (e == 'rowdeselect' && this.getCount() == 0) {
                                b.disable();
                            }
                        }
                    });
                }
            })
        );
    },
    render: function () {
        var _this = this;
        var render = Ext.aft.Conf.gridMediosSis.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'denominacionMed';
        this.getStorePrincipal().on({
            'beforeload':function(st){
                st.initBaseParams = {idnomsistemamedio:_this.idnomsistemamedio}
            }
        })
        return render;
    },
    setIdnomsistemamedio:function(id){
        this.idnomsistemamedio = id;
        if(id){
            this.listaBotones.getItem(0).enable();
        }
        else {
            this.listaBotones.getItem(0).disable();
            this.listaBotones.getItem(1).disable();
        }
        this.getStorePrincipal().load();
    }
});
//Componentes de actividad
Ext.aft.Conf.ActividadesPanel = Ext.extend(LOG.util.Panel, {
    idioma: undefined,
    vistaActividades: undefined,
    gridActividades: undefined,
    modelo:undefined,
    idnomsistemamedio:undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'center';
        this.frame = true;
        this.loadMask = true;
        this.idioma = config.idioma;
        this.title = 'Actividades';
        this.modelo = new Ext.aft.Conf.SistemasModel({idioma:this.idioma});
        this.bildComponents();
        this.vistaActividades = this.gridActividades.view();
        this.vistaActividades.setHeight(400);
        Ext.apply(this, {
            items: [this.vistaActividades]
        });
        Ext.aft.Conf.ActividadesPanel.superclass.constructor.call(this, config);
        this.on({
            resize: function () {
                _this.vistaActividades.setHeight(_this.getHeight() - 40);
            }
        });
    },
    bildComponents: function () {
        this.gridActividades = new Ext.aft.Conf.gridActividadesSis({idioma: this.idioma, modelo:this.modelo});
        this.gridActividades.init();
    },
    setIdnomsistemamedio:function(id){
        this.idnomsistemamedio = id;
        this.gridActividades.setIdnomsistemamedio(id);
    }
});
Ext.aft.Conf.gridActividadesSis = Ext.extend(LOG.util.UITemplate, {
    idnomsistemamedio:undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        this.autoLoad = false;
        this.dirController = '/logistica/activos_fijos/configuracion/index.php/confsistemamedioactividad';
        this.urlBusquedaGridPrincipal = 'cargarActividadesSistema';
        Ext.aft.Conf.gridActividadesSis.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idconfactividadsistemamedio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idactividad',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgDenominacion,
            id: 'denominacionActv',
            default: true
        });

    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: this.idioma.lbBtnAdicionar,
            tooltip: this.idioma.ttBtnAdicionarActvidades,
            disabled: true,
            handler: function () {
                var select = new Ext.aft.Conf.gridActividadesSis({
                    formaVisualizacion: 'ventana',
                    idioma: _this.idioma,
                    autoLoad: true,
                    panelBotonesVisible: false,
                    usarAplicar: false,
                    dirController: '/logistica/activos_fijos/configuracion/index.php/confsistemamedioactividad',
                    urlBusquedaGridPrincipal: 'cargarActividades',
                    initDefaultButtons: function () {
                    }
                });
                select.init();
                select.view();
                select.getVistaPrincipal().setHeight(400);
                select.getVistaPrincipal().setWidth(600);
                select.getVistaPrincipal().listaBotones.getItem(1).hide();
                select.getVistaPrincipal().setTitle(_this.idioma.tlSelecionarActividades);
                select.getVistaPrincipal().aceptarFn = function () {
                    var records = select.getSmPrincipal().getSelections();
                    var aux = new Array();
                    Ext.each(records, function(rec){
                        aux.push(rec.data.idactividad);
                    });
                    _this.modelo.adicionarActividad({actividades:aux, idnomsistemamedio:_this.idnomsistemamedio},
                        function(val){
                        _this.getStorePrincipal().load();
                    });
                }
            }
        }));
        this.addToolbarButton(new Ext.Button({
                tooltip: this.idioma.ttBtnEliminarActvidades,
                iconCls: 'eliminar',
                text: this.idioma.lbBtnEliminar,
                disabled: true,
                handler: function () {
                    var records = _this.getSmPrincipal().getSelections();
                    var aux = new Array();
                    Ext.each(records, function (record) {
                        aux.push(record.data.idactividad);
                    });
                    _this.modelo.eliminarActividad({idactividad:Ext.encode(aux),
                            idnomsistemamedio:_this.idnomsistemamedio},
                    function(val){
                        _this.getStorePrincipal().load();
                    })
                },
                controlFn: function (b, _caller) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if(_this.idnomsistemamedio) {
                            if (e == 'rowselect') {
                                b.enable();
                            }
                            if (e == 'rowdeselect' && this.getCount() == 0) {
                                b.disable();
                            }
                        }
                    });
                }
            })
        );

    },
    render: function () {
        var _this = this;
        var render = Ext.aft.Conf.gridMediosSis.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'denominacionActv';
        this.getStorePrincipal().on({
            'beforeload':function(st){
                st.initBaseParams = {idnomsistemamedio:_this.idnomsistemamedio}
            }
        });
        return render;
    },
    setIdnomsistemamedio:function(id){
        this.idnomsistemamedio = id;
        if(id){
            this.listaBotones.getItem(0).enable();
        }
        else {
            this.listaBotones.getItem(0).disable();
            this.listaBotones.getItem(1).disable();
        }
        this.getStorePrincipal().load();
    }
});

//Modelo
Ext.aft.Conf.SistemasModel =  Ext.extend(LOG.util.Model , {
    urlAccionAdicionarSistemas:undefined,
    urlAccionEliminarSistemas:undefined,
    urlAccionAdicionarActividades:undefined,
    urlAccionEliminarActividades:undefined,
    urlAccionAdicionarMedios:undefined,
    urlAccionEliminarMedios:undefined,
    constructor: function (config) {
        config.urlController = '/logistica/activos_fijos/configuracion/index.php/confsistemamedioactividad';
        this.urlAccionAdicionarSistemas = '/adicionarSistema';
        this.urlAccionEliminarSistemas = '/eliminarSistema';
        this.urlAccionAdicionarActividades = '/adicionarActividades';
        this.urlAccionEliminarActividades = '/eliminarActividades';
        this.urlAccionAdicionarMedios = '/adicionarMedios';
        this.urlAccionEliminarMedios = '/eliminarMedios';
        if (!config.fields) {
            config.fields = [];
        }
        Ext.aft.Conf.SistemasModel.superclass.constructor.call(this, config);
    },
    adicionarSistema: function(parametros, _fn, _fnfail) {
        var _this = this;
            Ext.MessageBox.wait(this.idioma.msgAdicionandoSistema, this.idioma.msgEspere || '...');
            var objSubmit = {};
            objSubmit.denominacion = parametros['denominacion'];
            Ext.Ajax.request({
                url: _this.urlController + _this.urlAccionAdicionarSistemas,
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, _this.idioma.lbMsgSistemaSalvado);
                            if (this.st) {
                                _this.st.reload();
                            }
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    } else {
                        if (typeof _fnfail == 'function') {
                            _fnfail.createDelegate(this, [resp]).call();
                        }
                    }
                }.createDelegate(this)
            });
    },
    eliminarSistema: function(parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgEliminarSistema, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoSistema, this.idioma.msgEspere || '...');
                var objSubmit = {};
                objSubmit.iddatsistemamedioentidad =  parametros['iddatsistemamedioentidad'];
                objSubmit.idnomsistemamedio =  parametros['idnomsistemamedio'];
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarSistemas,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgSistemaEliminado);
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    },
    adicionarActividad:function(parametros, _fn, _fnfail) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgAdicionandoActividad, this.idioma.msgEspere || '...');
        var objSubmit = {};
        objSubmit.actividades = Ext.encode(parametros['actividades']);
        objSubmit.idnomsistemamedio =parametros['idnomsistemamedio'];
        Ext.Ajax.request({
            url: _this.urlController + _this.urlAccionAdicionarActividades,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, _this.idioma.lbMsgActividadSalvado);
                        if (this.st) {
                            _this.st.reload();
                        }
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    eliminarActividad: function(parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgEliminarActividades, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoActividad, this.idioma.msgEspere || '...');
                var objSubmit = {};
                objSubmit.idnomsistemamedio =  parametros['idnomsistemamedio'];
                objSubmit.idactividad =  parametros['idactividad'];
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarActividades,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgActividadEliminada);
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    },
    adicionarMedio:function(parametros, _fn, _fnfail) {
        var _this = this;

        Ext.MessageBox.wait(this.idioma.msgAdicionandoMedio, this.idioma.msgEspere || '...');
        var objSubmit = {};
        objSubmit.medios = Ext.encode(parametros['medios']);
        objSubmit.idnomsistemamedio =parametros['idnomsistemamedio'];
        Ext.Ajax.request({
            url: _this.urlController + _this.urlAccionAdicionarMedios,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, _this.idioma.lbMsgMedioSalvado);
                        if (this.st) {
                            _this.st.reload();
                        }
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    eliminarMedio: function(parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgEliminarMedio, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoMedio, this.idioma.msgEspere || '...');
                var objSubmit = {};
                objSubmit.idnomsistemamedio =  parametros['idnomsistemamedio'];
                objSubmit.idindicador =  parametros['idindicador'];
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarMedios,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgMedioEliminado);
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    }
});
