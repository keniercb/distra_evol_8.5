/*
 * Fichero de configuración general del MT
 * @author Grupo de desarrollo del MT
 * @copyright XETID Cuba
 * @version 2.2.0
 */
var majorVersion;
if (Ext.version != undefined) {
    majorVersion = Ext.version.substring(0, Ext.version.indexOf("."));
} else {
    majorVersion = Ext.getVersion().getMajor();
    minorVersion = Ext.getVersion().getMinor();
}


var UCID = new Object();
var winError, winConfirmDetalles;
var acciones_reportes = [];
var perfil = null;
if (window.parent.UCID.portal)
    perfil = window.parent.UCID.portal.perfil;
else
    perfil = {};
UCID.portal = new Object();

/*
 * Utilidades para el manejo de la iconografia con svg
 * */
UCID.fontClass = {};
UCID.fontClass.rules = {};
UCID.fontClass.getRules = function (stylesheet) {
    var rules = stylesheet.cssRules || stylesheet.rules;
    for (var i = 0; i < rules.length; i++) {
        if (rules[i].type != 3) {
            if (rules[i].cssText.indexOf("font-family") !== -1)
                UCID.fontClass.rules[rules[i].selectorText] = rules[i];
        } else if (rules[i].styleSheet) {
            UCID.fontClass.getRules(rules[i].styleSheet);
        }
    }
};
UCID.fontClass.cacheFontsClass = function () {
    var docSty = document.styleSheets;
    for (var i = 0; i < docSty.length; i++) {
        var id;
        if (docSty[i].href) {
            var href = docSty[i].href;
            href = href.split("/");
            href = href[href.length - 1];
        }
        if (!href || href != 'ext-all.css')
            UCID.fontClass.getRules(docSty[i]);
    }
};
UCID.fontClass.prefixIsFont = function (prefix) {
    var className = "";
    for (var i = 0; i < prefix.length; i++) {
        className += prefix[i] + '-';
        var a = '[class^="' + className + '"]', b = '[class*=" ' + className + '"]',
            c = '[class^="' + className + '"], [class*=" ' + className + '"]';
        var d = '[class^="' + className + '"]::before', e = '[class*=" ' + className + '"]::before',
            f = '[class^="' + className + '"]::before, [class*=" ' + className + '"]::before';
        if (UCID.fontClass.rules[a] || UCID.fontClass.rules[b] || UCID.fontClass.rules[c] ||
            UCID.fontClass.rules[d] || UCID.fontClass.rules[e] || UCID.fontClass.rules[f]
        ) {
            return true;
        } else {
            return false;
        }
    }

};
window.addEventListener('load', function () {
    UCID.fontClass.cacheFontsClass();
}, false);

var ayuda = new function () {
    activateHelp = false;
    return {
        show: function (version, referencia, accion, flag) {

            var url = referencia;
            actionhelpview = accion;
            var showFlag = (typeof(flag) == 'undefined') ? false : flag;


            Ext.Ajax.request({
                url: '/portal/index.php/portal/getayuda',
                params: {
                    uri: referencia
                },
                success: function (res) {

                    __this = this;
                    this.showMeMyHelp = true;

                    function createWinHelp() {
                        var desk2 = window.parent.MyDesktop.getDesktop();
                        var _exist = desk2.getWindow('id_' + referencia);

                        var active = desk2.getManager().getActive();
                        if (!showFlag)
                            active.appHi = true;
                        if (!_exist) {
                            __this.winIframe2 = desk2.createWindow({
                                id: 'id_' + referencia,
                                title: 'Ayuda del sistema',
                                //config:node,
                                layout: 'fit',
                                width: 800,
                                maximized: true,
                                height: 490,
                                minWidth: 800,
                                minHeight: 480,
                                iconCls: 'ayuda',
                                shim: false,
                                animCollapse: false,
                                showFlag: showFlag,
                                //closeAction : 'hide',
                                items: [{
                                    xtype: 'panel',
                                    border: false,
                                    html: '<iframe id=iframeHelp' +
                                    ' style="border: none;" src= "' + url + '" width="100%" height="100%" seamless>' +
                                    '</iframe>',
                                    layout: 'fit'

                                }],
                                constrainHeader: true

                            });
                            /**necessary**/

                            if (!showFlag) {
                                //desk2.taskbar.showTaskButton
                                Ext.MessageBox.show({
                                    title: 'Espere por favor',
                                    msg: 'Cargando datos...',
                                    width: 300,
                                    progress: true,
                                    closable: false,
                                    animEl: 'mb6'
                                });

                                // this hideous block creates the bogus progress
                                var f = function (v) {
                                    return function () {
                                        if (v == 10) {
                                            Ext.MessageBox.hide();
                                            __this.winIframe2.show();
                                        } else {
                                            var i = v / 9;
                                            Ext.MessageBox.updateProgress(i, Math.round(100 * i) + '% completado');
                                        }
                                    };
                                };
                                for (var i = 1; i < 13; i++) {
                                    setTimeout(f(i), i * 250);
                                }
                            }

                        } else {
                            if (!showFlag) {
                                desk2.taskbar.tbPanel.hidenBtns.forEach(function (a, b) {
                                    if (_exist.id == a.id) {
                                        desk2.taskbar.tbPanel.showButton(_exist);
                                    }
                                });

                                _exist.show();
                            }
                        }

                    }

                    var response = Ext.JSON.decode(res.responseText);
                    url = "/" + response.dir;
                    createWinHelp();

                }
            });

        }
    }

};
var acercaDe = new function () {
    Ext.QuickTips.init();
    activateAcercade = false;
    return {
        show: function (uri, version) {
            Ext.Ajax.request({
                url: '/portal/index.php/portal/getacercade',
                params: {
                    uri: uri
                },
                success: function (res) {

                    this.valor = Ext.JSON.decode(res.responseText);
                    if (this.valor.code != 6) {
                        this.win = Ext.create('Ext.window.Window', {

                            layout: 'absolute',
                            border: false,
                            y: 10,
                            bodyStyle: 'background-color:white;',
                            closable: true,
                            maximizable: true,
                            width: 500,
                            id: 'acercade_sistemav4',
                            height: 450,
                            closeAction: 'destroy',
                            modal: true,
                            style: 'z-index:50000;',
                            constrain: true,
                            listeners: {
                                hide: function (cmp) {
                                    activateAcercade = false;
                                },
                                show: function (cmp) {
                                    activateAcercade = true;
                                },
                                destroy: function () {
                                    activateAcercade = false;
                                }
                            }
                            //autoHeight: true
                            // shadow : false
                        }).show();

                    }
                    else {
                        mostrarMensaje(6, 'No existe la información del sistema.');
                    }


                    /**
                     * Parámetros que tienen que estar declarados en cada subsistemas para mostrar el acerca de
                     * @nombre    nombre de la app
                     * @version   versión de la app
                     * @fecha   fecha de liberación del producto
                     * @autor   grupo de desarrollo de la app
                     * @dependencia   arreglo de los componentes que depende ['component 1','component 2']
                     *
                     */
                    if (this.win) {
                        var tpl = new Ext.XTemplate(
                            '<style>',
                            'p#logo { text-align: center; padding : 10 0 0 0px; }',
                            '.acercade{    font-size: 1.1em;} ',
                            '.txtprincipal{',
                            ' text-align: center;',
                            'font: bold 2.3em "Droid Sans",arial,sans-serif;',
                            'color: rgb(0, 155, 194);',
                            'text-shadow: 1px 1px 2px rgba(185, 185, 185, 0.84);',
                            '',
                            '}',

                            '</style>',
                            '<section id="infoApp">',
                            '<div style="border-bottom: solid 1px #eeeeee; box-shadow: 1px 1px 4px rgba(198, 198, 198, 0.44); text-align: center; padding-bottom: 10px; ">',
                            '<p id="logo">',
                            '<tpl if="this.logoContain(logo)">',
                            ' <img  src="/{logo}">',
                            '</tpl>',
                            '<tpl if="this.logoContain(logo) == false">',
                            ' <img src="/portal/views/images/index/logo-zeolides.png">',
                            '</tpl>',
                            '</p>',
                            '<h1 style="font-size:  2.3em;" class="txtPrincipal">{nombre} </h1>',//---------------Nombre-------------------
                            '<h5 style="font-size:  1.2em;color: rgb(0, 155, 194);" class="">Versión: {version} </h5>',//------------Versión-----------------
                            '<h3 style="font-size:  1em; color: rgb(0, 155, 194);" class="">Fecha: {fecha}</h3>',//------------------Fecha------------------
                            '</div>',

                            '<div class = "acercade" style="margin-bottom:20px;max-height:200px;overflow:auto; padding: 10px 5px 5px 5px;text-align: center; background-color: rgba(240, 240, 240, 0.18)">',//-------------Container----------------
                            '<h3 style="font-size:  1.2em;"><b>Descripción:</b></h3>',//------------------Desarrollado------------ -----
                            '<label >{descripcion}</label>',//------------------Desarrollado------------ -----
                            '<h3 style="font-size:  1.2em;"><b>Compuesto por:</b></h3>',//------------------Dependencias------------
                            '<ul>',
                            '<tpl for="dependencia">',
                            '<li style="list-style: none;">{.}</li>',
                            '</tpl>',
                            '</ul>',//-----------------------------------End Dependencias -----------
                            '<h3 style="font-size:  1.2em;"><b>Desarrollado por:</b></h3>',//------------------Desarrollado------------ -----
                            '<label >{autor}</label>',//------------------Desarrollado------------ -----
                            '<h3 style="font-size:  1.2em;"><b>Equipo de desarrollo:</b></h3>',//------------------Equipo de desarrollo------------ -----
                            '<ul>',
                            '<tpl for="equipo">',
                            '<li style="list-style: none;">{.}</li>',
                            '</tpl>',
                            '</ul>', //------------------ End Equipo de desarrollo------------ -----
                            '</div>',//------------------------------------End Container-----------
                            '<footer style=" bottom:0; position:absolute;width: 100%; height:5%;text-align: center;background-color:rgb(0, 155, 194);color: white ">',//------------------------------------Footer-----------
                            '<h5>2011-2015 © Copyright XETID </h5>',//------------------------------------Footer-----------
                            '</footer>',//------------------------------------End Footer-----------
                            '</section>',
                            {
                                logoContain: function (logo) {
                                    return (logo != "") ? true : false;
                                }
                            }
                        );
                        this.win.setTitle('Acerca de ' + this.valor.nombre);
                        this.win.show();
                        tpl.overwrite(this.win.body, this.valor);
                    }
                }
            });
        }
    }
};

function importarCSS(dirCSS) {
    var css_style = document.createElement("link");
    css_style.setAttribute("rel", "stylesheet");
    css_style.setAttribute("type", "text/css");
    css_style.setAttribute("href", dirCSS);
    document.getElementsByTagName("head")[0].appendChild(css_style);
}

function importarJS(dirJS) {
    var js_file = document.createElement("script");
    js_file.setAttribute("type", "text/javascript");
    js_file.setAttribute("src", dirJS);
    document.getElementsByTagName("head")[0].appendChild(js_file);
}

/*
 Incorporar automáticamente las acciones de la ayuda e información de los sistemas
 @autores: Ing: Ernesto Martinez y Ing. Juan Luis R.guez
 @fecha de modificación : 16/Dic/2014
 */

if (Ext) {
    Ext.BLANK_IMAGE_URL = '/lib/ExtJS/temas/default/images/s.gif';

    //if (window.parent.UCID.portal.dir_ext_css) {
    //    var dir_icon_class = window.parent.UCID.portal.dir_ext_css + 'css/icon-clases.css';
    //    var existLink = false;
    //    var linkArr = document.getElementsByTagName("link");
    //    var port = '';
    //    if (window.location.port)
    //        port = ':' + window.location.port;
    //    var dirHostIconCSS = window.location.protocol + '//' + window.location.host + port + dir_icon_class;
    //    var dirHostnameIconCSS = window.location.protocol + '//' + window.location.hostname + port + dir_icon_class;
    //    for (var i = 0; i < linkArr.length; i++) {
    //        if (linkArr[i].href == dirHostIconCSS || linkArr[i].href == dirHostnameIconCSS) {
    //            existLink = true;
    //            break;
    //        }
    //    }
    //    if (!existLink)
    //        importarCSS(dir_icon_class);
    //}

    if (!(new Ext.form.FileUploadField)) {
        importarCSS("/lib/UCID/css/utiles/plugins/file-upload.css");
        importarJS("/lib/UCID/js/FileUploadField.js");
    }
    importarJS("/lib/ExtJS/idioma/es/js/ext-lang-es.js");
    //importarCSS(document.location.origin+"/lib/ExtJS/temas/default/css/icon-clases.css");
    //importarCSS(document.location.origin+"/lib/ExtJS/temas/default/css/zeolides.css");
    //importarCSS(document.location.origin + "/lib/ExtJS/temas/default/css/icon-font.css");
    importarCSS("/lib/ExtJS/temas/default/css/fonts4.0.7.css");
    importarJS("/lib/UCID/js/utiles/adicionarForm/WinAddInci.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/treeCombo.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/vistaTreePanel.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/vistatreepanelViewModel.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/GestorreportesView.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/GestorreportesViewModel.js");



    function focusElement(idElement, focusIn) {
        var el = Ext.getCmp(idElement);
        if (!el.isDisabled()) {
            el.focus(200);
        } else if (focusIn == 'next' && el.nextTab) {
            focusElement(el.nextTab, 'next');
        } else if (focusIn == 'prev' && el.prevTab) {
            focusElement(el.prevTab, 'prev');
        }
    }

    function addTabKeyMap() {

        if (this.prevTab) {
            new Ext.KeyMap(this.getEl(), {
                key: Ext.EventObject.TAB,
                shift: true,
                fn: function (a, e) {
                    e.preventDefault();
                    focusElement(this.prevTab, 'prev');
                },
                scope: this
            });
        }

        if (this.nextTab) {
            new Ext.KeyMap(this.getEl(), {
                key: Ext.EventObject.TAB,
                shift: false,
                fn: function (a, e) {
                    e.preventDefault();
                    focusElement(this.nextTab, 'next');
                },
                scope: this
            });
        }


    }

    /*END VALID REFERENCE*/

    /*Función para manejar las etiquetas y gestionar la internacionalización del MT*/
    UCID.portal.cargarEtiquetas = function (vistaCU, fn, es) {
        Ext.Ajax.request({
            url: 'cargaretiquetas',
            method: 'POST',
            params: {
                vista: vistaCU,
                es: es
            },
            callback: function (options, success, response) {
                if (success) {
                    var etiquetas = Ext.decode(response.responseText);
                    if (!perfil) {
                        perfil = {};
                    }
                    perfil.etiquetas = etiquetas;
                    var codMsg = perfil.etiquetas.codMsg;
                    if (!codMsg)
                        fn(perfil, etiquetas);
                    else if (codMsg == 4) {
                        UCID.portal.cargarEtiquetas(vistaCU, fn, true);
                    }
                }
            }
        });
    }
    /*END */
    Ext.ns("Zeolides");
    Zeolides.App = function (config) {
        UCID.portal.cargarEtiquetas(config.modulo, renderVista);

        function renderVista(perfil, etiquetas) {
            Zeolides.etiquetas = etiquetas;
            var configLoader = {enabled: true};
            if (config.paths)
                configLoader.paths = config.paths;
            Ext.Loader.setConfig(configLoader);
            Ext.application(config);
        }
    };

    /**
     * Mensajes del MT     *
     * @Autor: TC.Juan Luis R.guez H.dez
     * @Fecha de actualización: 28/Noviembre/2014
     * @Descripción:"Se agregó la opción para cerrar los mensajes antes de su tiempo para ocultarse,
     * se cambió el estilo de alineación para los textos"
     */
    Ext.ns('Zeolides.Utils.NotificationBox');
    Zeolides.Utils.NotificationBox.initStyles = function () {
        var styleLeaf = document.createElement('style');
        styleLeaf.innerHTML = "" +
            ".msg .x-box-mc {font-size: 9px;}" +
            "#msg-error , #msg-div{position: absolute;left: 40%;top: 10px;width: 300px;z-index: 30000;}" +
            "#msg-warning , #msg-div{position: absolute;left: 42%;top: 10px;width: 300px;z-index: 30000;}" +
            'div#imgError{background: url("/lib/UCID/images/error.png") no-repeat left;width: 40px;height: 40px;float: left;margin: -25px 0px 0px -25px;}' +
            'div#imgOk{background: url("/lib/UCID/images/ok.png") no-repeat left;width: 40px;height: 40px;float: left;margin: -25px 5px 0px -25px;}' +
            'div#imgWarning{background: url("/lib/UCID/images/warning-icon.png") no-repeat left;width: 40px;height: 40px;float: left;margin: -25px 5px 0px -25px;}' +
            "#msg-error .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 1px solid #CC3333;margin-top: 10px;padding: 10px 15px;color: #990000;box-shadow: 2px 2px 10px #CC3333;}" +

            "#msg-warning .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 1px solid rgba(255, 224, 26, 0.82);margin-top: 10px;padding: 10px 15px;color: #7F5214;box-shadow: 2px 2px 10px rgba(181, 161, 17, 0.82);}" +
            "#msg-error .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}" +

            "#msg-warning .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}" +
            "#msg-div .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 1px solid #3764A0;margin-top: 10px;padding: 10px 15px;color: #04408c;box-shadow: 2px 2px 10px #3764A0;}" +
            "#msg-div .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}" +
            "#closePopup { background: url('/lib/UCID/images/close.png') no-repeat center;width: 9px;height: 9px;position: absolute;right:6px;top:15px;cursor:pointer;opacity:0.5}" +
            "#closePopup:hover {opacity:1 }" +
            "#msg-div .msg h3,#msg-error .msg h3,#msg-warning .msg h3 {text-align: left !important; }" +
            "#msg-div .msg p,#msg-error .msg p,#msg-warning .msg p  {text-align: justify !important; }"

        ;
        document.body.appendChild(styleLeaf);
    }();

    Zeolides.Utils.NotificationBox.show = function (message) {
        var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
        var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgOk"></div><div onclick="this.parentNode.remove()" id="closePopup"></div><h3>Informaci&oacute;n</h3><p>' + message + '</p></div>', true);
        msg.slideIn('t').pause(6000).ghost("t", {remove: true});

    };

    Zeolides.Utils.NotificationBox.showError = function (message) {
        var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-error'}, true);
        var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgError"></div><div onclick="this.parentNode.remove()" id="closePopup"></div><h3>Error</h3><p>' + message + '</p></div>', true);
        msg.slideIn('t').pause(6000).ghost("t", {remove: true});
    };
    Zeolides.Utils.NotificationBox.showWarning = function (message) {
        var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-warning'}, true);
        var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgWarning"></div><div onclick="this.parentNode.remove()" id="closePopup"></div><h3>Advertencia</h3><p>' + message + '</p></div>', true);
        msg.slideIn('t').pause(6000).ghost("t", {remove: true});
    };

    mostrarMensaje = function (tipo, msg, fn, detalle) {

        var buttons = new Array(Ext.MessageBox.OK, Ext.MessageBox.OKCANCEL, Ext.MessageBox.OK);
        var title = new Array('Informaci&oacute;n', 'Confirmaci&oacute;n', 'Error', 'Advertencia');
        var icons = new Array(Ext.MessageBox.INFO, Ext.MessageBox.QUESTION, Ext.MessageBox.ERROR);
        switch (tipo) {
            case 4:
                if (!winError) {
                    winError = new Ext.Window({
                        title: ' Error ',
                        modal: true,
                        width: 500,
                        minWidth: 500,
                        buttonAlign: 'center',
                        autoHeight: true,
                        bodyBorder: false,
                        layout: 'fit',
                        defaults: {
                            frame: true,
                            border: false
                        },
                        items: new Ext.Panel({
                            frame: true,
                            monitorResize: true,
                            autoHeight: true,
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: .15,
                                    items: {
                                        style: 'margin:2px 0px 0px 2px;',
                                        html: '<div id="pIconoERROR" class="iconoERROR"></div>'
                                    }
                                },
                                {
                                    columnWidth: .75,
                                    items: {
                                        xtype: 'panel',
                                        autoHeight: true,
                                        html: '<div id="pMSG">' + msg + '</div>'
                                    }
                                },
                                {
                                    columnWidth: 1,
                                    items: new Ext.form.FieldSet({
                                        id: 'ucid.winerror',
                                        autoScroll: true,
                                        layout: 'form',
                                        title: ' Detalles : ',
                                        autoWidth: true,
                                        html: '<div id="pDetalle"><pre>' + detalle + '</pre></div>',
                                        height: 150,
                                        collapsed: true,
                                        collapsible: true
                                    })
                                }
                            ]
                        }),
                        buttons: [
                            {
                                text: 'Aceptar',
                                handler: function () {
                                    winError.hide();
                                    if (typeof (fn) == 'function')
                                        fn();
                                }
                            }
                        ]
                    });
                }
                Ext.getCmp('ucid.winerror').collapse();
                winError.doLayout(true);
                winError.show();
                document.getElementById("pMSG").innerHTML = msg;
                document.getElementById("pDetalle").innerHTML = detalle;
                break;
            case 5:
                if (winConfirmDetalles)
                    winConfirmDetalles.destroy();
                winConfirmDetalles = new Ext.Window({
                    title: ' Confirmaci&oacute;n ',
                    modal: true,
                    width: 400,
                    minWidth: 300,
                    buttonAlign: 'center',
                    autoHeight: true,
                    closeAction: 'hide',
                    bodyBorder: false,
                    layout: 'fit',
                    defaults: {
                        frame: true,
                        border: false
                    },
                    items: new Ext.Panel({
                        frame: true,
                        monitorResize: true,
                        autoHeight: true,
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .2,
                                items: {
                                    style: 'margin:2px 0px 0px 2px;',
                                    html: '<div id="iconoCONFIRM" class="iconoCONFIRM></div>'
                                }
                            },
                            {
                                columnWidth: .7,
                                items: {
                                    xtype: 'panel',
                                    autoHeight: true,
                                    html: '<div id="pMSGcd">' + msg + '</div>'
                                }
                            },
                            {
                                columnWidth: 1,
                                items: new Ext.form.FieldSet({
                                    autoScroll: true,
                                    layout: 'form',
                                    title: ' Detalles : ',
                                    autoWidth: true,
                                    html: '<div id="cDetalle">' + detalle + '</div>',
                                    autoHeight: true,
                                    collapsed: true,
                                    collapsible: true
                                })
                            },
                            {
                                columnWidth: 1,
                                items: {
                                    xtype: 'panel',
                                    autoHeight: true,
                                    html: '<div>Oprima <b>Cancelar</b> para abortar o <b>Aceptar</b> para proseguir con la operaci&oacute;n</div>'
                                }
                            }
                        ]
                    }),
                    buttons: [
                        {
                            text: 'Cancelar',
                            handler: function () {
                                winConfirmDetalles.hide();
                            }
                        },
                        {
                            text: 'Aceptar',
                            handler: function () {
                                winConfirmDetalles.hide();
                                if (typeof (fn) == 'function')
                                    fn();
                            }
                        }
                    ]
                });
                winConfirmDetalles.show(Ext.getBody());
                document.getElementById("pMSGcd").innerHTML = msg;
                document.getElementById("cDetalle").innerHTML = detalle;
                break;
            case 3:
                Ext.MessageBox.show({
                    title: title[tipo - 1],
                    msg: msg,
                    buttons: buttons[tipo - 1],
                    icon: icons[tipo - 1],
                    fn: fn
                });
                break;

            case 6:
            case 9:
                Zeolides.Utils.NotificationBox.showError(msg);
                break;
            case 7:
                Zeolides.Utils.NotificationBox.show(msg);
                break;
            case 8:
                Zeolides.Utils.NotificationBox.showWarning(msg);
                break;
            case 2:
                if (fn == null) {
                    var func = function () {
                        ventana.close()
                    };
                }
                else {
                    func = fn;
                }
                var band = 0;
                var idCancel, idAcept;
                idCancel = Ext.id();
                idAcept = Ext.id();

                var btn_cancelar = {
                    type: 'button',
                    id: idCancel,
                    text: 'Cancelar',
                    iconCls: 'cancelar',
                    prevTab: idAcept,
                    handler: function () {
                        Ext.bind(func, this)('NO');
                        acept.destroy();
                        cancel.destroy();
                        ventana.close()

                    },
                    scope: this
                };
                /* var cut = new Ext.KeyMap(Ext.getBody(), {
                 key:Ext.EventObject.ENTER , // or Ext.EventObject.ENTER
                 fn: function(){
                 Ext.bind(func,scope)();
                 msg.close();

                 },
                 scope: this
                 });*/

                var btn_aceptar = {
                    type: 'button',
                    id: idAcept,
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    nextTab: idCancel,
                    handler: function () {
                        Ext.bind(func, this)('YES');
                        acept.destroy();
                        cancel.destroy();
                        ventana.close();

                    },

                    scope: this
                };

                var option = [btn_cancelar, btn_aceptar];
                var icon = Ext.Msg.QUESTION;


                var ventana = new Ext.window.MessageBox({
                    buttons: option,
                    buttonAlign: 'center'

                }).show({
                    title: title[1],
                    msg: msg,
                    scope: this,
                    icon: icon
                });
                var acept = new Ext.util.KeyMap(Ext.getBody(), {
                    key: Ext.EventObject.ENTER, // or Ext.EventObject.ENTER
                    fn: function () {
                        Ext.bind(func, scope)('YES');
                        ventana.close();
                        acept.destroy();
                        cancel.destroy();
                    },
                    scope: this

                });
                var cancel = new Ext.util.KeyMap(Ext.getBody(), {
                    key: Ext.EventObject.X,
                    alt: true,
                    fn: function () {
                        Ext.bind(func, scope)('NO');
                        ventana.close();
                        acept.destroy();
                        cancel.destroy();
                    },
                    scope: this

                });
                break;
            default:
                if (fn !== null && (typeof (fn) == 'function' || typeof (fn) == 'object'))
                    Ext.MessageBox.show({

                        title: title[tipo - 1],
                        msg: msg,
                        buttons: buttons[tipo - 1],
                        icon: icons[tipo - 1],
                        fn: fn
                    });
                else
                    Zeolides.Utils.NotificationBox.show(msg);
        }
    };

    Ext.ns('Zeolides.Utils.MessageBox');
    Zeolides.Utils.MessageBox.show = mostrarMensaje;
    /*END Mensajes del MT*/

    Ext.Ajax.on('requestexception', function (conn, response, options) {
        var answer = Ext.decode(response.responseText);
        if (typeof (answer) == 'object' && typeof (answer.msg) != 'undefined') {
            Ext.Ajax.suspendEvents();
            Ext.Msg.show({
                title: 'Error',
                msg: answer.msg,
                buttons: Ext.MessageBox.OK,
                fn: function () {
                    var wCfg = 'titlebar=yes,status=yes,resizable=no,width=' + screen.width + ',height=' + screen.height;
                    window.open('/portal/index.php/portal/login', '_parent', wCfg);
                },
                icon: Ext.MessageBox.ERROR
            });
        }
    }, this);

    /*tratamiento de mensajes cuando se realiza una petición  */
    Ext.Ajax.on('requestcomplete', function (conn, response, options) {
        var respText = response.responseText;
        if (respText) {
            var respObj = Ext.decode(respText);
            if (respObj.codMsg && respObj.codMsg >= 1 && respObj.codMsg != 2 && respObj.codMsg <= 6) {
                Ext.getBody().unmask();
                mostrarMensaje(respObj.codMsg, respObj.mensaje, null, respObj.detalles);
            }

        }
    });
}
/*
 Función encargada de crear de forma automática el botón de la Ayuda con las sub-acciones de Acerca de.. y soporte
 @autores: Ing.Ernesto Martinez y Ing.Juan Luis R.guez
 @fecha de modificación: 19/Enr/15
 */

/*Validando para Chrome el componente visual de Fecha*/
Ext.picker.Date.override({
    update: Ext.Function.createSequence(Ext.DatePicker.prototype.update, function () {
        var w = 190;
        this.el.setWidth(w + this.el.getBorderWidth("lr"));
        Ext.fly(this.el.dom.firstChild).setWidth(w);
    })
});
Ext.override(Ext.button.Button, {
    initComponent: Ext.Function.createInterceptor(Ext.button.Button.prototype.initComponent, function () {

        //   console.log('JLRH');
        if (this.seguridad) {
            this.hidden = true;
        }
        var _this = this;
        if ((this.id != 'btnAyuGestorInc' ) && (this.text == 'Ayuda' || this.text == 'Help' || this.text == '<b>Ayuda</b>') && (this.iconCls == 'ayuda' || this.iconCls == 'btn' || this.iconCls == 'icon-ayuda')) {
            var iframe = document.body;
            this.hidden = true;

            this.getDatosAyuda = function (flag) {

                var ayudaview = (typeof (window.activateHelp) != 'undefined') ? window.activateHelp : false;
                var acercadeview = (typeof (window.activateAcercade) != 'undefined') ? window.activateAcercade : false;
                var soporteview = (typeof (window.activateSoporte) != 'undefined') ? window.activateSoporte : false;

                if (!ayudaview && !acercadeview && !soporteview) {

                    var referencia = window.location.href.toString().split(window.location.host)[1].split('index.php')[1].split('?')[0];
                    var pathname = window.location.pathname.toString().split('index.php')[0];
                    var pathAcction = window.location.pathname.toString().split('index.php')[1].split('/')[1];
                    if (_this.referencia) {
                        pathname = _this.referencia.toString().split('index.php')[0];
                        pathAcction = _this.referencia.toString().split('index.php')[1].split('/')[1];
                    }
                    var patUri = pathname + pathAcction;
                    var accion = pathAcction + '/' + _this.id;

                    var desk2 = window.parent.MyDesktop.getDesktop().getManager().getActive();
                    desk2.dirHelps.pathHelp = pathname;
                    desk2.dirHelps.pathAction = accion;
                    desk2.dirHelps.pathAcercad = pathname;
                    desk2.referencia = _this.referencia ? _this.referencia : window.location.pathname;

                    ayuda.show('2', desk2.dirHelps.pathHelp, desk2.dirHelps.pathAction, flag);
                }

            };
            // map multiple keys to one action by string
            /*var map = new Ext.util.KeyMap(iframe, [{
                key: Ext.EventObject.F1,
                ctrl: true,
                //shift: true,
                fn: function () {
                    var ayudaview = window.activateHelp;
                    var acercadeview = window.activateAcercade;
                    var soporteview = window.activateSoporte;
                    if (!ayudaview && !acercadeview && !soporteview) {
                        var referencia = window.location.href.toString().split(window.location.host)[1].split('index.php')[1].split('?')[0];
                        var pathname = window.location.pathname.toString().split('index.php')[0];
                        var pathAcction = window.location.pathname.toString().split('index.php')[1].split('/')[1];
                        var patUri = pathname + pathAcction;
                        var accion = pathAcction + '/' + this.id;
                        ayuda.show('4', pathname, accion);
                    }
                },
                scope: iframe
            },
                {
                    key: Ext.EventObject.F2,
                    ctrl: true,
                    //shift: true,
                    fn: function () {
                        var ayudaview = window.activateHelp;
                        var acercadeview = window.activateAcercade;
                        var soporteview = window.activateSoporte;
                        if (!ayudaview && !acercadeview && !soporteview) {
                            acercaDe.show(window.location.pathname.toString().split('index.php')[0], "4");
                        }
                    },
                    scope: iframe
                },
                {
                    key: Ext.EventObject.F3,
                    ctrl: true,
                    //shift: true,
                    fn: function () {
                        var ayudaview = window.activateHelp;
                        var acercadeview = window.activateAcercade;
                        var soporteview = window.activateSoporte;
                        if (!ayudaview && !acercadeview && !soporteview) {
                            //Ext.widget('newInci').show();
                            new UCID.cein.GestorreportesView().show();
                        }
                    },
                    scope: iframe
                }
            ]);
            this.text = 'Ayuda';
            this.tooltip = "Ayuda del sistema";
            if (typeof(this.handler) == 'function') {
                this.handlerHelp = this.handler;
                this.handler = null;
            }

            var menu = new Ext.menu.Menu({
                //id: 'helpMainMenu',
                items: [
                    {
                        handler: function () {
                            if (typeof(this.parentButton.handlerHelp) == 'function') {
                                this.parentButton.handlerHelp();
                            } else {
                                var title = 'Ayuda';

                                var referencia = window.location.href.toString().split(window.location.host)[1].split('index.php')[1].split('?')[0];
                                var pathname = window.location.pathname.toString().split('index.php')[0];
                                var pathAcction = window.location.pathname.toString().split('index.php')[1].split('/')[1];

                                var patUri = pathname + pathAcction;
                                var accion = pathAcction + '/' + this.parentButton.id;
                                ayuda.show('4', pathname, accion);
                            }
                        },
                        parentButton: this,
                        text: "Ayuda",
                        iconCls: 'ayuda',
                        tooltip: "Mostrar ayuda de la funcionalidad <b>(Ctrl+F1)</b>",
                        hotKey: (this.hotKey) ? this.hotKey : null,
                        btnHelpMenu: true
                    }, {
                        text: 'Acerca de',
                        iconCls: 'info',
                        tooltip: "Acerca de <b>(Ctrl+F2)</b>",
                        parentButton: this,
                        handler: function () {
                            acercaDe.show(window.location.pathname.toString().split('index.php')[0], "4");

                        },
                        btnHelpMenu: true,
                        hotKey: {
                            idGrupo: (this.hotKey) ? this.hotKey.idGrupo : null,
                            config: {
                                key: 104,
                                alt: true,
                                ctrl: true
                            }
                        }
                    },
                    {
                        text: 'Soporte',
                        id: 'soporte',
                        //icon: '/lib/UCID/images/soporte.png',
                        iconCls: 'soporte',
                        tooltip: "Soporte del sistema <b>(Ctrl+F3)</b>",
                        handler: function () {
                            /!*PONER  REFERENCIA DEL JS QUE CONTIENE LAS FUNCIONALIDADES DEL GNC*!/
                            //importarJS(document.location.origin+"/portal/views/js/portal/informacion/infoSistema.js");
                            if (!Ext.getCmp('newInci')) {
                                //Ext.widget('newInci').show();
                                //console.log(UCID.cein.GestorreportesView);
                                new UCID.cein.GestorreportesView().show();
                            }
                        }
                    }
                ]
            });*/
            //this.menu = menu;
            this.getDatosAyuda(true);
            var map = new Ext.KeyMap(document.body, [
                {
                    key: Ext.EventObject.F1,
                    ctrl: true,
                    fn: function () {
                        var desk2 = window.parent.MyDesktop.getDesktop().getManager().getActive();
                        ayuda.show('2', desk2.dirHelps.pathHelp, desk2.dirHelps.pathAction);
                    }
                }, {
                    key: Ext.EventObject.F2,
                    ctrl: true,
                    fn: function () {
                        acercaDe.show(window.location.pathname.toString().split('index.php')[0]);
                    }
                }, {
                    key: Ext.EventObject.F3,
                    ctrl: true,
                    fn: function () {
                        new UCID.cein.GestorreportesView().show();
                    }
                }
            ]);
        }

        if (this.iconCls && this.iconCls != 'btn' && this.iconCls != 'start' && !this.icon) {
            var arrcls = this.iconCls.split('-');
            if (arrcls.length == 1) {
                this.iconCls = 'icondistra-' + this.iconCls;
                if (!this.text) {
                    this.cls = 'x-btn-icon';
                } else {
                    this.cls = 'extra x-form-file-btn';
                }
            }
        }

        this.on('focus', function () {
            this.addOnTabKeyMap();
        });
    }),
    addOnTabKeyMap: addTabKeyMap
});

Ext.override(Ext.menu.Item, {
    afterRender: Ext.Function.createInterceptor(Ext.menu.Item.prototype.afterRender, function () {
        var t = this;
        if (this.initialConfig.tooltip) {
            Ext.QuickTips.register({
                target: t.getEl().getAttribute('id'),
                text: t.initialConfig.tooltip,
                trackMouse: false
            });
        }
    })
});

Ext.override(Ext.grid.Panel, {
    viewConfig: {
        loadingText: 'Cargando...'
    }
});

Ext.override(Ext.menu.Item, {
    onRender: Ext.Function.createInterceptor(Ext.menu.Item.prototype.onRender, function () {
        var me = this;
        if (me.parentMenu) {
            if (me.parentMenu.autoDestroy) {
                me.on('afterrender', function () {
                    me.setIconElement(me);
                });
            } else {
                me.parentMenu.on('beforeshow', function () {
                    me.setIconElement(me);
                });
            }
        }

        me.setIconElement = function (item) {
            if (item.iconCls) {
                var flag = false;
                var tempCls = item.iconCls;
                var spl = item.iconCls.split('-');
                var html = null;
                if ((spl.length <= 1 || spl[0] == 'icondistra' || UCID.fontClass.prefixIsFont(spl)) && item.iconCls != 'btn') {
                    if (spl.length <= 1)
                        item.iconCls = 'icondistra-' + item.iconCls;
                    if (tempCls != item.iconCls || ("span").toUpperCase() != item.iconEl.dom.tagName) {
                        var config = {
                            tag: 'span',
                            cls: 'x-menu-item-icon ' + item.iconCls
                        }
                        flag = true;
                    }
                } else {
                    if (tempCls != item.iconCls || ("img").toUpperCase() != item.iconEl.dom.tagName) {
                        var config = {
                            tag: 'img',
                            cls: 'x-menu-item-icon ' + item.iconCls,
                            src: item.icon
                        }
                        flag = true;
                    }
                }
                if (flag)
                    item.iconEl.replaceWith(config);
            }
        }
        /*  if (this.iconCls && this.iconCls != 'btn' && !this.icon) {
              var arrcls = this.iconCls.split('-');
              if (arrcls.length == 1) {
                  this.renderTpl[5] = '<span id="{id}-iconEl" src="{icon}" class="x-menu-item-icon icondistra-{iconCls}" style="font-size: 14px"/></span>';
              }
          }else{
              this.renderTpl[5] = '<img id="{id}-iconEl" src="{icon}" class="x-menu-item-icon {iconCls}" />';
          }*/

    })
});

if (minorVersion == 0) {
    Ext.override(Ext.tree.Column, {
        initComponent: function () {
            var origRenderer = this.renderer || this.defaultRenderer,
                origScope = this.scope || window;

            this.renderer = function (value, metaData, record, rowIdx, colIdx, store, view) {

                var buf = [],
                    format = Ext.String.format,
                    depth = record.getDepth(),
                    treePrefix = Ext.baseCSSPrefix + 'tree-',
                    elbowPrefix = treePrefix + 'elbow-',
                    expanderCls = treePrefix + 'expander',

                    imgText = '<img src="{1}" class="{0}" />',
                    checkboxText = '<input type="button" role="checkbox" class="{0}" {1} />',
                    formattedValue = origRenderer.apply(origScope, arguments),
                    href = record.get('href'),
                    target = record.get('hrefTarget'),
                    cls = record.get('cls');

                var iconPref = '';
                while (record) {
                    if (!record.isRoot() || (record.isRoot() && view.rootVisible)) {
                        if (record.getDepth() === depth) {
                            if (record.get('iconCls'))
                                var spl = record.get('iconCls').split('-');
                            if (record.get('iconCls') && (spl.length <= 1 || spl[0] == 'icondistra' || UCID.fontClass.prefixIsFont(spl))) {
                                if (spl.length <= 1)
                                    iconPref = 'icondistra-' + record.get('iconCls');
                                else
                                    iconPref = record.get('iconCls');

                                buf.unshift(format('<span src="{1}" class="{0}"></span>',
                                    treePrefix + 'icon ' +
                                    treePrefix + 'icon' + (record.get('icon') ? '-inline ' : ' ') +
                                    (iconPref || ''),
                                    record.get('icon') || Ext.BLANK_IMAGE_URL
                                ));

                            } else {
                                buf.unshift(format(imgText,
                                    treePrefix + 'icon ' +
                                    treePrefix + 'icon' + (record.get('icon') ? '-inline ' : (record.isLeaf() ? '-leaf ' : '-parent ')) +
                                    (record.get('iconCls') || ''),
                                    record.get('icon') || Ext.BLANK_IMAGE_URL
                                ));
                            }

                            if (record.get('checked') !== null) {
                                buf.unshift(format(
                                    checkboxText,
                                    (treePrefix + 'checkbox') + (record.get('checked') ? ' ' + treePrefix + 'checkbox-checked' : ''),
                                    record.get('checked') ? 'aria-checked="true"' : ''
                                ));
                                if (record.get('checked')) {
                                    metaData.tdCls += (' ' + treePrefix + 'checked');
                                }
                            }
                            if (record.isLast()) {
                                if (record.isExpandable()) {
                                    buf.unshift(format(imgText, (elbowPrefix + 'end-plus ' + expanderCls), Ext.BLANK_IMAGE_URL));
                                } else {
                                    buf.unshift(format(imgText, (elbowPrefix + 'end'), Ext.BLANK_IMAGE_URL));
                                }

                            } else {
                                if (record.isExpandable()) {
                                    buf.unshift(format(imgText, (elbowPrefix + 'plus ' + expanderCls), Ext.BLANK_IMAGE_URL));
                                } else {
                                    buf.unshift(format(imgText, (treePrefix + 'elbow'), Ext.BLANK_IMAGE_URL));
                                }
                            }
                        } else {
                            if (record.isLast() || record.getDepth() === 0) {
                                buf.unshift(format(imgText, (elbowPrefix + 'empty'), Ext.BLANK_IMAGE_URL));
                            } else if (record.getDepth() !== 0) {
                                buf.unshift(format(imgText, (elbowPrefix + 'line'), Ext.BLANK_IMAGE_URL));
                            }
                        }
                    }
                    record = record.parentNode;
                }
                if (href) {
                    buf.push('<a href="', href, '" target="', target, '">', formattedValue, '</a>');
                } else {
                    buf.push(formattedValue);
                }
                if (cls) {
                    metaData.tdCls += ' ' + cls;
                }
                return buf.join('');
            }, this.callParent(arguments);
        }
    });
}


Ext.override(Ext.PagingToolbar, {
    name: "pagingToolbar",
    initComponent: Ext.Function.createInterceptor(Ext.PagingToolbar.prototype.initComponent, function () {
        var self = this;
        var flag = true;

        if (!this.pageSize)
            this.pageSize = 20;

        this.displayMsg = (this.displayMsg) ? this.displayMsg : 'Mostrando de {0} - {1} de {2}';
        this.emptyMsg = (this.emptyMsg) ? this.emptyMsg : "No hay resultados para mostrar.";

        this.arrSize = [
            {size: 5},
            {size: 10},
            {size: 15},
            {size: 20},
            {size: 30},
            {size: 50},
            {size: 100}
        ];
        Ext.Array.forEach(this.arrSize, function (size) {
            if (size.size == self.pageSize) {
                flag = false;
            }
        });
        if (flag) {
            this.arrSize.push({size: self.pageSize});
        }

        this.stPageSize = Ext.create('Ext.data.Store', {
            model: 'PagingModel',
            fields: [
                {
                    name: 'size'
                }
            ],
            data: this.arrSize,
            sorters: [
                {
                    property: 'size',
                    direction: 'DESC'
                }
            ]
        });
        this.cbPageSize = Ext.create('Ext.form.field.ComboBox', {
            //id: 'cbpagesize',
            tpl: '<tpl for="."><li role ="option" data-qtip="Mostrar <b>{size}</b> filas por p&aacute;gina." class="x-boundlist-item">{size}</li></tpl>',
            width: 50,
            listWidth: 50,
            store: this.stPageSize,
            displayField: 'size',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            editable: false,
            listeners: {
                select: function (cb, rc, index) {
                    self.setPageSize(rc[0].data.size);
                },
                specialkey: function (t, e) {
                    if (e.getKey() == e.ENTER)
                        self.setPageSize(t.rawValue);
                }
            }
        });
        this.items = ['-', this.cbPageSize];
        //Establesco el valor por defecto definido por el usuario
        this.cbPageSize.setValue(self.pageSize);
    }),
    refreshAllwaysEnabled: false,
    setPageSize: function (value) {

        this.pageSize = value;

        if (this.store.storeId != "ext-empty-store") {
            this.store.load({
                start: 0,
                limit: value
            });
            this.store.pageSize = value;
            this.moveFirst();
        }
    },
    updateInfo: function () {
        var me = this,
            displayItem = me.child('#displayItem'),
            store = me.store,
            pageData = me.getPageData(),
            count, msg;

        if (displayItem) {
            count = store.getCount();
            if (count === 0) {
                msg = me.emptyMsg;
                me.child('#next').disable();
                me.child('#last').disable();
                me.child('#inputItem').disable();
                me.child('#refresh').setDisabled(!me.refreshAllwaysEnabled);
            } else {
                msg = Ext.String.format(
                    me.displayMsg,
                    pageData.fromRecord,
                    pageData.toRecord,
                    pageData.total
                );
                me.child('#inputItem').enable();
            }
            displayItem.setText(msg);
            me.doComponentLayout();
        }
    },
    onLoad: function () {
        var me = this,
            pageData,
            currPage,
            pageCount,
            afterText;

        if (!me.rendered) {
            return;
        }

        pageData = me.getPageData();
        currPage = pageData.currentPage;
        pageCount = pageData.pageCount;
        afterText = Ext.String.format(me.afterPageText, isNaN(pageCount) || pageCount == 0 ? 1 : pageCount);

        me.child('#afterTextItem').setText(afterText);
        me.child('#inputItem').setValue(currPage);
        me.child('#first').setDisabled(currPage === 1);
        me.child('#prev').setDisabled(currPage === 1);
        me.child('#next').setDisabled(currPage === pageCount);
        me.child('#last').setDisabled(currPage === pageCount);
        me.child('#refresh').enable();
        me.updateInfo();
        me.fireEvent('change', me, pageData);
    }
});

Ext.override(Ext.Component, {
    initComponent: Ext.Function.createInterceptor(Ext.Component.prototype.initComponent, function () {
        this.on('render', function () {
            this.addOnTabKeyMap();
        });
        _this = this;

    }),

    addOnTabKeyMap: addTabKeyMap
});

Ext.data.proxy.Ajax.override({
    actionMethods: {
        create: 'POST',
        read: 'POST',
        update: 'POST',
        destroy: 'POST'
    }
});

Ext.override(Ext.toolbar.Paging, {
    getPagingItems: function () {
        var me = this;
        return [{
            itemId: 'first',
            tooltip: me.firstText,
            overflowText: me.firstText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
            disabled: true,
            handler: me.moveFirst,
            scope: me
        }, {
            itemId: 'prev',
            tooltip: me.prevText,
            overflowText: me.prevText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
            disabled: true,
            handler: me.movePrevious,
            scope: me
        },
            '-',
            me.beforePageText,
            {
                xtype: 'numberfield',
                itemId: 'inputItem',
                name: 'inputItem',
                cls: Ext.baseCSSPrefix + 'tbar-page-number',
                allowDecimals: false,
                minValue: 1,
                hideTrigger: true,
                enableKeyEvents: true,
                keyNavEnabled: false,
                selectOnFocus: true,
                submitValue: false,
                // mark it as not a field so the form will not catch it when getting fields
                isFormField: false,
                width: me.inputItemWidth,
                margins: '-1 2 3 2',
                listeners: {
                    scope: me,
                    keydown: me.onPagingKeyDown,
                    blur: me.onPagingBlur
                }
            }, {
                xtype: 'tbtext',
                itemId: 'afterTextItem',
                text: Ext.String.format(me.afterPageText, 1)
            },
            '-',
            {
                itemId: 'next',
                tooltip: me.nextText,
                overflowText: me.nextText,
                iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
                disabled: true,
                handler: me.moveNext,
                scope: me
            }, {
                itemId: 'last',
                tooltip: me.lastText,
                overflowText: me.lastText,
                iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
                disabled: true,
                handler: me.moveLast,
                scope: me
            },
            '-',
            {
                itemId: 'refresh',
                tooltip: me.refreshText,
                overflowText: me.refreshText,
                iconCls: 'actualizar',
                handler: me.doRefresh,
                scope: me
            }];
    }
});

/**
 * Override a los botones para que muestren el tooltip al estar deshabilitados
 * en versiones inferiores de firefox
 */
Ext.override(Ext.button.Button, {
    initComponent: Ext.Function.createInterceptor(Ext.button.Button.prototype.initComponent, function () {
        this.bindListener();
    }),
    bindListener: function () {
        this.addListener('render', function () {
            var _this = this;
            if (Ext.firefoxVersion < 44) {
                if (this.tooltip != undefined) {
                    var tip = Ext.create('Ext.tip.ToolTip', {
                        target: _this.id,
                        html: _this.tooltip,
                        hideDelay: 50,
                        trackMouse: false
                    });
                    this.tooltip = null;
                }
            }
        })
    }
});