/**
 * Este componente renderiza un treegrid en un combo y simula un combo
 *
 * @author Ing. Alejandro Mengana Pérez <amengana@xetid.cu>
 */
Ext.define('CostoComun.components.ComboTree', {
    extend: 'Ext.form.field.Picker',

    alias: 'widget.combotree',

    requires: [
        'CostoComun.components.SearchField'
    ],

    displayField: 'text',
    displayTextTree: 'text',
    valueField: 'id',
    leafField: 'leaf',
    multiSelect: true,
    rootData: 'datos',
    selectParent: false,
    showSearch: true,
    params: null,
    autoLoadComboTree: true,
    noResetBeforeLoad: null,

    initComponent: function () {

        this.addEvents('selectcombotree', 'collapsecombotree');
        if(this.autoLoadComboTree == true){
           this.storeComboTree = new Ext.data.TreeStore({

                fields: [
                    {
                        name: 'id',
                        mapping: this.valueField
                    },
                    {
                        name: 'text',
                        mapping: this.displayTextTree
                    },
                    {
                        name: 'leaf',
                        mapping: this.leafField
                    },
                    {
                        name: 'code',
                        mapping: this.displayField
                    },
                    {
                        name: 'qtip',
                        mapping: this.displayTextTree
                    }
                ],
                proxy: {
                    type: 'ajax',
                    url: this.url,
                    reader: {
                        type: 'json',
                        root: this.rootData
                    }
                }
            });
        }else{
            this.storeComboTree = new Ext.data.TreeStore({
                //autoLoad: false, siempre se carga automáticamente
                fields: [
                    {
                        name: 'id',
                        mapping: this.valueField
                    },
                    {
                        name: 'text',
                        mapping: this.displayTextTree
                    },
                    {
                        name: 'leaf',
                        mapping: this.leafField
                    },
                    {
                        name: 'code',
                        mapping: this.displayField
                    },
                    {
                        name: 'qtip',
                        mapping: this.displayTextTree
                    }
                ],
                proxy: {
                    type: 'ajax',
                    url: this.url,
                    reader: {
                        type: 'json',
                        root: this.rootData
                    }
                },
                root: {
                    loaded: true
                }
            });
        }
        this.treegrid = Ext.create('Ext.tree.Panel', {
            xtype: 'tree-grid',
            useArrows: true,
            rootVisible: false,
            multiSelect: this.multiSelect,
            enableColumnResize: false,
            hideHeaders: true,
            store: this.storeComboTree,
            columns: [
                {
                    xtype: 'treecolumn',
                    menuDisabled: true,
                    hideable: false,
                    text: '',
                    flex: 1,
                    sortable: false,
                    dataIndex: 'text'
                }
            ]
        });

        this.btnUpdate = Ext.create('Ext.button.Button', {
            text: "<span class='icondistra-actualizar'></span>Actualizar",
            tooltip: 'Actualizar los datos',
            itemId: 'btnactualizarcombotree'
        });

        var b = [this.btnUpdate, '-'];
        if (Ext.isArray(this.bbar) && this.bbar.length > 0) {
            b = b.concat(this.bbar);
        }

        this.tsearchfield = Ext.create('CostoComun.components.SearchField', {
            width: 200
        });

        var panel = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            floating: true,
            height: 230,
            items: [this.treegrid],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                enableOverflow: true,
                items: b
            }, {
                xtype: 'toolbar',
                dock: 'top',
                enableOverflow: true,
                hidden: !this.showSearch,
                items: [this.tsearchfield]
            }]
        });

        Ext.apply(this, {
            labelAlign: 'top',
            enableKeyEvents: true,
            anchor: (this.anchor) ? this.anchor : '100%',
            labelStyle: 'margin: 0 0 5 0',
            editable: false,
            panel: panel,
            values: [],
            arrIdItemDeselected: [],
            firstLoad: true,
            task: null
        });

        this.callParent();

        /*this.setValueComboTree([
            {id: 990694, value: '819'},
            {id: 1026449, value: '701.0020'},
            {id: 1026184, value: '701.0006.823.823.06'}
        ]);*/

        this.inicializarEventos();
    },
    createPicker: function () {
        return this.panel;
    },
    inicializarEventos: function () {
        this.treegrid.on({
            scope: this,
            beforedeselect: function (selectionrowmodel, record, index, eOpts) {
                this.arrIdItemDeselected.push(record.data.id);
            },
            beforeselect: function (rowmodel, record, index, eOpts) {
                if (this.treegrid.getSelectionModel().getSelection().length == 0) {
                    //Ejecutar el setvalue del componente
                    this.reset();
                }

                if (!record.data.leaf && !this.selectParent) {
                    return false;
                }
            },
            selectionchange: function (selmodel, selected, eOpts) {
                //Ejecutar el setvalue del componente
                var arraux = [];
                selected.forEach(function (item, index, allItems) {
                    arraux.push({id: item.data.id, value: item.data.code});
                }, this);
                this.setValueComboTree(arraux);

                if (!this.multiSelect) {
                    this.collapse();
                }

                /*Evento que se dispara para compartir los valores seleccionados del combo tree*/
                /*Pero en este caso cuando se selecciona los elementos*/
                this.fireEvent('selectcombotree', this, this.values);
            },
            beforeload: function (store, operation, eOpts) {
                if (!Ext.isEmpty(this.params)) {
                    operation.params = this.params;
                }
            },
            load: function (treestore, node, records, successful, eOpts) {
                this.recordsaux = records;

                if (this.firstLoad) {
                    this.task = {
                        interval: 300,
                        scope: this,
                        run: function () {
                            if (this.panel.rendered) {
                                this.firstLoad = false;

                                var cantseleccionados = this.values.length;
                                var cantrecords = this.recordsaux.length;
                                if (cantseleccionados > 0) {
                                    for (var i = 0; i < cantseleccionados; i++) {
                                        for (var j = 0; j < cantrecords; j++) {
                                            if (this.values[i].id == records[j].data.id) {
                                                this.treegrid.getSelectionModel().select(records[j], true, true);
                                                break;
                                            }
                                        }
                                    }
                                }

                                if (this.task) {
                                    Ext.TaskManager.stop(this.task);
                                    this.task = null;
                                    this.recordsaux = null;
                                }
                            }
                        }
                    };
                    Ext.TaskManager.start(this.task);
                }
                else {
                    var cantseleccionados = this.values.length;
                    var cantrecords = records.length;
                    if (cantseleccionados > 0) {
                        for (var i = 0; i < cantseleccionados; i++) {
                            for (var j = 0; j < cantrecords; j++) {
                                if (this.values[i].id == records[j].data.id) {
                                    this.treegrid.getSelectionModel().select(records[j], true, true);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        });

        this.btnUpdate.on({
            scope: this,
            click: function (button, event, eOpts) {
                this.reloadStoreComboTree();
            }
        });

        this.panel.on({
            scope: this,
            beforerender: function (panel, eOpts) {
                this.tsearchfield.setWidth(this.getSize().width * 0.988);
            },
            render: function (panel, eOpts) {
            },
            afterrender: function (panel, eOpts) {
                //this.tsearchfield.focus(true, true);
            }
        });

        this.tsearchfield.on({
            scope: this,
            clear: function (field) {
                this.reset();
                this.treegrid.getStore().load({});
            },
            search: function (field, value) {
                this.reset();
                this.treegrid.getStore().load({
                    params: {
                        filter: value
                    }
                });
            }
        });

        this.on({
            scope: this,
            collapse: function (field, eOpts) {
                /*Evento que se dispara para compartir los valores seleccionados del combo tree*/
                /*Pero en este caso cuando se colapsa el combo*/
                this.fireEvent('collapsecombotree', this, this.values);
            }
        });
    },
    setValueComboTree: function (arrvalues) {

        if (arrvalues.length === 0 && this.values.length === 0) {
            this.arrIdItemDeselected = [];
            this.reset();
        }
        else if (arrvalues.length === 1 && this.values.length === 0) {
            this.arrIdItemDeselected = [];

            this.values.push({
                id: arrvalues[0].id,
                value: arrvalues[0].value
            });
            this.setValue(arrvalues[0].value);
        }
        else {

            if (this.values.length === 0) {
                this.arrIdItemDeselected = [];

                arrvalues.forEach(function (item3, index3, allItems3) {
                    this.values.push(item3);
                }, this);
            }
            else {
                arrvalues.forEach(function (item, index, allItems) {

                    var cont = 0;
                    this.values.forEach(function (item1, index1, allItems1) {
                        if (item.id == item1.id) {
                            cont++;
                        }
                    }, this);

                    if (cont == 0) {
                        this.values.push({
                            id: item.id,
                            value: item.value
                        });
                    }

                }, this);
            }

            if (this.arrIdItemDeselected.length > 0) {

                for (var j = 0, cant1 = this.arrIdItemDeselected.length; j < cant1; j++) {
                    for (var i = 0, cant = this.values.length; i < cant; i++) {
                        if (this.values[i].id == this.arrIdItemDeselected[j]) {
                            this.values.splice(i, 1);
                            break;
                        }
                    }
                }

            }
            this.arrIdItemDeselected = [];

            var arraux = [];
            this.values.forEach(function (item2, index2, allItems2) {
                arraux.push(item2.value);
            }, this);

            this.setValue(arraux.join(', '));
        }
    },
    getValueComboTree: function () {
        return this.values;
    },
    reset: function () {
        this.setValue('');
        this.values = [];
        this.treegrid.getSelectionModel().deselectAll();
    },
    reloadStoreComboTree: function () {
        if(!this.noResetBeforeLoad) {
            //Esta propiedad es para si no quieres resetear el campo antes de recargar el combo
            this.reset();
        }
        this.treegrid.getStore().load();
    }
});