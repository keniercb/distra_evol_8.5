function eventoProyecto(accion, btnPresionado, textoNomenclador, clase, idProyecto, store, foco, fn)
{
		var texto = "Eliminando";
		if (accion == 'desactivar') {
				texto = "Desactivando";
		} else {
				if (accion == 'activar') {
						texto = "Activando";
				} else {
						if (accion == 'aprobar') {
								texto = "Aprobando";
						} else {
								if (accion == 'cancelar') {
										texto = "Cancelando";
								}
						}
				}
		}
		if (btnPresionado == 'ok') {
				Secodena.mostrarMascara('cargaini', "Por favor espere...", texto + ' datos ' + textoNomenclador + ".");
				var param = new Array();
				param.push(idProyecto);
				Ext.Ajax.request({
						url     : 'gestionarAcciones',
						params  : {
								clase     : clase,
								accion    : accion,
								parametros: Ext.encode(param)
						},
						callback: function (options, success, response)
						{
								Secodena.ocultarMascara('cargaini');
								var responseData = Ext.decode(response.responseText);
								if (responseData.codMsg == 1) {
										mostrarMensaje(responseData.codMsg,responseData.mensaje)
										var options = store.lastOptions;
										var start = options.params.start;
										if (accion == 'eliminar') {
												if ((start) >= (store.totalLength - 1)) {
														var div = Math.floor((store.totalLength - 1) / 18);
														start = 18 * (div - 1);
												}
										}
										if (fn) {
												fn();
										} else {
												store.load({params: {start: start, limit: 18}});
										}
								} else {
										if (responseData.codMsg != 6) {
												mostrarMensaje(responseData.codMsg, responseData.mensaje, function ()
												{
														Ext.getCmp(foco).focus(false, 10);
												})
										}
								}
						}
				})
		}
}
function eventoFusionarProyecto(btnPresionado, store, arrayIdProyecto, foco, fn)
{
		if (btnPresionado == 'ok') {
				Secodena.mostrarMascara('cargaini', "Por favor espere... fusionando los proyectos seleccionados.");
				Ext.Ajax.request({
						url     : 'gestionarAcciones',
						params  : {
								clase     : 'proyecto',
								accion    : 'fusionar',
								parametros: Ext.encode(arrayIdProyecto)
						},
						callback: function (options, success, response)
						{
								Secodena.ocultarMascara('cargaini');
								var responseData = Ext.decode(response.responseText);
								if (responseData.codMsg == 1) {
										var options = store.lastOptions;
										var start = options.params.start;
										if (fn) {
												fn();
										} else {
												store.load({params: {start: start, limit: 18}});
										}
										mostrarMensaje(responseData.codMsg, responseData.mensaje)
								} else {
										if (responseData.codMsg!= 6) {
												mostrarMensaje(responseData.codMsg, responseData.mensaje, function ()
												{
														Ext.getCmp(foco).focus(false, 10);
												})
										}
								}
						}
				})
		}
}
function beforeLoadProyecto(param, idFiltroDenom, formFiltro, clase)
{
		Secodena.mostrarMascara('cargaini', '', "Cargando...");
		var limit = param.params.limit;
		var start = param.params.start;
		var parametros = Ext.decode(param.params.parametros);
		if (parametros == undefined) {
				var denominacion = Ext.getCmp(idFiltroDenom).getValue();
				if (denominacion != undefined) {
						var form = formFiltro.getForm();
						if (form.isValid()) {
								parametros = new Array();
								parametros.push(id);
								parametros.push(form.getValues());
						}
				}
		}
		param.params = {
				start     : start,
				limit     : limit,
				clase     : clase,
				parametros: Ext.encode(parametros)
		}
		return param;
}