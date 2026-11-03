Utilidades.Cmp.CmpCrudFondoTiempo = function () {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.identidadselected = null;
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
    //componente para el manejo de los mensajes de espera
    this.barraProgreso = new BarraEstado();
    //objeto del componente "gestion documental"

    this.CrearWinCrudFondoTiempo = function (parametros) {
        if (parametros.tipoInterfaz == 'estructura') {
            this.tfbuscarEstructuras = new Ext.form.TextField(
                {
                    id: 'tfbuscarEstructurasComp',
                    nextTab: 'btnBuscarEntidadComp',
                    prevTab: 'btnAceptarCompartir',
                    enableKeyEvents: true,
                    regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                    maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                    regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                    vtype: 'validarEspaciosEnBlanco',
                    maxLength: 255,
                    width: 150,
                    listeners: {
                        keydown: function (tf, e) {
                            if (e.getKey() == 13) {
                                if (tf.isValid() && tf.getValue() != '') {
                                    _this.tpBaseEstructura.getRootNode().reload();
                                }
                            }
                        },
                        keyup: function (tf, e) {
                            if (tf.getValue() != '') {
                                _this.btnLimpiarEstructuras.enable();
                                if (tf.isValid()) {
                                    _this.btnbuscarEstructuras.enable();
                                } else {
                                    _this.btnbuscarEstructuras.disable();
                                }
                            } else {
                                _this.btnLimpiarEstructuras.disable();
                                _this.btnbuscarEstructuras.disable();
                            }
                        }
                    }
                });
            this.btnbuscarEstructuras = new Ext.Button({
                iconCls: 'buscar',
                id: 'btnBuscarEntidadComp',
                tooltip: 'Buscar estructura <b>(Alt+B)</b>',
                disabled: true,
                nextTab: 'btnLimpiarEstructurasComp',
                prevTab: 'tfbuscarEstructurasComp',
                handler: function () {
                    _this.tpBaseEstructura.getRootNode().reload();
                },
                key: {
                    alt: true,
                    key: 'B'
                },
                scope: this
            });
            this.btnLimpiarEstructuras = new Ext.Button({
                iconCls: 'limpiar',
                id: 'btnLimpiarEstructurasComp',
                tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>',
                disabled: true,
                nextTab: 'btnExpandirEntidadComp',
                prevTab: 'btnBuscarEntidadComp',
                handler: function () {
                    _this.tfbuscarEstructuras.reset();
                    _this.btnbuscarEstructuras.disable();
                    _this.btnLimpiarEstructuras.disable();
                    _this.tpBaseEstructura.getRootNode().reload();
                },
                key: {
                    alt: true,
                    key: 'L'
                },
                scope: this
            });

            this.loaderTreeBaseEstructura = new Ext.tree.TreeLoader({
                dataUrl: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/cargarEntidades',
                listeners: {
                    beforeload: function (tl, n) {
                        var text = _this.tfbuscarEstructuras.getValue();
                        this.baseParams = {
                            idEstructuraPadre: n.attributes.idEstructuraPadre,
                            denominacion: text

                        };
                    }
                }
            });

            this.tpBaseEstructura = new Ext.tree.TreePanel({
                autoScroll: true,
                layout: 'fit',
                border: false,
                height: 400, //Para modificar tener en cuenta el tamanno de la ventana de Compartir configuracion
                id: 'tpBaseEstructura',
                tbar: ['Buscar:', '', _this.tfbuscarEstructuras, _this.btnbuscarEstructuras,
                    _this.btnLimpiarEstructuras, '-',
                    {
                        id: 'btnExpandirEntidadComp',
                        iconCls: 'expandir',
                        tooltip: 'Expandir todas las entidades',
                        nextTab: 'btnContraerEntidadComp',
                        prevTab: 'btnLimpiarEstructurasComp',
                        handler: function () {
                            _this.tpBaseEstructura.root.expand(true);
                            _this.actualizarBarraHerramientasEstructura('expandir');
                        }
                    },
                    {
                        id: 'btnContraerEntidadComp',
                        iconCls: 'contraer',
                        tooltip: 'Contraer todas las entidades',
                        nextTab: 'btnActualizarEntidadComp',
                        prevTab: 'btnExpandirEntidadComp',
                        handler: function () {
                            _this.tpBaseEstructura.root.collapse(true);
                            _this.actualizarBarraHerramientasEstructura('contraer');
                        }
                    },
                    {
                        id: 'btnActualizarEntidadComp',
                        iconCls: 'actualizar',
                        tooltip: 'Refrescar todas las entidades',
                        nextTab: 'btnCancelarComp',
                        prevTab: 'btnContraerEntidadComp',
                        handler: function () {
                            _this.tfbuscarEstructuras.reset();
                            _this.tpBaseEstructura.getRootNode().reload();
                            _this.identidadselected = 0;
                            _this.actualizarBarraHerramientasEstructura('actualizar');
                        }
                    }
                ],
                listeners: {
                    click: function (n, e) {
                        _this.tpBaseEstructura.getSelectionModel().select(n);
                        _this.identidadselected = n.id;
                        if (n.leaf) {
                            eshoja = 1;
                        } else {
                            eshoja = 0;
                        }
                        if (_this.identidadselected != null && _this.identidadselected != 0) {
                            Ext.getCmp('btnAplicarComp').enable();
                            Ext.getCmp('btnAceptarCompartir').enable();
                        } else {
                            Ext.getCmp('btnAplicarComp').disable();
                            Ext.getCmp('btnAceptarCompartir').disable();
                        }

                    },
                    beforeexpandnode: function (node) {
                        _this.actualizarBarraHerramientasEstructura('expandir');
                    },
                    beforecollapsenode: function (node) {
                        _this.actualizarBarraHerramientasEstructura('contraer');
                    },
                    load: function (node) {
                        _this.actualizarBarraHerramientasEstructura('actualizar');
                    }

                },
                loader: _this.loaderTreeBaseEstructura,
                root: new Ext.tree.AsyncTreeNode({
                    text: 'Entidades',
                    tipo: 0,
                    expanded: true,
                    id: '0'
                })

            });

            if (_this.winCompartir) {
                _this.winCompartir.destroy();
            }
            this.winCompartir = new Ext.Window({
                title: 'Compartir configuraci&oacute;n',
                closable: true,
                draggable: true,
                modal: true,
                closeAction: 'destroy',
                resizable: false,
                width: 350,
                height: 450,
                cls: 'winCompartirConf',
                items: [_this.tpBaseEstructura],
                buttons: [
                    {
                        iconCls: 'cancelar',
                        id: 'btnCancelarComp',
                        text: 'Cancelar',
                        nextTab: 'btnAplicarComp',
                        prevTab: 'btnActualizarEntidadComp',
                        handler: function () {
                            _this.winCompartir.destroy();
                        },
                        tooltip: 'Cerrar ventana sin guardar los datos'
                    }, {
                        iconCls: 'aplicar',
                        id: 'btnAplicarComp',
                        text: 'Aplicar',
                        nextTab: 'btnAceptarCompartir',
                        prevTab: 'btnCancelarComp',
                        disabled: true,
                        handler: function () {
                            _this.compartirConf(parametros, 'aplicar');
                        },
                        tooltip: 'Guardar datos y limpiar los campos'
                    }, {
                        iconCls: 'aceptar',
                        id: 'btnAceptarCompartir',
                        tooltip: 'Guardar datos y cerrar ventana',
                        text: 'Aceptar',
                        nextTab: 'tfbuscarEstructurasComp',
                        prevTab: 'btnAplicarComp',
                        disabled: true,
                        handler: function () {
                            _this.compartirConf(parametros, 'adicionar');
                        }
                    }],
                listeners: {}
            });
            _this.winCompartir.on('beforeshow', function () {
                Ext.getCmp('btnCancelarComp').focus(true, 700);
            });
            _this.winCompartir.doLayout();
            _this.winCompartir.show();
            Ext.getCmp('btnCancelarComp').focus(false, 1024);
        } else {

        }


    };

    this.compartirConf = function (parametros, accion) {
        if (_this.identidadselected != null && _this.identidadselected != 0) {
            var idEntidadCompartir = parametros.idEntidadCompartir;
            if (_this.identidadselected != idEntidadCompartir) {
                var anno = parametros.anno;
                _this.barraProgreso.show('Guardando datos.');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/compartirConfiguracion',
                    method: 'POST',
                    params: {
                        idestructura: _this.identidadselected + parametros.idPanelPrincipal,
                        idestructuracompartir: idEntidadCompartir,
                        anno: anno
                    },
                    callback: function (options, success, response) {
                        _this.barraProgreso.hide();
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.cod == 1) {
                            mostrarMensaje(1, 'La configuraci&oacute;n de la entidad seleccionada ha sido guardada satisfactoriamente.');
                        } else if (responseData.cod == 2) {
                            mostrarMensaje(1, 'Ha ocurrido un error al guardar la configuraci&oacute;n de alguno(s) tipo(s) de d&iacute;a(s).');
                        } else if (responseData.cod == 3) {
                            mostrarMensaje(1, 'Ha ocurrido un error al guardar la configuraci&oacute;n.');
                        }
                        if (accion == 'adicionar') {
                            _this.winCompartir.destroy();
                        } else {
                            _this.tpBaseEstructura.getSelectionModel().select(_this.tpBaseEstructura.root);
                            _this.identidadselected = 0;
                            Ext.getCmp('btnAplicarComp').disable();
                            Ext.getCmp('btnAceptarCompartir').disable();
                        }
                    }
                });
            } else {
                mostrarMensaje(1, 'No puede seleccionar la misma entidad para compartir su configuraci&oacute;n.');
            }
        } else {
            mostrarMensaje(1, 'Debe seleccionar una entidad para cambiar su configuraci&oacute;n.');
        }
    }

    this.actualizarBarraHerramientasEstructura = function (accion) {
        if (_this.tpBaseEstructura.getRootNode().childNodes.length == 0) {
            Ext.getCmp('btnExpandirEntidadComp').setDisabled(true);
            Ext.getCmp('btnContraerEntidadComp').setDisabled(true);
        } else {
            if (accion == 'contraer') {
                Ext.getCmp('btnExpandirEntidadComp').setDisabled(false);
                Ext.getCmp('btnContraerEntidadComp').setDisabled(true);
            } else if (accion == 'expandir' || accion == 'actualizar') {
                Ext.getCmp('btnExpandirEntidadComp').setDisabled(true);
                Ext.getCmp('btnContraerEntidadComp').setDisabled(false);
                if (accion == 'actualizar') {
                    _this.tfbuscarEstructuras.reset();
                    _this.btnbuscarEstructuras.disable();
                    _this.btnLimpiarEstructuras.disable();
                }
            }
        }
    };

};
