Ext.ns('LOG.lb.documento');
LOG.lb.documento.View = Ext.extend(LOG.util.UITemplate, {
    idGridPrincipal: 'iddocumento',
    /**
     * Lista de elementos del menu contextual del grid prinicpal
     * @type type
     */
    listaContexMenu: undefined,
    /**
     * Objeto que contiene las etiquetas para los componentes utilizados
     */
    idioma: undefined,
    /**
     * Objeto para adicionar elementos al panel de datos al norte
     */
    formularioGeneral: null,
    /**
     * Objeto para adicionar elementos a un panel al sur
     */
    formularioSur: null,
    /**
     * Obejeto para adicionar elementos al panel del este
     */
    formularioEste: null,
    /**
     * Obejeto para adicionar elementos al panel del oeste
     */
    formularioOeste: null,
    /***
     *
     * Objeto de la ventana adicionar documento
     */
    winGestionarDocumento: undefined,
    /***
     *
     */
    textBusquedaSimple: 'No. documento, No. de referencia',
    /**
     *
     * @type type
     */
    usuarios: undefined,

    usarObservaciones: undefined,

    useSign: (window.useSign) ? true : false,

    name: undefined,

    dirReport: undefined,

    signDetails: undefined,

    cantSign: 0,

    typeRequest: 'auto',

    typeFormat: 'HTML',

    content: 'text/HTML',

    paginated: true,

    isAttachment: false,

    subsistema: null,
    /**
     * Construye una nueva instancia de la clase
     * @returns {undefined}
     */
    constructor: function (config) {
        this.listaBotones = new LOG.util.List();
        this.listaPlugins = new LOG.util.List();
        this.listaGridColumns = new LOG.util.List();
        this.listaGridColumnsProductos = new LOG.util.List();
        this.listaBotonesProductos = new LOG.util.List();
        this.listaBotonesVentana = new LOG.util.List();
        this.listaBotonesMenu = new LOG.util.List();
        this.listaContexMenu = new LOG.util.List();
        var _this = this;
        config.idioma = LOG.util.UIManager.apply(LOG.lb.documento.Idioma, config.idioma);
        if (config.model) {
            config.model.idioma = LOG.util.UIManager.apply(LOG.lb.documento.Idioma, config.idioma);
        }
        this.modelo = config.model || new LOG.lb.documento.Model({
            idioma: config.idioma
        });
        this.winGestionarDocumento = new LOG.lb.documento.ventanaGestionDocumentos({
            idioma: config.idioma,
            modelo: this.modelo,
            scope: this,
            height: 580,
            title: (config.idioma.tlAdicionar) ? config.idioma.tlAdicionar : config.idioma.tlVentanaGestion,
            width: 750
        });
        LOG.lb.documento.View.superclass.constructor.call(this, config);
        this.__comprobante = new LOG.lb.comprobante.View({
            idioma: LOG.util.UIManager.apply(LOG.lb.comprobante.Idioma, LOG.util.Idioma),
            acciones: config.acciones,
            subsistema: _this.subsistema,
            getSmPrincipal: function () {
                return _this.getSmPrincipal();
            }
        });
        this.__comprobante.initDefaultButtons();
        this.__comprobante.btnGenerar.controlFn = function (b, _caller) {

            if (_this.grantedAction('RPOSTEAR')) {
                b.show();
            } else {
                b.hide();
            }
            b.disable();
            _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                if (e == 'selectionchange') {
                    b.disable();
                    if (this.hasSelection() && this.getCount() == 1 && this.getSelected().data.idcomprobante == '' && this.getSelected().data.estado == 4) {
                        b.enable();
                    }
                }
            });
        };
        var currentWindow = window.parent.Ext.getCmp('win' + window.frameElement.id);
        if (typeof alias !== 'undefined') {
            currentWindow.removeListener('beforeclose');
            currentWindow.addListener('beforeclose', function () {
                if (typeof currentWindow.closeControl == undefined || !currentWindow.closeControl) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', '/logistica/utiles/documento/index.php/desbloqueo/desbloquearDocumento?alias=' + alias, false);
                    xhr.send('alias = ' + alias);
                    currentWindow.closeControl = true;
                }
            });
        }
    },
    /**
     *
     * @param {type} b
     * @param {type} f
     * @returns {undefined}
     */
    addToolbarButtonVentana: function (b) {
        this.winGestionarDocumento.addToolbarButtonVentana(b, f);
    },
    /**
     * Inserta un boton en una posicion especifca del tbar
     * @param {type} b
     * @param {type} i
     * @returns {undefined}
     */
    insertToolbarButtonVentana: function (b, i, f) {
        this.winGestionarDocumento.insertToolbarButtonVentana(b, i, f);
    },
    /**
     *
     * @param {type} b
     * @param {type} f
     * @returns {undefined}
     */
    addToolbarButtonProductos: function (b, f) {
        this.winGestionarDocumento.addToolbarButtonProductos(b, f);
    },
    /**
     * Inserta un boton en una posicion especifca del tbar
     * @param {type} b
     * @param {type} i
     * @returns {undefined}
     */
    insertToolbarButtonProductos: function (b, i, f) {
        this.winGestionarDocumento.insertToolbarButtonProductos(b, i, f);
    },
    /**
     * Adiciona un nueva columna al grid
     * @param {type} c
     * @returns {undefined}
     */
    addGridColumnProductos: function (c) {
        this.winGestionarDocumento.addGridColumnProductos(c);
    },
    /**
     * Inserta una columna en el grid en una posicion especifica
     * @param {type} c
     * @param {type} i
     * @returns {undefined}
     */
    insertGridColumnProductos: function (c, i) {
        this.winGestionarDocumento.insertGridColumnProductos(c, i);
    },
    /**
     * Adiciona un elemento en el menu contextual
     * @param {type} c
     * @returns {undefined}
     */
    addContextMenu: function (c) {
        this.listaContexMenu.add(c);
    },
    /**
     * Inserta un elemento en el menu contextual
     * @param {type} c
     * @param {type} i
     * @returns {undefined}
     */
    insertContextMenu: function (c, i) {
        this.listaContexMenu.insert(c, i);
    },
    /**
     * Para cambiar el idioma por defecto usado en el componente
     * @returns {undefined}
     */
    setIdioma: function (i) {
        this.idioma = i || LOG.lb.documento.Idioma;
    },
    /**
     *
     * @returns {undefined}
     */
    init: function () {
        LOG.lb.documento.View.superclass.init.call(this);
    },
    /**
     * Inicializa las columnas por defecto del gridpanel
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgNroDoc,
            width: 110,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNroRef,
            width: 110,
            dataIndex: 'numeroref',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaCreado,
            width: 120,
            dataIndex: 'fechacontable',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgEstdoDoc,
            width: 120,
            dataIndex: 'estado',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });

        this.addGridColumn({
            header: this.idioma.cgCantProd,
            width: 120,
            dataIndex: 'cantproductos',
            align: 'right',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgCreadoPor,
            width: 170,
            dataIndex: 'idusuario',
            default: true,
            renderer: function (v) {
                return _this.getUsuarioById(v);
            }
        });
        this.addGridColumn({
            dataIndex: 'iddocumento'
        });
        this.addGridColumn({
            dataIndex: 'idcomprobante'
        });
        this.addGridColumn({
            dataIndex: 'observaciones'
        });
        this.addGridColumn({
            dataIndex: 'is_creador'
        });
        this.addGridColumn({
            dataIndex: 'firmado'
        });
        this.addGridColumn({
            dataIndex: 'idbloqueousuario'
        });
        this.addGridColumn({
            header: this.idioma.cgAprobadoPor,
            width: 170,
            dataIndex: 'aprobadopor',
            default: true,
            renderer: function (v) {
                return _this.getUsuarioById(v);
            }
        });
        if (this.useSign) {
            this.addGridColumn({
                header: this.idioma.cgFirmado,
                width: 100,
                dataIndex: 'controlfirma',
                align: 'center',
                default: true,
                renderer: function (value, metaData) {
                    if (value >= 1) {
                        metaData.css = 'icondistra-aceptar azul';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttSiFirmado + '"';
                    } else {
                        metaData.css = 'icondistra-cancelar rojo';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttNoFirmado + '"';
                    }
                }
            });
            this.addGridColumn({
                dataIndex: 'idnodo'
            });
        }
    },
    /**
     * Inicializa los botones generales de la IU
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        //Botones principales
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonNuevo({
            text: this.idioma.lbBtnNuevo,
            tooltip: this.idioma.ttBtnAdicionar,
            handler: function () {
                _this.initVentanaGestion();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonAbrir({
            tooltip: this.idioma.ttBtnAbrir,
            isContextual: true,
            handler: function () {
                _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected(), 2);
            },
            controlFn: function (b, _caller) {
                b.disable();

                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'ver');
            }
        }));

        this.onGridDobleClick = function () {
            var b = _this.listaBotones.getItem(1);
            b.handler.call(b, b);
        };

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            text: this.idioma.lbBtnEliminar,
            tooltip: this.idioma.ttBtnEliminar,
            isContextual: true,
            handler: function () {
                _this.modelo.eliminar();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'eliminar');
                } else {
                    b.hide();
                }
            }
        }));
        /*this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: this.idioma.lbBtnBloquear,
            tooltip: this.idioma.ttBtnBloquear,
            isContextual: true,
            iconCls:'desbloquear',
            handler: function () {
                console.log(_this.getSmPrincipal().getSelected().data)
                var accion = _this.getSmPrincipal().getSelected().data.idbloqueousuario != '' ? 'desbloquear' : 'bloquear';
                var _tempURL = _this.modelo.urlController;
                _this.modelo.urlController = '/logistica/utiles/documento/index.php/documentologistica/';
                _this.modelo.bloquear(accion, function (){
                    _this.modelo.urlController = _tempURL;
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RBloquear')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && (this.getSelected().data.idbloqueousuario == idUsuario ||this.getSelected().data.idbloqueousuario =='')) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'bloquear');
                } else {
                    b.hide();
                }
            }
        }));*/
        if (this.usarObservaciones) {
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                tooltip: this.idioma.ttBtnObservaciones,
                text: this.idioma.lbBtnObservaciones,
                isContextual: true,
                handler: function () {
                    var ventanaObs = new LOG.lb.documento.observacionesDoc({
                        idioma: _this.idioma,
                        acciones: _this.acciones,
                        iddocumento: _this.getSmPrincipal().getSelected().data.iddocumento
                    });
                    ventanaObs.init();
                    ventanaObs.view({title: 'Observaciones', width: 700, height: 500});
                    ventanaObs.getStorePrincipal().load();
                    ventanaObs.getVistaPrincipal().aceptarFn = function () {
                        var datos = new Array();
                        var i = 0;
                        ventanaObs.getStorePrincipal().each(function (record) {
                            if (!record.data.iddocobservaciones || record.dirty) {
                                datos[i] = record.data;
                                i++;
                            }
                        });
                        var params = {};
                        params.observaciones = Ext.encode(datos);
                        params.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;
                        ventanaObs.modelo.salvarObservaciones(params, function (resp) {
                            ventanaObs.getStorePrincipal().reload();
                        });
                    };
                },
                controlFn: function (b, _caller) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RObservaciones')) {
                        b.show();
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() == 1) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    } else {
                        b.hide();
                    }
                }
            }));
        }
        if (this.useSign) {
            this.addToolbarButton(LOG.util.Prototipos.botonFirmar({
                itemId: 'btnFirmar',
                text: this.idioma.lbBtnFirmar,
                tooltip: this.idioma.ttBtnFirmar,
                isContextual: true,
                handler: this.onSign.createDelegate(this),
                controlFn: function (b, _caller) {
                    if (this.getGridPrincipal().getSelectionModel().hasSelection() && _this.grantedSignAction('RFirmar')) {
                        b.show();
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() >= 1) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'firmar');
                    } else {
                        b.hide();
                    }
                }
            }));
        }
        let menuImprimir = [new Ext.menu.Item({
            text: this.idioma.lbBtnImprimirListado,
            tooltip: this.idioma.ttBtnImprimir,
            menuHhelp: 1,
            isList: true,
            iconCls: 'icondistra-imprimir',
            name: this.name + 'Listado',
            handler: _this.onReport.createDelegate(this)
        }),
            new Ext.menu.Item({
                text: this.idioma.lbBtnImprimirModelo,
                tooltip: this.idioma.ttBtnImprimir,
                menuHhelp: 2,
                isList: false,
                name: this.name + 'Modelo',
                iconCls: 'icondistra-imprimir',
                hidden: true,
                handler: _this.onReport.createDelegate(this)
            })];
        if (_this.arrayMenuImprimir) {
            menuImprimir = menuImprimir.concat(_this.arrayMenuImprimir);
        }
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            tooltip: this.idioma.ttBtnImprimir,
            menu: menuImprimir,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD') || _this.grantedAction('RImprimir')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {  
                            b.menu.get(1).setVisible(this.getCount() == 1);
                        }
                    }, 'imprimir');
                    LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                             b.setVisible(this.getCount() > 0);
                        }
                    }, 'imprimir');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        if (this.useSign) {
            this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonFirmar({
                itemId: 'btnFirmar',
                text: this.idioma.lbBtnFirmar,
                tooltip: this.idioma.ttBtnFirmar,
                isContextual: true,
                handler: this.onSign.createDelegate(this),
                controlFn: function (b, _caller) {
                    if (_this.winGestionarDocumento.record && _this.grantedSignAction('RFirmar')) {
                        b.show();
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() >= 1) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'firmar');
                    } else {
                        b.hide();
                    }
                }
            }));
        }
        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            hidden: true,
            text: this.idioma.lbBtnImprimirModelo,
            tooltip: this.idioma.ttBtnImprimir,
            iconCls: 'icondistra-imprimir',
            handler: this.onReport.createDelegate(this, [{
                isList: false,
                name: this.name + 'Modelo'
            }]),
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                // b.disable();
                _this.fireEvent = _this.fireEvent.createSequence(function (e) {
                    if (e == 'show') {
                        _this.controlBotones(b, b.estado);
                    }
                });
            }
            /* controlFn: function (b, _caller) {
                 if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                     b.setVisible(true);
                     if (_this.winGestionarDocumento.record) {
                         b.setDisabled(false);
                     }
                 } else {
                     b.setVisible(false);
                 }
             }*/
        }));
        this.addToolbarButton('->');

        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({}));
    },
    /**
     * @param {Integer} tipoVentana
     * @param {Boolean} noCargar
     * @returns {undefined}
     */
    initVentanaGestion: function (d, tipoVentana, noCargar) {
        if (!this.winGestionarDocumento.isInit()) {
            this.winGestionarDocumento.init();
            if (this.formularioGeneral != null) {
                this.winGestionarDocumento.addPanelSuperior(this.formularioGeneral);
            }
            if (this.formularioSur != null) {
                this.winGestionarDocumento.addPanel(this.formularioSur);
            }
            if (this.formularioEste != null) {
                this.winGestionarDocumento.addPanel(this.formularioEste);
            }
            if (this.formularioOeste != null) {
                this.winGestionarDocumento.addPanel(this.formularioOeste);
            }
        }
        this.winGestionarDocumento.tipoVentana = tipoVentana || 1;

        if (d) {
            this.winGestionarDocumento.prepareDocModify(d, noCargar);
        } else {
            this.winGestionarDocumento.fromularioGestion.getForm().loadRecord({data: {}});
        }
        this.winGestionarDocumento.show();
        this.winGestionarDocumento.maximize();
    },
    /**
     *
     * @param {type} _fn
     * @returns {undefined}
     */
    cargaInicial: function (_fn) {
        this.modelo.cargaInicial({
            url: '/logistica/utiles/documento/index.php/documentologistica/cargaInicial'
        }, _fn, this.idioma.msgCargaInicial);
    },
    /**
     *
     * @returns {undefined}
     */
    view: function () {
        var _this = this;
        this.cargaInicial(function (r) {
            _this.usuarios = r[0].usuarios;
            LOG.lb.documento.View.superclass.view.call(_this);
            _this.__comprobante.modelo.urlController = '/logistica/utiles/comprobante/index.php/comprobante/';
            _this.__comprobante.modelo.bindGridPanel(_this.getGridPrincipal());
        });
    },
    /**
     *
     * @param {type} id
     * @returns {Anonym$0@arr;usuarios@pro;nombreusuario|String}
     */
    getUsuarioById: function (id) {
        for (var i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].idusuario == id) {
                return this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    onSign: function () {
        mostrarMensaje(2, this.idioma.msgConfirmacionFirmando, function (btn) {
            if (btn == 'ok') {
                this.initWindowSign();
            }
        }.createDelegate(this));
    },
    buildReport: function (btn, record) {
        return {
            name: btn.name,
            description: (btn.isList) ? '' : (this.winGestionarDocumento.isVisible() ? this.winGestionarDocumento.title : btn.name + " # " + (record.get('numeroref') || record.get('nrodoc')) + " del " + record.get('fechacontable') + " en " + LOG.lb.documento.Estado[record.get('estado')]),
            isList: btn.isList,
            params: this.getParamsReport(record, btn),
            dirReport: '/distra' + this.dirReport + btn.name,
            uiSearch: (btn.isList && this.busquedaAvanzada) ? this.panelBusquedaAvanzada : {}
        };
    },
    onReport: function (btn) {
        var _this = this;
        var record = this.winGestionarDocumento.isVisible() ? new Ext.data.Record(this.winGestionarDocumento.record.data) : this.getGridPrincipal().getSelectionModel().getSelected();
        if (this.useSign && !btn.isList) {
            var report = this.buildReport(btn, record);
            this.rulesSign = (_this.grantedSignAction('RFirmar'));
            report.params.useSign = (useSign && this.rulesSign) ? true : false;
            report.hasSign = record.get('controlfirma') > 0;
            report.signDetails = this.signDetails;
            report.node = record.get('idnodo');
            report.model = this.modelo;
            new LOG.util.SignReport({
                rulesSign: this.rulesSign,
                reports: [report]
            }).view();
        } else {
            new LOG.util.Report({
                typeRequest: this.typeRequest,
                typeFormat: this.typeFormat,
                content: this.content,
                paginated: this.paginated,
                isAttachment: this.isAttachment,
                reports: [this.buildReport(btn, record)]
            }).view();
        }
    },
    /**
     * @param
     * @returns {undefined}
     */
    initWindowSign: function () {
        var _this = this;
        var record = _this.getGridPrincipal().getSelectionModel().getSelected();
        this.sign = new LOG.util.SignView({
            action: (parseInt(record.get('controlfirma')) != 0) ? 'firmar' : 'certificar',
            cantSign: this.cantSign,
            posSign: 'last',
            controlSign: record.get('controlfirma')
        });
        this.sign.setTitle(this.sign.action === 'certificar' ? 'Certificar documento' : 'Firmar documento');
        this.sign.on('beforeSign', function (self, signSet) {
            _this.modelo.firmar({
                action: _this.sign.action === 'certificar' ? 'Certificando documento(s).' : 'Firmando documento(s).',
                signSet: signSet,//signSet
                reportSet: _this.buildReport({name: _this.name + 'Modelo', isList: false}, record)
            }, Ext.emptyFn);
        });
        this.sign.show();
    },
    /**
     * @param
     * @returns {boolean}
     */
    grantedSignAction: function (idAccion) {
        var existe = false;
        var record = this.getGridPrincipal().getSelectionModel().getSelected();
        console.log(this.listaAcciones)
        this.listaAcciones.each(function (a) {
            console.log(a['abreviatura'], idAccion + '_' + record.get('estado').toString() + '_' + record.get('controlfirma').toString())
            if (a['abreviatura'] == (idAccion + '_' + record.get('estado').toString() + '_' + record.get('controlfirma').toString())) {
                existe = true;
            }
        });
        return existe;
    }
});
