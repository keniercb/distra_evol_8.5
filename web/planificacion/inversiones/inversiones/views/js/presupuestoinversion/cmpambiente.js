
Utilidades.Cmp.Cmpambiente = function(opciones) {
    var _this = this;
    this.usdposteriores = [];
    this.mpposteriores = [];
    this.arraydesglose = [];
    this.idpadre = 0;
    this.hijo = 0;
    this.BarraProgreso = new BarraEstado();
    this.checkAmbiente = new Ext.form.Checkbox({
        boxLabel: opciones.idioma.checkResumen,
        id: 'checkAmbiente',
        checked: true,
        name: opciones.idioma.checkResumen,
        handler: function(este, checked) {
            checked ? _this.fncolumnasAmbiente(1) : _this.fncolumnasAmbiente(0);
        }
    });
    this.btnDel = new Ext.Button({
        id: 'btnDel',
        disabled: true,
        text: opciones.idioma.btnEliminar,
        tooltip: opciones.idioma.btntoolDel,
        iconCls: opciones.idioma.btnEliminar,
        handler: function() {
            _this.fnEliminar();
        }
    });
    this.btnGuardarVal = new Ext.Button({
        id: 'btnGuardarVal',
        text: opciones.idioma.btnGuardar,
        tooltip: opciones.idioma.btnGuardarambiente,
        iconCls: opciones.idioma.btnGuardar,
        handler: function() {
            _this.fnGuardar('GuardarMedioAmb', false);
        }
    });
    this.btnAjustarVal = new Ext.Button({
        id: 'btnAjustarVal',
        text: 'Ajustar',
        tooltip: opciones.idioma.btnGuardarambiente,
        iconCls: 'ajustar',
        handler: function() {
            _this.fnGuardar('ajustarMedioAmb', true);
        }
    });
    this.btnAdd = new Ext.Button({
        id: 'btnAdd',
        text: 'Sector',
        tooltip: opciones.idioma.btntoolAdd,
        iconCls: opciones.idioma.btnAddicon,
        handler: function() {
            _this.addSector();
        }
    });
    this.btnAddCuenca = new Ext.Button({
        id: 'btnAddCuenca',
        text: 'Cuenca',
        tooltip: opciones.idioma.btntoolAddCuenca,
        iconCls: opciones.idioma.btnAddicon,
        disabled: true,
        handler: function() {
            _this.Gestionardatos(2);
        }
    });
    this.btnAddBahia = new Ext.Button({
        id: 'btnAddBahia',
        text: 'Bah&iacute;a',
        tooltip: opciones.idioma.btntoolAddbahia,
        iconCls: opciones.idioma.btnAddicon,
        disabled: true,
        handler: function() {
            _this.Gestionardatos(1);
        }
    });
    this.btnAddAccion = new Ext.Button({
        id: 'btnAddAccion',
        text: 'Acci&oacute;n',
        tooltip: opciones.idioma.btntoolAddAccion,
        iconCls: opciones.idioma.btnAddicon,
        disabled: true,
        handler: function() {
            _this.Gestionardatos(0);
        }
    });
    this.btnAyudaambiente = new Ext.Button({
        id: 'btnAyudaambiente',
        text: opciones.idioma.btnAyuda,
        tooltip: opciones.idioma.tlayuda,
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn'
    });
    this.btnAceptardat = new Ext.Button({
        id: 'btnAceptardat',
        text: opciones.idioma.btnAceptar,
        disabled: true,
        tooltip: opciones.idioma.btnAceptar,
        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'btn', //his.addDatos
        handler: function() {
            _this.addDatos();
        }
    });
    this.stSector = new Ext.data.Store({
        url: 'cargarSectores',
        //  autoLoad: true,
        reader: new Ext.data.JsonReader({
            //id: 'idmoneda',
            root: 'data'
        }, [{
                name: 'dato'
            }, {
                name: 'idmedioambglobal'
            }, {
                name: 'iddatosnomenclador'
            }
        ])
    });
    this.stCuenca = new Ext.data.Store({
        url: 'cargarCuencas',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: "total"
        }, [{
                name: 'dato'
            }, {
                name: 'idmedioambglobal'
            }, {
                name: 'iddatosnomenclador'
            }
        ])
    });
    this.stBahia = new Ext.data.Store({
        url: 'cargarBahias',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'dato'
            }, {
                name: 'idmedioambglobal'
            }, {
                name: 'iddatosnomenclador'
            }
        ])
    });
    this.stAcciones = new Ext.data.Store({
        url: 'cargarAcciones',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'dato'
            }, {
                name: 'idmedioambglobal'
            }, {
                name: 'iddatosnomenclador'
            }
        ])
    });
    this.smacciones = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, row, record) {
                if (sm.getSelections().length > 0 && typeof (_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal) != 'undefined') {
                    _this.btnAceptardat.enable();
                } else if (sm.getSelections().length === 0) {
                    _this.btnAceptardat.disable();
                }
            }, rowdeselect: function(sm, row, record) {
                if (sm.getSelections().length > 0 && typeof (_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal) != 'undefined') {
                    _this.btnAceptardat.enable();
                } else if (sm.getSelections().length === 0) {
                    _this.btnAceptardat.disable();
                }
            }
        }
    });
    this.smbahias = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, row, record) {
                if (sm.getSelections().length > 0 && typeof (_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal) != 'undefined') {
                    _this.btnAceptardat.enable();
                } else if (sm.getSelections().length === 0) {
                    _this.btnAceptardat.disable();
                }
            }, rowdeselect: function(sm, row, record) {
                if (sm.getSelections().length > 0 && typeof (_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal) != 'undefined') {
                    _this.btnAceptardat.enable();
                } else if (sm.getSelections().length === 0) {
                    _this.btnAceptardat.disable();
                }
            }
        }
    });
    this.smCuencas = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, row, record) {
                if (sm.getSelections().length > 0 && typeof (_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal) != 'undefined') {
                    _this.btnAceptardat.enable();
                } else if (sm.getSelections().length === 0) {
                    _this.btnAceptardat.disable();
                }
            }, rowdeselect: function(sm, row, record) {
                if (sm.getSelections().length > 0 && typeof (_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal) != 'undefined') {
                    _this.btnAceptardat.enable();
                } else if (sm.getSelections().length === 0) {
                    _this.btnAceptardat.disable();
                }
            }
        }
    });
    this.gridCuencas = new Ext.grid.EditorGridPanel({
        frame: true,
        autoWidth: true,
        height: 600,
        id: 'gpCuenca',
        border: false,
        autoScroll: true,
        disable: false,
        region: 'center',
        enableKeyEvents: true,
        store: _this.stCuenca,
        sm: _this.smCuencas,
        cm: new Ext.grid.ColumnModel([{
                header: opciones.idioma.tlDenom,
                id: 'denominacion',
                width: 600,
                sortable: true,
                dataIndex: 'dato'
            }]),
        loadMask: {
            store: _this.stCuenca
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'idptcuenca',
            store: _this.stCuenca,
            displayInfo: true
                    //   items: ['-', _this.btnLimpiarE]
        })
    });
    this.gridBahias = new Ext.grid.EditorGridPanel({
        frame: true,
        autoWidth: true,
        height: 600,
        border: false,
        autoScroll: true,
        disable: false,
        region: 'center',
        enableKeyEvents: true,
        store: _this.stBahia,
        sm: _this.smbahias,
        cm: new Ext.grid.ColumnModel([/*{
         header: idioma.tlcodigo,
         id: 'codigo',
         width: 100,
         sortable: true,
         dataIndex: 'codigo'
         },*/ {
                header: opciones.idioma.tlDenom,
                id: 'denominacion',
                width: 400,
                sortable: true,
                dataIndex: 'dato'
            }]),
        loadMask: {
            store: _this.stBahia
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'idptbahia',
            store: _this.stBahia,
            displayInfo: true
                    //   items: ['-', _this.btnLimpiarE]
        })
    });
    this.gridaccion = new Ext.grid.EditorGridPanel({
        frame: true,
        autoWidth: true,
        height: 600,
        border: false,
        autoScroll: true,
        disable: false,
        region: 'center',
        enableKeyEvents: true,
        store: _this.stAcciones,
        sm: _this.smacciones,
        cm: new Ext.grid.ColumnModel([/*{
         header: idioma.tlcodigo,
         id: 'codigo',
         width: 100,
         sortable: true,
         dataIndex: 'codigo'
         },*/ {
                header: opciones.idioma.tlDenom,
                id: 'denominacion',
                width: 400,
                sortable: true,
                dataIndex: 'dato'
            }]),
        loadMask: {
            store: _this.stAcciones
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'idptaccion',
            store: _this.stAcciones,
            displayInfo: true
                    //   items: ['-', _this.btnLimpiarE]
        })
    });

    this.pAccion = new Ext.Panel({
        frame: true,
        layout: 'border',
        region: 'center',
        border: false,
        items: [_this.gridaccion]
    });
    this.pCuenca = new Ext.Panel({
        frame: true,
        layout: 'border',
        region: 'center',
        border: false,
        items: [_this.gridCuencas]
    });
    this.pBahia = new Ext.Panel({
        frame: true,
        layout: 'border',
        region: 'center',
        border: false,
        items: [_this.gridBahias]
    });

    this.tabsDatSector = new Ext.TabPanel({
        activeTab: 0,
        id: 'tabsDatSector',
        region: 'center',
        items: [{
                title: 'Acciones',
                id: 'idAcc',
                activeTab: 0,
                layout: 'border',
                items: [_this.pAccion],
                listeners: {
                    activate: function() {
                        //  fnLevTPresupuesto();
                    }
                }
            }, {
                title: 'Bah&iacute;as',
                id: 'idBahi',
                activeTab: 1,
                layout: 'border',
                items: [_this.pBahia],
                listeners: {
                    activate: function() {
                        //fnLevTfinanciamiento();
                    }
                }
            }, {
                title: 'Cuencas',
                id: 'idCuen',
                activeTab: 2,
                layout: 'border',
                items: [_this.pCuenca],
                listeners: {
                    activate: function() {
                        //   fnLevTEquipos();
                    }
                }
            }]
    });
    this.winAddDatos = new Ext.Window({
        closable: true,
        title: opciones.idioma.titleDatos,
        width: 600,
        height: 630,
        resizable: false,
        modal: true,
        border: false,
        layout: 'border',
        closeAction: 'hide',
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: 'Cerrar',
                tooltip: 'Cerrar la ventana',
                handler: function() {
                    _this.winAddDatos.hide();
                }
            }, _this.btnAceptardat],
        items: [_this.tabsDatSector]
    });


    _this.cmAmbiente = new Ext.grid.ColumnModel([
        {width: 10, dataIndex: 'vacia', align: 'left', sortable: true, resizable: false},
        {width: 300, dataIndex: 'denominacion',id: 'expandir', align: 'left', renderer: rendeSector, editor: new Ext.form.ComboBox({
                id: 'idcolsector',
                mode: 'local',
                width: 300,
                triggerAction: 'all',
                allowBlank: false,
                emptyText: opciones.idioma.tlSeleccione,
                valueField: 'iddatosnomenclador',
                displayField: 'dato',
                store: _this.stSector
            }), sortable: true, resizable: false
        },
        {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
        {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
        {width: 80, dataIndex: 'ejecutadomp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero,resizable: false},
        {width: 80, dataIndex: 'ejecutadousd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero,resizable: false},
        {width: 80, dataIndex: 'estimadomp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero,resizable: false},
        {width: 80, dataIndex: 'estimadousd2', align: 'left', editor: new Ext.form.NumberField({}), renderer: _this.valorCero,summaryType: 'sum', resizable: false},
        {width: 80, dataIndex: 'planmp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
        {width: 80, dataIndex: 'planusd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
        {width: 80, dataIndex: 'proyecmp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
        {width: 80, dataIndex: 'proyecusd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
        {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: _this.annosPosterioresMp, resizable: false},
        {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: _this.annosPosterioresUsd, resizable: false}
    ]);
    _this.cmAmbiente.headers = [
        [
            {header: '', rowspan: 4}, 
            {header: 'Sector ambiental', rowspan: 4}, 
            {header: 'Presupuesto', rowspan: 3, colspan: 2}
        ],[
            {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 2}, 
            {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 2}, 
            {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 2}, 
            {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 2}, 
            {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}
        ],[
            {align: 'left', header: opciones.idioma.cmejecutadohasta, colspan: 2},
            {align: 'left', header: opciones.idioma.estimado, colspan: 2},
            {align: 'left', header: opciones.idioma.cmplan, colspan: 2},
            {align: 'left', header: opciones.idioma.cmproyecc, colspan: 2}
        ],[
            {align: 'left', header: opciones.idioma.cmmp},
            {align: 'left', header: opciones.idioma.cmusd},
            {align: 'left', header: opciones.idioma.cmmp},
            {align: 'left', header: opciones.idioma.cmusd},
            {align: 'left', header: opciones.idioma.cmmp},
            {align: 'left', header: opciones.idioma.cmusd},
            {align: 'left', header: opciones.idioma.cmmp},
            {align: 'left', header: opciones.idioma.cmusd},
            {align: 'left', header: opciones.idioma.cmmp},
            {align: 'left', header: opciones.idioma.cmusd},
            {align: 'left', header: opciones.idioma.cmmp},
            {align: 'left', header: opciones.idioma.cmusd}
        ]
    ];
    this.stAmbiente = new Ext.ux.maximgb.treegrid.AdjacencyListStore/*new Ext.data.Store*/({
        url: 'cargarAmbiente',
        //  autoLoad: true,
        reader: new Ext.data.JsonReader(
                {
                    root: "data",
                    totalProperty: 'total',
                    id: 'idmedioambglobal'
                            /*id: 'idtiponomenclador',
                             totalProperty: 'total',
                             root: "data",
                             usdpresp: "usdpresp",
                             usddesg: "usddesg",
                             mpdesg: "mpdesg",
                             _parent: "_parent",
                             _is_leaf: "_is_leaf"*/
                },
        [{name: 'idmedioambglobal'},
            {name: 'denominacion'},
            {name: '_parent'},
            {name: '_is_leaf'},
            {name: 'ejecutadousd1'},
            {name: 'ejecutadomp1'},
            {name: 'ejecutadousd2'},
            {name: 'ejecutadomp2'},
            {name: 'ejecutadousd3'},
            {name: 'ejecutadomp3'},
            {name: 'ejecutadousd4'},
            {name: 'ejecutadomp4'},
            {name: 'estimadousd1'},
            {name: 'estimadomp1'},
            {name: 'estimadousd2'},
            {name: 'estimadomp2'},
            {name: 'estimadousd3'},
            {name: 'estimadomp3'},
            {name: 'estimadousd4'},
            {name: 'estimadomp4'},
            {name: 'planusd1'},
            {name: 'planmp1'},
            {name: 'planusd2'},
            {name: 'planmp2'},
            {name: 'planusd3'},
            {name: 'planmp3'},
            {name: 'planusd4'},
            {name: 'planmp4'},
            {name: 'proyecusd1'},
            {name: 'proyecmp1'},
            {name: 'proyecusd2'},
            {name: 'proyecmp2'},
            {name: 'proyecusd3'},
            {name: 'proyecmp3'},
            {name: 'proyecusd4'},
            {name: 'proyecmp4'},
            {name: 'mpposterior'},
            {name: 'usdposterior'},
            {name: 'proyecusd4'},
            {name: 'proyecmp4'},
            {name: 'mpposterior'},
            {name: 'idejecutado'},
            {name: 'idmedioambplanusd1'},
            {name: 'idmedioambplanmp1'},
            {name: 'idmedioambplanusd2'},
            {name: 'idmedioambplanmp2'},
            {name: 'idmedioambplanusd3'},
            {name: 'idmedioambplanmp3'},
            {name: 'idmedioambplanusd4'},
            {name: 'idmedioambplanmp4'},
            {name: 'idmedioambproyectadousd1'},
            {name: 'idmedioambproyectadomp1'},
            {name: 'idmedioambproyectadousd2'},
            {name: 'idmedioambproyectadomp2'},
            {name: 'idmedioambproyectadousd3'},
            {name: 'idmedioambproyectadomp3'},
            {name: 'idmedioambproyectadousd4'},
            {name: 'idmedioambproyectadomp4'},
            {name: 'idmedioambejecutadousd1'},
            {name: 'idmedioambejecutadomp1'},
            {name: 'idmedioambejecutadousd2'},
            {name: 'idmedioambejecutadomp2'},
            {name: 'idmedioambejecutadousd3'},
            {name: 'idmedioambejecutadomp3'},
            {name: 'idmedioambejecutadousd4'},
            {name: 'idmedioambejecutadomp4'},
            {name: 'idmedioambejecutado'},
            {name: 'idmedioambestimadousd1'},
            {name: 'idmedioambestimadomp1'},
            {name: 'idmedioambestimadousd2'},
            {name: 'idmedioambestimadomp2'},
            {name: 'idmedioambestimadousd3'},
            {name: 'idmedioambestimadomp3'},
            {name: 'idmedioambestimadousd4'},
            {name: 'idmedioambestimadomp4'},
            {name: 'iddatosnomencladorpadre'},
            {name: 'iddatosnomenclador'},
            {name: 'idnomenclador'},
            {name: 'mppresp'},
            {name: 'usdpresp'},
            {name: 'usddesg'},
            {name: 'mpdesg'},
            {name: 'idinversion'},
            {name: 'annospost_mp'},
            {name: 'annospost_usd'},
            {name: 'sumapresp_mp'},
            {name: 'sumapresp_usd'},
            {name: 'dencuenca'},
            {name: 'denbahia'},
            {name: 'denaccion'},
            {name: 'idaccion'},
            {name: 'idcuenca'},
            {name: 'idbahia'},
            {name: 'accion'},
            {name: 'cuenca'},
            {name: 'bahia'},
            {name: 'dato'},
            {name: 'idaccion'},
            {name: 'idpresusd'},
            {name: 'idpresmp'},
            {name: 'inversion'},
            {name: 'idinversion'},
            {name: 'pad'},
            {name: 'tipo'},
            {name: 'pannom'},
            {name: 'anode'},
            {name: 'idnomenclador'}
        ]),
        listeners: {
            beforeload: function(st) {

                Ext.Ajax.timeout = 600000;
                _this.BarraProgreso.show(opciones.idioma.maskGuardarambiente);
                if (_this.smAmbiente.getSelected() && typeof (_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal) != 'undefined') {

                    if (_this.gpAmbiente.getSelectionModel().getSelected().data._parent != null) {
                        _this.idpadre = _this.smAmbiente.getSelected().data.idmedioambglobal;

                        var rec = _this.gpAmbiente.getSelectionModel().getSelected();
                        var recparent = _this.gpAmbiente.getStore().getById(rec.data._parent);
                        var arrayrec = [];
                        arrayrec.push(recparent);
                        _this.gpAmbiente.getStore().setNodeLoaded(recparent, false);
                        _this.gpAmbiente.getSelectionModel().selectRecords(arrayrec);
                        _this.gpAmbiente.getStore().expandNode(recparent);
                        _this.gpAmbiente.getStore().reload();
                    }
                    if (typeof (_this.gpAmbiente.getSelectionModel().getSelected().data._parent) != 'undefined') {
                        anode = _this.gpAmbiente.getSelectionModel().getSelected().data._parent;
                        _this.gpAmbiente.getSelectionModel().clearSelections();
                        _this.stAmbiente.reload({
                            params: {
                                anode: anode,
                                start: 0
                            }
                        });
                    }

                } else {
                    _this.idpadre = 0;
                }
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                st.baseParams.idinversion = opciones.idinversion;
                st.baseParams.identidad = opciones.identidad;
                st.baseParams.aaejercicio = opciones.ejercicio.ejercicio - 2;
                st.baseParams.aejercicio = opciones.ejercicio.ejercicio - 1;
                st.baseParams.pejercicio = (parseInt(opciones.ejercicio.ejercicio) + 1);
                st.baseParams.limit = _this.cbpaginado.getValue();
                st.baseParams.idpadre = _this.idpadre;
                st.baseParams.hijo = _this.hijo;
                st.baseParams.start = 0;
            },
            load: function(st, r, o) {
                if (!_this.smAmbiente.getSelected() && st.getCount() == 0) {
                    st.removeAll();
                }
                _this.BarraProgreso.hide();
                annpMp = parseInt(st.reader.jsonData.mppresp) - parseInt(st.reader.jsonData.mpdesg);
                annpUsd = parseInt(st.reader.jsonData.usdpresp) - parseInt(st.reader.jsonData.usddesg);
                annpMp1 = parseInt(annpMp).toFixed(2);
                annpUsd1 = parseInt(annpUsd).toFixed(2);
            }
        }
    });
    this.stpaginado = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [10, '10'],
            [20, '20'],
            [40, '40'],
            [80, '80'],
            [100, '100'],
            [200, '200'],
            [500, '500'],
            [1000, '1000']
        ]
    });
    //combo del modo donde muestro la cantidad de elementos por paginas del grid
    this.cbpaginado = new Ext.form.ComboBox({
        value: 20,
        store: _this.stpaginado,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 50,
        emptyText: opciones.idioma.etseleccionar,
        listeners: {
            select: function(cb, record, index) {
            }
        }
    });
    this.smAmbiente = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, row, record) {
                //  console.log(_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal)
                if (typeof (_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal) != 'undefined') {
                    if (sm.getSelections().length === 1 && _this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal == _this.gpAmbiente.getSelectionModel().getSelected().data.pad) {
                        _this.btnGuardarVal.enable();
                        _this.btnAddAccion.enable();
                        _this.btnAddBahia.enable();
                        _this.btnAddCuenca.enable();
                        _this.btnDel.enable();
                        _this.stSector.reload({
                            params: {
                                idnomencaldor: _this.smAmbiente.getSelected().data.idnomenclador,
                                idejercicio: opciones.ejercicio.idejercicio,
                                idinversion: opciones.idinversion,
                                identidad: opciones.identidad,
                                idsector: _this.smAmbiente.getSelected().data.idmedioambglobal,
                                iddatosnomencladorpadre: _this.smAmbiente.getSelected().data.iddatosnomencladorpadre
                            }
                        });

                    } else {
                        _this.btnAddAccion.disable();
                        _this.btnAddBahia.disable();
                        _this.btnAddCuenca.disable();
                    }
                } else {
                    _this.btnAddAccion.disable();
                    _this.btnAddBahia.disable();
                    _this.btnAddCuenca.disable();
                    _this.stSector.reload({
                        params: {
                            idnomencaldor: _this.smAmbiente.getSelected().data.idnomenclador,
                            idejercicio: opciones.ejercicio.idejercicio,
                            idinversion: opciones.idinversion,
                            identidad: opciones.identidad,
                            idsector: _this.smAmbiente.getSelected().data.idmedioambglobal,
                            iddatosnomencladorpadre: _this.smAmbiente.getSelected().data.iddatosnomencladorpadre
                        }
                    });
                }


            },
            rowdeselect: function(sm, row, record) {
                if (sm.getSelections().length === 1 && typeof (_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal) != 'undefined'
                        && _this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal == _this.gpAmbiente.getSelectionModel().getSelected().data.pad) {
                    _this.btnAddAccion.enable();
                    _this.btnAddBahia.enable();
                    _this.btnAddCuenca.enable();
                    _this.stSector.reload({
                        params: {
                            idnomencaldor: _this.smAmbiente.getSelected().data.idnomenclador,
                            idejercicio: opciones.ejercicio.idejercicio,
                            idinversion: opciones.idinversion,
                            identidad: opciones.identidad,
                            idsector: _this.smAmbiente.getSelected().data.idmedioambglobal,
                            iddatosnomencladorpadre: _this.smAmbiente.getSelected().data.iddatosnomencladorpadre
                        }
                    });

                } else if (sm.getSelections().length > 1) {
                    _this.btnAddAccion.disable();
                    _this.btnAddBahia.disable();
                    _this.btnAddCuenca.disable();
                } else {
                    _this.btnAddAccion.disable();
                    _this.btnAddBahia.disable();
                    _this.btnAddCuenca.disable();
                }

            }
        }
    });
    this.gpAmbiente = new Ext.ux.maximgb.treegrid.GridPanel({
        //master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        frame: true,
        root_title: 'sectores',
        width: 70,
        region: 'center',
        stripeRows: true,
        store: _this.stAmbiente,
        viewConfig: {
            getRowClass: function(record, index) {
                if (record.data.sumapresp_mp < 0 || record.data.sumapresp_usd < 0) {
                    //  if (_this.mpposteriores[index] < 0 || _this.usdposteriores[index] < 0) {
                    return  'superior';
                }
                else {
                    return '';
                }
            }
            /* getRowClass: function(record, index) {
             if ((_this.mpposteriores[index] < 0 || _this.usdposteriores[index] < 0) || (_this.arraydesglose[0] > parseFloat(record.data.sumapresp_mp) || _this.arraydesglose[1] > parseFloat(record.data.sumapresp_usd))) {
             return  'superior';
             }
             else {
             return '';
             }
             if (_this.stAmbiente.getRange().length > 0) {
             if (record.data._parent == null) {
             return  'subrayar';
             }
             else {
             return '';
             }
             }
             
             
             }*/
        },
        tbar: [_this.btnAdd, _this.btnAddAccion, _this.btnAddBahia, _this.btnAddCuenca, _this.btnDel, _this.btnGuardarVal, _this.btnAjustarVal, '->', _this.checkAmbiente, '-', _this.btnAyudaambiente],
        plugins: [new Ext.ux.plugins.XGrid()/*, new Ext.grid.GridSummary()*/],
        listeners: {
            click: function() {
            },
            focus: function() {

            },
            afteredit: function(objeto) {
            },
            contextmenu: function(node, e) {
            },
            rowcontextmenu: function(g, r, e) {
               /* e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());*/
            }
        },
        loadMask: {
            msg: opciones.idioma.maskGuardarambiente
        },
        cm: _this.cmAmbiente,
        sm: _this.smAmbiente,
        bbar: new Ext.PagingToolbar({
            pageSize: _this.cbpaginado.getValue(),
            id: 'idpgambiente',
            store: _this.stAmbiente,
            displayInfo: true,
            items: ['-', opciones.idioma.pgResultados, _this.cbpaginado]
        })
    });
    this.pgAmbiente = new Ext.PagingToolbar({
        pageSize: _this.cbpaginado.getValue(),
        store: _this.stAmbiente,
        width: 400,
        displayInfo: true
    });
    this.pAmbiente = new Ext.Panel({
        layout: 'border',
        region: 'center',
        border: false,
        frame: true,
        items: [_this.gpAmbiente]
    });
    this.fncolumnasAmbiente = function(accion)
    {
        if (accion === 0)
        {
            _this.cmAmbiente = new Ext.grid.ColumnModel([
                {width: 10, dataIndex: 'vacia', id: 'expandir', align: 'left', sortable: true, resizable: false},
                {width: 300, dataIndex: 'denominacion', align: 'left', renderer: rendeSector, editor: new Ext.form.ComboBox({
                        id: 'idsector',
                        mode: 'local',
                        width: 300,
                        triggerAction: 'all',
                        allowBlank: false,
                        maskRe: /^([a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ_-]+ ?[a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ _-]*)+$/,
                        maskRegex: /^([a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ_-]+ ?[a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ _-]*)+$/,
                        regex: /^([a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ_-]+ ?[a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ _-]*)+$/,
                        regexText: 'Este campo es obligatorio',
                        emptyText: opciones.idioma.tlSeleccione,
                        valueField: 'iddatosnomenclador',
                        displayField: 'dato',
                        store: _this.stSector
                    }), sortable: true, resizable: false},
                {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutadomp1', align: 'left', summaryType: 'sum',editor: new Ext.form.NumberField({}), renderer: _this.valorCero,resizable: false},
                {width: 80, dataIndex: 'ejecutadousd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'estimadomp1', align: 'left', summaryType: 'sum',editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'estimadousd1', align: 'left', summaryType: 'sum',  editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'planmp1', align: 'left', summaryType: 'sum',  resizable: false,renderer: _this.valorCero},
                {width: 80, dataIndex: 'planusd1', align: 'left', summaryType: 'sum', resizable: false,renderer: _this.valorCero},
                {width: 80, dataIndex: 'proyecmp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'proyecusd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutadomp2', align: 'left', summaryType: 'sum',editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutadousd2', align: 'left', summaryType: 'sum',editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'estimadomp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'estimadousd2', align: 'left', summaryType: 'sum',editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'planmp2', align: 'left', summaryType: 'sum',  resizable: false,renderer: _this.valorCero},
                {width: 80, dataIndex: 'planusd2', align: 'left', summaryType: 'sum', resizable: false,renderer: _this.valorCero},
                {width: 80, dataIndex: 'proyecmp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'proyecusd2', align: 'left', summaryType: 'sum',editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutadomp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutadousd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'estimadomp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'estimadousd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'planmp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'planusd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'proyecmp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'proyecusd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutadomp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutadousd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'estimadomp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'estimadousd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'planmp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'planusd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'proyecmp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'proyecusd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: _this.annosPosterioresMp, resizable: false},
                {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: _this.annosPosterioresUsd, resizable: false}
            ]);
            _this.cmAmbiente.headers = [
                [{header: '', rowspan: 4}, {header: 'Sector ambiental', rowspan: 4}, {header: 'Presupuesto', rowspan: 3, colspan: 2}],
                [
                    {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 8}, 
                    {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 8}, 
                    {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 8}, 
                    {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 8}, 
                    {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}],
                [{align: 'left', header: opciones.idioma.cmejecutadohasta, colspan: 2},
                    {align: 'left', header: opciones.idioma.estimado, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmplan, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmproyecc, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmejecutadohasta, colspan: 2},
                    {align: 'left', header: opciones.idioma.estimado, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmplan, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmproyecc, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmejecutadohasta, colspan: 2},
                    {align: 'left', header: opciones.idioma.estimado, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmplan, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmproyecc, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmejecutadohasta, colspan: 2},
                    {align: 'left', header: opciones.idioma.estimado, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmplan, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmproyecc, colspan: 2}
                ],
                [
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd}]];
        }
        else {
            _this.cmAmbiente = new Ext.grid.ColumnModel([
                {width: 10, dataIndex: 'vacia', id: 'expandir', align: 'left', sortable: true, resizable: false},
                {width: 300, dataIndex: 'denominacion', align: 'left', renderer: rendeSector, editor: new Ext.form.ComboBox({
                        id: 'idcolsector',
                        mode: 'local',
                        width: 300,
                        triggerAction: 'all',
                        allowBlank: false,
                        maskRe: /^([a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ_-]+ ?[a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ _-]*)+$/,
                        maskRegex: /^([a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ_-]+ ?[a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ _-]*)+$/,
                        regex: /^([a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ_-]+ ?[a-zA-Zá.,éí()#óú�?É�?ÓÚÑñ _-]*)+$/,
                        regexText: 'Este campo es obligatorio',
                        emptyText: opciones.idioma.tlSeleccione,
                        valueField: 'iddatosnomenclador',
                        displayField: 'dato',
                        store: _this.stSector
                    }), sortable: true, resizable: false},
                {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                    }), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutadomp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero,resizable: false},
                {width: 80, dataIndex: 'ejecutadousd1', align: 'left', summaryType: 'sum',editor: new Ext.form.NumberField({}), renderer: _this.valorCero,resizable: false},
                {width: 80, dataIndex: 'estimadomp2', align: 'left', summaryType: 'sum',editor: new Ext.form.NumberField({}), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'estimadousd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({}), renderer: _this.valorCero,resizable: false},
                {width: 80, dataIndex: 'planmp3', align: 'left', summaryType: 'sum',renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'planusd3', align: 'left', summaryType: 'sum', renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'proyecmp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                    }), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'proyecusd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                    }), renderer: _this.valorCero, resizable: false},
                {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: _this.annosPosterioresMp, resizable: false},
                {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: _this.annosPosterioresUsd, resizable: false}
            ]);
            _this.cmAmbiente.headers = [
                [{header: '', rowspan: 4}, {header: 'Sector ambiental', rowspan: 4}, {header: 'Presupuesto', rowspan: 3, colspan: 2}],
                [
                    {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 2}, 
                    {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 2}, 
                    {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 2}, 
                    {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 2}, 
                    {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}],
                [{align: 'left', header: opciones.idioma.cmejecutadohasta, colspan: 2},
                    {align: 'left', header: opciones.idioma.estimado, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmplan, colspan: 2},
                    {align: 'left', header: opciones.idioma.cmproyecc, colspan: 2}
                ],
                [
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd},
                    {align: 'left', header: opciones.idioma.cmmp},
                    {align: 'left', header: opciones.idioma.cmusd}
                ]
            ];
        }
        _this.gpAmbiente.reconfigure(_this.stAmbiente, _this.cmAmbiente);
    };
    this.valorCero = function(v) {
        valColum = !v ? 0 : v;
        return valColum;
    };
    this.fnEliminar = function() {
        var arrayDel = [];
        var recordsAcc = _this.gpAmbiente.getSelectionModel().getSelections();
        for (i = 0; i < _this.gpAmbiente.getSelectionModel().getCount(); i++) {
            arrayDel.push(recordsAcc[i].data.idmedioambglobal);
        }
        Ext.Ajax.request({
            url: 'eliminarDat',
            params: {
                datos: Ext.encode(arrayDel),
                idejercicio: opciones.ejercicio.idejercicio,
                idinversion: opciones.idinversion,
                identidad: opciones.identidad
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.codMsgDel === 1) {
                    mostrarMensaje(1, 'El(Los) dato(s) ha(n) sido eliminado(s) satisfactoriamente.');
                    _this.stAmbiente.reload({
                        /*params: {
                            anode: 0,
                            start: 0
                        }*/
                    });
                    _this.BarraProgreso.hide();
                }
            }
        });
    };
    this.fnGuardar = function(url, ajustar) {
        arraySave = new Array();
        records = _this.stAmbiente.getModifiedRecords();

        _this.stAmbiente.commitChanges();
        for (var i = 0; i < records.length; i++) {
            arraySave.push(records[i].data);
        }

        _this.BarraProgreso.show('Guardando valores...');
        Ext.Ajax.request({
            url: url,
            params: {
                datos: Ext.encode(arraySave),
                idejercicio: opciones.ejercicio.idejercicio,
                idinversion: opciones.idinversion,
                identidad: opciones.identidad,
                aaejercicio: opciones.ejercicio.ejercicio - 2,
                aejercicio: opciones.ejercicio.ejercicio - 1,
                pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
                ajustar: ajustar
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);

                if (responseData.codMsgGV === 1) {
                    mostrarMensaje(1, 'El(Los) dato(s) ha(n) sido guardado(s) satisfactoriamente.');
                    _this.stAmbiente.reload();
                    _this.BarraProgreso.hide();
                } else {
                    mostrarMensaje(1, 'Verifique que halla realizado algún cambio en los datos.');
                    _this.stAmbiente.reload();
                    _this.BarraProgreso.hide();
                }
            }
        });
        /*var rec = _this.gpAmbiente.getSelectionModel().getSelected();
         if (rec.data._parent != null) {
         var recparent = _this.gpAmbiente.getStore().getById(rec.data._parent);
         var arrayrec = [];
         arrayrec.push(recparent);
         _this.gpAmbiente.getStore().setNodeLoaded(recparent, false);
         _this.gpAmbiente.getSelectionModel().selectRecords(arrayrec);
         _this.gpAmbiente.getStore().expandNode(recparent);
         _this.gpAmbiente.getStore().reload();
         }
         if (rec.data._parent == null) {
         anode = _this.gpAmbiente.getSelectionModel().getSelected().data._parent;
         _this.gpAmbiente.getSelectionModel().clearSelections();
         _this.stAmbiente.reload({
         params: {
         anode: null,
         start: start
         }
         });
         }*/


        /*  var recparent = _this.gpAmbiente.getStore().getById(rec.data._parent);
         var arrayrec = [];
         arrayrec.push(recparent);
         _this.gpAmbiente.getStore().setNodeLoaded(recparent, false);
         _this.gpAmbiente.getSelectionModel().selectRecords(arrayrec);
         _this.gpAmbiente.getStore().expandNode(recparent);
         _this.gpAmbiente.getStore().reload();*/
    };
    this.addDatos = function() {
        ///ACIONES----------------------------
        var arrayacc = [];
        var arraycuen = [];
        var arraybah = [];
        var recordsAcc = _this.gridaccion.getSelectionModel().getSelections();
        for (i = 0; i < _this.gridaccion.getSelectionModel().getCount(); i++) {
            arrayacc.push(recordsAcc[i].data);
        }

        //CUENCAS------------------------------------
        var recordsCuen = _this.gridCuencas.getSelectionModel().getSelections();
        for (j = 0; j < _this.gridCuencas.getSelectionModel().getCount(); j++) {
            arraycuen.push(recordsCuen[j].data);
        }

        //BAHIAS----------------------------------------------
        var recordsBah = _this.gridBahias.getSelectionModel().getSelections();
        for (o = 0; o < _this.gridBahias.getSelectionModel().getCount(); o++) {
            arraybah.push(recordsBah[o].data);
        }
        Ext.Ajax.request({
            url: 'adicionarDatos',
            params: {
                datosCuenca: Ext.encode(arraycuen),
                datosBahia: Ext.encode(arraybah),
                datosAccion: Ext.encode(arrayacc),
                idejercicio: opciones.ejercicio.idejercicio,
                idinversion: opciones.idinversion,
                identidad: opciones.identidad,
                idsector: _this.smAmbiente.getSelected().data.idmedioambglobal,
                iddatosNomPad: _this.smAmbiente.getSelected().data.iddatosnomencladorpadre
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.codMsgE === 1) {
                    mostrarMensaje(1, 'El(Los) dato(s) ha(n) sido adicionado(s) satisfactoriamente.');
                    _this.winAddDatos.hide();
//                    _this.smacciones.clearSelections();
//                    _this.smbahias.clearSelections();
//                    _this.smCuencas.clearSelections();
//                    //  _this.fnCargarPres();
                    _this.stAmbiente.reload({
                        /*params: {
                            anode: 0,
                            start: 0
                        }*/
                    });
                    // _this.stAmbiente.add();
                } else {
                    mostrarMensaje(1, 'Existe(n) dato(s) que intentó adicionar repetido(s).');
                    _this.winAddDatos.hide();
                    _this.smacciones.clearSelections();
                    _this.smbahias.clearSelections();
                    _this.smCuencas.clearSelections();
                    //  _this.fnCargarPres();
                    _this.stAmbiente.reload();
                }
            }
        });
    }
    this.addSector = function() {
        var record = new Ext.data.Record({vacia: '', denominacion: '', 
            sumapresp_mp: 0, sumapresp_usd: 0, ejecutadomp1: 0, ejecutadousd1: 0, 
            ejecutadomp2: 0, ejecutadousd2: 0, ejecutadomp3: 0, ejecutadousd3: 0, 
            ejecutadomp4: 0, ejecutadousd4: 0, estimadomp1: 0, estimadousd1: 0, 
            estimadomp2: 0, estimadousd2: 0, estimadomp3: 0, estimadousd3: 0, 
            estimadomp4: 0, estimadousd4: 0, planmp1: 0, planusd1: 0, planmp2: 0, 
            planusd2: 0, planmp3: 0, planusd3: 0, planmp4: 0, planusd4: 0, 
            proyecmp1: 0, proyecusd1: 0, proyecmp2: 0, proyecusd2: 0, 
            proyecmp3: 0, proyecusd3: 0, proyecmp4: 0, proyecusd4: 0, _parent: 2,
            _is_leaf: true
        });
        _this.stAmbiente.add(record);
    };
    this.fnCargarPres = function() {
        var record2 = new Ext.data.Record({
            denominacion: "Total inversiones y Plan de preparaci&oacuten",
            sumapresp_mp: sumapres_mp,
            sumapresp_usd: sumapres_usd,
            //
            ejecutado_mp1: ejecutadoTolyPla_mp1,
            ejecutado_usd1: ejecutado_usd1,
            estimado_mp1: estimado_mp1,
            estimado_usd1: estimado_usd1,
            plan_mp1: plan_mppp1,
            plan_usd1: plan_usddd1,
            proyec_mp1: proyec_mp1,
            proyec_usd1: proyec_usd1,
            //
            ejecutado_mp2: ejecutado_mp2,
            ejecutado_usd2: ejecutado_usd2,
            estimado_mp2: estimado_mp2,
            estimado_usd2: estimado_usd2,
            plan_mp2: plan_mppp2,
            plan_usd2: plan_usddd2,
            proyec_mp2: proyec_mp2,
            proyec_usd2: proyec_usd2,
            //
            ejecutado_mp3: ejecutado_mp3,
            ejecutado_usd3: ejecutado_usd3,
            estimado_mp3: estimado_mp3,
            estimado_usd3: estimado_usd3,
            plan_mp3: plan_mppp3,
            plan_usd3: plan_usddd3,
            proyec_mp3: proyec_mp3,
            proyec_usd3: proyec_usd3,
            //
            ejecutado_mp4: ejecutado_mp4,
            ejecutado_usd4: ejecutado_usd4,
            estimado_mp4: estimado_mp4,
            estimado_usd4: estimado_usd4,
            plan_mp4: plan_mppp4,
            plan_usd4: plan_usddd4,
            proyec_mp4: proyec_mp4,
            proyec_usd4: proyec_usd4,
            //
            annospost_mp: annospost_mp,
            annospost_usd: annospost_usd
        });
    };
    this.Gestionardatos = function(tab) {
        _this.stCuenca.load({
            params: {
                idejercicio: opciones.ejercicio.idejercicio,
                idinversion: opciones.idinversion,
                identidad: opciones.identidad,
                idsector: _this.smAmbiente.getSelected().data.idmedioambglobal,
                iddatosNomPad: _this.smAmbiente.getSelected().data.iddatosnomencladorpadre,
                start: 0,
                limit: 20
            }
        });
        _this.stBahia.load({
            params: {
                idejercicio: opciones.ejercicio.idejercicio,
                idinversion: opciones.idinversion,
                identidad: opciones.identidad,
                idsector: _this.smAmbiente.getSelected().data.idmedioambglobal,
                iddatosNomPad: _this.smAmbiente.getSelected().data.iddatosnomencladorpadre,
                start: 0,
                limit: 20
            }
        });
        _this.stAcciones.load({
            params: {
                idejercicio: opciones.ejercicio.idejercicio,
                idinversion: opciones.idinversion,
                identidad: opciones.identidad,
                idsector: _this.smAmbiente.getSelected().data.idmedioambglobal,
                iddatosNomPad: _this.smAmbiente.getSelected().data.iddatosnomencladorpadre,
                start: 0,
                limit: 20
            }
        });
        if (_this.smAmbiente.getSelections().length > 0 && typeof (_this.gpAmbiente.getSelectionModel().getSelected().data.idmedioambglobal) != 'undefined') {
            _this.winAddDatos.show();
            _this.tabsDatSector.setActiveTab(tab);
        }
    };
    function rendeSector(id) {
        var index = _this.stSector.find('iddatosnomenclador', id);
        if (index > -1) {
            var record = _this.stSector.getAt(index);
            return record.get('dato');
        }
        return id;
    }
    this.annosPosterioresMp = function(value, meta, record, rowIndex) {
        _this.mpposteriores[rowIndex] = parseFloat(record.data.sumapresp_mp)
                - (parseFloat(record.data['ejecutadomp1']) + parseFloat(record.data['estimadomp2'])
                        + parseFloat(record.data['planmp3']) + parseFloat(record.data['proyecmp4']));
        _this.sennalardesglose(record);
        //  response = (isNaN(_this.mpposteriores[rowIndex])) ? 0 : Ext.util.Format.usMoney(_this.mpposteriores[rowIndex]);
        response = (isNaN(_this.mpposteriores[rowIndex])) ? 0 : _this.mpposteriores[rowIndex];
        return response;
    };
    this.annosPosterioresUsd = function(value, meta, record, rowIndex) {
        _this.usdposteriores[rowIndex] = parseFloat(record.data.sumapresp_usd) -
                (parseFloat(record.data['ejecutadousd1']) + parseFloat(record.data['estimadousd2'])
                        + parseFloat(record.data['planusd3']) + parseFloat(record.data['proyecusd4']));
        _this.sennalardesglose(record);
        //  response = (isNaN(_this.usdposteriores[rowIndex])) ? 0 : Ext.util.Format.usMoney(_this.usdposteriores[rowIndex]);
        response = (isNaN(_this.usdposteriores[rowIndex])) ? 0 : _this.usdposteriores[rowIndex];
        return response;
    };
    this.sennalardesglose = function(record) {
        var desglose_mp = 0;
        var desglose_usd = 0;

        desglose_mp += parseFloat(record.data.ejecutadomp1);
        desglose_usd += parseFloat(record.data.ejecutadousd1);
        desglose_mp += parseFloat(record.data.estimadomp1);
        desglose_usd += parseFloat(record.data.estimadousd1);
        desglose_mp += parseFloat(record.data.planmp1);
        desglose_usd += parseFloat(record.data.planusd1);
        desglose_mp += parseFloat(record.data.proyecmp1);
        desglose_usd += parseFloat(record.data.proyecusd1);
        //
        desglose_mp += parseFloat(parseFloat(record.data.ejecutadomp2));
        desglose_usd += parseFloat(record.data.ejecutadousd2);
        desglose_mp += parseFloat(record.data.estimadomp2);
        desglose_usd += parseFloat(record.data.estimadousd2);
        desglose_mp += parseFloat(record.data.planmp2);
        desglose_usd += parseFloat(record.data.planusd2);
        desglose_mp += parseFloat(record.data.proyecmp2);
        desglose_usd += parseFloat(record.data.proyecusd2);
        //
        desglose_mp += parseFloat(record.data.ejecutadomp3);
        desglose_usd += parseFloat(record.data.ejecutadousd3);
        desglose_mp += parseFloat(record.data.estimadomp3);
        desglose_usd += parseFloat(record.data.estimadousd3);
        desglose_mp += parseFloat(record.data.planmp3);
        desglose_usd += parseFloat(record.data.planusd3);
        desglose_mp += parseFloat(record.data.proyecmp3);
        desglose_usd += parseFloat(record.data.proyecusd3);
        //
        desglose_mp += parseFloat(record.data.ejecutadomp4);
        desglose_usd += parseFloat(record.data.ejecutadousd4);
        desglose_mp += parseFloat(record.data.estimadomp4);
        desglose_usd += parseFloat(record.data.estimadousd4);
        desglose_mp += parseFloat(record.data.planmp4);
        desglose_usd += parseFloat(record.data.planusd4);
        desglose_mp += parseFloat(record.data.proyecmp4);
        desglose_usd += parseFloat(record.data.proyecusd4);

        _this.arraydesglose[0] = desglose_mp;
        _this.arraydesglose[1] = desglose_usd;

        return _this.arraydesglose;
    };

};