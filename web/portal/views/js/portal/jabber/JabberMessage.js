function JabberMessage(conf, owner) {
    conf = conf || {};
    this.parent = owner;
    this.from = conf.from;
    this.username = conf.from.split("@")[0];
    this.initConfig();
    // Ext.getCmp('msgtextArea').setReadOnly(true);
    var scope = this;
    var temp = '<img width=16 height=16 src="../../views/js/portal/jabber/resources/images/user_comment.png" ></img>';
    Ext.apply(conf,
        {
            title: temp + this.username,
            height: 500,
            closable: true,
            frame: true,
            autoShow: true,
            layout: 'anchor',
            items: [this.labelStado, this.msgtextArea, this.sendtextArea],
            width: "100%"

        });
    this.id = conf.id;

    Ext.Panel.call(this, conf);
    this.JabberInstance = Jabber.instance;
    return this;

}

JabberMessage.prototype = new Ext.Panel;

JabberMessage.prototype.AddMessage = function (from, text) {
    from = (!from) ? this.from : from;
    var temp = this.msgtextArea.getValue() ? this.msgtextArea.getValue() : "<br/>";
    if (text && text != 'undefined')
        this.msgtextArea.setValue(temp + from.split("@")[0] + ":" + text + "<br/>");

    if (this.msgtextArea.getEl()) {
        this.msgtextArea.getEl().scroll("b", 1000, true);
        //console.log('scroll', this.msgtextArea.getEl());
    }
}
JabberMessage.prototype.stateMessage = false;
JabberMessage.prototype.SendMessage = function (msg) {
    var temp = msg.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
    var connection = this.parent.JabberInterface.connection;
    var reply = $msg({to: this.from, type: "chat"})
        .c("body")
        .t(temp);
    connection.send(reply.tree());
    this.sendtextArea.setValue("");
    this.AddMessage(Strophe.getNodeFromJid(connection.jid), msg);
    return true;
}

JabberMessage.prototype.setStateMessage = function (state) {
    this.stateMessage = state;
    if (state.tagName == 'composing')
        this.labelStado.setText(String.format(XMPP.idioma.es.etiqueta.msg.jabberComposing, this.username));
    else if (state.tagName == 'paused')
        this.labelStado.setText(String.format(XMPP.idioma.es.etiqueta.msg.jabberStopComposing, this.username));
    else if (state.tagName == 'active')
        this.labelStado.setText(String.format(XMPP.idioma.es.etiqueta.msg.jabberReadyToComposing, this.username));
}
JabberMessage.prototype.initConfig = function () {
    var scope = this;

    this.msgtextArea = new Ext.form.HtmlEditor({
        width: "100%",
        height: 210,
        anchor: '100%',
        id: 'msgtextArea',
        //bodyStyle: 'background-color: white;',
        //html: '<div id="msgContext"></div>',
        autoScroll: true,
        enableAlignments: false,
        enableColors: false,
        enableFont: false,
        enableFontSize: false,
        enableFormat: false,
        enableLinks: false,
        enableLists: false,
        enableSourceEdit: false

    });


    this.sendtextArea = new Ext.form.HtmlEditor({
        width: "100%",
        height: 150,
        enableKeyEvents: true,
        anchor: '100%',
        id: 'sendtextArea',
        listeners: {
            sync: function () {
                var tmp=Ext.getCmp('sendtextArea').getValue();
                var temp = tmp.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
                if (temp) {
                    Ext.getCmp('btnAceptWinMsg').enable();
                } else if(! temp) {
                    Ext.getCmp('btnAceptWinMsg').disable();
                }
            }
        }
    });

    this.sendtextArea.on('activate', function () {
        Ext.fly(scope.sendtextArea.getDoc()).on('keypress', function (event, html, contexto) {
            if (event.ENTER == Ext.EventObject.getKey()) {
                var tmp=scope.sendtextArea.getValue();
                var temp = tmp.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
                if (temp) {
                    scope.SendMessage(scope.sendtextArea.getValue());
                }
            }
            else {
                var connection = scope.parent.JabberInterface.connection;
                var reply = $msg({to: scope.from, from: connection.jid, type: 'chat'}).c("body", {xmlns: Strophe.NS.CLIENT}).t('');
                reply.up().c("x", {xmlns: "jabber:x:event"}).c("composing");
                // connection.send(reply.tree());
            }
        });
        var connection = scope.parent.JabberInterface.connection;
        var reply = $msg({to: scope.from, from: connection.jid, type: 'chat'}).c("body", {xmlns: Strophe.NS.CLIENT}).t('');
        reply.up().c("x", {xmlns: "jabber:x:event"}).c("active");
        //connection.send(reply.tree());
    });
    this.labelStado = new Ext.form.Label({ text: this.username });

}


XMPP.JabberMessage = JabberMessage;