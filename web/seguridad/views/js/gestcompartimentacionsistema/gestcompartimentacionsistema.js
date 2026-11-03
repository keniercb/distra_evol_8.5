UCID.portal.cargarEtiquetas('gestcompartimentacionsistema', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();
	
////------------ Declarar variables ------------////
var arbolAcc, arbolDominios, iddominioselec = 0, aBandera = false, banderaClick = true,arregloDeschequeados = [], arrayPadresEliminar = [], NodosInicialesChekeados = [], arrayTiene = [] ,ultimonodomarcado = 0,valor = 0, bandera = 0, iguales = 0, iddominio = 0;
var arraySistEliminar = [], arrayFuncEliminar = [], arrayAccEliminar = [], arrayPadres = [];
arrCheckFuncionalidad = {};
arrCheckRecurso = {};

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
	
////------------ Funcion Cargar Interfaz ------------////
function cargarInterfaz(perfil,etiquetas) {
    ////------------ Botones ------------////
    btnguardarcambios = new Ext.Button({
        disabled:true,
        //icon:perfil.dirImg+'aceptar.png',
        id:'acetpChange',
        iconCls:'aceptar',
        text:etiquetas.buttonText,
        tooltip	: etiquetas.tooltipAceptarVen
        });
    btnAyuda = new Ext.Button({
        id: 'btnAyuTema',
        iconCls: 'ayuda',
        text: '<b>'+etiquetas.lbBtnAyuda+'</b>',
        nextTab		: 'btnAgrCampPerf',
        prevTab : 'btnEliCampPerf',
        disabled: false,
        toolTip: etiquetas.textToolTipHelp,
        //icon: perfil.dirImg + 'ayuda.png',
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 104,
                alt: true
            }
        },
        menu:
            new Ext.menu.Menu({
                id: 'mainMenu',
                items: [
                    {
                        handler: function() {
                            cargarAyuda();
                        }, text: etiquetas.lbBtnAyuda,
                        id: 'btnAyuDesktop',
                        //icon: perfil.dirImg + 'ayuda.png',
                        iconCls: 'ayuda',
                        tooltip:etiquetas.tooltipAyuda
                    },
                    {
                        text: etiquetas.lbBtnAcercaDe,
                        id: 'acercade',
                       // icon: perfil.dirImg  + 'info.png',
                        iconCls: 'info',
                        tooltip: etiquetas.lbBtnAcercaDe +"<b>(Alt+...s)</b>",
                        handler: function() {

                            var uri = "seguridad";
                            acercaDe.show(uri);
                        }}
                ]
            })

    });    
    ////------------ Arbol Acciones ------------////
    arbolAccLoader = new Ext.tree.TreeLoader({
        dataUrl:'cargarSistFuncAcc',
        listeners:{
            'beforeload':function(atreeloader, anode) {
                iddominio = atreeloader.baseParams.iddominio;
                atreeloader.baseParams = {};
                atreeloader.baseParams.iddominio = iddominio;
                if (anode.attributes.idfuncionalidad)
                    atreeloader.baseParams.idfuncionalidad = anode.attributes.idfuncionalidad;
                else if(anode.attributes.idsistema)
                    atreeloader.baseParams.idsistema = anode.attributes.idsistema;
            }
        }
    });
			
    arbolAcc = new Ext.tree.TreePanel({
        title:etiquetas.lbTitArbolSistemas,
        collapsible:true,
        autoScroll:true,
        region:'east',
        disabled:true,
        disabledClass:'panel-disabled-class-without-zindex',
        split:true,
        width:'37%',
        loader: arbolAccLoader,
        listeners:{
            'load':function(node) {
                node.childNodes.forEach(function(a){
                    if(a.attributes.checked) {
                        if (typeof(a.attributes.idfuncionalidad) != "undefined")
                            arrCheckFuncionalidad[a.attributes.idfuncionalidad] = a.attributes.idfuncionalidad;
                        else if (typeof(a.attributes.idrecurso) != "undefined")
                            arrCheckRecurso[a.attributes.idrecurso] = a.attributes.idrecurso;
                    }
                });
            }
        }
    });
		
    ////------------ Crear nodo padre del arbol ------------////
    padreArbolAcc = new Ext.tree.AsyncTreeNode({
        text:etiquetas.lbRootNodeArbolSubsist,
        expandable:false,
        id:'0'
    });
			      
    arbolAcc.setRootNode(padreArbolAcc);
		
    arbolAcc.on('checkchange', function (node, e) {
        arbolAcc.suspendEvents();
        updateArrayDeschequeados(node);
        if (node.attributes.checked) {
            marcarPadre(node.parentNode, true);
        }
        marcarHijos(node, node.attributes.checked);
        var nodos = arbolAcc.getChecked();

        var hasChange = false;
        var esta = false;
        var pos = 0;
        for(var key in arrCheckFuncionalidad){
            if(arrCheckFuncionalidad.hasOwnProperty(key)){
                esta = false;
                for(var i = 0;i<nodos.length;i++){
                    var idfuncionalidad = nodos[i].attributes.idfuncionalidad;
                    if(idfuncionalidad && idfuncionalidad == key){
                        esta = true;
                        pos  = i;
                        break;
                    }
                }
                if(esta){
                    nodos.splice(pos,1);
                }else{
                    hasChange = true;
                }
            }
        }
        if(!hasChange) {
            for (var key in arrCheckRecurso) {
                if (arrCheckRecurso.hasOwnProperty(key)) {
                    esta = false;
                    for(var i = 0;i<nodos.length;i++){
                        var idrecurso = nodos[i].attributes.idrecurso;
                        if(idrecurso && idrecurso == key){
                            esta = true;
                            pos  = i;
                            break;
                        }
                    }
                    if(esta){
                        nodos.splice(pos,1);
                    }else{
                        hasChange = true;
                    }
                }
            }
            if(hasChange)
                Ext.getCmp('acetpChange').enable();
            else {
                if(nodos.length){
                    for(var i = 0; i < nodos.length ;i++){
                        if (!nodos[i].attributes.idsistema){
                            hasChange = true;
                            break;
                        }
                    }
                }
                if(!hasChange)
                    Ext.getCmp('acetpChange').disable();
                else
                    Ext.getCmp('acetpChange').enable();
            }
        }else {
            Ext.getCmp('acetpChange').enable();
        }
        arbolAcc.resumeEvents();
    }, this);
		
    function updateArrayDeschequeados (node) {
        var esta = -1;
        var idrecurso = node.attributes.idrecurso;
        var idfuncionalidad = node.attributes.idfuncionalidad;
        var idsistema = node.attributes.idsistema;
        if (idrecurso) {
            if(node.attributes.checked) {
                esta = estaEnDeschequeados(arrayAccEliminar, idrecurso);
                if(esta != -1)
                    eliminarEnDeschequeados(arrayAccEliminar, esta);
            } else {
                if(arrCheckRecurso[idrecurso]) {
                    adicionarEnDeschequeados(arrayAccEliminar, idrecurso);
                }
            }
        } else if (idfuncionalidad) {
            if(node.attributes.checked) {
                esta = estaEnDeschequeados(arrayFuncEliminar, idfuncionalidad);
                if(esta != -1)
                    eliminarEnDeschequeados(arrayFuncEliminar, esta);
                esta = estaEnDeschequeados(arrayPadresEliminar, idfuncionalidad)
                if(!node.isLeaf() && esta != -1)
                    eliminarEnDeschequeados(arrayPadresEliminar, esta);
                if(!node.isLeaf() && node.childNodes.length == 0)
                    arrayPadres.push(idfuncionalidad);
            } else {
                if(arrCheckFuncionalidad[idfuncionalidad])
                    adicionarEnDeschequeados(arrayFuncEliminar, idfuncionalidad);
                if(!node.isLeaf() && node.childNodes.length == 0 && arrCheckFuncionalidad[idfuncionalidad]) {
                        adicionarEnDeschequeados(arrayPadresEliminar, idfuncionalidad);
                }
                var pos = estaEnDeschequeados(arrayPadres, idfuncionalidad)
                if(!node.isLeaf() && node.childNodes.length == 0 && pos != -1)
                    arrayPadres.splice(pos,1);
            }
        } else if (idsistema) {
            if(node.attributes.checked) {
                esta = estaEnDeschequeados(arraySistEliminar, idsistema);
                if(esta != -1)
                    eliminarEnDeschequeados(arraySistEliminar, esta);
            } else{
                adicionarEnDeschequeados(arraySistEliminar, idsistema);
            }
        }
    }

    function marcarPadre(nodo, check) {
        if(nodo && nodo.attributes.id != 0) {
            if(nodo.attributes.checked != check)
                cambiarEstadoCheck(nodo, check);
            marcarPadre(nodo.parentNode, check);
        }
    }
		
    function estaEnDeschequeados(arreglonodos, idnodo) {
        var cantidad = arreglonodos.length;
        for (p=0; p<cantidad; p++) {
            if(arreglonodos[p] == idnodo)
                return p;
        }
        return -1;
    }
			
    function marcarHijos(nodo,check) {
        nodo.eachChild(
            function(anodehijo) {
                if(anodehijo.attributes.checked != check)
                    cambiarEstadoCheck(anodehijo,check);
                if(anodehijo.childNodes.length > 0)
                    marcarHijos(anodehijo, check);
            },this);
    }
		
			
    /////------------ Arbol de dominios ------------////
    arbolDominios = new Ext.tree.TreePanel({
        autoScroll:true,
        region:'center',
        split:true,
        width:'37%',
        loader: new Ext.tree.TreeLoader({
            dataUrl:'cargarArbolDominios'
        }),
        listeners:{
            'click': function(anode, e) {
                Ext.getCmp('acetpChange').disable();
                arrCheckFuncionalidad = {};
                arrCheckRecurso = {};
                if(anode.attributes.iddominio != iddominioselec && iddominioselec != 0){
                    iddominioselec = anode.attributes.iddominio;
                    asignarSistFuncAccDominio(null, 0);	
                }
                else
                    iddominioselec = anode.attributes.iddominio;
                arbolAccLoader.baseParams = {};
                arbolAccLoader.baseParams.iddominio = anode.attributes.iddominio;
                arbolAcc.getRootNode().reload();
                arbolAcc.enable();
            }
        }
    });
    ////------------ Crear nodo padre del arbol ------------////
    padreArbolDominios= new Ext.tree.AsyncTreeNode({
        text: etiquetas.rootNameNode,
        expandable:false,
        expanded:true,
        id:'0'
    });         
	
    arbolDominios.setRootNode(padreArbolDominios);
		    
    btnguardarcambios.on('click',function(){
        asignarSistFuncAccDominio(null, 0);
    });
	
    ////------------ Panel con los componentes de roles y entidades ------------////
    panelUsuariosDominios = new Ext.Panel({
        layout:'border',
        region:'center',
        id			: 'grid1',
        keyMapGroup	: true,
        items:[arbolAcc,arbolDominios],
        tbar:['->',btnAyuda],
        buttons:[btnguardarcambios]
    });
	    
    ////------------ Viewport ------------////
    viewport = new Ext.Viewport({
        layout:'border',
        items:[panelUsuariosDominios]
    });
		
    function existIdInArray(arrayIdTotal, id) {
        for (var i = 0; i < arrayIdTotal.length; i++) {
            if (arrayIdTotal[i] == id)
                return true;
        }
        return false;
    }
		
    function addArrayIdNodo(arrayIdTotal, arrayIdNodo) {
        for (var i = 0; i < arrayIdNodo.length; i++) {
            var id = arrayIdNodo[i];  
            if (id && !existIdInArray(arrayIdTotal, id))
                arrayIdTotal.push(id);
        }
        return arrayIdTotal;
    }
		
    ////------------- Funciones -------------////
    function asignarSistFuncAccDominio(apl, record) {
        if (iddominio) {
            var arrayNodos = arbolAcc.getChecked();
            var arraySistemas = [];
            var arrayFuncionalidades = [];
            var arrayRecursos = [];
            var arrayId = [];
			    
            for (var i=0; i<arrayNodos.length; i++){
                arraySistemas = addArrayIdNodo(arraySistemas, arrayNodos[i].getPath('idsistema').split('/'));
                arrayFuncionalidades = addArrayIdNodo(arrayFuncionalidades, arrayNodos[i].getPath('idfuncionalidad').split('/'));
                arrayId = addArrayIdNodo(arrayId, arrayNodos[i].getPath('id').split('/'));
                arrayRecursos = addArrayIdNodo(arrayRecursos, arrayNodos[i].getPath('idrecurso').split('/'));
            }
            Ext.getBody().mask(etiquetas.waitingMsg);
            Ext.Ajax.request({
                url: 'insertarCompartimentacionSistFuncAcc',
                method:'POST',
                params:{
                    arraySistemas: Ext.encode(arraySistemas),
                    arrayFuncionalidades: Ext.encode(arrayFuncionalidades),
                    arrayRecursos: Ext.encode(arrayRecursos),
                    arrayPadres:Ext.encode(arrayPadres),
                    arrayPadresEliminar:Ext.encode(arrayPadresEliminar),
                    arraySistEliminar:Ext.encode(arraySistEliminar),
                    arrayFuncEliminar:Ext.encode(arrayFuncEliminar),
                    arrayAccEliminar:Ext.encode(arrayAccEliminar),
                    iddominio:iddominio
                },
                callback: function (options,success,response) {
                    Ext.getBody().unmask();
                    arrayPadresEliminar = [];
                    responseData = Ext.decode(response.responseText);
                    if(responseData.success){
                        mostrarMensaje(7, etiquetas.msgSuccesInsertComp);
                        arbolAccLoader.load(arbolAcc.getRootNode());
                        arbolAcc.getRootNode().expand();
                        arrayPadresEliminar = [];
                        arrayAccEliminar = [];
                        arraySistEliminar = [];
                        arrayFuncEliminar = [];
                        arrayPadres = [];
                        Ext.getCmp('acetpChange').disable();
                    }else{
                        mostrarMensaje(6, etiquetas.msgFailInsertComp);
                    }

                }
            });
        }
    }
		
    ////------------ Funciones Auxiliares ------------////
    function estaEnDeschequeados(arreglonodos, idnodo) {
        var cantidad = arreglonodos.length;
        for (p=0; p<cantidad; p++) {
            if(arreglonodos[p] == idnodo)
                return p;
        }
        return -1;
    }
	        
    function eliminarEnDeschequeados(arreglo, pos) {
        arreglo.splice(pos,1);
    }
		
    function adicionarEnDeschequeados(arreglo, id) {
        if(estaEnDeschequeados(arreglo, id) == -1)
            arreglo.push(id);
    }
		
    ////------------ Auxiliar para marcar y desmarcar nodos ------------////
    function cambiarEstadoCheck(anodehijo,check) {
        if(anodehijo.attributes.checked != check) {
            anodehijo.getUI().toggleCheck(check);
            anodehijo.attributes.checked = check;
            updateArrayDeschequeados(anodehijo);
        }
    }
		
    function buscarNodosTiene(nodo) {
        nodo.eachChild(
            function(anodehijo) {
                if(!anodehijo.attributes.checked && !anodehijo.isLeaf() && anodehijo.attributes.tiene && anodehijo.childNodes.length == 0)
                    arrayTiene.push(anodehijo.attributes.id);
                if(anodehijo.childNodes.length > 0)
                    buscarNodosTiene(anodehijo);
            },this
            );
    }
		
    function marcarArriba(nodo) {
        if(nodo.attributes.id != 0) {
            cambiarEstadoCheck(nodo.parentNode,true);
            marcarArriba(nodo.parentNode);
        }
    }
		
    function marcarHijos(nodo,check) {
        nodo.eachChild(
            function(anodehijo) {
                if(anodehijo.attributes.checked != check)
                    cambiarEstadoCheck(anodehijo,check);
                if(anodehijo.childNodes.length > 0)
                    marcarHijos(anodehijo, check);
            },this
            );
    }
		
    function estadoTodosHijos(nodo, opcion) {
        resultado = true;
        nodo.eachChild(
            function(anodehijo) {
                if(anodehijo.attributes.checked != opcion)
                    resultado = false;    
            },this
            );
        return resultado;
    }
        
    function cargarAyuda(){	
        var title	= 'Ayuda de compartimentaci&oacute; de sistemas';
        var referencia	= 'seguridad/compartimentacionSistemas';
        help.show(title,referencia);
    }
        
}
