Ext.ns('Ext.erp');

Ext.erp.concepto = Ext.extend(Ext.erp.gridPanelNomenclador, {
	/**
	 *
	 **/
    constructor: function(config) {
    	config.codigo = false;
        var _this = this;
        Ext.apply(this, config);
        this.bussinesModel = 'NomConceptoModel';
        this.campoIdNomenclador = 'idnomconcepto';

        this.storeFields = [{
            name: 'iddoc'
        }, {
            name: 'denominacion'
        }, {
            name: 'idnomoperaciones'
        }, {
            name: 'denomtipodoc'
        }, {
            name: 'denomoperaciones'
        }];

        this.columnsFields = [{
            dataIndex: 'denomtipodoc',
            header: this.idioma.lbCmTipoDoc,
            width: 150
        },{
            dataIndex: 'denomoperaciones',
            header: this.idioma.lbCmOperacion,
            width: 150
        }];
		
        Ext.erp.concepto.superclass.constructor.call(this, config);
    },
    initFormFields: function(){
        var _this = this;
        this.comboTipoDoc = new LOG.util.ComboBox({
            url: '/logistica/utiles/nomencladores/index.php/concepto/cargarTipoDocumento',
            fieldLabel: this.idioma.lbCmbTipoDoc,
            displayField: 'denomtipodoc',
            name: 'denomtipodoc',
            valueField: 'iddoc',
            allowBlank: false,
            autoLoad:true,
            editable: false,
            anchor: '80%',
            listeners : {
                select: function(cmb, rd){
                    _this.idsubsistema = rd.store.reader.jsonData.idsubsistema;
                    if (_this.idsubsistema != 10) {
                        _this.comboOperacionesCont.disable();
                        _this.comboOperacionesCont.clearValue();
                    } else {
                        _this.comboOperacionesCont.enable();
                        _this.comboOperacionesCont.clearValue();
                        _this.comboOperacionesCont.getStore().load({
                            params: {
                                iddoc : rd.json.iddoc
                            }
                        });
                    }
                    Ext.getCmp('idhddenomtipodoc').setValue(this.getValue());
                }
            }
        });

        this.comboOperacionesCont = new LOG.util.ComboBox({
            url: '/logistica/utiles/nomencladores/index.php/concepto/cargarOperaciones',
            fieldLabel: this.idioma.lbCmOperacion,
            displayField: 'denomoperaciones',
            name: 'denomoperaciones',
            valueField: 'idnomoperaciones',
            allowBlank: false,
            autoLoad:false,
            editable: false,
            disabled: true,
            anchor: '80%',
            listeners : {
                select: function(cmb, rd){
                    Ext.getCmp('idhdnomoperaciones').setValue(this.getValue());
                }
            }
        });

        this.formFields = [this.comboTipoDoc,{
            xtype : 'hidden',
            name : 'iddoc',
            id : 'idhddenomtipodoc'
        }, this.comboOperacionesCont,{
            xtype : 'hidden',
            name : 'idnomoperaciones',
            id : 'idhdnomoperaciones'
        }];
    }
});
