/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Conf.ModContb.GridEditor
 * @extends Ext.grid.EditorGridPanel
 */
Ext.namespace('Ext.Conf.ModContb.GridEditor');
Ext.Conf.ModContb.GridEditor = Ext.extend(Ext.grid.EditorGridPanel, {
    idComponente: -1,
    perfil: {},
    idioma: {},
    arreliminados: new Array(),
    //Functions
    constructor: function (params) {

        this.addEvents('gridvalid', 'insertrow');
        this.arreliminados = new Array();
        var rowaction = new Ext.grid.RowActions({
            id: 'ra' + params.idComponente,
            actions: [
                {
                    id: 'eliminar',
                    tooltip: params.idioma.lbtooltipDel||'Eliminar',
                    iconCls:'icondistra-eliminar',
                    marginLeft: 5,
                    width: 16,
                    height: 16
                }
            ]
        });
        rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    this.eliminar(grid, record);
                    break;
            }
        }, this);

        var roweditor = this.roweditor = new Ext.contabilidad.util.RowEditor({
            id: 'roweditor' + params.idComponente,
            saveText: params.saveText || 'Guardar',
            saveTooltip: params.saveTooltip || 'Guardar',
            iconSave: params.iconSave || 'guardar',
            iconCancel: params.iconCancel || 'cancelar',
            cancelText: params.cancelText || 'Cancelar',
            cancelTooltip: params.cancelTooltip,
            validateChange:params.validateChange
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            id: 'geditor' + params.idComponente,
            selModel: new Ext.grid.RowSelectionModel({id: 'sm' + params.idComponente}),
            autoScroll: true,
            clicksToEdit: 2,
            viewConfig: {
                forceFit: true
            },
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    scope: this,
                    fn: function () {
                        var seleccionados = this.getSelectionModel().getSelections();
                        Ext.each(seleccionados, function (record) {
                            this.eliminar(this, record);
                        }, this);
                    }
                }
            ]
        });

        //Botones que van en el tbar del grid editor
        var btnadd = this.btnadd = new Ext.Button({
            id: 'btnadd' + params.idComponente,
            text: params.textbtnadd,
            iconCls: 'adicionar',
            tooltip: params.tooltipbtnadd
        });

        var btndel = this.btndel = new Ext.Button({
            id: 'btndel' + params.idComponente,
            text: params.textbtndel,
            iconCls: 'eliminar',
            hidden: true,
            tooltip: params.tooltipbtndel
        });

        var btndpl = this.btndpl =new Ext.Button({
            id: 'btnduplicar' + params.idComponente,
            text: 'Duplicar',
            iconCls: 'duplicar',
            tooltip: 'Duplicar asiento',
            disabled: true,
            hidden: !this.btnDuplicar
        })

        //Construccion del grideditor de acuerdo al componente en Modelos de contabilización
        /*
         * 1-----> Gestionar modelo
         *      ------> 1.1 Adicionar modelo ----> Adicionar asiento
         *      ------> 1.2 Adicionar modelo ----> Adicionar sustitución
         * 2-----> Configuración ------> Gestionar clasificadores
         *      ------> 2.1 Adicionar clasificador ---> Campos contables
         * 3-----> Configuración ------> Gestionar campos contables
         * 4-----> Configuración ------> Gestionar valores contables
         * -1----> Esto significa que no ha especificado el componente
         */

        if (params.idComponente === 2.1) {

            var tfnombrealt = this.tfnombrealt = new Ext.form.TextField({
                allowBlank: false,
                maskRe: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
                regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
                maxLength: 255,
                regexText:params.idioma.regexTextLetrasNumeros
            });

            var cbcampos = this.cbcampos = new Ext.form.ComboBox({
                store: new Ext.data.Store({
                    id: 'stcampos' + params.idComponente,
                    url: '/configuracion/modeloscontabilizacion/gestclasificadores/index.php/gestclasificadores/loadTableColumns',
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'jr' + params.idComponente
                    }, [
                        {name: 'campo'},
                        {name: 'clase'},
                        {name: 'idrecordcombo'}
                    ])
                }),
                editable: false,
                resizable: true,
                lazyRender: true,
                readOnly: true,
                tpl: '<tpl for="."><div ext:qtip="{clase}.{campo}" class="x-combo-list-item">{campo}</div></tpl>',
                displayField: 'campo',
                valueField: 'idrecordcombo',
                typeAhead: true,
                forceSelection: true,
                mode: 'local',
                triggerAction: 'all',
                allowBlank: false,
                savedisplayField: true
            });

            Ext.apply(this, {
                store: new Ext.data.Store({
                    id: 'steditor' + params.idComponente,
                    //url: 'cargarmodelos',
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'jr' + params.idComponente
                    }, [
                        {name: 'idcampo'},
                        {name: 'nombrealternativo', mapping: 'nombre'},
                        {name: 'idclasificador'},
                        {name: 'tipo'},
                        {name: 'clase'},
                        {name: 'campo'},
                        {name: 'referencia'},
                        {name: 'idsubsistema'},
                        {name: 'idestructuracomun'},
                        {name: 'valid', type: 'boolean'}
                    ])
                }),
                columns: [
                    {
                        id: 'nombrealt',
                        header: params.idioma.headerAddClfCampos1,
                        dataIndex: 'nombrealternativo',
                        width: 300,
                        editor: tfnombrealt
                    },
                    {
                        id: 'campo',
                        header: params.idioma.headerAddClfCampos2,
                        dataIndex: 'campo',
                        width: 200,
                        editor: cbcampos
                    },
                    rowaction
                ],
                autoExpandColumn: 'campo',
                disabled: true,
                plugins: [rowaction, roweditor],
                tbar: [btnadd, btndpl, btndel]
            });
        }
        if (params.cm && params.store) {
            params.cm.columns.push(rowaction);
            params.plugins = [rowaction, roweditor];
            params.tbar = [btnadd, btndpl, btndel];
            Ext.apply(this, params);
        }

        Ext.Conf.ModContb.GridEditor.superclass.constructor.call(this);
        this.inicioEventos();
    },
    //Esta funcion es necesaria para verificar si el grid editor es valido o no
    gridValid: function () {
        return this.getStore().find('valid', 'false') === -1;
    },
    inicioEventos: function () {
        //Este es el primer boton que aparece en el tbar del grid
        this.btnadd.on('click', function (button, e) {
            this.insertar();
        }, this);

        this.btndpl.on('click', function (button, e) {
            this.duplicar();
        }, this);


        this.btndel.on('click', function (button, e) {
            var seleccionados = this.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                for (var i = 0; i < seleccionados.length; i++) {
                    this.arreliminados.push(seleccionados[i]);
                    seleccionados[i].commit();
                    this.getStore().remove(seleccionados[i]);
                }
                if (this.getSelectionModel().getCount() === 0) {
                    button.hide();
                }
            }
        }, this);

        this.roweditor.on({
            scope: this,
            afteredit: function (editor, grid, changes, record, rowIndex) {
                record.data.valid = true;
                var gridvalid = this.gridValid();
                this.fireEvent("gridvalid", gridvalid, this, record);
            }
        });

        //Evento para mostrar el boton para eliminar varios elementos
        this.getSelectionModel().on('rowselect', function (selmodel, rowIndex, record) {
            if (selmodel.getCount() > 1) {
                this.btndel.show();
            }
        }, this);


        //Evento para ocultar el boton para eliminar varios elementos
        this.getSelectionModel().on('rowdeselect', function (selmodel, rowIndex, record) {
            if (selmodel.getCount() <= 1) {
                this.btndel.hide();
            }
        }, this);

        this.on({
            scope: this,
            gridvalid: function (state, grideditor) {
                this.btnadd.setDisabled(!state);
                this.btndpl.setDisabled(!state);
            },
            disable:function(){
                this.btnadd.disable();
                this.btndpl.disable();
            },
            enable:function(){
                this.btnadd.enable();
                this.btndpl.enable();
            },

        });

        this.getStore().on({
            scope: this,
            remove: function (store, record, index) {
                if (this.btndel.isVisible()) {
                    this.btndel.hide();
                }
                if (!this.gridValid()) {
                    this.btnadd.setDisabled(true);
                }
                else {
                    this.btnadd.setDisabled(false);
                }
            },
            clear: function () {
                this.btnadd.setDisabled(false);
            }
        });

        this.getSelectionModel().on({
            scope: this,
            selectionchange: function(sm, records){
                this.btndpl.setDisabled(sm.getCount().length!=1);
            },
        })
    },
    eliminar: function (grid, record) {
        grid.arreliminados.push(record);
        record.commit();
        grid.getStore().remove(record);
    },
    insertar: function () {
        if(!this.btnadd.disabled){
            this.btnadd.setDisabled(true);
            var arrdinamico = new Array();
            var objdinamico = {};
            for (var i = 0; i < this.getStore().fields.keys.length; i++) {

                arrdinamico.push({name: this.getStore().fields.keys[i]});
                if (this.getStore().fields.keys[i] !== 'sustitucion') {
                    objdinamico[this.getStore().fields.keys[i]] = '';
                } else {
                    objdinamico[this.getStore().fields.keys[i]] = new Array();
                }

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
        }

    },
    duplicar: function(){
        var selected=this.getSelectionModel().getSelections()[0],
            cloneRecord = selected.copy();
        cloneRecord.set(this.idProperty, '');
        // console.log(this.getStore())
        var recordDinamico = Ext.data.Record.create(this.getStore().fields.keys);
        var record = new recordDinamico(cloneRecord.data);
        this.getStore().add(record);
    }
});