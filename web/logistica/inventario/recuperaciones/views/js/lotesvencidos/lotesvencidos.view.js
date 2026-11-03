Ext.ns('Ext.erp.lotesvencidos');
Ext.erp.lotesvencidos = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        config.dirController = '/logistica/inventario/recuperaciones/index.php/lotesvencidos';
        config.urlBusquedaGridPrincipal = 'getLotesVencidos';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        config.idioma = {};
        Ext.erp.lotesvencidos.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, LOG.inv.LotesVencidos.Idioma);

    },
    init: function() {
        var _this = this;
        Ext.erp.lotesvencidos.superclass.init.call(this);
        _this.entidades=[];
        _this.entidadesCheck = _this.listaBotones.getItem(5).getCheckedValue();
        this.comboDepositos.store.load({
            callback: function(){
                for(var i=0; i < _this.listaBotones.getItem(5).store.data.items.length; i++) {
                    _this.entidades.push(_this.listaBotones.getItem(5).store.data.items[i].data.iddeposito);
                }
                var ents = _this.entidadesCheck ? '{'+_this.entidadesCheck+'}' : '{'+_this.entidades.join()+'}';
                _this.storePrincipal.on('beforeload',function(store){
                    store.initBaseParams = {
                        idestructura: ents,
                        start: 0,
                        limit: null,
                        valor:0
                    };
                });

                _this.getStorePrincipal().load()
            }

        });
        this.comboDepositos.on({
            'select': function() {
                _this.entidades=[];
                _this.entidadesCheck = _this.listaBotones.getItem(5).getCheckedValue();
                for(var i=0; i < _this.listaBotones.getItem(5).store.data.items.length; i++) {
                    _this.entidades.push(_this.listaBotones.getItem(5).store.data.items[i].data.iddeposito);
                }
                var ents = _this.entidadesCheck ? '{'+_this.entidadesCheck+'}' : '{'+_this.entidades.join()+'}';
                _this.storePrincipal.on('beforeload',function(store){
                    store.initBaseParams = {
                        idestructura: ents,
                        start: 0,
                        limit: null,
                        valor:0
                    };
                });
                _this.getStorePrincipal().load()
            }
        })


    },
    render: function(config) {
        var render = Ext.erp.lotesvencidos.superclass.render.call(this, config);
        var _this = this;
        _this.textDesde = new Ext.form.DateField({
            name: 'desdeLV',
            width: 100,
            editable: false,
            vtype: 'daterange',
            id: 'desdeLV',
            endDateField: 'hastaLV'
        });
        _this.textHasta = new Ext.form.DateField({
            name: 'hastaLV',
            width: 100,
            editable: false,
            vtype: 'daterange',
            id: 'hastaLV',
            startDateField: 'desdeLV'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;
        _this.btnBuscar = new Ext.Button({ iconCls: 'buscar', text: this.idioma.lbBtnBuscar, tooltip: this.idioma.tooltipBuscar, disabled: false, handler: function () {
            _this.botonBuscar();
        }});
        _this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({ text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.tooltipLimpiar, handler: function () {
            _this.customTriggerClear();
        }});
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


        this.gpPrincipal.getTopToolbar().add('-',new Ext.form.Label({text: _this.idioma.cgDesde}), ' :', _this.textDesde,
            '-', new Ext.form.Label({text: _this.idioma.cgHasta}), ' :', _this.textHasta,'-', _this.btnBuscar,'-', _this.btnLimpiar);

        return render;

    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgcodigo,
            width: 120,
            dataIndex: 'codigoprod',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgdemoninacion,
            width: 150,
            dataIndex: 'denomproducto',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantDias,
            width: 120,
            align: 'right',
            dataIndex: 'cantidadmovlote',
            default: true
        }));
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 120,
            dataIndex: 'um',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNumLote,
            width: 80,
            dataIndex: 'numlote',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaFabricacion,
            width: 120,
            dataIndex: 'fechafabricacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaVencimiento,
            width: 120,
            dataIndex: 'fechavencimiento',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFabricante,
            width: 250,
            dataIndex: 'denomcliente',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgpais,
            width: 120,
            dataIndex: 'nombrepais',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idlote',
            default: true
        });

    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled:true,
            handler: function() {
                _this.getReportes(_this);
            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function (e) {
                    if (e == 'load') {
                        if(_caller.getStorePrincipal().getCount()!=0){
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }

        }));

        this.comboDepositos = new LOG.util.LovCombo({
            mode:'remote',
            url: _this.dirController + '/cargardepositos',
            displayField: 'deposito',
            valueField: 'iddeposito',
            autoLoad:false
        });
        this.lbDeposito=new Ext.form.Label({
            text: _this.idioma.lbDeposito
        });
        this.addToolbarButton("->");
        this.addToolbarButton(this.lbDeposito);
        this.addToolbarButton(" ");
        this.addToolbarButton( this.comboDepositos);
        this.addToolbarButton("-");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id:'idLotesVencidos'}));


        _this.btnGraficar = new Ax.Charts.Views.ChartButton({
            cls: 'tbar',
            hidden:true,
            updateSourceStores: function(){
                _this.btnGraficar.addSerieStore("Producto-Cantidad", _this.getStorePrincipal(), {
                    x: {
                        source: "denomproducto",
                        label: "Producto"
                    },
                    y: {
                        source: "cantidadmovlote",
                        label: "Cantidad"
                    }
                });
                return true;
            }
        });
        this.insertToolbarButton(_this.btnGraficar,1);

    },
    getReportes: function () {
        var _this = this;
        _this.entidades=[];
        _this.entidadesCheck=_this.comboDepositos.getCheckedValue();
        for(var i=0; i < this.comboDepositos.store.data.items.length; i++) {
            _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
        }
        var ents = _this.entidadesCheck ? '{'+_this.entidadesCheck+'}' : '{'+_this.entidades+'}';

        var desde = (_this.getGridPrincipal().toolbars[0].items.items[3].getValue()) ? _this.getGridPrincipal().toolbars[0].items.items[3].getValue().format('d/m/Y') : null;
        var hasta = (_this.getGridPrincipal().toolbars[0].items.items[7].getValue()) ? _this.getGridPrincipal().toolbars[0].items.items[7].getValue().format('d/m/Y') : null;

        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/LotesVencidos',
                    name: 'LotesVencidos',
                    isList:true,
                    params: {
                        fechainicio: desde,
                        fechafin: hasta,
                        arraydeposito: ents,
                        idsubsistema: _this.comboDepositos.store.reader.jsonData.idsubsistema,
                        start: 0,
                        limit: null
                    }
                }
            ]
        });
        this.tipoReportes .view();
    },
    botonBuscar: function () {
        var _this = this;
        _this.getStorePrincipal().filtrado = true;
        var desde = (_this.getGridPrincipal().toolbars[0].items.items[3].getValue()) ? _this.getGridPrincipal().toolbars[0].items.items[3].getValue().format('d/m/Y') : null;
        var hasta = (_this.getGridPrincipal().toolbars[0].items.items[7].getValue()) ? _this.getGridPrincipal().toolbars[0].items.items[7].getValue().format('d/m/Y') : null;

        _this.storePrincipal.on('beforeload',function(store){
            store.baseParams = {
                desde: desde,
                hasta: hasta,
                start: 0,
                limit: null
            };
        });


        if (desde == 0 && hasta == 0) {
            mostrarMensaje(1, _this.idioma.msgInfDatosE);
        }
        else {
            _this.getStorePrincipal().load();
        }
    },

    customTriggerClear: function() {
        var _this = this;

        _this.comboDepositos.reset();
        for(var i=0; i < _this.comboDepositos.store.data.items.length; i++) {
            _this.comboDepositos.store.data.items[i].set('checked',false);
        }

        _this.storePrincipal.on('beforeload',function(store){
            store.baseParams = {
                idestructura: '{}',
                fechainicio: null,
                fechafin: null,
                start: 0,
                limit: null
            };
        });
        _this.textDesde.reset();
        _this.textHasta.reset();
        _this.textDesde.setMaxValue(null);
        _this.textHasta.setMinValue(null);

        for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
            _this.entidades.push(_this.comboDepositos.store.data.items[i].id);
        }
        var ents = '{' + _this.entidades.join() + '}';
        _this.storePrincipal.on('beforeload', function (store) {
            store.initBaseParams = {
                idestructura: ents,
                start: 0,
                limit: null,
                valor: 0
            };
        });

        _this.getStorePrincipal().load();
    }
});