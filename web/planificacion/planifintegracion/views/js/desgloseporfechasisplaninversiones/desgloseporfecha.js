var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
var filasActv = -1;
perfil.etiquetas = {};
//***************variables****************
var recordSelected, identidadselected, idEstructuraPadre, is_leaf, maxvalue = 0, teclascalientes, offset = 0, offsetd = 0;
var esRector = false;
var contadorAdiciones = 0;
objci = {};
objci.acciones = [];
UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
    for (i in acciones_reportes) {
        objci.acciones[acciones_reportes[i].abreviatura] = true;
        if (acciones_reportes[i].abreviatura == 'rector') {
            esRector = true;
            break;
        } else {
            esRector = false;
        }
    }
})
UCID.portal.cargarEtiquetas('desgloseporfecha', cargarInterfaz);
function cargarInterfaz() {

    //Creo el vtype para validar las fechas
    Ext.apply(Ext.form.VTypes, {
        daterange: function(val, field) {

            var date = field.parseDate(val);
            if (!date) {
                return;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = Ext.getCmp(field.startdt);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = Ext.getCmp(field.enddt);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        }
    });
    //Creo mi espacio de trabajo
    Ext.namespace('Ext.desglosefecha');

    stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }]),
        listeners: {
            load: function(t, n, e) {
                cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        }
    });

    cmbEjercicio = new Ext.form.ComboBox({
        width: 150,
        id: 'idejercicioplanif',
        store: stCbejercicio,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        typeAhead: true,
        mode: 'local',
        disabled: false,
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function() {
                filasActv = -1;
                Ext.getCmp('gpDesgloseFecha').getStore().removeAll();
                Ext.getCmp('gpDesgloseFecha').hide();
                Ext.getCmp('gpDesgloseFecha').collapse();
                Ext.getCmp('gpNivelesActividad').getStore().reload();
                viewport.render();

            }
        }
    });
    btnExportar = {
        id: 'btnExportar',
        iconCls: 'exportar',
        disabled: true,
        tooltip: 'Exportar desglose por fecha <b>(Alt+E)</b>',
        handler: function() {
            exportar({
                idejercicio: cmbEjercicio.getValue(),
                idEstructuraPadre: idEstructuraPadre,
                esrector: esRector,
                identidad: identidadselected,
                is_leaf: is_leaf,
                filtros: Ext.encode(gridNivelesfilter.getFilterData()),
                glob: Ext.getCmp('chkglobalDA').getValue()
            });
        }
    };
    chBoxAll = {
        xtype: 'checkbox',
        boxLabel: 'Global',
        id: 'chkglobalDA',
        listeners: {
            check: function(ck, t) {
                Ext.getCmp('gpNivelesActividad').getStore().reload();
            }
        }
    }
    //Creo los filtros de los grids
    gridNivelesfilter = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                xtype: 'numberfield',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividad'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadpordesglozar'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadreal'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadbp'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadinv'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadproy'
            }]
    });
    gridDesglosefilter = new Ext.grid.GridFilters({
        filters: [{
                type: 'numeric',
                dataIndex: 'nivelactividad'
            }, {
                type: 'date',
                dataIndex: 'fechainicio'
            }, {
                type: 'date',
                dataIndex: 'fechafin'
            }, {
                type: 'list',
                dataIndex: 'tipo',
                multiple: true,
                options: ["Bases para el plan", "Inversión", "Proyecto"]
            }]
    });

    trEnt = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false,
                width: 600
            });
    trEnt.btnBuscar.setText("");
    trEnt.btnLimpiar.setText("");
    trEnt = trEnt.items.items[0];
    trEnt.getRootNode().expand();
    trEnt.addListener('click', function(n) {
        if (n.text != "Estructuras") {
            Ext.getCmp('gpNivelesActividad').enable();
            cmbEjercicio.enable();
            Ext.getCmp('btnExportar').enable();
            Ext.getCmp('chkglobalDA').enable();
            filasActv = -1;
            Ext.getCmp('gpDesgloseFecha').getStore().removeAll();
            Ext.getCmp('gpDesgloseFecha').hide();
            Ext.getCmp('gpDesgloseFecha').collapse();
            this.getSelectionModel().select(n);
            identidadselected = n.id;
            idEstructuraPadre = n.attributes.idEstructuraPadre;
            is_leaf = n.leaf;
            if (!is_leaf) {
                esHoja = 1;
            } else {
                esHoja = 0;
            }
            Ext.getCmp('gpNivelesActividad').getStore().reload();
            viewport.render();
            Ext.getCmp('btnExportar').enable();
        } else {
            gridNAct = Ext.getCmp('gpNivelesActividad');
            gridNAct.disable();
            cmbEjercicio.disable();
            Ext.getCmp('btnExportar').disable();
            Ext.getCmp('chkglobalDA').disable();
            var store = gridNAct.getStore();
            store.removeAll();
        }
    });
    pMultiEnt = new Ext.Panel({
        title: 'Entidades',
        id: 'pMultiEnt',
        region: 'west',
        width: 220,
        frame: false,
        layout: 'fit',
        collapsible: true,
        titleCollapse: true,
        split: true,
        listeners: {
            show: function(tp) {
                trEnt.getRootNode().expand();
            }
        },
        items: trEnt
    });
    //panel principal

    Ext.desglosefecha.mainPanel = Ext.extend(Ext.Panel, {
        layout: 'border',
        initComponent: function() {
            var self = this;
            self.tbar = [btnExportar, '-', 'Ejercicio:  ', cmbEjercicio, '-', chBoxAll, '->', {
                    id: 'idAyudaDesglose',
                    iconCls: 'ayuda',
                    text: perfil.etiquetas.lbTtBtnAy,
                    tooltip: perfil.etiquetas.lbTtBtnAyuda
                }],
            self.items = [pMultiEnt, {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'border',
                    items: [{
                            xtype: 'grid',
                            id: 'gpNivelesActividad',
                            title: 'Niveles de actividad',
                            frame: true,
                            region: 'center',
                            plugins: gridNivelesfilter,
                            loadMask: {
                                msg: 'Cargando...'
                            },
                            autoExpandColumn: 'expandir',
                            sm: new Ext.grid.RowSelectionModel({
                                singleSelect: true,
                                listeners: {
                                    rowselect: function(sm, rowIndex, rec) {
                                        filasActv = rowIndex;
                                        if (Ext.getCmp('chkglobalDA').getValue() == false) {
                                            Ext.getCmp('gpDesgloseFecha').getStore().reload();
                                            Ext.getCmp('btnadicionar').enable();
                                            Ext.getCmp('gpDesgloseFecha').show();
                                            Ext.getCmp('gpDesgloseFecha').expand();
                                            viewport.render();
                                        }
                                        else {
                                            Ext.getCmp('gpDesgloseFecha').getStore().removeAll();
                                            Ext.getCmp('gpDesgloseFecha').hide();
                                            Ext.getCmp('gpDesgloseFecha').collapse();
                                        }
                                    },
                                    rowdeselect: function(a, b, c) {
                                        filasActv = -1;
                                        Ext.getCmp('btnadicionar').disable();
                                        Ext.getCmp('btneliminar').disable();
                                        Ext.getCmp('btnguardar').disable();
                                        Ext.getCmp('gpDesgloseFecha').getStore().removeAll();
                                        Ext.getCmp('gpDesgloseFecha').hide();
                                        Ext.getCmp('gpDesgloseFecha').collapse();
                                    }
                                }
                            }),
                            columns: [{
                                    header: 'Código',
                                    dataIndex: 'codigo',
                                    sortable: true,
                                    tooltip: 'Código de la actividad',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Denominación',
                                    dataIndex: 'denominacion',
                                    sortable: true,
                                    id: 'expandir',
                                    tooltip: 'Denominación de la actividad',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Nivel actividad BP',
                                    dataIndex: 'nivelactividadbp',
                                    sortable: true,
                                    align: 'right',
                                    width: 180,
                                    tooltip: 'Nivel actividad BP',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Nivel actividad inv.',
                                    dataIndex: 'nivelactividadinv',
                                    sortable: true,
                                    align: 'right',
                                    width: 180,
                                    tooltip: 'Nivel actividad inv.',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Nivel actividad proy.',
                                    dataIndex: 'nivelactividadproy',
                                    sortable: true,
                                    align: 'right',
                                    width: 180,
                                    tooltip: 'Nivel actividad proy.',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Nivel actividad planificado',
                                    dataIndex: 'nivelactividad',
                                    sortable: true,
                                    align: 'right',
                                    width: 180,
                                    tooltip: 'Nivel actividad planificado',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Nivel actividad desglosado',
                                    align: 'right',
                                    sortable: true,
                                    width: 180,
                                    dataIndex: 'nivelactividadreal',
                                    tooltip: 'Nivel actividad desglosado',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Nivel actividad por desglosar',
                                    dataIndex: 'nivelactividadpordesglozar',
                                    sortable: true,
                                    align: 'right',
                                    width: 180,
                                    tooltip: 'Nivel actividad por desglosar',
                                    renderer: function(v, para, record) {
                                        para.attr = 'ext:qtip="' + v + '"';
                                        if (v == 0)
                                            return '<span style="color:green;">' + v + '</span>';
                                        else
                                            return '<span style="color:blue;">' + v + '</span>';
                                    }
                                }],
                            store: new Ext.data.Store({
                                storeId: 'storeniveles',
                                url: 'listarNivelesActividad',
                                reader: new Ext.data.JsonReader({
                                    root: 'data',
                                    id: 'idactividadentidad',
                                    totalProperty: 'total'
                                }, [{
                                        name: 'idactividadentidad'
                                    }, {
                                        name: 'idactividad'
                                    }, {
                                        name: 'codigo'
                                    }, {
                                        name: 'denominacion'
                                    }, {
                                        name: 'nivelactividad'
                                    }, {
                                        name: 'nivelactividadreal'
                                    }, {
                                        name: 'nivelactividadpordesglozar'
                                    }, {
                                        name: 'nivelactividadbp'
                                    }, {
                                        name: 'nivelactividadinv'
                                    }, {
                                        name: 'nivelactividadproy'
                                    }]),
                                listeners: {
                                    load: function(st, rec, obt) {
                                        if (st.getCount() == 0) {
                                            if (gridNivelesfilter.getFiltrosActivos() == undefined || gridNivelesfilter.getFiltrosActivos().length == 0) {
                                                Ext.getCmp('gpDesgloseFecha').getStore().removeAll();
                                                Ext.getCmp('gpDesgloseFecha').hide();
                                                Ext.getCmp('gpDesgloseFecha').collapse();
                                                mostrarMensaje(1, 'No existen datos que mostrar.');
                                            } else {
                                                Ext.getCmp('gpDesgloseFecha').getStore().removeAll();
                                                Ext.getCmp('gpDesgloseFecha').hide();
                                                Ext.getCmp('gpDesgloseFecha').collapse();
                                                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                                            }
                                        }
                                        if (filasActv != -1) {
                                            Ext.getCmp('gpNivelesActividad').getSelectionModel().selectRow(filasActv);
                                        }
                                    },
                                    beforeload: function(st, opt) {
                                        mpanel.changeNivelGridTitle();
                                        st.baseParams.start = offset;
                                        st.baseParams.idejercicio = cmbEjercicio.getValue();
                                        st.baseParams.idEstructuraPadre = idEstructuraPadre;
                                        st.baseParams.esrector = esRector;
                                        st.baseParams.identidad = identidadselected;
                                        st.baseParams.is_leaf = is_leaf;
                                        st.baseParams.glob = Ext.getCmp('chkglobalDA').getValue();
                                    }
                                }
                            }),
                            bbar: new Ext.PagingToolbar({
                                store: 'storeniveles',
                                displayInfo: true,
                                items: ['-', {
                                        id: 'clearFilterNivel',
                                        iconCls: 'limpiar',
                                        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
                                        handler: function() {
                                            gridNivelesfilter.clearFilters();
                                        }
                                    }], listeners: {
                                    beforechange: function(p, e) {
                                        offset = e.start;
                                    }
                                }
                            })
                        }, {
                            xtype: 'editorgrid',
                            id: 'gpDesgloseFecha',
                            title: 'Desglose por fecha',
                            collapsible: true,
                            titleCollapse: true,
                            collapsed: true,
                            frame: true,
                            hidden: true,
                            height: 400,
                            plugins: gridDesglosefilter,
                            region: 'south',
                            loadMask: {
                                msg: 'Cargando...'
                            },
                            autoExpandColumn: 'expandir',
                            sm: new Ext.grid.RowSelectionModel({
                                singleSelect: false,
                                listeners: {
                                    rowselect: function(sm) {
                                        controlarConfDesg(sm);
                                    },
                                    rowdeselect: function(sm) {
                                        controlarConfDesg(sm);
                                    }
                                }
                            }),
                            columns: [{
                                    header: 'Nivel',
                                    dataIndex: 'nivelactividad',
                                    id: 'expandir',
                                    tooltip: 'Nivel de actividad',
                                    sortable: false,
                                    renderer: crearToolTip,
                                    editor: new Ext.form.NumberField({
                                        allowNegative: false
                                    })
                                }, {
                                    header: 'Negocio',
                                    dataIndex: 'tipo',
                                    tooltip: 'Negocio',
                                    sortable: false,
                                    renderer: crearToolTipTipo
                                }, {
                                    header: 'Fecha inicio',
                                    dataIndex: 'fechainicio',
                                    tooltip: 'Fecha inicio',
                                    sortable: false,
                                    align: 'center',
                                    editor: new Ext.form.DateField({
                                        format: 'd/m/Y',
                                        id: 'startdt',
                                        anchor: '95%',
                                        allowBlank: false
                                    }),
                                    renderer: formatDate
                                }, {
                                    header: 'Fecha fin',
                                    dataIndex: 'fechafin',
                                    tooltip: 'Fecha fin',
                                    sortable: false,
                                    align: 'center',
                                    editor: new Ext.form.DateField({
                                        format: 'd/m/Y',
                                        id: 'enddt',
                                        anchor: '95%',
                                        allowBlank: false
                                    }),
                                    renderer: formatDate
                                }],
                            tbar: [{
                                    iconCls: 'adicionar',
                                    id: 'btnadicionar',
                                    tooltip: 'Adicionar desglose <b>(Alt+I)</b>',
                                    handler: function() {
                                        self.comprobarSeleccion('adicionar');
                                    }
                                }, {
                                    iconCls: 'eliminar',
                                    id: 'btneliminar',
                                    disabled: true,
                                    tooltip: 'Eliminar desgloses <b>(DEL)</b>',
                                    handler: function() {
                                        self.comprobarSeleccion('eliminar');
                                    }
                                }, {
                                    iconCls: 'guardar',
                                    id: 'btnguardar',
                                    disabled: true,
                                    tooltip: 'Guardar desgloses <b>(Alt+G)</b>',
                                    handler: function() {
                                        self.comprobarSeleccion('guardar');
                                    }
                                }],
                            store: new Ext.data.Store({
                                storeId: 'storedesglose',
                                url: 'listarDesgloses',
                                id: 'storedesglose',
                                reader: new Ext.data.JsonReader({
                                    root: 'data',
                                    //id: 'idnivelactividadporfecha',
                                    totalProperty: 'total'
                                }, [{
                                        name: 'idnivelactividadporfecha'
                                    }, {
                                        name: 'nivelactividad'
                                    }, {
                                        name: 'tipo'
                                    }, {
                                        name: 'fechainicio'
                                    }, {
                                        name: 'fechafin'
                                    }
                                ]),
                                listeners: {
                                    load: function(st, re, o) {
                                        contadorAdiciones = 0;
                                        if (st.getCount() == 0) {
                                            Ext.getCmp('gpDesgloseFecha').expand();
                                            if (gridDesglosefilter.getFiltrosActivos() == undefined || gridDesglosefilter.getFiltrosActivos().length == 0) {

                                            } else {
                                                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                                            }
                                        } else {
                                            Ext.getCmp('gpDesgloseFecha').expand();
                                        }
                                    },
                                    beforeload: function(st) {
                                        self.changeDesgloseGridTitle();
                                        st.baseParams.idactividad = Ext.getCmp('gpNivelesActividad').getSelectionModel().getSelected().data.idactividad;
                                        st.baseParams.identidad = identidadselected;
                                        st.baseParams.idejercicio = cmbEjercicio.getValue();
                                        st.baseParams.start = offsetd;
                                    }
                                }
                            }),
                            listeners: {
                                keypress: function(e) {
                                    if (e.getKey() == 46) {
                                        self.comprobarSeleccion('eliminar');
                                    }
                                },
                                afteredit: function() {
                                    Ext.getCmp('btnguardar').enable();
                                }
                            },
                            bbar: new Ext.PagingToolbar({
                                store: 'storedesglose',
                                displayInfo: true,
                                items: ['-', {
                                        id: 'clearFilterDesglose',
                                        iconCls: 'limpiar',
                                        tooltip: 'Limpiar filtros',
                                        handler: function() {
                                            gridDesglosefilter.clearFilters();
                                        }
                                    }], listeners: {
                                    beforechange: function(p, e) {
                                        offsetd = e.start;
                                    }}
                            })
                        }]
                }];
            Ext.desglosefecha.mainPanel.superclass.initComponent.call(this, arguments);
        },
        changeDesgloseGridTitle: function() {
            var filtrado_por = "";
            var sep = "/";
            if (gridDesglosefilter.getFiltrosActivos() == undefined
                    || gridDesglosefilter.getFiltrosActivos().length == 0) {
                Ext.getCmp('gpDesgloseFecha').setTitle('Desglose por fecha');
            } else {
                for (i = 0; i < gridDesglosefilter.getFiltrosActivos().length; i++) {
                    var aux = "";
                    if (gridDesglosefilter.getFiltrosActivos()[i].dataIndex == "fechafin") {
                        aux = 'Fecha fin';
                    } else if (gridDesglosefilter.getFiltrosActivos()[i].dataIndex == "fechainicio") {
                        aux = 'Fecha inicio';
                    } else if (gridDesglosefilter.getFiltrosActivos()[i].dataIndex == "tipo") {
                        aux = 'Negocio';
                    } else {
                        aux = 'Nivel';
                    }
                    if (i == gridDesglosefilter.getFiltrosActivos().length - 1) {
                        sep = "";
                    }
                    filtrado_por += aux + sep;
                }
                Ext.getCmp('gpDesgloseFecha').setTitle('Desglose por fecha <i> Filtrado por: ' + filtrado_por + '</i>');
                filtrado_por = "";
            }
        },
        changeNivelGridTitle: function() {
            var filtrado_por = "";
            var sep = "/";
            if (gridNivelesfilter.getFiltrosActivos() == undefined
                    || gridNivelesfilter.getFiltrosActivos().length == 0) {
                Ext.getCmp('gpNivelesActividad').setTitle('Niveles de actividad');
            } else {
                for (i = 0; i < gridNivelesfilter.getFiltrosActivos().length; i++) {
                    var aux = "";
                    if (gridNivelesfilter.getFiltrosActivos()[i].dataIndex == "codigo") {
                        aux = 'Código';
                    } else if (gridNivelesfilter.getFiltrosActivos()[i].dataIndex == "denominacion") {
                        aux = 'Denominación';
                    } else if (gridNivelesfilter.getFiltrosActivos()[i].dataIndex == "nivelactividad") {
                        aux = 'Nivel actividad planificado';
                    } else if (gridNivelesfilter.getFiltrosActivos()[i].dataIndex == "nivelactividadpordesglozar") {
                        aux = 'Nivel actividad desglosado';
                    } else if (gridNivelesfilter.getFiltrosActivos()[i].dataIndex == "nivelactividadbp") {
                        aux = 'Nivel actividad BP';
                    } else if (gridNivelesfilter.getFiltrosActivos()[i].dataIndex == "nivelactividadinv") {
                        aux = 'Nivel actividad inversión';
                    } else if (gridNivelesfilter.getFiltrosActivos()[i].dataIndex == "nivelactividadproy") {
                        aux = 'Nivel actividad proyecto';
                    } else {
                        aux = 'Nivel actividad por desglosar';
                    }
                    if (i == gridDesglosefilter.getFiltrosActivos().length - 1) {
                        sep = "";
                    }
                    filtrado_por += aux + sep;
                }
                Ext.getCmp('gpNivelesActividad').setTitle('Niveles de actividad <i> Filtrado por: ' + filtrado_por + '</i>');
                filtrado_por = "";
            }
        },
        adicionarDesglose: function() {
            contadorAdiciones++;
            Fila = Ext.data.Record.create([{
                    name: 'idnivelactividadporfecha',
                    type: 'string'
                }, {
                    name: 'nivelactividad',
                    type: 'string'
                }, {
                    name: 'fechainicio',
                    type: 'string'
                }, {
                    name: 'fechafin',
                    type: 'string'
                }]);
            mpanel.calularsuma();
            if (parseFloat(Ext.getCmp('gpNivelesActividad').getSelectionModel().getSelected().data.nivelactividadbp) - parseFloat(suma) <= 0) {
                mostrarMensaje(2, 'No se puede desglozar porque se ha alcanzado el límite máximo.');
            } else {
                var p = new Fila({
                    idnivelactividadporfecha: null,
                    nivelactividad: (parseFloat(Ext.getCmp('gpNivelesActividad').getSelectionModel().getSelected().data.nivelactividadbp) - parseFloat(suma)).toFixed(4),
                    fechainicio: null,
                    fechafin: null
                });
                Ext.getCmp('gpDesgloseFecha').getStore().add(p);
                Ext.getCmp('gpDesgloseFecha').getSelectionModel().selectRow(Ext.getCmp('gpDesgloseFecha').getStore().getCount() - 1);
                Ext.getCmp('btnguardar').enable();
            }
        },
        calularsuma: function() {
            suma = 0;
            for (i = 0; i < Ext.getCmp('gpDesgloseFecha').getStore().getCount(); i++) {
                suma += parseFloat(Ext.getCmp('gpDesgloseFecha').getStore().getAt(i).data.nivelactividad);
            }
        },
        comprobarSeleccion: function(caso) {
            if (Ext.getCmp('gpNivelesActividad').getSelectionModel().getSelections().length == 0) {
                mostrarMensaje(1, 'Debe seleccionar al menos un nivel de actividad');
            } else {
                switch (caso) {
                    case 'adicionar':
                        mpanel.adicionarDesglose();
                        break;
                    case 'eliminar':
                        if (Ext.getCmp('gpDesgloseFecha').getSelectionModel().getSelections().length == 0)
                            mostrarMensaje(2, '¿Está seguro que quiere eliminar todos los desglose(s) del nivel de actividad seleccionado?', eliminarDesglose);
                        else if (Ext.getCmp('gpDesgloseFecha').getSelectionModel().getSelections().length == 1)
                            mostrarMensaje(2, '¿Está seguro que quiere eliminar el desglose  seleccionado?', eliminarDesglose);
                        else
                            mostrarMensaje(2, '¿Está seguro que quiere eliminar los desgloses  seleccionados?', eliminarDesglose);
                        break;
                    case 'guardar':
                        mpanel.calularsuma();
                        if (parseFloat(Ext.getCmp('gpNivelesActividad').getSelectionModel().getSelected().data.nivelactividadbp) - parseInt(suma) < 0)
                            mostrarMensaje(2, 'No se puede desglozar porque se ha alcanzado el límite máximo');
                        else if (Ext.getCmp('gpDesgloseFecha').getStore().getModifiedRecords().length == 1 && contadorAdiciones == 1)
                            mostrarMensaje(2, '¿Está seguro que quiere guardar el desglose?', guardarDesglose);
                        else if (contadorAdiciones == 1)
                            mostrarMensaje(2, '¿Está seguro que quiere guardar el desglose?', guardarDesglose);
                        else
                            mostrarMensaje(2, '¿Está seguro que quiere guardar los desgloses?', guardarDesglose);
                        break;
                    default:
                        break;
                }
            }
            function eliminarDesglose(btn) {
                if (btn == 'ok') {
                    var barra = Ext.MessageBox.show({
                        title: 'Por favor espere...',
                        msg: 'Eliminando el(los) desglose(s)',
                        width: 300,
                        wait: true,
                        progress: true,
                        closable: false
                    });
                    var recordsSel = Ext.getCmp('gpDesgloseFecha').getSelectionModel().getSelections(), desgElim = [];

                    if (recordsSel.length > 0) {
                        for (var i = 0; i < recordsSel.length; i++)
                            desgElim.push(
                                    recordsSel[i].data.idnivelactividadporfecha
                                    );
                        Ext.Ajax.request({
                            url: 'eliminarDesgloses',
                            params: {
                                idactividad: Ext.getCmp('gpNivelesActividad').getSelectionModel().getSelected().data.idactividad,
                                identidad: identidadselected,
                                idejercicio: cmbEjercicio.getValue(),
                                desgloses: Ext.encode(desgElim)
                            },
                            callback: function(options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                if (responseData.codMsgE == 24) {
                                    recordSelected = Ext.getCmp('gpNivelesActividad').getSelectionModel().getSelections();
                                    mostrarMensaje(1, 'El(los) desglose(s) ha(n) sido eliminado(s) satisfactoriamente.');
                                    Ext.getCmp('gpNivelesActividad').getStore().reload();
                                } else {
                                    if (responseData.mensaje != null)
                                        mostrarMensaje(3, responseData.mensaje);
                                    else
                                        mostrarMensaje(3, 'Ha ocurrido un error');
                                }
                                barra.hide();
                            }
                        });
                    }
                }
            }

            function guardarDesglose(btn) {
                if (btn == 'ok') {
                    contadorAdiciones = 0;
                    var rangoinc = 0;
                    var todosrows = [];
                    todosrows = Ext.getCmp('gpDesgloseFecha').getStore().getRange(0, Ext.getCmp('gpDesgloseFecha').getStore().getCount() - 1);
                    var fechanull = false;
                    var nivel = false;
                    if (todosrows.length > 0) {
                        var barra = Ext.MessageBox.show({
                            title: 'Por favor espere...',
                            msg: 'Guardando los desgloses',
                            width: 300,
                            wait: true,
                            progress: true,
                            closable: false
                        });
                        Ext.each(todosrows, function(record) {
                            if (record.data.fechainicio == '' || record.data.fechafin == '' || record.data.fechainicio == null || record.data.fechafin == null) {
                                fechanull = true;
                            }
                            if (record.data.nivelactividad == '' || record.data.nivelactividad == null) {
                                nivel = true;
                            }
                        });
                        var fechaI = 0;
                        var fechaF = 0;
                        if (fechanull) {
                            mostrarMensaje(1, 'Por favor verifique, existen campos con fechas nulas.');
                        } else if (nivel) {
                            mostrarMensaje(1, 'Por favor verifique, el campo Nivel no puede ser nulo.');
                        } else {
                            var recordsEnviar = [];
                            Ext.each(todosrows, function(record) {
                                if (Ext.isDate(record.data.fechainicio)) {
                                    fechaI = record.data.fechainicio.format('d/m/Y');
                                } else {
                                    fechaI = record.data.fechainicio;
                                }
                                if (fechaI <= fechaF) {
                                    mostrarMensaje(1, 'Por favor verifique, el inicio del desglose debe ser posterior al fin del anterior desglose realizado.');
                                    rangoinc += 1;
                                }

                                if (Ext.isDate(record.data.fechafin)) {
                                    fechaF = record.data.fechafin.format('d/m/Y');
                                } else {
                                    fechaF = record.data.fechafin;
                                }
                                if (fechaI <= fechaF) {
                                    recordsEnviar.push(Ext.apply(record.data));
                                } else {
                                    mostrarMensaje(1, 'Por favor verifique, existen campos con rangos de fechas incorrectas.');
                                    rangoinc += 1;
                                }
                            });
                            if (rangoinc == 0) {
                                Ext.getCmp('gpDesgloseFecha').stopEditing();
                                Ext.Ajax.request({
                                    url: 'guardarDesgloses',
                                    params: {
                                        idactividad: Ext.getCmp('gpNivelesActividad').getSelectionModel().getSelected().data.idactividad,
                                        identidad: identidadselected,
                                        idejercicio: cmbEjercicio.getValue(),
                                        desgloses: Ext.encode(recordsEnviar)
                                    },
                                    callback: function(options, success, response) {
                                        responseData = Ext.decode(response.responseText);
                                        if (responseData.codMsgG == 24) {
                                            recordSelected = Ext.getCmp('gpNivelesActividad').getSelectionModel().getSelections();
                                            mostrarMensaje(1, 'El(Los) desglose(s) se ha(n) guardado satisfactoriamente.');
                                            Ext.getCmp('btnguardar').disable();
                                            {
                                                for (i = 0; i < Ext.getCmp('gpDesgloseFecha').getStore().getCount(); i++) {
                                                    Ext.getCmp('gpDesgloseFecha').getStore().getAt(i).commit();
                                                }
                                                Ext.getCmp('gpNivelesActividad').getStore().reload();
                                            }
                                        } else {
                                            mostrarMensaje(3, responseData.mensaje);
                                        }
                                    }
                                });
                            }
                        }
                        barra.hide();
                    }
                }
            }
        },
        formatDate: function(value) {
            if (value == null || value == "")
                return 'Sin fecha'
            else {
                if (value.length > 10) {
                    var dt = new Date(value.substring(0, 4), parseInt(value.substring(5, 7)) - 1, value.substring(8, 10));
                    return dt.format('d-m-Y');
                } else {
                    var dt = new Date(value);
                    return dt.format('d-m-Y');
                }
            }
        }
    })
    mpanel = new Ext.desglosefecha.mainPanel();
    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: [mpanel]
    });
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'iI',
            alt: true,
            fn: function() {
                mpanel.comprobarSeleccion('adicionar');
            }
        }, {
            key: 'gG',
            alt: true,
            fn: function() {
                mpanel.comprobarSeleccion('guardar');
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function() {
                mostrarAyuda();
            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function() {
                gridNivelesfilter.clearFilters();
            }
        }
    ]);

    teclascalientes = new Ext.KeyMap(Ext.getBody(), [
        {
            key: 'Ee',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function(_this) {
                if (!Ext.getCmp('btnExportar').disabled) {
                    Ext.getCmp('btnExportar').handler.call(this);
                }
            }
        }

    ]);
    teclascalientes.enable();
}

function mostrarAyuda(referencia, title) {
    var title = perfil.etiquetas.lbTituloAyudaDesglose;
    var referencia = 'Desglose de actividades por fecha';
    help.show(title, referencia);
}

function exportar(params) {
    window.open("exportar?identidad=" + params.identidad + "&glob=" + params.glob + "&is_leaf=" + params.is_leaf + "&idejercicio=" + params.idejercicio + "&idEstructuraPadre=" + params.idEstructuraPadre + "&esrector=" + params.esrector + "&filtros=" + params.filtros);
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function crearToolTipTipo(v, m) {
    if (v == 1) {
        m.attr = 'ext:qtip="Bases para el plan"';
        return "Bases para el plan";
    }
    if (v == 2) {
        m.attr = 'ext:qtip="Inversión"';
        return "Inversión";
    }
    if (v == 3) {
        m.attr = 'ext:qtip="Proyecto"';
        return "Proyecto";
    }
}

function formatDate(value) {
    if (Ext.isDate(value)) {
        return value.format('d/m/Y');
    } else {
        return value;
    }
}
function controlarConfDesg(sm) {
    elim = true;
    sels = sm.getSelections();
    for (var i = 0; i < sels.length; i++) {
        if (sels[i].data.tipo != 1) {
            elim = false;
            break;
        }
    }
    if (elim)
        Ext.getCmp('btneliminar').enable();
    else
        Ext.getCmp('btneliminar').disable();

    if (sm.getSelections().length == 1) {
        if (sm.getSelected().data.tipo != 1) {
            Ext.getCmp('gpDesgloseFecha').getColumnModel().setEditable(Ext.getCmp('gpDesgloseFecha').getColumnModel().findColumnIndex('nivelactividad'), false);
            Ext.getCmp('gpDesgloseFecha').getColumnModel().setEditable(Ext.getCmp('gpDesgloseFecha').getColumnModel().findColumnIndex('fechainicio'), false);
            Ext.getCmp('gpDesgloseFecha').getColumnModel().setEditable(Ext.getCmp('gpDesgloseFecha').getColumnModel().findColumnIndex('fechafin'), false);
        }
        else {
            Ext.getCmp('gpDesgloseFecha').getColumnModel().setEditable(Ext.getCmp('gpDesgloseFecha').getColumnModel().findColumnIndex('nivelactividad'), true);
            Ext.getCmp('gpDesgloseFecha').getColumnModel().setEditable(Ext.getCmp('gpDesgloseFecha').getColumnModel().findColumnIndex('fechainicio'), true);
            Ext.getCmp('gpDesgloseFecha').getColumnModel().setEditable(Ext.getCmp('gpDesgloseFecha').getColumnModel().findColumnIndex('fechafin'), true);
        }
    }
}
