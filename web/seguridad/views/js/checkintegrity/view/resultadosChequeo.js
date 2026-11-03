/**
 * Created by kmilo on 12/5/2018.
 */

Ext.define('CheckIntegrity.view.resultadosChequeo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.resultadosChequeo',
    title: Zeolides.etiquetas.tittleChequeoManual,
    layout: 'fit',
    border: false,
    disabled: true,
    initComponent: function () {
        this.tbar = [
            {
                iconCls: 'ver',
                tooltip: Zeolides.etiquetas.toolTipBtnComprobar,
                action: 'comprobarIntegridad',
                text: Zeolides.etiquetas.btnComprobarIntegridad
            }, '->',
            {
                xtype: 'label',
                text: Zeolides.etiquetas.lbUltimoEscaneo,
            },
            {
                xtype: 'label',
                text: "  --/--/----",
                action: 'fechaUltimoEscaneo'
            },
            "-",
            {
                xtype: 'label',
                text: Zeolides.etiquetas.lbIntegridadNoChuequeada,
                style: {
                    color: "orange",
                    fontWeight: 'bold',
                },
                action: 'estadoIntegridad'
            },

        ];
        this.items = [
            {
                xtype: 'textarea',
                readOnly: true,
                style: 'margin:0', // Remove default margin
                autoRender: true
            }

        ];
        this.callParent(arguments);
    }
});