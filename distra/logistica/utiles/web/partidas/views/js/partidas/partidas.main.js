Ext.ns('LOG.lb.partidas');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.lb.partidas.Idioma, LOG.util.Idioma.init());
    var vistaPartidas = new LOG.lb.partidas.View({
        idioma: idioma,
        acciones: acciones_reportes,
        busquedaBasica: true,
        busquedaAvanzada: true
    });

    vistaPartidas.attachPlugin(new LOG.lb.plugin.ComboDepositos());

    vistaPartidas.init();

    vistaPartidas.getPanelBusqueda().setColumns(1);

    var cls = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });

    cls.addComponent(
        LOG.util.Prototipos.inputTexto({
            fieldLabel: idioma.cgCodigo,
            name: 'codigo',
            regex: LOG.util.Regex.codigo,
            maxLength: 10
        })
    );
    vistaPartidas.addFilterComponent(cls);

    vistaPartidas.view();
});