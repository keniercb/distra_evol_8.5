
/**
 Uso:Componente para realizar la busqueda de formas y sistemas de pago.

  * ---------------------------------------------

  * 15 de Abril de 2013 |   Nomina
  *

  * @extends Ext.Panel
  * @xtype
  * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
  * @version 1.0.0
  * Tipos: 1 - Forma de pago, 2 - Sistema de pago, 3 - Periodo de pago
  */
Ext.ns('Pvd.nomina.nomencladores');
Ext.QuickTips.init();
Pvd.nomina.nomencladores.Utils = function() {
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
var utils = new Pvd.nomina.nomencladores.Utils();

/*Componente panelBuscarestructura*/
Pvd.nomina.nomencladores.FormaSistemaPagoComp = Ext.extend(Ext.Panel,{
    region:(this.region ? this.region : 'center'),
    layout:(this.layout ? this.layout : 'fit'),
    frame:false,
    border: (this.border ? this.border : false),
    selecciontipo: (this.selecciontipo ? this.selecciontipo : 3),
    hojatipo: (this.hojatipo ? this.hojatipo : 3),
    arbol: null,
    initComponent: function() {
		
        this.nodoraiz = new Ext.tree.AsyncTreeNode({
            text:(this.selecciontipo == 2 ? 'Formas y sistemas de pago' : 'Formas, sistemas y per&iacute;odos de pago'),
            expanded: true,
            id: '-1'
        });
		
        this.smFormaSistemaPago = new Ext.tree.DefaultSelectionModel({
			listeners: {
                selectionchange: function( defsm, nodo){
                    if(defsm.getSelectedNode() != null){
						for(var i = 0; i < this.selecciontipo.length; i++){
							if(this.selecciontipo[i] == nodo.attributes.tipo){
								this.fireEvent('nodoselecionado',this, defsm.getSelectedNode());
								return;
							}else{
							    this.fireEvent('nodoselecionado',this,defsm.getSelectedNode());
							}	
						}
                    } else {
                        this.fireEvent('nodonoselecionado', this,-1);
                    }
                }.createDelegate(this) 
            }
        });
		
        this.treeFormaSistemaPago = new Ext.tree.TreePanel({
            region: 'center',
            rootVisible:true,
            autoScroll:true,
            border: false,
            layout: 'fit',
            loader: new Ext.tree.TreeLoader({
                url:'/pvd/nomina/index.php/formasistemapagocomp/obtenerformasistemapago',
                baseParams: {tipo: -1, hojatipo: this.hojatipo, idnodo:-1}
            }),
            selModel: this.smFormaSistemaPago,
            root: this.nodoraiz
        }); 
        
		//Boton de recargar el arbol.
        this.btnRecargarFormaP = new Ext.Button({
            id: 'btnRecargarFormaP',
            text: 'Recargar',
            tooltip: 'Recargar formas y sistemas de pago',
            iconCls: 'reevaluacion',
        });
                
        this.tbar = [this.btnRecargarFormaP];
		
        this.items = [this.treeFormaSistemaPago];
        Pvd.nomina.nomencladores.FormaSistemaPagoComp.superclass.initComponent.call(this);
        
        this.btnRecargarFormaP.on('click' ,function(){
		        this.treeFormaSistemaPago.getRootNode().collapse(true);
		     
		}.createDelegate(this));
	
        this.treeFormaSistemaPago.getLoader().on('beforeload' ,function( t, nodo, callback ){
			if(nodo.id == '-1'){
				this.treeFormaSistemaPago.getLoader().baseParams.tipo = 1;
				this.treeFormaSistemaPago.getLoader().baseParams.idnodo = nodo.attributes._id;
			}else if(nodo.attributes.tipo == 1){
				this.treeFormaSistemaPago.getLoader().baseParams.tipo = 2;
				this.treeFormaSistemaPago.getLoader().baseParams.idnodo = nodo.attributes._id;
			}else if(nodo.attributes.tipo == 2){
				this.treeFormaSistemaPago.getLoader().baseParams.tipo = 3;
				this.treeFormaSistemaPago.getLoader().baseParams.idnodo = nodo.attributes._id;
			}
			
		}.createDelegate(this)); 
        
		this.arbol = this.treeFormaSistemaPago;
    },
	Cargar: function(nodo, esraiz){
		if(esraiz == "" || esraiz == false){
			return;
		}else{
			nodo.expand();
		}
	},
    getSeleccion: function(){
        return this.smFormaSistemaPago.getSelectedNode();
    },
    getSeleccionados: function(){
        return this.treeFormaSistemaPago.getChecked();
    },
    limpiarSeleccion: function(){
        return this.treeFormaSistemaPago.getSelectionModel().clearSelections();
    }
});
