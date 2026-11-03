Ext.ns('LOG.fac.puntoventa.recuperaciones');
LOG.fac.puntoventa.recuperaciones.ventastarjeta = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/facturacion/puntoventa/index.php/ventastarjeta',
    urlBusquedaGridPrincipal: 'ventasxtarjeta',
    formaVisualizacion: 'panel',
    busquedaBasica: true,
    autoLoad: false,
    modoSeleccion: 1,
    idGridPrincipal : "nroventa",
    constructor: function (config) {
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = 'Nro. tarjeta';
        LOG.fac.puntoventa.recuperaciones.ventastarjeta.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgNroVenta,
            width: 60,
            dataIndex: 'nroventa',
			//autoExpand: true,
            default: true,
            sortable: true,
            filter : {
                type: 'numeric',
                dataIndex: 'nroventa'
            }
        });
		this.addGridColumn({
            header: 'Titular',//this.idioma.cgCliente,
            width: 350,
			//dataIndex: 'titular',
			autoExpand: true,
            agrupador: true,
			default: true
        });
		this.addGridColumn({
            header: 'Tarjeta',//this.idioma.cgCliente,
            width: 200,
			dataIndex: 'digitos',
			//autoExpand: true,
            //default: true
			hidden: true,
            //agrupador: true,
            align: 'center',
            sortable: true,
            filter : {
                type: 'numeric',
                dataIndex: 'digitos'
            }
        });
        this.addGridColumn({
            header: 'Producto',//this.idioma.cgDenom,
            width: 200,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true,
            align: 'center',
            sortable: true,
            filter : {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });		
		this.addGridColumn({
            header: 'Naturaleza',//this.idioma.cgDenom,
            width: 100,
            dataIndex: 'naturaleza',
            //autoExpand: true,
            default: true,
            sortable: true,
            filter : {
                type: 'string',
                dataIndex: 'naturaleza'
            }
        });
		this.addGridColumn({
            header: 'Cantidad',//this.idioma.cgDenom,
            width: 80,
            dataIndex: 'cantidad',
            //autoExpand: true,
            default: true,
            align: 'right',
            filterable: true
        });
		this.addGridColumn({
            header: 'Importe',//this.idioma.cgDenom,
            width: 80,
            dataIndex: 'importetotal',
            //autoExpand: true,
            default: true,
            align: 'right',
            filterable: true, 
            renderer: function(v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
      /*  this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
         dataIndex: 'idproducto'
         });
        this.addGridColumn({
            dataIndex: 'precio'
        });*/
    },
	 initDefaultButtons: function () {
        var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimirProducto,
             disabled: true,
             handler: function() {
                 var objParams = {};  
                 console.log(me.getGridPrincipal().filters.filters.items);      
                 objParams.digitos = (me.getGridPrincipal().toolbars[0].items.items[1].getValue()) ? me.getGridPrincipal().toolbars[0].items.items[1].getValue() : null
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
             controlFn: function(b) {
                LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function(e) {
                    if (e === 'rowselect') {
                        b.enable();
                    } else if (e === 'rowdeselect') {
                        b.disable();
                    }
                }, 'controlFnbotonImprimir');
             }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({id: 'idayudaproductotpv'}));
    }
	});