Ext.ns('Log.aft.submayor');



Log.aft.submayor.AddPruebas =  Ext.extend(LOG.util.aft.UITemplate, {
    constructor: function(config) {
        var _this = this;

        this.autoLoad = false;
        this.bbarVisible = true;
        this.formaVisualizacion = 'ventana';
        this.modal = true;
        this.layout = 'border';
        this.modoSeleccion = 2;

        this.urlBusquedaGridPrincipal = 'getregistronumerico';
        this.idGridPrincipal = 'idregnumerico';


        this.collapsed= true;
        this.scope = config.scope;
        this.animCollapse=true;
        this.autoHeight=true;
        this.maximized=true;
        this.alternativa = config.alternativa;
        this.camposGenerales = LOG.aft.RegOperativo.Campos;
        this.listaAftPlugins = new LOG.util.List();
        this.modoSeleccion = 3;

        this.valor = config.valor;
        Log.aft.submayor.AddPruebas.superclass.constructor.call(this, config);


        this.getVistaPrincipal().title = this.idioma.lbServiceMediosEnExistenciaTitle;
        this.getVistaPrincipal().setSize(900, 500);

    },


    initDefaultColumns: function() {
        var _this = this;
        _this.addGridColumn({
            header: this.idioma.lbCmCodigo,
            dataIndex: 'codigo',
            sortable: true,
            filter : {
                type: 'string',
                dataIndex: 'codigo'
            }
        });_this.addGridColumn({
            header: this.idioma.lbCmCodigoprov,
            dataIndex: 'numeropieza',
            sortable: true,
            filter : {
                type: 'string',
                dataIndex: 'numeropieza'
            }
        });


        _this.addGridColumn({
            header: this.idioma.lbCmDenominacion,
            dataIndex: 'denominacion',
            width: 150,
            autoExpand: true,
            sortable: true,
            filter : {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });
        _this.addGridColumn({
            header: this.idioma.lbCmMarca,
            dataIndex: 'marca',
            sortable: true,
            filter : {
                type: 'string',
                dataIndex: 'marca'
            }
        });
        _this.addGridColumn({
            header: this.idioma.lbCmModelo,
            dataIndex: 'modelo',
            sortable: true,
            filter : {
                type: 'string',
                dataIndex: 'modelo'
            }
        });
        _this.addGridColumn({
            header: this.idioma.lbOperacion,
            dataIndex: 'estadooperacion',
            sortable: true,
            filter : {
                type: 'string',
                dataIndex: 'estadooperacion'
            }
        });
        _this.addGridColumn({
            header: this.idioma.lbNaturaleza,
            dataIndex: 'naturaleza',
            sortable: true,
            filter : {
                type: 'string',
                dataIndex: 'naturaleza'
            }
        });
        _this.addGridColumn({
            header: this.idioma.lbCentroCosto,
            dataIndex: 'denomcentrocosto',
            default: true,
            sortable: true,
            width: 100
        });

        for (var i in _this.camposGenerales) {
            _this.camposGenerales[i].xtype ='';
            _this.addGridColumn(_this.camposGenerales[i]);

        }
        _this.subscribirAftPlugins();
        _this.initAftPlugins();


    },
    /*initDefaultButtons: function() {
        var _this = this;
        _this.addToolbarButton(LOG.util.UIManager.createBtn({
            text:"dsfdf",
            iconCls: 'ver',
            tooltip: "11111",
            xtype: 'tbtext'
            //menu: [_this.btnNumSerieProducto, _this.btnNmSeries, _this.btnProducto]
        }));
    },*/
    subscribirAftPlugins: function() {
        for (var i = 0; i < arrElementosGridCodigoNew.length; i++) {
            this.attachAftPlugin(arrElementosGridCodigoNew[i]);
        }
    },
    attachAftPlugin: function(plugin) {
        this.listaAftPlugins.add(plugin);
    },
    initAftPlugins: function() {
        this.listaAftPlugins.each(function(plugin) {
            this.initAftRenders(plugin);
            /*  if(plugin.getArrCampos().dataIndex == "nromatricula"){
             Ext.apply(plugin.getArrCampos(), {
             renderer: function(_v, _mD, _r) {
             if (parseFloat(_r.data.valorcontable) == parseFloat(_r.data.valoradquisicion))
             _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
             else
             _v = parseFloat(_r.data.valorcontable - _r.data.depreciacionacumulada).toFixed(2);
             return _v;
             }
             });
             }*/



            plugin.init(this);

        }, this);
    },
    render: function(){
        var _this = this;
        Log.aft.submayor.AddPruebas.superclass.render.call(this);




        _this.getStorePrincipal().on({
            beforeload: function(st, obj) {

                st.initBaseParams.filtroespecialidad = false;
                st.initBaseParams.salidas = -1;
                //st.initBaseParams.arrIdEstructuras = (_this.scope.idNodoSeleccionado.length > 0) ? Ext.encode(_this.scope.idNodoSeleccionado) : (_this.scope.idNodoSeleccionado != null) ? _this.scope.idNodoSeleccionado : -1;
                st.initBaseParams.arrIdEstructuras = this.comboDeposito.getValue();
                st.initBaseParams.tipo = 0;
                st.initBaseParams.anode = null;
            }/*,
             load: function(st, obj) {

             }*/
        });



        _this.getStorePrincipal().load();
    },
    /*campo.getArrCampos().dataIndex*/
    /*comboDepositoVerLength: function() {
     return true;
     },*/
    initAftRenders: function(campo)
    {
        if (alternativa) {

            if (campo.getArrCampos().dataIndex == 'valorcontable') {
                Ext.apply(campo, {
                    renderer: function(_v, _mD, _r) {
                        if (parseFloat(_r.data.valorcontable) == parseFloat(_r.data.valoradquisicion))
                            _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
                        else
                            _v = parseFloat(_r.data.valorcontable - _r.data.depreciacionacumulada).toFixed(2);
                        return _v;
                    }
                });
            }
            if (campo.getArrCampos().dataIndex == 'valoradquisicion') {
                Ext.apply(campo, {
                    renderer: function(_v, _mD, _r) {
                        if (parseFloat(_r.data.valoradquisicion) == parseFloat(_r.data.valoradquisicion))
                            _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
                        else
                            _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
                        return _v;
                    }
                });
            }


            if (campo.getArrCampos().dataIndex == 'valorcontablealternativo') {
                Ext.apply(campo, {
                    renderer: function(_v, _mD, _r) {
                        if (parseFloat(_r.data.valorcontablealternativo) == parseFloat(_r.data.valoradquisicionalternativo))
                            _v = parseFloat(_r.data.valoradquisicionalternativo - _r.data.depreciacionacumuladaalternativo).toFixed(2);
                        else
                            _v = parseFloat(_r.data.valorcontablealternativo - _r.data.depreciacionacumuladaalternativo).toFixed(2);
                        return _v;
                    }
                });
            }

            if (campo.getArrCampos().dataIndex == 'valoradquisicionalternativo') {
                Ext.apply(campo, {
                    renderer: function(_v, _mD, _r) {
                        if (parseFloat(_r.data.valoradquisicionalternativo) == parseFloat(_r.data.valoradquisicionalternativo))
                            _v = parseFloat(_r.data.valoradquisicionalternativo - _r.data.depreciacionacumuladaalternativo).toFixed(2);
                        else
                            _v = parseFloat(_r.data.valoradquisicionalternativo - _r.data.depreciacionacumuladaalternativo).toFixed(2);
                        return _v;
                    }
                });
            }

        } else if (campo.dataIndex.indexOf('alternativo') == -1) {
            if (campo.dataIndex == 'valorcontable') {
                Ext.apply(campo, {
                    renderer: function(_v, _mD, _r) {
                        if (parseFloat(_r.data.valorcontable) == parseFloat(_r.data.valoradquisicion))
                            _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(2);
                        else
                            _v = parseFloat(_r.data.valorcontable - _r.data.depreciacionacumulada).toFixed(2);
                        return _v;
                    }
                });
            }
        }

    }
});