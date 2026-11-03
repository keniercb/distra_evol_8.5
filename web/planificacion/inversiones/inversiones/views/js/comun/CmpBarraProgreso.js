var Utilidades = { Cmp : {} };

BarraEstado = function()
{
	this.show = function( mensaje,modal)
	{
		Ext.MessageBox.show({
		   msg: mensaje+'.',
		   title:'Por favor espere...',
           width:300,
		   wait:true,
           modal:(modal==false)?modal:true
		});
	}
	this.hide = function()
	{
		Ext.MessageBox.hide();
	}
}