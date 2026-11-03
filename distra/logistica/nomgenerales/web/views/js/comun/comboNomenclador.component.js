Ext.ns('Ext.erp');
Ext.erp.comboNomenclador = Ext.extend(Ext.form.ComboBox, {
    controller: '',
    modelo: '',
    idnom: '',
    name: undefined,
    bussines: '',
    campoValor: 'denominacion',
    dependsOf: null,
    autoCargar: null,
    forceSelection: true,
    constructor: function(config) {
        Ext.apply(this, config);
        Ext.erp.comboNomenclador.superclass.constructor.call(this, config);
        this.addEvents({
            'valuechange' : true
        });
    },
    setValue : Ext.form.ComboBox.prototype.setValue.createInterceptor(function (value) {
        if(this.isXType('combo', false))
            this.fireEvent('valuechange',value);
    }),
    initComponent: function() {
        var _this = this;
        this.stCombo = new Ext.data.Store({
            url: _this.controller + 'cargarnomencladorentidad',
            autoLoad: (_this.autoCargar == null) ? false : true,
            baseParams: {
                modelo: _this.modelo,
                idnom: _this.idnom,
                bussines: _this.bussines
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: _this.idnom
            },
            [
                {name: _this.idnom},
                {name: _this.campoValor}
            ])
        });

        Ext.apply(this, {
            store: _this.stCombo,
            //id : 'idcb_'+ _this.idnom,
            displayField: _this.campoValor,
            valueField: _this.idnom,
            hiddenName: _this.hiddenName|| _this.idnom,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: true
        });
        this.mon(this, {
            render: function() {
                _this.configureDependence();
            }
        })
        Ext.erp.comboNomenclador.superclass.initComponent.call(this);
    },
    getIdNomenclador: function() {
        return this.idnom;
    },
    getStore: function() {
        return this.store;
    },
    isEnabled: function() {
        return !this.disabled;
    },
    getDependence: function() {
        return this.dependsOf;
    },
    getDataModel: function() {
        return this.modelo;
    },
    configureDependence: function() {
        var _this = this;
        if (null != _this.getDependence()) {
            _this.disable();
            _this.getDependence().mon(_this.getDependence(), {
                change: function() {
                    if (!_this.isEnabled()) {
                        _this.enable();
                    }
                    _this.getStore().reload({
                        params: {
                            iddependence: _this.getDependence().getIdNomenclador(),
                            value: _this.getDependence().getValue()
                        }
                    })
                }
            })
        }
        return;
    }
});
Ext.ComponentMgr.registerType('combonomenclador', Ext.erp.comboNomenclador);
