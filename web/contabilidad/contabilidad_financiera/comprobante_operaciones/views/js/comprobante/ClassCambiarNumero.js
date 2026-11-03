Ext.namespace('Ext.ClassCambiarNumero');
Ext.ClassCambiarNumero = Ext.extend(Ext.Component, 
{
    numeroComprobanteNuevo : undefined,
    url : '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/comprobante/',
    perfil : window.parent.perfil,
    constructor : function(params)
    {
        Ext.ClassCambiarNumero.superclass.constructor.call(this, params);
        if(!document.getElementById('UICambiarNumero'))
            this.loadJs("/contabilidad/contabilidad_financiera/comprobante_operaciones/views/js/comprobante/UICambiarNumero", 'UICambiarNumero');
        var scope = this;
        Ext.Ajax.request({
            method : "POST", 
            url : this.url + "cargaretiquetas",
            callback : function(options, success, response)
            {
                scope.etiquetas = Ext.decode(response.responseText);
                scope.constructorBase(scope);
            }
        })
    }, 
    constructorBase : function(scope)
    {
        scope.wCambiarNumero = new Ext.UICambiarNumero(this);
        scope.wCambiarNumero.show(Ext.getBody(), function(){
            if(Ext.getCmp('msgbIniciando'))
                Ext.getCmp('msgbIniciando').hideBox();
            scope.initializeClass(scope);	
        });
        return scope;
    },
    loadJs : function(jsSrc, id)
    {
        if(jsSrc != null)
        {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc+".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    loadDataComponent : function(scope)
    {
        scope.tfNumeroAnterior.setValue(scope.numeroComprobante);
    },
    initializeClass : function(scope)
    {
        scope.initializeEvents(scope);
        scope.initializeFunctions(scope);
        scope.loadDataComponent(scope);
    },
    initializeEvents : function(scope)
    {
        this.addEvents('close');
        this.wCambiarNumero.on('close', function()
        {
            scope.fireEvent('close', scope.numeroComprobanteNuevo);
        })
		
        this.btnCancelarNumero.on('click', function(component)
        {
            function fAcepto(btn)
            {
                if(btn == 'ok')
                    scope.wCambiarNumero.close();
            }
            mostrarMensaje(2, scope.etiquetas.msgPreguntaCancelar, fAcepto);
        })
	
        this.tfNumeroNuevo.on('keypress', function (t, e){
            if(e.getKey() == e.ENTER)
                scope.btnAceptarNumero.fireEvent('click', scope.btnAceptarNumero);   
        })
                
        this.btnAceptarNumero.on('click', function(component)
        {
            function fAcepto(btn)
            {
                if(btn == 'ok')
                    scope.fAceptoCambiarNumero();
            }
            if(scope.fpCambiarNumero.getForm().isValid(true) && scope.numeroComprobante != scope.tfNumeroNuevo.getValue())
                mostrarMensaje(2, scope.etiquetas.msgPreguntaCambiarNumero+scope.tfNumeroNuevo.getValue()+'</b>?', fAcepto);
            else
                scope.tfNumeroNuevo.markInvalid();
        })
    },
    initializeFunctions : function(scope)
    {
        this.fAceptoCambiarNumero = function()
        {
            Ext.CONT.Componentes.MessageBox('msgbIniciando');
            Ext.Ajax.request({
                url : scope.url+'cambiarNumeroComprobante',		
                params: {
                    idComprobante : scope.idComprobante, 
                    numeroComprobante : scope.tfNumeroNuevo.getValue()
                },
                callback : function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                    if(responseData.flag == false || responseData.flag == 'false')
                    {
                        scope.numeroComprobanteNuevo = scope.tfNumeroNuevo.getValue();
                        scope.wCambiarNumero.close();
                    }else
                    {
                        if((responseData.flag == true || responseData.flag == 'true') && responseData.Usuario)
                            mostrarMensaje(1, scope.etiquetas.msgComprobanteBloqueado1 +responseData.Usuario+'</b>.');
                        else if((responseData.flag == true || responseData.flag == 'true') && responseData.Numero)
                        {
                            function fAcepto(btn)
                            {
                                scope.tfNumeroNuevo.focus(true);
                            }
                            //mostrarMensaje(1, scope.etiquetas.msgErrorExisteComprobanteNumero+responseData.Numero+'</b>.', fAcepto);
                            mostrarMensaje(1, scope.etiquetas.msgErrorExisteComprobanteNumeroNew, fAcepto);
                        }else
                            mostrarMensaje(1, scope.etiquetas.msgErrorCambiarComprobanteNumero);	
                    }		
                }
            })
			
        }
    }
})