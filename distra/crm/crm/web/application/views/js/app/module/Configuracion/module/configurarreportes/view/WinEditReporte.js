Ext.define('Reportes.view.WinEditReporte', {
    extend: 'Ext.window.Window',
    alias: 'widget.wineditreporte',
    frame: false,
    margin: false,
    border: false,
    width: 350,
    closable: true,
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

        me.formReporte.on('validitychange', function (form, valid) {
            me.down('button[action=aplicar]').setDisabled(!valid);
            me.down('button[action=aceptar]').setDisabled(!valid);
        }, me);
    },
    initBody: function () {
        var me = this;

        var storeTipoContenido = Ext.create('Ext.data.ArrayStore', {
            fields: ['tipocontenido', 'denominacion'],
            data: [
                [1, me.etiquetas.reportContentTypeServerFile],
                [2, me.etiquetas.reportContentTypeJasperFile],
                [3, me.etiquetas.reportContentTypeComponent],
                [4, me.etiquetas.reportContentTypeReportServerFile]
            ]
        });

        me.formReporte = Ext.create('Ext.form.Panel', {
            border: false,
            bodyStyle: {padding: '10px 10px 10px 10px'},
            frame: true,
            fieldDefaults: {
                labelAlign: 'top'
            },
            layout: 'form',
            items: [{
                layout: 'column',
                border: false,
                bodyStyle: 'background:#DFE9F6;',
                items: [
                    {
                        xtype: 'textfield',
                        columnWidth: 0.7,
                        fieldLabel: me.etiquetas.lbDenominacion,
                        name: 'denominacion',
                        anchor: '90%',
                        margin: '0 10 0 0',
                        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
                        regexText: me.etiquetas.validationOnlyAlphaSpacer,
                        maxLength: 150,
                        maxLengthText: me.etiquetas.validationMaxLength_150,
                        allowBlank: false,
                        blankText: me.etiquetas.vBlankText,
                    }, {
                        xtype: 'checkbox',
                        name: 'agrupador',
                        columnWidth: 0.3,
                        inputValue: 1,
                        uncheckedValue: 0,
                        margin: '15 0 0 0',
                        boxLabel: me.etiquetas.lbAgrupador
                    }
                ]
            }, {
                xtype: 'combobox',
                fieldLabel: me.etiquetas.reportTipoContenido,
                anchor: '100%',
                store: storeTipoContenido,
                valueField: 'tipocontenido',
                displayField: 'denominacion',
                hiddenName: 'tipocontenido',
                triggerAction: 'all',
                forceSelection: true,
                name: 'tipocontenido',
                mode: 'local',
                emptyText: me.etiquetas.lbEmptyText,
                allowBlank: false,
                blankText: me.etiquetas.vBlankText,
            }, {
                layout: 'column',
                border: false,
                bodyStyle: 'background:#DFE9F6;',
                defaults: {
                    xtype: 'textfield',
                    columnWidth: 1,
                    anchor: '100%',
                    allowBlank: false,
                    blankText: me.etiquetas.vBlankText,
                    disabled: true,
                    hidden: true
                },
                items: [
                    {
                        fieldLabel: me.etiquetas.lbRecurso,
                        name: 'recurso',
                        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\. ]+(\d*)?)+$/,
                        regexText: me.etiquetas.validationOnlyAlphaSpacerPunto,
                        maxLength: 100,
                        maxLengthText: me.etiquetas.validationMaxLength_100,

                    }, {
                        fieldLabel: me.etiquetas.lbUrl,
                        name: 'url',
                        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\/\.]+(\d*)?)+$/,
                        regexText: me.etiquetas.validationUrl,
                        maxLength: 150,
                        maxLengthText: me.etiquetas.validationMaxLength_150,
                    }, {
                        fieldLabel: me.etiquetas.lbNombreComponente,
                        name: 'nombrecomponente',
                        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\.]+(\d*)?)+$/,
                        regexText: me.etiquetas.validationComponentName,
                        maxLength: 100,
                        maxLengthText: me.etiquetas.validationMaxLength_100,
                    }, {
                        fieldLabel: me.etiquetas.lbFieldIdreporte,
                        name: 'identificadorreporte',
                        regex: /^([\d\.]+(\d*)?)+$/,
                        regexText: me.etiquetas.validationComponentName,
                        maxLength: 100,
                        maxLengthText: me.etiquetas.validationMaxLength_100
                    }]
            }, {
                xtype: 'hidden',
                name: 'idreporte',
                value: 0
            }]
        });

        me.items = [me.formReporte];
    },

    initButtons: function () {
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                action: 'cerrar'
            }, {
                text: me.etiquetas.lbBtnApply,
                iconCls: 'icondistra-aplicar',
                tooltip: me.etiquetas.qtipApply,
                disabled: true,
                action: 'aplicar'
            }, {
                text: me.etiquetas.lbBtnAccept,
                iconCls: 'icondistra-aceptar',
                tooltip: me.etiquetas.qtipAccept,
                disabled: true,
                action: 'aceptar'
            }
        ];
    },
    initState: function () {
        var me = this;
        me.setTitle(me.etiquetas[(me.actionInsert) ? 'titleWinAdicionarReporte' : 'titleWinModificarReporte']);
        me.down('button[action=aplicar]').setVisible(me.actionInsert);
    },
    resetComponents: function () {
        var me = this;
        me.formReporte.getForm().reset();
        me.formReporte.down('field:first').focus(false, 500);
    },
    loadValues: function (val) {
        var me = this;
        me.formReporte.getForm().loadRecord(val);
    },
    setActionInsert: function (action) {
        this.actionInsert = !!action;
    },
    getActionInsert: function () {
        return this.actionInsert;
    },
    show: function () {
        var me = this;

        me.initState();

        me.callParent();

        me.resetComponents();
    }
});
