Ext.ns('Ext.erp.indicadordeinventario');
Ext.erp.indicadordeinventario =  Ext.extend(LOG.util.Panel, {
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
            tooltip: "Imprimir indicadores",
            text:" Vista Reporte",
            handler: function() { 
                _this.getReportes(_this);     
            },
            controlFn: function (b, _caller) {
               
            }
        });

        this.listaBotones = new LOG.util.List();
        this.btnLimpiarMedio = new LOG.util.Prototipos.botonLimpiar({text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.ttBtnLimpiar,  handler: function() {
            _this.gridInventario.btnLimpiar();
        }});
        
        this.btnAceptar = new LOG.util.Prototipos.botonAceptar({text: "Aceptar", tooltip: "Aceptar las busquedas",  handler: function() {
            _this.gridInventario.btnBuscar(); 
        }});
       
       
        this.listaBotones.add(this.btnImprimir);
        this.listaBotones.add(this.btnLimpiarMedio);
        this.listaBotones.add(this.btnAceptar);
        


        config.layout = 'border';
        config.items = [{
            region:'north',
            tbar:this.listaBotones.getArray(),
             
         
        },
            this.panelGeneral
        ];
        Ext.erp.indicadordeinventario.superclass.constructor.call(this,config);
    },
  
    bindBody:function(){
        var _this = this;
        this.gridInventario = new Ext.erp.indicadordeinventario.Grid({
            edades:this.edades,
            formaVisualizacion:'panel',
            panel: this
        });
        
        this.gridInventario.init();
        var vista = this.gridInventario.view();
        this.panelGeneral = new LOG.util.UIManager.initPanel({
            layout:'card',
            activeItem:0,
            region:'center',
            frame:true,
            items:[vista]
        });
    },
    getReportes: function(_this){
       var records = _this.gridInventario.getGridPrincipal().getSelectionModel().getSelections();

       var idsDocumento = records.map(function (elem) {
        return elem.json.iddocumento;
       });

        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/IndicadoresDeInventario',
                    isList: true,
                    params: {
                        fechainicio: (_this.gridInventario.textdesde.getValue()) ? _this.gridInventario.textdesde.getValue().format('d-m-Y') : null,
                        fechafin: (_this.gridInventario.texthasta.getValue()) ? _this.gridInventario.texthasta.getValue().format('d-m-Y') : null,
                        deposito:_this.gridInventario.cmbdeposito.getValue(),
                       
                       
                       
                    }
                }
            ]
        });
       
        this.tipoReportes.view();
    }
});

Ext.erp.indicadordeinventario.Grid = Ext.extend(LOG.util.UITemplate, {
    cantColumnsEstaticas:0,
    params:undefined,
    constructor: function(config) {
        config.dirController ='/logistica/inventario/recuperaciones/index.php/indicadordeinventario';
        config.urlBusquedaGridPrincipal = 'getcargarindicadordeinventario';
        config.modoSeleccion = 1;//3
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoLoad = false;
        this.idGridPrincipal = 'iddocumento';//debe cambiar
        config.idioma = {};
        config.roweditor = false;
        config.autoShow = true;
        config.autoLoad = true;
        config.busquedaAvanzada = true;
        Ext.erp.indicadordeinventario.Grid.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.mercanciatransito.Idioma);
        this.addEvents('fechainiciochage');
        this.addEvents('filtrofechafin');
    },
    render: function(config) {
        var render = Ext.erp.indicadordeinventario.Grid.superclass.render.call(this, config);
        var _this = this;
        this.leyenda = new LOG.lb.plugin.Leyenda({
            leyendAlign: 'bot-left',
            leyendContainer: this.getGridPrincipal(),
            leyendConfig: this.getLeyenda()
        });
        this.getGridPrincipal().getBottomToolbar().insert(this.getGridPrincipal().getBottomToolbar().items.length - 1, this.leyenda);
        this.getGridPrincipal().getBottomToolbar().insert(this.getGridPrincipal().getBottomToolbar().items.length - 1, '-');
       
        
        _this.textdesde = new Ext.form.DateField({
            width: 100,
            editable: false,
            format: 'd/m/Y',
            listeners:{
                change:function(df, newValue){
                    render.fireEvent('fechainiciochage', newValue);
                }
            }
        });

        _this.texthasta = new Ext.form.DateField({ 
            width: 100,
            editable: false,
            format: 'd/m/Y',
            listeners:{
                change:function(df, newValue){
                    render.fireEvent('filtrofechafin', newValue);
                }
            }
        });

        this.cmbdeposito = new LOG.util.LovCombo({
            fieldLabel: 'Depósito',
            id: 'iddeposito',
            url:'/logistica/inventario/recuperaciones/index.php/indicadordeinventario/cargardepositos',
            name:'iddeposito',
            displayField : 'deposito',
            valueField : 'iddeposito',
            resizable:true,
          
            
        });
      
        this.gpPrincipal.getTopToolbar().add(
           
            new Ext.form.Label({text: 'Desde:'}),
            _this.textdesde,
            '-',
            new Ext.form.Label({text: 'Hasta:'}),
            _this.texthasta,
            '-',
          
           
           
        );

        this.getStorePrincipal().on({
            beforeload:function(st, obj){    
                    Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                        finicio :(_this.textdesde.getValue()) ? _this.textdesde.getValue().format('d-m-Y') : null,
                        fin:(_this.texthasta.getValue()) ? _this.texthasta.getValue().format('d-m-Y') : null,
                        deposito:(_this.cmbdeposito.getValue()),
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

        this.getPanelSuperior().onRender = this.getPanelSuperior().onRender.createSequence(function() {
            _this.getPanelSuperior().add({
                border: false,
               tbar: [
                    '->',  new Ext.form.Label({text: 'Depósito:'}),
                          _this.cmbdeposito,
                ]
            });
            _this.getPanelSuperior().doLayout();
            
        });

       

        return render;
    },
    
    
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'naturaleza',
            header: ' Naturaleza',
            width: 250,
            default: true,
             filter : {
                type: 'combo',
                dataIndex: 'naturaleza',
                valueField: 'naturaleza',
                displayField: 'naturaleza',
                url:'/logistica/inventario/recuperaciones/index.php/indicadordeinventario/cargarnaturaleza',
            }
            
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: 'Código',
            width: 250,
            default : true,
             filter : {
                type: 'numeric',
                dataIndex: 'codigo',
                valueField: 'codigo',
                displayField: 'codigo',
               // url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargardocumento',
     
            }
            
        });
        this.addGridColumn({
            dataIndex: 'producto',
            header: 'Producto',
            width: 100,
            default : true,
            align: 'right',
            filter : {
                type: 'numeric',
                dataIndex: 'producto',
                valueField: 'producto',
                displayField: 'producto',
               // url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargardocumento',
     
            }
            
            
        });
        this.addGridColumn({
            dataIndex: 'periodo',
            header: 'PA',
            width: 100,
            align: 'right',
            filter : {
                type: 'numeric',
                dataIndex: 'periodo',
                valueField: 'producto',
                displayField: 'producto',
               // url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargardocumento',
     
            }
            
        });
        this.addGridColumn({
            dataIndex: 'unidades',
            header: 'UV',
            width: 120,
            align: 'right',
            filter : {
                type: 'numeric',
                dataIndex: 'unidades',
                valueField: 'unidades',
                displayField: 'unidades',
               // url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargardocumento',
     
            }
        });
        this.addGridColumn({
            dataIndex: 'diascero',
            header: 'DO ',
            width: 250,
            default : true,
            align: 'right',
            filter : {
                type: 'numeric',
                dataIndex: 'diascero',
                valueField: 'diascero',
                displayField: 'diascero',
               // url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargardocumento',
     
            }
        });
        this.addGridColumn({
            dataIndex: 'coastoxunidad',
            header: 'CU ',
            width: 250,
            default : true,
            align: 'right',
            filter : {
                type: 'numeric',
                dataIndex: 'coastoxunidad',
                valueField: 'coastoxunidad',
                displayField: 'coastoxunidad',
               // url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargardocumento',
     
            }
        });
        this.addGridColumn({
            dataIndex: 'existenciamedia',
            header: 'EMP',
            width: 120,
            align: 'right',
            filter : {
                type: 'numeric',
                dataIndex: 'existenciamedia',
                valueField: 'existenciamedia',
                displayField: 'existenciamedia',
               // url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargardocumento',
     
            }
        });

        this.addGridColumn({
            dataIndex: 'rotacion',
            header: 'R',
            width: 250,
            default: true,
            align: 'right',
            filter : {
                type: 'numeric',
                dataIndex: 'rotacion',
                valueField: 'rotacion',
                displayField: 'rotacion',
                url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargarDeposito'

            }
        });

    
        this.addGridColumn({
            dataIndex: 'covertura',
            header: 'C',
            width: 250,
            align: 'right',
           filter : {
                type: 'numeric',
                dataIndex: 'covertura',
                valueField: 'covertura',
                displayField: 'covertura',
                 url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargarnaturaleza'
            },
        });
        this.addGridColumn({
            dataIndex: 'diaspresencia',
            header: 'DP',
            width: 250,
            align: 'right',
            filter : {
                type: 'numeric',
                dataIndex: 'diaspresencia',
                valueField: 'diaspresencia',
                displayField: 'diaspresencia',
               // url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargardocumento',
     
            }
        });
        this.addGridColumn({
            dataIndex: 'consumomedio',
            header: 'CMD',
            width: 250,
            align: 'right',
            filter : {
                type: 'numeric',
                dataIndex: 'consumomedio',
                valueField: 'consumomedio',
                displayField: 'consumomedio',
               // url: '/logistica/inventario/recuperaciones/index.php/mercanciadistribuida/getcargardocumento',
     
            }
        });
       
    },
    
    
    getReportes: function (data) {
        var _this = this;

    },
    getLeyenda: function() {
        return {
            autoWidth: true,
            autoHeight: true,
            tpl: new Ext.XTemplate(
                '<div class="leyend-block">',
                '<h3>' + " Formulas del inventario" + '</h3>',
                '<ul>',
                '<li style="color:#00CCFF;">' + "Rotacion"  + "(R)" + "="+ "(UV*CU/EMP)"+'</li>',
                '<li style="color:#cccc00;">' + "Covertura" +  "(C)" + "="+ "(PA/R)"+'</li>',
                '<li style="color:red;">' + "Días" + "presencia" + "(DP)" + "="+ "(PA-DO)"+'</li>',
                '<li style="color:#FF9933;">' + "Consumo medio diario"+ "(CMD)" + "="+ "(UV/DP)"+'</li>',
                '<li style="color:#6153c5;">' + "Período a analizar (PA)" +  "="+"(Cantidad de días  entre la fecha de inicio y la fecha fin analizada menos los domingo)"+'</li>',
                '<li style="color:#b97a56;">' + "Unidades vendida (UV)" +  "="+"(La suma de las cantidades de todas las facturas o comprobantes de ventas donde este el producto )"+ '</li>',
                '<li style="color:#908b8b;">' + "Días cero (DO)" +  "="+"()"+'</li>',
                '<li style="color:#b83dba;">' + "Costo x unidad (CU)" +  "="+ "(Costo del producto en el almacen)"+'</li>',
                '<li style="color:#b83dba;">' + "Existencia media en el período (EMP)" +  "="+ "(Existencia al inicio del periodo a analizar mas la existencia al final del periodo entre 2 (EI+EF)/2)"+'</li>',
                '</ul>',
                '</div>'
            )
        };
    },
    btnBuscar: function (){
        var _this = this;
        _this.getStorePrincipal().filtrado = true;
        _this.getStorePrincipal().load();     
/*}*/

    },
    btnLimpiar: function(){
        var _this = this;
        if(_this.textdesde.getValue() || _this.texthasta.getValue() || _this.cmbdeposito.getValue() ) {
            _this.textdesde.reset();
            _this.texthasta.reset();
            _this.cmbdeposito.reset();
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

