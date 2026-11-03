Ext.ns('Ext.erp');


Ext.erp.confproduccion = Ext.extend(Ext.Panel, {

    constructor: function (config) {

        this.idioma = config.idioma;

        this.setToolBar();
        this.addMainContent();

        Ext.erp.confproduccion.superclass.constructor.call(this, config);
    },
    setToolBar: function () {
        let _this = this;

        _this.btnAdicionar = new Ext.Button({
            iconCls: 'adicionar',
            text: _this.idioma.lbAdicionar,
            tooltip: _this.idioma.lbAdicionarDepositos,
            handler: _this.btnAdicionarHandler.bind(_this)
        });

        _this.btnEliminar = new Ext.Button({
            iconCls: 'eliminar',
            text: _this.idioma.lbEliminar,
            tooltip: _this.idioma.lbEliminarDepositos,
            handler: _this.btnEliminarHandler.bind(_this)
        });

        this.tbar = [_this.btnAdicionar/*, _this.btnEliminar*/];
    },
    btnAdicionarHandler: function(){
        var _this = this;
        var winAdd = new Ext.erp.winDepositos({
            idioma: _this.idioma,
            postActions: function(){
                _this.stMateriasPrimas.load();
                _this.stProdTerminada.load();
            }
        });


        winAdd.init();
        var winAddS = winAdd.view();
        winAddS.show();


    },
    btnEliminarHandler: function(){
        var _this = this;

        var recordsMPM = _this.gridMateriasPrimas.getSelectionModel().getSelections();
        var recordsPT =  _this.gridProdTerminada.getSelectionModel().getSelections();

        var almacenesMPM = [];
        var almacenesPT = [];

        Ext.each(recordsMPM, function(rec){
            almacenesMPM.push(rec.json.idconfalmacen);
        });

        Ext.each(recordsPT, function(rec){
            almacenesPT.push(rec.json.idconfalmacen);
        });

        if(almacenesMPM.length > 0 || almacenesPT.length > 0){
            mostrarMensaje(2, _this.idioma.lbMsgDesclasificarConfirm, function(btn){
                if(btn == 'ok'){
                    Ext.Ajax.request({
                        url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/eliminaractividad',
                        params: {
                            almacenesMPM: Ext.encode(almacenesMPM),
                            almacenesPT: Ext.encode(almacenesPT)
                        },
                        callback: function(opt, scs, resp) {
                            if(resp.statusText == 'OK'){
                                mostrarMensaje(1, _this.idioma.lbMsgDesclasificarOk);
                            }else{
                                mostrarMensaje(3, _this.idioma.lbMsgDesclasificarError);
                            }
                            if(almacenesMPM.length > 0)
                                _this.stMateriasPrimas.load();
                            if(almacenesPT.length > 0)
                                _this.stProdTerminada.load();
                        }
                    });
                }
            });
        }
    },
    addMainContent: function(){
        var _this = this;
        _this.frame = true;
        _this.layout = 'border';


        this.stMateriasPrimas = new Ext.data.Store({
            autoLoad: true,
            url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/depositosconfigurados',
            reader: new Ext.data.JsonReader({
                    id: "idestructura",
                    root: "datos"
                },
                [
                    {name: 'idestructura'},
                    {name: 'denominacion'},
                    {name: 'codigo'}
                ]),

            listeners: {
                'beforeload': function(store, options){
                    store.baseParams = {
                        tipoalmacen: 1,
                        start: 0,
                        limit: 20
                    };
                }
            }
        });

        this.gridMateriasPrimas = new Ext.grid.GridPanel({
            autoExpandColumn: 'denominacion',
            store: this.stMateriasPrimas,
            loadMask:true,
            border: true,
            colModel: new Ext.grid.ColumnModel({
                columns: [
                    {header: _this.idioma.lbColCodigo, width: 60, sortable: true, dataIndex: 'codigo'},
                    {header: _this.idioma.lbHColDepMP,dataIndex:'denominacion', sortable: true, id:'denominacion'}
                ]
            }),
            sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
            bbar: new Ext.PagingToolbar({
                store: this.stMateriasPrimas,
            })
        });

        this.panelMP = new Ext.Panel({
            title: _this.idioma.lbTitlePanelMP,
            region: 'center',
            layout: 'fit',
            frame: true,
            items: [_this.gridMateriasPrimas]
        });


        this.stProdTerminada = new Ext.data.Store({
            autoLoad: true,
            url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/depositosconfigurados',
            reader: new Ext.data.JsonReader({
                    id: "idestructura",
                    root: "datos"
                },
                [
                    {name: 'idestructura'},
                    {name: 'denominacion'},
                    {name: 'codigo'}
                ]),
            listeners: {
                'beforeload': function(store, options) {
                    store.baseParams = {
                        tipoalmacen: 2,
                        start: 0,
                        limit: 20
                    };
                }
            }
        });

        this.gridProdTerminada = new Ext.grid.GridPanel({
            autoExpandColumn: 'denominacion',
            store: this.stProdTerminada,
            loadMask:true,
            colModel: new Ext.grid.ColumnModel({
                columns: [
                    {header: _this.idioma.lbColCodigo, width: 60, sortable: true, dataIndex: 'codigo'},
                    {header: _this.idioma.lbHColDepPT,dataIndex:'denominacion', sortable: true, id:'denominacion'}
                ]
            }),
            sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
            bbar: new Ext.PagingToolbar({
                store: this.stProdTerminada
            })
        });

        this.panelPT = new Ext.Panel({
            title: _this.idioma.lbTitlePanelPT,
            region: 'east',
            layout: 'fit',
            width: '50%',
            frame: true,
            items: [_this.gridProdTerminada]
        });

        _this.items = [_this.panelMP, _this.panelPT];

    }
});

Ext.erp.winDepositos = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';

        this.modoSeleccion = 2;
        this.gridEditable = true;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.concepto = config.idioma.lbconcepto;
        this.urlBusquedaGridPrincipal = 'gettodosdepositos';
        this.dirController = '/logistica/produccion/maestros/configuracion/index.php/configuracionprod';
        this.parametros = {
            start: 0,
            limit: 30
        };
        this.postActions = config.postActions;

        /*this.modelo = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });*/
        Ext.erp.winDepositos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: _this.idioma.lbColCodigo,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.lbColDepositos,
            autoExpand: true,
            dataIndex: 'deposito',
            default: true
        });


        var cmMateriasprimas = new LOG.grid.CheckColumn({
            header: _this.idioma.lbColChechMP,
            dataIndex: 'materias',
            width: 150,
            align: 'center'
        });
        this.addGridColumn(cmMateriasprimas);
        this.addGridPlugin(cmMateriasprimas);


        var cmProduccion = new LOG.grid.CheckColumn({
            header: _this.idioma.lbColChechPT,
            dataIndex: 'produccion',
            width: 150,
            align: 'center'
        });
        this.addGridColumn(cmProduccion);
        this.addGridPlugin(cmProduccion);

        this.addGridColumn({dataIndex: 'iddeposito'});
    },
    init: function () {
        var _this = this;
        Ext.erp.winDepositos.superclass.init.call(this);
        this.getVistaPrincipal().setTitle(_this.idioma.lbAdicionarDepositos);
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function () {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function (aplicar) {
                if (typeof _this.doAction == 'function') {
                    _this.doAction.createDelegate(_this, [_this.getStorePrincipal().getModifiedRecords(), aplicar]).call();
                }
            }
        });

        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border'
        });
    },
    render: function () {
        var _this = this;
        var _res = Ext.erp.winDepositos.superclass.render.call(this);
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange' && _this.formaVisualizacion == 'ventana') {
                _this.habilitarBotones();
            }
        });
        return _res;
    },
    habilitarBotones: function () {
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(1).enable();
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    },
    doAction: function (r, aplicar) {
        var _this = this;

        var accionesCheckColumns = [];
        Ext.each(r, function (rec) {

            if(rec.data.materias === "0")
                rec.data.materias = false;
            if(rec.data.materias === "1")
                rec.data.materias = true;
            if(rec.data.produccion === "0")
                rec.data.produccion = false;
            if(rec.data.produccion === "1")
                rec.data.produccion = true;

            var materias = rec.data.materias ? 1 : 0;
            var produccion = rec.data.produccion ? 1 : 0;

            if(materias != rec.json.materias || produccion != rec.json.produccion){

                var isNew = 0;
                if(rec.json.materias == 0 && rec.json.produccion == 0){
                    isNew = 1;
                }

                var objMPM = {
                    idalmacen: rec.data.iddeposito,
                    materias: materias,
                    produccion: produccion,
                    isNew: isNew
                };
                accionesCheckColumns.push(objMPM);
            }
        });

        if(accionesCheckColumns.length > 0){
            Ext.Ajax.request({
                url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/gestionarconfdepositos',
                params: {
                    acciones: Ext.encode(accionesCheckColumns)
                },
                callback: function(opt, scs, resp) {
                    if(resp.statusText == 'OK'){
                        mostrarMensaje(1, _this.idioma.lbMsgDepConfOk);
                    }else{
                        mostrarMensaje(3, _this.idioma.lbMsgDepConfError);
                    }
                    _this.getStorePrincipal().commitChanges();
                    _this.getStorePrincipal().reload();
                    _this.postSalvar();

                }
            });
        }
    },
    postSalvar: function (r, a, _idselecc) {
        this.postActions();
    }
});


Ext.erp.confequipos = Ext.extend(Ext.Panel, {

    constructor: function (config) {

        this.idioma = config.idioma;

        this.setToolBar();
        this.addMainContent();

        Ext.erp.confequipos.superclass.constructor.call(this, config);
    },
    setToolBar: function () {
        let _this = this;

        _this.btnAdicionar = new Ext.Button({
            iconCls: 'adicionar',
            text: _this.idioma.lbAdicionar,
            tooltip: _this.idioma.lbAdicionarTpl,
            handler: _this.btnAdicionarHandler.bind(_this)
        });

        _this.btnEliminar = new Ext.Button({
            iconCls: 'eliminar',
            text: _this.idioma.lbEliminar,
            tooltip: _this.idioma.lbEliminarTpl,
            handler: _this.btnEliminarHandler.bind(_this)
        });

        this.tbar = [_this.btnAdicionar, _this.btnEliminar];
    },
    btnAdicionarHandler: function(){
        var _this = this;

        var idregistrosExcluir = [];
        _this.stEquipos.each(function(rec){
            idregistrosExcluir.push(rec.json.idregnumerico);
        });


        var winAdd = new LOG.aft.winActivosService({
            idioma: _this.idioma,
            idregistrosExcluir: idregistrosExcluir,
            callBackAction: function(selectedData){
                var idregistros = [];
                Ext.each(selectedData, function(rec){
                    idregistros.push(rec.json.idregnumerico)
                });
                _this.onAddEquiposHandler(idregistros);
            }
        });

        winAdd.init();
        var winAddS = winAdd.view();
        winAddS.show();

    },
    btnEliminarHandler: function(){
        var _this = this;

        var recordsEquipos = _this.gridEquipos.getSelectionModel().getSelections();
        var equipos = [];

        Ext.each(recordsEquipos, function(rec){
            equipos.push(rec.json.idregnumerico);
        });

        if(equipos.length > 0){
            mostrarMensaje(2, _this.idioma.lbMsgDelEquiposConfirm, function(btn){
                if(btn == 'ok'){
                    Ext.Ajax.request({
                        url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/eliminarequipos',
                        params: {
                            idregistros: Ext.encode(equipos)
                        },
                        callback: function(opt, scs, resp) {
                            if(resp.statusText == 'OK'){
                                mostrarMensaje(1, _this.idioma.lbMsgDelEquipoOk);
                            }else{
                                mostrarMensaje(1, _this.idioma.lbMsgDelEquipoError);
                            }
                            if(equipos.length > 0)
                                _this.stEquipos.load();

                        }
                    });
                }
            });
        }
    },

    addMainContent: function(){
        var _this = this;
        _this.frame = true;
        _this.layout = 'border';


        this.stEquipos = new Ext.data.Store({
            autoLoad: true,
            url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/cargarequipos',
            reader: new Ext.data.JsonReader({
                    id: "idestructura",
                    root: "datos"
                },
                [
                    {name: 'idestructura'},
                    {name: 'denominacion'},
                    {name: 'codigo'},
                    {name: 'nroinventario'}
                ]),

            listeners: {
                'beforeload': function(store, options){
                    store.baseParams = {
                        start: 0,
                        limit: 20
                    };
                }
            }
        });

        this.gridEquipos = new Ext.grid.GridPanel({
            autoExpandColumn: 'denominacion',
            store: this.stEquipos,
            loadMask:true,
            border: true,
            colModel: new Ext.grid.ColumnModel({
                columns: [
                    {header: _this.idioma.lbColCodigo, width: 100, sortable: true, dataIndex: 'codigo'},
                    {header: _this.idioma.lbHColEquipo,dataIndex:'denominacion', sortable: true, id:'denominacion'},
                    {header: _this.idioma.lbHColInventario,dataIndex:'nroinventario', sortable: true}
                ]
            }),
            sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
            bbar: new Ext.PagingToolbar({
                store: this.stEquipos,
            })
        });

        Ext.apply(_this.gridEquipos, {
            viewConfig: {
                getRowClass: function(rec, index, rowParams, store) {
                    if (rec.data.color ===  'rojo')
                        return 'redrow-text';
                    else
                        return 'greenrow-text';
                }
            }
        });

        this.panelEquipos = new Ext.Panel({
            //title: _this.idioma.lbTitlePanelMP,
            region: 'center',
            layout: 'fit',
            frame: true,
            items: [_this.gridEquipos]
        });


        _this.items = [ _this.panelEquipos   ];

    },
    onAddEquiposHandler: function(arrIdEquipos){
         var _this = this;

        if(arrIdEquipos.length > 0){
            Ext.Ajax.request({
                url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/adicionarequipos',
                params: {
                    idequipos: Ext.encode(arrIdEquipos)
                },
                callback: function(opt, scs, resp) {
                    if(resp.statusText == 'OK'){
                        mostrarMensaje(1, _this.idioma.lbMsgAddEquipoOk);
                    }else{
                        mostrarMensaje(3, _this.idioma.lbMsgAddEquipoError);
                    }
                    _this.stEquipos.load();
                }
            });
        }
    }
});

/*Ext.erp.confactividades = Ext.extend(Ext.Panel, {

    constructor: function (config) {
        this.modoSeleccion = 3;
        Ext.erp.WinAdicionarActividad.superclass.constructor.call(this, config);
        this.idioma = config.idioma;
       
        
        this.setToolBar();
        this.addMainContent();

        Ext.erp.confactividades.superclass.constructor.call(this, config);
    },   
    setToolBar: function () {
        let _this = this;

       
        
        _this.btnAdicionar = new Ext.Button({
            iconCls: 'adicionar',
            text: _this.idioma.lbAdicionar,
            tooltip: _this.idioma.lbAdicionarTpl,
            handler: _this.btnAdicionarHandler.bind(_this)
        });
        _this.btnModificar = new Ext.Button({
            iconCls: 'modificar',
            text: 'Modificar',
            disabled:false,
            disabled:true,
            tooltip: _this.idioma.lbModificarTpl,
            handler: _this.btnModificarHandler.bind(_this)
        });
               
        _this.btnEliminar = new Ext.Button({
            iconCls: 'eliminar',
            disabled:false,
            text: _this.idioma.lbEliminar,
            tooltip: _this.idioma.lbEliminarTpl,
            disabled:true,
            handler: _this.btnEliminarHandler.bind(_this)
        });

        _this.btnBuscarCarta = new Ext.Button({
            iconCls: 'buscar',
            text: 'Buscar',
            tooltip: 'Buscar configuración',
            handler: function() {
                _this.stActividades.reload();
            }
        });
        _this.btnLimpiarCarta = new Ext.Button({
            frame: true,
            iconCls: 'limpiar',
            text:'Limpiar',
            tooltip: 'Limpiar filtro',
            handler: function() {
                _this.tfBusqueda.setValue(null);
                _this.btnBuscarCarta.focus();
                _this.stActividades.reload();
            }
        });
        _this.tfBusqueda = new LOG.util.Prototipos.inputTexto({
            maxLengthText: _this.idioma.lbMsgMaxLongNomNomenclador,
            fieldLabel: 'Carta tecnológica',
            name: 'cartatecnologica',
            emptyText: 'Carta tecnológica'
        });
        
        this.tbar = [_this.btnAdicionar, _this.btnModificar,_this.btnEliminar, '->',_this.tfBusqueda, _this.btnBuscarCarta,_this.btnLimpiarCarta];
    },                                  
    btnAdicionarHandler: function(){
        var _this = this;

        var idactividadExcluir = [];
        _this.stActividades.each(function(rec){
            idactividadExcluir.push(rec.json.idcartatecindustrial);
            idactividadExcluir.push(rec.json.idarea);
            idactividadExcluir.push(rec.idcentrocosto);
            idactividadExcluir.push(rec.idactividad);

        });
 
        var _actividades = new Ext.erp.WinAdicionarActividad({
            idioma: _this.idioma,
            idactividadExcluir:idactividadExcluir,
            _parent: _this,
            modificarWin: 0,       
            callBackAction: function(selectedData){
              
                var idactividad = [];
                Ext.each(selectedData, function(rec){
                    idactividad.push(rec.json.idcartatecindustrial)
                });  
                _this.onAddActividadHandler(idactividad);
            }
         
        });
        _actividades.init();
        _this.vistaActividades = _actividades.view();
        _this.vistaActividades.show();      

       
    },
    btnEliminarHandler: function(){
        var _this = this;

        var recordsActividades = _this.gridActividades.getSelectionModel().getSelections();
        var actividad = [];

        Ext.each(recordsActividades, function(rec){
            actividad.push(rec.json.idcartatecindustrial);
        });

        if(actividad.length > 0){
            mostrarMensaje(2, _this.idioma.lbMsgActividadConfirm, function(btn){
                if(btn == 'ok'){
                    Ext.Ajax.request({
                        url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/eliminaractividad',
                        params: {
                            idcartatecindustrial: Ext.encode(actividad)
                        },
                        callback: function(opt, scs, resp) {
                            if(resp.statusText == 'OK'){
                                mostrarMensaje(1, _this.idioma.lbMsgActividadOk);
                            }else{
                                mostrarMensaje(1, _this.idioma.lbMsgActividadError);
                            }
                            if(actividad.length > 0)
                                _this.stActividades.load();

                        }
                    });
                }
            });
        }
    },
    btnModificarHandler: function(){
          var _this = this; 
        var _actividades = new Ext.erp.WinAdicionarActividad({
            idioma: _this.idioma,
            _parent: _this,
            modificarWin: 1        
        });
        _actividades.init();
        _this.vistaActividades = _actividades.view();
        _this.vistaActividades.show();  
        _actividades.modificar(_this.gridActividades.getSelectionModel().getSelected());
      
    },
    addMainContent: function(){
        var _this = this;
        _this.frame = true;
        _this.layout = 'border';

        _this.btnBuscarCarta = new Ext.Button({
            iconCls: 'buscar',
            text: 'Buscar',
            tooltip: 'Buscar configuración',
            handler: function() {
                _this.stActividades.reload();
            }
        });
        _this.btnLimpiarCarta = new Ext.Button({
            frame: true,
            iconCls: 'limpiar',
            text:'Limpiar',
            tooltip: 'Limpiar filtro',
            handler: function() {
                _this.tfBusqueda.setValue(null);
                _this.btnBuscarCarta.focus();
                _this.stActividades.reload();
            }
        });
        _this.tfBusqueda = new LOG.util.Prototipos.inputTexto({
            maxLengthText: _this.idioma.lbMsgMaxLongNomNomenclador,
            fieldLabel: 'Carta tecnológica',
            name: 'cartatecnologica',
            emptyText: 'Carta tecnológica'
        });


        this.stActividades = new Ext.data.Store({
            autoLoad: true,
            url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/cargaractividades',
            reader: new Ext.data.JsonReader({
                    id: "idestructura",
                    root: "datos"
                },
                [
                    {name: 'idactcentrocosto'},
                    {name: 'idestructura'},
                    {name: 'denominacionindicador'},
                    {name: 'text'},
                    {name: 'centrocosto'},
                    {name: 'idcentrocosto'},
                    {name: 'idcartatecindustrial'}
                     
                ]),

            listeners: {
                'beforeload': function(store, options){
                    store.baseParams = {
                        criterio: _this.tfBusqueda.getValue()  ? _this.tfBusqueda.getValue() : '',
                        start: 0,
                        limit: 20
                    
                    };
                }
            }
        });

        this.gridActividades = new Ext.grid.GridPanel({
            autoExpandColumn: 'denominacionindicador',
            store: this.stActividades,
            busquedaBasica:true,
            loadMask:true,
            border: true,
            colModel: new Ext.grid.ColumnModel({
                columns: [
                    {header: _this.idioma.lbHColCarta,dataIndex:'denominacionindicador', sortable: true, id:'denominacionindicador'}
                   // {header: _this.idioma.lbHColCentrocosto,dataIndex:'centrocosto', sortable: true, width: 300}
                    
                ]
            }),
            sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
            bbar: new Ext.PagingToolbar({
                store: this.stActividades,
            })
        });

       this.gridActividades.getSelectionModel().on('rowselect', function (sm, rowIndex, r) {
            _this.btnEliminar.enable();
            if (sm.getCount() == 1)
            _this.btnModificar.enable();
            else
            _this.btnModificar.disable();
        
        }, this);


        // this.panelBusquedaSimple = new Ext.Panel({
        //     region: 'north',
        //     layout: 'column',
        //     height: 38,
        //     frame: true,
        //     items: [_this.tfBusqueda, _this.btnBuscarCarta,_this.btnLimpiarCarta]
        // });
        
        this.panelActividades = new Ext.Panel({
            //title: _this.idioma.lbTitlePanelMP,
            region: 'center',
            layout: 'fit',
            frame: true,
            items: [ _this.gridActividades]
        });
     
        _this.items = [ this.panelActividades];

    },
  
});*/


Ext.erp.confactividades = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border';
        this.region = 'center';
        this.idioma = config.idioma;

        this.gridCarta = new Ext.erp.gridActCentroCosto({
            idioma: this.idioma,
            _parentP: this
        });

        this.gridCarta.init();
        var actividades = this.gridCarta.view();

        this.panel = LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'border',
            items: [actividades]
        });

        this.listaBotonesActividades = new LOG.util.List();
   
        this.btnAdicionar = new Ext.Button({
            iconCls: 'adicionar',
            text: _this.idioma.lbAdicionar,
            tooltip: _this.idioma.lbAdicionarTpl,
            handler: function() {
                _this.btnAdicionarHandler();
            }
        });

        this.listaBotonesActividades.add(this.btnAdicionar);

        this.btnModificar = new Ext.Button({
            iconCls: 'modificar',
            text: 'Modificar',
            disabled:true,
            tooltip: _this.idioma.lbModificarTpl,
            handler: function() {
                _this.btnModificarHandler();
            }
        });
        this.listaBotonesActividades.add(this.btnModificar);
               
        this.btnEliminar = new Ext.Button({
            iconCls: 'eliminar',
            text: _this.idioma.lbEliminar,
            tooltip: _this.idioma.lbEliminarTpl,
            disabled:true,
            handler: function() {
                _this.btnEliminarHandler();
            }
        });
        
        this.listaBotonesActividades.add(this.btnEliminar);

        this.listaBotonesActividades.add("->");

        this.btnAyuda = new Ext.Button({
            iconCls: 'ayuda',
            text: 'Ayuda',
            tooltip: 'Ayuda de configuracion de actividades y centros de costo',
            id: 'ayudaActividades',
            handler: function() {
                
            }
        });

        this.listaBotonesActividades.add(this.btnAyuda);

        config.layout = 'border';
        config.items = [{
                region: 'north',
                tbar: this.listaBotonesActividades.getArray()
            },
            this.panel
        ];

        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                ctrl: false,
                key: 'l',
                fn: function() {
                    if (_this.isVisible()) {
                        _this.grid.btnLimpiar();
                    }
                }
            }]);

        Ext.erp.confactividades.superclass.constructor.call(this, config);

        /*this.on({
            'resize': function() {
                var altura = _this.getHeight() - 40;
                _this.panel.setHeight(altura);
            }
        });*/
    },
    btnAdicionarHandler: function(){
        var _this = this;

        var idactividadExcluir = [];
        _this.gridCarta.getStorePrincipal().each(function(rec){
            idactividadExcluir.push(rec.json.idcartatecindustrial);
            idactividadExcluir.push(rec.json.idarea);
            idactividadExcluir.push(rec.idcentrocosto);
            idactividadExcluir.push(rec.idactividad);

        });
 
        var _actividades = new Ext.erp.WinAdicionarActividad({
            idioma: _this.idioma,
            idactividadExcluir:idactividadExcluir,
            _parent: _this,
            modificarWin: 0,       
            callBackAction: function(selectedData){
              
                var idactividad = [];
                Ext.each(selectedData, function(rec){
                    idactividad.push(rec.json.idcartatecindustrial)
                });  
                _this.onAddActividadHandler(idactividad);
            }
         
        });
        _actividades.init();
        _this.vistaActividades = _actividades.view();
        _this.vistaActividades.show();     
       
    },
    btnModificarHandler: function() {
        var _this = this; 
        var _actividades = new Ext.erp.WinAdicionarActividad({
            idioma: _this.idioma,
            _parent: _this,
            modificarWin: 1        
        });
        _actividades.init();
        _this.vistaActividades = _actividades.view();
        _this.vistaActividades.show(); 
        _actividades.modificar(_this.gridCarta.getGridPrincipal().getSelectionModel().getSelected());  
    },

///////////////

    btnEliminarHandler: function(){
        
       var _this = this;
       var recordsActividades = _this.gridCarta.getGridPrincipal().getSelectionModel().getSelections();
       var actividad = [];
        Ext.each(recordsActividades, function(rec){
        actividad.push(rec.json.idcartatecindustrial);
        });
            if(actividad.length > 0){
                mostrarMensaje(2,"¿Está seguro que desea eliminar las cartas tecnológicas seleccionadas? ", function(btn){
                    if(btn == 'ok'){
                        Ext.Ajax.request({
                            url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/eliminaractividad',
                            params: {
                                idcartatecindustrial: Ext.encode(actividad)
                            },

                            callback: function(opt, scs, resp) {
                                console.log(resp)
                                if(resp.responseText == 'OK'){
                                    mostrarMensaje(1,"La(Las) cartas tecnológicas ha(n) sido eliminada(s) satisfactoriamente");
                                }else{
                                    mostrarMensaje(2,"No se puede eliminar la carta tecnológica debido a que se han generado ordenes de produccion a partir de la misma en su entidad");
                                }
                                if(actividad.length > 0)
                                    _this.gridCarta.storePrincipal.load();
    
    
                            }
                           
                        });
                    }
                });
            }
        },

       
});

Ext.erp.gridActCentroCosto = Ext.extend(LOG.util.UITemplate, {
    parametros: undefined,
    constructor: function(config) {
        config.dirController = '/logistica/produccion/maestros/configuracion/index.php/configuracionprod',
        config.urlBusquedaGridPrincipal = 'cargaractividades';
        config.modoSeleccion = 2;
        config.busquedaBasica = false;
        config.autoLoad = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        this.idioma = {};
        Ext.erp.gridActCentroCosto.superclass.constructor.call(this, config);
        //LOG.util.UIManager.apply(this.idioma, Log.tall.penalizacionterceros.Idioma);
        this.addEvents('limpiar');
        this.addEvents('cargainicial');
    },
    render: function(config) {
        var render = Ext.erp.gridActCentroCosto.superclass.render.call(this, config);
        var _this = this;
        
        _this.tfBusqueda = new LOG.util.Prototipos.inputTexto({
            maxLengthText: _this.idioma.lbMsgMaxLongNomNomenclador,
            fieldLabel: 'Carta tecnológica',
            name: 'cartatecnologica',
            width: 250,
            emptyText: 'Carta tecnológica'
        });

        _this.btnBuscarPE = new LOG.util.Prototipos.botonBuscar({
            text: 'Buscar',
            tooltip: 'Buscar carta tecnológica',
            handler: function() {
                _this.btnBuscar();
            }
        });

        _this.btnLimpiarPE = new LOG.util.Prototipos.botonLimpiar({
            text: 'Limpiar',
            tooltip: 'Limpiar filtro(s) de carta tecnológica',
            handler: function() {
                 _this.btnLimpiar();
            }});

         render.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function() {
                        if (render.isVisible())
                            _this.btnBuscar();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function() {
                        if (render.isVisible())
                            _this.customTriggerClear();
                    }
                }
            ]);


        this.gpPrincipal.getTopToolbar().add('-', this.tfBusqueda,'-', _this.btnBuscarPE, '-', _this.btnLimpiarPE);

        this.getStorePrincipal().on({
            'beforeload' : function(st, obj) {
                Ext.apply(obj.params, {
                    fechainicio: _this.tfBusqueda.getValue() ?  _this.tfBusqueda.getValue() : '',
                    limit: 20,
                    start: 0
                })
            }
        });

        this.getStorePrincipal().reload();

        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange' && _this.formaVisualizacion == 'panel') {
                _this.habilitarBotones();
            }
        });
        
        return render;
    },
    
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'denominacionindicador',
            header: this.idioma.lbHColCarta,
            width: 800,
            sortable: true
        });
    },
    btnBuscar: function() {
        var _this = this;
        var carta = _this.tfBusqueda.getValue();
        if (carta) {
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load({
                params: {
                    criterio: (carta) ? carta : null,
                    limit: 30,
                    start: 0
                }
            });
        }
    },
    btnLimpiar: function() {
        var _this = this;
        _this.id = null;
        _this.tfBusqueda.reset();
        _this.getStorePrincipal().filtrado = false;
        _this.getStorePrincipal().load({
            params: {
                criterio: null
            }
        });
    },
    habilitarBotones: function () {
       var _this = this;
       _this._parentP.listaBotonesActividades.arrayData[1].disable();
       _this._parentP.listaBotonesActividades.arrayData[2].disable();
        if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
            _this._parentP.listaBotonesActividades.arrayData[1].enable();
            _this._parentP.listaBotonesActividades.arrayData[2].enable();
        }
    }
});



Ext.erp.WinAdicionarActividad = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    modificarWin: undefined,
    gridEditable:true,
    pruneModifiedRecords: true,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = false;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.autoLoad = false;
        this.autoSelect = true;
        this.concepto = 'actividades';
        this.urlBusquedaGridPrincipal = 'listarActividadesCartatecnologica';
        this.dirController = '/logistica/produccion/maestros/configuracion/index.php/configuracionprod';
        this.postActions = config.postActions;
        Ext.erp.WinAdicionarActividad.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: 'Denominación',
            width: 120,
            dataIndex: 'denominacion',
            default: true
        });

        this.addGridColumn({
            header: 'Área',
            autoExpand: true,
            dataIndex: 'area',
            default: true
        });

        this.addGridColumn({
            header: 'Centro de costo',
            autoExpand: true,
            dataIndex: 'centrocosto',
            default: true
        });

        this.addGridColumn({dataIndex: 'idcartatecindustrialactividad'});

        this.addGridColumn({dataIndex: 'idcartatecindustrial'});
    },
    init: function () {
        var _this = this;
        Ext.erp.WinAdicionarActividad.superclass.init.call(this);
        this.getVistaPrincipal().setTitle(_this.idioma.lbWinAdd);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function() {

            this.cmbCartaTecnologica = new LOG.util.ComboBox({
                /*name: 'idcartatecindustrial',*/
                fieldLabel: 'Carta tecnológica',
                hiddenName: 'idcartatecindustrial',
                displayField: 'denominacionindicador',
                valueField: 'idcartatecindustrial',
                autoLoad: true,
                forceSelection: true,
                pageSize: 20,
                allowBlank: false,
                //editable:false,
                campo: true,
                disabled: (_this.modificarWin == 1) ? true : false,
                itemSelector: 'div.search-item', 
                url:'/planificacion/planindustrial/index.php/cartatecnologicaindustrial/listarCartatecnologica',
                tpl:new Ext.XTemplate(
                    '<tpl for="."><div class="search-item">',
                    '{denominacionindicador}: ({denominacion})',
                    '</div></tpl>'
                ),
                mode: 'local',
                baseParams: {
                },
                otherFields:[
                    'denominacion',
                    'idindicadorsalida',
                ],
               
                initStore: function () {
                    var storeFields = [
                        {name: this.valueField},
                        {name: this.displayField},
                    ];
                    if (typeof this.otherFields != 'undefined') {
                        storeFields = storeFields.concat(this.otherFields);
                    }

                    return this.store || new Ext.data.Store({
                        url: this.url,
                        autoLoad: this.autoLoad,
                   
                        baseParams: this.baseParams,
                        reader: new Ext.data.JsonReader({
                            root: 'data',
                            totalProperty: 'total',
                            idProperty: this.valueField
                        }, storeFields)
                    })
                    
                },
                listeners: {
                    select: function (combo,record,index) {               
                        _this.getStorePrincipal().load(); 
                    },
                    keyup: function(cb, e, v) {
                        if (!this.getRawValue()) {
                            this.fireEvent('expand', this);
                            if (!v) {
                                this.fireEvent('expand', this);
                                this.fireEvent('keyup', this, e, true);
                            }
                        }
                    },
                    expand: function() {
                        this.getStore().filterBy(function(item) {
                            var index = _this.getStorePrincipal().find('idcartatecindustrial', item.data.idcartatecindustrial);
                            return item.data.idcartatecindustrial != _this.idcartatecindustrial && index == -1;
                        });
                    }
                    
                }
            });

            this.cmbCartaTecnologica.getStore().on({
                load: function () {
                    this.filterBy(function (item) {
                        return item.data.idcartatecindustrial != _this.idcartatecindustrial;
                    });
                }
            });

            _this.getStorePrincipal().on({
                'beforeload': function () {
                 this.initBaseParams.idcartatecindustrial = _this.modificarWin == 1 ? _this._parent.gridCarta.getGridPrincipal().getSelectionModel().getSelected().json.idcartatecindustrial : _this.panelPrincipal.cmbCartaTecnologica.getValue();
                   
                }
            }); 
            
            _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e,sm) {
    
                if (e == 'selectionchange' && this.getCount() == 1) {
                    _this.panelPrincipal.cmbArea.enable();
                    _this.panelPrincipal.cmbArea.setValue(_this.getGridPrincipal().getSelectionModel().getSelected().json.area);
                    _this.panelPrincipal.cmbCentroCosto.enable();
                    _this.panelPrincipal.cmbCentroCosto.setValue(_this.getGridPrincipal().getSelectionModel().getSelected().json.centrocosto);
                    // _this.stIndicadores.reload();

                }  
                if (e == 'rowselect'){
                        var selecciones = sm.getSelections();
                       Ext.each(selecciones, function(dat) {    
                        if (selecciones.length == 1 ) {
                            _this.arrayActividad.push(dat.json.idcartatecindustrialactividad);
        
                        } else {
                                for (var i= 0; i <  _this.arrayActividad.length; i++) {
                                    if (dat.json.idcartatecindustrialactividad != _this.arrayActividad[i]) {
                                        _this.arrayActividad.push(dat.json.idcartatecindustrialactividad);
                                    }                 
                                }
                            
                            }              
                       });
                        
                        _this.stIndicadores.reload();
                    }
                        
                    if(e == 'rowdeselect'){
                           _this.arrayActividad = new Array();
                        if (sm.getSelections().length > 0) {
                            Ext.each(sm.getSelections(), function(sel) {
                                _this.arrayActividad.push(sel.json.idcartatecindustrialactividad);    
                            });
                            _this.stIndicadores.reload();
                        } else {
                            _this.stIndicadores.removeAll();
                        } 
                    }   
                    
                if (e == 'selectionchange' && this.getCount() > 1) {
                  
                    _this.panelPrincipal.cmbArea.setValue('');
                _this.panelPrincipal.cmbCentroCosto.setValue(''); 
              
                }
               
              
            });

            this.colcarta = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });

            this.colcarta.addComponent(this.cmbCartaTecnologica);

            _this.PanelSuperior = LOG.util.UIManager.initPanel({
                region: 'north',
                frame: true,
                autoHeight: true,
                layout: 'form',
                labelAlign: 'top',
                width: '10%',
                items: [this.colcarta]
            }); 
            this.cmbArea = new LOG.util.ComboBox({
                hiddenName: 'idestructura',
                url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/cargarAreas',//'/logistica/talleres/configuracion/index.php/configuraciontalleres/cargarAreasDelTaller',
                valueField: 'idestructura',
                displayField: 'text',
                fieldLabel: 'Área',
                autoLoad: true,
                minChars:1,
                pageSize : 15,
                campo: true,
                disabled:true,
                mode: 'remote',
                allowBlank: false,
               editable: false
            });
            this.cmbCentroCosto = new LOG.util.ComboBox({
                /*name: 'idcentrogrupo',*/
                fieldLabel: 'Centro de costo',
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCentroCostos',
                hiddenName: 'idcentrogrupo',
                displayField: 'text',
                valueField: 'idcentrogrupo',
                allowBlank: false,
                mode: 'local',
                disabled:true,
                pageSize: 10,
                editable:true,
                resizable: true     
            });

            this.colAct = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });

            this.colAct.addComponent(this.cmbArea);
            this.colAct.addComponent(this.cmbCentroCosto);

            _this.PanelRegionEste = LOG.util.UIManager.initPanel({
                layout: 'fit',
                region: 'east',
                width: '30%',
                frame: true,
                items: [this.colAct]
            });
               
            _this.stIndicadores = new Ext.data.Store({
           
                //autoLoad: true,
                url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/listarIndicadores',
                reader: new Ext.data.JsonReader({
                        id: "idestructura",
                        root: "datos"
                    },
                    [
                        {name: 'idprecioporindicador'},
                        {name: 'denominacion'},
                        {name: 'codigo'},
                        {name: 'norma'},
                        {name: 'precio'},
                        {name: 'importe'},
                        {name: 'idindicador'},
                        {name: 'um'}
                    ]),
    
                listeners: {
                    'beforeload': function(store, options){
                        store.baseParams = {
                            idcartatecindustrialactividad: _this.getGridPrincipal().getSelectionModel().getSelected().json.idcartatecindustrialactividad,
                            arrayActividad : _this.getGridPrincipal().getSelectionModel().getSelected() ? Ext.encode( _this.arrayActividad) : 0,
                            start: 0,
                            limit: 20
                        };
                    }
                }
            });
            _this.modificados = new Array();
            _this.gridIndicadores = new Ext.grid.EditorGridPanel({
                autoExpandColumn: 'denominacion',
                store: _this.stIndicadores,
                //region:'south',
                width: '100%',
                height:195,
                loadMask:true,
                border: true,
               // cm:cm,
               colModel: new Ext.grid.ColumnModel({
                    columns: [
                        {header:'Código', width: 100, sortable: true, dataIndex: 'codigo'},
                        {header: 'Denominación',dataIndex:'denominacion', sortable: true, id:'denominacion'},
                        {header:'Unidad de medida',dataIndex:'um', sortable: true},
                        {header:'Norma',dataIndex:'norma', sortable: true},
                        {header:'Precio',
                        dataIndex:'precio',
                         sortable: true, 
                          editor: LOG.util.Prototipos.inputDecimal({value: 0}),
                            renderer: function(_p, _mD, _r) {
                                if(_r.modified != null ) {
                                    if(_p){  
                                     _this.modificados.push( _r.get('idprecioporindicador'))   
                                    
                                    var preciomod = _p
                                    return preciomod;
                                    }  
                                }    
                               else {
                                 return _r.data.precio;
                                }  
                            },
                        },
                        
                        {header:'Importe',dataIndex:'importe', sortable: true,  renderer: function(v,md,record){
                            return  parseFloat(v).toFixed(6);
                        }}

                    ]
                }),
                sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
                bbar: new Ext.PagingToolbar({
                    store: _this.stIndicadores,
                })
            });

            _this.panelIndicadores = new Ext.Panel({
                title: 'Indicadores de la actividad',
                region: 'south',
                width: '100%',
                height:200,
                frame: true,
                items: [_this.gridIndicadores]
            });
            
            _this.arrayActividad = new Array();
      
            // _this.getGridPrincipal().getSelectionModel().on({
               
            // });   
            
    
            _this.getPanelGrid().add( _this.PanelSuperior, _this.PanelRegionEste, _this.panelIndicadores);
        });
      

        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
         
            aceptarFn: function (aplicar) {
                if (typeof _this.doAction == 'function') {
                    var idactividad = new Array();
                    var idindicador = new Array();
                    var modificados = new Array();

                    var actividades = _this.getGridPrincipal().getSelectionModel().getSelections();
                    var indicadores =  _this.stIndicadores.data.items;
                    //var modificados = _this.stIndicadores.getModifiedRecords();
                    Ext.each(actividades, function (rec) {
                        idactividad.push({
                            idcartatecindustrialactividad: rec.get('idcartatecindustrialactividad')
                        });
                    });
                    Ext.each(indicadores, function (rec) {
                       if (rec.data.idprecioporindicador == null || rec.data.idprecioporindicador == '') {
                            idindicador.push({
                                idindicadores: rec.get('idindicador'),
                                precio: rec.get('precio')
                            }); 
                        }        
                    });

                    Ext.each(_this.stIndicadores.getModifiedRecords(),function(mod){
                        modificados.push({
                            idindicadores: mod.data.idindicador,
                            precio: mod.data.precio,
                            idprecioporindicador: mod.data.idprecioporindicador
                        });
                    });
;

                    Ext.Ajax.request({
                        url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/adicionaractividad',
                        
                        params: { 
                            idcartatecindustrial: _this.modificarWin == 1 ? _this.getGridPrincipal().getSelectionModel().getSelected().data.idcartatecindustrial : (_this.panelPrincipal.cmbCartaTecnologica.getValue() != '' ? _this.panelPrincipal.cmbCartaTecnologica.getValue() : _this.idcartatecindustrial),
                            idcentrocosto:_this.panelPrincipal.cmbCentroCosto.getValue(),/*(_this.modificarWin == 1 && _this.panelPrincipal.cmbCentroCosto.getValue()) ? _this.panelPrincipal.cmbCentroCosto.getValue() :_this.panelPrincipal.cmbCentroCosto.getValue(),*/
                            idarea: _this.panelPrincipal.cmbArea.getValue(), //(_this.modificarWin == 1 && _this.panelPrincipal.cmbArea.getValue()) ? _this.panelPrincipal.cmbArea.getValue() : null,
                            idactividad: Ext.encode(idactividad),
                            idindicadores: Ext.encode(idindicador),
                            modificados :  Ext.encode(modificados)        
                        },
                        callback: function(opt, scs, resp) {
                            var respMsg = Ext.decode(resp.responseText);
                            if(resp.statusText == 'OK'){
                                mostrarMensaje(1, _this.idioma.lbMsgAddActividadOk);
                                _this.getStorePrincipal().load(); 
                                _this._parent.gridCarta.storePrincipal.load();
                            }else{
                                mostrarMensaje(3, _this.idioma.lbMsgAddActividadError);
                            }
                           // _this.idcartatecindustrial = respMsg.datos[0].idcartatecindustrial;   
                           idactividad = new Array();
                           idindicador = new Array();
                           modificados = new Array();                 
                        }          
                    });                    
                    //_this._parentP.getGridPrincipal().store.load();  
                }
            } 
        });
        this.getVistaPrincipal().width = 1000;
        this.getVistaPrincipal().height = 600;
        this.getVistaPrincipal().resizable = false;

        this.getVistaPrincipal().listaBotones.getItem(1).hide();
    },
    
    habilitarBotones: function () {
      
        var _this = this;  
       
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        _this.panelPrincipal.listaBotonesActividades.getItem(1).disable();
        _this.panelPrincipal.listaBotonesActividades.getItem(2).disable()
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(1).enable();
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
        if( _this.panelPrincipal.getSelectionModel().hasSelection()){
    _this.panelPrincipal.listaBotonesActividades.getItem(1).enable();
    _this.panelPrincipal.listaBotonesActividades.getItem(2).enable();
        }
    },
    doAction: function (datos, aplicar) {
       
    },
    postSalvar: function (r, a, _idselecc) {
        var _this = this;
        
    },
    modificar: function (record) {
        var _this = this;
       
        if (record) {
         _this.panelPrincipal.cmbCartaTecnologica.setValue(record.data.denominacionindicador);
        
            _this.getStorePrincipal().load();   
        }        
    },
    onCloseHandler: function (p) {
        var _this = this;
        _this.arrayActividad = new Array();
        this.habilitarItems();
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
        
    }
});




