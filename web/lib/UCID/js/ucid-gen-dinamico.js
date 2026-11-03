// Creando el ambito de objetos (Ext.UCID)
if (!Ext.UCID) Ext.namespace('Ext.UCID');

Ext.UCID.generaDinamico = function(tipo,obj_json){
	switch(tipo){
		case 'form':{
			return dameArrayItems(obj_json);
		}break;
		case 'grid':{
		
		}break;
		case 'store':{
		
		}break;
		case 'cm':{
			return dameColumnModel(obj_json);
		}break;
		case 'reader':{
		
		}break;
		case 'rdcampos':{
			return dameReaderCampos(obj_json);
		}break;
	}
	// Para gestion dinamica de un formulario.
	function dameArrayItems(objitems){
		var arrayItems = new Array();
		for (var i=1;i<=objitems[0].cantidad;i++){
			arrayItems.push(dameColumn(objitems,objitems[0].cantidad,i))
		}
		return arrayItems;
	}
	function dameColumn(objitems,noCol,pos){
		if (noCol == 1) return {columnWidth:1,  layout: 'form',items:dameItemForm(objitems[pos])};
		if (noCol == 2) return {columnWidth:.5, layout: 'form',items:dameItemForm(objitems[pos])};
		return {columnWidth:.33,layout: 'form',items:dameItemForm(objitems[pos])};
	}
	function dameItemForm(objitem){
		if (objitem.xtype == 'numberfield')  	
			return {xtype:'numberfield',
					fieldLabel: objitem.fieldLabel,
					id: objitem.id,
					maxLength:objitem.maxLength,
					name:objitem.name,
					regex:eval(objitem.regex),
					anchor:(objitem.anchor)?objitem.anchor:'95%',
					allowBlank:(objitem.allowBlank)?objitem.allowBlank:false};
		if (objitem.xtype == 'datefield')  	
			return {xtype:'datefield',
					fieldLabel: objitem.fieldLabel,
					id: objitem.id,
					maxLength:objitem.maxLength,
					name:objitem.name,
					regex:eval(objitem.regex),
					anchor:(objitem.anchor)?objitem.anchor:'95%',
					allowBlank:(objitem.allowBlank)?objitem.allowBlank:false,
					readOnly:true};
		if (objitem.xtype == 'hidden')
			return {xtype:'hidden',
					id: objitem.id,
					name:objitem.name};
		if (objitem.xtype == 'combo')
			return {xtype:'combo',
					fieldLabel: objitem.fieldLabel,
					maxLength:objitem.maxLength,
					mode:'local',
					displayField:'displayField',
					triggerAction: 'all',
					hiddenName:objitem.id,
					emptyText:'[Seleccionar]',
					readOnly:true,
					anchor:(objitem.anchor)?objitem.anchor:'95%',
					allowBlank:(objitem.allowBlank)?objitem.allowBlank:false,
					valueField:'valueField',
					store:new Ext.data.SimpleStore({fields:['displayField','valueField'],data:objitem.data})};
		return {xtype:'textfield',
				fieldLabel: objitem.fieldLabel,
				id: objitem.id,
				maxLength:objitem.maxLength,
				name:objitem.name,
				regex:eval(objitem.regex),
				anchor:'95%',
				allowBlank:objitem.allowBlank};
	}
	// Para gestion dinamica de un grid.
	function dameStore(objstore){
		return new Ext.data.Store({
			url: objstore.url,
			reader:dameReaderCampos(objstore)
		})
	}
	function dameColumnModel(objcolumns){
		return new Ext.grid.ColumnModel(objcolumns);
	}
	function dameReader(objrd){
		return new Ext.data.JsonReader({
			root:(objrd.rdRoot)?objrd.rdRoot:'aroot',
			id:(objrd.rdId)?objrd.rdId:'id',
			totalProperty:(objrd.rdTotRec)?objrd.rdTotRec:0
			},dameReaderCampos(objrd.rdCampos)
		)
	}
	function dameReaderCampos(objrdcampos){
		return (typeof(objrdcampos) == 'object')?objrdcampos:[];
	}
}// Endof integraInterfaz

//alert ('ok');
//alert (typeof([]));

/*****

Ejemplo de json para grid
{grid:	{columns:[{id:'expandir',width:100, header: 'Claro que sirvio', dataIndex: 'nombre'},
				{header: 'Fecha de inicio', width:100, dataIndex: 'finicio'},
				{header: 'Fecha de fin', width:100, dataIndex: 'ffin'}]
		},
		{store:{url:'accion',
			  rdRoot:'datos',
			  rdId:'nombre', 
			  rdTotRec:'totalRec',
			  rdCampos:[{name: 'nombre'},
						{name: 'finicio'},
						{name: 'ffin'}],
			  }
		},
		{title:'titulo'}}

*****/