Ext.define('PerfilesClientes.view.PreguntaRespuesta', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.PreguntaRespuesta',
    requires: ['Ext.ux.CmbSelectField'],

    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.frame = false;
        me.margin = 0;
        me.border = 0;
        me.layout = 'column';
        //me.columnWidth = 1;
        me.bodyStyle = 'background:#DFE9F6;';
        me.defaults = {
            bodyStyle: 'background:#DFE9F6;',
            //margin: '0 5 0 5',
            //columnWidth: 1,
            layout: 'column',
            border: false
        };

        me.hfpregunta = Ext.create('Ext.form.field.Hidden', {
            name: 'idpregunta' + me.index
        });
        me.cmbPregunta = Ext.create('Ext.ux.CmbSelectField', {
            name: 'pregunta' + me.index,
            mapping: 'NomPreguntaperfil.pregunta',
            localId: 'idpregunta' + me.index,
            module: 'NomClienteProveedor',
            noactions: false,
            allowBlank: false,
            columnWidth: 0.5,
            margin: '3 5 3 0',
            forceSelection: true,
            context: 'perfilesclientesmainwindowpregunta',
            /*filters: {
                idtipo: 1,
                idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun
            },*/
            controller: 'perfilesclientesmainwindow'
        });
        me.hfrespuesta = Ext.create('Ext.form.field.Hidden', {
            name: 'idrespuesta' + me.index
        });
        me.cmbRespuesta = Ext.create('Ext.ux.CmbSelectField', {
            name: 'respuesta' + me.index,
            mapping: 'NomRespuestaperfil.respuesta',
            localId: 'idrespuesta' + me.index,
            module: 'NomClienteProveedor',
            noactions: false,
            allowBlank: false,
            displayField: 'respuesta',
            valueField: 'idrespuesta',
            columnWidth: 0.5,
            margin: '3 5 3 0',
            forceSelection: true,
            context: 'perfilesclientesmainwindowrespuesta',
            filters: {},
            controller: 'perfilesclientesmainwindow'
        });
        me.btnDelPregunta = Ext.create('Ext.button.Button', {
            //xtype: 'button',
            iconCls: 'eliminar',
            tooltip: me.etiquetas.lbDelPregunta,
            margin: '3 0 0 5',
            action: 'btnDelPregunta',
            width: 21,
            disabled: true,
            height: 21,
            border: 0
        });
        me.items = [me.hfrespuesta,me.cmbPregunta, me.hfpregunta, me.cmbRespuesta, me.btnDelPregunta];

        me.callParent();
    }
});
