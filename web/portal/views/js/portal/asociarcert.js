var perfil = window.parent.UCID.portal.perfil;
var perfilAsociarCertificado = new Object();
function cargarEtiquetasAsociarCertificado(vistaCU, fn) {
    Ext.Ajax.request({
        url: 'cargaretiquetas',
        method: 'POST',
        params: {
            vista: vistaCU
        },
        callback: function (options, success, response) {
            if (success) {
                perfilAsociarCertificado.etiquetas = Ext.decode(response.responseText);
                var codMsg = perfilAsociarCertificado.etiquetas.codMsg;
                if (!codMsg)
                    fn();
            }
        }
    });
}
cargarEtiquetasAsociarCertificado('asociarcertificado', function () {
    cargarInterfazAsociarCertificado();
});
////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();
////------------ Declarar variables ------------////
var winCert, fCert;
function cargarInterfazAsociarCertificado() {
    ////------------ Formulario de Datos de Sistema ------------////
    var tfusuario = new Ext.form.TextField({
        fieldLabel: perfilAsociarCertificado.etiquetas.lbUsuario,
        id: 'usuarioc',
        width: 250,
        readOnly: 'true'
    });
    var fileUpload = new Ext.form.FileUploadField({
        fieldLabel: perfilAsociarCertificado.etiquetas.lbpkcs,
        buttonText: "Buscar",
        id: 'uploadcert',
        allowBlank: false,
        blankText: perfilAsociarCertificado.etiquetas.blankText,
        invalidText: perfilAsociarCertificado.etiquetas.invalidTextp12,
        //width: '250',
        //height: '30',
        buttonCfg: {
            iconCls: 'icondistra-buscar'
        },
        listeners: {
            fileselected: function (t) {
                var file = t.value;
                var ext = file.split(['.'])[1];
                if (ext != 'p12')
                    t.markInvalid();
            }
        },
        width: '250',
        height: 30
    });
    var tfsecret = new Ext.form.TextField({
        fieldLabel: perfilAsociarCertificado.etiquetas.lbFraseSecreta,
        name: 'privatekeypwd',
        id: 'privatekeypwd',
        inputType: 'password',
        allowBlank: false,
        blankText: perfilAsociarCertificado.etiquetas.blankText,
        helpText: perfilAsociarCertificado.etiquetas.lbFraseSecreta,
        width: 250
    });
    fCert = new Ext.FormPanel({
        frame: true,
        width: 200,
        bodyStyle: 'padding:5px 5px 0',
        style: 'text-align:left',
        layout: 'column',
        items: [
            {
                columnWidth: 1,
                layout: 'form',
                xtype: 'panel',
                items:[
                    tfusuario
                ]
            },
            {
                columnWidth: 1,
                layout: 'form',
                xtype: 'panel',
                items:[
                    fileUpload
                ]
            },
            {
                columnWidth: 1,
                layout: 'form',
                xtype: 'panel',
                items:[
                    tfsecret
                ]
            }
        ]
    });
    winCert = new Ext.Window({
        width: 400,
        height: 150,
        renderTo : 'x-desktop',
        constrain : true,
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        title: perfilAsociarCertificado.etiquetas.lbBtnAsociarCert,
        resizable: false,
        buttons: [
            {
                //icon: perfil.dirImg + 'cancelar.png',
                //iconCls: 'btn',
                iconCls: 'cancelar',
                text: perfilAsociarCertificado.etiquetas.lbBtnCancelar,
                tooltip: perfilAsociarCertificado.etiquetas.lbBtnCancelarTip,
                handler: function () {
                    winCert.hide();
                    Ext.getCmp('usuarioc').setValue(perfil.usuario);
                }
            },
            {
                iconCls: 'aceptar',
                tooltip: perfilAsociarCertificado.etiquetas.lbBtnAsociarCert,
                handler: function () {
                    AsociarCertificado();
                },
                text: perfilAsociarCertificado.etiquetas.lbBtnAceptar,
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
                        AsociarCertificado();
                    }
                }
            },
            {
                key: 'x',
                alt: true,
                ctrl: false,
                shift: false,
                handler: function(k, e){
                    winCert.hide();
                    Ext.getCmp('usuarioc').setValue(perfil.usuario);
                }
            }
        ],
        listeners: {
            hide: function () {
                fCert.findById('privatekeypwd').reset();
                fCert.findById('uploadcert').setValue("");
            }
        }
    });
    winCert.add(fCert);
    winCert.doLayout();
    document.getElementById('uploadcert').style.width = "175px";
    Ext.getCmp('usuarioc').setValue(perfil.usuario);
    ////----------------------------------- Cambiar Password --------------------------------////
    function AsociarCertificado() {
        if (fCert.getForm().isValid()) {
            var f = document.getElementById("uploadcert-file").files[0];
            var reader = new FileReader();
            var cert, privatekey;
            reader.onload = function (ev) {
                try {
                    var file = ev.target.result.split(',')[1];
                    var p12der = forge.util.decode64(file);
                    var p12Asn1 = forge.asn1.fromDer(p12der);
                    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, fCert.findById('privatekeypwd').getValue());
                    var map = {};
                    for (var sci = 0; sci < p12.safeContents.length; ++sci) {
                        var safeContents = p12.safeContents[sci];

                        for (var sbi = 0; sbi < safeContents.safeBags.length; ++sbi) {
                            var safeBag = safeContents.safeBags[sbi];

                            var localKeyId = null;
                            if (safeBag.attributes.localKeyId) {
                                localKeyId = forge.util.bytesToHex(
                                    safeBag.attributes.localKeyId[0]);
                                if (!(localKeyId in map)) {
                                    map[localKeyId] = {
                                        privateKey: null,
                                        certChain: []
                                    };
                                }
                            } else {
                                continue;
                            }

                            // this bag has a private key
                            if (safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag) {
                                map[localKeyId].privateKey = safeBag.key;
                            } else if (safeBag.type === forge.pki.oids.certBag) {
                                // this bag has a certificate
                                map[localKeyId].certChain.push(safeBag.cert);
                            }
                        }
                    }

                    for (var localKeyId in map) {
                        var entry = map[localKeyId];
                        if (entry.privateKey) {
                            privatekey = entry.privateKey;
                        }
                        if (entry.certChain.length > 0) {
                            var certChain = entry.certChain;
                            for (var i = 0; i < certChain.length; ++i) {
                                cert = forge.pki.certificateToPem(certChain[i]);
                            }

                            var chainVerified = false;
                            try {
                                chainVerified = forge.pki.verifyCertificateChain(caStore, certChain);
                            } catch (ex) {
                                chainVerified = ex;
                            }
                        }
                    }
                    Ext.Ajax.request({
                        url: 'asociarcertificado',
                        method: 'POST',
                        waitMsg: 'Asociando certificado al usuario...',
                        params: {
                            cert: cert
                        },
                        callback: function (option, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.success) {
                                mostrarMensaje(7, responseData.msg);
                                winCert.hide();
                            } else {
                                mostrarMensaje(6, responseData.msg);
                            }
                        }
                    });
                } catch (err) {
                    if (err.message == 'PKCS#12 MAC could not be verified. Invalid password?') {
                        mostrarMensaje(6,'Contrase&ntilde;a incorrecta.');
                        fCert.findById('privatekeypwd').reset();
                    }
                }
            };
            reader.readAsDataURL(f);
        } else
            mostrarMensaje(6, perfilAsociarCertificado.etiquetas.lbMsgErrorEnCamops);
    }
}