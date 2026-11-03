Ext.ns('Gestionar.inversiones');
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('inversiones', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Gestionar.inversiones.Modelo;
    modelo.init();
    var vista = Gestionar.inversiones.Vista;
    vista.init(idioma, modelo);
    var acciones, idorganismo, objci;

    Gestionar.inversiones.Controlador.init(idioma, vista, modelo);
});
Gestionar.inversiones.Controlador = {
    init: function(idioma, vista, modelo) {
        Ext.Ajax.timeout = 1000000000;
        vista.win_add_inversiones.doLayout();
        vista.win_add_inversiones.show();
        vista.win_add_inversiones.hide();
        _this.openWin = true;
        var arr_dates = [];
        var addmod;
        var flag1 = false, objci, mod = false, denoInv = "", denoCmp = "", denoElem = "";
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
            st.baseParams.idejercicio = vista.cmbEjercicio.getValue(),
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
            idorganismo = node.id;
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

            vista.ChConsolidar.enable();
            vista.ChVigente.enable();
        });



        //*********************TECLAS CALIENTES********************************//
        _this.map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'iI',
                alt: true,
                fn: function() {
                    levantarBtnadd(true);
                }
            }, {
                key: 46, //tecla eliminar
                fn: function() {
                    if (vista.btnEliminarinversion.enable() && _this.openWin && vista.sm_inversiones.getSelected()) {
                        btnPresionado = 'ok';
                        mostrarMensaje(2, perfil.etiquetas.tlDel, eliminarInversion);
                    }
                }
            },
            {
                key: 'mM',
                alt: true,
                fn: function() {
                    if (vista.btnModificarinversion.enable()) {
                        levantarBtnadd(false);
                    }

                }
            },
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
                    vista.btn_activar_inversion.fireEvent('click');
                }
            }, {
                key: 'Ff',
                alt: true,
                fn: function() {
                    vista.btn_desactivar_inversion.fireEvent('click');
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
        //--------------VALIDAR LOS BOTONES DE LA INTERFAZ INVERSIONES-----------------------
        //EVENTOS AL SELECCIONAR UN ELEMENTO DE GRID INVERSIONES
        vista.sm_inversiones.on({
            rowselect: function() {
                if (vista.sm_inversiones.getSelections().length > 0) {
                    vista.btnEliminarinversion.enable();
                    Ext.getCmp('idaprobacion').enable();
                    vista.btn_activar_inversion.enable();
                    vista.btn_desactivar_inversion.enable();
                    Ext.getCmp('iddesaprobar').enable();
                    if (vista.sm_inversiones.getSelections().length == 1) {
                        vista.btnModificarinversion.enable();

                    } else {
                        vista.btnModificarinversion.disable();

                    }
                    denoInv = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.denominacion;
                } else {
                    vista.btnEliminarinversion.disable();
                    Ext.getCmp('idaprobacion').disable();
                    vista.btn_activar_inversion.disable();
                    vista.btn_desactivar_inversion.disable();
                    Ext.getCmp('iddesaprobar').disable();
                }
                if (vista.sm_inversiones.getSelections().length = 1) {
                    vista.btn_ver_Detalles.enable();
                }

                //si hay seleccionado solo una fila valido aqui
                if (vista.grid_gestionar_inversiones.getSelectionModel().getSelections().length == 1) {
                    if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 2 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 2) {
                        Ext.getCmp('idaprobacion').enable();
                        vista.btn_activar_inversion.disable();
                        vista.btn_desactivar_inversion.disable();
                        Ext.getCmp('iddesaprobar').disable();
                    }
                    else if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 2 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 1) {
                        vista.btn_activar_inversion.enable();
                        Ext.getCmp('iddesaprobar').enable();
                        vista.btn_desactivar_inversion.disable();
                        Ext.getCmp('idaprobacion').disable();
                    }
                    else if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 1 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 1) {
                        vista.btn_desactivar_inversion.enable();
                        vista.btn_activar_inversion.disable();
                        Ext.getCmp('idaprobacion').disable();
                        Ext.getCmp('iddesaprobar').disable();
                    }
                }
                modelo.store_gestionar_componentes.removeAll();
                modelo.store_gestionar_elementos_der.removeAll();
            },
            rowdeselect: function() {
                if (vista.sm_inversiones.getSelections().length > 0) {
                    vista.btnEliminarinversion.enable();
                    Ext.getCmp('idaprobacion').enable();
                    vista.btn_activar_inversion.enable();
                    vista.btn_desactivar_inversion.enable();
                    Ext.getCmp('iddesaprobar').enable();
                    if (vista.sm_inversiones.getSelections().length == 1) {
                        vista.btnModificarinversion.enable();
                    } else {
                        vista.btnModificarinversion.disable();
                    }
                } else {
                    vista.btnEliminarinversion.disable();
                    Ext.getCmp('idaprobacion').disable();
                    vista.btn_activar_inversion.disable();
                    vista.btn_desactivar_inversion.disable();
                    Ext.getCmp('iddesaprobar').disable();
                    modelo.store_gestionar_componentes.removeAll();
                }
                vista.btn_georefe_inversion.disable();
                vista.btn_presupuesto_inversion.disable();
                vista.btn_financiamiento_inversion.disable();
                //si hay seleccionado solo una fila valido aqui
                if (vista.grid_gestionar_inversiones.getSelectionModel().getSelections().length == 1) {

                    if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 2 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 2) {

                        Ext.getCmp('idaprobacion').enable();
                        vista.btn_activar_inversion.disable();
                        vista.btn_desactivar_inversion.disable();
                        Ext.getCmp('iddesaprobar').disable();
                    }
                    else if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 2 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 1) {

                        vista.btn_activar_inversion.enable();
                        Ext.getCmp('iddesaprobar').enable();
                        vista.btn_desactivar_inversion.disable();
                        Ext.getCmp('idaprobacion').disable();
                    }
                    else if (vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoinversion == 1 && vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idestadoaprobacion == 1) {
                        vista.btn_desactivar_inversion.enable();
                        vista.btn_activar_inversion.disable();
                        Ext.getCmp('idaprobacion').disable();
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
            rowselect: function() {
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
                vista.btn_equipos.enable();
                vista.btn_constructores.enable();
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
            }
        });

        modelo.store_gestionar_componentes.on('beforeload', function(st, record, ob) {
            st.baseParams.identidad = idorganismo;
            st.baseParams.idinversion = (vista.sm_inversiones.getSelected()) ? vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion : 0;
            st.baseParams.idejercicio = vista.cmbEjercicio.getValue();

        });
        vista.grid_gestionar_inversiones.getSelectionModel().on({
            rowselect: function(g, r, e) {
                recargacom(modelo.store_gestionar_componentes, 5);
//                vista.pgestionar_componentes.expand(true);
                modelo.store_gestionar_elementos.removeAll();
                modelo.store_gestionar_elementos_der.removeAll();
                vista.btn_desactivar_inversion.enable();
                vista.btn_activar_inversion.enable();
                vista.btnMenuAprobacion_inversion.enable();
                vista.btn_georefe_inversion.enable();
                vista.btn_financiamiento_inversion.enable();
                vista.btn_presupuesto_inversion.enable();
            }
        });
        vista.grid_gestionar_inversiones.getSelectionModel().on({
            rowdeselect: function(g, r, e) {
                vista.btnEliminarinversion.disable();
                vista.btnModificarinversion.disable();
                vista.btn_desactivar_inversion.disable();
                vista.btn_activar_inversion.disable();
                vista.btnMenuAprobacion_inversion.disable();
                vista.btn_georefe_inversion.disable();
                vista.btn_financiamiento_inversion.disable();
                vista.btn_presupuesto_inversion.disable();
            }
        });
        vista.grid_Presupuesto.getSelectionModel().on({
            rowselect: function(g, r, e) {
                vista.btnEliminar.enable();
            },
            rowdeselect: function(g, r, e) {
                vista.btnEliminar.disable();
            }
        });
        vista.grid_gestionar_elementos_der.getSelectionModel().on({
            rowselect: function(g, r, record) {
                // console.info(record.data);
                if (record.data.pintar == 0) {
                    vista.btn_eliminar_elementos_der.enable();
                    vista.btn_guardar_elementos_der.enable();
                } else {
                    vista.btn_eliminar_elementos_der.disable();
                    vista.btn_guardar_elementos_der.disable();
                }
            },
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

        vista.grid_Financiamiento.getSelectionModel().on({
            rowselect: function(g, r, e) {
                vista.btnEliminarFinan.enable();
            },
            rowdeselect: function(g, r, e) {
                vista.btnEliminarFinan.disable();
            }
        });
        vista.grid_Importacion.getSelectionModel().on({
            rowselect: function(g, r, e) {
                vista.btnEliminarImpor.enable();
            },
            rowdeselect: function(g, r, e) {
                vista.btnEliminarImpor.disable();
            }
        });
        vista.grid_gestionar_elementos.getSelectionModel().on({
            rowdeselect: function(g, r, e) {
                vista.btn_gest_docs.disable();
            }
        });
        vista.btnModificarinversion.on({
            click: function() {
                addmod = false;
                levantarBtnadd(addmod);
            }
        });
        vista.btnEliminar.on({
            click: function() {
                mostrarMensaje(2, perfil.etiquetas.tlDelPres, function(btnPress) {
                    if (btnPress === 'ok') {
                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarPresupuesto",
                            params: {
                                idpresanteproy: vista.grid_Presupuesto.getSelectionModel().getSelected().data.idpresanteproy
                            },
                            callback: function(options, success, response) {
                                mostrarMensaje(1, perfil.etiquetas.tlDelSatisPres);
                                modelo.stPresupuesto.reload();
                            }
                        });
                    }
                });
            }

        });
        vista.btnEliminarFinan.on({
            click: function() {
                mostrarMensaje(2, perfil.etiquetas.tlDelFinan, function(btnPress) {
                    if (vista.sm_inversiones.getSelected()) {
                        var selecti = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
                    }
                    if (btnPress === 'ok') {
                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarFin",
                            params: {
                                idfinanciamiento: vista.sm_financiamiento.getSelected().data.idfinanciamiento,
                                identidad: idorganismo,
                                idejercicio: vista.cmbEjercicio.getValue(),
                                idinversion: selecti ? selecti : 0
                            },
                            callback: function(options, success, response) {
                                mostrarMensaje(1, perfil.etiquetas.tlDelSatisPres);
                                modelo.store_Financiamiento.reload();
                            }
                        });
                    }
                });
            }

        });

        vista.btnEliminarImpor.on({
            click: function() {
                mostrarMensaje(2, perfil.etiquetas.tlDelLiqui, function(btnPress) {
                    if (btnPress === 'ok') {
                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarLiquidos",
                            params: {
                                iderogacionliquido: vista.sm_importacion.getSelected().data.iderogacionliquido

                            },
                            callback: function(options, success, response) {
                                mostrarMensaje(1, perfil.etiquetas.tlDelSatisLiq);
                                modelo.stImportacion.reload();
                            }
                        });
                    }
                });
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
        vista.btnAdicionarinversion.on({
            click: function() {
                addmod = true;
                levantarBtnadd(addmod);
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
        vista.tfProvincia.on({
            focus: function() {
                vista.ventanaDpt.show();
            }
        });
        vista.tfProvinciaconstructor.on({
            focus: function() {
                vista.ventanaDpt.show();
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
            vista.tfProvincia.setValue(data.get('denominacion'));
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
            _this.cosntPrv.push(p.data)
            modelo.stConstructoresEtapa.add(p);
            _this.ventanaDpt.hide();
        });

        Ext.getCmp('btnaplicar').on({
            click: function() {
                if (vista.fmAdicionarInversion.getForm().isValid() == true) {
                    Ext.getCmp('btnaplicar').enable();
                    adicionarInversion(true);
                }
                else {
                    mostrarMensaje(1, idioma.msgError);
                }
            }
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
        Ext.getCmp('btnaceptar').on({
            click: function() {
                if (vista.fmAdicionarInversion.getForm().isValid() == true) {
                    Ext.getCmp('btnaceptar').enable();
                    adicionarInversion(false);
                }
                else {
                    mostrarMensaje(1, idioma.msgError);
                }
            }
        });
        vista.btn_aceptar_addEquipos.on({
            click: function() {
                adicionarequipos();
            }
        });
        vista.btnEliminarinversion.on('click', function() {
            mostrarMensaje(2, perfil.etiquetas.tlDel, eliminarInversion);
        });
        //Validar campo fecha
        vista.tfFechaFin.on('change', function() {
            vista.tfFechaFin.setMinValue(vista.tfFechaInicio.getValue());
        });
        //Ventana de Gestionar Documentos
        vista.btn_gest_docs.on('click', function() {
            if (vista.sm_elementos.getSelected()) {
                vista.grid_gestionar_documentos.getStore().load({
                    params: {
                        start: 0,
                        limit: 20,
                        idelemento: vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion
                    }
                });
            }
            vista.window_gestionar_docs.show();
        });
        vista.btn_verEspacio.on('click', function() {
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
        });

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
            st.baseParams.identidadmodelo = vista.CmbEntidadModelo.getValue();
        });
        modelo.stModelo.on({
            load: function(t, n, e) {
                if (t.reader.jsonData.data[0] == null) {
                    vista.btnAdicionarequipo.disable();
                } else {
                    vista.btnAdicionarequipo.enable();
                    if (t.reader.jsonData.data[0].identidadmodelo != null)
                        vista.CmbEntidadModelo.setValue(t.reader.jsonData.data[0].identidadmodelo);
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
           // vista.grid_equipos.getView().refresh();
            modelo.stModelo.removeAll();
            modelo.stModelo.load({
                params: {
                    identidad: idorganismo,
                    identidadmodelo: vista.CmbEntidadModelo.getValue()
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

        modelo.stConstructoresEtapa.on({
            beforeload: function(st, opt) {
                _this.cosntPrv = [];
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

        modelo.simstTipoexcel.loadData(tiposexcel);

        vista.btnAceptarImportar.on('click', function() {
            importarInversiones();
        });

        vista.btnAceptarConstructor.on({
            click: function() {
                _this.mymask.show();
                Ext.Ajax.request({
                    url: 'adicionarConstrucutorEtapa',
                    params: {
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
                                idetapainverconsprov: Ext.encode(idetapainverconsprov)
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
                    st.baseParams.identidadmodelo = vista.CmbEntidadModelo.getValue();
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
            console.log(vista.smParamsdinamico.getSelections())
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
        vista.btn_presupuesto_inversion.on('click', function() {
            verPresupuesto();
        });
        //accion del boton Ver Presupuesto 
        vista.btn_ver_Detalles.on('click', function() {
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
        vista.btn_financiamiento_inversion.on('click', function() {
            verFinanciamiento();
        });
        vista.btn_georefe_inversion.on({
            click: function() {
                var cmpGISHeight = 700;
                // Definiendo la altura de la ventana del componente Representacion
                if (window.innerHeight) {
                    cmpGISHeight = window.innerHeight;
                }
                else if (window.frameElement && window.frameElement.clientHeight) {
                    cmpGISHeight = window.frameElement.clientHeight;
                }
                else if (window.screen && window.screen.availHeight) {
                    cmpGISHeight = window.screen.availHeight - 180;
                }
                else if (window.screen && window.screen.height) {
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
        vista.btnAdicionarPresupuesto.on('click', function() {

            var record = new Ext.data.Record({
                valor: '',
                moneda: ''
            });
            modelo.stPresupuesto.add(record);
        });
        vista.btnAdicionarFinan.on('click', function() {
            var record = new Ext.data.Record({
                valor: '',
                moneda: '',
                financi: '',
                tipo: '',
                plazoamortizacion: 0,
                porcientointeres: 0,
                gracia: 0

            });
            modelo.store_Financiamiento.add(record);
        });

        vista.btnAdicionarImpor.on('click', function() {
            var record = new Ext.data.Record({
                valor: 0,
                moneda: ''


            });
            modelo.stImportacion.add(record);
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

        vista.btn_activar_inversion.on('click', function() {
            fngestionarAct(true);
        });
        vista.btn_desactivar_inversion.on('click', function() {
            fngestionarAct(false);
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
                    arreglo[i] = aux[i].data.idinversion;
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


        /* function adicionarInversion(aplicar) {
         arraypresupuesto = new Array();
         records = modelo.stPresupuesto.getModifiedRecords();
         modelo.stPresupuesto.commitChanges();
         var changeClasif = false;
         for (var i = 0; i < records.length; i++) {
         arraypresupuesto.push(records[i].data);
         }
         arrayfin = new Array();
         recordsfinan = modelo.store_Financiamiento.getModifiedRecords();
         
         modelo.store_Financiamiento.commitChanges();
         for (var i = 0; i < recordsfinan.length; i++) {
         arrayfin.push(recordsfinan[i].data);
         }
         arrayliquido = new Array();
         recordliqui = modelo.stImportacion.getModifiedRecords();
         modelo.stImportacion.commitChanges();
         for (var i = 0; i < recordliqui.length; i++) {
         arrayliquido.push(recordliqui[i].data);
         }
         if (vista.sm_inversiones.getSelected()) {
         var selecti = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
         vista.pgestionar_componentes.expand(true);
         if (vista.cmbClasificacion.getValue() != vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idtipoinversion && addmod == false) {
         changeClasif = true;
         } else {
         changeClasif = false;
         }
         }
         if (addmod == false && vista.sm_inversiones.getSelected()) {
         idclasfAntes = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idtipoinversion
         } else {
         idclasfAntes = null;
         }
         if (vista.ChkFastTrack.getValue() == true) {
         fasttrack = 1;
         } else {
         fasttrack = 0;
         }
         if (_this.iddpt) {
         provincia = _this.iddpt;
         } else {
         provincia = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idprovincia;
         }
         
         monedaP = validarMoneda(modelo.stPresupuesto.data, addmod);
         monedaF = validarMoneda(modelo.store_Financiamiento.data, addmod);
         
         monedaErog = validarMoneda(modelo.stImportacion.data, addmod);
         if (monedaP || monedaErog) {
         mostrarMensaje(1, "Existe alguna moneda que se encuentra repetida.");
         }
         else {
         if (modelo.store_Financiamiento.data.length == 0) {
         mostrarMensaje(1, perfil.etiquetas.msgError);
         } else {
         _this.mymask.show();
         Ext.Ajax.request({
         url: 'adicionarInversiones',
         params: {
         idespecialidad: idorganismo,
         idinversion: (selecti && !addmod) ? selecti : 0,
         denominacion: vista.tfdenominacion.getValue(),
         idclasificacion: vista.cmbClasificacion.getValue(),
         idejercicio: vista.cmbEjercicio.getValue(),
         ejercicio: vista.cmbEjercicio.getRawValue(),
         idtipoinversion: vista.CmbTipoInversion.getValue(),
         idprogramada: vista.CmbProgramada.getValue(),
         idcaracteristica: vista.CmbCaracteristica.getValue(),
         idforma: vista.CmbFormaDePropiedad.getValue(),
         idefecto: vista.CmbEfectoEnComercio.getValue(),
         idobjetivo: vista.CmbObjetivo.getValue(),
         iddatdesempenno: vista.CmbDesempeno.getValue(),
         fasttrack: fasttrack,
         presupuesto: Ext.encode(arraypresupuesto),
         financiamiento: Ext.encode(arrayfin),
         liquido: Ext.encode(arrayliquido),
         provincia: provincia,
         fechainicio: vista.tfFechaInicio.getValue().format('d/m/Y'),
         fechafin: vista.tfFechaFin.getValue().format('d/m/Y'),
         analpostinversiones: vista.tfanalisis.getValue(),
         observaciones: vista.Observacion.getValue(),
         changeClasif: changeClasif,
         idclasfAntes: idclasfAntes,
         addmod: addmod
         
         },
         callback: function(options, success, response) {
         if (addmod == true) {
         mostrarMensaje(1, perfil.etiquetas.tlADDInver);
         modelo.store_gestionar_inversiones.reload();
         } else {
         mostrarMensaje(1, perfil.etiquetas.tlADDInverMod);
         modelo.store_gestionar_inversiones.reload();
         }
         _this.mymask.hide();
         }
         });
         if (aplicar == false) {
         vista.win_add_inversiones.hide();
         }
         }
         }
         }*/


        function adicionarInversion(aplicar) {
            arraypresupuesto = new Array();
            records = modelo.stPresupuesto.getModifiedRecords();
            modelo.stPresupuesto.commitChanges();
            var changeClasif = false;
            for (var i = 0; i < records.length; i++) {
                arraypresupuesto.push(records[i].data);
            }
            arrayfin = new Array();
            recordsfinan = modelo.store_Financiamiento.getModifiedRecords();
            //recordsfinan = modelo.store_Financiamiento;/*.getModifiedRecords();*/


            //comprobar que exista financiamiento en el store de financiamiento
            if (modelo.store_Financiamiento.getCount() > 0) {

                //comprobar que en el store de financiamiento existan los valores: quien financia, como se financia, valor y moneda
                modelo.store_Financiamiento.commitChanges();
                var valFinanciamientoVacios = false;
                for (var i = 0; i < recordsfinan.length; i++) {
                    arrayfin.push(recordsfinan[i].data);

                    if (recordsfinan[i].data.financi == false || recordsfinan[i].data.valor == false || recordsfinan[i].data.moneda == false || recordsfinan[i].data.tipo == false) {
                        valFinanciamientoVacios = true;
                        break;
                    }
                }

                /*for (var i = 0; i <= recordsfinan.getCount(); i++) {
                 //console.info(recordsfinan.getAt(i));
                 var record=recordsfinan.getAt(i);
                 arrayfin.push(record);
                 if(record.data.financi== false || record.valor== false || record.moneda== false || record.tipo== false){
                 valFinanciamientoVacios = true;
                 break;
                 }
                 }*/

                if (addmod == true) {
                    if (arrayfin.length != 0)
                        comprobacion = true;
                    else
                        comprobacion = false;
                }
                else
                    comprobacion = true;

                //console.info(comprobacion);
                if (valFinanciamientoVacios == false && comprobacion == true) {
                    arrayliquido = new Array();
                    recordliqui = modelo.stImportacion.getModifiedRecords();
                    modelo.stImportacion.commitChanges();
                    for (var i = 0; i < recordliqui.length; i++) {
                        arrayliquido.push(recordliqui[i].data);
                    }
                    if (vista.sm_inversiones.getSelected()) {
                        var selecti = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion;
                        vista.pgestionar_componentes.expand(true);
                        if (vista.cmbClasificacion.getValue() != vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idtipoinversion && addmod == false) {
                            changeClasif = true;
                        } else {
                            changeClasif = false;
                        }
                    }
                    if (addmod == false && vista.sm_inversiones.getSelected()) {
                        idclasfAntes = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idtipoinversion
                    } else {
                        idclasfAntes = null;
                    }
                    if (vista.ChkFastTrack.getValue() == true) {
                        fasttrack = 1;
                    } else {
                        fasttrack = 0;
                    }
                    if (_this.iddpt) {
                        provincia = _this.iddpt;
                    } else {
                        provincia = vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idprovincia;
                    }

                    monedaP = validarMoneda(modelo.stPresupuesto.data, addmod);
                    monedaF = validarMoneda(modelo.store_Financiamiento.data, addmod);

                    monedaErog = validarMoneda(modelo.stImportacion.data, addmod);
                    if (monedaP || monedaErog) {
                        mostrarMensaje(1, "Existe alguna moneda que se encuentra repetida.");
                    }
                    else {

                        _this.mymask.show();
                        Ext.Ajax.request({
                            url: 'adicionarInversiones',
                            params: {
                                idespecialidad: idorganismo,
                                idinversion: (selecti && !addmod) ? selecti : 0,
                                denominacion: vista.tfdenominacion.getValue(),
                                idclasificacion: vista.cmbClasificacion.getValue(),
                                idejercicio: vista.cmbEjercicio.getValue(),
                                ejercicio: vista.cmbEjercicio.getRawValue(),
                                idtipoinversion: vista.CmbTipoInversion.getValue(),
                                idprogramada: vista.CmbProgramada.getValue(),
                                idcaracteristica: vista.CmbCaracteristica.getValue(),
                                idforma: vista.CmbFormaDePropiedad.getValue(),
                                idefecto: vista.CmbEfectoEnComercio.getValue(),
                                idobjetivo: vista.CmbObjetivo.getValue(),
                                iddatdesempenno: vista.CmbDesempeno.getValue(),
                                fasttrack: fasttrack,
                                presupuesto: Ext.encode(arraypresupuesto),
                                financiamiento: Ext.encode(arrayfin),
                                liquido: Ext.encode(arrayliquido),
                                provincia: provincia,
                                fechainicio: vista.tfFechaInicio.getValue().format('d/m/Y'),
                                fechafin: vista.tfFechaFin.getValue().format('d/m/Y'),
                                analpostinversiones: vista.tfanalisis.getValue(),
                                observaciones: vista.Observacion.getValue(),
                                changeClasif: changeClasif,
                                idclasfAntes: idclasfAntes,
                                addmod: addmod

                            },
                            callback: function(options, success, response) {
                                if (addmod == true) {
                                    mostrarMensaje(1, perfil.etiquetas.tlADDInver);
                                    modelo.store_gestionar_inversiones.reload();
                                } else {
                                    mostrarMensaje(1, perfil.etiquetas.tlADDInverMod);
                                    modelo.store_gestionar_inversiones.reload();
                                }
                                _this.mymask.hide();
                            }
                        });
                        if (aplicar == false) {
                            vista.win_add_inversiones.hide();
                        }
                        //}
                    }
                } else {
                    mostrarMensaje(1, "Los valores: Quién financia, Cómo se financia, Valor y Moneda son necesarios en el Financiamiento ");
                }
            } else {
                mostrarMensaje(1, "La inversión debe tener un financiamiento."); //perfil.etiquetas.msgError
            }
        }


        function importarInversiones() {
            try {
                if (vista.fpbuscar.getForm().isValid())
                {
                    /*var barraImport = Ext.MessageBox.show({
                     title: 'Por favor espere...',
                     width: 300,
                     wait: true,
                     progress: true,
                     closable: false,
                     animEl: 'mb6',
                     msg: 'Importando'
                     });*/
                    var barraImport = Ext.MessageBox.show({
                        msg: 'Por favor espere...',
                        width: 270,
                        wait: true,
                        progress: true,
                        closable: false

                    });
                    vista.fpbuscar.getForm().submit(
                            {
                                url: 'importarFicheroInversion',
                                timeout: 1800000,
                                method: 'POST',
                                params: {
                                    idejercicio: vista.cmbEjercicio.getValue(),
                                    tipoexcel: vista.cmbTiposExcel.getValue()
                                },
                                failure: function(form, action) {
                                    console.log(action.result.cod);

                                    mostrarMensaje(action.result.tipo, action.result.mensaje);

                                    vista.winImp.hide();



                                    /* switch (action.result.cod) {
                                     case 1:
                                     mostrarMensaje(1,'Los datos se han importado satisfactoriamente.');
                                     break;
                                     case 4:
                                     mostrarMensaje(6,'El fichero no tiene el formato correcto.');
                                     break;
                                     case 5:
                                     mostrarMensaje(6,'Los datos para importar son incorrectos.');
                                     break;
                                     }*/
                                    barraImport.hide();
                                    //winImp.hide();
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
                    idelemento: 77168, //vista.grid_gestionar_elementos.getSelectionModel().getSelected().data.idetapaelementoinversion,
                    denominacionetapa: 'TOTAL EQUIPOS', //vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.denominacion,
                    idetapainversion: 39916 //vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa
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
            })
        }
        function recargaele(store, limit) {
            store.reload({
                params: {
                    start: 0,
                    limit: limit != undefined ? limit : 2
                }
            })
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
                vista.win_add_inversiones.setTitle(idioma.tlModInv);
                vista.tfdenominacion.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.denominacion);
                vista.CmbFormaDePropiedad.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idformapropiedad);
                vista.CmbObjetivo.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idobjetivo);
                vista.cmbClasificacion.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idtipoinversion);
                vista.tfProvincia.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.provincia);
                vista.CmbEfectoEnComercio.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idefectocomercial);
                vista.CmbTipoInversion.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idtipoinversionprograma);
                vista.CmbProgramada.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idprograma);
                vista.tfFechaInicio.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.fechainicio);
                vista.tfFechaFin.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.fechafin);
                vista.CmbCaracteristica.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idcaracteristica);
                vista.tfanalisis.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.analpostinversiones);
                vista.Observacion.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.observaciones);
                vista.CmbDesempeno.setValue(vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.iddatdesempenno);
                Ext.getCmp('btnaplicar').hide();
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
                Ext.getCmp('btnaplicar').show();
                vista.tfFechaFin.reset();
                vista.tfProvincia.reset();
                vista.tfFechaInicio.reset();
                vista.cmbClasificacion.clearValue();
                vista.CmbEfectoEnComercio.clearValue();
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
        }

        function adicionarequipos() {
            var arrayequipo = [];
            var records = vista.grid_addEquipos.getSelectionModel().getSelections();
            for (i = 0; i < vista.grid_addEquipos.getSelectionModel().getCount(); i++) {
                arrayequipo.push(records[i].data);
            }
            if (arrayequipo.length != 0) {
                if (arrayequipo.length > 1) {
                    mensajemascara = 'Adicionando equipos.';
                }
                else {
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
                        equipos: Ext.encode(arrayequipo),
                        idetapainversion: vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa,
                        idejercicio: vista.cmbEjercicio.getValue(),
                        identidadmodelo: vista.CmbEntidadModelo.getValue()

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
                mostrarMensaje(2, perfil.etiquetas.tlDelEquipo, function(btnPress) {
                    if (btnPress === 'ok') {
                        var valores = vista.grid_equipos.getSelectionModel().getSelections();
                        var arreglo = [];
                        for (i = 0; i < valores.length; i++) {
                            arreglo[i] = valores[i].data.idetapaequipos;
                        }
                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarEquipos",
                            params: {
                                idetapaequipos: Ext.encode(arreglo)
                            },
                            callback: function(options, success, response) {
                                mostrarMensaje(1, 'El(Los) equipo(s) se ha(n) eliminado satisfactoriamente.');
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
                    if (records[i].data.adquirir != null && records[i].data.comprar != null) {
                        records[i].data.precio = _this.cleanComa(records[i].data.precio);
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
                            idetapaequipos: Ext.encode(arrayEquipo)
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
                arrayEquipo.push(records[i].data);
            }
            modelo.store_gequipos.load({
                params: {
                    start: 0,
                    limit: 20
                },
                callback: function() {
                    Ext.Ajax.request({
                        url: 'guardarEquipos',
                        waitMsg: "Actualizando...",
                        params: {
                            idetapaequipos: Ext.encode(arrayEquipo)
                        },
                        callback: function(options, success, response) {
                            mostrarMensaje(1, 'El(Los) equipo(s) ha(n)sido actualizado(s) satisfactoriamente.');
                            recarga(modelo.store_gequipos, 20);
                        }
                    });
                }
            });
            _this.mymask.hide();
        });

        _this.cleanComa = function(v) {
            v = v.replace(/\,/g, ''); //sacar coma repetida
            return v;
        }

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
    }
};
