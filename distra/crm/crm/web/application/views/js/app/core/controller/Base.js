/**
 * Esta clase provee un controlador base del cual heredan todos los restantes controladores de la plataforma.
 *
 * @author  Arq. Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @version 1.0 (Abril 20, 2016)
 */
Ext.define('CRM.core.controller.Base', {
    extend: 'Ext.app.Controller',

    //tiempo que permaneceran guardados los recursos permitidos en el modulo (valor por defecto: 30 segundos)
    verifyGrantedActionsTimeDelay: 30000,

    /**
     * Funcion que se encarga de contruir el url para una peticion hecha en el modulo
     * @author  Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     *
     * @param String action Nombre de la funcionalidad a la que se le envia la peticion
     * @param String [controller] Nombre del controlador al que se le envia la peticion (opcional)
     * @returns String Url real
     */
    buildUrl: function(action, controller){
        var params = {};
        params.action = action;

        if(controller){
            params.controller = action;
        }

        return UtilsFn.buildUrl(params, this);
    },

    /**
     * Funcion que devuelve el lenguaje del modulo.
     *
     * @return Ext.Class Lenguage del modulo.
     * @author  Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     */
    getLang: function(){
        return this.etiquetas = LangMgr.loadLanguage(this);
    },

    /**
     * Funcion equivalente a la que implementa el ucid-all para habilitar | desabilitar los botones que tienen asignados
     * un recurso.
     *
     * @param Object options Objeto que contiene todas las opciones para la busqueda. Puede tener las siguientes
     * propiedades:
     *      1. container: Ext.container.Container (opcional) Componente dentro del cual se realizara la busqueda a todos
     *      los niveles de componentes que herarquicamente son sus descendientes.
     *      2. selector: String (opcional) nombre del atributo personalizado por el cual se realizara la busqueda.
     *      3. callback: Function (opcional) Funcion a ejcutar despues de validar los recursos a los que tiene permiso
     *      4. args: Array (opcional) Parametros para la funcion de callback.
     *      5. scope: (opcional) Object Ambito en el que se ejecuta la validacion
     *
     * @returns Void
     * @author  Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     */

    validateGrantedActions: function(options){
        var params = options ? Ext.apply({}, options) : {};

        if(!options || !options.scope)
            params.scope = this;

        if(!this.application.securityData || !this.application.securityData.idfuncionalidad) {
            //console.log("ERROR: A valid idfuncionalidad from Security System is required!!!");
            return;
        }

        var id = this.application.securityData.idfuncionalidad;
        params.idfuncionalidad = id;
        this.checkGrantedActions(params);
    },
    //@private
    checkGrantedActions: function (options) {
        var me = this,
            scope = options.scope || me,
            idFuncionalidad = options.idfuncionalidad;
        scope.actions = {};
        scope.actions[idFuncionalidad] = {};

        if(scope.grantedActions){
            //si los recursos ya han sido cargados y el verifyGrantedActionsTimeDelay no ha expirado
            //entonces solo se activan lo componentes que respondan a esos recursos
            return me.getCmpRelatedResources(options);
        }

        //definiendo un metodo de acceso para los recursos permitidos
        if(!scope.getGrantedActions){
            scope.self.addMembers({
                getGrantedActions: function(){
                    return this.grantedActions || false;
                }
            })
        }

        var url = this.buildUrl('cargaracciones');
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: {
                idfuncionalidad: idFuncionalidad
            },
            callback: function (opts, success, response) {
                if(success){
                    scope.grantedActions = Ext.decode(response.responseText);

                    var codMsg = scope.grantedActions.codMsg;

                    if (!codMsg) {
                        me.getCmpRelatedResources(options);
                    }
                }
            }
        });

        //definiendo la tarea que elimina los recursos permitidos
        if(!scope.taskDeleteGrantedResources){
            scope.taskDeleteGrantedResources = Ext.TaskManager.start({
                run: function () {
                    if(this.grantedActions){
                        delete this.grantedActions;
                    }
                    /*console.info('INFO: uncaching granted actions task executed on ' + me.application.$namespace +
                        ' module scope')*/
                },
                interval: me.verifyGrantedActionsTimeDelay,
                scope: scope
            });
        }
    },

    //@private
    getCmpRelatedResources: function(options){
        var scope = options.scope || this,
            selector = options.selector || 'selector';

        for (i in scope.grantedActions) {
            var abreviatura = scope.grantedActions[i].abreviatura;
            if (i != 'remove') {
                var  cmptes = options.container && options.container.isXType('container') ?
                    Ext.ComponentQuery.query('*['+selector+'='+abreviatura+']', options.container) :
                    Ext.ComponentQuery.query('*['+selector+'='+abreviatura+']');

                scope.actions[options.idfuncionalidad][abreviatura] = true;

                if(cmptes.length){
                    this.enableArrayCmp(cmptes);
                }
            }
        }

        if(options.callback){
            Ext.callback(options.callback, scope, options.args);
        }
    },

    //@private
    enableArrayCmp: function(array){
        array.every(function (cmp) {
            if(cmp.hidden){
                cmp.show();
            }

            if (cmp.getXType() == 'datefield' || cmp.getXType() == 'textfield'){
                cmp.enable();
            }

            return true;
        })
    },

    /**
     * Funcion que detiene todas las tareas programadas
     */
    stopAllTask: function(){
        Ext.util.TaskManager.stopAll();
    },

    /**
     * Funcion que detiene la tarea que elimina los recursos permitidos cacheados
     */
    stopUncachingGrantedActions: function(){
        if(this.taskDeleteGrantedResources){
            Ext.util.TaskManager.stop(this.taskDeleteGrantedResources);
            delete this.taskDeleteGrantedResources;
        }
    },

    enviarCorreo: function(params){
        var me=this;
        // mostrarMensaje(3, 'Enviando correo... No cierre la aplicación por favor.')
        var msg=mostrarMensaje(5, 'Enviando correo... No cierre la aplicación por favor.')
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'enviarCorreo'}),
            params: params,
            callback: function (options, success, response) {
                msg.ghost("b", {remove: true});
                var respuesta = Ext.decode(response.responseText);
                if (respuesta.success) {
                    mostrarMensaje(1, 'Se ha enviado un correo de aviso satisfactoriamente.');
                }else{
                    if(respuesta.checkattachment){
                        me.comprobarAdjuntos();
                        me.windowadjuntos.setData(respuesta.contenido);
                    }else{
                        mostrarMensaje(4, 'No ha podido enviarse el correo de aviso.<br>' +
                            'Haga captura de los detalles del error y contacte al administrador.', null, 'Error', respuesta.mensaje);
                    }
                }
            }
        });

        // me.windowadjuntos.maskL=new Ext.LoadMask(me.windowadjuntos, {msg: 'Cargando adjuntos'});
        // me.windowadjuntos.maskL.show();
    },

    comprobarAdjuntos: function(contenido){
        var self=this;
        console.log('contenido:', contenido)
        Ext.define('Ext.ux.ComprobarAdjuntos', {
            extend: 'Ext.window.Window',
            alias: 'widget.comprobaradjuntoswindow',
            title: 'Comprobar adjuntos',
            width: 630,
            minWidth: 630,
            maxHeight: window.innerHeight*0.8,
            layout: 'anchor',
            constrain: true,
            modal: true,
            resizable: false,
            autoScroll: true,
            // closable: false,
            initComponent: function () {
                var me=this;
                me.contador=1;
                me.items=[{
                    xtype: 'form',
                    bodyStyle: 'background:#DFE9F6;',
                    items:[
                        {
                            xtype: 'toolbar',
                            items:[
                                '->',
                                {
                                    text: 'Adicionar',
                                    iconCls: 'adicionar',
                                    tooltip: 'Adicionar nuevo documento',
                                    handler: function(){
                                        console.log('nuevo', me.contador)
                                        me.down('form').add(me.camposAdjunto(
                                            {
                                                ruta: '', formato: '',
                                                nombre: ''
                                                // nombre: 'nuevo_'+me.contador
                                            }));
                                        me.contador=me.contador+1;
                                        me.down('form').fireEvent('validitychange', me.down('form'));
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'text',
                            itemId: 'mensage_sin_archivos',
                            hidden: true,
                            text: 'Se va a enviar el correo sin archivos adjuntos.',
                            margin: '10 0 10 10'
                        }
                    ],
                    listeners:{
                        validitychange: function(yo){
                            // console.log('validitychange', yo.hasInvalidField())
                            me.down('#aceptar').setDisabled(yo.hasInvalidField());
                            var cant=me.down('form').query('fieldset').length;
                            if(cant==0)me.down('#aceptar').setDisabled(false);
                            me.down('#mensage_sin_archivos').setVisible(cant==0);
                        }
                    }
                }];
                me.buttons=[
                    {
                        text: 'Enviar',
                        iconCls: 'aceptar',
                        itemId: 'aceptar',
                        tooltip: 'Proceder a enviar archivos adjuntos',
                        // disabled: true,
                        handler: function(){
                            me.contenido['sinComprobar']=true;
                            me.contenido['attachment']=me.obtenerAdjuntos();
                            console.log(me.contenido['destinatarios'], typeof me.contenido['destinatarios']=='string', me.contenido['destinatarios'][0]!='[');
                            if(typeof me.contenido['destinatarios']=='string' && me.contenido['destinatarios'][0]!='[')
                                me.contenido['destinatarios']=[me.contenido['destinatarios']];
                            console.log(me.contenido['destinatarios'], typeof me.contenido['destinatarios'], typeof me.contenido['destinatarios']=='array');
                            if(typeof me.contenido['destinatarios']=='object')
                                me.contenido['destinatarios']=Ext.encode(me.contenido['destinatarios']);
                            console.log('me.contenido params:', me.contenido);
                            // me.maskL=new Ext.LoadMask(me, {msg: 'Cargando adjuntos'});
                            // me.maskL.show();
                            me.hide();
                            var msg=mostrarMensaje(5, 'Enviando correo... No cierre la aplicación por favor.')
                            me.down('form').getForm().submit({
                                url: UtilsFn.buildUrl({action: 'enviarCorreo'}),
                                params: me.contenido,
                                success: function (form, action) {
                                    // if(me.maskL)me.maskL.hide();
                                    console.log(document.getElementById('msg-noti'))
                                    console.log(msg)
                                    msg.ghost("b", {remove: true});
                                    var respuesta = Ext.decode(action.response.responseText);
                                    console.log('response:', respuesta)
                                    if (respuesta.success) {
                                        me.close();
                                        self.windowadjuntos=null;
                                        me.destroy();
                                        mostrarMensaje(1, 'Se ha enviado un correo de aviso satisfactoriamente.');
                                    }else{
                                        me.show();
                                        if(respuesta.checkattachment){
                                            me.comprobarAdjuntos(respuesta.contenido);
                                        }else{
                                            mostrarMensaje(4, 'No ha podido enviarse el correo de aviso.<br>' +
                                                'Haga captura de los detalles del error y contacte al administrador.', null, 'Error', respuesta.mensaje);
                                        }
                                    }
                                }
                            });
                            // self.enviarCorreo(params);
                        }
                    }
                ];
                me.callParent();
            },
            setData: function(contenido){
                console.log('show attachment', contenido)
                if(self.windowadjuntos.maskL)self.windowadjuntos.maskL.hide();
                var win=this;
                win.contenido=contenido;
                if(!Ext.isArray(contenido['attachment']))contenido['attachment']=[contenido['attachment']];
                contenido['attachment'].forEach(function(x){
                    win.down('form').add(win.camposAdjunto(x));
                });
                // this.callParent();
            },
            obtenerAdjuntos: function(){
                var me=this,
                    fieldsets=me.down('form').query('fieldset');
                var datos=[];
                fieldsets.forEach(function(x){
                    // console.log(x.down('#archivo').name)
                    // console.log(x.down('#archivo').getValue())
                    // console.log(x.down('#archivo').getRawValue())
                    // console.log(x.down('#archivo').getSubmitData())
                    // console.log(x.down('#archivo').getSubmitValue())
                    datos.push({
                        'nombre': x.down('#nombre').getValue(),
                        'formato': x.down('#formato').getText().substr(1),
                        'ruta': x.datos['ruta']?x.datos['ruta']:'',
                        'name_real': x.down('#archivo').getValue().split('\\').pop()
                    });
                })
                return Ext.encode(datos);
            },
            camposAdjunto: function(attachment){
                var me=this,
                    formato=attachment['formato'],
                    nombre=attachment['nombre'];
                    return {
                        xtype: 'fieldset',
                        // title: 'Archivo '+me.contador,
                        itemId: 'fieldset_'+nombre,
                        margin: 5,
                        datos: attachment,
                        layout: {
                            type: 'hbox',
                            // align: 'stretch'
                        },
                        defaults: {
                            labelAlign: 'top',
                            margin: '5 2 10 2'
                        },
                        items:[
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Nombre',
                                name: 'nombre_'+nombre,
                                itemId: 'nombre',
                                allowBlank: false,
                                value: nombre,
                                flex: 1.2
                            },
                            {
                                xtype: 'button',
                                readOnly: true,
                                text: '.'+formato,
                                hidden: formato=='',
                                itemId: 'formato',
                                margin: '23 2 10 -2'
                            },
                            {
                                xtype: 'filefield',
                                fieldLabel: 'Archivo',
                                name: 'archivo_'+nombre,
                                itemId: 'archivo',
                                value: attachment['ruta'].split('/').pop(),
                                flex: 2,
                                rawValue: attachment['ruta'].split('/').pop(),
                                allowBlank: false,
                                // buttonText: '',
                                buttonConfig: {
                                    iconCls: 'icondistra-subirfichero icon-fileupload',
                                    // tooltip: 'Seleccionar archivo',
                                    text: '',
                                    margin: '0 0 0 -2'
                                },
                                // regex:/^.*\.(doc|docx|pdf|odt|jpg|jpeg|png|bmp)$/i,
                                // regexText:me.etiquetas.msgFormatoDocumento,
                                listeners:{
                                    change: function(yo, value){
                                        var formato='';
                                        if(value)
                                            formato='.'+value.split('.').pop();
                                        me.down('#fieldset_'+nombre).down('#formato').setText(formato);
                                        me.down('#fieldset_'+nombre).down('#formato').setVisible(formato!='');
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'Ver',
                                tooltip: 'Ver documento',
                                iconCls: 'detalles',
                                iconAlign: 'top',
                                disabled: attachment['ruta']=='',
                                handler: function(){
                                    window.open('/crm/application/index.php/main/mostrarDocumento?ruta='+
                                        attachment['ruta']+'&nombre='+attachment['nombre']+'&formato='+attachment['formato']);
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'Eliminar',
                                tooltip: 'Eliminar documento',
                                iconCls: 'eliminar',
                                iconAlign: 'top',
                                handler: function(){
                                    if(me.down('#fieldset_'+nombre).down('#archivo').getValue()) {
                                        var dialog = Ext.create('Ext.window.MessageBox', {
                                            buttonAlign: 'center',
                                            buttons: [
                                                {
                                                    text: 'Aceptar',
                                                    iconCls: 'aceptar',
                                                    handler: function () {
                                                        if (me.down('#fieldset_' + nombre).datos['ruta'] != '') {
                                                            Ext.Ajax.request({
                                                                url: UtilsFn.buildUrl({action: 'eliminarArchivo'}),
                                                                params: {ruta: me.down('#fieldset_' + nombre).datos['ruta']},
                                                                callback: function (options, success, response) {
                                                                    var respuesta = Ext.decode(response.responseText);
                                                                    if (respuesta.success) {
                                                                        console.info('Eliminado satisfactoriamente.');
                                                                    } else {
                                                                        console.info('Ocurrió un error eliminando el archivo.');
                                                                    }
                                                                }
                                                            });
                                                        }
                                                        me.down('form').remove(me.down('#fieldset_' + nombre));
                                                        me.down('form').fireEvent('validitychange', me.down('form'));
                                                        dialog.close();
                                                    }
                                                },
                                                {
                                                    text: 'Cancelar',
                                                    iconCls: 'cancelar',
                                                    handler: function () {
                                                        dialog.close();
                                                    }
                                                }
                                            ]
                                        });
                                        dialog.show({
                                            title: 'Confirmación',
                                            msg: '¿Está seguro que desea eliminar el archivo adjunto?',
                                            icon: Ext.MessageBox.QUESTION,
                                        });
                                    }else{
                                        me.down('form').remove(me.down('#fieldset_' + nombre));
                                        me.down('form').fireEvent('validitychange', me.down('form'));
                                    }
                                }
                            }
                        ]
                    }
            }
        })
        self.windowadjuntos=Ext.create('Ext.ux.ComprobarAdjuntos').show(contenido);
    }
});