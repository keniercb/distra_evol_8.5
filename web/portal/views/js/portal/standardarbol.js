/*
 * Componente portal de aplicaciones
 *
 * Interfaz del portal con navegacion vertical por arbol.
 *
 * @author Dionisdel Ponce Santana
 * @package Portal
 * @subpackage Portal
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */

// Defino barra de menu fija (horizontal).
var tb = new Ext.Toolbar(tbHriztal);
// Defino accordion del panel izquierdo de navegacion
var accordionLeft = new Ext.Panel({
	region:'west',
	width: 200,
	minSize: 100,
	title:perfilPortal.etiquetas.lbTituloMenu,
	split: true,
	autoScroll:true,
	maxSize: 300,
	collapsible: true,
	collapsed:true,
	layout:'accordion',
	defaults:{autoWidth:false},
	layoutConfig:{
		fill :false,
		animate:true
	}
});

// Store para obtener los elementos de configuracion del acordion
var stMenu =  new Ext.data.Store({
	baseParams:{accion:'CargarMenu'},
	url: 'cargarsistemas',
	reader: new Ext.data.JsonReader({
		root: 'menu',
		id: 'id'
		},['icono','titulo','id']
	)
});
// Mando a cargar el store para obtener los elementos de configuracion del acordion
stMenu.load({
	params:{idioma:UCID.portal.perfil.idioma},
	callback:function(rec,opciones,sucsec){
		if (sucsec) crearAccordionModulos();
	}
});

// Funcion para adicionar cada uno de los paneles del acordion a partir de la configuracion obtenida
function crearAccordionModulos(){
	for(var i=0; i<stMenu.getCount(); i++){
		//Adiciono al acordion de la navegacion el elemento devuelto por la funcion dameSubAcc
		accordionLeft.add(dameSubAcc(stMenu.getAt(i)));
	}
	//Una vez adicionados todos los elementos al acordion lo mando a repintar el body con los nuevos elementos
	accordionLeft.doLayout();
	//Ya con la navegacion creada y los elementos necesarios, se manda a pintar el portal
	UCID.portal.cargar();
}
// Para crear cada uno de los paneles del acordion
function dameSubAcc(record){
	//Defino el panel para adicionar a la navegacion
	var tmpAcc = new Ext.Panel({
		title:record.data.titulo,
		id:record.data.id,
		border:false,
		iconCls:record.data.icono,
		layout:'fit'
	});
	//Devuelvo el elemento que devuelve la funcion addTree luego de colocar el arbol de la navegacion para el panel
	return addTree(tmpAcc);
}
// Para adicionar a cada uno de los paneles del acordion el arbol de la navegacion por subsistemas
function addTree(tmpAcc){
	//Defino el arbol que se va a colocar en el panel pasado dada la configuracion de cada uno
	var tmpTree = new Ext.tree.TreePanel({
		autoScroll:true,
		autoHeight:true,
		border:false,
		//Evento onclick de un nodo de la navegacion del �rbol que llama una direcci�n URL para la funcionalidad espec�fica
		listeners: {'click':function (nodo){
				if (nodo.attributes.referencia){
					idFuncionalidad = nodo.attributes.idfuncionalidad;
					document.getElementById("ifMarco").src = nodo.attributes.referencia; 
				}else 
					if (nodo.isLeaf()) mostrarMensaje(3,'El nodo no tiene referencia ...');
			}
		},
		loader: new Ext.tree.TreeLoader({
					dataUrl:'cargarmodfunc',
					preloadChildren :false,
					baseParams:{idioma:UCID.portal.perfil.idioma}
				})
	});
	// Crear nodo raiz del arbol dentro del panel
	nodoRaiz = new Ext.tree.AsyncTreeNode({
		text: 'Modulos',
		id:tmpAcc.getId()
	});
	tmpTree.setRootNode(nodoRaiz);
	tmpAcc.add(tmpTree);
	//Devuelve el panel listo para ser a�anido
	return tmpAcc;
}
// Funcion que crea y renderea los componentes del portal
UCID.portal.cargar = function (){
	document.getElementById('cargandoconfiguracion').style.display = 'none';
	// Muestro el banner
	document.getElementById('bannerPortal').style.display = 'block';
	document.getElementById('barraMenu').style.display = 'block';
	// Renderizo la barra de men� horizontal
	tb.render('barraMenu');
	// Muestro toda la interfaz con todos los componentes renderizados
	vistaPortal = new Ext.Viewport({
		layout: 'border',
		items: [accordionLeft,
		{
			region: 'north',
			contentEl: 'bannerPortal',
			height: 66,
			border: false,
			xtype: 'panel'
		},{
			id: 'panelPrincipalPortalExt',
			region: 'center',
			html: '<iframe id="ifMarco" style="width:100%; height: 100%; border:none;"></iframe>',
			layout:'fit',
			xtype: 'panel'
		}]
	});
}