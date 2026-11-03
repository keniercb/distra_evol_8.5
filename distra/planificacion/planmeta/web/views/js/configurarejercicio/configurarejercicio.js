var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('configurarejercicio', cargaInicialInterfaz);
var offset = 0, existeActual = 0,cargainicialenergetica = 2, ejerciciocontable = 2, idejercicioplanificacion = null,
        idEntidadSelect = null, traspasarDesglose = false, traspasarReglas = true, cambiosEstado = Object();
function cargaInicialInterfaz() {
    btnTraspasarEjercicio = new Ext.Button({
        handler: function () {
            interfazTraspasarEjercicio();
        },
        hidden: true,
        disabled: true,
        id: 'btnTraspasarEjercicio',
        iconCls: 'duplicar',
        tooltip: perfil.etiquetas.lbTraspasarEjercicio
    });
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'ejerciciocontable') {
                ejerciciocontable = 1;
                break;
            }
            if (acciones_reportes[i].abreviatura == 'cargainicialenergetica') {
                cargainicialenergetica = 1;
                break;
            }
        }
        cambiosEstado.elaboracion = [];
        cambiosEstado.elaboracion[0] = perfil.etiquetas.lbListo;
        cambiosEstado.listo = [];
        cambiosEstado.listo[0] = perfil.etiquetas.lbElaboración;
        cambiosEstado.listo[1] = perfil.etiquetas.lbEjecución;
        cambiosEstado.ejecucion = [];
        cambiosEstado.ejecucion[0] = perfil.etiquetas.lbListo;
        cambiosEstado.ejecucion[1] = perfil.etiquetas.lbCerrado;
        cambiosEstado.cerrado = [];
        cambiosEstado.cerrado[0] = perfil.etiquetas.lbEjecución;
        mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: perfil.etiquetas.lbCargando
        });
        mymask.show();
        stUsuarios = new Ext.data.Store({
            url: 'cargarUsuarios',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'data'
            },
                    [{
                            name: 'idusuario'
                        }, {
                            name: 'nombreusuario'
                        }]),
            listeners: {
                load: function (st) {
                    stEstados.reload();
                }
            }
        });
        stEstados = new Ext.data.Store({
            url: 'obtenerNomencladorEstado',
            reader: new Ext.data.JsonReader({
                id: 'iddatosnomenclador',
                root: "data"
            }, [{
                    name: 'iddatosnomenclador'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'uridatosnomenclador'
                }]),
            listeners: {
                load: function () {
                    Ext.Ajax.request({
                        url: 'existeActual',
                        callback: function (options, success, response) {
                            mymask.hide();
                            responseData = Ext.decode(response.responseText);
                            existeActual = responseData.mensaje;
                            cargarInterfaz();
                        }
                    });
                }
            }
        });
    });
}
function cargarInterfaz() {
//botones de gestion
    btnAdicionarEjercicio = new Ext.Button({
        handler: function () {
            interfazAdicionarEjercicio('adicionar', perfil.etiquetas.lbAddEjercicio);
        },
        disabled: false,
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionarEjercicio
    });

    btnModificarEjercicio = new Ext.Button({
        handler: function () {
            interfazAdicionarEjercicio('modificar', perfil.etiquetas.lbModEjercicio);
        },
        disabled: true,
        iconCls: 'modificar',
        tooltip: perfil.etiquetas.lbModificarEjercicio
    });
    btnEliminarEjercicio = new Ext.Button({
        disabled: true,
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbDelEjercicio,
        handler: function () {
            eliminarEjercicio();
        }
    });
    btnActualEjercicio = new Ext.Button({
        handler: function () {
            mostrarMensaje(2, perfil.etiquetas.lbConfDefActual, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    cambiarActual();
                }
            });
        },
        disabled: true,
        iconCls: 'actual',
        tooltip: perfil.etiquetas.lbActual
    });
    btnSiguienteEstado = new Ext.Button({
        handler: function () {
            cambiarEstado(btnSiguienteEstado.getText());
        },
        disabled: true,
        iconCls: 'siguiente',
        text: ' '
    });
    btnAnteriorEstado = new Ext.Button({
        handler: function () {
            cambiarEstado(btnAnteriorEstado.getText());
        },
        disabled: true,
        iconCls: 'anterior',
        text: ' '
    });
    stGridEjercicio = new Ext.data.Store({
        url: 'listarEjercicios',
        reader: new Ext.data.JsonReader({
            id: 'idejercicio',
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }, {
                name: 'denominacion'
            }, {
                name: 'actual'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'idjerciciocontable'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }
        ]),
        listeners: {
            beforeload: function (store) {
                mymask.show();
                store.baseParams.start = offset;
            },
            load: function () {
                mymask.hide();
                smGridEjercicio.clearSelections();
                actualizarEstadoBarraHerramientas();
                if (stGridEjercicio.getCount() == 0) {
                    if (filtrosEjercicios.getFiltrosActivos() == undefined || filtrosEjercicios.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, perfil.etiquetas.lbNoDatos);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.lbNoDatosFiltrados);
                    }
                }
                cambiarTituloFiltrar(gGridEjercicio, filtrosEjercicios, perfil.etiquetas.lbEjercicioPlanif);
            }
        }
    });
    smGridEjercicio = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                actualizarEstadoBarraHerramientas();
            },
            rowdeselect: function () {
                actualizarEstadoBarraHerramientas();
            }
        }
    });
    filtrosEjercicios = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'ejercicio'
            }, {
                type: 'listado',
                dataIndex: 'denominacion',
                idcombo: 'cbestado',
                store: stEstados,
                urlcb: 'obtenerNomencladorEstado',
                idstore: 'cbFiltroEstado',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                mode: 'local'
            }, {
                type: 'boolean',
                dataIndex: 'actual'
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'idcbusuario',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }]
    });
    btnLimpiar = new Ext.Button({
        id: 'btnLimpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        iconCls: 'limpiar',
        handler: function () {
            accionLimpiarFiltros();
        }
    });
    cmEjercicios = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbDenominación,
            dataIndex: 'ejercicio',
            id: 'expandir',
            width: 250,
            sortable: true
        }, {
            header: perfil.etiquetas.lbEstado,
            dataIndex: 'denominacion',
            width: 150,
            sortable: true

        }, {
            header: perfil.etiquetas.lbAct,
            dataIndex: 'actual',
            width: 60,
            sortable: true,
            renderer: renderActual
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            width: 100,
            sortable: true,
            align: 'left',
            hidden: true,
            dataIndex: 'idusuario',
            renderer: renderUsuarios
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFechaM,
            width: 100,
            sortable: true,
            align: 'center',
            hidden: true,
            dataIndex: 'fecha',
            renderer: renderFecha
        }]);
    gGridEjercicio = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbEjercicioPlanif,
        frame: true,
        stripeRows: true,
        store: stGridEjercicio,
        sm: smGridEjercicio,
        autoExpandColumn: 'expandir',
        cm: cmEjercicios,
        bbar: new Ext.PagingToolbar({
            store: stGridEjercicio,
            items: ['   ', '-', btnLimpiar],
            displayInfo: true,
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        plugins: filtrosEjercicios
    });
    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'fit',
            items: [gGridEjercicio],
            tbar: [btnAdicionarEjercicio, '-', btnModificarEjercicio, '-', btnEliminarEjercicio, '-', btnActualEjercicio, btnTraspasarEjercicio, '-', btnAnteriorEstado, '-', btnSiguienteEstado]
        })
    });
    stGridEjercicio.reload();
}
function actualizarEstadoBarraHerramientas() {
    btnModificarEjercicio.disable();
    btnEliminarEjercicio.disable();
    btnActualEjercicio.disable();
    btnTraspasarEjercicio.disable();
    btnAnteriorEstado.disable();
    btnSiguienteEstado.disable();
    btnAnteriorEstado.setText(' ');
    btnSiguienteEstado.setText(' ');
    if (smGridEjercicio.hasSelection()) {
        ejercicioselecc = smGridEjercicio.getSelected();
        if (ejercicioselecc.data.uridatosnomenclador == 'cerrado') {
            btnEliminarEjercicio.enable();
        }
        if (ejercicioselecc.data.uridatosnomenclador == 'elaboracion') {
            btnModificarEjercicio.enable();
            btnTraspasarEjercicio.enable();
            if (ejercicioselecc.data.actual == 0)
                btnActualEjercicio.enable();
        }
        if (ejercicioselecc.data.actual == 0) {
            if (ejercicioselecc.data.uridatosnomenclador == 'elaboracion') {
                btnSiguienteEstado.setText(cambiosEstado.elaboracion[0]);
                btnSiguienteEstado.enable();
                btnAnteriorEstado.setText(' ');
            } else if (ejercicioselecc.data.uridatosnomenclador == 'cerrado') {
                btnAnteriorEstado.enable();
                btnAnteriorEstado.setText(cambiosEstado.cerrado[0]);
                btnSiguienteEstado.setText(' ');
            } else if (ejercicioselecc.data.uridatosnomenclador == 'listo') {
                btnAnteriorEstado.enable();
                btnAnteriorEstado.setText(cambiosEstado.listo[0]);
                btnSiguienteEstado.enable();
                btnSiguienteEstado.setText(cambiosEstado.listo[1]);
            } else if (ejercicioselecc.data.uridatosnomenclador == 'ejecucion') {
                btnAnteriorEstado.enable();
                btnAnteriorEstado.setText(cambiosEstado.ejecucion[0]);
                btnSiguienteEstado.enable();
                btnSiguienteEstado.setText(cambiosEstado.ejecucion[1]);
            }
        }
    }
}
function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta + ' <i>' + perfil.etiquetas.lbFiltPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function renderActual(value,m) {
    if (value == 1)
      //  return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
          m.css = 'icondistra-true verde';
}
function accionLimpiarFiltros() {
    if (filtrosEjercicios.getFiltrosActivos().length > 0) {
        filtrosEjercicios.clearFilters();
    } else {
        stGridEjercicio.reload();
    }
}
function  cambiarActual() {
    if (existeActual == 0) {
        cambiarActualLogica();
    } else {
        mostrarMensaje(2, perfil.etiquetas.lbConfDefActualExiste,
                function (btnPress) {
                    if (btnPress == 'ok') {
                        cambiarActualLogica();
                    }
                });
    }
}
function  cambiarActualLogica() {
    mymask.show();
    Ext.Ajax.request({
        url: 'cambiarActual',
        timeout: 72000000,
        params: {
            idejercicio: smGridEjercicio.getSelected().data.idejercicio
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbActualOK);
                existeActual = 1;
                stGridEjercicio.reload();
            }
        }
    });
}
function  eliminarEjercicio() {
    mostrarMensaje(2, perfil.etiquetas.lbConfDel, elimina);
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            mymask.show();
            Ext.Ajax.request({
                url: 'eliminarEjercicios',
                params: {
                    idejercicio: smGridEjercicio.getSelected().data.idejercicio
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, perfil.etiquetas.lbDelOK);
                        stGridEjercicio.reload();
                    }
                    if (responseData.mensaje == 0) {
                        mostrarMensaje(1, perfil.etiquetas.lbDelNo);
                    }

                }
            });
        }
    }
}
function  interfazAdicionarEjercicio(accion, titulo) {
    idejerciciolistar = null;
    ejerciciolistar = null;
    if (accion == 'modificar') {
        idejerciciolistar = smGridEjercicio.getSelected().data.idejercicio;
        ejerciciolistar = smGridEjercicio.getSelected().data.ejercicio;
    }
    stComboEjercicios = new Ext.data.Store({
        autoLoad: true,
        url: 'listarEjerciciosParaAdicionar',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'ejercicio'
            }, {
                name: 'idejercicio'
            }]),
        listeners: {
            beforeload: function () {
                stComboEjercicios.baseParams.ejerciciocontable = ejerciciocontable;
                stComboEjercicios.baseParams.idejercicio = idejerciciolistar;
                stComboEjercicios.baseParams.ejercicio = ejerciciolistar;
            },
            load: function () {
                if (accion == 'modificar') {
                    if (ejerciciocontable == 1) {
                        cbDenominacionEjercicio.setValue(smGridEjercicio.getSelected().data.idjerciciocontable);
                        cbDenominacionEjercicio.setRawValue(smGridEjercicio.getSelected().data.ejercicio);
                    } else {
                        cbDenominacionEjercicio.setValue(smGridEjercicio.getSelected().data.idejercicio);
                        cbDenominacionEjercicio.setRawValue(smGridEjercicio.getSelected().data.ejercicio);
                    }
                    ChboxActual.setValue(smGridEjercicio.getSelected().data.actual);
                }
                cbDenominacionEjercicio.enable();
            }
        }
    });
    cbDenominacionEjercicio = new Ext.form.ComboBox({
        id: 'cbDenominacionEjercicio',
        store: stComboEjercicios,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        fieldLabel: perfil.etiquetas.lbDenominación,
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: true,
        hidden: false,
        disabled: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargandoDat,
        width: 130
    });
    ChboxActual = new Ext.form.Checkbox({
        id: 'ChboxActual',
        boxLabel: perfil.etiquetas.lbActual,
        fieldLabel: '',
        hideLabel: true,
        labelSeparator: '',
        anchor: '90%'

    });
    btnCancelarAddEjercicio = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAddEjercicio',
        tooltip: perfil.etiquetas.lbCerrar,
        text: perfil.etiquetas.lbCancelar,
        handler: function () {
            winAddEjercicio.destroy();
        }
    });
    btnAplicarAddEjercicio = new Ext.Button({
        iconCls: 'aplicar',
        id: 'btnAplicarAddEjercicio',
        text: perfil.etiquetas.lbAplicar,
        tooltip: perfil.etiquetas.lbGuardar,
        handler: function () {
            adicionarModificarEjercicio(accion, true);
        }
    });
    btnAceptarAddEjercicio = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnAceptarAddEjercicio',
        text: perfil.etiquetas.lbAceptar,
        disabled: true,
        tooltip: perfil.etiquetas.lbGuardarCerrar,
        handler: function () {
            adicionarModificarEjercicio(accion, false);
        }
    });
    pAddEjercicio = new Ext.FormPanel({
        frame: true,
        items: [{
                xtype: 'fieldset',
                autoHeight: true,
                items: [{
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 1,
                                layout: 'form',
                                items: [cbDenominacionEjercicio]
                            }
                        ]
                    }, {
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 1,
                                layout: 'form',
                                items: [ChboxActual]
                            }
                        ]
                    }
                ]
            }]
    });
    if (accion == 'modificar') {
        btnAplicarAddEjercicio.hide();
        if (smGridEjercicio.getSelected().data.actual == 1)
            ChboxActual.disable();
    }
    winAddEjercicio = new Ext.Window({
        modal: true,
        id: 'winAddEjercicio',
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        title: titulo,
        width: 300,
        height: 150,
        items: pAddEjercicio,
        buttons: [btnCancelarAddEjercicio, btnAplicarAddEjercicio, btnAceptarAddEjercicio]
    });
    winAddEjercicio.show();
}
function  adicionarModificarEjercicio(accion, aplicar) {
    if (accion == 'modificar')
        idejercicioplanificacion = smGridEjercicio.getSelected().data.idejercicio;
    mymask.show();
    Ext.Ajax.request({
        url: 'adicionarModificarEjercicio',
        timeout: 72000000,
        params: {
            accion: accion,
            ejerciciocontable: ejerciciocontable,
            cargainicialenergetica: cargainicialenergetica,
            denominacion: cbDenominacionEjercicio.getRawValue(),
            idejerciciodatosmaestros: cbDenominacionEjercicio.getValue(),
            ejercicioactual: (ChboxActual.getValue()) ? 1 : 0,
            idejercicioplanificacion: idejercicioplanificacion
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                if (accion == 'adicionar')
                    mostrarMensaje(1, perfil.etiquetas.lbAddOK);
                else
                    mostrarMensaje(1, perfil.etiquetas.lbModOK);
                stGridEjercicio.reload();
            }
            if (responseData.mensaje == 0) {
                if (accion == 'adicionar')
                    mostrarMensaje(1, perfil.etiquetas.lbAddNO);
                else
                    mostrarMensaje(1, perfil.etiquetas.lbModNO);
            }
            if (responseData.mensaje == 2) {
                mostrarMensaje(1, perfil.etiquetas.lbAddExiste);
            }
            if (aplicar) {
                stComboEjercicios.reload();
                cbDenominacionEjercicio.clearValue();
                ChboxActual.setValue(0);
            } else
                winAddEjercicio.destroy();
        }
    });
}
function validarExistenciaDatosEjercicioOrigen() {
    limpiarProcientoEjercicioBaseChecks(false, false);
    mymask.show();
    Ext.Ajax.request({
        url: 'validarExistenciaDatos',
        params: {
            idejerciciotraspasar: cbEjercicioTraspasar.getValue(),
            identidad: idEntidadSelect
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            porciento.enable();
            if (responseData.resultado.plan == true) {
                ChboxPlanes.enable();
            }
            if (responseData.resultado.na == true) {
                ChboxNiveles.enable();
            }
            if (responseData.resultado.norma == true) {
                ChboxNorma.enable();
            }
            if (responseData.resultado.des == true) {
                traspasarDesglose = true;
            } else {
                traspasarDesglose = false;
            }
            if (responseData.resultado.reg == true) {
                traspasarReglas = true;
            } else {
                traspasarReglas = false;
            }
        }
    });
}
function limpiarProcientoEjercicioBaseChecks(porciento, comboEjercicioTraspasar) {
    if (porciento) {
        porciento.disable();
        porciento.setValue(100);
    }
    if (comboEjercicioTraspasar) {
        cbEjercicioTraspasar.clearValue();
    }
    ChboxPlanes.disable();
    ChboxPlanes.setValue(false);
    ChboxNiveles.disable();
    ChboxNiveles.setValue(false);
    ChboxDesglose.disable();
    ChboxDesglose.setValue(false);
    ChboxNorma.disable();
    ChboxNorma.setValue(false);
    ChboxReglas.disable();
    ChboxReglas.setValue(false);
}
function  interfazTraspasarEjercicio() {
    porciento = new Ext.form.NumberField({
        id: 'porciento',
        regextext: 'porciento',
        allowNegative: false,
        minValue: 0,
        maxValue: 1000,
        decimalPrecision: 1,
        allowBlank: false,
        width: 80,
        enableKeyEvents: true,
        value: '100',
        disabled: true,
        fieldLabel: perfil.etiquetas.lbPorciento,
        listeners: {
            change: function (ch, checked) {
                validarTraspasarAdd();
            }
        }
    });
    tpEntidades = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false,
                frame: false
            });
    tpEntidades.btnBuscar.setText("");
    tpEntidades.btnLimpiar.setText("");
    tpEntidades = tpEntidades.items.items[0];
    tpEntidades.getRootNode().expand();
    tpEntidades.region = 'west';
    tpEntidades.addListener('click', function (n) {
        if (n.text != "Estructuras") {
            idEntidadSelect = n.id;
            //validar existencia de datos ejercicio base
            if (cbEjercicioTraspasar.getValue() != null && cbEjercicioTraspasar.getValue() != '' && cbEjercicioTraspasar.getValue() != undefined)
                validarExistenciaDatosEjercicioOrigen();
        } else {
            idEntidadSelect = null;
            limpiarProcientoEjercicioBaseChecks(false, false);
        }
        validarTraspasarAdd();
    });
    stCbejercicioTraspasar = new Ext.data.Store({
        url: 'getEjerciciosBaseTraspasar',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }]),
        listeners: {
            load: function () {
                pTraspasarEjercicio.enable();
                cbEjercicioTraspasar.enable();
            }
        }
    });
    cbEjercicioTraspasar = new Ext.form.ComboBox({
        id: 'cbEjercicioTraspasar',
        store: stCbejercicioTraspasar,
        disabled: true,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargandoDat,
        width: 150,
        anchor: '90%',
        listeners: {
            select: function (cb, rec, num) {
                //validar existencia de datos ejercicio base
                if (idEntidadSelect != null)
                    validarExistenciaDatosEjercicioOrigen();
                validarTraspasarAdd();
            }
        }
    });
    ChboxPlanes = new Ext.form.Checkbox({
        id: 'ChboxPlanes',
        boxLabel: perfil.etiquetas.lbPlanes,
        fieldLabel: '',
        disabled: true,
        hideLabel: true,
        labelSeparator: '',
        anchor: '95%',
        listeners: {
            check: function (ch, checked) {
                validarTraspasarAdd();
            }
        }

    });
    ChboxNiveles = new Ext.form.Checkbox({
        id: 'ChboxNiveles',
        boxLabel: perfil.etiquetas.lbNiv,
        fieldLabel: '',
        hideLabel: true,
        autoScroll: false,
        disabled: true,
        labelSeparator: '',
        anchor: '100%',
        listeners: {
            check: function (ch, checked) {
                if (checked && traspasarDesglose) {
                    ChboxDesglose.enable();
                } else {
                    ChboxDesglose.disable();
                    ChboxDesglose.setValue(false);
                }
                validarTraspasarAdd();
            }
        }

    });
    ChboxDesglose = new Ext.form.Checkbox({
        id: 'ChboxDesglose',
        boxLabel: perfil.etiquetas.lbDesg,
        fieldLabel: '',
        disabled: true,
        hideLabel: true,
        labelSeparator: '',
        anchor: '95%'
    });
    ChboxNorma = new Ext.form.Checkbox({
        id: 'ChboxNorma',
        boxLabel: perfil.etiquetas.lbNormas,
        fieldLabel: '',
        hideLabel: true,
        autoScroll: false,
        disabled: true,
        labelSeparator: '',
        anchor: '100%',
        listeners: {
            check: function (ch, checked) {
                if (checked && traspasarReglas) {
                    ChboxReglas.enable();
                } else {
                    ChboxReglas.disable();
                    ChboxReglas.setValue(false);
                }
                validarTraspasarAdd();
            }
        }

    });
    ChboxReglas = new Ext.form.Checkbox({
        id: 'ChboxReglas',
        boxLabel: perfil.etiquetas.lbReglas,
        fieldLabel: '',
        disabled: true,
        hideLabel: true,
        labelSeparator: '',
        anchor: '95%'
    });
    pEjercicioBaseEntidades = new Ext.Panel({
        layout: 'fit',
        width: 400,
        region: 'center',
        tbar: [perfil.etiquetas.lbEjerBase, cbEjercicioTraspasar, '-', perfil.etiquetas.lbPorc, porciento],
        items: [tpEntidades]
    });
    pChecksTraspasar = new Ext.FormPanel({
        labelAlign: 'top',
        width: 200,
        region: 'east',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                layout: 'column',
                items: [ChboxPlanes]
            }, {
                layout: 'column',
                items: [ChboxNiveles]
            }, {
                layout: 'column',
                items: [ChboxDesglose]
            }, {
                layout: 'column',
                items: [ChboxNorma]
            }, {
                layout: 'column',
                items: [ChboxReglas]
            }]
    });
    pTraspasarEjercicio = new Ext.Panel({
        layout: 'border',
        disabled: true,
        items: [pEjercicioBaseEntidades, pChecksTraspasar]
    });
    btnAceptarTraspasar = new Ext.Button({
        iconCls: 'adicionar',
        id: 'btnAceptarTraspasar',
        text: perfil.etiquetas.lbAdic,
        disabled: true,
        tooltip: perfil.etiquetas.lbGuardarCerrar,
        handler: function () {
            traspasar();
        }
    });
    btnCancelarTraspasar = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarTraspasar',
        tooltip: perfil.etiquetas.lbCerrar,
        text: perfil.etiquetas.lbCancelar,
        handler: function () {
            winTraspasarEjercicio.destroy();
        }
    });
    winTraspasarEjercicio = new Ext.Window({
        modal: true,
        id: 'winAddEjercicio',
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        title: perfil.etiquetas.lbTrasp,
        width: 600,
        height: 300,
        items: pTraspasarEjercicio,
        buttons: [btnCancelarTraspasar, btnAceptarTraspasar]
    });
    winTraspasarEjercicio.show();
    stCbejercicioTraspasar.reload();
}
function validarTraspasarAdd() {
    btnAceptarTraspasar.disable();
    if (porciento.validate())
        if (idEntidadSelect != null)
            if (cbEjercicioTraspasar.getValue() != null)
                if (ChboxPlanes.getValue() || ChboxNiveles.getValue() || ChboxNorma.getValue())
                    btnAceptarTraspasar.enable();


}
function  traspasar() {

    mymask.show();
    Ext.Ajax.request({
        url: 'traspasarInformacionEjercicio',
        timeout: 72000000,
        params: {
            idejercicioDestino: smGridEjercicio.getSelected().data.idejercicio,
            idejercicioBase: cbEjercicioTraspasar.getValue(),
            identidad: idEntidadSelect,
            porciento: porciento.getValue(),
            planes: ChboxPlanes.getValue(),
            niveles: ChboxNiveles.getValue(),
            desglose: ChboxDesglose.getValue(),
            norma: ChboxNorma.getValue(),
            regla: ChboxReglas.getValue()
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbTraspasarOK);
            } else
                mostrarMensaje(1, perfil.etiquetas.lbTraspasarNO);
            winTraspasarEjercicio.destroy();
        }
    });
}
function renderUsuarios(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stUsuarios.data.items.length; i++)
        if (stUsuarios.data.items[i].data.idusuario == value) {
            m.attr = 'ext:qtip="' + stUsuarios.data.items[i].data.nombreusuario + '"';
            return stUsuarios.data.items[i].data.nombreusuario;
        }
}
function renderFecha(val, m) {
    if (val != null) {
        var temp = val.split(':');
        var tempC = val.split(' ');
        if (tempC[0] != '31/12/2009' && tempC[0] != '01/01/2010') {
            var v = temp[0] + ':' + temp[1];
            m.attr = 'ext:qtip="' + v + '"';
            return tempC[0];
        } else {
            m.attr = 'ext:qtip=""';
            return null;
        }
    }
    return val;
}
function  cambiarEstado(text) {
    for (var i = 0; i < stEstados.data.items.length; i++)
        if (stEstados.data.items[i].data.denominacion == text) {
            iddatosnomenclador = stEstados.data.items[i].data.iddatosnomenclador;
        }
    mymask.show();
    Ext.Ajax.request({
        url: 'cambiarEstado',
        params: {
            idejercicio: smGridEjercicio.getSelected().data.idejercicio,
            iddatosnomenclador: iddatosnomenclador
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                mostrarMensaje(1, perfil.etiquetas.lbCambiarEstadoOK);
                stGridEjercicio.reload();
            }
        }
    });
}

