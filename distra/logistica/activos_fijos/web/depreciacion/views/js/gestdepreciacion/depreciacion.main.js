var idioma = LOG.util.UIManager.apply(Ext.LOG.depreciacionIU.Idioma, LOG.util.Idioma);
var tabsGeneral = new LOG.util.UITabTemplate({
    idioma: idioma,
    formaVisualizacion: 'viewport'
});

var model = new Ext.LOG.Model({
    idioma: this.idioma,
    urlController: '/logistica/activos_fijos/depreciacion/index.php/gestdepreciacion/'
});

UCID.portal.cargarAcciones(window.frameElement.id, function () {
    model.cargarConfiguracion({
        url: 'getmetodosentidad'
    },
            function (datConf) {
                let _this = this;
                if (datConf.fechamostrar == 0)
                {
                    mostrarMensaje(2, idioma.lbMsgFechaContableInvalida);
                } else
                {
                    var record = datConf[0].metodos;

                    var cont = 0;

                    var listaAcciones = new LOG.util.List(acciones_reportes);

                    function grantedAction(idAccion) {
                        var existe = false;
                        listaAcciones.each(function (a) {
                            if (a['abreviatura'] == idAccion) {
                                existe = true;
                            }
                        });
                        return existe;
                    }

                    var btnDepreciarTodos = LOG.util.UIManager.createBtn({
                        iconCls: 'depreciacion',
                        text: idioma.lbBtnDepreciarTodos,
                        hidden: (!grantedAction('btnDepreciarTodos') && !grantedAction('CT')),
                        tooltip: idioma.lbTtBtnDepreciarTodos,
                        listeners: {
                            'click': function () {
                                var cero; //si existen dados en cero se pone 1;
                                var nulo;//si existen dados en null se pone 2
                                var mensaje = "";
                                var total = 0;


                                tabsGeneral.getListTemplate().each(function (tab) {
                                    if (tab.idmetodo === 8 || tab.idmetodo === 9) {
                                        return;}
                                    var dataTab = tab.storePrincipal.data.items;

                                    mensaje += '<b>' + tab.title + ':</b></br>';
                                    if (dataTab.length == 0) {
                                        mostrarMensaje(2, idioma.lbMsgErrorExistenMediosDepr);
                                    } else if (tab.idmetodo != 1 && tab.idmetodo != 2) {
                                        for (var i = 0; i < dataTab.length; i++) {
                                            if (dataTab[i].data.recursoconsumido == null) {
                                                nulo = 2;
                                            }
                                            if (dataTab[i].data.recursoconsumido == 0) {
                                                cero = 1;
                                            }
                                        }

                                        if (nulo == 2 && cero == 1)
                                            mensaje += idioma.lbMsgkmNullCero + '</br>';
                                        else if (nulo == 2)
                                            mensaje += idioma.lbMsgkmNull + '</br>';
                                        else if (cero = 1)
                                            mensaje += idioma.lbMsgkmCero + '</br>';
                                        mensaje += "Total a depreciar: <b>" + tab.getValorDepTotal() + "</b></br></br>";
                                        total += +tab.getValorDepTotal();

                                    } else {
                                        mensaje += "Total a depreciar: <b>" + tab.getValorDepTotal() + "</b></br></br>";
                                        total += +tab.getValorDepTotal();
                                    }

                                }, _this);
                                mensaje += "<b>Total a depreciar: " + total.toFixed(2) + '</b></br>';
                                mensaje += idioma.lbMsgkmconfirmacionDepre + '</br>';
                                mostrarMensaje(2, mensaje, function (btn) {
                                    if (btn == "ok") {
                                        var stores = [];
                                        for (var i = 0; i < tabsGeneral.getListTemplate().count(); i++) {
                                            stores.push(tabsGeneral.getListTemplate().getItem(i).getStorePrincipal());
                                        }
                                        model.depreciarTodos(stores);
                                    }
                                });
                            }
                        },
                        controlFn: function (b, _caller) {
                            if (_caller.grantedAction('CT') || _caller.grantedAction('btnDepreciarTodos')) {
                                b.setVisible(true);
                            } else
                                b.setVisible(false);
                        }
                    });

                    this.tfFechaDepreciacion = new Ext.form.TextField({
                        readOnly: true,
                        width: 150
                    });
                    this.tfFechaDepreciacion.setValue(datConf[0].periodo);
                    var btns = [];
                    btns.push(btnDepreciarTodos);

                    tabsGeneral.addToolbarButton(btnDepreciarTodos);
                    tabsGeneral.addToolbarButton('->');
                    tabsGeneral.addToolbarButton(new Ext.Toolbar.TextItem(idioma.lbFechaDep + ': '));
                    tabsGeneral.addToolbarButton(this.tfFechaDepreciacion);
                    tabsGeneral.addToolbarButton('-');
                    tabsGeneral.addToolbarButton(LOG.util.Prototipos.botonAyuda({
                        id: 'iddepreciarmediosent'
                    }));

                    if (record.length != 0) {

                        for (var i = 0; i < record.length; i++) {
                            this.panelDepre = new Ext.aft.panelDepre({
                                idioma: idioma,
                                title: record[i].descripcion,
                                idmetodo: record[i].idmetodo,
                                unidadmedida: record[i].unidadmedida,
                                btns: btns,
                                idComponent: cont
                            });
                            cont++;
                            tabsGeneral.addTabToTemplete(this.panelDepre);
                        }
                        this.panelCuentas = new Ext.aft.panelporCuentas({
                            idioma: idioma,
                            title: 'DEPRECIACIÓN POR CUENTAS',
                            idmetodo: 8,
                            unidadmedida: 'km',
                            btns: btns,
                            idComponent: cont
                        });
                        this.panelCC = new Ext.aft.panelCentrocosto({
                            idioma: idioma,
                            title: 'DEPRECIACIÓN POR CENTRO DE COSTO',
                            idmetodo: 9,
                            unidadmedida: 'km',
                            btns: btns,
                            idComponent: cont
                        });
                        tabsGeneral.addTabToTemplete(this.panelCuentas);
                        tabsGeneral.addTabToTemplete(this.panelCC);

                        tabsGeneral.on({
                            'tabchange': function (tabpanel, panel) {
                                tabsGeneral.getActiveTemplate().getStorePrincipal().initBaseParams.idmetodo = tabsGeneral.getActiveTemplate().idmetodo;
                            }
                        });

                        tabsGeneral.init();
                        tabsGeneral.view();
                    } else {
                        mostrarMensaje(2, idioma.lbMsgIdMetodoEnCero);
                    }
                }
            });
});