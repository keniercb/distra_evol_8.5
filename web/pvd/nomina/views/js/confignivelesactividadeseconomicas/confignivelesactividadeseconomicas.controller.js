Ext.ns('Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas');

//Controlador de la vista del componente Gestionar retenciones. 
Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma   Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista    Vista general del componente Configurar NAE (Tipo: Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas.Vista)
     * @param modelo   Modelo de la vista del componente Configurar NAE (Tipo: Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas.Modelo)
     */
    init: function (idioma, vista, modelo) {
        var self = this;
        var variablesGenerales = {
            identidad: 0,
            accion: '',
            idtiponomina: -1
            //tiponomina: '',
        };

        vista.winGestNivelesActivEconom.show();

        modelo.storeNivelActividadEconom.load({params: {limit: 10, start: 0}});

        //Evento del componente de entidades
        vista.pobjestructura.on('estructuraselecionada', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
                vista.btnAdicionarNAE.enable();
                variablesGenerales.identidad = nodo.id;
                modelo.storeNivelActividadEconom.load({
                    params: {
                        idestructura: variablesGenerales.identidad,
                        limit: 10,
                        start: 0
                    }
                });
            /*} else {
                vista.btnAdicionarNAE.disable();
                modelo.storeNivelActividadEconom.load({
                    params: {
                        idestructura: -1,
                        limit: 10,
                        start: 0
                    }
                });
            }*/
        }.createDelegate(this));

        //Accion para mostrar la ventana de adicionar tipos de nominas y Niveles de actividades economicas
        vista.btnAdicionarNAE.on('click', function () {
            variablesGenerales.accion = 'ADD';
            modelo.storeTipoNomina.load({params: {limit: 10, start: 0}});

            this.cbtiponomina = new Ext.form.ComboBox({
                fieldLabel: 'Tipo de n&oacute;mina',
                store: modelo.storeTipoNomina,
                displayField: 'denominacion',
                valueField: 'idtiponomina',
                hiddenName: 'idtiponomina',
                allowblank: false,
                //readOnly: true,
                mode: 'local',
                triggerAction: 'all',
                emptyText: 'Seleccione...',
                selectOnFocus: true,
                anchor: '98%',
                blankText: 'Error.'
            });

            this.pNivelesActividadesEconomicas = new Ext.FormPanel({
                id: 'panelElementosGasto',
                layout: 'form',
                labelAlign: 'top',
                frame: true,
                region: 'center',
                height: 400,
                anchor: '100%',
                bodyStyle: 'background-color:#fff;padding:20px;',
                items: [
                    this.cbtiponomina
                ],
                listeners: {
                    render: function (component) {
                        new Ext.Costo.Procesos.Nomencladores.Componentes.CCNAE({
                            id: 'idcomponentenae',
                            hideSearch: false,
                            typeSelection: 0,
                            showFullTree: true,
                            types: [2],
                            //bodyStyle: 'margin-top: 200px',
                            idestructuraOpcional: variablesGenerales.identidad,
                            renderIn: component
                        }).on({
                                initialize: function (componentClass, UI) {
                                    UI.on({
                                        checkchange: function (node, checked) {
                                            if (checked) {
                                                var selections = componentClass.fGetSelections();
                                                if (Ext.isArray(selections) && selections.length > 0) {
                                                    for (var i = 0; i < selections.length; i++) {
                                                        if (node.id != selections[i].id) {
                                                            selections[i].getUI().toggleCheck();
                                                        }
                                                    }
                                                }
                                            }
                                            self.idnivelae = node.id;
                                            self.node = node;
                                            self.checked = checked;
                                            activarBtnAceptar(node, checked);
                                        },
                                        click: function (node) {
                                            self.idnivelae = node.id;
                                            self.node = node;
                                            self.checked = checked;
                                            activarBtnAceptar(node, checked);
                                        }
                                    });
                                }
                            });
                    }
                }
            });
            //Habilitar el boton aceptar
            this.cbtiponomina.on('select', function () {
                activarBtnAceptar(self.node, self.checked);
            });

            vista.winAddNAE.setTitle(idioma.lbTitlewinAddNAE);
            vista.winAddNAE.add(this.pNivelesActividadesEconomicas);
            vista.winAddNAE.show();
        }.createDelegate(this));

        //Accion para mostrar la ventana de modificar tipos de nominas y Niveles de actividades economicas
        vista.btnModificarNAE.on('click', function () {
            variablesGenerales.accion = 'MOD';
            modelo.storeTipoNomina.load({params: {limit: 10, start: 0}});

            this.cbtiponomina = new Ext.form.ComboBox({
                fieldLabel: 'Tipo de n&oacute;mina',
                store: modelo.storeTipoNomina,
                displayField: 'denominacion',
                valueField: 'idtiponomina',
                hiddenName: 'idtiponomina',
                allowblank: false,
                //readOnly: true,
                mode: 'local',
                triggerAction: 'all',
                emptyText: 'Seleccione...',
                selectOnFocus: true,
                anchor: '98%',
                blankText: 'Error.'
            });

            this.pNivelesActividadesEconomicas = new Ext.FormPanel({
                id: 'panelElementosGasto',
                layout: 'form',
                labelAlign: 'top',
                frame: true,
                region: 'center',
                height: 400,
                anchor: '100%',
                bodyStyle: 'background-color:#fff;padding:20px;',
                items: [
                    this.cbtiponomina
                ],
                listeners: {
                    render: function (component) {
                        new Ext.Costo.Procesos.Nomencladores.Componentes.CCNAE({
                            id: 'idcomponentenae',
                            hideSearch: false,
                            typeSelection: 0,
                            showFullTree: true,
                            types: [2],
                            //bodyStyle: 'margin-top: 200px',
                            idestructuraOpcional: variablesGenerales.identidad,
                            renderIn: component
                        }).on({
                                initialize: function (componentClass, UI) {
                                    UI.on({
                                        checkchange: function (node, checked) {
                                            if (checked) {
                                                var selections = componentClass.fGetSelections();
                                                if (Ext.isArray(selections) && selections.length > 0) {
                                                    for (var i = 0; i < selections.length; i++) {
                                                        if (node.id != selections[i].id) {
                                                            selections[i].getUI().toggleCheck();
                                                        }
                                                    }
                                                }
                                            }
                                            self.idnivelae = node.id;
                                            self.node = node;
                                            self.checked = checked;
                                            activarBtnAceptar(node, checked);
                                        },
                                        click: function (node) {
                                            self.idnivelae = node.id;
                                            self.node = node;
                                            self.checked = checked;
                                            activarBtnAceptar(node, checked);
                                        }
                                    });
                                }
                            });
                    }
                }
            });

            vista.winAddNAE.setTitle(idioma.lbTitlewinModNAE);
            vista.winAddNAE.add(this.pNivelesActividadesEconomicas);
            //Eventos del campo tipo nomina en caso de que no se halla modificado
            this.cbtiponomina.setValue(vista.gpNivelesActividadesEconom.getSelectionModel().getSelected().get('tiponomina'));
            variablesGenerales.idtiponomina = vista.gpNivelesActividadesEconom.getSelectionModel().getSelected().get('idtiponomina');
            //Habilitar el boton aceptar
            this.cbtiponomina.on('select', function () {
                //Eventos del campo tipo nomina en caso de que no se halla modificado
                variablesGenerales.idtiponomina = self.cbtiponomina.getValue();

                //Activar aceptar
                activarBtnAceptar(self.node, self.checked);
            });

            vista.winAddNAE.show();
        }.createDelegate(this));

        //Accion para eliminar un nivel de actividad economica
        vista.btnEliminarNAE.on('click', function () {
            eliminarNivelAE();
        });

        //Accion para cancelar o aceptar la adicion
        vista.btnAceptarNAE.on('click', function () {
            var idtiponomina = self.cbtiponomina.getValue();
            var idnivelactiveconom = self.idnivelae;
            adicionarNivelesAEyTiposNomina(idtiponomina, idnivelactiveconom);
        });

        vista.btnCancelarNAE.on('click', function () {
            vista.winAddNAE.hide();
        });

        vista.smNivelesActividadesEconom.on('rowselect', function () {
            var cantidadseleccionados = vista.gpNivelesActividadesEconom.getSelectionModel().getSelections().length;
            if (cantidadseleccionados == 1) {
                vista.btnModificarNAE.enable();
                vista.btnEliminarNAE.enable();
            } else {
                vista.btnModificarNAE.disable();
                vista.btnEliminarNAE.disable();
            }
        });

        vista.smNivelesActividadesEconom.on('rowdeselect', function (obj, ind, sm) {
            var cantidadseleccionados = vista.gpNivelesActividadesEconom.getSelectionModel().getSelections().length;
            if (cantidadseleccionados != 1) {
                vista.btnModificarNAE.disable();
                vista.btnEliminarNAE.disable();
            } else {
                vista.btnModificarNAE.enable();
                vista.btnEliminarNAE.enable();
            }
        });

        //Functions
        function adicionarNivelesAEyTiposNomina(idtiponomina, idnivelactiveconom) {
            if (variablesGenerales.accion == 'ADD') {
                //Se muestra la máscara de espera.
                PVD.mostrarMascara('idmaskaddnivelacteconom', 'Por favor espere...', idioma.lbMsgAdicionarNAE);
                //Enviando datos al servidor.
                Ext.Ajax.request({
                    url: 'adicionarTipoNyNivelAE',
                    method: 'POST',
                    params: {
                        idtiponomina: idtiponomina,
                        idnivelactiveconom: idnivelactiveconom,
                        idestructura: variablesGenerales.identidad
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData == 'ok') {
                            mostrarMensaje(1, idioma.lbMsgCorrectoAdicionadoNAE);
                            modelo.storeNivelActividadEconom.load({
                                params: {
                                    idestructura: variablesGenerales.identidad,
                                    limit: 10,
                                    start: 0
                                }
                            });
                            vista.winAddNAE.hide();
                        } else if (responseData == 'EXISTETIPONOMINA') {
                            mostrarMensaje(3, idioma.lbErrorTipoNomina);
                        }
                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddnivelacteconom');
                    }
                });
            } else {
                //Se muestra la máscara de espera.
                PVD.mostrarMascara('idmaskaddnivelacteconom', 'Por favor espere...', idioma.lbMsgModificarNAE);

                //Enviando datos al servidor.
                Ext.Ajax.request({
                    url: 'modificarTipoNyNivelAE',
                    method: 'POST',
                    params: {
                        idconfiguracionnivelae: vista.gpNivelesActividadesEconom.getSelectionModel().getSelected().get('idconfiguracionnivelae'),
                        idtiponomina: variablesGenerales.idtiponomina,
                        idnivelactiveconom: idnivelactiveconom,
                        idestructura: variablesGenerales.identidad
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData == 'ok') {

                            mostrarMensaje(1, idioma.lbMsgCorrectoModificadoNAE);
                            modelo.storeNivelActividadEconom.load({
                                params: {
                                    idestructura: variablesGenerales.identidad,
                                    limit: 10,
                                    start: 0
                                }
                            });
                            vista.winAddNAE.hide();
                        } else if (responseData == 'EXISTETIPONOMINA') {
                            mostrarMensaje(3, idioma.lbErrorTipoNomina);
                        }
                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddnivelacteconom');
                    }
                });
            }
        }

        function eliminarNivelAE() {
            var idconfiguracionnivelae = vista.gpNivelesActividadesEconom.getSelectionModel().getSelected().get('idconfiguracionnivelae')
            mostrarMensaje(2, idioma.lbTitleEliminarNAE, function (btn) {
                if (btn == 'ok') {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskdelnivelae', idioma.lbMsgEsperaEnviarDatos, 'Eliminando datos');
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarTipoNyNivelAE',
                        method: 'POST',
                        params: {
                            idconfiguracionnivelae: idconfiguracionnivelae
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskdelnivelae');
                            mostrarMensaje(1, (responseData == 'ok') ? 'El nivel de actividad econ&oacute;mica fue eliminado satisfactoriamente' : 'El nivel de actividad econ&oacute;mica no pudo ser eliminado', function (btn) {
                                if (btn == 'ok') {
                                    modelo.storeNivelActividadEconom.load({
                                        params: {
                                            idestructura: variablesGenerales.identidad,
                                            limit: 10,
                                            start: 0
                                        }
                                    });
                                }
                            });
                            vista.btnModificarNAE.disable();
                            vista.btnEliminarNAE.disable();
                        }
                    });
                }
            });
        }

        function activarBtnAceptar(nodo, checked) {
            //Habilitar el boton aceptar
            (checked && nodo.attributes.nivel == 3 && self.cbtiponomina.getValue() !== '') ? vista.btnAceptarNAE.enable() : vista.btnAceptarNAE.disable();
        }

    }
}
