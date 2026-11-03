Ext.define('SolicitudNegocio.controller.AreasImplicadas', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'GpAreasImplicadas', selector: 'gpareasimplicadas'},
        {ref: 'WinInsertArea', selector: 'wininsertarea'},
        {ref: 'WinEditSolicitud', selector: 'wineditsolicitud'}
    ],
    init: function () {
        var me = this;
        me.getLang();

        me.listen({
            component: {
                "gpareasimplicadas": {
                    selectionchange: this.onSelectionChangeAreasImplicadas
                },
                "gpareasimplicadas button[action=addareaimplicada]": {
                    click: this.showWinInsertArea
                },
                "gpareasimplicadas button[action=elimareaimplicada]": {
                    click: this.eliminarArea
                },
                "wininsertarea button[action=aceptar]": {
                    click: this.insertarArea
                },
                "wininsertarea button[action=cerrar]": {
                    click: this.closeWinInsertArea
                },
                "wininsertarea treepanel": {
                    selectionchange: this.onSelectionChangeTreeEstructura
                }
            }
        });
    },
    onSelectionChangeAreasImplicadas: function (sm, select) {
        this.getGpAreasImplicadas().down('button[action=elimareaimplicada]').setDisabled(select.length == 0);
    },
    getWinInsertArea: function () {
        if (!this.wininsertarea) {
            this.wininsertarea = new Ext.create('SolicitudNegocio.view.WinInsertArea');
        }
        return this.wininsertarea;
    },
    showWinInsertArea: function () {
        var win = this.getWinInsertArea();
        win.show();
        win.down('treepanel').getSelectionModel().deselectAll();
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
            win = this.getWinInsertArea(),
            selected = win.tree.getSelectionModel().getSelection()[0],
            stArea = me.getGpAreasImplicadas().getStore(),
            desdecontrato=(me.getWinEditSolicitud()==null),
            idarearesponsable = (!desdecontrato)? me.getWinEditSolicitud().hfarea.getValue():null;

        if (stArea.find('idestructura', selected.get('id')) == -1) {
            if (selected.get('id') != idarearesponsable) {

                stArea.add({
                    'idarea': 'new_' + Ext.id(),
                    'area': selected.get('text'),
                    'idestructura': selected.get('id')
                });

                win.hide();
            } else{
                (!desdecontrato)
                mostrarMensaje(6, me.etiquetas.msgErrorAreaImplicadaEqualResponsable);
            }
        }else{
            (!desdecontrato)
            mostrarMensaje(6, me.etiquetas.msgErrorExistAreaImplicada);
        }
    },
    closeWinInsertArea: function () {
        this.getWinInsertArea().hide();
    },
    onSelectionChangeTreeEstructura: function (sm, select) {
        this.getWinInsertArea().down('button[action=aceptar]').setDisabled(select.length == 0);
    }
});