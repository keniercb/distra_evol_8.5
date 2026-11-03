Ext.ns("Ext.components.Evaluaciones");
var idEvaluador;
Ext.components.Evaluaciones.gpListEvaluadores = Ext.extend(Ext.grid.GridPanel, {
    autoscroll: true,
    region: 'west',
    margins: '5 5 5 5',
    title: 'Listado de evaluadores',
    view: new Ext.grid.GroupingView({
        forceFit: true,
        showGroupName: false,
        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
    }),
    initComponent: function () {
        var self = this;
        this.store = new Ext.data.GroupingStore({
            sortInfo: {field: 'numid', direction: 'ASC'},
            groupField: 'cargo',
            url: 'cargarevaluadores',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {name: 'idprocesoevaluadores'},
                {name: 'numid'},
                {name: 'nombre'},
                {name: 'snombre'},
                {name: 'papel'},
                {name: 'sapel'},
                {name: 'idpersona'},
                {name: 'cargo'},
            ])
        });
        this.columns = [
            {header: 'No. identidad', sortable: true, dataIndex: 'numid'},
            {header: 'Nombre', sortable: true, dataIndex: 'nombre'},
            {header: 'Segundo nombre', sortable: true, dataIndex: 'snombre'},
            {header: 'Primer apellido', sortable: true, dataIndex: 'papel'},
            {header: 'Segundo apellido', sortable: true, dataIndex: 'sapel'},
            {header: '', sortable: true, dataIndex: 'cargo', hidden: true}
        ];
        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, index, record) {
                    idEvaluador = record.data.idprocesoevaluadores;
                    self.btnDelPersEvaluador.enable();
                    self.btnAddPersEvaluador.focus();
                }
            }
        });
        this.tfBuscar = new Ext.app.SearchField({
            store: this.store,
            emptyText: labels.TextBuscar,
            id: 'buscar' + self.id
        });
        this.id = new Ext.form.TextField();
        function showWinAddEvaluador() {
            var winBusEval = new Ext.components.Evaluaciones.WinBuscarEvaluador({
                accion: 'evaluador',
                parent: self,
                recProceso: self.recProceso,
                idprocesocomisionevaluacion: self.id.getValue(),
            });
            winBusEval.show();
        }

        this.btnAddPersEvaluador = new Ext.Button({
            iconCls: 'adicionar',
            hidden: this.gestionar || false,
            text: labels.lbBtnAdicionar,
            tooltip: labels.lbToolTipAddPersEvaluador,
            handler: showWinAddEvaluador
        });
        this.btnDelPersEvaluador = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            hidden: this.gestionar || false,
            text: labels.lbBtnEliminar,
            tooltip: labels.lbToolTipDelPersEvaluador,
            handler: function () {
                mostrarMensaje(2, labels.TextDelEvaluador, function (btn) {
                    if (btn == "ok") {
                        PVD.mostrarMascara('idmskmodify', labels.lbPleaseWait, labels.TextBarraEnProgresoDelEvaluador);
                        Ext.Ajax.request({
                            url: 'restaurarpersonaedores',
                            method: 'POST',
                            params: {
                                idprocesoevaluadores: idEvaluador
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idmskmodify');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.exception == 1) {
                                    mostrarMensaje(1, labels.EvaluadorEnUso);
                                }
                                else {
                                    mskAux.hide();
                                    mostrarMensaje(1, labels.EvaluadorDelOK);
                                    self.store.reload();
                                }
                            }

                        });
                    }
                });
            }
        });
        this.tbar = [this.btnAddPersEvaluador, this.btnDelPersEvaluador, this.tfBuscar];
        this.bbar = new Ext.PagingToolbar({
            pageSize: 15,
            store: this.store,
            displayInfo: true,
            displayMsg: labels.lbPaginToolBar
        });
        this.loadMask = {msg: 'Cargando...'};
        Ext.components.Evaluaciones.gpListEvaluadores.superclass.initComponent.call(this);
    },
    cargarListEvaluadores: function (id) {
        this.store.baseParams.idpreprocesoevaluativo = id;
        this.store.load({
            params: {
                start: 0,
                limit: 15
            }
        });
    },
    setIdProcesoComision: function (idcomisionevaluacion) {
        this.id.setValue(idcomisionevaluacion);
    }
});
