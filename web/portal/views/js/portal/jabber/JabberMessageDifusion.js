function JabberMessageDifusion(config) {
    var config = config || {};
    Ext.apply(config, this.createDifucionWin());
    Ext.Window.call(this, config);
    this.JabberInterface = Jabber.instance.JabberInterface;
    this.JabberInstance = Jabber.instance;
    return this;
}
JabberMessageDifusion.prototype = new Ext.Window;


JabberMessageDifusion.prototype.JabberInterface = false;

JabberMessageDifusion.prototype.search = function () {

    var scope = this;
    var value = scope.searchTextValue.getRawValue();
    var tree = scope.treePanel;
    //if (tree && value.length<=0)
    //tree.getLoader().load(tree.getRootNode());
    if (tree) {
        tree.root.cascade(function (n) {
            if (n != tree.root && value) {
                if (n.attributes.clonefrom && n.attributes.clonefrom instanceof JabberContact) {
                    if (!(n.text.toLowerCase().indexOf(value.toLowerCase()) == 0)) {
                        n.ui.hide();

                    }
                    else
                        n.ui.show();
                }
                /*else if (!n.attributes.leaf)
                 {
                 if (!(n.text.toLowerCase().indexOf(value.toLowerCase()) == 0))
                 n.ui.hide();
                 else
                 n.ui.show();


                 }*/

            }
            else if (n != tree.root && !value || n != tree.root && value == '' || n != tree.root && value == 'undefined')
                n.ui.show();

            //scope.btSearch.setDisabled(false);
            //scope.btSearch.toggle(true);

        });
    }


};

JabberMessageDifusion.prototype.refreshSearch = function (b, e, s) {
    s.search();

}

JabberMessageDifusion.prototype.getSearchToolBar = function (callback, searchcallback, text, btn, scope, items) {
    scope = scope ? scope : this;
    var DelayKeyEvent = function (t, e, s) {
        callback(t, e, s);
        //searchcallback(Ext.getCmp(btn),e,s);
        return true;
    };
    var DelayButtomClick = function (b, e, s) {
        searchcallback(b, e, s);
        return true;
    };
    scope.searchTextValue = new Ext.form.TextField({
        width: "94%",
        id: text,
        emptyText: XMPP.idioma.es.etiqueta.text.jabberSearch,
        enableKeyEvents: true,
        listeners: {
            keyup: function (textfield, e) {
                if (e.getKey() == Ext.EventObject.ENTER)
                    DelayButtomClick(Ext.getCmp(btn), e, scope);
                else
                    DelayKeyEvent(textfield, e, scope);
            }
        }
    });
    scope.btColapsar = new Ext.Button(
        {
            //xtype:'button',
            iconCls: XMPP.idioma.es.etiqueta.styles.jabberCollapsed,
            tooltip: XMPP.idioma.es.etiqueta.tooltip.jabberCollapsed,
            id: btn + '-colapsar',
            pressed: false,
            enableToggle: true,
            width: '20%',
            listeners: {
                click: function (bt, e) {
                    scope.treePanel.collapseAll();
                    scope.btExpandir.toggle(false);
                }

            }
        });

    scope.btExpandir = new Ext.Button(
        {
            //xtype:'button',
            iconCls: XMPP.idioma.es.etiqueta.styles.jabberExpanded,
            tooltip: XMPP.idioma.es.etiqueta.tooltip.jabberExpanded,
            id: btn + '-expandir',
            pressed: false,
            enableToggle: true,
            width: '20%',
            listeners: {
                click: function (bt, e) {
                    scope.treePanel.expandAll();
                    scope.btColapsar.toggle(false);
                }

            }
        });
    var item = [scope.searchTextValue, scope.btColapsar, '-', scope.btExpandir];
    if (items && items instanceof Array)
        item = items.concat(item);
    return new Ext.Toolbar({
        cls: XMPP.idioma.es.etiqueta.styles.jabberToolBar,
        items: item

    });
}

JabberMessageDifusion.prototype.setStatus = function (node) {
    if (node.status == Strophe.Status.CONNECTED) {
        node.attributes.iconCls = XMPP.idioma.es.etiqueta.styles.jabberContact;
        node.getUI().getIconEl().className = 'x-tree-node-icon user';
        node.qtip = String.format(XMPP.idioma.es.etiqueta.msg.jabberMyContactConnectedInfo, node.text);

    }
    else if (node.status == Strophe.Status.DISCONNECTED) {
        node.attributes.iconCls = XMPP.idioma.es.etiqueta.styles.jabberDisConection;
        node.getUI().getIconEl().className = 'x-tree-node-icon desconnected';
        node.qtip = String.format(XMPP.idioma.es.etiqueta.msg.jabberMyContactDisConnectedInfo, node.text);

    }


}

JabberMessageDifusion.prototype.onComposing = function (jabber, contacto) {
    var connection = jabber.JabberInterface.connection;
    var reply = $msg({to: contacto.attributes.contacto, from: connection.jid, type: 'chat'}).c("body", {xmlns: Strophe.NS.CLIENT}).t('');
    reply.up().c("x", {xmlns: "jabber:x:event"}).c("composing");
    connection.send(reply.tree());
}
JabberMessageDifusion.prototype.onActivateMessage = function (jabber, contacto) {
    var connection = jabber.JabberInterface.connection;
    var reply = $msg({to: contacto.attributes.contacto, from: connection.jid, type: 'chat'}).c("body", {xmlns: Strophe.NS.CLIENT}).t('');
    reply.up().c("x", {xmlns: "jabber:x:event"}).c("active");
    connection.send(reply.tree());
}
JabberMessageDifusion.prototype.onSendMessage = function (jabber, contacto) {

    var msg = this.sendtextArea.getValue();
    var temp = msg.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
    var connection = jabber.JabberInterface.connection;
    var reply = $msg({to: contacto.attributes.contacto , type: "chat"})
        .c("body")
        .t(temp);
    connection.send(reply.tree());
    this.sendtextArea.setValue('');
}

JabberMessageDifusion.prototype.EnviarMensaje = function (jabber, contacto) {

    var msg = this.sendtextArea.getValue();
    var temp = msg.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
    var connection = jabber.JabberInterface.connection;
    var reply = $msg({to: contacto.attributes.contacto , type: "chat"})
        .c("body")
        .t(temp);
    connection.send(reply.tree());
}

JabberMessageDifusion.prototype.DispararEventosContactos = function (fun) {
    var jabber = Jabber.instance;
    var rootJabber = this.treePanel.getRootNode();
    rootJabber.cascade(function (n) {
        if (n != rootJabber && n.attributes.clonefrom && n.attributes.clonefrom instanceof JabberContact) {
            n.fireEvent(fun, jabber);
        }
    });
}

JabberMessageDifusion.prototype.createDifucionWin = function () {
    var scope = this;
    this.arbol = new Ext.tree.TreeNode({
        text: XMPP.idioma.es.etiqueta.label.jabberGroups
    });
    this.sendtextArea = new Ext.form.HtmlEditor({
        enableKeyEvents: true,
        width: '95%',
        anchor: '95%',
        id: 'textAreaMsjDif',
        listeners: {
            sync: function () {
                var tmp=Ext.getCmp('textAreaMsjDif').getValue();
                var temp = tmp.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
                var tree = scope.arbol;
                var contactsToSend = new Array();
                var index = 0;
                tree.cascade(function (nod) {
                    if (nod != tree) {
                        if (nod instanceof JabberContact) {
                            if (nod.getUI().isChecked()) {
                                contactsToSend.push(nod);
                            }
                        }
                    }
                });
                if (temp && contactsToSend.length>0) {
                    Ext.getCmp('btnSendDifusion').enable();
                    Ext.getCmp('btnSendandCloseDifusion').enable();
                } else if(!temp || contactsToSend.length==0) {
                    Ext.getCmp('btnSendDifusion').disable();
                    Ext.getCmp('btnSendandCloseDifusion').disable();
                }
            }
        }
    });

    this.sendtextArea.on('activate', function () {

        Ext.fly(scope.sendtextArea.getDoc()).on('keypress', function (event, html, contexto) {
            if (event.ENTER == Ext.EventObject.getKey()) {
                //scope.DispararEventosContactos('send');
            }
            else {
                scope.DispararEventosContactos('composing');
            }
        });
        scope.DispararEventosContactos('active');
    });
    this.searchToolBar = this.getSearchToolBar(this.search.createDelegate(this), this.refreshSearch.createDelegate(this), this.TextSearchTree, this.btRefreshTree, this);
    this.treePanel = new Ext.tree.TreePanel({
        region: 'west',
        tbar: this.searchToolBar,
        title: XMPP.idioma.es.etiqueta.containers.jabberContactsByGroups,
        autoShow: true,
        collapsible: true,
        root: this.arbol,
        width: '30%',
        rootVisible: false,
        listeners: {
            checkchange: function () {
                var tmp=Ext.getCmp('textAreaMsjDif').getValue();
                var temp = tmp.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
                var tree = scope.arbol;
                var contactsToSend = new Array();
                var index = 0;
                tree.cascade(function (nod) {
                    if (nod != tree) {
                        if (nod instanceof JabberContact) {
                            if (nod.getUI().isChecked()) {
                                contactsToSend.push(nod);
                            }
                        }
                    }
                });
                if (temp && contactsToSend.length>0) {
                    Ext.getCmp('btnSendDifusion').enable();
                    Ext.getCmp('btnSendandCloseDifusion').enable();
                } else if(!temp || contactsToSend.length==0) {
                    Ext.getCmp('btnSendDifusion').disable();
                    Ext.getCmp('btnSendandCloseDifusion').disable();
                }
            }
        }

    });
    this.panelHtmlEditor = new Ext.Panel({
        region: 'center',
        layout: 'fit',
        width: '70%',
        items: [this.sendtextArea]


    });
    this.fpgrupo = new Ext.Panel({
        layout: 'border',
        items: [this.panelHtmlEditor, this.treePanel]


    });
    var onEnter = function () {
        //if(grupo.getValue())
        //scope.adicionarGrupo(grupo.getValue());

    };
    var DifucionWin = {
        layout: 'fit',
        width: 600,
        modal: false,
        resizable: false,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberSendBradCastMessage,
        height: 400,
        manager: Jabber.instance.manager,
        closeAction: 'close',
        title: XMPP.idioma.es.etiqueta.containers.jabberBradCastMessage,
        plain: true,
        listeners: {
            render: function (win) {
                win.show();
                var jabber = Jabber.instance;
                var rootJabber = jabber.treeUsers.getRootNode();
                rootJabber.cascade(function (e) {
                    if (e != rootJabber) {
                        if (e instanceof JabberGroup) {
                            var grupo = new Ext.tree.TreeNode({text: e.text, iconCls: 'group', checked: false});
                            grupo.on('checkchange', function (n, checked) {
                                n.cascade(function (con) {
                                    if (con != n)
                                        con.getUI().toggleCheck(checked);
                                });
                            }, scope);
                            for (i = 0; i < e.childNodes.length; i++) {
                                var node = e.childNodes[i];
                                var contacto = node.clone();
                                contacto.addListener('composing', scope.onComposing.createDelegate(scope, [contacto], true)); //onComposing
                                contacto.addListener('active', scope.onActivateMessage.createDelegate(scope, [contacto], true));
                                contacto.addListener('send', scope.onSendMessage.createDelegate(scope, [contacto], true));
                                contacto.attributes.checked = contacto.checked = false;
                                grupo.appendChild(contacto);
                                scope.setStatus(contacto);
                            }
                            scope.arbol.appendChild(grupo);
                        }
                    }
                }, scope);
            }
        },
        items: [this.fpgrupo],
        bbar: ['->',
            {
                text: XMPP.idioma.es.etiqueta.button.jabberCancel,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberCancel,
                handler: function () {
                    scope.close();
                }
            },
            {
                text: XMPP.idioma.es.etiqueta.button.jabberSend,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberBtnSend,
                disabled: true,
                id: 'btnSendDifusion',
                handler: function () {
                    var temp = scope.arbol;
                    var contactsToSend = new Array();
                    var index = 0;
                    temp.cascade(function (nod) {
                        if (nod != temp) {
                            if (nod instanceof JabberContact) {
                                if (nod.getUI().isChecked()) {
                                    contactsToSend.push(nod);
                                }
                            }
                        }
                    });
                    for (var j=0; j<contactsToSend.length; j++){
                        if(scope.sendtextArea.getValue()) {
                            scope.EnviarMensaje(scope.JabberInstance, contactsToSend[j]);
                           // console.log('mensaje enviado', contactsToSend[j]);
                        }
                    }
                    scope.sendtextArea.setValue('');
                    temp.cascade(function (nodo) {
                        if (nodo != temp) {
                            if (nodo.getUI().isChecked()) {
                                nodo.getUI().toggleCheck(false);
                            }
                        }
                    });
                    //scope.close();
                }
                //tooltip: XMPP.idioma.es.etiqueta.tooltip.jabberSend
            },
            {
                text: XMPP.idioma.es.etiqueta.button.jabberSendandClose,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberSendandClose,
                disabled: true,
                id: 'btnSendandCloseDifusion',
                handler: function () {
                    var temp = scope.arbol;
                    var contactsToSend = new Array();
                    var index = 0;
                    temp.cascade(function (nod) {
                        if (nod != temp) {
                            if (nod instanceof JabberContact) {
                                if (nod.getUI().isChecked()) {
                                    contactsToSend.push(nod);
                                }
                            }
                        }
                    });
                    for (var j=0; j<contactsToSend.length; j++){
                        if(scope.sendtextArea.getValue()) {
                            scope.EnviarMensaje(scope.JabberInstance, contactsToSend[j]);
                            //console.log('mensaje enviado', contactsToSend[j]);
                        }
                    }
                    scope.sendtextArea.setValue('');
                    scope.close();
                }
            }

        ],
        keys: [
            {
                key: Ext.EventObject.ENTER,
                scope: this,
                fn: function (key, e) {
                    if (scope.fpgrupo.getForm().isValid()) {
                        onEnter();
                    }
                    else {
                        alert(XMPP.idioma.es.etiqueta.msg.jabberEnterData);
                    }
                }}
        ]
    };
    return DifucionWin;
}

XMPP.JabberMessageDifusion = JabberMessageDifusion;