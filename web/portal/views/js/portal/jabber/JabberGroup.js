function JabberGroup(config) {
    Ext.apply(config || {}, {
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberGroup,
        qtip: String.format(XMPP.idioma.es.etiqueta.msg.jabberMyGroup, config.text),
        id: 'group-id-' + config.text,
        leaf: false,
        listeners: {
            contextmenu: function (node, event) {
                node.menu.showAt(event.getXY());
                node.select();
            }
        }
    });
    Ext.tree.TreeNode.call(this, config);
    this.initMenu();
    this.JabberInstance = Jabber.instance;
    this.config = config;
    return this;
}

JabberGroup.prototype = new Ext.tree.TreeNode;


JabberGroup.prototype.createAddContact = function () {
    var scope = this;
    Ext.apply(Ext.form.VTypes, {

        usuario: function (val, field) {
            var exp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/;
            return exp.test(val);
        }
    });
    this.User = new Ext.form.TextField({
        xtype: 'textfield',
        emptyText: XMPP.idioma.es.etiqueta.label.jabberEmptyTextJabberIdFormat,
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberUser,
        width: '100%',
        name: 'usuario',
        id: 'tfAddUsuarioUser',
        maxLength: 50,
        vtype: 'vtusuario',
        enableKeyEvents: true,
        allowBlank: false,
        listeners: {
            keyup: function () {
                var tempUser = Ext.getCmp('tfAddUsuarioUser');
                var tempNick = Ext.getCmp('tfAddUsuarioNick');
                if (!tempUser.getValue() || !tempNick.getValue() || !scope.User.validate() || !scope.Nick.validate()) {
                    Ext.getCmp('btnAddUser').disable();
                } else {
                    Ext.getCmp('btnAddUser').enable();
                }
            }
        }
    });
    this.Nick = new Ext.form.TextField({
        xtype: 'textfield',
        emptyText: XMPP.idioma.es.etiqueta.label.jabberEmptyTextUserFormat,
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberAlias,
        width: '100%',
        name: 'alias',
        id: 'tfAddUsuarioNick',
        maxLength: 50,
        vtype: 'vtalfanumericos',
        enableKeyEvents: true,
        allowBlank: false,
        listeners: {
            keyup: function () {
                var tempUser = Ext.getCmp('tfAddUsuarioUser');
                var tempNick = Ext.getCmp('tfAddUsuarioNick');
                if (!tempUser.getValue() || !tempNick.getValue() || !scope.User.validate() || !scope.Nick.validate()) {
                    Ext.getCmp('btnAddUser').disable();
                } else {
                    Ext.getCmp('btnAddUser').enable();
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
        items: [this.User, this.Nick]
    });

    var btAceptar = function () {
        this.JabberInstance.subscribe(scope.User.getValue(), scope.Nick.getValue(), scope.text);
        this.winAddContact.destroy();
    }
    var btCancelar = function () {
        this.winAddContact.destroy();
    }
    this.winAddContact = new Ext.Window({
        title: XMPP.idioma.es.etiqueta.title.jabberAddContact,
        width: 300,
        layout: "border",
        height: 120,
        modal: true,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberAddContact,
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
                id: 'btnAddUser',
                disabled: true,
                handler: btAceptar.createDelegate(this)})
        ]
    });
    panel.doLayout();
    this.winAddContact.doLayout();
    this.winAddContact.show(this);
}

JabberGroup.prototype.deleteGroup = function (jid, group, notask) {
    notask = notask == true ? true : false;
    var fun = function (option, event) {
        if (option == 'yes' || option == 'ok' || option == 'aceptar') {
            this.JabberInstance.treeUsers.getRootNode().removeChild(group);
            this.JabberInstance.removeGroup(jid, group);
        }
    }
    if (!notask) {
        Ext.MessageBox.confirm(XMPP.idioma.es.etiqueta.title.jabberConfirm, XMPP.idioma.es.etiqueta.msg.jabberDeleteGroupQuestion, fun, this);
    } else {
        this.JabberInstance.treeUsers.getRootNode().removeChild(group);
        this.JabberInstance.removeGroup(jid, group);
    }
}

JabberGroup.prototype.updaGroup = function (jid, group) {
    var scope = this;
    this.Grupo = new Ext.form.TextField({
        xtype: 'textfield',
        emptyText: XMPP.idioma.es.etiqueta.label.jabberEmptyTextGroupFormat,
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberGroup,
        width: 157,
        name: 'Grupo',
        id: 'tfModGroup',
        maxLengthText: 50,
        enableKeyEvents: true,
        listeners: {
            keyup: function () {
                var tempGroup = Ext.getCmp('tfModGroup');
                var oldGroup = group.attributes.text;
                if (!tempGroup.getValue() || (tempGroup.getValue() == oldGroup)) {
                    Ext.getCmp('btnModGroup').disable();
                } else {
                    Ext.getCmp('btnModGroup').enable();
                }
            }
        },
        //vtype:'usuario',
        allowBlank: false,
        value: group.attributes.text
    });
    var panel = new Ext.FormPanel({
        frame: true,
        height: 120,
        width: '100%',
        id: "form-" + this.id,
        name: "form",
        region: "center",
        items: [this.Grupo]
    });
    var btAceptar = function () {
        this.JabberInstance.updateGroup(jid, group);
        this.winModGroup.hide();
    }
    var btCancelar = function () {
        this.winModGroup.hide();
    }
    this.winModGroup = new Ext.Window({
        title: XMPP.idioma.es.etiqueta.title.jabberModGroup,
        width: 300,
        layout: "border",
        height: 120,
        modal: true,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberAutenticate,
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
                id: 'btnModGroup',
                disabled: true,
                handler: btAceptar.createDelegate(this)})
        ]
    });
    this.winModGroup.show(this);
}

JabberGroup.prototype.initMenu = function () {
    var scope = this;
    this.menu = new Ext.menu.Menu(
        {
            items: [
                new Ext.menu.Item({
                    text: XMPP.idioma.es.etiqueta.menu.jabberAddContact,
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberAddContact,
                    id: 'groupAddContact',
                    handler: this.createAddContact.createDelegate(this)
                })/**,
                new Ext.menu.Item({
                    text: XMPP.idioma.es.etiqueta.menu.jabberModGroup,
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberAddGroup,
                    id: 'groupModGroup',
                    handler: function () {
                        var nodo = Ext.getCmp('treeusers').getSelectionModel().getSelectedNode();
                        if (!nodo) {
                            Ext.Msg.show({
                                title: XMPP.idioma.es.etiqueta.title.jabberError,
                                msg: XMPP.idioma.es.etiqueta.msg.jabberErrorDelGroup,
                                width: 300,
                                buttons: Ext.MessageBox.OK,
                                multiline: false,
                                icon: Ext.MessageBox.ERROR
                            });
                        } else {
                            var grupo;
                            if (nodo instanceof JabberGroup) {
                                grupo = nodo;
                            }
                            scope.updaGroup(scope.JabberInstance.getConection().jid, grupo);
                        }
                    }
                }),
                new Ext.menu.Item({
                    text: XMPP.idioma.es.etiqueta.menu.jabberDeleteGroup,
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberDeletecContact,
                    id: 'groupDelGroup',
                    handler: function () {
                        var nodo = Ext.getCmp('treeusers').getSelectionModel().getSelectedNode();
                        if (!nodo) {
                            Ext.Msg.show({
                                title: XMPP.idioma.es.etiqueta.title.jabberError,
                                msg: XMPP.idioma.es.etiqueta.msg.jabberErrorDelGroup,
                                width: 300,
                                buttons: Ext.MessageBox.OK,
                                multiline: false,
                                icon: Ext.MessageBox.ERROR
                            });
                        } else {
                            var grupo;
                            if (nodo instanceof JabberGroup) {
                                grupo = nodo;
                            }
                            scope.deleteGroup(scope.JabberInstance.getConection().jid, grupo);
                        }
                    }
                })*/
            ]
        });
    return this.menu;

}

XMPP.JabberGroup = JabberGroup;