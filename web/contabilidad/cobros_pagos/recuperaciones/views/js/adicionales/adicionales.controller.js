//Empaquetando el componente tipo Reportes.
Ext.ns('Copa.Reportes');

Copa.Reportes.Controller = {
    /**
     * @param etiquetas Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param view Vista del componente Copa.Reportes
     * @param model Modelo de la vista del componente Copa.Reportes
     */
    init: function (etiquetas, view, model) {
        var scope = this;
        this.busyRequest = {};
        this.visible = false;
        this.componet;

        /* Teclas calientes */
        this.hotKeys = new Ext.KeyMap(Ext.getDoc(), [
            {
                // Ayuda
                key: 'h',
                alt: true,
                fn: function () {
                    view.btnAyuda.handler.call();
                },
                scope: scope
            },
            {
                // Ayuda
                key: 'r',
                alt: true,
                fn: function () {
                    if (scope.visible)
                        scope.fOpenWindowReport();
                },
                scope: scope
            },
            {
                key: Ext.EventObject.TAB, //TAB
                fn: function () {
                    if (document.activeElement.tabIndex == 104)
                        scope.component.cbxTipoHoja.focus(true, 10);
                }
            }, {
                key: Ext.EventObject.TAB, //TAB
                shift: true,
                fn: function () {
                    if (document.activeElement.tabIndex == 100)
                        scope.component.buttons[1].focus();
                }
            }
        ]);

        this.lMask = function (mensaje) {
            loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };
        //this.lMask(etiquetas.lbCargando);
        Ext.Msg.wait('Cargando...', 'Por favor espere...');

        Ext.Ajax.request({
            method: "POST",
            url: "loadDataComponent",
            callback: function (options, success, response) {
                view.responseData = Ext.decode(response.responseText);

                if (view.responseData.Entidades.datos.length > 0)
                    Ext.getCmp('gpEntidad').getStore().loadData(view.responseData.Entidades);
                if (view.responseData.Ejercicios.datos.length > 0)
                    Ext.getCmp('gpEjercicio').getStore().loadData(view.responseData.Ejercicios);
                if (view.responseData.Periodos.datos.length > 0)
                    Ext.getCmp('gpPeriodo').getStore().loadData(view.responseData.Periodos);

                scope.fAddReports();
                //loadMask.hide();
                Ext.Msg.hide();
            }
        });

        view.btnVerDetalles.setHandler(function () {
            view.stGestionarDuo.removeAll();
            // view.ventanaVerDetalles.setTitle('Desglose del balance total de la cuenta ' + view.cbCuenta.getRawValue());
            view.ventanaVerDetalles.setTitle('Desglose del balance');
            view.ventanaVerDetalles.show();
            var idreporte = view.cbReportes.getValue();
            var params = scope.getParams(idreporte);
            var filas = view.smDatosReporte.getSelections();
            var clientes = new Array();
            for (var i = 0; i < filas.length; i++) {
                clientes.push(filas[i].data.idcliente);
            }
            params.clientes = Ext.encode(clientes);
            view.stGestionarDuo.load({
                params: params
            });
            //Renombrando columna
            var colummIndex = view.gpGestionarDuo.getColumnModel().getIndexById('IdColFechaentrega');
            if (idreporte == '80003' || idreporte == '80004') {//Cuenta por cobrar/pagar
                /*if (idreporte == '80004')//Cuenta por cobrar
                    view.gpGestionarDuo.getColumnModel().setColumnHeader(colummIndex, 'Fecha recepción');
                else view.gpGestionarDuo.getColumnModel().setColumnHeader(colummIndex, 'Fecha entrega');*/
                view.gpGestionarDuo.getColumnModel().setHidden(colummIndex, false);
            }else {
                view.gpGestionarDuo.getColumnModel().setHidden(colummIndex, true);
            }
        });
        view.btnCerrarVentana.setHandler(function () {
            view.ventanaVerDetalles.hide();
        });

        // para que el grid ocupe el resto del viewport
        view.gpDatosReporte.on({
            beforerender: function (component) {
                component.setHeight(view.vpServicios.getSize().height - Ext.getCmp('topPanel').getSize().height);
                component.doLayout();
            }
        });

        Ext.getCmp('gpEntidad').getStore().on('load', function (store, records, options) {
            var cbxComponente = Ext.getCmp('cbxEntidad');
            if (view.responseData.Entidades.Actual && cbxComponente.fSelect.values.length == 0) {
                for (i = 0; i < store.getCount(); i++)
                    if (store.getAt(i).id == view.responseData.Entidades.Actual) {
                        cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                        cbxComponente.fSelect.values.push(store.getAt(i).id);
                        cbxComponente.fSelect.index.push(i);
                    }
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
            }
        });

        Ext.getCmp('gpEntidad').getSelectionModel().on({
            'selectionchange': function () {
                //scope.fResetValues(view.cbxEjercicio);
                //scope.fResetValues(view.cbxPeriodo);
                //scope.fResetValuesFecha();//-
            }
        });

        view.cbxEjercicio.on('expand', function () {
            if (view.cbxEntidad.isValid()) {
                if (view.cbxEjercicio.fIsDirty(view.cbxEntidad.fSelect.values)) {
                    view.cbxEjercicio.fSelect.valuesLoaded = view.cbxEntidad.fSelect.values;
                    Ext.getCmp('gpEjercicio').getStore().removeAll();
                    Ext.getCmp('gpEjercicio').getStore().load({
                        params: {
                            arrayIdEstructurae: Ext.encode(view.cbxEntidad.fSelect.values)
                        }
                    });
                }
            } else {
                view.cbxEjercicio.collapse();
            }
        });

        Ext.getCmp('gpEjercicio').getStore().on('load', function (store, records, options) {
            var cbxComponente = Ext.getCmp('cbxEjercicio');
            if (view.responseData.Ejercicios.Actual && cbxComponente.fSelect.values.length == 0) {
                for (i = 0; i < store.getCount(); i++)
                    if (store.getAt(i).idejercicio == view.responseData.Ejercicios.Actual) {
                        cbxComponente.fSelect.display.push(store.getAt(i).data.text);
                        cbxComponente.fSelect.values.push(store.getAt(i).idejercicio);
                        cbxComponente.fSelect.index.push(i);
                    }
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
            }
        });

        view.cbxPeriodo.on('expand', function () {
            if (view.cbxEjercicio.isValid()) {
                if (view.cbxPeriodo.fIsDirty(view.cbxEjercicio.fSelect.values)) {
                    view.cbxPeriodo.fSelect.valuesLoaded = view.cbxEjercicio.fSelect.values;
                    store = Ext.getCmp('gpPeriodo').getStore();
                    recordsSelected = Ext.getCmp('gpEjercicio').getSelectionModel().getSelections();
                    result = new Array();
                    for (i = 0; i < recordsSelected.length; i++)
                        result.push({
                            text: recordsSelected[i].data.text,
                            idEjercicio: recordsSelected[i].data.idejercicio
                        });
                    store.removeAll();
                    store.load({
                        params: {
                            arrayEjercicios: Ext.encode(result)
                        }
                    });
                }
            } else
                view.cbxPeriodo.collapse();
        });

        Ext.getCmp('gpEjercicio').getStore().on('load', function (store, records, options) {
            if (view.jrEjercicio.jsonData.Actual != null) {
                scope.fValorActualCopy(store, 'Ejercicio', 'Entidad', view.jrEjercicio.jsonData.Actual);
            }
        });

        Ext.getCmp('gpEjercicio').getSelectionModel().on('selectionchange', function () {
            scope.fResetValues(view.cbxPeriodo);
            scope.fResetValuesFecha();
            if (Ext.getCmp('gpEjercicio').getSelectionModel().getSelections().length > 0 || !view.cbxEjercicio.isValid())
                scope.fSetearFechas(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
        });

        view.cbxPeriodo.content.getComponent(0).getStore().on('load', function (store, records, options) {
            if (view.jrPeriodo.jsonData.Actual != null) {
                scope.fValorActualCopy(store, 'Periodo', 'Ejercicio', view.jrPeriodo.jsonData.Actual);
                scope.fSetValuesFechas(view.responseData.Periodos.fechaInicio, view.responseData.Periodos.fechaFin);
                // scope.fSetValuesFechas(null, view.responseData.Periodos.fechaFin);
            }
        });

        Ext.getCmp('gpPeriodo').getSelectionModel().on('selectionchange', function () {
            var selections = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
            if (selections.length > 0) {
                var fechaIni = scope.getGreatherOrLowerDate(selections, '<', 'inicio');
                var fechaFin = scope.getGreatherOrLowerDate(selections, '>', 'fin');
                scope.fSetValuesFechas(fechaIni, fechaFin);
            }
        });

        model.stReportes.on('load', function () {
            loadMask.hide();
        });

        view.cbxEntidad.on('change', function (a, b, b) {
            view.cambio = 1;
            // view.cbReportes.fireEvent('select');
        });
        // view.cbxEntidad.on('select', function () {
        //     view.cambio = 1;
        //     view.cbReportes.fireEvent('beforeselect');
        // });

        //Para el consolidado----------------------------------
        view.estructuraPadre = false;
        view.consolidar = false;
        //Comentariado hasta que se hagan los reportes consolidado de copa
        //Este codigo es para que salga el boton consolidar
        /*Ext.getCmp('gpEntidad').getSelectionModel().on({
            'rowselect': function (sm, rowIndex, record) {
                if (!record.data._is_leaf)
                    view.estructuraPadre = true;
                if (sm.getSelections().length > 1 && view.estructuraPadre) {
                    Ext.getCmp('btnConsolidar').setVisible(true);
                    Ext.getCmp('btnNoConsolidar').setVisible(false);
                }
                scope.eventBtnConsolidar();
            },
            'rowdeselect': function (sm, rowIndex, record) {
                if (!record.data._is_leaf)
                    view.estructuraPadre = false;
                if (sm.getSelections().length <= 1 || !view.estructuraPadre || sm.getSelections().length == 0) {
                    Ext.getCmp('btnNoConsolidar').fireEvent('click');
                    Ext.getCmp('btnConsolidar').setVisible(false);
                    Ext.getCmp('btnNoConsolidar').setVisible(false);
                }
                scope.eventBtnConsolidar();
            }
        });*/
        //----------------------------------------------

        view.cbReportes.on({
//            select: function(field, record, index) {
            beforeselect: function (field, record, index) {
                //view.btnAceptar.enable();
                // if (this.getValue() != record.data.idreporte) {
                view.cambio = 1;
                scope.fAddComponent(record.data.idreporte);
                view.gpDatosReporte.getStore().removeAll();
                view.gpDatosReporte.getColumnModel().setConfig([]);
                view.btnVistaPreliminar.hide();
                view.btnVerDetalles.hide();
                // }
            },
            select: function (field, record, index) {
                if (view.cbReportes.getValue() != '688-689' && view.cbReportes.getValue() != '686-687') {
                    Ext.getCmp('btnConsolidar').setVisible(false);
                }
                view.btnAceptar.setDisabled(!scope.formIsValid());
                if (view.cbMoneda && view.cbMoneda.rendered)
                    view.btnAceptar.setDisabled(view.cbMoneda.getValue() == "");

                if (view.cbxDocTypes && Ext.getCmp('cbxDocTypes'))
                    view.btnAceptar.setDisabled(Ext.getCmp('cbxDocTypes').fSelect.values[0] === undefined);

                if (field.getValue() == 1 || field.getValue() == 2 || field.getValue() == 3 || field.getValue() == 4 || field.getValue() == 5 || field.getValue() == 6)
                    field.reset();
                if (field.getValue() == 80003) {
                    view.mostrarVerDetalles = 1;
                    view.tipoReporte = 'cpp';
                    // view.btnAceptar.disable();
                }
                if (field.getValue() == 80004) {
                    view.mostrarVerDetalles = 1;
                    view.tipoReporte = 'cpc';
                    // view.btnAceptar.disable();
                }
                view.idreporte = field.getValue();
                //Reportes de Antiguedad y de todas las cuentas por cobrar y pagar
                if (field.getValue() == 80003 || field.getValue() == 80004 || field.getValue() == 80005 || field.getValue() == 80006 || field.getValue() == 669 || field.getValue() == 672) {
                    view.btnAceptar.setDisabled(false);
                    view.btnVerDetalles.disable();
                    view.fechaFin.setMaxValue(new Date());
                    view.fechaFin.setValue(new Date());
                    view.fechaInicio.setValue(null);
                    if (field.getValue() == 669 || field.getValue() == 672) {//Todas las cuentas por cobrar/pagar
                        view.mostrarVerDetalles = 0;
                        view.btnVerDetalles.setVisible(false);
                    } else {
                        view.mostrarVerDetalles = 1;
                        view.btnVerDetalles.setVisible(true);
                    }
                    view.cbxPeriodo.reset();
                    view.cbxEjercicio.reset();
                } else { //Submayores
                    if (view.fechaInicio.getValue() == '' || view.cbxPeriodo.getValue() == '') {
                        scope.fSelectValueXCombo(scope, 'Ejercicio', [view.jrEjercicio.jsonData.Actual], 'idejercicio', view.jrEjercicio, 'text');
                        scope.fSelectValueXCombo(scope, 'Periodo', [view.jrPeriodo.jsonData.Actual], 'idperiodo', view.jrPeriodo, 'text');
                        scope.fSetValuesFechas(view.responseData.Periodos.fechaInicio, view.responseData.Periodos.fechaFin);
                    }
                    view.mostrarVerDetalles = 0;
                    view.btnVerDetalles.setVisible(false);
                }
            }
        });

        this.fSelectValueXCombo = function (scope, xCombo, arrayIdValores, propiedad, jsCmp, vDisplay) {
            var gpComponente = Ext.getCmp('gp' + xCombo);
            var cbxComponente = Ext.getCmp('cbx' + xCombo);
            scope.fResetValues(cbxComponente);
            cbxComponente.fSelect.values = arrayIdValores;
            cbxComponente.fSelect.display = [];
            Ext.each(arrayIdValores, function (item) {
                var indexSel = gpComponente.getStore().find(propiedad.toString(), item, 0, false, true);
                if (jsCmp.jsonData.datos[indexSel]) {
                    cbxComponente.fSelect.display.push(jsCmp.jsonData.datos[indexSel][vDisplay.toString()]);
                } else cbxComponente.fSelect.display.push(jsCmp.jsonData.nomActual.toString());
            });
            if (cbxComponente.fSelect.display.length > 0) {
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
            }
        };

        view.btnAceptar.on('click', function () {
            if (scope.formIsValid()) {
                if (view.cambio == 1) {
                    view.btnVistaPreliminar.show();
                    scope.fAceptoReporte();
                    //view.cambio = 0;
                }
                view.btnVerDetalles.disable();
                if (view.mostrarVerDetalles == 1) {
                    view.btnVerDetalles.show();
                }
            }
        });

        view.btnVistaPreliminar.on('click', function () {
            scope.fOpenWindowReport();
        });

        view.btnVistaDesglose.on('click', function () {
            scope.fOpenWindowReport();
        });

        view.smDatosReporte.on({
            rowselect: function (selectionModel, rowIndex, record) {
                view.btnAbrirComprobante.setVisible((record.data.idcomprobante != undefined) ? ((record.data.idcomprobante.length > 0) ? true : false) : false);
                view.btnVerDetalles.enable();
                view.filaSeleccionada = record;
            },
            rowdeselect: function (selectionModel, rowIndex, record) {
                view.btnAbrirComprobante.setVisible(false);
                if (selectionModel.getSelections().length == 0)
                    view.btnVerDetalles.disable();
            }, beforerowselect: function (selectionModel, rowIndex, existen, record) {
                //Si no viene el plazo y es algun reporte de Balance de Antiguedad no seleccionar la fila.
                if (!record.data.plazo && ['80003', '80004', '80005', '80006'].indexOf(view.cbReportes.getValue()) !== -1)
                    return false;
            }
        });

        view.btnAbrirComprobante.on('click', function () {
            this.disable();
            var record = scope.smDatosReporte.getSelected();
            if (record) {
                view.btnAbrirComprobante.enable();
                Ext.Cont.Comprobante.Tool.init(record.data.idcomprobante);
            } else {
                mostrarMensaje(1, scope.etiquetas.lbSelCmp);
            }
        });

        view.gpDatosReporte.on('rowdblclick', function (Grid, rowIndex, e) {
            data = Grid.getStore().getAt(rowIndex).data;
            if (data.idcomprobante != undefined)
                if (data.idcomprobante.length > 0)
                    view.btnAbrirComprobante.fireEvent('click');
        });

        this.eventBtnConsolidar = function () {
            var gridPanel = Ext.getCmp('gpEntidad');
            var nodeData = gridPanel.getStore().getAt(0).data;
            Ext.getCmp('btnConsolidar').purgeListeners();
            Ext.getCmp('btnConsolidar').on('click', function () {
                nodeData.text = '<b>' + nodeData.codigo + ' (CONSOLIDAR)';
                gridPanel.getView().refresh();
                view.consolidar = true;
                Ext.getCmp('btnConsolidar').setVisible(false);
                Ext.getCmp('btnNoConsolidar').setVisible(true);
            });
            Ext.getCmp('btnNoConsolidar').purgeListeners();
            Ext.getCmp('btnNoConsolidar').on('click', function () {
                // node.text = node.text.replace(scope.etiquetas.lbBtnConsolidar, '');
                nodeData.text = nodeData.codigo;
                gridPanel.getView().refresh();
                // node.consolidar = false;
                view.consolidar = false;
                Ext.getCmp('btnConsolidar').setVisible(true);
                Ext.getCmp('btnNoConsolidar').setVisible(false);
            });
        };

        this.getGreatherOrLowerDate = function (array, comparision, field) {
            var result = (field == 1 || field === 'inicio') ? array[0].json.inicio : array[0].json.fin;
            var compare = (field == 1 || field === 'inicio') ? array[0].json.inicioInvertido : array[0].json.finInvertido;
            for (var i = 1; i < array.length; i++) {
                if (comparision.toLowerCase() === 'lt' || comparision === '<') {
                    if (field == 1 || field === 'inicio') {
                        if (Date.parse(compare) > Date.parse(array[i].json.inicioInvertido)) {
                            compare = array[i].json.inicioInvertido;
                            result = array[i].json.inicio;
                        }
                    }
                    if (field == 2 || field === 'fin') {
                        if (Date.parse(compare) > Date.parse(array[i].json.finInvertido)) {
                            compare = array[i].json.finInvertido;
                            result = array[i].json.fin;
                        }
                    }
                }
                if (comparision.toLowerCase() === 'gt' || comparision === '>') {
                    if (field == 1 || field === 'inicio') {
                        if (Date.parse(compare) < Date.parse(array[i].json.inicioInvertido)) {
                            compare = array[i].json.inicioInvertido;
                            result = array[i].json.inicio;
                        }
                    }
                    if (field == 2 || field === 'fin') {
                        if (Date.parse(compare) < Date.parse(array[i].json.finInvertido)) {
                            compare = array[i].json.finInvertido;
                            result = array[i].json.fin;
                        }
                    }
                }
            }
            return result;
        };

        this.fObtenerListaEstructuraConsolidan = function () {
            var select = Ext.getCmp('gpEntidad').getSelectionModel().getSelections();
            var list = new Array();
            for (var i = 0; i < select.length; i++)
                if (select[i].data.consolidar)
                    list.push({
                        id: select[i].data.idestructurae,
                        consolida: scope.fGetChildrenNodes(select[i], select)
                    });
            return list;
        };

        this.fObtenerListaEstructura = function (listEstructurasConsolidan) {
            var select = Ext.getCmp('gpEntidad').getSelectionModel().getSelections();
            var list = new Array();
            if (listEstructurasConsolidan.length > 0) {
                for (var i = 0; i < select.length; i++)
                    if (select[i].data.consolidar)
                        for (var j = 0; j < select.length; j++)
                            if (select[i].data.ordenizq * 1 <= select[j].data.ordenizq * 1 && select[i].data.ordender * 1 <= select[j].data.ordender * 1) {
                                list.push(select[j].data.idestructurae);
                            }

                return list;
            }
            return view.cbxEntidad.fSelect.values;
        };

        this.fAddComponent = function (idReport) {
            if (view.pReportes.items.length > 1) {
                for (var i = 1; i < view.pReportes.items.length; i++) {
                    scope.delComponentCascade(view.pReportes.getComponent(i));
                }
            }
            scope.generateFilterComponentes(idReport);
        };

        this.delComponentCascade = function (component) {
            if (component.items.length > 0) {
                for (var i = component.items.length - 1; i >= 0; i--) {
                    component.remove(i, true);
                }
            }
        };

        this.generateFilterComponentes = function (idReport) {
            var arrayFilterComp = [];
            switch (idReport) {
                case '666':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbCliente));
                    scope.fObtenerClientesProveedores(1);
                    break;
                case '667':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbProveedor));
                    arrayFilterComp.push(scope.fConstruirEspecialidad());
                    scope.fObtenerClientesProveedores(2);
                    scope.fObtenerEspecialidades(1);
                    break;
                case '668':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbProveedor));
//                    arrayFilterComp.push(scope.fConstruirEspecialidad());
                    scope.fObtenerClientesProveedores(2);
//                    scope.fObtenerEspecialidades(1);
                    break;
                case '669':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fBuildUIXCuentas(idReport, 2));
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbProveedor));
                    scope.fObtenerClientesProveedores(2);
                    arrayFilterComp.push(scope.fBuildFiltroEstadosObligacion());
                    arrayFilterComp.push(scope.fBuildNumero(idReport));
                    break;
                case '670':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbCliente));
                    arrayFilterComp.push(scope.fConstruirEspecialidad());
                    scope.fObtenerClientesProveedores(1);
                    scope.fObtenerEspecialidades(1);
                    break;
                case '671':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbCliente));
//                   / arrayFilterComp.push(scope.fConstruirEspecialidad());
                    scope.fObtenerClientesProveedores(1);
//                    scope.fObtenerEspecialidades(1);
                    break;
                case '672':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fBuildUIXCuentas(idReport, 1));
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbCliente));
                    scope.fObtenerClientesProveedores(1);
                    arrayFilterComp.push(scope.fBuildFiltroEstadosObligacion());
                    arrayFilterComp.push(scope.fBuildNumero(idReport));
                    break;
                case '675':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp.push(scope.fBuildCbMoneda());
                    break;
                case '676':
                case '681':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbProveedor));
                    scope.fObtenerClientesProveedores(2);
                    break;
                case '677':
                case '680':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbCliente));
                    scope.fObtenerClientesProveedores(1);
                    break;
                case '678':
                case '679':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    if (!Object.keys(scope.busyRequest).length) {
                        loadMask.hide();
                    }
                    break;
                case '682':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbProveedor));
                    arrayFilterComp.push(scope.fBuildCbMoneda());
                    scope.fObtenerClientesProveedores(2);
                    break;
                case '683':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbCliente));
                    arrayFilterComp.push(scope.fBuildCbMoneda());
                    scope.fObtenerClientesProveedores(1);
                    break;
                case '684':
                case '685':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fBuildTipoDoc());
                    // aki falta implementar un met ke contruya un combo para los tipo doc
                    if (!Object.keys(scope.busyRequest).length) {
                        loadMask.hide();
                    }
                    break;
                case '688-689':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fBuildCbCuentas(idReport, 2));
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbProveedor));
                    arrayFilterComp.push(scope.fBuildNumero(idReport));
                    //arrayFilterComp.push(scope.fBuildCbMoneda());
                    scope.fObtenerClientesProveedores(2);
                    break;
                case '686-687':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fBuildCbCuentas(idReport, 1));
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbCliente));
                    arrayFilterComp.push(scope.fBuildNumero(idReport));
                    //arrayFilterComp.push(scope.fBuildCbMoneda());
                    scope.fObtenerClientesProveedores(1);
                    break;
                case '694':
                case '690-691':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fBuildCbCuentas(idReport, 3));
                    // arrayFilterComp.push(scope.fBuildCbMoneda());
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbCliente));
                    scope.fObtenerClientesProveedores(5);
                    break;
                case '692-693':
                case '695':
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    arrayFilterComp.push(scope.fBuildCbCuentas(idReport, 4));
                    // arrayFilterComp.push(scope.fBuildCbMoneda());
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbProveedor));
                    scope.fObtenerClientesProveedores(6);
                    break;
                case '696':
                case '698':
                    var arrayFilterComp = [];
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp.push(scope.fBuildCbCuentas(idReport, 2));
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbProveedor));
                    arrayFilterComp.push(scope.fBuildCbMoneda());
                    scope.fObtenerClientesProveedores(2);
                    break;
                case '697':
                case '699':
                    var arrayFilterComp = [];
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp.push(scope.fBuildCbCuentas(idReport, 1));
                    arrayFilterComp.push(scope.fConstruirClientesProvedores(etiquetas.lbCliente));
                    arrayFilterComp.push(scope.fBuildCbMoneda());
                    scope.fObtenerClientesProveedores(1);
                    break;
                case '80003':
                case '80004':
                    var arrayFilterComp = [];
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    //arrayFilterComp.push(scope.fBuildCbCuentas(idReport, (idReport == 80004) ? 1 : 2));
                    arrayFilterComp.push(scope.fBuildUIXCuentas(idReport, (idReport == 80004) ? 1 : 2));
                    scope.fObtenerClientesProveedores((idReport == 80003) ? 4 : 3);
                    arrayFilterComp.push(scope.fConstruirClientesProvedores());
                    break;
                //BALANCE DE ANTIGUEDAD COBRO-PAGO ANTICIPADO
                case '80005':
                case '80006':
                    var arrayFilterComp = [];
                    scope.lMask(etiquetas.lbCargandoFiltros);
                    arrayFilterComp = scope.createDateComponents();
                    //arrayFilterComp.push(scope.fBuildCbCuentas(idReport, (idReport == 80005) ? 3 : 4));
                    arrayFilterComp.push(scope.fBuildUIXCuentas(idReport, (idReport == 80005) ? 3 : 4));
                    scope.fObtenerClientesProveedores((idReport == 80005) ? 5 : 6);
                    arrayFilterComp.push(scope.fConstruirClientesProvedores());
                    break;
                default :
                    break;
            }
            if (arrayFilterComp.length) {
                scope.renderFilters(arrayFilterComp);
//                view.btnAceptar.disable();
            }
            /*else{
             view.btnAceptar.setDisabled(!scope.formIsValid());
             view.btnAceptar.enable();
             }*/

        };

        this.renderFilters = function (cmpFilters) {
            if (cmpFilters.length > 0) { //Si existen filtros para el reporte
                var panel = new Ext.Panel({
                    id: 'pDown',
                    labelAlign: 'top',
                    layout: 'column'
                });
                for (var i = 0; i < cmpFilters.length; i++) {
                    panel.add(
                        {
                            layout: 'form',
                            columnWidth: cmpFilters[i].columnWidth ? cmpFilters[i].columnWidth : .30,
                            labelAlign: 'top',
                            style: 'margin:0 0 0 10',
                            items: [cmpFilters[i]]
                        }
                    );
                }
                view.pReportes.add(panel);
                view.pReportes.doLayout(true);
            }
        };

        this.createDateComponents = function () {
            var arrayFilterComp = [];
            //arrayFilterComp.push(scope.fBuildEjercicio());
            //arrayFilterComp.push(scope.fBuildPeriodo());
            //arrayFilterComp.push(scope.fBuildFechaInicio());
            //arrayFilterComp.push(scope.fBuildFechaFin());
            return arrayFilterComp;
        };

        this.fBuildNumero = function (idReporte) {
            view.tfNumero = new Ext.Cont.SearchField({
                fieldLabel: (idReporte == 669 || idReporte == 672) ? 'No. Oblig' : 'No. Inst/Oblig',
                columnWidth: .10,
                anchor: '100%',
                maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1 \.\-\_\/#])+$/,
                regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1 \.\-\_\/#])+$/,
                hideTrigger1: false,
                hideTrigger2: true,
                emptyText: '',
                clearTooltip: ''
            });

            return view.tfNumero;
        };

        this.fBuildFiltroEstadosObligacion = function () {
            view.cbFiltroEstado = new Ext.form.ComboBox({
                disabledClass: 'disabled-component',
                fieldLabel: 'Estado',
                emptyText: 'Seleccione...',
                editable: false,
                allowBlank: false,
                store: new Ext.data.SimpleStore({
                    fields: ['idestado', 'nomestado'],
                    data: [[1, 'PENDIENTES'], [2, 'LIQUIDADAS'], [3, 'FUERA DE TERMINO'], [4, 'CANCELADAS']]
                }),
                valueField: 'idestado',
                displayField: 'nomestado',
                hiddenName: 'idestado',
                typeAhead: true,
                mode: 'local',
                value: 1,
                triggerAction: 'all',
                anchor: '100%',
                columnWidth: .10,
                enableKeyEvents: true
            });

            return view.cbFiltroEstado;
        };

        this.fBuildCbMoneda = function () {
            view.stMoneda = new Ext.data.JsonStore({
                url: 'getMonedas',
                root: 'data',
                totalProperty: "total",
                fields: [
                    {name: 'idmonedaentidad'},
                    {name: 'idmoneda'},
                    {name: 'idestructuracomun'},
                    {name: 'nombremoneda'},
                    // {name: 'contable'},
                    {name: 'codigoiso'}
                ],
                /*sortInfo: {
                 field: 'contable',
                 direction: 'DESC'
                 },*/
                listeners: {
                    beforeload: function (store, options) {
                        scope.busyRequest.Moneda = true;
                    },
                    load: function (store, records, options) {
                        view.cbMoneda.enable();
                        delete scope.busyRequest.Moneda;
                        if (!Object.keys(scope.busyRequest).length) {
                            loadMask.hide();
                        }
                        // seteando la moneda contable
                        /*if (records.length > 0) {
                         store.each(function(record) {
                         if (record.json.contable == 1) {
                         view.cbMoneda.setValue(record.json.idnommonedaentidad);
                         return false;
                         }
                         });
                         }*/
                    }
                }
            });

            view.cbMoneda = new Ext.form.ComboBox({
                store: view.stMoneda,
                valueField: 'idmoneda',
                // valueField: 'idmonedaentidad',
                displayField: 'codigoiso',
                fieldLabel: etiquetas.lbMoneda,
                columnWidth: .05,
                anchor: '98%',
                disabled: true,
                triggerAction: 'all',
                mode: 'local',
                id: 'cbmoneda',
                name: 'moneda',
                readOnly: true,
                editable: false,
                allowBlank: false,
                forceSelection: true,
                enableKeyEvents: true,
                selectOnFocus: true
            });
            view.cbMoneda.on({
                change: function (field, newValue, oldValue) {
                    view.cambio = 1;
                },
                select: function () {
                    view.btnAceptar.setDisabled(!scope.formIsValid());
                    // view.btnAceptar.enable();
                }
            });

            view.stMoneda.load();

            return view.cbMoneda;
        };

        this.fBuildCbCuentas = function (idreporte, tipoDuo) {
            view.stCuentas = new Ext.data.JsonStore({
                url: 'getCuentas',
                root: 'data',
                totalProperty: "total",
                fields: [
                    {name: 'idcuenta'},
                    {name: 'text'},
                    {name: 'clavecuenta'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'idnaturaleza'},
                    {name: 'idmoneda'},
                    {name: 'concatcta'}
                ],
                sortInfo: {
                    field: 'concatcta',
                    direction: 'ASC'
                },
                listeners: {
                    beforeload: function (store, options) {
                        scope.busyRequest.Cuenta = true;
                        store.baseParams.cuentas = Ext.encode(Ext.getCmp('cbxEntidad').fSelect.values);
                        store.baseParams.idreporte = idreporte;
                        store.baseParams.tipoDuo = tipoDuo;
                    },
                    load: function (store, records, options) {
                        view.cbCuenta.enable();
                        delete scope.busyRequest.Cuenta;
                        if (!Object.keys(scope.busyRequest).length) {
                            loadMask.hide();
                        }
                    }
                }
            });

            view.cbCuenta = new Ext.form.ComboBox({
                store: view.stCuentas,
                valueField: 'idcuenta',
                displayField: 'text',
                fieldLabel: etiquetas.lbCuenta,
                anchor: '100%',
                disabled: true,
                emptyText: etiquetas.lbEmptyTextCb,
                triggerAction: 'all',
                mode: 'local',
                id: 'cbcuenta',
                name: 'cbcuenta',
                readOnly: true,
                editable: false,
                allowBlank: (idreporte == 80003 || idreporte == 80004 || idreporte == 80005 || idreporte == 80006) ? true : false,
                forceSelection: (idreporte == 80003 || idreporte == 80004 || idreporte == 80005 || idreporte == 80006) ? false : true,
                enableKeyEvents: true,
                selectOnFocus: true
            });
            view.cbCuenta.on({
                change: function (field, newValue, oldValue) {
                    view.cambio = 1;
                },
                keypress: function (t, e) {
                    if ((e.getKey() == 8) || (e.getKey() == 46)) // Limpiar el combo
                        t.clearValue();
                },
                /*beforeselect: function (field, newValue, oldValue) {
                    if(view.mostrarVerDetalles==1){
                        view.btnAceptar.disable();
                    }
                },*/
                select: function (field, record, index) {
                    /*if(view.mostrarVerDetalles==1){
                        view.btnAceptar.enable();
                    }*/

                    //Setear la moneda en el cbMoneda, que sale de la cuenta
                    if (view.cbMoneda) {
                        if (view.cbMoneda.rendered) {
                            view.cbMoneda.setValue(record.data.idmoneda);
                            view.cbMoneda.setDisabled(true);
                        } else {
                            view.cbMoneda.setDisabled(false);
                        }
                    }

                    view.btnAceptar.setDisabled(!scope.formIsValid());
                }
            });
            view.stCuentas.load();

            return view.cbCuenta;
        };

        this.fBuildUIXCuentas = function (idreporte, tipoDuo) {
            view.cbxCuenta = new Ext.CONT.UIXCombo({
                emptyText: 'Seleccione...',
                allowBlank: true,
                // allowBlank: (idreporte == 80003 || idreporte == 80004 || idreporte == 80005 || idreporte == 80006) ? true : false,
                fieldLabel: 'Cuenta',
                tabIndex: 2
            }, {
                identificador: 'Cuenta',
                displayText: 'Cuenta',
                url: 'getCuentas',
                autoLoad: true,
                singleSelect: false,
                // singleSelect: (idreporte == 80003 || idreporte == 80004 || idreporte == 80005 || idreporte == 80006) ? false : true,
                reader: view.jrCuenta = new Ext.data.JsonReader({
                    id: 'idcuenta',
                    root: 'data'
                }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf',
                    mapping: 'leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idcuenta'
                }, {
                    name: 'text'
                }, {
                    name: 'codigo',
                    mapping: 'concatcta'
                }]),
                baseParams: {
                    Cuenta: true,
                    cuentas: Ext.encode(Ext.getCmp('cbxEntidad').fSelect.values),
                    idreporte: idreporte,
                    tipoDuo: tipoDuo
                }
            });

            view.cbxCuenta.on({
                change: function (field, newValue, oldValue) {
                    view.cambio = 1;
                }
            });
            return view.cbxCuenta;
        };

        this.fBuildEjercicio = function () {
            view.cbxEjercicio = new Ext.CONT.UIXCombo({
                emptyText: 'Seleccione...',
                allowBlank: false,
                fieldLabel: 'Ejercicio',
                tabIndex: 2
            }, {
                identificador: 'Ejercicio',
                displayText: 'Ejercicio',
                url: 'obtenerEjerciciosParaBusqueda',
                autoLoad: false,
                singleSelect: true,
                reader: view.jrEjercicio = new Ext.data.JsonReader({
                    id: 'idejercicio',
                    root: 'datos'
                }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idejercicio'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }, {
                    name: 'inicio'
                }, {
                    name: 'fin'
                }])
            });
            scope.EventosFiltros('ejercicios');
            Ext.getCmp('gpEjercicio').getStore().loadData(view.responseData.Ejercicios);

            view.cbxEjercicio.on({
                change: function (field, newValue, oldValue) {
                    view.cambio = 1;
                }/*,
                 select: function(field, record, index) {
                 view.btnAceptar.setDisabled(!scope.formIsValid());
                 }*/
            });
            return view.cbxEjercicio;
        };

        this.fBuildPeriodo = function () {
            view.cbxPeriodo = new Ext.CONT.UIXCombo({
                emptyText: 'Seleccione',
                fieldLabel: 'Per&iacute;odo',
                tabIndex: 3
            }, {
                identificador: 'Periodo',
                displayText: 'Per&iacute;odo',
                url: 'obtenerPeriodosParaBusqueda',
                autoLoad: false,
                singleSelect: false,
                reader: view.jrPeriodo = new Ext.data.JsonReader({
                    id: 'idperiodo',
                    root: 'datos'
                }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idperiodo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }, {
                    name: 'idejercicio'
                }, {
                    name: 'inicio'
                }, {
                    name: 'fin'
                }, {
                    name: 'apertura'
                }])
            });

            scope.EventosFiltros('periodos');
            Ext.getCmp('gpPeriodo').getStore().loadData(view.responseData.Periodos);

            view.cbxPeriodo.on({
                change: function (field, newValue, oldValue) {
                    view.cambio = 1;
                }/*,
                 select: function(field, record, index) {
                 view.btnAceptar.setDisabled(!scope.formIsValid());
                 }*/
            });

            return view.cbxPeriodo;
        };

        this.fBuildFechaInicio = function () {
            view.fechaInicio = new Ext.form.DateField({
                fieldLabel: 'Fecha Inicio',
                enableKeyEvents: true,
                tabIndex: 4,
                vtype: 'daterange',
                name: 'dfDesde',
                id: 'dfDesde',
                //endDateField : 'dfHasta',
                anchor: '100%',
                readOnly: true,
                format: 'd/m/Y',
                allowBlank: true
            });
            view.fechaInicio.on({
                change: function () {
                    view.cambio = 1;
                    view.btnAceptar.setDisabled(!scope.formIsValid());
                    view.btnAceptar.setDisabled(false);
                },
                beforerender: function (cmp) {
                    if (view.responseData.Periodos.fechaInicio.indexOf('/') !== -1) {
                        view.fechaInicio.setMinValue(view.responseData.Periodos.fechaInicio);
                        view.fechaInicio.setValue(view.responseData.Periodos.fechaInicio);
                    }
                }
            });

            return view.fechaInicio;
        };

        this.fBuildFechaFin = function () {
            view.fechaFin = new Ext.form.DateField({
                fieldLabel: 'Fecha Fin',
                enableKeyEvents: true,
                vtype: 'daterange',
                //startDateField : 'dfDesde',
                tabIndex: 5,
                name: 'dfHasta',
                id: 'dfHasta',
                anchor: '100%',
                allowBlank: false,
                readOnly: true,
                format: 'd/m/Y'
            });

            view.fechaFin.on({
                change: function () {
                    view.cambio = 1;
//                    view.btnAceptar.setDisabled(!scope.formIsValid());
                },
                beforerender: function (cmp) {
                    if (view.responseData.Periodos.fechaFin.indexOf('/') !== -1) {
                        view.fechaFin.setMaxValue(view.responseData.Periodos.fechaFin);
                        view.fechaFin.setValue(view.responseData.Periodos.fechaFin);
                    }
                }
            });

            return view.fechaFin;
        };

        this.fBuildTipoDoc = function () {
            view.cbxDocTypes = new Ext.CONT.UIXCombo({
                emptyText: etiquetas.lbEmptyTextCb,
                allowBlank: false,
                fieldLabel: etiquetas.lbTipoDocumento,
                tabIndex: 2
            }, {
                identificador: 'DocTypes',
                displayText: 'DocTypes',
                url: '',
                autoLoad: false,
                singleSelect: true,
                reader: view.jrDocType = new Ext.data.JsonReader({
                    id: 'idtipodoc',
                    root: 'datos'
                }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idtipodoc'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
            });
            Ext.getCmp('gpDocTypes').getStore().loadData(view.responseData.TiposDocumento);
            //
            view.cbxDocTypes.on({
                change: function (field, newValue, oldValue) {
                    view.cambio = 1;
                    view.btnAceptar.enable();
                }/*,
                 select: function(field, record, index) {
                 view.btnAceptar.enable();
                 }*/
            });
            return view.cbxDocTypes;
        };

        this.EventosFiltros = function (cmp) {
            switch (cmp) {
                case 'ejercicios':
                    Ext.getCmp('gpEjercicio').getStore().on('load', function (store, records, options) {
                        if (view.jrEjercicio.jsonData.Actual != null) {
                            scope.fValorActualCopy(store, 'Ejercicio', 'Entidad', view.jrEjercicio.jsonData.Actual);
                        }
                    });

                    Ext.getCmp('gpEjercicio').getSelectionModel().on('selectionchange', function () {
                        scope.fResetValues(view.cbxPeriodo);
                        scope.fResetValuesFecha();
                        if (Ext.getCmp('gpEjercicio').getSelectionModel().getSelections().length > 0 || !view.cbxEjercicio.isValid())
                            scope.fSetearFechas(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
                    });
                    break;
                case 'periodos':
                    view.cbxPeriodo.content.getComponent(0).getStore().on('load', function (store, records, options) {
                        if (view.jrPeriodo.jsonData.Actual != null) {
                            scope.fValorActualCopy(store, 'Periodo', 'Ejercicio', view.jrPeriodo.jsonData.Actual);
                            scope.fSetValuesFechas(view.responseData.Periodos.fechaInicio, view.responseData.Periodos.fechaFin);
                        }
                    });

                    Ext.getCmp('gpPeriodo').getSelectionModel().on('selectionchange', function () {
                        var selections = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
                        if (selections.length > 0) {
                            var fechaIni = scope.getGreatherOrLowerDate(selections, '<', 'inicio');
                            var fechaFin = scope.getGreatherOrLowerDate(selections, '>', 'fin');
                            scope.fSetValuesFechas(fechaIni, fechaFin);
                        }
                    });
                    break;

            }
        };

        this.fConstruirEspecialidad = function (singleSelect) {
            this.cbxEspecialidad = new Ext.CONT.UIXCombo({
                emptyText: etiquetas.lbEmptyTextCb,
                disabled: true,
                allowBlank: true,
                hiddenTbar: true,
                fieldLabel: etiquetas.lbEspecialidad
            }, {
                identificador: etiquetas.lbEspecialidad,
                displayText: etiquetas.lbEspecialidad,
                singleSelect: (singleSelect) ? true : false,
                url: 'cargararbolespecialidades',
                reader: this.jrEspecialidad = new Ext.data.JsonReader({
                    id: 'idespecialidad'
                }, [{
                    name: 'text',
                    mapping: 'especialidad'
                }, {
                    name: 'codigo',
                    mapping: 'especialidad'
                }, {
                    name: 'codespecialidad',
                    mapping: 'codespecialidad'
                }, {
                    name: '_parent',
                    mapping: 'padre'
                }, {
                    name: '_is_leaf',
                    mapping: 'leaf'
                }, {
                    name: 'ordenizq'
                }, {
                    name: 'ordender'
                }, {
                    name: 'idespecialidad'
                }])
            });

            this.cbxEspecialidad.on({
                change: function (field, newValue, oldValue) {
                    view.cambio = 1;
                }/*,
                 select: function(field, record, index) {
                 view.btnAceptar.setDisabled(!scope.formIsValid());
                 }*/
            });
            return this.cbxEspecialidad;
        };

        this.fConstruirClientesProvedores = function (nombre, singleSelect) {
            this.cbxClienteProveedor = new Ext.CONT.UIXCombo({
                emptyText: etiquetas.lbEmptyTextCb,
                fieldLabel: (nombre) ? nombre : etiquetas.lbClienteProveedor,
                allowBlank: true,
                //hidden:true,
                disabled: true,
                filter: 'text',
                maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\*\.\#\+\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]*)+$/,
                tabIndex: 7
            }, {
                identificador: 'ClienteProveedor',
                displayText: etiquetas.lbClienteProveedor,
                singleSelect: (singleSelect) ? true : false,
                url: 'obtenerclientesprovedores',
                reader: this.jrClienteProveedor = new Ext.data.JsonReader({
                    id: 'id',
                    root: 'datos'
                }, [{
                    name: 'text',
                    mapping: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'nombre'
                }, {
                    name: 'id',
                    mapping: 'id'
                }, {
                    name: '_parent'
                }, {
                    name: '_is_leaf',
                    mapping: 'isLeaf'
                }])
            });

            this.cbxClienteProveedor.on({
                change: function (field, newValue, oldValue) {
                    view.cambio = 1;
                    view.btnAceptar.setDisabled(!scope.formIsValid());
                },
                select: function (field, record, index) {//Este evento no se ejecuta nunca
                    view.btnAceptar.setDisabled(!scope.formIsValid());
                }
            });
            return this.cbxClienteProveedor;
        };

        this.fObtenerClientesProveedores = function (agTipo) {
            scope.busyRequest.CP = true;
            Ext.Ajax.request({
                method: "POST",
                url: "obtenerclientesprovedores",
                params: {
                    tipo: agTipo, /* 1-Cliente | 2-Proveedores */
                    idestructurae: Ext.encode(view.cbxEntidad.fSelect.values)
                },
                callback: function (options, success, response) {
                    delete scope.busyRequest.CP;
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.datos[0]) {
                        Ext.getCmp('gpClienteProveedor').getStore().loadData(responseData);
                        scope.cbxClienteProveedor.enable();
                    } else {
                        view.btnAceptar.disable();
                        view.btnVerDetalles.disable();
                        scope.cbxClienteProveedor.disable();
                        if (view.cbCuenta)
                            view.cbCuenta.disable();
                    }
                    if (!Object.keys(scope.busyRequest).length) {
                        loadMask.hide();
                    }
                }
            });
        };

        this.fObtenerEspecialidades = function (num) {
            scope.busyRequest.Esp = true;
            Ext.Ajax.request({
                method: "POST",
                url: "cargararbolespecialidades",
                params: {
                    num: num
                },
                callback: function (options, success, response) {
                    delete scope.busyRequest.Esp;
                    var responseData = Ext.decode(response.responseText);
                    Ext.getCmp('gpEspecialidad').getStore().loadData(responseData);
                    scope.cbxEspecialidad.enable();
                    if (!Object.keys(scope.busyRequest).length) {
                        loadMask.hide();
                    }
                }
            });
        };

        this.fValorActualCopy = function (store, identificador, identificadorAntecesor, idActual) {
            var cbxComponente = Ext.getCmp('cbx' + identificador);
            if (idActual && cbxComponente.fSelect.values.length == 0) {
                for (var i = 0; i < store.getCount(); i++)
                    if (this.findValue(store.getAt(i).id, idActual)) {
                        cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                        cbxComponente.fSelect.values.push(store.getAt(i).id);
                        cbxComponente.fSelect.valuesLoaded = Ext.getCmp('cbx' + identificadorAntecesor).fSelect.values;
                        cbxComponente.fSelect.index.push(i);
                    }
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
            }
        };

        this.fSetearFechas = function (recordsSelection) {
            var recordsLength = recordsSelection.length;
            if (recordsLength > 1) {
                recordsMenores = scope.fOrdenaFechasMenores(recordsSelection);
                scope.fSetValuesFechas((recordsMenores[0].data.apertura == 1) ? null : recordsMenores[0].data.inicio, scope.fOrdenaFechasMayores(recordsSelection)[0].data.fin);
            } else if (recordsLength == 1)
                scope.fSetValuesFechas((recordsSelection[0].data.apertura == 1) ? null : recordsSelection[0].data.inicio, recordsSelection[0].data.fin);
            else
                scope.fResetValuesFecha();
        };

        this.fOrdenaFechasMenores = function (valores) {
            for (i = 0; i < valores.length - 1; i++)
                for (j = i + 1; j < valores.length; j++)
                    if (this.fFechaMayor(valores[i].data.inicio, valores[j].data.inicio)) {
                        valor = valores[i];
                        valores[i] = valores[j];
                        valores[j] = valor;
                    } else if (this.fFechaIguales(valores[i].data.inicio, valores[j].data.inicio))
                        if (this.fFechaMayor(valores[i].data.fin, valores[j].data.fin)) {
                            valor = valores[i];
                            valores[i] = valores[j];
                            valores[j] = valor;
                        }

            return valores;
        };

        this.fSetValuesFechas = function (fechaInicio, fechaFin) {
            view.fechaInicio.setDisabled(false);
            view.fechaFin.setDisabled(false);
            view.fechaInicio.reset();
            view.fechaFin.reset();
            view.fechaInicio.setMinValue(fechaInicio);
            view.fechaFin.setMaxValue(fechaFin);
            view.fechaFin.setValue(fechaFin);
            view.fechaFin.clearInvalid();
            //--Para que en estos reportes no ponga la fecha de inicio
            var idreporte = view.cbReportes.getValue();
            if (idreporte == 80003 || idreporte == 80004 || idreporte == 80005 || idreporte == 80006 || idreporte == 669 || idreporte == 672) {
                view.fechaInicio.reset();
            } else {
                view.fechaInicio.setValue(fechaInicio);
                view.fechaInicio.clearInvalid();
            }
        };

        this.fResetValuesFecha = function () {
            date = new Date().format('d/m/Y');
            view.fechaInicio.setDisabled(true);
            view.fechaFin.setDisabled(true);
            view.fechaInicio.setValue(null);
            view.fechaFin.setValue(null);
        };

        this.fResetValues = function (component) {
            component.clearValue();
            // component.reset();
            component.fSelect.values = new Array();
            component.fSelect.display = new Array();
            component.fSelect.index = new Array();
        };

        this.findValue = function (list, id) {
            for (j = 0; j < list.length; j++)
                if (list[j] == id)
                    return true;
            return false;
        };

        this.fAceptoReporte = function () {
            this.listEstructurasConsolidan = scope.fObtenerListaEstructuraConsolidan();
            if (this.listEstructurasConsolidan.length > 0) {
                scope.visible = false,
                    mostrarMensaje(3, etiquetas.msgNoConsolida, function fAcepto(btn) {
                        scope.btnAceptar.enable();
                    });
            } else {
                var idreporte = view.cbReportes.getValue();
                if (idreporte == 667 || idreporte == 668 || idreporte == 669)
                    this.numderuoblig = 2;
                else if (idreporte == 670 || idreporte == 671 || idreporte == 672)
                    this.numderuoblig = 1;

                var params = scope.getParams(idreporte);
                params.tiporeporte = this.numderuoblig;
                params.consolidar = view.consolidar;

                //this.lMask(etiquetas.msgEsperandoBusq);
                Ext.Msg.wait(etiquetas.msgEsperandoBusq, 'Por favor espere...');
                Ext.Ajax.request({
                    method: "POST",
                    params: params,
                    url: "cargarDatosReporte",
                    callback: function (options, success, response) {
                        scope.parametrosUltimoReporte = options.params;
                        //view.btnAceptar.disable();
                        scope.responseDataReporte = Ext.decode(response.responseText);
                        Ext.Msg.hide();
                        //loadMask.hide();
//                        view.btnAceptar.enable();
                        scope.fDrawGridPanel(idreporte, scope.responseDataReporte.datos);
                        if (scope.responseDataReporte.datos && scope.responseDataReporte.datos.length > 0) {
                            view.btnVistaPreliminar.enable();
                            scope.visible = true;
                        } else {
                            view.btnVistaPreliminar.disable();
                            mostrarMensaje(1, etiquetas.msgNoElementSearch);
                            //view.btnAceptar.disable();
                            scope.visible = false;
                            //scope.notifyEvent(view.gpDatosReporte.body.dom, etiquetas.titleUpperCaseInfo, etiquetas.msgNoElementSearch, 1, 5000);
                        }
                    }
                });
            }
        };

        this.getParams = function (idReporte) {
            params = {
                'arrayIdEstructurae': Ext.encode(scope.fObtenerListaEstructura(this.listEstructurasConsolidan)),
                'idReporte': idReporte
            };
            if (view.fechaInicio && view.fechaInicio.rendered) {
                params.fechainicio = view.fechaInicio.getRawValue();
            }
            if (view.fechaFin && view.fechaFin.rendered) {
                params.fechafin = view.fechaFin.getRawValue();
            }
            if (scope.cbxClienteProveedor && Ext.getCmp('cbxClienteProveedor')) {
                if (Ext.getCmp('cbxClienteProveedor').fSelect.values.length > 0 || (idReporte == 80003 || idReporte == 80004 || idReporte == 80005 || idReporte == 80006)) {
                    params.clientesProv = Ext.encode(Ext.getCmp('cbxClienteProveedor').fSelect.values);
                } else {
                    params.clientesProv = null;
                    // params.clientesProv = Ext.encode(scope.getAllClientsProv());
                }
            }
            if (scope.cbxEspecialidad && Ext.getCmp('cbxEspecialidad')) {
                if (Ext.getCmp('cbxEspecialidad').fSelect.values.length > 0) {
                    params.especialidades = Ext.encode(Ext.getCmp('cbxEspecialidad').fSelect.values);
                } else {
                    params.especialidades = Ext.encode(scope.getAllEspecialidades());
                }
            }
            if (view.cbxDocTypes && Ext.getCmp('cbxDocTypes')) {
                if (Ext.getCmp('cbxDocTypes').fSelect.values.length > 0) {
                    var docs = {
                        idtipodoc: Ext.getCmp('cbxDocTypes').fSelect.values[0],
                        text: Ext.getCmp('cbxDocTypes').fSelect.display[0]
                    };
                    params.tipodoc = Ext.encode(docs);
                }
//                else {
//                    params.tipodoc = Ext.encode(scope.getAllEspecialidades());
//                }
            }
            if (view.cbMoneda && view.cbMoneda.rendered) {
                params.moneda = Ext.encode({idmoneda: view.cbMoneda.getValue(), text: view.cbMoneda.getRawValue()});
            }
            if (view.cbCuenta && view.cbCuenta.rendered) {
                params.cuenta = Ext.encode({idcuenta: view.cbCuenta.getValue(), text: view.cbCuenta.getRawValue()});
            }
            if (Ext.getCmp('cbxCuenta')) {
                params.arrayCuenta = Ext.encode(Ext.getCmp('cbxCuenta').fSelect.values);
            }
            if (view.tfNumero && view.tfNumero.rendered) {
                params.tfNumero = view.tfNumero.getValue();
            }
            if (view.cbFiltroEstado && view.cbFiltroEstado.rendered) {
                params.estado = view.cbFiltroEstado.getValue();
            }
            return params;
        };

        this.getAllClientsProv = function () {
            var array = [];
            var stClientes = scope.cbxClienteProveedor.content.getComponent(0).getStore();
            stClientes.each(function (record) {
                array.push(record.json.idcliente);
            });
            return array;
        };
        this.getAllEspecialidades = function () {
            var array = [];
            var stEspecialidades = scope.cbxEspecialidad.content.getComponent(0).getStore();
            stEspecialidades.each(function (record) {
                array.push(record.json.idespecialidad);
            });
            return array;
        };

        this.fDrawGridPanel = function (idreporte, viewdata) {

            view.pGeneral.add(view.pnlSouth);
            view.pGeneral.doLayout();

            scope.defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            switch (idreporte) {
                case '80003':
                case '80004':
                case '80005':
                case '80006':
                    var reader = new Ext.data.JsonReader({
                        fields: [
                            {name: 'nombrecliente'},
                            {name: 'idcliente'},
                            {name: 'descripcionestructura'},
                            {name: 'codigoiso'},
                            {name: 'concatcta'},
                            {name: 'balancetotal'},
                            {name: 'ceroatreinta'},
                            {name: 'cuarentayseisasesenta'},
                            {name: 'sesentayunoanoventa'},
                            {name: 'noventayunoacientoochenta'},
                            {name: 'mascientoochenta'},
                            {name: 'totalatraso'},
                            {name: 'plazo'},
                            {name: 'porcientoatraso'}]
                    });
                    view.btnVistaPreliminar.enable();
                    view.gpDatosReporte.reconfigure(
                        new Ext.data.GroupingStore({
                            reader: reader,
                            data: viewdata,
                            // sortInfo: {field: 'nombrecliente', direction: "ASC"},
                            sortInfo: {field: 'concatcta', direction: "ASC"},
                            groupField: 'descripcionestructura'
                        }),
                        new Ext.grid.ColumnModel([{
                            header: (idreporte == '80003' || idreporte == '80005') ? etiquetas.lbProveedor : etiquetas.lbCliente,
                            dataIndex: 'nombrecliente',
                            align: 'left',
                            width: 200
                        }, {
                            header: 'Moneda',
                            dataIndex: 'codigoiso',
                            align: 'center',
                            width: 60
                        }, {
                            // header: 'Condición de pago',
                            header: 'Plazo',
                            dataIndex: 'plazo',
                            align: 'center',
                            width: 60
                        }, {
                            header: 'idcliente',
                            hidden: true,
                            dataIndex: 'idcliente',
                            align: 'center',
                            width: 80
                        }, {
                            header: 'Total pendiente',
                            dataIndex: 'balancetotal',
                            align: 'right',
                            width: 80,
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return scope.formatoMoneda(value);
                                } else {
                                    return '';
                                }
                            }
                        }, {
                            header: '0-30' + ' ' + etiquetas.lbDias,
                            dataIndex: 'ceroatreinta',
                            align: 'right',
                            width: 80,
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return scope.formatoMoneda(value);
                                } else {
                                    return '';
                                }
                            }
                        }, {
                            header: '31-60' + ' ' + etiquetas.lbDias,
                            dataIndex: 'cuarentayseisasesenta',
                            align: 'right',
                            width: 80,
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return scope.formatoMoneda(value);
                                } else {
                                    return '';
                                }
                            }
                        }, {
                            header: etiquetas.lb61a90 + ' ' + etiquetas.lbDias,
                            dataIndex: 'sesentayunoanoventa',
                            align: 'right',
                            width: 80,
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return scope.formatoMoneda(value);
                                } else {
                                    return '';
                                }
                            }
                        }, {
                            header: '91-120' + ' ' + etiquetas.lbDias,
                            dataIndex: 'noventayunoacientoochenta',
                            align: 'right',
                            width: 80,
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return scope.formatoMoneda(value);
                                } else {
                                    return '';
                                }
                            }
                        }, {
                            header: "M&aacute;s 120" + ' ' + etiquetas.lbDias,
                            dataIndex: 'mascientoochenta',
                            align: 'right',
                            width: 80,
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return scope.formatoMoneda(value);
                                } else {
                                    return '';
                                }
                            }
                        }, {
                            // header: etiquetas.lbTotalAtraso,
                            header: 'Total vencido',
                            dataIndex: 'totalatraso',
                            align: 'right',
                            width: 80,
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return scope.formatoMoneda(value);
                                } else {
                                    return '';
                                }
                            }
                        }, /*{
                            header: etiquetas.lbPorcientoAtraso,
                            dataIndex: 'porcientoatraso',
                            align: 'center',
                            width: 80,
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return scope.formatoMoneda(value);
                                } else {
                                    return '';
                                }
                            }
                        },*/ {
                            header: etiquetas.lbEntidad,
                            dataIndex: 'descripcionestructura',
                            sortable: true,
                            hidden: true,
                            hideable: false
                        }]));
                    break;
                case '666':
                    var reader = new Ext.data.JsonReader({
                        fields: [
                            {name: 'nombrecliente'},
                            {name: 'descripcionestructura'},
                            {name: 'urbanizacion'},
                            {name: 'edificio'},
                            {name: 'apto'},
                            {name: 'fecharecepcion'},
                            {name: 'totalpago'},
                            {name: 'totalnopago'}
                        ]
                    });
                    view.btnVistaPreliminar.enable();
                    view.gpDatosReporte.reconfigure(
                        new Ext.data.GroupingStore({
                            reader: reader,
                            data: viewdata,
                            sortInfo: {field: 'nombrecliente', direction: "ASC"},
                            groupField: 'descripcionestructura'
                        }),
                        new Ext.grid.ColumnModel([
                            {
                                header: etiquetas.lbCliente,
                                dataIndex: 'nombrecliente',
                                align: 'left',
                                width: 200
                            }, {
                                header: etiquetas.lbEntidad,
                                dataIndex: 'descripcionestructura',
                                hidden: true,
                                hideable: false
                            }, {
                                header: etiquetas.lbUrbanizacion,
                                dataIndex: 'urbanizacion',
                                align: 'left'
                            }, {
                                header: etiquetas.lbEdificio,
                                dataIndex: 'edificio',
                                align: 'left'
                            }, {
                                header: etiquetas.lbApto,
                                dataIndex: 'apto',
                                align: 'left'
                            }, {
                                header: etiquetas.lbFechaRecibo,
                                dataIndex: 'fecharecepcion'
                            }, {
                                header: etiquetas.lbTotalPago,
                                dataIndex: 'totalpago',
                                align: 'left'
                            }, {
                                header: etiquetas.lbTotalNoPago,
                                dataIndex: 'totalnopago',
                                align: 'left'
                            }
                        ]));
                    break;
                case '667':
                case '668':
                case '670':
                case '671':
                    scope.confRptCuentasXCobrarPagar(viewdata, 1);
                    break;
                case '669':
                    scope.confRptCuentasXCobrarPagar(viewdata, 2);
                    break;
                case '672':
                    scope.confRptCuentasXCobrarPagar(viewdata, 1);
                    break;
                case '675':
                    /* Certificacion cuentas X pagar */
                    scope.confRptCertificacionCxPVencidasMas6Mess(viewdata);
                    break;
                case '676': /* Conciliacion de obligaciones de pago */
                case '679': /* Conciliacion de obligaciones fiscales */
                case '677': /* Conciliacion de derechos de cobro */
                case '678': /* Conciliacion de derechos fiscales */
                    scope.confRptConciliacionOPFDCF(viewdata, idreporte);
                    break;
                case '680': /* Conciliacion de pagos anticipados */
                case '681': /* Conciliacion de cobros anticipados */
                    scope.confRptConciliacionPCAnt(viewdata);
                    break;
                case '682': /* Importe total de obligaciones de pago pendientes */
                case '683': /* Importe total de derechos de cobro pendientes */
                    scope.confRptImpTotalDCOPP(viewdata, idreporte);
                    break;
                case '684': /* Listado de derechos de cobros o cuentas X cobrar */
                case '685': /* Listado de obligaciones de pago o cuentas X pagar */
                    scope.confRptListadoDCOP(viewdata, idreporte);
                    break;
                case '686-687':/* SUBMAYOR CUENTAS POR COBRAR */
                    scope.confRptSubmayor(viewdata, 1);
                    break;
                case '688-689':/* SUBMAYOR CUENTAS POR PAGAR */
                    scope.confRptSubmayor(viewdata, 2);
                    break;
                case '690-691':/* SUBMAYOR DE COBROS ANTICIPADOS */
                    scope.confRptSubmayorAnticipo(viewdata, 1);
                    break;
                case '692-693': /* SUBMAYOR DE PAGOS ANTICIPADOS */
                    scope.confRptSubmayorAnticipo(viewdata, 2);
                    break;
                case '696':
                case '697':
                    scope.confRptAnalisisDA(viewdata, idreporte);
                    break;
                case '698':
                case '699':
                    scope.confRptAntiguedadPPend(viewdata, idreporte);
                    break;
                default :
                    break;
            }
        };

        /* ESTE ES NUEVO PROBANDO HAY QUE ARREGLARLO CUANDO SE IMPLEMENTEN LAS FUNCIONES DE BD*/
        this.confRptSubmayor = function (viewdata, type) {
            view.gpDatosReporte.getView().getRowClass = function (record, index, rowParams, store) {
                if (record.json.numero) {
                    if (record.json.numero.toLowerCase().indexOf('<b>subtotal</b>') !== -1) {
                        return 'FilaSubtotal';
                    } else if (record.json.numero.toLowerCase().indexOf('<b>total</b>') !== -1) {
                        return 'FilaTotal';
                    } else if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                        return 'FilaEncabezado';
                    } else if (record.json.numero.toLowerCase().indexOf('<b>saldo anterior</b>') !== -1) {
                        return 'FilaSubtotal';
                    } else {
                        return '';
                    }
                }
            };
            var fields = [
                {name: 'descripcionestructura'},
                {name: 'numero'},
                {name: 'tipodocumento'},
                {name: 'fecha'},
                {name: 'comentario'},
                {name: 'codigoiso'},
                {name: 'nombre'},
                {name: 'debe'},
                {name: 'haber'},
                {name: 'saldo'},
                {name: 'comprobante'},
                {name: 'descripcioncta'},
                {name: 'concatcta'}
            ];
            var columnModel = [
                {
                    header: etiquetas.lbNoDocumento,
                    dataIndex: 'numero',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '<b>' + record.json.nombre + '</b>';
                        } else if (record.json.numero.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.numero.toLowerCase().indexOf('<b>total</b>') !== -1 ||
                            record.json.numero.toLowerCase().indexOf('<b>saldo anterior</b>') !== -1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbTipoDocumento,
                    dataIndex: 'tipodocumento',
                    width: 60,
                }, /*{
                    header: (type === 1) ? etiquetas.lbCliente : etiquetas.lbProveedor,
                    // dataIndex: 'nombrecliente',
                    dataIndex: 'nombre',
                    align: 'left',
                    width: 170
                },*/ {
                    header: etiquetas.lbFecha,
                    dataIndex: 'fecha',
                    width: 50
                }, {
                    header: etiquetas.lbComentario,
                    dataIndex: 'comentario',
                    width: 250,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.numero.toLowerCase().indexOf('<b>total</b>') !== -1 ||
                            record.json.numero.toLowerCase().indexOf('<b>saldo anterior</b>') !== -1) {
                            metadata.attr = 'style="text-align:right"';
                            return record.json.numero;
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: 'Comprobante',
                    dataIndex: 'comprobante',
                    align: 'right',
                    width: 50
                }, {
                    header: etiquetas.lbDebe,
                    dataIndex: 'debe',
                    width: 50,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbHaber,
                    dataIndex: 'haber',
                    width: 50,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbSaldo,
                    dataIndex: 'saldo',
                    width: 50,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbEntidad,
                    dataIndex: 'descripcionestructura',
                    hidden: true,
                    hideable: false
                }
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            view.gpDatosReporte.reconfigure(
                new Ext.data.GroupingStore({
                    reader: reader,
                    data: viewdata,
                    sortInfo: {field: 'descripcionestructura', direction: "ASC"},
                    groupField: 'descripcionestructura'
                }),
                new Ext.grid.ColumnModel(columnModel)
            );
        };

        this.confRptSubmayorAnticipo = function (viewdata, type) {
            view.gpDatosReporte.getView().getRowClass = function (record, index, rowParams, store) {
                if (record.json.numero) {
                    if (record.json.numero.toLowerCase().indexOf('<b>subtotal</b>') !== -1) {
                        return 'FilaSubtotal';
                    } else if (record.json.numero.toLowerCase().indexOf('<b>total</b>') !== -1) {
                        return 'FilaTotal';
                    } else if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                        return 'FilaEncabezado';
                    } else if (record.json.numero.toLowerCase().indexOf('<b>saldo anterior</b>') !== -1) {
                        return 'FilaSubtotal';
                    } else {
                        return '';
                    }
                }
            };
            var fields = [
                {name: 'descripcionestructura'},
                {name: 'codigoestructura'},
                {name: 'idclientesproveedores'},
                {name: 'numero'},
                {name: 'tipodocumento'},
                {name: 'fecha'},
                {name: 'comentario'},
                {name: 'nombre'},
                {name: 'debe'},
                {name: 'haber'},
                {name: 'saldo'},
                {name: 'comprobante'},
                {name: 'idcuenta'},
                {name: 'cuenta'}
            ];
            var columnModel = [
                {
                    header: etiquetas.lbNoDocumento,
                    dataIndex: 'numero',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '<b>' + record.json.nombre + '</b>';
                        } else if (record.json.numero.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.numero.toLowerCase().indexOf('<b>total</b>') !== -1 ||
                            record.json.numero.toLowerCase().indexOf('<b>saldo anterior</b>') !== -1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbTipoDocumento,
                    width: 60,
                    dataIndex: 'tipodocumento'
                }, {
                    header: etiquetas.lbFecha,
                    dataIndex: 'fecha',
                    width: 50,
                }, {
                    header: etiquetas.lbComentario,
                    width: 250,
                    dataIndex: 'comentario',
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.numero.toLowerCase().indexOf('<b>total</b>') !== -1 ||
                            record.json.numero.toLowerCase().indexOf('<b>saldo anterior</b>') !== -1) {
                            metadata.attr = 'style="text-align:right"';
                            return record.data.numero;
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: 'Comprobante',
                    width: 50,
                    dataIndex: 'comprobante',
                    align: 'right'
                }, {
                    header: etiquetas.lbDebe,
                    dataIndex: 'debe',
                    width: 50,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbHaber,
                    dataIndex: 'haber',
                    width: 50,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbSaldo,
                    dataIndex: 'saldo',
                    width: 50,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbEntidad,
                    dataIndex: 'descripcionestructura',
                    hidden: true,
                    hideable: false
                }
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            view.gpDatosReporte.reconfigure(
                new Ext.data.GroupingStore({
                    reader: reader,
                    data: viewdata,
                    sortInfo: {field: 'descripcionestructura', direction: "ASC"},
                    groupField: 'descripcionestructura'
                }),
                new Ext.grid.ColumnModel(columnModel)
            );
        };

        /* ESTE ES NUEVO PROBANDO HAY QUE ARREGLARLO CUANDO SE IMPLEMENTEN LAS FUNCIONES DE BD*/
        this.confRptAnalisisDA = function (viewdata, idreporte) {
            /* type: 1-Deudores, 2-Acreedores */
            view.gpDatosReporte.getView().getRowClass = function (record, index, rowParams, store) {
                if (record.json.nodocumento.toLowerCase().indexOf('<b>subtotal</b>') !== -1) {
                    return 'FilaSubtotal';
                } else if (record.json.nodocumento.toLowerCase().indexOf('<b>total</b>') !== -1) {
                    return 'FilaTotal';
                } else if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                    return 'FilaEncabezado';
                }
            };

            var text = (idreporte == 697) ? etiquetas.lbDeudor : etiquetas.lbAcreedor;

            var fields = [
                {name: 'descripcionestructura'},
                {name: 'nodocumento'},
                {name: 'fecha'},
                {name: 'hasta30'},
                {name: 'hasta60'},
                {name: 'hasta90'},
                {name: 'hasta120'},
                {name: 'hasta180'},
                {name: 'mas180'},
                {name: 'total'},
                {name: 'moneda'},
                {name: 'clienteprov'}
            ];
            var columnModel = [
                {
                    header: (idreporte == 697) ? etiquetas.lbNoDerecho : etiquetas.lbNoObligacion,
                    dataIndex: 'nodocumento',
                    width: 250,
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '<b>' + text + ': ' + record.json.clienteproveedor + '</b>';
                        } else if (record.json.nodocumento.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.nodocumento.toLowerCase().indexOf('<b>total</b>') !== -1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbFecha,
                    dataIndex: 'fecha',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.nodocumento.toLowerCase().indexOf('<b>total</b>') !== -1) {
                            metadata.attr = 'style="text-align:right"';
                            return record.json.nodocumento;
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbhasta + ' 30',
                    dataIndex: 'hasta30',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbhasta + ' 60',
                    dataIndex: 'hasta60',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbhasta + ' 90',
                    dataIndex: 'hasta90',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbhasta + ' 120',
                    dataIndex: 'hasta120',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbhasta + ' 180',
                    dataIndex: 'hasta180',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbPlusOf + ' 180',
                    dataIndex: 'mas180',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbTotal,
                    dataIndex: 'total',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbEntidad,
                    dataIndex: 'descripcionestructura',
                    hidden: true,
                    hideable: false
                }
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            view.gpDatosReporte.reconfigure(
                new Ext.data.GroupingStore({
                    reader: reader,
                    data: viewdata,
                    sortInfo: {field: 'descripcionestructura', direction: "ASC"},
                    groupField: 'descripcionestructura'
                }),
                new Ext.grid.ColumnModel(columnModel)
            );
        };

        /* ESTE ES NUEVO PROBANDO HAY QUE ARREGLARLO CUANDO SE IMPLEMENTEN LAS FUNCIONES DE BD*/
        this.confRptAntiguedadPPend = function (viewdata, idreporte) {
            view.gpDatosReporte.getView().getRowClass = function (record, index, rowParams, store) {
                if (record.json.nodocumento.toLowerCase().indexOf('<b>subtotal</b>') !== -1) {
                    return 'FilaSubtotal';
                } else if (record.json.nodocumento.toLowerCase().indexOf('<b>total</b>') !== -1) {
                    return 'FilaTotal';
                } else if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                    return 'FilaEncabezado';
                } else {
                    return '';
                }
            };

            var text = (idreporte == 699) ? etiquetas.lbDeudor : etiquetas.lbAcreedor;

            var fields = [
                {name: 'descripcionestructura'},
                {name: 'nodocumento'},
                {name: 'fecha'},
                {name: 'vence'},
                {name: 'edad'},
                {name: 'novencidas'},
                {name: 'hasta30'},
                {name: 'hasta60'},
                {name: 'hasta90'},
                {name: 'hasta120'},
                {name: 'mas120'},
                {name: 'total'},
                {name: 'moneda'},
                {name: 'clienteprov'}
            ];
            var columnModel = [
                {
                    header: (idreporte == 699) ? etiquetas.lbNoDerecho : etiquetas.lbNoObligacion,
                    dataIndex: 'nodocumento',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '<b>' + text + ': ' + record.json.clienteproveedor + '</b>';
                        } else if (record.json.nodocumento.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.nodocumento.toLowerCase().indexOf('<b>total</b>') !== -1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbFecha,
                    dataIndex: 'fecha'
                }, {
                    header: etiquetas.lbFechaCaducidad,
                    dataIndex: 'vence',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.nodocumento.toLowerCase().indexOf('<b>total</b>') !== -1) {
                            metadata.attr = 'style="text-align:right"';
                            return record.json.nodocumento;
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbDiasAntig,
                    dataIndex: 'edad',
                    align: 'center'
                }, {
                    header: etiquetas.lbNoVencidas,
                    dataIndex: 'novencidas',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbhasta + ' 30',
                    dataIndex: 'hasta30',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbhasta + ' 60',
                    dataIndex: 'hasta60',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbhasta + ' 90',
                    dataIndex: 'hasta90',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbhasta + ' 120',
                    dataIndex: 'hasta120',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbPlusOf + ' 120',
                    dataIndex: 'mas120',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbTotal,
                    dataIndex: 'total',
                    renderer: function (value, metadata, record) {
                        if (record.json.nodocumento.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    },
                    align: 'right'
                }, {
                    header: etiquetas.lbEntidad,
                    dataIndex: 'descripcionestructura',
                    hidden: true,
                    hideable: false
                }
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            view.gpDatosReporte.reconfigure(
                new Ext.data.GroupingStore({
                    reader: reader,
                    data: viewdata,
                    sortInfo: {field: 'descripcionestructura', direction: "ASC"},
                    groupField: 'descripcionestructura'
                }),
                new Ext.grid.ColumnModel(columnModel)
            );
        };

        /* ESTE ES NUEVO PROBANDO HAY QUE ARREGLARLO CUANDO SE IMPLEMENTEN LAS FUNCIONES DE BD*/
        this.confRptConciliacionPCAnt = function (viewdata) {
            view.gpDatosReporte.getView().getRowClass = function (record, index, rowParams, store) {
                return '';
            };
            var fields = [
                {name: 'descripcionestructura'},
                {name: 'codigoestructura'},
                {name: 'idestructuracomun'},
                {name: 'numero'},
                {name: 'fecha'},
                {name: 'importe'},
                {name: 'codcliente'},
                {name: 'nomcliente'},
                {name: 'idcliente'},
                {name: 'moneda'},
                {name: 'nuevoplazo'},
                {name: 'comentario'}
            ];
            var columnModel = [
                {
                    header: etiquetas.lbNoInstrumento,
                    dataIndex: 'numero',
                    width: 250
                }, {
                    header: etiquetas.lbFecha,
                    dataIndex: 'fecha'
                }, {
                    header: etiquetas.lbImporte,
                    dataIndex: 'importe',
                    renderer: formatoMoneda,
                    align: 'right'
                }, {
                    header: etiquetas.lbMoneda,
                    dataIndex: 'moneda'
                }, {
                    header: etiquetas.lbComentario,
                    dataIndex: 'comentario'
                }, {
                    header: etiquetas.lbEntidad,
                    dataIndex: 'descripcionestructura',
                    hidden: true,
                    hideable: false
                }
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            view.gpDatosReporte.reconfigure(
                new Ext.data.GroupingStore({
                    reader: reader,
                    data: viewdata,
                    sortInfo: {field: 'descripcionestructura', direction: "ASC"},
                    groupField: 'descripcionestructura'
                }),
                new Ext.grid.ColumnModel(columnModel)
            );
        };

        /* ESTE ES NUEVO PROBANDO HAY QUE ARREGLARLO CUANDO SE IMPLEMENTEN LAS FUNCIONES DE BD*/
        this.confRptListadoDCOP = function (viewdata, idreporte) {
            view.gpDatosReporte.getView().getRowClass = function (record, index, rowParams, store) {
                if (record.json.numero.toLowerCase().indexOf('<b>subtotal</b>') !== -1) {
                    return 'FilaSubtotal';
                } else if (record.json.numero.toLowerCase().indexOf('<b>total</b>') !== -1) {
                    return 'FilaTotal';
                } else if (record.json.numero.toLowerCase().indexOf('<b>break</b>') !== -1) {
                    return 'FilaTotal';
                } else if (record.json.numero.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                    return 'FilaEncabezado';
                } else {
                    return '';
                }
            };

            var fields = [
                {name: 'descripcionestructura'},
                {name: 'codigoestructura'},
                {name: 'idestructuracomun'},
                {name: 'numero'},
                {name: 'tipo_doc'},
                {name: 'fecha'},
                {name: 'importemo'},
                {name: 'importemb'},
                {name: 'codigocliente'},
                {name: 'nomcliente'},
                {name: 'moneda'},
            ];
            var columnModel = [
                {
                    header: (idreporte == 684) ? etiquetas.lbNoDerecho : etiquetas.lbNoObligacion,
                    dataIndex: 'numero',
                    width: 250,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.numero.toLowerCase().indexOf('<b>total</b>') !== -1 ||
                            record.json.numero.toLowerCase().indexOf('<b>break</b>') !== -1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbFecha,
                    dataIndex: 'fecha'
                }, {
                    header: (idreporte == 684) ? etiquetas.lbCliente : etiquetas.lbProveedor,
                    dataIndex: 'nomcliente'
                }, {
                    header: etiquetas.lbImporte,
                    dataIndex: 'importemo',
                    renderer: formatoMoneda,
                    align: 'right'
                }, {
                    header: etiquetas.lbMoneda,
                    dataIndex: 'moneda',
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>subtotal</b>') !== -1) {
                            metadata.attr = 'style="text-align:right"';
                            return '<b>SUBTOTAL</b>';
                        } else if (record.json.numero.toLowerCase().indexOf('<b>break</b>') !== -1) { //cuando es un total
                            metadata.attr = 'style="text-align:right"';
                            return '<b>TOTAL</b>';
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbImporteContable,
                    dataIndex: 'importemb',
                    renderer: formatoMoneda,
                    align: 'right'
                }, {
                    header: etiquetas.lbEntidad,
                    dataIndex: 'descripcionestructura',
                    hidden: true,
                    hideable: false
                }
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            view.gpDatosReporte.reconfigure(
                new Ext.data.GroupingStore({
                    reader: reader,
                    data: viewdata,
                    sortInfo: {field: 'descripcionestructura', direction: "ASC"},
                    groupField: 'descripcionestructura'
                }),
                new Ext.grid.ColumnModel(columnModel)
            );
        };

        /* ESTE ES NUEVO PROBANDO HAY QUE ARREGLARLO CUANDO SE IMPLEMENTEN LAS FUNCIONES DE BD*/
        this.confRptImpTotalDCOPP = function (viewdata, idreporte) {
            view.gpDatosReporte.getView().getRowClass = function (record, index, rowParams, store) {
                if (record.json.numero.toLowerCase().indexOf('<b>break</b>') !== -1) {
                    return 'FilaSubtotal';
                } else {
                    return '';
                }
            };
            /* type: 1-Cobro, 2-Pago */
            var fields = [
                {name: 'descripcionestructura'},
                {name: 'idestructuracomun'},
                {name: 'codigoestructura'},
                {name: 'idcliente'},
                {name: 'codigocliente'},
                {name: 'nomcliente'},
                {name: 'numero'},
                {name: 'fecha'},
                {name: 'importemo'}, // importe original
                {name: 'importemb'}, // importe contable
                {name: 'comentario'},
                {name: 'moneda'}
            ];
            var columnModel = [
                {
                    header: (idreporte == 683) ? etiquetas.lbNoDerecho : etiquetas.lbNoObligacion,
                    dataIndex: 'numero',
                    width: 250,
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>break</b>') !== -1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbFecha,
                    dataIndex: 'fecha'
                }, {
                    header: etiquetas.lbComentario,
                    width: 250,
                    dataIndex: 'comentario',
                    renderer: function (value, metadata, record) {
                        if (record.json.numero.toLowerCase().indexOf('<b>break</b>') !== -1) {
                            metadata.attr = 'style="text-align:right"';
                            return "TOTAL PENDIENTE:";
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbImporteOriginal,
                    dataIndex: 'importemo',
                    renderer: formatoMoneda,
                    align: 'right'
                }, {
                    header: etiquetas.lbImporteContable,
                    dataIndex: 'importemb',
                    renderer: formatoMoneda,
                    align: 'right'
                }, {
                    header: etiquetas.lbEntidad,
                    dataIndex: 'descripcionestructura',
                    hidden: true,
                    hideable: false
                }
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            view.gpDatosReporte.reconfigure(
                new Ext.data.GroupingStore({
                    reader: reader,
                    data: viewdata,
                    sortInfo: {field: 'descripcionestructura', direction: "ASC"},
                    groupField: 'descripcionestructura'
                }),
                new Ext.grid.ColumnModel(columnModel)
            );
        };

        /* ESTE ES NUEVO PROBANDO HAY QUE ARREGLARLO CUANDO SE IMPLEMENTEN LAS FUNCIONES DE BD*/
        this.confRptConciliacionOPFDCF = function (viewdata, idreporte) {
            view.gpDatosReporte.getView().getRowClass = function (record, index, rowParams, store) {
                return '';
            };
            /* type: 1-Cobro, 2-Pago */
            var fields = [
                {name: 'numero'},
                {name: 'fecha'},
                {name: 'idcliente'},
                {name: 'importe'},
                {name: 'moneda'},
                {name: 'codigocliente'},
                {name: 'nomcliente'},
                {name: 'idestructuracomun'},
                {name: 'codigoestructura'},
                {name: 'nuevoplazo'},
                {name: 'descripcionestructura'}
//                {name: 'fechainicio'},
//                {name: 'fechafin'}
            ];
            var columnModel = [
                {
                    header: (idreporte == 677 || idreporte == 678) ? etiquetas.lbNoDerecho : etiquetas.lbNoObligacion,
                    dataIndex: 'numero',
                    width: 250
                }, {
                    header: etiquetas.lbFecha,
                    dataIndex: 'fecha'
                }, {
                    header: etiquetas.lbImporte,
                    dataIndex: 'importe',
                    renderer: formatoMoneda,
                    //align: 'right'
                }, {
                    header: etiquetas.lbMoneda,
                    dataIndex: 'moneda',
                    //align: 'center'
                }, {
                    header: 'Plazo',//etiquetas.lbNuevoPlazo,
                    dataIndex: 'nuevoplazo',
                    //align: 'right'
                }, {
                    hidden: true,
                    hideable: false,
                    header: etiquetas.lbComentario,
                    dataIndex: 'comentario'
                }, {
                    header: etiquetas.lbEntidad,
                    dataIndex: 'descripcionestructura',
                    hidden: true,
                    hideable: false
                }
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            view.gpDatosReporte.reconfigure(
                new Ext.data.GroupingStore({
                    reader: reader,
                    data: viewdata,
                    sortInfo: {field: 'descripcionestructura', direction: "ASC"},
                    groupField: 'descripcionestructura'
                }),
                new Ext.grid.ColumnModel(columnModel)
            );
        };

        this.confRptCertificacionCxPVencidasMas6Mess = function (viewdata) {
            view.gpDatosReporte.getView().getRowClass = function (record, index, rowParams, store) {
                return '';
            };
            var fields = [
                {name: 'descripcionestructura'},
                {name: 'organismo'},
                {name: 'codigo'},
                {name: 'entidadacreedora'},
                {name: 'banco'},
                {name: 'importe'}
            ];
            var columnModel = [
                {
                    header: etiquetas.lbEntidadAcreedora,
                    dataIndex: 'entidadacreedora',
                    width: 250
                }, {
                    header: etiquetas.lbBancoSucursal,
                    dataIndex: 'banco'
                }, {
                    header: etiquetas.lbImporte,
                    dataIndex: 'importe',
                    align: 'right'
                }, {
                    header: etiquetas.lbEntidad,
                    dataIndex: 'descripcionestructura',
                    hidden: true,
                    hideable: false
                }
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            view.gpDatosReporte.reconfigure(
                new Ext.data.GroupingStore({
                    reader: reader,
                    data: viewdata,
                    sortInfo: {field: 'descripcionestructura', direction: "ASC"},
                    groupField: 'descripcionestructura'
                }),
                new Ext.grid.ColumnModel(columnModel)
            );
        };

        /* Todas las cuentas pro cobrar-pagar */
        this.confRptCuentasXCobrarPagar = function (viewdata, type) {
            view.gpDatosReporte.getView().getRowClass = function (record, index, rowParams, store) {
                if (record.json.comentario) {
                    if (record.json.comentario.toLowerCase().indexOf('<b>subtotal</b>') !== -1) {
                        return 'FilaSubtotal';
                    } else if (record.json.comentario.toLowerCase().indexOf('<b>total</b>') !== -1) {
                        return 'FilaTotal';
                    } else if (record.json.comentario.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                        return 'FilaEncabezado';
                    } else {
                        return '';
                    }
                }
            };
            var fields = [
                {name: 'idestructuracomun'},
                {name: 'descripcionestructura'},
                {name: 'numoblig'},
                {name: 'fecharecepcion'},
                {name: 'fechaentrega'},
                {name: 'numcomprobante'},
                {name: 'importemb'},
                {name: 'importeliquidado'},
                {name: 'importependiente'},
                {name: 'vence'},
                {name: 'edad'},
                {name: 'idproveedor'},
                {name: 'proveedor'},
                {name: 'vence'},
                {name: 'clavecuenta'},
                {name: 'plazo'},
                {name: 'comentario'}
            ];
            var columnModel = [
                {
                    header: etiquetas.lbNoObligacion,
                    dataIndex: 'numoblig',
                    width: 100
                }, {
                    header: (type === 1) ? etiquetas.lbCliente : etiquetas.lbProveedor,
                    dataIndex: 'proveedor',
                    align: 'left',
                    hidden: true,
                    width: 150
                }, {
                    header: etiquetas.lbEntidad,
                    dataIndex: 'descripcionestructura',
                    hidden: true,
                    hideable: false
                }, {
                    header: 'Fecha entrega',
                    dataIndex: 'fechaentrega',
                    align: 'center',
                    width: 40
                }, {
                    header: etiquetas.lbCuenta,
                    dataIndex: 'clavecuenta',
                    align: 'left',
                    width: 50
                }, {
                    header: 'Detalle',
                    dataIndex: 'comentario',
                    align: 'left',
                    width: 100,
                    renderer: function (value, metadata, record) {
                        if (record.json.comentario.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.comentario.toLowerCase().indexOf('<b>total</b>') !== -1) {
                            metadata.attr = 'style="text-align:right"';
                        }
                        if (record.json.comentario.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else
                            return value;
                    }
                }, {
                    header: etiquetas.lbImporte,
                    dataIndex: 'importemb',
                    align: 'right',
                    width: 50,
                    renderer: function (value, metadata, record) {
                        if (record.json.comentario.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    }
                }, {
                    header: 'Liquidado',
                    dataIndex: 'importeliquidado',
                    align: 'right',
                    width: 50,
                    renderer: function (value, metadata, record) {
                        if (record.json.comentario.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    }
                }, {
                    header: 'Por liquidar',
                    dataIndex: 'importependiente',
                    align: 'right',
                    width: 50,
                    renderer: function (value, metadata, record) {
                        if (record.json.comentario.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return scope.formatoMoneda(value);
                        }
                    }
                }, {
                    header: 'Plazo',
                    dataIndex: 'plazo',
                    align: 'center',
                    width: 40,
                    renderer: function (value, metadata, record) {
                        if (record.json.comentario.toLowerCase().indexOf('<b>encabezado</b>') !== -1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }, {
                    header: etiquetas.lbAntiguedad + ' (' + etiquetas.lbDias + ')',
                    dataIndex: 'edad',
                    align: 'center',
                    width: 40
                }, {
                    header: etiquetas.lbVence,
                    dataIndex: 'vence',
                    align: 'center',
                    width: 40,
                    renderer: function (value, metadata, record) {
                        if (record.json.comentario.toLowerCase().indexOf('<b>encabezado</b>') !== -1 ||
                            record.json.comentario.toLowerCase().indexOf('<b>subtotal</b>') !== -1 ||
                            record.json.comentario.toLowerCase().indexOf('<b>total</b>') !== -1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }/*, {
                    header: etiquetas.lbComprobante,
                    dataIndex: 'numcomprobante',
                    align: 'left',
                    width: 40
                }*/
            ];
            /* ESTO ES SOLO PARA TODAS LAS CUENTAS X COBRAR / PAGAR  */
            if (type && type === 2) {
                fields.push({name: 'nomespecialidad'});
            }

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            view.btnVistaPreliminar.enable();
            view.gpDatosReporte.reconfigure(
                new Ext.data.GroupingStore({
                    reader: reader,
                    data: viewdata,
                    // sortInfo: {field: 'numoblig', direction: "ASC"},
                    sortInfo: {field: 'proveedor', direction: "ASC"},
                    groupField: 'descripcionestructura'
                }),
                new Ext.grid.ColumnModel(columnModel)
            );
        };

        this.fAddReports = function () {
            model.stReportes.add(view.p10);
            model.stReportes.add(view.p7);
            model.stReportes.add(view.p23);
            model.stReportes.add(view.p22);
            model.stReportes.add(view.p24);
            model.stReportes.add(view.p25);
            model.stReportes.add(view.p33);
            model.stReportes.add(view.p32);
            //BALANCE DE ANTIGUEDAD COBRO-PAGO ANTICIPADO
            model.stReportes.add(view.p35);
            model.stReportes.add(view.p36);
        };

        this.fOpenWindowReport = function () {
            if (view.ventanaVerDetalles.isVisible()) {
                var records = view.gpGestionarDuo.getStore().getRange();
                var cuerpo = [];
                for (var i = 0; i < records.length; i++) {
                    cuerpo.push(records[i].json);
                }
                var datos = [{
                    datoCuerpo: cuerpo,
                    datoGeneral: {
                        fechaemision: scope.responseDataReporte.dataSources[0].datoGeneral.fechaemision,
                        reporte: 80007,
                        idRptBalance: view.cbReportes.getValue(),
                        titulo: view.cbReportes.getRawValue(),
                        hasta: view.fechaFin.getRawValue()
                    }
                }];
            } else {
                var datos = scope.responseDataReporte.dataSources;
                datos[0].datoCuerpo = [];//cuando el data cuerpo este vacio es que voy a aplicar la variante
                datos[0].datoParametros = scope.parametrosUltimoReporte;//los datos necesarios para obtener el datoCuerpo en el servidor
            }
            scope.component = new SCFPrintView(datos, "/contabilidad/comun/SCFPrintView/", scope.defaultComponentsValue);
            scope.component.show();
            scope.component.cbxTipoHoja.focus(true, 10);
        };

        this.formIsValid = function () {
            var invalid = {};
            /* validando que existan cuentas seleccionadas */
            if (view.cbCuenta && view.cbCuenta.rendered) {
                if (!view.cbCuenta.isValid()) {
                    invalid.Cuenta = true;
                } else {
                    delete invalid.Cuenta;
                }
            }
            if (view.cbMoneda && view.cbMoneda.rendered) {
                if (!view.cbMoneda.isValid()) {
                    invalid.Moneda = true;
                } else {
                    delete invalid.Moneda;
                }
            }

            /*if(view.cbMoneda && view.cbMoneda.getValue() == "") {
             view.btnAceptar.disable();
             }
             else
             view.btnAceptar.enable();*/
            /** validando que si esta renderizado el combo de tipo de documento
             * al menos uno seleccionados
             */
            if (view.cbxDocTypes && Ext.getCmp('cbxDocTypes')) {
                if (!view.cbxDocTypes.isValid()) {
                    invalid.tipoDoc = true;
                } else {
                    delete invalid.tipoDoc;
                }
            }
            return view.pReportes.getForm().isValid() && !Object.keys(invalid).length;
        };

        this.notifyEvent = function (animateTarget, title, msg, icon, time, callback) {
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

        scope.formatoMoneda = function (v) {
            if (v == 0)
                return '0.00';
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
            v = String(v);
            var ps = v.split(".");
            var whole = ps[0];
            var sub = ps[1] ? "." + ps[1] : ".00";
            var r = /(\d+)(\d{3})/;
            while (r.test(whole)) {
                whole = whole.replace(r, "$1" + "," + "$2");
            }
            v = whole + sub;
            if (v.charAt(0) == "-") {//caso saldo negativo
                return "(" + v.substr(1) + ")";
            }
            return v;
        };
    }
}
;
