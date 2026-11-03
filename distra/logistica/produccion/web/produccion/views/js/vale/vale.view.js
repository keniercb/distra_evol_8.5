Ext.ns('LOG.produccion.valeproduccion');
LOG.produccion.valeproduccion.View = Ext.extend(LOG.produccion.documento.View, {
    name: 'ValeProduccion',
    dirReport: '/logistica/produccion/valeproducion/',
    /** 
     * @param {Object} config
     */
    usarAbrir: false,
    formaVisualizacion: 'panel',
    dirController: '/logistica/produccion/produccion/index.php/valeproduccion',
    constructor: function (config) {
        this.busquedaBasica = true;
        config.idioma = LOG.produccion.valeproduccion.Idioma;
        this.modoSeleccion = 1;
        config.model = new LOG.produccion.valeproduccion.Model({
            idioma: config.idioma,
            idordenproduccion:config.baseParams.idordenproduccion,
            urlController: this.dirController
        });
        LOG.produccion.valeproduccion.View.superclass.constructor.call(this, config);
        this.winGestionarDocumento = new LOG.produccion.valeproduccion.ventanaGestionDocumentos({
            idioma: config.idioma,
            modelo: this.modelo,
            scope: this,
            acciones: this.acciones,
            height: 580,
            title: (config.idioma.tlAdicionar) ? config.idioma.tlAdicionar : config.idioma.tlVentanaGestion,
            width: 750
        });
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.produccion.valeproduccion.View.superclass.initDefaultColumns.call(this);
        this.insertGridColumn({
            header: 'Cant. productos',
            dataIndex: 'cantproductos',
            default: true,
            align: 'right',
            type:'float',
            width: 100
        }, 4);
        this.insertGridColumn({
            header: 'Inf. recepción',
            dataIndex: 'nrodocgenerado',
            default: true,
            align: 'right',
            width: 100,
            renderer: function (val) {
                if (val != '')
                    return val;
                else return '-';
            }
        }, 5);
        this.insertGridColumn({
            header: 'Cantidad',
            dataIndex: 'cantidad',
            default: true,
            align: 'right',
            type:'float',
            width: 150
        }, 6);
        this.insertGridColumn({
            header: 'Turno',
            dataIndex: 'idturnotrabajo',
            default: true,
            width: 150,
            renderer:function(v){
                if(v && !Ext.isEmpty(_this.cmbTurno.getStore().getById(v))){
                    return _this.cmbTurno.getStore().getById(v).get('denominacion');
                }
                return "";
            }
        }, 7);
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true,
            hideable: false
        });
        this.listaColumnas.getBy('dataIndex', 'cantproductos').hidden = true;
        this.addGridColumn({
            dataIndex: 'idvaleproduccion',
            hidden: true,
            hideable: false
        });
        this.addGridColumn({
            dataIndex: 'identrega',
            hidden: true,
            hideable: false
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.produccion.valeproduccion.View.superclass.initDefaultButtons.call(this);

        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function () {
                _this.initVentanaGestion();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RAdicionarVale')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'beforeload') {
                            console.info(_this);
                            b.setDisabled((_this.ordenProduccion.record && _this.ordenProduccion.record.data.estado == 9 || (_this.ordenProduccion.scope.getSmPrincipal().getSelected() && _this.ordenProduccion.scope.getSmPrincipal().getSelected().data.estado == 9)) ? true : false);
                        }
                    }, 'nuevo');
                } else {
                    b.hide();
                }
            }
        });

        this.listaBotones.getItem(1).handler = this.listaBotones.getItem(1).handler.createSequence(function (e) {
            _this.habilitarElementosWindow();
        });
/*
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            handler: function () {
                _this.initVentanaGestion();
                console.log('wgtegerth');
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RAdicionarVale')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'beforeload') {
                            console.info(_this);
                            b.setDisabled((_this.ordenProduccion.record && _this.ordenProduccion.record.data.estado == 9 || (_this.ordenProduccion.scope.getSmPrincipal().getSelected() && _this.ordenProduccion.scope.getSmPrincipal().getSelected().data.estado == 9)) ? true : false);
                        }
                    }, 'eliminar');
                } else {
                    b.hide();
                }
            }
        });*/

        LOG.util.UIManager.apply(this.listaBotones.getItem(3), {
            disabled: true,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled(!(this.getCount() == 1 && (this.getSelected().data.estado == 1)));
                        }
                    }, 'confirmar');
                } else {
                    b.hide();
                }
            }
        });

        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            handler: function () {
                _this.modelo.confirmar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "2"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "2";
                    }
                    _this.winGestionarDocumento.productosobtenidosView.btnAdicionar.disable();
                    _this.winGestionarDocumento.productosobtenidosView.btnEliminar.disable();
                    _this.winGestionarDocumento.materialesView.btnAdicionar.disable();
                    _this.winGestionarDocumento.maquinariaView.btnAdicionar.disable();
                    _this.winGestionarDocumento.btnAdicionar.disable();
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                    _this.winGestionarDocumento.doLayout();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                    /*let disabled = !(Object.entries(_this.winGestionarDocumento.record).length > 0 && (_this.winGestionarDocumento.record.data.estado == 1 || _this.winGestionarDocumento.record.data.estado == 13));
                    b.setDisabled(disabled);*/

                } else {
                    b.setVisible(false);
                }
            }
        });

        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            handler: function () {
                _this.modelo.anularestado({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "1";
                    }
                    _this.winGestionarDocumento.productosobtenidosView.btnAdicionar.enable();
                    _this.winGestionarDocumento.materialesView.btnAdicionar.enable();
                    _this.winGestionarDocumento.maquinariaView.btnAdicionar.enable();
                    _this.winGestionarDocumento.btnAdicionar.enable();
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementosWindow();
                    _this.winGestionarDocumento.doLayout();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    /*let disabled = !(Object.entries(_this.winGestionarDocumento.record).length > 0 && (_this.winGestionarDocumento.record.data.estado == 2));
                    b.setDisabled(disabled);*/
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        LOG.util.UIManager.apply(this.listaBotones.getItem(5), {
            handler: function () {
                _this.model.aprobarValeProduccion({});
            },
            controlFn: function (b, _caller) {
                if ((_caller.grantedAction('CT') || _caller.grantedAction('RAprobar'))) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled(!(this.getCount() == 1 && this.getSelected().data.estado == 2));
                        }
                    }, 'aprobar');
                } else {
                    b.setVisible(false);
                }
            }
        });
        Ext.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(5), {
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado > 0) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
    },
    /**
     *
     * @returns {undefined}
     */
    view: function () {
        var _this = this;
        this.cargaInicial(function (r) {
            _this.usuarios = r[0].usuarios;
        });

        return LOG.lb.documento.View.superclass.view.call(_this);
    },
    buildMgm: function () {
        var _this = this;
        var clsDatosGenerales = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        clsDatosGenerales.addComponent(this.ieCantidad = new LOG.util.Prototipos.inputDecimal({
            name: 'cantidad',
            fieldLabel: 'Cantidad',
            allowBlank: false,
            ancho: '95%',
            campo: true
        }));
        clsDatosGenerales.addComponent(_this.cmbTurno = new LOG.util.ComboBox({
            fieldLabel: 'Turno',
            name: 'idturnotrabajo',
            hiddenName: 'idturnotrabajo',
            displayField: 'denominacion',
            valueField: 'idturnotrabajo',
            autoSelect: true,
            autoLoad: true,
            pageSize: 10,
            ancho: '95%',
            url: '/pvd/regimentrabajo/index.php/turnotrabajo/listarTurnoTrabajo',
            disabled: false
        }));
        _this.cmbTurno.getStore().on({
            'load': function (st, records) {
                if (st.getCount() > 0) {
                    if (_this.cmbTurno.getValue()) {
                        _this.cmbTurno.setValue(_this.cmbTurno.getValue());
                    }
                }
            }
        });
        /*this.cmbTurno.on({
            'valuechange':function(v){
                if(v){
                    _this.winGestionarDocumento.manoobraView.getStore().baseParams.idturnotrabajo = v;
                    _this.winGestionarDocumento.manoobraView.getStore().initBaseParams.idturnotrabajo = v;
                    _this.winGestionarDocumento.manoobraView.getStore().reload();
                }
            }
        });*/

        this.formularioGeneral = new LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            items: [clsDatosGenerales,
                new Ext.form.TextArea({
                    fieldLabel: _this.idioma.lbObservaciones,
                    name: 'observaciones',
                    width: '98%',
                    height: '40px',
                    minLength: 2,
                    maxLength: 255,
                    campo: true
                })
            ]
        });

    },
    render:function(){
        var _this = this;
        var rr = LOG.produccion.valeproduccion.View.superclass.render.call(this);
        this.getGridPrincipal().getBottomToolbar().add('->');
        this.getGridPrincipal().getBottomToolbar().add(new Ext.Toolbar.TextItem({
            text: 'Cantidad total:',
            tabular: true
        }));
        this.tfTotal = new Ext.form.TextField({
            width: 200,
        });
        this.getGridPrincipal().getBottomToolbar( ).add(this.tfTotal);
        this.tfTotal.setValue(0);
        this.getStorePrincipal().on({
            'load':function(st,records){
                _this.tfTotal.setValue(parseFloat(Ext.sum(st.collect('cantidad'))));
            }
        });
        return rr;
    },
    /**
     * @param {Integer} tipoVentana
     * @param {Boolean} noCargar
     * @returns {undefined}
     */
    initVentanaGestion: function (d, tipoVentana, noCargar) {
        var _this = this;
        LOG.produccion.valeproduccion.View.superclass.initVentanaGestion.createDelegate(this, [d, tipoVentana]).call();
        _this.habilitarElementosWindow();
        _this.habilitarBotones();
        this.winGestionarDocumento.doLayout();

        /*if (!this.winGestionarDocumento.isInit()) {
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

        this.winGestionarDocumento.prepareDocModify(d || {}, noCargar);
        this.winGestionarDocumento.show();
        this.winGestionarDocumento.maximize();*/
    },
    habilitarElementosWindow: function () {
        if (this.winGestionarDocumento.tipoVentana == 3) {
            Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                _item.setDisabled(true);
            });
            Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                _item.setDisabled(true);
            });
            this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(true);
            this.winGestionarDocumento.doLayout();
            this.winGestionarDocumento.buttons[1].hide();
            this.winGestionarDocumento.buttons[2].hide();
        } else {
            this.winGestionarDocumento.doLayout();
            if (this.winGestionarDocumento.record) {
                if (this.winGestionarDocumento.record.data.estado == 1) {
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                        _item.setDisabled(false);
                    });
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                        _item.setDisabled(false);
                    });
                    this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
                    this.winGestionarDocumento.buttons[2].show();

                } else {
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                        _item.setDisabled(true);
                    });
                    Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                        _item.setDisabled(true);
                    });
                    this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(true);
                    this.winGestionarDocumento.buttons[2].hide();
                    this.winGestionarDocumento.productosobtenidosView.getBtnAdicionar().setDisabled(true);
                    //this.winGestionarDocumento.buttons[1].hide();
                }
                if (this.winGestionarDocumento.record.data.estado > 3) {
                    this.winGestionarDocumento.buttons[2].hide();
                    this.winGestionarDocumento.buttons[1].hide();
                }
                else {
                    this.winGestionarDocumento.buttons[2].show();
                    this.winGestionarDocumento.buttons[1].show();
                }
            } else {
                this.winGestionarDocumento.setTitle(this.idioma.tlVentanaAdicionar);
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('combo'), function (_item) {
                    _item.setDisabled(false);
                });
                Ext.each(this.winGestionarDocumento.panelSuperior.findByType('textfield'), function (_item) {
                    _item.setDisabled(false);
                });
                this.winGestionarDocumento.panelSuperior.findByType('textarea')[0].setDisabled(false);
                this.winGestionarDocumento.productosobtenidosView.getBtnAdicionar().setDisabled(false);
                this.winGestionarDocumento.buttons[1].show();
                this.winGestionarDocumento.buttons[2].show();
            }
        }
    },
    habilitarBotones: function () {
        if (this.winGestionarDocumento.record) {
            this.winGestionarDocumento.doLayout();
            if (this.winGestionarDocumento.record.data.estado == 1) {
                 this.winGestionarDocumento.productosobtenidosView.getBtnAdicionar().setDisabled(false);
                 this.winGestionarDocumento.materialesView.getBtnAdicionar().setDisabled(false);
                 this.winGestionarDocumento.maquinariaView.getBtnAdicionar().setDisabled(false);
                 this.winGestionarDocumento.btnAdicionar.setDisabled(false);
            } else {
                this.winGestionarDocumento.productosobtenidosView.getBtnAdicionar().setDisabled(true);
                this.winGestionarDocumento.materialesView.getBtnAdicionar().setDisabled(true);
                this.winGestionarDocumento.maquinariaView.getBtnAdicionar().setDisabled(true);
                this.winGestionarDocumento.btnAdicionar.setDisabled(true);
            }
        } else {
            this.winGestionarDocumento.productosobtenidosView.getBtnAdicionar().setDisabled(false);
            this.winGestionarDocumento.materialesView.getBtnAdicionar().setDisabled(false);
            this.winGestionarDocumento.maquinariaView.getBtnAdicionar().setDisabled(false);
            this.winGestionarDocumento.btnAdicionar.setDisabled(false);
        }
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? _this.getStorePrincipal().baseParams : {
            iddocumento: record.get("iddocumento") || null
        };
    }
});