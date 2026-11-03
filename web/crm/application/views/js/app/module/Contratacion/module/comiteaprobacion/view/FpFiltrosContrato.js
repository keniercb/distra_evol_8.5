Ext.define('Comite.view.FpFiltrosContrato', {
    extend: 'Ext.form.Panel',
    alias: 'widget.fpfiltroscontrato',
    frame: false,
    margin: false,
    border: false,
    width: 270,
    resizable: false,
    style: {
        background: '#DFE9F6'
    },
    bodyStyle : {
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
    },
    initBody: function(){
        var me = this;

        me.nfNumero  = Ext.create('Ext.form.field.Text',{
            name: 'numero',
            hideTrigger: true,
            anchor: '100%',
            fieldLabel: me.etiquetas.lbnumero
        });

        me.tfNombre = Ext.create('Ext.form.field.Text',{
            fieldLabel: me.etiquetas.lbnombre,
            name: 'nombre',
            anchor: '100%',
            maxLength: 150
        });

        me.hfclienteproveedor = Ext.create('Ext.form.field.Hidden', {
            name: 'idclientesproveedores'
        });

        me.sfclienteproveedor = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbclienteproveedor,
            name: 'clienteproveedor',
            mapping: 'NomClienteproveedor.nombre',
            localId: 'idclientesproveedores',
            module: 'TipoContrato',
            noactions: true,
            anchor: '100%'
        });

        me.hfsector = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowsector',
            name: 'idsector'
        });

        me.sfsector = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbsector,
            name: 'sector',
            mapping: 'NomSector.denominacion',
            localId: 'idsector',
            module: 'Nomencladores',
            gen: 'm',
            filters: {},
            context: 'gestioncontratomainwindowsector',
            anchor: '100%'
        });

        me.hfarea = Ext.create('Ext.form.field.Hidden', {
            name: 'idarea'
        });

        me.cmbarea = Ext.create('GestionContrato.view.CmbArea', {
            fieldLabel: me.etiquetas.lbarea,
            localId: 'idarea',
            name: 'arearesponsable',
            anchor: '100%',
            emptyText: me.etiquetas.lbSeleccione
        });

        me.cmbarea.tree.on({
            beforecellmousedown: function(){
                this.findParentByType('menu').pressTreeCombo = true;
            },
            beforecontainermousedown: function(){
                this.findParentByType('menu').pressTreeCombo = true;
            },
            scope: me
        });

        me.items = [
            me.nfNumero,
            me.tfNombre,
            me.hfclienteproveedor,
            me.sfclienteproveedor,
            me.hfsector,
            me.sfsector,
            me.hfarea,
            me.cmbarea
        ];
    },
    initButtons: function(){
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnBuscar,
                iconCls: 'icondistra-buscar',
                tooltip: me.etiquetas.qtipBuscarContrato,
                action: 'buscar'
            },{
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
