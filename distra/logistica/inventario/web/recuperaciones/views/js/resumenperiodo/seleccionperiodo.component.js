Ext.ns('Ext.erp.seleccionperiodo');
Ext.erp.seleccionperiodo.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.autoLoad = true;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = false;
        this.dirController = '/logistica/inventario/recuperaciones/index.php/resumenporperiodo';
        this.urlBusquedaGridPrincipal = 'cargarPeriodos';
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        Ext.erp.seleccionperiodo.View.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = config.idioma.tlVentanaPeriodos;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 350;
        this.getVistaPrincipal().resizable = false;
   },
    init: function() {
        Ext.erp.seleccionperiodo.View.superclass.init.call(this);
    },
    initDefaultButtons: function() {
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgPeriodos,
            width: 150,
            dataIndex: 'nombre',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: this.idioma.cgidperiodo,
            width: 150,
            dataIndex: 'idperiodo',
            default: true,
            autoExpand: true
        });
    },
    view: function() {
        var _this = this;
        Ext.erp.seleccionperiodo.View.superclass.view.call(this);
        this.smGridPrincipal.fireEvent = this.smGridPrincipal.fireEvent.createSequence(function(e) {
            if (e == 'selectionchange') {
                if (this.getCount() > 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
    }
});