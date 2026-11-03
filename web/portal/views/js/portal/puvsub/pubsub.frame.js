Ext.namespace('Xmpp');
Ext.namespace('Xmpp.Imp');

Ext.isDefined = function(v) {
  return typeof v !== 'undefined';
}

Ext.isObject = function(v) {
  return v && typeof v == "object";
}

Xmpp.Imp.PubSub = Ext.extend(Ext.util.Observable, {

  constructor : function (config)
  {
    this.subs = new Ext.util.MixedCollection();
    this.items = [];
    this.subsNode = new Ext.util.MixedCollection();
    this.addEvents({
      'item' : true,
      'items' : true,
      'subscribe' : true,      
      'unsubscribe' : true      
    });    
    this.listeners = config.listeners;
    Xmpp.Imp.PubSub.superclass.constructor.call(config);
    
    this.addListener('item', this.itemListener); 
    this.addListener('items', this.itemsListener); 
    this.addListener('subscribe', this.subscribeListener); 
    this.addListener('unsubscribe', this.unsubscribeListener); 
  },
  
  message : function (event)
  {
    var data    = Ext.decode(event.browserEvent.data);
    var origen  = event.browserEvent.origin;
    
    if(!Ext.isDefined(data.type))
    return;
    
    if(!this.validateOrigen(origen))
      return;
      
    this.fireEvent(data.type, data);
    
    delete data;
    delete origen;
  },
  
  subscribe : function (topic, options, source)
  {
    if(!this.isFrame())
      return;
    
    if(this.subs.indexOfKey(topic) == -1)
      this.subs.add(topic, {'sources' : []});    
      
    if(this.subs.get(topic).sources.indexOf(source) != -1 || !(source instanceof  Xmpp.CallBack) || source.handler == null)    
      return;
    
    var msg = {'cmd':'subscribe', 'node': topic, 'options' : options};
    var winParant = window.top;
      
    winParant.postMessage(Ext.encode(msg), this.getTargetOrigen(winParant));
    delete msg;
    delete winParant; 
      
    source.addEvents({topic : true});
    source.addListener(topic, source.handler, source);
    this.subs.get(topic).sources.push(source);
    
    return;
  },
  
  unsubscribe : function (topic, options, source)
  {
    if(!this.isFrame())
      return;
    
    if(this.subs.indexOfKey(topic) == -1)
      return;    
    
    if(this.subs.get(topic).sources.length == 1)  
    {
      var msg = {'cmd':'unsubscribe', 'node': topic, 'options' : options};
      var winParant = window.top; 
      
      winParant.postMessage(Ext.encode(msg), this.getTargetOrigen(winParant)); 
      
      delete msg;
      delete winParant;
    }

    if(this.subs.get(topic).sources.indexOf(source) == -1 || !(source instanceof  Xmpp.CallBack))    
      return;    
          
    this.subs.get(topic).sources.remove(source);    
  },
  
  publish : function (topic, items)
  {
	  var msg = {'cmd':'publisher', 'node': topic, 'items' : items};
	  var winParant = window.top;
	      
	  winParant.postMessage(Ext.encode(msg), this.getTargetOrigen(winParant));
  },
  
  retrieveItems : function (topic, listener)
  {
    if(typeof listener == 'function')
    {
      var id  = Ext.id(null, 'items');
      var msg = {'cmd':'rtritems', 'node': topic, 'options' : {'id' : id}};
      var winParant = window.top; 
      
      winParant.postMessage(Ext.encode(msg), this.getTargetOrigen(winParant));
      
      this.items[id] = listener;
      
      delete id;
      delete msg;
      delete winParant;
    }
  },
  
  addListenerNode : function (node, source)
  {
    if(!this.isFrame())
      return;
    
    if(this.subsNode.indexOfKey(topic) == -1)
      this.subsNode.add(node, {'sources' : [] });    
    
    if(this.subsNode.get(node).sources.indexOf(source) != -1 || !(source instanceof  Xmpp.CallBack) || source.handler == null)    
      return;
      
    source.addEvents({node : true});
    source.addListener(node, source.handler, source);
    this.subsNode.get(node).sources.push(source);
    
    return;
  },
  
  removeListenerNode : function (node, source)
  {
    if(!this.isFrame())
      return;
    
    if(this.subsNode.indexOfKey(topic) == -1)
      return;

    if(this.subsNode.get(node).sources.indexOf(source) == -1 || !(source instanceof  Xmpp.CallBack))    
      return;    
          
    this.subsNode.get(node).sources.remove(source);
  },
  
  itemListener : function (arg)
  { 
    var listeners = null;
    
	if(this.subs.indexOfKey(arg.node) != -1)
    {
      listeners = this.subs.get(arg.node).sources;
      
      Ext.each(listeners, function (listener)
      {
        listener.fireEvent(arg.node, arg);
      });
    }
    
    if(this.subsNode.indexOfKey(arg.value.name) != -1)
    {
      listeners = this.subsNode.get(arg.value.name).sources;
      
      Ext.each(listeners, function (listener)
      {
        listener.fireEvent(arg.value.name, arg);
      });
    }    
  },
  
  itemsListener : function (arg)
  {
    var listener = this.items[arg.id];
    var values = arg.value;
    
    Ext.each(values, function (value) {
      listener({'node' : arg.node, 'value' : value});
    });
    
    delete this.items[arg.id];
    delete listener;
    delete values;
  },
  
  subscribeListener : function (arg)
  {
    if(arg.status != 'success')
    {
      if(this.subs.indexOfKey(arg.node) != -1) this.subs.removeKey(arg.node);
    }
  },

  unsubscribeListener : function (arg)
  {
    if(arg.status == 'success')
    {
      if(this.subs.indexOfKey(arg.node) != -1) this.subs.removeKey(arg.node);
    }
  }, 

  beforedestroy : function (event)
  {
    var winParant = window.top; 
    
    this.subs.eachKey(function (node) {
      if(typeof node !== "function")
      {
        var args = {'node' : node, 'source' : window};
        winParant.Xmpp.PubSub.fireEvent('unsubscribe', args);
      }
      return true;
    },this);
    
    delete winParant;
    delete origen;
  },
  
  isFrame : function ()
  {
    return (Ext.isDefined(window.frameElement) && window.frameElement != null) ;
  },
  
  getTargetOrigen : function (target)
  {
    var host = target.location.hostname;
    var protocol = target.location.protocol;
    var port = target.location.port;
    port = (port === '' || port === '80' || port === '443') ? '' : ':' + port;
    
    return protocol + '//' + host + port;
    
  },
  
  validateOrigen : function (origen)
  {
    return true;
  },
});

Xmpp.CallBack = Ext.extend(Ext.util.Observable, {

  constructor : function (config)
  {
     this.addEvents({
     });
     
     this.handler = null;
     if(Ext.isDefined(config.handler) &&  (typeof config.handler == 'function'))
     this.handler = config.handler;
     
     this.listeners = config.listeners;
     Xmpp.CallBack.superclass.constructor.call(config);
  }
});

Xmpp.PubSub = function () {

  var frame = new Xmpp.Imp.PubSub({});
  
  if(frame.isFrame())
  {
    Ext.EventManager.addListener(window, 'message', frame.message, frame);
    var extTop = window.top.Ext;
    var id = window.frameElement.getAttribute("id");
    var panelContainer = extTop.getCmp(extTop.get(id).parent().parent().parent().dom.getAttribute('id'));
    if(Ext.isDefined(panelContainer)) panelContainer.addListener('beforedestroy', frame.beforedestroy, frame);
  }
  return frame;
}();

