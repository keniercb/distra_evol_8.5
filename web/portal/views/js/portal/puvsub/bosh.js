/**
 *
 *
 */

Ext.namespace('Xmpp');
Ext.namespace('Xmpp.Imp');

Ext.isDefined = function (v) {
    return typeof v !== 'undefined';
}

Ext.isObject = function (v) {
    return v && typeof v == "object";
}

Array.prototype.size = function () {
    var cant = 0;
    for (var i in this) {
        if (typeof this[i] !== "function")
            cant++;
    }

    return cant;
}

Xmpp.Imp.Bosh = Ext.extend(Ext.util.Observable, {

    constructor: function (config) {
        this.disconnected = false;
        this.auth = false;
        this.status = "";
        this.connection = null;
        this.subs = [];
        this.headline = [];
        this.chat = [];
        this.presence = [];
        this.url = '';
        this.addEvents({});

        this.listeners = config.listeners;
        Xmpp.Imp.Bosh.superclass.constructor.call(config);
    },

    messageHeadline: function (message) {
        Xmpp.Bosh.processMessageHeadline(message);

        return true;
    },

    processMessageHeadline: function (message) {
        Ext.each(this.headline, function (item) {
            var target = this.subs[item];

            if (target.messageHeadline)
                target.messageHeadline(message);

            return true;
        }, this);
    },

    messageChat: function (message) {
        Xmpp.Bosh.processMessageChat(message);
        return true;
    },

    processMessageChat: function (message) {
        Ext.each(this.chat, function (item) {
            var target = this.subs[item];

            if (target.messageChat)
                target.messageChat(message);

            return true;
        }, this);
    },


    messagePresence: function (presence) {
        Xmpp.Bosh.processMessagePresence(presence);
        return true;
    },

    processMessagePresence: function (presence) {
        Ext.each(this.presence, function (item) {
            var target = this.subs[item];

            if (target.messagePresence)
                target.messagePresence(presence);

            return true;
        }, this);
    },

    subscribe: function (args) {
        if ((!Ext.isDefined(args.headline) || !Ext.isDefined(args.chat) || !Ext.isDefined(args.presence)) && !Ext.isDefined(args.source))
            return;

        var pos = this.subs.push(args.source) - 1;

        if (Ext.isDefined(args.headline) && args.headline)
            this.headline.push(pos);

        if (Ext.isDefined(args.chat) && args.chat)
            this.chat.push(pos);

        if (Ext.isDefined(args.presence) && args.presence)
            this.presence.push(pos);

        delete pos;
    },

    unsubscribe: function (args) {
        if (!Ext.isDefined(args.source))
            return;

        var pos = this.subs.indexOf(args.source);

        if (pos == -1)
            return;

        delete this.subs[pos];

        var chatpos = this.chat.indexOf(pos);

        if (chatpos != -1)
            delete this.chat[chatpos];

        var headlinepos = this.headline.indexOf(pos);

        if (headlinepos != -1)
            delete this.headline[headlinepos];

        var presencepos = this.presence.indexOf(pos);

        if (presencepos != -1)
            delete this.presence[presencepos];

        delete pos;
        delete chatpost;
        delete headlinepost;
        delete presencepos;
    },

    listenerCallback: function (status) {
        switch (status) {
            case Strophe.Status.CONNECTING:
                break;
            case Strophe.Status.CONNFAIL:
                break;
            case Strophe.Status.DISCONNECTING:
                Xmpp.Bosh.disconnected = true;
                Xmpp.Bosh.auth = false;
                break;
            case Strophe.Status.DISCONNECTED:
                if (!Xmpp.Bosh.disconnected) {
                    Xmpp.Bosh.reattach(1000);
                }
                break;
            case Strophe.Status.CONNECTED:
                Xmpp.Bosh.auth = true;
                Xmpp.Bosh.handler();
                break;
            case Strophe.Status.ATTACHED:
                Xmpp.Bosh.auth = true;
                Xmpp.Bosh.handler();

                if (Ext.isDefined(Xmpp.Bosh.onAttached)) {
                    Xmpp.Bosh.onAttached(Xmpp.Bosh.connection, status);
                }

                if (Xmpp.Bosh.status === Strophe.Status.DISCONNECTED) {
                    Ext.each(Xmpp.Bosh.subs, function (item) {
                        if (item.attach)
                            item.attach();

                        return true;
                    }, this);
                }
                break;
            default:
        }

        Xmpp.Bosh.status = status;
    },

    attach: function (bosh) {
        if (Ext.isDefined(bosh.sid) && Ext.isDefined(bosh.jid) && Ext.isDefined(bosh.url) && Ext.isDefined(bosh.rid)) {
            this.connection = new Strophe.Connection(bosh.url);
            this.connection.attach(bosh.jid, bosh.sid, bosh.rid + 1, this.listenerCallback);
        }
    },

    handler: function () {
        this.connection.addHandler(this.messageHeadline, null, 'message', 'headline');
        this.connection.addHandler(this.messageChat, null, 'message', 'chat');
        this.connection.addHandler(this.messagePresence, null, 'presence');

        this.connection.send($pres().c('priority').t('0'));
    },

    disconnected: function () {
        Xmpp.Bosh.connection.disconnect();
    },

    reattach: function (time) {
        var interval = setInterval(function () {
            clearInterval(interval);

            var ajax = new Ext.data.Connection({});
            ajax.request({
                url: Xmpp.Bosh.url,
                success: function (response, opts) {
                    Xmpp.Bosh.attach(Ext.decode(response.responseText));
                },
                failure: function (response, opts) {
                    if (time < 6000)
                        Xmpp.Bosh.reattach(time * 2);
                    else
                        Xmpp.Bosh.reattach(time);
                }
            });
            ajax.un("requestexception");
        }, time);
    },

    init: function (config) {
        this.url = config['url'];
    }
});

Xmpp.Imp.Parse = function () {
    this.buildXml = function (dom) {
        var element = {};

        element['name'] = dom.nodeName;
        var attr = this.elemAttr(dom.attributes);

        if (Ext.isObject(attr))
            element['attr'] = attr;

        var length = dom.childNodes.length;

        if (length == 1 && dom.childNodes[0].nodeType == 3) {
            element['value'] = dom.childNodes[0].nodeValue;
        }
        else {
            element['child'] = [];

            for (var i = 0; i < length; i++) {
                var node = dom.childNodes[i];
                var result = this.buildXml(node);
                element['child'].push(result);
            }
        }

        return element;
    };

    this.elemAttr = function (attr) {
        var result = {};
        var cant = 0;
        Ext.each(attr, function (it) {
            result[it.nodeName] = it.nodeValue;
            cant++;
        });

        if (cant == 0)
            result = null;

        return result;
    };

    this.buildPubXml = function (element) {
        var node = element.node;
        var attrs = Ext.isDefined(element.attrs) ? element.attrs : [];
        var value = Ext.isDefined(element.value) ? element.value : "";
        var length = Ext.isDefined(element.child) ? element.child.length : 0;
        var xml = (length == 0) ? xml = new Strophe.xmlElement(node, attrs, value) : xml = new Strophe.xmlElement(node, attrs);

        if (length > 0)
            Ext.each(element.child, function (elem) {
                xml.appendChild(this.buildPubXml(elem));
            }, this);

        return xml;

    };
}

Xmpp.Bosh = function () {
    var bosh = new Xmpp.Imp.Bosh({});

    return bosh;
}();

Xmpp.Util = function () {
    var parse = new Xmpp.Imp.Parse();

    return parse;
}();

