/*
 * Fichero de configuración general del MT
 * @author Grupo de desarrollo del MT
 * @package Portal
 * @subpackage Portal
 * @copyright XETID Cuba
 * @version 2.0-0
 */

/**
 * Activando la validacion automatica de los formularios. Cuando el formulario es valido
 * activa los botones de la ventana que contiene el formulario, sino los desactiva.
 *
 * Autores: Cap.Yoandry Morejón Borbón y TC.Juan Luis R.guez H.dez
 * Ultima fecha de actualización: 25/Junio/2014
 */

    // Aqui se inicializa en cada ventana un atributo de tipo arreglo para controlar el estado de la validación de los formularios
Ext.override(Ext.Window, {
    registerValidForm: [],
    initComponent: Ext.Window.prototype.initComponent.createInterceptor(function () {
        this.on('show', function () {
            this.registerValidForm = []; // Atributo para guardar los formularios validos registrados.
            this.isFormMod = true; // Atributo para controlar si es una ventana de Modificar o no.
            var btn;
            for (btn in this.buttons) {
                if ((this.buttons[btn].iconCls == 'aplicar'
                    || this.buttons[btn].text == 'Aplicar' ) && this.buttons[btn].isVisible()) {
                    this.isFormMod = false;
                }
            }
        });
    })
});

Ext.override(Ext.FormPanel, {
    monitorValid: true,
    //monitorPoll:600,
    initComponent: Ext.FormPanel.prototype.initComponent.createInterceptor(function () {

        this.defaultValues = null; // Variable para guardar los campos defaults del Formulario

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
            if (this.windowParent != null) {
                if (typeof(this.windowParent) == 'object' && typeof(this.windowParent.buttons) == 'object') {
                    var otherFormValid = true;
                    var i;
                    var existForm = false;
                    if (this.windowParent.registerValidForm.length > 0) {
                        var length = this.windowParent.registerValidForm.length;
                        for (i = 0; i < length; i++) {
                            if (this.windowParent.registerValidForm[i].id == this.id) {
                                this.windowParent.registerValidForm[i].valid = valid;
                                existForm = true;
                            } else {
                                otherFormValid = otherFormValid && this.windowParent.registerValidForm[i].valid;
                            }
                        }
                    }
                    if (existForm == false) {
                        //*** Aqui entra solo una vez por cada ocasión q se muestra una ventana
                        this.windowParent.registerValidForm.push({id: this.id, valid: valid});// se agregan los formularios a la ventana
                        this.defaultValues = this.getForm().getValues(true);// se inicializa la variable del formulario con los valores default del formulario para comparar
                    }
                    //*** Aqui se hace la validación para activar o desactivar los botones
                    var key;
                    for (key in this.windowParent.buttons) {
                        if (this.windowParent.buttons[key].iconCls == 'aplicar' || this.windowParent.buttons[key].iconCls == 'aceptar'
                            || this.windowParent.buttons[key].text == 'Aceptar' || this.windowParent.buttons[key].text == 'Aplicar'
                            )
                        {
                            this.windowParent.buttons[key].setDisabled(
                                !(valid && otherFormValid &&
                                (!this.windowParent.isFormMod || (this.windowParent.isFormMod
                                    && (this.defaultValues != this.getForm().getValues(true))))));
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

if (Ext) {
    Ext.BLANK_IMAGE_URL = '/lib/ExtJS/temas/default/images/s.gif';


    //Ext.WindowMgr.zseed = 50000;
    if (window.parent.UCID.portal.dir_ext_css) {
        var dir_icon_class = window.parent.UCID.portal.dir_ext_css + 'css/icon-clases.css';
        var existLink = false;
        var linkArr = document.getElementsByTagName("link");
        var port = '';
        if (window.location.port)
            port = ':' + window.location.port;
        var dirHostIconCSS = window.location.protocol + '//' + window.location.host + port + dir_icon_class;
        var dirHostnameIconCSS = window.location.protocol + '//' + window.location.hostname + port + dir_icon_class;
        for (var i = 0; i < linkArr.length; i++) {
            if (linkArr[i].href == dirHostIconCSS || linkArr[i].href == dirHostnameIconCSS) {
                existLink = true;
                break;
            }
        }
        if (!existLink)
            importarCSS(dir_icon_class);
    }
    importarJS("/lib/ExtJS/idioma/es/js/ext-lang-es.js");
    Ext.Ajax.on('requestcomplete', function (conn, response, options) {
        var respText = response.responseText;
        var respXML = response.responseXML;
        if (respText && !respXML) {
            var respObj = Ext.decode(respText);
            if (respObj.codMsg && respObj.codMsg >= 1 && respObj.codMsg <= 6) {
                Ext.getBody().unmask();
                mostrarMensaje(respObj.codMsg, respObj.mensaje, null, respObj.detalles);
            }

        }
    });

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


    /**
     * Mensajes del MT
     *
     * Autores: TC.Juan Luis R.guez H.dez y TC.Alejandro Almarales
     * Ultima fecha de actualización: 15/Mayo/2014
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
            'div#imgWarning{background: url("/lib/UCID/images/warning-icon.png") no-repeat left;width: 44px;height: 40px;float: left;margin: -28px 0px 0px -38px;}' +
            "#msg-error .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 2px solid #CC3333;margin-top: 10px;padding: 10px 15px;color: #990000;box-shadow: 2px 2px 15px #CC3333;}" +

            "#msg-warning .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 2px solid rgba(255, 224, 26, 0.82);margin-top: 10px;padding: 10px 15px;color: #7F5214;box-shadow: 2px 2px 15px rgba(181, 161, 17, 0.82);}" +
            "#msg-error .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}" +

            "#msg-warning .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}" +
            "#msg-div .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 2px solid #3764A0;margin-top: 10px;padding: 10px 15px;color: #04408c;box-shadow: 2px 2px 15px #3764A0;}" +
            "#msg-div .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}"
        ;
        document.body.appendChild(styleLeaf);
    }();

    Zeolides.Utils.NotificationBox.show = function (message) {
        var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
        //<h3>Informaci&oacute;n</h3>
        var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgOk"></div><h3>Informaci&oacute;n</h3><p>' + message + '</p></div>', true);
        msg.slideIn('t').pause(4).ghost("t", {remove: true});
    };

    Zeolides.Utils.NotificationBox.showError = function (message) {
        var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-error'}, true);
        var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgError"></div><h3>Error</h3><p>' + message + '</p></div>', true);
        msg.slideIn('t').pause(5).ghost("t", {remove: true});
    };
    Zeolides.Utils.NotificationBox.showWarning = function (message) {
        var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-warning'}, true);
        var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgWarning"></div><h3>Advertencia</h3><p>' + message + '</p></div>', true);
        msg.slideIn('t').pause(5).ghost("t", {remove: true});
    };
    // Funcion para mostrar un mensaje
    mostrarMensaje = function (tipo, msg, fn, detalle) {

        var buttons = new Array(Ext.MessageBox.OK, Ext.MessageBox.OKCANCEL, Ext.MessageBox.OK);
        var title = new Array('Informaci&oacute;n', 'Confirmaci&oacute;n', 'Error');
        var icons = new Array(Ext.MessageBox.INFO, Ext.MessageBox.QUESTION, Ext.MessageBox.ERROR);
        //con switch por si surgen nuevos tipos de mensajes
        //para los de tipo 4 y 5 se puede hacer con IF-ELSE con menos codigo en caso de que no vayan a surgir nuevos tipos de mensajes
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
    /*-------------Otra variante para el uso de IFRAME*/
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
                    window.open('/portal/index.php/portal/login', 'portaLogin', wCfg);
                },
                icon: Ext.MessageBox.ERROR
            });
        }
    }, this);
}//Endofif


Ext.override(Ext.Button, {
    initComponent: Ext.Button.prototype.initComponent.createInterceptor(function () {
        if (this.seguridad) {
            this.hidden = true;
        }
    }, this)
});
