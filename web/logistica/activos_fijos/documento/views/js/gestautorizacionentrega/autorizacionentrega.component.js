Ext.ns('LOG.aft.autorizacionentrega');
LOG.aft.autorizacionentrega.entidadArea = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;
        this.urlBusquedaGridPrincipal = 'getCargarEntidadAreaDestino';
        this.autoLoad = false;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 3;
        this.busquedaBasica = false;
        this.modal = true;
        this.scope = config.scope;
        this.desabilitar = config.desabilitar;
        this.layout = 'border';
        this.title = "_this.idioma.lbArea";
        this.idioma = config.idioma;
        LOG.aft.autorizacionentrega.entidadArea.superclass.constructor.call(this, config);
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().height = 500;
        this.iddocumento = config.iddocumento;

        this.model = new LOG.aft.autotizacion.Model({
            idioma: config.idioma,
            scope: _this
        });
    },
    initDefaultColumns: function() {

        var _this = this;
        this.addGridColumn({
            dataIndex: 'codigoreup',
            header: 'C&oacute;digo',
            default: true,
            sortable: true,
            width: 200,
            filter: {
                type: 'numeric',
                dataIndex: 'codigoreup'
            }
        });
        this.addGridColumn({
            dataIndex: 'deposito',
            header: _this.idioma.lbdenominacion,
            default: true,
            sortable: true,
            autoExpand: true,
            width: 200,
            filter: {
                type: 'string',
                dataIndex: 'deposito'
            }
        });

        this.addGridColumn({
            dataIndex: 'iddestino',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idautorizo',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idoperacion',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'iddocumentocliente',
            default: false
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addEntidadArea = LOG.util.UIManager.createBtn({
            tooltip: _this.idioma.lbTtBtnAdicionararea,
            text: "Adicionar",
            disabled: _this.desabilitar,
            iconCls: 'adicionar',
            handler: function() {

                var arrayIdDepositoNotIn = new Array();
                var recordsNotIn = _this.storePrincipal.data;
                for (var i = 0; i < recordsNotIn.items.length; i++) {
                    arrayIdDepositoNotIn.push(recordsNotIn.items[i].data.iddestino);

                }
                var entidadAdd = new LOG.aft.autorizacionentrega.entidadArea({
                    idioma: _this.idioma,
                    formaVisualizacion: 'ventana',
                    urlBusquedaGridPrincipal: 'getCargarComboDeposito',
                    modoSeleccion: 3,
                    initDefaultButtons: function() {
                    },
                    render: function(config) {
                        var vista = LOG.aft.autorizacionentrega.entidadArea.superclass.render.call(this, config);
                        var _this = this;
                        _this.getStorePrincipal().on({
                            'beforeload': function(st) {
                                st.initBaseParams.idtipo = LOG.aft.autorizacionentrega.ViewAdd.idtipo;
                                st.initBaseParams.arrayIdDepositoNotIn = Ext.encode(arrayIdDepositoNotIn);
                            },
                            'load': function(st) {
                                st.initBaseParams.idtipo = LOG.aft.autorizacionentrega.ViewAdd.idtipo;
                                st.initBaseParams.arrayIdDepositoNotIn = Ext.encode(arrayIdDepositoNotIn);

                                if (st.data.items.length == 0) {
                                    mostrarMensaje(1, _this.idioma.lbMsgResultados);
                                }
                            }
                        });

                        _this.smGridPrincipal.on({
                            'rowselect': function(sm, index) {
                                if (sm.getSelections().length > 0) {
                                    entidadAdd.vistaPrincipal.listaBotones.getItem(2).enable();
                                } else {
                                    entidadAdd.vistaPrincipal.listaBotones.getItem(2).disable();
                                }

                            },
                            'rowdeselect': function(sm) {
                                if (sm.getSelections().length > 0) {
                                    entidadAdd.vistaPrincipal.listaBotones.getItem(2).enable();
                                } else {
                                    entidadAdd.vistaPrincipal.listaBotones.getItem(2).disable();
                                }
                            }
                        });
                        _this.getStorePrincipal().load();


                        /* var record = new Ext.data.Record({
                         fecha: '',
                         clave: '',
                         numero: '',
                         importe: (_this.dataregnumerico.data.valorcontable) ? _this.dataregnumerico.data.valorcontable : 0,
                         aracontabilidad: '',
                         denomrespareacontable: null
                         });
                         gridDocumentos.getStorePrincipal().add(record);*/
                        return vista;

                        //_this.entidad.smGridPrincipal.getSelected().data.iddeposito;
                    },
                });
                entidadAdd.vistaPrincipal.listaBotones.getItem(1).hide();
                entidadAdd.vistaPrincipal.listaBotones.getItem(2).disabled = true;
                entidadAdd.vistaPrincipal.width = 800;
                entidadAdd.init();
                entidadAdd.view({
                    title: _this.idioma.lbEntidades
                });

                entidadAdd.getVistaPrincipal().aceptarFn = function() {
                    var arrayIdDeposito = new Array();
                    //if (this.regnumericoAdd.getSmPrincipal().hasSelection()) {
                    var records = entidadAdd.getSmPrincipal().getSelections();
                    Ext.each(records, function(r) {
                        arrayIdDeposito.push(r.data.iddestino);
                    });
                    _this.model.getGuardarAreaEntidadDestino(arrayIdDeposito, _this.iddocumento);
                    //_this.scope.entidad.getStorePrincipal().load();

                    // }
                }


            }/*,
             controlFn: function(b, _caller) {
             if (_caller.grantedAction('idAdicionarBtn')) {
             b.setVisible(true);
             
             } else {
             b.setVisible(false);
             }
             
             }*/
        });
        _this.addToolbarButton(_this.addEntidadArea);

        this.delEntidadArea = LOG.util.UIManager.createBtn({
            tooltip: _this.idioma.lbTtBtnEliminararea,
            text: "Eliminar",
            iconCls: 'eliminar',
            disabled: true,
            handler: function() {
                mostrarMensaje(2, _this.idioma.lbMsgConfirmarEliminar, function(btn) {
                    if (btn == 'ok') {
                        var iddocumentocliente = new Array();
                        Ext.each(_this.getSmPrincipal().getSelections(), function(r) {
                            iddocumentocliente.push(r.data.iddocumentocliente);
                        });
                        _this.model.getEliminarAreaEntidadDestino(iddocumentocliente, 'iddocumentocliente', 'DatDocumentoCliente', false, _this.iddocumento);
                    }
                });

            }/*,
             controlFn: function(b, _caller) {
             if (_caller.grantedAction('idEliminarBtn')) {
             b.setVisible(true);
             
             } else {
             b.setVisible(false);
             }
             
             }*/
        });
        _this.addToolbarButton(_this.delEntidadArea);
    },
    render: function() {
        var vista = LOG.aft.autorizacionentrega.entidadArea.superclass.render.call(this);
        var _this = this;
        _this.smGridPrincipal.on({
            'rowselect': function(sm, index) {
                if (sm.selections.items.length == 1) {
                    _this.scope.regnumerico.storePrincipal.load({
                        params: {
                            iddestino: sm.getSelected().data.iddestino
                        }
                    });
                    if (!_this.desabilitar) {
                        _this.scope.regnumerico.addRegNumerico.enable();
                    }

                }
                if (sm.selections.items.length > 0 && !_this.desabilitar) {
                    _this.scope.regnumerico.getStorePrincipal().removeAll();
                    _this.delEntidadArea.enable();
                }
                if (sm.selections.items.length == 0) {
                    _this.delEntidadArea.disable();
                    _this.scope.regnumerico.addRegNumerico.disable();
                    _this.scope.regnumerico.getStorePrincipal().load();
                }
                if (sm.selections.items.length > 1) {
                    _this.scope.regnumerico.addRegNumerico.disable();
                }


            },
            'rowdeselect': function(sm) {
                if (sm.selections.items.length == 1) {
                    _this.scope.regnumerico.storePrincipal.load({
                        params: {
                            iddestino: sm.getSelected().data.iddestino
                        }
                    });
                     if (!_this.desabilitar) {
                        _this.scope.regnumerico.addRegNumerico.enable();
                    }
                }
                if (sm.selections.items.length > 0 && !_this.desabilitar) {
                    _this.delEntidadArea.enable();
                }
                if (sm.selections.items.length > 1) {
                    _this.scope.regnumerico.getStorePrincipal().removeAll();
                    _this.scope.regnumerico.addRegNumerico.disable();
                }
                if (sm.selections.items.length == 0) {
                    _this.delEntidadArea.disable();
                    _this.scope.regnumerico.addRegNumerico.disable();
                    _this.scope.regnumerico.getStorePrincipal().removeAll();


                }
            }
        });

        _this.getStorePrincipal().on({
            beforeLoad: function(st) {
                //alert('carga');
                st.initBaseParams.iddocumento = _this.iddocumento;
            },
            load: function(st) {

            }
        });
        _this.getStorePrincipal().load();
        return vista;



    }
});
LOG.aft.autorizacionentrega.regnumerico = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;
        this.autoLoad = false;
        this.formaVisualizacion = (config.formaVisualizacion) ? config.formaVisualizacion : 'panel';
        this.urlBusquedaGridPrincipal = 'getCargarRegNumericos';
        //this.bbarVisible = false;
        this.modoSeleccion = 3;
        this.busquedaBasica = false;
        this.idGridPrincipal = 'idregnumerico';
        this.modal = true;
        this.desabilitar = config.desabilitar;
        this.scopeprincipal = config.scope;
        this.layout = 'border';
        this.idioma = config.idioma;
        this.viewEntidad = config.viewEntidad;
        LOG.aft.autorizacionentrega.regnumerico.superclass.constructor.call(this, config);
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().height = (config.height) ? config.height : 500;
        this.model = new LOG.aft.autotizacion.Model({
            idioma: config.idioma,
            scope: _this
        });
    },
    initDefaultColumns: function() {

        var _this = this;
        this.addGridColumn({
            header: _this.idioma.lbdenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            autoExpand: true,
            width: 100,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }

        });
        this.addGridColumn({
            header: _this.idioma.lbMarcaModelo,
            dataIndex: 'marcamodelo',
            sortable: true,
            autoExpand: true,
            width: 100,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'marcamodelo'
            }

        });
        this.addGridColumn({
            header: _this.idioma.lbEntidad,
            dataIndex: 'entidad',
            width: 130,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'entidad'
            }
        });

        this.addGridColumn({
            header: _this.idioma.lbArea,
            dataIndex: 'arearesp',
            width: 130,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'arearesp'
            }
            //agrupador: true
        });
        this.addGridColumn({
            header: _this.idioma.lbInventario,
            dataIndex: 'nroinventario',
            width: 100,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nroinventario'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbnroserie,
            dataIndex: 'nroserie',
            width: 100,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nroserie'
            }
        });

        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idarearesp',
            default: false
        });

    },
    initDefaultButtons: function() {
        var _this = this;

        this.addRegNumerico = LOG.util.UIManager.createBtn({
            tooltip: _this.idioma.lbTtBtnAdicionarreg,
            text: 'Adicionar',
            iconCls: 'adicionar',
            disabled: !_this.desabilitar,
            handler: function() {

                var iddestino = _this.viewEntidad.smGridPrincipal.getSelected().data.iddestino;
                var arrayidregnumerico = new Array();

                var regnumericoAdd = new LOG.aft.autorizacionentrega.regnumerico({
                    idioma: _this.idioma,
                    formaVisualizacion: 'ventana',
                    urlBusquedaGridPrincipal: 'getCargarRegNumericos',
                    modoSeleccion: 3,
                    initDefaultButtons: function() {
                    },
                    render: function(config) {
                        var vista = LOG.aft.autorizacionentrega.regnumerico.superclass.render.call(this, config);
                        var _this = this;
                        _this.getStorePrincipal().on({
                            'beforeload': function(st) {
                                st.initBaseParams.add = true;
                                st.initBaseParams.iddestino = iddestino;
                            },
                            'load': function(st) {
                                st.initBaseParams.add = true;
                                st.initBaseParams.iddestino = iddestino;
                                st.initBaseParams.idsRegNumNoMostrar = Ext.encode(arrayidregnumerico);
                                if (st.data.items.length == 0) {
                                    mostrarMensaje(1, _this.idioma.lbMsgResultados);
                                }
                            }
                        });

                        _this.smGridPrincipal.on({
                            'rowselect': function(sm, index) {
                                if (sm.getSelections().length > 0) {
                                    regnumericoAdd.vistaPrincipal.listaBotones.getItem(2).enable();
                                } else {
                                    regnumericoAdd.vistaPrincipal.listaBotones.getItem(2).disable();
                                }

                            },
                            'rowdeselect': function(sm) {
                                if (sm.getSelections().length > 0) {
                                    regnumericoAdd.vistaPrincipal.listaBotones.getItem(2).enable();
                                } else {
                                    regnumericoAdd.vistaPrincipal.listaBotones.getItem(2).disable();
                                }
                            }
                        });
                        _this.getStorePrincipal().load();


                        /* var record = new Ext.data.Record({
                         fecha: '',
                         clave: '',
                         numero: '',
                         importe: (_this.dataregnumerico.data.valorcontable) ? _this.dataregnumerico.data.valorcontable : 0,
                         aracontabilidad: '',
                         denomrespareacontable: null
                         });
                         gridDocumentos.getStorePrincipal().add(record);*/
                        return vista;

                        //_this.entidad.smGridPrincipal.getSelected().data.iddeposito;
                    }
                });
                regnumericoAdd.vistaPrincipal.listaBotones.getItem(1).hide();
                regnumericoAdd.vistaPrincipal.listaBotones.getItem(2).disabled = true;
                regnumericoAdd.getVistaPrincipal().width = 1000;
                regnumericoAdd.getVistaPrincipal().height = 600;
                regnumericoAdd.init();
                regnumericoAdd.view({
                    title: _this.idioma.lbWinRegNumericoAFT
                });
                regnumericoAdd.getVistaPrincipal().aceptarFn = function() {

                    //var iddestino = _this.viewEntidad.smGridPrincipal.getSelected().data.iddestino;
                    var iddocumentocliente = _this.viewEntidad.smGridPrincipal.getSelected().data.iddocumentocliente;
                    if (regnumericoAdd.getSmPrincipal().getSelections()) {
                        var arryregNumerico = new Array();
                        var idsRegNumNoMostrar = new Array();

                        var recordsNotIn = _this.storePrincipal.data;
                        for (var i = 0; i < recordsNotIn.items.length; i++) {
                            idsRegNumNoMostrar.push(recordsNotIn.items[i].data.idregnumerico);
                        }



                        var records = regnumericoAdd.getSmPrincipal().getSelections();
                        Ext.each(records, function(r) {
                            arryregNumerico.push(r.data.idregnumerico);
                        });
                    }
                    _this.model.getAddRegNumerico(arryregNumerico, iddocumentocliente);
                }


            }/*,
             controlFn: function(b, _caller) {
             if (_caller.grantedAction('idAdicionarBtn')) {
             b.setVisible(true);
             
             } else {
             b.setVisible(false);
             }
             
             }*/
        });
        _this.addToolbarButton(_this.addRegNumerico);

        this.delRegNumerico = LOG.util.UIManager.createBtn({
            tooltip: _this.idioma.lbTtBtnEliminarreg,
            text: "Eliminar",
            iconCls: 'eliminar',
            disabled: true,
            /* key: {
             ctrl: true,
             alt: true,
             shift: false,
             key: 'I'
             },*/
            handler: function() {
                mostrarMensaje(2, _this.idioma.lbMsgConfirmarEliminar, function(btn) {
                    if (btn == 'ok') {
                        var idregnumerico = new Array();
                        Ext.each(_this.getSmPrincipal().getSelections(), function(r) {
                            idregnumerico.push(r.data.idregnumerico);
                        });
                        _this.model.getEliminarAreaEntidadDestino(idregnumerico, 'idregnumerico', 'DatRegAutorizo', 'regnum', false, _this)

                        //_this.getStorePrincipal().load();
                    }
                });

            }/*,
             controlFn: function(b, _caller) {
             if (_caller.grantedAction('idEliminarBtn')) {
             b.setVisible(true);
             
             } else {
             b.setVisible(false);
             }
             
             }*/
        });
        _this.addToolbarButton(_this.delRegNumerico);
    },
    render: function() {
        var vista = LOG.aft.autorizacionentrega.regnumerico.superclass.render.call(this);

        var _this = this;
        _this.smGridPrincipal.on({
            'rowselect': function(sm, index) {
                if (sm.getSelections().length > 0 && _this.scopeprincipal.estado != 3) {
                    _this.delRegNumerico.enable();
                }
            },
            'rowdeselect': function(sm) {
                if (sm.getSelections().length == 0) {
                    _this.delRegNumerico.disable();
                }
            }
        });

        _this.getStorePrincipal().on({
            'beforeload': function(st) {               
                st.initBaseParams.iddocumentocliente = (_this.viewEntidad.smGridPrincipal.getSelected()) ? _this.viewEntidad.smGridPrincipal.getSelected().data.iddocumentocliente : null;
                st.initBaseParams.iddestino = (_this.viewEntidad.smGridPrincipal.getSelected()) ? _this.viewEntidad.smGridPrincipal.getSelected().data.iddestino : null;
                st.initBaseParams.estado = (!_this.scopeprincipal.adicionar) ? _this.scopeprincipal.estado: null;
            },
            'load': function(st) {
                st.initBaseParams.iddocumentocliente = (_this.viewEntidad.smGridPrincipal.getSelected()) ? _this.viewEntidad.smGridPrincipal.getSelected().data.iddocumentocliente : null;
                st.initBaseParams.iddestino = (_this.viewEntidad.smGridPrincipal.getSelected()) ? _this.viewEntidad.smGridPrincipal.getSelected().data.iddestino : null;
                st.initBaseParams.estado = (!_this.scopeprincipal.adicionar) ? _this.scopeprincipal.estado: null;
            }
        });
        return vista;
    }
});

LOG.aft.autorizacionentrega.ViewAdd = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        var _this = this;
        LOG.util.UIManager.apply(config.idioma, LOG.aft.autorizacionentrega.Idioma);
        this.idioma = config.idioma;
        this.modificar = config.modificar;
        this.iddocumento = config.iddocumento;
        this.scopeprincipal = config.scope;
        this.adicionar = config.adicionar;
        this.estado = (this.scopeprincipal.getSmPrincipal().selections.items.length > 0) ? this.scopeprincipal.getSmPrincipal().getSelected().data.estado : -1;
        this.layout = 'fit';
        LOG.aft.autorizacionentrega.ViewAdd.superclass.constructor.call(this, config);
        this.model = new LOG.aft.autotizacion.Model({
            idioma: config.idioma,
            scope: _this
        });
        this.panelDatos();
    },
    initComponent: function(config) {
        var _this = this;
        LOG.aft.autorizacionentrega.ViewAdd.superclass.initComponent.call(this);
        this.listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: _this.desabilitarBotones(),
            handler: function() {
                var observaciones = _this.taObservaciones.getValue();
                var arrayIddestino = new Array();
                var records = _this.entidad.getSmPrincipal().getSelections();
                Ext.each(records, function(r) {
                    arrayIddestino.push(r.data.iddocumentocliente);
                });
                _this.model.getAceptarDoc(observaciones, arrayIddestino, _this.iddocumento, _this.scopeprincipal, _this.modificar);
                _this.close();
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function() {
                var fn = function(rd) {

                }

                _this.model.eliminarDoc(new Array(_this.iddocumento), fn, true, _this.modificar);
                _this.close();
            }
        });
    },
    panelDatos: function() {
        var _this = this;
        this.clsPanel = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.clsPanelfieluno = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });

        this.taObservaciones = new Ext.form.TextArea({
            fieldLabel: _this.idioma.taObservaciones,
            name: 'observaciones',
            maxLength: 255,
            maxLengthText: _this.idioma.msgMaxLengthText,
            disabled: _this.desabilitarBotones(),
            tabular: true,
            value: (_this.modificar == 'modificar') ? _this.scope.gpPrincipal.getSelectionModel().getSelected().get('observaciones') : null,
            width: '98%'
        });
        this.clsPanelfieluno.addComponent({});
        this.clsPanelfieluno.addComponent({});
        this.clsPanelfieluno.addComponent({});
        this.clsPanelfieluno.addComponent(_this.taObservaciones);
        this.clsPanel.addComponent(new Ext.form.FieldSet({
            title: _this.idioma.lbDatosGenerales,
            autoHeight: true,
            items: [this.clsPanelfieluno]
        }));

        this.panelNorth = LOG.util.UIManager.initForm({
            frame: true,
            region: 'north',
            layout: 'form',
            defaultsAnchor: '100%',
            anchor: '100%',
            autoHeight: true,
            defaults: {
                anchor: '100%',
                msgTarget: 'side'
            },
            items: [this.clsPanel]
        });

        this.clsPanelEntidadAreaRegnumerico = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        _this.entidad = new LOG.aft.autorizacionentrega.entidadArea({
            idioma: _this.idioma,
            scope: _this,
            desabilitar: _this.desabilitarBotones(),
            iddocumento: _this.iddocumento
        });
        _this.entidad.init();
        var viewEntidadArea = _this.entidad.view();

        this.regnumerico = new LOG.aft.autorizacionentrega.regnumerico({
            idioma: _this.idioma,
            viewEntidad: _this.entidad,
            scope: _this,
        });
        _this.regnumerico.init();
        var viewregnumerico = _this.regnumerico.view();

        this.clsPanelEntidadAreaRegnumerico.addComponent(
                new Ext.form.FieldSet({
                    title: _this.idioma.lbEntidades,
                    autoHeight: true,
                    items: [viewEntidadArea]
                }));
        this.clsPanelEntidadAreaRegnumerico.addComponent(
                new Ext.form.FieldSet({
                    title: _this.idioma.lbWinRegNumerico,
                    autoHeight: true,
                    items: [viewregnumerico]
                })
                );

        this.panelCenter = LOG.util.UIManager.initPanel({
            frame: true,
            region: 'center',
            layout: 'form',
            defaultsAnchor: '100%',
            anchor: '100%',
            defaults: {
                anchor: '100%',
                msgTarget: 'side'
            },
            items: [_this.clsPanelEntidadAreaRegnumerico]
        });
        this.panelContenedor = LOG.util.UIManager.initPanel({
            frame: true,
            region: 'center',
            layout: 'form',
            defaultsAnchor: '100%',
            anchor: '100%',
            defaults: {
                anchor: '100%',
                msgTarget: 'side'
            },
            items: [this.panelNorth, this.panelCenter]
        });
        this.panelContenedor.fireEvent = this.panelContenedor.fireEvent.createSequence(function(e) {
            if (e == 'resize') {
                _this.definirAltura();
            }
        });

        this.add(this.panelContenedor);
    },
    desabilitarBotones: function() {
        var _this = this;
        if (_this.adicionar) {
            return false;
        } else {
            var bandera = true;
            if (_this.estado != 3) {
                bandera = false;
            }
            return bandera;
        }
    },
    definirAltura: function() {
        var alto = this.panelContenedor.getHeight();
        this.entidad.getVistaPrincipal().setHeight(alto * 2 / 3);
        this.regnumerico.getVistaPrincipal().setHeight(alto * 2 / 3);
        this.entidad.getVistaPrincipal().doLayout();
        this.regnumerico.getVistaPrincipal().doLayout();

    },
});