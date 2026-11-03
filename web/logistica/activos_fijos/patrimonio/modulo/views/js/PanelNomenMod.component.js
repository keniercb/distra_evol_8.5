Ext.ns('Ext.LOG.moduloMedio');


Ext.LOG.moduloMedio.panelNomenModP = Ext.extend(LOG.util.UITemplate, {
    nottitle: null,
    /*
     * arreglo de registros que no se quieran mostrar
     */
    idsRegNumNoMostrar: new Array(),
    constructor: function(config) {
        this.dirController = '/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos';
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.winAddNoInventario = null;
        this.concepto = this.idioma.lbTtBtnBuscarAgrupacion;
        Ext.apply(this.idioma, LOG.util.Idioma);
        this.urlBusquedaGridPrincipal = 'getModuloLogico';
        Ext.LOG.moduloMedio.panelNomenModP.superclass.constructor.call(this, config);
        if (!config.formaVisualizacion || config.formaVisualizacion == 'ventana') {
            this.getVistaPrincipal().title = config.title;
            // this.getVistaPrincipal().listaBotones.getItem(1).hide();
            // this.getVistaPrincipal().listaBotones.getItem(2).disable();
            this.getVistaPrincipal().width = config.width;
            this.getVistaPrincipal().height = config.height;
            this.getVistaPrincipal().resizable = false;
            this.getVistaPrincipal().ventana = config.ventana;
            this.getVistaPrincipal().idarea = config.idarea;
        }
        this.documentKeyMap();

    },
    documentKeyMap: function() {
        var _this = this;

        this.keyMap = new Ext.KeyMap(Ext.getDoc(),
                [
                    {
                        alt: true,
                        ctrl: false,
                        key: 'i',
                        fn: function() {
                            if (_this.getVistaPrincipal().isVisible()) {
                                if (_this.tabGeneral && _this.tabGeneral.getActiveTemplate().idComponent == 1) {
                                    _this.Adicionar.fireEvent('click');
                                } else if (_this.accion && _this.accion == 'gestagrupacion') {
                                    _this.Adicionar.fireEvent('click');
                                }
                        }
                        }
                    },
                    {
                        alt: true,
                        ctrl: false,
                        key: 'm',
                        fn: function() {
                            if (_this.tabGeneral && _this.tabGeneral.getActiveTemplate().idComponent == 1 && !_this.Modificar.disabled) {
                                _this.Modificar.fireEvent('click');
                            } else if (_this.accion && _this.accion == 'gestagrupacion' && !_this.Modificar.disabled) {
                                _this.Modificar.fireEvent('click');
                            }
                        }
                    }, {
                        key: Ext.EventObject.ESC,
                        fn: function() {
                           // _this.destroy();
                           _this.keyMap.stopEvent = true;
                        }
                    }, {
                        key: Ext.EventObject.DELETE,
                        fn: function() {
                            if (_this.tabGeneral && _this.tabGeneral.getActiveTemplate().idComponent == 1 && !_this.Eliminar.disabled) {
                                _this.Eliminar.fireEvent('click');
                            } else if (_this.accion && _this.accion == 'gestagrupacion' && !_this.Eliminar.disabled) {
                                _this.Eliminar.fireEvent('click');
                            }
                        }
                    }
                ]);
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproducto',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: true
        });
        if (_this.ventana) {
            this.addGridColumn({
                header: _this.idioma.lbCMEstatus,
                dataIndex: 'estado',
                width: 100,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'icondistra-aceptar verde';
                    }
                    else {
                        metaData.css = 'icondistra-cancelar rojo';
                    }
                },
                default: true

            });
            this.addGridColumn({
                header: _this.idioma.lbCMDenominacion,
                dataIndex: 'denominacion',
                autoExpand: true,
                default: true
            });

        } else {

            this.addGridColumn({
                header: _this.idioma.lbCMDenominacion,
                dataIndex: 'denominacion',
                autoExpand: true,
                agrupador: true,
                default: true

            });
            this.addGridColumn({
                header: _this.idioma.lbCMIdentificador,
                dataIndex: 'nroinventario',
                default: true
            });
        }

    },
    initDefaultButtons: function() {
        var _this = this;
        this.Adicionar = new LOG.util.Prototipos.botonAdicionar({
            text: "Ad<u>i</u>cionar",
            tooltip: _this.idioma.lbTtBtnAdicionarNom,
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'I'
            },
            listeners: {
                'click': function() {
                    if (_this.winAddNoInventario == null || !_this.winAddNoInventario.isVisible()) {
                        _this.gestionarNoinventario('adic');
                    }
                }
            }
        });
        this.Eliminar = new LOG.util.Prototipos.botonEliminar({
            tooltip: _this.idioma.lbTtBtnEliminarNom,
            disabled: true,
            listeners: {
                'click': function() {
                    if (_this.ventana) {
                        mostrarMensaje(2, _this.idioma.lbMsgElimiNomModulo, function eliminar(btnPresionado) {
                            if (btnPresionado == 'ok') {
                                if (_this.getSmPrincipal().hasSelection()) {
                                    var seleccionados = _this.getSmPrincipal().getSelections();
                                    var moduloslog = new Array();
                                    for (var i = 0; i < seleccionados.length; i++) {
                                        moduloslog[i] = {
                                            idproducto: seleccionados[i].data.idproducto
                                        }
                                    }
                                    var mensajes = new Array();
                                    mensajes[0] = _this.idioma.labEliminando;
                                    mensajes[1] = _this.idioma.MsgEliminarModulologicoOK;
                                    mensajes[2] = 0;
                                    mensajes[3] = _this.idioma.MsgEliminarModulologicoError;
                                    _this.enviarDatos('/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/eliminarNomenclaturaModulo', mensajes, moduloslog);
                                }
                            }
                        });
                    } else {
                        _this.eliminarModuloLogico();
                    }

                }
            }
        });
        this.Modificar = new LOG.util.Prototipos.botonModificar({
            text: "<u>M</u>odificar",
            tooltip: _this.idioma.lbTtBtnModificarNom,
            disabled: true,
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'M'
            },
            listeners: {
                'click': function() {
                    if (_this.winAddNoInventario == null || !_this.winAddNoInventario.isVisible()) {
                        _this.gestionarNoinventario('mod');
                    }
                }
            }
        });

        this.addToolbarButton(_this.Adicionar);
        this.addToolbarButton(_this.Modificar);
        this.addToolbarButton(_this.Eliminar);
        if (_this.ventana) {
            this.Activar = LOG.util.UIManager.createBtn({
                iconCls: 'habilitar',
                disabled: true,
                text: _this.idioma.btnActivar,
                tooltip: _this.idioma.bTtBtnActivarNom,
                handler: function() {
                    var datos = _this.getSmPrincipal().getSelections();
                    var datoshabilitar = Array();
                    for (var i = 0; i < datos.length; i++) {
                        if (datos[i].data != '' || datos[i].data != null) {
                            datoshabilitar.push(datos[i].data.idproducto);
                        }
                    }
                    Ext.Ajax.request({
                        url: 'habilitar',
                        method: 'POST',
                        params: {
                            idproducto: Ext.encode(datoshabilitar)
                        },
                        callback: function(options, success, response) {
                            response = Ext.util.JSON.decode(response.responseText);
                            _this.getStorePrincipal().load();
                            if (response.msg == 1) {
                                mostrarMensaje(1, "La agrupaci&oacute;n ha sido activada.");
                            }
                        }
                    });

                }
            })
            this.addToolbarButton(_this.Activar);
        }
    },
    gestionarNoinventario: function(opcion) {

        var _this = this;
        // para cuando se comporta como una ventana.
        this.gestDenom = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            fieldLabel: _this.idioma.lbDenominacion,
            width: '100%',
            //height: 65,
            maxLength: '255',
            allowBlank: false,
            regex: LOG.util.Regex.cadena,
            maskRe: LOG.util.Regex.cadena,
            enableKeyEvents: true,
            selectOnFocus: true,
            regexText: "Solo admite caracteres alfanum&eacute;ricos.",
        });

        // para cuando se comporta como un panel
        this.comboNomenlcaturaModulo = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbDenominacion,
            hiddenName: 'idproducto',
            valueField: 'denominacion',
            displayField: 'denominacion',
            allowBlank: false,
            typeAhead: false,
            autoLoad: false,
            forceSelection: false,
            // autoCreate: true,
            mode: 'local',
            enableKeyEvents: true,
            anchor: '95%',
            regex: LOG.util.Regex.cadena,
            maskRe: LOG.util.Regex.cadena,
            maxLength: '255',
            minLength: '1',
            url: '/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/getModuloLogico',
            regexText: _this.idioma.lbContenidoSinEspacios,
        });
        _this.comboNomenlcaturaModulo.store.load({
            params: {
                interfazNrodinventario: 1,
                idarea: _this.idarea
            }
        });
        this.textfieldInventario = new LOG.util.Prototipos.inputEntero({
            name: 'nroinventario',
            anchor: '95%',
            maxLength: '19',
            maxLengthText: "El tamaño máximo requerido es 19 d&iacute;gitos.",
            fieldLabel: this.idioma.lbCMIdentificador,
            // emptyText: _this.idioma.lbCbVacio,
            regexText: _this.idioma.lbValorIncorrecto,
            allowBlank: false,
        });

        this.clsPanel = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        if (_this.ventana) {
            this.clsPanel.addComponent(_this.gestDenom);
        } else {
            this.clsPanel.addComponent(_this.comboNomenlcaturaModulo);
            this.clsPanel.addComponent(_this.textfieldInventario);
        }

        this.fpFormularioSolicitud = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            layout: 'form',
            anchor: '100%',
            autoHeight: true,
            //bodyStyle: 'padding: 10px 10px 0 10px; margin-bottom:10px',
            listeners: {
                'clientvalidation': function(fp, valid) {
                    var checkdirty = false;
                    if (_this.ventana) {
                        if (_this.fpFormularioSolicitud.getForm().isDirty() && _this.fpFormularioSolicitud.getForm().isValid()) {
                            _this.winAddNoInventario.listaBotones.getItem(2).enable();
                            _this.winAddNoInventario.listaBotones.getItem(1).enable();
                        } else {
                            _this.winAddNoInventario.listaBotones.getItem(2).disable();
                            _this.winAddNoInventario.listaBotones.getItem(1).disable();
                        }
                    } else {
                        if (_this.fpFormularioSolicitud.getForm().isDirty() && _this.fpFormularioSolicitud.getForm().isValid()) {
                            _this.winAddNoInventario.listaBotones.getItem(2).enable();
                            _this.winAddNoInventario.listaBotones.getItem(1).enable();
                        } else {
                            _this.winAddNoInventario.listaBotones.getItem(2).disable();
                            _this.winAddNoInventario.listaBotones.getItem(1).disable();
                        }
                    }
                }
            },
            defaults: {
                anchor: '100%',
                msgTarget: 'side'
            },
            items: [_this.clsPanel]
        });

        if (opcion == "mod") {
            var record = _this.getSmPrincipal().getSelected();
            if (record) {
                if (_this.ventana) {
                    _this.gestDenom.setValue(record.data.denominacion);
                    _this.gestDenom.originalValue = record.data.denominacion;
                } else {
                    _this.textfieldInventario.setValue(record.data.nroinventario);
                    _this.textfieldInventario.originalValue = record.data.nroinventario;
                    _this.comboNomenlcaturaModulo.setValue(record.data.denominacion);
                    _this.comboNomenlcaturaModulo.originalValue = record.data.denominacion;
                }

            } else {
                mostrarMensaje(1, _this.idioma.MsgNoSelecAgrupacion);
                return;
            }
        }
        _this.winAddNoInventario = new Ext.LOG.moduloMedio.winAddNoInventario({
            idioma: _this.idioma,
            opcion: opcion,
            scope: _this,
            self: _this.self,
            record: record
        });
        _this.winAddNoInventario.show();
    },
    eliminarModuloLogico: function() {
        var _this = this;
        var sm = _this.getSmPrincipal();
        if (sm.hasSelection()) {
            mostrarMensaje(2, _this.idioma.lbMsgElimiNomModulo, function(btn) {
                if (btn == 'ok') {
                    var seleccionados = sm.getSelections();
                    var moduloslog = new Array();
                    for (var i = 0; i < seleccionados.length; i++) {
                        moduloslog[i] = {
                            idregnumerico: seleccionados[i].data.idregnumerico
                        };
                    }

                    var mensajes = new Array();
                    mensajes[0] = "Eliminando datos de la agrupaci\xf3n";
                    mensajes[1] = _this.idioma.MsgEliminarmoduloLogicoAsociadoOK;
                    mensajes[2] = 0;
                    mensajes[3] = _this.idioma.MsgEliminarmoduloLogicoAsociadoError;
                    _this.enviarDatos('/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/eliminarModuloAsociadoNroinventario', mensajes, moduloslog);
                }
            });
        } else {
            mostrarMensaje(1, _this.idioma.MsgNoSelecAgrupacion);
        }
    },
    render: function() {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.panelNomenModP.superclass.render.call(this);
        this.getStorePrincipal().load({
            params: {
                interfazNrodinventario: (_this.formaVisualizacion == 'ventana') ? 1 : 2,
                idarea: _this.idarea,
                accion: (_this.formaVisualizacion == 'ventana') ? 'gestagrupacion' : false,
                idnaturaleza: (_this.objetoobra) ? natobjobraP : natinmuebleP,
                objetoobra: (_this.objetoobra) ? _this.objetoobra: false,
            }
        });
        this.vistaPrincipal.closeAction = 'destroy';
        this.smGridPrincipal.on({
            'rowselect': function(sm, row, record) {

                if (sm.getSelections().length == 1) {
                    _this.Modificar.enable();
                    _this.Eliminar.enable();
                }
                else if (sm.getSelections().length > 1) {
                    _this.Eliminar.enable();
                    _this.Modificar.disable();
                }

            },
            'rowdeselect': function(sm, row, record) {

                if (sm.getSelections().length <= 0) {
                    _this.Modificar.disable();
                    _this.Eliminar.disable();
                }
                else if (sm.getSelections().length == 1) {
                    _this.Modificar.enable();
                } else {
                    _this.Eliminar.enable();
                    _this.Modificar.disable();
                }

            }
        });
        vista.fireEvent = vista.fireEvent.createSequence(function(e) {
            if (e == 'show')
            {
                _this.keyMap.stopEvent = true;
            }
            if (e == 'hide') {
                _this.keyMap.stopEvent = false;
            }
        });
        return vista;
    },
    enviarDatos: function(url, mensajes, datos) {
        var _this = this;
        Ext.MessageBox.wait(mensajes[0], _this.idioma.msgEspere);
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: {
                datos: Ext.encode(datos),
                idarea: _this.idarea
            },
            callback: function(options, success, response) {
                response = Ext.util.JSON.decode(response.responseText);
                Ext.MessageBox.hide();
                if (response.msg == 3) {
                    mostrarMensaje(response.msg, mensajes[3]);

                } else if (response.msg == 2) {
                    mostrarMensaje(response.msg, mensajes[2]);

                } else if (response.msg == 1) {
                    mostrarMensaje(1, mensajes[1]);
                    _this.getStorePrincipal().load();
                }
            }
        });

    }

});


Ext.LOG.moduloMedio.winAddNoInventario = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        config.resizable = false;
        this.usarAplicar = true;
        this.closeAction = 'close';
        this.idioma = config.idioma;
        Ext.LOG.moduloMedio.winAddNoInventario.superclass.constructor.call(this, config);
        if (this.scope.ventana) {
            this.setTitle((this.opcion == 'adic') ? this.idioma.lbTitleWInAdicionarnomenclatura : this.idioma.lbTitleWInModificarnomenclatura);
        } else {
            this.setTitle((this.opcion == 'adic') ? this.idioma.lbTitleWinAdicionarNoinventario : this.idioma.lbTitleWinModificarNoinventario);
        }

        this.panelDatos();
        this.width = 400;
        this.height = 190;
    },
    initComponent: function(config) {
        var _this = this;
        Ext.LOG.moduloMedio.winAddNoInventario.superclass.initComponent.call(this);

        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function() {
                {
                    var _this = this;
                    _this.keyMap.stopEvent = true;
                    if (_this.scope.ventana) {

                        if (_this.scope.fpFormularioSolicitud.getForm().isDirty()
                                && _this.scope.fpFormularioSolicitud.getForm().isValid()) {

                            var valor = _this.scope.gestDenom.getValue()
                            if (!valor) {
                                mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                                return;
                            }
                            if (_this.opcion == 'adic') {
                                _this.adicionarNomenlcaturaModulo(valor.replace(/^\s+|\s+$/g));
                                _this.close();
                            } else {
                                _this.modificarNomenclaturaModulo(valor.replace(/^\s+|\s+$/g, ""));
                                _this.close();
                            }
                        } else {
                            mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                        }
                    } else {
                        if (_this.scope.fpFormularioSolicitud.getForm().isDirty()
                                && _this.scope.fpFormularioSolicitud.getForm().isValid()) {
                            var datos = new Array();
                            if (_this.scope.comboNomenlcaturaModulo.getValue()) {
                                datos[0] = _this.scope.comboNomenlcaturaModulo.getValue();
                            }
                            else {
                                datos[0] = _this.scope.comboNomenlcaturaModulo.getRawValue().trim();
                            }

                            if (_this.record && _this.opcion == 'mod') {
                                var combo = false;
                                var Inventario = false
                                if (_this.scope.comboNomenlcaturaModulo.originalValue != _this.scope.comboNomenlcaturaModulo.getRawValue()) {
                                    combo = true;
                                }

                                if (_this.scope.textfieldInventario.isDirty()) {
                                    Inventario = true;
                                }

                                if (!combo && !Inventario) {

                                }
                                else if (_this.scope.textfieldInventario.isDirty()) {

                                    datos[0] = _this.scope.comboNomenlcaturaModulo.getRawValue();
                                    datos[1] = _this.scope.textfieldInventario.getValue();
                                    datos[2] = _this.record.data.idregnumerico;
                                    datos[3] = "mod";
                                    _this.modificarNomenclaturaModulo(datos, _this.scope.idarea);
                                    //_this.close();
                                } else {
                                    datos[0] = _this.scope.comboNomenlcaturaModulo.getRawValue();
                                    datos[1] = _this.scope.textfieldInventario.getValue();
                                    datos[4] = true;
                                    datos[2] = _this.record.data.idregnumerico;
                                    datos[3] = "mod";
                                    _this.modificarNomenclaturaModulo(datos, _this.scope.idarea);
                                    //_this.close();
                                }


                            } else {
                                datos[1] = _this.scope.textfieldInventario.getValue();
                                _this.asocianomenclaturanroIneventario(datos, _this.scope.idarea, true);
                                // _this.close();
                            }
                        } else {
                            mostrarMensaje(2, _this.idioma.lbValoresIncorrectos);
                        }
                    }

                }
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            disabled: true,
            hidden: (_this.opcion != 'adic'),
            handler: function() {
                {
                    var _this = this;
                    if (_this.scope.ventana) {

                        if (_this.scope.fpFormularioSolicitud.getForm().isDirty()
                                && _this.scope.fpFormularioSolicitud.getForm().isValid()) {

                            var valor = _this.scope.gestDenom.getValue();
                            if (!valor) {
                                mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                                return;
                            }
                            _this.adicionarNomenlcaturaModulo(valor.replace(/^\s+|\s+$/g));
                            _this.scope.gestDenom.reset();
                            _this.scope.gestDenom.focus(false, 1000);
                            //_this.close();

                        } else {
                            mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                        }
                    } else {
                        if (_this.scope.fpFormularioSolicitud.getForm().isDirty()
                                && _this.scope.fpFormularioSolicitud.getForm().isValid()) {
                            var datos = new Array();
                            if (_this.scope.comboNomenlcaturaModulo.getValue()) {
                                datos[0] = _this.scope.comboNomenlcaturaModulo.getValue();
                            }
                            else {
                                datos[0] = _this.scope.comboNomenlcaturaModulo.getRawValue().trim();
                            }

                            datos[1] = _this.scope.textfieldInventario.getValue();
                            _this.asocianomenclaturanroIneventario(datos, _this.scope.idarea, false);
                            _this.scope.comboNomenlcaturaModulo.clearValue();
                            _this.scope.textfieldInventario.reset();
                            _this.scope.comboNomenlcaturaModulo.focus(false, 1000);
                        } else {
                            mostrarMensaje(2, _this.idioma.lbValoresIncorrectos);
                        }
                    }

                }
            }
        });
         LOG.util.UIManager.apply(this.listaBotones.getItem(0),{
              handler: function() {
                this.destroy();
                _this.keyMap.stopEvent = true;
              }
         })
    },
    panelDatos: function() {
        var _this = this;

        this.add(_this.scope.fpFormularioSolicitud);
    },
    modificarNomenclaturaModulo: function(datos) {

        var _this = this;
        var bandera = true;


        var mensajes = new Array();
        mensajes[0] = "Guardando datos de la agrupaci\xf3n";
        mensajes[1] = _this.idioma.MsgModificarModulologicoOK;
        mensajes[3] = _this.idioma.MsgAsociarModulologicoErrorInventario;

        if (_this.scope.ventana) {
            if (_this.scope.getSmPrincipal().hasSelection()) {
                _this.scope.getStorePrincipal().load();
                var verificar = _this.scope.getStorePrincipal().find('denominacion', datos);
                if (verificar != -1) {
                    mostrarMensaje(1, "La agrupación ya existe");
                    return;
                }
                var datosmod = new Array();
                datosmod[0] = {
                    idproducto: _this.scope.getSmPrincipal().getSelected().data.idproducto,
                    denominacion: datos
                }
                this.enviarDatos('/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/modificandoNomenlcaturaModulo', mensajes, datosmod);
                bandera = false;
            }
        }

        if (bandera) {
            this.enviarDatos('/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/asociarNomenclaturaNroInventario', mensajes, datos);
        }

    },
    asocianomenclaturanroIneventario: function(datos, idarea, aceptar) {
        var _this = this;
        var mensajes = new Array();
        mensajes[0] = "Guardando datos de la agrupaci\xf3n";
        mensajes[1] = _this.idioma.MsgAsociarModulologicoOK;
        mensajes[2] = _this.idioma.MsgAdicionarModuloLogicoExiste;
        mensajes[3] = _this.idioma.MsgAsociarModulologicoErrorInventario;

        this.enviarDatos('/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/asociarNomenclaturaNroInventario', mensajes, datos, idarea, aceptar);
    },
    enviarDatos: function(url, mensajes, datos, idarea, aceptar) {
        var _this = this;
        Ext.MessageBox.wait(mensajes[0], _this.idioma.msgEspere);
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: {
                datos: Ext.encode(datos),
                idarea: _this.scope.idarea
            },
            callback: function(options, success, response) {
                response = Ext.util.JSON.decode(response.responseText);
                Ext.MessageBox.hide();
                if (response.msg == 3) {
                    if (_this.scope.textfieldInventario && aceptar) {
                        _this.scope.textfieldInventario.reset();
                        _this.scope.comboNomenlcaturaModulo.clearValue();
                        _this.scope.comboNomenlcaturaModulo.focus(false, 1000);
                    }
                    mostrarMensaje(2, mensajes[3]);
                } else if (response.msg == 2) {
                    mostrarMensaje(response.msg, mensajes[2]);

                } else if (response.msg == 1) {
                    if (aceptar || datos[3] == 'mod') {
                        _this.close();
                    }
                    mostrarMensaje(1, mensajes[1]);
                    _this.scope.getStorePrincipal().load();
                }
            }
        });

    },
    adicionarNomenlcaturaModulo: function(denominacion, idarea, aceptar) {
        var _this = this;
        var mensajes = new Array();
        mensajes[0] = _this.idioma.labAdicionando;
        mensajes[1] = _this.idioma.MsgAdicionarModulologicoOK;
        mensajes[2] = _this.idioma.MsgAdicionarModuloLogicoExiste;
        mensajes[3] = _this.idioma.MsgAdicionarModulologicoError;
        this.enviarDatos('/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/adicionarNomenlcaturaModulo', mensajes, denominacion, idarea);
    },
});

