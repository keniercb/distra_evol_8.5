// Creando el ambito de objetos (Ext.UCID)
if (!Ext.UCID) Ext.namespace('Ext.UCID');

Ext.UCID.integraInterfaz = function(obj,objParent){
	if(obj && obj.isXType('treepanel') && objParent && objParent.setValue){
		obj.on('dblclick',function(nodo){
			objParent.collapse();
			objParent.setValue(nodo.text);
			if (typeof(objParent.onSelectNodo)== 'function') objParent.onSelectNodo(nodo);
			if (objParent.sendIdNodo) colocaValueField(nodo);
		});
		// Funcion para colocar el id del nodo, que quedaria como valuefield del combo.
		// Lo hacemos colocando un imput hidden en el formulario para que se envie.
		function colocaValueField(nodo){
			if (objParent.findParentByType('form'))
				var formCombo = objParent.findParentByType('form');
			if(formCombo){
				if (formCombo.getComponent(objParent.valueField) && formCombo.getComponent(objParent.valueField).isXType('hidden')){
					formCombo.getComponent(objParent.valueField).setValue(nodo.id);
					//console.info(formCombo.getComponent(objParent.valueField));
					objParent.nodoSelected = nodo;
				} else if (formCombo){ formCombo.insert(0,{xtype:'hidden',id:objParent.valueField}).setValue(nodo.id);formCombo.doLayout();}
			}else{
			   objParent.nodoSelected = nodo;
			}
		}
	}
	if(obj && obj.isXType('grid') && objParent && objParent.dataIframe){
		obj.getSelectionModel().on('rowselect',function(sm, row, record){
			objParent.dataIframe = sm.getSelections();
		});
		obj.getSelectionModel().on('rowdeselect',function(sm, row, record){
			objParent.dataIframe = sm.getSelections();
		});
		obj.on('rowdblclick',function(){
			if (objParent.doAction) objParent.doAction(objParent.dataIframe);
		});
	}
}// Endof integraInterfaz
