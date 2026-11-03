Ext.define('Segmentacion.controller.MainSegmentacion', {
    extend: 'Ext.app.Controller',
    views: ['MainSegmentacion'],

    refs: [
        {ref: 'GridSegmentacion', selector: 'GridSegmentacion'},
        {ref: 'WindowSegmentacion', selector: 'WindowSegmentacion'},
    ],

    init: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);

        this.listen({
            component: {
                'GridSegmentacion': {
                    //itemclick: this.itemClickDataView,
                    select: this.controlButton,
                    deselect: this.controlButton
                },
                'GridSegmentacion button[action]': {
                    click: this.actionButton
                }
            }
        });
    },

    controlButton: function () {
        this.enableAccion(this.getGridSegmentacion().getSelectionModel().getSelection().length);
    },

    enableAccion: function (selection) {
        this.getGridSegmentacion().btnMod.setDisabled(!(selection == 1));
        this.getGridSegmentacion().btnDel.setDisabled(!(selection > 0));

    },

    actionButton: function (cmp) {
        var me = this;

        switch (cmp.action) {
            case 'add':
                me.winSegmentacion(cmp);
                break;
            case 'edit':
                me.winSegmentacion(cmp);
                break;
            case 'del':
                this.delPerfil();
                break;
        }
    },

    winSegmentacion: function (cmp) {
        var me = this,
            cfg = {
                action: cmp.action,
                concept: me.etiquetas.lbSegmentacionS
            }, win = Ext.create('Segmentacion.view.WindowSegmentacion', cfg);

        win.show();
    },


});