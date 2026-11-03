
BarraEstado = function()
{
	this.show = function( mensaje)
	{
		Ext.MessageBox.show({
		   msg: mensaje,
		   title:'Por favor espere...',
                   width:300,
		   wait:true
		});
	}
	this.hide = function()
	{
		Ext.MessageBox.hide();
	}
}