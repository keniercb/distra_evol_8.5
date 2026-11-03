Ext.ns('LOG.aft.documentoPat');
LOG.aft.movimientoPat = Ext.extend(LOG.aft.movimiento, {
    constructor: function(config) {
        var _this = this;  
        _this.tipo = 1;
        LOG.aft.movimientoPat.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {
        var _this = this;
        LOG.aft.movimientoPat.superclass.initDefaultButtons.call(this);
        _this.idioma.lbBtnProductos = 'Ad<u>i</u>cionar medios';
        _this.idioma.lbBtnProductosInm = 'Ad<u>i</u>cionar inmueble';
        _this.idioma.lbBtnProductosObjObra = 'Ad<u>i</u>cionar objeto de obra';
        _this.idioma.lbTtBtnProductosInm = 'Adicionar inmueble(s) al documento';
        _this.idioma.bTtBtnProductosObjObra = 'Adicionar objeto(s) de obra al documento';

        this.btnAdicionarProdObjObra = new LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.lbBtnProductosObjObra,
            tooltip: this.idioma.bTtBtnProductosObjObra,
            setKey:true,
            handler: function() {
                _this.onBtnAdicionarProdClick(natobjobraP);
            },
            controlFn: function(b, _caller) {
                if (_caller._parent.grantedAction('btnAdicionarObjObra')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.insertToolbarButton(_this.btnAdicionarProdObjObra, 1);
        this.btnAdicionarProdInmuebles = new LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.lbBtnProductosInm,
            tooltip: this.idioma.lbTtBtnProductosInm,
            setKey:true,
            handler: function() {
                _this.onBtnAdicionarProdClick(natinmuebleP);
            },
            controlFn: function(b, _caller) {
                if (_caller._parent.grantedAction('btnAdicionarInmuebles')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.insertToolbarButton(_this.btnAdicionarProdInmuebles, 2);  
        Ext.apply(_this.btnAdicionarProd, new LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.lbBtnProductos,
            tooltip: this.idioma.lbTtBtnProductos,
            setKey:true,
            handler: function() {
                //_this.onBtnAdicionarProdClick(natactivosP);
            },
            controlFn: function(b, _caller) {
                if (_caller._parent.grantedAction('btnAdicionarProducto')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }
            }
        }));

    },   
     onBtnAdicionarProdClick: function(idnaturaleza) {
        var _this = this;
        /**/
        if (_this.datos.inventarioTotal || _this.datos.inventarioParcial) {
            var arregloAreas = _this.datos.idareasInventario;
            if (arregloAreas)
                arregloAreas += "," + _this.datos.idarearesp;
            else
                arregloAreas = _this.datos.idarearesp;
            var winProductos = new LOG.lb.producto.View({
                idioma: _this.idioma,
                usarMarcaModelo: true,
                usarFiltroArea: false,
                modoSeleccion: 3, //(seleccionSimple) ? 1 : 3,
                _parent: _this,
                parametros: {
                    idestructura: arregloAreas.split(","),
                    prodareas: true,
                    idseleccionados: new Array(),
                    idnaturaleza: idnaturaleza
                },
                doAction: function(records) {
                    _this.model.adicionarProductosInventario(records);
                }
            });
            winProductos.init();
            winProductos.addGridColumn({
                dataIndex: 'idestructura'
            });
            _this.vistaProductos = winProductos.view();
            _this.vistaProductos.show();
        } else {
            LOG.inv.maestroproductos.Loader.init(function() {
                if (!_this.bloqueada) {
                    //Ext.getBody().mask(_this.idioma.lbMaskCargandoDatos, 'x-mask-loading');

                    if (_this.datos.tipo_interfaz == 'entrada') {
                        
                        _this.ventanaActivos = new LOG.lb.maestroproductos.UIProductos({
                            tipo: 1,
                            width: 750,
                            height: 350,
                            usarAplicar: true,
                            usarMarcaModelo: true,
                            showArbol: false,
                            parametros: {
                                explotacion: 1,
                                idseleccionados: Ext.encode(_this.indicadoresNoMostrar),
                                idnaturaleza: idnaturaleza
                            },
                            doAction: function(recordSeleccionado, e) {
                                if (recordSeleccionado != null) {
                                    _this.model.adicionarProductos(recordSeleccionado);
                                }
                            }
                        });

                        _this.ventanaActivos.panelProductos.getStorePrincipal().fireEvent = _this.ventanaActivos.panelProductos.getStorePrincipal().fireEvent.createSequence(function(e) {
                            if (e == 'load') {
                                if(_this.ventanaActivos.panelProductos.getStorePrincipal().data.items.length == 0){
                                    mostrarMensaje(1, 'No existen datos que mostrar.');
                                }
                                loadMask.hide();
                            }
                        });
                        _this.ventanaActivos.show();
                        var loadMask = new Ext.LoadMask(_this.ventanaActivos.getEl(), {msg: _this.idioma.lbMaskCargandoDatos}, {msgCls: 'mask-css'});
                        loadMask.show();
                    }
                    else if (_this.datos.tipo_interfaz != 'entrada') {
                        /*_this.ventanaActivos = new LOG.lb.maestroproductos.UIProductos({
                         tipo: 1,
                         width: 750,
                         height: 350,
                         showArbol: false,
                         usarEspecialidad: false,
                         usarAplicar: true,
                         dirController: '/logistica/utiles/producto/index.php/producto',
                         controllerAction: 'cargarproductos',
                         parametros: {
                         idarea: _this.datos.idarearesp,
                         explotacion: 1,
                         idseleccionados: _this.indicadoresNoMostrar
                         },
                         doAction: function(recordSeleccionado, e) {
                         if (recordSeleccionado != null) {
                         _this.model.adicionarProductos(recordSeleccionado);
                         }
                         }
                         });*/

                        _this.ventanaActivos = new LOG.lb.producto.View({
                            usarFiltroArea: false,
                            _parent: _this,
                            usarMarcaModelo: true,
                            autoLoad: false,
                            parametros: {
                                idestructura: _this.datos.idarearesp,
                                explotacion: 1,
                                idseleccionados: _this.indicadoresNoMostrar,
                                prodareas: true,
                                idnaturaleza: idnaturaleza
                            },
                            doAction: function(recordSeleccionado) {
                                if (recordSeleccionado != null) {
                                    _this.model.adicionarProductos(recordSeleccionado);
                                }
                            }
                        });
                         
                        _this.ventanaActivos.init();
                        _this.vistaProductos = _this.ventanaActivos.view();
                        _this.vistaProductos.show();
                        _this.ventanaActivos.getStorePrincipal().load();                          
                      
                        _this.ventanaActivos.getStorePrincipal().fireEvent = _this.ventanaActivos.getStorePrincipal().fireEvent.createSequence(function (e) {
                            if (e == 'load') {                                
                                if(_this.ventanaActivos.getStorePrincipal().data.items.length == 0){
                                    mostrarMensaje(1, 'No existen datos que mostrar.');
                                }
                                //loadMask.hide();
                            }
                        });
                          _this.ventanaActivos.gpPrincipal.on({
                            'rowdblclick': function(grid, row, e) {
                                var recordSelected = _this.ventanaActivos.gpPrincipal.getSelectionModel().getSelections();
                                _this.ventanaActivos.doAction(recordSelected);
                                _this.vistaProductos.close();
                            }
                        });

                    }
                    else {
                        _this.ventanaActivos.parametros = {idseleccionados: _this.indicadoresNoMostrar};
                        var loadMask = new Ext.LoadMask(_this.ventanaActivos.getEl(), {msg: _this.idioma.lbMaskCargandoDatos}, {msgCls: 'mask-css'});
                        loadMask.show();
                    }

                }
            });
        }
    },

    gestionarBotones: function() {
        var _this = this;
        var rowselected = false;

        if (_this.getSmPrincipal().getCount() > 0) {
            rowselected = _this.getSmPrincipal().getSelected();
        }
        switch (true) {
            case this.datos.idestado == '1' || this.datos.idestado == 1:
            {
                this.btnAnularDoc.disable();
                this.btnAprobarDoc.disable();
                if (_this.datos.iddocinventario && _this.datos.iddocinventario != null) {
                    this.btnAdicionarProd.disable();
                    this.btnAdicionarProdObjObra.disable();
                    this.btnAdicionarProdInmuebles.disable();
                } else {
                    this.btnAdicionarProd.enable();
                    this.btnAdicionarProdObjObra.enable();
                    this.btnAdicionarProdInmuebles.enable();
                }

                if (_this.datos.inventarioTotal || _this.datos.inventarioParcialMensual) {

                    this.btnConfirmarDoc.enable();
                    // this.btnRegistro.disable();
                } else {

                    if (rowselected) {
                        this.btnEliminarProd.enable();
                    } else {
                        this.btnEliminarProd.disable();
                    }
                    if (this.gpPrincipal.getStore().getCount() > 0) {
                        this.btnConfirmarDoc.enable();
                    }
                }
            }
                break;
            case this.datos.idestado == '2' || this.datos.idestado == 2:
            {
                this.btnAnularDoc.enable();
                this.btnAprobarDoc.enable();
                this.btnConfirmarDoc.disable();
                this.btnAdicionarProd.disable();
                this.btnAdicionarProdObjObra.disable();
                this.btnAdicionarProdInmuebles.disable();
                this.btnEliminarProd.disable();

            }
                break;
            case this.datos.idestado == '3' || this.datos.idestado == 3:
            {
                //this.btnImpromirMod.disable();
                this.btnAnularDoc.disable();
                this.btnAprobarDoc.disable();
                this.btnConfirmarDoc.disable();
                this.btnAdicionarProd.disable();
                this.btnAdicionarProdObjObra.disable();
                this.btnAdicionarProdInmuebles.disable();
                this.btnEliminarProd.disable();

            }
                break;
            default :
            {
                this.btnAnularDoc.disable();
                this.btnAprobarDoc.disable();
                this.btnAdicionarProd.disable();
                this.btnAdicionarProdObjObra.disable();
                this.btnAdicionarProdInmuebles.disable();

            }
        }

        if (rowselected) {
            /*if ((_this.datos.inventarioTotal || _this.datos.inventarioParcial) && (this.datos.idestado == '1' || this.datos.idestado == 1))
             this.btnRegistro.disable();
             else*/
            this.btnRegistro.enable();

            if (_this.datos.iddocinventario && _this.datos.iddocinventario != null) {
                this.btnAdicionarProd.disable();
                this.btnEliminarProd.disable();
            }

        } else {
            this.btnRegistro.disable();
        }

        if (_this.datos.operacionAjuste || _this.datos.inventarioParcialMensual || _this.datos.inventarioTotal) {
            this.btnEliminarProd.disable();
            this.btnAdicionarProd.disable();
        }


    },
});

LOG.aft.documento.TabPanelWinGestionarPatr = Ext.extend(LOG.aft.documento.TabPanelWinGestionar, {
    crearStoreOperaciones: function(value) {
        var _this = this;
        this.storeOperaciones = new Ext.data.Store({
            url: 'getoperaciones',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {
                    name: 'idoperacion'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'idconcepto'
                },
                {
                    name: 'operacioncontable'
                },
                {
                    name: 'idcuenta'
                },
                {
                    name: 'signo'
                },
                {
                    name: 'iddatosespecificos'
                },
                {
                    name: 'autogenerada'
                },
                {
                    name: 'idinterfaz'
                },
                {
                    name: 'codigo'
                }
            ]),
            listeners: {
                'beforeload': function(st, objeto) {
                    _this.comboOperaciones.disable();
                    _this.comboOperaciones.setRawValue(_this.idioma.lbCbCargando);
                    st.baseParams.idestructura = _this.cmpGeneral.idPadreNodoSeleccionado;
                    st.baseParams.idfuncionalidad = _this.cmpGeneral.idfuncionalidad;
                    st.baseParams.operacionesEntrada = _this.operacionesEntrada;
                },
                'load': function(st, records, options) {
                    _this.comboOperaciones.setRawValue(_this.idioma.lbCbVacio);
                    LOG.aft.documento.regNumAReparar.scope = null;
                    if (records.length > 0) {
                        if (_this.disable_comp) {
                            _this.comboOperaciones.disable();
                        }

                        if (value) {
                            _this.comboOperaciones.setValue(value);
                            var iddatosespecificos = null;
                            var signoOperacion = null;
                            var idinterfaz = null;
                            for (var i = 0; i < records.length; i++) {
                                if (records[i].data.idoperacion == value) {
                                    iddatosespecificos = records[i].data.iddatosespecificos;
                                    signoOperacion = records[i].data.signo;
                                    idinterfaz = records[i].data.idinterfaz;
                                }
                            }
                            _this.crearTabSecundario(iddatosespecificos);
                            if (signoOperacion === '+' && idinterfaz != 22 && integradoCont && idinterfaz == 29 && _this.comboCentroCosto.getValue()){                             
                                 _this.crearTabDatosDocumento();
                            }
                               
                            /*if (_this.comboCentroCosto) {
                             if (signoOperacion != '-' && signoOperacion != 'N') {
                             _this.storeCentroCosto.load();
                             if (_this.modificar == 'modificar' && _this.datos.data.cant_medios != 0)
                             _this.comboCentroCosto.disable();
                             else
                             _this.comboCentroCosto.enable();
                             }
                             }*/
                        } else {

                            //  Para impedir que seleccione una operacion que solo puede ser creada a travez de otro documento
                            for (var i = 0; i < records.length; i++) {
                                if (records[i].get('autogenerada') == '1') {
                                    st.remove(records[i]);
                                }

                            }
                        }
                    }
                }

            }
        });
    },
    crearComboTipoDoc: function(value) {
        var _this = this;
        this.areaseleccionada = 'arearesp';
        this.comboTipoDoc = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCMTipoDoc,
            editable: false,
            url: 'gettipodocumentos',
            hiddenName: 'iddoc',
            valueField: 'iddoc',
            //disabled: true,
            displayField: 'denominacion',
            allowBlank: false,
            autoCreate: true,
            autoLoad: true,
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            anchor: '95%',
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'select': function(combo, record, index) {
                    _this.comboOperaciones.reset();
                    //if (_this.comboCentroCosto)
                    //    _this.comboCentroCosto.reset();

                    var iddoc = _this.comboTipoDoc.store.getAt(index).data.iddoc;
                    _this.comboOperaciones.disable();
                    _this.storeOperaciones.baseParams.iddoc = iddoc;
                    _this.storeOperaciones.load({
                        callback: function(records, options, success) {

                            if (records.length == 0) {
                                mostrarMensaje(3, _this.idioma.lbSinOperaciones);
                                _this.comboOperaciones.disable();
                            } else {
                                _this.comboOperaciones.enable();
                                _this.comboTipoDoc.enable();
                            }
                        }
                    });
                    _this.eliminarTabSecundario();
                    _this.eliminarTabDatos();
                }
            }
        });
        _this.comboTipoDoc.getStore().on({
            'beforeload': function(st, records, options) {
                _this.comboTipoDoc.disable();
                _this.comboTipoDoc.setRawValue(_this.idioma.lbCbCargando);
                if (/*_this.cmpGeneral.idPadreNodoSeleccionado == _this.cmpGeneral.idNodoSeleccionado &&*/ _this.modificar == 'modificar') {
                    st.baseParams.idestructura = _this.smGrid.data.idestructura; //_this.cmpGeneral.idPadreNodoSeleccionado;
                    st.baseParams.areaseleccionada = 'arearesp';
                    st.baseParams.operacionesEntrada = (_this.operacionesEntrada) ? 2 : -1;
                    st.baseParams.iddoc = _this.smGrid.data.iddoc;
                } else {
                    st.baseParams.idestructura = _this.cmpGeneral.idPadreNodoSeleccionado;
                    // Verifico si el nodo seleccionado es una entidad o un area de responsabilidad                   
                    st.baseParams.areaseleccionada = _this.areaseleccionada;
                    st.baseParams.operacionesEntrada = (_this.operacionesEntrada) ? 2 : -1;
                }

            },
            'load': function(st, records, options) {
                _this.comboOperaciones.setRawValue(_this.idioma.lbCbVacio);
                if (records.length > 0) {
                    if (value) {
                        _this.comboTipoDoc.setValue(value);
                        _this.storeOperaciones.load();
                    } else {
                        if (_this.disable_comp == false) {
                            _this.comboTipoDoc.setRawValue(_this.idioma.lbCbVacio);
                            //_this.comboTipoDoc.enable();
                        }
                        _this.comboTipoDoc.enable();
                    }
                }
                //_this.comboTipoDoc.enable();
            }
        });
    },   
});