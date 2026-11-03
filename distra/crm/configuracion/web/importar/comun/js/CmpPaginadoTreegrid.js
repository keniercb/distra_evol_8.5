
ClassPaginadoTreegrid = function (limit,AccionTrasPaginar)
{
	var _this = this;
	this.titulopBarraNiveles = '';
	this.offset = 0;
	this.limit = limit;
	this.totalpaginas = 0;
	this.countpag = 0;
	this.direccion = 'nula';
	this.arrayniveles = [];
	this.totalniveles = 0;
	
	this.tfpagactual = new Ext.form.TextField({
		id: 'tfpagactual',
		value:_this.countpag,
		readOnly:true, 
		width: 30
	});
	this.tfpagtotal = new Ext.form.TextField({
		id: 'tfpagtotal',
		value:_this.countpag,
		readOnly:true, 
		width: 30
	});
	this.tftotalobjencontrados = new Ext.form.TextField({
		id: 'tftotalobjencontrados',
		value:_this.countpag,
		readOnly:true, 
		width: 30
	});
	this.btnatras = new Ext.Button({disabled:true,handler:function(){_this.direccion = 'atras';_this.ActualizarYRecargar();}, id:'btnatras', /*icon:perfil.dirImg+'anterior.png',*/ iconCls:'anterior', tooltip:'Anterior '});
	this.btnalante = new Ext.Button({disabled:true,handler:function(){_this.direccion = 'alante';_this.ActualizarYRecargar();}, id:'btnalante', /*icon:perfil.dirImg+'siguiente.png',*/ iconCls:'siguiente', tooltip:'Siguiente'});
	this.btnsubirnivel = new Ext.Button({disabled:true,handler:function(){_this.ActualizarDatosNiveles(idelemento = null,nobody = null,0,function(){});}, id:'btnsubirnivel', /*icon:perfil.dirImg+'arriba.png',*/ iconCls:'arriba', tooltip:'Subir un nivel '});	
	this.tftitBarraNiveles = new Ext.form.TextField({value:_this.titulopBarraNiveles,readOnly:true , width:1200});
	
	
	this.ActualizarDatosBbar = function(store)
	{
		_this.btnalante.disable();
		_this.btnatras.disable();
		_this.tftotalobjencontrados.setValue(store.getTotalCount());
		_this.totalpaginas = (store.getTotalCount())/limit;
		if(_this.totalpaginas%limit != 0)
		{_this.totalpaginas = Math.ceil(_this.totalpaginas);}
		_this.tfpagtotal.setValue(_this.totalpaginas);
		if(store.getTotalCount() > 0)
		{
		 switch(_this.countpag)
		 {
		  case 0:
			_this.countpag++;
			_this.tfpagactual.setValue(_this.countpag);
			_this.ActualizarEstadoBotonesNav();
		  break;
		  
		  default:
			_this.tfpagactual.setValue(_this.countpag);
			_this.ActualizarEstadoBotonesNav();
		 }		 
		}
		if(store.getTotalCount() == 0)
		{
			_this.tfpagactual.setValue(0);
		}
	}
	
	this.ActualizarEstadoBotonesNav = function()
	{	
		if(_this.countpag < _this.totalpaginas)
		{
			_this.btnalante.enable();
			if(_this.countpag > 1){_this.btnatras.enable();}		
		}
		else{
			if(_this.countpag == _this.totalpaginas)
			{
				if(_this.countpag > 1){_this.btnatras.enable();}
			}
		}
		
	}
	
	this.ActualizarYRecargar = function()
	{ 	
		if(_this.direccion == 'alante')
		{
			_this.offset = _this.offset+10;
			_this.countpag++;
		}
		else
		{	
			_this.offset = _this.offset-10;
			_this.countpag--;
		}
		AccionTrasPaginar();
		/*opcionBusqueda = 2;
		BuscarPlanes();*/
	}
	
	this.barraPaginado = new Ext.Toolbar
	({
		items:['-',_this.btnatras,'-','P&aacute;gina',_this.tfpagactual,' de ',_this.tfpagtotal,'-',_this.btnalante,'->','Encontrados ',_this.tftotalobjencontrados,' resultados']
	})
		
	this.barraNiveles = new Ext.Toolbar
	({
		items:['-',_this.btnsubirnivel,'-',_this.tftitBarraNiveles,'-']
	})
	
	this.ActualizarDatosNiveles = function(idelemento,denominacion,direccion,AccionAEjecutar)
	{
		if(direccion == 1)
		{
			var nivel = {};
			nivel = {idelemento:idelemento, denominacion:denominacion, offset:_this.offset, limit:_this.limit, pagactual:_this.tfpagactual.getValue(),
					 pagtotal:_this.tfpagtotal.getValue(), totalobj:_this.tftotalobjencontrados.getValue()};
			_this.arrayniveles.push(nivel);
			_this.totalniveles = _this.totalniveles + 1;
			_this.titulopBarraNiveles = _this.titulopBarraNiveles+'/'+denominacion+'/';
			_this.tftitBarraNiveles.setValue(_this.titulopBarraNiveles);
			_this.btnsubirnivel.enable();
		}
		else
		{
			_this.totalniveles = _this.totalniveles - 1;
			var nivel = _this.arrayniveles[_this.totalniveles];
			_this.arrayniveles.splice(_this.totalniveles,1);
			_this.titulopBarraNiveles = '';
			if(_this.totalniveles > 0)
			{
				for(var i=0; i<_this.totalniveles; i++)
				{
					var titulo = _this.arrayniveles[i].denominacion;
					_this.titulopBarraNiveles = _this.titulopBarraNiveles+'/'+titulo+'/';
				}
			}
			else
			{
				_this.btnsubirnivel.disable();
			}
			_this.tftitBarraNiveles.setValue(_this.titulopBarraNiveles);
			_this.offset = nivel.offset;
			_this.limit = nivel.limit;
			AccionAEjecutar();
		}
				
	}
	
}