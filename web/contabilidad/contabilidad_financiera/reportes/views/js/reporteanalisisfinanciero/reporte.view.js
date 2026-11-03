Ext.namespace('Ext.CONT.AnalisisFinanciero');
Ext.CONT.AnalisisFinanciero.ReporteAnalisisView = Ext.extend(Ext.util.Observable, {
    constructor: function (scope) {
        Ext.CONT.AnalisisFinanciero.ReporteAnalisisView.superclass.constructor.call(this);
        this.viewPort(scope);
        return this;
    },
    viewPort: function (scope) {
        this.initTemplates();
        return new Ext.Viewport({
            renderTo: document.body,
            layout: 'border',
            id: 'vpGlobal',
            items: [scope.pnlCenter = this.pnlCenter(scope), scope.pnlEast = this.pnlEast(scope)]
        });
    },
    pnlCenter: function (scope) {
        this.gpFiltrosAdicionales(scope);
        scope.tbCuerpoReporte = new Ext.TabPanel({
            id: 'tbCuerpoReporte',
            activeTab: 0,
            border: false,
            items: [
                {
                    layout: 'border',
                    title: scope.etiquetas.lbCuerpoReporte,
                    autoScroll: true,
                    border: false,
                    height: 115,
                    margins: '0 0 0 0',
                    id: 'fpCuerpoReporte',
                    items: [
                        {
                            region: 'center',
                            layout: 'border',
                            border: false,
                            items: [
                                scope.gpAnalisis = this.gpAnalisis(scope)
                            ]
                        }
                    ]
                }
            ]
        });
        return new Ext.Panel({
            layout: 'border',
            region: 'center',
            tbar: ['->',
                scope.btnAyuda = new Ext.Button({
                    id: 'btnHelpEvaluarConceptos',
                    iconCls: 'ayuda',
                    text: scope.etiquetas.lbBtnAyuda,
                    tooltip: scope.etiquetas.lbTtAyuda
                })
            ],
            items: [
                {
                    region: 'center',
                    layout: 'border',
                    border: false,
                    items: [
                        scope.gpAnalisis = this.gpAnalisis(scope)
                    ]
                },
                scope.fpFiltrosBasicosReporte = this.fpFiltrosBasicosReporte(scope)
            ]
        });
    },
    pnlWest: function (scope) {
        this.initTemplates();
        scope.jstTiposAnalisis = new Ext.data.JsonStore({
            url: 'obtenertiposanalisis',
            root: 'images',
            sortInfo: {
                field: "descripcion",
                direction: "ASC"
            },
            fields: [
                'name', 'url',
                {
                    name: 'size',
                    type: 'float'
                },
                {
                    name: 'idconceptocontable'
                },
                {
                    name: 'abreviatura'
                },
                {
                    name: 'codigo'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'text'
                },
                {
                    name: 'name'
                },
                {
                    name: 'lastmod'
                },
                {
                    name: 'idconceptocontableestructurae'
                },
                {
                    name: 'idestructurae'
                },
                {
                    name: 'idformula'
                },
                {
                    name: 'formulaConcat'
                },
                {
                    name: 'formulaDescriptiva'
                },
                {
                    name: 'idformulanodo'
                },
                {
                    name: 'idnodo'
                }
            ]
        });
        scope.lookup = {};
        scope.dvTiposAnalisis = new Ext.DataView({
            id: 'dvTiposAnalisis',
            store: scope.jstTiposAnalisis,
            tpl: scope.thumbTemplate,
            autoWidth: true,
            singleSelect: true,
            overClass: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: scope.etiquetas.lbEmptyTextConceptConf,
            prepareData: function (data) {
                data.shortName = Ext.util.Format.ellipsis(data.name, 15);
                data.sizeString = Ext.util.Format.fileSize(data.size);
                data.dateString = new Date(data.lastmod).format("m/d/Y g:i a");
                data.formula = data.formulaConcat;
                scope.lookup[data.name] = data;
                return data;
            }
        });
        scope.dvMenuContextual = new Ext.menu.Menu({
            id: 'dvMenuContextual',
            items: [
                {
                    iconCls: 'actualizar',
                    text: scope.etiquetas.lbTtActualizar,
                    tooltip: scope.etiquetas.lbActualizar,
                    disabled: true,
                    handler: function () {
                        scope.dvTiposAnalisis.clearSelections();
                        scope.jstTiposAnalisis.reload();
                        scope.fLoadMaskCmp(scope, scope.pnlWest, scope.etiquetas.lbActualizando);
                        scope.dvTiposAnalisis.refresh();
                    }
                },
                {
                    iconCls: 'evaluar',
                    text: scope.etiquetas.lbBtnEvaluar,
                    tooltip: scope.etiquetas.lbTtEvaluar,
                    disabled: true,
                    handler: function () {
                        Ext.getCmp('btnEvaluar').handler.call();
                    }
                },
                {
                    iconCls: 'actualizar',
                    text: scope.etiquetas.lbActualizarConf,
                    handler: function () {
                        scope.trpVersionesReporte.getRootNode().reload();
                        Ext.getCmp('tbpVersiones').enable();
                        Ext.getCmp('tbpVersiones').setVisible(true);
                        Ext.getCmp('tbpVersiones').expand();
                    }
                }
            ]
        });
        return new Ext.Panel({
            title: scope.etiquetas.lbTiposAnalisis,
            id: 'img-chooser-view',
            region: 'west',
            animCollapse: true,
            //collapsible: true,
            autoScroll: true,
            border: false,
            split: true,
            frame: true,
            collapseFirst: true,
            width: 235,
            items: scope.dvTiposAnalisis
        });
    },
    pnlNorth: function (scope) {
        scope.tfTitulo = new Ext.form.TextField({
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
            fieldLabel: scope.etiquetas.lbTitulo,
            emptyText: scope.etiquetas.lbTitulo,
            id: 'tfTitulo',
            anchor: '98%',
            maxLength: 250,
            listeners: {
                'invalid': function (cmp, msg) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                },
                'blur': function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });
        scope.taFormula = new Ext.form.TextArea({
            fieldLabel: scope.etiquetas.lbFormula,
            emptyText: scope.etiquetas.lbFormula,
            id: 'taFormula',
            anchor: '98%',
            height: 60,
            grow: true,
            readOnly: true,
            editable: false,
            growMax: 200
        });
        return new Ext.form.FormPanel({
            title: scope.etiquetas.lbOpcionesFiltrado,
            region: 'north',
            height: 170,
            autoHeight: true,
            border: false,
            frame: true,
            collapsed: true,
            collapsible: true,
            id: 'pDetalles',
            labelAlign: 'top',
            bodyStyle: 'padding-left:5px',
            layout: 'form',
            items: [scope.tfTitulo, scope.taFormula]
        });
    },
    pnlEast: function (scope) {
        scope.trpVersionesReporte = new Ext.tree.TreePanel({
            id: 'trpConfiguraciones',
            title: ' ',
            border: false,
            rootVisible: true,
            lines: true,
            autoShow: true,
            autoScroll: true,
            height: 135,
            width: '100%',
            singleExpand: false,
            selModel: new Ext.tree.DefaultSelectionModel(),
            layoutConfig: {
                animate: true
            },
            trackMouseOver: true,
            shadow: true,
            listeners: {
                click: function (node, e) {
                    if (node.id == 0) {
                        scope.trpMenuContextual.items.items[0].enable();
                        scope.trpMenuContextual.items.items[1].disable();
                    } else {
                        scope.trpMenuContextual.items.items[0].disable();
                        scope.trpMenuContextual.items.items[1].enable();
                    }
                }
            },
            contextMenu: scope.trpMenuContextual = new Ext.menu.Menu({
                id: 'trpContextMenu',
                items: [
                    {
                        iconCls: 'actualizar',
                        text: scope.etiquetas.lbActualizar,
                        handler: function () {
                            scope.trpVersionesReporte.getRootNode().reload();
                        }
                    },
                    {
                        iconCls: 'recuperaciones',
                        text: scope.etiquetas.lbCargarConfReporte,
                        tooltip: scope.etiquetas.lbTtCargarConfReporte,
                        handler: function () {
                            if (scope.trpVersionesReporte.getSelectionModel().getSelectedNode() !== null) {
                                Ext.getCmp('trpConfiguraciones').fireEvent('dblclick', scope.trpVersionesReporte.getSelectionModel().getSelectedNode());
                            } else {
                                mostrarMensaje(1, scope.etiquetas.lbSelConfiguracion, function () {
                                });
                            }
                        }
                    }
                ]
            }),
            tools: [
                {
                    id: 'save',
                    qtip: scope.etiquetas.lbTtGuardarConfReporte,
                    on: {
                        click: function () {
                            Ext.getCmp("btnGuardarConfReporte").handler.call();
                        }
                    }
                },
                {
                    id: 'restore',
                    qtip: scope.etiquetas.lbTtCargarConfReporte,
                    on: {
                        click: function () {
                            if (scope.trpVersionesReporte.getSelectionModel().getSelectedNode() !== null) {
                                Ext.getCmp('trpConfiguraciones').fireEvent('dblclick', scope.trpVersionesReporte.getSelectionModel().getSelectedNode());
                            } else {
                                mostrarMensaje(1, scope.etiquetas.lbSelConfiguracion, function () {
                                });
                            }
                        }
                    }
                },
                {
                    id: 'minus',
                    qtip: scope.etiquetas.lbTtEliminarConfReporte,
                    on: {
                        click: function () {
                            if (scope.trpVersionesReporte.getSelectionModel().getSelectedNode() !== null) {
                                Ext.getCmp('trpConfiguraciones').fireEvent('dblclick', scope.trpVersionesReporte.getSelectionModel().getSelectedNode());
                                mostrarMensaje(2, scope.etiquetas.lbPromptDelConf, function (btn) {
                                    if (btn == "ok") {
                                        scope.EliminarConfiguracionReporte();
                                    }
                                });
                            } else {
                                Ext.Msg.show({
                                    title: 'Informaci&oacute;n',
                                    msg: scope.etiquetas.lbSelDelConfiguracion,
                                    buttons: Ext.Msg.OK,
                                    animEl: 'trpConfiguraciones',
                                    icon: Ext.MessageBox.INFO
                                });
                            }
                        }
                    }
                },
                {
                    id: 'refresh',
                    qtip: scope.etiquetas.lbActualizar,
                    on: {
                        click: function () {
                            var tree = Ext.getCmp('trpConfiguraciones');
                            tree.body.mask(scope.etiquetas.lbCargar, 'x-mask-loading');
                            tree.root.reload();
                            tree.root.collapse(true, false);
                            setTimeout(function () {
                                tree.body.unmask();
                                tree.root.expand(true, true);
                            }, 1000);
                        }
                    }
                }
            ],
            root: new Ext.tree.AsyncTreeNode({
                text: scope.etiquetas.lbTextTree,
                draggable: false,
                expanded: true,
                id: '0'
            }),
            loader: new Ext.tree.TreeLoader({
                id: 'tlConfiguraciones',
                dataUrl: 'obtenerconfiguracionesreporte'
            })
        });
        return new Ext.Panel({
            id: 'tbpVersiones',
            region: 'east',
            autoScroll: true,
            collapsible: true,
            collapsed: true,
            disabled: true,
            hidden: true,
            split: true,
            title: scope.etiquetas.lbVersiones,
            border: false,
            width: 250,
            autoHeigth: true,
            items: scope.trpVersionesReporte

        });
    },
    fpFiltrosBasicosReporte: function () {
        scope.cbxEntidad = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.lbSeleccionar,
            fieldLabel: scope.etiquetas.lbEntidad,
            allowBlank: false,
            tabIndex: 1
        }, {
            identificador: 'Entidad',
            displayText: 'Entidad',
            url: 'obtenerentidades',
            autoLoad: false,
            tbar: [
                new Ext.Button({
                    iconCls: 'deshabilitar',
                    text: scope.etiquetas.lbNoConsolidar,
                    id: 'btnNoConsolidar',
                    hidden: true
                }),
                new Ext.Button({
                    iconCls: 'habilitar',
                    text: scope.etiquetas.lbConsolidar,
                    id: 'btnConsolidar',
                    hidden: true
                })],
            singleSelect: true,
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
		scope.cbxEntidad.btnSeleccion.setVisible(false);
        scope.cbxEjercicio = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.lbSeleccionar,
            fieldLabel: scope.etiquetas.lbEjercicio,
            allowBlank: false,
            tabIndex: 2
        }, {
            identificador: 'Ejercicio',
            displayText: 'Ejercicio',
            url: 'obtenerejercicios',
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
            emptyText: scope.etiquetas.lbSeleccionar,
            fieldLabel: scope.etiquetas.lbPeriodo,
            tabIndex: 3
        }, {
            identificador: 'Periodo',
            displayText: 'Per&iacute;odo',
            url: 'obtenerperiodos',
            autoLoad: false,
            singleSelect: false,
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
        scope.cbxMoneda = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.lbSeleccionar,
            fieldLabel: scope.etiquetas.lbMoneda,
            allowBlank: false,
            tabIndex: 6
        }, {
            identificador: 'Moneda',
            displayText: 'Moneda',
            url: 'obtenermonedas',
            autoLoad: false,
            singleSelect: true,
            reader: scope.jrMoneda = new Ext.data.JsonReader({
                id: 'idmoneda',
                root: 'datos'
            }, [
                {
                    name: 'idmoneda'
                },
                {
                    name: 'idnommonedaentidad'
                },
                {
                    name: 'nombre'
                },
                {
                    name: 'text',
                    mapping: 'codigoiso'
                },
                {
                    name: 'codigo',
                    mapping: 'codigoiso'
                },
                {
                    name: '_parent'
                },
                {
                    name: '_is_leaf'
                }
            ])
        });
        scope.cbxNiveles = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.lbSeleccionar,
            invalidText: scope.etiquetas.lbInvalidText,
            allowBlank: false,
            loaded: false,
            fieldLabel: scope.etiquetas.lbNivel,
            tabIndex: 8
        }, {
            identificador: 'Niveles',
            displayText: 'text',
            url: 'obtenernivelesctas',
            autoLoad: false,
            singleSelect: true,
            reader: scope.jrNiveles = new Ext.data.JsonReader({
                id: 'id',
                root: 'datos'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'idparteformato'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }, {
                    name: 'abreviatura'
                }, {
                    name: 'nombre'
                }, {
                    name: 'id'
                }, {
                    name: 'nivel'
                }, {
                    name: 'text'
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
        scope.dfFechaDesde = new Ext.form.DateField({
            fieldLabel: scope.etiquetas.lbDesde,
            name: 'dfDesde',
            id: 'dfFechaDesde',
            vtype: 'daterange',
            endDateField: 'dfFechaHasta',
            readOnly: true,
            format: 'd/m/Y',
            anchor: '100%'
//              allowBlank: false
        });
        scope.dfFechaHasta = new Ext.form.DateField({
            fieldLabel: scope.etiquetas.lbHasta,
            name: 'dfHasta',
            id: 'dfFechaHasta',
            vtype: 'daterange',
            startDateField: 'dfFechaDesde',
            readOnly: true,
            format: 'd/m/Y',
            anchor: '100%'
        });
        scope.cbxFiltrosAvanzados = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.lbSeleccionar,
            invalidText: scope.etiquetas.lbInvalidText,
            allowBlank: false,
            loaded: false,
            fieldLabel: scope.etiquetas.lbDimensiones,
        }, {
            identificador: 'FiltrosAdicionales',
            displayText: 'filtro',
            url: 'obtenerdimensiones',
            autoLoad: true,
            singleSelect: false,
            reader: new Ext.data.JsonReader({
                root: 'dimensiones',
                id : 'idnomdimensionesanalisis'
            }, [
                {name: 'idnomdimensionesanalisis'},
                {name: 'denominacion'},
                {
                    name: 'text',
                    mapping: 'denominacion'
                },
                {
                    name: 'codigo',
                    mapping: 'denominacion'
                },
                {
                    name: '_parent'
                },
                {
                    name: '_is_leaf',
                    mapping : 'leaf'
                }
            ])
        });
        scope.cbxConceptos = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.lbSeleccionar,
            invalidText: scope.etiquetas.lbInvalidText,
            allowBlank: false,
            loaded: false,
            fieldLabel: scope.etiquetas.lbTiposAnalisis,
        }, {
            identificador: 'Conceptos',
            displayText: 'text',
            url: 'obtenertiposanalisis',
            autoLoad: false,
            singleSelect: true,
            reader: scope.jrNiveles = new Ext.data.JsonReader({
                id: 'idconceptocontable',
                root: 'images',
                listeners: {
                    load: function () {
                        var q = 0;
                    }
                }
            }, [{
                    name: 'idconceptocontable'
                },
                {
                    name: 'nombre'
                },
                {
                    name: 'idformula'
                },
                {
                    name: 'text'
                },
                {
                    name: 'codigo',
                    mapping: 'text'
                },
                {
                    name: '_parent'
                },
                {
                    name: '_is_leaf',
                    mapping: 'leaf'
                }])
        });
		scope.cbxConceptos.btnSeleccion.setVisible(false);
        scope.cbxConceptos.on('expand', function() {
            if(scope.cbxEntidad.isValid()) {
                if(scope.cbxConceptos.fIsDirty(scope.cbxEntidad.fSelect.values)) {
                    scope.cbxConceptos.fSelect.valuesLoaded = scope.cbxEntidad.fSelect.values;
                    Ext.getCmp('gpConceptos').getStore().removeAll();
                    Ext.getCmp('gpConceptos').getStore().load({
                        params: {
                            arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values)
                        }
                    });
                }
            } else
                scope.cbxConceptos.collapse();
        });
        return scope.fpFiltrosBasicos = new Ext.form.FormPanel({
            height: 180,
            split: true,
            frame: true,
            border: false,
            autoScroll: true,
            /*collapsible: true,
            collapsed: false,*/
            layout: 'column',
            region: 'north',
            labelAlign: 'top',
            id: 'fpFiltrosBasicos',
            /*title: scope.etiquetas.lbFiltrosBasicos,*/
            defaults: {
                style: 'margin: 0 0 0 5',
                layout: 'form',
                columnWidth: .14
            },
            items: [
                {
                    layout: 'form',
					columnWidth: .22,
                    items: [scope.cbxEntidad,scope.cbxConceptos]
                },
                {
                    layout: 'form',
                    items: [scope.cbxEjercicio, scope.cbxFiltrosAvanzados]
                },
                {
                    layout: 'form',
                    items: scope.cbxPeriodo
                },
                {
                    layout: 'form',
                    items: scope.dfFechaDesde
                },
                {
                    layout: 'form',
                    items: scope.dfFechaHasta
                },
                {
					columnWidth: .10,
                    layout: 'form',
                    items: scope.cbxMoneda
                },
                {
					columnWidth: .10,
                    layout: 'form',
                    items: scope.cbxNiveles
                }
            ],
            bbar: [scope.btnGraficar, scope.btnVistaPreliminar, "->", scope.btnEvaluar]
        });
    },
    gpAnalisis: function (scope) {
        scope.btnSalvarConfReporte = new Ext.Button({
            id: 'btnGuardarConfReporte',
            iconCls: 'guardar',
            text: scope.etiquetas.lbGuardarConfReporte,
            tooltip: scope.etiquetas.lbTtGuardarConfReporte,
            disabled: true,
            hidden: true,
            handler: function () {
                scope.GuardarConfiguracionReporte();
            }
        });
        scope.btnVistaPreliminar = new Ext.Button({
            id: 'btnVistaPreliminar',
            iconCls: 'vistareporte',
            text: scope.etiquetas.lbVistaReporte,
            tooltip: scope.etiquetas.lbTtVistaReporte,
            disabled: true,
            handler: function () {
                scope.fOpenWindowReport();
            }
        });
        scope.btnGraficar = new Ext.Button({
            id: 'btnGraficar',
            iconCls: 'graficar',
            disabled: true,
            text: scope.etiquetas.lbGraficar,
            tooltip: scope.etiquetas.lbTtGraficar,
            handler: function () {
                scope.fConfGrafica();
            }
        });
        return new Ext.grid.EditorGridPanel({
            title: scope.etiquetas.lbComposicionReporte,
            id: 'gpAnalisisFinaniero',
            layout: 'fit',
            region: 'center',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            loadMask: true,
            frame: false,
            border: false,
            split: true,
            autoScroll: true,
            viewConfig: {
                forceFit: true,
                autoFill: true
            },
            sm: new Ext.grid.RowSelectionModel({singleSelect: false}),
            store: new Ext.data.GroupingStore({
                fields: [],
                data: [[]],
                reader: new Ext.data.ArrayReader({},
                        [
                            {name: 'idconceptocontable'},
                            {name: 'codigo'},
                            {name: 'descripcion'},
                            {name: 'saldo'}
                        ])
            }),
            columns: [{
                    header: 'Id',
                    dataIndex: 'idconceptocontable',
                    hidden: true,
                    width: 100
                },
                {
                    header: scope.etiquetas.lbCodigo,
                    width: 150,
                    dataIndex: 'codigo'
                },
                {
                    id: 'expandir',
                    header: scope.etiquetas.lbConcepto,
                    width: 350,
                    dataIndex: 'descripcion'
                },
                {
                    header: scope.etiquetas.lbSaldo,
                    width: 250,
                    dataIndex: 'saldo'
                }
            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                ShowGroupName: true,
                enableNoGroup: false,
                enableGropingMenu: false,
                hideGroupedColumn: true,
                groupTextTpl: '{text}'
            }),
            bbar: [scope.btnSalvarConfReporte, "->", scope.btnGraficar, scope.btnVistaPreliminar]
        });
    },
    gpFiltrosAdicionales: function (scope) {
        scope.btnEvaluar = new Ext.Button({
            id: 'btnEvaluar',
            iconCls: 'evaluar',
            disabled: true,
            text: scope.etiquetas.lbBtnEvaluar,
            tooltip: scope.etiquetas.lbTtEvaluar,
            handler: function () {
                scope.EvaluarAnalisisEconFinanciero();
            }
        });
        scope.jsDimensiones = new Ext.data.JsonStore({
            url: 'obtenerdimensiones',
            root: 'dimensiones',
            fields: [
                {
                    name: 'idnomdimensionesanalisis'
                },
                {
                    name: 'denominacion'
                }
            ]
        });
        scope.smCheckFiltroAdicional = new Ext.grid.CheckboxSelectionModel();
        return new Ext.grid.GridPanel({
            title: scope.etiquetas.lbFiltrosAdicionalesReporte,
            id: 'gpFiltrosAdicionales',
            autoExpandColumn: 'expandir',
            layout: 'fit',
            stripeRows: true,
            region: 'center',
            loadMask: true,
            frame: false,
            border: true,
            split: true,
            autoScroll: true,
            sm: scope.smCheckFiltroAdicional,
            store: scope.jsDimensiones,
            columns: [
                scope.smCheckFiltroAdicional,
                {
                    header: 'idDimension',
                    dataIndex: 'idnomdimensionesanalisis',
                    hidden: true,
                    hideable: false
                },
                {
                    id: 'expandir',
                    header: scope.etiquetas.lbTiposSaldos,
                    width: 550,
                    fixed: true,
                    dataIndex: 'denominacion'
                }
            ],
            bbar: ['->', scope.btnEvaluar]
        });
    },
    loadMask: function (msg) {
        this.mask = new Ext.LoadMask(this.body, {
            msg: msg
        });
        this.mask.show();
    },
    initTemplates: function () {
        scope.thumbTemplate = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img src="{url}" title="{name}" ext:qtip="<b>Informaci&oacute;n</b> <br> C&oacute;digo: <b>{codigo}</b> <br>Abreviatura: <b>{abreviatura}</b> <br>Descripci&oacute;n: <b>{descripcion}</b> <br>F&oacute;rmula Descriptiva: <b>{formulaDescriptiva}</b> <br>F&oacute;rmula por c&oacute;digo: <b>{formulaConcat}<b>"></div>',
                '<span ext:qtip="C&oacute;digo: <b>{codigo}</b> <br>Abreviatura: <b>{abreviatura}</b> <br>Descripci&oacute;n: <b>{descripcion}</b> <br>F&oacute;rmula Descriptiva: <b>{formulaDescriptiva}</b> <br>F&oacute;rmula por c&oacute;digo: <b>{formulaConcat}<b>">{shortName}</span></div><br>',
                '</tpl>'
                );
        scope.thumbTemplate.compile();
        scope.detailsTemplate = new Ext.XTemplate(
                '<div class="details">',
                '<tpl for=".">',
                '<img src="{url}"><div class="details-info">',
                '<b>Nombre del reporte:</b>',
                '<span>{name}</span>',
                '<b>Formula Descriptiva:</b>',
                '<span>{formulaDescriptiva}</span>',
                '<b>Formula Concat:</b>',
                '<span>{formulaConcat}</span>',
                '<b>Creado:</b>',
                '<span>{dateString}</span></div>',
                '</tpl>',
                '</div>'
                );
        scope.detailsTemplate.compile();
        scope.tplDetailsReport = new Ext.XTemplate(
                '<tpl for=".">',
                '<b>Entidad: </b><span>{Entidad}</span><br>&#160;&#160;&#160;',
                '<b>Ejercicio: </b><span>{ejercicio}</span>&#160;&#160;&#160;',
                '<b>Per&iacute;odo: </b><span>{periodo}</span><br>&#160;&#160;&#160;',
                '<b>Moneda: </b><span>{codigoiso}</span><br>&#160;',
                '</tpl>'
                );
        scope.tplDetailsReport.compile();
    }
});