Ext.ns('Ext.secodena.comun.window');
Ext.secodena.comun.window.winLoad = Ext.extend(Ext.Window,{
	layout:'border',
	initComponent: function() {
	    this.title = 'Cargando datos...';
	    this.layout = 'fit';
	    this.width = 300;
	    this.height = 50;
	    this.closable = false;
	    this.resizable = false;
	    this.modal = true;
	    this.items = [new Ext.ProgressBar({
		    text:"Cargando datos...",
		    cls:'custom'
		})];
	    this.closeAction = 'hide';
	   	Ext.secodena.comun.window.winLoad.superclass.initComponent.call(this);
	},
	mostrar:function(titulo){
		this.setTitle(titulo);
		this.items.items[0].text =titulo;
		this.items.items[0].text =titulo;
		this.items.items[0].wait({
		    interval:200,
		    increment:15,
		    fn:function(){
		    }
	    });
		this.show();		
	},
	ocultar:function(el){
		this.hide(el)
	}
});
Ext.reg('comun-winload', Ext.secodena.comun.window.winLoad);