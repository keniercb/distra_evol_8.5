Ext.define('SolicitudNegocioImportacion.controller.EstadoTrazas', {
    extend: 'CRM.core.controller.Base',
    configEstados: null,
    refs: [
        {ref: 'SolicitudNegocio', selector: 'gpsolicitudnegocioimportacion'},
        {ref: 'FpFiltrosSolicitud', selector: 'fpfiltrossolicitudimportacion'},
    ],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            component: {
                "gpsolicitudnegocioimportacion": {
                    // render: this.loadConfigEstados,
                    selectionchange: this.onSelectionChangeGpSolicitudNegocios
                },
                "fpfiltrossolicitudimportacion button[action=buscar]":{
                    click: this.filtrarSolicitudes
                },
                "fpfiltrossolicitudimportacion button[action=limpiar]":{
                    click: this.limpiarFiltrosSolicitudes
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
    onSelectionChangeGpSolicitudNegocios: function(sm, select){
        
        var gpsolicitud = this.getSolicitudNegocio(),
            cantEstados = this.updateBtnCambiarEstado(select, gpsolicitud);
        gpsolicitud.down('button[action=modsolicitud]').setDisabled( select.length != 1 || !this.isActionAccess('edit', select, gpsolicitud)
            || (select.length==1 && select[0].get('desactivada')));
        gpsolicitud.down('button[action=elimsolicitud]').setDisabled( select.length == 0 || !this.isActionAccess('del', select, gpsolicitud));
        gpsolicitud.down('button[action=detallesolicitud]').setDisabled( select.length != 1);
        gpsolicitud.down('button[action=estadotrazassolicitud]').setDisabled( select.length != 1);
        gpsolicitud.down('menuitem[action=exportarExcel]').setDisabled( select.length != 1);
        gpsolicitud.down('menuitem[action=exportarWord]').setDisabled( select.length != 1);
        if(gpsolicitud.down('button[action=reenviarcorreo]'))gpsolicitud.down('button[action=reenviarcorreo]').setDisabled(this.comprobarReenviarCorreo(select, gpsolicitud));
        // gpsolicitud.down('button[action=crearcontrademanda]').setDisabled( select.length != 1 || !this.isActionAccess('createsupl', select, gpsolicitud)
        //     || (select.length==1 && select[0].get('desactivada')));

        // gpsolicitud.down('button[action=cambiarestadosolicitud]')[(select.length != 1 || cantEstados == 0)?'hide':'show']();
        gpsolicitud.down('button[action=cambiarestadosolicitud]').setDisabled(select.length != 1 || cantEstados == 0);
    },
    isActionAccess: function(action, select, grid){
        var me = this, result = true;
        if (Ext.isEmpty(select))
            return false;

        select.forEach(function (x) {
//             console.log(x)
            var estados=null
            if (x.data.cliente == '4')
                var estados = grid.getStore().proxy.reader.jsonData.estados_oferta;
            if (x.data.cliente == '3')
                var estados = grid.getStore().proxy.reader.jsonData.estados_demanda;
            if(x.get('cliente')=='2'){
                var estados=grid.getStore().proxy.reader.jsonData.estados_proveedor;
            }
            if (x.get('cliente')=='1' || estados==null) {
                var estados = grid.getStore().proxy.reader.jsonData.estados_cliente;
            }
            var estadoConfig = estados[x.get('idestado')];
//             console.log('estados', estados)
//             console.log('estadoConfig', estadoConfig)
            if(!estadoConfig){
                result = false;
                return false;
            }
            if (estadoConfig && estadoConfig.acciones.indexOf(action) == -1) {
                result = false;
                return false;
            }

        });
        return result;
    },
    updateBtnCambiarEstado: function(select, grid){
        var me = this,
            menu = this.getSolicitudNegocio().down('button[action=cambiarestadosolicitud]').menu;
        // menu.items.each(function(btn, index){
        //     menu.remove(btn);
        // });
        menu.removeAll();

        if(!Ext.isEmpty(select)){
            var estados = this.getNextStates(select[0], grid);
            Ext.each(estados, function (estado) {
                if (this.checkTransition(select[0].get('idestado'), estado.idestado)) {
                    menu.add({
                        text: estado.nombre,
                        idestado: estado.idestado,
                        idtransicion: estado.idtransicion,
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
        var me=this,
            estados = [];

        if (!record || !record.data.idestado) {
            return;
        }
        var datos=me.getEstados(record, grid);
        // if (record.data.cliente == '4')
        //     var datos = grid.getStore().proxy.reader.jsonData.estados_oferta;
        // if (record.data.cliente == '3')
        //     var datos = grid.getStore().proxy.reader.jsonData.estados_demanda;
        // if (record.data.cliente == '2')
        //     var datos = grid.getStore().proxy.reader.jsonData.estados_proveedor;
        // if (record.data.cliente=='1' || datos.length == 0) {
        //     var datos = grid.getStore().proxy.reader.jsonData.estados_cliente;
        // }
        // console.log('datos:', datos)
        // console.log('datos[record.data.idestado]:', datos[record.data.idestado])
        if (datos[record.data.idestado]) {
            var transiciones = datos[record.data.idestado]['transiciones'];
            Ext.each(transiciones, function (transicion) {
                var aux=datos[transicion['idestado']];
                aux['notificar']=transicion['notificar'];
                aux['idtransicion']=transicion['idtransicion'];
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
                    (transition.aliasproceso == 'solicitudnegocio' ||
                        transition.aliasproceso == 'solicitudnegocioproveedor' ||
                        transition.aliasproceso == 'solicituddemanda' ||
                        transition.aliasproceso == 'solicitudofertaimportacion')) {
                    exist = true;
                }
            }
        }
        if (!exist) {
            return true;
        }
        return false;
    },
    getEstados: function(record, grid){
        var datos=[];
        if (record.data.cliente == '4')
            var datos = grid.getStore().proxy.reader.jsonData.estados_oferta;
        if (record.data.cliente == '3')
            var datos = grid.getStore().proxy.reader.jsonData.estados_demanda;
        if (record.data.cliente == '2')
            var datos = grid.getStore().proxy.reader.jsonData.estados_proveedor;
        if (record.data.cliente=='1' || datos.length == 0) {
            var datos = grid.getStore().proxy.reader.jsonData.estados_cliente;
        }
        return datos;
    },
    onChangeEstado: function(btn){
        var me = this,
            sm =  me.getSolicitudNegocio().getSelectionModel(),
            values = {
                idsolicitud: sm.getSelection()[0].get('idsolicitud'),
                idestado: btn.idestado,
                idtransicion: btn.idtransicion,
            };

        mostrarMensaje(2, me.etiquetas.msgCambiarEstadoSolicitud, function (response) {
            if (response === 'ok') {
                Ext.MessageBox.show({
                    msg: me.etiquetas.msgCambiandoEstadoSolicitud,
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'cambiarSolicitudEstado'}, me),
                    params: {values: Ext.encode(values)},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        var info = Ext.decode(response.responseText);

                        if(info.success){
                            mostrarMensaje(1, info.datos.nuevoestado?me.etiquetas.msgSuccessCambiadoEstadoSolicitud:
                                'Usted ha hecho su voto al cambio de estado. <br>Se han realizado '+
                                info.datos.obligatoriosefectuados+' de '+info.datos.cantidadrolesobligatorios+' votos obligatorios.');
                            if(info.datos.nuevoestado) {
                                me.getSolicitudNegocio().getStore().load();
                                if (btn.notificar == 1) {
                                    values['modelName'] = 'SolicitudOfertaEstadoDService';
                                    me.enviarCorreo(values);
                                }
                            }
                        }else
                            mostrarMensaje(6, 'Error incorporar mensaje');

                    },
                    scope: me
                });
            }
        });

    },
    loadStoreEstadosFiltros: function(){
        var me = this,
            storeStado = me.getFpFiltrosSolicitud().cbEstado.getStore();

        for(i in me.configEstados){
            storeStado.add({
                'idestado' : me.configEstados[i]['idestado'],
                'denominacion' : me.configEstados[i]['nombre']
            });
        }
    },
    filtrarSolicitudes: function(){
        var values = this.getFpFiltrosSolicitud().getForm().getValues(),
            store = this.getSolicitudNegocio().getStore(),
            filters = [];

        store.clearFilter(true);
        for(i in values){
            if(!Ext.isEmpty(values[i]))
                filters.push({property:i, value: values[i]});
        }
        store.addFilter(filters);
    },
    limpiarFiltrosSolicitudes: function(){
        var store = this.getSolicitudNegocio().getStore();
        this.getFpFiltrosSolicitud().getForm().reset();
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
    comprobarReenviarCorreo: function (record, grid) {
        var me=this, estados=me.getEstados(record, grid);
        Ext.Object.each(estados, function(key, value){

        })
    }
});