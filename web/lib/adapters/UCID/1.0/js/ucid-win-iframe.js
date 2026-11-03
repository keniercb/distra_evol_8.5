// Creando el ambito de objetos (Ext.UCID)
if (!Ext.UCID) Ext.namespace('Ext.UCID');

/**
  * Ext.UCID.WinIframe Extencion de Clase
  *
  * @autor  Dionisdel Ponce
  * @version 1.0
  *
  * @Clase Ext.UCID.WinIframe
  * @extends Ext.form.Window
  * @constructora
  * @param {Object} config Configuration options
  */

Ext.UCID.WinIframe = function(config) {
    // Llamada a la clase padre contructora
    Ext.UCID.WinIframe.superclass.constructor.call(this, config);
	
	this.layout = 'fit';
	
	this.dataIframe = [];
	
	this.on({
        show:{scope:this, fn:function() {
				if(document.getElementById(this.idIframe).src == ''){
					document.getElementById(this.idIframe).src = this.url;
					document.getElementById(this.idIframe).contentWindow.idWinParent = this.id;
					if(this.params) document.getElementById(this.idIframe).contentWindow.params = this.params;
				}
				return true;
			}
		}
	});
	
	this.html = '<iframe id="'+this.idIframe+'" style="width:100%; border:none; height:100%;"></iframe>';
} // Termina la construccion del elemento

// Extendiendo las funcionalidades
Ext.extend(Ext.UCID.WinIframe, Ext.Window, {

}); // Fin de la extencion.
 
// end of file
