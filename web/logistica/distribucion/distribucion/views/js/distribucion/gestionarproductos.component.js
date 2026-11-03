LOG.dist.distribucion.Productos = Ext.extend(LOG.util.UITemplate, {
    record: undefined,
    operacion: undefined,
    hideComponent: undefined,
    alternativa: undefined,
    codContable: undefined,
    codAlternativa: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.autoSelect = false;
        this.concepto = config.idioma.lbconcepto;
        this.textBusquedaSimple = config.idioma.lbCampoBusquedaProductos;
        this.gridEditable = true;
        config.idGridPrincipal = 'idprodorden';
        this.urlBusquedaGridPrincipal = 'cargarProductosDocumento';
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        this.record = config.record;
        this.operacion = config.operacion;
        this.hideComponent = config.hideComponent;
        this.alternativa = config.alternativa;
        this.codContable = config.codContable;
        this.codAlternativa = config.codAlternativa;
        config.idioma = LOG.dist.distribucion.Idioma;
        this.modelo = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });
        LOG.dist.distribucion.Productos.superclass.constructor.call(this, config);
        this.modelo.iddocumento = this.datos.iddocumento;
        this.setTitulo();
    },
    initDefaultColumns: function () {
        var _this = this;
        let isFarmacia = typeof farmacia !== "undefined" && farmacia == 1;

        this.addGridColumn({
            header: this.idioma.cgCodigo,
            dataIndex: 'codigo',
            hidden: (parseInt(_this.record.data.cant_productos) != 0 && parseInt(_this.record.data.cant_productos) < parseInt(_this.record.data.cant_clientes)) ? true : false,
            hideable: false,
            default: true,
            sortable: true,
            summaryType: 'count',
            summaryRenderer: function (v, params, data) {
                return _this.idioma.lbTotal;
            }
        });

        if(isFarmacia == 1) {
            this.addGridColumn({
                header: 'Nº. lote',
                width: 150,
                dataIndex: "numerolote",
                default: true,
                filter: {
                    type: "string",
                    emptyText: 'N\xfamero de lote',
                    dataIndex: "numerolote",
                },
            });

            this.addGridColumn({
                header: 'Fecha vencimiento lote',
                width: 100,
                dataIndex: "fechavencelote",
                default: true
            });
        }

        /*this.addGridColumn({
            header: this.idioma.cgCodigoProveedor,
            dataIndex: 'codigoproveedor',
            hidden: (parseInt(_this.record.data.cant_productos) != 0 && parseInt(_this.record.data.cant_productos) < parseInt(_this.record.data.cant_clientes)) ? true : false,
            hideable: false,
            default: true,
            sortable: true
        });*/

        this.addGridColumn({
            header: this.idioma.cgProducto,
            dataIndex: (parseInt(_this.record.data.cant_productos) < parseInt(_this.record.data.cant_clientes)) ? 'coddenominacion' : 'denominacion',
            hideable: false,
            default: true,
            autoExpand: true,
            hidden: (parseInt(_this.record.data.cant_productos) != 0 && parseInt(_this.record.data.cant_productos) < parseInt(_this.record.data.cant_clientes)) ? true : false,
            agrupador: (parseInt(_this.record.data.cant_productos) != 0 && parseInt(_this.record.data.cant_productos) < parseInt(_this.record.data.cant_clientes)) ? true : false
        });

        this.addGridColumn({
            header: (_this.record && _this.record.data.tipodestino == 1) ? this.idioma.cgCliente : this.idioma.cgDestino,
            hideable: false,
            default: true,
            dataIndex: 'cliente',
            autoExpand: true,
            sortable: true,
            agrupador: (parseInt(_this.record.data.cant_productos) == 0 || (parseInt(_this.record.data.cant_clientes) <= parseInt(_this.record.data.cant_productos))) ? true : false,
            hidden: (parseInt(_this.record.data.cant_productos) == 0 || parseInt(_this.record.data.cant_clientes) <= parseInt(_this.record.data.cant_productos)) ? true : false,
            summaryType: 'count',
            summaryRenderer: function (v, params, data) {
                //return v + ' ' + LOG.util.Idioma.lbItems;
                return _this.idioma.lbTotal;
            },
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return record.json.nombre;
            }
        });

        if (this.columnaCategoria()) {
            this.addGridColumn({
                header: _this.idioma.cgCategoria,
                width: 80,
                dataIndex: 'nomcategoria',
                default: true
            });
        }

        this.addGridColumn({
            header: this.idioma.cgUM,
            autoExpand: true,
            dataIndex: 'umedida',
            hideable: false,
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgNacionalidad,
            autoExpand: true,
            dataIndex: 'nacionalidad',
            hidden: (parseInt(_this.record.data.cant_productos) != 0 && parseInt(_this.record.data.cant_productos) < parseInt(_this.record.data.cant_clientes)) ? true : false,
            hideable: false,
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgUbicacion,
            width: 170,
            align: 'right',
            dataIndex: 'ubicacion',
            default: true
        });

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistencia,
            dataIndex: 'existencia',
            align: 'right',
            hidden: _this.record.data.estado == 3,
            hideable: false,
            default: true,
            autoExpand: true,
            sortable: true,
            renderer: function (value, metaData, record) {
                if (record.json && record.json.existencia_area) {
                    return record.json.existencia_area;
                }
                return value;
            }
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgDisponible,
            dataIndex: 'disponible',
            align: 'right',
            hidden: _this.record.data.estado == 3,
            hideable: false,
            default: true,
            autoExpand: true,
            sortable: true,
            renderer: function (value, metaData, record) {
                if (record.json && record.json.disponible_area) {
                    return record.json.disponible_area;
                }
                return value;
            }
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: (_this.hideComponent == 1) ? _this.idioma.cgDistribuida : _this.idioma.cgCantEntregar,
            dataIndex: 'cantidad',
            align: 'right',
            hideable: false,
            default: true,
            autoExpand: true,
            sortable: true,
            type: 'float',
            summaryType: 'sum',
            filter: {
                type: 'string',
                emptyText: (_this.hideComponent == 1) ? _this.idioma.cgDistribuida : _this.idioma.cgCantEntregar,
                dataIndex: 'cantidad'
            },
            renderer: function (value, metaData, record) {
                console.log(metaData)
                console.log(record)
                return value;
            },
            editor: (_this.hideComponent == 1) ? false : LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function (t) {
                        t.selectText(0, t.getValue().length);
                    },
                }
            })
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.cgPrecio + ' ' + _this.codContable,
            dataIndex: 'preciocontable',
            align: 'right',
            autoExpand: true,
            hideable: false,
            default: true,
            sortable: true,
            renderer: function (v) {
                return v;
            }
        }));

        if (_this.alternativa) {
            this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
                header: this.idioma.cgPrecio + ' ' + _this.codAlternativa,
                dataIndex: 'precioalternativo',
                align: 'right',
                autoExpand: true,
                hideable: false,
                default: true,
                sortable: true,
                renderer: function (v) {
                    return v;
                }
            }));
        }

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporte + ' ' + _this.codContable,
            dataIndex: 'importe',
            align: 'right',
            autoExpand: true,
            hideable: false,
            default: true,
            sortable: true,
            summaryType: 'importetotal',
            renderer: function (v) {
                return v;
            }
        }));

        if (_this.alternativa) {
            this.addGridColumn(LOG.util.Prototipos.columnaImporte({
                header: this.idioma.cgImporte + ' ' + _this.codAlternativa,
                dataIndex: 'importealternativo',
                align: 'right',
                autoExpand: true,
                hideable: false,
                default: true,
                sortable: true,
                summaryType: 'importetotalcuc',
                renderer: function (v) {
                    return v;
                }
            }));
        }

        this.addGridColumn({
            header: this.idioma.cgDeposito,
            dataIndex: 'deposito',
            hideable: false,
            default: true,
            align: 'right',
            sortable: true,
            autoExpand: true
        });

        this.addGridColumn({
            hidden: true,
            hideable: false,
            dataIndex: 'idprodorden'
        });

        this.addGridColumn({
            hidden: true,
            hideable: false,
            dataIndex: 'idcliente'
        });

        this.addGridColumn({
            hidden: true,
            hideable: false,
            dataIndex: 'importetotal'
        });

        this.addGridColumn({
            hidden: true,
            hideable: false,
            dataIndex: 'importetotalcuc'
        });

        this.addGridColumn({
            hidden: true,
            hideable: false,
            dataIndex: 'tienelote'
        });

        this.addGridColumn({
            hidden: true,
            hideable: false,
            dataIndex: 'idproducto'
        });

        this.addGridColumn({
            hidden: true,
            hideable: false,
            dataIndex: 'idindicador'
        });

        this.addGridColumn({
            hidden: true,
            hideable: false,
            dataIndex: 'idestructura'
        });
    },
    init: function () {
        var _this = this;
        LOG.dist.distribucion.Productos.superclass.init.call(this);
        this.getVistaPrincipal().listaBotones.getItem(1).hide();

        this.getVistaPrincipal().listaBotones.getItem(2).disable();

        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;

        this.lbCantidadText = new Ext.form.Label({
            text: this.idioma.lbImporteTotal,
            style: 'padding: 10px 10px 0px 0px;font-weight: bolder;font-size: 12px;',
            tabular: true
        });

        this.lbCantidadTextCUC = new Ext.form.Label({
            text: this.idioma.lbImporteTotalCUC,
            style: 'padding: 10px 10px 0px 0px;font-weight: bolder;font-size: 12px;',
            tabular: true
        });
        
        this.panelImporte = LOG.util.UIManager.initPanel({
            region: 'south',
            border: false,
            layout: 'form',
            tbar: ['->', this.lbCantidadText, ' ', (_this.alternativa) ? this.lbCantidadTextCUC : ' ']
        });

        this.getPanelGrid().onRender = this.getPanelGrid().onRender.createSequence(function () {
            this.getPanelGrid().add(this.panelImporte);
        }, this);
    },
    render: function () {
        var _this = this;

        Ext.ux.grid.GroupSummary.Calculations['importetotalcuc'] = function (_v, _record, field) {
            return _v + (_record.data.cantidad * _record.data.precioalternativo);
        };

        Ext.ux.grid.GroupSummary.Calculations['importetotal'] = function (v, record, field) {
            return v + (record.data.cantidad * record.data.preciocontable);
        };

        this.summary = new Ext.ux.grid.GroupSummary({
            doAllWidths: Ext.emptyFn,
            doHidden: Ext.emptyFn
        });
        this.addGridPlugin(this.summary);

        var _res = LOG.dist.distribucion.Productos.superclass.render.call(this);

        this.getSmPrincipal().moveEditorOnEnter = true;

        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            iddocumento: (_this.record.data.iddocumento) ? _this.record.data.iddocumento : -1
        });

        this.getGridPrincipal().on({
            'beforeedit': function (e) {

                if (_this.record && _this.record.data.estado != 1 || _this.hideComponent == 1 || _this.record.data.tipodestino == 4) {
                    e.cancel = true;
                } else {
                    e.cancel = false;
                    if (e.record.json.decimales == '0') {
                        e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputEntero({}));
                    } else {
                        e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputDecimal({}));
                    }
                }


            },
            'afteredit': function (e) {
                _this.habilitarBotones();
                if (e.field == "cantidad") {
                    console.info(e)
                    if ((parseFloat(e.record.data.disponible) + parseFloat(e.record.json.cantidad)) < parseFloat(e.record.data.cantidad)) {
                        e.record.data.cantidad = e.originalValue;
                        mostrarMensaje(3, _this.idioma.msgMayorCantidad);
                    }
                }
            }

        });

        this.getStorePrincipal().on({
            'load': function (st, records, op) {
                var importe = 0;
                var importecuc = 0;
                var agrupadopor;
                if (records.length > 0) {
                    _this.getStorePrincipal().groupBy((parseInt(st.reader.jsonData.cantclientes) <= parseInt(st.reader.jsonData.cantproductos)) ? 'cliente' : 'coddenominacion');
                    _this.listaBotones.getItem(2).setTooltip(parseInt(st.reader.jsonData.cantclientes) <= parseInt(st.reader.jsonData.cantproductos) ? _this.idioma.ttBtnEliminarProducto : _this.idioma.ttBtnEliminarCliente);
                    _this.listaBotones.getItem(3).setTooltip(parseInt(st.reader.jsonData.cantclientes) <= parseInt(st.reader.jsonData.cantproductos) ? _this.idioma.ttBtnEliminarProductosDocumento : _this.idioma.ttBtnEliminarClientesDocumento);
                    if (parseInt(st.reader.jsonData.cantproductos) < parseInt(st.reader.jsonData.cantclientes)) {
                        _this.ocultarColumna('codigo');
                        _this.ocultarColumna('codigoproveedor');
                        _this.ocultarColumna('coddenominacion');
                        _this.ocultarColumna('nacionalidad');
                    } else {
                        _this.ocultarColumna('codigo', false);
                        _this.ocultarColumna('codigoproveedor', false);
                        _this.ocultarColumna('denominacion', false);
                        _this.ocultarColumna('nacionalidad', false);
                    }
                }

                if (st.data.items[0]) {
                    importe = st.reader.jsonData.importetotal;
                    importeTotal = Ext.util.Format.number(importe, '0,000.00');
                    importecuc = st.reader.jsonData.importetotalcuc;
                    importeTotalAlt = Ext.util.Format.number(importecuc, '0,000.00');
                }

                _this.lbCantidadText.setText(_this.idioma.lbImporteTotalContable + ' ' + _this.codContable + ': ' + importeTotal);
                _this.lbCantidadTextCUC.setText(_this.idioma.lbImporteTotalAlternativo + ' ' + _this.codAlternativa + ': ' + importeTotalAlt);
            }
        });

        this.getStorePrincipal().load();

        return _res;
    },
    columnaCategoria: function () {
        return (typeof usarCategoria !== 'undefined' && usarCategoria == true) && this.mostrarCategoria !== false;
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: this.idioma.ttBtnAdicionarProductos,
            disabled: true,
            handler: function () {
                if (_this.record.data.cant_clientes == 0) {
                    mostrarMensaje(3, _this.idioma.msgValidarAddProducto);
                } else {
                    var objSubmit = {};
                    objSubmit.identidad = Ext.encode(_this._parent.cmbEntidad.getValue() ? _this._parent.cmbEntidad.getValue() : _this.datos.id);
                    /*Ext.Ajax.request({
                        url: 'getSubordinacionEntidad',
                        params: objSubmit,
                        callback: function (o, s, resp) {
                            var respMsg = Ext.decode(resp.responseText);
                            if (respMsg.datos) {
                                var _p = new LOG.lb.documento.VentanaProductos({
                                    idioma: _this.idioma,
                                    _parent: _this,
                                    usarFiltroArea: false,
                                    usarFiltroDeposito: true,
                                    parametros: {
                                        iddocumento: _this.modelo.iddocumento,
                                        idestructura: Ext.encode(respMsg.datos),
                                        idseleccionados: Ext.encode(_this.getStorePrincipal().collect('idproducto')),
                                        conexistencia: 1,
                                        condisponible: 1,
                                        comprometida: true,
                                        identidad: _this._parent.cmbEntidad.getValue() ? _this._parent.cmbEntidad.getValue() : _this.datos.id
                                    },
                                    doAction: function (r) {
                                        var _p = this;
                                        var _productos = new Array();
                                        var _idestructura = new Array();
                                        var _idProdSeleccionados = [];

                                        Ext.each(r, function (rec) {
                                            _productos.push({
                                                idproducto: rec.get('idproducto'),
                                                cantidad: rec.get('cantidad'),
                                                rotar: 1
                                            });
                                            _idestructura.push({
                                                idestructura: rec.json.idestructura
                                            });
                                            _idProdSeleccionados.push(rec.json.idproducto)
                                        });

                                        _this.modelo.adicionarMovimientos({
                                            idproductos: Ext.encode(_productos),
                                            idestructuras: Ext.encode(_idestructura)
                                        }, function (resp) {
                                            _p.postSalvar.createDelegate(_p, [resp, _idProdSeleccionados]).call();
                                        });
                                    },
                                    postSalvar: function (r, _idProdSelecc) {
                                        if (_this.record == null) {
                                            _this.record = {};
                                            Ext.apply(_this.record, {
                                                data: {
                                                    cant_productos: r.cantproductos,
                                                    cant_clientes: r.cantclientes
                                                }
                                            });
                                        } else {
                                            _this.record.data.cant_productos = r.cantproductos;
                                            _this.record.data.cant_clientes = r.cantclientes;
                                        }

                                        _this.getStorePrincipal().load();
                                        _this.model.getStore().reload();

                                        if (_p) {
                                            _p.getStorePrincipal().reload(
                                                _p.getStorePrincipal().initBaseParams.idseleccionados = Ext.encode(Ext.decode(_p.getStorePrincipal().baseParams.idseleccionados).concat(_idProdSelecc)),
                                                _p.getStorePrincipal().baseParams.idseleccionados = Ext.encode(Ext.decode(_p.getStorePrincipal().baseParams.idseleccionados).concat(_idProdSelecc))
                                            );
                                        }
                                    }
                                });
                                _p.init();
                                _p.urlBusquedaGridPrincipal = '/logistica/distribucion/distribucion/index.php/distribucion/cargarproductos'
                                _this.vistaProductos = _p.view();
                                _this.vistaProductos.show();
                            }
                        }
                    });*/
                    var arrayNotInidnaturaleza = new Array();
                    arrayNotInidnaturaleza.push(-8,-7);
                    var _p = new LOG.lb.documento.VentanaProductos({
                        idioma: _this.idioma,
                        _parent: _this,
                        usarFiltroArea: false,
                        usarFiltroDeposito: true,
                        parametros: {
                            iddocumento: _this.modelo.iddocumento,
                            idestructura: (_this.record && _this.record.data.tipodestino != 4) ? Ext.encode(depositos) : null,
                            idseleccionados: Ext.encode(_this.getStorePrincipal().collect('idproducto')),
                            conexistencia: 1,
                            condisponible: 1,
                            comprometida: (_this.record && _this.record.data.tipodestino != 4) ? true : null,
                            identidad: idEntidad,
                            explotacion: (_this.record && _this.record.data.tipodestino == 4) ? 1 : 0,
                            idnaturaleza: (_this.record && _this.record.data.tipodestino == 4) ? -5 : 0,
                            idnaturalezaexcluir: (_this.record && _this.record.data.tipodestino == 4) ? arrayNotInidnaturaleza : 0,
                            prodareas: (_this.record && _this.record.data.tipodestino == 4) ? true : false
                        },
                        doAction: function (r) {
                            var _p = this;
                            var _productos = new Array();
                            var _idestructura = new Array();
                            var _idProdSeleccionados = [];

                            Ext.each(r, function (rec) {
                                _productos.push({
                                    idproducto: rec.get('idproducto'),
                                    cantidad: (_this.record && _this.record.data.tipodestino != 4) ? rec.get('cantidad') : 1,
                                    rotar: 1
                                });
                                _idestructura.push({
                                    idestructura: rec.json.idestructura
                                });
                                _idProdSeleccionados.push(rec.json.idproducto)
                            });

                            _this.modelo.adicionarMovimientos({
                                idproductos: Ext.encode(_productos),
                                idestructuras: Ext.encode(_idestructura)
                            }, function (resp) {
                                _p.postSalvar.createDelegate(_p, [resp, _idProdSeleccionados]).call();
                            });
                        },
                        postSalvar: function (r, _idProdSelecc) {
                            if (_this.record == null) {
                                _this.record = {};
                                Ext.apply(_this.record, {
                                    data: {
                                        cant_productos: r.cantproductos,
                                        cant_clientes: r.cantclientes
                                    }
                                });
                            } else {
                                _this.record.data.cant_productos = r.cantproductos;
                                _this.record.data.cant_clientes = r.cantclientes;
                            }

                            _this.getStorePrincipal().load();
                            _this.model.getStore().reload();

                            if (_p) {
                                _p.getStorePrincipal().reload(
                                    _p.getStorePrincipal().initBaseParams.idseleccionados = Ext.encode(Ext.decode(_p.getStorePrincipal().baseParams.idseleccionados).concat(_idProdSelecc)),
                                    _p.getStorePrincipal().baseParams.idseleccionados = Ext.encode(Ext.decode(_p.getStorePrincipal().baseParams.idseleccionados).concat(_idProdSelecc))
                                );
                            }
                        }
                    });
                    _p.init();
                    _p.urlBusquedaGridPrincipal = '/logistica/distribucion/distribucion/index.php/distribucion/cargarproductos'
                    _this.vistaProductos = _p.view();
                    _this.vistaProductos.show();
                }
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    b.disable();
                    if (_this.record && _this.record.data.estado == 1) {
                        b.enable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        var recepcion = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.lbBtnAdicionarProductosRecepcion,
            tooltip: _this.idioma.ttBtnAdicionarProductosRecepcion,
            disabled: true,
            handler: function () {
                if (_this.record.data.cant_clientes == 0) {
                    mostrarMensaje(3, _this.idioma.msgValidarAddProducto);
                } else {
                    Ext.Ajax.request({
                        url: 'getSubordinacionEntidad',
                        callback: function (o, s, resp) {
                            var respMsg = Ext.decode(resp.responseText);
                            if (respMsg.datos) {
                                var recepcion = new LOG.dist.distribucion.recepcion({
                                    idioma: _this.idioma,
                                    baseParams: {
                                        idestructura: Ext.encode(respMsg.datos)
                                    },
                                    aceptarFn: function (iddocumento) {
                                        _this.modelo.cargarMovRecepcion(iddocumento, function (r) {
                                            var _productos = new Array();
                                            var _idestructura = new Array();
                                            Ext.each(r, function (rec) {

                                                _productos.push({
                                                    idrecepcion: rec.idrecepcion,
                                                    idproducto: rec.idproducto,
                                                    cantidad: rec.cantidad,
                                                    entero: (rec.decimales == '0') ? 1 : 0,
                                                    recepcion: true
                                                });
                                                _idestructura.push({idestructura: rec.idestructura});
                                            });

                                            _this.modelo.adicionarMovimientos({
                                                idproductos: Ext.encode(_productos),
                                                idestructuras: Ext.encode(_idestructura)
                                            }, function (r) {
                                                if (r.success) {
                                                    _this.getStorePrincipal().load();
                                                    _this.model.getStore().reload();
                                                } else {
                                                    mostrarMensaje(3, _this.idioma.msgProductosExisten);
                                                }
                                            });
                                        });
                                    }
                                });
                                recepcion.attachPlugin(new LOG.lb.plugin.ComboDepositos({}, 1));
                                recepcion.init();
                                recepcion.view();
                            }
                        }
                    });
                }
            },
            controlFn: function (b) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.record.data.tipodistribucion == 3 || _this.model.tipodistribucion == 3) {
                        b.show();
                        b.disable();
                        if (_this.record && _this.record.data.estado == 1) {
                            b.enable();
                        }
                    } else {
                        b.hide();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        recepcion.key = null;
        this.addToolbarButton(recepcion);

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: (_this.record.data.cant_clientes > _this.record.data.cant_productos) ? this.idioma.ttBtnEliminarCliente : this.idioma.ttBtnEliminarProducto,
            disabled: true,
            handler: function () {
                var idprodorden = new Array();
                var idcliente = new Array();
                if (_this.record.data.cant_clientes > _this.record.data.cant_productos) {
                    _this.idioma.msgDeleteMovObjeto = _this.idioma.msgDeleteCliente;
                    _this.idioma.msgObjetoEliminadoMov = _this.idioma.msgClienteEliminado;
                } else {
                    _this.idioma.msgDeleteMovObjeto = _this.idioma.msgDeleteProducto;
                    _this.idioma.msgObjetoEliminadoMov = _this.idioma.msgProductoEliminado;
                }

                if (!_this.smGridPrincipal.hasSelection()) {
                    mostrarMensaje(1, _this.idioma.msgSelectProductoDistribuir);
                    return;
                } else {
                    Ext.each(_this.smGridPrincipal.getSelections(), function (rec) {
                        idprodorden.push(rec.data.idprodorden);
                        idcliente.push(rec.data.idcliente);
                    });
                    _this.modelo.eliminarMovimientos(idprodorden, function (r) {
                        if (_this.record == null) {
                            _this.record = {};
                            Ext.apply(_this.record, {
                                data: {
                                    cant_productos: r.cantproductos,
                                    cant_clientes: r.cantclientes
                                }
                            });
                        } else {
                            _this.record.data.cant_productos = r.cantproductos;
                            _this.record.data.cant_clientes = r.cantclientes;
                        }

                        _this.getStorePrincipal().load();
                        _this.model.getStore().reload();
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('REliminar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && (_this.record && _this.record.data.estado == 1)) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.lbBtnEliminarDocumentos,
            tooltip: (_this.record.data.cant_clientes > _this.record.data.cant_productos) ? _this.idioma.ttBtnEliminarClientesDocumento : _this.idioma.ttBtnEliminarProductosDocumento,
            disabled: true,
            handler: function () {
                var idmovimientos = new Array();
                var idprodorden = new Array();
                var idclientes = new Array();

                if (_this.record.data.cant_clientes > _this.record.data.cant_productos) {
                    _this.idioma.msgDeleteMovObjeto = _this.idioma.msgDeleteMovCliente;
                    _this.idioma.msgObjetoEliminadoDoc = _this.idioma.msgClientesEliminados;
                } else {
                    _this.idioma.msgDeleteMovObjeto = _this.idioma.msgDeleteMovProducto;
                    _this.idioma.msgObjetoEliminadoDoc = _this.idioma.msgProductosEliminados;
                }

                if (!_this.smGridPrincipal.hasSelection()) {
                    mostrarMensaje(1, _this.idioma.msgSelectProductoCliente);
                    return;
                } else {
                    Ext.each(_this.smGridPrincipal.getSelections(), function (rec) {
                        if (_this.record.data.cant_clientes > _this.record.data.cant_productos) {
                            idclientes.push(rec.data.idcliente);
                        } else {
                            idmovimientos.push(rec.data.idproducto);
                            idprodorden.push(rec.data.idprodorden);
                        }
                    });
                    _this.modelo.eliminarClientesProductos(idmovimientos, idclientes, idprodorden, function (r) {
                        if (_this.record == null) {
                            _this.record = {};
                            Ext.apply(_this.record, {
                                data: {
                                    cant_productos: r.cantproductos,
                                    cant_clientes: r.cantclientes
                                }
                            });
                        } else {
                            _this.record.data.cant_productos = r.cantproductos;
                            _this.record.data.cant_clientes = r.cantclientes;
                        }
                        if (_this._parent.winGestionarDocumento.stGridDetalles) {
                            _this._parent.winGestionarDocumento.cargarProductos();
                        }
                        _this.getStorePrincipal().load();
                        _this.model.getStore().reload();
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('REliminar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && (_this.record && _this.record.data.estado == 1)) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.LbBtnDistribuir,
            iconCls: 'distribucion',
            tooltip: this.idioma.ttBtnDistribuirProductos,
            disabled: true,
            handler: function () {
                if (!_this.smGridPrincipal.getSelections()) {
                    mostrarMensaje(1, _this.idioma.msgSelectProductoDistribuir);
                } else {
                    var _productos = new Array();
                    var _clientes = new Array();
                    var _indicadores = new Array();
                    var idmovimientos = new Array();
                    var idproducto = 0;
                    var idindicador = 0;
                    _this.idioma.msgObjetoEliminadoDoc = _this.idioma.msgNoDistribuidosEliminados;

                    Ext.each(_this.getStorePrincipal().data.items, function (rec) {
                        if (idproducto != rec.data.idproducto) {
                            idproducto = rec.data.idproducto;
                            _productos.push(rec.data.idproducto);
                        }
                        if (idindicador != rec.data.idindicador) {
                            idindicador = rec.data.idindicador;
                            _indicadores.push(rec.data.idindicador);
                        }
                        _clientes.push(rec.data.idcliente);
                    });

                    _this.modelo.realizarPropuestaDistribucion({
                        idproducto: Ext.encode(_productos),
                        idcliente: Ext.encode(_clientes),
                        idindicador: Ext.encode(_indicadores),
                        idestructuraop: Ext.encode(_this.smGridPrincipal.getSelected().data.idestructura)
                    }, function (r) {
                        if (r.nodistribuidos != null) {
                            for (var i = 0; i < r.nodistribuidos; i++) {
                                Ext.each(_this.getStorePrincipal().data.items, function (rec) {
                                    if (r.arrayproductos[i] == rec.data.idproducto) {
                                        idmovimientos.push(rec.data.idproducto);
                                    }
                                });
                            }

                            _this.modelo.eliminarClientesProductos(idmovimientos, null, null, function (r) {
                                if (_this.record == null) {
                                    _this.record = {};
                                    Ext.apply(_this.record, {
                                        data: {
                                            cant_productos: r.cantproductos,
                                            cant_clientes: r.cantclientes
                                        }
                                    });
                                } else {
                                    _this.record.data.cant_productos = r.cantproductos;
                                    _this.record.data.cant_clientes = r.cantclientes;
                                }

                                _this.getStorePrincipal().load();
                                _this.model.getStore().reload();
                            }, true);
                        } else {
                            _this.getStorePrincipal().reload();
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_this.hideComponent == 1 && (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RDistribuir'))) {
                    b.setVisible(true);
                    _caller.getStorePrincipal().fireEvent = _caller.getStorePrincipal().fireEvent.createSequence(function (e) {
                        if (e == 'load') {
                            if (_this.getStorePrincipal().getTotalCount() > 0 && (_this.record && _this.record.data.estado == 1)) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            disabled: true,
            handler: function () {
                _this.modelo.confirmarDistribucion(_this.datos, function (r) {
                    if (_this._parent.winGestionarDocumento && _this._parent.winGestionarDocumento.isInit()) {
                        if (_this._parent.winGestionarDocumento.record == null) {
                            _this._parent.winGestionarDocumento.record = {};
                            Ext.apply(_this._parent.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "2"
                                }
                            });
                        } else {
                            _this._parent.winGestionarDocumento.record.data.estado = "2";
                        }
                        _this._parent.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                        _this._parent.habilitarElementosWindow();
                    }
                    _this.model.getStore().reload();
                    if (_this.record == null) {
                        _this.record = {};
                        Ext.apply(_this.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "2"
                            }
                        });
                    } else {
                        _this.record.data.estado = 2;
                        _this.setTitulo();
                    }
                    _this.listaBotones.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                }, function (r) {
                    var idclientes = new Array();
                    if (r.noconfirmados != null) {
                        var noconfirmados = r.noconfirmados[0];
                        Ext.each(noconfirmados, function (rec) {
                            idclientes.push(rec.idcliente);
                        });
                        for (r in r.noconfirmados[0]) {
                            mostrarMensaje(2, _this.idioma.msgConfirmarClienteSinProducto, function (btn) {
                                if (btn == 'ok') {
                                    Ext.MessageBox.wait(_this.idioma.msgConfirmandoObjeto, _this.idioma.msgEspere || '...');
                                    var objSubmit = {};
                                    objSubmit.id = (_this.record.data.iddocumento) ? Ext.encode([_this.record.data.iddocumento]) : Ext.encode(this.modelo.iddocumento);
                                    objSubmit.idclientes = Ext.encode(idclientes);
                                    objSubmit.confsinproducto = 1;
                                    Ext.Ajax.request({
                                        url: 'confirmarDocumento',
                                        params: objSubmit,
                                        callback: function (o, s, res) {
                                            Ext.MessageBox.hide();
                                            var resp = LOG.util.UIManager.decodeAjaxResponse(res);
                                            if (resp.success) {
                                                if (s) {
                                                    mostrarMensaje(1, _this.idioma.msgDocumentoConfirmado);

                                                    if (_this._parent.winGestionarDocumento && _this._parent.winGestionarDocumento.isInit()) {
                                                        if (_this._parent.winGestionarDocumento.record == null) {
                                                            _this._parent.winGestionarDocumento.record = {};
                                                            Ext.apply(_this._parent.winGestionarDocumento.record, {
                                                                data: {
                                                                    iddocumento: r.iddocumento,
                                                                    estado: "2"
                                                                }
                                                            });
                                                        } else {
                                                            _this._parent.winGestionarDocumento.record.data.estado = "2";
                                                        }
                                                        _this._parent.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                                                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                                                            if (typeof b.controlFn == 'function') {
                                                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                                                            }
                                                        }, _this._parent.winGestionarDocumento);
                                                        _this._parent.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                                                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                                                            if (typeof b.controlFn == 'function') {
                                                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                                                            }
                                                        }, _this._parent.winGestionarDocumento);
                                                        _this._parent.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                                                        _this._parent.habilitarElementosWindow();
                                                    }

                                                    _this._parent.winGestionarDocumento.cargarProductos();
                                                    _this.model.getStore().reload();

                                                    if (_this.record == null) {
                                                        _this.record = {};
                                                        Ext.apply(_this.record, {
                                                            data: {
                                                                iddocumento: r.iddocumento,
                                                                estado: "2"
                                                            }
                                                        });
                                                    } else {
                                                        _this.record.data.estado = 2;
                                                    }
                                                    _this.listaBotones.each(function (b) {
                                                        LOG.util.UIManager.applyKey(b, _this);
                                                        if (typeof b.controlFn == 'function') {
                                                            b.controlFn.createDelegate(_this, [b, _this]).call();
                                                        }
                                                    }, _this);
                                                }
                                            } else {
                                                mostrarMensaje(1, _this.idioma.msgDocumentoNoConfirmado);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    if ( _this.record && _this.record.data.estado == 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnular,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado(_this.datos, function (r) {
                    if (_this._parent.winGestionarDocumento && _this._parent.winGestionarDocumento.isInit()) {
                        if (_this._parent.winGestionarDocumento.record == null) {
                            _this._parent.winGestionarDocumento.record = {};
                            Ext.apply(_this._parent.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "1"
                                }
                            });
                        } else {
                            _this._parent.winGestionarDocumento.record.data.estado = "1";
                        }
                        _this._parent.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                        _this._parent.habilitarElementosWindow();
                    }
                    _this.model.getStore().reload();
                    if (_this.record == null) {
                        _this.record = {};
                        Ext.apply(_this.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    } else {
                        _this.record.data.estado = 1;
                        _this.setTitulo();
                    }
                    _this.listaBotones.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RAnularestado') || _this._parent.grantedAction('RAnular')) {
                    b.setVisible(true);
                    if (_this.record && _this.record.data.estado == 2) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            disabled: true,
            handler: function () {
                _this.modelo.aprobar(_this.datos, function (r) {
                    if (_this._parent.winGestionarDocumento && _this._parent.winGestionarDocumento.isInit()) {
                        if (_this._parent.winGestionarDocumento.record == null) {
                            _this._parent.winGestionarDocumento.record = {};
                            Ext.apply(_this._parent.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "3"
                                }
                            });
                        } else {
                            _this._parent.winGestionarDocumento.record.data.estado = "3";
                        }
                        _this._parent.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                        _this._parent.habilitarElementosWindow();
                    }
                    _this.model.getStore().reload();
                    if (_this.record == null) {
                        _this.record = {};
                        Ext.apply(_this.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "3"
                            }
                        });
                    } else {
                        _this.record.data.estado = 3;
                    }
                    _this.setTitulo();
                    _this._parent.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.listaBotones.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                    _this.ocultarColumna('existencia');
                    _this.ocultarColumna('disponible');
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    if (_this.record && _this.record.data.estado == 2) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimirModelo,
            text: _this.idioma.lbBtnImprimirModelo,
            handler: function () {
                _this._parent.onReport({
                    isList: false,
                    name: _this._parent.name + 'Modelo'
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RB')) {
                    b.setVisible(true);
                    if (_this.record) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        LOG.util.UIManager.apply(_this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: 'Cerrar'
        }, true));

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), LOG.util.Prototipos.botonGuardar({
            key: {
                alt: true,
                key: 'G'
            },
            tooltip: this.idioma.ttBtnGuardarProducto,
            hidden: (_this.hideComponent != 1 && (_this.record && _this.record.data.estado != 3)) ? false : true,
            disabled: true,
            handler: function () {
                var arrayObj = new Array();
                var record = _this.storePrincipal.getModifiedRecords();
                Ext.each(record, function (rec) {
                    arrayObj.push({
                        idprodorden: rec.data.idprodorden,
                        cantidad: rec.data.cantidad
                    });
                });
                _this.modelo.salvarCantidades(arrayObj, function (resp) {
                    _this.getStorePrincipal().reload();
                });
                _this.getStorePrincipal().commitChanges();
                this.setDisabled(true);
            },
            controlFn: function (b, _caller) {
                if (_this.record && _this.record.data.estado == 3) {
                    b.hide();
                } else {
                    b.show();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            if (_this.record && _this.record.data.estado == 1 && _this.storePrincipal.getModifiedRecords()) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                }
            }
        }));
    },
    habilitarBotones: function () {
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    codigoProveedor: function (v) {
        var _this = this;
        if (!v) {
            return '-';
        }
    },
    actualizarProductosAdd: function (winProd) {
        var _this = this;
        winProd.getStorePrincipal().reload(
            winProd.getStorePrincipal().initBaseParams.idseleccionados = Ext.encode(_this.getStorePrincipal().collect('idproducto'))
        );
    },
    setTitulo: function () {
        var _this = this;
        _this.ventanaProd = (_this.operacion == 1) ? _this.idioma.tlVentanaAdicionarProductosPDistribucion : _this.idioma.tlVentanaAdicionarProductosDManual;
        _this.documento = (_this.record.data.nrodoc) ? _this.record.data.nrodoc : _this.record.data.numeroref;
        _this.getVistaPrincipal().setTitle(String.format(_this.ventanaProd, _this.documento, _this.record.data.fechacontable, LOG.lb.documento.Estado[_this.record.data.estado]));
    },
    onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    }
});

LOG.dist.distribucion.ProductosDistribucion = Ext.extend(LOG.util.UITemplate, {
    record: undefined,
    mostrarCategoria: true,
    constructor: function (config) {
        this.autoLoad = false;
        this.gridEditable = true;
        this.autoSelect = false;
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        this.urlBusquedaGridPrincipal = 'cargarProductosDistribucion';
        this.modoSeleccion = 1;
        this.concepto = 'productos';
        this.idGridPrincipal = 'idprodorden';
        this.formaVisualizacion = 'ventana';
        this.record = config.record;
        config.idioma = LOG.dist.distribucion.Idioma;
        this.modelo = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });
        LOG.dist.distribucion.ProductosDistribucion.superclass.constructor.call(this, config);
        this.modelo.iddocumento = config.datos.iddocumento;
        this.modelo.tipodistribucion = config.datos.tipodistribucion;
        this.modelo.iddocumento = this.iddocumento;
        this.estado = this.datos.estado;
        this.setTitulo();
    },
    render: function () {
        var _this = this;

        this.summary = new Ext.ux.grid.GroupSummary({
            doAllWidths: Ext.emptyFn,
            doHidden: Ext.emptyFn
        });
        this.addGridPlugin(this.summary);

        var render = LOG.dist.distribucion.ProductosDistribucion.superclass.render.call(this);
        LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, {
            iddocumento: (_this.record.data.iddocumento) ? _this.record.data.iddocumento : -1,
            pedido: (_this.record.data.tipodistribucion == 2) ? 1 : 0,
            isreserva: (_this.record.data.tipodistribucion == 4) ? 1 : 0,
            isbalanceo: (_this.record.data.tipodistribucion == 6) ? 1 : 0,
        });
        _this.getStorePrincipal().load();

        this.getSmPrincipal().moveEditorOnEnter = true;

        this.getGridPrincipal().on({
            'beforeedit': function (e) {
                if (_this.record && _this.record.data.estado != 1) {
                    e.cancel = true;
                } else {
                    e.cancel = false;
                    if (e.record.json.decimales == '0') {
                        e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputEntero({}));
                    } else {
                        e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputDecimal({}));
                    }
                }
            },
            'afteredit': function (e) {
                _this.habilitarBotones();
            }
        });
        return render;
    },
    columnaCategoria: function () {
        return (typeof usarCategoria !== 'undefined' && usarCategoria == true) && this.mostrarCategoria !== false;
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: 'Producto',
            width: 360,
            dataIndex: 'text',
            default: true,
            autoExpand: true,
            summaryType: 'count',
            summaryRenderer: function (v, params, data) {
                return _this.idioma.lbTotal;
            }
        });

        this.addGridColumn({
            header: (typeof esminfar !== 'undefined' && esminfar) ? this.idioma.cgNroPieza : this.idioma.cgCodigoProveedor,
            dataIndex: 'codigoproveedor',
            hidden: (typeof confArmamento !== 'undefined' && confArmamento) ? true : false,
            hideable: false,
            default: true,
            sortable: true
        });

        if (this.columnaCategoria()) {
            this.addGridColumn({
                header: this.idioma.cgCategoria,
                width: 80,
                dataIndex: 'nomcategoria',
                default: true
            });
        }

        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 60,
            dataIndex: 'umedida',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgNacionalidad,
            width: 100,
            dataIndex: 'nacionalidad',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgUbicacion,
            width: 160,
            dataIndex: 'deposito',
            default: true
        });

        this.addGridColumn({
            header: 'Pedida',
            width: 90,
            dataIndex: 'pedida',
            align: 'right',
            default: true,
            renderer: function (v) {
                return v;
            }
        });

        this.addGridColumn({
            header: this.idioma.cgDistribuida,
            width: 90,
            dataIndex: 'distribuida',
            align: 'right',
            default: true,
            type: 'float',
            summaryType: 'sum',
            renderer: function (v) {
                return v;
            }
        });

        this.addGridColumn({
            header: this.idioma.cgDisponible,
            hidden: _this.record.data.estado == 3,
            width: 90,
            dataIndex: 'disponible',
            align: 'right',
            default: true,
            renderer: function (v) {
                return v;
            }
        });

        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 120,
            dataIndex: 'cantidad',
            align: 'right',
            default: true,
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function (t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            }),
            type: 'float',
            summaryType: 'sum',
            renderer: function (v) {
                return v;
            }
        });

        this.addGridColumn({
            dataIndex: 'idproducto'
        });

        this.addGridColumn({
            header: 'Cliente',
            width: 200,
            agrupador: true,
            hidden: true,
            dataIndex: 'cliente'
        });

        this.addGridColumn({
            dataIndex: 'idpedido'
        });

        this.addGridColumn({
            dataIndex: 'idcliente'
        });

        this.addGridColumn({
            dataIndex: 'idindicador'
        });

        this.addGridColumn({
            dataIndex: 'idprodorden'
        });

        this.addGridColumn({
            dataIndex: 'idestructura'
        });
    },
    init: function () {
        var _this = this;
        LOG.dist.distribucion.ProductosDistribucion.superclass.init.call(this);
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;
        if (_this.record.data.tipodistribucion != 4) {
            this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {

                _this.PanelEste = new LOG.dist.distribucion.PanelEste({
                    idioma: this.idioma,
                    model: this.modelo,
                    panelAgrupado: this,
                    _parent: _this._parent
                });
                _this.PanelEste.init();
                var vistaEste = _this.PanelEste.view();
                this.listaBotonesAlter = new LOG.util.List();
                this.listaBotonesAlter.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
                    scope: this,
                    text: LOG.util.Idioma.lbBtnOcultar,
                    tooltip: this.idioma.lbTtOcultarPanelProdAlternativos,
                    handler: function () {
                        _this.PanelRegionEste.collapse(true);
                    }
                })));
                _this.PanelRegionEste = LOG.util.UIManager.initPanel({
                    title: this.idioma.lbBtnProductoAternativo,
                    layout: 'fit',
                    region: 'east',
                    width: '30%',
                    frame: true,
                    hideCollapseTool: true,
                    titleCollapse: true,
                    autoScroll: true,
                    collapsible: true,
                    collapseMode: 'mini',
                    animCollapse: true,
                    animate: true,
                    collapsed: true,
                    buttons: this.listaBotonesAlter.getArray(),
                    items: [vistaEste],
                    listeners: {
                        'collapse': function () {
                            this.hide();
                            _this.bntProductoAlternativo.show();
                            _this.getPanelGrid().doLayout();
                        },
                        'beforeexpand': function () {
                            this.show();
                            _this.bntProductoAlternativo.hide();
                            _this.getPanelGrid().doLayout();
                        }
                    }
                });
                _this.getPanelGrid().add(_this.PanelRegionEste);
                this.bntProductoAlternativo = LOG.util.UIManager.createBtn({
                    text: this.idioma.lbBtnProductoAternativo,
                    iconCls: 'producto',
                    tooltip: this.idioma.ttBtnAdicionarProductosAlternativo,
                    handler: function () {
                        _this.PanelRegionEste.expand();
                    }
                });
                _this.panelBotones.getTopToolbar().add('->');
                _this.panelBotones.getTopToolbar().add(this.bntProductoAlternativo);

                this.PanelEste.getGridPrincipal().on({
                    'afteredit': function (e) {
                        _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                        //_this.editarProductoDistribucion(e.record.data);
                    },
                    'beforeedit': function (e) {
                        if (_this.record && _this.record.data.estado != 1) {
                            e.cancel = true;
                        } else {
                            e.cancel = false;
                        }
                    }
                });

                _this.PanelEste.getStorePrincipal().on({
                    'beforeload': function () {
                        var datos = _this.getStorePrincipal().getRange(0, _this.getStorePrincipal().getCount());
                        var idproductoorigen = new Array();
                        Ext.each(datos, function (producto) {
                            if (producto.data.idindicador == _this.getSmPrincipal().getSelected().json.idindicador && producto.data.idcliente == _this.getSmPrincipal().getSelected().json.idcliente) {
                                idproductoorigen.push(producto.data.idproducto);
                            }
                        });
                        if (_this.record.data.iddocumento && _this.getSmPrincipal().getSelected()) {
                            this.initBaseParams.iddocumento = _this.record.data.iddocumento;
                            this.initBaseParams.pedido = true;
                            this.initBaseParams.idproductoorigen = Ext.encode(idproductoorigen);
                            this.initBaseParams.idclienteorigen = _this.getSmPrincipal().getSelected().json.idcliente;
                            this.initBaseParams.idindicadororigen = _this.getSmPrincipal().getSelected().json.idindicador;
                        } else {
                            this.initBaseParams.iddocumento = -1;
                            this.initBaseParams.pedido = true;
                            this.initBaseParams.idproductoorigen = -1;
                            this.initBaseParams.idclienteorigen = -1;
                            this.initBaseParams.idindicadororigen = -1;
                        }
                    }
                });

                _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange' && this.getCount() == 1) {
                        _this.PanelEste.getStorePrincipal().load();
                    }
                });
            }, this);
        }
    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.util.UIManager.apply(_this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: 'Cerrar'
        }, true));

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), LOG.util.Prototipos.botonGuardar({
            hidden: (_this.record && _this.record.data.estado == 3) ? true : false,
            disabled: true,
            handler: function () {
                var cantidadTotal = 0;
                var datos = _this.getStorePrincipal().getRange(0, _this.getStorePrincipal().getCount());
                Ext.each(datos, function (producto) {
                    if (producto.data.idindicador == _this.getSmPrincipal().getSelected().json.idindicador && producto.data.idcliente == _this.getSmPrincipal().getSelected().json.idcliente) {
                        cantidadTotal += parseInt(producto.data.cantidad);
                    }
                });
                if (_this.PanelEste) {
                    var datosAlternativos = _this.PanelEste.storePrincipal.getRange(0, _this.PanelEste.storePrincipal.getCount());
                    Ext.each(datosAlternativos, function (alternativo) {
                        cantidadTotal += parseInt(alternativo.data.cantidad);
                    });
                }
                if ((_this.getSmPrincipal().getSelected().data.pedida - _this.getSmPrincipal().getSelected().data.distribuida) >= cantidadTotal) {
                    var record = _this.storePrincipal.getModifiedRecords();
                    var arrayObj = new Array();
                    Ext.each(record, function (rec) {
                        arrayObj.push({
                            idprodorden: rec.data.idprodorden,
                            cantidad: rec.data.cantidad
                        });
                    });
                    if (_this.PanelEste) {
                        var recordEste = _this.PanelEste.storePrincipal.getModifiedRecords();
                        Ext.each(recordEste, function (recEste) {
                            arrayObj.push({
                                idprodorden: recEste.data.idprodorden,
                                cantidad: recEste.data.cantidad
                            });
                        });
                    }

                    _this.modelo.salvarCantidades(arrayObj, function (resp) {
                        _this.getStorePrincipal().reload();
                    });
                    _this.getStorePrincipal().commitChanges();
                    this.setDisabled(true);
                } else {
                    mostrarMensaje(3, _this.idioma.msgMayorPedido);
                }
            }
        }));

        var _this = this;
        if (_this.record && _this.record.data.tipodistribucion != 4) {
            this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
                tooltip: this.idioma.ttBtnAdicionarProductos,
                disabled: true,
                menu: [
                    new Ext.menu.Item({
                        text: this.idioma.lbBtnPedido,
                        handler: function () {
                            var _pedidos = new LOG.dist.distribucion.VentanaPedidos({
                                idioma: _this.idioma,
                                _parent: _this,
                                parametros: {
                                    idseleccionados: (_this._parent.winGestionarDocumento.stGridDetalles) ? Ext.encode(_this._parent.winGestionarDocumento.stGridDetalles.collect('idpedido')) : Ext.encode(_this.storePrincipal.collect('idpedido'))
                                },
                                doAction: function (r) {
                                    var _pedidos = new Array();
                                    var _clientes = new Array();

                                    Ext.each(r, function (rec) {
                                        _pedidos.push({
                                            idpedido: rec.get('iddocumento'),
                                            tipodistribucion: 2
                                        });

                                        _clientes.push({
                                            idcliente: rec.get('idcliente'),
                                            tipocliente: 1
                                        });
                                    });
                                    _this.modelo.adicionarPedidos({
                                        idcliente: Ext.encode(_clientes),
                                        idpedido: Ext.encode(_pedidos),
                                        idindicador: Ext.encode(_this.storePrincipal.collect('idindicador'))
                                    }, function (r) {
                                        _this.getStorePrincipal().reload();
                                    });
                                }
                            });
                            _pedidos.init();
                            _this.vistaPedidos = _pedidos.view().setTitle(_this.idioma.tlVentanaPedidosSeleccion);
                            _this.vistaPedidos.show();
                        }
                    }),
                    new Ext.menu.Item({
                        text: this.idioma.lbBtnCliente,
                        handler: function () {
                            var clientes = new LOG.dist.distribucion.VentanaClientes({
                                idioma: _this.idioma,
                                _parent: _this,
                                parametros: {
                                    listaClientes: Ext.encode(_this.storePrincipal.collect('idcliente')),
                                    idpedido: Ext.encode(_this.storePrincipal.collect('idpedido')),
                                    tipodistribucion: 2
                                },
                                doAction: function (r) {
                                    var _clientes = new Array();

                                    Ext.each(r, function (rec) {
                                        _clientes.push({
                                            idcliente: rec.get('idcliente'),
                                            tipocliente: 1
                                        });
                                    });
                                    _this.modelo.adicionarDestinos({
                                        distribucion: 2,
                                        idcliente: Ext.encode(_clientes)
                                    }, function (r) {
                                        _this._parent.winGestionarDocumento.cargarProductos();
                                        _this.model.getStore().reload();
                                    });
                                }
                            });
                            clientes.init();
                            _this.vistaClientes = clientes.view();
                            _this.vistaClientes.show();
                        }
                    }),
                    new Ext.menu.Item({
                        text: this.idioma.lbBtnProducto,
                        handler: function () {
                            /*_this.modelo.getIndicadoresPedido(function (res) {
                                var _p = new LOG.lb.documento.VentanaProductos({
                                    idioma: _this.idioma,
                                    _parent: _this,
                                    usarFiltroArea: false,
                                    usarFiltroDeposito: true,
                                    parametros: {
                                        idseleccionados: Ext.encode(_this.getStorePrincipal().collect('idproducto')),
                                        idindicadorprod: Ext.encode(res.datos),
                                        comprometida: true
                                    },
                                    doAction: function (r) {
                                        var _productos = new Array();
                                        Ext.each(r, function (rec) {
                                            _productos.push({
                                                idproducto: rec.get('idproducto')
                                            });
                                        });

                                        _this.modelo.adicionarMovimientos({
                                            pedido: true,
                                            idproductos: Ext.encode(_productos)
                                        }, function (r) {
                                            _this.getStorePrincipal().reload();
                                            _this.model.getStore().reload();
                                        });
                                    }
                                });
                                _p.init();
                                _this.vistaProductos = _p.view();
                                _this.vistaProductos.show();
                                _p.getStorePrincipal().load();
                            });*/
                            Ext.Ajax.request({
                                url: 'getSubordinacionEntidad',
                                callback: function (o, s, resp) {
                                    var respMsg = Ext.decode(resp.responseText);
                                    if (respMsg.datos) {
                                        _this.modelo.getIndicadoresPedido(function (res) {
                                            var _p = new LOG.lb.documento.VentanaProductos({
                                                idioma: _this.idioma,
                                                _parent: _this,
                                                usarFiltroArea: false,
                                                usarFiltroDeposito: false,
                                                parametros: {
                                                    idseleccionados: Ext.encode(_this.getStorePrincipal().collect('idproducto')),
                                                    idindicadorprod: Ext.encode(res.datos),
                                                    idestructura: Ext.encode(respMsg.datos),
                                                    conexistencia: 1,
                                                    condisponible: 1,
                                                    comprometida: true
                                                },
                                                doAction: function (r) {
                                                    var _p = this;
                                                    var _productos = new Array();
                                                    var _idestructura = new Array();
                                                    var _idProdSeleccionados = [];

                                                    Ext.each(r, function (rec) {
                                                        _productos.push({
                                                            idproducto: rec.get('idproducto')
                                                        });
                                                        _idestructura.push({
                                                            idestructura: rec.json.idestructura
                                                        });
                                                        _idProdSeleccionados.push(rec.json.idproducto)
                                                    });

                                                    _this.modelo.adicionarMovimientos({
                                                        pedido: true,
                                                        idproductos: Ext.encode(_productos)
                                                    }, function (resp) {
                                                        _p.postSalvar.createDelegate(_p, [resp, _idProdSeleccionados]).call();
                                                    });
                                                },
                                                postSalvar: function (r, _idProdSelecc) {
                                                    if (_this._parent.winGestionarDocumento.record == null) {
                                                        _this._parent.winGestionarDocumento.record = {};
                                                        Ext.apply(_this._parent.winGestionarDocumento.record, {
                                                            data: {
                                                                cant_productos: r.cantproductos,
                                                                cant_clientes: r.cantclientes
                                                            }
                                                        });
                                                    } else {
                                                        _this.record.data.cant_productos = r.cantproductos;
                                                        _this._parent.winGestionarDocumento.record.data.cant_clientes = r.cantclientes;
                                                    }

                                                    _this.getStorePrincipal().reload();
                                                    _this.model.getStore().reload();

                                                    if (_p) {
                                                        _p.getStorePrincipal().reload(
                                                            _p.getStorePrincipal().initBaseParams.idseleccionados = Ext.encode(Ext.decode(_p.getStorePrincipal().baseParams.idseleccionados).concat(_idProdSelecc)),
                                                            _p.getStorePrincipal().baseParams.idseleccionados = Ext.encode(Ext.decode(_p.getStorePrincipal().baseParams.idseleccionados).concat(_idProdSelecc))
                                                        );
                                                    }
                                                }
                                            });
                                            _p.init();
                                            _this.vistaProductos = _p.view();
                                            _this.vistaProductos.show();
                                        })
                                    }
                                }
                            });
                        }
                    })
                ],
                controlFn: function (b, _caller) {
                    if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RAdicionar')) {
                        b.setVisible(true);
                        b.disable();
                        if (!_this.record || (_this.record && _this.record.data.estado == 1)) {
                            b.enable();
                        }
                    } else {
                        b.setVisible(false);
                    }
                }
            }));
        }
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnEliminarElemento,
            disabled: true,
            handler: function () {
                var idprodorden = new Array();
                if (_this.smGridPrincipal.getSelections()) {
                    Ext.each(_this.smGridPrincipal.getSelections(), function (rec) {
                        idprodorden.push(rec.data.idprodorden);
                    });
                    _this.modelo.eliminarMovimientos(idprodorden, function () {
                        _this.getStorePrincipal().reload();
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('REliminar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && _this.record && _this.record.data.estado == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            disabled: true,
            handler: function () {
                _this.modelo.confirmarDistribucion(_this.datos, function (r) {

                    if (_this._parent.winGestionarDocumento && _this._parent.winGestionarDocumento.isInit()) {
                        if (_this._parent.winGestionarDocumento.record == null) {
                            _this._parent.winGestionarDocumento.record = {};
                            Ext.apply(_this._parent.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "2"
                                }
                            });
                        } else {
                            _this._parent.winGestionarDocumento.record.data.estado = "2";
                        }
                        _this._parent.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                        _this._parent.habilitarElementosWindow();
                    }
                    _this.model.getStore().reload();
                    if (_this.record == null) {
                        _this.record = {};
                        Ext.apply(_this.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "2"
                            }
                        });
                    } else {
                        _this.record.data.estado = 2;
                        _this.setTitulo();
                    }
                    _this.listaBotones.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    if (_this.record && _this.record.data.estado == 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnularEstado,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado(_this.datos, function (r) {
                    if (_this._parent.winGestionarDocumento && _this._parent.winGestionarDocumento.isInit()) {
                        if (_this._parent.winGestionarDocumento.record == null) {
                            _this._parent.winGestionarDocumento.record = {};
                            Ext.apply(_this._parent.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "1"
                                }
                            });
                        } else {
                            _this._parent.winGestionarDocumento.record.data.estado = "1";
                        }
                        _this._parent.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                        _this._parent.habilitarElementosWindow();
                    }
                    _this.model.getStore().reload();
                    if (_this.record == null) {
                        _this.record = {};
                        Ext.apply(_this.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    } else {
                        _this.record.data.estado = 1;
                        _this.setTitulo();
                    }
                    _this.listaBotones.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RAnularestado') || _this._parent.grantedAction('RAnular')) {
                    b.setVisible(true);
                    if (_this.record && _this.record.data.estado == 2) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            handler: function () {
                _this.modelo.aprobar(_this.datos, function (r) {
                    if (_this._parent.winGestionarDocumento && _this._parent.winGestionarDocumento.isInit()) {
                        if (_this._parent.winGestionarDocumento.record == null) {
                            _this._parent.winGestionarDocumento.record = {};
                            Ext.apply(_this._parent.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "3"
                                }
                            });
                        } else {
                            _this._parent.winGestionarDocumento.record.data.estado = "3";
                        }
                        _this._parent.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this._parent.winGestionarDocumento, [b, _this._parent.winGestionarDocumento]).call();
                            }
                        }, _this._parent.winGestionarDocumento);
                        _this._parent.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                        _this._parent.habilitarElementosWindow();
                    }
                    _this.model.getStore().reload();
                    if (_this.record == null) {
                        _this.record = {};
                        Ext.apply(_this.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "3"
                            }
                        });
                    } else {
                        _this.record.data.estado = 3;
                    }
                    _this.setTitulo();
                    _this.listaBotones.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                    _this.ocultarColumna('disponible');
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    b.disable();
                    if (_this.record && _this.record.data.estado == 2) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimirModelo,
            handler: function () {
                _this._parent.onReport({
                    isList: false, name: 'DistribucionModelo'
                })
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RB')) {
                    b.setVisible(true);
                    if (_this.record && _this.record.data.estado == 3) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
    },
    habilitarBotones: function () {
        var _this = this;
        if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    actualizarStores: function () {
        var _this = this;
        _this.getStorePrincipal().on({
            'beforeload': function () {
                _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                this.initBaseParams.iddocumento = (_this.record.data.iddocumento) ? _this.record.data.iddocumento : -1;
            }
        });
        _this.getStorePrincipal().reload();
    },
    setTitulo: function () {
        var _this = this;
        _this.documento = (_this.record.data.nrodoc) ? _this.record.data.nrodoc : _this.record.data.numeroref;
        this.getVistaPrincipal().setTitle(String.format(_this.idioma.tlVentanaAdicionarProductosDPedido, _this.documento, _this.record.data.fechacontable, LOG.lb.documento.Estado[_this.record.data.estado]));
    }
});

LOG.dist.distribucion.PanelEste = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.autoLoad = false;
        this.concepto = 'productos';
        this.gridEditable = true;
        this.idGridPrincipal = 'idprodorden';
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        this.urlBusquedaGridPrincipal = 'cargarProductosDistribucion';
        this.modoSeleccion = 1;
        this.formaVisualizacion = 'panel';
        this.panelAgrupado = config.panelAgrupado;
        LOG.dist.distribucion.PanelEste.superclass.constructor.call(this, config);
        this.model.iddocumento = config.panelAgrupado.datos.iddocumento;
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: 'Producto',
            width: 220,
            dataIndex: 'text',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 100,
            dataIndex: 'umedida',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDisponible,
            width: 80,
            dataIndex: 'disponible',
            align: 'right',
            default: true
        });

        this.addGridColumn({
            header: 'Cantidad',
            width: 80,
            dataIndex: 'cantidad',
            align: 'right',
            default: true,
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function (t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        });

        this.addGridColumn({dataIndex: 'idproducto'});

        this.addGridColumn({dataIndex: 'idcliente'});

        this.addGridColumn({dataIndex: 'idindicador'});

        this.addGridColumn({dataIndex: 'idprodorden'});

        this.addGridColumn({dataIndex: 'pedida'});

        this.addGridColumn({dataIndex: 'idpedido'});

        this.addGridColumn({dataIndex: 'idestructura'});
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnProductoAternativo,
            iconCls: 'producto',
            tooltip: _this.idioma.ttBtnAdicionarProductosAlternativo,
            handler: function () {
                /*var _p = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    usarFiltroArea: false,
                    usarFiltroDeposito: true,
                    parametros: {
                        idseleccionados: Ext.encode(_this.storePrincipal.collect('idproducto')),
                        codigoauxiliar: (_this.panelAgrupado.gpPrincipal.getSelectionModel().getSelected()) ? (_this.panelAgrupado.gpPrincipal.getSelectionModel().getSelected().json.codigoauxiliar || -1) : null,
                        comprometida: true
                    },
                    doAction: function(r) {
                        var _productos = new Array();
                        Ext.each(r, function(rec) {
                            _productos.push({
                                idproducto: rec.get('idproducto'),
                                tipodistribucion: 2,
                                idcliente: _this.panelAgrupado.gpPrincipal.getSelectionModel().getSelected().data.idcliente,
                                idprodorigen: _this.panelAgrupado.gpPrincipal.getSelectionModel().getSelected().data.idproducto

                            });
                        });

                        _this.model.adicionarMovimientos({
                            alternativo: true,
                            idproductos: Ext.encode(_productos)
                        }, function(r) {
                            _this.getStorePrincipal().reload();
                        });
                    }
                });*/

                var idSeleccionados = [];
                Ext.each(_this.panelAgrupado.getStorePrincipal().data.items, function (rec) {
                    if (rec.data.idproducto) {
                        idSeleccionados.push(rec.data.idproducto);
                    }
                });

                Ext.Ajax.request({
                    url: 'getSubordinacionEntidad',
                    callback: function (o, s, resp) {
                        var respMsg = Ext.decode(resp.responseText);
                        if (respMsg.datos) {
                            var _p = new LOG.lb.documento.VentanaProductos({
                                idioma: _this.idioma,
                                _parent: _this,
                                usarFiltroArea: false,
                                usarFiltroDeposito: true,
                                parametros: {
                                    idestructura: Ext.encode(respMsg.datos),
                                    idseleccionados: Ext.encode(_this.storePrincipal.collect('idproducto').concat(idSeleccionados)),
                                    codigoauxiliar: (_this.panelAgrupado.gpPrincipal.getSelectionModel().getSelected()) ? (_this.panelAgrupado.gpPrincipal.getSelectionModel().getSelected().json.codigoauxiliar || -1) : null,
                                    conexistencia: 1,
                                    condisponible: 1,
                                    comprometida: true
                                },
                                doAction: function (r) {
                                    var _productos = new Array();
                                    var _idProdSeleccionados = [];
                                    Ext.each(r, function (rec) {
                                        _productos.push({
                                            idproducto: rec.get('idproducto'),
                                            ipodistribucion: 2,
                                            idcliente: _this.panelAgrupado.gpPrincipal.getSelectionModel().getSelected().data.idcliente,
                                            idprodorigen: _this.panelAgrupado.gpPrincipal.getSelectionModel().getSelected().data.idproducto
                                        });
                                        _idProdSeleccionados.push(rec.get('idproducto'))
                                    });

                                    _this.model.adicionarMovimientos({
                                        alternativo: true,
                                        idproductos: Ext.encode(_productos)
                                    }, function (r) {
                                        _p.postSalvar.createDelegate(_p, [resp, _idProdSeleccionados]).call();
                                    });
                                },
                                postSalvar: function (r, _idProdSelecc) {
                                    _this.getStorePrincipal().reload();

                                    if (_p) {
                                        _p.getStorePrincipal().reload(
                                            _p.getStorePrincipal().initBaseParams.idseleccionados = Ext.encode(Ext.decode(_p.getStorePrincipal().baseParams.idseleccionados).concat(_idProdSelecc)),
                                            _p.getStorePrincipal().baseParams.idseleccionados = Ext.encode(Ext.decode(_p.getStorePrincipal().baseParams.idseleccionados).concat(_idProdSelecc))
                                        );
                                    }
                                }
                            });
                            _p.init();
                            _this.vistaProductos = _p.view();
                            _this.vistaProductos.show();
                        }
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    _caller.panelAgrupado.getGridPrincipal().getSelectionModel().fireEvent = _caller.panelAgrupado.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && _this.panelAgrupado.datos && _this.panelAgrupado.datos.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'eliminar',
            text: _this.idioma.lbBtnEliminarAternativo,
            tooltip: _this.idioma.ttBtnEliminarProductosAlternativo,
            disabled: true,
            handler: function () {
                var idprodorden = new Array();
                Ext.each(_this.smGridPrincipal.getSelections(), function (rec) {
                    idprodorden.push(rec.data.idprodorden);
                });
                _this.model.eliminarMovimientos(idprodorden, function () {
                    _this.panelAgrupado.storePrincipal.reload();
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('REliminar')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && _this.panelAgrupado.datos && _this.panelAgrupado.datos.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));
    },
    render: function () {
        var render = LOG.dist.distribucion.PanelEste.superclass.render.call(this);
        this.getGridPrincipal().on({
            beforeedit: function (e) {
                e.cancel = false;
                if (e.record.json.decimales == '0') {
                    e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputEntero({}));
                } else {
                    e.grid.getColumnModel().setEditor(e.column, LOG.util.Prototipos.inputDecimal({}));
                }
            }
        });
        return render;
    }
});

/**
 * Plantilla tipo ventana para la adicionar los porductos de una recepción determinada.
 * @type LOG.util.UITemplate
 */
LOG.dist.distribucion.recepcion = Ext.extend(LOG.lb.documento.View, {
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 1;
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'cargarRecepcion';
        this.panelBotonesVisible = true;
        LOG.dist.distribucion.recepcion.superclass.constructor.call(this, config);
        this.getVistaPrincipal().setTitle(this.idioma.tlVentanaProductosRecepcion);
        this.getVistaPrincipal().setSize(700, 400);
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Mostrar todas',
            tooltip: 'Muestra todas las distribuciones',
            iconCls: 'ver',
            handler: function () {
                /*var params = {
                    filtrado: 1
                };*/
                _this.getGridPrincipal().getStore().initBaseParams.filtrado = 1;
                _this.getGridPrincipal().getStore().reload(/*{
                    params: params
                }*/);
            }
        }));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        Ext.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                _this.aceptarFn.createDelegate(_this, [_this.getSmPrincipal().getSelected().data.iddocumento]).call();
                _this.getVistaPrincipal().close();
            }
        })
    },
    initDefaultColumns: function () {
        LOG.dist.distribucion.recepcion.superclass.initDefaultColumns.call(this);
        this.listaColumnas.add({
            header: this.idioma.cgDeposito,
            hideable: false,
            default: true,
            dataIndex: 'almacen',
            hidden: true,
            agrupador: true
        });
        Ext.apply(this.listaColumnas.getBy('dataIndex', 'estado'), {hidden: true});
        Ext.apply(this.listaColumnas.getBy('dataIndex', 'idusuario'), {
            hidden: true,
            renderer: null
        });
        Ext.apply(this.listaColumnas.getBy('dataIndex', 'aprobadopor'), {
            hidden: true,
            renderer: null
        });
        var pos = this.listaColumnas.getPosByField('dataIndex', 'fechacontable', 'header')
        this.listaColumnas.insert({
            header: this.idioma.cgProveedor,
            autoExpand: true,
            dataIndex: 'cliente',
            default: true
        }, pos + 1);
        this.listaColumnas.add({
            dataIndex: 'iddeposito'
        });
    },
    view: function () {
        LOG.lb.documento.View.superclass.view.call(this);
    },
    render: function () {
        var render = LOG.dist.distribucion.recepcion.superclass.render.call(this);
        var _this = this;
        this.getSmPrincipal().on({
            selectionchange: function () {
                _this.getVistaPrincipal().listaBotones.getItem(2).setDisabled(this.getCount() != 1);
            }
        });
        return render;
    }
});