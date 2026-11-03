/*
 * Componente Datos del accidente.
 * @package Pvd.SST
 * @uses Pvd.SST.Gestionaraccidentes
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes');
Pvd.SST.Gestionaraccidentes.PanelDatosAccidente = Ext.extend(Ext.Panel, {
    layout: 'fit',
    border: false,
    id: 'PanelDatosAccidente',
    title: 'Datos del accidente',
    region: 'center',
    height: 500,
    initComponent: function() {
        var self = this;
        this.taLugarAccidenteA = new Ext.form.TextArea({
            fieldLabel: 'Puesto de trabajo o lugar del accidente',
            name: 'lugarA',
            anchor: '100%',
            height: 80,
            hiddenname: 'lugarA',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            allowBlank:	false
        });

        this.tfHoraA = new Ext.form.TextField({
            fieldLabel: 'Hora(hh:mm)',
            allowBlank: false,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /(0[0-9]|1\d|2[0-3]):([0-5]\d)$/,
            anchor:	'99%',
            name: 'horaA'
        });

        this.btnGuardar = new Ext.Button({
            iconCls: 'guardar',
            tooltip: 'Guardar',
            text: 'Guardar'
        });

        this.fpDatosAccidenteA = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'fpDatosAccidenteA',
            frame: true,
            border: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.taLugarAccidenteA]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.tfHoraA]
                    }]
            }],
            buttons: [this.btnGuardar]
        });


        this.items = [this.fpDatosAccidenteA];
        //this.buttons = [this.btnGuardar];
        Pvd.SST.Gestionaraccidentes.PanelDatosAccidente.superclass.initComponent.call(this);
    }
});
