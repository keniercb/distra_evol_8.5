Ext.namespace('Contabilidad.Reporte.PanelVariables');

Contabilidad.Reporte.PanelVariables.View = Ext.extend(Ext.Panel, {
    width: 320,
    layout: 'border',
    border: false,
    elementos: ['cuenta', 'nomenclador'],
    initComponent: function () {
        Contabilidad.Reporte.PanelVariables.View.superclass.initComponent.call(this);
        this.crearCuerpo();
        this.addEvents('operadoradicionado');
        this.controller = new Contabilidad.Reporte.PanelVariables.Controller({
            view: this
        });
        this.controller.inicializarEventos();
    },

    crearCuerpo: function () {
        var contenedor = this;

        this.crearPanelCuentas();

        this.crearPanelNomenclador();

        this.crearVerticalTbar();

        if (this.elementos.length > 1) {
            this.accordion = new Ext.Panel({
                region: 'center',
                layout: 'accordion'
            });

            contenedor.add(this.accordion);

            contenedor = this.accordion;
        }

        if (this.elementos.indexOf('cuenta') != -1) {
            contenedor.add(this.pCuentas);
        }

        if (this.elementos.indexOf('nomenclador') != -1) {
            contenedor.add(this.pNomenclador);
        }

        this.add(this.verticaltbar);
    },

    crearPanelCuentas: function () {

        this.crearGridCuentas();

        this.stNivel = new Ext.data.Store({
            url: 'cargarNiveles',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idparteformato'
            }, [{name: 'idparteformato'}, {name: 'nivel'}, {name: 'nombre'}, {name: 'longitud'}, {name: 'idconfapertura'}])

        });

        this.cmbNivel = new Ext.form.ComboBox({
            anchor: '99%',
            valueField: 'idparteformato',
            displayField: 'nombre',
            triggerAction: 'all',
            editable: true,
            forceSelection: true,
            typeAhead: true,
            allowBlank: false,
            resizable: true,
            store: this.stNivel,
            emptyText: 'Seleccione el nivel...',
            loadingText: this.etiquetas.lbCargando,
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{nombre}</div></tpl>',
            hideLabel: true
        });

        this.filtro = new Ext.Cont.SearchField({
            lbTtlElement: 'cuentas',
            anchor: '99%',
            hideLabel: true,
            fnOnClear: function () {
                this.fireEvent('onclear', this, this.getValue());
            },
            fnOnSearch: function () {
                this.fireEvent('onsearch', this, this.getValue());
            }
        });

        this.filtro.addEvents('onsearch', 'onclear');

        this.formfiltro = new Ext.form.FormPanel({
            region: 'north',
            frame: true,
            height: 75,
            labelAlign: 'top',
            items: [this.cmbNivel, this.filtro]
        });

        this.pCuentas = new Ext.Panel({
            region: 'center',
            layout: 'border',
            border: false,
            title: '<span style="color: hsl(217, 74%, 31%);font: bold 11px tahoma,arial,verdana,sans-serif;line-height: 15px;">Nomenclador de cuentas</span>',
            items: [this.formfiltro, this.gridCuenta]
        });
    },

    crearPanelNomenclador: function () {
        this.stNivelNom = new Ext.data.Store({
            url: 'cargarNiveles',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idparteformato'
            }, [{name: 'idparteformato'}, {name: 'nivel'}, {name: 'nombre'}, {name: 'longitud'}, {name: 'idconfapertura'}])
        });

        this.cmbNivelNom = new Ext.form.ComboBox({
            anchor: '99%',
            valueField: 'idparteformato',
            displayField: 'nombre',
            triggerAction: 'all',
            editable: true,
            forceSelection: true,
            typeAhead: true,
            resizable: true,
            store: this.stNivelNom,
            emptyText: 'Seleccione el nivel...',
            loadingText: this.etiquetas.lbCargando,
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{nombre}</div></tpl>',
            hideLabel: true
        });

        this.formfiltroNom = new Ext.form.FormPanel({
            region: 'north',
            frame: true,
            height: 35,
            items: [this.cmbNivelNom]
        });

        this.smTreeApertura = new Ext.grid.RowSelectionModel();

        this.stTreeApertura = new Ext.Cont.TreeGrid.AdjacencyListStore({
            autoLoad: false,
            url: 'cargarNomencladorAperturas',
            reader: new Ext.data.JsonReader({
                id: '_id',
                root: 'data',
                successProperty: 'success'
            }, [
                {name: 'idconfapertura'},
                {name: 'id'},
                {name: '_id'},
                {name: '_is_leaf'},
                {name: '_parent'},
                {name: 'codigo'},
                {name: 'descripcion'},
                {name: 'text'},
                {name: 'concat'}
            ])
        });

        this.treeApertura = new Ext.Cont.TreeGrid.GridPanel({
            region: 'center',
            autoScroll: true,
            stripeRows: true,
            border: false,
            frame: false,
            loadMask: true,
            sm: this.smTreeApertura,
            store: this.stTreeApertura,
            enableColumnMove: false,
            hideHeaders: true,
            columns: [
                {
                    dataIndex: 'text',
                    sortable: true,
                    width: 300,
                    header: 'Denominacion',
                    renderer: function (value, metaData, record) {
                        metaData.attr = 'ext:qtip="<b>' + value + '</b>"';
                        return value;
                    }
                }
            ]
        });

        this.pNomenclador = new Ext.Panel({
            region: 'center',
            border: false,
            layout: 'border',
            title: '<span style="color: hsl(217, 74%, 31%);font: bold 11px tahoma,arial,verdana,sans-serif;line-height: 15px;">Nomenclador por apertura</span>',
            items: [this.formfiltroNom, this.treeApertura]
        });
    },

    crearGridCuentas: function () {

        this.smCuenta = new Ext.grid.RowSelectionModel();

        this.stCuenta = new Ext.data.Store({
            url: 'cargarCuentasPorNivel',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: 'idcuenta'
            }, [
                {
                    name: 'idcuenta'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'concatcta'
                }

            ])
        });

        this.gridCuenta = new Ext.grid.GridPanel({
            loadMask: this.etiquetas.lbCargando,
            frame: false,
            border: false,
            stripeRows: true,
            region: 'center',
            autoExpandColumn: 'expandir',
            autoScroll: true,
            store: this.stCuenta,
            sm: this.smCuenta,
            viewConfig: {
                emptyText: this.etiquetas.lbNoResults
            },
            columns: [
                {
                    header: this.etiquetas.lbCodigo,
                    width: 100,
                    dataIndex: 'concatcta',
                    sortable: true,
                    renderer: function (value, metaData, record) {
                        metaData.attr = 'ext:qtip="<b>' + value + '</b>"';
                        return value;
                    }
                },
                {
                    header: this.etiquetas.lbDescripcion,
                    dataIndex: 'descripcion',
                    id: 'expandir',
                    sortable: true,
                    renderer: function (value, metaData, record) {
                        metaData.attr = 'ext:qtip="<b>' + value + '</b>"';
                        return value;
                    }
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                displayInfo: false,
                store: this.stCuenta
            })
        });
    },

    crearVerticalTbar: function () {

        this.btnAdicionarCta = new Ext.Button({
            xtype: 'button',
            iconCls: 'adicionar',
            tooltip: 'Adicionar cuenta a la formula',
            disabled: true
        });

        this.verticaltbar = {
            frame: false,
            border: false,
            region: 'east',
            width: 28,
            bodyStyle: 'background: hsl(217, 56%, 92%);',
            items: {
                xtype: 'toolbar',
                border: false,
                style: 'margin-top:170px;border: none;background: none;',
                items: [this.btnAdicionarCta]
            }
        }
    },

    deshabilitarSeleccion: function (valor) {
        if (valor) {
            if (this.smCuenta.selections.length != 0) {
                this.smCuenta.clearSelections();
            }
            if (this.smTreeApertura.selections.length != 0) {
                this.smTreeApertura.clearSelections();
            }
            this.smCuenta.lock();
            this.smTreeApertura.lock();
        } else {
            this.smCuenta.unlock();
            this.smTreeApertura.unlock();
        }
    }
});

Contabilidad.Reporte.PanelVariables.Controller = function (params) {

    Ext.apply(this, params);

    this.inicializarEventos = function () {

        this.view.pCuentas.on({
            scope: this.view,
            render: function () {
                this.stNivel.load({
                    scope: this,
                    callback: function (records) {
                        if (records.length != 0) {
                            this.cmbNivel.setValue(records[0].data.idparteformato);
                            this.cmbNivel.setRawValue(records[0].data.nombre);
                            this.cmbNivel.fireEvent('select', this.cmbNivel, records[0], 0);
                        }
                    }
                });
            }
        });

        this.view.pNomenclador.on({
            scope: this.view,
            render: function () {
                this.stNivelNom.load({
                    scope: this,
                    callback: function () {
                        var store = this.stNivelNom;
                        if (store.getCount() != 0) {
                            this.cmbNivelNom.setValue(store.getAt(0).data.idparteformato);
                            this.cmbNivelNom.setRawValue(store.getAt(0).data.nombre);
                            this.cmbNivelNom.fireEvent('select', this.cmbNivelNom, store.getAt(0), 0);
                        }
                    }
                });
            }
        });

        this.view.stNivelNom.on({
            scope: this,
            load: function (store) {
                store.filterBy(function (record) {
                    if (record.data.idconfapertura) {
                        return true;
                    }
                }, this);
            }
        });

        this.view.cmbNivel.on({
            scope: this,
            select: function (cmb) {
                this.view.stCuenta.baseParams.idparteformato = cmb.getValue();
                this.view.stCuenta.load({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            }
        });

        this.view.cmbNivelNom.on({
            scope: this,
            select: function (cmb, record) {
                this.view.stTreeApertura.removeAll();
                this.view.stTreeApertura.baseParams.idconfapertura = record.data.idconfapertura;
                this.view.stTreeApertura.load();
            }
        });

        this.view.filtro.on({
            scope: this,
            onsearch: function (filtro, valor) {
                this.view.stCuenta.baseParams.filtro = valor;
                this.view.stCuenta.load();
            },
            onclear: function () {
                delete this.view.stCuenta.baseParams.filtro;
                this.view.stCuenta.load();
            }
        });

        this.view.smCuenta.on({
            scope: this,
            selectionchange: this.activarBtnAdicionarCta
        });

        this.view.pCuentas.on({
            scope: this,
            collapse: function () {
                this.view.pNomenclador.expand();
                this.view.smCuenta.clearSelections();
            },
            render: function () {
                if (this.view.disabledSelection) {
                    this.view.smCuenta.lock();
                }
            }
        });

        this.view.smTreeApertura.on({
            scope: this,
            selectionchange: this.activarBtnAdicionarCta
        });

        this.view.pNomenclador.on({
            scope: this,
            collapse: function () {
                this.view.pCuentas.expand();
                if (this.view.pNomenclador.renderer) {
                    this.view.treeApertura.getSelectionModel().clearSelections();
                }
            },
            expand: function () {
                if (!this.view.pNomenclador.renderer) {
                    this.view.pNomenclador.renderer = true;
                }
            },
            render: function () {
                if (this.view.disabledSelection) {
                    this.view.smTreeApertura.lock();
                }
            }
        });
    };

    this.activarBtnAdicionarCta = function (sm) {
        var cant = sm.getCount(),
            records = sm.getSelections();
        if (cant != 0) {
            this.view.btnAdicionarCta.enable();
        } else {
            this.view.btnAdicionarCta.disable();
        }
    }
}