Ext.namespace('Ext.CONT.Analisis.UIRecuperacionesBasicas');
Ext.CONT.Analisis.UIRecuperacionesBasicas = Ext.extend(Ext.util.Observable, {
    constructor: function (scope) {
        Ext.CONT.Analisis.UIRecuperacionesBasicas.superclass.constructor.call(this);
        this.viewPort(scope);
        return this;
    },
    loadMask: function (body, msg) {
        Ext.apply(this, {
            msg: msg
        });
        return new Ext.LoadMask(body, this);
    },
    viewPort: function (scope) {
        Ext.apply(this, {
            keys: new Ext.KeyMap(Ext.getBody(), [{
                // ADICIONAR
                key: 'h',
                alt: true,
                fn: function () {
                    help.show(scope.etiquetas.titleH1, 'confin/CG/recuperaciones/basicas');
                }
            }, {
                key: 'r',
                alt: true,
                fn: function () {
                    if (!Ext.getCmp('btnVistaPreliminar').hidden)
                        Ext.getCmp('btnVistaPreliminar').fireEvent('click');
                }
            }, {
                key: 'a',
                alt: true,
                fn: function () {
                    if (!Ext.getCmp('btnAbrirComprobante').hidden)
                        Ext.getCmp('btnAbrirComprobante').fireEvent('click');
                }
            }
            ]),
            renderTo: document.body,
            layout: 'border',
            items: [scope.pnlNorth = this.pnlNorth(scope), scope.pnlSouth = this.pnlSouth(scope)]
        });
        return new Ext.Viewport(this);
    },
    pnlNorth: function (scope) {
        scope.cbxEntidad = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.txtSeleccione,
            allowBlank: false,
            fieldLabel: scope.etiquetas.lbEntidad,
            tabIndex: 1
        }, {
            identificador: 'Entidad',
            displayText: 'Entidad',
            url: 'obtenerEntidadesParaBusqueda',
            autoLoad: false,
            tbar: [new Ext.Button({
                iconCls: 'deshabilitar amarillo',
                text: scope.etiquetas.txtNoConsolidar,
                id: 'btnNoConsolidar',
                hidden: true
            }), new Ext.Button({
                iconCls: 'habilitar amarillo',
                text: scope.etiquetas.txtConsolidar,
                id: 'btnConsolidar',
                hidden: true
            })],
            singleSelect: false,
            reader: scope.jrEntidad = new Ext.data.JsonReader({
                id: 'idestructurae',
                root: 'datos'
            }, [{
                name: '_parent',
                mapping: 'idestructuraepadre'
            }, {
                name: '_is_leaf',
                mapping: 'leaf'
            }, {
                name: 'id'
            }, {
                name: 'text'
            }, {
                name: 'codigo',
                mapping: 'text'
            }, {
                name: 'idestructurae'
            }, {
                name: 'idestructuraepadre'
            }, {
                name: 'ordenizq'
            }, {
                name: 'ordender'
            }])
        });

        scope.cbxEjercicio = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.txtSeleccione,
            allowBlank: false,
            fieldLabel: scope.etiquetas.txtEjercicio,
            hiddenTbar: true,
            tabIndex: 2
        }, {
            identificador: 'Ejercicio',
            displayText: 'Ejercicio',
            url: 'obtenerEjerciciosParaBusqueda',
            autoLoad: false,
            singleSelect: true,
            reader: scope.jrEjercicio = new Ext.data.JsonReader({
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

        scope.cbxPeriodo = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.txtSeleccione,
            fieldLabel: scope.etiquetas.txtPeriodo,
            allowBlank: false,
            hiddenTbar: true,
            tabIndex: 3
        }, {
            identificador: 'Periodo',
            displayText: 'Per&iacute;odo',
            url: 'obtenerPeriodosParaBusqueda',
            autoLoad: false,
            singleSelect: true,
            reader: scope.jrPeriodo = new Ext.data.JsonReader({
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

        Ext.apply(Ext.form.VTypes, {
            daterange: function (val, field) {
                var date = field.parseDate(val);
                var dispUpd = function (picker) {
                    var ad = picker.activeDate;
                    picker.activeDate = null;
                    picker.update(ad);
                };
                if (field.startDateField) {
                    var sd = Ext.getCmp(field.startDateField);
                    sd.maxValue = date;
                    if (sd.menu && sd.menu.picker) {
                        sd.menu.picker.maxDate = date;
                        dispUpd(sd.menu.picker);
                    }
                } else if (field.endDateField) {
                    var ed = Ext.getCmp(field.endDateField);
                    ed.minValue = date;
                    if (ed.menu && ed.menu.picker) {
                        ed.menu.picker.minDate = date;
                        dispUpd(ed.menu.picker);
                    }
                }
                return true;
            }
        });

        scope.dfDesde = new Ext.form.DateField({
            fieldLabel: scope.etiquetas.txtDesde,
            enableKeyEvents: true,
            tabIndex: 4,
            vtype: 'daterange',
            name: 'dfDesde',
            id: 'dfDesde',
            endDateField: 'dfHasta',
            anchor: '100%',
            readOnly: true,
            format: 'd/m/Y',
            allowBlank: true
        });

        scope.dfHasta = new Ext.form.DateField({
            fieldLabel: scope.etiquetas.txtHasta,
            enableKeyEvents: true,
            vtype: 'daterange',
            startDateField: 'dfDesde',
            tabIndex: 5,
            name: 'dfHasta',
            id: 'dfHasta',
            anchor: '100%',
            allowBlank: false,
            readOnly: true,
            format: 'd/m/Y'
        });

        scope.cbxMoneda = new Ext.form.ComboBox({
            emptyText: scope.etiquetas.txtSeleccione,
            forceSelection: true,
            tabIndex: 6,
            allowBlank: true,
            valuesLoaded: new Array(),
            fieldLabel: scope.etiquetas.txtMoneda,
            store: scope.stMoneda = new Ext.data.Store({
                url: 'obtenerMonedasParaBusqueda',
                reader: scope.jrMoneda = new Ext.data.JsonReader({
                    root: 'datos',
                    id: 'idmoneda'
                }, [{
                    name: 'idmoneda'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigoiso'
                }])
            }),
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            hiddenName: 'idmoneda',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            shadow: true,
            enableKeyEvents: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            anchor: '100%'
        });

        var datos = [
            {
                'idreporte': '101',
                'nombre': scope.etiquetas.txtMayor
            }, {
                'idreporte': '102',
                'nombre': scope.etiquetas.txtSubMayor
            }, {
                'idreporte': '103',
                'nombre': scope.etiquetas.txtBalance
            }, {
                'idreporte': '104',
                'nombre': scope.etiquetas.txtComprobantes
            }, {
                'idreporte': '105',
                'nombre': scope.etiquetas.txtEstadoGastos
            }/*, {
                     'idreporte': '106',
                     'nombre': scope.etiquetas.txtEstadoInversiones
                     }*/
            , {
                'idreporte': '107',
                'nombre': scope.etiquetas.txtAnalisisGastos
            }, {
                'idreporte': '108',
                'nombre': scope.etiquetas.txtResumenGastos
            }, {
                'idreporte': '109',
                'nombre': 'Operaciones entre dependencias'
            }
        ];
        if (scope.accionesPermitidas) {
            for (var i = 0; i < scope.accionesPermitidas.length; i++) {
                if (scope.accionesPermitidas[i].abreviatura == 'rpt208') {
                    datos.push({
                        'idreporte': '208',
                        'nombre': 'Balance de operaciones entre dependencias'
                    });
                }
            }
        }

        scope.cbxReporte = new Ext.form.ComboBox({
            emptyText: scope.etiquetas.txtSeleccione,
            invalidText: "Este campo es obligatorio.",
            forceSelection: true,
            tabIndex: 7,
            allowBlank: false,
            editable: false,
            fieldLabel: scope.etiquetas.txtReporte,
            store: new Ext.data.JsonStore({
                fields: ['idreporte', 'nombre'],
                autoLoad: true,
                data: datos
            }),
            valueField: 'idreporte',
            displayField: 'nombre',
            hiddenName: 'idreporte',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            shadow: true,
            enableKeyEvents: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            anchor: '100%'
        });

        scope.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            tooltip: scope.etiquetas.tooltipBtnAceptar,
            text: scope.etiquetas.txtAceptar,
            id: 'btnAceptar'
        });
        scope.btnAyuda = new Ext.Button({
            iconCls: 'ayuda',
            id: 'btnHelpRecuperacionesBasicas',
            text: scope.etiquetas.lbbtnHelp,
            nextTab: 'cbPais',
            tooltip: scope.etiquetas.lbttipHelp
        });

        Ext.apply(this, {
            region: 'north',
            height: 135,
            frame: true,
            border: false,
            labelAlign: 'top',
            items: [
                {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [
                        {
                            columnWidth: .50,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: scope.cbxEntidad
                        },
                        {
                            columnWidth: .15,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: scope.cbxEjercicio
                        },
                        {
                            columnWidth: .15,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: scope.cbxPeriodo
                        },
                        {
                            columnWidth: .10,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: scope.dfDesde
                        },
                        {
                            columnWidth: .10,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: scope.dfHasta
                            // },
                            // {
                            //     columnWidth: .5,
                            //     style: 'margin: 0 0 0 5',
                            //     layout: 'form',
                            //     items: scope.cbxMoneda
                        }]
                },
                {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [
                        {
                            columnWidth: .25,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: scope.cbxReporte
                        }]
                }
            ],
            bbar: [scope.btnAceptar, "->", scope.btnAyuda]
        });
        return new Ext.form.FormPanel(this);
    },
    fGetComponent: function (value, scope) {
        switch (value) {
            case '101' :
                component = new Ext.CONT.UIXCombo({
                    emptyText: scope.etiquetas.txtSeleccione,
                    invalidText: "Este campo es obligatorio.",
                    allowBlank: true,
                    loaded: false,
                    fieldLabel: scope.etiquetas.lbCuenta,
                    tabIndex: 8
                }, {
                    identificador: 'Component',
                    displayText: 'text',
                    url: 'obtenerCuentas',
                    height: 400,
                    autoLoad: false,
                    singleSelect: false,
                    baseParams: {
                        'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values)
                    },
                    reader: scope.jrCuenta = new Ext.data.JsonReader({
                        id: 'idcuenta'
                    }, [{
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'text'
                    }, {
                        name: 'idcuenta'
                    }, {
                        name: 'codigo',
                        mapping: 'concatcta'
                    }, {
                        name: 'descripcion'
                    }, {
                        name: 'clavecuenta'
                    }])
                });
                break;
            case '102' :
                component = new Ext.CONT.UIXCombo({
                    emptyText: scope.etiquetas.txtSeleccione,
                    invalidText: "Este campo es obligatorio.",
                    allowBlank: true,
                    loaded: false,
                    fieldLabel: scope.etiquetas.txtSubCuenta,
                    tabIndex: 8
                }, {
                    identificador: 'Component',
                    displayText: 'text',
                    url: 'obtenerSubCuentas',
                    baseParams: {
                        'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values)
                    },
                    height: 400,
                    autoLoad: false,
                    singleSelect: false,
                    reader: scope.jrSubCuenta = new Ext.data.JsonReader({
                        id: 'idcuenta'
                    }, [{
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'text'
                    }, {
                        name: 'idcuenta'
                    }, {
                        name: 'codigo',
                        mapping: 'concatcta'
                    }, {
                        name: 'descripcion'
                    }, {
                        name: 'clavecuenta'
                    }])
                });
                break;
			case '109':
			case '208':
				component = new Ext.CONT.UIXCombo({
					emptyText: 'Epigrafe',
					allowBlank: false,
					fieldLabel: 'Epigrafe',
					tabIndex: 1
				}, {
					identificador: 'EntidadEPI',
					displayText: 'Entidad',
					url: 'obtenerEntidadesParaBusqueda?todas=1',
					autoLoad: true,
					tbar: [new Ext.Button({
						iconCls: 'deshabilitar amarillo',
						text: scope.etiquetas.txtNoConsolidar,
						id: 'btnNoConsolidar',
						hidden: true
					})],
					singleSelect: false,
					reader: scope.jrEntidad = new Ext.data.JsonReader({
						id: 'idestructurae',
						root: 'datos'
					}, [{
						name: '_parent',
						mapping: 'idestructuraepadre'
					}, {
						name: '_is_leaf',
						mapping: 'leaf'
					}, {
						name: 'id'
					}, {
						name: 'text'
					}, {
						name: 'codigo',
						mapping: 'text'
					}, {
						name: 'idestructurae'
					}, {
						name: 'idestructuraepadre'
					}, {
						name: 'ordenizq'
					}, {
						name: 'ordender'
					}])
				});
				break;
            default :
                component = new Ext.CONT.UIXCombo({
                    emptyText: scope.etiquetas.txtSeleccione,
                    invalidText: "Este campo es obligatorio.",
                    allowBlank: false,
                    loaded: false,
                    fieldLabel: scope.etiquetas.txtNivel,
                    tabIndex: 8
                }, {
                    identificador: 'Component',
                    displayText: 'text',
                    url: 'obtenerNivelesCuentas',
                    baseParams: {
                        'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values)
                    },
                    autoLoad: false,
                    singleSelect: true,
                    reader: scope.jrNiveles = new Ext.data.JsonReader({
                        id: 'id'
                    }, [{
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'idparteformato'
                    }, {
                        name: 'codigo'
                    }, {
                        name: 'text'
                    }, {
                        name: 'nombre'
                    }, {
                        name: 'id'
                    }, {
                        name: 'nivel'
                    }, {
                        name: 'abreviatura'
                    }])
                });
        }
        return {
            columnWidth: .15,
            style: 'margin: 0 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: component
        };
    },
    fgetCentroCosto: function (scope) {
        scope.centroCosto = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.txtSeleccione,
            invalidText: "Este campo es obligatorio.",
            allowBlank: true,
            loaded: false,
            fieldLabel: "Centros de costo",
            tabIndex: 8
        }, {
            identificador: 'CentroCosto',
            displayText: 'text',
            url: 'obtenerCentroCosto',
            height: 200,
            autoLoad: false,
            singleSelect: false,
            reader: scope.jrcentrocosto = new Ext.data.JsonReader({
                id: 'idcentrogrupo'
                // root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'idcentrogrupo'

            }, {
                name: 'codigo',
                mapping: 'concat'
            }, {
                name: 'text'
            }])
        });

        return {
            columnWidth: .15,
            style: 'margin: 0 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: scope.centroCosto
        };

    },
    fgetElementoGasto: function (scope) {

        scope.elementoGasto = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.txtSeleccione,
            invalidText: "Este campo es obligatorio.",
            allowBlank: true,
            loaded: false,
            fieldLabel: "Elementos de Gasto",
            tabIndex: 8
        }, {
            identificador: 'Elemento',
            displayText: 'text',
            url: 'obtenerElementosGasto',
            height: 200,
            autoLoad: false,
            singleSelect: false,
            reader: scope.jrelementogasto = new Ext.data.JsonReader({
                id: 'idelementoobjeto'
                //root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'idelementoobjeto'
            }, {
                name: 'codigo',
                mapping: 'concat'
            }, {
                name: 'text'
            }])
        });
        return {
            columnWidth: .15,
            style: 'margin: 0 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: scope.elementoGasto
        };
    },
    fgetNivel: function (idReport, scope) {
        scope.cbxNivel = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.txtSeleccione,
            allowBlank: idReport == 108 ? true : false,
            fieldLabel: idReport != 103 ? scope.etiquetas.txtNivel : scope.etiquetas.txFiltroCuenta,
            loaded: true,
            hiddenTbar: true,
            tabIndex: 8
        }, {
            identificador: 'Nivel',
            displayText: 'text',
            url: 'obtenerNivelesCuentas',
            autoLoad: false,
            singleSelect: true,

            reader: scope.jrNiveles = new Ext.data.JsonReader({
                id: 'id'
                //root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'idparteformato'
            }, {
                name: 'codigo'
            }, {
                name: 'text'
            }, {
                name: 'nombre'
            }, {
                name: 'id'
            }, {
                name: 'nivel'
            }, {
                name: 'abreviatura'
            }])
        });

        scope.cbxNivel.on('expand', function () {
            if (scope.cbxEntidad.isValid()) {
                if (!Ext.getCmp('gpNivel').getStore().getCount())
                    Ext.getCmp('gpNivel').getStore().load({
                        params: {
                            arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values),
                            idReporte: scope.cbxReporte.getValue()
                        }
                    });
            } else
                scope.cbxNivel.collapse();
        });

        Ext.getCmp('gpNivel').getSelectionModel().on('selectionchange', function () {
            if ((Ext.getCmp('gpNivel').getSelectionModel().getSelections().length > 0) && (idReport == '105' || idReport == '107')) {//105-Submayor de Gasto, 107-Analisis de los gastos
                scope.obtenerCtaGastoporNivel(Ext.getCmp('gpNivel').getSelectionModel().getSelections()[0].data.idparteformato, 1);
            } else if ((Ext.getCmp('gpNivel').getSelectionModel().getSelections().length > 0) && (idReport == '103')) {//103-Balance
                scope.obtenerCtaGastoporNivel(Ext.getCmp('gpNivel').getSelectionModel().getSelections()[0].data.idparteformato, 0);
            }
        });

        return {
            columnWidth: .10,
            style: 'margin: 0 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: scope.cbxNivel
        };
    },
    fgetCtaNivel: function (scope) {
        scope.ctaNivel = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.txtSeleccione,
            invalidText: "Este campo es obligatorio.",
            allowBlank: true,
            loaded: false,
            fieldLabel: scope.etiquetas.lbCuenta,
            tabIndex: 8
        }, {
            identificador: 'CtaNivel',
            displayText: 'text',
            // url: 'obtenerCtaGastoporNivel',
            baseParams: {
                'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values)
            },
            height: 200,
            autoLoad: false,
            singleSelect: false,
            reader: scope.jrCuenta = new Ext.data.JsonReader({
                id: 'idcuenta',
                root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'text'
            }, {
                name: 'idcuenta'
            }, {
                name: 'codigo',
                mapping: 'concatcta'
            }, {
                name: 'descripcion'
            }, {
                name: 'clavecuenta'
            }])
        });
        return {
            columnWidth: .25,
            style: 'margin: 0 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: scope.ctaNivel
        };
    },
    fgetCtaArbol: function (scope) {
        scope.stCuenta = new Ext.data.Store({
            url: 'obtenerCtaPorNivel',
            autoLoad: true,
            baseParams: {
                'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values)
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuenta'},
                {name: 'text'},
                {name: 'idmoneda'},
                {name: 'codigo'},
            ])
        });

        scope.cbxCuenta = new Ext.contabilidad.util.linkedCombo({
            disabledClass: 'disabled-component',
            store: scope.stCuenta,
            fieldLabel: scope.etiquetas.lbCuenta,
            loaded: true,
            allowBlank: true,
            singleSelection: false,
            leafSelect: false,
            qtip: 'text',
            displayField: 'text',
            valueField: 'idcuenta',
            selectField: 'codigo',
            listHeight: 300,
            anchor: '98%',
        });

        return {
            columnWidth: .25,
            style: 'margin: 0 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: scope.cbxCuenta
        };
    },
    fgetMoneda: function (scope) {

        scope.newMoneda = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.txtSeleccione,
            invalidText: "Este campo es obligatorio.",
            allowBlank: true,
            loaded: false,
            fieldLabel: "Moneda",
            tabIndex: 8
        }, {
            identificador: 'Moneda',
            displayText: 'codigoiso',
            url: 'obtenerMonedasParaBusqueda',
            height: 200,
            autoLoad: false,
            singleSelect: false,
            reader: scope.jrMoneda = new Ext.data.JsonReader({
                id: 'idmoneda',
                root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'idmoneda'
            }, {
                name: 'codigo',
                mapping: 'codigoiso'
            }, {
                name: 'text',
                mapping: 'codigoiso'
                // mapping: 'nombre'
            }])
        });
        return {
            columnWidth: .07,
            style: 'margin: 0 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: scope.newMoneda
        };
    },
    fgetcheckBMostrarCC: function (scope) {
        scope.ckCentroCost = new Ext.form.Checkbox({
            boxLabel: 'Centro de Costo',
            hideLabel: true,
            inputValue: 1
        });

        return {
            columnWidth: .10,
            style: 'margin: 12 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: scope.ckCentroCost
        };

    },
    fgetcheckBExportarConso: function (scope) {
        scope.ckExportarConso = new Ext.form.Checkbox({
            boxLabel: 'Exportar CONSO',
            hideLabel: true,
            inputValue: 0
        });

        return {
            columnWidth: .10,
            style: 'margin: 12 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: scope.ckExportarConso
        };

    },
    fgetcheckBExportarUNE: function (scope) {
        scope.ckExportarUNE = new Ext.form.Checkbox({
            boxLabel: 'Exportar SISCONT',
            hideLabel: true,
            inputValue: 0
        });

        return {
            columnWidth: .10,
            style: 'margin: 12 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: scope.ckExportarUNE
        };

    },
    fAddCbxComponent: function (numero, scope) {
        switch (numero) {
            case '1' :
                combo = new Ext.CONT.UIXCombo({
                    emptyText: scope.etiquetas.txtSeleccione,
                    allowBlank: false,
                    fieldLabel: scope.etiquetas.txtSubsistema,
                    tabIndex: 8
                }, {
                    identificador: 'Subsistema',
                    displayText: 'text',
                    url: 'obtenerSubsistemas',
                    baseParams: {
                        'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values),
                        'fechaInicio': scope.dfDesde.getRawValue(),
                        'fechaFin': scope.dfHasta.getRawValue()
                    },
                    autoLoad: false,
                    singleSelect: false,
                    reader: scope.jrSubCuenta = new Ext.data.JsonReader({
                        id: 'idSubsistema',
                        root: 'datos'
                    }, [{
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'codigo'
                    }, {
                        name: 'text'
                    }])
                });
                break;
            case '2' :
                combo = new Ext.CONT.UIXCombo({
                    emptyText: scope.etiquetas.txtSeleccione,
                    allowBlank: false,
                    fieldLabel: scope.etiquetas.cbxEstado,
                    tabIndex: 8
                }, {
                    identificador: 'Estado',
                    displayText: 'text',
                    url: 'obtenerEstadosComprobantes',
                    autoLoad: false,
                    singleSelect: false,
                    reader: scope.jrEstado = new Ext.data.JsonReader({
                        id: 'idEstadoComprobante',
                        root: 'datos'
                    }, [{
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'text'
                    }, {
                        name: 'idEstadoComprobante'
                    }, {
                        name: 'codigo'
                    }])
                });
                break;
            case '3' :
                combo = new Ext.CONT.UIXCombo({
                    emptyText: scope.etiquetas.txtSeleccione,
                    allowBlank: false,
                    fieldLabel: scope.etiquetas.cbxNumero,
                    tabIndex: 8
                }, {
                    identificador: 'Numero',
                    displayText: 'text',
                    url: 'obtenerNumerosComprobantes',
                    autoLoad: false,
                    singleSelect: false,
                    reader: scope.jrNumero = new Ext.data.JsonReader({
                        id: 'numerocomprobante',
                        root: 'datos'
                    }, [{
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'text'
                    }, {
                        name: 'codigo'
                    }])
                });
                break;
        }
        return {
            columnWidth: .15,
            style: 'margin: 0 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: combo
        };
    },
    pnlSouth: function (scope) {
        Ext.apply(this, {
            layout: 'fit',
            region: 'center',
            frame: false,
            border: false,
            // items: [scope.gpDatosReporte = new Ext.grid.GridPanel
            items: [scope.gpDatosReporte = new Ext.grid.EditorGridPanel
            ({
                id: 'gpReportes',
                autoScroll: true,
                frame: false,
                layout: 'fit',
                border: false,
                clicksToEdit: 1,
                sm: scope.smDatosReporte = new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }),
                store: new Ext.data.GroupingStore({
                    fields: [],
                    data: [],
                    reader: new Ext.data.ArrayReader({}, [
                        {name: 'Cuenta'},
                        {name: 'fechaemision'},
                        {name: 'comprobante'},
                        {name: 'descripcion'}
                    ])
                }),
                columns: [
                    {
                        header: scope.etiquetas.lbCuenta,
                        tooltip: scope.etiquetas.lbTtCuenta,
                        dataIndex: 'Cuenta',
                        align: 'left',
                        width: 150
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
                        width: 100
                    },
                    {
                        id: 'expandir',
                        header: scope.etiquetas.lbDescripcion,
                        tooltip: scope.etiquetas.lbTtDescripcion,
                        dataIndex: 'descripcion',
                        width: 350
                    }],
                view: new Ext.grid.GroupingView({
                    forceFit: true,
                    ShowGroupName: true,
                    enableNoGroup: false,
                    enableGropingMenu: false,
                    hideGroupedColumn: true,
                    groupTextTpl: '{text}'
                }),
                tbar: [
                    scope.btnAbrirComprobante = new Ext.Button({
                        id: 'btnAbrirComprobante',
                        hidden: true,
                        iconCls: 'comprobante',
                        text: scope.etiquetas.textAbrir,
                        tooltip: scope.etiquetas.txtAbrirOp
                    }),
                    scope.btnVistaPreliminar = new Ext.Button({
                        id: 'btnVistaPreliminar',
                        hidden: true,
                        iconCls: 'vistareporte',
                        text: scope.etiquetas.txtVista,
                        tooltip: scope.etiquetas.tooltipVista
                    }),
                    scope.btnExportar = new Ext.Button({
                        id: 'btnExportar',
                        hidden: true,
                        iconCls: 'exportar',
                        //text: scope.etiquetas.txtExportar,
                        text: 'Exportar CONSO',
                        tooltip: scope.etiquetas.tooltipExportar,
                        abreviatura: 'conso'
                    }),
                    scope.btnExportarBalance = new Ext.Button({
                        id: 'btnExportarBalance',
                        hidden: true,
                        iconCls: 'exportar',
                        //text: scope.etiquetas.txtExportar,
                        text: 'Exportar Comprobante Resumen',
                        tooltip: 'Exportar el Balance como un Comprobante Resumen',
                        abreviatura: 'balance'
                    }),
                    scope.btnExportarUNE = new Ext.Button({
                        id: 'btnExportarUNE',
                        hidden: true,
                        iconCls: 'exportar',
                        //text: scope.etiquetas.txtExportar,
                        text: 'Exportar XML',
                        tooltip: scope.etiquetas.tooltipExportar,
                        abreviatura: 'xmlune'
                    })
                ]
            })]
        });
        validate.addButton(scope.btnExportar);
        validate.addButton(scope.btnExportarBalance);
        validate.addButton(scope.btnExportarUNE);
        validate.checkPermisos(false, false);
        return new Ext.Panel(this);
    }

});