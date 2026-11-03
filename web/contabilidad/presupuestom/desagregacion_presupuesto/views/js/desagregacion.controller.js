Ext.ns('Desagregacion.Presupuesto');

Desagregacion.Presupuesto.Controller = {
    init: function (idioma, view, model, seleccion, bandera) {
        if (model.store_operacion.reload() && model.store_operacion.data.length == 0) {
            var msg = "No hay opercaiones configuradas para esta entidad."
            mostrarMensaje(3, msg);
        }
        if (bandera > 2)
            view.btnAdicionar.enable();
        var idcuenta;
        var stringcuenta = '';
        var tipo_operacion = 0;
        var banderaduplicar = false;
        var id_operacion = 0;
        var id_operacion_credito_mov = 0;
        var j = 0;
        var iddoceliminar;

        var arrayUM = new Array();
        var arrayCuenta = new Array();
        var arrayelementoGasto = new Array();
        var arrayNAE = new Array();
        var arrayespecialidad = new Array();
        var arrayelementosaeliminar = new Array();

        // if (seleccion == 2) {
        //     idcuenta = 2;
        //     stringcuenta = 'Credito';
        //     view.edircbCuenta.setValue(2);
        //     view.cm.setEditable(6, false);
        //     // view.edircbCuenta.disable();
        //     //view.edircbCuenta.setRawValue('Haber');
        // } else if (seleccion == 3) {
        //     idcuenta = 1;
        //     stringcuenta = 'Debito';
        //     view.edircbCuenta.setValue(1);
        //     // view.edircbCuenta.disable();
        //     //view.edircbCuenta.setRawValue('Debe');
        // }
        var id = 0;
        var scope = this;
        var selecteds = view.smoperacion.getSelected();
        var file = 0;
        if (model.store_tipo_operacion.data.length >= 3)
            view.btnAdicionar.enable();
        view.smoperacionnueva.on({
            rowselect: function (rowIndex) {
                file = rowIndex;
            }
        })
        view.tacomentario.on({
            blur: function () {
                if (view.tacomentario.getValue() != '' && view.dfFecha.getValue() != '')
                    view.btnAceptarConjuntoOperaciones.enable();
                else
                    view.btnAceptarConjuntoOperaciones.disable();
            }
        })
        view.dfFecha.on({
            change: function () {
                if (view.dfFecha.getValue() != '' && view.tacomentario.getValue() != '')
                    view.btnAceptarConjuntoOperaciones.enable();
                else
                    view.btnAceptarConjuntoOperaciones.disable();
            }
        })

        view.GridPrincipal.on({
            cellclick: function () {
                var selecteds = view.smoperacion.getSelections();
                var flagConfirm = false;
                var flagSave = false;
                var flagCancel = false;
                view.btnMod.disable();

                if (selecteds[0].data.nomEstado == 'Confirmado') {
                    for (var i = 0; i < selecteds.length; i++) {
                        if (selecteds[i].data.nomEstado == 'Confirmado') {
                            flagConfirm = true;
                        } else {
                            flagConfirm = false;
                            break;
                        }
                    }
                } else if (selecteds[0].data.nomEstado == 'Guardado') {
                    if (selecteds.length == 1) {
                        view.btnMod.enable();
                        view.btnEliminar.enable();

                    } else if (selecteds.length > 1) {
                        view.btnMod.disable();
                        view.btnEliminar.enable();

                    }
                    for (var i = 0; i < selecteds.length; i++) {
                        if (selecteds[i].data.nomEstado == 'Guardado') {
                            flagSave = true;
                        } else {
                            flagSave = false;
                            break;
                        }
                    }
                } else if (selecteds[0].json.nomEstado == 'Posteado') {
                    for (var i = 0; i < selecteds.length; i++) {
                        if (selecteds[i].json.nomEstado == 'Posteado') {
                            flagCancel = true;
                        } else {
                            flagCancel = false;
                            break;
                        }
                    }
                }


                if (flagConfirm == true) {
                    view.btnPostear.enable();
                    view.btnConfirmar.disable();
                    view.btnCancelar.enable();
                    view.btnEliminar.disable()
                } else if (flagSave == true) {
                    view.btnPostear.disable();
                    view.btnConfirmar.enable();
                    view.btnCancelar.enable();
                    view.btnEliminar.enable()
                } else if (flagCancel == true) {
                    view.btnPostear.disable();
                    view.btnConfirmar.disable();
                    view.btnCancelar.enable();
                    view.btnEliminar.disable();
                } else {
                    view.btnPostear.disable();
                    view.btnConfirmar.disable();
                    view.btnCancelar.disable();
                    view.btnEliminar.disable();
                }
                flagConfirm = false;
                flagSave = false;
                if (selecteds[0].json.nomEstado == 'Guardado')
                    view.btnCancelar.disable();

            }
        });


        view.btnImportar.on({
            click: function fConfigurarImportar () {
                console.log(seleccion);
                var self = this;
                //self.map.disable();
                this.winImportCmp = new SCFPrintData(new Object(), "/contabilidad/comun/SCFPrintView/", {
                    reportType: "PRESUPUESTO_MINFAR",
                    typeAction: 'import',
                    idcajafondo:scope.idcajafondo,
                    idMonedaEntidad:scope.idMonedaEntidad,
                    seleccion: seleccion
                });
                this.winImportCmp.show();
                this.winImportCmp.doLayout();
                this.winImportCmp.on({
                    'show': function() {
                       // self.map.disable();
                    },
                    'close': function() {
                        model.stobteneragrupaciones.load();
                    }
                });
            }
        });


        view.GridPresupuesto.on({
            cellclick: function () {
                var selecteds = view.smoperacionnueva.getSelections();
                var flagConfirm = false;
                var flagSave = false;
                var flagCancel = false;
                view.btnMod.disable();
                if (selecteds.length == 1) {
                    view.btnDuplicar.enable();
                } else {
                    view.btnDuplicar.disable();
                }

                if (flagConfirm == true) {
                    view.btnPostear.enable();
                    view.btnConfirmar.disable();
                    view.btnCancelar.enable();
                } else if (flagSave == true) {
                    view.btnPostear.disable();
                    view.btnConfirmar.enable();
                    view.btnCancelar.enable();
                } else if (flagCancel == true) {
                    view.btnPostear.disable();
                    view.btnConfirmar.disable();
                    view.btnCancelar.enable();
                } else {
                    view.btnPostear.disable();
                    view.btnConfirmar.disable();
                    view.btnCancelar.disable();
                }
                flagConfirm = false;
                flagSave = false;
            }
        });

        view.btnConfiguracion.on({
            click: function () {
                view.winConfig.show()
            }
        });
        view.btnAdicionarPresupuesto.on({
            click: function () {
                view.filters.clearFilters();
                view.btnDuplicar.disable();
                view.rowEditor.enable();
                view.panelsur.enable()
                view.btnAceptarConjuntoOperaciones.show();
                view.btnDuplicar.show();
                view.btnAdicionar.show();

                model.store_desagregacion.baseParams.id_docpresupuesto = 0;
                model.store_desagregacion.reload();
                view.dfFecha.setValue('');
                view.tacomentario.setValue('');
                view.winAdicionarPresupuesto.setTitle("Adicionar Elementos");
                if (view.tacomentario.getValue() != '' && view.dfFecha.getValue() != '')
                    view.btnAceptarConjuntoOperaciones.enable();
                else
                    view.btnAceptarConjuntoOperaciones.disable();
                if (model.store_desagregacion.data.length > 0) {
                    view.tacomentario.enable();
                    view.dfFecha.enable();
                } else {
                    view.tacomentario.disable();
                    view.dfFecha.disable();
                }
                view.winAdicionarPresupuesto.show()
                iddoceliminar = 0;

            }
        })
        view.btnMod.on({
            click: function () {
                view.btnDuplicar.disable();
                var selecteds = view.smoperacion.getSelections();
                model.store_desagregacion.baseParams.id_docpresupuesto = selecteds[0].data.id_docpresupuesto;
                model.store_desagregacion.reload();
                if (view.tacomentario.getValue() != '' && view.dfFecha.getValue() != '')
                    view.btnAceptarConjuntoOperaciones.enable();
                else
                    view.btnAceptarConjuntoOperaciones.disable();
                if (model.store_operacion.data.length > 0) {
                    view.tacomentario.enable();
                    view.dfFecha.enable();
                }
                var fechasave = selecteds[0].data.fecha_operacion
                view.dfFecha.setValue(fechasave);
                view.tacomentario.setValue(selecteds[0].data.descripcion);
                view.winAdicionarPresupuesto.setTitle("Modificar Elementos");
                iddoceliminar = selecteds[0].data.id_docpresupuesto;
                view.winAdicionarPresupuesto.show();

                // view.rowEditor.startEditing(file.last, file.last);
                // view.btnMod.disable();

            }
        })
//---------------------------------------------------------------------------------------------------------------------
        Desagregacion.Presupuesto.WindowCancelar = Ext.extend(Ext.Window, {
            constructor: function (scope, fecha) {
                Ext.applyIf(this, {
                    layout: 'fit',
                    border: false,
                    scope: scope,
                    autoValidate: true,
                    title: 'Cancelar Documento',//scope.idioma.lbTitleCancelar,
                    modal: true,
                    resizable: false,
                    layout: 'fit',
                    closeAction: 'close',
                    id: 'windowCancelar',
                    autoHeight: true,
                    border: false,
                    width: 300,
                    height: 200,
                    items: [this.fPanelCancelar = this.fPanelCancelar(scope, fecha)],
                });
                this.createButtons();
                return Desagregacion.Presupuesto.WindowCancelar.superclass.constructor.call(this);
            },
            fPanelCancelar: function (scope, fecha) {
                //ComboBox Motivo de wincajacancelar
                this.stMotivo = new Ext.data.Store({
                    url: 'cargarmotivocancelacion',
                    reader: new Ext.data.JsonReader({
                        root: 'datos',
                    }, [{
                        name: 'idmotivocancelacion',
                        mapping: 'idmotivocancelacion',
                        type: 'string'
                    }, {
                        name: 'motivo',
                        mapping: 'descripcion'
                    }
                    ]),
                    sortInfo: {
                        field: 'motivo',
                        direction: 'ASC'
                    },
                    autoLoad: true,
                    listeners: {
                        beforeload: function (s, options) {
                            this.stMotivo.clearFilter(true);
                            this.stMotivo.removeAll();
                        }.bind(this)
                    }
                });
                this.firstElement = this.cbMotivo = new Ext.form.ComboBox({
                    disabledClass: 'disabled-component',
                    selectOnFocus: true,
                    fieldLabel: 'Motivo de la Cancelacion',//scope.idioma.lbMotivoCancel,
                    mode: 'local',
                    name: 'cbxmotivo',
                    id: 'cbxmotivo',
                    tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
                    resizable: true,
                    emptyText: 'Seleccione...',
                    store: this.stMotivo,
                    hiddenName: 'idmotivocancelacion',
                    valueField: 'idmotivocancelacion',
                    displayField: 'motivo',
                    editable: false,
                    typeAhead: true,
                    msgTarget: 'qtip',
                    maskRe: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
                    regex: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
                    regexText: 'Este campo solo permite letras y n&uacute;meros.',
                    allowBlank: false,
                    blankText: 'Este campo es obligatorio.',
                    anchor: '95%',
                    triggerAction: 'all'
                });

                //Fecha wincajacancelar
                this.dfCancelacion = new Ext.form.DateField({
                    disabledClass: 'disabled-component',
                    selectOnFocus: true,
                    fieldLabel: 'Fecha Contable',
                    msgTarget: 'qtip',
                    allowBlank: false,
                    blankText: 'Este campo es obligatorio.',
                    format: 'd/m/Y',
                    editable: false,
                    anchor: '95%',
                    name: 'dfCancelacion',
                    id: 'dfCancelacion',
                    // minValue: fecha,
                    // maxValue: new Date(),
                    value: fecha, //fechaContable,
                    /// minValue: fechaInicio,
                    //maxValue: fechaFin,
                    invalidText: 'El formato establecido: dd/mm/aaaa.',
                    enableKeyEvents: true
                });
                this.fpCancelacion = new Ext.FormPanel({
                    id: 'fpcancelacion',
                    region: 'north',
                    labelAlign: 'top',
                    frame: true,
                    border: true,
                    layout: 'form',
                    autoHeight: true,
                    modal: true,
                    plain: true,
                    trackResetOnLoad: true,
                    bodyStyle: 'padding:10px 0 0 10px',
                    items: [this.cbMotivo, this.dfCancelacion]
                });
                return this.fpCancelacion
            },
            createButtons: function () {
                this.btnCancelar = new Ext.Button({
                    id: 'btnCancelar',
                    //icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    selectOnFocus: true,
                    text: 'Cancelar',//this.scope.idioma.lbBtnCancelar,
                    tooltip: 'Cancelar',//this.scope.idioma.tooltipCloseAdd,
                    scope: this,
                    handler: function () {
                        this.close();
                    }.bind(this)
                });

                this.btnAceptar = new Ext.Button({
                    id: 'btnAceptar',
                    //icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    text: 'Aceptar',//this.scope.idioma.lbBtnAceptar,
                    tooltip: 'Aceptar',//this.scope.idioma.tooltipAcept,
                    handler: function () {
                        if (this.fpCancelacion.getForm().isValid()) {
                            scope.cancelarDeposito(this.cbMotivo.getValue(), this.dfCancelacion.getRawValue());
                            this.close();
                        }
                    }.bind(this)
                });
                this.buttons = [this.btnCancelar, this.btnAceptar];
            }
        });

        this.cancelarDeposito = function (idmotivo, fecha) {
            var params = {
                idmotivo: idmotivo,
                fecha: fecha,
                tipoContabilizacion: 2,
                descripcion: 'Cancelando Documento: ',
            };
            var selecteds = view.smoperacion.getSelections();
            if (/*!this.fDifEstados() &&*/ selecteds[0].data.idestado != 6) {
                params.contabilizado = 0;
                this.guardarCancelacion(null, null, null, params)
            } else {
                params.contabilizado = 1;
                this.fLoadDataComprobante(params);
            }
        };
        //---------------------------------------------------------------------------------------------------------------------------------------------------------------------


        view.btnCancelar.on({
            click: function () {
                var selecteds = view.smoperacion.getSelections();
                if (selecteds.length > 0) {
                    if (selecteds[0].json.idestado == 6 || selecteds[0].json.idestado == 5) {
                        mostrarMensaje(2, 'Esta seguro que quiere efectuar esta cancelación', function (btnPress) {
                            if (btnPress === 'ok') {
                                var windowCancelar = new Desagregacion.Presupuesto.WindowCancelar(this, selecteds[0].data.fecha);
                                windowCancelar.show();
                                windowCancelar.on({
                                    scope: this,
                                    close: function () {
                                        //  this.scope.keyMap.enable();
                                    }
                                });
                            }
                            if (btnPress === 'cancel') {
                                this.scope.keyMap.enable();
                            }
                        }.bind(this));
                    } else {
                        var mensaje = (selecteds.length > 1)
                            ? '¿Est&aacute; seguro que desea cancelar los documentos seleccionados?'
                            : '¿Est&aacute; seguro que quiere cancelar el documento seleccionado?';


                        mostrarMensaje(2, mensaje, function (btnPress) {
                            if (btnPress === 'ok') {

                                scope.deleteDesagregacion(selecteds);
                                view.btnCancelar.focus();

                            }
                        });
                    }
                }
            }
        })


        view.rowactionDel.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    mostrarMensaje(2, "Seguro que desea eliminar", function (btnPress) {
                        if (btnPress === 'ok') {
                            arrayelementosaeliminar.push(record.data.iddesagregacion);
                            scope.deleteDesagregacion();
                        }
                    });
                    view.rowEditor.stopEditing(true);
                    break;
            }
        });
        this.deleteDesagregacion = function (selecteds) {
            var seleccionado = view.GridPresupuesto.getSelectionModel().getSelected();
            view.btnDuplicar.disable();
            view.GridPresupuesto.getStore().remove(seleccionado);
            // if (view.GridPresupuesto.getStore().getCount() == 0)
            //     view.btnAceptar.disable();
            // else view.btnAceptar.enable();


        };

        view.btnEliminar.on({
            click: function () {
                var selecteds = view.smoperacion.getSelections();
                var mensaje = (selecteds.length > 1)
                    ? '¿Est&aacute; seguro que desea eliminar los documentos seleccionados?'
                    : '¿Est&aacute; seguro que quiere eliminar el documento seleccionado?';


                mostrarMensaje(2, mensaje, function (btnPress) {
                    if (btnPress === 'ok') {

                        var arrayIdDoc = Array();
                        var noestado = 8;
                        var msg = (selecteds.length > 1)
                            ? 'Los documentos han sido eliminados satisfactoriamente.'
                            : 'El documento ha sido eliminado satisfactoriamente.';
                        for (var i = 0; i < selecteds.length; i++) {
                            arrayIdDoc.push(selecteds[i].json.id_docpresupuesto);
                        }
                        Ext.Msg.wait('Efectuando operación...', 'Por favor espere...');
                        Ext.Ajax.request({
                            url: 'eliminardesagre',
                            method: 'POST',
                            params: {
                                arrayIdDoc: Ext.encode(arrayIdDoc),
                                estado: noestado
                            },
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                if (responseData.codM == 1) {
                                    var msg = "La operación se realizó correctamente..."
                                    mostrarMensaje(1, msg);
                                    view.btnPostear.disable();
                                    view.btnMod.disable();
                                    view.btnConfirmar.disable();
                                    view.btnCancelar.disable();
                                    view.btnDuplicar.disable();
                                    model.stobteneragrupaciones.reload();
                                    Ext.Msg.hide();
                                }
                            }
                        });

                    }
                });

            }
        })

        view.btnAceptarConjuntoOperaciones.on({
            click: function () {
                Ext.Msg.wait('Guardando datos...');
                scope.saveNewDesagregacion();

            }
        })


        view.rowEditor.on({

            afteredit: function (editor, grid, changes, record, rowIndex) {
                view.tacomentario.enable();
                view.dfFecha.enable();
                if (record.data.string_cuenta == 1)
                    record.data.string_cuenta = 'Debito'
                else
                    record.data.string_cuenta = 'Credito'

                var selecteds = view.smoperacionnueva.getSelections();
                if (selecteds.length == 0) {
                    var valueaux;
                    valueaux = view.editUM.getValue();
                    record.data.unidad_militar = view.editUM.getRawValue();
                    record.data.unidadm = valueaux;
                    // arrayUM.push(valueaux);

                    valueaux = view.edircbCuenta.getValue();
                    // arrayCuenta.push(view.edircbCuenta.getRawValue());

                    valueaux = view.elementoGasto.getValue();
                    //arrayelementoGasto.push(valueaux);
                    record.data.elemento_gasto = view.elementoGasto.getRawValue();
                    record.data.partida = valueaux;

                    valueaux = view.NAEEdit.getValue();
                    //arrayNAE.push(valueaux)
                    record.data.descripcion_NAE = view.NAEEdit.getRawValue()
                    record.data.grupo = valueaux;

                    valueaux = view.comboespecialidad.getValue();
                    //arrayespecialidad.push(valueaux)
                    record.data.especialidadcargar = view.comboespecialidad.getRawValue();
                    record.data.especialidad = valueaux;
                } else {
                    if (changes['especialidadcargar'] != null) {
                        valueaux = view.comboespecialidad.getValue();
                        //arrayespecialidad.push(valueaux)
                        record.data.especialidadcargar = view.comboespecialidad.getRawValue();
                        record.data.especialidad = valueaux;
                    }
                    if (changes['unidad_militar'] != null) {
                        valueaux = view.editUM.getValue();
                        record.data.unidad_militar = view.editUM.getRawValue();
                        record.data.unidadm = valueaux;
                    }
                    if (changes['descripcion_NAE'] != null) {
                        valueaux = view.NAEEdit.getValue();
                        record.data.descripcion_NAE = view.NAEEdit.getRawValue()
                        record.data.grupo = valueaux;
                    }
                    if (changes['elemento_gasto'] != null) {
                        valueaux = view.elementoGasto.getValue();
                        record.data.elemento_gasto = view.elementoGasto.getRawValue();
                        record.data.partida = valueaux;
                    }
                }
                model.store_desagregacion.commitChanges();


                var arrayDesagregacion = view.GridPresupuesto.getStore().getRange();


                view.smoperacionnueva.clearSelections()
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                if (record.data.idestado == 8 || record.data.idestado == 6)
                    return true;
                else
                    return false;
            },
            canceledit: function (roweditor, grid, record, rowIndex) {
                //view.smoperacion.clearSelections()
                view.smoperacionnueva.clearSelections();

            },
        });

        this.saveNewDesagregacion = function () {
            var arrayDesagregacion = view.GridPresupuesto.getStore().getRange();
            if (seleccion == 1)
                idcuenta = view.edircbCuenta.value;
            scope.selecteds = view.smoperacionnueva.getSelected();
            // if(scope.selecteds==undefined)
            // {

            //var arrayDesagregacion = view.GridPresupuesto.getStore().getModifiedRecords();
            var newDesagregacion = new Array();
            Ext.Msg.wait('Guardando datos.', 'Por favor espere...');
            for (var i = 0; i < arrayDesagregacion.length; i++) {
                var naturaleza_cuenta;
                if (arrayDesagregacion[i].data.string_cuenta == 'Debito')
                    naturaleza_cuenta = 1;
                else
                    naturaleza_cuenta = 2;

                newDesagregacion.push({
                    iddesagregacion: arrayDesagregacion[i].data.iddesagregacion,
                    iddocumento: arrayDesagregacion[i].data.iddocumento,
                    seleccion: seleccion,
                    fecha: view.dfFecha.getRawValue(),
                    descripcion: view.tacomentario.getValue(),
                    operacion: arrayDesagregacion[i].data.operacion2,
                    unidadm: arrayDesagregacion[i].data.unidadm,
                    partida: arrayDesagregacion[i].data.partida,
                    importe: arrayDesagregacion[i].data.importe,
                    grupo: arrayDesagregacion[i].data.grupo,
                    especialidad: arrayDesagregacion[i].data.especialidad,
                    naturaleza_cuenta: naturaleza_cuenta
                });
            }

            Ext.Ajax.request({
                method: "POST",
                url: "guardardatos",
                params: {
                    arrayOperaciones: Ext.encode(newDesagregacion),
                    arrayEliminar: Ext.encode(arrayelementosaeliminar),
                    iddoceliminar: iddoceliminar
                },
                scope: this,
                callback: function (options, success, response) {
                    arrayelementosaeliminar.splice(0, arrayelementosaeliminar.length);
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codM == '1') {
                        Ext.Msg.hide();
                        mostrarMensaje(1, "Los datos han sido guardados satifactoriamente.");
                        scope.selecteds = undefined;
                        view.btnMod.disable();
                        model.store_desagregacion.baseParams.id_docpresupuesto = 0;
                        model.store_desagregacion.reload();
                        model.stobteneragrupaciones.reload();
                        view.winAdicionarPresupuesto.hide();
                        view.winAdicionarPresupuesto.close();
                    } else
                        mostrarMensaje(respuesta.codMsg, respuesta.mensaje);
                }
            });
        };

        // this.guardardesagregacion = function () {
        //     if (seleccion == 1)
        //         idcuenta = view.edircbCuenta.value;
        //     Ext.Msg.wait('Guardando datos.', 'Por favor espere...');
        //     var selecteds = view.smoperacionnueva.getSelected();
        //     if (isNaN(scope.selecteds.data['unidad_militar']) == false)
        //         var identidad = view.editUM.value;
        //     else
        //         var identidad = scope.selecteds.data['unidadm'];
        //
        //     if (isNaN(scope.selecteds.data['descripcion_NAE']) == false)
        //         var grupo = view.NAEEdit.value;
        //     else
        //         var grupo = scope.selecteds.data['grupo'];
        //     if (isNaN(scope.selecteds.data['especialidadcargar']) == false)
        //         var especialidad = view.comboespecialidad.value;
        //     else
        //         var especialidad = scope.selecteds.data['especialidad'];
        //
        //     if (isNaN(scope.selecteds.data['elemento_gasto']) == false)
        //         var elementgasto = view.elementoGasto.value;
        //     else
        //         var elementgasto = scope.selecteds.data['partida'];
        //
        //     if (isNaN(scope.selecteds.data['naturaleza_cuenta']) == false) {
        //         var cuenta = scope.selecteds.data['naturaleza_cuenta'];
        //     } else
        //         var cuenta = scope.selecteds.data['naturaleza_cuenta'];
        //
        //     if (isNaN(scope.selecteds.data['fechaoperacion']) == false)
        //         var fecha = view.fechaoperacion.getRawValue();
        //     else
        //         var fecha = scope.selecteds.data['fechaoperacion'];
        //
        //
        //     Ext.Ajax.request({
        //         url: 'guardardatos',
        //         method: 'POST',
        //         params: {
        //
        //             iddesagregacion: selecteds.data.iddesagregacion,
        //             seleccion: seleccion,
        //             operacion: selecteds.data.operacion2,
        //             unidadm: identidad,
        //             partida: elementgasto,//selecteds.data.partida,
        //             importe: selecteds.data.importe,
        //             grupo: grupo,
        //             especialidad: especialidad,
        //             naturaleza_cuenta: cuenta,
        //             fechaoperacion: fecha//view.fechaoperacion.getRawValue()
        //
        //
        //         },
        //         callback: function (options, success, response) {
        //             var responseData = Ext.decode(response.responseText);
        //             if (responseData.codM == 1) {
        //                 var msg = "Los datos han sido modificados..."
        //                 mostrarMensaje(1, msg);
        //                 scope.selecteds = undefined;
        //                 model.store_desagregacion.reload();
        //                 view.btnConfirmar.disable();
        //                 view.btnCancelar.disable();
        //                 view.btnMod.disable();
        //                 Ext.Msg.hide();
        //             }
        //         }
        //     });
        // }
        this.recordDesagregacion = Ext.data.Record.create([
            {name: 'iddesagregacion', type: 'int'},
            {name: 'iddocumento', type: 'int'},
            {name: 'operacion', type: 'sting'},
            {name: 'unidad_militar', type: 'sting'},
            {name: 'grupo', type: 'sting'},
            {name: 'especialidad', type: 'sting'},
            {name: 'partida', type: 'int'},
            {name: 'importe', type: 'int'},
            {name: 'idestado', type: 'int'},
            {name: 'fechaoperacion', type: 'date'},
            {name: 'shEliminar', type: 'string'},
            {name: 'showCmp', type: 'string'},
            {name: 'naturaleza_cuenta', type: 'int'},
            {name: 'string_cuenta', type: 'string'},
            {name: 'unidadm', type: 'int'},
            //{name: 'numerodoc', type: 'int'},
            // {name: 'nomEstado', type: 'int'},
            //{name: 'idoperacion', type: 'int'},
            //{name: 'operacion2', type: 'string'},
            // {name: 'descripcion_NAE', type: 'string'},
            // {name: 'especialidadcargar', type: 'string'},
            //{name: 'numcomprobante', type: 'int'},

        ]);
        view.btnAdicionar.on({
            click: function () {
                view.btnPostear.disable();
                view.btnMod.disable();
                view.btnConfirmar.disable();
                view.btnCancelar.disable();
                view.smoperacionnueva.clearSelections();

                var recTal = new scope.recordDesagregacion({
                    iddesagregacion: 0,
                    operacion: '',
                    unidad_militar: '',
                    grupo: '',
                    especialidad: '',
                    partida: '',
                    importe: null,
                    iddocumento: 0,
                    idestado: 8,
                    shEliminar: 'true',
                    unidadm: 0,
                    fechaoperacion: null,
                    string_cuenta: stringcuenta,
                    naturaleza_cuenta: idcuenta,
                    // nomEstado:0,
                    //idoperacion:0,
                    //operacion2:'',
                    // descripcion_NAE:'',
                    // especialidadcargar:'',
                    // elemento_gasto:'',
                    // numcomprobante:0,
                    showCmp: 'false'
                });
                view.rowEditor.stopEditing();
                model.store_desagregacion.insert(0, recTal);
                view.GridPresupuesto.getView().refresh();
                view.rowEditor.startEditing(0, 0);
                view.cbOperacion.focus(true, 100);


            }
        })

        this.recordDuplicar = Ext.data.Record.create([
            {name: 'iddesagregacion', type: 'int'},
            {name: 'iddocumento', type: 'int'},
            {name: 'operacion', type: 'sting'},
            {name: 'unidad_militar', type: 'sting'},
            {name: 'grupo', type: 'sting'},
            {name: 'especialidad', type: 'sting'},
            {name: 'partida', type: 'int'},
            {name: 'importe', type: 'int'},
            {name: 'idestado', type: 'int'},
            {name: 'unidadm', type: 'int'},
            {name: 'idoperacion', type: 'int'},
            // {name: 'numerodoc', type: 'int'},
            {name: 'fecha', type: 'string'},
            // {name: 'nomEstado', type: 'int'},
            //{name: 'idoperacion', type: 'int'},
            {name: 'operacion2', type: 'string'},
            {name: 'elemento_gasto', type: 'string'},
            {name: 'descripcion_NAE', type: 'string'},
            {name: 'especialidadcargar', type: 'string'},
            {name: 'nomEstado', type: 'string'},
            {name: 'shEliminar', type: 'string'},
            //{name: 'numcomprobante', type: 'int'},
            {name: 'showCmp', type: 'string'},
            {name: 'naturaleza_cuenta', type: 'int'},
            {name: 'string_cuenta', type: 'string'},
        ]);
        view.btnDuplicar.on({
            click: function () {
                var selecteds = view.smoperacionnueva.getSelections();
                view.btnPostear.disable();
                view.btnMod.disable();
                view.btnConfirmar.disable();
                view.btnCancelar.disable();
                view.smoperacionnueva.clearSelections()

                var recDuplicar = new scope.recordDuplicar({
                    iddesagregacion: 0,
                    operacion2: selecteds[0].data.operacion2,
                    unidad_militar: selecteds[0].data.unidad_militar,
                    descripcion_NAE: selecteds[0].data.descripcion_NAE,
                    especialidadcargar: selecteds[0].data.especialidadcargar,
                    elemento_gasto: selecteds[0].data.elemento_gasto,
                    importe: selecteds[0].data.importe,
                    iddocumento: 0,
                    idestado: 8,
                    unidadm: selecteds[0].data.unidadm,
                    partida: selecteds[0].data.partida,
                    operacion: selecteds[0].data.operacion,
                    grupo: selecteds[0].data.grupo,
                    especialidad: selecteds[0].data.especialidad,
                    //numerodoc:0,
                    shEliminar: 'false',
                    // nomEstado:0,
                    //idoperacion:0,
                    // numcomprobante:0,
                    showCmp: 'false',
                    nomEstado: '',
                    idoperacion: 0,
                    fecha: '',
                    string_cuenta: selecteds[0].data.string_cuenta,
                    naturaleza_cuenta: selecteds[0].data.naturaleza_cuenta,


                });
                banderaduplicar = true;
                view.rowEditor.stopEditing();
                model.store_desagregacion.insert(0, recDuplicar);
                view.GridPrincipal.getView().refresh();
                view.rowEditor.startEditing(0, 0);
                view.cbOperacion.focus(true, 100);

                // view.editUM.setValue(selecteds[0].json.unidadm);
                // view.editUM.setRawValue(selecteds[0].json.unidad_militar);
                //
                // view.edircbCuenta.setValue(selecteds[0].json.naturaleza_cuenta);
                // view.edircbCuenta.setRawValue(selecteds[0].json.string_cuenta);
                //
                //
                // view.elementoGasto.setValue(selecteds[0].json.partida);
                // view.elementoGasto.setRawValue(selecteds[0].json.elemento_gasto);
                //
                // view.NAEEdit.setValue(selecteds[0].json.grupo);
                // view.NAEEdit.setRawValue(selecteds[0].json.descripcion_NAE);
                //
                // view.comboespecialidad.setValue(selecteds[0].json.especialidad);
                // view.comboespecialidad.setRawValue(selecteds[0].json.especialidadcargar);

                view.editUM.setValue(selecteds[0].data.unidadm);
                view.editUM.setRawValue(selecteds[0].data.unidad_militar);

                view.edircbCuenta.setValue(selecteds[0].data.naturaleza_cuenta);
                view.edircbCuenta.setRawValue(selecteds[0].data.string_cuenta);


                view.elementoGasto.setValue(selecteds[0].data.partida);
                view.elementoGasto.setRawValue(selecteds[0].data.elemento_gasto);

                view.NAEEdit.setValue(selecteds[0].data.grupo);
                view.NAEEdit.setRawValue(selecteds[0].data.descripcion_NAE);

                view.comboespecialidad.setValue(selecteds[0].data.especialidad);
                view.comboespecialidad.setRawValue(selecteds[0].data.especialidadcargar);


            }
        })

        view.btnConfirmar.on({
            click: function () {
                var arrayIdDoc = Array();
                var selecteds = view.smoperacion.getSelections();
                for (var i = 0; i < selecteds.length; i++) {
                    arrayIdDoc.push(selecteds[i].json.iddocumento);

                }
                //id = selecteds.json.iddocumento;
                Ext.Msg.wait('Cambiando estado...', 'Por favor espere...');
                Ext.Ajax.request({
                    url: 'confirmarestado',
                    method: 'POST',
                    params: {
                        arrayIdDoc: Ext.encode(arrayIdDoc),
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codM == 1) {
                            view.btnConfirmar.disable();
                            var msg = "Los documentos han sido confirmados..."
                            mostrarMensaje(1, msg);
                            model.stobteneragrupaciones.reload();
                            view.btnPostear.disable();
                            view.btnMod.disable();
                            view.btnConfirmar.disable();
                            view.btnCancelar.disable();
                            Ext.Msg.hide();
                        }
                        else if (responseData.arrayCtaInvalid.length) {
                            Ext.Msg.hide();
                            mostrarMensaje(1, '<b>Las siguentes aperturas no existen:</b><br>' + responseData.arrayCtaInvalid, function () {
                            });
                        }
                    }
                });

            }

        })
        view.btnPostear.on({
            scope: this,

            click: function () {
                //this.scope.keyMap.disable();
                var msg = (view.smoperacion.getSelections().length > 1)
                    ? 'Seguro que desea postear las operaciones seleccionadas.'
                    : 'Seguro que desea postear la operacion seleccionada.';
                mostrarMensaje(2, msg, function (btnPress) {
                    if (btnPress === 'ok') {
                        view.btnPostear.disable();
                        scope.contabilizarDesagregacion();
                    }
                }.bind(view));
            }
        });
        this.contabilizarDesagregacion = function () {
            var param = {
                tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                actionContabiliza: 'contabilizar',
                descripcion: 'Posteando presupuesto: ',
            };
            this.fLoadDataComprobante(param);
        };

        this.fLoadDataComprobante = function (params) {
            var arrayIdDoc = [];
            var arrayIdDocPres = [];
            var arrayCodEspecialidades = [];
            var arrayCodPartidas = [];
            var arrayCodNAE = [];
            var arrayUM = [];
            var arrayfechaoperacion = [];
            var arrayidestructuracomun = [];
            var arrayidestructuraeconomica = [];
            var arraynaturalezacuenta = [];
            var arrayselecion = [];
            var arrayoperacion = [];
            var arraySelections = view.smoperacion.getSelections();
            for (var i = 0; i < arraySelections.length; i++) {
                arrayIdDoc.push(arraySelections[i].json.iddocumento);
                arrayIdDocPres.push(arraySelections[i].json.id_docpresupuesto);
                // arrayCodEspecialidades.push(arraySelections[i].json.especialidad);
                // arrayCodPartidas.push(arraySelections[i].json.partida);
                // arrayCodNAE.push(arraySelections[i].json.grupo);
                // arrayUM.push(arraySelections[i].json.unidadm);
                // arrayfechaoperacion.push(arraySelections[i].json.fechaoperacion);
                // arrayidestructuracomun.push(arraySelections[i].json.idestructuracomun);
                // arrayidestructuraeconomica.push(arraySelections[i].json.idestructura);
                // arraynaturalezacuenta.push(arraySelections[i].json.naturaleza_cuenta);
                // arrayselecion.push(arraySelections[i].json.seleccion);
                // arrayoperacion.push(arraySelections[i].json.operacion);
            }
            var selecteds = view.smoperacion.getSelections();
            Ext.Msg.wait(/*this.idioma.lbLoadDataComprobante*/'Realizando Operacion', 'Realizando Operacion'/*this.idioma.lbEspere*/);
            params.arrayIdDoc = arrayIdDoc;

            Ext.Ajax.request({
                    url: 'cargarcomprobante',
                    method: 'POST',
                    scope: this,
                    params: {
                        arrayIdDoc: Ext.encode(arrayIdDoc),
                        arrayIdDocPres: Ext.encode(arrayIdDocPres),
                        tipoContabilizacion: params.tipoContabilizacion,
                        //idDocInst: params.idDocInst
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codM) {
                            if (responseData.codM == -2) {
                                mostrarMensaje(1, this.idioma.msgCambioEstado);
                                Ext.MessageBox.hide();
                            }
                        } else if (responseData.arrayCtaInvalid.length) {
                            mostrarMensaje(1, '<b>Las siguentes aperturas no existen:</b><br>' + responseData.arrayCtaInvalid, function () {
                            });
                        } else {
                            this.fShowComprobante(responseData, params);
                            Ext.MessageBox.hide();
                        }
                    }.bind(this)
                }
            );
        };
        this.fShowComprobante = function (respData, params) {
            var idSubsistema = 15;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = params.descripcion + respData.descripcion;
            var detalle = params.descripcion + respData.detalle;
            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                Ext.Msg.wait(/*this.idioma.lbGuardandoComprobante, this.idioma.lbEspere*/"Guardando Comprobante", "Por favor espere...");
                if (params.tipoContabilizacion === 1)
                    this.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, params);
                else
                    this.guardarCancelacion(idComprobante, numComprobante, fechaComprobante, params);
            }.bind(this)).onClose(function () {
                this.scope.keyMap.enable();
                noWindow = true;//para indicar que se cerro la ventana
                this.btnContatabDeposito.enable();
            }.bind(this));
        };

        this.guardarCancelacion = function (idComprobante, numComprobante, fechaComprobante, params) {
            Ext.Msg.wait(/*this.idioma.lbCancelandoDeposito*/'Cancelando Documento', "espere" /*this.idioma.lbEspere*/);

            var arrayIdDoc = new Array();
            //var selections = this.selectionsOnPaging();
            var selecteds = view.smoperacion.getSelections();
            var estado = selecteds[0].json.idestado;
            for (var i = 0; i < selecteds.length; i++) {
                arrayIdDoc.push((selecteds[i].data.iddocumento).toString());
            }

            Ext.Ajax.request({
                method: "POST",
                url: 'cancelarDeposito',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    idestado: estado,
                    idComprobante: idComprobante,
                    numComprobante: numComprobante,
                    fechaComprobante: fechaComprobante,
                    //idCajaFondo: Caja.Deposito.Fondo.idcajafondo,
                    idmotivo: params.idmotivo,
                    fecha: params.fecha,
                    contabilizado: params.contabilizado,
                    enestadocuenta: selecteds[0].data.idestado ? true : false,
                    idDocInst: params.idDocInst,
                    //idmonedaEntidad: Caja.Deposito.Fondo.idmonedaEntidad
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.Msg.hide();
                    view.btnCancelar.disable();
                    model.stobteneragrupaciones.reload();
                    if (params.contabilizado)
                        mostrarMensaje(1, 'Se cancelo y contabilizo el comprobante '/*this.idioma.lbMsgCancelContabilizado*/ + ' ' + numComprobante + '.');
                    else mostrarMensaje(1, 'El documento ha sido cancelado'/*s.idioma.lbMsgCancelDeposito*/);

                    if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                        params.record.set('hideCancel', true);
                        params.record.set('idestado', 7);
                    }
                }.bind(this)
            });
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, params, fnPostear) {
            Ext.Ajax.request({
                method: "POST",
                url: 'contabilizarDeposito',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(params.arrayIdDoc),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    //idCajaFondo: Caja.Deposito.Fondo.idcajafondo,
                },
                callback: function (options, success, response) {
                    // var responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    //  this.disableBottons();
                    // this.stDeposito.reload();
                    model.stobteneragrupaciones.reload();
                    mostrarMensaje(1, /*this.idioma.lbMsgContabilizado*/'Contabilizado ' + ' ' + numeroComprobante + '.');
                    if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                        params.record.set('hideCancel', true);
                        params.record.set('idestado', 7);
                    }
                    if (typeof fnPostear === 'function') {
                        fnPostear();
                    }
                }.bind(this)
            });
        };


        view.GridPrincipal.on({

            rowdblclick: function (grid, rowIndex) {


                    view.filters.clearFilters();

                var selecteds = view.smoperacion.getSelections();
                if (selecteds[0].data.idestado != 8) {
                   // view.winMostrarLastConfirmar.show();
                    model.store_desagregacion.baseParams.id_docpresupuesto = selecteds[0].data.id_docpresupuesto;
                    model.store_desagregacion.reload();
                    //view.rowactionDel.hide();
                    view.rowEditor.disable();
                    view.panelsur.disable()
                    view.btnAceptarConjuntoOperaciones.hide();
                    view.btnAdicionar.hide();
                    view.btnDuplicar.hide();

                    var selecteds = view.smoperacion.getSelections();
                    if (view.tacomentario.getValue() != '' && view.dfFecha.getValue() != '')
                        view.btnAceptarConjuntoOperaciones.enable();
                    else
                        view.btnAceptarConjuntoOperaciones.disable();
                    if (model.store_operacion.data.length > 0) {
                        view.tacomentario.enable();
                        view.dfFecha.enable();
                    }
                    var fechasave = selecteds[0].data.fecha_operacion
                    view.dfFecha.setValue(fechasave);
                    view.tacomentario.setValue(selecteds[0].data.descripcion);

                    view.winAdicionarPresupuesto.show();
                } else {
                    view.rowEditor.enable();
                    view.panelsur.enable()
                    view.btnAceptarConjuntoOperaciones.show();
                    view.btnDuplicar.show();
                    view.btnAdicionar.show();

                    view.btnDuplicar.disable();
                    var selecteds = view.smoperacion.getSelections();
                    if (view.tacomentario.getValue() != '' && view.dfFecha.getValue() != '')
                        view.btnAceptarConjuntoOperaciones.enable();
                    else
                        view.btnAceptarConjuntoOperaciones.disable();
                    if (model.store_operacion.data.length > 0) {
                        view.tacomentario.enable();
                        view.dfFecha.enable();
                    }
                    var fechasave = selecteds[0].data.fecha_operacion
                    view.dfFecha.setValue(fechasave);
                    view.tacomentario.setValue(selecteds[0].data.descripcion);
                    view.winAdicionarPresupuesto.setTitle("Modificar Elementos");
                    iddoceliminar = selecteds[0].data.id_docpresupuesto;
                    view.winAdicionarPresupuesto.show();
                    model.store_desagregacion.baseParams.id_docpresupuesto = selecteds[0].data.id_docpresupuesto;
                    model.store_desagregacion.reload();
                }
            }
        })


        // view.GridConfig.on({
        //     click : function( ) {
        //         var flag=true;
        //         for(var i=0; i<model.store_tipo_operacion.data.length; i++)
        //         {
        //             if(model.store_tipo_operacion.data.items[i].data['nombre_operacion']=='')
        //               flag=false;
        //         }
        //
        //         if(!flag && view.GridConfig.store.modified.length>=3)
        //             view.btnAceptar_Operacion.enable();
        //       else if(view.GridConfig.store.modified.length>=1 && flag)
        //         {
        //             view.btnAceptar_Operacion.enable();
        //         }
        //     }
        // });
        /*
        Ext.getCmp('gpEntidad').getStore().on('load', function (store, records, options) {
            if (view.jrEntidad.jsonData.Actual != null)
                scope.fValorActual(store, 'Entidad', view.jrEntidad.Entidades.Actual);
        });*/

        /*  view.cbUM.on('expand', function () {

                      Ext.getCmp('gpEntidad').getStore().removeAll();
                      Ext.getCmp('gpEntidad').getStore().load({
                          params: {
                              tipo: seleccion
                          }
                      });

          });*/

        view.rowEditorConfig.on({

            afteredit: function (editor, grid, changes, record, rowIndex) {

                if (rowIndex == 0) {
                    tipo_operacion = 1;
                    //  denominacion= record.data['nombre_tipo'];
                    id_operacion = record.data['nombre_operacion'];
                    id_operacion_credito_mov = record.data['nombre_operacion_movimiento'];
                }
                if (rowIndex == 1) {
                    tipo_operacion = 2;
                    //  denominacion= record.data['nombre_tipo'];
                    id_operacion = record.data['nombre_operacion'];
                    id_operacion_credito_mov = record.data['nombre_operacion_movimiento'];
                }
                if (rowIndex == 2) {
                    tipo_operacion = 3;
                    // denominacion= record.data['nombre_tipo'];
                    id_operacion = record.data['nombre_operacion'];
                    id_operacion_credito_mov = record.data['nombre_operacion_movimiento'];
                }


                scope.saveConfiguracion();
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                // if(record.data.idestado!=8)
                //     return false;
            },
            canceledit: function (roweditor, grid, record, rowIndex) {
                //view.smoperacion.clearSelections()
            },
        });

        this.saveConfiguracion = function () {

            view.GridConfig.store.commitChanges();


            Ext.Msg.wait('Guardando configuracion...');
            Ext.Ajax.request({
                url: 'guardarconfiguracion',
                method: 'POST',
                params: {
                    seleccion: seleccion,
                    tipo: tipo_operacion,
                    // denominacion: denominacion,
                    id_operacion: id_operacion,
                    id_operacion_credito_mov: id_operacion_credito_mov
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM == 1) {
                        if (responseData.bandera == 3)
                            view.btnAdicionar.enable();
                        view.btnConfirmar.disable();
                        var msg = "Se ha guardado la configuracion"
                        mostrarMensaje(1, msg);
                        // model.store_desagregacion.reload();
                        view.btnPostear.disable();
                        view.btnMod.disable();
                        view.btnConfirmar.disable();
                        view.btnCancelar.disable();
                        model.store_tipo_operacion.reload();
                        view.GridConfig.getView().refresh();
                        j = 0;
                        Ext.Msg.hide();

                    } else if (responseData.codM == 2) {
                        var msg = "La operacion " + responseData[0] + " esta en uso"
                        mostrarMensaje(1, msg);
                        model.store_tipo_operacion.reload();
                        view.GridConfig.getView().refresh();
                        Ext.Msg.hide();


                    }
                }
            });


        }


////***** MOSTRAR EL REPORTE*****//////////
        view.btnReporte.on({
            click: function () {
                scope.fShowReporte();
            }
        });

        this.fShowReporte = function () {
            Ext.Msg.wait('Cargando', 'Por favor espere...');
            var selections = view.smoperacion.getSelections();
            var arrayIdDoc = [];
            for (var v = 0; v < selections.length; v++) {
                arrayIdDoc.push(selections[v].data.iddocumento);
            }

            Ext.Ajax.request({
                url: 'getDataReporte',
                method: 'POST',
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData)
                        scope.fOpenWindowReport(responseData);
                    Ext.MessageBox.hide();
                }
            });
        };

        this.fOpenWindowReport = function (datosReporte) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };
        view.btnCerrarpanelpresupuesto.on({
            click: function () {
                arrayelementosaeliminar.splice(0, arrayelementosaeliminar.length);
                view.winAdicionarPresupuesto.hide();
                model.store_desagregacion.baseParams.id_docpresupuesto = 0;
                model.store_desagregacion.reload();
            }
        });

    }
}
;