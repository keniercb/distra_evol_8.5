Ext.define('SolicitudPago.controller.Main', {
    extend: 'CRM.core.controller.Base',

    views: ['Main'],

    refs: [
        {ref: 'mainPanel', selector: 'sp_main'},
        {ref: 'solicitudPagoWindow', selector: 'sp_solicitudpagowindow'},
        {ref: 'facturaWindow', selector: 'sp_facturawindow'},
        {ref: 'gridFacturas', selector: 'sp_gridfacturas'},
        {ref: 'contratoGrid', selector: 'sp_contratogrid'},
        {ref: 'solicitudPagoGrid', selector: 'sp_solicitudpagogrid'},
        {ref: 'seleccionarContratoWindow', selector: 'sp_windowseleccionarcontrato'}
    ],

    requires:[
        'SolicitudPago.view.GridSolicitudPago'
    ],

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {
                '#sp_stContratos': {
                    load: this.afterLoadContratos,
                    beforeload:function () {
                        var grid = this.getContratoGrid(),
                            sm = grid.getSelectionModel();
                        grid.getSelectionModel().clearSelections();
                        grid.fireEvent('selectionchange', sm, []);
                    }
                },
                '#st_facturas':{
                    load:function(yo, record, success){
                        if(success){
                            if(me.getSolicitudPagoWindow()){
                                me.getSolicitudPagoWindow().down('#facturasvalido').resetOriginalValue();
                                me.sumarImportes();
                                me.getSolicitudPagoWindow().down('#totalesAPagar').queryBy(function(x){
                                    if(Ext.isFunction(x.resetOriginalValue))
                                        x.resetOriginalValue();
                                });
                            }
                        }
                    }
                },
                '#sp_stSolicitudPago':{
                    beforeload:function () {
                        var grid = this.getSolicitudPagoGrid(),
                            sm = grid.getSelectionModel();
                        grid.getSelectionModel().clearSelections();
                        grid.fireEvent('selectionchange', sm, []);
                        grid.btnAdicionar.setDisabled(true);
                        if(me.getSolicitudPagoWindow()){
                            me.getSolicitudPagoWindow().mask= new Ext.LoadMask(
                                me.getSolicitudPagoWindow().down('#tabfacturas').el, {msg: this.etiquetas.msgLoading});
                            me.getSolicitudPagoWindow().mask.show();
                        }
                    },
                    load:function(yo, records, success){
                        me.getSolicitudPagoGrid().btnAdicionar.setDisabled(
                            me.getContratoGrid().getSelectionModel().getSelection().length!=1
                        );
                        if(yo.proxy.reader.jsonData)
                            me.getSolicitudPagoGrid().montos=yo.proxy.reader.jsonData.montos;
                        if(me.getSolicitudPagoWindow()){
                            if(yo.proxy.reader.jsonData) {
                                me.getSolicitudPagoWindow().montos = yo.proxy.reader.jsonData.montos;
                                me.sumarImportes();
                            }
                            if(me.getSolicitudPagoWindow().mask) {
                                me.getSolicitudPagoWindow().mask.hide();
                                me.getSolicitudPagoWindow().mask=null;
                            }
                        }
                    }
                },
                '#sp_stSeleccionarContratos':{
                    load: function(store, records, success){
                        var me=this;
                        if (success){
                            records.forEach(function(x){
                                if(x.get('idcontrato')==me.getSolicitudPagoWindow().down('#idcontrato').getValue())
                                    store.remove(x);
                            });
                        }
                    }
                }
            },
            component: {
                'sp_main':{
                    afterrender: this.grantActions
                },
                'sp_main sp_contratogrid': {
                    render:function(grid){ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);},
                    selectionchange: this.selectContrato,
                    itemdblclick: this.mostrarDetallesContrato
                },
                'sp_windowseleccionarcontrato sp_contratogrid': {
                    selectionchange: this.selectContratoWindow,
                },
                'sp_contratogrid button[action], sp_contratogrid menuitem[action]': {
                    click: this.onClickActionContratoGrid,
                },
                'sp_main sp_solicitudpagogrid': {
                    render:function(grid){ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);},
                    selectionchange: this.selectSolicitudPago,
                    itemdblclick: this.mostrarDetalles
                },
                'sp_solicitudpagowindow sp_gridfacturas':{
                    selectionchange: this.selectFactura
                },
                'sp_solicitudpagogrid button[action],sp_solicitudpagogrid menuitem[action]':{
                    click: this.onClickActionGridSolicitudPago
                },
                "sp_solicitudpagogrid button[action=dictamen], menuitem[action=dictamen]": {
                    click: this.showverdictamen,
                },

                'sp_gridfacturas button[action],sp_gridfacturas menuitem[action]':{
                    click: this.onClickActionGridFactura
                },
                'sp_solicitudpagowindow':{
                    render:this.comprobarValidez,
                    beforeshow: function () {
                        this.application.keyMap.disable();
                    },
                    close: function () {
                        this.application.keyMap.enable();
                    }
                },
                'sp_solicitudpagowindow button[action]':{
                    click:this.onClickSolicitudPagoWindow
                },
                'sp_facturawindow':{
                    render:this.comprobarValidez
                },
                'sp_facturawindow button[action]':{
                    click:this.onClickFacturaWindow
                },
                'sp_solicitudpagowindow combobox[localId],sp_solicitudpagowindow pickerfield[localId]':{
                    select:this.selectArea
                },
                'sp_solicitudpagowindow combobox[itemId=mediopago]':{
                    select:this.selectMedioPago
                },
                'sp_windowseleccionarcontrato button[action]':{
                    click: this.onClickSeleccionarContrato
                },
                'windetallessolicitudpago':{
                    beforeshow: function () {
                        if(this.application.keyMap){
                            this.application.keyMap.disable();
                        }
                    },
                    close: function () {
                        if(this.application.keyMap){
                            this.application.keyMap.enable();
                        }
                    }
                }
            }
        });
    },

    comprobarValidez: function(window){
        window.down('form').on('validitychange',function(form, valido){
            // console.log('validitychange', window.alias, valido)
            if(window.caso=='add'){
                window.btnAplicar.setDisabled(!valido);
                window.btnAceptar.setDisabled(!valido);
            }else if(window.caso=='mod'){
                window.btnAceptar.setDisabled(!valido || !form.isDirty());
            }
        });
        if(window.caso=='mod'){
            window.down('form').on('dirtychange',function(form, dirty){
                window.btnAceptar.setDisabled(!dirty);
            });
        }
    },

    selectArea: function(combo, records){
        var me=this;
        this.getSolicitudPagoWindow().down('#idarea').setValue(
            records[0].data[combo.localId]);
        var mask = new Ext.LoadMask(me.getSolicitudPagoWindow().down('#codigo').el,
            {msg: this.etiquetas.msgGenerandoCodigo});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerNumeroCodigo'}, me),
            params: {
                idarea: Ext.encode(records[0].data[combo.localId])
            },
            success: function (response) {
                mask.hide();
                var data=Ext.decode(response.responseText);
                me.getSolicitudPagoWindow().down('#codigo').setValue(data);
            },
            failure:function(response){
                mask.hide();
                mostrarMensaje(6, me.etiquetas.msgErrorGenerandoCodigo);
            }
        });
    },

    selectMedioPago:function(combo,records){
        this.getSolicitudPagoWindow().down('#idformapago').setValue(
            records[0].data['idmediodepago']);
    },

    onClickActionContratoGrid:function(button){
        var me=this, grid = me.getContratoGrid();
        switch (button.action) {
            case 'contractdetail':
                me.mostrarDetallesContrato();
                break;
            case 'clearfilters':
                grid.filters.clearFilters();
                break;
        }
    },

    mostrarDetallesContrato:function(){
        var me=this, grid = me.getContratoGrid();
        var record = grid.getSelectionModel().getSelection()[0];
        Ext.create('GestionContrato.view.DetailsWindow').show(record);
    },

    selectContrato:function(sm, records){
        var me=this;
        var storeSP=me.getSolicitudPagoGrid().getStore();
        // if(storeSP.isLoading()){
        //     Ext.Ajax.abort(storeSP.proxy.activeRequest);
        //     delete storeSP.proxy.activeRequest;
        // }
        if(records.length==0)
            me.getSolicitudPagoGrid().btnAdicionar.setDisabled(true);
        me.getContratoGrid().btnDetails.setDisabled(records.length!=1);
        if(records.length==1){
            me.getSolicitudPagoGrid().setTitle(me.etiquetas.lbTitleSolicitudPago+
                ' ('+me.etiquetas.lbContrato+': '+(records[0].get('numerocontrato')?
                records[0].get('numerocontrato'):records[0].get('nombre'))+')');
            me.getSolicitudPagoGrid().getStore().proxy.extraParams.idcontrato=records[0].get('idcontrato')
            me.getSolicitudPagoGrid().getStore().load();
        }else{
            me.getSolicitudPagoGrid().setTitle(me.etiquetas.lbTitleSolicitudPago);
            me.getSolicitudPagoGrid().getStore().proxy.extraParams.idcontrato=null;
            me.getSolicitudPagoGrid().getStore().removeAll();
        }
    },

    selectContratoWindow:function(sm, records) {
        var me = this;
        me.getContratoGrid().btnDetails.setDisabled(records.length!=1);
        if(me.getSeleccionarContratoWindow()){
            me.getSeleccionarContratoWindow().btnAceptar.setDisabled(records.length!=1);
        }
    },

    selectSolicitudPago:function(sm, records){
        var me=this;
        var grid=me.getSolicitudPagoGrid();
        grid.btnModificar.setDisabled(records.length!=1 || !me.isActionAccess('edit', records, grid));
        grid.btnEliminar.setDisabled(records.length==0 || !me.isActionAccess('del', records, grid));
        grid.btnDetails.setDisabled(records.length!=1);
        grid.btnDictamen.setDisabled(records.length!=1);
        grid.btnChangeState.setDisabled(records.length!=1);
        me.createMenu();
    },

    isActionAccess: function(action, select, grid){
        var me = this, result = true;
        if (Ext.isEmpty(select))
            return false;
        select.forEach(function (x) {
//             console.log(x)
            var estados = grid.getStore().proxy.reader.jsonData.estados;
            var estadoConfig = estados[x.get('idestado')];
//             console.log('estados', estados)
//             console.log('estadoConfig', estadoConfig)
            if (estadoConfig && estadoConfig.acciones.indexOf(action) == -1) {
                result = false;
                return false;
            }
        });
        return result;
    },

    createMenu: function () {
        var grid = this.getSolicitudPagoGrid(),
            menu = grid.btnChangeState.menu,
            estados = this.getNextStates(),
            record = grid.getSelectionModel().getSelection()[0];

        menu.removeAll();
        Ext.each(estados, function (estado) {
            if(this.checkTransition(record.data.idestado, estado.idestado)){
                menu.add({
                    text: estado.nombre,
                    iconCls: estado.icono,
                    tooltip: this.etiquetas.lbCambiarEstado+estado.nombre,
                    idestado: estado.idestado,
                    idtransicion: estado.idtransicion,
                    notificar: estado.notificar,
                    action: 'changestate'
                });
            }
        }, this);

        grid.btnChangeState.setDisabled(menu.items.length == 0);
    },

    getNextStates: function () {
        var grid = this.getSolicitudPagoGrid(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            estados = [];

        if (!record || !record.data.idestado) {
            return;
        }

        var datos = store.proxy.reader.jsonData.estados,
            transiciones=[];
        if(datos[record.data.idestado])
            transiciones = datos[record.data.idestado]['transiciones'];
        Ext.each(transiciones, function (transicion) {
            var aux=datos[transicion['idestado']];
            aux['notificar']=transicion['notificar'];
            aux['idtransicion']=transicion['idtransicion'];
            estados.push(aux);
        });
        return estados;
    },

    selectFactura:function(sm, records){
        var me=this;
        me.getGridFacturas().down('#modificar').setDisabled(records.length == 0 || records.length > 1)
        me.getGridFacturas().down('#eliminar').setDisabled(!records.length)
    },

    onClickActionGridSolicitudPago: function (cmp) {
        var me = this;
        switch (cmp.action) {
            case 'adicionarSP':
                this.solicitudPagoWindow('add', me.etiquetas.lbAddSP);
                break;
            case 'modificarSP':
                this.solicitudPagoWindow('mod', me.etiquetas.lbModSP);
                break;
            case 'detailSP':
                this.mostrarDetalles();
                break;
            case 'eliminarSP':
                this.eliminarSolicitudPago();
                break;
            case 'changestate':
                this.cambiarEstado(cmp);
                break;
            case 'clearfilters':
                me.getSolicitudPagoGrid().filters.clearFilters();
                break;
        }
    },

    showverdictamen: function () {
        var grid = this.getSolicitudPagoGrid(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0];
        id = record.data.idsolicitud;

        Ext.create('Comite.view.OpinionsWindow', {
            title: this.etiquetas.lbVerDictamenes,
            params: {
                id: id,
                tipo: 4,
                todos: 1,
                proceso: 'solicitudpago'
            },
            data: record.data
        }).show();
    },


    solicitudPagoWindow: function(caso, title){
        var me=this,
            selected=me.getContratoGrid().getSelectionModel().getSelection();
        var win=Ext.create('SolicitudPago.view.WindowSolicitudPago',{
            detalles: caso=='det',
            caso:caso,
            action: caso,
            title:title,
            idcontrato:selected[0].get('idcontrato'),
            extrafields: me.getContratoGrid().extrafields,
            monedas_contrato:selected.length>0?selected[0].get('monedas'):[],
            montos:me.getSolicitudPagoGrid().montos,
        });
        win.show(null, function(){
            if(selected.length>0){
                if(caso!='add'){
                    var selected2=me.getSolicitudPagoGrid().getSelectionModel().getSelection();
                    selected2[0].data.contrato=selected[0].get('numerocontrato')?
                        selected[0].get('numerocontrato')+' - '+selected[0].get('nombre'):
                        selected[0].get('nombre');
                    win.down('#gridfacturas').getStore().proxy.
                        extraParams.idsolicitudpago=selected2[0].get('idsolicitudpago');
                    win.down('#gridfacturas').getStore().load();
                    var cloneRecord=selected2[0].copy();
                    Ext.data.Model.id(cloneRecord);
                    cloneRecord.data.mediopago=null;
                    cloneRecord.set('hitos', Ext.decode(cloneRecord.data.hitos));
                    cloneRecord.set('indicadores', Ext.decode(cloneRecord.data.indicadores));
                    win.down('form').loadRecord(cloneRecord);

                    var mask=new Ext.LoadMask(win.down('#mediopago').getEl(),{msg:me.etiquetas.msgLoading});
                    mask.show();
                    win.down('#mediopago').getStore().load({
                        callback:function(){
                            mask.hide();
                            win.down('#mediopago').setValue(cloneRecord.get('idformapago'));
                            win.down('#mediopago').resetOriginalValue();
                        }
                    });
                    me.obtenerDatosHitosProductos('SolicitudPago', 'getDatosAdicionales', selected[0].get('idcontrato'), selected2[0]);
                }else{
                    win.down('#idcontrato').setValue(selected[0].get('idcontrato'));
                    selected[0].get('numerocontrato')?
                        win.down('#contrato').setValue(selected[0].get('numerocontrato')+' - '+selected[0].get('nombre')):
                        win.down('#contrato').setValue(selected[0].get('nombre'));
                    me.obtenerDatosHitosProductos('GestionContrato', 'getDatosAdicionales', selected[0].get('idcontrato'), null);
                }
                if(caso=='det'){
                    win.btnAceptar.setVisible(false);
                    win.btnAplicar.setVisible(false);
                    win.btnCancelar.setText('Cerrar');
                    win.btnCancelar.setIconCls('icondistra-cerrar');
                    win.down('form').queryBy(function(campo){
                        if(Ext.isFunction(campo.setReadOnly))
                            campo.setReadOnly(true);
                        if(campo.allowBlank==false){
                            campo.labelEl.dom.innerHTML=campo.getFieldLabel()+':';
                            campo.allowBlank=true;
                            if(Ext.isFunction(campo.validate))campo.validate();
                        }
                    });
                    
                }else{
                    setTimeout(function(){
                        win.down('#descripcion').focus();
                    }, 1000)

                }
            }
            win.doLayout();

        });
    },

    eliminarSolicitudPago:function(){
        var me =this;
        me.application.keyMap.disable();
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        var grid=me.getSolicitudPagoGrid(),
                            selected=grid.getSelectionModel().getSelection(),
                            idsolicitudespago=[];
                        selected.forEach(function(x){
                            idsolicitudespago.push(
                                {'id':x.get('idsolicitudpago'), 'codigo': x.get('codigo')})
                        });
                        dialog.close();
                        Ext.MessageBox.show({
                            msg: me.etiquetas.msgEliminandoSP,
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'eliminarSolicitudesPago'}, me),
                            params: {
                                idsolicitudespago: Ext.encode(idsolicitudespago)
                            },
                            success: function (response) {
                                me.application.keyMap.enable();
                                Ext.MessageBox.hide();
                                grid.getStore().load();
                                mostrarMensaje(1, me.etiquetas.msgEliminar);
                            },
                            failure:function(response){
                                me.application.keyMap.enable();
                                Ext.MessageBox.hide();
                            }
                        });
                    }
                },
                {
                    text: 'Cancelar',
                    iconCls: 'cancelar',
                    handler: function () {
                        dialog.close();
                        me.application.keyMap.enable();
                    }
                }
            ]
        });
        dialog.show({
            title:me.etiquetas.lbConfirmacion,
            msg: me.etiquetas.msgEliminarSP,
            icon: Ext.MessageBox.QUESTION,
        });

    },

    cambiarEstado: function (cmp) {
        var me = this,
            grid = this.getSolicitudPagoGrid(),
            record = grid.getSelectionModel().getSelection()[0],
            idestado = cmp.idestado;
        mostrarMensaje(2, me.etiquetas.msgCambiarEstado, function (response) {
            if (response === 'ok') {
                Ext.MessageBox.show({
                    msg: me.etiquetas.lbGuardando,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'cambiarEstado'}, me),
                    params: {
                        idestado: idestado,
                        idsolicitudpago: record.data.idsolicitudpago,
                        idtransicion: cmp.idtransicion,
                        responseCfg: {
                            action: 'edit',
                            gen: 'm',
                            concept: me.etiquetas.lbEstado,
                            count: 1
                        }
                    },
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        var info = Ext.decode(response.responseText);
                        if (success) {
                            mostrarMensaje(1, info.datos.nuevoestado ? 'La solicitud de pago ha cambiado de estado satisfactoriamente.' :
                                'Usted ha hecho su voto al cambio de estado. <br>Se han realizado ' +
                                info.datos.obligatoriosefectuados + ' de ' + info.datos.cantidadrolesobligatorios + ' votos obligatorios.');
                            if (info.datos.nuevoestado) {
                                grid.getStore().load();
                                if (cmp.notificar == 1) {
                                    me.enviarCorreo({
                                        idsolicitudpago: record.data.idsolicitudpago,
                                        idestado: idestado,
                                        idtransicion: cmp.idtransicion,
                                        modelName: 'SolicitudPagoModel'
                                    });
                                }
                            }
                        }
                    }
                });
            }
        });
    },

    mostrarDetalles:function(){
        var grid = this.getSolicitudPagoGrid(),
            record = grid.getSelectionModel().getSelection()[0];
        Ext.create('SolicitudPago.view.DetailsWindow').show(record);
    },

    onClickFacturaWindow: function(button){
        var me=this;
        if(button.action=='acept'){
            var windowF=button.up('window');
            if(me.getGridFacturas()){
                var store=me.getGridFacturas().getStore();
                if (store.find('numero',
                        windowF.down('form').down('#numero').getValue()) != -1 &&
                    windowF.down('#numero').isDirty()){
                    windowF.down('#numero').markInvalid(me.etiquetas.msgNumeroFacturaExiste);
                    mostrarMensaje(6,me.etiquetas.msgNumeroFacturaExiste);
                }else{

                    var datos=windowF.down('form').getForm().getValues();
                    datos.archivo=windowF.archivo.getValue();
                    Ext.Object.each(datos, function(key, value){
                        if(key.indexOf('importe')!=-1 && value)
                            datos[key]=value;
                    });
                    var doc=Ext.clone(windowF.archivo);
                    if(windowF.caso=='mod'){
                        var select=me.getGridFacturas().selModel.getSelection()[0];
                        if(doc.getValue().indexOf('fakepath')!=-1){
                            me.getSolicitudPagoWindow().down('#documentos_adjuntados').add(doc);
                            datos.archivoid=doc.name;
                            var document=me.getSolicitudPagoWindow().down('#documentos_adjuntados').
                            query('filefield[name='+select.get('archivoid')+']');
                            if(document.length!=0)
                                me.getSolicitudPagoWindow().down('#documentos_adjuntados').remove(document[0]);
                        }
                        select.set(datos);
                    }else{
                        me.getSolicitudPagoWindow().down('#documentos_adjuntados').add(doc);
                        datos.archivoid=doc.name;
                        store.add(datos);
                    }
                    me.sumarImportes();

                    windowF.close();
                }
            }
        }else if(button.action=='showfile'){
            var selected=me.getGridFacturas().selModel.getSelection(),
                url=selected[0].get('archivo');
            if(url){
                window.open(url);
            }else{
                mostrarMensaje(6, me.etiquetas.msgErrorNoFile);
            }
        }
    },

    obtenerDatosHitosProductos: function(modulo, peticion, idcontrato, datossolicitud){
        // GestionContrato
        var me=this, 
            winsolicitud=me.getSolicitudPagoWindow(),
            cargandoDatosAdicionales=true;
        winsolicitud.down('#tabobjetivos').on('render', function () {
            if (cargandoDatosAdicionales) {
                winsolicitud.down('#tabobjetivos').maskL = new Ext.LoadMask(
                    winsolicitud.down('#tabobjetivos'), {msg: me.etiquetas.msgLoading});
                winsolicitud.down('#tabobjetivos').maskL.show();
            }
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, ModuleMgr.get('SolicitudPago')),
            params: {
                idcontrato: idcontrato,
                // idsolicitudpago: idsolicitudpago
            },
            scope: this,
            callback: function (options, success, response) {
                cargandoDatosAdicionales=false;
                if(winsolicitud.down('#tabobjetivos').maskL)winsolicitud.down('#tabobjetivos').maskL.hide();
                var response = Ext.decode(response.responseText);
                if (response.data && winsolicitud.down('#productos')) {
                    if (response.data['productos']) {
                        var store = winsolicitud.down('#productos').store;
                        Ext.each(response.data['productos'], function (value, key) {
                            response.data['productos'][key]['datos_json_encode'] = value['datos_json'];
                            response.data['productos'][key]['datos_json'] = Ext.decode(value['datos_json']);
                        });
                        store.loadData(response.data['productos']);
                        winsolicitud.down('#productos').datosLoad = response.data['productos'];
                        store.fireEvent('loaddata', store);
                        store.fireEvent('update', store);
                        if(datossolicitud && datossolicitud.data.indicadores!='null'){
                            var indicadores = Ext.decode(datossolicitud.data.indicadores);
                            if(indicadores!=null && indicadores.length>0) {
                                if(winsolicitud.down('#tabpanelobjetivos').rendered){
                                    winsolicitud.down('#tabpanelobjetivos').setActiveTab(winsolicitud.down('#hitospago'));
                                    // winsolicitud.down('#productos').doAutoRender();
                                    store.getRange().forEach(function (x) {
                                        if (indicadores.indexOf(parseInt(x.get('idindicadorcontrato'))) != -1) {
                                            winsolicitud.down('#productos').getSelectionModel().select(x, true);
                                        }
                                    });
                                }else{
                                    winsolicitud.down('#tabpanelobjetivos').on('render', function () {
                                        winsolicitud.down('#tabpanelobjetivos').setActiveTab(winsolicitud.down('#hitospago'));
                                        // winsolicitud.down('#productos').doAutoRender();
                                        store.getRange().forEach(function (x) {
                                            if (indicadores.indexOf(parseInt(x.get('idindicadorcontrato'))) != -1) {
                                                winsolicitud.down('#productos').getSelectionModel().select(x, true);
                                            }
                                        });
                                    });
                                }

                            }
                        }
                    }
                }
                if (response.data && winsolicitud.down('#hitospago')){
                    var storeh = winsolicitud.down('#hitospago').store;
                    storeh.loadData(response.data['hitos']);
                    winsolicitud.down('#hitospago').datosLoad = response.data['hitos'];
                    storeh.fireEvent('loaddata', storeh);
                    storeh.fireEvent('update', storeh);
                    var hitos=[];
                    if(datossolicitud && datossolicitud.data.hitos!='null'){
                        var hitos = Ext.decode(datossolicitud.data.hitos);
                        if(hitos!=null && hitos.length>0) {
                            if(winsolicitud.down('#tabpanelobjetivos').rendered){
                                winsolicitud.down('#tabpanelobjetivos').setActiveTab(winsolicitud.down('#hitospago'));
                                // winsolicitud.down('#hitospago').doAutoRender();
                                storeh.getRange().forEach(function (x) {
                                    if (hitos.indexOf(parseInt(x.get('idhito'))) != -1) {
                                        winsolicitud.down('#hitospago').getSelectionModel().select(x, true);
                                    }
                                });
                            }else{
                                winsolicitud.down('#tabpanelobjetivos').on('render', function () {
                                    winsolicitud.down('#tabpanelobjetivos').setActiveTab(winsolicitud.down('#hitospago'));
                                    // winsolicitud.down('#hitospago').doAutoRender();
                                    storeh.getRange().forEach(function (x) {
                                        if (hitos.indexOf(parseInt(x.get('idhito'))) != -1) {
                                            winsolicitud.down('#hitospago').getSelectionModel().select(x, true);
                                        }
                                    });
                                });
                            }

                        }
                    }
                    if(me.getSolicitudPagoGrid().getStore().HitosSeleccionados.length>0){
                        var sobran=[];
                        if(typeof hitos == 'string')
                            hitos=Ext.decode(hitos);
//                         console.log('1:', me.getSolicitudPagoGrid().getStore().HitosSeleccionados, hitos)
                        if(hitos!=null && hitos.length>0){
                            me.getSolicitudPagoGrid().getStore().HitosSeleccionados.forEach(function(x){
                                if(hitos.indexOf(x)==-1){
                                    sobran.push(x)
                                }
                            });
                        }else{
                            sobran=me.getSolicitudPagoGrid().getStore().HitosSeleccionados;
                        }
                        storeh.getRange().forEach(function (x) {
//                             console.log('hito:', x.get('idhito'), sobran.indexOf(parseInt(x.get('idhito'))) )
                            if (sobran.indexOf(parseInt(x.get('idhito'))) != -1) {
                                storeh.remove(x);
                            }
                        });
//                         console.log('2:', sobran)
                    }
                }
            }
        });
    },

    sumarImportes: function(){
        var me=this,
            totalescontainer=me.getSolicitudPagoWindow().down('#totalesAPagar');
        totalescontainer.queryBy(function(x){
            if(Ext.isFunction(x.setValue))
                x.setValue(0);
        });
        me.getGridFacturas().getStore().getRange().forEach(function(obj){
            Ext.Object.each(obj.data, function(key,value){

                if(key.indexOf('importe')!=-1){
                    var moneda=key.split('importe')[1];
                    var campo=totalescontainer.down('#importepagar'+moneda);
                    if(campo && value) {
                        campo.setValue(
                            parseFloat(campo.getValue()) + parseFloat(value)
                        );
                    }
                }
            })
        });

        totalescontainer.queryBy(function(x){
            if(Ext.isFunction(x.setValue))
                x.setValue(Ext.util.Format.currency(x.getValue()));
        });

    },

    onClickSolicitudPagoWindow: function(button){
        var me=this, window=button.up('window'),
            notificarinicial=this.application.notificarinicial,
        form=window.down('form').getForm(), facmodi=[], facdel=[], facturas={}, hitos=[], indicadores=[];
            if(button.action=='acept' || button.action=='apply'){
                if (me.getGridFacturas()) {
                    var store = me.getGridFacturas().getStore();
                    store.getModifiedRecords().forEach(function (obj) {
                        var monedas=[];
                        window.extrafields.forEach(function(valor){
                            Ext.Object.each(obj.data, function(key, value){
                                if(value && key=='importe'+valor['codigoiso'].toLowerCase()){
                                    monedas.push({
                                        'moneda': valor['codigoiso'],
                                        'idmoneda': valor['idmoneda'],
                                        'valor': value,
                                    });
                                }
                            });
                        });
                        facmodi.push({
                            'idfactura': obj.get('idfactura'),
                            'numero': obj.get('numero'),
                            'archivo':obj.get('archivo'),
                            'monedas': monedas,
                            'archivoid': obj.get('archivoid'),
                            'idnodoarchivo': obj.get('idnodoarchivo'),
                        });
                    });
                    store.getRemovedRecords().forEach(function (obj) {
                        facdel.push({
                            'idfactura': obj.get('idfactura'),
                            'idnodoarchivo': obj.get('idnodoarchivo'),
                        });
                    });
                    facturas={'modificadas': facmodi, 'eliminadas': facdel};
                }
                // if(window.down('#hitospago')){
                //     console.log(window.down('#hitospago').getSelectionModel().getSelection())
                //     window.down('#hitospago').getSelectionModel().getSelection().forEach(function(x){
                //         hitos.push(parseInt(x.get('idhito')));
                //     })
                // }
                // if(window.down('#productos')){
                //     window.down('#productos').getSelectionModel().getSelection().forEach(function(x){
                //         indicadores.push(parseInt(x.get('idindicadorcontrato')));
                //     })
                // }

                if (form.isValid()) {
                        Ext.MessageBox.show({
                            msg: me.etiquetas.lbGuardando,
                            width: 300,
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        form.submit({
                            url: UtilsFn.buildUrl({action: 'guardarSolicitudPago'}, me),
                            params: {
                                facturas: Ext.encode(facturas),
                                // hitos: Ext.encode(hitos),
                                // indicadores: Ext.encode(indicadores)
                            },
                            success: function (form, action) {
                                Ext.MessageBox.hide();
                                var json=Ext.JSON.decode(action.response.responseText);
                                if(!json.gestordoc && json.archivos>0)
                                    mostrarMensaje(8,me.etiquetas.msgNoGuardarDocumentogestorDoc);
                                if(button.action=='acept'){
                                    window.close();
                                }else{
                                    me.getGridFacturas().getStore().removeAll();
                                    var contrato=window.down('#contrato').getValue(),
                                        idcontrato=window.down('#idcontrato').getValue();
                                    form.reset();
                                    window.down('#contrato').setValue(contrato);
                                    window.down('#idcontrato').setValue(idcontrato);
                                    window.down('#documentos_adjuntados').removeAll();
                                    form.clearInvalid();
                                }

                                mostrarMensaje(1,window.caso=='add'?me.etiquetas.msgAdicionar:me.etiquetas.msgModificar);
                                if(window.caso=='add') {
                                    var actual = notificarinicial['solicitudpago'];
                                    if (actual && actual['notificar'] == '1')
                                        me.enviarCorreo({
                                            destinatarios: actual['notificaciones'],
                                            cuerpo: 'Ha sido insertado un nuevo ' + actual['denominacion'].toLowerCase() + ' con el número <b style="color:#3158a0">'
                                                + params['numero'] + '</b> y nombre <b style="color:#3158a0">' + params['nombre'] + '</b>.'
                                        });
                                }
                                me.getSolicitudPagoGrid().getStore().load();
                            },
                            failure: function (form, action) {
                                Ext.MessageBox.hide();
                            }
                        });
                }else{
                    mostrarMensaje(6,me.etiquetas.msgFormularioInvalido);
                }
            }else if(button.action=='contractdetail') {
                me.onClickActionContratoGrid(button);
            }else if(button.action=='seleccionarcontrato') {
                Ext.create('SolicitudPago.view.WindowSeleccionarContrato').show();
            }else if(button.action=='generarfacturas') {
                me.generarFacturasAutomaticamente();
            }
    },

    existeCodigo: function(codigo, idsolicitudpago){
        var me = this, existe=false;
        me.getSolicitudPagoGrid().getStore().getRange().forEach(function(obj){
            if(obj.get('codigo')==codigo && obj.get('idsolicitudpago')!=idsolicitudpago)existe=true;
        });
        return existe;
    },

    generarFacturasAutomaticamente: function(){
        var me=this,
            gridFacturas=me.getGridFacturas(),
            tabPanel=me.getSolicitudPagoWindow().down('#tabpanel');
        if(gridFacturas.getStore().getCount()>0){
            var dialog = Ext.create('Ext.window.MessageBox', {
                buttonAlign: 'center',
                buttons: [
                    {
                        text: 'Aceptar',
                        iconCls: 'aceptar',
                        handler: function () {
                            me.generarFacturas();
                            dialog.close();
                        }
                    },
                    {
                        text: 'Cancelar',
                        iconCls: 'cancelar',
                        handler: function () {
                            dialog.close();
                        }
                    }
                ]
            });
            dialog.show({
                title:me.etiquetas.lbConfirmacion,
                msg: 'Ya existen facturas insertadas si continue estas se perder&aacute;n.<br>' +
                '¿Est&aacute; seguro que desea continuar?',
                icon: Ext.MessageBox.QUESTION,
            });
        }else{
            me.generarFacturas();
        }
    },

    generarFacturas: function(){
        var me = this,
            solicitudWindow=me.getSolicitudPagoWindow(),
            gridFacturas=me.getGridFacturas(),
            storeFacturas=gridFacturas.getStore(),
            tabPanel=solicitudWindow.down('#tabpanel'),
            gridActivo=solicitudWindow.down('#tabpanelobjetivos').getActiveTab(),
            cont=1;
        storeFacturas.removeAll();
        if(gridActivo.itemId=='hitospago'){
            gridActivo.getSelectionModel().getSelection().forEach(function(x){
                var datos={
                    'numero': cont,
                };
                x.get('pago').forEach(function(y){
                    datos['importe'+y['moneda'].toLowerCase()]=y['monto'];
                });
                storeFacturas.add(datos);
                storeFacturas.fireEvent('datachanged', storeFacturas);
                cont++;
            });
        }
        else if(gridActivo.itemId=='productos'){
            gridActivo.getSelectionModel().getSelection().forEach(function(x){
                var datos={
                    'numero': cont,
                    'importecup': x.get('precio'),
                    'importecuc': x.get('preciodivisa'),
                };
                storeFacturas.add(datos);
                storeFacturas.fireEvent('datachanged', storeFacturas);
                cont++;
            });
        }
        tabPanel.setActiveTab(solicitudWindow.down('#tabfacturas'));

    },

    onClickSeleccionarContrato: function(button) {
        var me = this, window = button.up('window');
        switch (button.action) {
            case 'acept':
                if(me.getSolicitudPagoWindow()){
                    var win=me.getSolicitudPagoWindow(),
                        selected=window.down('grid').getSelectionModel().getSelection();
                    win.down('#idcontrato').setValue(selected[0].get('idcontrato'));
                    selected[0].get('numerocontrato')?
                        win.down('#contrato').setValue(selected[0].get('numerocontrato')+' - '+selected[0].get('nombre')):
                        win.down('#contrato').setValue(selected[0].get('nombre'));
                    me.getMainPanel().down('#contratogrid').getSelectionModel().select(selected[0]);
                    win.monedas_contrato=selected[0].get('monedas');
                    win.configurarMontos();
                    me.sumarImportes();
                }
                window.close();
                break;
        }
    },

    onClickActionGridFactura: function (cmp) {
        var me = this;
        switch (cmp.action) {
            case 'detfactura':
                this.WindowFactura('det', me.etiquetas.lbDetFactura);
                break;
            case 'addfactura':
                this.WindowFactura('add',me.etiquetas.lbAddFactura);
                break;
            case 'modfactura':
                this.WindowFactura('mod', me.etiquetas.lbModFactura);
                break;
            case 'delfactura':
                this.delFactura();
                break;
        }
    },

    WindowFactura: function(caso, title){
        var me=this, gridfacturas=me.getGridFacturas(), windowsolicitud=me.getSolicitudPagoWindow(),
            selected=gridfacturas.selModel.getSelection();
        var win=Ext.create('SolicitudPago.view.WindowFactura',{
            detalles: caso=='det',
            title: title,
            caso:caso,
            extrafields: gridfacturas.extrafields,
            monedas_contrato: gridfacturas.monedas_contrato,
            totales:gridfacturas.up('window').down('#totalesAPagar'),
            montos:windowsolicitud.montos,
            selected:selected,
            gridfacturas:gridfacturas
        });
        win.show(null, function(){
            if(caso!='add' && selected.length==1){
                win.down('form').loadRecord(selected[0]);
                if(selected[0].get('archivoNombre')){
                    win.archivo.setRawValue(selected[0].get('archivoNombre'));
                    if(selected[0].get('idespaciotrabajo') && selected[0].get('archivo'))
                        win.down('#mostrarArchivo').setVisible(true);
                }
                if(gridfacturas.getStore().proxy.reader.jsonData)
                    if(gridfacturas.getStore().proxy.reader.jsonData.gestordoc==false && !selected[0].get('selected')){
                        mostrarMensaje(1,me.etiquetas.msgNoDocumentogestorDoc);
                    }
            }else if(caso=='add'){
            }
        });
    },

    delFactura:function(){
        var me=this;
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        var selected=me.getGridFacturas().selModel.getSelection();
                        me.getGridFacturas().getStore().remove(selected);
                        // me.getGridFacturas().getStore().fireEvent('datachanged', me.getGridFacturas().getStore());
                        me.sumarImportes();

                        selected.forEach(function(x){
                            if(me.getSolicitudPagoWindow().down('#documentos_adjuntados').
                                query('filefield[name=doc_'+x.get('numero')+']').length>0){
                                me.getSolicitudPagoWindow().down('#documentos_adjuntados').remove(
                                    me.getSolicitudPagoWindow().down('#documentos_adjuntados').
                                    query('filefield[name=doc_'+x.get('numero')+']')[0]
                                );
                            }
                        });
                        dialog.close();
                    }
                },
                {
                    text: 'Cancelar',
                    iconCls: 'cancelar',
                    handler: function () {
                        dialog.close();
                    }
                }
            ]
        });
        dialog.show({
            title:me.etiquetas.lbConfirmacion,
            msg: me.etiquetas.msgEliminarFactura,
            icon: Ext.MessageBox.QUESTION,
        });
    },

    afterLoadContratos: function (store, records, success) {
        if(success){
            var grid = this.getContratoGrid();
            if (!grid.extrafields) {
                this.addExtraColumns(grid);
            }
        }
    },

    addExtraColumns: function (grid) {
        var store = grid.getStore(),
            fields = store.model.getFields(),
            jsondata = store.proxy.reader.jsonData,
            extrafields = grid.extrafields = jsondata.monedasentidad,
            data = jsondata.data,
            columns = grid.columns,
            newfields = [],
            newcolumns = [],
            pos = -1;
        Ext.each(columns, function (column, index) {
            if (extrafields && extrafields.length != 0) {
                if (column.dataIndex == 'montototal') {
                    pos = index;
                }
                newcolumns.push(column.initialConfig);
            } else {
                newcolumns.push(column.initialConfig);
            }
        });
        if (pos != -1) {
            newcolumns = this.insertColumnsCoins(newcolumns, extrafields, pos);
            var width = grid.getWidth() + (extrafields.length * 80);
            grid.reconfigure(null, newcolumns);
        }
    },

    insertColumnsCoins: function (newcolumns, extrafields, pos) {
        Ext.each(extrafields, function (field) {
            newcolumns.splice(pos, 0, {
                dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda,
                text: field.codigoiso.toUpperCase(),
                width: 70,
                minWidth:50,
                align: 'right',
                groupable: false,
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta) {
                    if (Ext.isEmpty(value)) {
                        value = 0;
                    }
                    value = Ext.util.Format.currency(value);
                    meta.tdAttr = 'data-qtip="' + value + '"';

                    return value;
                },
                summaryType: function (records, dataindex, b) {
                    var total = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex))
                            total += parseFloat(x.get(dataindex));
                    });
                    return total;
                }
            });
            pos++;
        });
        return newcolumns;
    },

    grantActions: function (panel) {
        this.validateGrantedActions({container: panel});
        this.loadConf(panel);
    },

    loadConf: function (panel) {
        var mask = new Ext.LoadMask(this.getMainPanel(), {msg: this.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getConfiguraciones'}, this),
            scope: this,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                this.application.comite = {
                    transitions: response.transitions
                };
                this.application.notificarinicial=response.notificarinicial;
                mask.hide();
                panel.down('sp_contratogrid').getStore().load();
            }
        });
    },

    checkTransition: function (idestadoinicial, idestadofinal) {
        var exist = false,
            comite = this.application.comite,
            activo = this.application.crm.activeModules.Comite;
        if (activo == "true" && comite && comite.transitions) {
            for (var k in comite.transitions) {
                var transition = comite.transitions[k];
                if (transition.idestadoinicial == idestadoinicial && transition.idestadofinal == idestadofinal &&
                    transition.aliasproceso == 'solicitudpago' ) {
                    exist = true;
                }
            }
        }

        if (!exist) {
            return true;
        }
        return false;
    },
});
