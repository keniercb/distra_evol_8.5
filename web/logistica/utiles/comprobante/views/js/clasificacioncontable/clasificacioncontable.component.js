/**
 * Created by W-01223 on 23/01/15.
 */
Ext.ns('Ext.erp');

Ext.erp.clasificacioncontable = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function(config) {
        var _this = this;
        this.bussinesModel = 'NomClasificacioncontableModel';
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idclasificacioncontable';

        this.storeFields = [{
                name: 'idcuenta'
            }, {
                name: 'cuenta'
            },{
                name: 'idcuentaalt'
            }, {
                name: 'cuentaalt'
            },{
                name: 'idcuentaconv'
            },{
            name: 'cuentaconv'
            }];
        this.columnsFields = [{
                dataIndex: 'cuenta',
                header: _this.idioma.lbCuenta,
                width: 260
            },{
                dataIndex: 'cuentaalt',
                header: _this.idioma.lbCuentaAlt,
                width: 260
            },{
                dataIndex: 'cuentaconv',
                header: _this.idioma.lbCuentaConv,
                width: 260
            }];
        Ext.erp.clasificacioncontable.superclass.constructor.call(this, config);
    },
	
    initFormFields: function() {
        var _this = this;
         this.formFields = [new LOG.util.TreeCombo({
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCuentas',
                name: 'cuenta',
                valueField: 'cuenta',
                anchor : '99%',
                selectOnlyLeaf: false,
                fieldLabel: _this.idioma.lbCuenta,
                //allowBlank: false,
                selectFn : function(){
                    Ext.getCmp('idhdcuenta').setValue(this.getValue());
                }
            }),{
                xtype : 'hidden',
                name : 'idcuenta',
                id : 'idhdcuenta'
            },new LOG.util.TreeCombo({
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCuentas',                
                name: 'cuentaalt',
                valueField: 'cuenta',
                anchor : '99%',
                selectOnlyLeaf: false,
                fieldLabel: _this.idioma.lbCuentaAlt,
               // allowBlank: false,
                selectFn : function(){
                    Ext.getCmp('idhdcuentaalt').setValue(this.getValue());
                }
            }),{
                xtype : 'hidden',
                name : 'idcuentaalt',
                id : 'idhdcuentaalt'
            }
        //     ,new LOG.util.TreeCombo({
        //      url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCuentas',
        //      name: 'cuentaconv',
        //      valueField: 'cuenta',
        //      anchor : '99%',
        //      selectOnlyLeaf: false,
        //      fieldLabel: _this.idioma.lbCuentaConv,
        //      // allowBlank: false,
        //      selectFn : function(){
        //          Ext.getCmp('idhdcuentaconv').setValue(this.getValue());
        //      }
        //  }),{
        //      xtype : 'hidden',
        //      name : 'idcuentaconv',
        //      id : 'idhdcuentaconv'
        //     }
        ];
        
    }
});
