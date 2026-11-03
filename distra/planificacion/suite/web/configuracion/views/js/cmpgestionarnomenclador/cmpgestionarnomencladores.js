Utilidades.Cmp.CmpGestionarnomenclador = function () {

    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.incrementarContadorInstancia = 1;
    this.cont = 0;
    this.idSistemaSeleccionado = "";
    this.tituloSistema = "";
    this.denomSistema = "";
    this.objCmpGestNome;
    this.objCmpGestNomTab_1;
    this.objCmpGestNomTab_2;
    this.nodoselect;
    this.paramsNom;
    this.subsistemaInicial;
    this.arrayIdSubsistemas = [];

    this.BarraProgreso = new BarraEstado();

//funcion donde se procede a cargar la plantilla
    this.cargarNomencladores = function () {

        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/obtenerSistemas',
            //params: {},
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.subsistemaInicial = responseData[0];
                _this.paramsNom = {
                    idPanelPincipal: _this.subsistemaInicial.id,
                    tipoNomenDadoSubsistema: _this.subsistemaInicial.tipoNomenDadoSubsistema,
                    titulo: _this.subsistemaInicial.titulo
                };
                _this.idSistemaSeleccionado = _this.subsistemaInicial.id;
                _this.objCmpGestNomTab_1 = new Utilidades.Cmp.Cmpgestionarnomencladores({
                    subsistemaLlamada: 'integracion',
                    idsubsistema: 'integracion' + _this.paramsNom.idPanelPincipal,
                    tipoNomenDadoSubsistema: _this.paramsNom.tipoNomenDadoSubsistema,
                    idPanelPincipal: _this.paramsNom.idPanelPincipal,
                    cerrarPestaña: false
                });
                _this.objCmpGestNomTab_1.setTitle(_this.subsistemaInicial.titulo);
                _this.crearInterfazGestNomen(_this.objCmpGestNomTab_1);
            }
        });
    };

    this.crearInterfazGestNomen = function () {
        this.tpSubsistemas = new Ext.tree.TreePanel({
            useArrows: true,
            width: 250,
            collapsible: true,
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
                text: 'Subsistema a configurar nomencladores',
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
                        _this.paramsNom = {
                            idPanelPincipal: _this.idSistemaSeleccionado,
                            tipoNomenDadoSubsistema: nodo.attributes.tipoNomenDadoSubsistema,
                            titulo: nodo.attributes.titulo
                        };
                        if (!_this.isSubsistemaInstanciado(_this.idSistemaSeleccionado)) {
                            _this.InstanciarNomenDadoSubsistema(_this.objCmpGestNomTab_2, _this.paramsNom);
                            _this.arrayIdSubsistemas[_this.cont++] = _this.idSistemaSeleccionado;
                        } else {
                            if (_this.tpGestionarNom.getItem(_this.idSistemaSeleccionado) == undefined) {
                                _this.InstanciarNomenDadoSubsistema(_this.objCmpGestNomTab_2, _this.paramsNom);
                            } else {
                                if (_this.tpGestionarNom.getActiveTab().getId() != _this.idSistemaSeleccionado) {
                                    _this.tpGestionarNom.setActiveTab(_this.tpGestionarNom.getItem(_this.idSistemaSeleccionado));
                                }
                            }
                        }
                    }
                }
            }
        });

        this.tpGestionarNom = new Ext.TabPanel({
            activeTab: 0,
            id: 'tpsistema',
            region: 'center',
            frame: true,
            //disabled: true,
            width: '100%',
            items: [_this.objCmpGestNomTab_1],
            listeners: {
                tabchange: function (tbPanel, tab) {
                    if (_this.tpGestionarNom.getActiveTab().getId() != _this.idSistemaSeleccionado) {
                        _this.tpSubsistemas.getNodeById(_this.tpGestionarNom.getActiveTab().getId()).select();
                        _this.idSistemaSeleccionado = _this.tpGestionarNom.getActiveTab().getId();
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
            items: [_this.tpSubsistemas, _this.tpGestionarNom]
        });
        _this.WinPrincipal.show();
    };

    this.InstanciarNomenDadoSubsistema = function (objCmpGestNome, params) {
        objCmpGestNome = new Utilidades.Cmp.Cmpgestionarnomencladores({
            subsistemaLlamada: 'integracion',
            idsubsistema: 'integracion' + params.idPanelPincipal,
            tipoNomenDadoSubsistema: params.tipoNomenDadoSubsistema,
            idPanelPincipal: params.idPanelPincipal,
            cerrarPestaña: true
        });
        objCmpGestNome.setTitle(params.titulo);
        _this.tpGestionarNom.add(objCmpGestNome);
        _this.tpGestionarNom.activate(objCmpGestNome);
        _this.tpGestionarNom.enable();

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
