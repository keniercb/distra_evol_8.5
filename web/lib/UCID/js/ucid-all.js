/*
 * Fichero de configuración general del MT
 * @author Grupo de desarrollo del MT
 * @copyright XETID Cuba
 * @version 2.0.2
 */
navigator.sayswho = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return "IE " + (tem[1] || "");
    }

    if (M[1] === "Chrome") {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null)
            return tem.slice(1).join(" ").replace("OPR", "OPERA");
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = ua.match(/version\/(\d+)/i)) != null)
        M.splice(1, 1, tem[1]);

    return M;
})();

var majorVersion;
if (Ext.version != undefined) {
    majorVersion = Ext.version.substring(0, Ext.version.indexOf("."));
} else {
    majorVersion = Ext.getVersion().getMajor();
}

if (majorVersion == 3) {
    var css_style = document.createElement("style");
    css_style.textContent = ".x-btn-text{padding-bottom: 19px !important;}";
    document.getElementsByTagName("head")[0].appendChild(css_style);
}

/**
 * Activando la validacion automatica de los formularios. Cuando el formulario es valido
 * activa los botones de la ventana que contiene el formulario, sino los desactiva.
 *
 * Autores: Cap.Yoandry Morejón Borbón y TC.Juan Luis R.guez H.dez
 * Ultima fecha de actualización: 16/MAYO/2015 * Se agregó la validación automatica de forma opcional
 */


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


Ext.override(Ext.Window, {
    registerValidForm: [],// Aqui se inicializa en cada ventana un atributo de tipo arreglo para controlar el estado de la validación de los formularios
    initComponent: Ext.Window.prototype.initComponent.createInterceptor(function () {
        this.on('show', function () {
            this.registerValidForm = []; // Atributo para guardar los formularios validos registrados.
            this.isFormMod = true; // Atributo para controlar si es una ventana de Modificar o no.
            this.valuesFormDefault = ''; // Atributo para controlar si es una ventana de Modificar o no.
            //this.autoValidate= false; /* Esto no se puede hacer porque todas las ventanas viejas que se validan con este metodo
            // y no tienen la propiedad escrita quedarian sin validar*/
            var btn;
            if (this.title) {
                var titleWin = this.title;
            } else {
                var titleWin = 'mywin';
            }
            titleWin = titleWin.toLowerCase().split(' ')[0];
            for (btn in this.buttons) {
                if ((this.buttons[btn].iconCls == 'aplicar'
                        || this.buttons[btn].text == 'Aplicar') && this.buttons[btn].isVisible() && titleWin != 'modificar') {
                    this.isFormMod = false;
                }

            }
        });
    })
});

Ext.override(Ext.FormPanel, {
    validateDefault: false, //Variable para validar que los valores iniciales sean diferentes a los actuales(Para las ventanas modificar).
    monitorValid: true,
    initComponent: Ext.FormPanel.prototype.initComponent.createInterceptor(function () {
        this.defaultValues = null;
        this.findParentWindow = function (component) {
            var parent = component.getEl().parent();
            while (parent != null) {
                if (Ext.getCmp(parent.id) != null) {
                    if (Ext.getCmp(parent.id).baseCls == 'x-window') {
                        break;
                    }
                }
                parent = parent.parent();
            }
            return (parent != null) ? Ext.getCmp(parent.id) : null;
        };

        this.on('clientvalidation', function (form, valid) {
            this.windowParent = this.findParentWindow(this);
            if (this.windowParent != null && this.windowParent.autoValidate !== false) {
                if (typeof(this.windowParent) == 'object' && typeof(this.windowParent.buttons) == 'object') {
                    var otherFormValid = true;
                    var i;
                    form.existForm = false;
                    if (this.windowParent.registerValidForm.length > 0) {
                        var length = this.windowParent.registerValidForm.length;
                        for (i = 0; i < length; i++) {
                            if (this.windowParent.registerValidForm[i].id == this.id) {
                                this.windowParent.registerValidForm[i].valid = valid;
                                form.existForm = true;
                            } else {
                                otherFormValid = otherFormValid && this.windowParent.registerValidForm[i].valid;
                            }
                        }
                    }
                    if (form.existForm == false) {
                        //*** Aqui entra solo una vez por cada ocasión q se muestra una ventana
                        this.windowParent.registerValidForm.push({id: this.id, valid: valid});// se agregan los formularios a la ventana
                        form.defaultValues = this.getForm().getValues(true);// se inicializa la variable del formulario con los valores default del formulario para comparar
                    }
                    //*** Aqui se hace la validación para activar o desactivar los botones
                    var key;
                    for (key in this.windowParent.buttons) {
                        if ((this.windowParent.buttons[key].iconCls == 'aplicar' || this.windowParent.buttons[key].iconCls == 'aceptar'
                                || this.windowParent.buttons[key].iconCls == 'icondistra-aplicar' || this.windowParent.buttons[key].iconCls == 'icondistra-aceptar'
                                || this.windowParent.buttons[key].text == 'Aceptar' || this.windowParent.buttons[key].text == 'Aplicar')
                        ) {
                            if (this.windowParent.validateDefault == true) {
                                this.windowParent.buttons[key].setDisabled(
                                    !(valid && otherFormValid && form.getForm().getValues(true) != form.defaultValues)
                                );
                            } else {
                                this.windowParent.buttons[key].setDisabled(!(valid && otherFormValid));
                            }

                        }
                    }
                }
            }
        });
    })
});

// ********************************    END VALID FORM   *********************************************
/**
 * FIN del método de validación
 */

/*Validando para Chrome el componente visual de Fecha*/
Ext.DatePicker.override({
    update: Ext.DatePicker.prototype.update.createSequence(function () {
        this.on({
            'render': function () {
                var w = 190;
                this.el.setWidth(w + this.el.getBorderWidth("lr"));
                Ext.fly(this.el.dom.firstChild).setWidth(w);
            }
        })
    })
});


if (development == false && typeof (console) == "object" && console.info.toString().indexOf('[native code]').toString() == '-1') {
    alert('FIREBUG INSTALADO.\nPara acceder al sistema debe desinstalarlo.');
    window.location = 'about:blank';
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
    var rules = {};//stylesheet.cssRules || stylesheet.rules;
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


/*
 Incorporar automáticamente las acciones de la ayuda e información de los sistemas
 @autores: Ing: Ernesto Martinez y Ing. Juan Luis R.guez
 @fecha de modificación : 16/Dic/2014
 */
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

                        // var active = desk2.getManager().getActive(); //lo comente porque no se pa que se utiliza y no sale la ayuda del portal

                        if (!showFlag)
                            // active.appHi = true;//lo comente porque no se pa que se utiliza y no sale la ayuda del portal
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

                    var response = Ext.util.JSON.decode(res.responseText);
                    url = "/" + response.dir;
                    createWinHelp();


                }
            });
        },
        setDirHelp: function(a, b) {
            var active = window.parent.MyDesktop.getDesktop().getManager().getActive();
            active.dirHelps.pathHelp = a;
            active.dirHelps.pathAction = b;
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
                    var config = {
                        layout: 'absolute',
                        closable: true,
                        maximizable: false,
                        modal: true,
                        width: 500,
                        height : 500,
                        id: 'acercade_sistema',
                        closeAction: 'destroy',
                        bodyStyle: 'background-color:white;',
                        autoHeight: true,
                        y: '10%',
                        shadow: false,
                        renderTo: uri == 'portal' ? 'x-desktop' : '',
                        constrainHeader: true,
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
                    };

                    this.valor = Ext.util.JSON.decode(res.responseText);
                    if (this.valor.code != 6) {
                            if(typeof(Ext.getCmp('acercade_sistema')) == "undefined")
                        this.win = new Ext.Window(config);
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
                            '</ul>',//------------------Equipo de desarrollo------------ -----
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
    importarJS("/lib/ExtJS/idioma/es/js/ext-lang-es.js");
    importarCSS("/lib/UCID/css/utiles/plugins/file-upload.css");
    //importarCSS(document.location.origin+"/lib/ExtJS/temas/default/css/zeolides.css");
    //importarCSS(document.location.origin + "/lib/ExtJS/temas/default/css/icon-font.css");
    //importarJS(document.location.origin+"/portal/views/js/portal/informacion/infoSistema.js");
    //importarJS(document.location.origin+"/herramientas/cein/plugins/treeCombo.js");
    //importarJS(document.location.origin+"/herramientas/cein/models/FuncionalStore.js");
    importarJS("/lib/UCID/js/App.js");
    importarJS("/lib/UCID/js/FileUploadField.js");
    //importarJS(document.location.origin+"/herramientas/cein/views/js/GestorreportesView.js");
    //importarJS(document.location.origin+"/herramientas/cein/viewModel/GestorreportesViewModel.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/WinAddInci.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/treeCombo.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/vistaTreePanel.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/vistatreepanelViewModel.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/GestorreportesView.js");
    importarJS("/lib/UCID/js/utiles/adicionarForm/GestorreportesViewModel.js");
    // console.log(importarJS("/lib/ExtJS/idioma/es/js/ext-lang-es.js"));
    /*END VALID REFERENCE*/

    /*tratamiento de mensajes cuando se realiza una petición  */
    Ext.Ajax.on('requestcomplete', function (conn, response, options) {
        var respText = response.responseText;
        var respXML = response.responseXML;
        if (respText && !respXML) {
            var respObj = Ext.decode(respText);
            if (respObj.codMsg && (respObj.codMsg == 3 || respObj.codMsg == 4 || respObj.exception == 1)) {
                Ext.getBody().unmask();
                mostrarMensaje(respObj.codMsg, respObj.mensaje, null, respObj.detalles);
            }

        }
    });
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
        msg.slideIn('t').pause(6).ghost("t", {remove: true});

    };

    Zeolides.Utils.NotificationBox.showError = function (message) {
        var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-error'}, true);
        var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgError"></div><div onclick="this.parentNode.remove()" id="closePopup"></div><h3>Error</h3><p>' + message + '</p></div>', true);
        msg.slideIn('t').pause(6).ghost("t", {remove: true});
    };
    Zeolides.Utils.NotificationBox.showWarning = function (message) {
        var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-warning'}, true);
        var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgWarning"></div><div onclick="this.parentNode.remove()" id="closePopup"></div><h3>Advertencia</h3><p>' + message + '</p></div>', true);
        msg.slideIn('t').pause(6).ghost("t", {remove: true});
    };

    mostrarMensaje = function (tipo, msg, fn, detalle) {

        var buttons = new Array(Ext.MessageBox.OK, Ext.MessageBox.OKCANCEL, Ext.MessageBox.OK);
        var title = new Array('Informaci&oacute;n', 'Confirmaci&oacute;n', 'Error');
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

    Ext.ns('UCID.acciones');
    UCID.acciones = {};
    UCID.portal.cargarAcciones = function (idFuncionalidad, fn) {
        Ext.Ajax.request({
            url: 'cargaracciones',
            method: 'POST',
            params: {
                idfuncionalidad: idFuncionalidad
            },
            callback: function (options, success, response) {
                if (success) {
                    UCID.acciones[idFuncionalidad] = {};
                    acciones_reportes = Ext.decode(response.responseText);
                    var codMsg = acciones_reportes.codMsg;
                    if (!codMsg) {
                        for (i in acciones_reportes) {
                            if (i != 'remove' && Ext.getCmp(acciones_reportes[i].abreviatura)) {
                                UCID.acciones[idFuncionalidad][acciones_reportes[i].abreviatura] = true;
                                if (Ext.getCmp(acciones_reportes[i].abreviatura).getXType() == 'datefield' || Ext.getCmp(acciones_reportes[i].abreviatura).getXType() == 'textfield')
                                    Ext.getCmp(acciones_reportes[i].abreviatura).enable();
                                else
                                    Ext.getCmp(acciones_reportes[i].abreviatura).show();
                            }
                        }
                        if (fn)
                            fn();
                    }
                }
            }
        });
    }

    UCID.portal.getAccionesById = function (idFuncionalidad, identidad, fn) {
        Ext.Ajax.request({
            url: 'cargaraccionesbyid',
            method: 'POST',
            params: {
                idfuncionalidad: idFuncionalidad,
                identidad: identidad

            },
            callback: function (options, success, response) {
                if (success) {
                    UCID.acciones[idFuncionalidad] = {};
                    acciones_reportes = Ext.decode(response.responseText);
                    var codMsg = acciones_reportes.codMsg;
                    if (!codMsg) {
                        for (i in acciones_reportes) {
                            if (i != 'remove' && Ext.getCmp(acciones_reportes[i].abreviatura)) {
                                UCID.acciones[idFuncionalidad][acciones_reportes[i].abreviatura] = true;
                                if (Ext.getCmp(acciones_reportes[i].abreviatura).getXType() == 'datefield' || Ext.getCmp(acciones_reportes[i].abreviatura).getXType() == 'textfield')
                                    Ext.getCmp(acciones_reportes[i].abreviatura).enable();
                                else
                                    Ext.getCmp(acciones_reportes[i].abreviatura).show();
                            }
                        }
                        if (fn)
                            fn();
                    }
                }
            }
        });
    }

    /*------------------------------------------------------------------------*/
    /*-------------Otra variante para el uso de IFRAME-------------------------*/
    UCID.portal.cargarAccionesXUri = function (uri, fn) {
        Ext.Ajax.request({
            url: 'cargarAccionesXUri',
            method: 'POST',
            params: {
                uri: uri
            },
            callback: function (options, success, response) {
                if (success) {
                    acciones_reportes = Ext.decode(response.responseText);
                    var codMsg = acciones_reportes.codMsg;
                    if (!codMsg) {
                        for (i in acciones_reportes) {
                            if (i != 'remove' && Ext.getCmp(acciones_reportes[i].abreviatura)) {
                                if (Ext.getCmp(acciones_reportes[i].abreviatura).getXType() == 'datefield' || Ext.getCmp(acciones_reportes[i].abreviatura).getXType() == 'textfield')
                                    Ext.getCmp(acciones_reportes[i].abreviatura).enable();
                                else
                                    Ext.getCmp(acciones_reportes[i].abreviatura).show();
                            }
                        }
                        if (fn)
                            fn();
                    }
                }
            }
        });
    }

    UCID.portal.getAccionesReportes = function () {
        return acciones_reportes;
    }
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
}


/*
 Función encargada de crear de forma automática el botón de la Ayuda con las sub-acciones de Acerca de.. y soporte
 @autores: Ing.Ernesto Martinez y Ing.Juan Luis R.guez
 @fecha de modificación: 6/Mayo/14
 @Descripción: Se agregaron las teclas calientes a las acciones de Ayuda,Acerca de, y soporte.
 */

Ext.override(Ext.Button, {
    render: Ext.Button.prototype.render.createInterceptor(function () {
        if (this.seguridad) {
            this.hidden = true;
        }
        var _this = this;

        if ((this.text == 'Ayuda' || this.text == 'Help'|| this.text =='<b>Ayuda</b>') && (this.iconCls == 'ayuda' || this.iconCls == 'btn' || this.iconCls == 'icon-ayuda')) {
            //this.iconCls = 'icondistra-ayuda';
            //this.icon = '';
            this.hidden = true;
            var iframe = document.body;
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

                    ayuda.show('2', desk2.dirHelps.pathHelp,  desk2.dirHelps.pathAction , flag);
            }

        };

            // map multiple keys to one action by string
            /*var map = new Ext.KeyMap(iframe, [{
                key: Ext.EventObject.F1,
                ctrl: true,
                //shift: true,
                fn: function () {
                    _this.getDatosAyuda(false);
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
                            acercaDe.show(window.location.pathname.toString().split('index.php')[0]);
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

                                var referencia = window.location.href.toString().split(window.location.host)[1].split('index.php')[1].split('?')[0];
                                var pathname = window.location.pathname.toString().split('index.php')[0];
                                var pathAcction = window.location.pathname.toString().split('index.php')[1].split('/')[1];
                                if (this.parentButton.referencia) {
                                    pathname = this.parentButton.referencia.split('index.php')[0];
                                    pathAcction = this.parentButton.referencia.split('index.php')[1].split('/')[1];
                                }
                                var patUri = pathname + pathAcction;
                                var accion = pathAcction + '/' + this.parentButton.id;
                                ayuda.show('2', pathname, accion);
                            }
                        },
                        hideDelay: '10',
                        parentButton: this,
                        text: "Ayuda",
                        iconCls: 'ayuda',
                        tooltip: "Mostrar ayuda de la funcionalidad <b>(Ctrl+F1)</b>",
                        hotKey: (this.hotKey) ? this.hotKey : null,
                        btnHelpMenu: true,
                        menuHhelp: '1'
                    }, {
                        text: 'Acerca de',
                        iconCls: 'info',
                        tooltip: "Acerca de <b>(Ctrl+F2)</b>",
                        parentButton: this,
                        menuHhelp: '2',
                        handler: function () {
                            acercaDe.show(window.location.pathname.toString().split('index.php')[0]);
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
                        //id: 'soporte',
                        iconCls: 'soporte',
                        //icon: '/lib/UCID/images/soporte.png',
                        tooltip: "Soporte del sistema <b>(Ctrl+F3)</b>",
                        menuHhelp: '3',
                        prentButton: this,
                        handler: function () {
                            //!*PONER  REFERENCIA DEL JS QUE CONTIENE LAS FUNCIONALIDADES DEL GNC*!/
                            //importarJS(document.location.origin+"/portal/views/js/portal/informacion/infoSistema.js");
                            new UCID.cein.GestorreportesView().show();
                        }
                    }
                ]
            });
            this.menu = menu;*/
            this.getDatosAyuda(true);
            var map2 = new Ext.KeyMap(document.body, [
                {
                    key: Ext.EventObject.F1,
                    ctrl: true,
                    fn: function(){
                        var desk2 = window.parent.MyDesktop.getDesktop().getManager().getActive();
                        ayuda.show('2', desk2.dirHelps.pathHelp,  desk2.dirHelps.pathAction);
                    }
                }, {
                    key: Ext.EventObject.F2,
                    ctrl: true,
                    fn: function(){
                        acercaDe.show(window.location.pathname.toString().split('index.php')[0]);
                    }
                }, {
                    key: Ext.EventObject.F3,
                    ctrl: true,
                    fn: function(){
                        new UCID.cein.GestorreportesView().show();
                    }
                }
            ]);
        }

        if (this.iconCls && this.iconCls != 'btn' && this.iconCls != 'start' && !this.icon) {
            var arrcls = this.iconCls.split('-');
            if (this.iconCls == 'x-tbar-loading') {
                this.iconCls = 'icondistra-actualizar';
            } else if (arrcls.length == 1) {
                this.iconCls = 'icondistra-' + this.iconCls;
            }

            var v = navigator.sayswho;

            if (!this.text) {
                var fileupload = '';
                if (this.cls) fileupload = (this.cls.indexOf('x-form-file-btn') === -1) ? '' : ' x-form-file-btn';
                this.cls = 'x-btn-icon' + fileupload;
                this.iconCls = 'empty-text ' + this.iconCls;
                if (v[0] == 'Firefox' && parseInt(v[1]) <= 38)
                    this.iconCls = this.iconCls + ' x-btn-center-no-text-old-ff';
            } else {
                this.cls = 'extra';
                if (v[0] == 'Firefox' && parseInt(v[1]) <= 38)
                    this.iconCls = this.iconCls + ' x-btn-center-old-ff';
            }

        }
        if (majorVersion == '3') {
            this.on('afterrender', function (cmp) {
                if (this.iconCls) {
                    cmp.el.child(".x-btn-text").addClass('ext3fix');
                    var oldClass, arrcls = this.iconCls.split('-');

                    if (this.iconCls && this.text)
                        oldClass = 'x-btn-text-icon';
                    else if (this.iconCls)
                        oldClass = 'x-btn-icon';

                    if (UCID.fontClass.prefixIsFont(arrcls)) {
                        cmp.el.replaceClass(oldClass, 'x-btn-noicon');
                    }
                }
            });
        }
    })
});

Ext.override(Ext.menu.Item, {
    afterRender: function (component) {
        var me = this;
        if (this.menuPortal != true) {
            if (me.tooltip) {
                if (majorVersion == '3') {
                    new Ext.ToolTip({
                        target: me.getEl().id,
                        html: me.tooltip,
                        dismissDelay: 1000,
                        getTargetXY: function () {
                            var posXY = me.getEl().getAnchorXY();
                            if (me.menuHhelp) {
                                if (me.menuHhelp == '1') {
                                    return [posXY[0] - 150, posXY[1] + 30];
                                } else if (me.menuHhelp == '2') {
                                    return [posXY[0], posXY[1] + 30];
                                } else if (me.menuHhelp == '3') {
                                    return [posXY[0] - 50, posXY[1] + 30];
                                }
                            }


                        }
                    });
                } else {
                    new Ext.ToolTip({
                        target: me.getEl().id,
                        html: me.tooltip,
                        dismissDelay: 1000
                    });
                }

                Ext.QuickTips.init();
            }
        }

        if (majorVersion == '2') {
            this.parentMenu.on('beforeshow', function () {
                me.setIconElement2(me);
            });
        } else {
            this.parentMenu.on('beforeshow', function () {
                me.setIconElement3(me);
            });
            me.setIconElement3(me);
        }
    },
    setIconElement2: function (item) {
        if (item.iconCls) {
            var iconEl = item.el.child(".x-menu-item-icon");
            var flag = false;
            var tempCls = item.iconCls;
            var spl = item.iconCls.split('-');
            var html = null;
            if ((spl.length <= 1 || spl[0] == 'icondistra' || UCID.fontClass.prefixIsFont(spl)) && item.iconCls != 'btn') {
                if (spl.length <= 1)
                    item.iconCls = 'icondistra-' + item.iconCls;
                if (tempCls != item.iconCls || ("span").toUpperCase() != iconEl.dom.tagName) {
                    var html = String.format('<span class="x-menu-item-icon {1}" />{0}',
                        item.itemText || item.text, item.iconCls || '');
                    flag = true;
                }
            } else {
                if (tempCls != item.iconCls || ("img").toUpperCase() != iconEl.dom.tagName) {
                    var html = String.format('<img src="{0}" class="x-menu-item-icon {2}" />{1}',
                        this.icon || Ext.BLANK_IMAGE_URL, this.itemText || this.text, this.iconCls || '');
                    flag = true;
                }
            }
            if (flag) {
                item.el.update(html);
                item.parentMenu.autoWidth();
            }
        }
    },
    setIconElement3: function (item) {
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
});

Ext.override(Ext.tree.TreeNodeUI, {
    renderElements: function (n, a, targetNode, bulkRender) {
        // add some indent caching, this helps performance when rendering a large tree

        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var cb = typeof a.checked == 'boolean';
        var fonts, flag = false;
        if (a.iconCls)
            var spl = a.iconCls.split('-');
        if (a.iconCls && (spl.length <= 1 || spl[0] == 'icondistra' || UCID.fontClass.prefixIsFont(spl))) {
            if (spl.length <= 1)
                a.iconCls = 'icondistra-' + a.iconCls;
            var icon = '<span class="x-tree-node-icon-font' + (a.icon ? " x-tree-node-inline-icon" : "") +
                (a.iconCls ? " " + a.iconCls : "") + '" unselectable="on" style="vertical-align: -16% !important;"></span>';
        } else {
            var icon = '<img src="' + (a.icon || this.emptyIcon) + '" class="x-tree-node-icon' +
                (a.icon ? " x-tree-node-inline-icon" : "") + (a.iconCls ? " " + a.iconCls : "") + '" unselectable="on" />';
        }
        var style = "visibility: hidden;position: absolute;";
        var href = a.href ? a.href : Ext.isGecko ? "" : "#";
        var buf = ['<li class="x-tree-node"><div ext:tree-node-id="', n.id, '" class="x-tree-node-el x-tree-node-leaf x-unselectable ', a.cls, '" unselectable="on">',
            '<span class="x-tree-node-indent">', this.indentMarkup, "</span>",
            '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
            icon,
            cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
            '<a hidefocus="on" class="x-tree-node-anchor" href="', href, '" tabIndex="1" ',
            a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "", '><span unselectable="on">', n.text, "</span></a></div>",
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>"].join('');


        var nel;
        if (bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())) {
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
        } else {
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        var index = 3;
        if (cb) {
            this.checkbox = cs[index];
            // fix for IE6
            this.checkbox.defaultChecked = this.checkbox.checked;
            index++;
        }
        this.anchor = cs[index];
        this.textNode = cs[index].firstChild;
    }
});


/*
 Función encargada sobreescribir la funcion addBinding de Ext.KeyMap ya que en su version de Ext 2.2
 no tiene en cuenta cuando la configuracion de los modificadores(ctrl,alt,shift) esta en falso no desabilita
 la ejecucion de la accion correspondiente, cuando se presiona la combinacion de teclas correspondiente mas un
 modificador que esta en falso.
 @autores: Ing.Ernesto Martinez Riveron
 @fecha de modificación: 8/Diciembre/2015
 */
Ext.override(Ext.KeyMap, {
    addBinding: function (config) {
        if (Ext.isArray(config)) {
            for (var i = 0, len = config.length; i < len; i++) {
                this.addBinding(config[i]);
            }
            return;
        }
        var keyCode = config.key,
            shift = config.shift ? config.shift : false,
            ctrl = config.ctrl ? config.ctrl : false,
            alt = config.alt ? config.alt : false,
            fn = config.fn || config.handler,
            scope = config.scope;

        if (config.stopEvent) {
            this.stopEvent = config.stopEvent;
        }

        if (typeof keyCode == "string") {
            var ks = [];
            var keyString = keyCode.toUpperCase();
            for (var j = 0, len = keyString.length; j < len; j++) {
                ks.push(keyString.charCodeAt(j));
            }
            keyCode = ks;
        }
        var keyArray = Ext.isArray(keyCode);

        var handler = function (e) {
            if ((shift == e.shiftKey) && (ctrl == e.ctrlKey) && (alt == e.altKey)) {
                var k = e.getKey();
                if (keyArray) {
                    for (var i = 0, len = keyCode.length; i < len; i++) {
                        if (keyCode[i] == k) {
                            if (this.stopEvent) {
                                e.stopEvent();
                            }
                            fn.call(scope || window, k, e);
                            return;
                        }
                    }
                } else {
                    if (k == keyCode) {
                        if (this.stopEvent) {
                            e.stopEvent();
                        }
                        fn.call(scope || window, k, e);
                    }
                }
            }
        };
        this.bindings.push(handler);
    }
});

Ext.override(Ext.grid.GridPanel, {
    initComponent: Ext.grid.GridPanel.prototype.initComponent.createInterceptor(function () {
        this.bindListener();
    }),
    bindListener: function () {
        this.addListener('render', function () {
            if (this.bbar != undefined && this.getBottomToolbar().emptyMsg != undefined) {
                this.width = this.width < 470 || this.width == undefined ? 470 : this.width;
            }
        });
    }
});

Ext.override(Ext.PagingToolbar, {
    name: "pagingToolbar",
    initComponent: Ext.PagingToolbar.prototype.initComponent.createInterceptor(function () {
        var self = this;
        var flag = true;


        this.displayMsg = (this.displayMsg) ? this.displayMsg : 'Mostrando de {0} - {1} de {2}';
        this.emptyMsg = (this.emptyMsg) ? this.emptyMsg : "No hay resultados para mostrar.";

        this.arrSize = [
            [5],
            [10],
            [15],
            [20],
            [30],
            [50],
            [100],
            [500],
            [1000],
            [5000]
        ];
        Ext.each(this.arrSize, function (size) {
            if (size == self.pageSize) {
                flag = false;
            }
        });
        if (flag) {
            this.arrSize.push([self.pageSize]);
        }
        this.stPageSize = new Ext.data.SimpleStore({
            fields: ['size'],
            data: this.arrSize,
            sortInfo: {field: "size", direction: "ASC"}
        });
        this.cbPageSize = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="Mostrar <b>{size}</b> filas por p&aacute;gina." class="x-combo-list-item">{size}</div></tpl>',
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
                    self.setPageSize(rc.get('size'));
                }
            }
        });

        this.items = (typeof(this.items) != "undefined") ? ['-', this.cbPageSize].concat(this.items) : ['-', this.cbPageSize];
        //Establesco el valor por defecto definido por el usuario
        this.cbPageSize.setValue(self.pageSize);
        this.bindRenderListener();
    }),
    setPageSize: function (value) {
        this.pageSize = value;
        this.doLoad(0);
    },

    bindRenderListener: function () {
        this.addListener('render', function (t) {
            if (t.field) {
                t.field.addListener('keydown', function (v) {
                    var key = v.getKey();
                    if (((key < 48 || key > 57) && (key < 96 || key > 105)) && key != 8) {
                        v.stopEvent();
                    }
                });
            }
        });
    }
});

/*
 * En los checkbox al componente que se le hace focus es al div que lo contiene(this.innerWrap)
 * ya que el checkbox real esta oculto y deshabilitado.
 * */
Ext.override(Ext.form.Checkbox, {

    focus: function (selectText, delay) {
        if (delay) {
            this.focus.defer(typeof delay == 'number' ? delay : 10, this, [selectText, false]);
            return;
        }
        if (this.rendered) {
            this.innerWrap.focus(); // changed
            // not needed for checkbox -- if(selectText === true){
            //	this.el.dom.select();
            //}
        }
        return this;
    },
    initCheckEvents: function () {
        //this.innerWrap.removeAllListeners();
        this.innerWrap.addClassOnOver(this.overCls);
        this.innerWrap.addClassOnClick(this.mouseDownCls);
        this.innerWrap.on('click', this.onClick, this);
        this.innerWrap.on('keyup', this.onKeyUp, this);
    }

});

Ext.EventManager.on(window, 'keydown', function (e) {
    if (e.getKey() == Ext.EventObject.TAB) {
        var target = e.getTarget();
        while (target && target.nodeType === 1 && target !== document.body) {
            var cmp = Ext.getCmp(target.id);
            if (cmp && (cmp.text == 'Cancelar' || cmp.text == 'Cancel')) {
                var dialog = Ext.MessageBox.getDialog(),
                    btncancel = dialog.buttons[3],
                    btnacept = dialog.buttons[0];
                if (cmp.id == btncancel.id) {
                    e.preventDefault();
                    btnacept.focus();
                }
                break;
            }
            if (e.shiftKey) {
                if (cmp && (cmp.text == 'Aceptar' || cmp.text == 'Acept')) {
                    var dialog = Ext.MessageBox.getDialog(),
                        btncancel = dialog.buttons[3],
                        btnacept = dialog.buttons[0];
                    if (cmp.id == btnacept.id) {
                        e.preventDefault();
                        btncancel.focus();
                    }
                    break;
                }
            }

            target = target.parentNode;
        }
    }
});

Ext.override(Ext.Component, {
    initComponent: Ext.Component.prototype.initComponent.createInterceptor(function () {
        this.on('render', function () {
            this.addOnTabKeyMap();
        });
        var idComponent = this.id;
        if (this.id && this.id instanceof String)
            idComponent = this.id.split('&');
        if (this.uriAccion) {
            if (UCID.acciones[this.uriAccion][idComponent[0]])
                this.hidden = false;
            else
                this.hidden = true;
        }
    }),
    addOnTabKeyMap: function () {
        if (this.nextTab || this.prevTab) {
            if (this.oldKmap) {
                this.oldKmap.disable();
            }
            var hotKeyConfig = [];
            var that = this;
            if (this.prevTab) {
                hotKeyConfig.push({
                    shift: true,
                    key: 9, //SHIFT + TAB
                    fn: function (e) {
                        that.focusElement(that.prevTab, false);
                    }
                });
            }
            if (this.nextTab) {
                hotKeyConfig.push({
                    key: 9, // TAB
                    shift: false,
                    fn: function () {
                        that.focusElement(that.nextTab, true);
                    }
                });
            }
            if (this.baseCls == "x-form-check" || this.xtype == "checkbox") {
                /*
                 * En los checkbox al componente que se le hace focus es al div que lo contiene(this.innerWrap)
                 * por lo tanto los keyMap se le asignan a ese componente
                 * */
                this.innerWrap.removeAllListeners();
                var kmTab = new Ext.KeyMap(this.innerWrap.id, hotKeyConfig);
            } else {
                var kmTab = new Ext.KeyMap(this.id, hotKeyConfig);
            }

            kmTab.stopEvent = true;
            this.oldKmap = kmTab;
        }
    },
    focusElement: function (idElement, sentido) {
        var comp = Ext.getCmp(idElement);
        while (comp && comp.disabled) {
            var temp = sentido ? comp.nextTab : comp.prevTab;
            comp = Ext.getCmp(temp);
        }
        if (comp) {
            comp.focus(200);
        }
    },
    setTabEl: function (elem) {
        Ext.Tabulador.currentTab = elem.id;
    },
    setPreviousElement: function (elem) {
        this.prevTab = elem;
        this.addOnTabKeyMap();
    },
    setNextElement: function (elem) {
        this.nextTab = elem;
        this.addOnTabKeyMap();
    }
});

//calculo de las fuentes
UCID.fontClass.cacheFontsClass();


Ext.override(Ext.form.Field, {
    initComponent: Ext.form.Field.prototype.initComponent.createInterceptor(function () {
        var msg = {
            singular: [
                'd&iacute;gito.',
                'caracter.'
            ],
            plural: [
                'd&iacute;gitos.',
                'caracteres.'
            ]
        };
        var addText = '';
        if (this.maxLength) {
            if (this.maxLength == 1) {
                addText = (this instanceof Ext.form.NumberField) ? msg.singular[0] : msg.singular[1];
            } else {
                addText = (this instanceof Ext.form.NumberField) ? msg.plural[0] : msg.plural[1];
            }
            this.maxLengthText = 'El tamaño máximo requerido es ' + this.maxLength + ' ' + addText;
        }
        if (this.minLength) {
            if (this.minLength == 1) {
                addText = (this instanceof Ext.form.NumberField) ? msg.singular[0] : msg.singular[1];
            } else {
                addText = (this instanceof Ext.form.NumberField) ? msg.plural[0] : msg.plural[1];
            }
            this.minLengthText = 'El tamaño mínimo requerido es ' + this.minLength + ' ' + addText;
        }
    })
});

Ext.Ajax.on('requestcomplete', function (conn, response, options, eOpts) {
    var r = typeof(response.responseText);
    if(r==="object" || r==="string") {
        var msg = Ext.util.JSON.decode(response.responseText);

        if (msg) {
            if (msg.codMsg === 9) {
                mostrarMensaje(msg.codMsg, msg.mensaje);
            }

            if (msg.expirate) {
                window.parent.location.reload();
            }
        }

        if (msg.activate) {
            window.location.href = "../../";
        }
    }
});
