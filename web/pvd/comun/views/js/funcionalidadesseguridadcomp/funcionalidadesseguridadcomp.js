
/**
 Uso:Componente para mostrar las funcionalidades asociadas a un usuario.

  * ---------------------------------------------

  * 31 de Julio 2012 |   PVD
  *

  * @extends Ext.Panel
  * @xtype
  * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
  * @version 1.0.0
  */
Ext.ns('Ext.pvd.persona.mostrarfuncionalidades');
Ext.QuickTips.init();
Ext.pvd.persona.mostrarfuncionalidades.Utils = function() {
    return {
        loadMask : function(msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg : msj
            });
            this.lMask.show();
        },
        hideMask : function() {
            this.lMask.hide();
        }
    }
};
var utils = new Ext.pvd.persona.mostrarfuncionalidades.Utils();

/*Componente panelBuscarestructura*/
Ext.pvd.persona.mostrarfuncionalidades.panelFuncionalidadesseguridad = Ext.extend(Ext.Panel,{
    region:(this.region ? this.region : 'center'),
    layout:(this.layout ? this.layout : 'fit'),
    frame:false,
    border: false,
    idCmp: this.idCmp,
    initComponent: function() {
        this.seleccion = null;
		var idCmp = this.id;
		this.nodoraiz = new Ext.tree.AsyncTreeNode({
	            text:'Funcionalidades',
		    id: '-1'
                });
		
		this.smArbol = new Ext.tree.DefaultSelectionModel({
		    listeners: {
			    selectionchange: function( defsm, nodo){
					if(defsm.getSelectedNode() != null){
						this.fireEvent('funcionalidadselecionada',this, defsm.getSelectedNode());
					} else {
					    this.fireEvent('funcionalidadnoselecionada', this,-1);
					}
				}.createDelegate(this) 
			}
		});
		
		this.arbol = new Ext.tree.TreePanel({
                    id:'arbolseguridad'+idCmp,
                    region: 'center',
                    rootVisible:true,
                    autoScroll:true,
                    border: false,
                    layout: 'fit',
                    loader: new Ext.tree.TreeLoader({
                        url:'/pvd/comun/index.php/funcionalidadesseguridadcomp/mostrarfuncionalidadesseguridad',
			baseParams: {src:this.src}
                    }),
		    selModel: this.smArbol,
                    root: this.nodoraiz,
                    listeners: {
			render : function(){
                            this.nodoraiz.expand();
                        }.createDelegate(this)					
                    }
		});
                
            this.items = [this.arbol];
            Ext.pvd.persona.mostrarfuncionalidades.panelFuncionalidadesseguridad.superclass.initComponent.call(this);

    }	
	
});
