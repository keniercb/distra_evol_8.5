 Ext.onReady(function (){
	Ext.Ajax.request({
		url: '../xmpp/attach',
		method:'POST',
		callback: function (options,success,response){
			if(success){
			var confJabber = Ext.decode(response.responseText);
                        Xmpp.Bosh.init({"url":'../xmpp/attach'});
                        Xmpp.Bosh.attach(confJabber);
			}else{
				mostrarMensaje(3,response.responseText);
			}
		}
	});
})
