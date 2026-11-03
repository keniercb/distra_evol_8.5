Ext.ns('Contabilidad.AsignarTipoCtaContable');
Contabilidad.AsignarTipoCtaContable.Controller = {
    /**
     *Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param view Vista del componente 
     * @param model Modelo de la vista del componente
     * @param controller Controller de la vista del componente
     */
    init: function(idioma, view, model, controller) {
        scope = this;
        view.btnAdicionarCtaOrden.on('click', function() {
            view.tipoCta = '8034';
            scope.AdicionarCta(perfil.etiquetas.lbAdicionarCtaOrden);
        });
        view.btnAdicionarCtaGasto.on('click', function() {
            view.tipoCta = '8032';
            scope.AdicionarCta(perfil.etiquetas.lbAdicionarCtaGasto);
        });
        view.btnAdicionarCtaIngreso.on('click', function() {
            view.tipoCta = '8031';
            scope.AdicionarCta(perfil.etiquetas.lbAdicionarCtaIngreso);
        });
        view.btnAdicionarCtaResultado.on('click', function() {
            view.tipoCta = '8033';
            scope.AdicionarCta(perfil.etiquetas.lbAdicionarCtaResultado);
        });
        view.sfBuscarCuentasB.on({
            specialkey: function(f, e) {
                if (e.getKey() == e.ENTER) {
                    view.sfBuscarCuentasB.onTrigger2Click();
                }
            }
        });
        view.btnCancelar.on('click', function() {
            view.tipoCta = '';
            view.winIncluir.hide();
            Ext.getCmp('btnAdicionarCtaIngreso').focus();
        });
        view.btnAceptar.on('click', function() {
            var tipoCta;
            if (view.tipoCta == '8034') {
                tipoCta = 'Orden';
            }
            if (view.tipoCta == '8033') {
                tipoCta = 'Resultado';
            }
            if (view.tipoCta == '8032') {
                tipoCta = 'Gastos';
            }
            if (view.tipoCta == '8031') {
                tipoCta = 'Ingresos';
            }
            if (Ext.Msg.getDialog() || Ext.Msg.isVisble()) {
                Ext.Msg.hide();
            }
            if (view.sm.getSelected()) {
                scope.AplicarTipoCuenta(view.tipoCta, view.ordender, view.ordenizq);
                view.winIncluir.hide();
            } else {
                mostrarMensaje(1, perfil.etiquetas.lbSeleccionarUnaFila.replace('<tipo>', tipoCta.toLowerCase()), function() {
                });
            }

        });

        view.sm.on({
            rowselect: function(selectioModel, rowIndex, record) {
                view.gpIncluircuenta.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function(selectioModel, rowIndex, record) {
                view.gpIncluircuenta.getView().removeRowClass(rowIndex, "negrita");
            }
        });
        view.btneliminarOrden.on('click', function() {
            view.tipoCta = '8034';
            scope.EliminarCta();
        });
        view.btneliminarGasto.on('click', function() {
            view.tipoCta = '8032';
            scope.EliminarCta();
        });
        view.btneliminarIngreso.on('click', function() {
            view.tipoCta = '8031';
            scope.EliminarCta();
        });
        view.btneliminarResultado.on('click', function() {
            view.tipoCta = '8033';
            scope.EliminarCta();
        });
        this.AdicionarCta = function(title) {
            var contMask = 0;
//            scope.MostrarMensaje(perfil.etiquetas.lbCargando);
            /*model.storeCargargrid.load({
                params: {
                    start: 0,
                    limit: 20,
                    tipoCta: view.tipoCta
                },
                callback: function() {
                    loadMask.hide();
                    if (model.storeCargargrid.getTotalCount() == 0)
                        mostrarMensaje(1, perfil.etiquetas.emptyMsg);
                }
            });*/
            view.winIncluir.show();
//            view.winIncluir.maximize();
            view.winIncluir.setTitle(title);
            model.storeCargargrid.removeAll();
            view.sfBuscarCuentasB.focus(false, 100);
            //view.sfBuscarCuentasB.setRawValue('');
            scope.fFindNodesContained('');
            view.sfBuscarCuentasB.setWidth(view.tbCuentas.el.getWidth() - 4);
        };
        view.sfBuscarCuentasB.onTrigger1Click = function() {
            if (this.hasSearch) {
                this.hasSearch = false;
                view.sfBuscarCuentasB.reset();
                view.sfBuscarCuentasB.setRawValue('');
                view.sfBuscarCuentasB.el.dom.value = '';
                this.el.dom.value = '';
                view.sfBuscarCuentasB.triggers[0].hide();
                if (view.sfBuscarCuentasB.getRawValue().length == 0) {
                    model.storeCargargrid.baseParams.filter = {};
                    scope.fLoadTreeLoader();
                }
            }
        }
        view.sfBuscarCuentasB.onTrigger2Click = function() {
            if (view.sfBuscarCuentasB.getRawValue().length < 1)
                view.sfBuscarCuentasB.onTrigger1Click();
            else {
                this.hasSearch = true;
                view.sfBuscarCuentasB.triggers[0].show();
                if (!scope.busyRequest)
                    scope.fFindNodesContained(view.sfBuscarCuentasB.getRawValue());
            }
        };
        this.fFindNodesContained = function(filter) {
            model.storeCargargrid.baseParams.filter = filter;
            scope.fLoadTreeLoader();
        };
        this.fLoadTreeLoader = function() {
//            scope.MostrarMensaje(perfil.etiquetas.lbCargando);
            model.storeCargargrid.load({
                callback: function() {
//                    loadMask.hide();
                    if (model.storeCargargrid.getTotalCount() == 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoSearch);
                        //scope.aqui va ..(view.gpIncluircuenta.body.dom, perfil.etiquetas.TitleInform, perfil.etiquetas.msgNoSearch, 1);
                    }
                }
            });
        };
        /** AplicarTipoCuenta
         * @description Adicionar tipo(s) de cta(s)
         * @param {int} tCta Tipo(s) de cuentas(s).
         */
        this.AplicarTipoCuenta = function(tCta) {
            if (view.sm.getSelected()) {
                Ext.Msg.wait(perfil.etiquetas.lbGuardando, perfil.etiquetas.lbEspere);
                var idComponente = '';
                var tipoCta;

                if (view.tipoCta == '8034') {
                    tipoCta = 'Orden';
                    idComponente = 'ctasOrden';
                }
                if (view.tipoCta == '8033') {
                    tipoCta = 'Resultado';
                    idComponente = 'ctasResultado';
                }
                if (view.tipoCta == '8032') {
                    tipoCta = 'Gastos';
                    idComponente = 'ctasGastos';
                }
                if (view.tipoCta == '8031') {
                    tipoCta = 'Ingresos';
                    idComponente = 'ctasIngresos';
                }
                Ext.Ajax.request({
                    url: 'modificarcuenta',
                    method: 'POST',
                    params: {
                        select: Ext.encode(scope.arrayrecord()),
                        valor: tCta
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (Ext.Msg.getDialog() || Ext.Msg.isVisble()) {
                            Ext.Msg.hide();
                        }
                        if (responseData.success) {
                            model.storeCargargrid.reload();
                            view.sm.clearSelections();

                            var msg = '';
                            if (view.tipoCta == '8034') {
                                msg = 'La(s) cuenta(s) de orden se ha(n) adicionado satisfactoriamente.';
                                Ext.getCmp('ctasOrden').fReload();
                            }
                            if (view.tipoCta == '8033') {
                                msg = 'La(s) cuenta(s) de resultado se ha(n) adicionado satisfactoriamente.';
                                Ext.getCmp('ctasResultado').fReload();
                            }
                            if (view.tipoCta == '8032') {
                                msg = 'La(s) cuenta(s) de gasto se ha(n) adicionado satisfactoriamente.';
                                Ext.getCmp('ctasGastos').fReload();
                            }
                            if (view.tipoCta == '8031') {
                                msg = 'La(s) cuenta(s) de ingreso se ha(n) adicionado satisfactoriamente.'
                                Ext.getCmp('ctasIngresos').fReload();
                            }
                            mostrarMensaje(1, msg);
                        }
                    }
                });
            } else {
                mostrarMensaje(1, perfil.etiquetas.lbSeleccionarUnaFila.replace('<tipo>', tipoCta.toLowerCase()));
            }
        };
        this.EliminarCta = function() {
            var idComponente = this.getIdTipoCta();
            var selections = Ext.getCmp(idComponente).fGetSelections();
            if (selections.length > 1) {
                mostrarMensaje(2, perfil.etiquetas.lbSeguroEliminarMany, scope.Eliminar);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbSeguroEliminar, scope.Eliminar);
            }
        };
        this.getIdTipoCta = function() {
            switch (view.tipoCta) {
                case '8031':
                    {
                        idCmpTipoCta = 'ctasIngresos';
                    }
                    break;
                case '8032':
                    {
                        idCmpTipoCta = 'ctasGastos';
                    }
                    break;
                case '8033':
                    {
                        idCmpTipoCta = 'ctasResultado';
                    }
                    break;
                case '8034':
                    {
                        idCmpTipoCta = 'ctasOrden';
                    }
                    break;
            }
            return idCmpTipoCta;
        };
        this.Eliminar = function(btnPresionado) {
            if (btnPresionado == 'ok') {
                var idComponente = '';
                Ext.Msg.wait(perfil.etiquetas.lbEliminando, perfil.etiquetas.lbEspere);
                if (view.tipoCta == '8034') {
                    idComponente = 'ctasOrden';
                    var selections = Ext.getCmp(idComponente).fGetSelections();
                    if (selections.length > 0) {
                        var idCtas = new Array()
                        for (var i = 0; i < selections.length; i++) {
                            idCtas[i] = (selections[i].attributes.idcuenta);
                        }
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.lbSeleccionarUnaCta, function() {
                        });
                    }
                }
                if (view.tipoCta == '8033') {
                    idComponente = 'ctasResultado';
                    var selections = Ext.getCmp(idComponente).fGetSelections();
                    if (selections.length > 0) {
                        var idCtas = new Array()
                        for (var i = 0; i < selections.length; i++) {
                            idCtas[i] = (selections[i].attributes.idcuenta);
                        }
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.lbSeleccionarUnaCta);
                    }
                }
                if (view.tipoCta == '8032') {
                    idComponente = 'ctasGastos';
                    var selections = Ext.getCmp(idComponente).fGetSelections();
                    if (selections.length > 0) {
                        var idCtas = new Array()
                        for (var i = 0; i < selections.length; i++) {
                            idCtas[i] = (selections[i].attributes.idcuenta);
                        }
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.lbSeleccionarUnaCta);
                    }
                }
                if (view.tipoCta == '8031') {
                    idComponente = 'ctasIngresos';
                    var selections = Ext.getCmp(idComponente).fGetSelections();
                    if (selections.length > 0) {
                        var idCtas = new Array()
                        for (var i = 0; i < selections.length; i++) {
                            idCtas[i] = (selections[i].attributes.idcuenta);
                        }
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.lbSeleccionarUnaCta, function() {
                        });
                    }
                }
                Ext.Ajax.request({
                    url: 'eliminarCta',
                    params: {
                        cta: Ext.encode(idCtas)
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        var ctasElim = new Array();
                        var ctaNoelim = new Array();
                        if (Ext.Msg.getDialog() || Ext.Msg.isVisble()) {
                            Ext.Msg.hide();
                        }
                        if (responseData.ctaNoEliminadas.length > 0) {
                            for (var j = 0; j < responseData.ctaNoEliminadas.length; j++)
                                ctaNoelim[j] = ' ' + responseData.ctaNoEliminadas[j];

                            if (responseData.ctaNoEliminadas.length == 1) {
                                mensaje = perfil.etiquetas.lbCtanoeliminada + '<b>' + ctaNoelim + '</b>' + perfil.etiquetas.lbCtanoeliminada1;
                            } else {
                                mensaje = perfil.etiquetas.lbCtanoeliminadas + '<b>' + ctaNoelim + '</b>' + perfil.etiquetas.lbCtanoeliminadas1;
                            }
                        }
                        if (responseData.ctaEliminadas.length > 0) {
                            for (var i = 0; i < responseData.ctaEliminadas.length; i++)
                                ctasElim[i] = ' ' + responseData.ctaEliminadas[i];
                            if (responseData.ctaEliminadas.length == 1) {
                                mensajeE = perfil.etiquetas.lbCtanoeliminada + '<b>' + ctasElim + '</b>' + perfil.etiquetas.lbCtanoeliminada2;
                            } else {
                                mensajeE = perfil.etiquetas.lbCtanoeliminadas + '<b>' + ctasElim + '</b>' + perfil.etiquetas.lbCtanoeliminadas2;
                            }

                            if (view.tipoCta == '8034') {
                                Ext.getCmp('ctasOrden').fReload();
                                Ext.getCmp('btneliminarOrden').disable();
                            }
                            if (view.tipoCta == '8033') {
                                Ext.getCmp('ctasResultado').fReload();
                                Ext.getCmp('btneliminarResultado').disable();
                            }
                            if (view.tipoCta == '8032') {
                                Ext.getCmp('ctasGastos').fReload();
                                Ext.getCmp('btneliminarGasto').disable();
                            }
                            if (view.tipoCta == '8031') {
                                Ext.getCmp('ctasIngresos').fReload();
                                Ext.getCmp('btneliminarIngreso').disable();
                            }
                        }
                        if (responseData.ctaEliminadas.length > 0 && responseData.ctaNoEliminadas.length > 0) {
                            scope.MsgPersonalizado({
                                title: perfil.etiquetas.lbtitleInfo,
                                buttons: Ext.Msg.OK,
                                msg: mensaje,
                                icon: Ext.Msg.INFO,
                                fn: function() {
//                                    scope.aqui va ..(Ext.getCmp(idComponente).tpCuentas.el.dom, perfil.etiquetas.lbTituloCtaEliminada, mensajeE, 1);
                                    mostrarMensaje(1, mensajeE, function() {
                                    });
                                }
                            });
                        } else if (responseData.ctaEliminadas.length > 0 && responseData.ctaNoEliminadas.length == 0) {
//                            scope.aqui va ..(Ext.getCmp(idComponente).tpCuentas.el.dom, perfil.etiquetas.lbTituloCtaEliminada, mensajeE, 1);
                            mostrarMensaje(1, mensajeE, function() {
                            });
                        } else if (responseData.ctaEliminadas.length == 0 && responseData.ctaNoEliminadas.length > 0) {
                            mostrarMensaje(1, mensaje, function() {
                            });
                        }
//                        loadMask.hide();

                    }
                });

            }
        };
        this.arrayrecord = function() {
            var records = new Array();
            var j = 0;
            for (var i = 0; i < model.storeCargargrid.getCount(); i++) {
                if (view.sm.isSelected(i)) {
                    records[j] = model.storeCargargrid.getAt(i).data;
                }
                j++;
            }
            return records;
        };
        /*this.aqui va .. = function(animateTarget, title, msg, icon) {
            this.notification = new Ext.Cont.Notification({
                animateTarget: animateTarget,
                fnc: Ext.emptyFn,
                iconbox: icon,
                iconCls: "icon-waiting",
                title: title,
                html: msg,
                hideDelay: 10000
            });
            this.notification.box();
        };*/
        this.MsgPersonalizado = function(options) {
            Ext.Msg.show({
                title: options.title,
                buttons: options.buttons,
                msg: options.msg,
                icon: options.icon,
                fn: options.fn
            });
        };
        this.MostrarMensaje = function(mensaje) {
            loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };
    }
};
