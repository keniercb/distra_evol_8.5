/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Conf.GridEditor.Operaciones
 * @extends Ext.grid.EditorGridPanel
 */
Ext.namespace('Ext.Conf.GridEditor.Operaciones');
Ext.Conf.GridEditor.Operaciones = Ext.extend(Ext.grid.EditorGridPanel, {
    perfil: {},
    idioma: {},
    arreliminados: new Array(),
    //Functions
    constructor: function (params) {

        this.addEvents('gridvalid', 'insertrow');
        this.arreliminados = new Array();
        this.mapaTeclas = null;
        this.rowindex = -1;

        var rowaction = new Ext.grid.RowActions({
            id: 'ra' + params.idsubsistema,
            actions: [
                {
                    id: 'eliminar',
                    tooltip: params.idioma.tooltipEliminar,
                    iconCls: 'icondistra-eliminar',
                    hide: actionValidate.actions['eliminar'] ? false : true,
                    marginLeft: 5,
                    width: 16,
                    height: 16
                }
            ]
        });
        rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    this.deleteRows(params.idioma);
                    break;
            }
        }, this);
        var _this = this;
        this.sf = new Ext.Cont.SearchField({
            id: 'sf' + params.idsubsistema,
            width: 250,
            emptyText: params.idioma.emptyText || 'Criterio a buscar...',
            searchTooltip: params.idioma.searchTooltip || 'Buscar elementos <b>(Alt+B)</b>',
            clearTooltip: params.idioma.clearTooltip || 'Limpiar filtro <b>(Alt+L)</b>',
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\,\-\.\(\)]+$/,
            maskRe: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\,\-\.\(\)]+$/,
            regexText: params.idioma.regexTextDenominacion,
            fnOnSearch: function () {
                _this.search();
            },
            fnOnClear: function () {
                _this.clear();
            }
        });

        var roweditor = params.roweditor = new Ext.contabilidad.util.RowEditor({
            id: 'roweditor' + params.idsubsistema,
            saveText: params.idioma.textbtnaceptarRoweditor,
            saveTooltip: params.idioma.textbtnaceptarRe,
            iconSave: 'aceptar',
            iconCancel: 'cancelar',
            iconCls: 'btn',
            cancelText: params.idioma.textbtncancelarRoweditor,
            cancelTooltip: params.idioma.textbtncancelarRe
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            id: 'geditor' + params.idsubsistema,
            selModel: new Ext.grid.RowSelectionModel({id: 'sm' + params.idsubsistema}),
            autoScroll: true,
            clicksToEdit: 2
        });

        //Denominación de la operación contable
        var tfdenominacion = this.tfdenominacion = new Ext.form.TextField({
            allowBlank: false,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\,\-\.\(\)\+]+$/,
            maskRe: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\,\-\.\(\)\+]+$/,
            regexText: this.idioma.regexTextDenominacion,
            maxLength: 255
        });

        var cbmodelos = this.cbmodelos = new Ext.form.ComboBox({
            store: new Ext.data.Store({
                id: 'stmodelos' + params.idsubsistema,
                //url: '',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'data',
                    id: 'jrmodelo' + params.idsubsistema
                }, [
                    {name: 'idmodelo'},
                    {name: 'nombre'}
                ])
            }),
            //editable: false,
            resizable: true,
            lazyRender: true,
            //readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            displayField: 'nombre',
            valueField: 'idmodelo',
            typeAhead: true,
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: true/*,
             savedisplayField: true*/
        });

        var cbsignos = this.cbsignos = new Ext.form.ComboBox({
            store: new Ext.data.Store({
                id: 'stsignos' + params.idsubsistema,
                //url: '',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'data',
                    id: 'jrsignos' + params.idsubsistema
                }, [
                    {name: 'idconceptooperacion'},
                    {name: 'denominacionconcepto'},
                    {name: 'signoconcepto'}
                ])
            }),
            //editable: false,
            resizable: true,
            lazyRender: true,
            //readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="{denominacionconcepto}" class="x-combo-list-item">{denominacionconcepto} ({signoconcepto})</div></tpl>',
            displayField: 'denominacionconcepto',
            valueField: 'idconceptooperacion',
            typeAhead: true,
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: true
        });

        var cbdocumentos = this.cbdocumentos = new Ext.form.ComboBox({
            store: new Ext.data.Store({
                id: 'stdocumentos' + params.idsubsistema,
                //url: '',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'data',
                    id: 'jrdocumento' + params.idsubsistema
                }, [
                    {name: 'iddoc'},
                    {name: 'denominacion'}
                ])
            }),
            //editable: false,
            resizable: true,
            lazyRender: true,
            //readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            displayField: 'denominacion',
            valueField: 'iddoc',
            typeAhead: true,
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false/*,
             savedisplayField: true*/
        });


        Ext.apply(this, {
            loadMask: true,
            store: this.store = new Ext.data.Store({
                id: 'steditor' + params.idsubsistema,
                baseParams: {
                    idsubsistema: params.idsubsistema,
                    start: 0,
                    limit: 20
                },
                url: 'cargaroperaciones',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'data',
                    id: 'jroperaciones' + params.idsubsistema
                }, [
                    {name: 'idnomoperaciones'},
                    {name: 'denominacion'},
                    {name: 'idestructuracomun'},
                    {name: 'idmodelo'},
                    {name: 'iddoc'},
                    {name: 'idsubsistema'},
                    {name: 'valid', type: 'boolean'},
                    {name: 'estructurapropietaria'},
                    {name: 'idoperacionesentidad'},
                    {name: 'asociadoentidad'},
                    {name: 'signo'}
                ])
            }),
            columns: [
                {
                    id: 'denominacion',
                    header: params.idioma.headerDenominacion,
                    dataIndex: 'denominacion',
                    width: 100,
                    editor: tfdenominacion,
                    renderer: function (value) {
                        if (value && _this.sf.hasSearch) {
                            var filtro = _this.sf.getValue();
                            var regex = new RegExp(filtro, "g");
                            return value.replace(regex, '<span style="background-color: rgb(255, 255, 0);">' + filtro + '</span>');
                        }
                        return value;
                    }
                },
                {
                    id: 'documento',
                    header: params.idioma.headerDoc,
                    dataIndex: 'iddoc',
                    width: 200,
                    editor: cbdocumentos,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var newValue = '';
                            var store = cbdocumentos.store;
                            var index = store.find('iddoc', value);
                            if (index != -1) {
                                newValue = store.getAt(index).data.denominacion;
                            }
                            return newValue;
                        }
                    }
                },
                {
                    id: 'signo',
                    header: params.idioma.headerSigno,
                    dataIndex: 'signo',
                    width: 150,
                    editor: cbsignos,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var store = cbsignos.store,
                                index = store.findBy(function (record, id) {
                                    return record.data.idconceptooperacion == value;
                                }),
                                strecord = store.getAt(index);
                            var newValue = strecord.data.denominacionconcepto + ' (' + strecord.data.signoconcepto + ')';
                            return newValue;
                        }
                    }
                },
                {
                    id: 'modelo',
                    header: params.idioma.headerModelo,
                    dataIndex: 'idmodelo',
                    width: 200,
                    editor: cbmodelos,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var store = cbmodelos.store;
                            if (store) {
                                var index = store.find('idmodelo', value);
                                if (index != -1) {
                                    var newValue = store.getAt(index).data.nombre;
                                    return newValue;
                                }
                                return '';
                            }
                        }
                    }
                },
                {
                    id: 'asociadoentidad',
                    dataIndex: 'asociadoentidad',
                    width: 10,
                    sortable: false,
                    resizable: false,
                    align: 'center',
                    hideable: false,
                    menuDisabled: true,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (value === 1) {
                            metadata.attr = 'ext:qtip="<p>' + params.idioma.lbtooltipAsociado + '</p>"';
                            metadata.css = 'icondistra-usarentidad verde';
                        }
                        else {
                            metadata.attr = 'ext:qtip="<p>' + params.idioma.lbtooltipNoAsociado + '</p>"';
                            metadata.css = 'icondistra-usarentidad rojo';
                        }
                    }
                },
                rowaction
            ],
            viewConfig: {
                forceFit: true,
                emptyText: this.idioma.lbNoResults
            },
            autoExpandColumn: 'denominacion',
            plugins: [rowaction, roweditor],
            tbar: [this.sf]
        });

        Ext.Conf.GridEditor.Operaciones.superclass.constructor.call(this);

        this.addEvents('filter');

        this.inicioEventos(this.perfil, this.idioma);
    },
    //Esta función es necesaria para verificar si el grid editor es válido o no
    gridValid: function () {
        return this.getStore().find('valid', 'false') === -1;
    },
    inicioEventos: function (perfil, idioma) {
        this.roweditor.on({
            scope: this,
            afteredit: function (editor, grid, changes, record, rowIndex) {
                record.data.valid = true;
                record.set('asociadoentidad', 1);

                var gridvalid = this.gridValid();
                this.fireEvent("gridvalid", gridvalid, this, record);
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                /* Hacer readonly el nombre de la operacion si no es el propietario */
                this.rowindex = rowIndex;
                var editor = grid.getColumnModel().getCellEditor(0, rowIndex);
                editor.field.setDisabled(record.data.idestructuracomun != record.data.estructurapropietaria);
                //this.mapaTeclas.disable();
                this.btnasociarentidad.setDisabled(true);
                this.btndel.setDisabled(true);
                this.btnadd.setDisabled(true);
            },
            canceledit: function (roweditor, record, rowIndex) {
                //this.mapaTeclas.enable();
            },
            validateedit: function (roweditor, grid, changes, record, rowIndex) {
                //this.mapaTeclas.enable();
                this.tfdenominacion.setValue(this.tfdenominacion.getValue().trim());
                if (!this.tfdenominacion.isValid() || !this.cbdocumentos.isValid()) {
                    mostrarMensaje(1, this.idioma.verificarCampos);
                    return false;
                }
            },
            hide: function () {
                var sm = this.getSelectionModel();
                if (sm.getCount() >= 1) {
                    this.btndel.setDisabled(false);
                } else {
                    this.btndel.setDisabled(true);
                }
                this.btnadd.setDisabled(false);
                if (sm.getCount() === 1) {
                    var asociado = sm.getSelected().data.asociadoentidad;
                    if (!asociado || asociado != 1) {
                        this.btnasociarentidad.setDisabled(false);
                    }
                }
                else {
                    this.btnasociarentidad.setDisabled(true);
                }
            }
        });

        this.tfdenominacion.on(
            {
                show: function () {
                    var value = this.getValue();
                    if (value) {
                        this.setValue(value.trim());
                        /*if(value.indexOf('</span>')){
                         this.setValue(this.getValue().replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''));
                         }*/
                    }
                }
            }
        );

        //Evento para mostrar el boton para eliminar varios elementos
        this.getSelectionModel().on('rowselect', function (selmodel, rowIndex, record) {
            if (selmodel.getCount() > 1) {
                this.btndel.setDisabled(false);
                this.btnasociarentidad.setDisabled(true);
            }
            if (selmodel.getCount() === 1) {
                var asociado = selmodel.getSelected().data.asociadoentidad;
                if (!asociado || asociado != 1) {
                    this.btnasociarentidad.setDisabled(false);
                }
                this.btndel.setDisabled(false);
            }
        }, this);


        //Evento para ocultar el boton para eliminar varios elementos
        this.getSelectionModel().on('rowdeselect', function (selmodel, rowIndex, record) {
            if (selmodel.getCount() < 1) {
                this.btndel.setDisabled(true);
            }
            if (selmodel.getCount() === 1) {
                var asociado = selmodel.getSelected().data.asociadoentidad;
                if (!asociado || asociado != 1) {
                    this.btnasociarentidad.setDisabled(false);
                }
            }
            if (selmodel.getCount() === 0) {
                this.btnasociarentidad.setDisabled(true);
            }
        }, this);

        this.on({
            scope: this,
            gridvalid: function (state, grideditor) {
                this.btnadd.setDisabled(!state);
                this.btnsave.setDisabled(!state);
                this.btndescartar.setDisabled(!state);
            }
        });

        this.getStore().on({
            scope: this,
            remove: function (store, record, index) {
                if (!this.gridValid()) {
                    this.btnadd.setDisabled(true);
                    this.btnsave.setDisabled(true);
                    this.btndescartar.setDisabled(true);
                }
                else {
                    this.btnadd.setDisabled(false);
                    this.btnsave.setDisabled(false);
                    this.btndescartar.setDisabled(false);
                }

                if (Ext.isEmpty(record.data.idnomoperaciones)) {
                    this.btnsave.setDisabled(true);
                    this.btndescartar.setDisabled(true);

                    var datosgen = store.getRange();
                    var datoseli = this.arreliminados;
                    for (var i = 0, long = datosgen.length; i < long; i++) {
                        if (Ext.isEmpty(datosgen[i].data.idnomoperaciones)) {
                            this.btnsave.setDisabled(false);
                            this.btndescartar.setDisabled(false);
                            break;
                        }
                    }

                    for (var j = 0, long = datoseli.length; j < long; j++) {
                        if (!Ext.isEmpty(datoseli[j].data.idnomoperaciones)) {
                            this.btnsave.setDisabled(false);
                            this.btndescartar.setDisabled(false);
                            break;
                        }
                    }

                    var modificados = store.getModifiedRecords();
                    if (modificados.length > 0) {
                        this.btnsave.setDisabled(false);
                        this.btndescartar.setDisabled(false);
                    }

                }

            },
            clear: function () {
                this.btnadd.setDisabled(false);
                this.btnsave.setDisabled(true);
                this.btndescartar.setDisabled(true);
                // Ext.getCmp('btnCreateTemplate').setDisabled(true);
                // Ext.getCmp('btnUseTemplate').setDisabled(true);
            },
            beforeload: function (store, options) {
                this.arreliminados = new Array();
                this.getStore().commitChanges();
            },
            load: function (store, datarecord, options) {
                if (store.getCount() == 0) {
                    var message = (!Ext.isEmpty(this.sf.getValue())) ? this.idioma.lbNoDataResults : this.idioma.lbNoResults;
                    mostrarMensaje(1, message);
                }

                this.btnadd.focus();
                this.btnsave.setDisabled(true);
                this.btndel.setDisabled(true);
                this.btndescartar.setDisabled(true);
                this.btnasociarentidad.setDisabled(true);
            },
            filter: function (store, filtro) {
                if (store.getCount() == 0) {
                    var message = this.idioma.lbNoDataResults;
                    mostrarMensaje(1, message);
                }
            }
        });
    },
    //Función necesaria para insertar una fila dinámicamente,
    //para luego se salven las operaciones contables.
    insertarRow: function () {
        this.btnadd.setDisabled(true);
        this.btndel.setDisabled(true);
        this.btnsave.setDisabled(true);
        this.btndescartar.setDisabled(true);

        var arrdinamico = new Array();
        var objdinamico = {};
        for (var i = 0; i < this.getStore().fields.keys.length; i++) {

            arrdinamico.push({name: this.getStore().fields.keys[i]});
            objdinamico[this.getStore().fields.keys[i]] = '';
        }
        objdinamico.valid = false;

        var Recdinamico = Ext.data.Record.create(arrdinamico);
        var total = this.getStore().getCount();
        this.stopEditing();
        var recdinamico = new Recdinamico(objdinamico);
//            this.getStore().insert(total, recdinamico);
        /* Empezar a editar */
        ;
        this.roweditor.stopEditing();
        this.getStore().insert(total, recdinamico);
        this.getView().refresh();
        this.getSelectionModel().selectRow(total);
        this.roweditor.startEditing(total);
        this.getColumnModel().getCellEditor(0, total).field.focus();
//            this.startEditing(total, 0);
        //Evento que se dispara cuando se inserta una fila
        this.fireEvent('insertrow', this, recdinamico);
    },
    //Función necesaria para eliminar las filas seleccionadas
    //para luego se salven las operaciones contables.
    deleteRows: function (idioma) {
        var seleccionados = this.getSelectionModel().getSelections();
        var cantseleccionados = seleccionados.length;
        if (cantseleccionados > 0) {
            for (var i = 0; i < cantseleccionados; i++) {
                this.arreliminados.push(seleccionados[i]);
                seleccionados[i].commit();
                this.getStore().remove(seleccionados[i]);
            }
            if (this.getSelectionModel().getCount() === 0) {
                this.btndel.setDisabled(true);
            }
        }
        /*else {
         mostrarMensaje(1, idioma.msgEliminarOper);
         }*/
    },
    //Función necesaria para seleccionar la fila a la cual desea asociar
    asociarEntidad: function () {
        var seleccionado = this.getSelectionModel().getSelected();
        var rowIndex = this.getStore().find('idnomoperaciones', seleccionado.data.idnomoperaciones);
        this.roweditor.startEditing(rowIndex);
        this.getColumnModel().getCellEditor(1, rowIndex).field.focus(true);
    },
    //Función necesaria para salvar los datos de las operaciones contables
    saveData: function (idioma) {

        var arreliminados = this.arreliminados;
        var newarreliminados = new Array();
        var modificados = this.getStore().getModifiedRecords();
        var newmodificados = new Array();

        for (var i = 0, long = arreliminados.length; i < long; i++) {
            if (!Ext.isEmpty(arreliminados[i].data.idnomoperaciones)) {
                newarreliminados.push({
                    idnomoperaciones: arreliminados[i].data.idnomoperaciones,
                    estructurapropietaria: arreliminados[i].data.estructurapropietaria,
                    idoperacionesentidad: arreliminados[i].data.idoperacionesentidad,
                    denominacion: arreliminados[i].data.denominacion
                });
            }
        }

        for (var j = 0, longitud = modificados.length; j < longitud; j++) {
            if (!Ext.isEmpty(modificados[j].data.idnomoperaciones)) {
                //Se está modificando
                newmodificados.push(modificados[j].data);
            }
            else {
                //se está adicionando
                newmodificados.push({
                    idnomoperaciones: '',
                    denominacion: modificados[j].data.denominacion,
                    idestructuracomun: '',
                    idmodelo: modificados[j].data.idmodelo,
                    signo: modificados[j].data.signo,
                    iddoc: modificados[j].data.iddoc,
                    idsubsistema: this.idsubsistema
                });
            }
        }

        var contador = 2;
        var arrErrorsAddmod = new Array();
        var arrErrorsDel = new Array();
        var arrSuccessAddmod = new Array();
        var arrSuccessDel = new Array();

        var flag = 0;
        if (newmodificados.length > 0 && newarreliminados.length === 0) {
            flag = 1;
        }
        else if (newmodificados.length === 0 && newarreliminados.length > 0) {
            flag = 2;
        }

        if (newarreliminados.length > 0) {
            //Pregunta si se quiere eliminar las operaciones contables¿?
            var cantOper = (newarreliminados.length > 1) ? idioma.msgOperacionMany :
                idioma.msgOperacionOne;
            mostrarMensaje(2, idioma.msgQuestionDelOperacion.replace(/<#>/g, cantOper), function (btn) {
                if (btn === 'ok') {
                    //Mostrar la máscara
                    this.onloadMessageBox(idioma.msgEspere, idioma.msgSalvando);
                    if (newmodificados.length > 0) {
                        //Petición necesaria para poder adicionar las operaciones
                        //o modificarlas
                        Ext.Ajax.request({
                            method: "POST",
                            url: "adicionaroperacion",
                            params: {
                                operaciones: Ext.encode(newmodificados)
                            },
                            scope: this,
                            callback: function (options, success, response) {

                                var respuesta = Ext.decode(response.responseText);
                                arrErrorsAddmod = respuesta.errors;
                                arrSuccessAddmod = respuesta.success;
                                contador--;
                                if (contador === 0 || flag === 1) {
                                    Ext.MessageBox.hide();
                                    Array.prototype.push.apply(arrErrorsAddmod, arrErrorsDel);
                                    Array.prototype.push.apply(arrSuccessAddmod, arrSuccessDel);
                                    //llamar la funcionalidad
                                    this.mostrarMensajesAction(arrErrorsAddmod, arrSuccessAddmod, idioma);
                                }
                            }
                        });
                    }

                    //Petición necesaria para poder eliminar las operaciones
                    Ext.Ajax.request({
                        method: "POST",
                        url: "eliminaroperacion",
                        params: {
                            ids: Ext.encode(newarreliminados)
                        },
                        scope: this,
                        callback: function (options, success, response) {

                            var respuesta = Ext.decode(response.responseText);
                            arrErrorsDel = respuesta.errors;
                            arrSuccessDel = respuesta.success;
                            contador--;
                            if (contador === 0 || flag === 2) {
                                Ext.MessageBox.hide();
                                Array.prototype.push.apply(arrErrorsAddmod, arrErrorsDel);
                                Array.prototype.push.apply(arrSuccessAddmod, arrSuccessDel);
                                //llamar la funcionalidad
                                this.mostrarMensajesAction(arrErrorsAddmod, arrSuccessAddmod, idioma);
                            }
                        }
                    });
                }
                else {
                    if (newmodificados.length > 0) {
                        //Mostrar la máscara
                        this.onloadMessageBox(idioma.msgEspere, idioma.msgSalvando);
                        //Petición necesaria para poder adicionar las operaciones
                        //o modificarlas
                        Ext.Ajax.request({
                            method: "POST",
                            url: "adicionaroperacion",
                            params: {
                                operaciones: Ext.encode(newmodificados)
                            },
                            scope: this,
                            callback: function (options, success, response) {

                                var respuesta = Ext.decode(response.responseText);
                                arrErrorsAddmod = respuesta.errors;
                                arrSuccessAddmod = respuesta.success;
                                Ext.MessageBox.hide();
                                Array.prototype.push.apply(arrErrorsAddmod, arrErrorsDel);
                                Array.prototype.push.apply(arrSuccessAddmod, arrSuccessDel);
                                //llamar la funcionalidad
                                this.mostrarMensajesAction(arrErrorsAddmod, arrSuccessAddmod, idioma);

                            }
                        });
                    }
                    else {
                        this.descartarCambios(idioma);
                    }
                }
            }.bind(this));
        }
        //El arreglo de eliminados == 0
        else {
            if (newmodificados.length > 0) {
                //Mostrar la máscara
                this.onloadMessageBox(idioma.msgEspere, idioma.msgSalvando);
                //Petición necesaria para poder adicionar las operaciones
                //o modificarlas
                Ext.Ajax.request({
                    method: "POST",
                    url: "adicionaroperacion",
                    params: {
                        operaciones: Ext.encode(newmodificados)
                    },
                    scope: this,
                    callback: function (options, success, response) {

                        var respuesta = Ext.decode(response.responseText);
                        arrErrorsAddmod = respuesta.errors;
                        arrSuccessAddmod = respuesta.success;
                        contador--;
                        if (contador === 0 || flag === 1) {
                            Ext.MessageBox.hide();
                            Array.prototype.push.apply(arrErrorsAddmod, arrErrorsDel);
                            Array.prototype.push.apply(arrSuccessAddmod, arrSuccessDel);
                            //llamar la funcionalidad
                            this.mostrarMensajesAction(arrErrorsAddmod, arrSuccessAddmod, idioma);
                        }
                    }
                });
            }
        }
    },
    //Función necesaria para cancelar los cambios realizados
    descartarCambios: function (idioma) {
        this.arreliminados = new Array();
        this.getStore().commitChanges();
        this.getStore().removeAll();
        this.getStore().reload();
    },
    //Función necesaria para mostrar los mensajes de las operaciones contables
    showMensajesBox: function (tipo, mensaje, funcion, idElAnim) {
        var title = '', icono = Ext.MessageBox.INFO, buttons = Ext.MessageBox.OK;
        //Información
        if (tipo === 1) {
            title = 'Informaci&oacute;n';
            icono = Ext.MessageBox.INFO;
            buttons = Ext.MessageBox.OK;
        }
        //Warning
        else if (tipo === 2) {
            title = 'Advertencia';
            icono = Ext.MessageBox.WARNING;
            buttons = Ext.MessageBox.OK;
        }
        //Error
        else if (tipo === 3) {
            title = 'Error';
            icono = Ext.MessageBox.ERROR;
            buttons = Ext.MessageBox.OK;
        }
        //Default
        else {
            title = 'Informaci&oacute;n';
            icono = Ext.MessageBox.INFO;
            buttons = Ext.MessageBox.OK;
        }

        //Mostrar el cuadro de diálogo
        Ext.MessageBox.show({
            title: title,
            msg: mensaje,
            buttons: buttons,
            fn: (typeof funcion === 'function') ? funcion : function () {
            },
            animEl: (idElAnim) ? idElAnim : '',
            icon: icono
        });
    },
    //Función necesaria para mostrar el mensaje de acción realizada satisfactoriamente
    //o para mostrar los errores
    mostrarMensajesAction: function (arrErrors, arrSuccess, idioma) {
        var store = this.getStore();
        //var myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.msgCargando});
        //No hubo errores
        if (arrErrors.length === 0) {
            var msgSuccess = (arrSuccess.length > 1) ?
                idioma.msgSaveSucessMany :
                idioma.msgSaveSucessOne;
            mostrarMensaje(1, msgSuccess);

            //myMask.show();
            store.reload({
                callback: function () {
                    //myMask.hide();
                }
            });
        }
        else {
            //Contador para saber si recargo el grid
            var contadorReload = 0;
            //'<img ext:qtip="<b>' + params.idioma.lbtooltipNoAsociado + '</b>" src = /configuracion/nomgenerales/views/images/noentidad.png>'
            var imgTipoErrorYes = '<img src = /configuracion/comun/images/yes.png> ';
            var imgTipoErrorNo = '<img src = /configuracion/comun/images/no.png> ';

            var textoMensajeError = (arrErrors.length === 1) ? ''
                : idioma.msgErrorMany += '<br/>';

            for (var i = 0, long = arrErrors.length; i < long; i++) {
                if (arrErrors[i].reload === 1) {
                    contadorReload++;
                }

                if (arrErrors[i].code === 1) {
                    //Faltan datos para adicionar la operación contable
                    textoMensajeError += idioma.msgErrorCode1;
                }
                else if (arrErrors[i].code === 2) {
                    //Ya existe la operación contable que se está adicionando
                    textoMensajeError += idioma.msgErrorCode2.replace(/<#>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 3) {
                    //Ocurrió un error al insertar la operación contable X
                    textoMensajeError += idioma.msgErrorCode3.replace(/<#>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 4) {
                    //No hay datos para eliminar la o las operaciones contables
                    textoMensajeError += idioma.msgErrorCode4;
                }
                else if (arrErrors[i].code === 5) {
                    //No se pudo desasociar la operación contable para esta entidad
                    //No se pudo eliminar la operación contable X.
                    textoMensajeError += idioma.msgErrorCode5.replace(/<#>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 6) {
                    //La operación contable no ha podido ser eliminada,
                    //pues está en uso por otra entidad, pero ha sido desasociada de la entidad logueada.
                    textoMensajeError += idioma.msgErrorCode6.replace(/<#>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 7) {
                    //La operación contable no ha podido ser eliminada,
                    //pues está en uso por otra entidad. Está desasociada de la entidad logueada.
                    textoMensajeError += idioma.msgErrorCode7.replace(/<#>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 8) {
                    //Ha ocurrido un error al eliminar la referencia de la operación contable
                    //No se pudo desasociar la operación contable para la entidad logueada
                    //La operaci&oacute;n contable no ha podido ser eliminada.
                    textoMensajeError += idioma.msgErrorCode89.replace(/<#>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 9) {
                    //Ha ocurrido un error al eliminar la operación contable
                    textoMensajeError += idioma.msgErrorCode89.replace(/<#>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 10) {
                    //Ha ocurrido un error al eliminar la referencia en DatOperacionesentidad
                    //No se pudo eliminar la operación contable, pues no ha sido creada por la entidad logueada.
                    //Ha ocurrido un error al desasociar la operación contable para la entidad.
                    textoMensajeError += idioma.msgErrorCode10.replace(/<#>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 11) {
                    //Se eliminó la referencia satisfactoriamente
                    //No se pudo eliminar la operación contable, pues no ha sido creada por la entidad logueada.
                    //Se desasoció la operación contable para la entidad satisfactoriamente.
                    textoMensajeError += idioma.msgErrorCode11.replace(/<#>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 12) {
                    //No se pudo eliminar la operación contable, pues no ha sido creada por la entidad logueada.
                    //Está desasociada de la entidad logueada.
                    textoMensajeError += idioma.msgErrorCode12.replace(/<#>/g, arrErrors[i].denominacion);
                }

            }
            mostrarMensaje(1, textoMensajeError);

            if (arrSuccess.length > 0 || contadorReload > 0) {
                //myMask.show();
                store.reload({
                    callback: function () {
                        //myMask.hide();
                    }
                });
            }
        }
    },
    search: function () {
        var filtro = this.sf.getValue();
        this.store.filter('denominacion', filtro, true);
        this.store.fireEvent('filter', this.store, filtro);
    },
    clear: function () {
        this.store.clearFilter();
    },
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    }
});