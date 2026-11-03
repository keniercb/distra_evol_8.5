Utilidades.Cmp.Cmpcrudconfigurarentidadesorganos = function () {

    var _this = this;
    Ext.Ajax.timeout = 1000000000;

    this.Objestructura = new Utilidades.Cmp.Cmpgestionarestructura();
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
    this.BarraProgreso = new BarraEstado();
    this.btnaplicar = false;
    this.busquedaOrg = 0;

    this.CrearWinCrudRelacionEntidadOrgano = function (parametros, PostAccionesGestionar) {
        var sm = (parametros.hasOwnProperty('sm')) ? parametros.sm : null;
        var gp = (parametros.hasOwnProperty('gp')) ? parametros.gp : null;
        var st = (parametros.hasOwnProperty('st')) ? parametros.st : null;
        var accion = (parametros.hasOwnProperty('accion')) ? parametros.accion : null;
        _this.start = 0;

        if (sm != null && sm.hasSelection() == true) {
            var seleccion = sm.getSelected();
        }
        if (_this.winCrudRelacionEntidadOrgano) {
            _this.winCrudRelacionEntidadOrgano.destroy();
        }

        _this.btnCancelarCrudRelacion = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            id: 'btnCancelarCrudRelacion',
            prevTab: '',
            nextTab: '',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.winCrudRelacionEntidadOrgano.destroy();
                _this.btnaplicar = false;
            }
        });
        _this.btnAceptarCrudRelacion = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            id: 'btnAceptarCrudRelacion',
            nextTab: '',
            prevTab: '',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                parametros.accion = 'Aceptar';
                _this.CrudRelacion(parametros, PostAccionesGestionar);
            }
        });
        _this.btnAplicarCrudRelacion = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            id: 'btnAplicarCrudRelacion',
            prevTab: '',
            nextTab: '',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                parametros.accion = 'Aplicar';
                _this.CrudRelacion(parametros, PostAccionesGestionar);
                _this.btnaplicar = true;
            }
        });

        this.tfBuscarOrganos = new Ext.form.TextField(
            {
                id: 'tfBuscarOrganos',
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: _this.ObjValidaciones.validacionesVtypes('validarEspaciosEnBlanco'),
                maxLength: 255,
                width: 100,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (tf.isValid() && tf.getValue() != '') {
                                _this.btnBuscarOrganoSatisface.handler();
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.getValue() != '') {
                            _this.btnLimpiarOrganoSatisface.enable();
                            if (tf.isValid()) {
                                _this.btnBuscarOrganoSatisface.enable();
                            } else {
                                _this.btnBuscarOrganoSatisface.disable();
                            }
                        } else {
                            _this.btnLimpiarOrganoSatisface.disable();
                            _this.btnBuscarOrganoSatisface.disable();
                        }
                    }
                }
            });

        _this.btnBuscarOrganoSatisface = new Ext.Button({
            iconCls: 'buscar',
            disabled: true,
            id: 'btnBuscarOrganoSatisface',
            prevTab: '',
            nextTab: '',
            tooltip: 'Buscar &oacutergano que satisface',
            handler: function () {
                _this.busquedaOrg = 1;
                _this.stOrganoSatisface.reload({
                    params: {
                        denomorgano: _this.tfBuscarOrganos.getValue(),
                        start: 0,
                        busquedaOrg: _this.busquedaOrg
                    }
                });
                _this.busquedaOrg = 0;
            },
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });

        this.btnLimpiarOrganoSatisface = new Ext.Button({
            disabled: true,
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro(s)',
            id: 'btnLimpiarOrganoSatisface',
            prevTab: '',
            nextTab: '',
            handler: function () {
                _this.tfBuscarOrganos.reset();
                _this.btnBuscarOrganoSatisface.disable();
                _this.btnLimpiarOrganoSatisface.disable();
                _this.busquedaOrg = 0;
                _this.stOrganoSatisface.reload();
            },
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        this.cmOrganoSatisface = new Ext.grid.ColumnModel(
            [{
                header: '&Oacutergano que satisface',
                tooltip: '',
                dataIndex: 'denomorgano',
                id: 'expandir',
                sortable: true,
            }]
        );
        this.smOrganoSatisface = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            id: 'smOrganoSatisface',
            listeners: {}
        });

        this.stOrganoSatisface = new Ext.data.Store({
            url: 'listarOrganoSatisface',
            autoLoad: true,
            remoteSort: true,
            listeners: {
                beforeload: function (st) {
                    st.baseParams.start = _this.start;
                    st.baseParams.busquedaOrg = _this.busquedaOrg;
                },
                load: function (record) {
                    if (_this.gpOrganoSatisface.getStore().getCount() == 0) {
                        if ((_this.gfOrganoSatisface.getFiltrosActivos() == undefined || _this.gfOrganoSatisface.getFiltrosActivos().length == 0)
                            && _this.busquedaOrg == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        }
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                id: "idorganosatisface",
                totalProperty: "total",
                root: "campos"
            }, [{
                name: 'idorganosatisface'
            }, {
                name: 'denomorgano'
            }])
        });

        this.gfOrganoSatisface = new Ext.grid.GridFilters({
            filters: [{
                type: 'string',
                dataIndex: 'denomorgano'
            }]
        });

        this.ptbOrganoSatisface = new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.stOrganoSatisface,
            displayInfo: true,
            listeners: {
                beforechange: function (p, e) {
                    _this.start = e.start;
                }
            }
        });

        this.gpOrganoSatisface = new Ext.grid.EditorGridPanel({
            store: _this.stOrganoSatisface,
            title: '',
            id: 'gpOrganoSatisface',
            region: 'center',
            sm: _this.smOrganoSatisface,
            cm: _this.cmOrganoSatisface,
            frame: true,
            autoExpandColumn: 'expandir',
            //plugins: _this.gfOrganoSatisface,
            //margins: '2 2 2 -4',
            bbar: _this.ptbOrganoSatisface,
            loadMask: {
                msg: 'Cargando datos'
            },
            listeners: {
                beforeedit: function (e) {
                },
                validateedit: function (e) {
                },
                click: function (n) {
                }
            }
        });

        this.pOrganoSatisface = new Ext.Panel({
            layout: 'border',
            region: 'center',
            disabled: true,
            usarKeymap: true,
            botonesKeymap: [_this.btnBuscarOrganoSatisface, _this.btnLimpiarOrganoSatisface],
            tbar: ['Buscar:', '', _this.tfBuscarOrganos, _this.btnBuscarOrganoSatisface, _this.btnLimpiarOrganoSatisface],
            items: [_this.gpOrganoSatisface]
        });

        parametros.panel = _this.pOrganoSatisface;
        this.tpEstructura = _this.Objestructura.crearArbolEstructura(parametros, _this.verificarEntidadOrganoEmpresarial);

        this.pEstructura = new Ext.Panel({
            title: 'Estructuras',
            id: 'Estructura',
            layout: 'fit',
            collapsible: true,
            collapsed: false,
            width: 265,
            region: 'west',
            margins: '3 3 3 3',
            items: [_this.tpEstructura]
        });

        this.winCrudRelacionEntidadOrgano = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'border',
            title: accion + ' relaci&oacuten entidad-&oacutergano',
            width: 750,
            height: 470,
            autoValidate: true,
            validateDefault: true,
            maximizable: false,
            resizable: false,
            buttons: [_this.btnCancelarCrudRelacion, _this.btnAplicarCrudRelacion, _this.btnAceptarCrudRelacion],
            items: [_this.pOrganoSatisface, _this.pEstructura],
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    var idElementoConFoco = document.activeElement.id;
                    if (!_this.btnAceptarCrudRelacion.disabled &&
                        (idElementoConFoco != 'tfBuscarOrganos' && idElementoConFoco != 'tfbuscarEstructuras'
                            && idElementoConFoco != 'btnBuscarOrganoSatisface' && idElementoConFoco != 'btnbuscarEstructuras')) {
                        parametros.accion = 'Adicionar';
                        _this.CrudRelacion(parametros);
                    }
                },
                scope: this
            }],
            listeners: {
                beforeshow: function (win) {
                },
                beforedestroy: function (w) {
                    if (_this.btnaplicar)
                        PostAccionesGestionar(1, 'Cancelar-Cerrar');
                },
                destroy: function (win) {
                    _this.btnaplicar = false;
                }
            }

        });

        _this.winCrudRelacionEntidadOrgano.on('beforeshow', function () {
            //_this.tfBuscarOrganos.focus(true, 700);
        });
        _this.winCrudRelacionEntidadOrgano.doLayout();
        _this.winCrudRelacionEntidadOrgano.show();
        //_this.tfBuscarOrganos.focus(false, 1024);

    };

    this.DestruirWinCrudRelacionEntidadOrgano = function () {
        _this.winCrudRelacionEntidadOrgano.destroy();
    };

    this.CrudRelacion = function (parametros, PostAccionesGestionar) {
        var idEstructura = (_this.Objestructura.hasOwnProperty('idEstructura')) ? _this.Objestructura.idEstructura : null;
        if (idEstructura != null && idEstructura != '' && idEstructura != 'nodo2') {
            if (_this.smOrganoSatisface.hasSelection() && _this.smOrganoSatisface.getSelections().length == 1) {
                _this.btnaplicar = false;
                var accion = (parametros.hasOwnProperty('accion')) ? parametros.accion : null;
                var url = 'adicionarRelacionEntidadOrgano';
                var waitMsg = 'Guardando datos de la relaci&oacuten';
                var postaccion = 'adicionada';
                var existe = 'adicionar';

                if (accion == 'Modificar') {
                    var identidadorganosatisface = '';
                    url = 'modificarRelacionEntidadOrgano';
                    postaccion = 'modificada';
                    existe = 'modificar';
                }
                var idOrganoSatisface = _this.smOrganoSatisface.getSelections()[0].data.idorganosatisface;

                _this.BarraProgreso.show(waitMsg);
                Ext.Ajax.request({
                    url: url,
                    params: {
                        idEstructura: idEstructura,
                        idOrganoSatisface: idOrganoSatisface
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, 'Ha ocurrido un error al ' + existe + ' la relaci&oacute;n.');
                        }
                        if (responseData.mensaje == 1) {
                            var msj = 'La relaci&oacute;n ha sido ' + postaccion + ' satisfactoriamente.';
                            if (accion == 'Aplicar') {
                                mostrarMensaje(1, msj);
                                _this.pOrganoSatisface.disable();
                                if (_this.smOrganoSatisface.hasSelection()) {
                                    _this.smOrganoSatisface.clearSelections();
                                    _this.gpOrganoSatisface.getView().refresh(true);
                                }
                            } else {
                                mostrarMensaje(1, msj);
                                PostAccionesGestionar(1, 'Adicionar');
                                _this.winCrudRelacionEntidadOrgano.destroy();
                            }
                        }
                        if (responseData.mensaje == 2) {
                            mostrarMensaje(1, 'Debe seleccionar una estructura y un &oacute;rgano que satisface.');
                        }
                        if (responseData.mensaje == 3) {
                            mostrarMensaje(1, 'La estructura seleccionada no est&aacute; configurada como &oacute;rgano empresarial.');
                        }
                        if (responseData.mensaje == 4) {
                            mostrarMensaje(1, 'La estructura que quiere ' + existe + ' ya est&aacute; relacionada.');
                        }
                        if (responseData.mensaje == 5) {
                            mostrarMensaje(1, 'El &oacute;rgano que satisface que quiere ' + existe + ' ya existe.');
                        }
                        if (responseData.mensaje == 2 || responseData.mensaje == 3 || responseData.mensaje == 4) {
                            _this.pOrganoSatisface.disable();
                            if (_this.smOrganoSatisface.hasSelection()) {
                                _this.smOrganoSatisface.clearSelections();
                                _this.gpOrganoSatisface.getView().refresh(true);
                            }
                        }
                    }
                });
            } else {
                mostrarMensaje(1, 'Debe seleccionar un &oacute;rgano que satisface.');
            }
        } else {
            mostrarMensaje(1, 'Debe seleccionar una estructura.');
        }
    };

    this.eliminarRelacionEntidadOrgano = function (parametros, PostAccionesGestionar) {
        var sm = (parametros.hasOwnProperty('sm')) ? parametros.sm : null;
        var gp = (parametros.hasOwnProperty('gp')) ? parametros.gp : null;
        var mensajeconfirmacion2 = 'Debe seleccionar al menos un elemento para poder eliminarlo.';

        if (sm != null && sm.hasSelection() && sm.getSelections().length > 0) {
            var mensaje = ' ¿Est&aacute; seguro que desea eliminar la(s) asociaci&oacute;n(es) seleccionada(s)?';
            var mensajemascara = 'Eliminando asociaci&oacute;n(es)';
            var mensajeconfirmacion0 = 'La(s) asociación(es) no ha(n) sido eliminada(s) debido a que está(n) en uso.';
            var mensajeconfirmacion1 = 'La(s) asociación(es) ha(n) sido eliminada(s) satisfactoriamente.';


            var arrayIdElementosEliminar = [];
            var arrayrecords = sm.getSelections();
            var cant = arrayrecords.length;
            for (var i = 0; i < cant; i++) {
                arrayIdElementosEliminar[i] = arrayrecords[i].data.identidadorganosatisface;
            }
            mostrarMensaje(2, mensaje, function (btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.BarraProgreso.show(mensajemascara);
                    Ext.Ajax.request({
                        url: 'eliminarRelacionEntidadOrgano',
                        params: {
                            arrayIdElementosEliminar: Ext.encode(arrayIdElementosEliminar)
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 1) {
                                mostrarMensaje(1, mensajeconfirmacion1);
                                PostAccionesGestionar(1, 'Eliminar');
                            }
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, mensajeconfirmacion0);
                                PostAccionesGestionar(1, 'Eliminar');
                            }
                            if (responseData.mensaje == 2) {
                                mostrarMensaje(1, mensajeconfirmacion2);
                            }
                        }
                    });
                } else {
                    if (sm != null && sm.hasSelection()) {
                        sm.clearSelections();
                        if (gp != null) gp.getView().refresh(true);
                    }
                }
            });
        } else {
            mostrarMensaje(1, mensajeconfirmacion2, function () {
            });
        }
    };

    this.verificarEntidadOrganoEmpresarial = function () {
        var idEstructura = (_this.Objestructura.hasOwnProperty('idEstructura')) ? _this.Objestructura.idEstructura : null;
        if (idEstructura != null && idEstructura != '') {
            var mensajemascara = 'Cargando datos...';
            var mensajeconfirmacion0 = 'La estructura seleccionada no est&aacute; configurada como &oacute;rgano empresarial.';
            _this.BarraProgreso.show(mensajemascara);
            Ext.Ajax.request({
                url: 'verificarEntidadOrganoEmpresarial',
                params: {
                    idEstructura: idEstructura
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        _this.pOrganoSatisface.enable();
                    }
                    if (responseData.mensaje == 0) {
                        mostrarMensaje(1, mensajeconfirmacion0);
                        _this.pOrganoSatisface.disable();
                        if (_this.smOrganoSatisface.hasSelection()) {
                            _this.smOrganoSatisface.clearSelections();
                            _this.gpOrganoSatisface.getView().refresh(true);
                        }
                    }
                }
            });
        }
    }


};
