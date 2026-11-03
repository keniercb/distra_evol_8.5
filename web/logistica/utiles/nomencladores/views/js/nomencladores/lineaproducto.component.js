Ext.ns('Ext.erp');

Ext.erp.lineaproducto = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function(config) {
		var _this = this;
        Ext.apply(this, config);
		this.campoIdNomenclador = 'idlineaproducto';
        /*this.storeFields = [{
			name : 'productoterminado'
		},{
			name : 'lineamuestreable'
		},{
			name : 'hdlineamuestreable'
		},{
			name : 'idhdproductoterminado'
		}];

		this.columnsFields = [{
			dataIndex : 'productoterminado',
			header : _this.idioma.lbProductoTerminado,
			width : 70,
			renderer: function (value, metaData) {
				if (value == 1) {
					metaData.css = 'activo';
				} else {
					metaData.css = 'inactivo';
				}
			}
		},{
			dataIndex : 'lineamuestreable',
			header : _this.idioma.lbMuestreable,
			width : 70,
			renderer: function (value, metaData) {
				if (value == 1) {
					metaData.css = 'activo';
				} else {
					metaData.css = 'inactivo';
				}
			}
		}];
        
		this.formFields = [{			
			layout  : 'column',
			items: [{
					columnWidth : .5,
					items : [{
						xtype : 'checkbox',
						boxLabel : _this.idioma.lbMuestreable,
						name : 'lineamuestreable',
						hideLabel: true,
						listeners : {
							'check' : function(_checkbox, checked){
                                _checkbox.setRawValue(checked == true ? 1 : 0);
							}
						}
					}]
				},{
					columnWidth : .5,
					items : [{
						xtype : 'checkbox',
						boxLabel : _this.idioma.lbProductoTerminado,
						name : 'productoterminado',
						hideLabel: true,
						listeners : {
							'check' : function(_checkbox, checked){
                                _checkbox.setRawValue(checked == true ? 1 : 0);
							}
						}
					}]
				}]
		}]*/
        Ext.erp.tipocalidad.superclass.constructor.call(this, config);
    }
});
