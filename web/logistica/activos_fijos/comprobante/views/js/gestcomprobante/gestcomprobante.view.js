/**
 * Created by Adrian on 27/04/15.
 */
Ext.ns('LOG.aft.comprobante');
LOG.aft.comprobante.View = Ext.extend(LOG.lb.comprobante.View, {
    busquedaAvanzada : false,
    initDefaultColumns: function () {
        LOG.aft.comprobante.View.superclass.initDefaultColumns.call(this);

        this.insertGridColumn({
            header: this.idioma.cgTipoOperacion,
            width: 200,
            dataIndex: 'operacion',
            default: true
        }, 4);
    },
    cargaInicial: function (_fn) {
        this.modelo.cargaInicial({
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/cargaInicial'
        }, _fn, this.idioma.msgCargaInicial);
    }
});