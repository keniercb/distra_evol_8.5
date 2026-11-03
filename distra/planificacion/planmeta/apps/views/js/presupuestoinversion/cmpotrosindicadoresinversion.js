

Ext.ns('Gestionar.planinversiones');

Utilidades.Cmp.Cmpotrosindicadoresinversion = function(opciones) {

    var _this = this;
    this.inversion;
    this.identidad;
    this.mpposteriores = []; //
    this.mpposterioresExplo = [];
    this.arraydesglose = [];
    this.arraydesgloseExplo = [];
    this.valor = 0;
    // _this.objPresupuestoinversion = new Utilidades.Cmp.Cmppresupuestoinversion({ejercicio: opciones.ejercicio.ejercicio, identidad: opciones.identidad});    //_this.objPresupuestoinversion.Inicializar(vista.gpInversiones.getSelectionModel().getSelected().data.idinversion);
    var obj = Gestionar.planinversiones.Controlador;

    // var obj = Gestionar.planinversiones.Controlador;

    //_this.objPresupuestoinversion.stTotales.reload();



    //***barra de progreso
    this.BarraEstado = function(mensaje) {
        Ext.MessageBox.show({
            msg: mensaje + '.',
            title: 'Por favor espere...',
            width: 300,
            wait: true
        });
    }

    this.btnAyudaOtrosindicadores = new Ext.Button({
        id: 'btnAyudaOtrosindicadores',
        text: 'Ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn'
    });
    ///**** Elementos de Otros inicadores *****
    this.btnGuardarOtrosindicadores = new Ext.Button({
        id: 'btnGuardarOtrosindicadores',
        text: 'Guardar',
        tooltip: 'Guardar otros inicadores',
        iconCls: 'modificar',
        handler: function() {
            _this.GuardarOtrosindicadores();
        }
//disabled: true
    });
    this.btnGuardarOtrosindResumen = new Ext.Button({
        id: 'btnGuardarOtrosindResumen',
        text: 'Guardar',
        tooltip: 'Guardar otros inicadores',
        iconCls: 'modificar',
        handler: function() {
            _this.GuardarOtrosindicadores();
        }
//disabled: true
    });
    this.btnLimpiarOtrosindicadores = new Ext.Button({
        id: 'btnLimpiarOtrosindicadores',
        text: 'Limpiar',
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar'
    });
    this.checkResumen = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Resumen  ',
        id: 'checkResumen',
        checked: true,
        name: 'checkResumen',
        handler: function() {
            _this.Resumen();
        }
    });

    //creando el repositorio de datos  
    this.stOtrosindicadores = new Ext.data.Store({
        url: 'cargarOtrosindicadores',
        reader: new Ext.data.JsonReader(
                {
                    id: 'idnomotrosindicadores',
                    totalProperty: 'total',
                    root: "data"
                },
        [
            {name: 'otrosindicadores'},
            //Dat otros indicadores
            {name: 'idnomotrosindicadores'},
            {name: 'aantetotal'},
            {name: 'aanteestimado'},
            {name: 'aanteplan'},
            {name: 'aanteproyeccion'},
            {name: 'idaante'}, //iddatotrosindicadares cuando idejercicio es aante

            {name: 'antetotal'},
            {name: 'anteestimado'},
            {name: 'anteplan'},
            {name: 'anteproyeccion'},
            {name: 'idante'}, //iddatotrosindicadares cuando idejercicio es ante

            {name: 'actualtotal'},
            {name: 'actualestimado'},
            {name: 'actualplan'},
            {name: 'actualproyeccion'},
            {name: 'idactual'}, //iddatotrosindicadares cuando idejercicio es actual

            {name: 'postotal'},
            {name: 'posestimado'},
            {name: 'posplan'},
            {name: 'posproyeccion'},
            {name: 'idpos'}, //iddatotrosindicadares cuando idejercicio es pos

            //Dat a�os posteriores-cantidad
            {name: 'annospos'},
            {name: 'cantidad'},
            {name: 'idotrosindicadoresannospostcant'},
            {name: 'descripcion'}
        ]),
        listeners: {
            beforeload: function(st) {
                _this.BarraEstado('Cargando otros indicadores..');
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                st.baseParams.identidad = _this.identidad;
                st.baseParams.idinversion = _this.inversion;
                st.baseParams.aaejercicio = opciones.ejercicio.ejercicio - 2;
                st.baseParams.aejercicio = opciones.ejercicio.ejercicio - 1;
                st.baseParams.pejercicio = (parseInt(opciones.ejercicio.ejercicio) + 1);
                st.baseParams.limit = _this.cbpaginado.getValue();
                st.baseParams.start = 0;
            },
            load: function() {
                Ext.MessageBox.hide();
                // _this.cargarDatosGrid(_this.stOtrosindicadores);
            }
        }
    });
    this.stcbpaginado = new Ext.data.SimpleStore({
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
        value: 80,
        store: _this.stcbpaginado,
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
                Ext.getCmp('ptinversiones').pageSize = record.data.idnumpag;
                Ext.getCmp('ptinversiones').doLoad(Ext.getCmp('ptinversiones').cursor);
            }
        }
    });

    this.cmOtrosindicadores = new Ext.grid.ColumnModel([
        {width: 250, dataIndex: 'otrosindicadores', align: 'left', id: 'otrosindicadores'},
        {width: 100, dataIndex: 'cantidad', align: 'left', editor: new Ext.form.NumberField({
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskRegex: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Los valores deben ser n\xFAmeros enteros',
        }), renderer: valorCero},
        {width: 80, dataIndex: 'aantetotal', align: 'left', editor: new Ext.form.NumberField({
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskRegex: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Los valores deben ser n\xFAmeros enteros',
        }), renderer: valorCero},
        {width: 80, dataIndex: 'anteestimado', align: 'left', editor: new Ext.form.NumberField({
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskRegex: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Los valores deben ser n\xFAmeros enteros',
        }), renderer: valorCero},
        {width: 80, dataIndex: 'actualplan', align: 'left', editor: new Ext.form.NumberField({
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskRegex: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Los valores deben ser n\xFAmeros enteros',
        }), renderer: valorCero},
        {width: 80, dataIndex: 'posproyeccion', align: 'left', editor: new Ext.form.NumberField({
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskRegex: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Los valores deben ser n\xFAmeros enteros',
        }), renderer: valorCero},
        {width: 100, dataIndex: 'annospos', align: 'left', renderer: annosPosteriores}
    ]);
    this.cmOtrosindicadores.headers = [
        [
            {header: 'Otros indicadores', rowspan: 3},
            {header: 'Cantidad', rowspan: 3}
        ], [
            {header: opciones.ejercicio.ejercicio - 2, colspan: 1},
            {header: opciones.ejercicio.ejercicio - 1, colspan: 1},
            {header: opciones.ejercicio.ejercicio, colspan: 1},
            {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 1},
            {header: 'A&ntilde;os posteriores', rowspan: 2}
        ], [
            {align: 'left', header: 'Total ejecutado hasta'},
            {align: 'left', header: 'Estimado'},
            {align: 'left', header: 'Plan'},
            {align: 'left', header: 'Proyecci&oacute;n'}
        ]
    ];
    this.gpOtrosindicadores = new Ext.grid.EditorGridPanel({
        frame: true,
        disabled: false,
        editable: true,
        master_column_id: 'otrosindicadores',
        // autoExpandMin: 165,
        //  split: true,
        region: 'center',
        width: 510,
        // autoScroll: true,
        // stripeRows: true,
        store: _this.stOtrosindicadores,
        //sm: _this.smOtrosindicadores,
        height: 200,
        plugins: new Ext.ux.plugins.XGrid(),
        listeners: {
            click: function() {
            },
            focus: function() {
            },
            afteredit: function(obj) {
                var datos = [];
                var recordind = _this.stOtrosindicadores;
                _this.stOtrosindicadores.getModifiedRecords().forEach(function(record) {
                    datos.push(record.data)
                })
                if (datos.length != 0)
                    _this.btnGuardarOtrosindicadores.enable();
                if ((_this.mpposteriores[obj.row] < 0) || (_this.arraydesglose[0] > parseInt(cantidad))) {
                    _this.btnGuardarOtrosindicadores.disable();
                }
                else {
                    _this.btnGuardarOtrosindicadores.enable();
                }

                if (obj.row == _this.stOtrosindicadores.getCount() - 1) {
                    obj.cancel = true;
                }
                if (obj.row == _this.stOtrosindicadores.getCount() - 2) {
                    obj.cancel = true;
                }

            },
            beforeedit: function(obj) {
                var datos = [];

                if (obj.row == _this.stOtrosindicadores.getCount() - 1) {
                    obj.cancel = true;
                }
                if (obj.row == _this.stOtrosindicadores.getCount() - 2) {
                    obj.cancel = true;
                }


            }
        },
        loadMask: {
            msg: 'Cargando...'
        },
        viewConfig: {
            getRowClass: function(record, index) {

                cantidad = (record.data.cantidad != "") ? record.data.cantidad : 0;
                if ((_this.mpposteriores[index] < 0) || (_this.arraydesglose[0] > parseInt(cantidad))) {
                    return  'superior';
                } else if (index === 7 || index === 8) {
                    return 'verde';
                }
                else {
                    return '';
                }



            }
        },
        cm: _this.cmOtrosindicadores,
        tbar: [_this.btnGuardarOtrosindicadores, '->', _this.checkResumen, '-', _this.btnAyudaOtrosindicadores],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptinversiones',
            //width: screen.width-60,
            store: _this.stOtrosindicadores,
            displayInfo: true,
            items: ['-', _this.cbpaginado]
        })
    });
    this.ptGridOtrosindicadores = new Ext.PagingToolbar({
        pageSize: _this.cbpaginado.getValue(),
        store: _this.stOtrosindicadores,
        width: 400,
        displayInfo: true
    });
    //******************************

    //******************************
    ///**** Elementos de Explotacion *****
    this.btnGuardarExplotacion = new Ext.Button({
        id: 'btnGuardarExplotacion',
        text: 'Guardar',
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
    this.stum = new Ext.data.Store({
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
    });

    //*** creando el repositorio de datos
    this.stExplotacion = new Ext.data.Store({
        url: 'cargarInvCapExplotacion',
        reader: new Ext.data.JsonReader(
                {
                    id: 'iddatcapexplotacion',
                    totalProperty: 'total',
                    root: "data"
                },
        [
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
                st.baseParams.idinversion = _this.inversion;
                st.baseParams.aaejercicio = opciones.ejercicio.ejercicio - 2;
                st.baseParams.aejercicio = opciones.ejercicio.ejercicio - 1;
                st.baseParams.pejercicio = (parseInt(opciones.ejercicio.ejercicio) + 1);
                st.baseParams.limit = _this.cbpaginado.getValue();
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
        {width: 100, dataIndex: 'um', align: 'left'},
        {width: 100, dataIndex: 'cantidad', align: 'left', editor: new Ext.form.NumberField({
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskRegex: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Los valores deben ser n\xFAmeros enteros',
        }), renderer: valorCero},
        /*{
         dataIndex: 'um', width: 100, sortable: true, renderer: renderUM,
         editor: new Ext.form.ComboBox({
         id: 'idunidadmedida',
         mode: 'local',
         triggerAction: 'all',
         allowBlank: false,
         emptyText: 'Seleccione...', 
         valueField: 'idunidadmedida',
         displayField: 'um',
         store: _this.stum
         })
         },*/
        {width: 80, dataIndex: 'aantetotal', align: 'left', editor: new Ext.form.NumberField({
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskRegex: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Los valores deben ser n\xFAmeros enteros',
        }), renderer: valorCero},
        {width: 80, dataIndex: 'anteestimado', align: 'left', editor: new Ext.form.NumberField({
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskRegex: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Los valores deben ser n\xFAmeros enteros',
        }), renderer: valorCero},
        {width: 80, dataIndex: 'actualplan', align: 'left', editor: new Ext.form.NumberField({
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskRegex: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Los valores deben ser n\xFAmeros enteros',
        }), renderer: valorCero},
        {width: 80, dataIndex: 'posproyeccion', align: 'left', editor: new Ext.form.NumberField({
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskRegex: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Los valores deben ser n\xFAmeros enteros',
        }), renderer: valorCero},
        {width: 100, dataIndex: 'annospos', align: 'left', renderer: annosposterioresExpl}
    ]);
    this.cmExplotacion.headers = [
        [
            {header: 'Nivel de actividad', rowspan: 3},
            {header: 'UM', rowspan: 3},
            {header: 'cantidad', rowspan: 3}
        ], [
            {header: opciones.ejercicio.ejercicio - 2, colspan: 1},
            {header: opciones.ejercicio.ejercicio - 1, colspan: 1},
            {header: opciones.ejercicio.ejercicio, colspan: 1},
            {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 1},
            {header: 'A&ntilde;os posteriores', rowspan: 2}
        ], [
            {align: 'left', header: 'Total ejecutado hasta'},
            {align: 'left', header: 'Estimado'},
            {align: 'left', header: 'Plan'},
            {align: 'left', header: 'Proyecci&oacute;n'}
        ]
    ];
    this.gpExplotacion = new Ext.grid.EditorGridPanel({
        frame: true,
        disabled: false,
        editable: true,
        width: 510,
        master_column_id: 'nivelact',
        // autoExpandMin: 165,
        // split: true,
        region: 'south',
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
                if ((_this.mpposterioresExplo[index] < 0) || (_this.arraydesgloseExplo[0] > parseInt(cantidad))) {
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
            /* cantidad = (obj.record.data.cantidad != "") ? obj.record.data.cantidad : 0;
             _this.stExplotacion.getModifiedRecords().forEach(function(record) {
             datos.push(record.data)
             })
             if (datos.length != 0)
             _this.btnGuardarExplotacion.enable();
             
             if ((_this.mpposterioresExplo[obj.row] < 0) || (_this.arraydesgloseExplo[0] > parseInt(cantidad))) {
             _this.btnGuardarExplotacion.disable();
             }
             else {
             _this.btnGuardarExplotacion.enable();
             }*/
        },
        cm: _this.cmExplotacion,
        tbar: [_this.btnAdicionarExplotacion, _this.btnEliminarExplotacion, _this.btnGuardarExplotacion],
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
    this.smAdicionarNeveles = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, ri, record) {

            },
            rowdeselect: function(sm, ri, record) {

            }
        }
    });
    this.cmAdicionarNeveles = new Ext.grid.ColumnModel([
        _this.smAdicionarNeveles,
        {
            id: 'expandir',
            header: "Nivel de actividad",
            width: 150,
            sortable: true,
            dataIndex: 'denominacion'
        }
    ]);
    this.stcbpaginadon = new Ext.data.SimpleStore({
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
    this.cbpaginadon = new Ext.form.ComboBox({
        value: 80,
        store: _this.stcbpaginadon,
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
                _this.ptGridpAdicionarNeveles.pageSize = record.data.idnumpag;
                _this.ptGridpAdicionarNeveles.doLoad(_this.ptGridpAdicionarNeveles.cursor);
            }
        }
    });
    this.gpAdicionarNeveles = new Ext.grid.GridPanel({
//title: 'Constructor',
        id: 'gpAdicionarNeveles',
        frame: true,
        disabled: false,
        split: true,
        region: 'center',
        autoScroll: true,
        stripeRows: true,
        height: 200,
        store: _this.stAdicionarNeveles,
        sm: _this.smAdicionarNeveles,
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        //plugins: new Ext.ux.plugins.XGrid(),
        listeners: {
            click: function() {
            },
            focus: function() {
            }
        },
        loadMask: {
            msg: 'Cargando...'
        },
        cm: _this.cmAdicionarNeveles,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'paginado5',
            //width: screen.width-60,
            store: _this.stAdicionarNeveles,
            displayInfo: true,
            items: ['-', _this.cbpaginadon]
        })
                //_this.cbpaginadon]
    });
    this.ptGridpAdicionarNeveles = new Ext.PagingToolbar({
        pageSize: _this.cbpaginadon.getValue(),
        store: _this.stAdicionarNeveles,
        width: 400,
        displayInfo: true
    });
    this.winAdicionarNeveles = new Ext.Window({
        title: 'Adicionar nivel de actividad',
        closable: true,
        //  graggable: false,
        //maximized: true,
        modal: true,
        closeAction: 'hide',
        border: false,
        layout: 'border',
        width: 600,
        height: 500,
        buttons: [
            {
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar datos',
                handler: function() {
                    _this.winAdicionarNeveles.hide();
                }
            }, {
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                text: 'Aplicar',
                tooltip: 'Guardar datos sin cerrar ventana',
                handler: function() {
                    _this.AdicionarNeveles();
                    _this.smAdicionarNeveles.clearSelections();
                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                text: 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana',
                handler: function() {
                    _this.AdicionarNeveles();
                    _this.winAdicionarNeveles.hide();
                }
            }
        ],
        items: [_this.gpAdicionarNeveles]
    });
    ///**** Fin de Explotacion ***** 

    this.pGeneral = new Ext.Panel({
        layout: 'border',
        region: 'center',
        border: false,
        maximized: true,
        frame: true,
        // width: 1070,
        height: 1500,
        items: [_this.gpOtrosindicadores, _this.gpExplotacion]
    });
//valor por defecto de los grid
    function valorCero(v) {
        if (!v)
            return 0;
        else
            return v;
    }

    function renderUM(idunidadmedida) {
        var index = _this.stum.find('idunidadmedida', idunidadmedida);
        if (index > -1) {
            var record = _this.stum.getAt(index);
            return record.get('um');
        }
        return idunidadmedida;
    }
    function annosPosteriores(value, meta, record, rowIndex) {
        cantidad = (record.data.cantidad != "") ? record.data.cantidad : 0;
        total = (record.data.aantetotal != "") ? record.data.aantetotal : 0;
        estimado = (record.data.anteestimado != "") ? record.data.anteestimado : 0;
        plan = (record.data.actualplan != "") ? record.data.actualplan : 0;
        proyecc = (record.data.posproyeccion != "") ? record.data.posproyeccion : 0;
        _this.mpposteriores[rowIndex] = parseInt(cantidad) - (parseInt(total) + parseInt(estimado)
                + parseInt(plan) + parseInt(proyecc));
        sennalarfila(record, 2);
        return  _this.mpposteriores[rowIndex];
    }
    function annosposterioresExpl(value, meta, record, rowIndex) {
        cantidad = (record.data.cantidad != "") ? record.data.cantidad : 0;
        total = (record.data.aantetotal != "") ? record.data.aantetotal : 0;
        estimado = (record.data.anteestimado != "") ? record.data.anteestimado : 0;
        plan = (record.data.actualplan != "") ? record.data.actualplan : 0;
        proyecc = (record.data.posproyeccion != "") ? record.data.posproyeccion : 0;
        _this.mpposterioresExplo[rowIndex] = parseInt(cantidad) - (parseInt(total) + parseInt(estimado)
                + parseInt(plan) + parseInt(proyecc));
        sennalarfila(record, 1);
        return  _this.mpposterioresExplo[rowIndex];
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
        mostrarMensaje(2, '�Est&aacute; seguro que quiere eliminar el(los) nivel(es) de actividad seleccionado(s)?', function(btnoprimido) {
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
    this.AdicionarNeveles = function() {
        var arrayNiveles = [];
        var arrayNivelesSeleccionados = _this.smAdicionarNeveles.getSelections();
        if (arrayNivelesSeleccionados.length > 0) {
            for (var i = 0; i < arrayNivelesSeleccionados.length; i++) {
                arrayNiveles[i] = arrayNivelesSeleccionados[i].data;
            }
        }
        _this.BarraEstado('Adicionando nivel(es) de actividad..');
        Ext.Ajax.request({
            url: 'adicionarInvCapExp',
            params: {
                arrayidniveles: Ext.encode(arrayNiveles),
                idejercicio: opciones.ejercicio.idejercicio,
                idinversion: _this.inversion
            },
            callback: function(options, success, response) {
                Ext.MessageBox.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgA === 1) {
                    mostrarMensaje(1, 'El(Los) nivel(es) de actividad ha(n) sido adicionados(s) satisfactoriamente.');
                    _this.stExplotacion.reload();
                }
            }
        });
    }
//***
    this.GuardarOtrosindicadores = function() {
        arrayOtrosInd = new Array();
        records = _this.stOtrosindicadores.getModifiedRecords();
        _this.stOtrosindicadores.commitChanges();
        for (var i = 0; i < records.length; i++) {
            arrayOtrosInd.push(records[i].data);
        }
        _this.BarraEstado('Guardando otros indicadores..');
        Ext.Ajax.request({
            url: 'guardarOtrosindicadores',
            params: {
                valores: Ext.encode(arrayOtrosInd),
                idejercicio: opciones.ejercicio.idejercicio,
                aaejercicio: opciones.ejercicio.ejercicio - 2,
                aejercicio: opciones.ejercicio.ejercicio - 1,
                pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
                idinversion: _this.inversion
            },
            callback: function(options, success, response) {
                Ext.MessageBox.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgOI === 1) {
                    mostrarMensaje(1, 'El(Los) otro(s) inicador(es) ha(n) sido guardado(s) satisfactoriamente.');
                    _this.stOtrosindicadores.reload();
                }
            }
        });
    }
//***
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
                pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
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
    function sennalarfila(record, aux) {
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
        desglose_total += parseInt(total);
        desglose_total += parseInt(total1);
        desglose_total += parseInt(total2);
        desglose_total += parseInt(total3) + parseInt(estimado) + parseInt(estimado1) + parseInt(estimado2) + parseInt(estimado3);
        desglose_total += parseInt(plan) + parseInt(plan1) + parseInt(plan2) + parseInt(plan3);
        desglose_total += parseInt(proyecc1) + parseInt(proyecc2) + parseInt(proyecc3) + parseInt(proyecc4)
        if (aux === 2) {
            _this.arraydesglose[0] = desglose_total;
            return _this.arraydesglose;
        } else {
            _this.arraydesgloseExplo[0] = desglose_total;
            return _this.arraydesgloseExplo;
        }



    }
    this.Resumen = function() {
        if (_this.checkResumen.getValue() === false) {

            this.cmOtrosindResumen = new Ext.grid.ColumnModel([
                {width: 250, dataIndex: 'otrosindicadores', align: 'left', id: 'otrosindicadores'},
                {width: 100, dataIndex: 'descripcion', align: 'left', id: 'descripcion'},
                {width: 100, dataIndex: 'cantidad', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aantetotal', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteestimado', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteplan', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'antetotal', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'anteestimado', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'anteplan', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'anteproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualtotal', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualestimado', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualplan', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'postotal', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'posestimado', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'posplan', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'posproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 100, dataIndex: 'annospos', align: 'left', renderer: annosPosteriores}
            ]);
            this.cmOtrosindResumen.headers = [
                [
                    {header: 'Otros indicadores', rowspan: 3},
                    {header: 'UM', rowspan: 3},
                    {header: 'Cantidad', rowspan: 3}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2, colspan: 4},
                    {header: opciones.ejercicio.ejercicio - 1, colspan: 4},
                    {header: opciones.ejercicio.ejercicio, colspan: 4},
                    {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 4},
                    {header: 'A&ntilde;os posteriores', rowspan: 2}
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
            this.cmExplotacionGen = new Ext.grid.ColumnModel([
                {width: 200, dataIndex: 'nivelact', align: 'left', id: 'nivelact'},
                {width: 100, dataIndex: 'um', align: 'left'},
                {width: 100, dataIndex: 'cantidad', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aantetotal', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteestimado', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteplan', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'antetotal', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'anteestimado', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'anteplan', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'anteproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualtotal', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualestimado', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualplan', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'actualproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'postotal', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'posestimado', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'posplan', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 80, dataIndex: 'posproyeccion', align: 'left', editor: new Ext.form.NumberField({
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                }), renderer: valorCero},
                {width: 100, dataIndex: 'annospos', align: 'left', renderer: annosposterioresExpl}
            ]);
            this.cmExplotacionGen.headers = [
                [
                    {header: 'Nivel de actividad', rowspan: 3},
                    {header: 'UM', rowspan: 3},
                    {header: 'Cantidad', rowspan: 3}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2, colspan: 4},
                    {header: opciones.ejercicio.ejercicio - 1, colspan: 4},
                    {header: opciones.ejercicio.ejercicio, colspan: 4},
                    {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 4},
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
            _this.gpOtrosindicadores.reconfigure(_this.stOtrosindicadores, _this.cmOtrosindResumen);
            _this.gpExplotacion.reconfigure(_this.stExplotacion, _this.cmExplotacionGen);
        } else {
            _this.gpOtrosindicadores.reconfigure(_this.stOtrosindicadores, _this.cmOtrosindicadores);
            _this.gpExplotacion.reconfigure(_this.stExplotacion, _this.cmExplotacion);
        }
    };


    function cargarDatosGrid(value, meta, record, rowIndex, column) {
        var cantidad = _this.stOtrosindicadores.getCount();
        var records = [];
        records = _this.stOtrosindicadores.getRange();
        var valorfondo = 0;
        var valorfondo1 = 0;
        var valorfondo2 = 0;
        var valorfondo3 = 0;

        if (record.data.idnomotrosindicadores === 124) {
            valorfondo = records[rowIndex].data.aanteplan;
            valorfondo1 = records[rowIndex].data.anteplan;
            valorfondo2 = records[rowIndex].data.actualplan;
            valorfondo3 = records[rowIndex].data.posplan;
        }

        if (record.data.idnomotrosindicadores === 126/*rowIndex == cantidad - 1*/) {
            if (column === 5) {
                if (valorfondo === "") {
                    value = 0;
                } else {
                    value = /*records[cantidad - 4].data.aanteplan*/valorfondo / obj.plan_mp1_globall;
                }

                return value;
            } else if (column === 9) {
                if (valorfondo1 === "") {
                    value = 0;
                } else {
                    value = /*records[cantidad - 4].data.anteplan*/valorfondo1 / obj.plan_mp1_globall;
                }
                return value;
            } else if (column === 13) {
                if (valorfondo2 === "") {
                    value = 0;
                } else {
                    value = /*records[cantidad - 4].data.actualplan*/valorfondo2 / obj.plan_mp1_globall;
                }
                return value;

            } else if (column === 17) {

                if (valorfondo3 === "") {
                    value = 0;
                } else {
                    value = /*records[cantidad - 4].data.posplan*/ valorfondo / obj.plan_mp1_globall;
                }
                return value;
            }
        }
        else if (record.data.idnomotrosindicadores === 126/*rowIndex == cantidad - 2*/) {

            if (column == 5) {
                value = (records[cantidad - 3].data.aanteplan + (obj.plan_mp1_globall + obj.plan_mp1_globalll)) - records[cantidad - 4].data.aanteplan;
                return value;
            } else if (column == 9) {
                value = (records[cantidad - 3].data.aanteplan + (obj.plan_mp2_globall + obj.plan_mp2_globalll)) - records[cantidad - 4].data.anteplan;
                return value;
            } else if (column == 13) {
                value = (records[cantidad - 3].data.aanteplan + (obj.plan_mp3_globall + obj.plan_mp3_globalll)) - records[cantidad - 4].data.actualplan;
                return value;
            } else if (column == 17) {
                value = (records[cantidad - 3].data.aanteplan + (obj.plan_mp4_globall + obj.plan_mp4_globalll)) - records[cantidad - 4].data.posplan;
                return value;
            }

        } else {
            if (!value)
                return 0;
            else
                return value;
        }

    }





}