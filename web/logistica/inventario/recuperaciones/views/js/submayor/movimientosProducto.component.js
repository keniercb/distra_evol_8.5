/**
 * Esta clase muestra los movimientos de un producto
 * @copyright XETID
 * @author División Gestión de Entidades
 * @version 1.0
 */
Ext.ns('LOG.inv.submayor');
LOG.inv.submayor.MovimientosProductoPlugin = function () {
    /**
     * Dibuja la interfaz y llama a la clase controladora
     * @return
     */
    function __conmit(v) {
        var listaId = new LOG.util.List();
        LOG.inv.submayor.reporte = Ext.extend(LOG.util.UITemplate, {
            constructor: function (config) {
                this.formaVisualizacion = 'ventana';
                this.modoSeleccion = 1;
                this.concepto = 'movimientos del producto ';
                this.busquedaAvanzada = true;
                this.autoLoad = false;
                this.idGridPrincipal = 'idmovimiento';
                this.urlBusquedaGridPrincipal = 'getMovimientosProducto';
                LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
                LOG.inv.submayor.reporte.superclass.constructor.call(this, config);
                this.getVistaPrincipal().title = config.idioma.tlMovimientos  + ' ' + v.smGridPrincipal.getSelected().json.codigo+ ' - ' + v.smGridPrincipal.getSelected().json.denominacion;
                this.getVistaPrincipal().maximizable = false;
                this.getVistaPrincipal().maximized = true;

            },
            init: function () {
                LOG.inv.submayor.reporte.superclass.init.call(this);
            },
            initDefaultButtons: function () {
                var _this = this;
                LOG.util.UIManager.apply(_this.getVistaPrincipal().buttons[0], LOG.util.Prototipos.botonCancelar({
                    text: _this.idioma.lbBtnCerrar
                }, true));
                this.getVistaPrincipal().buttons[1].setVisible(false);
                this.getVistaPrincipal().buttons[2].setVisible(false);
                this.addToolbarButton(LOG.util.UIManager.createBtn({
                    iconCls: 'imprimir',
                    text: _this.idioma.lbBtnImprimirReporte,
                    tooltip: _this.idioma.ttImprimirReporte,
                    disabled: true,
                    handler: function () {
                        _this.getReportes();
                    },
                    controlFn: function (b, _caller) {
                        _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function (e) {
                            if (e == 'load') {
                                if (_caller.getStorePrincipal().getCount() != 0) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    }
                }));
                this.documentKeyMap = new Ext.KeyMap(document,
                    [
                        {
                            alt: true,
                            key: 'p',
                            fn: function () {
                                _this.getReportes()
                            }
                        }
                    ]);
            },
            initDefaultColumns: function () {
                var _this = this;

                this.addGridColumn({
                    header: _this.idioma.cgFecha,
                    width: 80,
                    dataIndex: 'fecha',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgTipoDoc,
                    width: 130,
                    dataIndex: 'denomdocumento',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgNumeroDocumento,
                    width: 120,
                    dataIndex: 'numerodocumento',
                    default: true
                });
                this.addGridColumn({
                    header:'Doc.Primario',
                    width: 120,
                    dataIndex: 'numeroref',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgPD,
                    width: 280,
                    dataIndex: 'cliente',
                    default: true
                });

                if (typeof tarjetacombustible !== 'undefined' && tarjetacombustible == true) {
                    this.addGridColumn({
                        header: _this.idioma.cgNumeroChip,
                        width: 120,
                        dataIndex: 'numerochip',
                        default: true
                    });
                    this.addGridColumn({
                        header: _this.idioma.cgFechaChip,
                        width: 90,
                        dataIndex: 'fechachip',
                        default: true
                    });
                }
                this.addGridColumn({
                    header: _this.idioma.cgObservaciones,
                    width: 280,
                    dataIndex: 'observaciones',
                    default: true,
                    renderer: function(value, metadata, record) {
                        var newStr= '<b>Observaciones:</b></br>'+record.json['observaciones'];
                        if (value != "-") {
                            metadata.tdAttr = 'data-qtip="' + newStr + '"';
                            metadata.attr = 'ext:qtip="' + newStr + '"';
                        }
                        return value;
                    }
                });
                this.addGridColumn({
                    header: _this.idioma.cgNroLote,
                    width: 120,
                    dataIndex: 'nrolote',
                    default: true,
                    renderer: function(value, metadata, record) {
                        var newStr= '<b>No. lote:</b></br>'+record.json['nrolote'];
                        if (value != "-") {
                            metadata.tdAttr = 'data-qtip="' + newStr + '"';
                            metadata.attr = 'ext:qtip="' + newStr + '"';
                        }
                        return value;
                    }
                });
                this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                    header: _this.idioma.cgEntradaCant,
                    width: 100,
                    align: 'right',
                    dataIndex: 'entradacant',
                    default: true
                }));
                this.addGridColumn(LOG.util.Prototipos.columnaImporte({
                    header: _this.idioma.cgEntradaImp + ' ' + codigoContable,
                    width: 120,
                    align: 'right',
                    dataIndex: 'entradaimp',
                    default: true
                }));
                if (alternativa) {
                    this.addGridColumn(LOG.util.Prototipos.columnaImporte({
                        header: _this.idioma.cgEntradaImp + ' ' + codigoAlternativa,
                        width: 120,
                        align: 'right',
                        dataIndex: 'entradaimpalt',
                        default: true
                    }));
                }
                this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                    header: _this.idioma.cgSalidaCant,
                    width: 100,
                    align: 'right',
                    dataIndex: 'salidacant',
                    default: true
                }));
                this.addGridColumn(LOG.util.Prototipos.columnaImporte({
                    header: _this.idioma.cgSalidaImp + ' ' + codigoContable,
                    width: 120,
                    align: 'right',
                    dataIndex: 'salidaimp',
                    default: true
                }));
                if (alternativa) {
                    this.addGridColumn(LOG.util.Prototipos.columnaImporte({
                        header: _this.idioma.cgSalidaImp + ' ' + codigoAlternativa,
                        width: 120,
                        align: 'right',
                        dataIndex: 'salidaimpalt',
                        default: true
                    }));
                }
                this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                    header: _this.idioma.cgExistCant,
                    width: 100,
                    align: 'right',
                    dataIndex: 'existenciaactual',
                    default: true
                }));

                this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
                    header: _this.idioma.cgPrecioPromedio + ' ' + codigoContable,
                    width: 130,
                    align: 'right',
                    dataIndex: 'preciopromedio',
                    default: true
                }));
                this.addGridColumn(LOG.util.Prototipos.columnaImporte({
                    header: _this.idioma.cgImporteTotal + ' ' + codigoContable,
                    width: 110,
                    align: 'right',
                    dataIndex: 'importetotal',
                    default: true
                }));
                if (alternativa) {
                    this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
                        header: _this.idioma.cgPrecioPromedio + ' ' + codigoAlternativa,
                        width: 130,
                        align: 'right',
                        dataIndex: 'preciopromedioalt',
                        default: true
                    }));
                    this.addGridColumn(LOG.util.Prototipos.columnaImporte({
                        header: _this.idioma.cgImporteTotal + ' ' + codigoAlternativa,
                        width: 110,
                        align: 'right',
                        dataIndex: 'importetotalalt',
                        default: true
                    }));
                }

                this.addGridColumn({
                    dataIndex: 'iddocumento',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'abreviatura',
                    default: true
                });

                this.addGridColumn({
                    dataIndex: 'valor',
                    default: true
                });
            },

            render: function () {
                var _this = this;
                this.getPanelBusqueda().width = 338;
                var vist = LOG.inv.submayor.reporte.superclass.render.call(_this);
                //_this.valor = [];
                this.getGridPrincipal().on({
                    'rowdblclick': function (grid, rowIndex, e) {
                        if (grid.getSelectionModel().hasSelection()) {
                            _this.getReporteModelo();
                        }
                    }
                });

                this.getStorePrincipal().initBaseParams.idproducto = v.smGridPrincipal.getSelected().data.idproducto;
                this.getStorePrincipal().initBaseParams.iddeposito = v.idDeposito;
                /*Ext.Ajax.request({
                    url: 'getMovimientosProducto',
                    method: 'POST',
                    callback: function (options, success, response) {
                        _this.valor = Ext.decode(response.responseText);
                    }
                })*/

                this.getPanelBusqueda().listaBotones.getItem(1).handler = this.getPanelBusqueda().listaBotones.getItem(1).handler.createInterceptor(function () {
                    gridDocumento.getSelectionModel().clearSelections();
                    listaId.deleteAll();
                });
                this.getStorePrincipal().load();
                return vist;
            },
            getReportes: function () {
                var _this = this;
                var stringTipoDoc = "";
                var selecciones = gridDocumento.getSelectionModel().getSelections();
                for (var i = 0; i < selecciones.length; i++) {
                    if (i != selecciones.length - 1) {
                        stringTipoDoc += selecciones[i].data.iddoc + ",";
                    } else {
                        stringTipoDoc += selecciones[i].data.iddoc + "";
                    }
                }
                stringTipoDoc = "{" + stringTipoDoc + "}";
                if (stringTipoDoc == "{}") {
                    stringTipoDoc = null;
                }
                this.tipoReportes = new LOG.util.Report({
                    reports: [
                        {
                            dirReport: '/distra/logistica/inventario/recuperaciones/SubmayorInventario/MovimientosProducto' + ((alternativa) ? 'Dual' : ''),
                            name: 'MovimientosProducto',
                            isList: true,
                            params: {
                                iddeposito: v.idDeposito,
                                idproducto: v.smGridPrincipal.getSelected().data.idproducto,
                                idoperaciones:'{990000000253, 990000000254}',
                                iddocs:'null',
                                iddoc:_this.getGridPrincipal().store.reader.jsonData.iddoc,
                                fechainicio: (desde.getValue()) ? desde.getValue().format('d-m-Y') : null,
                                fechafin: (hasta.getValue()) ? hasta.getValue().format('d-m-Y') : null,
                                idtipodocs:stringTipoDoc,
                                idlote: null,
                                idnroserie: null,
                                idpartida: null,
                                idestructuracomun: idEntidad,
                                idmonedacontable: _this.getGridPrincipal().store.reader.jsonData.idmonedacontable,
                                idmonedaalternativa: _this.getGridPrincipal().store.reader.jsonData.idmonedaalternativa
                            }
                        }
                    ]
                });
                this.tipoReportes.view();
            },
            getReporteModelo: function (r) {
                var _this = this;
                var record = this.getGridPrincipal().getSelectionModel().getSelected();
                var dirReport = "";
                var nameReports = "";
                var idmonedaalternativa = _this.getGridPrincipal().store.reader.jsonData.idmonedaalternativa;
                var idmonedacontable = _this.getGridPrincipal().store.reader.jsonData.idmonedacontable;
                console.log(record.data);
                if (record.get('abreviatura') == "recepcionLog") {
                    nameReports = (idmonedaalternativa) ? 'RecepcionDualModelo' : 'RecepcionModelo';
                    dirReport =
                        '/distra/logistica/inventario/entrada/recepcion/' + nameReports;
                } else if (record.get('abreviatura') == "inventariogLog") {
                    nameReports = 'HojaInventarioExModelo';
                    dirReport = '/distra/logistica/inventario/movimiento/hojainventario/' + nameReports;
                } else if (record.get('abreviatura') == "transferenciareaLog") {
                    nameReports = (idmonedaalternativa) ? 'TransferenciaEntreAreasDualModelo' : 'TransferenciaEntreAreasModelo';
                    dirReport = '/distra/logistica/inventario/movimiento/transferencia/' + nameReports;
                } else if (record.get('abreviatura') == "transferenciaLog") {
                    nameReports = (idmonedaalternativa) ? 'TransferenciaAlmacenesDualModelo' : 'TransferenciaAlmacenesModelo';
                    dirReport = '/distra/logistica/inventario/salida/salida/' + nameReports;
                } else if (record.get('abreviatura') == "aperturaLog") {
                    nameReports = (idmonedaalternativa) ? 'AperturaDualModelo' : 'AperturaModelo';
                    dirReport = '/distra/logistica/inventario/entrada/apertura/' + nameReports;
                } else if (record.get('abreviatura') == "facturaLog") {
                    nameReports = (idmonedaalternativa) ? 'FacturacionDualModelo' : 'FacturacionModelo';
                    dirReport = '/distra/logistica/facturacion/facturacion/' + nameReports;
                } else if (record.get('abreviatura') == "ajusteLog") {
                    nameReports = (idmonedaalternativa) ? 'AjusteDualModelo' : 'AjusteModelo';
                    dirReport = '/distra/logistica/inventario/movimiento/ajuste/' + nameReports;
                } else if (record.get('abreviatura') == "valeLog") {
                    nameReports = (idmonedaalternativa) ? 'ValeEntregaDualModelo' : 'ValeEntregaModelo';
                    dirReport = '/distra/logistica/inventario/salida/salida/' + nameReports;
                } else if (record.get('abreviatura') == "valedev") {
                    nameReports = (idmonedaalternativa) ? 'ValeDevolucionDualModelo' : 'ValeDevolucionModelo';
                    dirReport = '/distra/logistica/inventario/entrada/devolucion/' + nameReports;
                } else if (record.get('abreviatura') == "transferenciainternaLog") {
                    nameReports = (idmonedaalternativa) ? 'TransferenciaInternaModelo' : 'TransferenciaInternaModelo';
                    dirReport = 'distra/logistica/inventario/movimiento/transferenciainterna' + nameReports;
                }
                this.tipoReportes = new LOG.util.Report({
                    reports: [
                        {
                            dirReport: dirReport,
                            name: nameReports,
                            description: nameReports,
                            isList: true,
                            params: {
                                useSign: this.useSign,
                                hasExistencia: 'true',
                                hasCategoria: (true) ? 'true' : 'false',
                                iddocumento: record.get("iddocumento"),
                                idestructuracomun: idEntidad,
                                monedacontable: (_this.getGridPrincipal().store.reader.jsonData.idmonedacontable) ? _this.getGridPrincipal().store.reader.jsonData.idmonedacontable : null,
                                monedaalternativa: (_this.getGridPrincipal().store.reader.jsonData.idmonedaalternativa) ? _this.getGridPrincipal().store.reader.jsonData.idmonedaalternativa : null

                            }
                        }
                    ]
                });
                this.tipoReportes.view();
            }

        });

        //----construyendo la busqueda avanzada
        var idioma = LOG.inv.submayor.Idioma;
        var winReporte = new LOG.inv.submayor.reporte({
            idioma: idioma
        });

        winReporte.init();

        winReporte.getPanelBusqueda().setColumns(1);
        var clsFecha = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        var desde = new Ext.form.DateField({ //----1er campo de fecha
            fieldLabel: idioma.lbDfDesde,
            name: 'desde',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });
        var hasta = new Ext.form.DateField({ //----2do campo de fecha
            fieldLabel: idioma.lbDfHasta,
            name: 'hasta',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });

        desde.endDateField = hasta.id; //-------validacion de fecha
        hasta.startDateField = desde.id;

        clsFecha.addComponent(desde);

        clsFecha.addComponent(hasta);

        winReporte.addFilterComponent( //-------muestra los campos de fecha
            new Ext.form.FieldSet({
                title: idioma.lbFsRangoFecha,
                items: [clsFecha]
            })
        );

        var lista = new LOG.util.List(); // ------------ cunstruyendo el grid de la busqueda avanzada
        var check = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        lista.add(check);
        lista.add({
            header: idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        });
        lista.add({
            dataIndex: 'iddoc',
            default: true
        });

        var clsTipoDato = LOG.util.UIManager.proccessColumns(lista);
        var cmDocumento = new Ext.grid.ColumnModel(clsTipoDato.columns);
        var smDocumento = check;
        var recDocumento = Ext.data.Record.create(clsTipoDato.fields);
        var stDocumento = new Ext.data.Store({
            url: 'cargarTipoDoc',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos'
            }, recDocumento)
        });
        smDocumento.on({
            'selectionchange': function () {
                listaId.deleteAll();
                Ext.each(smDocumento.getSelections(), function (r) {
                    listaId.add(r.data.iddoc);
                });
                winReporte.getPanelBusqueda().parametros.iddoc = Ext.encode(listaId.getArray());
            }
        });

        var gridDocumento = LOG.util.UIManager.initEditableGridPanel(cmDocumento, stDocumento, smDocumento);
        gridDocumento.height = 335;
        gridDocumento.bbar = null;
        winReporte.addFilterComponent(
            new Ext.form.FieldSet({
                title: idioma.lbFsTipoDoc,
                items: [gridDocumento],
                height: 370
            })
        );
        winReporte.view();
        //----------se acaba la busqueda avanzada
    }

    return {
        init: function (v) {
            v.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'movimiento',
                text: LOG.inv.submayor.Idioma.lbMovimientos,
                tooltip: LOG.inv.submayor.Idioma.ttbtnMovimientos,
                handler: function () {
                    __conmit(v);
                },
                //-----------validacion show/hide del boton
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
                    }, 'movi');
                    /* _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                     if (e == 'rowselect') {
                     b.enable();
                     }
                     if (e == 'rowdeselect') {
                     b.disable();
                     }
                     });*/
                }
                //----------termina la validacion show/hide del boton
            }), 1);
        }
    };
}
LOG.inv.submayor.MovimientosEspecificacionProductoPlugin = function () {
    /**
     * Dibuja la interfaz y llama a la clase controladora
     * @return
     */
    function __conmit(v) {
        var listaId = new LOG.util.List();
        LOG.inv.submayor.reporte = Ext.extend(LOG.util.UITemplate, {
            constructor: function (config) {
                this.formaVisualizacion = 'ventana';
                this.modoSeleccion = 1;

                this.busquedaAvanzada = true;
                this.autoLoad = false;
                this.idGridPrincipal = 'idmovimiento';
                this.urlBusquedaGridPrincipal = 'getMovimientosProducto';
                LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
                LOG.inv.submayor.reporte.superclass.constructor.call(this, config);
                this.concepto = config.idioma.tlConceptoBusqueda;
                this.getVistaPrincipal().title = config.idioma.tlMovimientos;
                this.getVistaPrincipal().maximizable = false;
                this.getVistaPrincipal().maximized = true;

            },
            init: function () {
                LOG.inv.submayor.reporte.superclass.init.call(this);
            },
            initDefaultButtons: function () {
                var _this = this;
                LOG.util.UIManager.apply(_this.getVistaPrincipal().buttons[0], LOG.util.Prototipos.botonCancelar({
                    text: _this.idioma.lbBtnCerrar
                }, true));

                this.getVistaPrincipal().buttons[1].setVisible(false);
                this.getVistaPrincipal().buttons[2].setVisible(false);
                this.addToolbarButton(LOG.util.UIManager.createBtn({
                    iconCls: 'imprimir',
                    text: _this.idioma.lbBtnImprimirReporte,
                    tooltip: _this.idioma.ttImprimirReporte,
                    handler: function () {
                         _this.getReportes();
                    }
                }));
            },
            initDefaultColumns: function () {
                var _this = this;

                this.addGridColumn({
                    header: _this.idioma.cgFecha,
                    width: 80,
                    dataIndex: 'fecha',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgTipoDoc,
                    width: 110,
                    dataIndex: 'denomdocumento',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgNumeroDocumento,
                    width: 120,
                    dataIndex: 'numerodocumento',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgPD,
                    width: 100,
                    dataIndex: 'cliente',
                    autoExpand: true,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgEntradaCant,
                    width: 100,
                    dataIndex: 'entradacant',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgEntradaImp,
                    width: 100,
                    dataIndex: 'entradaimp',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgSalidaCant,
                    width: 100,
                    dataIndex: 'salidacant',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgSalidaImp,
                    width: 100,
                    dataIndex: 'salidaimp',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgExistCant,
                    width: 100,
                    dataIndex: 'existenciaactual',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgPrecioPromedio,
                    width: 110,
                    dataIndex: 'preciopromedio',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgImporteTotal,
                    width: 110,
                    dataIndex: 'importetotal',
                    default: true
                });
            },
            render: function () {
                var _this = this;
                this.getPanelBusqueda().width = 338;
                var vist = LOG.inv.submayor.reporte.superclass.render.call(_this);
                console.info(v)
                this.getStorePrincipal().initBaseParams.idproducto = v.smGridPrincipal.getSelected().json.idproducto;
                //   this.getStorePrincipal().initBaseParams.iddeposito = v.idDeposito;
                if (v.smGridPrincipal.getSelected().data.idproductomunic) {
                    _this.getStorePrincipal().initBaseParams.idpartida = v.smGridPrincipal.getSelected().data.idproductomunic;
                    _this.getStorePrincipal().initBaseParams.idnroserie = null;
                    _this.getStorePrincipal().initBaseParams.idlote = null;
                }
                if (v.smGridPrincipal.getSelected().data.idnroserie) {
                    _this.getStorePrincipal().initBaseParams.idnroserie = v.smGridPrincipal.getSelected().data.idnroserie;
                    _this.getStorePrincipal().initBaseParams.idpartida = null;
                    _this.getStorePrincipal().initBaseParams.idlote = null;
                }
                if (v.smGridPrincipal.getSelected().data.idlote) {
                    _this.getStorePrincipal().initBaseParams.idlote = v.smGridPrincipal.getSelected().data.idlote;
                    _this.getStorePrincipal().initBaseParams.idpartida = null;
                    _this.getStorePrincipal().initBaseParams.idnroserie = null;
                }
                this.getPanelBusqueda().listaBotones.getItem(1).handler = this.getPanelBusqueda().listaBotones.getItem(1).handler.createInterceptor(function () {
                    gridDocumento.getSelectionModel().clearSelections();
                    listaId.deleteAll();
                });
                this.getStorePrincipal().load();
                return vist;
            },

            getReportes: function () {
                var _this = this;
                var stringTipoDoc = "";
                var selecciones = gridDocumento.getSelectionModel().getSelections();
                for (var i = 0; i < selecciones.length; i++) {
                    if (i != selecciones.length - 1) {
                        stringTipoDoc += selecciones[i].data.iddoc + ",";
                    } else {
                        stringTipoDoc += selecciones[i].data.iddoc + "";
                    }
                }
                stringTipoDoc = "{" + stringTipoDoc + "}";
                if (stringTipoDoc == "{}") {
                    stringTipoDoc = null;
                }
                this.tipoReportes = new LOG.util.Report({
                    reports: [
                        {
                            dirReport: '/distra/logistica/inventario/recuperaciones/SubmayorInventario/MovimientosProducto' + ((alternativa) ? 'Dual' : ''),
                            name: 'MovimientosProducto',
                            isList: true,
                            params: {
                                fechainicio: (desde.getValue()) ? desde.getValue().format('d-m-Y') : null,
                                fechafin: (hasta.getValue()) ? hasta.getValue().format('d-m-Y') : null,
                                iddeposito: v.idDeposito,
                                idproducto: v.smGridPrincipal.getSelected().data.idproducto,
                                idpartida: v.smGridPrincipal.getSelected().data.idproductomunic,
                                idnroserie: v.smGridPrincipal.getSelected().data.idnroserie,
                                idlote: v.smGridPrincipal.getSelected().data.idlote,
                                arraydocumento: stringTipoDoc,
                                aliasiddoc: "{" + _this.valor.inventarioLog + "," + _this.valor.transferenciareaLog + "}",
                                idestructuracomun: window.idEntidad,
                                idmonedacontable: _this.getGridPrincipal().store.reader.jsonData.idmonedacontable,
                                idmonedaalternativa: _this.getGridPrincipal().store.reader.jsonData.idmonedaalternativa
                            }
                        }
                    ]
                });
                this.tipoReportes.view();
            }
        });

        //----construyendo la busqueda avanzada
        var idioma = LOG.inv.submayor.Idioma;
        var winReporte = new LOG.inv.submayor.reporte({
            idioma: LOG.inv.submayor.Idioma
        });

        winReporte.init();

        winReporte.getPanelBusqueda().setColumns(1);
        var clsFecha = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        var desde = new Ext.form.DateField({ //----1er campo de fecha
            fieldLabel: idioma.lbDfDesde,
            name: 'desde',
            format: 'd-m-Y',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });
        var hasta = new Ext.form.DateField({ //----2do campo de fecha
            fieldLabel: idioma.lbDfHasta,
            name: 'hasta',
            format: 'd-m-Y',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });

        desde.endDateField = hasta.id; //-------validacion de fecha
        hasta.startDateField = desde.id;

        clsFecha.addComponent(desde);

        clsFecha.addComponent(hasta);

        winReporte.addFilterComponent( //-------muestra los campos de fecha
            new Ext.form.FieldSet({
                title: idioma.lbFsRangoFecha,
                items: [clsFecha]
            })
        );

        var lista = new LOG.util.List(); // ------------ cunstruyendo el grid de la busqueda avanzada
        var check = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        lista.add(check);
        lista.add({
            header: idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        });
        lista.add({
            dataIndex: 'iddoc',
            default: true
        });

        var clsTipoDato = LOG.util.UIManager.proccessColumns(lista);
        var cmDocumento = new Ext.grid.ColumnModel(clsTipoDato.columns);
        var smDocumento = check;
        var recDocumento = Ext.data.Record.create(clsTipoDato.fields);
        var stDocumento = new Ext.data.Store({
            url: 'cargarTipoDoc',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos'
            }, recDocumento)
        });
        smDocumento.on({
            'selectionchange': function () {
                listaId.deleteAll();
                Ext.each(smDocumento.getSelections(), function (r) {
                    listaId.add(r.data.iddoc);
                });
                winReporte.getPanelBusqueda().parametros.iddoc = Ext.encode(listaId.getArray());
            }
        });

        var gridDocumento = LOG.util.UIManager.initEditableGridPanel(cmDocumento, stDocumento, smDocumento);
        gridDocumento.height = 335;
        gridDocumento.bbar = null;
        winReporte.addFilterComponent(
            new Ext.form.FieldSet({
                title: idioma.lbFsTipoDoc,
                items: [gridDocumento],
                height: 370
            })
        );
        winReporte.view();
        //----------se acaba la busqueda avanzada
    }

    return {
        init: function (v) {

            v.addToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'movimiento',
                text: LOG.inv.submayor.Idioma.lbMovimientosEspacificacion,
                tooltip: LOG.inv.submayor.Idioma.ttMovimientosEspacificacion,
                handler: function () {
                    __conmit(v);
                },
                //-----------validacion show/hide del boton
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
                    }, 'movimiento');

                }
                //----------termina la validacion show/hide del boton
            }));
        }
    };
}
