Ext.ns('Ext.erp.piezasmenosusadas');
Ext.erp.piezasmenosusadas = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/piezasmenosusadas';
        config.urlBusquedaGridPrincipal = 'getPiezasMenosUsadas';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.idioma = {};
        Ext.erp.piezasmenosusadas.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.piezasmenosusadas.Idioma);
    },
    render: function(config) {
        var render = Ext.erp.piezasmenosusadas.superclass.render.call(this, config);
        var _this = this;
        _this.textDesde = new Ext.form.DateField({
            width: 100,
            editable: false
        });

        _this.textHasta = new Ext.form.DateField({
            width: 100,
            editable: false
        });
        _this.btnBuscarPiezasMenos = new Ext.Button({iconCls: 'buscar', text: this.idioma.lbBtnBuscar, tooltip: this.idioma.tooltipBuscar, disabled: false, handler: function() {
                var desde = _this.textDesde.getValue();
                var hasta = _this.textHasta.getValue();
                if (desde || hasta) {
                    _this.getStorePrincipal().load({
                        params: {
                            desde: (desde) ? desde : null,
                            hasta: (hasta) ? hasta : null,
                            limit: 30,
                            start: 0
                        },
                        callback: function () {
                            //if (_this.getStorePrincipal().getCount() == 0)
                            //    mostrarMensaje(1, _this.idioma.msgInfDatosB);
                        }
                    });
                }
            }});
        _this.btnLimpiarPiezasMenos = new Ext.Button({iconCls: 'limpiar', text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.tooltipLimpiar, disabled: false, handler: function() {
           if(_this.textDesde.getValue() || _this.textHasta.getValue()) {
               _this.textDesde.reset();
               _this.textHasta.reset();
               _this.getStorePrincipal().load();
           }
        }});

        this.gpPrincipal.getTopToolbar().add(
            '-',
            new Ext.form.Label({text: _this.idioma.cgDesde}),
            ' :',
            _this.textDesde,
            '-',
            new Ext.form.Label({text: _this.idioma.cgHasta}),
            ' :',
            _this.textHasta,
            '-',
            _this.btnBuscarPiezasMenos,
            '-',
            _this.btnLimpiarPiezasMenos
            );


        return render;

    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgPieza,
            width: 120,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 120,
            dataIndex: 'cantidad',
            default: true
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            handler: function() {
                _this.getReportes(_this);
            }
//            controlFn: function(b, _caller) {
//                if (_caller.grantedAction('RB')) {
//                    b.setVisible(true);
//                } else {
//                    b.setVisible(false);
//                }
//            }
        }));
        this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({
            tooltip: this.idioma.ttAyuda
        }));

    },
    getReportes: function(data) {
        var _this = this;
        var stringPiezas = "";

        for (var i = 0; i < _this.getStorePrincipal().data.items.length; i++) {
            if (i != _this.getStorePrincipal().data.items.length - 1) {
                stringPiezas += _this.getStorePrincipal().data.items[i].data.idlote + ",";
            } else {
                stringPiezas += _this.getStorePrincipal().data.items[i].data.idlote + "";
            }
        }
        stringPiezas = "{" + stringPiezas + "}";
        var desde = this.getGridPrincipal().toolbars[0].items.items[3].getValue();
        var hasta = this.getGridPrincipal().toolbars[0].items.items[7].getValue();
        var tipoReportes = new Ext.util.Reports({
            urlAction: '/logistica/talleres/recuperaciones/index.php/piezasmenosusadas/reporte',
            report: 'PiezasMenosUsadas',
            method: 'getQueryPiezasMenosUsadas',
            filters: {
                idlote: stringPiezas,
                desde: desde,
                hasta: hasta
            }
        });
        tipoReportes.show()
    },
    getCadenaPiezas: function() {
        var stringPiezas = "";
        for (var i = 0; i < this.getStorePrincipal().data.items.length; i++) {
            var record = this.getStorePrincipal().getAt(i);
            if (i != this.getStorePrincipal().data.items.length - 1) {
                stringPiezas += record.data.idlote + ",";
            } else {
                stringPiezas += record.data.idlote + "";
            }
        }
        return "{" + stringPiezas + "}";
    },
    getDateDesde: function() {
        return (this.textDesde.getValue()) ? this.textDesde.getValue().format('d-m-Y') : null;
    },
    getDateHasta: function() {
        return (this.textHasta.getValue()) ? this.textHasta.getValue().format('d-m-Y') : null;
    }
});