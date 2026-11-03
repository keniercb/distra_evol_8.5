Ext.ns('Gestionar.gestdesagregctrlinversion');

UCID.portal.cargarEtiquetas('gestdesagregctrlinversion', function (perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;

    var modelo = Gestionar.gestdesagregctrlinversion.Modelo;
    modelo.init();

    var vista = Gestionar.gestdesagregctrlinversion.Vista;
    vista.init(idioma, modelo);

    Gestionar.gestdesagregctrlinversion.Controlador.init(idioma, vista, modelo);
});

Gestionar.gestdesagregctrlinversion.Controlador = {
    init: function (idioma, vista, modelo) {
        _this = this;
        _this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando...'
        });
        _this.mymaskDe = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando datos de la desagreci\xF3n...'
        });
        _this.identidadSelecc;
        _this.trimestre;
        _this.columnas;
        _this.idinversion;
        _this.desglose;    //1: inversiones, 2: equipos, 3: medio ambiente
        _this.ctrl;     //1:Real ejecutado I trimestre, 2: Estimado de ejecucion I semestre, 3: Est ejec Cierre año
        _this.tiempoCtrl;     //1:Real ejecutado I trimestre, 2: Estimado de ejecucion I semestre, 3: Est ejec Cierre año

        modelo.stCbejercicio.on({
            load: function (t, n, e) {
                vista.cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        });

        vista.gridInversion.getSelectionModel().on({
            rowselect: function (g, r, e) {
                vista.btnLimpiarDesag.enable();
                vista.btnDesagregacion.enable();
                vista.btnControl.enable();
            },
            rowdeselect: function (g, r, e) {
                vista.btnLimpiarDesag.disable();
                vista.btnDesagregacion.disable();
                vista.btnControl.disable();
            }
        });

        vista.btnLimpiarDesag.on({
            click: function () {
                if (vista.gridInversion.getSelectionModel().hasSelection()) {
                    mostrarMensaje(2, '¿Est\xE1s seguro que quiere eliminar el desglose de la inversi\xF3n/es seleccionada/s?', eliminarDesglose);
                } else {
                    mostrarMensaje(1, 'Debe seleccionar una inversi\xF3n');
                }
            }
        });

        function eliminarDesglose(btnPresionado) {
            if (btnPresionado == 'ok') {
                var idInvers = Array();
                var inversiones = vista.gridInversion.getSelectionModel().getSelections();
                for (var i = 0; i < inversiones.length; i++) {
                    idInvers.push(inversiones[i].data.idinversion);
                }

                _this.mymask.show();
                Ext.Ajax.request({
                    method: "POST",
                    url: 'limpiarDesagregacion',
                    params: {
                        idinversion: Ext.encode(idInvers),
                        idejercicio: vista.cmbEjercicio.getValue()
                    },
                    callback: function (options, success, response) {
                        mostrarMensaje(1, 'Se ha eliminado satisfactoriamente el desglose de la/las inversi\xF3n/es seleccionada/s');
                        // store.reload();
                        _this.mymask.hide();
                    }
                });
            }
        }

        vista.ChVigenteDC.on({
            check: function (ch, chequeado) {
                if (chequeado == true) {
                    vista.grid.actParamsStore(
                        {
                            idOrganismo: _this.identidadSelecc,
                            cmbEjercicio: vista.cmbEjercicio,
                            general: (vista.ChConsolidarDC.getValue()) ? 1 : 0,
                            vigente: 1
                        }
                    );
                } else {
                    vista.grid.actParamsStore(
                        {
                            idOrganismo: _this.identidadSelecc,
                            cmbEjercicio: vista.cmbEjercicio,
                            general: (vista.ChConsolidarDC.getValue()) ? 1 : 0,
                            vigente: 0
                        }
                    );
                }

                vista.grid.modeloGridInversiones.store_gestionar_inversiones.load({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            }
        });

        vista.ChConsolidarDC.on({
            check: function (ch, chequeado) {
                if (chequeado == true) {
                    vista.grid.actParamsStore(
                        {
                            idOrganismo: _this.identidadSelecc,
                            cmbEjercicio: vista.cmbEjercicio,
                            general: 1,
                            vigente: (vista.ChVigenteDC.getValue()) ? 1 : 0
                        }
                    );
                } else {
                    vista.grid.actParamsStore(
                        {
                            idOrganismo: _this.identidadSelecc,
                            cmbEjercicio: vista.cmbEjercicio,
                            general: 0,
                            vigente: (vista.ChVigenteDC.getValue()) ? 1 : 0
                        }
                    );
                }

                vista.grid.modeloGridInversiones.store_gestionar_inversiones.removeAll();

                vista.grid.modeloGridInversiones.store_gestionar_inversiones.load({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            }
        });

        vista.treePanelinversion.on('click', function (node, evento) {
            _this.identidadSelecc = node.id;

            vista.ChVigenteDC.enable();
            vista.ChConsolidarDC.enable();

            vista.grid.actParamsStore(
                {
                    idOrganismo: _this.identidadSelecc,
                    cmbEjercicio: vista.cmbEjercicio,
                    general: (vista.ChConsolidarDC.getValue()) ? 1 : 0,
                    vigente: (vista.ChVigenteDC.getValue()) ? 1 : 0
                }
            );

            vista.grid.modeloGridInversiones.store_gestionar_inversiones.load({
                params: {
                    start: 0,
                    limit: 20
                }
            });

            //vista.gridDataInver.actualizarGrid(node.id, vista.cmbEjercicio.getValue());

        });

        vista.btnDesagregacion.on({
            click: function () {
                if (vista.gridInversion.getSelectionModel().hasSelection()) {
                    vista.tpDesglose.setActiveTab(0);
                    var idInvers = Array();
                    var inversiones = vista.gridInversion.getSelectionModel().getSelections();
                    for (var i = 0; i < inversiones.length; i++) {
                        idInvers.push(inversiones[i].data.idinversion);
                    }

                    vista.gridInverDesgInver.actualizarGrid(_this.identidadSelecc, vista.cmbEjercicio.getValue(), vista.cmbEjercicio.getRawValue(), idInvers, vista.ChVigenteDC.getValue(), vista.wDesagregacion);
                } else {
                    mostrarMensaje(1, 'Debe seleccionar una inversi\xF3n');
                }
            }
        });

        Ext.getCmp('btnCerrarDesagregacion').on({
            click: function () {
                //limpiar plan aprobado.
                vista.gpPlanAprobado.getStore().removeAll();
                //limpiar el primer trimestre
                vista.gridDesagInversionPrimer.getStore().removeAll();
                //desactivar los trimestres
                // vista.tpDesgloseInversiones.disable();
                vista.gridDesagInversionResto.getStore().removeAll();
                console.log(vista);
                Ext.getCmp('gpEquipoPlan').getStore().removeAll();
                vista.gpPlanEquipoPrimer.stPlanEquipo.removeAll();
                vista.gpComprobEquipo.getStore().removeAll()
                if (vista.tpDesgloseInversiones && vista.tpDesgloseInversiones.getActiveTab()) {
                    var tab = (vista.tpDesgloseInversiones.getActiveTab().activeTab == 0) ? 3 : vista.tpDesgloseInversiones.getActiveTab().activeTab;
                    vista.tpDesgloseInversiones.setActiveTab(tab);
                    vista.tpDesgloseInversiones.disable();
                }
                if (vista.tpDesgloseEquipos && vista.tpDesgloseEquipos.getActiveTab()) {
                    var tabE = (vista.tpDesgloseEquipos.getActiveTab().activeTab == 0) ? 3 : vista.tpDesgloseEquipos.getActiveTab().activeTab;
                    vista.tpDesgloseEquipos.setActiveTab(tabE);
                    vista.tpDesgloseEquipos.disable();
                }
                vista.wDesagregacion.hide();
            }
        });

        Ext.getCmp('idgridInverdesag').on({
            activate: function (pE) {
                _this.desglose = 1;
                if (vista.gridInversion.getSelectionModel().hasSelection()) {
                    var idInvers = Array();
                    var inversiones = vista.gridInversion.getSelectionModel().getSelections();
                    for (var i = 0; i < inversiones.length; i++) {
                        idInvers.push(inversiones[i].data.idinversion);
                    }
                    vista.gridInverDesgInver.actualizarGrid(_this.identidadSelecc, vista.cmbEjercicio.getValue(), vista.cmbEjercicio.getRawValue(), idInvers, vista.ChVigenteDC.getValue());
                } else {
                    mostrarMensaje(1, 'Debe seleccionar una inversi\xF3n');
                }
                pE.doLayout();
            }
        });

        Ext.getCmp('idequiposautomotores').on({
            activate: function (pE) {
                _this.desglose = 2;
                if (vista.gridInversion.getSelectionModel().hasSelection()) {
                    var idInvers = Array();
                    var inversiones = vista.gridInversion.getSelectionModel().getSelections();
                    for (var i = 0; i < inversiones.length; i++) {
                        idInvers.push(inversiones[i].data.idinversion);
                    }
                    vista.gridEquipoDesg.actualizarGrid(_this.identidadSelecc, vista.cmbEjercicio.getValue(), vista.cmbEjercicio.getRawValue(), idInvers, vista.ChVigenteDC.getValue());
                } else {
                    mostrarMensaje(1, 'Debe seleccionar una inversi\xF3n');
                }
                pE.doLayout();
            }
        });

        /*Ext.getCmp('idtabmedioambiente').on({
         activate: function(pE) {
         _this.desglose = 3;
         if (vista.gridDataInver.getSeleccion()) {
         var idInvers = Array();
         var inversiones = vista.gridDataInver.getSeleccions();
         for (var i = 0; i < inversiones.length; i++) {
         idInvers.push(inversiones[i].data.idinversion);
         }
         vista.gridMADesg.actualizarGrid(_this.identidadSelecc, vista.cmbEjercicio.getValue(), idInvers);
         } else {
         mostrarMensaje(1, 'Debe seleccionar una inversi\xF3n');
         }
         pE.doLayout();
         }
         });*/

        vista.btnControl.on({
            click: function () {
                if (vista.gridInversion.getSelectionModel().hasSelection()) {
                    var idInvers = [];
                    var inversiones = vista.gridInversion.getSelectionModel().getSelections();
                    for (var i = 0; i < inversiones.length; i++) {
                        idInvers.push(inversiones[i].data.idinversion);
                    }
                    vista.gridInverCtrlInver.actualizarGrid(_this.identidadSelecc, vista.cmbEjercicio.getValue(),
                        vista.cmbEjercicio.getRawValue(), idInvers, vista.ChVigenteDC.getValue(), vista.wControl);
                } else {
                    mostrarMensaje(1, 'Debe seleccionar una inversi\xF3n');
                }
            }
        });

        Ext.getCmp('btnCerrarControl').on({
            click: function () {
                vista.wControl.hide();
            }
        });

        Ext.getCmp('idgridInverctrl').on({
            activate: function (pE) {
                pE.doLayout();
            }
        });

        Ext.getCmp('idequiposautomotoresctrl').on({
            activate: function (pE) {
                pE.doLayout();
            }
        });

//        Ext.getCmp('idtabmedioambientectrl').on({
//            activate: function(pE) {
//                pE.doLayout();
//            }
//        });

        // Ext.getCmp('gpInversionesDesag').on({
        Ext.getCmp('gpInversionesDesag').getSelectionModel().on({
            selectionchange: function (sel) {
                // clik: function(sel) {
                if (Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected()) {
                    _this.mymaskDe.show();
                    vista.tpDesgloseInversiones.enable();
                    if (vista.tpDesgloseInversiones.getActiveTab() && vista.tpDesgloseInversiones.getActiveTab().activeTab == 0) {
                        _this.cargarDesagTab(vista.tpDesgloseInversiones.items.items[0], 1, vista);
                    } else {
                        vista.tpDesgloseInversiones.setActiveTab(0);
                    }
                } else {
                    vista.tpDesgloseInversiones.disable();

                }
            }
        });

        Ext.getCmp('idgriddesagPrimer').on({
            activate: function (p) {
                _this.cargarDesagTab(p, 1, vista);
            },
            cargarStores: function (response, obj) {
                _this.cargarDatos(response, obj);

            }
        });

        Ext.getCmp('idgriddesagSegundo').on({
            activate: function (p) {
                _this.cargarCMEditable({
                    vista: vista,
                    id: p.id,
                    idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion
                });

                _this.cargarCMpp({
                    vista: vista,
                    id: p.id,
                    identidad: _this.identidadSelecc
                });
                _this.mymask.show();
                _this.trimestre = 2;
                _this.stDesgregaIItriIver = _this.storeDinamico('getDesagregacionI', vista.gridInverDesgInver.getJr(), 'desagsegundo');
                _this.stDesgregaIItriIver.load({
                    params: {
                        idejercicio: vista.cmbEjercicio.getValue(),
                        identidad: _this.identidadSelecc,
                        idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion,
                        trimestre: 2
                    },
                    callback: function (options, success, response) {
                        vista.gpDesgInverSegundo.gridDesagregacionInversion().reconfigure(_this.stDesgregaIItriIver, vista.gridInverDesgInver.getCmEditable());
                        _this.mymask.hide();
                    }
                });
            }
        });

        Ext.getCmp('idgriddesagTercero').on({
            activate: function (p) {
                _this.cargarCMEditable({
                    vista: vista,
                    id: p.id,
                    idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion
                });

                _this.cargarCMpp({
                    vista: vista,
                    id: p.id,
                    identidad: _this.identidadSelecc
                });
                _this.mymask.show();
                _this.trimestre = 3;
                _this.stDesgregaIIItriIver = _this.storeDinamico('getDesagregacionI', vista.gridInverDesgInver.getJr(), 'desagsegundo');
                _this.stDesgregaIIItriIver.load({
                    params: {
                        idejercicio: vista.cmbEjercicio.getValue(),
                        identidad: _this.identidadSelecc,
                        idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion,
                        trimestre: 3
                    },
                    callback: function (options, success, response) {
                        vista.gpDesgInverTercero.gridDesagregacionInversion().reconfigure(_this.stDesgregaIIItriIver, vista.gridInverDesgInver.getCmEditable());
                        _this.mymask.hide();
                    }
                });
            }
        });

        Ext.getCmp('idgriddesagCuarto').on({
            activate: function (p) {
                _this.cargarCMEditable({
                    vista: vista,
                    id: p.id,
                    idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion
                });

                _this.cargarCMpp({
                    vista: vista,
                    id: p.id,
                    identidad: _this.identidadSelecc
                });
                _this.mymask.show();
                _this.trimestre = 4;
                _this.stDesgregaIVtriIver = _this.storeDinamico('getDesagregacionI', vista.gridInverDesgInver.getJr(), 'desagsegundo');
                _this.stDesgregaIVtriIver.load({
                    params: {
                        idejercicio: vista.cmbEjercicio.getValue(),
                        identidad: _this.identidadSelecc,
                        idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion,
                        trimestre: 4
                    },
                    callback: function (options, success, response) {
                        vista.gpDesgInverCuarto.gridDesagregacionInversion().reconfigure(_this.stDesgregaIVtriIver, vista.gridInverDesgInver.getCmEditable());
                        _this.mymask.hide();
                    }
                });
            }
        });

        vista.btnGuardarDesagInver.on({
            click: function () {
                if (Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected()) {
                    var datos = [];
                    var idInversion = Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion;
                    var store;
                    if (_this.trimestre == 1) {
                        store = _this.stDesgregaItriIver;
                        var objTrimestre = _this.stDesgregaItriIver.getRange()[0].data;
                    }
                    if (_this.trimestre == 2) {
                        store = _this.stDesgregaIItriIver;
                        var objTrimestre = _this.stDesgregaIItriIver.getRange()[0].data;
                    }
                    if (_this.trimestre == 3) {
                        store = _this.stDesgregaIIItriIver;
                        var objTrimestre = _this.stDesgregaIIItriIver.getRange()[0].data;
                    }
                    if (_this.trimestre == 4) {
                        store = _this.stDesgregaIVtriIver;
                        var objTrimestre = _this.stDesgregaIVtriIver.getRange()[0].data;
                    }
                    for (var i in objTrimestre) {
                        datos.push([i, objTrimestre[i]]);
                    }
                    _this.guardarDesagXtrimestre(idInversion, _this.trimestre, store, /*_this.stCompTotalIver, */datos);
                } else {
                    mostrarMensaje(1, 'Debe seleccionar una inversi\xF3n.');
                }
            }
        });

//Tab de equipos automotores.....

        //Ext.getCmp('gpInversionesEquipos').getSelectionModel().on({
        //    selectionchange: function (sel) {
        //        if (sel.hasSelection()) {
        //            _this.mymaskDe.show();
        //            vista.tpCtrlInversiones.enable();
        //            if (vista.tpCtrlInversiones.getActiveTab() && vista.tpCtrlInversiones.getActiveTab().activeTab == 0) {
        //                _this.cargarControlInv(vista.tpCtrlInversiones.items.items[0], 1, vista);
        //            } else {
        //                vista.tpCtrlInversiones.setActiveTab(0);
        //            }
        //        } else {
        //            vista.tpCtrlInversiones.disable();
        //        }
        //
        //    },
        //    cargarStores: function (response, obj) {
        //        _this.cargarDatos(response, obj);
        //    }
        //});

        Ext.getCmp('gpInversionesEquipos').on({
            click: function () {
                if (Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected()) {
                    _this.cargarCMEquipo({
                        vista: vista,
                        p: Ext.getCmp('gpInversionesEquipos'),
                        identidad: _this.identidadSelecc
                    });

                }
            }, cargarStore: function (response, obj) {
                //alert('llefo');
                var stPlanEquipo = _this.storeDinamico('getPlanAprobadoEquipo', vista.gridEquipoDesg.getJrPlanEquipos(), 'planequipo');
                stPlanEquipo.load({
                    params: {
                        idinversion: Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected().data.idinversion,
                        idejercicio: vista.cmbEjercicio.getValue()
                    },
                    callback: function (options, success, response) {
                        vista.gpPlanEquipoPrimer.gridPlanEquipo().reconfigure(stPlanEquipo, vista.gridEquipoDesg.fnCmPlanEquipos());
                        vista.gpPlanEquipoPrimer.gridPlanEquipo().getView().refresh();

                    }
                });
            }
        });

        Ext.getCmp('idgriddesagEquipoPrimer').on({
            activate: function () {
                _this.trimestre = 1;

                if (Ext.getCmp('gpEquipoPlan').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    vista.tpDesgloseEquipos.setActiveTab(0);
                    vista.tpDesgloseEquipos.enable();
                   _this.cargarCMEquipo({
                        vista: vista,
                        p: Ext.getCmp('idgriddesagEquipoPrimer'),
                        identidad: _this.identidadSelecc
                    });
                    var trimestre = Array();
                    trimestre.push(1);
                    _this.stCompTotalEquipo = _this.storeDinamico('getCompTotalEquipo', vista.gridEquipoDesg.getJrEquipos(), 'compequipo');
                    _this.stDesgregaIEquipo = _this.storeDinamico('getDesagregacionEquipo', vista.gridEquipoDesg.getJrEquipos(), 'desagIequipo');

                    _this.stDesgregaIEquipo.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: Ext.encode(trimestre),
                            idindicador: vista.gpPlanEquipoPrimer.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpEquipoPrimer.gridDesgloseEquipo().reconfigure(_this.stDesgregaIEquipo, vista.gridEquipoDesg.fnCmEquipos());
                            vista.gpEquipoPrimer.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                    _this.stCompTotalEquipo.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: Ext.encode(trimestre),
                            idindicador: vista.gpPlanEquipoPrimer.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpComprobacionEquipo.gridDesgloseEquipo().reconfigure(_this.stCompTotalEquipo, vista.gridEquipoDesg.fnCmEquipos());
                            vista.gpComprobacionEquipo.gridDesgloseEquipo().getView().refresh();
                        }
                    });
                }
            },
            cargarStores: function (response, obj) {
                _this.cargarDatosEquipos(response, obj);

            }
        });

        Ext.getCmp('idgriddesagEquipoSegundo').on({
            activate: function (p) {
                if (Ext.getCmp('gpEquipoPlan').getSelectionModel().getSelected()) {
                    var trimestre = Array();
                    trimestre.push(2);
                    _this.mymask.show();

                    _this.cargarCMEquipo({
                        vista: vista,
                        p: Ext.getCmp('idgriddesagEquipoSegundo'),
                        identidad: _this.identidadSelecc
                    });

                    _this.stDesgregaIIEquipo = _this.storeDinamico('getDesagregacionEquipo', vista.gridEquipoDesg.getJrEquipos(), 'desagIIequipo');
                    _this.stDesgregaIIEquipo.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: Ext.encode(trimestre),
                            idindicador: vista.gpPlanEquipoPrimer.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpDesgEquipoSegundo.gridDesgloseEquipo().reconfigure(_this.stDesgregaIIEquipo, vista.gridEquipoDesg.fnCmEquipos());
                            _this.mymask.hide();
                        }
                    });
                }
            },
            cargarStores: function (response, obj) {
                _this.cargarDatosEquipos(response, obj);

            }
        });

        Ext.getCmp('idgriddesagEquipoTercero').on({
            activate: function (p) {
                if (Ext.getCmp('gpEquipoPlan').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    var trimestre = Array();
                    trimestre.push(3);

                    _this.cargarCMEquipo({
                        vista: vista,
                        p: Ext.getCmp('idgriddesagEquipoTercero'),
                        identidad: _this.identidadSelecc
                    });

                    _this.stDesgregaIIIEquipo = _this.storeDinamico('getDesagregacionEquipo', vista.gridEquipoDesg.getJrEquipos(), 'desagIIIequipo');
                    _this.stDesgregaIIIEquipo.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: Ext.encode(trimestre),
                            idindicador: vista.gpPlanEquipoPrimer.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpDesgEquipoTercero.gridDesgloseEquipo().reconfigure(_this.stDesgregaIIIEquipo, vista.gridEquipoDesg.fnCmEquipos());
                            _this.mymask.hide();
                        }
                    });
                }
            },
            cargarStores: function (response, obj) {
                _this.cargarDatosEquipos(response, obj);

            }
        });

        Ext.getCmp('idgriddesagEquipoCuarto').on({
            activate: function (p) {
                if (Ext.getCmp('gpEquipoPlan').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    var trimestre = Array();
                    trimestre.push(4);

                    _this.cargarCMEquipo({
                        vista: vista,
                        p: Ext.getCmp('idgriddesagEquipoCuarto'),
                        identidad: _this.identidadSelecc
                    });

                    _this.stDesgregaIVEquipo = _this.storeDinamico('getDesagregacionEquipo', vista.gridEquipoDesg.getJrEquipos(), 'desagIVequipo');
                    _this.stDesgregaIVEquipo.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: Ext.encode(trimestre),
                            idindicador: vista.gpPlanEquipoPrimer.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpDesgEquipoCuarto.gridDesgloseEquipo().reconfigure(_this.stDesgregaIVEquipo, vista.gridEquipoDesg.fnCmEquipos());
                            _this.mymask.hide();
                        }
                    });
                }
            },
            cargarStores: function (response, obj) {
                _this.cargarDatosEquipos(response, obj);

            }
        });


        vista.gpPlanEquipoPrimer.getSeleccionModel().on({
            rowselect: function (p) {
                _this.cargarCMEquipo({
                    vista: vista,
                    p: Ext.getCmp('gpEquipoPlan'),
                    identidad: _this.identidadSelecc
                });
                vista.tpDesgloseEquipos.enable();
            }, selectionchange: function (sel) {
                // clik: function(sel) {
                if (Ext.getCmp('gpEquipoPlan').getSelectionModel().getSelected()) {
                    _this.mymaskDe.show();
                    vista.tpDesgloseEquipos.enable();
                    if (vista.tpDesgloseEquipos.getActiveTab() && vista.tpDesgloseEquipos.getActiveTab().activeTab == 0) {
                        _this.cargarDesagEquipoTab(vista.tpDesgloseEquipos.items.items[0], 1, vista);
                    } else {
                        vista.tpDesgloseEquipos.setActiveTab(0);
                    }
                } else {
                    vista.tpDesgloseEquipos.disable();

                }
            }
        });

        vista.btnGuardarDesagEquipo.on({
            click: function () {
                var idinversion = Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected().data.idinversion;
                var trimestre = vista.tpDesgloseEquipos.getActiveTab().activeTab + 1;
                var datos = [];
                var store;
                if (vista.tpDesgloseEquipos.getActiveTab().activeTab == 0) {
                    store = _this.stDesgregaIEquipo;
                    var objEquipo = _this.stDesgregaIEquipo.getRange()[0].data;
                    for (var i in objEquipo) {
                        datos.push([i, objEquipo[i]]);
                    }
                }
                if (vista.tpDesgloseEquipos.getActiveTab().activeTab == 1) {
                    store = _this.stDesgregaIIEquipo;
                    var objEquipo = _this.stDesgregaIIEquipo.getRange()[0].data;
                    for (var i in objEquipo) {
                        datos.push([i, objEquipo[i]]);
                    }
                }
                if (vista.tpDesgloseEquipos.getActiveTab().activeTab == 2) {
                    store = _this.stDesgregaIIIEquipo;
                    var objEquipo = _this.stDesgregaIIIEquipo.getRange()[0].data;
                    for (var i in objEquipo) {
                        datos.push([i, objEquipo[i]]);
                    }
                }
                if (vista.tpDesgloseEquipos.getActiveTab().activeTab == 3) {
                    store = _this.stDesgregaIVEquipo;
                    var objEquipo = _this.stDesgregaIVEquipo.getRange()[0].data;
                    for (var i in objEquipo) {
                        datos.push([i, objEquipo[i]]);
                    }
                }
                var idindicador = vista.gpPlanEquipoPrimer.getSeleccionModel().selections.items[0].data.idindicador;
                _this.guardarDesagXtrimestre(idinversion, trimestre, store, datos, idindicador, _this.stCompTotalEquipo);
            }
        });

        Ext.getCmp('idgriddesagMAPrimer').on({
            activate: function () {
                _this.trimestre = 1;
            }
        });

        Ext.getCmp('gpInversionesMA').on({
            click: function () {
                if (Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    vista.tpDesgloseMA.setActiveTab(0);
                    _this.stPlanMA = _this.storeDinamico('getPlanMA', vista.gridMADesg.getJrMA(), 'planma');
                    _this.stPlanMA.load({
                        params: {
                            idinvers: Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected().data.idinversion
                        },
                        callback: function (options, success, response) {
                            vista.gpPlanMA.gridMedioAmbiente().reconfigure(_this.stPlanMA, vista.gridMADesg.fnCmMA());
                            _this.mymask.hide();
                        }
                    });

                    _this.stDesagregacionIMA = _this.storeDinamico('getDesagMA', vista.gridMADesg.getJrMA(), 'desagIma');
                    _this.stDesagregacionIMA.load({
                        params: {
                            idinversion: Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected().data.idinversion,
                            idtrimestre: _this.trimestre,
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc
                        },
                        callback: function (options, success, response) {
                            vista.gpMAPrimer.gridMedioAmbiente().reconfigure(_this.stDesagregacionIMA, vista.gridMADesg.fnCmMAEditable('desagIma'));
                        }
                    });

                    _this.stCompTotalMA = _this.storeDinamico('getComprobacionMA', vista.gridMADesg.getJrMA(), 'planma');
                    _this.stCompTotalMA.load({
                        params: {
                            idinversion: Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected().data.idinversion,
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc
                        },
                        callback: function (options, success, response) {
                            vista.gpComprobanteMA.gridMedioAmbiente().reconfigure(_this.stCompTotalMA, vista.gridMADesg.fnCmMA());
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgriddesagMASegundo').on({
            activate: function () {
                _this.trimestre = 2;
                if (Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    _this.stDesagregacionIIMA = _this.storeDinamico('getDesagMA', vista.gridMADesg.getJrMA(), 'desagIIma');
                    _this.stDesagregacionIIMA.load({
                        params: {
                            idinversion: Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected().data.idinversion,
                            idtrimestre: _this.trimestre,
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc
                        },
                        callback: function (options, success, response) {
                            vista.gpMASegundo.gridMedioAmbiente().reconfigure(_this.stDesagregacionIIMA, vista.gridMADesg.fnCmMAEditable('desagIIma'));
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgriddesagMATercero').on({
            activate: function () {
                _this.trimestre = 3;
                if (Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    _this.stDesagregacionIIIMA = _this.storeDinamico('getDesagMA', vista.gridMADesg.getJrMA(), 'desagIIIma');
                    _this.stDesagregacionIIIMA.load({
                        params: {
                            idinversion: Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected().data.idinversion,
                            idtrimestre: _this.trimestre,
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc
                        },
                        callback: function (options, success, response) {
                            vista.gpMATercero.gridMedioAmbiente().reconfigure(_this.stDesagregacionIIIMA, vista.gridMADesg.fnCmMAEditable('desagIIIma'));
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgriddesagMACuarto').on({
            activate: function () {
                _this.trimestre = 4;
                if (Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    _this.stDesagregacionIVMA = _this.storeDinamico('getDesagMA', vista.gridMADesg.getJrMA(), 'desagIVma');
                    _this.stDesagregacionIVMA.load({
                        params: {
                            idinversion: Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected().data.idinversion,
                            idtrimestre: _this.trimestre,
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc
                        },
                        callback: function (options, success, response) {
                            vista.gpMACuarto.gridMedioAmbiente().reconfigure(_this.stDesagregacionIVMA, vista.gridMADesg.fnCmMAEditable('desagIVma'));
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        vista.btnGuardarDesagMA.on({
            click: function () {
                var idinversion = Ext.getCmp('gpInversionesMA').getSelectionModel().getSelected().data.idinversion;
                var datos = [];
                var store;
                if (_this.trimestre == 1) {
                    store = _this.stDesagregacionIMA;
                    var objEquipo = _this.stDesagregacionIMA.getRange()[0].data;
                    for (var i in objEquipo) {
                        datos.push([i, objEquipo[i]]);
                    }
                }
                if (_this.trimestre == 2) {
                    store = _this.stDesagregacionIIMA;
                    var objEquipo = _this.stDesagregacionIIMA.getRange()[0].data;
                    for (var i in objEquipo) {
                        datos.push([i, objEquipo[i]]);
                    }
                }
                if (_this.trimestre == 3) {
                    store = _this.stDesagregacionIIIMA;
                    var objEquipo = _this.stDesagregacionIIIMA.getRange()[0].data;
                    for (var i in objEquipo) {
                        datos.push([i, objEquipo[i]]);
                    }
                }
                if (_this.trimestre == 4) {
                    store = _this.stDesagregacionIVMA;
                    var objEquipo = _this.stDesagregacionIVMA.getRange()[0].data;
                    for (var i in objEquipo) {
                        datos.push([i, objEquipo[i]]);
                    }
                }

                _this.guardarDesagXtrimestre(idinversion, _this.trimestre, store, datos, _this.stCompTotalMA);
            }
        });

//Componentes del control...... 

        Ext.getCmp('gpInversionesctrl').getSelectionModel().on({
            selectionchange: function (sel) {
                if (sel.hasSelection()) {
                    _this.mymaskDe.show();
                    vista.tpCtrlInversiones.enable();
                    if (vista.tpCtrlInversiones.getActiveTab() && vista.tpCtrlInversiones.getActiveTab().activeTab == 0) {
                        _this.cargarControlInv(vista.tpCtrlInversiones.items.items[0], 1, vista);
                    } else {
                        vista.tpCtrlInversiones.setActiveTab(0);
                    }
                } else {
                    vista.tpCtrlInversiones.disable();
                }

            },
            cargarStores: function (response, obj) {
                _this.cargarDatos(response, obj);
            }
        });


//tab real ejecutado I trimestre en el ctrl del I trimestre
        Ext.getCmp('idgridplanrealejecutado').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {

                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });
                    _this.cargarCMpp({
                        vista: vista,
                        id: p.id,
                        identidad: _this.identidadSelecc
                    });

                    _this.ctrl = 1;
                    _this.tiempoCtrl = 1;
                    _this.mymask.show();
                    _this.stRealEjecIverI = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlInver.getJr(), 'realejecItrimestre');
                    _this.stRealEjecIverI.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 1,
                            idtiempocontrol: 1 //Real ejecutado I trimestre
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlRealEjecutado.gridDesagregacionInversion().reconfigure(_this.stRealEjecIverI, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });
//tab desagregado I semestre en el ctrl del I trimestre
        Ext.getCmp('idgridplansemestredesagregado').on({
            activate: function () {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    _this.desagIsemestre = _this.storeDinamico('getDesagregacionIsemestre', vista.gridInverCtrlInver.getJr(), 'desagIsemenstre');
                    _this.desagIsemestre.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            semestre: Ext.encode(Array(1, 2))
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlDesagregadoPrimerSemestre.gridDesagregacionInversion().reconfigure(_this.desagIsemestre, vista.gridInverCtrlInver.getCm());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });
//tab estimado de ejecucion I semestre en el ctrl del I trimestre
        Ext.getCmp('idgridestimadoejecprimersemestre').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {
                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });
                    _this.cargarCMpp({
                        vista: vista,
                        id: p.id,
                        identidad: _this.identidadSelecc
                    });

                    _this.ctrl = 2;
                    _this.tiempoCtrl = 2;
                    _this.mymask.show();
                    _this.estEjecIsemestre = _this.storeDinamico('getEstimadoEjec', vista.gridInverCtrlInver.getJr(), 'estEjecIsemestre');
                    _this.estEjecIsemestre.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 1,
                            idtiempocontrol: 2   //Estimado de ejecucion I semestre
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEstimadoEjecucionPrimerSemestre.gridDesagregacionInversion().
                                reconfigure(_this.estEjecIsemestre, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });
//tab estimado de ejecucion cierre del año en el ctrl del I trimestre
        Ext.getCmp('idgridestimadoejeccierreanoprimer').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {

                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });

                    _this.ctrl = 3;
                    _this.tiempoCtrl = 6;
                    _this.mymask.show();
                    _this.estEjecCierreAnno = _this.storeDinamico('getEstimadoEjec', vista.gridInverCtrlInver.getJr(), 'estEjecCierreAnno');
                    _this.estEjecCierreAnno.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 1,
                            idtiempocontrol: 6   //Estimado ejecución Cierre Año
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEstimadoEjecucionCierreAno.gridDesagregacionInversion().
                                reconfigure(_this.estEjecCierreAnno, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

//tab desagregado I semestre en el ctrl del II trimestre
        Ext.getCmp('idgridplandesagregadoprimersemestre').on({
            activate: function () {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    _this.desagIsemestreII = _this.storeDinamico('getDesagregacionIsemestre', vista.gridInverCtrlInver.getJr(), 'desagIsemenstreII');
                    _this.desagIsemestreII.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            semestre: Ext.encode(Array(1, 2))
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlInverPrimerSemestre.gridDesagregacionInversion().
                                reconfigure(_this.desagIsemestreII, vista.gridInverCtrlInver.getCm());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        //tab real ejecutado hasta abril en el ctrl del II trimestre
        Ext.getCmp('idgridplanrealejecutadoinv').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {

                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });
                    _this.cargarCMpp({
                        vista: vista,
                        id: p.id,
                        identidad: _this.identidadSelecc
                    });
                    _this.ctrl = 4;
                    _this.mymask.show();
                    _this.realEjecAbril = _this.storeDinamico('getEstimadoEjec', vista.gridInverCtrlInver.getJr(), 'realejecAbril');
                    _this.realEjecAbril.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 2,
                            idtiempocontrol: 4   //Hasta abril
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlInverejecutadoAbril.gridDesagregacionInversion().
                                reconfigure(_this.realEjecAbril, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        //tab estimado ejecucion mayo y junio en el ctrl del II trimestre
        Ext.getCmp('idgridestimadoejecucionmayjun').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {

                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });

                    _this.cargarCMpp({
                        vista: vista,
                        id: p.id,
                        identidad: _this.identidadSelecc
                    });

                    _this.ctrl = 5;
                    _this.mymask.show();
                    _this.estimadoEjecMayJun = _this.storeDinamico('getEstimadoEjec', vista.gridInverCtrlInver.getJr(), 'realejecAbril');
                    _this.estimadoEjecMayJun.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 2,
                            idtiempocontrol: 5   //Mayo-Junio
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEjecMayJun.gridDesagregacionInversion().
                                reconfigure(_this.estimadoEjecMayJun, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

//tab estimado de ejecucion I semestre en el ctrl del II trimestre
        Ext.getCmp('idgridestimadoejecprimersemest').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {

                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });

                    _this.cargarCMpp({
                        vista: vista,
                        id: p.id,
                        identidad: _this.identidadSelecc
                    });
                    _this.ctrl = 6;
                    _this.mymask.show();
                    _this.estEjecIsemestreII = _this.storeDinamico('getEstimadoEjec', vista.gridInverCtrlInver.getJr(), 'estEjecIsemestreII');
                    _this.estEjecIsemestreII.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 2,
                            idtiempocontrol: 2   //Estimado de ejecucion I semestre
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEjecPrimerSemestre.gridDesagregacionInversion().
                                reconfigure(_this.estEjecIsemestreII, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });
//tab estimado de ejecucion cierre del año en el ctrl del II trimestre
        Ext.getCmp('idgridestimadoejeccierreano').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {

                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });
                    _this.cargarCMpp({
                        vista: vista,
                        id: p.id,
                        identidad: _this.identidadSelecc
                    });
                    _this.ctrl = 7;
                    _this.mymask.show();
                    _this.estEjecCierreAnnoII = _this.storeDinamico('getEstimadoEjec', vista.gridInverCtrlInver.getJr(), 'estEjecCierreAnnoI');
                    _this.estEjecCierreAnnoII.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 2,
                            idtiempocontrol: 6   //Estimado ejecución Cierre Año
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEjecCierreAno.gridDesagregacionInversion().
                                reconfigure(_this.estEjecCierreAnnoII, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

//tab estimado de ejecucion I semestre en el ctrl del III trimestre
        Ext.getCmp('idgridplandesagregprimersemestre').on({
            activate: function () {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    _this.desagIsemestreIII = _this.storeDinamico('getDesagregacionIsemestre', vista.gridInverCtrlInver.getJr(), 'desagIsemenstreIII');
                    _this.desagIsemestreIII.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            semestre: Ext.encode(Array(1, 2))
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlPlanPrimerSemestre.gridDesagregacionInversion().
                                reconfigure(_this.desagIsemestreIII, vista.gridInverCtrlInver.getCm());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

//tab real ejecutado I semestre en el ctrl del III trimestre
        Ext.getCmp('idgridejecutadoprimersemestre').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {

                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });
                    _this.cargarCMpp({
                        vista: vista,
                        id: p.id,
                        identidad: _this.identidadSelecc
                    });
                    _this.ctrl = 8;
                    _this.mymask.show();
                    _this.realEjecIsemes = _this.storeDinamico('getEstimadoEjec', vista.gridInverCtrlInver.getJr(), 'realejecIsemestre');
                    _this.realEjecIsemes.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 3,
                            idtiempocontrol: 3   //Real ejecutado I semestre
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlRealEjecutadoPrimerSemestre.gridDesagregacionInversion().
                                reconfigure(_this.realEjecIsemes, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

//tab estimado de ejecucion cierre del año en el ctrl del III trimestre
        Ext.getCmp('idgridestimadoejecucioncierreano').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {

                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });
                    _this.cargarCMpp({
                        vista: vista,
                        id: p.id,
                        identidad: _this.identidadSelecc
                    });
                    _this.ctrl = 9;
                    _this.mymask.show();
                    _this.estEjecCierreAnnoIII = _this.storeDinamico('getEstimadoEjec', vista.gridInverCtrlInver.getJr(), 'estEjecCierreAnnoIII');
                    _this.estEjecCierreAnnoIII.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 3,
                            idtiempocontrol: 6   //Estimado ejecución Cierre Año
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEjecutadoCierreAno.gridDesagregacionInversion().
                                reconfigure(_this.estEjecCierreAnnoIII, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        //tab real ejecutado cierre año en el ctrl del IV trimestre
        Ext.getCmp('idgridrealcierreanno').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {

                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });

                    _this.cargarCMpp({
                        vista: vista,
                        id: p.id,
                        identidad: _this.identidadSelecc
                    });

                    _this.ctrl = 10;
                    _this.mymask.show();
                    _this.realCierreAnno = _this.storeDinamico('getEstimadoEjec', vista.gridInverCtrlInver.getJr(), 'realejecCierreAno');
                    _this.realCierreAnno.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 4,
                            idtiempocontrol: 7   //Real ejecutado cierre año
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlRealCierreAno.gridDesagregacionInversion().
                                reconfigure(_this.realCierreAnno, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });
//tab impacto proximo anno en el ctrl del IV trimestre
        Ext.getCmp('idgridimpactoproximoplan').on({
            activate: function (p) {
                if (Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected()) {

                    _this.cargarCMEditable({
                        vista: vista,
                        id: p.id,
                        idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion
                    });

                    _this.cargarCMpp({
                        vista: vista,
                        id: p.id,
                        identidad: _this.identidadSelecc
                    });
                    _this.ctrl = 11;
                    _this.mymask.show();
                    _this.impactoProxAno = _this.storeDinamico('getEstimadoEjec', vista.gridInverCtrlInver.getJr(), 'idimpactoProxAno');
                    _this.impactoProxAno.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 4,
                            idtiempocontrol: 8   //Impacto próximo año
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlImpactoProximoPlan.gridDesagregacionInversion().
                                reconfigure(_this.impactoProxAno, vista.gridInverCtrlInver.getCmEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

//Control de Equipos.....

        Ext.getCmp('idgridInverctrl').on({
            activate: function () {
                var idInvers = [];
                var inversiones = vista.gridInversion.getSelectionModel().getSelections();
                for (var i = 0; i < inversiones.length; i++) {
                    idInvers.push(inversiones[i].data.idinversion);
                }
                vista.gridInverCtrlInver.actualizarGrid(_this.identidadSelecc, vista.cmbEjercicio.getValue(),
                    vista.cmbEjercicio.getRawValue(), idInvers, vista.ChVigenteDC.getValue());
            }
        });

        Ext.getCmp('idequiposautomotoresctrl').on({
            activate: function () {
                var idInvers = [];
                var inversiones = vista.gridInversion.getSelectionModel().getSelections();
                for (var i = 0; i < inversiones.length; i++) {
                    idInvers.push(inversiones[i].data.idinversion);
                }
                vista.gridInverCtrlEquipo.actualizarGrid(_this.identidadSelecc, vista.cmbEjercicio.getValue(), vista.cmbEjercicio.getRawValue(), idInvers, vista.ChVigenteDC.getValue());
            }
        });

        Ext.getCmp('gpInversionesctrlEquipos').on({
            click: function () {
                if (Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    _this.stPlanEquipo = _this.storeDinamico('getPlanAprobadoEquipo', vista.gridInverCtrlEquipo.getJrPlanEquipos(), 'planequipoCtrl');
                    _this.stPlanEquipo.load({
                        params: {
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            idejercicio: vista.cmbEjercicio.getValue()
                        },
                        callback: function (options, success, response) {
                            vista.gpPlanEquipoCtrl.gridPlanEquipo().reconfigure(_this.stPlanEquipo, vista.gridInverCtrlEquipo.fnCmPlanEquipos());
                            vista.gpPlanEquipoCtrl.gridPlanEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('gpEquipoplanEquipo').on({
            click: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    vista.tpCtrlEquipos.setActiveTab(0);
                    vista.tpCtrlEquipoPrimerTrimestre.setActiveTab(0);
                    vista.tpCtrlEquipos.enable();

                    var trimestre = Array();
                    trimestre.push(1);
                    _this.cargarCMEquipo({
                        vista: vista,
                        p: Ext.getCmp('gpEquipoplanEquipo'),
                        id: 'gpEquipoplanEquipo',
                        identidad: _this.identidadSelecc
                    });
                }
            },
            cargarStore: function (obj) {
                var trimestre = Array();
                trimestre.push(1);
                _this.stCtrlIEquipo = _this.storeDinamico('getDesagregacionEquipo', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlIequipo');
                _this.stCtrlIEquipo.load({
                    params: {
                        idejercicio: vista.cmbEjercicio.getValue(),
                        identidad: _this.identidadSelecc,
                        idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                        trimestre: Ext.encode(trimestre),
                        idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                    },
                    callback: function (options, success, response) {
                        vista.gpCtrlEquipoplanDesagregadoPrimer.gridDesgloseEquipo().reconfigure(_this.stCtrlIEquipo,
                            vista.gridInverCtrlEquipo.fnCmEquipos());
                        vista.gpCtrlEquipoplanDesagregadoPrimer.gridDesgloseEquipo().getView().refresh();
                        _this.mymask.hide();
                    }
                });

            }
        });

        Ext.getCmp('idgridplanrealejecutadoeqI').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 12;
                    _this.mymask.show();

                    _this.trimestre = 1;
                    _this.stCtrlRealIEquipo = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipo');
                    _this.stCtrlRealIEquipo.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 1,
                            idtiempocontrol: 3,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEquiporealejecPrimer.gridDesgloseEquipo().reconfigure(_this.stCtrlRealIEquipo,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEquiporealejecPrimer.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridplansemestredesagregadoeq').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    _this.trimestre = 1;
                    _this.stDesagIsemestreEquipo = _this.storeDinamico('getDesagregacionEquipo', vista.gridInverCtrlEquipo.getJrEquipos(), 'desIsemestreEquipo');
                    _this.stDesagIsemestreEquipo.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
//                            trimestre: Ext.encode(trimestre),
                            trimestre: Ext.encode(Array(1, 2)),
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEquipoDesagPrimerSegundo.gridDesgloseEquipo().reconfigure(_this.stDesagIsemestreEquipo,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEquipoDesagPrimerSegundo.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridestimadoejecprimersemestreeq').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 13;
                    _this.mymask.show();
                    var trimestre = Array();
                    trimestre.push(1);
                    _this.trimestre = 1;
                    _this.stCtrlRealISemestreEquipo = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipoIsemestre');
                    _this.stCtrlRealISemestreEquipo.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 1,
                            idtiempocontrol: 2,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEquipoEstPrimerSemest.gridDesgloseEquipo().reconfigure(_this.stCtrlRealISemestreEquipo,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEquipoEstPrimerSemest.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridestimadoejeccierreanoeqI').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 14;
                    _this.mymask.show();

                    _this.trimestre = 1;
                    _this.stCtrlEstEjecCierreAno = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipoEstCierreAno');
                    _this.stCtrlEstEjecCierreAno.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 1,
                            idtiempocontrol: 6,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEquipoEstCierreano.gridDesgloseEquipo().reconfigure(_this.stCtrlEstEjecCierreAno,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEquipoEstCierreano.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridplandesagregadoprimertrimestreeq').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    _this.trimestre = 2;
                    _this.stDesagIsemestreEquipoII = _this.storeDinamico('getDesagregacionEquipo', vista.gridInverCtrlEquipo.getJrEquipos(), 'desIsemestreEquipoII');
                    _this.stDesagIsemestreEquipoII.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: Ext.encode(Array(1, 2)),
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEqSegundTrimestre.gridDesgloseEquipo().reconfigure(_this.stDesagIsemestreEquipoII,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEqSegundTrimestre.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridplanrealejecutadoeq').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 15;
                    _this.mymask.show();

                    _this.trimestre = 2;
                    _this.stCtrlEstAbril = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipoAbril');
                    _this.stCtrlEstAbril.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 2,
                            idtiempocontrol: 4,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEqRealEjecAbril.gridDesgloseEquipo().reconfigure(_this.stCtrlEstAbril,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEqRealEjecAbril.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridestimadoejecucionmayjuneq').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 16;
                    _this.mymask.show();

                    _this.trimestre = 2;
                    _this.stCtrlEquipoMyJun = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipoMyJun');
                    _this.stCtrlEquipoMyJun.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 2,
                            idtiempocontrol: 5,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEqRealEjecMyJun.gridDesgloseEquipo().reconfigure(_this.stCtrlEquipoMyJun,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEqRealEjecMyJun.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridestimadoejecprimersemesteq').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 17;
                    _this.mymask.show();

                    _this.trimestre = 2;
                    _this.stEstEjecIsemestre = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipoEstIsem');
                    _this.stEstEjecIsemestre.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 2,
                            idtiempocontrol: 2,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEstEjecIsemestre.gridDesgloseEquipo().reconfigure(_this.stEstEjecIsemestre,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEstEjecIsemestre.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridestimadoejeccierreanoeqII').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 18;
                    _this.mymask.show();

                    _this.trimestre = 2;
                    _this.stEstEjecCierAnoII = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipoEstCierrAnoII');
                    _this.stEstEjecCierAnoII.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 2,
                            idtiempocontrol: 6,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEqCierreAno.gridDesgloseEquipo().reconfigure(_this.stEstEjecCierAnoII,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEqCierreAno.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridplandesagregprimersemestreeqIII').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.mymask.show();

                    _this.trimestre = 3;
                    _this.stDesagIsemestreEquipoIII = _this.storeDinamico('getDesagregacionEquipo', vista.gridInverCtrlEquipo.getJrEquipos(), 'desIsemestreEquipoIII');
                    _this.stDesagIsemestreEquipoIII.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: Ext.encode(Array(1, 2)),
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEqPrimerSemestre.gridDesgloseEquipo().reconfigure(_this.stDesagIsemestreEquipoIII,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEqPrimerSemestre.gridDesgloseEquipo().getView().refresh();

                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridejecutadoprimersemestreeq').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 19;
                    _this.mymask.show();

                    _this.trimestre = 3;
                    _this.stRealEjecIsemestre = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipoEjecIsemestre');
                    _this.stRealEjecIsemestre.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 3,
                            idtiempocontrol: 3,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEqRealEjecIsemestre.gridDesgloseEquipo().reconfigure(_this.stRealEjecIsemestre,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEqRealEjecIsemestre.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridestimadoejecucioncierreanoeq').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 20;
                    _this.mymask.show();

                    _this.trimestre = 3;
                    _this.stEstEjecCierAnno = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipoEstCierrAnoIII');
                    _this.stEstEjecCierAnno.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 3,
                            idtiempocontrol: 6,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEqEstEjecCierreAno.gridDesgloseEquipo().reconfigure(_this.stEstEjecCierAnno,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEqEstEjecCierreAno.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridrealcierreannoeq').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 21;
                    _this.mymask.show();

                    _this.trimestre = 4;
                    _this.stRealCierAnno = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipoRealCierreAnno');
                    _this.stRealCierAnno.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 4,
                            idtiempocontrol: 7,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEqRealCierreAno.gridDesgloseEquipo().reconfigure(_this.stRealCierAnno,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEqRealCierreAno.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridimpactoproximoplaneq').on({
            activate: function () {
                if (Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected()) {
                    _this.ctrl = 22;
                    _this.mymask.show();

                    _this.trimestre = 4;
                    _this.stImpactoProxAnno = _this.storeDinamico('getRealEjecItrimestre', vista.gridInverCtrlEquipo.getJrEquipos(), 'ctrlEquipoRealCierreAnno');
                    _this.stImpactoProxAnno.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 4,
                            idtiempocontrol: 8,
                            idindicador: vista.gpPlanEquipoCtrl.getSeleccionModel().selections.items[0].data.idindicador
                        },
                        callback: function (options, success, response) {
                            vista.gpCtrlEqImpactoProxAno.gridDesgloseEquipo().reconfigure(_this.stImpactoProxAnno,
                                vista.gridInverCtrlEquipo.fnCmEquipos());
                            vista.gpCtrlEqImpactoProxAno.gridDesgloseEquipo().getView().refresh();
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        vista.btnGuardarCtrlInver.on({
            click: function () {
                console.info('entra guardar')
                console.info(_this.ctrl)
                console.info(vista.gridCtrlPlanDesagregado.getStore())
                var datos = [];
                var store;
                var trimest;
                var tiempoCtrl;
                var idinversion = Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion;
                //var idindicador = Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idindicador;

                if (_this.ctrl == 1) {
                    console.info('entra 1')
                    store = _this.stRealEjecIverI;
                    trimest = 1;
                    tiempoCtrl = 1;
                    var objRealEjecItri = _this.stRealEjecIverI.getRange()[0].data;
                    for (var i in objRealEjecItri) {
                        datos.push([i, objRealEjecItri[i]]);
                    }
                }
                if (_this.ctrl == 2) {
                    console.info('entra 2')
                    store = _this.estEjecIsemestre;
                    trimest = 1;
                    tiempoCtrl = 2;
                    var objRealEjecIsemestre = _this.estEjecIsemestre.getRange()[0].data;
                    for (var i in objRealEjecIsemestre) {
                        datos.push([i, objRealEjecIsemestre[i]]);
                    }
                }
                if (_this.ctrl == 3) {
                    console.info('entra 3')
                    store = _this.estEjecCierreAnno;
                    trimest = 1;
                    tiempoCtrl = 6;
                    var objRealEjecCierreAno = _this.estEjecCierreAnno.getRange()[0].data;
                    for (var i in objRealEjecCierreAno) {
                        datos.push([i, objRealEjecCierreAno[i]]);
                    }
                }
                if (_this.ctrl == 4) {
                    console.info('entra 4')
                    store = _this.realEjecAbril;
                    trimest = 2;
                    tiempoCtrl = 4;
                    var realEjcAbril = _this.realEjecAbril.getRange()[0].data;
                    for (var i in realEjcAbril) {
                        datos.push([i, realEjcAbril[i]]);
                    }
                }
                if (_this.ctrl == 5) {
                    console.info('entra 5')
                    store = _this.estimadoEjecMayJun;
                    trimest = 2;
                    tiempoCtrl = 5;
                    var estMyJun = _this.estimadoEjecMayJun.getRange()[0].data;
                    for (var i in estMyJun) {
                        datos.push([i, estMyJun[i]]);
                    }
                }
                if (_this.ctrl == 6) {
                    console.info('entra 6')
                    store = _this.estEjecIsemestreII;
                    trimest = 2;
                    tiempoCtrl = 2;
                    var estEjIsemestre = _this.estEjecIsemestreII.getRange()[0].data;
                    for (var i in estEjIsemestre) {
                        datos.push([i, estEjIsemestre[i]]);
                    }
                }
                if (_this.ctrl == 7) {
                    console.info('entra 7')
                    store = _this.estEjecCierreAnnoII;
                    trimest = 2;
                    tiempoCtrl = 6;
                    var estCierrAno = _this.estEjecCierreAnnoII.getRange()[0].data;
                    for (var i in estCierrAno) {
                        datos.push([i, estCierrAno[i]]);
                    }
                }
                if (_this.ctrl == 8) {
                    console.info('entra 8')
                    store = _this.realEjecIsemes;
                    trimest = 3;
                    tiempoCtrl = 3;
                    var realEjIsemest = _this.realEjecIsemes.getRange()[0].data;
                    for (var i in realEjIsemest) {
                        datos.push([i, realEjIsemest[i]]);
                    }
                }
                if (_this.ctrl == 9) {
                    store = _this.estEjecCierreAnnoIII;
                    trimest = 3;
                    tiempoCtrl = 6;
                    var realEjIsemest = _this.estEjecCierreAnnoIII.getRange()[0].data;
                    for (var i in realEjIsemest) {
                        datos.push([i, realEjIsemest[i]]);
                    }
                }
                if (_this.ctrl == 10) {
                    store = _this.realCierreAnno;
                    trimest = 4;
                    tiempoCtrl = 7;
                    var realCierreAno = _this.realCierreAnno.getRange()[0].data;
                    for (var i in realCierreAno) {
                        datos.push([i, realCierreAno[i]]);
                    }
                }
                if (_this.ctrl == 11) {
                    store = _this.impactoProxAno;
                    trimest = 4;
                    tiempoCtrl = 8;
                    var impactProxAno = _this.impactoProxAno.getRange()[0].data;
                    for (var i in impactProxAno) {
                        datos.push([i, impactProxAno[i]]);
                    }
                }
                console.info(datos)
                _this.guardarCtrlXtrimestre(idinversion, trimest, tiempoCtrl, store, datos, 0);
            }
        });

        vista.btnGuardarCtrlEquipos.on({
            click: function () {
                var datos = [];
                var store;
                var trimest;
                var tiempoCtrl;
                var idinversion = Ext.getCmp('gpInversionesctrlEquipos').getSelectionModel().getSelected().data.idinversion;
                var idindicador = Ext.getCmp('gpEquipoplanEquipo').getSelectionModel().getSelected().data.idindicador;
                //guardar real ejecutado I trimestre   
                if (_this.ctrl == 12) {
                    store = _this.stCtrlRealIEquipo;
                    trimest = 1;
                    tiempoCtrl = 3;
                    var objCtrlRealIEquipo = _this.stCtrlRealIEquipo.getRange()[0].data;
                    for (var i in objCtrlRealIEquipo) {
                        datos.push([i, objCtrlRealIEquipo[i]]);
                    }
                }
                //guardar Estimado de ejecucion I semestre en el primer trimestre
                if (_this.ctrl == 13) {
                    store = _this.stCtrlRealISemestreEquipo;
                    trimest = 1;
                    tiempoCtrl = 2;
                    var objCtrlEstEjecIsemestreI = _this.stCtrlRealISemestreEquipo.getRange()[0].data;
                    for (var i in objCtrlEstEjecIsemestreI) {
                        datos.push([i, objCtrlEstEjecIsemestreI[i]]);
                    }
                }
                //guardar Estimado de ejecucion cierre año en el primer trimestre
                if (_this.ctrl == 14) {
                    store = _this.stCtrlEstEjecCierreAno;
                    trimest = 1;
                    tiempoCtrl = 6;
                    var objCtrlEstEjecCierreAnoI = _this.stCtrlEstEjecCierreAno.getRange()[0].data;
                    for (var i in objCtrlEstEjecCierreAnoI) {
                        datos.push([i, objCtrlEstEjecCierreAnoI[i]]);
                    }
                }
                //guardar real ejecutado hasta abril en el segundo trimestre
                if (_this.ctrl == 15) {
                    store = _this.stCtrlEstAbril;
                    trimest = 2;
                    tiempoCtrl = 4;
                    var objCtrlRealEjecAbril = _this.stCtrlEstAbril.getRange()[0].data;
                    for (var i in objCtrlRealEjecAbril) {
                        datos.push([i, objCtrlRealEjecAbril[i]]);
                    }
                }
                //guardar real ejecutado hasta abril en el segundo trimestre
                if (_this.ctrl == 16) {
                    store = _this.stCtrlEquipoMyJun;
                    trimest = 2;
                    tiempoCtrl = 5;
                    var objCtrlEstEjecMayJun = _this.stCtrlEquipoMyJun.getRange()[0].data;
                    for (var i in objCtrlEstEjecMayJun) {
                        datos.push([i, objCtrlEstEjecMayJun[i]]);
                    }
                }
                //guardar estimado de ejecucion I semestre en el segundo trimestre
                if (_this.ctrl == 17) {
                    store = _this.stEstEjecIsemestre;
                    trimest = 2;
                    tiempoCtrl = 2;
                    var objCtrlEstIsemest = _this.stEstEjecIsemestre.getRange()[0].data;
                    for (var i in objCtrlEstIsemest) {
                        datos.push([i, objCtrlEstIsemest[i]]);
                    }
                }
                //guardar estimado de ejecucion cierre anno en el segundo trimestre
                if (_this.ctrl == 18) {
                    store = _this.stEstEjecCierAnoII;
                    trimest = 2;
                    tiempoCtrl = 6;
                    var objCtrlEstEjecCierreAnoII = _this.stEstEjecCierAnoII.getRange()[0].data;
                    for (var i in objCtrlEstEjecCierreAnoII) {
                        datos.push([i, objCtrlEstEjecCierreAnoII[i]]);
                    }
                }
                //guardar real ejecutado I semestre en el tercero trimestre
                if (_this.ctrl == 19) {
                    store = _this.stRealEjecIsemestre;
                    trimest = 3;
                    tiempoCtrl = 3;
                    var objCtrlRealEjecIsemestre = _this.stRealEjecIsemestre.getRange()[0].data;
                    for (var i in objCtrlRealEjecIsemestre) {
                        datos.push([i, objCtrlRealEjecIsemestre[i]]);
                    }
                }
                //guardar estimado ejecucion cierre anno en el tercer trimestre
                if (_this.ctrl == 20) {
                    store = _this.stEstEjecCierAnno;
                    trimest = 3;
                    tiempoCtrl = 6;
                    var objCtrlEjecCierreAnoIII = _this.stEstEjecCierAnno.getRange()[0].data;
                    for (var i in objCtrlEjecCierreAnoIII) {
                        datos.push([i, objCtrlEjecCierreAnoIII[i]]);
                    }
                }
                //guardar estimado ejecucion cierre anno en el cuarto trimestre
                if (_this.ctrl == 21) {
                    store = _this.stRealCierAnno;
                    trimest = 4;
                    tiempoCtrl = 7;
                    var objCtrlRealEjecCierreAno = _this.stRealCierAnno.getRange()[0].data;
                    for (var i in objCtrlRealEjecCierreAno) {
                        datos.push([i, objCtrlRealEjecCierreAno[i]]);
                    }
                }
                //guardar estimado ejecucion cierre anno en el cuarto trimestre
                if (_this.ctrl == 22) {
                    store = _this.stImpactoProxAnno;
                    trimest = 4;
                    tiempoCtrl = 8;
                    var objCtrlRealimpacProxAno = _this.stImpactoProxAnno.getRange()[0].data;
                    for (var i in objCtrlRealimpacProxAno) {
                        datos.push([i, objCtrlRealimpacProxAno[i]]);
                    }
                }

                _this.guardarCtrlXtrimestre(idinversion, trimest, tiempoCtrl, store, datos, idindicador);
            }
        });

//        Ext.getCmp('idtabmedioambientectrl').on({
//            activate: function() {
//                var idInvers = Array();
//                var inversiones = vista.gridDataInver.getSeleccions();
//                for (var i = 0; i < inversiones.length; i++) {
//                    idInvers.push(inversiones[i].data.idinversion);
//                }
//                vista.gridDatInverCtrlMA.actualizarGrid(_this.identidadSelecc,
//                        vista.cmbEjercicio.getValue(), idInvers);
//            }
//        });

        Ext.getCmp('gpInversionesDataMA').on({
            click: function () {
                if (Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected()) {
                    _this.mymask.show();
                    _this.stPlanCtrlMA = _this.storeDinamico('getPlanMA', vista.gridDatInverCtrlMA.getJrMA(), 'planctrlMA');
                    _this.stPlanCtrlMA.load({
                        params: {
                            idinvers: Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected().data.idinversion
                        },
                        callback: function (options, success, response) {
                            vista.gpPlanMACtrl.gridMedioAmbiente().reconfigure(_this.stPlanCtrlMA, vista.gridDatInverCtrlMA.fnCmMA());
                            _this.mymask.hide();
                        }
                    });

                    _this.stPlanCtrlDesgMAI = _this.storeDinamico('getDesagMA', vista.gridDatInverCtrlMA.getJrMA(), 'planctrlDesagMAI');
                    _this.stPlanCtrlDesgMAI.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idtrimestre: vista.tpCtrlMA.getActiveTab().activeTab + 1,
                            idinversion: Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected().data.idinversion
                        },
                        callback: function (options, success, response) {
                            vista.gpPlanMACtrlDesagItrimestre.gridMedioAmbiente().reconfigure(_this.stPlanCtrlDesgMAI, vista.gridDatInverCtrlMA.fnCmMAEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridplanrealejecutadoma').on({
            activate: function () {
                if (Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected()) {
                    _this.stCtrlRealMAI = _this.storeDinamico('getRealEjecMA', vista.gridDatInverCtrlMA.getJrMA(), 'ctrlMARealI');
                    _this.stCtrlRealMAI.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 1,
                            idtiempocontrol: 3
                        },
                        callback: function (options, success, response) {
                            vista.gpPlanMACtrlRealEjecItrimestre.gridMedioAmbiente().reconfigure(_this.stCtrlRealMAI, vista.gridDatInverCtrlMA.fnCmMAEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridplansemestredesagregadoma').on({
            activate: function () {
                if (Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected()) {
                    _this.stPlanCtrlDesgMAI = _this.storeDinamico('getDesagregacionIsemestreMA', vista.gridDatInverCtrlMA.getJrMA(), 'planctrlDesagMAI');
                    _this.stPlanCtrlDesgMAI.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            semestre: Ext.encode(Array(1, 2)),
                            idinversion: Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected().data.idinversion
                        },
                        callback: function (options, success, response) {
                            vista.gpPlanMACtrlDesagIsemestre.gridMedioAmbiente().reconfigure(_this.stPlanCtrlDesgMAI, vista.gridDatInverCtrlMA.fnCmMAEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridestimadoejecprimersemestrema').on({
            activate: function () {
                if (Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected()) {
                    _this.stCtrlEstEjecMAI = _this.storeDinamico('getRealEjecMA', vista.gridDatInverCtrlMA.getJrMA(), 'ctrlEstEjecMAI');
                    _this.stCtrlEstEjecMAI.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 1,
                            idtiempocontrol: 2
                        },
                        callback: function (options, success, response) {
                            vista.gpPlanMACtrlEstimadoEjecIsemestre.gridMedioAmbiente().
                                reconfigure(_this.stCtrlEstEjecMAI, vista.gridDatInverCtrlMA.fnCmMAEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        Ext.getCmp('idgridestimadoejeccierreanoeq').on({
            activate: function () {
                if (Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected()) {
                    _this.stCtrlEstEjecCierreMAI = _this.storeDinamico('getRealEjecMA', vista.gridDatInverCtrlMA.getJrMA(), 'ctrlEstEjecCierreMAI');
                    _this.stCtrlEstEjecCierreMAI.load({
                        params: {
                            idejercicio: vista.cmbEjercicio.getValue(),
                            identidad: _this.identidadSelecc,
                            idinversion: Ext.getCmp('gpInversionesDataMA').getSelectionModel().getSelected().data.idinversion,
                            trimestre: 1,
                            idtiempocontrol: 6
                        },
                        callback: function (options, success, response) {
                            vista.gpPlanMACtrlEstimadoEjecCierreAno.gridMedioAmbiente().
                                reconfigure(_this.stCtrlEstEjecCierreMAI, vista.gridDatInverCtrlMA.fnCmMAEditable());
                            _this.mymask.hide();
                        }
                    });
                }
            }
        });

        this.guardarCtrlXtrimestre = function (idinversion, triestre, tiempoCtrl, store, datos, idindicador) {
            _this.mymask.show();
            Ext.Ajax.request({
                method: "POST",
                url: "saveControl",
                params: {
                    idinversion: idinversion,
                    //ctrl: ctrl,
                    tiempoCtrl: tiempoCtrl,
                    idtrimestre: triestre,
                    datadesglose: Ext.encode(datos),
                    idejercicio: vista.cmbEjercicio.getValue(),
                    idindicador: idindicador,
                    desglose: vista.tpControl.getActiveTab().activeTab
                },
                callback: function (options, success, response) {
                    mostrarMensaje(1, 'Se ha guardado satisfactoriamente los datos');
                    store.reload();
                    _this.mymask.hide();
                }
            });
        };

        this.guardarDesagXtrimestre = function (idinversion, trimestre, store, datos, idindicador) {
            _this.mymask.show();
            if (Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected() ||
                Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected()) {
                Ext.Ajax.request({
                    method: "POST",
                    url: "saveDesagregacion",
                    params: {
                        idinversion: idinversion,
                        idtrimestre: trimestre,
                        datadesglose: Ext.encode(datos),
                        idejercicio: vista.cmbEjercicio.getValue(),
                        idindicador: idindicador,
                        desglose: _this.desglose
                    },
                    callback: function (options, success, response) {
                        mostrarMensaje(1, 'Se ha guardado satisfactoriamente los datos');
                        store.reload({
                            callback: function (options, success, response) {
                                if (_this.desglose == 1) {
                                    _this.stCompTotalIver.load({
                                        params: {
                                            idejercicio: vista.cmbEjercicio.getValue(),
                                            identidad: _this.identidadSelecc,
                                            idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion
                                        },
                                        callback: function (options, success, response) {
                                            vista.gpDesgInverResto.gridDesagregacionInversion().reconfigure(_this.stCompTotalIver, vista.gridInverDesgInver.getCm());
                                            _this.mymask.hide();
                                        }
                                    });
                                }
                                if (_this.desglose == 2) {
                                    _this.stCompTotalEquipo.load({
                                        params: {
                                            idejercicio: vista.cmbEjercicio.getValue(),
                                            identidad: _this.identidadSelecc,
                                            idinversion: idinversion,
                                            trimestre: Ext.encode(trimestre),
                                            idindicador: idindicador
                                        },
                                        callback: function (options, success, response) {
                                            vista.gpComprobacionEquipo.gridDesgloseEquipo().reconfigure(_this.stCompTotalEquipo, vista.gridEquipoDesg.fnCmEquipos());
                                            _this.mymask.hide();
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                mostrarMensaje(1, 'Debe seleccionar una inversi\xF3n');
            }
        };

        this.storeDinamico = function (url, jr, id) {
            storeDinamico = new Ext.data.Store({
                id: id,
                url: url,
                reader: new Ext.data.JsonReader({}, jr),
                listeners: {
                    update: function () {
//            alert('este evento se dispara cuando se modifica un valor de una celda')
                    }
                }
            });
            return storeDinamico;
        };
    },
    cargarCMEditable: function (obj) {
//        var a = _this.cargarDatosCmp(obj);
//        $.when(_this.cargarDatosCmp(obj)).then(_this.cargarDatos(a, obj));
        _this.cargarDatosCmp(obj);
    },
    cargarDatosCmp: function (obj) {
        Ext.Ajax.request({
            url: 'getCmpInversion',
            params: {
                idinvers: obj.idinversion
            },
            callback: function (options, success, response) {
                if (obj.p) {
                    obj.p.fireEvent('cargarStores', response, obj);
                }
                else
                    _this.cargarDatos(response, obj);
            }
        });
    },
    cargarDatosCmpEquipo: function (obj) {
        Ext.Ajax.request({
            url: 'getEntidadModelo',
            params: {
                identidad: obj.identidad
            },
            callback: function (options, success, response) {
                if (obj.p) {
                    obj.p.fireEvent('cargarStores', response, obj);
                }
                else
                    _this.cargarDatos(response, obj);
            }
        });
    },
    cargarCMpp: function (obj) {
        Ext.Ajax.request({
            url: 'getMonedaEntidad',
            params: {
                identidad: obj.identidad
            },
            callback: function (options, success, response) {
                var editable = (obj.id == 'idgridctrlPrimer') ? false : true;
                responseDataMonedaEntidad = Ext.decode(response.responseText);
                obj.vista.gridInverDesgInver.cmPP = [];
                obj.vista.gridInverDesgInver.datIndcmPP = [];

                obj.vista.gridInverCtrlInver.cmPP = [];
                obj.vista.gridInverCtrlInver.datIndcmPP = [];

                Ext.each(responseDataMonedaEntidad, function (item, i) {
                    var cmPPaux = {
                        id: 'colpp' + i + obj.id,
                        header: 'PP (' + item.codigoiso + ')',
                        tooltip: item.denominacion,
                        width: 100,
                        sortable: true,
                        dataIndex: 'pp-' + item.idmonedaentidad,
                        editable: editable,
                        selectable: editable,
                        editor: new Ext.form.NumberField({
                            disabledClass: 'disabled-component',
                            regexText: 'Los valores deben ser n\xFAmeros enteros',
                            selectOnFocus: true,
                            emptyText: 'Seleccione...',
                            allowBlank: false
                        })
                    };
                    var dataIndexPP = {
                        name: 'pp-' + item.idmonedaentidad
                    };
                    obj.vista.gridInverDesgInver.cmPP.push(cmPPaux);
                    obj.vista.gridInverDesgInver.datIndcmPP.push(dataIndexPP);

                    obj.vista.gridInverCtrlInver.cmPP.push(cmPPaux);
                    obj.vista.gridInverCtrlInver.datIndcmPP.push(dataIndexPP);
                });
            }
        });
    },

    cargarCMEquipo: function (obj) {
        Ext.Ajax.request({
            url: 'getEntidadModelo',
            params: {
                identidad: obj.identidad
            },
            callback: function (options, success, response) {
                responseDataEquipo = Ext.decode(response.responseText);
                obj.vista.gridInverCtrlEquipo.cmEquipoEditable = [];
                obj.vista.gridEquipoDesg.cmEquipoEditable = [];
                obj.vista.gridInverCtrlEquipo.datIndEquipoEditable = [];
                obj.vista.gridEquipoDesg.datIndEquipoEditable = [];
                Ext.each(responseDataEquipo, function (item, i) {
                    var cmEquipoAux = {
                        id: 'eq' + i + obj.id,
                        header: item.denominacion,
                        tooltip: item.denominacion,
                        width: 100,
                        sortable: true,
                        dataIndex: item.identidadmodelo,
                        editor: new Ext.form.NumberField({
                            disabledClass: 'disabled-component',
                            regexText: 'Los valores deben ser n\xFAmeros enteros',
                            selectOnFocus: true,
                            emptyText: 'Seleccione...',
                            allowBlank: false
                        })
                    };
                    var dataIndexEquipoAux = {
                        name: item.identidadmodelo
                    };
                    obj.vista.gridInverCtrlEquipo.cmEquipoEditable.push(cmEquipoAux);
                    obj.vista.gridEquipoDesg.cmEquipoEditable.push(cmEquipoAux);
                    obj.vista.gridInverCtrlEquipo.datIndEquipoEditable.push(dataIndexEquipoAux);
                    obj.vista.gridEquipoDesg.datIndEquipoEditable.push(dataIndexEquipoAux);
                    obj.p.fireEvent('cargarStore', obj);
                });
            }
        });
    },
    cargarDatos: function (response, obj) {
        responseData = Ext.decode(response.responseText);
        $.when(_this.crearColumnas(responseData, obj)).then(_this.cargarDatosPaneles(obj));
        _this.mymaskDe.hide();
    },
    cargarDatosControlInv: function (response, obj) {
    },
    cargarDatosEquipos: function (response, obj) {
        responseData = Ext.decode(response.responseText);
        $.when(_this.crearColumnas(responseData, obj)).then(_this.cargarDatosPaneles(obj));
        _this.mymaskDe.hide();
    },
    crearColumnas: function (responseData, obj) {
        console.log(obj.id);
        var editable = (obj.id == 'idgridctrlPrimer') ? false : true;
        console.log(editable);
        obj.vista.gridInverDesgInver.columnasCmpEditable = [];
        obj.vista.gridInverDesgInver.columnasCmp = [];
        obj.vista.gridInverDesgInver.dataIndexCUPEditable = [];
        obj.vista.gridInverDesgInver.dataIndexCUP = [];

        obj.vista.gridInverCtrlInver.columnasCmpEditable = [];
        obj.vista.gridInverCtrlInver.columnasCmp = [];
        obj.vista.gridInverCtrlInver.dataIndexCUPEditable = [];
        obj.vista.gridInverCtrlInver.dataIndexCUP = [];
        Ext.each(responseData, function (item, i) {
            var aux = {
                codigoiso: item.codigoiso,
                id: 'col' + i + obj.id,
                header: item.denominacion + ' (' + item.codigoiso + ')',
                tooltip: item.denominacion + ' (' + item.codigoiso + ')',
                width: 100,
                sortable: true,
                dataIndex: item.idetapainversion + '-' + item.idmonedaentidad,
                editable: editable,
                selectable: editable,
                editor: new Ext.form.NumberField({
                    disabledClass: 'disabled-component',
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                    selectOnFocus: true,
                    emptyText: 'Seleccione...',
                    allowBlank: false
                })
            };
            var dataIndexCUP = {
                name: item.idetapainversion + '-' + item.idmonedaentidad
            };
            var dataIndexusd = {
                name: item.idetapainversion + '-' + item.idmonedaentidad
            };
            var columnas = {
                codigoiso: item.codigoiso,
                id: 'colEst' + i + obj.id,
                header: item.denominacion + ' (' + item.codigoiso + ')',
                tooltip: item.denominacion + ' (' + item.codigoiso + ')',
                width: 100,
                sortable: true,
                dataIndex: item.idetapainversion + '-' + item.idmonedaentidad
            };


            obj.vista.gridInverDesgInver.columnasCmpEditable.push(aux);
            obj.vista.gridInverDesgInver.dataIndexCUPEditable.push(dataIndexCUP);
            obj.vista.gridInverDesgInver.dataIndexUSD.push(dataIndexusd);
            obj.vista.gridInverDesgInver.columnasCmp.push(columnas);
            obj.vista.gridInverDesgInver.getJr();
            //obj.vista.gridInverDesgInver.getCm();


            obj.vista.gridInverCtrlInver.columnasCmpEditable.push(aux);
            obj.vista.gridInverCtrlInver.dataIndexCUPEditable.push(dataIndexCUP);
            obj.vista.gridInverCtrlInver.dataIndexUSD.push(dataIndexusd);
            obj.vista.gridInverCtrlInver.columnasCmp.push(columnas);
            obj.vista.gridInverCtrlInver.getJr();


        });
    },
    cargarDatosPaneles: function (obj) {

        var stPlan = _this.storeDinamico('getPlanAprobado', obj.vista.gridInverDesgInver.getJr());
        _this.stDesgregaItriIver = _this.storeDinamico('getDesagregacionI', obj.vista.gridInverDesgInver.getJr());
        _this.stCompTotalIver = _this.storeDinamico('getCompTotalInv', obj.vista.gridInverDesgInver.getJr());
        _this.stPlanAprobadoIverCtrl = _this.storeDinamico('getPlanAprobado', obj.vista.gridInverCtrlInver.getJr(), 'planaprobadoctrl');
        _this.stCtrlItriIver = _this.storeDinamico('getDesagregacionI', obj.vista.gridInverCtrlInver.getJr(), 'desagprimerctrl');

        if (obj.objAprob) {
            stPlan.load({
                params: {
                    idejercicio: obj.objAprob.idejercicio,
                    identidad: obj.objAprob.identidad,
                    idinversion: obj.objAprob.idinversion
                },
                callback: function (options, success, response) {
                    obj.objAprob.grid.reconfigure(stPlan, obj.vista.gridInverDesgInver.getCm());
                    obj.objAprob.grid.getView().refresh();
                }
            });
        }

        if (obj.objDesagI) {
            _this.stDesgregaItriIver.load({
                params: {
                    idejercicio: obj.objDesagI.idejercicio,
                    identidad: obj.objDesagI.identidad,
                    idinversion: obj.objDesagI.idinversion,
                    trimestre: obj.objDesagI.trimestre
                },
                callback: function (options, success, response) {
                    obj.objDesagI.grid.reconfigure(_this.stDesgregaItriIver, obj.vista.gridInverDesgInver.getCmEditable());
                    obj.objDesagI.grid.getView().refresh();
                }
            });
        }

        if (obj.objCompT) {
            _this.stCompTotalIver.load({
                params: {
                    idejercicio: obj.objCompT.idejercicio,
                    identidad: obj.objCompT.identidad,
                    idinversion: obj.objCompT.idinversion
                },
                callback: function (options, success, response) {
                    obj.objCompT.grid.reconfigure(_this.stCompTotalIver, obj.vista.gridInverDesgInver.getCm());
                    obj.objCompT.grid.getView().refresh();
                }
            });
        }

        if (obj.objCtrl) {
            _this.stPlanAprobadoIverCtrl.load({
                params: {
                    idejercicio: obj.objCtrl.idejercicio,
                    identidad: obj.objCtrl.identidad,
                    idinversion: obj.objCtrl.idinversion
                },
                callback: function (options, success, response) {
                    obj.objCtrl.grid.reconfigure(_this.stPlanAprobadoIverCtrl, obj.vista.gridInverCtrlInver.getCm());
                    obj.objCtrl.grid.getView().refresh();
                }
            });
        }

        if (obj.objDesgCtrl) {
            _this.stCtrlItriIver.load({
                params: {
                    idejercicio: obj.objDesgCtrl.idejercicio,
                    identidad: obj.objDesgCtrl.identidad,
                    idinversion: obj.objDesgCtrl.idinversion,
                    trimestre: obj.objDesgCtrl.trimestre
                },
                callback: function (options, success, response) {
                    obj.objDesgCtrl.grid.reconfigure(_this.stCtrlItriIver, obj.vista.gridInverCtrlInver.getCm());
                    obj.objDesgCtrl.grid.getView().refresh();
                    _this.mymask.hide();
                }
            });
        }
    },

    cargarDesagTab: function (p, trimestre, vista) {
        _this.trimestre = trimestre;

        if (Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected()) {
            // _this.mymask.show();
            //vista.tpDesgloseEquipos.setActiveTab(0);

            var stPlanAprobadoIver = _this.storeDinamico('getPlanAprobado', vista.gridInverDesgInver.getJr(), 'planaprobado');
            _this.stDesgregaItriIver = _this.storeDinamico('getDesagregacionI', vista.gridInverDesgInver.getJr(), 'desagprimer');
            _this.stCompTotalIver = _this.storeDinamico('getCompTotalInv', vista.gridInverDesgInver.getJr(), 'totalinversion');

            _this.cargarCMEditable({
                p: p,
                vista: vista,
                id: p.id,
                idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion,

                objAprob: {
                    idejercicio: vista.cmbEjercicio.getValue(),
                    identidad: _this.identidadSelecc,
                    idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion,

                    grid: vista.gridplanAprDesagregacion.gridDesagregacionInversion(),
                    store: stPlanAprobadoIver,
                    //cm: vista.gridInverDesgInver.getCm()
                },
                objDesagI: {
                    idejercicio: vista.cmbEjercicio.getValue(),
                    identidad: _this.identidadSelecc,
                    idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion,
                    trimestre: 1,

                    grid: vista.gpDesgInverPrimer.gridDesagregacionInversion(),
                    store: _this.stDesgregaItriIver
                },
                objCompT: {
                    idejercicio: vista.cmbEjercicio.getValue(),
                    identidad: _this.identidadSelecc,
                    idinversion: Ext.getCmp('gpInversionesDesag').getSelectionModel().getSelected().data.idinversion,

                    grid: vista.gpDesgInverResto.gridDesagregacionInversion(),
                    store: _this.stCompTotalIver
                }
            });

            _this.cargarCMpp({
                vista: vista,
                id: p.id,
                identidad: _this.identidadSelecc
            });
        }
    },
    cargarDesagEquipoTab: function (p, trimestre, vista) {
        _this.trimestre = trimestre;

        if (Ext.getCmp('gpEquipoPlan').getSelectionModel().getSelected()) {
            _this.mymask.show();
            vista.tpDesgloseEquipos.setActiveTab(0);
            vista.tpDesgloseEquipos.enable();
            var trimestre = Array();
            trimestre.push(1);
            _this.stDesgregaIEquipo = _this.storeDinamico('getDesagregacionEquipo', vista.gridEquipoDesg.getJrEquipos(), 'desagIequipo');
            _this.stCompTotalEquipo = _this.storeDinamico('getCompTotalEquipo', vista.gridEquipoDesg.getJrEquipos(), 'compequipo');

            _this.stDesgregaIEquipo.load({
                params: {
                    idejercicio: vista.cmbEjercicio.getValue(),
                    identidad: _this.identidadSelecc,
                    idinversion: Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected().data.idinversion,
                    trimestre: Ext.encode(trimestre),
                    idindicador: vista.gpPlanEquipoPrimer.getSeleccionModel().selections.items[0].data.idindicador
                },
                callback: function (options, success, response) {
                    vista.gpEquipoPrimer.gridDesgloseEquipo().reconfigure(_this.stDesgregaIEquipo, vista.gridEquipoDesg.fnCmEquipos());
                    vista.gpEquipoPrimer.gridDesgloseEquipo().getView().refresh();
                    _this.mymask.hide();
                }
            });
            _this.stCompTotalEquipo.load({
                params: {
                    idejercicio: vista.cmbEjercicio.getValue(),
                    identidad: _this.identidadSelecc,
                    idinversion: Ext.getCmp('gpInversionesEquipos').getSelectionModel().getSelected().data.idinversion,
                    trimestre: Ext.encode(trimestre),
                    idindicador: vista.gpPlanEquipoPrimer.getSeleccionModel().selections.items[0].data.idindicador
                },
                callback: function (options, success, response) {
                    vista.gpComprobacionEquipo.gridDesgloseEquipo().reconfigure(_this.stCompTotalEquipo, vista.gridEquipoDesg.fnCmEquipos());
                    vista.gpComprobacionEquipo.gridDesgloseEquipo().getView().refresh();
                }
            });
        }
    },
    cargarControlInv: function (p, trimestre, vista) {
        _this.trimestre = trimestre;
        vista.tpCtrlInversiones.setActiveTab(0);
        vista.tpCtrlInversiones.enable();
        _this.mymask.show();
        _this.stPlanAprobadoIverCtrl = _this.storeDinamico('getPlanAprobado', vista.gridInverCtrlInver.getJr(), 'planaprobadoctrl');
        _this.stCtrlItriIver = _this.storeDinamico('getDesagregacionI', vista.gridInverCtrlInver.getJr(), 'desagprimerctrl');


        _this.cargarCMEditable({
            vista: vista,
            id: p.id,
            idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,

            objCtrl: {
                idejercicio: vista.cmbEjercicio.getValue(),
                identidad: _this.identidadSelecc,
                idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                grid: vista.gridplanAprCtrl.gridDesagregacionInversion(),
                store: _this.stPlanAprobadoIverCtrl
            },
            objDesgCtrl: {
                idejercicio: vista.cmbEjercicio.getValue(),
                identidad: _this.identidadSelecc,
                idinversion: Ext.getCmp('gpInversionesctrl').getSelectionModel().getSelected().data.idinversion,
                trimestre: trimestre,
                store: _this.stCtrlItriIver,
                grid: vista.gpCtrlInverPrimer.gridDesagregacionInversion()
            }
        });

        _this.cargarCMpp({
            vista: vista,
            id: p.id,
            identidad: _this.identidadSelecc
        });
    }

};