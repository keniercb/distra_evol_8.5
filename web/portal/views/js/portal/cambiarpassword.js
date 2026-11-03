var perfil = window.parent.UCID.portal.perfil;
var perfilPass = new Object();
function cargarEtiquetasPass(vistaCU, fn) {
    Ext.Ajax.request({
        url: 'cargaretiquetas',
        method: 'POST',
        params: {
            vista: vistaCU
        },
        callback: function (options, success, response) {
            if (success) {
                perfilPass.etiquetas = Ext.decode(response.responseText);
                var codMsg = perfilPass.etiquetas.codMsg;
                if (!codMsg)
                    fn();
            }
        }
    });
}
cargarEtiquetasPass('cambiarpassword', function () {
    cargarInterfazPass();
});
////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();
////------------ Declarar variables ------------////
var winPass, fpPass;
var TFContrasenna, TFConfContrasenna;
function cargarInterfazPass() {
    ////------------ TextField - Contrasenna------------////
    TFContrasenna = new Ext.form.TextField({
        fieldLabel: perfilPass.etiquetas.lbTitMsgContrasena,
        inputType: 'password',
        id: 'contrasenna',
        maxLength: 50,
        allowBlank: true,
        //hideLabel:true,
        blankText: 'Este campo es requerido.',
        name: 'contrasenna',
        anchor: '100%'
    });
    ////------------ TextField - Confirmar Contrasenna------------////
    TFConfContrasenna = new Ext.form.TextField({
        fieldLabel: perfilPass.etiquetas.lbTitMsgConfirmarcontrasena,
        id: 'contrasena',
        inputType: 'password',
        maxLength: 50,
        allowBlank: true,
        blankText: 'Este campo es requerido.',
        name: 'contrasena',
        anchor: '100%'
    });
    ////------------ Formulario de Datos de Sistema ------------////
    fpPass = new Ext.FormPanel({
        frame: true,
        width: 100,
        bodyStyle: 'padding:5px 5px 0',
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: 5,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: perfilPass.etiquetas.lbUsuario,
                                id: 'usuariop',
                                labelStyle: 'width:200px',
                                width: 200,
                                readOnly: 'true'
                            },
                            {
                                xtype: 'textfield',
                                inputType: 'password',
                                fieldLabel: perfilPass.etiquetas.lbTitMsgContrasenaanterior,
                                id: 'oldpass',
                                maxLength: 30,
                                labelStyle: 'width:200px',
                                allowBlank: false,
                                blankText: perfilPass.etiquetas.lbMsgEstecampoesrequerido,
                                width: 200
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: perfilPass.etiquetas.lbTitMsgContrasenanueva,
                                inputType: 'password',
                                blankText: perfilPass.etiquetas.lbMsgEstecampoesrequerido,
                                id: 'contrasenap',
                                maxLength: 30,
                                labelStyle: 'width:200px',
                                allowBlank: false,
                                width: 200
                            },
                            {
                                xtype: 'textfield',
                                inputType: 'password',
                                fieldLabel: perfilPass.etiquetas.lbTitMsgContrasenanuevaconfirmada,
                                blankText: perfilPass.etiquetas.lbMsgEstecampoesrequerido,
                                id: 'contrasennap',
                                maxLength: 30,
                                labelStyle: 'width:200px',
                                width: 200,
                                allowBlank: false
                            }
                        ]
                    }
                ]
            }
        ]
    });
    winPass = new Ext.Window({
        width: 450,
        height: 200,
        renderTo : 'x-desktop',
        constrain : true,
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        title: perfilPass.etiquetas.lbBtnCambiarpass,
        resizable: false,
        buttons: [
            {
                //icon: perfil.dirImg + 'cancelar.png',
                //iconCls: 'btn',
                iconCls: 'cancelar',
                text: perfilPass.etiquetas.lbBtnCancelar,
                tooltip: perfilPass.etiquetas.lbBtnCancelarTip,
                handler: function () {
                    winPass.hide();
                    Ext.getCmp('oldpass').reset();
                    Ext.getCmp('contrasenap').reset();
                    Ext.getCmp('contrasennap').reset();
                    Ext.getCmp('usuariop').setValue(perfil.usuario);
                }
            },
            {
                //icon: perfil.dirImg + 'aceptar.png',
                //iconCls: 'btn',
                iconCls: 'aceptar',
                tooltip: perfilPass.etiquetas.lbBtnAceptarTip,
                handler: function () {
                    cambiarpass();
                },
                text: perfilPass.etiquetas.lbBtnAceptar,
                id: 'portal_acept'
            }
        ],
        keys: [
            {
                key: 13,
                alt: false,
                ctrl: false,
                shift: false,
                handler: function(k, e){
                    if(!Ext.getCmp('portal_acept').disabled){
                        cambiarpass();
                    }
                }
            },
            {
                key: 'x',
                alt: true,
                ctrl: false,
                shift: false,
                handler: function(k, e){
                    winPass.hide();
                    Ext.getCmp('oldpass').reset();
                    Ext.getCmp('contrasenap').reset();
                    Ext.getCmp('contrasennap').reset();
                    Ext.getCmp('usuariop').setValue(perfil.usuario);
                }
            }
        ]
    });
    winPass.add(fpPass);
    winPass.doLayout();
    Ext.getCmp('oldpass').reset();
    Ext.getCmp('contrasenap').reset();
    Ext.getCmp('contrasennap').reset();
    Ext.getCmp('usuariop').setValue(perfil.usuario);
    ////----------------------------------- Cambiar Password --------------------------------////
    function cambiarpass() {
        if (fpPass.getForm().isValid()) {
            if (Ext.getCmp('contrasennap').getValue() == Ext.getCmp('contrasenap').getValue()) {
                Ext.Ajax.request({
                    url: 'nuevopassword',
                    method: 'POST',
                    waitMsg: 'Cambiando contrase&ntilde;a...',
                    params: {
                        contrasennap: encryptRSA(Ext.getCmp('contrasennap').getValue()),
                        contrasenap: encryptRSA(Ext.getCmp('contrasenap').getValue()),
                        oldpass: encryptRSA(Ext.getCmp('oldpass').getValue())
                    },
                    callback: function (option, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.success) {
                            mostrarMensaje(1, perfilPass.etiquetas.lbTitMsgContrasenaCorrecta);
                            Ext.getCmp('oldpass').reset();
                            Ext.getCmp('contrasenap').reset();
                            Ext.getCmp('contrasennap').reset();
                            winPass.hide();
                        } else
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    }
                });
            }
            else
                mostrarMensaje(3, perfilPass.etiquetas.lbTitMsgContrasenaIncorrecta);
        }
        else
            mostrarMensaje(3, perfilPass.etiquetas.lbMsgErrorEnCamops);
    }

    function encryptRSA(text) {
        var key = RSA.getPublicKey(document.getElementById('publicKey').value);
        return RSA.encrypt(text, key);
    }
}