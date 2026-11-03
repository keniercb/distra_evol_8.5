Ext.ns('LOG.farm.listdisponibilidadprod');

LOG.farm.listdisponibilidadprod.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.dirController = '/logistica/farmacia/recuperaciones/index.php/listdisponibilidadprod';
        config.urlBusquedaGridPrincipal = 'getDatos';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.textBusquedaSimple = "Naturaleza";
        config.autoShow = true;
        config.autoLoad = true;
        this.tipoVista = 1;
        Ext.apply(this, config);
        this.idioma = Object.assign({}, LOG.farm.Recuperaciones.Idioma, LOG.util.Idioma, LOG.farm.listdisponibilidadprod.Idioma);
        LOG.farm.listdisponibilidadprod.view.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;        
        this.addGridColumn({
            header: _this.idioma.lbLineaProd,
            dataIndex: 'naturaleza',
            width: 130,
            agrupador: true
        });
        this.addGridColumn({
            header: _this.idioma.cgCodigo,
            width: 150,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            width: 300,
            dataIndex: 'denominacion',
            default: true,
            autoExpand:true
        });
        this.addGridColumn({
            header: _this.idioma.cgUEmb,
            width: 150,
            dataIndex: 'uemb',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgExistencia,
            width: 150,
            dataIndex: 'cantidad',
            default: true,
            renderer(v, _mD, _r){
                return v
            },
            filter:{
                type:'numeric',
                dataIndex:'cantidad'
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgPrecioCosto,
            width: 150,
            dataIndex: 'preciocosto',
            default: true,
            filter:{
            type:'numeric',
                dataIndex:'preciocosto'
        },
            renderer(v, _mD, _r){
                return v
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgPrecioVenta,
            width: 150,
            dataIndex: 'precioventa',
            default: true,
            filter:{
                type:'numeric',
                dataIndex:'precioventa'
            },
            renderer(v, _mD, _r){
                return v
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgImporteCosto,
            width: 150,
            dataIndex: 'importecosto',
            default: true,
            renderer(v, _mD, _r){
                return (_r.data.preciocosto *_r.data.cantidad) || 0.0
            },
            filter:{
                type:'numeric',
                dataIndex:'importecosto'
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgImporteVenta,
            width: 150,
            dataIndex: 'importeventa',
            default: true,
            renderer(v, _mD, _r){
                return (_r.data.precioventa *_r.data.cantidad) || 0.0
            },
            filter:{
                type:'numeric',
                dataIndex:'importeventa'
            }
        }, '0,000.00'));


    },	
    render:function(config){
        var vista = LOG.farm.listdisponibilidadprod.view.superclass.render.call(this);
        var _this = this;
        this.storePrincipal.fireEvent = this.storePrincipal.fireEvent.createSequence(function (e) {
            if (e == 'beforeload') {

            }
            if (e == 'load') {
                (_this.storePrincipal.getCount() == 0 )?_this.btnImprimir.disable():_this.btnImprimir.enable()
            }
        });

        this.cbNaturaleza = new LOG.util.TreeCombo({
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/getNaturalezas',
            name: 'idnaturaleza',
            modelo: 'NomNaturaleza',
            valueField: 'idnaturaleza',
            selectOnlyLeaf: true,
            fieldLabel: 'Naturaleza',
            resizable: true,
            listWidth: 300
            });
        this.cbNaturaleza.addClass('form-control');
        this.gridFilter.btnLimpiar.handler = function() {
            let scope = _this.gridFilter;
            if (scope.btnLimpiar.disabled) {
                return;
            }
            _this.cbNaturaleza.reset();
            scope.store.initBaseParams.idnaturaleza = "";
            let params = Object.assign({}, scope.store.limitParams, {criterio:null, filtrado:false});
            scope.store.filtrado = false;
            scope.store.reload({
                params: params
            });
        };
        this.gridFilter.btnFiltar.handler = function() {
            let scope = _this.gridFilter;
            if (scope.btnFiltar.disabled) {
                return;
            }
                scope.store.initBaseParams.filtrado = true;
                (_this.cbNaturaleza.getValue())?scope.store.initBaseParams.idnaturaleza = _this.cbNaturaleza.getValue():true;
                let params = Object.assign({}, scope.store.initBaseParams, scope.store.limitParams);

                scope.store.load({
                    params: params
                });

        };
        this.gridFilter.tfBusqueda.setVisible(false);
        this.getGridPrincipal().getTopToolbar().insert(3, this.cbNaturaleza);

        return vista;
    },
    initDefaultButtons: function () {
        var _this = this;
        this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttImprimir,
            disabled:true,
            handler: function () {
                _this.getReporte();
            }

        });
        this.addToolbarButton(_this.btnImprimir);

        this.listaBotones.add('->');
        this.listaBotones.add('-');
        this.listaBotones.add(LOG.util.Prototipos.botonAyuda({id: 'idlistdisponibilidadprod'}));

    },
    getReporte: function () {

        let _this = this;
        let filtros = _this.getGridPrincipal().filters.getFilterData(),
            params = {idestructura:idestructura, idnaturaleza:_this.cbNaturaleza.getValue()};
       filtros.map((objeto)=>{
           params[objeto.field+objeto.data.comparison] = objeto.data.value;
       });
        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    isList: true,
                    params: params,
                    dirReport: '/distra/logistica/farmacia/recuperaciones/DisponibilidadProductos',
                    detailFirma: {}
                }
            ]
        }).view();

    }
});