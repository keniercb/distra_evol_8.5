/*
 * Componente portal de aplicaciones
 *
 * Interfaz del portal desktop con ventana por acciones.
 *
 * @author Dionisdel Ponce Santana
 * @package Portal
 * @subpackage Portal
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */

var itemsVentanaCrear;
Ucid_Funcionalidades = {};
var menuTMP = {};


MyDesktop = new Ext.app.App({
    init: function () {
        Ext.QuickTips.init();
    },
    getModules: function () {
        return dameMenuModules(menuTMP);
    },
    // config for the start menu
    getStartConfig: function () {
        var txtUser = (perfil.alias) ? perfil.alias : perfil.usuario;
        return {
            title: '<right>' + perfilPortal.etiquetas.lbStartTitle + ' ' + txtUser + '&nbsp; | &nbsp;' + 'Tema: ' + perfil.dentema + '</right>',
            iconCls: 'user',
            perfil: perfil,
            toolItems: tbDesktop
        };
    }
});
MyDesktop.BogusModule = Ext.extend(Ext.app.Module, {
    init: function () {
        this.launcher = {
            text: 'ddd',
            handler: this.createWindow,
            scope: this,
            windowId: 'ddd'
        }
    },
    createWindow: function (src) {
        var desktop = this.app.getDesktop();
        objDesk = this.app.getDesktop();
        var win = desktop.getWindow('win' + src.aWinConfig.id);
        if (!win) {
            win = desktop.createWindow({
                id: 'win' + src.aWinConfig.id,
                title: src.aWinConfig.text,
                config: src,
                layout: 'fit',
                items: new Ext.Panel({
                    id: 'iframe' + src.aWinConfig.id,
                    border: false,
                    html: '<iframe id="' + src.aWinConfig.id + '" style="width:100%; height: 100%; border:none;"></iframe>',
                    layout: 'fit'
                }),
                width: 800,
                maximized: true,
                height: 490,
                minWidth: 800,
                minHeight: 480,
                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,//a partir de aqui
                displayHelp: true,
                appHi: false,
                dirHelps : {
                    pathHelp:"",
                    pathAction:"",
                    pathAcercad:""
                },
                referencia: src.aWinConfig.referencia,
                tools : [{
                    id:'incidencia',
                    qtip: 'Soporte del sistema <b>(Ctrl+F3)</b>',
                    handler: function(event, toolEl, panel){
                        var ginc = new UCID.cein.GestorreportesView({referencia: src.aWinConfig.referencia});
                        // var ginc = new UCID.cein.GestorreportesView({referencia: win.referencia});
                        ginc.show();
                    }
                },{
                    id:'infor',
                    qtip: 'Acerca de <b>(Ctrl+F2)</b>',
                    handler: function(event, toolEl, panel){
                        var desk2 = desktop.getManager().getActive();
                        acercaDe.show(desk2.dirHelps.pathAcercad);
                    }
                },{
                    id:'ayuda',
                    qtip: 'Mostrar ayuda de la funcionalidad <b>(Ctrl+F1)</b>',
                    handler: function(event, toolEl, panel){
                        var desk2 = desktop.getManager().getActive();
                        ayuda.show('2', desk2.dirHelps.pathHelp,  desk2.dirHelps.pathAction);
                    }
                },{
                    id:'arrowh',
                    qtip:'Ayuda del sistema',
                    handler: function(event, toolEl, panel){
                        var el1 = Ext.get(src.aWinConfig.id+'-infor');
                        var el2 = Ext.get(src.aWinConfig.id+'-incidencia');
                        var el3 = Ext.get(src.aWinConfig.id+'-ayuda');
                        var el4 = Ext.get(src.aWinConfig.id+'-arrowl');

                        if(panel.displayHelp){

                            el1.removeClass('deactiveh');
                            el2.removeClass('deactiveh');
                            el3.removeClass('deactiveh');
                            el4.removeClass('x-tool-arrowl');

                            el1.addClass('activeh');
                            el2.addClass('activeh');
                            el3.addClass('activeh');

                            el4.addClass('x-tool-arrowr');

                        }else{

                            el1.removeClass('activeh');
                            el2.removeClass('activeh');
                            el3.removeClass('activeh');
                            el4.removeClass('x-tool-arrowr');

                            el1.addClass('deactiveh');
                            el2.addClass('deactiveh');
                            el3.addClass('deactiveh');
                            el4.addClass('x-tool-arrowl');
                        }

                        panel.displayHelp =  !panel.displayHelp;

                    }
                },{
                    id:'arrowl',
                    handler: function(event, toolEl, panel){
                        // whatever
                    }
                }],
                toolTemplate: new Ext.XTemplate(
                    '<tpl if="0 == this.test(id)">',
                    '<div id='+src.aWinConfig.id+'-{id} class="x x-tool-{id} deactiveh"></div>',
                    '</tpl>',

                    '<tpl if="1 == this.test(id)">',
                    '<div class="x-tool x-tool-{id}">&#160;</div>',
                    '</tpl>',

                    '<tpl if="2 == this.test(id)">',
                    '<div id='+src.aWinConfig.id+'-{id} class="x x-tool-{id}"></div>',
                    '</tpl>',
                    {
                        test: function(a){
                            switch(a) {
                                case 'incidencia':
                                    return 0;
                                    break;
                                case 'infor':
                                    return 0;
                                    break;
                                case 'arrowh':
                                    return 2;
                                    break;
                                case 'arrowd':
                                    return 2;
                                    break;
                                case 'arrowl':
                                    return 2;
                                    break;
                                case 'arrowr':
                                    return 2;
                                    break;
                                case 'ayuda':
                                    return 0;
                                    break;
                                default:
                                    return 1;
                            }
                        }
                    }
                )
            });
            /*Para registrar las ventanas*/

            Ext.WindowMgr.register(win);
        }
        win.show();
        idFuncionalidad = src.aWinConfig.id;
        document.getElementById(src.aWinConfig.id).src = src.aWinConfig.referencia + '?opcion=' + src.aWinConfig.index;
        document.getElementById(src.aWinConfig.id).referencia = src.aWinConfig.referencia;

        var map1 = new Ext.KeyMap(document.body, [
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
                    var desk2 = desktop.getManager().getActive();
                    acercaDe.show(desk2.dirHelps.pathAcercad);
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
});
MyDesktop.BogusMenuModule = Ext.extend(MyDesktop.BogusModule, {
    init: function () {
        this.launcher = {
            text: perfilPortal.etiquetas.lbTituloMenu,           
            handler: function () {
                return false;
            },
            menu: {
                items: dameItemsMenu(this, menuTMP)
            }
        }
    }
});

//Funciones
function dameItemsMenu(objDesk, objson) {
    var arrayItems = Array();
    if (objson && objson.length) {
        for (var i = 0; i < objson.length; i++) {
            if (objson[i].menu) {
                arrayItems[i] = {
                    text: objson[i].text,
                    iconCls :(objson[i].icono) ? objson[i].icono : '',
                    handler: function () {
                        return false;
                    },
                    menu: {
                        items: dameItemsMenu(objDesk, objson[i].menu)
                    },
                    windowId: objson[i].id
                }
            }
            else {
                arrayItems[i] = {
                    text: objson[i].text,
                    funcionalidad : objson[i].funcionalidad,
                    iconCls :(objson[i].icono) ? objson[i].icono : '',                    
                    handler: objDesk.createWindow,
                    scope: objDesk,
                    aWinConfig: objson[i],
                    windowId: objson[i].id
                }
            }
        }
    }

    return arrayItems;
}

var cont = 0;
function creaMenuModules(aMenu, aPos) {   

    eval('MyDesktop.Subsistema' + aPos + ' = Ext.extend(MyDesktop.BogusModule, {init : function(){this.launcher = {funcionalidad: "'+aMenu.funcionalidad+'", text:"' + aMenu.text + '",windowId:"' + aMenu.id + '",iconCls:"'+aMenu.icono+'",handler: function() {return false;},menu: {items:dameItemsMenu(this, aMenu.menu) }}}});');
    
}

function dameMenuModules(menuTMP) {
    var arrayModules = [];
    arrayModules = '[';
    for (var i = 0; i < menuTMP.length; i++) {
        arrayModules += (i + 1 == menuTMP.length) ? 'new MyDesktop.Subsistema' + i + '()]' : 'new MyDesktop.Subsistema' + i + '(),';
        if (menuTMP[i].menu) creaMenuModules(menuTMP[i], i);
    }
    return eval(arrayModules);
}
//Para mandar a disparar el evento que cambio de ámbito    
function disparaEvento() {
    MyDesktop.fireEvent('cambiar_dominio');
}

function ajaxEliminarNotificacion(idseleccionados){
    Ext.Ajax.request({
        url: '/portal/index.php/bandeja/eliminarNotificaciones',
        method: 'POST',
        params: {
            ids: Ext.encode(idseleccionados)

        },
        callback: function (options, success, response) {
            var textMsg = '';
            var request = Ext.decode(response.responseText);
            if(request.success){
                textMsg = (idseleccionados.length != 1) ? 'Las notificaciones han sido eliminadas satisfactoriamente.' : 'La notificaci&oacute;n ha sido eliminada satisfactoriamente.';
                var tipo = Ext.getCmp(ventana.idTabPanel).getActiveTab().tipo;
                onClick(tipo, menu);
                mostrarMensaje(1, textMsg);
            }else{
                textMsg = (idseleccionados.length != 1) ? 'Ocurri&oacute; un error al eliminar las notifcaciones.' : 'Ocurri&oacute; un error al eliminar la notificaci&oacute;n';
                mostrarMensaje(6, textMsg);
            }


        }});
}

function onClick(tipo, menu) {

    var me = this;
    if (!menu.tieneVentana) {
        ventana = new Ext.window.Notificaciones({
            url: '/portal/index.php/bandeja/listarNotificaciones',
            tipo: tipo,
            botonEliminar: true,
            keys: [
                {
                    key:'x',
                    alt:true,
                    handler:function(){
                        ventana.destroy();
                    }
                },
                {
                    key: Ext.EventObject.DELETE,
                    handler: function () {
                        var grid = Ext.getCmp(ventana.idTabPanel).getActiveTab().view.grid;
                        var btnEliminar = grid.btnEliminar;
                        if (!btnEliminar.disabled) {
                            var arrayIds = Ext.getCmp(ventana.idTabPanel).getActiveTab().obtenerIdsSeleccionados();
                            var msg = (arrayIds.length > 1) ? '¿Est&aacute; seguro que desea eliminar las notificaciones seleccionadas?' : '¿Est&aacute; seguro que desea eliminar la notificaci&oacute;n seleccionada?';
                            Ext.MessageBox.confirm('Confirmaci&oacute;n', msg, function (btn) {
                                (btn === 'yes') ? ajaxEliminarNotificacion(arrayIds) : Ext.getCmp('winNotificaciones').focus();
                            });
                        }
                    }
                }
            ],
            listeners: {
                destroy: function () {
                    menu.tieneVentana = null;
                },
                onClickNoleido: function (menu, record, tipo) {
                    Ext.Ajax.request({
                        url: '/portal/index.php/bandeja/marcarLeido',
                        method: 'POST',
                        params: {
                            id: record.data.id
                        },
                        callback: function (options, success, response) {
                            record.set('estado', 0);
                        }});
                },
                onClickEliminarNotificaciones: function (idseleccionados, recordsSeleccionados) {
                    ajaxEliminarNotificacion(idseleccionados);
                }
            }
        });
        menu.tieneVentana = true;
    } else {
        ventana.agregarTab(tipo);
    }}

function crearNotificaciones(notificaciones1, msgError){

    if(!Ext.get('menuContainerNoti')){
        menu = new Ext.menu.Notificaciones({
            notificaciones: notificaciones1,
            sonido: true,
            msgError: msgError,
            margenDerecho: 20,
            listeners: {
                update: function () {                   
                },
                onClickConfigurar: function(){                  
                },
                onClickTodas: function (menu, tipo, cantidad) {
                    onClick(tipo, menu);
                },
                onClickError: function (menu, tipo, cantidad) {
                    onClick(tipo, menu);
                },
                onClickWarning: function (menu, tipo, cantidad) {
                    onClick(tipo, menu);
                },
                onClickInfo: function (menu, tipo, cantidad) {
                    onClick(tipo, menu);
                },
                onClickAlert: function (menu, tipo, cantidad) {
                    onClick(tipo, menu);
                }
            }
        });
        var ventana = null;
    }else{
        menu.actualizar(notificaciones1, msgError);
    }

}

function conectarSocketNotificaciones(){

    socketNotificaciones = new io.connect(SERVER_NAME, {
        port: 9877
    });
    socketNotificaciones.on('connect', function () {
        socketNotificaciones.emit('subscribe', iddestinatario);
        crearNotificaciones([]);      
    });

    socketNotificaciones.on('disconnect', function () {
        crearNotificaciones(false, 'El servidor socket est&aacute; desconectado');     
    });


    socketNotificaciones.on('notificaciones', function (data) {
        var respuesta = JSON.parse(data);
        if(respuesta.success){
            crearNotificaciones(respuesta.notificaciones);
        }else{
            crearNotificaciones(false, 'Error al obtener las notificaciones');
            console.log('error obteniendo notificaciones');
        }

    });
    if(!socketNotificaciones.socket.connected){
        crearNotificaciones(false, 'El servidor socket est&aacute; desconectado');
    }
}


Ext.Ajax.request({
    url: 'cargardesktop',
    method: 'POST',
    callback: function (options, success, response) {

        if (success) {
            //----Conectar el socket-----//
            conectarSocketNotificaciones();           

            menuTMP = Ext.decode(response.responseText);

            document.getElementById('cargandoconfiguracion').style.display = 'none';
            document.getElementById('x-desktop').style.display = 'inline';
            MyDesktop.initApp();
            crearAccesos();

        }
    }
});
