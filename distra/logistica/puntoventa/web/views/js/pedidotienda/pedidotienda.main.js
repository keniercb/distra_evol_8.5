UCID.portal.cargarAcciones(window.frameElement.id, function() {
var idioma = LOG.util.UIManager.apply(LOG.fac.pedidotienda.Idioma, LOG.util.Idioma);
/*var VentanaInicial= new LOG.lb.cierre.component.View({
    idioma: idioma
});
VentanaInicial.init();
VentanaInicial.view();*/
var VentanaInicial= new LOG.fac.pedidotienda.View({
    idioma: idioma,
    acciones: acciones_reportes,
});

var desde = new Ext.form.DateField({
    fieldLabel: 'Desde',
    name: 'desde',
    vtype: 'daterange',
    id: 'desdep',
    endDateField: 'hastap'
});
var hasta = new Ext.form.DateField({
    fieldLabel: 'Hasta',
    name: 'hasta',
    vtype: 'daterange',
    id: 'hastap',
    startDateField: 'desdep'
});

var incompletos = new Ext.form.Checkbox({
    boxLabel: 'Pedidos con productos incompletos',
    name: 'incompletos',
    /*listeners: {
        'check': function(cmp, checked) {
            if (checked) {
                cmp.checked = true;
                _this.panelBusquedaAvanzada.parametros.conexistencia = 1;
            } else {
                _this.panelBusquedaAvanzada.parametros.conexistencia = 0;
            }
        }
    }*/
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

/*VentanaInicial.attachPlugin(new LOG.lb.plugin.ComboDepositos({
    caso : 3
},0));*/
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
VentanaInicial.addFilterComponent(new Ext.form.FieldSet({
    anchor: '100%',
    items: [incompletos]
}));
VentanaInicial.addFilterComponent(cmbProductos);
VentanaInicial.view();
});


