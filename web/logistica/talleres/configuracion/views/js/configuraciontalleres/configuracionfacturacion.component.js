Ext.ns('Ext.erp');
Ext.erp.configuracionfacturacion = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    listaBotonesPanel: undefined,
    listaAcciones:undefined,
    constructor: function (config) {
        var _this = this;
        this.listaAcciones = new LOG.util.List(UCID.portal.getAccionesReportes());
        //Ext.MessageBox.wait(config.idioma.msgCargandoDatosIniciales, config.idioma.msjLoadMask);
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesPanel = new LOG.util.List();
        this.addButtonPanel('->');
        this.urlController = '/logistica/talleres/configuracion/index.php/configuracionfacturacion/';
        this.btnGuardar = LOG.util.Prototipos.botonGuardar({
            text: config.idioma.lbBtnGuardar,
            tooltip: config.idioma.ttlBtnGuardar,
            //disabled: true,
            key: {
                alt: true,
                key: 'G'
            },
            handler: function () {
                _this.salvarConfiguracion();
            }
        });
        this.addButtonPanel(this.btnGuardar);
        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                key: 'G',
                fn: function () {
                    if (_this.isVisible()) {
                        _this.salvarConfiguracion();
                    }
                }
            }]);
        this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({
            id: 'ayudaconfiguracionfacturacion'
        }));
        this.chxFacturarParcial = new Ext.form.Checkbox({
            name: 'facturarparcial',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: 'Facturar parcialmente orden de trabajo',
            listeners: {
                check: function(e, a) {
                    if (a == true) {
                        _this.chxFacturarParcial.inputValue = 1;
                    } else {
                        _this.chxFacturarParcial.inputValue = 0;
                    }
                }
            }
        });
        this.chxFacturarCerrar = new Ext.form.Checkbox({
            name: 'facturarcerrar',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: 'Generar factura al cerrar orden de trabajo',
            listeners: {
                check: function(e, a) {
                    if (a == true) {
                        _this.chxFacturarCerrar.inputValue = 1;
                        _this.comboOperacion.enable();
                    } else {
                        _this.chxFacturarCerrar.inputValue = 0;
                        _this.comboOperacion.setValue();
                        _this.comboOperacion.disable();
                    }
                }
            }
        });
        this.comboOperacion = new LOG.util.ComboBox({
            fieldLabel: 'Operaci\xf3n',
            url: _this.urlController + 'cargarOperaciones',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            mode: 'remote',
            //allowBlank: false,
            minChars:1,
            pageSize : 15,
            resizable:true
        });
        this.comboOperacionMay = new LOG.util.ComboBox({
            fieldLabel: 'Operaci\xf3n mayorista',
            url: _this.urlController + 'cargarOperacionesMay',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            mode: 'remote',
            //allowBlank: false,
            minChars:1,
            pageSize : 15,
            resizable:true
        });
        this.fscomboOperacion = new Ext.form.FieldSet({
            name: 'name',
            items: [this.chxFacturarParcial,this.chxFacturarCerrar, {
                layout: 'form',
                labelAlign: 'top',
                padding: '0.5% 0 0 1%',
                items: this.comboOperacion
            },{
                layout: 'form',
                labelAlign: 'top',
                padding: '0.5% 0 0 1%',
                items: this.comboOperacionMay
            }]
        });

        config.panelConfiguracion = LOG.util.UIManager.initPanel({
            region: 'center',
            labelAlign: 'left',
            layout: 'form',
            items: [this.fscomboOperacion]
        });

        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()]
            },
            {
                region: 'center',
                frame: true,
                items: [config.panelConfiguracion]
            },
            {
                region: 'south',
                tbar: [this.listaBotonesPanel.getArray()]
            }
        ];
        Ext.erp.configuracionfacturacion.superclass.constructor.call(this, config);
        _this.on({
            'show': function () {
                _this.cargarConfiguracionInicial();
            }
        })
    },

    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addButtonPanel: function (b, f) {
        this.listaBotonesPanel.add(LOG.util.UIManager.reconfigureButton(b));
    },

    cargarConfiguracionInicial: function () {
        var _this = this;
        Ext.getBody().mask('Cargando configuraci\xf3n');
        Ext.Ajax.request({
            url: _this.urlController+'cargarConfFacturacion',
            method: 'POST',
            callback: function (opt, scs, resp) {
                Ext.getBody().unmask();
                if (scs) {
                    aux = Ext.decode(resp.responseText);
					_this.chxFacturarParcial.setValue(false)
					_this.chxFacturarCerrar.setValue(false)
                    if (aux.datos.facturarparcial == 1) {
                        _this.chxFacturarParcial.setValue(true)
                    }
                    if (aux.datos.facturarcerrar == 1) {
                        _this.chxFacturarCerrar.setValue(true)
                    }
                    _this.comboOperacion.getStore().load({
                        callback: function () {
                            if (aux.datos.idoperacion) {
                                _this.comboOperacion.setValue(aux.datos.idoperacion);
                            }
                        }
                    }) 
                    _this.comboOperacionMay.getStore().load({
                        callback: function () {
                            if (aux.datos.idoperacionmayorista) {
                                _this.comboOperacionMay.setValue(aux.datos.idoperacionmayorista);
                            }
                        }
                    })
                }
            }
        });
    },
    salvarConfiguracion: function (parametros) {
        var _this = this;
        Ext.MessageBox.wait('Guardando configuraci\xf3n', 'Espere' || '...');
        var params = {
            facturarparcial: _this.chxFacturarParcial.getValue() ? 1 : 0,
            facturarcerrar: _this.chxFacturarCerrar.getValue() ? 1 : 0,
            idoperacion: _this.comboOperacion.getValue(),
            idoperacionmayorista : _this.comboOperacionMay.getValue()
        };
        Ext.Ajax.request({
            url: _this.urlController+'guardarConfFacturacion',
            method: 'POST',
            params: params,
            callback: function(o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    Ext.MessageBox.hide();
                    mostrarMensaje(1, 'La configuraci\xf3n ha sido guardada satisfactoriamente');
                }
            }
        });
    },
    grantedAction: function(idAccion) {
        var existe = false;
        this.listaAcciones.each(function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    }
});
