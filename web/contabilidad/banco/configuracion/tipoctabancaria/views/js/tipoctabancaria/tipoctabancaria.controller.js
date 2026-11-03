//Empaquetando el componente tipo cta bancaria.
Ext.ns('Banco.Tipoctabancaria');

//Controller del componente Tipo cta bancaria.
Banco.Tipoctabancaria.Controller = {
    /**
     *Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param view Vista del componente Banco.Tipoctabancaria
     * @param model Modelo de la vista del componente Banco.Tipoctabancaria
     * @param controller Controller de la vista del componente Banco.Tipoctabancaria
     */
    init: function(idioma, view, model) {
        controller = this;

        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        this.runner = new Ext.util.TaskRunner();
        this.tarea;

        this.startTaskValidation = function(form, accion, arrbotones) {
            this.tarea = {
                run: function() {
                    if (accion === 'add') {
                        if (form.isValid()) {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(false);
                            }
                        }
                        else {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(true);
                            }
                        }
                    }
                    else {
                        if (form.isValid() && form.isDirty()) {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(false);
                            }
                        }
                        else {
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

        this.stopTaskValidation = function() {
            if (!Ext.isEmpty(this.tarea)) {
                this.runner.stop(this.tarea);
            }
        };

        Ext.Ajax.request({
            url: 'showHeredar',
            method: 'post',
            callback: function(options, success, response) {
                var res = Ext.decode(response.responseText);
                if (res.showHeredar == 1) {
                    view.btnHeredar.show();
                }
                else {
                    view.btnHeredar.hide();
                }
            }
        });
        model.stTipoCtaB.load({params: {start: 0, limit: 20}});
        //evento  para seleccionar en la ventana principal, la primera fila del  grid
        model.stTipoCtaB.on('load', function(store, records, options) {
            view.gpTipoCtaB.getSelectionModel().selectFirstRow();
            view.btnAdicionar.focus();
        });

        //evento seleccion de los los tipos de cuenta bancaria
        view.gpTipoCtaB.getSelectionModel().on('rowselect', function(sm, rowIndex, r) {
            view.gpTipoCtaB.getView().addRowClass(rowIndex, "negrita");
            view.btnEliminar.enable();
            if (sm.getCount()) {
                view.btnModificar.enable();
                view.btnEliminar.enable();
            } else {
                view.btnModificar.disable();
                view.btnEliminar.disable();
            }

            if (r.data.libre == '0') {
                view.btnModificar.disable();
                view.btnEliminar.disable();
            }
        }, this);

        //evento deseleccion de los tipos de cuenta bancaria
        view.gpTipoCtaB.getSelectionModel().on('rowdeselect', function(sm, rowIndex, r) {
            view.gpTipoCtaB.getView().removeRowClass(rowIndex, "negrita");
            if (!sm.hasSelection()) {
                view.btnModificar.disable();
                view.btnEliminar.disable();
            }
            else
            if (sm.getCount() == 1)
                view.btnModificar.enable();
        }, this);

        //ACCIONES DE LOS BOTONES DE LA VENTANA PRINCIPAL


        //accion de btn adicionar tipo  cta bancaria
        view.btnAdicionar.on('click', function() {
            if (!view.windowopen) {
                controller.gestionarTipoCtaB('add');
            }
        });

        //accion de btn modificar tipo  cta bancaria
        view.btnModificar.on('click', function() {
            if (!view.windowopen) {
                controller.gestionarTipoCtaB('mod');
            }
        });

        //accion de btn ayuda tipo  cta bancaria
        view.btnAyuda.on('click', function() {
            //help.show(idioma.lbTitleAyuda, 'confin/banco/configuracion/tipocta');
        });


        //eventos de la ventana Add y  Mod
        view.winTipoCtaB.on('hide', function() {
            view.windowopen = false;
//            view.fpTipoCtaB.getForm().reset();
            this.limpiarForm();
            view.globalKeyMap.enable();

            this.stopTaskValidation();
        }, this);

        //evento al mostrarse
        view.winTipoCtaB.on('show', function() {
            view.windowopen = true;
            view.tfcodigo.focus(true, 100);
            view.globalKeyMap.disable();
        });

        view.winTipoCtaB.on('beforeshow', function() {

            //Agregando un keymap al boton aceptar
            view.btnAceptar.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function() {
                        view.tfcodigo.focus(true, true);
                    }
                }
            ]);

            //Agregando un keymap al tfcodigo
            view.tfcodigo.getEl().addKeyMap({
                key: Ext.EventObject.TAB,
                shift: true,
                stopEvent: true,
                fn: function() {
                    view.btnAceptar.focus();
                }
            });

            switch (controller.accion) {
                case 'add' :
                    {
                        view.winTipoCtaB.setTitle(idioma.lbTitleAddTipoCta);
                        view.btnAplicar.setVisible(true);

                        this.startTaskValidation(view.fpTipoCtaB.getForm(), 'add', [view.btnAplicar, view.btnAceptar]);
                    }
                    break;
                case 'mod' :
                    {
                        view.winTipoCtaB.doLayout();
                        view.winTipoCtaB.setTitle(idioma.lbTitleModTipoCta);
                        view.btnAplicar.setVisible(false);

                        var objLoadForm = {
                            tfcodigo: view.gpTipoCtaB.getSelectionModel().getSelected().data.codigo,
                            tfdenominacion: view.gpTipoCtaB.getSelectionModel().getSelected().data.denominacion
                        };
                        view.fpTipoCtaB.getForm().setValues(objLoadForm);

                        this.startTaskValidation(view.fpTipoCtaB.getForm(), 'mod', [view.btnAceptar]);
                    }
                    break;
            }
        }, this);



        view.tfcodigo.on('keypress', function(tf, e) {
            if (e.getKey() != 8 && e.getKey() != 46) { // Para que permita borrar
                var value = new String(tf.getValue());
                if (value.length == 0 && e.getKey() == 32) {
                    e.stopEvent(); // Para que no empiece por un espacio
                }
            }

            if (e.getKey() == 13) {
                if (view.tfdenominacion.getValue() == '') {
                    view.tfdenominacion.focus(true, 100);
                } else if (view.tfdenominacion.isValid()) {
                    if (view.btnAplicar.isVisible()) {
                        controller.adicionarTipoctabancaria('apl');
                    } else {
                        controller.modificarTipoctabancaria();
                    }
                }
            }
        });

        view.tfdenominacion.on('keypress', function(tf, e) {
            if (e.getKey() != 8 && e.getKey() != 46) { // Para que permita borrar
                var value = new String(tf.getValue());
                if (value.length == 0 && e.getKey() == 32) {
                    e.stopEvent(); // Para que no empiece por un espacio
                }
            }
            if ((e.getKey() == 13) && (view.tfcodigo.getValue() != '')) {
                if (view.btnAplicar.isVisible()) {
                    controller.adicionarTipoctabancaria('apl');
                } else {
                    controller.modificarTipoctabancaria();
                }
            }

        });

        view.tfdenominacion.on('blur', function(tf, e) {
            view.tfdenominacion.setValue(controller.limpiarEspacios(view.tfdenominacion.getValue()));
            //nombreTasa.setValue(limpiarEspacios(nombreTasa.getValue()));
        });


        //accion de btn aplicar en la ventana Add y  Mod
        view.btnAplicar.on('click', function() {
            controller.adicionarTipoctabancaria('ap');
        });

        //accion de btn aceptar en la ventana Add y  Mod
        view.btnAceptar.on('click', function() {
            if (view.btnAplicar.isVisible()) {
                controller.adicionarTipoctabancaria();
            } else {
                controller.modificarTipoctabancaria();
            }
        });

        //accion de btn cancelar en la ventana Add y  Mod
        view.btnCancelar.on('click', function() {
//            view.fpTipoCtaB.getForm().reset();
            this.limpiarForm();
            view.winTipoCtaB.hide();
        }, this);

        //accion de btn eliminar tipo  cta bancaria
        view.btnEliminar.on('click', function() {
            if (!view.windowopen) {
                if (view.gpTipoCtaB.getSelectionModel().getSelected()) {
                    controller.MsgEliminar();
                }
            }
        });

        //accion de btn heredar tipo  cta bancaria
        view.btnHeredar.on('click', function() {
            if (!view.windowopen) {
                //if (view.gpTipoCtaB.getSelectionModel().getSelected()) {
                controller.mostrarHeredar();
                // }
            }
        });

        //accion de btn Heredar tipo  cta bancaria
        model.stHeredar.on('load', function() {
            if (model.stHeredar.getCount() < 1) {
                //mostrarMensaje(1,'No existen tipos de cuenta bancaria para heredar.',
//                view.winHeredar.hide();
                mostrarMensaje(1, idioma.lbMsgSinTipoCtaHeredar);
            } else {
                var hayseleccionados = (view.gpHeredar.getSelectionModel().getSelections().length > 0) ? true : false;
                view.btnAplicarH.setDisabled(!hayseleccionados);
                view.btnAceptarH.setDisabled(!hayseleccionados);

                view.winHeredar.show();
                view.winHeredar.center();
            }
        });

        view.gpHeredar.getSelectionModel().on({
            scope: this,
            rowdeselect: function() {
                var hayseleccionados = (view.gpHeredar.getSelectionModel().getSelections().length > 0) ? true : false;
                view.btnAplicarH.setDisabled(!hayseleccionados);
                view.btnAceptarH.setDisabled(!hayseleccionados);
            },
            rowselect: function() {
                var hayseleccionados = (view.gpHeredar.getSelectionModel().getSelections().length > 0) ? true : false;
                view.btnAplicarH.setDisabled(!hayseleccionados);
                view.btnAceptarH.setDisabled(!hayseleccionados);
            }
        });

        //eventos de la ventana Heredar
        view.winHeredar.on('hide', function() {
            view.windowopen = false;
            model.stHeredar.removeAll();
            view.gpHeredar.getSelectionModel().clearSelections();
        });

        //evento al mostrarse
        view.winHeredar.on('show', function() {
            view.windowopen = true;
        });

        //accion de btn cancelar Heredar tipo  cta bancaria
        view.btnCancelarH.on('click', function() {
            view.gpHeredar.getSelectionModel().clearSelections();
            view.winHeredar.hide();
        });

        //accion de btn aplicar Heredar tipo  cta bancaria
        view.btnAplicarH.on('click', function() {
            //controller.adicionarDocumento('apl');
            if (view.gpHeredar.getSelectionModel().getSelections().length > 0) {
                controller.heredarTCB(view.gpHeredar.getSelectionModel().getSelections(), 'apl');
            }
        });

        //accion de btn aceptar Heredar tipo  cta bancaria
        view.btnAceptarH.on('click', function() {
            if (view.gpHeredar.getSelectionModel().getSelections().length > 0) {
                controller.heredarTCB(view.gpHeredar.getSelectionModel().getSelections(), 'acep');
            }
        });

//carga los datos iniciales y valida la apertura
        this.loadDataIni = function() {
            controller.MostrarMensaje(idioma.msgLoad);
            Ext.Ajax.request({
                url: 'loadDataIni',
                method: 'POST',
                params: {
                    start: 0,
                    limit: view.gpTipoCtaB.getBottomToolbar().pageSize
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    /*if (responseData.aperturado == 0) {//0=ci, 1=aperturado
                     mostrarMensaje(1, 'Banco ha cerrado las operaciones de la carga inicial.', function(btn) {
                     if (btn == 'ok' || btn == 'cancel') {
                     view.viewPort.disable();
                     view.gpEstadocuenta.disable();
                     view.pOperaciones.disable();
                     }
                     });
                     }
                     else {*/
                    //cargar el listado de los tipos de cuenta bancaria
                    model.stTipoCtaB.loadData(responseData.gridTipoCta);
                    //}
                    loadMask.hide();
                }//callback
            });
        };

        this.gestionarTipoCtaB = function(opcion) {
            this.accion = opcion;
            controller.MostrarMensaje(idioma.lbTextCargandoTipoCB);
            view.winTipoCtaB.show();
            view.winTipoCtaB.center();
            loadMask.hide();
        };

        this.adicionarTipoctabancaria = function(opcion) {
            if (view.fpTipoCtaB.getForm().isValid()) {
                controller.progressBar(idioma.lbMsgGuardando);
                view.fpTipoCtaB.getForm().submit({
                    url: 'insertartipocuenta',
                    failure: function(form, action) {
                        Ext.MessageBox.hide();
                        switch (action.result.n_codMsg)
                        {
                            case -1: // El codigo del tipo de cuenta bancaria a insertar ya existe
                                mostrarMensaje(1, idioma.lbMsgExistCod/* + '<b>' + view.tfcodigo.getValue() + '</b>' + '. '*/);
                                break;
                            case -2: // La denominacion del tipo de cuenta bancaria a insertar ya existe
                                mostrarMensaje(1, idioma.lbMsgExistDenom /*+ '<b>' + view.tfdenominacion.getValue() + '</b>' + '. '*/);
                                break;
                            case 1:
                                model.stTipoCtaB.reload();
                                if (opcion == 'ap')
                                    view.tfcodigo.focus(true, 100);

                                mostrarMensaje(1, idioma.lbMsgExisto);

//                                view.fpTipoCtaB.getForm().reset();
                                controller.limpiarForm();
                                if (opcion != 'ap') {
                                    view.winTipoCtaB.hide();
                                }
                                break;
                            default:
                                mostrarMensaje(action.result.n_codMsg, action.result.mensaje);
                        }
                    }
                });
            } else {
                if (view.tfcodigo.isValid()) {
                    view.tfdenominacion.focus(true, true);
                }
                else {
                    view.tfcodigo.focus(true, true);
                }
                mostrarMensaje(1, idioma.lbMsgselcampo);
            }
        };

        this.modificarTipoctabancaria = function(opcion) {

            if (view.fpTipoCtaB.getForm().isValid()) {// si es correcto
                if (!controller.verificarCambio()) {// si realiz� alg�n cambio a modificar
                    controller.progressBar(idioma.lbMsgGuardando);
                    view.fpTipoCtaB.getForm().submit({
                        url: 'modificartipocuenta',
                        params: {
                            idtipocuenta: view.gpTipoCtaB.getSelectionModel().getSelected().data.idtipocuenta,
                            version: view.gpTipoCtaB.getSelectionModel().getSelected().get("version")
                        },
                        success: function(form, action) {
                            Ext.MessageBox.hide();
                        },
                        failure: function(form, action) {
                            Ext.MessageBox.hide();
                            switch (action.result.n_codMsg)
                            {
                                case -1: // El codigo del tipo de cuenta bancaria a insertar ya existe
                                    mostrarMensaje(1, idioma.lbMsgExistCodMod/* + '<b>' + view.tfcodigo.getValue() + '</b>' + '.'*/);
                                    break;
                                case -2: // La denominacion del tipo de cuenta bancaria a insertar ya existe
                                    mostrarMensaje(1, idioma.lbMsgExistDenomMod/* + '<b>' + view.tfdenominacion.getValue() + '</b>' + '. '*/);
                                    break;
                                case 1:
                                    mostrarMensaje(1, idioma.lbMsgExistoMod);
                                    model.stTipoCtaB.reload();
                                    view.winTipoCtaB.hide();
                                    break;
                                default:
                                    mostrarMensaje(action.result.n_codMsg, action.result.mensaje);
                            }
                        }
                    });
                } else {
                    view.tfcodigo.focus(true, true);
                    mostrarMensaje(1, idioma.lbMsgCampossinMod);
                }
            } else {
                if (view.tfcodigo.isValid()) {
                    view.tfdenominacion.focus(true, true);
                }
                else {
                    view.tfcodigo.focus(true, true);
                }
                mostrarMensaje(1, idioma.lbMsgselcampo);
            }
        };

        this.verificarCambio = function() {
            var conservar = true;
            // verifica si  ahy  cambios en los campos del  formulario		
            if (view.tfcodigo.getValue() != view.gpTipoCtaB.getSelectionModel().getSelected().data.codigo) {
                conservar = false;
                //return conservar;//break;
            } else if (view.tfdenominacion.getValue() != view.gpTipoCtaB.getSelectionModel().getSelected().data.denominacion) {
                conservar = false;
                //return conservar;
            }
            return conservar;
        }

        //muestra msg question eliminar
        this.MsgEliminar = function() {
            view.windowopen = true;
            Ext.Msg.show({
                title: idioma.lbMsgTitleConf,
                buttons: Ext.Msg.OKCANCEL,
                msg: String.fromCharCode(191) + idioma.lbMsgEliminando,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn) {
                    if (btn == 'ok') {
                        controller.EliminarTipoCta();
                    } else {
                        view.windowopen = false;
                    }
                }
            });
        };

        //elimina el tipo cta bancaria seleccionado
        this.EliminarTipoCta = function() {
            controller.progressBar(idioma.lbMsgtitleEliminando);
            Ext.Ajax.request({
                url: 'eliminartipocuenta',
                method: 'POST',
                params: {
                    idtipocuenta: view.gpTipoCtaB.getSelectionModel().getSelected().data.idtipocuenta
                },
                callback: function(options, success, response) {
                    Ext.MessageBox.hide();
                    view.gpTipoCtaB.getSelectionModel().clearSelections();
                    if (!response.responseText) {
                        mostrarMensaje(3, idioma.lbMsgErrorInterno);
                    } else {
                        responseData = Ext.decode(response.responseText);
                        switch (responseData.n_codMsg)
                        {
                            case 1:
                                view.windowopen = false;
                                model.stTipoCtaB.reload();
                                view.gpTipoCtaB.getSelectionModel().selectFirstRow();
                                mostrarMensaje(1, idioma.lbMsgExistoElim);
                                break;
                            case 2: // El tipo de cuenta bancaria esta en uso lbMsgElimTipoenUso
                                view.windowopen = false;
                                mostrarMensaje(1, idioma.lbMsgElimTipoenUso);
                                view.gpTipoCtaB.getSelectionModel().selectFirstRow();
                                break;
                            default:
                                view.windowopen = false;
                                mostrarMensaje(responseData.n_codMsg, responseData.mensaje);
                                view.gpTipoCtaB.getSelectionModel().selectFirstRow();
                                break;
                        }
                    }
                }
            });
        };

        this.mostrarHeredar = function() {
//            view.winHeredar.show();
//            view.winHeredar.center();
            controller.MostrarMensaje(idioma.lbTextCargandoTipoCB);
            model.stHeredar.load({
                callback: function() {
                    loadMask.hide();
                }
            });
        };

        this.heredarTCB = function(selecciones, v) {
            tipocuentas = new Array();
            //se recorre el array seleccionados para obtener los *************
            for (var i = 0; i < selecciones.length; i++)
                tipocuentas.push({
                    'denominacion': selecciones[i].data.denominacion,
                    'codigo': selecciones[i].data.codigo
                });

            if (tipocuentas.length > 1) {
                controller.progressBar(idioma.lbMsgHeredarMasTipos);//barra de progreso
            } else {
                controller.progressBar(idioma.lbMsgHeredarUNTipo);//barra de progreso
            }

            Ext.Ajax.request({
                url: 'heredartipocuenta',
                method: 'POST',
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.valor == 1) {//si se adiciono correctamente
                        if (tipocuentas.length == 1) {
                            Ext.MessageBox.hide();//oculta la barra de progreso
                            mostrarMensaje(1, idioma.lbMsgExistoHeredarUno);
                        } else {
                            Ext.MessageBox.hide();//oculta la barra de progreso
                            mostrarMensaje(1, idioma.lbMsgExistoHeredarMas);
                        }
                        model.stTipoCtaB.reload();

                        // mostrarMensaje(1,'La herencia se realiz&oacute;  satisfactoriamente.');
                        if (v == 'acep') {
                            view.winHeredar.hide();// verificar si  conviene hide o  close
                        }
                        else {
                            model.stHeredar.reload();
                        }

                    }
                    else {//si no se adiciono correctamente
                        //Ext.MessageBox.hide();//oculta la barra de progreso
                        if (responseData.valor == -1) {
                            if (tipocuentas.length == 1) {
                                Ext.MessageBox.hide();//oculta la barra de progreso
                                mostrarMensaje(1, idioma.lbMsgExistCodHeredarUno/* + '<b>' + responseData.campo + '</b>' + '. '*/);
                            } else {
                                Ext.MessageBox.hide();//oculta la barra de progreso
                                mostrarMensaje(1, idioma.lbMsgExistCodHeredarMas/* + '<b>' + responseData.campo + '</b>' + '. '*/);
                            }
                        } else {
                            if (tipocuentas.length == 1) {
                                Ext.MessageBox.hide();//oculta la barra de progreso
                                mostrarMensaje(1, idioma.lbMsgExistDenHeredarUno/* + '<b>' + responseData.campo + '</b>' + '. '*/);
                            } else {
                                Ext.MessageBox.hide();//oculta la barra de progreso
                                mostrarMensaje(1, idioma.lbMsgExistDenHeredarMas/* + '<b>' + responseData.campo + '</b>' + '. '*/);
                            }
                        }
                    }
                },
                params: {
                    arraytipocuenta: Ext.encode(tipocuentas)
                }
            });
        };//fin de la funcion heredarCF()

        //teclas de acceso rapido    
        //adicionar tipo de Cta bancaria
        view.globalKeyMap.accessKey({
            key: 'i',
            alt: true
        }, function() {
            if (!view.windowopen) {
                controller.gestionarTipoCtaB('add');
            }
        }, Ext.getBody());

        //modificar tipo de Cta bancaria
        view.globalKeyMap.accessKey({
            key: 'm',
            alt: true
        }, function() {
            if (!view.windowopen && !view.btnModificar.disabled) {
                controller.gestionarTipoCtaB('mod');
            }
        }, Ext.getBody());

        //eliminar tipo de Cta bancaria
        view.globalKeyMap.accessKey({
            key: Ext.EventObject.DELETE
        }, function() {
            if (!view.windowopen && !view.btnEliminar.disabled) {
                if (view.gpTipoCtaB.getSelectionModel().getSelected()) {
                    controller.MsgEliminar();
                }
            }
        }, Ext.getBody());


        //heredar tipo de Cta bancaria
        view.globalKeyMap.accessKey({
            key: 'h',
            alt: true,
            ctrl: true
        }, function() {
            if (!view.windowopen) {
                //if (view.gpTipoCtaB.getSelectionModel().getSelected()) {
                controller.mostrarHeredar();
                //}
            }
        }, Ext.getBody());

        //ayuda tipo de Cta bancaria
        view.globalKeyMap.accessKey({
            key: 'h',
            alt: true
        }, function() {
            if (Ext.EventObject.ctrlKey == 0)
                help.show(idioma.lbTitleAyuda, 'confin/banco/configuracion/tipocta');
        }, Ext.getBody());

        this.progressBar = function(msg) {
            Ext.MessageBox.show({
                title: idioma.lbMsgEspere,
                msg: msg,
                width: 300,
                progress: true,
                closable: false
            });
            var f = function(v) {
                return function() {
                    var i = v / 11;
                    Ext.MessageBox.updateProgress(i/*, Math.round(100*i)+'% completado'*/);
                };
            };
            for (var i = 1; i < 12; i++) {
                setTimeout(f(i), i * 500);
            }
        };//fn de la funcion progressBar

        this.limpiarEspacios = function(s) {
            s = s.replace(/\s+/gi, ' '); //sacar espacios repetidos dejando solo uno
            s = s.replace(/^\s+|\s+$/gi, ''); //sacar espacios blanco principio y final
            return s;
        };

        //muestra la mascara segun el msg 
        this.MostrarMensaje = function(mensaje) {
            loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };

        //Limpiar formulario
        this.limpiarForm = function() {
            var objLoadForm = {
                tfcodigo: '',
                tfdenominacion: ''
            };
            view.fpTipoCtaB.getForm().setValues(objLoadForm);
        };

    }
}; 