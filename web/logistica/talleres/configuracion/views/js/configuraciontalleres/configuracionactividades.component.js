Ext.ns('Ext.erp');
Ext.ns('Ext.erp.configuracionactividades');
Ext.erp.configuracionactividades = Ext.extend(LOG.util.Panel, {
    idactividadesServicios: undefined,
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border'; 
        /*   this.gridServActividades = new Ext.erp.gridServActividades({
               idioma:config.idioma
           });
           this.gridServActividades.init();*/
        this.panelGridServActividades = new Ext.erp.treeGridServActividades({
            idioma: config.idioma,
            scope: _this
        });

        //Grid Actividades
        this.gridActividades = new Ext.erp.gridActividades({
            idioma: config.idioma,
            scope: _this
        });
        this.gridActividades.init();
        this.actividades = this.gridActividades.view();
        this.actividades.setHeight(320);


        //Grid Servicios
        this.gridServicios = new Ext.erp.gridServicios({
            idioma: config.idioma,
            scope: _this,
        });
        this.gridServicios.init();
        this.servicios = this.gridServicios.view();
        this.servicios.setHeight(320);


        //grid Norma Actividades
        this.gridNormaActividades = new Ext.erp.gridNormaActividades({
            idioma: config.idioma,
            scope: _this
        });
        this.gridNormaActividades.init();
        this.panelGridNormaActividades = this.gridNormaActividades.view();

        //panel Servicios
        this.panelServ = new LOG.util.Panel({
            frame: true,
            items: [this.servicios],
            title: 'Servicios',
            autoHeight: true

        });
        //panel Actividades
        this.panelAct = new LOG.util.Panel({
            frame: true,
            items: [this.actividades],
            title: 'Actividades',
            autoHeight: true

        });

        // Columna ServicioActividades
        this.columFormSA = this.ponerEnColumna(this.panelServ, this.panelAct);
        this.panelConfiguracion = LOG.util.UIManager.initPanel({
            region: 'center',
            labelAlign: 'left',
            layout: 'form',
            items: [/*this.panelGridServActividades,*/ this.columFormSA,
                new Ext.Panel({
                    title: 'Norma de la actividad',
                    /*region:'south',*//*,collasible:true,*/
                    items: [this.panelGridNormaActividades]
                })
            ]
        });


        config.items = [
            {
                region: 'center',
                frame: true,
                autoScroll: true,
                items: [this.panelConfiguracion]
            }

        ];
        config.tbar = ['->', LOG.util.Prototipos.botonAyuda({id: 'ayudaconfiguracionactividades'})];
        Ext.erp.configuracionactividades.superclass.constructor.call(this, config);
        this.panelConfiguracion.on({
            'render': function () {
                var altura = _this.getHeight() / 2 - 46;
//_this.panelGridServActividades.setHeight(altura + 30);
                _this.panelGridNormaActividades.setHeight(altura - 30);
            }
        });
        this.on({
            'resize': function () {
                var altura = _this.getHeight() / 2 - 46;
                //_this.panelGridServActividades.setHeight(altura + 30);
                _this.panelGridNormaActividades.setHeight(altura - 30);
            }
        });

        this.gridServicios.getStorePrincipal().reload();
      //  console.info(this.gridServicios.getSmPrincipal());
        this.gridServicios.getSmPrincipal().on({
            rowselect: function () {
                let getSelected = _this.gridServicios.getSmPrincipal().getSelected();
                let idactividad = getSelected.id;
                _this.gridActividades.getStorePrincipal().on({
                    'beforeload': function (store) {
                        var limit = _this.gridActividades.getGridPrincipal().initialConfig.bbar.pageSize;
                        store.initBaseParams = {
                            idactividadesServicios: idactividad,
                            limit: limit
                        }
                    }
                });
                _this.gridActividades.getStorePrincipal().load();
            }
        });
        this.gridActividades.getSmPrincipal().on({
            rowselect: function () {
                let getSelected = _this.gridActividades.getSmPrincipal().getSelected();
                let idactividad = getSelected.id;
                _this.gridNormaActividades.getStorePrincipal().on({
                    'beforeload': function (store) {
                        var limit = _this.gridNormaActividades.getGridPrincipal().initialConfig.bbar.pageSize;
                        store.initBaseParams = {
                            idActividad: idactividad,
                            limit: limit
                        }
                    }
                });
                _this.gridNormaActividades.getStorePrincipal().load();
            }
        });
      /*  this.gridNormaActividades.getStorePrincipal().load({
            params: {
                idActividad: rec.data.idactividad
            }
        });*/
       /* this.gridActividades.getSmPrincipal().on({
            rowselect: function () {
                let getSelected = _this.gridActividades.getSmPrincipal().getSelected();
                let idactividad = getSelected.id;
                _this.gridNormaActividades.getStorePrincipal().load();
            }
        });*/


    },
    ponerEnColumna: function (elemento1, elemento2) {
        var columna = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        columna.addComponent(elemento1);
        columna.addComponent(elemento2);
        return columna;
    }
});
Ext.erp.treeGridServActividades = Ext.extend(Ext.Panel, {

    /**
     *
     */
    urlController: '',
    /**
     *
     */
    idioma: '',
    /**
     *
     */
    codigo: true,
    /**
     *
     */
    idnodo: 0,
    buscar: false,
    modelo: undefined,
    /**
     *
     */
    constructor: function (config) {

        this.scope = config.scope;
        Ext.erp.treeGridServActividades.superclass.constructor.call(this, config);
        this.modelo = new Ext.erp.ModelActv({idioma: this.idioma});
    },
    initComponent: function () {
        var _this = this;
        this.btnAdicionar = new Ext.Button({
            text: 'Adicionar',
            tooltip: 'Adicionar actividad',
            iconCls: 'adicionar',
            handler: function () {
                console.info(_this.scope.gridServicios)
                if (_this.scope.gridServicios.smGridPrincipal.hasSelection()){
                    console.info('siiiii')
                    this.btnAdicionar.enable();
                }
                else {
                    console.info('noooo')
                    this.btnAdicionar.disable(); 
                }
                var selected = _this.selectionModeActividades.hasSelection() ? _this.selectionModeActividades.getSelected() : false;
                if (selected && !selected.data.idindicador) {   //pq las actv de primer nivel no tienen indicador
                    var venAct = new Ext.erp.gridSelectActividades({
                        idioma: _this.idioma,
                        idactividad: selected.data.idactividad
                    });
                    venAct.init();
                    venAct.view();
                    venAct.getVistaPrincipal().height = 400;
                    venAct.getVistaPrincipal().width = 600;
                    venAct.getStorePrincipal().load({});
                    venAct.getVistaPrincipal().aceptarFn = function () {
                    var selections = venAct.getSmPrincipal().getSelections();
                    if(selections[0].data.tiempoplanificado==""){
                        mostrarMensaje(3, 'No se pueden guardar las actividades sin la cantidad planificada.')
                    }else{
                        var arr = new Array();
                        Ext.each(selections, function (rec) {
                            rec.data.idpadre = selected.data.idactividad;
                            rec.data.idarbol = selected.data.idactividad;
                            arr.push(rec.data);
                            venAct.getStorePrincipal().remove(rec);
                        });
                        _this.modelo.guardarActividad({actividades: Ext.encode(arr)}, function (resp) {
                            //_this.selectionModeActividades.clearSelections();
                            _this.treeLoader.load();
                        });
                    }
                    }
                } else {
                    console.log('entre');
                    var ventana = new Ext.erp.winAddActividad({height: 250, width: 400, title: 'Adicionar servicio'});
                    ventana.show();
                    ventana.aceptarFn = function () {
                        //console.info('2');
                        _this.modelo.guardarActividad({actividades: ventana.getDatosGuardar()}, function (resp) {
                            _this.treeLoader.load();
                        });
                    }
                }
            }
        });
        this.btnModificar = new Ext.Button({
            text: 'Modificar',
            tooltip: 'Modificar actividad',
            iconCls: 'modificar',
            disabled: true,
            handler: function () {
                var selected = _this.selectionModeActividades.hasSelection() ? _this.selectionModeActividades.getSelected() : false;
                console.info(_this.selectionModeActividades.hasSelection())
                if (selected && !selected.data.idpadre) {                
                    var ventana = new Ext.erp.winAddActividad({height: 250, width: 400, title: 'Modificar actividad'});
                    ventana.modificar(selected);
                    ventana.show();
                       console.info(this);
                    ventana.aceptarFn = function () {                        
                        var arr = new Array();                       
                        Ext.each(selected, function (rec) {                           
                            rec.data.idactividad = selected.data.idactividad;
                            rec.data.tiempoplanificado = selected.data.tiempoplanificado;
                            rec.data.porcentual = ventana.chack.getValue();
                            rec.data.um = ventana.UM.getValue();
                            rec.data.minimo = ventana.textMinimo1.getValue()!= '' ? this.textMinimo1.getValue() : null ,
                            rec.data.maximo = ventana.textMaximo1.getValue()!= '' ? this.textMaximo1.getValue() : null ,  
                            rec.data.medida = ventana.medida1.getValue();               
                            rec.data.modificar = 1;
                            arr.push(rec.data);                            
                        });
                        _this.modelo.guardarActividad({actividades: Ext.encode(arr)}, function (resp) {
                            _this.selectionModeActividades.clearSelections();
                            _this.treeLoader.load();
                        });
                    }
                } else {
                    mostrarMensaje(3, 'S\xf3lo se modifican los servicios');
                }
            }
        });
        this.btnDuplicar = new Ext.Button({
            text: 'Duplicar',
            tooltip: 'Duplicar actividad',
            iconCls: 'duplicar',
            disabled: true,
            handler: function () {
                var selected = _this.selectionModeActividades.hasSelection() ? _this.selectionModeActividades.getSelected() : false;
              //  console.info(selected)
                if (selected && !selected.data.idpadre) {
                    var ventana = new Ext.erp.winDupActividad({height: 250, width: 400, title: 'Duplicar actividad'});
                    ventana.duplicar(selected);
                    ventana.show();
                    ventana.aceptarFn = function () {
                        _this.modelo.duplicarActividad({servicio: ventana.duplicarDatosGuardar(selected)}, function (resp) {
                            _this.selectionModeActividades.clearSelections();
                            _this.treeLoader.load();
                        });
                    }
                } else {
                    mostrarMensaje(3, 'S\xf3lo se duplican las actividades del primer nivel');
                }
            }
        });
        this.btnEliminar = new Ext.Button({
            text: 'Eliminar',
            tooltip: 'Eliminar actividad',
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                if (_this.selectionModeActividades.hasSelection()) {
                    var idactividades = new Array();
                    Ext.each(_this.selectionModeActividades.getSelections(), function (item) {
                        idactividades.push(item.id);
                    });
                    //eliminar actividades
                    _this.modelo.eliminar({ids: Ext.encode(idactividades)}, function (resp) {
                        _this.treeLoader.load({
                            params: {anode: null}
                        });
                    });
                }
            }
        });
        this.btnUsarEntidad = new Ext.Button({
            text: _this.idioma.lbBtnUsar,
            tooltip: _this.idioma.tipBtnUsar,
            iconCls: 'usarentidad verde',
            disabled: true,
            handler: function () {
                if (_this.selectionModeActividades.hasSelection()) {
                    var ids = new Array();
                    Ext.each(_this.selectionModeActividades.getSelections(), function (rec) {
                        /*if (!rec.json.identidad)*/
                        console.info(rec)
                        ids.push(rec.json.id);
                    });
                    _this.modelo.usarEntidad({ids: Ext.encode(ids), usar: true}, function (resp) {
                        _this.gridServActividades.store.load({params: {anode: null, start: 0}});
                        _this.gridServActividades.view().refresh();
                    });
                }
            }
        });
        this.btnNoUsarEntidad = new Ext.Button({
            text: _this.idioma.lbBtnNoUsar,
            tooltip: _this.idioma.tipBtnNoUsar,
            iconCls: 'usarentidad rojo',
            disabled: true,
            hidden: false,
            handler: function () {
                var select = _this.selectionModeActividades.getSelections();
                var ids = new Array();
                Ext.each(select, function (rec) {
                    // if (rec.json.identidad)
                      ids.push(rec.json.id);
                });
                _this.modelo.usarEntidad({ids: Ext.encode(ids)}, function (resp) {
                    _this.gridServActividades.store.load({params: {anode: null, start: 0}});
                    _this.gridServActividades.view().refresh();
                });
            }
        });
        this.btnModificarCantPlan = new Ext.Button({
            text: 'Actualizar',
            tooltip: 'Actualizar Cantidades Planificada',
            iconCls: 'actualizar',
            handler: function () {
                var modified = _this.selectionModeActividades.hasSelection() ? _this.selectionModeActividades.getSelected() : false;
                if (!Ext.isEmpty(modified)) {
                    var recordsToSend = [];
                    Ext.each(modified, function (record) {
                       // console.log(record);
                        modified.data.idactividad = record.data.idactividad;
                        recordsToSend.push(Ext.apply(record.data));
                      //  console.log(modified.data.idactividad)
                    });
                    _this.gridServActividades.stopEditing();
                    _this.modelo.guardarActividad({actividades: Ext.encode(recordsToSend)}, function (resp) {
                        //_this.selectionModeActividades.clearSelections();
                        _this.gridServActividades.getStore().commitChanges();
                        _this.treeLoader.load();


                    });
                }
            }
        });
        var btns = [this.btnAdicionar, this.btnModificar, this.btnDuplicar, this.btnEliminar, '-', this.btnUsarEntidad, this.btnNoUsarEntidad,
            '->', this.btnModificarCantPlan]
        // btns = btns.concat(['->', this.btnAyuda]);
        this.panelBotones = new Ext.Panel({
            tbar: btns,
            border: false,
            region: 'north'
        });
        this.btnBuscar = new Ext.Button({
            text: 'Buscar',
            tooltip: 'Buscar actividad',
            iconCls: 'buscar'
        });
        this.btnLimpiar = new Ext.Button({
            text: 'Limpiar',
            tooltip: 'Limpiar filtros',
            iconCls: 'limpiar'
        });
        this.tfDenomFiltro = new Ext.form.TextField({
            id: 'denominacion',
            maxLength: 255,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (t, e) {
                    if (e.getKey() == 13) {
                        // _this.btnBuscar.fireEvent('click');
                    }
                }
            }
        });
        this.btnBuscar.on({
            'click': function () {
                _this.buscar = true;
                var objParams = {
                    start: 0
                };
                if (_this.tfDenomFiltro.getValue()) {
                    objParams.denominacion = _this.tfDenomFiltro.getValue();
                } else {
                    mostrarMensaje(3, 'Debe introducir un criterio de busqueda');
                    return;
                }
                _this.treeLoader.reload({
                    params: objParams
                });
            }
        });
        this.btnLimpiar.on({
            'click': function () {
                _this.buscar = false;
                _this.tfDenomFiltro.reset();
                _this.treeLoader.load(
//                         {
//                    params: {
//                        start: 0,
//                        codigo: '',
//                        denominacion: ''
//                    }
//                }
                );
            }
        });
        this.tfFiltro = new Ext.form.TextField({
            id: 'tffiltro'
        });

        var fields = [
            {
                name: '_emptyval'
            },
            {
                name: 'idactividad'
            },
            {
                name: 'codigo'
            },
            {
                name: 'estado'
            },
            {
                name: 'tiempoplanificado'
            },
            {
                name: 'umedida'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'idindicador'
            },
            {
                name: 'idarbol'
            },
            {
                name: 'ordenizq'
            },
            {
                name: 'ordender'
            },
            {
                name: 'idpadre'
            },
            {
                name: '_is_leaf'
            },
            {
                name: '_parent'
            },
            {
                dataIndex: 'idindicador'
            },
            {
                dataIndex: 'idpadre'
            },
            {
                dataIndex: 'identidad'
            },
            {
                dataIndex: 'usatodasnormas'
            }
        ];
        this.treeLoader = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            url: '/logistica/talleres/configuracion/index.php/configuracionactividades/cargarActividades',
            baseParams: {
                treesearch: 1
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: 'idactividad',
                fields: fields
            })
        });
        _this.treeLoader.on({
            'load': function (st, recs) {
                if (_this.buscar && recs.length == 0) {
                    mostrarMensaje(1, 'No se encontraron servicios para el criterio de b\xfaqueda especificado');
                }
            }
        })
        var columns = [
            new Ext.grid.RowNumberer(
                {
                    header: 'No.',
                    width: 30
                }), {
                header: 'C\xf3digo',
                sorteable: true,
                dataIndex: 'codigo',
                align: 'right',
                width: 80
            }, {
                header: 'Denominaci\xf3n',
                sorteable: true,
                dataIndex: 'denominacion',
                id: 'expandid'
            }, {
                header: 'Cantidad planificada',
                sorteable: true,
                dataIndex: 'tiempoplanificado',
                align: 'right',
                width: 70,
                editor: LOG.util.Prototipos.inputDecimal({
                    allowBlank: false,
                    minValue: 0
                }),
                renderer: function (v) {
                    return Ext.util.Format.number(v, '0,000.00');
                },
            },
            {
                header: 'UM',
                sorteable: true,
                dataIndex: 'umedida',
                align: 'right',
                width: 50
            }
            , {
                header: 'Usa todas las actividades',
                width: 130,
                dataIndex: 'usatodasnormas',
                sorteable: true,
                renderer: function (val, metaData, rec) {
                    if (rec.json.usatodasnormas == 1) {
                        metaData.css = 'icondistra-aceptar verde';
                        metaData.attr = 'ext:qtip="Si"';
                    } else {
                        metaData.css = 'icondistra-aceptar rojo';
                        metaData.attr = 'ext:qtip=" No"';
                    }
                }
            }, {
                header: 'Usar entidad',
                width: 80,
                dataIndex: 'identidad',
                sorteable: true,
                renderer: function (val, metaData, rec) {
                    if (rec.json.identidad) {
                        metaData.css = 'icondistra-aceptar verde';
                        metaData.attr = 'ext:qtip="Si"';
                    } else {
                        metaData.css = 'icondistra-aceptar rojo';
                        metaData.attr = 'ext:qtip=" No"';
                    }
                }
            }
        ];
        this.columnasActividades = new Ext.grid.ColumnModel(columns);
        this.selectionModeActividades = new Ext.grid.RowSelectionModel({});
        this.selectionModeActividades.on({
            'rowselect': function (sm, index, rec) {
                _this.idnodo = rec.data.idpadre == rec.id ? 0 : rec.data.idpadre;
                if (rec.data.idindicador != null) {
                    // _this.activarBotones();
                    _this.scope.gridNormaActividades.getStorePrincipal().reload();
                } else {
                    //_this.scope.gridNormaActividades.getStorePrincipal().removeAll();
                    //_this.activarBotones();
                }
                var selectedServ = _this.selectionModeActividades.hasSelection() ? _this.selectionModeActividades.getSelected() : false;
                if (selectedServ && !selectedServ.data.idindicador) {
                }
            },
            'rowdeselect': function (sm, index, rec) {
                _this.idnodo = 0;
                //  _this.activarBotones();
                _this.scope.gridNormaActividades.getStorePrincipal().removeAll();
            }
        });
        this.gridServActividades = new Ext.ux.maximgb.EditorGridPanel({
            region: 'center',
            height: 500,
            border: false,
            root_title: 'actv',
            stripeRows: true,
            tbar: [new Ext.menu.TextItem({
                text: 'Denominaci\xf3n' + ':'
            }), '', this.tfDenomFiltro, '', _this.btnBuscar, '', this.btnLimpiar],
            autoExpandColumn: 'expandid',
            master_column_id: 'expandid',
            cm: _this.columnasActividades,
            store: _this.treeLoader,
            sm: _this.selectionModeActividades,
            st: _this.storePrincipal,
            loadMask: {
                store: _this.treeLoader
            },
        });
        /**
         * Acciones de los botones de la UI
         */
        Ext.apply(this, {
            layout: 'border',
            items: [this.panelBotones, this.gridServActividades]
        });
        Ext.erp.treeGridServActividades.superclass.initComponent.call(this);
        this.gridServActividades.on({
            'beforeedit': function (e) {
                if (!e.record.data._is_leaf) {
                    e.cancel = true;
                }
            }
        });
        _this.treeLoader.load({
            params: {
                start: 0
            }
        });
    },
    // activarBotones: function () {
    //     this.btnModificar.disable();
    //     this.btnDuplicar.disable();
    //     this.btnEliminar.disable();
    //     this.btnUsarEntidad.disable();
    //     this.btnNoUsarEntidad.disable();
    //     this.btnModificarCantPlan.disable();
    //     var _this = this;
    //     var itemSeleccionado = _this.selectionModeActividades.getSelected();
    //     if (_this.selectionModeActividades.getCount() > 0) {
    //         _this.btnEliminar.enable();
    //         if (_this.selectionModeActividades.getCount() == 1)
    //             _this.btnModificar.enable();
    //         _this.btnDuplicar.enable();
    //         _this.btnModificarCantPlan.enable();
    //         if (itemSeleccionado.id <= 0) {
    //             _this.btnModificar.disable();
    //             _this.btnEliminar.disable();
    //             _this.btnDuplicar.enable();
    //             _this.btnModificarCantPlan.enable();
    //         }
    //         if (itemSeleccionado.json.identidad) {
    //             _this.btnUsarEntidad.disable();
    //             _this.btnNoUsarEntidad.enable();
    //         } else {
    //             _this.btnUsarEntidad.enable();
    //             _this.btnNoUsarEntidad.disable();
    //         }
    //     }
    // },
    getGridPrincipal: function () {
        return this.gridServActividades;
    },
});
//este es el panel de la izquierda. Servicios
Ext.erp.winAddActividad = Ext.extend(LOG.util.Window, {
    idactividad: undefined,
    modificar: undefined,
    scope: undefined,
    servicio: undefined,
    constructor: function (config) {
        this.cerrarAceptar = false;
        this.usarAplicar = false;
        Ext.erp.winAddActividad.superclass.constructor.call(this, config);
        this.listaBotones.getItem(1).disable();
        this.listaBotones.getItem(2).disable();
    },       
    initComponent: function () {
        var _this = this;
        Ext.erp.winAddActividad.superclass.initComponent.call(this);        
        this.width = 600;
        this.height = 360;
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function() {
                _this.destroy();
            }
        });
        this.btnAnterior = LOG.util.UIManager.createBtn({
            iconCls: 'anterior',
            text: 'Anterior',
            hidden: false,
            buttonAlign: "right",
            disabled: false,
            handler: function () { 
                _this.aceptarFn(true);
               if (_this.scope.smGridPrincipal.hasPrevious()) {
                   _this.scope.smGridPrincipal.selectPrevious();
               } else {
                   _this.scope.getSmPrincipal().selectLastRow();
               }
               _this.modificar(_this.scope.smGridPrincipal.getSelected());
           }                   
        
        });
        this.btnSiguiente = LOG.util.UIManager.createBtn({
            iconCls: 'siguiente',
            text: 'Siguiente',
            buttonAlign: "right",
            hidden:false,
            disabled:false,
            handler: function() {
                _this.aceptarFn(true);
                if (_this.scope.smGridPrincipal.hasNext()){
                    
                    


                    _this.scope.smGridPrincipal.selectNext();
                } else {
                    _this.scope.smGridPrincipal.selectFirstRow();
                }
               
                _this.modificar(_this.scope.smGridPrincipal.getSelected());
              
            }
          }); 
        this.textCodigo = new LOG.util.Prototipos.inputTexto({
            fieldLabel: 'C\xf3digo',
            name: 'denominacion',
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    if (_this.textCodigo.isValid() && _this.textDenominacion.isValid()) {
                        _this.listaBotones.getItem(2).enable();
                    } else _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.textDenominacion = new Ext.form.TextArea({
            fieldLabel: 'Denominaci\xf3n',
            anchor: '98%',
            name: 'denominacion',
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    if (_this.textCodigo.isValid() && _this.textDenominacion.isValid()) {
                        _this.listaBotones.getItem(2).enable();
                    } else _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.chackTodas = new Ext.form.Checkbox({
            boxLabel: 'Usa todas las actividades',
            hideLabel: true,
            name: 'usatodasnormas'           
        });
        this.chack = new Ext.form.Checkbox({
            boxLabel:'Porcentual',
            name: 'porcentual',
            hidelabel: true,
            listeners: {
                'check': function(cmp, checked) {
                    if (checked) {
                        _this.UM.setValue(false);
                        //_this.listaBotones.getItem(2).enable();
                    } 
                }
            }
        });
        this.UM = new Ext.form.Checkbox({
            boxLabel:'Dimensión',
            name:'um',
            hidelabel: true,
            listeners: {
                'check': function(cmp, checked) {
                    
                    if (_this.textCodigo.isValid() && _this.textDenominacion.isValid()) {
                        _this.listaBotones.getItem(2).enable();
                    } else _this.listaBotones.getItem(2).disable();
                    if (checked) {
                        _this.medida.enable();
                        _this.chack.setValue(false);
                         } 
                    else {
                        if(_this.adicionar){
                            _this.medida.clearValue();
                        }
                        _this.medida.disable();                        
                    }}
                }
        }); 
        this.textMinimo = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Mínimo',
            name:'minimo',
            width: 280,
            //enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    if (_this.textCodigo.isValid() && _this.textDenominacion.isValid()) {
                        _this.listaBotones.getItem(2).enable();
                    } else _this.listaBotones.getItem(2).disable();
                }
            }
            
        });    
        this.textMaximo = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Máximo',
            name:'maximo',
            width: 280,
            //enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    if (_this.textCodigo.isValid() && _this.textDenominacion.isValid()) {
                        _this.listaBotones.getItem(2).enable();
                    } else _this.listaBotones.getItem(2).disable();
                }
            }       
        });   
        this.medida = new LOG.util.ComboBox({
             url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarComboUM',
             valueField: 'idunidadmedida',
             name: 'idunidadmedida',
             hiddenName: 'idunidadmedida',
             selectOnlyLeaf: true,
             displayField: 'abreviaturaunidadmedida',
             fieldLabel: 'UM',
             //allowBlank: false,
             disabled: true,
             anchor: '100%',
             autoLoad:true
          
         });
        this.cls = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });        
        this.cls.addComponent(this.chackTodas);       
        this.cls.addComponent(this.chack);
        this.cls.addComponent(this.UM);
        this.cls.getColumn(0).columnWidth = 0.70;
        this.cls.getColumn(1).columnWidth = 0.60;
        this.cls.getColumn(2).columnWidth = 0.50;
        this.cls1 = LOG.util.UIManager.initColumnForm({columnas: 1});
        this.cls1.addComponent(this.textMinimo);
        this.cls1.addComponent(this.textMaximo);
        this.cls1.addComponent(this.medida);
        this.formulario = new Ext.FormPanel({
            id        : 'formulario',
            labelAlign: 'top',
            frame     : true,            
            region: 'center',
            height: 400,
            width     :400,
            autoHeight: true,
            items     : [this.textCodigo,  
                         this.textDenominacion, 
                {layout: 'column',
                    items : [this.cls,  this.cls1]
                }
            ],
        });
        if (!this.adicionar) {
            this.addButton(this.btnAnterior);
            this.addButton(this.btnSiguiente);
        }
        this.add(this.formulario);
    },
    show: function() {
        Ext.erp.winAddActividad.superclass.show.call(this);
        this.modificar(false);
    },
    modificar: function (record) {
        if (record) {
            this.idactividad = record.id;
            this.textCodigo.setValue(record.data.codigo);
            this.textDenominacion.setValue(record.data.denominacion);
            this.chackTodas.setValue(+record.json.usatodasnormas);
            this.chack.setValue(record.json.porcentual);
            this.UM.setValue(+record.json.um);
            this.listaBotones.getItem(1).disable();
            this.textMinimo.setValue(record.data.minimo);
            this.textMaximo.setValue(record.data.maximo);
            this.medida.setValue(record.data.abreviaturaunidadmedida);
        }        
    },
    getDatosGuardar: function () {           
                return{
                codigo: this.textCodigo.getValue(),
                denominacion: this.textDenominacion.getValue(),
                usatodasnormas: +this.chackTodas.getValue(),
                porcentual: +this.chack.getValue(),
                idactividad: this.idactividad,
                idarbol: this.idactividad,
                minimo: this.textMinimo.getValue() != '' ? this.textMinimo.getValue() : null,
                maximo: this.textMaximo.getValue() != '' ? this.textMaximo.getValue() : null,
                medida: (this.UM.getValue()) ? this.medida.getValue() : null,
                um: this.UM.getValue()   
                }           
            }   
});
//este es panel de la derecha. Actividades   Los 1
Ext.erp.WinModificarActividad = Ext.extend(LOG.util.Window, {
    scope: undefined,
    idactividad: undefined,
    constructor: function (config) {
        this.usarAplicar = false;
        this.cerrarAceptar = false;
        Ext.erp.WinModificarActividad.superclass.constructor.call(this, config);
        //this.listaBotones.getItem(2).disable(); deshabilita el boton aceptar
    },   
    initComponent: function () {
        var _this = this;
        Ext.erp.WinModificarActividad.superclass.initComponent.call(this);        
        this.width = 430;
        this.height = 250;

        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function() {
                _this.destroy();
            }
        });
        _this.chack1 = new Ext.form.Checkbox({
            boxLabel:'Porcentual',
            name: 'porcentual',
            hidelabel: true,
            listeners: {
                'check': function(cmp, checked) {
                    if (checked) {
                        _this.UM1.setValue(false);
                    } 
                }
            }            
        });
        _this.UM1 = new Ext.form.Checkbox({
            boxLabel:'Dimensión',
            name:'um',
            hidelabel: true,
            listeners: {
                'check': function(cmp, checked) {
                    if (checked) {
                        _this.medida1.enable();
                        _this.chack1.setValue(false);
                         } 
                    else {
                        if(_this.adicionar){
                            _this.medida1.clearValue();
                        }
                        _this.medida1.disable();                        
                    }}
                }
        }); 
        _this.textMinimo1 = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Mínimo',
            allowBlank: true,
            name:'minimo',
            enableKeyEvents: true
        });
        _this.textMaximo1 = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Máximo',
            allowBlank: true,
            name:'maximo',
            enableKeyEvents: true
        });  
        this.medida1 = new LOG.util.ComboBox({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarComboUM',
             valueField: 'idunidadmedida',
             name: 'idunidadmedida',
             hiddenName: 'idunidadmedida',
             selectOnlyLeaf: true,
             displayField: 'abreviaturaunidadmedida',
             fieldLabel: 'UM',
             allowBlank: false,
             disabled: true,
             anchor: '98%',
             autoLoad:true          
         });

        this.tempario = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Tempario',
            allowBlank: true,
            name:'tempario',
            enableKeyEvents: true
        });

         _this.formulario1 = new Ext.FormPanel({
            id        : 'formulario',
            labelAlign: 'top',
            frame     : true,            
            region: 'center',
            height: 800,
            width     :200,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px',
            },
            items     : [
                {layout: 'column',
                    items : [
                        {columnWidth: .50, layout: 'form', items: [_this.chack1]},
                        {columnWidth: .33, layout: 'form', items: [_this.UM1]}
                    ]
                },{layout: 'column',
                    items : [
                        {columnWidth: .5, layout: 'form', items: [_this.textMinimo1]},
                        {columnWidth: .5, layout: 'form', items: [_this.textMaximo1]},
                        {columnWidth: .5, layout: 'form', items: [_this.medida1]},
                        {columnWidth: .5, layout: 'form', items: [_this.tempario]}
                ]
            },
            ],
        });
        _this.btnAnterior1 = LOG.util.UIManager.createBtn({
            iconCls: 'anterior',
            text: 'Anterior',
            hidden: false,
            buttonAlign: "right",
            disabled: false,
            handler: function () { 
                _this.aceptarFn(true);
               if (_this.scope.smGridPrincipal.hasPrevious()) {
                   _this.scope.smGridPrincipal.selectPrevious();
               } else {
                _this.scope.getSmPrincipal().selectLastRow();
               }
               
               _this.modificar(_this.scope.smGridPrincipal.getSelected());
           }                   
        
        });
        this.btnSiguiente1 = LOG.util.UIManager.createBtn({ 
            iconCls: 'siguiente',
            text: 'Siguiente',
            buttonAlign: "right",
            hidden:false,
            disabled:false,
            handler: function() {
                _this.aceptarFn(true);
                if (_this.scope.smGridPrincipal.hasNext()){ 
                    _this.scope.smGridPrincipal.selectNext();
                } else {
                    _this.scope.smGridPrincipal.selectFirstRow();
                }
                _this.modificar(_this.scope.smGridPrincipal.getSelected());
            }
          });     
          _this.addButton(_this.btnAnterior1);
          _this.addButton(_this.btnSiguiente1);
          _this.add(_this.formulario1);
    },
    show: function() {
        Ext.erp.WinModificarActividad.superclass.show.call(this);
        this.modificar(false);    
    },
    modificar: function (record) {
        if (record) {
            this.idactividad = record.id;
            this.chack1.setValue(record.json.porcentual);
            this.UM1.setValue(+record.json.um);          
            this.listaBotones.getItem(1).disable();
            this.textMinimo1.setValue(record.data.minimo);
            this.textMaximo1.setValue(record.data.maximo);
            this.tempario.setValue(record.data.tempario);
            this.medida1.setValue(record.data.abreviaturaunidadmedida);
        }        
    },
    getDatosGuardar: function () {
        return {     
            idactividad: this.idactividad,
            um: this.UM1.getValue(),
            porcentual: this.chack1.getValue(),
            idarbol:this.idactividad,
            minimo: this.textMinimo1.getValue() != '' ? this.textMinimo1.getValue() : null,
            maximo: this.textMaximo1.getValue() != '' ? this.textMaximo1.getValue() : null,
            medida: (this.UM1.getValue()) ? this.medida1.getValue() : null,
            tempario: this.tempario.getValue(),
        }
    }    
});
//Ventana select actividades
Ext.erp.gridSelectActividades = Ext.extend(LOG.util.UITemplate, {
    /**
     * identificador del producto para obtener sus tipos de servicios
     */
    idproducto: undefined,
    /**
     * array de ids de actividades ya seleccionadas
     */
    idexcluir: undefined,
    idactividad: undefined,
    constructor: function (config) {
        this.gridEditable = true;
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = false;
        this.busquedaBasica = true;
        this.modoSeleccion = 3;
        this.dirController = '/logistica/talleres/configuracion/index.php/configuracionactividades';
        this.urlBusquedaGridPrincipal = 'cargarServicios';


        this.textBusquedaSimple = 'Actividades';
        Ext.erp.gridSelectActividades.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = "Adicionar Actividades";
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 260,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true,
        });
        this.addGridColumn({
            header: 'C\xf3digo',
            width: 90,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: 'UM',
            width: 50,
            dataIndex: 'umedida',
            default: true,
            allowBlank: false
        });
        this.addGridColumn({
            header: 'Cantidad',
            width: 60,
            dataIndex: 'tiempoplanificado',
            align: 'right',
            default: true,
            editor: LOG.util.Prototipos.inputDecimal({
                allowBlank: false
            })
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'minimo'
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'maximo'
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'porcentual'
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'medida'
        });

    },
    render: function () {
        var _this = this;
        var vista = Ext.erp.gridSelectActividades.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.idactividad = _this.idactividad
            }
        })
        vista.setHeight(400);
        vista.setWidth(600);
        vista.setTitle('Adicionar actividad');
        return vista;
    },
});
Ext.erp.winDupActividad = Ext.extend(LOG.util.Window, {
    duplicar: undefined,
    duplicarDatosGuardar: undefined,
    constructor: function (config) {
        this.usarAplicar = false;
        Ext.erp.winDupActividad.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();
    },
    initComponent: function () {
        var _this = this;
        Ext.erp.winDupActividad.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function() {
                _this.destroy();
            }
        });
        this.formulario = new LOG.util.UIManager.initForm({
            frame: true,
            border: false,
            width :400,
            autoHeight: true,
            region: 'center',
            labelAlign: 'top'
        });
        var cls = new LOG.util.ColumnForm({
            column: 1
        });
        this.textCodigo = new LOG.util.Prototipos.inputTexto({
            fieldLabel: 'C\xf3digo',
            name: 'denominacion',
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    if (_this.textDenominacion.isDirty()) {
                        _this.listaBotones.getItem(2).enable();
                    } else _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.textDenominacion = new Ext.form.TextArea({//LOG.util.Prototipos.inputTexto({
            fieldLabel: 'Denominaci\xf3n',
            anchor: '98%',
            name: 'denominacion',
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    if (_this.textCodigo.isDirty()) {
                        _this.listaBotones.getItem(2).enable();
                    } else _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.chackTodas = new Ext.form.Checkbox({
            boxLabel: 'Usa todas las Actividades',
            hideLabel: true,
            name: 'usatodasnormas',
            listeners: {
                check: function (cmp, newValue) {
                    if (_this.chackTodas.isValid()) {
                        _this.chackTodas.disable();
                        _this.listaBotones.getItem(2).enable();
                    } else _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.chack = new Ext.form.Checkbox({
            boxLabel:'Porcentual',
            hidelabel: true,
            name:'porcentual',
            listener:{
                check: function (cmp,newValue){
                    if(_this.chack.isValid()){
                        _this.chack.disable();
                        _this.listabotones.getItem(2).enable();
                    } else _this.listabotones.getItem(2).disable();
                }
            }

        });
        this.medida = new LOG.util.ComboBox({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarComboUM',
            valueField: 'idunidadmedida',
            name: 'idunidadmedida',
            hiddenName: 'idunidadmedida',
            selectOnlyLeaf: true,
            displayField: 'abreviaturaunidadmedida',
            fieldLabel: 'UM',
            //allowBlank: false,
            disabled: true,
            anchor: '100%',
            autoLoad:true

        });
        this.formulario.add(this.textCodigo);
        this.formulario.add(this.textDenominacion);
        this.formulario.add(this.chackTodas);
        this.formulario.add(this.chack);
        this.formulario.add(this.medida);
        this.add(this.formulario);
    },
    show: function() {
        Ext.erp.winDupActividad.superclass.show.call(this);
    },
    duplicar: function (record) {
        if (record) {
            this.textCodigo.setValue(record.data.codigo);
            this.textDenominacion.setValue(record.data.denominacion);
            this.chackTodas.setValue(+record.json.usatodasnormas);
            this.listaBotones.getItem(2).disable();
        }
    },
    duplicarDatosGuardar: function (selected) {
        return {
            codigo: this.textCodigo.getValue(),
            denominacion: this.textDenominacion.getValue(),
            usatodasnormas: this.chackTodas.getValue(),
            idactividad: selected.id
        }
    }
});
// Grid Servicio
Ext.erp.gridServicios = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.gridEditable = true;
        this.formaVisualizacion = 'panel';
        this.scope = config.scope;
        this.autoLoad = false;
        this.autoSelect = false;
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.idioma = config.idioma;
        this.dirController = '/logistica/talleres/configuracion/index.php/configuracionactividades',
        this.modelo = new Ext.erp.ModelActv({idioma: this.idioma});
        this.urlBusquedaGridPrincipal = 'cargarActividades'
        Ext.erp.gridServicios.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: 'C\xf3digo',
            dataIndex: 'codigo',
            align: 'left',
            width: 50
        });
        this.addGridColumn({
            header: 'Denominaci\xf3n',
            align: 'left',
            dataIndex: 'denominacion',
            id: 'expandid'
        });
        this.addGridColumn({
            header: 'Usa todas las actividades',
            width: 130,
            align: 'left',
            dataIndex: 'usatodasnormas',
            sorteable: true,
            renderer: function (val, metaData, rec) {
                if (rec.json.usatodasnormas == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="Si"';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip=" No"';
                }
            }
            
        });
        this.addGridColumn({
            header: 'Usar entidad',
            width: 80,
            dataIndex: 'identidad',
            align: 'left',
            renderer: function (val, metaData, rec) {
                if (rec.json.identidad) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="Si"';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip=" No"';
                }
            }
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'minimo'
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'maximo'
        });
        this.addGridColumn({
            hidden: true,
            dataIndex: 'abreviaturaunidadmedida'
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'um'
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'porcentual'
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Adicionar',
            tooltip: 'Adicionar servicios',
            iconCls: 'adicionar',
            handler: function () {
                var selected = _this.getSmPrincipal().hasSelection();
                let getSelected = _this.getSmPrincipal().getSelected();
                var ventana = new Ext.erp.winAddActividad({height: 290, width: 400,resizable:true, title: 'Adicionar servicio',  adicionar: true});
                ventana.show();
                ventana.aceptarFn = function () {

                    if (ventana.textMinimo.getValue() && !ventana.textMaximo.getValue()) {
                        mostrarMensaje(3, 'Debe introducir el valor máximo para realizar esta operacion.');
                    } else if (ventana.textMinimo.getValue() && ventana.textMaximo.getValue() && ventana.textMinimo.getValue() >= ventana.textMaximo.getValue()) {
                        ventana.textMinimo.setValue('');
                        ventana.textMaximo.setValue('');
                        mostrarMensaje(3, 'El valor máximo debe ser mayor que el valor mínimo.');
                        return;
                    } else {
                        _this.guardarServicio({servicio: ventana.getDatosGuardar()}, function (resp) {
                            _this.getStorePrincipal().reload();
                        },null,_this.adicionar);  
                            ventana.close();    
                      }
                    }                 
                      
                 }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Modificar',
            tooltip: 'Modificar servicio',
            iconCls: 'modificar',
            disabled: true,
            handler: function () {
               // console.info(_this.scope.gridServicios)
                var selected = _this.getSmPrincipal().hasSelection();
                let getSelected = _this.getSmPrincipal().getSelected();
                if (selected) {
                    var ventana1 = new Ext.erp.winAddActividad({height: 1000, width: 400,title: 'Modificar servicio', scope: _this, adicionar: false});
                     ventana1.medida.setWidth(50,true);
                     ventana1.show(); 
                     console.log(getSelected.data);
                     ventana1.modificar(getSelected);
                     ventana1.aceptarFn = function (btn = false) {                           
                        if(ventana1.textMinimo.getValue() && ventana1.textMinimo.getValue()!=''){
                            if (ventana1.textMinimo.getValue() >= ventana1.textMaximo.getValue()){
                              ventana1.textMinimo.setValue('');
                              ventana1.textMaximo.setValue('');
                              mostrarMensaje(3, 'El valor máximo debe ser mayor que el valor mínimo.');
                              return;
                              }}     
                              console.log(getSelected.record);
                              _this.guardarServicio({servicio: ventana1.getDatosGuardar()}, function (resp) {
                              _this.getStorePrincipal().reload();
                              _this.scope.gridActividades.getStorePrincipal().reload();
                          //  _this.scope.gridServicios.getStorePrincipal().reload();
                             });
                             if (!btn) {
                                ventana1.close();   
                             }   
            }
                } else {
                    mostrarMensaje(3, 'S\xf3lo se modifican las actividades del primer nivel');
                }
            },
            controlFn: function (b, _caller) {
                //probar con grid servicio 
              //  console.log(_caller);
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {                  
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Duplicar',
            tooltip: 'Duplicar servicio',
            iconCls: 'duplicar',
            disabled: true,
            handler: function () {
                var selected = _this.getSmPrincipal().hasSelection();
                let getSelected = _this.getSmPrincipal().getSelected();
                if (selected) {
                    var ventana = new Ext.erp.winDupActividad({height: 340, width: 400, title: 'Duplicar actividad', scope: _this});
                   // console.info(getSelected)
                    ventana.duplicar(getSelected);
                    ventana.show();
                    ventana.aceptarFn = function () {
                        _this.duplicarServicio({servicio: ventana.duplicarDatosGuardar(getSelected)}, function (resp) {
                            _this.getStorePrincipal().reload();
                            _this.scope.gridActividades.getStorePrincipal().reload();
                        });
                    }
                } else {
                    mostrarMensaje(3, 'S\xf3lo se duplican los servicios');
                }
            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Eliminar',
            tooltip: 'Eliminar servicio',
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var selected = _this.getSmPrincipal().hasSelection();
                let getSelected = _this.getSmPrincipal().getSelected();
                if (selected) {
                    var idactividades = new Array();
                    Ext.each(getSelected, function (item) {
                        idactividades.push(item.id);
                    });
                    //eliminar actividades
                    _this.eliminarServicio({ids: Ext.encode(idactividades)}, function (resp) {
                        _this.scope.gridActividades.getStorePrincipal().reload();
                        _this.getStorePrincipal().reload();
                        /*  _this.treeLoader.load({
                              params: {anode: null}
                          });*/
                    });
                }
            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));
        //esto es servicios
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnUsar,
            tooltip: _this.idioma.tipBtnUsar,
            iconCls: 'usarentidad verde',
            disabled: true,
            handler: function () {
                let getSelect = _this.getSmPrincipal().getSelected();
                    var ids = new Array();
                    ids.push(getSelect.json.id)
                    /*Ext.each(getSelect, function (rec) {
                        ids.push(rec.id);
                    });*/
                    _this.usarEntidad({ids: Ext.encode(ids), usar: true, hijo: true}, function (resp) {
                        _this.getStorePrincipal().reload();
                        _this.scope.gridActividades.getStorePrincipal().reload();
                    });                
            },
            controlFn: function (b, _caller) {

                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    console.info(this.getSelect)
                    if (e == 'selectionchange') {
                        b.disable();
                        this.getSelect = _this.getSmPrincipal().getSelected();
                        if (this.getSelect && this.getSelect.data && this.getSelect.data.identidad == "") {
                            b.enable();
                        }                       
                    }
                });
                _caller.getStorePrincipal().fireEvent = _caller.getStorePrincipal().fireEvent.createSequence(function (e) {
                    if (e == 'load') {
                        this.getSelect = _this.getSmPrincipal().getSelected();
                        b.disable();
                        if (this.getSelect && this.getSelect.data && this.getSelect.data.identidad == "") {
                            b.enable();
                        }         
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnNoUsar,
            tooltip: _this.idioma.tipBtnNoUsar,
            iconCls: 'usarentidad rojo',
            hidden: false,
            disabled: true,            
            handler: function () {
                var selected = _this.getSmPrincipal().hasSelection();
                let getSelect = _this.getSmPrincipal().getSelected();

                var ids = new Array();
                if (getSelect.json.identidad)
                    ids.push(getSelect.json.id)
                /*Ext.each(getSelect, function (rec) {
                    if (rec.json.identidad)
                        ids.push(rec.data.idactividad);//esto es para que coja los cambios en actividades
                });*/
                _this.usarEntidad({ids: Ext.encode(ids), hijo: true}, function (resp) {
                    _this.getStorePrincipal().reload();
                    _this.scope.gridActividades.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    console.info(this.getSelect)
                    if (e == 'selectionchange') {
                        b.disable();
                        this.getSelect = _this.getSmPrincipal().getSelected();
                        if (this.getSelect && this.getSelect.data && this.getSelect.data.identidad != "") {
                            b.enable();
                        } 
                     }
                });
                _caller.getStorePrincipal().fireEvent = _caller.getStorePrincipal().fireEvent.createSequence(function (e) {
                    if (e == 'load') {
                        this.getSelect = _this.getSmPrincipal().getSelected();
                        b.disable();
                        if (this.getSelect && this.getSelect.data && this.getSelect.data.identidad != "") {
                            b.enable();
                        }  
                     }
                });
            }
        }));

    },
    guardarServicio: function (parametros, _fn, _fnfail) {
        var _this = this;
        Ext.MessageBox.wait('Guardando los datos', 'Por favor espere' || '...');
        var objSubmit = {};
        var obj = this;
        objSubmit.data = Ext.encode(parametros);
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionactividades/adicionarActividad',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                //this.apply(resp);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
                console.info(_this.adicionar)
            }.createDelegate(this)
        });
    },
    duplicarServicio: function (parametros, _fn, loadStore) {
        var _this = this;
        Ext.MessageBox.wait('Duplicando los servicios', this.idioma.msgEspere || '...');
        var objSubmit = {};
        var obj = this;
        objSubmit.data = Ext.encode(parametros);
        // console.info(objSubmit.data)
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionactividades/duplicarActividad',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                //this.apply(resp);
                if (resp.success) {
                    if (s) {
                        if (this.st) {
                            var rs = this.sm.getSelected();
                            this.st.reload({
                                callback: function () {
                                }.createDelegate(this)
                            });
                        }
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    eliminarServicio: function (parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar el(los) servicio(s) selecionado(s)\x3f', function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait('Eliminando el(los) servicio(s)', 'Por favor espere' || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: '/logistica/talleres/configuracion/index.php/configuracionactividades/eliminarActividad',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        //this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, 'La(s) actividad(es) ha(n) sido eliminada(s) satisfactoriamente.');
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    usarEntidad: function (parametros, _fn, loadStore) {
        var _this = this;
        var accion = "dejar de usar";
        console.info(parametros);
        if (parametros['usar']) {
            accion = "usar";
        }
        mostrarMensaje(2, '\xbfEst\xe1 seguro que desea ' + accion + ' en  la entidad el(los) servicio(s) selecionado(s)\x3f',
            function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.wait('Actualizando el(los) servicio(s) en la entidad', 'Por favor espere' || '...');
                    var objSubmit = parametros || {};
                    Ext.Ajax.request({
                        url: '/logistica/talleres/configuracion/index.php/configuracionactividades/usaEnLaEntidad',
                        method: 'POST',
                        params: objSubmit,
                        callback: function (o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            //this.apply(resp);
                            if (resp.success) {
                                if (s) {
                                    mostrarMensaje(1, 'La(s) actividad(es) ha(n) sido actualizada(s) satisfactoriamente.');
                                }
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp]).call();
                                }
                            }
                        }.createDelegate(this)
                    });
                }
            }.createDelegate(this));
    }
});

// Grid Actividades
Ext.erp.gridActividades = Ext.extend(LOG.util.UITemplate, {
    idactividadesServicios: undefined,
    constructor: function (config) {
        this.autoSelect = false;
        this.gridEditable = true;
        this.scope = config.scope;
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.dirController = '/logistica/talleres/configuracion/index.php/configuracionactividades';
        this.modelo = new Ext.erp.ModelActv({idioma: this.idioma});
        this.urlBusquedaGridPrincipal = 'cargarActividades';
        this.idioma = config.idioma;
        //this.idioma = LOG.util.UIManager.apply(config.idioma, Ext.erp.gridActividades);
        Ext.erp.gridActividades.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 260,
            dataIndex: 'denominacion',
            autoExpand: true,
            align: 'left',

        });
        this.addGridColumn({
            header: 'C\xf3digo',
            width: 50,
            dataIndex: 'codigo',
            align: 'left',
        });
        this.addGridColumn({
            header: 'UM',
            width: 50,
            dataIndex: 'umedida',
            default: true,
            allowBlank: false,
            align: 'center',
        });
        this.addGridColumn({
            header: 'Cantidad planificada',
            sorteable: true,
            dataIndex: 'tiempoplanificado',
            align: 'left',
            width: 70,
            editor: LOG.util.Prototipos.inputDecimal({
                allowBlank: false,
                minValue: 0
            }),
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
        });
        this.addGridColumn({
            header: 'Tempario',
            sorteable: true,
            dataIndex: 'tempario',
            align: 'left',
            width: 70,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
        });
        /*this.addGridColumn({
            header: 'Usa todas las actividades',
            width: 130,
            align: 'left',
            dataIndex: 'usatodasnormas',

            sorteable: true,
            renderer: function (val, metaData, rec) {
                if (rec.json.usatodasnormas == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="Si"';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip=" No"';
                }
            }
        });*/
        this.addGridColumn({
            header: 'Usar entidad',
            width: 80,
            dataIndex: 'identidad',
            align: 'left',
            renderer: function (val, metaData, rec) {
                if (rec.json.identidad) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="Si"';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip=" No"';
                }
            }
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'minimo'
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'maximo'
        });
        this.addGridColumn({
            hidden: true,
            dataIndex: 'abreviaturaunidadmedida'
        });
        this.addGridColumn({
            hidden: true,
            dataIndex: 'um'
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'porcentual'
        });

        
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Adicionar',
            tooltip: 'Adicionar actividad(es)',
            iconCls: 'adicionar',
            disabled : true,
            handler: function () {
                var selected = _this.getSmPrincipal().hasSelection();
                let getSelected = _this.getSmPrincipal().getSelected();
                //pq las actv de primer nivel no tienen indicador
                var venAct = new Ext.erp.gridSelectActividades({
                    idioma: _this.idioma,
                });
                venAct.init();
                venAct.view();
                venAct.getVistaPrincipal().height = 400;
                venAct.getVistaPrincipal().width = 600;
                venAct.getStorePrincipal().load();
                venAct.getVistaPrincipal().aceptarFn = function () {
                    var selections = venAct.getSmPrincipal().getSelections();
                    if (selections[0].data.tiempoplanificado == "") {
                        mostrarMensaje(3, 'No se pueden guardar las actividades sin la cantidad planificada.')
                    } else {
                        var arr = new Array();
                        Ext.each(selections, function (rec) {
                            rec.data.idpadre = _this.getStorePrincipal().baseParams.idactividadesServicios;
                            rec.data.idarbol = _this.getStorePrincipal().baseParams.idactividadesServicios;
                            arr.push(rec.data);
                            venAct.getStorePrincipal().remove(rec);
                        });
                        _this.guardarActividad({actividades: Ext.encode(arr)}, function (resp) {
                            _this.getStorePrincipal().reload();
                        });
                    }

                }
            },
            controlFn: function (b, _caller) {
        
                _caller.scope.gridServicios.smGridPrincipal.fireEvent = _caller.scope.gridServicios.smGridPrincipal.fireEvent.createSequence(function (e) {                  
                       if (e == 'rowselect') {
                           b.enable();
                       }
                       if (e == 'rowdeselect') {
                           b.disable();
                       }
                   }
               );
               }

        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Modificar',
            tooltip: 'Modificar actividad',
            iconCls: 'modificar',
            disabled: true,
            handler: function () {
                var selected = _this.getSmPrincipal().hasSelection();
                let getSelected = _this.getSmPrincipal().getSelected();
                if (selected) {
                    var ventana = new Ext.erp.WinModificarActividad({height: 100, width: 100, title: 'Modificar actividad', scope: _this, cerrarAceptar: false});
                    ventana.show();
                    ventana.modificar(getSelected);

                    ventana.aceptarFn = function (btn = false) {
                        if(ventana.textMinimo1.getValue() && ventana.textMinimo1.getValue()!=''){
                              if (ventana.textMinimo1.getValue() >= ventana.textMaximo1.getValue()){
                                ventana.textMinimo1.setValue('');
                                ventana.textMaximo1.setValue('');
                                mostrarMensaje(3, 'El valor máximo debe ser mayor que el valor mínimo.');
                                return;  
                            }  
                        }                                  
                       //  else {
                            var arr = [];
                            arr.push({
                                idactividad: getSelected.id,
                                tiempoplanificado: getSelected.data.tiempoplanificado,
                                porcentual: ventana.chack1.getValue(),
                                um: ventana.UM1.getValue(),
                                minimo: ventana.textMinimo1.getValue(),
                                maximo: ventana.textMaximo1.getValue(),
                                medida: ventana.medida1.getValue(),
                                tempario: ventana.tempario.getValue(),
                                modificar: 1
                            });                                                            
                            _this.guardarActividad({actividades: Ext.encode(arr)}, function (resp) {
                                _this.scope.gridActividades.getStorePrincipal().reload();
                            });
                            if (!btn) {
                                ventana.close();
                            }   
                       // }             
                    }     
                } else {
                    mostrarMensaje(3, 'S\xf3lo se modifican las actividades del primer nivel');
                }
            },
            controlFn: function (b, _caller) {
            /*_caller.scope.gridActividades.smGridPrincipal.on({
                'rowselect': function(sm) { 
                        b.enable();              
                },
                'rowdeselect': function(sm) {
                    b.disable();
                }
            });*/
                _this.scope.gridActividades.smGridPrincipal.on({
                    'selectionchange': function(sm) {
                        b.disable();
                        this.getSelect = _this.getSmPrincipal().getSelected();
                        if (this.getSelect && this.getSelect.data && this.getSelect.data.id != "") {
                            b.enable();
                        }
                    }
                });
            }
        })); 
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Eliminar',
            tooltip: 'Eliminar actividad',
            iconCls: 'eliminar',
            disabled:true,

            handler: function () {
                var selected = _this.getSmPrincipal().hasSelection();
                let getSelected = _this.getSmPrincipal().getSelected();
                if (selected) {
                    var idactividades = new Array();
                    Ext.each(getSelected, function (item) {
                        idactividades.push(item.id);
                    });
                    //eliminar actividades
                    _this.eliminar({ids: Ext.encode(idactividades)}, function (resp) {
                        _this.getStorePrincipal().reload();
                        if (_this.getStorePrincipal().getCount() == 0) {
                            _this.listaBotones.getItem(0).disable();
                            _this.listaBotones.getItem(1).disable();
                            _this.listaBotones.getItem(2).disable();
                        }
                        /*_this.treeLoader.load({
                            params: {anode: null}
                        });*/

                    });
                }

            },
            controlFn: function (b, _caller) {
        
                /*_caller.scope.gridActividades.smGridPrincipal.fireEvent = _caller.scope.gridActividades.smGridPrincipal.fireEvent.createSequence(function (e) {                  
                       if (e == 'rowselect') {
                           b.enable();
                       }
                       if (e == 'rowdeselect') {
                           b.disable();
                       }
                   }
               );*/
              /*_caller.scope.gridActividades.smGridPrincipal.on({
                    'rowselect': function(sm) { 
                            b.enable();              
                    },
                    'rowdeselect': function(sm) {
                        b.disable();
                    }
                });*/
                _this.scope.gridActividades.smGridPrincipal.on({
                    'selectionchange': function(sm) {
                        b.disable();
                        this.getSelect = _this.getSmPrincipal().getSelected();
                        if (this.getSelect && this.getSelect.data && this.getSelect.data.id != "") {
                            b.enable();
                        }
                    }
                });
            }
        }));
        //esto es actividades
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnUsar,
            tooltip: _this.idioma.tipBtnUsar,
            iconCls: 'usarentidad verde',
            disabled: true,
            handler: function () {
                let getSelect = _this.getSmPrincipal().getSelected();
                    var ids = new Array();
                    Ext.each(getSelect, function (rec) {
                        ids.push(rec.id);
                    });
                    _this.usarEntidad({ids: Ext.encode(ids), usar: true, hijo: false}, function (resp) {
                        _this.listaBotones.getItem(3).disable(true);
                        _this.listaBotones.getItem(4).enable(true);
                        _this.getStorePrincipal().reload();
                    });
            },
            controlFn: function (b, _caller) {
                _this.scope.gridActividades.smGridPrincipal.on({
                    'selectionchange': function(sm) {
                        b.disable();
                            this.getSelect = _this.getSmPrincipal().getSelected();
                        if (this.getSelect && this.getSelect.data && this.getSelect.data.identidad == "") {
                            b.enable();
                        }
                    }
                });     
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnNoUsar,
            tooltip: _this.idioma.tipBtnNoUsar,
            iconCls: 'usarentidad rojo',
            hidden: false,
            disabled: true,
            handler: function () {
                var selected = _this.getSmPrincipal().hasSelection();
                let getSelect = _this.getSmPrincipal().getSelected();
                var ids = new Array();
                Ext.each(getSelect, function (rec) {
                    if (rec.json.identidad)
                        ids.push(rec.id);
                });
                _this.usarEntidad({ids: Ext.encode(ids), hijo: true}, function (resp) {
                    _this.listaBotones.getItem(3).enable(true);
                    _this.listaBotones.getItem(4).disable(false);
                    _this.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                console.log(_this)
              
                _this.scope.gridActividades.smGridPrincipal.on({                    
                    'selectionchange': function(sm) {
                        b.disable();
                            this.getSelect = _this.getSmPrincipal().getSelected();
                        if (this.getSelect && this.getSelect.data && this.getSelect.data.identidad != "") {
                            b.enable();
                        }
                    },
                    'load': function(st) {
                        this.getSelect = _this.getSmPrincipal().getSelected();
                         b.disable();
                        if (this.getSelect && this.getSelect.data && this.getSelect.data.identidad != "") {
                         b.enable();
                        }
                    },
                });    
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Actualizar',
            tooltip: 'Actualizar Cantidades Planificada',
            iconCls: 'actualizar',
            handler: function () {
                var modified = _this.getSmPrincipal().hasSelection() ? _this.getSmPrincipal().getSelected() : false;
              //  console.info(modified);
                if (!Ext.isEmpty(modified)) {
                    var recordsToSend = [];
                    Ext.each(modified, function (record) {
                  //      console.log(record);
                        if (modified.data) {
                            modified.data.idactividad = record.id;
                        }
                        if (record.data) {
                            record.data.idpadre = _this.getStorePrincipal().baseParams.idactividadesServicios;
                            record.data.idarbol = _this.getStorePrincipal().baseParams.idactividadesServicios;
                            record.data.modificar = 1;
                            recordsToSend.push(Ext.apply(record.data));
                        }
                     //   console.log(recordsToSend);
                    });

                    //  _this.stopEditing();
                    _this.guardarActividad({actividades: Ext.encode(recordsToSend)}, function (resp) {
                        //_this.selectionModeActividades.clearSelections();
                        _this.getStorePrincipal().commitChanges();
                        _this.getStorePrincipal().reload();
                        //_this.treeLoader.load();


                    });
                }
            }
        }));
    },
    render: function () {
        var _this = this;
        var vista = Ext.erp.gridActividades.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.idactividad = _this.idactividad
            }
        })
        /* vista.setHeight(400);
         vista.setWidth(600);
         vista.setTitle('Adicionar actividad');*/
        return vista;
    },
    guardarActividad: function (parametros, _fn, _fnfail) {
        var _this = this;
        Ext.MessageBox.wait('Guardando los datos', 'Por favor espere' || '...');
        var objSubmit = {};
        var obj = this;
        objSubmit.data = Ext.encode(parametros);
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionactividades/adicionarActividad',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                //this.apply(resp);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
                console.info(_this.adicionar)
            }.createDelegate(this)
        });
    },
    eliminar: function (parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar la(s) actividad(es) selecionada(s)\x3f', function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait('Eliminando la(s) actividad(es)', 'Por favor espere' || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: '/logistica/talleres/configuracion/index.php/configuracionactividades/eliminarActividad',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        //this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, 'La(s) actividad(es) ha(n) sido eliminada(s) satisfactoriamente.');
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    usarEntidad: function (parametros, _fn, loadStore) {
        var _this = this;
        var accion = "dejar de usar";
        console.info(parametros);
        if (parametros['usar']) {
            accion = "usar";
        }
        mostrarMensaje(2, '\xbfEst\xe1 seguro que desea ' + accion + ' en  la entidad la(s) actividad(es) selecionada(s)\x3f',
            function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.wait('Actualizando la(s) actividad(es) en la entidad', 'Por favor espere' || '...');
                    var objSubmit = parametros || {};
                    Ext.Ajax.request({
                        url: '/logistica/talleres/configuracion/index.php/configuracionactividades/usaEnLaEntidad',
                        method: 'POST',
                        params: objSubmit,
                        callback: function (o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            //this.apply(resp);
                            if (resp.success) {
                                if (s) {
                                    mostrarMensaje(1, 'La(s) actividad(es) ha(n) sido actualizada(s) satisfactoriamente.');
                                }
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp]).call();
                                }
                            }
                        }.createDelegate(this)
                    });
                }
            }.createDelegate(this));
    }
});
//Grids de las normas para las actividades.
Ext.erp.gridNormaActividades = Ext.extend(LOG.util.UITemplate, {

    constructor: function (config) {
        this.gridEditable = true;
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/talleres/configuracion/index.php/configuracionactividades';
        this.urlBusquedaGridPrincipal = 'cargarNormas';
        this.modoSeleccion = 3;
        this.idioma = config.idioma;
        this.autoLoad = false;
        this.scope = config.scope;
        Ext.erp.gridNormaActividades.superclass.constructor.call(this, config);

    },

    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            dataIndex: 'idnorma',
            default: true
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'idindicador'
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'idactividad'
        });

        this.addGridColumn({
            hidden: true,
            dataIndex: 'idumedida'
        });

        this.addGridColumn({
            header: 'C\xf3digo',
            width: 260,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 260,
            dataIndex: 'denominacion',
            default: true
        });

        this.addGridColumn({
            header: 'Norma',
            width: 260,
            dataIndex: 'norma',
            default: true,
            tooltip: "Doble click sobre cualquiera de las celdas de esta columna para modificar.",
            editor: new LOG.util.Prototipos.inputDecimal({
                allowBlank: false,
                decimalPrecision: 2,
                validarEnFormBasico: false,

            })
        });

        this.addGridColumn({
            header: 'Unidad de medida',
            width: 260,
            dataIndex: 'umedida',
            default: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.ttBtnNuevo,
            handler: function () {
                var params = {
                    producto: 1,
                    servicio: 0
                };

                /*if (arrayIds) {
                    params.idseleccionados = Ext.encode(arrayIds);
                }*/

                LOG.inv.maestroproductos.Loader.init(function () {
                    _this.winProdServ = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        width: 750,
                        height: 350,
                        usarAplicar: false,
                        usarMarcaModelo: true,
                        modoSeleccion: 3,
                        showArbol: false,
                        parametros: params,
                        doAction: function (recordsSeleccionados, e) {
                            var indObj = new Array();
                            if (recordsSeleccionados != null && recordsSeleccionados.length > 0)
                                indObj.push(recordsSeleccionados.map(indObj => +indObj.id));
                            _this.addIndicadores(indObj[0]);
                        }
                    });
                    _this.winProdServ.show();
                });
            },
            listeners: {
                enable: function (btn) {
                    let seleccion = _this.scope.gridActividades.getGridPrincipal().getSelectionModel().getSelections();
                    
                    if (seleccion[0].data.idindicador == null || seleccion.length !== 1) {
                        btn.disable();
                    }
                },
                disable: function (btn) {
                    let seleccion = _this.scope.panelGridServActividades.getGridPrincipal().getSelectionModel().getSelections();
                    if (seleccion.length === 1 && seleccion[0].data.idindicador != null) {
                        btn.enable();
                    }
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                _this.scope.gridActividades.getGridPrincipal().getSelectionModel().fireEvent = _this.scope.panelGridServActividades.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonGuardar({
            text: 'Guardar',
            tooltip: 'Guardar cambios',
            handler: function () {
                // Aplicando las bondadades de ECMA_SCRIPT 6 (ES6)
                const datos = _this.getStorePrincipal().getModifiedRecords()
                    .map((record) => {
                            return {
                                idnorma: record.data.idnorma,
                                norma: record.data.norma
                            }
                        }
                    );

                Ext.Ajax.request({
                    url: '/logistica/talleres/configuracion/index.php/configuracionactividades/guardarNormas',
                    method: 'POST',
                    params: {
                        normas: Ext.encode(datos)
                    },
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        //this.apply(resp);
                        if (resp.success) {
                            _this.getStorePrincipal().load();
                            mostrarMensaje(1, "Las normas han sido adicionadas satisfactoriamente.");
                        } else {
                            mostrarMensaje(3, "Ha ocurrido un error mientras se adicionaban las normas.");
                        }
                    }.createDelegate(this)
                });


            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnEliminar,
            isContextual: true,
            handler: function () {
                if (_this.getSmPrincipal().hasSelection()) {
                    mostrarMensaje(2, "\xbfEst\xe1 seguro que desea eliminar la(s) norma(s) seleccionada(s)\x3f", function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                            var NormasEliminadas = new Array();
                            Ext.each(_this.getSmPrincipal().getSelections(), function (r) {
                                if (r.data.idnorma) {
                                    NormasEliminadas.push(r.data.idnorma);
                                }
                                _this.getStorePrincipal().remove(r);
                            });
                            _this.eliminarNormas(NormasEliminadas);
                            if (_this.getStorePrincipal().getCount() == 0) {
                                _this.listaBotones.getItem(0).disable();
                                _this.listaBotones.getItem(1).disable();
                                _this.listaBotones.getItem(2).disable();
                            }
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));
    },
    render: function () {
        var _this = this;
        var vista = Ext.erp.gridNormaActividades.superclass.render.call(this);

        _this.getStorePrincipal().on({
            'beforeload': function (st, obj) {
                let seleccion = _this.scope.gridActividades.getGridPrincipal().getSelectionModel().getSelections();

                obj.params.idActividad = seleccion[0].data.id;
            }
        });
        return vista;
    },
    addIndicadores: function (arrIndicadores) {
        var objSubmit = {};
        var _this = this;
        Ext.MessageBox.wait('Guardando los datos', this.idioma.msgEspere || '...');
        //var idActividad = _this.scope.gridActividades.getGridPrincipal().getSelectionModel().getSelections()[0].data.idactividad;
        var idActividad=_this.scope.gridActividades.getGridPrincipal().getSelectionModel().getSelections();

        objSubmit.listaindicadores = Ext.encode(arrIndicadores);
        objSubmit.idactividad = idActividad[0].id;

        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionactividades/adicionarNormas',
            method: 'POST',
            /* params: {

                 idIndicadores: Ext.encode(arrIndicadores),
                 idActividad: idActividad
             },*/
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    _this.getStorePrincipal().load();
                    mostrarMensaje(1, "Las normas han sido guardadas satisfactoriamente.");
                } else {
                    mostrarMensaje(3, "Ha ocurrido un error mientras se guardaban las normas.");
                }
            }.createDelegate(this)
        });

    },
    eliminarNormas: function (arrNormasEliminadas) {
      //  console.log(arrNormasEliminadas)
        var objSubmit = {};
        var _this = this;
        objSubmit.listaidnormas = Ext.encode(arrNormasEliminadas);
      //  console.log(objSubmit.listaidnormas);
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionactividades/eliminarNormas',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    _this.getStorePrincipal().load();
                    mostrarMensaje(1, "La(s) norma(s) ha(n) sido eliminada(s) satisfactoriamente.");
                } else {
                    mostrarMensaje(3, "Ha ocurrido un error mientras se eliminaba las normas.");
                }
            }.createDelegate(this)
        });
    }
});

Ext.erp.gridSelectNormaActividades = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.gridEditable = true;
        this.formaVisualizacion = 'ventana';
        this.dirController = '/logistica/talleres/configuracion/index.php/configuracionactividades';
        this.urlBusquedaGridPrincipal = 'cargarIndicadores';
        this.modoSeleccion = 2;
        this.idioma = config.idioma;
        this.autoLoad = false;
        Ext.erp.gridSelectNormaActividades.superclass.constructor.call(this, config);

    },

    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            hidden: true,
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 260,
            dataIndex: 'denominacion',
            default: true
        });
    },

    render: function () {
        var _this = this;
        var vista = Ext.erp.gridSelectNormaActividades.superclass.render.call(this);

        return vista;
    }
});


Ext.erp.ModelActv = Ext.extend(LOG.util.Model, {
    constructor: function (config) {
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'denominacion'
        });
        config.fields.push({
            name: 'codigo'
        });
        config.fields.push({
            name: 'idactividad',
            primary: true
        });

        Ext.erp.ModelActv.superclass.constructor.call(this, config);
    },
    guardarActividad: function (parametros, _fn, _fnfail) {
        var _this = this;
            Ext.MessageBox.wait('Guardando los datos', 'Por favor espere' || '...');
            var objSubmit = {};
            var obj = this;
            objSubmit.data = Ext.encode(parametros);
            Ext.Ajax.request({
                url: '/logistica/talleres/configuracion/index.php/configuracionactividades/adicionarActividad',
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }    
                    } else { 
                        if (typeof _fnfail == 'function') {
                            _fnfail.createDelegate(this, [resp]).call();
                        }
                    }  
                     console.info(_this.adicionar) 
                    }.createDelegate(this)
            });
    },
    duplicarActividad: function (parametros, _fn, loadStore) {
        var _this = this;
        Ext.MessageBox.wait('Duplicando las actividades', this.idioma.msgEspere || '...');
        var objSubmit = {};
        var obj = this;
        objSubmit.data = Ext.encode(parametros);
       // console.info(objSubmit.data)
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionactividades/duplicarActividad',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        if (this.st) {
                            var rs = this.sm.getSelected();
                            this.st.reload({
                                callback: function () {
                                }.createDelegate(this)
                            });
                        }
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    eliminar: function (parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, '\xbf Est\xe1 seguro que desea eliminar la(s) actividad(es) selecionada(s)\x3f', function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait('Eliminando la(s) actividad(es)', 'Por favor espere' || '...');
                var objSubmit = parametros || {};
                Ext.Ajax.request({
                    url: '/logistica/talleres/configuracion/index.php/configuracionactividades/eliminarActividad',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, 'La(s) actividad(es) ha(n) sido eliminada(s) satisfactoriamente.');
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    usarEntidad: function (parametros, _fn, loadStore) {
        var _this = this;
        var accion = "dejar de usar";
        console.info(parametros);
        if (parametros['usar']) {
            accion = "usar";
        }
        mostrarMensaje(2, '\xbfEst\xe1 seguro que desea ' + accion + ' en  la entidad la(s) actividad(es) selecionada(s)\x3f',
            function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.wait('Actualizando la(s) actividad(es) en la entidad', 'Por favor espere' || '...');
                    var objSubmit = parametros || {};
                    Ext.Ajax.request({
                        url: '/logistica/talleres/configuracion/index.php/configuracionactividades/usaEnLaEntidad',
                        method: 'POST',
                        params: objSubmit,
                        callback: function (o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            this.apply(resp);
                            if (resp.success) {
                                if (s) {
                                    mostrarMensaje(1, 'La(s) actividad(es) ha(n) sido actualizada(s) satisfactoriamente.');
                                }
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp]).call();
                                }
                            }
                        }.createDelegate(this)
                    });
                }
            }.createDelegate(this));
    }
})
