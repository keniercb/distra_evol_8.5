//variables globales necesarias
var clickevent1 = true, 
    clickevent2 = true;
	
/*
 * Funcion para garantizar la logica en los arboles de cambio de checked
 * Funciones relacionadas:  checkNodos, checkHijos, checkParent, cambiarEstadoCheck, checkHijosSiCheckPadre, hijosChecked, checkpubtodos, getgestionarPublicidad, getNodos 
 */ 
 function setLogicaArbolCheck(treepanel,checkbox){
	if (checkbox!=undefined) {   
	    treepanel.checkbox = checkbox; //importante	
        checkbox.tree = treepanel; //importante	
	    checkbox.addListener('check', 
			function(c){
				checkNodos(c.tree.getRootNode(),c.checked);   	   
			}
		);
		treepanel.getRootNode().addListener('expand',
			function(nodo){
				var tree = nodo.getOwnerTree();
				if ( tree.checkbox!=undefined && tree.checkbox.checked2==undefined ) 
				   { tree.checkbox.checked2 = tree.checkbox.checked; } 
			}
		);
    };	
	
	treepanel.loader.addListener('load',
		function(atreeloader,nodo,c){	            
			nodo.eachChild(function(anodehijo){					
			    if (anodehijo.attributes.checked!=undefined)
					anodehijo.attributes.checked2 = anodehijo.attributes.checked;					
			},this);
            var	tree = nodo.getOwnerTree();		
			if  (tree.checkbox!=undefined) checkpubtodos(tree);				
		}		
	);	                    	
	
	treepanel.addListener('checkchange', 
		function( nodo, check ){
			checkNodos(nodo,check);			
			var	tree = nodo.getOwnerTree();		
			if  (tree.checkbox!=undefined) checkpubtodos(tree);
		}
	);
	
	treepanel.addListener('expandnode',checkHijosSiCheckPadre);
	
	treepanel.addListener('contextmenu', 
		function(ni, e){				   
			e.stopEvent();	                             
		}
	);
	treepanel.addListener('dblclick', 
		function(ni,e){
			return false;
		}
	);
}

/*
* Funcion para garantizar la logia en los arboles de involucrados de dos estados: 
* Propiedades de los nodos: id, text, tipo, idusuario, idgrupo, cheched, tipoinvol, checked2, tipoinvol2
* Funciones relacionadas:  actNodos,actHijos,actParent,cambiarEstado,actHijosSiCambioPadre,hijosResp,tiponodo,getgestionarInvolucrados,getNodos 
*/		
function setLogicaArbolCheckTipo(treepanel){
    treepanel.addListener( 'checkchange', 
		function(nodo, check){							
			actNodos( nodo, false);
		}
	);
	treepanel.loader.addListener('load',
		function(tree,nodo,c){
			nodo.eachChild(function(anodehijo){				    
			    if (anodehijo.attributes.checked!=undefined)
					anodehijo.attributes.checked2=anodehijo.attributes.checked;
				if (anodehijo.attributes.tipoinvol!=undefined)				
					anodehijo.attributes.tipoinvol2 = anodehijo.attributes.tipoinvol;				
			},this);	
		}		
	);
	treepanel.addListener( 'expandnode', actHijosSiCambioPadre);	
	treepanel.addListener( 'contextmenu', 
		function(nodo, event){
			event.stopEvent();
			if ( nodo.attributes.checked==undefined ) return 0;
			var tree = nodo.getOwnerTree();
			
			tree.contextMenu = new Ext.menu.Menu({ id: 'menu'+tree.id }) 		 
			if ( tiponodo(nodo) < 2 )
				tree.contextMenu.addMenuItem({
				   text: '<b>Marcar como responsable</b>',
				   handler: function(){ actNodos( nodo, true); }
				});
			else
				tree.contextMenu.addMenuItem({
				   text: '<b>Quitar de responsable</b>',
				   handler: function(){ actNodos( nodo, false ); }
				});
		   
			var xy = event.getXY();
			tree.contextMenu.showAt(xy);   					
		}
	);
}//fin  de funcion logica de arbol


// obtener nodos cambiados, para arboles  donde solo cambia el checked de los nodos, 
// y ademas  pueden tener un  chekcbox  asociado relacionado con el arbol con la funcion setLogicaArbolCheck
// devuelve:    array.insertar,  array.eliminar
// array1 es un arreglo de los parametros que se desean  enviar cuando se inserta, aparte del node.id
// array2 es un arreglo de los parametros que se desean enviar cuando se eleimina, aparte del node.id
function getgestionarCheck(treepanel,array1,array2){
    
   //variables necesarias
   var array = { insertar : [], eliminar: [] };
   if (array2==undefined) array2 = array1;
   var arreglo = getNodos(treepanel), nodo, params,
	   count1 = (array1!=undefined)?array1.length:0,
	   count2 = (array2!=undefined)?array2.length:0;

    //funciones necesarias 
	//funcion para obtener la jerarquia de ancestros, OJO ->> no sirve fuera ya que usa  count1  y  array1   de la funcion contenedora getgestionarCheck
	function getpadres(object,nodo){         
        var padre = nodo.parentNode;
       	if (padre &&  padre.attributes.id!=0) {	
            object.padre = {};			
		    object.padre.id = padre.id; //parametros por defecto en todos los arboles	
            for(var j=0;j<count1;j++) 			
				if (array1[j]!='padres') eval('object.padre.'+array1[j]+'= padre.attributes.'+array1[j]);  			
			if (padre.parentNode && padre.parentNode.attributes.id!=0) getpadres(object.padre,padre);			
		}		
    }   
  
   for (var i=0; i<arreglo.length; i++){
		nodo = arreglo[i];     		
		params = { id: nodo.attributes.id}; //parametros por defecto en todos los arboles			
		
		if ( nodo.attributes.checked  && (			      
				 treepanel.checkbox==undefined && !nodo.attributes.checked2 ||          // variante 1   sin checkbox                                          
				 treepanel.checkbox!=undefined   && !treepanel.checkbox.checked && (                    
					 treepanel.checkbox.checked2 ||                                     // variante 2
					 !treepanel.checkbox.checked2 && !nodo.attributes.checked2          // variante 3
			))){           
			for(var j=0;j<count1;j++)  
				if(array1[j]=='padres') getpadres(params,nodo); 
					else eval('params.'+array1[j]+'= nodo.attributes.'+array1[j]);		
			array.insertar.push(params);       
		}			
		
		if ( nodo.attributes.checked2 && (					             
				 treepanel.checkbox==undefined && !nodo.attributes.checked ||           // variante 1   sin checkbox                                         
	             treepanel.checkbox!=undefined && !treepanel.checkbox.checked2 && ( 
					!treepanel.checkbox.checked && !nodo.attributes.checked  ||         // variante 2
					 treepanel.checkbox.checked &&  nodo.attributes.checked             // variante 3
			))){  	          		
            for(var j=0;j<count2;j++) 		
			    if(array2[j]!='padres') eval('params.'+array2[j]+'= nodo.attributes.'+array2[j]);
			
			array.eliminar.push(params);					
		}	          		 
   }
   return	array;
}

//obtener nodos cambiados, para arboles de involucrados
// devuelve:    array.insertar,  array.eliminar,  array.modificar
// array1 es un arreglo de los parametros que se desean  enviar cuando se inserta, aparte del node.id
// array2 es un arreglo de los parametros que se desean enviar cuando se eleimina, aparte del node.id
function getgestionarCheckTipo(treepanel, array1, array2, array3){  		 
    //variables necesarias
	var array = { insertar : [], eliminar: [], modificar: [] };    
    if (array2==undefined) array2 = array1;
    if (array3==undefined) array3 = array1; 
    var arreglo = getNodos(treepanel), nodo, params,
	    count = (array3!=undefined)?array3.length:0;
	
	//obtener los arreglos de insetar y eliminar
	var comun = getgestionarCheck(treepanel,array1,array2);
	array.insertar = comun.insertar;
	array.eliminar = comun.eliminar;
		
    for (var i=0; i<arreglo.length; i++) {	
		nodo = arreglo[i];		
		params = { id: nodo.id}; //parametros por defecto en todos los arboles		 
		//poner solo cuando se definen responsables
		if ( nodo.attributes.checked == nodo.attributes.checked2 &&
			 nodo.attributes.tipoinvol != nodo.attributes.tipoinvol2 ) {
			for(var j=0;j<count;j++)  eval('params.'+array3[j]+'= nodo.attributes.'+array3[j]);
			array.modificar.push(params);
        }		
	}  

	return	array;
}	


/*
//con la intension de hacer cosas con los nodos antes de que aparescan visibles, ejemplo copiar el checked y tipoinvol
function expandNode(nodo,url,params){
	var hijos,item,icon;
	
	Ext.Ajax.request({
		url: url,
		params: params,
		callback: function (options,success,response){	
            hijos =  Ext.decode(response.responseText);
            alert(response.responseText);			
		}		
	}); 
   
    for(var i=0;i<hijos.length;i++){
		item = hijos[i];
		if (item.attributes.checked!=undefined)
				item.attributes.checked2=item.attributes.checked;
		if (item.attributes.tipoinvol!=undefined)
		{
			item.attributes.tipoinvol2 = item.attributes.tipoinvol;
			icon = ((item.attributes.tipo)?'usuario':'grupo') + ((item.attributes.tipoinvol)?'ejecutor':'responsable');
			item.getUI().getIconEl().className = 'x-tree-node-icon ' + icon;
			item.attributes.iconCls = icon;
		}		
	};	
	if(hijos!=undefined) nodo.appendChild(hijos);    	
};*/


/*****************************  Funciones  utiles ************************************/

//actualiza hijos del nodo si les cambia su check
function checkNodos(nodo,check){
	if(!clickevent1) return 0;
	clickevent1 = false;
	
	if(nodo.hasChildNodes()) checkHijos(nodo,check);
	if(nodo.parentNode) checkParent(nodo);

	clickevent1 = true;
}	

//actualiza hijos del nodo si les cambia su check
function checkHijos(nodo,check){
	nodo.eachChild(function(anodehijo){
		if (anodehijo.attributes.checked != check)
		{
			if (anodehijo.attributes.checked!=undefined);
			cambiarEstadoCheck(anodehijo,check);
			if(anodehijo.hasChildNodes())  checkHijos(anodehijo,check);				
		}
	},this);
}

//actualiza padre del nodo si los hijos del padre resultan todos chekeados
function checkParent(nodo){
    if (nodo.parentNode.attributes.checked==undefined) return 0;
	
	if ( hijosChecked(nodo.parentNode) && (!nodo.parentNode.attributes.checked) ){
		cambiarEstadoCheck(nodo.parentNode,true);
	}else if (nodo.parentNode.attributes.checked){
		cambiarEstadoCheck(nodo.parentNode,false);
	}
	if ( nodo.parentNode.parentNode ) checkParent(nodo.parentNode);
}

//cambia el check si cambio
function cambiarEstadoCheck(nodo,check){
    if (nodo.attributes.checked==undefined) return 0;
	
	nodo.getUI().toggleCheck(check);
	nodo.attributes.checked = check;
}

//actualiza hijos si se expande un padre debido a que el padre pudo haber cambiado antes de cargar datos
function checkHijosSiCheckPadre(nodo){		
	if ( !clickevent1 ) return 0;
	clickevent1 = false;		
			
	var check = nodo.attributes.checked;	
	var changeCheck = check!=undefined &&          //el padre tiene checkbox
	                  check != hijosChecked(nodo); //hijos desactualizados
	
	nodo.eachChild(function(anodehijo){		
		if ( changeCheck && anodehijo.attributes.checked!=undefined ){
			anodehijo.getUI().toggleCheck(check);
			anodehijo.attributes.checked = check;
		}	
	},this);
	
	clickevent1 = true;
}	


//devuelve verdadero si todos los hijos del nodo estan checkeados
function hijosChecked(nodo){
	var estado = true;
	nodo.eachChild(function(anodehijo){	
		if(anodehijo.attributes.checked!=undefined && !anodehijo.attributes.checked)  estado = false;
	},this)		
	return estado;
}


//cambia el estado de nodos con checkbox, 
//y actualiza la parte del arbol afectada
function actNodos(nodo, resp){			
	if(!clickevent2) return 0;
	clickevent2 = false;
	
	//si lo marco de responsable entonces chekearlo
	if (nodo.attributes.checked!=undefined && resp){ 
		nodo.getUI().toggleCheck(true);  
		nodo.attributes.checked = true; 
	}	
	//marcarlo como responsable si debe estarlo
	var icon = tipoicon( nodo.attributes.tipo, nodo.attributes.checked, resp );	
	nodo.getUI().getIconEl().className = 'x-tree-node-icon ' + icon;
	nodo.attributes.iconCls = icon;	
	nodo.attributes.tipoinvol = tipoinvol( nodo.attributes.checked, resp );	
	
	//actualizar todos los descendientes y ancestros afectados
	if ( nodo.hasChildNodes() )  actHijos( nodo, nodo.attributes.checked, resp);
	if ( nodo.parentNode ) actParent(nodo);
	
	clickevent2 = true;
}	

//actualiza hijos del nodo si les cambia su check o su resp
function actHijos(nodo,check,resp){
	nodo.eachChild(function(anodehijo){	
		if ( anodehijo.attributes.checked!=undefined  
		     &&( (anodehijo.attributes.checked != check)  ||   //cambia el checked
				 tiponodo(anodehijo) != tiponodo(nodo) )  //cambia estado de responsable
			 && anodehijo.hasChildNodes() )
		    actHijos(anodehijo,check,resp);
		cambiarEstado(anodehijo,check,resp);
	},this);
}  

//actualiza padre del nodo si los hijos del padre resultan todos chekeados
function actParent(nodo){	
	if (nodo.parentNode.attributes.checked==undefined) return 0;	
	
	if( hijosChecked(nodo.parentNode) )  
		cambiarEstado( nodo.parentNode, true, hijosResp(nodo.parentNode) );
	else  cambiarEstado( nodo.parentNode, false, false);
	
	if(nodo.parentNode.parentNode) actParent(nodo.parentNode);				
}

//cambia los estados check y resp si cambiaron
function cambiarEstado(nodo,check,resp){

	if( nodo.attributes.checked!=undefined 
	    && nodo.attributes.checked != check)
    {
		nodo.getUI().toggleCheck(check);
		nodo.attributes.checked = check;			
	}
	var icon = tipoicon( nodo.attributes.tipo, nodo.attributes.checked, resp );
	if ( nodo.attributes.iconCls != icon )
	{   
		nodo.getUI().getIconEl().className = 'x-tree-node-icon ' + icon;
		nodo.attributes.iconCls = icon;
		nodo.attributes.tipoinvol = tipoinvol( check, resp );
	}
}

//actualiza hijos si se expande un padre debido a que el padre pudo haber cambiado antes de cargar datos
function actHijosSiCambioPadre(nodo){		
	if ( !clickevent2 ) return 0;
	clickevent2 = false;		
	    
	var check = nodo.attributes.checked;
	var changeCheck = check!=undefined &&         //el padre tiene checkbox
			          check!= hijosChecked(nodo); //hijos desactualizados
	
	var resp = ( tiponodo(nodo)== 2 );                // si es responsable	
	var changeResp = (resp != hijosResp(nodo));	      // cambió el tipoinvol del padre			
	var icon;                                         // para el nombre de clase de icono del hijo
	
	nodo.eachChild(function(anodehijo){		
		if ( changeCheck && anodehijo.attributes.checked!=undefined ){
			anodehijo.getUI().toggleCheck(check);
			anodehijo.attributes.checked = check;
		}
		if ( changeResp ){	
			icon = tipoicon( anodehijo.attributes.tipo, anodehijo.attributes.checked, resp );
			anodehijo.getUI().getIconEl().className = 'x-tree-node-icon ' + icon;
			anodehijo.attributes.iconCls = icon;
			anodehijo.attributes.tipoinvol = tipoinvol( anodehijo.attributes.checked, resp );
		}
	},this);
	
	clickevent2 = true;
}	

//devuelve verdadero si todos los hijos del nodo estan marcados como responsables
function hijosResp(nodo){
	var estado = true;
	nodo.eachChild(function(anodehijo){		
		if (tiponodo(anodehijo)!=2) estado = false;
	},this)
	return estado;
}	

//para actualizar el estado del checkbox asociado al arbol de involucrados
function checkpubtodos(treepanel){    
	if(!clickevent1) return 0;
	clickevent1 = false;
	var arreglo = treepanel.getRootNode().childNodes,	
	    marcar = true, 
		haygrupos = false;
	
	for(var i=0;i<arreglo.length;i++)
		if (arreglo[i].childNodes.length > 0 ) {	   
		   if (!hijosChecked(arreglo[i])) { marcar = false; }
		   haygrupos = true;
	    }	
    if (!haygrupos)	marcar = false;
	treepanel.checkbox.setValue(marcar);
	clickevent1 = true;
};

//devuelve el tipo de icono del nodo
function tiponodo(nodo){
  //retorna 2 si es responsable, 1 si es ejecutor, y 0 si no es ninguno de los dos
  var tipo; 
  if (nodo.attributes.tipoinvol==null || nodo.attributes.tipoinvol==undefined)
  tipo = 2; else tipo = nodo.attributes.tipoinvol;
  return 2 - tipo;    
  /*if (nodo.attributes.iconCls == 'usuario' || nodo.attributes.iconCls == 'grupo' ) return 0;
   if (nodo.attributes.iconCls == 'usuarioejecutor' || nodo.attributes.iconCls == 'grupoejecutor' ) return 1;
   if (nodo.attributes.iconCls == 'usuarioresponsable' || nodo.attributes.iconCls == 'gruporesponsable' ) return 2;*/
}


//devuelve el nombre de la clase de icono del nodo
function tipoicon( tipo, check, resp ){
  return ((tipo==1)?'usuario':'grupo') + ((check==undefined || check)?((resp)?'responsable':'ejecutor'):'');
}

//devuelve el tipoinvol de un nodo segun el estado de su checkbox y si es responsable o no
function tipoinvol(check, resp){
  return ((check==undefined || check) && resp)?0:1;
}


function getNodos(treepanel)
{	 	
	var arrayNodos = [];		
	function llenar( nodo ){
		if (nodo.attributes.checked!=undefined)
			{ arrayNodos.push(nodo);}
		for(var i=0;i<nodo.childNodes.length;i++)  llenar(nodo.childNodes[i])
	}	
	
	if (treepanel.getRootNode()) llenar(treepanel.getRootNode()); else return	[]; 	 	
	
	return arrayNodos;
}


 