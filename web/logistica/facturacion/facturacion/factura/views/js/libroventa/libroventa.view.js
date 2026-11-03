Ext.ns('LOG.fac.libroventa');
LOG.fac.libroventa.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.busquedaBasica = true;
        this.formaVisualizacion = 'viewport';
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        this.autoLoad = false;
        LOG.util.UIManager.apply(config.idioma, LOG.fac.libroventa.Idioma);
        LOG.fac.libroventa.View.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {
        var _this = this;
        _this.addToolbarButton(_this.btnImprimir = LOG.util.Prototipos.botonImprimir({
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    isList: true,
                    name: 'LibroDeVentaModelo',
                    dirReport: '/logistica/facturacion/libroventa/LibroDeVentaModelo',
                    handler: _this.onReport.createDelegate(this)
                })
            ],
            controlFn: function(b, _caller) {
                if (_this.grantedAction('RB')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                        if (e == 'load') {
                            b.setVisible(this.getCount() > 0);
                        }
                    }, 'imprimir1');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        _this.addToolbarButton("->");
        _this.addToolbarButton(_this.btnAyuda = LOG.util.Prototipos.botonAyuda({
            hidden: false,
            disabled: false
        }));

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.lbFecha,
            dataIndex: 'fecha',
            default: true,
            width: 100
        });
        this.addGridColumn({
            header: _this.idioma.lbCelulaRif,
            dataIndex: 'celularif',
            default: true,
            width: 150
        });
        this.addGridColumn({
            header: _this.idioma.lbNombreRazon,
            dataIndex: 'nombrerazon',
            default: true,
            width: 150
        });
        this.addGridColumn({
            header: _this.idioma.lbNoFactura,
            dataIndex: 'nofactura',
            default: true,
            width: 100
        });
        this.addGridColumn({
            header: _this.idioma.lbNoControl,
            dataIndex: 'nocontrol',
            default: true,
            width: 100
        });
        this.addGridColumn({
            header: _this.idioma.lbNoNotaDebito,
            dataIndex: 'notadebito',
            default: true,
            width: 100
        });
        this.addGridColumn({
            header: _this.idioma.lbNoNotaCredito,
            dataIndex: 'notacredito',
            default: true,
            width: 100
        });
        this.addGridColumn({
            header: _this.idioma.lbNoFacturaAfectada,
            dataIndex: 'facturaafectada',
            default: true,
            width: 150
        });
        this.addGridColumn({
            header: _this.idioma.lbVentaIncluyendoIVA,
            dataIndex: 'ventaiva',
            default: true,
            width: 100
        });
        this.addGridColumn({
            header: _this.idioma.lbVentasInternas,
            width: 120,
            dataIndex: 'ventainter',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbBaseImponible,
            width: 120,
            dataIndex: 'baseimponible',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbAlicuota,
            width: 120,
            dataIndex: 'alicuota',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbImpuestoIVA,
            width: 120,
            dataIndex: 'impuestoiva',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbIVARetenidoPorComprador,
            width: 150,
            dataIndex: 'ivacomprador',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbIVAPercibido,
            width: 120,
            dataIndex: 'ivapercivido',
            default: true
        });
    },
    render: function() {
        var _this = this;
        var p = LOG.fac.libroventa.View.superclass.render.call(this);
        _this.btnLimpiar = LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonLimpiar({
            handler: _this.onTriggerClear,
            scope: _this
        }));
        _this.btnFiltar = LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonBuscar({
            handler: _this.onTriggerSearch,
            scope: _this
        }));
        _this.fechaInicio = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDesde,
            name: 'desde',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desde',
            endDateField: 'hasta',
            editable: false
        });
        _this.fechaFin = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbHasta,
            name: 'hasta',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hasta',
            startDateField: 'desde',
            editable: false
        });
        p.items.items[0].items.items[1].items.items[0].getTopToolbar().removeAll();
        p.items.items[0].items.items[1].items.items[0].getTopToolbar().add({xtype: 'tbtext', text: _this.idioma.lbDesde}, _this.fechaInicio);
        p.items.items[0].items.items[1].items.items[0].getTopToolbar().add('-', {xtype: 'tbtext', text: _this.idioma.lbHasta}, _this.fechaFin);
        p.items.items[0].items.items[1].items.items[0].getTopToolbar().add('-', _this.btnFiltar, '-', _this.btnLimpiar);
        _this.getStorePrincipal().on({
            'beforeload': function(st, ops) {
                st.baseParams = {
                    fechainicio: _this.fechaInicio.getValue(),
                    fechafin: _this.fechaFin.getValue(),
                    start: 0,
                    limit: _this.getGridPrincipal().getBottomToolbar().cbPageSize.getValue()
                };
            }
        });
        _this.getStorePrincipal().load();
        return p;
    },
    /**
     * Accion que se dispara cuando se ejecuta el boton limpiar
     * @returns {undefined}
     */
    onTriggerClear: function() {
        var _this = this.scope || this;
        _this.fechaInicio.reset();
        _this.fechaInicio.blur();
        _this.fechaFin.reset();
        _this.getStorePrincipal().filtrado = false;
        _this.getStorePrincipal().reload();
    },
    /**
     * Accion que se ejecuta en la accion buscar o la tecla caliente del componente
     * @returns {undefined}
     */
    onTriggerSearch: function() {
        var _this = this.scope || this;
        _this.getStorePrincipal().filtrado = true;
        _this.getStorePrincipal().reload();
    },
    onReport: function(btn) {
        var _this = this;
        this.control = new LOG.util.Report({
            reports: [
                {
                    name: btn.name,
                    isList: true,
                    params: {  
                        fechainicio: (_this.fechaInicio.getValue()) ? _this.fechaInicio.getValue().format('d-m-Y') : null,
                        fechafin: (_this.fechaFin.getValue()) ? _this.fechaFin.getValue().format('d-m-Y') : null
                    },
                    dirReport: btn.dirReport
                }
            ]
        });
        this.control.view();
        
        
    }
});