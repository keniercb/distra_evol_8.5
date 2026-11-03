Ext.ns('Gestionar.Nomenclador.Inversiones');

UCID.portal.cargarEtiquetas('gestionnomencladoresinv', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;

    var modelo = Gestionar.Nomenclador.Inversiones.Modelo;
    modelo.init();
    var vista = Gestionar.Nomenclador.Inversiones.Vista;
    vista.init(idioma, modelo);
    var acciones;

    var contChequeados = 0;
    var eliminando = false;


    Gestionar.Nomenclador.Inversiones.Controlador.init(idioma, vista, modelo);
});

Gestionar.Nomenclador.Inversiones.Controlador = {
    init: function(idioma, vista, modelo) {

        var idnomenclador, tipodato, nodocheck = [], pos = 0, idorganismo;

        /**************************TECLAS CALIENTES****************/
        map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'Ll',
                alt: true,
                fn: function() {
                    vista.filtrosnomen.clearFilters();
                    recarga(modelo.store_gestionar_inversiones, 20);
                }
            },
            {
                key: 'Hh',
                alt: true,
                fn: function() {
                    alert('Por implementar');
                }
            },
            {
                key: 46,
                fn: function() {
                    if (vista.btnEliminarNomenclador.enable())
                        if (validarBtn(Ext.getCmp('btnAdd')))
                        {
                            vista.btnEliminarNomenclador.fireEvent('click');
                        }

                }
            },
            {
                key: 'Ii',
                alt: true,
                fn: function() {
                    if (vista.btnAdicionarNomenclador.enable())
                    {
                        if (eliminando == false) {
                            vista.window_nomenclador.show();
                        }
                    }
                }
            }


        ]);

        /*modelo.store_gestionar_inversiones.on('beforeload', function(){
            if (vista.smgridNomenclador.getSelected()) {
                this.baseParams._parent = smGpGestNom.getSelected().data._parent;
            }
        });*/

        vista.btnAdicionarNomenclador.on({
            click: function() {
                vista.window_nomenclador.show();
                vista.treeDatosNomencl.root.reload();
            }
        });
        vista.btn_cancelar_nomenclador.on('click', function() {
            vista.window_nomenclador.hide();
        });

        modelo.store_gestionar_inversiones.on('load', function() {
            columColor();

        });

        modelo.store_gestionar_inversiones.load({params: {
                start: 0,
                limit: 20
            }});


        vista.btn_aceptar_nomenclador.on('click', function() {
            adicionarNomen(false);

        });

        vista.treePanelNomenclador.on({
            click: function(tl, n) {
                if(vista.gridNomenclador.getSelectionModel().hasSelection())
                    vista.gridNomenclador.getSelectionModel().clearSelections();
                idorganismo = tl.id;
                vista.btnAdicionarNomenclador.enable();
                modelo.store_gestionar_inversiones.load();
                vista.gridNomenclador.getStore().reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            }
        });
        vista.gridNomenclador.getStore().reload({
            params: {
                limit: 20,
                start: 0
            }
        });

        vista.treeDatosNomencl.on({
            checkchange: function(n, check) {
                _this.contChequeados = vista.treeDatosNomencl.getChecked().length;
                if (check == true) {
                    nodocheck[pos] = n.attributes.iddatosnomenclador;
                    pos = pos + 1;
                    if (_this.contChequeados > 0) {
                        vista.btn_aplicar_nomenclador.enable();
                        vista.btn_aceptar_nomenclador.enable();
                    }


                }
                else {
                    fndeleteId(nodocheck, n.attributes.iddatosnomenclador);
                    if (_this.contChequeados == 0) {
                        vista.btn_aplicar_nomenclador.disable();
                        vista.btn_aceptar_nomenclador.disable();
                    }
                }
            }
        });
        modelo.loaderDatosNomencl.on({
            beforeload: function(tl, n) {
                this.baseParams = {
                    anode: n.attributes.id
                };
            }
        });

        vista.gridNomenclador.getSelectionModel().on({
            rowselect: function(sm, r, e) {
                if (sm.getSelections().length > 1) {
                    variable = 0;
                    for (var i = 0; i < sm.getSelections().length; i++) {
                        if (sm.getSelections()[i].get('uso') == 1)
                            variable++;

                    }
                    if (variable != 0) {
                        vista.btnEliminarNomenclador.disable();
                    } else {
                        vista.btnEliminarNomenclador.enable();
                    }

                } else {
                    if (sm.getSelections()[0].get('uso') == 1) {
                        vista.btnEliminarNomenclador.disable();
                    } else {
                        vista.btnEliminarNomenclador.enable();
                    }
                }
            },
            rowdeselect: function(sm, rowIndex, record) {
                if (sm.getSelections().length > 1) {
                    variable = 0;
                    for (var i = 0; i < sm.getSelections().length; i++) {
                        if (sm.getSelections()[i].get('uso') == 1)
                            variable++;

                    }
                    if (variable != 0) {
                        vista.btnEliminarNomenclador.disable();
                    } else {
                        vista.btnEliminarNomenclador.enable();
                    }

                }
                if (sm.getSelections().length == 1) {
                    variable = 0;
                    for (var i = 0; i < sm.getSelections().length; i++) {
                        if (sm.getSelections()[i].get('uso') == 1)
                            variable++;

                    }
                    if (variable != 0) {
                        vista.btnEliminarNomenclador.disable();
                    } else {
                        vista.btnEliminarNomenclador.enable();
                    }

                }

            }
        });
        vista.btn_aplicar_nomenclador.on('click', function() {
            adicionarNomen(true);
        });
        vista.btnLimpiarNomenclador.on('click', function() {
            vista.filtrosnomen.clearFilters();
            recarga(modelo.store_gestionar_inversiones, 20);

        });
        vista.btnEliminarNomenclador.on('click', function() {
            eliminando = true;
            mostrarMensaje(2, "¿Está seguro que quiere eliminar el(los) dato(s) seleccionado(s)?", eliminarnomenclaodor);
            function eliminarnomenclaodor(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var aux = vista.gridNomenclador.getSelectionModel().getSelections();
                    var arrid = [];
                    Ext.MessageBox.show({
                        title: perfil.etiquetas.msgEspere,
                        msg: 'Eliminando datos...',
                        width: 250,
                        wait: true,
                        progress: true,
                        closable: false
                    });
                    for (i = 0; i < aux.length; i++) {
                        arrid.push(aux[i].data.iddatosnomenclador);
                    }
                    Ext.Ajax.request({
                        url: 'eliminarNomenclador',
                        params: {
                            iddatosnomenclador: Ext.encode(arrid),
                            idnomenclador: idorganismo
                        },
                        callback: function(options, success, response) {
                            Ext.MessageBox.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgE == 1) {
                                modelo.store_gestionar_inversiones.removeAll();
                                mostrarMensaje(1, "El(Los) dato(s) ha(n) sido eliminado(s) satisfactoriamente.");
                            } else if (responseData.codMsgE == 22) {
                                modelo.store_gestionar_inversiones.removeAll();
                                mostrarMensaje(1, "El nomenclador seleccionado no se puede eliminar debido a que está en uso.");
                            }
                            vista.btnEliminarNomenclador.disable();
                            recarga(modelo.store_gestionar_inversiones, 20);
                            eliminando = false;
                        }

                    });
                } else {
                    eliminando = false;
                }
            }
        });
        modelo.store_gestionar_inversiones.on('beforeload', function() {
            modelo.store_gestionar_inversiones.baseParams.idNomInversion = idorganismo ? idorganismo : 0;
            /*if (vista.smgridNomenclador.getSelected()) {
                modelo.store_gestionar_inversiones.baseParams._parent = vista.smgridNomenclador.getSelected().data._parent;
            }*/
        });

        function fndeleteId(nodocheck, iddatosnomenclador) {
            for (var i = 0; i < nodocheck.length; i++) {
                if (nodocheck[i] == iddatosnomenclador) {
                    for (var j = nodocheck[i]; j < nodocheck.length - 1; j++) {
                        nodocheck[j] = nodocheck[j + 1];
                    }
                    nodocheck[i] = nodocheck[i + 1];
                }
            }
        }
        function adicionarNomen(aplicar) {
            if (aplicar == false) {
                _this.chequeado = vista.treeDatosNomencl.getChecked().length;
                if (_this.chequeado >= 1) {
                    if (vista.formulario_nomenclador.getForm().isValid()) {
                        vista.formulario_nomenclador.getForm().submit({
                            url: 'adicionarNomenclador',
                            waitMsg: perfil.etiquetas.msgEspere,
                            params: {
                                iddatonomenclador: Ext.encode(nodocheck),
                                idnomenclador: idorganismo
                            },
                            failure: function(form, action) {
                                if (action.result.codMsgA == 1) {
                                    mostrarMensaje(1, 'El dato ha sido adicionado satisfactoriamente.');
                                    modelo.store_gestionar_inversiones.removeAll();
                                    recarga(modelo.store_gestionar_inversiones, 20);
                                    vista.window_nomenclador.hide();
                                } else if (action.result.codMsgA == 2) {
                                    mostrarMensaje(1, 'El nomenclador ya existe.');
                                    modelo.store_gestionar_inversiones.removeAll();
                                    recarga(modelo.store_gestionar_inversiones, 20);
                                }

                            }
                        });
                    }
                } else
                    mostrarMensaje(1, 'Debe seleccionar al menos un dato nomenclador.');
            } else {
                _this.chequeado = vista.treeDatosNomencl.getChecked().length;
                if (vista.formulario_nomenclador.getForm().isValid()) {
                    if (_this.chequeado >= 1) {
                        vista.formulario_nomenclador.getForm().submit({
                            url: 'adicionarNomenclador',
                            waitMsg: perfil.etiquetas.msgEspere,
                            params: {
                                iddatonomenclador: Ext.encode(nodocheck),
                                idnomenclador: idorganismo
                            },
                            failure: function(form, action) {
                                if (action.result.codMsgA == 1) {
                                    mostrarMensaje(1, 'El dato ha sido adicionado satisfactoriamente.');
                                } else if (action.result.codMsgA == 2) {
                                    mostrarMensaje(1, 'El nomenclador ya existe.');
                                    recarga(modelo.store_gestionar_inversiones, 20);
                                }
                                recarga(modelo.store_gestionar_inversiones, 20);
                                vista.treeDatosNomencl.root.reload();
                            }
                        });
                    } else
                        mostrarMensaje(1, 'Debe seleccionar al menos un dato nomenclador.');
                }
            }
            pos = 0;
            nodocheck = [];
        }
        function columColor() {
            for (var i = 0; i < modelo.store_gestionar_inversiones.getCount(); i++) {
                Ext.get(vista.gridNomenclador.getView().getCell(i, 2)).applyStyles('background-color:' + modelo.store_gestionar_inversiones.getAt(i).data.color);
            }
        }

        modelo.store_gestionar_inversiones.on('load', function() {
            if (vista.filtrosnomen.getFiltrosActivos().length > 0 && modelo.store_gestionar_inversiones.getCount() == 0) {
                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
            }

        })

        function recarga(store, limit) {
            store.reload({
                params: {
                    start: 0,
                    limit: limit != undefined ? limit : 20
                }
            })
        }

        function validarBtn(btn) {
            return btn.hidden == false && !btn.disabled && ventanasNoActivas();
        }

        function ventanasNoActivas() {
            return !vista.window_nomenclador.isVisible();
        }

    }

};