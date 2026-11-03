Ext.define('SolicitudNegocioImportacion.view.FpFiltrosSolicitud', {
    extend: 'Ext.form.Panel',
    alias: 'widget.fpfiltrossolicitudimportacion',
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

        // Ext.TaskManager.start({
        //     run: this.checkWindow.bind(me),
        //     interval: 100,
        //     scope: this
        // });
    },
    initBody: function(){
        var me = this;

        me.nfNumeroSolicitud  = Ext.create('Ext.form.field.Number',{
            name: 'idsolicitud',
            hideTrigger: true,
            anchor: '40%',
            fieldLabel: me.etiquetas.lbNumeroSolicitud,
            allowDecimals: false,
            allowNegative: false,
            maxValue: 10000,
            maxText: me.etiquetas.validationMaxMinValueNoSolicitud,
            minValue: 1,
            minText: me.etiquetas.validationMaxMinValueNoSolicitud,
            invalidText: me.etiquetas.validationMaxMinValueNoSolicitud,
        });

        me.tfNombre = Ext.create('Ext.form.field.Text',{
            fieldLabel: me.etiquetas.lbFieldNombre,
            name: 'nombre',
            anchor: '100%',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ,\(-.\)]+(\d*)?)+$/,
            regexText: me.etiquetas.validationNombreSolicitud,
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

        me.hfsector = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowsector',
            name: 'idsector'
        });

        me.sfsector = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbFieldSector,
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

        me.cmbarea = Ext.create('GestionContratoImportacion.view.CmbArea', {
            fieldLabel: me.etiquetas.lbAreaResponsable,
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

        me.cbEstado = Ext.create('Ext.form.field.ComboBox',{
            fieldLabel: me.etiquetas.lbEstado,
            validateOnBlur: true,
            enableKeyEvents: true,
            multiSelect: false,
            queryMode: 'local',
            name: 'idestado',
            listEmptyText: 'No existen datos que mostrar.',
            displayField: 'denominacion',
            valueField: 'idestado',
            anchor: '100%',
            store: Ext.create('SolicitudNegocioImportacion.store.Estados')
        });

        me.items = [
            me.nfNumeroSolicitud,
            me.tfNombre,
            me.hfclienteproveedor,
            me.sfclienteproveedor,
            me.hfsector,
            me.sfsector,
            me.hfarea,
            me.cmbarea,
            me.cbEstado
        ];
    },
    initButtons: function(){
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnBuscar,
                iconCls: 'icondistra-buscar',
                tooltip: me.etiquetas.qtipBuscar,
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
