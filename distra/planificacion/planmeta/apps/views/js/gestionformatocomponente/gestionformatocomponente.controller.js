Ext.ns('Gestionar.formato');

UCID.portal.cargarEtiquetas('gestionformatocomponente', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;

    var modelo = Gestionar.formato.Modelo;
    modelo.init();

    var vista = Gestionar.formato.Vista;
    vista.init(idioma, modelo);

    var acciones, mensaje = "";
    var teclascalientes;

    Gestionar.formato.Controlador.init(idioma, vista, modelo);
});

Gestionar.formato.Controlador = {
    init: function(idioma, vista, modelo) {
        _this = this;
        _this.addMod;   //bandera de adicionar o modificar formato componente
        _this.addModComponente;     //bandera de adicionar o modificar componente
        _this.asoDes;     //bandera de asociar o desasociar componente
        _this.rowIndex;     //index del grid componente
        _this.orden = 1;    //orden de los componentes...
        _this.apl = false;   //bandera para el boton aplicar de las ventanas
        /**************************TECLAS CALIENTES****************/
        
        map = new Ext.KeyMap(Ext.getDoc(), [{
                key: 'Ll',
                alt: true,
                fn: function() {
                    filtrosFormatoComponente.clearFilters();
                }
            }, {
                key: 'Hh',
                alt: true,
                fn: function() {
                }
            }, {
                key: 'Zz',
                alt: true,
                ctrl: true,
                fn: function() {
                }
            }, {
                key: 46,
                fn: function() {
                    teclascalientes.disable();
                    vista.btn_eliminar_formato.fireEvent('click');
                    teclascalientes.enable();
                }
            }, {
                key: 'Ii',
                alt: true,
                fn: function() {
                    if (vista.btn_adicionar_formato.enable())
                    {
                        vista.btn_adicionar_formato.fireEvent('click');

                    }
                }
            }, {
                key: 'Mm',
                alt: true,
                fn: function() {
                    vista.btn_modificar_formato.fireEvent('click');
                }
            }, {
                key: 'Qq',
                alt: true,
                fn: function() {
                    Ext.getCmp('btnAprobar').fireEvent('click');
                }
            }, {
                key: 'Ww',
                alt: true,
                fn: function() {
                    Ext.getCmp('btnDesAprobar').fireEvent('click');
                }
            }, {
                key: 'Tt',
                alt: true,
                fn: function() {
                    vista.btn_activar_formato.fireEvent('click');
                }
            }, {
                key: 'Ff',
                alt: true,
                fn: function() {
                    vista.btn_desactivar_formato.fireEvent('click');
                }
            }, {
                key: 'Gg',
                alt: true,
                fn: function() {
                    vista.btn_guardar_elemento.fireEvent('click');
                }
            }, {
                key: 'kK',
                alt: true,
                fn: function() {
                    vista.btn_asociar_componente.fireEvent('click');
                }
            }, {
                key: 'Uu',
                alt: true,
                fn: function() {
                    vista.btn_desasociar_componente.fireEvent('click');
                }
            }
        ]);

        /**************************FIN DE TECLAS CALIENTES****************/

        teclascalientes = new Ext.KeyMap(Ext.getBody(), [
            {
                key: 'Ll',
                ctrl: true,
                alt: true,
                scope: this,
                stopEvent: true,
                fn: function(_this) {
                    map.disable();
                    Ext.getCmp('btnLimpiarT').handler.call(this);
                    map.enable();
                }

            }, {
                key: 'Ii',
                ctrl: true,
                alt: true,
                scope: this,
                stopEvent: true,
                fn: function(_this) {
                    map.disable();
                    Ext.getCmp('btnAdicionar').fireEvent('click');
                    map.enable();

                }
            }, {
                key: 46,
                shift: true,
                fn: function() {
                    map.disable();
                    if (vista.btnElimComponente.enable())
                        vista.btnElimComponente.fireEvent('click');
                    map.enable();
                }
            }, {
                key: 'Mm',
                shift: true,
                alt: true,
                fn: function() {
                    map.disable();
                    vista.btnModComponente.fireEvent('click');
                    map.enable();
                }
            }, {
                key: 'Ii',
                shift: true,
                alt: true,
                fn: function() {
                    if (vista.btnAddComponente.enable())
                    {
                        map.disable();
                        vista.btnAddComponente.fireEvent('click');
                        map.enable();

                    }
                }
            }, {
                key: 46,
                ctrl: true,
                scope: this,
                stopEvent: true,
                fn: function(_this) {
                    map.disable();
                    Ext.getCmp('btnEliminar').fireEvent('click');
                    map.enable();
                }

            }

        ]);

        teclascalientes.enable();

        //focus en el campo denominacion del WinAdicionar Formato de Componente
        vista.window_general_formato.on({
            beforeshow: function() {

                Ext.getCmp('idtfdenominacionAdicionarFC').focus(true, 700);
            }
        });

        //focus en el campo denominacion del WinAddComponente
        vista.winAddComponente.on({
            beforeshow: function() {
                Ext.getCmp('idtfdenominacionAsociarComponente').focus(true, 700);
            }
        });

        //validar deshabilitar botones si no se ha llenado el campo denominacion de la WinAsociarComponente
        vista.tfDenom.on({
            keyup: function(tf, e) {

                if (tf.getValue() != '') {
                    vista.btnAceptarAddComp.enable();
                    vista.btnAplicarAddComp.enable();
                }
                else
                {
                    vista.btnAceptarAddComp.disable();
                    vista.btnAplicarAddComp.disable();
                }
            }

        });

        //validar deshabilitar botones si no se ha llenado el campo denominacion de la WinAddComponente
        vista.denominacion.on({
            keyup: function(tf, e) {

                if (tf.getValue() != '') {
                    vista.btn_aceptar_formato.enable();
                    vista.btn_aplicar_formato.enable();
                }
                else
                {
                    vista.btn_aceptar_formato.disable();
                    vista.btn_aplicar_formato.disable();
                }
            }

        });

        modelo.store_gestionar_elementos.on({
            beforeload: function(st) {
                st.baseParams.idcomponente = vista.sm_componentes.getSelected().data.idetapa;
                st.baseParams.limit = 20;
                st.baseParams.start = 0;
            }
        });




        //EVENTOS AL SELECCIONAR UN ELEMENTO DE GRID FORMATO
        vista.sm_formato.on({
            rowselect: function() {
                //si hay seleccionado solo una fila valido aqui
                if (vista.grid_gestionar_formato.getSelectionModel().getSelections().length == 1) {
                    if (vista.grid_gestionar_formato.getSelectionModel().getSelected().data.uso != 1) {
                        //desactivado y desaprobado
                        if (vista.grid_gestionar_formato.getSelectionModel().getSelected().data.activado == 0 && vista.grid_gestionar_formato.getSelectionModel().getSelected().data.aprobado == 0) {
                            Ext.getCmp('btnAprobar').enable();
                            vista.btn_activar_formato.disable();
                            vista.btn_desactivar_formato.disable();
                            Ext.getCmp('btnDesAprobar').disable();
                            vista.btn_eliminar_formato.enable();
                            vista.btn_modificar_formato.enable();
                        }
                        //desactivado y aprobado
                        else if (vista.grid_gestionar_formato.getSelectionModel().getSelected().data.activado == 0 && vista.grid_gestionar_formato.getSelectionModel().getSelected().data.aprobado == 1) {
                            vista.btn_activar_formato.enable();
                            Ext.getCmp('btnDesAprobar').enable();
                            vista.btn_desactivar_formato.disable();
                            Ext.getCmp('btnAprobar').disable();
                            vista.btn_eliminar_formato.disable();
                        }
                        //activado y aprobado
                        else if (vista.grid_gestionar_formato.getSelectionModel().getSelected().data.activado == 1 && vista.grid_gestionar_formato.getSelectionModel().getSelected().data.aprobado == 1) {
                            vista.btn_desactivar_formato.enable();
                            vista.btn_activar_formato.disable();
                            Ext.getCmp('btnAprobar').disable();
                            Ext.getCmp('btnDesAprobar').disable();
                            vista.btn_eliminar_formato.disable();
                        }
                        //activado y desaprobado
                        else if (vista.grid_gestionar_formato.getSelectionModel().getSelected().data.activado == 1 && vista.grid_gestionar_formato.getSelectionModel().getSelected().data.aprobado == 0) {
                            vista.btn_desactivar_formato.enable();
                            vista.btn_activar_formato.disable();
                            Ext.getCmp('btnAprobar').disable();
                            Ext.getCmp('btnDesAprobar').disable();
                            vista.btn_eliminar_formato.disable();
                        }
                        vista.btn_asociar_componente.enable();
                        vista.btn_adicionar_elemento.enable();
                    }
                    else {//si esta en Uso entonces..
                        vista.btn_modificar_formato.enable();
                        if (vista.grid_gestionar_formato.getSelectionModel().getSelected().data.activado == 1 && vista.grid_gestionar_formato.getSelectionModel().getSelected().data.aprobado == 1) {
                            vista.btn_desactivar_formato.enable();
                            Ext.getCmp('btnAprobar').disable();
                            vista.btn_activar_formato.disable();
                            Ext.getCmp('btnDesAprobar').disable();
                            vista.btn_eliminar_formato.disable();
                        }
                        vista.btn_asociar_componente.disable();
                        vista.btn_adicionar_elemento.disable();
                    }
                }

                modelo.store_gestionar_componentes.load({
                    params: {
                        idformatoetapa: vista.sm_formato.getSelected().data.idformatoetapa,
                        start: 0,
                        limit: 20
                    },
                    callback: function(options, success, response) {
                        if (modelo.store_gestionar_componentes.getCount() > 0) {//expandir el componentes si tiene elementos
                            vista.panel_contenedor.expand();
                        } else
                            vista.panel_contenedor.collapse();
                    }
                });
            },
            rowdeselect: function() {
                vista.btn_modificar_formato.disable();
                vista.btn_eliminar_formato.disable();
                vista.btn_desactivar_formato.disable();
                Ext.getCmp('btnAprobar').disable();
                vista.btn_activar_formato.disable();
                Ext.getCmp('btnDesAprobar').disable();
                if (vista.sm_formato.getSelected()) {
                    if (vista.grid_gestionar_formato.getSelectionModel().getSelected().data.uso != 1) {
                        vista.btn_asociar_componente.enable();
                        vista.btn_adicionar_elemento.enable();
                    } else {
                        vista.btn_asociar_componente.disable();
                        vista.btn_adicionar_elemento.disable();
                    }
                }


            }
        });
//------------------------------- Formato ------------------------------------------
        modelo.store_gestionar_formato.load({
            params: {
                start: 0,
                limit: 20
            }
        });

        vista.btn_adicionar_formato.on('click', function() {
            _this.addMod = 1;
            vista.btn_aplicar_formato.show();
            vista.window_general_formato.setTitle(idioma.vtadicionarComponente);
            vista.formulario_general_formato.getForm().reset();
            vista.window_general_formato.show();
        });

        vista.btn_modificar_formato.on('click', function() {


            _this.addMod = 0;
            _this.mymask.show();
            Ext.Ajax.request({
                method: "POST",
                url: "cargarDatosModificarFormatoComponente",
                params: {
                    idformatocomponente: vista.sm_formato.getSelected().data.idformatoetapa
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    vista.btn_aplicar_formato.hide();
                    var responseData = Ext.decode(response.responseText);
                    vista.denominacion.setValue(responseData.denominacion);
                    vista.codigo.setValue(responseData.descripcion);
                    vista.window_general_formato.setTitle(idioma.vtmodificarComponente);
                    vista.window_general_formato.show();
                }
            });
        });

        vista.btn_eliminar_formato.on({
            click: function() {
                mostrarMensaje(2, idioma.msgEliminar, function(btnPress) {
                    if (btnPress === 'ok') {
                        _this.mymask.show();
                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarFormComp",
                            params: {
                                idformatocomponente: vista.sm_formato.getSelected().data.idformatoetapa
                            },
                            callback: function(options, success, response) {
                                _this.mymask.hide();
                                mostrarMensaje(1, idioma.msgConfEliminarForCom);
                                modelo.store_gestionar_formato.reload();
                            }
                        });
                    }
                });
            }
        });

        vista.btn_activar_formato.on({
            click: function() {
                mostrarMensaje(2, idioma.msgActFormatoComponente, function(btnPress) {
                    if (btnPress === 'ok') {
                        _this.activarDesactivar(vista.sm_formato.getSelected().data.idformatoetapa, 1);
                    }
                });
            }
        });

        vista.btn_desactivar_formato.on({
            click: function() {
                mostrarMensaje(2, idioma.msgDesFormatoComponente, function(btnPress) {
                    if (btnPress === 'ok') {
                        _this.activarDesactivar(vista.sm_formato.getSelected().data.idformatoetapa, 0);
                    }
                });
            }
        });

        Ext.getCmp('btnAprobar').on(
                'click', function() {
            mostrarMensaje(2, idioma.msgApraDesForCom, function(btnPress) {
                if (btnPress === 'ok') {
                    _this.aprobarDesaprobar(vista.sm_formato.getSelected().data.idformatoetapa, 1);
                }
            });
        }
        );

        Ext.getCmp('btnDesAprobar').on(
                'click', function() {

            mostrarMensaje(2, idioma.msgDesForCom, function(btnPress) {
                if (btnPress === 'ok') {
                    _this.aprobarDesaprobar(vista.sm_formato.getSelected().data.idformatoetapa, 0);
                }
            });
        }
        );

        _this.aprobarDesaprobar = function(idFormatocomponente, aproDesa) {//idFormatocomponente
            var valores = vista.sm_formato.getSelections();
            var arreglo = [];
            for (i = 0; i < valores.length; i++) {
                arreglo[i] = valores[i].data.idformatoetapa;
            }
            _this.mymask.show();
            Ext.Ajax.request({
                method: "POST",
                url: "aprobDesap",
                params: {
                    idformatoetapa: Ext.encode(arreglo),
                    idformatocomponente: idFormatocomponente,
                    aprobar: aproDesa
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    var mensaje = (aproDesa) ? idioma.msgConfAprobarrForCom : idioma.msgConfDesaprobarForCom;
                    mostrarMensaje(1, mensaje);
                    modelo.store_gestionar_formato.reload();
                }
            });
            vista.btn_asociar_componente.disable();
            vista.btn_adicionar_elemento.disable();
        };

        _this.activarDesactivar = function(idFormatocomponente, actDes) {
            var val = vista.sm_formato.getSelections();
            var arr = [];
            for (i = 0; i < val.length; i++) {
                arr[i] = val[i].data.idformatoetapa;
            }
            _this.mymask.show();
            Ext.Ajax.request({
                method: "POST",
                url: "actDesFormComp",
                params: {
                    idformatoetapa: Ext.encode(arr),
                    idformatocomponente: idFormatocomponente,
                    activar: actDes
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    var mensaje = (actDes) ? idioma.msgConfActivarForCom : idioma.msgConfDesactivarForCom;
                    mostrarMensaje(1, mensaje);
                    modelo.store_gestionar_formato.reload();
                }
            });
        };

        vista.btn_cancelar_formato.on('click', function() {
            vista.formulario_general_formato.getForm().reset();
            vista.window_general_formato.hide();
        });

        _this.validarNomformatocomp = function(add, apl) {
            if (add) {
                _this.mymask.show();
                Ext.Ajax.request({
                    method: "POST",
                    url: "mismoFormatoComponente",
                    params: {
                        denominacion: vista.denominacion.getValue()
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData) {
                            mostrarMensaje(1, idioma.mismoDenForComp);
                            _this.mymask.hide();
                        } else
                            _this.adicionarFormatoComponente(add, apl);
                    }
                });
            } else
                _this.adicionarFormatoComponente(add, apl);
        };

        //Se le pasa 1 si es adicionar ó 0 si es modificar
        _this.adicionarFormatoComponente = function(add, apl) {
            Ext.Ajax.request({
                method: "POST",
                url: "addModFormatoComponente",
                params: {
                    addMod: add,
                    idformatocomponente: (vista.sm_formato.getSelected()) ? vista.sm_formato.getSelected().data.idformatoetapa : 0,
                    denominacion: vista.denominacion.getValue(),
                    descripcion: vista.codigo.getValue()
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    if (apl == true) {
                        mostrarMensaje(1, idioma.msgAddFormatoComponente);
                        vista.formulario_general_formato.getForm().reset();
                        modelo.store_gestionar_formato.reload();
                    }
                    else {
                        var mensaje = (add) ? idioma.msgAddFormatoComponente : idioma.msgModFormatoComponente;
                        mostrarMensaje(1, mensaje);
                        vista.window_general_formato.hide();
                        vista.formulario_general_formato.getForm().reset();
                        modelo.store_gestionar_formato.reload();
                    }
                }
            });
        };


        //------------------------------- Componente ------------------------------------------
        vista.sm_componentes.on({
            rowselect: function(sm, rowIndex, record) {
                if (sm.getSelections().length < 2) {
                    _this.rowIndex = rowIndex;
                    var canRow = modelo.store_gestionar_componentes.getCount();
                    vista.btn_desasociar_componente.enable();
                    if (rowIndex == 0) {             //si es el primero
                        vista.btn_arriba.disable();
                        vista.btn_abajo.enable();
                        vista.btnguardar.enable();
                    }
                    if (canRow == 1) {               //si hay unos solo
                        vista.btn_arriba.disable();
                        vista.btn_abajo.disable();
                        vista.btnguardar.disable();
                        return;
                    }
                    if (rowIndex > 0 && rowIndex < canRow - 1) {      //si esta seleccionado los del medio
                        vista.btn_arriba.enable();
                        vista.btn_abajo.enable();
                        vista.btnguardar.enable();
                    }
                    if (rowIndex == canRow - 1) {          //si es el ultimo
                        vista.btn_arriba.enable();
                        vista.btn_abajo.disable();
                        vista.btnguardar.enable();
                    }

                    modelo.store_gestionar_elementos.load({
                        params: {
                            idcomponente: vista.sm_componentes.getSelected().data.idetapa
                        },
                        callback: function(options, success, response) {
                            if (modelo.store_gestionar_elementos.getCount() > 0) {
                                vista.panel_gestionar_elementos.expand();
                                modelo.store_gestionar_elementos.load();
                            } else
                                vista.panel_gestionar_elementos.expand();
                            modelo.store_gestionar_elementos.load();
                        }
                    });

                } else {
                    vista.btn_arriba.disable();
                    vista.btn_abajo.disable();
                    vista.btnguardar.disable();
                }
            },
            rowdeselect: function(sm, rowIndex, record) {
                if (!sm.hasSelection()) {
                    modelo.store_gestionar_elementos.removeAll();
                    vista.panel_gestionar_elementos.collapse();
                }
            }
        });

        vista.btn_arriba.on({
            click: function() {
                _this.Ordenar('up');
            }
        });

        vista.btn_abajo.on({
            click: function() {
                _this.Ordenar('down');
            }
        });

        vista.btnguardar.on({
            click: function() {
                _this.guardarPriorizarPlanes();
            }
        });

        _this.Ordenar = function(orden) {
            var j = 0;
            var contpri = _this.orden;
            var recordsSel = vista.sm_componentes.getSelected();
            modelo.store_gestionar_componentes.each(function(rec) {
                if (modelo.store_gestionar_componentes.getAt(j).data.idetapa == recordsSel.data.idetapa) {
                    var tmpdata = eval(uneval(modelo.store_gestionar_componentes.getAt(j).data));
                    if (orden == 'up' && j - 1 >= 0) {
                        modelo.store_gestionar_componentes.getAt(j).data = eval(uneval(modelo.store_gestionar_componentes.getAt(j - 1).data));
                        modelo.store_gestionar_componentes.getAt(j - 1).data = tmpdata;
                        modelo.store_gestionar_componentes.getAt(j - 1).commit();
                        vista.sm_componentes.selectRow(j - 1);
                    } else {
                        if (j + 1 < modelo.store_gestionar_componentes.getCount()) {
                            modelo.store_gestionar_componentes.getAt(j).data = eval(uneval(modelo.store_gestionar_componentes.getAt(j + 1).data));
                            modelo.store_gestionar_componentes.getAt(j + 1).data = tmpdata;
                            modelo.store_gestionar_componentes.getAt(j + 1).commit();
                            vista.sm_componentes.selectRow(j + 1);
                        }
                    }
                    modelo.store_gestionar_componentes.getAt(j).commit();
                }
                j++;
            });
            j = 0;
            modelo.store_gestionar_componentes.each(function(rec) {
                modelo.store_gestionar_componentes.getAt(j).data.orden = contpri++;
                modelo.store_gestionar_componentes.getAt(j).commit();
                j++;
            });
        };

        _this.guardarPriorizarPlanes = function() {
            if (modelo.store_gestionar_componentes.getCount() != 0) {
                arrComponentes = [];
                for (var i = 0; i < modelo.store_gestionar_componentes.getCount(); i++) {
                    arrComponentes.push({
                        idetapa: modelo.store_gestionar_componentes.getAt(i).data.idetapa,
                        orden: modelo.store_gestionar_componentes.getAt(i).data.orden,
                        idnombreetapa: modelo.store_gestionar_componentes.getAt(i).data.idnombreetapa,
                        idformatoetapa: modelo.store_gestionar_componentes.getAt(i).data.idformatoetapa
                    });
                }
                _this.mymask.show();
                Ext.Ajax.request({
                    url: 'actualizarComponentes',
                    params: {
                        planes_prioridad: Ext.encode(arrComponentes)
                    },
                    callback: function(options, success, response) {
                        modelo.store_gestionar_componentes.reload();
                        mostrarMensaje(1, idioma.msgActualizarOrden);
                        vista.btnguardar.disable();
                        vista.btn_abajo.disable();
                        vista.btn_arriba.disable();
                        vista.sm_componentes.selectFirstRow();
                        _this.mymask.hide();
                    }
                });
            } else {
                mostrarMensaje(1, 'Debe existir al menos un plan para priorizar.');
            }

        };


        vista.btn_asociar_componente.on({
            click: function() {
                _this.asoDes = true;
                _this.mymask.show();
                _this.idetaps = new Array();
                for (i = 0; i < modelo.store_gestionar_componentes.getCount(); i++) {
                    _this.idetaps.push(modelo.store_gestionar_componentes.getAt(i).data.idnombreetapa);
                }
                modelo.stAsocComponentes.load({
                    params: {
                        idetapas: Ext.encode(_this.idetaps),
                        idformatoetapa: vista.sm_formato.getSelected().data.idformatoetapa,
                        limit: 20,
                        start: 0
                    },
                    callback: function(options, success, response) {
                        vista.btnAplicarComp.disable();
                        vista.btnAceptarComp.disable();
                        vista.btnModComponente.disable();
                        vista.btnElimComponente.disable();
                        modelo.stFlujoTrabajo.load({
                            callback: function() {
                                _this.mymask.hide();
                                vista.winAsociarComponente.show();
                            }
                        });
                    }
                });
            }
        });

        vista.btn_desasociar_componente.on({
            click: function() {
                mostrarMensaje(2, idioma.msgEliminarDes, function(btnPress) {
                    if (btnPress === 'ok') {
                        _this.mymask.show();
                        var idnombreetapa = new Array();
                        for (i = 0; i < vista.sm_componentes.getSelections().length; i++) {
                            idnombreetapa[i] = vista.sm_componentes.getSelections()[i].data.idetapa;
                        }
                        Ext.Ajax.request({
                            method: "POST",
                            url: "desasociarComponente",
                            params: {
                                idnombrecomponente: Ext.encode(idnombreetapa)

                            },
                            callback: function(options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                _this.mymask.hide();
                                if (responseData.data == "-4")
                                    mostrarMensaje(1, idioma.msgConfEliminarComUso);
                                else
                                    mostrarMensaje(1, idioma.msgConfEliminarCom);
                                modelo.store_gestionar_componentes.reload();
                            }
                        });
                    }
                });
            }
        });

        vista.btnAddComponente.on({
            click: function() {
                _this.addModComponente = 1;
                Ext.getCmp('btnAplicarAddComp').show();
                Ext.getCmp('btnAplicarAddComp').disable();
                Ext.getCmp('btnAceptarAddComp').disable();

                vista.winAddComponente.setTitle(idioma.winAddComponente);
                vista.fpGestComponente.getForm().reset();
                vista.winAddComponente.show();
            }
        });

        vista.btnCancelarComp.on({
            click: function() {
                vista.btnAplicarComp.disable();
                vista.btnAceptarComp.disable();
                vista.btnModComponente.disable();
                vista.btnElimComponente.disable();
                vista.winAsociarComponente.hide();


            }
        });

        _this.denomCompSinMod;
        vista.btnModComponente.on({
            click: function() {
                _this.addModComponente = 0;
                _this.mymask.show();
                Ext.Ajax.request({
                    method: "POST",
                    url: "cargarDatosModificarComponente",
                    params: {
                        idnombrecomponente: vista.smAsocComponentes.getSelected().data.idnombreetapa
                    },
                    callback: function(options, success, response) {
                        _this.mymask.hide();
                        var responseData = Ext.decode(response.responseText);
                        _this.denomCompSinMod = responseData.denominacion;
                        vista.tfDenom.setValue(responseData.denominacion);
                        vista.taDescripc.setValue(responseData.descripcion);
//cargar el combo flujo de trabajo                        
                        Ext.getCmp('btnAplicarAddComp').hide();
                        vista.winAddComponente.setTitle(idioma.winModComponente);
                        vista.winAddComponente.show();
                    }
                });
            }
        });

        vista.btnElimComponente.on({
            click: function() {
                mostrarMensaje(2, idioma.msgEliminarCom, function(btnPress) {
                    if (btnPress === 'ok') {
                        _this.mymask.show();
                        idnombrecomp = new Array();
                        elementos = vista.smAsocComponentes.getSelections();
                        for (i = 0; i < elementos.length; i++) {
                            idnombrecomp.push(elementos[i].data.idnombreetapa);
                        }
                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarComp",
                            params: {
                                idnombrecomponente: Ext.encode(idnombrecomp)
                            },
                            callback: function(options, success, response) {
                                _this.mymask.hide();
                                mostrarMensaje(1, idioma.msgConfEliminarCom);
                                modelo.stAsocComponentes.reload();
                                vista.btnAceptarComp.disable();
                                vista.btnAplicarComp.disable();
                                vista.btnModComponente.disable();
                                vista.btnElimComponente.disable();
                            }
                        });
                    }
                });
            }
        });

        vista.btnCancelarAddComp.on({
            click: function() {
                vista.winAddComponente.hide();
            }
        });

        vista.btnAceptarAddComp.on({
            click: function() {
                if (vista.fpGestComponente.getForm().isValid()) {
                    if (_this.addModComponente)//adicionar
                        _this.validarMismoComponente(_this.addModComponente);
                    else {//modificar
                        (_this.denomCompSinMod == vista.tfDenom.getValue()) ?
                                _this.addComponente(_this.addModComponente, false) : _this.validarMismoComponente(_this.addModComponente);
                    }
                }
                else {
                    mostrarMensaje(1, idioma.msgError);
                }

            }
        });

        vista.btnAplicarAddComp.on({
            click: function() {
                if (vista.fpGestComponente.getForm().isValid()) {
                    _this.apl = true;
                    _this.validarMismoComponente(_this.addModComponente, _this.apl);
                } else {
                    mostrarMensaje(1, idioma.msgError);
                }
            }
        });

        vista.smAsocComponentes.on({
            rowselect: function(th, row, record) {
                if (modelo.stAsocComponentes.getCount() > 0 && th.getSelections().length < 2) {
                    vista.btnAplicarComp.enable();
                    vista.btnAceptarComp.enable();
                    vista.btnModComponente.enable();
                    vista.cbFlujoTrab.enable();
                    vista.btnElimComponente.enable();
                }
                if (th.getSelections().length > 1) {
                    vista.btnModComponente.disable();
                    vista.cbFlujoTrab.enable();
                    vista.cbFlujoTrab.clearValue();
                }
            },
            rowdeselect: function() {
                vista.btnAplicarComp.disable();
                vista.btnAceptarComp.disable();
                vista.btnModComponente.disable();
                vista.btnElimComponente.disable();
                vista.cbFlujoTrab.disable();
                vista.cbFlujoTrab.clearValue();
            }
        });

        vista.btnAceptarComp.on({
            click: function() {
                if (vista.cbFlujoTrab.getValue() != '') {
                    idnombrecomp = new Array();
                    elementos = vista.smAsocComponentes.getSelections();
                    for (i = 0; i < elementos.length; i++) {
                        idnombrecomp.push(elementos[i].data.idnombreetapa);
                    }
                    _this.asocComponente(vista.sm_formato.getSelected().data.idformatoetapa, idnombrecomp, vista.cbFlujoTrab.getValue(),
                            modelo.store_gestionar_componentes.getCount(), _this.asoDes, true);
                } else
                    mostrarMensaje(1, idioma.msgError);
            }
        });
        vista.btnAplicarComp.on({
            click: function() {
                if (vista.cbFlujoTrab.getValue() != '') {
                    idnombrecomp = new Array();
                    elementos = vista.smAsocComponentes.getSelections();
                    for (i = 0; i < elementos.length; i++) {
                        idnombrecomp.push(elementos[i].data.idnombreetapa);
                    }
                    _this.asocComponente(vista.sm_formato.getSelected().data.idformatoetapa, idnombrecomp, vista.cbFlujoTrab.getValue(),
                            modelo.store_gestionar_componentes.getCount(), _this.asoDes, false);
                } else
                    mostrarMensaje(1, idioma.msgError);
            }
        });

        _this.asocComponente = function(idformatoComponente, idComponente, idflujotrabajo, orden, asoDes, acepApl) {
            _this.mymask.show();
            Ext.Ajax.request({
                method: "POST",
                url: "asociarComponente",
                params: {
                    asoDes: asoDes,
                    idnombrecomponente: Ext.encode(idComponente),
                    idnombreformatocomponente: idformatoComponente,
                    idflujotrabajo: idflujotrabajo,
                    orden: orden
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    if (acepApl) {
                        vista.btnAplicarComp.disable();
                        vista.btnAceptarComp.disable();
                        vista.btnModComponente.disable();
                        vista.btnElimComponente.disable();
                        vista.winAsociarComponente.hide();
                        modelo.store_gestionar_componentes.reload();
                    } else {
                        modelo.store_gestionar_componentes.reload({
                            callback: function() {
                                modelo.stAsocComponentes.reload();
                                vista.cbFlujoTrab.clearValue();
                            }
                        });
                    }
                    (asoDes) ? mostrarMensaje(1, idioma.msgAsoFormatoComponente) : mostrarMensaje(1, idioma.msgDesConfFormatoComponente);
                }
            });
        };

        _this.validarMismoComponente = function(add, apl) {
            _this.mymask.show();
            Ext.Ajax.request({
                method: "POST",
                url: "mismoComponente",
                params: {
                    denominacion: vista.tfDenom.getValue()
                },
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.data) {
                        mostrarMensaje(1, idioma.mismoComp);
                        _this.mymask.hide();
                    } else
                        _this.addComponente(add, apl);
                }
            });
        };

        _this.addComponente = function(add, apl) {
            _this.mymask.show();
            Ext.Ajax.request({
                method: "POST",
                url: "addModComponente",
                params: {
                    addMod: add,
                    idcomponente: (vista.smAsocComponentes.getSelected()) ? vista.smAsocComponentes.getSelected().data.idnombreetapa : 0,
                    denominacion: vista.tfDenom.getValue(),
                    descripcion: vista.taDescripc.getValue(),
                    idflujotrabajo: vista.cbFlujoTrab.getValue()
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    if (apl == true) {
                        mostrarMensaje(1, idioma.msgAddComponente);
                        vista.fpGestComponente.getForm().reset();
                        modelo.stAsocComponentes.reload();
                    }
                    else {
                        var mensaje = (add) ? idioma.msgAddComponente : idioma.msgModComponente;
                        mostrarMensaje(1, mensaje);
                        vista.winAddComponente.hide();
                        vista.fpGestComponente.getForm().reset();
                        modelo.stAsocComponentes.reload();
                    }

                }
            });
        };

//------------------------------- Elemento ------------------------------------------
        vista.btn_adicionar_elemento.on('click', function() {
            Fila = Ext.data.Record.create({
                name: 'idetapa',
                type: 'numeric'
            }, /*{
             name: 'denelemento',
             type: 'string'
             },*/{
                name: 'documento',
                type: 'numeric'
            }, {
                name: 'denelemento',
                type: 'numeric'
            }, {
                name: 'idtipomodelo',
                type: 'string'
            });
            var p = new Fila({
                denominacion: '',
                denelemento: '',
                documento: "No",
                idetapa: vista.sm_componentes.getSelected().data.idetapa
            });
            modelo.store_gestionar_elementos.add(p);
        });

        vista.btn_guardar_elemento.on({
            click: function() {
                _this.addelemento();
            }
        });

        vista.btn_eliminar_elemento.on({
            click: function() {
                _this.eliminarelemento();
            }
        });


        _this.eliminarelemento = function() {
            idelementos = new Array();
            elementos = vista.sm_elementos.getSelections();
            for (i = 0; i < elementos.length; i++) {
                idelementos.push(elementos[i].data.idelemento);
            }
            mostrarMensaje(2, idioma.msgEliminarElemento, function(btnPress) {
                if (btnPress === 'ok') {
                    _this.mymask.show();
                    Ext.Ajax.request({
                        method: "POST",
                        url: "eliminarElemento",
                        params: {
                            idelemento: Ext.encode(idelementos)
                        },
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            _this.mymask.hide();
                            if (responseData.cod == 4)
                                mostrarMensaje(1, idioma.msgConfNoEliminarElem);
                            else {
                                mostrarMensaje(1, idioma.msgConfEliminarElem);
                                modelo.store_gestionar_elementos.reload();
                            }
                            vista.btn_guardar_elemento.disable();
                            vista.btn_eliminar_elemento.disable();
                            Ext.getCmp('btnDesasociardoc').disable();
                            Ext.getCmp('btnAsociardoc').disable();
                        }
                    });
                }
            });
        };

        _this.addelemento = function(add) {
            _this.mymask.show();
            records = new Array();
            records = modelo.store_gestionar_elementos.getModifiedRecords();
            modelo.store_gestionar_elementos.commitChanges();
            recordsEnviar = new Array();
            for (var i = 0; i < records.length; i++) {
                recordsEnviar.push(records[i].data);
            }
            if (records.length > 0) {
                Ext.Ajax.request({
                    method: "POST",
                    url: "addElemento",
                    params: {
                        record: Ext.encode(recordsEnviar)
                    },
                    callback: function(options, success, response) {
                        _this.mymask.hide();
                        mostrarMensaje(1, idioma.msgAddElementoo);
                        modelo.store_gestionar_elementos.reload();
                        vista.btn_guardar_elemento.disable();
                        vista.btn_eliminar_elemento.disable();
                        Ext.getCmp('btnDesasociardoc').disable();
                        Ext.getCmp('btnAsociardoc').disable();
                    }
                });
            }
            _this.mymask.hide();
        };
        vista.sm_elementos.on({
            rowselect: function(sm, rowIndex, record) {
                if (sm.getSelected().data.idelemento) {
                    vista.btn_guardar_elemento.enable();
                    vista.btn_eliminar_elemento.enable();
                    Ext.getCmp('btnDesasociardoc').enable();
                    Ext.getCmp('btnAsociardoc').enable();
                } else {
                    vista.btn_guardar_elemento.enable();
                    vista.btn_eliminar_elemento.disable();
                    Ext.getCmp('btnDesasociardoc').disable();
                    Ext.getCmp('btnAsociardoc').disable();
                }
                if (sm.getSelected().data.documento == 0)
                    Ext.getCmp('btnDesasociardoc').disable();
            }
        });

        vista.btn_cancelar_asocdoc.on('click', function() {
            vista.formulario_asocdoc.getForm().reset();
            vista.window_asocdoc.hide();
        });

        _this.asociar;
        Ext.getCmp('btnDesasociardoc').on('click', function() {
            _this.mymask.show();
            _this.asociar = false;
            modelo.stDocumento.load({
                params: {
                    idelemento: vista.sm_elementos.getSelected().data.idelemento,
                    asociar: _this.asociar
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    vista.window_asocdoc.setTitle(idioma.btndeaasociarDoc);
                    vista.window_asocdoc.show();
                }
            });
        });

        Ext.getCmp('btnAsociardoc').on('click', function() {
            _this.mymask.show();
            _this.asociar = true;
            modelo.stDocumento.load({
                params: {
                    idelemento: vista.sm_elementos.getSelected().data.idelemento,
                    asociar: _this.asociar
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    vista.window_asocdoc.setTitle(idioma.btnasociarDoc);
                    vista.window_asocdoc.show();
                }
            });
        });


        vista.btn_aceptar_asocdoc.on({
            click: function() {
                iddocumentos = new Array();
                documentos = vista.smdocumento.getSelections();
                for (i = 0; i < documentos.length; i++) {
                    iddocumentos.push(documentos[i].data.iddocumentos);
                }
                var cantDocs;
                (modelo.stDocumento.getCount() == documentos.length) ? cantDocs = 0 : cantDocs = 1;
                Ext.Ajax.request({
                    method: "POST",
                    url: 'addElimElementodoc',
                    params: {
                        idelemento: vista.sm_elementos.getSelected().data.idelemento,
                        iddocumentos: Ext.encode(iddocumentos),
                        asociar: _this.asociar,
                        cantDoc: cantDocs
                    },
                    callback: function(options, success, response) {
                        _this.mymask.hide();
                        if (_this.asociar == true) {
                            mostrarMensaje(1, idioma.msgAddAsociar);
                        } else {
                            mostrarMensaje(1, idioma.msgAddDesasociar);
                        }
                        modelo.store_gestionar_elementos.reload();

                        vista.btn_guardar_elemento.disable();
                        vista.btn_eliminar_elemento.disable();
                        Ext.getCmp('btnAsociardoc').disable();
                        Ext.getCmp('btnDesasociardoc').disable();
                        vista.window_asocdoc.hide();
                    }

                });
            }
        });

        vista.btn_aceptar_formato.on({
            click: function() {
                if (vista.formulario_general_formato.getForm().isValid()) {
                    _this.validarNomformatocomp(_this.addMod);
                } else {
                    mostrarMensaje(1, idioma.msgError);
                }

            }
        });

        vista.btn_aplicar_formato.on({
            click: function() {
                _this.apl = true;
                if (vista.formulario_general_formato.getForm().isValid()) {
                    _this.validarNomformatocomp(_this.addMod, _this.apl);
                } else {
                    mostrarMensaje(1, idioma.msgError);
                }

            }
        });

        _this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: idioma.lbCargando
        });

        modelo.store_gestionar_formato.on('load', function() {
            if (modelo.store_gestionar_formato.getCount() == 0) {
                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
            }

        })

    }
};