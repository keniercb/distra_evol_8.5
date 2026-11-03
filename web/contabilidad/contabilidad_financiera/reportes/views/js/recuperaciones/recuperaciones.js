    Ext.QuickTips.init();
    Ext.Ajax.timeout = 9000000;
    Ext.onReady(onloadMessageBox);

    var perfil = window.parent.UCID.portal.perfil;
    var stConceptoNomenclador, wSelectAperturaConcepto = null;
    var listValoresCentros = new Array();
    UCID.portal.cargarEtiquetas('recuperacionesadicionales', function() {
        cargarInterfaz();
    });
    var idejercicioactual;
    var idestructuraeactual;
    var chainSelection = false;
    // VARIABLES PARA LOS REPORTES

    var w_anexo3, nf_pesalario, nf_peog, nf_pecapital, js_anexo3, sm_anexo3, cm_anexo3, egp_anexo3, chb_consolidado; // ventana para el reporte anexo 3...
    var arrayPESalario = new Array(), arrayPEOG = new Array(), arrayPECapital = new Array();

    var tabs_anexo2, nf_importe, js_anexo2, w_anexo2;
    var arrayAnexo2 = new Array();
    var arrayUnidades = new Array;
    var posUnidad = 0;
    var global_printer = null;  // it has to be on the index page or the generator page  always
    var reporte = '';
    var entidad; // entidad en formato: # Denominacion
    var um; // entidad en formato: #
    var umdenominacion; // entidad en formato: Denominacion
    var clasificacionGasto; // clasificacion del gasto [Salario, Otros Gastos, Capital]
    var inicioPeriodo; // valor estatico moemntaneo
    var finPeriodo;
    var finPeriodoAnno;
    var finPeriodoMes;
    var finPeriodoDia;
    var anno;
    var usuario;
    var resumenPartidas;
    var arrayCentroCosto = new Array(); // variables para el reporte submayor de gastos
    var arrayEspecialidad = new Array();
    var arrayBoolPartidas = new Array();
    var arrayEspecCod = new Array(); // variables para el reporte submayor de ingresos
    var arrayEspecDesc = new Array();
    var arrayIngCod = new Array();
    var arrayIngDesc = new Array();
    var arrayEspecPA = new Array();
    var fechaActual = new Date();
    var fechaActualDia = fechaActual.getDate();
    var fechaActualMes = fechaActual.getMonth() + 1;
    var fechaActualAnno = fechaActual.getFullYear();
    var fechaActualCompleta = fechaActualDia + '/' + fechaActualMes + '/' + fechaActualAnno;

    function printmygridGO(obj) {
        global_printer.printGrid(obj);
    }
    function printmygridGOcustom(obj) {
        global_printer.printCustom(obj);
    }

    function onloadMask(message) {
        message ? (lMask = new Ext.LoadMask(Ext.getBody(), {msg: message }), lMask.show()) : lMask.hide();
    }

    function onloadMessageBox() {
        Ext.MessageBox.show({
            title: 'Por favor espere...',
            msg: 'Cargando...',
            //progressText: 'Inicializando...',
            width: 300,
            progress: true,
            closable: false
        });
        var f = function(v) {
            return function() {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i/*, Math.round(100*i)+'% completado'*/);
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);
        }
    }

    function cargarInterfaz()
    {
        keys: new Ext.KeyMap(Ext.getBody(), [{
                // Ayuda
                key: 'h',
                alt: true,
                fn: function() {
                    help.show('Mostrar ayuda de la funcionalidad', 'confin/CG/recuperaciones/adicionales');
                }
            },
            {
                key: 'r',
                alt: true,
                fn: function() {
                    if (!btnVistaPreliminar.hidden)
                        Ext.getCmp('btnVistaPreliminar').handler.call();
                }
            }
        ]), Ext.Ajax.request({
            url: 'obtenerDatosActuales',
            callback: function(options, success, response)
            {
                responseData = Ext.decode(response.responseText);
                idejercicioactual = responseData.ejercicioactual;
                idestructuraeactual = responseData.estructuraeactual;
                new Ext.Viewport({
                    id: 'viewport',
                    layout: 'border',
                    items: [
                        new Ext.Panel({
                            id: 'pCenter',
                            shadow: true,
                            border: false,
                            bodyBorder: false,
                            frame: true,
                            disabledClasstitle: '',
                            collapsible: true,
                            monitorResize: true,
                            region: 'north',
                            layout: 'border',
                            height: 150,
                            items: [fCrearForm(),
                                {
                                    id: 'pDesglose',
                                    autoHeight: true,
                                    frame: false,
                                    region: 'center',
                                    layout: 'form',
                                    items: [{
                                            id: 'pColumn',
                                            labelAlign: 'top',
                                            layout: 'column',
                                            listeners: {
                                                'add': function(tis, component, index) {
                                                    fSetHeight();
                                                },
                                                'remove': function(tis, component) {
                                                    fSetHeight();
                                                }
                                            }
                                        }]
                                }],
                            listeners: {'render': function(t, r, re) {
                                    Ext.getCmp('cbxEstructura').focus();
                                }},
                            bbar: [new Ext.Button({
                                    id: 'btnBuscar',
                                    iconCls: 'recuperaciones',
                                    text: 'Aceptar',
                                    tooltip: 'Aceptar configuraci&oacute;n y mostrar reporte',
                                    disabled: true,
                                    handler: function() {
                                        fAceptoBusqueda(0);
                                    }
                                }), '->', new Ext.Button({
                                    iconCls: 'ayuda',
                                    text: 'Ayuda',
                                    nextTab: 'cbPais',
                                    tooltip: 'Mostrar ayuda de la funcionalidad <b>(Alt+H)</b>',
                                    handler: function() {
                                        help.show('Mostrar ayuda de la funcionalidad', 'confin/CG/recuperaciones/adicionales');
                                    }
                                })],
                            listeners: {
                                'beforecollapse'
                                        : function(p, animate) {
                                            Ext.getCmp('pCenter').disable();
                                        },
                                // 'collapse':function(p, animate){Ext.getCmp('pCenter').enable();},
                                'beforeexpand': function(p, animate) {
                                    Ext.getCmp('pCenter').enable();
                                }
                                //  'expand':function(p, animate){Ext.getCmp('pCenter').enable();}
                            }
                        }),
                        new Ext.Panel({
                            id: 'pSouth',
                            layout: 'fit',
                            frame: false,
                            border: false,
                            region: 'center'
                        })
                    ]
                });
                Ext.MessageBox.hide();
            }
        });
    }

    function fCrearForm()
    {
        //Para validar los rangos de fecha
        Ext.apply(Ext.form.VTypes, {
            daterange: function(val, field) {
                var date = field.parseDate(val);
                var dispUpd = function(picker) {
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

        var stPeriodo = new Ext.data.Store({
            url: 'cargarperiodos',
            id: 'stPeriodo',
            reader: new Ext.data.JsonReader({
                id: 'periodo'
            }, [{
                    name: 'idperiodo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'inicio'
                }, {
                    name: 'fin'
                }]
            )
        });

        var cbxPeriodo = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            id: 'cbxPeriodo',
            forceSelection: true,
            fieldLabel: 'Per&iacute;odo',
            store: stPeriodo,
            valueField: 'idperiodo',
            displayField: 'nombre',
            hiddenName: 'idperiodo',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            shadow: true,
            enableKeyEvents: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            anchor: '100%',
            listeners: {
                select: function(combo, record, index) {
                    fSetearFechas(record.data.inicio, record.data.fin);
                }
            }
        });

        var dfDesde = new Ext.form.DateField({
            fieldLabel: 'Desde',
            enableKeyEvents: true,
            tabIndex: 6,
            vtype: 'daterange',
            name: 'dfDesde',
            id: 'dfDesde',
            endDateField: 'dfHasta',
            anchor: '100%',
            allowBlank: false,
            readOnly: true,
            format: 'd/m/Y'
        });

        var dfHasta = new Ext.form.DateField({
            fieldLabel: 'Hasta',
            enableKeyEvents: true,
            vtype: 'daterange',
            startDateField: 'dfDesde',
            tabIndex: 6,
            name: 'dfHasta',
            id: 'dfHasta',
            anchor: '100%',
            allowBlank: false,
            readOnly: true,
            format: 'd/m/Y'
        });

        var cbxReporte = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            forceSelection: true,
            fieldLabel: 'Reporte',
            store: new Ext.data.Store({
                url: 'cargarreportes',
                id: 'stReporte',
                reader: new Ext.data.JsonReader({
                    id: 'reporte'
                }, [{
                        name: 'idreporte'
                    }, {
                        name: 'descripcion'
                    }])
            }),
            valueField: 'idreporte',
            displayField: 'descripcion',
            hiddenName: 'idreporte',
            typeAhead: true,
            mode: 'remote',
            id: 'cbxReporte',
            allowBlank: false,
            disabled: true,
            triggerAction: 'all',
            //selectOnFocus: true,
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
            anchor: '100%',
            listeners: {
                select: function(combo, record, index)
                {
                    Ext.getCmp('btnBuscar').disable();
                    if (Ext.getCmp('pColumn').getComponent(0))
                        fDeleteCampos(Ext.getCmp('pColumn'), Ext.getCmp('pColumn').getComponent(0));

                    // quitar reporte actual...
                    if (Ext.getCmp('gpReportes'))
                        Ext.getCmp('gpReportes').hide();

                    // el reporte solicitud de financiamiento anexo no.3 no tiene desglose...
                    if (combo.getValue() == 16)
                        fPintarReporteAnexo3();
                    else
                    // el reporte informe de ejecucion de los pagos anexo no.2 no tiene desglose...
                    if (combo.getValue() == 19)
                        fPintarReporteAnexo2();
                    else
                    // el reporte situacion de fondo (HS,OT,C) no tiene desglose...
                    if (combo.getValue() != 11 && combo.getValue() != 12 && combo.getValue() != 13)
                    {
                        onloadMask('Cargando desglose');
                        Ext.Ajax.request({
                            url: 'obtenerconceptoscuentasreporte',
                            params: {
                                idreporte: combo.getValue(),
                                listIdEstructura: Ext.encode(fObtenerListaEstructura())
                            },
                            callback: function(options, success, response) {
                                lMask.hide();
                                fAccionDesgloseConcepto(Ext.decode(response.responseText), false);
                            }
                        });
                    }
                    else
                        Ext.getCmp('btnBuscar').enable();
                },
                expand: function(combo) {
                    if (!Ext.getCmp('cbxEstructura').getValue() && !Ext.get('cbxEstructura').getValue() != 'Seleccione...') {
                        Ext.getCmp('cbxEstructura').markInvalid();
                        Ext.getCmp('cbxReporte').collapse();
                    } else {
                        cbxEstructuraValueChange = Ext.getCmp('cbxEstructura').getRawValue();
                        Ext.getCmp('cbxReporte').store.baseParams = (Ext.getCmp('cbxEstructura').getValue().length > 0) ? {
                            'listIdEstructura': Ext.encode(fObtenerListaEstructura())
                        } : Ext.encode(cbxEstructuraValueChange);
                        onloadMask('Cargando ...');
                        Ext.getCmp('cbxReporte').store.load({
                            callback: function(options, success, response) {
                                if (options.length == 0) {
                                    mostrarMensaje(1, "Los reportes de la estructura seleccionada no han sido configurados.");
                                }
                                Ext.getCmp('cbxReporte').reset();
                                if (Ext.getCmp('pColumn').getComponent(0))
                                    fDeleteCampos(Ext.getCmp('pColumn'), Ext.getCmp('pColumn').getComponent(0));
                                onloadMask();
                            }
                        });
                    }
                }
            }
        });

        var pComboEstructura = new Ext.Panel({
            id: 'pComboEstructura',
            border: false,
            hideBorders: true,
            bodyBorder: false,
            frame: false,
            layout: 'fit',
            height: 250,
            autoWidth: true,
            tbar: [new Ext.Button({
                    id: 'btnSelectEstructura',
                    iconCls: 'seleccion',
                    tooltip: 'Seleccionar todos',
                    text: 'Seleccionar todos',
                    hidden: false,
                    handler: function() {
                        fSelecionarTodo('Estructura');
                    }
                }), '->',
                new Ext.Button({
                    iconCls: 'deshabilitar amarillo',
                    text: '<b>No consolidar</b>',
                    id: 'btnNoConsolidar',
                    hidden: true
                }),
                new Ext.Button({
                    iconCls: 'habilitar amarillo',
                    text: '<b>Consolidar</b>',
                    id: 'btnConsolidar',
                    hidden: true
                })],
            items: [new Ext.ux.maximgb.treegrid.GridPanel({
                    id: 'gpEstructura',
                    master_column_id: 'expandir',
                    autoExpandColumn: 'expandir',
                    stripeRows: false,
                    layout: 'fit',
                    store: new Ext.ux.maximgb.treegrid.AdjacencyListStore({
                        id: 'stEstructura',
                        url: 'cargarestructura',
                        autoLoad: true,
                        reader: new Ext.data.JsonReader({
                            id: 'idestructurae',
                            totalProperty: 'totalProperty',
                            root: 'root'
                        }, [{
                                name: '_parent',
                                mapping: 'idestructuraepadre'
                            }, {
                                name: '_is_leaf',
                                mapping: 'leaf'
                            }, {
                                name: 'text'
                            }, {
                                name: 'idestructurae'
                            }, {
                                name: 'idestructuraepadre'
                            }, {
                                name: 'codigoestructura'
                            }, {
                                name: 'ordenizq'
                            }, {
                                name: 'ordender'
                            }]),
                        listeners: {
                            'load': function(store, records, options) {
                                if (store.getCount() > 0)
                                    Ext.getCmp('btnSelectEstructura').show()
                            }
                        }
                    }),
                    listeners: {
                        'render': function(component)
                        {
                            component.getEl().on('mouseover', function(e, t)
                            {
                                if (component.view.findRowIndex(t) !== false)
                                    fToolTipShow(Ext.getCmp('gpEstructura'), Ext.getCmp('gpEstructura').getStore().getAt(component.view.findRowIndex(t)).data.text);
                            });
                        },
                        'rowdblclick': function(grid, rowIndex, e) {
                            Ext.getCmp('cbxEstructura').collapse();
                        },
                        'rowclick': function(gridPanel, rowIndex, e) {
                            Ext.getCmp('btnConsolidar').setVisible(false);
                            Ext.getCmp('btnNoConsolidar').setVisible(false);
                            if (gridPanel.getSelectionModel().isSelected(rowIndex))
                                menuConsolidar.IsValidShow(gridPanel, rowIndex);
                        },
                        'keypress': function(e)
                        {
                            if (e.getKey() == '13')
                                Ext.getCmp('cbxEstructura').collapse();
                        }
                    },
                    sm: new Ext.grid.RowSelectionModel({
                        id: 'smEstructura',
                        singleSelect: false,
                        listeners: {
                            'beforerowselect': function(selectionModel, rowIndex, keepExisting, record) {
                            },
                            'rowselect': function(selectionModel, rowIndex, record) {
                                Ext.getCmp('btnConsolidar').setVisible(false);
                                Ext.getCmp('btnNoConsolidar').setVisible(false);
                                menuConsolidar.IsValidShow(Ext.getCmp('gpEstructura'), rowIndex);
                                fDisplaySelectComboEstructura('Estructura', selectionModel, record, true);
                            },
                            'rowdeselect': function(selectionModel, rowIndex, record) {
                                Ext.getCmp('btnConsolidar').setVisible(false);
                                Ext.getCmp('btnNoConsolidar').setVisible(false);
                                gridPanel = Ext.getCmp('gpEstructura');
                                if (record.data.consolidar)
                                {
                                    record.data.text = record.data.text.replace(" <b>(CONSOLIDAR)</b>", '');
                                    record.data.consolidar = false;
                                    menuConsolidar.UpdateData(gridPanel);
                                }
                                var nodeAncestors = gridPanel.getStore().getNodeAncestors(record);
                                for (var i = 0; i < nodeAncestors.length; i ++){
                                    if (nodeAncestors[i].data.consolidar)
                                        if (menuConsolidar.GetNodeChildrenSelected(gridPanel, gridPanel.getStore().getNodeChildren(nodeAncestors[i])).length == 0)
                                        {
                                            nodeAncestors[i].data.text = nodeAncestors[i].data.text.replace(" <b>(CONSOLIDAR)</b>", '');
                                            nodeAncestors[i].data.consolidar = false;
                                            menuConsolidar.UpdateData(gridPanel);
                                        }
                                }
                                fDisplaySelectComboEstructura('Estructura', selectionModel, record, false);
                                Ext.getCmp('btnSelectEstructura').setText('Seleccionar todos');
                            }
                        }
                    }),
                    loadMask: {
                        msg: 'Cargando ...'
                    },
                    columns: [{
                            id: 'expandir',
                            header: " ",
                            dataIndex: 'text',
                            width: 170,
                            sortable: true
                        }]
                })]
        });

        var menuConsolidar = {
            IsValidShow: function(gridPanel, rowIndex)
            {
                store = gridPanel.getStore();
                node = gridPanel.getStore().getAt(rowIndex);
                if (node.data.consolidar == true)
                    this.ShowContext(gridPanel, false, node.data);
                else
                if (!node.data._is_leaf && store.isExpandedNode(node))
                {
                    nodeChildren = store.getNodeChildren(node);
                    if (this.GetNodeChildrenSelected(gridPanel, nodeChildren).length > 0)
                        this.ShowContext(gridPanel, true, node.data);
                }
            },
            GetNodeChildrenSelected: function(gridPanel, nodeChildren)
            {
                result = new Array();
                for (i = 0; i < nodeChildren.length; i++)
                    if (gridPanel.getSelectionModel().isSelected(nodeChildren[i]))
                        result.push(nodeChildren[i]);
                return result;
            },
            ShowContext: function(gridPanel, flag, node)
            {
                Ext.getCmp('btnConsolidar').setVisible(flag);
                Ext.getCmp('btnNoConsolidar').setVisible(!flag);
                this.HandleFunction(this, flag, node, gridPanel);
            },
            UpdateData: function(gridPanel)
            {
                store = gridPanel.getStore();
                Ext.getCmp('cbxEstructura').clearValue();
                gridPanel.getSelectionModel().displaySelect = new Array();
                recordsSelections = gridPanel.getSelectionModel().getSelections();
                records = store.getRange(0, store.getCount());
                store.removeAll();
                store.add(records);
                gridPanel.getSelectionModel().selectRecords(recordsSelections);
            },
            HandleFunction: function(scope, flag, node, gridPanel)
            {
                if (!flag)
                {
                    Ext.getCmp('btnNoConsolidar').purgeListeners();
                    Ext.getCmp('btnNoConsolidar').on('click', function() {
                        this.hide();
                        node.text = node.text.replace(" <b>(CONSOLIDAR)</b>", '');
                        node.consolidar = false;
                        scope.UpdateData(gridPanel);
                    });
                } else
                {
                    Ext.getCmp('btnConsolidar').purgeListeners();
                    Ext.getCmp('btnConsolidar').on('click', function() {
                        this.hide();
                        node.text = node.text + " <b>(CONSOLIDAR)</b>";
                        node.consolidar = true;
                        scope.UpdateData(gridPanel);
                    });
                }
            }
        };

        function fResetComboReporte()
        {
            cbxReporte.reset();
            if (Ext.getCmp('pColumn').getComponent(0))
                fDeleteCampos(Ext.getCmp('pColumn'), Ext.getCmp('pColumn').getComponent(0));
        }
        var cbxEstructuraValueChange;
        return new Ext.form.FormPanel({
            id: 'fpCenter',
            region: 'north',
            height: 105,
            layout: 'fit',
            frame: false,
            border: false,
            hideBorders: true,
            bodyBorder: false,
            items: [{
                    layout: 'column',
                    labelAlign: 'top',
                    items: [{
                            columnWidth: .30,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: [new Ext.form.ComboBox({
                                    emptyText: 'Seleccione...',
                                    id: 'cbxEstructura',
                                    store: new Ext.data.SimpleStore({
                                        fields: [],
                                        data: [[]]
                                    }),
                                    editable: false,
                                    forceSelection: true,
                                    fieldLabel: 'Estructura',
                                    typeAhead: true,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    allowBlank: false,
                                    enableKeyEvents: true,
                                    anchor: '100%',
                                    selectedClass: '',
                                    invalidText: 'Este campo es obligatorio.',
                                    onSelect: Ext.emptyFn,
                                    listeners: {
                                        'expand': function(combo)
                                        {
                                            cbxEstructuraValueChange = Ext.getCmp('cbxEstructura').getRawValue();
                                            if (!this.component)
                                                this.component = pComboEstructura;
                                            this.component.render('cbx');
                                        },
                                        'render': function(component)
                                        {
                                            component.getEl().on('mouseover', function()
                                            {
                                                if (Ext.getCmp('cbxEstructura').getRawValue().length > 0 && !Ext.getCmp('cbxEstructura').isExpanded())
                                                    fToolTipShow(Ext.getCmp('cbxEstructura'), Ext.getCmp('cbxEstructura').getRawValue());
                                            });
                                        }
                                    },
                                    tpl: '<div style="height:277px"><div id="cbx"></div></div>'
                                })]
                        },
                        {
                            columnWidth: .2,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: new Ext.form.ComboBox({
                                emptyText: 'Seleccione...',
                                forceSelection: true,
                                id: 'cbxEjercicio',
                                fieldLabel: 'Ejercicio',
                                allowBlank: false,
                                store: new Ext.data.Store({
                                    url: 'cargarejercicios',
                                    id: 'stEjercicios',
                                    autoLoad: true,
                                    reader: new Ext.data.JsonReader({
                                        id: 'ejercicio'
                                    }, [{
                                            name: 'idejercicio'
                                        }, {
                                            name: 'nombre'
                                        }, {
                                            name: 'inicio'
                                        }, {
                                            name: 'fin'
                                        }]),
                                    listeners: {
                                        load: function(t, records, options) {
                                            Ext.getCmp('cbxEjercicio').setValue(idejercicioactual);
                                            Ext.getCmp('cbxReporte').enable();
                                            var record = t.getAt(t.find('idejercicio', idejercicioactual));
                                            fSetearFechas(fConvertirFormatoFecha(record.data.inicio), fConvertirFormatoFecha(record.data.fin));
                                            stPeriodo.load({
                                                params: {
                                                    idejercicio: idejercicioactual
                                                }
                                            });
                                        }
                                    }
                                }),
                                valueField: 'idejercicio',
                                displayField: 'nombre',
                                hiddenName: 'idejercicio',
                                typeAhead: true,
                                mode: 'local',
                                triggerAction: 'all',
                                selectOnFocus: true,
                                tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
                                enableKeyEvents: true,
                                anchor: '100%',
                                listeners: {
                                    select: function(combo, record, index)
                                    {
                                        onloadMask('Cargando los per&iacute;odos del ejercicio ' + record.data.nombre + '...');
                                        fSetearFechas(fConvertirFormatoFecha(record.data.inicio), fConvertirFormatoFecha(record.data.fin));
                                        stPeriodo.load({
                                            params: {
                                                idejercicio: record.data.idejercicio
                                            },
                                            callback: function() {
                                                lMask.hide();
                                            }
                                        });
                                    }
                                }
                            })
                        }, {
                            columnWidth: .2,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: cbxPeriodo
                        }, {
                            columnWidth: .15,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: dfDesde
                        }, {
                            columnWidth: .15,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: dfHasta
                        }, {
                            columnWidth: .5,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: cbxReporte
                        }]
                }
            ],
            listeners: {'render': function(t, r, re) {
                    Ext.getCmp('cbxEstructura').focus();
                }
            }
        });
    }

    function fSetHeight()
    {
        Ext.getCmp('pDesglose').doLayout(true);
        Ext.getCmp('pCenter').setHeight(185 + Ext.getCmp('pColumn').getInnerHeight());
        Ext.getCmp('viewport').doLayout();
    }

    function fConvertirFormatoFecha(fecha)
    {
        return fecha;
    }

    function fSetearFechas(fechaInicio, fechaFin)
    {
        Ext.getCmp('dfDesde').setMinValue(fechaInicio);
        Ext.getCmp('dfDesde').setMaxValue(fechaFin);
        Ext.getCmp('dfHasta').setMinValue(fechaInicio);
        Ext.getCmp('dfHasta').setMaxValue(fechaFin);
        Ext.getCmp('dfDesde').setValue(fechaInicio);
        Ext.getCmp('dfHasta').setValue(fechaFin);
    }
    function fAccionDesgloseConcepto(responseData, flagHideCancelar)
    {
        Ext.getCmp('btnBuscar').disable();

        if (responseData.info == 3)
            mostrarMensaje(1, "Configure correctamente el reporte.");
        else if (responseData.info == 2)
            mostrarMensaje(1, "El reporte tiene diferentes configuraciones para las entidades seleccionadas.");
        else
        {
            Ext.getCmp('btnBuscar').enable();

            if (responseData.length == 1)
                fCrearComponente(responseData[0].identificador, responseData[0].denominacion, responseData[0].concepto, responseData[0].tree, responseData[0].CUENTAS);
            else if (responseData.length > 1)
            {
                var record = Ext.data.Record.create([{
                        name: 'displayfield'
                    }, {
                        name: 'valuefield'
                    }, {
                        name: 'concepto'
                    }, {
                        name: 'tree'
                    }, {
                        name: 'CUENTAS'
                    }]);
                if (!stConceptoNomenclador)
                    stConceptoNomenclador = new Ext.data.JsonStore({
                        fields: [{
                                name: 'displayfield'
                            }, {
                                name: 'concepto'
                            }, {
                                name: 'valuefield'
                            }, {
                                name: 'tree'
                            }, {
                                name: 'CUENTAS'
                            }]
                    });
                stConceptoNomenclador.removeAll();
                for (var i = 0; i < responseData.length; i++)
                    stConceptoNomenclador.add(new record({
                        displayfield: responseData[i]['denominacion'],
                        valuefield: responseData[i]['identificador'],
                        concepto: responseData[i]['concepto'],
                        tree: responseData[i]['tree'],
                        CUENTAS: responseData[i]['CUENTAS']
                    }));

                wSelectAperturaConcepto = new Ext.Window({
                    title: 'Filtrar por',
                    autoWidth: true,
                    autoHeight: true,
                    id: 'wSelectAperturaConcepto',
                    modal: true,
                    closable: false,
                    resizable: false,
                    plain: true,
                    constrain: true,
                    defaultButton: 0,
                    items: new Ext.form.ComboBox({
                        emptyText: 'Seleccione...',
                        enableKeyEvents: true,
                        id: 'cbxConceptoNomenclador',
                        forceSelection: true,
                        editable: true,
                        store: stConceptoNomenclador,
                        valueField: 'valuefield',
                        displayField: 'displayfield',
                        hiddenName: 'valuefield',
                        typeAhead: true,
                        mode: 'local',
                        tpl: '<tpl for="."><div ext:qtip="{displayfield}" class="x-combo-list-item">{displayfield}</div></tpl>',
                        allowBlank: false,
                        triggerAction: 'all',
                        selectOnFocus: true,
                        shadow: true,
                        width: 200
                        ,
                        listeners: {
                            'keypress': function(component, e) {
                                if (e.getKey() == '13')
                                    fAceptoConcepto();
                            }
                        }
                    }),
                    buttons: [new Ext.Button({
                            disabled: false,
                            id: 'btncancelarselectivo',
                            iconCls: 'cancelar',
                            hidden: flagHideCancelar,
                            tooltip: 'Cerrar ventana sin filtrar',
                            text: 'Cancelar',
                            handler: function() {
                                function cancelo(btn) {
                                    if (btn == 'ok')
                                        wSelectAperturaConcepto.close();
                                }
                                mostrarMensaje(2, "&iquest;Est&aacute; seguro que quiere cancelar?", cancelo);
                            }
                        }), new Ext.Button({
                            disabled: false,
                            id: 'btnaddselectivo',
                            iconCls: 'aceptar',
                            tooltip: 'Aceptar filtro y cerrar ventana',
                            text: 'Aceptar',
                            handler: function() {
                                fAceptoConcepto();
                            }
                        })]
                });
                Ext.getCmp('cbxConceptoNomenclador').reset();
                wSelectAperturaConcepto.show();
            }
        }
    }
    function fAceptoConcepto()
    {
        if (Ext.get('cbxConceptoNomenclador').getValue() && Ext.get('cbxConceptoNomenclador').getValue() != 'Seleccione...')
        {
            wSelectAperturaConcepto.hide();
            var index = stConceptoNomenclador.find('valuefield', Ext.getCmp('cbxConceptoNomenclador').getValue());
            var data = stConceptoNomenclador.getAt(index).data;
            fCrearComponente(data.valuefield, data.displayfield, data.concepto, data.tree, data.CUENTAS);
        }
    }
    function fCrearComponente(identificador, name, concepto, tree, CUENTAS)
    {
        if (Ext.getCmp('wSelectAperturaConcepto'))
            Ext.getCmp('wSelectAperturaConcepto').destroy();

        Ext.getCmp('pColumn').add({
            columnWidth: .25,
            style: 'margin: 0 0 0 5',
            layout: 'form',
            labelAlign: 'top',
            items: [new Ext.form.ComboBox({
                    emptyText: 'Seleccione...',
                    id: 'cbx' + identificador,
                    nomenclador: concepto,
                    store: new Ext.data.SimpleStore({
                        fields: [],
                        data: [[]]
                    }),
                    editable: false,
                    forceSelection: true,
                    fieldLabel: name,
                    // fieldLabel: name.toUpperCase(),
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    enableKeyEvents: true,
                    anchor: '100%',
                    selectedClass: '',
                    onSelect: Ext.emptyFn,
                    listeners: {
                        'expand': function(combo)
                        {
                            if (!this.component)
                                this.component = fCrearComponenteInCombo(identificador, name, concepto, tree, CUENTAS);
                            this.component.render('combogrid' + identificador);
                        },
                        'render': function(component)
                        {
                            component.getEl().on('mouseover', function()
                            {
                                if (Ext.getCmp('cbx' + identificador).getRawValue().length > 0 && !Ext.getCmp('cbx' + identificador).isExpanded())
                                    fToolTipShow(Ext.getCmp('cbx' + identificador), Ext.getCmp('cbx' + identificador).getRawValue());
                            });
                        },
                        'keypress': function(c, e)
                        {
                            if (e.getKey() == '13' && c.getValue().length > 0)
                                fObtenerConceptoCuenta(identificador, name);
                        }
                    },
                    tpl: '<div style="height:277px"><div id="combogrid' + identificador + '"></div></div>'
                })]
        });
    }

    function fCrearComponenteInCombo(identificador, name, concepto, tree, CUENTAS)
    {
        return new Ext.Panel({
            id: 'pCombo' + identificador,
            border: false,
            hideBorders: true,
            bodyBorder: false,
            frame: false,
            layout: 'fit',
            forceSelection: true,
            height: 250,
            autoWidth: true,
            tbar: [new Ext.Button({
                    id: 'btnSelect' + identificador,
                    hidden: true,
                    iconCls: 'seleccion',
                    tooltip: 'Seleccionar todos',
                    text: 'Seleccionar todos',
                    handler: function() {
                        fSelecionarTodo(identificador);
                    }
                })
            ],
            items: [new Ext.ux.maximgb.treegrid.GridPanel({
                    id: 'gp' + identificador,
                    store: new Ext.ux.maximgb.treegrid.AdjacencyListStore({
                        id: 'st' + identificador,
                        url: 'obteneraperturaporconcepto',
                        baseParams: {
                            concepto: concepto,
                            tree: tree,
                            CUENTAS: Ext.encode(CUENTAS),
                            listIdEstructura: Ext.encode(fObtenerListaEstructura())
                        },
                        autoLoad: true,
                        reader: new Ext.data.JsonReader({
                            id: 'idcuenta',
                            totalProperty: 'totalProperty',
                            root: 'root'
                        }, [{
                                name: 'id'
                            }, {
                                name: '_parent',
                                mapping: 'parent'
                            }, {
                                name: '_is_leaf',
                                mapping: 'leaf'
                            }, {
                                name: 'text'
                            }, {
                                name: '_level',
                                mapping: 'nivel'
                            }, {
                                name: 'idreferenciaPadre'
                            }, {
                                name: 'idreferencia'
                            }, {
                                name: 'codigo'
                            }, {
                                name: 'descripcion'
                            }, {
                                name: 'CUENTAS'
                            }, {
                                name: 'CENTROS'
                            }, {
                                name: 'directivo'
                            }]
                        ),
                        listeners: {
                            'beforeexpandnode': function(st, rec)
                            {
                                listIdcuentas = new Array();
                                data = rec.data.CUENTAS;
                                for (var i = 0; i < data.length; i++)
                                    listIdcuentas.push(data[i].idcuenta);
                                st.baseParams.CUENTAS = Ext.encode(listIdcuentas);
                                st.baseParams.idreferencia = rec.data.idreferencia;
                            },
                            'beforeload': function(store, options)
                            {
                                if (name == 'Objeto de gasto' || name == 'Elemento de gasto')
                                    store.baseParams.CUENTAS = Ext.encode(listValoresCentros);
                            },
                            'load': function(store, records, options) {
                                if (store.getCount() > 0)
                                    Ext.getCmp('btnSelect' + identificador).show();
                                else {
                                    Ext.getCmp('cbx' + identificador).collapse();
                                    if (name.toUpperCase() == 'ESPECIALIDAD') {
                                        mostrarMensaje(1, 'No existen especialidades que mostrar.');
                                    }
                                    if (name.toUpperCase() == 'CUENTA') {
                                        mostrarMensaje(1, 'No existen cuentas que mostrar.');
                                    }
                                    if (name.toUpperCase() == 'GRUPO PRESUPUESTARIO') {
                                        mostrarMensaje(1, 'No existen grupos presupuestarios que mostrar.');
                                    }
                                    if (name.toUpperCase() == 'INGRESOS') {
                                        mostrarMensaje(1, 'No existen ingresos que mostrar.');
                                    }
                                }
                            }
                        }
                    }),
                    master_column_id: 'expandir',
                    autoExpandColumn: 'expandir',
                    stripeRows: true,
                    layout: 'fit',
                    listeners: {
                        'render': function(component)
                        {
                            component.getEl().on('mouseover', function(e, t)
                            {
                                if (component.view.findRowIndex(t) !== false)
                                    fToolTipShow(Ext.getCmp('gp' + identificador), Ext.getCmp('gp' + identificador).getStore().getAt(component.view.findRowIndex(t)).data.text);
                            });
                        },
                        'rowdblclick': function(grid, rowIndex, e) {
                            fObtenerConceptoCuenta(identificador, name);
                        },
                        'keypress': function(e)
                        {
                            if (e.getKey() == '13')
                                fObtenerConceptoCuenta(identificador, name);
                        }
                    },
                    sm: new Ext.grid.RowSelectionModel({
                        id: 'sm' + identificador,
                        singleSelect: false,
                        listeners: {
                            'beforerowselect': function(selectionModel, rowIndex, keepExisting, record) {
                                if (tree && !chainSelection)
                                    fDeselectInBranch(identificador, selectionModel, record)
                            },
                            'rowselect': function(selectionModel, rowIndex, record) {
                                fDisplaySelect(identificador, name, selectionModel, record, true)
                            },
                            'rowdeselect': function(selectionModel, rowIndex, record) {
                                fDisplaySelect(identificador, name, selectionModel, record, false);
                                Ext.getCmp('btnSelect' + identificador).setText('Seleccionar todos')
                            }
                        }
                    }),
                    loadMask: {
                        msg: 'Cargando ...'
                    },
                    columns: [{
                        id: 'expandir',
                        header: " ",
                        dataIndex: 'text',
                        width: 170,
                        sortable: true

                    }]
                })
            ]
        });
    }

    function fDisplaySelect(identificador, name, selectionModel, record, opcion)
    {
        fDeleteCampos(Ext.getCmp('pColumn'), Ext.getCmp('cbx' + identificador));

        if (!selectionModel.displaySelect || !opcion)
            selectionModel.displaySelect = new Array();

        if (opcion)
            selectionModel.displaySelect.push(record.data.codigo);
        else
        {
            select = selectionModel.getSelections();
            for (i = 0; i < select.length; i++)
                selectionModel.displaySelect.push(select[i].data.codigo);
        }
        Ext.getCmp('cbx' + identificador).setValue(selectionModel.displaySelect.join(", "));
    }
    function fDisplaySelectComboEstructura(name, selectionModel, record, opcion)
    {
        if (!selectionModel.displaySelect || !opcion)
            selectionModel.displaySelect = new Array();

        if (opcion)
            selectionModel.displaySelect.push(record.data.text);
        else
        {
            select = selectionModel.getSelections();
            for (i = 0; i < select.length; i++)
                selectionModel.displaySelect.push(select[i].data.text);
        }
        Ext.getCmp('cbx' + name).setValue(selectionModel.displaySelect.join(", "));
    }

    function fDeselectInBranch(identificador, selectionModel, record)
    {
        select = selectionModel.getSelections();
        deselectList = new Array();
        for (var i = 0; i < select.length; i++)
            if (select[i].data.idreferencia == record.data.idreferenciaPadre || select[i].data.idreferenciaPadre == record.data.idreferencia)
                deselectList.push(Ext.getCmp('gp' + identificador).getStore().find('idreferencia', select[i].data.idreferencia));

        for (i = 0; i < deselectList.length; i++)
            selectionModel.deselectRow(deselectList[i]);
    }

    function fToolTipShow(component, text)
    {
        if (!component.ttp)
            component.ttp = new Ext.ToolTip({
                target: component.getEl(),
                autoHeight: true,
                autoWidth: true,
                autoHide: true,
                maxWidth: 200,
                anchor: 'left',
                title: text,
                trackMouse: true
            });
        else
            component.ttp.setTitle(text);
    }
    function fEnvioListCuenta(identificador, CUENTAS, listIdEstructura, name, concepto)
    {
        if (CUENTAS.length > 0)
        {
            onloadMask('Cargando desglose');
            if (name != 'Objeto de gasto' && name != 'Elemento de gasto')
            {
                Ext.Ajax.request({
                    url: 'obtenerconceptocuenta',
                    params: {
                        CUENTAS: Ext.encode(CUENTAS),
                        listIdEstructura: listIdEstructura,
                        concepto: concepto
                    },
                    callback: function(options, success, response) {
                        lMask.hide();
                        fAccionDesgloseConcepto(Ext.decode(response.responseText), false);
                    }
                });
            } else
                lMask.hide();
        }
    }
    function fObtenerCuentasAsociadasCentros(identificador, listIdCentro, name)
    {
        result = new Array();
        for (var i = 0; i < listIdCentro.length; i++)
            result.push({
                "idcentro": listIdCentro[i].data.idreferencia,
                "CUENTAS": Ext.getCmp("gp" + identificador).getStore().getAt(Ext.getCmp("gp" + identificador).getStore().find('idreferencia', listIdCentro[i].data.idreferencia)).data.CUENTAS
            });
        return result;
    }

    function fObtenerListaEstructura()
    {
        select = Ext.getCmp('gpEstructura').getSelectionModel().getSelections();
        list = new Array();
        for (var i = 0; i < select.length; i++)
            list.push(select[i].data.idestructurae);
        return list;
    }

    function fObtenerListaEstructuraConsolidan()
    {
        var select = Ext.getCmp('gpEstructura').getSelectionModel().getSelections();
        var list = new Array();
        for (var i = 0; i < select.length; i++)
            if (select[i].data.consolidar)
                list.push({
                    id: select[i].data.idestructurae,
                    consolida: fGetChildrenNodes(select[i], select)
                });
        return list;
    }

    function fGetChildrenNodes(node, selection)
    {
        var arrayConsolidar = new Array();
        for (k = 0; k < selection.length; k++)
            if (node.data.ordenizq * 1 < selection[k].data.ordenizq * 1 && node.data.ordender * 1 > selection[k].data.ordender * 1)
                arrayConsolidar.push(selection[k].data.idestructurae);
        return arrayConsolidar;
    }

    function fObtenerConceptoCuenta(identificador, name)
    {
        Ext.getCmp('cbx' + identificador).collapse();
        fDeleteCampos(Ext.getCmp('pColumn'), Ext.getCmp('cbx' + identificador));
        var select = Ext.getCmp('gp' + identificador).getSelectionModel().getSelections();
        var listIdEstructura = Ext.encode(fObtenerListaEstructura());

        if (name == 'Grupo Presupuestario' || name == 'Centro Costo Patrimonial')
        {
            listValoresCentros = fObtenerCuentasAsociadasCentros(identificador, select, name);
            fEnvioListCuenta(identificador, listValoresCentros, listIdEstructura, name, name);
        } else
        {
            var CUENTAS = new Array();
            var listIdCuentaNoLeaf = new Array();
            for (var i = 0; i < select.length; i++)
            {
                var selectCuentas = select[i].data.CUENTAS;
                if (select[i].data._is_leaf == 1)
                {
                    for (var j = 0; j < selectCuentas.length; j++)
                        CUENTAS.push(selectCuentas[j].idcuenta)
                } else
                    for (var k = 0; k < selectCuentas.length; k++)
                        listIdCuentaNoLeaf.push({
                            ordenizq: selectCuentas[k].ordenizq,
                            ordender: selectCuentas[k].ordender,
                            idconfapertura: selectCuentas[k].idconfapertura
                        });
            }
            if (listIdCuentaNoLeaf.length > 0)
            {
                onloadMask('Cargando desglose');
                Ext.Ajax.request({
                    url: 'obtenercuentaultimonivelref',
                    params: {
                        list: Ext.encode(listIdCuentaNoLeaf),
                        listIdEstructura: listIdEstructura
                    },
                    callback: function(options, success, response) {
                        lMask.hide();
                        responseData = Ext.decode(response.responseText);
                        for (i = 0; i < responseData.length; i++)
                            CUENTAS.push(responseData[i].idcuenta);
                        fEnvioListCuenta(identificador, CUENTAS, listIdEstructura, name, '');
                    }
                });
            } else
                fEnvioListCuenta(identificador, CUENTAS, listIdEstructura, name, '');
        }
    }

    function fDeleteCampos(fp, el)
    {
        var ac, acol, del = false, arrdel = [];
        el.findParentBy(function(ac1) {
            ac = ac1;
            return ac;
        });
        ac.findParentBy(function(ac1) {
            acol = ac1;
            return acol;
        });
        acol.cascade(function(ael) {
            if (del && ael.getXType() != 'combo')
                arrdel.push(ael);
            if (ael.getId() == ac.getId())
                del = true;
            return true;
        });
        for (var i = 0; i < arrdel.length; i++)
            fp.remove(arrdel[i]);
        fp.doLayout();
    }

    function fObtenerValoresComponentes(fp, opcion)
    {
        if (fVerificarDesglose(fp) && Ext.getCmp('dfDesde').getRawValue().length > 0)
        {
            // Ext.getCmp('pCenter').collapse();
            var listDesglose = new Array();
            onloadMask('Cargando...');

            fp.cascade(function(component) {
                if (component.getXType() == 'combo')
                {
                    var list = fObtenerListEnComponent(component);
                    var selectedList = new Array();
                    for (j = 0; j < list.length; j++)
                    {
                        var listAsociado = new Array();
                        if (component.fieldLabel == 'ELEMENTO DE GASTO' || component.fieldLabel == 'OBJETO DE GASTO')
                            listAsociado = list[j].data.CENTROS;
                        else if (component.fieldLabel == 'CENTRO COSTO PATRIMONIAL' || component.fieldLabel == 'GRUPO PRESUPUESTARIO')
                            listAsociado = list[j].data.CUENTAS;
                        else
                        {
                            listCuentas = list[j].data.CUENTAS;
                            for (k = 0; k < listCuentas.length; k++)
                                listAsociado.push(listCuentas[k].idcuenta);
                        }

                        selectedList.push({
                            leaf: list[j].data._is_leaf,
                            directivo: list[j].data.directivo,
                            codigo: list[j].data.codigo,
                            id: list[j].data.idreferencia,
                            idparent: list[j].data.idreferenciapadre,
                            nivel: list[j].data._level,
                            'listAsociado': listAsociado
                        });
                    }

                    listDesglose.push({
                        nomenclador: component.nomenclador,
                        confapertura: component.fieldLabel,
                        'selectedList': selectedList
                    });
                }
            });
            // los parametros son diferentes en caso de los reportes anexo2 y anexo3, necesitan otros parametros ademas...

            listIdEstructurae = Ext.encode(fObtenerListaEstructura());

            switch (opcion)
            {
                // anexo3
                case 1:
                    {
                        parametros = {
                            listIdEstructura: listIdEstructurae,
                            idejercicio: Ext.getCmp('cbxEjercicio').getValue(),
                            idperiodo: Ext.getCmp('cbxPeriodo').getValue(),
                            desde: Ext.getCmp('dfDesde').getRawValue(),
                            hasta: Ext.getCmp('dfHasta').getRawValue(),
                            idreporte: Ext.getCmp('cbxReporte').getValue(),
                            reporte: Ext.getCmp('cbxReporte').getRawValue(),
                            listDesglose: Ext.encode(listDesglose),
                            pesalario: Ext.encode(arrayPESalario),
                            peog: Ext.encode(arrayPEOG),
                            pecapital: Ext.encode(arrayPECapital),
                            consolidado: consolidado
                        };
                    }
                    break;
                    // anexo2
                case 2:
                    {
                        parametros = {
                            listIdEstructura: listIdEstructurae,
                            idejercicio: Ext.getCmp('cbxEjercicio').getValue(),
                            idperiodo: Ext.getCmp('cbxPeriodo').getValue(),
                            desde: Ext.getCmp('dfDesde').getRawValue(),
                            hasta: Ext.getCmp('dfHasta').getRawValue(),
                            idreporte: Ext.getCmp('cbxReporte').getValue(),
                            reporte: Ext.getCmp('cbxReporte').getRawValue(),
                            listDesglose: Ext.encode(listDesglose),
                            arrayAnexo2: Ext.encode(arrayAnexo2),
                            consolidado: consolidado
                        };
                    }
                    break;
                default:
                    {
                        parametros = {
                            listIdEstructura: listIdEstructurae,
                            listIdEstructuraConsolidar: Ext.encode(fObtenerListaEstructuraConsolidan()),
                            idejercicio: Ext.getCmp('cbxEjercicio').getValue(),
                            idperiodo: Ext.getCmp('cbxPeriodo').getValue(),
                            desde: Ext.getCmp('dfDesde').getRawValue(),
                            hasta: Ext.getCmp('dfHasta').getRawValue(),
                            idreporte: Ext.getCmp('cbxReporte').getValue(),
                            reporte: Ext.getCmp('cbxReporte').getRawValue(),
                            listDesglose: Ext.encode(listDesglose)
                        };
                    }
                    break;
            }

            Ext.Ajax.request({
                url: 'desgloserealizado',
                method: 'POST',
                params: parametros,
                callback: function(options, success, response) {
                    lMask.hide();
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.datos == '-1') {
                        // var defaultComponents = {};
                        // Ext.getCmp('pCenter').expand();
                        // store = new Ext.data.JsonStore({
                        //     data: [],
                        //     fields: []
                        // });
                        // columns = [];
                        // Ext.getCmp('pSouth').add(fCrearGripReportes(store, columns, defaultComponents));
                        // Ext.getCmp('pSouth').doLayout();
                        mostrarMensaje(1, 'La configuraci&oacute;n del reporte seleccionado no han sido realizada correctamente.');
                    } else {
                        Ext.getCmp('pCenter').collapse();
                        if (respuesta.dataSources.length == 0) {
                            var defaultComponents = {};
                            Ext.getCmp('pCenter').expand();
                            store = new Ext.data.JsonStore({
                                data: [],
                                fields: []
                            });
                            columns = [];
                            Ext.getCmp('pSouth').add(fCrearGripReportes(store, columns, defaultComponents));
                            Ext.getCmp('pSouth').doLayout();
                            //aqui va..(Ext.getCmp('gpReportes').body.dom, 'Informacion', 'No existen datos que mostrar.', 1);
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        }
                        else {
                            if (success)
                                fPintarGridReporte(Ext.decode(response.responseText));
                        }
                    }
                }
            });
        } else
        {
            mostrarMensaje(1, 'Realice el filtro de selecci&oacute;n correctamente.');
        }
    }

    function fObtenerListEnComponent(component)
    {
        return Ext.getCmp('gp' + component.getId().substring(3, component.getId().length)).getSelectionModel().getSelections();
    }

    function fVerificarDesglose(fp)
    {
        flag = true;
        fp.cascade(function(component) {
            if (component.getXType() == 'combo')
            {
                id = component.getId();
                gp = Ext.getCmp('gp' + id.substring(3, id.length))
                if (gp)
                {
                    list = gp.getSelectionModel().getSelections();
                    flag = (list.length > 0) ? true : false;
                } else
                    flag = false;
            }
        });
        return flag;
    }

    function fAceptoBusqueda(opcion)
    {
        if (Ext.get('cbxEstructura').getValue() && Ext.get('cbxEstructura').getValue() != 'Seleccione...')
            fObtenerValoresComponentes(Ext.getCmp('pColumn'), opcion);
    }

    function fSelecionarTodo(identificador)
    {
        if (Ext.getCmp('btnSelect' + identificador).getText() == 'Seleccionar todos' && !chainSelection)
        {
            Ext.getCmp('btnSelect' + identificador).setText('Descartar selecci&oacute;n');
            Ext.getCmp('btnSelect' + identificador).disable();
            chainSelection = true;
            store = Ext.getCmp('gp' + identificador).getStore();
            storeCount = store.getCount();
            for (var i = 0; i < storeCount; i++)
            {
                fDeselectInBranch(identificador, Ext.getCmp('gp' + identificador).getSelectionModel(), store.getAt(i))
                Ext.getCmp('gp' + identificador).getSelectionModel().selectRow(i, true);
                if (i + 1 == storeCount)
                {
                    chainSelection = false;
                    Ext.getCmp('btnSelect' + identificador).enable()
                }
            }
        } else
        {
            Ext.getCmp('btnSelect' + identificador).setText('Seleccionar todos')
            Ext.getCmp('gp' + identificador).getSelectionModel().clearSelections();
            Ext.getCmp('gp' + identificador).getSelectionModel().displaySelect = new Array();
            Ext.getCmp('cbx' + identificador).reset();
        }
        Ext.getCmp('cbx' + identificador).focus(true);
    }
    function fPintarReporteAnexo2()
    {
        if (Ext.getCmp('gpEstructura').getSelectionModel().hasSelection())
        {
            posUnidad = 0;
            arrayUnidades = new Array();
            arrayUnidades = Ext.getCmp('gpEstructura').getSelectionModel().getSelections();
            arrayAnexo2 = new Array();

            for (i = 0; i < arrayUnidades.length; i++)
            {
                var arrayConceptos = new Array();
                arrayConceptos = [
                    ['2.1', 'De Cheques en TrÃ¡nsito al Cierre del AÃ±o Anterior Salarios'],
                    ['2.1', 'De Cheques en TrÃ¡nsito al Cierre del AÃ±o Anterior Otros Gastos'],
                    ['2.1', 'De Cheques en TrÃ¡nsito al Cierre del AÃ±o Anterior Inversiones'],
                    ['2.2', 'De Compromisos Pendientes de Pago al Cierre del AÃ±o Anterior Salarios'],
                    ['2.2', 'De Compromisos Pendientes de Pago al Cierre del AÃ±o Anterior Otros Gastos'],
                    ['2.2', 'De Compromisos Pendientes de Pago al Cierre del AÃ±o Anterior Inversiones'],
                    ['2.3', 'De Cheques Correspondientes a Pagos del AÃ±o Actual Salarios'],
                    ['2.3', 'De Cheques Correspondientes a Pagos del AÃ±o Actual Otros Gastos'],
                    ['2.3', 'De Cheques Correspondientes a Pagos del AÃ±o Actual Inversiones'],
                    ['2.4', 'De Pagos Anticipados del AÃ±o Salarios'],
                    ['2.4', 'De Pagos Anticipados del AÃ±o Otros Gastos'],
                    ['2.4', 'De Pagos Anticipados del AÃ±o Inversiones'],
                    ['4.1', 'De Cheques en TrÃ¡nsito al Cierre del AÃ±o Anterior Salarios'],
                    ['4.1', 'De Cheques en TrÃ¡nsito al Cierre del AÃ±o Anterior Otros Gastos'],
                    ['4.1', 'De Cheques en TrÃ¡nsito al Cierre del AÃ±o Anterior Inversiones'],
                    ['4.2', 'De Compromisos Pendientes de Pagos al Cierre del AÃ±o Anterior Salarios'],
                    ['4.2', 'De Compromisos Pendientes de Pagos al Cierre del AÃ±o Anterior Otros Gastos'],
                    ['4.2', 'De Compromisos Pendientes de Pagos al Cierre del AÃ±o Anterior Inversiones'],
                    ['4.4', 'De Pagos Anticipados del AÃ±o Actual Salarios'],
                    ['4.4', 'De Pagos Anticipados del AÃ±o Actual Otros Gastos'],
                    ['4.4', 'De Pagos Anticipados del AÃ±o Actual Inversiones'],
                    ['5.1', 'Obligaciones Pendientes de Pago del AÃ±o Anterior Inversiones'],
                    ['5.1', 'Obligaciones Pendientes de Pago del AÃ±o Actual Inversiones']
                ];

                nf_importe = new Ext.form.NumberField({
                    id: 'nf_importe'
                });

                js_anexo2 = new Ext.data.JsonStore({
                    id: 'js_anexo2' + i,
                    fields: [
                        {
                            name: 'no',
                            mapping: '0'
                        }, {
                            name: 'concepto',
                            mapping: '1'
                        }, {
                            name: 'importe'
                        }
                    ]
                });

                js_anexo2.loadData(arrayConceptos);

                var sm_anexo2 = new Ext.grid.RowSelectionModel({
                    id: 'sm_anexo2' + i
                });

                var cm_anexo2 = new Ext.grid.ColumnModel({
                    id: 'cm_anexo2' + i,
                    columns: [
                        {
                            header: "No.",
                            width: 25,
                            align: 'center',
                            dataIndex: 'no'
                        }, {
                            header: "Concepto",
                            width: 400,
                            dataIndex: 'concepto'
                        }, {
                            header: "Importe",
                            width: 100,
                            align: 'right',
                            dataIndex: 'importe',
                            editor: nf_importe
                        }
                    ]
                });

                var egp_anexo2 = new Ext.grid.EditorGridPanel({
                    id: 'egp_anexo2' + i,
                    border: false,
                    clicksToEdit: 1,
                    cm: cm_anexo2,
                    sm: sm_anexo2,
                    store: js_anexo2,
                    tbar: [' ', 'No.', '-', 'Concepto', '->', '-', 'Importe', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                    title: 'Unidad ' + arrayUnidades[i].data.codigoestructura
                });

                w_anexo2 = new Ext.Window({
                    id: 'w_anexo2' + i,
                    border: false,
                    constrain: true,
                    defaultButton: 0,
                    buttons: [
                        {
                            id: 'b_aceptar_anexo2_' + i,
                            iconCls: 'recuperaciones',
                            handler: function()
                            {
                                anterior = posUnidad - 1;

                                if (posUnidad < arrayUnidades.length)
                                {
                                    Ext.getCmp('w_anexo2' + posUnidad).show();
                                    posUnidad++;
                                }

                                arrayAnexo2.push(arrayUnidades[anterior].data.idestructurae);

                                var store = Ext.getCmp('egp_anexo2' + anterior).getStore();
                                for (var j = 0; j < store.getCount(); j++) {
                                    if (store.getAt(j).data.importe == '')
                                        arrayAnexo2.push(0);
                                    else
                                        arrayAnexo2.push(store.getAt(j).data.importe);
                                }
                                if (arrayAnexo2.length / 24 == arrayUnidades.length)
                                {
                                    consolidado = 0; // por el momento...
                                    fAceptoBusqueda(2);
                                }
                                Ext.getCmp('w_anexo2' + anterior).destroy();
                            },
                            text: (i == arrayUnidades.length - 1) ? 'Aceptar' : 'Siguiente'
                        }
                    ],
                    items: [egp_anexo2],
                    layout: 'fit',
                    modal: true,
                    resizable: false,
                    title: 'Informe de EjecuciÃ³n de los Pagos Anexo No.2',
                    width: 539,
                    height: 594
                });
                w_anexo2.doLayout();
            }
            Ext.getCmp('w_anexo2' + posUnidad).show();
            posUnidad++;
        }
        else
            mostrarMensaje(1, 'Debe seleccionar al menos una entidad.');
    }

    function fPintarReporteAnexo3()
    {
        if (Ext.getCmp('gpEstructura').getSelectionModel().hasSelection())
        {
            nf_pesalario = new Ext.form.NumberField({
                id: 'nf_pesalario'
            });

            nf_peog = new Ext.form.NumberField({
                id: 'nf_peog'
            });

            nf_pecapital = new Ext.form.NumberField({
                id: 'nf_pecapital'
            });

            js_anexo3 = new Ext.data.JsonStore({
                fields: [
                    {
                        name: 'idestructurae',
                        mapping: '0'
                    }, {
                        name: 'codigoestructura',
                        mapping: '1'
                    }, {
                        name: 'pesalario'
                    }, {
                        name: 'peog'
                    }, {
                        name: 'pecapital'
                    }
                ]
            });

            sm_anexo3 = new Ext.grid.RowSelectionModel({});

            cm_anexo3 = new Ext.grid.ColumnModel([
                {
                    hidden: true,
                    dataIndex: 'idestructurae'
                }, {
                    header: "Unidad",
                    width: 50,
                    dataIndex: 'codigoestructura'
                }, {
                    header: "PE Salario",
                    width: 150,
                    align: 'right',
                    dataIndex: 'pesalario',
                    editor: nf_pesalario
                }, {
                    header: "PE Otros Gastos",
                    width: 160,
                    align: 'right',
                    dataIndex: 'peog',
                    editor: nf_peog
                }, {
                    header: "PE Capital",
                    width: 150,
                    align: 'right',
                    dataIndex: 'pecapital',
                    editor: nf_pecapital
                }
            ]);

            egp_anexo3 = new Ext.grid.EditorGridPanel({
                border: false,
                clicksToEdit: 1,
                cm: cm_anexo3,
                //frame:true,
                sm: sm_anexo3,
                store: js_anexo3
            });

            var arreglo = new Array();
            seleccionados = Ext.getCmp('gpEstructura').getSelectionModel().getSelections();
            for (var i = 0; i < seleccionados.length; i++)
            {
                var fila = new Array();
                fila.push(seleccionados[i].data.idestructurae);
                fila.push(seleccionados[i].data.codigoestructura);
                arreglo.push(fila);
            }
            js_anexo3.loadData(arreglo);

            chb_consolidado = new Ext.form.Checkbox({
                id: 'chb_consolidado',
                hideLabel: true
            });

            w_anexo3 = new Ext.Window({
                id: 'w_anexo3',
                bodyStyle: 'padding:5px 5px 2px 5px;',
                border: false,
                constrain: true,
                defaultButton: 0,
                buttons: [
                    {
                        id: 'b_aceptar_anexo3',
                        iconCls: 'recuperaciones',
                        handler: function() {
                            arrayPESalario = new Array();
                            arrayPEOG = new Array();
                            arrayPECapital = new Array();

                            for (var i = 0; i < js_anexo3.getCount(); i++)
                            {
                                var rec = new Array();
                                rec = js_anexo3.getAt(i);
                                arrayPESalario.push((rec.data.pesalario) ? rec.data.pesalario : 0);
                                arrayPEOG.push((rec.data.peog) ? rec.data.peog : 0);
                                arrayPECapital.push((rec.data.pecapital) ? rec.data.pecapital : 0);
                            }

                            consolidado = (chb_consolidado.getValue() == true) ? 1 : 0;
                            Ext.getCmp('btnBuscar').enable();
                            nf_pesalario.reset();
                            nf_peog.reset();
                            nf_pecapital.reset();
                            chb_consolidado.reset();
                            w_anexo3.destroy();
                            fAceptoBusqueda(1);
                        },
                        text: 'Aceptar'
                    }
                ],
                items: [egp_anexo3],
                layout: 'form',
                modal: true,
                resizable: false,
                bbar: ['Consolidado', ' ', chb_consolidado],
                tbar: [' ', ' ', ' ', ' ', 'Unidad', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', 'Pagos Estimados Salario', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', 'Pagos Estimados Otros Gastos', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Pagos Estimados Capital'],
                title: 'Solicitud de Financiamiento Anexo No.3',
                width: 535
            });
            w_anexo3.show();
        }
        else
            mostrarMensaje(1, 'Debe seleccionar al menos una entidad.');
    }

    function fCrearGripReportes(store, columns, defaultComponentsValue)
    {
        if (Ext.getCmp('gpReportes'))
            Ext.getCmp('pSouth').remove(Ext.getCmp('gpReportes'));
        return new Ext.grid.GridPanel({
            id: 'gpReportes',
            autoScroll: true,
            frame: true,
            layout: 'fit',
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            store: store,
            columns: columns,
            tbar: [new Ext.Button({
                    id: 'btnVistaPreliminar',
                    hidden: (store.getCount() > 0) ? false : true,
                    iconCls: 'vistareporte',
                    text: 'Vista <u>r</u>eporte',
                    tooltip: 'Mostrar vista reporte <b>(Alt+R)</b>',
                    handler: function() {
                        Ext.getCmp('pCenter').collapse();
                        fOpenWindowReport(defaultComponentsValue);
                    }
                })

            ]
        });
    }

    var responseDataSources = new Array();
    function fOpenWindowReport(defaultComponentsValue)
    {
        printView = new SCFPrintView(responseDataSources, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
        printView.show();
    }

    function fPintarGridReporte(responseData)
    {
        var defaultComponentsValue = {};
        responseDataSources = responseData.dataSources;
        switch (responseData.idreporte)
        {
            case "1":
                {
                    construirSubMayorGastoDelPresupuesto();
                }
                break;
            case "2":
                {
                    construirSubMayorGastoDelPresupuesto();
                }
                break;
            case "3":
                {
                    construirSubMayorGastoDelPresupuesto();
                }
                break;
            case "4":
                {
                    store = new Ext.data.JsonStore({
                        data: responseData.datos,
                        fields: [{
                                name: 'Entidad'
                            }, {
                                name: 'centrocosto'
                            }, {
                                name: 'salarioacum'
                            }, {
                                name: 'salariomes'
                            }, {
                                name: 'ogacum'
                            }, {
                                name: 'ogmes'
                            }, {
                                name: 'invacum'
                            }, {
                                name: 'invmes'
                            }]
                    });
                    columns = [{
                            header: "UM",
                            width: 300,
                            align: 'left',
                            dataIndex: 'Entidad'
                        }, {
                            header: 'Grupo Presupuestario',
                            width: 200,
                            align: 'left',
                            dataIndex: 'centrocosto'
                        }, {
                            header: 'Salario Acumulado',
                            width: 150,
                            align: 'right',
                            dataIndex: 'salarioacum'
                        }, {
                            header: 'Salario Mes Actual',
                            width: 150,
                            align: 'right',
                            dataIndex: 'salariomes'
                        }, {
                            header: 'OG Acumulado',
                            width: 150,
                            align: 'right',
                            dataIndex: 'ogacum'
                        }, {
                            header: 'OG Mes Actual',
                            width: 150,
                            align: 'right',
                            dataIndex: 'ogmes'
                        }, {
                            header: 'Capital Acumulado',
                            width: 150,
                            align: 'right',
                            dataIndex: 'invacum'
                        }, {
                            header: 'Capital Mes Actual',
                            width: 150,
                            align: 'right',
                            dataIndex: 'invmes'
                        }];
                    defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                }
                break;
            case "5":
                {
                    store = new Ext.data.JsonStore({
                        data: responseData.datos,
                        fields: [{
                                name: 'Entidad'
                            }, {
                                name: 'codigoparrafo'
                            }, {
                                name: 'codigoespecialidad'
                            }, {
                                name: 'transferido'
                            }, {
                                name: 'recibido'
                            }, {
                                name: 'pendiente'
                            }]
                    });
                    columns = [{
                            header: 'Entidad',
                            width: 300,
                            align: 'left',
                            dataIndex: 'Entidad'
                        }, {
                            header: 'C&oacute;digo',
                            width: 200,
                            align: 'left',
                            dataIndex: 'codigoparrafo'
                        }, {
                            header: 'Especialidad',
                            width: 150,
                            align: 'left',
                            dataIndex: 'codigoespecialidad'
                        }, {
                            header: 'Transferido',
                            width: 150,
                            align: 'right',
                            dataIndex: 'transferido'
                        }, {
                            header: 'Recibido',
                            width: 150,
                            align: 'right',
                            dataIndex: 'recibido'
                        }, {
                            header: 'Pendiente',
                            width: 150,
                            align: 'right',
                            dataIndex: 'pendiente'
                        }];
                    defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Vertical",
                        reportType: "HTML"
                    };
                }
                break;
            case "6":
                {
                    store = new Ext.data.JsonStore({
                        data: responseData.datos,
                        fields: [{
                                name: 'Entidad'
                            }, {
                                name: 'especialidad'
                            }, {
                                name: 'codigoestructura'
                            }, {
                                name: 'grupo'
                            }, {
                                name: 'pressalario'
                            }, {
                                name: 'presotrosgastos'
                            }, {
                                name: 'prescapital'
                            }, {
                                name: 'total'
                            }]
                    });
                    columns = [{
                            header: "UM",
                            width: 300,
                            align: 'left',
                            dataIndex: 'Entidad'
                        }, {
                            header: 'Especialidad',
                            width: 200,
                            align: 'left',
                            dataIndex: 'especialidad'
                        }, {
                            header: 'C&oacute;digo Estructura',
                            width: 150,
                            align: 'right',
                            dataIndex: 'codigoestructura',
                            hidden: true
                        }, {
                            header: 'Grupo Presupuestario',
                            width: 150,
                            align: 'right',
                            dataIndex: 'grupo'
                        }, {
                            header: 'Salario',
                            width: 150,
                            align: 'right',
                            dataIndex: 'pressalario'
                        }, {
                            header: 'Otros Gastos',
                            width: 150,
                            align: 'right',
                            dataIndex: 'presotrosgastos'
                        }, {
                            header: 'Capital',
                            width: 150,
                            align: 'right',
                            dataIndex: 'prescapital'
                        }, {
                            header: 'Total',
                            width: 150,
                            align: 'right',
                            dataIndex: 'total'
                        }
                    ];
                    defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                }
                break;
            case "7":
                {
                    store = new Ext.data.JsonStore({
                        data: responseData.datos,
                        fields: [{
                                name: 'Entidad'
                            }, {
                                name: 'centrocosto'
                            }, {
                                name: 'especialidad'
                            }, {
                                name: 'tipo'
                            }, {
                                name: 'gasto'
                            }, {
                                name: 'asignado'
                            }, {
                                name: 'gastado'
                            }, {
                                name: 'saldogasto'
                            }]
                    });
                    columns = [{
                            header: 'Entidad',
                            width: 300,
                            align: 'left',
                            dataIndex: 'Entidad'
                        }, {
                            header: 'Grupo Presupuestario',
                            width: 200,
                            align: 'left',
                            dataIndex: 'centrocosto'
                        }, {
                            header: 'Especialidad',
                            width: 150,
                            align: 'left',
                            dataIndex: 'especialidad'
                        }, {
                            header: 'Tipo Gasto',
                            width: 150,
                            align: 'center',
                            dataIndex: 'tipo'
                        }, {
                            header: 'Partida',
                            width: 150,
                            align: 'left',
                            dataIndex: 'gasto'
                        }, {
                            header: 'Asignado',
                            width: 150,
                            align: 'right',
                            dataIndex: 'asignado'
                        }, {
                            header: 'Gastado',
                            width: 150,
                            align: 'right',
                            dataIndex: 'gastado'
                        }, {
                            header: 'Saldo',
                            width: 150,
                            align: 'right',
                            dataIndex: 'saldogasto'
                        }];
                    defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Vertical",
                        reportType: "HTML"
                    };
                }
                break;
            case "14" :
                {
                    fPintarGridEjecucionPresupuestoAprobadoEstadoB();
                }
                break;
            case "15" :
                {
                    fPintarGridEjecucionPresupuestoAprobadoEstadoB();
                }
                break;
            case "18":
                {
                    fPintarGridRecursosFinancieros(false);
                }
                break;
            case "20":
                {
                    fPintarGridRecursosFinancieros(true);
                }
                break;
            case "26":
                {
                    store = new Ext.data.JsonStore({
                        data: responseData.datos,
                        fields: [{
                                name: 'Entidad'
                            }, {
                                name: 'especialidad'
                            }, {
                                name: 'grupo'
                            }, {
                                name: 'partida'
                            }, {
                                name: 'hombrespagados'
                            }, {
                                name: 'importe'
                            }]
                    });
                    columns = [{
                            header: "UM",
                            width: 300,
                            align: 'left',
                            dataIndex: 'Entidad'
                        }, {
                            header: 'Especialidad',
                            width: 200,
                            align: 'left',
                            dataIndex: 'especialidad'
                        }, {
                            header: 'Grupo Presupuestario',
                            width: 150,
                            align: 'right',
                            dataIndex: 'grupo'
                        }, {
                            header: 'Partida',
                            width: 150,
                            align: 'right',
                            dataIndex: 'partida'
                        }, {
                            header: 'Hombres Pagados',
                            width: 150,
                            align: 'right',
                            dataIndex: 'hombrespagados'
                        }, {
                            header: 'Importe',
                            width: 150,
                            align: 'right',
                            dataIndex: 'importe'
                        }
                    ];
                    defaultComponentsValue = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                }
                break;
            default:
                {
                    Ext.getCmp('pCenter').expand();
                    store = new Ext.data.JsonStore({
                        data: [],
                        fields: []
                    });
                    columns = [];
                }
        }
        Ext.getCmp('pSouth').add(fCrearGripReportes(store, columns, defaultComponentsValue));
        Ext.getCmp('pSouth').doLayout();

        function construirSubMayorGastoDelPresupuesto()
        {
            store = new Ext.data.JsonStore({
                data: responseData.datos,
                fields: [{
                        name: 'Entidad'
                    }, {
                        name: 'centrocosto'
                    }, {
                        name: 'especialidad'
                    }, {
                        name: 'fechaemision'
                    }, {
                        name: 'numerocmp'
                    }, {
                        name: 'descripcion'
                    }, {
                        name: 'presupuesto'
                    }, {
                        name: 'gasto'
                    }, {
                        name: 'saldototal'
                    }, {
                        name: 'objetogasto'
                    }, {
                        name: 'canthomb'
                    }]
            });
            columns = [{
                    header: "UM",
                    width: 200,
                    align: 'left',
                    dataIndex: 'Entidad'
                }, {
                    header: 'Grupo Presupuestario',
                    width: 300,
                    align: 'left',
                    dataIndex: 'centrocosto'
                }, {
                    header: 'Especialidad',
                    width: 200,
                    align: 'left',
                    dataIndex: 'especialidad'
                }, {
                    header: 'Fecha Emisi&oacute;n',
                    width: 100,
                    align: 'center',
                    dataIndex: 'fechaemision'
                }, {
                    header: 'CO',
                    width: 50,
                    align: 'right',
                    dataIndex: 'numerocmp'
                }, {
                    header: 'Detalle',
                    width: 300,
                    align: 'left',
                    dataIndex: 'descripcion'
                }, {
                    header: 'Presupuesto Aprobado',
                    width: 150,
                    align: 'right',
                    dataIndex: 'presupuesto'
                }, {
                    header: 'Gastos (Reintegros)',
                    width: 150,
                    align: 'right',
                    dataIndex: 'gasto'
                }, {
                    header: 'Saldo',
                    width: 150,
                    align: 'right',
                    dataIndex: 'saldototal'
                }, {
                    header: 'Partida',
                    width: 150,
                    align: 'center',
                    dataIndex: 'objetogasto'
                }, {
                    header: 'H',
                    width: 50,
                    align: 'right',
                    dataIndex: 'canthomb'
                }];
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
        }

        function fPintarGridRecursosFinancieros(flagIngresos)
        {
            field = (flagIngresos) ? [{
                    name: 'Entidad'
                }, {
                    name: 'especialidad'
                }, {
                    name: 'ingreso'
                }, {
                    name: 'fechaemision'
                }, {
                    name: 'numerocmp'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'debe'
                }, {
                    name: 'haber'
                }, {
                    name: 'saldototal'
                }]
                    : [{
                            name: 'Entidad'
                        }, {
                            name: 'especialidad'
                        }, {
                            name: 'fechaemision'
                        }, {
                            name: 'numerocmp'
                        }, {
                            name: 'descripcion'
                        }, {
                            name: 'debe'
                        }, {
                            name: 'haber'
                        }, {
                            name: 'saldototal'
                        }];

            columns = (flagIngresos) ? [{
                    header: 'Entidad',
                    width: 300,
                    align: 'left',
                    dataIndex: 'Entidad'
                }, {
                    header: 'Especialidad',
                    width: 300,
                    align: 'left',
                    dataIndex: 'especialidad'
                }, {
                    header: 'Ingreso',
                    width: 300,
                    align: 'left',
                    dataIndex: 'ingreso'
                }, {
                    header: 'Fecha',
                    width: 80,
                    align: 'center',
                    dataIndex: 'fechaemision'
                }, {
                    header: 'CO',
                    width: 50,
                    align: 'center',
                    dataIndex: 'numerocmp'
                }, {
                    header: 'Detalle',
                    width: 400,
                    align: 'left',
                    dataIndex: 'descripcion'
                }, {
                    header: 'Debe',
                    width: 100,
                    align: 'right',
                    dataIndex: 'debe'
                }, {
                    header: 'Haber',
                    width: 100,
                    align: 'right',
                    dataIndex: 'haber'
                }, {
                    header: 'Saldo',
                    width: 100,
                    align: 'right',
                    dataIndex: 'saldototal'
                }]
                    :[{
                    header: 'Entidad',
                    width: 300,
                    align: 'left',
                    dataIndex: 'Entidad'
                }, {
                    header: 'Especialidad',
                    width: 300,
                    align: 'left',
                    dataIndex: 'especialidad'
                }, {
                    header: 'Fecha',
                    width: 80,
                    align: 'center',
                    dataIndex: 'fechaemision'
                }, {
                    header: 'CO',
                    width: 50,
                    align: 'center',
                    dataIndex: 'numerocmp'
                }, {
                    header: 'Detalle',
                    width: 400,
                    align: 'left',
                    dataIndex: 'descripcion'
                }, {
                    header: 'Debe',
                    width: 100,
                    align: 'right',
                    dataIndex: 'debe'
                }, {
                    header: 'Haber',
                    width: 100,
                    align: 'right',
                    dataIndex: 'haber'
                }, {
                    header: 'Saldo',
                    width: 100,
                    align: 'right',
                    dataIndex: 'saldototal'
                }];

            for (var i = 0; i < responseData.columns.length; i++)
            {
                field.push({
                    name: responseData.columns[i]
                });
                columns.push({
                    header: '',
                    width: 100,
                    align: 'center',
                    dataIndex: responseData.columns[i]
                });
            }
            store = new Ext.data.JsonStore({
                data: responseData.datos,
                fields: field
            });
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
        }

        function fPintarGridEjecucionPresupuestoAprobadoEstadoB()
        {
            store = new Ext.data.JsonStore({
                data: responseData.datos,
                fields: [{
                        name: 'Entidad'
                    }, {
                        name: 'centro'
                    }, {
                        name: 'codespingreso'
                    }, {
                        name: 'descespingreso'
                    }, {
                        name: 'importepresup'
                    }, {
                        name: 'importerecursos'
                    }, {
                        name: 'porciento'
                    }, {
                        name: 'saldo'
                    }]
            });
            columns = [{
                    header: 'Entidad',
                    width: 250,
                    align: 'left',
                    dataIndex: 'Entidad'
                }, {
                    header: 'C&oacute;digo',
                    width: 150,
                    align: 'left',
                    dataIndex: 'codespingreso'
                }, {
                    header: 'Denominaci&oacute;n',
                    width: 300,
                    align: 'left',
                    dataIndex: 'descespingreso'
                }, {
                    header: 'Presupuesto aprobado',
                    width: 150,
                    align: 'right',
                    dataIndex: 'importepresup'
                }, {
                    header: 'Recursos Financieros <br>(Ingresos) Transferidos',
                    width: 150,
                    align: 'right',
                    dataIndex: 'importerecursos'
                }, {
                    header: '%',
                    width: 100,
                    align: 'center',
                    dataIndex: 'porciento'
                }, {
                    header: 'Saldo',
                    width: 150,
                    align: 'right',
                    dataIndex: 'saldo'
                }];
            if (responseData.datos[0].pintoCentro == true || responseData.datos[0].pintoCentro == 'true')
                columns.splice(2, 0, {
                    header: '',
                    width: 300,
                    align: 'left',
                    dataIndex: 'centro'
                });
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
        }
    }