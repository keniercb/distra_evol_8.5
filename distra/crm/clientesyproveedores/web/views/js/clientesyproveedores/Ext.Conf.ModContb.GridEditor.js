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
    perfil: {},
    idioma: {},
    arreliminados: new Array(),
    //Functions
    constructor: function (params) {
        var me = this;
        this.perfil = window.parent.UCID.portal.perfil;
        console.log('params:', params)
        this.idioma = params.idioma || {}
        this.addEvents('gridvalid', 'insertrow');
        this.arreliminados = new Array();
        this.rowaction = new Ext.grid.RowActions({
            actions: [
                {
                    id: 'eliminar',
                    tooltip: params.tooltipbtndel || 'Eliminar',
                    iconCls: 'icondistra-eliminar',
                    marginLeft: 5,
                    width: 16,
                    height: 16
                }
            ]
        });
        this.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    this.eliminar(grid, record);
                    break;
            }
        }, this);

        this.roweditor = new Ext.contabilidad.util.RowEditor({
            saveText: params.saveText || 'Guardar',
            iconSave: params.iconSave || 'guardar',
            iconCancel: 'cancelar',
            iconCls: 'btn',
            cancelText: params.cancelText || 'Cancelar',
            cancelTooltip: params.cancelTooltip,
            saveTooltip: params.saveTooltip
        });

        Ext.apply(this, {
            selModel: new Ext.grid.RowSelectionModel(),
            autoScroll: true,
            clicksToEdit: 2,
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
        this.btnadd = new Ext.Button({
            text: params.textbtnadd || 'Adicionar',
            iconCls: 'adicionar',
            tooltip: params.tooltipbtnadd || 'Adicionar'
        });

        this.btnduplicar = new Ext.Button({
            text: params.textbtnduplicar || 'Duplicar',
            iconCls: 'adicionar',
            disabled: true,
            tooltip: params.tooltipbtnduplicar || 'Duplicar',
            hidden: params.showduplicar!==true
        });

        this.btndel = new Ext.Button({
            text: params.textbtndel || 'Eliminar',
            iconCls: 'eliminar',
            hidden: true,
            tooltip: params.tooltipbtndel || 'Eliminar'
        });

        if (params.cm && params.store) {
            params.cm.columns.push(this.rowaction);
            if(params.plugins){
                params.plugins=(Ext.isArray(params.plugins))?params.plugins:[params.plugins];
            }else{
                params.plugins=new Array();
            }
            params.plugins.push(this.rowaction);
            params.plugins.push(this.roweditor);

            params.tbar = [this.btnadd, this.btnduplicar, this.btndel];
            Ext.apply(this, params);
            Ext.Conf.ModContb.GridEditor.superclass.constructor.call(this);
            this.inicioEventos();
        }
    },
    //Esta funcion es necesaria para verificar si el grid editor es valido o no
    gridValid: function () {
        return this.getStore().find('valid', 'false') === -1;
    },
    inicioEventos: function () {
        //Este es el primer boton que aparece en el tbar del grid
        var self = this;
        this.btnadd.on('click', function (button, e) {
            this.insertar();
        }, this);

        this.btnduplicar.on('click', function (button, e) {
            this.duplicar(this.getSelectionModel().getSelections());
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

        this.getSelectionModel().on('selectionchange', function (selmodel) {
            this.btnduplicar.setDisabled(selmodel.getCount()!==1);
        }, this)

        this.on({
            scope: this,
            'gridvalid': function (state, grideditor) {
                this.btnadd.setDisabled(!state);
            }
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
    },
    eliminar: function (grid, record) {
        grid.arreliminados.push(record);
        record.commit();
        grid.getStore().remove(record);
    },
    insertar: function () {
        if (!this.btnadd.disabled) {
            this.btnadd.setDisabled(true);
            var arrdinamico = new Array();
            var objdinamico = {};
            for (var i = 0; i < this.getStore().fields.keys.length; i++) {
                arrdinamico.push({name: this.getStore().fields.keys[i]});
                objdinamico[this.getStore().fields.keys[i]] = '';
            }
            objdinamico.valid = false;

            var Recdinamico = Ext.data.Record.create(arrdinamico);
            var total = this.getStore().getCount();
            var recdinamico = new Recdinamico(objdinamico);
            this.roweditor.stopEditing();
            this.getStore().insert(total, recdinamico);
            this.getSelectionModel().selectRow(total);
            this.roweditor.startEditing(total);
            //Evento que se dispara cuando se inserta una fila
            this.fireEvent('insertrow', this, recdinamico);
        }
    },
    duplicar: function (record) {
        if(record.length === 1) {
            var arrdinamico = new Array();
            var objdinamico = {};
            const keys = this.getStore().fields.keys;
            for (var i = 0; i < keys.length; i++) {
                arrdinamico.push({name: keys[i]});
                if(keys[i] !== 'id')
                    objdinamico[keys[i]] = record[0].get(keys[i]);
            }
            objdinamico.valid = false;
            objdinamico.idterminodepago = null;
            objdinamico.nombreterminodepago = null;

            var Recdinamico = Ext.data.Record.create(arrdinamico);
            var total = this.getStore().getCount();
            var recdinamico = new Recdinamico(objdinamico);
            // this.roweditor.stopEditing();
            this.getStore().insert(total, recdinamico);
            this.getSelectionModel().selectRow(total);
            this.roweditor.startEditing(total);
            //Evento que se dispara cuando se inserta una fila
            this.fireEvent('insertrow', this, recdinamico);
        }
    }
});