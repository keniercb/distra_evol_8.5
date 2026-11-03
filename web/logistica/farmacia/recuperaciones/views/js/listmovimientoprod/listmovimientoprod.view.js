Ext.ns('LOG.farm.listmovimientoprod');

LOG.farm.listmovimientoprod.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.dirController = '/logistica/farmacia/recuperaciones/index.php/listmovimientoprod';
        config.urlBusquedaGridPrincipal = 'getDatos';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        this.tipoVista = 1;
        Ext.apply(this, config);
        this.idioma = Object.assign({}, LOG.farm.Recuperaciones.Idioma, LOG.util.Idioma, LOG.farm.listmovimientoprod.Idioma);
        LOG.farm.listmovimientoprod.view.superclass.constructor.call(this, config);

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
            dataIndex: 'codigo'
        });
        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            width: 300,
            dataIndex: 'denominacion',
            autoExpand:true
        });
        this.addGridColumn({
            header: _this.idioma.lbFecha,
            width: 75,
            dataIndex: 'fecha'
        });
        this.addGridColumn({
            header: _this.idioma.lbTipodoc,
            width: 150,
            dataIndex: 'tipodoc',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbNrodoc,
            width: 75,
            dataIndex: 'numerodoc'
        });
        this.addGridColumn({
            header: _this.idioma.lbOrigen,
            width: 150,
            dataIndex: 'origen',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbDestino,
            width: 150,
            dataIndex: 'destino'
        });
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgCantidad,
            width: 75,
            dataIndex: 'cantidad'
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgPrecio,
            width: 75,
            dataIndex: 'precio'
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgImporte,
            width: 75,
            dataIndex: 'importe',
            default: true
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgExistencia,
            width: 75,
            dataIndex: 'existencia'
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgImporteExistencia,
            width: 120,
            dataIndex: 'importe',
            renderer(v, _mD, _r){
                return (v *_r.data.existencia) || 0.0
            }
        }, '0,000.00'));
        this.addGridColumn({
            header: _this.idioma.cgDeposito,
            width: 150,
            dataIndex: 'deposito',
            default: true
        });
    },
    render:function(config){
        var vista = LOG.farm.listmovimientoprod.view.superclass.render.call(this);
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
            _this.fechaIni.reset();
            _this.fechaFin.reset();
            scope.store.initBaseParams.fechaini = "";
            scope.store.initBaseParams.fechafin = "";
            _this.fechaIni.blur();
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
            let validarD = (_this.fechaIni.isDirty() || _this.fechaFin.isDirty());
            let validarV = (_this.fechaIni.isValid() || _this.fechaFin.isValid());
            if (validarD && validarV) {
                scope.store.initBaseParams.filtrado = true;
                (_this.fechaIni.getValue())?scope.store.initBaseParams.fechaIni = _this.fechaIni.getValue().format('d/m/Y'):true;
                (_this.fechaFin.getValue())?scope.store.initBaseParams.fechaFin = _this.fechaFin.getValue().format('d/m/Y'):true;

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
        this.listaBotones.add(LOG.util.Prototipos.botonAyuda({id: 'idlistmovimientoprod'}));

    },
    getReporte: function () {

        var _this = this;
        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    isList: true,
                    params: {
                        idestructura: idestructura
                    },
                    dirReport: '/distra/logistica/farmacia/recuperaciones/MovimientoProducto',
                    detailFirma: {}
                }
            ]
        }).view();

    }
});