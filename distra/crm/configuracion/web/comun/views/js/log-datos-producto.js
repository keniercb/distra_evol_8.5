/**
  * Ext.LOG.DatosProducto Extensión
  *
  * @autor  Alien Fernández Fuentes
  * @version 1.0
  *
  * @Clase Ext.LOG.DatosProducto
  * @extends Ext.Panel
  * @param {Object} config Opciones de configuración
  * 
  * Los identificadores de las etiquetas se concatenan el prefijo definido con valores por 
  * defecto que traen cada una de ellas ellos son:
  * 
  * codigoprod
  * descripcion
  * existencia
  * 
  * <code>
  pDatosProd = new Ext.LOG.DatosProducto({
	 autoHeight:true,
	 prefix:'prod_',	//prefijo para concatenar en el id
	 display_cp:1,     //Si se quiere mostrar el codigo del producto
	 display_dp:1,      //Si se quiere mostrar la descripcion del producto
	 display_et:1,      //Si se quiere mostrar la existencia del producto
  });
  *</code>
  * 
  * Todas esas propiedades de la extensión con valor (0) o (undefine) se ocultan
  */

// Creando el ámbito de objetos (Ext.LOG)
if (!Ext.LOG) 
	Ext.ns('Ext.LOG');

Ext.LOG.DatosProducto = function(config) {
    // Llamada a la clase padre constructora
    Ext.LOG.DatosProducto.superclass.constructor.call(this, config);
	/*
	 * Creando la tabla que contiene los datos del encabezado del producto
	 * */
	this.html = '<table style=font-size:11 ><tr style="'+((this.display_cp == 1 || isNaN(this.display_cp)) ? "" : "display:none")+'"><td><b>C&oacute;digo del producto: </b></td><td><div id="'+this.prefix+'codigoprod"></div></td></tr><tr style="'+((this.display_dp == 1 || isNaN(this.display_dp)) ? "" : "display:none")+'"><td><b>Descripci&oacute;n producto: </b></td><td><div id="'+this.prefix+'descripcion"></div></td></tr><tr style="'+((this.display_et == 1 || isNaN(this.display_et)) ? "" : "display:none")+'"><td><b>Existencia total: </b></td><td><div id="'+this.prefix+'existencia"></div></td></tr></table>';
	this.resetearDatos = function (){
		document.getElementById(this.prefix + 'codigoprod').innerHTML = '-';
		document.getElementById(this.prefix + 'descripcion').innerHTML = '-';
		document.getElementById(this.prefix + 'existencia').innerHTML = '-';
	}

} // Termina la construcción del elemento

// Extendiendo la funcionalidad
Ext.extend(Ext.LOG.DatosProducto, Ext.Panel, {}); // Fin de la extensión.


