function JabberContact(config) {
    var scope = this;
    config = config || {};
    config = Ext.apply(config, Ext.apply({
        //id:'idcontacto-'+config.user+'@'+config.domain+'-'+Math.random()*9999999,
        leaf: true,
        jid: config.jid,
        qtip: String.format(XMPP.idioma.es.etiqueta.msg.jabberMyContact, config.user),
        listeners: {
            contextmenu: function (node, event) {
                node.menu.showAt(event.getXY());
                node.select();
            },
            dblclick: function (n) {
                n.createMessage();
            }
        }
    }, {text: this.name = config.name, domain: config.domain}));
    this.JabberInstance = Jabber.instance;
    this.config = config;
    this.jid = this.config.jid;
    Ext.tree.TreeNode.call(this, config);
    this.initMenu();
    return this;
}
JabberContact.prototype = new Ext.tree.TreeNode;

JabberContact.createContactStatus = function (status) {
    return this.winPerfil = new JabberContact({name: name, user: usuario, domain: dominio, iconCls: status});
}

JabberContact.prototype.setStatus = function (status) {
    this.status = status;
    if (status == Strophe.Status.CONNECTED && this.getUI().getIconEl()) {
        this.attributes.iconCls = XMPP.idioma.es.etiqueta.styles.jabberContact;
        this.getUI().getIconEl().className = 'x-tree-node-icon user';
        this.qtip = String.format(XMPP.idioma.es.etiqueta.msg.jabberMyContactConnectedInfo, this.text);

    }
    else if (status == Strophe.Status.DISCONNECTED && this.getUI().getIconEl()) {
        this.attributes.iconCls = XMPP.idioma.es.etiqueta.styles.jabberDisConection;
        this.getUI().getIconEl().className = 'x-tree-node-icon desconnected';
        this.qtip = String.format(XMPP.idioma.es.etiqueta.msg.jabberMyContactDisConnectedInfo, this.text);

    }


}

JabberContact.prototype.sendSubcription = function () {
    this.JabberInstance.sendSubcription(this.jid);
}


JabberContact.prototype.deleteContact = function (notask) {
    var scope = this;
    notask = notask == true ? true : false;
    var nodo = scope.JabberInstance.treeUsers.getSelectionModel().getSelectedNode();
    var fun = function (option, event) {
        if (option == 'yes' || option == 'ok' || option == 'aceptar') {
            scope.JabberInstance.treeUsers.getRootNode().removeChild(nodo);
            scope.JabberInstance.cancel_your_subscription(scope.jid);
            scope.remove();
            delete scope;
        }
    }
    if (!notask)
        Ext.MessageBox.confirm(XMPP.idioma.es.etiqueta.title.jabberConfirm, XMPP.idioma.es.etiqueta.msg.jabberDeleteUserQuestion, fun, this)
    else {
        scope.JabberInstance.treeUsers.getRootNode().removeChild(nodo);
        scope.JabberInstance.cancel_your_subscription(scope.jid);
        scope.remove();
        delete scope;
    }
}
JabberContact.prototype.updaContact = function (contact) {
    var scope = this;
    var nodos = scope.JabberInstance.treeUsers.getRootNode().childNodes;
    var grupos = new Array();
    for (i = 0; i < nodos.length; i++) {
        if (nodos[i] instanceof JabberGroup) {
            grupos.push(nodos[i].attributes.text);
        }
    }
    this.Alias = new Ext.form.TextField({
        xtype: 'textfield',
        emptyText: XMPP.idioma.es.etiqueta.label.jabberEmptyTextUserFormat,
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberAlias,
        width: 157,
        name: 'alias',
        id: 'tfModUsuarioNick',
        maxLengthText: 50,
        enableKeyEvents: true,
        listeners: {
            keyup: function () {
                var tempNick = Ext.getCmp('tfModUsuarioNick');
                var tempGroup = Ext.getCmp('cbModUsuarioGroup');
                var oldNick = contact.attributes.text;
                var oldGroup = contact.parentNode.attributes.text;
                if ((tempNick.getValue() == oldNick) && (tempGroup.getValue() == oldGroup)) {
                    Ext.getCmp('btnModUser').disable();
                } else if (!tempNick.getValue()) {
                    Ext.getCmp('btnModUser').disable();
                } else {
                    Ext.getCmp('btnModUser').enable();
                }
            }
        },
        allowBlank: false,
        value: contact.attributes.text
    });
    this.Grupo = new Ext.form.ComboBox({
        displayField: 'name',
        typeAhead: true,
        //mode: 'remote',
        //valueField: 'url',
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberGroup,
        maxLengthText: 30,
        width: 157,
        id: 'cbModUsuarioGroup',
        forceSelection: true,
        triggerAction: 'all',
        editable: false,
        loadingText: XMPP.idioma.es.etiqueta.msg.jabberLoading,
        allowBlank: false,
        emptyText: XMPP.idioma.es.etiqueta.text.jabberEmptyTextUserFormat,
        selectOnFocus: true,
        enableKeyEvents: true,
        store: grupos,
        value: contact.parentNode.attributes.text,
        listeners: {
            select: function () {
                var tempNick = Ext.getCmp('tfModUsuarioNick');
                var tempGroup = Ext.getCmp('cbModUsuarioGroup');
                var oldNick = contact.attributes.text;
                var oldGroup = contact.parentNode.attributes.text;
                if ((tempNick.getValue() == oldNick) && (tempGroup.getValue() == oldGroup)) {
                    Ext.getCmp('btnModUser').disable();
                } else if (!tempNick.getValue()) {
                    Ext.getCmp('btnModUser').disable();
                } else {
                    Ext.getCmp('btnModUser').enable();
                }
            }
        }
    });
    var panel = new Ext.FormPanel({
        frame: true,
        height: 120,
        width: '100%',
        id: "form-" + this.id,
        name: "form",
        region: "center",
        items: [this.Alias, this.Grupo]
    });
    var btAceptar = function () {
        var jid = contact.attributes.jid;
        var oldAlias = contact.attributes.text;
        var oldGroup = contact.parentNode;
        var newAlias = scope.Alias.getValue();
        var newGroup = scope.Grupo.getValue();
        oldGroup.removeChild(contact);
        this.JabberInstance.updateContact(jid, newAlias, newGroup);
        this.winModContact.destroy();
    }
    var btCancelar = function () {
        this.winModContact.destroy();
    }
    this.winModContact = new Ext.Window({
        title: XMPP.idioma.es.etiqueta.title.jabberModContact,
        width: 300,
        layout: "border",
        height: 120,
        modal: true,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberUpdateContact,
        items: [panel],
        bbar: [
            '->',
            new Ext.Button({
                text: XMPP.idioma.es.etiqueta.button.jabberCancel,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberCancel,
                handler: btCancelar.createDelegate(this)}),
            new Ext.Button({
                text: XMPP.idioma.es.etiqueta.button.jabberAcept,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberAcept,
                disabled: true,
                id: 'btnModUser',
                handler: btAceptar.createDelegate(this)})
        ],
        listeners: {

        }
    });

    this.winModContact.show(this);
}
JabberContact.prototype.showPerfil = function () {
    var perfil = new JabberPerfil({jid: this.jid});
    perfil.contacto = this;
    perfil.show();
}

JabberContact.prototype.createMessage = function () {
    var from = this.text;
    var idFrom = this.attributes.domain;
    var id = this.attributes.jid;//from+'@'+idFrom;
    var cmp = this.JabberInstance.tabMessage.findById(id);
    if (!cmp) {
        var temp = new JabberMessage({
            from: id,
            id: id,
            message: ''
        }, this.JabberInstance);
        //temp.AddMessage(from,'');
        this.JabberInstance.tabMessage.add(temp);
        this.JabberInstance.tabMessage.setActiveTab(temp);

    }
    else {
        //cmp.AddMessage(from,'');
        this.JabberInstance.tabMessage.setActiveTab(cmp);
    }
    this.JabberInstance.tabMessage.doLayout(true);
    this.JabberInstance.winMessage.show();
}

JabberContact.prototype.initMenu = function () {
    var scope = this;

    this.menu = new Ext.menu.Menu(
        {
            items: [
                new Ext.menu.Item({
                    text: String.format(XMPP.idioma.es.etiqueta.menu.jabberSendMessajeTo, this.text),
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberSendMessajeTo,
                    handler: this.createMessage.createDelegate(this) }),
                new Ext.menu.Item({
                    text: String.format(XMPP.idioma.es.etiqueta.menu.jabberSendSubscriptionTo, this.text),
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberSendSubscriptionTo,
                    handler: this.sendSubcription.createDelegate(this) }),
                new Ext.menu.Item({
                    text: String.format(XMPP.idioma.es.etiqueta.menu.jabberUpdateContacto, this.text),
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberUpdateContact,
                    handler: function () {
                        var nodo = Ext.getCmp('treeusers').getSelectionModel().getSelectedNode();
                        if (!nodo) {
                            Ext.Msg.show({
                                title: XMPP.idioma.es.etiqueta.title.jabberError,
                                msg: XMPP.idioma.es.etiqueta.msg.jabberErrorDelContact,
                                width: 300,
                                buttons: Ext.MessageBox.OK,
                                multiline: false,
                                icon: Ext.MessageBox.ERROR
                            });
                        } else {
                            var contact;
                            if (nodo instanceof JabberContact) {
                                contact = nodo;
                            }
                            scope.updaContact(contact);
                        }
                    }
                }),
                new Ext.menu.Item({
                    text: String.format(XMPP.idioma.es.etiqueta.menu.jabberDeletecContact, this.text),
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberDeletecContact,
                    handler: this.deleteContact.createDelegate(this) }),
                new Ext.menu.Item({
                    text: String.format(XMPP.idioma.es.etiqueta.menu.jabberShowProfileFrom, this.text),
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberShowProfileFrom,
                    handler: this.showPerfil.createDelegate(this) })
            ]
        });

    return this.menu;

}
JabberContact.prototype.clone = function () {

    var node = new JabberContact({
        clonefrom: this,
        name: this.name,
        contacto: this.jid,
        jid: this.jid,
        text: this.text,
        qtip: this.qtip,
        iconCls: this.config.iconCls,
        status: this.status
    });
    node.addEvents({
        'composing': true,
        'active': true,
        'send': true
    });

    return node;
}

XMPP.JabberContact = JabberContact;
