Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil
perfil.etiquetas = Object();
//UCID.portal.cargarEtiquetas('gestionarentidad',cargarInterfaz);

// function CargarInterfaz
function cargarInterfaz(){
	
	//Dar listo para dar siguiente
	window.parent.cambiarEstado('si',EscribirBienvenida);
}// Endof cargarInterfaz

cargarInterfaz()

function EscribirBienvenida(){					
	Ext.Ajax.request({
		url: 'escribirbienvenida',				
		callback: function (options,success,response){

			}
	});
	return true;
}