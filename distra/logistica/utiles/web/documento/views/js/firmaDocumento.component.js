Ext.ns('LOG.lb.documento');
LOG.lb.documento.ConfigFirma = Ext.extend(LOG.util.Panel, {
    tipoFirma: 'creadorpor',
    constructor: function (config) {
        var _this = this;
        // this.tipoFirma = config.tipoFirma;
        var panel = new Ext.Panel({
            layout: 'form',
            labelAlign: 'top',
            region: 'center',
            frame: true,
            border: false,
            columnas: 2,
            items: [_this.txtNombre = LOG.util.Prototipos.inputTexto({
                    fieldLabel: LOG.lb.documento.Idioma.lbNombre,
                    allowBlank: false,
                    name: 'nombre' + config.tipoFirma,
                    anchor: '98%'
                }), _this.txtCI = LOG.util.Prototipos.inputEntero({
                    fieldLabel: LOG.lb.documento.Idioma.lbCI,
                    name: 'ci' + config.tipoFirma,
                    allowBlank: false,
                    maxLength: 11,
                    anchor: '98%'
                }), _this.txtCargo = LOG.util.Prototipos.inputTexto({
                    fieldLabel: LOG.lb.documento.Idioma.lbCargo,
                    name: 'cargo' + config.tipoFirma,
                    anchor: '98%'
                })]
        });

        this.btnBuscarPersona = LOG.util.Prototipos.botonGeneral({
            iconCls: 'buscar',
            text: LOG.lb.documento.Idioma.lbBuscarPersona,
            tooltip: LOG.lb.documento.Idioma.lbBuscarPersona,
            handler: this.abrirVentanaPersonas.createDelegate(this, [config.identidad])
        });

        config.items = [new LOG.util.Panel({
                items: [{
                        region: 'north',
                        broder: false,
                        frame: false,
                        tbar: [' ',
                            LOG.lb.documento.Idioma[config.tipoFirma],
                            '->', this.btnBuscarPersona]
                    }, panel]
            })];
        LOG.lb.documento.ConfigFirma.superclass.constructor.call(this, config);
    },

    abrirVentanaPersonas: function (identidad) {
        var _this = this;
        var panelBusPer = this.crearPanelBuscarPersona(identidad);
        var winBuscarPersona = new LOG.util.Window({
            title: LOG.lb.documento.Idioma.lbBuscarPersona,
            usarAplicar: false,
            usarAceptar: true,
            cerrarAceptar: true,
            // identidad: perfil.idestructuracomun,
            height: 450,
            width: 700,
            resizable: false,
            items: [{
                    border: false,
                    frame: false,
                    region: 'center',
                    layout: 'fit',
                    items: [panelBusPer]
                }],
            aceptarFn: function () {
                _this.setFirmaPersona(panelBusPer.getSeleccion());
                // _this.txtNombre.setValue(panelBusPer.getSeleccion().get('nombreyapellidos'));
                // _this.txtNombre.fireEvent('keyup');
                // _this.txtCI.setValue(panelBusPer.getSeleccion().get('numid'));
                // _this.txtCI.fireEvent('keyup');
                // _this.txtCargo.setValue(panelBusPer.getSeleccion().get('dencargo'));
                // _this.txtCargo.fireEvent('keyup');
            },
        });
        panelBusPer.smPersonas.on({
            'rowselect': function (sm, rowIndex, r) {
                if (sm.selections.items.length > 0) {
                    winBuscarPersona.listaBotones.getItem(2).enable();
                } else {
                    winBuscarPersona.listaBotones.getItem(2).disable();
                }
            },
            'rowdeselect': function (sm, rowIndex, r) {
                if (sm.selections.items.length > 0) {
                    winBuscarPersona.listaBotones.getItem(2).enable();
                } else {
                    winBuscarPersona.listaBotones.getItem(2).disable();
                }
            }
        });
        winBuscarPersona.listaBotones.getItem(2).disable();
        winBuscarPersona.show();
    },
    setFirmaPersona: function (record) {
        this.txtNombre.setValue(record.get('nombreyapellidos'));
        this.txtCI.setValue(record.get('numid'));
        this.txtCargo.setValue(record.get('denomcargo'));
        this.touch();
    },
    crearPanelBuscarPersona: function (identidad) {
        return new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            region: 'center',
            id: 'panelBusPer',
            border: false,
            frame: false,
            singleSelect: true,
            showBtnAdicionar: true,
            modulo: 'LOGISTICA',
            identidad: identidad ? (identidad == -1 ? null : identidad) : perfil.idestructuracomun,
            sincargo: 'false',
            showBtnAyuda: false,
            seguridad: 0,
            height: 400,
            limit: 30,
            start: 0
        });
    },
    setFirmaPersonaByConcepto: function (condicion) {
        var _this = this;
        var panelBusPer = this.crearPanelBuscarPersona();
        panelBusPer.stPersonas.on({
            load: function (st, records, opt) {
                if (panelBusPer.hasSearch) {
                    if (records.length == 1) {
                        //setear valor
                        _this.setFirmaPersona(records[0]);
                    }
                }
            }
        });
        panelBusPer.runSearch(condicion);
    },
    desHabilitarEdicionDeCampos: function () {
        this.isReadOnly = true;
        this.txtNombre.el.dom.readOnly = true;
        this.txtCI.el.dom.readOnly = true;
        this.txtCargo.el.dom.readOnly = true;
        this.btnBuscarPersona.disable();
    },
    reset: function () {
        if (!this.isReadOnly) {
            this.txtNombre.setValue('');
            this.txtCI.setValue('');
            this.txtCargo.setValue('');
            this.touch();
        }
    },
    touch: function () {
        this.txtNombre.fireEvent('keyup');
        this.txtCI.fireEvent('keyup');
        this.txtCargo.fireEvent('keyup');
    },
    getTipoFirmaByInputName: function (inputName) {
        var res = null;
        if (
                this.txtNombre.getName() === inputName ||
                this.txtCI.getName() === inputName ||
                this.txtCargo.getName() === inputName
                ) {
            res = this.tipoFirma;
        }
        return res;
    }
});

LOG.lb.documento.PanelFirmas = Ext.extend(LOG.util.Panel, {
    firmas: [
        'aprobadopor',
        'creadopor',
        'contabilizadopor',
        'transportadopor',
        'entregadopor',
        'recibido',
        'autorizadopor',
        'conciliadopor',
        'facturadopor',
        'jefealmacen',
        'jefecomision',
        'solicitadopor',
        'revisadopor'
    ],
    layout: 'fit',
    frame: false,
    broder: false,
    constructor: function (config, recordLoaded) {
        console.info(config.firmas.length);
        this.arrCmpConfFirma = [];
        this.recordLoaded = recordLoaded;
        var _this = this;
        var colunmForm = new LOG.util.ColumnForm({
            columnas: config.firmas.length
        });
        Ext.each(config.firmas, function (fConfig) {
            console.info(fConfig);
            var confFirma = new LOG.lb.documento.ConfigFirma({
                tipoFirma: fConfig,
                identidad: config.entidadDeLaPersona ? (config.entidadDeLaPersona[fConfig] == -1 ? -1 : recordLoaded.json[config.entidadDeLaPersona[fConfig]]) : undefined
            });
            _this.arrCmpConfFirma.push(confFirma);
            colunmForm.addComponent(confFirma)
        });
        config.items = [colunmForm];
        LOG.lb.documento.PanelFirmas.superclass.constructor.call(this, config);
    },
    getModelo: function () {
        return this.modelo;
    },
    setModelo: function (modelo) {
        this.modelo = modelo;
    },
    getConfFirmaByTipoFirma: function (tipoFirma) {
        for (var index = 0; index < this.arrCmpConfFirma.length; index++) {
            if (this.arrCmpConfFirma[index].tipoFirma == tipoFirma) {
                return this.arrCmpConfFirma[index];
            }
        }
        return null;
    },
    afterComponentShow: function (cfg) {
        var fn = function (resp) {
            if (cfg.confPorFirmas) {
                for (var index = 0; index < this.firmas.length; index++) {
                    if (cfg.confPorFirmas[this.firmas[index]]) {
                        this.aplicarConf(this.firmas[index], cfg.confPorFirmas[this.firmas[index]], resp);
                    }
                }
            }
            this.touch();
        }.bind(this);
        if (cfg.firmasPorDefecto) {
            var params = {};

            if (cfg.confPorFirmas) {
                var arr = [];
                for (var index = 0; index < this.firmas.length; index++) {
                    if (cfg.confPorFirmas[this.firmas[index]] && cfg.confPorFirmas[this.firmas[index]].readOnly) {
                        arr.push(this.firmas[index]);
                    }
                }
                if (arr.length) {
                    params.arrFirmasNoCargar = arr;
                }
            }

            this.getModelo().cargarFirmasPorDefecto(params, fn);
        } else {
            fn();
        }

    },
    aplicarConf: function (tipoFirma, conf, resp) {
        var cmp = this.getConfFirmaByTipoFirma(tipoFirma);
        if (conf.readOnly) {
            cmp.desHabilitarEdicionDeCampos();
        }
        if (conf.loadFromRecord) {
            //'87092255413'
            if (this.recordLoaded.json[conf.loadFromRecord]) {
                cmp.setFirmaPersonaByConcepto(this.recordLoaded.json[conf.loadFromRecord]);
            }
        }
        if (conf.readOnlyIfLoad && resp.datos) {
            var keys = Object.keys(resp.datos);
            for (var index = 0; index < keys.length; index++) {
                if (cmp.getTipoFirmaByInputName(keys[index])) {
                    cmp.desHabilitarEdicionDeCampos();
                    break;
                }
            }
        }
    },
    reset: function () {
        for (var index = 0; index < this.firmas.length; index++) {
            var cmp = this.getConfFirmaByTipoFirma(this.firmas[index]);
            cmp.reset();
        }
    },
    touch: function () {
        for (var index = 0; index < this.firmas.length; index++) {
            var cmp = this.getConfFirmaByTipoFirma(this.firmas[index]);
            cmp.touch();
        }
    },
});

LOG.lb.documento.ModelPluginFirmaDocumentos = Ext.extend(LOG.util.Model, {
    urlController: '/logistica/utiles/documento/index.php/documentologistica/',
    urlAccionGuardar: 'setFirmas',
    // urlAccionGuardarFirmasPorDefecto: 'setFirmasPorDefecto',
    // urlAccionCargarFirmasPorDefecto: 'getFirmasPorDefecto',
    //primaryKeyField: 'iddocumento',
    constructor: function (config) {
        config.primaryKeyField = 'iddocumento';
        // config.generalData = this.generalData;
        this.idioma = config.idioma;
        config.urlController = this.urlController;
        config.urlAccionGuardar = this.urlAccionGuardar;
        // config.urlAccionGuardarFirmasPorDefecto = this.urlController;
        // config.urlAccionCargarFirmasPorDefecto = this.urlController;
        // this.idFuncionalidad = config.idFuncionalidad;
        LOG.lb.documento.ModelPluginFirmaDocumentos.superclass.constructor.call(this, config);

        var _this = this;
        this.generalData = {
            idFuncionalidad: window.frameElement.id,
            iddocumento: config.iddocumento
        };
        this.iddocumento = config.iddocumento;
        // this.agregarVariablesPorDefecto = function () {
        //     _this.generalData = {
        //         idFuncionalidad: window.frameElement.id,
        //         iddocumento: config.iddocumento
        //     };
        //     _this.iddocumento = config.iddocumento;
        //     console.log(_this.iddocumento, _this.generalData);
        // };
    },
    salvarFirmasPorDefecto: function (parametros, _fn, _fnFail, msgMostrar, passFormValidation) {
        Ext.MessageBox.wait('Salvando firmas.', this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        objSubmit.data = Ext.encode(objSubmit.data || this.encode());

        Ext.Ajax.request({
            url: this.urlController + 'setFirmasPorDefecto',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnFail == 'function') {
                        _fnFail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    cargarFirmasPorDefecto: function (parametros, _fn, _fnFail, msgMostrar, passFormValidation) {
        var scope = this;
        Ext.MessageBox.wait('Cargando firmas guardadas.', this.idioma.msgEspere || '...');
        var objSubmit = {
            idFuncionalidad: scope.generalData.idFuncionalidad
        };
        Ext.apply(objSubmit, parametros);
        objSubmit.data = Ext.encode(objSubmit);

        Ext.Ajax.request({
            url: this.urlController + 'getFirmasPorDefecto',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    scope.basicForm.setValues(resp.datos);
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                    //scope.setDefaulFormValues();
                } else {
                    if (typeof _fnFail == 'function') {
                        _fnFail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
});

LOG.lb.documento.PluginFirmaDocumentos = function (config) {
    var cfg = config || {};
    return {
        init: function (v) {
            console.info(window.frameElement.id);
            // cfg.firmasPorDefecto = true;
            // cfg.confPorFirmas = {
            //     // aprobadopor: {readOnly: true, loadFromRecord: 'ci'},
            //     creadopor: {readOnly: true, loadFromRecord: 'ci'},
            //     //revisadopor: {readOnly: !rPluingFirmaModDef},
            //     //recibido: {readOnly: !rPluingFirmaModDef}
            // };
            var posBtn = v.listaBotones.count() - 3;
            if (cfg.posBtn && cfg.posBtn === 'last') {
                posBtn = v.listaBotones.count() - 2;
            }
            v.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'contratar',
                isContextual: true,
                text: 'Firmas',
                tooltip: 'Firmas',
                handler: function () {
                    var btn = this;
                    cfg.region = 'center';
                    var recordLoaded = v.getSmPrincipal().getSelected();
                    var panelFirma = new LOG.lb.documento.PanelFirmas(cfg, recordLoaded);
                    var modelo = new LOG.lb.documento.ModelPluginFirmaDocumentos({
                        iddocumento: recordLoaded.data.iddocumento,
                        idioma: Ext.apply(LOG.util.Idioma, LOG.lb.documento.Idioma),
                        idFuncionalidad: window.frameElement.id
                    });
                    panelFirma.setModelo(modelo);
                    // modelo.generalData = {
                    //     idFuncionalidad: window.frameElement.id
                    // };
                    // modelo.iddocumento = v.getSmPrincipal().getSelected().data.iddocumento;

                    var btnSalvarFirmasPorDefecto = LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonAplicar({
                        hidden: true,
                        disabled: true,
                        text: 'Salvar por defecto',
                        tooltip: 'Salvar por defecto los datos actuales.',
                        handler: function () {
                            panelFirma.getModelo().salvarFirmasPorDefecto();
                        }
                    }));

                    if (cfg.firmasPorDefecto) {
                        btnSalvarFirmasPorDefecto.setVisible(true);
                        if (typeof cfg.enableBtnSaveFirmaPorDef === 'undefined' || cfg.enableBtnSaveFirmaPorDef) {
                            btnSalvarFirmasPorDefecto.enable();
                        }
                    }

                    var onSuccess = function (resp) {
                        recordLoaded.set('firmado', 1);
                        btn.disable();
                    };

                    (new LOG.util.Window({
                        width: 950,
                        height: 280,
                        resizable: false,
                        usarAplicar: false,
                        title: LOG.lb.documento.Idioma.lbFirmas,
                        items: [panelFirma.getModelo().bindForm(LOG.util.UIManager.initForm({
                                region: 'center',
                                frame: true,
                                border: false,
                                items: [panelFirma]
                            }))],
                        buttons: [LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
                                handler: function () {
                                    this.ventana.close();
                                }
                            })), LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonLimpiar({
                                handler: function () {
                                    panelFirma.reset();
                                    // panelFirma.getModelo().reset();
                                    // panelFirma.getModelo().agregarVariablesPorDefecto();
                                }
                            })), btnSalvarFirmasPorDefecto, panelFirma.getModelo().addActionButton(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonGuardar({
                                handler: function () {
                                    if (panelFirma.getModelo().isValid()) {
                                        panelFirma.getModelo().salvar(undefined, onSuccess, undefined, 'El documento se firmo satisfactoriamente.');
                                        this.ventana.close();
                                    }
                                }
                            })))],
                        listeners: {
                            show: function () {
                                panelFirma.afterComponentShow(cfg);
                            }
                        }
                    })).show()
                },
                controlFn: function (btn, vista) {
                    /*if (vista.grantedAction('RFIRMA')) {
                     btn.setVisible(true);
                     } else {
                     btn.setVisible(false);
                     }*/
                    btn.disable();

                    vista.getSmPrincipal().fireEvent = vista.getSmPrincipal().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange' && vista.getSmPrincipal().getCount() == 1
                                && vista.getSmPrincipal().getSelected().data.firmado != 1) {
                            btn.enable();
                        } else {
                            btn.disable();
                        }
                    });
                }
            }), posBtn)
        }
    }
}