Utilidades.Cmp.CmpFiltro = function (opcionesConfig) {
    var _this = this;
    Ext.QuickTips.init();
    _this.pagstar = 0;
    _this.posteliminar = false;
    _this.BarraProgreso = new BarraEstado();
    _this.urlCmp = 'configuracion/integracionreportes/index.php/cmpfiltro/cmpfiltro';
    _this.arrayidfiltros = [];
    _this.tipo = '';
    _this.idreporte = (opcionesConfig && opcionesConfig.hasOwnProperty('idreporte')) ? opcionesConfig.idreporte : null;
    _this.idCmp = (opcionesConfig && opcionesConfig.hasOwnProperty('idcmp')) ? opcionesConfig.idcmp : '';
    _this.integracion = (opcionesConfig && opcionesConfig.hasOwnProperty('integracion')) ? opcionesConfig.integracion : false;
    _this.accionreporte = (opcionesConfig && opcionesConfig.hasOwnProperty('accionreporte')) ? opcionesConfig.accionreporte : '';
    _this.nousarpaginado = (opcionesConfig && opcionesConfig.hasOwnProperty('nousarpaginado')) ? opcionesConfig.nousarpaginado : false;
    _this.autoloadstore = (opcionesConfig && opcionesConfig.hasOwnProperty('autoloadstore')) ? opcionesConfig.autoloadstore : true;

    _this.barraProgreso = new BarraEstado();

    _this.crearWinFiltro = function () {
        _this.btnAdicionarFiltro = new Ext.Button({
            iconCls: 'adicionar',
            disabled: false,
            id: 'btnAdicionarFiltro',
            tooltip: 'Adicionar filtro',
            handler: function () {
                var parametros = ({
                    st: _this.stFiltro,
                    sm: _this.smFiltro,
                    accion: 'Adicionar',
                    idreporte: _this.idreporte,
                    accionreporte: _this.accionreporte
                });
                _this.gestionarFiltro(parametros);
            },
            key: {
                alt: true,
                key: 'I'
            },
            scope: _this
        });

        _this.btnModificarFiltro = new Ext.Button({
            iconCls: 'modificar',
            disabled: true,
            id: 'btnModificarFiltro',
            tooltip: 'Modificar filtro',
            hidden: true,
            handler: function () {
                var parametros = ({
                    st: _this.stFiltro,
                    sm: _this.smFiltro,
                    accion: 'Modificar',
                    idreporte: _this.idreporte,
                    accionreporte: _this.accionreporte
                });
                _this.gestionarFiltro(parametros);
            },
            key: {
                alt: true,
                key: 'M'
            },
            scope: _this
        });

        _this.btnEliminarFiltro = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            id: 'btnEliminarFiltro',
            tooltip: 'Eliminar filtro',
            hidden: true,
            handler: function () {
                var parametros = ({
                    st: _this.stFiltro,
                    sm: _this.smFiltro,
                    accion: 'Eliminar',
                    accionreporte: _this.accionreporte
                });
                _this.gestionarFiltro(parametros);
            },
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: _this
        });

        _this.btnVistaPreviaFiltro = new Ext.Button({
            iconCls: 'vistareporte',
            disabled: true,
            id: 'btnVistaPreviaFiltro',
            tooltip: 'Vista previa de los filtros',
            hidden: true,
            handler: function () {
                var parametros = ({
                    accion: 'Vista'
                });
                _this.mostrarWinParametros(parametros);
            },
            key: {
                ctrl: true,
                alt: true,
                key: 'P'
            },
            scope: _this
        });

        _this.menuItemTipoTexto = new Ext.menu.Item({
            text: 'Texto',
            handler: function () {
                var parametros = ({
                    st: _this.stFiltro,
                    sm: _this.smFiltro,
                    accion: 'Adicionar',
                    tipo: 1,
                    idreporte: _this.idreporte,
                    accionreporte: _this.accionreporte,
                    nombretipo: 'Texto'
                });
                _this.gestionarFiltro(parametros);
            },
            tooltip: 'Adicionar filtro tipo texto'
        });

        _this.menuItemTipoNumerico = new Ext.menu.Item({
            text: 'Numérico',
            handler: function () {
                var parametros = ({
                    st: _this.stFiltro,
                    sm: _this.smFiltro,
                    accion: 'Adicionar',
                    tipo: 2,
                    idreporte: _this.idreporte,
                    accionreporte: _this.accionreporte,
                    nombretipo: 'Numérico'
                });
                _this.gestionarFiltro(parametros);
            },
            tooltip: 'Adicionar filtro tipo numérico'
        });

        _this.menuItemTipoFecha = new Ext.menu.Item({
            text: 'Fecha',
            handler: function () {
                var parametros = ({
                    st: _this.stFiltro,
                    sm: _this.smFiltro,
                    accion: 'Adicionar',
                    tipo: 3,
                    idreporte: _this.idreporte,
                    accionreporte: _this.accionreporte,
                    nombretipo: 'Fecha'
                });
                _this.gestionarFiltro(parametros);
            },
            tooltip: 'Adicionar filtro tipo fecha'
        });

        _this.menuItemTipoNomenclador = new Ext.menu.Item({
            text: 'Nomenclador',
            handler: function () {
                var parametros = ({
                    st: _this.stFiltro,
                    sm: _this.smFiltro,
                    accion: 'Adicionar',
                    tipo: 4,
                    idreporte: _this.idreporte,
                    accionreporte: _this.accionreporte,
                    nombretipo: 'Nomenclador'
                });
                _this.gestionarFiltro(parametros);
            },
            tooltip: 'Adicionar filtro tipo nomenclador'
        });

        _this.menuItemTipoVariableGlobal = new Ext.menu.Item({
            text: 'Variable global',
            handler: function () {
                var parametros = ({
                    st: _this.stFiltro,
                    sm: _this.smFiltro,
                    accion: 'Adicionar',
                    tipo: 5,
                    idreporte: _this.idreporte,
                    accionreporte: _this.accionreporte,
                    nombretipo: 'Variable global'
                });
                _this.gestionarFiltro(parametros);
            },
            tooltip: 'Adicionar filtro tipo variable global'
        });

        _this.menuItemTipoEstructura = new Ext.menu.Item({
            text: 'Estructura',
            handler: function () {
                var parametros = ({
                    st: _this.stFiltro,
                    sm: _this.smFiltro,
                    accion: 'Adicionar',
                    tipo: 6,
                    idreporte: _this.idreporte,
                    accionreporte: _this.accionreporte,
                    nombretipo: 'Estructura'
                });
                _this.gestionarFiltro(parametros);
            },
            tooltip: 'Adicionar filtro tipo estructura'
        });

        _this.menuAdicionarFiltro = new Ext.Toolbar.MenuButton({
            id: 'menuAdicionarFiltro',
            tooltip: 'Adicionar filtro',
            disabled: false,
            iconCls: 'adicionar',
            hidden: false,
            menu: {
                items: [_this.menuItemTipoTexto, _this.menuItemTipoNumerico, _this.menuItemTipoFecha,
                    _this.menuItemTipoNomenclador, _this.menuItemTipoVariableGlobal, _this.menuItemTipoEstructura]
            }
        });

        _this.smFiltro = new Ext.grid.RowSelectionModel({
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.actualizarEstadoBarraHerramientas();
                },
                rowdeselect: function (sm, indiceFila, record) {
                    _this.actualizarEstadoBarraHerramientas();
                }
            }
        });

        _this.pgFiltro = new Ext.PagingToolbar({
            pageSize: 100,
            store: _this.stFiltro,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.pagstar = evento.start;
                }
            }
        });
        //grid donde cargo los reportes existentes
        _this.gpFiltro = new Ext.grid.GridPanel({
            id: 'gpFiltro',
            margins: '3 3 3 3',
            width: 270,
            sm: _this.smFiltro,
            region: 'center',
            autoScroll: true,
            collapsible: false,
            columns: [{
                dataIndex: 'orden',
                width: 50,
                header: 'Orden'
            }, {
                dataIndex: 'denominacion',
                width: 225,
                header: 'Denominación'
            }, {
                dataIndex: 'nombreparametro',
                width: 165,
                header: 'Nombre párametro'
            }, {
                dataIndex: 'denominaciontipo',
                header: 'Tipo'
            }],
            store: _this.stFiltro,
            tbar: [_this.menuAdicionarFiltro, _this.btnModificarFiltro, _this.btnEliminarFiltro, _this.btnVistaPreviaFiltro],
            bbar: (!_this.nousarpaginado) ? _this.pgFiltro : null,
            loadMask: {
                msg: 'Cargando...'
            },
            listeners: {
                rowdblclick: function () {
                    if (_this.btnModificarFiltro.enable() && _this.btnModificarFiltro.isVisible())
                        _this.btnModificarFiltro.handler.call(this);
                }
            }
        });

        if (_this.winPrincipalConf) _this.winPrincipalConf.destroy();
        _this.winPrincipalConf = new Ext.Window({
            modal: true,
            autoScroll: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'border',
            title: 'Gestionar filtros del reporte',
            width: 590,
            height: 420,
            resizable: false,
            items: _this.gpFiltro,
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
        if (opcionesConfig && opcionesConfig.hasOwnProperty('tipocomponente') && opcionesConfig.tipocomponente == 'panel') {
            _this.pPrincipalConf = new Ext.Panel({
                id: 'pPrincipalConf' + _this.idCmp,
                layout: 'border',
                autoScroll: true,
                items: _this.gpFiltro
            });
            _this.cargarAccionesXUri();
            return _this.pPrincipalConf;
        } else {
            _this.winPrincipalConf.on('beforeshow', function () {
                _this.cargarAccionesXUri();
            });
            _this.winPrincipalConf.doLayout();
            _this.winPrincipalConf.show();
        }
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

    _this.stFiltro = new Ext.data.Store({
        id: 'stFiltro',
        autoLoad: _this.autoloadstore,
        url: '/configuracion/integracionreportes/index.php/cmpfiltro/listarFiltro',
        baseParams: {
            idreporte: _this.idreporte
        },
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'total',
                root: 'data',
                id: 'idfiltro'
            }, [{
                name: 'idfiltro'
            }, {
                name: 'idreporte'
            }, {
                name: 'denominacion'
            }, {
                name: 'orden'
            }, {
                name: 'anchocolumna'
            }, {
                name: 'nombreparametro'
            }, {
                name: 'tipo'
            }, {
                name: 'denominaciontipo'
            }, {
                name: 'longitudminima'
            }, {
                name: 'longitudmaxima'
            }, {
                name: 'valorminimo'
            }, {
                name: 'valormaximo'
            }, {
                name: 'nomidentificador'
            }, {
                name: 'nomdenominacion'
            }, {
                name: 'tipofuentedatos'
            }, {
                name: 'paginado'
            }, {
                name: 'sentenciasql'
            }, {
                name: 'nomservicio'
            }, {
                name: 'enviarid'
            }, {
                name: 'valorpordefecto'
            }, {
                name: 'estructuracompleta'
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
        return _this.stFiltro;
    }

    _this.obtenerStoreToArray = function () {
        var arraystore = [];
        var store = _this.stFiltro.getRange();
        var total = store.length;
        for (var j = 0; j < total; j++) {
            var data = null;
            data = ({
                denominacion: store[j].data.denominacion,
                anchocolumna: store[j].data.anchocolumna,
                denominaciontipo: store[j].data.denominaciontipo,
                orden: store[j].data.orden,
                nombreparametro: store[j].data.nombreparametro,
                tipo: store[j].data.tipo,
                longitudmaxima: store[j].data.longitudmaxima,
                longitudminima: store[j].data.longitudminima,
                valormaximo: store[j].data.valormaximo,
                valorminimo: store[j].data.valorminimo,
                nomidentificador: store[j].data.nomidentificador,
                nomdenominacion: store[j].data.nomdenominacion,
                tipofuentedatos: store[j].data.tipofuentedatos,
                paginado: store[j].data.paginado,
                sentenciasql: store[j].data.sentenciasql,
                nomservicio: store[j].data.nomservicio,
                enviarid: store[j].data.enviarid,
                valorpordefecto: store[j].data.valorpordefecto,
                estructuracompleta: store[j].data.estructuracompleta,
            });
            arraystore.push(data);
        }
        return arraystore;
    }

    _this.gestionarFiltro = function (parametros) {
        var accion = parametros.accion;
        _this.objCrudFiltro = new Utilidades.Cmp.objCmpCrudFiltro();
        if (accion == 'Modificar' || accion == 'Eliminar') {
            if (_this.smFiltro.hasSelection()) {
                var arrayrecords = _this.smFiltro.getSelections();
                var totalrecords = arrayrecords.length;
                parametros.arrayidfiltros = _this.arrayidfiltros;
                if (accion == 'Modificar') {
                    if (totalrecords == 1) {
                        parametros.tipo = _this.tipo;
                        _this.objCrudFiltro.crearWinCrudFiltro(parametros, _this.postAccionesGestionar, _this.actualizarEstadoBarraHerramientas); //Modificar
                    } else {
                        mostrarMensaje(1, 'Debe seleccionar un filtro para modificarlo.');
                    }
                } else _this.objCrudFiltro.eliminarFiltro(parametros, _this.postAccionesGestionar, _this.actualizarEstadoBarraHerramientas); //Eliminar
            } else mostrarMensaje(1, 'Debe seleccionar al menos un filtro.');
        } else if (accion == 'Adicionar') {
            _this.objCrudFiltro.crearWinCrudFiltro(parametros, _this.postAccionesGestionar, _this.actualizarEstadoBarraHerramientas); //Adicionar
        }
        _this.actualizarEstadoBarraHerramientas();
    }

    _this.actualizarEstadoBarraHerramientas = function () {
        (_this.btnModificarFiltro) ? _this.btnModificarFiltro.disable() : null;
        (_this.btnEliminarFiltro) ? _this.btnEliminarFiltro.disable() : null;
        (_this.menuItemTipoEstructura) ? _this.menuItemTipoEstructura.enable() : null;
        _this.arrayidfiltros = [];
        _this.tipo = '';
        if (_this.smFiltro && _this.smFiltro.hasSelection()) {
            _this.btnEliminarFiltro.enable();
            var arrayrecords = _this.smFiltro.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords == 1) {
                _this.btnModificarFiltro.enable();
                _this.tipo = arrayrecords[0].data.tipo;
            }
            for (var i = 0; i < totalrecords; i++) {
                _this.arrayidfiltros[i] = arrayrecords[i].data.idfiltro;
            }
        }
        if (_this.stFiltro) {
            var totalrecords = _this.stFiltro.getCount();
            if (_this.btnVistaPreviaFiltro) {
                if (totalrecords > 0) _this.btnVistaPreviaFiltro.enable();
                else _this.btnVistaPreviaFiltro.disable();
            }
            if (_this.menuItemTipoEstructura)
                if (_this.buscarParametroEstructura(_this.stFiltro).mostrarestructura == 1) _this.menuItemTipoEstructura.disable();
        }
    }

    _this.buscarParametroEstructura = function (st) {
        var totalrecords = st.getCount();
        var arrayrecords = st.getRange();
        var estructura = {
            mostrarestructura: 0,
            estructuracompleta: 0
        };
        for (var i = 0; i < totalrecords; i++) {
            if (arrayrecords[i].data.tipo == 6) {
                estructura.mostrarestructura = 1;
                estructura.estructuracompleta = arrayrecords[i].data.estructuracompleta;
                return estructura;
            }
        }
        return estructura;
    }
    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
    _this.postAccionesGestionar = function (mensaje, accion) {
        switch (mensaje) {
            case 0:
                _this.stFiltro.reload({
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
        _this.smFiltro.clearSelections();
        _this.start = (_this.pgFiltro.getPageData().activePage - 1) * (_this.pgFiltro.cbPageSize.getValue());
        _this.stFiltro.reload({
            params: {
                start: _this.start
            },
            callback: function () {
                if (_this.stFiltro.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.pgFiltro.cbPageSize.getValue();
                    _this.stFiltro.reload({
                        params: {
                            start: _this.start
                        }
                    });
                }
            }
        });
    };

    _this.ultimaPagina = function () {
        _this.smFiltro.clearSelections();
        var numentero = Math.floor(_this.stFiltro.getTotalCount() / _this.pgFiltro.cbPageSize.getValue());
        _this.start = numentero * _this.pgFiltro.cbPageSize.getValue();
        _this.stFiltro.reload({
            params: {
                start: _this.start
            }
        });
    };

    _this.mostrarWinParametros = function (parametros, obtenerUrlReporte) {
        var accion = parametros.accion;
        if (accion == 'Vista') {
            parametros.st = _this.stFiltro;
            parametros.sm = _this.smFiltro;
            if (_this.stFiltro.getCount() > 0) {
                _this.objCrudFiltro = new Utilidades.Cmp.objCmpCrudFiltro();
                parametros.estructura = _this.buscarParametroEstructura(_this.stFiltro);
                _this.objCrudFiltro.crearWinParametros(parametros);
            } else mostrarMensaje(1, 'No existen filtros para ser previsualizados.');
        } else {
            _this.barraProgreso.show('Cargando filtros');
            _this.stFiltro.reload({
                params: {
                    idreporte: _this.idreporte
                },
                callback: function () {
                    _this.barraProgreso.hide();
                    if (_this.stFiltro.getCount() == 0) {
                        obtenerUrlReporte(parametros.formatoreporte);
                    } else {
                        parametros.st = _this.stFiltro;
                        parametros.estructura = _this.buscarParametroEstructura(_this.stFiltro);
                        _this.objCrudFiltro = new Utilidades.Cmp.objCmpCrudFiltro();
                        return _this.objCrudFiltro.crearWinParametros(parametros, obtenerUrlReporte);
                    }
                }
            });
        }
        _this.actualizarEstadoBarraHerramientas();
    }

}