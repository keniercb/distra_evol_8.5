Ext.define('Reclamaciones.view.FpFiltrosReclamacion', {
    extend: 'Ext.form.Panel',
    alias: 'widget.fpfiltrosreclamacion',
    frame: false,
    margin: false,
    border: false,
    width: 270,
    resizable: false,
    style: {
        background: '#DFE9F6'
    },
    bodyStyle: {
        padding: '5px 10px 10px 10px',
        background: '#DFE9F6'
    },
    fieldDefaults: {labelAlign: 'top'},
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.initBody();

        me.initButtons();

        me.callParent();

        // Ext.TaskManager.start({
        //     run: this.checkWindow.bind(me),
        //     interval: 100,
        //     scope: this
        // });
    },
    initBody: function () {
        var me = this;

        me.nfNumeroReclamacion = Ext.create('Ext.form.field.Number', {
            name: 'idreclamaciones',
            hideTrigger: true,
            anchor: '40%',
            fieldLabel: me.etiquetas.lbNumeroReclamacion,
            allowDecimals: false,
            allowNegative: false,
            maxValue: 10000,
            maxText: me.etiquetas.validationMaxMinValueNoReclamacion,
            minValue: 1,
            minText: me.etiquetas.validationMaxMinValueNoReclamacion,
            invalidText: me.etiquetas.validationMaxMinValueNoReclamacion,
        });

        me.tfNombre = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbFieldNombre,
            name: 'nombre',
            anchor: '100%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ,\(-.\)]+(\d*)?)+$/,
            regexText: me.etiquetas.validationNombreReclamacion,
            maxLength: 150,
            maxLengthText: me.etiquetas.validationMaxLength_150,
        });

        me.hfclienteproveedor = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowclienteproveedor',
            name: 'idclientesproveedores'
        });

        me.sfclienteproveedor = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbFieldCliente,
            name: 'clienteproveedor',
            mapping: 'NomClienteproveedor.nombre',
            localId: 'idclientesproveedores',
            module: 'TipoContrato',
            noactions: true,
            context: 'gestioncontratomainwindowclienteproveedor',
            filters: {
                idtipo: me.context == 1 ? 1 : 2,
                idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun
            },
            controller: 'gestioncontratomainwindow',
            anchor: '100%'
        });

        me.items = [
            me.nfNumeroReclamacion,
            me.tfNombre,
            me.hfclienteproveedor,
            me.sfclienteproveedor,
        ];
    },
    initButtons: function () {
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnBuscar,
                iconCls: 'icondistra-buscar',
                tooltip: me.etiquetas.qtipBuscar,
                action: 'buscar'
            }, {
                text: me.etiquetas.lbBtnLimpiar,
                iconCls: 'icondistra-limpiar',
                tooltip: me.etiquetas.qtipLimpiarFiltros,
                action: 'limpiar'
            }
        ];
    },
    checkWindow: function () {
        // var me= this,
        //     form = me.down('form').getForm(),
        //     invalid = form.hasInvalidField();
        //
        // me.down('button[action=aplicar]').setDisabled(invalid);
        // me.down('button[action=aceptar]').setDisabled(invalid);
    }
});
