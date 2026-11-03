Ext.define('GestionContrato.controller.AreasConPermiso', {
        extend: 'CRM.core.controller.Base',
        refs: [
            {ref: 'GpAreaConPermiso', selector: 'gpareaconpermiso'},
            {ref: 'WinAreaConPermiso', selector: 'winareaconpermiso'},
            {ref: 'MainWindowContratacion', selector: 'co_mainwindowContratacion'}
        ],
        init: function () {
            var me = this;
            me.getLang();

            me.listen({
                component: {
                    "gpareaconpermiso": {
                        selectionchange: this.cambioEnGpAreaConPermiso
                    },
                    "gpareaconpermiso button[action=addareaconpermiso]": {
                        click: this.showWinAreaConPermiso
                    },
                    "gpareaconpermiso button[action=elimareaconpermiso]": {
                        click: this.eliminarAreaConPermiso
                    },
                    "winareaconpermiso button[action=aceptar]": {
                        click: this.insertarAreaConPermiso
                    },
                    "winareaconpermiso button[action=cerrar]": {
                        click: this.closeWinInsertArea
                    },
                    "winareaconpermiso treepanel": {
                        selectionchange: this.onSelectionChangeTreeEstructura
                    }
                }
            });
        },
        cambioEnGpAreaConPermiso: function (sm, select) {
            this.getGpAreaConPermiso().down('button[action=elimareaconpermiso]').setDisabled(select.length == 0);
        },
        getWinInsertAreaConPermiso: function () {
            if (!this.winareaconpermiso) {
                this.winareaconpermiso = new Ext.create('GestionContrato.view.WinAreaConPermiso');
            }
            return this.winareaconpermiso;
        },
        showWinAreaConPermiso: function () {
            var win = this.getWinInsertAreaConPermiso();
            win.show();

        },

        insertarAreaConPermiso: function () {
            var me = this,
                aux = [],
                errors = [],
                areasrep = '',
                condicion = false,
                win = this.getWinInsertAreaConPermiso(),
                treepanel = win.down('treepanel'),
                stAreaConPermiso = me.getGpAreaConPermiso().getStore(),
                idarearesponsable = me.getMainWindowContratacion().hfarea.getValue();
            select = treepanel.getSelectionModel().getSelection();


            for (var i = 0; i < select.length; i++) {
                seleccion = select[i]
                console.log('seleccion', seleccion)
                if (stAreaConPermiso.find('idestructura', seleccion.get('id')) == -1) {
                    if (seleccion.get('id') != idarearesponsable) {
                        aux.push({
                            'idarea': 'new_' + Ext.id(),
                            'area': seleccion.get('text'),
                            'idestructura': seleccion.get('id')
                        });
                    }
                    else {
                        condicion = true,
                            mostrarMensaje(6, me.etiquetas.msgErrorAreaConPermisoEqualResponsable + ': ' + seleccion.get('text'));
                    }
                } else {
                    errors.push(seleccion.get('text'));
                }
            }
            if (errors.length > 0) {
                if (errors.length == 1) {
                    mostrarMensaje(6, me.etiquetas.msgErrorExistAreaConPermisoS1 + errors[0] + me.etiquetas.msgErrorExistAreaConPermisoS2)
                } else {
                    areasrep = errors[0];
                    for (var j = 1; j < errors.length - 1; j++) {
                        areasrep += ', ' + errors[j];
                    }
                    mostrarMensaje(6, me.etiquetas.msgErrorExistAreaConPermisoP1 + areasrep + ' y ' + errors[errors.length - 1] + me.etiquetas.msgErrorExistAreaConPermisoP2)

                }
            }
            else {
                if (!condicion) {
                    stAreaConPermiso.add(aux);
                    win.hide();
                }

            }
        },

        eliminarAreaConPermiso:

            function () {
                var me = this;

                mostrarMensaje(2, this.etiquetas.msgElimAreaConPermiso, function (response) {
                    if (response === 'ok') {

                        var gpAreaConPermiso = me.getGpAreaConPermiso();
                        gpAreaConPermiso.getStore().remove(gpAreaConPermiso.getSelectionModel().getSelection()[0]);

                        mostrarMensaje(1, me.etiquetas.msgSuccessDeleteAreaConPermiso);
                    }
                });
            }

        ,

        closeWinInsertArea: function () {
            this.getWinAreaConPermiso().hide();
        }
        ,

        onSelectionChangeTreeEstructura: function (sm, select) {
            var me = this;
            var hijos = [],
                aux = [];

            for (var i = 0; i < select.length; i++) {
                seleccion = select[i]
                seleccion.expand(false)
            }
            this.getWinAreaConPermiso().down('button[action=aceptar]').setDisabled(select.length == 0);
        }
    }
)
;