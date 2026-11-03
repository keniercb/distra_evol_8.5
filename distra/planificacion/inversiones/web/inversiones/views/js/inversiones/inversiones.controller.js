Ext.ns('Gestionar.inversiones');
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('inversiones', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Gestionar.inversiones.Modelo;
    modelo.init();
    var vista = Gestionar.inversiones.Vista;
    vista.init(idioma, modelo);
    var acciones, idorganismo, objci;
    nomencladoresInversiones = null;

    Gestionar.inversiones.Controlador.init(idioma, vista, modelo);
});
boolAceptar = true;
Gestionar.inversiones.Controlador = {
    init: function(idioma, vista, modelo) {
        Ext.Ajax.timeout = 1000000000;
        /* vista.win_add_inversiones.doLayout();
         vista.win_add_inversiones.show();
         vista.win_add_inversiones.hide();*/
        _this.openWin = true;
        var arr_dates = [];
        var addmod;
        var bloq;
        var flag1 = false, objci, mod = false, denoInv = "", denoCmp = "", denoElem = "", gridIsSelected = false;

        _this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando...'
        });
        _this.iddpt = 0;
        Ext.Ajax.request({
            url: 'cargaAcciones',
            callback: function(options, success, response) {
                objci = Ext.decode(response.responseText);
                
            }
        });



        modelo.store_gestionar_inversiones.on('beforeload', function(st, opt) {
            vista.grid_gestionar_inversiones.getSelectionModel().clearSelections();
            if (vista.sm_inversiones.getSelected()) {
                var selecti = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
                st.baseParams.idinversion = selecti;
            }
            if (vista.sm_componentes.getSelected()) {
                st.baseParams.idcomponente = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa;
            }
            if (vista.treePanelinversion.getSelectionModel().getSelectedNode() != null) {
                st.baseParams.identidad = idorganismo;
            }
            st.baseParams.idejercicio = vista.cmbEjercicio.getValue();
            st.baseParams.ejercicio = vista.cmbEjercicio.getRawValue();
            st.baseParams.check = (vista.ChConsolidar.getValue() == true) ? 1 : 0;
            st.baseParams.vigente = (vista.ChVigente.getValue() == true) ? 1 : 0;
            st.baseParams.cuadrada = 1;
        });
        modelo.store_gestionar_inversiones.on('load', function() {
            if (vista.filtrosinv.getFiltrosActivos().length > 0 && modelo.store_gestionar_inversiones.getCount() == 0) {
                mostrarMensaje(1, perfil.etiquetas.tlexiste);
            }
            modelo.store_gestionar_componentes.removeAll();
            modelo.store_gestionar_elementos.removeAll();
            _this.btnAdicionarinversion.enable();
        });
        vista.treePanelinversion.on('click', function(node, evento) {
            vista.grid_gestionar_inversiones.getSelectionModel().clearSelections();
            idorganismo = node.id;

            vista.btnExportar.enable();
            vista.entidadSeleccionada = node;
            recarga(modelo.store_gestionar_inversiones, 20);
            arr = new Array();
            rec = modelo.store_gestionar_elementos_der.getModifiedRecords();
            modelo.store_gestionar_elementos_der.commitChanges();
            for (var i = 0; i < rec.length; i++) {
                arr.push(rec[i].data);
            }
//            modelo.store_gestionar_elementos_der.reload({
//                params: {
//                    filas: Ext.encode(arr)
//                }
//            });
            modelo.stMonedas.reload({
                params: {
                    identidad: idorganismo
                }
            });

            modelo.stMonedasEValor.reload({
                params: {
                    identidad: idorganismo
                }
            });

            vista.ChConsolidar.disable();
            vista.ChConsolidar.enable();

            vista.ChVigente.disable();
            vista.ChVigente.enable();

            vista.btnGraficoInversion.enable();
            vista.mbCartera.enable();

            vista.btnGraficas.actualizarParametros(node, vista.cmbEjercicio.getValue(), vista.cmbEjercicio.getRawValue());
        });



        //*********************TECLAS CALIENTES********************************//
        _this.map = new Ext.KeyMap(Ext.getDoc(), [
            /*{
             key: 'iI',
             alt: true,
             fn: function() {
             levantarBtnadd(true);
             }
             },*/ {
                key: 46, //tecla eliminar
                fn: function() {
                    if (vista.btnEliminarinversion.enable() && _this.openWin && vista.sm_inversiones.getSelected()) {
                        btnPresionado = 'ok';
                        mostrarMensaje(2, perfil.etiquetas.tlDel, eliminarInversion);
                    }
                }
            },
            /*{
             key: 'mM',
             alt: true,
             fn: function() {
             if (vista.btnModificarinversion.enable()) {
             levantarBtnadd(false);
             }
             
             }
             },*/
            {key: 'Ll',
                alt: true,
                fn: function() {
                    vista.filtrosinv.clearFilters();
                    vista.grid_gestionar_inversiones.getStore().reload();
                }
            }, {
                key: 'Gg',
                alt: true,
                fn: function() {
                    vista.btn_guardar_elementos_der.fireEvent('click');
                }
            }, {
                key: 'Tt',
                alt: true,
                fn: function() {
                    Ext.getCmp('idActInversion').fireEvent('click');
                }
            }, {
                key: 'Ff',
                alt: true,
                fn: function() {
                    Ext.getCmp('btn_desactivar_inversion').fireEvent('click');
                }
            }, {
                key: 'Qq',
                alt: true,
                fn: function() {
                    Ext.getCmp('idaprobacion').fireEvent('click');
                }
            }, {
                key: 'Ww',
                alt: true,
                fn: function() {
                    Ext.getCmp('iddesaprobar').fireEvent('click');
                }
            }, {
                key: 'Dd',
                alt: true,
                fn: function() {
                    ReportesContratos();
                }
            }
        ]);
        _this.map.enable();

        vista.sm_Tiposdocumentos_factibilidad.on({
            rowselect: function() {
                _this.btnEliminarDocFactibilidad.enable();
                _this.btnVigenteDocfactibilidad.enable();
            },
            rowdeselect: function() {
                _this.btnEliminarDocFactibilidad.disable();
                _this.btnVigenteDocfactibilidad.disable();
            }
        });

        //--------------VALIDAR LOS BOTONES DE LA INTERFAZ INVERSIONES-----------------------
        //EVENTOS AL SELECCIONAR UN ELEMENTO DE GRID INVERSIONES
        vista.sm_inversiones.on({
            rowselect: function(sm) {
                if (vista.sm_inversiones.getSelections().length > 0) {
                    if(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.bloqueada != 1){
                        vista.btnEliminarinversion.enable();
                    }
                    Ext.getCmp('idaprobacion').enable();
                    Ext.getCmp('btn_bloquear_inversion').enable();
                    Ext.getCmp('btn_desbloquear_inversion').enable();
                    Ext.getCmp('idActInversion').enable();
                    Ext.getCmp('btn_desactivar_inversion').enable();
                    Ext.getCmp('iddesaprobar').enable();
                    if (vista.sm_inversiones.getSelections().length == 1) {
                        vista.btnModificarinversion.enable();
                        bloq=vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.bloqueada;
                        //vista.btn_ver_Detalles.enable();
                        vista.mbVer.enable();
                        vista.btn_factibilidad.enable();

                        if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 2 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 2) {
                            Ext.getCmp('idaprobacion').enable();
                            Ext.getCmp('btn_bloquear_inversion').enable();
                            Ext.getCmp('btn_desbloquear_inversion').enable();
                            Ext.getCmp('idActInversion').disable();
                            Ext.getCmp('btn_desactivar_inversion').disable();
                            Ext.getCmp('iddesaprobar').disable();

                        } else if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 2 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 1) {
                            Ext.getCmp('idActInversion').enable();
                            Ext.getCmp('iddesaprobar').enable();
                            Ext.getCmp('btn_desactivar_inversion').disable();
                            Ext.getCmp('idaprobacion').disable();
                            Ext.getCmp('btn_bloquear_inversion').disable();
                            Ext.getCmp('btn_desbloquear_inversion').disable();
                        } else if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 1 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 1) {
                            Ext.getCmp('btn_desactivar_inversion').enable();
                            Ext.getCmp('idActInversion').disable();
                            Ext.getCmp('idaprobacion').disable();
                            Ext.getCmp('btn_bloquear_inversion').disable();
                            Ext.getCmp('btn_desbloquear_inversion').disable();
                            Ext.getCmp('iddesaprobar').disable();
                        }

                    } else {
                        vista.btnModificarinversion.disable();
                        //vista.btn_ver_Detalles.disable();
                        vista.mbVer.disable();
                        vista.btn_factibilidad.disable();
                    }
                    denoInv = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.denominacion;
                } else {
                    vista.btnEliminarinversion.disable();
                    Ext.getCmp('idaprobacion').disable();
                    Ext.getCmp('btn_bloquear_inversion').disable();
                    Ext.getCmp('btn_desbloquear_inversion').disable();
                    Ext.getCmp('idActInversion').disable();
                    Ext.getCmp('btn_desactivar_inversion').disable();
                    Ext.getCmp('iddesaprobar').disable();
                }


                if (vista.ChConsolidar.getValue() || sm.getSelected().data.idestadoaprobacion == 1) {
//                    vista.btnModificarinversion.disable();
                    boolAceptar = false;
                    vista.grid_gestionar_componentes.getTopToolbar().setDisabled(true);
                    vista.grid_gestionar_elementos.getTopToolbar().setDisabled(true);
                    vista.grid_gestionar_elementos_der.getTopToolbar().setDisabled(true);
                } else if (sm.getSelected().data.idestadoaprobacion != 1) {
                    boolAceptar = true;
                } /*else {
                 vista.btn_nivelactividad.enable();
                 vista.grid_gestionar_componentes.getTopToolbar().setDisabled(false);
                 vista.grid_gestionar_elementos.getTopToolbar().setDisabled(false);
                 vista.grid_gestionar_elementos_der.getTopToolbar().setDisabled(false);
                 }*/
                modelo.store_gestionar_componentes.removeAll();
                modelo.store_gestionar_elementos_der.removeAll();
                gridIsSelected = true;
            },
            rowdeselect: function() {
                if (vista.sm_inversiones.getSelections().length > 0) {
                    vista.btnEliminarinversion.enable();
                    Ext.getCmp('idaprobacion').enable();
                    Ext.getCmp('btn_bloquear_inversion').enable();
                    Ext.getCmp('btn_desbloquear_inversion').enable();
                    Ext.getCmp('idActInversion').enable();
                    Ext.getCmp('btn_desactivar_inversion').enable();
                    Ext.getCmp('iddesaprobar').enable();
                    gridIsSelected = true;
                    if (vista.sm_inversiones.getSelections().length == 1) {
                        vista.btnModificarinversion.enable();
                        bloq=vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.bloqueada;
                    } else {
                        vista.btnModificarinversion.disable();
                    }
                } else {
                    vista.btnEliminarinversion.disable();
                    Ext.getCmp('idaprobacion').disable();
                    Ext.getCmp('btn_bloquear_inversion').disable();
                    Ext.getCmp('btn_desbloquear_inversion').disable();
                    Ext.getCmp('idActInversion').disable();
                    Ext.getCmp('btn_desactivar_inversion').disable();
                    Ext.getCmp('iddesaprobar').disable();
                    modelo.store_gestionar_componentes.removeAll();
                    gridIsSelected = false;
                }
                vista.btn_georefe_inversion.disable();
                //vista.btn_presupuesto_inversion.disable();
                //vista.btn_financiamiento_inversion.disable();
                //si hay seleccionado solo una fila valido aqui
                if (vista.grid_gestionar_inversiones.getSelectionModel().getSelections().length == 1) {

                    if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 2 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 2) {

                        Ext.getCmp('idaprobacion').enable();
                        Ext.getCmp('btn_bloquear_inversion').enable();
                        Ext.getCmp('btn_desbloquear_inversion').enable();
                        Ext.getCmp('idActInversion').disable();
                        Ext.getCmp('btn_desactivar_inversion').disable();
                        Ext.getCmp('iddesaprobar').disable();
                    } else if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 2 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 1) {

                        Ext.getCmp('idActInversion').enable();
                        Ext.getCmp('iddesaprobar').enable();
                        Ext.getCmp('btn_desactivar_inversion').disable();
                        Ext.getCmp('idaprobacion').disable();
                        Ext.getCmp('btn_bloquear_inversion').disable();
                        Ext.getCmp('btn_desbloquear_inversion').disable();
                    } else if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 1 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 1) {
                        Ext.getCmp('btn_desactivar_inversion').enable();
                        Ext.getCmp('idActInversion').disable();
                        Ext.getCmp('idaprobacion').disable();
                        Ext.getCmp('btn_bloquear_inversion').disable();
                        Ext.getCmp('btn_desbloquear_inversion').disable();
                        Ext.getCmp('iddesaprobar').disable();
                    }
                }

            }
        });
        vista.sm_elementos.on({
            rowselect: function() {
                if (vista.sm_elementos.getSelections().length == 1) {
                    vista.btn_gest_docs.enable();
                    vista.btn_gest_para.enable();
                    vista.btn_adicionar_elementos_der.enable();
                    denoElem = vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.denominacion;
                } else {
                    vista.btn_gest_docs.disable();
                    vista.btn_gest_para.disable();
                    vista.btn_adicionar_elementos_der.disable();
                    vista.grid_gestionar_elementos_der.getStore();
                    denoElem = vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.denominacion;
                }
                vista.grid_gestionar_elementos_der.getStore().reload({
                    params: {
                        start: 0,
                        limit: 20,
                        idelemento: vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion,
                        denominacionetapa: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.denominacion,
                        idetapainversion: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa

                    }
                });

                if (vista.ChConsolidar.getValue() || vista.sm_inversiones.getSelected().data.idestadoaprobacion == 1) {
                    vista.btnModificarinversion.disable();
                    vista.grid_gestionar_componentes.getTopToolbar().setDisabled(true);
                    vista.grid_gestionar_elementos.getTopToolbar().setDisabled(true);
                    vista.grid_gestionar_elementos_der.getTopToolbar().setDisabled(true);
                }

            },
            rowdeselect: function() {
                if (vista.sm_elementos.getSelections().length == 1) {
                    vista.btn_gest_docs.enable();
                    vista.btn_gest_para.enable();
                    vista.btn_adicionar_elementos_der.enable();
                } else {
                    vista.btn_gest_docs.disable();
                    vista.btn_gest_para.disable();
                    vista.btn_adicionar_elementos_der.disable();
                    vista.grid_gestionar_elementos_der.getStore().removeAll();
                }

            }
        });
        modelo.store_gestionar_elementos.on('beforeload', function(st, record, ob) {
            st.baseParams.identidad = idorganismo,
                    st.baseParams.idejercicio = vista.cmbEjercicio.getValue();
            st.baseParams.idcomponente = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa;
        });
        vista.sm_componentes.on({
            rowselect: function(sm, index, rec) {
                if (vista.sm_componentes.getSelections().length == 1) {
                    vista.cmp_CambioEstado.enable();
                    recargaele(modelo.store_gestionar_elementos, 2);
                    modelo.store_gestionar_elementos_der.removeAll();
                    var orden = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.orden;
                    var idestadoflujotrabajo = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idestadoflujotrabajo;
                    var idflujotrabajo = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idflujotrabajo;
                    modelo.stCambioEstado.reload({
                        params: {
                            idetapa: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa,
                            orden: orden,
                            idestadoflujotrabajo: idestadoflujotrabajo,
                            idflujotrabajo: idflujotrabajo
                        }
                    });
                    vista.pContenidoDer.expand(true);
                    denoCmp = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.denominacion;
                } else {
                    vista.cmp_CambioEstado.disable();
                    vista.pContenidoDer.expand(true);
                    denoCmp = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.denominacion;
                }

                if (sm.getSelected().data.denominacion == "TOTAL EQUIPOS") {
                    vista.btn_equipos.enable();
                    vista.btn_constructores.disable();
                } else if (sm.getSelected().data.denominacion == "CONST. Y MONTAJE") {
                    vista.btn_equipos.disable();
                    vista.btn_constructores.enable();
                } else {
                    vista.btn_equipos.disable();
                    vista.btn_constructores.disable();
                }

                //vista.btn_nivelactividad.enable();

                if (vista.ChConsolidar.getValue() || vista.sm_inversiones.getSelected().data.idestadoaprobacion == 1) {
                    vista.btnModificarinversion.disable();
                    vista.grid_gestionar_componentes.getTopToolbar().setDisabled(true);
                    vista.grid_gestionar_elementos.getTopToolbar().setDisabled(true);
                    vista.grid_gestionar_elementos_der.getTopToolbar().setDisabled(true);
                }
                /* else{
                 vista.grid_gestionar_componentes.getTopToolbar().setDisabled(false);
                 vista.grid_gestionar_elementos.getTopToolbar().setDisabled(false);
                 vista.grid_gestionar_elementos_der.getTopToolbar().setDisabled(false);
                 }*/

            },
            rowdeselect: function() {
                if (vista.sm_componentes.getSelections().length == 1) {
                    vista.cmp_CambioEstado.enable();
                    vista.pContenidoDer.expand(true);
                } else {
                    vista.cmp_CambioEstado.disable();
                }
                vista.btn_equipos.disable();
                vista.btn_constructores.disable();
                //vista.btn_nivelactividad.disable();
            }
        });
        //--------------FIN DE LA VALIDACION DE LOS BOTONES DE LA INTERFAZ INVERSIONES----------
        modelo.stCbejercicio.on({
            load: function(t, n, e) {
                vista.cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio)
            }
        });
        vista.cmbEjercicio.on({
            select: function(cmb, record, index) {
                modelo.store_gestionar_inversiones.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });

                vista.btnGraficas.actualizarParametros(vista.entidadSeleccionada, cmb.getValue(), cmb.getRawValue());
            }
        });

        modelo.store_gestionar_componentes.on('beforeload', function(st, record, ob) {
            st.baseParams.identidad = idorganismo;
            st.baseParams.idinversion = (vista.sm_inversiones.getSelected()) ? vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion : 0;
            st.baseParams.idejercicio = vista.cmbEjercicio.getValue();

        });

        vista.grid_gestionar_inversiones.on({
            rowdblclick: function(e) {
                if (!vista.ChConsolidar.getValue() /*&& e.getSelectionModel().getSelected().data.idestadoaprobacion != 1*/) {
                    if (vista.sm_inversiones.getSelections().length > 0) {
                        if (vista.sm_inversiones.getSelections().length == 1) {
                            addmod = false;
                            var VentanaInversiones = new Utilidades.Cmp.controllerVentanaInversiones({
                                addmod: addmod,
                                idioma: vista.idioma,
                                objci: objci,
                                vistaInversiones: vista.sm_inversiones,
                                gridInversiones: vista.grid_gestionar_inversiones,
                                storeInversiones: modelo.store_gestionar_inversiones,
                                ventanaProvincia: vista.ventanaDpt,
                                comboEjercicio: vista.cmbEjercicio,
                                panelComponentes: vista.pgestionar_componentes,
                                idOrganismo: idorganismo,
                                gridIsSelected: gridIsSelected

                            });

                            VentanaInversiones.init();
                            VentanaInversiones.getVistaVentanaInversiones().levantarVentanaInversiones(addmod, boolAceptar);
                        } else {
                            mostrarMensaje(1, " Debe tener una sola fila seleccionada para poder modificar la inversi\xF3n ");
                        }
                    }
                }

            }
        });

        vista.grid_gestionar_inversiones.getSelectionModel().on({
            rowselect: function(g, r, e) {
                recargacom(modelo.store_gestionar_componentes, 5);
//                vista.pgestionar_componentes.expand(true);
                modelo.store_gestionar_elementos.removeAll();
                modelo.store_gestionar_elementos_der.removeAll();
                Ext.getCmp('btn_desactivar_inversion').enable();
                Ext.getCmp('idActInversion').enable();
                vista.btnMenuAprobacion_inversion.enable();
                vista.btnMenuActivacion_inversion.enable();
                vista.btnMenuBloqueo_inversion.enable();
                vista.btn_georefe_inversion.enable();
                //vista.btn_financiamiento_inversion.enable();
                //vista.btn_presupuesto_inversion.enable();
            }
        });
        vista.grid_gestionar_inversiones.getSelectionModel().on({
            rowdeselect: function(g, r, e) {
                vista.btnEliminarinversion.disable();
                vista.btnModificarinversion.disable();
                Ext.getCmp('btn_desactivar_inversion').disable();
                Ext.getCmp('idActInversion').disable();
                vista.btnMenuAprobacion_inversion.disable();
                vista.btnMenuActivacion_inversion.disable();
                vista.btnMenuBloqueo_inversion.disable();
                vista.btn_georefe_inversion.disable();
                //vista.btn_financiamiento_inversion.disable();
                //vista.btn_presupuesto_inversion.disable();
            }
        });

        vista.grid_gestionar_elementos_der.getSelectionModel().on({
            rowselect: function(g, r, record) {
                // console.info(record.data);

                if (record.data.pintar == 0) {
                    vista.btn_eliminar_elementos_der.enable();
                    vista.btn_guardar_elementos_der.enable();
                }/* else {
                 vista.btn_eliminar_elementos_der.disable();
                 vista.btn_guardar_elementos_der.disable();
                 }*/

                if (vista.ChConsolidar.getValue() || vista.sm_inversiones.getSelected().data.idestadoaprobacion == 1 || record.data.pintar == 1) {
                    vista.btn_eliminar_elementos_der.disable();
                    vista.btn_guardar_elementos_der.disable();
                }
            }
            /* rowdeselect: function(g, r, e) {
             vista.btn_eliminar_elementos_der.disable();
             vista.btn_guardar_elementos_der.disable();
             }*/
        });

        vista.grid_gestionar_elementos_der.getSelectionModel().on({
            /* rowselect: function(g, r, record) {
             if (record.data.pintar == 0) {
             vista.btn_eliminar_elementos_der.enable();
             vista.btn_guardar_elementos_der.enable();
             } else {
             vista.btn_eliminar_elementos_der.disable();
             vista.btn_guardar_elementos_der.disable();
             }
             },*/
            rowdeselect: function(g, r, e) {
                vista.btn_eliminar_elementos_der.disable();
                vista.btn_guardar_elementos_der.disable();
            }
        });



        vista.grid_gestionar_elementos.getSelectionModel().on({
            rowdeselect: function(g, r, e) {
                vista.btn_gest_docs.disable();
            }
        });
        //console.log(vista.sm_inversiones.getSelected().data);
        //bloq=1;
        vista.btnModificarinversion.on({
            click: function() {
                addmod = false;
                var VentanaInversiones = new Utilidades.Cmp.controllerVentanaInversiones({
                    addmod: addmod,
                    idioma: vista.idioma,
                    objci: objci,
                    vistaInversiones: vista.sm_inversiones,
                    gridInversiones: vista.grid_gestionar_inversiones,
                    storeInversiones: modelo.store_gestionar_inversiones,
                    ventanaProvincia: vista.ventanaDpt,
                    comboEjercicio: vista.cmbEjercicio,
                    panelComponentes: vista.pgestionar_componentes,
                    idOrganismo: idorganismo,
                    gridIsSelected: gridIsSelected

                });

                VentanaInversiones.init();
                VentanaInversiones.getVistaVentanaInversiones().levantarVentanaInversiones(addmod, boolAceptar, bloq);

            }
        });





        vista.btn_eliminar_elementos_der.on({
            click: function() {
                mostrarMensaje(2, perfil.etiquetas.tlDelVal, function(btnPress) {
                    if (btnPress === 'ok') {
                        var valores = vista.sm_elementos_der.getSelections();
                        var arreglo = [];
                        for (i = 0; i < valores.length; i++) {
                            arreglo[i] = valores[i].data.idelementovalor;
                        }
                        if (vista.sm_inversiones.getSelected()) {
                            var selest = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
                        }

                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarValor",
                            params: {
                                idelementovalor: Ext.encode(arreglo),
                                idinversion: selest

                            },
                            callback: function(options, success, response) {
                                mostrarMensaje(1, perfil.etiquetas.tlDelSatisValor);
                                vista.grid_gestionar_elementos_der.getStore().reload({
                                    params: {
                                        start: 0,
                                        limit: 20,
                                        idelemento: vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion,
                                        idetapainversion: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa,
                                        denominacionetapa: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.denominacion
                                    }
                                });
                            }
                        });
                    }
                });
            }

        });
        /*vista.btnAdicionarinversion.on({
         click: function() {
         addmod = true;
         Ext.getCmp('btnaplicar').hide();
         levantarBtnadd(addmod);
         }
         });*/

        vista.btnAdicionarinversion.on({
            click: function() {

                addmod = true;
                var VentanaInversiones = new Utilidades.Cmp.controllerVentanaInversiones({
                    addmod: addmod,
                    idioma: vista.idioma,
                    objci: objci,
                    vistaInversiones: vista.sm_inversiones,
                    gridInversiones: vista.grid_gestionar_inversiones,
                    storeInversiones: modelo.store_gestionar_inversiones,
                    ventanaProvincia: vista.ventanaDpt,
                    comboEjercicio: vista.cmbEjercicio,
                    panelComponentes: vista.pgestionar_componentes,
                    idOrganismo: idorganismo,
                    nomencladoresInversiones: nomencladoresInversiones
                });
                //console.info(VentanaInversiones);
                VentanaInversiones.init();
                VentanaInversiones.getVistaVentanaInversiones().levantarVentanaInversiones(addmod, true);


            }
        });



        vista.cmp_CambioEstado.on({
            select: function() {
                if (vista.sm_componentes.getSelected()) {
                    var cmpsel = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa;
                    var idetapa = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idcomponente;
                    var idestado = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idestadosft;
                    var orden = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.orden;
                    var idestadoflujotrabajo = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idestadoflujotrabajo;
                    Ext.Ajax.request({
                        url: 'cambiarEstado',
                        waitMsg: "Cargando...",
                        params: {
                            idcomponenete: cmpsel,
                            idetapa: idetapa,
                            estado: vista.cmp_CambioEstado.getValue(),
                            idcumplimiento: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idcumplimientoinversion,
                            idestado: idestado,
                            orden: orden,
                            identidad: idorganismo,
                            idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion,
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idestadoflujotrabajo: idestadoflujotrabajo
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgM == 22) {
                                mostrarMensaje(1, perfil.etiquetas.tlCambio);
                            } else if (responseData.codMsgM == 1) {
                                mostrarMensaje(1, perfil.etiquetas.tlEstadoChang);
                                recargacom(modelo.store_gestionar_componentes, 5);
                                vista.cmp_CambioEstado.reset();
                            }
                        }
                    });
                }

            }

        });


        vista.btn_adicionar_elementos_der.on('click', function() {
            Fila = Ext.data.Record.create({
                name: 'valor',
                type: 'numeric'
            }, {
                name: 'moneda',
                type: 'string'
            }, {
                name: 'pintar',
                type: 'numeric'
            }, {
                name: 'idmonedaentidad',
                type: 'numeric'
            });
            var p = new Fila({
                fecha: null,
                nivel: 0,
                moneda: '',
                pintar: 0,
                idmonedaentidad: ''
            });
            modelo.store_gestionar_elementos_der.add(p);
        });

        _this.cosntPrv = new Array();
        vista.ventanaDpt.on('dameseleccion', function(obj, data) {
            _this.iddpt = data.get('iddpt');

            _this.ventanaDpt.hide();
            if (vista.smConstructores.getSelected()) {
                var idconstructor = vista.smConstructores.getSelected().data.idconstructor;
                var constructor = vista.smConstructores.getSelected().data.denominacion;
                modelo.stConstructoresEtapa.remove(vista.smConstructores.getSelected());
            }


            Fila = Ext.data.Record.create({
                name: 'denominacion',
                type: 'string'
            }, {
                name: 'denomdpt',
                type: 'string'
            }, {
                name: 'iddpt',
                type: 'numeric'
            }, {
                name: 'idconstructor',
                type: 'numeric'
            }, {
                name: 'idetapinverconsprov',
                type: 'numeric'
            }, {
                name: 'idetapainversion',
                type: 'numeric'
            });
            if (vista.sm_componentes.getSelected()) {
                selectCmps = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa;
            } else {
                selectCmps = 0;
            }
            var p = new Fila({
                idetapainversion: selectCmps,
                denomdpt: data.get('denominacion'),
                iddpt: data.get('iddpt'),
                idconstructor: idconstructor,
                denominacion: constructor
            });
            _this.cosntPrv.push(p.data);
            modelo.stConstructoresEtapa.add(p);
            _this.ventanaDpt.hide();
        });


        vista.btn_limpiar_inversiones.on('click', function() {
            vista.filtrosinv.clearFilters();
            vista.grid_gestionar_inversiones.getStore().reload();
        });
        vista.btn_limpiar_componente.on('click', function() {
            vista.filtroscomp.clearFilters();
            vista.grid_gestionar_componentes.getStore().reload();
        });
        vista.btn_limpiar_elemento.on('click', function() {
            vista.filtroselemt.clearFilters();
            vista.grid_gestionar_elementos.getStore().reload();
        });
        vista.btnLimpiarE.on('click', function() {
            vista.filtrosequipos.clearFilters();
            recarga(modelo.store_gequipos, 20);
        });
        vista.btnLimpiar.on('click', function() {
            vista.filtrosaddEquipos.clearFilters();
        });

        vista.btn_aceptar_addEquipos.on({
            click: function() {
                adicionarequipos();
            }
        });
        vista.btnEliminarinversion.on('click', function() {
            mostrarMensaje(2, perfil.etiquetas.tlDel, eliminarInversion);
        });

        //Ventana de Gestionar Documentos
        vista.btn_gest_docs.on('click', function() {
            if (vista.sm_elementos.getSelected()) {
                idcontenido = vista.sm_elementos.getSelected().data.idcontenido;
                iddoc = vista.sm_elementos.getSelected().data.iddocumentos;
                cod_inv = vista.sm_inversiones.getSelected().data.codigo;

                if (iddoc != null) {
                    if (idcontenido != null) {
                        vista.mymask.show();
                        _this.levantarGestorDocumentalElemento(idcontenido);
                        vista.mymask.hide();
                    } else {
                        vista.mymask.show();
                        name = cod_inv + "_" + denoCmp + "_" + denoElem;
                        Ext.Ajax.request({
                            url: 'verEspacioTrabajo',
                            params: {
                                idelemento: vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion,
                                identidad: idorganismo,
                                iddoc: iddoc,
                                name: name
                            },
                            callback: function(options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                if (responseData.cdgMsg == 3) {
                                    mostrarMensaje(3, "Error al intentar abrir el espacio de trabajo.");
                                    vista.mymask.hide();
                                } else {
                                    if (responseData.espacio_elemento == '') {
                                        mostrarMensaje(3, "Debe configurar el espacio del documento asociado al elemento.");
                                        vista.mymask.hide();
                                    } else {
                                        idcontenido = responseData.espacio_elemento;
                                        _this.levantarGestorDocumentalElemento(idcontenido);
                                        vista.mymask.hide();

                                    }
                                }
                            }
                        });

                    }
                } else {
                    mostrarMensaje(3, "Debe asociar un tipo de documento al elemento.");
                }
                /*vista.grid_gestionar_documentos.getStore().load({
                 params: {
                 start: 0,
                 limit: 20,
                 idelemento: vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion
                 }
                 });*/
            }
            //vista.window_gestionar_docs.show();
        });


        vista.btn_factibilidad.on('click', function() {

            vista.grid_Tiposdocumentos_factibilidad.getStore().load({
                params: {
                    //start: 0,
                    //limit: 20,
                    idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion
                }
            });

            vista.window_Tiposdocumentos_factibilidad.show();
        });

        vista.btn_cancelar_docFactib.on('click', function() {
            vista.window_Tiposdocumentos_factibilidad.hide();
        });


        vista.btnAdicionarDocFactibilidad.on('click', function() {
            vista.mymask.show();
            var contenido = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idcontenido;
            if (contenido == null || contenido == "") {

                Ext.Ajax.request({
                    url: 'buscarEspacioFactibilidad',
                    //waitMsg: "Cargando...",
                    params: {
                        idtipoinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idtipoinversion,
                        codigoinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.codigo,
                        idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion,
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (response.responseText == '') {
                            console.info('vacio');
                        }
                        if (responseData.existe == 1) {
                            _this.levantarGestorDocumental(responseData.espacio_inversion);

                        } else {

                            mostrarMensaje(3, "Debe asociar el tipo de documento Factibilidad en la Clasificaci\xF3n de las inversiones.");
                        }
                    }
                });

            } else {
                _this.levantarGestorDocumental(contenido);
            }
        });


        vista.btnEliminarDocFactibilidad.on('click', function() {

            mostrarMensaje(2, '¿Está seguro que quiere eliminar el documento seleccionado?', function(btnPress) {
                if (btnPress === 'ok') {
                    _this.mymask.show();
                    Ext.Ajax.request({
                        url: 'eliminarDocFactibilidad',
                        params: {
                            idinversionestfact: vista.grid_Tiposdocumentos_factibilidad.getSelectionModel().getSelected().data.idinversionestfact,
                            idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion,
                            iddocumento: vista.grid_Tiposdocumentos_factibilidad.getSelectionModel().getSelected().data.idcontenido,
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codgMensaje == 1) {

                                mostrarMensaje(2, responseData.mensaje);
                                vista.grid_Tiposdocumentos_factibilidad.getStore().load({
                                    params: {
                                        idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion
                                    },
                                    callback: function(options, success, response) {
                                        _this.mymask.hide();
                                    }
                                });

                            } else {
                                mostrarMensaje(3, responseData.mensaje);
                            }
                        }
                    });
                }
            })


        });

        vista.btnVigenteDocfactibilidad.on('click', function() {
            _this.mymask.show();
            Ext.Ajax.request({
                url: 'setVigenteDocFactibilidad',
                params: {
                    idinversionestfact: vista.grid_Tiposdocumentos_factibilidad.getSelectionModel().getSelected().data.idinversionestfact,
                    idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion,
                    //iddocumento: vista.grid_Tiposdocumentos_factibilidad.getSelectionModel().getSelected().data.idcontenido,
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codgMensaje == 1) {

                        mostrarMensaje(2, responseData.mensaje);
                        vista.grid_Tiposdocumentos_factibilidad.getStore().load({
                            params: {
                                idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion
                            },
                            callback: function(options, success, response) {
                                _this.mymask.hide();
                            }
                        });

                    } else {
                        mostrarMensaje(3, responseData.mensaje);
                    }
                }
            });
        });



        /*vista.btn_verEspacio.on('click', function() {
         if (vista.sm_gestionar_documentos.getSelected()) {
         iddoc = vista.grid_gestionar_documentos.getSelectionModel().getSelected().data.id;
         denominacion = vista.grid_gestionar_documentos.getSelectionModel().getSelected().data.denominacion;
         } else {
         iddoc = 0;
         denominacion = "";
         }
         vista.mymask.show();
         name = denoInv + "_" + denoCmp + "_" + denoElem;
         Ext.Ajax.request({
         url: 'verEspacioTrabajo',
         waitMsg: "Cargando...",
         params: {
         idelemento: vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion,
         identidad: idorganismo,
         accion: 'asociar',
         idcontenido: iddoc,
         denominacion: denominacion,
         name: name
         },
         callback: function(options, success, response) {
         responseData = Ext.decode(response.responseText);
         if (responseData.contenido == 25) {
         vista.mymask.hide();
         mostrarMensaje(1, "El espacio de trabajo del elemento seleccionado no se encuentra disponible.");
         } else {
         var objetoContenidoEspacio = new personalizacionalfresco.gestionarchivos.gestionContenido({splash: false});
         objetoContenidoEspacio.inicializarComponente(true);
         objetoContenidoEspacio.actualizarAreaPrincipal(false, responseData.contenido);
         
         var aux = true;
         
         objetoContenidoEspacio.on("obtenerContenidoOK", function(eventName) {
         if (aux) {
         var contenidos = new Ext.Panel({
         items: [objetoContenidoEspacio.barra2PC, objetoContenidoEspacio.panelCentral]
         });
         _this.btn_cancelar = new Ext.Button({
         text: "Cerrar",
         iconCls: 'cancelar',
         tooltip: idioma.toolTipCancelarinversiones,
         listeners: {
         click: function() {
         _this.window_documentos.destroy();
         }
         }
         });
         Ext.getCmp('btnAdicionarEspacioTrabajoMA').hide();
         _this.window_documentos = new Ext.Window({
         title: "Documentos",
         closable: true,
         border: false,
         layout: 'fit',
         width: 800,
         height: 450,
         closeAction: 'destroy',
         autoscroll: true,
         items: [contenidos],
         buttons: [_this.btn_cancelar],
         listeners: {
         hide: function() {
         objetoContenidoEspacio.destroy();
         _this.window_documentos.destroy();
         }
         }
         });
         vista.mymask.hide();
         _this.window_documentos.show();
         aux = false;
         }
         });
         
         }
         }
         });
         });*/

        vista.btn_cancelar_ver_documento.on('click', function() {
            vista.fm_ver_documentos.getForm().reset();
            vista.window_ver_docs.hide();
        });
        //accion del boton cancelar de la ventana Gestionar Documentos
        vista.btn_cancelar_gestionar.on('click', function() {
            vista.window_gestionar_docs.hide();
        });
        modelo.store_gequipos.on('beforeload', function(st, record, ob) {
            st.baseParams.idetapainversion = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa;
            st.baseParams.idequipoplan = vista.CmbEntidadModelo.getValue();
        });
        modelo.store_gestionar_elementos.on('beforeload', function(st, record, ob) {
            vista.btn_eliminar_elementos_der.disable();
            vista.btn_guardar_elementos_der.disable();
            vista.btn_adicionar_elementos_der.disable();

        });
        modelo.stModelo.on({
            load: function(t, n, e) {
                if (t.reader.jsonData.data[0] == null) {
                    vista.btnAdicionarequipo.disable();
                } else {
                    vista.btnAdicionarequipo.enable();
                    if (t.reader.jsonData.data[0].idequipoplan != null)
                        vista.CmbEntidadModelo.setValue(t.reader.jsonData.data[0].idequipoplan);
                }
            }
        });
        vista.CmbEntidadModelo.on({
            select: function(cmb, record, index) {
                recarga(modelo.store_gequipos, 20);
                vista.btnEliminarequipo.disable();
            }
        });
        vista.btn_equipos.on('click', function() {
            modelo.stModelo.load({
                params: {
                    identidad: idorganismo,
                    idequipoplan: vista.CmbEntidadModelo.getValue()
                },
                callback: function(options, success, response) {
                    recarga(modelo.store_gequipos, 20);
                    modelo.stAdquisicion.load();
                    modelo.stComprar.load();
                }
            });
            vista.window_equipos.show();
        });

        vista.btn_constructores.on('click', function() {
            _this.mymask.show();
            modelo.stConstructoresEtapa.load({
                params: {
                    start: 0,
                    limit: 20
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    vista.wConstructores.show();
                }
            });
            modelo.stConstructores.reload();
        });

        //------------------ Niveles de actividad -------------------
        /*vista.btn_nivelactividad.on('click', function () {
         vista.window_nivelesactividad.show();
         });
         
         vista.window_nivelesactividad.on('beforeshow', function () {
         modelo.store_gestionar_nivelesactividad.on('beforeload ', function(st, opt) {
         modelo.store_gestionar_nivelesactividad.baseParams.identidad = idorganismo;
         modelo.store_gestionar_nivelesactividad.baseParams.idetapa = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa;
         modelo.store_gestionar_nivelesactividad.baseParams.idejercicio = vista.cmbEjercicio.getValue();
         });
         modelo.store_gestionar_nivelesactividad.load();
         });*/

        //-------------------------------------

        modelo.stConstructoresEtapa.on({
            beforeload: function(st, opt) {
                _this.cosntPrv = [];
                vista.btnElimconstructor.disable();
                if (vista.sm_componentes.getSelected()) {
                    st.baseParams.idetapainversion = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa;
                }
            }
        });

        vista.btnCancelarConstructor.on({
            click: function() {
                vista.wConstructores.hide();
            }
        });

        vista.btnCancelarImportar.on({
            click: function() {
                vista.winImp.hide();
                vista.fpbuscar.getForm().reset();
            }
        });
        vista.btnImportar.on({
            click: function() {
                vista.winImp.show();

            }
        });
        _this.maskcierre = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Realizando cierre...'
        });
        vista.btnCierreInversion.on({
            click: function() {
                _this.maskcierre.show();
                Ext.Ajax.request({
                    url: 'cierreinversion',
                    params: {
                        accion: 'cierre',
                        elemento: 'inversion'
                    },
                    callback: function(options, success, response)
                    {
                        responseData = Ext.decode(response.responseText);
                        _this.maskcierre.hide();
                        if (responseData == 1) {
                            mostrarMensaje(1, "El cierre se ha efectuado correctamente.");
                        }
                        mostrarMensaje(1, "El cierre no se ha efectuado.");

                    }
                });

            }
        });
        tiposexcel = [
            ['3', 'Inversiones'],
            ['2', 'Demanda de equipos'],
            ['1', 'Constructores'],
            ['4', 'Datos']
        ]
        tiposexcelInversion = [
            ['1', 'Inversiones'],
            ['2', 'Desgloses'],
            ['3', 'Desagregaci&oacute;n'],
        ]

        modelo.simstTipoexcel.loadData(tiposexcelInversion);

        vista.btnAceptarImportar.on('click', function() {
            fnimportarInversiones();
        });

        vista.btnAceptarConstructor.on({
            click: function() {
                _this.mymask.show();

                array = new Array();
                modelo.stConstructoresEtapa.each(function(record) {//console.log(record.data);
                    // if (record.data.idconstructor != '' && record.data.iddpt != '') {
                    array.push(record.data);
                    // }
                });

                Ext.Ajax.request({
                    url: 'adicionarConstrucutorEtapa',
                    params: {
                        /*   datosConstructores: (_this.cosntPrv.length != 0) ? Ext.encode(_this.cosntPrv) :
                         modelo.stConstructoresEtapa.getModifiedRecords().data*/
                        idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion,
                        datosConstructores: Ext.encode(_this.cosntPrv)
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData == true) {
                            mostrarMensaje(1, "Se adicionaron los construcutores del componente satisfactoriamente.");
                            modelo.stConstructoresEtapa.reload({
                                params: {
                                    start: 0,
                                    limit: 20,
                                    idetapainversion: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa
                                },
                                callback: function() {
                                    _this.mymask.hide();
                                    vista.wConstructores.hide();
                                }
                            });
                        }
                    }
                });
            }
        });

        vista.btnAddconstructor.on('click', function() {
            Fila = Ext.data.Record.create({
                name: 'denominacion',
                type: 'string'
            }, {
                name: 'denomdpt',
                type: 'string'
            }, {
                name: 'iddpt',
                type: 'numeric'
            }, {
                name: 'idconstructor',
                type: 'numeric'
            }, {
                name: 'idetapinverconsprov',
                type: 'numeric'
            }, {
                name: 'idetapainversion',
                type: 'numeric'
            });
            var p = new Fila({
                denominacion: '',
                denomdpt: '',
                iddpt: '',
                idconstructor: ''
            });
            modelo.stConstructoresEtapa.add(p);
        });

        vista.smConstructores.on({
            rowselect: function() {
                vista.btnElimconstructor.enable();
            },
            rowdeselect: function(th, row, rec) {
                if (th.getCount() == 0)
                    vista.btnElimconstructor.disable();
            }
        });

        vista.btnElimconstructor.on({
            click: function() {
                records = vista.smConstructores.getSelections();
                if (records.length > 1)
                    mensajeDespuesDeEliminado = "Se eliminaron los construcutores del componente satisfactoriamente.";
                else
                    mensajeDespuesDeEliminado = "Se eliminó el constructor del componente satisfactoriamente.";
                //console.info(records1.length);
                mostrarMensaje(2, '¿Está seguro que quiere eliminar el/los constructor/es seleccionado/s?', function(btnPress) {
                    if (btnPress === 'ok') {
                        idetapainverconsprov = new Array();
                        //records = vista.smConstructores.getSelections();
                        for (var i = 0; i < records.length; i++) {
                            idetapainverconsprov.push(records[i].data.idetapinverconsprov);
                        }
                        _this.mymask.show();
                        Ext.Ajax.request({
                            url: 'eliminarConstrucutorEtapa',
                            params: {
                                idetapainverconsprov: Ext.encode(idetapainverconsprov),
                                idetapainversion: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa,
                                idejercicio: vista.cmbEjercicio.getValue(),
                                idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion,
                                identidad: idorganismo,
                                aaejercicio: (parseInt(vista.cmbEjercicio.getRawValue()) - 2),
                                aejercicio: (parseInt(vista.cmbEjercicio.getRawValue()) - 1),
                                pejercicio: (parseInt(vista.cmbEjercicio.getRawValue()) + 1)
                            },
                            callback: function(options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                if (responseData == true) {
                                    //mostrarMensaje(1, "Se eliminaron los construcutores del componente satisfactoriamente.");
                                    mostrarMensaje(1, mensajeDespuesDeEliminado);
                                    modelo.stConstructoresEtapa.reload({
                                        params: {
                                            start: 0,
                                            limit: 20,
                                            idetapainversion: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa
                                        },
                                        callback: function() {
                                            _this.mymask.hide();
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                )
            }
        });

        modelo.store_addEquipos.on('beforeload', function(st, record, ob) {
            st.baseParams.idetapainversion = vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa;
            st.baseParams.idejercicio = vista.cmbEjercicio.getValue(),
                    st.baseParams.identidad = idorganismo,
                    st.baseParams.idequipoplan = vista.CmbEntidadModelo.getValue();
        });
        vista.btnAdicionarequipo.on('click', function() {
            vista.window_addEquipos.show();
            recarga(modelo.store_addEquipos, 20);
        });
        vista.btn_cancelar_addEquipos.on('click', function() {
            vista.window_addEquipos.hide();
        });
        vista.btn_cancelar_equipo.on('click', function() {
            vista.window_equipos.hide();
            modelo.store_gequipos.removeAll();
            vista.CmbEntidadModelo.setValue('');

        });
//-----END EQUIPOS-----

        //accion del boton para ver la ventana Gest Parametros
        vista.btn_gest_para.on('click', function() {
            _this.mymask.show();
            _this.cargarVentanaParamDinamicos();
        });

        _this.levantarGestorDocumental = function(espacio) {
            var objetoContenidoEspacio = new personalizacionalfresco.gestionarchivos.gestionContenido({splash: false});
            objetoContenidoEspacio.inicializarComponente(true, espacio);
            //objetoContenidoEspacio.actualizarAreaPrincipal(false, espacio);
            //objetoContenidoEspacio.winContenido.show();

            _this.espacio = new Ext.Panel({
                items: [objetoContenidoEspacio.barra2PC, objetoContenidoEspacio.panelCentral]
            });

            _this.btn_cancelar_Doc = new Ext.Button({
                text: "Cerrar",
                iconCls: 'cancelar',
                tooltip: idioma.toolTipCancelarinversiones,
                listeners: {
                    click: function() {
                        _this.window_documentos_factibilidad.destroy();
                    }
                }
            });

            _this.btn_aceptar_Doc = new Ext.Button({
                iconCls: 'aceptar',
                text: 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana',
                handler: function() {
                    if (typeof (objetoContenidoEspacio.panelCentral.items.items[1].getSelectionModel().getSelected()) != 'undefined') {
                        _this.iddocumento = objetoContenidoEspacio.panelCentral.items.items[1].getSelectionModel().getSelected().id;
                        _this.name_documento = objetoContenidoEspacio.panelCentral.items.items[1].getSelectionModel().getSelected().json.name;
                        _this.GuardarDocumentoFactibilidad(_this.iddocumento, _this.name_documento);
                        _this.window_documentos_factibilidad.destroy();
                    } else {
                        mostrarMensaje(3, 'Debe Seleccionar antes el documento para poderlo adicionar');
                    }

                }
            });

            _this.window_documentos_factibilidad = new Ext.Window({
                title: "Documentos",
                closable: true,
                border: false,
                layout: 'fit',
                width: 800,
                height: 450,
                modal: true,
                closeAction: 'destroy',
                autoscroll: true,
                items: [_this.espacio],
                buttons: [_this.btn_cancelar_Doc, _this.btn_aceptar_Doc],
                listeners: {
                    close: function() {
                        objetoContenidoEspacio.destroy();
                        _this.window_documentos_factibilidad.destroy();
                    }
                }
            });
            vista.mymask.hide();
            _this.window_documentos_factibilidad.show();
        }

        _this.levantarGestorDocumentalElemento = function(espacio) {
            var objetoContenidoEspacio = new personalizacionalfresco.gestionarchivos.gestionContenido({splash: false});
            objetoContenidoEspacio.inicializarComponente(true);
            objetoContenidoEspacio.actualizarAreaPrincipal(false, espacio);

            _this.espacio = new Ext.Panel({
                items: [objetoContenidoEspacio.barra2PC, objetoContenidoEspacio.panelCentral]
            });


            _this.window_documentos_factibilidad = new Ext.Window({
                title: "Documentos",
                closable: true,
                border: false,
                layout: 'fit',
                width: 800,
                modal: true,
                height: 450,
                closeAction: 'destroy',
                autoscroll: true,
                items: [_this.espacio],
                listeners: {
                    close: function() {
                        objetoContenidoEspacio.destroy();
                        _this.window_documentos_factibilidad.destroy();
                    }
                }
            });
            //vista.mymask.hide();
            _this.window_documentos_factibilidad.show();
        }

        _this.cargarVentanaParamDinamicos = function() {
            Ext.Ajax.request({
                url: 'cargarParamentros',
                params: {
                    idelemento: vista.sm_elementos.getSelected().data.idelemento
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    _this.reconfigurarGrid(responseData);
                }
            });
        };
        _this.fnAceptarParam = function(v, cmb, g, c) {
            datosColum = new Array();
            records = _this.grid_gestionar_parametros.getStore().getModifiedRecords();
            _this.grid_gestionar_parametros.getStore().commitChanges();
            for (var i = 0; i < records.length; i++) {
                datosColum.push(records[i].data);
            }
            Ext.Ajax.request({
                url: 'guardarDatosDinamicos',
                params: {
                    datos: Ext.encode(datosColum),
                    idelemento: vista.sm_elementos.getSelected().data.idelemento,
                    idetapaelementoinversion: vista.sm_elementos.getSelected().data.idetapaelementoinversion,
                    transicion: 1
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    _this.mymask.show();
                    Ext.Ajax.request({
                        url: 'guardarDatosDinamicos',
                        params: {
                            datos: Ext.encode(datosColum),
                            idelemento: vista.sm_elementos.getSelected().data.idelemento,
                            transicion: 2,
                            idelemtipomodelovalor: responseData
                        },
                        callback: function(options, success, response) {
                            _this.window_gestionar_parametros.hide();
                            _this.mymask.hide();
                        }
                    });
                }
            });
        };

        _this.fnAdicionarParamTbar = function() {
            var record = new Ext.data.Record({
                idelementotipomodelo: ''
            });
            _this.grid_gestionar_parametros.getStore().add(record);
        };

        _this.fnEliminarParamTbar = function() {
            _this.mymask.show();
            var parametrosDinam = vista.smParamsdinamico.getSelections();
            var idelementotipomodelovalor = [];
            for (i = 0; i < parametrosDinam.length; i++) {
                idelementotipomodelovalor[i] = parametrosDinam[i].data.mod_planificacionmeta_dat_123_idelementotipomodelovalor;
            }
            Ext.Ajax.request({
                url: 'eliminarValortipomodelo',
                params: {
                    idelementotipomodelovalor: Ext.encode(idelementotipomodelovalor)
                },
                callback: function(options, success, response) {
                    modelo.store_gestionar_parametros.reload({
                        callback: function() {
                            _this.mymask.hide();
                        }
                    });
                    mostrarMensaje(1, "Los datos dinamicos se han eliminado satisfactoriamente.");
                }
            });
        };

        _this.GuardarDocumentoFactibilidad = function(iddoc, namedoc) {
            var idinversion = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
            _this.mymask.show();
            Ext.Ajax.request({
                url: 'guardarDocumentoFactibilidad',
                params: {
                    iddocumento: iddoc,
                    nemedocumento: namedoc,
                    idinversion: idinversion
                },
                callback: function(options, success, response) {

                    responseData = Ext.decode(response.responseText);
                    if (responseData.codgMensaje == 1) {
                        vista.grid_Tiposdocumentos_factibilidad.getStore().load({
                            params: {
                                //start: 0,
                                //limit: 10,
                                idinversion: idinversion
                            }
                        });
                        mostrarMensaje(1, responseData.mensaje);
                    } else if (responseData.codgMensaje == 2)
                        mostrarMensaje(3, responseData.mensaje);
                    else
                        mostrarMensaje(3, responseData.mensaje);
                    _this.mymask.hide();
                }
            });
        }

        vista.smParamsdinamico.on({
            rowselect: function() {
                Ext.getCmp('idbtnEliminarParamTbar').enable();
            },
            rowdeselect: function() {
                Ext.getCmp('idbtnEliminarParamTbar').disable();
            }
        });

        //accion del boton Cancelar de la ventana Ver Documento
        vista.btn_cancelar_ver_documento.on('click', function() {
            vista.window_ver_docs.hide();
        });
        //accion del boton Aceptar de la ventana Ver Documento
        vista.btn_aceptar_ver_documento.on('click', function() {
            vista.window_ver_docs.hide();
        });
        //accion del boton Ver Presupuesto
        Ext.getCmp('btn_presupuesto_inversion').on('click', function() {
            verPresupuesto();
        });
        //accion del boton Ver Presupuesto
        Ext.getCmp('btn_ver_Detalles').on('click', function() {
            ReportesContratos();
        });
        //accion del boton Cerrar de la ventana Ver Presupuesto
        vista.btn_cerrar_ver_documento.on('click', function() {
            vista.winVerPresupuesto.hide();
        });
        vista.btn_asoc_documento.on({
            click: function() {
                gestionarDoc(0);
            }
        });
        //accion del boton Ver Financiamiento
        Ext.getCmp('btn_financiamiento_inversion').on('click', function() {
            verFinanciamiento();
        });
        vista.btn_georefe_inversion.on({
            click: function() {
                var cmpGISHeight = 700;
                // Definiendo la altura de la ventana del componente Representacion
                if (window.innerHeight) {
                    cmpGISHeight = window.innerHeight;
                } else if (window.frameElement && window.frameElement.clientHeight) {
                    cmpGISHeight = window.frameElement.clientHeight;
                } else if (window.screen && window.screen.availHeight) {
                    cmpGISHeight = window.screen.availHeight - 180;
                } else if (window.screen && window.screen.height) {
                    cmpGISHeight = window.screen.height - 180;
                }
                var cmpGIS = new GIS({
                    project: 'mep',
                    ventana: {
                        width: '100%',
                        border: false,
                        height: 600,
                        minWidth: 800,
                        minHeight: 480,
                        closable: true,
                        maximizable: true
                    }
                });
                var dotaInversion = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data;
                cmpGIS.show();
                //Ajustar la ventana al tamanno del iframe contenedor

                if (cmpGIS.window.maximize)
                    cmpGIS.window.maximize();
                cmpGIS.on('iframeLoaded', function() {
                    if (cmpGIS.AjaxPlugins) {
                        cmpGIS.AjaxPlugins.GeorreferenciarInversion.show(dotaInversion);
                    }
                });
            }
        });
        //accion del boton Cerrar de la ventana Ver Financiamiento
        vista.btn_cerrar_ver_financiamiento.on('click', function() {
            vista.winVerFinanciamiento.hide();
        });




        vista.btn_georefe_inversion.on('click', function() {
        });

        Ext.getCmp('idaprobacion').on('click', function() {
            fngestionarApro(true);
        });

        Ext.getCmp('iddesaprobar').on('click', function() {
            fngestionarApro(false);
        });

        modelo.store_gestionar_componentes.on('beforeload ', function(st, opt) {
            modelo.store_gestionar_componentes.baseParams.identidad = idorganismo;
            modelo.store_gestionar_componentes.baseParams.idinversion = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
            modelo.store_gestionar_componentes.baseParams.idejercicio = vista.cmbEjercicio.getValue();
        });

        modelo.stCambioEstado.on('beforeload ', function(st, opt) {
            idetapa: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa;
            orden:  orden
        });

        Ext.getCmp('idActInversion').on('click', function() {
            fngestionarAct(true);
        });
        Ext.getCmp('btn_desactivar_inversion').on('click', function() {
            fngestionarAct(false);
        });
        
        Ext.getCmp('btn_bloquear_inversion').on('click', function() {
            fnbloqdesbloquearInv(true);
        });
        Ext.getCmp('btn_desbloquear_inversion').on('click', function() {
            fnbloqdesbloquearInv(false);
        });

        vista.grid_gestionar_elementos_der.on({
            afteredit: function(obj) {
                if (obj.record.data.pintar == 1) {
                    obj.cancel = true;
                }
            },
            beforeedit: function(obj) {
                if (obj.record.data.pintar == 1) {
                    obj.cancel = true;
                }
            }
        });

        vista.btn_guardar_elementos_der.on('click', function() {
            var correct = false;
            if (vista.sm_elementos.getSelected()) {
                var sel = vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion;
            }
            if (vista.sm_inversiones.getSelected()) {
                var selest = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
            }
            array = new Array();
            records = modelo.store_gestionar_elementos_der.getModifiedRecords();
            modelo.store_gestionar_elementos_der.commitChanges();
            for (var i = 0; i < records.length; i++) {
                if (records[i].data.pintar == 0)
                    array.push(records[i].data);
            }
            for (var i = 0; i < array.length; i++) {
                if (array[i].moneda != "") {
                    correct = true;
                    break;
                }
            }
            //monedaE = validarMoneda(modelo.store_gestionar_elementos_der, false);
            //console.info(modelo.store_gestionar_elementos_der);
            monedaE = validarMonedaValor(modelo.store_gestionar_elementos_der, false);

            if (!monedaE) {
                mostrarMensaje(1, 'La moneda que desea adicionar ya existe.');
            } else if (!correct) {
                vista.grid_gestionar_elementos_der.getStore().reload({
                    params: {
                        start: 0,
                        limit: 20,
                        idelemento: vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion
                    }
                });
            } else {
                Ext.Ajax.request({
                    url: 'guardarValor',
                    waitMsg: "Cargando...",
                    params: {
                        idelemento: sel ? sel : 0,
                        idinversion: selest,
                        valores: Ext.encode(array)
                    },
                    callback: function(options, success, response) {

                        mostrarMensaje(1, 'Se han guardado los valores satisfactoriamente.');
                        vista.grid_gestionar_elementos_der.getStore().reload({
                            params: {
                                start: 0,
                                limit: 20,
                                idelemento: vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion,
                                idetapainversion: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa,
                                denominacionetapa: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.denominacion
                            }
                        });

                    }
                });
            }

        });
        Ext.getCmp('idfiltroent').on({
            specialkey: function(t, e) {
                if (e.getKey() == '13') {
                    arbol = vista.treePanelinversion;
                    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
                        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
                            arbol.getSelectionModel().getSelectedNode().reload({
                                params: {
                                    valor: Ext.getCmp('idfiltroent').getValue()
                                }
                            });
                        }
                    } else
                        arbol.root.reload({
                            params: {
                                valor: Ext.getCmp('idfiltroent').getValue()
                            }
                        });
                }
            }
        });
        function fngestionarAct(activar) {
            var aux = vista.sm_inversiones.getSelections();
            mensaje = activar ? ("La inversión ha sido activada satisfactoriamente.") : ("La inversión ha sido desactivada satisfactoriamente.");
            var arreglo = [];
            for (i = 0; i < aux.length; i++) {
                arreglo[i] = aux[i].data.idinversion;
            }
            Ext.Ajax.request({
                url: 'gestionarActivacion',
                timeout: 7200000,
                params: {
                    idinversion: Ext.encode(arreglo),
                    identidad: idorganismo,
                    idejercicio: vista.cmbEjercicio.getValue(),
                    activar: activar
                },
                method: 'POST',
                callback: function(options, success, response) {
                    mostrarMensaje(1, mensaje);
                    vista.grid_gestionar_inversiones.getStore().reload();
                }
            });
        }
        
        function fnbloqdesbloquearInv(activar) {
            var aux = vista.sm_inversiones.getSelections();
            mensaje = activar ? ("La inversión ha sido bloqueada satisfactoriamente.") : ("La inversión ha sido desbloqueada satisfactoriamente.");
            var arreglo = [];
            for (i = 0; i < aux.length; i++) {
                arreglo[i] = aux[i].data.idinversion;
            }
            Ext.Ajax.request({
                url: 'gestionarBloqueo',
                timeout: 7200000,
                params: {
                    idinversion: Ext.encode(arreglo),
                    identidad: idorganismo,
                    idejercicio: vista.cmbEjercicio.getValue(),
                    activar: activar
                },
                method: 'POST',
                callback: function(options, success, response) {
                    mostrarMensaje(1, mensaje);
                    vista.grid_gestionar_inversiones.getStore().reload();
                }
            });
        }
        
        function fngestionarApro(aprobar) {
            mensaje = aprobar ? (perfil.etiquetas.tlAprobar) : (perfil.etiquetas.tlDesAprobar);
            var aux = vista.sm_inversiones.getSelections();
            var arreglo = [];
            for (i = 0; i < aux.length; i++) {
                arreglo[i] = aux[i].data.idinversion;
            }
            _this.mymask.show();
            Ext.Ajax.request({
                url: 'gestionarAprobacion',
                timeout: 7200000, //max 2horas
                params: {
                    idinversion: Ext.encode(arreglo),
                    idejercicio: vista.cmbEjercicio.getValue(),
                    identidad: idorganismo,
                    aprobar: aprobar
                },
                method: 'POST',
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    vista.grid_gestionar_inversiones.getStore().reload();
                    mostrarMensaje(1, mensaje);
                }
            });
        }
        function fnAproCmp(aprobar) {
            mensaje = aprobar ? ("El componente ha sido aprobado satisfactoriamente.") : ("El componente ha sido desaprobado satisfactoriamente.");
            var aux = vista.sm_componentes.getSelections();
            var arreglo = [];
            for (i = 0; i < aux.length; i++) {
                arreglo[i] = aux[i].data.idetapa;
            }
            _this.mymask = new Ext.LoadMask(Ext.getBody(), {
                msg: 'Cargando...'
            });
            Ext.Ajax.request({
                url: 'gestionarACmp',
                timeout: 7200000, //max 2horas
                params: {
                    idformatoetapa: Ext.encode(arreglo),
                    aprobar: aprobar
                },
                method: 'POST',
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    vista.grid_gestionar_componentes.getStore().reload();
                    mostrarMensaje(1, mensaje);
                }
            });
        }
        function eliminarInversion(btnPresionado) {

            if (btnPresionado == 'ok') {
                var aux = vista.sm_inversiones.getSelections();
                var arreglo = [];
                for (i = 0; i < aux.length; i++) {
                    if(aux[i].data.bloqueada==0){
                        arreglo[i] = aux[i].data.idinversion;
                    }
                }
                _this.mymask.show();
                Ext.Ajax.request({
                    url: 'eliminarInversion',
                    params: {
                        idinversion: Ext.encode(arreglo),
                        idejercicio: vista.cmbEjercicio.getValue(),
                        identidad: idorganismo
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgAs == 1) {
                            mostrarMensaje(1, perfil.etiquetas.tlDelSatis);
                            modelo.store_gestionar_inversiones.reload();
                        } else {
                            mostrarMensaje(1, 'No se eliminó correctamente.');
                        }
                        _this.mymask.hide();
                    }
                });
            }
        }

        function fnimportarInversiones() {
            try {
                if (vista.fpbuscar.getForm().isValid())
                {
                    var barraImport = Ext.MessageBox.show({
                        msg: 'Por favor espere...',
                        width: 270,
                        wait: true,
                        progress: true,
                        closable: false

                    });

                    vista.fpbuscar.getForm().submit(
                            {
                                url: 'ImportarInversiones',
                                timeout: 6000000,
                                method: 'POST',
                                params: {
                                    idejercicio: vista.cmbEjercicio.getValue(),
                                    tipoexcel: vista.cmbTiposExcel.getValue(),
                                    identidad: idorganismo
                                },
                                failure: function(form, action) {
                                    var resultadoErrores = action.result.resultado;
                                    barraImport.hide();

                                    modelo.store_gestionar_inversiones.on('beforeload', function(st, opt) {
                                        st.baseParams.idejercicio = vista.cmbEjercicio.getValue();
                                        st.baseParams.ejercicio = vista.cmbEjercicio.getRawValue();
                                        st.baseParams.check = (vista.ChConsolidar.getValue() == true) ? 1 : 0;
                                        st.baseParams.vigente = (vista.ChVigente.getValue() == true) ? 1 : 0;
                                        st.baseParams.cuadrada = 1;
                                        st.baseParams.limit = 20;
                                        st.baseParams.start = 0;
                                    });
                                    modelo.store_gestionar_inversiones.load();

                                    if (resultadoErrores.length != 0) {
                                        Ext.Ajax.timeout = 600000;
                                        var win = window.open('exportarErrores?&errores=' + resultadoErrores);
                                    } else {
                                        mostrarMensaje(1, 'Todos los datos han sido importados correctamente');
                                        vista.winImp.hide();
                                    }

                                }

                            }


                    );

                } else
                    mostrarMensaje(1, perfil.etiquetas.lbCamposIncorrectos);
            } catch (e) {
                console.log(e);
            }
        }
        function importarInversiones() {
            try {
                if (vista.fpbuscar.getForm().isValid())
                {

                    var barraImport = Ext.MessageBox.show({
                        msg: 'Por favor espere...',
                        width: 270,
                        wait: true,
                        progress: true,
                        closable: false

                    });
                    alert('mensaje de importando');
                    vista.fpbuscar.getForm().submit(
                            {
                                url: 'ImportarInversiones',
                                timeout: 1800000,
                                method: 'POST',
                                params: {
                                    idejercicio: vista.cmbEjercicio.getValue(),
                                    tipoexcel: vista.cmbTiposExcel.getValue(),
                                    identidad: idorganismo
                                },
                                failure: function(form, action) {
                                    var resultadoErrores = action.result.resultado;

                                    if (resultadoErrores.length != 0) {
                                        Ext.Ajax.timeout = 600000;
                                        var win = window.open('exportarErrores?&errores=' + resultadoErrores);
                                        vista.winImp.hide();
                                    } else {
                                        mostrarMensaje(1, 'Todos los datos han sido importados correctamente');
                                        vista.winImp.hide();
                                    }
                                }
                            }
                    );
                } else
                    mostrarMensaje(1, perfil.etiquetas.lbCamposIncorrectos);
            } catch (e) {
                console.log(e);
            }
        }

        /*  vista.cmbTiposExcel.on('select',function(combo,record){
         Ext.Ajax.request({
         url: 'verificarConcurrencia',
         params: {
         tipoexcel: record.data.tipoexcel
         },
         callback: function(options, success, response) {
         console.log(response);
         if(response == 1){
         vista.btnAceptarImportar.enable();
         }
         else{
         mostrarMensaje(1,'Hay otro usuario importando, por favor espere.');
         }
         }
         
         });
         });*/


        modelo.store_gestionar_componentes.on('load', function() {
            if (vista.filtroscomp.getFiltrosActivos().length > 0 && modelo.store_gestionar_componentes.getCount() == 0) {
                mostrarMensaje(1, perfil.etiquetas.tlexiste);
            }

        });
        modelo.store_gestionar_elementos.on('load', function() {
            if (vista.filtroselemt.getFiltrosActivos().length > 0 && modelo.modelo.store_gestionar_elementos.getCount() == 0) {
                mostrarMensaje(1, perfil.etiquetas.tlexiste);
            }

        });
        function ReportesContratos() {
            if (vista.sm_inversiones.getSelected()) {
                var selecti = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
                var datos = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data;
            }
            Ext.MessageBox.show({
                title: 'Por favor espere...',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6',
                msg: 'Configurando el reporte.'
            });
            Ext.Ajax.request({
                url: 'mostrarVerDetalles',
                params: {
                    idinversion: selecti,
                    identidad: idorganismo,
                    datosinv: Ext.encode(datos),
                    idejercicio: vista.cmbEjercicio.getValue()

                },
                callback: function(options, success, response) {
                    var cuerporeporte = Ext.decode(response.responseText);
                    var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                    winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                    winreporte.document.close();
                }

            });
            Ext.MessageBox.hide();
        }

        function verPresupuesto() {
            if (vista.sm_inversiones.getSelected()) {
                var select = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
                var dato = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data;
            }
            Ext.MessageBox.show({
                title: 'Por favor espere...',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6',
                msg: 'Configurando el reporte.'
            });
            Ext.Ajax.request({
                url: 'verPresupuesto',
                params: {
                    identidad: idorganismo,
                    idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion,
                    idejercicio: vista.cmbEjercicio.getValue(),
                    //cables para cargar los datos del equipos 
                    //idelemento: vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion,
                    denominacionetapa: 'TOTAL EQUIPOS', //vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.denominacion,
                    //  idetapainversion: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa
                },
                callback: function(options, success, response) {
                    var cuerporeporte = Ext.decode(response.responseText);
                    //console.info(cuerporeporte);
                    var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                    winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                    winreporte.document.close();
                }

            });
            Ext.MessageBox.hide();

        }

        function verFinanciamiento() {
            Ext.MessageBox.show({
                title: 'Por favor espere...',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6',
                msg: 'Configurando el reporte.'
            });
            Ext.Ajax.request({
                url: 'verFinanciamiento',
                params: {
                    identidad: idorganismo,
                    idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion,
                    idejercicio: vista.cmbEjercicio.getValue()

                },
                callback: function(options, success, response) {
                    var cuerporeporte = Ext.decode(response.responseText);
                    var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                    winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                    winreporte.document.close();
                }

            });

            Ext.MessageBox.hide();
        }

        function recarga(store, limit) {
            store.reload({
                params: {
                    start: 0,
                    limit: limit != undefined ? limit : 20
                }
            });
        }
        function recargaele(store, limit) {
            store.reload({
                params: {
                    start: 0,
                    limit: limit != undefined ? limit : 2
                }, callback: function() {
                    vista.grid_gestionar_elementos.getSelectionModel().selectFirstRow(0);
                }
            });
        }
        function recargacom(store, limit) {
            store.reload({
                params: {
                    start: 0,
                    limit: limit != undefined ? limit : 5
                }
            })
        }
        function validarMoneda(data, addmod) {
            aux = false;
            //console.info(data);
            if (data.length != 0) {
                for (var i = 0; i < data.length - 1; i++) {
//console.info(data.items[i].data)
                    if (data.items[i].data.pintar == 0) {


                        if (data.items[i].data.moneda != "USD" && data.items[i].data.moneda != "CUP") {
                            var pre = data.items[i].data.moneda;
                        } else {
                            if (!addmod || data.items[i].data.idpresanteproy == "") {
                                var pre = (data.items[i].data.idmonedaentidad != undefined) ? data.items[i].data.idmonedaentidad : data.items[i].data.moneda;
                            } else {
                                var pre = (data.items[i].data.moneda != undefined) ? data.items[i].data.moneda : data.items[i].data.idmonedaentidad;
                            }
                        }

                        for (var j = i + 1; j < data.length; j++) {
                            if (data.items[j].data.moneda != "USD" && data.items[j].data.moneda != "CUP")
                                var pre1 = data.items[j].data.moneda;
                            else {
                                if (!addmod || data.items[i].data.idpresanteproy == "") {
                                    var pre1 = (data.items[j].data.idmonedaentidad != undefined) ?
                                            data.items[j].data.idmonedaentidad : data.items[j].data.moneda;
                                } else {
                                    var pre1 = (data.items[j].data.moneda != undefined) ?
                                            data.items[j].data.moneda : data.items[j].data.idmonedaentidad;
                                }
                            }

                            if (pre == pre1) {
                                aux = true;
                                break;
                            }
                        }
                    }
                    if (aux == true) {
                        break;
                    }
                }
            }
            return aux;
        }

        function validarMonedaValor(data, addmod) {
            cantUSD = 0;
            cantMUP = 0;
            aux = true;

            if (data.length != 0) {

                for (var i = 0; i <= data.getCount() - 1; i++) {
                    rec = data.getAt(i).data;
                    if (rec.pintar == 0) {
                        if (rec.moneda == "USD") {
                            cantUSD++;
                        } else {
                            if (rec.moneda == "CUP") {
                                cantMUP++;
                            }
                        }
                    }
                }
                if (cantUSD > 1 || cantMUP > 1) {
                    aux = false;
                }

            } else {
                aux = false;
            }

            return aux;
        }

        function validarFinancista_Tipo(data, addmod) {
            aux = false;
            if (data.items[1]) {
                for (var i = 0; i < data.length - 1; i++) {
                    if (!addmod) {
                        var financista = (data.items[i].data.idfinancista != undefined) ? data.items[i].data.idfinancista : data.items[i].data.financi;
                        var tipo = (data.items[i].data.idtipofinanciamiento != undefined && !vista.modoace) ? data.items[i].data.idtipofinanciamiento : data.items[i].data.tipo;
                    } else {
                        var financista = (data.items[i].data.financi != undefined) ? data.items[i].data.financi : data.items[i].data.idfinancista;
                        var tipo = (data.items[i].data.tipo != undefined) ? data.items[i].data.tipo : data.items[i].data.idtipofinanciamiento;
                    }
                    for (var j = i + 1; j < data.length; j++) {
                        if (!addmod) {
                            var financista1 = (data.items[j].data.idfinancista != undefined) ? data.items[j].data.idfinancista : data.items[j].data.financi;
                            var tipo1 = (data.items[j].data.idtipofinanciamiento != undefined && !vista.modoace) ? data.items[j].data.idtipofinanciamiento : data.items[j].data.tipo;
                        } else {
                            var financista1 = (data.items[j].data.financi != undefined) ? data.items[j].data.financi : data.items[j].data.idfinancista;
                            var tipo1 = (data.items[j].data.tipo != undefined) ? data.items[j].data.tipo : data.items[j].data.idtipofinanciamiento;
                        }
                        if ((financista1 == financista) || (tipo1 == tipo)) {
                            aux = true;
                            break;
                        }
                    }
                    if (aux == true) {
                        break;
                    }
                }
                vista.modoace = false;
            }
            return aux;
        }
        /*
         function levantarBtnadd(addMod) {
         modelo.stFinancista.reload();
         modelo.stTipoFinan.reload();
         if (objci.acciones == true) {
         vista.ChkFastTrack.enable();
         } else {
         vista.ChkFastTrack.disable();
         }
         if (addMod == false) {
         if (vista.sm_inversiones.getSelected()) {
         var selecti = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
         
         }
         console.log(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idmedioambiente)
         vista.win_add_inversiones.setTitle(idioma.tlModInv);
         vista.tfdenominacion.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.denominacion);
         vista.CmbFormaDePropiedad.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idformapropiedad);
         vista.CmbObjetivo.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idobjetivo);
         vista.cmbClasificacion.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idtipoinversion);
         vista.tfProvincia.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.provincia);
         vista.CmbEfectoEnComercio.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idefectocomercial);
         vista.cmbMedioAmbiente.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idmedioambiente);
         vista.CmbTipoInversion.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idtipoinversionprograma);
         vista.CmbProgramada.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idprograma);
         vista.tfFechaInicio.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.fechainicio);
         vista.tfFechaFin.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.fechafin);
         vista.CmbCaracteristica.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idcaracteristica);
         vista.tfanalisis.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.analpostinversiones);
         vista.Observacion.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.observaciones);
         vista.CmbDesempeno.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.iddatdesempenno);
         
         modelo.stPresupuesto.reload({
         params: {
         start: 0,
         limit: 20,
         identidad: idorganismo,
         idejercicio: vista.cmbEjercicio.getValue(),
         idinversion: selecti ? selecti : 0
         }
         });
         modelo.store_Financiamiento.reload({
         params: {
         start: 0,
         limit: 20,
         identidad: idorganismo,
         idejercicio: vista.cmbEjercicio.getValue(),
         idinversion: selecti ? selecti : 0
         }
         });
         modelo.stImportacion.reload({
         params: {
         start: 0,
         limit: 20,
         identidad: idorganismo,
         idejercicio: vista.cmbEjercicio.getValue(),
         idinversion: selecti ? selecti : 0
         }
         });
         
         } else {
         vista.win_add_inversiones.setTitle(idioma.tlAddInv);
         vista.CmbFormaDePropiedad.clearValue();
         vista.CmbObjetivo.clearValue();
         vista.tfdenominacion.reset();
         vista.tfFechaFin.reset();
         vista.tfProvincia.reset();
         vista.tfFechaInicio.reset();
         vista.cmbClasificacion.clearValue();
         vista.CmbEfectoEnComercio.clearValue();
         vista.cmbMedioAmbiente.clearValue();
         vista.CmbTipoInversion.clearValue();
         vista.CmbProgramada.clearValue();
         vista.CmbCaracteristica.clearValue();
         vista.CmbDesempeno.clearValue();
         vista.tfanalisis.reset();
         vista.Observacion.reset();
         modelo.store_Financiamiento.removeAll();
         modelo.stPresupuesto.removeAll();
         modelo.stImportacion.removeAll();
         }
         vista.win_add_inversiones.on({
         beforeshow: function() {
         vista.tfdenominacion.focus(true, 700);
         },
         show: function() {
         _this.openWin = false;
         },
         hide: function() {
         _this.openWin = true;
         }
         });
         vista.win_add_inversiones.show();
         }*/

        function adicionarequipos() {
            var arrayequipo = [];
            var records = vista.grid_addEquipos.getSelectionModel().getSelections();
            for (i = 0; i < vista.grid_addEquipos.getSelectionModel().getCount(); i++) {
                arrayequipo.push(records[i].data);
            }
            if (arrayequipo.length != 0) {
                if (arrayequipo.length > 1) {
                    mensajemascara = 'Adicionando equipos.';
                } else {
                    mensajemascara = 'Adicionando equipo.';
                }
                var barra = Ext.MessageBox.show({
                    title: 'Por favor espere...',
                    width: 300,
                    wait: true,
                    progress: true,
                    closable: false,
                    animEl: 'mb6',
                    msg: mensajemascara
                });
                Ext.Ajax.request({
                    url: 'adicionarEquipos',
                    params: {
                        idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion,
                        equipos: Ext.encode(arrayequipo),
                        idetapainversion: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa,
                        idejercicio: vista.cmbEjercicio.getValue(),
                        idequipoplan: vista.CmbEntidadModelo.getValue()

                    },
                    callback: function(options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgE == 10) {
                            mostrarMensaje(1, 'El(Los) equipo(s) ha(n) sido adicionado(s) satisfactoriamente.');
                            vista.window_addEquipos.hide();
                            recarga(modelo.store_gequipos, 20);
                            barra.hide();
                        }
                    }

                });
            }
        }

        vista.btnEliminarequipo.on({
            click: function() {
                if (vista.sm_equipos.getSelections().length == 0) {
                    mostrarMensaje(1, 'Debe seleccionar al menos un equipo.');
                    vista.btnEliminarequipo.disable();
                }

                var valoresSelec = vista.grid_equipos.getSelectionModel().getSelections();
                var arreglo = [];
                var idEquipos = [];
                for (i = 0; i < valoresSelec.length; i++) {
                    idEquipos[i] = valoresSelec[i].data.idindicador,
//                            idEntidad: idorganismo
                            arreglo[i] = valoresSelec[i].data.idetapaequipos;
                }
                mostrarMensaje(2, perfil.etiquetas.tlDelEquipo, function(btnPress) {
                    if (btnPress === 'ok') {
                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarEquipos",
                            params: {
                                idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion,
                                idetapaequipos: Ext.encode(arreglo),
                                idindicadores: Ext.encode(idEquipos),
                                idEntidad: idorganismo
                            },
                            callback: function(options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                if (responseData.codMsgAs == 1)
                                    mostrarMensaje(1, 'El(Los) equipo(s) se ha(n) eliminado satisfactoriamente.');
                                else
                                    mostrarMensaje(1, 'El(Los) equipo(s) que no habían sido desglosados se ha(n) eliminado satisfactoriamente.');
                                recarga(modelo.store_gequipos, 20);
                            }
                        });
                    }
                    vista.btnEliminarequipo.disable();
                });
            }

        });
        vista.btn_guardar_equipo.on('click', function() {
            arrayEquipo = new Array();
            records = modelo.store_gequipos.getModifiedRecords();
            if (records.length > 0) {
                modelo.store_gequipos.commitChanges();
                banGuardar = true;
                for (var i = 0; i < records.length; i++) {
                    if (records[i].data.adquirir != null && records[i].data.comprar != null && records[i].data.pais != null) {
                        records[i].data.precio = _this.cleanComa(records[i].data.precio);
                        records[i].data.preciodivisa = _this.cleanComa(records[i].data.preciodivisa);
                        arrayEquipo.push(records[i].data);
                    } else {
                        banGuardar = false;
                        break;
                    }
                }
                if (banGuardar) {
                    Ext.Ajax.request({
                        url: 'guardarEquipos',
                        waitMsg: "Cargando...",
                        params: {
                            idetapaequipos: Ext.encode(arrayEquipo),
                            idinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion
                        },
                        callback: function(options, success, response) {
                            mostrarMensaje(1, 'El(Los) equipo(s) ha(n)sido guardado(s) satisfactoriamente.');
                            recarga(modelo.store_gequipos, 20);
                        }
                    });
                } else {
                    mostrarMensaje(1, 'Debe indicar el valor en los campos Adquirir y Comprar.');
                }
            } else
                mostrarMensaje(1, 'No se han modificado ning&uacute;n valor.');
        });
        vista.btn_ActulizarEq.on('click', function() {
            arrayEquipo = new Array();
            records = modelo.store_gequipos.getRange();
            for (var i = 0; i < records.length; i++) {
                arrayEquipo.push(records[i].data.idetapaequipos);
            }
//            modelo.store_gequipos.load({
//                params: {
//                    start: 0,
//                    limit: 20
//                },
//                callback: function() {
                    Ext.Ajax.request({
                        url: 'guardarEquipos',
                        //url: 'actualizarPrecioEquipos',
                        waitMsg: "Actualizando...",
                        params: {
                            idetapaequipos: Ext.encode(arrayEquipo),
                            accion: 5
                            
                        },
                        callback: function(options, success, response) {
                            mostrarMensaje(1, 'El(Los) equipo(s) ha(n)sido actualizado(s) satisfactoriamente.');
                            recarga(modelo.store_gequipos, 20);
                        }
                    });
//                }
//            });
            _this.mymask.hide();
        });

        _this.cleanComa = function(v) {
            v = v.replace(/\,/g, ''); //sacar coma repetida
            return v;
        };

        _this.getRawValue = function(v, cmb, g, c) {
            var arrid = (v != null) ? v.split(",") : '';

            var str = '';
            if (v != '') {
                str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
                        ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
                        : '');

            }
            return str;
        };
        function gestionarDoc(gest) {
            if (vista.sm_gestionar_documentos.getSelected()) {
                iddoc = vista.grid_gestionar_documentos.getSelectionModel().getSelected().data.id;
                denominacion = vista.grid_gestionar_documentos.getSelectionModel().getSelected().data.denominacion;
            } else {
                iddoc = 0;
                denominacion = "";
            }
            vista.mymask.show();
            name = denoInv + "_" + denoCmp + "_" + denoElem;
            Ext.Ajax.request({
                url: 'listarGestionarDoc',
                waitMsg: "Cargando...",
                params: {
                    idelemento: vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion,
                    accion: 'asociar',
                    identidad: idorganismo,
                    idcontenido: iddoc,
                    denominacion: denominacion,
                    name: name
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgAs == 25) {
                        mostrarMensaje(1, "Debe seleccionar un tipo de documento.");
                    } else if (responseData.codMsgAs == 22) {
                        mostrarMensaje(1, "Ocurrió un error contacte con el  administrador.");
                    } else {
                        if (gest == 0) {
                            var objetoContenidoAdicionar = new personalizacionalfresco.gestionarchivos.gestionContenido({splash: false});
                            objetoContenidoAdicionar.inicializarComponente(true);
                            objetoContenidoAdicionar.actualizarAreaPrincipal(false, responseData.codMsgAs);
                            var aux = true;
                            objetoContenidoAdicionar.on("obtenerContenidoOK", function(eventName) {
                                if (aux) {
                                    objetoContenidoAdicionar.obtenerVtnAdicionarDocumento();
                                    aux = false;
                                }
                            });
                        }

                    }
                    vista.mymask.hide();
                }
            });
        }

        _this.reconfigurarGrid = function(cf) {
            _this.mymask.show();
            rec = [];
            cmGp = [];
            if (cf) {
                for (var index = 0; index < cf.cm.length; index++) {
                    if (cf.cm[index].edit.xtype) {
                        var items = cf.cm;
                        switch (cf.cm[index].edit.xtype) {
                            case 'numberfield':
                                {
                                    cf.cm[index].editor = new Ext.form.NumberField(cf.cm[index].edit);
                                    cf.cm[index].editor.on('focus', function(f) {
                                        f.selectText();
                                    });
                                }
                                break;
                            case 'datefield':
                                {
                                    cmGp.push({
                                        header: items[index].header,
                                        width: 150,
                                        sortable: true,
                                        dataIndex: items[index].dataIndex,
                                        tooltip: items[index].header,
                                        editor: new Ext.form.DateField({
                                        })
                                    });
                                }
                                break;
                            case 'combo':
                                {
                                    var item = cf.cm[index].edit;
                                    var almacen = new Ext.data.SimpleStore({
                                        fields: ['iddatosnomenclador', item.displayField]
                                    });
                                    var valores = [];
                                    for (pos in cf.cm[index].edit.store) {
                                        valores.push(new Ext.data.Record(cf.cm[index].edit.store[pos]));
                                    }

                                    valores.pop();
                                    almacen.add(valores);
                                    cmGp.push({
                                        id: items[index].edit.id,
                                        header: items[index].header,
                                        dataIndex: items[index].dataIndex,
                                        sortable: true,
                                        width: 180,
                                        tooltip: items[index].header,
                                        renderer: function(value, cell, rec, row, col) {
                                            var col = col;
                                            return _this.getRawValue(value, _this.grid_gestionar_parametros.getColumnModel().getCellEditor(col, row).field,
                                                    _this.grid_gestionar_parametros.getColumnModel(), col);
                                        },
                                        editor: new Ext.form.ComboBox({
                                            id: item.id,
                                            hiddenName: item.hiddenName,
                                            name: item.hiddenName,
                                            mode: 'local',
                                            triggerAction: 'all',
                                            allowBlank: item.allowBlank,
                                            emptyText: item.emptyText,
                                            width: 150,
                                            typeAhead: item.typeAhead,
                                            valueField: item.valueField,
                                            displayField: item.displayField,
                                            resizable: true,
                                            store: almacen
                                        })
                                    });
                                }
                                break;
                            default:
                                {
                                    cmGp.push({
                                        header: items[index].header,
                                        width: 150,
                                        sortable: true,
                                        dataIndex: items[index].dataIndex,
                                        tooltip: items[index].header,
                                        editor: new Ext.form.TextField({
                                            allowNegative: false
                                        })
                                    });
                                }
                                break;
                        }
                    }
                }
                for (var index = 0; index < cf.rd.length; index++) {
                    rec.push(cf.rd[index]);
                }
                var data = cf.rd[cf.rd.length - 1].name;
                var partes = data.split('_');
                var recIdelementotipomodelovalor = {
                    name: "mod_planificacionmeta_dat_" + partes[3] + "_idelementotipomodelovalor"
                };
                rec.push(recIdelementotipomodelovalor);
            }
            jrStGpGestModelo = new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos',
                id: 'jrStGpGestModelo',
                fields: rec
            });
            modelo.store_gestionar_parametros = new Ext.data.Store({
                url: 'listarDatos',
                reader: jrStGpGestModelo
            });
            modelo.store_gestionar_parametros.load({
                params: {
                    idelemento: vista.sm_elementos.getSelected().data.idelemento,
                    idelementotipomodelovalor: vista.sm_elementos.getSelected().data.idelementotipomodelovalor
                },
                callback: function() {
                    _this.mymask.hide();
                }
            });
            _this.colModel_gestionar_parametros = new Ext.grid.ColumnModel([]);

            _this.grid_gestionar_parametros = new Ext.grid.EditorGridPanel({
                store: modelo.store_gestionar_parametros,
                id: 'gpGestparamentros',
                sm: vista.smParamsdinamico,
                columns: cmGp,
                frame: false,
                height: 300,
                width: 400,
                region: 'center',
                clicksToEdit: 2

            });
            _this.window_gestionar_parametros = new Ext.Window({
                title: 'Gestionar parámetros dinámicos',
                height: 300,
                width: 400,
                closeAction: 'hide',
                resizable: false,
                modal: true,
                frame: true,
                items: _this.grid_gestionar_parametros,
                tbar: [new Ext.Button({
                        id: 'idbtnAdicionarParamTbar',
                        text: idioma.btnAdicionarParam,
                        tooltip: idioma.toolTipAdicionarParam,
                        iconCls: 'btn',
                        icon: perfil.dirImg + 'adicionar.png',
                        handler: function() {
                            _this.fnAdicionarParamTbar();
                        }
                    }), new Ext.Button({
                        id: 'idbtnEliminarParamTbar',
                        text: idioma.btnEliminarParam,
                        tooltip: idioma.toolTipEliminarParam,
                        iconCls: 'btn',
                        icon: perfil.dirImg + 'eliminar.png',
                        disabled: true,
                        handler: function() {
                            _this.fnEliminarParamTbar();
                        }
                    })],
                buttons: [new Ext.Button({
                        id: 'idbtnCancelarParam',
                        text: idioma.btnCancelar,
                        tooltip: idioma.toolTipCancelarParam,
                        iconCls: 'btn',
                        icon: perfil.dirImg + 'cancelar.png',
                        handler: function() {
                            _this.window_gestionar_parametros.hide();
                        }
                    }), ({
                        id: 'idbtnAceptarParam',
                        text: idioma.btnAceptar,
                        tooltip: idioma.toolTipAceptarParam,
                        iconCls: 'btn',
                        icon: perfil.dirImg + 'aceptar.png',
                        handler: function() {
                            _this.fnAceptarParam();
                        }
                    })]
            });
            _this.window_gestionar_parametros.show();

        };

        this.cargarTiposNomencladoresInversion();






        //exportarrrr...........
        vista.btnExportar.on({
            click: function() {
                var aux = vista.sm_inversiones.getSelections();
                var arreglo = [];
                for (i = 0; i < aux.length; i++) {
                    arreglo[i] = aux[i].data.idinversion;
                }
                Ext.Ajax.timeout = 600000;
                var win = window.open('exportarElemEqConst?&identidad=' + idorganismo +
                        '&idejercicio=' + vista.cmbEjercicio.getValue() +
                        '&ejercicio=' + vista.cmbEjercicio.getRawValue() +
                        '&idinvers=' + Ext.encode(arreglo));
            }
        });
        //-------------------------------Niveles de actividad-----------------------------------------------------//
        //-------------------------------Guardar-----------------------------------------//
        /*   vista.btnAceptarNivel.on({
         click: function () {
         guardarNiveles(1);
         }
         });
         vista.btnAplicarNivel.on({
         click: function () {
         guardarNiveles(0);
         }
         });
         function guardarNiveles (cerrar) {
         arrayNiveles = new Array();
         recordsNiv = modelo.store_gestionar_nivelesactividad.getModifiedRecords();
         if (recordsNiv.length > 0) {
         modelo.store_gestionar_nivelesactividad.commitChanges();
         for (var i = 0; i < recordsNiv.length; i++) {
         arrayNiveles.push(recordsNiv[i].data);
         }
         Ext.Ajax.request({
         url: 'guardarNiveles',
         waitMsg: "Cargando...",
         params: {
         arrayNiveles: Ext.encode(arrayNiveles),
         idetapainversion:vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa,
         idejercicio: vista.cmbEjercicio.getValue(),
         identidad: idorganismo
         },
         callback: function (options, success, response) {
         responseData = Ext.decode(response.responseText);
         if (responseData.codMsgAs == 1) {
         mostrarMensaje(1, 'El(Los) nivel(es) ha(n)sido guardado(s) satisfactoriamente.');}
         else{
         mostrarMensaje(1, 'Ocurrió un error contacte con el  administrador.');
         }
         recarga(modelo.store_gestionar_nivelesactividad, 20);
         if(cerrar==1)
         vista.window_nivelesactividad.hide();
         }
         });
         } else {
         mostrarMensaje(1, 'Debe indicar el valor en el campo Nivel.');
         }
         }*/
        //-------------------------------ENDS Guardar------------------------------------//
        //-------------------------------ENDS Niveles de actividad----------------------//

    },
    cargarTiposNomencladoresInversion: function() {
        Ext.Ajax.request({
            url: '/planificacion/inversiones/index.php/inversiones/cargarNomencladoresInversiones',
            /*params: {
             //idespecialidad: idorganismo,
             
             
             },*/
            callback: function(options, success, response) {
                nomencladoresInversiones = Ext.decode(response.responseText);




            }
        });
    }
};
