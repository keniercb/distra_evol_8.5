/*
 * Ext JS Library 2.1 Copyright(c) 2006-2008, Ext JS, LLC. licensing@extjs.com
 *
 * http://extjs.com/license
 */

/**
 * @class Ext.ux.StartMenu
 * @extends Ext.menu.Menu A start menu object.
 * @constructor Creates a new StartMenu
 * @param {Object}
 *            config Configuration options
 *
 * SAMPLE USAGE:
 *
 * this.startMenu = new Ext.ux.StartMenu({ iconCls: 'user', height: 300, shadow:
 * true, title: get_cookie('memberName'), width: 300 });
 *
 * this.startMenu.add({ text: 'Grid Window', iconCls:'icon-grid', handler :
 * this.createWindow, scope: this });
 *
 * this.startMenu.addTool({ text:'Logout', iconCls:'logout', handler:function(){
 * window.location = "logout.php"; }, scope:this });
 */

Ext.namespace("Ext.ux");

Ext.ux.StartMenu = function (config) {
    Ext.ux.StartMenu.superclass.constructor.call(this, config);

    var tools = this.toolItems;
    this.toolItems = new Ext.util.MixedCollection();
    if (tools) {

        this.addTool.apply(this, tools);
    }
};

Ext.extend(Ext.ux.StartMenu, Ext.menu.Menu, {
    // private
    render: function () {

        if (this.el) {
            return;
        }
        var el = this.el = new Ext.Layer({
            cls: "x-menu ux-start-menu", // this might affect item
            // click
            shadow: this.shadow,
            constrain: false,
            parentEl: this.parentEl || document.body,
            zindex: 15000
        });

        var header = el.createChild({
            tag: "div",
            cls: "x-window-header x-unselectable x-panel-icon "
                + this.iconCls
        });
        this.header = header;
        var headerText = header.createChild({
            tag: "span",
            cls: "x-window-header-text"
        });
        var tl = header.wrap({
            cls: "ux-start-menu-tl"
        });
        var tr = header.wrap({
            cls: "ux-start-menu-tr"
        });
        var tc = header.wrap({
            cls: "ux-start-menu-tc"
        });

        this.menuBWrap = el.createChild({
            tag: "div",
            cls: "x-window-body x-border-layout-ct ux-start-menu-body"
        });
        var ml = this.menuBWrap.wrap({
            cls: "ux-start-menu-ml"
        });
        var mc = this.menuBWrap.wrap({
            cls: "x-window-mc ux-start-menu-bwrap"
        });

        this.menuPanel = this.menuBWrap.createChild({
            tag: "div",
            cls: "x-panel x-border-panel ux-start-menu-apps-panel"
        });
        this.toolsPanel = this.menuBWrap.createChild({
            tag: "div",
            cls: "x-panel x-border-panel ux-start-menu-tools-panel"
        });
        var usrImg = this.toolsPanel.createChild({
            tag: "div",
            cls: "x-panel x-border-panel"
        });

        var divProfile = usrImg.createChild({
            tag: "div",
            cls: "user-profile-container"
        });
        var img_panel_container = divProfile.createChild({
            tag: "div",
            cls: "user-profile"
        });

        var src = this.perfil.foto;

        if (src.indexOf(".jpg") === -1 && src.indexOf(".png") === -1 && src.indexOf(".bmp") === -1) {//es porque es la version nueva de persona
             src = "data:image\/png;base64," + this.perfil.foto;
        }

        var titulo = new Ext.Panel({
            width: 85,
            height: 85,
            html: '<img width=85 height=85 src=' + src + '>'
        });
        titulo.on("render", function () {
            if (typeof(Ext.pvd) != 'undefined') {
                titulo.getEl().on("click", function () {
                    this.winPerfilPersonaSeg = new Ext.pvd.persona.perfilseguridad.WinperfilSeguridad({
                        persona: UCID.portal.perfil.idpersona
                    });
                    Ext.WindowMgr.register(this.winPerfilPersonaSeg);
                    this.winPerfilPersonaSeg.show();
                }, this);
            }
        }, this);

        titulo.render(img_panel_container);
        var bwrap = ml.wrap({
            cls: "x-window-bwrap"
        });
        var bc = bwrap.createChild({
            tag: "div",
            cls: "ux-start-menu-bc"
        });
        var bl = bc.wrap({
            cls: "ux-start-menu-bl x-panel-nofooter"
        });
        var br = bc.wrap({
            cls: "ux-start-menu-br"
        });

        this.keyNav = new Ext.menu.MenuNav(this);

        if (this.plain) {
            el.addClass("x-menu-plain");
        }
        if (this.cls) {
            el.addClass(this.cls);
        }
        // generic focus element
        this.focusEl = el.createChild({
            tag: "a",
            cls: "x-menu-focus",
            href: "#",
            onclick: "return false;",
            tabIndex: "-1"
        });

        var ul = this.menuPanel.createChild({
            tag: "ul",
            cls: "x-menu-list"
        });
        var toolsUl = usrImg.createChild({
            tag: "ul",
            cls: "x-menu-list"
        });

        var ulListeners = {
           "click": {
                fn: this.onClick,
                scope: this
            },
            "mouseover": {
                fn: this.onMouseOver,
                scope: this
            },
            "mouseout": {
                fn: this.onMouseOut,
                scope: this
            }

        };

        ul.on(ulListeners);

        this.items.each(function (item) {
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            ul.dom.appendChild(li);
            item.render(li, this);
        }, this);

        this.ul = ul;
        this.autoWidth();

        toolsUl.on(ulListeners);

        this.toolItems.each(function (item) {
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            toolsUl.dom.appendChild(li);
            item.render(li, this);
            new Ext.ToolTip({
                target: li,
                html: item.tooltip
            });

        }, this);

        this.toolsUl = toolsUl;
        this.autoWidth();

        this.menuBWrap.setStyle('position', 'relative');
        this.menuBWrap.setHeight(320); // Tamanno del menu general
        // ((this.height)se le pasa 300)

        this.menuPanel.setStyle({
            padding: '2px',
            position: 'absolute',
            overflow: 'auto'
        });

        this.toolsPanel.setStyle({
            padding: '2px 4px 2px 2px',
            position: 'absolute',
            overflow: 'auto'
        });

        this.setTitle(this.title);
    },

    // private
    findTargetItem: function (e) {
        var t = e.getTarget(".x-menu-list-item", this.ul, true);
        if (t && t.menuItemId) {
            if (this.items.get(t.menuItemId)) {
                return this.items.get(t.menuItemId);
            } else {
                return this.toolItems.get(t.menuItemId);
            }
        }
    },

    /**
     * Displays this menu relative to another element
     *
     * @param {Mixed}
     *            element The element to align to
     * @param {String}
     *            position (optional) The {@link Ext.Element#alignTo} anchor
     *            position to use in aligning to the element (defaults to
     *            this.defaultAlign)
     * @param {Ext.ux.StartMenu}
     *            parentMenu (optional) This menu's parent menu, if applicable
     *            (defaults to undefined)
     */
    show: function (el, pos, parentMenu) {

        pos = 'tl-bl'; // Girando el menu inicio de posicion

        this.parentMenu = parentMenu;
        if (!this.el) {
            this.render();
        }

        this.fireEvent("beforeshow", this);
        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign),
            parentMenu, false);

        var tPanelWidth = 140; // Panel de config de botones generales 0000
        var box = this.menuBWrap.getBox();
        this.menuPanel.setWidth(box.width - tPanelWidth);
        this.menuPanel.setHeight(box.height);

        this.toolsPanel.setWidth(tPanelWidth);
        this.toolsPanel.setX(box.x + box.width - tPanelWidth);
        this.toolsPanel.setHeight(box.height);

        var self = this;
    
        var contextMenu = null;
        function recorerItems(item) {
            if (item.menu) {
                item.on('activate',function(){

                    var length = document.getElementsByClassName('x-menu-item-active').length
                    document.getElementsByClassName('x-menu-item-active')[length-1].oncontextmenu = function(evt) {

                        var xaxis = evt.clientX;
                        var yayis = evt.clientY;
                        var menu = this;
                        if(contextMenu){
                            contextMenu.destroy();
                        }
                        contextMenu = new Ext.menu.Menu({
                            id: 'menucontextmenu',
                            allowOtherMenus :true,
                            items: [{
                                id: 'cambiaricon',
                                text: 'Cambiar icono',
                                //icon: perfil.dirImg + 'cambiar.png',
                                iconCls: 'cambiar',
                                handler: function() {
                                    self.hide();
                                    if(Ext.getCmp('winReiconSeg')){
                                        Ext.getCmp('winReiconSeg').fireEvent('close');
                                        Ext.getCmp('winReiconSeg').destroy();
                                    }
                                    var reicon = new Ext.comun.wind.ReiconMenu({
                                        minimizable: true,
                                        name: item
                                    });
                                    reicon.show();
                            }
                            }]
                        });
                        contextMenu.showAt([xaxis, yayis]);
                        return false;

                       
                    };
                },this)
               item.on('deactivate', function() {
                   if(contextMenu){
                       contextMenu.destroy();
                   }
                },this);

                item.menu.items.each(function(mas) {

                    recorerItems(mas)

                }, this)

            } else {

                item.on('activate', function() {

                    var length = document.getElementsByClassName('x-menu-item-active').length
                    document.getElementsByClassName('x-menu-item-active')[length-1].oncontextmenu = function(evt) {
                        var xaxis = evt.clientX;
                        var yayis = evt.clientY;
                        var menu = this;
                        if(contextMenu){
                            contextMenu.destroy();
                        }
                        contextMenu = new Ext.menu.Menu({
                            id: 'menucontextmenu',
                            allowOtherMenus :true,
                            items: [{
                                id: 'details',
                                text: 'Crear acceso directo',
                                //icon: perfil.dirImg + 'aceptar.png',
                                iconCls: 'aceptar',
                                handler: function() {
                                    self.hide();
                                    var  myMaske = new Ext.LoadMask(Ext.getBody(), {msg:'Guardando...'});
                                    myMaske.show();
                                    Ext.Ajax.request({
                                        url: '/portal/index.php/apariencia/obtenerIconoFuncionalidad',
                                        method: 'POST',
                                        params: {
                                            idfunc: item.aWinConfig.id
                                        },
                                        callback: function (options, success, response) {
                                            var  responseData = Ext.decode(response.responseText);
                                            var icon = responseData.icono ? responseData.icono : 'folder';
                                            var src={
                                                aWinConfig : {
                                                    id : item.aWinConfig.id,
                                                    text : item.aWinConfig.text,
                                                    referencia : "/"+item.aWinConfig.referencia,
                                                    index : 0,
                                                    estado:'agregar',
                                                    icono: icon
                                                }
                                            };
                                            Ext.Ajax.request({
                                                url: '/portal/index.php/apariencia/guardarAccesoDirecto',
                                                method: 'POST',
                                                params: {
                                                    acceso: Ext.encode(src),
                                                    bandera: 'accesos',
                                                    addStarMenu: 'true'
                                                },
                                                callback: function(options, success, response) {
                                                    var  responseData = Ext.decode(response.responseText);
                                                    mostrarMensaje(responseData.cod,responseData.mensaje);
                                                    myMaske.hide();
                                                    var obj = Ext.decode(response.responseText);
                                                    var obj = obj.mensaje;
                                                    if (obj.indexOf('y') == -1) {
                                                        crearAcceso(src);
                                                    }

                                                }
                                            });
                                        }
                                    });
                                }
                            },{
                                id: 'cambiaricon',
                                text: 'Cambiar icono',
                                //icon: perfil.dirImg + 'cambiar.png',
                                iconCls: 'cambiar',
                                handler: function() {
                                  
                                    //self.hide();
                                    var reicon = new Ext.comun.wind.ReiconMenu({
                                       name: item,
                                       inicio: self
                                    });
                                    reicon.show();
                            }
                            },{
                                id: 'acercade',
                                text: 'Acerca de',
                                //icon: perfil.dirImg + 'info.png',
                                iconCls: 'info',
                                handler: function() {
                                    self.hide();
                                    var referencia=item.aWinConfig.referencia;
                                    if(referencia.indexOf('../../..')!=-1){
                                        var cadena=referencia.split('../../..');
                                        referencia=cadena[1];
                                    }
                                    var ref=referencia;
                                    ref=ref.split('index.php');
                                    var result=ref[0];
                                    result=result.substring(1,result.length-1);
                                    acercaDe.show(result);

                                }
                            }]
                        });
                        contextMenu.showAt([xaxis, yayis]);
                        return false;

                       
                    };
                },this);
               item.on('deactivate', function() {
                   if(contextMenu){
                       contextMenu.destroy();
                   }
                },this);
            }
        }
        this.items.each(function(item) {
         recorerItems(item);
        }, this);

    },

    addTool: function () {

        var a = arguments, l = a.length, item;

        for (var i = 0; i < l; i++) {
            var el = a[i];

            if (el.render) { // some kind of Item
                item = this.addToolItem(el);
            } else if (typeof el == "string") { // string
                if (el == "separator" || el == "-") {
                    item = this.addToolSeparator();
                } else {
                    item = this.addText(el);
                }
            } else if (el.tagName || el.el) { // element
                item = this.addElement(el);
            } else if (typeof el == "object") { // must be menu item config?
                item = this.addToolMenuItem(el);
            }
        }
        return item;
    },

    /**
     * Adds a separator bar to the Tools
     *
     * @return {Ext.menu.Item} The menu item that was added
     */
    addToolSeparator: function () {

        return this.addToolItem(new Ext.menu.Separator({
            itemCls: 'ux-toolmenu-sep'
        }));
    },

    addToolItem: function (item) {

        this.toolItems.add(item);
        if (this.ul) {
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            this.ul.dom.appendChild(li);
            item.render(li, this);
            this.delayAutoWidth();
        }
        return item;
    },

    addToolMenuItem: function (config) {

        if (!(config instanceof Ext.menu.Item)) {
            if (typeof config.checked == "boolean") { // must be check menu
                // item config?
                config = new Ext.menu.CheckItem(config);
            } else {
                config = new Ext.menu.Item(config);
            }
        }
        return this.addToolItem(config);
    },

    setTitle: function (title, iconCls) {

        this.title = title;
        this.header.child('span').update(title);
        return this;
    }
});
