Ext.ns('LOG.fac.administrar');
LOG.fac.administrar.Producto = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.dirController = '/logistica/facturacion/puntoventa/index.php/administrarpuntoventa';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.urlBusquedaGridPrincipal = 'cargarProductos';
        this.modoSeleccion = 1;
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacion;
        LOG.fac.administrar.Producto.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.tfCodigoDenom,
            width: 200,
            dataIndex: 'text',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 200,
            dataIndex: 'umedida',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPrecio,
            width: 200,
            dataIndex: 'precio',
            default: true,
            renderer: function(v) {
                if (v)
                    return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 200,
            dataIndex: 'existencia',
            default: true,
            renderer: function(v) {
                if (v)
                    return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            dataIndex: 'idproducto'
        });
    },
    initDefaultButtons: function() {
        var me = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'informe',
            text: this.idioma.lbBtnRegistrarEntrada,
            tooltip: this.idioma.lbBtnRegistrarEntrada,
            disabled: true,
            handler: function() {
                this.winregistrarentrada = new LOG.fac.administrar.winregistrarentrada({
                    idioma: me.idioma,
                    textBusquedaSimple: me.idioma.textBusquedaSimple,
                    _parent: me,
                    idseleccionados: me.getProductosAdded(),
                    idarea: (me.cmbArea) ? me.cmbArea.getValue() : undefined
                });
                this.winregistrarentrada.init();
                this.winregistrarentrada.view();
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'cambiar',
            text: this.idioma.lbBtnCambiarPrecio,
            tooltip: this.idioma.ttBtnCambiarPrecio,
            disabled: true,
            handler: function() {
                var cambiarPrecio = new LOG.fac.administrar.cambiarPrecio({
                    idioma: me.idioma,
                    _parent: me,
                    producto: me.getSmPrincipal().getSelected(),
                    idarea: (me.cmbArea) ? me.cmbArea.getValue() : undefined,
                    datos: me.getGridPrincipal().getSelectionModel()
                });
                cambiarPrecio.show();
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({}));
    },
    getProductosAdded: function() {
        var productos = this.getStorePrincipal().data.items, idselections = [];
        for (var i = 0; i < productos.length; i++) {
            idselections.push(productos[i].data.idindicador);
        }
        return idselections;
    },
    render: function() {
        var p = LOG.fac.administrar.Producto.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e) {
            if (e == 'load') {
                me.listaBotones.getItem(0).enable();
            } else if (e === 'beforeload') {
                this.initBaseParams.idestructura = me.cmbArea.getValue();
                if (existeInv === 0) {
                    this.initBaseParams.prodareas = 1;
                    this.baseParams.prodareas = 1;
                }
            }
        });
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function(e) {
            if (e == 'selectionchange' && me.getSmPrincipal().getSelections().length > 0) {
                me.listaBotones.getItem(1).enable();
            } else {
                me.listaBotones.getItem(1).disable();
            }
        });
        return p;
    }
});

LOG.fac.administrar.ProdVendidos = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.dirController = '/logistica/facturacion/puntoventa/index.php/administrarpuntoventa';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.urlBusquedaGridPrincipal = 'cargaProductosVendidos';
        this.modoSeleccion = 1;
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacion;
        LOG.fac.administrar.ProdVendidos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.tfCodigoDenom,
            width: 200,
            dataIndex: 'text',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadVendida,
            width: 200,
            dataIndex: 'cantidadvendida',
            default: true,
            renderer: function(v) {
                return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            width: 200,
            dataIndex: 'importe',
            default: true,
            renderer: function(v, m, rd) {
                var importe = parseFloat(rd.data.precio).toFixed(2) * parseFloat(rd.data.cantidadvendida).toFixed(2);
                return parseFloat(importe).toFixed(2);
            }
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            dataIndex: 'idproducto'
        });
        this.addGridColumn({
            dataIndex: 'precio'
        });
    },
    render: function() {
        var p = LOG.fac.administrar.ProdVendidos.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e, st, rd) {
            if (e === 'beforeload') {
                this.baseParams.idventas = me.smVenta.getSelected().data.idventas;
                this.initBaseParams.idventas = me.smVenta.getSelected().data.idventas;
                if(existeInv === 0){
                    this.baseParams.prodareas = 1;
                    this.initBaseParams.prodareas = 1;
                }
            }
        });
        return p;
    }
});

LOG.fac.administrar.Venta = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        LOG.util.UIManager.apply(this, config);
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/facturacion/puntoventa/index.php/administrarpuntoventa';
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.urlBusquedaGridPrincipal = 'ventasRealizadas';
        this.concepto = config.idioma.ttBtnBuscarVenta;
        this.textBusquedaSimple = config.idioma.ttConceptoNumeroVenta;
        LOG.fac.administrar.Venta.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        var me = this;
        this.addGridColumn({
            header: this.idioma.cgNroVenta,
            width: 100,
            dataIndex: 'nroventa',
            default: true
        });
//        this.addGridColumn({
//            header: this.idioma.cgCliente,
//            autoExpand: true,
//            dataIndex: 'cliente',
//            default: true,
//            renderer: function(v) {
//                return v ? v : me.idioma.ttSinCliente;
//            }
//        });
        this.addGridColumn({
            header: this.idioma.cgFechaVenta,
            dataIndex: 'fechaventa',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            width: 150,
            dataIndex: 'importe',
            default: true,
            renderer: function(v) {
                return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadProductos,
            width: 250,
            dataIndex: 'productos',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'fechaexpiracion'
        });
        this.addGridColumn({
            dataIndex: 'idventas'
        });
        this.addGridColumn({
            dataIndex: 'idcliente'
        });
    },
    initDefaultButtons: function() {
        var me = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'informe',
            text: this.idioma.lbBtnDevolucion,
            tooltip: this.idioma.lbBtnDevolucion,
            disabled: true,
            handler: function() {
                var regDevolucion = new LOG.fac.administrar.regDevolucion({
                    idioma: me.idioma,
                    _parent: me
                });
                regDevolucion.init();
                regDevolucion.view();
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({}));
    },
    view: function() {
        var v = LOG.fac.administrar.Venta.superclass.view.call(this);
        this.prodVendidos = new LOG.fac.administrar.ProdVendidos({
            idioma: this.idioma,
            smVenta: this.getSmPrincipal()
        });
        this.prodVendidos.init();
        var prod = this.prodVendidos.view();
        this.pProdVenta = LOG.util.UIManager.initPanel({
            region: 'south',
            disabled: true,
            layout: 'border',
            title: this.idioma.tlListadoProductos,
            collapsible: true,
            collapsed: true,
            height: 300,
            items: prod
        });
        this.getPanelPrincipal().add(this.pProdVenta);
        return v;
    },
    render: function() {
        var me = this, p = LOG.fac.administrar.Venta.superclass.render.call(this);
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e, st, rd) {
            if (e == 'load') {
                me.getStorePrincipal().baseParams.idestructura = me.cmbArea.getValue();
                if (rd.length == 0) {
                    me.listaBotones.getItem(0).disable();
                    me.pProdVenta.collapse(true);
                    me.pProdVenta.disable();
                }
            }
        }, 'ACTIVARBTN');
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function(e) {
            if (e == 'selectionchange') {
                me.prodVendidos.getStorePrincipal().removeAll();
                if (me.getSmPrincipal().hasSelection()) {
                    if (Date.parse(me.getSmPrincipal().getSelected().data.fechaexpiracion) >= Date.parse(fechaSistPV)) {
                        me.listaBotones.getItem(0).enable();
                    }
                    else {
                        me.listaBotones.getItem(0).disable();
                    }
                    if (me.pProdVenta.collapsed) {
                        me.pProdVenta.expand(true);
                    }
                    me.pProdVenta.enable();
                    me.prodVendidos.getStorePrincipal().load({
                        params: {
                            idventas: me.getSmPrincipal().getSelected().data.idventas
                        }
                    });
                }
            }
        }, 'PRODVENTA');
        return p;
    }
});

LOG.fac.administrar.tbGeneral = Ext.extend(LOG.util.UITabTemplate, {
    constructor: function(cfg) {
        var me = this;
        LOG.util.UIManager.apply(this, cfg);
        this.tbar = ['->', '-', this.idioma.tfArea + ':', this.createTbar(), '-'];
        LOG.fac.administrar.tbGeneral.superclass.constructor.call(this, cfg);
        this.addComponent();
        LOG.util.UIManager.encadenaFn(this.cmbArea, 'fireEvent', function(e) {
            if (e == 'change' || e == 'select') {
                var active = me.getActiveTemplate();
                active.getStorePrincipal().load({
                    params: {
                        idestructura: me.cmbArea.getValue()
                    }
                });
            }
        }, 'LOADSTORE');
        LOG.util.UIManager.encadenaFn(this, 'fireEvent', function(e) {
            if (e == 'tabchange' && me.cmbArea.isDirty()) {
                var active = me.getActiveTemplate();
                active.getStorePrincipal().load({
                    params: {
                        idestructura: me.cmbArea.getValue()
                    }
                });
            }
        }, 'LOADTHISSTORE');
    },
    addComponent: function() {
        this.pProductos = new LOG.fac.administrar.Producto({
            idioma: this.idioma,
            title: this.idioma.tlVentanaProductos,
            cmbArea: this.cmbArea,
            idComponent: 0
        });

        this.pVenta = new LOG.fac.administrar.Venta({
            idioma: this.idioma,
            cmbArea: this.cmbArea,
            title: this.idioma.tlVentanaVentasRealizadas,
            idComponent: 1
        });
        this.addTabToTemplete(this.pProductos);
        this.addTabToTemplete(this.pVenta);
    },
    createTbar: function() {
        this.cmbArea = new LOG.util.ComboBox({
            name: 'idareaventa',
            url: 'cargarAreas',
            valueField: 'codigo',
            autoSelect: true,
            displayField: 'denominacion',
            anchor: '90%',
            allowBlank: false,
            editable: false,
            emptyText: this.idioma.lbTxtSelect
        });
        return this.cmbArea;
    }
});