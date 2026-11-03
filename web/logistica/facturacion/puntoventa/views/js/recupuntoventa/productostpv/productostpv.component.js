Ext.ns('LOG.fac.puntoventa.recuperaciones');
LOG.fac.puntoventa.recuperaciones.productostpv = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/facturacion/puntoventa/index.php/productostpvpuntoventa',
    urlBusquedaGridPrincipal: 'cargarProductostpv',
    formaVisualizacion: 'panel',
    busquedaBasica: true,
    autoLoad: true,
    modoSeleccion: 1,
    idGridPrincipal: "cliente",
    constructor: function (config) {
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = 'Producto';

        LOG.fac.puntoventa.recuperaciones.productostpv.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgDenom,
            width: 250,
            dataIndex: 'producto',
            //autoExpand: true,
            agrupador: true,

            filter: {
                type: 'string',
                dataIndex: 'producto'
            }
            //default: true,

        });
        this.addGridColumn({
            header: this.idioma.cgCliente,
            width: 250,
            dataIndex: 'cliente',
            //autoExpand: true,
            // default: true,

            filter: {
                type: 'string',
                dataIndex: 'cliente'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgNaturaleza,
            width: 110,
            dataIndex: 'naturaleza',
            sortable: true,
            filter: {
                type: 'combo',
                
                url: '/logistica/facturacion/puntoventa/index.php/productostpvpuntoventa/cargarProductostpv',
                valueField: 'naturaleza',
                displayField: 'naturaleza',
                dataIndex: 'naturaleza',
            }
            //autoExpand: true,
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadVendida,
            width: 80,
            dataIndex: 'cantidad',
            filter: {
                type: 'float',
                dataIndex: 'cantidad'
            },
            //autoExpand: true,
            //default: true,
            align: 'right'
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            width: 80,
            dataIndex: 'importe',
            //autoExpand: true,
            // default: true,
            align: 'right',
            filter: {
                type: 'float',
                dataIndex: 'importe'
            },
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({ dataIndex: 'idindicador' });
        this.addGridColumn({ dataIndex: 'idcliente' });
    },
    initDefaultButtons: function () {
        var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimirListado,
            text: this.idioma.ttBtnImprimirListado,
            handler: function () {
                var objParams = {};
                console.log(me.getGridPrincipal().filters.filters.items);
                //objParams.digitos = (me.getGridPrincipal().toolbars[0].items.items[1].getValue()) ? me.getGridPrincipal().toolbars[0].items.items[1].getValue() : null
                objParams.producto = (me.getGridPrincipal().filters.filters.items[0].getValue()) ? me.getGridPrincipal().filters.filters.items[0].getValue() : null;
                objParams.cliente = (me.getGridPrincipal().filters.filters.items[1].getValue()) ? me.getGridPrincipal().filters.filters.items[1].getValue() : null;
                objParams.naturaleza = (me.getGridPrincipal().filters.filters.items[2].getValue()) ? me.getGridPrincipal().filters.filters.items[2].getValue() : null;
                objParams.cantidad = (me.getGridPrincipal().filters.filters.items[3].getValue()) ? me.getGridPrincipal().filters.filters.items[3].getValue() : null;
                objParams.importe = (me.getGridPrincipal().filters.filters.items[4].getValue()) ? me.getGridPrincipal().filters.filters.items[4].getValue() : null;
                
               
                   
                   
                    //Igual
                    if (objParams.importe['eq']) {
                        objParams.valor = objParams.importe['eq'];
                        objParams.signo = 3;
                        objParams.campo = 'importe';
                    }

                    //Menor
                    else if (objParams.importe['lt']){
                        objParams.valor = objParams.importetotal['lt'];
                        objParams.signo = 1;
                        objParams.campo = 'importe';
                    }
                    //Mayor
                    else if (objParams.importe['gt']){
                        objParams.valor = objParams.importe['gt'];
                        objParams.signo = 2;
                        objParams.campo = 'importe';
                    }
                   /*  else if (objParams.importe['lt'] && objParams.importe['gt']) {
                        objParams.filtrovalormenor = objParams.importe['lt'];
                        objParams.filtrovalormayor = objParams.importe['gt'];
                    } */

               

           
                 
                   
                    //Igual
                    if (objParams.cantidad['eq']) {
                        objParams.valor = objParams.cantidad['eq'];
                        objParams.signo = 3;
                        objParams.campo = 'cantidad';
                    }

                    //Menor
                    else if (objParams.cantidad['lt']){
                        objParams.valor = objParams.cantidad['lt'];
                        objParams.signo = 1;
                        objParams.campo = 'cantidad';
                    }
                    //Mayor
                    else if (objParams.cantidad['gt']){
                        objParams.valor = objParams.cantidad['gt'];
                        objParams.signo = 2;
                        objParams.campo = 'cantidad';
                    }
                   

              

                var report = new LOG.util.Report({
                    idioma: me.idioma,
                    reports: [{
                        name: 'Listado Ventas por tarjeta',
                        isList: true,
                        params: objParams,
                        dirReport: '/distra/logistica/puntoventa/recuperaciones/ventaxtarjeta'
                    }]
                });
                report.view();
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    /*if (e === 'rowselect') {
                        b.enable();
                    } else if (e === 'rowdeselect') {
                        b.disable();
                    }*/
                }, 'controlFnbotonImprimir');
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({ id: 'idayudaproductotpv' }));
    },
    render: function () {
        var p = LOG.fac.puntoventa.recuperaciones.productostpv.superclass.render.call(this), me = this;
        /*LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
            if (e === 'beforeload') {
                if (me.cmbArea.isValid()) {
                    this.initBaseParams.idareaventa = me.cmbArea.getValue() || null;
                    this.baseParams.idareaventa = me.cmbArea.getValue() || null;
                }				
				if (me.cmbCliente.isValid()) {
                    this.initBaseParams.idventacliente = me.cmbCliente.getValue() || null;
                    this.baseParams.idventacliente = me.cmbCliente.getValue() || null;
                }
                if (me.dtfDesdeVentas.isValid()) {
                    this.initBaseParams.desde = me.dtfDesdeVentas.getValue() ? me.dtfDesdeVentas.getValue().format('Y-m-d') : null;
                    this.baseParams.desde = me.dtfDesdeVentas.getValue() ? me.dtfDesdeVentas.getValue().format('Y-m-d') : null;
                }
                if (me.dtfHastaVentas.isValid()) {
                    this.initBaseParams.hasta = me.dtfHastaVentas.getValue() ? me.dtfHastaVentas.getValue().format('Y-m-d') : null;
                    this.baseParams.hasta = me.dtfHastaVentas.getValue() ? me.dtfHastaVentas.getValue().format('Y-m-d') : null;
                }

            } else if (e === 'load') {
                if (this.getCount() == 0) {
                    if (me.dtfHastaVentas.isDirty() || me.dtfDesdeVentas.isDirty()) {
                        mostrarMensaje(1, me.idioma.msgNoResultados);
                        me.prodVendidos.getStorePrincipal().removeAll();
                        me.pProdVenta.disable();
                        me.pProdVenta.collapse(true);
                        me.pProdVenta.setVisible(false);
                        return;
                    }
                    mostrarMensaje(1, me.idioma.msgNoMostrarResultados);
                    me.pProdVenta.disable();
                    me.pProdVenta.collapse(true);
                    me.pProdVenta.setVisible(false);
                }
            }
        }, 'CMBAREAVENTA');*/
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function (e, sm, i, rd) {
            if (e === 'selectionchange') {
                if (this.hasSelection()) {
                    if (!me.pDetalles.isVisible()) {
                        me.pDetalles.setVisible(true);
                    }
                    if (me.pDetalles.collapsed) {
                        me.pDetalles.expand(true);
                    }
                    me.Detalles.getStorePrincipal().removeAll();
                    me.Detalles.getStorePrincipal().load({
                        params: {
                            idventacliente: this.getSelected().data.idcliente,
                            idindicador: this.getSelected().data.idindicador,
                            abreviatura: 'compventaLog'
                        },
                        callback: function (rd) {
                            if (rd.length > 0) {
                                me.pDetalles.enable();
                            }
                        },
                        
                    });
                }
                
            }
           
        }, 'LISTVENTA');
        this.initPanelDetalles();
        return p;
    },
    initPanelDetalles: function () {
        this.Detalles = new LOG.fac.puntoventa.recuperaciones.Detalles({
            idioma: this.idioma,
            smVenta: this.getSmPrincipal()
        });
        this.Detalles.init();
        var detallesVenta = this.Detalles.view();
        this.pDetalles = LOG.util.UIManager.initPanel({
            title: this.idioma.tlDetalles,
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
            items: detallesVenta
        });
        this.getPanelPrincipal().add(this.pDetalles);
    },
    
});

LOG.fac.puntoventa.recuperaciones.Detalles = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/facturacion/puntoventa/index.php/ventaspuntoventa',
    urlBusquedaGridPrincipal: 'ventasRealizadasxcliente',
    formaVisualizacion: 'panel',
    autoLoad: false,
    modoSeleccion: 1,
    smVenta: undefined,
    idGridPrincipal: "iddocumento",
    constructor: function (config) {
        //this.concepto = config.idioma.ttBtnBuscarProducto;
        //this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacion;
        LOG.fac.puntoventa.recuperaciones.Detalles.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgEntidad,
            width: 200,
            dataIndex: 'entidad',
            // default: true,
            filter: {
                type: 'string',
                dataIndex: 'entidad'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgAreas,
            width: 150,
            dataIndex: 'areaventa',
            autoExpand: true,
            //default: true
            filter: {
                type: 'combo',
                
                url: '/logistica/facturacion/puntoventa/index.php/ventaspuntoventa/ventasRealizadasxcliente',
                valueField: 'areaventa',
                displayField: 'areaventa',
                dataIndex: 'areaventa',
            }
            //hidden: true,
            //agrupador: true			
        });
        this.addGridColumn({
            header: this.idioma.cgVendedor,
            width: 200,
            dataIndex: 'vendedor',
            //default: true,
            filter: {
                type: 'combo',
                
                url: '/logistica/facturacion/puntoventa/index.php/ventaspuntoventa/ventasRealizadasxcliente',
                valueField: 'vendedor',
                displayField: 'vendedor',
                dataIndex: 'vendedor',
            }
        });
        this.addGridColumn({
            header: this.idioma.cgNroVenta,
            width: 90,
            dataIndex: 'nroventa',
            //default: true
            filter:{
                type:'string',
                dataIndex:'nroventa'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgFechaVenta,
            dataIndex: 'fechaventa',
            width: 100,
           // default: true,
            align: 'center',
            filter:{
                type:"date",
                dataIndex:'fechaventa'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadVendida,
            width: 80,
            dataIndex: 'cantidad',
            default: true,
            align: 'center'
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            width: 90,
            dataIndex: 'importeproducto',
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
    },
    initDefaultButtons: function () {
        var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimirFactura,
            text: this.idioma.ttBtnImprimirFactura,
            handler: function () {
                var objParams = {};
                console.log(me.getGridPrincipal().toolbars);
                //objParams.digitos =  null
                console.log(me.getGridPrincipal().filters.filters.items);
                objParams.entidad = (me.getGridPrincipal().filters.filters.items[0].getValue()) ? me.getGridPrincipal().filters.filters.items[0].getValue() : null;
                objParams.areaventa = (me.getGridPrincipal().filters.filters.items[1].getValue()) ? me.getGridPrincipal().filters.filters.items[1].getValue() : null;
                objParams.vendedor = (me.getGridPrincipal().filters.filters.items[2].getValue()) ? me.getGridPrincipal().filters.filters.items[2].getValue() : null;
                objParams.nroventa = (me.getGridPrincipal().filters.filters.items[3].getValue()) ? me.getGridPrincipal().filters.filters.items[3].getValue() : null;
                objParams.fechaventa = (me.getGridPrincipal().filters.filters.items[4].getValue()) ? me.getGridPrincipal().filters.filters.items[4].getValue() : null;
                var report = new LOG.util.Report({
                    idioma: me.idioma,
                    reports: [{
                        name: 'Facturas',
                        isList: false,
                        params: objParams,
                        dirReport: ''
                    }]
                });
                report.view();
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    /*if (e === 'rowselect') {
                        b.enable();
                    } else if (e === 'rowdeselect') {
                        b.disable();
                    }*/
                }, 'controlFnbotonImprimir');
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({ id: 'idayudaproductotpv' }));
    },
    render: function () {
        var p = LOG.fac.puntoventa.recuperaciones.Detalles.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
            if (e === 'beforeload') {
                if (typeof me.smVenta != 'undefined') {
                    this.baseParams.idventacliente = me.smVenta.getSelected().data.idcliente;
                    this.baseParams.idindicador = me.smVenta.getSelected().data.idindicador;
                    this.baseParams.abreviatura = 'compventaLog';
                    this.initBaseParams.idventacliente = me.smVenta.getSelected().data.idcliente;
                    this.initBaseParams.idindicador = me.smVenta.getSelected().data.idindicador;
                    this.initBaseParams.abreviatura = 'compventaLog';
                }
            }
           
        });
        return p;
    }
});
