/**
 * @Created with PhpStorm.
 * @Author: Ing. Daymel Machado Cabrera
 * @Date: 9/3/14
 * @Time: 4:28 p.m.
 * @Version:1.0
 */
/**
 *Se pone por defecto el tamaño de los botones en 75 px
 */
Ext.form.Button = Ext.extend(Ext.Button, {
		initComponent: function ()
		{
				Ext.apply(this, {
						minWidth: 75
				});
				Ext.form.Button.superclass.initComponent.apply(this);
		}
})
Ext.ns("Go.Util", "Go.Column.Render", "Go.Column.Ttip", "Go.Column.Config", "Go.Tree", "Go.Grid");
/**
 * Funcion para pinatar las busquedas en los grid
 * @autor Ing. Daymel Machado Cabrera
 * @param grid
 * @param col
 */
Go.Grid.search = function (grid, col, text)
{
		if (grid.colModel && col >= 0) {
				var fn = grid.colModel.config[col].renderer;
				var _this = text;
				grid.colModel.config[col].renderer = function (value, metaData, record, rowIndex, colIndex, store)
				{
						if (colIndex == col && _this.tbusqueda && value) {
								value = Go.Util.remplazaCadena(value, _this.getValue());
						}
						metaData.attr = 'ext:qtip="' + value + '"';
						return value;
				}
		}
};
/**
 * Funcion para pinatar las busquedas en los nodos de un arbol
 * @autor Ing. Daymel Machado Cabrera
 * @param tree
 */
Go.Tree.search = function (tree, text)
{
		var _this = text;
		tree.on('append', function (tree, parent, node, index)
		{
				if (_this.getValue() != " ") {
						var value = Go.Util.remplazaCadena(node.attributes.denominacion, _this.getValue());
						node.setText(value);
				}
		})
}
/**
 * Función para reemplazar una cadena
 * @autor Ing. Daymel Machado Cabrera
 * @param cadena
 * @param remp
 * @param tag
 * @param sty
 * @returns {*}
 */
Go.Util.remplazaCadena = function (cadena, remp)
{
		if (!cadena || !cadena.toLowerCase) {
				cadena = '';
		}
		if (typeof(remp) != 'string') {
				return cadena;
		}
		var valueLower = cadena.toLowerCase();
		var valueSearchLower = remp.toLowerCase();
		var indexOf = valueLower.indexOf(valueSearchLower);
		if (indexOf >= 0) {
				var substr = cadena.substr(indexOf, valueSearchLower.length);
				return cadena.replace(substr, '<b><u><i>' + substr.toUpperCase() + '</i></u></b>');
		}
		return cadena;
}
/**
 * Función para limpiar los formularios
 * @param _componente
 */
Go.Util.limpiarForm = function (_componente)
{
		if (_componente.initialConfig.tbar) {
				var _tbar = _componente.initialConfig.tbar;
				Go.Util.verifica(_tbar);
		}
		if (_componente.items) {
				var _items = _componente.items.items
				Go.Util.verifica(_items);
		}
}
/**
 * Función para verificar si es un objeto
 * @param _items
 */
Go.Util.verifica = function (_items)
{
		if (_items.length > 0) {
				for (var i = 0; i < _items.length; i++) {
						if (typeof _items[i] == 'object') {
								Go.Util.reset(_items[i])
						}
				}
		}
}
/**
 *
 * @param _cmp
 * @param _focus
 * @constructor
 */
Go.Util.MsgCerrarWin = function (_cmp, _focus)
{
		mostrarMensaje(2, "Está seguro que desea cerrar la ventana sin guardar los datos.", function (btn)
		{
				if (btn == 'ok') {
						_cmp.destroy();
						if (_focus) {
								_focus.focus(false, 10);
						}
				}
		})
}
/**
 * Función que resetea los campos segun su tipo
 * @param _cmp
 */
Go.Util.reset = function (_cmp)
{
		var _xtype = _cmp.getXType();
		var _items;
		switch (_xtype) {
				case 'textfield' :
						_cmp.reset();
						break;
				case 'combo':
						_cmp.reset();
						break;
				case  'tabpanel':
						if (_cmp.items.length > 0) {
								_items = _cmp.items;
								_items.each(function (item)
								{
										_cmp.remove(item);
								})
						}
						break;
				case 'panel':
						Go.Util.limpiarForm(_cmp);
						if (_cmp.isVisible()) {
								_cmp.collapse();
						}
						break;
				case 'treepanel':
						_cmp.destroy();
						break;
		}
}
/**
 * Funcion para validar espacios en un text area
 * @param t
 * @param e
 */
Go.Util.validaEspacio = function (t, e)
{
		var cont = t.getValue().length;
		if (e.getKey() == 32 && cont == 1) {
				t.reset();
		} else {
				if (e.getKey() != 32) {
						cont = t.getValue().length;
						var value = t.getValue();
						var cant_e = 0;
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
/**
 * Render para la columna de restricciones
 * @param val
 * @param meta
 * @param record
 * @param a
 * @returns {*}
 */
Go.Column.Render.renderComboRawValue = function (val, meta, record, a)
{
		if (val && record.data.idconcepto != 7 && record.data.idconcepto != 10) {
				return val;
		}
		if (record.data.idconcepto == 7 || record.data.idconcepto == 10) {
				return '<span style="color: rosybrown">No existen tipos asociados</span>';
		}
		return '...';
}
/**
 * Poner Tooltip en una columna
 */
Go.Column.Ttip.ToolTipColumn = function (v, m)
{
		m.attr = 'ext:qtip="' + v + '"';
		return v;
}
/**
 * Crear tooltip de imagen
 * @param v
 * @param m
 * @returns {*}
 */
Go.Column.Ttip.crearDenominacionImagen = function (v, m)
{
		m.attr = 'ext:qtip="' + v + '"';
		return v;
}
/**
 * Cambiar valor en la columna
 * @param val
 * @param m
 * @returns {*}
 */
Go.Column.Render.changeValor = function (val)
{
		if (val == "0" || val == "" || val == null || val == " " || val == "null" || val == false) {
				return "<center><span class='icondistra-activar rojo' />";
		} else {
				if (val == "1") {
						return "<center><span class='icondistra-activar verde' />";
				}
		}
		return val;
};
/**
 * Cambiar chequeados
 * @param val
 * @param m
 * @returns {string}
 */
Go.Column.Render.changeValorRadio = function (val)
{
		if (val) {
				return "<img src='/metadatos/comun/recursos/iconos/checked.png'/>";
		} else {
				return "<img src='/metadatos/comun/recursos/iconos/unchecked.png'/>";
		}
};
/**
 * Cambiar estado del proyecto a enviado
 * @param val
 * @param m
 * @returns {*}
 */
Go.Column.Render.changeValorEnviado = function (val, m)
{
		if (!val) {
				m.attr = 'ext:qtip=""';
				return "<center><img src=" + perfil.dirImg + "banderaroja.png" + " width='16' height='16' />";
		} else {
				if (!isNumeric(val)) {
						m.attr = 'ext:qtip="<b>Enviado a:</b><br>' + val + '"';
				}
				return "<center><img src=" + perfil.dirImg + "banderaverde.png" + " width='16' height='16' />";
		}
		return val;
};
/**
 * Cambiar estado a asignado
 * @param val
 * @param m
 * @returns {*}
 */
Go.Column.Render.changeValorAsignado = function (val, m)
{
		if (!val) {
				m.attr = 'ext:qtip=""';
				return "<center><img src=" + perfil.dirImg + "banderaroja.png" + " width='16' height='16' />";
		} else {
				if (!isNumeric(val)) {
						m.attr = 'ext:qtip="<b>Asignado a:</b><br>' + val + '"';
				}
				return "<center><img src=" + perfil.dirImg + "banderaverde.png" + " width='16' height='16' />";
		}
		return val;
};
/**
 *
 * @param val
 * @param m
 * @returns {*}
 */
Go.Column.Render.changeValorCondicion = function (val, m)
{
		if (val == "0" || val == "" || val == null || val == " " || val == "null" || val == false) {
				return "<span class='icondistra-cerrar'/>";
		} else {
				m.attr = 'ext:qtip="' + val + '"';
				return val;
		}
};
/**
 *
 * @param val
 * @returns {*}
 */
Go.Column.Render.changeValorIcono = function (val)
{
		if (val == "0" || val == "" || val == null || val == " " || val == "null" || val == false) {
				return "<center><span class='icondistra-bandera rojo' />";
		} else {
				if (val == "1") {
						return "<center><span class='icondistra-bandera verde' />";
				}
		}
		return val;
};
/**
 * Cambiar imagen
 * @param val
 * @returns {string}
 */
Go.Column.Render.changeImagen = function (val)
{
		return "<img  class='icono' url='" + val + "' src='" + val + "' width='40' height='30' />";
};
/**
 * Cambia el grado en la columna
 * @param val
 * @returns {string}
 */
Go.Column.Render.changeGrado = function (val)
{
		return "<center><img class='grado' url='" + val + "' src='" + val + "' width='40' height='20' />";
};
/**
 * Tamaño de la columna
 * @param nombre
 * @returns {*}
 * @constructor
 */
Go.Column.Config.Width = function (nombre)
{
		var arreglo = [];
		arreglo['estandar'] = 50;
		arreglo['orden'] = 35;
		arreglo['codigo'] = 50;
		arreglo['abreviatura'] = 100;
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
/**
 * Convertir Codigo
 * @param val
 * @returns {*}
 */
Go.Util.convertCod = function (val)
{
		if (val.length == 1) {
				return '0' + val;
		} else {
				return val;
		}
}
/**
 * Conertir Codigo cargos
 * @param val
 * @returns {*}
 */
Go.Util.convertCodcargos = function (val)
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
/**
 * Cargar Js Css
 * @param filepath
 * @param filetype
 */
Go.Util.loadJsCssFile = function (filepath, filetype)
{
		if (filetype == "js") { //if filename is a external JavaScript file
				// alert('called');
				var fileref = document.createElement('script')
				fileref.setAttribute("type", "text/javascript")
				fileref.setAttribute("src", filepath);
		} else {
				if (filetype == "css") { //if filename is an external CSS file
						var fileref = document.createElement("link")
						fileref.setAttribute("rel", "stylesheet")
						fileref.setAttribute("type", "text/css")
						fileref.setAttribute("href", filepath)
				}
		}
		if (typeof fileref != "undefined") {
				document.getElementsByTagName("head")[0].appendChild(fileref)
		}
}
/**
 * Función para ordenar los indices del formulario
 * @param _form
 */

Go.Util.encontrarProx = function (cmp)
{
		var prox = Ext.getCmp(cmp).nextTab;
		if (Ext.getCmp(cmp).disabled == true) {
				Go.Util.encontrarProx(prox)
		} else {
				prox = cmp;
		}
		return prox;
}

Go.Util.encontrarAnte = function (cmp)
{
		var prev = Ext.getCmp(cmp).prevTab;
		if (Ext.getCmp(cmp).disabled == true) {
				Go.Util.encontrarAnte(prev)
		} else {
				prev = cmp;
		}
		return prev;
}
Go.Util.orderTabIndices = function (_form)
{
	
		var tab = 30;
		var _list = _form.getForm().items.items;
		for (var i = 0; i < _list.count(); i++) {
				_list[i].tabIndex = tab;
				tab++;
		}
}
/**
 *Función par reordenar en todos los tabindiicen dentro de la ventana
 * @param _win
 */
Go.Util.reorderTabIndices = function (_win)
{
		var tab = 30;
		console.log(_win)
		// var _list = _form.getForm().items.items;
		// for (var i = 0; i < _list.count(); i++) {
		// 		_list[i].tabIndex = tab;
		// 		tab++;
		// }
}