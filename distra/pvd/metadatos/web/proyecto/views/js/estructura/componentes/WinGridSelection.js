
Ext.ns('Win.Selection');
Win.Selection.Grid = Ext.extend(Ext.Window, {
	title                 : '',
	etiquetas             : etiquetas.estructura,
	foco                  : null,
	idComponenteForText   : null,
	idComponenteForId     : null,
	idComponenteForIdGrupo: null,
	fireOnSelect          : false,
	initComponent         : function ()
	{
		var _this = this;
		_this.selectionModel = new Ext.grid.RowSelectionModel({
			singleSelect: true, listeners: {
				rowselect: function ()
				{
					if (_this.fireOnSelect) {
						_this.btnAceptar.handler.call();
					}
				}
			}
		});
		_this.btnBuscar = new Ext.Button({
			//						icon    : perfil.dirImg + 'buscar.png',
			text    : etiquetas.estructura.lbBuscar,
			iconCls : 'buscar',
			id      : "btn_BuscarCC",
			disabled: true,
			tooltip : "<u>B</u>uscar cargos <b>(Alt+B)</b>",
			handler : function ()
			{
				_this.buscar();
			}
		});
		_this.btnLimpiar = new Ext.Button({
			tooltip : etiquetas.estructura.lbLimpiarToolTips,
			text    : etiquetas.estructura.lbLimpiar,
			id      : 'btnAllCC',
			disabled: true, //						icon   : perfil.dirImg + 'limpiar.png',
			iconCls : 'limpiar',
			handler : function ()
			{
				Ext.getCmp('filtroDenominacion' + _this.name).setValue('');
				_this.store.reload({params: {start: 0, limit: 10}});
			}
		});
		_this.filtroBuscar = new Ext.form.TextField({
			name           : 'denominacion',
			id             : 'filtroDenominacion' + _this.name,
			vtype          : 'vtalfanumerico',
			maxLength      : 100,
			enableKeyEvents: true,
			emptyText      : etiquetas.estructura.lbcriterio,
			fieldLabel     : etiquetas.estructura.lbdenominacion,
			anchor         : '85%',
			allowBlank     : true,
			listeners      : {
				'keyup': function (_tx, state)
				{
					if (_tx.getValue() != "" && _tx.isValid()) {
						_this.btnBuscar.enable();
						_this.btnLimpiar.enable();
					} else {
						_this.btnBuscar.disable();
						_this.btnLimpiar.disable();
					}
				}
			}
		});
		_this.gp = new Ext.grid.GridPanel({
			store  : _this.store,
			columns: _this.columns,
			sm     : _this.selectionModel,
			frame  : true,
			tbar   : [_this.filtroBuscar, _this.btnBuscar, _this.btnLimpiar],
			bbar   : new Ext.PagingToolbar({
				pageSize: 10, store: _this.store, displayInfo: true
			})
		});
		_this.btnAceptar = new Ext.Button({
			text    : _this.etiquetas.lbBtnAceptar,
			iconCls : 'aceptar',
			disabled: true,
			tooltip : _this.etiquetas.lbtooltipaceptar,
			handler : function ()
			{
				_this.clickSelection(_this.selectionModel.getSelected());
			}
		});
		Ext.apply(this, {
			width       : 580,
			height      : 380,
			layout      : 'fit',
			modal       : true,
			autoValidate: true,
			constrain   : true,
			resizable   : false,
			items       : [_this.gp],
			buttons     : [{
				text   : _this.etiquetas.lbBtnCancelar,
				iconCls: 'cancelar',
				tooltip: etiquetas.lbtooltipcancelar,
				handler: function ()
				{
					_this.destroy();
				}
			}],
			keys        : [{
				key: Ext.EventObject.ENTER, fn: function ()
				{
					_this.buscar();
				}
			}, {
				key: 'b', alt: true, fn: function ()
				{
					_this.buscar();
				}
			}, {
				key: 'l', alt: true, fn: function ()
				{
					_this.btnLimpiar.handler.call();
				}
			}]
		})
		_this.store.load({params: {start: 0, limit: 10}});
		Win.Selection.Grid.superclass.initComponent.apply(this)
	},
	clickSelection        : function (record)
	{
		var _this = this;
		if (record.data.id != 0) {
			Ext.getCmp(_this.idComponenteForText).setValue(record.data.denominacion)
			Ext.getCmp(_this.idComponenteForId).setValue(record.data.id);
			_this.foco.focus(false, 10);
			var grupos = record.data.idgrupocomplejidad;
			var condicion = record.data.idcondicion;
			condicion = (condicion) ? ',' + condicion : '';
			Ext.getCmp(_this.idComponenteForIdGrupo).setValue(grupos + condicion);
			_this.destroy();
		} else {
			mostrarMensaje(3, _this.etiquetas.lbMsgDebeSeleccionarValor)
		}
	},


	buscar                : function () {

		var _this = this;
		var valorFiltroDenom = _this.filtroBuscar.getValue();
		if (valorFiltroDenom != "") {

			_this.store.reload({
					params: {
						start       : 0,
						limit       : 10,
						denominacion: valorFiltroDenom
					},


					callback: function (a) {
						if (a.length == 0) {
							mostrarMensaje(1, _this.etiquetas.lbMsgeBusquedaSinDatos);
							_this.filtroBuscar.focus(false, 10);
						} else {
							_this.filtroBuscar.focus(false, 10);
						}
					}
				},
				_this.store.on('beforeload', function (th, params) {
					var limit = params.params.limit;
					var start = params.params.start;
					var denom = _this.filtroBuscar.getValue();

					params.params = {
						start       : start,
						limit       : limit,
						denominacion: denom
					}
				})
			);
		}
	}

})
