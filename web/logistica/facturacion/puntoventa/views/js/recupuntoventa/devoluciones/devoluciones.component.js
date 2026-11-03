Ext.ns('LOG.fac.puntoventa.recuperaciones');
LOG.fac.puntoventa.recuperaciones.devoluciones = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/facturacion/puntoventa/index.php/recupdevolucionpuntoventa';
        this.modoSeleccion = 1;
        this.urlBusquedaGridPrincipal = 'devoluciones';
        this.concepto = config.idioma.ttBtnBuscarVenta;
        this.textBusquedaSimple = config.idioma.ttConceptoNumeroVenta;
        LOG.fac.puntoventa.recuperaciones.devoluciones.superclass.constructor.call(this, config);
        this.keyMap = new Ext.KeyMap(Ext.getDoc());
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'area',
            header: this.idioma.cgAreas,
            width: 250,
            hidden: true,
            agrupador: true
        });
        this.addGridColumn({
            header: this.idioma.cgNroVenta,
            width: 100,
            dataIndex: 'nroventa',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaVenta,
            dataIndex: 'fecha',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            width: 150,
            dataIndex: 'totalefectdevuelto',
            default: true,
            renderer: function (v) {
                return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadProductos,
            width: 250,
            dataIndex: 'cantidaddevolver',
            default: true
        });
        this.addGridColumn({dataIndex: 'iddevolucion'});
        this.addGridColumn({dataIndex: 'idventas'});
    },
    initDefaultButtons: function () {
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimirVentasRealizadas
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({}));
    },
    view: function () {
        var me = this;
        this.cmbArea = new LOG.util.ComboBox({
            name: 'idareaventadevolucion',
            url: this.dirController + '/cargarAreas',
            valueField: 'idestructuraop',
            displayField: 'denominacion',
            anchor: '90%',
            editable: false,
            emptyText: this.idioma.lbTxtSelect,
            listeners: {
                select: function (cmb, rd) {
                    me.getStorePrincipal().reload({
                        params: {
                            idestructura: rd.data.codigo
                        }
                    });
                }
            }
        });
        this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: ['-', '->', '-', LOG.puntoventa.recuperacion.Idioma.lbCmbArea + ':', this.cmbArea]
        }));
        this.dtfDesdeVentas = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'idDtfDesdeDevolucion',
            endDateField: 'idDtfHastaDevolucion'
        });
        this.dtfHastaVentas = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'idDtfHastaDevolucion',
            endDateField: 'idDtfDesdeDevolucion'
        });
        this.dtfDesdeVentas.endDateField = this.dtfHastaVentas.id;
        this.dtfHastaVentas.startDateField = this.dtfDesdeVentas.id;
        this.btnBuscarFechaVentas = new LOG.util.Prototipos.botonBuscar({
            tooltip: this.idioma.ttBtnBuscarVentas + ' <b>(Alt + B)</b>',
            handler: function () {
                me.onBtnBuscar();
            },
            key: {
                key: 'b',
                alt: true,
                ctrl: false,
                scope: me.btnBuscarFechaVentas,
                shift: false,
                stopEvent: true
            }
        });
        this.btnLimpiarFechaVentas = new LOG.util.Prototipos.botonLimpiar({
            tooltip: this.idioma.ttBtnLimpiar + ' <b>(Alt + L)</b>',
            handler: function () {
                me.onBtnLimpiar();
            },
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'l',
                scope: me.btnLimpiarFechaVentas,
                stopEvent: true
            }
        });
        this.btnBuscarFechaVentas.key.fn = function (b,e) {
            e.stopPropagation();
            e.preventDefault();
            me.onBtnBuscar();
        };
        this.btnLimpiarFechaVentas.key.fn = function (b,e) {
            e.stopPropagation();
            e.preventDefault();
            me.onBtnLimpiar();
        };
        this.keyMap.addBinding(this.btnBuscarFechaVentas.key);
        this.keyMap.addBinding(this.btnLimpiarFechaVentas.key);
        this.btnBuscarFechaVentas.setText(LOG.util.UIManager.ireplaceStyle(this.btnBuscarFechaVentas.getText(), this.btnBuscarFechaVentas.key.key, 'span', 'text-decoration: underline;'));
        this.btnLimpiarFechaVentas.setText(LOG.util.UIManager.ireplaceStyle(this.btnLimpiarFechaVentas.getText(), this.btnLimpiarFechaVentas.key.key, 'span', 'text-decoration: underline;'));
        this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: [
                '-', LOG.puntoventa.recuperacion.Idioma.lbDtfDesde + ':', this.dtfDesdeVentas,
                '-', LOG.puntoventa.recuperacion.Idioma.lbDtfHasta + ':', this.dtfHastaVentas,
                '-', this.btnBuscarFechaVentas,
                '-', this.btnLimpiarFechaVentas
            ]
        }));
        LOG.util.UIManager.apply(this.getPanelSuperior(), {
            width: '50%'
        });
        return LOG.fac.puntoventa.recuperaciones.devoluciones.superclass.view.call(this);
    },
    render: function () {
        var p = LOG.fac.puntoventa.recuperaciones.devoluciones.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
            if (e === 'beforeload') {
                if (me.cmbArea.isDirty() && me.cmbArea.isValid()) {
                    this.initBaseParams.idestructura = me.cmbArea.getValue();
                    this.baseParams.idestructura = me.cmbArea.getValue();
                }
                if (me.dtfDesdeVentas.isDirty() && me.dtfDesdeVentas.isValid()) {
                    this.initBaseParams.desde = me.dtfDesdeVentas.getValue().format('Y-m-d');
                    this.baseParams.desde = me.dtfDesdeVentas.getValue().format('Y-m-d');
                }
                if (me.dtfHastaVentas.isDirty() && me.dtfHastaVentas.isValid()) {
                    this.initBaseParams.hasta = me.dtfHastaVentas.getValue().format('Y-m-d');
                    this.baseParams.hasta = me.dtfHastaVentas.getValue().format('Y-m-d');
                }
            } else if (e === 'load') {
                if (this.data.length === 0) {
                    me.pProdVenta.collapse(true);
                    me.pProdVenta.disable();
                }
            }
        }, 'CMBAREAVENTA');
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function (e) {
            if (e === 'selectionchange') {
                if (me.getSmPrincipal().hasSelection()) {
                    if (me.pProdVenta.collapsed) {
                        me.pProdVenta.expand(true);
                    }
                    me.prodVendidos.getStorePrincipal().removeAll();
                    me.prodVendidos.getStorePrincipal().load({
                        params: {
                            iddevolucion: me.getSmPrincipal().getSelected().data.iddevolucion
                        },
                        callback: function (rd) {
                            if (rd.length > 0) {
                                me.pProdVenta.enable();
                            }
                        }
                    });
                }
            }
        }, 'PRODVENTA');
        this.initPanelProductoVenido();
        return p;
    },
    initPanelProductoVenido: function () {
        this.prodVendidos = new LOG.fac.puntoventa.recuperaciones.prodDevueltos({
            idioma: this.idioma,
            smVenta: this.getSmPrincipal()
        });
        this.prodVendidos.init();
        var prod = this.prodVendidos.view();
        this.pProdVenta = LOG.util.UIManager.initPanel({
            title: this.idioma.tlListadoProductos,
            region: 'south',
            hideCollapseTool: true,
            margins: '0 2 0 0',
            height: 265,
            minSize: 265,
            maxSize: 500,
            collapsible: true,
            collapsed: true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            border: true,
            split: true,
            frame: true,
            layout: 'fit',
            items: prod
        });
        this.getPanelPrincipal().add(this.pProdVenta);
    },
    onBtnBuscar: function () {
        var params = {};
        if (this.dtfDesdeVentas.isDirty() && this.dtfDesdeVentas.isValid()) {
            params.desde = this.dtfDesdeVentas.getValue().format('Y-m-d');
        }
        if (this.dtfHastaVentas.isDirty() && this.dtfHastaVentas.isValid()) {
            params.hasta = this.dtfHastaVentas.getValue().format('Y-m-d');
        }
        this.getStorePrincipal().reload({params: params});
    },
    onBtnLimpiar: function () {
        if ((this.dtfDesdeVentas.isDirty() && this.dtfDesdeVentas.isValid()) || (this.dtfHastaVentas.isDirty() && this.dtfHastaVentas.isValid())) {
            this.dtfDesdeVentas.reset();
            this.dtfHastaVentas.reset();
            this.getStorePrincipal().baseParams.desde = null;
            this.getStorePrincipal().baseParams.hasta = null;
            this.getStorePrincipal().initBaseParams.desde = null;
            this.getStorePrincipal().initBaseParams.hasta = null;
            this.getStorePrincipal().load();
        }
    }
});

LOG.fac.puntoventa.recuperaciones.prodDevueltos = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/facturacion/puntoventa/index.php/recupdevolucionpuntoventa',
    urlBusquedaGridPrincipal: 'cargarProductoDevuelto',
    formaVisualizacion: 'panel',
    busquedaBasica: true,
    autoLoad: false,
    modoSeleccion: 1,
    smVenta: undefined,
    constructor: function (config) {
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacion;
        LOG.fac.puntoventa.recuperaciones.prodDevueltos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgCodigoDenom,
            width: 200,
            dataIndex: 'text',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadVendida,
            width: 200,
            dataIndex: 'cantidaddevolver',
            default: true,
            renderer: function (v) {
                return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            width: 200,
            dataIndex: 'importe',
            default: true,
            renderer: function (v, m, rd) {
                var importe = parseFloat(rd.data.precioventa).toFixed(2) * parseFloat(rd.data.cantidaddevolver).toFixed(2);
                return parseFloat(importe).toFixed(2);
            }
        });
        this.addGridColumn({dataIndex: 'idindicador'});
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'precioventa'});
    },
    render: function () {
        var p = LOG.fac.puntoventa.recuperaciones.prodDevueltos.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
            if (e === 'beforeload') {
                if (typeof me.smVenta != 'undefined') {
                    this.baseParams.iddevolucion = me.smVenta.getSelected().data.iddevolucion;
                    this.initBaseParams.iddevolucion = me.smVenta.getSelected().data.iddevolucion;
                }
                this.baseParams.prodareas = 1;
                this.initBaseParams.prodareas = 1;
            }
        });
        return p;
    }
});

