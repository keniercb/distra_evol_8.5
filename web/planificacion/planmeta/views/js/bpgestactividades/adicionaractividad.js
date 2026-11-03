winAddAct = null, add = true, addhijo = false, fpActividad = null, fpActividadMod = null;
//auxiliares
b = true;
aceptar = false;
//auxiliares
var addNewRecord;
idp = null;
//Máscara para visualizar indistintamente

var cbEspecialidadCompartidaChange = false;

//initaddactividad = function () {
//
//    Ext.apply(Ext.form.VTypes, {
//        validarEspaciosEnBlanco: function (value, field) {
//            return (!(/^\s+|\s+$/.test(value)));
//        },
//        validarEspaciosEnBlancoText: 'No se admite el uso del espacio antes ni después del valor del campo.'
//    });
//
//    mymask = new Ext.LoadMask(
//            Ext.getBody(), {
//        msg: perfil.etiquetas.lbCargando
//    });
//    pbLoad = new Ext.ProgressBar({
//        text: perfil.etiquetas.lbEliminando,
//        id: 'pbar2',
//        cls: 'custom'
//    });
//
//    wnLoad = new Ext.Window({
//        title: perfil.etiquetas.lbEspere,
//        layout: 'fit',
//        width: 320,
//        height: 50,
//        constrain: true,
//        closable: false,
//        resizable: false,
//        plain: true,
//        modal: true,
//        items: [pbLoad],
//        closeAction: 'hide',
//        listeners: {
//            show: function () {
//                pbLoad.text = 'Cargando datos...';
//                pbLoad.wait({
//                    interval: 200,
//                    increment: 15,
//                    fn: function () {
//                    }
//                });
//            },
//            hide: function () {
//                pbLoad.reset();
//            }
//        }
//    });
//
//    tfespecialidad = new Ext.form.TextField({
//        id: 'tfespecialidad',
//        anchor: '100%',
//        fieldLabel: perfil.etiquetas.lbEspecialidad,
//        disabled: true
//    });
//
//    stformato = new Ext.data.Store({
//        url: 'listarFormatos',
//        reader: new Ext.data.JsonReader({
//            root: 'data',
//            id: 'idformato'
//        }, [{
//                name: 'nombre'
//            }, {
//                name: 'idformato'
//            }]),
//        listeners: {
//            load: function (st) {
//                if (st.getCount() == 0) {
//                    mostrarMensaje(1, 'No existen formatos configurados para este subsistema.');
//                    winAddAct.hide();
//                }
//            }
//        }
//    });
//    //*********Combo formato********************
//    cbformato = new Ext.form.ComboBox({
//        emptyText: perfil.etiquetas.lbSeleccione,
//        loadingText: perfil.etiquetas.lbCargando,
//        id: 'cbformato',
//        anchor: '95%',
//        readOnly: true,
//        displayField: 'nombre',
//        valueField: 'idformato',
//        hiddenName: 'idformato',
//        allowBlank: false,
//        listeners: {
//            select: function (c, r, i) {
//                if (idFormato == null) {
//                    guardarFormatopredefinido(r);
//                    longnivel((smGpGestAct.getSelected() && addhijo) ? gpGestAct.getStore().getNodeDepth(smGpGestAct.getSelected()) + 1 : 1, r.data.idformato);
//                } else {
//                    longnivel(1, idFormato);
//                }
//                if (smGpGestAct.getSelected() && addhijo) {
//                    Ext.getCmp('codpadre').setValue(smGpGestAct.getSelected().data.codigo);
//                } else {
//                    abrenivel(Ext.getCmp('cbformato').getValue(), 1);
//                    Ext.getCmp('codpadre').setValue(codEspecialidad);
//                }
//            }
//        },
//        store: stformato,
//        mode: 'local',
//        triggerAction: 'all',
//        fieldLabel: perfil.etiquetas.lbFormato
//    });
//    Fila = Ext.data.Record.create([{
//            name: 'idmodelo',
//            type: 'string'
//        }, {
//            name: 'denominacion',
//            type: 'string'
//        }]);
//
//
//    stmodelo = new Ext.data.Store({
//        url: 'listarModelos',
//        //autoLoad: true,
//        reader: new Ext.data.JsonReader({
//            root: 'data'
//        }, [{
//                name: 'denominacion'
//            }, {
//                name: 'idmodelo'
//            }]),
//        listeners: {
//            load: function (st, rc, obj) {
//                addNewRecord();
//                try {
//                    cbmodelo1.setValue(gpGestAct.getSelectionModel().getSelected().data.idmodelo);
//                } catch (e) {
//                }
//            },
//            beforeload: function () {
//                stmodelo.baseParams.esgestionaract = true;
//            }
//        }
//    });
//    //stmodelo.load();
//
//    stmodelo2 = new Ext.data.Store({
//        url: 'listarModelos',
//        //autoLoad: true,
//        reader: new Ext.data.JsonReader({
//            root: 'data'
//        }, [{
//                name: 'denominacion'
//            }, {
//                name: 'idmodelo'
//            }]),
//        listeners: {
//            load: function (st, rc, obj) {
//                addNewRecord2();
//                try {
//                    cbmodeloparasalida.setValue(gpGestAct.getSelectionModel().getSelected().data.idmodelosalida);
//                } catch (e) {
//                }
//            },
//            beforeload: function () {
//                stmodelo2.baseParams.esgestionaract = true;
//            }
//        }
//    });
//    //stmodelo2.load();
//
//    function addNewRecord() {
//        var p = new Fila({
//            idmodelo: null,
//            denominacion: perfil.etiquetas.lbNinguno
//        });
//        stmodelo.insert(0, p);
//    }
//
//    function addNewRecord2() {
//        var p = new Fila({
//            idmodelo: null,
//            denominacion: perfil.etiquetas.lbNinguno
//        });
//        stmodelo2.insert(0, p);
//    }
//
//    //*********Combo modelo********************
//    cbmodelo = new Ext.form.ComboBox({
//        emptyText: perfil.etiquetas.lbSeleccione,
//        loadingText: perfil.etiquetas.lbCargando,
//        id: 'cbmodelo',
//        anchor: '100%',
//        disabled: true,
//        typeAhead: true,
//        displayField: 'denominacion',
//        valueField: 'idmodelo',
//        hiddenName: 'idmodelo',
//        allowBlank: true,
//        store: stmodelo,
//        mode: 'local',
//        triggerAction: 'all',
//        fieldLabel: perfil.etiquetas.lbPlan
//    });
//    //*********Nivel*************************
//    nivel = new Ext.form.TextField({
//        id: 'nivel',
//        anchor: '95%',
//        fieldLabel: perfil.etiquetas.lbNivel2,
//        disabled: true
//    });
//
//    ////********************Cantidad de digitos***********
//    cantdig = new Ext.form.TextField({
//        xtype: 'numberfield',
//        id: 'cantdig',
//        anchor: '95%',
//        fieldLabel: perfil.etiquetas.lbDigitos,
//        disabled: true
//    });
//    //***********Preci0****************
//    precio = new Ext.form.TextField({
//        xtype: 'numberfield',
//        id: 'precio',
//        anchor: '95%',
//        fieldLabel: perfil.etiquetas.lbPrecio,
//        disabled: true
//
//    });
//
//    //******Denominacion**********************
//    denominacion = new Ext.form.TextField({
//        xtype: 'textfield',
//        id: 'denominacion',
//        prevTab: 'btnaceptar1',
//        fieldLabel: 'Denominación',
//        anchor: '99%',
//        //regex: /^([a-zA-ZáéíóúñüÑÁÉÍÓÚ\-\:\/\,\_\-\.\d()"'.]([a-zA-ZáéíóúñüÑÁÉÍÓÚ\-\ \:\/\,\_\-\.\d()"'.]* ?[a-zA-ZáéíóúñüÑÁÉÍÓÚ\-\:\/\,\_\-\.\d()"'.])*)+$/,
//        //maskRe: /^([a-zA-ZáéíóúñüÑÁÉÍÓÚ\-\:\/\,\_\-\.\d()"'.\s])$/,
//        //regexText: 'Solo admite caracteres alfanuméricos y el(los) carácter(es) especial(es) (/_-).',
//        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
//        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
//        vtype: 'validarEspaciosEnBlanco',
//        regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales(-),(_).',
//        allowBlank: false,
//        maxLength: 255,
//        maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
//        blankText: perfil.etiquetas.lbRequerido
//    });
//
//    //*******************Codigo padre*********************
//    codpadre = new Ext.form.TextField({
//        xtype: 'textfield',
//        id: 'codpadre',
//        disabled: true,
//        style: 'text-align:right',
//        anchor: '98%',
//        fieldLabel: perfil.etiquetas.lbCodigoPadre
//
//    });
//    //****************Codigo***********************
//    tfcodigo = new Ext.form.TextField({
//        xtype: 'textfield',
//        id: 'tfcodigo',
//        //maskRe: /^([0-9]+ ?[0-9]*)+$/,
//        regex: /^([0-9]+ ?[0-9]*)+$/,
//        maxLengthText: 'El tamaño requerido es 2 dígito(s).',
//        regexText: 'Solo admite números enteros positivos.',
//        anchor: '100%',
//        fieldLabel: 'Código',
//        allowBlank: false,
//        blankText: perfil.etiquetas.lbRequerido
//    });
//    //******Descripcion**********************
////    descripcion = new Ext.form.TextArea({
////        id: 'descripcion',
////        fieldLabel: perfil.etiquetas.lbDescripcion,
////        anchor: '100%',
////        maxLength: 255,
//////        allowBlank: false,
////        //maxLengthText: etiqueta.msgMaxLengthTextDenominacion,
////
//////        xtype: 'textarea',
//////        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,.:/()_-])$/,
//////        regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales(-),(_).',
//////        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-]+)([\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.])*$/,
//////        vtype: 'validarEspaciosEnBlanco',
////        editable: false
////    });
//    descripcion = new Ext.form.TextField({
////        xtype: 'textfield',
//        id: 'descripcion',
//        //maskRe: /^([0-9]+ ?[0-9]*)+$/,
//        regex: /^([0-9]+ ?[0-9]*)+$/,
//        maxLengthText: 'El tamaño requerido es 2 dígito(s).',
//        regexText: 'Solo admite números enteros positivos.',
//        anchor: '100%',
//        fieldLabel: 'Código',
//        allowBlank: false,
//        blankText: perfil.etiquetas.lbRequerido
//    });
//
////    descripcion = new Ext.form.TextArea({
////        id: 'descripcion',
////        fieldLabel: perfil.etiquetas.lbDescripcion,
////        anchor: '100%',
////        maxLength: 1000,
////        maxLengthText: 'etiqueta.msgMaxLengthTextDenominacion',
////        allowBlank: false,
////        disabled: true,
////        blankText: 'etiqueta.lbmsgCampoObligatorio',
////        style: {textTransform: 'lowercase'}
////    });
//
//    //*********FORMPANEL DE LA VENTANA PARA ADICIONAR O MODIFICAR LA ACTIVIDAD************
//    /*fpActividad = new Ext.FormPanel({
//     labelWidth: 75,
//     frame: true,
//     autoHeight: true,
//     labelAlign: 'top',
//     id: 'id_formactividad',
//     items: [{
//     layout: 'column',
//     items: [{
//     layout: 'form',
//     columnWidth: 0.3,
//     items: cbformato
//     }, {
//     layout: 'form',
//     columnWidth: 0.1,
//     items: nivel
//     }, {
//     layout: 'form',
//     columnWidth: 0.1,
//     items: cantdig
//     }, {
//     layout: 'form',
//     columnWidth: 0.5,
//     items: tfespecialidad
//     }]
//     }, {
//     layout: 'column',
//     items: [{
//     layout: 'form',
//     columnWidth: 0.6,
//     items: denominacion
//     }, {
//     layout: 'form',
//     columnWidth: 0.2,
//     items: codpadre
//     }, {
//     layout: 'form',
//     columnWidth: 0.2,
//     items: tfcodigo
//     }]
//
//     },
//     {
//     layout: 'form',
//     items: cbRector,
//     id: 'fpCbRector'
//     }, {
//     layout: 'form',
//     items: cbDemandantes,
//     id: 'fpCbDemandantes'
//     }, {
//     layout: 'form',
//     items: cbEspecialidadCompartida,
//     id: 'fpCbCompartida'
//     }, {
//     layout: 'form',
//     items: cbmodelo,
//     id: 'fpCbModelo'
//     }, {
//     layout: 'form',
//     items: descripcion
//     }, {
//     xtype: 'hidden',
//     id: 'idindicador'
//     }, {
//     xtype: 'hidden',
//     id: 'idact'
//     }, {
//     xtype: 'hidden',
//     name: 'idpadre',
//     id: 'idpadre'
//     }, {
//     xtype: 'hidden',
//     id: 'cod_padre'
//     }, {
//     xtype: 'hidden',
//     id: '_is_leaf'
//     }, {
//     xtype: 'hidden',
//     id: 'padre'
//     }, {
//     xtype: 'hidden',
//     id: 'codigoact'
//     }, {
//     xtype: 'hidden',
//     id: 'idact'
//     }, {
//     xtype: 'hidden',
//     id: 'idactorigen'
//     }, {
//     xtype: 'hidden',
//     id: 'den_especialidad'
//     }]
//
//     });*/
//    //****************FUNCIONES*********************************/
//    //****************FUNCION PARA CONSTRUIR LA VENTANA MODIFICAR O ADICIONAR ACTIVIDAD***********************
//
//    //*********ADICIONAR ACTIVIDAD*******************
//    upFpGest = function () {
//        fpActividad.getForm().reset();
//        if (gpGestAct.getSelectionModel().getSelected() != undefined)
//            Ext.getCmp('cbmodelo').setValue(gpGestAct.getSelectionModel().getSelected().data.idmodelo);
//        if (add) {
//            if (addhijo) {
//                Ext.getCmp('cbformato').setValue(gpGestAct.getSelectionModel().getSelected().data.idformato);
//                Ext.getCmp('cbformato').disable();
//                Ext.getCmp('tfespecialidad').setValue(gpGestAct.getSelectionModel().getSelected().data.denespecialidad);
//                Ext.getCmp('tfespecialidad').disable();
//                Ext.getCmp('idpadre').setValue(gpGestAct.getSelectionModel().getSelected().data.idactividad);
//                Ext.getCmp('padre').setValue(gpGestAct.getSelectionModel().getSelected().data.codigo);
//                longnivel((smGpGestAct.getSelected() && addhijo) ? Number(gpGestAct.getSelectionModel().getSelected().data.nivel) + 1 : 1, smGpGestAct.getSelected().data.idformato);
//                abrenivel(Ext.getCmp('cbformato').getValue(), Number(gpGestAct.getSelectionModel().getSelected().data.nivel) + 1);
//                Ext.getCmp('tfcodigo').enable();
//                Ext.getCmp('codpadre').setValue(gpGestAct.getSelectionModel().getSelected().data.codigo);
//                Ext.getCmp('codpadre').disable();
//                Ext.getCmp('idact').setValue(null);
//                Ext.getCmp('idactorigen').setValue(null);
//                mensaje = perfil.etiquetas.lbAdicinandoAI;
//            } else {
//                Ext.getCmp('codpadre').setValue(codEspecialidad);
//                Ext.getCmp('idact').setValue(null);
//                Ext.getCmp('idpadre').setValue(null);
//                Ext.getCmp('idactorigen').setValue(null);
//                mensaje = perfil.etiquetas.lbAdicinando;
//            }
//        } else if (duplicar) {
//            Ext.getCmp('cbformato').setValue(gpGestAct.getSelectionModel().getSelected().data.idformato);
//            Ext.getCmp('cbformato').disable();
//            Ext.getCmp('tfespecialidad').setValue(gpGestAct.getSelectionModel().getSelected().data.denespecialidad);
//            Ext.getCmp('tfespecialidad').disable();
//            Ext.getCmp('codpadre').disable();
//            (gpGestAct.getStore().getNodeDepth(smGpGestAct.getSelected()) == null) ?
//                    Ext.getCmp('idpadre').setValue(null) :
//                    Ext.getCmp('idpadre').setValue(gpGestAct.getSelectionModel().getSelected().data.idpadre);
//            abrenivel(Ext.getCmp('cbformato').getValue(), Number(gpGestAct.getSelectionModel().getSelected().data.nivel));
//            Ext.getCmp('idactorigen').setValue(gpGestAct.getSelectionModel().getSelected().data.idactividad);
//            Ext.getCmp('cbmodelo').setValue(gpGestAct.getSelectionModel().getSelected().data.idmodelo);
//            mensaje = perfil.etiquetas.lbModificando;
//        } else {
//            Ext.getCmp('cbformato').setValue(gpGestAct.getSelectionModel().getSelected().data.idformato);
//            Ext.getCmp('cbformato').disable();
//            Ext.getCmp('tfespecialidad').setValue(gpGestAct.getSelectionModel().getSelected().data.denespecialidad);
//            Ext.getCmp('tfespecialidad').disable();
//            Ext.getCmp('codpadre').disable();
//            (gpGestAct.getStore().getNodeDepth(smGpGestAct.getSelected()) == null) ?
//                    Ext.getCmp('idpadre').setValue(gpGestAct.getSelectionModel().getSelected().data.idactividad) :
//                    Ext.getCmp('idpadre').setValue(gpGestAct.getSelectionModel().getSelected().data.idpadre);
//            abrenivel(Ext.getCmp('cbformato').getValue(), gpGestAct.getSelectionModel().getSelected().data.nivel);
//            Ext.getCmp('idact').setValue(gpGestAct.getSelectionModel().getSelected().data.idactividad);
//            mensaje = perfil.etiquetas.lbModificando;
//
//        }
//    };
//    function adicionaractividad(apl) {
//        var value_nfcantdig = cantdig.getValue();
//        var value_tfnivel = nivel.getValue();
//        var value_hiddenidpadre = Ext.getCmp('idpadre').getValue();
//        var value_hiddencodpadre = Ext.getCmp('padre').getValue();
//
//        if (Ext.getCmp('id_formactividad').getForm().isValid()) {
//            var codbuscar;
//            if (Ext.getCmp('idpadre').getValue() != '') {
//                codbuscar = Ext.getCmp('padre').getValue() + Ext.getCmp('tfcodigo').getValue();
//            }
//
//            var codduplicar;
//            if (Ext.getCmp('codpadre').getValue() != '') {
//                codduplicar = Ext.getCmp('codpadre').getValue() + Ext.getCmp('tfcodigo').getValue();
//            }
//
//            //especialidadesdeman = cbDemandantes.getValue().split(',');
//            especialidadescomp = cbEspecialidadCompartida.getValue().split(',');
//            Ext.getCmp('id_formactividad').getForm().submit({
//                url: 'adicionarActividad',
//                waitMsg: perfil.etiquetas.lbAdicinandoAI,
//                params: {
//                    idactividad: Ext.getCmp('idact').getValue(),
//                    idespecialidad: Ext.getCmp('cbespecialidad').getValue(),
//                    //demandantes: Ext.encode(especialidadesdeman),
//                    compartidas: Ext.encode(especialidadescomp),
//                    idejercicio: cbEjercicio.getValue(),
//                    codigo: Ext.getCmp('tfcodigo').getValue(),
//                    codbuscar: codbuscar,
//                    codduplicar: codduplicar,
//                    idformato: Ext.getCmp('cbformato').getValue()
//
//                },
//                failure: function (form, action) {
//                    responseData = action.result;
//                    if (responseData.mensaje == 'Add')
//                        mensaje = perfil.etiquetas.msgAdicionado;
//                    if (responseData.mensaje == 'Dup')
//                        mensaje = perfil.etiquetas.msgDuplicando1;
//                    if (responseData.mensaje == 'Mod')
//                        mensaje = perfil.etiquetas.msgModificada;
//                    if (responseData.codMsgM == 24 || responseData.codMsgM == 1) {
//                        mostrarMensaje(1, conformarMensaje(mensaje));
//
//                        if (apl && responseData.mensaje == 'Add') {
//                            //  Ext.getCmp('id_formactividad').getForm().reset();
//                            cantdig.setValue(value_nfcantdig);
//                            nivel.setValue(value_tfnivel);
//                            Ext.getCmp('idpadre').setValue(value_hiddenidpadre);
//                            Ext.getCmp('padre').setValue(value_hiddencodpadre);
//                        } else if (apl && responseData.mensaje == 'Dup') {
//                            cantdig.setValue(value_nfcantdig);
//                            nivel.setValue(value_tfnivel);
//                            Ext.getCmp('idpadre').setValue(value_hiddenidpadre);
//                            Ext.getCmp('padre').setValue(value_hiddencodpadre);
//                        } else {
//                            winAddAct.hide();
//                            Ext.getCmp('id_formactividad').getForm().reset();
//                        }
//                        if (!addhijo || !duplicar) {
//                            cbFiltrarNivel.reset();
//                            gpGestAct.getStore().reload({});
//                        } else {
//                            gpGestAct.getStore().reload({});
//                        }
//                        btnModAct.disable();
//                        btnDelAct.disable();
//                        idp = null;
//
//                    } else if (responseData.codMsgM == 22) {
//                        mostrarMensaje(1, "Por favor verifique, el código ya existe en el nivel actual.");
//                    } else {
//                        gpGestAct.getStore().reload({});
//                        btnModAct.disable();
//                        btnDelAct.disable();
//                        idp = null;
//                    }
//                }
//            });
//        } else
//            mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
//    }
//
//    eliminarAct = function () {
//        var long = smGpGestAct.getSelections().length;
//        if (long == 1) {
//            mostrarMensaje(2, perfil.etiquetas.msgSegEliminarActividad, del);
//        } else {
//            mostrarMensaje(2, perfil.etiquetas.msgSegEliminarActividades, del);
//        }
//
//        function del(btnPresionado) {
//            if (btnPresionado == 'ok') {
//                mymask.show()
//                Ext.Ajax.request({
//                    url: 'eliminarActividad',
//                    params: {
//                        idactividad: smGpGestAct.getSelected().id
//
//                    },
//                    callback: function (options, success, response) {
//                        mymask.hide();
//                        responseData = Ext.decode(response.responseText);
//                        if (responseData.codMsgM == 1) {
//                            if (smGpGestAct.getSelected()) {
//                                if (smGpGestAct.getSelected().data._parent == null) {
//                                    gpGestAct.getStore().reload({});
//                                } else
//                                    gpGestAct.getStore().reload({
//                                        params: {
//                                            anode: smGpGestAct.getSelected().data._parent
//                                        }
//                                    });
//                            } else
//                                gpGestAct.getStore().reload({});
//                            mostrarMensaje(1, perfil.etiquetas.msgEliminadoAct);
//                        } else if (responseData.codMsgM == 2) {
//                            mostrarMensaje(1, perfil.etiquetas.msgErrorNoElimTieneRegla);
//                        } else if (responseData.mensaje != null)
//                            mostrarMensaje(3, responseData.mensaje);
//                        else {
//                            mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
//                        }
//                    }
//                });
//            }
//        }
//    };
//    abrenivel = function (f, n) {
//        mymask.show();
//        Ext.Ajax.request({
//            url: 'obtenerNombreYAbreviaturaNivel',
//            params: {
//                nivel: n,
//                idformato: f,
//                idactividad: idactselected
//            },
//            callback: function (options, success, response) {
//                mymask.hide();
//                responseData = Ext.decode(response.responseText);
//                if (responseData.codMsg == 20) {
//                    if (responseData.adicultimonivel) {
//                        cbmodelo.enable();
//                        //Ext.getCmp('fpCbDemandantes').show();
//                        Ext.getCmp('fpCbRector').show();
//                        Ext.getCmp('fpCbCompartida').show();
//                        Ext.getCmp('fpCbModelo').show();
//
//                        Ext.getCmp('cbDemandantes').enable();
//                        Ext.getCmp('cbRector').enable();
//                        Ext.getCmp('cbEspecialidadCompartida').enable();
//                    } else {
//                        //Ext.getCmp('fpCbDemandantes').hide();
//                        Ext.getCmp('fpCbRector').hide();
//                        Ext.getCmp('fpCbCompartida').hide();
//                        Ext.getCmp('fpCbModelo').hide();
//
//                        cbmodelo.disable();
//                        Ext.getCmp('cbDemandantes').disable();
//                        Ext.getCmp('cbRector').disable();
//                        Ext.getCmp('cbEspecialidadCompartida').disable();
//                    }
//                    winAddAct.on('beforeshow', function () {
//                        denominacion.focus(true, 700);
//                        stespecialiddemandante.load();
//                        stespecialidcompartir.load();
//                    });
//                    winAddAct.show('btnAddAct');
//                    Ext.getCmp('nivel').setValue(responseData.abreviatura);
//                    if (responseData.longitud <= 0)
//                        mostrarMensaje(1, perfil.etiquetas.msgOtroNivel, function () {
//                            winAddAct.hide();
//                        });
//                } else {
//                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
//                    fpActividad.destroy();
//                    winAddAct.hide();
//                }
//            }
//        });
//
//    };
//    longnivel = function (n, f) {
//        mymask.show();
//        Ext.Ajax.request({
//            url: 'longNivel',
//            params: {
//                nivel: n,
//                idformato: f
//            },
//            callback: function (options, success, response) {
//                mymask.hide();
//                responseData = Ext.decode(response.responseText);
//                if (responseData.codMsg == 20) {
//                    if (responseData.adicultimonivel) {
//                        cbmodelo.enable();
//                    } else {
//                        cbmodelo.disable();
//                    }
//                    tfcodigo.maxLength = responseData.longitud;
//                    tfcodigo.minLength = responseData.longitud;
//                    tfcodigo.minLengthText = 'El tamaño requerido es ' + responseData.longitud + ' dígito(s).';
//                    tfcodigo.maxLengthText = 'El tamaño requerido es ' + responseData.longitud + ' dígito(s).';
//                    Ext.getCmp('cantdig').setValue(responseData.longitud);
//                    if (responseData.longitud <= 0)
//                        mostrarMensaje(1, perfil.etiquetas.msgOtroNivel, function () {
//                            winAddAct.hide();
//                        });
//                } else {
//                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
//                    fpActividad.destroy();
//                    winAddAct.hide();
//                }
//            }
//        });
//    };
//    function modificarEstado(val) {
//        if (val == 1)
//            return 'Si';
//        return 'No';
//    }
//    ;
//
//    function conformarMensaje(mesg) {
//        mesg = perfil.etiquetas.msg1 + mesg + perfil.etiquetas.msg2;
//        return mesg;
//    }
//
//    function conformarMensajeNorma(mesg) {
//        mesg = perfil.etiquetas.msg11 + mesg + perfil.etiquetas.msg2;
//        return mesg;
//    }
//
//    function nivel(btn, text) {
//        if (btn == 'ok') {
//            Ext.Ajax.request({
//                url: 'adicionarNorma',
//                waitMsg: mensaje,
//                params: {
//                    identidad: 6,
//                    idactividad: 2,
//                    nivel: 0
//                }
//            });
//        }
//    }
//}

function guardarFormatopredefinido(selected) {
    Ext.Ajax.request({
        url: 'guardarPredefinido',
        params: {
            idformato: selected.id
        },
        callback: function (options, success, response) {

        }
    });
}

function eliminarVariasActividades() {
    mostrarMensaje(2, perfil.etiquetas.msgSegEliminarActividades, eliminarActividadesSeleccionadas);
    function eliminarActividadesSeleccionadas(btnPresionado) {
        if (btnPresionado == 'ok') {
            mymask.show();
            var recordsSel = gpGestAct.getSelectionModel().getSelections(), actElim = [];
            if (recordsSel.length > 0) {
                for (var i = 0; i < recordsSel.length; i++)
                    actElim.push(
                            recordsSel[i].data.idactividad
                            );
                Ext.Ajax.request({
                    url: 'eliminarActividad',
                    timeout: 6400000,
                    params: {
                        actividades: Ext.encode(actElim)
                    },
                    callback: function (options, success, response) {
                        mymask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgM == 1) {
                            if (smGpGestAct.getSelected()) {
                                if (smGpGestAct.getSelected().data._parent == null) {
                                    gpGestAct.getStore().reload({
                                        params: {
                                            anode: null,
                                            start: Ext.getCmp('idpaginado').cursor

                                        }
                                    });
                                } else
                                    gpGestAct.getStore().reload({
                                        params: {
                                            anode: smGpGestAct.getSelected().data._parent,
                                            start: Ext.getCmp('idpaginado').cursor
                                        }
                                    });
                            } else
                                gpGestAct.getStore().reload({});
                            mostrarMensaje(1, perfil.etiquetas.msgEliminadoAct);
                        } else if (responseData.codMsgM == 2) {
                            mostrarMensaje(1, perfil.etiquetas.msgErrorNoElimTieneRegla);
                        } else if (responseData.mensaje != null)
                            mostrarMensaje(3, responseData.mensaje);
                        else
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                    }
                });
            }
        }
    }
}

function adicionarActividades(mod) {
    Ext.apply(Ext.form.VTypes, {
        validarEspaciosEnBlanco: function (value, field) {
            return (!(/^\s+|\s+$/.test(value)));
        },
        validarEspaciosEnBlancoText: 'No se admite el uso del espacio antes ni después del valor del campo.'
    });

    /*nivelact = 1, sinanode = true;*/
//*********Combo formato********************
    stformato = new Ext.data.Store({
        url: 'listarFormatos',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idformato'
        }, [{
                name: 'nombre'
            }, {
                name: 'idformato'
            }]),
        listeners: {
            load: function (st) {
                if (st.getCount() == 0) {
                    mostrarMensaje(1, 'No existen formatos configurados para este subsistema.');
                    winAddAct.hide();
                } else {
                    if (modificar) {
                        modificarActividad(true, false);
                        // modificar = false;
                    }
                    if (duplicar) {
                        modificarActividad(false, true);
                        // duplicar = false;
                    } else {
                        add = true;
                        actFormAdd();
                    }
                }
            }
        }
    });

    cbformato = new Ext.form.ComboBox({
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        id: 'cbformato',
        anchor: '95%',
        readOnly: true,
        displayField: 'nombre',
        valueField: 'idformato',
        hiddenName: 'idformato',
        allowBlank: false,
        listeners: {
            select: function (c, r, i) {
                //entender que se hace aqui
                if (idformato == null) {
                    guardarFormatopredefinido(r);
                    longnivel((smGpGestAct.getSelected() && addhijo) ? gpActividades.getStore().getNodeDepth(smGpGestAct.getSelected()) + 1 : 1, r.data.idformato);
                } else {
                    longnivel(1, idformato);
                }
                if (smGpGestAct.getSelected() && addhijo) {
                    Ext.getCmp('codpadre').setValue(smGpGestAct.getSelected().data.codigo);
                } else {
                    //abrenivel(Ext.getCmp('cbformato').getValue(), 1);
                    Ext.getCmp('codpadre').setValue(codespecialidadLog);
                }
            }
        },
        store: stformato,
        mode: 'local',
        triggerAction: 'all',
        fieldLabel: perfil.etiquetas.lbFormato
    });

    //*********Nivel*************************
    nivel = new Ext.form.TextField({
        id: 'nivel',
        anchor: '95%',
        fieldLabel: perfil.etiquetas.lbNivel,
        disabled: true
    });

    //***********Cantidad de digitos***********
    cantdig = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'cantdig',
        anchor: '95%',
        fieldLabel: perfil.etiquetas.lbDigitos,
        disabled: true
    });

    //***********Especialidad**********
    tfespecialidad = new Ext.form.TextField({
        id: 'tfespecialidad',
        anchor: '100%',
        fieldLabel: perfil.etiquetas.lbEspecialidad,
        disabled: true
    });

    //******Denominacion**********************
    denominacion = new Ext.form.TextField({
        xtype: 'textfield',
        id: 'denominacion',
        fieldLabel: 'Denominación',
        anchor: '99%',
        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        //vtype: 'validarEspaciosEnBlanco',
        regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales(-),(_).',
        allowBlank: false,
        maxLength: 255,
        maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
        blankText: perfil.etiquetas.lbRequerido
    });
    //*******************Codigo padre*********************
    codpadre = new Ext.form.TextField({
        xtype: 'textfield',
        id: 'codpadre',
        disabled: true,
        style: 'text-align:right',
        anchor: '98%',
        fieldLabel: perfil.etiquetas.lbCodigoPadre

    });

    //****************Codigo***********************
    tfcodigo = new Ext.form.TextField({
        xtype: 'textfield',
        id: 'tfcodigo',
        regex: /^([0-9]+ ?[0-9]*)+$/,
        maxLengthText: 'El tamaño requerido es 2 dígito(s).',
        regexText: 'Solo admite números enteros positivos.',
        anchor: '100%',
        fieldLabel: 'Código',
        allowBlank: false,
        blankText: perfil.etiquetas.lbRequerido
    });

    //****************Combo especialidades demandantes***********************
    checkDemandadas = [];
    stespecialiddemandante = new Ext.data.Store({
        url: 'listarEspecialidadesYValorUltimoNivel',
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'idespecialidad'
                    }, {
                        name: 'denominacion'
                    }]),
        listeners: {
            beforeload: function (st, opt) {
                compartidas = cbEspecialidadCompartida.getCheckedValue();
                if (cbEspecialidadCompartida.getCheckedValue() == "" && objectCompartida[0] != undefined) {
                    compartidas = objectCompartida;
                }
                var idEspecialidad = gpActividades.getSelectionModel().getSelected() ? gpActividades.getSelectionModel().getSelected().data.idespecialidad : idespecialidadLog;
                st.baseParams.idespecialidadCreador = Number(idEspecialidad);
                st.baseParams.compartidas = Ext.encode(compartidas);
                st.baseParams.comboListar = 'demandantes';
            },
            load: function (st, rec, opt) {
                var valores = st.data.items;
                if (checkDemandadas.length > 0) {
                    for (var i = 0; i < checkDemandadas.length; i++) {
                        for (var j = 0; j < valores.length; j++) {
                            if (checkDemandadas[i].id == valores[j].data.idespecialidad) {
                                rec[j].set('checked', true);
                            }
                        }
                    }
                }
            }
        }
    });
    cbDemandantes = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        enableQtip: true,
        fieldLabel: perfil.etiquetas.lbOrganosDemandantes,
        displayField: 'denominacion',
        id: 'cbDemandantes',
        valueField: 'idespecialidad',
        store: stespecialiddemandante,
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'idespecialidadesdem',
        triggerAction: 'all',
        editable: true,
        anchor: '100%',
        mode: 'remote',
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            expand: function (cb) {
                cb.store.reload();
            },
            change: function (cb, newV, oldV) {
                checkDemandadas = [];
                var valoresN = newV.split(',');
                for (var i = 0; i < valoresN.length; i++) {
                    checkDemandadas.push({id: valoresN[i]});
                }
            }
        }
    });

    //****************Combo especialidades compartidas***********************
    checkCompartir = [];
    stespecialidcompartir = new Ext.data.Store({
        url: 'listarEspecialidadesYValorUltimoNivel',
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'idespecialidad'
                    }, {
                        name: 'denominacion'
                    }]),
        listeners: {
            beforeload: function (st, opt) {

                demandantes = cbDemandantes.getCheckedValue();
                if (cbDemandantes.getCheckedValue() == "" && objectDemandada[0] != undefined) {
                    demandantes = objectDemandada;
                }
                st.baseParams.demandantes = Ext.encode(demandantes);
                var idEspecialidad = gpActividades.getSelectionModel().getSelected() ? gpActividades.getSelectionModel().getSelected().data.idespecialidad : idespecialidadLog;
                st.baseParams.idespecialidadCreador = Number(idEspecialidad);
                st.baseParams.comboListar = 'compartidas';
            },
            load: function (st, rec, opt) {
                var valores = st.data.items;
                if (checkCompartir.length > 0) {
                    for (var i = 0; i < checkCompartir.length; i++) {
                        for (var j = 0; j < valores.length; j++) {
                            if (checkCompartir[i].id == valores[j].data.idespecialidad) {
                                rec[j].set('checked', true);
                            }
                        }
                    }
                }
            }
        }
    });

    cbEspecialidadCompartida = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        enableQtip: true,
        fieldLabel: 'Compartir',
        displayField: 'denominacion',
        id: 'cbEspecialidadCompartida',
        valueField: 'idespecialidad',
        store: stespecialidcompartir,
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'idespecialidadcomp',
        triggerAction: 'all',
        editable: true,
        anchor: '100%',
        mode: 'remote',
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            expand: function (cb) {
                cb.store.reload();
            },
            change: function (cb, newV, oldV) {
                cbEspecialidadCompartidaChange = true;
                checkCompartir = [];
                var valoresN = newV.split(',');
                for (var i = 0; i < valoresN.length; i++) {
                    checkCompartir.push({id: valoresN[i]});
                }
            }
        }
    });

    //entender funcionamiento del metodo y los dos combos entre si
    //*********Combo modelo********************

    cbmodelo = new Ext.form.ComboBox({
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        id: 'cbmodelo',
        anchor: '100%',
        disabled: true,
        typeAhead: true,
        displayField: 'denominacion',
        valueField: 'idmodelo',
        hiddenName: 'idmodelo',
        allowBlank: true,
        store: stModelos,
        mode: 'local',
        triggerAction: 'all',
        fieldLabel: perfil.etiquetas.lbPlan
    });

    /**
     * Combo de plan de salida----
     */
    cbmodelosalida = new Ext.form.ComboBox({
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        id: 'cbmodelosalida',
        anchor: '100%',
        disabled: true,
        typeAhead: true,
        displayField: 'denominacion',
        valueField: 'idmodelo',
        hiddenName: 'idmodeloSalida',
        allowBlank: true,
        store: stModelos,
        mode: 'local',
        triggerAction: 'all',
        fieldLabel: perfil.etiquetas.lbPlanSalida
    });

    //*********Combo modelo salidas********************
    //falta el combo
    stmodelo2 = new Ext.data.Store({
        url: 'listarModelos',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'denominacion'
            }, {
                name: 'idmodelo'
            }]),
        listeners: {
            load: function (st, rc, obj) {
                addNewRecord2();
                try {
                    cbmodeloparasalida.setValue(gpActividades.getSelectionModel().getSelected().data.idmodelosalida);
                } catch (e) {
                }
            },
            beforeload: function () {
                stmodelo2.baseParams.esgestionaract = true;
            }
        }
    });

    //******Descripcion**********************
    descripcion = new Ext.form.TextArea({
        xtype: 'textarea',
        id: 'descripcion',
        anchor: '100%',
        maxLength: 255,
        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        vtype: 'validarEspaciosEnBlanco',
        regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales(-),(_).',
        fieldLabel: perfil.etiquetas.lbDescripcion,
        editable: false
    });

//esto no se que es9
    Fila = Ext.data.Record.create([{
            name: 'idmodelo',
            type: 'string'
        }, {
            name: 'denominacion',
            type: 'string'
        }]);
//***********Precio****************
    precio = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'precio',
        anchor: '95%',
        fieldLabel: perfil.etiquetas.lbPrecio,
        disabled: true

    });

//ver todos los hidden para que son

    if (winAddAct) {
        if (winAddAct.getComponent('id_formactividad')) {
            winAddAct.getComponent('id_formactividad').items.items.remove();
            winAddAct.doLayout();
        }

        if (winAddAct.getComponent('id_formactividadMod')) {
            winAddAct.getComponent('id_formactividadMod').items.items.remove();
            winAddAct.doLayout();
        }

        winAddAct = null;
    }

    winAddAct = windGeneral(mod ? 'Mod' : 'Add');


    //winAddAct.show();
    winAddAct.on('close', function () {

        winAddAct.destroy();
    });

    winAddAct.on('hide', function () {
        if (winAddAct.getComponent('id_formactividad')) {
            winAddAct.getComponent('id_formactividad').getForm().reset();
            winAddAct.doLayout();
        }

        if (winAddAct.getComponent('id_formactividadMod')) {
            winAddAct.getComponent('id_formactividadMod').getForm().reset();
            winAddAct.doLayout();
        }
        winAddAct.destroy();
    });

    //stmodelo.reload();
    stformato.load();
    winAddAct.setTitle(perfil.etiquetas.lbActividad);
    winAddAct.doLayout();
}

function adicionaractividad(apl) {
    if (Ext.getCmp('id_formactividad').getForm().isValid()) {
        idarbolAdicionar = false;
        idpadreAdicionar = false;
        if (add) {
            if (addhijo) {
                codAdicionar = codpadre.getValue() + Ext.getCmp('tfcodigo').getValue();
                nivelAdicionar = Number(gpActividades.getSelectionModel().getSelected().data.nivel) + 1;
                idarbolAdicionar = gpActividades.getSelectionModel().getSelected().data.idarbol;
                idpadreAdicionar = gpActividades.getSelectionModel().getSelected().data.idactividad;
            } else {
                codAdicionar = codespecialidadLog + Ext.getCmp('tfcodigo').getValue();
                nivelAdicionar = 1;
            }
        }
        especialidadesdeman = '';
        especialidadescomp = '';
        if (nivelAdicionar == ultimonivel) {
            especialidadesdeman = cbDemandantes.getValue().split(',');
            especialidadescomp = cbEspecialidadCompartida.getValue().split(',');
        }

        Ext.getCmp('id_formactividad').getForm().submit({
            url: 'adicionarActividad',
            waitMsg: mensaje,
            params: {
                codAdicionar: codAdicionar,
                nivelAdicionar: nivelAdicionar,
                idarbolAdicionar: idarbolAdicionar,
                idpadreAdicionar: idpadreAdicionar,
                idformato: Ext.getCmp('cbformato').getValue(),
                idespecialidad: idespecialidadLog,
                demandantes: Ext.encode(especialidadesdeman),
                compartidas: Ext.encode(especialidadescomp),
                ultimonivel: ultimonivel
            },
            failure: function (form, action) {
                var cont = 0;
                if (action.result.codMsgM == 1) {
                    mostrarMensaje(1, "Los datos fueron adicionados satisfactoriamente.");
                    cont++;

                    var nodeload = idarbolAdicionar == idpadreAdicionar ? null : idpadreAdicionar;
                    if (nodeload != null && (parseInt(nivelAdicionar) == 3 || parseInt(nivelAdicionar) == 4) && (gpActividades.getSelectionModel().getSelected().data._is_leaf == true)) {
                        nodeload = idarbolAdicionar;
                    }

                    if (apl) {
                        winAddAct.close();
                        stGpActividades.reload({
                            params: {
                                anode: nodeload
                            }
                        });

                    } else {
                        Ext.getCmp('cbmodelo').clearValue();
                        Ext.getCmp('cbmodelosalida').clearValue();
                        Ext.getCmp('tfcodigo').reset();
                        Ext.getCmp('denominacion').reset();
                        Ext.getCmp('descripcion').reset();
                        cbDemandantes.reset();
                        cbEspecialidadCompartida.reset();
                    }

                }
                if (action.result.codMsgM == 22) {
                    mostrarMensaje(1, "Ya existe una actividad con ese c&oacute;digo.");
                    cont++;
                }
                if (cont === 0) {
                    mostrarMensaje(1, "Ocurri&oacute un error en la Base de datos");
                }
            }
        });
    } else
        mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
}

function modActividad() {

    if (duplicar == true) {
        var compartidasDup = (isNaN(cbEspecialidadCompartida.getValue()) == true) ? Ext.encode(cbEspecialidadCompartida.getValue()) : Ext.encode(especialidades.compartida);
    } else {
        var compartidasDup = null;
    }

    if (duplicar == true) {
        var demandadasDup = (isNaN(cbDemandantes.getValue()) == true) ? Ext.encode(cbDemandantes.getValue()) : Ext.encode(especialidades.demandada);
    } else {
        var demandadasDup = null;
    }
    var idpadre = gpActividades.getSelectionModel().getSelected().data.idpadre;

    Ext.getCmp('id_formactividadMod').getForm().submit({
        url: 'modificarActividad',
        waitMsg: perfil.etiquetas.lbModificando,
        params: {
            idformato: gpActividades.getSelectionModel().getSelected().data.idformato,
            idejercicio: cbEjercicioNorma.getValue(),
            idespecialidad: idespecialidadLog,
            idmodeloMod: Ext.getCmp('cbmodelo').getValue(),
            idmodeloSalidaMod: Ext.getCmp('cbmodelosalida').getValue(),
            tfcodigoMod: Ext.getCmp('tfcodigo').getValue(),
            codpadreMod: Ext.getCmp('codpadre').getValue(),
            nivel: gpActividades.getSelectionModel().getSelected().data.nivel,
            idactividad: gpActividades.getSelectionModel().getSelected().data.idactividad,
            ultimonivel: gpActividades.getSelectionModel().getSelected().data.esultimonivel,
            idpadre: idpadre,
            idarbol: gpActividades.getSelectionModel().getSelected().data.idarbol,
            idespecialidadcompDup: compartidasDup,
            idespecialidadesdemDup: demandadasDup,
            accion: duplicar == false ? "modificar" : "duplicar"
        },
        failure: function (form, action) {
            var cont = 0;
            if (action.result.codMsgM == 1) {
                mostrarMensaje(1, "Los datos fueron guardados satisfactoriamente.");
                cont++;

                if (parseInt(cbNiveles.getValue()) == parseFloat(gpActividades.getSelectionModel().getSelected().data.nivel)) {
                    stGpActividades.baseParams.start = offsetActividades;
                }

                stGpActividades.reload({
                    params: {
                        anode: smGpGestAct.getSelected().data._parent
                    }
                });
                winAddAct.close();

                offsetActividades = 0;

            }

            if (action.result.codMsgM == 22) {
                mostrarMensaje(1, "Ya existe una actividad con ese c&oacute;digo.");
                cont++;
            }
            if (cont === 0) {
                mostrarMensaje(1, "Ocurri&oacute un error en la Base de datos");
            }
        }
    });

}

function modificarActividad(mod, duplicarAct) {
    mymask.show();
    Ext.Ajax.request({
        url: 'demandandesCompartidos',
        params: {
            idactividad: gpActividades.getSelectionModel().getSelected().data.idactividad,
            codigo: gpActividades.getSelectionModel().getSelected().data.codigo
        },
        callback: function (options, success, response) {

            especialidades = Ext.decode(response.responseText);
            mymask.hide();
            if (gpActividades.getSelectionModel().getSelected().data.esultimonivel == true) {
                cbmodelo.enable();
                cbmodelosalida.enable();
                //Ext.getCmp('fpCbDemandantes').show();
                Ext.getCmp('fpCbCompartida').show();
                Ext.getCmp('fpCbModelo').show();
                Ext.getCmp('fpCbModeloSalida').show();
                Ext.getCmp('cbDemandantes').enable();
                //Ext.getCmp('cbRector').enable();
                Ext.getCmp('cbEspecialidadCompartida').enable();
            } else {
                cbmodelo.disable();
                cbmodelosalida.disable();
                //Ext.getCmp('fpCbDemandantes').hide();
                Ext.getCmp('fpCbCompartida').hide();
                Ext.getCmp('fpCbModelo').hide();
                Ext.getCmp('fpCbModeloSalida').hide();
                Ext.getCmp('cbDemandantes').disable();
                //Ext.getCmp('cbRector').disable();
                Ext.getCmp('cbEspecialidadCompartida').disable();
            }
            mensaje = perfil.etiquetas.msgGuardandoModificar;


            winAddAct.show();
            winAddAct.setTitle(perfil.etiquetas.lbActividadM);
            // Ext.getCmp('btnaplicar').hide();
            //

            if (!gpActividades.getSelectionModel().getSelected().data._is_leaf) {
                Ext.getCmp('tfcodigoMod').disable();
            }

            var objectData = nivelEspSelecc();

            if (duplicarAct) {
                duplicar = true;
                modificar = false;
                // Ext.getCmp('btnaplicar').show();//msgGuardandoDuplicar
                mensaje = perfil.etiquetas.msgGuardandoDuplicar;
                winAddAct.setTitle(perfil.etiquetas.lbActividadD);
                Ext.getCmp('tfespecialidad').setValue(objectData['especialidad']);
                Ext.getCmp('tfcodigo').enable();
            }

            valordenominacion = gpActividades.getSelectionModel().getSelected().data.denominacion;
            valordescripcion = gpActividades.getSelectionModel().getSelected().data.descripcion;
            valorplan = gpActividades.getSelectionModel().getSelected().data.idmodelo;
            valorplansalida = gpActividades.getSelectionModel().getSelected().data.idmodelosalida;

            Ext.getCmp('denominacionMod').setValue(gpActividades.getSelectionModel().getSelected().data.denominacion);
            Ext.getCmp('descripcionMod').setValue(gpActividades.getSelectionModel().getSelected().data.descripcion);
            (gpActividades.getSelectionModel().getSelected().data.idactividad != gpActividades.getSelectionModel().getSelected().data.idpadre)
                    ? (Ext.getCmp('codpadre').setValue(gpActividades.getSelectionModel().getSelected().data.codigopadre))
                    : Ext.getCmp('codpadre').setValue(gpActividades.getSelectionModel().getSelected().data.codespecialidad);


            Ext.getCmp('nivel').setValue(objectData['nivel']);
            if (gpActividades.getSelectionModel().getSelected().data.nivel == 1) {
                Ext.getCmp('codpadre').setValue(objectData['codespecialidad']);

            }
            cod = gpActividades.getSelectionModel().getSelected().data.codigo.substr(Ext.getCmp('codpadre').getValue().length, gpActividades.getSelectionModel().getSelected().data.codigo.length);
            tfcodigoMod = cod;
            Ext.getCmp('tfcodigoMod').maxLength = objectData['long'];
            Ext.getCmp('tfcodigoMod').minLength = objectData['long'];
            Ext.getCmp('tfcodigoMod').setValue(cod);
            Ext.getCmp('cantdig').setValue(objectData['long']);

            Ext.getCmp('cbformato').setValue(comportamientoFormato(parseInt(gpActividades.getSelectionModel().getSelected().data.idformato)));
            Ext.getCmp('cbformato').disable();

            if (gpActividades.getSelectionModel().getSelected().data.esultimonivel == true) {

                if (especialidades['demandada']) {
                    Ext.getCmp('cbDemandantes').setRawValue(comportamientos('demandada', especialidades.demandada));
                }

                if (especialidades['compartida']) {
                    Ext.getCmp('cbEspecialidadCompartida').setRawValue(comportamientos('compartida', especialidades.compartida));
                }
                Ext.getCmp('cbmodelo').setValue(comportamientoPlan(parseInt(gpActividades.getSelectionModel().getSelected().data.idmodelo)));
                Ext.getCmp('cbmodelosalida').setValue(comportamientoPlan(parseInt(gpActividades.getSelectionModel().getSelected().data.idmodelosalida)));
                objectRector = especialidades.propia;
            }
            winAddAct.show();
            winAddAct.doLayout();
        }
    });
}

function eliminarActividades() {
    totalAct = 0;
    idpadre = null;
    actividadesUpd = [];
    recordsArray = smGpGestAct.getSelections();
    if (recordsArray.length > 0) {
        for (var i = 0; i < recordsArray.length; i++) {
            actividadesUpd.push({
                idactividad: recordsArray[i].data.idactividad,
                idarbol: recordsArray[i].data.idarbol,
                ordender: recordsArray[i].data.ordender,
                ordenizq: recordsArray[i].data.ordenizq,
                nivel: recordsArray[i].data.nivel
            });
            totalAct++;
            idpadre = recordsArray[i].data._parent;
        }
        //envío la actualización
        mymask.show();
        Ext.Ajax.request({
            url: 'eliminarActividad',
            params: {
                actividades: Ext.encode(actividadesUpd)
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgM == 1) {
                    if (totalAct != 1)
                        mostrarMensaje(1, perfil.etiquetas.msgEliminarActividadesOk);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgEliminarActividadOk);
                } else {
                    if (totalAct != 1)
                        mostrarMensaje(1, perfil.etiquetas.msgEliminarActividadesNo);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgEliminarActividadNo);
                }
                if (totalAct != 1)
                    stGpActividades.reload({
                        params: {
                            anode: null
                        }
                    });
                else
                    stGpActividades.reload({
                        params: {
                            anode: idpadre
                        }
                    });
            }
        });
    }
}

function windGeneral(opcion) {

    /****
     * Panel para el Modificar
     */

    Ext.apply(Ext.form.VTypes, {
        validarEspaciosEnBlancoMod: function (value, field) {
            return (!(/^\s+|\s+$/.test(value)));
        },
        validarEspaciosEnBlancoModText: 'No se admite el uso del espacio antes ni después del valor del campo.'
    });

    var winAct;
    cbEspecialidadCompartidaChange = false;
    switch (opcion) {

        case 'Add':
            {
                /*if (fpActividadMod) {
                 fpActividadMod.reset();
                 }*/

                fpActividad = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    autoHeight: true,
                    labelAlign: 'top',
                    id: 'id_formactividad',
                    items: [{
                            layout: 'column',
                            items: [{
                                    layout: 'form',
                                    columnWidth: 0.3,
                                    items: cbformato
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.1,
                                    items: nivel
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.1,
                                    items: cantdig
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.5,
                                    items: tfespecialidad
                                }]
                        }, {
                            layout: 'column',
                            items: [{
                                    layout: 'form',
                                    columnWidth: 0.6,
                                    items: denominacion
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.2,
                                    items: codpadre
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.2,
                                    items: tfcodigo
                                }]
                        }, /*{
                         layout: 'form',
                         items: cbDemandantes,
                         id: 'fpCbDemandantes',
                         hidden: true
                         },*/ {
                            layout: 'form',
                            items: cbEspecialidadCompartida,
                            id: 'fpCbCompartida',
                            hidden: true
                        }, {
                            layout: 'form',
                            items: cbmodelo,
                            id: 'fpCbModelo',
                            hidden: true
                        }, {
                            layout: 'form',
                            items: cbmodelosalida,
                            id: 'fpCbModeloSalida',
                            hidden: true
                        }, {
                            layout: 'form',
                            items: descripcion
                        }]

                });

                winAct = new Ext.Window({
                    modal: true,
                    closeAction: 'destroy',
                    constrain: true,
                    width: 550,
                    layout: 'fit',
                    autoHeight: true,
                    title: perfil.etiquetas.lbActividad,
                    buttons: [{
                            // icon: perfil.dirImg + 'cancelar.png',
                            iconCls: 'cancelar',
                            tooltip: perfil.etiquetas.lbttCancelar,
                            text: perfil.etiquetas.lbCancelar,
                            handler: function () {
                                fpActividad.getForm().reset();
                                winAddAct.hide();
                            }
                        }, {
                            //icon: perfil.dirImg + 'aplicar.png',
                            iconCls: 'aplicar',
                            tooltip: perfil.etiquetas.lbttAplicar,
                            id: 'btnaplicar',
                            text: perfil.etiquetas.lbAplicar,
                            handler: function () {
                                adicionaractividad(false);
                            }
                        }, {
                            //  icon: perfil.dirImg + 'aceptar.png',
                            iconCls: 'aceptar',
                            id: 'btnaceptar1',
                            tooltip: perfil.etiquetas.lbttAceptar,
                            text: perfil.etiquetas.lbAceptar,
                            nextTab: 'denominacion',
                            handler: function () {
                                aceptar = true;
                                adicionaractividad(true);
                            }
                        }],
                    items: [fpActividad],
                    listeners: {
                    }
                });
                winAct.add(fpActividad);
            }
            break;
        case 'Mod':
            {

                //******Denominacion**********************
                denominacionMod = new Ext.form.TextField({
                    xtype: 'textfield',
                    id: 'denominacionMod',
                    prevTab: 'idaceptarmod',
                    fieldLabel: 'Denominación',
                    anchor: '99%',
                    regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
                    maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                    vtype: 'validarEspaciosEnBlancoMod',
                    regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales(-),(_).',
                    allowBlank: false,
                    maxLength: 255,
                    maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
                    blankText: perfil.etiquetas.lbRequerido
                });

                //******Descripcion**********************
                descripcionMod = new Ext.form.TextArea({
                    xtype: 'textarea',
                    id: 'descripcionMod',
                    anchor: '100%',
                    maxLength: 255,
                    regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
                    maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                    vtype: 'validarEspaciosEnBlancoMod',
                    regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales(-),(_).',
                    fieldLabel: perfil.etiquetas.lbDescripcion,
                    editable: false
                });

                fpActividadMod = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    listeners: {
                        'clientvalidation': function (fm, valid) {
                            if (fm.getForm().isValid() && (Ext.getCmp('denominacionMod').getValue() != valordenominacion || Ext.getCmp('tfcodigoMod').getValue() != tfcodigoMod
                                    || Ext.getCmp('descripcionMod').getValue() != valordescripcion || cbEspecialidadCompartidaChange == true)) {
                                Ext.getCmp('idaceptarmod').enable();
                            } else {
                                Ext.getCmp('idaceptarmod').disable();
                            }
                            if (!Ext.getCmp('idaceptarmod').disabled) {
                                Ext.getCmp('denominacionMod').prevTab = 'idaceptarmod';
                            } else {
                                Ext.getCmp('denominacionMod').prevTab = 'idcancelarmod';
                            }

                        }
                    },
                    autoHeight: true,
                    labelAlign: 'top',
                    id: 'id_formactividadMod',
                    items: [{
                            layout: 'column',
                            items: [{
                                    layout: 'form',
                                    columnWidth: 0.3,
                                    items: cbformato
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.1,
                                    items: nivel
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.1,
                                    items: cantdig
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.5,
                                    items: tfespecialidad
                                }]
                        }, {
                            layout: 'column',
                            items: [{
                                    layout: 'form',
                                    columnWidth: 0.6,
                                    items: [denominacionMod]
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.2,
                                    items: codpadre
                                }, {
                                    layout: 'form',
                                    columnWidth: 0.2,
                                    items: [{
                                            xtype: 'textfield',
                                            id: 'tfcodigoMod',
                                            //maskRe: /^([0-9]+ ?[0-9]*)+$/,
                                            regex: /^([0-9]+ ?[0-9]*)+$/,
                                            maxLengthText: 'El tamaño requerido es 2 dígito(s).',
                                            regexText: 'Solo admite números enteros positivos.',
                                            anchor: '100%',
                                            fieldLabel: 'Código',
                                            allowBlank: false,
                                            blankText: perfil.etiquetas.lbRequerido
                                        }]
                                }]

                        }, /*{
                         layout: 'form',
                         hidden: true,
                         items: cbDemandantes,
                         id: 'fpCbDemandantes'
                         },*/ {
                            layout: 'form',
                            hidden: true,
                            items: cbEspecialidadCompartida,
                            id: 'fpCbCompartida'
                        }, {
                            layout: 'form',
                            items: cbmodelo,
                            hidden: true,
                            id: 'fpCbModelo'
                        }, {
                            layout: 'form',
                            items: cbmodelosalida,
                            id: 'fpCbModeloSalida',
                            hidden: true
                        }, {
                            layout: 'form',
                            items: descripcionMod
                        }, {
                            xtype: 'hidden',
                            id: 'idindicador'
                        }, {
                            xtype: 'hidden',
                            id: 'idact'
                        }, {
                            xtype: 'hidden',
                            id: 'cod_padre'
                        }, {
                            xtype: 'hidden',
                            id: '_is_leaf'
                        }, {
                            xtype: 'hidden',
                            id: 'padre'
                        }, {
                            xtype: 'hidden',
                            id: 'codigoact'
                        }, {
                            xtype: 'hidden',
                            id: 'idact'
                        }, {
                            xtype: 'hidden',
                            id: 'idactorigen'

                        }, {
                            xtype: 'hidden',
                            id: 'den_especialidad'
                        }]
                });
                winAct = new Ext.Window({
                    modal: true,
                    closeAction: 'destroy',
                    constrain: true,
                    width: 550,
                    layout: 'fit',
                    autoHeight: true,
                    title: perfil.etiquetas.lbActividad,
                    autoValidate: false,
                    listeners: {
                        'beforeshow': function () {
                            Ext.getCmp('denominacionMod').focus(true, 500);
                        }
                    },
                    buttons: [{
                            iconCls: 'cancelar',
                            tooltip: perfil.etiquetas.lbttCancelar,
                            text: perfil.etiquetas.lbCancelar,
                            handler: function () {
                                winAddAct.close();
                            }
                        }, {
                            iconCls: 'aceptar',
                            id: 'idaceptarmod',
                            tooltip: perfil.etiquetas.lbttAceptar,
                            text: perfil.etiquetas.lbAceptar,
                            nextTab: 'denominacionMod',
                            disabled: true,
                            handler: function () {
                                aceptar = true;
                                modActividad();
                            }
                        }],
                    items: [fpActividadMod]
                });
                winAct.add(fpActividadMod);
                winAct.doLayout();
            }
            break;
    }

    return winAct;
}