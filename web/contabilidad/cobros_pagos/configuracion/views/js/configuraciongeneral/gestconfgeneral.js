var conf = new Ext.Contabilidad.ConfigViewPort();
var tree = new Ext.Contabilidad.TreeNomenclador({
    title: 'Configuraciones'
});
var panel = new Ext.Contabilidad.PanelMostrador();

conf.setNomenclador(tree)
    .setMostrador(panel)
    .addConceptos(Ext.Copa.Configuracion.tabcopa)
    .crearViewPort();

validate.cargarAcciones();