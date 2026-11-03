Ext.define('ConfContratacion.view.WindowAddComite', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowaddcomite',
    layout: 'fit',
    width: 500,
    minWidth: 500,
    minHeight: null,
    initComponent: function () {
        var me  = this;
        this.getLang();

        this.title=me.action=='add'?me.etiquetas.lbAdicionarComite:me.etiquetas.lbModificarComite;

        this.idcomitegeneral = Ext.create('Ext.form.field.Hidden', {
            name: 'idcomitegeneral'
        });

        me.nombre=Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbName,
            name: 'nombre',
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            enableKeyEvents:true
        });

        me.inicial = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: me.etiquetas.lbInicial,
            name: 'pordefecto',
            inputValue: 1,
            uncheckedValue: 0,
        })

        me.descripcion = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: me.etiquetas.lbDescripcion,
            name: 'descripcion',
            //enableVar: false,
            allowBlank: true,
            //enableSourceEdit: false,
            height: 150,
            flex: 1
        });

        me.hfprocesos = Ext.create('Ext.form.field.Hidden', {
            // context: 'gestioncontratomainwindowcontrato',
            name: 'idproceso'
        });

        me.sfprocesos = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbProceso,
            name: 'proceso',
            mapping: 'NomProceso.denominacion',
            localIdMulti: 'idproceso',
            module: 'TipoContrato',
            noactions: true,
            // context: 'gestioncontratomainwindowcontrato',
            allowBlank: false,
            // controller: 'gestioncontratomainwindow',
            flex: 1,
            multiSelect:true,
        });

        // this.form = Ext.create('Ext.form.Panel', {
        this.form = Ext.create('Ext.ux.CustomForm', {
            layout: 'column',
            border: false,
            fieldDefaults: {
                labelAlign: 'top',
            },
            bodyStyle: 'background:#DFE9F6; padding:5px',
            defaults: {
                bodyStyle: 'background:#DFE9F6;',
                border: false,
                margin: '5 5 0 5'
            },
            trackResetOnLoad: true,
            items: [
                {
                    columnWidth: 1,
                    layout: 'form',
                    selector: 'col1',
                    items: [this.nombre, me.inicial, this.idcomitegeneral]
                },
                // {
                //     columnWidth: 1,
                //     layout: 'form',
                //     selector: 'col1',
                //     items: [this.hfprocesos, this.sfprocesos]
                // },
                {
                    columnWidth: 1,
                    layout: 'form',
                    selector: 'col2',
                    items: [me.descripcion]
                },
                // {
                //     columnWidth: 1,
                //     layout: 'form',
                //     selector: 'col3',
                //     hidden: true,
                //     disabled: true,
                //     // items: [this.nfvalue]
                // }
            ]
        });
        this.items = [this.form];
        this.callParent();
    }
});
