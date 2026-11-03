Ext.define('SolicitudNegocioImportacion.controller.AreasImplicadas', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'GpAreasImplicadas', selector: 'gpareasimplicadasimportacion'},
        {ref: 'WinInsertAreaSN', selector: 'wininsertareasnimportacion'},
        {ref: 'WinEditSolicitud', selector: 'wineditsolicitudimportacion'}
    ],
    init: function () {
        var me = this;
        me.getLang();

        me.listen({
            component: {
                "gpareasimplicadasimportacion": {
                    selectionchange: this.onSelectionChangeAreasImplicadas
                },
                "gpareasimplicadasimportacion button[action=addareaimplicada]": {
                    click: this.showWinInsertArea
                },
                "gpareasimplicadasimportacion button[action=elimareaimplicada]": {
                    click: this.eliminarArea
                },
                "wininsertareasnimportacion button[action=aceptar]": {
                    click: this.insertarArea
                },
                "wininsertareasnimportacion button[action=cerrar]": {
                    click: this.closeWinInsertArea
                },
                "wininsertareasnimportacion treepanel": {
                    selectionchange: this.onSelectionChangeTreeEstructura
                }
            }
        });
    },
    onSelectionChangeAreasImplicadas: function (sm, select) {
        console.log('SELECT AREA IMPLICADA',select)
        this.getGpAreasImplicadas().down('button[action=elimareaimplicada]').setDisabled(select.length == 0);
    },
    getWinInsertAreaSN: function () {
        if (!this.wininsertareasn) {
            this.wininsertareasn = new Ext.create('SolicitudNegocioImportacion.view.WinInsertAreaSN');
        }
        return this.wininsertareasn;
    },
    showWinInsertArea: function () {
        var win = this.getWinInsertAreaSN();
        win.show();
    },
    eliminarArea: function () {
        var me = this;

        mostrarMensaje(2, this.etiquetas.msgElimAreaImplicada, function (response) {
            if (response === 'ok') {

                var gpArea = me.getGpAreasImplicadas();
                gpArea.getStore().remove(gpArea.getSelectionModel().getSelection()[0]);

                mostrarMensaje(1, me.etiquetas.msgSuccessDeleteAreaImplicada);
            }
        });
    },
    insertarArea: function () {
        var me = this,
            win = this.getWinInsertAreaSN(),
            selected = win.down('treepanel').getSelectionModel().getSelection()[0],
            stArea = me.getGpAreasImplicadas().getStore(),
            idarearesponsable = me.getWinEditSolicitud().hfarea.getValue();

        if (stArea.find('idestructura', selected.get('id')) == -1) {
            if (selected.get('id') != idarearesponsable) {

                stArea.add({
                    'idarea': 'new_' + Ext.id(),
                    'area': selected.get('text'),
                    'idestructura': selected.get('id')
                });

                win.hide();
            } else {
                mostrarMensaje(6, me.etiquetas.msgErrorAreaImplicadaEqualResponsable);
            }
        } else {
            mostrarMensaje(6, me.etiquetas.msgErrorExistAreaImplicada);
        }

    },
    closeWinInsertArea: function () {
        this.getWinInsertAreaSN().hide();
    },
    onSelectionChangeTreeEstructura: function (sm, select) {
        console.log('select', select)
        this.getWinInsertAreaSN().down('button[action=aceptar]').setDisabled(select.length == 0);
    }
});