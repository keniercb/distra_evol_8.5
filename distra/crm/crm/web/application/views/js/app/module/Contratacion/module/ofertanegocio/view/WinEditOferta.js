Ext.define('OfertaNegocio.view.WinEditOferta', {
    extend: 'Ext.window.Window',
    alias: 'widget.wineditoferta',
    frame: false,
    margin: false,
    border: false,
    width: 550,
    closable : true,
    closeAction: 'hide',
    modal: true,
    actionInsert: true,
    resizable: false,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.initBody();

        me.initButtons();

        me.callParent();

        Ext.TaskManager.start({
            run: this.checkWindow.bind(me),
            interval: 100,
            scope: this
        });
    },
    initBody: function(){
        var me = this;

        me.docAdicionales = Ext.create('OfertaNegocio.view.DocumentosAdicionales',{
            tabId: 'datosadicionales'
        });

        me.items = [{
            xtype: 'tabpanel',
            deferredRender: false,
            border:false,
            height: 400,
            items: [
                me.getFormDatosGenerales(),
                me.docAdicionales
            ]
        }];
    },
    getFormDatosGenerales: function(){
        var me = this;

        me.tfNombre = new Ext.form.field.Text({
            fieldLabel: me.etiquetas.lbNombre,
            name: 'nombre',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            regexText: me.etiquetas.validationOnlyAlphaSpacer,
            maxLength: 100,
            maxLengthText: me.etiquetas.validationMaxLength_100,
            allowBlank: false,
            blankText: me.etiquetas.vBlankText,
            anchor: '100%'
        });

        me.hfSolicitud = Ext.create('Ext.form.field.Hidden', {
            name: 'idsolicitud'
        });

        me.tfSolicitud = Ext.create('SolicitudNegocio.view.CbSolicitudNegocio',{
            fieldLabel: me.etiquetas.lbSolicitud,
            name: 'solicitud',
            localId: 'idsolicitud',
            allowBlank: false,
            blankText: me.etiquetas.vBlankText,
            anchor: '100%',
            emptyText: me.etiquetas.lbSeleccione
        });

        me.hfCliente = Ext.create('Ext.form.field.Hidden', {
            name: 'idclienteproveedor'
        });

        me.tfCliente = new Ext.form.field.Text({
            fieldLabel: me.etiquetas.lbCliente,
            name: 'clienteproveedor',
            readOnly: true,
            allowBlank: false,
            blankText: me.etiquetas.vBlankText,
            columnWidth: 0.6,
            margin: '0 10 0 0'
        });

        me.tfSector = new Ext.form.field.Text({
            fieldLabel: me.etiquetas.lbSector,
            name: 'sector',
            readOnly: true,
            allowBlank: false,
            blankText: me.etiquetas.vBlankText,
            columnWidth: 0.4
        });

        me.tfAreaResponsable = new Ext.form.field.Text({
            fieldLabel: me.etiquetas.lbAreaResponsable,
            name: 'arearesponsable',
            allowBlank: false,
            readOnly: true,
            blankText: me.etiquetas.vBlankText,
            anchor: '100%',
            //margin: '0 10 0 0'
        });

        me.tfResponsable = new Ext.form.field.Text({
            fieldLabel: me.etiquetas.lbResponsable,
            name: 'responsable',
            readOnly: true,
            blankText: me.etiquetas.vBlankText,
            columnWidth: 0.4
        });

        me.dffechaInicio = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaInicio,
            name: 'fechainicio',
            allowBlank: false,
            margin: '0 10 0 0',
            columnWidth: .3
        });

        me.dffechaFirma = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaFirma,
            name: 'fechafirma',
            margin: '0 10 0 0',
            columnWidth: .3
        });

        me.storeUnidadTiempo = Ext.create('Ext.data.Store', {
            fields: ['idunidadtiempo', 'denominacion'],
            data: [
                {"idunidadtiempo": 1, "denominacion": me.etiquetas.lbUTMonth},
                {"idunidadtiempo": 2, "denominacion": me.etiquetas.lbUTYear}
            ]
        });

        me.cbUnidadTiempo = Ext.create('Ext.form.ComboBox', {
            hideLabel: true,
            store: me.storeUnidadTiempo,
            queryMode: 'local',
            valueField: 'idunidadtiempo',
            displayField: 'denominacion',
            columnWidth: .15,
            name: 'unidadtiempo',
            editable: false,
            margin: '18 0 0 0',
            value: 1,
            allowBlank: false
        });

        me.nfvigencia = Ext.create('Ext.form.field.Number', {
            fieldLabel: me.etiquetas.lbVigencia,
            name: 'vigencia',
            columnWidth: .25,
            allowBlank: false,
            maxValue: 999,
            margin: '0 10 0 0',
            minValue: 1,
            allowDecimals: false,
            allowExponential: false,
            nanText: me.etiquetas.msgErrorValorVigencia,
            maxText: me.etiquetas.msgErrorValorVigencia,
            minText: me.etiquetas.msgErrorValorVigencia
        });

        me.hfMedioPago = Ext.create('Ext.form.field.Hidden', {
            name: 'idmediopago'
        });

        me.sfMedioPago = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbMedioPago,
            name: 'mediopago',
            mapping: 'NomMedioPago.nombre',
            localId: 'idmediopago',
            module: 'Nomencladores',
            noactions: false,
            allowBlank: true,
            columnWidth: 0.4,
            margin: '0 10 0 0',
            context: 'gestioncontratomainwindowmediopago',
            filters: {},
            controller: 'gestioncontratomainwindow'
        });

        me.storeCondicionPago = this.store = Ext.create('Ext.data.Store', {
            pageSize: 10,
            fields: [
                {name:'idcondicionpago',mapping:'idterminodepago'},
                {name: 'nombre'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getCondicionesPago'}, ModuleMgr.get('GestionContrato')),
                reader: {
                    idProperty: 'idcondicionpago',
                    type: 'json',
                    root: 'data',
                    totalProperty: 'count'
                }
            }
        });

        me.hfCondicionPago = Ext.create('Ext.form.field.Hidden', {
            name: 'idcondicionpago'
        });

        me.condicionPago = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbCondicionPago,
            autoExpand: false,
            store: me.storeCondicionPago,
            valueField: 'nombre',
            displayField: 'nombre',
            name: 'condicionpago',
            columnWidth: .4,
            minChars:0,
            pageSize:10,
            mode:'remote',
            margin: '0 10 0 0',
            queryParam:'denominacion',
            localId:'idcondicionpago'
        });

        // me.nfMontoTotal = Ext.create('Ext.form.field.Number', {
        me.nfMontoTotal = Ext.create('Ext.ux.MoneyField', {
            fieldLabel: me.etiquetas.lbMontoTotal,
            name: 'montototal',
            columnWidth: .2,
            allowBlank: false,
            maxValue: 999999,
            minValue: 1,
            allowDecimals: false,
            allowExponential: false,
            nanText: me.etiquetas.msgErrorValorMontoTotal,
            maxText: me.etiquetas.msgErrorValorMontoTotal,
            minText: me.etiquetas.msgErrorValorMontoTotal
        });

        me.tADescripcion = new Ext.form.field.TextArea({
            fieldLabel: me.etiquetas.lbDescripcion,
            name: 'descripcion',
            anchor: '100%'
        });

        return {
            title: me.etiquetas.lbTitleTabDatosGenerales,
            xtype: 'form',
            tabId: 'datosgenerales',
            bodyStyle : {
                padding: '5px 10px 10px 10px',
                background: '#DFE9F6'
            },
            fieldDefaults: {labelAlign: 'top'},
            items: [
                me.tfNombre,
                {xtype: 'hidden', name: 'idoferta', value: 0},
                {xtype: 'hidden', name: 'idespaciotrabajo', value: 0},
                me.hfSolicitud,
                me.tfSolicitud,
                {
                    layout: 'column',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [
                        me.hfCliente, me.tfCliente, me.tfSector
                    ]
                },me.tfAreaResponsable,{
                    layout: 'column',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [
                        me.dffechaInicio, me.dffechaFirma, me.nfvigencia, me.cbUnidadTiempo
                    ]
                },{
                    layout: 'column',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [
                        me.hfMedioPago, me.sfMedioPago,
                        me.hfCondicionPago, me.condicionPago,
                        me.nfMontoTotal
                    ]
                },
                me.tADescripcion
            ]
        };
    },
    initButtons: function(){
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                action: 'cerrar'
            },{
                text: me.etiquetas.lbBtnApply,
                iconCls: 'icondistra-aplicar',
                tooltip: me.etiquetas.qtipApply,
                disabled: true,
                action: 'aplicar'
            },{
                text: me.etiquetas.lbBtnAccept,
                iconCls: 'icondistra-aceptar',
                tooltip: me.etiquetas.qtipAccept,
                disabled: true,
                action: 'aceptar'
            }
        ];
    },
    initState: function(){
        var me = this;
        me.setTitle( me.etiquetas[(me.actionInsert)?'titleWinAdicionarOferta':'titleWinModificarOferta'] );
        me.down('button[action=aplicar]').setVisible(me.actionInsert);
        me.items.first().setActiveTab(0);
    },
    resetComponents: function(){
        var me = this,
            formDG = me.down('form[tabId=datosgenerales]'),
            formDA = me.down('form[tabId=datosadicionales]');

        formDG.getForm().reset();
        formDA.removeAllRow();
        formDA.insertRow();
        formDG.down('field:first').focus(false, 500);
    },
    loadValues: function(val){
        var me = this,
            formDG = me.down('form[tabId=datosgenerales]'),
            formDA = me.down('form[tabId=datosadicionales]');
        
        formDG.getForm().loadRecord(val);
        formDA.loadDocuments(val.get('docadicionales'));

        me.cbUnidadTiempo.setValue(parseInt(val.get('unidadtiempo')));
        me.tfSolicitud.setValue(val.get('idsolicitud'), val.get('solicitud'));
    },
    getValues: function(){
        var me = this,
            values;

        values = me.down('form').getForm().getValues();

        return  values;
    },
    setActionInsert: function(action){
        this.actionInsert = !!action;
    },
    getActionInsert: function(){
        return this.actionInsert;
    },
    show:function(){
        var me = this;

        me.initState();

        me.callParent();

        me.resetComponents();
    },
    checkWindow: function () {
        var me= this,
            formDG = me.down('form[tabId=datosgenerales]').getForm(),
            formDA = me.down('form[tabId=datosadicionales]').getForm(),
            invalid = formDG.hasInvalidField() || formDA.hasInvalidField();
            
        me.down('button[action=aplicar]').setDisabled(invalid);
        me.down('button[action=aceptar]').setDisabled(invalid);
    }
});
