Ext.define('DesgloseContrato.controller.DesgloseContrato', {
    extend: 'CRM.core.controller.Base',
    views: ['MainDesgloseContrato'],
    refs: [
        {ref: 'MainPanel', selector: 'dc_main'},
        {ref: 'GridHito', selector: 'dc_gridhito'},
        {ref: 'GridHitoArea', selector: 'dc_gridhitoarea'},
        {ref: 'WindowAreasImplicadas', selector: 'windowaddareasimplicadas'}
    ],

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {
                '#dc_stHito':{
                    beforeload: function(){
                        me.getGridHito().getSelectionModel().deselectAll();
                    },
                    load: me.afterLoadHitos
                },
                '#dc_stHitoArea':{
                    load: me.afterLoadHitosDetalles
                },
                '#dc_stHitoAreaGestionar': {
                    load: this.afterLoadHitosAreas,
                    add: function(){me.deshabilitarTabInactivo();},
                    update: function(){me.deshabilitarTabInactivo();},
                    remove: function(store){if(store.getCount()==0)me.habilitarTabs();},
                    bulkremove: function(store){if(store.getCount()==0)me.habilitarTabs();}
                },
                '#dc_stHitoAreaMonedaGestionar': {
                    load: this.afterLoadHitosAreas,
                    add: function(store){
                        me.deshabilitarTabInactivo();
                        console.log('add:', store.getCount())
                        // me.mostrarOpcionesVarios(store.getCount()>1);
                    },
                    update: function(store){
                        me.deshabilitarTabInactivo();
                        console.log('updtate:', store.getCount(), store.data.items.length)
                        // me.mostrarOpcionesVarios(store.getCount()>1);
                    },
                    remove: function(store){
                        if(store.getCount()==0)me.habilitarTabs();
                        console.log('remove:', store.getCount())
                        // me.mostrarOpcionesVarios(store.getCount()>1);
                    },
                    bulkremove: function(store){
                        console.log('bulkremove:', store.getCount(), store.data.items.length)
                        if(store.getCount()==0)me.habilitarTabs();
                        console.log('bulkremove:', store.getCount(), store.data.items.length)
                        // me.mostrarOpcionesVarios(store.getCount()>1);
                    }
                },
                '#stGridContratosDesglose':{
                    load: this.afterLoadContratos
                }
            },
            component: {
                'dc_main':{
                    afterrender: me.grantActions
                },
                'dc_main gridContratos': {
                    selectionchange: me.selectContrato
                },
                'dc_main dc_gridhito': {
                    selectionchange: me.selectHito
                },
                'dc_main dc_gridhito button[action]': {
                    click: me.onButtonClickHitos
                },
                'windowaddareasimplicadas form[itemId=formaddareasimplicadas]': {
                    validitychange: me.onValidityChange
                },
                'windowaddareasimplicadas button[action]': {
                    click: me.onButtonClickWindowAreas
                },
                'windowaddareasimplicadas grid[itemId=gridhitosareas]': {
                    selectionchange: me.selectionChangeGrid
                }
            }
        });
    },

//     onClickAction: function (cmp) {
//         var me = this;

//         switch (cmp.action) {
//             case 'contractdetail':
//                 this.createContractDetail(cmp);
//                 break;
//         }
//     },

    grantActions: function (grid) {
        this.validateGrantedActions({container: grid});
    },
    onButtonClickHitos: function(cmp){
        var me = this;
        switch (cmp.action) {
            case 'hitodetail':
                this.createHitoDetail(cmp);break;
            case 'gestionarareasimplicadas':
                me.openWindowGestionarAreasImplicadas();break;
            case 'certificardesglose':
                me.certificarDesglose(cmp);break;
            case 'filtrarfechas':
                me.filtrarPorFechas();break;
            case 'limpiarfechas':
                me.limpiarFiltroFechas();break;
            case 'heredardesglose':
                me.heredarDesglose(cmp);break;
        }
    },

    onButtonClickWindowAreas: function(cmp){
        var me = this;
        switch (cmp.action) {
            case 'addareaimplicada':
                me.addAreaImplicada();break;
            case 'delareaimplicada':
                me.removeAreaImplicada();break;
            case 'deltodasareaimplicada':
                me.removeTodasAreaImplicada();break;
            case 'generalAmonedas':
                me.generalAmonedas();break;
            case 'aceptar':
                me.guardarAreasImplicadas();break;
            case 'eliminar':
                me.eliminarAreasImplicadas();break;
        }
    },

    onValidityChange: function(yo, valid){
        var me=this, win=me.getWindowAreasImplicadas();
        console.log('validitychange', yo)
        win.down('#generalAmonedas').setDisabled(!valid);
        win.down('#aceptar').setDisabled(!valid);
    },

    afterLoadHitos: function(store, records, success){
        if(success){
            records.forEach(function(x){
                x.get('pago').forEach(function(y){
                    x.set('montomoneda_'+y['moneda'].toLowerCase()+'_'+y['idmoneda'], parseFloat(y['monto']))
                });
            })
        }
    },

    afterLoadHitosDetalles: function(store, records, success, eops){
        var me = this,
            main=me.getMainPanel();
        if(success && main){
            main.down('#tabpanelmain').down('#mainhitosareasmonedas').setDisabled(false);
            if(records.length>0){
                if(!records[0].raw.disribucionmonedas){
                    main.down('#tabpanelmain').setActiveTab('mainhitosareas');
                    main.down('#tabpanelmain').down('#mainhitosareasmonedas').setDisabled(true);
                }else{
                    main.down('#tabpanelmain').setActiveTab('mainhitosareasmonedas');
                }
            }
        }
    },

    afterLoadHitosAreas: function(store, records, success){
        var me = this;
        // console.log('load de ', store.storeId, records)
        if(success && me.getWindowAreasImplicadas()){
            // if(gridhitoarea.montototal)
            //     me.calcularMontos(store, gridhitoarea.montototal);
            if(records.length>0){
                store.editado=true;
                // me.getWindowAreasImplicadas().down('#totalporciento').regex=/^(10)?0$/;
                // me.actualizarDatosRestantes();
                // me.getWindowAreasImplicadas().down('#eliminar').setVisible(true);
                // me.getWindowAreasImplicadas().down('#eliminar').setDisabled(false);
                // if(records[0].raw.disribucionmonedas){
                //
                // }
                with(me.getWindowAreasImplicadas()){
                    down('#eliminar').setVisible(true);
                    down('#eliminar').setDisabled(false);
                    // me.mostrarOpcionesVarios(records.length>1);
                    if(records[0].raw.disribucionmonedas)
                        down('#tabpaneldesgloses').setActiveTab('gridhitosareasmonedas');
                    else
                        down('#tabpaneldesgloses').setActiveTab('gridhitosareas');
                    me.deshabilitarTabInactivo();
                }
                // console.log('que bola:', me.getWindowAreasImplicadas().down('#totalporciento'))
            }else{
                var gridhito=me.getGridHito(),
                    selected=gridhito.getSelectionModel().getSelection()[0],
                    entradaInicial={
                        'idarea': selected.data.idarea,
                        'denominacion': selected.data.nombrearea,
                        'porciento': 0, 'monto': 0
                    };
                if(gridhito.extrafields)
                    gridhito.extrafields.forEach(function(field){
                        entradaInicial['montomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda]=0;
                        entradaInicial['porcientomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda]=0;
                    })
                store.loadData([entradaInicial]);
            }
            if(store.storeId=='dc_stHitoAreaGestionar')me.actualizarDatosRestantes();
            if(store.storeId=='dc_stHitoAreaMonedaGestionar')me.actualizarDatosRestantesMonedas();
        }
    },

    afterLoadContratos: function(store, records, success){
        var me = this,
            gridhito=me.getGridHito(),
            gridhitosmonedas=me.getMainPanel().down('#mainhitosareasmonedas'),
            monedas=store.proxy.reader.jsonData.monedasentidad;
        if(success){
            if(!gridhitosmonedas.extrafields){
                gridhitosmonedas.extrafields=monedas;
                gridhitosmonedas.agregarColumnasMonedas();
            }

            if (!gridhito.extrafields) {
                var newcolumns = [], pos=-1,
                    extrafields=gridhito.extrafields=monedas;
                Ext.each(gridhito.columns, function (column, index) {
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
                    newcolumns = this.insertarColumnasMonedas(newcolumns, extrafields, pos);
                    gridhito.reconfigure(null, newcolumns);
                }
            }
        }
    },

    insertarColumnasMonedas: function (newcolumns, extrafields, pos) {
        var me=this;
        Ext.each(extrafields, function (field) {
            newcolumns.splice(pos, 0, {
                dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda,
                // dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase(),
                text: field.codigoiso.toUpperCase(),
                width: 80,
                align: 'right',
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
        // console.log('fields:', fields)
        return newcolumns;
    },

    createHitoDetail: function (cmp) {
        var grid = cmp.up('gridpanel'),
            main=this.getMainPanel();
            record = grid.getSelectionModel().getSelection()[0];
        fields=grid.getStore().model.getFields();
        fields.push('numerocontrato');
        grid.getStore().model.setFields(fields);
        if(main.down('#gridContratos').getSelectionModel().getSelection().length>0){
            numerocontrato=main.down('#gridContratos').getSelectionModel().getSelection()[0].get('numerocontrato');
            record.set('numerocontrato', numerocontrato);
        }
        Ext.create('Facturacion.view.DetailsWindow',{
            idcontrato:record.data.idcontrato}
        ).show(record);
    },

    selectContrato:function (sm, records) {
        var me = this,
            storehito=me.getGridHito().getStore();
        // if(storehito.isLoading()){
        //     Ext.Ajax.abort(storehito.proxy.activeRequest);
        //     delete storehito.proxy.activeRequest;
        // }
        // console.log('select contrato', records.length, storehito)
        if(records.length==1){
            storehito.proxy.extraParams.idcontratos=Ext.encode([records[0].get('idcontrato')]);
            storehito.load();
        }else{
             storehito.proxy.extraParams.idcontratos=null;
            storehito.removeAll();
        }
    },

    selectHito:function (sm, records) {
        var me = this,
            grid=me.getGridHito(),
            gridhitoarea=me.getMainPanel().down('#mainhitosareas'),
            gridhitoareamoneda=me.getMainPanel().down('#mainhitosareasmonedas'),
            storehitoarea=gridhitoarea.getStore(),
            storehitoareamoneda=gridhitoareamoneda.getStore();
        grid.btnDetails.setDisabled(records.length!=1);
        grid.btnGestionarAreasImplicadas.setDisabled(records.length!=1);
        grid.btnCertificar.setDisabled(records.length==0);
        // if(storehitoarea.isLoading()){
        //     Ext.Ajax.abort(storehitoarea.proxy.activeRequest);
        //     delete storehitoarea.proxy.activeRequest;
        // }
        // if(storehitoareamoneda.isLoading()){
        //     Ext.Ajax.abort(storehitoareamoneda.proxy.activeRequest);
        //     delete storehitoareamoneda.proxy.activeRequest;
        // }
        if(records.length==1){
            grid.btnGestionarAreasImplicadas.setDisabled(records[0].get('fechacertifico') && records[0].get('idusuariocertifico')!=window.parent.UCID.portal.perfil.idusuario);
            grid.btnCertificar.setDisabled(!records[0].get('tieneareasimplicadas'));
            // || (records[0].get('fechacertifico') && records[0].get('idusuariocertifico')!=window.parent.UCID.portal.perfil.idusuario)
            me.cambiarBtnCertifico(!records[0].get('fechacertifico'));
            grid.btnHeredar.setDisabled(records[0].get('fechacertifico') && records[0].get('idusuariocertifico')!=window.parent.UCID.portal.perfil.idusuario);
            // if(records[0].get('idusuariocertifico')==window.parent.UCID.portal.perfil.idusuario)
            //     me.cambiarBtnCertifico(false);

//             storehitoarea.proxy.extraParams.idhito=records[0].get('idhito');
            me.agregarFiltroHito(gridhitoarea, records);
            me.agregarFiltroHito(gridhitoareamoneda, records);
            // me.getGridHitoArea().montototal=records[0].get('montototal');
            // me.getGridHitoArea().montosmonedas=me.getMontosMonedasHito(records[0]);
            // storehitoarea.filters.removeAtKey('idhito');
            // storehitoarea.filter({
            //     id: 'idhito',
            //     property: 'idhito',
            //     value: records[0].get('idhito')
            // });
            // if(!storehitoarea.remoteFilter)
            //     storehitoarea.load();
        }else{
//             storehitoarea.proxy.extraParams.idhito=null;
//             storehitoarea.clearFilter(true);
            me.eliminarFiltroHito(gridhitoarea);
            me.eliminarFiltroHito(gridhitoareamoneda);
            // me.getGridHitoArea().montototal=null;
            // me.getGridHitoArea().montosmonedas=null;
            // storehitoarea.filters.removeAtKey('idhito');
            // storehitoarea.removeAll();
            if(records.length>1){
                var todasimplicadas=records.every(function(x){
                        return x.get('tieneareasimplicadas');}),
                    sincertifico=records.every(function(x){
                        return x.get('fechacertifico') && x.get('idusuariocertifico')!=window.parent.UCID.portal.perfil.idusuario;}),
                    todoscertificados=records.every(function(x){
                        return x.get('fechacertifico');});
                    todossincertificar=records.every(function(x){
                        return !x.get('fechacertifico');});
                    montocoincide=records.every(function(x){
                        return x.get('montototal')==records[0].get('montototal')}),
                    mismousuario=records.every(function(x){
                        return x.get('idusuariocertifico')==window.parent.UCID.portal.perfil.idusuario});
                // console.log('todasimplicadas', todasimplicadas)
                // console.log('sincertifico', sincertifico)
                // console.log('montocoincide', montocoincide)
                grid.btnGestionarAreasImplicadas.setDisabled(!montocoincide || !todossincertificar);
                grid.btnCertificar.setDisabled(!todasimplicadas || (!todoscertificados && !todossincertificar));
                //  || sincertifico || (!todoscertificados && !todossincertificar)
                grid.btnHeredar.setDisabled(!montocoincide || !todossincertificar);
                me.cambiarBtnCertifico(todossincertificar)
            }
        }
    },
    cambiarBtnCertifico: function(certificar){
        var me = this,
            grid=me.getGridHito();
        if(certificar){
            grid.btnCertificar.setIconCls('icondistra-deshabilitar');
            grid.btnCertificar.setText('Certificar');
        }else{
            grid.btnCertificar.setIconCls('icondistra-habilitar');
            grid.btnCertificar.setText('Descertificar');
        }
    },

    getMontosMonedasHito: function(record){
        var me=this,
            gridhito=me.getGridHito(),
            monedas={};
        if(gridhito.extrafields){
            gridhito.extrafields.forEach(function(x){
                monedas[x.codigoiso.toLowerCase()+'_'+x.idmoneda]=record.get('montomoneda_'+ x.codigoiso.toLowerCase()+'_'+x.idmoneda);
            })
        }
        return monedas;
    },

    openWindowGestionarAreasImplicadas: function(){
        var me=this,
            grid=me.getGridHito(),
            select=grid.getSelectionModel().getSelection(),
            idHitos=[];
        select.forEach(function(x){
            idHitos.push(x.get('idhito'));
        })
        var win=Ext.create('DesgloseContrato.view.WindowAddAreasImplicadas',{
            idhito: idHitos,
            montototal: select[0].get('montototal'),
            montosmonedas: me.getMontosMonedasHito(select[0]),
            extrafields: grid.extrafields
        });
        win.show(null, function(){
            win.down('#gridhitosareas').getPlugin().on('beforeedit', function(yo, obj){
                if(win.down('#gridhitosareas').getStore().getCount()>1){
                    if(obj.field=='porciento')
                        return false;
                    if(!obj.record.get('idlineanegocio') && obj.field=='producto')
                        return false;
                }
            })
            win.down('#gridhitosareas').getPlugin().on('edit', function(yo, obj){
                if(obj.field=='porciento'){
                    me.modificarValor(win.down('#gridhitosareasmonedas').getStore(),
                        obj.record.get('idarea'), obj.field, obj.record.get(obj.field));
                    me.calcularMontos(win.down('#gridhitosareas').getStore(), select[0].get('montototal'));
                    me.calcularMontos(win.down('#gridhitosareasmonedas').getStore(), select[0].get('montototal'));
                }else if(obj.field=='monto'){
                    me.modificarValor(win.down('#gridhitosareasmonedas').getStore(),
                        obj.record.get('idarea'), obj.field, obj.record.get(obj.field));
                    me.calcularPorcientos(win.down('#gridhitosareas').getStore(), select[0].get('montototal'));
                    me.calcularPorcientos(win.down('#gridhitosareasmonedas').getStore(), select[0].get('montototal'));
                }
                // var total=me.calcularPorcientoTotal();
                me.actualizarDatosRestantes();
                me.actualizarDatosRestantesMonedas();
            });
            win.down('#gridhitosareasmonedas').getPlugin().on('beforeedit', function(yo, obj){
                // if(win.down('#gridhitosareasmonedas').getStore().getCount()>1 && obj.field=='porciento')
                //     return false;
                if(win.down('#gridhitosareasmonedas').getStore().getCount()>1){
                    if(obj.field=='porciento')
                        return false;
                    if(!obj.record.get('idlineanegocio') && obj.field=='producto')
                        return false;
                }
            })
            win.down('#gridhitosareasmonedas').getPlugin().on('edit', function(yo, obj){
                if(obj.field.indexOf('porcientomoneda_')!=-1){
                    var moneda=obj.field.split('porcientomoneda_')[1];
                    me.calcularMontosMoneda(win.down('#gridhitosareasmonedas').getStore(), select[0].get('montomoneda_'+moneda), moneda)
                }else if(obj.field.indexOf('montomoneda_')!=-1){
                    var moneda=obj.field.split('montomoneda_')[1];
                    me.calcularPorcientosMoneda(win.down('#gridhitosareasmonedas').getStore(), select[0].get('montomoneda_'+moneda), moneda)
                }else if(obj.field=='lineanegocio'){

                }
                // var total=me.calcularPorcientoTotal();
                if(!win.down('#gridhitosareasmonedas').totalesFijos)
                    me.calcularMontosPorcientosMonedasTotales(win.down('#gridhitosareasmonedas').getStore(), win.montototal, win.extrafields);
                me.comprobarCorrecto(win.down('#gridhitosareasmonedas').getStore(), win.extrafields);
                me.actualizarDatosRestantesMonedas();
            });
            win.down('#gridhitosareas').getStore().filter('idhito', select[0].get('idhito'));
            win.down('#gridhitosareasmonedas').getStore().filter('idhito', select[0].get('idhito'));
            if(select.length==1 && select[0].get('indicadores')){
                win.idservicio=select[0].get('indicadores')[0]['idindicador'];
                win.servicio=select[0].get('indicadores')[0]['denominacion'];
            }

            // win.down('#gridhitosadicional').getStore().loadData(select);
        });
    },

    addAreaImplicada: function(){
        var me=this, 
            win=me.getWindowAreasImplicadas(),
            treeareas=win.down('#treeareas'),
            activeStore=win.down('#tabpaneldesgloses').getActiveTab().getStore(),
            gridhitosareas=win.down('#gridhitosareas'),
            storehitosareas=gridhitosareas.getStore(),
            gridhitosareasmonedas=win.down('#gridhitosareasmonedas'),
            storehitosareasmonedas=gridhitosareasmonedas.getStore(),
            existe=[];
//             console.log('gridhitosareas.idsAreas addAreaImplicada', gridhitosareas.idsAreas)
        treeareas.getSelectionModel().getSelection().forEach(function(x){
            // console.log('X:', x)
            if(activeStore.findExact('idarea', x.data.id)==-1){
                var porciento=0;
//                 if(!storehitosareas.editado){
//                     if(gridhitosareas.getStore().getCount()>0){
//                         var modPorciento=Math.floor(100/(gridhitosareas.getStore().getCount()+1)),
//                             sumPorciento=0;
//                         storehitosareas.getRange().forEach(function(y){
//                             y.set('porciento', modPorciento);
// //                             y.set('monto', (modPorciento*win.montototal)/100);
//                             sumPorciento+=modPorciento;
//                         });
//                         porciento=100-sumPorciento;
//                     }else{
//                         porciento=100;
//                     }
//                 }
                var entrada={
                    'idarea': x.data.id,
                    'denominacion': x.data.text,
                    'porciento': porciento, 'monto': 0,
                    'servicio': win.servicio,
                    'idservicio': win.idservicio,
                };
                if (win.extrafields)
                    win.extrafields.forEach(function(field){
                        entrada['montomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda]=0;
                        entrada['porcientomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda]=0;
                    })
                storehitosareas.add(entrada);
                storehitosareasmonedas.add(entrada);
//                 win.down('#totalporciento').setValue(me.calcularPorcientoTotal());

            }else{
                existe.push(x.data.text);
            }
        })
        me.calcularPorcientoTotal();
        me.calcularPorcientos(storehitosareas, win.montototal);
        me.actualizarDatosRestantes();
        // me.calcularPorcientoTotalMoneda();
        if(win.extrafields)
            win.extrafields.forEach(function(fields){
                me.calcularPorcientosMoneda(storehitosareasmonedas,
                    win.montosmonedas[fields.codigoiso.toLowerCase()+'_'+fields.idmoneda],
                    fields.codigoiso.toLowerCase()+'_'+fields.idmoneda);
            })
        me.actualizarDatosRestantesMonedas();
        if(existe.length>0){
            mostrarMensaje(8, 'No se han adicionado las siguientes áreas: <br>-'+existe.join('<br>-')+'.');
//             mostrarMensaje(8, 'No se han adicionado las siguientes áreas: '+existe.toString('-')+'.');
        }
        win.down('#eliminar').setDisabled(storehitosareas.getCount()==0);
//         gridhitosareas.getStore().add(treeareas.getSelectionModel().getSelection());

    },

    removeAreaImplicada: function(){
        var me=this, 
            win=me.getWindowAreasImplicadas(),
            activeTab=win.down('#tabpaneldesgloses').getActiveTab(),
            gridhitosareas=win.down('#gridhitosareas'),
            gridhitosareasmonedas=win.down('#gridhitosareasmonedas');
//         console.log('remove', activeTab.idsAreas)
//         activeTab.getSelectionModel().getSelection().forEach(function(x){
//             if(activeTab.idsAreas.indexOf(x.data.idarea)!=-1)
//                 activeTab.idsAreas.splice(activeTab.idsAreas.indexOf(x.data.idarea), 1);
//         })
        gridhitosareas.getStore().remove(activeTab.getSelectionModel().getSelection());
        gridhitosareasmonedas.getStore().remove(activeTab.getSelectionModel().getSelection());
        if(!activeTab.getStore().editado){
            var cantStore=activeTab.getStore().getCount();
            if(cantStore>0){
                if(cantStore==1){
                    activeTab.getStore().getRange()[0].set('porciento', 100);
//                     activeTab.getStore().getRange()[0].set('monto', win.montototal);
                }else{
                    var modPorciento=Math.floor(100/(activeTab.getStore().getCount())),
                    sumPorciento=0;
                    activeTab.getStore().getRange(0, cantStore-2).forEach(function(y){
                        y.set('porciento', modPorciento);
//                         y.set('monto', (modPorciento*win.montototal)/100);
                        sumPorciento+=modPorciento;
                    });
                    porciento=100-sumPorciento;
                    activeTab.getStore().getAt(cantStore-1).set('porciento', porciento);
//                     activeTab.getStore().getAt(cantStore-1).set('monto', (porciento*win.montototal)/100);
//                     console.log('modPorciento:', modPorciento)
//                     console.log('sumPorciento:', sumPorciento)
                    me.calcularMontos(activeTab.getStore(), win.montototal);
                }
            }
        }
        me.calcularPorcientoTotal();
        me.actualizarDatosRestantes();
        me.actualizarDatosRestantesMonedas();
        win.down('#eliminar').setDisabled(activeTab.getStore().getCount()==0);
    },

    removeTodasAreaImplicada: function(){
        var me=this, 
            main=me.getMainPanel(),
            win=me.getWindowAreasImplicadas(),
            activeTab=win.down('#tabpaneldesgloses').getActiveTab(),
            gridhitosareas=win.down('#gridhitosareas');
            gridhitosareasmonedas=win.down('#gridhitosareasmonedas');
        gridhitosareas.idsAreas=[];
        gridhitosareasmonedas.idsAreas=[];
        gridhitosareas.getStore().removeAll();
        gridhitosareasmonedas.getStore().removeAll();
        me.calcularPorcientoTotal();
        me.actualizarDatosRestantes();
        me.actualizarDatosRestantesMonedas();
        win.down('#eliminar').setDisabled(true);
    },

    generalAmonedas: function(){
        var me=this,
            win=me.getWindowAreasImplicadas();
        if(win.down('#formaddareasimplicadas').isValid()){
            win.down('#gridhitosareasmonedas').totalesFijos=true;
            win.down('#gridhitosareas').setDisabled(true);
            win.down('#gridhitosareasmonedas').setDisabled(false);
            win.down('#tabpaneldesgloses').setActiveTab('gridhitosareasmonedas');
            win.down('#gridhitosareasmonedas').doAutoRender();
            win.down('#formaddareasimplicadas').isValid();
        }else{
            mostrarMensaje(8, 'Debe estar correcta la distribución.');
        }

    },

    calcularPorcientoTotal: function(){
        var me=this, 
            win=me.getWindowAreasImplicadas(),
            gridhitosareas=win.down('#gridhitosareas'),
            suma=0;
        gridhitosareas.getStore().getRange().forEach(function(y){
            suma+=parseFloat(y.get('porciento'));
        });
        // win.down('#totalporciento').setValue(suma);
        win.down('#porcientorestante').setValue(me.formatNumber(100-suma)+'%');
        return suma;
    },

    calcularPorcientoTotalMoneda: function(moneda){
        var me=this,
            win=me.getWindowAreasImplicadas(),
            gridhitosareas=win.down('#gridhitosareasmonedas'),
            suma=0;
        gridhitosareas.getStore().getRange().forEach(function(y){
            suma+=parseFloat(y.get('porcientomoneda_'+moneda));
        });
        // console.log('suma:','porcientomoneda_'+moneda,':', suma)
        // win.down('#totalporciento').setValue(suma);
        if(win.down('#porcientorestante_'+moneda))
            win.down('#porcientorestante_'+moneda).setValue(me.formatNumber(100-suma)+'%');
        return suma;
    },

    calcularMontoTotal: function(){
        var me=this,
            win=me.getWindowAreasImplicadas(),
            gridhitosareas=win.down('#gridhitosareas'),
            suma=0;
        gridhitosareas.getStore().getRange().forEach(function(y){
            suma+=parseFloat(y.get('monto'));
        });
        win.down('#montorestante').setValue(Ext.util.Format.number(win.montototal-suma, '0.000,00/i'));
    },

    calcularMontoTotalMoneda: function(moneda){
        var me=this,
            win=me.getWindowAreasImplicadas(),
            gridhitosareas=win.down('#gridhitosareasmonedas'),
            suma=0;
        gridhitosareas.getStore().getRange().forEach(function(y){
            suma+=parseFloat(y.get('montomoneda_'+moneda));
        });
        win.down('#montorestante_'+moneda).setValue(Ext.util.Format.number(win.montosmonedas[moneda]-suma, '0.000,00/i'));
    },

    calcularMontos: function(store, montototal){
        store.getRange().forEach(function(x){
            //(modPorciento*win.montototal)/100)
            x.set('monto', (x.get('porciento')*montototal)/100)
        })
    },

    calcularMontosMoneda: function(store, montototal, moneda){
        store.getRange().forEach(function(x){
            //(modPorciento*win.montototal)/100)
            x.set('montomoneda_'+moneda, (x.get('porcientomoneda_'+moneda)*montototal)/100)
        })
    },

    calcularMontosPorcientosMonedasTotales: function(store, montototal, extrafields){
        store.getRange().forEach(function(x){
            //(modPorciento*win.montototal)/100)
            suma=0;
            extrafields.forEach(function(y){
                if(x.get('montomoneda_'+y.codigoiso.toLowerCase()+'_'+y.idmoneda))
                    suma+=parseFloat(x.get('montomoneda_'+y.codigoiso.toLowerCase()+'_'+y.idmoneda));
            })
            x.set('monto', suma);
            x.set('porciento', ((suma*100)/montototal).toFixed(2));
        })
    },

    comprobarCorrecto: function(store, extrafields){
        var me=this,
            win=me.getWindowAreasImplicadas(),
            correcto=true;
        store.getRange().forEach(function(x){
            suma=0;
            extrafields.forEach(function(y){
                if(x.get('montomoneda_'+y.codigoiso.toLowerCase()+'_'+y.idmoneda))
                    suma+=parseFloat(x.get('montomoneda_'+y.codigoiso.toLowerCase()+'_'+y.idmoneda));
            });
            x.set('incorrecto', suma!=x.get('monto'));
            if(suma!=x.get('monto'))correcto=false;
        })
        win.down('#correcto').setValue(correcto?'si':'')
        // console.log('CORRECTO:', correcto, win.down('#correcto').getValue())
        return correcto;
    },

    calcularPorcientos: function(store, montototal){
        var me=this;
        store.getRange().forEach(function(x){
            if(x.get('monto')!=0 && montototal!=0){
                x.set('porciento', ((x.get('monto')*100)/montototal).toFixed(2));
            }else{
                x.set('porciento', 0);
            }
        })
    },

    calcularPorcientosMoneda: function(store, montototal, moneda){
        var me=this;
        store.getRange().forEach(function(x){
            x.set('porcientomoneda_'+moneda, ((x.get('montomoneda_'+moneda)*100)/montototal).toFixed(2));
        })
    },
    actualizarDatosRestantes: function(){
        var me=this, win=me.getWindowAreasImplicadas(), sumaporciento=0, sumamonto=0;
        win.down('#gridhitosareas').getStore().getRange().forEach(function(x){
            sumaporciento+=parseFloat(x.get('porciento'));
            sumamonto+=parseFloat(x.get('monto'));
        })
        //console.log('sumamonto:', sumamonto)
        //console.log('sumaporciento:', sumaporciento)
        //console.log('100-sumaporciento to fic:', 100-parseFloat(sumaporciento.toFixed(2)))
        //console.log('me.formatNumber(100-sumaporciento):', me.formatNumber(100-parseFloat(sumaporciento.toFixed(2))))
        win.down('#porcientorestante').setValue(me.formatNumber(100-parseFloat(sumaporciento.toFixed(2)))+'%');
        win.down('#montorestante').setValue(Ext.util.Format.number(win.montototal-parseFloat(sumamonto.toFixed(2)), '0.000,00/i'));
    },
    actualizarDatosRestantesMonedas: function(){
        var me=this, win=me.getWindowAreasImplicadas(),
            sumaporciento=0, sumamonto=0, sumamontosmonedas={}, sumaporcientosmonedas={};
        if(win.extrafields)
            win.extrafields.forEach(function(field){
                sumamontosmonedas[field.codigoiso.toLowerCase()+'_'+field.idmoneda]=0;
                sumaporcientosmonedas[field.codigoiso.toLowerCase()+'_'+field.idmoneda]=0;
            })
        win.down('#gridhitosareasmonedas').getStore().getRange().forEach(function(x){
            sumaporciento+=parseFloat(x.get('porciento'));
            sumamonto+=parseFloat(x.get('monto'));
            Ext.Object.each(sumamontosmonedas, function(key, value){
                if(x.get('montomoneda_'+key))sumamontosmonedas[key]=value+parseFloat(x.get('montomoneda_'+ key));
            })
            Ext.Object.each(sumaporcientosmonedas, function(key, value){
                if(x.get('porcientomoneda_'+key))sumaporcientosmonedas[key]=value+parseFloat(x.get('porcientomoneda_'+ key));
            })
        })
        // console.log('sumamonedas:::', sumamonedas)
        win.down('#porcientorestantetotal').setValue(me.formatNumber(100-parseFloat(sumaporciento.toFixed(2)))+'%');
        win.down('#montorestantetotal').setValue(Ext.util.Format.number(win.montototal-sumamonto, '0.000,00/i'));
        Ext.Object.each(sumamontosmonedas, function(key, value){
            if(win.down('#toolbarmonedas').down('#porcientorestante_'+key))
                win.down('#toolbarmonedas').down('#porcientorestante_'+key).setValue(me.formatNumber(100-parseFloat(sumaporcientosmonedas[key].toFixed()))+'%');
            if(win.down('#toolbarmonedas').down('#montorestante_'+key))
                win.down('#toolbarmonedas').down('#montorestante_'+key).setValue(
                    Ext.util.Format.number(win.montosmonedas[key]-sumamontosmonedas[key], '0.000,00/i'));
        })
    },
    getHitosDatosAdicionales: function () {
        var modificados = [];
        var grid = this.getWindowAreasImplicadas().down('#gridhitosadicional'),
            store = grid.getStore(),
            cant = store.getCount(),
            records = store.getRange(0, cant - 1);

        Ext.each(store.getNewRecords(), function (valor) {
            //valor.data.indicadores = null;
            if(valor.get('idlineanegocio') || valor.get('idproductoasociado'))
                modificados.push(valor.data);
        });
        // console.log('modified:', store.getModifiedRecords())
        Ext.each(store.getModifiedRecords(), function (valor) {
            // valor.data.indicadores = null;
            if (modificados.indexOf(valor.data) == -1)
                if(valor.get('idlineanegocio') || valor.get('idproductoasociado'))
                    modificados.push(valor.data);
        });
        return modificados;
    },
    guardarAreasImplicadas: function(){
        var me=this,
            main=me.getMainPanel(),
            win=me.getWindowAreasImplicadas(),
            areasSeleccionadas=[],
            areasEliminadas=[];
        win.idhito.forEach(function(idhito){
            win.down('#tabpaneldesgloses').getActiveTab().getStore().getRange().forEach(function(x){
                var arrayMonedas=[];
                win.extrafields.forEach(function(y){
                    if(x.get('montomoneda_'+y.codigoiso.toLowerCase()+'_'+y.idmoneda))
                        arrayMonedas.push({
                            'monto': x.get('montomoneda_'+y.codigoiso.toLowerCase()+'_'+y.idmoneda),
                            'porciento': x.get('porcientomoneda_'+y.codigoiso.toLowerCase()+'_'+y.idmoneda),
                            'idmoneda': y.idmoneda,
                        });
                });
                areasSeleccionadas.push({
                    'idhitoareaimplicada': x.get('idhitoareaimplicada'),
                    'idarea': x.get('idarea'),
                    'porciento': x.get('porciento'),
                    'monto': x.get('monto'),
                    'idhito': idhito,
                    'monedas': arrayMonedas,
                    'idservicio': x.get('idservicio'),
                    'servicio': x.get('servicio'),
                    'idlineanegocio': x.get('idlineanegocio'),
                    'idproducto': x.get('idproducto'),
                })
            });
        })
        win.idhito.forEach(function(idhito) {
            win.down('#gridhitosareas').getStore().getRemovedRecords().forEach(function (x) {
                if (x.get('idhitoareaimplicada') != '')
                    areasEliminadas.push({'idarea': x.get('idarea'), 'idhito': idhito});
                // areasEliminadas.push(x.get('idhitoareaimplicada'));

            });
        });
        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardandoDatos,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'guardarAreasImplicadas'}, me),
            params: {
                areas: Ext.encode({'guardadas': areasSeleccionadas, 'eliminadas': areasEliminadas})
            },
            success: function (response, opts) {
                Ext.MessageBox.hide();
                var response = Ext.decode(response.responseText);
                if(response['success']){
                    if(areasSeleccionadas.length!=0){
                        mostrarMensaje(1, 'Las áreas implicadas han sido guardadas satisfactoriamente.');
                    }else{
                        mostrarMensaje(1, 'Las áreas implicadas han sido eliminadas satisfactoriamente.');
                        main.down('#mainhitos').getStore().load();
                    }
                    win.close();
                    if(win.idhito.length==1){
                        main.down('#mainhitos').getSelectionModel().getSelection()[0].set('tieneareasimplicadas', true)
                        main.down('#mainhitosareas').getStore().load();
                        main.down('#mainhitosareasmonedas').getStore().load();
                    }else{
                        main.down('#mainhitos').getStore().load();
                    }
                }
            },
            failure: function (response, opts) {
                Ext.MessageBox.hide();
            }
        });
    },
    eliminarAreasImplicadas: function(){
        var me = this,
            win = me.getWindowAreasImplicadas();
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        win.down('#gridhitosareas').getStore().removeAll();
                        win.down('#gridhitosareasmonedas').getStore().removeAll();
                        me.guardarAreasImplicadas();
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
            msg: me.etiquetas.lbConfirmEliminar,
            icon: Ext.MessageBox.QUESTION,
        });
    },
    habilitarTabs: function(){
        var me=this,
            tab=me.getWindowAreasImplicadas().down('#tabpaneldesgloses');
        tab.query('grid').forEach(function(x){
            x.setDisabled(false);
        })
    },
    deshabilitarTabInactivo: function(){
        var me=this,
            tab=me.getWindowAreasImplicadas().down('#tabpaneldesgloses');
        tab.query('grid').forEach(function(x){
            if(x!=tab.getActiveTab())
                x.setDisabled(true);
        })
    },
    mostrarOpcionesVarios: function(mostrar){
        var me=this,
            win=me.getWindowAreasImplicadas();
        console.log('mostrar:', mostrar)
        win.down('#paneladicionalhitos').setVisible(mostrar);
    },
    formatNumber: function(value){
        if(Math.round(value)!=value)
            return Ext.util.Format.number(value, '0.000,00/i');
        return value;
    },
    agregarFiltroHito: function(grid, records){
        var me=this;
        grid.montototal=records[0].get('montototal');
        grid.montosmonedas=me.getMontosMonedasHito(records[0]);
        with(grid.getStore()){
            filters.removeAtKey('idhito');
            filter({
                id: 'idhito',
                property: 'idhito',
                value: records[0].get('idhito')
            });
            if(!remoteFilter)
                load();
        }
    },
    eliminarFiltroHito: function(grid){
        with(grid){
            montototal=null;
            montosmonedas=null;
            getStore().filters.removeAtKey('idhito');
            getStore().removeAll();
        }
    },
    modificarValor: function(store, idarea, atributo, valor){
        var me=this,
            index=store.findExact('idarea', idarea);
        if(index!=-1){
            record=store.getAt(index);
            record.set(atributo, valor);
        }
    },
    certificarDesglose: function(btn){
        var me=this,
            grid=me.getGridHito(),
            selected=grid.getSelectionModel().getSelection(),
            idhitos=[],
            certificar=btn.iconCls=='icondistra-deshabilitar';
        // console.log(btn)
        // console.log(btn.iconCls)
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        selected.forEach(function(x){
                            idhitos.push(x.get('idhito'));
                        });
                        Ext.MessageBox.show({
                            msg: me.etiquetas.lbGuardandoDatos,
                            width: 300,
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'certificarDesglose'}, me),
                            params: {
                                idhitos: Ext.encode(idhitos),
                                certificar: certificar
                            },
                            success: function (response, opts) {
                                Ext.MessageBox.hide();
                                var response = Ext.decode(response.responseText);
                                if(response.success){
                                    if(response.msg){
                                        mostrarMensaje(6, response.msg);
                                    }else{
                                        idhitos.length==1?
                                            mostrarMensaje(1, (certificar?'El desglose ha sido certificado satisfactoriamente.':'El desglose ha sido descertificado satisfactoriamente.')):
                                            mostrarMensaje(1, (certificar?'Los desgloses han sido certificados satisfactoriamente.':'Los desgloses han sido descertificados satisfactoriamente.'));
                                    }
                                    grid.getStore().load();
                                }

                            },
                            failure: function () {
                                Ext.MessageBox.hide();
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
            msg: certificar?me.etiquetas.lbConfirmCertificar:me.etiquetas.lbConfirmDescertificar,
            icon: Ext.MessageBox.QUESTION,
        });

    },
    filtrarPorFechas: function(){
        var me=this,
            gridhitos=me.getGridHito();
        with(gridhitos.getStore()){
            if(gridhitos.down('#fechainicio').getValue()){
                proxy.extraParams['filter[20][field]']='fechaestimada';
                proxy.extraParams['filter[20][data][type]']='date';
                proxy.extraParams['filter[20][data][comparison]']='gt';
                proxy.extraParams['filter[20][data][value]']=gridhitos.down('#fechainicio').getValue();
            }
            if(gridhitos.down('#fechafin').getValue()){
                proxy.extraParams['filter[21][field]']='fechaestimada';
                proxy.extraParams['filter[21][data][type]']='date';
                proxy.extraParams['filter[21][data][comparison]']='lt';
                proxy.extraParams['filter[21][data][value]']=gridhitos.down('#fechafin').getValue();
            }
            load();
            gridhitos.down('#limpiarfechas').setDisabled(false);
        }
    },
    limpiarFiltroFechas: function(){
        var me=this,
            gridhitos=me.getGridHito();
        with(gridhitos.getStore()){
            if(proxy.extraParams['filter[20][field]']){
                delete proxy.extraParams['filter[20][field]'];
                delete proxy.extraParams['filter[20][data][type]'];
                delete proxy.extraParams['filter[20][data][comparison]'];
                delete proxy.extraParams['filter[20][data][value]'];
            }
            gridhitos.down('#fechainicio').reset();
            if(proxy.extraParams['filter[21][field]']){
                delete proxy.extraParams['filter[21][field]'];
                delete proxy.extraParams['filter[21][data][type]'];
                delete proxy.extraParams['filter[21][data][comparison]'];
                delete proxy.extraParams['filter[21][data][value]'];
            }
            gridhitos.down('#fechafin').reset();
            load();
            gridhitos.down('#limpiarfechas').setDisabled(true);
        }
    },
    heredarDesglose: function(cmp){
        var me=this;
        function showTooltip(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
        var win=Ext.create('Ext.ux.CustomWindow',{
            title: 'Heredar desgloses',
            width: window.innerWidth*0.95,
            minHeight: 260,
            maxHeight: window.innerHeight*0.95,
            layout: {type: 'hbox', align: 'stretch'},
            items:[
                Ext.create('Ext.grid.Panel',{
                    itemId: 'gridhitosheredar',
                    flex:1,
                    columns:[
                        {text: '# contrato', dataIndex: 'numerocontrato', width:120, renderer: showTooltip},
                        {text: 'Nombre contrato', dataIndex: 'nombrecontrato', flex: 1, renderer: showTooltip},
                        {text: '# hito', dataIndex: 'numero', width: 40, renderer: showTooltip},
                        {text: 'Hito', dataIndex: 'descripcion', flex: 1, renderer: showTooltip},
                        {text: 'Monto', dataIndex: 'montototal', width: 90, align: 'right', renderer: function(value, meta){
                                if (value){
                                    value=Ext.util.Format.number(value, '0.000,00/i');
                                    meta.tdAttr = 'data-qtip="' + value + '"';
                                }
                                return value;
                            }},
                    ],
                    store: Ext.create('Ext.data.Store',{
                        fields: ['numerocontrato', 'numero', 'descripcion',
                            'montototal', 'nombrecontrato', 'idhito'],
                        proxy: {
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'cargarHitosHeredar'}, ModuleMgr.get('DesgloseContrato')),
                            // actionMethods: {read: 'POST'},
                            reader: {
                                type: 'json',
                                root: 'data',
                                totalProperty: 'total',
                                successProperty: 'success'
                            },
                        },
                    }),
                    selModel: {
                        xtype: 'rowmodel',
                        listeners:{
                            selectionchange: function(sm, records){
                                win.btnAceptar.setDisabled(records.length!=1);
                                var gridhitoarea=win.down('#gridhitosareasheredar'),
                                    // gridhitoareamoneda=win.down('#gridhitosareasmonedasheredar'),
                                    storehitoarea=gridhitoarea.getStore();
                                    // storehitoareamoneda=gridhitoareamoneda.getStore();
                                // if(storehitoarea.isLoading()){
                                //     Ext.Ajax.abort(storehitoarea.proxy.activeRequest);
                                //     delete storehitoarea.proxy.activeRequest;
                                // }
                                // if(storehitoareamoneda.isLoading()){
                                //     Ext.Ajax.abort(storehitoareamoneda.proxy.activeRequest);
                                //     delete storehitoareamoneda.proxy.activeRequest;
                                // }
                                if(records.length==1){
                                    me.agregarFiltroHito(gridhitoarea, records);
                                    // me.agregarFiltroHito(gridhitoareamoneda, records);
                                }else if(records.length==0){
                                    me.eliminarFiltroHito(gridhitoarea);
                                    // me.eliminarFiltroHito(gridhitoareamoneda);
                                }
                            }
                        }
                    }
                }),
                {
                    xtype: 'tabpanel',
                    itemId: 'tabpanelheredar',
                    flex:1,
                    items:[
                        Ext.create('DesgloseContrato.view.GridHitosAreas',{
                            itemId: 'gridhitosareasheredar',
                            flex:1
                        }),
                        // Ext.create('DesgloseContrato.view.GridHitosAreasMonedas',{
                        //     itemId: 'gridhitosareasmonedasheredar',
                        //     flex:1
                        // })
                    ]
                }
            ]
        });
        win.show(null, function(){
            var select=cmp.up('grid').getSelectionModel().getSelection();
            var idhitos=[];
            select.forEach(function(x){
                idhitos.push(x.get('idhito'));
            })
            with(win.down('#gridhitosheredar').getStore()) {
                proxy.extraParams['filter[0][field]'] = 'montototal';
                proxy.extraParams['filter[0][data][type]'] = 'numeric';
                proxy.extraParams['filter[0][data][value]'] = select[0].get('montototal');
                proxy.extraParams['filter[1][field]'] = 'idhitos';
                proxy.extraParams['filter[1][data][type]'] = 'other';
                proxy.extraParams['filter[1][data][value]'] = idhitos.toString();
                load();
            }
            win.btnAceptar.setHandler(function(){
                Ext.MessageBox.show({
                    msg: me.etiquetas.lbGuardandoDatos,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });
                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'guardarHerencia'}, me),
                    params: {
                        idhitoheredar: win.down('#gridhitosheredar').getSelectionModel().getLastSelected().get('idhito'),
                        idhitos: Ext.encode(idhitos)
                    },
                    success: function (response, opts) {
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, 'El desglose ha sido heredado satisfactoriamente.');
                        win.close();
                        cmp.up('grid').getSelectionModel().deselectAll();
                        cmp.up('grid').getSelectionModel().select(cmp.up('grid').getSelectionModel().getLastSelected())
                    },
                    failure: function () {
                        Ext.MessageBox.hide();
                    }
                });
            });
        })
    },
    selectionChangeGrid: function(sm, records){
        var me=this, win=me.getWindowAreasImplicadas();
        if(records.length==1) {
            win.down('#idservicio').setValue(records[0].get('idservicio'));
            win.down('#servicio').setValue(records[0].get('servicio'));
        }else if(records.length>1){
            var valor=records[0].get('idservicio');
            var todos=records.every(function(x){
                return x.get('idservicio')==valor;
            });
            console.log('todos:', todos)
            if(todos){
                win.down('#idservicio').setValue(records[0].get('idservicio'));
                win.down('#servicio').setValue(records[0].get('servicio'));
            }else{
                win.down('#idservicio').setValue('');
                win.down('#servicio').setValue('');
            }
        }else{
            win.down('#idservicio').setValue('');
            win.down('#servicio').setValue('');
        }
    }

});
