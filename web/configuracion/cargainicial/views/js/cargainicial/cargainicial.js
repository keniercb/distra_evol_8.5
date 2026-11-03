Ext.ns('Conf.CargaInicial');
Conf.CargaInicial.Modelo = {
    init: function() {
    }
};
Conf.CargaInicial.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Usuario (Tipo: Conf.CargaInicial.Model).
     */
    init: function(modelo, idioma) {
        var scope = this;
        scope.EjercicioComponent;
        scope.FechaComponent;
        scope.FormatosComponent;
        scope.nomMoneda;
        scope.cierre;
        scope.pasosConfiguracionCargaInicial = 4;
        scope.loadMaskCierre = new Ext.LoadMask(Ext.getBody(), {
            msg: perfil.etiquetas.lbFinalizando
        });

        scope.L = new Ext.layout.CardLayout({
            deferredRender: true
        });
        scope.cmbOrgano = new Ext.CmbOrganos({cargaInicial: false});
        scope.cmbOrgano.combo.on('select', function (cmb) {
            Conf.CargaInicial.Controlador.chequearApertura();
            cmb.setDisabled(true);
        });
        // scope.btnAyuda = new Ext.Button({
        //     id: 'btnAyudaMoneda',
        //     iconCls: 'ayuda',
        //     text: scope.etiquetas.lbAyuda,
        //     tooltip: scope.etiquetas.lbTtAyuda
        // });
        scope.card = new Ext.Panel({
            layout: scope.L,
            id: 'card-wizard-panel',
            activeItem: 0,
            defaults: {
                border: false
            },
            tbar:[
                '->',
                scope.cmbOrgano,
                // scope.btnAyuda
            ],
            bbar: [
                // scope.cmbOrgano,
                '->',
                {
                    id: 'card-prev',
                    iconCls: 'anterior',
                    text: perfil.etiquetas.lbBtnAnterior,
                    tooltip: perfil.etiquetas.lbTtAnterior,
                    disabled: true
                },
                '->',
                {
                    id: 'card-next',
                    iconCls: 'siguiente',
                    text: perfil.etiquetas.lbBtnSiguiente,
                    tooltip: perfil.etiquetas.lbTtSiguiente
                }
            ],
            items: [
                {
                    id: 'card-0',
                    style: 'text-align:center;margin:200px 0px 0px 0px',
                    html: perfil.etiquetas.lbBienvenida
                }
            ]
        });
        scope.pnlPeriodos = new Ext.Viewport({
            layout: 'fit',
            items: [scope.card]
        });
    }
};
Conf.CargaInicial.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Usuario (Tipo: Conf.CargaInicial.Vista)
     * @param modelo Modelo de la vista del componente Usuario (Tipo: Conf.CargaInicial.Modelo)
     */
    init: function(vista, modelo, idioma) {
        scope = this;

        if (vista.EjercicioComponent)
            vista.EjercicioComponent.keyssM.disable();
        if (vista.FechaComponent)
            vista.FechaComponent.keysFecha.disable();
        if (vista.FormatosComponent)
            vista.FormatosComponent.hotKeysFOrmatos.disable();
        if (vista.nomMoneda)
            vista.nomMoneda.hotKeysNomMoneda.disable();

        ///...Validar si la carga inicial para esta entidad esta hecha...///
        scope.chequearApertura = function() {
            Ext.Ajax.request({
                url: 'aperturado',
                params: {
                },
                method: 'POST',
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == -1)
                    {
                        mostrarMensaje(1, perfil.etiquetas.msgaperturado, function() {
                            direction = 0;
                            Ext.getCmp('card-next').disable();
                            Ext.getCmp('card-prev').disable();
                            //window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
                        });
                    } else {
                        Ext.getCmp('card-next').setDisabled(false);
                    }
                }
            });
        };
        scope.chequearApertura();

        scope.navHandler = function(direction) {
            var l = Ext.getCmp('card-wizard-panel').getLayout();
            if (l.activeItem.id == 'card-0' && direction == 1) {
                Ext.Ajax.request({
                    url: 'escribirbienvenida',
                    callback: function(options, success, response) {
                        var name = true;
                    }
                });
            }

            ///...Validar que existan ejercicios contables definidos para realizar la configuracion de fecha...///
            if (l.activeItem.id == 'card-1' && direction == 1) {
                if (vista.EjercicioComponent.gpEjercicios.getStore().getTotalCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.lbNEEjercicios);
                    direction = 0;
                }
            }
            ///...Validar que la fecha este configurada para avanzar a paso para configurar las monedas por entidad...///
            if (l.activeItem.id == 'card-2' && direction == 1) {
                if (vista.FechaComponent.gpFechasSubsistemas.getStore().getTotalCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.lbNEFechas);
                    direction = 0;
                }
            }

            ///...Validar que los formatos  esten configurados  para avanzar a paso para configurar los nomencladores generales...///
            if (l.activeItem.id == 'card-3' && direction == 1) {
                if (vista.FormatosComponent.gpdat_formato.getStore().getTotalCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.lbNEFormatos);
                    direction = 0;
                }
            }

            ///...Validar nomenclador de monedas ...///
            if (l.activeItem.id == 'card-4' && direction == 1) {
                var cont = 0;
                var alter = 0;
                Ext.each(vista.nomMoneda.gpMoneda.getStore().data.items, function(item, i) {
                    if (item.data.tipomoneda === '0') {
                        cont += 1;
                    }
                    if (item.data.tipomoneda === '1') {
                        alter += 1;
                    }
                });
                if (vista.nomMoneda.gpMoneda.getStore().getTotalCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.lbValidarNomMoneda);
                    direction = 0;
                } else if (cont <= 0) {
                    mostrarMensaje(1, perfil.etiquetas.lbNEMonedaContable);
                    direction = 0;
                } else if (alter <= 0) {
                    mostrarMensaje(1, perfil.etiquetas.lbNEMonedaAlternativa);
                    direction = 0;
                }
            }

            var pos = l.activeItem.id.split('card-')[1];
            pos = parseInt(pos);
            var espacios = '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp';
            vista.pasosConfiguracionCargaInicial = 4;
            var pasoActual = pos;
            if (direction == 1) {
                pos = pos + 1;
                switch (pos) {
                    case 1:
                        if (!vista.EjercicioComponent) {
                            var id = 'card-' + pos + '';
                            vista.EjercicioComponent = new Ext.Configuracion_General_Parametros.Ejercicios({
                                layout: 'fit',
                                id: id,
                                title: perfil.etiquetas.lbCompoEjercicios + espacios + '<b><' + (parseInt(pasoActual) + 1) + '/' + vista.pasosConfiguracionCargaInicial + '></b>'
                            });
                            Ext.getCmp('card-wizard-panel').add(vista.EjercicioComponent);
                            l.setActiveItem(pos);
                        }
                        else {
                            l.setActiveItem(pos);
                        }
                        vista.EjercicioComponent.keyssM.enable();
                        if (vista.FechaComponent)
                            vista.FechaComponent.keysFecha.disable();
                        if (vista.FormatosComponent)
                            vista.FormatosComponent.hotKeysFOrmatos.disable();
                        if (vista.nomMoneda)
                            vista.nomMoneda.hotKeysNomMoneda.disable();
                        break;
                    case 2:
                        if (!vista.FechaComponent) {
                            var id = 'card-' + pos + '';
                            vista.FechaComponent = new Ext.Configuracion_General_Parametros.Fecha({
                                id: id,
                                layout: 'fit',
                                title: perfil.etiquetas.lbCompoFecha + espacios + '<b><' + (parseInt(pasoActual) + 1) + '/' + vista.pasosConfiguracionCargaInicial + '></b>'
                            });
                            Ext.getCmp('card-wizard-panel').add(vista.FechaComponent);
                            l.setActiveItem(pos);
                        }
                        else {
                            l.setActiveItem(pos);
                        }
                        vista.FechaComponent.keysFecha.enable();
                        if (vista.EjercicioComponent)
                            vista.EjercicioComponent.keyssM.disable();
                        if (vista.FormatosComponent)
                            vista.FormatosComponent.hotKeysFOrmatos.disable();
                        if (vista.nomMoneda)
                            vista.nomMoneda.hotKeysNomMoneda.disable();
                        break;
                    case 3:
                        if (!vista.FormatosComponent) {
                            var id = 'card-' + pos + '';
                            vista.FormatosComponent = new Ext.Configuracion_General_Nomencladores.Formatos({
                                id: id,
                                layout: 'fit',
                                title: perfil.etiquetas.lbCompoFormatos + espacios + '<b><' + (parseInt(pasoActual) + 1) + '/' + vista.pasosConfiguracionCargaInicial + '></b>'
                            });
                            Ext.getCmp('card-wizard-panel').add(vista.FormatosComponent);
                            l.setActiveItem(pos);
                        }
                        else {
                            l.setActiveItem(pos);
                        }
                        vista.FormatosComponent.hotKeysFOrmatos.enable();
                        if (vista.EjercicioComponent)
                            vista.EjercicioComponent.keyssM.disable();
                        if (vista.FechaComponent)
                            vista.FechaComponent.keysFecha.disable();
                        if (vista.nomMoneda)
                            vista.nomMoneda.hotKeysNomMoneda.disable();
                        break;
                    case 4:
                        if (!vista.nomMoneda) {
                            var id = 'card-' + pos + '';
                            vista.nomMoneda = new Ext.Configuracion_General_Nomencladores.NomencladorMoneda({
                                id: id,
                                layout: 'fit',
                                desglose: true,
                                title: perfil.etiquetas.lbCompoNomMoneda + espacios + '<b><' + (parseInt(pasoActual) + 1) + '/' + vista.pasosConfiguracionCargaInicial + '></b>'
                            });
                            Ext.getCmp('card-wizard-panel').add(vista.nomMoneda);
                            l.setActiveItem(pos);
                        }
                        else {
                            l.setActiveItem(pos);
                        }
                        vista.nomMoneda.hotKeysNomMoneda.enable();
                        if (vista.EjercicioComponent)
                            vista.EjercicioComponent.keyssM.disable();
                        if (vista.FechaComponent)
                            vista.FechaComponent.keysFecha.disable();
                        if (vista.FormatosComponent)
                            vista.FormatosComponent.hotKeysFOrmatos.disable();
                        break;
                    case 5:
                        if (!vista.cierre) {
                            var id = 'card-' + pos + '';
                            vista.cierre = {
                                id: id,
                                style: 'text-align:center;margin:200px 0px 0px 0px',
                                html: perfil.etiquetas.lbGracias
                            }
                            Ext.getCmp('card-wizard-panel').add(vista.cierre);
                            l.setActiveItem(pos);
                        }
                        else {
                            l.setActiveItem(pos);
                        }
                        if (vista.EjercicioComponent)
                            vista.EjercicioComponent.keyssM.disable();
                        if (vista.FechaComponent)
                            vista.FechaComponent.keysFecha.disable();
                        if (vista.FormatosComponent)
                            vista.FormatosComponent.hotKeysFOrmatos.disable();
                        if (vista.nomMoneda)
                            vista.nomMoneda.hotKeysNomMoneda.disable();
                        break;
                    case 6:
                        vista.loadMaskCierre.show();
                        Ext.Ajax.request({
                            url: 'cierre',
                            params: {
                            },
                            method: 'POST',
                            callback: function(options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                vista.loadMaskCierre.hide();
                                if (responseData.codMsg == -3) {
                                    mostrarMensaje(1, perfil.etiquetas.msgSistConfigurado, function() {
                                        window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
                                    });
                                }
                            }
                        });
                        break;
                }
            }
            else {
                if (direction == -1) {
                    pos = pos - 1;
                    switch (pos) {
                        case 1:
                            vista.EjercicioComponent.keyssM.enable();
                            if (vista.FechaComponent)
                                vista.FechaComponent.keysFecha.disable();
                            if (vista.FormatosComponent)
                                vista.FormatosComponent.hotKeysFOrmatos.disable();
                            if (vista.nomMoneda)
                                vista.nomMoneda.hotKeysNomMoneda.disable();
                            break;
                        case 2:
                            vista.FechaComponent.keysFecha.enable();
                            if (vista.EjercicioComponent)
                                vista.EjercicioComponent.keyssM.disable();
                            if (vista.FormatosComponent)
                                vista.FormatosComponent.hotKeysFOrmatos.disable();
                            if (vista.nomMoneda)
                                vista.nomMoneda.hotKeysNomMoneda.disable();
                            break;
                        case 3:
                            vista.FormatosComponent.hotKeysFOrmatos.enable();
                            if (vista.EjercicioComponent)
                                vista.EjercicioComponent.keyssM.disable();
                            if (vista.FechaComponent)
                                vista.FechaComponent.keysFecha.disable();
                            if (vista.nomMoneda)
                                vista.nomMoneda.hotKeysNomMoneda.disable();
                            break;
                        case 4:
                            vista.nomMoneda.hotKeysNomMoneda.enable();
                            if (vista.EjercicioComponent)
                                vista.EjercicioComponent.keyssM.disable();
                            if (vista.FechaComponent)
                                vista.FechaComponent.keysFecha.disable();
                            if (vista.FormatosComponent)
                                vista.FormatosComponent.hotKeysFOrmatos.disable();
                            break;
                    }
                    l.setActiveItem(pos);
                }
            }

            Ext.getCmp('card-prev').setDisabled(pos == 0);
            Ext.getCmp('card-prev').setDisabled(pos == 1);

            if (pos == 5) {
                Ext.getCmp('card-next').setText(perfil.etiquetas.lbBtnFinalizar);
            }
            else {
                Ext.getCmp('card-next').setText(perfil.etiquetas.lbBtnSiguiente);
            }
            Ext.getCmp('card-next').setDisabled(pos == 6);
            Ext.getCmp('card-prev').setDisabled(pos == 5);
        };
        Ext.getCmp('card-prev').on('click', scope.navHandler.createDelegate(this, [-1]));
        Ext.getCmp('card-next').on('click', scope.navHandler.createDelegate(this, [1]));

    }
};
UCID.portal.cargarEtiquetas('cargainicial', function(perfil, idioma) {

    idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Conf.CargaInicial.Modelo;
    modelo.init();
    var vista = Conf.CargaInicial.Vista;
    vista.init(modelo, idioma);
    var controlador = Conf.CargaInicial.Controlador;
    controlador.init(vista, modelo, idioma);
    var keys = new Ext.KeyMap(document, [
        {
            key: 'a',
            ctrl: true,
            alt: true,
            fn: function() {
                if (!Ext.getCmp('card-prev').disabled) {
                    controlador.navHandler(-1);

                }
            }
        }
        ,
        {
            key: 'n',
            ctrl: true,
            alt: true,
            fn: function() {
                if (!Ext.getCmp('card-next').disabled) {
                    controlador.navHandler(1);
                }
            }
        }
    ]);
});





























