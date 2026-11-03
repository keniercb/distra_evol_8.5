/**
*
*
*/

Ext.namespace('Xmpp');
Ext.namespace('Xmpp.Imp');

Xmpp.Imp.PubSub = Ext.extend(Ext.util.Observable, {

  constructor : function (config)
  {
	this.nodes = new Ext.util.MixedCollection();
	this.elements = new Ext.util.MixedCollection();
    this.addEvents({
        'send'          : true,
        'purge'         : true,
        'items'         : true,
        'delete'        : true,
        'rtritems'      : true,
        'publisher'     : true,
        'subscribe'     : true,
        'unsubscribe'   : true,
        'subscription'  : true,
        'configuration' : true
    });
    
    this.listeners = config.listeners;
    Xmpp.Imp.PubSub.superclass.constructor.call(config);
    
    this.addListener('send', this.send); 
    this.addListener('purge', this.purge);
    this.addListener('items', this.items);
    this.addListener('delete', this.remove);   
    this.addListener('rtritems', this.rtritems);
    this.addListener('publisher', this.publisher);
    this.addListener('subscribe', this.subscribe);
    this.addListener('unsubscribe', this.unsubscribe);
    this.addListener('subscription', this.subscription);
    this.addListener('configuration', this.configuration);        
  },
  
  message : function (event)
  {
    var data    = Ext.decode(event.browserEvent.data);
    var origen  = event.browserEvent.origin;
    var source  = event.browserEvent.source; 

    if(!Ext.isDefined(data.cmd))
    return;
    
    if(!this.validateOrigen(origen))
    return;
    
    var args = {'data' : data, 'source' : source};
    
    Xmpp.PubSub.fireEvent(data.cmd, args);
  },
  
  subscribe : function (args)
  {      
    var node    = args.data.node;
    var options = args.data.options;
    var source  = args.source;
    
    if(!Xmpp.Bosh.auth)
    {
      var msg = {'type' : 'unsubscribe', 'node' : node, 'status' : 'success'};    
      this.fireEvent('send', {'source' : source, 'msg' : msg});
      return ;
    }
    
    if(this.isNode(node))
    {
      this.addNodeElement(node, source);
    }
    else
    {
      var iqId = Xmpp.Bosh.connection.pubsub.subscribe(node, options, this.subscribeSuccess, this.subscribeError, false);
    
      this.elements.add(iqId, source); 
      delete iqId;
    }
    
    delete node; 
    delete source;
    delete options;    
    
    return;    
  },
  
  subscribeSuccess : function (iq)
  {
    var element = new Ext.Element(iq);
    var id = element.dom.getAttribute('id');
    
    var subElement =  element.first().first(); 
    var subid = subElement.dom.getAttribute('subid');
    var node = subElement.dom.getAttribute('node');    
  
    Xmpp.PubSub.addNewNode(id, subid, node);   
    
    delete element;
    delete id;
    delete subElement;
    delete subid;
    delete node;
    
    return false;
  },
  
  subscribeError : function (iq)
  {
    var element = new Ext.Element(iq);
    var iqId = element.dom.getAttribute('id');
    var node = element.first().first().dom.getAttribute('node');
    var error = element.last();
    var code = error.dom.getAttribute('code');
    var status = error.dom.getAttribute('type');
    var source = Xmpp.PubSub.elements.get(iqId);
    
    var msg = {'type' : 'subscribe', 'node' : node, 'status' : status, 'code' : code};    
    Xmpp.PubSub.fireEvent('send', {'source' : source, 'msg' : msg});
    
    Xmpp.PubSub.elements.removeKey(iqId);
    delete element;
    delete iqId;
    delete node;
    delete error;
    delete code;
    delete status;
    delete source;
    
    return false;
  },
  
  unsubscribe : function (args)
  {      
    var node    = args.node;
    var source  = Ext.isDefined(args.source) ? args.source : null;     
    
    if(!this.isNode(node))
      return;
      
    if(!this.isElementNode(node,source))
      return;  
    
    var size = this.sizeNodeElement(node);
    
    if(size > 1)
    {
      this.removeNodeElement(node,source);     
    }     
      
    if(size == 1) 
    {
      var subid = this.getNodeElementSubId(node);
      var iqId = Xmpp.Bosh.connection.pubsub.unsubscribe(node, subid, this.unsubscribeSuccess, this.unsubscribeError, false);
      this.removeNode(node);
      
      delete subid;
      delete iqid;
    }
    
    delete node;
    delete source;
    delete size;
    
    return;          
  },
  
  unsubscribeSuccess : function (iq)
  {    
    return false;
  },
  
  unsubscribeError : function (iq)
  {	    
    return false;
  },
  
  messageHeadline : function (msg)
  {    
    var element = (new Ext.Element(msg)).first();
    var childItems = element.dom.childNodes;
    
    Ext.each(childItems, function (items)
    {      
      var el = (new Ext.Element(items));
      var name = el.dom.nodeName; 
      
      this.fireEvent(name, {'node' : el});
      
    }, this);    
    
    delete element;
    delete childItems;
  },
  
  attach : function ()
  {
    this.nodes.eachKey(function (node, source)
    {
        var iqId = Xmpp.Bosh.connection.pubsub.subscribe(node, false,
                  function (iq)
                  {
                    var element = new Ext.Element(iq);    
                    var subElement =  element.first().first(); 
                    var subid = subElement.dom.getAttribute('subid');
                    var node = subElement.dom.getAttribute('node'); 
                    
                    if(Xmpp.PubSub.isNode(node))
                    {
                      var sources = Xmpp.PubSub.nodes.get(node);
                      sources.subid = subid;
                    }
                    
                    delete element;
                    delete subElement;
                    delete subid;
                    delete node;
                  },                  
                  function (iq) 
                  {
                	var element = new Ext.Element(iq);
                    var node = element.first().first().dom.getAttribute('node');
                    Xmpp.PubSub.removeNode(node);
                      
                    delete element;
                    delete node;
                  },                  
                  false);
        
    });
  },
  
  items : function (args)
  {
    var node = args.node;
    var name = node.dom.getAttribute('node');
    
    if(this.isNode(name))
    {      
      var childNodes = node.dom.childNodes;
      Ext.each(childNodes, function (child) {
      
        var first = new Ext.Element(child);
        var id = first.dom.getAttribute('id');
        var dom = first.first().dom;    
    
        var value = {'type' : 'item', 'node' : name, 'id' : id, 'value' : Xmpp.Util.buildXml(dom)};    
   
        var sources = this.nodes.get(name).sources;
      
        Ext.each(sources, function (source)
        {
          this.fireEvent('send', {'source' : source, 'msg' : value});
        },this); 

        delete first;
        delete id
        delete dom;
        delete value;
        delete sources;
        
      },this);
      
      delete childNodes;
    }
    
     delete node;
     delete name;
  },
  
  rtritems : function (args)
  {
	if(!Xmpp.Bosh.auth)
	  return;
	
	var node = args.data.node;
    var source = args.source;
    var id = args.data.options.id;
    
    var iqId = Xmpp.Bosh.connection.pubsub.items(node, this.rtritemseSuccess, this.rtritemseError);
    this.elements.add(iqId, {'source' : source, 'id' : id});
  },
  
  publisher : function (args)
  {
	if(!Xmpp.Bosh.auth)
	  return;
	
	var items = [];
	Ext.each(args.data.items, function (item) {
		items.push({'data' : Xmpp.Util.buildPubXml(item)});
	});
	
	Xmpp.Bosh.connection.pubsub.publish(args.data.node, items, this.publisherSuccess);
  },
  
  publisherSuccess : function (iq)
  {	  
  },
  
  rtritemseSuccess : function (iq)
  {
    var node = (new Ext.Element(iq)).first().first();
    var name = node.dom.getAttribute('node');
          
    var childNodes = node.dom.childNodes;
    var values = [];
    
    Ext.each(childNodes, function (child)
    {      
      var first = new Ext.Element(child);
      var id = first.dom.getAttribute('id');
      var dom = first.first().dom;    
    
      values.push({'id' : id, 'value' : Xmpp.Util.buildXml(dom)});     

      delete first;
      delete id
      delete dom;        
    });
    
    var iqId =   iq.getAttribute('id');
    var trigger = Xmpp.PubSub.elements.get(iqId);
    
    if(trigger != null)
    {
      var value = {'type' : 'items', 'node' : name, 'id':  trigger.id, 'value' : values};
      Xmpp.PubSub.fireEvent('send', {'source' : trigger.source, 'msg' : value});
    }
    
    Xmpp.PubSub.elements.removeKey(iqId);
      
    delete node;
    delete name;
    delete childNodes;  
    delete values;  
    delete iqId;   
    delete trigger;
  },
  
  rtritemseError : function (iq)
  {
    var iqId =   iq.getAttribute('id');
    
    Xmpp.PubSub.elements.removeKey(iqId);
    delete iqId;
  },
  
  validateOrigen : function (origen)
  {
    return true;
  },
  
  getTargetOrigen : function (target)
  {
    var host = target.location.hostname;
    var protocol = target.location.protocol;
    var port = target.location.port;
    port = (port === '' || port === '80' || port === '443') ? '' : ':' + port;
    
    return protocol + '//' + host + port;
    
  },
  
  isNode : function (node)
  {
    return this.nodes.containsKey(node);
  },
  
  addNewNode : function (iqId, subid, node)
  {
    var source = null;
	    
    if(this.elements.containsKey(iqId))
	  source = this.elements.get(iqId);
    
    if(!this.isNode(node))
    {      
      this.nodes.add(node,{'subid' : subid, 'sources': []}) ;       
    }
    
    var sources = this.nodes.get(node).sources;
    
    if(sources.indexOf(source) == -1 && source != null)
    {
      sources.push(source);
      
      var msg = {'type' : 'subscribe', 'node' : node, 'status' : 'success'};
      this.fireEvent('send', {'source' : source, 'msg' : msg});
      
      delete  msg;
    }
    
    this.elements.removeKey(iqId);    
    delete source;
    delete sources;
  },
  
  addNodeElement : function (node, source)
  {    
	var sources = this.nodes.get(node).sources;  
	
	if(sources.indexOf(source) == -1 && source != null)
    {
      sources.push(source);
      
      var msg = {'type' : 'subscribe', 'node' : node, 'status' : 'success'};
      this.fireEvent('send', {'source' : source, 'msg' : msg});
      
      delete  msg;
    }
	
	delete sources;
  },
  
  sizeNodeElement : function (node) 
  {
    return this.nodes.get(node).sources.length;
  },
  
  isElementNode : function (node, source)
  {
    return (!this.isNode(node) || !(this.nodes.get(node).sources.indexOf(source) != -1)) ? false : true;
  },
  
  removeNodeElement : function (node, source)
  {     
    var msg = {'type' : 'unsubscribe', 'node' : node, 'status' : 'success'};    
    this.fireEvent('send', {'source' : source, 'msg' : msg});
      
    this.nodes.get(node).sources.remove(source);
    delete msg;     
  }, 
  
  removeNode : function (node)
  {     
   if(this.nodes.containsKey(node))
   {
    var sources = this.nodes.get(node).sources;
    Ext.each(sources, function (source)
    {
      var msg = {'type' : 'unsubscribe', 'node' : node, 'status' : 'success'};    
      this.fireEvent('send', {'source' : source, 'msg' : msg});
        
    },this);
      
    this.nodes.removeKey(node);
   }
  },
  
  getNodeElementSubId : function (node)
  {
    return this.nodes.get(node).subid;
  },
  
  send : function (args)
  {
    var source = args.source;
    var msg = Ext.encode(args.msg);
    
    if(Ext.isDefined(source.frameElement) && source.frameElement != null)
    {
      source.postMessage(msg, this.getTargetOrigen(source));
    }
    
    delete source;
    delete msg;
  }
});

Xmpp.PubSub = function () 
{  
  var pubsub = new Xmpp.Imp.PubSub({});
  Ext.EventManager.addListener(window, 'message', pubsub.message, pubsub);
  Xmpp.Bosh.subscribe({'headline' : true, 'source' : pubsub});
  
 return pubsub; 
}();
