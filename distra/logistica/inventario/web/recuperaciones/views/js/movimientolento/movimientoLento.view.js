Ext.ns('Ext.erp.movimientolento');
Ext.erp.movimientolento = Ext.extend(LOG.util.UITemplate, {
    autoLoad : false,
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/lentos';
        config.urlBusquedaGridPrincipal = 'getProductosLentoMov';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        config.idioma = {};
        Ext.erp.movimientolento.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.inv.MovimientoLento.Idioma);
        _this.concepto = this.idioma.productos;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimple;
    },
    initDefaultColumns: function () {

        this.addGridColumn({
            header: this.idioma.lbDeposito,
            width: 80,
            dataIndex: 'deposito',
            agrupador:true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 110,
            dataIndex: 'codigoproducto',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denomproducto',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgOperacion,
            width: 120,
            dataIndex: 'operacion',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistencia,
            width: 60,
            align: 'right',
            dataIndex: 'existencia',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgDisponible,
            width: 60,
            align: 'right',
            dataIndex: 'disponible',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgPrecio,
            width: 60,
            align: 'right',
            dataIndex: 'precio',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgImporte,
            width: 60,
            align: 'right',
            dataIndex: 'importe',
            default: true
        }));
        this.addGridColumn({
            header: this.idioma.cgFechaUltimoMov,
            width: 90,
            align: 'center',
            dataIndex: 'fechamov',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 50,
            align: 'center',
            dataIndex: 'envejecimiento',
            default: true
        });

        /*this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            width: 60,
            align: 'right',
            dataIndex: 'envejecimiento',//'cantidad',
            default: true
        }));*/
    },
    grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(acciones_reportes, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    initDefaultButtons: function () {
        var _this = this;
		var lentomovtotal = (_this.grantedAction('LentoMovTotal'))?1:0;
        //console.info(_this.grantedAction('LentoMovTotal'));
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
        /*this.addToolbarButton(new Ax.Charts.Views.ChartButton({
            isRenconfigured: true,
            waitFn: function (btn) {
                Ext.Ajax.request({
                    url: '/logistica/inventario/recuperaciones/index.php/lentos/getFecha',
                    params: {
                        dias: (_this.dias.getValue()) ? _this.dias.getValue() : 0
                    },
                    method: 'POST',
                    success: function (r) {
                        btn.updateQuery = function () {
                            return 'select * from mod_loginventario.f_productoslentomovimiento(' + _this.getDepositos() + ',' + null + ',' + null + ', '
                            + null + ', ' + null + ', ' + _this.getCriterio() + ', ' + idEntidad + ', ' + _this.comboDepositos.store.reader.jsonData.idsubsistema + ')';
                        }
                        btn.run();
                    }
                });
            }
        }));*/
        this.comboDepositos = new LOG.util.LovCombo({
            mode: 'local',
            url: '/logistica/utiles/plugin/index.php/plugincombodeposito/cargardepositos?idtipo=-1&limit=1000&seguridad=1&caso=1&lentomovtotal='+lentomovtotal,
            displayField: 'deposito',
            valueField: 'iddeposito',
            autoLoad: false
        });
        this.lbDeposito = new Ext.form.Label({
            text: _this.idioma.lbDeposito
        });
        this.addToolbarButton("->");
        this.addToolbarButton(this.lbDeposito);
        this.addToolbarButton(" ");
        this.addToolbarButton(this.comboDepositos);
        this.addToolbarButton("-");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id: 'idLentoMovimiento'}));


    },
    init: function () {
        var _this = this;
        Ext.erp.movimientolento.superclass.init.call(this);
        _this.entidades = [];

        this.comboDepositos.getStore().on({
            'load': function (st, records, opts) {
                for (var i = 0; i < st.getCount(); i++) {
                    _this.entidades.push(records[i].get('iddeposito'));
                }
                var ents = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades.join() + '}';
                _this.storePrincipal.on('beforeload', function (store) {
                    store.initBaseParams = {
                        idestructura: ents,
                        start: 0,
                        limit: null,
                        valor: 0,                        
                        fechafin: _this.textDesde.getValue() ? _this.textDesde.getValue().format('d/m/Y')  : null,
                        idnaturaleza: _this.tcNaturaleza.getValue(),
                        desde: _this.desde.getValue(),
                        hasta: _this.hasta.getValue(),
                        denominacion: _this.denominacion.getValue()
                    };
                });

                //_this.getStorePrincipal().load()
            }
        });
        this.comboDepositos.getStore().load();
        this.comboDepositos.on({//si selecciono el id -1 entonces los mando a seleccionar todos
            'select': function (cb,record) {
                _this.entidades = [];
                _this.entidadesCheck = cb.getCheckedValue();

                for (var i = 0; i < cb.store.getCount(); i++) {
                    _this.entidades.push(cb.store.data.items[i].id);
                }
                var ents = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades.join() + '}';
                _this.storePrincipal.on('beforeload', function (store) {
                    store.initBaseParams = {
                        idestructura: ents,
                        start: 0,
                        limit: null,
                        valor: 0
                    };
                });
                _this.getStorePrincipal().load()
            }
        });
    },
    render: function (config) {
        var render = Ext.erp.lotesvencidos.superclass.render.call(this, config);
        var _this = this;

        _this.textDesde = new Ext.form.DateField({
            name: 'desdeLV',
            width: 100,            
            emptyText : 'Fecha fin',
            editable: false
        });
        _this.desde = new LOG.util.Prototipos.inputTexto({
            name: 'desde',
            emptyText: _this.idioma.lbDesde,
            width: 50,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            invalidText: _this.idioma.tooltipValDiasEnt,
            enableKeyEvents: true,
            listeners: {
                'keyup': function (i, e) {
                    if (e.getKey() == 13) {
                        _this.botonBuscar();
                    }
                }
            }


        });
        _this.hasta = new LOG.util.Prototipos.inputTexto({
            name: 'hasta',
            emptyText: _this.idioma.lbHasta,
            width: 50,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            invalidText: _this.idioma.tooltipValDiasEnt,
            enableKeyEvents: true,
            listeners: {
                'keyup': function (i, e) {
                    if (e.getKey() == 13) {
                        _this.botonBuscar();
                    }
                }
            }


        });

        _this.denominacion = new LOG.util.Prototipos.inputTexto({
            emptyText: _this.idioma.cgDenominacion,
            name: 'denominacion',
            maxLength: 255,
            minLength: 2,
            enableKeyEvents: true,
            listeners: {
                'keyup': function (i, e) {
                    if (e.getKey() == 13) {
                        _this.botonBuscar();
                    }
                }
            }

        });

        this.tcNaturaleza = new LOG.util.TreeCombo({
            fieldLabel: this.idioma.lbNaturaleza,
            textRootNode: this.idioma.lbNaturalezas,
            name: 'idnaturaleza',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/getNaturalezas',
            listWidth: '250px',
            resizable: true,
            emptyText : 'Naturaleza',
            selectOnlyLeaf: true,
            selectFn: function(_v) {
                this.displayedText = _v.text;
                this.idSeleccionado = _v.attributes.id;
                this.setRawValue(_v.text);
                this.setValue(_v.attributes.id);
            }
        });

        _this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.tooltipBuscar,
            disabled: false,
            handler: function () {
                _this.botonBuscar();
            }
        });
        _this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({
            text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.tooltipLimpiar, handler: function () {
                _this.customTriggerClear();
            }
        });
        render.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function () {
                        if (render.isVisible())
                            _this.botonBuscar();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        if (render.isVisible())
                            _this.customTriggerClear();
                    }
                }
            ]);
        _this.storePrincipal.on({
            'beforeload' : function (store) {
                store.baseParams = {
                    fechafin: _this.textDesde.getValue() ? _this.textDesde.getValue().format('d/m/Y')  : null,
                    idnaturaleza: _this.tcNaturaleza.getValue(),
                    desde: _this.desde.getValue(),
                    hasta: _this.hasta.getValue(),
                    denominacion: _this.denominacion.getValue()
                };
            } 
        });
        this.gpPrincipal.getTopToolbar().add(
            '-',
            _this.textDesde,
            '-',   
            _this.desde,            
            ' (d\xedas) ',
            ' hasta ',
            _this.hasta,
            ' (d\xedas) ',
            '-',
            _this.denominacion,
            '-',
            this.tcNaturaleza,
            '-',
            _this.btnBuscar,
            '-',
            _this.btnLimpiar
        );

        return render;

    },
    getReportes: function (data) {
        var _this = this;
        _this.entidades = [];
        _this.entidadesCheck = _this.comboDepositos.getCheckedValue();
        for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
            _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
        }
        var ents = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades + '}';

        var criterioBusqueda = _this.denominacion.getValue() || null;

        var tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/LentosMovimientos',
                    name: 'LentosMovimientos',
                    isList: true,
                    params: {
                        arraydeposito: ents,
                        criterio: criterioBusqueda,
                        idnaturaleza: _this.tcNaturaleza.getValue(),
                        fechafin: _this.textDesde.getValue() ? _this.textDesde.getValue().format('d-m-Y')  : null,
                        desde: _this.desde.getValue(),
                        hasta: _this.hasta.getValue(),
                        idsubsistema: _this.comboDepositos.store.reader.jsonData.idsubsistema
                    }
                }
            ]
        });
        tipoReportes.view();


    },
    getDepositos: function () {
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
        //if (this.denominacion.isDirty() || this.desde.isDirty() || this.hasta.isDirty() || this.textDesde.isDirty() || this.tcNaturaleza.isDirty() ) {
            var _this = this;
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load({
                params: {
                    fechafin: _this.textDesde.getValue() ? _this.textDesde.getValue().format('d-m-Y')  : null,
                    idnaturaleza: _this.tcNaturaleza.getValue(),
                    desde: _this.desde.getValue(),
                    hasta: _this.hasta.getValue(),
                    denominacion: _this.denominacion.getValue()
                }
            });
        //}
    },
    customTriggerClear: function () {
        var _this = this;
        _this.comboDepositos.reset();
        for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
            _this.comboDepositos.store.data.items[i].set('checked', false);
        }
        // _this.getStorePrincipal().reload();

        if (this.denominacion.isDirty() || this.desde.isDirty() || this.hasta.isDirty() || this.textDesde.isDirty() || this.tcNaturaleza.isDirty() ) {
            _this.desde.reset();
            _this.hasta.reset();
            _this.textDesde.reset();
            _this.denominacion.reset();
            _this.tcNaturaleza.reset();

            _this.storePrincipal.on('beforeload', function (store) {
                store.baseParams = {
                    idestructura: idEntidad,
                    desde: 0,
                    hasta: 0,
                    denominacion: null,
                    fechafin: null,
                    idnaturaleza : null,
                    start: 0,
                    limit: null
                };
            });
        }

        for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
            _this.entidades.push(_this.comboDepositos.store.data.items[i].id);
        }
        var ents = '{' + _this.entidades.join() + '}';
        _this.storePrincipal.on('beforeload', function (store) {
            store.initBaseParams = {
                idestructura: ents,
                start: 0,
                limit: null,
                desde: 0,
                hasta: 0,
            };
        });
        this.getStorePrincipal().load();
    }

});
