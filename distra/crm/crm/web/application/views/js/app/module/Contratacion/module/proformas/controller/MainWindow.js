Ext.define('Proformas.controller.MainWindow', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'mainwindow[concept=proforma]': {
                    beforeshow: this.onBeforeShow,
                    show: this.onShow
                },
                'mainwindow[concept=proforma] hidden[name=idtipocontrato]': {
                    change: this.onChangeIdTipoContrato
                }
            }
        });

        if (!document.getElementById('style-column-element')) {
            //agregando los estilos del componente
            var styleLeaf = document.createElement('style');
            styleLeaf.id = 'style-column-element';

            styleLeaf.innerHTML = ".x-grid-rowbody-tr .editor-element{" +
            "border-radius: 3px;background-clip: padding-box;box-shadow: 0px 0px 2px #FFF inset, 0px 1px 0px rgba(0, 0, 0, 0.05);" +
            "border: 1px solid #D1D1D1;padding: 3px;margin: 3px 5px;position: relative;cursor: default;list-style: outside none none;" +
            "background-image: -moz-linear-gradient(center top , #FFF, #F9F9F9 48%, #E2E2E2 52%, #E7E7E7);" +
            "background-color: #E4F3FF; background-color: #FFF;font-family: tahoma,arial,verdana,sans-serif !important;font-size: 12px !important;" +
            "font-style: normal !important;}" +
            ".x-grid-rowbody{line-height: 25px;}";

            document.body.appendChild(styleLeaf);
        }

    },
    onChangeIdTipoContrato: function (field, value) {
        var editors = Ext.ComponentQuery.query('tinymceeditor'),
            clausulasGrid = Ext.ComponentQuery.query('customgrid'),
            disabled;

        if (editors.length != 0) {
            disabled = value ? false : true;


            Ext.Array.each(editors, function (edit) {
                edit.tipocontrato = value;
                edit.disableBtnAddElement(disabled);
            });
        }

        Ext.Array.each(clausulasGrid, function (grid) {
            grid.tipocontrato = value;
        });
    },
    onBeforeShow: function () {
        var editors = Ext.ComponentQuery.query('tinyhtmleditor');

        // Ext.Array.each(editors, function (edit) {
        //     edit.disableBtnAddElement(true);
        // });
    },
    onShow: function (window) {
        var me = this,
            sm = window.mainlist.xtype == "centergrid" ? window.mainlist.getSelectionModel() : {},
            form = window.down('customform');
        if (form) {
            if (window.action == 'clone' && sm) {
                var record = sm.getLastSelected().copy();
                record.data.idproforma = '';
                record.data.denominacion = record.data.denominacion + me.etiquetas.lbcopia;
                form.action = 'add';
                form.loadRecord(record);
            }
        }
    }
});
