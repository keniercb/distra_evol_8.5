Ext.define('Segmentacion.view.WindowSegmentacion', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.WindowSegmentacion',

    autoScroll: true,
    maximizable: true,
    //layout: 'column',

    initComponent: function () {
        this.createInitialConfig();
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);


        me.height = 550;
        me.width = 710;

        me.segmentacion = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbNombre,
            name: 'segmentacion',
            allowBlank: false,
            columnWidth: 1,
            flex: 1
        });
        me.descripcion = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: me.etiquetas.lbDescripcion,
            name: 'descripcion',
            columnWidth: 1,
            height: 115,
            margin: '0 0 5 0',
            flex: 1
        });
        me.storeDG = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: [
                {"value": "tipocliente", "name": me.etiquetas.lbTipoCliente},
                {"value": "nombre", "name": me.etiquetas.lbNombre},
                {"value": "codigo", "name": me.etiquetas.lbCodigo},
                {"value": "abreviatura", "name": me.etiquetas.lbAbreviatura},
                {"value": "correo", "name": me.etiquetas.lbCorreo},
                {"value": "telefono", "name": me.etiquetas.lbTelefono},
                {"value": "direccion", "name": me.etiquetas.lbDireccion},
                {"value": "nombreusuario", "name": me.etiquetas.lbUsuario},
            ]
        });
        me.datosGenerales = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbDatosGenerales,
            store: me.storeDG,
            context: 'datosGenerales',
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            columnWidth: 1,
            flex: 1
        });
        me.storeC = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: [
                {"value": "numerocuenta", "name": me.etiquetas.lbNumeroCuenta},
                {"value": "nombrecuenta", "name": me.etiquetas.lbNombreCuenta},
                {"value": "nombrebanco", "name": me.etiquetas.lbNombreBanco},
                {"value": "numerosucursal", "name": me.etiquetas.lbNumeroSucursal},
                {"value": "codigoiso", "name": me.etiquetas.lbCodigoISO},
                {"value": "predeterminado", "name": me.etiquetas.lbPredeterminada},
            ]
        });
        me.datosContables = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbDatosContables,
            store: me.storeC,
            context: 'datosContables',
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            columnWidth: 1,
            flex: 1
        });
        me.storeCP = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: [
                {"value": "codigoiso", "name": me.etiquetas.lbCodigoISO},
                {"value": "nombrecuenta", "name": me.etiquetas.lbNombreCuenta},
                {"value": "nombclasificacion", "name": me.etiquetas.lbClasificacion},
            ]
        });
        me.cobrosPagos = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbCobrosPagos,
            store: me.storeCP,
            context: 'cobrosPagos',
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            columnWidth: 1,
            flex: 1
        });
        me.hfpregunta = Ext.create('Ext.form.field.Hidden', {
            name: 'idpregunta'
        });
        me.cmbPregunta = Ext.create('Ext.ux.CmbSelectField', {
            name: 'pregunta',
            fieldLabel: me.etiquetas.lbPregunta,
            mapping: 'NomPreguntaperfil.pregunta',
            localId: 'idpregunta',
            module: 'NomClienteProveedor',
            noactions: true,
            columnWidth: 1,
            margin: '0 0 5 0',
            forceSelection: true,
            context: 'segmentacionwindowpregunta',
            /*filters: {
             idtipo: 1,
             idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun
             },*/
            //controller: 'perfilesclientesmainwindow'
        });
        me.fieldsetDG = Ext.create('Ext.form.FieldSet', {
            title: me.etiquetas.lbDatosGenerales,
            items: [],
        });
        me.fieldsetC = Ext.create('Ext.form.FieldSet', {
            title: me.etiquetas.lbDatosContables,
            items: [],
        });
        me.fieldsetCP = Ext.create('Ext.form.FieldSet', {
            title: me.etiquetas.lbCobrosPagos,
            items: [],
        });
        me.fieldsetP = Ext.create('Ext.form.FieldSet', {
            title: me.etiquetas.lbPregunta,
            items: [],
        });
        me.myfieldset = Ext.create('Ext.form.FieldSet', {
            title: me.etiquetas.lbSegmentacion,
            bodyStyle: 'background:#DFE9F6;',
            columnWidth: 1,
            border: true,
            layout: 'column',
            defaults: {
                anchor: '99%',
                margin: '0 5 5 5',
                columnWidth: 1,
                bodyStyle: 'background:#DFE9F6;',
                border: true,
                layout: 'column',
            },
            items: [me.fieldsetDG, me.fieldsetC, me.fieldsetCP, me.fieldsetP],
        });
        me.customForm = Ext.create('Ext.ux.CustomForm', {
            bodyStyle: 'background:#DFE9F6;',
            action: 'add',
            layout: 'column',
            items: {
                bodyStyle: 'background:#DFE9F6;',
                columnWidth: 1,
                layout: 'column',
                defaults: {
                    anchor: '99%',
                    margin: '5'
                },
                items: [{
                    xtype: 'fieldset',
                    title: me.etiquetas.lbIdentificarSegmentacion,
                    bodyStyle: 'background:#DFE9F6;',
                    columnWidth: 0.5,
                    border: true,
                    layout: 'column',
                    items: [me.segmentacion, me.descripcion]
                }, {
                    xtype: 'fieldset',
                    title: me.etiquetas.lbSegmentarPor,
                    bodyStyle: 'background:#DFE9F6;',
                    columnWidth: 0.5,
                    border: true,
                    layout: 'column',
                    items: [me.datosGenerales, me.datosContables, me.cobrosPagos, me.hfpregunta, me.cmbPregunta]
                }, me.myfieldset]
            }
        });
        me.items = [me.customForm];

    }
});
