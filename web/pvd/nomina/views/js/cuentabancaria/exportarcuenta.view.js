Ext.ns('Pvd.Nomina.Banco.Acreditarcuentabancaria');
Ext.QuickTips.init();

Pvd.Nomina.Banco.Acreditarcuentabancaria.Vista = {
    init: function (perfil, idioma, modelo) {
        this.acumuladoneto = 0.00;
        this.recordperiodopagoexportarseleccionado = null;
        //this.recordperiodopagoexportarseleccionado = null;
        this.arrayidelaborarpagos = new Array();

        /*
        this.btnExportarBanco = new Ext.Button({
             id: 'btnExportarBanco',
             text: 'Exportar',
             tooltip: 'algo',
             icon: perfil.dirImg+'exportar.png',
             iconCls: 'btn'
         });

        this.fnRenderExportar = function(val){
             return '<center>'+val+'</center>';
         }
         */
        this.gpExportarcuenta = new Ext.grid.EditorGridPanel({
            //store: modelo.stExportarBanco,
            region: 'center',
            border: false,
            loadMask: {text: 'Cargando...'},
            width: 200,
            autoScroll: true,
            columns: [{header: 'id', dataIndex: 'id', width: 100, hidden: true, hideable: false},
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'cod_tipid',
                    header: 'COD_TIPID',
                    width: 80,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'cod_paexid',
                    header: 'COD_PAEXID',
                    width: 80,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'num_ideper',
                    header: 'NUM_IDEPER',
                    width: 100,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'apellido_1',
                    header: 'APELLIDO_1',
                    width: 100,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'apellido_2',
                    header: 'APELLIDO_2',
                    width: 100,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'nombre',
                    header: 'NOMBRE',
                    width: 100,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'nom_apell',
                    header: 'NOMBRE_APELL',
                    width: 100,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                }
            ],
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            })

        });

        this.winExportarCuenta = new Ext.Window({
            title: 'Exportar a .BDF',
            modal: true,
            height: 600,
            width: 800,
            constrain: true,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'border',
            items: [this.gpExportarcuenta]
        });
    }
};
