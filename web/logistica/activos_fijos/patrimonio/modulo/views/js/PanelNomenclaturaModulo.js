Ext.LOG.moduloMedio.PanelNomenMod_EspecializacionP = Ext.extend(Ext.LOG.moduloMedio.PanelNomenMod, {
    constructor: function(config) {
        Ext.LOG.moduloMedio.moddat = null;
        Ext.apply(this, config);
        var _this = this;
        Ext.LOG.moduloMedio.PanelNomenMod_EspecializacionP.superclass.constructor.apply(this);


    },

    
    
    crearColumnas: function() {
        var _this = this;
        _this.columnasp = new Ext.grid.ColumnModel([
            _this.selectionM, new Ext.grid.RowNumberer({
                header: 'N\xBA.',
                width: 30
            }), {
                header: _this.idioma.lbCMEstatus,
                dataIndex: 'estado',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    }
                    else {
                        metaData.css = 'inactivo';
                    }
                },
                id: 'estatus',
                width: 100
            }, {
                header: _this.idioma.lbCMDenominacion,
                dataIndex: 'denominacion',
                id: 'idcoldenominacion'
            }]);
    },
    habilitar: function() {
        var _this = this;
        var datos = _this.Grid.getSelectionModel().getSelections();
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
                if (response.msg == 1) {
                    mostrarMensaje(1, "La agrupaci&oacute;n ha sido activada.");
                    _this.storep.reload();

                }
            }
        });
    },
    crearBotones: function() {
        var _this = this;

        Ext.LOG.moduloMedio.PanelNomenMod_EspecializacionP.superclass.crearBotones.apply(this);

        this.Activar = new Ext.Button({
            iconCls: 'aprobar',
            id: 'btnAprobarNomenclatura',
            disabled: true,
            text: _this.idioma.btnActivar,
            tooltip: _this.idioma.bTtBtnActivarNom,
            handler: function() {
                _this.habilitar();
                _this.Grid.getStore().load();
            }
        });
        this.BtnAdicionaNomenclatura = new LOG.util.Prototipos.botonAdicionar({
            //iconCls: 'adicionar',
            id: 'idbtnAddNomenclatura',
            //text: _this.idioma.btnAdicionarA,
            tooltip: _this.idioma.lbTtBtnAdicionarNom,
            handler: function() {
                _this.gestionarnomenclatura('adic');
            }
        });

        this.BtnModificarNomenclatura = new LOG.util.Prototipos.botonModificar({
            //iconCls: 'modificar',
            id: 'idbtnModNomenclatura',
            //text: _this.idioma.btnModificar,
            disabled: true,
            tooltip: _this.idioma.lbTtBtnModificarNom,
            handler: function() {
                _this.gestionarnomenclatura('mod');
            }
        });

        this.BtnEliminarNomenclatura = new Ext.Button({
            iconCls: 'eliminar',
            id: 'idbtnEliminarNomenclatura',
            disabled: true,
            text: _this.idioma.btnEliminar,
            tooltip: _this.idioma.lbTtBtnEliminarNom,
            handler: function() {

                _this.eliminarNomenclaturaModulo();
            }
        });

        _this.Grid.getSelectionModel().on('rowselect', function(sel, row, record) {
            (record.data.estado == "1") ? _this.Activar.disable() : _this.Activar.enable();
            var aux = false;
            for (var i = 0; i < sel.selections.items.length; i++) {
                if (_this.selectionM.selections.items[i].data.estado == 0) {
                    aux = true;
                    break;
                }
            }
            if (aux) {
                _this.BtnEliminarNomenclatura.disable();
            }

            if (sel.selections.items.length == 0) {
                _this.BtnModificarNomenclatura.disable();
                _this.BtnEliminarNomenclatura.disable();
            }
            else if (sel.selections.items.length == 1) {
                _this.BtnModificarNomenclatura.enable();
                _this.BtnEliminarNomenclatura.enable();

            } else {
                _this.BtnEliminarNomenclatura.enable();
                _this.BtnModificarNomenclatura.disable();
            }

        });

        _this.Grid.getSelectionModel().on('rowdeselect', function(sel, row, record) {

            if (sel.selections.items.length == 0) {
                _this.BtnModificarNomenclatura.disable();
                _this.BtnEliminarNomenclatura.disable();
            }
            else if (sel.selections.items.length == 1) {
                _this.BtnModificarNomenclatura.enable();
                _this.BtnEliminarNomenclatura.enable();
                _this.Activar.disable()
            } else {
                _this.BtnEliminarNomenclatura.enable();
                _this.BtnModificarNomenclatura.disable();
            }
            var aux = false;
            for (var i = 0; i < sel.selections.items.length; i++) {
                if (_this.selectionM.selections.items[i].data.estado == 0) {
                    aux = true;
                    break;
                }
            }
            if (aux) {
                _this.BtnEliminarNomenclatura.disable();
            }

            _this.Activar.disable();
            /* _this.BtnModificarNomenclatura.disable();
             _this.BtnEliminarNomenclatura.disable();*/
        });

        _this.Grid.getStore().on('load', function(store, records, options) {
            if (records.length > 0) {
                //_this.Grid.getSelectionModel().selectFirstRow();
            } else {
                _this.Activar.disable();
                _this.BtnModificarNomenclatura.disable();
                _this.BtnEliminarNomenclatura.disable();
            }
        });

        this.tbar = [_this.BtnAdicionaNomenclatura, _this.BtnModificarNomenclatura,
            _this.BtnEliminarNomenclatura, this.Activar];
    },
    gestionarnomenclatura: function(opcion) {

        var _this = this;
        var textfieldDenominacion = new Ext.form.TextArea({
            autoCreate: true,
            fieldLabel: _this.idioma.lbDenominacion,
            width: '100%',
            maxLength: '255',
            allowBlank: false,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            enableKeyEvents: true,
            selectOnFocus: true,
            value: (opcion == 'mod') ? _this.selectionM.getSelected().data.denominacion : '',
            regexText: "Este valor es incorrecto.",
            listeners: {
                'valid': function(field) {
                    field.valido = true
                    if (field.getValue().charAt(0) == ' ' || field.getValue().charAt(field.getValue().length - 1) == ' ') {
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                        field.valido = false;
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                        field.valido = false;
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.idioma.lbContenidoErroneo);
                                    field.valido = false;
                                }
                            }

                        }
                    }
                },
                'render': function(field) {
                    field.focus(false, 1000);
                }
            }
        });
        var fpFormularioSolicitud = new Ext.FormPanel({
            layout: 'form',
            frame: true,
            labelAlign: 'top',
            autoHeight: true,
            region: 'center',
            items: [textfieldDenominacion]
        });

        var ventanaGestionarNomenclatura = new Ext.Window({
            title: (opcion == 'adic') ? this.idioma.lbTitleWInAdicionarnomenclatura : this.idioma.lbTitleWInModificarnomenclatura,
            closeAction: 'close',
            resizable: false,
            layout: 'border',
            id: 'idWinGestNomenclaturaModulo',
            modal: true,
            width: 400,
            height: 166,
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: "Cancelar",
                    id: 'idbtnCancelarWinGestNomenclatura',
                    tooltip: _this.idioma.lbTtBtnCancelar,
                    handler: function() {
                        ventanaGestionarNomenclatura.close();
                    }
                },
                {
                    iconCls: 'aplicar',
                    text: 'Aplicar',
                    id: 'idbtnAplicarWinGestNomenclatura',
                    tooltip: _this.idioma.lbTtBtnAplicar,
                    hidden: (opcion == 'adic') ? false : true,
                    handler: function() {
                        // if(opcion == 'adic'){
                        if (!textfieldDenominacion.isDirty()) {

                        }
                        else if (!textfieldDenominacion.valido || !fpFormularioSolicitud.getForm().isValid()) {
                            mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                        } else {
                            var valor = textfieldDenominacion.getValue().trim();
                            if (!valor) {
                                mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                                return;
                            }
                            _this.adicionarNomenlcaturaModulo(valor.replace(/^\s+|\s+$/g, ""));
                            fpFormularioSolicitud.getForm().reset();
                        }

                        /* if (fpFormularioSolicitud.getForm().isValid()) {
                         var valor = textfieldDenominacion.getValue();
                         _this.adicionarNomenlcaturaModulo(valor.replace(/^\s+|\s+$/g, ""));
                         fpFormularioSolicitud.getForm().reset();
                         }
                         else {
                         mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                         
                         } */
                        // }
                        /*else{
                         if (fpFormularioSolicitud.getForm().isValid()) {
                         
                         if (!textfieldDenominacion.isDirty()) {
                         return;
                         }
                         
                         var valor = textfieldDenominacion.getValue();
                         
                         Ext.LOG.moduloMedio.moddat = valor;
                         if (opcion == 'mod') {
                         _this.modificarNomenclaturaModulo(valor.replace(/^\s+|\s+$/g, ""));
                         _this.Grid.getStore().reload();
                         }
                         } else {
                         mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                         }
                         }*/

                    }
                },
                {
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    id: 'idbtnAceptarWinGestNomenclatura',
                    tooltip: _this.idioma.lbTtBtnAceptar,
                    handler: function() {
                        if (fpFormularioSolicitud.getForm().isValid()) {

                            if (!textfieldDenominacion.isDirty()) {
                                ventanaGestionarNomenclatura.close();
                                return;
                            }

                            var valor = textfieldDenominacion.getValue().trim();
                            if (!valor) {
                                mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                                return;
                            }
                            if (opcion == 'adic') {

                                _this.adicionarNomenlcaturaModulo(valor.replace(/^\s+|\s+$/g, ""));
                                ventanaGestionarNomenclatura.close();
                                _this.Grid.getStore().load();
                            } else {
                                _this.modificarNomenclaturaModulo(valor.replace(/^\s+|\s+$/g, ""));
                                ventanaGestionarNomenclatura.close();
                            }
                        } else {
                            mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                        }
                    }
                }
            ],
            items: [fpFormularioSolicitud]
        });
        ventanaGestionarNomenclatura.show();

    },
    crearStore: function() {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});
        var _this = this;
        _this.hayDatos = false;
        _this.storep = new Ext.data.Store({
            url: '/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/getModuloLogico',
            autoLoad: true,
            listeners: {
                'beforeload': function() {
                    this.baseParams.interfazNrodinventario = 1;
                    this.baseParams.idarea = _this.idarea;
                    this.baseParams.accion = 'gestagrupacion';
                    myMask.show();
                },
                'load': function(st, records, options) {
                    myMask.hide();
                    if (records.length > 0) {
                        _this.selectionM.selectFirstRow();
                        _this.hayDatos = true;

                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idproducto'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'estado'
                }

            ])

        });
    },
    eliminarNomenclaturaModulo: function() {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbMsgElimiNomModulo, function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                if (_this.selectionM.hasSelection()) {
                    var seleccionados = _this.selectionM.getSelections();
                    var moduloslog = new Array();
                    for (var i = 0; i < seleccionados.length; i++) {
                        moduloslog[i] = {
                            idproducto: seleccionados[i].data.idproducto
                        }
                    }
                    var mensajes = new Array();
                    mensajes[0] = "Eliminando datos de la agrupaci\xf3n";
                    mensajes[1] = _this.idioma.MsgEliminarModulologicoOK;
                    mensajes[2] = 0;
                    mensajes[3] = _this.idioma.MsgEliminarModulologicoError;
                    _this.enviarDatos('/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/eliminarNomenclaturaModulo', mensajes, moduloslog);
                }
            }
        });
    },
    adicionarNomenlcaturaModulo: function(denominacion) {
        var _this = this;

        var mensajes = new Array();
        mensajes[0] = "Guardando datos de la agrupaci\xf3n";
        mensajes[1] = _this.idioma.MsgAdicionarModulologicoOK;
        mensajes[2] = _this.idioma.MsgAdicionarModuloLogicoExiste;
        mensajes[3] = _this.idioma.MsgAdicionarModulologicoError;
        this.enviarDatos('/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/adicionarNomenlcaturaModulo', mensajes, denominacion);
    },
    modificarNomenclaturaModulo: function(denominacion) {
        var _this = this;

        if (this.selectionM.hasSelection()) {
            var verificar = _this.Grid.getStore().find('denominacion', denominacion);
            if (verificar != -1) {
                mostrarMensaje(1, "La  agrupación ya existe");
                return;
            }

            var datosmod = new Array();

            datosmod[0] = {
                idproducto: this.selectionM.getSelected().data.idproducto,
                denominacion: denominacion
            }

            var mensajes = new Array();
            mensajes[0] = "Guardando datos de la agrupaci\xf3n";
            mensajes[1] = _this.idioma.MsgModificarModulologicoOK;
            mensajes[3] = _this.idioma.MsgModificarModulologicoError;
            this.enviarDatos('/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos/modificandoNomenlcaturaModulo', mensajes, datosmod);
        }
    },
    enviarDatos: function(url, mensajes, datos) {
        var _this = this;
        Ext.MessageBox.wait(mensajes[0], _this.idioma.msgEspere || '...');
        /*var myMask = new Ext.LoadMask(Ext.getBody(), {msg: mensajes[0]});
        myMask.show();*/
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
                if (response.msg == 2) {
                    mostrarMensaje(response.msg, mensajes[2]);

                } else {
                    mostrarMensaje(1, mensajes[1]);

                    _this.Grid.getStore().load();
                    _this.Eliminar.disable();
                    _this.Modificar.disable();
                }

            }
        });

    }, 
    creartbar: function() {
        var _this = this;
        _this.tbargrid = [
            new Ext.menu.TextItem(_this.idioma.lbDenominacion + ':' + '&nbsp;'), {
                xtype: 'textfield',
                name: 'denominacion',
                id: 'denomid',
                maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                regexText: _this.idioma.lbValorIncorrecto,
                maxLength: '255'
            }, {
                xtype: 'button',
                text: _this.idioma.lbBtnBuscar,
                iconCls: 'buscar',
                id: 'idbtnBuscarNomenclatura',
                tooltip: _this.idioma.lbTtBtnBuscar,
                handler: function() {
                    _this.onBuscar();
                }
            }, {
                xtype: 'button',
                text: _this.idioma.btnLimpiar,
                iconCls: 'limpiar',
                id: 'idbtnLimpiarNomenclatura',
                tooltip: _this.idioma.btnTLimpiar,
                handler: function() {
                    Ext.getCmp('denomid').reset();
                    _this.Grid.getStore().load();
                    _this.BtnModificarNomenclatura.disable();
                    _this.BtnEliminarNomenclatura.disable();
                    _this.Activar.disable();

                }
            }];
    },
    onBuscar: function() {
        var _this = this;
        if (Ext.getCmp('denomid').getValue() && Ext.getCmp('denomid').isValid() && _this.hayDatos) {
            _this.storep.baseParams.denominacion = Ext.getCmp('denomid').getValue();
            _this.storep.load({
                callback: function() {
                    if (_this.storep.getTotalCount() == 0) {
                        mostrarMensaje(1, _this.idioma.MsgNoExistenDatosBuscar)
                    }
                }
            });
            _this.storep.baseParams = {};
        } else {
            if (!_this.hayDatos) {
                mostrarMensaje(1, _this.idioma.MsgNoExistenDatosABuscar);
            }
        }
    }
});
