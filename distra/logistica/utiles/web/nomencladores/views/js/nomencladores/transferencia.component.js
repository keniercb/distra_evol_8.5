Ext.ns('Ext.erp');

Ext.erp.transferencia = Ext.extend(Ext.erp.gridPanelNomenclador, {
	/**
	 *
	 **/
    constructor: function(config) {
    	var _this = this;
        Ext.apply(this, config);
        this.campoIdNomenclador =  'idtipotransferencia';
        this.bussinesModel = 'NomTipotransferenciaModel';
        this.relacionador = new Ext.erp.relacionador({
            height: 200,
            modeloIzq:'NomTipoarea',
            idIzq:'idnomtipoarea',
            valorCampo : 0,
            campoIdNomenclador : _this.campoIdNomenclador,
            modeloDer:'NomTipotransferenciaarea',
            idDer:'idtipotransferencia',
            tituloIzq:'Tipos de &aacute;reas',
            tituloDer:'Tipos de &aacute;reas asociadas'
        });
        
		this.formFields = [ this.relacionador

		    ];

        Ext.erp.transferencia.superclass.constructor.call(this, config);
    },

    onBtnAdicionarClick : function (id) {
        var _this = this;
        Ext.erp.transferencia.superclass.onBtnAdicionarClick.call(this,id);

		this.fpGestionarNomenclador.setWidth(996);
		this.winGestionarNomenclador.center();

		this.fpGestionarNomenclador.doLayout();

        if(Ext.getCmp('hd' + this.campoIdNomenclador).getValue() > 0){
            this.relacionador.setValorCampo(Ext.getCmp('hd' + this.campoIdNomenclador).getValue());
            this.relacionador.loadDatos();
        }else{
            this.relacionador.stGridDerecho.removeAll();
            this.relacionador.adicionados = new Array();
            this.relacionador.eliminados = new Array();
        }
        this.relacionador.onStIzqBeforeLoad();

        _this.fpGestionarNomenclador.fireEvent = _this.fpGestionarNomenclador.fireEvent.createSequence(function(e, obj) {
            if (e == 'clientvalidation') {
               if (_this.relacionador.adicionados.length > 0 || _this.relacionador.eliminados.length > 0) {
                  _this.btnAceptar.enable();
                  _this.btnAplicar.enable();
               }
            }
        });
	},

    onBtnAceptarClick : function(modificar, _fn) {
        var _this = this;
		this.fpGestionarNomenclador.getForm().on({
			'beforeaction' : function() {
				if(_this.relacionador.getTotalCount() < 2){
					mostrarMensaje(3, _this.idioma.lbMsgSeleccionarAreas);
					return false;
				}
				_this.fpGestionarNomenclador.getForm().baseParams = {
						adicionados : _this.relacionador.adicionados.join(','),
						eliminados : _this.relacionador.eliminados.join(',')
				}
				return true;
			},
			'actioncomplete' : function(fp, action){
				if(action.result.success == true){
					Ext.getCmp('hd' + _this.campoIdNomenclador).setValue(null);
					_this.relacionador.adicionados = new Array();
					_this.relacionador.eliminados = new Array();
                    _this.relacionador.loadDatos();

				}
			}
		});

		Ext.erp.transferencia.superclass.onBtnAceptarClick.call(this, modificar, _fn);
	}/*,
    onBtnModificarClick: function () {
        var _this = this;
        this.modificar = true;
        Ext.erp.transferencia.superclass.onBtnModificarClick.call(this);

        _this.fpGestionarNomenclador.fireEvent = _this.fpGestionarNomenclador.fireEvent.createSequence(function(e, obj) {
            if (e == 'clientvalidation') {
                if (_this.relacionador.adicionados.length > 0 || _this.relacionador.eliminados.length > 0 || _this.relacionador.getTotalCount() == 0) {
                    _this.btnAceptar.enable();
                } else {
                    _this.btnAceptar.disable();
                }
            }
        });
    }*/
});