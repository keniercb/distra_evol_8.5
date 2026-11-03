Ext.ns('LOG.inv.entrada.recepcion');

LOG.inv.entrada.recepcion.CertificacionGastos = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'panel',
    dirController: '/logistica/inventario/entrada/entrada/index.php/certificaciongastos',
    urlBusquedaGridPrincipal: 'obtener',
    modoSeleccion: 1,
    mode: 1,
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            handler: function () {
                _this.modelo.eliminar({});
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCERTGASTO')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonConfirmar({
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCERTGASTO')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            },
            handler: function () {
                _this.modelo.cargaInicial({
                    url: _this.modelo.urlController + 'confirmar',
                    iddocumento: _this.baseParams.iddocumento
                }, function (datos, resp) {
                    if (resp.codMsg) {
                        mostrarMensaje(resp.codMsg, resp.mensaje);
                    }
                    _this.getStorePrincipal().load({
                        params : {
                            start : 0
                        }
                    });
                }, _this.idioma.msgConfirmandoCert);
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCERTGASTO')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            },
            handler: function () {
                _this.modelo.cargaInicial({
                    url: _this.modelo.urlController + 'aprobar',
                    iddocumento: _this.baseParams.iddocumento
                }, function (datos, resp) {
                    if (resp.codMsg) {
                        mostrarMensaje(resp.codMsg, resp.mensaje);
                    }
                    _this.getStorePrincipal().load({
                        params : {
                            start : 0
                        }
                    });
                }, _this.idioma.msgAprobandoCert);
            }
        }));
    },
    initDefaultColumns: function () {
        this.addGridColumn({dataIndex: 'idcertificaciongasto'});
        this.addGridColumn({dataIndex: 'idcuenta'});
        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({dataIndex: 'cuenta', header: this.idioma.lbCuenta, autoExpand: true});
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            dataIndex: 'importe',
            header: this.idioma.lbImporte,
            width: 80
        }));
        this.addGridColumn({dataIndex: 'cetificador', header: this.idioma.lbCertificado, width: 90});
        this.addGridColumn({dataIndex: 'aprobador', header: this.idioma.lbAprobado, width: 90});
    },
    formularioAdicionar: function () {
        var _this = this;
        var btnGuardar = LOG.util.Prototipos.botonGuardar({
            handler: function () {
                _this.modelo.salvar({
                    iddocumento: _this.baseParams.iddocumento
                }, function () {
                    _this.modelo.reset();
                });
            }
        });
        this.formAdd = LOG.util.UIManager.initForm({
            labelAlign: 'top',
            frame: true,
            region: 'west',
            width: 240,
            buttons: ['->', btnGuardar],
            items: [
                new LOG.util.ComboBox({
                    fieldLabel: LOG.util.Idioma.lbCuenta,
                    anchor: '98%',
                    url: '/logistica/inventario/entrada/entrada/index.php/certificaciongastos/cargarCuentasGasto',
                    hiddenName: 'idcuenta',
                    allowBlank: false,
                    displayField: 'descripcioncta',
                    valueField: 'idcuenta'
                }),
                LOG.util.Prototipos.inputDecimal({
                    name: 'importe',
                    decimalPresition: 2,
                    allowBlank: false,
                    fieldLabel: 'Importe'
                })]
        });
        this.modelo.bindForm(this.formAdd);
        this.modelo.addActionButton(btnGuardar);
        return this.formAdd;
    },
});