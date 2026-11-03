Utilidades.Cmp.Cmpflujotrabajo = function () {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;

    this.BarraProgreso = new BarraEstado();
    this.cont = 0;
    this.idSistemaSeleccionado = "";
    this.params;
    this.subsistemaInicial;
    this.objCmpFlujoTab_1;
    this.arrayIdSubsistemas = [];

    //funcion donde se muestra la ventana principal
    this.cargarFlujoTrabajo = function () {
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/obtenerSistemas',
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.subsistemaInicial = responseData[0];
                _this.params = {
                    idPanelPincipal: _this.subsistemaInicial.id,
                    tipoPermDadoSubsistema: _this.subsistemaInicial.tipoNomenDadoSubsistema,
                    titulo: _this.subsistemaInicial.titulo
                };
                _this.idSistemaSeleccionado = _this.subsistemaInicial.id;

                //objeto Cmpestados inicializado

                var objEstados = new Utilidades.Cmp.Cmpgestionarestado(
                    {
                        subsistemaLlamada: 'integracion',
                        idsubsistema: 'integracion' + _this.params.idPanelPincipal,
                        idPanelPincipal: _this.params.idPanelPincipal
                    });
                //objeto Cmptransicion inicializado
                var objTransicion = new Utilidades.Cmp.Cmpgestionarflujodetrabajo({
                    subsistemaLlamada: 'integracion',
                    idsubsistema: 'integracion' + _this.params.idPanelPincipal,
                    idPanelPincipal: _this.params.idPanelPincipal
                });

                objEstados.pEstados.setTitle('Estados de la información');
                objTransicion.pTransiciones.setTitle('Transiciones de la información');

                _this.objCmpFlujoTab_1 = new Ext.TabPanel({
                    activeTab: 0,
                    id: _this.params.idPanelPincipal,
                    frame: true,
                    closable: false,
                    title: _this.params.titulo,
                    closeAction: 'destroy',
                    items: [objEstados.pEstados, objTransicion.pTransiciones],
                    width: '100%',
                    listeners: {
                        tabchange: function (tbPanel, tab) {

                        }
                    }
                });
                _this.crearInterfazFlujoTrabajo(_this.objCmpFlujoTab_1);
            }
        });
    };

    this.crearInterfazFlujoTrabajo = function () {

        this.tpSubsistemas = new Ext.tree.TreePanel({
            useArrows: true,
            collapsible: true,
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
                        _this.BarraProgreso.show('Cargando flujo de trabajo');
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
                text: 'Subsistemas',
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
                        _this.params = {
                            idPanelPincipal: _this.idSistemaSeleccionado,
                            tipoPermDadoSubsistema: nodo.attributes.tipoNomenDadoSubsistema,
                            titulo: nodo.attributes.titulo
                        };
                        if (!_this.isSubsistemaInstanciado(_this.idSistemaSeleccionado)) {
                            _this.instanciarFlujoDadoSubsistema(_this.params);
                            _this.arrayIdSubsistemas[_this.cont++] = _this.idSistemaSeleccionado;
                        } else {
                            if (_this.tpGestionDeFlujo.getItem(_this.idSistemaSeleccionado) == undefined) {
                                _this.instanciarFlujoDadoSubsistema(_this.params);
                            } else {
                                if (_this.tpGestionDeFlujo.getActiveTab().getId() != _this.idSistemaSeleccionado) {
                                    _this.tpGestionDeFlujo.setActiveTab(_this.tpGestionDeFlujo.getItem(_this.idSistemaSeleccionado));
                                }
                            }
                        }
                    }
                }
            }
        });

        this.tpGestionDeFlujo = new Ext.TabPanel({
            activeTab: 0,
            id: 'tpGestionDeFlujo',
            region: 'center',
            frame: true,
            width: '100%',
            items: [_this.objCmpFlujoTab_1],
            listeners: {
                tabchange: function (tbPanel, tab) {
                    if (_this.tpGestionDeFlujo.getActiveTab().getId() != _this.idSistemaSeleccionado) {
                        _this.tpSubsistemas.getNodeById(_this.tpGestionDeFlujo.getActiveTab().getId()).select();
                        _this.idSistemaSeleccionado = _this.tpGestionDeFlujo.getActiveTab().getId();
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
            items: [_this.tpSubsistemas, _this.tpGestionDeFlujo]
        });
        _this.WinPrincipal.show();
    };

    this.instanciarFlujoDadoSubsistema = function (params) {
        //objeto Cmpestados inicializado
        var objEstados2 = new Utilidades.Cmp.Cmpgestionarestado(
            {
                subsistemaLlamada: 'integracion',
                idsubsistema: 'integracion' + params.idPanelPincipal,
                idPanelPincipal: params.idPanelPincipal
            });
        //objeto Cmptransicion inicializado
        var objTransicion2 = new Utilidades.Cmp.Cmpgestionarflujodetrabajo({
            subsistemaLlamada: 'integracion',
            idsubsistema: 'integracion' + params.idPanelPincipal,
            idPanelPincipal: params.idPanelPincipal
        });

        objEstados2.pEstados.setTitle('Estados de la información');
        objTransicion2.pTransiciones.setTitle('Transiciones de la información');

        var objCmpFlujo = new Ext.TabPanel({
            activeTab: 0,
            id: params.idPanelPincipal,
            frame: true,
            closable: true,
            title: params.titulo,
            closeAction: 'destroy',
            items: [objEstados2.pEstados, objTransicion2.pTransiciones],
            width: '100%'
        });
        _this.tpGestionDeFlujo.add(objCmpFlujo);
        _this.tpGestionDeFlujo.activate(objCmpFlujo);
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
