function Man(jabber) {
    this.jabber = jabber;
    Object.call(this, arguments);
    return this;
}
Man.prototype = new Object;
Man.prototype.connection = null;
Man.prototype.dataPackets = 0;
Man.prototype.needle = 0;

Man.prototype.loadServices = function () {
    var reader = new Ext.data.XmlReader({
        id: 'id',
        record: 'service'
    }, [
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'accion',
            type: 'string'
        }
    ])
    this.storeServices = new Ext.data.Store({
        reader: reader,
        autoLoad: false,
        listeners: {
            load: function (records, options) {

            },
            loadexception: function (proxy, options, response, error) {
                Ext.Msg.show({
                    title: XMPP.idioma.es.etiqueta.title.jabberError,
                    msg: XMPP.idioma.es.etiqueta.msg.jabberLoadingService,
                    width: 300,
                    buttons: Ext.MessageBox.OK,
                    multiline: false,
                    animEl: scope.ServidorJabber.getEl(),
                    icon: Ext.MessageBox.ERROR
                });
            }
        },

        proxy: new Ext.data.HttpProxy(new Ext.data.Connection({
            url: '../../views/js/portal/jabber/resources/services.xml',
            extraParams: {
                id: Math.random() * 99999
            },
            method: 'POST',
            timeout: 30000
        }))//,

    });

    this.storeServices.load();
}

Man.prototype.initConection = function (servidor) {

    return this.connection = new Strophe.Connection(servidor);
}

Man.prototype.login = function (cmp) {
    var scope = this;
    this.tfusuario = new Ext.form.TextField({
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberUser,
        enableKeyEvents: true,
        maxLength: 50,
        allowBlank: false,
        vtype: 'vtusuario',
        id: 'tfLoginUser',
        listeners: {
            keyup: function () {
                scope.activeAceptar();
            }
        },
        emptyText: XMPP.idioma.es.etiqueta.label.jabberProfileEmptyTextJabberIdFormat
    });
    this.tfpassword = new Ext.form.TextField({
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberPassword,
        inputType: 'password',
        maxLength: 255,
        enableKeyEvents: true,
        id: 'tfLoginPass',
        allowBlank: false,
        listeners: {
            keypress: function () {
                scope.activeAceptar();
            }
        },
        emptyText: XMPP.idioma.es.etiqueta.label.jabberPasswordEmpty
    });


    var reader = new Ext.data.XmlReader({
        id: 'id',
        record: 'server'
    }, [
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'url',
            type: 'string'
        },
        {
            name: 'domain',
            type: 'string'
        }
    ])
    this.storeServers = new Ext.data.Store({
        id: 'storeServers',
        reader: reader,
        autoLoad: false,
        listeners: {
            load: function (st, records, options) {
                var rec = records[0];
                if (records.length > 0) {
                    var user = UCID.portal.perfil ? UCID.portal.perfil.usuario : "usuario";
                    //scope.tfusuario.setValue(user + "@" + rec.data['domain']);
                    //scope.tfpassword.setValue("");
                }
            },
            loadexception: function (proxy, options, response, error) {
                Ext.Msg.show({
                    title: XMPP.idioma.es.etiqueta.title.jabberError,
                    msg: XMPP.idioma.es.etiqueta.msg.jabberLoadingService,
                    width: 300,
                    buttons: Ext.MessageBox.OK,
                    multiline: false,
                    animEl: scope.ServidorJabber.getEl(),
                    icon: Ext.MessageBox.ERROR
                });
            }
        },

        proxy: new Ext.data.HttpProxy(new Ext.data.Connection({
            url: '../../views/js/portal/jabber/resources/servers.xml',
            extraParams: {
                id: Math.random() * 99999
            },
            method: 'POST',
            timeout: 30000
        }))//,

    });
    this.storeServers.load();

    this.btAceptar = new Ext.Button({
        text: XMPP.idioma.es.etiqueta.button.jabberAcept,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberAcept,
        id: 'btnLoginAccept',
        disabled: true,
        handler: function () {
            scope.onLogin();

        }
    });
    this.btCancelar = new Ext.Button({
        text: XMPP.idioma.es.etiqueta.button.jabberCancel,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberCancel,
        handler: function () {
            scope.winLogin.destroy();

        }
    });

    this.ServidorJabber = new Ext.form.ComboBox({
        store: this.storeServers,
        displayField: 'name',
        typeAhead: true,
        mode: 'remote',
        valueField: 'url',
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberServer,
        maxLengthText: 100,
        width: 157,
        forceSelection: true,
        triggerAction: 'all',
        editable: false,
        loadingText: XMPP.idioma.es.etiqueta.msg.jabberLoading,
        allowBlank: false,
        emptyText: XMPP.idioma.es.etiqueta.text.jabberServer,
        selectOnFocus: true,
        enableKeyEvents: true,
        id: 'cbLoginServer',
        listeners: {
            select: function () {
                scope.activeAceptar();
                //var user = UCID.portal.perfil ? UCID.portal.perfil.usuario : "usuario";
                // scope.tfusuario.setValue(user + "@" + rec.data['domain']);
                // scope.tfpassword.setValue("");
                return true;
            }
        }
    });

    this.fplogin = new Ext.FormPanel({
        frame: true,
        layout: 'form',
        border: 0,
        items: [this.tfusuario, this.tfpassword, this.ServidorJabber]
    });
    this.winLogin = new Ext.Window({
        layout: 'fit',
        width: 300,
        modal: true,
        resizable: false,
        id: 'winJabberLoginT',
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberAutenticate,
        height: 160,
        manager: this.jabber.manager,
        closeAction: 'destroy',
        title: XMPP.idioma.es.etiqueta.containers.jabberLogin,
        plain: true,
        listeners: {
            render: function (win) {
                //Ext.WindowMgr.register(win);
                win.show();
            }
        },
        items: [this.fplogin],
        buttons: [
            this.btCancelar,
            this.btAceptar
        ],
        keys: [
            {
                key: Ext.EventObject.ENTER,
                scope: this,
                fn: function (key, e) {
                    if (this.fplogin.getForm().isValid()) {
                        scope.onLogin();
                    }
                    else {
                        alert(XMPP.idioma.es.etiqueta.msg.jabberEnterData);
                    }
                }
            }
        ]
    });

    this.onLogin = function () {
        if (this.fplogin.getForm().isValid()) {
            var user = this.tfusuario.getValue() + '/recurso';
            var pass = this.tfpassword.getValue();
            var servidor = this.ServidorJabber.store.data.items[0].data.url;
            /*
             * var servidor = this.ServidorJabber.getValue();
             * */
            //console.log(servidor);
            //console.log(this.ServidorJabber.store.data.items[0].data.url);

            if (servidor) {
                var conn = scope.initConection(servidor);
                if (!scope.key || (scope.key && scope.key != user + pass + servidor)) {
                    conn.connect(user, pass, function (status) {

                        if (status === Strophe.Status.CONNECTED) {
                            scope.key = user + pass + servidor;
                            scope.status = estado = Strophe.Status.CONNECTED;
                            scope.connected(conn);
                            scope.loadServices();
                            scope.winLogin.destroy();
                        }
                        else if (status === Strophe.Status.DISCONNECTED) {
                            scope.status = estado = Strophe.Status.DISCONNECTED;
                            scope.disconected();
                        }
                        else if (status == 2) {
                            scope.winLogin.hide();
                            Ext.Msg.show({
                                title: XMPP.idioma.es.etiqueta.title.jabberError,
                                //msg: String.format(XMPP.idioma.es.etiqueta.msg.jabberCONNFAIL, scope.tfusuario.getValue().split('@')[1]),
                                msg: XMPP.idioma.es.etiqueta.msg.jabberErrorUser,
                                width: 550,
                                modal: false,
                                fn: function () {
                                    scope.winLogin.show();
                                },
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                        else if (status == 4) {

                            scope.winLogin.hide();
                            Ext.Msg.show({
                                title: XMPP.idioma.es.etiqueta.title.jabberError,
                                //msg: XMPP.idioma.es.etiqueta.msg.jabberAUTHFAIL,
                                msg: XMPP.idioma.es.etiqueta.msg.jabberErrorPass,
                                width: 500,
                                modal: false,
                                fn: function () {
                                    scope.winLogin.show();
                                },
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                    });
                } else {
                    if (scope.key && scope.key == user + pass + servidor) {
                        Ext.Msg.show({
                            title: XMPP.idioma.es.etiqueta.title.jabberInformation,
                            msg: XMPP.idioma.es.etiqueta.msg.jabberAlreadyAutenticated,
                            width: 300,
                            buttons: Ext.MessageBox.OK,
                            multiline: false,
                            icon: Ext.MessageBox.INFO
                        });
                    }
                }


            } else {
               // console.log("No servidor");
            }
        } else {
            //console.log("No valido");
        }
    }
    return  this.winLogin;

};

Man.prototype.attach = function (status) {
    var scope = arguments[2] instanceof Jabber ? arguments[2].JabberInterface : false;
    if (scope) {
        scope.key = scope.connection.jid;
        scope.status = status;
        scope.connected(false);
        scope.loadServices();
    }


};

Man.prototype.activeAceptar = function () {
    var tempUser = Ext.getCmp('tfLoginUser');
    var tempPass = Ext.getCmp('tfLoginPass');
    var tempServer = Ext.getCmp('cbLoginServer');
    if (!tempUser.getValue() || !tempPass.getValue() || !tempServer.getValue() || !this.tfusuario.validate() || !this.tfpassword.validate()) {
        Ext.getCmp('btnLoginAccept').disable();
    } else {
        Ext.getCmp('btnLoginAccept').enable();
    }
}

Man.prototype.attached = function (conn) {
    this.connection = conn;
    this.key = this.connection.jid;
    this.status = Strophe.Status.ATTACHED;
    this.connected(false);
    this.loadServices();
};

Man.prototype.connected = function (conn) {

    if (conn != false)
        this.connection = conn != this.connection ? conn : this.connection;
    if (this.winLogin)
        this.winLogin.hide();//unsubscribed
    this.connection.send($pres());
    this.connection.send($iq({
        type: 'get'
    }).c('query', {
            xmlns: Strophe.NS.ROSTER
        }).tree());
    this.connection.addHandler(this.onMessage.createDelegate(this), null, "message", "chat");
    this.connection.addHandler(this.onPresence.createDelegate(this), null, 'presence', null, null, null);
    this.connection.addHandler(this.onSubscribe.createDelegate(this), null, 'presence', 'subscribe', null, null);
    this.connection.addHandler(this.onUnSubscribe.createDelegate(this), null, 'presence', 'unsubscribe', null, null);
    this.connection.addHandler(this.onUnSubscribed.createDelegate(this), null, 'presence', 'unsubscribed', null, null);
    this.connection.addHandler(this.onPresenceChanged.createDelegate(this), Strophe.NS.ROSTER, 'iq', null, null, null);
    this.connection.addHandler(this.onUnAvaliable.createDelegate(this), null, 'presence', 'unavailable', null, null);
    this.jabber.getProfileConfig();
    this.jabber.EnabledOnConected();
    this.jabber.createInterceptorFunctionToDisconect();
}
Man.prototype.disconected = function () {
    this.winLogin.destroy();//unsubscribed
//this.jabber.DisabledOnDisconected();
}
Man.prototype.onUnAvaliable = function (presence) {
    try {
        this.jabber.onUnAvaliable(presence);
        return true;
    }
    catch (e) {
        return false;
    }

};
Man.prototype.onPresenceChanged = function (iq) {
    try {
        this.jabber.onPresenceChanged(iq);
        return true;
    }
    catch (e) {
        return false;
    }

};
Man.prototype.onUnSubscribed = function (presence) {
    try {
        this.jabber.onUnSubscribed(presence);
        return true;
    }
    catch (e) {
        return false;
    }
};
Man.prototype.onUnSubscribe = function (presence) {
    try {
        this.jabber.onUnSubscribe(presence);
        return true;
    }
    catch (e) {
        return false;
    }
};
Man.prototype.onSubscribe = function (presence) {
    try {
        this.jabber.onSubscribe(presence);
        return true;
    }
    catch (e) {
        return false;
    }
};
Man.prototype.onPresence = function (presence) {
    try {
        this.jabber.onPresence(presence);
        return true;
    }
    catch (e) {
        return false;
    }
};

Man.prototype.onMessage = function (message) {
    try {
        this.jabber.onMessage(message);
        return true;
    }
    catch (e) {
        return false;
    }

};

Man.prototype.initGauge = function (r) {
    this.needle = r.path("M 124,115 L 43,123 L 124,131 C 129,131 131,127 131,123 C 131,119 128,115 124,115 z").attr({
        fill: "#84AE31",
        stroke: "#546D1F"
    });
}

Man.prototype.handleNeedle = function (deg) {
    var strokeColor, fillColor;
    var temp = (((deg * 30) / 180) + 40).toPrecision(3);

    if (temp < 50) {
        fillColor = "#84AE31";
        strokeColor = "#546D1F";
    }
    if (temp >= 50 && temp < 60) {
        fillColor = "#FFCF21";
        strokeColor = "#B98F00";
    }
    if (temp >= 60) {
        fillColor = "#D62800";
        strokeColor = "#971B00";
    }

    this.needle.animate({
        rotation: deg + " 125 123",
        stroke: strokeColor,
        fill: fillColor
    }, 1000, "<>");
}
Man.prototype.Isvalid = function () {
    var scope = this;
    return this.ServidorJabber.getValue() && this.tfpassword.getValue() && this.tfusuario.getValue();
}

	
 

