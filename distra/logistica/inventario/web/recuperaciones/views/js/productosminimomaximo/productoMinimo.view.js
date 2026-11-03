Ext.ns('Ext.erp.productominimo');
Ext.erp.productominimo = Ext.extend(Ext.erp.productominimomaximo, {
    constructor: function(config) {
        config.idioma = {};
        Ext.erp.productominimo.superclass.constructor.call(this, config);

   },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.lbDeposito,
            width: 80,
            dataIndex: 'deposito',
            agrupador:true,
            default: true
        });
        Ext.erp.productominimo.superclass.initDefaultColumns.call(this);
        this.insertGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgMinimo,
            width: 120,
            align: 'right',
            dataIndex: 'minimo',
            default: true
        }),4);
        this.insertGridColumn({
            dataIndex: 'idproducto',
            default: true
        },4);

    },
    initDefaultButtons: function() {
        var _this = this;

        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled:true,
            handler: function() {
                _this.getReportes();
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
        this.addToolbarButton("->");
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

        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id:'idProdMin'}));

        _this.btnGraficar = new Ax.Charts.Views.ChartButton({
            cls: 'tbar',
            chartType:'column',
            hidden:true,
            updateSourceStores: function(){
                _this.btnGraficar.addSerieStore("Productos mínimos", _this.getStorePrincipal(), {
                    x: {
                        source: "denominacion",
                        label: "Producto"
                    },
                    y: {
                        source: "minimo",
                        label: "Diferencia (Existencia - Mínimo)"
                    }
                },[{
                    name: 'Mínimo',
                    source: 'minimo'
                },{
                    name: 'Existencia',
                    source: 'existencia'
                },{
                    name: 'Diferencia (Existencia - Mínimo)',
                    source: 'diferencia'
                }]);

                return true;
            }
        });

        this.insertToolbarButton(_this.btnGraficar,1);

    },
    init: function() {
        var _this = this;
        Ext.erp.productominimo.superclass.init.call(this);
        _this.entidades=[];
        _this.entidadesCheck = _this.listaBotones.getItem(6).getCheckedValue();
        this.comboDepositos.store.load({
            callback: function(){
                for(var i=0; i < _this.listaBotones.getItem(6).store.data.items.length; i++) {
                    _this.entidades.push(_this.listaBotones.getItem(6).store.data.items[i].data.iddeposito);
                }
                var a = _this.entidadesCheck ? _this.entidadesCheck : _this.entidades;
                _this.storePrincipal.on('beforeload',function(store){
                    store.initBaseParams = {
                        idestructura: Ext.encode(a),   
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
                _this.entidadesCheck=[];
                for(var i=0; i < _this.listaBotones.getItem(6).store.data.items.length; i++) {
                    if (_this.listaBotones.getItem(6).view.store.data.items[i].data.checked) {
                        _this.entidadesCheck.push(_this.listaBotones.getItem(6).view.store.data.items[i].data.iddeposito);
                    }
                }
                _this.storePrincipal.on('beforeload',function(store){
                    store.initBaseParams = {
                        idestructura: Ext.encode( _this.entidadesCheck),
                        start: 0,
                        limit: null,
                        valor:0
                    };
                });
                _this.getStorePrincipal().load()
            }
        })

    },
    getReportes: function () {
        var _this = this;
        var depositos = '';
        _this.entidadesCheck=[];
        _this.entidades=[];

        if(this.comboDepositos.view){
            for(var i=0; i < this.comboDepositos.view.store.data.items.length; i++) {
                if (this.comboDepositos.view.store.data.items[i].data.checked) {
                    _this.entidadesCheck.push(this.comboDepositos.view.store.data.items[i].data.iddeposito);
                }
                _this.entidades.push(_this.comboDepositos.view.store.data.items[i].data.iddeposito);
            }
            if(_this.entidadesCheck.length > 0){
                depositos = _this.entidadesCheck.join();
            }else{
                depositos = _this.entidades.join();
            }
        }else{
            for(var i=0; i < this.comboDepositos.store.data.items.length; i++) {
                _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
            }
            depositos = _this.entidades.join();
        }


        var criterioBusqueda = (this.getGridPrincipal().toolbars[0].items.items[1].getValue()) ? this.getGridPrincipal().toolbars[0].items.items[1].getValue() : null
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/ProductosMinimos',
                    name: 'ProductosMinimos',
                    isList:true,
                    params: {
                        arraydeposito: depositos,
                        criterio: criterioBusqueda,
                        minmax: 0,
                        idsubsistema: _this.storePrincipal.reader.jsonData.idsubsistema
                    }
                }
            ]
        });

        this.tipoReportes .view();
    }

});