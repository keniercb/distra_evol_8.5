//Empaquetando el componente tipo documento.
Ext.ns('Banco.Documento');

//Controller del componente Documento.
Banco.Documento.Controller = {
    /**
     *Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param view Vista del componente Banco.Documento
     * @param model Modelo de la vista del componente Banco.Documento
     * @param controller Controller de la vista del componente Banco.Documento
     */
    init: function (idioma, view, model, controller) {

        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        this.runner = new Ext.util.TaskRunner();
        this.tarea;

        this.startTaskValidation = function (form, accion, arrbotones) {
            this.tarea = {
                run: function () {
                    if (accion === 'add') {
                        if (form.isValid() && (view.ckbCobro.checked || view.ckbPago.checked)) {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(false);
                            }
                        } else {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(true);
                            }
                        }
                    } else {
                        if (form.isValid() && form.isDirty() && (view.ckbCobro.checked || view.ckbPago.checked)) {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(false);
                            }
                        } else {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(true);
                            }
                        }
                    }
                },
                interval: 300,
                scope: this
            };

            this.runner.start(this.tarea);
        };

        this.stopTaskValidation = function () {
            if (!Ext.isEmpty(this.tarea)) {
                this.runner.stop(this.tarea);
            }
        };

        //cargar el listado de documentos
        model.stTipoDocumentos.on({
            load: function () {
                view.gpdocumentos.getSelectionModel().selectFirstRow();
                view.btnAdicionar.focus();
            }
        });
        model.stTipoDocumentos.load();

        //evento seleccion de los documentos
        view.gpdocumentos.getSelectionModel().on('rowselect', function (sm, rowIndex, r) {
            view.gpdocumentos.getView().addRowClass(rowIndex, "negrita");
            view.btnEliminar.enable();
            if (sm.getCount() == 1)
                view.btnModificar.enable();
            else
                view.btnModificar.disable();
            if (r.get('asociado')) {
                //view.btnModificar.disable();
                view.btnEliminar.disable();
            }
        }, this);

        //evento deseleccion de los documentos
        view.gpdocumentos.getSelectionModel().on('rowdeselect', function (sm, rowIndex, r) {
            view.gpdocumentos.getView().removeRowClass(rowIndex, "negrita");
            if (!sm.hasSelection()) {
                view.btnModificar.disable();
                view.btnEliminar.disable();
            } else if (sm.getCount() == 1)
                view.btnModificar.enable();
        }, this);

        //accion de btn adicionar Documento
        view.btnAdicionar.on('click', function () {
            if (!view.windowopen) {
                controller.existeDocCertificar('add');
            }
        });

        //accion de btn modificar Documento
        view.btnModificar.on('click', function () {
            if (!view.windowopen) {
                controller.existeDocCertificar('mod');
            }
        });

        //accion de btn eliminar Documento
        view.btnEliminar.on('click', function () {
            if (!view.windowopen) {
                if (view.gpdocumentos.getSelectionModel().getSelected()) {
                    view.windowopen = true;//para decir q hay  ventanas abiertas
                    controller.MsgEliminar();
                }
            }
        });


        //accion de btn ayuda tipo documento
        view.btnAyuda.on('click', function () {
            //help.show(idioma.lbTitAyuda, 'confin/banco/configuracion/tipodoc');
        });

        //eventos de la ventana Add y Mod Documentos
        //evento al ocultarse
        view.winDocumento.on('hide', function () {
            view.windowopen = false;
            view.fpDocumento.getForm().reset();
            view.btnAdicionar.focus();

            view.globalKeyMap.enable();

            var objTipoDocumento = {
                cbTipodoc: '',
                tfvigencia: '',
                tfImporteMin: '',
                tfImporteMax: '',
                ckbCobro: false,
                ckbPago: false,
                ckbTalcobro: false,
                ckbTalpago: false,
                tfImporteCertf: '0.00',
                ckbcertifica: false
            };
            view.fpDocumento.getForm().setValues(objTipoDocumento);

            this.stopTaskValidation();
        }, this);

        //evento al darse render
        view.winDocumento.on('beforerender', function () {
//            model.stCbTipodoc.load();
        });

        view.winDocumento.on('beforeshow', function () {

            view.btnAceptar.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function () {
                        view.cbTipodoc.focus(true, true);
                    }
                }
            ]);

            view.cbTipodoc.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    shift: true,
                    stopEvent: true,
                    fn: function () {
                        view.btnAceptar.focus();
                    }
                }
            ]);

        });

        //evento al mostrarse
        view.winDocumento.on('show', function () {
            view.windowopen = true;
            view.cbTipodoc.focus(true, 100);

            view.globalKeyMap.disable();
        });

        //evento para el ENTER
        view.cbTipodoc.on('keypress', function (combo, event) {
            if (event.getKey() == 13)
                view.tfvigencia.focus(true, 100);
        });

        //evento para el ENTER
        view.tfvigencia.on('keypress', function (field, event) {
            if (event.getKey() == 13)
                view.tfImporteMin.focus(true, 100);
        });

        //evento para el ENTER
        view.tfImporteMin.on('keypress', function (field, event) {
            if (event.getKey() == 13)
                view.tfImporteMax.focus(true, 100);
        });

        view.tfImporteMin.validator = function (value) {
            if (view.tfImporteMax.getValue()) {
                var impmin = parseFloat(value);
                var impmax = parseFloat(view.tfImporteMax.getValue());

                if (impmin > impmax) {
                    return idioma.regexTextcomparemin;
                } else if (impmin == impmax) {
                    return idioma.regexTextcompareigual;
                }
            }
            return true;
        };

        //evento para el ENTER
        view.tfImporteMin.on('blur', function (field) {
            if (field.isValid())
                field.setRawValue(saldo(field.getValue()));

            if (field.getValue() && view.tfImporteMax.getValue()) {
                var impmin = parseFloat(field.getValue());
                var impmax = parseFloat(view.tfImporteMax.getValue());
                if (impmin > impmax)
                    //field.markInvalid('El importe mínimo no debe ser mayor al importe máximo');
                    field.markInvalid(idioma.regexTextcomparemin);
                else if (impmin == impmax)
                    //field.markInvalid('El importe mínimo y el máximo no deben ser iguales');
                    field.markInvalid(idioma.regexTextcompareigual);
                else
                    field.clearInvalid();
            }
        });

        //evento para el ENTER
        view.tfImporteMin.on('keyup', function (field, event) {
            if (field.getValue() && view.tfImporteMax.getValue()) {
                var impmin = parseFloat(field.getValue());
                var impmax = parseFloat(view.tfImporteMax.getValue());
                if (impmin > impmax)
                    field.markInvalid(idioma.regexTextcomparemin);
                else if (impmin == impmax)
                    field.markInvalid(idioma.regexTextcompareigual);
                else
                    field.clearInvalid();
            }
        });

        //evento para el ENTER
        view.tfImporteMax.on('keypress', function (field, event) {
            if (event.getKey() == 13)
                view.tfImporteCertf.focus(true, 100);
        });

        //evento para el ENTER
        view.tfImporteMax.on('blur', function (field, event) {
            if (field.isValid())
                field.setRawValue(saldo(field.getValue()));

            if (view.tfImporteMin.getValue() && field.getValue()) {
                var impmin = parseFloat(view.tfImporteMin.getValue());
                var impmax = parseFloat(field.getValue());
                if (impmin > impmax)
                    view.tfImporteMin.markInvalid(idioma.regexTextcomparemin);
                else if (impmin == impmax)
                    view.tfImporteMin.markInvalid(idioma.regexTextcompareigual);
                else
                    view.tfImporteMin.clearInvalid();
            }
        });

        //evento para el ENTER
        view.tfImporteMax.on('keyup', function (field, event) {
            if (view.tfImporteMin.getValue() && field.getValue()) {
                var impmin = parseFloat(view.tfImporteMin.getValue());
                var impmax = parseFloat(field.getValue());
                if (impmin > impmax)
                    view.tfImporteMin.markInvalid(idioma.regexTextcomparemin);
                else if (impmin == impmax)
                    view.tfImporteMin.markInvalid(idioma.regexTextcompareigual);
                else
                    view.tfImporteMin.clearInvalid();
            }
        });

        //evento para el ENTER
        view.tfImporteCertf.on('blur', function (field, event) {
            if (field.isValid())
                field.setRawValue(saldo(field.getValue()));
        });

        //evento para la seleccion del check
        view.ckbCobro.on('check', function (ckb, checked) {
            if (!checked)
                view.ckbTalcobro.setValue(false);
        });

        //evento para la seleccion del check
        view.ckbTalcobro.on('check', function (ckb, checked) {
            if (checked)
                view.ckbCobro.setValue(true);
        });

        //evento para la seleccion del check
        view.ckbPago.on('check', function (ckb, checked) {
            if (!checked)
                view.ckbTalpago.setValue(false);
        });

        //evento para la seleccion del check
        view.ckbTalpago.on('check', function (ckb, checked) {
            if (checked)
                view.ckbPago.setValue(true);
        });

        //accion de btn aplicar Documento
        view.btnAplicar.on('click', function () {
            controller.adicionarDocumento('apl');
        });

        //accion de btn aceptar Documento
        view.btnAceptar.on('click', function () {
            if (view.btnAplicar.isVisible())
                controller.adicionarDocumento();
            else
                controller.modificarDocumento();
        });

        //accion de btn cancelar winDocumento
        view.btnCancelar.on('click', function () {
            view.fpDocumento.getForm().reset();
            view.winDocumento.hide();
        });

        //teclas de acceso rapido    
        //adicionar Documento
        view.globalKeyMap.accessKey({
            key: 'i',
            alt: true
        }, function () {
            if (!view.windowopen) {
                controller.existeDocCertificar('add');
            }
        }, Ext.getBody());

        //modificar Documento
        view.globalKeyMap.accessKey({
            key: 'm',
            alt: true
        }, function () {
            if (!view.windowopen && !view.btnModificar.disabled) {
                controller.existeDocCertificar('mod');
            }
        }, Ext.getBody());

        //eliminar Documento
        view.globalKeyMap.accessKey({
            key: Ext.EventObject.DELETE
        }, function () {
            if (!view.windowopen && !view.btnEliminar.disabled) {
                if (view.gpdocumentos.getSelectionModel().getSelected()) {
                    view.windowopen = true;//para decir q hay  ventanas abiertas
                    controller.MsgEliminar();
                }
            }
        }, Ext.getBody());

        //ayuda Documento
        view.globalKeyMap.accessKey({
            key: 'h',
            alt: true
        }, function () {
            help.show(idioma.lbTitAyuda, 'confin/banco/configuracion/tipodoc');
        }, Ext.getBody());


        //marcar o no el check de certificar documento    
        this.existeDocCertificar = function (accion) {
            controller.MostrarMensaje(idioma.lbTextCargando);
            Ext.Ajax.request({
                url: 'existedoccertificar',
                method: 'POST',
                scope: this,
                callback: function (options, success, response) {
                    var certifica = Ext.decode(response.responseText);
                    view.ckbcertifica.setDisabled(true); //desactiva el check porque viene con el dato certificado
                    if (accion == 'mod') {//caso en que se esta modificando        
                        if (!certifica && view.gpdocumentos.getSelectionModel().getSelected())
                            view.ckbcertifica.setDisabled(false);
                        else if (certifica && view.gpdocumentos.getSelectionModel().getSelected().data.certifica)
                            view.ckbcertifica.setDisabled(false);

                        model.stCbTipodoc.load({
                            scope: this,
                            callback: function () {
                                loadMask.hide();
                                view.winDocumento.setTitle(idioma.lbTitMod);
                                view.btnAplicar.setVisible(false);
                                view.winDocumento.show();
                                view.winDocumento.center();
                                view.cbTipodoc.focus(true, 100);

                                model.stCbTipodoc.addSorted(new Ext.data.Record({
                                    iddoc: view.gpdocumentos.getSelectionModel().getSelected().data.iddoc,
                                    denominacion: view.gpdocumentos.getSelectionModel().getSelected().data.denominacion
                                }));

//                                view.cbTipodoc.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.iddoc);
//                                view.tfvigencia.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.vigencia);
//                                view.tfImporteMin.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.importemin);
//                                view.tfImporteMax.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.importemax);
//                                view.ckbCobro.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.cobro);
//                                view.ckbPago.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.pago);
//                                view.ckbTalcobro.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.talonariocobro);
//                                view.ckbTalpago.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.talonario);
//                                view.tfImporteCertf.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.importecertifica);
//                                view.ckbcertifica.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.certifica);


                                var objTipoDocumento = {
                                    cbTipodoc: view.gpdocumentos.getSelectionModel().getSelected().data.iddoc,
                                    tfvigencia: view.gpdocumentos.getSelectionModel().getSelected().data.vigencia,
                                    tfImporteMin: view.gpdocumentos.getSelectionModel().getSelected().data.importemin,
                                    tfImporteMax: view.gpdocumentos.getSelectionModel().getSelected().data.importemax,
                                    ckbCobro: view.gpdocumentos.getSelectionModel().getSelected().data.cobro,
                                    ckbPago: view.gpdocumentos.getSelectionModel().getSelected().data.pago,
                                    ckbTalcobro: view.gpdocumentos.getSelectionModel().getSelected().data.talonariocobro,
                                    ckbTalpago: view.gpdocumentos.getSelectionModel().getSelected().data.talonario,
                                    tfImporteCertf: view.gpdocumentos.getSelectionModel().getSelected().data.importecertifica,
                                    ckbcertifica: view.gpdocumentos.getSelectionModel().getSelected().data.certifica
                                };
                                view.fpDocumento.getForm().setValues(objTipoDocumento);
                                if (view.gpdocumentos.getSelectionModel().getSelected().data.asociado == true)
                                    view.cbTipodoc.disable();
                                else view.cbTipodoc.enable();
                                //Se inicia la tarea
                                this.startTaskValidation(view.fpDocumento.getForm(), 'mod', [view.btnAceptar]);
                            }
                        });
                    } else {
                        if (!certifica)
                            view.ckbcertifica.setDisabled(false);

                        model.stCbTipodoc.load({
                            scope: this,
                            callback: function () {
                                loadMask.hide();
                                view.cbTipodoc.focus(true, 100);
                                if (!model.stCbTipodoc.getCount()) {
                                    // mostrarMensaje('1','No existen instrumentos de pago definidos para Banco.<br>Por favor configure los documentos primarios para continuar.</>');
                                    mostrarMensaje('1', idioma.lbMSGsintipodoc);
                                } else if (model.stCbTipodoc.getCount() == model.stTipoDocumentos.getCount()) {
                                    // mostrarMensaje('1','Todos los instrumentos de pago definidos para Banco han sido configurados.<br>Por favor configure los documentos primarios para continuar.</>');
                                    mostrarMensaje('1', idioma.lbMSGsindoconfig);
                                } else {
                                    view.winDocumento.setTitle(idioma.lbTitAdd);
                                    view.btnAplicar.setVisible(true);
                                    view.winDocumento.show();
                                    view.winDocumento.center();

                                    //Se inicia la tarea
                                    this.startTaskValidation(view.fpDocumento.getForm(), 'add', [view.btnAplicar, view.btnAceptar]);
                                }
                            }
                        });
                    }
                }
            });
        };

        //valida el formulario adicionar
        this.validaFormulario = function () {
            var flag = true;
            if (!view.fpDocumento.getForm().isValid())
                flag = false;
            if (view.tfvigencia.getValue() == '0') {
                view.tfvigencia.markInvalid(idioma.regexTextvigencia);
                flag = false;
            }
            if (parseFloat(view.tfImporteMin.getValue()) == 0) {
                view.tfImporteMin.markInvalid(idioma.notImpmin);
                flag = false;
            }
            if (parseFloat(view.tfImporteMax.getValue()) == 0) {
                view.tfImporteMax.markInvalid();
                flag = false;
            }
            if (!flag) {
                view.cbTipodoc.focus(true, true);
                mostrarMensaje(1, idioma.lbMsgcampo);
            } else {
                if (parseFloat(view.tfImporteMax.getValue()) <= parseFloat(view.tfImporteMin.getValue())) {
                    mostrarMensaje(1, idioma.lbMsgscampoimporte);
                    view.tfImporteMax.setValue('');
                    flag = false;
                } else if (!view.ckbCobro.getValue() && !view.ckbPago.getValue()) {
                    mostrarMensaje(1, idioma.lbMsgscobropago);
                    flag = false;
                }
            }
            return flag;
        };

        //adiciona el documento
        this.adicionarDocumento = function (apl) {
            if (controller.validaFormulario()) {
                controller.progressBar(idioma.lbMsgGuardando);
                cobroypago = 0;
                tienetalonario = 0;
                cobroypago += view.ckbCobro.getValue() ? 1 : 0;//1 si es cobro
                cobroypago += view.ckbPago.getValue() ? 2 : 0;//2 si es pago
                tienetalonario += view.ckbTalcobro.getValue() ? 1 : 0;//1 si cobro tiene talonario, 0 no tiene, 3 cobros y pagos
                tienetalonario += view.ckbTalpago.getValue() ? 2 : 0;//2 si pago tiene talonario
                Ext.Ajax.request({
                    url: 'insertarTiposDocsBanco',
                    method: 'POST',
                    params: {
                        idtipodocumento: view.cbTipodoc.getValue(),
                        importemin: view.tfImporteMin.getValue(),
                        importemax: view.tfImporteMax.getValue(),
                        vigencia: view.tfvigencia.getValue(),
                        tienetalonario: tienetalonario,
                        cobroypago: cobroypago,
                        importecertf: view.tfImporteCertf.getValue(),
                        certifica: view.ckbcertifica.getValue() ? 1 : 0
                    },
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        if (!response.responseText)
                            mostrarMensaje(3, idioma.lbMsgerrorInterno);
                        else {
                            var responseData = Ext.decode(response.responseText);
                            switch (responseData.n_codMsg) {
                                case 1:
                                    mostrarMensaje(1, idioma.lbMsgExisto);
                                    view.gpdocumentos.getSelectionModel().clearSelections();
                                    if (apl) {
                                        model.stCbTipodoc.reload({
                                            callback: function (r, options, success) {
                                                if (!model.stCbTipodoc.getCount()) {
                                                    view.winDocumento.hide();
                                                } else {
                                                    //view.cbTipodoc.clearValue();
                                                    //view.cbTipodoc.setValue(model.stCbTipodoc.getAt(0).get('iddoc'));
                                                    controller.limpiarFormulario();

                                                    Ext.Ajax.request({
                                                        url: 'existedoccertificar',
                                                        method: 'POST',
                                                        scope: this,
                                                        callback: function (options, success, response) {
                                                            var certifica = Ext.decode(response.responseText);
                                                            if (certifica) {
                                                                view.ckbcertifica.setDisabled(true);
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    } else {
                                        view.winDocumento.hide();
                                    }
                                    view.gpdocumentos.getStore().reload();
                                    break;
                                case 3:
                                    mostrarMensaje(3, responseData.mensaje);
                                    break;
                                case 4:
                                    mostrarMensaje(1, idioma.lbMsgErrorseleccAdd);
                                    model.stCbTipodoc.load({
                                        callback: function (r, options, success) {
                                            if (!model.stCbTipodoc.getCount()) {
                                                view.gpdocumentos.getSelectionModel().clearSelections();
                                                view.winDocumento.hide();
                                                view.gpdocumentos.getStore().reload();
                                            } else
                                                view.cbTipodoc.markInvalid(idioma.regexoblig);
                                        }
                                    });
                                    view.cbTipodoc.clearValue();
                                    break;
                                default:
                                    mostrarMensaje(3, idioma.lbMsgerrorInterno);
                                    break;
                            }
                        }
                    }
                });
            }
        };

        //verifica si se realizaron cambios
        this.cambioFormulario = function () {
            if (view.cbTipodoc.getValue() != view.gpdocumentos.getSelectionModel().getSelected().data.iddoc)
                return true;
            else if (view.tfvigencia.getValue() != view.gpdocumentos.getSelectionModel().getSelected().data.vigencia)
                return true;
            else if (view.tfImporteMin.getValue() != view.gpdocumentos.getSelectionModel().getSelected().data.importemin)
                return true;
            else if (view.tfImporteMax.getValue() != view.gpdocumentos.getSelectionModel().getSelected().data.importemax)
                return true;
            else if (view.ckbCobro.getValue() != view.gpdocumentos.getSelectionModel().getSelected().data.cobro)
                return true;
            else if (view.ckbTalcobro.getValue() != view.gpdocumentos.getSelectionModel().getSelected().data.talonariocobro)
                return true;
            else if (view.ckbPago.getValue() != view.gpdocumentos.getSelectionModel().getSelected().data.pago)
                return true;
            else if (view.ckbTalpago.getValue() != view.gpdocumentos.getSelectionModel().getSelected().data.talonario)
                return true;
            else if (view.tfImporteCertf.getValue() != view.gpdocumentos.getSelectionModel().getSelected().data.importecertifica)
                return true;
            else if (view.ckbcertifica.getValue() != view.gpdocumentos.getSelectionModel().getSelected().data.certifica)
                return true;
            else {
                view.cbTipodoc.focus(true, true);
                mostrarMensaje(1, idioma.lbMsgCampossinMod);
                return false;
            }
        };

        //modifica el documento
        this.modificarDocumento = function () {
            if (controller.validaFormulario() && controller.cambioFormulario()) {//se agrego el salto de validacion porque no ejecutaba la primera
                //controller.MostrarMensaje(idioma.lbMsgGuardando);
                controller.progressBar(idioma.lbMsgGuardando);
                cobroypago = 0;
                tienetalonario = 0;
                cobroypago += view.ckbCobro.getValue() ? 1 : 0;//1 si es cobro
                cobroypago += view.ckbPago.getValue() ? 2 : 0;//2 si es pago
                tienetalonario += view.ckbTalcobro.getValue() ? 1 : 0;//1 si cobro tiene talonario
                tienetalonario += view.ckbTalpago.getValue() ? 2 : 0;//2 si pago tiene talonario
                Ext.Ajax.request({
                    url: 'modificarTiposDocsBanco',
                    method: 'POST',
                    params: {
                        idtipodocumento: view.cbTipodoc.getValue(),
                        importemin: view.tfImporteMin.getValue(),
                        importemax: view.tfImporteMax.getValue(),
                        vigencia: view.tfvigencia.getValue(),
                        tienetalonario: tienetalonario,
                        cobroypago: cobroypago,
                        idtipodoctalonario: view.gpdocumentos.getSelectionModel().getSelected().data.idtipodoctalonario,
                        importecertf: view.tfImporteCertf.getValue(),
                        certifica: view.ckbcertifica.getValue() ? 1 : 0
                    },
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        if (!response.responseText)
                            mostrarMensaje(3, idioma.lbMsgerrorInterno);
                        else {
                            var responseData = Ext.decode(response.responseText);
                            switch (responseData.n_codMsg) {
                                case 1:
                                    mostrarMensaje(1, idioma.lbMsgExistoMod);
                                    view.gpdocumentos.getSelectionModel().clearSelections();
                                    view.winDocumento.hide();
                                    view.gpdocumentos.getStore().reload();
                                    break;
                                case 2:
                                    //mostrarMensaje(1,'No se pudo modificar el instrumento de pago.<br> El instrumento de pago seleccionado no est&aacute; configurado.</br>');
                                    //--el  sms de arriba ahora dice: El instrumento de pago seleccionado no ha sido modificado debido a que la configuraci'on del  mismo ha cambiado. Por favor, contacte al administrador.
                                    mostrarMensaje(1, idioma.lbMsgErrorMod);
                                    view.gpdocumentos.getSelectionModel().clearSelections();
                                    view.winDocumento.hide();
                                    view.gpdocumentos.getStore().reload();
                                    break;
                                case 3:
                                    mostrarMensaje(3, responseData.mensaje);
                                    break;
                                case 4:
                                    //mostrarMensaje(1,'No se pudo modificar el instrumento de pago.<br> El instrumento de pago seleccionado ya est&aacute; configurado.</br>');
                                    //--el  sms de arriba ahora dice: El instrumento de pago seleccionado ya est&aacute; configurado.Por favor,seleccione otro  instrumento de pago para continuar.
                                    mostrarMensaje(1, idioma.lbMsgErrorseleccMod);
                                    model.stCbTipodoc.load({
                                        callback: function (r, options, success) {
                                            model.stCbTipodoc.addSorted(new Ext.data.Record({
                                                iddoc: view.gpdocumentos.getSelectionModel().getSelected().data.iddoc,
                                                denominacion: view.gpdocumentos.getSelectionModel().getSelected().data.denominacion
                                            }));
                                            view.cbTipodoc.setValue(view.gpdocumentos.getSelectionModel().getSelected().data.iddoc);
                                        }
                                    });
                                    break;
                                case 5:
                                    //mostrarMensaje(1,'No se pudo modificar el instrumento de pago.<br> El instrumento de pago seleccionado posee talonarios asociados.</br>');
                                    mostrarMensaje(1, idioma.lbMsgErrorTalonarioAsoc);
                                    view.gpdocumentos.getSelectionModel().clearSelections();
                                    view.winDocumento.hide();
                                    view.gpdocumentos.getStore().reload();
                                    break;

                                case 6:
                                    mostrarMensaje(1, idioma.lbMsgErrorInstAsoc);
                                    view.gpdocumentos.getSelectionModel().clearSelections();
                                    view.winDocumento.hide();
                                    view.gpdocumentos.getStore().reload();
                                    break;
                                default:
                                    mostrarMensaje(3, idioma.lbMsgerrorInterno);
                                    break;
                            }
                        }
                    }
                });
            }
        };

        //muestra msg question eliminar
        this.MsgEliminar = function () {
            Ext.Msg.show({
                title: idioma.lbMsgTitleConf,
                buttons: Ext.Msg.OKCANCEL,
                msg: String.fromCharCode(191) + idioma.lbMsgEliminar,
                icon: Ext.MessageBox.QUESTION,
                fn: function (btn) {
                    if (btn == 'ok') {
                        controller.EliminarDoc();
                    } else {
                        view.windowopen = false;
                    }
                }
            });
        }

        //elimina el Documento seleccionado
        this.EliminarDoc = function () {
            controller.progressBar(idioma.lbMsgtextEliminando);
            var seleccionados = view.gpdocumentos.getSelectionModel().getSelections();
            var eliminar = new Array();
            for (var i = 0; i < seleccionados.length; i++) {
                eliminar[i] = seleccionados[i].data.idtipodoctalonario;
            }
            Ext.Ajax.request({
                url: 'eliminarTiposDocsBanco',
                method: 'POST',
                params: {
                    elementos: Ext.encode(eliminar)
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    view.gpdocumentos.getSelectionModel().clearSelections();
                    if (!response.responseText)
                        mostrarMensaje(3, idioma.lbMsgerrorInterno);
                    else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.n_codMsg) {
                            case 1:
                                if (seleccionados.length == 1) {
                                    view.windowopen = false;
                                    mostrarMensaje(1, idioma.lbMsgExistoElim);
                                } else {
                                    view.windowopen = false;
                                    mostrarMensaje(1, idioma.lbMsgExistoElimMas);
                                }
                                break;
                            case 2:
                                view.windowopen = false;
                                mostrarMensaje(3, idioma.lbMsgerrorInterno);
                                break;
                            case 3:
                                view.windowopen = false;
                                mostrarMensaje(3, responseData.mensaje);
                                break;
                            case 4:
                                if (seleccionados.length == 1) {
                                    view.windowopen = false;
                                    mostrarMensaje(1, idioma.lbMsgErrorTalonarioAsocE);
                                } else {
                                    view.windowopen = false;
                                    mostrarMensaje(1, idioma.lbMsgErrorTalonarioAsocEMas);
                                }
                                break;
                            case 5:
                                if (seleccionados.length == 1) {
                                    view.windowopen = false;
                                    mostrarMensaje(1, idioma.lbMsgErrorInstAsocE);
                                } else {
                                    view.windowopen = false;
                                    mostrarMensaje(1, idioma.lbMsgErrorInstAsocEMas);
                                }
                                break;
                            default:
                                mostrarMensaje(3, idioma.lbMsgerrorInterno);
                                break;
                        }
                    }
                    model.stTipoDocumentos.reload();
                }
            });
            view.btnEliminar.disable();
        };

        //muestra la mascara segun el msg 
        this.MostrarMensaje = function (mensaje) {
            loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };
        this.progressBar = function (msg) {
            Ext.MessageBox.show({
                title: idioma.lbMsgEspere,
                msg: msg,
                width: 300,
                progress: true,
                closable: false
            });
            var f = function (v) {
                return function () {
                    var i = v / 11;
                    Ext.MessageBox.updateProgress(i/*, Math.round(100*i)+'% completado'*/);
                };
            };
            for (var i = 1; i < 12; i++) {
                setTimeout(f(i), i * 500);
            }
        };//fn de la funcion progressBar

        this.limpiarFormulario = function () {
            var objTipoDocumento = {
                cbTipodoc: '',
                tfvigencia: '',
                tfImporteMin: '',
                tfImporteMax: '',
                ckbCobro: false,
                ckbPago: false,
                ckbTalcobro: false,
                ckbTalpago: false,
                tfImporteCertf: '0.00',
                ckbcertifica: false
            };
            view.fpDocumento.getForm().setValues(objTipoDocumento);
        };

    }
};
 