
Ext.ns('Copa.Configuracion.CondicionPago');
Copa.Configuracion.CondicionPago.Controller = {
    init: function(perfil, etiquetas, view, model) {
        var scope = this;
        this.arrayValues = [];
        this.disabledKeyMap = false;
        this.cont = 0;

        this.oldDenominacion;
        this.oldPlazo;
        this.oldDpp;
        this.oldMora;

        Ext.Msg.wait('Cargando...', 'Por favor espere...');

        // esto le coloca el fondo verde a la cuenta definida para saldo de inicio
        view.grid.getView().getRowClass = function(record, index, rowParams, store) {
            if (record.json.usado) {
                return 'FilaVerde';
            }
        };

        /********* EVENTOS *********/
        new Ext.KeyMap(Ext.getDoc(), [{
                // ADICIONAR
                key: 'i',
                alt: true,
                fn: function() {
                    if (!view.btnAdicionar.disabled && !scope.disabledKeyMap) {
                        view.btnAdicionar.handler.call();
                    }
                }
            }, {
                // MODIFICAR
                key: 'm',
                alt: true,
                fn: function() {
                    if (!view.btnModificar.disabled && !scope.disabledKeyMap) {
                        view.btnModificar.handler.call();
                    }
                }
            }, {
                // BUSCAR
                key: 'b',
                alt: true,
                fn: function() {
                    Ext.EventObject.stopEvent();
                    if (!scope.disabledKeyMap) {
                        view.btnBuscar.handler.call();
                    }
                }
            }, {
                // ELIMINAR
                key: Ext.EventObject.DELETE,
                fn: function() {
                    if (!view.btnEliminar.disabled && view.smPayCondition.hasSelection() && !scope.disabledKeyMap) {
                        view.btnEliminar.handler.call();
                    }
                }
            }, {
                // //Activar
                key: 'x',
                alt: true,
                fn: function() {
                    if (!view.btnActivar.disabled && !scope.disabledKeyMap) {
                        Ext.EventObject.stopEvent();
                        view.btnActivar.handler.call();
                    }
                }
            }, {
                // Ayuda
                key: 'h',
                alt: true,
                fn: function() {
                    view.btnAyuda.handler.call();
                }
            }, {
                key: Ext.EventObject.TAB, //TAB
                fn: function() {
                    if(document.activeElement.tabIndex == 106)
                        view.tfDenominacion.focus(true, 10);
                }
            }, {
                key: Ext.EventObject.TAB, //TAB
                shift: true,
                fn: function() {
                    if(document.activeElement.tabIndex == 100)
                        view.btnAceptar.focus(true);
                }
            }
        ]);
//        model.payConditionStore.on({
//            beforeload: function() {
//                if(scope.cont !== 0)
//                    scope.MostrarMascara('Cargando...');
//            }
//        });
        model.payConditionStore.on({
            load: function(store, records, options) {
                if (records.length === 0) {
                    var message = (model.payConditionStore.baseParams.denominacion != '-1'
                            || model.payConditionStore.baseParams.plazo != '-1'
                            || model.payConditionStore.baseParams.iva != '-1') ? etiquetas.msgNoElementSearch : etiquetas.noPayConditions;
                    view.grid.body.unmask();
//                    scope.notifyEvent(view.grid.body.dom, etiquetas.titleInfo, message, 1, 3000);
                    mostrarMensaje(1, etiquetas.msgNoElementSearch);
                }
                else {
                    view.smPayCondition.selectFirstRow();
                }
                scope.cont++;
                Ext.Msg.hide();
                view.btnAdicionar.focus();
            }
        });

        /*view.windows.on('close', function() {
            //view.btnAdicionar.focus();
        });*/

        view.btnAdicionar.setHandler(function() {
            scope.ClickAddPayConditionAction();
        });
        view.btnModificar.setHandler(function() {
            scope.ClickModifyPayConditionAction();
        });
        view.btnBuscar.setHandler(function() {
            scope.ClickSearchPayConditionAction();
        });
        view.btnEliminar.setHandler(function() {
            scope.ClickDeletePayConditionAction();
        });
        view.btnActivar.setHandler(function() {
            scope.ClickActivePayConditionAction();
        });
        /*view.btnAyuda.setHandler(function() {
            scope.EventosAyuda();
        });*/
        
        // Linares empieza aqui
        
        view.btnPrueba.setHandler(function() {
            scope.ferst = true;
            scope.pruebaAction();
        });
        
        this.pruebaAction = function() {
            view.Prueba(etiquetas);
            view.windowsPrueba.on({
                beforeshow: function() {
                    scope.crearTabPanelInicial();
                    scope.eventosPrueba();
                }
            });
            view.windowsPrueba.show();
        };
        
        this.eventosPrueba = function() {
            view.chDiaFijo.on('check', function(ch, checked){
                if(checked) 
                    view.dfDia.show();
                else
                    view.dfDia.hide();
            });
            
            view.chPlazo.on('check', function(ch, checked) {
                var tabPlazo = scope.crearTabs(checked);
                if(checked) {
                    view.panel2.getComponent(0).add(tabPlazo);
                    view.panel2.getComponent(0).remove(view.panel2.getComponent(0).getComponent(0), true);
                    view.fsDescuento.disable();
                }
                else {
                    view.panel2.getComponent(0).add(tabPlazo);
                    view.panel2.getComponent(0).remove(view.panel2.getComponent(0).getComponent(0), true);
                    view.fsDescuento.enable();
                }
            });
            
            view.btnCancelarPrueba.on('click', function() {
                view.windowsPrueba.close();
            });
        };
        
        this.crearTabPanelInicial = function() {
            var tabs2 = scope.crearTabPanel();
            var tabMora = scope.crearTabs(false);
            tabs2.add(tabMora);
            view.panel2.add(tabs2);
            tabs2.setActiveTab(tabMora);
        };
        
        this.crearTabPanel = function() {
            this.tabs2 = new Ext.TabPanel({
                autoHeight: true,
                defaults: {autoScroll: true}
            });
            return this.tabs2;
        };
        
        this.crearTabs = function(check) {
            var smPayConditionPrueba = new Ext.grid.RowSelectionModel({
                singleSelect: false
            });
            if (check) {

                this.gpPlazo = new Ext.grid.GridPanel({
                    title: 'Cuotas',
                    layout: 'fit',
                    border: false,
                    autoExpandColumn: 'prcentaje',
                    store: model.payConditionStore,
                    sm: smPayConditionPrueba,
                    columns: [
                        {
                            id: 'cuota',
                            header: 'Cuota', //etiquetas.lbColumCuotaPlazo,
                            dataIndex: 'cuota',
                            width: 200,
                            sortable: true,
                            align: 'center'
                        }, {
                            id: 'condicionaplicar',
                            header: 'Condici&oacute;n de pago', //etiquetas.lbColumCondicionPlazo,
                            dataIndex: 'condicionaplicar',
                            width: 200,
                            sortable: true,
                            align: 'left'
                        }, {
                            id: 'prcentaje',
                            header: 'Porcentaje', //etiquetas.lbColumPorcentajePlazo,
                            dataIndex: 'prcentaje',
                            width: 250,
                            align: 'left',
                            sortable: true
                        }/*, {
                            id: 'eliminarP',
                            dataIndex: 'eliminarP',
                            width: 40,
                            sortable: true,
                            align: 'center',
                            renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                return "<img id = 'imgPlazo" + rowIndex + "' style='margin-right:10px;' class ='modRec' src='" + perfil.dirImg + 'eliminar.png' + "' alt='Eliminar'/>";
                            }
                        }*/
                    ]
                });
                return this.gpPlazo;
            }
            else if(scope.ferst || !check) {
                this.gpMora = new Ext.grid.GridPanel({
                    title: 'Moras',
                    layout: 'fit',
                    border: false,
                    //height: 200,
                    autoExpandColumn: 'aplicabledespues',
                    store: model.payConditionStore,
                    sm: smPayConditionPrueba,
                    columns: [
                        {
                            id: 'numero',
                            header: 'N&uacute;mero', //etiquetas.lbColumNumMora,
                            dataIndex: 'numero',
                            width: 100,
                            sortable: true,
                            align: 'center'
                        }, {
                            id: 'prcentaje',
                            header: 'Porcentaje', //etiquetas.lbColumPorcentajeMora,
                            dataIndex: 'prcentaje',
                            width: 250,
                            align: 'left',
                            sortable: true
                        }, {
                            id: 'aplicabledespues',
                            header: 'Aplicable despu&eacute;s', //etiquetas.lbColumAplicableDespuesMora,
                            dataIndex: 'aplicabledespues',
                            width: 140,
                            sortable: true,
                            align: 'left'
                        }/*, {
                         id: 'eliminarM',
                         dataIndex: 'eliminarM',
                         width: 40,
                         sortable: true,
                         align: 'center',
                         renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                         return "<img id = 'imgMora" + rowIndex + "' style='margin-right:10px;' class ='modRec' src='" + perfil.dirImg + 'eliminar.png' + "' alt='Eliminar'/>";
                         }
                         }*/
                    ]
                    //tbar: [this.btnAdicionarMor]
                });
                scope.ferst = false;
                return this.gpMora;
            }
        };
        
        ////////////////////////////////////////////////////////////////

        this.EventosAyuda = function() {
            var title = 'Mostrar ayuda de la funcionalidad';
            var referencia = 'copa/config/condiciones_generales';
            help.show(title, referencia);
        };

        this.ClickAddPayConditionAction = function() {
            scope.WindowsFactory('add');
        };
        this.ClickModifyPayConditionAction = function() {
            scope.WindowsFactory('modify');
        };
        this.ClickSearchPayConditionAction = function() {
            scope.WindowsFactory('search');
        };
        this.ClickDeletePayConditionAction = function() {
            var selected = scope.getSelectionsOnPaging();
            if (selected.length > 0) {
                var mensaje = (selected.length > 1) ? etiquetas.msgConfirmDeletePlural : etiquetas.msgConfirmDelete;
                msgDel = (selected.length > 1) ? 'Eliminando datos de las condiciones de pago.' : 'Eliminando datos de la condici\xF3n de pago.';
                scope.disabledKeyMap = true;
                mostrarMensaje(2, mensaje, function(btnPress)  {
                    if (btnPress === 'ok') {
                        scope.DeletePayCondition(selected);
                        view.btnAdicionar.focus();
                    }
                    scope.disabledKeyMap = false;
                    view.btnAdicionar.focus();
                });
            } else {
                scope.disabledKeyMap = true;
                mostrarMensaje(3, etiquetas.msgNoSecuenceSelected, function() {
                    scope.disabledKeyMap = false;
                });
            }
        };

        this.ClickActivePayConditionAction = function() {
            var selected = view.smPayCondition.getSelected();
            scope.disabledKeyMap = true;
            mostrarMensaje(2, etiquetas.msgConfirmActive.replace("<#>", selected.json.denominacion), function(btnPress) {
                if (btnPress === 'ok') {
                    scope.ActivePayCondition(selected);
                    view.btnAdicionar.focus();
                }
                scope.disabledKeyMap = false;
                view.btnAdicionar.focus();
            });
        };

        view.grid.on({
            rowcontextmenu: function(grid, rowIndex, eventObject) {
                eventObject.stopEvent();
                var record = model.payConditionStore.getAt(rowIndex);
                var showMenu = false;
                if (record.json.activo === '0') {
                    view.menuItemActivar.show();
                } else {
                    view.menuItemActivar.hide();
                }
                if (!record.json.usado) {
                    view.menuItemModificar.show();
                    view.menuItemEliminar.show();
                } else {
                    view.menuItemModificar.hide();
                    view.menuItemEliminar.hide();
                }
                if (!view.menuItemActivar.hidden || !view.menuItemModificar.hidden || !view.menuItemEliminar.hidden) {
                    this.getSelectionModel().clearSelections();
                    this.getSelectionModel().selectRow(rowIndex);
                    view.menuContextual.showAt(eventObject.getXY());
                } else {
                    view.menuContextual.hide();
                }
            }
        });

        view.menuItemActivar.on('click', function() {
            scope.ClickActivePayConditionAction();
        });
        view.menuItemEliminar.on('click', function() {
            scope.ClickDeletePayConditionAction();
        });
        view.menuItemModificar.on('click', function() {
            scope.ClickModifyPayConditionAction();
        });

        view.paginToolbar.on({
            beforechange: function() {
                var instance = new PagingToolbarSelections({
                    'selections': view.smPayCondition.getSelections(),
                    'activePage': this.getPageData().activePage
                });
                instance.saveSelectionsOnPage(scope.arrayValues);
            },
            change: function() {
                var instance = new PagingToolbarSelections({
                    'activePage': this.getPageData().activePage
                });
                instance.setSelectionsOnPage(scope.arrayValues, view.grid);
            }
        });

        this.getSelectionsOnPaging = function() {
            var instance = new PagingToolbarSelections({
                'selections': view.grid.getSelectionModel().getSelections(),
                'activePage': view.grid.getBottomToolbar().getPageData().activePage
            });
            return instance.getSelectionsOnArray(scope.arrayValues);
        };

        view.smPayCondition.on({
            rowselect: function(smodel, rowIndex, record) {
                scope.rowClickAction();
                view.grid.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function(smodel, rowIndex, record) {
                scope.rowClickAction();
                view.grid.getView().removeRowClass(rowIndex, "negrita");
            }
        });

        this.rowClickAction = function() {
            var selection = scope.getSelectionsOnPaging();
            if (selection.length > 0) { // si existe seleccion
                if (selection.length > 1) {
                    var hasDiferentState = scope.hasDiferentState(selection);
                    if (hasDiferentState) {
                        scope.setStateButtons(false, true, true, false); // desabilito todos menos ver
                    } else {
                        if (!selection[0].usado) {
                            view.btnEliminar.enable();
                        }
                        scope.setStateButtons(false, false, true, false); // desabilito todos menos ver y eliminar
                    }
                } else {
                    if (selection[0].usado) {
                        scope.setStateButtons(false, true, false, false); // desabilito todos menos activar y ver
                    } else {
                        scope.setStateButtons(true, true, false, false); // habilito el modificar y eliminar
                    }
                    if (selection[0].activo === '0') {
                        view.btnActivar.enable(); // habilito solo el activar
                    } else {
                        view.btnActivar.disable();
                    }
                }
                view.btnVer.enable(); // siempre que se seleccionar se activa
            } else {
                scope.setStateButtons(false, true, true, true); // desabilito todos
            }
        };

        this.PayConditionEvents = function(action) {
            /* eventos comunes a las tres acciones (adicionar, modificar, buscar) */
            view.btnCancelar.on({
                click: function() {
                    (action === 'add' || action === 'modify') ? view.windows.close() : scope.clearSearch();
                }
            });
            view.btnAceptar.on({
                click: function() {
                    (action === 'add' || action === 'modify') ? scope.AddModifyPC(action) : scope.Search();
                },
                /*enable: function(cmp){
                    this.focus();
                },
                disable: function(cmp){
                    view.btnCancelar.focus();
                },*/
            });
            view.btnAplicar.on({
                click: function() {
                    scope.AddModifyPC(action, true);
                }
            });
            view.tfplazo.on({
                keypress: function(field, e) {
                    if (e.getKey() !== 8 && e.getKey() !== 46) { // Para que permita borrar
                        var value = new String(this.getValue());
                        if (value.charAt(0) === '0')
                            e.stopEvent();  // Para que no escriba ceros a las izquierda
                    }
                    if (e.getKey() === e.ENTER && view.panelGest.getForm().isValid()) {
                        if (action === 'add' || action === 'modify') {
                            /* hacer la llamada al adicionar | modificar */
                            scope.AddModifyPC(action);
                        } else {
                            scope.Search();
                        }
                    }
                },
                keyup: function(field, e) {
                    if (!isNaN(this.getValue()) && this.getValue().length)
                        scope.Sinceros('plazo');

                    if ((this.getValue().length > 0 || !Ext.isEmpty(view.tfDenominacion.getValue()) || !Ext.isEmpty(view.tfdescuento.getValue()) || !Ext.isEmpty(view.tfmora.getValue())) && view.panelGest.getForm().isValid()) {
                        if (action === 'modify')
                            if (scope.oldPlazo != this.getValue())
                                view.btnAceptar.enable();
                            else
                                view.btnAceptar.disable();
                        else {
                            view.btnAceptar.enable();
                            if (view.btnAplicar.rendered)
                                view.btnAplicar.enable();
                        }
                    } else {
                        view.btnAceptar.disable();
                        if (view.btnAplicar.rendered)
                            view.btnAplicar.disable();
                    }


                },
                blur: function(textfield, e) {
                    if (!isNaN(this.getValue()) && this.getValue().length)
                        scope.Sinceros('plazo');
                }
            });
            view.tfdescuento.on({
                blur: function(textfield) {
                    if (action === 'add' || action === 'modify') {
                        this.setValue(scope.ConvertirSaldo(this.getValue()));
                    } else {
                        this.setValue(scope.ConvertirSaldo(this.getValue(), true));
                    }
                },
                keyup: function(field, e) {
                    if ((this.getValue().length > 0 || !Ext.isEmpty(view.tfDenominacion.getValue()) || !Ext.isEmpty(view.tfplazo.getValue()) || !Ext.isEmpty(view.tfmora.getValue())) && view.panelGest.getForm().isValid()) {
                        if (action === 'modify')
                            if (scope.oldDpp != this.getValue())
                                view.btnAceptar.enable();
                            else
                                view.btnAceptar.disable();
                        else {
                            view.btnAceptar.enable();
                            if (view.btnAplicar.rendered)
                                view.btnAplicar.enable();
                        }
                    } else {
                        view.btnAceptar.disable();
                        if (view.btnAplicar.rendered)
                            view.btnAplicar.disable();
                    }
                },
                keypress: function(field, e) {
                    if (e.getKey() === e.ENTER && view.panelGest.getForm().isValid()) {
                        if (action === 'add' || action === 'modify') {
                            /* hacer la llamada al adicionar | modificar */
                            scope.AddModifyPC(action);
                        } else {
                            scope.Search();
                        }
                    }
                }
            });
            view.tfmora.on({
                blur: function(textfield) {
                    if (action === 'add' || action === 'modify') {
                        this.setValue(scope.ConvertirSaldo(this.getValue()));
                    } else {
                        this.setValue(scope.ConvertirSaldo(this.getValue(), true));
                    }
                },
                keyup: function(field, e) {
                    if ((this.getValue().length > 0 || !Ext.isEmpty(view.tfDenominacion.getValue()) || !Ext.isEmpty(view.tfplazo.getValue()) || !Ext.isEmpty(view.tfdescuento.getValue())) && view.panelGest.getForm().isValid()) {
                        if (action === 'modify')
                            if (scope.oldMora != this.getValue())
                                view.btnAceptar.enable();
                            else
                                view.btnAceptar.disable();
                        else {
                            view.btnAceptar.enable();
                            if (view.btnAplicar.rendered)
                                view.btnAplicar.enable();
                        }
                    } else {
                        view.btnAceptar.disable();
                        if (view.btnAplicar.rendered)
                            view.btnAplicar.disable();
                    }
                },
                keypress: function(field, e) {
                    if (e.getKey() === e.ENTER && view.panelGest.getForm().isValid()) {
                        if (action === 'add' || action === 'modify') {
                            /* hacer la llamada al adicionar | modificar */
                            scope.AddModifyPC(action);
                        } else {
                            scope.Search();
                        }
                    }
                }
            });
            view.tfDenominacion.on({
                keyup: function(field, e) {
                    if ((this.getValue().length > 0 || !Ext.isEmpty(view.tfmora.getValue()) || !Ext.isEmpty(view.tfplazo.getValue()) || !Ext.isEmpty(view.tfdescuento.getValue())) && view.panelGest.getForm().isValid()) {
                        if (action === 'modify')
                            if (scope.oldDenominacion != this.getValue())
                                view.btnAceptar.enable();
                            else
                                view.btnAceptar.disable();
                        else {
                            view.btnAceptar.enable();
                            if (view.btnAplicar.rendered)
                                view.btnAplicar.enable();
                        }
                    } else {
                        view.btnAceptar.disable();
                        if (view.btnAplicar.rendered)
                            view.btnAplicar.disable();
                    }
                },
                keypress: function(field, e) {
                    if (e.getKey() === e.ENTER && view.panelGest.getForm().isValid()) {
                        if (action === 'add' || action === 'modify') {
                            /* hacer la llamada al adicionar | modificar */
                            scope.AddModifyPC(action);
                        } else {
                            scope.Search();
                        }
                    }
                }
            });
        };

        this.hasSelectionOperable = function(selected) {
            var response = true;
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].json.usado) {
                    response = false;
                    break;
                }
            }
            return response;
        };

        this.hasDiferentState = function(selected) {
            var first = selected[0].usado;
            var response = false;
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].usado !== first) {
                    response = true;
                    break;
                }
            }
            return response;
        };

        this.WindowsFactory = function(action) {
            scope.MostrarMascara(etiquetas.msgLoading);
            view.BuildWindows(etiquetas, action);
            view.windows.on({
                beforeshow: function(windows) {
                    scope.disabledKeyMap = true;
                    scope.PayConditionEvents(action);
                    /* esto es para mantener los criterios de busqueda en el formulario*/
                    if (action === 'search') {
                        (model.payConditionStore.baseParams.denominacion && model.payConditionStore.baseParams.denominacion != '-1') ? view.tfDenominacion.setValue(model.payConditionStore.baseParams.denominacion) : view.tfDenominacion.reset();
                        (model.payConditionStore.baseParams.plazo && model.payConditionStore.baseParams.plazo != '-1') ? view.tfplazo.setValue(model.payConditionStore.baseParams.plazo) : view.tfplazo.reset();
                        (model.payConditionStore.baseParams.descuento && model.payConditionStore.baseParams.descuento != '-1') ? view.tfdescuento.setValue(model.payConditionStore.baseParams.descuento) : view.tfdescuento.reset();
                        (model.payConditionStore.baseParams.mora && model.payConditionStore.baseParams.mora != '-1') ? view.tfmora.setValue(model.payConditionStore.baseParams.mora) : view.tfmora.reset();
                    }
                    else if (action === 'modify') {
                        if (view.smPayCondition.hasSelection()) {
                            var selected = view.smPayCondition.getSelected();
                            view.hnid.setValue(selected.json.idcondicionpago);
                            
                            var prueba = selected.json.denominacion.split('<span style="background-color: rgb(255, 255, 0);">');
                            if (prueba.length > 1) {
                                var cuentaValue = prueba[1].split('</span>');
                                view.tfDenominacion.setValue(cuentaValue[0] + cuentaValue[1]);
                                scope.oldDenominacion = cuentaValue[0] + cuentaValue[1];
                            } else {
                                view.tfDenominacion.setValue(selected.json.denominacion);
                                scope.oldDenominacion = selected.json.denominacion;
                            }
                            
                            view.tfplazo.setValue(selected.json.plazo);
                            scope.oldPlazo = selected.json.plazo;

                            view.tfdescuento.setValue(selected.json.dpp);
                            scope.oldDpp = selected.json.dpp;

                            view.tfmora.setValue(selected.json.mora);
                            scope.oldMora = selected.json.mora;
                        }
                    } else {
                        view.panelGest.getForm().reset();
                    }
                    
                },
                close: function(windows) {
                    scope.disabledKeyMap = false;
                    view.btnAdicionar.focus();
                }
            });
            view.windows.show();
            view.tfDenominacion.focus(true, 100);
            loadMask.hide();
        };

        this.AddModifyPC = function(action, isAplaying) {
            if (view.panelGest.getForm().isValid()) {
                var msg = (action === 'add') ? etiquetas.msgAddWait : ((action === 'modify') ? etiquetas.msgModifyWait : etiquetas.msgWait);
                //scope.MostrarMascara(msg);
                Ext.Msg.wait('Guardando datos de la condici\xF3n de pago.', 'Por favor espere...');
                Ext.Ajax.request({
                    url: 'registerPayCondition',
                    method: 'POST',
                    params: {
                        idcondicionpago: (!Ext.isEmpty(view.hnid.getValue())) ? view.hnid.getValue() : '-1',
                        denominacion: view.tfDenominacion.getValue(),
                        plazo: view.tfplazo.getValue(),
                        dpp: view.tfdescuento.getValue(),
                        mora: view.tfmora.getValue()
                    },
                    callback: function(options, success, response) {
                        //loadMask.hide();
                        Ext.Msg.hide();
                        if (!response.responseText) {
                            scope.disabledKeyMap = true;
                            mostrarMensaje(3, etiquetas.msgDefaultError, function() {
                                scope.disabledKeyMap = false;
                                view.btnAdicionar.focus();
                            });
                        } else {
                            var responseData = Ext.decode(response.responseText);
                            switch (responseData.code)
                            {
                                case 1:
                                    var mensaje = (action === 'add') ? etiquetas.msgAddSuccess : etiquetas.msgModifySuccess;
                                    if (isAplaying) {
                                        scope.resetFormAddModSearch();
                                        scope.reloadPayConditions(true, function() {
                                            scope.disabledKeyMap = true;
                                            mostrarMensaje(1, mensaje);
                                            if (!view.windows.rendered)
                                                scope.disabledKeyMap = false;
                                            view.btnAdicionar.focus();
                                        });
                                    } else {
                                        scope.resetFormAddModSearch();
                                        view.windows.close();
                                        scope.reloadPayConditions(true, function() {
                                            scope.disabledKeyMap = true;
                                            mostrarMensaje(1, mensaje);
                                            view.btnAdicionar.focus();
                                            scope.disabledKeyMap = false;
                                        });
                                    }
                                    break;
                                case 2:
                                    var mensaje = (action === 'add') ? etiquetas.msgDefaultAddFailed : etiquetas.msgDefaultModFailed;
                                    scope.disabledKeyMap = true;
                                    mostrarMensaje(3, etiquetas.msgDefaultError, function(btn) {
                                        scope.disabledKeyMap = false;
                                        view.btnAdicionar.focus();
                                    });
                                    break;
                                case 3:
                                    scope.disabledKeyMap = true;
                                    mostrarMensaje(3, etiquetas.msgErrorDataToSend, function(btn) {
                                        scope.disabledKeyMap = false;
                                        view.btnAdicionar.focus();
                                    });
                                    break;
                                case 4:
                                    scope.disabledKeyMap = true;
                                    var mensaje = etiquetas.msgDenAlreadyExist.replace('<#>', responseData.errors[0].denominacion);
                                    mostrarMensaje(1, mensaje);
                                        scope.disabledKeyMap = false;
                                        view.tfDenominacion.focus(true, true);
                                    break;
                                case 5:
                                    var condition = '<b>' + etiquetas.lbPlazo.toLowerCase() + ' = ' + responseData.errors[0].plazo + '</b>' + ', ' +
                                            '<b>' + etiquetas.lbDescuento.toLowerCase() + ' = ' + responseData.errors[0].descuento + '</b>' + ' y ' +
                                            '<b>' + etiquetas.lbMora.toLowerCase() + ' = ' + responseData.errors[0].mora + '</b>';
                                    scope.disabledKeyMap = true;
                                    mostrarMensaje(1, etiquetas.msgDataAlreadyExist.replace('<#condicion>', condition), function(btn) {
                                        scope.disabledKeyMap = false;
                                        view.tfplazo.focus(true, true);
                                    });
                                    break;
                                default:
                                    scope.disabledKeyMap = true;
                                    mostrarMensaje(3, etiquetas.msgDefaultError, function(btn) {
                                        scope.disabledKeyMap = false;
                                        view.btnAdicionar.focus();
                                    });
                                    break;
                            }
                        }
                    }
                });
            } else {
                scope.disabledKeyMap = true;
                mostrarMensaje(3, etiquetas.msgInvalidForm, function(btn) {
                    scope.disabledKeyMap = false;
                    view.btnAdicionar.focus();
                });
            }
        };

        this.DeletePayCondition = function(selecteds) {
            var arrayId = [];
            for(var i = 0; i < selecteds.length; i ++)
                arrayId.push(selecteds[i].idcondicionpago);
            Ext.Msg.wait(msgDel, 'Por favor espere...');
            Ext.Ajax.request({
                url: 'deletePayCondition',
                method: 'POST',
                params: {
//                    condiciones: Ext.encode(selecteds)
                    condiciones: Ext.encode(arrayId)
                },
                callback: function(options, success, response) {
                    //loadMask.hide();
                    if (!response.responseText) {
                        scope.disabledKeyMap = true;
                        mostrarMensaje(3, etiquetas.msgDefaultError, function() {
                            scope.disabledKeyMap = false;
                            view.btnAdicionar.focus();
                        });
                    } else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code) {
                            case 1:
                                var mensaje = (selecteds.length === 1) ? etiquetas.msgDelSuccess : etiquetas.msgDelSuccessPlural;
                                scope.reloadPayConditions(true, function() {
                                    scope.disabledKeyMap = true;
                                    mostrarMensaje(1, mensaje);
                                    view.btnAdicionar.focus();
                                    scope.disabledKeyMap = false;
                                });
                                break;
                            case 2:
                                if (responseData.errors.length >= 1) { // si hubo algun error
                                    var errores = [];
                                    for (var i = 0; i < responseData.errors.length; i++) {
                                        errores.push(responseData.errors[i].condicion);
                                    }
                                    var mensaje = (responseData.errors.length === 1) ? etiquetas.msgDefaultDelFailed.replace("<#condiciones>", errores.join(',')) : etiquetas.msgDefaultDelFailedPlural.replace("<#condiciones>", errores.join(','));
                                }
                                //scope.notifyEvent(view.grid.body.dom, etiquetas.titleError, mensaje, 2, 3000);
                                scope.disabledKeyMap = true;
                                mostrarMensaje(3, mensaje, function() {
                                    scope.disabledKeyMap = false;
                                    view.btnAdicionar.focus();
                                });
                                break;
                            default:
                                //scope.notifyEvent(view.grid.body.dom, etiquetas.titleError, etiquetas.msgDefaultError, 2, 3000);
                                scope.disabledKeyMap = true;
                                mostrarMensaje(3, etiquetas.msgDefaultError, function() {
                                    scope.disabledKeyMap = false;
                                    view.btnAdicionar.focus();
                                });
                                break;
                        }
                    }
                }
            });
        };

        this.resetFormAddModSearch = function() {
            view.panelGest.getForm().reset();
            view.btnAceptar.disable();
            view.btnAplicar.disable();
        };

        this.reloadPayConditions = function(disableButtons, callback) {
            model.payConditionStore.reload({
                callback: (callback) ? callback : Ext.emptyFn
            });
            if (disableButtons) {
                scope.setStateButtons(false, true, true, true); // desabilitar todos los botones
            }
        };

        this.ActivePayCondition = function(selected) {
            /* Mostrar una mascara aqui */
            Ext.Msg.wait('Predeterminando la condici&oacute;n general.', 'Por favor espere...');
            Ext.Ajax.request({
                url: 'activePayCondition',
                method: 'POST',
                params: {
                    idcondicionpago: selected.json.idcondicionpago,
                    denominacion: selected.json.denominacion
                },
                callback: function(options, success, response) {
                    //loadMask.hide();
                    Ext.Msg.hide();
                    if (!response.responseText) {
                        scope.disabledKeyMap = true;
                        // mostrarMensaje(3, etiquetas.msgDefaultError, function() {
                        //     scope.disabledKeyMap = false;
                        // });
                        mostrarMensaje(1, mensaje, function(btnPress)  {
                            if (btnPress === 'yes') {
                                scope.DeletePayCondition(selected);
                                view.btnAdicionar.focus();
                            }
                            scope.disabledKeyMap = false;
                            view.btnAdicionar.focus();
                        });
                    } else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code) {
                            case 1:
                                scope.reloadPayConditions(true, function() {
                                    scope.disabledKeyMap = true;
                                    /*mostrarMensaje(2, etiquetas.msgActiveSuccess.replace("<#>", responseData.success[0].denominacion), function() {
                                     scope.disabledKeyMap = false;
                                     });*/
                                    scope.disabledKeyMap = false;
                                    mostrarMensaje(2, etiquetas.msgActiveSuccess.replace("<#>", responseData.success[0].denominacion));
                                });
                                break;
                            case 2:
                                scope.disabledKeyMap = true;
                                mostrarMensaje(3, etiquetas.msgDefaultError);
                                break;
                            default:
                                scope.disabledKeyMap = true;
                                mostrarMensaje(3, etiquetas.msgDefaultError);
                                scope.disabledKeyMap = false;
                                break;
                        }
                    }
                }
            });
        };

        this.Search = function() {
            /* Implementar */
            model.payConditionStore.baseParams.start = '';
            model.payConditionStore.baseParams.denominacion = !Ext.isEmpty(view.tfDenominacion.getValue()) ? view.tfDenominacion.getValue() : '-1';
            model.payConditionStore.baseParams.plazo = !Ext.isEmpty(view.tfplazo.getValue()) ? view.tfplazo.getValue() : '-1';
            model.payConditionStore.baseParams.descuento = !Ext.isEmpty(view.tfdescuento.getValue()) ? view.tfdescuento.getValue() : '-1';
            model.payConditionStore.baseParams.mora = !Ext.isEmpty(view.tfmora.getValue()) ? view.tfmora.getValue() : '-1';
            scope.reloadPayConditions(true, function() {
                view.windows.close();
            });
        };

        this.clearSearch = function() {
            model.payConditionStore.baseParams = {};
            scope.reloadPayConditions(true, function() {
                view.windows.close();
            });
        };

        /****************************FUNCIONES AUXILIARES**********************************/

        /*
         * enable: true - Se habilitan los botones
         * enable: false - Se deshabilitan los botones
         * applyToBtnVer: Define si la accion se aplica al boton Ver
         * applyToBtnActivar: Define si la accion se aplica al boton Aplicar
         */
        this.setStateButtons = function(enable, applyToBtnEliminar, applyToBtnActivar, applyToBtnVer) {
            (enable) ? view.btnModificar.enable() : view.btnModificar.disable();
            if (applyToBtnEliminar) {
                (enable) ? view.btnEliminar.enable() : view.btnEliminar.disable();
            }
            if (applyToBtnActivar) {
                (enable) ? view.btnActivar.enable() : view.btnActivar.disable();
            }
            if (applyToBtnVer) {
                (enable) ? view.btnVer.enable() : view.btnVer.disable();
            }
        };

        this.ConvertirSaldo = function(v, searching) {
            if (v == '' || isNaN(v)) {
                if (searching) /* esto es para controlar el evento blur para la accion buscar */
                    return;
                return '0.00';
            }
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v < 0) ? v * (-1) : v;
            return v.toFixed(2);
        };

        this.Sinceros = function(option) {
            if (option == 0)
                return;
            else
                switch (option) {
                    case 'mora':
                        view.tfmora.setValue(parseInt(view.tfmora.getValue(), 10));
                        break;
                    case 'dpp':
                        view.tfdescuento.setValue(parseInt(view.tfdescuento.getValue(), 10));
                        break;
                    case 'plazo':
                        view.tfplazo.setValue(parseInt(view.tfplazo.getValue(), 10));
                        break;
                    default:
                        break;
                }
        };

        /**
         * Funcion que muestra un mensaje personalizado
         */
        this.MsgPersonalizado = function(options) {
            Ext.Msg.show({
                title: (options.title) ? options.title : etiquetas.titleInfo,
                buttons: (options.buttons) ? options.buttons : Ext.Msg.OK,
                msg: (options.msg) ? options.msg : '',
                icon: (options.icon) ? options.icon : Ext.Msg.INFO,
                fn: (options.fn) ? options.fn : Ext.emptyFn
            });
        };

        /**
         * Funcion que coloca una mascara
         */
        this.MostrarMascara = function(mensaje) {
            loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };

        /**
         * Funcion que muestra una notifico
         */
        this.notifyEvent = function(animateTarget, title, msg, icon, time, callback) {
            this.notification = new Ext.Cont.Notification({
                animateTarget: animateTarget,
                fnc: (callback) ? callback : Ext.emptyFn,
                iconbox: icon,
                iconCls: "icon-waiting",
                title: title,
                html: msg,
                hideDelay: (time) ? time : 5000
            });
            this.notification.box();
        };
    }
};