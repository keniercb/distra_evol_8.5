addcartatecnologica = function () {
    //Declaracion de variables
    idproducto = null;
    denominacion = '';

    smSeleccIndicador = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
                Ext.getCmp('btnaceptarInd').enable();
            },
            rowdeselect: function () {
                Ext.getCmp('btnaceptarInd').disable();
            }
        }
    });
    radio = new Ext.form.Radio({
        id: 'idradio',
        checked: false
    });

    //*************combo para las variables**********
    stvariable = new Ext.data.Store({
        url: 'cargarVariables',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idvariable',
            root: 'data'
        }, [{
                name: 'idvariable'
            }, {
                name: 'denominacionvariable'
            }])
    });

    //*************combo para las variables en el adicionar carta**********
    /*stSistemaRiego = new Ext.data.Store({
     url: 'obtenerDatosNomencladorUri?urinom=Sistemaderiego',
     autoLoad: true,
     reader: new Ext.data.JsonReader({
     id: 'iddatosnomenclador',
     root: 'data'
     }, [{
     name: 'iddatosnomenclador'
     }, {
     name: 'denominacion'
     }])
     });
     
     stMetodoCosecha = new Ext.data.Store({
     url: 'obtenerDatosNomencladorUri?urinom=Métododecosecha',
     autoLoad: true,
     reader: new Ext.data.JsonReader({
     id: 'iddatosnomenclador',
     root: 'data'
     }, [{
     name: 'iddatosnomenclador'
     }, {
     name: 'denominacion'
     }])
     });
     
     stMetodoSiembra = new Ext.data.Store({
     url: 'obtenerDatosNomencladorUri?urinom=Métododesiembra',
     autoLoad: true,
     reader: new Ext.data.JsonReader({
     id: 'iddatosnomenclador',
     root: 'data'
     }, [{
     name: 'iddatosnomenclador'
     }, {
     name: 'denominacion'
     }])
     });*/

    stvariableAddCarta = new Ext.data.Store({
        url: 'cargarVariablesAddCarta',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idvariable',
            root: 'data'
        }, [{
                name: 'idvariable'
            }, {
                name: 'denominacionvariable'
            }])
    });
    stPlanes = new Ext.data.Store({
        url: 'cargarPlanesEntidad',
        id: 'stPlanes',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idmodelo'
        }, [{
                name: 'idmodelo'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
                stPlanes.baseParams.identidad = id_entidad_seleccionada
            }
        }
    });

    cmGpSeleccIndicador = new Ext.grid.ColumnModel([{
            id: 'mscolumn',
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: 'No. de pieza',
            tooltip: 'Número de pieza',
            width: 80,
            sortable: true,
            dataIndex: 'numeropieza',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            hidden: true,
            renderer: crearToolTip
        }, {
            id: 'umedida',
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUM,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            id: 'precioventa',
            header: 'Precio de venta',
            tooltip: 'Precio de venta',
            width: 100,
            sortable: true,
            dataIndex: 'precioventa',
            renderer: crearToolTip
        }, {
            id: 'precio',
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            width: 80,
            hidden: true,
            sortable: true,
            dataIndex: 'precio',
            renderer: crearToolTip
        }]);

    // Store grid stGpCT
    stGpSeleccIndicador = new Ext.data.Store({
        url: 'listarIndicadores',
        listeners: {
            beforeload: function () {
                stGpSeleccIndicador.baseParams.start = offsetSeleccIndicador;
                stum.clearFilter();
                smSeleccIndicador.clearSelections();
            },
            load: function () {
                cambiarTituloFiltrar(gpGpSeleccIndicador, filtrosindicadores, "Indicadores");
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'precioventa'
            }, {
                name: 'numeropieza'
            }])
    });
    filtrosindicadores = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'codigo_ind_calculo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbumrendimiento',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'precioventa'
            }]
    });
    btnLimpiarSeleccIndicador = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarSeleccIndicador',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosindicadores.clearFilters();
        }
    });
    gpGpSeleccIndicador = new Ext.grid.GridPanel({
        store: stGpSeleccIndicador,
        autoExpandColumn: 'expandir',
        sm: smSeleccIndicador,
        cm: cmGpSeleccIndicador,
        region: 'center',
        frame: true,
        plugins: filtrosindicadores,
        title: "Indicadores",
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        listeners: {
            celldblclick: function () {
                cartaproducto.setValue(smSeleccIndicador.getSelected().data.denominacion);
                idproducto = smSeleccIndicador.getSelected().data.idindicador;
                smSeleccIndicador.clearSelections();
                windowIndicador.hide();
            }
        },
        bbar: new Ext.PagingToolbar({
            store: stGpSeleccIndicador,
            displayInfo: true,
            items: ['-', btnLimpiarSeleccIndicador],
            listeners: {
                beforechange: function (p, e) {
                    offsetSeleccIndicador = e.start;
                }
            }
        })
    });
    // Colum Model grid Norma
    windowIndicador = new Ext.Window({
        id: 'windowIndicador',
        width: 750,
        constrain: true,
        height: 450,
        closeAction: 'hide',
        layout: 'fit',
        title: perfil.etiquetas.lbTtlSeleccioneproducto,
        items: gpGpSeleccIndicador,
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                tooltip: perfil.etiquetas.lbCancelar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    windowIndicador.hide();
                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                id: 'btnaceptarInd',
                tooltip: perfil.etiquetas.lbAceptar,
                text: perfil.etiquetas.lbAceptar,
                disabled: true,
                handler: function () {
                    cartaproducto.setValue(smSeleccIndicador.getSelected().data.denominacion);
                    idproducto = smSeleccIndicador.getSelected().data.idindicador;
                    smSeleccIndicador.clearSelections();
                    windowIndicador.hide();
                }
            }]
    });

    //*************combo producto**********
    stproducto = new Ext.data.Store({
        url: 'listarproducto',
        reader: new Ext.data.JsonReader({
            id: 'idproducto',
            root: 'data'
        }, [{
                name: 'idproducto'
            }, {
                name: 'denproducto'
            }])
    });
};

function cargarDatosAdicionar() {
    Ext.Ajax.timeout = 600000; //10min
    mymask.show();
    Ext.Ajax.request({
        url: 'obtenerColumnasDinamicas',
        params: {
            idtipomodelo: cbTipoCarta.getValue()
        },
        callback: function (options, success, response) {
            mymask.hide();
            var responseData = Ext.decode(response.responseText);
            if (responseData.cm) {
                stPlanes.reload();
                crearcamposdinamicos(responseData);
            }
        }
    });
}

/*
 * Aqui cpmienzan a construirse los campos dinamicos
 * */
function crearcamposdinamicos(dinamicField) {
    /*
     * Algoritmo para crear campos  dinámico en el formulario
     * */
    //Se crean los campos fijos
    cartadenominacion = new Ext.form.TextField({
        id: 'cartadenominacion',
        fieldLabel: perfil.etiquetas.lbDenominacion,
        xtype: 'textfield',
        anchor: '100%',
        allowBlank: false,
        regex: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]+ ?[a-zA-Z-áéíóúÁÉÍÓÚñÑ0-9 ]*)+$/
    });
    cbPlan = new Ext.form.ComboBox({
        id: 'cbPlan',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        store: stPlanes,
        valueField: 'idmodelo',
        hiddenName: 'idmodelo',
        displayField: 'denominacion',
        mode: 'local',
        anchor: '100%',
        allowBlank: false,
        triggerAction: 'all',
        fieldLabel: "Plan",
        enableKeyEvents: true,
        regex: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z-áéíóúÁÉÍÓÚñÑ ]*)+$/,
        regexText: perfil.etiquetas.lbRegexText,
        listeners: {
            select: function () {
            }
        }
    });
    cartaproducto = new Ext.form.TextField({
        id: 'cartaproducto',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        readOnly: true,
        disabled: false,
        fieldLabel: perfil.etiquetas.lbProducto,
        xtype: 'textfield',
        allowBlank: false,
        anchor: '95%',
        listeners: {
            focus: function () {
                windowIndicador.show();
                stGpSeleccIndicador.reload();
            }
        }
    });
    cartarendimiento = new Ext.form.TextField({
        id: 'cartarendimiento',
        fieldLabel: "Rendimiento",
        decimalPrecision: 6,
        allowBlank: false,
        maxLength: 19,
        maxLengthText: perfil.etiquetas.lbMsgmaxLengthText,
        invalidText: perfil.etiquetas.lbInvaliTex,
        regex: /^([0-9.]+ ?[0-9 .]*)+$/,
        regexText: perfil.etiquetas.lbRegexText,
        validator: function (val) {
            if (val <= 0) {
                return false
            } else {
                return true
            }
        },
        allowNegative: false,
        anchor: '95%'
    });
    cartaum = new Ext.form.ComboBox({
        id: 'cartaum',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        store: stum,
        valueField: 'idunidadmedida',
        hiddenName: 'idumedidarendimiento',
        displayField: 'denominacionunidadmedida',
        anchor: '100%',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        triggerAction: 'all',
        fieldLabel: "UM de la producción",
        enableKeyEvents: true,
        regex: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z-áéíóúÁÉÍÓÚñÑ ]*)+$/,
        regexText: perfil.etiquetas.lbRegexText,
        listeners: {
            select: function () {
            }
        }
    });

    cartavariable = new Ext.form.ComboBox({
        id: 'cartavariable',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        store: stvariableAddCarta,
        valueField: 'idvariable',
        hiddenName: 'idvariable',
        displayField: 'denominacionvariable',
        anchor: '100%',
        typeAhead: true,
        mode: 'local',
        allowBlank: false,
        triggerAction: 'all',
        fieldLabel: 'Unidad de medida - Variable de control',
        enableKeyEvents: true,
        //regex: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z-áéíóúÁÉÍÓÚñÑ ]*)+$/,
        regexText: perfil.etiquetas.lbRegexText,
        listeners: {
            select: function () {
                //cbumcapacidad.setValue();
            }
        }
    });

    //Se crea el formulario
    fpAddCarta = new Ext.FormPanel({
        closeAction: 'destroy',
        labelWidth: 75,
        frame: true,
        autoHeight: true,
        labelAlign: 'top',
        items: [{}],
        listeners: {
            render: function () {
            }
        }
    });

    //*************ventana Add carta tecnologica********
    winaddcarta = new Ext.Window({
        modal: true,
        id: 'winaddcarta',
        constrain: true,
        closeAction: 'destroy',
        width: 500,
        layout: 'fit',
        title: perfil.etiquetas.lbAdicionarCT,
        buttons: [{
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    winaddcarta.destroy();
                }
            }, {
                id: 'btnaplicarcarta',
                iconCls: 'aplicar',
                tooltip: perfil.etiquetas.msgGuardarSinCerrar,
                text: perfil.etiquetas.lbAplicar,
                handler: function () {
                    AddCarta(true);
                }
            }, {
                id: 'btnaceptarcarta',
                iconCls: 'aceptar',
                tooltip: perfil.etiquetas.msgGuardaryCerrar,
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    cartaproducto.enable();
                    Ext.getCmp('cartaum').enable();
                    Ext.getCmp('cartavariable').enable();

                    AddCarta(false);
                }
            }],
        listeners: {
            beforeshow: function (w) {
                stvariableAddCarta.load({
                    params: {
                        identidad: id_entidad_seleccionada
                    }
                });
            }
        }
    });

    //Se crean los items fijos del formulario
    var item = ({
        layout: 'column',
        items: [{
                layout: 'form',
                columnWidth: 1,
                items: cartadenominacion
            }]
    });
    fpAddCarta.add(item);

    item = ({
        layout: 'column',
        items: [{
                layout: 'form',
                columnWidth: 1,
                items: cbPlan
            }]
    });
    fpAddCarta.add(item);

    item = ({
        layout: 'column',
        items: [{
                layout: 'form',
                columnWidth: 0.5,
                items: cartaproducto
            }, {
                layout: 'form',
                columnWidth: 0.5,
                items: cartaum
            }]
    });
    fpAddCarta.add(item);
    item = ({
        layout: 'column',
        items: [{
                layout: 'form',
                columnWidth: 0.5,
                items: cartarendimiento
            }, {
                layout: 'form',
                columnWidth: 0.5,
                items: cartavariable
            }]
    });
    fpAddCarta.add(item);

    //Se construyen los campos dinamicos
    cantCampos = dinamicField.cm.length;
    var field = null;
    for (i = 0; i < cantCampos; i++) {
        if (dinamicField.cm[i].edit.xtype == 'combo') {

            field = new Ext.form.ComboBox({
                itemId: dinamicField.cm[i].dataIndex
            });

            item0 = Object.keys(dinamicField.cm[i].edit.store[0]);
            var almacen = new Ext.data.SimpleStore({fields: item0});
            var valores = [];
            for (var j = 0; j < dinamicField.cm[i].edit.store.length; j++) {
                valores.push(new Ext.data.Record(dinamicField.cm[i].edit.store[j]));
            }
            almacen.add(valores);

            Object.assign(field, dinamicField.cm[i].edit);
            field.tooltip = dinamicField.cm[i].header;
            field.store = [{}];
            field.store = almacen;
            field.allowBlank = false;
            field.anchor = '100%';
            field.on('focus', function (f) {
                f.selectText();
            });
            //field.setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().get(dinamicField.cm[i].dataIndex));

        } else if (dinamicField.cm[i].edit.xtype == 'datefield') {
            field = new Ext.form.DateField({
                itemId: dinamicField.cm[i].dataIndex
            });
            Object.assign(field, dinamicField.cm[i].edit);
            field.allowBlank = false;
            field.anchor = '100%';
            //field.setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().get(dinamicField.cm[i].dataIndex));

        } else if (dinamicField.cm[i].edit.xtype == 'numberfield') {
            field = new Ext.form.NumberField({
                itemId: dinamicField.cm[i].dataIndex
            });
            Object.assign(field, dinamicField.cm[i].edit);
            field.anchor = '100%';

            field.allowBlank = false;
            //field.setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().get(dinamicField.cm[i].dataIndex));

        } else if (dinamicField.cm[i].edit.xtype == 'textfield') {
            regexObj = new RegExp(dinamicField.cm[i].edit.regex);
            field = new Ext.form.TextField({
                itemId: dinamicField.cm[i].dataIndex
            });
            Object.assign(field, dinamicField.cm[i].edit);
            field.regex = /^([a-zA-Z0-9áéíóúñüÑ.]+ ?[a-zA-Z0-9áéíóúñüÑ]*)+$/;
            field.allowBlank = false;
            field.anchor = '100%';
            //field.setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().get(dinamicField.cm[i].dataIndex));
        }
        if (accion == 'modificar' || accion == 'duplicar') {
            field.setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().get(dinamicField.cm[i].dataIndex));
        }

        //Construyo por cada columna un campo dinamico
        item = ({
            layout: 'column',
            items: [{
                    layout: 'form',
                    columnWidth: 1,
                    items: field
                }]
        });
        fpAddCarta.add(item);
    }

    //Actualio los  valores de los campos del formulario para la carta tecnologica seleccionada
    if (accion == 'modificar' || accion == 'duplicar') {
        Ext.getCmp('btnaplicarcarta').hide();
        actualizarCamposFormularioCarta();
        if (accion == 'modificar') {
            var hiddenfield = new Ext.form.Hidden({
                id: jrStGpCT.jsonData.llaveprimaria,
                itemId: jrStGpCT.jsonData.llaveprimaria
            });
            hiddenfield.setValue((Ext.getCmp('gpCT').getSelectionModel().getSelected()).data[jrStGpCT.jsonData.llaveprimaria]);
            fpAddCarta.add(hiddenfield);
            winaddcarta.setTitle(perfil.etiquetas.lbModificarCT);
        } else {
            winaddcarta.setTitle(perfil.etiquetas.lbDuplicarCT);
        }


    }

    //Renderizo el formulario en la ventana
    fpAddCarta.doLayout();
    winaddcarta.add(fpAddCarta);
    winaddcarta.doLayout();
    winaddcarta.show();

    function AddCarta(aplicar) {
        denominacion = cartadenominacion.getValue();
        if (fpAddCarta.getForm().isValid()) {
            if (addomodCT == 0) {
                mensajeBox = Ext.MessageBox.show({
                    title: perfil.etiquetas.lbEspere,
                    msg: perfil.etiquetas.lbGuardandoCT,
                    width: 300,
                    wait: true,
                    progress: true,
                    closable: false,
                    animEl: 'mb6'
                });
            } else if (duplicar == 1) {
                mensajeBox = Ext.MessageBox.show({
                    title: perfil.etiquetas.lbEspere,
                    msg: perfil.etiquetas.lbDuplicandoCT,
                    width: 300,
                    wait: true,
                    progress: true,
                    closable: false,
                    animEl: 'mb6'
                });
            } else if (addomodCT != 0) {
                mensajeBox = Ext.MessageBox.show({
                    title: perfil.etiquetas.lbEspere,
                    msg: perfil.etiquetas.lbModificandoCT,
                    width: 300,
                    wait: true,
                    progress: true,
                    closable: false,
                    animEl: 'mb6'
                });
            }
            if (accion == 'modificar' || accion == 'duplicar') {
                idcarta = (Ext.getCmp('gpCT').getSelectionModel().getSelected()).data.idcartatecnologica;

            } else {
                idcarta = undefined;
            }
            fpAddCarta.getForm().submit({
                url: 'adicionarCarta',
                params: {
                    accion: accion,
                    idcartatecnologica: idcarta,
                    idindicador: idproducto,
                    denominacion: denominacion,
                    idtipomodelo: Ext.getCmp('cbTipoCarta').getValue(),
                    identidad: id_entidad_seleccionada,
                    identidadcrea: identidadLog
                },
                failure: function (form, action) {
                    responseData = action.result;
                    if (responseData.mensaje == 'Add') {
                        mensaje = perfil.etiquetas.msgAdicionarCt;
                    }
                    if (responseData.mensaje == 'Dup') {
                        duplicar = 0;
                        mensaje = perfil.etiquetas.msgDuplicarCT;
                    }
                    if (responseData.mensaje == 'Mod') {
                        mensaje = perfil.etiquetas.lbMsgInfModificarCt;
                    }
                    if (responseData.codMsg == 24) {
                        mostrarMensaje(1, mensaje);
                        if (aplicar) {
                            fpAddCarta.getForm().reset();
                            Ext.getCmp('gpCT').getStore().reload();
                        } else {
                            accion = '';
                            fpAddCarta.getForm().reset();
                            winaddcarta.close();
                            Ext.getCmp('gpCT').getStore().reload();
                        }
                    } else {
                        mostrarMensaje(2, responseData.mensaje);
                        //Ext.getCmp('gpCT').getStore().reload();
                    }
                    mensajeBox.hide();
                }
            });
        }
    }
}

function actualizarCamposFormularioCarta() {
    Ext.getCmp('cartadenominacion').setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().data.denominacion);
    Ext.getCmp('cartaproducto').setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().data.denoindicador);
    idproducto = Ext.getCmp('gpCT').getSelectionModel().getSelected().data.idindicador;
    Ext.getCmp('cartarendimiento').setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().data.valorrendimiento);
    Ext.getCmp('cartaum').setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().data.idumedidarendimiento);
    Ext.getCmp('cartavariable').setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().data.idvariablecontrol);
    Ext.getCmp('cbPlan').setValue(Ext.getCmp('gpCT').getSelectionModel().getSelected().data.idmodelo);

    cartaproducto.enable();
    Ext.getCmp('cartaum').enable();
    Ext.getCmp('cartavariable').enable();

    if (accion == 'modificar') {
        if (Ext.getCmp('gpCT').getSelectionModel().getSelections().length == 1) {
            if (smGpCT.getSelected().data.enuso == 1) {
                cartaproducto.disable();
                Ext.getCmp('cartaum').disable();
                Ext.getCmp('cartavariable').disable();
            }
        }
    }
}

function cambiarEstado(est) {
    /* desactivado o activado */
//    var recordsSel = Ext.getCmp('gpCT').getSelectionModel().getSelections();
    /* if (recordsSel.length == 0) {
     if (est == 1) {
     mostrarMensaje(2, perfil.etiquetas.msgActivarCT, activardesactivar);
     } else {
     mostrarMensaje(2, perfil.etiquetas.msgDesactivarCT, activardesactivar);
     }
     } else {
     if (est == 1) {
     mostrarMensaje(2, perfil.etiquetas.lbMsgConfirmarActivarCt, activardesactivar);
     } else {
     mostrarMensaje(2, perfil.etiquetas.lbMsgConfirmarDesactivarCt, activardesactivar);
     }
     }*/
    activardesactivar('ok', est);
}

function activardesactivar(btnPresionado, est) {
    var recordsSel1 = Ext.getCmp('gpCT').getSelectionModel().getSelections();
    var recordsSel = [];
    for (var i = 0; i < recordsSel1.length; i++) {
        if (recordsSel1[i].data.idaprobacion != 1) {
            recordsSel.push(recordsSel1[i]);
        }
    }
    var desaprobado = false;
    if (recordsSel1.length != recordsSel.length) {
        desaprobado = true;
    }

    if (btnPresionado == 'ok') {
        var cartas = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++) {

                cartas.push(
                        recordsSel[i].data.idcartatecnologica
                        );

            }
        }

        if (cartas.length > 0) {

            Ext.Ajax.request({
                url: 'activarCartaTecnologica',
                params: {
                    cartas: Ext.encode(cartas),
                    activar: est
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (desaprobado) {
                        if (recordsSel.length == 0) {
                            mostrarMensaje(2, 'La carta tecnológica no se activó porque está desaprobada.');
                        } else {
                            mostrarMensaje(2, 'Algunas cartas tecnológicas no se activaron o desactivaron porque están desaprobadas.');
                        }
                    }
                    if (responseData.codMsg == 24) {
                        if (est == 1) {
                            if (recordsSel.length == 1) {
                                mostrarMensaje(2, perfil.etiquetas.msgAceptar_ActivarCTS);
                            } else {
                                mostrarMensaje(2, perfil.etiquetas.msgAceptar_ActivarCT);
                            }
                        } else {
                            if (recordsSel.length == 1) {
                                mostrarMensaje(2, perfil.etiquetas.msgAceptar_DesactivarCTS);
                            } else {
                                mostrarMensaje(2, perfil.etiquetas.msgAceptar_DesactivarCT);
                            }
                        }
                        stCT.reload();
                    } else
                        mostrarMensaje(2, 'Ha ocurrido un error.');
                }
            });
        }
    }
    if (desaprobado) {
        if (recordsSel.length == 0) {
            mostrarMensaje(2, 'La carta tecnológica no se activó porque está desaprobada.');
        } else {
            mostrarMensaje(2, 'Algunas cartas tecnológicas no se activaron o desactivaron porque están desaprobadas.');
        }
    }

// }
}

function ModificarCarta() {
    if (Ext.getCmp('gpCT').getSelectionModel().getSelections().length <= 0) {
        mostrarMensaje(1, perfil.etiquetas.lbMsgInfSeleccionarActividad);
    } else if (Ext.getCmp('gpCT').getSelectionModel().getSelections().length >= 2) {
        mostrarMensaje(1, 'Debe seleccionar solo una carta tecnológica.');
    } else {
        mensaje = perfil.etiquetas.lbMsgInfModificarCt;
        accion = 'modificar';
        cargarDatosAdicionar();
    }
}

function EliminarCarta() {
    if (Ext.getCmp('gpCT').getSelectionModel().getSelections().length <= 0) {
        mostrarMensaje(1, perfil.etiquetas.lbMsgSeleccionarCt);
    } else {
        mostrarMensaje(2, perfil.etiquetas.lbMsgConfirmarEliminarCt, eliminarCartasSeleccionadas);
    }
}

function eliminarCartasSeleccionadas(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        var recordsSel = Ext.getCmp('gpCT').getSelectionModel().getSelections(), cartElim = [], varElim = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++) {
                cartElim.push(recordsSel[i].data.idcartatecnologica);
                varElim.push(recordsSel[i].data.idvariablecontrol);
            }

            Ext.Ajax.request({
                url: 'eliminarCarta',
                params: {
                    cartas: Ext.encode(cartElim),
                    variables: Ext.encode(varElim)
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 24) {
                        Ext.getCmp('gpCT').getStore().reload();
                        mostrarMensaje(2, 'La(s) carta(s) seleccionada(s) desaprobada(s) y no en uso ha(n) sido eliminada(s) satisfactoriamente.');

                    } else if (responseData.mensaje != null)
                        mostrarMensaje(2, responseData.mensaje);
                    else
                        mostrarMensaje(2, 'Ha ocurrido un error.');
                }
            });
        }
    }
}

function duplicarCarta() {
    if (Ext.getCmp('gpCT').getSelectionModel().getSelections().length <= 0) {
        mostrarMensaje(1, perfil.etiquetas.lbMsgInfSeleccionarActividad);
    } else if (Ext.getCmp('gpCT').getSelectionModel().getSelections().length >= 2) {
        mostrarMensaje(1, 'Debe seleccionar solo una carta tecnológica.');
    } else {
        accion = 'duplicar';
        mensaje = perfil.etiquetas.msgDuplicarCT;
        cargarDatosAdicionar();
    }
}

function cambiarAprobacion(aprobacion, rector) {
    var recordsSel = Ext.getCmp('gpCT').getSelectionModel().getSelections(), cartas = [], idcartas = [];
    var recordLength = recordsSel.length;
    if (aprobacion == 1) {
        for (var i = 0; i < recordsSel.length; i++) {
            if (recordsSel[i].data.enuso == 0) {
                if (!(recordsSel[i].data.idaprobacion >= 4 && !rector)) {
                    if (recordsSel[i].data.idestructura == nodoEst.id) {
                        cartas.push({
                            idcarta: recordsSel[i].data.idcartatecnologica,
                            identidad: recordsSel[i].data.idestructura,
                            idvariablecontrol: recordsSel[i].data.idvariablecontrol,
                            idmodelo: recordsSel[i].data.idmodelo,
                            uso: recordsSel[i].data.enuso
                        });
                    }
                }

            }
        }
    } else {
        for (var i = 0; i < recordsSel.length; i++) {
            if (!(recordsSel[i].data.idaprobacion >= 4) || (recordsSel[i].data.idaprobacion == 3 && !rector)) {
                if (recordsSel[i].data.idestructura == nodoEst.id) {
                    cartas.push({
                        idcarta: recordsSel[i].data.idcartatecnologica,
                        identidad: recordsSel[i].data.idestructura,
                        idvariablecontrol: recordsSel[i].data.idvariablecontrol,
                        idmodelo: recordsSel[i].data.idmodelo,
                        uso: recordsSel[i].data.enuso
                    });
                }
            }

        }
    }

    if (cartas.length != 0) {
        /*if (recordsSel.length == 0) {
         if (aprobacion == 3 || aprobacion == 4) {
         mostrarMensaje(2, perfil.etiquetas.msgAprobarCT, aprobardesaprobar);
         } else {
         mostrarMensaje(2, perfil.etiquetas.msgDesaprobarCT, aprobardesaprobar);
         }
         } else {
         if (aprobacion == 3 || aprobacion == 4) {
         mostrarMensaje(2, perfil.etiquetas.lbMsgConfirmarAprobarCt, aprobardesaprobar);
         
         } else {
         mostrarMensaje(2, perfil.etiquetas.lbMsgConfirmarDesaprobarCt, aprobardesaprobar);
         }
         }*/
        aprobardesaprobar('ok', recordLength);
    } else {
        mostrarMensaje(2, 'No hay cartas tecnológicas válidas para aprobar o desaprobar');
    }

    function aprobardesaprobar(btnPresionado, recordLength) {
        if (btnPresionado == 'ok') {

            Ext.Ajax.request({
                url: 'aprobarCartaTecnologica',
                params: {
                    cartas: Ext.encode(cartas),
                    idaprobacion: aprobacion
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 24) {
                        if (aprobacion == 3 || aprobacion == 4) {
                            if (recordLength == 1) {
                                mostrarMensaje(2, perfil.etiquetas.lbMsgInformacionAprobarCtS);
                            } else {
                                mostrarMensaje(2, perfil.etiquetas.lbMsgInformacionAprobarCt);
                            }
                        } else {
                            if (recordLength == 1) {
                                mostrarMensaje(2, perfil.etiquetas.lbMsgInformacionDesaprobarCtS);
                            } else {
                                mostrarMensaje(2, perfil.etiquetas.lbMsgInformacionDesaprobarCt);
                            }
                        }
                    } else if (responseData.codMsg == 23) {
                        if (recordsSel.length == 1) {
                            if (aprobacion == 3 || aprobacion == 4) {
                                mostrarMensaje(2, "La carta no pudo ser aprobada porque no tiene actividades, no tiene una actividad 'día cero', o alguna de sus actividades no tiene duración definida.");
                            } else {
                                mostrarMensaje(2, "La carta no pudo ser desaprobada satisfactoriamente.");
                            }
                        } else {
                            if (aprobacion == 3 || aprobacion == 4) {
                                mostrarMensaje(2, "Alguna de las cartas no fueron aprobadas porque no tienen actividades, no tienen una actividad 'día cero', o alguna de sus actividades no tiene duración definida.");
                            } else {
                                mostrarMensaje(2, "Las cartas no se pudieron desaprobar satisfactoriamente.");
                            }

                        }
                    } else {
                        mostrarMensaje(2, 'Ocurrió un error. No se pudo realizar la operación.');
                    }
                    stCT.reload();
                }
            });
        }
    }
}
