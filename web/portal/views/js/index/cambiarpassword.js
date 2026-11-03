var perfilPass = new Object();
var usuario = document.getElementById('usuario').value;
function cargarEtiquetasPass(vistaCU, fn) {
    Ext.Ajax.request({
        url: 'index.php/index/cargaretiquetas',
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
                                maxlength: 30,
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
                                maxlength: 30,
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
                                maxlength: 30,
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
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        title: perfilPass.etiquetas.lbBtnCambiarpass,
        width: 450,
        height: 200,
        resizable: false,
        closable: false,
        buttons: [
            {
                iconCls: 'aceptar',
                handler: function () {
                    cambiarpass();
                },
                text: perfilPass.etiquetas.lbBtnAceptar
            }
        ]
    });
    winPass.add(fpPass);
    winPass.doLayout();
    Ext.getCmp('oldpass').reset();
    Ext.getCmp('contrasenap').reset();
    Ext.getCmp('contrasennap').reset();
    Ext.getCmp('usuariop').setValue(usuario);
    winPass.show();
    ////----------------------------------- Cambiar Password --------------------------------////
    function cambiarpass() {
        if (fpPass.getForm().isValid()) {
            if (Ext.getCmp('contrasennap').getValue() == Ext.getCmp('contrasenap').getValue()) {
                Ext.Ajax.request({
                    url: 'index.php/index/nuevopassword',
                    method: 'POST',
                    waitMsg: 'Cambiando contrase&ntilde;a...',
                    params: {
                        contrasennap: encryptRSA(Ext.getCmp('contrasennap').getValue()),
                        contrasenap: encryptRSA(Ext.getCmp('contrasenap').getValue()),
                        oldpass: encryptRSA(Ext.getCmp('oldpass').getValue())
                    },
                    callback: function (option, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.success)
                            document.location.reload();
                        else
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