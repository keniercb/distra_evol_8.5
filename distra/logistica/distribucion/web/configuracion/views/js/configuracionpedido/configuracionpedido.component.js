Ext.ns('Ext.erp');
Ext.erp.configuracionpedido = Ext.extend(LOG.util.Panel, {
    listaBotonesPanel: undefined,
    constructor: function(config) {
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

        this.panelCentralPedidos = LOG.util.UIManager.initPanel({//panel central Pedidos
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
            }, {
                xtype: 'hidden',
                name: 'pedido',
                value: true
            }

            ]
        });
        this.fpGeneral = LOG.util.UIManager.initForm({//formulario Distribucion
            region: 'center',
            style: '-moz-border-radius:20px',
            layout: 'fit',
            items: [this.panelCentralPedidos]
        });


        config.layout = 'border';

        config.items = [{
            region: 'center',
            frame: true,
            items: [this.fpGeneral]
        }, {
            region: 'south',
            tbar: [this.listaBotonesPanel.getArray()]
        }];
        config.tbar = ['->', LOG.util.Prototipos.botonAyuda({
                id: 'configuracionpedido'
            })];

        document.onkeyup = function (e) {
            if (e.altKey) {
                if (e.which == Ext.EventObject.G) {
                    _this.salvarConfiguracion();
                }
            }
        };

        Ext.erp.configuracionpedido.superclass.constructor.call(this, config);
        _this.on({
            'show': function() {
                _this.cargarConfiguracionInicial();
            }
        })

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
