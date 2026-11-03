/**
 * @class Ext.CmpTemplate
 * @extends Ext.Component
 * @author Ing. Alberto Mesa Martínez
 */
Ext.CmpReplicator = Ext.extend(Ext.Component, {
    idfuncionality: window.frameElement.id,
    replicateurl: '',
    loaddataurl: '',
    idioma: {},
    tabparent: undefined,
    position: undefined,
    subsystem: false,
    datafields: [{name: 'id'}, {name: 'name', id: 'name'}],
    dataidsubsist: 'idsubsistema',
    dataidentifier: 'id',
    datatotalProperty: 'total',
    dataroot: 'data',
    dataautoExpandColumn: 'name',
    checkedentities: [],
    idestructura: window.parent.UCID.portal.perfil.idestructuracomun,
    economic: true,
    constructor: function (params) {
        this.addEvents(/**
             * @event confirm
             * Se dispara una vez se haya creado o terminado de cargar los datos de una platilla.
             */
            'confirm');
        Ext.apply(this, params);

        this.idestructuraoriginal = window.parent.UCID.portal.perfil.idestructuracomun;
        this.idestructura = this.idestructuraoriginal;

        this.btnReplicate = new Ext.Button({
            id: 'btnCreateTemplate',
            iconCls: 'heredar',
            action: 'replicate',
            hidden: true,
            tooltip: this.idioma.lbTtReplicate || 'Replicar',
            text: this.idioma.lbReplicate || 'Replicar'
        });

        if (this.tabparent && this.position >= 0) {
            this.tabparent.splice(this.position, 0, this.btnReplicate);

            this.btnReplicate.on({
                scope: this,
                click: this.clickMainButtons
            });
        }
    },
    defineEvents: function () {
        var me = this;

        this.gpdata.on({
            render: function () {
                this.mask = new Ext.LoadMask(this.el);
                this.getStore().load();
            }
        });

        this.gpdata.getSelectionModel().on({
            scope: this,
            selectionchange: this.checkWindow
        });

        this.gpdata.getStore().on({
            beforeload: function () {
                me.gpdata.mask.show();
            },
            load: function (store, record) {
                me.gpdata.mask.hide();
            }
        });

        if (this.subsystem) {
            this.gpsubsist.on({
                render: function () {
                    this.mask = new Ext.LoadMask(this.el);
                    this.getStore().load();
                }
            });

            this.gpsubsist.getSelectionModel().on({
                scope: this,
                selectionchange: function (sm) {
                    var stdata = this.gpdata.getStore(),
                        records = sm.getSelections(),
                        idsubsist = [];

                    setTimeout(function () {
                        Ext.each(records, function (record, index) {
                            idsubsist.push(record.data.idsubsistema);
                        });

                        stdata.baseParams.idsubsistema = Ext.encode(idsubsist);
                        stdata.load();
                        me.checkWindow();
                    }, 500);
                }
            });

            this.gpsubsist.getStore().on({
                beforeload: function () {
                    me.gpsubsist.mask.show();
                },
                load: function (store, record) {
                    me.gpsubsist.mask.hide();
                }
            });
        }

        if (!this.economic) {
            this.tpentities.tree.on({
                scope:this,
                checkchange: me.onCheckTree,
                load: me.onloadTree
            });
        } else {
            this.tpentities.on({
                scope:this,
                checkchange: me.onCheckTree,
                load: me.onloadTree
            });
        }


    },
    onloadTree: function (node) {
        var me = this,
            validconcept = ["1", "3", "5", "8"],
            childrens = node.childNodes,
            idestructura = me.economic ? 'idestructuracomun' : 'id';
        if (childrens.length != 0) {
            if (!me.idestructura) {
                me.idestructura = me.idestructuraoriginal
            }
            Ext.each(childrens, function (child) {
                child.attributes.checked = false;
                if ((!me.economic && validconcept.indexOf(child.attributes.idconcepto) == -1)/* || child.attributes[idestructura] == me.idestructura*/) {
                    child.disable();
                }
            })
        }
    },
    onCheckTree: function (node, checked) {
        var me = this,
            validconcept = ["1", "3", "5", "8"],
            valid = validconcept.indexOf(node.attributes.idconcepto) != -1,
            idestructura = me.economic ? 'idestructuracomun' : 'id',
            pos = me.checkedentities.indexOf(node.attributes[idestructura]),
            issaved = pos != -1;

        if (checked && valid && !issaved) {
            me.checkedentities.push(node.attributes[idestructura]);
        }

        if (!checked && issaved) {
            me.checkedentities.splice(pos, 1);
        }

        me.checkWindow();
    },
    clickMainButtons: function (btn) {
        if (!this.replicateurl) {
            return;
        }

        this.createWindow(btn);

        this.window.show();
    },
    createWindow: function (btn) {
        var me = this,
            title = this.idioma.titleReplicate || 'Replicar datos',
            items = [],
            width = 670;

        this.btnacept = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: this.idioma.qtipAccept || 'Aceptar',
            text: this.idioma.lbBtnAccept || 'Aceptar',
            handler: this.executeAction.bind(this, btn.action),
            disabled: true
        });

        this.btnapply = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: this.idioma.qtipApply || 'Aplicar',
            text: this.idioma.lbBtnApply || 'Aplicar',
            handler: this.executeAction.bind(this, btn.action),
            disabled: true
        });

        this.btncancel = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: this.idioma.qtipCancel || 'Cancelar',
            text: this.idioma.lbBtnCancel || 'Cancelar',
            handler: function () {
                me.window.destroy();
            }
        });

        this.gpdata = this.createGridData();

        if (this.economic) {
            this.tpentities = this.createTreeEconomicEntities();
        } else {
            this.tpentities = this.createTreeEntities();
        }

        items = [this.gpdata, this.tpentities];

        if (btn.action == 'replicate' && this.subsystem) {

            this.gpsubsist = this.createGridSubsist();

            items.push(this.gpsubsist);
            width += 350;
        }

        this.window = new Ext.Window({
            title: title,
            modal: true,
            layout: 'border',
            closeAction: 'destroy',
            maximizable: true,
            items: items,
            width: width,
            height: 450,
            buttons: [this.btncancel, this.btnapply, this.btnacept]
        });

        this.defineEvents();
    },
    createGridSubsist: function () {
        var stsubsist = new Ext.data.Store({
                url: 'cargarsubsistemas',
                reader: new Ext.data.JsonReader({
                    id: 'idsubsistema'
                }, [
                    {
                        name: 'idsubsistema'
                    },
                    {
                        name: 'nombsubsistema'
                    }
                ])
            }),
            smsubsist = new Ext.grid.CheckboxSelectionModel();

        return new Ext.grid.GridPanel({
            title: this.idioma.lbSubsistemas || 'Subsistemas',
            store: stsubsist,
            columns: [
                smsubsist,
                {header: "Nombre", width: 120, sortable: true, dataIndex: 'nombsubsistema'}
            ],
            viewConfig: {
                forceFit: true,
                emptyText: this.idioma.lbNoResults || 'No existen datos que mostrar.'
            },
            sm: smsubsist,
            width: 250,
            border: false,
            margins: '0 5 0 0',
            region: 'west'

        })
    },
    createGridData: function () {
        var me = this,
            fields = this.createFields(),
            stdata = new Ext.data.Store({
                url: this.loaddataurl || 'load',
                reader: new Ext.data.JsonReader({
                    id: this.dataidentifier,
                    totalProperty: this.datatotalProperty,
                    root: this.dataroot
                }, fields)
            }),
            smdata = new Ext.grid.CheckboxSelectionModel(),
            columns = this.createColumns(),
            view = {};

        if (this.subsystem && this.dataidsubsist) {
            view = new Ext.grid.GroupingView({
                startCollapsed: false,
                startGroup: new Ext.XTemplate(
                    '<div id="{groupId}" class="x-grid-group {cls}">',
                    '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div class="x-grid-group-title">',
                    '{[this.findSubsist(values)]}',
                    '</div></div><div id="{groupId}-bd" class="x-grid-group-body">',
                    {
                        findSubsist: function (values) {
                            var store = me.gpsubsist.getStore(),
                                pos = store.findBy(function (record) {
                                    return record.data.idsubsistema == values.gvalue;
                                });
                            if (pos != -1) {
                                return store.getAt(pos).data.nombsubsistema
                            }
                        }
                    }
                )
            });
            stdata = new Ext.data.GroupingStore({
                url: this.loaddataurl || 'load',
                reader: new Ext.data.JsonReader({
                    id: this.dataidentifier,
                    totalProperty: this.datatotalProperty,
                    root: this.dataroot
                }, fields),
                groupField: this.dataidsubsist,
                sortInfo: {
                    field: this.dataidsubsist,
                    direction: "ASC"
                }
            });
        }

        columns.splice(0, 0, smdata);

        var grid = new Ext.grid.GridPanel({
            store: stdata,
            title: this.idioma.lbDataReplicate || 'Datos',
            autoExpandColumn: this.dataautoExpandColumn,
            columns: columns,
            viewConfig: {
                forceFit: true,
                emptyText: this.idioma.lbNoResults || 'No existen datos que mostrar.'
            },
            sm: smdata,
            border: false,
            region: 'center',
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: false,
                store: stdata
            })
        });

        if (this.subsystem && this.dataidsubsist) {
            grid.view = view;
        }

        return grid;
    },
    createTreeEntities: function () {
        return new Ext.estructura.panel.PanelEstructura({
            title: this.idioma.titleestructura || 'Estructuras',
            border: false,
            region: 'east',
            checker: true,
            width: 350,
            split: true
        });
    },
    createTreeEconomicEntities: function () {
        var loader = new Ext.tree.TreeLoader({
                dataUrl: 'cargarEntidadesEconomicas',
                autoLoad: true
            }),
            root = new Ext.tree.AsyncTreeNode({
                text: 'Estructuras',
                draggable: false,
                id: '0',
                expanded: true
            }),
            tree = new Ext.tree.TreePanel({
                autoScroll: true,
                region: 'east',
                split: true,
                title: 'Estructuras econ&oacute;micas',
                border: false,
                width: 350,
                layoutConfig: {
                    animate: true
                },
                enableDD: true,
                loader: loader,
                rootVisible: false,
                root: root
            });

        return tree;
    },
    createFields: function () {
        var fields = [],
            existidsubsist = false;
        for (var k in this.datafields) {
            if (typeof this.datafields[k] == 'object') {
                fields.push({
                    name: this.datafields[k].name,
                    type: this.datafields[k].type || 'string',
                    mapping: this.datafields[k].mapping || this.datafields[k].name
                });
                if (this.datafields[k].name == this.dataidsubsist) {
                    existidsubsist = true;
                }
            }
        }
        if (this.subsystem && existidsubsist == false) {
            fields.push({
                name: this.dataidsubsist || 'idsubsistema',
                type: 'int',
                mapping: this.dataidsubsist || 'idsubsistema'
            });
        }
        return fields;
    },
    createColumns: function () {
        var columns = [],
            existidsubsist = false;
        for (var k in this.datafields) {
            if (typeof this.datafields[k] == 'object') {
                var column = this.datafields[k];
                column['dataIndex'] = column['name'];
                columns.push(column);
                if (column['name'] == this.dataidsubsist) {
                    existidsubsist = true;
                }
            }
        }
        if (this.subsystem && existidsubsist == false) {
            columns.push({
                dataIndex: this.dataidsubsist || 'idsubsistema',
                header: 'Subsistema',
                hidden: true,
                hideable: false
            });
        }
        return columns;
    },
    executeAction: function (action, close) {
        var me = this,
            count = 0,
            close = close || false,
            title = this.idioma.msgWait || 'Por favor espere...',
            url = this.replicateurl,
            msg = this.idioma.msgReplicatingData || 'Replicando datos',
            msgok = this.idioma.msgDataReplicated || 'Los datos han sido replicados satisfactoriamente.',
            msgNoAnswer = this.idioma.msgNoAnswer || 'El servidor no responde, espere m&aacutes tarde para realizar esta acci&oacuten.',
            subsistemas = this.getSelectedSubsist(),
            datos = this.getSelectedData(),
            entidades = this.checkedentities,
            params = {
                subsistemas: Ext.encode(subsistemas),
                datos: Ext.encode(datos),
                estructuras: Ext.encode(entidades)
            };

        me.showMessageBox(title, msg);
        Ext.Ajax.request({
            url: url,
            params: params,
            timeout: 240000,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();

                var response = Ext.decode(response.responseText);

                if (!response) {
                    mostrarMensaje(6, msgNoAnswer);
                    return;
                }

                if (response.code == 1) {
                    mostrarMensaje(1, msgok);
                    me.fireEvent('confirm', action);
                    if (close) {
                        me.window.destroy();
                    } else {
                        me.resetWindow();
                    }
                }
            }
        })

    },
    showMessageBox: function (title, msg) {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    },
    checkWindow: function () {
        var selecteddata = this.gpdata.getSelectionModel().getCount() != 0,
            selectedentities = this.checkedentities.length != 0,
            condition = selectedentities && selecteddata;
        if (this.subsystem) {
            var selectedsubsist = this.gpsubsist.getSelectionModel().getCount() != 0;
            condition = selectedentities && (selectedsubsist || selecteddata);
        }
        this.btnacept.setDisabled(!condition);
        this.btnapply.setDisabled(!condition);
    },
    getSelectedSubsist: function () {
        var data = [],
            me = this;
        if (!this.subsystem) {
            return data;
        }
        var records = this.gpsubsist.getSelectionModel().getSelections(),
            datarecords = this.gpdata.getSelectionModel().getSelections();
        Ext.each(records, function (record) {
            var all = true,
                idsubsistema = record.data.idsubsistema;

            if (datarecords.length != 0) {
                Ext.each(datarecords, function (datarecord) {
                    if (datarecord.data[me.dataidsubsist] == idsubsistema) {
                        all = false;
                        return false;
                    }
                });
            }
            data.push({id: idsubsistema, alldata: all});
        });
        return data;
    },
    getSelectedData: function (subsistemas) {
        var data = [],
            records = this.gpdata.getSelectionModel().getSelections();

        Ext.each(records, function (record) {
            data.push(record.data[this.dataidentifier]);
        }, this);

        return data;
    },
    resetWindow: function () {
        if (this.subsystem) {
            this.gpsubsist.getSelectionModel().clearSelections();
        }

        this.gpdata.getSelectionModel().clearSelections();
        this.checkedentities = [];
        this.gpdata.getStore().baseParams.idsubsistema = Ext.encode([]);
        this.gpdata.getStore().load();
    }
});
