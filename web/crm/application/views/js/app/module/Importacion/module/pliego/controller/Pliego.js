Ext.define('Pliego.controller.Pliego', {
    extend: 'CRM.core.controller.Base',
    views: ['Main'],
    refs: [
        {ref: 'Main', selector: 'mainpliego'},
        {ref: 'Panelofertas', selector: 'panelofertas'},
        {ref: 'Gridprincipal', selector: 'gridprincipal'},
        {ref: 'Windowanalisis', selector: 'windowanalisis'},
        {ref: 'Panelseleccionar', selector: 'panelseleccionar'}
        // itemsIds: gridprincipal, tabvistaoferta, gridofertas
    ],
    requires: [
        'Ext.ux.SearchField',
        'Ext.XTemplate',
        'Ext.util.Format.*'
    ],
    init: function () {
        var me = this;

        me.getLang();

        this.etiquetas = LangMgr.getLang(this);

        me.listen({
            store: {
                '#storeofertas': {
                    load: me.loadOfertas
                },
                '#storeTodasOfertas': {
                    load: me.loadTodasOfertas
                }
            },
            component: {
                'mainpliego':{
                    afterrender: this.cargarConfiguracion,
                },
                'panelofertas combobox[itemId=idsolicitud]':{
                    select: me.selectSolicitud,
                    change: me.changeSolicitud,
                },
                'panelofertas grid[itemId=gridofertas]':{
                    selectionchange: me.selectOferta
                },
                'gridprincipal toggleslidefield[action]': {
                    change: me.onToggleAction
                },
                'gridprincipal button[action], gridprincipal menuitem[action]': {
                    click: me.onButtonClickPrincipal
                },
                'panelofertas button[action]': {
                    click: me.onButtonClickOfertas
                },
                'panelofertas radiogroup[itemId=tiposolicitudes]': {
                    change: me.onChangeFiltroSolicitudes
                },
                'panelofertas datefield': {
                    change: me.onChangeDateField
                },
                'porcientofield': {
                    change: me.calcularTotalPorcientos
                },
                'windowanalisis  button[action]': {
                    click: me.onButtonWindowAnalisis
                },
                'windowanalisis  grid[itemId=gridseleccionarofertas]': {
                    selectionchange: me.selectOfertasSeleccionar
                }
            }
        });
    },
    cargarConfiguracion: function(){
        var me = this, main=me.getMain(),
            mask = new Ext.LoadMask(this.getMain(), {msg: this.etiquetas.msgCargandoConfiguracion});
        mask.show();
        main.down('#panelofertas').down('panel').down('#container1').doLayout();
        // main.down('#panelofertas').down('panel').down('#container1').doAutoLayout();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getConfiguracion'}, this),
            scope: this,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                mask.hide();
                if(success){
                    main.configPliego=response;
                    var radiogroup=main.down('#tiposolicitudes');
                    if(!response.configsolicitud.solicituddemandalista){
                        mostrarMensaje(8, 'No se encuentra configurado el estado de la solicitud de oferta lista.');
                    }
                    if(!response.configoferta.idestadosolicitudofertainsertar){
                        mostrarMensaje(8, 'No se encuentra configurado el estado de la oferta de compra lista.');
                    }
                    if(!response.idlistopliego){
                        mostrarMensaje(8, 'No se encuentra configurado el estado de la solicitud de pliego listo.');
                    }
                    this.application.monedasentidad=response.monedasconfig;
                    me.realizarFiltrosSolicitud();
                    // panelofertas.down('#idsolicitud').getStore().proxy.extraParams={  //me.idestadosolicitud
                    //     'filter[0][field]': 'cliente',
                    //     'filter[0][data][type]': 'list',
                    //     'filter[0][data][value]': '[4]',
                    //     'filter[1][field]': 'estado',
                    //     'filter[1][data][type]': 'list',
                    //     'filter[1][data][value]': '['+(radiogroup.getValue()['rb']=='nuevas'?response.config.idestadosolicitudofertainsertar:response.idlistopliego)+']',
                    //     // 'filter[1][data][value]': '['+me.idestadosolicitud+']',
                    //
                    //     // me.context == 'cliente' ? 1 : 2
                    // };
                }else{
                    mostrarMensaje(7, 'Ha ocurrido un error cargando la configuración.')
                }

            }
        })
    },
    onButtonClickPrincipal: function(cmp){
        var me=this;
        switch (cmp.action) {
            case 'update':
                me.actualizarGridPrincipal();break;
            case 'importarultimacompra':
                me.importarUltimaCompra();break;
            case 'guardarultimacompra':
                me.guardarUltimaCompra();break;
            case 'analizar':
                me.analizarOferta();break;
            case 'exportar':
                me.exportarPliego();break;
        }
    },
    onButtonClickOfertas: function(cmp){
        var me=this;
        switch (cmp.action) {
            case 'detallessolicitud':
                me.verDetallesSolicitud();break;
            case 'buscarrango':
                me.onChangeFiltroSolicitudes();
                me.onBuscarRango();
                break;
        }
    },
    onButtonWindowAnalisis: function(cmp){
        var me=this;
        switch (cmp.action) {
            case 'seleccionarofertas':
                me.abrirSeleccionarOfertas(cmp);break;
            case 'analizarimportancia':
                me.analizarImportancia(cmp);break;
            case 'realizarseleccion':
                me.realizarSeleccion(cmp);break;
        }
    },
    onToggleAction: function(cmp){
        var me=this;
        switch (cmp.action) {
            case 'changemostrar0':
                me.changemostrarceros();break;
        }
    },
    verDetallesSolicitud: function(){
        var me=this,
            combosolicitud=me.getPanelofertas().down('#idsolicitud'),
            store=combosolicitud.getStore();
        var recordSelected = store.findRecord('idsolicitud', combosolicitud.getValue(), 0, false, true, true);
        if(recordSelected)
            Ext.create('SolicitudNegocioImportacion.view.WinDetallesSolicitud').show(recordSelected);
    },
    abrirSeleccionarOfertas: function(cmp){
        cmp.up('window').down('#panelseleccionar').setVisible(true);
        cmp.up('window').down('#panelseleccionar').expand();
        cmp.setDisabled(true);
    },
    mostrarTooltip: function (value, meta) {
        if (value) meta.tdAttr = 'data-qtip="' + value + '"';
        return value;
    },
    loadOfertas: function(store, records, success){
        // console.log('load3')
        var me=this, main=me.getMain(), gridprincipal=main.down('#gridprincipal');
        if(success && records.length>0){
            // var columnas=Ext.clone(gridprincipal.columnasFijas);
            var idofertas=[];
            me.configurarColumnas(records);
            records.forEach(function(x){
                idofertas.push(x.get('idoferta'));
                // columnas.push(
                //     {text: x.get('nombre'), tooltip: x.get('numero')?x.get('numero')+'<br>'+x.get('nombre'):x.get('nombre'),
                //     flex:1, minWidth: 80, renderer: me.mostrarTooltip,
                //     columns: gridprincipal.getColumnasPorDefecto(x.get('idoferta'))
                //     }
                // );
                //
                // field=gridprincipal.getStore().model.getFields();
                // field.push({name:'cant_'+x.get('idoferta'), type: 'int'});
                // field.push({name:'precio_'+x.get('idoferta'), type: 'int'});
                // field.push({name:'importe_'+x.get('idoferta'), type: 'int'});
                // gridprincipal.getStore().model.setFields(field);
            });
            // gridprincipal.reconfigure(gridprincipal.getStore(), columnas);
            // console.log('model', gridprincipal.getStore().model.getFields())
            // me.cargarDatosGridPrincipal(idofertas.toString());
            // gridprincipal.getStore().proxy.extraParams.idofertas=idsofertas.toString();
            // gridprincipal.getStore().load();
        }else{
            gridprincipal.getStore().removeAll();
            gridprincipal.reconfigure(gridprincipal.getStore(), gridprincipal.columnasFijas);
        }
    },
    configurarColumnas: function(records){
        var me=this,
            gridprincipal=me.getGridprincipal(),
            columnas=Ext.clone(gridprincipal.columnasFijas),
            fields=Ext.clone(gridprincipal.fieldsFijas);
        records.forEach(function(x) {
            columnas.push(
                {
                    text: me.getNombreLimite(x.get('nombre'), 20),
                    tooltip: x.get('numero') ? x.get('nombre') + '<br>' + x.get('numero') : x.get('nombre'),
                    flex: 1,
                    minWidth: 80, width: 80,
                    renderer: me.mostrarTooltip,
                    columns: gridprincipal.getColumnasPorDefecto(x.get('idoferta'))
                }
            );
            fields.push({name:'cant_'+x.get('idoferta'), type: 'float'});
            fields.push({name:'precio_'+x.get('idoferta'), type: 'float'});
            // fields.push({name:'precio_'+x.get('idoferta'), type: 'float'});
            fields.push({name:'importe_'+x.get('idoferta'), type: 'float'});
            fields.push({name:'moneda_'+x.get('idoferta')});
            fields.push({name:'idmoneda_'+x.get('idoferta')});
        })
        // console.log('records', records);
        // console.log('fields', fields);
        // console.log('columnas', columnas);
        gridprincipal.getStore().model.setFields(fields);
        gridprincipal.reconfigure(gridprincipal.getStore(), columnas);
    },
    actualizarGridPrincipal: function(){
        console.log('act')
        var me=this, panelofertas=me.getPanelofertas(), idofertas=[];
        // panelofertas.down('#gridofertas').getStore().getRange().forEach(function(x){
        //     idofertas.push(x.get('idoferta'));
        // })
        panelofertas.down('#gridofertas').getStore().load();
        me.cargarDatosGridPrincipal(panelofertas.down('#idsolicitud').getValue());
    },
    //cargar los datos del grid principal, daaa, obvio
    cargarDatosGridPrincipal: function(idsolicitud){
        var me=this, main=me.getMain(), gridprincipal=me.getGridprincipal();
        var mask = new Ext.LoadMask(main, {msg: 'Cargando'});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerdatosOfertasProductos'}, this),
            params: {idsolicitud: idsolicitud},
            success: function (response) {

                var datos = Ext.decode(response.responseText);
                // console.log('columns', gridprincipal.columns)
                // console.log('gridprincipal', gridprincipal)
                // console.log('datos', datos)
                gridprincipal.datos['datosofertas']=datos['datos'];
                gridprincipal.datos['productos']=datos['productos'];
                gridprincipal.datos['datosmonedas']=datos['datosmonedas'];
                gridprincipal.datos['cantproductossolicitud']=datos['cantproductossolicitud'];
                gridprincipal.datos['cantproductostotal']=datos['productos'].length;

                var codigospermitidos=[];
                datos['productos'].forEach(function(x){
                    if(x['ensolicitud'])
                        codigospermitidos.push(x['codigo']);
                })
                gridprincipal.datos['productosensolicitud']=codigospermitidos;

                var resultado=datos['productos'],
                    indicadoresHallados=[];
                resultado.forEach(function(x){indicadoresHallados.push(x['idindicador'])});
                datos['datos'].forEach(function(x){
                    // console.log('index:', (datos['datosmonedas'][x['idoferta']]['fechaconversion']?'montomonedaconversion_':'montomoneda_')+
                    //     datos['datosmonedas'][x['idoferta']]['codigoiso']+'_'+datos['datosmonedas'][x['idoferta']]['idmoneda'])
                    if(indicadoresHallados.indexOf(x['idindicador'])==-1){
                        indicadoresHallados.push(x['idindicador']);
                        var data={
                            'codigo': x['codigo'],
                            'denominacion': x['denominacion'],
                            'idindicador': x['idindicador']
                        };
                        data['cant_'+x['idoferta']]=x['cantidad'];
                        data['precio_'+x['idoferta']]=parseFloat(x[me.getMonedaIndex(x['idoferta'])]);
                        data['importe_'+x['idoferta']]=parseFloat(x['cantidad'])*parseFloat(x[me.getMonedaIndex(x['idoferta'])]);
                        if(!data['idmoneda_'+x['idoferta']]) {
                            var datosmonedas = me.getMonedaDatos(x['idoferta']);
                            if(datosmonedas) {
                                data['idmoneda_' + x['idoferta']] = datosmonedas['idmoneda'];
                                data['moneda_' + x['idoferta']] = datosmonedas['codigoiso'].toUpperCase();
                            }
                        }
                        // data['precio_'+x['idoferta']]=parseFloat(x['precio'])+parseFloat(x['preciodivisa']);
                        // data['importe_'+x['idoferta']]=parseFloat(x['cantidad'])*(parseFloat(x['precio'])+parseFloat(x['preciodivisa']));
                        resultado.push(data);
                    }else{
                        Ext.each(resultado, function(value, index){
                            if(x['idindicador']==value['idindicador']){
                                resultado[index]['cant_'+x['idoferta']]=x['cantidad'];
                                resultado[index]['precio_'+x['idoferta']]=parseFloat(x[me.getMonedaIndex(x['idoferta'])]);
                                resultado[index]['importe_'+x['idoferta']]=parseFloat(x['cantidad'])*parseFloat(x[me.getMonedaIndex(x['idoferta'])]);
                                if(!resultado[index]['idmoneda_'+x['idoferta']]){
                                    var datosmonedas=me.getMonedaDatos(x['idoferta']);
                                    if(datosmonedas) {
                                        resultado[index]['idmoneda_' + x['idoferta']] = datosmonedas['idmoneda'];
                                        resultado[index]['moneda_' + x['idoferta']] = datosmonedas['codigoiso'].toUpperCase();
                                    }
                                }

                                // resultado[index]['precio_'+x['idoferta']]=parseFloat(x['precio'])+parseFloat(x['preciodivisa']);
                                // resultado[index]['importe_'+x['idoferta']]=parseFloat(x['cantidad'])*(parseFloat(x['precio'])+parseFloat(x['preciodivisa']));
                            }
                        })
                    }
                });
                // gridprincipal.datos['cantproductostodos']=resultado.length;
                // console.log('gridprincipal.datos:', gridprincipal.datos)
                // console.log('resultado:', resultado)
                if(datos['ultimacompra'].length>0){
                    datos['ultimacompra'].forEach(function(y){
                        var item=resultado.find(function(z){return z['idindicador']==y['idindicador']});
                        if(item){
                            item['cant_ultimacompra']= y['cantidad'];
                            item['precio_ultimacompra']= y['valor'];
                            item['importe_ultimacompra']= parseFloat(y['cantidad'])*parseFloat(y['valor']);
                            item['idmoneda_ultimacompra']= y['idmoneda'];
                            item['moneda_ultimacompra']= y['codigoiso'].toUpperCase();
                        }
                    })
                }
                setTimeout(function(){
                    gridprincipal.getStore().loadData(resultado);
                    mask.hide();
                    main.down('#analizar').setDisabled(false);
                    main.down('#exportar').setDisabled(false);
                    main.down('#buttonultimacompra').setDisabled(false);
                    // gridprincipal.getView().getRowClass(gridprincipal.getStore().getAt(0));
                },500)

            },
            failure: function(){

            }
        });
    },
    loadTodasOfertas: function(store, records, success){
        if(success){
            // var resultado=[], indicadoresHallados=[];
            // records.forEach(function(x){
            //     if(indicadoresHallados.indexOf(x.get('idindicador')==-1)){
            //         var data={}
            //         resultado.push();
            //     }
            // })
        }
    },
    selectSolicitud: function(combo, records){
        var me =this,
            main=me.getMain(),
            gridofertas=main.down('#gridofertas'),
            gridPrincipal=main.down('#gridprincipal'),
            tabvistaoferta=main.down('#tabvistaoferta');
        if(combo.getValue()){
            gridPrincipal.down('#actualizar').setDisabled(false);
            me.limpiarTabVistaOfertas();
            gridofertas.getStore().proxy.extraParams={
                'filter[0][field]': 'solicitud',
                'filter[0][data][type]': 'int',
                'filter[0][data][value]': combo.getValue(),
                'filter[1][field]': 'clasificacionclienteproveedor',
                'filter[1][data][type]': 'int',
                'filter[1][data][value]': '1',
                'filter[3][field]': 'estado',
                'filter[3][data][type]': 'list',
                'filter[3][data][value]': '['+main.configPliego.configoferta.idestadosolicitudofertainsertar+
                    (records[0].get('idestado')==main.configPliego.idlistopliego?','+main.configPliego.idlistopliego:'')+']',
            };
            gridofertas.getStore().load();
            me.cargarDatosGridPrincipal(combo.getValue());
            main.down('#detallessolicitud').setDisabled(false);
            var clase={};
            clase[main.configPliego.configsolicitud.solicituddemandalista]= 'editar';
            clase[main.configPliego.idlistopliego]= 'ver';
            var tipo=clase[records[0].get('idestado')];
            // me.cambiarFuncionamiento(clase[records.get('idestado')]);
            console.log('Clase',records[0].get('idestado'), clase[records[0].get('idestado')], clase);
            gridPrincipal.tipo=tipo;
            gridPrincipal.idsolicitud=combo.getValue();
            if(tipo=='ver')me.cargarDatosPliego(combo.getValue());
        }
    },
    changeSolicitud: function(combo, value){
        var me=this, main=me.getMain();
        if(Ext.isEmpty(value)){
            main.down('#actualizar').setDisabled(true);
            main.down('#analizar').setDisabled(true);
            main.down('#exportar').setDisabled(true);
            main.down('#buttonultimacompra').setDisabled(true);
            main.down('#detallessolicitud').setDisabled(false);
            me.limpiarTabVistaOfertas();
            me.limpiarGridOfertas();
            me.limpiarGridPrincipal();
        }
    },
    limpiarTabVistaOfertas: function(){
        var me =this,
            main=me.getMain(),
            tabvistaoferta=main.down('#tabvistaoferta');
        tabvistaoferta.removeAll();
        tabvistaoferta.collapse();
    },
    limpiarGridOfertas: function(){
        var me =this, gridofertas=me.getPanelofertas().down('#gridofertas');
        gridofertas.getStore().proxy.extraParams={};
        gridofertas.getStore().removeAll();
    },
    limpiarGridPrincipal: function(){
        var me =this, gridprincipal=me.getGridprincipal();
        gridprincipal.getStore().removeAll();
        me.configurarColumnas([]);
    },
    limpiarComboSolicitud: function(){
        var me =this, solicitud=me.getMain().down('#idsolicitud');
        solicitud.getStore().proxy.extraParams={};
        solicitud.getStore().removeAll();
    },
    selectOferta: function(grid, selected){
        var me=this, main=me.getMain(), tabvistaoferta=main.down('#tabvistaoferta');
        console.info('selectOferta', main.down('#detallesoferta').pressed)
        if(selected.length>0 && main.down('#detallesoferta').pressed){
            tabvistaoferta.expand();
            if(!main.down('#tab_'+selected[0].get('idoferta'))){
                tabvistaoferta.add(me.newDatosOfertas(selected[0]));
                me.cargarDatosTab(main.down('#tab_'+selected[0].get('idoferta')));
            }
            tabvistaoferta.setActiveTab(main.down('#tab_'+selected[0].get('idoferta')));
        }

    },
    // crear tab con productos y detalles de la oferta seleccionada
    newDatosOfertas: function(select){
        var me=this, main=me.getMain(), cargandoDatos=true;
        var gridproductos=Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
            title: 'Productos/Servicios',
            region: 'center',
            flex:5,
            editGrid: false,
            totales: true,
            sinAcciones: true,
            sinToolbar: true,
            monedasentidad: this.application.monedasentidad,
            visibleColumns:['codigo', 'denominacion', 'cantidad',
                'precio', 'preciodivisa', 'total','importe', 'tipo', 'monedas'],
            // listeners:{
            //     render: function(yo){
            //         console.log('RRRRRR', yo)
            //         yo.maskL = new Ext.LoadMask(yo.getEl(), {msg: 'Cargando'});
            //         yo.maskL.show();
            //     }
            // }
        });
        var detalles=Ext.create('Ext.panel.Panel',{
            xtype: 'panel',
            region: 'east',
            flex:2,
            collapsible: true,
            minWidth: 300,
            maxWidth: window.innerWidth*0.8,
            // resizable: true,
            // draggable:false,
            title: 'Detalles de la oferta',
            autoScroll:true,
            bodyStyle: {
                padding: 8,
                // background: '#DFE9F6'
            },
            // tpl: me.getTemplateOferta(),
            // data:[]
            items:[
                {
                    xtype: 'container',
                    itemId: 'container_'+select.get('idoferta'),
                    tpl: me.getTemplateOferta(),
                    data: []
                }
            ]

        });
        // console.log('select1', select.data)
        var cloneRecord = select.copy();
        Ext.data.Model.id(cloneRecord);
        var datos={};
        Ext.Object.each(cloneRecord.data, function(key, value){
            if(value==null || value=='')
                datos[key]='<span style="color:gray">No definido</span>';
            else
                datos[key]=value;
        });
        // console.log('select2', datos)
        // detalles.update(select.data);
        detalles.down('#container_'+select.get('idoferta')).update(datos);
        return {
            xtype: 'panel',
            title: me.getNombreLimite(select.get('nombre'), 40),
            itemId: 'tab_'+select.get('idoferta'),
            idoferta: select.get('idoferta'),
            closable:true,
            layout: 'border',
            items:[
                gridproductos,
                detalles
            ]
        }
    },
    getNombreLimite: function(nombre, limite){
        return nombre.substring(0, limite)+(nombre.length>limite?'...':'');
    },
    //cargar datos de las ofertas en el tab de oferta
    cargarDatosTab: function(tab){
        var gridproductos=tab.items.first(), cargandoDatos=true;
        var detalles=tab.items.last();
        detalles.update();
        // gridproductos.fireEvent('render', gridproductos)
        gridproductos.on('render', function(yo){
            console.log('RENDER:', cargandoDatos)
            if(cargandoDatos){
                setTimeout(function(){
                    console.log('tiempo')
                    yo.maskL = new Ext.LoadMask(yo, {msg: 'Cargando'});
                    yo.maskL.show();
                }, 500);
            }
        });
        Ext.Ajax.request({
            // autoAbort: true,
            url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, ModuleMgr.get('OfertaNegocioImportacion')),
            params: {idoferta: tab.idoferta},
            callback: function (options, success, response) {
                // win.validateButtons(selected[0])
                // if(!selected[0].get('seleccionado'))me.down('#agregardemanda').setDisabled(false);
                // if(selected[0].get('seleccionado'))me.down('#quitardemanda').setDisabled(false);
                cargandoDatos=false;
                if(gridproductos.maskL)gridproductos.maskL.hide();
                var datos = Ext.decode(response.responseText);
                console.log('indi:', datos,datos.indicadores)
                if(datos && datos.indicadores) {
                    console.log('cargo datos gridproductos')
                    // datos.indicadores.forEach(function (x) {
                    //     x['idindicadorcontrato'] = '';
                    // });
                    gridproductos.getStore().loadData(datos.indicadores);
                    gridproductos.getStore().fireEvent('loaddata', gridproductos.getStore())
                    // storePO.loadData(datos.datos);
                    gridproductos.getStore().dataCargada = gridproductos.getStore().getRange();
                }
            }
        });
    },
    changemostrarceros: function(){
        // console.log('changemostrarceros')
        var me = this, panelofertas=me.getPanelOfertas(), panelprincipal=me.getGridprincipal();
        me.configurarColumnas(panelofertas.getStore().getRange());
        panelprincipal.doAutoRender();
    },

    getTemplateOferta: function(){
        var me = this;
        return new Ext.XTemplate(
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbNombre+':</label><span>{nombre}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbNumero+':</label><span>{numero}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbProveedor+':</label><span>{clienteproveedor}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbLinea+':</label><span>{linea}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbTipoLinea+':</label><span>{tipolinea}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbIncoterms+':</label><span>{incoterms}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbPuertoOrigen+':</label><span>{puertoorigen}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbPuertoEmbarque+':</label><span>{puertodestino}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbFechaInicio+':</label><span>{fechainicio}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbValidez+':</label><span>{vigencia} <tpl if="unidadtiempo == 1">'+me.etiquetas.lbUTDay+'<tpl else>'+me.etiquetas.lbUTMonth+'</tpl></span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbPeriodoGarantia+':</label><span>{garantia} <tpl if="garantia == null">"A"<tpl else><tpl if="garantiatiempo == 1">'+me.etiquetas.lbUTDay+'<tpl else >'+me.etiquetas.lbUTMonth+'</tpl></tpl></span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbTiempoEntrega+':</label><span>{tiempoentrega}</span>',
            '</div>',
            // '<div class="ofertanegocio-item">',
            // '<label>'+me.etiquetas.lbTiempoEntrega+':</label><span>{entrega} <tpl if="entregatiempo == 1">'+me.etiquetas.lbUTDay+'<tpl else>'+me.etiquetas.lbUTMonth+'</tpl></span>',
            // '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbCondicionPago+':</label><span>{condicionpago}</span>',
            '</div>',
            '<div class="ofertanegocio-item">',
            '<label>'+me.etiquetas.lbMedioPago+':</label><span>{mediopago}</span>',
            '</div>',
            // '<div class="ofertanegocio-item">',
            // '<label>'+me.etiquetas.lbMontoTotal+':</label><span>{montototal}</span>',
            // '</div>'

        );
    },
    analizarOferta: function(){
        var me = this, gridprincipal=me.getGridprincipal();
        // console.log('waaaa1')
        // Ext.create('ComponenteReporte.view.ContainerGraficas').show();
        if(gridprincipal.datos){
            var win=Ext.create('Pliego.view.WindowAnalisis',{
                width: 600,
                heigth: 400,
                tipo: gridprincipal.tipo,
                datosPliego: gridprincipal.datosPliego
            });
            win.getRelevancia= function(){
                var result={};
                win.down('#importancias').query('porcientofield').forEach(function(x){
                    result[x.getItemId()]=x.getValue();
                })
                return result;
            }
            win.cargarDatos=function(){
                // console.log(gridprincipal.datosPliego)
                // console.log(win.datosPliego)
                // console.log(win.datosPliego.idofertas)
                // console.log(Ext.decode(win.datosPliego.idofertas))
                Ext.decode(win.datosPliego.idofertas).forEach(function (x) {
                    var record = win.down('#gridseleccionarofertas').getStore().findRecord('idoferta', x, 0, false, true, true);
                    if (record) win.down('#gridseleccionarofertas').getSelectionModel().select(record);
                });
                win.down('#gridseleccionarofertas').getSelectionModel().setLocked(true);
                win.down('#importanciaform').loadRecord({getData:function(){return Ext.decode(win.datosPliego.relevancia)}});
                win.down('#analizarimportancia').fireEvent('click', win.down('#analizarimportancia'));
                // me.loadDatosPliego(win.datosPliego);
            }
            win.show(null, function(){
                // menoresprecios=me.calcularMenoresPrecios(gridprincipal.datos);
                // completamiento=me.calcularCompletamiento(gridprincipal.datos);
                var datosAnalisis=me.calculosGenerales(gridprincipal.datos),
                    datosListar=datosAnalisis['data'],
                    datosProveedores=me.calcularProveedores(datosListar, gridprincipal.datos['cantproductossolicitud'], datosAnalisis['completamiento']);
                console.log('datosAnalisis:', datosAnalisis)
                win.down('#gridmenoresprecios').getStore().loadData(datosListar);
                win.down('#gridseleccionarofertas').getStore().loadData(datosListar);
                win.down('#gridcompletamiento').getStore().loadData(datosListar);
                win.down('#gridtiempoentrega').getStore().loadData(datosListar);
                win.down('#gridmenorespreciosproveedores').getStore().loadData(datosProveedores);

                win.down('#vistamenores').add(me.getChartPie('cantmejoresprecios', 'oferta', '%MPxtotal'));
                win.down('#vistamenoresproveedores').add(me.getChartPie('cantmejoresprecios', 'proveedor', '%MPxtotal'));
                win.down('#vistacompletamiento').add(me.getChartBarras());

                win.down('#chart_cantmejoresprecios_oferta').getStore().loadData(datosListar);
                win.down('#chart_cantmejoresprecios_proveedor').getStore().loadData(datosProveedores);
                win.down('#chartcompletamiento').getStore().loadData(datosListar);
                if(win.tipo=='ver')win.cargarDatos();
                // Ext.
            });
        }else{
            console.info('la verdad no tengo pensado ningun else aqui')
        }

    },
    calcularProveedores: function(datos, totalproductos, totalesofertados){
        var me = this, aux={}, resultado=[];
        datos.forEach(function(x){
            if(!aux[x['idproveedor']]){
                aux[x['idproveedor']]={
                    'cant': x['cantmejoresprecios'],
                    'proveedor': x['proveedor'],
                    'completamiento': x['cantcompletamiento'],
                    'montostotales': [{'importetotal':x['importetotal'], 'oferta': x['oferta']}]
                };
            }else{
                aux[x['idproveedor']]['cant']+=x['cantmejoresprecios'];
                aux[x['idproveedor']]['montostotales'].push({'importetotal':x['importetotal'], 'oferta': x['oferta']});
                if(x['cantcompletamiento']>aux[x['idproveedor']]['completamiento'])
                    aux[x['idproveedor']]['completamiento']=x['cantcompletamiento'];
            }
        })
        Ext.Object.each(aux, function(key, value){
            minmontototal=me.encontrarMinimoMontoTotal(value['montostotales']);
            resultado.push({
                'proveedor': value['proveedor'],
                'cantmejoresprecios': value['cant'],
                '%MPxtotal': Math.round((value['cant']*100)/totalproductos),
                '%MPxtotalofertado': Math.round((value['cant']*100)/value['completamiento']),
                'totalsolicitado': totalproductos,
                'totalofertado': value['completamiento'],
                'montostotales': value['montostotales'],
                'minimportetotal': minmontototal['monto'],
                'minimportetotaloferta': minmontototal['oferta'],
            });
        });
        // console.log('aux provee', aux)
        // console.log('resultado prove', resultado)
        return resultado;
    },
    calculosGenerales: function(datos){
        var me=this, panelofertas=me.getPanelofertas(),
            aux={}, contMP={}, contC={}, resultado=[];
        datos['datosofertas'].forEach(function(x){
            //calcular mejores precios
            var indexPrecio=me.getMonedaIndex(x['idoferta']);
            if(datos['productosensolicitud'].indexOf(x['codigo'])!=-1) {
                if (x[indexPrecio] && x[indexPrecio] != 0) {
                    if (!aux[x['idindicador']])
                        aux[x['idindicador']] = {
                            'idoferta': [x['idoferta']],
                            'precio': x[indexPrecio],
                            'producto': x['denominacion']
                        };
                    if (parseFloat(aux[x['idindicador']]['precio']) > parseFloat(x[indexPrecio])) {
                        aux[x['idindicador']]['precio'] = x[indexPrecio];
                        aux[x['idindicador']]['idoferta'] = [x['idoferta']];
                    }
                    if (aux[x['idindicador']]['idoferta'].indexOf(x['idoferta'])==-1 && parseFloat(aux[x['idindicador']]['precio']) == parseFloat(x[indexPrecio])) {
                        aux[x['idindicador']]['idoferta'].push(x['idoferta']);
                    }
                }
                //calcular completamiento
                // if(x['idoferta']==204){
                //     console.log(indexPrecio, x[indexPrecio], x['cantidad'], x['cantidad'] * parseFloat(x[indexPrecio]))
                //     console.log(contC[x['idoferta']])
                // }
                var completacantidad=datos['productos'].some(function(y){
                    return x['idindicador']==y['idindicador'] && y['ensolicitud'] && x['cantidad']==y['cantidad'];
                })
                // console.log('Completa:', completacantidad, x['denominacion'])
                if(completacantidad) {
                    if (!contC[x['idoferta']]) {
                        contC[x['idoferta']] = {
                            'indicadores': [x['idindicador']],
                            'importetotal': x[indexPrecio] ? x['cantidad'] * parseFloat(x[indexPrecio]) : 0,
                            'cant': 1
                        };
                    } else {
                        if (contC[x['idoferta']]['indicadores'].indexOf(x['idindicador']) == -1) {
                            contC[x['idoferta']]['indicadores'].push(x['idindicador']);
                            contC[x['idoferta']]['importetotal'] += x[indexPrecio] ? x['cantidad'] * parseFloat(x[indexPrecio]) : 0;
                            contC[x['idoferta']]['cant'] += 1;
                        }
                    }
                }
            }
        });
        Ext.Object.each(aux, function(key, value){
            value['idoferta'].forEach(function(x){
                if(!contMP[x]) {
                    contMP[x] = 1;
                }else{
                    contMP[x]+=1;
                }
            })

        });
        Ext.each(panelofertas.down('#gridofertas').getStore().getRange(), function(value){
            // console.log(value)
            resultado.push(
                {
                    'idproveedor': value.get('idclienteproveedor'),
                    'proveedor': value.get('clienteproveedor'),
                    'idoferta': value.get('idoferta'),
                    'oferta': value.get('nombre'),
                    'puertoorigen': value.get('puertoorigen'),
                    'puertodestino': value.get('puertodestino'),
                    'incoterms': value.get('incoterms'),
                    'numerooferta': value.get('numero'),
                    'tiempoentrega': value.get('tiempoentrega'),
                    'puertoorigen_peso': value.get('pesopuertoorigen'),
                    'puertodestino_peso': value.get('pesopuertodestino'),
                    'incoterms_peso': value.get('pesoincoterms'),
                    'tiempoentrega_peso': value.get('pesotiempoentrega'),
                    'cantmejoresprecios': contMP[value.get('idoferta')]?contMP[value.get('idoferta')]:0,
                    '%MPxtotal': contMP[value.get('idoferta')]?Math.round((contMP[value.get('idoferta')]*100)/datos['cantproductossolicitud']):0,
                    '%MPxtotalofertado': contMP[value.get('idoferta')] && contC[value.get('idoferta')]?Math.round((contMP[value.get('idoferta')]*100)/contC[value.get('idoferta')]['cant']):0,
                    'totalsolicitado': datos['cantproductossolicitud'],
                    'totalofertado': contC[value.get('idoferta')]?contC[value.get('idoferta')]['cant']:0,
                    'cantcompletamiento': contC[value.get('idoferta')]?contC[value.get('idoferta')]['cant']:0,
                    'importetotal': contC[value.get('idoferta')]?contC[value.get('idoferta')]['importetotal']:0,
                    'porcientocompletamiento': contC[value.get('idoferta')]?Math.round((contC[value.get('idoferta')]['cant']*100)/datos['cantproductossolicitud']):0,
                }
            );
        });
        console.log('resultado', resultado)
        return {'data':resultado, 'cumplimiento': contC};
    },
    calcularMenoresPrecios: function(datos){
        var me=this, resultado=[], aux={}, cont={};
        datos['datosofertas'].forEach(function(x){
            if(x['precio']) {
                if (!aux[x['idindicador']])
                    aux[x['idindicador']] = {
                        'idoferta': x['idoferta'],
                        'precio': x['precio'],
                        'producto': x['denominacion']
                    };
                if (parseFloat(aux[x['idindicador']]['precio']) > parseFloat(x['precio'])) {
                    aux[x['idindicador']]['precio'] = x['precio'];
                    aux[x['idindicador']]['idoferta'] = x['idoferta'];
                }
            }
        });
        Ext.Object.each(aux, function(key, value){
            if(!cont[value['idoferta']]) {
                cont[value['idoferta']] = 1;
            }else{
                cont[value['idoferta']]+=1;
            }
        });
        Ext.Object.each(cont, function(key, value){
            var oferta=me.hallarDatosOferta(key);
            if(oferta)
                resultado.push(
                    {
                        'proveedor': oferta.get('clienteproveedor'),
                        'oferta': oferta.get('nombre'),
                        'numerooferta': oferta.get('numero'),
                        'cantmejoresprecios': value,
                        '%MPxtotal': Math.round((value*100)/datos['cantproductossolicitud'])
                    }
                );
        });
        // console.log('menores', aux);
        // console.log('cont', cont);
        // console.log('resultado2', resultado);
        return resultado;

    },
    calcularCompletamiento: function(datos){
        var me=this, aux={}, resultado=[];
        datos['datosofertas'].forEach(function(x){
            if(!aux[x['idoferta']]) {
                aux[x['idoferta']] = {
                    'indicadores': [x['idindicador']],
                    'cant': 1
                };
            }else{
                if(aux[x['idoferta']]['indicadores'].indexOf(x['idindicador'])==-1){
                    aux[x['idoferta']]['indicadores'].push(x['idindicador']);
                    aux[x['idoferta']]['cant']+=1;
                }
            }
        });
        Ext.Object.each(aux, function(key, value){
            var oferta=me.hallarDatosOferta(key);
            if(oferta)
                resultado.push(
                    {
                        'proveedor': oferta.get('clienteproveedor'),
                        'oferta': oferta.get('nombre'),
                        'numerooferta': oferta.get('numero'),
                        'cantcompletamiento': value['cant'],
                        'porcientocompletamiento': Math.round((value['cant']*100)/datos['cantproductossolicitud'])
                    }
                )
        });
        return resultado;
    },
    encontrarMinimoMontoTotal: function(datos){
        var me=this, menor=null, oferta=null;
        datos.forEach(function(x){
            if(menor==null){
                menor=x['importetotal'];
                oferta=x['oferta']
            }else if(menor>x['importetotal']){
                menor=x['importetotal'];
                oferta=x['oferta']
            }
        });
        return {'monto': menor, 'oferta': oferta}
    },
    hallarDatosOferta: function(idoferta){
        var me=this, store=me.getPanelofertas().down('#gridofertas').getStore(),
            index=store.findExact('idoferta', idoferta);
        if(index!=-1)return store.getAt(index);
        return null;
    },
    calcularTotalPorcientos: function(field){
        var me=this, win=field.up('window');
        // console.log('calcular:)', win.down('#importancias').query('porcientofield'))
        var suma=0;
        win.down('#importancias').query('porcientofield').forEach(function(x){
            suma+=x.getValue();
        });
        win.down('#porcientototal').setText(suma+'%');
        win.down('#porcientototal').getEl().setStyle("color", (suma==100?'green':'red'));
        win.down('#analizarimportancia').setDisabled(suma!=100);
        if(suma!=100){
            win.down('#importancias').query('porcientofield').forEach(function(x){
                x.markInvalid('La suma de todos los indicadores debe completar el 100%.')
            })
        }else{
            win.down('#importancias').query('porcientofield').forEach(function(x){
                x.clearInvalid()
            })
        }
    },
    analizarImportancia: function(button){
        var me=this, win=button.up('window'),
            store=win.down('#gridseleccionarofertas').getStore(),
            cantP=store.getCount();
        me.puntuarCaracteristica('cantmejoresprecios');
        me.puntuarCaracteristica('cantcompletamiento');
        me.puntuarCaracteristica('puertoorigen_peso');
        me.puntuarCaracteristica('tiempoentrega_peso');
        me.puntuarCaracteristica('incoterms_peso');
        me.puntuarCaracteristica('importetotal', 'ASC');
        store.getRange().forEach(function(x){
            x.set('puntos',
                x.get('cantmejoresprecios_puntos')+
                x.get('cantcompletamiento_puntos')+
                x.get('puertoorigen_peso_puntos')+
                x.get('incoterms_peso_puntos')+
                x.get('tiempoentrega_peso_puntos')+
                x.get('importetotal_puntos')
            );
            x.set('importancia',
                ((x.get('cantmejoresprecios_puntos')*(win.down('#cantmejoresprecios').getValue()/100))+
                (x.get('cantcompletamiento_puntos')*(win.down('#cantcompletamiento').getValue()/100))+
                (x.get('puertoorigen_peso_puntos')*(win.down('#puertoorigen_peso').getValue()/100))+
                (x.get('incoterms_peso_puntos')*(win.down('#incoterms_peso').getValue()/100))+
                (x.get('tiempoentrega_peso_puntos')*(win.down('#tiempoentrega_peso').getValue()/100))+
                (x.get('importetotal_puntos')*(win.down('#paquete_peso').getValue()/100))).toFixed(2)
            );

            // console.log(x.get('cantmejoresprecios_puntos'),(win.down('#cantmejoresprecios').getValue()/100));
            // console.log('cantmejoresprecios', x.get('cantmejoresprecios_puntos')*(win.down('#cantmejoresprecios').getValue()/100));
            // console.log(x.get('cantcompletamiento_puntos'),(win.down('#cantcompletamiento').getValue()/100));
            // console.log('cantcompletamiento',x.get('cantcompletamiento_puntos')*(win.down('#cantcompletamiento').getValue()/100));
            // console.log(x.get('puertoorigen_peso_puntos'),(win.down('#puertoorigen_peso').getValue()/100));
            // console.log('puertoorigen_peso',x.get('puertoorigen_peso_puntos')*(win.down('#puertoorigen_peso').getValue()/100));
            // console.log(x.get('incoterms_peso_puntos'),(win.down('#incoterms_peso').getValue()/100));
            // console.log('incoterms_peso',x.get('incoterms_peso_puntos')*(win.down('#incoterms_peso').getValue()/100));
            // console.info('ImPORTAANCIA', x.get('importancia'));
        });
        store.sort('importancia', 'DESC');
        // console.log('final:', store.data.items)
    },
    puntuarCaracteristica: function(parametro, orden){
        var me=this, store=me.getPanelseleccionar().down('#gridseleccionarofertas').getStore(),
            puntosActuales=store.getCount(),
            nivelActual=store.getCount(),
            fields=store.model.getFields(),
            ordenamiento=orden?orden:'DESC';
        // console.log('parametro', parametro, ordenamiento)
        fields.push(parametro+'_puntos');
        store.model.setFields(fields);
        store.sort(parametro, ordenamiento);
        var valorActual=store.data.items[0].data[parametro];
        store.getRange().forEach(function(x){
            if(x.get(parametro)){
                if(valorActual!=x.get(parametro)){
                    puntosActuales--;
                    valorActual=x.get(parametro);
                }else{
                    // puntosActuales=nivelActual;
                }
                x.set(parametro+'_puntos', puntosActuales);
                nivelActual--;

            }else{
                x.set(parametro+'_puntos', 0);
            }

        });
        // console.log('store_'+parametro, store.data.items)
    },
    selectOfertasSeleccionar: function(yo, records){
        var me=this, win=me.getWindowanalisis();
        win.down('#realizarseleccion').setDisabled(records.length==0);
    },
    realizarSeleccion: function(){
        var me=this, win=me.getWindowanalisis(), main=me.getMain(), aux=[], ids=[],
            msg='Est&aacute; a punto de seleccionar para el pliego ';
        win.down('#gridseleccionarofertas').getStore().getRange().forEach(function(x){
            aux.push(x.get('numerooferta'));
        })
        msg+=(aux.length>1?'las siguientes ofertas:<br> '+aux.join('-'):'la siguiente oferta:<br> -'+aux.toString())+
            '<br> ¿Est&aacute; seguro que desea continuar?';
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        win.down('#gridseleccionarofertas').getSelectionModel().getSelection().forEach(function(x){
                            aux.push('<br>-'+x.get('oferta'));
                            ids.push(x.get('idoferta'));
                        });
                        Ext.MessageBox.show({
                            msg: 'Guardando el pliego',
                            width: 300,
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'crearPliego'}, ModuleMgr.get('Pliego')),
                            params: {
                                idofertas: Ext.encode(ids),
                                idsolicitud: main.down('#idsolicitud').getValue(),
                                relevancias: Ext.encode(win.getRelevancia())
                            },
                            callback: function (options, success, response) {
                                Ext.MessageBox.hide();
                                var datos = Ext.decode(response.responseText);
                                dialog.close();
                                if(datos.success){
                                    mostrarMensaje(1, 'El pliego ha sido guardado satisfactoriamente.');
                                    win.close();
                                    main.down('#idsolicitud').setValue('');
                                    // me.limpiarTabVistaOfertas();
                                    // me.limpiarGridOfertas();
                                    // me.limpiarGridPrincipal();
                                }
                            }
                        });
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
            title: me.etiquetas.lbConfirmacion,
            msg: msg,
            icon: Ext.MessageBox.QUESTION,
        });
    },
    getChartBarras: function(cantProductos){
        return Ext.create('Ext.chart.Chart', {
            itemId: 'chartcompletamiento',
            style: 'background:#fff',
            animate: true,
            anchor:'100%',
            flex:1,
            minHeight: 200,
            // maxHeight: 250,
            minWidth: 300,
            shadow: true,
            store: Ext.create('Ext.data.Store',{
                fields: ['proveedor', 'oferta', 'numerooferta', 'cantcompletamiento', 'porcientocompletamiento'],
                data: []
            }),
            axes: [
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['cantcompletamiento'],
                    label: {
                        // renderer: Ext.util.Format.numberRenderer('0,0'),
                        font: '10px Arial'
                    },
                    title: 'Cantidad',
                    grid: true,
                    // grid: {
                    //     odd: {
                    //         opacity: 1,
                    //         fill: '#EEE',
                    //         stroke: '#eee',
                    //         'stroke-width': 0.5
                    //     }},
                    minimum: 0,
                    maximum: cantProductos,
                    // minorTickSteps:1,
                }, {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['numerooferta'],
                    // label: {
                    //     // renderer: Ext.util.Format.numberRenderer('0,0'),
                    //     font: '10px Arial'
                    // },
                    title: 'Ofertas',
                    // grid: true,
                    // minimum: 0
                }
            ],
            series: [
                {
                    type: 'column',
                    axis: 'bottom',
                    highlight: true,
                    tips: {
                        trackMouse: true,
                        width: 550,
                        height: 50,
                        autoWidth: true,
                        renderer: function(storeItem, item) {
                            this.setTitle(storeItem.get('oferta') );
                            this.update(storeItem.get('cantcompletamiento')+' - '+storeItem.get('porcientocompletamiento')+'%')
                        }
                    },
                    label: {
                        display: 'insideEnd',
                        'text-anchor': 'middle',
                        field: 'cantcompletamiento',
                        // renderer: Ext.util.Format.numberRenderer('0'),
                        orientation: 'horizontal',
                        color: '#333'

                    },
                    xField: 'numerooferta',
                    yField: ['cantcompletamiento']
                }
            ]


        });
    },
    getChartPie: function(campovalor, campocategoria, datoadicional){
        return {
            xtype: 'chart',
            itemId: 'chart_'+campovalor+'_'+campocategoria,
            anchor: '100%',
            flex:1,
            minHeight: 200,
            // maxHeight: 250,
            // height: 250,
            minWidth: 350,
            animate: true,
            shadow: false,
            insetPadding: 5,
            theme: 'Base:gradients',
            store: Ext.create('Ext.data.Store',{
                fields: ['proveedor', 'oferta', 'cantmejoresprecios', '%MPxtotal'],
                data: []
            }),
            legend: {
                position:'right'
            },
            series:[{
                type: 'pie',
                showInLegend: true,
                pie: {
                    show: true,
                    radius: 1,
                    label: {
                        show: true,
                        radius: 3/4,
                        background: {
                            opacity: 0.5
                        }
                    }
                },
                field: campovalor,
                tips: {
                    trackMouse: true,
                    width: 550,
                    autoWidth:true,
                    height: 50,
                    // layout:'fit',
                    renderer: function(storeItem, item) {
                        // var total = 0;
                        //console.log(store1);
                        // solic_contrato_store.each(function(rec) {
                        //     total += rec.get('cant');
                        // });

                        this.setTitle(storeItem.get(campocategoria));
                        this.update(storeItem.get(campovalor));
                        if(datoadicional)
                        this.update(storeItem.get(campovalor)+' - '+storeItem.get(datoadicional)+'%');
                    }
                },
                label: {
                    field:campocategoria,
                    //display:'none',
                    //render:
                    display:'rotate',
                    constrast: true,
                    renderer:function(label, e, records){
                        return records.get(campovalor);
                    },
                    font: '15px Arial',
                    color:'#FFF'

                },

                highlight:{
                    segment: {
                        margin: 20
                    }
                }


            }]
        }
    },
    cargarDatosPliego: function(idsolicitud){
        var me=this,
            main=me.getMain(),
            gridPrincipal=main.down('#gridprincipal'),
            win=me.getWindowanalisis();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'cargarDatosPliego'}, this),
            scope: this,
            params:{
                idsolicitud: idsolicitud
            },
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if(response){
                    gridPrincipal.datosPliego=response;
                    // if(win) {
                    //     win.cargarDatos();
                    //     // importancias gridseleccionarofertas
                    // }
                }
            }
        })
    },
    // loadDatosPliego: function(datos){
    //     var me=this,
    //         win=me.getWindowanalisis();
    //     win.down('#importanciaform').loadRecord(Ext.decode(datos.relevancia));
    //     Ext.decode(datos.idofertas).forEach(function (x) {
    //         var record = win.down('#gridseleccionarofertas').getStore().findExact('idoferta', x);
    //         if (record) win.down('#gridseleccionarofertas').getSelectionModel().select(x);
    //     });
    //     win.down('#gridseleccionarofertas').getSelectionModel().setLocked(true);
    // },
    cambiarFuncionamiento: function(caso){
        var me=this, main=me.getMain();
        if(caso=='editar'){

        }
    },
    onChangeFiltroSolicitudes: function(){
        var me=this, main=me.getMain();
        me.limpiarTabVistaOfertas();
        me.limpiarGridOfertas();
        me.limpiarGridPrincipal();
        me.limpiarComboSolicitud();
        me.realizarFiltrosSolicitud();
    },
    realizarFiltrosSolicitud: function(){
        var me=this, main=me.getMain();
        main.down('#idsolicitud').reset();
        main.down('#idsolicitud').getStore().proxy.extraParams={  //me.idestadosolicitud
            'filter[0][field]': 'cliente',
            'filter[0][data][type]': 'list',
            'filter[0][data][value]': '[4]',
            'filter[1][field]': 'estado',
            'filter[1][data][type]': 'list',
            'filter[1][data][value]': '['+(main.down('#tiposolicitudes').getValue()['rb']=='nuevas'?main.configPliego.configsolicitud.solicituddemandalista:main.configPliego.idlistopliego)+']',
            'filter[2][field]': 'rangofechaestado',
            'filter[2][data][type]': 'other',
            'filter[2][data][comparison]': 'gt',
            'filter[2][data][value]': main.down('#fechainicio').getValue(),
            'filter[3][field]': 'rangofechaestado',
            'filter[3][data][type]': 'other',
            'filter[3][data][comparison]': 'lt',
            'filter[3][data][value]': main.down('#fechafin').getValue(),
        };
        main.down('#idsolicitud').getStore().load();
    },
    onBuscarRango: function(){
        var me=this, main=me.getMain();
        main.down('#buscarrango').setDisabled(true);
        main.down('#fechainicio').resetOriginalValue();
        main.down('#fechafin').resetOriginalValue();
    },
    onChangeDateField: function(datefield){
        var me=this, main=me.getMain();
        main.down('#buscarrango').setDisabled(false);
    },
    exportarPliego: function(){
        var me =this,
            main=me.getMain(),
            gridPrincipal=main.down('#gridprincipal')
        window.open(document.location.protocol + '//' + document.location.host +
            UtilsFn.buildUrl({action: 'exportarPliego'}, me)+
            '?idsolicitud=' +gridPrincipal.idsolicitud);
    },
    getMonedaIndex: function(idoferta){
        var me=this, datosmonedas=me.getMain().down('#gridprincipal').datos['datosmonedas'];
        console.log('datosmonedas:', datosmonedas)
        if(datosmonedas && datosmonedas[idoferta])
            return (datosmonedas[idoferta]['fechaconversion']?'montomonedaconversion_':'montomoneda_')+
                    datosmonedas[idoferta]['codigoiso']+'_'+datosmonedas[idoferta]['idmoneda'];
        return null;
        // return 'precio';
    },
    getMonedaDatos: function(idoferta){
        var me=this, datosmonedas=me.getMain().down('#gridprincipal').datos['datosmonedas'];
        if(datosmonedas && datosmonedas[idoferta])
            return datosmonedas[idoferta];
        return null;
        // return 'precio';
    },
    importarUltimaCompra: function(button){
        var me=this;
        console.log('importarUltimaCompra')
        var win=Ext.create('Ext.window.Window',{
            title:'Importar datos',
            minHeight: null,
            minWidth: null,
            width: 450,
            height: 230,
            layout:'fit',
            constrain:true,
            modal:true,
            resizable:false,
            items:[
                Ext.create('Ext.ux.CustomForm',
                    {
                        layout:'anchor',
                        items:[
                            {
                                xtype: 'fieldset',
                                title: 'Formato del documento a importar',
                                anchor: '100%',
                                layout: 'fit',
                                border:1,
                                items:[
                                    {
                                        xtype:'image',
                                        anchor: '100%',
                                        // height: 200,
                                        src: '/crm/application/views/images/formatoExcelImportarProductos.png',
                                    },
                                ]
                            },
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                anchor: '100%',
                                items:[
                                    {
                                        xtype: 'combo',
                                        fieldLabel: 'Moneda a utilizar',
                                        name: 'moneda',
                                        // labelAlign: 'left',
                                        labelWidth: 110,
                                        valueField: 'idmoneda',
                                        displayField: 'codigoiso',
                                        itemId: 'moneda',
                                        width: 140,
                                        margin: '0 5 0 0',
                                        anchor: '100%',
                                        editable: false,
                                        allowBlank: false,
                                        listConfig: {
                                            loadingText: me.etiquetas.msgLoading,
                                            emptyText: '<div class="x-grid-empty">' + me.etiquetas.msgNoDataLoaded + '</div>'
                                        },
                                        tpl: Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '<div class="x-boundlist-item">' +
                                            '{codigoiso} ({nombremoneda})' +
                                            '</div>',
                                            '</tpl>'
                                        ),
                                        store: Ext.create('Ext.data.Store', {
                                            fields: [
                                                'codigoiso', 'idmoneda', 'nombremoneda', 'idpais',
                                                'organizacion', 'simbolo', 'factorredondeo'
                                            ],
                                            proxy: {
                                                type: 'ajax',
                                                url: UtilsFn.buildUrl({action: 'getMonedas'}, ModuleMgr.get('OfertaNegocioImportacion')),
                                                reader: {
                                                    root: 'data',
                                                    totalProperty: 'total',
                                                    successProperty: 'success'
                                                }
                                            },
                                        }),
                                    },
                                    {
                                        xtype: 'filefield',
                                        fieldLabel: 'Excel a importar',
                                        flex: 1,
                                        name: 'excel',
                                        allowBlank: false,
                                        anchor:'100%',
                                        // margin: '0 0 0 0',
                                        emptyText:'Seleccione el excel',
                                        buttonText: '',
                                        buttonConfig: {
                                            iconCls: 'icondistra-subirfichero icon-fileupload'
                                        },
                                        validator: function(value){
                                            var aux=value.split('.');
                                            if(['xls', 'xlsx', 'XLS', 'XLSX'].indexOf(aux[aux.length-1])==-1)
                                                return 'Sólo se admiten los siguientes formatos: xls, xlsx.';
                                            return true;
                                        }
                                    }
                                ]
                            }
                        ],
                        listeners:{
                            validitychange: function(yo, valid){
                                win.down('#aceptar').setDisabled(!valid);
                            }
                        }
                    })
            ],
            buttons:[
                {
                    text: (this.etiquetas && this.etiquetas.lbBtnCancel) ? this.etiquetas.lbBtnCancel : 'Cancelar ',
                    tooltip: (this.etiquetas && this.etiquetas.qtipCancel) ? this.etiquetas.qtipCancel : 'Cancelar ',
                    iconCls: 'cancelar',
                    handler: function(){
                        win.close();
                    }
                },
                {
                    text: (this.etiquetas && this.etiquetas.lbBtnAccept) ? this.etiquetas.lbBtnAccept : 'Aceptar ',
                    tooltip: (this.etiquetas && this.etiquetas.qtipAccept) ? this.etiquetas.qtipAccept : 'Aceptar ',
                    itemId: 'aceptar',
                    disabled: true,
                    iconCls: 'aceptar',
                    handler: function(){
                        win.close();
                    }
                }
            ]
        });
        win.show(null, function(){
            win.down('#aceptar').setHandler(function(){
                if(win.down('form').getForm().isValid()){
                    Ext.MessageBox.show({
                        msg: 'Importando datos',
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200}
                    });
                    win.down('form').getForm().submit({
                        url: UtilsFn.buildUrl({action: 'importarDatosExcel'}, ModuleMgr.get('GestionContratoImportacion')),
                        // params: params,
                        success: function (form, action) {
                            Ext.MessageBox.hide();
                            var result = Ext.decode(action.response.responseText);
                            // button.up('grid').getStore().loadData(result.data);
                            if(result && result.count>0){
                                // console.log('data',result.data.length);
                                // var respuesta=me.comprobarExistenciaProductos(button.up('window'), response.data);
                                var respuesta={'existen': [], 'noExisten': []},
                                    gridprincipal=me.getMain().down('#gridprincipal'),
                                    params={idtipoprecio: -1, idnaturaleza: result.naturaleza};
                                // Ext.MessageBox.show({
                                //     msg: me.etiquetas.lbComprobandoDatos,
                                //     width: 300,
                                //     wait: true,
                                //     waitConfig: {interval: 200}
                                // });
                                // idtipoprecio: -1
                                // idnaturaleza: 1000261
                                // node: 431654
                                var datos=gridprincipal.getStore().getRange();
                                // console.log('solicitud:', datos)
                                // Ext.Ajax.request({
                                //     url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionContratoImportacion')),
                                //     params: params,
                                //     success: function (response) {
                                //         Ext.MessageBox.hide();
                                //         var datos = Ext.decode(response.responseText);
                                // console.log('datos->', datos.length)
                                result.data.forEach(function(x){
                                    var existe=false;
                                    // datos.data.forEach(function(y){
                                    //     if(x['codigo']==y['codigoproveedor']){
                                    //         x['tipo']=1;
                                    //         respuesta['existen'].push(x);
                                    //         existe=true;
                                    //         return false;
                                    //     }
                                    // });
                                    var existe=false; indicador=null;
                                    // datos.forEach(function(y){
                                    //     if(x['codigo']==y.get('codigo')){
                                    //         console.log('iguales:', y.get('denominacion'), x['codigo'], y.get('codigo'))
                                    //         existe=true;
                                    //         indicador=y.get('idindicador');
                                    //     }
                                    // });
                                    var index=gridprincipal.getStore().findBy(function(y){
                                        return x['codigo']==y.get('codigo');
                                    })
                                    if(index!=-1){
                                        var finded=gridprincipal.getStore().getAt(index);
                                        x['tipo']=1;
                                        x['idindicador']=finded.get('idindicador');
                                        // x['codigo']=x['codigo'];
                                        respuesta['existen'].push(x)
                                    }else
                                        respuesta['noExisten'].push(x)
                                });
                                mostrarMensaje(1, 'Los datos han sido importados satisfactoriamente.');
                                // console.log('existen', respuesta['existen'].length, respuesta['existen'])
                                if(respuesta['existen'].length>0){ //7
                                    // var field=win.down('form').getForm().findField('moneda');
                                    var montoIndex='';
                                    // button.up('grid').columns.forEach(function(x){
                                    //     if(x.dataIndex.indexOf('monto')==0){
                                    //         console.log(x.dataIndex)
                                    //         if(x.dataIndex!='montomoneda_'+field.getRawValue().toLowerCase()+'_'+field.getValue())
                                    //             x.hide();
                                    //         else {
                                    //             montoIndex = 'montomoneda_' + field.getRawValue().toLowerCase() + '_' + field.getValue();
                                    //             x.show();
                                    //         }
                                    //     }
                                    // });
                                    // console.log(montoIndex)
                                    gridprincipal.getStore().getRange().forEach(function(x){
                                        x.set('cant_ultimacompra', '');
                                        x.set('precio_ultimacompra', '');
                                        x.set('importe_ultimacompra', '');
                                        x.set('idmoneda_ultimacompra', '');
                                        x.set('moneda_ultimacompra', '');
                                    })
                                    console.log('moneda:', win.down('form').getForm().findField('moneda').getRawValue(), win.down('form').getForm().findField('moneda').getValue())
                                    respuesta['existen'].forEach(function(x){
                                        // console.log(x)
                                        // x[montoIndex]=x['precio'];
                                        // var record=gridprincipal.getStore().findRecord('codigo', x['codigo'], 0, false, true, true);
                                        var index=gridprincipal.getStore().findBy(function(y){
                                            return x['codigo']==y.get('codigo');
                                        })
                                        // console.log('record:', record)
                                        if(index!=-1){
                                            var record=gridprincipal.getStore().getAt(index);
                                            record.set('cant_ultimacompra', x['cantidad']);
                                            record.set('precio_ultimacompra', x['precio']);
                                            record.set('importe_ultimacompra', parseFloat(x['cantidad'])*parseFloat(x['precio']));
                                            record.set('idmoneda_ultimacompra', win.down('form').getForm().findField('moneda').getValue());
                                            record.set('moneda_ultimacompra', win.down('form').getForm().findField('moneda').getRawValue());
                                            console.log('record:', record)
                                        }

                                    })

                                    // button.up('grid').getStore().loadData(respuesta['existen']);
                                    // button.up('grid').getStore().fireEvent('update', button.up('grid').getStore());

                                }
                                if(respuesta['noExisten'].length>0){ //354
                                    var winNoExisten=Ext.create('Ext.window.Window',{
                                        title: 'Información',
                                        width: 900,
                                        resizable:true,
                                        modal:true,
                                        constrain:true,
                                        autoScroll:true,
                                        maxHeight:window.innerHeight - 100,
                                        items:[
                                            {
                                                xtype: 'panel',
                                                tpl: new Ext.XTemplate(
                                                    '<div class="solicitudneogico-item">',
                                                    '<b>Existen '+respuesta['noExisten'].length+' productos que no pueden ser importados por no encontrarse entre los productos solicitados. ' +
                                                    'Debe añadirlos al excel y volver a importarlo.<br></b>',
                                                    '</div>',
                                                    '<div class="solicitudneogico-columnheader">',
                                                    '<div style="width:25%;"><label>' + me.etiquetas.lbCodigo + '</label></div>',
                                                    '<div style="width:75%;"><label>' + me.etiquetas.lbDescripcion + '</label></div>',
                                                    '</div>',
                                                    '<tpl for=".">',
                                                    '<div class="solicitudnegocio-row">',
                                                    '<div style="width:25%"><span>{codigo}</span></div>',
                                                    '<div style="width:75%"><span>{denominacion}</span></div>',
                                                    '</div>',
                                                    '</tpl>'
                                                )
                                            }
                                        ],
                                        buttons:[
                                            {
                                                text: 'Cerrar',
                                                tooltip: 'Cerrar',
                                                iconCls: 'cerrar',
                                                handler: function(){
                                                    winNoExisten.close();
                                                }
                                            }
                                        ]
                                    });
                                    winNoExisten.show(null, function(){
                                        winNoExisten.down('panel').update(respuesta['noExisten'])
                                    })
                                }
                                // console.log('Respuesta:', respuesta)
                                win.close();
                                //     },
                                //     failure: function (response) {
                                //         // respuesta['existen']=importados;
                                //     }
                                // });
                            }
                        },
                        failure: function (form, action) {
                            Ext.MessageBox.hide();
                        }
                    });
                }
            });
        });
    },
    guardarUltimaCompra: function(){
        var me=this, main=me.getMain(),
            idsolicitud=main.down('#idsolicitud').getValue(),
            store=main.down('#gridprincipal').getStore().getRange(),
            productos=[];
        store.forEach(function(x){
            if(x.get('cant_ultimacompra') && x.get('precio_ultimacompra')){
                productos.push({
                    'idindicador': x.get('idindicador'),
                    'codigo': x.get('codigo'),
                    'cantidad': x.get('cant_ultimacompra'),
                    'valor': x.get('precio_ultimacompra'),
                    'idmoneda': x.get('idmoneda_ultimacompra'),
                    'idsolicitud': idsolicitud
                });
            }
        })
        Ext.MessageBox.show({
            msg: 'Guardando datos',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'guardarUltimaCompra'}, me),
            scope: this,
            params:{
                idsolicitud: idsolicitud,
                productos: Ext.encode(productos)
            },
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var response = Ext.decode(response.responseText);
                if(response.success){
                    mostrarMensaje(1, 'Los datos de la última compra han sido guardados satisfactoriamente.');
                }
            }
        })
    }

});
