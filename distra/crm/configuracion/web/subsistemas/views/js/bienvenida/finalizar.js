Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil
perfil.etiquetas = Object();
//UCID.portal.cargarEtiquetas('gestionarentidad',cargarInterfaz);

// function CargarInterfaz
function cargarInterfaz(){
window.parent.cambiarEstado('si',EscribirFin);
}// Endof cargarInterfaz

cargarInterfaz()
function EscribirFin(){					
	Ext.Ajax.request({
		url: 'escribirfinalizar',				
		callback: function (options,success,response){
			}
		});
	return true;
}