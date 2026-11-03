UCID.portal.cargarEtiquetas('fichausuario', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar variables ------------////
var panelUsuariosDominios,storeGridRol,idrol,nodo,gridRol,sm, smrol;

////------------ Funcion Cargar Interfaz ------------////
function cargarInterfaz(perfil,etiquetas)
{	
////------------ Modo de seleccion del grid de usuarios ------------////
sm = new Ext.grid.RowSelectionModel({singleSelect:false});

////------------ Eventos ------------////
sm.on('rowselect', function (smodel, rowIndex, record)
{
	idrol = record.data.idrol;
	arbolDominios.enable();
	arbolDominios.getRootNode().reload();
	auxRecord = record;
}, this);
	
////------------Store para cargar el grid de roles---------------////
storeGridUsuarios =  new Ext.data.Store({
    url: 'cargarRolesUsuario',
    reader:new Ext.data.JsonReader({
        totalProperty: "cantidad_filas",
        root: "datos",
        id: "id"
    },
    [
    {name:'idrol',mapping:'id'},
    {name:'denominacion',mapping:'text'}
    ])    
});

////------------ Creando el Grid de roles ------------////
gridUsuarios = new Ext.grid.GridPanel({  
    region:'center',
    frame:true,
    width:400,
    iconCls:'icon-grid',    
    autoExpandColumn:'expandir',
    margins:'2 2 2 -4',
    store:storeGridUsuarios,
    sm:sm,
    columns: [
                {header: etiquetas.lbRol, width:150, dataIndex: 'denominacion', id:'expandir'},
                {hidden: true, hideable: false, dataIndex: 'idrol'}
             ],
    
    loadMask:{store:storeGridUsuarios},   
    bbar:new Ext.PagingToolbar({
            pageSize: 15,
            store: storeGridUsuarios,
            displayInfo: true,
            displayMsg: etiquetas.lbTitMsgResultados,
            emptyMsg: etiquetas.lbTitMsgNingunresultadoparamostrar
    })
});

/////------------ Arbol de entidades que estan en mi dominio ------------////
arbolDominios = new Ext.tree.TreePanel({
    autoScroll:true,
    region:'east',
    split:true,
    disabled:true,           
    width:250,
    loader:new Ext.tree.TreeLoader({
        dataUrl:'cargarentidadesReporte',
        listeners:{'beforeload':function(atreeloader, anode){ 
                        atreeloader.baseParams = {};
                        atreeloader.baseParams.idusuario = document.getElementById('hidusuario').value;
                        atreeloader.baseParams.iddominio = document.getElementById('hiddominio').value;
                        atreeloader.baseParams.idrol = idrol;
                       
                }
        } 
})
});

////------------ Crear nodo padre del arbol ------------////
padreArbolDominios= new Ext.tree.AsyncTreeNode({
      text: 'Dominios',
      expandable:false,
      id:'0'
});         

arbolDominios.setRootNode(padreArbolDominios);
	
 panelDatosUsuarios = new Ext.Panel({
		title: 'Datos del usuario',
	    region:'west',
	    split:true,
	    width:260,
	    html: jsonficha.html
	});
	////------------ Panel con los componentes de roles y entidades ------------////
    /*panelUsuariosDominios = new Ext.Panel({
    	layout:'border',
        region:'center',
        items:[panelDatosUsuarios,gridUsuarios,arbolDominios]
    });*/
 
    ////------------ Viewport ------------////
    viewport = new Ext.Viewport({
    	layout:'border',
    	items:[gridUsuarios,arbolDominios,panelDatosUsuarios]
    })
    storeGridUsuarios.baseParams = {};
    storeGridUsuarios.baseParams.idusuario = document.getElementById('hidusuario').value;
	storeGridUsuarios.load({params:{start:0,limit:15}});	
}