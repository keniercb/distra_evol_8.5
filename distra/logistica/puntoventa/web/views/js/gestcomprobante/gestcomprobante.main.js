var vistaComprobante = new LOG.lb.comprobante.View({
    idioma: LOG.util.UIManager.apply(LOG.lb.comprobante.Idioma, LOG.util.Idioma),
    idayuda: 'idcomprobantepventa'
});
//vistaComprobante.attachPlugin(new LOG.lb.plugin.ComboDepositos()); 
vistaComprobante.init();
vistaComprobante.view();
