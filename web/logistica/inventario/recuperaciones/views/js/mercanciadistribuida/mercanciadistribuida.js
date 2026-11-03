Ext.ns('Ext.erp.mercanciadistribuida');
Ext.erp.mercanciadistribuida =  Ext.extend(LOG.util.Panel, {
    edades:undefined,
    periodos:undefined,
    entidades:[],
    panelGenereal:undefined,
    listaBotones:undefined,
    params:undefined,
    constructor: function (config) {
        var _this = this;
        this.acciones = config.acciones;
        this.idioma = LOG.util.UIManager.apply(this.idioma, Log.tall.mercanciatransito.Idioma);
        this.bindBody();


        this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            text:this.idioma.lbBtnImprimir,
            handler: function() { 
                _this.getReportes(_this);     
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RImprimir')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            //if (this.getCount() == 1 && this.getSelected().data.estado == 3 || this.getCount() == 1 && this.getSelected().data.estado == 2) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        //}
                    })
                }
            }
        });

        this.listaBotones = new LOG.util.List();
        this.btnLimpiarMedio = new LOG.util.Prototipos.botonLimpiar({text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.ttBtnLimpiar,  handler: function() {
            _this.gridParte.btnLimpiar();
        }});
        this.btnVer = new LOG.util.Prototipos.botonVer({
            text: "Ver detalles",
            tooltip: this.idioma.ttBtnVer,
            handler: function() {

            var record = _this.gridParte.getGridPrincipal().getSelectionModel().getSelected();
           // console.log(record );
              //AKIM DEBO PONER LA VENTANANA
              var ventanaproductos = new Ext.erp.ventanaClientesSumin({
                idDoc: record.json.iddocumento,
                //noRef: record.get('ref_distri'),
                initDefaultColumns: function(){
                   
                    this.addGridColumn({
                        dataIndex: 'v_codiggo',
                        header: 'Código ',
                        width: 250,
                        default : true
                    });
                    this.addGridColumn({
                        dataIndex: 'v_proentregar',
                        header: 'Denominación ',
                        width: 100,
                        default : true
                    });
                    
                    this.addGridColumn({
                        dataIndex: 'v_cantentregar',
                        header: 'Autorizado',
                        width: 80
                    });
                    this.addGridColumn({
                        dataIndex: 'v_entregado',
                        header: 'Entregado',
                        width: 250,
                        default : true
                    });
                    this.addGridColumn({
                        dataIndex: 'v_enproceso',
                        header: 'En proceso',
                        width: 120,
                        align: 'right',
                    });
                    
                    this.addGridColumn({
                        dataIndex: 'v_pendiente',
                        header: 'No proceso',
                        width: 80,
                        align: 'right'
                    });
                    this.addGridColumn({
                        dataIndex: 'v_nat',
                        header: 'Naturaleza',
                        width: 80,
                        align: 'right'
                    });
                    this.addGridColumn({
                        dataIndex: 'observacione',
                        header: 'Observaciones',
                        width: 250,
                        align: 'right'
                    });
                   
                }

              });

              ventanaproductos.init();
              ventanaproductos.getVistaPrincipal().title = "Productos";
              ventanaproductos.view();
              ventanaproductos.getGridPrincipal().store.load();
              /*botonBuscar.handler = botonBuscar.handler.createSequence(function (e) {
               _this.ventanaproductos.btnBuscar();
            });*/
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RVerdetalles')) {
                    b.setVisible(true);
                    _caller.gridParte.getGridPrincipal().getSelectionModel().fireEvent = _caller.gridParte.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        console.log(b);
                        if (e == 'selectionchange') {
                           
                                b.enable();
                            } else {
                                b.disable();
                            }
                        
                    })
                }  
            }
           




        });

        this.btnBuscar  = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBtnBuscar,
            handler: function() {
                _this.gridParte.btnBuscar();
    
                
            }
        });
 
        this.listaBotones.add(this.btnVer);
        this.listaBotones.add(this.btnImprimir);
        this.listaBotones.add(this.btnBuscar);
        this.listaBotones.add(this.btnLimpiarMedio);
       
        config.layout = 'border';
        config.items = [{
            region:'north',
            tbar:this.listaBotones.getArray(),
           /* bbar: [
                '-',
                new Ext.form.Label({text: 'Buscar: '}),
                _this.gridParte.cmbBurcar,
            ]*/
        },
            this.panelGeneral
        ];
        Ext.erp.mercanciadistribuida.superclass.constructor.call(this,config);
    },

    bindBody:function(){
        var _this = this;
        this.gridParte = new Ext.erp.mercanciadistribuida.Grid({
            edades:this.edades,
            formaVisualizacion:'panel',
            panel: this
        });
        
        this.gridParte.init();
        var vista = this.gridParte.view();
        this.panelGeneral = new LOG.util.UIManager.initPanel({
            layout:'card',
            activeItem:0,
            region:'center',
            frame:true,
            items:[vista]
        });
    },
    getReportes: function(_this){
       var records = _this.gridParte.getGridPrincipal().getSelectionModel().getSelections();

       var idsDocumento = records.map(function (elem) {
        return elem.json.iddocumento;
       });

        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/mercancia_distribuida',
                    isList: true,
                    params: {
                        estructurasorigen :_this.gridParte.cmborigen.getValue(),
                        estructurasdestino :_this.gridParte.cmbdestino.getValue(),
                        fechainicio: (_this.gridParte.textdesde.getValue()) ? _this.gridParte.textdesde.getValue().format('d-m-Y') : null,
                        fechafin: (_this.gridParte.texthasta.getValue()) ? _this.gridParte.texthasta.getValue().format('d-m-Y') : null,
                        deposito:null,
                        estado:_this.gridParte.cmbestado.getValue(),
                        estadoejecucion:_this.gridParte.cmbestadoejecucion.getValue(),
                        idsdoc: idsDocumento ? '{' + idsDocumento.join(',') + '}' : null
                    }
                }
            ]
        });
       
        this.tipoReportes.view();
    }
});

Ext.erp.mercanciadistribuida.Grid = Ext.extend(LOG.util.UITemplate, {
    cantColumnsEstaticas:0,
    params:undefined,
    constructor: function(config) {
        config.dirController ='/logistica/inventario/recuperaciones/index.php/mercanciadistribuida';
        config.urlBusquedaGridPrincipal = 'getcargarmercanciadistribuida';
        config.modoSeleccion = 3;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoLoad = false;
        this.idGridPrincipal = 'iddocumento';
        config.idioma = {};
        Ext.erp.mercanciadistribuida.Grid.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.mercanciatransito.Idioma);
        this.addEvents('fechainiciochage');
        this.addEvents('filtrofechafin');
    },
    render: function(config) {
        var render = Ext.erp.mercanciadistribuida.Grid.superclass.render.call(this, config);
        var _this = this;

       

        this.cmbdestino = new LOG.util.ComboBox({
            fieldLabel: 'Entidades',
            id: 'idestructuradestinomd',
            url:'getEstructuras',
            name:'idestructura',
            displayField : 'denominacion',
            valueField : 'idestructura',
            resizable:true,
            listeners :  {
               
            }
            
        });
        
        this.cmborigen = new LOG.util.ComboBox({
            fieldLabel: 'Entidades',
            url:'getEstructuras',
            name:'idestructura',
            displayField : 'denominacion',
            valueField : 'idestructura',
            resizable:true,
            listeners :  {
     
            }


           
        });
        
        _this.textdesde = new Ext.form.DateField({
            width: 100,
            editable: false,
            listeners:{
                change:function(df, newValue){
                    render.fireEvent('fechainiciochage', newValue);
                }
            }
        });

        _this.texthasta = new Ext.form.DateField({ //---datefield Hasta
            width: 100,
            editable: false,
            listeners:{
                change:function(df, newValue){
                    render.fireEvent('filtrofechafin', newValue);
                }
            }
        });

        this.cmbestado = new LOG.util.ComboBox({
            fieldLabel: 'Estado',
            url:'/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getestado',
            name:'estado',
            displayField : 'denominacion',
            valueField : 'estado',
            resizable:true,
            store: new Ext.data.SimpleStore({
                fields: ['estado', 'denominacion'],
                data: [
                    [1, 'Elaboración'],
                    [2, 'Preparado '],
                    [3, 'Aprobado'],
                    [10, 'Propuesto a cancelar']
                ]
            }),
            
        });

        this.cmbestadoejecucion = new LOG.util.ComboBox({
        fieldLabel: 'estadoejecucion',
        hiddenName: 'estadoejecucion',
        store: new Ext.data.SimpleStore({
            fields: ['estadoejecucion', 'descripcion'],
            data: [
                [1, 'No Procesado'],
                [2, 'En Proceso '],
                [3, 'Cumplimentado']
            ]
        }),
        valueField: 'estadoejecucion',
        displayField: 'descripcion',
        editable: false   
        });


      
             

    

      /* this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                key: 'b',
                fn: function () {
                    if(render.isVisible())
                        _this.btnBuscar();
                }
            }]);*/

        this.gpPrincipal.getTopToolbar().add(
            new Ext.form.Label({text: 'Estructura origen:'}),
            _this.cmborigen,
            '-',
            new Ext.form.Label({text: 'Estructura destino:'}),
            _this.cmbdestino,
            '-',
            new Ext.form.Label({text: 'Desde:'}),
            _this.textdesde,
            '-',
            new Ext.form.Label({text: 'Hasta:'}),
            _this.texthasta,
            '-',
            new Ext.form.Label({text: 'Estado:'}),
            _this.cmbestado,
            '-',
            new Ext.form.Label({text: 'Estado de Ejecución:'}),
            _this.cmbestadoejecucion,
            '-',
           
           
        );

        this.getStorePrincipal().on({
            beforeload:function(st, obj){    
                    Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                        finicio :(_this.textdesde.getValue()) ? _this.textdesde.getValue().format('d-m-Y') : null,
                        fin:(_this.texthasta.getValue()) ? _this.texthasta.getValue().format('d-m-Y') : null,
                        estructuradest: (_this.cmbdestino.getValue()),
                        estructuraori:(_this.cmborigen.getValue()),
                        estado:(_this.cmbestado.getValue()),
                        estadoejecucion:(_this.cmbestadoejecucion.getValue()),
                        limit : _this.gpPrincipal.initialConfig.bbar.pageSize
                    })          
            },
            load:function(){
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, "No existen datos que se correspondan con los criterios de búsqueda  especificados");
                    }
                }
            }
        });


        return render;
    },
    
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'v_origen',
            header: 'Entidad origen',
            width: 250,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'v_v_destino',
            header: 'Entidad destino',
            width: 250,
            default : true
        });
        this.addGridColumn({
            dataIndex: 'num_distrib',
            header: 'N\xfamero documento',
            width: 100,
            default : true,
            align: 'right',
            filter : {
                type: 'combo',
                dataIndex: 'num_distrib',
                valueField: 'num_distrib',
                displayField: 'num_distrib',
                url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargardocumento',
     
            }
            
            
        });
        this.addGridColumn({
            dataIndex: 'ref_distri',
            header: 'N\xfamero referencia',
            width: 100,
            align: 'right',
            
        });
        this.addGridColumn({
            dataIndex: 'fecha',
            header: 'Fecha',
            width: 120,
            align: 'right',
        });
        this.addGridColumn({
            dataIndex: 'diferencia',
            header: 'Diferencia en  días ',
            width: 250,
            default : true,
            align: 'right',
        });
        this.addGridColumn({
            dataIndex: 'importe',
            header: 'Importe ',
            width: 250,
            default : true,
            align: 'right',
        });
        this.addGridColumn({
            dataIndex: 'referencias',
            header: 'Referencia',
            width: 120,
            align: 'right',
        });

        this.addGridColumn({
            dataIndex: 'deposito',
            header: 'Depósito',
            width: 250,
            default: true,
            align: 'right',
            filter : {
                type: 'combo',
                dataIndex: 'deposito',
                valueField: 'id_estructura_deposito',
                displayField: 'deposito',
                url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargarDeposito'

            }
        });

    
        this.addGridColumn({
            dataIndex: 'naturaleza',
            header: 'Naturaleza del producto',
            width: 250,
            align: 'right',
            filter : {
                type: 'combo',
                dataIndex: 'naturaleza',
                valueField: 'idnaturaleza',
                displayField: 'naturaleza',
                 url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargarnaturaleza'
            },
        });
        this.addGridColumn({
            dataIndex: 'observacione',
            header: 'Observaciones',
            width: 250,
            align: 'right'
        });
        this.addGridColumn({
            dataIndex: 'estado',
            header: 'Estado',
            width: 250,
            align: 'right'
        });
       
    },
    getReportes: function (data) {
        var _this = this;

    },
    btnBuscar: function (){
        var _this = this;
        _this.getStorePrincipal().filtrado = true;
        _this.getStorePrincipal().load();     
/*}*/

    },
    btnLimpiar: function(){
        var _this = this;
        if(_this.textdesde.getValue() || _this.texthasta.getValue() || _this.cmbdestino.getValue() || _this.cmborigen.getValue()||_this.cmbestado || _this.cmbestadoejecucion) {
            _this.textdesde.reset();
            _this.texthasta.reset();
            _this.cmborigen.reset();
            _this.cmbdestino.reset();
            _this.cmbestado.reset();
            _this.cmbestadoejecucion.reset(),
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

   /* cumplimiento:function(){
        
    },
       */ 
    
});

//...............Creo la ventana de ver el cumplimiento de cada documento.............

Ext.erp.ventanaClientesSumin = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;

        //this.idioma = log.inv.docemitidosrecibidos.Idioma;
       // console.log(config);
        config.modoSeleccion = 3;
        config.autoLoad = false;
        config.autoSelect = false;
        config.busquedaBasica = true;
        config.urlBusquedaGridPrincipal = 'getcargarProductos';
        this.dirController = '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida';
        this.idDoc = config.idDoc;
        //this.noRef = config.noRef;
        config.formaVisualizacion = 'ventana';
        config = Ext.apply(_this, config);
        Ext.erp.ventanaClientesSumin.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.mercanciatransito.Idioma);
       // _this.concepto = this.idioma.clientes;
       // _this.textBusquedaSimple = this.idioma.txtBusquedaSimpleC;
      
    },
    init: function () {
        var _this = this;
        Ext.erp.ventanaClientesSumin.superclass.init.call(this);
        _this.getVistaPrincipal().width = 1000;
        _this.getVistaPrincipal().height = 800;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).hide();

        
    },
    initDefaultColumns: function () {
        var _this = this;

    },
    btnBuscar: function (){
        var _this = this;
        _this.getStorePrincipal().filtrado = true;
        _this.getStorePrincipal().load();     

    },
    
    render: function () {
        var _this = this;
        var p = Ext.erp.ventanaClientesSumin.superclass.render.call(this);

      
              _this.getStorePrincipal().on({
                'beforeload': function (st, opt) {
                    console.log(opt);
                    opt.params.idDoc =_this.idDoc;
                    opt.params.start = 0;
                    opt.params.limit = 30;
                }
            });

        
        return p;
    }

    
});
