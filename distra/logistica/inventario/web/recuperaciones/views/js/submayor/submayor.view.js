Ext.ns('LOG.inv.submayor');
LOG.inv.submayor.View = Ext.extend(LOG.lb.producto.View, {
    /**
     * @param {Object} config
     * @return {undefined}
     */
    constructor: function(config) {
        var _this = this;
        config.idioma = {};
        LOG.inv.submayor.View.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, LOG.inv.submayor.Idioma);
        this.formaVisualizacion = 'default';
        this.dirController = '/logistica/inventario/recuperaciones/index.php/submayorinventario';
        this.urlBusquedaGridPrincipal = 'cargarproductos';
        this.modoSeleccion = 1;
        this.busquedaAvanzada = true;
        this.autoShow = true;
        this.autoLoad = false;
        this.panelBotonesVisible = true;
        _this.concepto = this.idioma.productos;
    },
    initDefaultColumns: function() {
        LOG.inv.submayor.View.superclass.initDefaultColumns.call(this);
        var _this = this;
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgMinimo,
            width: 90,
            align: 'right',
            dataIndex: 'minimo',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgMaximo,
            width: 90,
            align: 'right',
            dataIndex: 'maximo',
            default: true
        }));
        var pos = this.listaColumnas.getPosByField('dataIndex', 'existencia');
        this.insertGridColumn(LOG.util.Prototipos.columnaImporte({
            header: _this.idioma.cgImporteTotal + (alternativa ? ' ' + codigoContable : ''),
            width: 110,
            align: 'right',
            dataIndex: 'importecalculado',
            default: true
        }), pos + 1);
        this.addGridColumn({
            header: _this.idioma.cgCuenta + (alternativa ? ' ' + codigoContable : ''),
            dataIndex: 'cuentacontable',
            width: 170,
            align: 'right',
            default: true
        });
		
        if (alternativa) {
            Ext.apply(this.listaColumnas.getBy('dataIndex', 'precio'), {
                header: _this.idioma.cgPrecio + ' ' + codigoContable,
                width: 90
            });
            this.addGridColumn({
                header: _this.idioma.cgCuenta + ' ' + codigoAlternativa,
                dataIndex: 'cuentaalternativa',
                width: 170,
                align: 'right',
                default: true
            });
            pos = this.listaColumnas.getPosByField('dataIndex', 'importecalculado');
            this.insertGridColumn(LOG.util.Prototipos.columnaImporte({
                header: _this.idioma.cgImporteTotal + ' ' + codigoAlternativa,
                dataIndex: 'importealtcalculado',
                width: 110,
                align: 'right',
                default: true
            }), pos + 1);
            pos = this.listaColumnas.getPosByField('dataIndex', 'precio', 'header');
            this.insertGridColumn(LOG.util.Prototipos.columnaPrecio({
                header: this.idioma.cgPrecio + ' ' + codigoAlternativa,
                dataIndex: 'precioalternativo',
                width: 90,
                align: 'right',
                default: true
            }), pos + 1);
        }
		this.insertGridColumn({
            header:  this.idioma.cgUbicacion,
            dataIndex: 'ubicacion',
            width: 170,
            align: 'right',
            default: true
        }, pos + 1);	
        // Movimiento de conlumnas.
        var disponible = this.listaColumnas.getBy('dataIndex', 'disponible');
        pos = this.listaColumnas.getPosByField('dataIndex', 'disponible');
        this.listaColumnas.delete(pos);
        var cantidad = this.listaColumnas.getBy('dataIndex', 'cantidad');
        cantidad.hidden = true;
        /*this.insertGridColumn({
            header: 'Marca',
            width: 100,
            dataIndex: 'marca',
            default: true,          
            filter : {
                type : 'combo',
                url : '/logistica/utiles/maestroproductos/index.php/maestroproductos/getMarcas',
                valueField : 'idmarca',
                displayField: 'denominacion',
                dataIndex : 'marca',
            }
        },++pos);
        this.insertGridColumn({
            header: 'Modelo',
            width: 100,
            dataIndex: 'modelo',
            default: true,          
            filter : {
                type : 'combo',
                url : '/logistica/utiles/maestroproductos/index.php/maestroproductos/getModelos',
                valueField : 'idmodelo',
                displayField: 'denominacion',
                dataIndex : 'modelo',
            }
        },++pos);*/
        this.insertGridColumn(disponible, pos + 1);
        var existencia = this.listaColumnas.getBy('dataIndex', 'existencia');
        pos = this.listaColumnas.getPosByField('dataIndex', 'existencia');
        this.listaColumnas.delete(pos);
        pos = this.listaColumnas.getPosByField('dataIndex', 'disponible');
        this.insertGridColumn(existencia, pos + 1);
        this.addGridColumn({
            dataIndex: 'tienelote',
            default: true
        });
        this.addGridColumn({
            header: 'Activo',
            dataIndex: 'tarjetaactiva',
            width: 170,
            align: 'right',
            default: true,
            renderer: function (value, metaData) {
                if (value >= 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + 'Tarjeta activa' + '"';
                } else {
                    metaData.css = 'icondistra-cancelar rojo';
                    metaData.attr = 'ext:qtip="' + 'Tarjeta no activa' + '"';
                }
            }
        });
    },
    init: function() {
        LOG.inv.submayor.View.superclass.init.call(this);
        var _this = this;
        LOG.util.UIManager.apply(this.listaBotones.getItem(3), {referencia: "/logistica/inventario/recuperaciones/index.php/submayorinventario", id: 'idsubmayor'});

        _this.panel1raCara = LOG.util.UIManager.initPanel({
            title: _this.idioma.tlLote,
            layout: 'fit'
        });
        _this.panel2daCara = LOG.util.UIManager.initPanel({
            title: _this.idioma.tlNoSerie,
            border: false,
            layout: 'fit'
        });
        _this.panel3raCara = LOG.util.UIManager.initPanel({
            title: _this.idioma.tlPartida,
            layout: 'fit'
        });
        _this.panel4taCara = LOG.util.UIManager.initPanel({
            title: _this.idioma.tlUbicacion,
            border: false,
            layout: 'fit'
        });
        this.panelSur = LOG.util.UIManager.initPanel({
            animCollapse: true,
            hideCollapseTool: true,
            collapsible: true,
            collapsed: true,
            region: 'south',
            activeItem: null,
            layout: 'card',
            height: 300,
            frame: true,
            split: true,
            collapseMode: 'mini',
            pContainer: this.panelGrid,
            items: [_this.panel1raCara, _this.panel2daCara, _this.panel3raCara, _this.panel4taCara],
            listeners: {
                'collapse': function() {
                    this.hide();
                    this.pContainer.doLayout();
                },
                'beforeexpand': function() {
                    this.show();
                    this.pContainer.doLayout();
                }
            }
        });

         _this.getPanelPrincipal().onRender = _this.getPanelPrincipal().onRender.createSequence(function() {
            _this.getPanelPrincipal().add(_this.panelSur);
        }, _this);

    },
    render: function() {
        var obj = LOG.inv.submayor.View.superclass.render.call(this);
        var _this = this;
        this.panelSur.on({
            'collapse': function() {
                // this.hide();
                this.pContainer.doLayout();
            },
            'beforeexpand': function() {
                this.show();
                this.pContainer.doLayout();
            }
        }, this.panelSur);

        LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function(e) {
            if (e == 'selectionchange') {

                if (this.getCount() == 1) {
                    if (_this.lotes == undefined) {
                        LOG.lb.lote.Loader.init(function() {
                            _this.panelContenedor = LOG.util.UIManager.initPanel({
                                layout: 'border'
                            });
                            _this.lotes = new LOG.lb.lote.View({
                                urlBusquedaGridPrincipal: 'cargarLotes',
                                formaVisualizacion: 'panel',
                                panelBotonesVisible: true,
                                panelSuperior: false,
                                contabilizado: true,
                                ayuda: false,
                                sm: _this.getSmPrincipal()
                            });
                            _this.lotes.attachPlugin(new LOG.inv.submayor.MovimientosEspecificacionProductoPlugin());
                            _this.lotes.init();
                            var objeto = _this.lotes.view({
                                frame: true
                            });

                            _this.panelUbic = new LOG.inv.submayor.panelUbicacion({
                                idioma: _this.idioma,
                                parentView: _this.lotes,
                                tipoproducto: 2
                            });

                            _this.panelUbic.init();
                            var objeto1 = _this.panelUbic.view({
                                region: 'east',
                                //collapsible: true,
                                // collapsed: true,
                                width: '30%',
                                frame: true

                            });

                            _this.panelContenedor.onRender = _this.panelContenedor.onRender.createSequence(function() {
                                _this.panelContenedor.add(objeto);
                                _this.panelContenedor.add(objeto1);
                            });

                            _this.panel1raCara.add(_this.panelContenedor);

                        });
                    }

                }

            }

        });

        LOG.lb.numeroserie.Loader.init(function() {
            _this.nroSerie = new LOG.lb.numeroserie.Ventana({
                formaVisualizacion: 'panel',
                panelBotonesVisible: true,
                idestructura: _this.idDeposito
            });
            _this.btnExportarNroSerie = LOG.util.UIManager.createBtn({
                key: {
                    alt: true,
                    ctrl: false,
                    shift: false,
                    key: 'E'
                },
                iconCls: 'exportar',
                text: LOG.util.Idioma.lbBtnExcel,
                tooltip: LOG.util.Idioma.ttBtnExcel,
                handler: function() {
                    Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
                    var params = _this.nroSerie.panelBusquedaAvanzada.getForm().getFieldValues(true);
                    Ext.apply(params, {
                        criterio: _this.nroSerie.gridFilter.tfBusqueda.getValue(),
                        idproducto: _this.getSmPrincipal().getSelected().data.idproducto,
                        idestructura: _this.idDeposito,
                        cronologia: true
                    });
                    Ext.Ajax.request({
                        url: '/logistica/utiles/producto/index.php/numeroserie/cargarNumeroserieExportar',
                        method: 'POST',
                        params: params,
                        callback: function(o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                            window.open(resp.dirFichero, 'ventana', wCfg);
                        }
                    });
                }
            });
            _this.nroSerie.onGridDobleClick = function() {
                _this.listaBotones.getItem(1).handler(_this.listaBotones.getItem(1));
            }
            _this.nroSerie.attachPlugin(new LOG.inv.submayor.MovimientosEspecificacionProductoPlugin());
            _this.nroSerie.init();
            _this.nroSerie.addToolbarButton(_this.btnExportarNroSerie);
            var vistaNroSerie = _this.nroSerie.view();
            _this.panel2daCara.add(vistaNroSerie);
            _this.panel2daCara.doLayout();

            _this.nroSerie.getStorePrincipal().on({
                load: function(st, records) {
                    if (st.totalLength == 0) {
                        _this.btnExportarNroSerie.setDisabled(true);
                    } else {
                        _this.btnExportarNroSerie.setDisabled(false);
                    }
                }
            });

            _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(function(e) {
                if (e == 'rowselect') {
                    if (this.getCount() > 0 && this.getSelected().json.equipo == 1) {
                        _this.btnExportarNroSerie.objSubmit = {idproducto: this.getSelected().data.idproducto};
                        _this.nroSerie.idproducto = this.getSelected().data.idproducto;
                        _this.nroSerie.idestructura = _this.idDeposito;
                        _this.nroSerie.existencia = true;
                        _this.nroSerie.reiniciarBusqueda();
                    }
                }
            });
        });
        if (cmpArmamento == true) {
            LOG.inv.municiones.Loader.init(function() {
                _this.municiones = new LOG.inv.municiones.Ventana({
                    formaVisualizacion: 'panel',
                    panelBotonesVisible: true,
                    confubicacion: confubicacion,
                    fecha: fecha,
                    baseParams : {estado: 2}
                });

                _this.btnExportarPartida = LOG.util.UIManager.createBtn({
                    key: {
                        alt: true,
                        ctrl: false,
                        shift: false,
                        key: 'E'
                    },
                    iconCls: 'exportar',
                    text: LOG.util.Idioma.lbBtnExcel,
                    tooltip: LOG.util.Idioma.ttBtnExcel,
                    handler: function() {
                        Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
                        var params = _this.municiones.panelBusquedaAvanzada.getForm().getFieldValues(true);
                        Ext.apply(params, {
                            criterio: _this.municiones.gridFilter.tfBusqueda.getValue(),
                            idproducto: _this.getSmPrincipal().getSelected().data.idproducto,
                            idestructura: _this.idDeposito,
                            estado: 2
                        });
                        Ext.Ajax.request({
                            url: '/logistica/inventario/armamento/index.php/municiones/cargarMunicionesExportar',
                            method: 'POST',
                            params: params,
                            callback: function(o, s, r) {
                                Ext.MessageBox.hide();
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                                window.open(resp.dirFichero, 'ventana', wCfg);
                            }
                        });
                    }
                });
                _this.municiones.attachPlugin(new LOG.inv.submayor.MovimientosEspecificacionProductoPlugin());
                _this.municiones.onGridDobleClick = function() {
                    _this.listaBotones.getItem(1).handler(_this.listaBotones.getItem(1));
                };
                _this.municiones.init();
                _this.municiones.addToolbarButton(_this.btnExportarPartida);
                var vistaMuniciones = _this.municiones.view();
                _this.panel3raCara.add(vistaMuniciones);
                _this.panel3raCara.doLayout();

                _this.municiones.getStorePrincipal().on({
                    'load': function(st, records) {
                        if (st.totalLength == 0) {
                            _this.btnExportarPartida.setDisabled(true);
                        } else {
                            _this.btnExportarPartida.setDisabled(false);
                        }
                    }
                });

                _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(function(e) {
                    if (e == 'rowselect') {
                        if (this.getCount() > 0 && this.getSelected().json.municion == 1) {
                            _this.btnExportarPartida.objSubmit = {idproducto: this.getSelected().data.idproducto};
                            _this.municiones.idproducto = this.getSelected().data.idproducto;
                            _this.municiones.idestructura = _this.idDeposito;
                            _this.municiones.reiniciarBusqueda();
                        }
                    }
                });
            });
        }

        this.ubicacionarea = new LOG.inv.submayor.ubicacionarea({
            formaVisualizacion: 'panel'
        });
        this.ubicacionarea.init();
        Ext.apply(this.ubicacionarea.listaColumnas.getBy('dataIndex', 'area'), {
            dataIndex: 'ubicacion'
        });
        var vistaProductos = this.ubicacionarea.view();
        this.panel4taCara.add(vistaProductos);
        this.panel4taCara.doLayout();

        this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function(e) {
            if (e == 'rowselect') {
                if (this.getCount() > 0 && this.getSelected().json.tienelote != 1 && this.getSelected().data.equipo != 1 && this.getSelected().data.municion != 1) {

                    _this.ubicacionarea.getStorePrincipal().initBaseParams.iddeposito = _this.idDeposito;
                    _this.ubicacionarea.getStorePrincipal().initBaseParams.idproducto = this.getSelected().data.idproducto;
                    _this.ubicacionarea.reiniciarBusqueda();
                }
            }
        });


        _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(function(e) {
            if (e == 'rowselect') {
                if (this.getCount() > 0 && (this.getSelected().json.tienelote == 1 || this.getSelected().data.equipo == 1 || this.getSelected().data.municion == 1)) {
                    if (this.getSelected().json.tienelote == 1) {
                        _this.panelSur.expand();
                        _this.panelSur.getLayout().setActiveItem(0);
                    }
                    if (this.getSelected().json.equipo == 1) {
                        _this.panelSur.expand();
                        _this.panelSur.getLayout().setActiveItem(1);
                    }
                    if (this.getSelected().json.municion == 1) {
                        _this.panelSur.expand();
                        _this.panelSur.getLayout().setActiveItem(2);
                    }

                } else {
                    if (this.getCount() > 0) {
                        _this.panelSur.expand();
                        _this.panelSur.getLayout().setActiveItem(3);
                    }
                }
            }
        });
        _this.getStorePrincipal().fireEvent = _this.getStorePrincipal().fireEvent.createSequence(function(e) {
            if (e == 'beforeload') {
                _this.panelSur.collapse();
                _this.panelSur.getLayout().setActiveItem(null);
            }
        });

        return obj;
    }

});

LOG.inv.submayor.panelUbicacion = Ext.extend(LOG.util.UITemplate, {
    tipoproducto: undefined,
    constructor: function(config) {
        this.dirController = '/logistica/inventario/recuperaciones/index.php/submayorinventario';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        this.urlBusquedaGridPrincipal = 'cargarUbicaciones';
        this.autoLoad = false;
        this.modoSeleccion = 1;
        this.idioma = config.idioma;
        LOG.inv.submayor.panelUbicacion.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.cgUbicacion,
            width: 100,
            dataIndex: 'ubicacion',
            default: true,
            autoExpand: true
        });

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgCantUbicada,
            width: 100,
            dataIndex: 'cantidad',
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgDisponibilidad,
            width: 80,
            dataIndex: 'disponible',
            default: true
        }));
        this.addGridColumn({dataIndex: 'idubicacion'});
    },
    render: function(config) {
        var vista = LOG.inv.submayor.panelUbicacion.superclass.render.call(this, config);
        var _this = this;
        this.parentView.getSmPrincipal().on({
            rowselect: function() {
                _this.getStorePrincipal().initBaseParams.idlote = this.getSelected().data.idlote;
                _this.getStorePrincipal().initBaseParams.tipoproducto = _this.tipoproducto;
                _this.getStorePrincipal().load();
            }
        });
        return vista;
    }

});

