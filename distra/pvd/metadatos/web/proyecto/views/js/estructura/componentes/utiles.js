var st_Nomenclador;
function WinFnTreeDPA()
{
		var dpaWin = new Ext.secodena.comun.window.winSelectDPA({
				nodo     : new DPA(),
				rootNodo : {
						id  : 0,
						text: 'Cuba'
				},
				sinTitulo: true,
				selPais  : true,
				id       : 'dptWin'
		});
		dpaWin.show();
		dpaWin.on('dameseleccion', function (win, obj)
		{
				if (obj) {
						Ext.getCmp('iddpt').setValue(obj.get('iddpt'));
						Ext.getCmp('ubicaciondpt').setValue(obj.get('denominacion'));
						win.destroy();
				}
		}.createDelegate(this));
}
function ValidarEspacios(t, e)
{
		cont = t.getValue().length;
		if (e.getKey() == 32 && cont == 1) {
				t.reset();
		} else {
				if (e.getKey() != 32) {
						cont = t.getValue().length;
						value = t.getValue();
						cant_e = 0;
				} else {
						if (e.getKey() == 32 && cont != 0 && cant_e == 0) {
								value = t.getValue();
								cant_e++;
						} else {
								if (e.getKey() == 32 && cont != 0 && cant_e == 1) {
										40
										cant_e = 1;
										t.setValue(value);
								}
						}
				}
		}
}
function MostrarNomencladorRemoto(titulo, objetonomenclador, idcodigo, iddenominacion, nombrecodigo, nombredenominacion, fn)
{
		var obj = objetonomenclador;
		var sm = new Ext.grid.RowSelectionModel({
				singleSelect: true,
				listeners   : {
						rowselect: On_RowClick
				}
		});

		function On_RowClick(sm, indiceFila, record)
		{
				var denom = record.get(nombrecodigo);
				var idcat = record.get(nombredenominacion);
				var textfieldNom = Ext.getCmp(idcodigo);
				var idtextfieldNom = Ext.getCmp(iddenominacion);
				var denom1;
				if (titulo == "Cargo Militar") {
						denom1 = convertCodcargos(denom);
				} else {
						if (titulo == 'Hom&oacute;logo Terrestre' || titulo == 'Anterior' || titulo == 'Grado Militar') {
								denom1 = convertCodgrado(denom);
						} else {
								if (titulo == 'Material de Guerra') {
										denom1 = convertCodtecnica(denom);
								} else {
										denom1 = convertCod(denom);
								}
						}
				}
				textfieldNom.setValue(denom1);
				idtextfieldNom.setValue(idcat);
				windowNom.close();
				if (fn) {
						fn();
				}
		}

		var store = CrearStore(obj.referencia, obj.rc);
		var filts = obj.fl_filters, i;
		for (i = 0; i < filts.filters.items.length; i++) {
				if (filts.filters.items[i].dataIndex == "actual" || filts.filters.items[i].dataIndex == "visible") {
						filts.filters.items[i].active = true;
						filts.filters.map[filts.filters.items[i].dataIndex].menu.items.items[0].checked = true;
						filts.filters.map[filts.filters.items[i].dataIndex].menu.items.items[1].checked = false;
				}
		}
		var grid = creargridNom(titulo, store, obj.cm, filts, sm);
		windowNom = new Ext.Window({
				title    : titulo,
				layout   : 'fit',
				bodyStyle: 'padding:5px;',
				modal    : true,
				width    : 600,
				height   : 400,
				items    : [grid]

		});
		windowNom.show(this);
		grid.getStore().load({
				params: {
						limit: 20,
						start: 0
				}
		});
}
function buscardenominacionNomenclador(etiqueta, urlB, idbusqueda, idresultado)
{
		var denom = Ext.getCmp(idbusqueda).getValue();
		denom1 = eliminarceros(denom)
		if (denom1 !== '') {
				Ext.Ajax.request({
						url     : urlB,
						params  : {
								id: denom1
						},
						callback: function (options, success, response)
						{
								responseData = Ext.decode(response.responseText);
								if (responseData.codMsg != 3) {
										Ext.getCmp(idresultado).setValue(responseData.dato);
								} else {
										mostrarMensaje(3, 'No existe ' + etiqueta + ' con ese código o no es actual.');
										Ext.getCmp(idbusqueda).setValue("");
										Ext.getCmp(idresultado).setValue("");
								}
						}
				});
		} else {
				Ext.getCmp(idresultado).setValue("");
		}
}
function crearToolTip(v, m)
{
		m.attr = 'ext:qtip="' + v + '"';
		return v;
}
function crearDenominacionImagen(v, m)
{
		m.attr = 'ext:qtip="' + v + '"';
		return v;
}
function changeValor(val)
{
		if (val == "0" || val == "" || val == null || val == " " || val == "null" || val == false) {
				return "<img src='/metadatos/comun/recursos/iconos/no.png'/>";
		} else {
				if (val == "1") {
						return "<img src='/metadatos/comun/recursos/iconos/yes.png'/>";
				}
		}
		return val;
};
function changeValorIcono(val)
{
		if (val == "0" || val == "" || val == null || val == " " || val == "null" || val == false) {
				return "";
		} else {
				if (val == "1") {
						return "<img src='/metadatos/comun/recursos/iconos/yes.png'/>";
				}
		}
		return val;
};
function changeImagen(val)
{
		return "<img  class='icono' url='" + val + "' src='" + val + "' width='40' height='30' />";
};
function changeGrado(val)
{
		return "<center><img class='grado' url='" + val + "' src='" + val + "' width='40' height='20' />";
};
function changeValorE(val)
{
		if (val == true) {
				return 'Externa'
		} else {
				return 'Interna';
		}
};
function changeValorModulo(val)
{
		if (val == "0" || val == "" || val == null || val == " " || val == "null" || val == false) {
				return perfil.etiquetas.lbcompleto;
		} else {
				if (val == "1") {
						return perfil.etiquetas.lbModulo;
				}
		}
		return val;
};
function CrearStore(referencia, r_c)
{
		var st_Nomenclador = new Ext.data.Store({
				// autoLoad:true,
				url       : "mostrar" + referencia,
				remoteSort: true,
				reader    : new Ext.data.JsonReader({
						root         : 'datos',
						id           : "id" + referencia,
						totalProperty: 'cant'
				}, r_c)

		});
		return st_Nomenclador;
};
function creargridNom(text, storeN, clumns, filters, smG)
{
		var gd_Nomenclador = new Ext.grid.GridPanel({
				frame           : true,
				id              : 'Nomenclador',
				iconCls         : 'icon-grid',
				enableColLock   : false,
				plugins         : filters,
				autoExpandColumn: 'expandir',
				store           : storeN,
				sm              : smG,
				// viewConfig :{forceFit :true},
				loadMask        : {
						msg: perfil.etiquetas.lbMsgCargando
				},
				columns         : clumns,
				keys            : [
						{
								key: [46],
								fn : function ()
								{
										// Onbt_EliminarNomencladorClick();
								}
						}
				],
				bbar            : new Ext.PagingToolbar({
						pageSize   : 24,
						store      : storeN,
						plugins    : filters,
						displayInfo: true,
						displayMsg : perfil.etiquetas.lbMsgResultados,
						emptyMsg   : perfil.etiquetas.lbMsgNohayresultadosparamostrar
				})

		});
		if (Ext.getCmp('Nomenclador').plugins) {
				var i, itemsfil = Ext.getCmp('Nomenclador').plugins.filters;
				for (i = 0; i < itemsfil.items.length; i++) {
						if (itemsfil.items[i].type == "string") {
								// var j =
								// itemsfil.map[itemsfil.items[i].dataIndex].menu.items.keys[0];
								itemsfil.map[itemsfil.items[i].dataIndex].menu.items.items[0].editor.value = "";
								itemsfil.items[i].active = false;
						} else {
								if (itemsfil.items[i].type == "boolean" && itemsfil.items[i].dataIndex == "actual" || itemsfil.items[i].dataIndex == "visible") {
										itemsfil.items[i].active = true;
								} else {
										itemsfil.items[i].active = false;
								}
						}
				}
		}
		// storeN.load({params:{limit:20, start:0}});
		/*
		 * gd_Nomenclador.on("sortchange",function(gd_Nomenclador,object){
		 *
		 * var columnModel = gd_Nomenclador.getColumnModel(); var cantidad =
		 * columnModel.getColumnCount(); var bandera = true; for ( var i = 0 ; i <
		 * cantidad ; i++ ) { if ( object.field == columnModel.getDataIndex( i ) ) {
		 * bandera = false; break; } } if(bandera) { object.field = 'orden';
		 * object.direction = 'ASC'; }
		 *
		 * });
		 */
		return gd_Nomenclador;
};
function crearMD5Comodo(arreglo)
{
		var retorno = '';
		for (var i = 0; i < arreglo.length; i++) {
				retorno += arreglo[i];
		}
		return retorno;
}
function dividir(v)
{
		var r = v.split('.');
		return r;
}
function md5_encode(r)
{
		var f = any_md5(r, r);
		return f.substr(20);
}
function configuracion(nombre)
{
		var arreglo = [];
		arreglo['estandar'] = 50;
		arreglo['orden'] = 35;
		arreglo['codigo'] = 50;
		arreglo['abreviatura'] = 100;
		arreglo['fecha'] = 100;
		arreglo['dencategocup'] = 120;
		arreglo['visible'] = 80;
		arreglo['actual'] = 80;
		arreglo['marca'] = 38;
		arreglo['pais'] = 34;
		arreglo['precio'] = 39;
		arreglo['cargo'] = 35;
		arreglo['nombre'] = 50;
		arreglo['vaplantilla'] = 40;
		arreglo['pesotm'] = 50;
		arreglo['um'] = 30;
		arreglo['planifica'] = 50;
		arreglo['essueldo'] = 48;
		arreglo['comentario'] = 200;
		arreglo['prueba'] = 60;
		arreglo['esmodulo'] = 60;
		arreglo['machon'] = 50;
		arreglo['denominacion'] = 250;
		arreglo['descripcion'] = 450;
		arreglo['denominacioncargo'] = 400;
		arreglo['denmaqtec'] = 510;
		arreglo['dennivestruc'] = 510;
		arreglo['denordtecnica'] = 510;
		arreglo['dentipcalific'] = 510;
		arreglo['dentiposennas'] = 510;
		arreglo['dentipotecnica'] = 510;
		arreglo['dentipocifra'] = 465;
		arreglo['densittecnica'] = 510;
		arreglo['carcivilcatocup'] = 120;
		arreglo['carcivilcatcivil'] = 120;
		arreglo['gradomilitsubcateg'] = 125;
		arreglo['gradomilithomologo'] = 150;
		arreglo['gradomilitantersuces'] = 150;
		arreglo['denprepmiltar'] = 510;
		arreglo['denomfunciones'] = 610;
		arreglo['denclasifunicades'] = 510;
		arreglo['denomcategmilitar'] = 510;
		arreglo['denomclasifdocumento'] = 550;
		arreglo['denagrupaciones'] = 510;
		return arreglo[nombre];
}
function convertCod(val)
{
		if (val.length == 1) {
				return '0' + val;
		} else {
				return val;
		}
}
function convertCodcargos(val)
{
		if (val.length == 1) {
				return '000' + val;
		} else {
				if (val.length == 2) {
						return '00' + val;
				} else {
						if (val.length == 3) {
								return '0' + val;
						} else {
								return val;
						}
				}
		}
}
function convertCodorgano(val)
{
		if (val.length == 1) {
				return '000' + val;
		} else {
				if (val.length == 2) {
						return '00' + val;
				} else {
						if (val.length == 3) {
								return '0' + val;
						} else {
								return val;
						}
				}
		}
}
function convertCodtecnica(val)
{
		if (val.length == 1) {
				return '0000' + val;
		} else {
				if (val.length == 2) {
						return '000' + val;
				} else {
						if (val.length == 3) {
								return '00' + val;
						} else {
								if (val.length == 4) {
										return '0' + val;
								} else {
										return val;
								}
						}
				}
		}
}
function convertCodgrado(val)
{
		if (val.length == 1) {
				return '000' + val;
		} else {
				if (val.length == 2) {
						return '00' + val;
				} else {
						if (val.length == 3) {
								return '0' + val;
						} else {
								return val;
						}
				}
		}
}
function eliminarceros(valor)
{
		var i, j = 0, result;
		for (i = 0; i < valor.length; i++) {
				if (valor[i] == '0') {
						j++;
				} else {
						break;
				}
		}
		return valor.substring(j);
}
