Ext.override(Ext.TabPanel, {
    onItemTitleChanged: Ext.TabPanel.prototype.onItemTitleChanged.createSequence(function (item) {
        var el = this.getTabEl(item);
        if (el && item.iconCls) {
            Ext.fly(el).child('span.x-tab-strip-text', true).className = 'x-tab-strip-text' + ' ' + item.iconCls;
        }
    }),
    autoScrollTabs: function () {
        var count = this.items.length;
        var ow = this.header.dom.offsetWidth;
        var tw = this.header.dom.clientWidth;

        var wrap = this.stripWrap;
        var wd = wrap.dom;
        var cw = wd.offsetWidth;
        var pos = this.getScrollPos();
        var l = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

        if (!this.enableTabScroll || count < 1 || cw < 20) { // 20 to prevent display:none issues
            return;
        }
        if (l <= tw) {
            wd.scrollLeft = 0;
            wrap.setWidth(tw);
            if (this.scrolling) {
                this.scrolling = false;
                this.header.removeClass('x-tab-scrolling');
                this.scrollLeft.hide();
                this.scrollRight.hide();
                if (Ext.isAir) {
                    wd.style.marginLeft = '';
                    wd.style.marginRight = '';
                }
            }
        } else {
            if (!this.scrolling) {
                this.header.addClass('x-tab-scrolling');
                if (Ext.isAir) {
                    wd.style.marginLeft = '18px';
                    wd.style.marginRight = '18px';
                }
            }
            tw -= wrap.getMargins('lr');
            wrap.setWidth(tw > 20 ? tw : 20);
            if (!this.scrolling) {
                if (!this.scrollLeft) {
                    this.createScrollers();
                } else {
                    this.scrollLeft.show();
                    this.scrollRight.show();
                }
            }
            this.scrolling = true;
            if (pos > (l - tw)) { // ensure it stays within bounds
                wd.scrollLeft = l - tw;
            } else { // otherwise, make sure the active tab is still visible
                //this.scrollToTab(this.activeTab, false);
            }
            this.updateScrollButtons();
        }
    }
});

Ext.override(Ext.Panel, {
    addTool: function () {
        if (!this[this.toolTarget]) { // no where to render tools!
            return;
        }
        if (!this.toolTemplate) {
            // initialize the global tool template on first use
            var tt = new Ext.Template(
                '<div class="x-tool x-tool-{id}">&#160;</div>'
            );
            tt.disableFormats = true;
            tt.compile();
            Ext.Panel.prototype.toolTemplate = tt;
        }
        for (var i = 0, a = arguments, len = a.length; i < len; i++) {
            var tc = a[i], overCls = 'x-tool-' + tc.id + '-over';
            var t = this.toolTemplate.insertFirst((tc.align !== 'left') ? this[this.toolTarget] : this[this.toolTarget].child('span'), tc, true);
            t.handler = tc.handler;
            this.tools[tc.id] = t;
            t.enableDisplayMode('block');
            t.on('click', this.createToolHandler(t, tc, overCls, this));
            if (tc.on) {
                t.on(tc.on);
            }
            if (tc.hidden) {
                t.hide();
            }
            if (tc.qtip) {
                if (typeof tc.qtip == 'object') {
                    Ext.QuickTips.register(Ext.apply({
                        target: t.id
                    }, tc.qtip));
                } else {
                    t.dom.qtip = tc.qtip;
                }
            }
            t.addClassOnOver(overCls);
        }
    }
});

/**
 *@Author: Ing. Yoan Uria
 *@Name: Ext.Notification
 *@Tipo: Funcion
 *@Description: Mustra un mensaje de notificacion
 **/
Ext.Notification = function () {
    // private
    var msgCt;

    var elem = {};

    var id = null;

    // private
    var createBox = function (t, m, i) {

        /**
         * los valores de icon son:
         * info, question,warning y error
         * */
        var icon = 'data:image/jpg;base64,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';
        switch (i) {
            case 'info':
                //icon = 'icon-info.gif';
                icon = 'data:image/jpg;base64,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';
                break;
            case 'question':
//                icon = 'icon-question.gif';
                icon = 'data:image/jpg;base64,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';
                break;
            case 'warning':
                //icon = 'icon-warning.gif';
                icon = 'data:image/jpg;base64,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';
                break;
            case 'error':
//                icon = 'icon-error.gif';
                icon = 'data:image/jpg;base64,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';
                break;
            case 'ok':
                icon = 'data:image/jpg;base64,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';
                break;
        }
        /*  id = Ext.id();*/

        var tlp = '<div class="x-window x-window-plain x-window-dlg" >' +
            '<div class="x-window-tl">' +
            '<div class="x-window-tr">' +
            '<div class="x-window-tc">' +
            '<div id="' + id + '" class="x-window-header x-unselectable x-window-draggable" style="-moz-user-select: none;">' +
            '<span class="x-window-header-text">' + t + '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="x-window-bwrap">' +
            '<div class="x-window-ml">' +
            '<div class="x-window-mr">' +
            '<div class="x-window-mc">' +
            '<div  style="height: auto; background: none repeat scroll 0 0 #CBDDF3; border: 0 none;">' +
            '<div style="position: fixed; width:32px; height: 32px; background-image:url(' + icon + ')!important;background-repeat:no-repeat;"></div>' +
            '<div style="min-height: 40px; word-wrap: break-word; padding-left: 40px; padding-top: 10px;">' + m + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="x-window-bl">' +
            '<div class="x-window-br">' +
            '<div class="x-window-bc">' +
            '<div class="x-window-footer"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        /* return ['<div class="msg">',
         '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
         '<div class="x-box-ml">' +
         '<div class="x-box-mr">' +
         '<div class="x-box-mc">' +
         '<div style="position: fixed; width:32px; height: 32px; background-image:url(' + icon + ')!important;background-repeat:no-repeat;"></div>' +
         '<h3>' + t + '</h3>' +
         '<div style="word-wrap: break-word; padding-top: 10px;">' + m + '</div>' +
         //'<h3 style="background-image:url(' + icon + ')!important;background-repeat:no-repeat; word-wrap:break-word; height:32px; padding-left:40px;height:32;">', t, '</h3>',// m,
         '</div>' +
         '</div>' +
         '</div>',
         '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
         '</div>'].join('');*/
        id = Ext.id();
        switch (i) {
            case'error':
                style_class = 'imgError'
                break;
            case'warning':
                style_class = 'imgWarning'
                break;
            case 'ok':
                style_class = 'imgOk'
                break;
        }
        var tlp = '<div id=' + id + '>' +
            '<div class="msg"><div id="' + style_class + '"></div>' +
            '<div onclick="this.parentNode.remove()" id="closePopup">' +
            '</div><h3>' + t + '</h3><p>' + m + '</p></div></div>';
        return [tlp].join('');
    };

    return {
        //Muestra mensaje de notificacion

        /*var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
         //<h3>Informaci&oacute;n</h3>
         var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgOk"></div><h3>Informaci&oacute;n</h3><p>' + message + '</p></div>', true);
         msg.slideIn('t').pause(4).ghost("t", {remove: true});*/

        show: function (options) {
            // if (!msgCt) {
            //msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'notif-div'}, true);
            switch (options.icon) {
                case'error':
                    idStyle = 'msg-error';

                    break;
                case'warning':
                    idStyle = 'msg-warning';
                    break;
                case 'ok':
                    idStyle = 'msg-div';
                    break;
            }
            msgCt = Ext.DomHelper.insertFirst(document.body, {id: idStyle}, true);
            msgCt.setStyle({
                position: 'absolute',
                width: '350px',
                "z-index": 200000
            });
            // }
            msgCt.alignTo(document, 't-t');
            var idNotif = Ext.id();
            var d = Ext.DomHelper.append(msgCt, {html: '<div id="' + idNotif + '">' + createBox(options.title, options.msg, options.icon) + '</div>'}, true);
            var idTool = Ext.id();
            /* var tool = Ext.DomHelper.insertFirst(Ext.get(id), {html: '<div id="' + idTool + '" class="x-tool x-tool-close"></div>'}, true);*/
            //var tool = Ext.DomHelper.insertFirst(Ext.get(id), {html: '<div id="' + idTool + '" class="closePopup"></div>'}, true);


            /*  tool.on('click', function () {
             Ext.get(idNotif).ghost("t", {remove: true});
             }, this);
             Ext.get(idTool).addClassOnOver('x-tool-close-over');*/
            switch (options.icon) {
                case 'error':
                    //d.slideIn('t').pause(options.time ? options.time : 10).ghost("t", {remove: true});
                    d.slideIn('t').pause(options.time ? options.time : 6).ghost("t", {remove: true});
                    break;
                case 'warning':
                    // d.slideIn('t').pause(options.time ? options.time : 4).ghost("t", {remove: true});
                    d.slideIn('t').pause(options.time ? options.time : 4).ghost("t", {remove: true});
                    break;
                default :
                    //d.slideIn('t').pause(options.time ? options.time : options.waitTime || 1.5).ghost("t", {remove: true});
                    d.slideIn('t').pause(options.time ? options.time : options.waitTime || 3).ghost("t", {remove: true});
                    break;
            }
        }
    };
}();

Ext.ManagerNotification = function (config) {
    Ext.apply(this, config);
    this.addEvents(
        "newnotification",

        "init",

        "detroy",

        "end"
    );
    Ext.ManagerNotification.superclass.constructor.call(this);
    this.init();
}

Ext.extend(Ext.ManagerNotification, Ext.util.Observable, {
    notifications: [],

    showUniqueNotif: true,

    handlerNotif: false,

    Notification: Ext.emptyFn,

    addNotification: function (notifConfig) {
        this.notifications.push(notifConfig);
        this.fireEvent('newnotification', this, notifConfig);
    },

    init: function () {
        this.fireEvent('init', this);
    },

    listeners: {
        end: function () {
            this.handlerNotif = true;
        },
        newnotification: function () {
            if (this.handlerNotif) {
                this.manageNotifications();
            }
        }
    },

    manageNotifications: function () {
        var errores = 0;
        if (this.notifications.length > 0) {
            Ext.each(this.notifications, function (notif, i) {
                switch (notif.icon) {
                    case 'error':
                    case 'warning':
                        errores++;
                        this.showUniqueNotif = false;
                        Ext.Notification.show(notif);
                        this.notifications.splice(i, 1);
                        break;
                }
            }, this);

            if (this.showUniqueNotif) {
                switch (this.notifications.length) {
                    case 1:
                        Ext.Notification.show(this.notifications[0]);
                        this.notifications.splice(0, 1);
                        break;
                    default :
                        Ext.Notification.show({
                            title: 'Informaci&oacute;n',
                            msg: 'Los datos de la persona han sido gestionados satisfactoriamente.',
                            icon: 'ok'
                        });
                        this.notifications = [];
                        break;
                }
            }
            this.fireEvent('detroy', this);
        }

        Ext.getCmp(this.idEnv).fireEvent('change', errores);
    }
});

Ext.ControlNotificationPerEnvironment = function () {
    var env = {};
    return {
        newEnvironment: function (idEnv, cant) {
            if (!env[idEnv]) {
                env[idEnv] = new Ext.ManagerNotification({
                    idEnv: idEnv
                });
                env[idEnv].addListener('detroy', function () {
                    delete env[idEnv];
                });
            }
        },
        getNotificationFn: function (idEnv) {
            if (env[idEnv]) {
                return env[idEnv].Notification.createSequence(env[idEnv].addNotification, env[idEnv]);
            }
        },
        setEndNotification: function (idEnv) {
            if (env[idEnv]) {
                env[idEnv].fireEvent('end');
            }
        }
    };
}();

Ext.ns('Ext.components');
Ext.components.Connection = Ext.extend(Ext.data.Connection, {
    objRequest: {},
    idRequest: {},
    request: function (o, cmp) {
        if (this.fireEvent("beforerequest", this, o) !== false) {
            var p = o.params;

            function exist(val, array) {
                var p = false;
                Ext.each(array, function (obj, pos) {
                    if (obj.id == val) {
                        p = pos;
                        return false;
                    }
                });
                return p;
            }

            var tab = null;
            if (cmp) {
                tab = Ext.getCmp(cmp.idpadre);
                if (tab.accion == 'ADD') {
                    cmp.concept = cmp.concept || 'secundario';
                    if (cmp.concept == 'secundario') {
                        o.idTab = tab.id;
                        if (this.objRequest[tab.id]) {
                            var pos = exist(cmp.id, this.objRequest[tab.id]);
                            if (pos === false) {
                                this.objRequest[tab.id].push({
                                    id: cmp.id,
                                    request: o
                                })
                            } else {
                                this.objRequest[tab.id][pos].request = o;
                            }
                        } else {
                            this.objRequest[tab.id] = [
                                {
                                    id: cmp.id,
                                    request: o
                                }
                            ];
                        }
                        return false;
                    }
                } else {
                    p.idpersona = tab.persona.idpersona;
                }
            }

            if (typeof p == "function") {
                p = p.call(o.scope || window, o);
            }
            if (typeof p == "object") {
                p = Ext.urlEncode(p);
            }
            if (this.extraParams) {
                var extras = Ext.urlEncode(this.extraParams);
                p = p ? (p + '&' + extras) : extras;
            }

            var url = o.url || this.url;
            if (typeof url == 'function') {
                url = url.call(o.scope || window, o);
            }

            if (o.form) {
                var form = Ext.getDom(o.form);
                url = url || form.action;

                var enctype = form.getAttribute("enctype");
                if (o.isUpload || (enctype && enctype.toLowerCase() == 'multipart/form-data')) {
                    return this.doFormUpload(o, p, url);
                }
                var f = Ext.lib.Ajax.serializeForm(form);
                p = p ? (p + '&' + f) : f;
            }

            var hs = o.headers;
            if (this.defaultHeaders) {
                hs = Ext.apply(hs || {}, this.defaultHeaders);
                if (!o.headers) {
                    o.headers = hs;
                }
            }

            var cb = {
                success: this.handleResponse,
                failure: this.handleFailure,
                scope: this,
                argument: {options: o},
                timeout: o.timeout || this.timeout
            };

            var method = o.method || this.method || ((p || o.xmlData || o.jsonData) ? "POST" : "GET");

            if (method == 'GET' && (this.disableCaching && o.disableCaching !== false) || o.disableCaching === true) {
                var dcp = o.disableCachingParam || this.disableCachingParam;
                url += (url.indexOf('?') != -1 ? '&' : '?') + dcp + '=' + (new Date().getTime());
            }

            if (typeof o.autoAbort == 'boolean') { // options gets top priority
                if (o.autoAbort) {
                    this.abort();
                }
            } else if (this.autoAbort !== false) {
                this.abort();
            }
            if ((method == 'GET' || o.xmlData || o.jsonData) && p) {
                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
                p = '';
            }
            this.transId = Ext.lib.Ajax.request(method, url, cb, p, o);

            var idTab = tab ? tab.id || o.idTab : o.idTab;

            Ext.ControlNotificationPerEnvironment.newEnvironment(idTab);

            this.idRequest[this.transId.tId] = idTab;

            if (!PVD.maskControl[idTab + 'mask']) {
                PVD.mostrarMascara(idTab + 'mask', '', 'Enviando datos ...');
            }

            return this.transId;
        } else {
            Ext.callback(o.callback, o.scope, [o, null, null]);
            return null;
        }
    },
    handleResponse: function (response) {
        var idTab = null;

        if (this.idRequest[response.tId]) { //Chekeo el retorno de la peticionp
            idTab = this.idRequest[response.tId]; //Paso el id del entorno para posterior trabajo

            delete this.idRequest[response.tId]; //Elimino el id de peticion del arreglo de peticiones en transaccion

            if (this.objRequest[idTab] && this.checkErrorResponse(response, idTab)) { //Chekeo si existen peticiones retenidas para enviar por entorno
                var arrRequest = this.objRequest[idTab]; //Copio el arreglo para posterior trabajo y evitar peticiones dobles

                delete this.objRequest[idTab]; //Elimino el bloque de peticiones retenidas

                var dataResponse = Ext.decode(response.responseText); //Obtengo los datos de la peticion primario
                //Por cada peticion retenida se le agregan los datos de la peticion primaria y se ejectuan

                Ext.each(arrRequest, function (obj) {
                    Ext.apply(obj.request.params, dataResponse.datos);
                    this.request(obj.request);
                }, this)
            }
        }

        this.handlerMask(idTab); //Chekeo que ya no quedan peticiones pendientes para el entorno y oculto la mascara

        this.transId = false;

        var options = response.argument.options;

        response.argument = options ? options.argument : null;

        this.fireEvent("requestcomplete", this, response, options);

        Ext.callback(options.success, options.scope, [response, options, Ext.ControlNotificationPerEnvironment.getNotificationFn(idTab)]);

        Ext.callback(options.callback, options.scope, [options, true, response, Ext.ControlNotificationPerEnvironment.getNotificationFn(idTab)]);


    },
    handleFailure: function (response) {
        var idTab = null;

        if (this.idRequest[response.tId]) { //Chekeo el retorno de la peticion
            idTab = this.idRequest[response.tId]; //Paso el id del entorno para posterior trabajo

            delete this.idRequest[response.tId];
        }

        this.handlerMask(idTab, true); //Fuerzo a detener la mascara debido a un error durante la transaccion

        this.transId = false;

        var options = response.argument.options;

        response.argument = options ? options.argument : null;

        this.fireEvent("requestexception", this, response, options, e);

        Ext.callback(options.failure, options.scope, [response, options]);

        Ext.callback(options.callback, options.scope, [options, false, response]);
    },
    handlerMask: function (id, force) {

        if (force === true) {
            PVD.ocultarMascara(id + 'mask');
            Ext.ControlNotificationPerEnvironment.setEndNotification(id);
            this.fireEvent('closeWind');
            return;
        }
        if (this.getCantd(id) == 0) {
            PVD.ocultarMascara(id + 'mask');
            Ext.ControlNotificationPerEnvironment.setEndNotification(id);
            // this.fireEvent('closeWind');
        }
    },
    getCantd: function (v) {
        var cantd = 0;
        for (var p in this.idRequest) {
            if (this.idRequest[p] == v) {
                cantd++;
            }
        }
        return cantd;
    },
    checkErrorResponse: function (response, idTab) {
        var dataResponse = Ext.decode(response.responseText);
        switch (dataResponse.success) {
            case false:
                this.handlerMask(idTab, true);
                return false;
            default :
                return true;
        }
    }
});

Ext.sendAjax = new Ext.components.Connection({
    /**
     * @property  autoAbort
     * Whether a new request should abort any pending requests. (defaults to false)
     * @type Boolean
     */
    autoAbort: false,

    /**
     * Serialize the passed form into a url encoded string
     * @param {String/HTMLElement} form
     * @return {String}
     */
    serializeForm: function (form) {
        return Ext.lib.Ajax.serializeForm(form);
    }
});