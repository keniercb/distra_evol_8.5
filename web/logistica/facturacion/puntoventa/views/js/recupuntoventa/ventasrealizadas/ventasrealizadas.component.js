Ext.ns('LOG.fac.puntoventa.recuperaciones');
LOG.fac.puntoventa.recuperaciones.ventasrealizadas = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/facturacion/puntoventa/index.php/ventaspuntoventa';
        this.modoSeleccion = 1;
        this.urlBusquedaGridPrincipal = 'ventasRealizadasxcliente';
        this.concepto = config.idioma.ttBtnBuscarVenta;
        this.autoLoad = false;
        //this.textBusquedaSimple = config.idioma.ttConceptoNumeroVenta;
        LOG.fac.puntoventa.recuperaciones.ventasrealizadas.superclass.constructor.call(this, config);
        this.keyMap = new Ext.KeyMap(Ext.getDoc());
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgCliente,
            width: 130,
            dataIndex: 'nombre',
            agrupador: true
        });
        this.addGridColumn({
            header: this.idioma.cgAreas,
            width: 100,
            dataIndex: 'areaventa',
            filter: {
                type: 'combo',

                url: '/logistica/facturacion/puntoventa/index.php/ventaspuntoventa/cargarTiendas',
                valueField: 'areaventa',
                displayField: 'areaventa',
                dataIndex: 'areaventa',
                mode: 'remote',
                autoLoad: false
            }
            //default: true
            //hidden: true,
            //agrupador: true			
        });
        this.addGridColumn({
            header: this.idioma.cgTipoDoc,
            width: 90,
            dataIndex: 'tipodoc',
            filter: {
                type: 'combo',

                url: '/logistica/facturacion/puntoventa/index.php/ventaspuntoventa/cargarTipoDocumento',
                valueField: 'tipodoc',
                displayField: 'tipodoc',
                dataIndex: 'tipodoc',
                mode: 'remote',
                autoLoad: false
            }
            //default: true
            //hidden: true,
            //agrupador: true
        });
        this.addGridColumn({
            header: this.idioma.cgNroVenta,
            width: 40,
            dataIndex: 'nroventa'/* ,
            filter: {
                type: 'float',
                dataIndex: 'nroventa'
            } */
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaVenta,
            dataIndex: 'fechaventa',
            width: 40,
            default: true,
            align: 'center'
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadProductos,
            width: 30,
            dataIndex: 'cantprod',
            // default: true,
            align: 'center'/*,
             filter: {
                type: 'float',
                dataIndex: 'cantprod'
            } */
        });
        this.addGridColumn({
            header: 'Importe',//this.idioma.cgImporte,
            width: 40,
            dataIndex: 'importe',
            //default: true,
            filter: {
                type: 'float',
                dataIndex: 'importe'
            },
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: 'Vendedor',//this.idioma.cgImporte,
            width: 80,
            dataIndex: 'vendedor',
            align: 'left',
            filter: {
                type: 'combo',
                url: '/logistica/facturacion/puntoventa/index.php/ventaspuntoventa/cargarVendedor',
                valueField: 'vendedor',
                displayField: 'vendedor',
                dataIndex: 'vendedor',
                mode: 'remote',
                autoLoad: false
            }

        });
        this.addGridColumn({ dataIndex: 'fechaexpiracion' });
        this.addGridColumn({ dataIndex: 'idventas' });
        this.addGridColumn({ dataIndex: 'idusuario' });
        this.addGridColumn({ dataIndex: 'idpersona' });
        this.addGridColumn({ dataIndex: 'idestructuraop' });
    },
    initDefaultButtons: function () {
        var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimirListado,
            text: this.idioma.ttBtnImprimirListado,
            handler: function () {
                var objParams = {};
                objParams.idventacliente = (me.cmbCliente.getValue()) ? me.cmbCliente.getValue() : null;
                objParams.idareaventa = (me.cmbArea.getValue()) ? me.cmbArea.getValue() : null;
                if (me.cmbOrdenarPor.getValue() == 'ordenalfabetico') {
                    objParams.ordenalfabetico = 'ordenalfabetico';
                } else if (me.cmbOrdenarPor.getValue() == 'ordenalfabeticodes') {
                    objParams.ordenalfabeticodes = 'ordenalfabeticodes';
                }
                else if (me.cmbOrdenarPor.getValue() == 'mayorimporte') {
                    objParams.ordenmayorimporte = 'mayorimporte';
                } else if (me.cmbOrdenarPor.getValue() == 'menorimporte') {
                    objParams.ordenmenorimporte = 'menorimporte';
                }  else {
                    objParams.ordenalfabetico = null;
                    objParams.ordenmayorimporte = null;
                    objParams.ordenalfabeticodes = null;
                    objParams.ordenmenorimporte = null;
                }
                objParams.fechainicio = (me.dtfDesdeVentas.isDirty() && me.dtfDesdeVentas.isValid()) ? me.dtfDesdeVentas.getValue().format('Y-m-d') : null;
                objParams.fechafin = (me.dtfHastaVentas.isDirty() && me.dtfHastaVentas.isValid()) ? me.dtfHastaVentas.getValue().format('Y-m-d') : null;
                objParams.idestructura = idEntidad;
                console.log(me.getGridPrincipal().filters.filters.items);
                objParams.areaventa = (me.getGridPrincipal().filters.filters.items[0].getValue()) ? me.getGridPrincipal().filters.filters.items[0].getValue() : null;
                objParams.tipodoc = (me.getGridPrincipal().filters.filters.items[1].getValue()) ? me.getGridPrincipal().filters.filters.items[1].getValue() : null;
                objParams.importe = (me.getGridPrincipal().filters.filters.items[2].getValue()) ? me.getGridPrincipal().filters.filters.items[2].getValue() : null;
                objParams.vendedor = (me.getGridPrincipal().filters.filters.items[3].getValue()) ? me.getGridPrincipal().filters.filters.items[3].getValue() : null;
                if (objParams.importe['eq']) {
                    objParams.filtrocampomenor = 'importe';
                    objParams.filtrocampomayor = 'importe';
                    objParams.filtrocampoigual = 'importe';
                    objParams.filtrovalorigual = objParams.importe['eq'];
                }
                else if (objParams.importe['lt']) {
                    objParams.filtrocampomenor = 'importe';
                    objParams.filtrocampomayor = 'importe';
                    objParams.filtrocampoigual = 'importe';
                    objParams.filtrovalormenor = objParams.importe['lt'];
                }
                else if (objParams.importe['gt']) {
                    objParams.filtrocampomenor = 'importe';
                    objParams.filtrocampomayor = 'importe';
                    objParams.filtrocampoigual = 'importe';
                    objParams.filtrovalormayor = objParams.importe['gt'];
                }

                var report = new LOG.util.Report({
                    idioma: me.idioma,
                    reports: [
                        {
                            name: 'Listado Venta por cliente',
                            isList: true,
                            params: objParams,
                            dirReport: '/distra/logistica/puntoventa/recuperaciones/listadoventaxcliente'
                        }
                    ]
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
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({ id: 'idventaxcliente' }));
        /*var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimirVentasRealizadas,
            //disabled: true,
			menu : [
			{
			    text:'Imprimir listado',	
                iconCls : 'distraimprimir',			
				handler: function () {
					var objParams = {};
					objParams.idventacliente = (me.cmbCliente.getValue())? me.cmbCliente.getValue() : null;
					objParams.idareaventa = (me.cmbArea.getValue())? me.cmbArea.getValue() : null;
					objParams.fechainicio = (me.dtfDesdeVentas.isDirty() && me.dtfDesdeVentas.isValid()) ? me.dtfDesdeVentas.getValue().format('Y-m-d') : null;
					objParams.fechafin = (me.dtfHastaVentas.isDirty() && me.dtfHastaVentas.isValid()) ? me.dtfHastaVentas.getValue().format('Y-m-d') : null;
					objParams.idestructura = idEntidad;
					var report = new LOG.util.Report({
						idioma: me.idioma,
						reports: [
							{
								name: 'Listado Venta por cliente',
								isList: true,
								params: objParams,
								dirReport: '/distra/logistica/puntoventa/recuperaciones/listadoventaxcliente'
							}
						]
					});
					report.view();
				},
            
			},{
			    text:'Imprimir modelo',
                iconCls : 'distraimprimir',		
                disabled: true,		
				handler: function () {
					var objParams = {};
					objParams.idventas = me.getSmPrincipal().getSelected().get('idventas') || null;
					objParams.idestructura = idEntidad;
					var report = new LOG.util.Report({
						idioma: me.idioma,
						reports: [
							{
								name: 'Modelo Venta por cliente',
								isList: true,
								params: objParams,
								dirReport: '/distra/logistica/puntoventa/recuperaciones/ventaxcliente'
							}
						]
					});
					report.view();
				},
            
			}			
			],
			controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e === 'rowselect') {
                        b.enable();
                    } else if (e === 'rowdeselect') {
                        b.disable();
                    }
                }, 'controlFnbotonImprimir');
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({id:'idventaxcliente'}));*/
    },
    view: function () {
        var me = this;
        this.cmbArea = new LOG.util.ComboBox({
            name: 'idareaventa',
            url: this.dirController + '/cargarAreasVenta',
            valueField: 'idareaventa',
            displayField: 'nombretienda',
            anchor: '90%',
            editable: false,
            emptyText: this.idioma.lbTxtSelect,
            autoLoad: false,
            listeners: {
                select: function (cmb, rd) {
                    me.getStorePrincipal().reload();
                }
            }
        });

        this.cmbCliente = new LOG.util.ComboBox({
            name: 'idventacliente',//idcliente
            url: '/logistica/facturacion/puntoventa/index.php/ventasdevolucion/obtenerClientes',
            valueField: 'idventacliente',
            displayField: 'nombre',
            anchor: '90%',
            pageSize: 30,
            editable: true,
            mode: 'remote',
            minChars: 0,
            autoLoad: false,
			baseParams:{
                isRecup:true
            }, 
            listeners: {
                select: function (cmb, rd) {
                    me.getStorePrincipal().reload();
                }
            }
        });
        // this.cmbCliente = LOG.util.Prototipos.inputTexto();
        // Combo ordenar busqueda por Orden Alfabetico,mayor importe ,mayor venta
        this.cmbOrdenarPor = new LOG.util.ComboBox({
            width: 120,
            valueField: 'id',
            displayField: 'tipo',
            editable: false,
            //name:''
            store: new Ext.data.SimpleStore({
                fields: ['id', 'tipo'],
                data: [
                    ['ordenalfabetico', 'Orden alfabético ASC'],
                    ['ordenalfabeticodes', 'Orden alfabético DES'],
                    /* ['mayorventa', 'Mayor venta'], */
                    ['mayorimporte', 'Mayor importe'],
                    ['menorimporte', 'Menor importe']
                ]
            }),
            listeners: {
                select: function (cmb, rd) {
                    me.getStorePrincipal().reload();
                }
            }

        });

        this.dtfDesdeVentas = new Ext.form.DateField({
            width: 80,
            editable: false,
            name: 'idDtfDesdeVentas',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'idDtfDesdeVentas',
            endDateField: 'idDtfHastaVentas'
        });
        this.dtfHastaVentas = new Ext.form.DateField({
            width: 80,
            name: 'idDtfHastaVentas',
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'idDtfHastaVentas',
            startDateField: 'idDtfDesdeVentas'
        });

        this.dtfDesdeVentas.endDateField = this.dtfHastaVentas.id;
        this.dtfHastaVentas.startDateField = this.dtfDesdeVentas.id;



        this.btnBuscarFechaVentas = new LOG.util.Prototipos.botonBuscar({
            tooltip: this.idioma.ttBtnBuscarVentas + ' <b>(Alt+B)</b>',
            handler: function () {
                me.onBtnBuscar();
            },
            key: {
                key: 'b',
                alt: true,
                ctrl: false,
                scope: me.btnBuscarFechaVentas,
                shift: false, stopEvent: true
            }
        });
        this.btnLimpiarFechaVentas = new LOG.util.Prototipos.botonLimpiar({
            tooltip: this.idioma.ttBtnLimpiar + ' <b>(Alt+L)</b>',
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
        this.btnBuscarFechaVentas.key.fn = function (b, e) {
            e.stopPropagation();
            e.preventDefault();
            me.onBtnBuscar();
        };
        this.btnLimpiarFechaVentas.key.fn = function (b, e) {
            e.stopPropagation();
            e.preventDefault();
            me.onBtnLimpiar();
        };
        this.listaBotones.each(function (b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.keyMap.addBinding(this.btnBuscarFechaVentas.key);
        this.keyMap.addBinding(this.btnLimpiarFechaVentas.key);
        this.btnBuscarFechaVentas.setText(LOG.util.UIManager.ireplaceStyle(this.btnBuscarFechaVentas.getText(), this.btnBuscarFechaVentas.key.key, 'span', 'text-decoration: underline;'));
        this.btnLimpiarFechaVentas.setText(LOG.util.UIManager.ireplaceStyle(this.btnLimpiarFechaVentas.getText(), this.btnLimpiarFechaVentas.key.key, 'span', 'text-decoration: underline;'));

        this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: [
                '-', LOG.puntoventa.recuperacion.Idioma.lbCmbCliente + ':', this.cmbCliente,
                // '-', LOG.puntoventa.recuperacion.Idioma.lbCmbArea + ':', this.cmbArea,
                '-', LOG.puntoventa.recuperacion.Idioma.lbcmbOrdenarPor + ':', this.cmbOrdenarPor,
                '-', LOG.puntoventa.recuperacion.Idioma.lbDtfDesde + ':', this.dtfDesdeVentas,
                '-', LOG.puntoventa.recuperacion.Idioma.lbDtfHasta + ':', this.dtfHastaVentas,
                '-', this.btnBuscarFechaVentas,
                '-', this.btnLimpiarFechaVentas
            ]
        }));
        LOG.util.UIManager.apply(this.getPanelSuperior(), {
            width: '50%'
        });
        return LOG.fac.puntoventa.recuperaciones.ventasrealizadas.superclass.view.call(this);
    },
    render: function () {
        var p = LOG.fac.puntoventa.recuperaciones.ventasrealizadas.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
            if (e === 'beforeload') {
                if (me.cmbArea.isValid()) {
                    this.initBaseParams.idareaventa = me.cmbArea.getValue() || null;
                    this.baseParams.idareaventa = me.cmbArea.getValue() || null;
                }
                if (me.cmbCliente.isValid()) {
                    this.initBaseParams.idventacliente = me.cmbCliente.getValue() || null;
                    this.baseParams.idventacliente = me.cmbCliente.getValue() || null;
                }
                if (me.cmbOrdenarPor.isValid()) {
                    this.initBaseParams.ordenarpor = me.cmbOrdenarPor.getValue() || null;
                    this.baseParams.ordenarpor = me.cmbOrdenarPor.getValue() || null;
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
        }, 'CMBAREAVENTA');
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function (e, sm, i, rd) {
            if (e === 'selectionchange') {
                if (this.hasSelection()) {
                    if (!me.pProdVenta.isVisible()) {
                        me.pProdVenta.setVisible(true);
                    }
                    if (me.pProdVenta.collapsed) {
                        me.pProdVenta.expand(true);
                    }
                    me.prodVendidos.getStorePrincipal().removeAll();
                    me.prodVendidos.getStorePrincipal().load({
                        params: {
                            idventas: this.getSelected().data.idventas
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
        this.prodVendidos = new LOG.fac.puntoventa.recuperaciones.ProdVendidos({
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
        if ((this.dtfDesdeVentas.isDirty())
            || (this.dtfHastaVentas.isDirty())
            || (this.cmbArea.isDirty())
            || (this.cmbCliente.isDirty())
            || (this.cmbOrdenarPor.isDirty())
        ) {

        }
        this.getStorePrincipal().reload();
        /*  console.log('se hizo')
                    Ext.getCmp('cmbFilterAreaVenta').reset(); */
    },
    onBtnLimpiar: function () {
        if ((this.dtfDesdeVentas.isDirty())
            || (this.dtfHastaVentas.isDirty())
            || (this.cmbArea.isDirty())
            || (this.cmbCliente.isDirty())
            || (this.cmbOrdenarPor.isDirty())
            || this.getGridPrincipal().filters.filters.items[0].getValue()
            || this.getGridPrincipal().filters.filters.items[1].getValue()
            || this.getGridPrincipal().filters.filters.items[2].getValue()
            || this.getGridPrincipal().filters.filters.items[3].getValue()
        ) {
            this.dtfDesdeVentas.reset();
            this.dtfHastaVentas.reset();
            this.cmbArea.reset();
            this.cmbCliente.reset();
            this.cmbOrdenarPor.reset();
            this.getGridPrincipal().filters.filters.items[0].setValue('');
            this.getGridPrincipal().filters.filters.items[1].setValue('');
            this.getGridPrincipal().filters.filters.items[2].setValue('');
            this.getGridPrincipal().filters.filters.items[3].setValue('');
            //console.log(this.getStorePrincipal());

            this.getStorePrincipal().reload();
        }


    }
});

LOG.fac.puntoventa.recuperaciones.ProdVendidos = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/facturacion/puntoventa/index.php/ventaspuntoventa',
    urlBusquedaGridPrincipal: 'cargarProductosVenta',
    formaVisualizacion: 'panel',
    busquedaBasica: true,
    autoLoad: false,
    modoSeleccion: 1,
    smVenta: undefined,
    idGridPrincipal: "idproducto",
    constructor: function (config) {
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacion;
        LOG.fac.puntoventa.recuperaciones.ProdVendidos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        /*this.addGridColumn({
           header: this.idioma.cgCodigo,
           width: 200,
           dataIndex: 'codigo',
           autoExpand: true,
           default: true
       });*/
        this.addGridColumn({
            header: this.idioma.cgDenom,
            width: 350,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadVendida,
            width: 80,
            dataIndex: 'cantidad',
            default: true,
            align: 'right',
        });
        this.addGridColumn({
            header: this.idioma.cgPrecioTPV,
            width: 80,
            dataIndex: 'precio',
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            width: 80,
            dataIndex: 'importetotal',
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
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
    render: function () {
        var p = LOG.fac.puntoventa.recuperaciones.ProdVendidos.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
            if (e === 'beforeload') {
                if (typeof me.smVenta != 'undefined') {
                    this.baseParams.idventas = me.smVenta.getSelected().data.idventas;
                    this.initBaseParams.idventas = me.smVenta.getSelected().data.idventas;
                }
                /* this.baseParams.prodareas = 1;
                 this.initBaseParams.prodareas = 1;*/
            }
        });
        return p;
    }
});

