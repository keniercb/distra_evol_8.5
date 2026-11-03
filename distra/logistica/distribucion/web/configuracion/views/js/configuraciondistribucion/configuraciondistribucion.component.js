Ext.ns('Ext.erp');

Ext.erp.configuraciondistribucion = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    listaBotonesPanel: undefined,
    configDatas: {},
    constructor: function(config) {
        // de los botones Guardar y botonAyuda
        var _this = this;
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesPanel = new LOG.util.List();
        this.addButtonPanel('->');

        this.addButtonPanel(_this.botonGuardar = LOG.util.Prototipos.botonGuardar({
            text: config.idioma.lbBtnGuardar,
            tooltip: config.idioma.lbTtBtnGuardar,
            handler: function() {
                _this.salvarConfiguracion(config);
            }
        }));

        this.addToolbarButtonPanel('->');

        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({
           id:'confdistribucion'
        }));

        // -------------------- primer tab Distribicion
        this.chPorPedidos = new Ext.form.Checkbox({//checkbox
            boxLabel: config.idioma.lbPorPedidos,
            height: 40,
            name: 'porpedidos',
            hideLabel: true
        });

        this.chCompletarMaxPP = new Ext.form.Checkbox({//checkbox
            boxLabel: config.idioma.lbCompletarMax,
            height: 40,
            name: 'completarmaximoPP',
            style: 'margin:0px 0px 0px 25px',
            hideLabel: true,
            disabled: true
        });

        this.chSinPedidos = new Ext.form.Checkbox({//checkbox
            boxLabel: config.idioma.lbSinPedidos,
            height: 40,
            name: 'sinpedidos',
            hideLabel: true
        });

        this.chCompletarMaxSP = new Ext.form.Checkbox({//checkbox
            boxLabel: config.idioma.lbCompletarMax,
            height: 40,
            name: 'completarmaximoSP',
            style: 'margin:0px 0px 0px 25px',
            hideLabel: true,
            disabled: true
        });

        this.chPolCobertura = new Ext.form.Checkbox({//checkbox
            boxLabel: config.idioma.lbPolCobertura,
            height: 40,
            name: 'politicacovertura',
            style: 'margin:0px 0px 0px 25px',
            hideLabel: true,
            disabled: true
        });

        this.chPorPedidos.on({
            'check': function(_checkbox, checked) {
                if (checked) {
                    _this.chCompletarMaxPP.enable();
                } else {
                    _this.chCompletarMaxPP.disable();
                    _this.chCompletarMaxPP.setValue(false);
                }

            }
        });

        this.chCompletarMaxSP.on({
            'check': function(_checkbox, checked) {
                if (!checked) {
                    _this.chPolCobertura.setValue(true);
                }
            }
        });

        this.chPolCobertura.on({
            'check': function(_checkbox, checked) {
                if (!checked && !_checkbox.disabled) {
                    _this.chCompletarMaxSP.setValue(true);
                }
            }
        });

        this.chSinPedidos.on({
            'check': function(_checkbox, checked, datos) {
                this.setValue(checked);
                if (checked) {
                    _this.chCompletarMaxSP.enable();
                    if (datos && datos.completarmaximo == 0) {
                        _this.chCompletarMaxSP.setValue(false);
                    } else {
                        _this.chCompletarMaxSP.setValue(true);
                    }
                    _this.chPolCobertura.enable();
                    _this.rdPrioridad.enable();
                    _this.rdEquitativa.enable();
                    _this.rdMixta.enable();
                    _this.rdPrioridad.setValue(true);

                } else {
                    _this.chCompletarMaxSP.disable();
                    _this.chCompletarMaxSP.setValue(false);
                    _this.chPolCobertura.disable();
                    _this.chPolCobertura.setValue(false);
                    _this.rdPrioridad.disable();
                    _this.rdEquitativa.disable();
                    _this.rdMixta.disable();
                    _this.rdPrioridad.setValue(false);
                    _this.rdEquitativa.setValue(false);
                    _this.rdMixta.setValue(false);
                }
            }
        });


        this.fsTipoDistribucion = new Ext.form.FieldSet({//fieldset
            title: config.idioma.lbTipoDistribucion,
            style: '-moz-border-radius:5px',
            items: [
                this.chPorPedidos,
                this.chSinPedidos,
                this.chCompletarMaxSP,
                this.chPolCobertura
            ]
        });
        
        this.rdPrioridad = new Ext.form.Radio({  
            boxLabel: config.idioma.lbrbPrioridad,
            name: 'formadistribucion',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('prioridad').setValue(true);
                    } else {
                        Ext.getCmp('prioridad').setValue(false);
                    }
                }
            }
        });
        
        this.rdEquitativa = new Ext.form.Radio({
            boxLabel: config.idioma.lbrbEquitativa,
            name: 'formadistribucion',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('equitativa').setValue(true);
                    } else {
                        Ext.getCmp('equitativa').setValue(false);
                    }
                }
            }
        });
        
        this.rdMixta = new Ext.form.Radio({
            boxLabel: config.idioma.lbrbMixta,
            name: 'formadistribucion',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('mixta').setValue(true);
                    } else {
                        Ext.getCmp('mixta').setValue(false);
                    }
                }
            }
        });
        this.clsFormasDistribucion = LOG.util.UIManager.initColumnForm({//columnForm
            columnas: 1
        });
        
        this.clsFormasDistribucion.width = 150;
        this.clsFormasDistribucion.addComponent(this.rdPrioridad);
        this.clsFormasDistribucion.addComponent(this.rdEquitativa);
        this.clsFormasDistribucion.addComponent(this.rdMixta);

        this.fsFormasDistribucion = new Ext.form.FieldSet({//fieldset
            title: config.idioma.lbFormaDistribucion,
            style: '-moz-border-radius:5px',
            height: 245,
            items: [this.clsFormasDistribucion, {
                    xtype: 'checkbox',
                    hidden: true,
                    id: 'prioridad',
                    name: 'prioridad'
                }, {
                    xtype: 'checkbox',
                    hidden: true,
                    id: 'equitativa',
                    name: 'equitativa'
                }, {
                    xtype: 'checkbox',
                    hidden: true,
                    id: 'mixta',
                    name: 'mixta'
                }]
        });           
        
        this.nfDiasCriticidad = new LOG.util.Prototipos.inputEntero({//numberfield
            name: 'diascriticos',
            fieldLabel: config.idioma.lbDiasParaAvisarCP,
            anchor: '60%',
            maxValue: 30
        });
        this.clsDiasCriticidad = LOG.util.UIManager.initColumnForm({//columnForm
            columnas: 1
        });
        this.clsDiasCriticidad.addComponent(this.nfDiasCriticidad);
        this.clsDiasCriticidad.getColumn(0).columnWidth = 0.16;

        this.fsParametrosGenerales = new Ext.form.FieldSet({//fieldset
            title: config.idioma.lbParametrosGenerales,
            style: '-moz-border-radius:5px',
            labelAlign: 'left',
            labelWidth: 230,
            items: [this.clsDiasCriticidad]
        });
        
         this.clsSuperior = LOG.util.UIManager.initColumnForm({//columnForm
            columnas: 2
        });
        
        this.clsSuperior.addComponent(this.fsTipoDistribucion);
        this.clsSuperior.addComponent(this.fsFormasDistribucion);

        config.panelCentralDistrib = LOG.util.UIManager.initPanel({//panel central Distribucion
            title: config.idioma.lbConfigDistribucion,
            region: 'center',
            labelAlign: 'left',
            layout: 'form',
            //       height: 415,
            autoHeight: true,
            frame: true,
            items: [ this.clsSuperior, this.fsParametrosGenerales]
        });


        //------------------- segundo tab Plan de Consumo

        this.chInsertar = new Ext.form.Checkbox({//checkbox
            boxLabel: config.idioma.lbInsertar,
            height: 40,
            name: 'insertar',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                }
            }
        });

        this.chModificar = new Ext.form.Checkbox({//checkbox
            boxLabel: config.idioma.lbModificar,
            height: 40,
            name: 'modificar',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                }
            }
        });

        this.chImportar = new Ext.form.Checkbox({//checkbox
            boxLabel: config.idioma.lbImportar,
            height: 40,
            name: 'importar',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                }
            }
        });

        this.fsAccionesPlanesExistencia = new Ext.form.FieldSet({//fieldset
            title: config.idioma.lbAccionesPlanesExistencia,
            style: '-moz-border-radius:5px',
            labelAlign: 'left',
            items: [this.chInsertar,
                this.chModificar,
                this.chImportar
            ]
        });

        this.nfOtros = new LOG.util.Prototipos.inputEntero({//numberfield
            name: 'otros',
            allowBlank: false,
            maxValue: 366,
            maxLength: 3,
            minLength: 1,
            disabled: true
        });

        this.rdTreinta = new Ext.form.Radio({
            boxLabel: config.idioma.lbTreinta,
            name: 'duracionplan',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('treinta').setValue(true);
                    } else {
                        Ext.getCmp('treinta').setValue(false);
                    }
                }
            }

        });

        this.rdTresSesentaYCinco = new Ext.form.Radio({
            boxLabel: config.idioma.lbTrecientosSesentaYCinco,
            name: 'duracionplan',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('tresseiscinco').setValue(true);
                    } else {
                        Ext.getCmp('tresseiscinco').setValue(false);
                    }
                }
            }

        });

        this.rdOtros = new Ext.form.Radio({
            boxLabel: config.idioma.lbOtros,
            name: 'duracionplan',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('otraduracion').setValue(true);
                    } else {
                        Ext.getCmp('otraduracion').setValue(false);
                    }
                }
            }
        });


        this.clsRadios = LOG.util.UIManager.initColumnForm({//columnForm
            columnas: 1
        });
        this.clsRadioConNumberfield = LOG.util.UIManager.initColumnForm({//columnForm
            columnas: 2
        });
        this.clsRadioConNumberfield.addComponent(this.rdOtros);
        this.clsRadioConNumberfield.addComponent(this.nfOtros);
        this.clsRadios.width = 350;
        this.clsRadioConNumberfield.getColumn(0).columnWidth = 0.15;
        this.clsRadios.addComponent(this.rdTreinta);
        this.clsRadios.addComponent(this.rdTresSesentaYCinco);
        this.clsRadios.addComponent(this.clsRadioConNumberfield);

        this.fsDuracionPlanes = new Ext.form.FieldSet({//fieldset
            title: config.idioma.lbDuracionPlanes,
            style: '-moz-border-radius:5px',
            labelAlign: 'left',
            items: [this.clsRadios]

        });

        config.panelCentralPlanes = LOG.util.UIManager.initPanel({//panel central Planes de Consumo
            title: config.idioma.lbConfigPlanConsumo,
            region: 'center',
            labelAlign: 'left',
            layout: 'form',
            //   height: 415,
            autoHeight: true,
            frame: true,
            items: [this.fsAccionesPlanesExistencia, this.fsDuracionPlanes, {
                xtype: 'checkbox',
                id: 'treinta',
                hidden: true,
                name: 'treinta'
            }, {
                xtype: 'checkbox',
                id: 'tresseiscinco',
                hidden: true,
                name: 'tresseiscinco'
            }, {
                xtype: 'checkbox',
                hidden: true,
                id: 'otraduracion',
                name: 'otraduracion'
            }]
        });

        this.rdOtros.on({
            'check': function(_radio, checked) {
                if (checked) {
                    _this.nfOtros.enable();
                } else {
                    _this.nfOtros.disable();
                    _this.nfOtros.reset();
                }

            }
        });


        // ----------------------- tercer tab Pedidos
        this.rdConContratos = new Ext.form.Radio({
            boxLabel: config.idioma.lbConContratos,
            name: 'tipopedido',
            value: 0,
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('conContrato').setValue(true);
                    } else {
                        Ext.getCmp('conContrato').setValue(false);
                    }
                }
            }
        });
        this.rdSinContratos = new Ext.form.Radio({
            boxLabel: config.idioma.lbSinContratos,
            name: 'tipopedido',
            value: 1
        });

        this.radioGroup = new Ext.form.RadioGroup({
            name: 'radiogroup',
            columns: 2,
            style: 'margin:0px 0px 0px -80px',
            items: [this.rdConContratos,
                this.rdSinContratos
            ]
        });

        this.clsVigenciaPedido = LOG.util.UIManager.initColumnForm({//columnForm
            columnas: 1
        });

        this.nfVigenciaPedido = new LOG.util.Prototipos.inputEntero({//numberfield
            name: 'vigenciapedido',
            fieldLabel: config.idioma.lbVigenciaPedido,
            labelWidth: 350,
            labelAlign: 'left'
        });
        this.nfVigenciaPedido.maxLength = 3;
        this.nfVigenciaPedido.maxValue = 366;
        this.nfVigenciaPedido.minValue = 7;
        this.nfVigenciaPedido.maxLengthText = config.idioma.msgVigenciaPedido;
        this.nfVigenciaPedido.maxText = config.idioma.msgVigenciaPedido;
        this.nfVigenciaPedido.minText = config.idioma.msgMinVigenciaPedido;

        this.clsVigenciaPedido.addComponent(this.nfVigenciaPedido);
        this.clsVigenciaPedido.getColumn(0).columnWidth = 0.25;

        this.fsTipoPedido = new Ext.form.FieldSet({//fieldset
            title: config.idioma.lbTipoPedido,
            style: '-moz-border-radius:5px',
            labelAlign: 'left',
            items: [this.radioGroup]
        });

        this.fsSeguimientoPedido = new Ext.form.FieldSet({//fieldset
            title: config.idioma.lbSeguimientoPedido,
            style: '-moz-border-radius:5px',
            labelAlign: 'left',
            labelWidth: 165,
            items: [this.clsVigenciaPedido]
        });

        config.panelCentralPedidos = LOG.util.UIManager.initPanel({//panel central Pedidos
            title: config.idioma.lbConfigPedidos,
            region: 'center',
            labelAlign: 'left',
            layout: 'form',
            //  height: 415,
            autoHeight: true,
            frame: true,
            items: [this.fsTipoPedido, this.fsSeguimientoPedido, {
                xtype: 'hidden',
                id: 'conContrato',
                name: 'conContrato'
            }

            ]
        });

        this.panelInfoConsumidor = new Ext.erp.confconsumidor({
            idioma: config.idioma,
            _parent: this
        });

        this.panelCuadroBasico = new Ext.erp.confcuadrobasico({
            idioma: config.idioma,
            _parent: _this
        });

        this.tabPanel = new Ext.TabPanel({
            region: 'center',
            items: [
                config.panelCentralDistrib,
                config.panelCentralPlanes,
                this.panelInfoConsumidor,
                this.panelCuadroBasico
            ],
            autoHeight: true,
            activeTab: 0
        });

        this.fpGeneral = LOG.util.UIManager.initForm({//formulario Distribucion
            region: 'center',
            style: '-moz-border-radius:20px',
            layout: 'fit',
            items: [this.tabPanel]
        });

        config.layout = 'border';
        config.items = [{
            region: 'north',
            tbar: [this.listaBotonesVentanaToolbar.getArray()]
        }, {
            region: 'center',
            frame: true,
            items: [this.fpGeneral]
        }, {
            region: 'south',
            tbar: [this.listaBotonesPanel.getArray()]
        }];

        document.onkeyup = function (e) {
            if (e.altKey) {
                if (e.which == Ext.EventObject.G) {
                    _this.salvarConfiguracion();
                }
            }
        };

        Ext.erp.configuraciondistribucion.superclass.constructor.call(this, config);
        _this.on({
            'show': function() {
                _this.cargarConfiguracionInicial();
            }
        })

    },
    addToolbarButtonPanel: function(b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addButtonPanel: function(b, f) {
        this.listaBotonesPanel.add(LOG.util.UIManager.reconfigureButton(b));
    },
    cargarConfiguracionInicial: function() {
        var _this = this;
        Ext.getBody().mask(_this.idioma.lbCargandoCfg)
        Ext.Ajax.request({
            url: _this.urlController + 'cargarconfigdistribucion',
            method: 'POST',
            callback: function(opt, scs, resp) {
                Ext.getBody().unmask();
                if (scs) {
                    var aux = Ext.decode(resp.responseText);
                    _this.configDatas = {
                        data: aux.datos[0]
                    };
                    if (aux.datos[0]) {
                        //tratamiento de datos
                        if (aux.datos[0].tipodistribucion == 0) {
                            _this.chPorPedidos.setValue(false);
                            //_this.chSinPedidos.setValue(false);
                            _this.chSinPedidos.fireEvent('check',_this.chSinPedidos, false);
                        } else if (aux.datos[0].tipodistribucion == 1) {
                            _this.chPorPedidos.setValue(true);
                           // _this.chSinPedidos.setValue(false);
                            _this.chSinPedidos.fireEvent('check',_this.chSinPedidos, false);
                        } else if (aux.datos[0].tipodistribucion == 2) {
                            _this.chPorPedidos.setValue(false);
                            _this.chSinPedidos.fireEvent('check',_this.chSinPedidos, true, aux.datos[0]);

                        } else {
                            //_this.chPorPedidos.setValue(true);
                            _this.chPorPedidos.setValue(false);
                            //_this.chSinPedidos.fireEvent('check',_this.chSinPedidos, true);
                            _this.chSinPedidos.fireEvent('check',_this.chSinPedidos, false);
                        }
                        
                         if (aux.datos[0].formadistribucion == 0) {
                            _this.rdPrioridad.setValue(false);
                            _this.rdEquitativa.setValue(false);
                            _this.rdMixta.setValue(false);
                        } else if (aux.datos[0].formadistribucion == 1) {
                            _this.rdPrioridad.setValue(true);
                            Ext.getCmp('prioridad').setValue(true);  
                        } else if (aux.datos[0].formadistribucion == 2) {
                            _this.rdEquitativa.setValue(true);
                            Ext.getCmp('equitativa').setValue(true); 
                        } else {
                            //_this.rdMixta.setValue(true);
                            _this.rdMixta.setValue(false);
                            //Ext.getCmp('mixta').setValue(true);
                            Ext.getCmp('mixta').setValue(false);
                        }

                        if (aux.datos[0].insertar == 0) {
                            _this.chInsertar.setValue(false);
                        } else {
                            _this.chInsertar.setValue(true);
                        }

                        if (aux.datos[0].insertar == 0) {
                            _this.chModificar.setValue(false);
                        } else {
                            _this.chModificar.setValue(true);
                        }
                        if (aux.datos[0].insertar == 0) {
                            _this.chImportar.setValue(false);
                        } else {
                            _this.chImportar.setValue(true);
                        }

                        if (aux.datos[0].duracionplan == 30) {
                            _this.rdTreinta.setValue(true);
                            Ext.getCmp('treinta').setValue(true);
                        } else if (aux.datos[0].duracionplan == 365) {
                            _this.rdTresSesentaYCinco.setValue(true);
                            Ext.getCmp('tresseiscinco').setValue(true);
                        } else {
                            _this.rdOtros.setValue(true);
                            Ext.getCmp('otraduracion').setValue(true);
                        }

                        if (aux.datos[0].tipopedido == 1) {
                            _this.rdConContratos.setValue(true);
                            Ext.getCmp('conContrato').setValue(true);
                        } else {
                            _this.rdSinContratos.setValue(true);
                            Ext.getCmp('conContrato').setValue(false);
                        }
                        _this.fpGeneral.getForm().loadRecord(_this.configDatas);
                    }
                }
            }
        });
    },
    salvarConfiguracion: function() {
        var _this = this;
        var fp = _this.fpGeneral.getForm();
        if (!fp.isValid()) {
            mostrarMensaje(3, _this.idioma.lbMsgCamposVacios);
            return;
        }
        if(_this.nfVigenciaPedido.value == null) {
            _this.nfVigenciaPedido.value=_this.nfVigenciaPedido.minValue;
        }
        var values = fp.getValues();
        if ((values.duracionplan == "on") && (values.otros == "")) {
            _this.nfOtros.markInvalid();
            mostrarMensaje(3, _this.idioma.lbMsgCamposVacios);
            return;
        }

        Ext.getBody().mask(_this.idioma.lbMsgSalvandoCfg);
        fp.submit({
            url: _this.urlController + 'salvarconfiguracion',
            method: 'POST',
            success: function() {
                Ext.getBody().unmask();
                mostrarMensaje(1, _this.idioma.lbMsgSalvarOk);
                _this.cargarConfiguracionInicial();

            },
            failure: function() {
                Ext.getBody().unmask();
            }
        });
    }
});
