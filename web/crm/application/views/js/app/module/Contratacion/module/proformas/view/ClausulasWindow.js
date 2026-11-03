Ext.define('Proformas.view.ClausulasWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.clausulaswindow',
    width: 750,
    autoHeight:true,
    autoScroll: true,
    autoCreateForm: true,
    tipocontrato: false,
    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);

        this.title = this.etiquetas.titleAddClausula;

        if (this.action == 'edit') {
            this.title = this.etiquetas.titleEditClausula;
        }

        this.addToBody();
        this.callParent();
        this.tools[0].refhelp = this.action == 'add' ? 'add_dat_proforma_clausula' : 'edit_dat_proforma_clausula';
    },
    addToBody: function () {
        var me = this;
        this.idclausula = Ext.create('Ext.form.field.Hidden', {
            name: 'idclausula'
        });

        this.tipo = Ext.create('Ext.ux.CmbSelectField', {
            name: 'denominacion',
            first:true,
            fieldLabel: this.etiquetas.lbclausula || 'Clausula',
            allowBlank: false,
            localId: 'idclausula',
            mapping: 'NomClausula.denominacion',
            module: 'Nomencladores',
            gen: 'f'
        });

        this.contenido = Ext.create('Proformas.view.TinyHtmlEditor', {
            fieldLabel: this.etiquetas.lbcontenido,
            allowBlank: false,
            name: 'contenido',
            height: 300,
        });

        this.orden=Ext.create('Ext.form.field.Hidden',{
            name:'orden',
            value:me.orden
        });

        this.form = Ext.create('Ext.ux.CustomForm', {
            action: 'add',
            layout: 'form',
            items: {
                columnWidth: 1,
                layout: 'anchor',
                defaults: {
                    anchor: '99%'
                },
                items: [
                    this.idclausula,
                    this.tipo,
                    this.contenido,
                    this.orden
                ]
            }
        });

        this.items = this.form;
    }
});