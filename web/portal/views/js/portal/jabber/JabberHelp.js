function JabberHelp(conf, owner) {
    conf = conf || {};
    this.parent = owner;
    var temp = '<img width=16 height=16 src="../../views/js/portal/jabber/resources/images/docs.gif" ></img>';
    this.searchToolBar = this.getSearchToolBar(this.search.createDelegate(this), this.refreshSearch.createDelegate(this), this.TextSearchTree, this.btRefreshTree, this);
    conf = Ext.apply(conf,
        {
            title: temp + XMPP.idioma.es.etiqueta.containers.jabberHelp,
            height: 500,
            closable: true,
            frame: true,
            autoShow: true,
            //tbar:this.searchToolBar,
            width: "100%",
            listeners: {
                render: function (c) {
                    c.body.dom.style.background = 'url(/portal/views/js/portal/jabber/resources/images/splashbirdcenter.png?id=' + Math.random() * 9999999 + ') ';

                },
                show: function (c) {
                    c.parent.parent.tabMessage.setSize(600, 500);
                }
            }

        });
    Ext.Panel.call(this, conf);
    return this;
}

JabberHelp.prototype = new Ext.Panel;


JabberHelp.prototype.createTemplate = function () {


}

JabberHelp.prototype.getSearchToolBar = function (callback, searchcallback, text, btn, scope, items) {
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
    scope.btBuscar = new Ext.Button(
        {
            //xtype:'button',
            iconCls: XMPP.idioma.es.etiqueta.styles.jabberSearch,
            tooltip: XMPP.idioma.es.etiqueta.text.jabberSearch,
            id: btn + '-buscar',
            pressed: false,
            disabled: true,
            enableToggle: true,
            width: '20%',
            listeners: {
                click: function (bt, e) {

                }

            }
        });


    var item = [scope.searchTextValue, scope.btBuscar];
    if (items && items instanceof Array)
        item = items.concat(item);
    return new Ext.Toolbar({
        cls: XMPP.idioma.es.etiqueta.styles.jabberToolBar,
        items: item

    });
}


JabberHelp.prototype.search = function () {

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

JabberHelp.prototype.refreshSearch = function (b, e, s) {
    s.search();

}

XMPP.JabberHelp = JabberHelp;
