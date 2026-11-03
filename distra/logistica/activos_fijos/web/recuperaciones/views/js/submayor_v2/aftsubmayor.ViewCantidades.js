Log.aft.submayor_v2.ViewCantidadesCreator = {
    /**
     * 
     * @param {activos | utiles | transportes} type 
     * @param {*} params 
     */

    getInstance: function(type, params){
            
        var getInstanceTransp = function(p){
            return p.model.getGruposExplotacion()
                .then(function(datos){
                    var cmpParams = {
                        idioma: p.idioma,
                        grupos: p.grupos,
                        naturalezas: p.naturalezas,
                        viewConfig: p.viewConfig,
                        viewId: 'submayor-cantidades-TRANSP',
                        columnasDinamicas: datos,
                        urlBusquedaGridPrincipal: 'getConteoEntidadTransportes',
                        type: 'TRANSP'
                    };
                    return new Log.aft.submayor_v2.ViewCantidades(cmpParams);
                });
        }
        var getInstanceAft = function(p){
            var cmpParams = {
                idioma: p.idioma,
                grupos: p.grupos,
                naturalezas: p.naturalezas,
                viewConfig: p.viewConfig,
                viewId: 'submayor-cantidades-AFT',
                type: 'AFT'
            };
            return new Log.aft.submayor_v2.ViewCantidades(cmpParams);
        }
        var getInstanceUH = function(p){
            var cmpParams = {
                idioma: p.idioma,
                grupos: p.grupos,
                naturalezas: p.naturalezas,
                viewConfig: p.viewConfig,
                urlBusquedaGridPrincipal: 'getConteoEntidadUtiles',
                viewId: 'submayor-cantidades-UH',
                type: 'UH'
            };
            return new Log.aft.submayor_v2.ViewCantidades(cmpParams);
        }
        
        var obj = undefined;
        switch (type) {
            case 'activos':
                obj = getInstanceAft(params);
                break;
            case 'utiles':
                obj = getInstanceUH(params);
                break;
            case 'transportes':
                obj = getInstanceTransp(params);
                break;
            default:
                return null;
        }

        return Log.aft.submayor_v2.Utils.toPromise(obj);
    },
}

Log.aft.submayor_v2.ViewCantidades = Ext.extend(LOG.util.UITemplate, {
    
    
    constructor: function(config){
        var _this = this;
        this.viewId = config.viewId;
        this.idioma = config.idioma;
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/submayorv2';
        this.urlBusquedaGridPrincipal = config.urlBusquedaGridPrincipal ? config.urlBusquedaGridPrincipal : 'getconteo';
        this.idGridPrincipal = 'idindicador';
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBusquedaAvanzada = undefined;
        this.type = config.type;
        
        this.columnasDinamicas = config.columnasDinamicas ? config.columnasDinamicas : [];
        this.baseParams = {
            actividadGen: Ext.encode(_this.columnasDinamicas.map(function(item){return item.idactividad}))
        }
        this.grupossubgrupos = config.grupos;
        this.naturalezas = config.naturalezas;
        this.viewConfig = config.viewConfig;
        
        this.salidas = -1;

        
        Log.aft.submayor_v2.ViewCantidades.superclass.constructor.call(this, config);
        
    },
    initDefaultButtons: function(){
        var _this = this;
        
        _this.btnImprimirReporte = {
            text: "Listado desglosado",
            iconCls: 'imprimir',
            id: 'btnReporteImprimir'+this.viewId,
            handler: function() {
                _this.imprimirReporte('/distra/logistica/activofijo/submayor/ReporteProductosCantidadDisponibles');
            }
        };
        
        _this.btnImprimirReporteEntidad = {
            text: "Listado",
            iconCls: 'imprimir',
            id: 'btnReporteImprimirEntidad'+this.viewId,
            handler: function() {
                _this.imprimirReporte('/distra/logistica/activofijo/submayor/ReporteProductosCantidadDisponibles_1');
            }
        };
        
        _this.btnReportes = LOG.util.Prototipos.botonImprimir({
            text: _this.idioma.btnReportes,
            tooltip: _this.idioma.btnReportes,
            iconCls: 'crearreporte',
            menu: [_this.btnImprimirReporte, _this.btnImprimirReporteEntidad],
            controlFn: function (b, _caller) {
                b.enable();
            }
        });

        _this.limpiar = new LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnLimpiar,
            iconCls: 'limpiar',
            tooltip: _this.idioma.ttBtnLimpiar,
            handler: function () {
                if (_this.busqueda) {
                    _this.busqueda.model.reset();
                    _this.busqueda.fireEvent('limiarcampos');
                    Log.aft.submayor.View.busquedaP = false;
                }
                _this.clean = true;

                _this.getGridPrincipal().filters.clearFilters();
                _this.getGridPrincipal().filters.filters.each(function (i) {
                    i.setValue("");
                });


                _this.getStorePrincipal().load({
                    params: {
                        limit: 30,
                        start: 0,
                        salidas:(_this.salida) ? _this.salida: null

                    }
                });

            }
        });
        
        this.addToolbarButton(_this.btnReportes);
        this.addToolbarButton(_this.limpiar);
    },
    initDefaultColumns: function(){
        var _this = this;
        var array_cols = _this.getColumns(); 
        array_cols.forEach(function(col){
            _this.addGridColumn(col);
        })
    },
    getColumns: function(){
        var _this = this;
        var array_cols = new Array();
        array_cols.push({
            dataIndex: 'idindicador',
            default: true
        });
        array_cols.push({
            dataIndex: 'areas',
            default: true
        });
        array_cols.push({
            dataIndex: 'arridtablas',
            default: true
        });
        array_cols.push({
            dataIndex: 'idtabla',
            default: true
        });
        array_cols.push({
            header: this.idioma.lbCmCodigo,
            dataIndex: 'codigo',
            default: true,
            filter:{
                type:'string',
                dataIndex:'codigo'
            }
        });
        array_cols.push({
            header: this.idioma.lbCmDenominacion,
            dataIndex: 'denominacion',
            width: 150,
            filter:{
                type:'string',
                dataIndex:'denominacion'
            }
        });
        array_cols.push({
            dataIndex: 'marca',
            default: true
        });
        array_cols.push({
            dataIndex: 'modelo',
            default: true
        });
        array_cols.push({
            header: this.idioma.lbCmMarcaModelo,
            dataIndex: 'marcamodelo',
            default: true,
            sortable: true,
            hidden : (_this.tipo == 1) ? true : false,
            width: 200,
            filter:{
                type:'string',
                dataIndex:'marcamodelo'
            },
            renderer: function(v, p, recordActivo) {
                var valor = '';

                if (recordActivo.get('marca') != null) {
                    valor = recordActivo.get('marca');
                } else
                    valor = "";

                if (recordActivo.get('modelo') != null) {
                    valor += ' - ' + recordActivo.get('modelo');
                } else
                    valor += "";

                return valor;
            }
        });
        array_cols.push({
            header: this.idioma.lbCmCantidad,
            dataIndex: 'cantidad',
            default: true,
            align: 'right'
        });
        array_cols.push({
            header: this.idioma.lbCmDisponibilidad,
            dataIndex: 'disponible',
            default: true,
            align: 'right'
        });
        array_cols.push({
            dataIndex: 'idgruposubgrupo',
            default: true
        });

        array_cols.push({
            header: "Grupo",
            dataIndex: 'descripciongrupo',
            sortable: false,
            filter: {
                type: 'list',
                options: _this.grupossubgrupos,
                dataIndex: 'idgruposubgrupo'    
            }
        });
        array_cols.push({
            header: this.idioma.lbNaturaleza,
            dataIndex: 'naturaleza',
            default: true,
            filter: {
                type: 'list',
                options: _this.naturalezas,
                dataIndex: 'idnaturaleza'
            }
        });
        _this.columnasDinamicas
            .map(function(item){
                return {
                    header: item.denominacion,
                    dataIndex: 'activ' + item.idactividad,
                    default: true
                };
            })
            .forEach(function(item){
                array_cols.push(item);
        });

        return array_cols;
    },
    render: function(){
        Log.aft.submayor_v2.ViewCantidades.superclass.render.call(this);
        var _this = this;
        var cols = _this.getColumns();
        
        var ncols = new LOG.util.List();
        for (var i = 0; i < cols.length; i++) {
            ncols.add(cols[i]);
        }

        var columns = LOG.util.UIManager.proccessColumns(ncols);
        var cmGridPrincipal = new Ext.ux.grid.LockingColumnModel(columns.columns);
        var recStGridPrincipal = Ext.data.Record.create(columns.fields);
        var cfgStore = {
            url: _this.urlBusquedaGridPrincipal,
            remoteSort: true,
            reader: new Ext.data.JsonReader({
                id: _this.idGridPrincipal,
                totalProperty: 'cantidad',
                root: 'datos'
            }, recStGridPrincipal)
        };
        var store = new Ext.ux.maximgb.AdjacencyListStore(cfgStore);

        _this.storePrincipal = store;
        cmGridPrincipal = AFT.util.ViewConfigCache.cargarConfiguracionInterfaz(_this.viewId, cmGridPrincipal, _this.viewConfig);
        _this.gpPrincipal.reconfigure(store, cmGridPrincipal);

        this.panelBotones.getTopToolbar().add('->',{html: '', id: 'idHTMLcantidad'+_this.viewId},'-',{ xtype: 'label', text: "Entidad: " + denomestructuracomun}, '', '-');

        _this.gpPrincipal.setAutoScroll(true);
        _this.gpPrincipal.getBottomToolbar().bindStore(store);

        _this.storePrincipal.on({
            load: function (st, obj) {
                _this.cantidadTotal = st.reader.jsonData.cantidadTotal;
                (_this.cantidadTotal) ? document.getElementById('idHTMLcantidad'+_this.viewId).innerHTML = "<b>Cantidad total: </b>" + _this.cantidadTotal : document.getElementById('idHTMLcantidad'+_this.viewId).innerHTML = "";
            }
        });

        const lastOptions = _this.getGridPrincipal().getStore().lastOptions || { params: {} };
        Ext.apply(lastOptions.params, _this.baseParams);
        Ext.apply(lastOptions.params, {start: 0, limit: 30});

        _this.getGridPrincipal().getStore().load(lastOptions);


        //_this.storePrincipal.load(lastOptions);

        _this.listaColumnas.deleteAll();
        for (var i = 0; i < columns.columns.length; i++) {
            if (columns.columns[i].header != "N.°") {
                _this.listaColumnas.add(columns.columns[i]);
            }
        }
    },
    imprimirReporte: function(dirRep) {
        var _this = this; 
        var params = {};
        switch (_this.type) {
            case 'AFT':
                params = {
                    isTransp: 0,
                    isUH: 0
                }
                break;
            case 'UH':
                params = {
                    isTransp: 0,
                    isUH: 1
                }
                break;
            case 'TRANSP':
                params = {
                    isTransp: 1,
                    isUH: 0
                }
                break;
        
            default:
                break;
        }
        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    params: params,
                    dirReport: dirRep,
                    detailFirma: {}
                }
            ]
        }).view();
    }
});