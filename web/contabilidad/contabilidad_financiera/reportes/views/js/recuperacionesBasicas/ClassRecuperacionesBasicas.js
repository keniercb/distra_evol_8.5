Ext.namespace('Ext.CONT.Analisis.ClassRecuperacionesBasicas');
Ext.CONT.Analisis.ClassRecuperacionesBasicas = Ext.extend(Ext.Component, {
    perfil: window.parent.perfil,
    etiquetas: undefined,
    UIRecuperacionesBasicas: undefined,
    responseDataReporte: undefined,
    constructor: function () {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 12000000;
        Ext.CONT.Componentes.MessageBox('msgbIniciando');
        if (!document.getElementById('UIXCombo'))
            this.loadJs("/contabilidad/comun/componentes/xcombo/views/js/UIXCombo", 'UIXCombo');
        if (!document.getElementById('UIRecuperacionesBasicas'))
            this.loadJs("../../views/js/recuperacionesBasicas/UIRecuperacionesBasicas", 'UIRecuperacionesBasicas');
        scope = this;
        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            callback: function (options, success, response) {
                scope.etiquetas = Ext.decode(response.responseText);
                validate.cargarAcciones(function (opts, success, response) {
                    scope.accionesPermitidas = Ext.decode(response.responseText);
                    scope.initializeClass();
                });
            }
        });
    },
    loadJs: function (jsSrc, id) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    initializeClass: function () {
        this.UIRecuperacionesBasicas = new Ext.CONT.Analisis.UIRecuperacionesBasicas(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);
        this.loadDataComponent(this);
        Ext.CONT.Analisis.ClassRecuperacionesBasicas.superclass.constructor.call(this);
    },
    loadDataComponent: function (scope) {
        Ext.Ajax.request({
            method: "POST",
            url: "loadDataComponent",
            callback: function (options, success, response) {
                scope.responseData = Ext.decode(response.responseText);
                if (scope.responseData.Entidades.datos.length > 0) {
                    Ext.getCmp('gpEntidad').getStore().loadData(scope.responseData.Entidades);
                } else {
                    scope.initMsgWarning(1);
                    scope.pnlNorth.disable();
                }
                if (scope.responseData.Ejercicios.datos.length > 0) {
                    Ext.getCmp('gpEjercicio').getStore().loadData(scope.responseData.Ejercicios);
                } else {
                    scope.initMsgWarning(2);
                    scope.pnlNorth.disable();
                }
                if (scope.responseData.Periodos.datos.length > 0) {
                    Ext.getCmp('gpPeriodo').getStore().loadData(scope.responseData.Periodos);
                } else {
                    scope.initMsgWarning(3);
                    scope.pnlNorth.disable();
                }
                if (scope.responseData.Monedas.datos.length > 0) {
                    scope.stMoneda.loadData(scope.responseData.Monedas);
                } else {
                    scope.initMsgWarning(4);
                }
                Ext.CONT.Componentes.HideBox('msgbIniciando');
            }
        });
    },
    initializeEvents: function (scope) {
        Ext.getCmp('gpEntidad').getStore().on('load', function (store, records, options) {
            if (scope.jrEntidad.jsonData.Actual != null)
                scope.fValorActual(store, 'Entidad', scope.responseData.Entidades.Actual);
        });

        Ext.getCmp('gpEntidad').getSelectionModel().on({
            // 'selectionchange': function () {
            //     scope.fResetValues(scope.cbxEjercicio);
            //     scope.fResetValues(scope.cbxPeriodo);
            //     scope.btnAceptar.disable();
            //     scope.cbxReporte.reset();
            //     scope.fResetValuesFecha();
            //     scope.cbxMoneda.clearValue();
            //     scope.cbxMoneda.valuesLoaded = new Array();
            //     scope.pnlNorth.getComponent(1).remove(3, true);
            //     scope.pnlNorth.getComponent(1).remove(2, true);
            //     scope.pnlNorth.getComponent(1).remove(1, true);
            // },
            'rowselect': function (selectionModel, rowIndex, record) {
                Ext.getCmp('btnConsolidar').setVisible(false);
                Ext.getCmp('btnNoConsolidar').setVisible(false);
                //scope.btnAceptar.disable();
                scope.menuConsolidar.IsValidShow(Ext.getCmp('gpEntidad'), rowIndex);
            },
            'rowdeselect': function (selectionModel, rowIndex, record) {
                //scope.btnAceptar.disable();
                var gridPanel = Ext.getCmp('gpEntidad');
                var nodeRoot = gridPanel.getStore().getAt(0);
                if ((record.data.consolidar && !record.data._is_leaf) || selectionModel.getSelections().length == 1) {
                    nodeRoot.data.text = nodeRoot.data.text.replace(scope.etiquetas.lbBtnConsolidar, '');
                    nodeRoot.data.consolidar = false;
                    // record.data.text = record.data.text.replace(scope.etiquetas.lbBtnConsolidar, '');
                    // record.data.consolidar = false;
                    scope.menuConsolidar.UpdateData(gridPanel);
                    Ext.getCmp('btnConsolidar').setVisible(false);
                    Ext.getCmp('btnNoConsolidar').setVisible(false);
                }
                /*var nodeAncestors = gridPanel.getStore().getNodeAncestors(record);
                for (var i = 0; i < nodeAncestors.length; i++) {
                    if (nodeAncestors[i].data.consolidar) {
                        if (scope.menuConsolidar.GetNodeChildrenSelected(gridPanel, gridPanel.getStore().getNodeChildren(nodeAncestors[i])).length == 0) {
                            nodeAncestors[i].data.text = nodeAncestors[i].data.text.replace(scope.etiquetas.lbBtnConsolidar, '');
                            nodeAncestors[i].data.consolidar = false;
                            scope.menuConsolidar.UpdateData(gridPanel);
                        }
                    }
                }*/
            }
        });

        // Ext.getCmp('gpEntidad').on('rowclick', function (gridPanel, rowIndex, e) {
        //     Ext.getCmp('btnConsolidar').setVisible(false);
        //     Ext.getCmp('btnNoConsolidar').setVisible(false);
        //     if (gridPanel.getSelectionModel().isSelected(rowIndex))
        //         scope.menuConsolidar.IsValidShow(gridPanel, rowIndex);
        // });

        Ext.getCmp('gpEjercicio').getStore().on('load', function (store, records, options) {
            if (scope.jrEjercicio.jsonData.Actual != null)
                scope.fValorActualCopy(store, 'Ejercicio', 'Entidad', scope.jrEjercicio.jsonData.Actual);
        });

        this.cbxEjercicio.on('expand', function () {
            if (scope.cbxEntidad.isValid()) {
                if (scope.cbxEjercicio.fIsDirty(scope.cbxEntidad.fSelect.values)) {
                    scope.cbxEjercicio.fSelect.valuesLoaded = scope.cbxEntidad.fSelect.values;
                    Ext.getCmp('gpEjercicio').getStore().removeAll();
                    Ext.getCmp('gpEjercicio').getStore().load({
                        params: {
                            arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values)
                        }
                    });
                }
            } else
                scope.cbxEjercicio.collapse();
        });
        Ext.getCmp('gpEjercicio').getSelectionModel().on('selectionchange', function () {
            scope.fResetValues(scope.cbxPeriodo);
            scope.fResetValuesFecha();
            if (Ext.getCmp('gpEjercicio').getSelectionModel().getSelections().length > 0 || !scope.cbxEjercicio.isValid())
                scope.fSetearFechas(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
        });

        this.cbxPeriodo.on('expand', function () {
            if (scope.cbxEjercicio.isValid()) {
                if (scope.cbxPeriodo.fIsDirty(scope.cbxEjercicio.fSelect.values)) {
                    scope.cbxPeriodo.fSelect.valuesLoaded = scope.cbxEjercicio.fSelect.values;
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
                scope.cbxPeriodo.collapse();
        });
        this.cbxPeriodo.on('change', function () {
            if (!scope.cbxPeriodo.isValid()) {
                mostrarMensaje(1, 'Debes completar el campo del período.');
                scope.btnAceptar.disable();
            } else {
                scope.btnAceptar.enable();
            }
        });

        this.cbxPeriodo.content.getComponent(0).getStore().on('load', function (store, records, options) {
            if (scope.jrPeriodo.jsonData.Actual != null) {
                scope.fValorActualCopy(store, 'Periodo', 'Ejercicio', scope.jrPeriodo.jsonData.Actual);
                scope.fSetValuesFechas(scope.responseData.Periodos.fechaInicio, scope.responseData.Periodos.fechaFin);
            }
        });
        Ext.getCmp('gpPeriodo').getSelectionModel().on('selectionchange', function () {
            selectionsPeriodo = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
            scope.fSetearFechas((selectionsPeriodo.length > 0) ? selectionsPeriodo : Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
        });


        this.stMoneda.on('load', function (store, records, options) {
            scope.cbxMoneda.valuesLoaded = scope.cbxEntidad.fSelect.values;
            scope.cbxMoneda.enable();
            if (records.length <= 0)
                scope.initMsgWarning(4);
            // if (scope.jrMoneda.jsonData.Actual != null)
            //     scope.cbxMoneda.setValue(scope.jrMoneda.jsonData.Actual);
        });
        this.cbxMoneda.on('expand', function () {
            if (scope.cbxEntidad.isValid()) {
                if (scope.fIsDirty(scope.cbxEntidad.fSelect.values, scope.cbxMoneda.valuesLoaded)) {
                    scope.stMoneda.removeAll();
                    scope.cbxMoneda.valuesLoaded = scope.cbxEntidad.fSelect.values;
                    scope.stMoneda.load({
                        params: {
                            arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values)
                        }
                    });
                }
            } else
                scope.cbxMoneda.collapse();
        });

        this.cbxEntidad.on('collapse', function () {
            if (scope.cbxEntidad.isValid())
                if (scope.stMoneda.getCount() == 0) {
                    scope.cbxMoneda.valuesLoaded = scope.cbxEntidad.fSelect.values;
                    scope.cbxMoneda.disable();
                    scope.stMoneda.load({
                        params: {
                            arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values)
                        }
                    });
                }
        });

        this.cbxReporte.on('select', function (combo, record, index) {
            scope.fAddComponent(record.data.idreporte);
            scope.btnAbrirComprobante.hide();

            if (Ext.getCmp('cbxEjercicio').isValid() && Ext.getCmp('cbxPeriodo').isValid())
                scope.btnAceptar.enable();
        });

        this.cbxReporte.on('expand', function (combo, record, index) {
            if (!Ext.getCmp('cbxEntidad').isValid())
                scope.cbxReporte.collapse();
        });

        this.btnAceptar.on('click', function () {
                if (scope.cbxPeriodo.isValid()) {
                    if (scope.cbxReporte.getValue() == '105' || scope.cbxReporte.getValue() == '107') {
                        if (Ext.getCmp('cbxNivel').isValid(true))
                            scope.fAceptoReporte();
                        else
                            Ext.getCmp('cbxNivel').markInvalid(scope.etiquetas.lbBlankText);
                    } else if (scope.cbxReporte.getValue() == '108') {
                        scope.fAceptoReporte();
                    } else if (scope.cbxReporte.getValue() == '208' || scope.cbxReporte.getValue() == '109') {//Operaciones entre dependencias
                        if (Ext.getCmp('cbxEntidadEPI').isValid(true))
                            scope.fAceptoReporte();
                        else
                            Ext.getCmp('cbxEntidadEPI').markInvalid(scope.etiquetas.lbBlankText);
                    } else if (scope.cbxReporte.getValue() != '104') {
                        if (scope.pnlNorth.getForm().isValid(true) && Ext.getCmp('cbxComponent') != undefined) {
                            if (Ext.getCmp('cbxComponent').isValid(true) || (!Ext.isEmpty(scope.ckExportarConso) ? (scope.ckExportarConso.getValue() ? 1 : 0) : 0) ) {
                                scope.fAceptoReporte();
                            } else {
                                Ext.getCmp('cbxComponent').markInvalid(scope.etiquetas.lbBlankText);
                            }
                        } else
                            scope.cbxReporte.markInvalid();
                    } else {
                        if (scope.pnlNorth.getForm().isValid(true) && Ext.getCmp('cbxSubsistema') != undefined) {
                            if (Ext.getCmp('cbxSubsistema').isValid(true)) {
                                if (Ext.getCmp('cbxEstado') != undefined && Ext.getCmp('cbxEstado').isValid(true)) {
                                    if (Ext.getCmp('cbxNumero') != undefined && Ext.getCmp('cbxNumero').isValid(true)) {
                                        scope.fAceptoReporte();
                                    } else
                                        Ext.getCmp('cbxNumero').markInvalid(scope.etiquetas.lbBlankText);
                                } else
                                    Ext.getCmp('cbxEstado').markInvalid(scope.etiquetas.lbBlankText);
                            } else
                                Ext.getCmp('cbxSubsistema').markInvalid(scope.etiquetas.lbBlankText);
                        } else
                            scope.cbxReporte.markInvalid(scope.etiquetas.lbBlankText);
                    }
                }
            }
        );

        this.btnAbrirComprobante.on('click', function () {
            this.disable();
            var record = scope.smDatosReporte.getSelected();
            if (record) {
                scope.btnAbrirComprobante.enable();
                if (scope.responseDataReporte.idreporte != '104') {
                    Ext.Cont.Comprobante.Tool.init(record.data.idcomprobante);
                } else {
                    Ext.Cont.Comprobante.Tool.init(record.json.idComprobante);
                }
            } else {
                mostrarMensaje(1, scope.etiquetas.lbSelCmp);
            }
        });

        this.gpDatosReporte.on('rowdblclick', function (Grid, rowIndex, e) {
            data = Grid.getStore().getAt(rowIndex).data;
            if (data.idcomprobante != undefined)
                if (data.idcomprobante.length > 0)
                    scope.btnAbrirComprobante.fireEvent('click');
        });

        this.smDatosReporte.on({
            rowselect: function (selectionModel, rowIndex, record) {
                if (scope.cbxReporte.getValue() != '104')
                    scope.btnAbrirComprobante.setVisible((record.data.idcomprobante != undefined) ? ((record.data.idcomprobante.length > 0) ? true : false) : false);
                else
                    scope.btnAbrirComprobante.setVisible((record.json.idComprobante != undefined) ? ((record.json.idComprobante.length > 0) ? true : false) : false);
            },
            rowdeselect: function (selectionModel, rowIndex, record) {
                scope.btnAbrirComprobante.setVisible(false);
            }
        });

        this.btnVistaPreliminar.on('click', function () {
            scope.fOpenWindowReport();
        });
        // this.btnExportar.on('click', function () {
        //     scope.fOpenWindowExport();
        // });
        this.btnExportarBalance.on('click', function () {
            if (!scope.btnExportarBalance.disabled) {
                scope.fOpenWindowExportBalance();
            }
        });
    },
    initializeFunctions: function (scope) {

        this.obtenerCtaGastoporNivel = function (id, isGasto) {
            //Para mostrar la mascara el e combo ctaNivel
            if (Ext.getCmp('gpCtaNivel').rendered) {
                scope.loadMask(scope, scope.ctaNivel.content.el);
            } else {
                scope.ctaNivel.on('expand', function () {
                    if (!scope.ctaNivel.loaded)
                        scope.loadMask(scope, scope.ctaNivel.content.el);
                });
            }
            //----------------------------------------------------
            Ext.Ajax.request({
                method: "POST",
                url: "obtenerCtaPorNivel",
                params: {
                    idparteformato: id,
                    //arrayIdEstructurae: Ext.encode(this.fObtenerListaEstructura(scope.fObtenerListaEstructuraConsolidan())),
                    arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values),
                    isGasto: isGasto
                },
                scope: this,
                callback: function (options, success, response) {
                    if (Ext.getCmp('gpCtaNivel').rendered) {
                        Ext.getCmp('gpCtaNivel').getSelectionModel().clearSelections();
                    }

                    var responseData = Ext.decode(response.responseText);
                    Ext.getCmp('gpCtaNivel').getStore().loadData(responseData);
                    scope.lMask.hide();
                    scope.ctaNivel.loaded = true;
                }
            });

        };

        this.loadMask = function (scope, el) {
            scope.lMask = new Ext.LoadMask(el, {
                msg: 'Cargando...'
            });
            scope.lMask.show();
        };

        this.fGetChildrenNodes = function (node, selection) {
            var arrayConsolidar = new Array(node.data.idestructurae);
            for (var k = 0; k < selection.length; k++)
                if (node.data.ordenizq * 1 < selection[k].data.ordenizq * 1 && node.data.ordender * 1 > selection[k].data.ordender * 1)
                    arrayConsolidar.push(selection[k].data.idestructurae);
            return arrayConsolidar;
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
        this.fObtenerListaEstructuraEpigrafe = function () {
            var select = Ext.getCmp('gpEntidadEPI').getSelectionModel().getSelections();
            var list = new Array();
            for (var i = 0; i < select.length; i++) {
                list.push({
                    id: select[i].data.idestructurae,
                    consolida: scope.fGetChildrenNodes(select[i], select)
                });
            }
            return list;
        };
        this.fObtenerListaEstructura = function (listEstructurasConsolidan) {
            var select = Ext.getCmp('gpEntidad').getSelectionModel().getSelections();
            var list = new Array();
            if (listEstructurasConsolidan.length > 0) {
                for (var i = 0; i < select.length; i++)
                    if (select[i].data.consolidar)
                        for (var j = 0; j < select.length; j++)
                            if (select[i].data.ordenizq * 1 <= select[j].data.ordenizq * 1 && select[i].data.ordender * 1 <= select[j].data.ordender * 1)
                                list.push(select[j].data.idestructurae);

                return list;
            }
            return scope.cbxEntidad.fSelect.values;

        };

        this.fAceptoReporte = function () {
            this.btnAceptar.disable();
            this.listEstructurasConsolidan = scope.fObtenerListaEstructuraConsolidan();
            if (scope.cbxReporte.getValue() == '208') {
                this.listEstructurasConsolidan = scope.fObtenerListaEstructuraEpigrafe();
            }
            if (scope.cbxReporte.getValue() == '109') {
                // this.listEstructurasConsolidan = Ext.getCmp('cbxEntidadEPI').fSelect.values;
                this.listEstructurasConsolidan = scope.fObtenerListaEstructuraEpigrafe();
            }
            if (this.listEstructurasConsolidan.length > 0 && (scope.cbxReporte.getValue() != '103' && scope.cbxReporte.getValue() != '107' && scope.cbxReporte.getValue() != '108' && scope.cbxReporte.getValue() != '109' && scope.cbxReporte.getValue() != '208')) {
                mostrarMensaje(1, 'En el reporte seleccionado no se consolida informaci&oacute;n.');
                scope.btnAceptar.enable();
            } else {
                this.lMask = scope.UIRecuperacionesBasicas.loadMask(scope.pnlNorth.body, scope.etiquetas.msgEnviandoDatos);
                this.lMask.show();
                arrayMoneda = new Array();
                if (scope.cbxMoneda.getValue()) {
                    arrayMoneda.push(scope.cbxMoneda.getValue());
                } else {
                    for (var i = 0; i < scope.stMoneda.getCount(); i++) {
                        arrayMoneda.push(scope.stMoneda.data.items[i].data.idmoneda);
                        // listResult.push(scope.stMoneda[i].data.idmoneda);
                    }
                }

                var arrayCta = null;
                if (scope.cbxReporte.getValue() == '103') {//103-Si es el reporte del balance
                    if (scope.cbxCuenta.getSelections().length > 0) {
                        arrayCta = Ext.encode(scope.cbxCuenta.getValue());
                    }
                }

                scope.gpDatosReporte.getStore().removeAll();
                Ext.Ajax.request({
                    method: "POST",
                    url: "cargarDatosReporte",
                    params: (scope.cbxReporte.getValue() != '104') ? {
                        'tipo': '1',
                        'listIdEstructuraConsolidar': Ext.encode(this.listEstructurasConsolidan),
                        'arrayIdEstructurae': scope.cbxReporte.getValue() != '109' ? Ext.encode(this.fObtenerListaEstructura(this.listEstructurasConsolidan)) : Ext.encode(Ext.getCmp('cbxEntidad').fSelect.values),
                        'dfDesde': scope.dfDesde.getRawValue(),
                        'dfHasta': scope.dfHasta.getRawValue(),
                        'arrayMoneda': Ext.encode(arrayMoneda),
                        'idMoneda': (Ext.getCmp('cbxMoneda') != undefined) ? Ext.encode(Ext.getCmp('cbxMoneda').fSelect.values) : null,
                        'idReporte': scope.cbxReporte.getValue(),
                        'idPeriodo': scope.cbxPeriodo.fSelect.values[0],//Solo un periodo
                        'datos': (Ext.getCmp('cbxComponent') != undefined) ? Ext.encode(Ext.getCmp('cbxComponent').fSelect.values) : null,
                        'nivel': (Ext.getCmp('cbxNivel') != undefined) ? Ext.getCmp('cbxNivel').fSelect.values : null,
                        'arrayCta': (Ext.getCmp('cbxCtaNivel') != undefined) ? Ext.encode(Ext.getCmp('cbxCtaNivel').fSelect.values) : arrayCta,
                        'arrayElemento': (Ext.getCmp('cbxElemento') != undefined) ? Ext.encode(Ext.getCmp('cbxElemento').fSelect.display) : null,
                        'arrayCentroCosto': (Ext.getCmp('cbxCentroCosto') != undefined) ? Ext.encode(Ext.getCmp('cbxCentroCosto').fSelect.display) : null,
                        'ckCentroCost': !Ext.isEmpty(scope.ckCentroCost) ? (scope.ckCentroCost.getValue() ? 1 : 0) : 0,
                        'ckExportarConso': !Ext.isEmpty(scope.ckExportarConso) ? (scope.ckExportarConso.getValue() ? 1 : 0) : 0,
                        'ckExportarUNE': !Ext.isEmpty(scope.ckExportarUNE) ? (scope.ckExportarUNE.getValue() ? 1 : 0) : 0
                    } : {
                        'tipo': '2',
                        'listIdEstructuraConsolidar': Ext.encode(this.listEstructurasConsolidan),
                        'idPeriodo': scope.cbxPeriodo.fSelect.values,
                        'arrayIdEstructurae': Ext.encode(this.fObtenerListaEstructura(this.listEstructurasConsolidan)),
                        'dfDesde': scope.dfDesde.getRawValue(),
                        'dfHasta': scope.dfHasta.getRawValue(),
                        // 'idMoneda': scope.cbxMoneda.getValue(),
                        'arrayMoneda': Ext.encode(arrayMoneda),
                        'idReporte': scope.cbxReporte.getValue(),
                        'arrayIdSubsistemas': Ext.encode(Ext.getCmp('cbxSubsistema').fSelect.values),
                        'arrayIdEstados': Ext.encode(Ext.getCmp('cbxEstado').fSelect.values),
                        'arrayIdNumeros': Ext.encode(Ext.getCmp('cbxNumero').fSelect.values)
                    },
                    callback: function (options, success, response) {
                        if (scope.cbxReporte.getValue() == 103) {
                            scope.ultimoNivel = Ext.getCmp('cbxComponent').fSelect.values[0];
                        }
                        scope.parametrosUltimoReporte = options.params;
                        scope.responseDataReporte = Ext.decode(response.responseText);
                        scope.lMask.hide();
                        scope.btnAceptar.enable();
                        if (scope.responseDataReporte.code == -4) {
                            var msg = String.format(scope.etiquetas.lbmsgNoCons, scope.responseDataReporte.estructurae, scope.responseDataReporte.criterioe);
                            mostrarMensaje(1, msg, function () {
                            });
                        } else if (scope.cbxReporte.getValue() != '104') {
                            if (scope.responseDataReporte.datos.length > 0) {
                                // scope.pnlNorth.collapse();
                                scope.btnVistaPreliminar.show();
                                scope.btnVistaPreliminar.focus();
                                if (scope.cbxReporte.getValue() == '103') {
                                    if (!scope.btnExportar.disabled) {
                                        if (!Ext.isEmpty(scope.ckExportarConso) ? (scope.ckExportarConso.getValue() ? 1 : 0) : 0) {
                                            scope.btnVistaPreliminar.hide();
                                            scope.btnExportarBalance.hide();
                                            //scope.btnExportar.show();
                                            window.open(scope.responseDataReporte.dataSources[0].datoGeneral.url);
                                        } else {
                                            scope.btnExportar.hide();
                                        }
                                    }
                                    if (!scope.btnExportarUNE.disabled) {
                                        if (!Ext.isEmpty(scope.ckExportarUNE) ? (scope.ckExportarUNE.getValue() ? 1 : 0) : 0) {
                                            scope.btnVistaPreliminar.hide();
                                            scope.btnExportarBalance.hide();
                                            scope.btnExportar.hide();

                                            var save = document.createElement('a');
                                            save.href = scope.responseDataReporte.dataSources[0].datoGeneral.url;
                                            save.target = '_blank';
                                            save.download = scope.responseDataReporte.dataSources[0].datoGeneral.fileName
                                            var clickEvent = new MouseEvent('click', {
                                                'view': window,
                                                'bubbles': true,
                                                'cancelable': true
                                            });
                                            save.dispatchEvent(clickEvent);
                                        } else {
                                            scope.btnExportarUNE.hide();
                                        }
                                    }
                                    if (!scope.btnExportarBalance.disabled) {
                                        scope.btnExportarBalance.show();
                                    }
                                } else {
                                  scope.btnExportar.hide();
                                  scope.btnExportarBalance.hide();
                                  scope.btnExportarUNE.hide();
                                }
                                scope.fDrawGridPanel();
                            } else {
                                mostrarMensaje(1, scope.etiquetas.noExiDatos);
                            }
                            /*} else {
                             scope.btnVistaPreliminar.hide();
                             scope.gpDatosReporte.reconfigure(
                             new Ext.data.GroupingStore({
                             fields: [],
                             // data: [[]],
                             data: [],
                             reader: new Ext.data.ArrayReader({}, [
                             {name: 'Entidad'},
                             {name: 'Cuenta'},
                             {name: 'fechaemision'},
                             {name: 'comprobante'},
                             {name: 'descripcion'}
                             ])
                             }),
                             new Ext.grid.ColumnModel([
                             {
                             header: scope.etiquetas.lbEntidad,
                             tooltip: scope.etiquetas.lbTtEntidad,
                             dataIndex: 'Entidad',
                             hidden: true
                             }, {
                             header: scope.etiquetas.lbCuenta,
                             tooltip: scope.etiquetas.lbTtCuenta,
                             dataIndex: 'Cuenta',
                             align: 'left',
                             width: 150
                             }, {
                             header: scope.etiquetas.lbFecha,
                             tooltip: scope.etiquetas.lbFechaCont,
                             dataIndex: 'fechaemision',
                             width: 100
                             },
                             {
                             header: scope.etiquetas.lbNoComprobante,
                             tooltip: scope.etiquetas.lbTtNoComprobante,
                             dataIndex: 'comprobante',
                             width: 100
                             },
                             {
                             id: 'expandir',
                             header: scope.etiquetas.lbDescripcion,
                             tooltip: scope.etiquetas.lbTtDescripcion,
                             dataIndex: 'descripcion',
                             width: 350
                             }
                             ]));
                             scope.pnlSouth.doLayout(true);
                             mostrarMensaje(1, scope.etiquetas.noExiDatos);

                             }*/
                        } else {
                            if (scope.responseDataReporte.datos.total > 0) {
                                // scope.pnlNorth.collapse();
                                scope.btnVistaPreliminar.show();
                                scope.btnVistaPreliminar.focus();
                                scope.btnExportar.hide();
                                scope.btnExportarUNE.hide();
                                scope.fDrawGridPanel();
                            } else {
                                scope.btnVistaPreliminar.hide();
                                scope.btnExportarBalance.hide();
                                scope.btnExportar.hide();
                                scope.btnExportarUNE.hide();
                                scope.gpDatosReporte.reconfigure(
                                    new Ext.data.GroupingStore({
                                        fields: [],
                                        // data: [[]],
                                        data: [],
                                        reader: new Ext.data.ArrayReader({}, [
                                            {name: 'Entidad'},
                                            {name: 'numeroComprobante'},
                                            {name: 'observacion'},
                                            {name: 'denominacionEstado'},
                                            {name: 'fechaEmision'}
                                        ])
                                    }),
                                    new Ext.grid.ColumnModel([
                                        {
                                            header: scope.etiquetas.lbEntidad,
                                            tooltip: scope.etiquetas.lbTtEntidad,
                                            dataIndex: 'Entidad',
                                            hidden: true
                                        }, {
                                            header: scope.etiquetas.lbNoComprobante,
                                            tooltip: scope.etiquetas.lbTtNoComprobante,
                                            dataIndex: 'numeroComprobante',
                                            align: 'left',
                                            width: 150
                                        },
                                        {
                                            id: 'idexpandir',
                                            header: scope.etiquetas.lbObservacion,
                                            tooltip: scope.etiquetas.lbTtObservacion,
                                            sortable: true,
                                            dataIndex: 'observacion',
                                            align: 'left',
                                            width: 350
                                        },
                                        {
                                            header: scope.etiquetas.lbEstado,
                                            tooltip: scope.etiquetas.lbTtEstado,
                                            sortable: true,
                                            dataIndex: 'denominacionEstado',
                                            width: 150
                                        },
                                        {
                                            header: scope.etiquetas.lbFecha,
                                            tooltip: scope.etiquetas.lbFechaCont,
                                            sortable: true,
                                            dataIndex: 'fechaEmision',
                                            width: 150
                                        }
                                    ])
                                );
                                scope.pnlSouth.doLayout(true);
                                mostrarMensaje(1, scope.etiquetas.noExiDatos);
                            }
                        }
                    }
                });
            }
        };

        this.InicialEvenet = function (numero) {
            scope.pnlNorth.getComponent(1).purgeListeners();
            switch (numero) {
                case '1' :
                    Ext.getCmp('gpSubsistema').getSelectionModel().on('selectionchange', function () {
                        scope.pnlNorth.getComponent(1).remove(3, true);
                        scope.pnlNorth.getComponent(1).remove(2, true);
                        scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fAddCbxComponent('2', scope));
                        scope.pnlNorth.doLayout(true);
                        scope.InicialEvenet('2');
                        scope.InicialEvenet('4');
                    });
                    Ext.getCmp('gpSubsistema').getStore().on('load', function (store, records, options) {
                        if (store.reader.jsonData.datos.length <= 0) {
                            Ext.getCmp('cbxSubsistema').collapse();
                            scope.initMsgWarning(8);
                        }
                    });
                    break;
                case '2' :
                    Ext.getCmp('cbxEstado').on('expand', function () {
                        if (Ext.getCmp('cbxSubsistema').isValid()) {
                            Ext.getCmp('gpEstado').getStore().removeAll();
                            Ext.getCmp('gpEstado').getStore().load({
                                params: {
                                    arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values),
                                    fechaInicio: scope.dfDesde.getRawValue(),
                                    fechaFin: scope.dfHasta.getRawValue(),
                                    arrayIdSubsistemas: Ext.encode(Ext.getCmp('cbxSubsistema').fSelect.values)
                                }
                            });
                        } else
                            Ext.getCmp('cbxEstado').collapse();
                    });
                    Ext.getCmp('gpEstado').getStore().on('load', function (store, records, options) {
                        if (store.reader.jsonData.datos.length <= 0) {
                            Ext.getCmp('cbxEstado').collapse();
                            scope.initMsgWarning(9);
                        }
                    });
                    break;
                case '3' :
                    Ext.getCmp('cbxNumero').on('expand', function () {
                        if (Ext.getCmp('cbxSubsistema').isValid() && Ext.getCmp('cbxEstado').isValid()) {
                            Ext.getCmp('gpNumero').getStore().removeAll();
                            Ext.getCmp('gpNumero').getStore().load({
                                params: {
                                    arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values),
                                    fechaInicio: scope.dfDesde.getRawValue(),
                                    fechaFin: scope.dfHasta.getRawValue(),
                                    arrayIdSubsistemas: Ext.encode(Ext.getCmp('cbxSubsistema').fSelect.values),
                                    arrayIdEstadoComprobantes: Ext.encode(Ext.getCmp('cbxEstado').fSelect.values)
                                }
                            });
                        } else
                            Ext.getCmp('cbxNumero').collapse();
                    });
                    Ext.getCmp('gpNumero').getStore().on('load', function (store, records, options) {
                        if (store.reader.jsonData.datos.length <= 0) {
                            Ext.getCmp('cbxNumero').collapse();
                            scope.initMsgWarning(9);
                        }
                    });
                    break;
                case '4' :
                    Ext.getCmp('gpEstado').getSelectionModel().on('selectionchange', function () {
                        scope.pnlNorth.getComponent(1).remove(3, true);
                        scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fAddCbxComponent('3', scope));
                        scope.pnlNorth.doLayout(true);
                        scope.InicialEvenet('3');
                    });
                    break;
            }
        };

        this.fDrawGridPanel = function () {
            switch (scope.responseDataReporte.idreporte) {
                case '101': {
                    scope.flagBalance = false;
                    scope.gpDatosReporte.reconfigure(
                        new Ext.data.GroupingStore({
                            groupField: 'Entidad',
                            sortInfo: {
                                field: "Entidad",
                                direction: "ASC"
                            },
                            reader: new Ext.data.ArrayReader({}, [
                                {name: 'Entidad', mapping: 'Entidad'},
                                {name: 'Cuenta', mapping: 'Cuenta'},
                                {name: 'fechaemision', mapping: 'fechaemision'},
                                {name: 'comprobante', mapping: 'comprobante'},
                                {name: 'idcomprobante', mapping: 'idcomprobante'},
                                {name: 'idsubsistema', mapping: 'idsubsistema'},
                                {name: 'idtipocomprobante', mapping: 'idtipocomprobante'},
                                {name: 'idestructurae', mapping: 'idestructurae'},
                                {name: 'descripcion', mapping: 'descripcion'},
                                {name: 'debe', mapping: 'debe'},
                                {name: 'haber', mapping: 'haber'},
                                {name: 'saldo', mapping: 'saldo'}
                            ]),
                            data: scope.responseDataReporte.datos
                        }),
                        new Ext.grid.ColumnModel([
                            {
                                header: scope.etiquetas.lbEntidad,
                                tooltip: scope.etiquetas.lbTtEntidad,
                                dataIndex: 'Entidad',
                                align: 'left',
                                hidden: true
                            }, {
                                header: scope.etiquetas.lbCuenta,
                                tooltip: scope.etiquetas.lbTtCuenta,
                                dataIndex: 'Cuenta',
                                align: 'left',
                                width: 250
                            }, {
                                header: scope.etiquetas.lbFecha,
                                tooltip: scope.etiquetas.lbFechaCont,
                                dataIndex: 'fechaemision',
                                width: 80,
                                align: 'center'
                            }, {
                                header: scope.etiquetas.lbNoComprobante,
                                tooltip: scope.etiquetas.lbTtNoComprobante,
                                dataIndex: 'comprobante',
                                width: 100,
                                align: 'center'
                            }, {
                                header: 'Subsistema',
                                tooltip: 'Subsistema que realizó la operación contable',
                                dataIndex: 'idsubsistema',
                                width: 100,
                                align: 'center',
                                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                                    if (value == 4)
                                        return 'CONTABILIDAD';
                                    else if (value == 5)
                                        return 'COSTO';
                                    else if (value == 6)
                                        return 'COBROS Y PAGOS';
                                    else if (value == 10)
                                        return 'INVENTARIO';
                                    else if (value == 11)
                                        return 'ACTIVOS FIJOS';
                                    else if (value == 12)
                                        return 'BANCO';
                                    else if (value == 13)
                                        return 'FACTURACIÓN';
                                    else if (value == 14)
                                        return 'CAJA';
                                    else if (value == 71)
                                        return 'NÓMINA';
                                    else return '';
                                }
                            }, {
                                id: 'expandir',
                                header: scope.etiquetas.lbDescripcion,
                                tooltip: scope.etiquetas.lbTtDescripcion,
                                dataIndex: 'descripcion',
                                width: 350
                            }, {
                                header: scope.etiquetas.lbDebe,
                                tooltip: scope.etiquetas.lbTtDebe,
                                dataIndex: 'debe',
                                align: 'right',
                                width: 110
                            }, {
                                header: scope.etiquetas.lbHaber,
                                tooltip: scope.etiquetas.lbTtHaber,
                                dataIndex: 'haber',
                                align: 'right',
                                width: 110
                            }, {
                                header: scope.etiquetas.lbSaldo,
                                tooltip: scope.etiquetas.lbTtSaldo,
                                dataIndex: 'saldo',
                                align: 'right',
                                width: 110
                            }
                        ]));
                    scope.defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };

                }
                    break;
                case '102': {
                    scope.flagBalance = false;
                    scope.gpDatosReporte.reconfigure(
                        new Ext.data.GroupingStore({
                            groupField: 'Entidad',
                            sortInfo: {
                                field: "Entidad",
                                direction: "ASC"
                            },
                            reader: new Ext.data.ArrayReader({}, [
                                {name: 'Entidad', mapping: 'Entidad'},
                                {name: 'Cuenta', mapping: 'Cuenta'},
                                {name: 'fechaemision', mapping: 'fechaemision'},
                                {name: 'comprobante', mapping: 'comprobante'},
                                {name: 'idsubsistema', mapping: 'idsubsistema'},
                                {name: 'idcomprobante', mapping: 'idcomprobante'},
                                {name: 'idtipocomprobante', mapping: 'idtipocomprobante'},
                                {name: 'descripcion', mapping: 'descripcion'},
                                {name: 'debe', mapping: 'debe'},
                                {name: 'haber', mapping: 'haber'},
                                {name: 'saldo', mapping: 'saldo'}
                            ]),
                            data: scope.responseDataReporte.datos
                        }),
                        new Ext.grid.ColumnModel([
                            {
                                header: scope.etiquetas.lbEntidad,
                                tooltip: scope.etiquetas.lbTtEntidad,
                                dataIndex: 'Entidad',
                                align: 'left',
                                hidden: true
                            }, {
                                header: scope.etiquetas.lbCuenta,
                                tooltip: scope.etiquetas.lbTtCuenta,
                                dataIndex: 'Cuenta',
                                align: 'left',
                                width: 150
                            }, {
                                header: scope.etiquetas.lbFecha,
                                tooltip: scope.etiquetas.lbFechaCont,
                                dataIndex: 'fechaemision',
                                width: 80,
                                align: 'center',
                            }, {
                                header: scope.etiquetas.lbNoComprobante,
                                tooltip: scope.etiquetas.lbTtNoComprobante,
                                dataIndex: 'comprobante',
                                width: 100,
                                align: 'center',
                            }, {
                                header: 'Subsistema',
                                tooltip: 'Subsistema que realizó la operación contable',
                                dataIndex: 'idsubsistema',
                                width: 100,
                                align: 'center',
                                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                                    if (value == 4)
                                        return 'CONTABILIDAD';
                                    else if (value == 5)
                                        return 'COSTO';
                                    else if (value == 6)
                                        return 'COBROS Y PAGOS';
                                    else if (value == 10)
                                        return 'INVENTARIO';
                                    else if (value == 11)
                                        return 'ACTIVOS FIJOS';
                                    else if (value == 12)
                                        return 'BANCO';
                                    else if (value == 13)
                                        return 'FACTURACIÓN';
                                    else if (value == 14)
                                        return 'CAJA';
                                    else if (value == 71)
                                        return 'NÓMINA';
                                    else return '';
                                }
                            }, {
                                id: 'expandir',
                                header: scope.etiquetas.lbDescripcion,
                                tooltip: scope.etiquetas.lbTtDescripcion,
                                dataIndex: 'descripcion',
                                width: 350
                            }, {
                                header: scope.etiquetas.lbDebe,
                                tooltip: scope.etiquetas.lbTtDebe,
                                dataIndex: 'debe',
                                align: 'right',
                                width: 150
                            }, {
                                header: scope.etiquetas.lbHaber,
                                tooltip: scope.etiquetas.lbTtHaber,
                                dataIndex: 'haber',
                                align: 'right',
                                width: 150
                            }, {
                                header: scope.etiquetas.lbSaldo,
                                tooltip: scope.etiquetas.lbTtSaldo,
                                dataIndex: 'saldo',
                                align: 'right',
                                width: 150
                            }
                        ]));
                    scope.defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                }
                    break;
                case '103':
                case '208': {
                    ConstruirArrayObjetoPrint(scope.responseDataReporte);
                    if (!Ext.isEmpty(scope.ckExportarConso) ? (scope.ckExportarConso.getValue() ? 1 : 0) : 0) {
                        scope.gpDatosReporte.reconfigure(
                            new Ext.data.GroupingStore({
                                groupField: 'Entidad',
                                sortInfo: {
                                    field: "Entidad",
                                    direction: "ASC"
                                },
                                reader: new Ext.data.ArrayReader({}, [
                                    {name: 'Entidad', mapping: 'Entidad', defaultValue : scope.cbxEntidad.fSelect.display[0]},
                                    {name: 'concatcta', mapping: 'concatcta'},
                                    {name: 'descripcion', mapping: 'descripcion'},
                                    {name: 'saldo_apertura', mapping: 'saldo_apertura'},
                                    {name: 'saldo_inicial', mapping: 'saldo_inicial'},
                                    {name: 'debito', mapping: 'debito'},
                                    {name: 'credito', mapping: 'credito'},
                                    {name: 'saldo', mapping: 'saldo'},
                                ]),
                                data: scope.responseDataReporte.datos
                            }),
                            new Ext.grid.ColumnModel([
                                {
                                    header: scope.etiquetas.lbEntidad,
                                    tooltip: scope.etiquetas.lbTtEntidad,
                                    dataIndex: 'Entidad',
                                    align: 'left',
                                    hidden: true
                                }, {
                                    header: 'Cuenta',
                                    // tooltip: scope.etiquetas.lbTtEntidad,
                                    dataIndex: 'concatcta',
                                    sortable: false,
                                    width: 160
                                }, {
                                    header: 'Descripción',
                                    // tooltip: scope.etiquetas.lbTtNombCta,
                                    sortable: false,
                                    dataIndex: 'descripcion',
                                    align: 'left',
                                    width: 270
                                }, {
                                    header: 'Saldo de apertura',
                                    // tooltip: scope.etiquetas.lbTtSaldoInicio,
                                    sortable: false,
                                    dataIndex: 'saldo_apertura',
                                    align: 'right',
                                    renderer: formatoMoneda,
                                    width: 150
                                }, {
                                    header: 'Saldo inicial',
                                    // tooltip: scope.etiquetas.lbTtParcial,
                                    sortable: false,
                                    dataIndex: 'saldo_inicial',
                                    align: 'right',
                                    renderer: formatoMoneda,
                                    width: 150
                                }, {
                                    header: scope.etiquetas.lbDebe,
                                    tooltip: scope.etiquetas.lbTtDebe,
                                    sortable: false,
                                    dataIndex: 'debito',
                                    align: 'right',
                                    renderer: formatoMoneda,
                                    width: 150
                                }, {
                                    header: scope.etiquetas.lbHaber,
                                    tooltip: scope.etiquetas.lbTtHaber,
                                    sortable: false,
                                    dataIndex: 'credito',
                                    align: 'right',
                                    renderer: formatoMoneda,
                                    width: 150
                                }, {
                                    header: 'Saldo',
                                    // tooltip: scope.etiquetas.lbTtSaldoPer,
                                    sortable: false,
                                    dataIndex: 'saldo',
                                    align: 'right',
                                    renderer: formatoMoneda,
                                    width: 150
                                }
                            ]));
                    } else {
                        scope.gpDatosReporte.reconfigure(
                            new Ext.data.GroupingStore({
                                groupField: 'Entidad',
                                sortInfo: {
                                    field: "Entidad",
                                    direction: "ASC"
                                },
                                reader: new Ext.data.ArrayReader({}, [
                                    {name: 'Entidad', mapping: 'Entidad'},
                                    {name: 'concatcuenta', mapping: 'concatcuenta'},
                                    {name: 'descripcioncuenta', mapping: 'descripcioncuenta'},
                                    {name: 'saldoinicio', mapping: 'saldoinicio'},
                                    {name: 'parcial', mapping: 'parcial'},
                                    {name: 'debe', mapping: 'debe'},
                                    {name: 'haber', mapping: 'haber'},
                                    {name: 'saldoperiodo', mapping: 'saldoperiodo'},
                                    {name: 'saldoacumuladodeudora', mapping: 'saldoacumuladodeudora'},
                                    {name: 'saldoacumuladoacreedora', mapping: 'saldoacumuladoacreedora'}
                                ]),
                                data: scope.responseDataReporte.datos
                            }),
                            new Ext.grid.ColumnModel([
                                {
                                    header: scope.etiquetas.lbEntidad,
                                    tooltip: scope.etiquetas.lbTtEntidad,
                                    dataIndex: 'Entidad',
                                    align: 'left',
                                    hidden: true
                                }, {
                                    header: scope.etiquetas.lbCodigo,
                                    tooltip: scope.etiquetas.lbTtCodigo,
                                    sortable: false,
                                    dataIndex: 'concatcuenta',
                                    width: 80
                                }, {
                                    header: scope.etiquetas.lbNombreCta,
                                    tooltip: scope.etiquetas.lbTtNombCta,
                                    sortable: false,
                                    dataIndex: 'descripcioncuenta',
                                    align: 'left',
                                    width: 270
                                }, {
                                    header: scope.etiquetas.lbSaldoInicio,
                                    tooltip: scope.etiquetas.lbTtSaldoInicio,
                                    sortable: false,
                                    dataIndex: 'saldoinicio',
                                    align: 'right',
                                    width: 150
                                }, {
                                    header: scope.etiquetas.lbParcial,
                                    tooltip: scope.etiquetas.lbTtParcial,
                                    sortable: false,
                                    dataIndex: 'parcial',
                                    align: 'right',
                                    width: 150
                                }, {
                                    header: scope.etiquetas.lbDebe,
                                    tooltip: scope.etiquetas.lbTtDebe,
                                    sortable: false,
                                    dataIndex: 'debe',
                                    align: 'right',
                                    width: 150
                                }, {
                                    header: scope.etiquetas.lbHaber,
                                    tooltip: scope.etiquetas.lbTtHaber,
                                    sortable: false,
                                    dataIndex: 'haber',
                                    align: 'right',
                                    width: 150
                                }, {
                                    header: scope.etiquetas.lbSaldoPer,
                                    tooltip: scope.etiquetas.lbTtSaldoPer,
                                    sortable: false,
                                    dataIndex: 'saldoperiodo',
                                    align: 'right',
                                    width: 150
                                }, {
                                    header: scope.etiquetas.lbAcumuladoDebe,
                                    tooltip: scope.etiquetas.lbTpAcumuladoDebe,
                                    sortable: false,
                                    dataIndex: 'saldoacumuladodeudora',
                                    align: 'right',
                                    width: 150
                                }, {
                                    header: scope.etiquetas.lbAcumuladoHaber,
                                    tooltip: scope.etiquetas.lbTpAcumuladoHaber,
                                    sortable: false,
                                    dataIndex: 'saldoacumuladoacreedora',
                                    align: 'right',
                                    width: 150
                                }
                            ]));
                    }
                    scope.defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                }
                    break;
                case '104': {
                    scope.gpDatosReporte.reconfigure(
                        new Ext.data.GroupingStore({
                                groupField: 'Entidad',
                                sortInfo: {
                                    field: "Entidad",
                                    direction: "ASC"
                                },
                                reader: new Ext.data.ArrayReader({},
                                    [
                                        {name: 'Entidad', mapping: 'denominacionEntidad'},
                                        {name: 'numeroComprobante', mapping: 'numeroComprobante'},
                                        {name: 'observacion', mapping: 'observacion'},
                                        {name: 'denominacionEstado', mapping: 'denominacionEstado'},
                                        {name: 'fechaEmision', mapping: 'fechaEmision'},
                                        {name: 'idcomprobante', mapping: 'idComprobante'},
                                        {name: 'idtipocomprobante', mapping: 'idTipoComprobante'},
                                        {name: 'subsistema', mapping: 'subsistema'}
                                    ]
                                ),
                                data: scope.responseDataReporte.datos.datos
                            }
                        ),
                        new Ext.grid.ColumnModel([
                            {
                                header: scope.etiquetas.lbEntidad,
                                tooltip: scope.etiquetas.lbTtEntidad,
                                dataIndex: 'Entidad',
                                align: 'left',
                                hidden: true
                            }, {
                                header: scope.etiquetas.lbNoComprobante,
                                tooltip: scope.etiquetas.lbTtNoComprobante,
                                sortable: true,
                                dataIndex: 'numeroComprobante',
                                width: 120
                            }, {
                                id: 'idexpandir',
                                header: 'Observaci&oacute;n',
                                sortable: true,
                                dataIndex: 'observacion',
                                align: 'left',
                                width: 350
                            }, {
                                header: scope.etiquetas.lbEstado,
                                tooltip: scope.etiquetas.lbTtEstado,
                                sortable: true,
                                dataIndex: 'denominacionEstado',
                                width: 150
                            }, {
                                header: scope.etiquetas.lbFecha,
                                tooltip: scope.etiquetas.lbFechaCont,
                                sortable: true,
                                dataIndex: 'fechaEmision',
                                width: 150
                            }
                        ])
                    );
                }
                    break;
                case '105': {//Submayor de gasto
                    scope.gpDatosReporte.reconfigure(
                        new Ext.data.GroupingStore({
                                groupField: 'Entidad',
                                sortInfo: {
                                    field: "Entidad",
                                    direction: "ASC"
                                },
                                reader: new Ext.data.ArrayReader({},
                                    [
                                        {name: 'Entidad', mapping: 'Entidad'},
                                        {name: 'concatcta', mapping: 'concatcta'},
                                        {name: 'codigoestructura', mapping: 'codigoestructura'},
                                        {name: 'fecha', mapping: 'fecha'},
                                        {name: 'comprobante', mapping: 'comprobante'},
                                        {name: 'elemento', mapping: 'elemento'},
                                        {name: 'descripcion', mapping: 'descripcion'},
                                        {name: 'debe', mapping: 'debe'},
                                        {name: 'haber', mapping: 'haber'},
                                        {name: 'saldo', mapping: 'saldo'},
                                        {name: 'descripcioncentrogrupo', mapping: 'descripcioncentrogrupo'},
                                    ]
                                ),
                                data: scope.responseDataReporte.datos
                            }
                        ),
                        new Ext.grid.ColumnModel([
                            {
                                header: scope.etiquetas.lbEntidad,
                                tooltip: scope.etiquetas.lbTtEntidad,
                                dataIndex: 'Entidad',
                                align: 'left',
                                hidden: true
                            }, {
                                header: scope.etiquetas.lbNombreCta,
                                tooltip: scope.etiquetas.lbTtNombCta,
                                sortable: true,
                                dataIndex: 'concatcta',
                                align: 'left',
                                width: 30,
                            }, {
                                header: 'Elemento',
                                tooltip: 'Elemento',
                                sortable: true,
                                dataIndex: 'elemento',
                                align: 'left',
                                width: 30,
                            }, {
                                header: 'Fecha',
                                tooltip: 'Fecha',
                                sortable: true,
                                dataIndex: 'fecha',
                                width: 20,
                                align: 'center'
                            }, {
                                id: 'idexpandir',
                                header: 'Descripción',
                                tooltip: 'Descripción',
                                sortable: true,
                                dataIndex: 'descripcion',
                                align: 'left'
                            }, {
                                header: 'Centro de costo',
                                tooltip: 'Centro de costo',
                                sortable: true,
                                hidden: scope.ckCentroCost.getValue() ? false : true,
                                dataIndex: 'descripcioncentrogrupo',
                                align: 'left'
                            }, {
                                header: 'Comprobate',
                                tooltip: 'Comprobate',
                                sortable: true,
                                dataIndex: 'comprobante',
                                width: 20,
                                align: 'center',
                            }, {
                                header: 'Debe',
                                tooltip: 'Debe',
                                sortable: true,
                                dataIndex: 'debe',
                                width: 20,
                                align: 'right',
                                renderer: formatoMonedaABS,
                            }, {
                                header: 'Haber',
                                tooltip: 'Haber',
                                sortable: true,
                                dataIndex: 'haber',
                                width: 20,
                                align: 'right',
                                renderer: formatoMonedaABS,
                            }, {
                                header: 'Saldo',
                                tooltip: 'Saldo',
                                sortable: true,
                                dataIndex: 'saldo',
                                width: 20,
                                align: 'right',
                                renderer: formatoMonedaABS,
                            }
                        ]));
                    scope.defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                }
                    break;
                case '106': {
                    this.nfPlanA = new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        width: 50,
                        value: 0,
                        allowBlank: false
                    });
                    this.nfPlanF = new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        width: 50,
                        value: 0,
                        allowBlank: false
                    });
                    scope.gpDatosReporte.reconfigure(
                        new Ext.data.GroupingStore({
                                groupField: 'Entidad',
                                sortInfo: {
                                    field: "Entidad",
                                    direction: "ASC"
                                },
                                reader: new Ext.data.ArrayReader({},
                                    [
                                        {name: 'Entidad', mapping: 'Entidad'},
                                        {name: 'concepto', mapping: 'descripcionpartida'},
                                        {name: 'fila', mapping: 'fila'},
                                        {name: 'plananno', mapping: 'plananno1'},
                                        {name: 'planfecha', mapping: 'planfecha1'},
                                        {name: 'realfecha', mapping: 'realfecha'},
                                        {name: 'editable', mapping: 'editable'}
                                    ]
                                ),
                                data: scope.responseDataReporte.datos
                            }
                        ),
                        new Ext.grid.ColumnModel([
                            {
                                header: scope.etiquetas.lbEntidad,
                                tooltip: scope.etiquetas.lbTtEntidad,
                                dataIndex: 'Entidad',
                                align: 'left',
                                hidden: true
                            }, {
                                id: 'idexpandir',
                                header: 'Concepto',
                                tooltip: 'Concepto de partida',
                                sortable: true,
                                dataIndex: 'concepto',
                                align: 'left'
                            }, {
                                header: 'Fila',
                                tooltip: 'Fila',
                                sortable: true,
                                dataIndex: 'fila',
                                width: 20,
                                align: 'left'
                            }, {
                                header: 'Plan del año',
                                tooltip: 'Plan del año',
                                sortable: true,
                                dataIndex: 'plananno',
                                align: 'right',
                                width: 80,
                                editor: this.nfPlanA,
                                renderer: formatoMonedaABS
                            }, {
                                header: 'Plan hasta la fecha',
                                tooltip: 'Plan hasta la fecha',
                                sortable: true,
                                dataIndex: 'planfecha',
                                width: 80,
                                align: 'right',
                                editor: this.nfPlanF,
                                renderer: formatoMonedaABS
                            }, {
                                header: 'Ejecucion del año hasta la fecha',
                                tooltip: 'Ejecucion del año hasta la fecha',
                                sortable: true,
                                dataIndex: 'realfecha',
                                width: 80,
                                align: 'right'
                            }
                        ]));
                    scope.defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };

                    //Evento para editar solo las filas editables
                    scope.gpDatosReporte.on('beforeedit', function (editor) {
                        if (!editor.record.data.editable) {
                            return false;
                        }
                    });
                    scope.gpDatosReporte.on('afteredit', function (editor) {
                        if (editor.record.data.editable) {
                            var totalPlanAnno = 0;
                            var totalPlanFecha = 0;
                            var store = scope.gpDatosReporte.getStore();
                            for (var i = 0; i < store.getCount() - 1; i++) {
                                if (store.getAt(i).data.plananno != '') {
                                    totalPlanAnno += parseFloat(store.getAt(i).data.plananno);
                                }
                                if (store.getAt(i).data.planfecha != '') {
                                    totalPlanFecha += parseFloat(store.getAt(i).data.planfecha);
                                }
                            }
                            store.getAt(store.getCount() - 1).data.plananno = totalPlanAnno;
                            store.getAt(store.getCount() - 1).data.planfecha = totalPlanFecha;
                            scope.gpDatosReporte.getView().refresh();
                        }
                    });
                }
                    break;
                case '107': {
                    scope.gpDatosReporte.reconfigure(
                        new Ext.data.GroupingStore({
                                groupField: 'Entidad',
                                sortInfo: {
                                    field: "Entidad",
                                    direction: "ASC"
                                },
                                reader: new Ext.data.ArrayReader({},
                                    [
                                        {name: 'Entidad', mapping: 'Entidad'},
                                        {name: 'concatcta', mapping: 'concatcta'},
                                        {name: 'descripcion', mapping: 'descripcion'},
                                        {name: 'clavecuenta', mapping: 'clavecuenta'},
                                        {name: 'saldoperiodo', mapping: 'saldoperiodo'},
                                        {name: 'saldoacumulado', mapping: 'saldoacumulado'},
                                        {name: 'debe', mapping: 'debe'},
                                        {name: 'haber', mapping: 'haber'}
                                    ]
                                ),
                                data: scope.responseDataReporte.datos
                            }
                        ),
                        new Ext.grid.ColumnModel([
                            {
                                header: scope.etiquetas.lbEntidad,
                                tooltip: scope.etiquetas.lbTtEntidad,
                                dataIndex: 'Entidad',
                                align: 'left',
                                hidden: true
                            }, {
                                header: 'Cuenta',
                                tooltip: scope.etiquetas.lbTtNombCta,
                                sortable: true,
                                dataIndex: 'concatcta',
                                align: 'left',
                                width: 30
                            }, {
                                id: 'idexpandir',
                                header: 'Descripción',
                                tooltip: 'Descripción cuenta',
                                sortable: true,
                                dataIndex: 'descripcion',
                                align: 'left'
                            }, {
                                header: 'Debe',
                                tooltip: 'Debe del período',
                                sortable: true,
                                dataIndex: 'debe',
                                align: 'right',
                                width: 20,
                                renderer: formatoMonedaABS
                            }, {
                                header: 'Haber',
                                tooltip: 'Haber del período',
                                sortable: true,
                                dataIndex: 'haber',
                                align: 'right',
                                width: 20,
                                renderer: formatoMonedaABS
                            }, {
                                header: scope.etiquetas.lbSaldoPer,
                                tooltip: scope.etiquetas.lbTtSaldoPer,
                                sortable: true,
                                dataIndex: 'saldoperiodo',
                                align: 'right',
                                width: 20,
                                renderer: formatoMonedaABS
                            }, {
                                header: scope.etiquetas.lbAcumulado,
                                tooltip: scope.etiquetas.lbTpAcumulado,
                                sortable: true,
                                dataIndex: 'saldoacumulado',
                                align: 'right',
                                width: 20,
                                renderer: formatoMonedaABS
                            }
                        ]));
                    scope.defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };

                    //Evento para editar solo las filas editables
                    scope.gpDatosReporte.on('beforeedit', function (editor) {
                        if (!editor.record.data.editable) {
                            return false;
                        }
                    });
                    scope.gpDatosReporte.on('afteredit', function (editor) {
                        if (editor.record.data.editable) {
                            var totalPlanAnno = 0;
                            var totalPlanFecha = 0;
                            var store = scope.gpDatosReporte.getStore();
                            for (var i = 0; i < store.getCount() - 1; i++) {
                                if (store.getAt(i).data.plananno != '') {
                                    totalPlanAnno += parseFloat(store.getAt(i).data.plananno);
                                }
                                if (store.getAt(i).data.planfecha != '') {
                                    totalPlanFecha += parseFloat(store.getAt(i).data.planfecha);
                                }
                            }
                            store.getAt(store.getCount() - 1).data.plananno = totalPlanAnno;
                            store.getAt(store.getCount() - 1).data.planfecha = totalPlanFecha;
                            scope.gpDatosReporte.getView().refresh();
                        }
                    });
                }
                    break;
                case '108': {//Resumen de gastos
                    scope.gpDatosReporte.reconfigure(
                        new Ext.data.GroupingStore({
                            groupField: 'Entidad',
                            sortInfo: {
                                field: "Entidad",
                                direction: "ASC"
                            },
                            reader: new Ext.data.ArrayReader({}, [
                                {name: 'Entidad', mapping: 'Entidad'},
                                {name: 'concatcuenta', mapping: 'concatcuenta'},
                                {name: 'descripcioncuenta', mapping: 'descripcioncuenta'},
                                {name: 'saldoinicio', mapping: 'saldoinicio'},
                                {name: 'saldoperiodo', mapping: 'saldoperiodo'},
                                {name: 'saldoacumulado', mapping: 'saldoacumulado'},
                            ]),
                            data: scope.responseDataReporte.datos
                        }),
                        new Ext.grid.ColumnModel([
                            {
                                header: scope.etiquetas.lbEntidad,
                                tooltip: scope.etiquetas.lbTtEntidad,
                                dataIndex: 'Entidad',
                                align: 'left',
                                hidden: true
                            },
                            {
                                header: scope.etiquetas.txElemento,
                                tooltip: scope.etiquetas.lbTtCodElemento,
                                sortable: false,
                                dataIndex: 'concatcuenta',
                                width: 80
                            },
                            {
                                header: scope.etiquetas.lbDescripcion,
                                tooltip: scope.etiquetas.lbTtElemento,
                                sortable: false,
                                dataIndex: 'descripcioncuenta',
                                align: 'left',
                                width: 270
                            },
                            {
                                header: scope.etiquetas.lbSaldoInicio,
                                tooltip: scope.etiquetas.lbTtSaldoInicio,
                                sortable: false,
                                dataIndex: 'saldoinicio',
                                align: 'right',
                                renderer: formatoMonedaABS,
                                width: 150
                            },
                            {
                                header: scope.etiquetas.lbSaldoPer,
                                tooltip: scope.etiquetas.lbTtSaldoPer,
                                sortable: false,
                                dataIndex: 'saldoperiodo',
                                align: 'right',
                                renderer: formatoMonedaABS,
                                width: 150
                            },
                            {
                                header: scope.etiquetas.lbAcumulado,
                                tooltip: scope.etiquetas.lbTpAcumulado,
                                sortable: false,
                                dataIndex: 'saldoacumulado',
                                align: 'right',
                                renderer: formatoMonedaABS,
                                width: 150
                            }
                        ]));
                    scope.defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                }
                    break;
                case '109': {
                    scope.flagBalance = false;
                    scope.gpDatosReporte.reconfigure(
                        new Ext.data.GroupingStore({
                            groupField: 'Entidad',
                            sortInfo: {
                                field: "Entidad",
                                direction: "ASC"
                            },
                            reader: new Ext.data.ArrayReader({}, [
                                {name: 'Entidad', mapping: 'Entidad'},
                                {name: 'concepto', mapping: 'concepto'},
                                {name: 'concatcta_envia', mapping: 'concatcta_envia'},
                                {name: 'saldo_envia', mapping: 'saldo_envia'},
                                {name: 'concatcta_recibe', mapping: 'concatcta_recibe'},
                                {name: 'saldo_recibe', mapping: 'saldo_recibe'},
                                {name: 'diferencia', mapping: 'diferencia'}
                            ]),
                            data: scope.responseDataReporte.datos
                        }),
                        new Ext.grid.ColumnModel([
                            {
                                header: scope.etiquetas.lbEntidad,
                                tooltip: scope.etiquetas.lbTtEntidad,
                                dataIndex: 'Entidad',
                                align: 'left',
                                hidden: true
                            }, {
                                header: 'Concepto',
                                tooltip: 'Concepto de la operación',
                                sortable: false,
                                dataIndex: 'concepto',
                                width: 250
                            }, {
                                header: 'Cuenta',
                                tooltip: 'Cuenta origen',
                                sortable: false,
                                dataIndex: 'concatcta_envia',
                                align: 'left',
                                width: 100
                            }, {
                                header: 'Saldo',
                                tooltip: 'Saldo origen',
                                sortable: false,
                                dataIndex: 'saldo_envia',
                                align: 'right',
                                //renderer: formatoMoneda,
                                renderer: function (value, metaData, record, rowIndex, colIndex) {
                                    if (record.data.concatcta_envia != '')
                                        return formatoMoneda(value);
                                },
                                width: 80
                            }, {
                                header: 'Cuenta',
                                tooltip: 'Cuenta destino',
                                sortable: false,
                                dataIndex: 'concatcta_recibe',
                                align: 'left',
                                width: 100
                            }, {
                                header: 'Saldo',
                                tooltip: 'Saldo destino',
                                sortable: false,
                                dataIndex: 'saldo_recibe',
                                align: 'right',
                                //renderer: formatoMoneda,
                                renderer: function (value, metaData, record, rowIndex, colIndex) {
                                    if (record.data.concatcta_envia != '')
                                        return formatoMoneda(value);
                                },
                                width: 80
                            }, {
                                header: 'Diferencia',
                                tooltip: 'Diferencia entre saldos',
                                sortable: false,
                                dataIndex: 'diferencia',
                                //renderer: formatoMoneda,
                                renderer: function (value, metaData, record, rowIndex, colIndex) {
                                    if (record.data.concatcta_envia != '')
                                        return formatoMoneda(value);
                                },
                                align: 'right',
                                width: 80
                            }
                        ]));
                    scope.defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                }
                    break;

            }
        };

        function ConstruirArrayObjetoPrint(data) {
            scope.datosCierre = new Array();
            scope.flagBalance = true;
            if (data.dataSources[0].datoCuerpo.length > 0) {
                scope.datosCierre.push({
                    "datoGeneral": data.dataSources[0]["datoGeneral"],
                    "datoCuerpo": data.dataSources[0]["datoCuerpo"],
                    "datoPie": data.dataSources[0]["datoPie"],
                    "reporte": scope.responseDataReporte.idreporte
                });
            }
            if (data.dataSources[1] != undefined)
                if (data.dataSources[1].datoCuerpo.length > 0) {
                    scope.datosCierre.push({
                        "datoGeneral": data.dataSources[1]["datoGeneral"],
                        "datoCuerpo": data.dataSources[1]["datoCuerpo"],
                        "datoPie": data.dataSources[1]["datoPie"],
                        "reporte": scope.responseDataReporte.idreporte
                    });
                }
        };

        this.fOpenWindowReport = function (dataRep) {
            if (scope.responseDataReporte.idreporte != '104') {
                // printView = new SCFPrintView(scope.responseDataReporte.dataSources, "/contabilidad/comun/SCFPrintView/", scope.defaultComponentsValue);
                // if (scope.flagBalance) {
                //     scope.datos = scope.datosCierre;
                // } else {
                    scope.datos = scope.responseDataReporte.dataSources;
                // }
                if (scope.datos[0].datoGeneral.reporte == 103 || scope.datos[0].datoGeneral.reporte == 105 || scope.datos[0].datoGeneral.reporte == 102) {
                    scope.datos[0].datoCuerpo = [];//cuando el data cuerpo este vacio es que voy a aplicar la variante
                    scope.datos[0].datoParametros = scope.parametrosUltimoReporte;//los datos necesarios para obtener el datoCuerpo en el servidor
                }
                printView = new SCFPrintView(scope.datos, "/contabilidad/comun/SCFPrintView/", scope.defaultComponentsValue);
                printView.show();
            } else {
                Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargandodatosparareporte, scope.etiquetas.msgEsperar);
                var listResult = new Array();
                var arrayPrint = Ext.getCmp('gpReportes').getStore().getRange();
                for (var i = 0; i < arrayPrint.length; i++) {
                    listResult.push({
                        idcomprobante: arrayPrint[i].json.idComprobante,
                    });
                }

                // Ext.Ajax.request({
                //     timeout: 300000,
                //     url: 'obtenerDatosImprimirReporte',
                //     params: {
                //         reporteParams: Ext.encode(listResult)
                //     },
                //     callback: function (options, success, response) {
                //         var responseData = Ext.decode(response.responseText);
                //         Ext.CONT.Componentes.HideBox('msgbIniciando');
                //         if (responseData.dataSources.length > 0) {
                //             scope.fOpenWindowReporte({
                //                 datoGeneral: {
                //                     reporte: '100'
                //                 },
                //                 datoCuerpo: responseData.dataSources
                //             });
                //         } else
                //             mostrarMensaje(1, scope.etiquetas.msgErrorcargandodatosparaelreporte);
                //     }
                // });
                Ext.CONT.Componentes.HideBox('msgbIniciando');
                scope.fOpenWindowReporte({
                    datoGeneral: {
                        reporte: '100'
                    },
                    datoCuerpo: [],
                    datoParametros: listResult
                });
            }
        };

        this.fOpenWindowReporte = function (requestDataSources) {
            printView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                paperSize: "FOLIO",
                orientation: "Horizontal",
                reportType: "HTML"
            });
            printView.show();
        };

        this.fOpenWindowExport = function (requestDataSources) {
            scope.fExportComprobante(scope.responseDataReporte.dataSources[0]);
        };

        this.fOpenWindowExportBalance = function () {
            var arrDatos = [];
            var des = '';
            var fecha = '';
            var count = 0;
            var debe = '';
            var haber = '';
            for (var i = 0; i < scope.responseDataReporte.datos.length; i++) {
                if (scope.responseDataReporte.datos[i].concatcuenta) {
                    debe = scope.responseDataReporte.datos[i].saldoacumuladodeudora.replace(/,/g, '');
                    haber = scope.responseDataReporte.datos[i].saldoacumuladoacreedora.replace(/,/g, '');
                    if (/[\(\)]/.test(debe)) {
                        haber = debe.replace(/[\(\)]/g, '');
                        debe = '0.00';
                    } else if (/[\(\)]/.test(haber)) {
                        debe = haber.replace(/[\(\)]/g, '');
                        haber = '0.00';
                    }
                    if (count === 0) {
                        des = 'Balance de ' + scope.responseDataReporte.datos[i].descripcionestructura;
                        fecha = scope.dfHasta.getRawValue();
                    } else {
                        des = '';
                        fecha = '';
                    }
                    arrDatos.push({
                        fechaemision: fecha,
                        numerocomprobante: undefined,
                        descripcomp: des,
                        detallecomp: des,
                        coddocprim: undefined,
                        codigoiso: 'CUP',
                        concatcta: scope.responseDataReporte.datos[i].concatcuenta,
                        debe:  debe,
                        haber: haber
                    });
                    count++;
                }
            }
            // var valprueba = {
            //     cuenta: '',
            //     subcuenta: '',
            //     descripcion: '',
            //     analisis: '',
            //     parcial: '',
            //     debe: '',
            //     haber: '',
            //     fechaemision: '',//
            //     numerocomprobante: '',//
            //     descripcomp: '',//
            //     detallecomp: '',//
            //     codigoestructura: '',
            //     descripcionestructura: '',
            //     idusuario: '',
            //     idusuarioasienta: '',
            //     coddocprim: '',//num doc
            //     descriptasa: '',
            //     codigoiso: '',//
            //     idtasa: '',
            //     factorconversion: '',
            //     concatcta: '',//
            //     idEstadoComprobante: '',
            //     confecciona: '',
            //     asienta: '',
            //     idsubsistemaorigen: '',
            //     subsistemaorigen: '',
            // };
            var requestDataSources = {
                datoGeneral: {
                    reporte: '100',
                    titulo: 'Comprobante de prueba',
                    eshoja: 1,
                    nivel: scope.ultimoNivel
                },
                datoCuerpo: arrDatos
            };

            // var self = this;
            // self.map.disable();
            scope.winExportCmp = new SCFPrintData(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                reportType: "DBF",
                typeAction: 'export'
            });
            scope.winExportCmp.show();
            scope.winExportCmp.doLayout();
            scope.winExportCmp.on({
                'show': function() {
                    // self.map.disable();
                },
                'close': function() {
                    // self.map.enable();
                }
            });

        };

        this.fExportComprobante = function(requestDataSources) {
            // var self = this;
            // self.map.disable();
            scope.winExportCmp = new SCFPrintData(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                reportType: "DBF",
                typeAction: 'export'
            });
            var arrSistemas = [
                [
                    'conso',
                    'CONSO'
                ]
            ];
            scope.winExportCmp.fPonerOtrosSistemasYFormatos(arrSistemas);
            scope.winExportCmp.show();
            scope.winExportCmp.doLayout();
            // scope.winExportCmp.on({
            //     'show': function() {
            //         self.map.disable();
            //     },
            //     'close': function() {
            //         self.map.enable();
            //     }
            // });
        };

        this.menuConsolidar = {
            IsValidShow: function (gridPanel, rowIndex) {
                var store = gridPanel.getStore();
                // var node = gridPanel.getStore().getAt(rowIndex);
                // if (node.data.consolidar == true)
                // this.ShowContext(gridPanel, false, node.data);
                var nodeRoot = gridPanel.getStore().getAt(0);
                if (nodeRoot.data.consolidar == true)
                    this.ShowContext(gridPanel, false, nodeRoot.data);
                else /*if (!node.data._is_leaf && store.isExpandedNode(node))*/ {
                    var nodeChildren = store.getNodeChildren(/*node*/nodeRoot);
                    if (this.GetNodeChildrenSelected(gridPanel, nodeChildren).length > 0 && gridPanel.getSelectionModel().isSelected(nodeRoot))
                        this.ShowContext(gridPanel, true, /*node.data*/nodeRoot.data);
                }
            },
            GetNodeChildrenSelected: function (gridPanel, nodeChildren) {
                var result = new Array();
                for (var i = 0; i < nodeChildren.length; i++)
                    if (gridPanel.getSelectionModel().isSelected(nodeChildren[i]))
                        result.push(nodeChildren[i]);
                return result;
            },
            ShowContext: function (gridPanel, flag, node) {
                Ext.getCmp('btnConsolidar').setVisible(flag);
                Ext.getCmp('btnNoConsolidar').setVisible(!flag);
                this.HandleFunction(this, flag, node, gridPanel);
            },
            UpdateData: function (gridPanel) {
                var store = gridPanel.getStore();
                Ext.getCmp('cbxEntidad').clearValue();
                gridPanel.getSelectionModel().displaySelect = new Array();
                var recordsSelections = gridPanel.getSelectionModel().getSelections();
                var records = store.getRange(0, store.getCount());
                store.removeAll();
                store.add(records);
                gridPanel.getSelectionModel().selectRecords(recordsSelections);
            },
            HandleFunction: function (scopeMenu, flag, node, gridPanel) {
                if (!flag) {
                    Ext.getCmp('btnNoConsolidar').purgeListeners();
                    Ext.getCmp('btnNoConsolidar').on('click', function () {
                        // this.hide();
                        node.text = node.text.replace(scope.etiquetas.lbBtnConsolidar, '');
                        node.consolidar = false;
                        scopeMenu.UpdateData(gridPanel);
                        Ext.getCmp('btnConsolidar').setVisible(true);
                    });
                } else {
                    Ext.getCmp('btnConsolidar').purgeListeners();
                    Ext.getCmp('btnConsolidar').on('click', function () {
                        // this.hide();
                        node.text = node.text + scope.etiquetas.lbBtnConsolidar;
                        node.consolidar = true;
                        scopeMenu.UpdateData(gridPanel);
                        Ext.getCmp('btnNoConsolidar').setVisible(true);
                    });
                }
            }
        };

        this.fAddComponent = function (idReport) {
            scope.pnlNorth.getComponent(1).remove(5, true);
            scope.pnlNorth.getComponent(1).remove(4, true);
            scope.pnlNorth.getComponent(1).remove(3, true);
            scope.pnlNorth.getComponent(1).remove(2, true);
            scope.pnlNorth.getComponent(1).remove(1, true);
            scope.pnlNorth.getComponent(1).purgeListeners();
            scope.pnlNorth.getComponent(1).on('add', function (container, component, index) {
                if (!component.getComponent(0).loaded) {
                    component.getComponent(0).on('expand', function (combo) {
                        if (!combo.loaded) {
                            combo.content.getComponent(0).getStore().load();
                        }
                    });
                    if (component.getComponent(0).content) {
                        component.getComponent(0).content.getComponent(0).getStore().on('load', function (store, records, options) {
                            if (store.reader.jsonData.length <= 0) {
                                component.getComponent(0).collapse();
                                if (scope.cbxReporte.getValue() == 101)
                                    scope.initMsgWarning(5);
                                if (scope.cbxReporte.getValue() == 102)
                                    scope.initMsgWarning(6);
                                if (scope.cbxReporte.getValue() == 103)
                                    scope.initMsgWarning(7);
                            }
                            component.getComponent(0).loaded = true;
                        });
                    }
                }
            });
            if (idReport == '104') {
                scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fAddCbxComponent('1', scope));
                scope.InicialEvenet('1');
            } else {
                if (idReport == '107') {
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetNivel(idReport, scope));
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetCtaNivel(scope));
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetElementoGasto(scope));
                } else if (idReport == '105') {
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetNivel(idReport, scope));
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetCtaNivel(scope));
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetCentroCosto(scope));
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetElementoGasto(scope));
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetcheckBMostrarCC(scope));
                } else if (idReport == '108') {//Resumen de Gasto por elemento
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetNivel(idReport, scope));
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetElementoGasto(scope));
                    //scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetMoneda(scope));
                } else if (idReport == '103') {//103-Balance
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fGetComponent(idReport, scope));
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetCtaArbol(scope));
                    if (!scope.btnExportar.disabled) {
                        scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetcheckBExportarConso(scope));
                    }
                    if (!scope.btnExportarUNE.disabled) {
                        scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fgetcheckBExportarUNE(scope));
                    }
                } else
                    scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fGetComponent(idReport, scope));
            }
            scope.pnlNorth.doLayout(true);
        };

        this.fAddNewComponent = function (idReport) {
            scope.pnlNorth.getComponent(1).remove(1, true);
            scope.pnlNorth.getComponent(1).purgeListeners();
            scope.pnlNorth.getComponent(1).on('add', function (container, component, index) {
                if (!component.getComponent(0).loaded) {
                    component.getComponent(0).on('expand', function (combo) {
                        if (!combo.loaded) {
                            combo.content.getComponent(0).getStore().load();
                        }
                    });
                    component.getComponent(0).content.getComponent(0).getStore().on('load', function () {
                        if (store.reader.jsonData.datos.length <= 0) {
                            component.getComponent(0).collapse();
                            scope.initMsgWarning(store.reader.jsonData.codigo);
                        }
                        component.getComponent(0).loaded = true;
                    });
                }
            });
            if (idReport == '104') {
                scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fAddCbxComponent('1', scope));
                scope.InicialEvenet('1');
            } else {
                scope.pnlNorth.getComponent(1).add(scope.UIRecuperacionesBasicas.fGetComponent(idReport, scope));
            }
            scope.pnlNorth.doLayout(true);
        };

        this.fIsDirty = function (list, listLoaded) {
            if (list.length == listLoaded.length) {
                for (i = 0; i < list.length; i++)
                    if (list[i] != listLoaded[i])
                        return true;
                return false;
            }
            return true;
        };

        this.fCanBeSelected = function (selections, record) {
            for (i = 0; i < selections.length; i++)
                if ((selections[i].data.ordenizq * 1 < record.data.ordenizq * 1 && selections[i].data.ordender * 1 > record.data.ordender * 1) || (selections[i].data.ordenizq * 1 > record.data.ordenizq * 1 && selections[i].data.ordender * 1 < record.data.ordender * 1))
                    return true;
            return false;
        };

        this.fValorActual = function (store, identificador, idActual) {
            cbxComponente = Ext.getCmp('cbx' + identificador);
            if (idActual && cbxComponente.fSelect.values.length == 0) {
                for (i = 0; i < store.getCount(); i++)
                    if (store.getAt(i).id == idActual) {
                        cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                        cbxComponente.fSelect.values.push(store.getAt(i).id);
                        cbxComponente.fSelect.index.push(i);
                    }
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
            }
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
        this.findValue = function (list, id) {
            for (j = 0; j < list.length; j++)
                if (list[j] == id)
                    return true;
            return false;
        };
        this.fResetValues = function (component) {
            component.clearValue();
            component.fSelect.values = new Array();
            component.fSelect.display = new Array();
            component.fSelect.index = new Array();
        };

        this.fFechaMayor = function (fechaUno, fechaDos) {
            xMes = fechaUno.substring(3, 5);
            xDia = fechaUno.substring(0, 2);
            xAnio = fechaUno.substring(6, 10);
            yMes = fechaDos.substring(3, 5);
            yDia = fechaDos.substring(0, 2);
            yAnio = fechaDos.substring(6, 10);
            return (xAnio > yAnio) ? true : ((xAnio == yAnio) ? ((xMes > yMes) ? true : ((xMes == yMes) ? ((xDia > yDia) ? true : false) : false)) : false);
        };

        this.fFechaIguales = function (fechaUno, fechaDos) {
            xMes = fechaUno.substring(3, 5);
            xDia = fechaUno.substring(0, 2);
            xAnio = fechaUno.substring(6, 10);
            yMes = fechaDos.substring(3, 5);
            yDia = fechaDos.substring(0, 2);
            yAnio = fechaDos.substring(6, 10);
            return (xAnio == yAnio) ? ((xMes == yMes) ? ((xDia == yDia) ? true : false) : false) : false;
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

        this.fOrdenaFechasMayores = function (valores) {
            for (i = 0; i < valores.length - 1; i++)
                for (j = i + 1; j < valores.length; j++)
                    if (!this.fFechaMayor(valores[i].data.inicio, valores[j].data.inicio)) {
                        valor = valores[i];
                        valores[i] = valores[j];
                        valores[j] = valor;
                    }
            return valores;
        };

        this.fSetearFechas = function (recordsSelection) {
            recordsLength = recordsSelection.length;
            if (recordsLength > 1) {
                recordsMenores = scope.fOrdenaFechasMenores(recordsSelection);
                scope.fSetValuesFechas(recordsMenores[0].data.inicio, scope.fOrdenaFechasMayores(recordsSelection)[0].data.fin);
            } else if (recordsLength == 1) {
                scope.fSetValuesFechas(recordsSelection[0].data.inicio, recordsSelection[0].data.fin);
            } else {
                scope.fResetValuesFecha();
            }
        };

        this.fSetValuesFechas = function (fechaInicio, fechaFin) {
            scope.dfDesde.setDisabled(false);
            scope.dfHasta.setDisabled(false);
            scope.dfDesde.reset();
            scope.dfHasta.reset();
            scope.dfDesde.setMinValue(fechaInicio);
            scope.dfHasta.setMaxValue(fechaFin);
            scope.dfDesde.setValue(fechaInicio);
            scope.dfHasta.setValue(fechaFin);
            scope.dfDesde.clearInvalid();
            scope.dfHasta.clearInvalid();
        };

        this.fResetValuesFecha = function () {
            date = new Date().format('d/m/Y');
            scope.dfDesde.setDisabled(true);
            scope.dfHasta.setDisabled(true);
            scope.dfDesde.setValue(null);
            scope.dfHasta.setValue(null);
        };


    },
    initMsgWarning: function (idWarning) {
        switch (idWarning) {
            case 1 : {
                mostrarMensaje(1, scope.etiquetas.lbNoConfEstructuraEcon, Ext.emptyFn);
            }
                break;
            case 2 : {
                mostrarMensaje(1, scope.etiquetas.lbNoConfEjercicio, Ext.emptyFn);
            }
                break;
            case 3 : {
                mostrarMensaje(1, scope.etiquetas.lbNoConfPer, Ext.emptyFn);
            }
                break;
            case 4 : {
                mostrarMensaje(1, scope.etiquetas.lbNoConfMoneda, Ext.emptyFn);
            }
                break;
            case 5 : {
                mostrarMensaje(1, scope.etiquetas.lbNoConfCta, Ext.emptyFn);
            }
                break;
            case 6 : {
                mostrarMensaje(1, scope.etiquetas.lbNoConfSubCta, Ext.emptyFn);
            }
                break;
            case 7 : {
                mostrarMensaje(1, scope.etiquetas.lbNoConfNivel, Ext.emptyFn);
            }
                break;
            case 8 : {
                mostrarMensaje(1, scope.etiquetas.lbNoConfSubsys, Ext.emptyFn);
            }
                break;
            case 9 : {
                mostrarMensaje(1, scope.etiquetas.lbNoConfComp, Ext.emptyFn);
            }
                break;
        }
    }
});
new Ext.CONT.Analisis.ClassRecuperacionesBasicas();
