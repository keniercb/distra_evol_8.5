function JabberAttachment()
{
	
	Object.call(this,arguments);
	return this;

}

JabberAttachment.prototype =new Object;

JabberAttachment.prototype.create=function()
{
  var scope=this;
  if(!this.wnIfAlfresco)
  this.wnIfAlfresco = new Ext.UCID.WinIframe({
                                        id:'iframecmp',
                                        idIframe: 'idWinIframeCmp',
                                        title : 'Buscar archivo en el gestor documental',
                                        url:'/componentessecodena/subirdocumento/index.php/subirdocumento/getAlfrescoSearch',
                                        maximizable:true,
                                        modal:true,
                                        values:{},
                                        doAction:function(){},
                                        params : {
                                            'mask':utils.lMask
                                            },
                                        buttons : [
                                        new Ext.Button({
                                            text : 'Cancelar1',
                                            icon : perfil.dirImg + 'cancelar.png',
                                            iconCls : 'btn',
                                            tooltip:'Cerrar la ventana',
                                            handler : function() {
                                                scope.wnIfAlfresco.close();
                                            }.createDelegate(this)
                                        })
                                        ,
                                        new Ext.Button({
                                            text : 'Aceptar',
                                            icon : perfil.dirImg + 'aceptar.png',
                                            iconCls : 'btn',
                                            id:'btnWnAcept',
                                            disabled:true,
                                            tooltip:'Cerrar la ventana',
                                            handler : function() {
                                                self.fireEvent('inserted',scope.wnIfAlfresco.values);
                                                scope.wnIfAlfresco.close();
                                                self.destroy();
                                            }.createDelegate(this)
                                        })
                                        ],
                                        listeners:
                                        {
                                            'objclick':function(enable)
                                            {
                                                Ext.getCmp('btnWnAcept').disable(enable);
                                                 
                                            }
                                        }
                                    });
       return this.wnIfAlfresco;
}
XMPP.JabberAttachment=JabberAttachment;

