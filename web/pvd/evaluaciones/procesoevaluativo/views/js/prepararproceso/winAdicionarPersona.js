Ext.ns("Ext.components.Evaluaciones");
Ext.components.Evaluaciones.TabPanelContenedor = Ext.extend(Ext.TabPanel, {
    activeTab: 0,
    initComponent: function () {
        var self = this;
        this.pBuscarPersona = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            id: 'panelBusPer',
            title: 'Listado de personas',
            parent: self,
            singleSelect: (self.singleSelect) ? self.singleSelect : false,
        });

        ////Arbol de esturctura y GridPanel con el listado de las personas por cargo
        this.objEstructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            title: 'Cargos',
            region: 'center',
            layout: 'border',
            split: true,
            border: true,
            width: '40%',
            margins: '5 5 5 5',
        });

        this.gpDatosPersona = new Ext.components.Evaluaciones.gpPersonasCargo({
            width: '60%',
            parent: self,
            margins: '5 5 5 0',
        });
        this.objEstructura.on('estructuraselecionada', function (sm, nodo) {
            if (nodo.isLeaf()) {
                self.gpDatosPersona.store.load({
                    params: {
                        idcargo: nodo.attributes.id,
                        limit: 15,
                        start: 0
                    }
                });
            }
        });

        this.items = [
            {
                title: 'Estructura',
                layout: 'border',
                items: [this.objEstructura, this.gpDatosPersona]
            },
            this.pBuscarPersona
        ];

        Ext.components.Evaluaciones.TabPanelContenedor.superclass.initComponent.call(this);
    }
});

Ext.components.Evaluaciones.gpPersonasCargo = Ext.extend(Ext.grid.GridPanel, {
    region: 'east',
    title: 'Listado de personas',
    loadMask: true,
    disable: true,
    initComponent: function () {
        var self = this;
        this.seleccion = null;
        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    seleccion = record;
                },
                selectionchange: function (defsm) {
                    if (defsm.getSelected() != null) {
                        this.fireEvent('personasSeleccionadas', defsm.getSelected());
                        this.seleccion = defsm.getSelected();
                    } else {
                        this.fireEvent('personasSeleccionadas');
                        this.seleccion = null;
                    }
                }

            }
        });
        this.cm = new Ext.grid.ColumnModel([
            self.sm,
            {header: 'Nombre', menuDisabled: true, dataIndex: 'nombre', sortable: true},
            {header: 'Segundo nombre', menuDisabled: true, dataIndex: 'snombre', sortable: true},
            {header: 'Primer apellido', menuDisabled: true, dataIndex: 'papel', sortable: true, width: 150},
            {header: 'Segundo apellido', menuDisabled: true, dataIndex: 'sapel', sortable: true, width: 150},
            {header: 'Carn&eacute;t de identidad', menuDisabled: true, dataIndex: 'numid', sortable: true, width: 150},
        ]);
        this.store = new Ext.data.JsonStore({
            url: 'getPersonaPorCargo',
            root: 'data',
            fields: [
                'idpersona',
                'numid',
                'nombre', 'snombre',
                'papel', 'sapel'
            ],
            listeners: {
                load: function () {
                    self.getSelectionModel().selectAll();
                }
            }
        });
        Ext.components.Evaluaciones.gpPersonasCargo.superclass.initComponent.call(this);

    }
});
