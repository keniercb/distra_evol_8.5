Ext.ns('LOG.fac.puntoventa.recuperaciones');
LOG.fac.puntoventa.recuperaciones.ventastarjeta = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/facturacion/puntoventa/index.php/ventastarjeta',
    urlBusquedaGridPrincipal: 'ventasxtarjeta',
    formaVisualizacion: 'panel',
    busquedaBasica: true,
    autoLoad: false,
    modoSeleccion: 1,
    idGridPrincipal: "nroventa",
    constructor: function (config) {
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = 'Nro. tarjeta';
        LOG.fac.puntoventa.recuperaciones.ventastarjeta.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: 'Tienda',//this.idioma.cgCliente,
            width: 200,
            dataIndex: 'tienda',
            // default: true,
            filter: {
                type: 'combo',

                url: '/logistica/facturacion/puntoventa/index.php/ventastarjeta/ventasxtarjeta',
                valueField: 'tienda',
                displayField: 'tienda',
                dataIndex: 'tienda',
                mode: 'remote',
                autoLoad: false,
            }

        });
        this.addGridColumn({
            header: 'Titular',//this.idioma.cgCliente,
            width: 200,
            dataIndex: 'titular',
            //autoExpand: true,
            agrupador: true,
            //default: true,
            // sortable:true

        });
        this.addGridColumn({
            header: 'Tarjeta',//this.idioma.cgCliente,
            width: 40,
            dataIndex: 'digitos',
            filter: {
                type: 'string',
                dataIndex: 'digitos'
            },
            //autoExpand: true,
            //default: true
            //hidden: true,
            //agrupador: true,
            align: 'center'
        });
        this.addGridColumn({
            header: 'Cliente',//this.idioma.cgDenom,
            width: 250,
            dataIndex: 'cliente',
            //autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNroVenta,
            width: 60,
            dataIndex: 'nroventa',
            filter: {
                type: 'string',
                dataIndex: 'nroventa'
            }
            //autoExpand: true,
            // default: true
        });
        this.addGridColumn({
            header: 'Producto',//this.idioma.cgDenom,
            width: 250,
            dataIndex: 'denominacion',
            filter: {
                type: 'combo',

                url: '/logistica/facturacion/puntoventa/index.php/ventastarjeta/ventasxtarjeta',
                valueField: 'denominacion',
                displayField: 'denominacion',
                dataIndex: 'denominacion',
                mode: 'remote',
                autoLoad: false,
            }
            //autoExpand: true,
            //default: true
        });
        this.addGridColumn({
            header: 'Cantidad',//this.idioma.cgDenom,
            width: 30,
            dataIndex: 'cantidad',
            //autoExpand: true,
            //default: true,
            align: 'right',
            filter: {
                type: 'float',
                dataIndex: 'cantidad'
            }
        });
        this.addGridColumn({
            header: 'Importe',//this.idioma.cgDenom,
            width: 60,
            dataIndex: 'importetotal',
            //autoExpand: true,
            //default: true,
            filter: {
                type: 'float',
                dataIndex: 'importetotal'
            },
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: 'Naturaleza',//this.idioma.cgDenom,
            width: 110,
            dataIndex: 'naturaleza',
            filter: {
                type: 'combo',

                url: '/logistica/facturacion/puntoventa/index.php/ventastarjeta/ventasxtarjeta',
                valueField: 'naturaleza',
                displayField: 'naturaleza',
                dataIndex: 'naturaleza',
                mode: 'remote',
                autoLoad: false,
            }
            //autoExpand: true,
            //default: true
        });
        this.addGridColumn({
            header: 'Entidad',//this.idioma.cgDenom,
            width: 250,
            dataIndex: 'entidad',
            filter: {
                type: 'combo',

                url: '/logistica/facturacion/puntoventa/index.php/ventastarjeta/ventasxtarjeta',
                valueField: 'entidad',
                displayField: 'entidad',
                dataIndex: 'entidad',
                mode: 'remote',
                autoLoad: false,
            }
            //autoExpand: true,
            //default: true
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
            tooltip: this.idioma.ttBtnImprimirListado,
            text: this.idioma.ttBtnImprimirListado,
            handler: function () {
                var objParams = {};
                console.log(me.getGridPrincipal().filters.filters.items);
                objParams.idtitular = (me.cmbTitular.getValue()) ? me.cmbTitular.getValue() : null;
                if (me.cmbOrdenar.getValue() == "Mayor venta pagada")
                    objParams.ordenar = 'cantidad';
                else if (me.cmbOrdenar.getValue() == "Mayor importe pagado")
                    objParams.ordenar = 'importe';
                else {
                    objParams.ordenar = 'ninguno';
                }
                objParams.tienda = (me.getGridPrincipal().filters.filters.items[0].getValue()) ? me.getGridPrincipal().filters.filters.items[0].getValue() : null;
                objParams.digitos = (me.getGridPrincipal().filters.filters.items[1].getValue()) ? me.getGridPrincipal().filters.filters.items[1].getValue() : null;
                objParams.nroventa = (me.getGridPrincipal().filters.filters.items[2].getValue()) ? me.getGridPrincipal().filters.filters.items[2].getValue() : null;
                objParams.denominacion = (me.getGridPrincipal().filters.filters.items[3].getValue()) ? me.getGridPrincipal().filters.filters.items[3].getValue() : null;
                objParams.cantidad = (me.getGridPrincipal().filters.filters.items[4].getValue()) ? me.getGridPrincipal().filters.filters.items[4].getValue() : null;
                objParams.importetotal = (me.getGridPrincipal().filters.filters.items[5].getValue()) ? me.getGridPrincipal().filters.filters.items[5].getValue() : null;
                objParams.naturaleza = (me.getGridPrincipal().filters.filters.items[6].getValue()) ? me.getGridPrincipal().filters.filters.items[6].getValue() : null;
                objParams.entidad = (me.getGridPrincipal().filters.filters.items[7].getValue()) ? me.getGridPrincipal().filters.filters.items[7].getValue() : null;
                //Igual
                if (objParams.importetotal['eq']) {
                    objParams.valor = objParams.importetotal['eq'];
                    objParams.signo = 3;
                    objParams.campo = 'importetotal';
                }

                //Menor
                else if (objParams.importetotal['lt']) {
                    objParams.valor = objParams.importetotal['lt'];
                    objParams.signo = 1;
                    objParams.campo = 'importetotal';
                }
                //Mayor
                else if (objParams.importetotal['gt']) {
                    objParams.valor = objParams.importetotal['gt'];
                    objParams.signo = 2;
                    objParams.campo = 'importetotal';
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
                else if (objParams.cantidad['lt']) {
                    objParams.valor = objParams.cantidad['lt'];
                    objParams.signo = 1;
                    objParams.campo = 'cantidad';
                }
                //Mayor
                else if (objParams.cantidad['gt']) {
                    objParams.valor = objParams.cantidad['gt'];
                    objParams.signo = 2;
                    objParams.campo = 'cantidad';
                }
                /*  else if (objParams.importe['lt'] && objParams.importe['gt']) {
                     objParams.filtrovalormenor = objParams.importe['lt'];
                     objParams.filtrovalormayor = objParams.importe['gt'];
                 } */






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

    view: function () {
        var me = this;
        this.cmbTitular = new LOG.util.ComboBox({
            name: 'idtitular',
            url: '/logistica/facturacion/puntoventa/index.php/ventastarjeta/ventasxtarjeta',
            valueField: 'titular',
            displayField: 'titular',
            anchor: '90%',
            pageSize: 30,
            editable: true,
            autoLoad: false,
            mode: 'remote',
            minChars: 0,

            //autoLoad: false,
			/* baseParams:{
                modificar:true
            }, */
            listeners: {
                select: function (cmb, rd) {
                    me.getStorePrincipal().reload();
                }
            }
        });
        this.cmbOrdenar = new LOG.util.ComboBox({
            displayField: 'tipo',
            valueField: 'id',
            editable: 'false',
            mode: 'local',
            store: new Ext.data.SimpleStore({
                fields: ['id', 'tipo'],
                data: [
                    //['alfabetico', 'Orden alfab\xe9tico'],
                    ['cantidad', 'Mayor venta pagada'],
                    ['importe', 'Mayor importe pagado']
                ]
            }),
            listeners: {
                select: function (cmb, rd) {
                    me.getStorePrincipal().reload();
                }
            }

        });
        this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({
            tooltip: this.idioma.ttBtnLimpiar,
            handler: function () {
                me.onBtnLimpiar();
            }
        });

        this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: [
                '-', 'Titular' + ':', this.cmbTitular,
                '-', 'Ordenar busqueda' + ':', this.cmbOrdenar,
                '-', '-', this.btnLimpiar

            ]
        }));
        LOG.util.UIManager.apply(this.getPanelSuperior(), {
            width: '50%'
        });


        return LOG.fac.puntoventa.recuperaciones.ventastarjeta.superclass.view.call(this);

    },
    onBtnLimpiar: function () {
        if (
            this.cmbTitular.isDirty() || this.cmbOrdenar.isDirty()
            || this.getGridPrincipal().filters.filters.items[0].getValue()
            || this.getGridPrincipal().filters.filters.items[1].getValue()
            || this.getGridPrincipal().filters.filters.items[2].getValue()
            || this.getGridPrincipal().filters.filters.items[3].getValue()
            || this.getGridPrincipal().filters.filters.items[4].getValue()
            || this.getGridPrincipal().filters.filters.items[5].getValue()
            || this.getGridPrincipal().filters.filters.items[6].getValue()
            || this.getGridPrincipal().filters.filters.items[7].getValue()

        ) {
            this.cmbTitular.reset();
            this.cmbOrdenar.reset();
            this.getGridPrincipal().filters.filters.items[0].setValue('');
            this.getGridPrincipal().filters.filters.items[1].setValue('');
            this.getGridPrincipal().filters.filters.items[2].setValue('');
            this.getGridPrincipal().filters.filters.items[3].setValue('');
            this.getGridPrincipal().filters.filters.items[4].setValue('');
            this.getGridPrincipal().filters.filters.items[5].setValue('');
            this.getGridPrincipal().filters.filters.items[6].setValue('');
            this.getGridPrincipal().filters.filters.items[7].setValue('');
            this.getStorePrincipal().reload();
        }
    },
    render: function () {
        var p = LOG.fac.puntoventa.recuperaciones.ventastarjeta.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function (e) {
            if (e === 'beforeload') {
                if (me.cmbTitular.isValid()) {
                    this.initBaseParams.idtitular = me.cmbTitular.getValue() || null;
                    this.baseParams.idtitular = me.cmbTitular.getValue() || null;
                }
                if (me.cmbOrdenar.isValid()) {
                    this.initBaseParams.ordenar = me.cmbOrdenar.getValue() || null;
                    this.baseParams.ordenar = me.cmbOrdenar.getValue() || null;
                }
            }
        });
        return p
    }
});