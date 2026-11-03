
Utilidades.Cmp.CmpNivelActividad = function(opciones) {
    var _this = this;
    this.BarraProgreso = new BarraEstado();
    this.mpposterioresExplo = [];
    this.arraydesgloseExplo = [];

    //******************************
    ///**** Elementos de Explotacion *****

    //***barra de progreso
    this.BarraEstado = function(mensaje) {
        Ext.MessageBox.show({
            msg: mensaje + '.',
            title: 'Por favor espere...',
            width: 300,
            wait: true
        });
    }
    this.btnGuardarExplotacion = new Ext.Button({
        id: 'btnGuardarExplotacion',
        text: 'Guardar',
        disabled:'true',
        tooltip: 'Guardar niveles de actividad',
        iconCls: 'modificar',
        handler: function() {
            _this.GuardarNiveles();
        }
//disabled: true
    });
    this.btnAdicionarExplotacion = new Ext.Button({
        id: 'btnAdicionarExplotacion',
        text: 'Adicionar',
        tooltip: 'Adicionar niveles de actividad',
        iconCls: 'adicionar',
        handler: function() {
            _this.stAdicionarNeveles.reload();
            _this.winAdicionarNeveles.show();
        }
    });
    this.btnEliminarExplotacion = new Ext.Button({
        id: 'btnEliminarExplotacion',
        text: 'Eliminar',
        tooltip: 'Eliminar niveles de actividad',
        iconCls: 'eliminar',
        disabled: true,
        handler: function() {
            _this.EliminarNiveles(_this.smExplotacion);
        }
    });

    this.btnLimpiarExplotacion = new Ext.Button({
        id: 'btnLimpiarExplotacion',
        text: 'Limpiar',
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar'
    });

    this.checkResumenNivel = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Resumen  ',
        id: 'checkResumen',
        checked: true,
        name: 'checkResumen',
        handler: function() {
            _this.Resumen();
        }
    });
    this.smExplotacion = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, fila, record) {
                if (sm.getSelections().length > 0) {
                    _this.btnEliminarExplotacion.enable();
                } else {
                    _this.btnEliminarExplotacion.disable();
                }
            }, rowdeselect: function(sm, fila, record) {
                if (sm.getSelections().length > 0) {
                    _this.btnEliminarExplotacion.enable();
                } else {
                    _this.btnEliminarExplotacion.disable();
                }
            }
        }
    });
    //***sm resumen
    this.smExplotacionR = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, fila, record) {
                if (sm.getSelections().length > 0) {
                    _this.btnEliminarExplotR.enable();
                } else {
                    _this.btnEliminarExplotR.disable();
                }
            }, rowdeselect: function(sm, fila, record) {
                if (sm.getSelections().length > 0) {
                    _this.btnEliminarExplotR.enable();
                } else {
                    _this.btnEliminarExplotR.disable();
                }
            }
        }
    });
    //************************************************************
    /*this.stum = new Ext.data.Store({
        url: 'cargarUM',
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'total'
        }, [{
            name: 'idunidadmedida'
        }, {
            name: 'um'
        }
        ])
    });*/

    //*** creando el repositorio de datos
    this.stExplotacion = new Ext.data.Store({
        url: 'cargarInvCapExplotacion',
        reader: new Ext.data.JsonReader(
            {
                id: 'idinversnivelactividad',
                totalProperty: 'total',
                root: "data"
            },
            [
                {name: 'idinversnivelactividad'},
                {name: 'identidad'},
                {name: 'idactividad'},
                {name: 'idactespcomportamiento'},
                {name: 'nivelact'},
                {name: 'um'},
                //Dat Invers Cap Explot
                {name: 'iddatcapexplotacion'},
                {name: 'aantetotal'},
                {name: 'aanteestimado'},
                {name: 'aanteplan'},
                {name: 'aanteproyeccion'},
                {name: 'idaante'}, //idinverscapexplot cuando idejercicio es aante

                {name: 'antetotal'},
                {name: 'anteestimado'},
                {name: 'anteplan'},
                {name: 'anteproyeccion'},
                {name: 'idante'}, //idinverscapexplot cuando idejercicio es ante

                {name: 'actualtotal'},
                {name: 'actualestimado'},
                {name: 'actualplan'},
                {name: 'actualproyeccion'},
                {name: 'idactual'}, //idinverscapexplot cuando idejercicio es actual

                {name: 'postotal'},
                {name: 'posestimado'},
                {name: 'posplan'},
                {name: 'posproyeccion'},
                {name: 'idpos'}, //idinverscapexplot cuando idejercicio es pos

                //Dat cap explot annos post cant
                {name: 'cantidad'},
                {name: 'annospos'},
                {name: 'idcapexplotannospostcant'},
            ]),
        listeners: {
            beforeload: function(st) {
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                //st.baseParams.idinversion = _this.inversion;
                st.baseParams.idinversion = opciones.idinversion;
                st.baseParams.aaejercicio = opciones.ejercicio.ejercicio - 2;
                st.baseParams.aejercicio = opciones.ejercicio.ejercicio - 1;
                st.baseParams.pejercicio = (parseFloat(opciones.ejercicio.ejercicio) + 1);
                st.baseParams.idetapainversion = _this.CmbComponentesN.getValue();
                st.baseParams.limit = _this.cbpaginadoe.getValue();
                st.baseParams.start = 0;
            }
        }
    });
    this.stcbpaginadoe = new Ext.data.SimpleStore({
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
    this.cbpaginadoe = new Ext.form.ComboBox({
        value: 80,
        store: _this.stcbpaginadoe,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 50,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                _this.ptGridpExplotacion.pageSize = record.data.idnumpag;
                _this.ptGridpExplotacion.doLoad(_this.ptGridpExplotacion.cursor);
            }
        }
    });

    this.cmExplotacion = new Ext.grid.ColumnModel([
        {width: 200, dataIndex: 'nivelact', align: 'left', id: 'nivelact'},
        /*{width: 100, dataIndex: 'um', align: 'left'},*/
        {width: 100, dataIndex: 'cantidad', align: 'left'},

        {width: 80, dataIndex: 'aantetotal', align: 'left', editor: new Ext.form.NumberField({
            /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
             maskRegex: /^([0-9]+ ?[0-9]*)+$/,
             regex: /^([0-9]+ ?[0-9]*)+$/,
             regexText: 'Los valores deben ser n\xFAmeros enteros',*/
        }), renderer: valorCero},
        {width: 80, dataIndex: 'anteestimado', align: 'left', editor: new Ext.form.NumberField({
            /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
             maskRegex: /^([0-9]+ ?[0-9]*)+$/,
             regex: /^([0-9]+ ?[0-9]*)+$/,
             regexText: 'Los valores deben ser n\xFAmeros enteros',*/
        }), renderer: valorCero},
        {width: 80, dataIndex: 'actualplan', align: 'left', renderer: valorCero, editor: new Ext.form.NumberField({
            /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
             maskRegex: /^([0-9]+ ?[0-9]*)+$/,
             regex: /^([0-9]+ ?[0-9]*)+$/,
             regexText: 'Los valores deben ser n\xFAmeros enteros',*/
        })},
        {width: 80, dataIndex: 'posproyeccion', align: 'left', editor: new Ext.form.NumberField({
            /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
             maskRegex: /^([0-9]+ ?[0-9]*)+$/,
             regex: /^([0-9]+ ?[0-9]*)+$/,
             regexText: 'Los valores deben ser n\xFAmeros enteros',*/
        }), renderer: valorCero},
        {width: 100, dataIndex: 'annospos', align: 'left', renderer: annosposterioresExpl}
    ]);
    this.cmExplotacion.headers = [
        [
            {header: 'Actividad', rowspan: 3},
            /*{header: 'UM', rowspan: 3},*/
            {header: 'cantidad', rowspan: 3}
        ], [
            {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 1},
            {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 1},
            {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 1},
            {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 1},
            {header: 'A&ntilde;os posteriores', rowspan: 2}
        ], [
            {align: 'left', header: 'Total ejecutado hasta'},
            {align: 'left', header: 'Estimado'},
            {align: 'left', header: 'Plan'},
            {align: 'left', header: 'Proyecci&oacute;n'}
        ]
    ];

    this.stCetapaN = new Ext.data.Store({
        url: 'cargarEtapas',
        autoload: true,
        reader: new Ext.data.JsonReader({
                id: 'idetapa',
                root: 'data'
            },
            [{
                name: 'denominacion'
            }, {
                name: 'idetapa'
            }]),
        baseParams: {
            idejercicio: opciones.ejercicio.idejercicio,
            identidad: opciones.identidad,
            idinversion: opciones.idinversion
        }
    });
    this.CmbComponentesN = new Ext.form.ComboBox({
        width: 200,
        align: 'right',
        allowBlank: false,
        mode: 'local',
        store: _this.stCetapaN,
        valueField: 'idetapa',
        displayField: 'denominacion',
        etyText: opciones.idioma.tlSeleccione,
        triggerAction: 'all',
        fieldLabel: opciones.idioma.cpmCoEtap,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            select: function() {
                _this.stExplotacion.reload();
            }
        }
    });

    this.gpExplotacion = new Ext.grid.EditorGridPanel({
        frame: true,
        disabled: false,
        editable: true,
        width: 510,
        master_column_id: 'nivelact',
        // autoExpandMin: 165,
        // split: true,
        region: 'center',
        // autoScroll: true,
        // stripeRows: true,
        store: _this.stExplotacion,
        sm: _this.smExplotacion,
        height: 300,
        plugins: new Ext.ux.plugins.XGrid(),
        listeners: {
            click: function() {
            },
            focus: function() {
            }
        },
        loadMask: {
            msg: 'Cargando...'
        },
        viewConfig: {
            getRowClass: function(record, index) {
                cantidad = (record.data.cantidad != "") ? record.data.cantidad : 0;
                if (/*(_this.mpposterioresExplo[index] < 0) ||*/ (_this.arraydesgloseExplo[0] > parseFloat(cantidad))) {
                    _this.btnGuardarExplotacion.disable();
                    return  'superior';
                }
                else {
                    _this.btnGuardarExplotacion.enable();
                    return '';
                }

            }
        },
        afteredit: function(obj) {
            var datos = [];
             cantidad = (obj.record.data.cantidad != "") ? obj.record.data.cantidad : 0;
             _this.stExplotacion.getModifiedRecords().forEach(function(record) {
             datos.push(record.data)
             })
             if (datos.length != 0)
             _this.btnGuardarExplotacion.enable();

             if ((_this.mpposterioresExplo[obj.row] < 0) || (_this.arraydesgloseExplo[0] > parseFloat(cantidad))) {
             _this.btnGuardarExplotacion.disable();
             }
             else {
             _this.btnGuardarExplotacion.enable();
             }
        },
        cm: _this.cmExplotacion,
        tbar: ['Componentes :', _this.CmbComponentesN, /*_this.btnAdicionarExplotacion, _this.btnEliminarExplotacion,*/ _this.btnGuardarExplotacion, '->', _this.checkResumenNivel],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'paginado2',
            //width: screen.width-60,
            store: _this.stExplotacion,
            displayInfo: true,
            items: ['-', _this.cbpaginadoe]
        })
        //_this.cbpaginadoe]
    });
    this.ptGridpExplotacion = new Ext.PagingToolbar({
        pageSize: _this.cbpaginadoe.getValue(),
        store: _this.stExplotacion,
        width: 400,
        displayInfo: true
    });
    //**** ADICIONAR niveles de actividad
    this.stAdicionarNeveles = new Ext.data.Store({
        url: 'cargarCapExplotacion',
        reader: new Ext.data.JsonReader(
            {
                id: 'id',
                totalProperty: 'total',
                root: "data"
            },
            [
                {name: 'denominacion'},
                {name: 'iddatcapexplotacion'},
                {name: 'um'}
            ]),
        listeners: {
            beforeload: function(st) {
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                st.baseParams.idinversion = _this.inversion;
                st.baseParams.limit = _this.cbpaginado.getValue();
                st.baseParams.start = 0;
            }
        }
    });


    //---- Panel de desglose por fecha ---------------

    this.gpExplotacion = new Ext.grid.EditorGridPanel({
        id: 'gpDesgloseFecha',
        title: 'Desglose por fecha',
        collapsible: true,
        titleCollapse: true,
        collapsed: true,
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
                rowselect: function () {
                    Ext.getCmp('btneliminar').enable();
                },
                rowdeselect: function (a, b, c) {
                    Ext.getCmp('btneliminar').disable();
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
            handler: function () {
                self.comprobarSeleccion('adicionar');
            }
        }, {
            iconCls: 'eliminar',
            id: 'btneliminar',
            disabled: true,
            tooltip: 'Eliminar desgloses <b>(DEL)</b>',
            handler: function () {
                self.comprobarSeleccion('eliminar');
            }
        }, {
            iconCls: 'guardar',
            id: 'btnguardar',
            disabled: true,
            tooltip: 'Guardar desgloses <b>(Alt+G)</b>',
            handler: function () {
                self.comprobarSeleccion('guardar');
            }
        }],
        store: new Ext.data.Store({
            storeId: 'storedesglose',
            url: 'listarDesgloses',
            id: 'storedesglose',
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idnivelactividadporfecha',
                totalProperty: 'total'
            }, [{
                name: 'idnivelactividadporfecha'
            }, {
                name: 'nivelactividad'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }
            ]),
            listeners: {
                load: function (st, re, o) {
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
                beforeload: function (st) {
                    self.changeDesgloseGridTitle();
                    st.baseParams.idactividad = Ext.getCmp('gpNivelesActividad').getSelectionModel().getSelected().data.idactividad;
                    st.baseParams.identidad = identidadselected;
                    st.baseParams.idejercicio = cmbEjercicio.getValue();
                    st.baseParams.start = 0;
                    st.baseParams.limit = 20;
                }
            }
        }),
        listeners: {
            keypress: function (e) {
                if (e.getKey() == 46) {
                    self.comprobarSeleccion('eliminar');
                }
            },
            afteredit: function () {
                Ext.getCmp('btnguardar').enable();
            }
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: 'storedesglose',
            displayInfo: true,
            items: ['-', {
                id: 'clearFilterDesglose',
                iconCls: 'limpiar',
                tooltip: 'Limpiar filtros',
                //  text: '<u>L</u>impiar',
                handler: function () {
                    gridDesglosefilter.clearFilters();
                }
            }]
        })
    })


    this.pNivelActividad = new Ext.Panel({
        layout: 'border',
        region: 'center',
        border: false,
        maximized: true,
        frame: true,
        // width: 1070,
        height: 1500,
        items: [_this.gpExplotacion, mpanel]
    });

    this.Resumen = function() {
        if (_this.checkResumenNivel.getValue() === false) {

            this.cmExplotacionGen = new Ext.grid.ColumnModel([
                {width: 200, dataIndex: 'nivelact', align: 'left', id: 'nivelact'},
                /*{width: 100, dataIndex: 'um', align: 'left'},*/
                {width: 100, dataIndex: 'cantidad', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aantetotal', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteestimado', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteplan', align: 'left'},
                {width: 80, dataIndex: 'aanteproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'antetotal', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'anteestimado', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'anteplan', align: 'left', renderer: valorCero},
                {width: 80, dataIndex: 'anteproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualtotal', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualestimado', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualplan', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'postotal', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'posestimado', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'posplan', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'posproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                     maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                     regex: /^([0-9]+ ?[0-9]*)+$/,
                     regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                }), renderer: valorCero},
                {width: 100, dataIndex: 'annospos', align: 'left', renderer: annosposterioresExpl}
            ]);
            this.cmExplotacionGen.headers = [
                [
                    {header: 'Actividad', rowspan: 3},
                    /*{header: 'UM', rowspan: 3},*/
                    {header: 'Cantidad', rowspan: 3}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 4},
                    {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 4},
                    {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 4},
                    {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 4},
                    {header: "A&ntilde;os posteriores", rowspan: 2}
                ], [
                    {align: 'left', header: 'Total ejecutado hasta'},
                    {align: 'left', header: 'Estimado'},
                    {align: 'left', header: 'Plan'},
                    {align: 'left', header: 'Proyecci&oacute;n'},
                    {align: 'left', header: 'Total ejecutado hasta'},
                    {align: 'left', header: 'Estimado'},
                    {align: 'left', header: 'Plan'},
                    {align: 'left', header: 'Proyecci&oacute;n'},
                    {align: 'left', header: 'Total ejecutado hasta'},
                    {align: 'left', header: 'Estimado'},
                    {align: 'left', header: 'Plan'},
                    {align: 'left', header: 'Proyecci&oacute;n'},
                    {align: 'left', header: 'Total ejecutado hasta'},
                    {align: 'left', header: 'Estimado'},
                    {align: 'left', header: 'Plan'},
                    {align: 'left', header: 'Proyecci&oacute;n'}
                ]
            ];
            _this.gpExplotacion.reconfigure(_this.stExplotacion, _this.cmExplotacionGen);
        } else {
            _this.gpExplotacion.reconfigure(_this.stExplotacion, _this.cmExplotacion);
        }
    };

    this.GuardarNiveles = function() {
        arrayNiveles = new Array();
        records = _this.stExplotacion.getModifiedRecords();
        _this.stExplotacion.commitChanges();
        for (var i = 0; i < records.length; i++) {
            arrayNiveles.push(records[i].data);
        }
        _this.BarraEstado('Guardando nivel(es) de actividad..');
        Ext.Ajax.request({
            url: 'guardarNiveles',
            params: {
                valores: Ext.encode(arrayNiveles),
                idejercicio: opciones.ejercicio.idejercicio,
                aaejercicio: opciones.ejercicio.ejercicio - 2,
                aejercicio: opciones.ejercicio.ejercicio - 1,
                pejercicio: (parseFloat(opciones.ejercicio.ejercicio) + 1),
                idinversion: _this.inversion
            },
            callback: function(options, success, response) {
                Ext.MessageBox.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgOI == 1) {
                    mostrarMensaje(1, 'El(Los) nivel(es) de actividad ha(n) sido guardado(s) satisfactoriamente.');
                    _this.stExplotacion.reload();
                }
            }
        });
    }

    //*** FUNCION ELIMINAR NIVELES DE ACTIVIDAD ****
    this.EliminarNiveles = function(sm) {
        var arrayNivelesAEliminar = [];
        var arrayNivelesSeleccionados = sm.getSelections();
        if (arrayNivelesSeleccionados.length > 0) {
            for (var i = 0; i < arrayNivelesSeleccionados.length; i++) {
                arrayNivelesAEliminar[i] = arrayNivelesSeleccionados[i].data;
            }
        }
        mostrarMensaje(2, '?Est&aacute; seguro que quiere eliminar el(los) nivel(es) de actividad seleccionado(s)?', function(btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraEstado('Eliminando nivel(es) de actividad..');
                Ext.Ajax.request({
                    url: 'eliminarInvCapExp',
                    params: {
                        array_niveles: Ext.encode(arrayNivelesAEliminar)
                    },
                    callback: function(options, success, response) {
                        Ext.MessageBox.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgA == 1) {
                            mostrarMensaje(2, 'El(Los) niveles(es) de actividad ha(n) sido eliminado(s) satisfactoriamente.');
                            _this.stExplotacion.reload();
                        }
                    }
                });
            }
        });
    }

    //************ Funciones ******************

    //valor por defecto de los grid
    function valorCero(v) {
        if (!v)
            return 0;
        else
            return v;
    }

    function annosposterioresExpl(value, meta, record, rowIndex) {
        cantidad = (record.data.cantidad != "") ? record.data.cantidad : 0;
        total = (record.data.aantetotal != "") ? record.data.aantetotal : 0;
        estimado = (record.data.anteestimado != "") ? record.data.anteestimado : 0;
        plan = (record.data.actualplan != "") ? record.data.actualplan : 0;
        proyecc = (record.data.posproyeccion != "") ? record.data.posproyeccion : 0;
        _this.mpposterioresExplo[rowIndex] = parseFloat(cantidad) - (parseFloat(total) + parseFloat(estimado)
            + parseFloat(plan) + parseFloat(proyecc));
        sennalarfila(record, 1,_this.mpposterioresExplo[rowIndex]);
        return  parseFloat(_this.mpposterioresExplo[rowIndex]).toFixed(2);
    }

    function sennalarfila(record, aux,val) {


        var desglose_total = 0;
        cantidad = (record.data.cantidad !== "") ? record.data.cantidad : 0;
        total = (record.data.aantetotal !== "") ? record.data.aantetotal : 0;
        total1 = (record.data.antetotal !== "") ? record.data.antetotal : 0;
        total2 = (record.data.actualtotal !== "") ? record.data.actualtotal : 0;
        total3 = (record.data.postotal !== "") ? record.data.postotal : 0;
        estimado = (record.data.anteestimado !== "") ? record.data.anteestimado : 0;
        estimado1 = (record.data.aanteestimado !== "") ? record.data.aanteestimado : 0;
        estimado2 = (record.data.actualestimado !== "") ? record.data.actualestimado : 0;
        estimado3 = (record.data.posestimado !== "") ? record.data.posestimado : 0;
        plan = (record.data.aanteplan !== "") ? record.data.aanteplan : 0;
        plan1 = (record.data.anteplan !== "") ? record.data.anteplan : 0;
        plan2 = (record.data.posplan !== "") ? record.data.posplan : 0;
        plan3 = (record.data.actualplan !== "") ? record.data.actualplan : 0;
        proyecc1 = (record.data.aanteproyeccion !== "") ? record.data.aanteproyeccion : 0;
        proyecc2 = (record.data.anteproyeccion !== "") ? record.data.anteproyeccion : 0;
        proyecc3 = (record.data.actualproyeccion !== "") ? record.data.actualproyeccion : 0;
        proyecc4 = (record.data.posproyeccion !== "") ? record.data.posproyeccion : 0;

        /*total = record.data.aantetotal;
         total1 = record.data.antetotal;
         total2 = record.data.actualtotal;
         total3 = record.data.postotal;
         estimado = record.data.anteestimado;
         estimado1 = record.data.aanteestimado;
         estimado2 = record.data.actualestimado;
         estimado3 = record.data.posestimado;
         plan = record.data.aanteplan;
         plan1 = record.data.anteplan;
         plan2 = record.data.posplan;
         plan3 = record.data.actualplan;
         proyecc1 = record.data.aanteproyeccion;
         proyecc2 = record.data.anteproyeccion;
         proyecc3 = record.data.actualproyeccion;
         proyecc4 = record.data.posproyeccion;*/

        desglose_total = parseFloat(total) + parseFloat(estimado) +  parseFloat(plan3) + parseFloat(proyecc4)

        if (aux === 2) {
            _this.arraydesglose[0] = desglose_total;
            return _this.arraydesglose;
        } else {
            _this.arraydesgloseExplo[0] = desglose_total;
            return _this.arraydesgloseExplo;
        }



    }

};