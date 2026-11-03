Utilidades.Cmp.CmpFondodetiempo = function (opcionesConfig) {

    var _this = this;
    Ext.QuickTips.init();
    Ext.Ajax.timeout = 1000000000;
    this.incrementarContadorInstancia = 1;
    this.cont = 0;
    this.idSistemaSeleccionado = "";
    this.tituloSistema = "";
    this.denomSistema = "";
    this.objCmpGestFondoTiempo;
    this.objCmpGestFondoTiempoTab_1;
    this.objCmpGestFondoTiempoTab_2;
    this.nodoselect;
    this.paramsFondoTiempo;
    this.subsistemaInicial;
    this.arrayIdSubsistemas = [];

    this.BarraProgreso = new BarraEstado();

//funcion donde se procede a cargar la plantilla
    this.cargarFondodetiempo = function () {

        var tipoInterfaz = (opcionesConfig.hasOwnProperty('tipoInterfaz')) ? opcionesConfig.tipoInterfaz : null;
        if (tipoInterfaz == 'grid') {
            _this.objCmpGestFondoTiempo = new Utilidades.Cmp.Cmpgestionarfondotiempo({
                tipoInterfaz: 'grid',
                subsistemaLlamada: 'integracion'
            });
            this.WinPrincipal = new Ext.Window({
                layout: 'border',
                closable: false,
                maximized: true,
                modal: true,
                width: 1000,
                height: 510,
                items: [_this.objCmpGestFondoTiempo.panelPrincipal]
            });
            _this.WinPrincipal.show();

        } else {
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/obtenerSistemas',
                //params: {},
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    _this.subsistemaInicial = responseData[0];
                    _this.paramsFondoTiempo = {
                        idPanelPincipal: _this.subsistemaInicial.id,
                        tipoFondoTiempoDadoSubsistema: _this.subsistemaInicial.tipoFondoTiempoDadoSubsistema,
                        titulo: _this.subsistemaInicial.titulo
                    };
                    _this.idSistemaSeleccionado = _this.subsistemaInicial.id;
                    _this.objCmpGestFondoTiempoTab_1 = new Utilidades.Cmp.Cmpgestionarfondotiempo({
                        tipoComponente: 'integracion',
                        subsistemaLlamada: 'integracion',
                        idsubsistema: 'integracion' + _this.paramsFondoTiempo.idPanelPincipal,
                        tipoFondoTiempoDadoSubsistema: _this.paramsFondoTiempo.tipoFondoTiempoDadoSubsistema,
                        idPanelPincipal: _this.paramsFondoTiempo.idPanelPincipal,
                        cerrarPestaña: false
                    });
                    _this.objCmpGestFondoTiempoTab_1.panelPrincipal.setTitle(_this.subsistemaInicial.titulo);
                    _this.crearInterfazGestFondoTiempo(_this.objCmpGestFondoTiempoTab_1.panelPrincipal);
                }
            });
        }
    };

    this.crearInterfazGestFondoTiempo = function () {
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
                        _this.BarraProgreso.show('Cargando nomencladores');
                        //console.log(_this.BarraProgreso);
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
                text: 'Subsistema a configurar fondo de tiempo',
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
                        _this.paramsFondoTiempo = {
                            idPanelPincipal: _this.idSistemaSeleccionado,
                            tipoFondoTiempoDadoSubsistema: nodo.attributes.tipoFondoTiempoDadoSubsistema,
                            titulo: nodo.attributes.titulo
                        };
                        if (!_this.isSubsistemaInstanciado(_this.idSistemaSeleccionado)) {
                            _this.InstanciarFondoTiempoDadoSubsistema(_this.objCmpGestFondoTiempoTab_2, _this.paramsFondoTiempo);
                            _this.arrayIdSubsistemas[_this.cont++] = _this.idSistemaSeleccionado;
                        } else {
                            if (_this.tpGestionarFondoTiempo.getItem(_this.idSistemaSeleccionado) == undefined) {
                                _this.InstanciarFondoTiempoDadoSubsistema(_this.objCmpGestFondoTiempoTab_2, _this.paramsFondoTiempo);
                            } else {
                                if (_this.tpGestionarFondoTiempo.getActiveTab().getId() != _this.idSistemaSeleccionado) {
                                    _this.tpGestionarFondoTiempo.setActiveTab(_this.tpGestionarFondoTiempo.getItem(_this.idSistemaSeleccionado));
                                }
                            }
                        }
                    }
                }
            }
        });

        this.tpGestionarFondoTiempo = new Ext.TabPanel({
            activeTab: 0,
            id: 'tpsistema',
            region: 'center',
            frame: true,
            //disabled: true,
            width: '100%',
            items: [_this.objCmpGestFondoTiempoTab_1.panelPrincipal],
            listeners: {
                tabchange: function (tbPanel, tab) {
                    if (_this.tpGestionarFondoTiempo.getActiveTab().getId() != _this.idSistemaSeleccionado) {
                        _this.tpSubsistemas.getNodeById(_this.tpGestionarFondoTiempo.getActiveTab().getId()).select();
                        _this.idSistemaSeleccionado = _this.tpGestionarFondoTiempo.getActiveTab().getId();
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
            //tbar: [],
            items: [_this.tpSubsistemas, _this.tpGestionarFondoTiempo]
        });

        _this.WinPrincipal.show();
    }

    this.InstanciarFondoTiempoDadoSubsistema = function (objCmpGestFondoTiempo, params) {
        objCmpGestFondoTiempo = new Utilidades.Cmp.Cmpgestionarfondotiempo({
            tipoComponente: 'integracion',
            subsistemaLlamada: 'integracion',
            idsubsistema: 'integracion' + params.idPanelPincipal,
            tipoFondoTiempoDadoSubsistema: params.tipoFondoTiempoDadoSubsistema,
            idPanelPincipal: params.idPanelPincipal,
            cerrarPestaña: true
        });
        objCmpGestFondoTiempo.panelPrincipal.setTitle(params.titulo);
        _this.tpGestionarFondoTiempo.add(objCmpGestFondoTiempo.panelPrincipal);
        _this.tpGestionarFondoTiempo.activate(objCmpGestFondoTiempo.panelPrincipal);
        objCmpGestFondoTiempo.formularioGuardar.doLayout();
        _this.tpGestionarFondoTiempo.enable();

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
