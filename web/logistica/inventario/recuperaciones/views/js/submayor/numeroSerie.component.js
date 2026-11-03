/**
 * Esta clase muestra la existencia de un producto por areas existentes
 * @copyright XETID
 * @author División Gestión de Entidades
 * @version 1.0
 */
Ext.ns('LOG.inv.submayor');
LOG.inv.submayor.NumeroSeriePlugin = function() {
    function __conmit(v) {

        LOG.lb.numeroserie.Loader.init(function() {

            var winNroSerie = new LOG.lb.numeroserie.View({
                formaVisualizacion: 'ventana',
                ocultar: true,
                idproducto: v.getGridPrincipal().getSelectionModel().getSelected().data.idproducto
            });

            winNroSerie.getVistaPrincipal().listaBotones.getItem(1).hide();
            winNroSerie.getVistaPrincipal().listaBotones.getItem(2).hide();
            winNroSerie.getVistaPrincipal().maximized = false;
            winNroSerie.init();
            winNroSerie.view();
        });
    }

    return {
        init: function(v) {
            v.addToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'numeroserie',
                text: v.idioma.lbBtnNoSerie,
                disabled: true,
                handler: function() {
                    __conmit(v);
                },
                //-----------validacion show/hide del boton
                controlFn: function(b, _caller) {
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                        if (e == 'rowselect' && this.getSelected().json.equipo == 1) {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                }
                //----------termina la validacion show/hide del boton
            }));
        }
    };
};
