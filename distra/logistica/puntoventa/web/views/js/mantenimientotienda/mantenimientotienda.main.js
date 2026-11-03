UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.fac.mantenimientotienda.Idioma, LOG.util.Idioma.init());
    var _this = this;
    this.cmbArea = new LOG.util.ComboBox({
        autoLoad: true,
        name: 'idareaventa',
        url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarAreas',
        valueField: 'idestructuraop',
        displayField: 'coddenominacion',
        width:350,
        anchor: '90%',
        listWidth:350,
        //pageSize: 10,
        //mode: 'remote',
        allowBlank: false,
        editable: true,
        listeners: {
            /*expand: function () {
                this.store.reload();
            },*/
            select: function (combo,record,index) {
                _this.productos.setIdAreaVenta(record.json.idareaventa)
                _this.devoluciones.setIdAreaVenta(record.json.idareaventa)
                _this.pedidos.setIdAreaVenta(record.json.idareaventa)

                _this.productos.setIdDeposito(record.json.idestructuraop)
                _this.devoluciones.setIdDeposito(record.json.idestructuraop)

                _this.productos.getGridPrincipal().getStore().load();
                _this.devoluciones.getGridPrincipal().getStore().load();
                _this.pedidos.getGridPrincipal().getStore().load();
                /*_this.idareaventa = record.json.idareaventa;
                _this.tiendavirtual = record.json.tiendavirtual;
                _this.tipotienda = record.json.tipo;
                _this.idestructuraop = combo.getValue();
                if (_this.tiendavirtual) {
                    if (_this.tipotienda == "ps") {
                        _this.listaBotones.getItem(0).enable();
                        _this.listaBotones.getItem(0).show();
                        _this.listaBotones.getItem(1).hide();
                        _this.listaBotones.getItem(2).hide();
                    } else if (_this.tipotienda == "cx") {
                        _this.listaBotones.getItem(2).enable();
                        _this.listaBotones.getItem(2).show();
                        _this.listaBotones.getItem(0).hide();
                        _this.listaBotones.getItem(1).hide();
                    }
                } else {
                    _this.listaBotones.getItem(1).enable();
                    _this.listaBotones.getItem(1).show();
                    _this.listaBotones.getItem(0).hide();
                    _this.listaBotones.getItem(2).hide();
                }
                _this.getStorePrincipal().load({
                    params: {
                        idestructuraop: combo.getValue(),
                        idareaventa: record.json.idareaventa/!*,
                        idmonedaventa: record.json.idmoneda*!/
                    }
                });*/
            }
        }
    });
    this.cmbArea.getStore().on('beforeload', function(st) {
        st.baseParams.tipo = 'ps';
        st.initBaseParams.tipo = 'ps';
    })

    var ventana = new LOG.util.UITabTemplate({
        idioma: idioma,
        formaVisualizacion: 'viewport'
    });
    this.productos = new LOG.fac.mantenimientotienda.Productos({
        idioma: idioma,
        title: 'Productos',
        _parent: ventana,
        _cmbArea: _this.cmbArea,
        urlBusquedaGridPrincipal: 'cargarProductos',
        idComponent: 0
    });

    ventana.addTabToTemplete(this.productos);

    this.devoluciones = new LOG.fac.mantenimientotienda.Devoluciones({
        idioma: idioma,
        title: 'Devoluciones',
        _parent: ventana,
        _cmbArea: _this.cmbArea,
        urlBusquedaGridPrincipal: 'cargarDevoluciones',
        idComponent: 1
    });

    ventana.addTabToTemplete(this.devoluciones);

    this.pedidos = new LOG.fac.mantenimientotienda.Pedidos({
        idioma: idioma,
        title: 'Pedidos incompletos',
        _parent: ventana,
        _cmbArea: _this.cmbArea,
        urlBusquedaGridPrincipal: 'cargarPedidos',
        idComponent: 2
    });

    ventana.addTabToTemplete(this.pedidos);
    ventana.init();
    let _p = ventana.view();

    ventana.panelBotones.getTopToolbar().add(['->', '-', 'Tienda' + ':', this.cmbArea]);
    ventana.panelBotones.getTopToolbar().setVisible(true);
    _p.doLayout()

    //ventana.hideTabStripItem(0);
    //ventana.hideTabStripItem(1);
    /*ventana.hideTabStripItem(2);
    ventana.hideTabStripItem(3);*/

    //quitar y dejar en acciones
    //ventana.unhideTabStripItem(0);
    //ventana.unhideTabStripItem(1);
    this.listaAcciones = new LOG.util.List(acciones_reportes);
    this.listaAcciones.each(function(a) {
        /*if (a['abreviatura'] == 'CONFAREA') {
            ventana.unhideTabStripItem(0);
        } else if (a['abreviatura'] == 'CONFCAJA') {
            ventana.unhideTabStripItem(1);
        } else if (a['abreviatura'] == 'CONFNATURALEZA') {
            ventana.unhideTabStripItem(2);
        } else if (a['abreviatura'] == 'CONFPRODUCTOS') {
            ventana.unhideTabStripItem(3);
        }*/
    });
});



/*UCID.portal.cargarAcciones(window.frameElement.id, function() {
var idioma = LOG.util.UIManager.apply(LOG.fac.mantenimientotienda.Idioma, LOG.util.Idioma);

var VentanaInicial= new LOG.fac.mantenimientotienda.View({
    idioma: idioma,
    acciones: acciones_reportes,
});

var desde = new Ext.form.DateField({
    fieldLabel: 'Desde',
    name: 'desde',
    vtype: 'daterange',
    id: 'desdem',
    endDateField: 'hastam'
});
var hasta = new Ext.form.DateField({
    fieldLabel: 'Hasta',
    name: 'hasta',
    vtype: 'daterange',
    id: 'hastam',
    startDateField: 'desdem'
});

var cmbProductos = new LOG.util.ComboBox({
    fieldLabel: idioma.tProductos,
    editable: true,
    url: 'getProductosPedido',
    hiddenName: 'idproducto',
    valueField: 'idproducto',
    displayField: 'denominacion',
    pageSize: 30,
    mode: 'remote',
    minChars: 0,
    autoLoad: true
});

VentanaInicial.init();

VentanaInicial.getPanelBusqueda().setColumns(1);
var frmBusqAvanz = new LOG.util.ColumnForm(2);
var frmFecha = new LOG.util.ColumnForm(2);
var frmFechaRango = new LOG.util.ColumnForm(2);
frmFechaRango.addComponent(desde);
frmFechaRango.addComponent(hasta);
frmFecha.addComponent(new Ext.form.FieldSet({
    title: 'Rango de fecha',
    anchor: '100%',
    items: [frmFechaRango]
}));
frmFecha.getColumn(0).columnWidth = 1;
frmFecha.getColumn(0).getComponent(0).anchor = '99%';

VentanaInicial.addFilterComponent(frmFecha);
VentanaInicial.addFilterComponent(cmbProductos);
VentanaInicial.view();
});*/


