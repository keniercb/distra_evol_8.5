var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
var filasActv = -1;
perfil.etiquetas = {};
//***************variables****************
var recordSelected, identidadselected, idEstructuraPadre, is_leaf, maxvalue = 0, teclascalientes, offset = 0, offsetD = 0;
var esRector = false;
var adicionIndic = false;
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
});
UCID.portal.cargarEtiquetas('desgloseindicadoresporfecha', cargarInterfaz);
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
        disabled: true,
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function() {
                stPlanes.baseParams.identidad = identidadselected;
                stPlanes.baseParams.idejercicio = cmbEjercicio.getValue();
                stPlanes.baseParams.isLeaf = esHoja;
                stPlanes.baseParams.glob = Ext.getCmp('chkglobalDI').getValue();
                stPlanes.load();
                filasActv = -1;
                Ext.getCmp('gpDesgloseFecha').getStore().removeAll();
                Ext.getCmp('gpDesgloseFecha').hide();
                Ext.getCmp('gpDesgloseFecha').collapse();
                Ext.getCmp('gpIndicadores').getStore().reload();
                viewport.render();

            }
        }
    });
    //Creo los filtros de los grids
    gridsIndfilter = new Ext.grid.GridFilters({
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
                dataIndex: 'cantidad'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadpordesglozar'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadreal'
            }]
    });
    gridDesglosefilter = new Ext.grid.GridFilters({
        filters: [{
                type: 'numeric',
                dataIndex: 'cantidad'
            }, {
                type: 'date',
                dataIndex: 'fechainicio'
            }, {
                type: 'date',
                dataIndex: 'fechafin'
            }]
    });
    //panel principal
    //------------ Planes -----------------------
    stPlanes = new Ext.data.Store({
        url: 'listarModelos',
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
                name: 'idmodelo'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function(st, rec, obj) {
                if (st.getCount() != 0) {
                    cmbPlanes.setValue(st.data.items[0].data.idmodelo);
                    Ext.getCmp('idplaness').enable();
                    filasActv = -1;
                    Ext.getCmp('gpDesgloseFecha').getStore().removeAll();
                    Ext.getCmp('gpDesgloseFecha').hide();
                    Ext.getCmp('gpDesgloseFecha').collapse();
                    Ext.getCmp('gpIndicadores').getStore().reload();
                    viewport.render();
                    Ext.getCmp('btnExportar').enable();
                } else {
                    mostrarMensaje(1, 'La entidad seleccionada no posee indicadores planificados.');
                    cmbPlanes.clearValue();
                    cmbPlanes.disable();
                    Ext.getCmp('gpIndicadores').getStore().removeAll();
                }
            }
        }
    });

    cmbPlanes = new Ext.form.ComboBox({
        width: 150,
        id: 'idplaness',
        store: stPlanes,
        displayField: 'denominacion',
        valueField: 'idmodelo',
        typeAhead: true,
        mode: 'local',
        disabled: true,
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        listeners: {
            select: function() {
                filasActv = -1;
                Ext.getCmp('gpDesgloseFecha').getStore().removeAll();
                Ext.getCmp('gpDesgloseFecha').hide();
                Ext.getCmp('gpDesgloseFecha').collapse();
                Ext.getCmp('gpIndicadores').getStore().reload();
                viewport.render();
                Ext.getCmp('btnExportar').enable();
            }
        },
        allowBlank: false
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
            Ext.getCmp('gpIndicadores').enable();
            Ext.getCmp('btnExportar').enable();
            cmbPlanes.enable();
            cmbEjercicio.enable();
            this.getSelectionModel().select(n);
            identidadselected = n.id;
            idEstructuraPadre = n.attributes.idEstructuraPadre;
            is_leaf = n.leaf;
            if (is_leaf) {
                Ext.getCmp('chkglobalDI').hide();
                esHoja = 1;
            }
            else {
                Ext.getCmp('chkglobalDI').show();
                esHoja = 0;
            }
            stPlanes.baseParams.identidad = identidadselected;
            stPlanes.baseParams.idejercicio = cmbEjercicio.getValue();
            stPlanes.baseParams.isLeaf = is_leaf;
            stPlanes.baseParams.glob = Ext.getCmp('chkglobalDI').getValue();
            stPlanes.load();
        } else {
            Ext.getCmp('chkglobalDI').hide();
            tmpGpIndicadores = Ext.getCmp('gpIndicadores');
            tmpGpIndicadores.disable();
            Ext.getCmp('btnExportar').disable();
            cmbPlanes.clearValue();
            cmbPlanes.disable();
            cmbEjercicio.disable();
            var store = tmpGpIndicadores.getStore();
            store.loadData({"data":[],"total":0});
        }
    });

    Ext.desglosefecha.mainPanel = Ext.extend(Ext.Panel, {
        layout: 'border',
        initComponent: function() {
            var self = this;
            self.tbar = [{
                    id: 'btnExportar',
                    iconCls: 'exportar',
                    disabled: true,
                    tooltip: 'Exportar desglose por fecha <b>(Alt + E)</b>',
                    handler: function() {
                        exportar({
                            idejercicio: cmbEjercicio.getValue(),
                            idEstructuraPadre: idEstructuraPadre,
                            esrector: esRector,
                            identidad: identidadselected,
                            is_leaf: is_leaf,
                            filtros: Ext.encode(gridsIndfilter.getFilterData()),
                            glob: Ext.getCmp('chkglobalDI').getValue()
                        });
                    }
                }, '-', 'Ejercicio:  ', cmbEjercicio, '-', {
                    xtype: 'checkbox',
                    boxLabel: 'Global',
                    hidden: true,
                    id: 'chkglobalDI',
                    listeners: {
                        check: function(ck, t) {
                            stPlanes.baseParams.identidad = identidadselected;
                            stPlanes.baseParams.idejercicio = cmbEjercicio.getValue();
                            stPlanes.baseParams.isLeaf = esHoja;
                            stPlanes.baseParams.glob = Ext.getCmp('chkglobalDI').getValue();
                            stPlanes.load();
                        }
                    }
                }, '->', {
                    id: 'idAyudaDesglose',
                    iconCls: 'ayuda',
                    text: perfil.etiquetas.lbTtBtnAy,
                    tooltip: perfil.etiquetas.lbTtBtnAyuda
                }],
            self.items = [{
                    xtype: 'panel',
                    title: 'Entidades',
                    id: 'pMultiEnt',
                    region: 'west',
                    width: 220,
                    frame: false,
                    layout: 'fit',
                    collapsible: true,
                    titleCollapse: true,
                    split: true,
                    items: [trEnt]
                }, {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'border',
                    tbar: ['Planes :', cmbPlanes],
                    items: [{
                            xtype: 'grid',
                            id: 'gpIndicadores',
                            title: 'Demanda de indicadores',
                            frame: true,
                            region: 'center',
                            plugins: gridsIndfilter,
                            loadMask: {
                                msg: 'Cargando...'
                            },
                            autoExpandColumn: 'expandir',
                            sm: new Ext.grid.RowSelectionModel({
                                singleSelect: true,
                                listeners: {
                                    rowselect: function(sm, rowIndex, rec) {
                                        filasActv = rowIndex;
                                        if (Ext.getCmp('chkglobalDI').getValue() == false || is_leaf) {
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
                                    tooltip: 'Código del indicador',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Denominación',
                                    dataIndex: 'denominacion',
                                    sortable: true,
                                    id: 'expandir',
                                    tooltip: 'Denominación del indicador',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Cantidad planificada',
                                    dataIndex: 'cantidad',
                                    sortable: true,
                                    align: 'right',
                                    width: 180,
                                    tooltip: 'Cantidad planificada',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Cantidad desglosada',
                                    align: 'right',
                                    sortable: true,
                                    width: 180,
                                    dataIndex: 'cantidadreal',
                                    tooltip: 'Cantidad desglosada',
                                    renderer: crearToolTip
                                }, {
                                    header: 'Cantidad por desglosar',
                                    dataIndex: 'cantidadpordesglozar',
                                    sortable: true,
                                    align: 'right',
                                    width: 180,
                                    tooltip: 'Cantidad por desglosar',
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
                                url: 'listarIndicadores',
                                reader: new Ext.data.JsonReader({
                                    root: 'data',
                                    totalProperty: 'total'
                                }, [{
                                        name: 'idplanificacion'
                                    }, {
                                        name: 'codigo'
                                    }, {
                                        name: 'denominacion'
                                    }, {
                                        name: 'cantidad'
                                    }, {
                                        name: 'cantidadreal'
                                    }, {
                                        name: 'cantidadpordesglozar'
                                    }]),
                                listeners: {
                                    load: function(st, rec, obt) {
                                        if (st.getCount() == 0) {
                                            if (gridsIndfilter.getFiltrosActivos() == undefined || gridsIndfilter.getFiltrosActivos().length == 0) {
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
                                            Ext.getCmp('gpIndicadores').getSelectionModel().selectRow(filasActv);
                                        }
                                    },
                                    beforeload: function(st, opt) {
                                        mpanel.changeNivelGridTitle();
                                        st.baseParams.start = offset;
                                        st.baseParams.idejercicio = cmbEjercicio.getValue();
                                        st.baseParams.idEstructuraPadre = idEstructuraPadre;
                                        st.baseParams.esrector = esRector;
                                        st.baseParams.identidad = identidadselected;
                                        st.baseParams.esHoja = is_leaf;
                                        st.baseParams.idmodelo = cmbPlanes.getValue();
                                        st.baseParams.glob = Ext.getCmp('chkglobalDI').getValue();
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
                                            gridsIndfilter.clearFilters();
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
                            split: true,
                            frame: true,
                            hidden: true,
                            height: 350,
                            plugins: gridDesglosefilter,
                            region: 'south',
                            loadMask: {
                                msg: 'Cargando...'
                            },
                            autoExpandColumn: 'expandir',
                            sm: new Ext.grid.RowSelectionModel({
                                singleSelect: false,
                                listeners: {
                                    rowselect: function() {
                                        Ext.getCmp('btneliminar').enable();
                                    },
                                    rowdeselect: function(a, b, c) {
                                        Ext.getCmp('btneliminar').disable();
                                    }
                                }
                            }),
                            columns: [{
                                    header: 'Nivel',
                                    dataIndex: 'cantidad',
                                    id: 'expandir',
                                    tooltip: 'Indicador planificado',
                                    sortable: false,
                                    renderer: crearToolTip,
                                    editor: new Ext.form.NumberField({
                                        allowBlank: false,
                                        allowNegative: false
                                    })
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
                                        allowBlank: false,
                                        value: new Date()
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
                                        allowBlank: false,
                                        value: new Date()
                                    }),
                                    renderer: formatDate
                                }],
                            tbar: [{
                                    iconCls: 'adicionar',
                                    id: 'btnadicionar',
                                    tooltip: 'Adicionar desglose <b>(Alt+I)</b>',
                                    handler: function() {
                                        Ext.getCmp('btnguardar').enable();
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
                                    id: 'idplanificacionporfecha',
                                    totalProperty: 'total'
                                }, [{
                                        name: 'idplanificacionporfecha'
                                    }, {
                                        name: 'cantidad'
                                    }, {
                                        name: 'fechainicio'
                                    }, {
                                        name: 'fechafin'
                                    }
                                ]),
                                listeners: {
                                    load: function(st, re, o) {
                                        Ext.getCmp('btnguardar').disable();
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
                                        st.baseParams.idplanificacion = Ext.getCmp('gpIndicadores').getSelectionModel().getSelected().data.idplanificacion;
                                        st.baseParams.start = offsetD;
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
                                        offsetD = e.start;
                                    }
                                }
                            })
                        }]
                }]
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
            if (gridsIndfilter.getFiltrosActivos() == undefined
                    || gridsIndfilter.getFiltrosActivos().length == 0) {
                Ext.getCmp('gpIndicadores').setTitle('Demanda de indicadores');
            } else {
                for (i = 0; i < gridsIndfilter.getFiltrosActivos().length; i++) {
                    var aux = "";
                    if (gridsIndfilter.getFiltrosActivos()[i].dataIndex == "codigo") {
                        aux = 'Código';
                    } else if (gridsIndfilter.getFiltrosActivos()[i].dataIndex == "denominacion") {
                        aux = 'Denominación';
                    } else if (gridsIndfilter.getFiltrosActivos()[i].dataIndex == "cantidad") {
                        aux = 'Nivel actividad planificado';
                    } else if (gridsIndfilter.getFiltrosActivos()[i].dataIndex == "cantidadpordesglozar") {
                        aux = 'Nivel actividad desglosado';
                    } else {
                        aux = 'Nivel actividad por desglosar';
                    }
                    if (i == gridDesglosefilter.getFiltrosActivos().length - 1) {
                        sep = "";
                    }
                    filtrado_por += aux + sep;
                }
                Ext.getCmp('gpIndicadores').setTitle('Demanda de indicadores <i> Filtrado por: ' + filtrado_por + '</i>');
                filtrado_por = "";
            }
        },
        adicionarDesglose: function() {
            adicionIndic = true;
            Fila = Ext.data.Record.create([{
                    name: 'idplanificacionporfecha',
                    type: 'string'
                }, {
                    name: 'cantidad',
                    type: 'string'
                }, {
                    name: 'fechainicio',
                    type: 'string'
                }, {
                    name: 'fechafin',
                    type: 'string'
                }]);
            mpanel.calularsuma();
            if (parseFloat(Ext.getCmp('gpIndicadores').getSelectionModel().getSelected().data.cantidad) - parseFloat(suma) <= 0) {
                mostrarMensaje(2, 'No se puede desglozar porque se ha alcanzado el límite máximo.');
            } else {
                var p = new Fila({
                    idplanificacionporfecha: null,
                    cantidad: (parseFloat(Ext.getCmp('gpIndicadores').getSelectionModel().getSelected().data.cantidad) - parseFloat(suma)).toFixed(3),
                    fechainicio: null,
                    fechafin: null
                });
                Ext.getCmp('gpDesgloseFecha').getStore().add(p);
                Ext.getCmp('gpDesgloseFecha').getSelectionModel().selectRow(Ext.getCmp('gpDesgloseFecha').getStore().getCount() - 1);
            }
        },
        calularsuma: function() {
            suma = 0;
            for (i = 0; i < Ext.getCmp('gpDesgloseFecha').getStore().getCount(); i++) {
                suma += parseFloat(Ext.getCmp('gpDesgloseFecha').getStore().getAt(i).data.cantidad);
            }
        },
        comprobarSeleccion: function(caso) {
            if (Ext.getCmp('gpIndicadores').getSelectionModel().getSelections().length == 0) {
                mostrarMensaje(1, 'Debe seleccionar al menos un nivel de actividad.');
            } else {
                switch (caso) {
                    case 'adicionar':
                        mpanel.adicionarDesglose();
                        break;
                    case 'eliminar':
                        if (Ext.getCmp('gpDesgloseFecha').getSelectionModel().getSelections().length == 0)
                            mostrarMensaje(2, '¿Está seguro que quiere eliminar todos los desglose(s) del nivel de actividad seleccionado?', eliminarDesglose);
                        else
                            mostrarMensaje(2, '¿Está seguro que quiere eliminar el(los) desglose(s)  seleccionado(s)?', eliminarDesglose);
                        break;
                    case 'guardar':
                        mpanel.calularsuma();
                        if (parseFloat(Ext.getCmp('gpIndicadores').getSelectionModel().getSelected().data.cantidad) - parseInt(suma) < 0) {
                            mostrarMensaje(2, 'No se puede desglozar porque se ha alcanzado el límite máximo.');
                        } else
                            mostrarMensaje(2, '¿Está seguro que quiere guardar el(los) desglose(s)?', guardarDesglose);
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
                                    recordsSel[i].data.idplanificacionporfecha
                                    );
                        Ext.Ajax.request({
                            url: 'eliminarDesgloses',
                            params: {
                                desgloses: Ext.encode(desgElim),
                                idplanificacion: Ext.getCmp('gpIndicadores').getSelectionModel().getSelected().data.idplanificacion
                            },
                            callback: function(options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                if (responseData.codMsgE == 24) {
                                    recordSelected = Ext.getCmp('gpIndicadores').getSelectionModel().getSelections();
                                    mostrarMensaje(1, 'El(los) desglose(s) ha(n) sido eliminado(s) satisfactoriamente.');
                                    Ext.getCmp('gpIndicadores').getStore().reload();
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
                    adicionIndic = false;
                    var modified = [];
                    var select = [];
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
                            if (record.data.cantidad == '' || record.data.cantidad == null) {
                                nivel = true;
                            }
                        });
                        var fechaI = 0;
                        var fechaF = 0;
                        if (fechanull) {
                            mostrarMensaje(2, 'Por favor verifique, existen campos con fechas nulas.');
                        } else if (nivel) {
                            mostrarMensaje(2, 'Por favor verifique, el campo Nivel no puede ser nulo.');
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
                                Ext.getCmp('btnguardar').disable();
                                Ext.Ajax.request({
                                    url: 'guardarDesgloses',
                                    params: {
                                        idplanificacion: Ext.getCmp('gpIndicadores').getSelectionModel().getSelected().data.idplanificacion,
                                        desgloses: Ext.encode(recordsEnviar)
                                    },
                                    callback: function(options, success, response) {
                                        responseData = Ext.decode(response.responseText);
                                        if (responseData.codMsgG == 24) {
                                            recordSelected = Ext.getCmp('gpIndicadores').getSelectionModel().getSelections();
                                            mostrarMensaje(1, 'El(Los) desglose(s) se ha(n) guardado satisfactoriamente.');
                                            {
                                                for (i = 0; i < Ext.getCmp('gpDesgloseFecha').getStore().getCount(); i++) {
                                                    Ext.getCmp('gpDesgloseFecha').getStore().getAt(i).commit();
                                                }
                                                Ext.getCmp('gpIndicadores').getStore().reload();
                                            }
                                        } else {
                                            mostrarMensaje(2, responseData.mensaje);
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
                return 'Sin fecha';
            else {
                if (value.length > 10) {
                    var dt = new Date(value.substring(0, 4), parseInt(value.substring(5, 7)) - 1, value.substring(8, 10));
                    return dt.format('d-m-Y');
                } else {
                    var dt = new Date(value);
                    return dt.format('d-m-Y');
                }
            }
        },
        actualizarArbol: function(arbol, valor) {
            if (arbol.getSelectionModel().getSelectedNode() != undefined) {
                if (!arbol.getSelectionModel().getSelectedNode().leaf) {
                    arbol.getSelectionModel().getSelectedNode().reload({
                        params: {
                            valor: valor
                        }
                    });
                }
            } else {
                arbol.root.reload({
                    params: {
                        valor: valor
                    }
                });
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
            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function() {
                gridsIndfilter.clearFilters();
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

function exportar(params) {
    window.open("exportar?identidad=" + params.identidad + "&glob=" + params.glob + "&esHoja=" + params.is_leaf + "&idmodelo=" + cmbPlanes.getValue() + "&idejercicio=" + params.idejercicio + "&idEstructuraPadre=" + params.idEstructuraPadre + "&esrector=" + params.esrector + "&filtros=" + params.filtros);
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function formatDate(value) {
    if (value == null || value == "")
        return '';
    if (Ext.isDate(value)) {
        return value.format('d/m/Y');
    } else {
        fecha = value.split(" ");
        return fecha[0];
    }
}
;