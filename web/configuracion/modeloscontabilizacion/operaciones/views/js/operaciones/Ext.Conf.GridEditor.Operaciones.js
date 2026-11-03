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
    constructor: function(params) {

        this.addEvents('gridvalid', 'insertrow');
        this.arreliminados = new Array();
        this.mapaTeclas = null;

        var rowaction = new Ext.grid.RowActions({
            id: 'ra' + params.idsubsistema,
            actions: [
                {
                    id: 'eliminar',
                    tooltip: params.idioma.tooltipEliminar,
                    icon: params.perfil.dirImg + 'eliminar.png',
                    marginLeft: 5,
                    width: 16,
                    height: 16
                }
            ]
        });
        rowaction.on('action', function(grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    this.deleteRows(params.idioma);
                    break;
            }
        }, this);

        var roweditor = params.roweditor = new Ext.contabilidad.util.RowEditor({
            id: 'roweditor' + params.idsubsistema,
            saveText: params.idioma.textbtnaceptarRoweditor,
            iconSave: params.perfil.dirImg + 'aceptar.png',
            iconCancel: params.perfil.dirImg + 'cancelar.png',
            iconCls: 'btn',
            cancelText: params.idioma.textbtncancelarRoweditor
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            id: 'geditor' + params.idsubsistema,
            selModel: new Ext.grid.RowSelectionModel({id: 'sm' + params.idsubsistema}),
            autoScroll: true,
            clicksToEdit: 2
        });

        //Botones que van en el tbar del grid editor
        var btnadd = this.btnadd = new Ext.Button({
            id: 'btnadd' + params.idsubsistema,
            text: params.idioma.lbbtnaddbtnaddoperacion,
            icon: params.perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: params.idioma.tooltipbtnaddoperacion
        });

        var btndel = this.btndel = new Ext.Button({
            id: 'btndel' + params.idsubsistema,
            text: params.idioma.lbtndeloperacion,
            icon: params.perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            hidden: true,
            tooltip: params.idioma.tooltipbtndeloperacion
        });

        var btnayuda = this.btnayuda = new Ext.Button({
            id: 'btnayuda' + params.idsubsistema,
            text: params.idioma.lbbtnayuda,
            tooltip: params.idioma.tooltipayuda,
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn'
        });

        var btnsave = this.btnsave = new Ext.Button({
            id: 'btnsave' + params.idsubsistema,
            text: params.idioma.lbbtnsave,
            tooltip: params.idioma.tooltipbtnsave,
            disabled: true,
            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'btn'
        });

        var btndescartar = this.btndescartar = new Ext.Button({
            id: 'btndescartar' + params.idsubsistema,
            text: params.idioma.lbbtndescartar,
            tooltip: params.idioma.tooltipbtndescartar,
            disabled: true,
            icon: '/configuracion/comun/images/cancelarseleccion.png',
            iconCls: 'btn'
        });

        //Denominación de la operación contable
        var tfdenominacion = this.tfdenominacion = new Ext.form.TextField({
            allowBlank: false
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
            editable: false,
            resizable: true,
            lazyRender: true,
            readOnly: true,
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

        var cbdocumentos = this.cbdocumentos = new Ext.form.ComboBox({
            store: new Ext.data.Store({
                id: 'stdocumentos' + params.idsubsistema,
                //url: '',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'data',
                    id: 'jrdocumento' + params.idsubsistema
                }, [
                    {name: 'iddocumentos'},
                    {name: 'denominacion'}
                ])
            }),
            editable: false,
            resizable: true,
            lazyRender: true,
            readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            displayField: 'denominacion',
            valueField: 'iddocumentos',
            typeAhead: true,
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false/*,
             savedisplayField: true*/
        });


        Ext.apply(this, {
            store: new Ext.data.Store({
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
                    {name: 'iddocumento'},
                    {name: 'idsubsistema'},
                    {name: 'valid', type: 'boolean'}
                ])
            }),
            columns: [
                {
                    id: 'denominacion',
                    header: params.idioma.headerDenominacion,
                    dataIndex: 'denominacion',
                    width: 100,
                    editor: tfdenominacion
                },
                {
                    id: 'documento',
                    header: params.idioma.headerDoc,
                    dataIndex: 'iddocumento',
                    width: 300,
                    editor: cbdocumentos,
                    renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var store = cbdocumentos.store;
                            var index = store.find('iddocumentos', value);
                            var newValue = store.getAt(index).data.denominacion;
                            return newValue;
                        }
                    }
                },
                {
                    id: 'modelo',
                    header: params.idioma.headerModelo,
                    dataIndex: 'idmodelo',
                    width: 300,
                    editor: cbmodelos,
                    renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var store = cbmodelos.store;
                            var index = store.find('idmodelo', value);
                            var newValue = store.getAt(index).data.nombre;
                            return newValue;
                        }
                    }
                },
                rowaction
            ],
            autoExpandColumn: 'denominacion',
            plugins: [rowaction, roweditor],
            tbar: [btnadd, btndel, '->', btnayuda],
            bbar: ['->', btndescartar, btnsave]
        });

        Ext.Conf.GridEditor.Operaciones.superclass.constructor.call(this);

        this.inicioEventos(this.perfil, this.idioma);
    },
    //Esta función es necesaria para verificar si el grid editor es válido o no
    gridValid: function() {
        return this.getStore().find('valid', 'false') === -1;
    },
    inicioEventos: function(perfil, idioma) {
        //Este es el primer boton que aparece en el tbar del grid
        this.btnadd.on({
            scope: this,
            click: function(button, e) {
                this.insertarRow();
            },
            disable: function(button) {
                this.mapaTeclas.disable();
            },
            enable: function(button) {
                if (!Ext.isEmpty(this.mapaTeclas)) {
                    this.mapaTeclas.enable();
                }
            }
        });

        this.btndel.on('click', function(button, e) {
            this.deleteRows(idioma);
        }, this);

        this.btnsave.on('click', function(button, e) {
            this.saveData(idioma);
        }, this);

        this.btndescartar.on('click', function(button, e) {
            this.descartarCambios(idioma);
        }, this);

        this.roweditor.on({
            scope: this,
            afteredit: function(editor, grid, changes, record, rowIndex) {
                record.data.valid = true;
                var gridvalid = this.gridValid();
                this.fireEvent("gridvalid", gridvalid, this, record);
            },
            beforeedit: function(roweditor, rowIndex) {
                this.mapaTeclas.disable();
            },
            canceledit: function(roweditor, record, rowIndex) {
                this.mapaTeclas.enable();
            },
            validateedit: function(roweditor, grid, changes, record, rowIndex) {
                this.mapaTeclas.enable();
            }
        });

        //Evento para mostrar el boton para eliminar varios elementos
        this.getSelectionModel().on('rowselect', function(selmodel, rowIndex, record) {
            if (selmodel.getCount() > 1) {
                this.btndel.show();
            }
        }, this);


        //Evento para ocultar el boton para eliminar varios elementos
        this.getSelectionModel().on('rowdeselect', function(selmodel, rowIndex, record) {
            if (selmodel.getCount() <= 1) {
                this.btndel.hide();
            }
        }, this);

        this.on({
            scope: this,
            gridvalid: function(state, grideditor) {
                this.btnadd.setDisabled(!state);
                this.btnsave.setDisabled(!state);
                this.btndescartar.setDisabled(!state);
            }
        });

        this.getStore().on({
            scope: this,
            remove: function(store, record, index) {
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
            clear: function() {
                this.btnadd.setDisabled(false);
                this.btnsave.setDisabled(true);
                this.btndescartar.setDisabled(true);
            },
            beforeload: function(store, options) {
                this.arreliminados = new Array();
                this.getStore().commitChanges();
            },
            load: function(store, datarecord, options) {
                this.btnsave.setDisabled(true);
                this.btndescartar.setDisabled(true);
            }
        });
    },
    //Función necesaria para insertar una fila dinámicamente,
    //para luego se salven las operaciones contables.
    insertarRow: function() {
        this.btnadd.setDisabled(true);
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
        this.roweditor.stopEditing();
        this.getStore().insert(total, recdinamico);
        this.getView().refresh();
        this.getSelectionModel().selectRow(total);
        this.roweditor.startEditing(total);
//            this.startEditing(total, 0);
        //Evento que se dispara cuando se inserta una fila
        this.fireEvent('insertrow', this, recdinamico);
    },
    //Función necesaria para eliminar las filas seleccionadas
    //para luego se salven las operaciones contables.
    deleteRows: function(idioma) {
        var seleccionados = this.getSelectionModel().getSelections();
        var cantseleccionados = seleccionados.length;
        if (cantseleccionados > 0) {
            for (var i = 0; i < cantseleccionados; i++) {
                this.arreliminados.push(seleccionados[i]);
                seleccionados[i].commit();
                this.getStore().remove(seleccionados[i]);
            }
            if (this.getSelectionModel().getCount() === 0) {
                this.btndel.hide();
            }
        }
        else {
            mostrarMensaje(1, idioma.msgEliminarOper);
        }
    },
    //Función necesaria para salvar los datos de las operaciones contables
    saveData: function(idioma) {
        //Mostrar la máscara
        Ext.MessageBox.wait(idioma.msgSalvando, idioma.msgEspere);

        var arreliminados = this.arreliminados;
        var newarreliminados = new Array();
        var modificados = this.getStore().getModifiedRecords();
        var newmodificados = new Array();

        for (var i = 0, long = arreliminados.length; i < long; i++) {
            if (!Ext.isEmpty(arreliminados[i].data.idnomoperaciones)) {
                newarreliminados.push(arreliminados[i].data.idnomoperaciones);
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
                    iddocumento: modificados[j].data.iddocumento,
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
                callback: function(options, success, response) {

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

        if (newarreliminados.length > 0) {
            //Petición necesaria para poder eliminar las operaciones
            Ext.Ajax.request({
                method: "POST",
                url: "eliminaroperacion",
                params: {
                    ids: Ext.encode(newarreliminados)
                },
                scope: this,
                callback: function(options, success, response) {

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
    },
    //Función necesaria para cancelar los cambios realizados
    descartarCambios: function(idioma) {
        this.arreliminados = new Array();
        this.getStore().commitChanges();
        this.getStore().removeAll();

        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.msgCargando});
        myMask.show();
        this.getStore().reload({
            scope: this,
            callback: function(){
                myMask.hide();
            }
        });
    },
    //Función necesaria para mostrar el mensaje de acción realizada satisfactoriamente
    //o para mostrar los errores
    mostrarMensajesAction: function(arrErrors, arrSuccess, idioma) {
        var store = this.getStore();
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.msgCargando});
        //No hubo errores
        if (arrErrors.length === 0) {
            var msgSuccess = (arrSuccess.length > 1) ?
                    idioma.msgSaveSucessMany :
                    idioma.msgSaveSucessOne;
            mostrarMensaje(1, msgSuccess);

            myMask.show();
            store.reload({
                callback: function() {
                    myMask.hide();
                }
            });
        }
        else {
            var textoMensajeError ='';
            // var textoMensajeError = (arrErrors.length === 1) ? idioma.msgErrorOne
            //         : idioma.msgErrorMany;
            // textoMensajeError += '<br/><br/><br/>';
            console.log('Erroerrrr2')
            for (var i = 0, long = arrErrors.length; i < long; i++) {
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
                    //Hubo un error al eliminar la operación contable
                    var index = store.find('idnomoperaciones', arrErrors[i].id);
                    var denominacion = store.getAt(index).data.denominacion;
                    textoMensajeError += idioma.msgErrorCode5.replace(/<#>/g, denominacion);
                }
                else if (arrErrors[i].code === 6) {
                    //Esto significa que lanzó la exception de violación de llave
                    //foránea, por tanto no se puede eliminar la operación contable
                    //porque está en uso (code = 6)
                    var index = store.find('idnomoperaciones', arrErrors[i].id);
                    var denominacion = store.getAt(index).data.denominacion;
                    textoMensajeError += idioma.msgErrorCode6.replace(/<#>/g, denominacion);
                }

                /*
                 * Acción necesaria para mostrar el mensaje de error.
                 * Además recarga el store del grid en caso de que los 
                 * errores sean menos que las acciones satisfactorias.
                 */
                mostrarMensaje(3, textoMensajeError, function() {
                    if (arrSuccess.length > 0) {
                        myMask.show();
                        store.reload({
                            callback: function() {
                                myMask.hide();
                            }
                        });
                    }
                });
            }
        }
    }
});