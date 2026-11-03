Ext.ns('Ext.erp.estadia');
Ext.erp.estadia =  Ext.extend(LOG.util.Panel, {
    edades:undefined,
    periodos:undefined,
    entidades:[],
    panelGenereal:undefined,
    listaBotones:undefined,
    params:undefined,
    constructor: function (config) {
        var _this = this;
        this.acciones = config.acciones;
        this.idioma = LOG.util.UIManager.apply(this.idioma, Log.tall.estadia.Idioma);

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
                    [1, _this.idioma.lbCbabiertas],
                    [2, _this.idioma.lbCbcerradas],
                    [3,_this.idioma.lbCbtodas]

                ]
            }),
            listeners:{
                select: function(cb, rec){
                    var tiporeporte = 0;
                    if(cb.value==1){
                        tiporeporte=1;
                    _this.lbshowfootpage.setText(_this.idioma.lbshowabiertas + ': 0.00');
                    }
                    if(cb.value==2){
                        tiporeporte = 2;
                        _this.lbshowfootpage.setText(_this.idioma.lbshowcerradas+ ': 0.00');
                     }
                     if(cb.value==3){
                        tiporeporte = 3;
                        _this.lbshowfootpage.setText(_this.idioma.lbshowtodas+ ': 0.00');
                     }
                     
                    //_this.gridPrincipal.getStorePrincipal().reload();

                },
               // render: function(cb, rec){
               // }
            }
        });

         this.comboTipoReporte.setValue(1);

        this.bindBody();
        this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            text:this.idioma.lbBtnImprimir,
            handler: function() {
                _this.getReportes(_this);
            }
        });
        this.listaBotones = new LOG.util.List();
        
        

        this.listaBotones.add(this.btnImprimir);

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
        this.createTbSouth()
        Ext.erp.estadia.superclass.constructor.call(this,config);

        _this.gridPrincipal.getStorePrincipal().on('load', function(st) {
            let promedio = st.reader.jsonData.promedio
                    _this.lbshowfootpage.setText(_this.idioma.lbshowabiertas + ': '+promedio);
        })
    },
    bindBody:function(){
        var _this = this;
        this.gridPrincipal = new Ext.erp.estadia.Grid({
            edades:this.edades,
            comboTipoReporte: _this.comboTipoReporte,
            /*formaVisualizacion:'panel',*/
            idioma: this.idioma,
            //autoLoad: false
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
        //if(!(this.comboTipoReporte.getValue()) ){  
        //param = true;
       // }else
        this.gridPrincipal.setParams({limp:param});
        this.gridPrincipal.btnLimpiar();
    },
     valorTipoReporte: function() {
         return this.comboTipoReporte.getValue();
     },
    getReportes:function(_this){
            this.tipoReportes = new LOG.util.Report({
                reports: [
                    {
                        dirReport: '/distra/logistica/talleres/recuperaciones/Estadia/Estadia',
                        isList:true,
                        params: {
                            fechainicio: (_this.gridPrincipal.textDesde.getValue()) ? _this.gridPrincipal.textDesde.getValue().format('d-m-Y') : null,
                            fechafin: (_this.gridPrincipal.textHasta.getValue()) ? _this.gridPrincipal.textHasta.getValue().format('d-m-Y')  : null,
                            sector: (_this.gridPrincipal.cmbSector.getValue()) ? _this.gridPrincipal.cmbSector.getValue() : null,
                            cliente:(_this.gridPrincipal.cmbCliente.getValue()) ? _this.gridPrincipal.cmbCliente.getValue() : null,
                            idestructuras: (_this.idestructura),
                            tiporeporte: (_this.comboTipoReporte.getValue())
                        }
                    }
                ]
            });
            this.tipoReportes.view();
      //  } 
    },
    createTbSouth(){
        _this = this;
            _this.lbshowfootpage = new Ext.form.Label({
                text: _this.idioma.lbshowfootlabel + ': 0.00' ,
                style: 'padding: 10px 100px 0px 0px;font-weight: bolder;font-size: 12px;'
            });
        this.bbar = ['->', _this.lbshowfootpage];
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

Ext.erp.estadia.Grid = Ext.extend(LOG.util.UITemplate, {
    cantColumnsEstaticas:0,
    params:undefined,
    autoLoad: false,
    formaVisualizacion: 'panel',
    constructor: function(config) {
        var _this = this;
        config.dirController = '/logistica/talleres/recuperaciones/index.php/estadia';
        config.urlBusquedaGridPrincipal = 'getestadia';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        //this.autoLoad = false;
        this.idGridPrincipal = 'iddocumento';
        this.idioma = config.idioma;
        this.comboTipoReporte = config.comboTipoReporte;
        Ext.erp.estadia.Grid.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.estadia.Idioma);
        this.addEvents('fechainiciochage');
        this.addEvents('filtrofechafin');
    },
    view: function() {
        var _this = this;
        return Ext.erp.estadia.Grid.superclass.view.call(this);
    },
    render: function(config) {
        var _this = this;
        var render = Ext.erp.estadia.Grid.superclass.render.call(this);

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

        
        this.btnBuscar = new LOG.util.Prototipos.botonBuscar({text: this.idioma.tBtnBuscar, tooltip: this.idioma.ttBtnBuscar,  handler: function() {
              _this.Buscar();
          }});

          
        this.btnLimpiarMedio = new LOG.util.Prototipos.botonLimpiar({text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.ttBtnLimpiar,  handler: function() {
            _this.Limpiar();
        }});

        _this.cmbCliente = new LOG.util.ComboBox({
            fieldLabel: 'Cliente',
            //editable: false,
            typeAhead: false,
            url: '/logistica/talleres/recuperaciones/index.php/estadia/cargarClientes',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 50,
            minChars: 4,
            mode: 'remote'
        });
        this.cmbSector = new LOG.util.ComboBox({
            fieldLabel: 'Sector',
            autoLoad: true,
            url: '/logistica/talleres/recuperaciones/index.php/estadia/cargarSector',
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
            _this.btnBuscar,
            '-',
            _this.btnLimpiarMedio
        );

        this.getStorePrincipal().on({
            beforeload:function(st, obj){
                Ext.apply(obj.params,  {
                    data:Ext.encode(_this.params),
                    tiporeporte: _this.comboTipoReporte.getValue() ,
                    fechainicio:(_this.textDesde.getValue() && _this.textDesde.getValue() != '' ) ? _this.textDesde.getValue().format('d-m-Y') : null,
                    fechafin:(_this.textHasta.getValue() && _this.textHasta.getValue() != '' ) ? _this.textHasta.getValue().format('d-m-Y')  : null,
                    cliente: (_this.cmbCliente.getValue() && _this.cmbCliente.getValue() != '') ? _this.cmbCliente.getValue() : null, 
                    sector : (_this.cmbSector.getValue() && _this.cmbSector.getValue() != '' ) ? _this.cmbSector.getValue() : null
                });
            },
            load:function(obj){
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
            }
        });
        LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams,_this.comboTipoReporte.getValue(),
        _this.textDesde.getValue(),_this.textHasta.getValue(),_this.cmbCliente.getValue(),this.cmbSector.getValue());
       
        return render;
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: 'N\xfamero de orden',
            width: 120,
            aling : 'right',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'estado',
            header: 'Estado de la orden',
            width: 120,
            aling : 'right',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            dataIndex: 'fechainicio',
            header: 'Fecha de inicio',
            width: 350,
            aling : 'right',
            default : true
        });
        this.addGridColumn({
            dataIndex: 'fechafin',
            header: 'Fecha de fin',
            width: 350,
            aling : 'right',
            default : true
        });
        this.addGridColumn({
            dataIndex: 'estadia',
            header: 'Estadia',
            aling : 'right',
            width: 250
        });
        this.addGridColumn({
            dataIndex: 'cliente',
            header: 'Cliente',
            aling : 'right',
            width: 250
        });
        this.addGridColumn({
            dataIndex: 'abreviatura',
            header: 'Sector',
            aling : 'right',
            width: 250
        });
        this.addGridColumn({
            dataIndex: 'ubicacion',
            header: 'Ubicación',
            aling : 'right',
            width: 250
        });
    },
   
    getReportes: function (data) {
        var _this = this;

    },
    Buscar: function (){
        var _this = this;
        var desde = _this.textDesde.getValue();
        var hasta = _this.textHasta.getValue();
        //if(desde || hasta) {
            _this.getStorePrincipal().filtrado = true;
            if(_this.comboTipoReporte.getValue()){
                    this.getStorePrincipal().load();
                }else{
                    mostrarMensaje(2,'Debe seleccionar un tipo de reporte')
                }
       // }
    },
    Limpiar: function(){
        var _this = this;
        if(_this.textDesde.getValue() || _this.textHasta.getValue() || !_this.params.limp) {
            _this.textDesde.reset();
            _this.textHasta.reset();
            _this.cmbSector.reset();
            _this.cmbCliente.reset();
            _this.getStorePrincipal().filtrado = false;
           // _this.getStorePrincipal().load();
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