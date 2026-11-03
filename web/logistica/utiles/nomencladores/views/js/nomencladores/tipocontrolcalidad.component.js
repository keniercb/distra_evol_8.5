Ext.ns('Ext.erp');

Ext.erp.tipocontrolcalidad = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function(config) {
        config.codigo = false;
        var _this = this;
        this.campoIdNomenclador = 'idtipocontrolcalidad';
        Ext.apply(this, config);
        this.bussinesModel = 'NomTipoControlCalidadModel';
        this.storeFields = [{
            name: 'idunidadmedida'
        }, {
            name: 'umedida'
        }];

        this.columnsFields = [{
            dataIndex: 'umedida',
            header: 'UM',
            width: 60/*,
            renderer: function(value, metaData) {
                if (value == '+') {
                    return 'Suma';
                } else {
                    return 'Resta';
                }
            }*/
        }];

        Ext.erp.tipocontrolcalidad.superclass.constructor.call(this, config);
    },
    initFormFields: function(){
        var _this = this;
        this.comboUM = new LOG.util.ComboBox({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarComboUM',
            valueField: 'abreviaturaunidadmedida',
            hiddenName: 'abreviaturaunidadmedida',
            selectOnlyLeaf: true,
            //id: this.idCmp + '_um',
            displayField: 'abreviaturaunidadmedida',
            fieldLabel: 'Unidad de medida',
            allowBlank: false,
            anchor: '100%',
            autoLoad:true,
            listeners : {
                select: function(cmb, rd){
                    Ext.getCmp('idhdunidadmedida').setValue(rd.json.idunidadmedida);
                }
            }
        });
        this.formFields = [this.comboUM,{
            xtype : 'hidden',
            name : 'idunidadmedida',
            id : 'idhdunidadmedida'
        }];

        /*this.comboUM.getStore().on({
            /*beforeload: function() {
                _this.comboUM.reset();
                _this.comboUM.getStore().removeAll();
                /*if (_this.getSmPrincipal().hasSelection()) {
                    this.baseParams.idindicador = _this.getSmPrincipal().getSelected().data.idindicador;
                }*!/
            },*!/
            load: function() {
                /*console.info(_this.selectionModeNomenclador.selections.items[0].data.umedida)
                if (_this.selectionModeNomenclador.selections.items[0].data.umedida) {
                    _this.comboUM.setRawValue(_this.selectionModeNomenclador.selections.items[0].data.umedida);
                }*!/
                _this.comboUM.fireEvent('select');
            }
        });*/
    }
});
