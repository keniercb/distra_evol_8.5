/**
 * Esta clase gestiona las facturas
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
Ext.ns('LOG.fact');
LOG.fact.facturacion = Ext.extend(LOG.lb.documento.View, {
    name: 'Facturacion',
    cantSign: 4,
    signDetails: {
        1: 'Entregado',
        2: 'Recibido',
        3: 'Transportado',
        4: 'Contabilizado'
    },
    dirReport: '/logistica/facturacion/',
    constructor: function (config) {
        var me = this;
        me.seleccionAnterior = new Array();
        me.autoSelect = false;
        me.concepto = config.idioma.conceptoDocumentos;
        me.textBusquedaSimple = config.idioma.cmNroReferencia;
        config.model = new LOG.fact.facturacionModel({
            idioma: config.idioma,
            parent: me
        });
        this.subsistema = LOG.util.Subsistemas.facturacion;
        /*config = */
        Ext.apply(me, config);
        LOG.fact.facturacion.superclass.constructor.call(this, config);
        this.__comprobante = new LOG.lb.comprobante.View({
            idioma: LOG.util.UIManager.apply(LOG.lb.comprobante.Idioma, LOG.util.Idioma),
            acciones: config.acciones,
            subsistema: me.subsistema
        });
        this.__comprobante.initDefaultButtons();
        this.__comprobante.btnGenerar.controlFn = function (b, _caller) {

            if (me.grantedAction('RPOSTEAR')) {
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
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento'
        });
        this.addGridColumn({
            dataIndex: 'controlfirma',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idnodo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'nrorden',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddoc',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'tipoDoc',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'alquiler'
        });
        this.addGridColumn({
            dataIndex: 'idcliente'
        });
        this.addGridColumn({
            dataIndex: 'tienepadre'
        });
        this.addGridColumn({
            dataIndex: 'idcuentabancaria'
        });
        this.addGridColumn({
            dataIndex: 'idcuentabancliente'
        });
        this.addGridColumn({
            dataIndex: 'idmoneda'
        });
        this.addGridColumn({
            dataIndex: 'idcondicionpago'
        });
        this.addGridColumn({
            dataIndex: 'fecha'
        });
        this.addGridColumn({
            dataIndex: 'numero'
        });
        this.addGridColumn({
            dataIndex: 'idseriedocentidad'
        });
        this.addGridColumn({
            dataIndex: 'idcontrato'
        });
        this.addGridColumn({
            dataIndex: 'nombretransp'
        });
        this.addGridColumn({
            dataIndex: 'idcomprobante'
        });
        this.addGridColumn({
            header: this.idioma.cmTipoDocumento,
            dataIndex: 'tipodocumento',
            default: true,
            idioma: this.idioma,
            width: 250,
            renderer: this.getTipoDocumento
        });
        this.addGridColumn({
            header: this.idioma.cmNroDocumento/*cmNoFactura*/,
            dataIndex: 'nrodocumento',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cmNroReferencia/*cmNroDocumento*/,
            dataIndex: 'numeroref',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cmNoControl,
            dataIndex: 'nrocontrol',
            hidden: (_this.configFacturacion && _this.configFacturacion.factsistema == "0") ? true : false,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cmAnno,
            dataIndex: 'anno',
            default: true,
            width: 50
        });
        this.addGridColumn({
            header: this.idioma.cmFecha,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cmFechaVence,
            dataIndex: 'fechavencimiento',
            width: 110,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cmEntregarA,
            dataIndex: 'cliente',
            default: true,
            width: 300
        });
        this.addGridColumn({
            header: this.idioma.cmEstado,
            dataIndex: 'estado',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            header: this.idioma.cmTipoDocOrigen,
            dataIndex: 'tipodocorigen',
            default: true,
            idioma: this.idioma,
            renderer: this.getTipoDocumento
        });
        this.addGridColumn({
            header: this.idioma.cmDocOrigen,
            dataIndex: 'docorigen',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cmServicio,
            dataIndex: 'servicios',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cmProducto,
            dataIndex: 'productos',
            hidden: (this.idsubsistema == -1) ? ((_this.manualproductos) ? false : true) : false,
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cmDeposito,
            dataIndex: 'deposito',
            default: true,
            hidden: (this.idsubsistema != LOG.util.Subsistemas.inventario) ? true : false,
            renderer: function (v, m, r) {
                return r.json.depositofactura
            }
        });
        this.addGridColumn({
            header: 'Rec/Desc F.Pago',
            dataIndex: 'valorconcepto',
            width: 150,
            align: 'right',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.tipoconceptoventa == 1) {
                    if (record.json.conceptoventa == '+') {
                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                    } else if (record.json.conceptoventa == '-') {
                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                    }
                    return value;
                } else if (record.json.tipoconceptoventa == 0) {
                    if (record.json.conceptoventa == '+') {
                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                    } else if (record.json.conceptoventa == '-') {
                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                    }
                    return value;
                }
                return value;
            }
        });
        this.addGridColumn({
            header: (alternativa) ? this.idioma.cmImporte + ' ' + monedacontable : this.idioma.cmImporte,
            dataIndex: 'importetotal',
            width: 180,
            align: 'right',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: this.idioma.cmImporte + ' final',
            dataIndex: 'importefinal',
            width: 180,
            align: 'right',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: this.idioma.cmImporte + ' ' + monedaalternativa,
            dataIndex: 'importetotalalt',
            width: 100,
            align: 'right',
            default: true,
            hidden: !alternativa,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: 'Creado por',
            width: 100,
            dataIndex: 'idusuario',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                _this.usuarios = store.reader.jsonData.usuarios;
                return _this.getUsuarioById(value);
            }
        });
        this.addGridColumn({
            // header: this.idioma.cmComprobante,
            dataIndex: 'nrocomprobante',
            // width: 120,    
            // align: 'right',        
            // default: true
        });
        this.addGridColumn({
            header: 'Observaciones',
            dataIndex: 'observaciones',
            width: 300
        });
        this.addGridColumn({
            header: 'Firmado',
            dataIndex: 'firmado',
            width: 100,
            renderer: function (v, m, rd) {
                if (rd.json.firmado == 1)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
            }
        });
    },
    getUsuarioById: function (id) {
        var _this = this;
        for (var i = 0; i < _this.usuarios.length; i++) {
            if (_this.usuarios[i].idusuario == id) {
                return _this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    initDefaultButtons: function () {
        LOG.fact.facturacion.superclass.initDefaultButtons.call(this);
        var me = this;
        this.listaBotones.delete(0);
        me.insertToolbarButton(me.addBotonAdicionar(), 0);
        this.listaBotones.getItem(1).disable();
        this.listaBotones.getItem(1).handler = function () {
            var parametros = {};
            parametros.title = me.idioma.tAdicionarFactura;
            parametros.configFacturacion = me.configFacturacion;
            parametros.documento = me.getGridPrincipal().getSelectionModel().getSelected();
            parametros.accion = (parametros.documento.data.estado == "1" || parametros.documento.data.estado == "10") ? 'mod' : 'ver';
            if (parametros.documento.json.oferta != 0) {
                parametros.tipoDoc = 1;
            }
            parametros.deshabilitarBotonesGrids = (parametros.documento.json.tipoDoc == "8" || parametros.documento.json.idsubsistema == LOG.util.Subsistemas.activosfijos) ? true : false;
            me.createWinFactura(parametros);
        };
        this.listaBotones.getItem(1).controlFn = function (btn, called) {
            if (me.grantedAction('CT') || me.grantedAction('RB') || me.grantedAction('RCRUD')) {
                btn.show();
                btn.disable();
                me.getGridPrincipal().getSelectionModel().fireEvent = me.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (me.getGridPrincipal().getSelectionModel().getSelections().length == 1) {
                        btn.enable();
                    } else {
                        btn.disable();
                    }
                });
            } else {
                btn.hide();
            }

        };
        this.listaBotones.getItem(2).disable();
        this.listaBotones.getItem(2).handler = function () {
            me.eliminarDocumento();
        };
        this.listaBotones.getItem(2).controlFn = function (btn, called) {
            if (me.grantedAction('CT') || me.grantedAction('RCRUD') || me.grantedAction('REliminar')) {
                btn.show();
                btn.disable();
                me.getGridPrincipal().getSelectionModel().fireEvent = me.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                    if (e == "selectionchange") {
                        if (seleccion.length > 0) {
                            btn.enable();
                            Ext.each(seleccion, function (uno) {
                                if (uno.data.estado != "1") {
                                    btn.disable();
                                }
                            });
                        } else {
                            btn.disable();
                        }
                    }
                });
            } else {
                btn.hide();
            }
        };

        this.btnGenerarFactura = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnGenerarFactura,
            tooltip: this.idioma.lbTtBtnGenerarFactura,
            iconCls: 'facturar',
            idItem: 'GenerarFactura',
            isContextual: true,
            //scope: this,
            disabled: true,
            controlFn: function (btn, called) {
                if (me.grantedAction('CT') || me.grantedAction('RFacturar')) {
                    btn.show();
                    btn.disable();
                    me.getGridPrincipal().getSelectionModel().fireEvent = me.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length > 0) {
                                btn.enable();
                                Ext.each(seleccion, function (uno) {
                                    if (uno.data.estado != "3" || uno.json.oferta != 1) {
                                        btn.disable();
                                    }
                                });
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                var idsdocumentos = new Array();
                Ext.each(seleccion, function (sel) {
                    idsdocumentos.push(sel.data.iddocumento);
                });
                var mascara = new Ext.LoadMask(Ext.getBody(), {
                    msg: me.idioma.msjLoadGenerandoFactura
                });
                mascara.show();
                Ext.Ajax.request({
                    url: 'generaFacturaDeOferta',
                    params: {
                        documentos: Ext.encode(idsdocumentos)
                    },
                    success: function (response) {
                        var data = Ext.decode(response.responseText);
                        if (data.success == true) {
                            mostrarMensaje(1, ((me.idsubsistema == LOG.util.Subsistemas.inventario) ? me.idioma.msgGeneradaExito1 + "<br>Nro: " + data.nrogenerado : me.idioma.msgGeneradaExito));
                            mascara.hide();
                            me.getGridPrincipal().getStore().reload();
                        }
                    }
                });
            }
        });
        //generacion de distribucion o pedidos a partir de ofertas
        this.btnGenerarPedido = LOG.util.UIManager.createMenuItem({
            text: 'Generar pedido',
            tooltip: 'Generar pedido a partir de oferta',
            iconCls: 'pedido',
            idItem: 'GenerarPedido',
            isContextual: true,
            //scope: this,
            disabled: true,
            controlFn: function (btn, called) {
                if (me.grantedAction('CT') || me.grantedAction('RFacturar')) {
                    btn.show();
                    btn.disable();
                    me.getGridPrincipal().getSelectionModel().fireEvent = me.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length > 0) {
                                btn.enable();
                                Ext.each(seleccion, function (uno) {
                                    if (uno.data.estado != "3" || uno.json.oferta != 1) {
                                        btn.disable();
                                    }
                                });
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                var idsdocumentos = new Array();
                Ext.each(seleccion, function (sel) {
                    idsdocumentos.push(sel.data.iddocumento);
                });
                Ext.MessageBox.wait('Generando pedido de oferta', me.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: 'generaPedidoDeOferta',
                    params: {
                        documentos: Ext.encode(idsdocumentos)
                    },
                    success: function (response) {
                        Ext.MessageBox.hide()
                        var data = Ext.decode(response.responseText);
                        if (data.success == true) {
                            mostrarMensaje(1, me.idioma.msgGeneradaExito1 + "<br>referencia: " + data.nrogenerado);
                            me.getGridPrincipal().getStore().reload();
                        }
                    }
                });
            }
        });

        this.btnGenerarDistFactura = LOG.util.UIManager.createMenuItem({
            text: 'Generar factura',
            tooltip: 'Generar factura a partir de oferta',
            iconCls: 'factura',
            idItem: 'GenerarDistFactura',
            isContextual: true,
            //scope: this,
            disabled: true,
            controlFn: function (btn, called) {
                if (me.grantedAction('CT') || me.grantedAction('RFacturar')) {
                    btn.show();
                    btn.disable();
                    me.getGridPrincipal().getSelectionModel().fireEvent = me.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length > 0) {
                                btn.enable();
                                Ext.each(seleccion, function (uno) {
                                    if (uno.data.estado != "3" || uno.json.oferta != 1) {
                                        btn.disable();
                                    }
                                });
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                var idsdocumentos = new Array();
                Ext.each(seleccion, function (sel) {
                    idsdocumentos.push(sel.data.iddocumento);
                });
                Ext.MessageBox.wait('Generando factura de oferta', me.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: 'generaDistribucionFactura',
                    params: {
                        documentos: Ext.encode(idsdocumentos)
                    },
                    success: function (response) {
                        Ext.MessageBox.hide();
                        var data = Ext.decode(response.responseText);
                        if (data.success == true) {
                            mostrarMensaje(1, me.idioma.msgGeneradaExito + "<br>Nro referencia: " + data.nrogenerado);
                            me.getGridPrincipal().getStore().reload();
                        }
                    }
                });
            }
        });

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Generar documento',
            //tooltip: this.idioma.lbBtnAdicionar,
            iconCls: 'facturar',
            menu: [this.btnGenerarPedido, this.btnGenerarDistFactura],
            controlFn: function (btn, called) {
                if (me.grantedAction('CT') || me.grantedAction('RFacturar')) {
                    btn.show();
                } else {
                    btn.hide();
                }
            }
        }), 3);
        //fin
        /*this.insertToolbarButton(
            me.btnGenerarFactura, 3);*/
        this.insertToolbarButton(
            LOG.util.Prototipos.botonConfirmar({
                tooltip: this.idioma.lbTtBtnConfirmarFact,
                disabled: true,
                handler: function () {
                    if (!isNovaBank) {
                        me.modelo.funcionConfirmar(me.getGridPrincipal().getSelectionModel().getSelections());
                    } else {
                        me.modelo.contabilizarFactura(me.getGridPrincipal().getSelectionModel().getSelections());
                    }
                },
                controlFn: function (btn, called) {
                    if (me.grantedAction('CT') || me.grantedAction('RCRUD') || me.grantedAction('RConfirmar')) {
                        btn.show();
                        btn.disable();
                        me.getGridPrincipal().getSelectionModel().fireEvent = me.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                            var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                            if (e == "selectionchange") {
                                if (seleccion.length > 0) {
                                    btn.enable();
                                    Ext.each(seleccion, function (uno) {
                                        if (uno.data.estado != "1" || (uno.json.productos == "0" && uno.json.servicios == "0")) {
                                            btn.disable();
                                        }
                                    });
                                } else {
                                    btn.disable();
                                }
                            }
                        });
                    } else {
                        btn.hide();
                    }
                }
            }), 4);
        this.insertToolbarButton(
            LOG.util.Prototipos.botonContabilizar({
                text: this.idioma.lbBtnFacturar,
                disabled: true,
                tooltip: this.idioma.lbTtBtnFacturarFact,
                controlFn: function (b, called) {
                    if (isNovaBank != 1 && (me.grantedAction('CT') || me.grantedAction('RContabilizar'))) {
                        b.show();
                        me.getGridPrincipal().getSelectionModel().fireEvent = me.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                            var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                            if (e == "selectionchange") {
                                if (seleccion.length > 0) {
                                    b.enable();
                                    Ext.each(seleccion, function (uno) {
                                        if (uno.data.estado != "2" || uno.json.oferta != 0) {
                                            b.disable();
                                            return;
                                        } else {
                                            b.setDisabled(!(
                                                (uno.data.estado == "2" || uno.json.oferta == 0) && //first
                                                ((window.useSign && typeof pki == 'object') ? (called.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                                            ));
                                        }
                                    });
                                } else {
                                    b.disable();
                                }
                                /*
                                 if (e == 'rowselect') {
                                 b.setDisabled(!(
                                 ( this.getCount() == 1 && this.getSelected().data.estado == 2 ) && //first
                                 ( ( window.useSign && typeof pki == 'object' ) ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                                 ));
                                 }*/
                            }
                        });
                    } else {
                        b.hide();
                    }

                },
                handler: function () {
                    me.modelo.contabilizarFactura(me.getGridPrincipal().getSelectionModel().getSelections());
                }
            }), 5);
        this.btnAnularEstado = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbBtnAnularEstado,
            iconCls: 'estado',
            disabled: true,
            controlFn: function (btn, called) {
                if (me.grantedAction('CT') || me.grantedAction('RCRUD') || me.grantedAction('RAnularestado')) {
                    btn.show();
                    btn.disable();
                    me.getGridPrincipal().getSelectionModel().fireEvent = me.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length > 0) {
                                btn.enable();
                                Ext.each(seleccion, function (uno) {
                                    if ((uno.data.estado != "3" && uno.data.estado != "2") || uno.json.oferta == "2") {
                                        btn.disable();
                                    }
                                });
                            } else {
                                btn.disable();
                            }
                        }
                        me.deshabilitarAnular();
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                mostrarMensaje(2, me.idioma.lbQuestAnularEstado, function (btn, text) {
                    if (btn === 'ok') {
                        me.modelo.anularEstatus(me.getGridPrincipal().getSelectionModel().getSelections());
                    }
                });
            }
        });
        this.btnAnularDocumento = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbBtnAnularDocumento,
            iconCls: 'copiar',
            disabled: true,
            controlFn: function (btn, called) {
                if (me.grantedAction('CT') || me.grantedAction('RAnular')) {
                    btn.show();
                    btn.disable();
                    me.getGridPrincipal().getSelectionModel().fireEvent = me.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length > 0) {
                                btn.enable();
                                Ext.each(seleccion, function (uno) {
                                    if (uno.data.estado != "4") {
                                        btn.disable();
                                    }
                                });
                            } else {
                                btn.disable();
                            }
                        }
                        me.deshabilitarAnular();
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                me.modelo.confirmarAnularDocumento(me.getGridPrincipal().getSelectionModel().getSelections());
            }
        });
        this.btnAnularNroControl = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbBtnNroControl, //revisar esto
            iconCls: 'numeroserie',
            //hidden: (me.configFacturacion.datos && me.configFacturacion.datos.anularnumerocontrol == 0) ? true : false,
            controlFn: function (btn, called) {
                if ((me.grantedAction('CT') || me.grantedAction('RAnularnrocontrol')) && me.configFacturacion.anularnumerocontrol != 0) {
                    btn.show();
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                var ventana = new LOG.fact.vAnularNrosControl({
                    idioma: me.idioma,
                    docFactura: me.getGridPrincipal().getStore(),
                    vp: me,
                    layout: 'fit'
                });
                ventana.show();
            }
        });
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbMenuAnular,
            //tooltip: this.idioma.lbBtnAdicionar,
            iconCls: 'anular',
            menu: [this.btnAnularEstado, this.btnAnularDocumento, this.btnAnularNroControl
            ],
            controlFn: function (b, called) {
                if (me.grantedAction('CT') || me.grantedAction('RCRUD') || me.grantedAction('RAnularestado') || me.grantedAction('RAnular')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }), 6);

        this.insertToolbarButton(
            LOG.util.Prototipos.botonAprobar({
                disabled: true,
                tooltip: this.idioma.lbTtBtnAprobarFact,
                controlFn: function (b, called) {
                    if (me.grantedAction('CT') || me.grantedAction('RContabilizar')) {
                        b.show();
                        b.disable();
                        me.getGridPrincipal().getSelectionModel().fireEvent = me.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                            var seleccion = me.getGridPrincipal().getSelectionModel().getSelections();
                            if (e == "selectionchange") {
                                if (seleccion.length > 0) {
                                    b.enable();
                                    Ext.each(seleccion, function (uno) {
                                        Ext.each(seleccion, function (uno) {
                                            if ((uno.data.estado != "2" && uno.data.estado != "10") || uno.json.oferta != 1) {
                                                b.disable();
                                            }
                                        });
                                    });
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    } else {
                        b.hide();
                    }
                },
                handler: function () {
                    me.modelo.aprobar();
                }
            }), 7);
        this.insertToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.lbTtBtnImprimirFact,
            text: this.idioma.lbBtnImprimir,
            itemId: 'btnImprimir',
            iconCls: 'imprimir',
            menu: [{
                text: this.idioma.lbBtnImprimirListado,
                iconCls: 'imprimir',
                isList: true,
                name: alternativa == true ? 'FacturacionDualListado' : ((typeof facturalistadodesglose !== 'undefined' && facturalistadodesglose == 1) ? 'FacturacionListadoDesglose' : 'FacturacionListado'),
                handler: this.onReport.createDelegate(this)
            }, {
                text: this.idioma.lbBtnImprimirModelo,
                iconCls: 'imprimir',
                isList: false,
                /*name:((me.configFacturacion.facturasistema == 1) ? 'FacturacionDualModelo' : ((me.configFacturacion.listarmcomercial == 1) ? 'FacturacionNDualModelo_1' : 'FacturacionNDualModelo')),


                name: alternativa == true ? ((me.configFacturacion.facturasistema == 1) ? 'FacturacionDualModelo' : ((me.configFacturacion.listarmcomercial == 1) ? 'FacturacionNDualModelo_1' : 'FacturacionNDualModelo')) : 'FacturacionModelo',
*/
                disabled: true,
                handler: function (btn) {
                    var selected = me.getGridPrincipal().getSelectionModel().getSelected().json;
                    if (selected.iddoc == iddocnotadebito || selected.iddoc == iddocnotacredito) {
                        btn.name = (selected.iddoc == iddocnotacredito) ? 'NotaCreditoModelo' : 'NotaDebitoModelo';
                    } else {
                        btn.name = alternativa == true ? (me.getGridPrincipal().getSelectionModel().getSelected().json.oferta != 0 ? 'FacturacionOfertaDualModelo' : 'FacturacionNDualModelo') : (me.getGridPrincipal().getSelectionModel().getSelected().json.oferta != 0 ? 'FacturacionOfertaModelo' : 'FacturacionNModelo');
                    }
                    me.modelo.imprimirModelo(btn);
                }
            }],
            controlFn: function (b, _caller) {
                if (me.grantedAction('CT') || me.grantedAction('RB') || me.grantedAction('RImprimir')) {
                    b.show();
                    /*LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.menu.get(1).setDisabled(this.getCount() > 1);
                        }
                    }, 'imprimir');*/
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            b.setVisible(this.getCount() > 0);
                        }
                    }, 'imprimir1');
                } else {
                    b.hide();
                }
            }
        }), 8);
        this.insertToolbarButton(this.__comprobante.btnGenerar, 9);

        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Exportar xml',
            disabled: true,
            iconCls: 'exportar',
            tooltip: 'Exportar factura en formato xml',
            handler: function () {
                var documento = me.getGridPrincipal().getSelectionModel().getSelected();
                me.modelo.exportarXml(documento);
            },
            controlFn: function (b, _caller) {
                if (me.grantedAction('EFACTURA')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.enable();
                        }
                    }, 'ExportarXML');
                } else {
                    b.hide();
                }
            }
        }), 11);
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Exportar csv',
            disabled: true,
            iconCls: 'exportar',
            tooltip: 'Exportar factura en formato csv',
            handler: function () {
                var documento = me.getGridPrincipal().getSelectionModel().getSelected();
                me.modelo.exportarCsv(documento);
            },
            controlFn: function (b, _caller) {
                if (me.grantedAction('RExportar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.enable();
                        }
                    }, 'ExportarCSV');
                } else {
                    b.hide();
                }
            }
        }), 12);

        LOG.util.UIManager.apply(this.listaBotones.getItem(13), {id: 'ayudaFacturacion'});
    },
    deshabilitarAnular: function () {
        var _this = this;
        if (_this.configFacturacion && _this.configFacturacion.anularnumerocontrol == "0") {
            if (!_this.listaBotones.arrayData[6].menu.items.items[0].disabled || !_this.listaBotones.arrayData[6].menu.items.items[1].disabled) {
                _this.listaBotones.arrayData[6].enable();
            } else {
                _this.listaBotones.arrayData[6].disable();
            }
        } else {
            _this.listaBotones.arrayData[6].enable();
        }
        if (!_this.listaBotones.arrayData[8].menu.items.items[0].disabled || !_this.listaBotones.arrayData[8].menu.items.items[1].disabled) {
            _this.listaBotones.arrayData[8].enable();
        } else {
            _this.listaBotones.arrayData[8].disable();
        }
    },
    addBotonAdicionar: function (subsistema) {
        var me = this;
        var ocultar = true;

        if (me.grantedAction('CT') || me.grantedAction('RCRUD') || me.grantedAction('RAdicionar')) {
            ocultar = false;
        }
        if (me.btnMenuAdd)
            me.btnMenuAdd.destroy();
        if (!subsistema || (subsistema != LOG.util.Subsistemas.inventario && subsistema != -1)) {
            if (me.configFacturacion.oferta == 0 || subsistema == LOG.util.Subsistemas.talleres) {
                if (!iddocnotacredito && !iddocnotadebito) {
                    this.btnMenuAdd = new LOG.util.Prototipos.botonNuevo({
                        tooltip: this.idioma.lbBtnAdicionarFact,
                        disabled: (subsistema) ? false : true,
                        hidden: ocultar,
                        key: {
                            key: 'N',
                            ctrl: false,
                            alt: true
                        },
                        handler: function () {
                            var parametros = {};
                            parametros.title = me.idioma.tAdicionarFactura;
                            parametros.accion = 'add';
                            parametros.subsistema = subsistema;
                            parametros.tipoDoc = (subsistema == LOG.util.Subsistemas.activosfijos) ? 6 : 8;
                            parametros.configFacturacion = me.configFacturacion;
                            parametros.deshabilitarBotonesGrids = true;
                            me.createAddWinFactura(parametros);
                        }
                    });
                } else {
                    this.menuAdd = [
                        new Ext.menu.Item({
                            text: 'Nota de D\xe9bito',
                            //disabled: (me.configFacturacion.oferta == 0) ? true : false,
                            hidden: (!iddocnotadebito) ? true : false,
                            iconCls: 'adicionar',
                            handler: function () {
                                var parametros = {};
                                parametros.title = me.idioma.tAdicionarFactura;
                                parametros.accion = 'add';
                                parametros.subsistema = subsistema;
                                parametros.configFacturacion = me.configFacturacion;
                                parametros.notadebito = 1;
                                parametros.tipoDoc = 'nd';
                                me.createAddWinFactura(parametros);
                            }
                            /*menu: [
                                new Ext.menu.Item({
                                    text: 'Nueva Nota de Debito',
                                    //disabled: (me.configFacturacion.oferta == 0) ? true : false,
                                    //hidden: (me.configFacturacion.oferta == 0) ? true : false,
                                    iconCls: 'adicionar',
                                    handler: function () {
                                        var parametros = {};
                                        parametros.title = me.idioma.tAdicionarFactura;
                                        parametros.accion = 'add';
                                        parametros.subsistema = subsistema;
                                        parametros.configFacturacion = me.configFacturacion;
                                        parametros.notadebito = 1;
                                        parametros.tipoDoc = 4;
                                        me.createAddWinFactura(parametros);
                                    }
                                }),
                                new Ext.menu.Item({
                                    text: 'A partir de una Factura',
                                    //disabled: (me.configFacturacion.oferta == 0) ? true : false,
                                    //hidden: (me.configFacturacion.oferta == 0) ? true : false,
                                    iconCls: 'adicionar',
                                    handler: function () {

                                    }
                                })
                            ]*/
                        }),
                        new Ext.menu.Item({
                            text: 'Nota de Cr\xe9dito',
                            //disabled: (me.configFacturacion.oferta == 0) ? true : false,
                            hidden: (!iddocnotacredito) ? true : false,
                            iconCls: 'adicionar',
                            handler: function () {
                                var parametros = {};
                                parametros.title = me.idioma.tAdicionarFactura;
                                parametros.accion = 'add';
                                parametros.subsistema = subsistema;
                                parametros.configFacturacion = me.configFacturacion;
                                parametros.notadebito = 1;
                                parametros.tipoDoc = 'nc';
                                me.createAddWinFactura(parametros);
                            }
                        }),
                        new Ext.menu.Item({
                            tooltip: this.idioma.lbBtnAdicionarFact,
                            disabled: (subsistema) ? false : true,
                            text: this.idioma.lbBtnApartirDoc,
                            hidden: ocultar,
                            iconCls: 'adicionar',
                            key: {
                                key: 'N',
                                ctrl: false,
                                alt: true
                            },
                            handler: function () {
                                var parametros = {};
                                parametros.title = me.idioma.tAdicionarFactura;
                                parametros.accion = 'add';
                                parametros.subsistema = subsistema;
                                parametros.tipoDoc = (subsistema == LOG.util.Subsistemas.activosfijos) ? 6 : 8;
                                parametros.configFacturacion = me.configFacturacion;
                                parametros.deshabilitarBotonesGrids = true;
                                me.createAddWinFactura(parametros);
                            }
                        })
                    ];
                    this.btnMenuAdd = LOG.util.UIManager.createBtn({
                        text: this.idioma.lbBtnNuevo,
                        tooltip: this.idioma.lbBtnAdicionarFact,
                        hidden: ocultar,
                        iconCls: 'nuevo',
                        menu: me.menuAdd
                    });
                }

            } else {
                this.menuAdd = [
                    new Ext.menu.Item({
                        text: me.configFacturacion.denominacionOferta,
                        disabled: (me.configFacturacion.oferta == 0) ? true : false,
                        hidden: (me.configFacturacion.oferta == 0) ? true : false,
                        iconCls: 'adicionar',
                        handler: function () {
                            var parametros = {};
                            parametros.title = me.idioma.tAdicionarFactura + " " + me.idioma.lbBtnPrefactura.toLowerCase();
                            parametros.accion = 'add';
                            parametros.tipoDoc = 1;
                            parametros.suministrador = me.configFacturacion.suministrador;
                            parametros.configFacturacion = me.configFacturacion;
                            me.createWinFactura(parametros);
                        }
                    }),
                    {
                        text: this.idioma.lbBtnApartirDoc,
                        tooltip: this.idioma.lbBtnAdicionarFact,
                        disabled: (subsistema) ? false : true,
                        hidden: ocultar,
                        iconCls: 'adicionar',
                        handler: function () {
                            var parametros = {};
                            parametros.title = me.idioma.tAdicionarFactura;
                            parametros.accion = 'add';
                            parametros.subsistema = subsistema;
                            parametros.tipoDoc = (subsistema == LOG.util.Subsistemas.activosfijos) ? 6 : 8;
                            parametros.configFacturacion = me.configFacturacion;
                            parametros.deshabilitarBotonesGrids = true;
                            me.createAddWinFactura(parametros);
                        }
                    }
                ];

                this.btnMenuAdd = LOG.util.UIManager.createBtn({
                    text: this.idioma.lbBtnNuevo,
                    tooltip: this.idioma.lbBtnAdicionarFact,
                    hidden: ocultar,
                    iconCls: 'nuevo',
                    menu: me.menuAdd
                });
            }
            /*this.btnMenuAdd = new LOG.util.Prototipos.botonNuevo({
                tooltip: this.idioma.lbBtnAdicionarFact,
                disabled: (subsistema) ? false : true,
                hidden: ocultar,
                key: {
                    key: 'N',
                    ctrl: false,
                    alt: true
                },
                handler: function () {
                    var parametros = {};
                    parametros.title = me.idioma.tAdicionarFactura;
                    parametros.accion = 'add';
                    parametros.subsistema = subsistema;
                    parametros.tipoDoc = (subsistema == LOG.util.Subsistemas.activosfijos) ? 6 : 8;
                    parametros.configFacturacion = me.configFacturacion;
                    parametros.deshabilitarBotonesGrids = true;
                    me.createAddWinFactura(parametros);
                }
            });*/
            //LOG.util.UIManager.applyKey(me.btnMenuAdd, this);
            if (!subsistema)
                return me.btnMenuAdd;
        } else {
            this.btnAdicionarDeDocumentos = LOG.util.UIManager.createMenuItem({
                text: this.idioma.lbBtnApartirDoc,
                iconCls: 'adicionar',
                handler: function () {
                    var parametros = {};
                    parametros.title = me.idioma.tAdicionarFactura;
                    parametros.accion = 'add';
                    parametros.subsistema = subsistema;
                    parametros.configFacturacion = me.configFacturacion;
                    me.createAddWinFactura(parametros);
                }
            });

            this.menuAdd = [
                new Ext.menu.Item({
                    text: me.configFacturacion.denominacionOferta,
                    disabled: (me.configFacturacion.oferta == 0) ? true : false,
                    hidden: (me.configFacturacion.oferta == 0) ? true : false,
                    iconCls: 'adicionar',
                    handler: function () {
                        var parametros = {};
                        parametros.title = me.idioma.tAdicionarFactura + " " + me.idioma.lbBtnPrefactura.toLowerCase();
                        parametros.accion = 'add';
                        parametros.tipoDoc = 1;
                        parametros.suministrador = me.configFacturacion.suministrador;
                        parametros.configFacturacion = me.configFacturacion;
                        me.createWinFactura(parametros);
                    }
                }),
                new Ext.menu.Item({
                    hidden: ((me.idsubsistema == LOG.util.Subsistemas.inventario) ? true : false),
                    text: this.idioma.lbBtnFacturaManual,
                    iconCls: 'adicionar',
                    handler: function () {
                        var parametros = {};
                        parametros.title = me.idioma.tAdicionarFactura + " " + me.idioma.lbBtnFacturaManual.toLowerCase();
                        parametros.accion = 'add';
                        parametros.tipoDoc = 2;
                        parametros.suministrador = me.configFacturacion.suministrador;
                        parametros.configFacturacion = me.configFacturacion;
                        me.createWinFactura(parametros);
                    }
                }),
                new Ext.menu.Item({
                    text: /*this.idioma.lbBtnNotasEntrega*/me.configFacturacion.denominacionNota,
                    iconCls: 'adicionar',
                    disabled: (me.configFacturacion.notaEntrega == 0) ? true : false,
                    hidden: ((me.idsubsistema == LOG.util.Subsistemas.inventario) ? true : ((me.configFacturacion.notaEntrega == 0) ? true : false)),
                    handler: function () {
                        var parametros = {};
                        parametros.title = me.idioma.tAdicionarFactura + " " + me.idioma.lbBtnNotasEntrega.toLowerCase();
                        parametros.accion = 'add';
                        parametros.tipoDoc = 3;
                        parametros.suministrador = me.configFacturacion.suministrador;
                        parametros.configFacturacion = me.configFacturacion;
                        me.createWinFactura(parametros);
                    }
                }),
                new Ext.menu.Item({
                    text: 'Nota de D\xe9bito',
                    //disabled: (me.configFacturacion.oferta == 0) ? true : false,
                    hidden: (!iddocnotadebito) ? true : false,
                    iconCls: 'adicionar',
                    handler: function () {
                        var parametros = {};
                        parametros.title = me.idioma.tAdicionarFactura;
                        parametros.accion = 'add';
                        parametros.subsistema = subsistema;
                        parametros.configFacturacion = me.configFacturacion;
                        parametros.notadebito = 1;
                        parametros.tipoDoc = 'nd';
                        me.createAddWinFactura(parametros);
                    }
                    /*menu: [
                        new Ext.menu.Item({
                            text: 'Nueva Nota de Debito',
                            //disabled: (me.configFacturacion.oferta == 0) ? true : false,
                            //hidden: (me.configFacturacion.oferta == 0) ? true : false,
                            iconCls: 'adicionar',
                            handler: function () {
                                var parametros = {};
                                parametros.title = me.idioma.tAdicionarFactura;
                                parametros.accion = 'add';
                                parametros.subsistema = subsistema;
                                parametros.configFacturacion = me.configFacturacion;
                                parametros.notadebito = 1;
                                parametros.tipoDoc = 4;
                                me.createAddWinFactura(parametros);
                            }
                        }),
                        new Ext.menu.Item({
                            text: 'A partir de una Factura',
                            //disabled: (me.configFacturacion.oferta == 0) ? true : false,
                            //hidden: (me.configFacturacion.oferta == 0) ? true : false,
                            iconCls: 'adicionar',
                            handler: function () {

                            }
                        })
                    ]*/
                }),
                new Ext.menu.Item({
                    text: 'Nota de Cr\xe9dito',
                    //disabled: (me.configFacturacion.oferta == 0) ? true : false,
                    hidden: (!iddocnotacredito) ? true : false,
                    iconCls: 'adicionar',
                    handler: function () {
                        var parametros = {};
                        parametros.title = me.idioma.tAdicionarFactura;
                        parametros.accion = 'add';
                        parametros.subsistema = subsistema;
                        parametros.configFacturacion = me.configFacturacion;
                        parametros.notadebito = 1;
                        parametros.tipoDoc = 'nc';
                        me.createAddWinFactura(parametros);
                    }
                }),
                me.btnAdicionarDeDocumentos
            ];
            this.btnMenuAdd = LOG.util.UIManager.createBtn({
                text: this.idioma.lbBtnNuevo,
                tooltip: this.idioma.lbBtnAdicionarFact,
                hidden: ocultar,
                iconCls: 'nuevo',
                menu: me.menuAdd
            });

        }
        me.getPanelSuperior().getTopToolbar().insertButton(1, me.btnMenuAdd);
        me.getPanelSuperior().doLayout();
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        var isoContable = null;
        var monedaAlternativa = null;
        Ext.each(_this.configFacturacion.monedas, function (moneda) {
            if (moneda.contable) {
                monedaContable = moneda.idmoneda;
            } else if (moneda.dualidad && moneda.dualidad == 1) {
                monedaAlternativa = moneda.idmoneda;
            }
        });
        console.info(_this.panelBusquedaAvanzada.findByType('textfield'))
        return btn.isList ? {
            idoperacion: _this.idoperacion,
            iddeposito: (_this.panelBusquedaAvanzada.findByType('combo')[6].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[6].getValue() : null,
            centrocosto: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            docorigen: (_this.panelBusquedaAvanzada.findByType('combo')[5].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[5].getValue() : null,
            anno: (_this.panelBusquedaAvanzada.findByType('textfield')[5].getValue()) ? _this.panelBusquedaAvanzada.findByType('textfield')[5].getValue() : null,
            entregar: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
            tipodocumento: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? "{" + _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() + "}" : iddocs,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d-m-Y') : null,
            numeroref: (_this.gridFilter.tfBusqueda.getValue()) ? _this.gridFilter.tfBusqueda.getValue() : null,
            monedacontable: (configfact.monedas.idmoneda) ? configfact.monedas.idmoneda : null,
            monedaalternativa: (configfact.monedas.idmonedaalternativa) ? configfact.monedas.idmonedaalternativa : null,
            idoperaciones: (_this.cmbFindOperacion.getValue()) ? '{' + _this.cmbFindOperacion.getValue() + '}' : null
        } : {
            useSign: this.useSign,
            hasCategoria: (usarCategoria) ? 'true' : 'false',
            hasAlquiler: (record.get('alquiler') == 1 ? 'true' : 'false') || null,
            hasNumeroSerie: ((record.get('alquiler') == 0 && _this.idsubsistema == LOG.util.Subsistemas.activosfijos) ? 'true' : 'false') || null,
            iddocumento: record.get("iddocumento")/*((!this.idfacturas)) ? record.get("iddocumento") : ((this.idfacturas) ? this.idfacturas : null)*/,
            isOrdenTrabajo: (record.get('tipoDoc') == 8) ? 'true' : 'false',
            idoperacion: _this.idoperacion,
            iddeposito: (_this.panelBusquedaAvanzada.findByType('combo')[5].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[5].getValue() : null,
            monedacontable: (configfact.monedas.idmoneda) ? configfact.monedas.idmoneda : null,
            monedaalternativa: (configfact.monedas.idmonedaalternativa) ? configfact.monedas.idmonedaalternativa : 9900000001,
            isocontable: monedacontable,
            isoalt: monedaalternativa

        };
    },
    onReport: function (btn, idfacturas) {
        var _this = this;
        this.idfacturas = idfacturas;
        if (!btn.isList) {
            if (_this.winFactura != undefined && _this.winFactura.isVisible()) {
                var record = new Ext.data.Record(_this.winFactura.documento.json);
                record.json = _this.winFactura.documento.json
            } else {
                var record = this.getGridPrincipal().getSelectionModel().getSelected();
            }
            // this.dirReport = '/distra/logistica/facturacion/moncar/';
            this.dirReport = '/logistica/facturacion/' + dirreporte + '/';
            // this.dirReport = '/distra/logistica/facturacion/facturacion/';
            // this.dirReport = ((record.json.oferta == 1 || record.json.oferta == 2)? '/distra/logistica/facturacion/facturacion/' : '/distra/logistica/facturacion/moncar/');

        } else {
            this.dirReport = '/logistica/facturacion/facturacion/';
        }
        if (!btn.od) {
            if (!btn.isList && (record.json.iddoc == iddocnotadebito || record.json.iddoc == iddocnotacredito)) {
                btn.name = (record.json.iddoc == iddocnotacredito) ? 'NotaCreditoModelo' : 'NotaDebitoModelo';
            } else if (!btn.isList && record.json.oferta != 0) {
                btn.name = "FacturacionOfertaDualModelo";
            } else if (!btn.isList) {
                btn.name = (record.json.anno <= 2020) ? 'FacturacionNDualModelo' : ((alternativa == true) ? 'FacturacionNDualModelo' : 'FacturacionModelo');
            }
        }
        LOG.fact.facturacion.superclass.onReport.call(this, btn);
    },
    getTipoDocumento: function (value, r, p) {
        if (value) {
            if (value == 1 || value == 2) {
                return this.idioma.tipoDocOferta;
            } else {
                return value;
            }
        } else if (!!p.data.docorigen) {
            return this.idioma.tipoDocVenta;
        }
    },
    eliminarDocumento: function (documento, desdeAdd) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbQuestFacturaAEliminar, function (btn, text) {
            if (btn === 'ok') {
                var seleccion = (!documento) ? _this.getGridPrincipal().getSelectionModel().getSelections() : Array(documento);
                var idsDocumentos = [];
                var oferta = [];
                var idsClientes = [];
                Ext.each(seleccion, function (uno) {
                    idsDocumentos.push(uno.json.iddocumento);
                    oferta.push({
                        reservadisponible: uno.json.reservadisponible,
                        oferta: uno.json.oferta
                    });
                    idsClientes.push(uno.json.idcliente);
                });
                Ext.MessageBox.wait(_this.idioma.msgEliminando, _this.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: 'eliminarFactura',
                    method: 'post',
                    params: {
                        documentos: Ext.encode(idsDocumentos),
                        clientes: Ext.encode(idsClientes),
                        oferta: Ext.encode(oferta),
                        idsubsistema: _this.idsubsistema
                    },
                    success: function (rp) {
                        Ext.MessageBox.hide();
                        var value = Ext.decode(rp.responseText);
                        if (value.success) {
                            mostrarMensaje(1, _this.idioma.lbMsgFacturaEliminada);
                            _this.seleccionAnterior = Array();
                            if (!desdeAdd)
                                _this.getGridPrincipal().getStore().reload();
                            else {
                                _this.winFactura.recargar = true;
                                _this.winFactura.close();
                            }
                        }
                    }
                });
            }
        });
    },
    createWinFactura: function (objParametros, values) {
        var _this = this;
        objParametros.idioma = this.idioma;
        objParametros.modelo = this.modelo;
        objParametros.closeAction = 'close';
        objParametros.idsubsistema = _this.idsubsistema;
        objParametros.idoperacion = _this.idoperacion;
        objParametros.mayorista = _this.mayorista;
        objParametros.idcondicionpagodefault = _this.idcondicionpagodefault;
        objParametros.values = values;
        objParametros.parent = objParametros.parent || _this;
        objParametros.btn = _this.createButtons(objParametros.tipoDoc);
        objParametros.stFacturas = _this.getGridPrincipal().getStore();
        objParametros.configFacturacion = _this.configFacturacion || null;
        objParametros.manualproductos = _this.manualproductos || false;
        objParametros.arrayOperaciones = _this.arrayOperaciones;
        if (!_this.winFactura || !_this.winFactura.isVisible()) {
            _this.winFactura = (_this.idsubsistema == LOG.util.Subsistemas.inventario && objParametros.tipoDoc != 1)
                ? new LOG.fact.winFactura(objParametros)
                : new LOG.fact.winFacturaNom(objParametros);
        }
        if (!objParametros.datosComunes) {
            _this.winFactura.show();
            _this.winFactura.maximize();
            _this.winFactura.doLayout();
        } else {
            _this.winFactura.show();
            _this.winFactura.doLayout();
        }
        _this.winGestionarDocumento = _this.winFactura;
    },
    createDatosComunes: function (params) {
        var _this = this;
        var obj = {};
        obj.oferta = 0;
        obj.idsubsistema = _this.idsubsistema;
        obj.tipoDoc = params.tipoDoc;
        obj.accion = 'add';
        obj.abrir = params.abrir;
        obj.alquiler = params.alquiler;
        obj.idoperacion = _this.idoperacion;
        obj.servicios = params.servicios;
        if (params.tipoDoc == 4) {
            obj.docorigen = params.values.iddocumento;
            obj.notadebito = params.notadebito || null;
            obj.iddoc = (params.values) ? params.values.iddoc : null;
        } else if (params.tipoDoc == 5 || params.tipoDoc == 7 || params.tipoDoc == 8) {
            obj.docorigen = params.values.iddocumento;
        }

        obj.datosComunes = 1;
        obj.cliente = params.values.cliente;
        return obj;
    },
    /**
     *   4-Factuas a partir de doc(cargarDistribucion)          5-Factuas a partir de notas(cargarFacturas)
     *   6-Factuas a partir de aft (getDocumentosEntrega)        7- Factuas a partir de pedidos(cargarDocumentosPedidos)
     **/
    createAddWinFactura: function (params) {
        var _this = this;
        if (!_this.winAddFacturaByDoc || !_this.winAddFacturaByDoc.isVisible()) {
            _this.winAddFacturaByDoc = new LOG.fact.winAddFact({
                idioma: _this.idioma,
                modelo: _this.modelo,
                title: params.title,
                winFact: _this,
                closeAction: 'close',
                accion: params.accion,
                usarAplicar: false,
                subsistema: params.subsistema,
                tipoDoc: params.tipoDoc,
                configFact: params.configFacturacion,
                deshabilitarBotonesGrids: params.deshabilitarBotonesGrids,
                idoperacion: _this.idoperacion,
                //toolTipoDocumento:_this.toolTipoDocumento,
                /// filter: {tipoBusqueda: 1, estado: 3, facturado: true, solonotas: 1},
                filter: {
                    tipoBusqueda: 1,
                    tipoDoc: ((params.tipoDoc) ? params.tipoDoc : null),
                    idsubsistema: params.subsistema
                },
                urlAction: 'cargarDocumentos',
                notadebito: params.notadebito || null
                //columns: _this.createColumns(params.tipoDoc)
            });
        }
        _this.winAddFacturaByDoc.pGdList.getGridPrincipal().view = new Ext.grid.GridView({
            forceFit: true
        });
        _this.winAddFacturaByDoc.listaBotones.arrayData[2].disable();
        _this.winAddFacturaByDoc.pGdList.getGridPrincipal().on('rowclick', function (g) {
            if (g.getSelectionModel().getSelections().length > 0) {
                _this.winAddFacturaByDoc.listaBotones.arrayData[2].enable();
            } else {
                _this.winAddFacturaByDoc.listaBotones.arrayData[2].disable();
            }
        });
        _this.winAddFacturaByDoc.pGdList.getGridPrincipal().getSelectionModel().on('selectionchange', function (sm) {
            if (sm.getSelections().length > 0) {
                _this.winAddFacturaByDoc.listaBotones.arrayData[2].enable();
            } else {
                _this.winAddFacturaByDoc.listaBotones.arrayData[2].disable();
            }
        });

        _this.winAddFacturaByDoc.show();
        _this.winAddFacturaByDoc.doLayout();
    },
    createButtons: function (tipoDoc) {
        var me = this;
        var array = new LOG.util.List();
        array.add(new LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: this.idioma.lbTtEliminarAdd,
            controlFn: function (b, called) {
                if (me.grantedAction('CT') || me.grantedAction('RCRUD') || me.grantedAction('REliminar')) {
                    b.show();
                    b.disable();
                    if (me.winFactura.documento) {
                        b.enable();
                        if (me.winFactura.documento.json.estado != '1') {
                            b.disable();
                        }
                    }
                } else {
                    b.hide();
                }
            },
            handler: function () {
                me.eliminarDocumento(me.winFactura.documento, true);
            }
        }));
        array.add(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.lbTtBtnConfirmarNuevaFact,
            disabled: true,
            controlFn: function (b, called) {
                if (me.grantedAction('CT') || me.grantedAction('RCRUD') || me.grantedAction('RConfirmar')) {
                    b.show();
                    b.disable();
                    if (me.winFactura.documento) {
                        b.enable();
                        if (me.winFactura.documento.json.estado != '1') {
                            b.disable();
                        } else {
                            if (
                                (me.winFactura.documento.json.productos && me.winFactura.documento.json.productos > 0) ||
                                (me.winFactura.documento.json.servicios && me.winFactura.documento.json.servicios > 0)
                            ) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }
                } else {
                    b.hide();
                }
            },
            handler: function () {
                me.winFactura.functionBtnConfirmar();
            }
        }));
        if (tipoDoc != 1) {
            array.add(LOG.util.Prototipos.botonContabilizar({
                text: this.idioma.lbBtnFacturar,
                disabled: true,
                tooltip: this.idioma.lbTtBtnFacturarNuevaFact,
                controlFn: function (b, called) {
                    if (me.grantedAction('CT') || me.grantedAction('RContabilizar')) {
                        b.show();
                        b.disable();
                        if (me.winFactura.documento) {
                            if (me.winFactura.documento.json.oferta != 0) {
                                b.setVisible(false);
                            } else {
                                b.enable();
                                if (me.winFactura.documento.json.estado != '2') {
                                    b.disable();
                                }
                            }
                        }
                    } else {
                        b.hide();
                    }
                },
                handler: function () {
                    me.winFactura.functionBtnFacturar();
                }
            }));
        }
        array.add(LOG.util.UIManager.createBtn({
            text: this.idioma.lbMenuAnular,
            disabled: true,
            //tooltip: this.idioma.lbBtnAdicionar,
            iconCls: 'anular',
            controlFn: function (b) {
                if (me.winFactura.documento) {
                    b.enable();
                    var cont = 0;
                    Ext.each(b.menu.items.items, function (item) {
                        if (item.disabled) {
                            cont++;
                        }
                    });
                    if (cont == b.menu.items.items.length) {
                        b.disable();
                    }
                }
            },
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnAnularEstado,
                    iconCls: 'estado',
                    disabled: true,
                    controlFn: function (b, called) {
                        if (me.grantedAction('CT') || me.grantedAction('RCRUD') || me.grantedAction('RAnularestado')) {
                            b.show();
                            b.disable();
                            b.enable();
                            if (!me.winFactura.documento || (me.winFactura.documento.json.estado != '2' && me.winFactura.documento.json.estado != '3') || me.winFactura.documento.json.oferta == '2') {
                                b.disable();
                            }
                        } else {
                            b.hide();
                        }
                    },
                    handler: function () {
                        me.winFactura.functionBtnAnularEstatus();
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnAnularDocumento,
                    iconCls: 'copiar',
                    disabled: true,
                    controlFn: function (b, called) {
                        if (me.grantedAction('CT') || me.grantedAction('RAnular')) {
                            b.show();
                            b.enable();
                            if (!me.winFactura.documento || me.winFactura.documento.json.estado != '4') {
                                b.disable();
                            }
                        } else {
                            b.hide();
                        }
                    },
                    handler: function () {
                        me.winFactura.functionBtnAnularDocumento();
                    }
                })
            ]
        }));
        if (tipoDoc == 1) {
            array.add(LOG.util.Prototipos.botonAprobar({
                disabled: true,
                tooltip: this.idioma.lbTtBtnAprobarFact1,
                controlFn: function (b, called) {
                    if (me.grantedAction('CT') || me.grantedAction('RAprobar')) {
                        b.show();
                        b.disable();
                        if (me.winFactura.documento) {
                            b.enable();
                            if ((me.winFactura.documento.json.estado != '2' && me.winFactura.documento.json.estado != '10') || me.winFactura.documento.json.oferta != 1) {
                                b.disable();
                            }
                        }
                    } else {
                        b.hide();
                    }
                },
                handler: function () {
                    me.modelo.aprobar(me.winFactura.documento.json, function () {
                        me.winFactura.documento.json.estado = 3;
                        me.winFactura.setTitulo();
                        me.winFactura.habilitarBtn(3);
                    });
                }
            }));
        }
        //array.add(this.__comprobante.btnGenerar);
        array.add(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            hidden: true,
            text: this.idioma.lbBtnImprimirModelo,
            tooltip: this.idioma.ttBtnImprimir,
            iconCls: 'icondistra-imprimir',
            handler: function () {
                var selected = me.winFactura.documento.json;
                me.winFactura.functionBtnImprimirModelo({
                    isList: false,
                    name: ((selected.iddoc == iddocnotadebito || selected.iddoc == iddocnotacredito) ? 'NotaDebitoCredito' : me.name) + (window.alternativa && alternativa == true ? (selected.oferta != 0 ? 'OfertaDualModelo' : 'NDualModelo') : 'Modelo')
                });
            },
            controlFn: function (b, _caller) {
                if (me.grantedAction('CT') || me.grantedAction('RB')) {
                    b.setVisible(true);
                    if (me.winGestionarDocumento.documento) {
                        b.setDisabled(false);
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        array.add(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimirOD',
            hidden: true,
            text: 'Modelo despacho',
            tooltip: 'Imprimir orden de despacho',
            iconCls: 'icondistra-imprimir',
            handler: function () {
                var selected = me.winFactura.documento.json.iddoc;
                var nombreModelo = 'FacturacionDespachoModel';
                me.winFactura.functionBtnImprimirModelo({
                    isList: false,
                    name: nombreModelo,
                    od: 1
                });
            },
            controlFn: function (b, _caller) {
                if (me.grantedAction('CT') || me.grantedAction('RB')) {
                    b.setVisible(true);
                    if (me.winGestionarDocumento.documento) {
                        b.setDisabled(false);
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        return array;
    },
    finSeleccion: function (sel, array, eliminar) {
        if (!eliminar) {
            for (var i = 0; i < array.length; i++) {
                if (sel == array[i]) {
                    return i;
                }
            }
            return -1;
        } else {
            var auxiliar = new Array();
            for (var i = 0; i < array.length; i++) {
                if (sel != array[i]) {
                    auxiliar.push(array[i]);
                }
            }
            return auxiliar;
        }
    },
    createComboSubsistemas: function () {
        var _this = this;
        _this.getGridPrincipal().getSelectionModel().on('selectionchange', function (sm) {
            var colModel = _this.getGridPrincipal().getColumnModel();
            for (var i = 2; i < colModel.getColumnCount(); i++) {
                _this.getGridPrincipal().getColumnModel().setRenderer(i, function (value, md, rd, ri, ci, st) {
                    var dataIndex = colModel.getDataIndex(ci);
                    if (sm.isIdSelected(rd.id)) {
                        if (rd.json.oferta != 0) {
                            if (dataIndex == 'estado') {
                                return LOG.lb.documento.Estado[value];
                            } else if (dataIndex == 'idusuario') {
                                return _this.getUsuarioById(value);
                            } else if (dataIndex == 'deposito') {
                                return rd.json.depositofactura
                            } else if (dataIndex == 'valorconcepto') {
                                if (rd.json.tipoconceptoventa == 1) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    }
                                    return value;
                                } else if (rd.json.tipoconceptoventa == 0) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    }
                                    return value;
                                }
                                return value;
                            } else if (dataIndex == 'firmado') {
                                md.attr = 'style="background-color: rgba(255, 185, 201, 0);"';
                                if (rd.json.firmado == 1)
                                    md.css = 'icondistra-aceptar verde';
                                else
                                    md.css = 'icondistra-aceptar rojo';
                            } else {
                                return value;
                            }
                        } else if (rd.data.estado == 7) {
                            md.attr = 'style="background-color: rgba(217, 121, 143, 0.6);"';//#ffb9c9
                            if (dataIndex == 'estado') {
                                return LOG.lb.documento.Estado[value];
                            } else if (dataIndex == 'idusuario') {
                                return _this.getUsuarioById(value);
                            } else if (dataIndex == 'deposito') {
                                return rd.json.depositofactura
                            } else if (dataIndex == 'valorconcepto') {
                                if (rd.json.tipoconceptoventa == 1) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    }
                                    return value;
                                } else if (rd.json.tipoconceptoventa == 0) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    }
                                    return value;
                                }
                                return value;
                            } else if (dataIndex == 'firmado') {
                                md.attr = 'style="background-color: rgba(255, 185, 201, 0);"';
                                if (rd.json.firmado == 1)
                                    md.css = 'icondistra-aceptar verde';
                                else
                                    md.css = 'icondistra-aceptar rojo';
                            } else {
                                return value;
                            }
                        } else {
                            md.attr = 'style="background-color: rgba(169, 209, 175, 0.6);"';//#d7edda
                            if (dataIndex == 'estado') {
                                return LOG.lb.documento.Estado[value];
                            } else if (dataIndex == 'idusuario') {
                                return _this.getUsuarioById(value);
                            } else if (dataIndex == 'deposito') {
                                return rd.json.depositofactura
                            } else if (dataIndex == 'valorconcepto') {
                                if (rd.json.tipoconceptoventa == 1) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    }
                                    return value;
                                } else if (rd.json.tipoconceptoventa == 0) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    }
                                    return value;
                                }
                                return value;
                            } else if (dataIndex == 'firmado') {
                                md.attr = 'style="background-color: rgba(255, 185, 201, 0);"';
                                if (rd.json.firmado == 1)
                                    md.css = 'icondistra-aceptar verde';
                                else
                                    md.css = 'icondistra-aceptar rojo';
                            } else {
                                return value;
                            }
                        }
                    } else {
                        if (rd.json.oferta != 0) {
                            if (dataIndex == 'estado') {
                                return LOG.lb.documento.Estado[value];
                            } else if (dataIndex == 'idusuario') {
                                return _this.getUsuarioById(value);
                            } else if (dataIndex == 'deposito') {
                                return rd.json.depositofactura
                            } else if (dataIndex == 'valorconcepto') {
                                if (rd.json.tipoconceptoventa == 1) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    }
                                    return value;
                                } else if (rd.json.tipoconceptoventa == 0) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    }
                                    return value;
                                }
                                return value;
                            } else if (dataIndex == 'firmado') {
                                md.attr = 'style="background-color: rgba(255, 185, 201, 0);"';
                                if (rd.json.firmado == 1)
                                    md.css = 'icondistra-aceptar verde';
                                else
                                    md.css = 'icondistra-aceptar rojo';
                            } else {
                                return value;
                            }
                        } else if (rd.data.estado == 7) {
                            md.attr = 'style="background-color: rgba(255, 185, 201, 0.9);"';//#ffb9c9
                            if (dataIndex == 'estado') {
                                return LOG.lb.documento.Estado[value];
                            } else if (dataIndex == 'idusuario') {
                                return _this.getUsuarioById(value);
                            } else if (dataIndex == 'deposito') {
                                return rd.json.depositofactura
                            } else if (dataIndex == 'valorconcepto') {
                                if (rd.json.tipoconceptoventa == 1) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    }
                                    return value;
                                } else if (rd.json.tipoconceptoventa == 0) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    }
                                    return value;
                                }
                                return value;
                            } else if (dataIndex == 'firmado') {
                                md.attr = 'style="background-color: rgba(255, 185, 201, 0);"';
                                if (rd.json.firmado == 1)
                                    md.css = 'icondistra-aceptar verde';
                                else
                                    md.css = 'icondistra-aceptar rojo';
                            } else {
                                return value;
                            }
                        } else {
                            md.attr = 'style="background-color: rgba(215, 237, 218, 0.9);"';//#d7edda
                            if (dataIndex == 'estado') {
                                return LOG.lb.documento.Estado[value];
                            } else if (dataIndex == 'idusuario') {
                                return _this.getUsuarioById(value);
                            } else if (dataIndex == 'deposito') {
                                return rd.json.depositofactura
                            } else if (dataIndex == 'valorconcepto') {
                                if (rd.json.tipoconceptoventa == 1) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                    }
                                    return value;
                                } else if (rd.json.tipoconceptoventa == 0) {
                                    if (rd.json.conceptoventa == '+') {
                                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    } else if (rd.json.conceptoventa == '-') {
                                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                    }
                                    return value;
                                }
                                return value;
                            } else if (dataIndex == 'firmado') {
                                md.attr = 'style="background-color: rgba(255, 185, 201, 0);"';
                                if (rd.json.firmado == 1)
                                    md.css = 'icondistra-aceptar verde';
                                else
                                    md.css = 'icondistra-aceptar rojo';
                            } else {
                                return value;
                            }
                        }
                    }
                });
            }
            _this.getGridPrincipal().getView().refresh();
        });
        _this.getGridPrincipal().getSelectionModel().on('rowselect', function (sm, index, r) {
            if (_this.finSeleccion(index, _this.seleccionAnterior) == -1)
                _this.seleccionAnterior.push(index);
        });
        _this.getGridPrincipal().getSelectionModel().on('rowdeselect', function (sm, index, r) {
            _this.seleccionAnterior = _this.finSeleccion(index, _this.seleccionAnterior, true);
        });
        _this.getGridPrincipal().getStore().on('load', function () {
            //_this.getGridPrincipal().getSelectionModel().
            //_this.cmbFindDocOrigen.getStore().load();
            if (_this.seleccionAnterior.length == 0) {
                //_this.getGridPrincipal().getSelectionModel().selectFirstRow();
            } else {
                _this.getGridPrincipal().getSelectionModel().selectRows(_this.seleccionAnterior);
            }
            var colModel = _this.getGridPrincipal().getColumnModel();
            var rowIndex = new Array();
            for (var i = 2; i < colModel.getColumnCount(); i++) {
                _this.getGridPrincipal().getColumnModel().setRenderer(i, function (value, md, rd, ri, ci, st) {
                    var dataIndex = colModel.getDataIndex(ci);
                    if (rd.json.oferta != 0) {
                        if (dataIndex == 'estado') {
                            return LOG.lb.documento.Estado[value];
                        } else if (dataIndex == 'idusuario') {
                            return _this.getUsuarioById(value);
                        } else if (dataIndex == 'deposito') {
                            return rd.json.depositofactura
                        } else if (dataIndex == 'valorconcepto') {
                            if (rd.json.tipoconceptoventa == 1) {
                                if (rd.json.conceptoventa == '+') {
                                    return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                } else if (rd.json.conceptoventa == '-') {
                                    return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                }
                                return value;
                            } else if (rd.json.tipoconceptoventa == 0) {
                                if (rd.json.conceptoventa == '+') {
                                    return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                } else if (rd.json.conceptoventa == '-') {
                                    return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                }
                                return value;
                            }
                            return value;
                        } else if (dataIndex == 'firmado') {
                            md.attr = 'style="background-color: rgba(255, 185, 201, 0);"';
                            if (rd.json.firmado == 1)
                                md.css = 'icondistra-aceptar verde';
                            else
                                md.css = 'icondistra-aceptar rojo';
                        } else {
                            return value;
                        }
                    } else if (rd.data.estado == 7) {
                        md.attr = 'style="background-color: rgba(255, 185, 201, 0.9);"';//#ffb9c9
                        if (dataIndex == 'estado') {
                            return LOG.lb.documento.Estado[value];
                        } else if (dataIndex == 'idusuario') {
                            return _this.getUsuarioById(value);
                        } else if (dataIndex == 'deposito') {
                            return rd.json.depositofactura
                        } else if (dataIndex == 'valorconcepto') {
                            if (rd.json.tipoconceptoventa == 1) {
                                if (rd.json.conceptoventa == '+') {
                                    return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                } else if (rd.json.conceptoventa == '-') {
                                    return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                }
                                return value;
                            } else if (rd.json.tipoconceptoventa == 0) {
                                if (rd.json.conceptoventa == '+') {
                                    return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                } else if (rd.json.conceptoventa == '-') {
                                    return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                }
                                return value;
                            }
                            return value;
                        } else if (dataIndex == 'firmado') {
                            md.attr = 'style="background-color: rgba(255, 185, 201, 0);"';
                            if (rd.json.firmado == 1)
                                md.css = 'icondistra-aceptar verde';
                            else
                                md.css = 'icondistra-aceptar rojo';
                        } else {
                            return value;
                        }
                    } else {
                        md.attr = 'style="background-color: rgba(215, 237, 218, 0.9);"';//#d7edda
                        if (dataIndex == 'estado') {
                            return LOG.lb.documento.Estado[value];
                        } else if (dataIndex == 'idusuario') {
                            return _this.getUsuarioById(value);
                        } else if (dataIndex == 'valorconcepto') {
                            if (rd.json.tipoconceptoventa == 1) {
                                if (rd.json.conceptoventa == '+') {
                                    return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                } else if (rd.json.conceptoventa == '-') {
                                    return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '%' + '</span>';
                                }
                                return value;
                            } else if (rd.json.tipoconceptoventa == 0) {
                                if (rd.json.conceptoventa == '+') {
                                    return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                } else if (rd.json.conceptoventa == '-') {
                                    return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                                }
                                return value;
                            }
                            return value;
                        } else if (dataIndex == 'deposito') {
                            return rd.json.depositofactura
                        } else if (dataIndex == 'firmado') {
                            md.attr = 'style="background-color: rgba(255, 185, 201, 0);"';
                            if (rd.json.firmado == 1)
                                md.css = 'icondistra-aceptar verde';
                            else
                                md.css = 'icondistra-aceptar rojo';
                        } else {
                            return value;
                        }
                    }
                });
            }
            _this.getGridPrincipal().getView().refresh();
        });
        _this.getGridPrincipal().getStore().on('beforeload', function () {
            var conn = _this.getGridPrincipal().getStore().proxy.getConnection();
            if (conn.isLoading()) {
                //conn.abort();
            }
            /*for (var i = 1; i < _this.listaBotones.arrayData.length - 1; i++) {
             if (_this.listaBotones.arrayData[i].type == "button" */
            /*&& (!_this.listaBotones.arrayData[i].menu)*/
            /*) {
             _this.listaBotones.arrayData[i].disable();

             }
             }*/
            _this.listaBotones.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(this, [b, _this]).call();
                }
            }.createDelegate(_this));

        });
        _this.cmbSubsistemas = new LOG.util.ComboBox({
            editable: false,
            url: 'cargarSubsistemas',
            hiddenName: 'idnomoperaciones',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            listeners: {
                select: function (cmb, rd) {
                    _this.idoperacion = cmb.getValue();
                    _this.mayorista = rd.json.vm;
                    _this.idcondicionpagodefault = rd.json.idcondiciondefecto;
                    _this.idsubsistema = rd.json.idsubsistema;
                    var hidden = (_this.idsubsistema != LOG.util.Subsistemas.inventario) ? true : false;
                    var hiddenProd = (_this.idsubsistema == -1 && !_this.manualproductos) ? true : false;
                    _this.getGridPrincipal().getColumnModel().setHidden(_this.getGridPrincipal().getColumnModel().findColumnIndex('deposito'), hidden);
                    _this.getGridPrincipal().getColumnModel().setHidden(_this.getGridPrincipal().getColumnModel().findColumnIndex('productos'), hiddenProd);
                    _this.btnGenerarFactura.setVisible(/*((_this.idsubsistema != 113) ? true : false)*/false);
                    _this.btnGenerarFactura.setTooltip(((_this.idsubsistema == -1) ? _this.idioma.lbTtBtnGenerarFactura : _this.idioma.lbTtBtnGenerarFactura1));
                    _this.btnGenerarFactura.setText(((_this.idsubsistema == -1) ? _this.idioma.lbBtnGenerarFactura : _this.idioma.lbBtnGenerarFactura1));
                    _this.getGridPrincipal().getStore().removeAll();
                    _this.getGridPrincipal().getStore().initBaseParams.idsubsistema = _this.idsubsistema;
                    _this.getGridPrincipal().getStore().initBaseParams.idoperacion = _this.idoperacion;
                    _this.addBotonAdicionar(_this.idsubsistema);
                    _this.seleccionAnterior = new Array();
                    _this.getGridPrincipal().getStore().load();
                    if (_this.idsubsistema != LOG.util.Subsistemas.inventario) {
                        _this.cmbFindDeposito.setVisible(false);
                    } else {
                        _this.cmbFindDeposito.setVisible(true);
                        //_this.cmbFindDeposito.getStore().load();
                    }
                }
            }
        });
        _this.cmbSubsistemas.getStore().on('load', function (st, rd, op) {
            if (rd.length > 0) {
                _this.manualproductos = true;
                _this.arrayOperaciones = {};
                _this.arrayOperaciones[LOG.util.Subsistemas.inventario] = new Array();
                _this.arrayOperaciones[LOG.util.Subsistemas.facturacion] = new Array();
                _this.arrayOperaciones[LOG.util.Subsistemas.activosfijos] = new Array();
                _this.arrayOperaciones[LOG.util.Subsistemas.talleres] = new Array();
                Ext.each(rd, function (r) {
                    if (r.data.idsubsistema == LOG.util.Subsistemas.inventario) {
                        _this.manualproductos = false;
                    }
                    if (r.json.idsubsistema != -2) {
                        _this.arrayOperaciones[(r.json.idsubsistema == -1) ? LOG.util.Subsistemas.facturacion : r.json.idsubsistema].push([r.data.idnomoperaciones, r.data.denominacion]);
                    }
                });
                _this.idsubsistema = rd[0].json.idsubsistema;
                _this.idoperacion = rd[0].json.idnomoperaciones;
                _this.cmbSubsistemas.setValue(rd[0].data.idnomoperaciones);
                var hidden = (rd[0].data.idsubsistema != LOG.util.Subsistemas.inventario) ? true : false;
                var hiddenProd = (_this.idsubsistema == -1 && !_this.manualproductos) ? true : false;
                _this.getGridPrincipal().getColumnModel().setHidden(_this.getGridPrincipal().getColumnModel().findColumnIndex('deposito'), hidden);
                _this.getGridPrincipal().getColumnModel().setHidden(_this.getGridPrincipal().getColumnModel().findColumnIndex('productos'), hiddenProd);
                _this.btnGenerarFactura.setVisible(false/*((_this.idsubsistema != 113) ? true : false)*/);
                _this.btnGenerarFactura.setTooltip(((_this.idsubsistema == -1) ? _this.idioma.lbTtBtnGenerarFactura : _this.idioma.lbTtBtnGenerarFactura1));
                _this.btnGenerarFactura.setText(((_this.idsubsistema == -1) ? _this.idioma.lbBtnGenerarFactura : _this.idioma.lbBtnGenerarFactura1));
                _this.getGridPrincipal().getStore().initBaseParams.idsubsistema = rd[0].data.idsubsistema;
                _this.getGridPrincipal().getStore().initBaseParams.idoperacion = _this.idoperacion;
                _this.addBotonAdicionar(_this.idsubsistema);
                _this.seleccionAnterior = new Array();
                _this.getGridPrincipal().getStore().load();
                if (_this.idsubsistema != LOG.util.Subsistemas.inventario) {
                    _this.cmbFindDeposito.setVisible(false);
                } else {
                    _this.cmbFindDeposito.setVisible(true);
                    //_this.cmbFindDeposito.getStore().load();
                }
            }
        })
        return {
            border: false,
            tbar: ['-', '->', new Ext.form.Label({text: _this.idioma.lbSubsistemas}), '&nbsp', _this.cmbSubsistemas]
        };
    },
    view: function () {
        var _this = this;
        this.cargaInicial(function (r) {
            _this.usuarios = r[0].usuarios;
            LOG.lb.documento.View.superclass.view.call(_this);
            _this.__comprobante.modelo.urlController = '/logistica/facturacion/facturacion/comun_fact/index.php/comprobantefact/';
            _this.__comprobante.modelo.bindGridPanel(_this.getGridPrincipal());
        });
    },
});
LOG.fact.gridGeneral = Ext.extend(LOG.util.UITemplate, {
    busquedaBasica: true,
    busquedaAvanzada: true,
    formaVisualizacion: 'panel',
    widthAvanzada: '50%',
    modoSeleccion: 3,
    autoLoad: false,
    gridEditable: true,
    constructor: function (config) {
        var _this = this;
        config.urlBusquedaGridPrincipal = config.url;
        config = Ext.apply(_this, config);
        LOG.fact.gridGeneral.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        for (var i = 0; i < _this.gColumns.count(); i++) {
            _this.addGridColumn(_this.gColumns.getItem(i));
        }

    },
    render: function () {
        var _this = this;
        var p = LOG.fact.gridGeneral.superclass.render.call(this);
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                //if()
                st.initBaseParams = _this.filter;
            }
        });
        return p;
    }
});