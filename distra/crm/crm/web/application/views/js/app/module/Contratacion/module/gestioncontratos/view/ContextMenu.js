Ext.define('GestionContrato.view.ContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.gridContractContextMenu',

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        var itemsCliente = [
            {
                text: me.etiquetas.lbContratoMarco,
                width: 150,
                tipocontrato: 'contratoMarco',
                gridcontract: true,
                iconCls: 'noevaluado'
            }, {
                text: me.etiquetas.lbNuevoContrato,
                width: 150,
                tipocontrato: 'contrato',
                gridcontract: true,
                iconCls: 'nuevo'
            }
        ];

        var itemsProveedor = [
            {
                text: me.etiquetas.lbContratoMarco,
                width: 150,
                tipocontrato: 'contratoMarco',
                gridcontract: true,
                iconCls: 'noevaluado'
            }, {
                text: me.etiquetas.lbNuevoContrato,
                width: 150,
                tipocontrato: 'contrato',
                gridcontract: true,
                iconCls: 'nuevo'
            }
        ];

        me.clienteMenu = {
            plain: true,
            defaults: {
                context: 'cliente',
                action: 'add'
            },
            items: itemsCliente
        };

        me.proveedorMenu = {
            plain: true,
            defaults: {
                context: 'proveedor',
                action: 'add'
            },
            items: itemsProveedor
        };

        me.menu = {
            plain: true,
            style: {
                overflow: 'visible'
            },
            items: [
                {
                    text: me.etiquetas.lbContratoCliente,
                    hideOnClick: false,
                    menu: me.clienteMenu,
                    iconCls: 'perfilusuario'
                }, {
                    text: me.etiquetas.lbContratoProveedor,
                    hideOnClick: false,
                    menu: me.proveedorMenu,
                    iconCls: 'servicio'
                }
            ]
        };

        me.btnAdd = {
            iconCls: 'adicionar',
            selector: 'btnAdd',
            hidden: true,
            text: me.etiquetas.lbAdd,
            tooltip: me.etiquetas.qtipAddContrato,
            menu: me.menu
        };

        me.btnMod = {
            iconCls: 'modificar',
            action: 'edit',
            disabled: true,
            gridcontract: true,
            selector: 'btnAdd',
            hidden: true,
            text: me.etiquetas.lbBtnMod,
            tooltip: me.etiquetas.qtipModificar
        };

        me.btnDel = {
            iconCls: 'eliminar',
            action: 'del',
            disabled: true,
            gridcontract: true,
            selector: 'btnAdd',
            hidden: true,
            text: me.etiquetas.lbBtnDel,
            tooltip: me.etiquetas.qtipEliminar
        };

        me.btnCreateSupl = {
            iconCls: 'duplicar',
            action: 'createsupl',
            disabled: true,
            selector: 'btnAdd',
            hidden: true,
            gridcontract: true,
            text: me.etiquetas.lbCreateSuplement,
            tooltip: me.etiquetas.qtipSuplement
        };

        me.btnPrint = {
            iconCls: 'imprimir',
            action: 'print',
            //disabled: true,
            gridcontract: true,
            text: me.etiquetas.lbBtnPrint,
            hidden: true,
            tooltip: me.etiquetas.qtipSuplement
        };

        me.btnHistorial = {
            iconCls: 'historial',
            action: 'createRecord',
            disabled: true,
            //hidden: true,
            selector: 'btnAdd',
            gridcontract: true,
            text: me.etiquetas.lbHist,
            tooltip: me.etiquetas.qtipHistoric
        };

        me.btnVerOferta={
            iconCls: 'detalles',
            action: 'detallesoferta',
            disabled: true,
            //hidden: true,
            selector: 'btnAdd',
            gridcontract: true,
            text: 'Detalles oferta',
            tooltip: 'Ver detalles de oferta asociada'
        };
        me.items = [
            me.btnAdd, me.btnMod, me.btnDel, '-', me.btnCreateSupl, me.btnHistorial, me.btnVerOferta
        ];

        this.callParent();
    }

});