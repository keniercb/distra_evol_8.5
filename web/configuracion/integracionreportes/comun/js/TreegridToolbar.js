Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil
perfil.etiquetas = Object();

//-------------------conf. de bbar para interfaz principal de objetivos y act-----------
var offset = 0;
var limit = 10;
var totalpaginas = 0;
var countpag = 0;
var tfpagactual,tfpagtotal,tftotalobjencontrados;
var btnatras,btnalante;


tfpagactual = new Ext.form.TextField({
		id: 'tfpagactual',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tfpagtotal = new Ext.form.TextField({
		id: 'tfpagtotal',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tftotalobjencontrados = new Ext.form.TextField({
		id: 'tftotalobjencontrados',
		value:countpag,
		readOnly:true, 
		width: 30
	});

	

btnatras = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargar('atras');}, id:'btnatras', icon:perfil.dirImg+'anterior.png', iconCls:'btn', tooltip:'Anterior '});
btnalante = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargar('alante');}, id:'btnalante', icon:perfil.dirImg+'siguiente.png', iconCls:'btn', tooltip:'Siguiente'});

function ActualizarDatosBbar(store)
{
	btnalante.disable();
	btnatras.disable();
	tftotalobjencontrados.setValue(store.getTotalCount());
	totalpaginas = (store.getTotalCount())/limit;
	if(totalpaginas%limit != 0)
	{totalpaginas = Math.ceil(totalpaginas);}
	tfpagtotal.setValue(totalpaginas);
	if(store.getTotalCount() > 0)
	{
	 switch(countpag)
	 {
	  case 0:
		countpag++;
		tfpagactual.setValue(countpag);
		ActualizarEstadoBotonesNav(store);
	  break;
	  
	  default:
		tfpagactual.setValue(countpag);
		ActualizarEstadoBotonesNav(store);
	 }
	}
	if(store.getTotalCount() == 0)
	{
		tfpagactual.setValue(0);
	}
}

function ActualizarEstadoBotonesNav(store)
{	
	if(countpag < totalpaginas)
	{
		btnalante.enable();
		if(countpag > 1){btnatras.enable();}		
	}
	else{
		if(countpag == totalpaginas)
		{
			if(countpag > 1){btnatras.enable();}
		}
	}
	
}
//-------------------------------------------------END-----------------------------------------------






//-------------------conf. de bbar para grid  ventana relacionar(desde act prncipal)-----------
var offsetp1 = 0;
var limitp1 = 10;
var totalpaginasp1 = 0;
var countpagp1 = 0;
var tfpagactualp1,tfpagtotalp1,tftotalobjencontradosp1;
var btnatrasp1,btnalantep1;


tfpagactualp1 = new Ext.form.TextField({
		id: 'tfpagactualp1',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tfpagtotalp1 = new Ext.form.TextField({
		id: 'tfpagtotalp1',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tftotalobjencontradosp1 = new Ext.form.TextField({
		id: 'tftotalobjencontradosp1',
		value:countpag,
		readOnly:true, 
		width: 30
	});

	

btnatrasp1 = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargarp1('atras');}, id:'btnatrasp1', icon:perfil.dirImg+'anterior.png', iconCls:'btn', tooltip:'Anterior '});
btnalantep1 = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargarp1('alante');}, id:'btnalantep1', icon:perfil.dirImg+'siguiente.png', iconCls:'btn', tooltip:'Siguiente'});

function ActualizarDatosBbarp1(store)
{
	btnalantep1.disable();
	btnatrasp1.disable();
	tftotalobjencontradosp1.setValue(store.getTotalCount());
	totalpaginasp1 = (store.getTotalCount())/limitp1;
	if(totalpaginasp1%limitp1 != 0)
	{totalpaginasp1 = Math.ceil(totalpaginasp1);}
	tfpagtotalp1.setValue(totalpaginasp1);
	if(store.getTotalCount() > 0)
	{
	 switch(countpagp1)
	 {
	  case 0:
		countpagp1++;
		tfpagactualp1.setValue(countpagp1);
		ActualizarEstadoBotonesNavp1(store);
	  break;
	  
	  default:
		tfpagactualp1.setValue(countpagp1);
		ActualizarEstadoBotonesNavp1(store);
	 }
	}
	if(store.getTotalCount() == 0)
	{
		tfpagactualp1.setValue(0);
	}
}

function ActualizarEstadoBotonesNavp1(store)
{	
	if(countpagp1 < totalpaginasp1)
	{
		btnalantep1.enable();
		if(countpagp1 > 1){btnatrasp1.enable();}		
	}
	else{
		if(countpagp1 == totalpaginasp1)
		{
			if(countpagp1 > 1){btnatrasp1.enable();}
		}
	}
	
}
//-------------------------------------------------END-----------------------------------------------







//-------------------conf. de bbar para grid plan ventana relacionar(desde objetivos)-----------
var offsetp3 = 0;
var limitp3 = 10;
var totalpaginasp3 = 0;
var countpagp3 = 0;
var tfpagactualp3,tfpagtotalp3,tftotalobjencontradosp3;
var btnatrasp3,btnalantep3;


tfpagactualp3 = new Ext.form.TextField({
		id: 'tfpagactualp3',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tfpagtotalp3 = new Ext.form.TextField({
		id: 'tfpagtotalp3',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tftotalobjencontradosp3 = new Ext.form.TextField({
		id: 'tftotalobjencontradosp3',
		value:countpag,
		readOnly:true, 
		width: 30
	});

	

btnatrasp3 = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargarp3('atras');}, id:'btnatrasp3', icon:perfil.dirImg+'anterior.png', iconCls:'btn', tooltip:'Anterior '});
btnalantep3 = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargarp3('alante');}, id:'btnalantep3', icon:perfil.dirImg+'siguiente.png', iconCls:'btn', tooltip:'Siguiente'});

function ActualizarDatosBbarp3(store)
{
	btnalantep3.disable();
	btnatrasp3.disable();
	tftotalobjencontradosp3.setValue(store.getTotalCount());
	totalpaginasp3 = (store.getTotalCount())/limitp3;
	if(totalpaginasp3%limitp3 != 0)
	{totalpaginasp3 = Math.ceil(totalpaginasp3);}
	tfpagtotalp3.setValue(totalpaginasp3);
	if(store.getTotalCount() > 0)
	{
	 switch(countpagp3)
	 {
	  case 0:
		countpagp3++;
		tfpagactualp3.setValue(countpagp3);
		ActualizarEstadoBotonesNavp3(store);
	  break;
	  
	  default:
		tfpagactualp3.setValue(countpagp3);
		ActualizarEstadoBotonesNavp3(store);
	 }
	}
	if(store.getTotalCount() == 0)
	{
		tfpagactualp3.setValue(0);
	}
}

function ActualizarEstadoBotonesNavp3(store)
{	
	if(countpagp3 < totalpaginasp3)
	{
		btnalantep3.enable();
		if(countpagp3 > 1){btnatrasp3.enable();}		
	}
	else{
		if(countpagp3 == totalpaginasp3)
		{
			if(countpagp3 > 1){btnatrasp3.enable();}
		}
	}
	
}

//-------------------------------------------------END-----------------------------------------------



//-------------------conf. de bbar para grid plan ventana relacionar(desde objetivos)-----------
var offsetp4 = 0;
var limitp4 = 10;
var totalpaginasp4 = 0;
var countpagp4 = 0;
var tfpagactualp4,tfpagtotalp4,tftotalobjencontradosp4;
var btnatrasp4,btnalantep4;


tfpagactualp4 = new Ext.form.TextField({
		id: 'tfpagactualp4',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tfpagtotalp4 = new Ext.form.TextField({
		id: 'tfpagtotalp4',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tftotalobjencontradosp4 = new Ext.form.TextField({
		id: 'tftotalobjencontradosp4',
		value:countpag,
		readOnly:true, 
		width: 30
	});

	

btnatrasp4 = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargarp4('atras');}, id:'btnatrasp4', icon:perfil.dirImg+'anterior.png', iconCls:'btn', tooltip:'Anterior '});
btnalantep4 = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargarp4('alante');}, id:'btnalantep4', icon:perfil.dirImg+'siguiente.png', iconCls:'btn', tooltip:'Siguiente'});

function ActualizarDatosBbarp4(store)
{
	btnalantep4.disable();
	btnatrasp4.disable();
	tftotalobjencontradosp4.setValue(store.getTotalCount());
	totalpaginasp4 = (store.getTotalCount())/limitp4;
	if(totalpaginasp4%limitp4 != 0)
	{totalpaginasp4 = Math.ceil(totalpaginasp4);}
	tfpagtotalp4.setValue(totalpaginasp4);
	if(store.getTotalCount() > 0)
	{
	 switch(countpagp4)
	 {
	  case 0:
		countpagp4++;
		tfpagactualp4.setValue(countpagp4);
		ActualizarEstadoBotonesNavp4(store);
	  break;
	  
	  default:
		tfpagactualp4.setValue(countpagp4);
		ActualizarEstadoBotonesNavp4(store);
	 }
	}
	if(store.getTotalCount() == 0)
	{
		tfpagactualp4.setValue(0);
	}
}

function ActualizarEstadoBotonesNavp4(store)
{	
	if(countpagp4 < totalpaginasp4)
	{
		btnalantep4.enable();
		if(countpagp4 > 1){btnatrasp4.enable();}		
	}
	else{
		if(countpagp4 == totalpaginasp4)
		{
			if(countpagp4 > 1){btnatrasp4.enable();}
		}
	}
	
}

//-------------------------------------------------END-----------------------------------------------


//-------------------conf. de bbar para grid plan ventana relacionar(desde objetivos)-----------
var offsetp5 = 0;
var limitp5 = 10;
var totalpaginasp5 = 0;
var countpagp5 = 0;
var tfpagactualp5,tfpagtotalp5,tftotalobjencontradosp5;
var btnatrasp5,btnalantep5;


tfpagactualp5 = new Ext.form.TextField({
		id: 'tfpagactualp5',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tfpagtotalp5 = new Ext.form.TextField({
		id: 'tfpagtotalp5',
		value:countpag,
		readOnly:true, 
		width: 30
	});
	
tftotalobjencontradosp5 = new Ext.form.TextField({
		id: 'tftotalobjencontradosp5',
		value:countpag,
		readOnly:true, 
		width: 30
	});

	

btnatrasp5 = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargarp5('atras');}, id:'btnatrasp5', icon:perfil.dirImg+'anterior.png', iconCls:'btn', tooltip:'Anterior '});
btnalantep5 = new Ext.Button({disabled:true,handler:function(){ActualizarYRecargarp5('alante');}, id:'btnalantep5', icon:perfil.dirImg+'siguiente.png', iconCls:'btn', tooltip:'Siguiente'});

function ActualizarDatosBbarp5(store)
{
	btnalantep5.disable();
	btnatrasp5.disable();
	tftotalobjencontradosp5.setValue(store.getTotalCount());
	totalpaginasp5 = (store.getTotalCount())/limitp5;
	if(totalpaginasp5%limitp5 != 0)
	{totalpaginasp5 = Math.ceil(totalpaginasp5);}
	tfpagtotalp5.setValue(totalpaginasp5);
	if(store.getTotalCount() > 0)
	{
	 switch(countpagp5)
	 {
	  case 0:
		countpagp5++;
		tfpagactualp5.setValue(countpagp5);
		ActualizarEstadoBotonesNavp5(store);
	  break;
	  
	  default:
		tfpagactualp5.setValue(countpagp5);
		ActualizarEstadoBotonesNavp5(store);
	 }
	}
	if(store.getTotalCount() == 0)
	{
		tfpagactualp5.setValue(0);
	}
}

function ActualizarEstadoBotonesNavp5(store)
{	
	if(countpagp5 < totalpaginasp5)
	{
		btnalantep5.enable();
		if(countpagp5 > 1){btnatrasp5.enable();}		
	}
	else{
		if(countpagp5 == totalpaginasp5)
		{
			if(countpagp5 > 1){btnatrasp5.enable();}
		}
	}
	
}

//-------------------------------------------------END-----------------------------------------------



