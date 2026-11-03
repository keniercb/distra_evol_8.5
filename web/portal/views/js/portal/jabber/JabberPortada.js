function JabberPortada(conf,owner)
{
	conf = conf || {};
	this.parent=owner;
	var temp='<img width=16 height=16 src="../../views/js/portal/jabber/resources/images/bird2.png" ></img>';
    Ext.apply(conf,
	{
	 title: temp+XMPP.idioma.es.etiqueta.containers.jabberName,
     height:500,
     closable:false,
     activeItem:0,
     frame:false,
     autoShow:true,
     layout: 'card',
     items:
     [
     	new JabberHelp(false,this)
     ],
     width:"100%"/*,
     listeners:
          	{
               render:function(c)
               {
               	  c.body.dom.style.background='url(/portal/views/js/portal/jabber/resources/images/splashbirdcenter.png?id='+Math.random()*9999999+') ';
               }
            }*/

	});
	Ext.Panel.call(this, conf);
	this.JabberInstance=Jabber.instance;
	return this;
}
JabberPortada.prototype=new Ext.Panel;


XMPP.JabberPortada=JabberPortada;

