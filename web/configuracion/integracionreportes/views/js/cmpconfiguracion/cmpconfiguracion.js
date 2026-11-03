Utilidades.Cmp.CmpConfiguracion = function (opcionesConfig) {
    var _this = this;
    Ext.QuickTips.init();

    _this.integracion = (opcionesConfig && opcionesConfig.hasOwnProperty('integracion')) ? opcionesConfig.integracion : false;

    _this.pagstar = 0;
    _this.posteliminar = false;
    _this.BarraProgreso = new BarraEstado();
    _this.urlCmp = 'configuracion/integracionreportes/index.php/cmpconfiguracion/cmpconfiguracion';

    _this.stConfiguracion = new Ext.data.Store({
        id: 'stConfiguracion',
        autoLoad: true,
        url: '/configuracion/integracionreportes/index.php/cmpconfiguracion/listarConfiguracion',
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'total',
                root: 'data',
                id: 'idconfiguracion'
            },
            [{
                name: 'idconfiguracion'
            }, {
                name: 'denconfiguracion'
            }, {
                name: 'urlservidor'
            }, {
                name: 'autenticarapikey'
            }, {
                name: 'usuario'
            }, {
                name: 'apikey'
            }, {
                name: 'idss'
            }, {
                name: 'usuariors'
            }]
        ),
        listeners: {
            beforeload: function () {
            },
            'load': function (store) {
                if (store.getCount() == 0) {
                    if (_this.integracion)
                        mostrarMensaje(1, 'No existe una configuración del servidor ReportServer creada.');
                    else mostrarMensaje(1, 'No existen datos que mostrar.');
                }
                _this.posteliminar = false;
            }
        }
    });

    _this.crearWinConfiguracion = function () {
        _this.btnAdicionarConfiguracion = new Ext.Button({
            iconCls: 'adicionar',
            disabled: false,
            id: 'btnAdicionarConfiguracion',
            tooltip: 'Adicionar configuración',
            //hidden: true,
            handler: function () {
                var parametros = ({
                    st: _this.stConfiguracion,
                    sm: _this.smConfiguracion,
                    accion: 'Adicionar'
                });
                _this.gestionarConfiguracion(parametros, _this.postAccionesGestionar);
            },
            key: {
                alt: true,
                key: 'I'
            },
            scope: _this
        });

        this.btnModificarConfiguracion = new Ext.Button({
            iconCls: 'modificar',
            disabled: true,
            id: 'btnModificarConfiguracion',
            tooltip: 'Modificar configuración',
            hidden: true,
            handler: function () {
                var parametros = ({
                    st: _this.stConfiguracion,
                    sm: _this.smConfiguracion,
                    accion: 'Modificar'
                });
                _this.gestionarConfiguracion(parametros, _this.postAccionesGestionar);
            },
            key: {
                alt: true,
                key: 'M'
            },
            scope: _this
        });

        _this.btnEliminarConfiguracion = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            id: 'btnEliminarConfiguracion',
            tooltip: 'Eliminar configuración',
            hidden: true,
            handler: function () {
                var parametros = ({
                    st: _this.stConfiguracion,
                    sm: _this.smConfiguracion,
                    accion: 'Eliminar'
                });
                _this.gestionarConfiguracion(parametros, _this.postAccionesGestionar);
            },
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: _this
        });

        _this.smConfiguracion = new Ext.grid.RowSelectionModel({
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.actualizarEstadoBarraHerramientas();
                },
                rowdeselect: function (sm, indiceFila, record) {
                    _this.actualizarEstadoBarraHerramientas();
                }
            }
        });

        _this.pgConfiguracion = new Ext.PagingToolbar({
            pageSize: 100,
            store: _this.stConfiguracion,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.pagstar = evento.start;
                }
            }
        });
        //grid donde cargo los reportes existentes
        _this.gpConfiguracion = new Ext.grid.GridPanel({
            id: 'gpConfiguracion',
            margins: '3 3 3 3',
            width: 270,
            sm: _this.smConfiguracion,
            region: 'center',
            autoScroll: true,
            collapsible: false,
            columns: [{
                dataIndex: 'denconfiguracion',
                width: 200,
                header: 'Denominación'
            }, {
                dataIndex: 'urlservidor',
                width: 190,
                header: 'URL del servidor'
            }, {
                dataIndex: 'autenticarapikey',
                renderer: mostrarImagenBandera,
                header: 'API Key',
                width: 50,
            }, {
                dataIndex: 'usuario',
                width: 130,
                header: 'Usuario API Key'
            }, {
                dataIndex: 'usuariors',
                width: 130,
                header: 'Usuario ReportServer'
            }/*{
                dataIndex: 'apikey',
                header: 'API key'
            }*/],
            store: _this.stConfiguracion,
            tbar: [_this.btnAdicionarConfiguracion, _this.btnModificarConfiguracion, _this.btnEliminarConfiguracion, '-'],
            bbar: _this.pgConfiguracion,
            loadMask: {
                msg: 'Cargando...'
            },
            listeners: {
                rowdblclick: function () {
                    if (_this.btnModificarConfiguracion.enable() && _this.btnModificarConfiguracion.isVisible())
                        _this.btnModificarConfiguracion.handler.call(this);
                }
            }
        });

        _this.pPrincipalConf = new Ext.Panel({
            layout: 'border',
            region: 'center',
            items: [_this.gpConfiguracion]
        });

        if (_this.winPrincipalConf) _this.winPrincipalConf.destroy();

        _this.winPrincipalConf = new Ext.Window({
            modal: true,
            autoScroll: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'border',
            title: 'Configuración del servidor ReportServer',
            width: 620,
            height: 420,
            resizable: false,
            items: [_this.gpConfiguracion],
            listeners: {
                beforeshow: function (win) {

                },
                destroy: function () {
                },
                beforedestroy: function () {
                },
                render: function (w) {
                    w.focus();
                    _this.actualizarEstadoBarraHerramientas();
                }
            }
        });

        _this.winPrincipalConf.on('beforeshow', function () {
            _this.cargarAccionesXUri();
        });
        _this.winPrincipalConf.doLayout();
        _this.winPrincipalConf.show();
    }

    _this.cargarAccionesXUri = function () {
        var url = _this.urlCmp;
        UCID.portal.cargarAccionesXUri(url, function () {
            for (var i in acciones_reportes) {
                var id = acciones_reportes[i].abreviatura,
                    cmp = Ext.getCmp(id);
                if (cmp) {
                    cmp.show();
                }
            }
        });
    }

    _this.cargarAcciones = function () {
        function showGrantedActions() {
            for (var k in _this.grantedActions) {
                var id = _this.grantedActions[k].abreviatura,
                    cmp = Ext.getCmp(id);
                if (cmp) {
                    cmp.show();
                }
            }
        }

        Ext.Ajax.request({
            url: 'cargaracciones',
            method: 'POST',
            params: {
                idfuncionalidad: window.frameElement.id
            },
            callback: function (opts, success, response) {
                if (success) {
                    _this.grantedActions = Ext.decode(response.responseText);
                    var codMsg = _this.grantedActions.codMsg;
                    if (!codMsg) {
                        showGrantedActions();
                    }
                }
            }
        });
    }

    _this.obtenerStore = function () {
        return _this.stConfiguracion;
    }

    _this.gestionarConfiguracion = function (parametros) {
        var accion = parametros.accion;
        _this.objCrudConfiguracion = new Utilidades.Cmp.objCmpCrudConfiguracion();
        if (accion == 'Modificar' || accion == 'Eliminar') {
            if (_this.smConfiguracion.hasSelection()) {
                var arrayrecords = _this.smConfiguracion.getSelections();
                var totalrecords = arrayrecords.length;
                parametros.arrayidconfiguracion = _this.arrayidconfiguracion;
                if (accion == 'Modificar') {
                    if (totalrecords == 1) {
                        _this.objCrudConfiguracion.crearWinCrudConfiguracion(parametros, _this.postAccionesGestionar); //Modificar
                    }
                    else {
                        mostrarMensaje(1, 'Debe seleccionar una configuración para modificarla.');
                    }
                } else _this.objCrudConfiguracion.eliminarConfiguracion(parametros, _this.postAccionesGestionar); //Eliminar
            } else {
                mostrarMensaje(1, 'Debe seleccionar al menos una configuración.');
            }
        } else {
            _this.objCrudConfiguracion.crearWinCrudConfiguracion(parametros, _this.postAccionesGestionar); //Adicionar
        }
    }

    _this.actualizarEstadoBarraHerramientas = function () {
        _this.btnModificarConfiguracion.disable();
        _this.btnEliminarConfiguracion.disable();
        _this.arrayidconfiguracion = [];
        if (_this.smConfiguracion.hasSelection()) {
            _this.btnEliminarConfiguracion.enable();
            var arrayrecords = _this.smConfiguracion.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords == 1) {
                _this.btnModificarConfiguracion.enable();
            }
            for (var i = 0; i < totalrecords; i++) {
                _this.arrayidconfiguracion[i] = arrayrecords[i].data.idconfiguracion;
            }

        }
    }
    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
    _this.postAccionesGestionar = function (mensaje, accion) {
        switch (mensaje) {
            case 0:
                _this.stConfiguracion.reload({
                    params: {
                        start: _this.start
                    }
                });
                break;
            case 1:
                if (accion == 'Adicionar' || accion == 'Cancelar-Cerrar')
                    _this.ultimaPagina();
                else if (accion == 'Modificar' || accion == 'Eliminar') {
                    if (accion == 'Eliminar' && _this.start != 0)
                        _this.posteliminar = true;
                    _this.paginaActual(null);
                }
                break;
            default:
                _this.paginaActual(null);
        }
    };
    //Funcion que recarga la pagina actual. Si no hay elementos listados regarga la pagina anterior.
    _this.paginaActual = function (anode) {
        _this.smConfiguracion.clearSelections();
        _this.start = (_this.pgConfiguracion.getPageData().activePage - 1) * (_this.pgConfiguracion.cbPageSize.getValue());
        _this.stConfiguracion.reload({
            params: {
                start: _this.start
            },
            callback: function () {
                if (_this.stConfiguracion.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.pgConfiguracion.cbPageSize.getValue();
                    _this.stConfiguracion.reload({
                        params: {
                            start: _this.start
                        }
                    });
                }
            }
        });
    };

    _this.ultimaPagina = function () {
        _this.smConfiguracion.clearSelections();
        var numentero = Math.floor(_this.stConfiguracion.getTotalCount() / _this.pgConfiguracion.cbPageSize.getValue());
        _this.start = numentero * _this.pgConfiguracion.cbPageSize.getValue();
        _this.stConfiguracion.reload({
            params: {
                start: _this.start
            }
        });
    };

    function mostrarImagenBandera(val) {
        if (val && val == '1') {
            return '<span class="icondistra-bandera sipac-verde"></span>';
        }
    }

}