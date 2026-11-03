/*
 * Componente portal de aplicaciones
 *
 * Elemento base del portal donde se difine entre otras cosas cual interfaz del
 * portal cargar.
 *
 * @author Dionisdel Ponce Santana @package Portal @subpackage Portal @copyright
 * UCID-ERP Cuba
 *
 * @version 1.0-0
 */
// Variables de config general
var tpCargaInicial, WinCargaInicial, idFuncionalidad, objDesk;
var arrayItems, contadorTab = 0, ejecutarFunc = null;
 winApariencia = null;
// Agrego al objeto portal la direccion del framework ExtJS
UCID.portal.dir_ext_css = document.getElementById('dir_ext_css').value;
Ext.QuickTips.init();
// Creo un objeto para guardar el perfil
var perfil = new Object();
var perfilPortal = new Object();
var winSelecEntidad, winPerfilUsuario, tbDesktop, tbHriztal, winPass, winCert;
var newAccess = false;
var iddominio = null;
var jab;

var jabberClient = (function() {
    /**
     * Constructor privado de la clase.
     * @private
     */
    function _construct() {
        /**
         * Instancia de la interfaz del cliente jabber.
         * @type {Jabber}
         * @private
         */
        var _jabber = null;

        /**
         * Agrega la instancia de la interfaz del cliente jabber.
         * @param jabber
         */
        this.setJabber = function(jabber) {
            _jabber = jabber;
        }

        /**
         * Obtiene la instancia de la interfaz del cliente jabber.
         * @returns {Jabber}
         */
        this.getJabber = function() {
            if (_jabber == null) {
                _jabber = new Jabber({
                    autoShow: false,
                    conn: null,
                    status: null,
                    bosh: null,
                    perfil: perfil
                }, false);
            }
            return _jabber;
        }
    }

    /**
     * Instancia única de la clase.
     */
    var singleInstance;

    /**
     * Retorna la única instancia de la clase.
     */
    return {
        getInstance: function() {
            if (!singleInstance)
                singleInstance = new _construct();
            return singleInstance;
        }
    }

})();

// Funcion para cargar el XML de configuracion del tab panel para la carga
// inicial
function CargarDatosXML() {
    Ext.Ajax.request({
        url: 'cargardatostabpanel',
        callback: function(options, success, response) {
            if (response.responseXML) {
                xmlObj = response.responseXML.documentElement;
                wConfigCargaInicial(dameItemsTP(xmlObj));
            }
            // Se importa el fichero JS que pintará una interfaz u otra
            // en
            // dependencia del perfil del usuario
            else
                importarJS('../../views/js/portal/' + perfil.portal + '.js');
        }
    });
}
// Funcion para cargar el perfil del usuario. La primera que se llama para
// comenzar la carga de la configuracion
UCID.portal.cargarPerfil = function() {
    Ext.Ajax.request({
        //url: 'cargarperfil',
        url: 'cargarperfilAndBackground',
        method: 'POST',

        callback: function(options, success, response) {
            if (success) {
                // Variable de configuracion con el perfil del usuario
                var response = Ext.decode(response.responseText);

                UCID.portal.perfil = response.perfil;
                //var background = response.background;

                // Variable de configuracion con la dirección de los
                // iconos
                UCID.portal.perfil.dirImg = UCID.portal.dir_ext_css
                        + 'images/iconos/';

                var body = Ext.getBody();
                var background = (response.background) ? response.background : "/portal/views/js/portal/apariencia/imagen/wallpapers/Zeol23.png";
                body.dom.style.background = "url(" + background + ")no-repeat left top";
                UCID.portal.perfil.background = background;
                /*if (UCID.portal.perfil.background) {
                    var background = UCID.portal.dir_ext_css + "images/desktop/wallpapers/"
                            + UCID.portal.perfil.background;
                    body.dom.style.background = "url(" + background + ")no-repeat left top";
                }*/
                UCID.portal.perfil.dirCss = UCID.portal.dir_ext_css + 'css/ext-all.css';
                // Se crea una variable de configuracion con el perfil
                perfil = UCID.portal.perfil;
                if ((perfil.caduca != -1) && (perfil.caduca <= 5)) {
                    mostrarMensaje(1, 'Su contraseña caduca dentro de ' + perfil.caduca + 'dia(s).');
                }
                cargarEtiquetasPortal('portal', function() {
                    CargarDatosXML();
                });
            } else {
                mostrarMensaje(3, response.responseText);
            }
        }
    });
}
// Inmediatamente se llama la función UCID.portal.cargarPerfil
UCID.portal.cargarPerfil();
// Funcion para cargar las etiquetas del portal según la configuración del
// idioma
function cargarEtiquetasPortal(vistaCU, fn) {
    Ext.Ajax.request({
        url: 'cargaretiquetas',
        method: 'POST',
        params: {
            vista: vistaCU
        },
        callback: function(options, success, response) {
            if (success) {
                perfilPortal.etiquetas = Ext
                        .decode(response.responseText);
                definirBotonesBarras();
                var codMsg = perfilPortal.etiquetas.codMsg;
                if (!codMsg)
                    fn();
            }
        }
    });
}
// Funcion que es llamada para colocar un div con el nombre de la entidad
// seleccionada.
/*
 * function colocarEntidad(aentidad,st,aMargin,aFont){
 * if(document.getElementById(st)){ aDiv = document.getElementById(st);
 * aDiv.style.margin = aMargin; aDiv.style.fontSize = aFont;
 * aDiv.style.visibility = 'visible'; aDiv.innerHTML =
 * perfilPortal.etiquetas.lbEntidad+aentidad; } }
 */
// Funcion que permite incluir un fichero .js de forma dinámica
function importarJS(dirJS) {
    var js_file = document.createElement("script");
    js_file.setAttribute("language", "javascript");
    js_file.setAttribute("type", "text/javascript");
    js_file.setAttribute("src", dirJS);
    document.getElementsByTagName("head")[0].appendChild(js_file);
}
// Funcion que se va a llamar para cerrar la sesión de un usuario autenticado
function cerrarSesion() {
    var txtUser = (perfil.alias) ? perfil.alias : perfil.usuario;
    mostrarMensaje(2, '¿' + perfilPortal.etiquetas.lbMsgCerrarSesion + txtUser
            + '?', okCierra)
    function okCierra(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.getBody().mask(perfilPortal.etiquetas.cierreSession);
            window.location = '/seguridad/index.php/serviceprovider/logout';            
            //Ext.Ajax.request({
            //    url: '/seguridad/index.php/serviceprovider/logout',
            //    callback: function(options, success, response) {
            //        Ext.getBody().unmask();
            //        responseData = Ext.decode(response.responseText);
            //        if (responseData.codMsg)
            //            mostrarMensaje(responseData.codMsg,
            //                    responseData.mensaje);
            //        else if (responseData.close) {
            //            if (window.opener) {
            //                window.parent.focus();
            //                window.opener.parent.location.reload();
            //                window.close();
            //            }else{
            //               window.location.reload();
            //            }
            //        }
            //    }
            //});
        }
    }
}
// Definición del formulario para seleccionar si quiero cambiar de usuario o
// entidad

// Funcion para acceder al sistema una vez seleccionada la entidad
function entrarAlSistema() {
    winSelecEntidad.items.items[0].getForm().submit({
        url: 'entraralsistema',
        waitMsg: perfilPortal.etiquetas.entrada,
        params: {
            dominio: iddominio
        },
        failure: function(form, action) {
            if (action.result.codMsg)
                mostrarMensaje(action.result.codMsg,
                        action.result.mensaje);
            else if (action.result.reload == false) {
                //window.parent.focus();
                window.open('/seguridad/index.php/serviceprovider/logout', '_parent');
                /*
                window.opener.parent.location.reload();
                window.close();*/
            } else if (action.result.reload == true) {
                winSelecEntidad.hide();
                window.opener.parent.location.reload();
                window.location.reload();
            }
        }
    });
}
// Definicion de las barras de herramientas para un desktop u otro
function definirBotonesBarras() {
    var txtUser = (perfil.alias) ? perfil.alias : perfil.usuario;
    var funJabber = function() {
        jab = jabberClient.getInstance().getJabber();
        jab.show();
    }
	  var preferencia=function() {	
              if(!winApariencia){
        winApariencia       = new Ext.comun.apariencia.Ventana({
            title               : 'Apariencia'
        });
        winApariencia.show();   
    }else{
            winApariencia.hide();
            winApariencia       = new Ext.comun.apariencia.Ventana({
                title               : 'Apariencia'
            });
            winApariencia.show();

        }   
    }

    tbDesktop = ['-', {
            //icon: perfil.dirImg + 'cambiarentidad.png',
            iconCls: 'cambiarentidad azul',
            menuPortal:true,
            text: perfilPortal.etiquetas.lbCambiarEntidad,
            tooltip: perfilPortal.etiquetas.lbCambiarEntidad,
            handler: function() {
                mostrarWinSelectEntidad();
            },
            scope: this
        }, {
            text: 'Ayuda',
           // icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            menuPortal:true,
            tooltip: perfilPortal.etiquetas.lbHelp,
            menu: {
                items: [
                    {
                        text: 'Ayuda del Sistema',
                        // icon: perfil.dirImg + 'ayuda.png',
                        iconCls: 'ayuda',
                        menuPortal:true,
                        handler: function() {
                            cargarAyuda();
                        }
                    }, {
                        text: 'Soporte',
                        //icon: perfil.dirImg + 'info.png',
                        iconCls: 'soporte',
                        menuPortal:true,
                        handler: function() {
                            var existe = (typeof Ext.getCmp('winInser') == 'undefined') ? false:true;
                            if (!existe){
                                var urlcrearnc = '/herramientas/cein/index.php/cein/adicionar',
                                    tieneModuloCEIN = true;

                                Ext.Ajax.request({
                                    url: '/seguridad/index.php/configuracion/tieneModuloCein',
                                    callback: function (option, success, response) {
                                        var resp = JSON.parse(response.responseText);
                                        if (!resp.success) {
                                            urlcrearnc = '/herramientas/gestor_ncclient/index.php/ceinclient/adicionar';
                                            tieneModuloCEIN = false;
                                        }

                                        new cein.views.GestorreportesView({
                                            ayudaPrincipal : true,
                                            urlcrearnc: urlcrearnc,
                                            tieneModuloCEIN: tieneModuloCEIN
                                        }).show();
                                    }
                                });
                            }
                        }
                    }, {
                        text: 'Acerca de',
                        //icon: perfil.dirImg + 'info.png',
                        iconCls: 'info',
                        menuPortal:true,
                        handler: function() {
                            var uri = "portal";
                            acercaDe.show(uri);
                        }
                    }

                ]
            }

            /*iconCls: 'btn',
             icon: perfil.dirImg + 'ayuda.png',
             text: perfilPortal.etiquetas.lbBtnAyuda,
             tooltip: perfilPortal.etiquetas.lbHelp,
             handler: function () {
             cargarAyuda();
             },
             scope: this*/
        }, '-', {
            //icon: perfil.dirImg + 'cambiarcontrasena.png',
            iconCls: 'cambiarcontrasena azul',
            menuPortal:true,
            text: perfilPortal.etiquetas.lbBtnCambiarpass,
            tooltip: perfilPortal.etiquetas.lbBtnCambiarpassw,
            handler: function() {
                winPass.show();
            },
            scope: this
        },{
            iconCls: 'certificacion',
            menuPortal:true,
            text: perfilPortal.etiquetas.lbBtnAsociarCert,
            tooltip: perfilPortal.etiquetas.lbBtnAsociarCertificado,
            handler: function() {
                winCert.show();
            },
            scope: this
        }, '-',
        // start-jabber
       /* {
            iconCls: 'btn',
            icon: '/portal/views/js/portal/jabber/resources/images/bird1.png',
            text: perfilPortal.etiquetas.jabber,
            tooltip: perfilPortal.etiquetas.jabber,
            handler: funJabber,
            scope: this
        },*/
        {
        text 	: 'Apariencia ',
        //icon: '/portal/views/js/portal/images/portal.gif',
        iconCls: 'apariencia azul',
        menuPortal:true,
        tooltip	: 'Para cambiar las preferencias',
        handler : preferencia,
        scope : this
          },
        // end-jabber
        {
            iconCls: 'salir',
            menuPortal:true,
            text: perfilPortal.etiquetas.lbSalir,
            tooltip: perfilPortal.etiquetas.cerrarSession,
            handler: function() {
                cerrarSesion();
            },
            scope: this
        }];
}
function cargarAyuda() {
    var referencia = '/portal/';
    ayuda.show(2, referencia);
}



// *******Para carga inicial*******//
// Botones para el tabpanel
btnSiguiente = new Ext.Button({
    disabled: true,
    hidden: false,
    id: 'btnSiguiente',
    text: 'Siguiente',
    handler: function() {
        (ejecutarFunc != null)
                ? (ejecutarFunc())
                ? cambiarTab('next')
                : mostrarMensaje(3, perfilPortal.etiquetas.CIError)
                : cambiarTab('next')
    }
});
btnAnterior = new Ext.Button({
    disabled: true,
    hidden: true,
    id: 'btnAnterior',
    text: 'Anterior',
    handler: function() {
    }
});
btnFinalizar = new Ext.Button({
    disabled: false,
    hidden: true,
    id: 'btnFinalizar',
    text: 'Finalizar',
    handler: function() {
        importarJS('../../views/js/portal/' + perfil.portal + '.js');
        WinCargaInicial.close();
    }
});
// Funcion para llamar la ventana para la carga inicial
function wConfigCargaInicial(tpitems) {
    // Tab panel para configuracion de la carga inicial
    tpCargaInicial = new Ext.TabPanel({
        frame: true,
        activeTab: 0,
        listeners: {
            'beforetabchange': function(tabPanel, tabNew, tabActual) {
                return verificarCambioTab(tabPanel, tabNew, tabActual);
            }
        },
        items: tpitems
    });
    // Definición de la ventana para la carga inicial
    if (!WinCargaInicial) {
        WinCargaInicial = new Ext.Window({
            title: perfilPortal.etiquetas.ConfiguracionCI,
            width: 700,
            layout: 'fit',
            closable: false,
            height: 500,
            modal: true,
            items: tpCargaInicial,
            buttons: [btnAnterior, btnSiguiente, btnFinalizar]
        })
    }
    WinCargaInicial.show(document.body);
}
// Funcion que recibe el xml de configuración y devuelve un array de items en
// forma de panel
function dameItemsTP(xmlObj) {
    arrayItems = [];
    for (var i = 0; i < xmlObj.childNodes.length; i++) {
        if (xmlObj.childNodes[i].nodeName == "tab") {
            arrayItems.push({
                title: xmlObj.childNodes[i].getAttribute("title"),
                disabled: (i == 1) ? false : true,
                layout: 'fit',
                html: '<iframe id="'
                        + xmlObj.childNodes[i].getAttribute("idiframe")
                        + '" src="'
                        + xmlObj.childNodes[i].getAttribute("funcionalidad")
                        + '"; style="width:100%; height: 100%; border:none;"></iframe>',
                id: xmlObj.childNodes[i].getAttribute("idtab"),
                funcionalidad: xmlObj.childNodes[i]
                        .getAttribute("funcionalidad"),
                idiframe: xmlObj.childNodes[i].getAttribute("idiframe"),
                estado: xmlObj.childNodes[i].getAttribute("estado")
            });
        }
    }
    return arrayItems;
}
// Funcion para verificar el cambio de tab correctamente
function verificarCambioTab(tabPanel, tabNew, tabActual) {
    return true;
}
// Funcion para cambiar el estado del tab correctamente
var cambiarEstado = function(estado, fn) {
    ejecutarFunc = fn;
    (estado == 'si') ? btnSiguiente.enable() : btnSiguiente.disable();
}
// Funcion para cambiar de tab correctamente
var cambiarTab = function(direccion) {
    if (direccion == 'next') {
        tpCargaInicial.getComponent(contadorTab++).enable();
        tpCargaInicial.getComponent(contadorTab).enable();
        tpCargaInicial.setActiveTab(tpCargaInicial.getComponent(contadorTab));
        btnSiguiente.disable();
        if (contadorTab == arrayItems.length - 1) {
            btnFinalizar.show();
            btnSiguiente.hide();
        }
    }
}

getWinById = function(aid) {
    return (aid) ? objDesk.getWindow('win' + aid) : 0;
}
// Funcion para mostrar la ventana para cambiar el usuario o la entidad
function mostrarWinSelectEntidad() {
    if (!winSelecEntidad) {
        winSelecEntidad = new Ext.Window({
            renderTo : 'x-desktop',
            constrain : true,
            modal: true,
            closeAction: 'hide',
            layout: 'fit',
            width: 400,
            title: perfilPortal.etiquetas.updIn,
            autoHeight: true,
            items: new Ext.FormPanel({
                formId: 'FormIndex',
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                width: 400,
                style: 'text-align:left',
                autoHeight: 300,
                items: [
                    {
                        xtype: 'treepanel',
                        autoScroll: true,
                        frame: false,
                        height: 200,
                        id: 'treepan',
                        //disabled: false,
                        bodyStyle: 'background-color:#FFFFFF;',
                        listeners: {
                            'click': function(nodo) {
                                if (nodo.id != 0) {
                                    Ext.getCmp('btnAceptarCambio').enable();
                                    iddominio = nodo.id;
                                } else {
                                    if (!newAccess)
                                        Ext.getCmp('btnAceptarCambio').disable();
                                    iddominio = null;
                                }
                            }
                        },
                        root: new Ext.tree.AsyncTreeNode({
                            text: 'Dominio de entidades',
                            id: '0'
                        }),
                        loader: new Ext.tree.TreeLoader({
                            dataUrl: 'cargardominio',
                            preloadChildren: false,
                            baseParams: {}
                        })
                    },
                    {
                        xtype: 'fieldset',
                        style: 'margin-top:10px;',
                        title: perfilPortal.etiquetas.accessSistem,
                        autoHeight: true,
                        items: [
                            {
                                xtype: 'radio',
                                hideLabel: true,
                                boxLabel: perfilPortal.etiquetas.authenticUser,
                                name: 'tipoacceso',
                                inputValue: 'ultimo',
                                checked: true,
                                listeners: {
                                    'check': function(obj, ischeck) {
                                        if (ischeck) {
                                            if (iddominio == null) {
                                                Ext.getCmp('btnAceptarCambio').disable();
                                                Ext.getCmp('treepan').enable();
                                                newAccess = false;
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'radio',
                                hideLabel: true,
                                boxLabel: perfilPortal.etiquetas.diferetUser,
                                name: 'tipoacceso',
                                inputValue: 'nuevo',
                                listeners: {
                                    'check': function(obj, ischeck) {
                                        if (ischeck) {
                                            Ext.getCmp('btnAceptarCambio').enable();
                                            Ext.getCmp('treepan').disable();
                                            Ext.getCmp('treepan').getSelectionModel().clearSelections();
                                            iddominio = null;
                                            newAccess = true;
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            }),
            buttons: [
                {
                    text: perfilPortal.etiquetas.lbBtnCancelar,
                    iconCls: 'cancelar',
                    tooltip: perfilPortal.etiquetas.lbBtnCancelarTip,
                    handler: function() {
                        winSelecEntidad.hide();
                    }
                },
                {
                    text: perfilPortal.etiquetas.lbBtnAceptar,
                    iconCls: 'aceptar',
                    tooltip: perfilPortal.etiquetas.lbBtnAceptarTip,
                    disabled: true,
                    id: 'btnAceptarCambio',
                    handler: function() {
                        entrarAlSistema();
                    }
                }
            ],
            keys: [
                {
                    key: 13,
                    alt: false,
                    ctrl: false,
                    shift: false,
                    handler: function(k, e) {
                        entrarAlSistema();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    ctrl: false,
                    shift: false,
                    handler: function(k, e) {
                        winSelecEntidad.hide();
                    }
                }
            ]
        });
    }
    winSelecEntidad.show('x-desktop');
}
