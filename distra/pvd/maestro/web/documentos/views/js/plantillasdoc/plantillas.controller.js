/*
 * Gestionar plantillas.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Documentos
 * @uses Pvd.Documentos.Plantillas
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Documentos.Plantillas');

Pvd.Documentos.Plantillas.Controlador = {
    init: function (idioma, vista, modelo) {
        var plantillaselect = null;
        var accion = 'add';
        var winRepShow = 0;
        var winDisShow = 0;
        var winGest = 0;
        var busc = 0;

        vista.btnAdicionar.focus();
        modelo.stPlantillas.load({params: {start: 0, limit: 15}});
        vista.btnAdicionar.on('click', function () {
            vista.tfdenom.focus(true, 500);
            vista.ventanaGestion.setTitle(idioma.lbAddplantilla);
            accion = 'add';
            vista.ventanaGestion.show();
            vista.btnAplicar.show();
            modelo.stConfiguraciones.load();
            if (vista.gpConfiguraciones.getSelectionModel().getSelections().length >0) {
                vista.gpConfiguraciones.getSelectionModel().clearSelections();
            }
            if (vista.gpConfigAsignacion.getSelectionModel().getSelections().length > 0) {
                vista.gpConfigAsignacion.getSelectionModel().clearSelections();
            }
        });

        vista.btnModificar.on('click', function () {
            accion = 'mod';
             vista.tfdenom.focus(true, 500);
             vista.ventanaGestion.setTitle(idioma.lbAModplantilla);
             vista.ventanaGestion.show();
             vista.btnAplicar.hide();
             vista.tfdenom.setValue(plantillaselect.denominacion);
             vista.dfFInicio.setValue(plantillaselect.fdesde);
             vista.dfFFin.setValue(plantillaselect.fhasta);
             vista.tadescripcion.setValue(plantillaselect.descripcion);
             cargarPlantillSeleccionados();
             modelo.stConfiguraciones.load();
        });

        vista.ventanaGestion.on('show', function () {
            vista.tbaddAccion.setActiveTab(1);
            vista.tbaddAccion.setActiveTab(0);
            vista.formularioGestion.getForm().reset();
        });

        modelo.stConfiguraciones.on('load', function () {
            if (accion == 'mod') {
                cargarConfigSeleccionados();
            }
        });

        modelo.stPlantillas.on('load', function (st) {
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
            vista.btnDisennar.disable();
            vista.btnReplicar.disable();
            vista.btnVer.disable();
            vista.gpPlantillas.getSelectionModel().clearSelections();
            if (busc == 1 && st.getCount() == 0) {
                mostrarMensaje(1, idioma.lbNoDatosBusc);
                busc = 0;
            } else if (st.getCount() == 0) {
                mostrarMensaje(1, idioma.lbNoDatos);
            }
        });

        vista.gpPlantillas.getSelectionModel().on('rowselect', function () {
            plantillaselect = vista.gpPlantillas.getSelectionModel().getSelected().data;
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            vista.btnDisennar.enable();
            vista.btnReplicar.enable();
            vista.btnVer.enable();
        });

        vista.gpPlantillas.on('rowdblclick', function () {
            disennarPlantilla();
        });

        vista.btnDisennar.on('click', function () {
            disennarPlantilla();
        });

        vista.btnVer.on('click', function (th, e) {
            var win = new PVD.Plantilla.Contenedor({
                idplantilla: plantillaselect.idplantilladoc,
                title: plantillaselect.denominacion,
                margenes: '8, 8, 8, 8'
            });
            win.show();
            win.maximize();
        });

        vista.ventanaDisennar.on('show', function () {
            winDisShow = 1;
        });

        vista.ventanaDisennar.on('hide', function () {
            winDisShow = 0;
        });

        vista.ventanaGestion.on('show', function () {
            winGest = 1;
        });

        vista.ventanaGestion.on('hide', function () {
            winGest = 0;
        });

        vista.btnCancelar.on('click', function () {
            vista.formularioGestion.getForm().reset();
            vista.ventanaGestion.hide();
        });

        vista.btnEliminar.on('click', function () {
            eliminarPlantilla();
        });

        vista.btnBuscar.on('click', function () {
            buscarPlantilla();
        });

        vista.btnLimpiar.on('click', function () {
            vista.tfbuscar.reset();
            vista.dfFIniciob.reset();
            vista.dfFFinb.reset();
            modelo.stPlantillas.load({params: {start: 0, limit: 15}});
        });

        vista.btnAceptar.on('click', function () {
            guardarDatos('ACP');
        });

        vista.btnAplicar.on('click', function () {
            guardarDatos('APL');
        });

        vista.btnReplicar.on('click', function () {
            vista.ventanaReplicar.show();
            if (winRepShow == 1) {
                vista.tpEstruct.getLoader().load(vista.tpEstruct.getRootNode());
            }
            vista.tpEstruct.getRootNode().expand();
            winRepShow = 1;
        });

        vista.btnAceptarRep.setHandler(function () {
            var checkestructuras = vista.tpEstruct.getChecked();
            if (checkestructuras.length > 0) {
                var arrayidestructuras = new Array();
                for (i = 0; i < checkestructuras.length; i++) {
                    arrayidestructuras.push(checkestructuras[i].id);
                }
                Ext.getBody().mask(idioma.maskRepli);
                var rec = vista.gpPlantillas.getSelectionModel().getSelected().data;
                Ext.Ajax.request({
                    url: 'replicarEstructura',
                    params: {
                        idplantilla: rec.idplantilladoc,
                        entidad: rec.entidad,
                        estructuras: Ext.encode(arrayidestructuras)
                    },
                    callback: function () {
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData == 'success') {
                            mostrarMensaje(7, idioma.msReplicar);
                        }
                        vista.ventanaReplicar.hide();
                        Ext.getBody().unmask();

                    }
                });
            }
        });

        function disennarPlantilla() {
            Ext.Ajax.request({
                url: 'getConfiguracionesByIdPlantilla',
                params: {idplantilla: plantillaselect.idplantilladoc},
                callback: function () {
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    var configuraciones = new Array();
                    for (i = 0; i < responseData.length; i++) {
                        configuraciones.push(responseData[i].idconfiguracion);
                    }
                    this.panelEditor = new Pvd.Documentos.Plantillas.PanelEditor({idioma: idioma,
                        idplantilla: plantillaselect.idplantilladoc, configuraciones: configuraciones});
                    vista.ventanaDisennar.add(this.panelEditor);
                    vista.ventanaDisennar.show();
                    vista.ventanaDisennar.maximize();
                }
            });
        }

        function cargarConfigSeleccionados() {
            Ext.Ajax.request({
                url: 'getConfiguracionesByIdPlantilla',
                params: {idplantilla: plantillaselect.idplantilladoc},
                callback: function () {
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    var objrec = [];
                    for (i = 0; i < responseData.length; i++) {
                        var obj = modelo.stConfiguraciones.getById(responseData[i].idconfiguracion);
                        objrec.push(obj);
                    }
                    vista.smConfiguraciones.selectRecords(objrec);
                }
            });
        }

        function cargarPlantillSeleccionados() {
            Ext.Ajax.request({
                url: 'getConfAsigByIdPlantilla',
                params: {idplantilla: plantillaselect.idplantilladoc},
                callback: function () {
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    if (responseData.length > 0) {
                        var objrec = [];
                        for (l = 0; l < responseData.length; l++) {
                            for (i = 0; i < modelo.stConfAsignacion.data.length; i++) {
                                if (modelo.stConfAsignacion.data.items[i].data.id == responseData[l].id) {
                                    objrec.push(modelo.stConfAsignacion.data.items[i]);
                                }
                            }
                        }
                       vista.smConfAsig.selectRecords(objrec);
                    }
                }
            });
        }

        function guardarDatos(btnpress) {
            var tipoplantconfig = new Array();
            var configAsig = vista.gpConfigAsignacion.getSelectionModel().getSelections();
            for (i = 0; i < configAsig.length; i++) {
                tipoplantconfig.push(configAsig[i].data.id);
            }
            var configuraciones = new Array();
            var configSelect = vista.gpConfiguraciones.getSelectionModel().getSelections();
            for (i = 0; i < configSelect.length; i++) {
                configuraciones.push(configSelect[i].data.idconfiguracion);
            }
            if (vista.formularioGestion.getForm().isValid()) {
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addPlantilla' : 'updatePlantilla'),
                    params: {
                        idplantilla: accion == 'add' ? -1 : plantillaselect.idplantilladoc,
                        denominacion: vista.tfdenom.getValue(),
                        descripcion: vista.tadescripcion.getValue(),
                        fdesde: vista.dfFInicio.getRawValue(),
                        fhasta: vista.dfFFin.getRawValue(),
                        tipoplantconfig: Ext.encode(tipoplantconfig),
                        arrayIdConfig: Ext.encode(configuraciones)
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData == true) {
                            if (accion == 'mod') {
                                mostrarMensaje(1, idioma.msgCorrectoMod);
                            } else {
                                mostrarMensaje(1, idioma.msgCorrectoAdd);
                            }
                            if (btnpress == 'ACP') {
                                vista.ventanaGestion.hide();
                            }
                            vista.formularioGestion.getForm().reset();
                            if (vista.gpConfiguraciones.getSelectionModel().getSelections().length > 0) {
                                vista.gpConfiguraciones.getSelectionModel().clearSelections();
                            }
                            if (vista.gpConfigAsignacion.getSelectionModel().getSelections().length > 0) {
                                vista.gpConfigAsignacion.getSelectionModel().clearSelections();
                            }
                            modelo.stPlantillas.reload();
                        } else if (responseData == 2) {
                            mostrarMensaje(6, 'La denominación no existe.');
                        } else
                            mostrarMensaje(6, idioma.lbMsgAddFail);
                    }
                });
            } else {
                mostrarMensaje(6, 'Debe llenar todos los campos.');
            }
        }

        function eliminarPlantilla() {
            mostrarMensaje(2, idioma.lbTitMsgSeguroEliminar, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: 'deletePlantilla',
                        params: {idplantilla: plantillaselect.idplantilladoc},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false)
                                mostrarMensaje(6, idioma.lbDeleteFail);
                            else {
                                mostrarMensaje(1, idioma.lbMsgDeExito);
                            }
                            modelo.stPlantillas.reload();
                        }
                    });
                }
            });
        }

        function buscarPlantilla() {
            modelo.stPlantillas.load({params: {start: 0, limit: 15,
                denominacion: vista.tfbuscar.getValue(),
                fdesde: vista.dfFIniciob.getRawValue(),
                fhasta: vista.dfFFinb.getRawValue()
            }});
            busc = 1;
        }

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'imlhbxdv',
                alt: true,
                stopEvent: true,
                handler: function (k, e) {
                    switch (k) {
                        case 73:
                        { //i para adicionar
                            if (!vista.btnAdicionar.disabled) {
                                vista.ventanaGestion.setTitle(idioma.lbAddplantilla);
                                vista.ventanaGestion.show();
                                vista.btnAplicar.show();
                                accion = 'add';
                            }
                            break;
                        }
                        case 77:
                        { //m para modificar
                            if (!vista.btnModificar.disabled && winGest == 0) {
                                vista.ventanaGestion.setTitle(idioma.lbAModplantilla);
                                vista.ventanaGestion.show();
                                vista.btnAplicar.hide();
                                vista.tfdenom.setValue(plantillaselect.denominacion);
                                vista.dfFInicio.setValue(plantillaselect.fdesde);
                                vista.dfFFin.setValue(plantillaselect.fhasta);
                                vista.tadescripcion.setValue(plantillaselect.descripcion);
                                accion = 'mod';
                            }
                            break;
                        }
                        case 76:
                        { //l para limpiar
                            if (!vista.btnLimpiar.disabled) {
                                vista.tfbuscar.reset();
                                vista.dfFIniciob.reset();
                                vista.dfFFinb.reset();
                                modelo.stPlantillas.load({params: {start: 0, limit: 15}});
                            }
                            break;
                        }
                        case 72:
                        { //h para ayuda
                            var title = 'Ayuda de gestionar plantillas';
                            var referencia = '';
                            help.show(title, referencia);
                        }
                        case 66:
                        { //b para buscar
                            buscarPlantilla();
                            break;
                        }
                        case 88:
                        { //x para cancelar
                            if (!vista.btnCancelar.disabled) {
                                vista.formularioGestion.getForm().reset();
                                vista.ventanaGestion.hide();
                            }
                            break;
                        }
                        case 68:
                        { //d para diseñar plantilla
                            if (!vista.btnDisennar.disabled && winDisShow == 0) {
                                Ext.Ajax.request({
                                    url: 'getConfiguracionesByIdPlantilla',
                                    params: {idplantilla: plantillaselect.idplantilladoc},
                                    callback: function () {
                                    },
                                    success: function (r) {
                                        var responseData = Ext.decode(r.responseText);
                                        var configuraciones = new Array();
                                        for (i = 0; i < responseData.length; i++) {
                                            configuraciones.push(responseData[i].idconfiguracion);
                                        }
                                        this.panelEditor = new Pvd.Documentos.Plantillas.PanelEditor({idioma: idioma,
                                            idplantilla: plantillaselect.idplantilladoc, configuraciones: configuraciones});
                                        vista.ventanaDisennar.add(this.panelEditor);
                                        vista.ventanaDisennar.show();
                                        vista.ventanaDisennar.maximize();
                                    }
                                });
                            }
                            break;
                        }
                        case 86:
                        { //v para ver
                            if (!vista.btnVer.disabled) {
                                var win = new PVD.Plantilla.Contenedor({
                                    idplantilla: plantillaselect.idplantilladoc,
                                    title: plantillaselect.denominacion,
                                    margenes: '8, 8, 8, 8'
                                });
                                win.show();
                                win.maximize();
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar
                fn: function () {
                    if (!vista.btnEliminar.disabled && winDisShow == 0 && winGest == 0) {
                        eliminarPlantilla();
                    }
                }
            },
            {
                key: 13,//enter para aceptar
                fn: function () {
                    if (vista.btnAceptar.isVisible()) {
                        vista.btnAceptar.focus();
                        guardarDatos('ACP');
                    }
                }
            },
            {
                key: 80,//p para aplicar
                alt: true,
                ctrl: true,
                fn: function () {
                    if (vista.btnAplicar.isVisible()) {
                        guardarDatos('APL');
                    }
                }
            }
        ]);
    }
};
