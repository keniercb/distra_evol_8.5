Ext.ns('Pvd.ControlAsistencia.Configuracionesasist');
//Controlador de la vista del componente
Pvd.ControlAsistencia.Configuracionesasist.Controlador = {

    init: function (idioma, vista, modelo) {
        var scope = this;
        this.accion = '';
        this.accionReloj = '';
        this.accionNoct = '';
        this.accionPtoAcc = '';
        var estructuras = new Array();
        var estselect;
        var estselectReloj;
        var estselectnoct;
        var estselectPtoAcc;
        modelo.store.load();
        modelo.storeReloj.load();
        modelo.storeNoct.load();
        modelo.storePtoAcc.load();
        modelo.stHorario.load();
        modelo.stNofirman.load();
        modelo.storeCategoria.load();
        modelo.storeCausas.load();
        modelo.storeCausasRep.load();
        modelo.storeCausasPromTrab.load();
        modelo.storeCausasCert.load();
        modelo.storeGrupo.load();
        modelo.storeUsuarios.load();
        //modelo.storeHorasDias.load();
        modelo.storeConceptosONEI.load();
        modelo.storeCausasONEI.load();

        modelo.stHorario.on('load', function (store, records, successful, operation, options) {
            if (records[0].data.habilitado == 1) {
                Ext.getCmp('habilitado').expand();
                vista.estructuraHorario.loader.load(vista.estructuraHorario.getRootNode());
                vista.estructuraHorario.getRootNode().expand();
            } else {
                Ext.getCmp('habilitado').collapse();
            }
        });

        modelo.stNofirman.on('load', function (store, records, successful, operation, options) {
            if (records[0].data.habilitado == 1) {
                Ext.getCmp('habilitadonofirma').expand();
                vista.estructuraNofirmar.loader.load(vista.estructuraNofirmar.getRootNode());
                vista.estructuraNofirmar.getRootNode().expand();
            } else {
                Ext.getCmp('habilitadonofirma').collapse();
            }
        });

        modelo.stHabCA.load();
        modelo.stHabCA.on('load', function (store, records, successful, operation, options) {
            //console.info(records);
            if (records[0].data.idca == 1) {
                if (records[0].data.habilitadosw == true || records[0].data.habilitadoabd == true) {
                    Ext.getCmp('habilitadoca').expand();
                } else {
                    Ext.getCmp('habilitadoca').collapse();
                    vista.habcontrolacceso.getForm().items.items[1].reset();
                    vista.habcontrolacceso.getForm().items.items[2].reset();
                    vista.habcontrolacceso.getForm().items.items[1].disable();
                    vista.habcontrolacceso.getForm().items.items[2].disable();
                    vista.habcontrolacceso.getForm().items.items[0].setValue(false);
                    vista.habcontrolacceso.getForm().items.items[3].setValue(false);
                }
                if (records[0].data.habilitadosw == true) {
                    vista.habcontrolacceso.getForm().items.items[0].setValue(true);
                }

                if (records[0].data.habilitadoabd == true)
                    vista.habcontrolacceso.getForm().items.items[3].setValue(true);

                vista.habcontrolacceso.getForm().items.items[1].setValue(records[0].data.dirautenticacion);
                vista.habcontrolacceso.getForm().items.items[2].setValue(records[0].data.dirdatos);
            }
            if (records[1].data.idca == 2) {
                vista.listadoEstructuras.getSelectionModel().on('rowselect', function (n) {
                    estselect = n.getSelected().data;
                    vista.btnModificarTempus.enable();
                    vista.btnEliminarTempus.enable();
                }, this);

                vista.listadoEstructuras.getSelectionModel().on('rowdeselect', function (n) {
                    vista.btnModificarTempus.disable();
                    vista.btnEliminarTempus.disable();
                }, this);

                modelo.store.on('load', function (obj, rec, opc) {
                    estselect = null;
                    vista.btnModificarTempus.disable();
                    vista.btnEliminarTempus.disable();
                }, this);

                if (records[1].data.habilitadoca == true) {
                    Ext.getCmp('habilitadotemp').expand();
                } else {
                    Ext.getCmp('habilitadotemp').collapse();
                    vista.habcontrolacceso.getForm().items.items[4].reset();
                    vista.habcontrolacceso.getForm().items.items[4].disable();
                }
            }
            if (records[2].data.idca == 3) {
                vista.listadoEstructurasReloj.getSelectionModel().on('rowselect', function (n) {
                    estselectReloj = n.getSelected().data;
                    vista.btnModificarReloj.enable();
                    vista.btnEliminarReloj.enable();
                }, this);

                vista.listadoEstructurasReloj.getSelectionModel().on('rowdeselect', function (n) {
                    vista.btnModificarReloj.disable();
                    vista.btnEliminarReloj.disable();
                }, this);

                modelo.storeReloj.on('load', function (obj, rec, opc) {
                    estselectReloj = null;
                    vista.btnModificarReloj.disable();
                    vista.btnEliminarReloj.disable();
                }, this);

                if (records[2].data.habilitadoca == true) {
                    Ext.getCmp('habilitadoreloj').expand();
                } else {
                    Ext.getCmp('habilitadoreloj').collapse();
                    //vista.habcontrolacceso.getForm().items.items[4].reset();
                    //vista.habcontrolacceso.getForm().items.items[4].disable();
                }
            }
        });

        modelo.stHabSesiones.load();
        modelo.stHabSesiones.on('load', function (store, records, successful, operation, options) {
            if (records[0].data.habsesion == 1)
                vista.habilitarSesiones.getForm().items.items[0].setValue(true);
            else
                vista.habilitarSesiones.getForm().items.items[0].setValue(false);
        });

        vista.habcontrolacceso.getForm().items.items[0].on('check', function (chek, checked) {
            if (checked == true) {
                Ext.getCmp("dirautenticacion").enable();
                Ext.getCmp("dirdatos").enable();
                Ext.getCmp("habilitadoabd").setValue(false);
                Ext.getCmp("listPtoAcc").disable();
            }
        });

        vista.habcontrolacceso.getForm().items.items[3].on('check', function (chek, checked) {
            if (checked == true) {
                Ext.getCmp("listPtoAcc").enable();
                Ext.getCmp("dirautenticacion").disable();
                Ext.getCmp("dirdatos").disable();
                Ext.getCmp("dirautenticacion").reset();
                Ext.getCmp("dirdatos").reset();
                Ext.getCmp("habilitadosw").setValue(false);
            }
        });

        vista.listadoPtoAcc.getSelectionModel().on('rowselect', function (n) {
            estselectPtoAcc = n.getSelected().data;
            vista.btnModificarPtoAcc.enable();
            vista.btnEliminarPtoAcc.enable();
        }, this);

        vista.listadoPtoAcc.getSelectionModel().on('rowdeselect', function (n) {
            vista.btnModificarPtoAcc.disable();
            vista.btnEliminarPtoAcc.disable();
        }, this);

        modelo.storePtoAcc.on('load', function (obj, rec, opc) {
            estselectPtoAcc = null;
            vista.btnModificarPtoAcc.disable();
            vista.btnEliminarPtoAcc.disable();
        }, this);

        vista.btnAdicionarPtoAcc.on('click', function () {
            vista.ventanaPtoAcc.setTitle('Adicionar punto de acceso');
            vista.btnAplicarPtoAcc.show();
            vista.ventanaPtoAcc.show();
            scope.accionPtoAcc = 'ADD';
        }, this);

        vista.btnModificarPtoAcc.on('click', function () {
            vista.ventanaPtoAcc.setTitle('Modificar punto de acceso');
            vista.btnAplicarPtoAcc.hide();
            vista.ventanaPtoAcc.show();
            vista.idPtoAcc.setValue(estselectPtoAcc.idpuntoacceso);
            vista.tfdenominacionPtoAcc.setValue(estselectPtoAcc.denominacion);
            scope.accionPtoAcc = 'MOD';
        }, this);

        vista.btnEliminarPtoAcc.on('click', function () {
            var s = vista.listadoPtoAcc.getSelectionModel().getSelected();
            modelo.storePtoAcc.remove(s);
            vista.btnModificarPtoAcc.disable();
            vista.btnEliminarPtoAcc.disable();
        }, this);

        vista.btnAceptarPtoAcc.on('click', function () {
            var cant = modelo.storePtoAcc.getCount();
            var list = modelo.storePtoAcc.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.idpuntoacceso == vista.idPtoAcc.getValue() && rec.data.denominacion == vista.tfdenominacionPtoAcc.getValue()) {
                        resp = true;
                    }
                });
            }
            if (resp == false) {
                if (scope.accionPtoAcc == 'MOD') {
                    var s = vista.listadoPtoAcc.getSelectionModel().getSelected();
                    modelo.storePtoAcc.remove(s);
                }
                modelo.storePtoAcc.add(new Ext.data.Record({
                    idpuntoacceso: vista.idPtoAcc.getValue(),
                    denominacion: vista.tfdenominacionPtoAcc.getValue()
                }));
            } else {
                if (scope.accionPtoAcc == 'ADD')
                    mostrarMensaje(1, idioma.lbNoADDExist);
                else if (scope.accionPtoAcc == 'MOD')
                    mostrarMensaje(1, idioma.lbNoMODExist);
            }
            vista.formularioPtoAcc.getForm().reset();
            vista.ventanaPtoAcc.hide();
        }, this);

        vista.btnAplicarPtoAcc.on('click', function () {
            var cant = modelo.storePtoAcc.getCount();
            var list = modelo.storePtoAcc.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.idpuntoacceso == vista.idPtoAcc.getValue() && rec.data.denominacion == vista.tfdenominacionPtoAcc.getValue()) {
                        resp = true;
                    }
                });
            }
            if (resp == false) {
                if (scope.accionPtoAcc == 'MOD') {
                    var s = vista.listadoPtoAcc.getSelectionModel().getSelected();
                    modelo.storePtoAcc.remove(s);
                }
                modelo.storePtoAcc.add(new Ext.data.Record({
                    idpuntoacceso: vista.idPtoAcc.getValue(),
                    denominacion: vista.tfdenominacionPtoAcc.getValue()
                }));
            } else {
                if (scope.accionPtoAcc == 'ADD')
                    mostrarMensaje(1, idioma.lbNoADDExist);
                else if (scope.accionPtoAcc == 'MOD')
                    mostrarMensaje(1, idioma.lbNoMODExist);
            }
            vista.formularioPtoAcc.getForm().reset();
        }, this);

        vista.btnCancelarPtoAcc.on('click', function () {
            vista.ventanaPtoAcc.hide();
            vista.formularioPtoAcc.getForm().reset();
        });

        vista.btnGuardarhorasextras.on('click', function () {
            guardarLimites();
        }, this);

        function guardarLimites() {
            if (vista.horasextras.getForm().isValid()) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setLimites',
                    params: {
                        idlimitediario: vista.horasextras.getForm().reader.jsonData.datos[0].idlimitediario,
                        limitediario: vista.horasextras.getForm().items.items[0].value,
                        idlimitemensual: vista.horasextras.getForm().reader.jsonData.datos[0].idlimitemensual,
                        limitemensual: vista.horasextras.getForm().items.items[1].value
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        vista.btnGuardarhorario.on('click', function () {
            guardarHorario();
        }, this);

        function guardarHorario() {
            if (Ext.getCmp('habilitado').collapsed == false) {
                var idestructuras = new Array();
                var checkestructuras = vista.estructuraHorario.getChecked();
                if (checkestructuras.length > 0) {
                    for (i = 0; i < checkestructuras.length; i++) {
                        idestructuras.push(checkestructuras[i].id);
                    }
                }
            } else {
                var idestructuras = new Array();
            }

            if (vista.horariotrabajo.getForm().isValid()) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setHorario',
                    params: {
                        idestructuras: Ext.encode(idestructuras),
                        habilitado: !Ext.getCmp('habilitado').collapsed
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        vista.btnAdicionarTempus.on('click', function () {
            vista.ventana.setTitle('Adicionar estructura');
            vista.btnAplicar.show();
            vista.ventana.show();
            vista.EstructuraPadre.setValue('');
            vista.EstructuraPadre.setRawValue('');
            vista.dirapp.setValue('');
            scope.accion = 'ADD';
        }, this);

        vista.btnModificarTempus.on('click', function () {
            vista.ventana.setTitle('Modificar estructura');
            vista.btnAplicar.hide();
            vista.ventana.show();
            vista.EstructuraPadre.setValue(estselect.idestructura);
            vista.EstructuraPadre.setRawValue(estselect.denomestructura);
            vista.dirapp.setValue(estselect.dirapp);
            //modelo.store.load();
            scope.accion = 'MOD';
        }, this);

        vista.btnCancelar.on('click', function () {
            vista.ventana.hide();
        });

        vista.btnConexion.on('click', function () {
            Ext.getBody().mask('Comprobando conexión...');
            Ext.Ajax.request({
                url: 'comprobarConexion',
                params: {
                    dirapp: vista.dirapp.getValue(),
                    idestructura: vista.EstructuraPadre.getValue(),
                },
                method: "POST",
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.msg == 3) {
                        mostrarMensaje(1, idioma.msgConxError);
                    } else {
                        mostrarMensaje(1, idioma.msgConxExito);
                    }
                }
            });
        });

        vista.btnAceptar.on('click', function () {
            var cant = modelo.store.getCount();
            var list = modelo.store.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.idestructura == vista.EstructuraPadre.getValue() && rec.data.dirapp == vista.dirapp.getValue()) {
                        resp = true;
                    }
                });
            }
            if (resp == false) {
                if (scope.accion == 'MOD') {
                    var s = vista.listadoEstructuras.getSelectionModel().getSelected();
                    modelo.store.remove(s);
                }
                modelo.store.add(new Ext.data.Record({
                    idestructura: vista.EstructuraPadre.getValue(),
                    denomestructura: vista.EstructuraPadre.getRawValue(),
                    dirapp: vista.dirapp.getValue()
                }));
            } else {
                if (scope.accion == 'ADD')
                    mostrarMensaje(1, idioma.lbNoADDExist);
                else if (scope.accion == 'MOD')
                    mostrarMensaje(1, idioma.lbNoMODExist);
            }
            vista.EstructuraPadre.setValue('');
            vista.EstructuraPadre.setRawValue('');
            vista.dirapp.setValue('');
            vista.ventana.hide();
        }, this);

        vista.btnAplicar.on('click', function () {
            var cant = modelo.store.getCount();
            var list = modelo.store.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.idestructura == vista.EstructuraPadre.getValue() && rec.data.dirapp == vista.dirapp.getValue()) {
                        resp = true;
                    }
                });
            }
            if (resp == false) {
                if (scope.accion == 'MOD') {
                    var s = vista.listadoEstructuras.getSelectionModel().getSelected();
                    modelo.store.remove(s);
                }
                modelo.store.add(new Ext.data.Record({
                    idestructura: vista.EstructuraPadre.getValue(),
                    denomestructura: vista.EstructuraPadre.getRawValue(),
                    dirapp: vista.dirapp.getValue()
                }));
            } else {
                if (scope.accion == 'ADD')
                    mostrarMensaje(1, idioma.lbNoADDExist);
                else if (scope.accion == 'MOD')
                    mostrarMensaje(1, idioma.lbNoMODExist);
            }
            vista.EstructuraPadre.setValue('');
            vista.EstructuraPadre.setRawValue('');
            vista.dirapp.setValue('');
        }, this);

        vista.btnEliminarTempus.on('click', function () {
            var s = vista.listadoEstructuras.getSelectionModel().getSelected();
            modelo.store.remove(s);
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
        }, this);

        vista.btnGuardarCA.on('click', function () {
            guardarCA();
        }, this);

        function guardarCA() {
            var idestructurastempus = new Array();
            var idestructurasANVIZ = new Array();
            var puntosacceso = new Array();
            if (Ext.getCmp('habilitadotemp').collapsed == false) {
                var cant = modelo.store.getCount();
                var list = modelo.store.getRange(0, cant);
                if (cant > 0) {
                    Ext.each(list, function (rec) {
                        idestructurastempus.push({
                            idestructura: rec.data.idestructura,
                            dirapp: rec.data.dirapp
                        });
                    });
                }
            } else {
                var idestructurastempus = new Array();
            }
            if (Ext.getCmp('habilitadoreloj').collapsed == false) {
                var cant = modelo.storeReloj.getCount();
                var list = modelo.storeReloj.getRange(0, cant);
                if (cant > 0) {
                    Ext.each(list, function (rec) {
                        idestructurasANVIZ.push({
                            idestructura: rec.data.idestructura,
                            dirserver: rec.data.dirserver,
                            nombredb: rec.data.nombredb,
                            usuario: rec.data.usuario,
                            contrasena: rec.data.contrasena
                        });
                    });
                }
            } else {
                var idestructurasANVIZ = new Array();
            }
            if (Ext.getCmp('habilitadoca').collapsed == false) {
                var cant = modelo.storePtoAcc.getCount();
                var list = modelo.storePtoAcc.getRange(0, cant);
                if (cant > 0) {
                    Ext.each(list, function (rec) {
                        puntosacceso.push({
                            idpuntoacceso: rec.data.idpuntoacceso,
                            denominacion: rec.data.denominacion
                        });
                    });
                }
            } else {
                var puntosacceso = new Array();
            }
            if (vista.habcontrolacceso.getForm().isValid()) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setHabilitarCA',
                    params: {
                        servicioweb: vista.habcontrolacceso.getForm().items.items[0].checked,
                        dirserverautent: vista.habcontrolacceso.getForm().items.items[1].getValue(),
                        dirserverdatos: vista.habcontrolacceso.getForm().items.items[2].getValue(),
                        basedatos: vista.habcontrolacceso.getForm().items.items[3].checked,
                        idestructurastempus: Ext.encode(idestructurastempus),
                        idestructurasANVIZ: Ext.encode(idestructurasANVIZ),
                        puntosacceso: Ext.encode(puntosacceso),
                        habilitadoCA: !Ext.getCmp('habilitadoca').collapsed,
                        habilitadoTempus: !Ext.getCmp('habilitadotemp').collapsed,
                        habilitadoReloj: !Ext.getCmp('habilitadoreloj').collapsed,

                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        modelo.stHabCA.load();
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        vista.EstructuraPadre.tree.on('click', function (n) {
            var cant = modelo.storeReloj.getCount();
            var list = modelo.storeReloj.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.idestructura == n.attributes.id) {
                        resp = true;
                    }
                });
            }
            if (resp == true) {
                vista.EstructuraPadre.setValue('');
                vista.EstructuraPadre.setRawValue('');
                mostrarMensaje(1, 'La estructura seleccionada ya está asignada en el Reloj Anviz.');
            }

            var cant = modelo.store.getCount();
            var list = modelo.store.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.idestructura == n.attributes.id) {
                        resp = true;
                    }
                });
            }
            if (resp == true) {
                vista.EstructuraPadre.setValue('');
                vista.EstructuraPadre.setRawValue('');
                mostrarMensaje(1, 'La estructura seleccionada ya existe.');
            }
        }, this);

        vista.EstructuraPadreReloj.tree.on('click', function (n) {
            var cant = modelo.store.getCount();
            var list = modelo.store.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.idestructura == n.attributes.id) {
                        resp = true;
                    }
                });
            }
            if (resp == true) {
                vista.EstructuraPadreReloj.setValue('');
                vista.EstructuraPadreReloj.setRawValue('');
                mostrarMensaje(1, 'La estructura seleccionada ya está asignada en el Tempus.');
            }

            var cant = modelo.storeReloj.getCount();
            var list = modelo.storeReloj.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.idestructura == n.attributes.id) {
                        resp = true;
                    }
                });
            }
            if (resp == true) {
                vista.EstructuraPadreReloj.setValue('');
                vista.EstructuraPadreReloj.setRawValue('');
                mostrarMensaje(1, 'La estructura seleccionada ya existe.');
            }
        }, this);

        vista.btnAdicionarReloj.on('click', function () {
            vista.ventanaReloj.setTitle('Adicionar estructura');
            vista.btnAplicarReloj.show();
            vista.ventanaReloj.show();
            vista.EstructuraPadreReloj.setValue('');
            vista.EstructuraPadreReloj.setRawValue('');
            vista.dirserver.setValue('');
            vista.nombredb.setValue('');
            vista.usuario.setValue('');
            vista.contrasena.setValue('');
            scope.accionReloj = 'ADD';
        }, this);

        vista.btnModificarReloj.on('click', function () {
            vista.ventanaReloj.setTitle('Modificar estructura');
            vista.btnAplicarReloj.hide();
            vista.ventanaReloj.show();
            vista.EstructuraPadreReloj.setValue(estselectReloj.idestructura);
            vista.EstructuraPadreReloj.setRawValue(estselectReloj.denomestructura);
            vista.dirserver.setValue(estselectReloj.dirserver);
            vista.nombredb.setValue(estselectReloj.nombredb);
            vista.usuario.setValue(estselectReloj.usuario);
            vista.contrasena.setValue(estselectReloj.contrasena);
            scope.accionReloj = 'MOD';
        }, this);

        vista.btnCancelarReloj.on('click', function () {
            vista.ventanaReloj.hide();
        });

        vista.btnEliminarReloj.on('click', function () {
            var s = vista.listadoEstructurasReloj.getSelectionModel().getSelected();
            modelo.storeReloj.remove(s);
            vista.btnModificarReloj.disable();
            vista.btnEliminarReloj.disable();
        }, this);

        vista.btnAceptarReloj.on('click', function () {
            var cant = modelo.storeReloj.getCount();
            var list = modelo.storeReloj.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.idestructura == vista.EstructuraPadreReloj.getValue() && rec.data.dirserver == vista.dirserver.getValue()
                        && rec.data.nombredb == vista.nombredb.getValue() && rec.data.usuario == vista.usuario.getValue() && rec.data.contrasena == vista.contrasena.getValue()) {
                        resp = true;
                    }
                });
            }
            if (resp == false) {
                if (scope.accionReloj == 'MOD') {
                    var s = vista.listadoEstructurasReloj.getSelectionModel().getSelected();
                    modelo.storeReloj.remove(s);
                }
                modelo.storeReloj.add(new Ext.data.Record({
                    idestructura: vista.EstructuraPadreReloj.getValue(),
                    denomestructura: vista.EstructuraPadreReloj.getRawValue(),
                    dirserver: vista.dirserver.getValue(),
                    nombredb: vista.nombredb.getValue(),
                    usuario: vista.usuario.getValue(),
                    contrasena: vista.contrasena.getValue()
                }));
            } else {
                if (scope.accionReloj == 'ADD')
                    mostrarMensaje(1, idioma.lbNoADDExist);
                else if (scope.accionReloj == 'MOD')
                    mostrarMensaje(1, idioma.lbNoMODExist);
            }
            vista.EstructuraPadreReloj.setValue('');
            vista.EstructuraPadreReloj.setRawValue('');
            vista.dirserver.setValue('');
            vista.nombredb.setValue('');
            vista.usuario.setValue('');
            vista.contrasena.setValue('');
            vista.ventanaReloj.hide();
        }, this);

        vista.btnAplicarReloj.on('click', function () {
            var cant = modelo.storeReloj.getCount();
            var list = modelo.storeReloj.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.idestructura == vista.EstructuraPadreReloj.getValue() && rec.data.dirserver == vista.dirserver.getValue()
                        && rec.data.nombredb == vista.nombredb.getValue() && rec.data.usuario == vista.usuario.getValue() && rec.data.contrasena == vista.contrasena.getValue()) {
                        resp = true;
                    }
                });
            }
            if (resp == false) {
                if (scope.accionReloj == 'MOD') {
                    var s = vista.listadoEstructurasReloj.getSelectionModel().getSelected();
                    modelo.storeReloj.remove(s);
                }
                modelo.storeReloj.add(new Ext.data.Record({
                    idestructura: vista.EstructuraPadreReloj.getValue(),
                    denomestructura: vista.EstructuraPadreReloj.getRawValue(),
                    dirserver: vista.dirserver.getValue(),
                    nombredb: vista.nombredb.getValue(),
                    usuario: vista.usuario.getValue(),
                    contrasena: vista.contrasena.getValue()
                }));
            } else {
                if (scope.accionReloj == 'ADD')
                    mostrarMensaje(1, idioma.lbNoADDExist);
                else if (scope.accionReloj == 'MOD')
                    mostrarMensaje(1, idioma.lbNoMODExist);
            }
            vista.EstructuraPadreReloj.setValue('');
            vista.EstructuraPadreReloj.setRawValue('');
            vista.dirserver.setValue('');
            vista.nombredb.setValue('');
            vista.usuario.setValue('');
            vista.contrasena.setValue('');
        }, this);

        vista.btnConexionReloj.on('click', function () {
            Ext.getBody().mask('Comprobando conexión...');
            Ext.Ajax.request({
                url: 'comprobarConexionReloj',
                params: {
                    idestructura: vista.EstructuraPadreReloj.getValue(),
                    dirserver: vista.dirserver.getValue(),
                    nombredb: vista.nombredb.getValue(),
                    usuario: vista.usuario.getValue(),
                    contrasena: vista.contrasena.getValue()
                },
                method: "POST",
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.msg == 3) {
                        mostrarMensaje(1, idioma.msgConxError);
                    } else {
                        mostrarMensaje(1, idioma.msgConxExito);
                    }
                }
            });
        });

        modelo.stHabCausa.load();
        modelo.stHabCausa.on('load', function (store, records, successful, operation, options) {
            if (records[0].data.habilitado == 1)
                vista.habcausa.getForm().items.items[0].setValue(true);
            else
                vista.habcausa.getForm().items.items[0].setValue(false);
            if (records[1].data.habilitado == 1)
                vista.habcausa.getForm().items.items[1].setValue(true);
            else
                vista.habcausa.getForm().items.items[1].setValue(false);
            if (records[2].data.habilitado == 1)
                vista.habcausa.getForm().items.items[2].setValue(true);
            else
                vista.habcausa.getForm().items.items[2].setValue(false);
            if (records[3].data.habilitado == 1)
                vista.habcausa.getForm().items.items[3].setValue(true);
            else
                vista.habcausa.getForm().items.items[3].setValue(false);
        });

        vista.btnGuardarCausa.on('click', function () {
            guardarCausa();
        }, this);

        function guardarCausa() {
            if (vista.habcausa.getForm().isValid()) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setHabilitarCausa',
                    params: {
                        habilitadoA: vista.habcausa.getForm().items.items[0].checked,
                        habilitadoT: vista.habcausa.getForm().items.items[1].checked,
                        habilitadoSA: vista.habcausa.getForm().items.items[2].checked,
                        habilitadoTSA: vista.habcausa.getForm().items.items[3].checked
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        vista.btnSaveHabSession.on('click', function () {
            guardarSesion();
        }, this);

        function guardarSesion() {
            if (vista.habilitarSesiones.getForm().isValid()) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setHabilitarsesiones',
                    params: {
                        habsesion: vista.habilitarSesiones.getForm().items.items[0].checked
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.msgSaveSuccess);
                    }
                });
            } else mostrarMensaje(3, idioma.msgSaveError);
        }

        modelo.stHabSubVac.load();
        modelo.stHabSubVac.on('load', function (store, records, successful, operation, options) {
            if (records[0].data.habilitado == 1)
                vista.habSubmayorVac.getForm().items.items[0].setValue(true);
            else
                vista.habSubmayorVac.getForm().items.items[0].setValue(false);
        });

        vista.btnGuardarSubVac.on('click', function () {
            guardarSubVac();
        }, this);

        function guardarSubVac() {
            if (vista.habSubmayorVac.getForm().isValid()) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setHabSubVac',
                    params: {
                        habsubvac: vista.habSubmayorVac.getForm().items.items[0].checked
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.msgSaveSuccess);
                    }
                });
            } else mostrarMensaje(3, idioma.msgSaveError);
        }

        modelo.stHabPagoMensual.load();
        modelo.stHabPagoMensual.on('load', function (store, records, successful, operation, options) {
            if (records[0].data.habilitado == 1)
                vista.habpagomensual.getForm().items.items[0].setValue(true);
            else
                vista.habpagomensual.getForm().items.items[0].setValue(false);
        });

        vista.btnGuardarPagoMensual.on('click', function () {
            guardarPagoMensual();
        }, this);

        function guardarPagoMensual() {
            if (vista.habpagomensual.getForm().isValid()) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setHabFinmes',
                    params: {
                        habfinmes: vista.habpagomensual.getForm().items.items[0].checked
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.msgSaveSuccess);
                    }
                });
            } else mostrarMensaje(3, idioma.msgSaveError);
        }

        vista.listadoNocturnidad.getSelectionModel().on('rowselect', function (n) {
            estselectnoct = n.getSelected().data;
            vista.btnModificarNoct.enable();
            vista.btnEliminarNoct.enable();
        }, this);

        vista.listadoNocturnidad.getSelectionModel().on('rowdeselect', function (n) {
            vista.btnModificarNoct.disable();
            vista.btnEliminarNoct.disable();
        }, this);

        modelo.storeNoct.on('load', function (obj, rec, opc) {
            estselectnoct = null;
            vista.btnModificarNoct.disable();
            vista.btnEliminarNoct.disable();
        }, this);

        vista.btnAdicionarNoct.on('click', function () {
            vista.ventanaNoct.setTitle('Adicionar horario de nocturnidad');
            vista.btnAplicarNoct.show();
            vista.ventanaNoct.show();
            scope.accionNoct = 'ADD';
        }, this);

        vista.btnModificarNoct.on('click', function () {
            vista.ventanaNoct.setTitle('Modificar horario de nocturnidad');
            vista.btnAplicarNoct.hide();
            vista.ventanaNoct.show();
            vista.tfdenominacionNoct.setValue(estselectnoct.denominacion);
            vista.cbhoraInicioNoct.setValue(estselectnoct.horainicio);
            vista.cbhoraFinNoct.setValue(estselectnoct.horafin);
            //vista.formularioNoct.getForm().loadRecord(estselectnoct);
            scope.accionNoct = 'MOD';
        }, this);

        vista.btnEliminarNoct.on('click', function () {
            var s = vista.listadoNocturnidad.getSelectionModel().getSelected();
            modelo.storeNoct.remove(s);
            vista.btnModificarNoct.disable();
            vista.btnEliminarNoct.disable();
        }, this);

        vista.btnAceptarNoct.on('click', function () {
            var cant = modelo.storeNoct.getCount();
            var list = modelo.storeNoct.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.denominacion == vista.tfdenominacionNoct.getValue()
                        && rec.data.horainicio == vista.cbhoraInicioNoct.getValue()
                        && rec.data.horafin == vista.cbhoraFinNoct.getValue()) {
                        resp = true;
                    }
                });
            }
            if (resp == false) {
                if (scope.accionNoct == 'MOD') {
                    var s = vista.listadoNocturnidad.getSelectionModel().getSelected();
                    modelo.storeNoct.remove(s);
                }
                modelo.storeNoct.add(new Ext.data.Record({
                    denominacion: vista.tfdenominacionNoct.getValue(),
                    horainicio: vista.cbhoraInicioNoct.getValue(),
                    horafin: vista.cbhoraFinNoct.getValue()
                }));
            } else {
                if (scope.accionNoct == 'ADD')
                    mostrarMensaje(1, idioma.lbNoADDExist);
                else if (scope.accionNoct == 'MOD')
                    mostrarMensaje(1, idioma.lbNoMODExist);
            }
            vista.formularioNoct.getForm().reset();
            vista.ventanaNoct.hide();
        }, this);

        vista.btnAplicarNoct.on('click', function () {
            var cant = modelo.storeNoct.getCount();
            var list = modelo.storeNoct.getRange(0, cant);
            var resp = false;
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    if (rec.data.denominacion == vista.tfdenominacionNoct.getValue()
                        && rec.data.horainicio == vista.cbhoraInicioNoct.getValue()
                        && rec.data.horafin == vista.cbhoraFinNoct.getValue()) {
                        resp = true;
                    }
                });
            }
            if (resp == false) {
                if (scope.accionNoct == 'MOD') {
                    var s = vista.listadoNocturnidad.getSelectionModel().getSelected();
                    modelo.storeNoct.remove(s);
                }
                modelo.storeNoct.add(new Ext.data.Record({
                    denominacion: vista.tfdenominacionNoct.getValue(),
                    horainicio: vista.cbhoraInicioNoct.getValue(),
                    horafin: vista.cbhoraFinNoct.getValue()
                }));
            } else {
                if (scope.accionNoct == 'ADD')
                    mostrarMensaje(1, idioma.lbNoADDExist);
                else if (scope.accionNoct == 'MOD')
                    mostrarMensaje(1, idioma.lbNoMODExist);
            }
            vista.formularioNoct.getForm().reset();
        }, this);

        vista.btnCancelarNoct.on('click', function () {
            vista.ventanaNoct.hide();
            vista.formularioNoct.getForm().reset();
        });

        vista.btnGuardarHorarioNoct.on('click', function () {
            guardarNoct();
        }, this);

        function guardarNoct() {
            var horarios = new Array();
            var cant = modelo.storeNoct.getCount();
            var list = modelo.storeNoct.getRange(0, cant);
            if (cant > 0) {
                Ext.each(list, function (rec) {
                    horarios.push({
                        denominacion: rec.data.denominacion,
                        horainicio: rec.data.horainicio,
                        horafin: rec.data.horafin
                    });
                });
            }
            if (vista.habHorarioNoct.getForm().isValid()) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setHabilitarHorarioNoct',
                    params: {
                        horarios: Ext.encode(horarios)
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        modelo.storeNoct.load();
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                        vista.btnModificarNoct.disable();
                        vista.btnEliminarNoct.disable();
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        vista.btnGuardarCatMiltar.on('click', function () {
            guardarCatMilit();
        }, this);

        function guardarCatMilit() {
            var causas = new Array();
            if (vista.smgridCausas.getCount() > 0) {
                Ext.each(vista.listadoCausas.getSelectionModel().getSelections(), function (rec) {
                    causas.push(rec.data.idcausa);
                });
            }
            if (vista.smgridCategoria.getCount() > 0)
                var categoria = vista.listadoCategoria.getSelectionModel().getSelected().data.idcategoriapersona;
            var fondotiempo = vista.habCategMilit.getForm().items.items[0].value;
            if (vista.habCategMilit.getForm().isValid() && vista.smgridCausas.getCount() > 0 && vista.smgridCategoria.getCount() > 0) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setCategoriaCausas',
                    params: {
                        causas: Ext.encode(causas),
                        categoria: categoria,
                        fondotiempo: fondotiempo
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        vista.smgridCategoria.on('selectionchange', function (th) {
            modelo.storeCausas.load(
                {params: {idcategoria: vista.listadoCategoria.getSelectionModel().getSelected().data.idcategoriapersona}}
            );
            vista.habCategMilit.getForm().items.items[0].setValue(vista.listadoCategoria.getSelectionModel().getSelected().data.fondodetiempo);
        });

        vista.smgridCategoria.on('rowdeselect', function (sm, numb, rec) {
            vista.habCategMilit.getForm().items.items[0].reset();
            //vista.habCategMilit.getForm().items.items[0].allowBlank = true;
            vista.listadoCausas.selModel.clearSelections();
        }, this);

        modelo.storeCausas.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoCausas.selModel.selectRecords(seleccion);
        });

        modelo.storeCategoria.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    if (rec.data.denominacion == 'Militar') {
                        seleccion.push(rec);
                    }
                }
            });
            vista.listadoCategoria.selModel.selectRecords(seleccion);
        });

        vista.btnGuardarCert.on('click', function () {
            guardarCertificados();
        }, this);

        function guardarCertificados() {
            var causas = new Array();
            if (vista.smgridCausasCert.getCount() > 0) {
                Ext.each(vista.listadoCausasCert.getSelectionModel().getSelections(), function (rec) {
                    causas.push(rec.data.idcausa);
                });
            }
            if (vista.smgridCausasCert.getCount() > 0) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setCausasCertificados',
                    params: {
                        causas: Ext.encode(causas)
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        modelo.storeCausasCert.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoCausasCert.selModel.selectRecords(seleccion);
        });

        vista.btnGuardarGrupo.on('click', function () {
            guardarGrupos();
        }, this);

        function guardarGrupos() {
            var grupos = new Array();
            var usuarios = new Array();
            if (vista.smgridGrupo.getCount() > 0) {
                Ext.each(vista.listadoGrupo.getSelectionModel().getSelections(), function (rec) {
                    grupos.push(rec.data.idgrupodescanso);
                });
            }
            if (vista.smgridUsuarios.getCount() > 0) {
                Ext.each(vista.listadoUsuarios.getSelectionModel().getSelections(), function (rec) {
                    usuarios.push(rec.data.idusuario);
                });
            }console.info(grupos);console.info(usuarios);
            //if (vista.smgridGrupo.getCount() > 0) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setGrupos',
                    params: {
                        grupos: Ext.encode(grupos),
                        usuarios: Ext.encode(usuarios)
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            //} else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        modelo.storeGrupo.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoGrupo.selModel.selectRecords(seleccion);
        });

        modelo.storeUsuarios.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoUsuarios.selModel.selectRecords(seleccion);
        });

        Ext.Ajax.request({
            url: 'getHorasDias',
            method: 'POST',
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData[0].id == 1 && responseData[0].horasdias == 1) {
                    vista.combodiashoras.setValue(1);
                } else if (responseData[1].id == 2 && responseData[1].horasdias == 1) {
                    vista.combodiashoras.setValue(2);
                }
            }
        });

        vista.btnGuardarDiasHoras.on('click', function () {
            guardarHorasDias();
        }, this);

        function guardarHorasDias() {
            if (vista.diashoras.getForm().isValid()) {//console.info(vista.combodiashoras.getRawValue());
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setHorasDias',
                    params: {
                        id: vista.combodiashoras.getValue()
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }


        vista.btnGuardarCargos.on('click', function () {
            guardarCargosnofirman();
        }, this);

        function guardarCargosnofirman() {
            if (Ext.getCmp('habilitadonofirma').collapsed == false) {
                var idestructuras = new Array();
                var checkestructuras = vista.estructuraNofirmar.getChecked();
                if (checkestructuras.length > 0) {
                    for (i = 0; i < checkestructuras.length; i++) {
                        idestructuras.push(checkestructuras[i].id);
                    }
                }
            } else {
                var idestructuras = new Array();
            }

            if (vista.cargosnofirman.getForm().isValid()) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setCargosnofirman',
                    params: {
                        idestructuras: Ext.encode(idestructuras),
                        habilitado: !Ext.getCmp('habilitadonofirma').collapsed
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }


        vista.btnGuardarConceptoscausa.on('click', function () {
            guardarConceptoCausas();
        }, this);

        function guardarConceptoCausas() {
            var causas = new Array();
            if (vista.smgridCausasRep.getCount() > 0) {
                Ext.each(vista.listadoCausasRep.getSelectionModel().getSelections(), function (rec) {
                    causas.push(rec.data.idcausa);
                });
            }
            if (vista.smgridConceptos.getCount() > 0)
                var idconcepto = vista.listadoConceptos.getSelectionModel().getSelected().data.idconcepto;
            if (vista.habConceptocausas.getForm().isValid() && vista.smgridCausasRep.getCount() > 0 && vista.smgridConceptos.getCount() > 0) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setConceptoCausas',
                    params: {
                        causas: Ext.encode(causas),
                        idconcepto: idconcepto
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        vista.smgridConceptos.on('selectionchange', function (th) {
            modelo.storeCausasRep.load(
                {params: {idconcepto: vista.listadoConceptos.getSelectionModel().getSelected().data.idconcepto}}
            );
        });

        vista.smgridConceptos.on('rowdeselect', function (sm, numb, rec) {
            vista.habConceptocausas.getForm().items.items[0].reset();
            vista.listadoCausasRep.selModel.clearSelections();
        }, this);

        modelo.storeCausasRep.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoCausasRep.selModel.selectRecords(seleccion);
        });

        modelo.storeConceptos.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoConceptos.selModel.selectRecords(seleccion);
        });


        vista.btnAdicion.on('click', function () {
            guardarCausas('Add');
        }, this);

        vista.btnDeducion.on('click', function () {
            guardarCausas('Del');
        }, this);

        function guardarCausas(accion) {
            var causas = new Array();
            if (vista.smgridCausasPromTrab.getCount() > 0) {
                Ext.each(vista.listadoCausasPromTrab.getSelectionModel().getSelections(), function (rec) {
                    causas.push(rec.data.idcausa);
                });
            }
            if (accion == 'Add') {
                var accion = 1;
            } else if (accion == 'Del') {
                var accion = 0;
            }
            if (vista.habCausasPromTrab.getForm().isValid() && vista.smgridCausasPromTrab.getCount() > 0) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'guardarCausas',
                    params: {
                        causas: Ext.encode(causas),
                        accion: accion
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                        modelo.storeCausasPromTrab.load();
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }


        vista.listadoConceptosONEI.getSelectionModel().on('rowselect', function (n) {
            estselectConcept = n.getSelected().data;
            vista.btnModificarConcept.enable();
            vista.btnEliminarConcept.enable();
        }, this);

        vista.listadoConceptosONEI.getSelectionModel().on('rowdeselect', function (n) {
            vista.btnModificarConcept.disable();
            vista.btnEliminarConcept.disable();
        }, this);

        modelo.storeConceptosONEI.on('load', function (obj, rec, opc) {
            estselectConcept = null;
            vista.btnModificarConcept.disable();
            vista.btnEliminarConcept.disable();
        }, this);

        vista.btnAdicionarConcept.on('click', function () {
            vista.ventanaConcept.setTitle('Adicionar concepto');
            vista.btnAplicarConcept.show();
            vista.ventanaConcept.show();
            scope.accionConcept = 'ADD';
            vista.orden.enable();
            vista.orden.setValue('');
            vista.tfdenominacionConcept.setValue('');
        }, this);

        vista.btnModificarConcept.on('click', function () {
            vista.ventanaConcept.setTitle('Modificar concepto');
            vista.btnAplicarConcept.hide();
            vista.ventanaConcept.show();
            vista.tfdenominacionConcept.setValue(estselectConcept.denominacion);
            vista.orden.setValue(estselectConcept.orden);
            vista.orden.disable();
            scope.accionConcept = 'MOD';
        }, this);

        vista.btnEliminarConcept.on('click', function () {
            mostrarMensaje(2, '¿Está seguro que desea eliminar el concepto seleccionado?', function (btn) {
                if (btn == 'ok') {
                    eliminarConcepto();
                }
            })
            vista.btnModificarConcept.disable();
            vista.btnEliminarConcept.disable();
        }, this);

        vista.btnAceptarConcept.on('click', function () {
            guardarConcepto(scope.accionConcept);
            vista.formularioConcept.getForm().reset();
            vista.ventanaConcept.hide();
        }, this);

        vista.btnAplicarConcept.on('click', function () {
            guardarConcepto(scope.accionConcept);
            vista.formularioConcept.getForm().reset();
        }, this);

        vista.btnCancelarConcept.on('click', function () {
            vista.ventanaConcept.hide();
            vista.formularioConcept.getForm().reset();
        });

        function guardarConcepto(accion) {
            if (vista.habConceptocausasONEI.getForm().isValid()) {
                if (accion == 'ADD') {
                    var url = 'adicionarConcepto';
                    Ext.getBody().mask('Adicionando concepto...');
                } else {
                    var idconcepto = vista.listadoConceptosONEI.getSelectionModel().getSelected().data.idconcepto;
                    var orden = vista.listadoConceptosONEI.getSelectionModel().getSelected().data.orden;
                    var url = 'modificarConcepto';
                    Ext.getBody().mask('Modificando concepto...');
                }
                Ext.Ajax.request({
                    url: url,
                    params: {
                        concepto: vista.tfdenominacionConcept.getValue(),
                        orden: vista.orden.getValue(),
                        idconcepto: idconcepto
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        modelo.storeConceptosONEI.load();
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                        vista.btnModificarConcept.disable();
                        vista.btnEliminarConcept.disable();
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        function eliminarConcepto() {
            Ext.getBody().mask('Eliminando concepto...');
            Ext.Ajax.request({
                url: 'eliminarConcepto',
                method: 'POST',
                params: {idconcepto: vista.listadoConceptosONEI.getSelectionModel().getSelected().data.idconcepto},
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    mostrarMensaje(1, 'El concepto fue eliminado satisfactoriamente.');
                    modelo.storeConceptosONEI.load();
                }
            });
        }

        vista.smgridConceptosONEI.on('selectionchange', function (th) {
            modelo.storeCausasONEI.load(
                {params: {idconcepto: estselectConcept.idconcepto}}
            );
        });

        vista.smgridConceptosONEI.on('rowdeselect', function (sm, numb, rec) {
            vista.listadoCausasONEI.selModel.clearSelections();
        }, this);

        modelo.storeCausasONEI.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoCausasONEI.selModel.selectRecords(seleccion);
        });

        modelo.storeConceptosONEI.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoConceptosONEI.selModel.selectRecords(seleccion);
        });

        vista.btnGuardarConceptoscausaONEI.on('click', function () {
            guardarConceptoCausasONEI();
        }, this);

        function guardarConceptoCausasONEI() {
            var causas = new Array();
            if (vista.smgridCausasONEI.getCount() > 0) {
                Ext.each(vista.listadoCausasONEI.getSelectionModel().getSelections(), function (rec) {
                    causas.push(rec.data.idcausa);
                });
            }
            if (vista.smgridConceptosONEI.getCount() > 0)
                var idconcepto = vista.listadoConceptosONEI.getSelectionModel().getSelected().data.idconcepto;
            if (vista.habConceptocausasONEI.getForm().isValid() && vista.smgridCausasONEI.getCount() > 0 && vista.smgridConceptosONEI.getCount() > 0) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: 'setConceptoCausasONEI',
                    params: {
                        causas: Ext.encode(causas),
                        idconcepto: idconcepto
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        modelo.stHabMultiplesCausas.load();
        modelo.stHabMultiplesCausas.on('load', function (store, records, successful, operation, options) {
            if (records[0].data.habilitadomc == 1) {
                vista.habmultiplescausales.getForm().items.items[0].setValue(true);
            }else {
                vista.habmultiplescausales.getForm().items.items[0].setValue(false);
            }
        });

        vista.btnGuardarMultiplesCausas.on('click', function () {
            guardarHabMultiplesCausas();
        }, this);

        function guardarHabMultiplesCausas() {
            if (vista.habmultiplescausales.getForm().isValid()) {
                Ext.Ajax.request({
                    url: 'setHabMultiplesCausas',
                    params: {
                        habilitado: vista.habmultiplescausales.getForm().items.items[0].checked
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                    }
                });
            } else mostrarMensaje(3, idioma.msgSaveError);
        }

    }
}