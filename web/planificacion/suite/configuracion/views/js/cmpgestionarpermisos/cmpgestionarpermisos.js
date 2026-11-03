Utilidades.Cmp.CmpGestionarpermisos = function () {

    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.incrementarContadorInstancia = 1;
    this.cont = 0;
    this.idSistemaSeleccionado = "";
    this.tituloSistema = "";
    this.denomSistema = "";
    this.objCmpGestPerm;
    this.objCmpGestPermTab_1;
    this.objCmpGestPermTab_2;
    this.nodoselect;
    this.paramsPerm;
    this.subsistemaInicial;
    this.arrayIdSubsistemas = [];

    this.BarraProgreso = new BarraEstado();

//funcion donde se procede a cargar la plantilla
    this.cargarPermisos = function () {

        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/obtenerSistemas',
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.subsistemaInicial = responseData[0];
                _this.paramsPerm = {
                    idPanelPincipal: _this.subsistemaInicial.id,
                    tipoPermDadoSubsistema: _this.subsistemaInicial.tipoNomenDadoSubsistema,
                    titulo: _this.subsistemaInicial.titulo
                };
                _this.idSistemaSeleccionado = _this.subsistemaInicial.id;

                var objCmpGestPermisoInic = new Utilidades.Cmp.Cmpgestionarpermiso({
                    subsistemaLlamada: 'integracion',
                    idsubsistema: 'integracion' + _this.paramsPerm.idPanelPincipal,
                    tipoPermDadoSubsistema: _this.paramsPerm.tipoNomenDadoSubsistema,
                    idPanelPincipal: _this.paramsPerm.idPanelPincipal,
                    cerrarPestaña: true
                });

                objCmpGestPermisoInic.panelPermisosRecibidos.setTitle('Permisos recibidos');
                objCmpGestPermisoInic.panelPermisosOtorgados.setTitle('Permisos otorgados');

                var objCmpGestGrupoInic = new Utilidades.Cmp.Cmpgestionargrupos({
                    idcomponente: 'local',
                    noUsarAdicionar: false,
                    noUsarModificar: false,
                    noUsarEliminar: false,
                    noUsarActivar: false,
                    noUsarDesactivar: false,
                    noUsarCerrarWinP: true,
                    noUsarSeleccionarWinP: true,
                    tipoComponente: 'integracion',
                    seleccionsimple: false,
                    maxWinPrincipal: true,
                    subsistemaLlamada: 'integracion',
                    idsubsistema: 'integracion' + _this.paramsPerm.idPanelPincipal,
                    tipoPermDadoSubsistema: _this.paramsPerm.tipoNomenDadoSubsistema,
                    idPanelPincipal: 'obj' + _this.paramsPerm.idPanelPincipal,
                    cerrarPestaña: false
                });
                objCmpGestGrupoInic.panelGrupos.setTitle('Grupos');

                _this.objCmpGestPermTab_1 = new Ext.TabPanel({
                    activeTab: 0,
                    id: _this.paramsPerm.idPanelPincipal,
                    frame: true,
                    closable: false,
                    title: _this.paramsPerm.titulo,
                    closeAction: 'destroy',
                    items: [
                        objCmpGestPermisoInic.panelPermisosRecibidos,
                        objCmpGestPermisoInic.panelPermisosOtorgados,
                        objCmpGestGrupoInic.panelGrupos
                    ],
                    width: '100%',
                    listeners: {
                        tabchange: function (tbPanel, tab) {
                            if (tbPanel.getActiveTab().getId() == objCmpGestPermisoInic.panelPermisosRecibidos.getId()) {
                                objCmpGestPermisoInic.stPermisos.reload({params: {start: 0}});
                            } else if (tbPanel.getActiveTab().getId() == objCmpGestPermisoInic.panelPermisosOtorgados.getId()) {
                                objCmpGestPermisoInic.stPermisosOtorgados.reload({params: {start: 0}});
                            } else {
                                objCmpGestGrupoInic.stGrupos.reload({params: {start: 0}});
                            }
                        }
                    }
                });

                _this.crearInterfazGestPerm(_this.objCmpGestPermTab_1);
            }
        });
    };

    this.crearInterfazGestPerm = function () {
        this.tpSubsistemas = new Ext.tree.TreePanel({
            useArrows: true,
            width: 250,
            region: 'west',
            frame: false,
            margins: '3 3 3 3',
            title: 'Subsistemas',
            autoScroll: true,
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/obtenerSistemas',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        _this.BarraProgreso.show('Cargando permisos');
                    },
                    'load': function (atreeloader, anode) {
                        _this.tpSubsistemas.getRootNode().firstChild.select();
                        _this.nodoselect = _this.tpSubsistemas.getRootNode().firstChild;
                        _this.arrayIdSubsistemas[_this.cont++] = _this.nodoselect.id;
                        _this.idSistemaSeleccionado = _this.nodoselect.id;
                        _this.BarraProgreso.hide();
                    }
                }
            }),
            root: {
                id: 'up',
                text: 'Subsistema a configurar permisos',
                expanded: true,
                iconCls: 'up'
            },
            rootVisible: true,
            listeners: {
                click: function (nodo) {
                    if (nodo.id != 'up') {
                        _this.idSistemaSeleccionado = nodo.id;
                        _this.tituloSistema = nodo.attributes.titulo;
                        _this.denomSistema = nodo.attributes.text;
                        _this.paramsPerm = {
                            idPanelPincipal: _this.idSistemaSeleccionado,
                            tipoPermDadoSubsistema: nodo.attributes.tipoNomenDadoSubsistema,
                            titulo: nodo.attributes.titulo
                        };
                        if (!_this.isSubsistemaInstanciado(_this.idSistemaSeleccionado)) {
                            _this.InstanciarPermDadoSubsistema(_this.paramsPerm);
                            _this.arrayIdSubsistemas[_this.cont++] = _this.idSistemaSeleccionado;
                        } else {
                            if (_this.tpGestionarPerm.getItem(_this.idSistemaSeleccionado) == undefined) {
                                _this.InstanciarPermDadoSubsistema(_this.paramsPerm);
                            } else {
                                if (_this.tpGestionarPerm.getActiveTab().getId() != _this.idSistemaSeleccionado) {
                                    _this.tpGestionarPerm.setActiveTab(_this.tpGestionarPerm.getItem(_this.idSistemaSeleccionado));
                                }
                            }
                        }
                    }
                }
            }
        });

        this.tpGestionarPerm = new Ext.TabPanel({
            activeTab: 0,
            id: 'tpGestionarPerm',
            region: 'center',
            frame: true,
            //disabled: true,
            width: '100%',
            items: [_this.objCmpGestPermTab_1],
            listeners: {
                tabchange: function (tbPanel, tab) {
                    if (_this.tpGestionarPerm.getActiveTab().getId() != _this.idSistemaSeleccionado) {
                        _this.tpSubsistemas.getNodeById(_this.tpGestionarPerm.getActiveTab().getId()).select();
                        _this.idSistemaSeleccionado = _this.tpGestionarPerm.getActiveTab().getId();
                    }
                }
            }
        });

        //ventana principal de la vista
        this.WinPrincipal = new Ext.Window({
            layout: 'border',
            closable: false,
            maximized: true,
            modal: true,
            width: 1000,
            height: 510,
            items: [_this.tpSubsistemas, _this.tpGestionarPerm]
        });
        _this.WinPrincipal.show();
    };

    this.InstanciarPermDadoSubsistema = function (params) {

        var objCmpGestPermiso = new Utilidades.Cmp.Cmpgestionarpermiso({
            subsistemaLlamada: 'integracion',
            idsubsistema: 'integracion' + params.idPanelPincipal,
            tipoPermDadoSubsistema: params.tipoNomenDadoSubsistema,
            idPanelPincipal: params.idPanelPincipal,
            cerrarPestaña: true
        });

        objCmpGestPermiso.panelPermisosRecibidos.setTitle('Permisos recibidos');
        objCmpGestPermiso.panelPermisosOtorgados.setTitle('Permisos otorgados');

        var objCmpGestGrupo = new Utilidades.Cmp.Cmpgestionargrupos({
            idcomponente: 'local',
            noUsarAdicionar: false,
            noUsarModificar: false,
            noUsarEliminar: false,
            noUsarActivar: false,
            noUsarDesactivar: false,
            noUsarCerrarWinP: true,
            noUsarSeleccionarWinP: true,
            tipoComponente: 'integracion',
            seleccionsimple: false,
            maxWinPrincipal: true,
            subsistemaLlamada: 'integracion',
            idsubsistema: 'integracion' + params.idPanelPincipal,
            tipoPermDadoSubsistema: params.tipoNomenDadoSubsistema,
            idPanelPincipal: 'obj' + params.idPanelPincipal,
            cerrarPestaña: false
        });
        objCmpGestGrupo.panelGrupos.setTitle('Grupos');

        var objCmpGestPerm1 = new Ext.TabPanel({
            activeTab: 0,
            id: params.idPanelPincipal,
            frame: true,
            closable: true,
            title: params.titulo,
            closeAction: 'destroy',
            items: [objCmpGestPermiso.panelPermisosRecibidos, objCmpGestPermiso.panelPermisosOtorgados, objCmpGestGrupo.panelGrupos],
            //disabled: true,
            width: '100%',
            listeners: {
                tabchange: function (tbPanel, tab) {
                    if (tbPanel.getActiveTab().getId() == objCmpGestPermiso.panelPermisosRecibidos.getId()) {
                        objCmpGestPermiso.stPermisos.reload({params: {start: 0}});
                    } else if (tbPanel.getActiveTab().getId() == objCmpGestPermiso.panelPermisosOtorgados.getId()) {
                        objCmpGestPermiso.stPermisosOtorgados.reload({params: {start: 0}});
                    } else {
                        objCmpGestGrupo.stGrupos.reload({params: {start: 0}});
                    }
                }
            }
        });

        _this.tpGestionarPerm.add(objCmpGestPerm1);
        _this.tpGestionarPerm.activate(objCmpGestPerm1);
    };

    this.isSubsistemaInstanciado = function (idSubsistema) {
        var esInstanciado = false;
        for (var i = 0; i < _this.arrayIdSubsistemas.length; i++) {
            if (_this.arrayIdSubsistemas[i] == idSubsistema) {
                esInstanciado = true;
                break;
            }
        }
        return esInstanciado;
    };

};
