Ext.ns('Nomenclador.Panel');
Nomenclador.Panel.Gestion = Ext.extend(Ext.Panel, {
    title: '',
    name: '',
    /**
     * Nombre de la clase del nomenclador para la gestion dinamica
     */
    clase: '',
    etiquetas: etiquetas.nomencladores,
    elemento: '',
    store: null,
    columns: null,
    winGestion: null,
    /**
     * Id del nomenclador para la mensajería del util de php
     * */
    idTipoNomenclador: false,
    /**
     * Ultima parte de los mensajes para saber la conjugación del elemento
     * Ex: la agrupación seleccionada
     */
    mensajeEvento: '',
    mensajeCargando: '',
    functionBeforeLoad: null,
    hasFilter: false,
    hasWinGestion: false,
    formFiltro: null,
    /**
     * Funcion a ejecutar en caso de existir un filtro especifico y no
     * el por defecto
     */
    onBuscar: null,
    initComponent: function () {
        var _this = this;
        if (_this.formFiltro) {
            _this.hasFilter = true;
        }
        if (_this.winGestion) {
            _this.hasWinGestion = true;
        }
        _this.idSelected = null;
        _this.isActivate = false;
        _this.paramNomenclador = new Array();
        _this.paramNomenclador.push(_this.idTipoNomenclador);
        _this.selectionModel = new Ext.grid.RowSelectionModel({
            singleSelect: true, listeners: {
                selectionchange: function (_rs) {
                    if (_rs.hasSelection()) {
                        _this.btnEliminar.enable();
                        _this.btnModificar.enable();
                        _this.btnDesactivar.enable();
                    } else {
                        _this.btnEliminar.disable();
                        _this.btnModificar.disable();
                        _this.btnDesactivar.disable();
                    }
                }
            }
        });
        _this.gridPanel = new Ext.grid.GridPanel({
            frame: true,
            region: 'center',
            autoExpandColumn: 'denominacion',
            store: _this.store,
            sm: _this.selectionModel,
            columns: _this.columns,
            view: (_this.idTipoNomenclador == 10) ? new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "categorías" : "categoría"]})'
            }) : false,
            keys: [{
                key: Ext.EventObject.DELETE, fn: function () {
                    if (_this.idSelected && _this.btnEliminar.disabled == false) {
                        if (_this.selectionModel.getSelections().length > 0 && _this.selectionModel.getSelected().get('id') != 0) {
                            mostrarMensaje(2, "¿Está seguro que quiere eliminar " + _this.mensajeEvento + "?", function (btn) {
                                _this.idSelected = _this.selectionModel.getSelected().get('id');
                                _this.eventoNomenclador('eliminar', btn);
                            })
                        }
                    }
                }
            }, {
                key: "m", alt: true, fn: function () {
                    if (_this.isActivate) {
                        if (_this.selectionModel.getSelections().length > 0 && _this.selectionModel.getSelected().get('id') != 0) {
                            _this.idSelected = _this.selectionModel.getSelected().get('id');
                            _this.ventanaGestion(true);
                        }
                    }
                }
            }, //								{
                //										key: 'b',
                //										alt: true,
                //										fn : function ()
                //										{
                //												Ext.getCmp("filtroDenominacion_" + _this.name).focus(true, true);
                //										}
                //								}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15, store: _this.store, displayInfo: true
            }),
            viewConfig: {
                getRowClass: function (record) {
                    if (record.get('id') == _this.tempGrado && _this.idTipoNomenclador == 12) {
                        return 'fila-marcada';
                    } else {
                        return '';
                    }
                }
            },
            listeners: {
                load: function () {
                    _this.selectionModel.clearSelections();
                    _this.btnModificar.disable();
                    _this.btnDesactivar.disable();
                    _this.btnEliminar.disable();
                }, contextmenu: function (event) {
                    if (_this.idTipoNomenclador == 12) {
                        if (_this.selectionModel.hasSelection()) {
                            var esMarcado = (_this.tempGrado == _this.selectionModel.getSelected().data.id);
                            this.contextMenu = new Ext.menu.Menu({
                                subMenuAlign: 'bl', items: [{
                                    id: 'set',
                                    text: 'Marcar elemento',
                                    iconCls: 'aceptar',
                                    hidden: _this.tempGrado && esMarcado,
                                    handler: function () {
                                        _this.tempGrado = _this.selectionModel.getSelected().data.id;
                                        var options = _this.store.lastOptions;
                                        var start = options.params.start;
                                        _this.store.load({params: {start: start, limit: 15}});
                                    }
                                }, {
                                    id: 'unset',
                                    text: 'Desmarcar elemento',
                                    iconCls: 'cancelar',
                                    hidden: !esMarcado, //	icon   : perfil.dirImg + 'cancelar.png',
                                    handler: function () {
                                        _this.tempGrado = null;
                                        var options = _this.store.lastOptions;
                                        var start = options.params.start;
                                        _this.store.load({params: {start: start, limit: 15}});
                                    }
                                }, {
                                    id: 'encima',
                                    text: 'Situar encima',
                                    hidden: !_this.tempGrado || esMarcado,
                                    iconCls: 'arriba', //icon   : perfil.dirImg + 'arriba.png',
                                    handler: function () {
                                        _this.cambiarGrado(this.id);
                                    }
                                }, {
                                    id: 'debajo',
                                    text: 'Situar debajo',
                                    hidden: (!_this.tempGrado) || esMarcado,
                                    iconCls: 'abajo', //icon   : perfil.dirImg + 'abajo.png',
                                    handler: function () {
                                        _this.cambiarGrado(this.id);
                                    }
                                }, {
                                    id: 'intercambiar',
                                    text: 'Intercambiar',
                                    hidden: (!_this.tempGrado) || esMarcado,
                                    iconCls: 'asociar', //icon   : perfil.dirImg + 'asociar.png',
                                    handler: function () {
                                        _this.cambiarGrado(this.id);
                                    }
                                }]
                            });
                            this.contextMenu.showAt(event.getXY());
                        }
                    }
                }
            }
        });
        _this.tempGrado = null;
        if (!_this.hasFilter) {
            _this.store.on('beforeload', function (store, param) {
                param = _this.beforeload(param);
                return param;
            });
            _this.store.on('load', function () {
                Secodena.ocultarMascara('cargaini');
                Ext.getCmp(_this.idFoco).focus(false, 10);
            });
        }
        ;
        _this.selectionModel.on('rowselect', function (sm, rn, dataRecord) {
            _this.idSelected = dataRecord.data.id;
            if (dataRecord.data.id != 0) {
                _this.btnDesactivar.enable();
                _this.btnModificar.enable();
                _this.btnEliminar.enable();
            } else {
                _this.btnDesactivar.disable();
                _this.btnModificar.disable();
                _this.btnEliminar.disable();
            }
            if (_this.idTipoNomenclador != 18) {
                if (dataRecord.data.actual == "1" || dataRecord.data.visible == "1") {
                    _this.btnDesactivar.setText("Desactivar");
                    _this.btnDesactivar.setIconClass('icondistra-activar rojo')
                    _this.isActivate = true;
                } else {
                    _this.btnDesactivar.setText("Activar");
                    _this.btnDesactivar.setIconClass('icondistra-activar verde')
                    _this.btnEliminar.disable();
                    _this.btnModificar.disable();
                    _this.isActivate = false;
                }
            }
        });
        _this.btnAdicionar = new Ext.Button({
            text: _this.etiquetas.lbBtnAdicionar,
            //hidden : _this.idTipoNomenclador == 23,
            iconCls: 'adicionar',
            tooltip: _this.etiquetas.lbAdicionar + _this.elemento + " <b>(Alt+I)</b>",
            id: "btnAdicionar_" + _this.name,
            handler: function () {
                _this.idSelected = null;
                _this.ventanaGestion(false);
            }
        });
        _this.btnModificar = new Ext.Button({
            text: _this.etiquetas.lbBtnModificar,
            //hidden  : _this.idTipoNomenclador == 23,
            iconCls: 'modificar',
            disabled: true,
            tooltip: _this.etiquetas.lbModificar + _this.elemento + " <b>(Alt+M)</b>",
            id: "btnModificar_" + _this.name,
            handler: function () {
                _this.idSelected = _this.selectionModel.getSelected().get('id');
                _this.ventanaGestion(true);
            }
        })
        _this.btnDesactivar = new Ext.Button({
            text: "Desactivar",
            disabled: true, //						icon   : perfil.dirImg  + 'banderaroja.png',
            iconCls: 'activar rojo',
            hidden: _this.idTipoNomenclador == 18 /*|| _this.idTipoNomenclador == 23*/,
            tooltip: _this.etiquetas.lbBtnDesactivarActivar + ' ' + _this.elemento,
            id: "btnActivarDesactivar_" + _this.name,
            handler: function () {
                if (this.text == "Activar") {
                    mostrarMensaje(2, "¿Está seguro que quiere activar " + _this.mensajeEvento + "?", function (btn) {
                        _this.idSelected = _this.selectionModel.getSelected().get('id');
                        _this.eventoNomenclador('activar', btn)
                    })
                } else {
                    mostrarMensaje(2, "¿Está seguro que quiere desactivar " + _this.mensajeEvento + "?", function (btn) {
                        _this.idSelected = _this.selectionModel.getSelected().get('id');
                        _this.eventoNomenclador('desactivar', btn)
                    })
                }
            }
        })
        _this.btnEliminar = new Ext.Button({
            text: _this.etiquetas.lbBtnEliminar,
            disabled: true,
            //hidden  : _this.idTipoNomenclador == 23,
            iconCls: 'eliminar',
            tooltip: _this.etiquetas.lbBtnEliminar + _this.elemento + " <b>(Del)</b>",
            id: "btnEliminar_" + _this.name,
            handler: function () {
                mostrarMensaje(2, "¿Está seguro que quiere eliminar " + _this.mensajeEvento + "?", function (btn) {
                    _this.idSelected = _this.selectionModel.getSelected().get('id');
                    _this.eventoNomenclador('eliminar', btn)
                })
            }
        })

        _this.formularioImpSist = new Ext.FormPanel({
            bodyPadding: 10,
            fileUpload: true,
            layout: 'fit',
            id: 'formularioImpSist',
            name: 'formularioImpSist',
            frame: true,
            height: 100,
            border: false,
            bodyStyle: 'padding:5px 5px 2px',
            fieldDefaults: {
                msgTarget: 'side',
                //labelWidth: 80,
                labelAlign: 'top'
            },
            defaults: {anchor: '99.5%'},

            items: [{
                xtype: 'fieldset',
                id: 'fieldsetformImpSist',
                name: 'fieldsetformImpSist',
                defaultType: 'textfield',
                height: 100,
                defaults: {
                    anchor: '100%',
                    labelAlign: 'top',
                    style: 'padding: 8px 0 8px 0'
                },
                items: [
                    {
                        xtype: 'fileuploadfield',
                        name: 'fileUpload',
                        id: 'fileUpload',
                        labelAlign: 'top',
                        //fieldLabel: 'Seleccione el xml para importar',
                        //labelWidth: 50,
                        hideLabel:true,
                        msgTarget: 'qtip',
                        emptyText: 'Seleccione un xml',
                        allowBlank: false,
                        blankText: 'Este campo es obligatorio.',
                        buttonText: '',
                        buttonConfig: {
                            iconCls: 'buscar',
                            name: 'btnBuscarSistema',
                            id: 'btnBuscarSistema',
                            //text: 'Buscar',//'Buscar'
                            nextTab: 'cancelar',
                            prevTab: 'fileUpload'
                        }
                    }
                ]
            }],

            buttons: [{
                iconCls: 'cancelar',
                id: 'cancelar',
                nextTab: 'aceptar',
                prevTab: 'btnBuscarSistema',
                text: 'Cancelar',//'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                handler: function () {
                    _this.ventanaImportar.destroy();
                }

            }, {
                iconCls: 'aceptar',
                id: 'aceptar',
                nextTab: 'fileUpload',
                prevTab: 'cancelar',
                text: 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana',
                handler: function () {
                    _this.importarSistema(_this);
                }
            }]

        });

        _this.ventanaImportar = new Ext.Window({
            modal: true,
            title: 'Importar xml',//;
            autoScroll: true,
            autoHeight: true,
            width: 400,
            height: 165,
            closable: true,
            resizable: false,
            constrain: true,
            minimizable: true,
            layout: 'fit',
            items: [_this.formularioImpSist]
        });

        _this.btnImportar = new Ext.Button({
            hidden: true,
            text: "Importar",
            id: 'btnImportar',
            tooltip: 'Importa configuraciones del MTSS',
            iconCls: 'importar',
            handler: function () {
                _this.ventanaImportar.show();
            }
        });


        _this.eventFiltro = function (element) {
            if (element.getValue() != '') {
                _this.buscar();
            } else {
                _this.limpiar(_this)
            }
        }
        if (!_this.hasFilter) {
            _this.filtroDenominacion = new Ext.form.TextField({
                id: 'filtroDenominacion_' + _this.name,
                name: 'denominacion',
                vtype: 'vtdenominaciones',
                maxLength: 100,
                emptyText: "Criterio a buscar...",
                fieldLabel: "Denominación",
                anchor: '85%',
                allowBlank: true,
                enableKeyEvents: true,
                listeners: {
                    keyup: function () {
                        if (_this.filtroAbreviatura.getValue() != '' || _this.filtroDenominacion.getValue() != '') {
                            Ext.getCmp('btnAllA' + _this.name).enable();
                            Ext.getCmp('btnBuscar' + _this.name).enable();
                        } else {
                            Ext.getCmp('btnAllA' + _this.name).disable();
                            Ext.getCmp('btnBuscar' + _this.name).disable();
                        }
                    }
                }
            });
            _this.idFoco = "btnAdicionar_" + _this.name;
            _this.filtroAbreviatura = new Ext.form.TextField({
                id: 'filtroAbreviatura_' + _this.name,
                name: 'abreviatura',
                vtype: 'vtalfanumerico',
                maxLength: 10,
                emptyText: "Criterio a buscar...",
                fieldLabel: "Abreviatura",
                anchor: '85%',
                allowBlank: true,
                enableKeyEvents: true,
                listeners: {
                    keyup: function () {
                        if (_this.filtroAbreviatura.getValue() != '' || _this.filtroDenominacion.getValue() != '') {
                            Ext.getCmp('btnAllA' + _this.name).enable();
                            Ext.getCmp('btnBuscar' + _this.name).enable();
                        } else {
                            Ext.getCmp('btnAllA' + _this.name).disable();
                            Ext.getCmp('btnBuscar' + _this.name).disable();
                        }
                    }
                }
            });
            _this.formFiltro = new Ext.FormPanel({
                layout: 'column', region: 'north', cls: 'x-toolbar', height: 70, frame: true, defaults: {
                    layout: 'form', border: false, labelAlign: 'top', labelWidth: 50, buttonAlign: 'right'
                }, bodyBorder: false, border: false, autoScroll: true, hideBorders: true, keys: [{
                    key: Ext.EventObject.ENTER, fn: function () {
                        _this.buscar();
                    }
                }, {
                    key: 'b', alt: true, fn: function () {
                        _this.buscar();
                    }
                }, {
                    key: 'l', alt: true, fn: function () {
                        _this.limpiar(_this)
                    }
                }], items: [{
                    layout: 'form', columnWidth: .2, items: [_this.filtroDenominacion]
                }, {
                    layout: 'form', columnWidth: .2, items: [_this.filtroAbreviatura]
                }, {
                    columnWidth: '35px', bodyStyle: 'padding:19px 20px 0 0;', layout: 'form', items: [{
                        xtype: 'button',
                        tooltip: "Buscar " + _this.elemento + " <b>(Alt+B)</b>",
                        text: "<u>B</u>uscar", //icon   : perfil.dirImg  + 'buscar.png',
                        iconCls: 'buscar',
                        id: 'btnBuscar' + _this.name,
                        disabled: true,
                        handler: function () {
                            _this.buscar();
                        }
                    }]
                }, {
                    columnWidth: '35px', bodyStyle: 'padding:19px 0 0 0;', layout: 'form', items: [{
                        xtype: 'button',
                        tooltip: "Limpiar filtros <b>(Alt+L)</b>",
                        text: "<u>L</u>impiar",
                        id: 'btnAllA' + _this.name, //icon   : perfil.dirImg  + 'limpiar.png',
                        iconCls: 'limpiar',
                        disabled: true,
                        handler: function () {
                            _this.limpiar(_this);
                        }
                    }]
                }], listeners: {
                    clientvalidation: function (_form, _valid) {
                        if (!_valid) {
                            Ext.getCmp('btnAllA' + _this.name).disable()
                            Ext.getCmp('btnBuscar' + _this.name).disable()
                        }
                    }
                }
            });
        }
        ;
        _this.store.load({params: {start: 0, limit: 15}});
        Ext.apply(this, {
            layout: 'border',
            closable: true,
            tbar: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, _this.btnDesactivar, _this.btnImportar],
            items: [_this.formFiltro, _this.gridPanel],
            keys: [{
                key: 'i', alt: true, fn: function () {
                    _this.idSelected = null;
                    _this.ventanaGestion(false);
                }
            }]
        });

        if (_this.idTipoNomenclador == 20) {
            _this.btnImportar.setVisible(true);
        }

        Nomenclador.Panel.Gestion.superclass.initComponent.apply(this)
    },
    ventanaGestion: function (modificar) {
        var _this = this;
        switch (_this.idTipoNomenclador) {
            case 18:
                _this.winGestion = new Nomenclador.Icono({
                    name: _this.name,
                    title: _this.elemento,
                    store: _this.store,
                    modificar: modificar,
                    record: (modificar) ? _this.selectionModel.getSelected() : null,
                    idNomenclador: _this.idSelected,
                    texto: _this.mensajeCargando,
                    tipo: _this.idTipoNomenclador
                })
                break;
            case 22:
                _this.winGestion = new Nomenclador.Firma({
                    name: _this.name,
                    title: _this.elemento,
                    store: _this.store,
                    modificar: modificar,
                    record: (modificar) ? _this.selectionModel.getSelected() : null,
                    idNomenclador: _this.idSelected,
                    texto: _this.mensajeCargando,
                    tipo: _this.idTipoNomenclador
                })
                break;
            case 12:
                var orden = false;
                if (_this.selectionModel.getSelections().length == 1) {
                    orden = _this.selectionModel.getSelected().get('orden');
                }
                _this.winGestion = new Nomenclador.Grado({
                    name: _this.name,
                    title: _this.elemento,
                    store: _this.store,
                    modificar: modificar,
                    record: (modificar) ? _this.selectionModel.getSelected() : null,
                    idNomenclador: _this.idSelected,
                    orden: orden,
                    texto: _this.mensajeCargando,
                    isSelected: orden,
                    tipo: _this.idTipoNomenclador
                })
                break;
            default:
                _this.winGestion = new Nomenclador.Comun({
                    name: _this.name,
                    title: _this.elemento,
                    texto: _this.mensajeCargando,
                    tipo: _this.idTipoNomenclador,
                    salario: (_this.idTipoNomenclador == 15),
                    grupocomplejidad: (_this.idTipoNomenclador == 13),
                    escala: (_this.idTipoNomenclador == 20),
                    store: _this.store,
                    modificar: modificar,
                    record: (modificar) ? _this.selectionModel.getSelected() : null,
                    idNomenclador: _this.idSelected
                });
                break;
        }
        _this.winGestion.show();
    },
    eventoNomenclador: function (accion, btnPresionado) {
        var _this = this;
        var texto = "Eliminando";
        if (accion == 'desactivar') {
            texto = "Desactivando";
        } else {
            if (accion == 'activar') {
                texto = "Activando";
            }
        }
        if (btnPresionado == 'ok') {
            Secodena.mostrarMascara('cargaini', "Por favor espere...", texto + ' datos ' + _this.mensajeCargando + ".");
            var param = new Array();
            param.push(_this.idSelected);
            param.push(_this.idTipoNomenclador);
            Ext.Ajax.request({
                url: 'gestionarAcciones', params: {
                    clase: _this.clase, accion: accion, parametros: Ext.encode(param)
                }, callback: function (options, success, response) {
                    Secodena.ocultarMascara('cargaini');
                    var responseData = Ext.decode(response.responseText);
                    var codMsg = responseData.codMsg;
                    var msg = responseData.mensaje;
                    if (codMsg != 4) {
                        mostrarMensaje(codMsg, msg);
                    }
                    if (codMsg == 1) {
                        var options = _this.store.lastOptions;
                        var start = options.params.start;
                        if (accion == 'eliminar') {
                            if ((start) >= (_this.store.totalLength - 1)) {
                                var div = Math.floor((_this.store.totalLength - 1) / 15);
                                start = 15 * (div - 1);
                            }
                        }
                        start = (start < 0) ? 0 : start;
                        _this.store.load({params: {start: start, limit: 15}});
                        Ext.getCmp(_this.idFoco).focus(false, 10);
                    }
                }
            })
        }
    },
    ponerFoco: function (elemento) {
        elemento.focus(true, true);
    },
    buscar: function () {
        var _this = this;
        if (!_this.hasFilter) {
            var denominacion = _this.filtroDenominacion.getValue();
            var abreviatura = _this.filtroAbreviatura.getValue();
            if (denominacion != '' || abreviatura != '') {
                var form = _this.formFiltro.getForm();
                if (form.isValid()) {
                    var params = new Array();
                    params.push(_this.idTipoNomenclador);
                    params.push(form.getValues());
                    _this.store.reload({
                        params: {
                            start: 0, limit: 15, clase: _this.clase, parametros: Ext.encode(params)
                        }, callback: function (a) {
                            if (a.length == 0) {
                                Secodena.ocultarMascara('cargaini');
                                mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.");
                                _this.filtroDenominacion.focus(false, 10);
                                // _this.formFiltro.getForm().reset();
                                // _this.store.load({params: {start: 0, limit: 15}});
                            }
                        }
                    })
                }
            } else {
                mostrarMensaje(1, "No se ha introducido ningún criterio de búsqueda.");
                _this.filtroDenominacion.focus(false, 10);
            }
        } else {
            _this.onBuscar();
        }
    },
    limpiar: function (_this) {
        Ext.getCmp('btnAllA' + _this.name).disable();
        Ext.getCmp('btnBuscar' + _this.name).disable();
        this.formFiltro.getForm().reset();
        this.store.load({params: {start: 0, limit: 15}});
    },
    importarSistema: function (_this) {
        Ext.getCmp('formularioImpSist').getForm().submit({
            url: 'importarXML',
            timeout: 360000,
             waitTitle: "Por favor espere...",
            waitMsg: 'Importando xml',
            success: function (form, action) {
                if (action.result.codMsg == 1) {
                    mostrarMensaje(7, action.result.mensaje);
                    _this.ventanaImportar.hide();
                    Ext.getCmp('formularioImpSist').getForm().reset();
                    _this.limpiar(_this);
                }


            },
            failure: function (form, action) {
                mostrarMensaje(6, action.result.mensaje);
            }
        });
    },
    beforeload: function (param) {
        var _this = this;
        Secodena.mostrarMascara('cargaini', '', "Cargando...");
        var limit = param.params.limit;
        var start = param.params.start;
        var parametros = Ext.decode(param.params.parametros);
        if (parametros == undefined) {
            var denominacion = _this.filtroDenominacion.getValue();
            var abreviatura = _this.filtroAbreviatura.getValue();
            if (denominacion != undefined || abreviatura != undefined) {
                var form = _this.formFiltro.getForm();
                if (form.isValid()) {
                    parametros = new Array();
                    parametros.push(_this.idTipoNomenclador);
                    parametros.push(form.getValues());
                } else {
                    parametros = _this.paramNomenclador;
                }
            } else {
                parametros = _this.paramNomenclador;
            }
        }
        ;
        param.params = {
            start: start, limit: limit, clase: _this.clase, parametros: Ext.encode(parametros)
        }
        return param;
    },
    cambiarGrado: function (evento) {
        var _this = this;
        Secodena.mostrarMascara('cargaini', "Por favor espere...", "Reordenando el grado militar.");
        var param = new Array();
        param.push(_this.idTipoNomenclador);
        param.push({hijo: _this.tempGrado});
        param.push({padre: _this.selectionModel.getSelected().data.id});
        Ext.Ajax.request({
            url: 'gestionarOrden', params: {
                clase: 'grado', accion: 'ordenar', evento: evento, parametros: Ext.encode(param)
            }, callback: function (options, success, response) {
                Secodena.ocultarMascara('cargaini');
                var responseData = Ext.decode(response.responseText);
                var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
                var msg = responseData.mensaje;
                mostrarMensaje(codMsg, msg);
                if (codMsg == 1) {
                    _this.tempGrado = null;
                    var options = _this.store.lastOptions;
                    var start = options.params.start;
                    _this.store.load({params: {start: start, limit: 15}});
                }
            }
        })
    },
    getSelectedRecord: function () {
        var _this = this;
        return _this.selectionModel.getSelected();
    }
})
