//Namespace del componente Actividades asociadas a presupuesto..
Ext.ns('Planificacion.Ejecucion.Nivelesact')

//Controlador de la vista
Planificacion.Ejecucion.Nivelesact.Controlador = {
    init: function(idioma, vista, modelo) {
        var identidadselected = 0;
        vista.btnAjustarControl.on('click', function(node, evento) {
            vista.wdAjustar.show();
        })
        vista.tpEntidades.on({
            contextmenu: function(node, evento) {
                node.select();
                identidadselected = node.id;
                is_leaf = node.leaf;
            },
            click: function(node, evento) {
                if (node.id != 0) {
                    vista.cbEjercicio.enable();
                    vista.btnExportar.enable();
                }
                if (node.leaf) {
                    hoja = true;
                }
                else {
                    hoja = false;
                }
                identidadselected = node.id;
                //modelo.stNiveles.loadData(modelo.datos);
                modelo.stNiveles.load();
            }
        })
        vista.gpNiveles.getSelectionModel().on({
            rowselect: function(g, r, e) {
                vista.gpControl.expand();
                vista.gpControl.getStore().reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
                vista.btnAdicionar.enable();
                vista.tfajuste.enable();
                vista.btnAjustar.enable();
                vista.btnAjustarControl.enable();
            },
            rowdeselect: function(sm, rowIndex, record) {
                if (sm.getSelections().length == 0) {
                    vista.btnAdicionar.disable();
                    vista.tfajuste.disable();
                    vista.btnAjustar.disable();
                }
            }
        })
        vista.gpControl.getSelectionModel().on({
            rowselect: function(g, r, e) {
                vista.btnEliminar.enable();
            },
            rowdeselect: function(sm, rowIndex, record) {
                if (sm.getSelections().length != 0) {
                    vista.btnEliminar.enable();
                } else {
                    vista.btnEliminar.disable();
                }
            }
        });
        vista.btnAdicionar.on('click', function(node, evento) {
            comprobarSeleccion();
        })
        vista.btnAjustar.on('click', function(node, evento) {
            if (vista.tfajuste.getValue() == "") {
                mostrarMensaje(1, 'Debe introducir un valor en el campo.');
            }
        })
        vista.btnEliminar.on('click', function(node, evento) {
            mostrarMensaje(2, perfil.etiquetas.msgSegEliminar, eliminarControl);
        })
        vista.btnExportar.on('click', function(node, evento) {
            Ext.Ajax.timeout = 600000;
            var win = window.open('exportar?idejercicio=' + vista.cbEjercicio.getValue() +
                    '&identidad=' + identidadselected);
            mostrarMensaje(1, 'Se exportan los datos.');
        })
        Ext.getCmp('idfiltroent').on({
            specialkey: function(t, e) {
                if (e.getKey() == '13') {
                    arbol = vista.tpEntidades;
                    valor = Ext.getCmp('idfiltroent').getValue();
                    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
                        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
                            arbol.getSelectionModel().getSelectedNode().reload({
                                params: {
                                    valor: valor
                                }
                            });
                        }
                    } else
                        arbol.root.reload({
                            params: {
                                valor: valor
                            }
                        });
                }
            }
        })


    }


};
