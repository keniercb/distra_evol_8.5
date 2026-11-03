Ext.ns('LOG.aft.valoresareas');
LOG.aft.valoresareas.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/activos_fijos/recuperaciones/index.php/valoresareas';
        config.urlBusquedaGridPrincipal = 'cargarDatos';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        _this.tiposmedios = 3;
        config.idioma = {};

        LOG.aft.valoresareas.view.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, LOG.aft.valoresareas.Idioma);
        _this.concepto = '';
        _this.textBusquedaSimple = ''/*this.idioma.txtBusquedaSimple*/;


    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgAreaResp,
            width: 350,
            dataIndex: 'area',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgValorContable,
            width: 100,
            dataIndex: 'valorcontable',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgValorContableAlt,
            align: 'right',
            width: 100,
            dataIndex: 'valorcontablealternativo',
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgDepAcum,
            width: 100,
            dataIndex: 'depreciacionacumulada',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgDepAcumAlt,
            align: 'right',
            width: 100,
            dataIndex: 'depreciacionacumuladaalternativo',
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgCantidad,
            align: 'center',
            width: 100,
            dataIndex: 'cantidad',
            default: true
        }));

        this.addGridColumn({
            dataIndex: 'tipo',
            default: false,
            hidden: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled: true,
            handler: function () {
                _this.getReportes(_this);
            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function (e) {
                    if (e == 'load') {
                        if (_caller.getStorePrincipal().getCount() != 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));


        _this.chkAft = new Ext.form.Checkbox({
            boxLabel: 'Activos',
            value: 1,
            checked: true,
            listeners: {
                'check': function (cmp, checked) {
                    if (checked) {
                        _this.tiposmedios += 1;
                    } else {
                        _this.tiposmedios -= 1;
                    }
                    _this.getStorePrincipal().load({
                        params: {
                            tiposmedios: _this.tiposmedios
                        }
                    });
                }
            }
        });
        _this.chkUh = new Ext.form.Checkbox({
            boxLabel: 'Utiles',
            value: 2,
            checked: true,
            listeners: {
                'check': function (cmp, checked) {
                    if (checked) {
                        _this.tiposmedios += 2;
                    } else {
                        _this.tiposmedios -= 2;
                    }
                    //_this.getStorePrincipal().tipomedios = _this.tiposmedios;
                    _this.getStorePrincipal().load({
                        params: {
                            tiposmedios: _this.tiposmedios
                        }
                    });
                }
            }
        });
        this.addToolbarButton("-");
        this.addToolbarButton(_this.chkAft);
        this.addToolbarButton("-");
        this.addToolbarButton(_this.chkUh);
        this.addToolbarButton("->");
        this.addToolbarButton("-");
        //this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id: 'idbalancecontable'}));


    },
    init: function () {
        var _this = this;
        LOG.aft.valoresareas.view.superclass.init.call(this);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {

            Ext.apply(_this.gpPrincipal, {
                viewConfig: {
                    getRowClass: function (rec, index, rowParams, store) {
                        if (rec.data.tipo === 'entidad'
                                && (rec.data.valorcontable !== 0
                                        || rec.data.valorcontablealternativo !== 0
                                        || rec.data.depreciacionacumulada !== 0
                                        || rec.data.depreciacionacumuladaalternativo !== 0)
                                ) {
                            return 'redrow-text';
                        }
                        if (rec.data.tipo === 'total') {
                            return 'greenrow-text';
                        }
                    }
                }
            });

        });
    },
    getReportes: function (data) {
        var _this = this;

        var tipoReportes = new LOG.util.Report({
            reports: [{
                    dirReport: '/distra/logistica/activofijo/Recuperaciones/ValoresAreas',
                    name: 'ValoresAreas',
                    isList: true,
                    params: {
                        idestructura: idEntidad,
                        tiposmedios: _this.tiposmedios
                    }
                }]
        });
        tipoReportes.view();

        /*Ext.Ajax.request({
         url: '/logistica/activos_fijos/recuperaciones/index.php/valoresareas/cargarEjercicioContabilidad',
         method: 'POST',
         callback: function (opt, scs, resp) {
         Ext.getBody().unmask();
         data = Ext.decode(resp.responseText);
         console.info(data);
         if (data.idejerciciocontabilidad) {
         var tipoReportes = new LOG.util.Report({
         reports: [{
         dirReport: '/distra/logistica/activofijo/Recuperaciones/BalanceContableListado',
         name: 'BalanceContableListado',
         isList: true,
         params: {
         idestructura: idEntidad,
         idejerciciocontabilidad: +data.idejerciciocontabilidad
         }
         }]
         });
         tipoReportes.view();
         }
         }
         });*/
    },
    /*getDepositos: function () {
     var _this = this;
     _this.entidades = [];
     _this.entidadesCheck = _this.comboDepositos.getCheckedValue();
     for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
     _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
     }
     var value = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades + '}';
     return "'" + value + "'";
     },
     getCriterio: function () {
     return this.denominacion.getValue() || null;
     },
     botonBuscar: function () {
     if (this.denominacion.isDirty() || this.dias.isDirty()) {
     var _this = this;
     _this.getStorePrincipal().filtrado = true;
     _this.getStorePrincipal().load({
     params: {
     valor: _this.dias.getValue(),
     denominacion: _this.denominacion.getValue()
     }
     });
     }
     },
     customTriggerClear: function () {
     if (this.denominacion.isDirty() || this.dias.isDirty()) {
     var _this = this;
     _this.dias.reset();
     _this.denominacion.reset();
     
     _this.storePrincipal.on('beforeload', function (store) {
     store.baseParams = {
     idestructura: idEntidad,
     valor: 0,
     denominacion: null,
     start: 0,
     limit: null
     };
     });
     _this.getStorePrincipal().load();
     }
     }*/

});