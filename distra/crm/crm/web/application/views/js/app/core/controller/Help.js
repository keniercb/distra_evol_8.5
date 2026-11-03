Ext.define('CRM.core.controller.Help', {
    extend: 'Ext.app.Controller',

    support: false,
    about: false,
    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'menuitem[action=help],tool[action=help]': {
                    click: this.showHelp
                },
                'menuitem[action=about]': {
                    click: this.showAbout
                },
                'menuitem[action=support]': {
                    click: this.showSupport
                },
                'button[action=help]': {
                    sethelp: function (btn) {
                        var menuhelp = btn.down('menuitem[action=help]');
                        menuhelp.refhelp = btn.refhelp;
                    }
                },
                'window[action=about],window[action=support]': {
                    show: function (window) {
                        this[window.action] = true;
                    },
                    close: function (window) {
                        this[window.action] = false;
                    },
                    destroy: function (window) {
                        this[window.action] = false;
                    }
                }
            }
        });


        Ext.override(Ext.Button, {
            initComponent: function () {
                me.setMenuHelp(this);
                this.callParent();
            }
        });
    },
    setMenuHelp: function (btn) {
        if (btn.xtype != "button" || btn.action != 'help') {
            return;
        }

        btn.setTooltip(this.etiquetas.qtipSystemHelp);

        btn.menu = Ext.create('Ext.menu.Menu', {
            plain: true,
            style: {
                overflow: 'visible'
            },
            items: [
                {
                    text: this.etiquetas.lbBtnhelp,
                    tooltip: this.etiquetas.qtipHelp,
                    iconCls: 'ayuda',
                    action: 'help',
                    refhelp: btn.refhelp,
                    keyMap: {
                        key: Ext.EventObject.F1,
                        ctrl: true,
                        event: 'click'
                    }
                }, {
                    text: this.etiquetas.lbBtnAbout,
                    tooltip: this.etiquetas.qtipAbout,
                    iconCls: 'info',
                    action: 'about',
                    keyMap: {
                        key: Ext.EventObject.F2,
                        ctrl: true,
                        event: 'click'
                    }
                }, {
                    text: this.etiquetas.lbBtnSupport,
                    tooltip: this.etiquetas.qtipSupport,
                    iconCls: 'info',
                    action: 'support',
                    keyMap: {
                        key: Ext.EventObject.F3,
                        ctrl: true,
                        event: 'click'
                    }
                }
            ]
        });
        btn.menu.fireEvent('render', btn.menu);
    },
    showHelp: function (btn) {
        var referencia = 'crm',
            me = this;

        window.actionhelpview = btn.refhelp;

        Ext.Ajax.request({
            url: '/portal/index.php/portal/getayuda',
            params: {
                uri: referencia
            },
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText),
                    url = document.location.origin + "/" + response.dir;

                createWin(url);
            }
        });

        function createWin(url) {
            var desk2 = window.parent.MyDesktop.getDesktop();

            window.winIframe2 = desk2.getWindow('id_' + referencia);

            window.showMeMyHelp = true;

            if (!window.winIframe2) {
                window.winIframe2 = desk2.createWindow({
                    id: 'id_' + referencia,
                    title: me.etiquetas.titleAyuda,
                    layout: 'fit',
                    width: 800,
                    maximized: true,
                    height: 490,
                    minWidth: 800,
                    minHeight: 480,
                    iconCls: 'ayuda',
                    shim: false,
                    animCollapse: false,
                    showFlag: false,
                    constrainHeader: true,
                    items: [{
                        xtype: 'panel',
                        border: false,
                        html: '<iframe id=iframeHelp' +
                        ' style="border: none;" src= "' + url + '" width="100%" height="100%" seamless>' +
                        '</iframe>',
                        layout: 'fit'
                    }]
                });

                Ext.MessageBox.show({
                    title: me.etiquetas.lbTitleWait,
                    msg: me.etiquetas.msgLoadingData,
                    width: 300,
                    progress: true,
                    closable: false
                });

                //iniciando el progreso del messagebox en 0
                Ext.MessageBox.updateProgress(0, 0 + me.etiquetas.lbCompletado);
                // this hideous block creates the bogus progress
                var f = function (v) {
                    return function () {
                        if (v == 10) {
                            Ext.MessageBox.hide();
                            window.winIframe2.show();
                        } else {
                            var i = v / 9;
                            Ext.MessageBox.updateProgress(i, Math.round(100 * i) + me.etiquetas.lbCompletado);
                        }
                    };
                };
                for (var i = 1; i < 13; i++) {
                    setTimeout(f(i), i * 250);
                }
            } else {
                desk2.taskbar.tbPanel.items.forEach(function (a, b) {
                    if (window.winIframe2.id == a.id) {
                        desk2.taskbar.tbPanel.showButton(window.winIframe2);
                    }
                });

                window.winIframe2.show();
            }
        }
    },
    showAbout: function () {
        if (this.about || this.support) {
            return;
        }
        var tpl = this.createAboutTpl(),
            data = this.getData(),
            win = Ext.create('Ext.window.Window', {
                layout: 'absolute',
                border: false,
                title: 'Acerca de gesti&oacute;n comercial',
                action: 'about',
                y: 50,
                bodyStyle: 'background-color:white;',
                closable: true,
                maximizable: true,
                width: 500,
                height: 500,
                closeAction: 'destroy',
                modal: true,
                constrain: true
            });

        win.show();
        tpl.overwrite(win.body, data);
    },
    getData: function () {
        var me = this;
        return {
            'version': '1.0',
            'nombre': me.etiquetas.lbTitleAbout,
            'fecha': '',
            'descripcion': me.etiquetas.lbDescriptionAbout,
            'autor': me.etiquetas.lbAuthorAbout,
            "dependencia": ["Zeolides 2.2.0", "Quarseg 2.1", "Ayuda 3.0"],
            "logo": "../../views/images/logo.png"
        }

    },
    createAboutTpl: function () {
        var tpl = new Ext.XTemplate(
            '<style>',
            'p#logo { text-align: center; padding : 10 0 0 0px; }',
            '.acercade{ font-size: 1.1em;} ',
            '.txtprincipal{text-align: center;font: bold 2.3em "Droid Sans",arial,sans-serif;',
            'color: rgb(0, 155, 194);', 'text-shadow: 1px 1px 2px rgba(185, 185, 185, 0.84);', '}',
            'h3{font-weight: bold;}',
            '</style>',

            '<section id="infoApp">',
            '<div style="border-bottom: solid 1px #eeeeee; box-shadow: 1px 1px 4px rgba(198, 198, 198, 0.44); text-align: center; padding-bottom: 10px; ">',
            '<p id="logo" style="margin: 0px">',
            '<tpl if="this.logoContain(logo)">',
            ' <img  src="{logo}">',
            '</tpl>',
            '<tpl if="this.logoContain(logo) == false">',
            ' <img src="/portal/views/images/index/logo-zeolides.png">',
            '</tpl>',
            '</p>',
            '<h1 style="font-size:  2.3em; margin: 0px;" class="txtPrincipal">{nombre} </h1>',//---------------Nombre-------------------
            '<h5 style="font-size:  1.2em;color: rgb(0, 155, 194);" class="">Versión: {version} </h5>',//------------Versión-----------------
            '<h3 style="font-size:  1em; color: rgb(0, 155, 194);" class="">Fecha: {fecha}</h3>',//------------------Fecha------------------
            '</div>',

            '<div class = "acercade" style="margin-bottom:20px;max-height:250px;overflow:auto; padding: 10px 5px 5px 5px;text-align: center; background-color: rgba(240, 240, 240, 0.18)">',//-------------Container----------------
            '<h3>Descripción:</h3>',//------------------Desarrollado------------ -----
            '<p style="text-align: justify;margin: 0px;">{descripcion}</p>',//------------------Desarrollado------------ -----
            '<h3>Compuesto por:</h3>',//------------------Dependencias------------
            '<ul style="margin: 0px; padding: 0px;">',
            '<tpl for="dependencia">',
            '<li style="list-style: none;">{.}</li>',
            '</tpl>',
            '</ul>',//-----------------------------------End Dependencias -----------
            '<h3>Desarrollado por:</h3>',//------------------Desarrollado------------ -----
            '<label >{autor}</label>',//------------------Desarrollado------------ -----
            '</div>',//------------------------------------End Container-----------
            '<footer style=" bottom:0; position:absolute;width: 100%; height:15;text-align: center;background-color:rgb(0, 155, 194);color: white ">',//------------------------------------Footer-----------
            '<h5>2011-2015 © Copyright XETID </h5>',//------------------------------------Footer-----------
            '</footer>',//------------------------------------End Footer-----------
            '</section>',
            {
                logoContain: function (logo) {
                    return (logo != "") ? true : false;
                }
            }
        );

        return tpl;
    },
    showSupport: function () {
        if (this.about || this.support) {
            return;
        }
        //variables que se utilizada por  UCID.gestornc.GestorreportesView
        majorVersion = 4.2;

        //agregando estilos para el fielupload
        if (!document.getElementById('style-fileUploadArchivo')) {
            //agregando los estilos del componente
            var styleLeaf = document.createElement('style');
            styleLeaf.id = 'style-fileUploadArchivo';

            styleLeaf.innerHTML = "#fileUploadArchivo-inputEl{height:22px !important}";

            document.body.appendChild(styleLeaf);
        }
        var support = new UCID.gestornc.GestorreportesView();
        //console.log(support);
        support.action = 'support';
        support.show();
    }
});
