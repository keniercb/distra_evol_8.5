Ext.ns('Ext.erp.cuadredeproceso');
Ext.erp.cuadredeproceso =  Ext.extend(LOG.util.Panel, {
    edades:undefined,
    periodos:undefined,
    entidades:[],
    panelGenereal:undefined,
    listaBotones:undefined,
    params:undefined,
    constructor: function (config) {
        var _this = this;
        this.acciones = config.acciones;
        this.idioma = LOG.util.UIManager.apply(this.idioma, Log.tall.cuadredeproceso.Idioma);

        this.comboTipoReporte = new LOG.util.ComboBox({
            mode:'local',
            width: 260,
            listWidth: 255,
            editable:false,
            displayField:'denominacion',
            valueField:'idmodelo',
            store: new Ext.data.SimpleStore({
                fields: ['idmodelo', 'denominacion'],
                data: [
                    [1, _this.idioma.lbCbTotal],
                    [2, _this.idioma.lbCbOrdenesTrabajo],
                    [3, _this.idioma.lbCbOrdenesTrabajoCerradas]

                ]
            }),
            listeners:{
                select: function(cb, rec){
                    var tiporeporte = 0;
                    if(cb.value==1){
                        tiporeporte=1;
                        _this.btnImprimir.setDisabled(true);
                        _this.gridPrincipal.cmGridPrincipal.setHidden(0,true);
                        _this.gridPrincipal.cmGridPrincipal.setHidden(1,true);
                        _this.gridPrincipal.cmGridPrincipal.setHidden(2,true);
                        _this.gridPrincipal.cmGridPrincipal.setHidden(3,true);
                        _this.gridPrincipal.cmGridPrincipal.setHidden(4,true);
                        _this.gridPrincipal.cmGridPrincipal.setHidden(5,true);
                    }
                    if(cb.value==2){
                        tiporeporte = 2;
                        _this.btnImprimir.setDisabled(false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(0,false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(1,false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(2,false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(3,false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(4,false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(5,false);
                     }
                     if(cb.value==3){
                        tiporeporte = 3;
                        _this.btnImprimir.setDisabled(false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(0,false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(1,false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(2,false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(3,false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(4,false);
                         _this.gridPrincipal.cmGridPrincipal.setHidden(5,false);
                     }
                     
                    _this.gridPrincipal.getStorePrincipal().reload();

                },
               
            }
        });

      this.comboTipoReporte.setValue(1);

        this.bindBody();
        this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            text:this.idioma.lbBtnImprimir,
            disabled:true,
            handler: function() {
                _this.getReportes(_this);
            }
        });
        this.listaBotones = new LOG.util.List();
        this.btnLimpiarMedio = new LOG.util.Prototipos.botonLimpiar({text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.ttBtnLimpiar,  handler: function() {
            _this.btnLimpiar();
        }});
        this.btnBuscar = new LOG.util.Prototipos.botonBuscar({text: this.idioma.ttBtnBuscar, tooltip: this.idioma.ttBtnBuscar,  handler: function() {
            _this.gridPrincipal.btnBuscar();
        }});

        
        
        this.comboTipoReporte.setValue(1);

        this.listaBotones.add(this.btnImprimir);
        this.listaBotones.add(this.btnLimpiarMedio);
        this.listaBotones.add(this.btnBuscar);

        config.layout = 'border';
        config.items = [{
            region:'north',
            tbar:this.listaBotones.getArray(),
           bbar: [ '-',
                new Ext.form.Label({text: 'Tipo de reporte:'}),
                ' ',
                this.comboTipoReporte,
                '-']
        },
            this.panelGeneral
        ];
        Ext.erp.cuadredeproceso.superclass.constructor.call(this,config);
    },
    bindBody:function(){
        var _this = this;
        this.gridPrincipal = new Ext.erp.cuadredeproceso.Grid({
            edades:this.edades,
            comboTipoReporte: _this.comboTipoReporte,
            formaVisualizacion:'panel'
        });
        this.gridPrincipal.init();
        var vista = this.gridPrincipal.view();
        this.panelGeneral = new LOG.util.UIManager.initPanel({
            layout:'card',
            activeItem:0,
            region:'center',
            frame:true,
            items:[vista]
        });
    },
    btnLimpiar:function(){
        var param = false;
        if(!(this.comboTipoReporte.getValue()) ){  
        param = true;
        }else
        this.gridPrincipal.setParams({limp:param});
        this.gridPrincipal.btnLimpiar();
    },
    valorTipoReporte: function() {
        return this.comboTipoReporte.getValue();
    },
    getReportes:function(_this){
        var stringEnt = "";
        var estructuras = "";
        var ordenesn = [];
        _this.estructuras=[];

        for(var i=0; i < _this.gridPrincipal.getStorePrincipal().reader.jsonData.datos.length; i++){
            ordenesn.push(_this.gridPrincipal.getStorePrincipal().reader.jsonData.datos[i])
        }
        for(var i=0; i < _this.gridPrincipal.getStorePrincipal().reader.jsonData.datos.length; i++){
            _this.estructuras.push(_this.gridPrincipal.getStorePrincipal().reader.jsonData.datos[i].idestructura)
        }
        estructuras = "{"+_this.estructuras.join() + "}";
        if(estructuras== "{}") {
            estructuras = null;
        }
        
        stringEnt = "{" + _this.entidades.join() + "}";

        if(stringEnt== "{}") {
            stringEnt = null;
        }

        if(_this.comboTipoReporte.value == 2) {

            this.tipoReportes = new LOG.util.Report({
                reports: [
                    {
                        dirReport: '/distra/logistica/talleres/recuperaciones/CuadreProceso/CuadreProceso',
                        isList:true,
                        params: {
                            fechainicio: (_this.gridPrincipal.textDesde.getValue()) ? _this.gridPrincipal.textDesde.getValue().format('d-m-Y') : null,
                            fechafin: (_this.gridPrincipal.textHasta.getValue()) ? _this.gridPrincipal.textHasta.getValue().format('d-m-Y') : null,
                            //idestructuras: estructuras,
                            //ordeneslist : ordenesn,
                            cliente: (_this.gridPrincipal.cmbCliente.getValue()) ? _this.gridPrincipal.cmbCliente.getValue() : null,
                            sector : (_this.gridPrincipal.cmbSector.getValue()) ? _this.gridPrincipal.cmbSector.getValue() : null
                        }
                    }
                ]
            });
            this.tipoReportes.view();
        } 
    },
    grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(this.acciones, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    }
});

Ext.erp.cuadredeproceso.Grid = Ext.extend(LOG.util.UITemplate, {
    cantColumnsEstaticas:0,
    params:undefined,
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/cuadredeproceso';
        config.urlBusquedaGridPrincipal = 'getCuadredeproceso';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoLoad = false;
        this.idGridPrincipal = 'iddocumento';
        config.idioma = {};
        this.comboTipoReporte = config.comboTipoReporte;
        Ext.erp.cuadredeproceso.Grid.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.cuadredeproceso.Idioma);
        this.addEvents('fechainiciochage');
        this.addEvents('filtrofechafin');
    },
    init: function() {
        var _this = this;
        Ext.erp.cuadredeproceso.Grid.superclass.init.call(this);
    },
    render: function(config) {
        var render = Ext.erp.cuadredeproceso.Grid.superclass.render.call(this, config);
        var _this = this;


        _this.textDesde = new Ext.form.DateField({
            width: 100,
            editable: false,
            listeners:{
                change:function(df, newValue){
                    render.fireEvent('fechainiciochage', newValue);
                }
            }
        });

        _this.textHasta = new Ext.form.DateField({
            width: 100,
            editable: false,
            listeners:{
                change:function(df, newValue){
                    render.fireEvent('fechafinchage', newValue);
                }
            }
        });

        _this.cmbCliente = new LOG.util.ComboBox({
            fieldLabel: 'Cliente',
            //editable: false,
            url: '/logistica/talleres/recuperaciones/index.php/cuadredeproceso/cargarClientes',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 20,
            minChars: 0,
            mode: 'remote'
        });
        this.cmbSector = new LOG.util.ComboBox({
            fieldLabel: 'Sector',
           // autoLoad: true,
            url: '/logistica/talleres/recuperaciones/index.php/cuadredeproceso/cargarSector',
            hiddenName: 'idsector',
            valueField: 'idsector',
            displayField: 'denominacion',
            //loadingText: this.idioma.msgCargandoDatos,
            triggerAction: 'all',
            enableQtip: true
        });
        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                key: 'b',
                fn: function () {
                    if(render.isVisible())
                       _this.btnBuscar();
                }
            }]);

        this.gpPrincipal.getTopToolbar().add(
            '-',
            new Ext.form.Label({text: 'Desde:'}),
            _this.textDesde,
            '-',
            new Ext.form.Label({text: 'Hasta:'}),
            _this.textHasta,
            '-',
            new Ext.form.Label({text: 'Cliente:'}),
            _this.cmbCliente,
            '-',
            new Ext.form.Label({text: 'Sector:'}),
            _this.cmbSector,
            '-',

        );

        this.getStorePrincipal().on({
            beforeload:function(st, obj){
                Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                    tiporeporte: _this.comboTipoReporte.getValue(),
                    fechainicio:_this.textDesde.getValue(),
                    fechafin:_this.textHasta.getValue(),
                    cliente: _this.cmbCliente.getValue(),
                    sector : _this.cmbSector.getValue() 
                });
            },
            load:function(){
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
            }
        });
        LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams,_this.comboTipoReporte.getValue(),_this.textDesde.getValue(),_this.textHasta.getValue());
        this.getStorePrincipal().load();
        return render;
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: 'N\xfamero de orden',
            width: 120,
            aling : 'right',
            //hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'fechainicio',
            header: 'Fecha de inicio',
            width: 350,
            aling : 'right',
            //hidden: true,
            default : true
        });
        this.addGridColumn({
            dataIndex: 'fechafin',
            header: 'Fecha de fin',
            width: 350,
            aling : 'right',
            ///hidden: true,
            default : true
        });
        this.addGridColumn({
            dataIndex: 'valeentrega',
            header: 'Vale de entrega',
            width: 350,
            aling : 'right',
            hidden: true,
            default : true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
       
        this.addGridColumn({
            dataIndex: 'valedev',
            header: 'Vale de devolución',
            width: 350,
            hidden: true,
            aling : 'right',
            default : true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        // this.addGridColumn({
        //     dataIndex: 'diferencia',
        //     header: 'Diferencia',
        //     width: 350,
        //     aling : 'right',
        //    // hidden: true,
        //     default : true,
        //     renderer: function (v) {
        //         return Ext.util.Format.number(v, '0,000.00');
        //     }
        // });
        this.addGridColumn({
            dataIndex: 'importeorden',
            header: 'Importe total',
            aling : 'right',
            width: 250,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.onGridDobleClick = function () {
            if((this.comboTipoReporte.getValue()== 2)||(this.comboTipoReporte.getValue()== 3)){
                var winVentana = new Ext.erp.cuadredeproceso.VentanaA({
                    idioma: _this.idioma,
                    _parent: _this
                });
            }
         
            winVentana.init();
            _this.vistaVentana = winVentana.view();
            _this.vistaVentana.show();
        };
    },
    getReportes: function (data) {
        var _this = this;

    },
    btnBuscar: function (){
        var _this = this;
        var desde = _this.textDesde.getValue();
        var hasta = _this.textHasta.getValue();
        //if(desde || hasta) {
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load();
       // }
    },
    btnLimpiar: function(){
        var _this = this;
        if(_this.textDesde.getValue() || _this.textHasta.getValue() || !_this.params.limp) {
            _this.textDesde.reset();
            _this.textHasta.reset();
            _this.cmbSector.reset();
            _this.cmbCliente.reset();
            _this.getStorePrincipal().filtrado = false;
            _this.getStorePrincipal().load();
        }
    },
    getIndexByDataIndexDinamic:function(header){
        var longitud = this.listaColumnas.count();
        for(var i= this.cantColumnsEstaticas; i < longitud; i++){
            var it = this.listaColumnas.getItem(i);
            if(it && it.dataIndex == header){
               return i;
            }
        }
        return false;
    },
    atIndex:function(list, item){
        var res = -1;
        list.each(function(elem, index){
            if(elem === item){
                res = index;
            }
        });
        return res
    },
    setParams:function(newParams){
        this.params = newParams;
    }
});
Ext.erp.cuadredeproceso.Ventana = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        //this.urlBusquedaGridPrincipal ='listarValeEntrega';
        this.dirController = '/logistica/talleres/recuperaciones/index.php/cuadredeproceso';
        config.idioma = Ext.erp.cuadredeproceso.Idioma;
        
        Ext.erp.cuadredeproceso.Ventana.superclass.constructor.call(this, config);
    },
   
    init: function () {
        var _this = this;
        Ext.erp.cuadredeproceso.Ventana.superclass.init.call(this);
        //this.getVistaPrincipal().setTitle('Vales de entrega');
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().width = 1000;
        this.getVistaPrincipal().height = 800;
        this.getVistaPrincipal().resizable = false;
        
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function () {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function (aplicar) {
                if (typeof _this.doAction == 'function') {
                    if (!_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                        mostrarMensaje(1, 'Debe seleccionar');
                        return;
                    }
                    _this.doAction.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections(), aplicar]).call();
                }
            }
        });
       
    
    //Grid vale de entrega
    this.gridVentrenga = new Ext.erp.cuadredeproceso.gridValeEntrega({
        idioma: _this.idioma,
        _parent: _this
    });
    this.gridVentrenga.init();
    this.entrega = this.gridVentrenga.view();
    
     //Grid devolucion
     this.gridVdevolucion = new Ext.erp.cuadredeproceso.gridValeDevolucion({
        idioma: _this.idioma,
        _parent: _this
    });
    this.gridVdevolucion.init();
    this.devolucion = this.gridVdevolucion.view();
    

    //Grid productos entrega
    this.gridProdEntrega = new Ext.erp.cuadredeproceso.gridProdEntrega({
        idioma: _this.idioma,
        _parent: _this
    });
    this.gridProdEntrega.init();
    this.prodentrega = this.gridProdEntrega.view();
    
    //Grid productos devolucion
    this.gridProdDevolucion = new Ext.erp.cuadredeproceso.gridProdDevolucion({
        idioma: _this.idioma,
        _parent: _this
    });
    this.gridProdDevolucion.init();
    this.proddevolucion = this.gridProdDevolucion.view();

         //Panel vale de entrega
         this.panelValeEntrega = new LOG.util.Panel({
            frame:true,
            items: [this.entrega],
            title: ' Vale de entrega',
            width: '100%',
           layout: 'fit'
            
        });
         //Panel vale de devolucion
         this.panelValeDevolucion = new LOG.util.Panel({
            frame:true,
            items: [this.devolucion],
            title: ' Vale de devolucion',
            width: '100%',
           region:'south',
           layout: 'fit'
        });
        //Panel prod vale de entrega
        this.panelProdValeEntrega = new LOG.util.Panel({
            frame:true,
            items: [this.prodentrega],
            title: 'Productos del vale de entrega',
            width: '100%',
           region:'south',
           layout: 'fit'
            
        });
       
        //Panel prod vals devolucion
        this.panelProdValeDevolucion = new LOG.util.Panel({
            frame:true,
            items: [this.proddevolucion],
            title: ' Productos del vale devolucion',
            width: '100%',
           region:'south',
           layout: 'fit'                                                                                      
        });

        this.colDer = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        this.colDer.addComponent(this.panelProdValeEntrega);
         this.colDer.addComponent( this.panelProdValeDevolucion);

        //Panel derecha
        this.panelDer = new LOG.util.Panel({
            frame:true,
            items: [this.colDer],
            width: '50%',
            region:'east'
        });

        this.colIzq = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        this.colIzq.addComponent(this.panelValeEntrega);
        this.colIzq.addComponent( this.panelValeDevolucion);

        //Panel izquierda
        this.panelIzq = new LOG.util.Panel({
            frame:true,
            items: [this.colIzq],
            width: '50%',
            region: 'west',
            layout:'fit'
            
        });
        
        this.getPanelGrid().onRender = this.getPanelGrid().onRender.createSequence(function () {
                _this.getPanelGrid().add(_this.panelIzq, _this.panelDer);

                _this.gridVentrenga.getStorePrincipal().on({
                    'beforeload': function (st) {  
                         st.initBaseParams.nrodoc = _this._parent.gpPrincipal.getSelectionModel().getSelections()[0].data.nrodoc;
                         st.initBaseParams.idordentrabajo = _this._parent.gpPrincipal.getSelectionModel().getSelections()[0].json.idordentrabajo;
                    }
                 });

                 _this.gridProdEntrega.getStorePrincipal().on({
                    'beforeload': function (st) {
                       st.initBaseParams.iddocumento = _this.gridVentrenga.getGridPrincipal().getSelectionModel().getSelected() ? _this.gridVentrenga.getGridPrincipal().getSelectionModel().getSelected().json.iddocumento : -1;                    
                    }
                 });
                 _this.gridProdDevolucion.getStorePrincipal().on({
                    'beforeload': function (st) {
                       st.initBaseParams.iddocumento = _this.gridVdevolucion.getGridPrincipal().getSelectionModel().getSelected() ? _this.gridVdevolucion.getGridPrincipal().getSelectionModel().getSelected().json.iddocumento : -1;                    
                    }
                 });

                _this.gridVdevolucion.getStorePrincipal().on({
                    'beforeload': function (st) {               
                         st.initBaseParams.nrodoc = _this._parent.gpPrincipal.getSelectionModel().getSelections()[0].data.nrodoc;
                         st.initBaseParams.idordentrabajo = _this._parent.gpPrincipal.getSelectionModel().getSelections()[0].json.idordentrabajo;
                    }
                 });

                 _this.gridVentrenga.getGridPrincipal().getSelectionModel().fireEvent = _this.gridVentrenga.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange' && this.getCount() == 1) {
                        _this.gridProdEntrega.getStorePrincipal().load();
                        //_this.gridVdevolucion.getStorePrincipal().load();
                    } else {
                        _this.gridProdEntrega.getStorePrincipal().removeAll();
                        _this.gridProdEntrega.getGridPrincipal().getView().refresh();
                        // _this.gridVdevolucion.getStorePrincipal().removeAll();
                        // _this.gridVdevolucion.getGridPrincipal().getView().refresh();

                    }
                });

                _this.gridVdevolucion.getGridPrincipal().getSelectionModel().fireEvent = _this.gridVdevolucion.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange' && this.getCount() == 1) {
                        _this.gridProdDevolucion.getStorePrincipal().load();
                    } else {
                        _this.gridProdDevolucion.getStorePrincipal().removeAll();
                        _this.gridProdDevolucion.getGridPrincipal().getView().refresh();

                    }
                });

            }, this);

    },
    
    render: function () {
        var _this = this;
        var _res = Ext.erp.cuadredeproceso.Ventana.superclass.render.call(this);

        return _res;
    },
    
  onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.gridVentrenga.getStorePrincipal().reload();
        this.gridVdevolucion.getStorePrincipal().reload();
        
    }
});

Ext.erp.cuadredeproceso.VentanaA = Ext.extend(Ext.erp.cuadredeproceso.Ventana, {
    _parent: undefined,
    constructor: function (config) {
        Ext.erp.cuadredeproceso.VentanaA.superclass.constructor.call(this, config);
        this.autoLoad = false;
    },
    doAction: function (r, aplicar) {
       
    },
    postSalvar: function (r, a, _idselecc) {
       
    }
});

Ext.erp.cuadredeproceso.gridProdEntrega = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.urlBusquedaGridPrincipal = 'listarproductos';
        this.dirController = '/logistica/talleres/recuperaciones/index.php/cuadredeproceso';
        config.idioma = Ext.erp.cuadredeproceso.Idioma;
      
        Ext.erp.cuadredeproceso.gridProdEntrega.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: 'Codigo',
            width: 160,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: 'Codigo del proveedor',
            width: 160,
            dataIndex: 'codigoproveedor',
            default: true
        });
        this.addGridColumn({
            header: 'Denominacion',
            width: 160,
            dataIndex: 'text',
            default: true
        });
        this.addGridColumn({
            header: 'UM',
            width: 160,
            dataIndex: 'umedida',
            default: true
        });
        this.addGridColumn({
            header: 'Cantidad',
            width: 160,
            dataIndex: 'cantidad',
            default: true
        });
    },
    init: function () {
        var _this = this;
        Ext.erp.cuadredeproceso.gridProdEntrega.superclass.init.call(this);
        this.getVistaPrincipal().setTitle('Productos del vale de entrega');
       
        this.getVistaPrincipal().height = 320;
        this.getVistaPrincipal().resizable = false;
    
    },
    render: function () {
        var _this = this;
        var _res = Ext.erp.cuadredeproceso.gridProdEntrega.superclass.render.call(this);
        return _res;
    }
});

Ext.erp.cuadredeproceso.gridProdDevolucion = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 1;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.urlBusquedaGridPrincipal = 'listarproductos';
        this.dirController = '/logistica/talleres/recuperaciones/index.php/cuadredeproceso';
        config.idioma = Ext.erp.cuadredeproceso.Idioma;
       
        Ext.erp.cuadredeproceso.gridProdDevolucion.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: 'Codigo',
            width: 160,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: 'Codigo del proveedor',
            width: 160,
            dataIndex: 'codigoproveedor',
            default: true
        });
        this.addGridColumn({
            header: 'Denominacion',
            width: 160,
            dataIndex: 'text',
            default: true
        });
        this.addGridColumn({
            header: 'UM',
            width: 160,
            dataIndex: 'umedida',
            default: true
        });
        this.addGridColumn({
            header: 'Cantidad',
            width: 160,
            dataIndex: 'cantidad',
            default: true
        });
    },
    init: function () {
        var _this = this;
        Ext.erp.cuadredeproceso.gridProdDevolucion.superclass.init.call(this);
        this.getVistaPrincipal().setTitle('Productos del vale de devolucion');
        
        this.getVistaPrincipal().height = 320;
        this.getVistaPrincipal().resizable = false;
  
        
    },
    render: function () {
        var _this = this;
        var _res = Ext.erp.cuadredeproceso.gridProdDevolucion.superclass.render.call(this);
        return _res;
    }
});

Ext.erp.cuadredeproceso.gridValeDevolucion = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 1;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
       
        this.urlBusquedaGridPrincipal = 'listarValedevolucion';
        this.dirController = '/logistica/talleres/recuperaciones/index.php/cuadredeproceso';
        config.idioma = Ext.erp.cuadredeproceso.Idioma;
      
        Ext.erp.cuadredeproceso.gridValeDevolucion.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: 'Nº documento',
            width: 100,
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: 'Fecha contable',
            width: 160,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: 'Depósito',
            width: 200,
            dataIndex: 'deposito',
            default: true
        });
        // this.addGridColumn({
        //     header: 'Importe',
        //     width: 160,
        //     dataIndex: 'importe',
        //     default: true
        // });
    },
    init: function () {
        var _this = this;
        Ext.erp.cuadredeproceso.gridValeDevolucion.superclass.init.call(this);
        this.getVistaPrincipal().setTitle('Vales de devolución');
       
        this.getVistaPrincipal().height = 320;
        this.getVistaPrincipal().resizable = false;
 
    },
    render: function () {
        var _this = this;
        var _res = Ext.erp.cuadredeproceso.gridValeDevolucion.superclass.render.call(this);
       
        return _res;
    }
});
Ext.erp.cuadredeproceso.gridValeEntrega = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        
        this.urlBusquedaGridPrincipal = 'listarValeEntrega';
        this.dirController = '/logistica/talleres/recuperaciones/index.php/cuadredeproceso';
        config.idioma = Ext.erp.cuadredeproceso.Idioma;
       
        Ext.erp.cuadredeproceso.gridValeEntrega.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: 'Nº documento',
            width: 100,
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: 'Fecha contable',
            width: 160,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: 'Depósito',
            width: 200,
            dataIndex: 'deposito',
            default: true
        });
        // this.addGridColumn({
        //     header: 'Importe',
        //     width: 160,
        //     dataIndex: 'importe',
        //     default: true
        // });
    },
    init: function () {
        var _this = this;
        Ext.erp.cuadredeproceso.gridValeEntrega.superclass.init.call(this);
        this.getVistaPrincipal().setTitle(' vale de entrega');
        
        this.getVistaPrincipal().height = 320;
        this.getVistaPrincipal().resizable = false;
    },
    render: function () {
        var _this = this;
        var _res = Ext.erp.cuadredeproceso.gridValeEntrega.superclass.render.call(this);
       
        return _res;
    }

});