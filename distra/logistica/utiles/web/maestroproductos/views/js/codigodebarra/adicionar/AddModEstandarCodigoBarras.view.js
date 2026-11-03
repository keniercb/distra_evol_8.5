Ext.namespace('Ext.AddModEstandarCodigoBarras');
Ext.AddModEstandarCodigoBarras.view = Ext.extend(Ext.Panel, {
    layout: 'fit',
    // autoHeight: true,
    // region: 'center',
    frame: false,
    border: false,
    closable: true,
    constructor: function () {
        this.items = [this.crearFormulario()];
        Ext.AddModEstandarCodigoBarras.view.superclass.constructor.call(this);
    },
    getFormulario: function () {
        return this.formPrincipal;
    },
    crearFormulario: function () {
        this.tfDenominacion = new Ext.form.TextField({
            fieldLabel: 'Denominacion',
            name: 'denominacion',
            allowBlank: false,
            anchor: '95%',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 50 caracteres.',
            // selectOnFocus: true,
            maxLength: 50,
            enableKeyEvents: true
        });

        this.nfBandera = new Ext.form.NumberField({
            fieldLabel: 'Bandera',
            name: 'bandera',
            allowBlank: false,
            allowDecimals: false,
            anchor: '95%',
            minValue: 1,
            enableKeyEvents: true
        });

        this.tfFormato = new Ext.form.TextField({
            fieldLabel: 'Formato',
            name: 'formato',
            allowBlank: false,
            anchor: '95%',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 16 caracteres.',
            // selectOnFocus: true,
            maxLength: 16,
            enableKeyEvents: true
        });

        this.nfLongitud = new Ext.form.NumberField({
            fieldLabel: 'Longitud',
            name: 'longitud',
            allowBlank: true,
            allowDecimals: false,
            anchor: '95%',
            readOnly: true,
            value: 0
        });

        this.ckbPorEntidad = new Ext.form.Checkbox({
            name: 'sequenciaporentidad',
            hideLabel: true,
            boxLabel: 'Por entidad',
            disabled: false,
            checked: false,
            inputValue: 1,
            anchor: '100%',
        });

        return this.formPrincipal = new Ext.FormPanel({
            // labelWidth: 50,
            // labelAlign: 'top',
            //region: 'center',
            autoHeight: true,
            frame: true,
            border: false,
            buttonAlign: 'right',
            layout: 'form',
            items: [
                {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [
                        {
                            columnWidth: .8,
                            layout: 'form',
                            style: 'margin: 0 0 0 5',
                            items: [this.tfDenominacion]
                        },
                        {
                            style: 'margin: 12 0 0 0',
                            columnWidth: .2,
                            layout: 'form',
                            items: [this.ckbPorEntidad]
                        }
                    ]
                },
                {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [
                        {
                            columnWidth: .15,
                            style: 'margin: 0 0 0 5',
                            layout: 'form',
                            items: [this.nfBandera]
                        },
                        {
                            style: 'margin: 0 0 0 5',
                            columnWidth: .75,
                            layout: 'form',
                            items: [this.tfFormato]
                        },
                        {
                            style: 'margin: 0 0 0 5',
                            columnWidth: .10,
                            layout: 'form',
                            items: [this.nfLongitud]
                        }
                    ]
                }
            ]
        });
    }
});