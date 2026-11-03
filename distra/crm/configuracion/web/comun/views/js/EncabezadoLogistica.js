/**
  * Ext.LOG.PnlHeader Extensión
  *
  * @autor  Alien Fernández Fuentes
  * @version 1.0
  *
  * @Clase Ext.LOG.PnlHeader
  * @extends Ext.Panel
  * @param {Object} config Opciones de configuración
  *
  * Los identificadores de las etiquetas se concatenan el prefijo definido con valores por
  * defecto que traen cada una de ellas ellos son:
  *
  * entidad
  * almacen
  * nrodoc
  * arearesponsabilidad
  * fecha
  * estado
  * centrocosto
  * nrovaleentrega
  * artino
  * clieneaorigen
  * areadeste
  * circuito
  * especialidad
  *
  * <code>
  pDatosDoc = new Ext.LOG.display_nc({
	 autoHeight:true,
	 prefix:'prod_',	//prefijo para concatenar en el id
	 display_nve:1,     //Si se quiere mostrar el numero del vale de entrega
	 display_cc:1,      //Si se quiere mostrar el centro de costo
	 display_ao:1,      //Si se quiere mostrar el area de orígen
	 display_ad:1,      //Si se quiere mostrar el area de destino
	 display_ar:1,      //Si se quiere mostrar el area de responsabilidad
	 display_nc:1		//Si se quiere mostrar el nombre del cliente
	 display_al:1		//Si se quiere mostrar el nombre del almacén
	 display_cd:1		//Si se quiere mostrar el nombre del circuito de distribución
	 display_es:1		//Si se quiere mostrar el nombre de la especialidad
  });
  *</code>
  *
  * Todas esas propiedades de la extensión con valor (0) o (undefine) se ocultan
  */

// Creando el ámbito de objetos (Ext.LOG)
if (!Ext.LOG)
	Ext.ns('Ext.LOG');

Ext.LOG.PnlHeader = function(config) {
    // Llamada a la clase padre constructora
    Ext.LOG.PnlHeader.superclass.constructor.call(this, config);
	/*
	 * Creando la tabla que contiene los datos del encabezado
	 * */
	this.html = '<table style=font-size:11 ><tr><td>Nombre de la entidad: </td><td><div id="'+this.prefix+'entidad"></div></td></tr><tr style="'+((this.display_al == 1 || isNaN(this.display_al)) ? "" : "display:none")+'"><td>Nombre del almac&eacute;n: </td><td><div id="'+this.prefix+'almacen"></div></td></tr><tr style="'+((this.display_ar == 1) ? "" : "display:none")+'"><td>&Aacute;rea responsabilidad: </td><td><div id="'+this.prefix+'arearesponsabilidad"></div></td></tr><tr><td>N&uacute;mero documento: </td><td><div id="'+this.prefix+'nrodoc"></div></td></tr><tr><td>Fecha de emisi&oacute;n: </td><td><div id="'+this.prefix+'fecha"></div></td></tr><tr><td>Estado documento: </td><td><div id="'+this.prefix+'estado"></div></td></tr><tr style="'+((this.display_ma == 1) ? "" : "display:none")+'"><td>Motivo Ajuste: </td><td><div id="'+this.prefix+'motivoN"></div></td></tr><tr style="'+((this.display_cc == 1) ? "" : "display:none")+'"><td>Centro de costo: </td><td><div id="'+this.prefix+'centrocosto"></div></td></tr><tr style="'+((this.display_nve == 1) ? "" : "display:none")+'"><td>Nro vale de entrega: </td><td><div id="'+this.prefix+'nrovaleentrega"></div></td></tr><tr style="'+((this.display_ao == 1) ? "" : "display:none")+'"><td>&Aacute;rea de origen: </td><td><div id="'+this.prefix+'areaorigen"></div></td></tr><tr style="'+((this.display_ad == 1) ? "" : "display:none")+'"><td>&Aacute;rea de destino: </td><td><div id="'+this.prefix+'areadestino"></div></td></tr><tr style="'+((this.display_nc == 1) ? "" : "display:none")+'"><td>Nombre del cliente: </td><td><div id="'+this.prefix+'cliente"></div></td></tr><tr style="'+((this.display_cd == 1) ? "" : "display:none")+'"><td>Circuito distribuci&oacute;n: </td><td><div id="'+this.prefix+'circuito"></div></td></tr><tr style="'+((this.display_es == 1) ? "" : "display:none")+'"><td>Especialidad: </td><td><div id="'+this.prefix+'especialidad"></div></td></tr></table>';

} // Termina la construcción del elemento

// Extendiendo la funcionalidad
Ext.extend(Ext.LOG.PnlHeader, Ext.Panel, {}); // Fin de la extensión.


