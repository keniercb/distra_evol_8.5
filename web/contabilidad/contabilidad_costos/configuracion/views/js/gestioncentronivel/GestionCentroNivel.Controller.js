Ext.ns('Costo.Procesos.Nomencladores.GestCCNAE');
Costo.Procesos.Nomencladores.GestCCNAE.Controller = {
    init: function(etiquetas, view, model) {
        var scope = this;

        /*****CONFIGURACION DE LOS EVENTOS*****/
        view.btnAdicionar.setHandler(function() {
            EventosAdicionar();
        });

        view.btnModificar.setHandler(function() {
            EventosModificar();
        });

        view.btnEliminar.setHandler(function() {
            view.keys.disable();
            EventosEliminar();
        });

        view.btnHeredar.setHandler(function() {
            EventosHeredar();
        });
        view.btnImportar.on('click', function() {
            fConfigurarImportar();
        });

        view.btnVistaPrevia.setHandler(function() {
            scope.fObtenerDatosImprimirReporte();
        });
        function fConfigurarImportar () {
            var self = this;
            //self.map.disable();
            this.winImportCmp = new SCFPrintData(new Object(), "/contabilidad/comun/SCFPrintView/", {
                reportType: "DISTRA_CENTROS",
                typeAction: 'import'
            });
            this.winImportCmp.show();
            this.winImportCmp.doLayout();
            this.winImportCmp.on({
                'show': function() {
                    self.map.disable();
                },
                'close': function() {
                    //self.map.enable();
                   // this.stRegistroComprobantes.load();
                }
            });
        }
        this.fObtenerDatosImprimirReporte = function() {
            scope.loadMessageBox(etiquetas.msgLoading);
            Ext.Ajax.request({
                url: view.url + 'obtenerDatosImprimirReporte',
                method: 'POST',
                params: {
                    tipo: view.type,
                    titulo: (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes
                },
                callback: function(options, success, response) {
                    Ext.MessageBox.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.datoCuerpo.length > 0)
                        fOpenWindowReport(responseData);
                    else
                        mostrarMensaje(1, etiquetas.msgNoDatosReporte, function() {
                        });
                }
            });
        };

        function fOpenWindowReport(requestDataSources) {
            printView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
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

        function EventosAdicionar() {
            var array = Ext.ComponentMgr.get('ccnae').fGetSelections();
            if (array.length > 1) { // si exite mas de un centro seleccionado
                var tipo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
                var plural = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                mostrarMensaje(1, etiquetas.msgOnlyOneSelected.replace('<tipo>', tipo).replace('<tipos>', plural).replace('<cantidad>', array.length), function() {
                });
            } else {
                var titulo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
                var idpadre = (array.length == 0) ? '-1' : array[0].attributes.id
                view.CrearWindw(true, model, etiquetas, titulo.toLowerCase(), view.type);
                view.ventana.on({
                    beforeshow: function(ventana) {
                        view.keys.disable();
                    },
                    close: function(ventana) {
                        view.keys.enable();
                        view.btnAdicionar.focus();
                    }
                });
                view.btnAplicar.setVisible(true);

                /***** EVENTOS ******/
                view.btnCancelar.on('click', function() {
                    view.ventana.close();
                });
                view.btnAplicar.on('click', function() {
                    scope.adicionarNomenclador(true, idpadre);
                    // view.btnAplicar.disable();
                });
                view.btnAceptar.on('click', function() {
                    if (view.btnAplicar.isVisible())
                        scope.adicionarNomenclador(false, idpadre);
                    else
                        scope.adicionarNomenclador(false, idpadre);
                });
                //evento para el ENTER
                view.cbFormato.on({
                    keypress: function(field, event) {
                        if (event.getKey() === event.ENTER && !Ext.isEmpty(view.tfCodigo.getValue()) && !Ext.isEmpty(view.txaDescripcion.getValue())
                                && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid())
                            scope.adicionarNomenclador(false, idpadre);
                    },
                    select: function(combo, record, index) {
                        var length = (array.length == 0) ? scope.getFormatPart(record.json.formato, record.json.separador, 0) :
                                scope.getFormatPart(record.json.formato, record.json.separador, parseInt(array[0].attributes.nivel) - 1);
                        view.tfCodigo.maxLength = length;
                        view.tfCodigo.maxLengthText = etiquetas.msgMaxLengthDefaultCaract.replace('<numero>', length);
                        view.tfCodigo.regexText = etiquetas.regexTextCod;
                    }
                });
                view.tfCodigo.on({
                    keypress: function(field, event) {
                        if (event.getKey() === event.ENTER && !Ext.isEmpty(view.cbFormato.getValue()) && !Ext.isEmpty(view.txaDescripcion.getValue())
                                && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid())
                            scope.adicionarNomenclador(false, idpadre);
                    },
                    keyup: function(field, event) {
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
                    keypress: function(field, event) {
                        if (event.getKey() === event.ENTER && !Ext.isEmpty(view.cbFormato.getValue()) && !Ext.isEmpty(view.tfCodigo.getValue())
                                && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid()) {
                            scope.adicionarNomenclador(false, idpadre);
                        }
                    },
                    keyup: function(field, event) {
                        if (field.getValue().length == 1) {
                            var vtext = field.getValue().trim();
                            field.setValue(vtext);
                        }
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
                scope.MostrarMascara(etiquetas.msgLoading, 'all');
                model.stFormato.load({
                    params: {
                        tipo: view.type
                    },
                    callback: function(records, options, success) {
                        loadMask.hide();
                        if (records.length == 1) {
                            view.cbFormato.setValue(records[0].data.idformato);
                            var length = (array.length == 1) ? scope.getFormatPart(records[0].json.formato, records[0].json.separador, parseInt(array[0].attributes.nivel))
                                    : scope.getFormatPart(records[0].json.formato, records[0].json.separador, 0);
                            view.tfCodigo.maxLength = length;
                            view.tfCodigo.maxLengthText = etiquetas.msgMaxLengthDefaultCaract.replace('<numero>', length);
                            view.tfCodigo.regexText = etiquetas.regexTextCod;
                            view.tfCodigo.focus(true, 100);
                        }
                        view.ventana.show();
                    }
                });
            }
        }

        scope.getFormatPart = function(formato, separador, nivel) {
            var partes = formato.split(separador);
            if (Ext.isArray(partes))
                return partes[nivel].length;
            else
                return 8;
        };

        function EventosModificar() {
            var array = Ext.ComponentMgr.get('ccnae').fGetSelections();
            var tipo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
            if (array.length != 0) {
                if (array.length > 1) {
                    mostrarMensaje(1, etiquetas.msgOnlyOneSelectedAccion);
                } else {
                    var arrayIds = [];
                    Ext.each(array, function(item, index, allItems) {
                        arrayIds.push(item.attributes.id);
                    }, this);
                    var idToModify = arrayIds[arrayIds.length - 1]; // Si exite mas de un elemento seleccionado elejimos el ultimo
                    scope.MostrarMascara(etiquetas.msgLoading, 'all');
                    Ext.Ajax.request({
                        url: view.url + 'obternerDatosCCNAE',
                        method: 'POST',
                        params: {
                            id: idToModify,
                            tipo: view.type
                        },
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.success) {
                                var titulo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
                                view.CrearWindw(false, model, etiquetas, titulo.toLowerCase(), view.type);
                                view.ventana.on({
                                    beforeshow: function(ventana) {
                                        view.keys.disable();
                                    },
                                    close: function(ventana) {
                                        view.keys.enable();
                                        view.btnAdicionar.focus();
                                    }
                                });
                                view.btnAplicar.setVisible(false);
                                view.cbFormato.disable();
                                //***** EVENTOS *******//
                                view.btnCancelar.on('click', function() {
                                    view.ventana.close();
                                });
                                //accion de btn aceptar Gestionar Nomenclador
                                view.btnAceptar.on('click', function() {
                                    if (view.btnAplicar.isVisible())
                                        scope.adicionarNomenclador(false, idToModify);
                                    else
                                        scope.adicionarNomenclador(false, idToModify);
                                });
                                //evento para el ENTER
                                view.cbFormato.on({
                                    keypress: function(field, event) {
                                        if (event.getKey() === event.ENTER && !view.btnAceptar.disabled)
                                            scope.adicionarNomenclador(false, idpadre);
                                    },
                                    select: function(combo, record, index) {
                                        var length = scope.getFormatPart(record.json.formato, record.json.separador, parseInt(array[0].attributes.nivel) - 1);
                                        view.tfCodigo.maxLength = length;
                                        view.tfCodigo.maxLengthText = etiquetas.msgMaxLengthDefaultCaract.replace('<numero>', length);
                                        view.tfCodigo.regexText = etiquetas.regexTextCod;
                                    }
                                });
                                view.cbEstado.on({
                                    keypress: function(field, event) {
                                        if (event.getKey() === event.ENTER && !view.btnAceptar.disabled)
                                            scope.adicionarNomenclador(false, idToModify);
                                    },
                                    select: function(combo, record, index) {
                                        view.btnAceptar.setDisabled(Ext.isEmpty(view.txaDescripcion.getValue()) && Ext.isEmpty(view.tfCodigo.getValue()) && !view.panelGest.getForm().isValid());
                                    }
                                });
                                view.tfCodigo.on({
                                    keypress: function(field, event) {
                                        if (event.getKey() === event.ENTER && !view.btnAceptar.disabled)
                                            scope.adicionarNomenclador(false, idToModify);
                                    },
                                    keyup: function(field, event) {
                                        if (event.getKey() === event.BACKSPACE && field.getValue().length < 1 || Ext.isEmpty(view.txaDescripcion.getValue())
                                                || Ext.isEmpty(view.cbFormato.getValue()) || Ext.isEmpty(field.getValue()) || !view.panelGest.getForm().isValid()) {
                                            view.btnAceptar.disable();
                                            view.btnAplicar.disable();
                                        } else {
                                            if (responseData.data.codigo == field.getValue()) {
                                                view.btnAceptar.disable();
                                                view.btnAplicar.disable();
                                            } else {
                                                view.btnAceptar.enable();
                                                view.btnAplicar.enable();
                                            }
                                        }
                                    }
                                });
                                view.txaDescripcion.on({
                                    keypress: function(field, event) {
                                        if (event.getKey() === event.ENTER && !view.btnAceptar.disabled)
                                            scope.adicionarNomenclador(false, idToModify);
                                    },
                                    keyup: function(field, event) {
                                        if (field.getValue().length == 1) {
                                            var vtext = field.getValue().trim();
                                            field.setValue(vtext);
                                        }
                                        if (event.getKey() === event.BACKSPACE && field.getValue().length < 1 || Ext.isEmpty(view.tfCodigo.getValue())
                                                || Ext.isEmpty(view.cbFormato.getValue()) || Ext.isEmpty(field.getValue()) || !view.panelGest.getForm().isValid()) {
                                            view.btnAceptar.disable();
                                            view.btnAplicar.disable();
                                        } else {
                                            if (responseData.data.descripcion == field.getValue()) {
                                                view.btnAceptar.disable();
                                                view.btnAplicar.disable();
                                            } else {
                                                view.btnAceptar.enable();
                                                view.btnAplicar.enable();
                                            }
                                        }
                                    }
                                });
                                /*view.cbxCuenta.on({
                                 keypress: function(field, event) {
                                 if (event.getKey() === event.ENTER && !Ext.isEmpty(view.tfCodigo.getValue()) && !Ext.isEmpty(view.txaDescripcion.getValue())
                                 && !Ext.isEmpty(field.getValue()) && view.panelGest.getForm().isValid())
                                 scope.adicionarNomenclador(false, idToModify);
                                 },
                                 select: function(combo, record, index) {
                                 view.btnAceptar.setDisabled(Ext.isEmpty(view.txaDescripcion.getValue()) && Ext.isEmpty(view.tfCodigo.getValue()) && !view.panelGest.getForm().isValid());
                                 }
                                 });*/
                                model.stFormato.load({
                                    params: {
                                        tipo: view.type
                                    },
                                    callback: function(records, options, success) {
                                        var length = scope.getFormatPart(records[0].json.formato, records[0].json.separador, parseInt(array[0].attributes.nivel) - 1);
                                        view.tfCodigo.maxLength = length;
                                        view.tfCodigo.maxLengthText = etiquetas.msgMaxLengthDefaultCaract.replace('<numero>', length);
                                        view.tfCodigo.regexText = etiquetas.regexTextCod;
                                        view.cbFormato.setValue(responseData.data.formato);
                                        view.ventana.show();
                                    }
                                });
                                model.stEstado.load({
                                    callback: function() {
                                        loadMask.hide();
                                        view.idCCNAE.setValue(responseData.data.idCCNAE);
                                        view.tfCodigo.setValue(responseData.data.codigo);
                                        view.cbEstado.setValue(responseData.data.estado);
                                        view.txaDescripcion.setValue(responseData.data.descripcion);

                                        /*if (responseData.data.denominacion === null) {
                                         view.cbxCuenta.setValue("");
                                         view.cbxCuenta.setRawValue("");
                                         } else {
                                         view.cbxCuenta.setValue(responseData.data.idcuenta, responseData.data.textcuenta);
                                         }*/
                                    }
                                });
                            } else {
                                mostrarMensaje(1, etiquetas.msgDefaultError);
                            }
                        }
                    });
                }
            } else {
                mostrarMensaje(1, etiquetas.msgSelectAlmostOne);
            }
        }

        //accion de btn eliminar Gestionar Nomenclador

        function EventosEliminar() {
            var array = Ext.ComponentMgr.get('ccnae').fGetSelections();
            if (array.length > 0) {
                if (array.length > 1) {
                    var tipo = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                    var message = etiquetas.msgConfirmDeletePlural.replace('<tipo>', tipo.toLowerCase());
                } else {
                    var tipo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
                    var message = etiquetas.msgConfirmDelete.replace('<tipo>', tipo.toLowerCase());
                }
                mostrarMensaje(2, message, function(btnPress) {
                    if (btnPress === 'ok') {
                        var arrayIds = [];
                        Ext.each(array, function(item, index, allItems) {
                            arrayIds.push(item.attributes.id);
                            idformato = item.attributes.idformato;
                        }, this);
                        scope.eliminarNomenclador(arrayIds, idformato);
                        view.keys.enable();
                        view.btnAdicionar.focus();
                    } else {
                        view.keys.enable();
                        view.btnAdicionar.focus();
                    }
                });
            } else {
                mostrarMensaje(1, etiquetas.msgSelectAlmostOne.replace('<tipo>', tipo));
            }
        }

        //accion de btn heredar Gestionar Nomenclador

        function EventosHeredar() {
            var titulo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
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
                new Ext.Costo.Procesos.Nomencladores.Componentes.CCNAE({
                    id: 'centroNivel',
                    loadHelpersFiles: false,
                    typeSelection: 1,
                    extending: 1,
                    types: (view.type == 1) ? [1] : [2]
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

            view.btnAceptarHeredar.on('click', function() {
                var array = Ext.ComponentMgr.get('centroNivel').fGetSelections();
                if (array.length > 0) {
                    scope.adicionarNomencladorHeredado(array);
                } else {
                    var tipo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
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

        this.adicionarNomenclador = function(isApplaying, idpadre) {
            if (scope.validaFormulario()) {
                console.log(view.url);
                var tipo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
                (Ext.isEmpty(view.idCCNAE.getValue())) ? scope.loadMessageBox(etiquetas.msgAddWait.replace('<tipo>', tipo.toLowerCase())) : scope.loadMessageBox(etiquetas.msgModifyWait.replace('<tipo>', tipo.toLowerCase()));
                Ext.Ajax.request({
                    url: view.url + 'insertarCentroCostoNAE',
                    method: 'POST',
                    params: {
                        idcc: (!Ext.isEmpty(view.idCCNAE.getValue())) ? view.idCCNAE.getValue() : '-1',
                        idformato: view.cbFormato.getValue(),
                        codigo: view.tfCodigo.getValue(),
                        idestado: (!Ext.isEmpty(view.idCCNAE.getValue())) ? view.cbEstado.getValue() : '-1',
                        descripcion: view.txaDescripcion.getValue(),
                        idpadre: idpadre,
                        tipo: view.type,
                        //idcuenta: (view.type == 1) ? view.cbxCuenta.getValue() : -1
                        idcuenta: null //Furet
                    },
                    callback: function(options, success, response) {
                        Ext.MessageBox.hide();
                        if (!response.responseText)
                            mostrarMensaje(1, etiquetas.msgDefaultError);
                        else {
                            var responseData = Ext.decode(response.responseText);
                            switch (responseData.code) {
                                case 1:
                                    mostrarMensaje(1, etiquetas.msgAddSuccess.replace('<tipo>', tipo.toLowerCase())
                                            );
                                    scope.resetScreen();
                                    (idpadre == '-1') ? Ext.ComponentMgr.get('ccnae').reload() : Ext.ComponentMgr.get('ccnae').reload(idpadre);
                                    if (isApplaying) {
                                        scope.resetFormAdd();
                                    } else {
                                        view.ventana.close();
                                    }
                                    break;
                                case 2:
                                    var mensaje = etiquetas.msgFailedAddBD.replace('<tipo>', tipo.toLowerCase()).replace('<objeto>', responseData.errors[0].codigo + " " + responseData.errors[0].centro);
                                    mostrarMensaje(1, mensaje, function() {
                                    });
                                    break;
                                case 3:
                                    mostrarMensaje(1, etiquetas.msgAlreadyExitsEntity.replace('<tipo>', tipo.toLowerCase()));
                                    break;
                                case 4:
                                    mostrarMensaje(1, etiquetas.msgModifySuccess.replace('<tipo>', tipo.toLowerCase()));
                                    (idpadre == '-1') ? Ext.ComponentMgr.get('ccnae').reload() : Ext.ComponentMgr.get('ccnae').reload(idpadre);
                                    if (isApplaying) {
                                        scope.resetFormAdd();
                                    } else {
                                        view.ventana.close();
                                    }
                                    break;
                                case 5:
                                    var mensaje = etiquetas.msgFailedModifyBD.replace('<tipo>', tipo.toLowerCase()).replace('<objeto>', responseData.errors[0].codigo + " " + responseData.errors[0].centro);
                                    mostrarMensaje(1, mensaje, function() {
                                    });
                                    break;
                                case 6:
                                    var mensaje = etiquetas.msgAlreadyExitsEntity.replace('<tipo>', tipo.toLowerCase());
                                    mostrarMensaje(1, mensaje, function() {
                                    });
                                    view.tfCodigo.focus(true, 100);
                                    break;
                                case 7:
                                    mostrarMensaje(1, "No se puede asociar el centro de costo seleccionado a una cuenta que tiene operaciones registradas.");
                                    break;
                                case 8:
                                    var mensaje = etiquetas.msgElementoAperturado.replace('<tipo>', tipo.toLowerCase());
                                    mostrarMensaje(1, mensaje);
                                    break;
                                default:
                                    mostrarMensaje(1, etiquetas.msgDefaultError);
                                    break;
                            }
                        }
                    }
                });
            } else {
                mostrarMensaje(1, etiquetas.msgDataInvalid);
                view.btnAplicar.enable();
            }
        };

        this.resetFormAdd = function() {
            view.cbEstado.setValue('');
            view.tfCodigo.setValue('');
            view.txaDescripcion.setValue('');
            view.btnAceptar.disable();
            view.btnAplicar.disable();
        };

        this.eliminarNomenclador = function(arrayIds, idformato) {
            if (arrayIds.length > 1) {
                var tipo = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                var message = etiquetas.msgDelWaitPlural.replace('<tipo>', tipo.toLowerCase());
            } else {
                var tipo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
                var message = etiquetas.msgDelWait.replace('<tipo>', tipo.toLowerCase());
            }
            scope.loadMessageBox(message);
            Ext.Ajax.request({
                url: view.url + 'eliminarCentroCostoNAECascade',
                method: 'POST',
                params: {
                    ids: Ext.encode(arrayIds),
                    idformato: idformato
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
                                    var mensaje = etiquetas.msgPluralDeleteOK.replace('<tipo>', tipo.toLowerCase());
                                } else {
                                    var mensaje = etiquetas.msgDeleteOK.replace('<tipo>', tipo.toLowerCase());
                                }
                                mostrarMensaje(1, mensaje);
                                scope.resetScreen();
                                Ext.ComponentMgr.get('ccnae').reload();
                                break;
                            case 2:
                                var array = [];
                                for (var i = 0; i < responseData.errors.length; i++) {
                                    array.push(responseData.errors[i].codigo + " " + responseData.errors[i].centro)
                                }
                                if (responseData.errors.length > 1) {
                                    var tipos = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                                    var mensaje = etiquetas.msgFailedDelBDPlural.replace('<tipo>', tipos.toLowerCase());
                                } else {
                                    var mensaje = etiquetas.msgFailedDelBD.replace('<tipo>', tipo.toLowerCase());
                                }
                                mostrarMensaje(1, mensaje.replace('<objeto>', array.join(',')), function() {
                                });
                                Ext.ComponentMgr.get('ccnae').reload();
                                break;
                            case 3:
                                var array = [];
                                for (var i = 0; i < responseData.errors.length; i++) {
                                    array.push(responseData.errors[i].codigo + " " + responseData.errors[i].centro)
                                }
                                if (responseData.errors.length > 1) {
                                    var tipos = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                                    var mensaje = etiquetas.msgFailDelDueToAsocARPlural.replace('<tipo>', tipos.toLowerCase());
                                } else {
                                    var mensaje = etiquetas.msgFailDelDueToAsocAR.replace('<tipo>', tipo.toLowerCase());
                                }
                                Ext.ComponentMgr.get('ccnae').reload();
                                mostrarMensaje(1, mensaje.replace('<objeto>', array.join(',')), function() {
                                });
                                break;
                            case 4:
                                var array = [];
                                for (var i = 0; i < responseData.errors.length; i++) {
                                    array.push(responseData.errors[i].codigo + " " + responseData.errors[i].centro);
                                }
                                if (responseData.errors.length > 1) {
                                    var tipos = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                                    var mensaje = etiquetas.msgFailDelDueToAsocCuentaPlural.replace('<tipo>', tipos.toLowerCase());
                                } else {
                                    var mensaje = etiquetas.msgFailDelDueToAsocCuenta.replace('<tipo>', tipo.toLowerCase());
                                }
                                mostrarMensaje(1, mensaje.replace('<objeto>', array.join(',')), function() {
                                });
                                Ext.ComponentMgr.get('ccnae').reload();
                                break;
                            case -3:
                                var array = [];
                                for (var i = 0; i < responseData.errors.length; i++) {
                                    array.push(responseData.errors[i].codigo + " " + responseData.errors[i].centro);
                                }
                                if (responseData.errors.length > 1) {
                                    var tipos = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                                    var mensaje = etiquetas.msgFailDelDueToInUsePlural.replace('<tipo>', tipos.toLowerCase());
                                } else {
                                    var mensaje = etiquetas.msgFailDelDueToInUse.replace('<tipo>', tipo.toLowerCase());
                                }
                                mostrarMensaje(1, mensaje.replace('<objeto>', array.join(',')), function() {
                                });
                                break;
                            case 8:
                                var mensaje = etiquetas.msgElementoAperturado.replace('<tipo>', tipo.toLowerCase());
                                mostrarMensaje(1, mensaje);
                                break;
                            default:
                                mostrarMensaje(1, etiquetas.msgDefaultError);
                                break;
                        }
                    }
                }
            });
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
            var arrayCentrosElementos = [];
            var datos = [];

            for (var i = 0; i < array.length; i++) {
                if (array[i].parentNode.attributes.id != '0') {
                    var path = array[i].getPath('id');
                    var ancestros = path.split('/');
                    for (var j = 2; j < ancestros.length - 1; j++) {
                        var parentNode = Ext.getCmp('centroNivel').tpCCNAEOG.getNodeById(ancestros[j]);
                        var objectPadre = {
                            idcc: '-1',
                            idheredado: parentNode.attributes.id,
                            idformato: parentNode.attributes.idformato,
                            codigo: parentNode.attributes.codigo,
                            concat: parentNode.attributes.concat,
                            idestado: parentNode.attributes.idestado,
                            descripcion: parentNode.attributes.descripcion,
                            idpadre: (parentNode.attributes.id !== parentNode.attributes.idpadre) ? parentNode.attributes.idpadre : -1,
                            tipo: parentNode.attributes.idtipo
                        };
                        if (!scope.objectInArray(arrayCentrosElementos, objectPadre))
                            arrayCentrosElementos.push(objectPadre);
                    }
                }
                var object = {
                    idcc: '-1',
                    idheredado: array[i].attributes.id,
                    idformato: array[i].attributes.idformato,
                    codigo: array[i].attributes.codigo,
                    concat: array[i].attributes.concat,
                    idestado: array[i].attributes.idestado,
                    descripcion: array[i].attributes.descripcion,
                    idpadre: (array[i].attributes.id !== array[i].attributes.idpadre) ? array[i].attributes.idpadre : -1,
                    tipo: array[i].attributes.idtipo
                };
                arrayCentrosElementos.push(object);
            }
            if (arrayCentrosElementos.length > 1) {
                var tipo = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                var message = etiquetas.msgExtWaitPlural.replace('<tipo>', tipo.toLowerCase());
            } else {
                var tipo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNaes;
                var message = etiquetas.msgExtWait.replace('<tipo>', tipo.toLowerCase());
            }
            scope.MostrarMascara(message, 'all')
            Ext.Ajax.request({
                url: view.url + 'heredarCentroCostoNAE',
                method: 'POST',
                params: {
                    arraydatos: Ext.encode(arrayCentrosElementos)
                },
                callback: function(options, success, response) {
                    loadMask.hide();
                    if (!response.responseText)
                        mostrarMensaje(1, etiquetas.msgDefaultError);
                    else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code) {
                            case 1:
                                if (responseData.success.length > 1) {
                                    var tipo = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                                } else {
                                    var tipo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNaes;
                                }
                                var message = (arrayCentrosElementos.length > 1) ? etiquetas.msgEntendSuccessPlural.replace('<tipo>', tipo.toLowerCase())
                                        : etiquetas.msgEntendSuccess.replace('<tipo>', tipo.toLowerCase());
                                mostrarMensaje(1, message)
                                Ext.ComponentMgr.get('ccnae').reload();
                                view.ventana.close();
                                break;
                            case 2:
                                var array = [];
                                for (var i = 0; i < responseData.errors.length; i++) {
                                    array.push(responseData.errors[i].codigo + " " + responseData.errors[i].centro)
                                }
                                if (responseData.errors.length > 1) {
                                    var tipo = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                                    var message = etiquetas.msgFailedExtBDPlural.replace('<tipo>', tipo.toLowerCase());
                                } else {
                                    var tipo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
                                    var message = etiquetas.msgFailedExtBD.replace('<tipo>', tipo.toLowerCase());
                                }
                                mostrarMensaje(1, message.replace('<objeto>', array.join(',')));
                                break;
                            case 3:
                                var array = [];
                                for (var i = 0; i < responseData.errors.length; i++) {
                                    array.push(responseData.errors[i].codigo + " " + responseData.errors[i].centro)
                                }
                                if (responseData.errors.length > 1) {
                                    var tipo = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                                } else {
                                    var tipo = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
                                }
                                // si no todos fueron heredados
                                if (responseData.errors.length < arrayCentrosElementos.length) {
                                    scope.mensajePersonalizado({
                                        title: etiquetas.titleInfo,
                                        buttons: Ext.Msg.OK,
                                        msg: etiquetas.msgEntendParcialSuccess.replace('<tipo>', tipo.toLowerCase()),
                                        icon: Ext.Msg.INFO,
                                        fn: function() {
                                            if (responseData.errors.length > 1) {
                                                var type = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                                                var message = etiquetas.msgAlreadyExitsEntityExtPlural.replace('<tipo>', type.toLowerCase());
                                            } else {
                                                var type = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
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
                                                    Ext.ComponentMgr.get('ccnae').reload();
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    if (responseData.errors.length > 1) {
                                        var type = (view.type == 1) ? etiquetas.lbCentros : etiquetas.lbNaes;
                                        var msg = etiquetas.msgAlreadyExitsEntityExtPlural1.replace('<tipo>', type.toLowerCase());
                                    } else {
                                        var type = (view.type == 1) ? etiquetas.lbCentro : etiquetas.lbNae;
                                        var msg = etiquetas.msgAlreadyExitsEntityExt1.replace('<tipo>', type.toLowerCase());
                                    }
                                    mostrarMensaje(1, msg)
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
}