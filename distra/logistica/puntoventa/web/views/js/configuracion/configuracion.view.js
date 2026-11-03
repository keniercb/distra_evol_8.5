Ext.ns('LOG.fac.configuracionpuntoventa');
/*
 * 
 * <Tab para adicionar las areas>
 * 
 */
LOG.fac.configuracionpuntoventa.Configuracion = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.gridEditable = true;
        this.urlBusquedaGridPrincipal = 'cargarPuntoVenta';
        this.concepto = config.idioma.ttBtnBuscarArea;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacionArea;
        LOG.fac.configuracionpuntoventa.Configuracion.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: this.dirController + '/'
        });
    },
    initDefaultColumns: function () {
        var clientes = Array();
        var _this = this;
        let storeCIOb = new Ext.data.SimpleStore({
            fields: ['activo', 'texto'],
            data: [[-1, 'Si'], [1, 'No']]
        });
        let cmbCIOb = new Ext.form.ComboBox({
            store: storeCIOb,
            displayField: 'texto',
            valueField: 'activo',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'activo'
        });

        this.addGridColumn({
            dataIndex: 'idcliente',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idcondicionpago',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idtipoprecio',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idtipoprecioagencia',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idmoneda',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idmodopago',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idnomoperaciones',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idnomoperaciondev',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbCodigoDenom,
            width: 250,
            dataIndex: 'coddenominacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.tfTiendaVirtual,
            width: 85,
            dataIndex: 'tiendavirtual',
            default: true,
            renderer: function (value, metaData) {
                metaData.css = (value == 1) ? 'icondistra-usarentidad verde' : '';
                metaData.attr = (value == 1) ? 'ext:qtip="Si"' : '';
                ;
            }
        });

        this.addGridColumn({
            header: 'Cajas registradoras',
            width: 150,
            dataIndex: 'contienecr',
            default: true,
            align: 'right',
        });

        this.addGridColumn({
            header: 'Conexi\xf3n CR',
            width: 85,
            dataIndex: 'idinfoconexioncr',
            default: true,
            renderer: function (value, metaData) {
                metaData.css = (value != '' && value != null) ? 'icondistra-usarentidad verde' : '';
                metaData.attr = (value != '' && value != null) ? 'ext:qtip="Si"' : '';
                ;
            }
        });

        this.addGridColumn({
            header: 'Modo cat\xe1logo',
            width: 85,
            dataIndex: 'modocatalogo',
            default: true,
            renderer: function (value, metaData) {
                metaData.css = (value == 1) ? 'icondistra-aceptar verde' : 'icondistra-aceptar rojo';
                metaData.attr = (value == 1) ? 'ext:qtip="Si"' : 'ext:qtip="No"';
            }
        });

        this.addGridColumn({
            header: this.idioma.tfCliente,
            width: 250,
            dataIndex: 'nombre',
            default: true,
            editor: _this.comboEditorCliente(),
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value) {
                    if (this.editor.isDirty()) {
                        if (value == this.editor.getValue()) {
                            record.set('idcliente', this.editor.getValue());
                            value = this.editor.getRawValue();
                        }
                    }
                    return value;
                }
                return '';
            }
        });

        this.addGridColumn({
            header: 'Condici\xf3n de pago',
            width: 150,
            dataIndex: 'denominacionpago',
            default: true,
            editor: _this.comboEditorCondicionPago(),
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value) {
                    if (this.editor.isDirty()) {
                        if (value == this.editor.getValue()) {
                            record.set('idcondicionpago', this.editor.getValue());
                            value = this.editor.getRawValue();
                            record.set('denominacionpago', value);
                        }
                    }
                    return value;
                }
                return '';
            }
        });

        this.addGridColumn({
            header: this.idioma.tfTipoprecio,
            dataIndex: 'denominacionPrecio',
            width: 120,
            default: true,
            editor: _this.comboEditorTipoPrecio(),
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value) {
                    if (this.editor.isDirty()) {
                        if (value == this.editor.getValue()) {
                            record.set('idtipoprecio', this.editor.getValue());
                            value = this.editor.getRawValue();
                        }
                    }
                    return value;
                }
                return '';
            }
        });
        this.addGridColumn({
            header: this.idioma.tfTipoprecio + ' factura',
            dataIndex: 'denominacionPrecioA',
            width: 120,
            default: true,
            editor: _this.comboEditorTipoPrecioAg(),
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value) {
                    if (this.editor.isDirty()) {
                        if (value == this.editor.getValue()) {
                            record.set('idtipoprecioagencia', this.editor.getValue());
                            value = this.editor.getRawValue();
                        }
                    }
                    return value;
                }
                return '';
            }
        });
        this.addGridColumn({
            header: this.idioma.tfMoneda,
            dataIndex: 'codigoiso',
            width: 100,
            align: 'center',
            default: true,
            editor: _this.comboEditorMoneda(),
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                var monedas = this.editor.getStore().data.items;
                if (value) {
                    if (this.editor.isDirty()) {
                        for (var i = 0; i < monedas.length; i++) {
                            if (monedas[i].data.idmoneda == this.editor.getValue()) {
                                record.set('idmoneda', this.editor.getValue());
                                return monedas[i].data.codigoiso;
                            }
                        }
                    }
                }
                for (var i = 0; i < monedas.length; i++) {
                    if (monedas[i].data.idmoneda == record.data.idmoneda) {
                        return monedas[i].data.codigoiso;
                    }
                }
                /*if(value){
                    if(this.editor.isDirty()){
                        if(value == this.editor.getValue()) {
                            record.set('idmoneda',this.editor.getValue());
                            value = this.editor.getRawValue();
                        }
                    }
                    return value;
                }*/
                return '';
            }
        });
        this.addGridColumn({
            header: this.idioma.tfPagopordefecto,
            dataIndex: 'modopago',
            width: 110,
            default: true,
            editor: _this.comboEditorMetodoPago(),
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value) {
                    if (this.editor.isDirty()) {
                        if (value == this.editor.getValue()) {
                            record.set('idmodopago', this.editor.getValue());
                            value = this.editor.getRawValue();
                        }
                    }
                    return value;
                }
                return '';
            }
        });
        this.addGridColumn({
            header: this.idioma.tfOperacioncontable,
            dataIndex: 'nombreoperacion',
            width: 120,
            default: true,
            editor: _this.comboEditorOperacion(),
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value) {
                    if (this.editor.isDirty()) {
                        if (value == this.editor.getValue()) {
                            record.set('idnomoperaciones', this.editor.getValue());
                            value = this.editor.getRawValue();
                        }
                    }
                    return value;
                }
                return '';
            }
        });
        this.addGridColumn({
            header: this.idioma.tfOperacioncontabledev,
            dataIndex: 'nombreoperaciondev',
            width: 170,
            default: true,
            editor: _this.comboEditorOperacion(),
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value) {
                    if (this.editor.isDirty()) {
                        if (value == this.editor.getValue()) {
                            record.set('idnomoperaciondev', this.editor.getValue());
                            value = this.editor.getRawValue();
                        }
                    }
                    return value;
                }
                return '';
            }
        });
        this.addGridColumn({
            header: this.idioma.tfUserId,
            width: 100,
            dataIndex: 'usuarioez',
            default: true,
            hidden: (typeof TV_EXIST === 'undefined' || TV_EXIST == false) ? true : false,
            align: 'center',
            editor: LOG.util.Prototipos.inputTexto({})
        });
        this.addGridColumn({
            header: this.idioma.tfComision,
            width: 100,
            dataIndex: 'comisionbanco',
            default: true,
            hidden: (typeof TV_EXIST === 'undefined' || TV_EXIST == false) ? true : false,
            align: 'center',
            editor: LOG.util.Prototipos.inputDecimal({})
        });
        this.addGridColumn({
            header: this.idioma.tfDiasHabiles,
            width: 100,
            dataIndex: 'diashabiles',
            default: true,
            align: 'center',
            editor: LOG.util.Prototipos.inputEntero({})
        });
        this.addGridColumn({
            header: 'CI. Obligatorio',
            width: 100,
            dataIndex: 'texto',
            default: true,
            align: 'center',
            editor: cmbCIOb,
            renderer: function (v, m, rd) {
                if (v) {
                    if (this.editor.isDirty()) {
                        rd.set('noobligatorio', this.editor.getValue());
                        if (v == 1)
                            m.css = 'icondistra-aceptar rojo';
                        else
                            m.css = 'icondistra-aceptar verde';
                        //return (v == 1) ? 'Si' : 'No';
                    }
                }
                if (rd.data.noobligatorio == 1)
                    m.css = 'icondistra-aceptar rojo';
                else
                    m.css = 'icondistra-aceptar verde';
            }
        });
        this.addGridColumn({
            header: this.idioma.cgActiva,
            width: 70,
            dataIndex: 'activo',
            default: true,
            align: 'center',
            renderer: function (value, metaData) {
                metaData.css = (value == 1) ? 'icondistra-aceptar verde' : 'icondistra-aceptar rojo';
                metaData.attr = (value == 1) ? 'ext:qtip="Si"' : 'ext:qtip=" NO"';
            }
        });
        this.addGridColumn({
            dataIndex: 'idareaventa',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idinfoconexion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'tipo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'url',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'clave',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'nombretienda',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'telefono',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'correo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'direccion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'tipoventa',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'noobligatorio',
            hidden: true
        });
    },
    comboEditorCliente: function () {
        var editorCliente = new LOG.util.ComboBox({
            //editable: false,
            name: 'idcliente',
            url: 'cargarClientes',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            enableQtip: true,
            pageSize: 20,
            minChars: 0,
            mode: 'remote'
        });
        return editorCliente;
    },

    comboEditorCondicionPago: function () {
        var _this = this;
        var editorCondicionPago = new LOG.util.ComboBox({
            //editable: false,
            name: 'condicionpago',
            url: 'cargarCondicionPago',
            hiddenName: 'idcondicionpago',
            valueField: 'idcondicionpago',
            displayField: 'denominacion',
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            enableQtip: true, /*
            listeners:{
                'change': function(cmb,newValue,oldValue){
                    console.info(cmb.getRawValue());
                }
            },*/
            autoLoad: false,
            minChars: 0
            //mode: 'remote'
        });
        return editorCondicionPago;
    },
    comboEditorTipoPrecio: function () {
        var editorTipoPrecio = new LOG.util.ComboBox({
            //editable: false,
            name: 'idtipoprecio',
            url: 'cargarTipoPrecio',
            hiddenName: 'idtipoprecio',
            valueField: 'idtipoprecio',
            displayField: 'denominacionPrecio',
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            enableQtip: true
        });
        return editorTipoPrecio;
    },
    comboEditorTipoPrecioAg: function () {
        var editorTipoPrecio = new LOG.util.ComboBox({
            //editable: false,
            name: 'idtipoprecio',
            url: 'cargarTipoPrecio',
            hiddenName: 'idtipoprecioagencia',
            valueField: 'idtipoprecio',
            displayField: 'denominacionPrecio',
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            enableQtip: true
        });
        return editorTipoPrecio;
    },
    comboEditorMoneda: function () {
        var editorMoneda = new LOG.util.ComboBox({
            //editable: false,
            name: 'idmoneda',
            url: 'cargarMonedas',
            hiddenName: 'idmoneda',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            enableQtip: true/*,
            pageSize: 20,
            minChars: 0,
            mode: 'remote'*/
        });
        return editorMoneda;
    },
    comboEditorMetodoPago: function () {
        var editorMetodoPago = new LOG.util.ComboBox({
            //editable: false,
            name: 'idmodopago',
            url: 'cargarModoPago',
            hiddenName: 'idmodopago',
            valueField: 'idmodopago',
            displayField: 'modopago',
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            enableQtip: true
        });
        return editorMetodoPago;
    },
    comboEditorOperacion: function () {
        var editorOperacion = new LOG.util.ComboBox({
            //editable: false,
            name: 'idnomoperaciones',
            url: 'cargarOperacion',
            hiddenName: 'idnomoperaciones',
            valueField: 'idnomoperaciones',
            displayField: 'nombreoperacion',
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            enableQtip: true
        });
        return editorOperacion;
    },
    initDefaultButtons: function () {
        var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            idioma: this.idioma,
            tooltip: this.idioma.ttBtnAdicionar,
            handler: function () {
                var winAdicionarArea = new LOG.fac.configuracionpuntoventa.winAdicionarArea({
                    idioma: me.idioma,
                    _parent: me
                });
                winAdicionarArea.init();
                winAdicionarArea.view();
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.tfDatoscontacto,
            disabled: true,
            iconCls: 'modificar',
            tooltip: this.idioma.ttBtnDatosContacto,
            handler: function () {
                var winAdicionarInfoContacto = new LOG.fac.configuracionpuntoventa.winDatosContacto({
                    idioma: me.idioma,
                    title: me.idioma.tlVentanaInfoContacto,
                    //iddeposito: this.idDeposito,
                    _parent: me
                });
                winAdicionarInfoContacto.show();

            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 /*&& this.getSelected().data.activo == 1*/) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 0) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'DATOSCONTACTO');
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            idioma: this.idioma,
            tooltip: this.idioma.ttBtnEliminar,
            disabled: true,
            handler: function () {
                var params = {
                    datos: me.getDatos(),
                    areaVenta: true
                };
                me.modelo.eliminar(params, function () {
                    me.getStorePrincipal().load({
                        limit: me.getGridPrincipal().getBottomToolbar().cbPageSize.getValue(),
                        start: 0
                    });
                }, function () {
                    mostrarMensaje(1, this.idioma.msgFailDeleteArea);
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 0) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'ELIMINARAREAPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnHabilitar,
            disabled: true,
            iconCls: 'habilitar',
            tooltip: this.idioma.ttBtnHabilitar,
            handler: function () {
                var params = {
                    datos: me.getDatos(),
                    activo: 1,
                    class: 'DatAreaventa',
                    areaVenta: true
                };
                me.modelo.activacion(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 0) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'HABILITARBTNPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnDeshabilitar,
            disabled: true,
            iconCls: 'deshabilitar',
            tooltip: this.idioma.ttBtnDeshabilitar,
            handler: function () {
                var params = {
                    datos: me.getDatos(),
                    activo: 0,
                    class: 'DatAreaventa',
                    areaVenta: true
                };

                me.modelo.activacionarea(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 1) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 0) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'DESHABILITARBTNPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Modo catalogo',
            disabled: true,
            iconCls: 'activar',
            tooltip: 'Activar o desactivar modo catalogo de la tienda virtual',
            handler: function () {
                var params = {
                    datos: me.getDatos(),
                    modocatalogo: 1,
                    seleccion: me.getSmPrincipal().getSelected(),
                    class: 'DatAreaventa',
                    areaVenta: true
                };
                me.modelo.activacionModoCatalogo(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.tiendavirtual == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'HABILITARBTNMC');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Sincronizar cajeros',
            disabled: true,
            iconCls: 'sincronizar',
            tooltip: 'Enviar cajeros a las cajas registradoras asociadas al \xe1rea',
            handler: function () {
                var params = {
                    datos: me.getDatos(),
                    enviocajero: 1
                };
                me.modelo.enviarCajerosCaja(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().json.contienecr > 0 && this.getSelected().json.idinfoconexioncr > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'ENVIACAJERO');
            }
        }));
        /*this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.tfConfGeneral,
            disabled: true,
            iconCls: 'configuraciongeneral',
            tooltip: this.idioma.ttBtnConfGeneral,
            handler: function () {
                var winConfGeneral = new LOG.fac.configuracionpuntoventa.winConfGeneral({
                    idioma: me.idioma,
                    title: me.idioma.tlVentanaConfGeneral,
                    //iddeposito: this.idDeposito,
                    _parent: me
                });
                winConfGeneral.show();

            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 0) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'APLICARCONF');
            }
        }));*/
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.tfAplicar,
            disabled: true,
            iconCls: 'aplicar',
            tooltip: this.idioma.ttBtnAplicarConf,
            handler: function () {
                var params = {
                    idareaventa: me.getSmPrincipal().getSelected().data.idareaventa
                };
                me.modelo.aplicarConfiguracion(params, function (r) {
                    me.getStorePrincipal().reload();
                });

            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 /*&& this.getSelected().data.activo == 1*/) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 0) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'APLICARCONF');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Replicar',
            disabled: true,
            iconCls: 'aplicar',
            tooltip: 'Replica la configuraci\xf3n de conexi\xf3n con API CR para las \xe1reas sin configurar',
            handler: function () {
                var params = {
                    idareaventa: me.getSmPrincipal().getSelected().data.idareaventa,
                    apicr: 1
                };
                me.modelo.aplicarConfiguracion(params, function (r) {
                    me.getStorePrincipal().reload();
                });

            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().json.contienecr > 0 && this.getSelected().json.idinfoconexioncr > 0) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 0) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'APLICARCONF');
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.tfTiendaCaja,
            disabled: true,
            iconCls: 'configuracionacceso',
            tooltip: this.idioma.ttBtnTiendaCaja,
            handler: function () {
                let winAdicionarInfoConexionCR = new LOG.fac.configuracionpuntoventa.winInfoConexionCR({
                    idioma: me.idioma,
                    title: me.idioma.tlVentanaInfoConex,
                    //iddeposito: this.idDeposito,
                    selected: me.getSmPrincipal().getSelected(),
                    _parent: me
                });
                winAdicionarInfoConexionCR.show();
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 1 && this.getSelected().json.contienecr > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'CAJAREGISTRADORA');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.tfTiendaVirtual,
            disabled: true,
            iconCls: 'configuracionacceso',
            tooltip: this.idioma.ttBtnTiendaVirtual,
            handler: function () {
                var winAdicionarInfoConexion = new LOG.fac.configuracionpuntoventa.winInfoConexion({
                    idioma: me.idioma,
                    title: me.idioma.tlVentanaInfoConex,
                    //iddeposito: this.idDeposito,
                    selected: me.getSmPrincipal().getSelected(),
                    _parent: me
                });
                winAdicionarInfoConexion.show();

            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 1 && this.getSelected().json.contienecr == 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'TIENDAVIRTUAL');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.tfElimConex,
            disabled: true,
            iconCls: 'configuracionacceso rojo',
            tooltip: this.idioma.ttBtnElimConex,
            handler: function () {
                params = {
                    eliminar: true,
                    idinfoconexion: me.getSmPrincipal().getSelected().data.idinfoconexion
                }
                mostrarMensaje(2, me.idioma.msgElimConex, function (btn) {
                    if (btn == 'ok') {
                        me.modelo.eliminarInfoConexion(params, function () {
                            me.getStorePrincipal().reload();
                        });
                    }
                });

            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 1 && this.getSelected().data.idinfoconexion != "") {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'ELIMINARCONEX');
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'idconfarea',
            text: this.idioma.lbBtnAyuda
        }));
    },
    getDatos: function () {
        var selections = this.getSmPrincipal().getSelections(), idareaventa = [];
        for (var i = 0; i < selections.length; i++) {
            idareaventa.push(selections[i].data.idareaventa);
        }
        return Ext.encode(idareaventa);
    },
    render: function () {
        var me = this;
        var p = LOG.fac.configuracionpuntoventa.Configuracion.superclass.render.call(this);
        LOG.util.UIManager.encadenaFn(this.getGridPrincipal(), 'fireEvent', function (e, o) {
            if (e == 'beforeedit') {
                if (o.record.data.activo == 1 && o.field == 'diashabiles') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'nombre') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'idtipoprecio') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'idtipoprecioagencia') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'idmoneda') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'idmodopago') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'idnomoperaciones') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'idnomoperaciondev') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'usuarioez') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'comisionbanco') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'texto') {
                    o.cancel = true;
                }
                if (o.record.data.activo == 1 && o.field == 'denominacionpago') {
                    o.cancel = true;
                } else if (o.record.data.activo != 1 && o.field == 'denominacionpago') {
                    me.gpPrincipal.getColumnModel().getCellEditor(o.column, o.row).field.getStore().initBaseParams.idcliente = o.record.data.idcliente;
                    me.gpPrincipal.getColumnModel().getCellEditor(o.column, o.row).field.getStore().baseParams.idcliente = o.record.data.idcliente;
                    me.gpPrincipal.getColumnModel().getCellEditor(o.column, o.row).field.getStore().load();
                }
            } else if (e == 'afteredit') {
                var params = {
                    idareaventa: o.record.data.idareaventa,
                    idcliente: o.record.data.idcliente,
                    idtipoprecio: o.record.data.idtipoprecio,
                    idtipoprecioagencia: o.record.data.idtipoprecioagencia,
                    idmoneda: o.record.data.idmoneda,
                    idmodopago: o.record.data.idmodopago,
                    idnomoperaciones: o.record.data.idnomoperaciones,
                    idnomoperaciondev: o.record.data.idnomoperaciondev,
                    usuarioez: o.record.data.usuarioez,
                    comisionbanco: o.record.data.comisionbanco,
                    diashabiles: o.record.data.diashabiles,
                    idcondicionpago: o.record.data.idcondicionpago,
                    denominacionpago: o.record.data.denominacionpago,
                    noobligatorio: o.record.data.noobligatorio
                };

                //if(o.record.data.idcliente!='' && o.record.data.diashabiles!=''){
                Ext.MessageBox.wait(me.idioma.msgEnviandoDatos, me.idioma.msgEspere || '...');
                me.modelo.diasHabiles(params, function () {
                    Ext.MessageBox.hide();
                    mostrarMensaje(1, me.idioma.msgDatosCorrectos);
                    me.getStorePrincipal().reload();
                });
                //}

            }
        }, 'DIASHABILES');
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e, o) {
            if (e === 'load' && this.data.items.length === 0) {
                mostrarMensaje(1, me.idioma.msgNoMostrarResultados);
            }
        }, 'AREASVENTA');
        me.getSmPrincipal().moveEditorOnEnter = false;
        return p;
    }
});

/*
* Tab para gestionar operarios de caja registradora
* */

LOG.fac.configuracionpuntoventa.GestionarCajero = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var me = this;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa';
        this.busquedaBasica = true;
        this.concepto = config.idioma.ttBtnBuscarCaja;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacionCaja;
        LOG.fac.configuracionpuntoventa.GestionarCajero.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: this.dirController + '/'
        });
        this._parent.on('tabchange', function (tb, p) {
            if (p.idComponent == '3') {
                me.getStorePrincipal().load();
            }
        });
    },
    initDefaultColumns: function () {
        _this = this;
        this.addGridColumn({
            dataIndex: 'idcajero',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.tfDenominacion,
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.tfTipo,
            width: 200,
            dataIndex: 'tipo',
            default: true,
            renderer: function (v) {
                return (v == 1) ? _this.idioma.lbCajero : _this.idioma.lbCajeroSup;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgActiva,
            width: 50,
            dataIndex: 'activo',
            default: true,
            renderer: function (value, metaData) {
                metaData.css = (value == 1) ? 'log-activo' : 'log-inactivo';
            }
        });
    },
    initDefaultButtons: function () {
        var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            disabled: false,
            tooltip: this.idioma.ttBtnAdicionarCaja,
            handler: function () {
                me.buildWinAddCajero('add');
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonModificar({
            disabled: true,
            tooltip: this.idioma.ttBtnModificarCaja,
            handler: function () {
                me.buildWinAddCajero('mod');
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() === 1 && this.getSelected().data.activo == 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'CT');
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: this.idioma.ttBtnEliminarCaja,
            handler: function () {
                me.modelo.eliminar({
                    datos: me.getDatos(),
                    areaCajero: true
                }, function () {
                    me.getStorePrincipal().load({
                        start: 0,
                        limit: me.getGridPrincipal().getBottomToolbar().cbPageSize.getValue()
                    });
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 0) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'ELIMINARCAJAPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnHabilitar,
            disabled: true,
            iconCls: 'habilitar',
            tooltip: this.idioma.ttBtnHabilitarCaja,
            handler: function () {
                var parametros = {

                    datos: me.getDatos(),
                    activo: 1,
                    activarcajero: 1,
                    diashabiles: 0,
                    class: 'DatCajero',
                    areaCaja: true
                };
                me.modelo.activacion(parametros, function () {
                    me.getStorePrincipal().reload();
                });

            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 0) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'HABILITARCAJAPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnDeshabilitar,
            disabled: true,
            iconCls: 'deshabilitar',
            tooltip: this.idioma.ttBtnDeshabilitarCaja,
            handler: function () {
                var parametros = {

                    datos: me.getDatos(),
                    activo: 0,
                    activarcajero: 1,
                    diashabiles: 0,
                    class: 'DatCajero',
                    areaCaja: true
                };
                me.modelo.activacion(parametros, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 1) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 0) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'DESHABILITARCAJAPT');
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({id: 'idcajero', text: this.idioma.lbBtnAyuda}));
    },
    buildWinAddCajero: function (action) {
        this.winAdicionarcajero = new LOG.fac.configuracionpuntoventa.winAdicionarcajero({
            idioma: this.idioma,
            title: (action == 'mod') ? this.idioma.tlVentanaModificarCajero : this.idioma.tlVentanaAdicionarCajero,
            action: action,
            idcajero: (action != 'add') ? this.getSmPrincipal().getSelected().data.idcajero : undefined,
            _parent: this
        });
        this.winAdicionarcajero.show();
    },
    /* getDatosIdArea: function() {
     var selections = this.getSmPrincipal().getSelections(), idarea = [];
     for (var i = 0; i < selections.length; i++) {
     idarea.push(selections[i].data.idareaventa);
     }
     return Ext.encode(idarea);

     },*/
    getDatos: function () {
        var selections = this.getSmPrincipal().getSelections(), idareacaja = [];
        for (var i = 0; i < selections.length; i++) {

            idareacaja.push(selections[i].data.idcajero);
        }
        return Ext.encode(idareacaja);

    },
    render: function () {
        var p = LOG.fac.configuracionpuntoventa.GestionarCajero.superclass.render.call(this), me = this;
        this.getStorePrincipal().on({
            beforeload: function () {
                this.initBaseParams.cajero = true;
                this.baseParams.cajero = true;
            }
        });
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e, o) {
            if (e === 'load' && this.data.items.length === 0) {
                mostrarMensaje(1, me.idioma.msgNoMostrarResultados);
            }
        }, 'CAJEROS');
        return p;
    }
});

/*
 * <Tab para asignar caja al area seleccionada>
 */
LOG.fac.configuracionpuntoventa.ConfigurarCaja = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var me = this;
        this.autoLoad = false;
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa';
        this.busquedaBasica = true;
        this.concepto = config.idioma.ttBtnBuscarCaja;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacionCaja;
        LOG.fac.configuracionpuntoventa.ConfigurarCaja.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: this.dirController + '/'
        });
        this._parent.on('tabchange', function (tb, p) {
            if (p.idComponent == '1') {
                me.getStorePrincipal().load({
                    params: {
                        areaCaja: true
                    }
                });
            }
        });
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.lbCodigoDenom,
            autoExpand: true,
            dataIndex: 'coddenominacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.tlTipoModeloImp,
            width: 150,
            dataIndex: 'modeloimpresion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgArea,
            width: 350,
            dataIndex: 'area',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUsuarios,
            width: 90,
            dataIndex: 'usuarios',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idtipocaja',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idestructuraop',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'tipocaja',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idareaventa',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idcaja',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idmodeloimpresion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idtiporegistradora',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'modelocaja',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'identificador',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'ip',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgActiva,
            width: 70,
            dataIndex: 'activo',
            default: true,
            renderer: function (value, metaData) {
                metaData.css = (value == 1) ? 'icondistra-aceptar verde' : 'icondistra-aceptar rojo';
                metaData.attr = (value == 1) ? 'ext:qtip="Si"' : 'ext:qtip=" NO"';
                ;
            }
        });
    },
    initDefaultButtons: function () {
        var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            disabled: false,
            tooltip: this.idioma.ttBtnAdicionarCaja,
            handler: function () {
                me.buildWinAddCaja('add');
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonModificar({
            disabled: true,
            tooltip: this.idioma.ttBtnModificarCaja,
            handler: function () {
                me.buildWinAddCaja('mod');
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() === 1 && this.getSelected().data.activo == 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'MODIFICARCAJAPT');
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: this.idioma.ttBtnEliminarCaja,
            handler: function () {
                me.modelo.eliminar({
                    datos: me.getDatos(),
                    areaCaja: true
                }, function () {
                    me.getStorePrincipal().load({
                        start: 0,
                        limit: me.getGridPrincipal().getBottomToolbar().cbPageSize.getValue()
                    });
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 0) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'ELIMINARCAJAPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnHabilitar,
            disabled: true,
            iconCls: 'habilitar',
            tooltip: this.idioma.ttBtnHabilitarCaja,
            handler: function () {
                var params = {
                    datos: me.getDatos(),
                    activo: 1,
                    class: 'DatCaja',
                    areaCaja: true
                };
                me.modelo.activacion(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 0) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'HABILITARCAJAPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnDeshabilitar,
            disabled: true,
            iconCls: 'deshabilitar',
            tooltip: this.idioma.ttBtnDeshabilitarCaja,
            handler: function () {
                var parametros = {
                    datos: me.getDatos(),
                    activo: 0,
                    diashabiles: 0,
                    class: 'DatCaja',
                    areaCaja: true
                };
                me.modelo.activacion(parametros, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 1) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 0) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'DESHABILITARCAJAPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnAsociarAreaCaja,
            //disabled: true,
            iconCls: 'asociar',
            tooltip: this.idioma.ttBtnAsociarareacaja,
            handler: function () {
                me.modelo.asociarAreaCaja(null, function () {
                    me.getStorePrincipal().reload();
                });
            }/*,
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 1) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 0) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'ASOCIARCAJAAREAVENTA');
            }*/
        }));
        this.addToolbarButton('->');
        this.cmbUsuario = new LOG.util.ComboBox({
            autoLoad: true,
            name: 'idUsuario',
            url: 'cargarUsuarios',
            valueField: 'idUsuario',
            displayField: 'nombreusuario',
            //width:350,
            anchor: '50%',
            //listWidth:350,
            //pageSize: 10,
            //mode: 'remote',
            allowBlank: true,
            editable: true,
            listeners: {
                /*expand: function () {
                    this.store.reload();
                }*/
                select: function (combo, record, index) {
                    combo.setValue(record.json.idUsuario);
                    me.datosUser = record.json;
                }
            }
        });
        this.addToolbarButton(this.idioma.cgUsuarios);
        this.addToolbarButton(this.cmbUsuario);
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnConfUsuarios,
            disabled: true,
            iconCls: 'usuario',
            tooltip: this.idioma.ttBtnConfigUsuarios,
            handler: function () {
                var idusuario = me.cmbUsuario.getValue();
                if (idusuario != '') {
                    var parametros = {
                        datos: me.getDatos(),
                        idusuario: idusuario,
                        activo: 1
                    };
                    me.modelo.asociarUsuarioACaja(parametros, function () {
                        me.getStorePrincipal().reload();
                        me.cmbUsuario.reset();
                    });
                } else {
                    mostrarMensaje(3, 'Debe seleccionar el usuario a configurar');
                }
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() > 1 /*&& this.getSelected().data.activo == 0*/) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'CONFIGUSUARIOS');
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({id: 'idconfcaja', text: this.idioma.lbBtnAyuda}));
    },
    buildWinAddCaja: function (action) {
        this.winAdicionarcaja = new LOG.fac.configuracionpuntoventa.winAdicionarcaja({
            idioma: this.idioma,
            title: (action == 'mod' || action == 'addUser') ? this.idioma.tlVentanaModificarCaja : this.idioma.tlVentanaAdicionarCaja,
            iddeposito: this.idDeposito,
            nomDeposito: this.nomDeposito,
            action: action,
            _parent: this
        });
        this.winAdicionarcaja.show();
    },
    /* getDatosIdArea: function() {
     var selections = this.getSmPrincipal().getSelections(), idarea = [];
     for (var i = 0; i < selections.length; i++) {
     idarea.push(selections[i].data.idareaventa);
     }
     return Ext.encode(idarea);

     },*/
    getDatos: function () {
        var selections = this.getSmPrincipal().getSelections(), idareacaja = [];
        for (var i = 0; i < selections.length; i++) {
            idareacaja.push(selections[i].data.idcaja);
        }
        return Ext.encode(idareacaja);

    },
    render: function () {
        var p = LOG.fac.configuracionpuntoventa.ConfigurarCaja.superclass.render.call(this), me = this;
        this.getStorePrincipal().on({
            beforeload: function () {
                this.initBaseParams.areaCaja = true;
                this.baseParams.areaCaja = true;
            }
        });
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e, o) {
            if (e === 'load' && this.data.items.length === 0) {
                mostrarMensaje(1, me.idioma.msgNoMostrarResultados);
            }
        }, 'CAJAS');
        return p;
    }
});

LOG.fac.configuracionpuntoventa.Producto = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa';
            this.urlBusquedaGridPrincipal = 'cargarProductos';
            this.formaVisualizacion = 'panel';
            this.busquedaBasica = true;
            this.busquedaAvanzada = true;
            this.autoLoad = false;
            //this.idGridPrincipal = "idproducto";
            this.modoSeleccion = 3;
            this.autoSelect = false;
            this.concepto = config.idioma.ttBtnBuscarProducto;
            this.idareaventa = '';
            this.idestructura = '';
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacionProd;
        LOG.fac.configuracionpuntoventa.Producto.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: this.dirController + '/'
        });
    },
    init: function () {
        var me = this;
        LOG.fac.configuracionpuntoventa.Producto.superclass.init.call(this);
        this.cmbArea = new LOG.util.ComboBox({
            //autoLoad: true,
            name: 'idareaventa',
            url: 'cargarAreas',
            valueField: 'idestructuraop',
            displayField: 'coddenominacion',
            width: 350,
            anchor: '90%',
            listWidth: 350,
            //pageSize: 10,
            //mode: 'remote',
            allowBlank: false,
            editable: true,
            listeners: {
                expand: function () {
                    this.store.reload();
                },
                select: function (combo, record, index) {
                    /*me.listaBotones.getItem(0).enable();
                    me.listaBotones.getItem(1).enable();
                    me.listaBotones.getItem(2).enable();
                    me.listaBotones.getItem(3).enable();
                    me.listaBotones.getItem(4).enable();*/
                    me.getPanelGrid().enable();
                    me.datosConf = record.json;
                    //me.idareaventa = record.json.idareaventa;
                    me.getStorePrincipal().load({
                        params: {
                            idestructura: combo.getValue(),
                            idareaventa: record.json.idareaventa,
                            idmonedaventa: record.json.idmoneda
                        }
                    });
                },
                chamge: function (combo, newValue, oldValue) {
                    /*me.listaBotones.getItem(0).enable();
                    me.listaBotones.getItem(1).enable();
                    me.listaBotones.getItem(2).enable();
                    me.listaBotones.getItem(3).enable();
                    me.listaBotones.getItem(4).enable();*/
                    me.getPanelGrid().enable();
                    me.getStorePrincipal().load({
                        params: {
                            idestructura: combo.getValue()
                        }
                    });
                }
            }
        });
        /*this.cmbArea = new LOG.util.SelectorTF({
            fieldLabel :this.idioma.tfArea,
            title :this.idioma.tfArea,
            url : 'cargarAreas',
            width:350,
            controller : '',
            valueField : 'idestructuraop',
            displayField : 'coddenominacion',
            hiddenName : 'idestructuraop',
            columns : [{
                    header : this.idioma.tfArea,
                    dataIndex : 'coddenominacion',
                    width : 250,
                    autoExpand : true
                }
            ],
            listeners: {
                select: function (cmb) {
                    me.getStorePrincipal().load({
                        params: {
                            idestructura: cmbArea.getValue()
                        }
                    });
                }
            }
        });*/
        /*this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: ['->', '-', this.idioma.tfArea + ':', this.cmbArea]
        }));
        LOG.util.UIManager.apply(this.getPanelSuperior(), {
            width: 10
        });*/
    },
    view: function () {
        var _this = this;
        this.getPanelGrid().disable();
        let conExistencia = new Ext.form.Checkbox({
            boxLabel: 'Con existencia',
            name: 'conexistencia',
            listeners: {
                'check': function(cmp, checked) {
                    if (checked) {
                        cmp.checked = true;
                        _this.getPanelBusqueda().parametros.conexistencia = 1;
                    } else {
                        _this.getPanelBusqueda().parametros.conexistencia = 0;
                    }
                }
            }
        });
        let conDisponible = new Ext.form.Checkbox({
            boxLabel: 'Con disponible',
            name: 'condisponible',
            listeners: {
                'check': function(cmp, checked) {
                    if (checked) {
                        cmp.checked = true;
                        _this.getPanelBusqueda().parametros.condisponible = 1;
                    } else {
                        _this.getPanelBusqueda().parametros.condisponible = 0;
                    }
                }
            }
        });
        let conPrecio = new Ext.form.Checkbox({
            boxLabel: 'Con precio',
            name: 'con_precio',
            listeners: {
                'check': function(cmp, checked) {
                    if (checked) {
                        cmp.checked = true;
                        sinPrecio.setValue(false);
                        _this.getPanelBusqueda().parametros.con_precio = 1;
                    } else {
                        _this.getPanelBusqueda().parametros.con_precio = 0;
                    }
                }
            }
        });
        let sinPrecio = new Ext.form.Checkbox({
            boxLabel: 'Sin precio',
            name: 'sin_precio',
            listeners: {
                'check': function(cmp, checked) {
                    if (checked) {
                        cmp.checked = true;
                        conPrecio.setValue(false);
                        _this.getPanelBusqueda().parametros.sin_precio = 1;
                    } else {
                        _this.getPanelBusqueda().parametros.sin_precio = 0;
                    }
                }
            }
        });
        this.getPanelBusqueda().setColumns(1);
        let frmExistencia = new LOG.util.ColumnForm(2);
        frmExistencia.addComponent(conDisponible);
        frmExistencia.addComponent(conExistencia);
        frmExistencia.addComponent(conPrecio);
        frmExistencia.addComponent(sinPrecio);
        this.addFilterComponent(new Ext.form.FieldSet({
            anchor: '100%',
            items: [frmExistencia]
        }))
        return LOG.fac.configuracionpuntoventa.Producto.superclass.view.call(this);
    },
    setIdAreaVenta: function(id) {
        this.idareaventa = id;
    },
    setIdEstructura: function(id) {
        this.idestructura = id;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.tfCodigoDenom,
            width: 350,
            dataIndex: 'text',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.tfCodigoBarra,
            width: 110,
            dataIndex: 'codigobarra',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 45,
            align: 'center',
            dataIndex: 'umedida',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNaturaleza,
            width: 100,
            dataIndex: 'naturaleza',
            //agrupador: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPrecio,
            width: 85,
            align: 'right',
            dataIndex: 'precio',
            default: true,
            renderer: function (v, m, rd) {
                if (v) {
                    return Ext.util.Format.number(v, '0,000.00');
                }
                return '0.00';
            }
        });
        //precio alternativo
        /*this.addGridColumn({
            header: this.idioma.cgPrecioAlternativo,
            width: 200,
            dataIndex: 'precioalternativo',
            default: true,
            renderer: function (v, m, rd) {
                if (v) {
                    return parseFloat(v).toFixed(2);
                }
                return '0.00';
            }
        });*/
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 85,
            align: 'right',
            dataIndex: 'disponible',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCantEnTienda,
            width: 85,
            align: 'right',
            dataIndex: 'cantidadentienda',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadVendida,
            width: 85,
            dataIndex: 'cantvendida',
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: this.idioma.cgTotal,
            width: 120,
            dataIndex: 'total',
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: this.idioma.cgExistencia,
            width: 85,
            align: 'right',
            dataIndex: 'existencia',
            default: true,
            renderer: function (v) {
                if (v)
                    return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: 'Almacenamiento',
            width: 100,
            dataIndex: 'especial',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {

                if (record.get('equipo') == 1) {
                    metaData.css = 'icondistra-numeroserie';
                    metaData.attr = 'ext:qtip="' + 'Tiene n\xfamero de serie' + '"';

                } else if (record.get('tienelote') == 1) {
                    metaData.css = 'icondistra-lote';
                    metaData.attr = 'ext:qtip="' + 'Tiene lote' + '"';

                } else {
                    metaData.css = 'icondistra-producto';
                    metaData.attr = 'ext:qtip="' + 'Es producto' + '"';

                }

            }
        });
        this.addGridColumn({dataIndex: 'idindicador'});
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'tienelote'});
        this.addGridColumn({dataIndex: 'equipo'});
    },
    initDefaultButtons: function () {
        var me = this;
        //boton importar ventas
        /*this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnActPrecio,
            disabled: true,
            iconCls: 'registrogasto',
            tooltip: this.idioma.ttBtnActPrecio,
            handler: function () {
                var params = {
                    //idestructura: me.cmbArea.getValue(),
                    idareaventa: me.datosConf.idareaventa/!*,
                    typesync: 2*!/
                };

                me.modelo.actualizarPrecios(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                b.hide();
                if (me.grantedAction('ACTPRECIO')) {
                    b.show();
                } else {
                    b.hide();
                }
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (me.cmbArea.getValue() != '' /!*&& me.datosConf.tiendavirtual == 1*!/) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'ACTUALIZARPRECIO');
            }
        }));*/
        //boton sicronizar solo disponible
        /*this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnSincronizarDisp,
            disabled: true,
            iconCls: 'sincronizar',
            tooltip: this.idioma.ttBtnSincronizarDisp,
            handler: function () {
                var params = {
                    idestructura: me.cmbArea.getValue(),
                    typesync: 5
                };

                me.modelo.sincronizarDatos(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (me.cmbArea.getValue() != '' && me.datosConf.tiendavirtual == 1 && me.datosConf.tipo == "ps") {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');
            }
        }));*/
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Exportar xml',
            disabled: true,
            iconCls: 'exportar',
            tooltip: 'Exportar productos disponibles a xml',
            handler: function () {
                var params = {
                    idestructura: me.idestructura,
                    idareaventa: me.datosConf.idareaventa,
                    typesync: 8
                };

                me.modelo.sincronizarDatos(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                /*LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (me.cmbArea.getValue() != '' && me.datosConf.tiendavirtual == 1 && me.datosConf.tipo == "cx") {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');*/
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (me.idestructura != '' && me.datosConf.tiendavirtual == 1 && me.datosConf.tipo == "cx") {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Exportar json',
            disabled: true,
            iconCls: 'exportar',
            tooltip: 'Exportar productos disponibles a json',
            handler: function () {
                var params = {
                    idestructura: me.idestructura,
                    idareaventa: me.datosConf.idareaventa,
                    typesync: 8,
                    format: 'json'
                };

                me.modelo.sincronizarDatos(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                /*LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (me.cmbArea.getValue() != '') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');*/
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (me.idestructura != '') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');
            }
        }));
        /*this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnActPrecioAll,
            //disabled: true,
            iconCls: 'actualizar',
            tooltip: this.idioma.ttBtnActPrecioAll,
            handler: function () {
                var params = {
                    idareaventa: null
                };

                me.modelo.actualizarPrecios(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                b.hide();
                if (me.grantedAction('ACTPRECIO')) {
                    b.show();
                } else {
                    b.hide();
                }

            }
        }));*/
        //boton sicronizar solo disponible
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Actualizar productos tienda',
            disabled: true,
            iconCls: 'sincronizar',
            tooltip: 'Sincroniza con la tienda los datos actuales de todos los productos',
            handler: function () {
                var params = {
                    idestructura: me.idestructura,
                    typesync: 9
                };

                me.modelo.sincronizarDatos(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (me.idestructura != '' && me.datosConf.tiendavirtual == 1 && me.datosConf.tipo == "ps") {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Lotes',
            tooltip: '',
            iconCls: 'lote',
            disabled: true,
            handler: function () {
                let win = new LOG.fac.configuracionpuntoventa.Lotes({ idioma: me.idioma, idproducto: me.getSmPrincipal().getSelected().json.idproducto,
                    _parent: me});
                win.init();
                win.view();
            },
            controlFn: function(b, called){
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (me.getSmPrincipal().getSelections().length == 1 && me.getSmPrincipal().getSelected().json.tienelote == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');
            }
        }));
        //boton registro de entrada
        // if (existeInv === 0) {
        /*this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'registro',
            text: this.idioma.lbBtnRegistrarEntrada,
            tooltip: this.idioma.ttBtnRegistrarlaentrada,
            disabled: true,
            handler: function () {
                var idcliente;
                Ext.each(me._parent.listaPlantillas.getItem(0).getStorePrincipal().data.items, function(r) {
                    if (me.cmbArea.getValue() == r.json.idestructuraop) {
                      idcliente = r.json.idcliente;
                    }
                });
                this.winregistrarentrada = new LOG.fac.configuracionpuntoventa.winregistrarentrada({
                    idioma: me.idioma,
                    textBusquedaSimple: me.idioma.textBusquedaSimple,
                    _parent: me,
                    idseleccionados: me.getProductosAdded(),
                    //cambio por cliente
                   // idestructura:(me.cmbArea) ? me.cmbArea.getValue() : undefined
                    idcliente:idcliente
                });
                this.winregistrarentrada.init();
                this.winregistrarentrada.view();
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
                    b.disable();
                    if (e === 'load') {
                        b.enable();
                    }
                }, b.text);
            }
        }));*/
        //  }
        //boton cambiar precio
        /*this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'cambiar',
            text: this.idioma.lbBtnCambiarPrecio,
            tooltip: this.idioma.ttBtnCambiarPrecio,
            disabled: true,
            handler: function () {
                var cambiarPrecio = new LOG.fac.configuracionpuntoventa.cambiarPrecio({
                    idioma: me.idioma,
                    _parent: me,
                    producto: me.getSmPrincipal().getSelected(),
                    idestructura: (me.cmbArea) ? me.cmbArea.getValue() : undefined,
                    datos: me.getGridPrincipal().getSelectionModel()
                });
                cambiarPrecio.show();
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        b.setDisabled(this.getCount() > 0 ? false : true);
                    }
                }, 'CAMBIARPRECIOPRODUCTOPT');
            }
        }));*/
        //boton revaluar precio
        /*this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'cambiar',
            text: this.idioma.lbBtnReevaluarPrecio,
            tooltip: this.idioma.ttBtnReevaluarPrecio,
            disabled: true,
            handler: function () {
                var cambiarPrecio = new LOG.fac.configuracionpuntoventa.reevaluarPrecio({
                    idioma: me.idioma,
                    _parent: me,
                    producto: me.getSmPrincipal().getSelected(),
                    idestructura: (me.cmbArea) ? me.cmbArea.getValue() : undefined,
                    datos: me.getGridPrincipal().getSelectionModel()
                });
                cambiarPrecio.show();
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        b.setDisabled(this.getCount() > 0 ? false : true);
                    }
                }, 'CAMBIARPRECIOPRODUCTOPT');
            }
        }));*/
        //this.addToolbarButton('->');
        //this.addToolbarButton(LOG.util.Prototipos.botonAyuda({id: 'idconfproducto'}));
    },
    getProductosAdded: function () {
        var productos = this.getStorePrincipal().data.items, idselections = [];
        for (var i = 0; i < productos.length; i++) {
            idselections.push(productos[i].data.idindicador);
        }
        return idselections;
    },
    render: function () {
        var p = LOG.fac.configuracionpuntoventa.Producto.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e, o) {
            if (e === 'beforeload') {
                this.initBaseParams.idestructura = me.idestructura;
                this.initBaseParams.idareaventa = me.datosConf.idareaventa;
                this.initBaseParams.idmonedaventa = me.datosConf.idmoneda;
                //idareaventa: record.json.idareaventa
                // this.initBaseParams.prodareas = 1;
                // this.baseParams.prodareas = 1;
                /* if (existeInv === 0) {
                     this.initBaseParams.prodareas = 1;
                     this.baseParams.prodareas = 1;
                 }*/
            }
            if (e == 'load') {
                if (this.getCount() == 0) {
                    mostrarMensaje(1, me.idioma.msgNoMostrarResultados);
                }
            }
        });
        return p;
    }
});

LOG.fac.configuracionpuntoventa.Servicio = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa',
            this.urlBusquedaGridPrincipal = 'cargarServicios',
            this.formaVisualizacion = 'panel',
            this.busquedaBasica = true,
            this.autoLoad = false,
            this.modoSeleccion = 3;
            this.autoSelect = false;
            this.concepto = config.idioma.ttBtnBuscarServicio;
        this.idareaventa = '';
        this.idestructura = '';
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacionServ;
        LOG.fac.configuracionpuntoventa.Servicio.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: this.dirController + '/'
        });
    },
    init: function () {
        var me = this;
        LOG.fac.configuracionpuntoventa.Servicio.superclass.init.call(this);
    },
    view: function () {
        this.getPanelGrid().disable();
        return LOG.fac.configuracionpuntoventa.Servicio.superclass.view.call(this);
    },
    setIdAreaVenta: function(id) {
        this.idareaventa = id;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.tfCodigoDenom,
            width: 350,
            dataIndex: 'text',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 45,
            align: 'center',
            dataIndex: 'umedida',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNaturaleza,
            width: 100,
            dataIndex: 'naturaleza',
            //agrupador: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPrecio,
            width: 200,
            align: 'right',
            dataIndex: 'precio',
            default: true,
            renderer: function (v, m, rd) {
                if (v) {
                    return Ext.util.Format.number(v, '0,000.00');
                }
                return '0.00';
            }
        });
        this.addGridColumn({
            header: 'Precio venta',
            width: 85,
            align: 'right',
            dataIndex: 'precioventa',
            default: true,
            renderer: function (v, m, rd) {
                if (v) {
                    return Ext.util.Format.number(v, '0,000.00');
                }
                return '0.00';
            }
        });

        this.addGridColumn({dataIndex: 'idindicador'});
        this.addGridColumn({dataIndex: 'idservicio'});
    },
    initDefaultButtons: function () {
        var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            idioma: this.idioma,
            tooltip: this.idioma.ttBtnAdicionarServ,
            disabled: true,
            handler: function () {
                let parametros = {};
                let idseleccionados = [];
                parametros.idseleccionados = Ext.encode(idseleccionados);
                LOG.inv.maestroproductos.Loader.init(function() {
                    var v = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 2,
                        constrain: true,
                        usarAplicar: true,
                        parametros: parametros,
                        doAction: function(r) {
                            me.addServicio(r);
                        }
                    });
                    v.show();
                })
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getStorePrincipal(), 'fireEvent', function (e) {
                    if (me.idareaventa != '') {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            idioma: this.idioma,
            tooltip: this.idioma.ttBtnEliminarServ,
            disabled: true,
            handler: function () {
                let selections = me.getSmPrincipal().getSelections();
                let ids = [];
                Ext.each(selections, function (rec) {
                    ids.push(rec.data.idservicio);
                });
                var params = {
                    idareaventa: me.idareaventa,
                    datos: ids,
                };
                me.modelo.eliminarServicios(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 /*&& this.getSelected().data.activo == 0*/) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnHabilitar,
            disabled: true,
            iconCls: 'habilitar',
            tooltip: this.idioma.ttBtnHabilitarServ,
            handler: function () {
                /*var params = {
                    datos: me.getDatos(),
                    activo: 1,
                    idareaventa: me.cmbArea.getValue()
                };
                me.modelo.activacionNaturaleza(params, function () {
                    me.getStorePrincipal().reload();
                });*/
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    /*if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 0 && me.cmbArea.getValue() != '') {
                            b.enable();
                        } else if (this.getCount() > 1 && me.cmbArea.getValue() != '') {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }*/
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnDeshabilitar,
            disabled: true,
            iconCls: 'deshabilitar',
            tooltip: this.idioma.ttBtnDeshabilitarServ,
            handler: function () {
                /*var params = {
                    datos: me.getDatos(),
                    activo: 0,
                    idareaventa: me.cmbArea.getValue()
                };

                me.modelo.activacionNaturaleza(params, function () {
                    me.getStorePrincipal().reload();
                });*/
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        /*if (this.getCount() == 1 && this.getSelected().data.activo == 1 && me.cmbArea.getValue() != '') {
                            b.enable();
                        } else if (this.getCount() > 1 && me.cmbArea.getValue() != '') {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 0) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }*/
                    }
                });
            }
        }));
    },
    addServicio: function(record) {
        var _this = this;
        let servicios = [];
        let idindicador = [];
        Ext.each(record, function(rec) {
            rec.data.idindicador = rec.json.idindicador;
            rec.data.idareaventa = _this.idareaventa;
            rec.data.idmonedaventa = _this.datosConf.idmoneda;
            idindicador.push(rec.json.idindicador);
            rec.data.denominacion = rec.json.denominacion;
            rec.data.descripcionventa = rec.json.descripcionventa;
            rec.data.numeropieza = rec.json.numeropieza;
            rec.data.codigo = rec.json.codigo;
            rec.data.preciobase = rec.json.precio;
            servicios.push(rec.data);
        });
        let datos = {};
        datos.servicios = servicios;
        Ext.MessageBox.wait('Guardando datos', _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'adicionarServicio',
            method: 'post',
            params: {
                datos: Ext.encode(datos)
            },
            success: function(rp) {
                let value = Ext.decode(rp.responseText);
                Ext.MessageBox.hide();
                _this.getStorePrincipal().reload();
            }
        });
    },
    render: function () {
        var p = LOG.fac.configuracionpuntoventa.Servicio.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e, o) {
            if (e === 'beforeload') {
                this.initBaseParams.idareaventa = me.datosConf.idareaventa;
                this.initBaseParams.idmonedaventa = me.datosConf.idmoneda;
            }
            if (e == 'load') {
                if (this.getCount() == 0) {
                    mostrarMensaje(1, me.idioma.msgNoMostrarResultados);
                }
            }
        });
        return p;
    }
});

LOG.fac.configuracionpuntoventa.Operarios = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa',
            this.urlBusquedaGridPrincipal = 'cargarOperarios',
            this.formaVisualizacion = 'panel',
            this.busquedaBasica = false,
            this.autoLoad = false,
            this.modoSeleccion = 1;
        this.idareaventa = '';
        this.idservicio = '';
        this.idestructura = '';
        LOG.fac.configuracionpuntoventa.Operarios.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: this.dirController + '/'
        });
    },
    init: function () {
        var me = this;
        LOG.fac.configuracionpuntoventa.Operarios.superclass.init.call(this);
    },
    view: function () {
        this.getPanelGrid().disable();
        return LOG.fac.configuracionpuntoventa.Operarios.superclass.view.call(this);
    },
    setIdAreaVenta: function(id) {
        this.idareaventa = id;
    },
    setIdServicio: function(id) {
        this.idservicio = id;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: 'Nombre',
            width: 350,
            dataIndex: 'nombre',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({dataIndex: 'idpersona'});
        this.addGridColumn({dataIndex: 'idservicio'});
        this.addGridColumn({dataIndex: 'idserviciopersona'});
    },
    initDefaultButtons: function () {
        var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            idioma: this.idioma,
            tooltip: 'Adicionar operario',
            disabled: true,
            handler: function () {
                let title = 'Adicionar vendedor';
                let addOperario = new LOG.fac.configuracionpuntoventa.AddPersona({
                    idioma: me.idioma,
                    gpParent: me._parent,
                    urlBusquedaGridPrincipal: 'cargarPersonas'
                });
                addOperario.init();

                addOperario.getVistaPrincipal().title = 'Listado de personas';
                addOperario.view();
                addOperario.getGridPrincipal().getStore().load();
                let botonAceptar = addOperario.getVistaPrincipal().listaBotones.getItem(2);
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    let records = addOperario.getGridPrincipal().getSelectionModel().getSelections();
                    let ids = Array();
                    Ext.each(records, function(r){
                        ids.push(r.data.idpersona);
                    });
                    Ext.MessageBox.wait('Guardando datos', 'Espere' || '...');
                    Ext.Ajax.request({
                        url: 'adicionarOperario',
                        method: 'POST',
                        params: {
                            ids: Ext.encode(ids),
                            idservicio: me._parent.pServicios.getSmPrincipal().getSelected().data.idservicio
                        },
                        callback: function(o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success) {
                                mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente');
                                me.getStorePrincipal().load();
                            } else {
                                mostrarMensaje(1, 'Ha ocurrido un error al guardar los datos');
                            }
                        }
                    });
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me._parent.pServicios.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (me._parent.pServicios.getSmPrincipal().getCount() == 1) {
                            b.enable();
                            me.getStorePrincipal().load()
                        } else {
                            b.disable();
                            me.getStorePrincipal().removeAll()
                        }
                    }
                }, 'HABILITARBTNOPER');
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            idioma: this.idioma,
            tooltip: 'Eliminar operario',
            disabled: true,
            handler: function () {
                let selections = me.getSmPrincipal().getSelections();
                let ids = [];
                Ext.each(selections, function (rec) {
                    ids.push(rec.data.idserviciopersona);
                });
                var params = {
                    idareaventa: me.idareaventa,
                    datos: ids,
                };
                me.modelo.eliminarOperario(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 /*&& this.getSelected().data.activo == 0*/) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
    },
    /*addServicio: function(record) {
        var _this = this;
        let servicios = [];
        let idindicador = [];
        Ext.each(record, function(rec) {
            rec.data.idindicador = rec.json.idindicador;
            rec.data.idareaventa = _this.idareaventa;
            rec.data.idmonedaventa = _this.datosConf.idmoneda;
            idindicador.push(rec.json.idindicador);
            rec.data.denominacion = rec.json.denominacion;
            rec.data.descripcionventa = rec.json.descripcionventa;
            rec.data.numeropieza = rec.json.numeropieza;
            rec.data.codigo = rec.json.codigo;
            rec.data.preciobase = rec.json.precio;
            servicios.push(rec.data);
        });
        let datos = {};
        datos.servicios = servicios;
        Ext.MessageBox.wait('Guardando datos', _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'adicionarServicio',
            method: 'post',
            params: {
                datos: Ext.encode(datos)
            },
            success: function(rp) {
                let value = Ext.decode(rp.responseText);
                Ext.MessageBox.hide();
                _this.getStorePrincipal().reload();
            }
        });
    },*/
    render: function () {
        var p = LOG.fac.configuracionpuntoventa.Operarios.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e, o) {
            if (e === 'beforeload') {
                this.baseParams.idservicio = me._parent.pServicios.getSmPrincipal().getSelected().data.idservicio;
                this.initBaseParams.idservicio = me._parent.pServicios.getSmPrincipal().getSelected().data.idservicio;
            }
            if (e == 'load') {
                if (this.getCount() == 0) {
                    mostrarMensaje(1, me.idioma.msgNoMostrarResultados);
                }
            }
        });
        return p;
    }
});

LOG.fac.configuracionpuntoventa.AddPersona = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        config.modoSeleccion = 3;
        config.autoLoad = false;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa';
        config.formaVisualizacion = 'ventana';
        config.autoSelect = false;
        this.busquedaBasica = true;
        this.gpParent = config.gpParent;
        config = Ext.apply(_this, config);
        LOG.fac.configuracionpuntoventa.AddPersona.superclass.constructor.call(this, config);

    },
    init: function () {
        var _this = this;
        LOG.fac.configuracionpuntoventa.AddPersona.superclass.init.call(this);
        _this.getVistaPrincipal().width = 500;
        _this.getVistaPrincipal().height = 350;
        //_this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();


    },
    aceptarFn: function(){
        console.info('aceptar');
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idpersona'
        });
        this.addGridColumn({
            header: 'Nombre',
            width: 250,
            dataIndex: 'nombreapellidos',
            default: true
        });
    },
    render: function () {
        var _this = this;
        var p = LOG.fac.configuracionpuntoventa.AddPersona.superclass.render.call(this);
        _this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function(e) {
            if (e == 'selectionchange') {
                if (this.getCount()> 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }else{
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                /*st.initBaseParams.tipocliente = _this.tipocliente;
                st.initBaseParams.idclientesproveedores = _this.idclientesproveedores;*/
                /*st.baseParams.start = 0;
                st.baseParams.limit = 30;
                */
                st.initBaseParams.idservicio = _this.gpParent.pServicios.getSmPrincipal().getSelected().data.idservicio;
            }
        });
        return p;
    }
});

LOG.fac.configuracionpuntoventa.ProductosServicios = Ext.extend(LOG.util.UITabTemplate, {
    constructor: function (config) {
        this.idioma = config.idioma;
        this.formaVisualizacion = 'panel';
        LOG.fac.configuracionpuntoventa.ProductosServicios.superclass.constructor.call(this, config);
    }
});

LOG.fac.configuracionpuntoventa.PanelProductos = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        this.idioma = config.idioma;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa',
        this.layout = 'border';
        this.region = 'center';
        this.parent = config._parent;
        this.title = config.title;
        this.acciones = config.acciones;
        this.idareaventa = -1;
        this.tbar = this.getTbar();
        this.items = this.getItems();
        LOG.fac.configuracionpuntoventa.PanelProductos.superclass.constructor.call(this, config);
        this.btnSincronizarSeleccion.controlFn.createDelegate(this, [this.btnSincronizarSeleccion, this]).call();
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: this.dirController + '/'
        });
    },
    getItems: function () {
        let _this = this;

        this.pProductos = new LOG.fac.configuracionpuntoventa.Producto({
            idioma: _this.idioma,
            _parent: _this.parent,
            title: _this.idioma.tlVentanaProductos,
            idComponent: 0,
            acciones: _this.acciones
        });
        this.pServicios = new LOG.fac.configuracionpuntoventa.Servicio({
            idioma: _this.idioma,
            _parent: _this.parent,
            acciones: _this.acciones
        });
        this.pServicios.init();

        this.pOperarios = new LOG.fac.configuracionpuntoventa.Operarios({
            idioma: _this.idioma,
            _parent: _this,
            acciones: _this.acciones
        });

        this.pOperarios.init();

        let items = [this.pServicios.view()];

         if (typeof TPV_OPERARIOSERVICE !== 'undefined' && TPV_OPERARIOSERVICE == true) {
             items = [this.pServicios.view(), {xtype: 'panel', region: 'east',
                 width: 400, layout: 'border', items: [
                     this.pOperarios.view()
                 ]}];
         }

        this.pnServicePerson = LOG.util.UIManager.initPanel({
            idioma: _this.idioma,
            _parent: _this.parent,
            title: 'Servicios',
            idComponent: 1,
            acciones: _this.acciones,
            layout: 'border',
            items: items,
            view: function () {
                return this;
            }
        });

        this.tProductos = new LOG.fac.configuracionpuntoventa.ProductosServicios({
            idioma: _this.idioma,
            _parent: _this.parent,
            title: 'Productos/Servicios',
            idComponent: 3,
            acciones: _this.acciones
        });

        this.tProductos.addTabToTemplete(this.pProductos);
        this.tProductos.addTabToTemplete(this.pnServicePerson);
        this.tProductos.init();

        return [this.tProductos.view()];
    },
    getTbar: function () {
        let _this = this;
        this.cmbArea = new LOG.util.ComboBox({
            autoLoad: true,
            name: 'idareaventa',
            url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarAreas',
            valueField: 'idestructuraop',
            displayField: 'coddenominacion',
            width: 350,
            anchor: '90%',
            listWidth: 350,
            //pageSize: 10,
            //mode: 'remote',
            allowBlank: false,
            editable: true,
            listeners: {
                /*expand: function () {
                this.store.reload();
                },*/
                select: function (combo, record, index) {
                    _this.datosConf = record.json;
                    _this.pProductos.setIdEstructura(combo.getValue())
                    _this.pProductos.getPanelGrid().enable();
                    _this.pProductos.datosConf = record.json;

                    _this.pServicios.getPanelGrid().enable();
                    _this.pServicios.datosConf = record.json;
                    _this.pServicios.setIdAreaVenta(record.json.idareaventa)

                    _this.pOperarios.getPanelGrid().enable();
                    _this.pOperarios.datosConf = record.json;
                    _this.pOperarios.setIdAreaVenta(record.json.idareaventa)

                    _this.idareaventa = record.json.idareaventa;
                    _this.pProductos.getGridPrincipal().getStore().load(
                        {
                            params: {
                                idestructura: combo.getValue(),
                                idareaventa: record.json.idareaventa,
                                idmonedaventa: record.json.idmoneda
                            }
                        }
                    );

                    _this.pServicios.getGridPrincipal().getStore().load(
                        {
                            params: {
                                idestructura: combo.getValue(),
                                idareaventa: record.json.idareaventa,
                                idmonedaventa: record.json.idmoneda
                            }
                        }
                    );

                    //_this.pServicios.getGridPrincipal().getStore().load();
                    /*_this.productos.setIdAreaVenta(record.json.idareaventa)
                    _this.devoluciones.setIdAreaVenta(record.json.idareaventa)
                    _this.pedidos.setIdAreaVenta(record.json.idareaventa)

                    _this.productos.setIdDeposito(record.json.idestructuraop)
                    _this.devoluciones.setIdDeposito(record.json.idestructuraop)

                    _this.productos.getGridPrincipal().getStore().load();
                    _this.devoluciones.getGridPrincipal().getStore().load();
                    _this.pedidos.getGridPrincipal().getStore().load();*/

                }
            }
        });

        this.btnActualizarPrecio = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnActPrecio,
            disabled: true,
            iconCls: 'registrogasto',
            tooltip: this.idioma.ttBtnActPrecio,
            handler: function () {
                var params = {
                    idareaventa: _this.idareaventa
                };

                _this.modelo.actualizarPrecios(params, function () {
                    _this.pProductos.getStorePrincipal().reload();
                    _this.pServicios.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                b.hide();
                if (_this.grantedAction('ACTPRECIO')) {
                    b.show();
                } else {
                    b.hide();
                }
                LOG.util.UIManager.encadenaFn(_this.cmbArea, 'fireEvent', function (e) {
                    console.log(e)
                    if (e == 'select') {
                        if (_this.cmbArea.getValue() != '' /*&& me.datosConf.tiendavirtual == 1*/) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'ACTUALIZARPRECIO');
            }
        });

        this.btnSincronizar = LOG.util.UIManager.createBtn({
            text: 'Sincronizar',
            disabled: true,
            iconCls: 'sincronizar',
            tooltip: 'Sincronizar informaci\xf3n de productos/servicios',
            handler: function () {
                var params = {
                    idestructura: _this.cmbArea.getValue(),
                    idareaventa: _this.idareaventa,
                    typesync: (_this.datosConf.cr == 1) ? 10 : 5
                };

                _this.modelo.sincronizarDatos(params, function () {
                    _this.pProductos.getStorePrincipal().reload();
                    _this.pServicios.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(_this.cmbArea, 'fireEvent', function (e) {
                    if (e == 'select') {
                        if (_this.cmbArea.getValue() != ''
                            && ((_this.datosConf.tiendavirtual == 1 && (_this.datosConf.tipo == "ps" || _this.datosConf.tipo == "gjt"))
                                || (_this.datosConf.cr == 1 && _this.datosConf.contienecr > 0))
                        ) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');
            }
        })

        this.btnSincronizarSeleccion = LOG.util.UIManager.createBtn({
            text: 'Sincronizar selecci\xf3n',
            disabled: true,
            iconCls: 'sincronizar',
            tooltip: 'Sincronizar informaci\xf3n de productos/servicios seleccionados',
            handler: function () {
                let idp = [];
                let ids = [];
                let seleccionp = _this.pProductos.getSmPrincipal().getSelections();
                Ext.each(seleccionp, function (p) {
                    idp.push(p.data.idproducto);
                });
                let seleccions = _this.pServicios.getSmPrincipal().getSelections();
                Ext.each(seleccions, function (p) {
                    ids.push(p.data.idindicador);
                });
                var params = {
                    idestructura: _this.cmbArea.getValue(),
                    idareaventa: _this.idareaventa,
                    typesync: (_this.datosConf.cr == 1) ? 10 : 5,
                    seleccionp: Ext.encode(idp),
                    seleccions: Ext.encode(ids)
                };

                _this.modelo.sincronizarDatos(params, function () {
                    _this.pProductos.getStorePrincipal().reload();
                    _this.pServicios.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(_this.pProductos.getGridPrincipal().getSelectionModel(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (_this.pProductos.getGridPrincipal().getSelectionModel().getSelections().length > 0 && (_this.cmbArea.getValue() != ''
                            && ((_this.datosConf.tiendavirtual == 1 && (_this.datosConf.tipo == "ps" || _this.datosConf.tipo == "gjt"))
                                || (_this.datosConf.cr == 1 && _this.datosConf.contienecr > 0)) )) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');
                LOG.util.UIManager.encadenaFn(_this.pServicios.getGridPrincipal().getSelectionModel(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (_this.pServicios.getGridPrincipal().getSelectionModel().getSelections().length > 0 && (_this.cmbArea.getValue() != ''
                            && ((_this.datosConf.tiendavirtual == 1 && (_this.datosConf.tipo == "ps" || _this.datosConf.tipo == "gjt"))
                                || (_this.datosConf.cr == 1 && _this.datosConf.contienecr > 0)) )) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');
            }
        })

        this.btnActualizarAll = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnActPrecioAll,
            //disabled: true,
            iconCls: 'actualizar',
            tooltip: this.idioma.ttBtnActPrecioAll,
            handler: function () {
                var params = {
                    //idestructura: me.cmbArea.getValue(),
                    idareaventa: null/*,
                    typesync: 2*/
                };

                _this.modelo.actualizarPrecios(params, function () {
                    _this.pProductos.getStorePrincipal().reload();
                    _this.pServicios.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                b.hide();
                if (_this.grantedAction('ACTPRECIO')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        });

        this.btnActualizarPrecio.controlFn.createDelegate(this, [this.btnActualizarPrecio, this]).call();
        this.btnSincronizar.controlFn.createDelegate(this, [this.btnSincronizar, this]).call();
        this.btnActualizarAll.controlFn.createDelegate(this, [this.btnActualizarAll, this]).call();
        return [
            this.btnActualizarPrecio,'-',
            this.btnSincronizar, '-',this.btnSincronizarSeleccion,'-',
            this.btnActualizarAll,
            '->', '-', _this.idioma.tfArea + ':', this.cmbArea];
    },
    grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(acciones_reportes, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    view: function () {
        return this;
    }
});


/*ventana del boton registrar entrada*/

LOG.fac.configuracionpuntoventa.winregistrarentrada = Ext.extend(LOG.util.UITemplate, {
    _parent: undefined,
    constructor: function (config) {
        this.busquedaBasica = true;
        //this.gridEditable = existeInv ? false : true;
        this.gridEditable = true;
        this.autoLoad = false;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa';
        this.urlBusquedaGridPrincipal = 'cargarGridprincipal';
        this.formaVisualizacion = 'ventana';
        //this.modoSeleccion = existeInv ? 3 : 1;
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacion;
        LOG.fac.configuracionpuntoventa.winregistrarentrada.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        this.getVistaPrincipal().title = this.idioma.lbBtnRegistrarEntrada;
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 500;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultColumns: function () {
        var me = this;
        this.addGridColumn({
            header: this.idioma.tfCodigoDenom,
            autoExpand: true,
            dataIndex: 'text',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 100,
            dataIndex: 'umedida',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPrecio,
            width: 150,
            dataIndex: 'precio',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 150,
            dataIndex: 'cantidad',
            default: true,
            editor: true,
            renderer: function (v) {
                // if (me.gridEditable)
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({dataIndex: 'idindicador'});
        this.addGridColumn({dataIndex: 'idumedida'});
        this.addGridColumn({dataIndex: 'precioventa'});
        this.addGridColumn({dataIndex: 'importetotal'});
    },
    initDefaultButtons: function () {
        var me = this;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
                disabled: true,
                handler: function () {
                    var rdModified = existeInv ? me.getSmPrincipal().getSelections() : me.getStorePrincipal().getModifiedRecords(),
                        _productos = [];
                    Ext.each(rdModified, function (rec) {
                        rec.data.idestructura = me.idarea;
                        _productos.push(rec.data);
                    });
                    me.modelo.adicionarProductos({
                        datos: Ext.encode(_productos),
                        productoTPV: 1
                    }, function (r) {
                        me.getVistaPrincipal().close();
                        me._parent.getStorePrincipal().reload();
                    });
                }
            }
        );
    },
    render: function () {
        var vista = LOG.fac.configuracionpuntoventa.winregistrarentrada.superclass.render.call(this), me = this;
        this.getGridPrincipal().getBottomToolbar().cbPageSize.setValue(20);
        this.getStorePrincipal().load({
            params: {
                existeInv: existeInv,
                idseleccionados: Ext.encode(me.idseleccionados),
                idcliente: me.idcliente
                //cambio por cliente
                // idcliente: me.idarea
            }
        });
        if (this.gridEditable) {
            var posCln = this.getGridPrincipal().getColumnModel().config.length - 1;
            this.getGridPrincipal().getColumnModel().setEditor(posCln, LOG.util.Prototipos.inputEntero({}));
        }
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
            if (e == 'load') {
                me.getStorePrincipal().initBaseParams.iddeposito = me.idarea;
                me.getStorePrincipal().initBaseParams.idseleccionados = Ext.encode(me.idseleccionados);
                me.getStorePrincipal().initBaseParams.existeInv = existeInv;
                if (me.getStorePrincipal().data.items.length > 0 && !me.gridEditable) {
                    me.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    me.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'afterEdit', function (e) {
            me.getVistaPrincipal().listaBotones.getItem(2).enable();
        });
        return vista;
    }
});

/*ventana del boton cambiar precio*/

LOG.fac.configuracionpuntoventa.cambiarPrecio = Ext.extend(LOG.util.Window, {
    listaBotones: undefined,
    constructor: function (config) {
        LOG.util.UIManager.apply(this, config);
        this.width = 650;
        this.height = 250;
        this.resizable = false;
        this.usarAplicar = false;
        LOG.fac.configuracionpuntoventa.cambiarPrecio.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
    },
    initComponent: function () {
        var me = this;
        LOG.fac.configuracionpuntoventa.cambiarPrecio.superclass.initComponent.call(this);
        this.setTitle(this.idioma.tlVentanaCambiarPrecio);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                var params = {
                    idproducto: me.producto.data.idproducto,
                    precioanterior: me.producto.data.precio ? me.producto.data.precio : 0,
                    precionuevo: me.tfPrecioNuevo.getValue(),
                    observaciones: me.txtObservaciones.getValue(),
                    cambiarPrecioTPV: 1,
                    cambiarPrecioAlternativo: 1
                };
                me.modelo.adicionarProductos(params, function () {
                    me.close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
        this.tfProducto = new LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.tfCodigoDenom,
            name: 'coddenominacion',
            editable: 'false',
            allowBlank: false,
            disabled: true
        });
        this.tfPrecioAnterior = new LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.tfPrecioAnterior,
            name: 'precioanterior',
            editable: 'false',
            allowBlank: false,
            disabled: true
        });
        /*text del valor nuevo*/
        this.tfPrecioNuevo = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.tfPrecioNuevo,
            decimalPrecision: 2,
            name: 'precionuevo',
            editable: 'false',
            allowBlank: false,
            disabled: false,
            enableKeyEvents: true,
            listeners: {
                keyup: function (num) {
                    if (num.isDirty() && num.isValid() && num.getValue() > 0 && num.getValue() != me.tfPrecioAnterior.getValue()) {
                        me.listaBotones.getItem(2).enable();
                    } else {
                        me.listaBotones.getItem(2).disable();
                    }
                }
            }
        });
        this.txtObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.tfObservaciones,
            name: 'observaciones',
            maxLength: 255,
            anchor: '100%'
        });
        var clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        clsSuperior.addComponent(this.tfProducto);
        clsSuperior.addComponent(this.tfPrecioAnterior);
        clsSuperior.addComponent(this.tfPrecioNuevo.focus(true, 100));
        var fsProducto = new Ext.form.FieldSet({
            items: [clsSuperior]
        });
        this.frmCambiarPrecio = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [fsProducto, this.txtObservaciones]
        });
        this.add(this.frmCambiarPrecio);
        this.filloutFrm();
    },
    filloutFrm: function () {
        this.frmCambiarPrecio.getForm().loadRecord(new Ext.data.Record({
            coddenominacion: this.producto.data.text,
            precioanterior: Ext.util.Format.number(this.producto.data.precio, '0,000.00')
        }));
    }
});

/*ventana del boton reevaluar precio*/

LOG.fac.configuracionpuntoventa.reevaluarPrecio = Ext.extend(LOG.util.Window, {
    listaBotones: undefined,

    constructor: function (config) {
        LOG.util.UIManager.apply(this, config);
        this.width = 500;
        this.height = 170;
        this.resizable = false;
        this.usarAplicar = false;
        LOG.fac.configuracionpuntoventa.reevaluarPrecio.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
    },
    initComponent: function () {
        var me = this;
        LOG.fac.configuracionpuntoventa.reevaluarPrecio.superclass.initComponent.call(this);
        this.setTitle(this.idioma.tlVentanaReevaluarPrecio);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                var params = {
                    idstructure: me.producto.json.idestructura,
                    idproducto: me.producto.data.idproducto,
                    valorporcentual: me.tfvalorporcentual.getValue(),
                    revaluarPrecioTPV: 1,
                    paratodos: me.chkAplicarTodos.getValue(),
                    operacion: me.comboOperacion.getValue()
                };
                me.modelo.adicionarProductos(params, function () {
                    me.close();
                    me._parent.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(this.comboOperacion, 'fireEvent', function (e) {
                    if (e == 'select' || e == 'blur') {
                        if (me.frmCambiarPrecio.getForm().isValid()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'combo');
                LOG.util.UIManager.encadenaFn(this.tfvalorporcentual, 'fireEvent', function (e) {
                    if (e == 'keyup' || e == 'blur') {
                        if (me.frmCambiarPrecio.getForm().isValid()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'number');
            }
        });
        /*checkbox aplicar a todos*/
        this.chkAplicarTodos = new Ext.form.Checkbox({
            name: 'paratodos',
            boxLabel: this.idioma.ckbAplicarTodos,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked === true ? 1 : 0);
                }
            }
        });
        /*combo operaciones */
        this.comboOperacion = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cbOperacion,
            editable: false,
            hiddenName: 'operacion',
            valueField: 'idoperacion',
            displayField: 'operacion',
            allowBlank: false,
            triggerAction: 'all',
            mode: 'local',
            store: new Ext.data.SimpleStore({
                fields: ['idoperacion', 'operacion'],
                data: [
                    [1, 'Suma'],
                    [2, 'Resta']
                ]
            })
        });
        /*text del valor nuevo*/
        this.tfvalorporcentual = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.tfValorPorcentual,
            decimalPrecision: 2,
            name: 'precionuevo',
            allowBlank: false,
            disabled: false,
            enableKeyEvents: true
        });
        var clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        clsSuperior.addComponent(this.chkAplicarTodos);
        clsSuperior.addComponent(this.comboOperacion);
        clsSuperior.addComponent(this.tfvalorporcentual);
        var fsProducto = new Ext.form.FieldSet({
            items: [clsSuperior],
            height: 85
        });
        this.frmCambiarPrecio = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [fsProducto]
        });
        this.add(this.frmCambiarPrecio);
    },
    onShowFn: function () {
        this.listaBotones.getItem(2).controlFn.createDelegate(this, [this.listaBotones.getItem(2)]).call();
    }
});

LOG.fac.configuracionpuntoventa.winInfoConexion = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 950;
        this.height = 450;
        this.resizable = false;
        this.maximized = true;
        this.usarAplicar = false;
        this.selected = config.selected;
        this.idComponent = 'wAddConex';
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        LOG.fac.configuracionpuntoventa.winInfoConexion.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            //disabled: true,
            handler: function () {
                var params = me.getParams(true);
                if (me.comboTipo.isValid() && me.txtfieldUrl.isValid() && me.txtfieldClave.isValid()) {
                    console.info(params);
                    me.modelo.guardarInfoConexion(params, function () {
                        //me.close();
                        me._parent.getStorePrincipal().reload();
                    });
                } else {
                    mostrarMensaje(3, me.idioma.msgcamposVac);
                }
            }
        });
    },
    ventanaAdicionar: function () {
        var me = this;
        var selected = me.selected;
        this.comboTipo = new LOG.util.ComboBox({
            name: 'tipo',
            editable: false,
            displayField: 'denominacion',
            dataIndex: 'denominacion',
            valueField: 'tipo',
            //disabled: true,// (this.action == 'mod') ? true : false,
            fieldLabel: this.idioma.tfTipoCon,
            //autoCargar: true,
            allowBlank: false,
            emptyText: this.idioma.lbTxtSelect,
            autoHeight: true,
            store: new Ext.data.ArrayStore({
                fields: ['tipo', 'denominacion'],
                data: [
                    ['ps', 'Prestashop'],
                    ['oc', 'Opencart'],
                    ['cx', 'Fichero XML'],
                    ['gjt', 'Guajiritos'],
                ]
            }),
            listeners: {
                select: function (campo, value) {
                    campo.setValue(value.data.tipo);
                    /*if (campo.isValid() && me.txtfieldUrl.getValue() != '' && me.txtfieldClave.getValue()) {
                        me.listaBotones.getItem(2).enable();
                    }*/
                },
                render: function (cmb) {
                    cmb.setValue(selected.data.tipo);
                }
            }
        });

        this.txtfieldUrl = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.tfURL,
            anchor: '100%',
            editable: false,
            allowBlank: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.data.url);
                }
            }
        });

        this.txtfieldClave = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.tfClave,
            anchor: '80%',
            editable: false,
            allowBlank: false,
            inputType: 'password',
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.data.clave);
                }
            }
        });

        this.txtfieldNombre = new LOG.util.Prototipos.inputTexto({
            maxLength: 100,
            fieldLabel: this.idioma.tfNombreConex,
            anchor: '100%',
            editable: false,
            allowBlank: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.json.nombreconexion);
                }
            }
        });

        this.txtfieldCodigo = new LOG.util.Prototipos.inputTexto({
            maxLength: 100,
            fieldLabel: 'C\xf3digo',
            anchor: '100%',
            editable: false,
            //allowBlank: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.json.codigotienda);
                }
            }
        });

        this.btnProbarConex = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnProbarConex,
            //disabled: true,
            //height: 30,
            width: 40,
            iconCls: 'derecha',
            tooltip: this.idioma.ttBtnProbarConex,
            handler: function () {
                var params = me.getParams(true);
                me.modelo.guardarInfoConexion(params, function () {
                    me.getStorePrincipal().reload();
                });
            }
        });

        this.txtfieldCK = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.tfCK,
            anchor: '80%',
            editable: false,
            allowBlank: false,
            inputType: 'password',
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.json.consumerkey);
                }
            }
        });
        this.txtfieldCS = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.tfCS,
            anchor: '80%',
            editable: false,
            allowBlank: false,
            inputType: 'password',
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.json.consumersecret);
                }
            }
        });
        this.clsNombreCodigo = LOG.util.UIManager.initColumnForm({
            columnas: 2,

        });
        this.clsNombreCodigo.addComponent(this.txtfieldNombre);
        this.clsNombreCodigo.addComponent(this.txtfieldCodigo);
        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 3,

        });
        this.clsSuperior.addComponent(this.comboTipo);
        this.clsSuperior.addComponent(this.clsNombreCodigo);
        this.clsSuperior.addComponent(this.txtfieldUrl);
        this.clsSuperior.addComponent(this.txtfieldClave);
        this.clsSuperior.addComponent(this.txtfieldCK);
        this.clsSuperior.addComponent(this.txtfieldCS);
        this.pCorrientes = new LOG.fac.configuracionpuntoventa.pGeneral({
            parentCmp: this,
            gpParent: me._parent.getGridPrincipal(),
            parent: me._parent.getGridPrincipal(),
            title: 'Almacen corriente',
            concepto: 'deposito',
            corriente: true,
            idioma: this.idioma
        });
        this.pEntidades = new LOG.fac.configuracionpuntoventa.pGeneral({
            parentCmp: this,
            gpParent: me._parent.getGridPrincipal(),
            parent: me._parent.getGridPrincipal(),
            title: 'Centros de entrega',
            concepto: 'estructura',
            idioma: this.idioma
        });
        this.pDepositos = new LOG.fac.configuracionpuntoventa.pGeneral({
            parentCmp: this,
            gpParent: me.pEntidades.getGridPrincipal(),
            parent: me._parent.getGridPrincipal(),
            title: 'Almacen',
            concepto: 'deposito',
            idioma: this.idioma,
            region: 'center'
        });
        this.pMunicipios = new LOG.fac.configuracionpuntoventa.pGeneral({
            parentCmp: this,
            gpParent: me.pDepositos.getGridPrincipal(),
            parent: me._parent.getGridPrincipal(),
            title: 'Municipios',
            concepto: 'municipio',
            idioma: this.idioma,
            region: 'south',
            height: 100,
            collapsible: true,
            collapsed: true,
            collapseMode: 'mini',
            split: true,
            listeners: {
                expand: function (p) {
                    p.setHeight(me.pEntidades.getHeight() / 2);
                }
            }
        });
        this.fsDatosCaja = new Ext.form.FieldSet({
            items: [this.clsSuperior]
        });
        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'north',
            autoHeight: true,
            items: [this.fsDatosCaja/*,this.btnProbarConex*/]
        });
        this.add(this.pMain);
        this.add({
            xtype: 'panel',
            flex: 1,
            region: 'center',
            layout: 'hbox',
            //autoHeight: true,
            layoutConfig: {
                align: 'stretch'
            },
            items: [me.pCorrientes, me.pEntidades, {
                xtype: 'panel',
                flex: 1,
                layout: 'border',
                items: [me.pDepositos, me.pMunicipios]
            }]
        });
    },
    getParams: function (test) {
        var params = {};
        var me = this;
        var selected = me.selected;
        params.tipo = me.comboTipo.getValue();
        params.url = me.txtfieldUrl.getValue();
        params.clave = me.txtfieldClave.getValue();
        params.nombreconexion = me.txtfieldNombre.getValue();
        params.codigotienda = me.txtfieldCodigo.getValue();
        params.consumerkey = me.txtfieldCK.getValue();
        params.consumersecret = me.txtfieldCS.getValue();
        params.idareaventa = selected.data.idareaventa;
        params.test = test;
        var centrosalmacen = new Array();
        var almacencorriente = new Array();
        var municipios = new Array();
        var modificados = me.pDepositos.getGridPrincipal().getStore().getModifiedRecords();
        var modificadoscorr = me.pCorrientes.getGridPrincipal().getStore().getModifiedRecords();
        var modificadosmun = me.pMunicipios.getGridPrincipal().getStore().getModifiedRecords();
        Ext.each(modificados, function (recd) {
            centrosalmacen.push(recd.data);
        });
        Ext.each(modificadoscorr, function (recd) {
            almacencorriente.push(recd.data);
        });
        Ext.each(modificadosmun, function (recd) {
            municipios.push(recd.data);
        });
        params.almacen = Ext.encode(centrosalmacen);
        params.corriente = Ext.encode(almacencorriente);
        params.municipios = Ext.encode(municipios);
        return params;
    }
});

LOG.fac.configuracionpuntoventa.winInfoConexionCR = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 500;
        this.height = 200;
        this.resizable = false;
        this.usarAplicar = false;
        this.selected = config.selected;
        this.idComponent = 'wAddConexCR';
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        LOG.fac.configuracionpuntoventa.winInfoConexionCR.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            //disabled: true,
            handler: function () {
                var params = me.getParams(true);
                if (me.txtfieldUrl.isValid() && me.txtfieldClave.isValid()) {
                    me.modelo.guardarInfoConexion(params, function () {
                        me.close();
                        me._parent.getStorePrincipal().reload();
                    });
                } else {
                    mostrarMensaje(3, me.idioma.msgcamposVac);
                }
            }
        });
    },
    ventanaAdicionar: function () {
        var me = this;
        var selected = me.selected;

        this.txtfieldUrl = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.tfURL,
            anchor: '100%',
            editable: false,
            allowBlank: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.json.urlapicr);
                }
            }
        });

        this.txtfieldClave = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.tfClave,
            anchor: '80%',
            editable: false,
            allowBlank: false,
            inputType: 'password',
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.json.clavecr);
                }
            }
        });

        this.txtfieldPK = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: 'Clave p\xfablica',
            anchor: '80%',
            editable: false,
            allowBlank: false,
            inputType: 'password',
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.json.keypublic);
                }
            }
        });
        this.txtfieldSK = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: 'Clave secreta',
            anchor: '80%',
            editable: false,
            allowBlank: false,
            inputType: 'password',
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.json.keysecret);
                }
            }
        });
        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 2,

        });
        this.clsSuperior.addComponent(this.txtfieldUrl);
        this.clsSuperior.addComponent(this.txtfieldClave);
        this.clsSuperior.addComponent(this.txtfieldPK);
        this.clsSuperior.addComponent(this.txtfieldSK);

        this.fsDatosApi = new Ext.form.FieldSet({
            items: [this.clsSuperior]
        });
        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            autoHeight: true,
            items: [this.fsDatosApi]
        });
        this.add(this.pMain);
    },
    getParams: function (test) {
        var params = {};
        var me = this;
        var selected = me.selected;
        params.apicr = 1;
        params.url = me.txtfieldUrl.getValue();
        params.clave = me.txtfieldClave.getValue();

        params.keypublic = me.txtfieldPK.getValue();
        params.keysecret = me.txtfieldSK.getValue();
        params.idareaventa = selected.data.idareaventa;

        return params;
    }
});

LOG.fac.configuracionpuntoventa.winDatosContacto = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 400;
        this.height = 435;
        this.resizable = false;
        this.usarAplicar = false;
        this.idComponent = 'wAddContacto';
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        LOG.fac.configuracionpuntoventa.winDatosContacto.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            //disabled: true,
            handler: function () {
                var params = me.getParams();
                Ext.MessageBox.wait(me.idioma.msgEnviandoDatos, me.idioma.msgEspere || '...');
                me.modelo.diasHabiles(params, function () {
                    Ext.MessageBox.hide();
                    me.close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
        /*this.getCajasAsignadas();
        if (this.action === 'mod') {
            this.filloutData();
        }*/
    },
    ventanaAdicionar: function () {
        var me = this;
        var selected = me._parent.getSmPrincipal().getSelected();

        this.txtNombre = new LOG.util.Prototipos.inputTexto({
            maxLength: 100,
            fieldLabel: this.idioma.tfNombre,
            anchor: '100%',
            editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.data.nombretienda);
                }
            }
        });
        this.txtTelefonos = new LOG.util.Prototipos.inputEntero({
            maxLength: 20,
            fieldLabel: this.idioma.tfTelef,
            anchor: '80%',
            //editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.data.telefono);
                }
            }
        });
        this.txtCorreo = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.tfCorreo,
            anchor: '80%',
            //editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.data.correo);
                }
            }
        });

        this.txtDireccion = new Ext.form.TextArea({
            fieldLabel: this.idioma.tfDireccion,
            //anchor: '100% -3',
            enableKeyEvents: true,
            maxLength: '255',
            minLength: '2',
            width: '100%',
            height: 70,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.data.direccion);
                }
            }
        });
        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 1,

        });
        this.clsSuperior.addComponent(this.txtNombre);
        this.clsSuperior.addComponent(this.txtTelefonos);
        this.clsSuperior.addComponent(this.txtCorreo);
        this.clsSuperior.addComponent(this.txtDireccion);
        this.rdVentaResumen = new Ext.form.Radio({
            boxLabel: 'Venta resumen',
            name: 'tipoventa',
            listeners: {
                'check': function (_radio, checked) {
                    if (checked) {
                        Ext.getCmp('ventaresumen').setValue(true);
                    } else {
                        Ext.getCmp('ventaresumen').setValue(false);
                    }
                },
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    if (selected.data.tipoventa == '2') {
                        field.setValue(true);
                    } else {
                        field.setValue(false);
                    }
                }
            }
        });

        this.rdVentaXPedido = new Ext.form.Radio({
            boxLabel: 'Venta por pedido',
            name: 'tipoventa',
            listeners: {
                'check': function (_radio, checked) {
                    if (checked) {
                        Ext.getCmp('ventapedido').setValue(true);
                    } else {
                        Ext.getCmp('ventapedido').setValue(false);
                    }
                },
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    if (selected.data.tipoventa == '1') {
                        field.setValue(true);
                    } else {
                        field.setValue(false);
                    }
                }
            }
        });
        this.frmTipoVenta = LOG.util.UIManager.initColumnForm({
            columnas: 2,
            padding: '0 0 1% 0'
        });
        this.frmTipoVenta.addComponent(this.rdVentaResumen);
        this.frmTipoVenta.addComponent(this.rdVentaXPedido);
        this.fsIntegracion = new Ext.form.FieldSet({
            title: "Integraci\xf3n TPV Externo",
            items: [this.frmTipoVenta, {
                xtype: 'checkbox',
                hidden: true,
                id: 'ventaresumen',
                name: 'ventaresumen'
            }, {
                xtype: 'checkbox',
                hidden: true,
                id: 'ventapedido',
                name: 'ventapedido'
            }]
        });
        this.clsSuperior.addComponent(this.fsIntegracion);
        this.fsDatos = new Ext.form.FieldSet({
            items: [this.clsSuperior]
        });
        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.fsDatos]
        });
        this.add(this.pMain);
    },
    getParams: function () {
        var params = {};
        var me = this;
        var selected = me._parent.getSmPrincipal().getSelected();
        params.adicional = 1;
        params.nombre = me.txtNombre.getValue();
        params.telefono = me.txtTelefonos.getValue();
        params.correo = me.txtCorreo.getValue();
        params.direccion = me.txtDireccion.getValue();
        params.idareaventa = selected.data.idareaventa;
        params.tipoventa = (Ext.getCmp('ventapedido').getValue() ? 1 : (Ext.getCmp('ventaresumen').getValue() ? 2 : 0));
        return params;
    }
});

LOG.fac.configuracionpuntoventa.winConfGeneral = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 400;
        this.height = 350;
        this.resizable = false;
        this.usarAplicar = false;
        this.idComponent = 'wConfGeneral';
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        LOG.fac.configuracionpuntoventa.winConfGeneral.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            //disabled: true,
            handler: function () {
                var params = me.getParams();
                Ext.MessageBox.wait(me.idioma.msgEnviandoDatos, me.idioma.msgEspere || '...');
                me.modelo.diasHabiles(params, function () {
                    Ext.MessageBox.hide();
                    me.close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
        /*this.getCajasAsignadas();
        if (this.action === 'mod') {
            this.filloutData();
        }*/
    },
    ventanaAdicionar: function () {
        var me = this;
        var selected = me._parent.getSmPrincipal().getSelected();

        this.chxDatosPersonales = new Ext.form.Checkbox({
            name: 'datospersonales',
            style: 'margin-left: 0px; margin-top:-15px',
            boxLabel: 'Datos personales obligatorios'//this.idioma.lbChxPagoAnticipado
        });

        this.chxNoCierre = new Ext.form.Checkbox({
            name: 'datospersonales',
            style: 'margin-left: 0px; margin-top:-15px',
            boxLabel: 'No realizar cierre diario'//this.idioma.lbChxPagoAnticipado
        });

        this.rdFactura = new Ext.form.Radio({
            boxLabel: 'Factura',
            name: 'Factura',
            value: 0
        });
        this.rdValeventa = new Ext.form.Radio({
            boxLabel: 'Vale de venta',
            name: 'valeventa',
            value: 1
        });
        this.rdnoImprimir = new Ext.form.Radio({
            boxLabel: 'No imprimir',
            name: 'noimprimir',
            value: 2
        });

        this.opcionesImprimir = new Ext.form.RadioGroup({
            name: 'opcionesImprimir',
            columns: 1,
            style: 'margin:0px 0px 0px 0px',
            items: [this.rdFactura, this.rdValeventa, this.rdnoImprimir]
        });

        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 1,
        });
        this.clsInferior = LOG.util.UIManager.initColumnForm({
            columnas: 1,
        });
        this.clsSuperior.addComponent(this.chxDatosPersonales);
        this.clsInferior.addComponent(this.opcionesImprimir);
        this.fsDatos = new Ext.form.FieldSet({
            title: 'Opciones',
            style: '-moz-border-radius:5px',
            items: [this.clsSuperior]
        });
        this.fsImprimir = new Ext.form.FieldSet({
            title: 'Imprimir',
            style: '-moz-border-radius:5px',
            items: [this.clsInferior]
        });
        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.fsDatos, this.fsImprimir]
        });
        this.add(this.pMain);
    },
    getParams: function () {
        var params = {};
        var me = this;
        var selected = me._parent.getSmPrincipal().getSelected();
        params.adicional = 1;
        params.nombre = me.txtNombre.getValue();
        params.telefono = me.txtTelefonos.getValue();
        params.correo = me.txtCorreo.getValue();
        params.direccion = me.txtDireccion.getValue();
        params.idareaventa = selected.data.idareaventa;
        return params;
    }
});

LOG.fac.configuracionpuntoventa.winAddNaturalezaPadre = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 400;
        this.height = 300;
        this.idComponent = 'wAddNatPadre';
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        LOG.fac.configuracionpuntoventa.winAddNaturalezaPadre.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            //disabled: true,
            handler: function () {
                var params = me.getParams(true);
                me.modelo.salvarNaturalezas(params, function (r) {
                    //console.info(me._parent.storeOeste);
                    me._parent.storeOeste.reload();
                });
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            //disabled: true,
            handler: function () {
                var params = me.getParams(true);
                me.modelo.salvarNaturalezas(params, function (r) {
                    me.close();
                    //console.info(me._parent.storeOeste);
                    me._parent.storeOeste.reload();
                    //me._parent.getStorePrincipal().reload();
                });
            }
        });
        /*this.getCajasAsignadas();
        if (this.action === 'mod') {
            this.filloutData();
        }*/
    },
    getParams: function (test) {
        var params = {};
        var me = this;
        /*if (this.action == 'add') {
            if (this.comboCaja.isValid()) {
                params.idtipocaja = this.comboCaja.getValue();
            }
            if (this.comboArea.isValid()) {
                params.idareaventa = this.comboArea.getValue();
            }
            if (this.pRelacionar.adicionados.length > 0) {
                params.idusuarios = this.pRelacionar.adicionados;
            }
        } else {*/
        //var selected = me._parent.getSmPrincipal().getSelected();
        //params.action = 'mod';
        params.denominacion = me.txtfieldDenom.getValue();
        params.descripcion = me.txtfieldDescrip.getValue();

        //}
        return params;
    },
    ventanaAdicionar: function () {
        var me = this;

        this.txtfieldDenom = new LOG.util.Prototipos.inputTexto({
            maxLength: 100,
            fieldLabel: this.idioma.tfDenominacion,
            anchor: '100%',
            name: 'denominacion',
            //editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                }
            }
        });
        this.txtfieldDescrip = new Ext.form.TextArea({
            maxLength: 255,
            fieldLabel: this.idioma.tfDescripcionn,
            anchor: '100%',
            name: 'descripcion',
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                }
            }
        });
        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 1,

        });
        this.clsSuperior.addComponent(this.txtfieldDenom);
        this.clsSuperior.addComponent(this.txtfieldDescrip);
        this.fsDatos = new Ext.form.FieldSet({
            anchor: '100%',
            items: [this.clsSuperior]
        });
        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.fsDatos]
        });
        this.add(this.pMain);
    }
});

LOG.fac.configuracionpuntoventa.winAdicionarNaturaleza = Ext.extend(LOG.util.UITemplate, {
    //doAction: false,
    constructor: function (config) {
        LOG.util.UIManager.apply(this, config);
        var me = this;
        this.idpadre = me._parent.smGridOeste.selections.keys[0];
        this.busquedaBasica = true;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa';
        this.urlBusquedaGridPrincipal = 'cargarNaturaleza';
        this.modoSeleccion = 3;
        this.formaVisualizacion = 'ventana';
        this.idComponent = 'wAddNat';
        this.concepto = config.idioma.ttBtnBuscarArea;
        this.autoSelect = false;
        this.baseParams = {idpadreAdd: this.idpadre};
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacionArea;
        LOG.fac.configuracionpuntoventa.winAdicionarNaturaleza.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: config.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        this.getVistaPrincipal().title = this.idioma.tlVentanaAdicionarnaturaleza;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idnaturaleza',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.lbCodigoDenom,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
    },
    initDefaultButtons: function () {
        var me = this;
        //this.getVistaPrincipal().listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(1), {
            disabled: true,
            handler: function () {
                var sm = me.smGridPrincipal.selections.items;
                var _arrNaturalezas = [];
                Ext.each(sm, function (rec) {
                    _arrNaturalezas.push({
                        idnaturaleza: rec.data.idnaturaleza
                    });
                });
                var params = {
                    datos: Ext.encode(_arrNaturalezas),
                    idpadre: Ext.encode(me.idpadre)
                };
                me.modelo.salvarNaturalezas(params, function (r) {
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                var sm = me.smGridPrincipal.selections.items;
                var _arrNaturalezas = [];
                Ext.each(sm, function (rec) {
                    _arrNaturalezas.push({
                        idnaturaleza: rec.data.idnaturaleza
                    });
                });
                var params = {
                    datos: Ext.encode(_arrNaturalezas),
                    idpadre: Ext.encode(me.idpadre)
                };
                me.modelo.salvarNaturalezas(params, function (r) {
                    me.getVistaPrincipal().close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
    },
    render: function () {
        var me = this;
        var vista = LOG.fac.configuracionpuntoventa.winAdicionarNaturaleza.superclass.render.call(this);
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function (e) {
            if (this.getCount() > 0) {
                me.getVistaPrincipal().listaBotones.getItem(2).enable();
                me.getVistaPrincipal().listaBotones.getItem(1).enable();
            } else {
                me.getVistaPrincipal().listaBotones.getItem(2).disable();
                me.getVistaPrincipal().listaBotones.getItem(2).disable();
            }
        }, 'CNTRLBTN');
        return vista;
    }
});

LOG.fac.configuracionpuntoventa.Naturaleza = Ext.extend(LOG.util.UITemplate, {

    constructor: function (config) {
        var me = this;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa',
            this.urlBusquedaGridPrincipal = 'cargarListadoNaturaleza',
            this.formaVisualizacion = 'panel',
            this.busquedaBasica = true,
            this.autoLoad = false,
            this.idGridPrincipal = "idnaturaleza";
        this.modoSeleccion = 2,
            this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacionProd;
        LOG.fac.configuracionpuntoventa.Naturaleza.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: this.dirController + '/'
        });
        this._parent.on('tabchange', function (tb, p) {
            if (p.idComponent == '2') {
                me.getStorePrincipal().load({
                    params: {
                        onlyadd: true
                    }
                });
                me.storeOeste.load({
                    params: {
                        agrupacion: 1
                    }
                });
            }
        });
    },
    createPanelOeste: function () {
        var _this = this;

        var columnas = new LOG.util.List();

        columnas.add({
            dataIndex: 'idnaturalezaagrupacion',
            default: true
        });
        columnas.add({
            dataIndex: 'idnaturaleza',
            default: true
        });
        columnas.add({
            header: this.idioma.tfEstado,
            width: 60,
            align: 'center',
            dataIndex: 'activo',
            default: true,
            renderer: function (value, metaData) {
                metaData.css = (value == 1) ? 'icondistra-usarentidad verde' : 'icondistra-usarentidad rojo';
                metaData.attr = (value == 1) ? 'ext:qtip="Si"' : 'ext:qtip=" NO"';
                ;
            }
        });
        columnas.add({
            header: _this.idioma.tfDenominacion,
            dataIndex: 'denominacion',
            default: true,
            width: 120,
            id: 'idExpandGrid'
        });

        columnas.add({
            header: this.idioma.tfSync,
            width: 80,
            dataIndex: 'enviado',
            align: 'center',
            default: true,
            renderer: function (value, metaData) {
                metaData.css = (value == 1) ? 'icondistra-aceptar verde' : 'icondistra-aceptar rojo';
                metaData.attr = (value == 1) ? 'ext:qtip="Si"' : 'ext:qtip=" NO"';
                ;
            }
        });

        /*columnas.add({
            header: '_this.idioma.cgUM',
            width: 50,
            dataIndex: 'umedida',
            default: true
        });*/

        this.smGridOeste = LOG.util.UIManager.initSelectionModel(1, true);

        var cls = LOG.util.UIManager.proccessColumns(columnas, null);
        this.cmGridOeste = new Ext.grid.ColumnModel(cls.columns);

        var recStGridOeste = Ext.data.Record.create(cls.fields);
        this.storeOeste = new Ext.data.Store({
            //autoLoad: true,
            url: 'cargarListadoNaturaleza',
            reader: new Ext.data.JsonReader({
                id: "idnaturalezaagrupacion",
                root: "datos"
            }, recStGridOeste),
            listeners: {
                beforeload: function (st) {
                    st.initBaseParams.agrupacion = 1;
                },
                load: function (st) {

                }
            }
        });

        this.gpOeste = LOG.util.UIManager.initEditableGridPanel(this.cmGridOeste, this.storeOeste, this.smGridOeste, {
            nobbar: false,
            expanded: true,
            autoExpandColumn: 'idExpandGrid'
        });
        this.panelOeste = LOG.util.UIManager.initPanel({
            region: 'west',
            layout: 'border',
            collapsible: true,
            collapseMode: 'mini',
            //collapsed: true,
            width: 280,
            title: this.idioma.tlAgrupaciones,
            split: true/*,
            listeners: {
                expand: function(p) {
                    p.setWidth(_this.getPanelGrid().getSize().width / 2);
                }
            }*/
        });
        this.btnHabilitarAgrupacion = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnHabilitar,
            disabled: true,
            iconCls: 'habilitar',
            tooltip: this.idioma.ttBtnHabilitarNat,
            handler: function () {
                var params = {
                    datos: _this.getDatosAgr(),
                    activo: 1,
                    idareaventa: _this.cmbArea.getValue()
                };
                _this.modelo.activacionAgrupacion(params, function () {
                    _this.storeOeste.reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(_this.smGridOeste, 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (_this.smGridOeste.getCount() == 1 && _this.smGridOeste.getSelected().data.activo == 0 && _this.cmbArea.getValue() != '') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'HABILITARBTNPT');
            }
        });
        this.btnDeshabilitarAgrupacion = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnDeshabilitar,
            disabled: true,
            iconCls: 'deshabilitar',
            tooltip: this.idioma.ttBtnDeshabilitarNat,
            handler: function () {
                var params = {
                    datos: _this.getDatosAgr(),
                    activo: 0,
                    idareaventa: _this.cmbArea.getValue()
                };
                _this.modelo.activacionAgrupacion(params, function () {
                    _this.storeOeste.reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(_this.smGridOeste, 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (_this.smGridOeste.getCount() == 1 && _this.smGridOeste.getSelected().data.activo == 1 && _this.cmbArea.getValue() != '') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'DESHABILITARBTNPT');
            }
        });
        this.gpOeste.getTopToolbar().add([this.btnHabilitarAgrupacion, this.btnDeshabilitarAgrupacion]);
        this.panelOeste.add(this.gpOeste);
        this.getPanelPrincipal().add(this.panelOeste);
        this.btnHabilitarAgrupacion.controlFn.createDelegate(this, [this.btnHabilitarAgrupacion]).call();
        this.btnDeshabilitarAgrupacion.controlFn.createDelegate(this, [this.btnDeshabilitarAgrupacion]).call();
        /*this.getVistaPrincipal().on('afterlayout', function(pn){
            _this.panelOeste.expand();
        });*/
    },
    createPanelEste: function () {
        var _this = this;
        this.cmbTiempo = new LOG.util.ComboBox({
            fieldLabel: 'Limite de venta',
            url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomenclador',
            valueField: 'idtiempo',
            name: 'tiempogarantia',
            mode: 'remote',
            autoLoad: true,
            displayField: 'denominacion',
            mode: 'remote',
            autoLoad: true
        });
        this.cmbTiempo.store.on({
            beforeload: function (st, obj) {
                obj.params.modelo = 'NomTiempo';
                obj.params.idnom = 'idtiempo';
            }
        });
        this.nfCantidad = new Ext.form.NumberField({
            fieldLabel: 'Cantidad',
            anchor: '50%'

        });

        this.cmbTiempoGarantia = new LOG.util.ComboBox({
            fieldLabel: 'Tiempo',
            autoLoad: true,
            url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomenclador',
            displayField: 'denominacion',
            valueField: 'idtiempo',
            name: 'tiempogarantia',
            mode: 'remote'

        });
        this.cmbTiempoGarantia.store.on({
            beforeload: function (st, obj) {
                obj.params.modelo = 'NomTiempo';
                obj.params.idnom = 'idtiempo';
            }
        });
        this.formEste = new LOG.util.ColumnForm({columnas: 1});
        this.fsT = new Ext.form.FieldSet({
            title: 'Cantidad l\xedmite de venta',
            items: [this.cmbTiempo, this.nfCantidad]
        })
        this.fsT.add({
            layout: 'form',
            labelAlign: 'top',
            padding: '0.5% 0 0 1%',
            items: this.cmbTiempo
        });
        this.fsT.add({
            layout: 'form',
            labelAlign: 'top',
            padding: '0.5% 0 0 1%',
            items: this.nfCantidad
        });
        this.formEste.addComponent(this.fsT);
        this.fsTG = new Ext.form.FieldSet({
            title: 'Tiempo de garantía'


        });
        this.fsTG.add({
            layout: 'form',
            labelAlign: 'top',
            padding: '0.5% 0 0 1%',
            items: this.cmbTiempoGarantia
        });

        this.formEste.addComponent(this.fsTG);
        this.btnSalvar = new Ext.Button({
            text: 'Guardar',
            tooltip: 'Guardar',
            iconCls: 'aceptar',
            iconAlign: "left",
            // disabled : true
        });

        this.btnEliminar = new Ext.Button({
            text: 'Eliminar',
            tooltip: 'Eliminar',
            iconCls: 'eliminar',
            iconAlign: "left",
            // disabled : true
        });

        this.btnSalvar.on({
            'click': function () {
                if (_this.cmbTiempoGarantia.getValue() != '' || (_this.cmbTiempo.getValue() != '' && _this.nfCantidad.getValue() != '')
                ) {
                    mostrarMensaje(2, "Esta seguro que desea guardar lo(s) tiempo(s) ", function (btn) {
                        if (btn == 'ok') {
                            let params = {}
                            params = {
                                idnaturaleza: _this.getDatos(),
                                idtiempo: _this.cmbTiempo.getValue(),
                                cantidaddiaslimventa: _this.nfCantidad.getValue(),
                                idtiempogarantia: _this.cmbTiempoGarantia.getValue()

                            }
                            _this.modelo.guardarTiempos(params);

                        }
                    });

                } else {
                    mostrarMensaje(3, 'Existen campo(s) vacio(s)');
                }


            }
        });
        this.btnEliminar.on({
            'click': function () {
                if (_this.cmbTiempoGarantia.getValue() != '' || (_this.cmbTiempo.getValue() != '' && _this.nfCantidad.getValue() != '')
                ) {
                    mostrarMensaje(2, "Esta seguro que desea eliminar lo(s) tiempo(s) y cantidade(s)", function (btn) {
                        if (btn == 'ok') {
                            let params = {}
                            params = {
                                idnaturaleza: _this.getDatos(),
                                idtiempo: _this.cmbTiempo.getValue(),
                                cantidaddiaslimventa: _this.nfCantidad.getValue(),
                                idtiempogarantia: _this.cmbTiempoGarantia.getValue()

                            }
                            _this.modelo.eliminarTiempos(params);
                        }
                    });


                } else {
                    mostrarMensaje(3, 'Existen campo(s) vacio(s)');
                }


            }
        });
        this.columnaCombos = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.columnaCombos.addComponent(this.btnEliminar);
        this.columnaCombos.addComponent(this.btnSalvar);
        this.formEste.addComponent(this.columnaCombos);


        _this.panelEste = new LOG.util.UIManager.initPanel({
            region: 'east',
            border: false,
            layout: 'form',
            frame: true,
            width: 250,
            title: "Limites",
            collapsible: true,
            collapseMode: 'mini',
            items: _this.formEste,
            split: true
        });
        this.getPanelPrincipal().add(this.panelEste);
    },
    init: function () {
        var me = this;
        LOG.fac.configuracionpuntoventa.Naturaleza.superclass.init.call(this);
        this.createPanelOeste();
        this.createPanelEste();
        this.cmbArea = new LOG.util.ComboBox({
            //autoLoad: true,
            name: 'idareaventa',
            url: 'cargarAreas',
            valueField: 'idareaventa',
            displayField: 'coddenominacion',
            width: 350,
            anchor: '90%',
            listWidth: 350,
            //pageSize: 10,
            //mode: 'remote',
            allowBlank: true,
            editable: false,
            listeners: {
                expand: function () {
                    this.store.reload();
                },
                select: function (combo, record, index) {
                    me.getPanelGrid().enable();
                    me.datosConf = record.json;
                    //me.listaBotones.getItem(4).enable();
                    me.storeOeste.initBaseParams.idareaventa = combo.getValue();
                    me.storeOeste.baseParams.idareaventa = combo.getValue();
                    me.storeOeste.initBaseParams.agrupacion = 1;
                    me.storeOeste.baseParams.agrupacion = 1;
                    me.storeOeste.load();
                    me.storeOeste.load();
                    me.getStorePrincipal().load({
                        params: {
                            idareaventa: combo.getValue(),
                            idpadre: me.smGridOeste.selections.keys[0]
                        }
                    });
                },
                chamge: function () {
                    me.getPanelGrid().enable();
                    //me.listaBotones.getItem(4).enable();
                    me.getStorePrincipal().load({
                        params: {
                            idareaventa: combo.getValue(),
                            idpadre: me.smGridOeste.selections.keys[0]
                        }
                    });
                }
            }
        });
        this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: ['->', '-', this.idioma.tfArea + ':', this.cmbArea]
        }));
        LOG.util.UIManager.apply(this.getPanelSuperior(), {
            width: 10
        });
    },
    view: function () {
        //this.getPanelGrid().disable();
        return LOG.fac.configuracionpuntoventa.Naturaleza.superclass.view.call(this);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.tfEstado,
            width: 60,
            align: 'center',
            dataIndex: 'activo',
            default: true,
            renderer: function (value, metaData) {
                metaData.css = (value == 1) ? 'icondistra-usarentidad verde' : 'icondistra-usarentidad rojo';
                metaData.attr = (value == 1) ? 'ext:qtip="Si"' : 'ext:qtip=" NO"';
                ;
            }
        });
        this.addGridColumn({
            header: this.idioma.tfCodigoDenom,
            width: 150,
            dataIndex: 'denominacion',
            //autoExpand: true,
            default: true
        });
        //aqui voy a concatenar la cantidad con el tiempo
        this.addGridColumn({
            header: this.idioma.tfCantLimite,
            width: 240,
            dataIndex: 'limventa',
            default: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                let alltiempo = store.reader.jsonData.tiempos;
                let idnaturaleza = record.json.idnaturaleza;
                value = "Sin Limite";

                for (let index = 0; index < alltiempo.length; index++) {
                    const element = alltiempo[index];
                    if (element['idnaturaleza'] == idnaturaleza && element['limventa'] != null) {
                        value = element['limventa'].replace('-', ' en ');
                    }

                }
                return value;
            }

        });
        this.addGridColumn({
            header: this.idioma.tfTGarantia,
            width: 200,
            dataIndex: 'idtiempogarantia',
            default: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                let alltiempo = store.reader.jsonData.tiempos;
                let alldenominaciontiempo = store.reader.jsonData.denominacionTiempos;
                let idnaturaleza = record.json.idnaturaleza;
                let idtiempogarantia;
                value = 'Sin Garantia';
                for (let index = 0; index < alldenominaciontiempo.length; index++) {
                    const element = alldenominaciontiempo[index];
                    if (element['idnaturaleza'] == idnaturaleza) {
                        value = element['denominacion'];
                    }
                }
                return value;
            }
        });

        this.addGridColumn({
            header: this.idioma.tfSync,
            width: 80,
            dataIndex: 'enviado',
            align: 'center',
            default: true,
            renderer: function (value, metaData) {
                metaData.css = (value == 1) ? 'icondistra-aceptar verde' : 'icondistra-aceptar rojo';
                metaData.attr = (value == 1) ? 'ext:qtip="Si"' : 'ext:qtip=" NO"';
                ;
            }
        });

        this.addGridColumn({dataIndex: 'idnaturaleza'});
    },
    initDefaultButtons: function () {
        var me = this;
        //boton registro de entrada
        // if (existeInv === 0) {
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            idioma: this.idioma,
            tooltip: this.idioma.ttBtnAdicionarNat,
            handler: function () {
                if (me.smGridOeste.selections.length > 0) {
                    this.winAdicionarNaturaleza = new LOG.fac.configuracionpuntoventa.winAdicionarNaturaleza({
                        idioma: me.idioma,
                        _parent: me
                    });
                    this.winAdicionarNaturaleza.init();
                    this.winAdicionarNaturaleza.view();
                } else {
                    this.winAddNaturalezaPadre = new LOG.fac.configuracionpuntoventa.winAddNaturalezaPadre({
                        idioma: this.idioma,
                        title: this.idioma.tlVentanaAdicionarnaturaleza,
                        _parent: me
                    });
                    this.winAddNaturalezaPadre.show();
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            idioma: this.idioma,
            tooltip: this.idioma.ttBtnEliminarnat,
            disabled: true,
            handler: function () {
                var params = {
                    datos: me.getDatos(),
                    idareaventa: me.cmbArea.getValue(),
                    idpadre: me.smGridOeste.selections.keys[0]
                };
                me.modelo.eliminarNaturalezas(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 0) {
                            b.enable();
                        } else if (this.getCount() > 1) {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'ELIMINARAREAPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnHabilitar,
            disabled: true,
            iconCls: 'habilitar',
            tooltip: this.idioma.ttBtnHabilitarNat,
            handler: function () {
                var params = {
                    datos: me.getDatos(),
                    activo: 1,
                    idareaventa: me.cmbArea.getValue()
                };
                me.modelo.activacionNaturaleza(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 0 && me.cmbArea.getValue() != '') {
                            b.enable();
                        } else if (this.getCount() > 1 && me.cmbArea.getValue() != '') {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 1) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'HABILITARBTNPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnDeshabilitar,
            disabled: true,
            iconCls: 'deshabilitar',
            tooltip: this.idioma.ttBtnDeshabilitarNat,
            handler: function () {
                var params = {
                    datos: me.getDatos(),
                    activo: 0,
                    idareaventa: me.cmbArea.getValue()
                };

                me.modelo.activacionNaturaleza(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (this.getCount() == 1 && this.getSelected().data.activo == 1 && me.cmbArea.getValue() != '') {
                            b.enable();
                        } else if (this.getCount() > 1 && me.cmbArea.getValue() != '') {
                            var deshabilitar = false;
                            Ext.each(this.getSelections(), function (caja) {
                                if (caja.data.activo == 0) {
                                    deshabilitar = true;
                                    return;
                                }
                            });
                            b.setDisabled(deshabilitar);
                        } else {
                            b.disable();
                        }
                    }
                }, 'DESHABILITARBTNPT');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnSincronizar,
            disabled: true,
            iconCls: 'sincronizar',
            tooltip: this.idioma.ttBtnSincronizarNat,
            handler: function () {
                var params = {
                    idareaventa: me.cmbArea.getValue(),
                    typesync: (me.datosConf.cr == 1) ? 11 : 1
                };

                me.modelo.sincronizarDatos(params, function () {
                    me.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'selectionchange') {
                        if (me.cmbArea.getValue() != '' && (me.datosConf.tiendavirtual == 1 || me.datosConf.cr == 1)) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARNAT');
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({id: 'idconfproducto'}));
    },
    getDatos: function () {
        var selections = this.getSmPrincipal().getSelections(), idnaturaleza = [];
        for (var i = 0; i < selections.length; i++) {
            idnaturaleza.push({
                idnaturaleza: selections[i].data.idnaturaleza
            });
        }
        return Ext.encode(idnaturaleza);
    },
    getDatosAgr: function () {
        var selections = this.smGridOeste.getSelections(), idagrupacion = [];
        for (var i = 0; i < selections.length; i++) {
            idagrupacion.push({
                idagrupacion: selections[i].data.idnaturalezaagrupacion
            });
        }
        return Ext.encode(idagrupacion);
    },
    render: function () {
        var p = LOG.fac.configuracionpuntoventa.Naturaleza.superclass.render.call(this), me = this;
        this.smGridOeste.on({
            rowselect: function (sm, index, record) {
                me.getPanelGrid().enable();
                me.getStorePrincipal().load({
                    params: {
                        idareaventa: me.cmbArea.getValue(),
                        idpadre: record.id
                    }
                });
            },
            rowdeselect: function (sm, index, record) {
                me.getStorePrincipal().load({
                    params: {
                        idareaventa: me.cmbArea.getValue(),
                        idpadre: ""
                    }
                });
            }
        });
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
            if (e === 'beforeload') {
                this.initBaseParams.onlyadd = 1;
                this.initBaseParams.idareaventa = me.cmbArea.getValue();
                this.initBaseParams.idpadre = me.smGridOeste.selections.keys[0];
                // this.initBaseParams.prodareas = 1;
                // this.baseParams.prodareas = 1;
                /* if (existeInv === 0) {
                     this.initBaseParams.prodareas = 1;
                     this.baseParams.prodareas = 1;
                 }*/
            }
            if (e == 'load') {
                if (this.getCount() == 0) {
                    mostrarMensaje(1, me.idioma.msgNoMostrarResultados);
                }
            }
        });
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function (e) {
            if (e == "rowselect") {
                let store = new Ext.data.Store({
                    autoLoad: true,
                    url: 'cargarTiemposCantidads',
                    reader: new Ext.data.JsonReader({
                        root: 'datos'
                    }, [
                        {name: 'idtiempogarantia'},
                        {name: 'cantidaddiaslimventa'},
                        {name: 'idtiempo'}
                    ]),
                    listeners: {
                        'beforeload': function (st, records) {
                            st.baseParams.idnaturaleza = me.smGridPrincipal.selections.items[0].json.idnaturaleza;
                            var msg;
                            msg = "Cargando tiempos y cantidades";
                            Ext.MessageBox.wait(msg, 'Espere' || '...');

                        },
                        'load': function (st, records) {
                            Ext.MessageBox.hide();
                            if (records.length > 0) {

                                me.cmbTiempo.setValue(records[0].data.idtiempogarantia);
                                me.nfCantidad.setValue(records[0].data.cantidaddiaslimventa);
                                me.cmbTiempoGarantia.setValue(records[0].data.idtiempo);
                            } else {
                                me.cmbTiempo.setValue('');
                                me.nfCantidad.setValue('');
                                me.cmbTiempoGarantia.setValue('');
                            }
                            if (me.cmbTiempo.getValue() != '' && me.nfCantidad.getValue() != ''
                                && me.cmbTiempoGarantia != '') {

                            }


                        }
                    }
                });


            }
        });

        return p;
    }

});

LOG.fac.configuracionpuntoventa.pGeneral = Ext.extend(LOG.util.Panel, {
    constructor: function (config) {
        this.idioma = config.idioma;
        var _this = this;
        this.parent = config.parent;
        this.gpParent = config.gpParent;
        this.flex = 1;
        this.layout = 'border';
        this.margins = '0 1 0 1';
        this.concepto = config.concepto;
        this.corriente = config.corriente || null;
        this.util = config.util;
        config.items = [this.createGdCenter()];

        LOG.fac.configuracionpuntoventa.pGeneral.superclass.constructor.call(this, config);
        if ((this.concepto == 'deposito' && !this.corriente) || this.concepto == 'municipio') {
            this.gpParent.getSelectionModel().fireEvent = this.gpParent.getSelectionModel().fireEvent.createSequence(function (e) {
                if (e == 'selectionchange' && _this.gpParent.getSelectionModel().getSelections().length == 1) {
                    _this.stConcepto.load();
                    if (_this.concepto == 'municipio') {
                        _this.expand();
                    }
                }
            });
        }
    },
    getGridPrincipal: function () {
        return this.gConcepto;
    },
    createGdCenter: function () {
        var _this = this;
        /*this.btnAdd = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.btnAdicionarPI, tooltip: 'Adicionar '+me.concepto,
            disabled: true,
            handler: function() {
                var ventanaConcepto = new Fact.conf.addConceptos({
                    //idclientesproveedores: Ext.encode(idclientes),
                    concepto: me.concepto,
                    util: me.util,
                    idioma: me.idioma,
                    gpParent: me.gpParent,
                    urlBusquedaGridPrincipal: 'cargarConcepto'
                });
                ventanaConcepto.init();

                ventanaConcepto.getVistaPrincipal().title = me.util.titleadd;
                ventanaConcepto.view();
                ventanaConcepto.getGridPrincipal().store.load();
                var botonAceptar = ventanaConcepto.getVistaPrincipal().listaBotones.getItem(2);
                var botonAplicar = ventanaConcepto.getVistaPrincipal().listaBotones.getItem(1);
                botonAceptar.handler = botonAplicar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaConcepto.getGridPrincipal().getSelectionModel().getSelections();
                    var ids = Array();
                    Ext.each(records, function(r){
                        ids.push(r.data['id'+me.concepto]);
                    });
                    Ext.Ajax.request({
                        url: me.idioma.urlConffacturacion + 'actionsConcepto',
                        method: 'POST',
                        params: {
                            ids: Ext.encode(ids),
                            util: Ext.encode(me.util),
                            actions: 'add',
                            idconcepto: 'id'+me.concepto,
                            idreporteventa: me.gpParent.getSelectionModel().getSelected().data.idreporteventa
                        },
                        callback: function(o, s, r) {
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success) {
                                mostrarMensaje(1, me.action === 'mod' ? 'Los datos han sido modificados satisfactoriamente' : 'Los datos han sido guardados satisfactoriamente');
                                ventanaConcepto.getGridPrincipal().getStore().reload();
                                me.stConcepto.reload();
                            } else {
                                mostrarMensaje(1, me.action === 'mod' ? 'Los datos no fueron guardados' : 'Los datos no fueron guardados');
                            }
                        }
                    });
                });
            },
            controlFn: function(b, cl){
                me.gpParent.getSelectionModel().fireEvent = me.gpParent.getSelectionModel().fireEvent.createSequence(function (e) {
                    b.disable();
                    if (me.gpParent.getSelectionModel().getSelections().length == 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                    if(e == 'selectionchange' && me.gpParent.getSelectionModel().getSelections().length == 1){
                        me.stConcepto.load();
                    }
                });
            }
        });*/

        this.smConcepto = LOG.util.UIManager.initSelectionModel(1);

        this.stConcepto = new Ext.data.Store({
            url: 'cargarConcepto',
            autoLoad: (_this.concepto == 'estructura' || _this.corriente ? true : false),
            reader: new Ext.data.JsonReader({
                id: 'id' + _this.concepto,
                root: 'datos', totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'id' + _this.concepto
                    },
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'activo'
                    },
                    {
                        name: 'otradenominacion'
                    }
                ]
            }),
            listeners: {
                'beforeload': function (st, opts) {
                    st.initBaseParams.concepto = _this.concepto;
                    if (_this.concepto != 'municipio')
                        st.initBaseParams.limit = _this.gConcepto.getBottomToolbar().cbPageSize.getValue();
                    st.initBaseParams.idareaventa = _this.parent.getSelectionModel().getSelected().data.idareaventa;
                    if (_this.concepto == 'deposito' && !_this.corriente) {
                        st.initBaseParams.idestructura = _this.gpParent.getSelectionModel().getSelected().data.idestructura || null;
                    }
                    if (_this.concepto == 'deposito' && _this.corriente) {
                        st.initBaseParams.idestructura = -1;
                    }
                    if (_this.concepto == 'municipio') {
                        st.initBaseParams.iddeposito = _this.gpParent.getSelectionModel().getSelected().data.iddeposito || null;
                    }

                },
                'load': function (thisstore, objeto) {
                    //Ext.getBody().unmask();
                }
            }
        });

        var storeCMBActivo = new Ext.data.SimpleStore({
            fields: ['activo', 'texto'],
            data: [[-1, 'No'], [1, 'Si']]
        });
        var cmbActivo = new Ext.form.ComboBox({
            store: storeCMBActivo,
            displayField: 'texto',
            valueField: 'activo',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'activo'
        });

        this.cmConcepto = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({header: 'N.\xb0'}),
            {
                sortable: true,
                dataIndex: 'otradenominacion',
                header: 'Provincia',
                hidden: (_this.concepto != 'municipio') ? true : false,
                filter: {
                    type: 'combo',
                    url: 'obtenerProvincias',
                    valueField: 'otradenominacion',
                    displayField: 'otradenominacion',
                    dataIndex: 'otradenominacion',
                }

            }, {
                dataIndex: 'denominacion',
                header: this.idioma.tfDenominacion,
                sortable: true,
                width: 120,
                id: 'denominacion'
            }, {
                header: 'Activo',
                dataIndex: 'texto',
                width: 80,
                editor: _this.concepto == 'deposito' || _this.concepto == 'municipio' ? cmbActivo : null,
                filter: {
                    type: 'combo',
                    store: new Ext.data.SimpleStore({
                        fields: ['activo', 'texto'],
                        data: [['-1', 'No'], ['1', 'Si']]
                    }),
                    valueField: 'activo',
                    displayField: 'texto',
                    dataIndex: 'texto',
                },
                renderer: function (v, m, rd) {
                    if (v) {
                        if (this.editor.isDirty()) {
                            rd.set('activo', this.editor.getValue());
                            if (_this.concepto == 'deposito') {
                                rd.set('idcentroentrega', _this.gpParent.getSelectionModel().getSelected().data.idestructura);
                            } else {
                                rd.set('idcentroentrega', null);
                            }
                            if (_this.concepto == 'municipio') {
                                rd.set('idestructura', _this.gpParent.getSelectionModel().getSelected().data.iddeposito);
                            } else {
                                rd.set('idestructura', null);
                            }
                            if (v == 1)
                                m.css = 'icondistra-aceptar verde';
                            else
                                m.css = 'icondistra-aceptar rojo';
                            //return (v == 1) ? 'Si' : 'No';
                        }
                    }
                    if (rd.data.activo == 1)
                        m.css = (_this.concepto == 'deposito' || _this.concepto == 'municipio') ? 'icondistra-aceptar verde' : 'icondistra-usarentidad verde';
                    else
                        m.css = (_this.concepto == 'deposito' || _this.concepto == 'municipio') ? 'icondistra-aceptar rojo' : 'icondistra-usarentidad rojo';
                }
            }, {
                dataIndex: 'activo',
                hidden: true
            }, {
                dataIndex: 'idcentroentrega',
                hidden: true
            }, {
                dataIndex: 'idestructura',
                hidden: true
            }
        ]);
        var filtros = [{
            type: 'combo',
            store: new Ext.data.SimpleStore({
                fields: ['activo', 'texto'],
                data: [['-1', 'No'], ['1', 'Si']]
            }),
            valueField: 'activo',
            displayField: 'texto',
            dataIndex: 'texto',
        }];
        if (_this.concepto == 'municipio') {
            filtros = filtros.concat([{
                type: 'combo',
                url: 'obtenerProvincias',
                valueField: 'otradenominacion',
                displayField: 'otradenominacion',
                dataIndex: 'otradenominacion',
            }]);
        }
        var gridFilter = new Ext.ux.grid.GridFilters({
            local: false,
            encode: true,
            filters: []
        });

        this.gConcepto = LOG.util.UIManager.initEditableGridPanel(
            this.cmConcepto, this.stConcepto, this.smConcepto, {
                nobbar: (_this.concepto != 'municipio' ? false : true),
                _plugins: [gridFilter]
            }
        );
        if (_this.concepto == 'municipio') {
            this.btnActivar = LOG.util.UIManager.createBtn({
                text: 'Activar todos',
                tooltip: 'Activa todos los municipios listados',
                iconCls: 'activar',
                handler: function () {
                    var enLista = _this.getGridPrincipal().getStore().getRange();
                    Ext.each(enLista, function (muncp) {
                        muncp.set('activo', 1);
                        muncp.set('idestructura', _this.gpParent.getSelectionModel().getSelected().data.iddeposito);
                    });
                    _this.getGridPrincipal().getView().refresh();
                }
            });
            this.btnDesactivar = LOG.util.UIManager.createBtn({
                text: 'Desactivar todos',
                tooltip: 'Desactiva todos los municipios listados',
                iconCls: 'deshabilitar',
                handler: function () {
                    var enLista = _this.getGridPrincipal().getStore().getRange();
                    Ext.each(enLista, function (muncp) {
                        muncp.set('activo', -1);
                        muncp.set('idestructura', _this.gpParent.getSelectionModel().getSelected().data.iddeposito);
                    });
                    _this.getGridPrincipal().getView().refresh();
                }
            });
            this.gConcepto.getTopToolbar().add(['->', this.btnDesactivar, '-', this.btnActivar]);
        }
        this.gConcepto.title = _this.concepto;
        //this.gConcepto.height = 250;
        this.gConcepto.autoExpandColumn = 'denominacion';
        this.gConcepto.region = 'center';
        return this.gConcepto;
    }
});

LOG.fac.configuracionpuntoventa.Error = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa',
    /**
     * Nombre de la funcion de busqueda principal de datos.
     * @type String
     */
    urlBusquedaGridPrincipal: 'cargarProductoError',
    /**
     * Forma en que se muestra el componente (default = "viewport", "ventana", "panel").
     * @type String
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se carga automaticamente el store.
     * @type Boolean
     */
    autoLoad: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.urlBusquedaGridPrincipal = 'cargarProductoError';
        this.autoLoad = false;
        this.autoSelect = false;
        this.pedidos = config.pedidos;
        LOG.fac.configuracionpuntoventa.Error.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = 'Productos/Servicios con ventas pendientes';
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({ dataIndex: 'idindicador' });
        this.addGridColumn({
            header: 'C\xf3digo',
            width: 180,
            dataIndex: 'codigoproducto',
            default: true
        });
        this.addGridColumn({
            header: 'C\xf3digo de barra',
            width: 180,
            dataIndex: 'codigobarra',
            default: true
        });
        this.addGridColumn({
            header: 'Denominaci\xf3n',
            autoExpand: true,
            dataIndex: 'denominacionproducto',
            default: true
        });


    },
    render: function () {
        var _this = this;
        var render = LOG.fac.configuracionpuntoventa.Error.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function () {
                this.baseParams.idpedidos = this.initBaseParams.idpedidos = Ext.encode(_this.pedidos);
            }
        });
        this.getStorePrincipal().load();
        return render;
    }
});

LOG.fac.configuracionpuntoventa.Lotes = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa',
    /**
     * Nombre de la funcion de busqueda principal de datos.
     * @type String
     */
    urlBusquedaGridPrincipal: 'cargarLotesProducto',
    /**
     * Forma en que se muestra el componente (default = "viewport", "ventana", "panel").
     * @type String
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se carga automaticamente el store.
     * @type Boolean
     */
    autoLoad: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        let _this = this;
        this.formaVisualizacion = 'ventana';
        this.urlBusquedaGridPrincipal = 'cargarLotesProducto';
        this.autoLoad = false;
        this.autoSelect = false;
        this.idproducto = config.idproducto;
        this.gridEditable = true;
        this._parent = config._parent;
        LOG.fac.configuracionpuntoventa.Lotes.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = 'Lotes';
        this.getVistaPrincipal().width = 500;
        this.getVistaPrincipal().height = 300;
        //this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().listaBotones.getItem(1).handler = function () {
            Ext.MessageBox.wait('Salvando los datos...', "Por favor espere...");
            let recordModificados = _this.getStorePrincipal().getModifiedRecords();
            let modificados = [];
            Ext.each(recordModificados, function(record){
                modificados.push(record.data);
            });
            Ext.Ajax.request({
                url: 'modificarPreciosLotes',
                method: 'POST',
                params: {
                    lotes: Ext.encode(modificados)
                },
                success: function (o, s, r) {
                    Ext.MessageBox.hide();
                    mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente');
                    _this.getStorePrincipal().reload();
                    _this._parent.getStorePrincipal().reload();
                }
            });
        }
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({ dataIndex: 'idprecioslotes' });
        this.addGridColumn({ dataIndex: 'idlote' });
        this.addGridColumn({
            header: 'Lote',
            width: 250,
            dataIndex: 'nrolote',
            default: true
        });
        this.addGridColumn({
            header: 'Precio',
            autoExpand: true,
            dataIndex: 'precioventa',
            default: true,
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function (t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            }),
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });


    },
    render: function () {
        var _this = this;
        var render = LOG.fac.configuracionpuntoventa.Lotes.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function () {
                this.baseParams.idproducto = this.initBaseParams.idproducto = _this.idproducto;
            }
        });
        this.getStorePrincipal().load();
        return render;
    }
});