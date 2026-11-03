Ext.namespace('Ext.CONT.Analisis.ClassRecuperaciones');
Ext.CONT.Analisis.ClassRecuperaciones = Ext.extend(Ext.Component, {
    perfil: window.parent.perfil,
    etiquetas: undefined,
    UIRecuperaciones: undefined,
    constructor: function() {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 12000000;
        Ext.CONT.Componentes.MessageBox('msgbIniciando');
        if (!document.getElementById('UIXCombo'))
            this.loadJs("/contabilidad/comun/componentes/xcombo/views/js/UIXCombo", 'UIXCombo');
        scope = this;
        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            callback: function(options, success, response) {
                scope.etiquetas = Ext.decode(response.responseText);
                scope.initializeClass();
            }
        });
    },
    loadJs: function(jsSrc, id) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    initializeClass: function() {
        this.UIRecuperaciones = new Ext.CONT.Analisis.UIRecuperaciones(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);
        this.loadDataComponent(this);
        Ext.CONT.Analisis.ClassRecuperaciones.superclass.constructor.call(this);
    },
    loadDataComponent: function(scope) {
        Ext.Ajax.request({
            method: "POST",
            url: "loadDataComponent",
            callback: function(options, success, response) {
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
    initializeEvents: function(scope) {
        Ext.getCmp('gpEntidad').getStore().on('load', function(store, records, options) {
            if (scope.jrEntidad.jsonData.Actual != null)
                scope.fValorActual(store, 'Entidad', scope.responseData.Entidades.Actual);
        });

        Ext.getCmp('gpEntidad').getSelectionModel().on({
            'selectionchange': function() {
                scope.fResetValues(scope.cbxEjercicio);
                scope.fResetValues(scope.cbxPeriodo);
                scope.cbxReporte.reset();
                scope.fResetValuesFecha();
                scope.cbxMoneda.clearValue();
                scope.cbxMoneda.valuesLoaded = new Array();
                scope.pnlNorth.getComponent(1).remove(3, true);
                scope.pnlNorth.getComponent(1).remove(2, true);
                scope.pnlNorth.getComponent(1).remove(1, true);
            },
            'rowselect': function(selectionModel, rowIndex, record) {
                Ext.getCmp('btnConsolidar').setVisible(false);
                Ext.getCmp('btnNoConsolidar').setVisible(false);
                scope.menuConsolidar.IsValidShow(Ext.getCmp('gpEntidad'), rowIndex);
            },
            'rowdeselect': function(selectionModel, rowIndex, record) {
                Ext.getCmp('btnConsolidar').setVisible(false);
                Ext.getCmp('btnNoConsolidar').setVisible(false);
                gridPanel = Ext.getCmp('gpEntidad');
                if (record.data.consolidar) {
                      record.data.text = record.data.text.replace(scope.etiquetas.lbBtnConsolidar, '');
                    record.data.consolidar = false;
                    scope.menuConsolidar.UpdateData(gridPanel);
                }
                var nodeAncestors = gridPanel.getStore().getNodeAncestors(record);
                for (var i = 0; i < nodeAncestors.length; i++)
                    if (nodeAncestors[i].data.consolidar)
                        if (scope.menuConsolidar.GetNodeChildrenSelected(gridPanel, gridPanel.getStore().getNodeChildren(nodeAncestors[i])).length == 0) {
                              nodeAncestors[i].data.text = nodeAncestors[i].data.text.replace(scope.etiquetas.lbBtnConsolidar, '');
                            nodeAncestors[i].data.consolidar = false;
                            scope.menuConsolidar.UpdateData(gridPanel);
                        }
            }
        });

        Ext.getCmp('gpEntidad').on('rowclick', function(gridPanel, rowIndex, e) {
            Ext.getCmp('btnConsolidar').setVisible(false);
            Ext.getCmp('btnNoConsolidar').setVisible(false);
            if (gridPanel.getSelectionModel().isSelected(rowIndex))
                scope.menuConsolidar.IsValidShow(gridPanel, rowIndex);
        });

        Ext.getCmp('gpEjercicio').getStore().on('load', function(store, records, options) {
            if (scope.jrEjercicio.jsonData.Actual != null)
                scope.fValorActualCopy(store, 'Ejercicio', 'Entidad', scope.jrEjercicio.jsonData.Actual);
        });

        this.cbxEjercicio.on('expand', function() {
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
        Ext.getCmp('gpEjercicio').getSelectionModel().on('selectionchange', function() {
            scope.fResetValues(scope.cbxPeriodo);
            scope.fResetValuesFecha();
            if (Ext.getCmp('gpEjercicio').getSelectionModel().getSelections().length > 0 || !scope.cbxEjercicio.isValid())
                scope.fSetearFechas(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
        });

        this.cbxPeriodo.on('expand', function() {
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
        this.cbxPeriodo.content.getComponent(0).getStore().on('load', function(store, records, options) {
            if (scope.jrPeriodo.jsonData.Actual != null) {
                scope.fValorActualCopy(store, 'Periodo', 'Ejercicio', scope.jrPeriodo.jsonData.Actual);
                scope.fSetValuesFechas(scope.responseData.Periodos.fechaInicio, scope.responseData.Periodos.fechaFin);
            }
        });
        Ext.getCmp('gpPeriodo').getSelectionModel().on('selectionchange', function() {
            selectionsPeriodo = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
            scope.fSetearFechas((selectionsPeriodo.length > 0) ? selectionsPeriodo : Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
        });


        this.stMoneda.on('load', function(store, records, options) {
            scope.cbxMoneda.valuesLoaded = scope.cbxEntidad.fSelect.values;
            scope.cbxMoneda.enable();
            if (records.length <= 0)
                scope.initMsgWarning(4);
            if (scope.jrMoneda.jsonData.Actual != null)
                scope.cbxMoneda.setValue(scope.jrMoneda.jsonData.Actual);
        });
        this.cbxMoneda.on('expand', function() {
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

        this.cbxEntidad.on('collapse', function() {
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

        this.cbxReporte.on('select', function(combo, record, index) {
            scope.fAddComponent(record.data.idreporte);
            scope.btnAbrirComprobante.hide();
            scope.btnAceptar.enable();
        });

        this.cbxReporte.on('expand', function(combo, record, index) {
            if (!Ext.getCmp('cbxEntidad').isValid())
                scope.cbxReporte.collapse();
        });

        this.btnAceptar.on('click', function() {
            if (scope.cbxReporte.getValue() != '104') {
                if (scope.pnlNorth.getForm().isValid(true) && Ext.getCmp('cbxComponent') != undefined) {
                    if (Ext.getCmp('cbxComponent').isValid(true))
                        scope.fAceptoReporte();
                    else
                          Ext.getCmp('cbxComponent').markInvalid(scope.etiquetas.lbBlankText);
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
                }
                else
                      scope.cbxReporte.markInvalid(scope.etiquetas.lbBlankText);
            }

        });

        this.btnAbrirComprobante.on('click', function() {
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

        this.gpDatosReporte.on('rowdblclick', function(Grid, rowIndex, e) {
            data = Grid.getStore().getAt(rowIndex).data;
            if (data.idcomprobante != undefined)
                if (data.idcomprobante.length > 0)
                    scope.btnAbrirComprobante.fireEvent('click');
        });

        this.smDatosReporte.on({
            rowselect: function(selectionModel, rowIndex, record) {
                if (scope.cbxReporte.getValue() != '104')
                    scope.btnAbrirComprobante.setVisible((record.data.idcomprobante != undefined) ? ((record.data.idcomprobante.length > 0) ? true : false) : false);
                else
                    scope.btnAbrirComprobante.setVisible((record.json.idComprobante != undefined) ? ((record.json.idComprobante.length > 0) ? true : false) : false);
            },
            rowdeselect: function(selectionModel, rowIndex, record) {
                scope.btnAbrirComprobante.setVisible(false);
            }
        });

        this.btnVistaPreliminar.on('click', function() {
            scope.fOpenWindowReport();
        });
    },
    initializeFunctions: function(scope) {
        this.fGetChildrenNodes = function(node, selection) {
            var arrayConsolidar = new Array(node.data.idestructurae);
            for (k = 0; k < selection.length; k++)
                if (node.data.ordenizq * 1 < selection[k].data.ordenizq * 1 && node.data.ordender * 1 > selection[k].data.ordender * 1)
                    arrayConsolidar.push(selection[k].data.idestructurae);
            return arrayConsolidar;
        };

        this.fObtenerListaEstructuraConsolidan = function() {
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
        this.fObtenerListaEstructura = function(listEstructurasConsolidan) {
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
        /*this.aqui va .. = function(animateTarget, title, msg, icon, time, callback) {
         var notification = new Ext.Cont.Notification({
         animateTarget: animateTarget,
         fnc: (callback) ? callback : Ext.emptyFn,
         iconbox: icon,
         iconCls: "icon-waiting",
         title: title,
         html: msg,
         hideDelay: (time) ? time : 5000
         });
         notification.box();
         };*/
        this.fAceptoReporte = function() {
            this.btnAceptar.disable();
            this.listEstructurasConsolidan = scope.fObtenerListaEstructuraConsolidan();
            if (this.listEstructurasConsolidan.length > 0 && scope.cbxReporte.getValue() != '103') {
                function fAcepto(btn) {
                    scope.btnAceptar.enable();
                }

                mostrarMensaje(1, 'En el reporte seleccionado no se consolida informaci&oacute;n.', fAcepto);
            } else {
                this.lMask = scope.UIRecuperaciones.loadMask(scope.pnlNorth.body, scope.etiquetas.msgEnviandoDatos);
                this.lMask.show();
                Ext.Ajax.request({
                    method: "POST",
                    params: (scope.cbxReporte.getValue() != '104') ? {
                        'tipo': '1',
                        'listIdEstructuraConsolidar': Ext.encode(this.listEstructurasConsolidan),
                        'arrayIdEstructurae': Ext.encode(this.fObtenerListaEstructura(this.listEstructurasConsolidan)),
                        'dfDesde': scope.dfDesde.getRawValue(),
                        'dfHasta': scope.dfHasta.getRawValue(),
                        'idMoneda': scope.cbxMoneda.getValue(),
                        'idReporte': scope.cbxReporte.getValue(),
                        'datos': Ext.encode(Ext.getCmp('cbxComponent').fSelect.values)
                    } : {
                        'tipo': '2',
                        'listIdEstructuraConsolidar': Ext.encode(this.listEstructurasConsolidan),
                        'arrayIdEstructurae': Ext.encode(this.fObtenerListaEstructura(this.listEstructurasConsolidan)),
                        'dfDesde': scope.dfDesde.getRawValue(),
                        'dfHasta': scope.dfHasta.getRawValue(),
                        'idMoneda': scope.cbxMoneda.getValue(),
                        'idReporte': scope.cbxReporte.getValue(),
                        'arrayIdSubsistemas': Ext.encode(Ext.getCmp('cbxSubsistema').fSelect.values),
                        'arrayIdEstados': Ext.encode(Ext.getCmp('cbxEstado').fSelect.values),
                        'arrayIdNumeros': Ext.encode(Ext.getCmp('cbxNumero').fSelect.values)
                    },
                    url: "cargarDatosReporte",
                    callback: function(options, success, response) {
                        scope.responseDataReporte = Ext.decode(response.responseText);
                        scope.lMask.hide();
                        scope.btnAceptar.enable();
                        if (scope.responseDataReporte.code == -4) {
                            var msg = String.format(scope.etiquetas.lbmsgNoCons, scope.responseDataReporte.estructurae, scope.responseDataReporte.criterioe);
                            mostrarMensaje(1, msg, function() {
                            });
                        }
                        else if (scope.cbxReporte.getValue() != '104') {
                            if (scope.responseDataReporte.datos.length > 0) {
                                scope.pnlNorth.collapse();
                                scope.btnVistaPreliminar.show();
                                scope.btnVistaPreliminar.focus();
                                scope.fDrawGridPanel();
                            } else {
                                scope.btnVistaPreliminar.hide();
                                scope.gpDatosReporte.reconfigure(
                                        new Ext.data.GroupingStore({
                                            fields: [],
                                            data: [[]],
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

                            }
                        }
                        else {
                            if (scope.responseDataReporte.datos.total > 0) {
                                scope.pnlNorth.collapse();
                                scope.btnVistaPreliminar.show();
                                scope.btnVistaPreliminar.focus();
                                scope.fDrawGridPanel();
                            } else {
                                scope.btnVistaPreliminar.hide();
                                scope.gpDatosReporte.reconfigure(
                                        new Ext.data.GroupingStore({
                                            fields: [],
                                            data: [[]],
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

        this.InicialEvenet = function(numero) {
            scope.pnlNorth.getComponent(1).purgeListeners();
            switch (numero) {
                case '1' :
                    Ext.getCmp('gpSubsistema').getSelectionModel().on('selectionchange', function() {
                        scope.pnlNorth.getComponent(1).remove(3, true);
                        scope.pnlNorth.getComponent(1).remove(2, true);
                        scope.pnlNorth.getComponent(1).add(scope.UIRecuperaciones.fAddCbxComponent('2', scope));
                        scope.pnlNorth.doLayout(true);
                        scope.InicialEvenet('2');
                        scope.InicialEvenet('4');
                    });
                    Ext.getCmp('gpSubsistema').getStore().on('load', function(store, records, options) {
                        if (store.reader.jsonData.datos.length <= 0) {
                            Ext.getCmp('cbxSubsistema').collapse();
                            scope.initMsgWarning(8);
                        }
                    });
                    break;
                case '2' :
                    Ext.getCmp('cbxEstado').on('expand', function() {
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
                    Ext.getCmp('gpEstado').getStore().on('load', function(store, records, options) {
                        if (store.reader.jsonData.datos.length <= 0) {
                            Ext.getCmp('cbxEstado').collapse();
                            scope.initMsgWarning(9);
                        }
                    });
                    break;
                case '3' :
                    Ext.getCmp('cbxNumero').on('expand', function() {
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
                    Ext.getCmp('gpNumero').getStore().on('load', function(store, records, options) {
                        if (store.reader.jsonData.datos.length <= 0) {
                            Ext.getCmp('cbxNumero').collapse();
                            scope.initMsgWarning(9);
                        }
                    });
                    break;
                case '4' :
                    Ext.getCmp('gpEstado').getSelectionModel().on('selectionchange', function() {
                        scope.pnlNorth.getComponent(1).remove(3, true);
                        scope.pnlNorth.getComponent(1).add(scope.UIRecuperaciones.fAddCbxComponent('3', scope));
                        scope.pnlNorth.doLayout(true);
                        scope.InicialEvenet('3');
                    });
                    break;
            }
        };

        this.fDrawGridPanel = function() {
            switch (scope.responseDataReporte.idreporte) {
                case '101':
                    {
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
                                    },
                                    {
                                        header: scope.etiquetas.lbCuenta,
                                        tooltip: scope.etiquetas.lbTtCuenta,
                                        dataIndex: 'Cuenta',
                                        align: 'left',
                                        width: 250
                                    },
                                    {
                                        header: scope.etiquetas.lbFecha,
                                        tooltip: scope.etiquetas.lbFechaCont,
                                        dataIndex: 'fechaemision',
                                        width: 100
                                    },
                                    {
                                        header: scope.etiquetas.lbNoComprobante,
                                        tooltip: scope.etiquetas.lbTtNoComprobante,
                                        dataIndex: 'comprobante',
                                        width: 150
                                    },
                                    {
                                        id: 'expandir',
                                        header: scope.etiquetas.lbDescripcion,
                                        tooltip: scope.etiquetas.lbTtDescripcion,
                                        dataIndex: 'descripcion',
                                        width: 350
                                    },
                                    {
                                        header: scope.etiquetas.lbDebe,
                                        tooltip: scope.etiquetas.lbTtDebe,
                                        dataIndex: 'debe',
                                        align: 'right',
                                        width: 110
                                    },
                                    {
                                        header: scope.etiquetas.lbHaber,
                                        tooltip: scope.etiquetas.lbTtHaber,
                                        dataIndex: 'haber',
                                        align: 'right',
                                        width: 110
                                    },
                                    {
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
                  case '501':
                    {
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
                                        width: 100
                                    }, {
                                        header: scope.etiquetas.lbNoComprobante,
                                        tooltip: scope.etiquetas.lbTtNoComprobante,
                                        dataIndex: 'comprobante',
                                        width: 100
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
                    {
                        ConstruirArrayObjetoPrint(scope.responseDataReporte);
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
                                        {name: 'saldoperiodo', mapping: 'saldoperiodo'}
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
                                        header: scope.etiquetas.lbCodigo,
                                        tooltip: scope.etiquetas.lbTtCodigo,
                                        sortable: false,
                                        dataIndex: 'concatcuenta',
                                        width: 80
                                    },
                                    {
                                        header: scope.etiquetas.lbNombreCta,
                                        tooltip: scope.etiquetas.lbTtNombCta,
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
                                        align: 'left',
                                        width: 150
                                    },
                                    {
                                        header: scope.etiquetas.lbParcial,
                                        tooltip: scope.etiquetas.lbTtParcial,
                                        sortable: false,
                                        dataIndex: 'parcial',
                                        align: 'right',
                                        width: 150
                                    },
                                    {
                                        header: scope.etiquetas.lbDebe,
                                        tooltip: scope.etiquetas.lbTtDebe,
                                        sortable: false,
                                        dataIndex: 'debe',
                                        align: 'right',
                                        width: 150
                                    },
                                    {
                                        header: scope.etiquetas.lbHaber,
                                        tooltip: scope.etiquetas.lbTtHaber,
                                        sortable: false,
                                        dataIndex: 'haber',
                                        align: 'right',
                                        width: 150
                                    },
                                    {
                                        header: scope.etiquetas.lbSaldoPer,
                                        tooltip: scope.etiquetas.lbTtSaldoPer,
                                        sortable: false,
                                        dataIndex: 'saldoperiodo',
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
                case '104':
                    {
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
                                    },
                                    {
                                        header: scope.etiquetas.lbNoComprobante,
                                        tooltip: scope.etiquetas.lbTtNoComprobante,
                                        sortable: true,
                                        dataIndex: 'numeroComprobante',
                                        width: 120
                                    },
                                    {
                                        id: 'idexpandir',
                                        header: 'Observaci&oacute;n',
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
                                )
                                ;
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
                    "reporte": "103"
                });
            }
            if (data.dataSources[1] != undefined)
                if (data.dataSources[1].datoCuerpo.length > 0) {
                    scope.datosCierre.push({
                        "datoGeneral": data.dataSources[1]["datoGeneral"],
                        "datoCuerpo": data.dataSources[1]["datoCuerpo"],
                        "datoPie": data.dataSources[1]["datoPie"],
                        "reporte": "103"});
                }
        }


        this.fOpenWindowReport = function() {
            if (scope.responseDataReporte.idreporte != '104') {
                scope.datos = (scope.flagBalance) ? scope.datosCierre : scope.responseDataReporte.dataSources;
                printView = new SCFPrintView(scope.datos, "/contabilidad/comun/SCFPrintView/", scope.defaultComponentsValue);
                printView.show();
            } else {
                Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargandodatosparareporte, scope.etiquetas.msgEsperar);
                listResult = new Array();
                arrayPrint = Ext.getCmp('gpReportes').getStore().getRange();
                for (i = 0; i < arrayPrint.length; i++) {
                    listResult.push({
                        idcomprobante: arrayPrint[i].json.idComprobante,
                        idestructurae: arrayPrint[i].json.idEstructurae
                    });
                }
                ;
                Ext.Ajax.request({
                    url: 'obtenerDatosImprimirReporte',
                    params: {
                        reporteParams: Ext.encode(listResult)
                    },
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        if (responseData.dataSources.length > 0) {
                            scope.fOpenWindowReporte({
                                datoGeneral: {
                                    reporte: '100'
                                },
                                datoCuerpo: responseData.dataSources
                            });
                        }
                        else
                            mostrarMensaje(1, scope.etiquetas.msgErrorcargandodatosparaelreporte);
                    }
                });
            }
        };

        this.fOpenWindowReporte = function(requestDataSources) {
            printView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                paperSize: "FOLIO",
                orientation: "Horizontal",
                reportType: "HTML"
            });
            printView.show();
        };

        this.menuConsolidar = {
            IsValidShow: function(gridPanel, rowIndex) {
                store = gridPanel.getStore();
                node = gridPanel.getStore().getAt(rowIndex);
                if (node.data.consolidar == true)
                    this.ShowContext(gridPanel, false, node.data);
                else if (!node.data._is_leaf && store.isExpandedNode(node)) {
                    nodeChildren = store.getNodeChildren(node);
                    if (this.GetNodeChildrenSelected(gridPanel, nodeChildren).length > 0)
                        this.ShowContext(gridPanel, true, node.data);
                }
            },
            GetNodeChildrenSelected: function(gridPanel, nodeChildren) {
                result = new Array();
                for (i = 0; i < nodeChildren.length; i++)
                    if (gridPanel.getSelectionModel().isSelected(nodeChildren[i]))
                        result.push(nodeChildren[i]);
                return result;
            },
            ShowContext: function(gridPanel, flag, node) {
                Ext.getCmp('btnConsolidar').setVisible(flag);
                Ext.getCmp('btnNoConsolidar').setVisible(!flag);
                this.HandleFunction(this, flag, node, gridPanel);
            },
            UpdateData: function(gridPanel) {
                store = gridPanel.getStore();
                Ext.getCmp('cbxEntidad').clearValue();
                gridPanel.getSelectionModel().displaySelect = new Array();
                recordsSelections = gridPanel.getSelectionModel().getSelections();
                records = store.getRange(0, store.getCount());
                store.removeAll();
                store.add(records);
                gridPanel.getSelectionModel().selectRecords(recordsSelections);
            },
            HandleFunction: function(scope, flag, node, gridPanel) {
                if (!flag) {
                    Ext.getCmp('btnNoConsolidar').purgeListeners();
                    Ext.getCmp('btnNoConsolidar').on('click', function() {
                        this.hide();
                          node.text = node.text.replace(scope.etiquetas.lbBtnConsolidar, '');
                        node.consolidar = false;
                        scope.UpdateData(gridPanel);
                    });
                } else {
                    Ext.getCmp('btnConsolidar').purgeListeners();
                    Ext.getCmp('btnConsolidar').on('click', function() {
                        this.hide();
                          node.text = node.text + scope.etiquetas.lbBtnConsolidar;
                        node.consolidar = true;
                        scope.UpdateData(gridPanel);
                    });
                }
            }
        };

        this.fAddComponent = function(idReport) {
            scope.pnlNorth.getComponent(1).remove(3, true);
            scope.pnlNorth.getComponent(1).remove(2, true);
            scope.pnlNorth.getComponent(1).remove(1, true);
            scope.pnlNorth.getComponent(1).purgeListeners();
            scope.pnlNorth.getComponent(1).on('add', function(container, component, index) {
                if (!component.getComponent(0).loaded) {
                    component.getComponent(0).on('expand', function(combo) {
                        if (!combo.loaded) {
                            combo.content.getComponent(0).getStore().load();
                        }
                    });
                    component.getComponent(0).content.getComponent(0).getStore().on('load', function(store, records, options) {
                        if (store.reader.jsonData.length <= 0) {
                            component.getComponent(0).collapse();
                              if(scope.cbxReporte.getValue() == 501)
                                  scope.initMsgWarning(6);
                              if(scope.cbxReporte.getValue() == 502)
                                scope.initMsgWarning(6);
                              if(scope.cbxReporte.getValue() == 504)
                                  scope.initMsgWarning(6);
                        }
                        component.getComponent(0).loaded = true;
                    });
                }
            });
            if (idReport == '104') {
                scope.pnlNorth.getComponent(1).add(scope.UIRecuperaciones.fAddCbxComponent('1', scope));
                scope.InicialEvenet('1');
            } else {
                scope.pnlNorth.getComponent(1).add(scope.UIRecuperaciones.fGetComponent(idReport, scope));
            }
            scope.pnlNorth.doLayout(true);
        };

        this.fAddNewComponent = function(idReport) {
            scope.pnlNorth.getComponent(1).remove(1, true);
            scope.pnlNorth.getComponent(1).purgeListeners();
            scope.pnlNorth.getComponent(1).on('add', function(container, component, index) {
                if (!component.getComponent(0).loaded) {
                    component.getComponent(0).on('expand', function(combo) {
                        if (!combo.loaded) {
                            combo.content.getComponent(0).getStore().load();
                        }
                    });
                    component.getComponent(0).content.getComponent(0).getStore().on('load', function() {
                        if (store.reader.jsonData.datos.length <= 0) {
                            component.getComponent(0).collapse();
                            scope.initMsgWarning(store.reader.jsonData.codigo);
                        }
                        component.getComponent(0).loaded = true;
                    });
                }
            });
            if (idReport == '104') {
                scope.pnlNorth.getComponent(1).add(scope.UIRecuperaciones.fAddCbxComponent('1', scope));
                scope.InicialEvenet('1');
            } else {
                scope.pnlNorth.getComponent(1).add(scope.UIRecuperaciones.fGetComponent(idReport, scope));
            }
            scope.pnlNorth.doLayout(true);
        };

        this.fIsDirty = function(list, listLoaded) {
            if (list.length == listLoaded.length) {
                for (i = 0; i < list.length; i++)
                    if (list[i] != listLoaded[i])
                        return true;
                return false;
            }
            return true;
        };

        this.fCanBeSelected = function(selections, record) {
            for (i = 0; i < selections.length; i++)
                if ((selections[i].data.ordenizq * 1 < record.data.ordenizq * 1 && selections[i].data.ordender * 1 > record.data.ordender * 1) || (selections[i].data.ordenizq * 1 > record.data.ordenizq * 1 && selections[i].data.ordender * 1 < record.data.ordender * 1))
                    return true;
            return false;
        };

        this.fValorActual = function(store, identificador, idActual) {
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
        this.fValorActualCopy = function(store, identificador, identificadorAntecesor, idActual) {
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
        this.findValue = function(list, id) {
            for (j = 0; j < list.length; j++)
                if (list[j] == id)
                    return true;
            return false;
        };
        this.fResetValues = function(component) {
            component.clearValue();
            component.fSelect.values = new Array();
            component.fSelect.display = new Array();
            component.fSelect.index = new Array();
        };

        this.fFechaMayor = function(fechaUno, fechaDos) {
            xMes = fechaUno.substring(3, 5);
            xDia = fechaUno.substring(0, 2);
            xAnio = fechaUno.substring(6, 10);
            yMes = fechaDos.substring(3, 5);
            yDia = fechaDos.substring(0, 2);
            yAnio = fechaDos.substring(6, 10);
            return (xAnio > yAnio) ? true : ((xAnio == yAnio) ? ((xMes > yMes) ? true : ((xMes == yMes) ? ((xDia > yDia) ? true : false) : false)) : false);
        };

        this.fFechaIguales = function(fechaUno, fechaDos) {
            xMes = fechaUno.substring(3, 5);
            xDia = fechaUno.substring(0, 2);
            xAnio = fechaUno.substring(6, 10);
            yMes = fechaDos.substring(3, 5);
            yDia = fechaDos.substring(0, 2);
            yAnio = fechaDos.substring(6, 10);
            return (xAnio == yAnio) ? ((xMes == yMes) ? ((xDia == yDia) ? true : false) : false) : false;
        };

        this.fOrdenaFechasMenores = function(valores) {
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

        this.fOrdenaFechasMayores = function(valores) {
            for (i = 0; i < valores.length - 1; i++)
                for (j = i + 1; j < valores.length; j++)
                    if (!this.fFechaMayor(valores[i].data.inicio, valores[j].data.inicio)) {
                        valor = valores[i];
                        valores[i] = valores[j];
                        valores[j] = valor;
                    }
            return valores;
        };

        this.fSetearFechas = function(recordsSelection) {
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

        this.fSetValuesFechas = function(fechaInicio, fechaFin) {
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

        this.fResetValuesFecha = function() {
            date = new Date().format('d/m/Y');
            scope.dfDesde.setDisabled(true);
            scope.dfHasta.setDisabled(true);
            scope.dfDesde.setValue(null);
            scope.dfHasta.setValue(null);
        };


    },
    initMsgWarning: function(idWarning) {
        switch (idWarning) {
            case 1 :
                {
                    mostrarMensaje(1, scope.etiquetas.lbNoConfEstructuraEcon, Ext.emptyFn);
                }
                break;
            case 2 :
                {
                    mostrarMensaje(1, scope.etiquetas.lbNoConfEjercicio, Ext.emptyFn);
                }
                break;
            case 3 :
                {
                    mostrarMensaje(1, scope.etiquetas.lbNoConfPer, Ext.emptyFn);
                }
                break;
            case 4 :
                {
                    mostrarMensaje(1, scope.etiquetas.lbNoConfMoneda, Ext.emptyFn);
                }
                break;
            case 5 :
                {
                    mostrarMensaje(1, scope.etiquetas.lbNoConfCta, Ext.emptyFn);
                }
                break;
            case 6 :
                {
                    mostrarMensaje(1, scope.etiquetas.lbNoConfSubCta, Ext.emptyFn);
                }
                break;
            case 7 :
                {
                    mostrarMensaje(1, scope.etiquetas.lbNoConfNivel, Ext.emptyFn);
                }
                break;
            case 8 :
                {
                    mostrarMensaje(1, scope.etiquetas.lbNoConfSubsys, Ext.emptyFn);
                }
                break;
            case 9 :
                {
                    mostrarMensaje(1, scope.etiquetas.lbNoConfComp, Ext.emptyFn);
                }
                break;
        }
    }
});
new Ext.CONT.Analisis.ClassRecuperaciones();

