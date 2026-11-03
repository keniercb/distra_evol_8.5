Ext.ns('Ext.erp');

Ext.erp.nomcuadreproceso = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
     idproducto: undefined,
    constructor: function (config) {
        var _this = this;
        this.bussinesModel = 'NomCuadreProcesoModel';
        this.campoIdNomenclador = 'idcuadreproceso';
        config.codigo = false;
        config.usarFecha = true; 

        this.storeFields = [{
            name: 'idcuenta'
        }, {
            name: 'cuenta'
        }];
        
        this.columnsFields = [{
            dataIndex: 'cuenta',
            header:'Cuenta contable',
            width: 260
        }];
    
        Ext.erp.nomcuadreproceso.superclass.constructor.call(this, config);
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
            }
            
        ];
        
    }
});
