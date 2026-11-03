Ext.ns('Ext.LOG.RegNumOperativo');

Ext.LOG.RegNumOperativo.VentataAdicionarRegistro = Ext.extend(Ext.Window, {
    constructor: function(config) {
        this.busqAvanzada = false;
        this.paginado = 1;
        Ext.apply(this, config);
        this.closeAction = 'destroy';
        var _this = this;
        _this.idioma = config.idioma;
        _this.resizable = false;
        _this.constrain = true;
        _this.modal = true;
        _this.id = 'idwingestregnumeric';
        _this.frame = true;
        _this.width = 1060;
        _this.height = 550;
        _this.layout = 'border';
        _this.id_entidad_seleccionada = config.id_entidad_seleccionada;

        _this.btnCancelarWin = new Ext.Button({
            iconCls: 'cancelar',
            text: "Cancelar",
            tooltip: _this.idioma.lbTtBtnCancelar,
            handler: function () {
                _this.close();
                if (!_this.busqAvanzada) {
                    _this.cargarExpandirNodo(_this.treegridPrincipal.getSelectionModel().getSelected().data.idregnumerico);
                    /*if (_this.treegridPrincipal.getSelectionModel().hasSelection()) {

                    }
                    _this.treegridPrincipal.getSelectionModel().clearSelections();
                    _this.treegridPrincipal.getStore().baseParams = {};
                    _this.treegridPrincipal.getStore().load({
                     params: {
                     idarearesp: _this.idarea
                     }
                     });*/
                }
            }
        });
        _this.btnAplicarWin = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            disabled: true,
            hidden: (_this.modificar || _this.busqAvanzada) ? true : false,
            tooltip: _this.idioma.lbTtBtnAplicar,
            handler: function() {
                var arrayDatosEnviar = _this.TabGeneral.devolverDatosTab();
                if (arrayDatosEnviar) {
                    _this.ADDRegistroOperativo(arrayDatosEnviar, true);
                }
            }
        });
        _this.btnAceptarWin = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            disabled: true,
            tooltip: _this.idioma.btnTAceptar,
            handler: function() {
                var arrayDatosEnviar = _this.TabGeneral.devolverDatosTab();
                _this.ADDRegistroOperativo(arrayDatosEnviar, false);
                _this.existeVentana = true;
            }
        });
        console.info(_this.acciones_reportes);
        this.buttons = [_this.btnCancelarWin, _this.btnAplicarWin, _this.btnAceptarWin];
        this.TabGeneral = new Ext.LOG.RegNumOperativo.tabGeneral({
            idioma: _this.idioma,
//            idareaComboFiltro:_this.idareaComboFiltro,
            idarearesp: _this.idareaComboFiltro,
            //idarea: _this.idarea,
            treegridPrincipal: _this.treegridPrincipal,
            modificar: _this.modificar,
            idestructurapadre: _this.idestructurapadre,
            plantilla: _this.plantilla,
            listaAcciones:_this.acciones_reportes,//_this.panelBotones.listaAcciones,
            recordTree: _this.recordTree,
            busqAvanzada: _this.busqAvanzada,
            panelBotones:_this.panelBotones,
            winsGest: _this
        });
        this.items = [
            {
                region: 'center',
                layout: 'fit',
                items: [_this.TabGeneral]
            }
        ];
        _this.keymap = new Ext.KeyMap(document, [
            {key: 88,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (Ext.WindowMgr.getActive() == _this) {
                        _this.btnCancelarWin.handler();
                    }
                }
            },
            {key: 80,
                ctrl: true,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (Ext.WindowMgr.getActive() == _this)
                        _this.btnAplicarWin.handler();
                }
            },
            {key: 13,
                ctrl: false,
                alt: false,
                stopEvent: true,
                fn: function()
                {
                    if (Ext.WindowMgr.getActive() == _this)
                        _this.btnAceptarWin.handler();
                }
            }

        ]);
        _this.keymap.stopEvent = true;
        _this.keymap.enable();

        Ext.LOG.RegNumOperativo.VentataAdicionarRegistro.superclass.constructor.apply(this, arguments);
        this.on({
            'show': function() {
                _this.keymap.enable();
                if (!_this.modificar) {
                    _this.TabGeneral.panelComboDatosIndicador.onBtnAdicionarProdClick();
                }
            },
            'hide': function() {
                _this.keymap.disable();
            }
        });
    },
    obtenerRegistroParaModulo: function(arrayDatos) {
        for (var i = 0; i < (arrayDatos).length; i++) {
            var arraydeRegristros = new Array();
            if (arrayDatos[i].tabModulo != null) {
                for (var j = 0; j < (arrayDatos[i].tabModulo.treegrid.getStore().data.items).length; j++) {
                    arraydeRegristros.push(arrayDatos[i].tabModulo.treegrid.getStore().data.items[j].data.idregnumerico);
                }
            }
            arrayDatos[i].tabModulo = arraydeRegristros;
        }
    },
    obtenerLogitudSeleccion:function () {
        var _this = this;
        if (_this.treegridPrincipal.getSelectionModel().hasSelection()) {
            return _this.treegridPrincipal.getSelectionModel().getSlections().lenght;

        }else {
            return 0;
        }
    },
    validarAdicionarModulo:function(datos){

        var eliminarHijos = (datos[0].eliminarHijos && datos[0].eliminarHijos.length == 0);
        var elementosHijos = (datos[0].elementoshijos && datos[0].elementoshijos.length == 0);
        return (elementosHijos && eliminarHijos);
    },
    ADDRegistroOperativo: function(datos, apl) {


        var _this = this;
        if (_this.validarAdicionarModulo(datos)) {
            datos[0].esmodulo = 1;
        }else if(datos[0].eliminarHijos && datos[0].eliminarHijos.length > 0){
            datos[0].esmodulo = 2;
        }
        if (_this.busqAvanzada == true) {
            _this.close();
            _this.treegridPrincipal.getSelectionModel().clearSelections();
            _this.treegridPrincipal.getStore().load({
                params: {
                    datos: Ext.encode(datos),
                    busqAvanzada: (_this.busqAvanzada == false) ? 1 : 2,
                    //idarearesp: _this.idarea,
                    paginado: _this.paginado
                }
            });
            return;
        }
        var idregnumericoPadre = null;
        var idArbol = null;
        var msg = (_this.modificar) ? _this.idioma.labModificando : _this.idioma.labAdicionando;
        var LoadMask = new Ext.LoadMask(_this.getEl(), {msg: msg});
        LoadMask.show();

        if (_this.idregnumericoPadredesdeOrg) {
            idregnumericoPadre = _this.idregnumericoPadredesdeOrg;
            idArbol = _this.idarbol;
        } else {
            if (!_this.modificar && _this.treegridPrincipal.getSelectionModel().getSelected()) {
                idregnumericoPadre = _this.treegridPrincipal.getSelectionModel().getSelected().data.idregnumerico;
                idArbol = _this.treegridPrincipal.getSelectionModel().getSelected().data.idarbolmodulo;

            }else if(_this.modificar){
                idregnumericoPadre = _this.treegridPrincipal.getSelectionModel().getSelected().data._parent;
                idArbol = _this.treegridPrincipal.getSelectionModel().getSelected().data.idregnumerico;
            }
        }

        Ext.Ajax.request({
            url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/adicionarRegistroNumericoOperativo',
            method: 'POST',
            timeout: '240000',
            params: {
                datos: Ext.encode(datos),
                primaryKeyField: 'idregnumerico',
                id_entidad_seleccionada: _this.id_entidad_seleccionada,
                //idarearesp: _this.idarea,
                idpadreModulo: idregnumericoPadre,
                plantilla: (_this.plantilla == false) ? 1 : 2,
                busqAvanzada: (_this.busqAvanzada == false) ? 1 : 2,
                idarbol: idArbol,
                modificar:(_this.modificar)?1:false,

                paginado: _this.paginado
            },
            callback: function(options, success, response) {
                response = Ext.util.JSON.decode(response.responseText);
                LoadMask.hide();
                if (response.Msg == 4) {
                    mostrarMensaje(1, (_this.modificar) ? _this.idioma.MsgRegistroExiste : _this.idioma.MsgRegistroExiste);
                } else
                if (response.Msg == 3) {
                    mostrarMensaje(response.Msg, (_this.modificar) ? _this.idioma.MsgModificarRegistroError : _this.idioma.MsgAdicionarRegistroError);
                } else {
                    mostrarMensaje(1, (_this.modificar) ? _this.idioma.MsgModificarRegistroOK : _this.idioma.MsgAdicionarRegistroOK);
                    if (_this.idregnumericoPadredesdeOrg != null) {

                        _this.fndelectCell();
                        _this.fnaddChild();
                        if (!apl) {
                            _this.close();
                        } else {
                            _this.TabGeneral.LimpiarDatosTab(true);
                        }

                        _this.cargarExpandirNodo(idregnumericoPadre);
                    }
                    else {

                        if (_this.idarearesp) {
                            _this.treegridPrincipal.comboDeposito.getStore().load({
                                params: {},
                                callback: function() {
                                    _this.treegridPrincipal.comboDeposito.setValue(_this.idarearesp);
                                    _this.treegridPrincipal.btnBuscar.handler();
                                    _this.close();
                                }
                            });
                        } else {
                            _this.cargarExpandirNodo(idregnumericoPadre);
                            if (!apl) {
                                _this.close();
                            } else {
                                _this.TabGeneral.LimpiarDatosTab(true);
                            }
                        }
                    }
                }
            }
        });
    },
    cargarExpandirNodo:function(idregnumericoPadre)
    {
        var _this = this;
        if (!_this.idregnumericoPadredesdeOrg && idregnumericoPadre) {

            _this.treegridPrincipal.getStore().getById(idregnumericoPadre).store.load({
                params: {
                    anode: idregnumericoPadre,
                    _id: null
                },
                callback: function () {
                    _this.treegridPrincipal.getStore().expandNode(_this.treegridPrincipal.getStore().getById(idregnumericoPadre));
                }
            });

        } else {
            if (_this.treegridPrincipal) {
                _this.treegridPrincipal.getSelectionModel().clearSelections();
                _this.treegridPrincipal.getStore().baseParams = {
                    idarearesp: _this.id_entidad_seleccionada
                };
                _this.treegridPrincipal.getStore().load();
            }
        }
    }
});


