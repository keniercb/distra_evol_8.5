Ext.ns('Ext.erp.ordenfactura');
Ext.erp.ordenfactura =  Ext.extend(LOG.util.Panel, {
    edades:undefined,
    periodos:undefined,
    entidades:[],
    panelGenereal:undefined,
    listaBotones:undefined,
    params:undefined,
    constructor: function (config) {
        var _this = this;
        this.acciones = config.acciones;
        this.idioma = LOG.util.UIManager.apply(this.idioma, Log.tall.ordenfactura.Idioma);

        this.comboTipoModelo = new LOG.util.ComboBox({
            mode:'local',
            width: 260,
            listWidth: 255,
            editable:false,
            displayField:'denominacion',
            valueField:'idmodelo',
            store: new Ext.data.SimpleStore({
                fields: ['idmodelo', 'denominacion'],
                data: [
                    [1, _this.idioma.lbCbOrdenTrabajointera],
                    [2, _this.idioma.lbCbOrdenTrabajoexterna],
                    [3, _this.idioma.lbCbOrdenTrabajoconfactcancelada],
                    [4, _this.idioma.lbCbOrdenTrabajocontabilizan],
                    [5, _this.idioma.lbCbOrdenTrabajonocontabilizan]

                ]
            }),
            listeners:{
                select: function(cb, rec){
                   // _this.cargarConFiltro();
                    //if(rec.data.idmodelo==2){
                    //    _this.btnImprimir.hide();
                    //}else{
                        _this.btnImprimir.show();
                   // }
                   // _this.cambiarVistaGrid(rec.data.idmodelo);

                    var tiporeporte = 0;
                    if(cb.value==1){
                        tiporeporte=1;
                        _this.gridParte.cmGridPrincipal.setHidden(6,true);
                        _this.gridParte.cmGridPrincipal.setHidden(7,true);
                    }else{
                        tiporeporte=2;
                        _this.gridParte.cmGridPrincipal.setHidden(6,true);
                        _this.gridParte.cmGridPrincipal.setHidden(7,true);
                    }
                    if(cb.value==3){
                        tiporeporte=3;
                        _this.gridParte.cmGridPrincipal.setHidden(6,true);
                        _this.gridParte.cmGridPrincipal.setHidden(6,true);

                    }
                    if(cb.value==4){
                        tiporeporte=4;
                        _this.gridParte.cmGridPrincipal.setHidden(6,false);
                        _this.gridParte.cmGridPrincipal.setHidden(7,true);
                    }if(cb.value == 5){
                        tiporeporte=5;
                        _this.gridParte.cmGridPrincipal.setHidden(6,false);
                        _this.gridParte.cmGridPrincipal.setHidden(7,false)
                    }
                    _this.gridParte.getStorePrincipal().reload();

                },
                /*render: function(cb, rec){
                }*/
            }
        });

        this.comboTipoModelo.setValue(1);

        this.bindBody();
        this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            text:this.idioma.lbBtnImprimir,
           // disabled:true,
            handler: function() {
                _this.getReportes(_this);
            }
        });
        this.listaBotones = new LOG.util.List();
        this.btnLimpiarMedio = new LOG.util.Prototipos.botonLimpiar({text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.ttBtnLimpiar,  handler: function() {
            _this.btnLimpiar();
        }});
        this.btnBuscar = new LOG.util.Prototipos.botonBuscar({text: this.idioma.ttBtnBuscar, tooltip: this.idioma.ttBtnBuscar,  handler: function() {
            _this.gridParte.btnBuscar();
        }});

        
        
        this.comboTipoModelo.setValue(1);

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
                this.comboTipoModelo,
                '-']
        },
            this.panelGeneral
        ];
        Ext.erp.ordenfactura.superclass.constructor.call(this,config);
    },
    bindBody:function(){
        var _this = this;
        this.gridParte = new Ext.erp.ordenfactura.Grid({
            edades:this.edades,
            comboTipoModelo: _this.comboTipoModelo,
            formaVisualizacion:'panel'
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
    btnLimpiar:function(){
        var param = false;
        if(!(this.comboTipoModelo.getValue()) ){  
        param = true;
        }else 
        this.gridParte.setParams({limp:param});
        this.gridParte.btnLimpiar();
    },
    valorTipoReporte: function() {
        return this.comboTipoModelo.getValue();
    },
    getReportes:function(_this){
            this.tipoReportes = new LOG.util.Report({
                reports: [
                    {
                        dirReport: '/distra/logistica/talleres/recuperaciones/OrdenFactura/OrdenFactura',
                        isList:true,
                        params: {
                            estructura : estaestructura,
                            tiporeporte : _this.comboTipoModelo.getValue(),
                            fechainicio:(_this.gridParte.textDesde.getValue()) ? _this.gridParte.textDesde.getValue().format('d-m-Y') : null,
                            fechafin:(_this.gridParte.textHasta.getValue()) ? _this.gridParte.textHasta.getValue().format('d-m-Y') : null,
                        }
                    }
                ]
            });
            this.tipoReportes.view(); 
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

Ext.erp.ordenfactura.Grid = Ext.extend(LOG.util.UITemplate, {
    cantColumnsEstaticas:0,
    params:undefined,
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/ordenfactura';
        config.urlBusquedaGridPrincipal = 'getordenesfactura';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoLoad = false;
        this.idGridPrincipal = 'iddocumento';
        config.idioma = {};
        this.comboTipoModelo = config.comboTipoModelo;
        Ext.erp.ordenfactura.Grid.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.ordenfactura.Idioma);
        this.addEvents('fechainiciochage');
        this.addEvents('filtrofechafin');
    },
    render: function(config) {
        var render = Ext.erp.ordenfactura.Grid.superclass.render.call(this, config);
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
        );

        this.getStorePrincipal().on({
            beforeload:function(st, obj){
                Ext.apply(obj.params,  {data:Ext.encode(_this.params),tiporeporte: _this.comboTipoModelo.getValue(),
                    fechainicio: (_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null,
                    fechafin:(_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null});
            },
            load:function(){
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
            }
            
        });

        LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams,_this.comboTipoModelo.getValue(),_this.textDesde.getValue(),_this.textHasta.getValue());
        this.getStorePrincipal().load();
        return render;
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: 'N\xfamero',
            width: 120,
            default: true
        });

        this.addGridColumn({
            dataIndex: 'cliente',
            header: 'Cliente',
            width: 350,
            default : true
        });
        this.addGridColumn({
            dataIndex: 'servicios',
            header: 'Servicio',
            width: 250
        });
        this.addGridColumn({
            dataIndex: 'fechacierre',
            header: 'Fecha de Cierre',
            width: 200
        });
        this.addGridColumn({
            dataIndex: 'importe',
            header: 'Importe',
            width: 170,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            dataIndex: 'nocomprobante',
            header: 'Comprobante',
            hidden : true ,
            align: 'right',
            width: 150
        });
        this.addGridColumn({
            dataIndex: 'nofactura',
            hidden : true,
            align: 'right',
            header: 'N\xfamero de Factura',
            width: 150
        });

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