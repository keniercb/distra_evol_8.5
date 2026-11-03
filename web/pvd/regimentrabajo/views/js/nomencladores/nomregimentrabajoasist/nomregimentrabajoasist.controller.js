Ext.ns('RegimenTrabajo.Nomregimentrabajoasist');

RegimenTrabajo.Nomregimentrabajoasist.Controlador = {

    init: function (idioma, vista, modelo) {

        modelo.stTregimen.load({params:{limit:25,start:0}});
        //modelo.stTregimen.load();

        this.accion = 'add';
        var scope = this;
        var variable = true;
        this.cambioDenominacion = false;
        this.cambioDenominacionGD = false;

        vista.tfdenominacion.on('change', function () {
            scope.cambioDenominacion = true;
            scope.cambioDenominacionGD = true;
        });

        vista.gplistadoregimentrabajo.focus();


        var idregimentrabajo;
        vista.gplistadoregimentrabajo.getSelectionModel().on('rowselect', function () {
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            vista.btnModificarP.disable();
            vista.btnEliminarP.disable();
            if (vista.gplistadoregimentrabajo.getSelectionModel().getSelections().length == 1) {
                idregimentrabajo = vista.gplistadoregimentrabajo.getSelectionModel().getSelected().get('idregimentrabajo');
                modelo.stListadoGrupoDescanso.baseParams = {idregimentrabajo: idregimentrabajo};
                modelo.stListadoGrupoDescanso.load();
            }
        }, this);

        vista.cbTipoFondoTiempo.on('select', function (combo, rec, ind) {
            if (rec.data.tipofondotiempo == 1) {
                vista.fondoTiempo.disable();
                vista.fondoTiempo.setValue('');
                vista.diasLab.disable();
                vista.diasLab.setValue('');
            } else if (rec.data.tipofondotiempo == 2) {
                vista.fondoTiempo.disable();
                vista.fondoTiempo.setValue('');
                vista.diasLab.disable();
                vista.diasLab.setValue('');
            } else if (rec.data.tipofondotiempo == 4){
                vista.fondoTiempo.enable();
                vista.diasLab.disable();
                vista.diasLab.setValue('');
            }else{
                vista.fondoTiempo.enable();
                vista.diasLab.enable();
            }
        }, this);

        vista.btnAdicionar.on('click', function () {
            vista.btnAplicar.show();
            vista.winAdicionarRT.setTitle(idioma.lbTitVentAddRegimen);
            vista.winAdicionarRT.show();
            self.accion = 'add';

        }, this);

        vista.tfdenominacion.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });
        vista.tfHorastrabajo.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });
        vista.cbTipoFondoTiempo.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });
        vista.fondoTiempo.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });
        vista.dfIregimen.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });
        vista.dfFregimen.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });
        vista.taDescripcion.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });
        vista.tfdenominacionGD.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });
        vista.dfIregimenGD.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });
        vista.dfFregimenGD.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });

        vista.combo.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });
        vista.taDescripcionGD.on('keydown', function (field, e) {
            if (((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)) {
                e.stopEvent();
            }
        });


        vista.winAdicionarRT.on('hide', function (th) {
            vista.fadicionarRT.getForm().reset();
        })

        vista.btnModificar.on('click', function () {
            var idregimentrabajo = vista.gplistadoregimentrabajo.getSelectionModel().getSelected().get('idregimentrabajo');
            vista.winAdicionarRT.setTitle(idioma.lbTitVentModRegimen);
            vista.btnAplicar.hide();
            vista.winAdicionarRT.show();
            vista.winAdicionarRT.doLayout();
            vista.fadicionarRT.getForm().loadRecord(vista.gplistadoregimentrabajo.getSelectionModel().getSelected());
            if (vista.gplistadoregimentrabajo.getSelectionModel().getSelected().get('tipofondotiempo') == 1) {
                vista.fondoTiempo.disable();
                vista.fondoTiempo.setValue('');
                vista.diasLab.disable();
                vista.diasLab.setValue('');
            } else if (vista.gplistadoregimentrabajo.getSelectionModel().getSelected().get('tipofondotiempo') == 2) {
                vista.fondoTiempo.disable();
                vista.fondoTiempo.setValue('');
                vista.diasLab.disable();
                vista.diasLab.setValue('');
            } else if (vista.gplistadoregimentrabajo.getSelectionModel().getSelected().get('tipofondotiempo') == 4){
                vista.fondoTiempo.enable();
                vista.diasLab.disable();
                vista.diasLab.setValue('');
            }else if (vista.gplistadoregimentrabajo.getSelectionModel().getSelected().get('tipofondotiempo') == 3){
                vista.fondoTiempo.enable();
                vista.diasLab.enable();
            }
            self.accion = 'mod';
        }, this);

        vista.winAdicionarRT.on('show', function (th) {
            if ((vista.cbTipoFondoTiempo.getValue() == 3 || vista.cbTipoFondoTiempo.getValue() == 4) && vista.fondoTiempo.getValue() == '') {
                vista.fondoTiempo.enable();
            } else {
                vista.fondoTiempo.disable();
            }
            if (vista.cbTipoFondoTiempo.getValue() == 3 && vista.fondoTiempo.getValue() == '') {
                vista.diasLab.enable();
            } else {
                vista.diasLab.disable();
            }
        });

        vista.btnCancelar.on('click', function () {
            vista.fadicionarRT.getForm().reset();
            vista.winAdicionarRT.hide();
            scope.cambioDenominacion = false;
        }, this);

        vista.btnAceptar.on('click', function () {
            guardarDatos('ACP');

        }, this);

        vista.btnAplicar.on('click', function () {
            guardarDatos('APL');

        }, this);

        vista.gpListadoGrupoDescanso.getSelectionModel().on('rowselect', function () {
            vista.btnModificarP.enable();
            vista.btnEliminarP.enable();
        }, this);

        vista.btnAdicionarP.on('click', function () {
            if (vista.gplistadoregimentrabajo.getSelectionModel().getSelected()) {
                var regimentrabajo = vista.gplistadoregimentrabajo.getSelectionModel().getSelected().get('idregimentrabajo');
                vista.combo.setValue(regimentrabajo);
            } else {
                vista.combo.setValue('');
            }
            vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
            vista.btnAplicarGD.show();
            vista.winAdicionarGD.show();
            self.accion = 'addGD';
        }, this);

        vista.winAdicionarGD.on('hide', function (th) {
            vista.fadicionarGD.getForm().reset();
        })

        vista.btnModificarP.on('click', function () {
            vista.fadicionarGD.getForm().reset();
            vista.winAdicionarGD.setTitle(idioma.lbTitVentModGrupo);
            vista.btnAplicarGD.hide();
            vista.winAdicionarGD.show();
            vista.winAdicionarGD.doLayout();
            vista.EstructuraPadre.setValue(vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idestructura'));
            vista.EstructuraPadre.setRawValue(vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('estructura'));
            vista.fadicionarGD.getForm().loadRecord(vista.gpListadoGrupoDescanso.getSelectionModel().getSelected());
            self.accion = 'modGD';
        }, this);

        vista.btnCancelarGD.on('click', function () {
            vista.fadicionarGD.getForm().reset()
            vista.winAdicionarGD.hide();
            scope.cambioDenominacion = false;
        }, this);

        vista.btnAceptarGD.on('click', function () {
            guardarDatosGD('ACP');
        }, this);

        vista.btnAplicarGD.on('click', function () {
            guardarDatosGD('APL');
        }, this);

        function cargarListadoEventos(idregimentrabajo) {
            Ext.Ajax.request({
                url: 'getEventosxGrupo',
                params: {
                    idregimentrabajo: idregimentrabajo,
                },
                callback: function () {
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText).datos;
                    var objrec = [];
                    for (i = 0; i < responseData.length; i++) {
                        var obj = modelo.stListadoEventos.getById(responseData[i].idevento);
                        objrec.push(obj);
                    }
                    vista.smListadoEventos.selectRecords(objrec);
                }
            });
        }


        function guardarDatos(btnpress) {
            var arregloEv = new Array();
            if (accion == 'add')
                Ext.getBody().mask(idioma.lbTitMsgAdicionandoR);
            else
                Ext.getBody().mask(idioma.lbTitMsgModificandoR);
            if (vista.fadicionarRT.getForm().isValid()) {
                if ((vista.cbTipoFondoTiempo.getValue() == 3 || vista.cbTipoFondoTiempo.getValue() == 4) && vista.fondoTiempo.getValue() == '') {
                    mostrarMensaje(3, idioma.lbTitMsgfondo);
                    Ext.getBody().unmask();
                }else if(vista.cbTipoFondoTiempo.getValue() == 3 && (vista.fondoTiempo.getValue() == '' || vista.diasLab.getValue() == '')){
                    mostrarMensaje(3, idioma.lbTitMsgfondodiaslab);
                    Ext.getBody().unmask();
                } else {
                    Ext.Ajax.request({
                        url: (self.accion == 'add' ? 'addTipoRegimenTrabajo' : 'modTipoRegimenTrabajo'),
                        params: {
                            idregimentrabajo: self.accion == 'add' ? -1 : vista.gplistadoregimentrabajo.getSelectionModel().getSelected().get('idregimentrabajo'),
                            denominacion: vista.tfdenominacion.getValue(),
                            descripcion: vista.taDescripcion.getValue(),
                            fdesde: vista.dfIregimen.getRawValue(),
                            fhasta: vista.dfFregimen.getRawValue(),
                            horastrabajo: vista.tfHorastrabajo.getValue(),
                            tipofondotiempo: vista.cbTipoFondoTiempo.getValue(),
                            fondotiempo: vista.fondoTiempo.getValue(),
                            diaslab: vista.diasLab.getValue(),
                            cambiodenom: scope.cambioDenominacion,
                            //idestructura: vista.EstructuraPadre.getValue()
                        },
                        success: function (r) {
                            Ext.getBody().unmask();
                            var responseData = Ext.decode(r.responseText);
                            scope.cambioDenominacion = false;
                            vista.EstructuraPadre.setValue('');
                            if (responseData.cod == 1) {
                                if (self.accion == 'mod' && responseData.success) {
                                    mostrarMensaje(1, idioma.lbMsgModRegimenExito);

                                } else if (self.accion == 'add' && responseData.success) {
                                    mostrarMensaje(1, idioma.lbMsgInsRegimenExito);

                                }
                                if (btnpress == 'ACP') {
                                    vista.fadicionarRT.getForm().reset();
                                    vista.winAdicionarRT.hide();

                                }
                                if (btnpress == 'APL') {
                                    vista.fadicionarRT.getForm().reset();
                                }

                                //modelo.stTregimen.reload();
                                modelo.stTregimen.load({params:{limit:25,start:0}});
                            }
                            else {
                                mostrarMensaje(3, idioma.msgYaExiste);
                            }
                        }
                    });
                }
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        function guardarDatosGD(btnpress) {
            var arregloEv = new Array();
            if (accion == 'addGD')
                Ext.getBody().mask(idioma.lbTitMsgAdicionandoG);
            else
                Ext.getBody().mask(idioma.lbTitMsgModificandoG);
            if (vista.fadicionarGD.getForm().isValid()) {
                Ext.Ajax.request({
                    url: (self.accion == 'addGD' ? 'addGrupoDescanso' : 'modGrupoDescanso'),
                    params: {
                        idregimentrabajo: self.accion == 'addGD' ? vista.combo.getValue() : vista.combo.getValue(),
                        idgrupodescanso: self.accion == 'addGD' ? -1 : vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idgrupodescanso'),
                        denominacion: vista.tfdenominacionGD.getValue(),
                        descripcion: vista.taDescripcionGD.getValue(),
                        fdesde: vista.dfIregimenGD.getRawValue(),
                        fhasta: vista.dfFregimenGD.getRawValue(),
                        cambiodenom: scope.cambioDenominacionGD,
                        idestructura: vista.EstructuraPadre.getValue(),
                        predeterminado: vista.predeterminado.getValue()
                    },
                    success: function (r) {
                        Ext.getBody().unmask();
                        var responseData = Ext.decode(r.responseText);
                        scope.cambioDenominacionGD = false;
                        if (responseData.cod == 1) {
                            if (self.accion == 'modGD' && responseData.success) {
                                vista.fadicionarGD.getForm().reset();
                                mostrarMensaje(1, idioma.lbMsgModGrupoExito);

                            } else if (self.accion == 'addGD' && responseData.success) {
                                vista.fadicionarRT.getForm().reset();
                                mostrarMensaje(1, idioma.lbMsgInsGrupoExito);

                            }
                            if (btnpress == 'ACP') {
                                vista.fadicionarGD.getForm().reset();
                                vista.winAdicionarGD.hide();

                            }
                            if (btnpress == 'APL') {
                                vista.fadicionarGD.getForm().reset();
                            }

                            modelo.stListadoGrupoDescanso.reload();
                        }
                        else {
                            mostrarMensaje(3, idioma.msgYaExisteGD);
                        }
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        vista.btnEliminar.on('click', function () {
            Eliminar();
        }, this);

        function Eliminar() {
            var cantelim = vista.gplistadoregimentrabajo.getSelectionModel().getSelections().length;
            mostrarMensaje(2, cantelim > 1 ? idioma.lbTitMsgSeguroEliminarRVarios : idioma.lbTitMsgSeguroEliminarRUno, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    var ids = [];
                    for (i = 0; i < vista.gplistadoregimentrabajo.getSelectionModel().getSelections().length; i++) {
                        var id = vista.gplistadoregimentrabajo.getSelectionModel().getSelections()[i].get('idregimentrabajo');
                        ids[i] = id;
                    }
                    Ext.getBody().mask(cantelim > 1 ? idioma.lbTitMsgEliminandoRVarios : idioma.lbTitMsgEliminandoRUno);
                    Ext.Ajax.request({
                        url: 'delTipoRegimenTrabajo',
                        params: {idregimentrabajo: Ext.encode(ids)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            var aux = '';
                            var regimen = '';
                            if (responseData.length == 0) {
                                mostrarMensaje(1, cantelim > 1 ? idioma.lbMsgDelRegimenExitoVarios : idioma.lbMsgDelRegimenExitoUno);
                            } else {
                                Ext.each(responseData, function (rec) {
                                    aux += rec[2] + ', ';
                                });
                                regimen = aux.substring(0, aux.length - 2);
                                if (responseData.length == 1) {
                                    mostrarMensaje(3, 'El régimen de trabajo ' + regimen + ' no se puede eliminar porque existen grupos que están siendo usados en el calendario y personas que todavía tienen grupo en persona.');
                                } else {
                                    mostrarMensaje(3, 'Los régimenes de trabajo ' + regimen + ' no se pueden eliminar porque existen grupos que están siendo usados en el calendario y personas que todavía tienen grupo en persona.');
                                }
                            }
                            //modelo.stTregimen.reload();
                            modelo.stTregimen.load({params:{limit:25,start:0}});
                            modelo.stListadoGrupoDescanso.reload();
                        }
                    });
                }
            });
        }


        vista.btnEliminarP.on('click', function () {
            EliminarGD();
        }, this);

        function EliminarGD() {
            var cantelim = vista.gpListadoGrupoDescanso.getSelectionModel().getSelections().length;
            mostrarMensaje(2, cantelim > 1 ? idioma.lbTitMsgSeguroEliminarGVarios : idioma.lbTitMsgSeguroEliminarGUno, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    var ids = [];
                    for (i = 0; i < vista.gpListadoGrupoDescanso.getSelectionModel().getSelections().length; i++) {
                        var id = vista.gpListadoGrupoDescanso.getSelectionModel().getSelections()[i].get('idgrupodescanso');
                        ids[i] = id;
                    }
                    Ext.getBody().mask(cantelim > 1 ? idioma.lbTitMsgEliminandoGVarios : idioma.lbTitMsgEliminandoGUno);
                    Ext.Ajax.request({
                        url: 'delGrupoDescanso',
                        params: {idregimentrabajo: Ext.encode(ids)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            var aux1 = '';
                            var aux = '';
                            var grupos = '';
                            var personas = '';
                            if (responseData.length == 0) {
                                mostrarMensaje(1, cantelim > 1 ? idioma.lbMsgDelGrupoExitoVarios : idioma.lbMsgDelGrupoExitoUno);
                            } else if (responseData[0].length > 0 && responseData[1].length == 0) {

                                Ext.each(responseData[0], function (rec) {
                                    aux += rec + ', ';
                                });
                                grupos = aux.substring(0, aux.length - 2);
                                if (responseData[0].length > 1) {
                                    mostrarMensaje(3, 'Los grupos de trabajo' + ' ' + grupos + ' ' + 'no se pueden eliminar porque están siendo usados en el calendario.');
                                } else if (responseData[0].length == 1) {
                                    mostrarMensaje(3, 'El grupo de trabajo' + ' ' + grupos + ' ' + ' no se pueden eliminar porque está siendo usado en el calendario.');
                                }

                            } else if (responseData[0].length > 0 && responseData[1].length > 0) {

                                Ext.each(responseData[0], function (rec) {
                                    aux += rec + ', ';
                                });
                                grupos = aux.substring(0, aux.length - 2);
                                Ext.each(responseData[1], function (rec) {
                                    aux1 += rec;
                                });
                                personas = aux1.substring(0, aux1.length - 2);

                                if (responseData[0].length > 1 && responseData[1].length > 1) {
                                    mostrarMensaje(3, 'Los grupos de trabajo' + ' ' + grupos + ' ' + 'no se pueden eliminar porque están siendo usados en el calendario y las personas ' + ' ' + personas + ' ' + ' todavía tienen grupo en persona.');
                                } else if (responseData[0].length == 1 && responseData[1].length == 1) {
                                    mostrarMensaje(3, 'El grupo de trabajo' + ' ' + grupos + ' ' + 'no se puede eliminar porque está siendo usados en el calendario y' + ' ' + personas + ' ' + ' todavía tiene este grupo en persona.');
                                } else if (responseData[0].length == 1 && responseData[1].length > 1) {
                                    mostrarMensaje(3, 'El grupo de trabajo' + ' ' + grupos + ' ' + 'no se puede eliminar porque está siendo usado en el calendario y' + ' ' + personas + ' ' + ' todavía tienen grupo en persona.');
                                } else if (responseData[0].length > 1 && responseData[1].length == 1) {
                                    mostrarMensaje(3, 'Los grupos de trabajo' + ' ' + grupos + ' ' + 'no se pueden eliminar porque están siendo usados en el calendario y' + ' ' + personas + ' ' + ' todavía tiene grupo en persona');
                                }

                            } else if (responseData[0].length == 0 && responseData[1].length > 0) {

                                Ext.each(responseData[1], function (rec) {
                                    aux += rec + ', ';
                                    aux1 += rec;
                                });
                                grupos = aux.substring(0, aux.length - 2);
                                personas = aux1.substring(0, aux1.length - 2);

                                if (responseData[1].length > 1) {
                                    mostrarMensaje(3, 'Los grupos de trabajo no se pueden eliminar ya que hay personas que todavía tienen grupo en persona.');
                                } else if (responseData[1].length == 1) {
                                    mostrarMensaje(3, 'El grupo de trabajo no se puede eliminar ya que' + ' ' + personas + ' ' + 'todavía tiene grupo en persona.');
                                }

                            }
                            modelo.stListadoGrupoDescanso.reload();
                        }
                    });
                }
            });
        }

        function Notificar(mens, icon) {
            Ext.Notification.show({
                title: 'Informaci&oacute;n',
                icon: icon,
                msg: mens,
                time: 3
            });
        }

        vista.gplistadoregimentrabajo.on('click', function (e) {
            vista.pgrupoPersona.focus();
            variable = true;

        }, this);

        vista.gpListadoGrupoDescanso.on('click', function (e) {
            vista.plistadoPersona.focus();
            variable = false;

        }, this);

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imx',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 73: { //i para adicionar
                        vista.winAdicionarRT.setTitle(idioma.lbTitVentAddRegimen);
                        vista.winAdicionarRT.show();
                        vista.btnAplicar.show();
                        self.accion = 'add';

                        break;
                    }
                    case 77: { //m para modificar
                        if (!vista.btnModificar.disabled) {
                            var idregimentrabajo = vista.gplistadoregimentrabajo.getSelectionModel().getSelected().get('idregimentrabajo');
                            vista.winAdicionarRT.setTitle(idioma.lbTitVentModRegimen);
                            vista.btnAplicar.hide();
                            vista.winAdicionarRT.show();
                            vista.winAdicionarRT.doLayout();
                            vista.fadicionarRT.getForm().loadRecord(vista.gplistadoregimentrabajo.getSelectionModel().getSelected());
                            self.accion = 'mod';
                        }

                        break;
                    }
                    case 88: { //x para cancelar
                        if (vista.winAdicionarRT.isVisible()) {
                            vista.fadicionarRT.getForm().reset();
                            vista.winAdicionarRT.hide();
                        } else {
                            vista.winAdicionarGD.hide();
                        }
                        break;
                    }
                }
            }
        }, {
            key: 'imx',
            ctrl: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 73: { //i para adicionar
                        if (vista.gplistadoregimentrabajo.getSelectionModel().getSelected()) {
                            var regimentrabajo = vista.gplistadoregimentrabajo.getSelectionModel().getSelected().get('idregimentrabajo');
                            vista.combo.setValue(regimentrabajo);
                        } else {
                            vista.combo.setValue('');
                        }
                        vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
                        vista.winAdicionarGD.show();
                        self.accion = 'addGD';
                        break;
                    }
                    case 77: { //m para modificar
                        if (!vista.btnModificarP.disabled) {
                            vista.fadicionarGD.getForm().reset();
                            var idregimentrabajo = vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idgrupodescanso');
                            vista.fadicionarGD.getForm().loadRecord(vista.gpListadoGrupoDescanso.getSelectionModel().getSelected());
                            vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
                            vista.winAdicionarGD.show();
                            self.accion = 'modGD';
                        }


                        break;
                    }
                    case 88: { //x para cancelar
                        if (vista.winAdicionarRT.isVisible()) {
                            vista.fadicionarRT.getForm().reset();
                            vista.winAdicionarRT.hide();
                            scope.cambioDenominacion = false;
                        } else {
                            vista.winAdicionarGD.hide();
                            scope.cambioDenominacionGD = false;
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46,//del para eliminar
            fn: function () {
                if (variable == true) {
                    if (!vista.btnEliminar.disabled) {
                        Eliminar();
                    }
                }
            }
        }, {
            ctrl: true,
            key: 46,//del para eliminar
            fn: function () {
                if (!vista.btnEliminarP.disabled) {
                    EliminarGD();
                }
            }
        }, {
            key: 13,//enter para aceptar
            fn: function () {
                if (vista.winAdicionarRT.isVisible()) {
                    if (!vista.btnAceptar.disabled) {
                        guardarDatos('ACP');
                    }
                } else {
                    if (!vista.btnAceptarGD.disabled) {
                        guardarDatosGD('ACP');
                    }
                }
            }
        }, {
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'p',
            fn: function () {
                if (vista.winAdicionarRT.isVisible()) {
                    if (!vista.btnAplicar.disabled) {
                        guardarDatos('APL');
                    }
                } else {
                    if (!vista.btnAplicarGD.disabled) {
                        guardarDatosGD('APL');
                    }
                }
            }
        }]);

    }
}