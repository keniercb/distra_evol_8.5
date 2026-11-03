Ext.ns('LOG.inv.entrada.recepcionreserva');
LOG.inv.entrada.recepcionreserva.Model = Ext.extend(LOG.inv.entrada.recepcion.Model, {
    /**
     * @param {Object} config
     */
    constructor: function(config) {
        LOG.inv.entrada.recepcionreserva.Model.superclass.constructor.call(this, config);
    },
    /**
     * Funcion para adicionar un producto al grid cuando este fue editado
     * @param {Object} p
     * @returns {undefined}
     */
    adicionarProducto: function(p) {
        var currentIndex = -1;
        this.listaProductos.each(function(_p, index) {
            if (_p.idmovimiento == p.idmovimiento) {
                currentIndex = index;
            }
        });
        var pModel = null;
        if (currentIndex == -1) {
            var pModel = new LOG.util.Model({
                fields: [{
                        name: 'idmovimiento',
                        primary: true
                    },
                    {name: 'idproducto'},
                    {name: 'cantidad'},
                    {name: 'idunidadmedida'},
                    {name: 'importefinal'},
                    {name: 'preciocontable'},
                    {name: 'recargo'},
                    {name: 'descuento'},
                    {name: 'cantfactura'},
                    {name: 'importe'},
                    {name: 'reserva'},
                    {name: 'cantacumular'},
                    {name: 'acumular'},
                    {name: 'iddeposito'}
                ]
            });
        } else {
            pModel = this.listaProductos.getItem(currentIndex);
        }

        pModel.apply(p);
        this.listaProductos.setItem(pModel, currentIndex);
        this.habilitarBotones();
    }
});