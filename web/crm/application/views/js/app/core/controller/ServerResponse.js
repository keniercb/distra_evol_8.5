Ext.define('CRM.core.controller.ServerResponse', {
    extend: 'Ext.app.Controller',

    init: function () {
        var me = this;

        Ext.Ajax.on({
            requestexception: function (conn, response, options, eOpts) {
                this.etiquetas = LangMgr.getLang(me);

                me.showErrorRequest(response);

                me.hideMask();
            },
            requestcomplete: function (conn, response, options, eOpts) {
                var responseCfg = options.params ? options.params.responseCfg : options.scope && options.scope.params ? options.scope.params.responseCfg : undefined,
                    activeModule = ModuleMgr.getActiveModule(),
                    module = activeModule ? activeModule.id : activeModule;

                me.etiquetas = LangMgr.getLang(module || me);

                if (response.responseText) {
                    var resp = Ext.decode(response.responseText);
                    if (resp.codMsg == 4) {
                        mostrarMensaje(4, resp.mensaje, null, me.etiquetas.titleError, resp.detalles);
                    } else if (responseCfg && typeof responseCfg == 'object') {
                        me.showMessageCfg(resp, responseCfg, options);
                    } else if (resp.success == true && resp.msg) {
                        mostrarMensaje(1, resp.msg, null, me.etiquetas.titleInfo);
                    } else if ((resp.success == false || resp.failure == true ) && resp.msg) {
                        mostrarMensaje(6, resp.msg, null, me.etiquetas.titleError);
                    } else if (resp.codMsg == 3) {
                        mostrarMensaje(6, resp.mensaje, null, me.etiquetas.titleError);
                    } else if (resp.expirate) {
                        me.resetSesion();
                    }
                } else {
                    me.showErrorRequest(response);
                }

                me.hideMask();
            }
        });
    },
    /**
     * Metodo encargado de mostrar un mensaje despues de toda peticion al servidor,
     * para ello se debe haber enviado entre los params de la peticion el objeto
     * responseCfg con los siguientes atributos: action (load,add,edit,save,del), gen (f,m),
     * concept (nombre del concepto que se acaba de eliminar), count (cantidad de elementos,
     * determina si el mensaje se muestra en singular o plural).
     * For example:
     *
     * Ext.Ajax.request({
     *       scope: this,
     *       params: {
     *          responseCfg:{
     *              action: 'del',
     *              gen: 'f',
     *              concept: 'profomas',
     *              count:2
     *          }
     *       },
     *       url: 'file.php',
     *   });
     * */
    showMessageCfg: function (response, responseCfg, options) {
        var me = this,
            action = responseCfg.action,
            gen = responseCfg.gen || 'm',
            concept = responseCfg.concept.toLowerCase() || 'elements',
            count = responseCfg.count || 1,
            msg = "",
            problem = "",
            code = 1,
            countFilter = 0,
            showMsg = false;

        if (action == "add" || action == "edit") {
            if (action == "add") {
                msg = this.etiquetas.msgAddSuccess;
            } else {
                msg = this.etiquetas.msgModSuccess;
            }
            if (response.success) {
                msg = msg.getSingular(gen).get(concept);
                code = 1;
                showMsg = true;
            } else {
                if (response.code == 23505) {
                    var re = /\((\w+)\)/g,
                        str = response.msg,
                        match = re.exec(str),
                        atributo = this.etiquetas['lb' + match[1]] || match[1],
                        atributo = atributo.toLowerCase(),
                        prond = this.etiquetas['prond' + match[1]] || '(este)';
                    msg = this.etiquetas.msgAttrExist;
                    msg = msg.getSingular(gen).get(concept).replace(/<#atributo#>/g, atributo);
                    msg = msg.replace(/<#prond#>/g, prond);
                    code = 1;
                    showMsg = true;
                } else {
                    msg = this.etiquetas.msgAddFail;
                    problem = this.etiquetas[response.msg] || response.msg;
                    code = 6;
                    msg = msg.getSingular(gen).get(concept).replace(/<#problema#>/g, problem);
                    showMsg = true;
                }
            }
        } else if (action == "save") {
            msg = this.etiquetas.msgSaveSuccess;
            if(response.success){
                if (count > 1) {
                    msg = msg.getPlural(gen).get(concept);
                } else {
                    msg = msg.getSingular(gen).get(concept);
                }
                showMsg = true;
            }
        } else if (action == "del") {
            msg = this.etiquetas.msgDelSuccess;
            if (response.success) {
                code = 1;
                showMsg = true;
                if (count > 1) {
                    msg = msg.getPlural(gen).get(concept);
                } else {
                    msg = msg.getSingular(gen).get(concept);
                }
            } else {
                if (response.code == 23503) {
                    msg = this.etiquetas.msgDelInUse;
                    msg = msg.getSingular(gen).get(concept);
                    code = 1;
                    showMsg = true;
                } else {
                    msg = this.etiquetas.msgDelFail;
                    problem = this.etiquetas[response.msg] || response.msg;
                    code = 6;
                    showMsg = true;
                    if (count > 1) {
                        msg = msg.getPlural(gen).get(concept).replace(/<#problema#>/g, problem);
                    } else {
                        msg = msg.getSingular(gen).get(concept).replace(/<#problema#>/g, problem);
                    }
                }
            }
        } else if (action == "load") {
            if (response.count == 0) {
                msg = me.etiquetas.msgNoDataLoaded;
                countFilter = me.countFilters(options.params);
                code = 1;
                if (countFilter == 0) {
                    showMsg = true;
                } else {
                    msg = me.etiquetas.msgSearchNoMatches;
                    showMsg = true;
                    if (countFilter == 1) {
                        msg = msg.getSingular().get();
                    } else {
                        msg = msg.getPlural().get();
                    }
                }
            }
        }
        if (showMsg) {
            mostrarMensaje(code, msg);
        }
    },
    countFilters: function (params) {
        var count = 0;
        for (k in params) {
            if (k.indexOf('filter') != -1 && k.indexOf('field') != -1) {
                count++;
            }
            if (k == 'filter' || k == 'filters') {
                if (Ext.isArray(params[k])) {
                    count = params[k].length;
                    break;
                } else if (typeof params[k] == 'object') {
                    count = 0;
                    for (j in params[k]) {
                        count++;
                    }
                    break;
                }
            }
        }
        return count;
    },
    resetSesion: function () {
        window.parent.location.reload();
    },
    showErrorRequest: function (response) {
        var me = this;
        if (Ext.Ajax.isLoading()) {
            Ext.Ajax.abortAll();
        }

        //peticion abortada
        if (response.status == -1) {
            return;
        }

        //caducó la sesión
        if (response.status == 401) {
            mostrarMensaje(6, me.etiquetas.msgSesionExpired, null, me.etiquetas.titleError);
            me.resetSesion();
        } else {
            mostrarMensaje(6, me.etiquetas.msgNoAnswer, null, me.etiquetas.titleError);
        }
    },
    hideMask:function(){

        Ext.getBody().unmask();

        //se comprueba que el Messabox que se esta mostrando es
        // de tipo wait y se oculta.
        var msgWait = Ext.MessageBox.cfg && Ext.MessageBox.cfg.wait;

        if (msgWait && Ext.MessageBox.isVisible()) {
            Ext.MessageBox.hide();
        }
    }
});
