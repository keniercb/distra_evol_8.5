Ext.ns('Ext.erp.mercanciatransito');
Ext.erp.mercanciatransito =  Ext.extend(LOG.util.Panel, {
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
            // disabled:true,
            handler: function() {
                _this.getReportes(_this);
            }
        });
        this.listaBotones = new LOG.util.List();
        this.btnLimpiarMedio = new LOG.util.Prototipos.botonLimpiar({text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.ttBtnLimpiar,  handler: function() {
                _this.btnLimpiar();
            }});
        this.btnBuscar = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBtnBuscar,
            // disabled: true,
            handler: function() {
                _this.gridParte.btnBuscar();
            }
        });
        this.chbDiferencia = new Ext.form.Checkbox({
            boxLabel: 'Diferencias',
            id: 'chbdiferencias',
            //disabled : true,
            listeners: {
                'check': function(cmp,checked) {
                    if(checked && _this.gridParte.cmbEstructuradestino.getValue()){
                        _this.gridParte.btnBuscar();
                    }
                }
            }
        });



        this.listaBotones.add(this.btnImprimir);
        this.listaBotones.add(this.btnLimpiarMedio);
        this.listaBotones.add(this.btnBuscar);
        this.listaBotones.add(this.chbDiferencia);

        config.layout = 'border';
        config.items = [{
            region:'north',
            tbar:this.listaBotones.getArray(),
            bbar: [
                '-',
                new Ext.form.Label({text: 'Permisos: '}),
                _this.gridParte.cmbPermisos,
            ]
        },
            this.panelGeneral
        ];
        Ext.erp.mercanciatransito.superclass.constructor.call(this,config);
    },
    bindBody:function(){
        var _this = this;
        this.gridParte = new Ext.erp.mercanciatransito.Grid({
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
    btnLimpiar:function(){
        var param = false;
        this.gridParte.setParams({limp:param});
        this.gridParte.btnLimpiar();
    },
    getReportes: function (_this) {
        if( _this.gridParte.cmbPermisos.getValue() == 1 ){
            this.tipoReportes = new LOG.util.Report({
                reports: [
                    {
                        dirReport: '/distra/logistica/inventario/recuperaciones/MercanciaTransito/MercanciaTransito',
                        isList:true,
                        params: {
                            estructuraorigen :(_this.gridParte.cmbEstructuraorigen.getValue() != '') ? '{'+ _this.gridParte.cmbEstructuraorigen.getValue() +'}' : null  ,
                            estructuradestino :(_this.gridParte.cmbEstructuradestino.getValue()) ? '{'+ _this.gridParte.cmbEstructuradestino.getValue() +'}': null,
                            permiso : (_this.gridParte.cmbPermisos.getValue()),
                            fechainicio:(_this.gridParte.textDesde.getValue()) ? _this.gridParte.textDesde.getValue().format('d-m-Y') : null,
                            fechafin:(_this.gridParte.textHasta.getValue()) ? _this.gridParte.textHasta.getValue().format('d-m-Y') : null,
                            diferencia :  _this.chbDiferencia.getValue()
                        }
                    }
                ]
            });

        } else if(_this.gridParte.cmbPermisos.getValue() == 2 ){
            this.tipoReportes = new LOG.util.Report({
                reports: [
                    {
                        dirReport: '/distra/logistica/inventario/recuperaciones/MercanciaTransito/MercanciaTransito',
                        isList:true,
                        params: {
                            estructuraorigen : (_this.gridParte.cmbEstructuraorigen.getValue()) ? '{'+ _this.gridParte.cmbEstructuraorigen.getValue() +'}' : null,
                            estructuradestino : '{'+ estaestructura +'}',
                            permiso : (_this.gridParte.cmbPermisos.getValue()),
                            fechainicio:(_this.gridParte.textDesde.getValue()) ? _this.gridParte.textDesde.getValue().format('d-m-Y') : null,
                            fechafin:(_this.gridParte.textHasta.getValue()) ? _this.gridParte.textHasta.getValue().format('d-m-Y') : null,
                            diferencia :  _this.chbDiferencia.getValue()
                        }
                    }
                ]
            });
        } else if(_this.gridParte.cmbPermisos.getValue() == 3 ){
            this.tipoReportes = new LOG.util.Report({
                reports: [
                    {
                        dirReport: '/distra/logistica/inventario/recuperaciones/MercanciaTransito/MercanciaTransito',
                        isList:true,
                        params: {
                            estructuraorigen :'{'+  estaestructura +'}',
                            estructuradestino : (_this.gridParte.cmbEstructuradestino.getValue()) ? '{'+  _this.gridParte.cmbEstructuradestino.getValue() +'}' : null,
                            permiso : (_this.gridParte.cmbPermisos.getValue()),
                            fechainicio:(_this.gridParte.textDesde.getValue()) ? _this.gridParte.textDesde.getValue().format('d-m-Y') : null,
                            fechafin:(_this.gridParte.textHasta.getValue()) ? _this.gridParte.textHasta.getValue().format('d-m-Y') : null,
                            diferencia :  _this.chbDiferencia.getValue()
                        }
                    }
                ]
            });
        }
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

Ext.erp.mercanciatransito.Grid = Ext.extend(LOG.util.UITemplate, {
    cantColumnsEstaticas:0,
    params:undefined,
    constructor: function(config) {
        config.dirController = '/logistica/inventario/recuperaciones/index.php/mercanciatransito';
        config.urlBusquedaGridPrincipal = 'getmercanciatransito';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoLoad = false;
        this.idGridPrincipal = 'iddocumento';
        config.idioma = {};
        Ext.erp.mercanciatransito.Grid.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.mercanciatransito.Idioma);
        this.addEvents('fechainiciochage');
        this.addEvents('filtrofechafin');
    },
    render: function(config) {
        var render = Ext.erp.mercanciatransito.Grid.superclass.render.call(this, config);
        var _this = this;

        this.cmbEstructuradestino = new LOG.util.ComboBox({
            fieldLabel: 'Entidades',
            id: 'idestructuradestino',
            url:'getEstructuras',
            name:'idestructura',
            displayField : 'denominacion',
            valueField : 'idestructura',
            resizable:true,
            listeners :  {
                'select' : function (combo, record, index) {
                    if (_this.cmbEstructuraorigen.getValue() && record.data.idestructura == _this.cmbEstructuraorigen.getValue() && _this.cmbPermisos.getValue() == 1) {
                        _this.cmbDeposito.enable();
                        _this.stDepositos.load({
                            params : {
                                idseleccionados : record.data.idestructura
                            }
                        });
                    }
                    if(_this.cmbEstructuraorigen.getValue() && record.data.idestructura != _this.cmbEstructuraorigen.getValue() && _this.cmbPermisos.getValue() == 1){
                        _this.cmbDeposito.reset();
                        _this.cmbDeposito.disable();
                    }
                    if (_this.cmbPermisos.getValue() == 3 && record.data.idestructura == estructuraactual)  {
                        _this.cmbDeposito.enable();
                        _this.stDepositos.load({
                            params : {
                                idseleccionados : record.data.idestructura
                            }
                        });
                    }
                    if(_this.cmbPermisos.getValue() == 2 && record.data.idestructura != estructuraactual){
                        _this.cmbDeposito.reset();
                        _this.cmbDeposito.disable();
                    }
                }
            }
           // anchor: '98%',
        });
        this.cmbEstructuraorigen = new LOG.util.ComboBox({
            fieldLabel: 'Entidades',
            url:'getEstructuras',
            name:'idestructura',
            displayField : 'denominacion',
            valueField : 'idestructura',
            resizable:true,
            listeners :  {
                'select' : function (combo, record, index) {
                    if (_this.cmbEstructuradestino.getValue() && record.data.idestructura == _this.cmbEstructuradestino.getValue() && _this.cmbPermisos.getValue() == 1) {
                        _this.cmbDeposito.enable();
                        _this.stDepositos.load({
                            params : {
                                idseleccionados : record.data.idestructura
                            }
                        });
                    }
                    if(_this.cmbEstructuradestino.getValue() && record.data.idestructura != _this.cmbEstructuradestino.getValue() && _this.cmbPermisos.getValue() == 1){
                        _this.cmbDeposito.reset();
                        _this.cmbDeposito.disable();
                    }
                    if (_this.cmbPermisos.getValue() == 2 && record.data.idestructura == estructuraactual) {
                        _this.cmbDeposito.enable();
                        _this.stDepositos.load({
                            params : {
                                idseleccionados : record.data.idestructura
                            }
                        });
                    }
                    if(_this.cmbPermisos.getValue() == 2 && record.data.idestructura != estructuraactual){
                        _this.cmbDeposito.reset();
                        _this.cmbDeposito.disable();
                    }
                }
            }
        });

        this.stDepositos = new Ext.data.Store({
            url: '/logistica/inventario/recuperaciones/index.php/mercanciatransito/cargarDepositos',
            reader: new Ext.data.JsonReader({
                id: "idcentrogrupo",
                root: "datos"
            }, [
                {name: 'idestructuraop'},
                {name: 'nombre'}
            ])
        });

        this.cmbDeposito = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbDestinoDeposito,
            store: _this.stDepositos,
            valueField: 'idestructuraop',
            disabled : true,
            displayField: 'nombre', 
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>', 
            resizable:true,
            width: 355,
           // with: 650,
            //anchor: '98%',
        });

        
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
        this.cmbPermisos = new LOG.util.ComboBox({
            mode:'local',
            width: 260,
            listWidth: 255,
            editable:false,
            displayField:'denominacion',
            valueField:'idpermisos',
            store: new Ext.data.SimpleStore({
                fields: ['idpermisos', 'denominacion'],
                data: [
                    [1, _this.idioma.lbCbGestionGeneral],
                    [2, _this.idioma.lbCbMercanciasRecibidas],
                    [3, _this.idioma.lbCbMercanciasEnviadas]

                ]
            }),
            listeners:{
                select: function(cb, rec){
                    var permiso = 0;
                    if(cb.value==1){
                        permiso=1;
                        _this.cmbEstructuradestino.setVisible(true);
                        _this.cmbEstructuraorigen.setVisible(true);
                        _this.gpPrincipal.getTopToolbar().panel.topToolbar.items.items[9].setVisible(true);
                        _this.gpPrincipal.getTopToolbar().panel.topToolbar.items.items[6].setVisible(true);
                    }else if(cb.value==3){
                        permiso=2;
                        _this.cmbEstructuradestino.setVisible(true);
                        _this.gpPrincipal.getTopToolbar().panel.topToolbar.items.items[9].setVisible(true);
                        _this.cmbEstructuraorigen.setVisible(false);
                        _this.gpPrincipal.getTopToolbar().panel.topToolbar.items.items[6].setVisible(false);
                    }
                    else if(cb.value==2){
                        permiso=3;
                        _this.cmbEstructuradestino.setVisible(false);
                        _this.gpPrincipal.getTopToolbar().panel.topToolbar.items.items[9].setVisible(false);
                        _this.cmbEstructuraorigen.setVisible(true);
                        _this.gpPrincipal.getTopToolbar().panel.topToolbar.items.items[6].setVisible(true);
                    }
                    _this.btnLimpiar();
                    _this.getStorePrincipal().removeAll();
                },
            }
        });

        this.cmbPermisos.setValue(1);

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
            new Ext.form.Label({text: 'Desde:'}),
            _this.textDesde,
            '-',
            new Ext.form.Label({text: 'Hasta:'}),
            _this.textHasta,
            '-',
            new Ext.form.Label({text: 'Estructura origen:'}),
            _this.cmbEstructuraorigen,
            '-',
            new Ext.form.Label({text: 'Estructura destino:'}),
            _this.cmbEstructuradestino,
            '-',
            new Ext.form.Label({text: _this.idioma.lbDestinoDeposito + ': '}),
            _this.cmbDeposito,
            '-',

        );

        this.getStorePrincipal().on({
            beforeload:function(st, obj){
                if(_this.cmbPermisos.getValue() == 1){
                    Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                        fechainicio:(_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null,
                        fechafin:(_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null,
                        estructuraorigen: (_this.cmbEstructuraorigen.getValue()) ? _this.cmbEstructuraorigen.getValue() : null,
                        estructuradest: (_this.cmbEstructuradestino.getValue()),
                        deposito : (_this.cmbDeposito.getValue()) ? _this.cmbDeposito.getValue() : null,
                        permiso : (_this.cmbPermisos.getValue()),
                        chbDiff : _this.panel.chbDiferencia.getValue(),
                        limit : _this.gpPrincipal.initialConfig.bbar.pageSize
                    })
                }else if(_this.cmbPermisos.getValue() == 2){
                    Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                        fechainicio:(_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null,
                        fechafin:(_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null,
                        permiso : (_this.cmbPermisos.getValue()),
                        estructuradest: (_this.cmbEstructuraorigen.getValue()),
                        deposito : (_this.cmbDeposito.getValue()) ? _this.cmbDeposito.getValue() : null,
                        chbDiff :  _this.panel.chbDiferencia.getValue(),
                        limit : _this.gpPrincipal.initialConfig.bbar.pageSize
                    })
                }else if(_this.cmbPermisos.getValue() == 3){
                    Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                        fechainicio:(_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null,
                        fechafin:(_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null,
                        permiso : (_this.cmbPermisos.getValue()),
                        estructuradest: (_this.cmbEstructuradestino.getValue()),
                        deposito : (_this.cmbDeposito.getValue()) ? _this.cmbDeposito.getValue() : null,
                        chbDiff : _this.panel.chbDiferencia.getValue(),
                        limit : _this.gpPrincipal.initialConfig.bbar.pageSize
                    })
                }
            },

            load:function(){
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
                this.each(function(p,index){
                    if(p.json.diferencia > 0){
                        Ext.fly(_this.getGridPrincipal().getView().getRow(index)).addClass('fondo-verde-claro');
                    }else if(p.json.diferencia < 0 ){
                        Ext.fly(_this.getGridPrincipal().getView().getRow(index)).addClass('red-row');
                    }
                })
            }

        });

        //LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams,_this.textDesde.getValue(),_this.textHasta.getValue());
        //this.getStorePrincipal().load();
        return render;
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'distpadre',
            header: 'Nro Distribución padre',
            width: 130,
            default: true,
            filter : {
                type: 'combo',
                dataIndex: 'distpadre',
                valueField: 'distpadre',
                displayField: 'distpadre',
                 url:'/logistica/inventario/recuperaciones/index.php/mercanciatransito/cargardistribucionpadre',
            },
        });

        this.addGridColumn({
            dataIndex: 'fechadistpadre',
            header: 'Fecha Dist. Padre',
            width: 120
        });
        this.addGridColumn({
            dataIndex: 'tipodocumento',
            header: 'Tipo de documento',
            width: 120,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'nrodocorigen',
            header: 'N\xfamero',
            width: 100,
            default : true
        });
        this.addGridColumn({
            dataIndex: 'distpadre',
            header: 'Nro Distribución padre',
            width: 130,
            default: true,
            filter : {
                type: 'combo',
                dataIndex: 'distpadre',
                valueField: 'distpadre',
                displayField: 'distpadre',
                 url:'/logistica/inventario/recuperaciones/index.php/mercanciatransito/cargardistribucionpadre',
            },
        });

        this.addGridColumn({
            dataIndex: 'fechadistpadre',
            header: 'Fecha Dist. Padre',
            width: 120
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: 'Origen',
            width: 250,
            default : true
        });
       
        this.addGridColumn({
            dataIndex: 'fhdocorigen',
            header: 'Fecha',
            width: 100
        });
        this.addGridColumn({
            dataIndex: 'estado',
            header: 'Estado',
            width: 80
        });
        this.addGridColumn({
            dataIndex: 'ueb',
            header: 'Destino',
            width: 250,
            default : true
        });
        this.addGridColumn({
            dataIndex: 'importe_doc',
            header: 'Importe',
            width: 120,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        /*this.addGridColumn({
            dataIndex: 'imp_contable',
            header: 'Importe contable',
            width: 150,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });*/
        this.addGridColumn({
            dataIndex: 'doc_destino',
            header: 'Recepcion',
            width: 80,
            align: 'right'
        });
        this.addGridColumn({
            dataIndex: 'fechdoc_destino',
            header: 'Fecha de recepci\xf3n',
            width: 130
        });
        this.addGridColumn({
            dataIndex: 'estadodest',
            header: 'Estado',
            width: 80
        });
        this.addGridColumn({
            dataIndex: 'impporte_dest',
            header: 'Importe recibido',
            width: 150,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            dataIndex: 'diferencia',
            header: 'Diferencia entre Origen y Destino',
            align: 'right',
            width: 250,
            // renderer : function(v){
            // if(v >= 0 ){
            //    return _this.getLeyenda(v);
            // }
            // }
        });
    },

    getReportes: function (data) {
        var _this = this;

    },
    btnBuscar: function (){
        var _this = this;
        var desde = _this.textDesde.getValue();
        var hasta = _this.textHasta.getValue();
        var estructuradest = _this.cmbEstructuradestino.getValue()
        if(_this.cmbPermisos.getValue() == 1){

            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load();
            //.log(_this.gpPrincipal.store.data.items[0].data);

        }else if(_this.cmbPermisos.getValue() == 2){
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load();
        }else if(_this.cmbPermisos.getValue() == 3){
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load();
        }

    },
    btnLimpiar: function(){
        var _this = this;
        if(_this.textDesde.getValue() || _this.textHasta.getValue() || _this.cmbEstructuradestino.getValue() || _this.cmbEstructuraorigen.getValue() || _this.cmbDeposito.getValue()) {
            _this.textDesde.reset();
            _this.textHasta.reset();
            _this.cmbEstructuraorigen.reset();
            _this.cmbEstructuradestino.reset();
            _this.cmbDeposito.reset();
            _this.cmbDeposito.disable();
            _this.getStorePrincipal().filtrado = false;
            //_this.getStorePrincipal().load();
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
