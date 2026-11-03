/**
 * Created by Chinete on 11/12/2017.
 */

Ext.ns('Planificacion.Integracion');
Planificacion.Integracion.WinResumenTareas = ExtExtend.Class({
    $extend: Ext.Window,
    height: 170,
    width: 470,
    modal: true,
    id: 'WinExportarResultados',
    resizable: false,
    closeAction: 'hide',
    constrain: true,
    layout: 'border',
    title: 'Resumen de Tareas',
    initComponent: function () {
        var me = this;
        me.idCmp = this.id;
        me.tiporeporte = me.tiporeporte ? me.tiporeporte : 2;
        comps = ExtExtend.Components;

        me.btnAceptar = new comps.buttons.btnAceptar({
            disabled: true,
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                me.close();
            }
        });

        me.btnCancelar = new comps.buttons.btnCancelar({
            tooltip: 'Cerrar ventana sin guardar datos',
            handler: function () {
                me.close();
            }
        });

        me.rbinvierno = new Ext.form.Radio({
            id: 'idestasol',
            name: 'tiporeporte',
            anchor: '100%',
            boxLabel: 'Estad&iacute;stico',
            inputValue: 2,
            hideLabel: true,
            checked: true,
            listeners: {
                check: function (check) {
                    if (check) {
                        me.tiporeporte = me.rbinvierno.inputValue;
                    }
                }
            }
        });

        me.rbverano = new Ext.form.Radio({
            id: 'idtodassol',
            name: 'tiporeporte',
            anchor: '100%',
            boxLabel: 'Gr&aacute;fico',
            inputValue: 1,
            hideLabel: true,
            checked: false,
            listeners: {
                check: function () {
                    if (check) {
                        me.tiporeporte = me.rbverano.inputValue;
                    }
                }
            }
        });

        me.fsTemporada = new Ext.form.FieldSet({
            title: 'Tipo de reporte',
            height: 86,
            layout: 'column',
            defaults: {
                layout: 'form',
                border: false,
                labelAlign: 'top',
                buttonAlign: 'right'
            },
            items: [{
                columnWidth: .500,
                bodyStyle: 'padding:10px 0 0 0;',
                items: [me.rbinvierno]
            }, {
                bodyStyle: 'padding:10px 0 0 0;',
                columnWidth: .500,
                items: [me.rbverano]
            }]
        });


        me.finieventos = new Ext.form.DateField({
            fieldLabel: 'Fecha inicio',
            id: 'finieventos',
            endDateField: 'ffineventos',
            blankText: 'Este campo es obligatorio.',
            enableKeyEvents: true,
            allowBlank: false,
            format: 'd/m/Y',
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            invalidText: 'Formato: dd/mm/aaaa.',
            anchor: '95%',
            vtype: 'rangoFechas',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    me.ffineventos.setMinValue(date);
                }
            }
        });

        me.ffineventos = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            id: 'ffineventos',
            startDateField: 'finieventos',
            minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            format: 'd/m/Y',
            blankText: 'Este campo es obligatorio.',
            invalidText: 'Formato: dd/mm/aaaa.',
            anchor: '95%', allowBlank: false,
            vtype: 'rangoFechas',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                    me.finieventos.setMaxValue(date);
                }
            }
        });


        me.fsFinicioEventos = new Ext.form.FieldSet({
            title: 'Rango de fecha',
            autoHeight: true,
            anchor: '98%',
            layout: 'column',
            defaults: {
                layout: 'form',
                border: false,
                labelAlign: 'top',
                buttonAlign: 'right'
            },
            items: [{
                columnWidth: .500,
                items: [me.finieventos]
            }, {
                columnWidth: .500,
                items: [me.ffineventos]
            }]
        });


        me.fpanel = new Ext.form.FormPanel({
            region: 'center',
            id: 'fpanelexportar',
            labelAlign: 'top',
            labelWidth: 110,
            frame: true,
            layout: 'form',
            items: [
                {
                    layout: 'column', anchor: '100%',
                    items: [
                        {
                            columnWidth: .5, layout: 'form',
                            items: [me.fsFinicioEventos]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [me.fsTemporada]
                        }
                    ]
                }
            ]
        });

        me.items = [me.fpanel];

        me.buttons = [me.btnCancelar, me.btnAceptar];

        me.keys = [
            {
                key: 'x',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnCancelar.handler.call();
                }
            },
            {
                key: Ext.EventObject.ENTER,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnAceptar.handler.call();
                }
            }
        ];

        Planificacion.Integracion.WinResumenTareas.superclass.initComponent.call(me);

        me.on('show', function () {
            var me = this;
            me.validator = new ExtExtend.FormValidator({
                checkDirty: true,
                buttons: [me.btnAceptar],
                fields: [
                    me.ffineventos, me.finieventos, me.rbinvierno, me.rbverano
                ]
            });
        });
    }
});
Ext.reg('Planificacion.Integracion.WinResumenTareas', Planificacion.Integracion.WinResumenTareas);


