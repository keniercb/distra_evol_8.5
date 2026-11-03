 var vCompGen; var vGridGen; var btnEliminar; var btnModificar,root,root_comp; var btnAdicionar; var selecModeGrid;var loader_comp; var store;var accion;var urlForm;var filaSelecGrid;var nodo;var nodosel;var idtabla;var loaderEstructura;var win;var btOrganigrama;var mytree;
 var perfil = window.parent.UCID.portal.perfil;
 var idLugar,idesp;
 Ext.MessageBox.buttonText.yes = "Si";
Ext.MessageBox.buttonText.ok = "Aceptar";



function creaArrayItems(aJSonItems){
	var arrayItems = new Array();
	for (var i=1;i<=aJSonItems[0].cantidad;i++)
		arrayItems.push(dameArrayColumn(aJSonItems,aJSonItems[0].cantidad,i))
	return arrayItems;

}
//Para crear el arreglo de columnas
function dameArrayColumn(aJSonItems,noCol,pos){
                //alert(aJSonItems[0].cantidad);
		if (noCol == 1) return {columnWidth:1,  layout: 'form',items:dameItem(aJSonItems[pos].xtype,pos,aJSonItems)};
		if (noCol == 2) return {columnWidth:.5, layout: 'form',items:dameItem(aJSonItems[pos].xtype,pos,aJSonItems)};
		if (noCol >= 3) return {columnWidth:.33,layout: 'form',items:dameItem(aJSonItems[pos].xtype,pos,aJSonItems)};
}
//Para devolver un item especifico (El chek y radio por ahora no funciona, hay que acomodarlos.)

function dameItem(xtype,pos,aJSonItems){
	var exp = null;
	if(aJSonItems[pos].regex!=""){
		eval("exp="+aJSonItems[pos].regex);
		}
		if (xtype == 'textfield')
		 {
		 	var blanco=false;
		 	if(aJSonItems[pos].id=='idespecialidad1')
		 	blanco=true;
				return {
					xtype:'textfield',
					allowBlank:aJSonItems[pos].allowBlank,
					fieldLabel: aJSonItems[pos].fieldLabel,
					id: aJSonItems[pos].id,
                    enableKeyEvents: true,
                    maxLength:aJSonItems[pos].maxLength,
					name:aJSonItems[pos].name,
					regex:exp,
					anchor:'95%',
					listeners :{ beforerender:function(){
											  if(aJSonItems[pos].value != "")this.value= aJSonItems[pos].value;
											  if(this.id=='iddpa1'){idLugar =  aJSonItems[pos].valueid;}
											  if(this.id=='idespecialidad1')idesp =  aJSonItems[pos].valueid;
											   },
								focus:function(){
								    if(this.id=='iddpa1')
									   {

									  	 abrirTree();
									   //this.readOnly=true;
									   }
									if(this.id=='idespecialidad1')   {

										abrirTreeEspecialidad();
									}
								}
								}
					};
					}

	if (xtype == 'timefield ')
	return {
			xtype:'timefield ',
			allowBlank:aJSonItems[pos].allowBlank,
			fieldLabel: aJSonItems[pos].fieldLabel,
			id: aJSonItems[pos].id,
			maxLength:aJSonItems[pos].maxLength,
			name:aJSonItems[pos].name,
			regex:aJSonItems[pos].regex,
			anchor:'95%',
			format:'d-m-Y',
			listeners :{ beforerender:function(){
								  if(aJSonItems[pos].value != "")
								   this.value= aJSonItems[pos].value;
								   }
					}
			};
	if (xtype == 'textarea')
		return {
				xtype:'textarea',
				allowBlank:aJSonItems[pos].allowBlank,
				fieldLabel: aJSonItems[pos].fieldLabel,
				id: aJSonItems[pos].id,
				maxLength:aJSonItems[pos].maxLength,
				name:aJSonItems[pos].name,
				regex:aJSonItems[pos].regex,
				anchor:'95%',
				listeners :{ beforerender:function(){
								  if(aJSonItems[pos].value != "")
								   this.value= aJSonItems[pos].value;
								   }
					}
				};
	if (xtype == 'numberfield')
		return {
				xtype:'numberfield',
				allowBlank:aJSonItems[pos].allowBlank,
				fieldLabel: aJSonItems[pos].fieldLabel,
				id: aJSonItems[pos].id,
				maxLength:aJSonItems[pos].maxLength,
				name:aJSonItems[pos].name,
				regex:aJSonItems[pos].regex,
				anchor:'95%',
				listeners :{ beforerender:function(){
								  if(aJSonItems[pos].value != "")
								   this.value= aJSonItems[pos].value;
								   }
					}
				};
	if (xtype == 'datefield')
	 {

	    var valor=null;
		 if(aJSonItems[pos].id=="fi")
		  {
		  valor=new Date();

		  }
		 else
		 valor=aJSonItems[pos].value

	return {
			xtype:'datefield',
			fieldLabel: aJSonItems[pos].fieldLabel,
			id: aJSonItems[pos].id,
			maxLength:aJSonItems[pos].maxLength,
			name:aJSonItems[pos].name,
			regex:aJSonItems[pos].regex,
            editable: true,
            enableKeyEvents: true,
            value : valor,
			anchor:'95%',
			readOnly:true,
			format:'d-m-Y',
			listeners :{ beforerender:function(){
								   if(aJSonItems[pos].id == "fi")
								    	this.allowBlank = aJSonItems[pos].allowBlank;
								   }
					},
			value:valor
		}}
	if (xtype == 'combo')
			return {
					xtype:'combo',
					triggerAction:'all',
					forceSelection:true,
					editable:false,
					fieldLabel: aJSonItems[pos].fieldLabel,
					id: aJSonItems[pos].id,
					maskRe:aJSonItems[pos].regex,
					anchor:'95%',
					displayField:'displayField',
					valueField:aJSonItems[pos].name,//'valueField',
					hiddenName:aJSonItems[pos].name,
					allowBlank:aJSonItems[pos].allowBlank,
					mode:'local',
					autoCreate: true,
					listeners :{beforerender:function(){
								  if( aJSonItems[pos].valueid != "")
								   this.value=  aJSonItems[pos].valueid;
								   var n = aJSonItems[pos].name;
								   }
					},
					store:new Ext.data.SimpleStore({
								fields:[aJSonItems[pos].name,'displayField'],
								data:aJSonItems[pos].data})

					};
	if (xtype == 'radio') 	 	 return {xtype:'radio',	 		 fieldLabel: aJSonItems[pos].fieldLabel,id: aJSonItems[pos].id,checked:aJSonItems[pos].checked,name:aJSonItems[pos].name,anchor:'95%'};
	if (xtype == 'checkbox') 	 return {xtype:'checkbox',	 fieldLabel: aJSonItems[pos].fieldLabel,id: aJSonItems[pos].id,checked:aJSonItems[pos].checked,name:aJSonItems[pos].name,anchor:'95%'};
}



