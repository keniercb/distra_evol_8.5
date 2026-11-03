Ext.ns('LOG.inv.entrada.reclamacion');

LOG.inv.entrada.reclamacion.Model = Ext.extend(LOG.lb.documento.Model, {
    constructor: function(config) {
        config.fields = [
            {name: 'viatransporte'},
            {name: 'aceptada'},
            {name: 'idrecepcion'},
            {name: 'tiporeclamacion'}
        ];
        LOG.inv.entrada.reclamacion.Model.superclass.constructor.call(this, config);
    },
    datosEncabezadoDoc: function(params, _fn) {
        params.cargando = true;
        params.url = '/logistica/inventario/entrada/entrada/index.php/reclamacion/cargarDocRecepcion';
        this.cargaInicial(params, _fn);
    },
    devolverClientebyId: function(params, _fn) {
        params.cargando = true;
        params.url = '/logistica/inventario/entrada/entrada/index.php/reclamacion/cargarClienteById';
        this.cargaInicial(params, _fn);
    }
});