/**
 * Created by Tony on 24/10/2014.
 */
Ext.ns('Ext.erp');
Ext.erp.cuentasuministrador = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function(config) {
        var _this = this;
        config.codigo = false;
        this.bussinesModel = 'NomCuentasuministradorModel';
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idcuentasuministrador';
        this.storeFields = [{
            name: 'codigoiso'
        }, {
            name: 'idmoneda'
        }];
        this.columnsFields = [{
            dataIndex: 'codigoiso',
            header: _this.idioma.lbMoneda,
            width: 95
        }, {
            dataIndex: 'idmoneda',
            hidden: true
        }];
        Ext.erp.cuentasuministrador.superclass.constructor.call(this, config);
    },
    initFormFields: function(){
        var _this = this;
        this.cmbMoneda = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbMoneda,
            url: '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion/cargarTipoMonedas',
            hiddenName: 'codigoiso',
            valueField: 'codigoiso',
            displayField: 'codigoiso',
            anchor: '98%',
            emptyText: _this.idioma.cbEmtyText,
            listeners : {
                select: function(cmb, rd){
                    Ext.getCmp('idhdmoneda').setValue(rd.json.idmoneda);
                }
            }
        });
        this.formFields = [this.cmbMoneda,{
            xtype : 'hidden',
            name : 'idmoneda',
            id : 'idhdmoneda'
        }];
    }
});