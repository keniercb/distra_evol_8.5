Utilidades.Cmp.CmpNavegador = function()
{
	var _this =this;
	this.BarraProgreso = new BarraEstado();
	this.arraybotones = [];
	
	this.CrearBarraNavegacion = function(index,totalrecords,tipoelemento)
	{
		_this.btnAtras = new Ext.Button({
			handler:function(){
				//_this.objCrudPlan.CrearWinCrudPlan('Adicionar',_this.PostAccionesGestionar,_this.arrayidplan);
			}, 
			disabled:true, 
			//icon:perfil.dirImg+'atras.png', 
			iconCls:'anterior',
			tooltip:'Anterior'
		});
		_this.btnSiguiente = new Ext.Button({
			handler:function(){
				//_this.objCrudPlan.CrearWinCrudPlan('Adicionar',_this.PostAccionesGestionar,_this.arrayidplan);
			}, 
			disabled:true, 
			//icon:perfil.dirImg+'siguiente.png', 
			iconCls:'siguiente',
			tooltip:'Siguiente'
		});

	}
}