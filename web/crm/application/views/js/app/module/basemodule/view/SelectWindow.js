Ext.define('BaseModule.view.SelectWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.selectwindow',
    width: 600,
    height: 670,
    layout: 'fit',
    constrain: true,
    modal: true,
    concept: '',
    action:'select',
    initComponent: function () {
        var me = this,
            globalLang = LangMgr.getLang(this),
            bodyHeight = Ext.getBody().dom.offsetHeight,
            modelName = this.modelName;

        this.height = this.height >= bodyHeight ? bodyHeight - 20 : this.height;
        this.etiquetas = Ext.Object.merge(globalLang,me.etiquetas || {});

        var concept = this.etiquetas['text' + modelName];

        this.concept = (concept || this.concept).toLowerCase();

        if (!this.title) {
            this.title = (this.etiquetas && this.etiquetas.titleSel) ? this.etiquetas.titleSel : 'Seleccionar. ';

            this.title += this.concept.toLowerCase();
        }

        this.tools = [{
            type: 'help',
            action:'help'
        }];

        this.createBody();

        this.defaultFocus = this.btnCancelar;

        this.callParent();
    },
    createBody: function () {
        var me = this,
            module = this.field.module || this.field.up('mainwindow').mainlist.module;

        var grid = Ext.create('BaseModule.view.CenterGrid', {
            noHelp: true,
            modelName:me.modelName,
            gen: me.field.gen || 'm',
            module: module,
            noactions: me.field.noactions || false,
            filter: me.field.filters || false,
            defaultValues: me.field.defaultValues || false,
            flex: 1
        });

        this.items = grid;

        this.btnAceptar = Ext.create('Ext.Button', {
            text: (this.etiquetas && this.etiquetas.lbBtnAccept) ? this.etiquetas.lbBtnAccept : 'Aceptar ',
            tooltip: (this.etiquetas && this.etiquetas.qtipAccept) ? this.etiquetas.qtipAccept : 'Aceptar ',
            action: 'acept',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.btnCancelar = Ext.create('Ext.Button', {
            text: (this.etiquetas && this.etiquetas.lbBtnCancel) ? this.etiquetas.lbBtnCancel : 'Cancelar ',
            tooltip: (this.etiquetas && this.etiquetas.qtipCancel) ? this.etiquetas.qtipCancel : 'Cancelar ',
            action: 'cancel',
            iconCls: 'cancelar'
        });

        this.buttons = [this.btnCancelar, this.btnAceptar];
    }
});
