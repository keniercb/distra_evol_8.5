Ext.ns('Costo.Procesos.Asociacion.Area');
Costo.Procesos.Asociacion.Area.Controller = {
    init: function (perfil, etiquetas, view, model) {
        var scope = this;

        this.loadMessageBox = function (msg) {
            Ext.MessageBox.show({
                title: etiquetas.lbMsgEspere,
                msg: msg,
                width: 300,
                progress: true,
                closable: false
            });
            var f = function (v) {
                return function () {
                    var i = v / 11;
                    Ext.MessageBox.updateProgress(i);
                };
            };
            for (var i = 1; i < 12; i++)
                setTimeout(f(i), i * 500);
        };
        scope.loadMessageBox(etiquetas.lbCargando);

        /********************** EVENTOS **********************/
        /* EVENTOS STORES */
        // EVENTOS RELACIONADOS CON LOS STORES
        model.stcentronivel.on({
            beforeload: function (store, options) {
                if (view.smAreas.hasSelection()) { // aki tengo ke preguntar si exite algo seleccionado en el grid de areas
                    var areaSelected = view.smAreas.getSelected().data.idarea;
                    this.baseParams.idAreaResponsabilidad = areaSelected; // aki se pone realmente cual esta selected
                } else {
                    view.gridCCNAE.body.unmask();
                }
            },
            load: function (store, records, options) {
                if (records.length == 0) {
                    var message = (view.searchaCentro.getValue()) ? etiquetas.msgNoElementSearch : etiquetas.msgNoElements;
                    mostrarMensaje(1, message);
                }
            }
        });

        model.storeAreas.on({
            load: function (store, records, options) {
                Ext.MessageBox.hide();
                if (records.length == 0) {
                    var message = (view.searchaAsoc.getValue()) ? etiquetas.msgNoElementSearch : etiquetas.msgNoElements;
                    mostrarMensaje(1, message);
                }
            }
        });

        /* EVENTOS SELECTIONS MODEL */

        // EVENTOS QUE CONTROLAN LAS ACCIONES A REALIZAR CUANDO SE SELECCIONAN O DESMARCAN LOS CCNAE
        view.smCentrosNae.on({
            beforerowselect: function (selectionModel, rowIndex, keepExisting, record) {
                view.btnEliminarCCNAE.enable();
                view.btnAdicionarCCNAE.disable();
            },
            rowdeselect: function (selectionModel, rowIndex, record) {
                view.gridCCNAE.getView().removeRowClass(rowIndex, "negrita");
                if (!view.smCentrosNae.hasSelection())
                    view.btnEliminarCCNAE.disable();
                view.btnAdicionarCCNAE.enable();
            },
            rowselect: function (selModel, rowIndex, record) {
                view.gridCCNAE.getView().addRowClass(rowIndex, "negrita");
            }
        });

        view.smAreas.on({
            rowdeselect: function (selectionModel, rowIndex, record) {
                view.gridAreas.getView().removeRowClass(rowIndex, "negrita");
                if (!selectionModel.hasSelection()) {
                    model.stcentronivel.removeAll();
                    view.gridCCNAE.disable();
                    view.btnAdicionarCCNAE.disable();
                    view.btnEliminarCCNAE.disable();
                } else {
                    view.gridCCNAE.enable();
                }
                view.btnAdicionarArea.enable();
            },
            rowselect: function (selModel, rowIndex, record) {
                view.gridAreas.getView().addRowClass(rowIndex, "negrita");
            }
        });

        /* EVENTOS GRIDS */
        view.gridAreas.on({
            rowdblclick: function (grid, rowIndex, eventObject) {
                // esto es para asegurarme de que  cuando se de dbclick en un row el store de CCNAE sea cargado con esta area
                view.smAreas.clearSelections();
                view.smAreas.selectRow(rowIndex);

                var area = view.smAreas.getSelected().data.descripcion;
                view.pCentros.setTitle(etiquetas.titlePanel2 + " " + area);
                model.stcentronivel.removeAll(); //Limpiando el store de otras posibles selecciones
                view.pCentros.expand();
                model.stcentronivel.load({
                    params: {
                        start: 0,
                        limit: 20
                    }, callback: function () {
                        view.gridCCNAE.enable();
                        view.btnAdicionarCCNAE.enable();
                    }
                });
            }
        });

        //teclas calientes
        new Ext.KeyMap(Ext.getBody(), [{
            // ADICIONAR
            key: 'i',
            alt: true,
            fn: function () {
                scope.functionClickAddAsocEvent(1, 1);
            }
        }, {
            // ADICIONAR
            key: 'i',
            ctrl: true,
            fn: function () {
                if (!view.pCentros.collapsed)
                    scope.functionClickAddAsocEvent(2, 2);
            }
        }, {
            // Ayuda
            key: 'h',
            alt: true,
            fn: function () {
                if (!Ext.EventObject.ctrlKey)
                    scope.eventosAyuda();
            }
        }, {
            // Heredar
            key: 'h',
            alt: true,
            ctrl: true,
            fn: function () {
                scope.btnHeredarAction();
            }
        }, {
            // Eliminar
            key: Ext.EventObject.DELETE,
            fn: function () {
                if (!view.pCentros.collapsed && !view.btnEliminarCCNAE.disabled)
                    scope.btnEliminarAction();
            }
        }]);

        /* EVENTOS BOTONES */

        //EVENTOS RELACIONADOS CON LA VENTANA DE ADICIONAR ASOCIACION
        view.btnAdicionarArea.on('click', function () {
            scope.functionClickAddAsocEvent(1, 1);
        });
        view.btnAdicionarCCNAE.on('click', function () {
            scope.functionClickAddAsocEvent(2, 2);
        });
        view.btnHeredar.on('click', function () {
            scope.btnHeredarAction();
        });
        view.btnEliminarCCNAE.on('click', function () {
            scope.btnEliminarAction();
        });

        this.btnEliminarAction = function () {
            if (view.smAreas.hasSelection()) {
                if (view.smCentrosNae.hasSelection()) {
                    var selections = view.smCentrosNae.getSelections();
                    var messageConfirm = selections.length > 1 ? etiquetas.msgPluralConfirmCCNAE : etiquetas.msgSingleConfirmCCNAE;
                    var areaSelected = {
                        id: view.smAreas.getSelected().data.idarea,
                        text: view.smAreas.getSelected().data.descripcion
                    };
                    var ccnaeSelecteds = [];
                    for (var i = 0; i < selections.length; i++) {
                        ccnaeSelecteds.push({
                            id: selections[i].data.idcentro,
                            text: selections[i].data.descripcion
                        });
                    }
                    mostrarMensaje(2, messageConfirm, function (btnPress) {
                        if (btnPress === 'ok') {
                            scope.deleteCCNAE(ccnaeSelecteds, areaSelected);
                        }
                    });
                } else {
                    mostrarMensaje(1, etiquetas.msgNoCCNAESelected, function () {
                    });
                }
            } else {
                mostrarMensaje(1, etiquetas.msgNoCCNAESelected, function () {
                });
            }
        };
        /********************** FUNCIONES **********************/

        /**
         * Funcion que establece todos los eventos para la ventana de heredar
         */
        this.btnHeredarAction = function () {
            // Se crea y se muestra la ventana
            view.createWindowsExtend(etiquetas);
            view.ventanaExtend.show(Ext.getBody(), function () {
                this.maximize();
            });
            view.ventanaExtend.on({
                afterlayout: function (windows, layout) {
                    view.sfBuscar.setWidth(this.body.getWidth() - 6);
                }
            });
            // manejando los eventos correspondiente a los componentes de la ventana
            view.btnCancelarExtend.on('click', function () {
                view.ventanaExtend.close();
            });
            view.btnAceptarExtend.on('click', function () {
                scope.heredarFunction(false);
            });
            view.btnAplicarExtend.on('click', function () {
                scope.heredarFunction(true);
            });
            // eventos de los items del menu contextual
            view.miMarcar.on('click', function () {
                scope.fToggleCheck(view.tpAsocPorAreas.getSelectionModel().getSelectedNode(), true);
            });
            view.miDesmarcar.on('click', function () {
                scope.fToggleCheck(view.tpAsocPorAreas.getSelectionModel().getSelectedNode(), false);
            });

            // enentos asociados al tree panel de asosicaciones
            view.tpAsocPorAreas.on({
                checkchange: function (node, checked) {
                    if (checked) {
                        view.btnAceptarExtend.enable();
                        view.btnAplicarExtend.enable();
                    } else {
                        if (scope.getAsocSelected().length == 0) {
                            view.btnAplicarExtend.disable();
                            view.btnAceptarExtend.disable();
                        }
                    }
                },
                beforerender: function (c) {
                },
                contextmenu: function (node, e) {
                    if (!node.attributes.leaf && node.isExpanded()) {
                        node.select();
                        var count = scope.fGetCountNodes(node);
                        if (scope.fGetCountCheckedNodes(node, false) == count) {
                            view.miMarcar.show();
                            view.miDesmarcar.hide();
                        } else if (scope.fGetCountCheckedNodes(node, true) == count) {
                            view.miMarcar.hide();
                            view.miDesmarcar.show();
                        } else {
                            view.miMarcar.show();
                            view.miDesmarcar.show();
                        }
                        view.menu.showAt(e.getXY());
                    }
                }
            });
            view.tlAsocPorAreas.on({
                load: function (treeLoader, node, response) {
                    if (response.responseText == 4) {
                        // mostrarMensaje(1, etiquetas.msgEntidadRectora, function () {
                        //     view.ventanaExtend.close();
                        // });
                        mostrarMensaje(1, etiquetas.msgEntidadRectora);
                        view.ventanaExtend.close();
                    } else {
                        if (!view.rootNodeAsocPorAreas.hasChildNodes()) {
                            mostrarMensaje(1, etiquetas.msgNoElements);
                            view.ventanaExtend.close();
                        }
                        view.menu.add(view.miMarcar);
                        view.menu.add(view.miDesmarcar);
                    }
                }
            });
        };
        /**
         * Funcion que recoje los datos y valida todo antes de heredar
         */
        this.heredarFunction = function (isAplaing) {
            var asosSelected = scope.getAsocSelected();
            var asoc = [];
            if (asosSelected.length > 0) {
                for (var i = 0; i < asosSelected.length; i++) {
                    if (!asosSelected[i].hasChildNodes()) { //si es hoja
                        var object = {
                            idarea: asosSelected[i].parentNode.attributes.idarea,
                            area: asosSelected[i].parentNode.attributes.text,
                            idcentro: asosSelected[i].attributes.idcentro,
                            centro: asosSelected[i].attributes.text,
                            estructura: asosSelected[i].parentNode.attributes.estructura
                        }
                        asoc.push(object);
                    }
                }
                scope.heredar(asoc, isAplaing);
            } else {
                mostrarMensaje(1, etiquetas.msgNoAsocExtendSelected);
            }
        };
        /**
         * Funcion que realiza la herencia heredar
         */
        this.heredar = function (asociaciones, isAplaing) {
            scope.loadMask(etiquetas.msgWait);
            Ext.Ajax.request({
                method: "POST",
                url: "heredarAsociacion",
                params: {
                    asociaciones: Ext.encode(asociaciones)
                },
                callback: function (options, success, response) {
                    if (!response.responseText) {
                        mostrarMensaje(1, etiquetas.msgDefaultError);
                    } else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code) {
                            case 1:
                                var message = (asociaciones.length > 1) ? etiquetas.msgPluralAreasExtendSuccess : etiquetas.msgSingleAreasExtendSuccess;
                                scope.mask.hide();

                                mostrarMensaje(1, message);
                                    if (!isAplaing) { // si dio click en aceptar cerrar la ventana
                                        view.ventanaExtend.close();
                                    } else {
                                        // [aki va el metodo que limpia la seleccion]
                                        scope.clearSelectionsExtend();
                                    }
                                    scope.reloadAreas(); //recargando el grid de areas
                               break;
                            case 2:
                                var message = (responseData.errors.length > 1) ? etiquetas.msgPluralAsocFailed :
                                    (responseData.errors.length == 1 ? etiquetas.msgSingleAsocFailed : etiquetas.msgDefaultAsocFailed)
                                if (responseData.errors.length >= 1) {
                                    message += " " + "<i>" + responseData.errors[0].area + "</i> -> <i>" + responseData.errors[0].centro + "</i>"
                                    if (responseData.errors.length > 1) {
                                        for (var i = 0; i < responseData.errors.length; i++)
                                            message += " ,<i>" + responseData.errors[i].area + "</i> -> <i>" + responseData.errors[i].centro + "</i>"
                                    }
                                    message += ".";
                                }
                                // si no todas las asociaciones fueron registradas
                                scope.mask.hide();
                                if (responseData.errors.length < (areasSelected.length * ccnaeSelected.length)) {
                                    var messageParcial = (asociaciones.length > 1) ? etiquetas.msgPluralAreasAsocParcialSuccess : etiquetas.msgSingleAreasAsocParcialSuccess;
                                    mostrarMensaje(2, message, function () {
                                        if (!isAplaing) // si dio click en aceptar cerrar la ventana
                                            view.ventanaExtend.close();
                                    });
                                    mostrarMensaje(1, messageParcial.replace('<br/>', ''), function () {
                                    })
                                } else {
                                    mostrarMensaje(2, message, function () {
                                        if (!isAplaing) // si dio click en aceptar cerrar la ventana
                                            view.ventanaExtend.close();
                                    });
                                }
                                break;
                            case 3:
                                var message = (responseData.errors.length > 1) ? etiquetas.msgPluralAlreadyExistExtend :
                                    (responseData.errors.length == 1 ? etiquetas.msgSingleAlreadyExistExtend : etiquetas.msgDefaultExtendFailed)
                                if (responseData.errors.length >= 1) {
                                    message += " " + "<i>" + responseData.errors[0].area + "</i> -> <i>" + responseData.errors[0].centro + "</i>"
                                    if (responseData.errors.length > 1) {
                                        for (var i = 1; i < responseData.errors.length; i++)
                                            message += ", <i>" + responseData.errors[i].area + "</i> -> <i>" + responseData.errors[i].centro + "</i>"
                                    }
                                    message += ".";
                                }
                                scope.mask.hide();

                                // si no todas las asociaciones fueron registradas
                                if (responseData.errors.length < asociaciones.length) {
                                    var messageParcial = (asociaciones.length > 1) ? etiquetas.msgPluralAreasExtendParcialSuccess : etiquetas.msgSingleAreasExtendParcialSuccess;
                                    scope.MsgPersonalizado({
                                        title: etiquetas.titleInfo,
                                        buttons: Ext.Msg.OK,
                                        msg: messageParcial,
                                        icon: Ext.Msg.INFO,
                                        fn: function () {
                                            scope.MsgPersonalizado({
                                                title: etiquetas.titleInfo,
                                                buttons: Ext.Msg.OK,
                                                msg: "<ul>" + message + "</ul>",
                                                icon: Ext.Msg.INFO,
                                                fn: function () {
                                                    if (!isAplaing) {
                                                        view.ventanaExtend.close();
                                                    } else {
                                                        scope.clearSelectionsExtend();
                                                    }
                                                    scope.reloadAreas();
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    var mesg = (asociaciones.length > 1) ? etiquetas.msgPluralExistAsoc : etiquetas.msgSingleExistAsoc;
                                    mostrarMensaje(1, mesg);
                                        if (!isAplaing) {
                                            view.ventanaExtend.close();
                                        } else {
                                            scope.clearSelectionsExtend();
                                        }
                                 }
                                break;
                            case 4:
                                mostrarMensaje(1, etiquetas.msgMissingElementsExtend);
                                break;
                            case 5:
                                var message = (responseData.errors.length > 1) ? etiquetas.msgNoOwnerCCNAEExtend :
                                    (responseData.errors.length == 1 ? etiquetas.msgNoOwnerCCNAEExtendSingle : etiquetas.msgDefaultExtendFailed);
                                if (responseData.errors.length >= 1) {
                                    message += " " + etiquetas.msgError1;
                                    for (var i = 0; i < responseData.errors.length; i++) {
                                        message += " <i>" + responseData.errors[i].centronoexist + "</i>";
                                        if ((i + 1) < responseData.errors.length)
                                            message += ", ";
                                    }
                                    message += ". ";
                                }
                                scope.mask.hide();
                                mostrarMensaje(1, message);
                                    if (!isAplaing) { // si dio click en aceptar cerrar la ventana
                                        view.ventanaExtend.close();
                                    } else {
                                        scope.clearSelectionsExtend();
                                    }
                                    scope.reloadAreas(); //recargando el grid de areas
                                break;
                            default:
                                mostrarMensaje(1, etiquetas.msgDefaultError);
                                break;
                        }
                    }
                }
            });
        };

        /**
         * Funcion que establece todos los eventos para la ventana de adicionar asociacion
         */
        this.functionClickAddAsocEvent = function (tipoWindows, tipo) {
            view.CreateWindows(model, tipoWindows, etiquetas, tipo);
            view.CCANE.on({
                initialize: function (componentClass, componentUI) {
                    componentUI.on({
                        checkchange: function (node, checked) {
                            if (checked && (view.type == 2 || scope.getAreasSelected().length)) {
                                view.btnAplicar.enable();
                                view.btnAceptar.enable();
                            } else {
                                if (componentClass.fGetSelections().length == 0) {
                                    view.btnAplicar.disable();
                                    view.btnAceptar.disable();
                                }
                            }
                        }
                    });
                    componentUI.setHeight(view.pCentro.getSize().height);
                    view.pCentro.insert(0, componentUI);
                    view.pCentro.doLayout(true);
                }
            });
            view.winGestAsocia.show(
                Ext.getBody(), function () {
                    this.maximize();
                }
            );
            view.btnAceptar.on('click', function () {
                scope.clickAceptAplaingAddAsociacion(false);
            });
            view.btnAplicar.on('click', function () {
                scope.clickAceptAplaingAddAsociacion(true);
            });
            view.btnCancelar.on('click', function () {
                view.winGestAsocia.close();
            });
            view.treePanelAreas.on({
                checkchange: function (node, checked) {
                    if (checked) {
                        node.select();
                        if (view.CCANE.fGetSelections().length > 0) {
                            view.btnAceptar.enable();
                            view.btnAplicar.enable();
                        }
                    } else {
                        node.unselect();
                        if (scope.getAreasSelected().length == 0) {
                            view.btnAplicar.disable();
                            view.btnAceptar.disable();
                        }
                        else {
                            if (view.CCANE.fGetSelections().length > 0) {
                                view.btnAceptar.enable();
                                view.btnAplicar.enable();
                            }
                        }
                    }
                }
            });
        };

        /**
         * Funcion que implementa las acciones al hacer click en el btn Aceptar o Aplicar del add asociacion
         */
        this.clickAceptAplaingAddAsociacion = function (isAplaing) {
            var areas = [];
            if (view.type == 1) {
                var areasSelected = scope.getAreasSelected();
                for (var i = 0; i < areasSelected.length; i++) {
                    areas.push({
                        id: areasSelected[i].attributes.id,
                        text: areasSelected[i].attributes.text
                    });
                }
            } else {
                var areasSelected = view.smAreas.getSelections();
                for (var i = 0; i < areasSelected.length; i++) {
                    areas.push({
                        id: areasSelected[i].data.idarea,
                        text: areasSelected[i].data.descripcion
                    });
                }
            }
            if (areas.length > 0) {
                var ccnae = [];
                var ccnaeSelected = view.CCANE.fGetSelections();
                for (var i = 0; i < ccnaeSelected.length; i++) {
                    ccnae.push({
                        id: ccnaeSelected[i].attributes.id,
                        text: ccnaeSelected[i].attributes.text
                    });
                }
                if (ccnaeSelected.length > 0) {
                    // Llamada a funcion que registra la asociacion por AJAX
                    scope.registrarAsociacion(areas, ccnae, isAplaing)
                } else {
                    mostrarMensaje(1, etiquetas.msgNoCCNAESelected, function () {
                    });
                }
            } else {
                mostrarMensaje(1, etiquetas.msgNoAreaSelected, function () {
                });
            }
        };

        /**
         * Funcion que registra las asociaciones
         */
        this.registrarAsociacion = function (areasSelected, ccnaeSelected, isAplaing) {
            scope.loadMessageBox(etiquetas.msgWaitAdd);
            Ext.Ajax.request({
                method: "POST",
                url: "addAsociacion",
                params: {
                    areas: Ext.encode(areasSelected),
                    ccnae: Ext.encode(ccnaeSelected)
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    if (!response.responseText) {
                        mostrarMensaje(1, etiquetas.msgDefaultError);
                    } else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code) {
                            case 1:
                                var message = (areasSelected.length > 1) ? etiquetas.msgPluralAreasAsocSuccess : etiquetas.msgSingleAreasAsocSuccess;
                                message += (ccnaeSelected.length > 1) ? etiquetas.msgPluralCcnaeAsocSuccess : etiquetas.msgSingleCcnaeAsocSuccess;
                                mostrarMensaje(1, message.replace('<br/>', ''))
                                    if (!isAplaing) { // si dio click en aceptar cerrar la ventana
                                        view.winGestAsocia.close();
                                    } else {
                                        scope.clearSelectionsAddAsoc();
                                    }
                                    if (view.type == 1)
                                        scope.reloadAreas(); //recargando el grid de areas
                                    else
                                        model.stcentronivel.reload(); //recargando el grid de CCNAE
                               
                                break;
                            case 2:
                                var message = (responseData.errors.length > 1) ? etiquetas.msgPluralAsocFailed :
                                    (responseData.errors.length == 1 ? etiquetas.msgSingleAsocFailed : etiquetas.msgDefaultAsocFailed)
                                if (responseData.errors.length >= 1) {
                                    message += " " + "<i>" + responseData.errors[0].area + "</i> -> <i>" + responseData.errors[0].centro + "</i>"
                                    if (responseData.errors.length > 1) {
                                        for (var i = 1; i < responseData.errors.length; i++)
                                            message += " ,<i>" + responseData.errors[i].area + "</i> -> <i>" + responseData.errors[i].centro + "</i>"
                                    }
                                    message += ".";
                                }
                                // si no todas las asociaciones fueron registradas
                                if (responseData.errors.length < (areasSelected.length * ccnaeSelected.length)) {
                                    var messageParcial = (areasSelected.length > 1) ? etiquetas.msgPluralAreasAsocParcialSuccess : etiquetas.msgSingleAreasAsocParcialSuccess;
                                    // messageParcial += (ccnaeSelected.length > 1) ? etiquetas.msgPluralCcnaeAsocSuccess : etiquetas.msgSingleCcnaeAsocSuccess;

                                    // mostrarMensaje(2, message, function () {
                                    //     if (!isAplaing) // si dio click en aceptar cerrar la ventana
                                    //         view.winGestAsocia.close();
                                    // });
                                    mostrarMensaje(1, messageParcial.replace('<br/>', ''));
                                } else {
                                    mostrarMensaje(2, message, function () {
                                        if (!isAplaing) // si dio click en aceptar cerrar la ventana
                                            view.winGestAsocia.close();
                                    });
                                }
                                break;
                            case 3:
                                var message = (responseData.errors.length > 1) ? etiquetas.msgPluralAlreadyExistAsoc :
                                    (responseData.errors.length == 1 ? etiquetas.msgSingleAlreadyExistAsoc : etiquetas.msgDefaultAsocFailed)

                                if (responseData.errors.length >= 1) {
                                    message += " " + "<i>" + responseData.errors[0].area + "</i> -> <i>" + responseData.errors[0].centro + "</i>"
                                    if (responseData.errors.length > 1) {
                                        for (var i = 1; i < responseData.errors.length; i++)
                                            message += ", <i>" + responseData.errors[i].area + "</i> -> <i>" + responseData.errors[i].centro + "</i>"
                                    }
                                    message += ".";
                                }
                                // si no todas las asociaciones fueron registradas
                                if (responseData.errors.length < (areasSelected.length * ccnaeSelected.length)) {
                                    var messageParcial = (areasSelected.length > 1) ? etiquetas.msgPluralAreasAsocParcialSuccess : etiquetas.msgSingleAreasAsocParcialSuccess;
                                    mostrarMensaje(1, messageParcial.replace('<br/>', ''));
                                        // mostrarMensaje(1, message, function () {
                                        //
                                        // });
                                            if (!isAplaing) { // si dio click en aceptar cerrar la ventana
                                                view.winGestAsocia.close();
                                            } else {
                                                scope.clearSelectionsAddAsoc();
                                            }
                                            if (view.type == 1)	// si etoy en el add asociacion del grid de areas
                                                scope.reloadAreas(); //recargando el grid de areas
                                            else
                                                model.stcentronivel.reload(); //recargando el grid de CCNAE

                                } else {
                                    mostrarMensaje(1, message)
                                        if (!isAplaing) { // si dio click en aceptar, cerrar la ventana
                                            view.winGestAsocia.close();
                                        } else {
                                            scope.clearSelectionsAddAsoc();
                                        }
                                }
                                break;
                            case 4:
                                mostrarMensaje(1, etiquetas.msgMissingElements);
                                break;
                            case 5:
                                var message = (responseData.errors.length > 1) ? etiquetas.msgPluralAsocFailed :
                                    (responseData.errors.length == 1 ? etiquetas.msgSingleAsocFailed : etiquetas.msgDefaultAsocFailed);
                                if (responseData.errors.length >= 1) {
                                    message += " " + etiquetas.msgError1 + " " + "<i>" + responseData.errors[0].centro + "</i>";
                                    if (responseData.errors.length > 1) {
                                        for (var i = 1; i < responseData.errors.length; i++)
                                            message += ", <i>" + responseData.errors[i].centro + "</i>";
                                    }
                                    message += ".";
                                }
                                mostrarMensaje(1, message)
                             
                                break;
                            default:
                                mostrarMensaje(1, etiquetas.msgDefaultError);
                                break;
                        }
                    }
                }
            });
        };

        /**
         * Funcion que elimina uno o mas ccnae
         */
        this.deleteCCNAE = function (ccnaeSelecteds, areasSelected) {
            var msgWait = ccnaeSelecteds.length > 1 ? etiquetas.msgWaitDelP : etiquetas.msgWaitDelS
            scope.loadMessageBox(msgWait);
            Ext.Ajax.request({
                method: "POST",
                url: "deleteCCNAE",
                params: {
                    ccnae: Ext.encode(ccnaeSelecteds),
                    area: Ext.encode(areasSelected)
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    if (!response.responseText) {
                        mostrarMensaje(1, etiquetas.msgDefaultError);
                    } else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code) {
                            case 1:
                                var message = (ccnaeSelecteds.length > 1) ? etiquetas.msgPluralCCNAE + etiquetas.msgPluralDeleteCCNAESuccess : etiquetas.msgSingleCCNAE + etiquetas.msgSingleDeleteCCNAESuccess;
                                model.stcentronivel.reload({
                                    callback: function (records, options, success) {
                                        if (records.length == 0) {
                                            model.stcentronivel.removeAll(); // esto es un cable para solucionar el proble de que el ultimoelemento no se borra
                                            view.gridCCNAE.body.unmask();
                                            scope.reloadAreas(
                                                function (records, options, success) {
                                                    if (records.length == 0) {
                                                        view.gridAreas.body.unmask();
                                                        mostrarMensaje(1, etiquetas.msgNoElements);
                                                    }
                                                    view.pCentros.collapse()
                                                }
                                            );
                                        } else {
                                            mostrarMensaje(1, message)
                                      }
                                        view.btnEliminarCCNAE.disable(); //ocultando el boton eliminar
                                        view.btnAdicionarCCNAE.enable(); //mostrando el boton adicionar
                                    }
                                });
                                break;
                            case 2:
                                var message = (responseData.errors.length > 1) ? etiquetas.msgPluralDeleteCCNAEFailed :
                                    (responseData.errors.length == 1 ? etiquetas.msgSingleDeleteCCNAEFailed : etiquetas.msgDefaultDeleteFailed)
                                message = message.replace('/area/', responseData.errors[0].area);
                                message += ":<br/><span style='margin-left:40px'>"
                                if (responseData.errors.length >= 1) {
                                    message += "<i>" + responseData.errors[0].centro + "</i>";
                                    if (responseData.errors.length > 1) {
                                        for (var i = 1; i < responseData.errors.length; i++)
                                            message += ",<i>" + responseData.errors[i].centro + "</i>";
                                    }
                                    message += ".</span>";
                                }
                                if (responseData.errors.length < ccnaeSelecteds.length) {
                                    var messageParcial = etiquetas.msgPluralCCNAE + etiquetas.msgPluralCCNAEDelParcialSuccess;
                                    mostrarMensaje(2, message)
                                } else {
                                    mostrarMensaje(2, message)
                                }
                                break;
                            case 4:
                                mostrarMensaje(1, etiquetas.msgMissingElements);
                                break;
                            default:
                                mostrarMensaje(1, etiquetas.msgDefaultError);
                                break;
                        }
                    }
                }
            });
        };
        /**
         * Funcion que devuelve las areas de responsibilidad que estan seleccionadas
         */
        this.getAreasSelected = function () {
            return view.treePanelAreas.getChecked();
        };
        /**
         * Funcion que devuelve las asociaciones que estan seleccionadas para el heredar
         */
        this.getAsocSelected = function () {
            return view.tpAsocPorAreas.getChecked();
        };
        /**
         * Funcion establece una mascara a tamanno de viewport
         */
        this.loadMask = function (msg) {
            this.mask = new Ext.LoadMask(Ext.getBody(), {
                msg: msg
            });
            this.mask.show();
        };
        /**
         * Funcion que muestra un mensaje personalizado
         */
        this.MsgPersonalizado = function (options) {
            Ext.Msg.show({
                title: options.title,
                buttons: options.buttons,
                msg: options.msg,
                icon: options.icon,
                fn: options.fn
            });
        };
        /**
         * Funcion que recarga el grid de Areas de Responsabilidad
         */
        this.reloadAreas = function (callback) {
            model.storeAreas.reload({
                callback: (callback) ? callback : function (records, options, success) {
                    if (records.length == 0) {
                        view.gridAreas.body.unmask();
                        mostrarMensaje(1, etiquetas.msgNoElements);
                    }
                }
            });
        };

        this.clearSelectionsAddAsoc = function () {
            if (view.type == 1) { // desmarcando las selecciones del tree areas
                var areasSelected = scope.getAreasSelected();
                if (areasSelected.length > 0) {
                    for (var i = 0; i < areasSelected.length; i++) {
                        areasSelected[i].getUI().toggleCheck(false);
                    }
                }
            }
            // obteniendo los centros seleccionados
            var ccnaeSelected = view.CCANE.fGetSelections();
            if (ccnaeSelected.length > 0) {
                for (var i = 0; i < ccnaeSelected.length; i++) {
                    ccnaeSelected[i].getUI().toggleCheck(false);
                }
            }
        };

        this.clearSelectionsExtend = function () {
            var selected = scope.getAsocSelected();
            if (selected.length > 0) {
                for (var i = 0; i < selected.length; i++) {
                    selected[i].getUI().toggleCheck(false);
                }
            }
        };
        /*** FUNCIONES ASOCIADAS A LA SELECCION Y DESELECCION DE VARIOS NODOS DE UN ARBOL ***/
        this.fGetCountNodes = function (node) {
            count = 0;
            node.cascade(function (n) {
                if (n.attributes.checked == true || n.attributes.checked == false)
                    count++;
            })
            return count;
        };
        this.fGetCountCheckedNodes = function (node, checked) {
            count = 0;
            node.cascade(function (n) {
                if (n.attributes.checked == checked)
                    count++;
            })
            return count;
        };
        this.fToggleCheck = function (node, checked) {
            node.cascade(function (n) {
                if (n.attributes.checked == true || n.attributes.checked == false)
                    n.getUI().toggleCheck(checked);
            });
        };

        this.replaceAll = function (cadena, str_buscar, str_reemplaza) {
            do {
                cadena = cadena.replace(str_buscar, str_reemplaza);
            }
            while (cadena.indexOf(str_buscar) >= 0);
            return cadena;
        };

    }
};
