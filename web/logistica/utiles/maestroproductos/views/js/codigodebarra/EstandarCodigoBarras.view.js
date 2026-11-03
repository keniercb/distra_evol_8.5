Ext.namespace('Ext.EstandarCodigoBarras');
Ext.EstandarCodigoBarras.view = Ext.extend(Ext.Panel, {
    layout: 'border',
    region: 'center',
    frame: false,
    border: false,
    closable: true,
    constructor: function (model) {
        this.crearBtns();
        this.items = [this.crearGridPrincipal(model)];
        Ext.EstandarCodigoBarras.view.superclass.constructor.call(this);
    },
    getBtnAdicionar: function () {
        return this.btnAdicionar;
    },
    getBtnModificar: function () {
        return this.btnModificar;
    },
    getBtnEliminar: function () {
        return this.btnEliminar;
    },
    getBtnModSequencia: function () {
        return this.btnModSequencia;
    },
    getGridPrincipal: function () {
        return this.gridPrincipal;
    },
    crearBtns: function () {
        this.btnAdicionar = new Ext.Button({
            iconCls: 'adicionar',
            disabled: false,
            text: 'Adicionar',
            // tooltip: ''
        });

        this.btnModificar = new Ext.Button({
            iconCls: 'modificar',
            disabled: true,
            text: 'Modificar',
            // tooltip: ''
        });

        this.btnEliminar = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            text: 'Eliminar',
            // tooltip: ''
        });

        this.btnModSequencia = new Ext.Button({
            iconCls: 'modificar',
            disabled: true,
            text: 'Modificar sequencia',
            // tooltip: ''
        });

        this.btnProbar = new Ext.Button({
            iconCls: 'eliminar',
            disabled: false,
            text: 'Probar',
            // tooltip: ''
        });
    },
    crearGridPrincipal: function (model) {

        var columns = [
            {
                id: 'idAutoExpand' + 'Denominacion',
                header: 'Denominacion',
                dataIndex: 'denominacion',
                width: 150,
                hidden: false,
                align: 'left',
            },
            {
                header: 'Bandera',
                dataIndex: 'bandera',
                width: 50,
                hidden: false,
                align: 'left',
            },
            {
                header: 'Formato',
                dataIndex: 'formato',
                width: 150,
                hidden: false,
                align: 'left',
            },
            {
                header: 'Por entidad',
                dataIndex: 'sequenciaporentidad',
                width: 50,
                hidden: false,
                align: 'center',
                renderer: function (value, metadata, record, rowIndex, colIndex, storegrid) {
                    if (value) {
                        return 'SI';
                    } else {
                        return 'NO';
                    }
                }
            },
            {
                header: 'Seq actual',
                dataIndex: 'secuenciaactual',
                width: 50,
                hidden: false,
                align: 'center',
            },
        ];

        return this.gridPrincipal = new Ext.grid.GridPanel({
            // title: 'Supergrid',
            region: 'center',
            frame: true,
            autoExpandColumn: 'idAutoExpand' + 'Denominacion',
            columns: columns,
            store: model.getStoreGridPrincipal(),
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                moveEditorOnEnter: false
            }),
            loadMask: true,
            tbar: [this.getBtnAdicionar(), this.getBtnModificar(), this.getBtnEliminar(), this.getBtnModSequencia(), this.btnProbar]
        });
    }
});