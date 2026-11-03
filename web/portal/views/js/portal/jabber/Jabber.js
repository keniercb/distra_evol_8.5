var estado;
var Cookies = {};
var grupo;
Cookies.set = function (name, value) {
    var argv = arguments;
    var argc = arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : '/';
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    document.cookie = name + "=" + escape(value) +
        ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
        ((path == null) ? "" : ("; path=" + path)) +
        ((domain == null) ? "" : ("; domain=" + domain)) +
        ((secure == true) ? "; secure" : "");
};

Cookies.get = function (name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    var j = 0;
    while (i < clen) {
        j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return Cookies.getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
            break;
    }
    return null;
};

Cookies.clear = function (name) {
    if (Cookies.get(name)) {
        document.cookie = name + "=" +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};

Cookies.getCookieVal = function (offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
};

Ext.example = function () {
    var msgCt;

    function createBox(t, s) {
        var text = '<div class="msg">' +
            '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>' +
            '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>' + t + '</h3>' +
            '<img width=25 src="../../views/js/portal/jabber/resources/images/xmpp.jpeg" ></img>' + s + '</div></div></div>' +
            '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div></div>';

        return text;

    }

    return {
        msg: function (title, format, id, xy) {
            if (!msgCt) {
                msgCt = Ext.DomHelper.insertFirst(document.body, {
                    id: id ? id : 'msg-alert'
                }, true);
            }
            msgCt.alignTo(document, 't-t');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {
                html: createBox(title, s)
            }, true);
            m.slideIn('t').pause(8).ghost("t", {
                remove: true
            });
            if (xy && xy instanceof Array) {
                xy[0] = xy[0] - msgCt.getSize().width - 5;
            }
            msgCt.setXY(xy ? xy : Ext.EventObject.getXY());

        },

        init: function () {
            var t = Ext.get('exttheme');
            if (!t) { // run locally?
                return;
            }
            var theme = Cookies.get('exttheme') || 'aero';
            if (theme) {
                t.dom.value = theme;
                Ext.getBody().addClass('x-' + theme);
            }
            t.on('change', function () {
                Cookies.set('exttheme', t.getValue());
                setTimeout(function () {
                    window.location.reload();
                }, 250);
            });
            var lb = Ext.get('lib-bar');
            if (lb) {
                lb.show();
            }
        }
    };
}();

function Jabber(conf, owner) {
    conf = conf || {};
    this.Winsize = this.WindowsSize();
    this.parent = owner;
    this.JabberInterface = new Man(this);

    var scope = this;
    this.manager = new Ext.WindowGroup({
        zseed: 11000
    });
    this.tabMessage = new Ext.TabPanel({
        activeTab: 0,
        activateItem: 0,
        //items: [this.JabberSplash = new JabberPortada(false, this)],
        width: "100%",
        height: 500,
        region: 'center',
        frame: true
    });
    this.panelHelp = new Ext.TabPanel({
        activeTab: 0,
        activateItem: 0,
        items: [this.JabberSplash = new JabberPortada(false, this)],
        //title: XMPP.idioma.es.etiqueta.containers.jabberName,
        //iconCls: XMPP.idioma.es.etiqueta.styles.jabber,
        width: "100%",
        height: 500,
        region: 'center',
        frame: true
    });
    this.minimizable = true;
    this.winMessage = new Ext.Window({
        layout: 'border',
        width: 550,
        closeAction: 'hide',
        height: 500,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberSendMessajeTo,
        items: [this.tabMessage],
        title: XMPP.idioma.es.etiqueta.containers.jabberName,
        bbar: ['->',
            {
                text: XMPP.idioma.es.etiqueta.button.jabberCancel,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberCancel,
                handler: function () {
                    scope.winMessage.hide();
                },
                disabled: false
            },
            {
                text: XMPP.idioma.es.etiqueta.button.jabberAcept,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberAcept,
                disabled: true,
                id: 'btnAceptWinMsg',
                handler: function () {
                    var activeTab = scope.tabMessage.getActiveTab();
                    if (activeTab && activeTab.sendtextArea.getValue()) {
                        activeTab.SendMessage(activeTab.sendtextArea.getValue());
                        //activeTab.hide();
                    }
                }
            }]
    });
    this.winHelp = new Ext.Window({
        layout: 'border',
        width: 550,
        closeAction: 'hide',
        height: 500,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberHelp,
        title: XMPP.idioma.es.etiqueta.containers.jabberHelp,
        items: [this.panelHelp],
        bbar: ['->',
            {
                text: XMPP.idioma.es.etiqueta.button.jabberClose,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberCancel,
                handler: function () {
                    scope.winHelp.hide();
                },
                disabled: false
            }
        ]
    });
    Ext.QuickTips.init();
    this.initTreeMenu();
    this.searchToolBar = this.getSearchToolBar(this.search.createDelegate(this), this.refreshSearch.createDelegate(this), this.TextSearchTree, this.btRefreshTree, this);
    this.treeUsers = new Ext.tree.TreePanel({
        title: XMPP.idioma.es.etiqueta.containers.jabberDisconected,
        rootVisible: false,
        lines: false,
        id: 'treeusers',
        //animate: true,
        //enableDD: true,
        //containerScroll: true,
        //useArrows: true,
        //dropConfig: {appendOnly: true},
        tbar: this.searchToolBar,
        selModel: new Ext.tree.DefaultSelectionModel({  }),
        listeners: {
            render: function (c) {
                c.body.dom.style.background = 'url(/portal/views/js/portal/jabber/resources/images/splashbirdcenter.png?id=' + Math.random() * 9999999 + ')';
            },
            click: function(node, event) {
                if(node instanceof JabberContact) {
                    scope.EnableButtonsMenuUsuario();
                } else if(!(node instanceof JabberContact)) {
                    scope.DisableButtonsMenuUsuario();
                }
            }
        },
        loader: this.treeloader,
        autoScroll: true,
        tools: [
            {
                id: 'refresh',
                on: {
                    click: function () {
                        var tree = scope.treeUsers; //Ext.getCmp('im-tree');
                        tree.body.mask(XMPP.idioma.es.etiqueta.msg.jabberLoading, 'x-mask-loading');
                        //tree.root.reload();
                        tree.root.collapse(true, false);
                        setTimeout(function () { // mimic a server call
                            tree.body.unmask();
                            tree.root.expand(true, true);
                        }, 1000);
                    }
                }
            }
        ],
        root: new Ext.tree.TreeNode({
            text: XMPP.idioma.es.etiqueta.text.jabberOnLine
        })
    });
    this.treesorter = new Ext.tree.TreeSorter(this.treeUsers, {
        folderSort: true,
        dir: 'asc',
        sortType: function (node) {
            return  node.text;
        }
    });
    this.treeloader = new Ext.tree.TreeLoader({
        preloadChildren: true
    });
    Ext.apply(conf, {
        title: XMPP.idioma.es.etiqueta.containers.jabberName,
        width: 270,
        id:'winJabber',
        height: 500,
        minWidth: 10,
        minHeight: 40,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabber,
        shim: false,
        closeAction: 'hide',
        animCollapse: true,
        resizable: false,
        renderTo: Ext.getBody(),
        constrainHeader: true,
        bodyStyle:"z-index:2000 !important;",
        listeners: {
            close: function (c) {
                if (scope.winMinimizable) {
                    scope.winMinimizable.destroy();
                }
                if (scope.getConection()) {
                    scope.getConection().InterceptorToDisconect(scope.getConection().jid + XMPP.idioma.es.etiqueta.title.jabberHasBeenDesconected);
                }
            },
            minimize: function (win) {
                scope.createMinimized();
                scope.winMinimizable.render(Ext.getBody());
                scope.winMinimizable.getEl().setXY([10, scope.Winsize.height - 55], true);
                scope.winMinimizable.show(true);
                scope.hide();
            },
            show: function (cmp) {
                 /*   this.JabberInterface = new Man(this);
                scope.JabberInterface.login().show();
                var temp = Ext.getCmp('tfLoginUser');
                console.log('textfield',temp);
                    if (estado != Strophe.Status.ATTACHED && estado != Strophe.Status.CONNECTED) {
                        //Ext.WindowMgr.register(scope.JabberInterface.login());
                        scope.JabberInterface.login();
                        scope.JabberInterface.login().focus();
                    }*/
                    /**if (estado != Strophe.Status.CONNECTED && estado != Strophe.Status.ATTACHED) {
                        scope.JabberInterface.closeConection = false;
                        scope.JabberInterface.login().show();

                    }
                    else {
                        scope.JabberInterface.closeConection = true;
                        scope.JabberInterface.login().show();
                    }*/

            },
            hide: function (win) {
                if (conf.status == Strophe.Status.ATTACHED || conf.status == Strophe.Status.CONNECTED) {
                    scope.minimize();
                }
            }
        },
        tbar: [
            this.createBtArchivo(), '-',
            '->',
            {
                handler: function () {
                    scope.showHelp();
                },
                tooltip: XMPP.idioma.es.etiqueta.tooltip.jabberHelp,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberHelp
            }
        ],

        layout: 'accordion',
        border: false,
        layoutConfig: {
            animate: false
        },
        items: [this.treeUsers]



    });

    Ext.Window.call(this, conf);

    if (conf.bosh != null && conf.bosh != 'undefined' && conf.bosh.length != 0) {
        var con = this.JabberInterface.initConection(conf.bosh.url);
        con.attach(conf.bosh.jid, conf.bosh.sid, conf.bosh.rid + 1, this.JabberInterface.attach.createDelegate(this, [this], true));
    } else {
        if (conf.conn != null && conf.status === Strophe.Status.ATTACHED) {
            this.JabberInterface.attached(conf.conn);
            this.show();
        }
    }

    if (conf && conf.autoShow)
        this.show();

    if (!Jabber.instance)
        Jabber.instance = this;
    return this;

}

Jabber.prototype = new Ext.Window;

Jabber.prototype.Menus = [];
Jabber.prototype.DisableButtonsMenu = function () {
    Ext.each(this.Menus, function (el) {

        if (el.disable)
            el.disable();
    }, this);
}
Jabber.prototype.EnableButtonsMenu = function () {
    Ext.each(this.Menus, function (el) {
        if (el.enable)
            el.enable();
    }, this);
}
Jabber.prototype.EnabledOnConected = function () {
    this.btColapsar.enable();
    this.btExpandir.enable();
    this.EnableButtonsMenu();
}
Jabber.prototype.DisabledOnDisconected = function () {
    this.btColapsar.disable();
    this.btExpandir.disable();
    this.DisableButtonsMenu();
}

Jabber.prototype.EnableButtonsMenuUsuario = function () {
    Ext.each(this.menusUsuario, function (el) {
        if (el.enable){
            el.enable();
        }
    }, this);
}
Jabber.prototype.DisableButtonsMenuUsuario = function () {
    Ext.each(this.menusUsuario, function (el) {
        if (el.disable){
            el.disable();
        }
    }, this);
}

Jabber.prototype.showHelp = function () {
    /**this.tabMessage.doLayout(true);
     this.winMessage.show();
     this.tabMessage.setActiveTab(this.JabberSplash);*/
    this.panelHelp.doLayout(true);
    this.winHelp.show();
    this.panelHelp.setActiveTab(this.JabberSplash);
}

Jabber.prototype.createMinimized = function () {
    var scope = this;
    this.winMinimizable = new Ext.Panel({
        width: 48,
        height: 48,
        closable: false,
        minimizable: false,
        maximizable: false,
        bodyBorder: false,
        border: false,
        resizable: false,
        //title: 'Bijirita',
        layout: 'fit',
        listeners: {
            render: function (c) {
                var img = document.createElement('img');
                img.setAttribute('src', perfil.dirImg + "tired-icon.png");
                img.setAttribute('width', "100%");
                img.setAttribute('height', "100%");
                c.body.dom.appendChild(img);
                Ext.EventManager.on(c.body.dom, 'dblclick', function () {
                    scope.winMinimizable.destroy();
                    scope.show();

                });
                c.body.dom.style.backgroundColor = "transparent";

                return true;
            },
            minimize: function (win) {
                scope.winMinimizable.show();
            }
        }

    });
    return this.winMinimizable;
}

Jabber.prototype.WindowsSize = function () {

    var myWidth = 0, myHeight = 0;
    if (typeof( window.innerWidth ) == 'number') {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    }
    else if (document.documentElement &&
        ( document.documentElement.clientWidth || document.documentElement.clientHeight )) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    }
    else if (document.body && ( document.body.clientWidth || document.body.clientHeight )) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return {
        width: myWidth,
        height: myHeight,
        xcenter: myWidth / 2,
        ycenter: myHeight
    };
}

Jabber.prototype.getConection = function () {
    if (!this.JabberInterface || !this.JabberInterface.connection) {
        if (!this.JabberInterface)
            this.JabberInterface = new Man(this);
        if (!this.JabberInterface.connection) {
            this.JabberInterface.login().show();
            this.JabberInterface.login().focus();
        }
    }
    return this.JabberInterface.connection;
}

Jabber.prototype.saveProfileConfig = function () {
    var scope = this;
    if (this.getConection()) {
        var jid = this.getConection().jid;
        var usuario = Strophe.getNodeFromJid(jid);
        var dominio = Strophe.getDomainFromJid(jid);
        var client = usuario + '@' + dominio;
        var data = this.perfilJabber;
        if (!data) {

            var msg = XMPP.idioma.es.etiqueta.msg.jabberRequestingProfile;
            var myMask = new Ext.LoadMask(Ext.getBody(), {
                msg: msg
            });
            myMask.show();
            var fun = function (o, s, r) {
                if (s) {
                    var response = Ext.decode(r.responseText);
                    if (response.exist == true)
                        scope.windowJabberPerfil.setPerfil(response);
                    if (myMask && myMask.hide)
                        myMask.hide();

                    if (scope.perfilJabber) {
                        var data = scope.perfilJabber;
                        scope.keyProfileMap = Base64.encode(client);
                        var profile = '{name:pmorell}';
                        var stanza = $iq({
                            type: 'set',
                            id: scope.keyProfileMap
                        })
                            .c('query', {
                                xmlns: 'jabber:iq:private'
                            })
                            .c(usuario + '-' + dominio, {
                                xmlns: usuario + ':prefs'
                            })
                            .c('data', Ext.encode(data))
                            .tree();
                        scope.getConection().sendIQ(stanza);
                        Ext.Msg.show({
                            title: XMPP.idioma.es.etiqueta.title.jabberSavedProfile,
                            msg: XMPP.idioma.es.etiqueta.msg.jabberInformation,
                            width: 300,
                            buttons: Ext.MessageBox.OK,
                            multiline: false,
                            icon: Ext.MessageBox.INFO
                        });
                    }
                }
            };
            this.createPerfilWin().loadPerfil(myMask, fun);
        }
        else {
            var data = this.perfilJabber;
            this.keyProfileMap = Base64.encode(client);
            var profile = '{name:pmorell}';
            var stanza = $iq({
                type: 'set',
                id: this.keyProfileMap
            })
                .c('query', {
                    xmlns: 'jabber:iq:private'
                })
                .c(usuario + '-' + dominio, {
                    xmlns: usuario + ':prefs'
                })
                .c('data', Ext.encode(data))
                .tree();
            this.getConection().sendIQ(stanza);
            Ext.Msg.show({
                title: XMPP.idioma.es.etiqueta.title.jabberSavedProfile,
                msg: XMPP.idioma.es.etiqueta.msg.jabberInformation,
                width: 300,
                buttons: Ext.MessageBox.OK,
                multiline: false,
                //animEl: scope.ServidorJabber.getEl(),
                icon: Ext.MessageBox.INFO
            });
        }
    }
}

Jabber.prototype.onloadProfile = function (element) {

}

Jabber.prototype.getProfileConfig = function () {
    var scope = this;
    if (this.getConection()) {
        this.treeUsers.setTitle(XMPP.idioma.es.etiqueta.containers.jabberConnected);
        var jid = this.getConection().jid;
        var usuario = Strophe.getNodeFromJid(jid);
        var dominio = Strophe.getDomainFromJid(jid);
        var client = usuario + '@' + dominio;
        this.keyProfileMap = Base64.encode(client);

        var stanza = $iq({
            type: 'get',
            id: this.keyProfileMap
        })
            .c('query', {
                xmlns: 'jabber:iq:private'
            })
            .c(usuario + '-' + dominio, {
                xmlns: usuario + ':prefs'
            })
            .tree();
        this.getConection().sendIQ(stanza, this.onloadProfile.createDelegate(this));
    }
}

Jabber.prototype.createBtArchivo = function () {
    var scope = this;
    this.ActionConectarse = new Ext.Action({
        text: XMPP.idioma.es.etiqueta.menu.jabberConection,
        disabled: false,
        handler: function () {
            if (estado != Strophe.Status.CONNECTED && estado != Strophe.Status.ATTACHED) {
                scope.JabberInterface.closeConection = false;
                scope.JabberInterface.login().show();

            }
            else {
                scope.JabberInterface.closeConection = true;
                scope.JabberInterface.login().show();
            }
        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberConection,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberConection

        },

        iconCls: XMPP.idioma.es.etiqueta.styles.jabberConection
    });

    this.ActionAdicionarUsuario = new Ext.Action({
        text: XMPP.idioma.es.etiqueta.menu.jabberAddContact,
        handler: function () {

            var node = scope.treeUsers.getSelectionModel().getSelectedNode();
            if (node && node instanceof JabberGroup)
                node.createAddContact();
            else {
                var nodo = null;
                var grupos = scope.treeUsers.getRootNode().childNodes;
                for (i = 0; i < grupos.length; i++) {
                    if (grupos[i] instanceof JabberGroup) {
                        if (grupos[i].text == 'Contactos')
                            nodo = grupos[i];
                    }
                }
                if (nodo == null) {
                    var group = "Contactos";
                    scope.adicionarGrupo(group);
                }
                //Aqui se llama al AddContact desde el nodo Contactos
                nodo = scope.treeUsers.getRootNode().findChild('text', "Contactos");
                nodo.createAddContact();
            }
        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberAddContact,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberAddContact

        },
        disabled: true,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberAddContact
    });
    this.ActionEliminarUsuario = new Ext.Action({
        text: XMPP.idioma.es.etiqueta.menu.jabberDeleteContact,
        disabled: true,
        handler: function () {
            var node = scope.treeUsers.getSelectionModel().getSelectedNode();
            if (node && node instanceof JabberContact) {
                node.deleteContact(false);
            } else if (!node || !(node instanceof JabberContact)) {
                Ext.Msg.show({
                    title: XMPP.idioma.es.etiqueta.title.jabberError,
                    msg: XMPP.idioma.es.etiqueta.msg.jabberErrorDelContact,
                    width: 300,
                    buttons: Ext.MessageBox.OK,
                    multiline: false,
                    icon: Ext.MessageBox.ERROR
                });
            }

        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberDeleteContact,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberDeleteContact

        },

        iconCls: XMPP.idioma.es.etiqueta.styles.jabberDeleteContact
    });
    this.ActionActualizarUsuario = new Ext.Action({
        text: XMPP.idioma.es.etiqueta.menu.jabberUpdateContact,
        disabled: true,
        handler: function () {
            var node = scope.treeUsers.getSelectionModel().getSelectedNode();
            if (!node || !(node instanceof JabberContact)) {
                Ext.Msg.show({
                    title: XMPP.idioma.es.etiqueta.title.jabberError,
                    msg: XMPP.idioma.es.etiqueta.msg.jabberErrorDelContact,
                    width: 300,
                    buttons: Ext.MessageBox.OK,
                    multiline: false,
                    icon: Ext.MessageBox.ERROR
                });
            } else if (node && (node instanceof JabberContact)) {
                node.updaContact(node);
            }
        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberUpdateContact,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberUpdateContact

        },

        iconCls: XMPP.idioma.es.etiqueta.styles.jabberUpdateContact
    });
    this.AdicionarGrupos = new Ext.Action({
        text: XMPP.idioma.es.etiqueta.menu.jabberAddGroup,
        disabled: true,
        handler: function () {
            scope.createAddGroup().show();

        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberAddGroup,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberAddGroup

        },

        iconCls: XMPP.idioma.es.etiqueta.styles.jabberAddGroup
    });
    this.MostrargruposVacios = new Ext.menu.CheckItem({
        text: XMPP.idioma.es.etiqueta.menu.jabberShowEmptyGroup,
        checked: false,
        disabled: true,
        handler: function (obj, event) {

            if (!obj.checked == true) {
                scope.MostrarSoloGruposVacios();
            }
            else if (!obj.checked == false) {
                scope.MostrarTodosLosGrupos();
            }

        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberShowEmptyGroup,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberShowEmptyGroup

        }
    });
    this.MostrarContactos = new Ext.menu.CheckItem({
        text: XMPP.idioma.es.etiqueta.menu.jabberShowUsersOnLine,
        checked: false,
        disabled: true,
        handler: function (obj, event) {
            scope.ShowJabberContacts(false, !obj.checked);

        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberShowUsersOnLine,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberShowUsersOnLine

        }
    });
    this.MostrarMiPerfil = new Ext.Action({
        text: XMPP.idioma.es.etiqueta.menu.jabberMyProfile,
        disabled: true,
        handler: function (obj, event) {
            scope.createPerfilWin().show();

        },
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberMyProfile,
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberMyProfile,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberMyProfile

        }
    });
    this.SalvarPerfil = new Ext.Action({
        text: XMPP.idioma.es.etiqueta.menu.jabberSaveProfile,
        disabled: true,
        handler: function (obj, event) {
            scope.saveProfileConfig();

        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberSaveProfile,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberSaveProfile

        },
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberSaveProfile
    });
    this.GestionarGruposItem = new Ext.menu.Item({
        text: XMPP.idioma.es.etiqueta.menu.jabberShow,
        menu: [
            this.MostrargruposVacios,
            this.MostrarContactos,
            '-',
            this.MostrarMiPerfil
        ],
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberShow,
        disabled: true
    });
    this.EnviarDifusion = new Ext.Action({
        text: XMPP.idioma.es.etiqueta.menu.jabberSendBradCastMessage,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberSendBradCastMessage,
        disabled: true,
        handler: function (obj, event) {
            scope.createDifucionWin().show();

        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberSendBradCastMessage,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberSendBradCastMessage

        }
    });
    this.EnviarAdjunto = new Ext.Action({
        text: XMPP.idioma.es.etiqueta.menu.jabberSendAttachment,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberSendAttachment,
        disabled: true,
        handler: function (obj, event) {
            var adjunto = new JabberAttachment(false, this, "adjunto");
            var iframe = adjunto.create();
            iframe.show();
            iframe.doLayout();
            iframe.maximize();

        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberSendAttachment,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberSendAttachment

        }
    });
    this.EnviarItem = new Ext.menu.Item({
        text: XMPP.idioma.es.etiqueta.menu.jabberSend,
        disabled: true,
        menu: [
            this.EnviarDifusion//,
            //this.EnviarAdjunto
        ],
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberSend
    });
    this.GestionarUsuariosItem = new Ext.menu.Item({
        text: XMPP.idioma.es.etiqueta.menu.jabberManagerContacts,
        disabled: true,
        menu: [
            this.ActionAdicionarUsuario,
            this.ActionActualizarUsuario,
            this.ActionEliminarUsuario
        ],
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberManagerContacts
    });

    /* this.GestionarConfiguracion = new Ext.menu.Item({
     text: XMPP.idioma.es.etiqueta.menu.jabberManagerConfig,
     disabled:true,
     menu:
     [
     this.ActionAdicionarUsuario,
     this.ActionActualizarUsuario,
     this.ActionEliminarUsuario
     ],
     iconCls: XMPP.idioma.es.etiqueta.styles.jabberManagerContacts
     });*/

    this.salir = new Ext.Action({
        text: XMPP.idioma.es.etiqueta.menu.jabberExit,
        disabled: true,
        handler: function () {
            if (!scope.JabberInterface) {
                scope.JabberInterface = new Man(this);
            }
            if (scope.getConection()) {
                scope.getConection().InterceptorToDisconect(String.format(XMPP.idioma.es.etiqueta.msg.jabberDisConnectedUser, scope.getConection().jid));

            }
            scope.destroy();
        },
        tooltip: {
            title: XMPP.idioma.es.etiqueta.menu.jabberExit,
            text: XMPP.idioma.es.etiqueta.tooltip.jabberExit

        },

        iconCls: XMPP.idioma.es.etiqueta.styles.jabberExit
    });

    this.Menus =
        [
            this.GestionarUsuariosItem,
            this.GestionarGruposItem,
            this.EnviarItem,
            this.AdicionarGrupos,
            this.SalvarPerfil,
            this.salir,
            this.ActionAdicionarUsuario,
            this.MostrargruposVacios,
            this.MostrarContactos,
            this.MostrarMiPerfil,
            this.EnviarDifusion
        ];

    this.menusUsuario =
        [
            this.ActionActualizarUsuario,
            this.ActionEliminarUsuario
        ];

    var menu = {
        text: XMPP.idioma.es.etiqueta.button.jabberFile,
        menu: [
            this.ActionConectarse,
            this.GestionarUsuariosItem,
            this.GestionarGruposItem,
            this.EnviarItem,
            this.AdicionarGrupos,
            this.SalvarPerfil,
            this.salir
        ],
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberFile
    };
    return menu;
}
Jabber.prototype.createInterceptorFunctionToDisconect = function () {
    var scope = this;
    var f = function (reason) {
        scope.DisabledOnDisconected();
        return true;
    };
    this.getConection().InterceptorToDisconect = this.getConection().disconnect.createInterceptor(f);

}
Jabber.prototype.createDifucionWin = function () {
    return this.windowmessageDifusion = new JabberMessageDifusion();
}

Jabber.prototype.createPerfilWin = function () {
    return this.windowJabberPerfil = new JabberPerfil({
        owner: this,
        jid: this.getConection().jid
    });
}

Jabber.prototype.MostrarSoloGruposVacios = function () {
    var root = this.treeUsers.getRootNode();
    root.cascade(function (e) {
        if (e != root && e instanceof JabberGroup && e.childNodes.length <= 0)
            e.getUI().show();
        else if (e != root && e instanceof JabberGroup && e.childNodes.length > 0)
            e.getUI().hide();
    }, this);

}
Jabber.prototype.ShowJabberContacts = function (grupo, contactStatus) {
    var root = grupo ? grupo : this.treeUsers.getRootNode();
    root.cascade(function (e) {
        if (e.parentNode)
            e.parentNode.getUI().show();
        e.getUI().show();
        if (e != root && e instanceof JabberContact) {
            if ((contactStatus && (e.status == Strophe.Status.CONNECTED || e.status == Strophe.Status.ATTACHED)))
                e.getUI().show();
            else if ((contactStatus && e.status != Strophe.Status.CONNECTED && e.status != Strophe.Status.ATTACHED))
                e.getUI().hide();
            else if (!contactStatus)
                e.getUI().show();

        }
    }, this);


}
Jabber.prototype.MostrarTodosLosGrupos = function () {
    var root = this.treeUsers.getRootNode();
    var scope = this;
    root.cascade(function (e) {
        if (e != root && (e instanceof JabberGroup) || (e instanceof JabberContact)) {
            e.getUI().show();

        }


    }, this);

}

Jabber.prototype.EnviarPresencia = function () {
    this.getConection().send($pres());
}
Jabber.prototype.cancel_other_subscription = function (jid) {
    this.getConection().send($pres({
        to: jid,
        type: "unsubscribed"
    }));
}
Jabber.prototype.cancel_your_subscription = function (jid) {
    this.getConection().send($pres({
        to: jid,
        type: "unsubscribe"
    }));
    this.removeContact(jid);
}
Jabber.prototype.removeContact = function (jid) {
    this.getConection().sendIQ($iq({
        type: "set"
    }).c("query", {
            xmlns: Strophe.NS.ROSTER
        }).c("item", {
            jid: jid,
            subscription: "remove"
        }));

}
Jabber.prototype.getRoster = function () {
    this.getConection().sendIQ($iq({
        type: "get"
    }).c("query", {
            xmlns: Strophe.NS.ROSTER
        }));
}
Jabber.prototype.addToTree = function (jid, name, group) {
    var temp = jid.split('@');
    var newContact = new JabberContact({
        user: temp[0],
        domain: temp[1],
        jid: jid,
        name: name
    });
    var newGroup = this.treeUsers.getNodeById('group-id-' + group);
    //var check = this.treeUsers.getNodeById('idcontacto-' + jid);
    var tempContact = null;
    var contactos = null;
    var grupos = this.treeUsers.getRootNode().childNodes;
    for (i = 0; i < grupos.length; i++) {
        if (grupos[i] instanceof JabberGroup) {
            contactos = grupos[i].childNodes;
            for (j = 0; j < contactos.length; j++) {
                if (contactos[j] instanceof JabberContact) {
                    if (contactos[j].jid == jid) {
                        tempContact = contactos[j];
                    }
                }
            }
        }
    }
    if (newGroup && tempContact == null) {
        newGroup.appendChild(newContact);
    }
    newContact.setStatus(Strophe.Status.DISCONNECTED);
}
Jabber.prototype.sendSubcription = function (jid) {
    this.getConection().send($pres({
        to: jid,
        'type': 'subscribe'
    }));
}
Jabber.prototype.subscribe = function (jid, name, group) {
    this.addContact(jid, name, group);
    this.aceptSubscription(jid);
    this.sendSubcription(jid);
    //this.addToTree(jid, name, group);
}
Jabber.prototype.aceptSubscription = function (jid) {
    this.getConection().send($pres({
        to: jid,
        type: "subscribed"
    }));
}

Jabber.prototype.initTreeMenu = function () {
    var scope = this;
    if (!this.Treemenu)
        this.Treemenu = new Ext.menu.Menu(
            {
                items: [
                    new Ext.menu.Item({
                        text: XMPP.idioma.es.etiqueta.containers.jabberAddGroups,
                        handler: this.createAddGroup.createDelegate(this)
                    })

                ]
            });
    return this.Treemenu;

}

Jabber.prototype.createAddGroup = function () {
    var scope = this;
    grupo = new Ext.form.TextField({
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberGroup,
        value: "",
        id: 'textfieldGroup',
        enableKeyEvents: true,
        allowBlank: false,
        listeners: {
            keyup: function () {
                var temp = Ext.getCmp('textfieldGroup');
                if (!temp.getValue()) {
                    Ext.getCmp('btnAddGroup').disable();
                } else {
                    Ext.getCmp('btnAddGroup').enable();
                }

            }
        }
    });

    var fpgrupo = new Ext.FormPanel({
        frame: true,
        layout: 'form',
        width: '100%',
        border: 0,
        items: [grupo]
    });
    var onEnter = function () {
        if (grupo.getValue())
            scope.adicionarGrupo(grupo.getValue());

    }
    var addWin = new Ext.Window({
        layout: 'fit',
        width: 300,
        modal: true,
        resizable: false,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberAutenticate,
        height: 110,
        manager: this.manager,
        closeAction: 'hide',
        title: XMPP.idioma.es.etiqueta.containers.jabberAddGroups,
        plain: true,
        listeners: {
            render: function (win) {
                win.show();
            }
        },
        items: [fpgrupo],
        bbar: ['->',
            {
                text: XMPP.idioma.es.etiqueta.button.jabberCancel,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberCancel,
                handler: function () {
                    addWin.close();
                }
            },
            {
                text: XMPP.idioma.es.etiqueta.button.jabberAcept,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberAcept,
                id: 'btnAddGroup',
                disabled: true,
                handler: function () {
                    if (grupo.getValue())
                        scope.subscribe(scope.getConection().jid, scope.getConection().jid.split('@')[0], grupo.getValue());
                    addWin.close();
                }
            }


        ],
        keys: [
            {
                key: Ext.EventObject.ENTER,
                scope: this,
                fn: function (key, e) {
                    if (fpgrupo.getForm().isValid()) {
                        onEnter();
                    }
                    else {
                        alert(XMPP.idioma.es.etiqueta.msg.jabberEnterData);
                    }
                }
            }
        ]
    });
    return addWin;

}

Jabber.prototype.adicionarGrupo = function (newgroup) {
    this.subscribe(this.getConection().jid, this.getConection().jid.split('@')[0], newgroup);
    var Group = new JabberGroup({
        text: newgroup
    });
    this.treeUsers.getRootNode().appendChild(Group);
}
Jabber.prototype.addContact = function (jid, name, grupo) {
    var scope = this;
    var iq = $iq({
        type: 'set'
    }).c('query', {
            xmlns: Strophe.NS.ROSTER
        }).c('item', {
            name: name || '',
            jid: jid
        });
    iq.c('group').t(grupo).up();
    this.getConection().sendIQ(iq);

}
Jabber.prototype.removeGroup = function (jid, grupo) {
    /**var iq = $iq({
        type: 'set'
    }).c('group').t(grupo).remove();
     this.getConection().sendIQ(iq);*/
  //  console.log(jid, grupo);
}

Jabber.prototype.updateContact = function (jid, newAlias, newGroup) {
    /**this.getConection().sendIQ($iq({
        type: "set"
    }).c("query", {
            xmlns: Strophe.NS.ROSTER
        }).c("item", {
            jid: jid,
            name: name || ""
        }));*/
    var scope=this;
    scope.cancel_your_subscription(jid);
    scope.addContact(jid, newAlias, newGroup);
    //Actualizar los datos del tree.
}

Jabber.prototype.updateGroup = function (jid, grupo) {
    /**this.getConection().sendIQ($iq({
        type: "set"
    }).c("query", {
            xmlns: Strophe.NS.ROSTER
        }).c("item", {
            jid: jid,
            name: name || ""
        }));*/
    //console.log(jid, grupo);
}

Jabber.prototype.onPresence = function (presence) {
    if (this.getConection().jid != presence.getAttribute('from')) {
        var type = presence.getAttribute('type');
        var from = presence.getAttribute('from');
        if (type == null) {
            var rootNode = this.treeUsers.getRootNode();
            if (!rootNode.hasChildNodes()) {
                var iqs = Ext.DomQuery.select("iq", presence.parentElement);
                var scope = this;
                Ext.each(iqs, function (iq) {
                    scope.onPresenceChanged(iq);
                });
                rootNode.eachChild(function (childNode) {
                    var user = childNode.findChild('userDomain', from.split('/')[0]);
                    if (user) {
                        user.setStatus(Strophe.Status.CONNECTED);
                    }
                }, this);
            } else {
                rootNode.eachChild(function (childNode) {
                    var user = childNode.findChild('userDomain', from.split('/')[0]);
                    var existUserInAnotherGroup = false;
                    if (user) {
                        var size = this.WindowsSize();
                        if (user.status != Strophe.Status.CONNECTED && !existUserInAnotherGroup) {
                            Ext.example.msg(
                                XMPP.idioma.es.etiqueta.title.jabberInformation,
                                String.format(XMPP.idioma.es.etiqueta.msg.jabberConnectedUser, from.split('/')[0]),
                                'msg-alert',
                                [size.width, 30]
                            );
                        }
                        user.setStatus(Strophe.Status.CONNECTED);
                    }
                }, this);
            }
        }

    }

}

Jabber.prototype.onSubscribe = function (presence) {
    var scope = this;
    var node = Strophe.getNodeFromJid(this.getConection().jid);

    if (Strophe.getNodeFromJid(presence.getAttribute('from')) != node) {
        var type = presence.getAttribute('type');
        var from = presence.getAttribute('from');
        var size = this.WindowsSize();
        Ext.example.msg(XMPP.idioma.es.etiqueta.title.jabberSubscription, String.format(XMPP.idioma.es.etiqueta.msg.jabberSendToYou, from), 'msg-alert', [size.width, 30]);
        scope.seletcGroups(presence);

    }

}

Jabber.prototype.getByAttribute = function (node, attr, value) {
    return node.findChild(attr, value);
}
Jabber.prototype.AceptarSubscripcion = function () {
    var scope = this;
    var usuario = false;
    var grupo = false;
    if (this.gridUsersToSubcribe && this.gridUsersToSubcribe.getSelectionModel()) {
        usuario = this.gridUsersToSubcribe.getSelectionModel().getSelected();
    }
    if (this.gridGroup && this.gridGroup.getSelectionModel()) {
        grupo = this.gridGroup.getSelectionModel().getSelected();
    }
    if (usuario && !grupo) {
        var username = usuario.get('user');
        var jid = usuario.get('direccion');
        var nodo=null;
        for(var j=0; j<scope.treeUsers.getRootNode().childNodes.length; j++) {
            if (scope.treeUsers.getRootNode().childNodes[j] instanceof JabberGroup) {
                if (scope.treeUsers.getRootNode().childNodes[j].text == "Contactos") {
                    nodo = scope.treeUsers.getRootNode().childNodes[j].text;
                }
            }
        }
        if ( nodo == null) {
            nodo = XMPP.idioma.es.etiqueta.label.jabberContacts;
            scope.adicionarGrupo(nodo);
        }
        this.gridUsersToSubcribe.getStore().remove(usuario);
        scope.subscribe(jid, username, nodo);
    } else if (!usuario) {
        Ext.Msg.show({
            title: XMPP.idioma.es.etiqueta.title.jabberError,
            msg: XMPP.idioma.es.etiqueta.msg.jabberErrorSelectUser,
            width: 300,
            modal: false,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
        return true;
    }
}

Jabber.prototype.seletcGroups = function (presence) {
    var scope = this;
    var from = presence.getAttribute('from');
    var usuario = from.split('@')[0];
    var domain = from.split('@')[1];
    if (!this.storeSubscribeUsers) {
        this.storeSubscribeUsers = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'user'
                },

                {
                    name: 'direccion'
                }
            ]
        });
    }
    this.storeSubscribeUsers.loadData([ [from.split('@')[0], from] ], true);

    if (!this.storeSubscribeGroup) {
        this.storeSubscribeGroup = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'groups'
                },

                {
                    name: 'index'
                },

                {
                    name: 'id'
                }
            ]
        });
    }

    this.storeSubscribeGroup.loadData(scope.getGroups(), true);
    //var temporal=this.treeUsers.getRootNode();

    //console.log('los grupos', temporal);

    if (!this.gridGroup) {
        this.gridGroup = new Ext.grid.GridPanel({
            store: this.storeSubscribeGroup,
            region: 'center',
            cm: new Ext.grid.ColumnModel([
                {
                    id: 'groups',
                    header: XMPP.idioma.es.etiqueta.label.jabberGroups,
                    width: 160,
                    sortable: true,
                    dataIndex: 'groups'
                },

                {
                    id: 'index',
                    header: "Index",
                    width: 160,
                    sortable: true,
                    dataIndex: 'index',
                    hidden: true
                },

                {
                    id: 'id',
                    header: "id",
                    width: 160,
                    sortable: true,
                    dataIndex: 'id',
                    hidden: true
                }

            ]),
            selModel: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            stripeRows: true,
            autoExpandColumn: 'groups',
            height: 300,
            width: '100%'
        });
    }

    if (!this.gridUsersToSubcribe) {
        this.gridUsersToSubcribe = new Ext.grid.GridPanel({
            store: this.storeSubscribeUsers,
            region: 'north',
            cm: new Ext.grid.ColumnModel([
                {
                    id: 'user',
                    header: XMPP.idioma.es.etiqueta.label.jabberUsers,
                    width: 160,
                    sortable: true,
                    dataIndex: 'user'
                },

                {
                    id: 'direccion',
                    header: XMPP.idioma.es.etiqueta.label.jabberDomains,
                    width: 160,
                    sortable: true,
                    dataIndex: 'direccion'
                }

            ]),
            selModel: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            stripeRows: true,
            autoExpandColumn: 'direccion',
            height: 200,
            width: '100%'
        });
    }

    var btAceptar = function () {
        var tempo = scope.AceptarSubscripcion();
        if (tempo != true) {
            scope.aceptWinSubscription.hide();
        }
    };
    var btCancelar = function () {
        scope.aceptWinSubscription.hide();
    };
    var btAplicar = function () {
        scope.AceptarSubscripcion();
        if (scope.storeSubscribeUsers.getCount() <= 0)
            scope.aceptWinSubscription.hide();
    }
    if (!this.aceptWinSubscription) {
        this.aceptWinSubscription = new Ext.Window({
            width: 400,
            title: XMPP.idioma.es.etiqueta.containers.jabberAceptRequest,
            height: 500,
            minimizable: false,
            closeAction: 'hide',
            resizable: false,
            maximizable: false,
            modal: true,
            layout: 'border',
            renderTo: Ext.getBody(),
            items: [this.gridGroup, this.gridUsersToSubcribe],
            bbar: [
                '->',
                new Ext.Button({
                    text: XMPP.idioma.es.etiqueta.button.jabberCancel,
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberCancel,
                    handler: btCancelar.createDelegate(this)
                }),
            /**new Ext.Button({
                    text: XMPP.idioma.es.etiqueta.button.jabberApply,
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberApply,
                    handler: btAplicar.createDelegate(this)
                }),*/
                new Ext.Button({
                    text: XMPP.idioma.es.etiqueta.button.jabberAcept,
                    iconCls: XMPP.idioma.es.etiqueta.styles.jabberAcept,
                    handler: btAceptar.createDelegate(this)
                })

            ]
        });
    }
    if (!this.aceptWinSubscription.isVisible()) {
        this.aceptWinSubscription.show(this);
    }

}

Jabber.prototype.getGroups = function () {
    var groups = [];
    var scope = this;
    var index = 0;
    var temp = scope.treeUsers.getRootNode().childNodes;
    temp.cascade(
        function(n) {
            if(n != temp && !n.leaf){
                groups.push([n.text, index++, n.id]);
            }
        }
    );
    //console.log('grupos', groups);

    return groups;
}
Jabber.prototype.onPresenceChanged = function (iq) {

    var node = Strophe.getNodeFromJid(this.getConection().jid);
    var typeIq = iq.getAttribute('type');
    var grupos = Ext.DomQuery.select("query item group", iq);
    var scope = this;
    if (!scope.groups)
        scope.groups = [];
    Ext.each(grupos, function (grupo) {
        var grupo = Ext.DomQuery.selectValue("", grupo);
        var existeGrupo = scope.treeUsers.getNodeById('group-id-' + grupo);
        var newGroup = null;
        if (!existeGrupo) {
            scope.groups.push(grupo);
            newGroup = new JabberGroup({
                text: grupo
            });
            scope.treeUsers.getRootNode().appendChild(newGroup);
            newGroup.expand();
        } else {
            newGroup = existeGrupo;
        }
        var usuarios = Ext.DomQuery.select("query item", iq);
        Ext.each(usuarios, function (user) {
            var query = "group:nodeValue(" + grupo + ")";
            var esta = Ext.DomQuery.select(query, user);
            if (esta.length > 0) {
                var usuario = Strophe.getNodeFromJid(user.getAttribute('jid'));
                var dominio = Strophe.getDomainFromJid(user.getAttribute('jid'));
                if (usuario && (usuario + '@' + dominio) != this.getConection().jid.split('/')[0]) {
                    var userNode = newGroup.findChild('userDomain', usuario + '@' + dominio);
                    if (!userNode) {
                        var name = user.getAttribute('name');
                        var newContact = new JabberContact({
                            name: (name) ? name : usuario,
                            jid: user.getAttribute('jid'),
                            user: usuario,
                            domain: dominio,
                            userDomain: usuario + '@' + dominio,
                            iconCls: XMPP.idioma.es.etiqueta.styles.jabberDisConection
                        });
                        newGroup.appendChild(newContact);
                        newContact.setStatus(Strophe.Status.DISCONNECTED);
                    }
                }
                if (!usuario) {
                    this.cancel_your_subscription(usuario + '@' + dominio);
                }


            }
        }, scope);


    }, this);


}
Jabber.prototype.onUnSubscribe = function (presence) {
    var scope = this;
    var node = Strophe.getNodeFromJid(this.getConection().jid);
    if (Strophe.getNodeFromJid(presence.getAttribute('from')) != node) {
        var type = presence.getAttribute('type');
        var from = presence.getAttribute('from');
        var size = this.WindowsSize();
        Ext.example.msg(
            XMPP.idioma.es.etiqueta.title.jabberInformation,
            String.format(XMPP.idioma.es.etiqueta.msg.jabberDeletedUser, from.split('/')[0]),
            'msg-alert',
            [size.width, 30]
        );
    }

}
Jabber.prototype.onUnSubscribed = function (presence) {
    var scope = this;
    var node = Strophe.getNodeFromJid(this.getConection().jid);
    if (Strophe.getNodeFromJid(presence.getAttribute('from')) != node) {
        var type = presence.getAttribute('type');
        var from = presence.getAttribute('from');
        var size = this.WindowsSize();
        Ext.example.msg(
            XMPP.idioma.es.etiqueta.title.jabberInformation,
            String.format(XMPP.idioma.es.etiqueta.msg.jabberNotAcepted, from.split('/')[0]),
            'msg-alert',
            [size.width, 30]
        );
        var fun = function (option, event) {
            if (option == 'yes' || option == 'ok' || option == 'aceptar') {
                var rootNode = scope.treeUsers.getRootNode();
                rootNode.eachChild(function (childNode) {
                    var user = childNode.findChild('userDomain', from.split('/')[0]);
                    if (user) {
                        user.deleteContact(true);
                    }
                }, scope);
            }
        }
        Ext.MessageBox.confirm(
            XMPP.idioma.es.etiqueta.title.jabberInformation,
            String.format(XMPP.idioma.es.etiqueta.msg.jabberDeleteUserNotAcepted, from.split('/')[0]),
            fun,
            this
        );
    }

}
Jabber.prototype.onUnAvaliable = function (presence) {
    var scope = this;
    var node = Strophe.getNodeFromJid(this.getConection().jid);
    if (Strophe.getNodeFromJid(presence.getAttribute('from')) != node) {
        var from = presence.getAttribute('from');
        var rootNode = scope.treeUsers.getRootNode();
        var existUserInAnotherGroup = false;
        rootNode.eachChild(function (childNode) {
            var user = childNode.findChild('userDomain', from.split('/')[0]);
            var size = this.WindowsSize();
            if (user) {
                user.setStatus(Strophe.Status.DISCONNECTED);
                if (!existUserInAnotherGroup) {
                    Ext.example.msg(
                        XMPP.idioma.es.etiqueta.title.jabberInformation,
                        String.format(XMPP.idioma.es.etiqueta.msg.jabberDisConnectedUser, from.split('/')[0]),
                        'msg-alert',
                        [size.width, 30]
                    );
                }
            }
        }, this);
    }
}
Jabber.prototype.onMessage = function (message) {
    var from = message.getAttribute('from');
    var idFrom = from.split("@")[0];
    var fromResource = from.split("/")[0];
    var text = Ext.DomQuery.selectValue("body", message);
    var composing = Ext.DomQuery.select("composing", message)[0];
    var activate = Ext.DomQuery.select("active", message)[0];
    var paused = Ext.DomQuery.select("paused", message)[0];
    var stateMessage = false;
    if (composing)
        stateMessage = composing;
    if (activate)
        stateMessage = activate;
    if (paused)
        stateMessage = paused;
    var cmp = this.tabMessage.findById(fromResource);
    if (!cmp) {
        var temp = new JabberMessage({
            from: fromResource,
            id: fromResource,
            message: text
        }, this);
        temp.setStateMessage(stateMessage);
        if (text != 'undefined')
            temp.AddMessage(from, text);
        this.tabMessage.add(temp);
        this.tabMessage.setActiveTab(temp);

    }
    else {
        cmp.setStateMessage(stateMessage);
        if (text != 'undefined')
            cmp.AddMessage(from, text);
        this.tabMessage.setActiveTab(cmp);
        cmp.show();
    }
    this.tabMessage.doLayout(true);
    this.winMessage.show();

}


Jabber.prototype.getSearchToolBar = function (callback, searchcallback, text, btn, scope, items) {
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
            disabled: true,
            enableToggle: true,
            width: '20%',
            listeners: {
                click: function (bt, e) {
                    scope.treeUsers.collapseAll();
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
            disabled: true,
            enableToggle: true,
            width: '20%',
            listeners: {
                click: function (bt, e) {
                    scope.treeUsers.expandAll();
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


Jabber.prototype.search = function () {

    var scope = this;
    var value = scope.searchTextValue.getRawValue();
    var tree = scope.treeUsers;
    //if (tree && value.length<=0)
    //tree.getLoader().load(tree.getRootNode());
    if (tree) {
        tree.root.cascade(function (n) {
            if (n != tree.root && value) {
                if (n instanceof JabberContact) {
                    if (!(n.text.toLowerCase().indexOf(value.toLowerCase()) == 0)) {
                        n.ui.hide();

                    }
                    else
                        n.ui.show();
                }
                /*else if (!n.attributes.leaf) {
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

Jabber.prototype.refreshSearch = function (b, e, s) {
    s.search();

}
XMPP.Jabber = Jabber;