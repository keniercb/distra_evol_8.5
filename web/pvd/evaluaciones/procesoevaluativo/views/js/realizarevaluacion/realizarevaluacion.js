/**
 * Interfaz para evaluar los recursos*
 *
 * @author Tte. Ing. Juan Manuel Elias*
 * @package PVD *
 * @subpackage Evaluaciones *
 * @copyright UCID-ERP Cuba 10 *
 */
Ext.QuickTips.init();

UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

UCID.portal.cargarEtiquetas('realizarevaluacion', cargarInterfaz);

function cargarInterfaz() {
    perfil = arguments[0];
    labels = arguments[1];

    var gpListProces = new Ext.PVD.Evaluaciones.ListProcesoEvaluativo({
        region: 'center',
        margins: '5 5 5 5',
        labels: labels,
        url: '/pvd/evaluaciones/procesoevaluativo/index.php/prepararproceso/todospreprocesosevaluativos',
        listeners: {
            rowdblclick: function (grid, rowIndex, eventObj) {
                if (grid.getSelectionModel().getSelected().get('_is_leaf')) {
                    var win = new Ext.PVD.Evaluaciones.Evaluar.WinEvaluarXProcesoEval({
                        labels: labels,
                        idperiodo:grid.getSelectionModel().getSelected().get('idperiodoproceso'),
                        idescala: grid.getStore().getById(grid.getSelectionModel().getSelected().get('_parent')).data.idescala,
                        iddefprocesoevaluativo: grid.getStore().getById(grid.getSelectionModel().getSelected().get('_parent')).data.iddefprocesoevaluativo,
                        idperiodoproceso: grid.getSelectionModel().getSelected().get('idperiodoproceso'),
                        idpreprocesoevaluativo: grid.getStore().getById(grid.getSelectionModel().getSelected().get('_parent')),
						puedereclamar: grid.getSelectionModel().getSelected().get('puedereclamar'),
                        procesoEval: grid.getStore().getAt(rowIndex)
                    });
                    win.show();
                    win.maximize();
                }
            }
        }
    });

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [gpListProces]

    });

    gpListProces.getStore().on('load', function (st, records, options) {
        if (records.length > 0) {
            gpListProces.getSelectionModel().selectFirstRow();
        } else {
            Ext.MessageBox.show({
                title: labels.lbInfo, msg: labels.msgNoData,
                buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.INFO
            });
        }
    });

    gpListProces.getStore().load({params: {limit: 20, start: 0}});

}
