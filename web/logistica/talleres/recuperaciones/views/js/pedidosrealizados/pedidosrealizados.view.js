Ext.ns('log.tall.pedidosrealizados');

Ext.erp.pedidosrealizados = Ext.extend(LOG.util.Panel, {
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border';
        this.region = 'center';
        this.idioma = {};
        LOG.util.UIManager.apply(this.idioma, Log.tall.pedidosrealizados.Idioma);

        this.comboEstructura = new LOG.util.LovCombo({
            mode:'remote',
            autoLoad:false,
            url:'/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/getEstructurasPorDominio',
            displayField:'text',
            emptyText:'Seleccione',
            valueField:'id',
            listeners: {
                change: function(cb, record, index){
                    _this.grid.fnBtnBuscar();
                }
            },
            queryParam: 'criterio',
            pageSize: 10,
            resizable:true
        });

        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    ctrl:false,
                    key: 'p',
                    fn: function () {
                        if(_this.isVisible() && !_this.btnImprimir.disabled){
                            _this.grid.getReportes(_this);
                        }
                    }
                }
            ]);

        Ext.Ajax.request({
            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/getEstructurasPorDominio',
            method: 'POST',
            callback: function (o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                _this.grid.setEntidades(resp['datos']);
                _this.grid.fireEvent('cargainicial');
            }
        });
        this.btnImprimir = LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled:true,
            handler: function () {
                _this.grid.getReportes(_this);
            },
            //controlFn: function(b, _caller) {
            //    _caller.grid.store.fireEvent = _caller.grid.store.fireEvent.createSequence(function(e) {
            //        if (e == 'load') {
            //            if (_caller.getStorePrincipal().getCount() != 0) {
            //                b.enable();
            //            } else {
            //                b.disable();
            //            }
            //        }
            //    });
            //}
        });
        this.grid = new Ext.erp.gridPedidosRealizados({
            idioma: this.idioma,
            formaVisualizacion:'panel',
            comboEstructura: _this.comboEstructura,
            btnImprimir: _this.btnImprimir
        });
        this.grid.init();
        var gridPedidos = this.grid.view();
        this.grid.on({
            'cargainicial': function () {
                Ext.MessageBox.hide();
                _this.grid.getStorePrincipal().load({
                    callback:function(){
                        if (_this.grid.getStorePrincipal().data.items.length == 0) {
                            _this.btnImprimir.disable();
                        }
                        else {
                            _this.btnImprimir.enable();
                        }
                    }
                });
            },
            'limpiar' : function() {
               // _this.comboTipoSol.reset();
            }
        });

        gridPedidos.height = 827;

        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                frame: false,
                tbar : [
                    _this.btnImprimir,"->",
                    LOG.util.Prototipos.botonAyuda({
                        tooltip: this.idioma.ttAyuda,
                        id: 'ayudaPedido'
                    })
                ],
                bbar : [ "->",
                    new Ext.form.Label({text:_this.idioma.tlEstructuras}),
                    ' ',
                    _this.comboEstructura
                ]
            },
            gridPedidos
        ];

        Ext.erp.pedidosrealizados.superclass.constructor.call(this, config);
        this.on({
            'resize': function () {
                var altura = _this.getHeight() - 80;
                gridPedidos.setHeight(altura);
            }
        });

    }
});

Ext.erp.gridPedidosRealizados = Ext.extend(LOG.util.UITemplate, {
    arrEntidades: undefined,
    arrProductos: undefined,
    comboEstructura: 0,
    constructor: function (config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/pedidosrealizados';
        config.urlBusquedaGridPrincipal = 'cargarPedidos';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        this.comboEstructura = config.comboEstructura;
        config.idioma = {};
        this.idGridPrincipal = 'idpedidosrealizados';
        Ext.erp.gridPedidosRealizados.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.pedidosrealizados.Idioma);
        this.addEvents('limpiar');
        this.addEvents('cargainicial');
    },
    render: function (config) {
        var render = Ext.erp.gridPedidosRealizados.superclass.render.call(this, config);
        var _this = this;

        _this.textDesde = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdePedidos',
            endDateField: 'hastaPedidos'
        });

        _this.textHasta = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaPedidos',
            endDateField: 'desdePedidos'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;
        _this.btnBuscar = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBuscarPedido,
            handler: function() {
                if (_this.textHasta.getValue() || _this.textDesde.getValue()){
                    _this.fnBtnBuscar();
                }
            }
        });
        _this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({
            text: this.idioma.lbBtnLimpiar,
            tooltip: this.idioma.ttBtnLimpiar,
            handler: function() {
                if (_this.textHasta.getValue() || _this.textDesde.getValue()) {
                    _this.fnBtnLimpiar();
                }
            }
        });

        render.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function() {
                        if (render.isVisible() && (_this.textHasta.getValue() || _this.textDesde.getValue()))
                            _this.fnBtnBuscar();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function() {
                        if (render.isVisible())
                            _this.fnBtnLimpiar();
                    }
                }
            ]);
        this.gpPrincipal.getTopToolbar().add('-', new Ext.form.Label({text: _this.idioma.tlDesde}), _this.textDesde,
            '-', new Ext.form.Label({text: _this.idioma.tlHasta}), _this.textHasta, '-', _this.btnBuscar, '-', _this.btnLimpiar);

        this.gridProductos = new Ext.erp.pedidosrealizados.GridProductos({
            idioma: this.idioma,
            modelo: this.modelo,
            productos: this.arrProductos
        });
        this.gridProductos.init();
        var vistaProductos = this.gridProductos.view({region:'south', expandable:true});
        Ext.apply(vistaProductos,{
            region:'south',
            titleCollapse: true,
            collapsible: true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: _this.idioma.tlListadoProductos,
            collapsed:false,
            frame: false,
            height:230
        });
        this.getPanelPrincipal().add(vistaProductos);
        this.getSmPrincipal().on({
            rowselect:function(sm,index,record){
                _this.btnImprimir.enable();
                _this.gridProductos.getStorePrincipal().initBaseParams.idpedido = record.json.iddocumento;
                _this.gridProductos.getStorePrincipal().load();
            },
            rowdeselect:function(){
                _this.btnImprimir.disable();
                _this.gridProductos.getStorePrincipal().removeAll();
            }
        });
        this.getStorePrincipal().on({
            'load' : function(st, obj) {
                if(existeAFT) {
                    _this.mostrarColumnas(st);
                }

                if(st.getCount() == 0) {
                    _this.btnImprimir.disable()
                    _this.gridProductos.getStorePrincipal().initBaseParams.idpedido = 0;
                    _this.gridProductos.getStorePrincipal().load();
                }
                else {
                    _this.btnImprimir.enable()
                }

            },
            beforeload:function(st,obj){
                var idestructuracomun = _this.comboEstructura.getValue();
                var desde = _this.textDesde.getValue();
                var hasta = _this.textHasta.getValue();
                st.initBaseParams = {
                    idestructuracomun: (idestructuracomun) ? idestructuracomun : null,
                    fechainicio : (desde) ? desde : null,
                    fechafin : (hasta) ? hasta : null
                };
                obj.callback = function () {
                    if (_this.getStorePrincipal().getCount() == 0 )
                    {
                        if(!_this.getStorePrincipal().filtrado){
                            mostrarMensaje(1, _this.idioma.msgInfDatosB);
                        }
                        else {
                            mostrarMensaje(1, _this.idioma.msgInfDatosE);
                        }
                    }

                }
            }
        });

        return render;
    },

    mostrarColumnas: function(st) {
        var _this = this;
        _this.getGridPrincipal().getColumnModel().setHidden(7, false);
        st.each(function(o) {
           if(typeof(o.json.numchasis) != 'undefined') {
               _this.getGridPrincipal().getColumnModel().setHidden(8, false);
               return;
           } else {
               if(typeof(o.json.vin) != 'undefined') {
                   _this.getGridPrincipal().getColumnModel().setHidden(9, false);
                   return;
               }
           }

        });
    },

    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            dataIndex: 'idestructuracomun',
            agrupador:true,
            header: this.idioma.cgEntidad,
            hidden:true,
            renderer: function (val, metaData, record) {
                var resul = val;
                Ext.each(_this.arrEntidades, function (r) {
                    if (r['id'] == val) {
                        resul = r['text'];
                    }
                });
                return resul;
            }
        });//1

        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: this.idioma.cgNoPedido,
            width: 120,
            default: true
        });//2

        this.addGridColumn({
            dataIndex: 'fechacontable',
            header: this.idioma.cgFechaCreacion,
            width: 120,
            default: true
        });//3

        this.addGridColumn({
            dataIndex: 'nrodocorigen',
            header: this.idioma.cgNoOrden,
            width: 120,
            default: true,
            renderer:function(val,x,rec){
                console.info(rec);
                if(val !='')
                    return val;
                else return rec.json.numeroreforig;
            }
        });//4

        this.addGridColumn({
            dataIndex: 'marca',
            header: this.idioma.cgMarca,
            width: 120,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//5

        this.addGridColumn({
            dataIndex: 'modelo',
            header: this.idioma.cgModelo,
            width: 120,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//6

        this.addGridColumn({
            dataIndex: 'nromotor1',
            header: this.idioma.cgNoMotor,
            width: 120,
            hidden: true,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//7

        this.addGridColumn({
            dataIndex: 'numchais',
            header: this.idioma.cgNoChasis,
            width: 120,
            hidden: true,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//8

        this.addGridColumn({
            dataIndex: 'vin',
            header: this.idioma.cgVin,
            width: 120,
            hidden: true,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//9

        this.addGridColumn({
            dataIndex: 'atributoidentificador',
            header: this.idioma.cgIdentificador,
            width: 120,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//10

    },

    getReportes: function (data) {
        var _this = this;
        var desdePR = (_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null;
        var hastaPR = (_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null;
        var estructuras = "";
        _this.entidades=[];
        _this.entidadesCheck=[];

        if(this.comboEstructura.view){
            for(var i=0; i < this.comboEstructura.view.store.data.items.length; i++) {
                if (this.comboEstructura.view.store.data.items[i].data.checked) {
                    _this.entidadesCheck.push(this.comboEstructura.view.store.data.items[i].data.id);
                }
                _this.entidades.push(_this.comboEstructura.view.store.data.items[i].data.id);
            }
            if(_this.entidadesCheck.length > 0){
                estructuras = "{" + _this.entidadesCheck.join() + "}";
            }
            else{
                estructuras = "{" + idEntidad + "}";
            }
        }
        else{
            for(var i=0; i < this.arrEntidades.length; i++) {
                _this.entidades.push(this.arrEntidades[i].id);
            }
            estructuras =  "{" + idEntidad + "}";
        }

        _this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/talleres/recuperaciones/PedidosRealizados',
                    isList:true,
                    params: {
                        fechainicio: desdePR,
                        fechafin:  hastaPR,
                        idestructura: idEntidad,
                        arrayidestructura: estructuras
                    }
                }
            ]
        });
        _this.tipoReportes.view();
    },

    fnBtnBuscar: function () {
        var _this = this;
        _this.getStorePrincipal().filtrado = true;
        _this.getStorePrincipal().load();
    },

    fnBtnLimpiar: function () {
        var _this = this;
        var idestructuracomun = _this.comboEstructura.getValue();
        _this.comboEstructura.reset();
        _this.textDesde.reset();
        _this.textHasta.reset();
        _this.getStorePrincipal().removeAll();
        _this.getStorePrincipal().filtrado = false;
        _this.getStorePrincipal().load();
        _this.fireEvent('limpiar');

    },

    setEntidades: function(entidades) {
        this.arrEntidades = entidades;
    },

    setProductos: function(productos) {
        this.gridProductos.setProductos(productos);
    }

});

Ext.erp.pedidosrealizados.GridProductos = Ext.extend(LOG.util.UITemplate, {
    idpedido:undefined,
    productos:undefined,
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/pedidosrealizados';
        config.urlBusquedaGridPrincipal = 'cargarProductos';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.busquedaAvanzada = false;
        config.formaVisualizacion = 'panel';
        config.autoLoad = false;
        this.concepto = config.idioma.ttBuscar;
        this.textBusquedaSimple = config.idioma.ttDeno_Codigo;
        Ext.erp.pedidosrealizados.GridProductos.superclass.constructor.call(this, config);
        this.addEvents('cargarProductos');
    },
    initDefaultColumns:function(){
        var _this = this;

        this.addGridColumn({
            dataIndex: 'codigo',
            header: this.idioma.cgCodigo,
            width: 120,
            default: true
        });//1

        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgDenominacion,
            width: 300,
            default: true
        });//2

        this.addGridColumn({
            dataIndex: 'um',
            header: this.idioma.cgUM,
            width: 120,
            default: true
        });//3

        this.addGridColumn({
            dataIndex: 'cantidad',
            header: this.idioma.cgCantPedida,
            width: 120,
            default: true
        });//4

        this.addGridColumn({
            dataIndex: 'precio',
            header: this.idioma.cgPrecio,
            width: 120,
            default: true
        });//5

        this.addGridColumn({
            dataIndex: 'precioalternativo',
            header: this.idioma.cgPrecioAlter,
            width: 120,
            default: true
        });
        //6

        this.addGridColumn({
            dataIndex: 'total',
            header: this.idioma.cgTotal,
            width: 120,
            default: true
        });//7

    },

    setProductos: function(productos) {
        this.productos = productos;
    }


});







