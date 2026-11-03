Utilidades.Cmp.CmpTraspasarPlan = function () {


		var _this = this;


		this.BarraProgreso = new BarraEstado();

		/****
		 * Funcion para Traspasar planes filtro jjj
		 ***/
		this.TraspasarPlan = function (idplan_origen, title){
				_this.idplan_origen=idplan_origen;
				_this.title=title;
				_this.store_meses = new Ext.data.SimpleStore({
						fields: ['idmes', 'den'],
						data: [
								[1, 'Enero'],
								[2, 'Febrero'],
								[3, 'Marzo'],
								[4, 'Abril'],
								[5, 'Mayo'],
								[6, 'Junio'],
								[7, 'Julio'],
								[8, 'Agosto'],
								[9, 'Septiembre'],
								[10, 'Octubre'],
								[11, 'Noviembre'],
								[12, 'Diciembre']
						]
				});
				//  Store del combo de plan
				_this.store_seleccionar_plan=new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarplanesTraspasar',
						autoLoad: true,
						baseParams: {
								idplan_origen: _this.idplan_origen
						},
						reader: new Ext.data.JsonReader(
								{
										id: 'idelemento',
										root: "data"
								},
								[{
										name: 'idelemento'
								}, {
										name: 'denominacion'
								}])
				});
				//  Store del combo de cargar estado
				_this.store_seleccionar_estado=new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/cargarestados',
						autoLoad: true,
						reader: new Ext.data.JsonReader(
								{
										id: 'idestado',
										root: "data"
								},
								[{
										name: 'idestado'
								}, {
										name: 'denominacion'
								}])
				});

				var fechaactual = new Date();
				var annoactual = fechaactual.getFullYear();

				//campo para el anno del traspaso
				_this.ano = new Ext.form.TextField({
						id: 'ano_traspaso',
						fieldLabel: 'Año',
						name: 'ano_traspaso',
						maskRe :/^[0-9]*$/,
						regex: /^[0-9]{4}$/,
						maxLength:4,
						allowBlank:false,
						anchor: '60%',
						// labelStyle:'font-weight:bold;padding-right:0px;width:0px;',
						value:annoactual+1

				});

				// Checkbox Involucrados
				_this.chbox_tp_involucrados=new Ext.form.Checkbox({
						fieldLabel: '',
						boxLabel: 'Involucrados',
						labelSeparator: '',
						padding: '0 0 0 0',
						hideLabel:true,
						name: 'chbox_tp_involucrados',
						id: 'chbox_tp_involucrados'

				});

				// Checkbox Relaciones
				_this.chbox_tp_relaciones=new Ext.form.Checkbox({
						fieldLabel: '',
						boxLabel: 'Relaciones',
						labelSeparator: '',
						padding: '0 0 0 0',
						hideLabel:true,
						name: 'chbox_tp_relaciones',
						id: 'chbox_tp_relaciones'

				});

				// Checkbox Participantes/Dirigentes
				_this.chbox_tp_participantes=new Ext.form.Checkbox({
						fieldLabel: '',
						boxLabel: 'Participantes/Dirigentes',
						labelSeparator: '',
						hideLabel:true,
						padding: '0 0 0 0',
						name: 'chbox_tp_participantes',
						id: 'chbox_tp_participantes',
				});
				// Checkbox Documentos asociados
				_this.chbox_tp_doc_asociados=new Ext.form.Checkbox({
						fieldLabel: '',
						boxLabel: 'Documentos asociados',
						labelSeparator: '',
						padding: '0 0 0 0',
						hideLabel:true,
						name: 'chbox_tp_doc_asociados',
						id: 'chbox_tp_doc_asociados'
				});

				// Checkbox Repeticiones
				_this.chbox_tp_repeticiones=new Ext.form.Checkbox({
						fieldLabel: '',
						hideLabel:true,
						boxLabel: 'Repeticiones',
						labelSeparator: '',
						padding: '0 0 0 0',
						name: 'chbox_tp_repeticiones',
						id: 'chbox_tp_repeticiones'
				});

				// Radio Elementos propios
				_this.rd_tp_elem_propios=new Ext.form.Radio({
						fieldLabel: '',
						labelSeparator: '',
						boxLabel: 'Elementos propios',
						labelWidth:10,
						checked: false,
						padding: '0 0 0 0',
						hideLabel:true,
						name: 'rd_elemetos',
						id: 'rd_elem_propios',
						width:200,
						inputValue: 'elem_propios'
				});

				// Radio Todos los elementos
				_this.rd_tp_todos_los_elementos=new Ext.form.Radio({
						fieldLabel: '',
						labelSeparator: '',
						boxLabel: 'Todos los elementos',
						labelWidth:10,
						checked: false,
						hideLabel:true,
						padding: '0 0 0 0',
						name: 'rd_elemetos',
						id: 'rd_todos_los_elementos',
						width:200,
						inputValue: 'todos_los_elementos'
				});


				// Radio de seleccion por meses
				_this.rd_mes=new Ext.form.Radio({
						fieldLabel: '',
						labelSeparator: '',
						boxLabel: 'Mes',
						labelWidth:10,
						checked: false,
						hideLabel:true,
						name: 'rd_periodo',
						id: 'rd_mes',
						width:200,
						inputValue: 'mes',
						listeners:{
								check :function (rd, checked) {
										if(checked){
												_this.cb_seleccionar_mes.setDisabled(false);
												_this.f_traspaso_inicio.setDisabled(true);
												_this.f_traspaso_fin.setDisabled(true);
												_this.f_traspaso_inicio.setValue("");
												_this.f_traspaso_fin.setValue("");
										}
								}
						}
				});

				// Combo de seleccionar mes
				_this.cb_seleccionar_mes =new Ext.form.ComboBox({
						hiddenName:'',
						fieldLabel: 'Seleccionar mes',
						store:_this.store_meses,
						valueField:'idmes',
						displayField:'den',
						labelWidth:10,
						hideLabel:true,
						disabled:true,
						hiddenName: 'id',
						typeAhead: true,
						mode: 'local',
						forceSelection: true,
						triggerAction: 'all',
						id:'cb_seleccionar_mes',
						name:'cb_seleccionar_mes',
						emptyText:'Seleccionar',
						selectOnFocus:true,
						width:100
				});

				// Combo de seleccionar plan con tooltip
				_this.tooltipComboPlan;

				_this.idplan_destino =new Ext.form.ComboBox({
						hiddenName:'',
						fieldLabel: 'Plan',
						allowBlank:false,
						store:_this.store_seleccionar_plan,
						valueField:'idelemento',
						displayField:'denominacion',
						mode: 'remote',
						typeAhead: true,
						forceSelection: true,
						loadingText: 'Cargando datos...',
						editable:false,
						triggerAction: 'all',
						id:'idplan_destino',
						name:'idplan_destino',
						emptyText:'Seleccione...',
						selectOnFocus:true,
						anchor: '90%',
						listWidth:200,
						listeners: {
								select: function(c, r, i) {
										if(_this.tooltipComboPlan)
												_this.tooltipComboPlan.destroy();
										if(_this.idplan_destino.getValue() && _this.idplan_destino.getRawValue().length>20){
												_this.tooltipComboPlan=new Ext.ToolTip({
														target: c.getEl(),
														html: _this.idplan_destino.getRawValue()
												});
										}
								},
								expand: function (combo) {
										_this.store_seleccionar_plan.reload();
								}
						}
				});

				// Combo de seleccionar plan con tooltip
				_this.tooltipComboEstado;

				_this.cb_estados =new Ext.form.ComboBox({
						fieldLabel: 'Estado',
						store: _this.store_seleccionar_estado,
						valueField: 'idestado',
						displayField: 'denominacion',
						triggerAction: 'all',
						editable: false,
						allowBlank:false,
						editable:false,
						loadingText: 'Cargando datos...',
						forceSelection: true,
						mode: 'remote',
						listWidth:200,
						emptyText: 'Seleccione...',
						anchor: '90%',
						listeners: {
								select: function(c, r, i) {
										if(_this.tooltipComboEstado)
												_this.tooltipComboEstado.destroy();
										if(_this.cb_estados.getValue() && _this.cb_estados.getRawValue().length>20){
												_this.tooltipComboEstado=new Ext.ToolTip({
														target: c.getEl(),
														html: _this.cb_estados.getRawValue()
												});
										}
								},
								expand: function (combo) {
										_this.store_seleccionar_estado.reload();
								}
						}
				});

				// Radio de Rango de fechas
				_this.rd_rango_fechas=new Ext.form.Radio({
						xtype:'radio',
						fieldLabel: '',
						labelSeparator: '',
						width:290,
						labelWidth:200,
						hideLabel:true,
						boxLabel: 'Rango de fechas',
						// disabled:true,
						name: 'rd_periodo',
						id: 'rd_rango_fechas',
						inputValue: 'rango',
						listeners:{
								check :function (rd, checked) {
										if(checked){
												_this.cb_seleccionar_mes.setDisabled(true);
												_this.cb_seleccionar_mes.clearValue();
												_this.f_traspaso_inicio.setDisabled(false);
												_this.f_traspaso_fin.setDisabled(false);

										}
								}
						}
				});

				this.f_traspaso_inicio = new Ext.form.DateField({
						fieldLabel: 'Fecha de inicio',
						format: 'd/m/Y',
						name: 'f_traspaso_inicio',
						id: 'f_traspaso_inicio',
						//value: new Date().format('d/m/Y'),
						emptyText: 'Seleccione',
						endDateField: 'f_traspaso_fin',
						allowBlank: true,
						disabled:true,
						vtype: 'daterange',
						// anchor: '90%',
						width: 100,
						labelWidth:50,
						menuListeners: {
								select: function (df, date) {
										_this.f_traspaso_inicio.setValue(date);
								}
						}
				});
				this.f_traspaso_fin = new Ext.form.DateField({
						fieldLabel: 'Fecha de fin',
						disabled:true,
						format: 'd/m/Y',
						name: 'f_traspaso_fin',
						id: 'f_traspaso_fin',
						startDateField:'f_traspaso_inicio',
						//value: new Date().format('d/m/Y'),
						emptyText: 'Seleccione',
						vtype: 'daterange',
						// anchor: '90%',
						width: 100,
						labelWidth:50,
						menuListeners: {
								select: function (df, date) {
										_this.f_traspaso_fin.setValue(date);
								}
						}
				});



				// Form de traspaso plan
				_this.fpTraspasoPlan  = new Ext.FormPanel({
						border: false,
						frame:true,
						bodyBorder: false,
						bodyStyle: 'padding:0 0 0 0;',
						labelAlign: 'right',
						items: [
								{
										layout:'column',
										items:[{
												columnWidth: 0.33,
												labelAlign: 'top',
												layout: 'form',
												items: [_this.idplan_destino]
										},
												/*{
														columnWidth: 0.33,
														layout: 'form',
														labelAlign: 'top',
														items: [_this.cb_estados]
												},*/
												{
														columnWidth: 0.33,
														layout: 'form',
														labelAlign: 'top',
														items: [_this.ano]
												}]
								},
								{
										layout: 'column',
										border: false,
										defaults: {
												border: false
										},

										items: [
												{
														bodyStyle: 'padding-right:10px;',
														columnWidth: '.5',
														items:         {
																xtype:'fieldset',
																title: 'Mantener',
																autoHeight: true,
																hideLabel:true,
																labelWidth: 10,
																defaultType: 'checkbox',  // each item will be a checkbox
																items: [
																		_this.chbox_tp_involucrados,
																		_this.chbox_tp_relaciones,
																		_this.chbox_tp_participantes,
																		_this.chbox_tp_doc_asociados,
																		_this.chbox_tp_repeticiones,
																		_this.rd_tp_elem_propios,
																		_this.rd_tp_todos_los_elementos
																]
														}
												},
												{
														bodyStyle: 'padding:0 0 0 0;',
														columnWidth: '.5',
														items: {
																xtype:'fieldset',
																title: 'Per&iacute;odo a traspasar',
																height: 210,
																items: [
																		_this.rd_mes,
																		_this.cb_seleccionar_mes,
																		_this.rd_rango_fechas,
																		_this.f_traspaso_inicio,
																		_this.f_traspaso_fin
																]}
												}]}]});


				_this.btnCancelarTraspasarPlan = new Ext.Button({
						iconCls: 'cancelar',
						text: 'Cancelar',
						tooltip: 'Cerrar ventana sin guardar los datos',
						handler: function () {
								//		_this.fpTraspasoPlan.getForm().reset();
								_this.windowTraspasoPlan.destroy();
						}
				});

				_this.btnAceptarTrasladoPlan = new Ext.Button({
						iconCls: 'aceptar',
						text: 'Aceptar',
						tooltip: 'Guardar datos y cerrar ventana',
						handler: function () {
								_this.GuardarTraslado();
						}
				});

				;

				_this.windowTraspasoPlan = new Ext.Window({
						modal: true,
						closeAction: 'destroy',
						constrain: true,
						layout: 'fit',
						title: 'Traspasar plan ('+_this.title+")",
						width: 480,
						height: 350,
						resizable:false,
						items: [_this.fpTraspasoPlan],
						buttons: [_this.btnCancelarTraspasarPlan, _this.btnAceptarTrasladoPlan]
				});
				_this.windowTraspasoPlan.show();

		}


		this.GuardarTraslado = function () {
				var waitMsg = 'Guardando traspaso del plan';
				var url = 'Trasladarplan';
				_this.BarraProgreso.show(waitMsg);
				_this.datos_fin = _this.fpTraspasoPlan.getForm().getValues();
				var informacion= [];
				informacion.push({
						'idplan_origen':_this.idplan_origen,
						'idplan_destino':_this.idplan_destino.getValue(),
						//'estado':_this.cb_estados.getValue(),
						'ano':_this.ano.getValue(),
						'involucrados':(_this.chbox_tp_involucrados.getValue())?1:0,
						'relaciones':(_this.chbox_tp_relaciones.getValue())?1:0,
						'participantes':(_this.chbox_tp_participantes.getValue())?1:0,
						'doc_asociados':(_this.chbox_tp_doc_asociados.getValue())?1:0,
						'repeticiones':(_this.chbox_tp_repeticiones.getValue())?1:0,
						'elem_propios':(_this.rd_tp_elem_propios.getValue())?1:0,
						'todos_los_elementos':(_this.rd_tp_todos_los_elementos.getValue())?1:0,
						'mes': (_this.cb_seleccionar_mes.getValue())?_this.cb_seleccionar_mes.getValue():0,
						'f_traspaso_inicio':_this.f_traspaso_inicio.getRawValue(),
						'f_traspaso_fin':_this.f_traspaso_fin.getRawValue()
				});
				_this.fpTraspasoPlan.getForm().submit({
						url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/' + url,
						params: {
								datos: Ext.encode(informacion)
						},
						failure: function (form, action) {
								_this.BarraProgreso.hide();
								if (action.result.mensaje == 1) {
										mostrarMensaje(1, action.result.msgText);
										_this.windowTraspasoPlan.destroy();
								}

						}
				});
		}

}