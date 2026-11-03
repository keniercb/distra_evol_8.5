Ext.custom = function () {

    // 1 Msg Ok
    // 2 Msg confirmacion
    // 3 Msg notificacion
    // 4 Msg Excepcion
    // 5 Msg fijo notificacion
    // 6 Msg error
    // 7 Msg Ok
    // 8 Msg warning

    return {
        currentzindex: 100000,
        msg: function (title, msg, cod) {
            var div, ididv, title = title || 'Informaci&oacuten';
            if (cod == 1 || cod == 7) {
                ididv = "msg-div";
                div = '<div class="msg"><div id="imgOk"></div><div onclick="this.parentNode.remove()" class="closePopup"></div><h3>' + title + '</h3><p>' + msg + '</p></div>';
            } else if (cod == 8) {
                ididv = "msg-warning";
                div = '<div class="msg"><div id="imgWarning"></div><div onclick="this.parentNode.remove()" class="closePopup"></div><h3>' + title + '</h3><p>' + msg + '</p></div>';
            } else if (cod == 6) {
                ididv = "msg-error";
                div = '<div class="msg"><div id="imgError"></div><div onclick="this.parentNode.remove()" class="closePopup"></div><h3>' + title + '</h3><p>' + msg + '</p></div>';
            } else if (cod == 3) {
                title='Notificaci&oacute;n';
                ididv = "msg-noti";
                div = '<div class="msg"><div id="imgNoti"></div><div onclick="this.parentNode.remove()" class="closePopup"></div><h3>' + title + '</h3><p>' + msg + '</p></div>';
            }

            var msgCt = Ext.DomHelper.insertFirst(document.body, {id: ididv}, true),
                msg = Ext.DomHelper.append(msgCt, div, true);

            this.currentzindex++;
            msg.slideIn('t').pause(6000).ghost("t", {remove: true});
            document.getElementById(ididv).style.zIndex = this.currentzindex;
        },
        msgFijo: function(title, msg){
            title=title || 'Notificaci&oacute;n';
            ididv = "msg-noti";
            div = '<div class="msg"><div id="imgNoti"></div><h3>' + title + '</h3><p>' + msg + '</p></div>';
            var msgCt = Ext.DomHelper.insertFirst(document.body, {id: ididv}, true),
                msg = Ext.DomHelper.append(msgCt, div, true);
            this.currentzindex++;
            document.getElementById(ididv).style.zIndex = this.currentzindex;
            return msg;
        },

        msgExc: function (title, msg, detalle) {

            Ext.create('Ext.Window', {
                title: title || ' Error ',
                modal: true,
                width: 560,
                minWidth: 500,
                closeAction: 'destroy',
                buttonAlign: 'center',
                layout: 'fit',
                constrain: true,
                defaults: {
                    bodyStyle: 'background:#DFE9F6; padding:5px;border:none'
                },
                items: {
                    layout: 'column',
                    defaults: {
                        bodyStyle: 'background:#DFE9F6; padding:5px;border:none'
                    },
                    items: [
                        {
                            columnWidth: .15,
                            height: 50,
                            html: '<div class="x-component x-box-item x-component-default x-dlg-icon x-message-box-error" ' +
                            'style="width: 100%; height: 100%; margin: 0px; right: auto; left: 0px; top: 0px;' +
                            'background-position:center"></div>'

                        },
                        {
                            columnWidth: .75,
                            autoHeight: true,
                            html: '<div>' + msg + '</div>'
                        },
                        {
                            columnWidth: 1,
                            items: {
                                xtype: 'fieldset',
                                title: ' Detalles',
                                autoWidth: true,
                                defaults: {
                                    bodyStyle: 'background:#DFE9F6;border:none;'
                                },
                                items: [
                                    {
                                        html: '<div id=' + Ext.id() + ' style="margin:5px 30px 5px 5px;' +
                                        ' text-align:justify;"><p>' + detalle + '</p></div>'
                                    }
                                ],
                                collapsible: true
                            }
                        }
                    ]
                },
                buttons: [
                    {
                        text: 'Aceptar',
                        iconCls: 'aceptar',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ],
                listeners: {
                    show: function () {
                        this.down('fieldset').collapse();
                    }
                }
            }).show();

        },

        msgConfirm: function (title, msg, fn) {
            if (fn == null || typeof (fn) != 'function') {
                return;
            }
            Ext.Msg.show({
                title: title || 'Confirmaci&oacuten',
                msg: msg,
                buttons: Ext.Msg.OKCANCEL,
                icon: Ext.MessageBox.QUESTION,
                fn: fn
            });
        },

        show: function (cod, msg, fn, title, detalle) {
            if (cod == 4) {
                Ext.custom.msgExc(title, msg, detalle);
            } else if (cod == 2) {
                Ext.custom.msgConfirm(title, msg, fn);
            } else if (cod == 5) {
                return Ext.custom.msgFijo(title, msg);
            } else {
                Ext.custom.msg(title, msg, cod);
            }
        },

        init: function () {
            if (!document.getElementById('style-custommessage')) {

                // var styleLeaf = document.createElement('style');
                // styleLeaf.id = 'style-custommessage';
                // styleLeaf.innerHTML = ".msg .x-box-mc {font-size: 9px;}" +
                // "#msg-error , #msg-div{position: absolute;left: 40%;top: 10px;width: 300px;}" +
                // "#msg-warning , #msg-div{position: absolute;left: 42%;top: 10px;width: 300px;}" +
                // 'div#imgError{background: url("/lib/UCID/images/error.png") no-repeat left;width: 40px;height: 40px;float: left;margin: -25px 0px 0px -25px;}' +
                // 'div#imgOk{background: url("/lib/UCID/images/ok.png") no-repeat left;width: 40px;height: 40px;float: left;margin: -25px 5px 0px -25px;}' +
                // 'div#imgWarning{background: url("/lib/UCID/images/warning-icon.png") no-repeat left;width: 40px;height: 40px;float: left;margin: -25px 5px 0px -25px;}' +
                // "#msg-error .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 1px solid #CC3333;margin-top: 10px;padding: 10px 15px;color: #990000;box-shadow: 2px 2px 10px #CC3333;}" +
                //
                // "#msg-warning .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 1px solid rgba(255, 224, 26, 0.82);margin-top: 10px;padding: 10px 15px;color: #7F5214;box-shadow: 2px 2px 10px rgba(181, 161, 17, 0.82);}" +
                // "#msg-error .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}" +
                //
                // "#msg-warning .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}" +
                // "#msg-div .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 1px solid #3764A0;margin-top: 10px;padding: 10px 15px;color: #04408c;box-shadow: 2px 2px 10px #3764A0;}" +
                // "#msg-div .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}" +
                // ".closePopup { background: url('/lib/UCID/images/close.png') no-repeat center;width: 9px;height: 9px;position: absolute;right:6px;top:15px;cursor:pointer;opacity:0.5}" +
                // ".closePopup:hover {opacity:1 }" +
                // "#msg-div .msg h3,#msg-error .msg h3,#msg-warning .msg h3 {text-align: left !important; }" +
                // "#msg-div .msg p,#msg-error .msg p,#msg-warning .msg p  {text-align: justify !important; }";
                // document.body.appendChild(styleLeaf);
            }
        }
    };
}();

Ext.onReady(Ext.custom.init, Ext.custom);

mostrarMensaje = Ext.custom.show;