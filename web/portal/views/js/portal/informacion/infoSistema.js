/**
 * Created by Ernesto on 15/12/2014.
 */


var ayuda = new function() {
    activateHelp = false;
    return {
        show : function(version,referencia,accion, flag) {

            var url =referencia;
            actionhelpview = accion;
            var showFlag = (typeof(flag) == 'undefined') ? false : flag;


            Ext.Ajax.request({
                url : '/portal/index.php/portal/getayuda',
                params : {
                    uri : referencia
                },
                success : function(res) {

                    __this = this;
                    this.showMeMyHelp = true;

                    function createWinHelp(){
                        var desk2 = window.parent.MyDesktop.getDesktop();
                        var _exist = desk2.getWindow('id_'+referencia);

                        if(!_exist){
                            __this.winIframe2 = desk2.createWindow({
                                id: 'id_'+referencia,
                                title:'Ayuda del sistema',
                                //config:node,
                                layout:'fit',
                                width:800,
                                maximized:true,
                                height:490,
                                minWidth :800,
                                minHeight:480,
                                iconCls: 'ayuda',
                                shim:false,
                                animCollapse:false,
                                showFlag : showFlag,
                                //closeAction : 'hide',
                                items:[{
                                    xtype:'panel',
                                    border:false,
                                    html: '<iframe id=iframeHelp' +
                                    ' style="border: none;" src= "'+url+'" width="100%" height="100%" seamless>' +
                                    '</iframe>',
                                    layout:'fit'

                                }],
                                constrainHeader:true

                            });
                            /**necessary**/

                           if(!showFlag){
                                //desk2.taskbar.showTaskButton
                                Ext.MessageBox.show({
                                    title: 'Espere por favor',
                                    msg: 'Cargado datos...',
                                    width:300,
                                    progress:true,
                                    closable:false,
                                    animEl: 'mb6'
                                });

                                // this hideous block creates the bogus progress
                                var f = function(v){
                                    return function(){
                                        if(v == 10){
                                            Ext.MessageBox.hide();
                                            __this.winIframe2.show();
                                        }else{
                                            var i = v/9;
                                            Ext.MessageBox.updateProgress(i, Math.round(100*i)+'% completado');
                                        }
                                    };
                                };
                                for(var i = 1; i < 13; i++){
                                    setTimeout(f(i), i*250);
                                }
                            }

                        }else{
                            if(!showFlag){
                                desk2.taskbar.tbPanel.hidenBtns.forEach(function(a,b){
                                    if(_exist.id == a.id ){
                                        desk2.taskbar.tbPanel.showButton(_exist);
                                    }
                                });

                                _exist.show();
                            }
                        }


                        /*window.setTimeout( function(){

                         }, 1500 );*/
                    }
                    if(version !='4'){

                        var response = Ext.util.JSON.decode(res.responseText);
                        url = document.location.origin+"/"+response.dir;

                        createWinHelp();
                        /* var winIframe = new Ext.Window({
                         html: '<iframe ' +
                         ' id="frameHelpView"  style="border: none;" src= "'+url+'" width="100%" height="100%" seamless></iframe>',
                         title:'Ayuda del sistema',
                         border:false,
                         constrain: true,
                         y:10,
                         style:'',
                         closable : true,
                         maximizable : true,
                         minimizable: true,
                         // id: 'ayuda_sistema',
                         width : '95%',
                         height : 550,
                         closeAction : 'destroy',
                         modal:true,
                         id:'winHelpContainer',
                         listeners: {
                         show: function (cmp) {
                         activateHelp = true;
                         cmp.getEl().setStyle("zIndex", 99999);
                         },
                         destroy: function (cmp) {
                         activateHelp = false;
                         console.log('destroy', activateHelp);
                         }

                         }
                         });

                         winIframe.show();
                         winIframe.setPosition(30,40);*/
                    }
                    else{
                        var response = Ext.JSON.decode(res.responseText);
                        url = document.location.origin+"/"+response.dir;

                        createWinHelp();
                        /*  var win = Ext.create('Ext.window.Window',{
                         html: '<iframe ' +
                         ' id="frameHelpView"  style="border: none;" src="'+url+'" width="100%" height="100%" seamless></iframe>',
                         title:'Ayuda del sistema',
                         border:false,
                         constrain: true,
                         y:10,
                         style:'',
                         closable : true,
                         // id: 'ayuda_sistema',
                         maximizable : true,
                         width : '95%',
                         height : 550,
                         closeAction : 'destroy',
                         modal:true,
                         style:'z-index:50000;',
                         id:'winHelpContainer',
                         listeners: {
                         hide: function (cmp) {
                         activateHelp = false;

                         },
                         destroy: function (cmp) {
                         activateHelp = false;
                         },
                         show: function (cmp) {
                         activateHelp = true;

                         },
                         afterlayout: function (cmp) {
                         activateHelp = true;

                         }
                         }
                         });
                         win.show(true);*/
                    }
                }
            });

        }
    }

};
var acercaDe = new function(){
    Ext.QuickTips.init();
    activateAcercade = false;
    return {
        show:function(uri,version){
            Ext.Ajax.request({
                url : '/portal/index.php/portal/getacercade',
                params : {
                    uri : uri
                },
                success : function(res) {
                    var config={
                        layout : 'absolute',
                        closable : true,
                        maximizable : false,
                        modal: true,
                        width : 500,
                        height : 500,
                        id:'acercade_sistema',
                        closeAction : 'destroy',
                        bodyStyle:'background-color:white;',
                        autoHeight: true,
                        y:'10%',
                        shadow : false,
                        constrain : true,
                        listeners:{
                            hide: function(cmp){
                                activateAcercade = false;
                            },
                            show: function (cmp) {
                                activateAcercade = true;
                            },
                            destroy: function(){
                                activateAcercade = false;
                            }
                        }
                    };

                    if(version=='4'){
                        this.valor = Ext.JSON.decode(res.responseText);
                        if(this.valor.code !=6){
                            this.win = Ext.create('Ext.window.Window',{

                                layout:'absolute',
                                border:false,
                                y:10,
                                bodyStyle:'background-color:white;',
                                closable : true,
                                maximizable : true,
                                width : 500,
                                id: 'acercade_sistema',
                                height : 480,
                                closeAction : 'hide',
                                modal:true,
                                style:'z-index:50000;',
                                constrain : true,
                                listeners: {
                                    hide: function (cmp) {
                                        activateAcercade = false;
                                    },
                                    show: function (cmp) {
                                        activateAcercade = true;
                                    },
                                    destroy: function(){
                                        activateAcercade = false;
                                    }
                                }
                                //autoHeight: true
                                // shadow : false
                            }).show();

                        }
                        else{
                            mostrarMensaje(6,'No existe la información del sistema.');
                        }
                    }else{
                        this.valor = Ext.util.JSON.decode(res.responseText);
                        if(this.valor.code !=6){
                            this.win = new Ext.Window(config);}
                        else{
                            mostrarMensaje(6,'No existe la información del sistema.');
                        }
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
                    if(this.win ){
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
                            '<h3>Descripción:</h3>',//------------------Desarrollado------------ -----
                            '<label >{descripcion}</label>',//------------------Desarrollado------------ -----
                            '<h3>Compuesto por:</h3>',//------------------Dependencias------------
                            '<ul>',
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
                                logoContain: function(logo){
                                    return (logo != "")?true:false;
                                }}
                        );
                        this.win.setTitle('Acerca de '+this.valor.nombre);
                        this.win.show();
                        tpl.overwrite(this.win.body, this.valor);
                    }}
            });
        }
    }
};
