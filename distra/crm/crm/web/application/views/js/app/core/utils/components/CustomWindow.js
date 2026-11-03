Ext.define('Ext.ux.CustomWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.customwindow',
    width: 630,
    minWidth: 630,
    minHeight: 200,
    layout: 'anchor',
    constrain: true,
    modal: true,
    etiquetas: '',
    concept: '',
    initComponent: function () {
        var bodyWidth = Ext.getBody().getWidth(),
            bodyHeight = Ext.getBody().getHeight();

        this.maximized = this.maximized || (bodyWidth - this.width < 30 || bodyHeight - this.height < 30) ? true : false;

        if (!this.title) {
            this.title = (this.etiquetas && this.etiquetas.titleAdd) ? this.etiquetas.titleAdd : 'Adicionar ';
            if (this.action == 'edit') {
                this.title = (this.etiquetas && this.etiquetas.titleMod) ? this.etiquetas.titleMod : 'Modificar ';
            }

            this.title += ' '+this.concept.toLowerCase();
        }

        this.toolhelp = {
            type: 'help',
            action: 'help',
            tooltip: this.etiquetas.qtipHelp || 'Mostrar ayuda de la funcionalidad <b>(Ctrl+F1)</b>',
            refhelp: this.refhelp,
            keyMap: {
                key: Ext.EventObject.F1,
                ctrl: true,
                event: 'click'
            }
        };
        this.tools = [this.toolhelp];

        this.createBody();

        // this.defaultFocus = this.btnCancelar;

        this.callParent();
    },
    createBody: function () {
        var me = this;

        this.btnAceptar = Ext.create('Ext.Button', {
            text: (this.etiquetas && this.etiquetas.lbBtnAccept) ? this.etiquetas.lbBtnAccept : 'Aceptar ',
            tooltip: (this.etiquetas && this.etiquetas.qtipAccept) ? this.etiquetas.qtipAccept : 'Aceptar ',
            action: 'acept',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.btnAplicar = Ext.create('Ext.Button', {
            text: (this.etiquetas && this.etiquetas.lbBtnApply) ? this.etiquetas.lbBtnApply : 'Aplicar ',
            tooltip: (this.etiquetas && this.etiquetas.qtipApply) ? this.etiquetas.qtipApply : 'Aplicar ',
            action: 'apply',
            disabled: true,
            iconCls: 'aplicar'
        });

        this.btnCancelar = Ext.create('Ext.Button', {
            text: (this.etiquetas && this.etiquetas.lbBtnCancel) ? this.etiquetas.lbBtnCancel : 'Cancelar ',
            tooltip: (this.etiquetas && this.etiquetas.qtipCancel) ? this.etiquetas.qtipCancel : 'Cancelar ',
            action: 'cancel',
            iconCls: 'cancelar',
            handler: function () {
                me.close();
            }
        });

        this.buttons = [this.btnCancelar, this.btnAceptar];

        if (this.action == 'add' && this.btnApply != false) {
            this.buttons.splice(1, 0, this.btnAplicar);
        }
    },
    disableButtons: function (state) {
        this.btnAceptar.setDisabled(state);
        this.btnAplicar.setDisabled(state);
    }
});
