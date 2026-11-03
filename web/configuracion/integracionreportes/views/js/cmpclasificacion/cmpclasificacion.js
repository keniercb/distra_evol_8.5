Utilidades.Cmp.CmpClasificacionReporte = function (opcionesConfig) {
    var _this = this;
    Ext.QuickTips.init();
    _this.pagstar = 0;
    _this.posteliminar = false;
    _this.BarraProgreso = new BarraEstado();
    _this.urlCmp = 'configuracion/integracionreportes/index.php/cmpclasificacion/cmpclasificacion';
    _this.arrayidclasificacion = [];

    _this.barraProgreso = new BarraEstado();

    _this.crearWinClasificacion = function (postAccionesGestionarReporte) {
        _this.btnAdicionarClasificacion = new Ext.Button({
            iconCls: 'adicionar',
            disabled: false,
            id: 'btnAdicionarClasificacion',
            tooltip: 'Adicionar clasificacion',
            handler: function () {
                var parametros = ({
                    st: _this.stClasificacion,
                    sm: _this.smClasificacion,
                    accion: 'Adicionar',
                });
                _this.gestionarClasificacion(parametros);
            },
            key: {
                alt: true,
                key: 'I'
            },
            scope: _this
        });

        _this.btnModificarClasificacion = new Ext.Button({
            iconCls: 'modificar',
            disabled: true,
            id: 'btnModificarClasificacion',
            tooltip: 'Modificar clasificacion',
            hidden: true,
            handler: function () {
                var parametros = ({
                    st: _this.stClasificacion,
                    sm: _this.smClasificacion,
                    accion: 'Modificar',
                    idclasificacion: _this.idclasificacion
                });
                _this.gestionarClasificacion(parametros, postAccionesGestionarReporte);
            },
            key: {
                alt: true,
                key: 'M'
            },
            scope: _this
        });

        _this.btnEliminarClasificacion = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            id: 'btnEliminarClasificacion',
            tooltip: 'Eliminar clasificacion',
            hidden: true,
            handler: function () {
                var parametros = ({
                    st: _this.stClasificacion,
                    sm: _this.smClasificacion,
                    accion: 'Eliminar'
                });
                _this.gestionarClasificacion(parametros);
            },
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: _this
        });

        _this.smClasificacion = new Ext.grid.RowSelectionModel({
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.actualizarEstadoBarraHerramientas();
                },
                rowdeselect: function (sm, indiceFila, record) {
                    _this.actualizarEstadoBarraHerramientas();
                }
            }
        });

        _this.pgClasificacion = new Ext.PagingToolbar({
            pageSize: 100,
            store: _this.stClasificacion,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.pagstar = evento.start;
                }
            }
        });
        //grid donde cargo las clasificaciones existentes
        _this.gpClasificacion = new Ext.grid.GridPanel({
            id: 'gpClasificacion',
            margins: '3 3 3 3',
            sm: _this.smClasificacion,
            region: 'center',
            autoScroll: true,
            collapsible: false,
            columns: [{
                dataIndex: 'denominacion',
                width: 450,
                header: 'Denominación'
            }],
            store: _this.stClasificacion,
            tbar: [_this.btnAdicionarClasificacion, _this.btnModificarClasificacion, _this.btnEliminarClasificacion],
            bbar: _this.pgClasificacion,
            loadMask: {
                msg: 'Cargando...'
            },
            listeners: {
                rowdblclick: function () {
                    if (_this.btnModificarClasificacion.enable() && _this.btnModificarClasificacion.isVisible())
                        _this.btnModificarClasificacion.handler.call(this);
                }
            }
        });

        if (_this.winPrincipalClasificacion) _this.winPrincipalClasificacion.destroy();
        _this.winPrincipalClasificacion = new Ext.Window({
            modal: true,
            autoScroll: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'border',
            title: 'Gestionar clasificación del reporte',
            width: 500,
            height: 400,
            resizable: false,
            items: _this.gpClasificacion,
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

        _this.winPrincipalClasificacion.on('beforeshow', function () {
            _this.cargarAccionesXUri();
        });
        _this.winPrincipalClasificacion.doLayout();
        _this.winPrincipalClasificacion.show();
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

    _this.stClasificacion = new Ext.data.Store({
        id: 'stClasificacion',
        autoLoad: true,
        url: '/configuracion/integracionreportes/index.php/cmpclasificacion/listarClasificacion',
        baseParams: {
            idclasificacion: _this.idclasificacion
        },
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'total',
                root: 'data',
                id: 'idclasificacion'
            }, [{
                name: 'idclasificacion'
            }, {
                name: 'denominacion'
            }]
        ),
        listeners: {
            beforeload: function () {
            },
            'load': function (store) {
                if (store.getCount() == 0) {
                    if (!_this.integracion)
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                }
                _this.posteliminar = false;
                _this.actualizarEstadoBarraHerramientas();
            }
        }
    });

    _this.obtenerStore = function () {
        return _this.stClasificacion;
    }

    _this.obtenerStoreToArray = function () {
        var arraystore = [];
        var store = _this.stClasificacion.getRange();
        var total = store.length;
        for (var j = 0; j < total; j++) {
            var data = null;
            data = ({
                denominacion: store[j].data.denominacion,
                idclasificacion: store[j].data.idclasificacion
            });
            arraystore.push(data);
        }
        return arraystore;
    }

    _this.gestionarClasificacion = function (parametros, postAccionesGestionarReporte) {
        var accion = parametros.accion;
        _this.objCrudClasificacion = new Utilidades.Cmp.objCmpCrudClasificacionReporte();
        if (accion == 'Modificar' || accion == 'Eliminar') {
            if (_this.smClasificacion.hasSelection()) {
                var arrayrecords = _this.smClasificacion.getSelections();
                var totalrecords = arrayrecords.length;
                parametros.arrayidclasificacion = _this.arrayidclasificacion;
                if (accion == 'Modificar') {
                    if (totalrecords == 1) {
                        _this.objCrudClasificacion.crearWinCrudClasificacion(parametros, _this.postAccionesGestionar, _this.actualizarEstadoBarraHerramientas, postAccionesGestionarReporte); //Modificar
                    } else {
                        mostrarMensaje(1, 'Debe seleccionar una clasificación para modificarlo.');
                    }
                } else _this.objCrudClasificacion.eliminarClasificacion(parametros, _this.postAccionesGestionar, _this.actualizarEstadoBarraHerramientas); //Eliminar
            } else mostrarMensaje(1, 'Debe seleccionar al menos una clasificación.');
        } else if (accion == 'Adicionar') {
            _this.objCrudClasificacion.crearWinCrudClasificacion(parametros, _this.postAccionesGestionar, _this.actualizarEstadoBarraHerramientas); //Adicionar
        }
        _this.actualizarEstadoBarraHerramientas();
    }

    _this.actualizarEstadoBarraHerramientas = function () {
        (_this.btnModificarClasificacion) ? _this.btnModificarClasificacion.disable() : null;
        (_this.btnEliminarClasificacion) ? _this.btnEliminarClasificacion.disable() : null;
        _this.arrayidclasificacion = [];
        if (_this.smClasificacion && _this.smClasificacion.hasSelection()) {
            _this.btnEliminarClasificacion.enable();
            var arrayrecords = _this.smClasificacion.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords == 1) {
                _this.btnModificarClasificacion.enable();
                _this.tipo = arrayrecords[0].data.tipo;
            }
            for (var i = 0; i < totalrecords; i++) {
                _this.arrayidclasificacion[i] = arrayrecords[i].data.idclasificacion;
            }
        }
    }

    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
    _this.postAccionesGestionar = function (mensaje, accion) {
        switch (mensaje) {
            case 0:
                _this.stClasificacion.reload({
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
        _this.smClasificacion.clearSelections();
        _this.start = (_this.pgClasificacion.getPageData().activePage - 1) * (_this.pgClasificacion.cbPageSize.getValue());
        _this.stClasificacion.reload({
            params: {
                start: _this.start
            },
            callback: function () {
                if (_this.stClasificacion.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.pgClasificacion.cbPageSize.getValue();
                    _this.stClasificacion.reload({
                        params: {
                            start: _this.start
                        }
                    });
                }
            }
        });
    };

    _this.ultimaPagina = function () {
        _this.smClasificacion.clearSelections();
        var numentero = Math.floor(_this.stClasificacion.getTotalCount() / _this.pgClasificacion.cbPageSize.getValue());
        _this.start = numentero * _this.pgClasificacion.cbPageSize.getValue();
        _this.stClasificacion.reload({
            params: {
                start: _this.start
            }
        });
    };

}