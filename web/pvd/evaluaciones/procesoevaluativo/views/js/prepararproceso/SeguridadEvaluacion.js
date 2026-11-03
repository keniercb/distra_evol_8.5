Ext.ns("Ext.PVD.Evaluaciones");
Ext.PVD.Evaluaciones.WinSeguridadEvaluaciones = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {

        var checkMod = new Ext.grid.CheckColumn({
            header: "Modificar", dataIndex: 'modificar', width: 55,
        });

        this.stEvaluadores = new Ext.data.Store({
            url: 'getEvaldoresPe',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
            }, [
                {name: 'idevalseguridadevalentidad'},
                {name: 'idpersona'},
                {name: 'numid'},
                {name: 'nombre'},
                {name: 'snombre'},
                {name: 'papel'},
                {name: 'sapel'},
                {name: 'idprocesoevaluadores'}
            ])
        });

        this.gpEvaluadores = new Ext.grid.GridPanel({
            //tbar: [btnAddEvaldores, '-', btnElimEvaldores],
//            title: perfil.etiquetas.lbTitEvaluadores,
            columns: [
                {header: 'No. identidad', sortable: true, width: 85, dataIndex: 'numid'}
            ],
            store: this.stEvaluadores,
//            loadMask: {msg: perfil.etiquetas.lbGridLoadMask},
            region: 'west',
            margins: '5 0 5 5',
            width: '50%',
            height: 350,
            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stEvaluadores,
                displayInfo: true
            })
        });

        this.stEvaluados = new Ext.data.Store({
            url: 'getEvaldosPe',
            pruneModifiedRecords: true,
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
            }, [
                {name: 'idevalaccesoevalentidad'},
                {name: 'idpersona'},
                {name: 'numid'},
                {name: 'snombre'},
                {name: 'papel'},
                {name: 'sapel'},
                {name: 'modificar'}
            ])
        });

        this.gpEvaluados = new Ext.grid.EditorGridPanel({
            //title: perfil.etiquetas.lbTitEvaluados,
            columns: [
                {header: 'No. identidad', sortable: true, width: 85, dataIndex: 'numid'},
                ,
                checkMod
            ],
            //tbar: [btnAddEvaldos, '-', btnElimEvaldos, '-', btnGuardarPermisos],
            plugins: [checkMod],
            clicksToEdit: 1,
            store: this.stEvaluados,
            //loadMask: {msg: perfil.etiquetas.lbGridLoadMask},
            region: 'center',
            margins: '5 5 5 5',
            width: '50%',
            height: 350,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stEvaluados,
                displayInfo: true
            }),
            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
            listeners: {
                rowclick: function (grid, rowIndex, event) {
//				btnElimEvaldos.setDisabled(false);
//				btnGuardarPermisos.setDisabled(false);
                }
            }
        });

        this.items = [this.gpEvaluados];
        Ext.PVD.Evaluaciones.WinSeguridadEvaluaciones.superclass.initComponent.call(this);
    }
});
