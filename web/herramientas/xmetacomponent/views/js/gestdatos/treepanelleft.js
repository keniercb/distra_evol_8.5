/***	TreePanel	***/

trCasoUso = new Ext.tree.TreePanel({
	autoScroll:true,
	autoHeight:true,
	border:false,
	contextMenu:new Ext.menu.Menu({ // 000000
		 id: 'trMenu',
		 items: [{
			text: 'Adicionar modelo',
			icon:perfil.dirImg  + 'abrirventana.png',
			iconCls:'btn',
			id:'addmodelo',
			handler : function(){
				alert(1);
			}
		}]
	}),
	rootVisible: false,

	listeners:{click:function(n,e){
		switch(n.attributes.tipo){
			case 0: pC.layout.setActiveItem('pb');
			break;
			case 1: pC.layout.setActiveItem('pp');
			break;
			case 2: pC.layout.setActiveItem('pm');
				treesel = n.id;
				btnAddIndPlan.disable();
				btnModIndPlan.disable();
				btnEliIndPlan.disable();
				cargarconfgrid();
			break;
			
		}
	},beforeload:function(n,e){
		pT.el.mask('Por favor espere .....');
		
		},
		load:function(n,e){
		
		pT.el.unmask();
		},
		contextmenu:function(n,e){
		n.select();
		trCasoUso.fireEvent('click',n);   
            var c = n.getOwnerTree().contextMenu;
            c.contextNode = n;
            c.showAt(e.getXY());
	}},
	loader: new Ext.tree.TreeLoader({
		dataUrl:'cargartreeplanes',
	})
});
/***	Insertando Nodo Raiz	***/
var rootNode = new Ext.tree.AsyncTreeNode({
	text:'Planes',
	tipo:0,
	expanded:true,
	id:'0'
});
trCasoUso.setRootNode(rootNode);


