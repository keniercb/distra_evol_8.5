Ext.ns('LOG.farm.listrecepcionprod');

LOG.farm.listrecepcionprod.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.dirController = '/logistica/farmacia/recuperaciones/index.php/listrecepcionprod';
        config.urlBusquedaGridPrincipal = 'getDatos';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        this.tipoVista = 1;
        Ext.apply(this, config);
        this.idioma = Object.assign({}, LOG.farm.Recuperaciones.Idioma, LOG.util.Idioma, LOG.farm.listrecepcionprod.Idioma);
        LOG.farm.listrecepcionprod.view.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'naturaleza',
            header:'Naturaleza',
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
            header: _this.idioma.cgCantidad,
            width: 75,
            dataIndex: 'cantidad',
            default: true,
            renderer(v, _mD, _r){
                return v
            }
        }, '0,000.00'));

        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgPrecioCosto,
            width: 75,
            dataIndex: 'preciocosto',
            default: true,
            renderer(v, _mD, _r){
                return v
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgImporteCosto,
            width: 150,
            dataIndex: 'preciocosto',
            default: true,
            renderer(v, _mD, _r){
                return (v * _r.data.cantidad) || 0.0;
            }
        }, '0,000.00'));


    },
    render:function(config){
        var vista = LOG.farm.listrecepcionprod.view.superclass.render.call(this);
        var _this = this;
        this.storePrincipal.fireEvent = this.storePrincipal.fireEvent.createSequence(function (e) {
            if (e == 'beforeload') {

            }
            if (e == 'load') {
                (_this.storePrincipal.getCount() == 0 )?_this.btnImprimir.disable():_this.btnImprimir.enable()
            }
        });

        this.fechaIni = new Ext.form.DateField({
            width: 170,
            fieldLabel: _this.idioma.lbFechaInicio,
            format: 'd/m/Y',
            cls: 'form-control',
            name: 'fechaini',
            emptyText: _this.idioma.lbFechaInicio
        });
        this.fechaFin = new Ext.form.DateField({
            width: 170,
            fieldLabel: _this.idioma.lbFechaFinal,
            format: 'd/m/Y',
            cls: 'form-control',
            name: 'fechafin',
            emptyText: _this.idioma.lbFechaFinal
        });
        this.gridFilter.btnLimpiar.handler = function() {
            let scope = _this.gridFilter;
            if (scope.btnLimpiar.disabled) {
                return;
            }
            this.fechaIni.reset();
            this.fechaFin.reset();
            scope.store.initBaseParams.fechaini = "";
            scope.store.initBaseParams.fechafin = "";
            fechaIni.blur();
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
            let validarD = (this.fechaIni.isDirty() || this.fechaFin.isDirty());
            let validarV = (this.fechaIni.isValid() || this.fechaFin.isValid());
            if (validarD && validarV) {
                scope.store.initBaseParams.filtrado = true;
                (this.fechaIni.getValue())?scope.store.initBaseParams.fechaIni = this.fechaIni.getValue().format('d/m/Y'):true;
                (this.fechaFin.getValue())?scope.store.initBaseParams.fechaFin = this.fechaFin.getValue().format('d/m/Y'):true;

                let params = Object.assign({}, scope.store.initBaseParams, scope.store.limitParams);

                scope.store.load({
                    params: params
                });
            }

        };
        this.gridFilter.tfBusqueda.setVisible(false);
        this.getGridPrincipal().getTopToolbar().insert(2, this.fechaFin, this.fechaIni);

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
        this.listaBotones.add(LOG.util.Prototipos.botonAyuda({id: 'idlistrecepcionprod'}));

    },
    getReporte: function () {

        var _this = this;
        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    isList: true,
                    params: {
                        idestructura: idestructura,
                        fechafin:_this.fechaFin.getValue() && _this.fechaFin.getValue().format('d-m-Y') || null,
                        fechainicio:_this.fechaIni.getValue() && _this.fechaIni.getValue().format('d-m-Y') || null
                    },
                    dirReport: '/distra/logistica/farmacia/recuperaciones/RecepcionProducto',
                    detailFirma: {}
                }
            ]
        }).view();

    }
});