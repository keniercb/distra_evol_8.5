Ext.grid.RowSelectionModel.override({
    getSelectedIndex: function () {
        return this.grid.store.indexOf(this.selections.itemAt(0));
    }
});
Ext.onReady(function () {
    Ext.Ajax.timeout = 6000000;
    new Ext.Confin.Cuenta.NomCuenta();
});
Ext.Confin.Cuenta.TgPlanCtas = Ext.extend(Ext.Cont.TreeGrid.GridPanel, {
    perfil: new Object(),
    autoExpandColumn: 'expandir',
    master_column_id: 'expandir',
    stripeRows: true,
    border: false,
    frame: false,
    loadMask: true,
    initAppCta: false,
    enableColumnMove: false,
    initComponent: function () {
        var self = this;
        this.layout = 'fit';
        this.store = new Ext.Cont.TreeGrid.AdjacencyListStore({
            autoLoad: true,
            url: 'loadPlanCuentas',
            baseParams: {
                node: 0
                //idcuenta: 0
            },
            listeners: {
                beforeexpandnode: function (st, record) {
                    st.baseParams.node = record.get('idclasificadorplancuenta');
                    if (record.get('idplancuenta') == record.get('id')) {
                        st.baseParams.idpadre = record.get('idplancuenta');
                        st.baseParams.node = record.get('idplancuenta');
                    } else st.baseParams.node = record.get('idclasificadorplancuenta');
                },
                load: function (store, records, options) {
                    if (store.getTotalCount() <= 0) {
                        Ext.getCmp('btnAceptarPlanCtas').enable();
                        mostrarMensaje(1, self.perfil.etiquetas.lbMsgNoData);
                    }
                }
            },
            reader: new Ext.data.JsonReader(
                {id: '_id', root: 'data', successProperty: 'success'},
                [{name: '_id'}, {name: 'idplancuenta'}, {name: 'idclasificadorplancuenta'},
                    {name: 'ordenizq'}, {name: 'ordender'}, {name: 'text'}, {name: '_parent'}, {name: '_is_leaf'}, {name: 'id'},
                    {name: 'codigo'}, {name: 'descripcion'}, {name: 'concatcuenta'}, {name: 'grupo'}, {name: 'naturaleza'}, {name: 'formato'}
                ])
        });
        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                'selectionchange': function (smodel) {
                    if (smodel.getCount()) {
                        if (smodel.getSelections()[0].data.id == smodel.getSelections()[0].data.idclasificadorplancuenta && !smodel.getSelections()[0].data._is_leaf) {
                            self.idclasificadorplancuenta = smodel.getSelections()[0].data.idclasificadorplancuenta;
                            Ext.getCmp('btnAceptarPlanCtas').setDisabled(false);
                        }
                    } else  Ext.getCmp('btnAceptarPlanCtas').setDisabled(true);
                }
            }

        });
        this.columns = [self.sm,
            {
                header: self.perfil.etiquetas.lbCodigo,
                tooltip: self.perfil.etiquetas.lbTthCodigo,
                dataIndex: 'codigo',
                width: 50,
                sortable: true,
                id: 'expandir'
            },
            {
                header: self.perfil.etiquetas.lbDescripcion,
                tooltip: self.perfil.etiquetas.lbTthDescripCtaAp,
                dataIndex: 'descripcion',
                width: 250,
                sortable: false
            },
            {
                header: self.perfil.etiquetas.lbGrupoCont,
                tooltip: self.perfil.etiquetas.lbTthGrupoCont,
                dataIndex: 'grupo',
                width: 100,
                sortable: true
            },
            {
                header: self.perfil.etiquetas.lbNaturaleza,
                tooltip: self.perfil.etiquetas.lbTthNaturaleza,
                dataIndex: 'naturaleza',
                width: 80,
                sortable: true
            },
            {
                header: self.perfil.etiquetas.lbNivelFormato,
                tooltip: self.perfil.etiquetas.lbTthNivel,
                dataIndex: 'formato',
                align: 'center',
                width: 100,
                sortable: false
            },
            {
                header: self.perfil.etiquetas.lbCodigoFull,
                tooltip: self.perfil.etiquetas.lbTthCodFull,
                dataIndex: 'concatcuenta',
                width: 100,
                sortable: true,
                hidden: false
            }];
        self.root_title = this.perfil.etiquetas.lbNomPlanCta;
        Ext.Confin.Cuenta.TgPlanCtas.superclass.initComponent.call(this);
    }
});