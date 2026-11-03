Ext.define('Demanda.controller.EstadoTrazas', {
    extend: 'CRM.core.controller.Base',
    configEstados: null,
    views: ['GridHistorialDemanda'],
    refs: [
        {ref: 'Demanda', selector: 'gpdemanda'},
        {ref: 'FpFiltrosdemanda', selector: 'fpfiltrosdemanda'},
        {ref: 'GridHistorialDemanda', selector: 'gridhistorialdemanda'},
    ],
    requires: [
        'Demanda.view.GridHistorialDemanda',
    ],

    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            component: {
                "gpdemanda": {
                    // render: this.loadConfigEstados,
                    selectionchange: this.onSelectionChangeGpDemanda
                },
                "fpfiltrosdemanda button[action=buscar]": {
                    click: this.filtrarDemandas
                },
                "fpfiltrosdemanda button[action=limpiar]": {
                    click: this.limpiarFiltrosDemanda
                },
                // 'fpfiltrossolicitud combobox[localId],fpfiltrossolicitud pickerfield[localId]': {
                //     select: this.selectCombo,
                //     change: this.changeCombo
                // }
            }
        });
    },
    // loadConfigEstados: function(){
    //     var me = this;
    //     var mask= new Ext.LoadMask(
    //         me.getSolicitudNegocio(), {msg: this.etiquetas.msgCargandoConfiguracionPermisos});
    //     mask.show();
    //     // Ext.MessageBox.show({
    //     //     msg: me.etiquetas.msgCargandoConfiguracionPermisos,
    //     //     title: me.etiquetas.lbTitleWait,
    //     //     width: 300,
    //     //     wait: true,
    //     //     waitConfig: {interval: 200}
    //     // });
    //
    //     Ext.Ajax.request({
    //         url: UtilsFn.buildUrl({action: 'getConfiguracionEstados'}, me),
    //         callback: function (options, success, response) {
    //             // Ext.MessageBox.hide();
    //             mask.hide();
    //             var info = Ext.decode(response.responseText);
    //             // me.configEstadosCliente = info.datos.estados_cliente;
    //             // me.configEstadosProveedor = info.datos.estados_proveedor;
    //             this.application.comite = {
    //                 transitions: info.datos.transitions
    //             };
    //             this.application.idnaturaleza=info.datos.naturaleza;
    //             this.getSolicitudNegocio().down('#addsolicituddemanda').filtros={'idnaturaleza': info.datos.naturaleza};
    //
    //             this.getSolicitudNegocio().getStore().load();
    //             // this.loadStoreEstadosFiltros();
    //         },
    //         scope: me
    //     });
    // },
    onSelectionChangeGpDemanda: function (sm, select) {
        var gpdemanda = this.getDemanda();
        cantEstados = this.updateBtnCambiarEstado(select, gpdemanda);
        // console.log('CAMBIAR ESTADO',gpdemanda.down('#cambiarestadodemanda'))
        // console.log('CANT ESTADOS', cantEstados)
        // console.log('SELECT', select.length)

        gpdemanda.down('button[action=moddemanda]').setDisabled(select.length != 1 || !this.isActionAccess('edit', select, gpdemanda)
            || (select.length == 1 && select[0].get('desactivada')));
        gpdemanda.down('button[action=elimdemanda]').setDisabled(select.length == 0 || !this.isActionAccess('del', select, gpdemanda));
        gpdemanda.down('button[action=detalledemanda]').setDisabled(select.length != 1);
        gpdemanda.down('#estadoTraza').setDisabled(select.length != 1);
        gpdemanda.down('#historialdemanda').setDisabled(select.length != 1 || (select.length == 1 && !select[0].data.idpadre));
        // grid.btnHistorial.setDisabled(!(len == 1) || (selection[0].data.idcontrato == selection[0].data.idpadre));
        gpdemanda.down('#crearcontrademanda').setDisabled(select.length != 1 || !this.isActionAccess('createsupl', select, gpdemanda)
            || (select.length == 1 && select[0].get('desactivada')));
        // gpdemanda.down('button[action=cambiarestadosolicitud]')[(select.length != 1 || cantEstados == 0)?'hide':'show']();
        gpdemanda.down('#cambiarestadodemanda').setDisabled(select.length != 1 || cantEstados == 0);
        gpdemanda.down('#marcocontractual').setDisabled(select.length != 1 || select[0].get('clasificacionclienteproveedor')==2 || !this.isActionAccess('createcontrato', select, gpdemanda));
       },
    isActionAccess: function (action, select, grid) {
        var me = this, result = true;
        if (Ext.isEmpty(select))
            return false;

        select.forEach(function (x) {
//             console.log(x)
            if (x.data.cliente == '4')
                var estados = grid.getStore().proxy.reader.jsonData.estados_oferta;
            if (x.data.cliente == '3')
                var estados = grid.getStore().proxy.reader.jsonData.estados_demanda;
            if (x.get('cliente') == '2') {
                var estados = grid.getStore().proxy.reader.jsonData.estados_proveedor;
            }
            if (x.get('cliente')=='1' || estados.length == 0) {
                var estados = grid.getStore().proxy.reader.jsonData.estados_cliente;
            }
            // console.log('estados', estados);
            var estadoConfig = estados[x.get('idestado')];
            // console.log('action1', action)
            // console.log('estadoConfig', estadoConfig)
            if(!estadoConfig){
                // console.log('nooooooo')
                result = false;
                return false;
            }
            if (estadoConfig && estadoConfig.acciones.indexOf(action) == -1) {
                // console.log(estadoConfig.acciones)
                result = false;
                return false;
            }
        });
        return result;
    },
    updateBtnCambiarEstado: function (select, grid) {
        var me = this,
            menu = this.getDemanda().down('button[action=cambiarestadodemanda]').menu;
        // menu.items.each(function(btn, index){
        //     menu.remove(btn);
        // });
        menu.removeAll();

        if (!Ext.isEmpty(select)) {
            var estados = this.getNextStates(select[0], grid);
            Ext.each(estados, function (estado) {
                if (this.checkTransition(select[0].get('idestado'), estado.idestado)) {
                    menu.add({
                        text: estado.nombre,
                        idestado: estado.idestado,
                        notificar: estado.notificar,
                        iconCls: estado.icono,
                        handler: me.onChangeEstado,
                        scope: me
                    });
                }
            }, this);
        }
        return menu.items.getCount();
    },

    getNextStates: function (record, grid) {
        var me = this,
            estados = [];

        if (!record || !record.data.idestado) {
            return;
        }
        var datos = [];
        if (record.data.cliente == '4')
            var datos = grid.getStore().proxy.reader.jsonData.estados_oferta;
        if (record.data.cliente == '3')
            var datos = grid.getStore().proxy.reader.jsonData.estados_demanda;
        if (record.data.cliente == '2')
            var datos = grid.getStore().proxy.reader.jsonData.estados_proveedor;
        if (record.data.cliente == '1' || datos.length == 0) {
            var datos = grid.getStore().proxy.reader.jsonData.estados_cliente;
        }
        // console.log('datos:', datos)
        // console.log('datos[record.data.idestado]:', datos[record.data.idestado])
        if (datos[record.data.idestado]) {
            var transiciones = datos[record.data.idestado]['transiciones'];
            Ext.each(transiciones, function (transicion) {
                var aux = datos[transicion['idestado']];
                aux['notificar'] = transicion['notificar'];
                estados.push(aux);
            });
        }
        return estados;
    },
    checkTransition: function (idestadoinicial, idestadofinal) {
        var exist = false,
            comite = this.application.comite,
            activo = this.application.crm.activeModules.Comite;
        if (activo == "true" && comite && comite.transitions) {
            for (k in comite.transitions) {
                var transition = comite.transitions[k];
                if (transition.idestadoinicial == idestadoinicial && transition.idestadofinal == idestadofinal &&
                    // (transition.aliasproceso == 'solicitudnegocio' ||
                    //     transition.aliasproceso == 'solicitudnegocioproveedor' ||
                    transition.aliasproceso == 'demanda'
                // ||
                // transition.aliasproceso == 'solicitudofertaimportacion')
                ) {
                    exist = true;
                }
            }
        }
        if (!exist) {
            return true;
        }
        return false;
    },
    onChangeEstado: function (btn) {
        var me = this,
            sm = me.getDemanda().getSelectionModel(),
            values = {
                idsolicitud: sm.getSelection()[0].get('idsolicitud'),
                idestado: btn.idestado
            };

        mostrarMensaje(2, me.etiquetas.msgCambiarEstadoDemanda, function (response) {
            if (response === 'ok') {
                Ext.MessageBox.show({
                    msg: me.etiquetas.msgCambiandoEstadoDemanda,
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'cambiarDemandaEstado'}, me),
                    params: {values: Ext.encode(values)},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        var info = Ext.decode(response.responseText);

                        if (info.success) {
                            mostrarMensaje(1, me.etiquetas.msgSuccessCambiadoEstadoDemanda);
                            me.getDemanda().getStore().load();
                        } else
                            mostrarMensaje(6, 'Error incorporar mensaje');

                    },
                    scope: me
                });
            }
        });

    },
    loadStoreEstadosFiltros: function () {
        var me = this,
            storeStado = me.getFpFiltrosDemanda().cbEstado.getStore();

        for (i in me.configEstados) {
            storeStado.add({
                'idestado': me.configEstados[i]['idestado'],
                'denominacion': me.configEstados[i]['nombre']
            });
        }
    },
    filtrarDemandas: function () {
        var values = this.getFpFiltrosDemanda().getForm().getValues(),
            store = this.getDemanda().getStore(),
            filters = [];

        store.clearFilter(true);
        for (i in values) {
            if (!Ext.isEmpty(values[i]))
                filters.push({property: i, value: values[i]});
        }
        store.addFilter(filters);
    },
    limpiarFiltrosSolicitudes: function () {
        var store = this.getDemanda().getStore();
        this.getFpFiltrosDemanda().getForm().reset();
        store.clearFilter();
    },
    selectCombo: function (combo, records) {
        var me = this,
            form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);
        if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.localId]);
        }
    },
    changeCombo: function (combo, value, oldvalue) {
        var me = this,
            form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);
        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
    },
});