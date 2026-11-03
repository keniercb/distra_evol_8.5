Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('reclamaciones', cargarInterfaz);
function cargarInterfaz() {
    perfil = arguments[0];
    labels = arguments[1];

    var gpListProces = new Ext.PVD.Evaluaciones.ListProcesoEvaluativo({//Ext.PVD.Evaluaciones.ListProcesoEvaluativorec({
        region: 'center',
        margins: '5 5 5 5',
        labels: labels,
        url: '/pvd/evaluaciones/procesoevaluativo/index.php/prepararproceso/todospreprocesosevaluativos',//'/pvd/evaluaciones/procesoevaluativo/index.php/reclamaciones/todospreprocesosevaluativos',
        listeners: {
			  rowdblclick: function (grid, rowIndex, eventObj) {			
                if (grid.getSelectionModel().getSelected().get('_is_leaf')) {					
                    var win = new Ext.PVD.Evaluaciones.Evaluar.WinEvaluarXProcesoEvalrec({
                        labels: labels,
                        idperiodo:grid.getSelectionModel().getSelected().get('idperiodoproceso'),
                        idescala: grid.getStore().getById(grid.getSelectionModel().getSelected().get('_parent')).data.idescala,
                        iddefprocesoevaluativo: grid.getStore().getById(grid.getSelectionModel().getSelected().get('_parent')).data.iddefprocesoevaluativo,                        
                        idpreprocesoevaluativo: grid.getStore().getById(grid.getSelectionModel().getSelected().get('_parent')),
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
    gpListProces.getStore().load({params: {limit: 20, start: 0}});
}
