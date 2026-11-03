Ext.define('SolicitudNegocioImportacion.view.CbSolicitudNegocio', {
    extend: 'Ext.form.field.Trigger',
    editable: false,
    initComponent: function () {
        var me = this;

        me.etiquetas = Ext.create('SolicitudNegocioImportacion.language.es').config;

        me.initWinSelectSolicitud();

        me.initGridEvents();

        this.callParent();
    },
    onTriggerClick: function() {
        this.winselect.show();
    },
    initWinSelectSolicitud: function(){
        var me = this;

        me.initGpSolicitud();

        me.winselect = new Ext.window.Window({
            title: me.etiquetas.titleSelectSolicitudAprobada,
            frame: false,
            margin: false,
            border: false,
            width: 700,
            height: 400,
            closable : true,
            closeAction: 'hide',
            modal: true,
            resizable: false,
            layout:'fit',
            items: me.gpSolicitud
        });
    },
    initGpSolicitud: function(){
        var me = this;

        me.menu = new Ext.menu.Menu({
            plain: true,
            pressTreeCombo: false,
            listeners:{
                beforehide: function(comp){
                    if(comp.pressTreeCombo){
                        comp.pressTreeCombo = false;
                        return false;
                    }
                }
            },
            items: [me.getConfigFormFiltros()]
        });

        me.storeSolicitud = Ext.create('SolicitudNegocioImportacion.store.SolicitudNegocio');

        me.gpSolicitud = new Ext.grid.Panel({
            store :  me.storeSolicitud,
            tbar: ['->', {
                text: me.etiquetas.lbBtnFiltrar,
                iconCls: 'icondistra-filtrar',
                action: 'filtrar',
                menu: me.menu
            }],
            dockedItems : [
                {
                    xtype: 'pagingtoolbar',
                    store:  me.storeSolicitud,
                    dock: 'bottom',
                    pageNumb: true,
                    displayInfo: true
                }
            ],
            columns:[
                {
                    text: me.etiquetas.lbNumeroSolicitud,
                    sortable: false,
                    align: 'center',
                    fixed: true,
                    width: 100,
                    dataIndex: 'idsolicitud'
                },{
                    text: me.etiquetas.lbFieldNombre,
                    sortable: false,
                    flex: 1,
                    dataIndex: 'nombre'
                },{
                    text: me.etiquetas.lbFieldCliente,
                    sortable: false,
                    flex: 1,
                    dataIndex: 'clienteproveedor'
                },{
                    text: me.etiquetas.lbSector,
                    sortable: false,
                    align: 'center',
                    fixed: true,
                    width: 100,
                    dataIndex: 'sector'
                },{
                    text: me.etiquetas.lbAreaResponsable,
                    sortable: false,
                    flex: 1,
                    dataIndex: 'arearesponsable'
                },{
                    text: me.etiquetas.lbFechaCreacion,
                    sortable: false,
                    align: 'center',
                    fixed: true,
                    width: 100,
                    dataIndex: 'fechacreada'
                },{
                    text: me.etiquetas.lbEstado,
                    sortable: false,
                    align: 'center',
                    fixed: true,
                    width: 100,
                    dataIndex: 'estado'
                }
            ]
        });
    },
    getConfigFormFiltros: function() {
        var me = this;

        me.nfNumeroSolicitud = Ext.create('Ext.form.field.Number', {
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
            maxLengthText: me.etiquetas.validationMaxLength_150
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
            anchor: '100%',
            listeners:{
                select: me.selectCombo,
                change: me.changeCombo,
                scope: me
            }
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
            anchor: '100%',
            listeners:{
                select: me.selectCombo,
                change: me.changeCombo,
                scope: me
            }
        });

        me.hfarea = Ext.create('Ext.form.field.Hidden', {
            name: 'idarea'
        });

        me.cmbarea = Ext.create('GestionContratoImportacion.view.CmbArea', {
            fieldLabel: me.etiquetas.lbAreaResponsable,
            localId: 'idarea',
            name: 'arearesponsable',
            anchor: '100%',
            emptyText: me.etiquetas.lbSeleccione,
            listeners:{
                select: me.selectCombo,
                change: me.changeCombo,
                scope: me
            }
        });

        me.cmbarea.tree.on({
            beforecellmousedown: function () {
                me.menu.pressTreeCombo = true;
            },
            beforecontainermousedown: function () {
                me.menu.pressTreeCombo = true;
            },
            scope: me
        });

        return {
            xtype: 'form',
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
            items : [
                me.nfNumeroSolicitud,
                me.tfNombre,
                me.hfclienteproveedor,
                me.sfclienteproveedor,
                me.hfsector,
                me.sfsector,
                me.hfarea,
                me.cmbarea
            ],
            buttons : [
                {
                    text: me.etiquetas.lbBtnBuscar,
                    iconCls: 'icondistra-buscar',
                    tooltip: me.etiquetas.qtipBuscar,
                    action: 'buscar',
                    handler: me.filtrarSolicitudes,
                    scope: me
                },{
                    text: me.etiquetas.lbBtnLimpiar,
                    iconCls: 'icondistra-limpiar',
                    tooltip: me.etiquetas.qtipLimpiarFiltros,
                    action: 'limpiar',
                    handler: me.limpiarFiltrosSolicitudes,
                    scope: me
                }]
        };
    },
    initGridEvents: function(){
        var me = this;

        me.winselect.on('show', function(){
            me.limpiarFiltrosSolicitudes();
        }, me);

        me.gpSolicitud.on('select', function(select, record){
            me.setValue(record.get('idsolicitud'), record.get('nombre'));
            me.fireEvent('selectSolicitud', record);
            me.winselect.hide();
        }, me);
    },
    selectCombo: function (combo, records) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);
        if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.localId]);
        }
    },
    changeCombo: function (combo, value) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);
        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
    },
    filtrarSolicitudes: function(){
        var me = this,
            values = me.menu.items.first().getForm().getValues(),
            filters = [];

        me.storeSolicitud.clearFilter(true);
        for(i in values){
            if(!Ext.isEmpty(values[i]))
                filters.push({property:i, value: values[i]});
        }
        me.storeSolicitud.addFilter(filters);
    },
    limpiarFiltrosSolicitudes: function(){
        var me = this;
        me.menu.items.first().getForm().reset();
        me.storeSolicitud.removeAll();
        me.storeSolicitud.clearFilter();
    },
    setValue: function(idsolicitud, nombre){
        if(idsolicitud && nombre)
            this.callParent(["#"+idsolicitud+" "+nombre]);
        else
            this.callParent(arguments);
    }
});