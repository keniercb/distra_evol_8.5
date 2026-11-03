
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

    this.ocultarMascara = function(idMask) {
        var mask = Ext.getCmp(idMask);
        if (mask && mask.isXType('comun-winload'))
            mask.hideMask();
    }

    this.mostrarMascara = function(idMask, title, mensaje, fn) {
        if (Ext.getCmp(idMask)) {
            Ext.getCmp(idMask).hideMask();
        }
        var width = (title.length < 49) ? 300 : title.length * 6;
        var widthM = (!mensaje || mensaje == '' || mensaje.length < 49) ? 300 : mensaje.length * 6 + 12;
        var mask = new Ext.secodena.comun.window.winLoad({
            id: idMask,
            title: "Por favor espere...", //title,
            mensaje: mensaje,
            width: (width > widthM) ? width : widthM,
            closeAction: 'destroy',
            count: 0,
            listeners: {
                show: function(win) {
                    Secodena.maskControl[idMask] = mask;
                    Secodena.TimerCount[idMask] = 1;
                },
                destroy: function() {
                    if (fn && !this.forced) {
                        fn();
                    }
                    delete Secodena.maskControl[idMask];
                    delete Secodena.TimerCount[idMask];
                }
            }
        });
        mask.showMask();
        return mask;
    }
}