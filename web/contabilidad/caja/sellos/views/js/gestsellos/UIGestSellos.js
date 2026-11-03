Ext.namespace('Ext.UIGestSellos');
Ext.UIGestSellos.ViewPort = Ext.extend(Ext.Viewport, {
    etiquetas: undefined,
    constructor: function(scope, params)
    {
        Ext.applyIf(this, {
            renderTo: document.body,
            layout: 'fit'
        });
        return Ext.UIGestSellos.ViewPort.superclass.constructor.call(this, params);
    }
});

Ext.UIGestSellos.PanelContenedor = Ext.extend(Ext.Panel, {
    constructor: function(scope)
    {
        Ext.applyIf(this, {
            layout: 'fit',
            border: false,
            region: 'center',
            tbar: this.fGetToolBar(scope),
            items: this.fGetGrid(scope)
        });
        return this;
    },
    fGetGridAntLiqSello: function(scope)
    {

        scope.menuAdicionarSello = new Ext.menu.Menu({
            text: scope.etiquetas.lbAdicionar,
            tooltip: scope.etiquetas.lbToolAdicionarSello,
            iconCls: 'adicionar',
            items: [
                scope.btnAdicionarAnticipo = new Ext.menu.Item({
                    text: scope.etiquetas.lbAdicionarAnticipo,
                    tooltip: scope.etiquetas.lbToolAdicionarAnticipo,
                    iconCls: 'clausulacrm'
                }),
                scope.btnAdicionarLiquidacion = new Ext.menu.Item({
                    text: scope.etiquetas.lbAdicionarLiquidacion,
                    tooltip: scope.etiquetas.lbToolAdicionarLiquidacion,
                    disabled: true,
                    hidden: true,
                    iconCls: 'cargadoacuenta'
                })]
        });

        scope.btnAdicionarSello = new Ext.Button({
            id:'AdicionarSello',
            tooltip: scope.etiquetas.lbToolAdicionarSello,
            text: scope.etiquetas.lbAdicionar,
            iconCls: 'adicionar',
            menu: scope.menuAdicionarSello
        });

        scope.btnModificarSello = new Ext.Button({
            id:'ModificarSello',
            tooltip: scope.etiquetas.lbToolModificarSello,
            text: scope.etiquetas.lbModificarSello,
            iconCls: 'modificar',
            disabled: true
        });

        scope.btnCancelarSello = new Ext.Button({
            id:'CancelarSello',
            tooltip: scope.etiquetas.lbToolCancelarSello,
            text: scope.etiquetas.lbCancelar,
            iconCls: 'cancelar',
            disabled: true
        });

        scope.btnConfirmarSello = new Ext.Button({
            id:'ConfirmarSello',
            tooltip: scope.etiquetas.lbToolConfirmarSello,
            text: scope.etiquetas.lbConfirmarSello,
            iconCls: 'confirmar',
            disabled: true
        });

        scope.btnPostearSello = new Ext.Button({
            id:'PostearSello',
            tooltip: scope.etiquetas.lbToolPostearSello,
            text: scope.etiquetas.lbPostearSello,
            iconCls: 'contabilidad',
            disabled: true
        });

        scope.btnLiquidarSello = new Ext.Button({
            id:'LiquidarSello',
            tooltip: scope.etiquetas.lbToolLiquidarSello,
            text: scope.etiquetas.lbLiquidarSello,
            iconCls: 'liquidar',
            disabled: true
        });

        scope.btnBusquedaAvanzadaSello = new Ext.Button({
            id:'BusquedaAvanzadaSello',
            tooltip: scope.etiquetas.lbToolBusquedaAvanzadaSello,
            text: scope.etiquetas.lbBusquedaAvanzadaSello,
            iconCls: 'buscar',
            disabled: true,
            hidden: true,
        });

        scope.compCmp = new Ext.Cmpaction;

        scope.columnModelSellos = new Ext.grid.ColumnModel([
            {header: scope.etiquetas.lbNumero, width: 100, dataIndex: 'numerodocumento', sortable: true, resizable: true},
            {header: scope.etiquetas.lbTipo, width: 100, dataIndex: 'tipo', sortable: true, resizable: true, hidden: true},
            {header: scope.etiquetas.lbTipoDocumento, width: 100, dataIndex: 'tipodoc', sortable: true, resizable: true},
            {header: scope.etiquetas.lbFecha, width: 100, dataIndex: 'fecha', sortable: true, resizable: true, renderer: 'erpFecha'},
            {header: scope.etiquetas.lbImporte, width: 100, dataIndex: 'importemo', sortable: true, resizable: true, renderer: 'usMoney'},
            {header: scope.etiquetas.lbTrabajador, width: 100, dataIndex: 'nompersona', sortable: true, resizable: true},
            {header: scope.etiquetas.lbEstado, width: 100, dataIndex: 'estadodoc', sortable: true, resizable: true},
            {header: scope.etiquetas.lbComentario, width: 100, dataIndex: 'comentario', sortable: false, resizable: true},
            scope.compCmp
        ]);

        scope.selModelSellos = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        scope.PagingToolBarSellos = new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: scope.stSellos,
            displayInfo: true,
            displayMsg: 'Resultados de {0} - {1} de {2}',
            emptyMsg: "No hay resultados para mostrar."
        });

        scope.tbarSellos = new Ext.Toolbar({
            hidden: false,
            items: [scope.btnAdicionarSello, scope.btnModificarSello, scope.btnCancelarSello, scope.btnConfirmarSello, scope.btnPostearSello, scope.btnLiquidarSello, scope.btnBusquedaAvanzadaSello]
        });

        scope.gridPanelSellos = new Ext.grid.GridPanel({
            id: 'idgridPanelSellos',
            title: scope.etiquetas.lbgridPanelSellos,
            autoExpanColunm: undefined,
            loadMask : true,
            width: Ext.lib.Dom.getViewWidth() * 0.50,
            cm: scope.columnModelSellos,
            store: scope.stSellos,
            sm: scope.selModelSellos,
            region: 'center',
            frame: false,
            border: true,
            split: true,
            // view: undefined,
            // autoExpandColumn: undefined,
            tbar: scope.tbarSellos,
            plugins: [scope.compCmp],
            bbar: scope.PagingToolBarSellos,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                ShowGroupName: true,
                enableRowBody: true,
                enableNoGroup: false,
                enableGropingMenu: true,
                hideGroupedColumn: true,
                // groupTextTpl: '{tipo} ({[values.rs.length]} {[values.rs.length > 1 ? "Fondos" : "Fondo"]})'
                groupTextTpl: '{[values.rs[0].data.nomtipo]}'
            })
        });

        return scope.gridPanelSellos;
    },
    fGetEntradaSello: function(scope)
    {
        scope.menuAdicionarEntradaSello = new Ext.menu.Menu({
            text: scope.etiquetas.lbAdicionar,
            tooltip: scope.etiquetas.lbToolAdicionarSello,
            iconCls: 'adicionar',
            items: [
                scope.btnAdicionarEntradaAnticipo = new Ext.menu.Item({
                    text: scope.etiquetas.lbAdicionarAnticipo,
                    tooltip: scope.etiquetas.lbToolAdicionarAnticipo,
                    iconCls: 'clausulacrm'
                }),
                scope.btnAdicionarEntradaDirecta = new Ext.menu.Item({
                    text: scope.etiquetas.lbAdicionarDirecta,
                    hidden: true,
                    disabled: true,
                    tooltip: scope.etiquetas.lbToolAdicionarDirecta,
                    iconCls: 'cargadoacuenta'
                })]
        });

        scope.btnAdicionarEntradaSello = new Ext.Button({
            id:'AdicionarEntradaSello',
            tooltip: scope.etiquetas.lbToolAdicionarEntrada,
            text: scope.etiquetas.lbAdicionar,
            iconCls: 'adicionar',
            menu: scope.menuAdicionarEntradaSello
        });

        scope.btnModificarEntrada = new Ext.Button({
            id:'ModificarEntrada',
            tooltip: scope.etiquetas.lbToolModificarEntrada,
            text: scope.etiquetas.lbModificarSello,
            iconCls: 'modificar',
            disabled: true
        });

        scope.btnCancelarEntrada = new Ext.Button({
            id:'CancelarEntrada',
            tooltip: scope.etiquetas.lbToolCancelarEntrada,
            text: scope.etiquetas.lbCancelar,
            iconCls: 'cancelar',
            disabled: true
        });

        scope.btnConfirmarEntrada = new Ext.Button({
            id:'ConfirmarEntrada',
            tooltip: scope.etiquetas.lbToolConfirmarEntrada,
            text: scope.etiquetas.lbConfirmarSello,
            iconCls: 'confirmar',
            disabled: true
        });

        scope.btnPostearEntrada = new Ext.Button({
            id:'PostearEntrada',
            tooltip: scope.etiquetas.lbToolPostearEntrada,
            text: scope.etiquetas.lbPostearSello,
            iconCls: 'contabilidad',
            disabled: true
        });


        scope.cbCuentaProveedorEntrada = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            allowBlank: false,
            // store: scope.stCuentaProveedorEntrada,
            valueField: 'idCuentaProveedorEntrada',
            displayField: 'CuentaProveedorEntrada',
            hiddenName: 'idCuentaProveedorEntrada',
            typeAhead: true,
            anchor: '100%',
            mode: 'local',
            pageSize: 20,
            minChars: 3,
            resizable: false,
            triggerAction: 'all',
        });

        scope.tbarEntrada = new Ext.Toolbar({
            hidden: false,
            items: [scope.btnAdicionarEntradaSello, scope.btnModificarEntrada, scope.btnCancelarEntrada, scope.btnConfirmarEntrada, scope.btnPostearEntrada]
        });

        scope.compCmpEntrada = new Ext.Cmpaction;

        scope.columnModelEntrada = new Ext.grid.ColumnModel([
            {header: scope.etiquetas.lbNumeroInstrumento, width: 100, dataIndex: 'numerodocumentoinst', sortable: true, resizable: true},
            {header: scope.etiquetas.lbFecha, width: 100, dataIndex: 'fecha', sortable: true, resizable: true, renderer: 'erpFecha'},
            {header: scope.etiquetas.lbImporte, width: 100, dataIndex: 'importemo', sortable: true, resizable: true, renderer: 'usMoney'},
            {header: scope.etiquetas.lbTipoEntrada, width: 100, dataIndex: 'tipoentrada', sortable: true, hidden: true, resizable: true},
            {header: scope.etiquetas.lbEstado, width: 100, dataIndex: 'estadodoc', sortable: true, resizable: true},
            scope.compCmpEntrada
        ]);

        scope.selModelEntrada = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        scope.pagingToolBarEntrada = new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: scope.stEntrada,
            displayInfo: true,
            displayMsg: 'Resultados de {0} - {1} de {2}',
            emptyMsg: "No hay resultados para mostrar."
        });

        scope.gridPanelEntrada = new Ext.grid.GridPanel({
            id: 'idgridPanelEntrada',
            title: scope.etiquetas.lbgridPanelEntrada,
            // autoExpanColunm: undefined,
            region : 'east',
            collapsible: true,
            width: Ext.lib.Dom.getViewWidth() * 0.25,
            split: true,
            loadMask : true,
            cm: scope.columnModelEntrada,
            store: scope.stEntrada,
            sm: scope.selModelEntrada,
            tbar: scope.tbarEntrada,
            bbar: scope.pagingToolBarEntrada,
            plugins: [scope.compCmpEntrada],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                ShowGroupName: true,
                enableRowBody: true,
                enableNoGroup: false,
                enableGropingMenu: true,
                hideGroupedColumn: true,
                // groupTextTpl: '{tipo} ({[values.rs.length]} {[values.rs.length > 1 ? "Fondos" : "Fondo"]})'
                //groupTextTpl: '{[values.rs[0].data.nomtipoentrada]}'
				groupTextTpl:'Entradas'
            })
        });

        return scope.gridPanelEntrada;

    },
    fGetGrid: function(scope)
    {
        return {
            region: 'center',
            layout: 'border',
            frame: false,
            border: true,
            items: [this.fGetGridAntLiqSello(scope), this.fGetEntradaSello(scope)]
        };
    },
    fGetToolBar: function(scope)
    {
        scope.lbProveedorEntrada = new Ext.form.Label({
            id: 'idProveedorEntrada',
            text: scope.etiquetas.lbProveedorEntrada,
            style: 'font-weight:bold;'
        });

        scope.cbProveedorEntrada = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            allowBlank: false,
            store: scope.stProveedorEntrada,
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            hiddenName: 'idclientesproveedores',
            typeAhead: true,
            anchor: '100%',
            mode: 'remote',
            pageSize: 20,
            minChars: 3,
            resizable: false,
            triggerAction: 'all',
            enableKeyEvents: true,
        });

        scope.tfFondoActual = new Ext.form.TextField({
            id: 'tfFondoActual',
            name: 'idfondo',
            allowBlank: false,
            anchor: '100%',
            maxLength: 100,
            editable: false,
            disabled: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.cbxCuentaProevedor = new Ext.contabilidad.util.linkedCombo({
            store: scope.stCuentaProveedorEntrada,
            fieldLabel: 'Cuenta',
            loaded: true,
            allowBlank: true,
            singleSelection: false,
            leafSelect: false,
            qtip: 'text',
            displayField: 'text',
            valueField: 'idcuenta',
            selectField: 'codigo',
            listHeight: 300,
            anchor: '98%'
        });

        scope.btnDefinirFondo = new Ext.Button({
            text: scope.etiquetas.lbFondo,
            tooltip: scope.etiquetas.lbTtpCajaFondo,
            iconCls: 'fondo'
        });

        scope.lbPeriodo = new Ext.form.Label({
            id: 'idPeriodo',
            text: 'Fecha contable: ??/??/????',
            style: 'font-weight:bold;'
        });

        scope.lbNombrePanel = new Ext.form.Label({
            id: 'idNombrePanel',
            text: scope.etiquetas.lbNombrePanel,
            style: 'font-weight:bold;'
        });

        return ['->', scope.lbProveedorEntrada, scope.cbProveedorEntrada, '-', scope.cbxCuentaProevedor, '-', scope.lbPeriodo, '-', scope.btnDefinirFondo, scope.tfFondoActual];
    }
});