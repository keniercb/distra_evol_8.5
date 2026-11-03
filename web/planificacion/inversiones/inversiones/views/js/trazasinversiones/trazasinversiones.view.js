Ext.ns('Gestionar.trazasinversiones');
var window_general_inversiones;
var esta = false;
Gestionar.trazasinversiones.Vista = {
    init: function(idioma, modelo) {
        _this = this;
        _this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando...'/*,
            removeMask: false*/
        });
        _this.btnAyudatraza = new Ext.Button({
            id: 'idbtnAyudatraza',
            text: idioma.btnAyudainversiones,
            icon: perfil.dirImg + 'ayuda.png',
            tooltip: perfil.toolTipAyudainversiones,
            iconCls: 'ayuda'
        });
//        
        _this.btnLimpiar = new Ext.Button({
            text: idioma.btnLimpiarinversiones,
            tooltip: idioma.toolTipLimpiarinversiones,
            iconCls: 'limpiar'
        });
        
         _this.btnEliminarTrazas = new Ext.Button({
            //text: idioma.btnEliminar,
            tooltip: idioma.btnEliminarTraza,
            icon: perfil.dirImg + 'server.png',
            iconCls: 'eliminar',
            disabled: true
        });

        _this.ptTrazasInversiones = new Ext.PagingToolbar({
            pageSize: 1000,
            width: screen.width - 35,
            store: modelo.stTrazasInversiones,
            displayInfo: true,
            items: ['-', _this.btnLimpiar],
            listeners: {
                beforechange: function (p, e) {
                    paginado = e.start;
                }
            }

        });
        _this.filtrosinversiones = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'denominacion'

                },{
                    type: 'string',
                    dataIndex: 'estructura'
                },{
                    type: 'string',
                    dataIndex: 'inversion'
                },{
                    dataIndex: 'accion',
                    type: 'listado',
                    idcombo: 'filtroaccion',
                    urlcb: 'listarComboAccionesTraza',
                    idstore: 'idaccion',
                    valueFieldcb: 'accion',
                    displayFieldcb: 'accion',
                    tpl: '<tpl for="."><div ext:qtip="{accion}" class="x-combo-list-item">{accion}</div></tpl>'
                },{
                    type: 'string',
                    dataIndex: 'usuario'
                },{
                    type: 'string',
                    dataIndex: 'descripcion'
                }

            ]

        });
        _this.smTrazasInversiones = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        _this.cmTrazasInversiones = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {header: idioma.org, tooltip: idioma.org, width: 150, sortable: true, dataIndex: 'estructura', renderer: crearToolTip},
            {header: idioma.inv, tooltip: idioma.inv, width: 150, sortable: true, dataIndex: 'inversion', renderer: crearToolTip},
            {header: idioma.cmp, tooltip: idioma.cmp, width: 150, sortable: true, dataIndex: 'componente', renderer: crearToolTip},
            {header: idioma.tab, tooltip: idioma.tab, width: 150, sortable: true, dataIndex: 'tabla', renderer: crearToolTip},
            {header: idioma.idinv, tooltip: idioma.idtab, width: 150, sortable: true, dataIndex: 'idinversion', renderer: crearToolTip},
            {header: idioma.acc, tooltip: idioma.acc, width: 150, sortable: true, dataIndex: 'accion', renderer: crearToolTip},
            {header: idioma.user, tooltip: idioma.user, width: 150, sortable: true, dataIndex: 'usuario', renderer: crearToolTip},
            {header: idioma.fech, tooltip: idioma.fech, width: 150, sortable: true, dataIndex: 'fecha', renderer: crearToolTip},
            {header: idioma.denom, tooltip: idioma.denom, width: 350, sortable: true, dataIndex: 'denominacion', renderer: crearToolTip},
            {header: idioma.des, tooltip: idioma.des, width: 350, sortable: true, dataIndex: 'descripcion', renderer: crearToolTip, id: 'expandir',}
        ]);
        _this.gpTrazasinversiones = new Ext.grid.GridPanel({
            frame: true,
            border: false,
//            title: idioma.gridtituloGestionarinversiones,
//            height: 550,,
            autoExpandColumn: 'expandir',
            region: 'center',
            store: modelo.stTrazasInversiones,
            loadMask: {store: modelo.stTrazasInversiones},
            sm: _this.smTrazasInversiones,
            cm: _this.cmTrazasInversiones,
            plugins: _this.filtrosinversiones,
            tbar: [_this.btnEliminarTrazas, /*this.btn_adicionar_inversiones, this.btn_modificar_inversiones, this.btn_eliminar_inversiones, _this.btnMenuAsociacion,*/ '->', this.btnAyudatraza],
            bbar: [_this.ptTrazasInversiones]

        });
        _this.trazasInversiones = new Ext.Viewport({
            layout: 'fit',
            items: [_this.gpTrazasinversiones]


        });

        function crearToolTip(v, m) {
            m.attr = 'ext:qtip="' + v + '"';
            return v;
        }
    }
};