//Empaquetando el componente tipo Reportes.
Ext.ns('Caja.Reportes');

Caja.Reportes.Controller = {
    responseData: undefined,
    init: function (etiquetas, view, model) {
        var scope = this;
        this.busyRequest = {};

        this.hotkeysReportes();
        this.crearEventos(etiquetas, view, model);
        this.crearFunciones(etiquetas, view, model);

        Ext.Msg.wait('Cargando...', 'Por favor espere...');

        Ext.Ajax.request({
            scope: this,
            method: "POST",
            url: "loadDataComponent",
            callback: function (options, success, response) {
                scope.responseData = Ext.decode(response.responseText);

                if (scope.responseData.Entidades.datos.length > 0)
                    Ext.getCmp('gpEntidad').getStore().loadData(scope.responseData.Entidades);
                if (scope.responseData.Ejercicios.datos.length > 0)
                    Ext.getCmp('gpEjercicio').getStore().loadData(scope.responseData.Ejercicios);
                if (scope.responseData.Periodos.datos.length > 0)
                    Ext.getCmp('gpPeriodo').getStore().loadData(scope.responseData.Periodos);

                // scope.fAddReports();
                Ext.Msg.hide();

            }
        });

        // view.loadWindowCaja();
        //-----------------
    },
    hotkeysReportes: function () {
        var scope = this;
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
    },
    lMask: function (mensaje) {
        loadMask = new Ext.LoadMask(Ext.getBody(), {
            msg: mensaje
        });
        loadMask.show();
    },
    crearEventos: function (etiquetas, view, model) {
        var scope = this;

        // para que el grid ocupe el resto del viewport
        view.gpDatosReporte.on({
            beforerender: function (component) {
                component.setHeight(view.vpServicios.getSize().height - Ext.getCmp('topPanel').getSize().height);
                component.doLayout();
            }
        });

        Ext.getCmp('gpEntidad').getStore().on('load', function (store, records, options) {
            var cbxComponente = Ext.getCmp('cbxEntidad');
            if (scope.responseData.Entidades.Actual && cbxComponente.fSelect.values.length == 0) {
                for (i = 0; i < store.getCount(); i++)
                    if (store.getAt(i).id == scope.responseData.Entidades.Actual) {
                        cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                        cbxComponente.fSelect.values.push(store.getAt(i).id);
                        cbxComponente.fSelect.index.push(i);
                    }
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
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
            if (scope.responseData.Ejercicios.Actual && cbxComponente.fSelect.values.length == 0) {
                for (i = 0; i < store.getCount(); i++)
                    if (store.getAt(i).idejercicio == scope.responseData.Ejercicios.Actual) {
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
                scope.fSetValuesFechas(scope.responseData.Periodos.fechaInicio, scope.responseData.Periodos.fechaFin);
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

        //-----
        view.btnVistaPreliminar.on('click', function () {
            scope.fOpenWindowReport();
        });

        view.smDatosReporte.on({
            rowselect: function (selectionModel, rowIndex, record) {
                view.btnAbrirComprobante.setVisible((record.data.idcomprobante != undefined) ? ((record.data.idcomprobante.length > 0) ? true : false) : false);
            },
            rowdeselect: function (selectionModel, rowIndex, record) {
                view.btnAbrirComprobante.setVisible(false);
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
            var data = Grid.getStore().getAt(rowIndex).data;
            if (data.idcomprobante != undefined)
                if (data.idcomprobante.length > 0)
                    view.btnAbrirComprobante.fireEvent('click');
        });

    },
    crearFunciones: function (etiquetas, view, model) {
        var scope = this;

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

        this.fValorActualCopy = function (store, identificador, identificadorAntecesor, idActual) {
            cbxComponente = Ext.getCmp('cbx' + identificador);
            if (idActual && cbxComponente.fSelect.values.length == 0) {
                for (i = 0; i < store.getCount(); i++)
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
            recordsLength = recordsSelection.length;
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
            view.fechaInicio.setValue(fechaInicio);
            view.fechaFin.setValue(fechaFin);
            view.fechaInicio.clearInvalid();
            view.fechaFin.clearInvalid();
        };

        this.fResetValuesFecha = function () {
            date = new Date().format('d/m/Y');
            view.fechaInicio.setDisabled(true);
            view.fechaFin.setDisabled(true);
            view.fechaInicio.setValue(null);
            view.fechaFin.setValue(null);
        };

        this.fResetValues = function (component) {
//            component.clearValue();
            component.reset();
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

        this.fOpenWindowReport = function () {
            var datos = scope.responseDataReporte.dataSources;
            var defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            if (view.cbReportes.getValue() == '14009' || view.cbReportes.getValue() == '14006')
                datos[0].datoCuerpo = scope.completeData(datos[0].datoCuerpo);

            scope.component = new SCFPrintView(datos, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            scope.component.show();
            scope.component.cbxTipoHoja.focus(true, 10);
        };

        this.completeData = function (data) {
            for (var i in data) {
                if (data[i].importe > 0) {
                    var letras = convertir_a_letras(data[i].importe);
                    data[i].importeenletras = letras;
                }
            }
            return data;
        };
    }
};