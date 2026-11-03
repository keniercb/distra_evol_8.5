Ext.form.Button = Ext.extend(Ext.Button, {
		initComponent: function ()
		{
				Ext.apply(this, {
						minWidth: 75
				});
				Ext.form.Button.superclass.initComponent.apply(this);
		}
})
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
function changeValor(val, m)
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
function changeValorRadio(val, m) {
    if (val) {
        return "<img src='/metadatos/comun/recursos/iconos/checked.png'/>";
    } else {
        return "<img src='/metadatos/comun/recursos/iconos/unchecked.png'/>";

    }
};
function changeValorEnviado(val, m)
{
		if (!val) {
				m.attr = 'ext:qtip=""';
				return "<img src='/metadatos/comun/recursos/iconos/no.png'/>";
		} else {
            if(!isNumeric(val)){
                m.attr = 'ext:qtip="<b>Enviado a:</b><br>'+val+'"';
            }
						return "<img src='/metadatos/comun/recursos/iconos/yes.png'/>";
		}
		return val;
};
function changeValorAsignado(val, m)
{
		if (!val) {
				m.attr = 'ext:qtip=""';
				return "<img src='/metadatos/comun/recursos/iconos/no.png'/>";
		} else {
				if(!isNumeric(val)){
						m.attr = 'ext:qtip="<b>Asignado a:</b><br>'+val+'"';
				}
						return "<img src='/metadatos/comun/recursos/iconos/yes.png'/>";
		}
		return val;
};
function changeValorCondicion(val, m)
{
		if (val == "0" || val == "" || val == null || val == " " || val == "null" || val == false) {
				return "<img src='/metadatos/comun/recursos/iconos/no.png'/>";
		} else {
				m.attr = 'ext:qtip="' + val + '"';
				return val;
		}
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
function configuracion(nombre)
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
function loadJsCssFile(filepath, filetype)
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
