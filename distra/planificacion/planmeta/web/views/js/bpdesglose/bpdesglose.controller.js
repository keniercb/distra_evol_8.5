//Namespace del componente Desglose de niveles de actividad
Ext.ns('Planificacion.BasesDelPlan.Desglose')
//Controlador de la vista
Planificacion.BasesDelPlan.Desglose.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     * 
     * @author Pedro Enrique Rojas
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Desglose (Tipo: Planificacion.BasesDelPlan.Desglose.Vista)
     * @param modelo Modelo de la vista del componente Desglose (Tipo: Planificacion.BasesDelPlan.Desglose.Modelo)
     */
    arbolSelect: 0,
    init: function(idioma, vista, modelo) {

        Ext.Ajax.timeout = 7200000; //2h  //3600000; //1 hora

        /******* Teclas calientes ***************/

        this.map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'Ff', // configurar desglose
                alt: true,
                fn: function() {
                    if (vista.validarBtn(Ext.getCmp('btnConfigurar'))) {
                        vista.winConfDesglose.show();
                    }
                }
            },
            {
                key: 'Ll', // limpiar
                alt: true,
                fn: function() {
                    vista.limpiar();
                }
            },
            {
                key: 'Hh', // ayuda
                alt: true,
                fn: function() {
                    vista.mostrarAyuda('Desglose');
                }
            },
            {
                key: 'Gg', // guardar
                alt: true,
                fn: function() {
                    if (vista.validarBtn(Ext.getCmp('btnGuardar'))) {
                        if (!vista.winConfDesglose.isVisible()) {
                            Ext.getCmp('btnGuardar').disable();
                            vista.desglozar();
                        } else {
                            Ext.getCmp('btnGuardar').enable();
                        }
                    }
                }
            }, {
                key: 'Ii', //adicionar configuracion del desglose
                alt: true,
                fn: function() {
                    if (vista.winConfDesglose.isVisible())
                    {
                        vista.winAddDesglose.show();
                    }
                }
            }, {
                key: 46, //eliminar desglose     
                fn: function() {
                    if (vista.winConfDesglose.isVisible()) { // DEL
                        vista.eliminarVariosDesgloses();
                    }
                }
            }, {
                key: 'Ee',
                alt: true,
                fn: function() {    //exportar desglose     
                    if (vista.validarBtn(vista.btnExportar))
                    {
                        if (!vista.winConfDesglose.isVisible()) {
                            vista.exportar();
                        }
                    }
                }
            }
        ]);



        //        //eventos del treeEntidades
        vista.treeEntidades.on('click', function(n, evento) {

            arbolSelect = 1;
            vista.ptr_ordenactual = -1;
            Ext.getCmp('ckbcolsvals').disable();
            if (n.id != 0) {
                vista.cbEjercicio.enable();
                vista.nodo = n;
                vista.btnExportar.disable();
                vista.treeEntidades.getSelectionModel().select(n);
                vista.identidadselected = n.id;
                vista.is_leaf = n.leaf;
                vista.tipo = 0;
                vista.gridCentral.reconfigure(modelo.stGpActividadDesglose, vista.cmGpActividadDesglose);
                vista.paginadoact1.bind(modelo.stGpActividadDesglose);

                if (n.leaf) {
                    vista.gridCentral.getStore().reload({});

                    vista.treeDesgloses.enable();
                    vista.treeDesgloses.expand(true);
                    vista.nodo = vista.treeDesgloses.getNodeById('0');
                    vista.iddes = vista.nodo.attributes.id;
                    vista.orden1 = vista.nodo.attributes.orden;

                    vista.ptr_ordenactual = vista.orden1;
                    vista.ident = vista.nodo.attributes.ident;
                    vista.iddatoscolum = vista.nodo.attributes.columna;
                    vista.tipo = n.attributes.tipo;
                    vista.treeDesgloses.root.reload();
                    vista.treeDesgloses.doLayout();
                    vista.treeDesgloses.getSelectionModel().select(vista.treeDesgloses.root);
                } else {
                    vista.treePlanes.disable();
                    vista.treeDesgloses.root.collapse(true);
                    vista.treeDesgloses.collapse(true);
                    vista.treeDesgloses.disable();
                    vista.treeDesgloses.show();
                    vista.gridCentral.getStore().reload({
                        params: {
                            start: 0,
                            limit: 20
                        }
                    });
                }
                vista.ptr_ordenactual = vista.orden1;
                vista.treePlanes.setTitle(idioma.lbPlanes + ": " + n.attributes.text);
            }
        });


        modelo.listadoPlanesConfDesg.on('beforeload', function(atreeloader, anode) {
            atreeloader.baseParams.id = vista.iddes;
            atreeloader.baseParams.orden = vista.orden1;
            atreeloader.baseParams.text = vista.text;
            atreeloader.baseParams.tipo = vista.tipo;
            atreeloader.baseParams.ident = vista.ident;
            atreeloader.baseParams.identidad = vista.identidadselected;
            atreeloader.baseParams.columna = vista.iddatoscolum;
            vista.desgloses_realizados = [];
        });

        vista.treeDesgloses.on('contextmenu', function(node, e) {
            node.select();
            var c = node.getOwnerTree().contextMenu;
            c.contextNode = node;
            vista.ident = vista.nodo.attributes.ident;
            vista.iddatoscolum = node.attributes.columna;
            if (Number(node.attributes.orden) > 0)
                c.showAt(e.getXY());
        });

        vista.treeDesgloses.on('click', function(n) {
            arbolSelect = 2;
            Ext.getCmp('ckbcolsvals').disable();
            if (Number(n.attributes.orden) >= 0) {
                vista.btnExportar.enable();
                vista.textconfig = n.text;
            } else {
                vista.btnExportar.disable();
            }
            if (Number(n.attributes.orden) > 0) {
                Ext.getCmp('ckbcolsvals').enable();
            }
            vista.treePlanes.enable();
            vista.filtrosdesglose_niv_act.clearFilters();
            vista.treeDesgloses.getSelectionModel().select(n);
            vista.iddes = n.attributes.id;
            vista.orden1 = n.attributes.orden;
            vista.ptr_ordenactual = vista.orden1;
            vista.text = n.attributes.text;
            vista.tipo = n.attributes.tipo;
            vista.ident = n.attributes.ident;
            vista.iddatoscolum = n.attributes.columna;
            vista.iddesglosetiponomencladorSelecc = n.attributes.iddesglosetiponomenclador;
            vista.ObtenerConfiguracion(vista.ident, vista.orden1, n.attributes.tipo, null, /*temporal cbmodelodesglose.getValue()*/null);
        });

        vista.treeDesgloses.on('beforeload', function(n) {
            vista.iddes = n.attributes.id;
            vista.orden1 = n.attributes.orden;
            vista.ptr_ordenactual = vista.orden1;
            vista.text = n.attributes.text;
            vista.tipo = n.attributes.tipo;
            vista.ident = n.attributes.ident;
            vista.iddatoscolum = n.attributes.columna;
            /*nuevo*/
            vista.desgloses_realizados = [];
        });



        modelo.listarPlanModelo.on('beforeload', function(tl, n) {
            tl.baseParams = {
                tipo: n.attributes.tipo,
                identidad: (vista.tmpidentidadselecc) ? vista.tmpidentidadselecc : vista.identidadselected,
                idejercicio: vista.cbEjercicio.getValue()
            };
        });


        vista.treePlanes.on('click', function(n) {
            vista.gridCentral.setTitle(idioma.lbDesgloseActividades);
            vista.treePlanes.getSelectionModel().select(n);
            if (n.leaf) {
                vista.btnExportar.enable();
                vista.identidadselected = vista.tmpidentidadselecc;
                vista.tipo = 3;
                vista.ident = n.attributes.idtipomodelo;
                vista.idmodelo = n.id;
                vista.orden1 = 0;
                vista.idtipomodelo = n.attributes.idtipomodelo;
                vista.dmodelo = n.attributes.idmodelo;
                vista.ObtenerConfiguracion(vista.ident, vista.orden1, vista.tipo, null, vista.idmodelo); //
            } else {
                vista.btnExportar.disable();
                vista.identidadselected = null;
                vista.gridCentral.reconfigure(modelo.stGpActividadDesglose, vista.cmGpActividadDesglose);
                vista.paginadoact1.bind(modelo.stGpActividadDesglose);
                vista.gridCentral.getStore().reload();
            }
        });

        vista.treePlanes.on('beforecollapse', function(p) {
            var vista = Planificacion.BasesDelPlan.Desglose.Vista;
            var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;
            vista.gridCentral.reconfigure(modelo.stGpActividadDesglose, vista.cmGpActividadDesglose);
            vista.paginadoact1.bind(modelo.stGpActividadDesglose); //add
        });

        vista.treePlanes.on('beforeexpand', function(p) {
            var vista = Planificacion.BasesDelPlan.Desglose.Vista;
            var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;
            vista.gridCentral.reconfigure(modelo.stGpActividadDesglose, vista.cmGpActividadDesglose);
            vista.paginadoact1.bind(modelo.stGpActividadDesglose);

            vista.gridCentral.setTitle(idioma.lbDesgloseActividades);
            vista.tmpidentidadselecc = vista.identidadselected;
            vista.identidadselected = null;
            vista.gridCentral.getStore().baseParams.start = 0;
            vista.gridCentral.getStore().baseParams.limit = 20;
            vista.gridCentral.getStore().reload();
            if (vista.tmpidentidadselecc != undefined && vista.tmpidentidadselecc != null) {
                vista.treePlanes.setTitle(idioma.lbPlanes + ": " + vista.treeEntidades.getNodeById(vista.tmpidentidadselecc).text);
                vista.treePlanes.getRootNode().reload();
            }
        });


        vista.treePlanes.on('contextmenu', function(node, e) {
            var vista = Planificacion.BasesDelPlan.Desglose.Vista;
            vista.gridCentral.setTitle(idioma.lbDesgloseActividades);
            if (node.leaf) {
                vista.orden1 = 0;
                vista.tipo = 3;
            } else {
            }
            node.select();
            var c = node.getOwnerTree().contextMenu;
            c.contextNode = node;
            vista.idtipomodeloselec = node.attributes.idtipomodelo;
            vista.idmodeloselec = node.id;
            if (node.attributes.idtipomodelo != null)
                c.showAt(e.getXY());
        });

        vista.panelEntidadDesglose.on('beforecollapse', function(p) {
            var vista = Planificacion.BasesDelPlan.Desglose.Vista;
            vista.gridCentral.reconfigure(modelo.stGpActividadDesglose, vista.cmGpActividadDesglose);
            Ext.getCmp('paginadoact1').bind(modelo.stGpActividadDesglose);  //add
        });

        vista.panelEntidadDesglose.on('beforeexpand', function(p) {
            var vista = Planificacion.BasesDelPlan.Desglose.Vista;
            vista.gridCentral.reconfigure(modelo.stGpActividadDesglose, vista.cmGpActividadDesglose);
            vista.paginadoact1.bind(modelo.stGpActividadDesglose);

            vista.gridCentral.setTitle(idioma.lbDesgloseActividades);
            vista.identidadselected = vista.tmpidentidadselecc;
            vista.tmpidentidadselecc = null;
            vista.gridCentral.getStore().baseParams.start = 0;
            vista.gridCentral.getStore().baseParams.limit = 20;
            vista.gridCentral.getStore().reload();
        });

        vista.btnGuardar.on('click', function() {
            var vista = Planificacion.BasesDelPlan.Desglose.Vista;
            vista.btnGuardar.disable();
            vista.desglozar();
        });

        modelo.stGpActividadDesglose.on('beforeload', function() {
            var vista = Planificacion.BasesDelPlan.Desglose.Vista;
            this.baseParams.identidad = vista.identidadselected;
            this.baseParams.is_leaf = vista.is_leaf;
            this.baseParams.orden = vista.ptr_ordenactual;
            this.baseParams.ident = vista.ident;
            this.baseParams.tipo = vista.tipo;
            vista.desgloses_realizados = [];
            this.baseParams.fxc = Ext.encode(vista.getFiltrosActivos());
            vista.cambiarTituloFiltrarDesglose();
            this.baseParams.idejercicio = vista.cbEjercicio.getValue();
        });

        modelo.stGpActividadDesglose.on('load', function() {
            if (vista.filtrosdesglose_niv_act.getFiltrosActivos().length > 0 && modelo.stGpActividadDesglose.getCount() == 0) {
                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
            }

        });



        vista.gridCentral.on('afteredit', function(sm) {
            if (!vista.pintarValidarFilasErrorneas(sm.row)) {
                vista.btnGuardar.enable();
            } else {
                vista.btnGuardar.disable();
                return;
            }
            // eliminar repetidos
            var partes = sm.field.split('_');
            // eliminar repetidos
            var existe = false;
            for (var i = 0; i < vista.desgloses_realizados.length; i++) {
                if (vista.desgloses_realizados[i].idactividadentidad == sm.record.data.idactividadentidad &&
                        vista.desgloses_realizados[i].iddatosnomenclador == partes[1]) {
                    vista.desgloses_realizados[i].nivelactividaddesglose = sm.value;
                    existe = true;
                    break;
                }
            }
            if (!existe) {
                vista.desgloses_realizados.push({
                    idactividadentidad: sm.record.data.idactividadentidad,
                    idpadre_fila_desglose: sm.record.data.idpadre_fila_desglose,
                    iddatosnomenclador: partes[1],
                    iddesgloseentidad: eval('sm.record.data.__' + partes[1]),
                    iddesglosetiponomenclador: sm.record.data.iddesglosetiponomenclador,
                    idrama: Number(eval('sm.record.data.idrama' + partes[1])),
                    idrama:partes[2],
                            nivelactividaddesglose: sm.value,
                    idactividad: sm.record.data.idactividad
                });
            }
        });


        vista.gridCentral.on('beforeedit', function(sm) {
            vista.idactividadentidadselec = sm.record.data.idactividadentidad;
            vista.columnadinamicaselec = sm.field;
        });


        vista.btnLimpiarFiltros.on('click', function() {
            vista.limpiar();
        });

        vista.btnAyu.on('click', function() {
            vista.mostrarAyuda('Desglose');
        });

        vista.btnExportar.on('click', function() {
            vista.exportar();
        });

        vista.btnConfigurar.on('click', function() {
            vista.winConfDesglose.show();
        });

        vista.gridCentral.on('headerclick', function(grid, colIndex, e) {
            vista.pintarValidarFilasErrorneas();
        });

        vista.treeEntidades.getSelectionModel().select(vista.treeEntidades.root.firstChild);


        /*Configuracion del desglose*/
        modelo.stConfDesglose.reload();

        vista.smConfDesglose.on('selectionchange', function(sm) {
            if (vista.smConfDesglose.getSelected()) {
                vista.gpConfNomencladores.getStore().reload({
                    params: {
                        iddesglose: vista.smConfDesglose.getSelected().data.iddesglose
                    }
                });
            }
        }, this);

        modelo.stNomen.reload();

        vista.gridCentral.getStore().reload({
            params: {
                identidad: 0,
                limit: 20,
                start: 0
            }
        });

        Ext.getCmp('ckbcolsvals').on('check', function(chb, checked) {
            vista.verSoloColValores = checked;
            this.ocultarColumnasSinValores(vista);

            if (checked == false) {
                var cantColsEstaticas = 8;//codigo,deno
                var cantcols = vista.gridCentral.getColumnModel().getColumnCount();
                for (var i = cantColsEstaticas; i < cantcols; i++) {
                    vista.gridCentral.getColumnModel().setHidden(i, false);
                }
            }

        }, this);

    },
    /*Funcion para construir el menu de desgloses
     @return void
     @author Pedro E. Rojas
     */
    /*Funcion para ocultar las columnas del desgloses que no tienen valores
     @return void
     @author Pedro E. Rojas
     */

    listarDadoEjercicio: function(vista) {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        var modelo = Planificacion.BasesDelPlan.Desglose.Modelo;
        vista.gridCentral.getStore().removeAll();
        if (arbolSelect == 1) {
            modelo.stGpActividadDesglose.reload({
                params: {
                    identidad: vista.identidadselected,
                    is_leaf: vista.is_leaf,
                    orden: vista.ptr_ordenactual,
                    ident: vista.ident,
                    tipo: vista.tipo,
                    fxc: Ext.encode(vista.getFiltrosActivos()),
                    idejercicio: vista.cbEjercicio.getValue(),
                    columna: vista.iddatoscolum,
                    start: 0,
                    limit: 20
                }
            });
        } else {
            modelo.stGpActividades.reload({
                params: {
                    start: 0,
                    limit: 20
                }
            });
        }



    },
    ocultarColumnasSinValores: function(vista) {
        var cantColsEstaticas = 8;//codigo,deno
        var cantcols = vista.gridCentral.getColumnModel().getColumnCount();
        if (vista.verSoloColValores) {
            var stActual = vista.gridCentral.getStore();
            var recordCantPorColumnasDinamicas = [];
            //inicializar arreglo con valores en false
            for (var i = cantColsEstaticas; i < cantcols; i++) {
                recordCantPorColumnasDinamicas[i] = false;
            }
            var idx = 0;
            stActual.each(function() {
                var data = stActual.getAt(idx).data;
                for (var i = cantColsEstaticas; i < cantcols; i++) {
                    if (recordCantPorColumnasDinamicas[i] == false) {
                        var dataIndex = vista.gridCentral.getColumnModel().getDataIndex(i);
                        var cant = Number(eval('data.' + dataIndex));
                        if (cant >= 1) {
                            recordCantPorColumnasDinamicas[i] = true;
                        }
                    }
                }
                idx++;
            });
            for (var i = cantColsEstaticas; i < cantcols; i++) {
                if (recordCantPorColumnasDinamicas[i]) {
                    vista.gridCentral.getColumnModel().setHidden(i, false);
                } else {
                    vista.gridCentral.getColumnModel().setHidden(i, true);
                }
            }
        }
    },
    /*Funcion para construir el menu de desgloses
     @return void
     @author Pedro E. Rojas
     */
    construirMenu: function(pgrid) {
        var vista = Planificacion.BasesDelPlan.Desglose.Vista;

        pgrid.on('headermousedown', function(grid, colIndex, e) {
            vista.columnIndex = colIndex;
            vista.iddatoscolumselecc = vista.gridCentral.getColumnModel().getColumnById(vista.gridCentral.getColumnModel().getColumnId(colIndex)).dataIndex;
            vista.pintarValidarFilasErrorneas();
        });
        pgrid.getView().hmenu.on('beforeshow', function() {
            if (Ext.getCmp('col' + (vista.columnIndex)) != undefined) {
                Ext.getCmp('seperadordesglose').show();
                Ext.getCmp('col' + (vista.columnIndex)).show();
            }
        });
        pgrid.getView().hmenu.on('beforehide', function() {
            var view = pgrid.getView();
            for (var i = 5, len = view.cm.config.length; i < len; i++) {
                Ext.getCmp('col' + (i)).hide();
                Ext.getCmp('seperadordesglose').hide();
            }
        });

        var view = pgrid.getView();
        hmenu = pgrid.getView().hmenu;
        separadordesglosecolumna = new Ext.menu.Separator({
            id: 'seperadordesglose'
        })
        separadordesglosecolumna.hide();
        this.sep = hmenu.addItem(separadordesglosecolumna);
        for (var i = 5, len = view.cm.config.length; i < len; i++) {
            hmenu.add({
                text: perfil.etiquetas.lbDesglosar,
                disabled: vista.esultimonivel,
                id: ('col' + i),
                icon: perfil.dirImg + 'comprobante.png',
                iconCls: 'btn',
                name: view.cm.config[i].dataIndex,
                listeners: {
                    click: function(BaseItem, event) {
                        vista.ptr_ordenactual = Number(vista.ptr_ordenactual) + 1;
                        vista.iddatoscolum = vista.iddatoscolumselecc;
                        vista.ObtenerConfiguracion(vista.ident, vista.ptr_ordenactual, vista.tipo, vista.iddatoscolum, null);
                        vista.esdesglozarcol = true;
                    }
                }
            })
            Ext.getCmp('col' + i).hide();
        }
    }

}
