// Creando el ambito de objetos (Ext.UCID)
if (!Ext.UCID) Ext.namespace('Ext.UCID');

/**
  * Ext.UCID.ComboIframe Extencion de Clase
  *
  * @autor  Dionisdel Ponce
  * @version 1.0
  *
  * @Clase Ext.UCID.ComboIframe
  * @extends Ext.form.ComboBox
  * @constructora
  * @param {Object} config Configuration options
  */

Ext.UCID.ComboIframe = function(config) {
    // Llamada a la clase padre contructora
    Ext.UCID.ComboIframe.superclass.constructor.call(this, config);
	// Colocando el store fijo que va a contener solo datos para el arbol
	this.store = new Ext.data.SimpleStore({ 
		fields: ['id', 'valor'],
		data: [['iframe', '<iframe id="'+this.idIframe+'" style="width:100%; border:none; height:100%;"></iframe>']]
	});
	// seteando para que siempre sea local
	this.mode = 'local';
	// seteando para almacenar el nodo seleccionado
	this.nodoSelected = Object();
	// seteando para que siempre sea valor
	this.displayField = 'valor';
	// seteando para que siempre sea valor
	this.triggerAction = 'all';
	// Funcion a disparar al seleccionar el arbol
	this.onSelectNodo = (this.onSelectNodo)?this.onSelectNodo:false;
	// Enviando el id solo si es necesario
	this.sendIdNodo = (this.valueField)?true:false;
	// Creando el template para desplegar la lista
	this.tpl = config.tpl || '<tpl for=".">{' + this.displayField + '}</tpl>';
	// Garantizando que al desplegarse cargue la accion configurada
	this.on({
        expand:{scope:this, fn:function() {
				if(document.getElementById(this.idIframe).src == ''){
					document.getElementById(this.idIframe).src = this.url;
					document.getElementById(this.idIframe).contentWindow.idcomboiframe = this.id;
					if(this.params) document.getElementById(this.idIframe).contentWindow.params = this.params;
				}
					return true;
			}
		}
	});
	// Sobre escribiendo el modo de seleccion por defecto.
	this.on({
        beforeselect:{scope:this, fn:function() {
				return false;
			}
		}
	});
} // Termina la construccion del elemento

// Extendiendo las funcionalidades
Ext.extend(Ext.UCID.ComboIframe, Ext.form.ComboBox, {
	
}); // Fin de la extencion.
 
// end of file
