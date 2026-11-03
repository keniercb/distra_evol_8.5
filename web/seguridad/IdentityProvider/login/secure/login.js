/*
 autor		: Equipo de seguridad.
 versión		: 1.0
 Descripción	: Página de inicio de autenticación.
 */
var cert, privatekey;
var loadMask = function () {
    return {
        init: function () {
            // Creamos el cargador
            var loading = Ext.get('loading');
            var mask = Ext.get('loading-mask');
            mask.setOpacity(0.8);
            mask.shift(
                {
                    xy: loading.getXY(),
                    width: loading.getWidth(),
                    height: loading.getHeight(),
                    remove: true,
                    duration: 1,
                    opacity: 0.3,
                    easing: 'bounceOut',
                    callback: function () {
                        // Desvanece cuando la carga termina
                        loading.fadeOut({
                                duration: 0.2,
                                remove: true
                            }
                        );
                    }
                }
            );
        }
    };
}
    ();
Ext.onReady(loadMask.init, loadMask, true);
Ext.onReady(function () {
        Ext.QuickTips.init();
        var ta = new Ext.form.TextArea({
            width: 370,
            hideLabel: true
        });
        var plugin = new Ext.ux.plugins.VirtualKeyboard();
        plugin.on({
            expand: function (plugin) {
            },
            collapse: function (plugin) {
            },
            scope: this
        });

        // Usamos un FormPanel para crear la caja de Login
        var login = new Ext.FormPanel({
            id: 'login',
            iconCls:'icon-distra',
            labelWidth: 80,
            url: "../../IdentityProvider/response/index.php",
            frame: true,
            title: '<p align="center">Autenticaci&oacute;n</p>',
            bodyStyle: 'padding:5px 5px 0',
            width: 321,
            style: 'text-align:left',
            autoHeight: true,
            items: [
                {
                    xtype: 'hidden',
                    name: '74532eace3893560ce5bdc0ddb63d442',
                    value: 'Entrar',
                    id: 'id'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '<b>Usuario</b>',
                    id: 'usuario',
                    name: 'usuario',
                    allowBlank: false,
                    blankText: 'Este campo es obligatorio.',
                    user: true,
                    helpText: 'Nombre del usuario a autenticarse en el sistema Ejemplo:Ramon',
                    plugins: [plugin],
                    anchor: '90%',
                    keyboardConfig: {
                        language: 'Espa&ntilde;ol'
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '<b>Contrase&ntilde;a</b>',
                    name: 'contrasena',
                    id: 'contrasena',
                    inputType: 'password',
                    allowBlank: false,
                    blankText: 'Este campo es obligatorio.',
                    user: false,
                    helpText: 'Contrase&ntilde;a del usuario a autenticarse en el sistema',
                    plugins: [plugin, new Ext.ux.plugins.HelpIcon()],
                    anchor: '90%',
                    keyboardConfig: {
                        language: 'Espa&ntilde;ol'
                    }
                },
                {
                    html: '<div>' +
                        '<table style="margin-left: 85px; margin-bottom:1px;">' +
                        '<tbody>' +
                        '<tr>' +
                        '<td>' +
                        '<img src="../../../seguridad/captcha/' + document.getElementById('id_captcha').value + '.png" alt=""/>' +
                        '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>',
                    initComponent:function(){
                        if(document.getElementById('id_captcha').value==''){                        
                        this.hidden=true;
                    }
                }
                        
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '<b>C&oacute;digo</b>',
                    name: 'captcha',
                    id: 'captcha',
                    allowBlank: true,                    
                    user: false,
                    anchor: '90%',
                    keyboardConfig: {
                        language: 'Espa&ntilde;ol'
                    },initComponent:function(){
                        if(document.getElementById('id_captcha').value==''){
                        this.hideLabel=true;
                        this.hidden=true;
                        this.value='default';
                        this.allowBlank=false;
                        this.blankText='Este campo es obligatorio.';
                    }
                    }
                },
                {
                    xtype: 'panel',
                    id: 'authcertificadocontainer',
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: '<b>Autenticaci&oacute;n por certificado</b>',
                            id: 'authcertificado',
                            listeners: {
                                check: function (t) {
                                    if(t.checked == true) {
                                        Ext.getCmp('panelfupload').show();
                                        document.getElementById('uploadcert').style = "width:225px;";
                                        Ext.getCmp('usuario').removeClass('x-form-invalid');
                                        Ext.getCmp('contrasena').removeClass('x-form-invalid');
                                        Ext.getCmp('usuario').setDisabled(true);
                                        Ext.getCmp('contrasena').setDisabled(true);
                                        Ext.getCmp('privatekeypwd').setDisabled(false);
                                    }
                                    else {
                                        t.allowBlank = true;
                                        Ext.getCmp('uploadcert').setValue('');
                                        Ext.getCmp('uploadcert').removeClass('x-form-invalid');
                                        Ext.getCmp('panelfupload').hide();
                                        Ext.getCmp('usuario').setDisabled(false);
                                        Ext.getCmp('contrasena').setDisabled(false);
                                        Ext.getCmp('privatekeypwd').setDisabled(true);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'panel',
                            layout: 'column',
                            id: 'panelfupload',
                            style: {
                                'padding-top': '5px'
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    autoShow: true,
                                    forId: 'uploadcert',
                                    text: 'PKCS#12:'
                                },
                                {
                                    xtype: 'fileuploadfield',
                                    disabled: true,
                                    columnWidth: 1,
                                    id: 'uploadcert',
                                    allowBlank: false,
                                    blankText: 'Este campo es obligatorio.',
                                    invalidText: 'Este campo solo admite llaves p&uacute;blicas.',
                                    //buttonText: "Buscar",
                                    buttonOnly: true,
                                    labelAlign: 'top',
                                    width: '250',
                                    height: 30,
                                    buttonCfg:{
                                        iconCls: 'icondistra-buscar'
                                    },
                                    listeners: {
                                        fileselected: function (t) {
                                            var file = t.value;
                                            var ext = file.split(['.'])[1];
                                            if(ext != 'p12')
                                                t.markInvalid();
                                        }
                                    }
                                },
                                {
                                    xtype: 'label',
                                    autoShow: true,
                                    forId: 'privatekeypwd',
                                    text: 'Frase secreta:'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'privatekeypwd',
                                    id: 'privatekeypwd',
                                    inputType: 'password',
                                    disabled: true,
                                    allowBlank: true,
                                    user: false,
                                    helpText: 'Frase secreta',
                                    plugins: [plugin],
                                    width: 250,
                                    anchor: '90%',
                                    keyboardConfig: {
                                        language: 'Espa&ntilde;ol'
                                    }
                                }

                            ]
                        }
                    ]
                }
            ],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    scope: this,
                    stopEvent: true,
                    fn: function () {
                        autenticar();
                    }
                }
            ],
            listeners: {
                afterlayout: function () {
                    Ext.getCmp('usuario').focus(false, 10);
                    Ext.getCmp('panelfupload').hide();
                }
            },
            buttons: [
                {
                    text: 'Aceptar',
                    disabled: false,
                    formBind: true,
                    icon: '/seguridad/IdentityProvider/login/img/candado1.png',
                    iconCls: 'btn',
                    handler: function () {
                        autenticar();
                    }
                }
            ],
            bbar: new Ext.StatusBar({
                id: 'form-statusbar',
                defaultText: '',
                items: [
                    {
                        text: 'Mostrar teclado',
                        iconCls: 'ux-virtualkeyboard-icon',
                        tooltip: 'Mostrar el teclado al activar los campos',
                        listeners: {
                            'click': function () {
                                plugin.expand();
                            }
                        }
                    }
                ]
            })
        });

        login.render('dFormIndex');

        /*------------------------------------------------------------------------------*/
        /*--------------------Función para autenticar en el sistema---------------------*/
        function autenticar() {
            function encryptRSA(text) {
                var key = RSA.getPublicKey(document.getElementById('publicKey').value);
                return RSA.encrypt(text, key);
            }
            Ext.getBody().mask("Autenticando el usuario.");
            if(Ext.getCmp('authcertificado').checked == true) {
                var f = document.getElementById("uploadcert-file").files[0];
                var reader = new FileReader();
                reader.onload = function (ev) {
                    try {
                        var file = ev.target.result.split(',')[1];
                        var p12der = forge.util.decode64(file);
                        var p12Asn1 = forge.asn1.fromDer(p12der);
                        var pass = login.findById('privatekeypwd').getValue();
                        if(pass != "") {
                            var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, pass);
                        } else {
                            var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, '');
                        }
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
                            url: 'checkcertificate',
                            method: 'POST',
                            params: {
                                certificate: cert
                            },
                            callback: function (options, success, response) {
                                var data1 = Ext.util.JSON.decode(response.responseText);
                                if (!data1.error) {
                                    var s_cert = data1.s_cert;
                                    var realData = forge.util.decode64(data1.data);
                                    var decryptedData = privatekey.decrypt(realData);
                                    var s_certForge = forge.pki.publicKeyFromPem(s_cert);
                                    var encData = s_certForge.encrypt(decryptedData);
                                    var s_encData = forge.util.encode64(encData);
                                    Ext.Ajax.request({
                                        url: 'checkcertificate',
                                        method: 'POST',
                                        params: {
                                            data: s_encData
                                        },
                                        callback: function (options, success, response) {
                                            var data2 = Ext.util.JSON.decode(response.responseText);
                                            if(!data2.error){
                                                document.getElementById('input_log_north').value = data2.username;
                                                document.getElementById('input_log_south').value = encryptRSA(data2.password);
                                                document.getElementById('input_log_cert').value = 1;
                                                document.getElementById('captchabox').value = login.findById('captcha').getValue();
                                                document.getElementById('form1').submit();
                                            } else {
                                                handleError(data2);
                                            }
                                        }
                                    });
                                } else {
                                    handleError(data1);
                                }
                            }
                        });
                    } catch (err) {
                        console.log(err);
                        if (err.message == 'PKCS#12 MAC could not be verified. Invalid password?') {
                            handleError({data: "Frase secreta del certificado erronea."});
                        }
                    }
                };
                reader.readAsDataURL(f);
            } else {
                document.getElementById('input_log_north').value = login.findById('usuario').getValue();
                document.getElementById('input_log_south').value = encryptRSA(login.findById('contrasena').getValue());
                document.getElementById('captchabox').value = login.findById('captcha').getValue();
                document.getElementById('form1').submit();
            }
        }
        function handleError (data) {
            document.getElementsByClassName("error").item(0).firstChild.data = data.data;
            Ext.getCmp("authcertificado").setValue(false);
            Ext.getCmp("privatekeypwd").reset();
            Ext.getBody().unmask();
        }
    }
);