Ext.ns('Costo.Procesos.Nomencladores.GestAct');
Costo.Procesos.Nomencladores.GestAct.Controller = {
    init: function(etiquetas, view, model) {
        var scope = this;

        // /********* EVENTOS *********/

        /*****CONFIGURACION DE LOS EVENTOS*****/
        view.btnAdicionar.setHandler(function() {
            EventosAdicionar();
        });

        view.btnModificar.setHandler(function() {
            EventosModificar();
        });

        view.btnEliminar.setHandler(function() {
            EventosEliminar();
        });

        view.btnHeredar.setHandler(function() {
            EventosHeredar();
        });

        view.btnVistaPrevia.setHandler(function() {
            scope.fObtenerDatosImprimirReporte();
        });


        model.stactividades.on({
            beforeload: function() {
                view.crearMapadeTeclas();
            },
            load: function(store, records, options) {
                Ext.MessageBox.hide();
                if (records.length == 0) {
                    // var message = (view.searchaAsoc.getValue()) ? etiquetas.msgNoElementSearch : etiquetas.msgNoElements;
                    var message = etiquetas.msgNoElements;
                    mostrarMensaje(1, message);

                    view.btnModificar.setDisabled(true);
                    view.btnEliminar.setDisabled(true);
                }

                if (model.stTipo.getCount() == 0) {
                    model.stTipo.load();
                }

                if (Ext.isEmpty(view.smActividad.getSelected())) {
                    view.smActividad.selectFirstRow();
                }

                view.btnAdicionar.focus();
            }
        });

        view.smActividad.on({
            rowdeselect: function(selectionModel, rowIndex, record) {
                view.grid.getView().removeRowClass(rowIndex, "negrita");
                view.grid.getView().addRowClass(rowIndex, "negrita");
                if (selectionModel.selections.length > 0) {
                    view.btnEliminar.enable();
                    if (selectionModel.selections.length > 1) {
                        view.btnModificar.disable();
                    } else {
                        view.btnModificar.enable();
                    }
                } else {
                    view.btnEliminar.disable();
                    view.btnModificar.disable();
                }
            },
            rowselect: function(selectionModel, rowIndex, record) {
                view.grid.getView().addRowClass(rowIndex, "negrita");
                if (selectionModel.selections.length > 0) {
                    view.btnEliminar.enable();
                    if (selectionModel.selections.length > 1) {
                        view.btnModificar.disable();
                    } else {
                        view.btnModificar.enable();
                    }
                } else {
                    view.btnEliminar.disable();
                    view.btnModificar.disable();
                }
            }
        });

        function EventosAdicionar() {
            view.CrearWindw(true, model, etiquetas);
            
            view.startTaskValidation(view.panelGest.getForm(), 'add', [view.btnAplicar, view.btnAceptar]);
            
            view.ventana.show();

            view.btnAplicar.setVisible(true);

            /***** EVENTOS ******/
            view.btnCancelar.on('click', function() {
                view.ventana.close();
            });
            view.btnAplicar.on('click', function() {
                scope.adicionarNomenclador(true, false);
            });
            view.btnAceptar.on('click', function() {
                if (view.btnAplicar.isVisible())
                    scope.adicionarNomenclador(false, false);
                else
                    scope.adicionarNomenclador(false, false);
            });

            //model.stTipo.load();

            view.tfCodigo.on({
                keypress: function(field, event) {
                    if (event.getKey() === event.ENTER && !Ext.isEmpty(view.cbTipo.getValue()) && !Ext.isEmpty(view.txaDescripcion.getValue())
                            && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid())
                        scope.adicionarNomenclador(false, false);
                },
                keyup: function(field, event) {
                    if (event.getKey() === event.BACKSPACE && field.getValue().length < 1 || Ext.isEmpty(view.txaDescripcion.getValue())
                            || Ext.isEmpty(view.cbTipo.getValue()) || Ext.isEmpty(field.getValue()) || !view.panelGest.getForm().isValid()) {
                        view.btnAceptar.disable();
                        view.btnAplicar.disable();
                    } else {
                        view.btnAceptar.enable();
                        view.btnAplicar.enable();
                    }
                }
            });
            view.txaDescripcion.on({
                keypress: function(field, event) {
                    if (event.getKey() === event.ENTER && !Ext.isEmpty(view.cbTipo.getValue()) && !Ext.isEmpty(view.tfCodigo.getValue())
                            && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid())
                        scope.adicionarNomenclador(false, false);
                },
                keyup: function(field, event) {
                    if (event.getKey() === event.BACKSPACE && field.getValue().length < 1 || Ext.isEmpty(view.tfCodigo.getValue())
                            || Ext.isEmpty(view.cbTipo.getValue()) || Ext.isEmpty(field.getValue()) || !view.panelGest.getForm().isValid()) {
                        view.btnAceptar.disable();
                        view.btnAplicar.disable();
                    } else {
                        view.btnAceptar.enable();
                        view.btnAplicar.enable();
                    }
                }
            });

            view.cbTipo.on({
                keypress: function(field, event) {
                    if (event.getKey() === event.ENTER && !Ext.isEmpty(view.tfCodigo.getValue()) && !Ext.isEmpty(view.txaDescripcion.getValue())
                            && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid())
                        scope.adicionarNomenclador(false, false);
                },
                select: function(combo, record, index) {
                    if (!Ext.isEmpty(view.txaDescripcion.getValue()) && !Ext.isEmpty(view.tfCodigo.getValue())) {
                        view.btnAceptar.enable();
                        view.btnAplicar.enable();
                    } else {
                        view.btnAceptar.disable();
                        view.btnAplicar.disable();
                    }
                }
            });
        }

        this.adicionarNomenclador = function(isApplaying, isModify) {
            if (scope.validaFormulario()) {
                scope.loadMessageBox(etiquetas.msgAddWaitAct);
                Ext.Ajax.request({
                    url: view.url + 'insertarActividad',
                    method: 'POST',
                    scope: this,
                    params: {
                        idactividad: (isModify) ? isModify : '-1',
                        codigo: view.tfCodigo.getValue(),
                        descripcion: view.txaDescripcion.getValue(),
                        tipo: view.cbTipo.getValue()

                    },
                    callback: function(options, success, response) {
                        Ext.MessageBox.hide();
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code) {
                            case 1:
                                var msg = (isModify) ? etiquetas.msgModSuccessAct : etiquetas.msgAddSuccessAct;
                                mostrarMensaje(1, msg);
                                if (isApplaying) {
                                    scope.resetFormAdd();
                                } else {
                                    view.ventana.close();
                                }
                                model.stactividades.reload();
                                break;
                            case 2:
                                mostrarMensaje(1, etiquetas.msgFailedAddBDAct);
                                break;
                            case 3:
                                mostrarMensaje(1, etiquetas.msgExistCodAct);
                                break;
                            case 4:
                                mostrarMensaje(1, etiquetas.msgExistDescAct);
                                break;
                            default:
                                mostrarMensaje(1, etiquetas.msgDefaultError);
                                break;
                        }
                    }
                });
            } else {
                mostrarMensaje(1, etiquetas.msgDataInvalid);
                view.btnAplicar.enable();
            }
        };

        function EventosModificar() {
            if (view.smActividad.getSelections()) {
                var datos = view.smActividad.getSelections();
                var id = datos[0].data.idtipoactividad;
                scope.MostrarMascara(etiquetas.msgLoading, 'all');
                Ext.Ajax.request({
                    url: view.url + 'obternerDatosAct',
                    method: 'POST',
                    params: {
                        id: id
                    },
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.success) {
                            loadMask.hide();
                            view.CrearWindw(true, model, etiquetas);
                            view.ventana.setTitle(etiquetas.titleModificarAct);
                            view.ventana.show();

                            view.btnAplicar.setVisible(false);

                            //***** EVENTOS *******//
                            view.btnCancelar.on('click', function() {
                                view.ventana.close();
                            });
                            //accion de btn aceptar Gestionar Nomenclador
                            view.btnAceptar.on('click', function() {
                                if (view.btnAplicar.isVisible())
                                    scope.adicionarNomenclador(false, id);
                                else
                                    scope.adicionarNomenclador(false, id);
                            });
                            //model.stTipo.load();

                            view.tfCodigo.on({
                                keypress: function(field, event) {
                                    if (event.getKey() === event.ENTER && !view.btnAceptar.disabled) {
                                        scope.adicionarNomenclador(false, false);
                                    }
                                },
                                keyup: function(field, event) {
                                    if (event.getKey() === event.BACKSPACE && field.getValue().length < 1 || Ext.isEmpty(view.txaDescripcion.getValue())
                                            || Ext.isEmpty(view.cbTipo.getValue()) || Ext.isEmpty(field.getValue()) || !view.panelGest.getForm().isValid()) {
                                        view.btnAceptar.disable();
                                        view.btnAplicar.disable();
                                    } else {
                                        view.btnAceptar.enable();
                                        view.btnAplicar.enable();
                                    }
                                }
                            });
                            view.txaDescripcion.on({
                                keypress: function(field, event) {
                                    if (event.getKey() === event.ENTER && !view.btnAceptar.disabled) {
                                        scope.adicionarNomenclador(false, false);
                                    }
                                },
                                keyup: function(field, event) {
                                    if (event.getKey() === event.BACKSPACE && field.getValue().length < 1 || Ext.isEmpty(view.tfCodigo.getValue())
                                            || Ext.isEmpty(view.cbTipo.getValue()) || Ext.isEmpty(field.getValue()) || !view.panelGest.getForm().isValid()) {
                                        view.btnAceptar.disable();
                                        view.btnAplicar.disable();
                                    } else {
                                        view.btnAceptar.enable();
                                        view.btnAplicar.enable();
                                    }
                                }
                            });

                            view.cbTipo.on({
                                keypress: function(field, event) {
                                    if (event.getKey() === event.ENTER && !view.btnAceptar.disabled) {
                                        scope.adicionarNomenclador(false, false);
                                    }
                                },
                                select: function(combo, record, index) {
                                    view.btnAceptar.setDisabled(!Ext.isEmpty(view.txaDescripcion.getValue()) && !Ext.isEmpty(view.tfCodigo.getValue()) && view.panelGest.getForm().isValid());
                                    view.btnAplicar.setDisabled(!Ext.isEmpty(view.txaDescripcion.getValue()) && !Ext.isEmpty(view.tfCodigo.getValue()) && view.panelGest.getForm().isValid());
                                }
                            });
                            
                            var objloadform = {
                                tfCodigo: responseData.data.codigo,
                                txaDescripcion: responseData.data.descripcion,
                                idTipo: responseData.data.idtipo
                            };
                            
                            view.panelGest.getForm().setValues(objloadform);
                            view.startTaskValidation(view.panelGest.getForm(), 'mod', [view.btnAceptar]);
                        }
                    }
                });
            } else {
                mostrarMensaje(1, etiquetas.msgSelectAlmostOneAct);
            }

        }

        /*   var array = Ext.ComponentMgr.get('eog').fGetSelections();
         var tipoM = etiquetas.lbObjeto;
         if (array.length > 1) { // si exite mas de un centro seleccionado
         var plural = etiquetas.lbObjetos;
         mostrarMensaje(1, etiquetas.msgOnlyOneSelectedAccion.replace('<tipo>', tipoM).replace('<tipos>', plural).replace('<cantidad>', array.length));
         } else {
         if (array.length > 0) {
         var arrayIds = [];
         
         Ext.each(array, function (item, index, allItems) {
         arrayIds.push(item.attributes.id);
         }, this);
         
         var idToModify = arrayIds[arrayIds.length - 1]; // Si exite mas de un elemento seleccionado elejimos el ultimo
         scope.MostrarMascara(etiquetas.msgLoading, 'all');
         Ext.Ajax.request({
         url: view.url + 'obternerDatosEOG',
         method: 'POST',
         params: {
         id: idToModify
         },
         callback: function (options, success, response) {
         var responseData = Ext.decode(response.responseText);
         if (responseData.success) {
         var titulo = etiquetas.lbObjeto;
         view.CrearWindw(false, model, etiquetas, titulo.toLowerCase());
         
         Ext.getCmp('directivo').on({
         check: function (checkbox, checked) {
         if (view.panelGest.getForm().isValid())
         view.btnAceptar.enable();
         else
         view.btnAceptar.disable();
         }
         });
         //evento para el ENTER
         view.cbFormato.on({
         keypress: function (field, event) {
         if (event.getKey() === event.ENTER && !Ext.isEmpty(view.tfCodigo.getValue()) && !Ext.isEmpty(view.txaDescripcion.getValue())
         && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid())
         scope.adicionarNomenclador(false);
         },
         select: function (combo, record, index) {
         var length = scope.getFormatPart(record.json.formato, record.json.separador, parseInt(array[0].attributes.nivel) - 1);
         view.tfCodigo.maxLength = length;
         view.tfCodigo.maxLengthText = etiquetas.msgMaxLengthDefault.replace('<numero>', length);
         view.tfCodigo.regexText = etiquetas.regexText.replace('<#>', length);
         }
         });
         view.cbEstado.on({
         keypress: function (field, event) {
         if (event.getKey() === event.ENTER && !Ext.isEmpty(view.tfCodigo.getValue()) && !Ext.isEmpty(view.txaDescripcion.getValue())
         && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid())
         scope.adicionarNomenclador(false, idToModify);
         },
         select: function (combo, record, index) {
         view.btnAceptar.setDisabled(Ext.isEmpty(view.txaDescripcion.getValue()) && Ext.isEmpty(view.tfCodigo.getValue()) && !view.panelGest.getForm().isValid());
         }
         });
         view.tfCodigo.on({
         keypress: function (field, event) {
         if (event.getKey() === event.ENTER && !Ext.isEmpty(view.cbFormato.getValue()) && !Ext.isEmpty(view.txaDescripcion.getValue())
         && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid())
         scope.adicionarNomenclador(false, idToModify);
         },
         keyup: function (field, event) {
         if (event.getKey() === event.BACKSPACE && field.getValue().length < 1 || Ext.isEmpty(view.txaDescripcion.getValue())
         || Ext.isEmpty(view.cbFormato.getValue()) || Ext.isEmpty(field.getValue()) || !view.panelGest.getForm().isValid()) {
         view.btnAceptar.disable();
         view.btnAplicar.disable();
         } else {
         view.btnAceptar.enable();
         view.btnAplicar.enable();
         }
         }
         });
         view.txaDescripcion.on({
         keypress: function (field, event) {
         if (event.getKey() === event.ENTER && !Ext.isEmpty(view.cbFormato.getValue()) && !Ext.isEmpty(view.tfCodigo.getValue())
         && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid())
         scope.adicionarNomenclador(false, idToModify);
         },
         keyup: function (field, event) {
         if (event.getKey() === event.BACKSPACE && field.getValue().length < 1 || Ext.isEmpty(view.tfCodigo.getValue())
         || Ext.isEmpty(view.cbFormato.getValue()) || Ext.isEmpty(field.getValue()) || !view.panelGest.getForm().isValid()) {
         view.btnAceptar.disable();
         view.btnAplicar.disable();
         } else {
         view.btnAceptar.enable();
         view.btnAplicar.enable();
         }
         }
         });
         model.stFormato.load({
         callback: function (records, options, success) {
         var length = scope.getFormatPart(records[0].json.formato, records[0].json.separador, parseInt(array[0].attributes.nivel) - 1);
         view.tfCodigo.maxLength = length;
         view.tfCodigo.maxLengthText = etiquetas.msgMaxLengthDefault.replace('<numero>', length);
         view.tfCodigo.regexText = etiquetas.regexText.replace('<#>', length);
         view.cbFormato.setValue(responseData.data.formato);
         view.ventana.show();
         }
         });
         model.stEstado.load({
         callback: function () {
         loadMask.hide();
         //***** MANIPULANDO LOS COMPONENTES DE LA VENTANA *****
         view.idEOG.setValue(responseData.data.idelementoobjeto);
         view.tfCodigo.setValue(responseData.data.codigo);
         view.cbEstado.setValue(responseData.data.estado);
         view.txaDescripcion.setValue(responseData.data.descripcion);
         Ext.getCmp('directivo').setValue(responseData.data.directivo);
         
         //view.tfCodigo.focus(true,100);
         }
         });
         } else {
         mostrarMensaje(1, etiquetas.msgDefaultError);
         }
         }
         });
         
         } else {
         mostrarMensaje(1, etiquetas.msgSelectAlmostOne.replace('<tipo>', tipoM));
         }
         }
         }*/

        function EventosEliminar() {
            if (view.smActividad.getSelections()) {
                view.keys.disable();

                var selections = view.smActividad.getSelections();
                var messageConfirm = selections.length > 1 ? etiquetas.msgConfirmDeletePluralAct : etiquetas.msgConfirmDeleteAct;

                mostrarMensaje(2, messageConfirm, function(btnPress) {
                    if (btnPress === 'ok') {
                        var arrayIds = [];
                        Ext.each(selections, function(item, index, allItems) {
                            arrayIds.push(item.data.idtipoactividad);
                        }, this);
                        scope.eliminarNomenclador(arrayIds);
                    }

                    view.keys.enable();
                    view.btnAdicionar.focus();
                });
            } else {
                mostrarMensaje(1, etiquetas.msgSelectAlmostOneActDel);
            }
        }

        this.eliminarNomenclador = function(arrayIds) {
            var message = arrayIds.length > 1 ? etiquetas.msgDelWaitPluralAct : etiquetas.msgDelWaitAct;
            scope.loadMessageBox(message);
            Ext.Ajax.request({
                url: view.url + 'eliminarActividad',
                method: 'POST',
                params: {
                    ids: Ext.encode(arrayIds)
                },
                callback: function(options, success, response) {
                    Ext.MessageBox.hide();
                    if (!response.responseText)
                        mostrarMensaje(1, etiquetas.msgDefaultError);
                    else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code) {
                            case 1:
                                if (arrayIds.length > 1) {
                                    var mensaje = etiquetas.msgPluralDelAct;
                                } else {
                                    var mensaje = etiquetas.msgDelAct;
                                }
                                mostrarMensaje(1, mensaje);
                                model.stactividades.reload();
                                break;
                            case 2:
                                var array = [];
                                for (var i = 0; i < responseData.errors.length; i++) {
                                    array.push(responseData.errors[i].codigo + " " + responseData.errors[i].elemento)
                                }
                                if (responseData.errors.length > 1) {
                                    var tipos = (view.type == 1) ? etiquetas.lbElementos : etiquetas.lbObjetos;
                                    var mensaje = etiquetas.msgFailedDelBDPlural.replace('<tipo>', tipos.toLowerCase());
                                } else {
                                    var mensaje = etiquetas.msgFailedDelBD.replace('<tipo>', tipo.toLowerCase());
                                }
                                mostrarMensaje(1, mensaje.replace('<objeto>', array.join(',')), function() {
                                });
                                break;
                            case 3:
                                var array = [];
                                for (var i = 0; i < responseData.errors.length; i++) {
                                    array.push(responseData.errors[i].codigo + " " + responseData.errors[i].elemento);
                                }
                                if (responseData.errors.length > 1) {
                                    var tipos = (view.type == 1) ? etiquetas.lbElementos : etiquetas.lbObjetos;
                                    var mensaje = (view.type == 1) ? etiquetas.msgFailDelDueToAsocCCPlural.replace('<tipo>', tipos.toLowerCase())
                                            : etiquetas.msgFailDelDueToAsocNAEPlural.replace('<tipo>', tipos.toLowerCase());
                                } else {
                                    var mensaje = (view.type == 1) ? etiquetas.msgFailDelDueToAsocCC.replace('<tipo>', tipo.toLowerCase())
                                            : etiquetas.msgFailDelDueToAsocNAE.replace('<tipo>', tipo.toLowerCase());
                                }
                                Ext.ComponentMgr.get('eog').reload();
                                mostrarMensaje(1, mensaje.replace('<objeto>', array.join(',')), function() {
                                });
                                break;
                            default:
                                mostrarMensaje(1, etiquetas.msgDefaultError);
                                break;
                        }
                    }
                }
            });
        };

        /***********************************************************************************************************************************************************************/


        this.fObtenerDatosImprimirReporte = function() {
            scope.loadMessageBox(etiquetas.msgLoading);
            Ext.Ajax.request({
                url: view.url + 'obtenerDatosImprimirReporte',
                method: 'POST',
                params: {
                    titulo: etiquetas.lbAct
                },
                callback: function(options, success, response) {
                    Ext.MessageBox.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.datoCuerpo.length > 0)
                        fOpenWindowReport(responseData);
                    else
                        mostrarMensaje(1, etiquetas.msgNoDatosReporte);
                }
            });
        };

        function fOpenWindowReport(requestDataSources) {
            var printView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                paperSize: "FOLIO",
                orientation: "Horizontal",
                reportType: "HTML"
            });
            printView.on({
                beforeshow: function(ventana) {
                    view.keys.disable();
                },
                close: function(ventana) {
                    view.keys.enable();
                    view.btnAdicionar.focus();
                },
                hide: function(ventana) {
                    view.keys.enable();
                    view.btnAdicionar.focus();
                }
            });
            printView.show();
        }


        scope.getFormatPart = function(formato, separador, nivel) {
            var partes = formato.split(separador);
            if (Ext.isArray(partes))
                return partes[nivel].length;
            else
                return 8;
        };


        //accion de btn heredar Gestionar Nomenclador
        function EventosHeredar() {
            var titulo = etiquetas.lbObjeto;
            view.CrearWindwHeredar(model, etiquetas, titulo.toLowerCase());
            view.ventana.on({
                beforeshow: function(ventana) {
                    view.keys.disable();
                },
                close: function(ventana) {
                    view.keys.enable();
                    view.btnAdicionar.focus();
                }
            });
            scope.MostrarMascara(etiquetas.msgLoading, 'all');

            view.ventana.show(
                    Ext.getBody(), function() {
                // componente de CentroNivel
                new Ext.Costo.Procesos.Nomencladores.Componentes.CCEOG({
                    id: 'elementoObjeto',
                    loadHelpersFiles: false,
                    typeSelection: 1,
                    extending: 1,
                    types: [2]
                }).on({
                    initialize: function(componentClass, componentUI1) {
                        componentUI1.on({
                            checkchange: function(node, checked) {
                                if (checked) {
                                    view.btnAceptarHeredar.enable();
                                } else {
                                    view.btnAceptarHeredar.setDisabled(componentClass.fGetSelections().length == 0)
                                }
                            }
                        });
                        componentUI1.setHeight(view.panelHeredar.getSize().height);
                        view.panelHeredar.insert(0, componentUI1);
                        view.panelHeredar.doLayout(true);
                    },
                    load: function(cmp, haschilds, rectora) {
                        if (rectora || !haschilds) {
                            view.ventana.close();
                        }
                    }
                });
                loadMask.hide();
                view.ventana.maximize();
            });
            /*load: f(cmp, haschilds, rectora){
             if(rectora || !haschilds){
             
             }
             }*/
            view.btnAceptarHeredar.on('click', function() {
                var array = Ext.ComponentMgr.get('elementoObjeto').fGetSelections();
                if (array.length > 0) {
                    scope.adicionarNomencladorHeredado(array);
                } else {
                    var tipo = etiquetas.lbObjeto;
                    mostrarMensaje(1, etiquetas.msgSelectAlmostOne.replace('<tipo>', tipo));
                }
            });

            view.btnCancelarHeredar.on('click', function() {
                view.ventana.close();
            });
        }

        /*****FIN CONFIGURACION DE LOS EVENTOS*****/

        this.validaFormulario = function() {
            flag = true;
            if (!view.panelGest.getForm().isValid())
                flag = false;
            return flag;
        };


        this.resetFormAdd = function() {
            view.cbTipo.setValue('');
            view.tfCodigo.setValue('');
            view.txaDescripcion.setValue('');
            view.btnAceptar.disable();
            view.btnAplicar.disable();
        };


        this.resetScreen = function() {
            Ext.ComponentMgr.get('lcodigo').setText(etiquetas.lbCodigo, false);
            Ext.ComponentMgr.get('ldescripcion').setText(etiquetas.lbDescripcion, false);
            Ext.ComponentMgr.get('lactivo').setText(etiquetas.lbActivo, false);
            Ext.ComponentMgr.get('ldirectivo').setText(etiquetas.lbDirectivo, false);
            Ext.ComponentMgr.get('detalles').collapse();
            view.btnModificar.disable();
            view.btnEliminar.disable();
        };

        this.objectInArray = function(array, objeto) {
            var inArray = false;
            for (var i = 0; i < array.length; i++) {
                if (array[i].codigo == objeto.codigo) {
                    inArray = true;
                    break;
                }
            }
            return inArray;
        };

        this.adicionarNomencladorHeredado = function(array) {
            var arrayElementosObjetos = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i].parentNode.attributes.id != '0') {
                    var path = array[i].getPath('id');
                    var ancestros = path.split('/');
                    for (var j = 2; j < ancestros.length - 1; j++) {
                        var parentNode = Ext.getCmp('elementoObjeto').tpCCEOG.getNodeById(ancestros[j]);
                        var objectPadre = {
                            ideog: '-1',
                            idheredado: parentNode.attributes.id,
                            idformato: parentNode.attributes.idformato,
                            codigo: parentNode.attributes.codigo,
                            concat: parentNode.attributes.concat,
                            idestado: parentNode.attributes.idestado,
                            descripcion: parentNode.attributes.descripcion,
                            idpadre: (parentNode.attributes.id !== parentNode.attributes.idpadre) ? parentNode.attributes.idpadre : -1,
                            tipo: parentNode.attributes.idtipo,
                            directivo: parentNode.attributes.directivo
                        };
                        if (!scope.objectInArray(arrayElementosObjetos, objectPadre))
                            arrayElementosObjetos.push(objectPadre);
                    }
                }
                var object = {
                    ideog: '-1',
                    idheredado: array[i].attributes.id,
                    idformato: array[i].attributes.idformato,
                    codigo: array[i].attributes.codigo,
                    concat: array[i].attributes.concat,
                    idestado: array[i].attributes.idestado,
                    descripcion: array[i].attributes.descripcion,
                    idpadre: (array[i].attributes.id !== array[i].attributes.idpadre) ? array[i].attributes.idpadre : -1,
                    tipo: array[i].attributes.idtipo,
                    directivo: array[i].attributes.directivo
                };
                arrayElementosObjetos.push(object);
            }
            if (arrayElementosObjetos.length > 1) {
                var tipo = (view.type == 1) ? etiquetas.lbElementos : etiquetas.lbObjetos;
                var message = etiquetas.msgExtWaitPlural.replace('<tipo>', tipo.toLowerCase());
            } else {
                var tipo = (view.type == 1) ? etiquetas.lbElemento : etiquetas.lbObjeto;
                var message = etiquetas.msgExtWait.replace('<tipo>', tipo.toLowerCase());
            }
            scope.MostrarMascara(message, 'all');
            Ext.Ajax.request({
                url: view.url + 'heredarObjetoElementoGasto',
                method: 'POST',
                params: {
                    arraydatos: Ext.encode(arrayElementosObjetos)
                },
                callback: function(options, success, response) {
                    loadMask.hide();
                    if (!response.responseText)
                        mostrarMensaje(1, etiquetas.msgDefaultError);
                    else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code) {
                            case 1:
                                if (arrayElementosObjetos.length > 1) {
                                    var tipo = (view.type == 1) ? etiquetas.lbElementos : etiquetas.lbObjetos;
                                    var message = etiquetas.msgEntendSuccessPlural.replace('<tipo>', tipo.toLowerCase());
                                } else {
                                    var tipo = (view.type == 1) ? etiquetas.lbElemento : etiquetas.lbObjeto;
                                    var message = etiquetas.msgEntendSuccess.replace('<tipo>', tipo.toLowerCase());
                                }
                                mostrarMensaje(1, message, function() {
                                    Ext.ComponentMgr.get('eog').reload();
                                    view.ventana.close();
                                });
                                break;
                            case 2:
                                var array = [];
                                for (var i = 0; i < responseData.errors.length; i++) {
                                    array.push(responseData.errors[i].codigo + " " + responseData.errors[i].centro)
                                }
                                if (responseData.errors.length > 1) {
                                    var tipo = (view.type == 1) ? etiquetas.lbElementos : etiquetas.lbObjetos;
                                    var message = etiquetas.msgFailedExtBDPlural.replace('<tipo>', tipo.toLowerCase());
                                } else {
                                    var tipo = (view.type == 1) ? etiquetas.lbElemento : etiquetas.lbObjeto;
                                    var message = etiquetas.msgFailedExtBD.replace('<tipo>', tipo.toLowerCase());
                                }
                                mostrarMensaje(1, message.replace('<objeto>', array.join(',')), function() {
                                });
                                break;
                            case 3:
                                var array = [];
                                for (var i = 0; i < responseData.errors.length; i++) {
                                    array.push(responseData.errors[i].codigo + " " + responseData.errors[i].centro)
                                }
                                if (responseData.errors.length > 1) {
                                    var tipo = (view.type == 1) ? etiquetas.lbElementos : etiquetas.lbObjetos;
                                } else {
                                    var tipo = (view.type == 1) ? etiquetas.lbElemento : etiquetas.lbObjeto;
                                }
                                // si no todos fueron heredados
                                if (responseData.errors.length < arrayElementosObjetos.length) {
                                    scope.mensajePersonalizado({
                                        title: etiquetas.titleInfo,
                                        buttons: Ext.Msg.OK,
                                        msg: etiquetas.msgEntendParcialSuccess.replace('<tipo>', tipo.toLowerCase()),
                                        icon: Ext.Msg.INFO,
                                        fn: function() {
                                            if (responseData.errors.length > 1) {
                                                var type = (view.type == 1) ? etiquetas.lbElemento : etiquetas.lbObjeto;
                                                var message = etiquetas.msgAlreadyExitsEntityExtPlural.replace('<tipo>', type.toLowerCase());
                                            } else {
                                                var type = (view.type == 1) ? etiquetas.lbElementos : etiquetas.lbObjetos;
                                                var message = etiquetas.msgAlreadyExitsEntityExt.replace('<tipo>', type.toLowerCase());
                                            }
                                            if (responseData.errors.length >= 1) {
                                                message += " " + "<i>" + responseData.errors[0].centro + "</i>"
                                                if (responseData.errors.length > 1) {
                                                    for (var i = 1; i < responseData.errors.length; i++)
                                                        message += ", <i>" + responseData.errors[i].centro + "</i>"
                                                }
                                                message += ".";
                                            }
                                            scope.mensajePersonalizado({
                                                title: etiquetas.titleInfo,
                                                buttons: Ext.Msg.OK,
                                                msg: "<ul>" + message + "</ul>",
                                                icon: Ext.Msg.INFO,
                                                fn: function() {
                                                    view.ventana.close();
                                                    Ext.ComponentMgr.get('eog').reload();
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    if (responseData.errors.length > 1) {
                                        var type = (view.type == 1) ? etiquetas.lbElementos : etiquetas.lbObjetos;
                                        var msg = etiquetas.msgAlreadyExitsEntityExtPlural1.replace('<tipo>', type.toLowerCase());
                                    } else {
                                        var type = (view.type == 1) ? etiquetas.lbElemento : etiquetas.lbObjeto;
                                        var msg = etiquetas.msgAlreadyExitsEntityExt1.replace('<tipo>', type.toLowerCase());
                                    }
                                    mostrarMensaje(1, msg, function() {
                                    });
                                }
                                break;
                            default:
                                mostrarMensaje(1, etiquetas.msgDefaultError);
                                break;
                        }
                    }
                }
            });
        };

        this.MostrarMascara = function(mensaje, scope) {
            loadMask = (scope == 'view') ? new Ext.LoadMask(view.body, {
                msg: mensaje
            }) : new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };
        this.mensajePersonalizado = function(options) {
            Ext.Msg.show({
                title: options.title,
                buttons: options.buttons,
                msg: options.msg,
                icon: options.icon,
                fn: options.fn
            });
        };
        this.loadMessageBox = function(msg) {
            Ext.MessageBox.show({
                title: etiquetas.lbMsgEspere,
                msg: msg,
                width: 300,
                progress: true,
                closable: false
            });
            var f = function(v) {
                return function() {
                    var i = v / 11;
                    Ext.MessageBox.updateProgress(i);
                };
            };
            for (var i = 1; i < 12; i++)
                setTimeout(f(i), i * 500);
        };
    }
};