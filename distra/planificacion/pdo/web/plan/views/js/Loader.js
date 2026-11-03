Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();

ClassLoader = function(interfazservicio){

//captura del puntero de la clase para poder referenciarlo desde otras funciones
var _this = this;

this.xmldoc = document.implementation.createDocument("", "doc", null);


//funcion donde se procede a identificar el tipo de navegador web que se utiliza
this.TipoNavegador = function()
{
	var mozz = (typeof document.implementation != 'undefined') && (typeof  document.implementation.createDocument != 'undefined');
	return mozz;
}


//funcion donde se procede a leer el xml con las referencias a los componentes interfaz orientada a servicio 
this.ReadXml = function(cmpname)
{
	var xmlContents = _this.xmlDoc.getElementsByTagName("cosoi");alert(xmlContents);
}


//funcion donde se procede a  
this.CargarInterfazDeServicio = function(cmpname)
{
	var mozz = _this.TipoNavegador();
	if(mozz)
	{		
		_this.xmldoc.load('cosoi.xml');	
		_this.xmldoc.onload = _this.ReadXml;		
	}	
}




}
