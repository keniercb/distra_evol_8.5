Ext.define('ReporteContratacion.controller.Main', {
    extend: 'CRM.core.controller.Base',
    confEnt: null,
    refs: [
        {ref: 'MainView', selector: 'reportecontrataciontree'},
        {ref: 'WindowGraficas', selector: 'rc_windowgraficas'},
        // {ref: 'WinDetallesCP', selector: 'windetallescp'},
    ],
    requires: [
		// 'GestionContrato.view.DetailsWindow',
    ],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            store: {
                '#store_reportecontrato':{
                    load: function(store, node,records, success){
                        if(success){
                            me.getMainView().down('#limpiarfiltros').setDisabled(store.filters.length==0);
                            if(store.filters.length>0) {
                                if (records.length == 0) {
                                    mostrarMensaje(1, me.etiquetas.msgFiltrosSinResultado);
                                }
                            }
                            // if(store.proxy.reader.jsonData){
                            //     if(store.proxy.reader.jsonData.estados_fac){
                            //         // me.configurarColumnas(store.proxy.reader.jsonData.estados_fac);
                            //     }
                            // }
                        }
                    }
                },
                // '#store_areas_grafica':{
                //     beforeload:function(store){
                //         me.getWindowGraficas().down('#treepanelareas').setLoading({msg: "Cargando..."});
                //     },
                //     load:function(store, node,records, success){
                //         me.getWindowGraficas().down('#treepanelareas').setLoading(false);
                //     },
                // }
            },
            component: {
                'reportecontrataciontree': {
                    itemdblclick: this.onDobleClick,
                    selectionchange: this.selectAlgo
                },
                'reportecontrataciontree searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'reportecontrataciontree button[action], reportecontrataciontree menuitem[action]': {
                    click: this.onClickAction,
                },
                'reportecontrataciontree datefield': {
                    change: this.onChangeDate,
                },
                'rc_windowgraficas button[action], rc_windowgraficas menuitem[action]': {
                    click: this.actionWindowGraficas,
                },
                'rc_windowgraficas treepanel': {
                    selectionchange: this.checkValidezCrearGrafica,
                },
                'rc_windowgraficas textfield[itemId=nombre], rc_windowgraficas checkboxgroup[itemId=checkboxmontos]': {
                    change: this.checkValidezCrearGrafica,
                },
                'rc_windowgraficas tabpanel': {
                    remove: this.removeTab,
                },
                'reportecontrataciontree pickerfield[name=filtroarea]': {
                    onclick2: this.clearFilterEntity,
                    onclick3: function(cmb){this.filterByEntity(cmb);this.filterByEntity(cmb);}
                },
                'reportecontrataciontree combobox[itemId=idsector]': {
                    //onclick2: this.limpiarFiltroSector,
                    select: this.filtrarSector
                }
            }
        });
    },

    filtrarSector: function(cmb, records){
        var me = this,
            tree = me.getMainView();
//             console.log('yeaaaa', records)
        var filter= new Ext.util.Filter({
            id: 'idsector',
            property: 'idsector',
            value: records[0].data.idsector,
            'store': tree.getStore()
        });
        tree.getStore().filters.add(filter);
        tree.getStore().load();
    },
    
    removeTab: function (){
        var me = this,
            tree = me.getMainView(),
            windowGrafica=me.getWindowGraficas();
        // var num=windowGrafica.down('#tabpanelgraficas').items.items.length+1;
        windowGrafica.down('#nombre').setValue('Grafica #'+windowGrafica.numGrafica);
    },

    selectAlgo:function(){
        var me=this, grid = me.getMainView(),
            record = grid.getSelectionModel().getSelection();
        if(record.length>0){
            grid.down('#detallescontratos').setDisabled(record.length!=1 || !record[0].get('idcontrato'));
        }else{
            grid.down('#detallescontratos').setDisabled(true);
        }
    },

    onDobleClick:function (){
//         console.info('abrir detalles');
        var me=this, grid = me.getMainView(),
            record = grid.getSelectionModel().getSelection()[0];
        if(record.get('idcontrato')){

            var mask = new Ext.LoadMask(grid.down('#detallescontratos'),
                {msg: this.etiquetas.lbCargando});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerDatosContrato'}, ModuleMgr.get('ReporteContratacion')),
                params:{idcontrato:record.get('idcontrato')},
                success: function (response) {
                    mask.hide();
                    var datos=Ext.decode(response.responseText);
                    record={
                        data:datos,
                        getData:function(){return datos},
                        get:function(field){return datos[field];}
                    };
                    Ext.create('GestionContrato.view.DetailsWindow').show(record);
                },
                failure:function(response){
                    mask.hide();
                    mostrarMensaje(7, 'No han podido cargarse los datos.')
                }
            });

        }
    },

    onSearch: function (field, data) {
        var me = this,
            tree = me.getMainView();
        tree.getStore().filters.removeAtKey(field.atributo);
        if(field.getValue()!=''){
            var filter= new Ext.util.Filter({
                id: field.atributo,
                property: field.atributo,
                value: field.getValue(),
                'store': tree.getStore()
                });
            tree.getStore().filters.add(filter);
        }
        tree.getStore().load();
    },

    onClear: function (field) {
        var me = this,
            tree = me.getMainView();
        var removido=tree.getStore().filters.removeAtKey(field.atributo);
        if(removido)tree.getStore().load();
    },

    onChangeDate:function(field){
        var me = this,
            tree = me.getMainView();
        tree.down('#rangobuscar').setDisabled(
            tree.down('#fechainicial').getValue()==null &&
            tree.down('#fechafinal').getValue()==null);
        if(tree.down('#rangolimpiar'))
            tree.down('#rangolimpiar').setDisabled(
                tree.down('#fechainicial').getValue()==null &&
                tree.down('#fechafinal').getValue()==null);
    },

    onClickAction:function(button){
        var me = this;
        switch (button.action) {
            case 'rangobuscar':
                me.rangoBuscar();
                break;
            case 'rangolimpiar':
                me.rangoLimpiar();
                break;
            case 'limpiarfiltros':
                me.limpiarFiltros();
                break;
            case 'graficar':
                me.graficar();
                break;
            case 'detallescontrato':
                me.onDobleClick();
                break;
        }
    },

    rangoBuscar:function(){
        var me = this,
            tree = me.getMainView();
        tree.getStore().filters.removeAtKey('rangofechas');
        if(tree.down('#fechainicial').getValue()!=null || tree.down('#fechafinal').getValue()!=null) {
            var filter = new Ext.util.Filter({
                id: 'rangofechas',
                property: 'rangofechas_'+(tree.down('#tiempoestimado').getValue()?'fr':'fe'),
                value: {
                    'inicial': Ext.Date.format(tree.down('#fechainicial').getValue(), 'Y-m-d'),
                    'final': Ext.Date.format(tree.down('#fechafinal').getValue(), 'Y-m-d')
                },
                // value: Ext.encode({
                //     'inicial': Ext.Date.format(tree.down('#fechainicial').getValue(), 'Y-m-d'),
                //     'final':  Ext.Date.format(tree.down('#fechafinal').getValue(), 'Y-m-d')
                // }),
                // caseSensitive:tree.down('#tiempoestimado').getValue(),
                // exactMatch:tree.down('#tiempoestimado').getValue(),
                'store': tree.getStore()
            });
            tree.getStore().filters.add(filter);
        }
        tree.getStore().load();
    },

    rangoLimpiar:function(){
        var me = this,
            tree = me.getMainView();
        // tree.down('#fechainicial').reset();
        // tree.down('#fechafinal').reset();
        tree.down('#fechainicial').setValue(null);
        tree.down('#fechafinal').setValue(null);
        tree.down('#tiempoestimado').reset();
        if(tree.getStore().filters.getByKey('rangofechas')){
            tree.getStore().filters.removeAtKey('rangofechas');
            tree.getStore().load();
        }
    },

    limpiarFiltros:function(){
        var me = this,
            tree = me.getMainView();
        tree.getStore().filters.removeAll();
//         tree.getStore().load();
        me.rangoBuscar();
        tree.dockedItems.items[0].queryBy(function(x){
            if(Ext.isFunction(x.reset))
                x.reset();
        });
    },

    devolverDatosGrafica:function(original){
        var me = this, windowGrafica=me.getWindowGraficas(), tieneRoot=false;
            data=[], checkseleccionados=windowGrafica.down('#checkboxmontos').getValue()['rb'];
        if(typeof checkseleccionados=='string'){model=[checkseleccionados]}else model=checkseleccionados;
        original.forEach(function(x){
            var aux = {'text': x.data.text, 'abreviatura': x.data.abreviatura,
                'nombre': (x.get('abreviatura')?x.get('abreviatura'):x.get('text'))}
            model.forEach(function (monto) {
                var transformado = monto.toLowerCase().replace(' ', '');
                var total = 0;
                if (x.get('total_' + transformado)) {
                    x.get('total_' + transformado).forEach(function (y) {
                        if (model.indexOf(monto + '_' + y['codigoiso']) == -1)
                            model.push(monto + '_' + y['codigoiso'])
                        aux[monto + '_' + y['codigoiso']] = y['valor'];
                        total += parseFloat(y['valor']);
                    });
                    aux[monto] = total;
                }
            })
            data.push(aux);
        });
        model=model.concat(['text', 'abreviatura', 'nombre']);
        // model.push('text');model.push('abreviatura');
        return {'data':data, 'model':model, 'tieneRoot':tieneRoot};
    },

    graficar: function(){
        var me = this,
            tree = me.getMainView();
        // var datos=me.devolverDatosGrafica(tree.getStore().getRootNode().childNodes);
        var win=Ext.create('ReporteContratacion.view.WindowGraficas')
        win.show(null,
            function(){
                setTimeout(function(){
                    win.down('#treepanelareas').setLoading({msg: "Cargando..."});
                }, 100);
            }
        );
        // me.windowGrafica=Ext.create('Ext.window.Window',{
        //     title:'Grafico',
        //     layout:'fit',
        //     maximizable:true,
        //     resizable:true,
        //     modal:true,
        //     items:[
        //         {
        //             xtype:'panel',
        //             layout:'border',
        //             width: window.innerWidth-40,
        //             height: window.innerHeight-60,
        //             items:[
        //                 {
        //                     xtype:'panel',
        //                     title:'Configurar grafica',
        //                     region:'west',
        //                     collapsible:true,
        //                     resizable:true,
        //                     width:250,
        //                     minWidth:150,
        //                     maxWidth:550,
        //                     tbar:[
        //                         '->',
        //                         {
        //                             xtype: 'button',
        //                             text:'Crear grafica',
        //                             iconCls:'graficar',
        //                             handler:function(){
        //                                 me.crearGrafica(
        //                                     tree.getStore().getRootNode().childNodes
        //                                 );
        //                             }
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     xtype:'tabpanel',
        //                     region:'center',
        //                     itemId:'panelgraficas',
        //                     items:[]
        //                 }
        //             ]
        //         }
        //     ]
        // }).show();
    },

    actionWindowGraficas:function(button){
        var me = this;
        switch (button.action) {
            case 'creargrafica':
                me.crearGrafica();
                break;
        }
    },

    crearGrafica:function(){
        var me = this,
            tree = me.getMainView(),
            windowGrafica=me.getWindowGraficas(),
            selmodelTree=windowGrafica.down('#treepanelareas').getSelectionModel(),
            seleccionados=selmodelTree.getSelection(),
            barras=windowGrafica.down('#checkboxmontos').getValue()['rb'];
        // var datos=me.devolverDatosGrafica(tree.getStore().getRootNode().childNodes);
        var datos=me.devolverDatosGrafica(seleccionados);
        console.log('barras',barras)
        console.log('datos',datos['data'])
        console.log('model',datos['model'])
        var grafica=Ext.create('Ext.chart.Chart',{
            title:windowGrafica.down('#nombre').getValue(),
            closable:true,
            animate: true,
            shadow: true,
            frame:true,
            legend: {
                position: 'bottom'
            },
            store: Ext.create('Ext.data.Store',{
                data:datos['data'],
                fields:datos['model']
            }),
            axes:[
                {
                    type: 'Numeric',
                    title: me.etiquetas.lbMontos,
                    position: 'left',
                    fields: barras,
                    minimum: 0,
                    label: {
                        renderer: Ext.util.Format.numberRenderer('0.000,00/i')
                    },
                    grid: true
                },
                {
                    type: 'Category',
                    title: me.etiquetas.lbAreas,
                    position: 'bottom',
                    fields: ['nombre']
                }
            ],
            series: [{
                type: 'column',
                axis: 'left',
                // type: 'bar',
                // axis: 'bottom',
                // gutter: 80,
                // stacked: true,
                highlight: true,
                xField: 'nombre',
                yField: barras,
                tips:{
                    trackMouse: true,
                    width:300, height:120,
                    renderer:function(storeItem, item) {
                        this.setTitle(storeItem.get('text'));
                        var cuerpo='<hr/><i>'+item.yField+'</i><br/><b>Total:</b> '+
                            Ext.util.Format.number(item.value[1], '0.000,00/i')+'<br/>';
                        Ext.Object.each(storeItem.data, function(key, value){
                            if(key.indexOf(item.yField+'_')!=-1){
                                cuerpo+='<b>'+key.split(item.yField+'_')[1]+':</b>'+
                                    Ext.util.Format.number(value, '0.000,00/i')+'<br/>'
                            }
                        });
                        this.update(cuerpo);
                    }
                },
                label:{
                    // display:'outside',
                    display:'insideEnd',
                    field:barras,
                    // orientation: 'vertical',
                    orientation: me.calcularDemasiadasBarras(100)?'vertical':'horizontal',
                    renderer:function(value){
                        return Ext.util.Format.number(value, '0.000,00/i');
                    }
                },
            }]
        });
        windowGrafica.down('#tabpanelgraficas').add(grafica);
        windowGrafica.down('#tabpanelgraficas').setActiveTab(grafica);
        windowGrafica.numGrafica+=1;
        windowGrafica.down('#nombre').setValue('Grafica #'+windowGrafica.numGrafica);
        selmodelTree.deselectAll();
    },

    checkValidezCrearGrafica:function(){
        var me=this,windowGrafica=me.getWindowGraficas(),
            campoinformacion=windowGrafica.down('#textinformacion');
            // tabPanel=windowGrafica.down('#tabpanelgraficas');
        // seleccionesText:'Falta por selecionar el area, los montos o el nombre de la grafica.',
        // selecciones:[' areas ', ' montos ', ' nombre '],
        var cantareas=windowGrafica.down('#treepanelareas').getSelectionModel().getSelection().length,
            cantmontos=windowGrafica.down('#checkboxmontos').getChecked().length,
            areas=cantareas==0,
            nombre=windowGrafica.down('#nombre').getValue()=='',
            montos=cantmontos==0;
            // cantbarras=cantareas*cantmontos,
            // maginumber=30;
        var falta=areas || nombre || montos;
        windowGrafica.down('#creargrafica').setDisabled(falta);
        var text=falta?campoinformacion.seleccionesText:campoinformacion.todoBienText;
        // if(tabPanel)
        //     maginumber=tabPanel.getWidth()/60;
        if(me.calcularDemasiadasBarras() && !falta)text+=campoinformacion.demasiadasBarrasText;
        campoinformacion.setValue(text);
    },

    calcularDemasiadasBarras:function(num){
        if(num==undefined)num=60;
        var me=this,windowGrafica=me.getWindowGraficas(),
            tabPanel=windowGrafica.down('#tabpanelgraficas'),
            maginumber=tabPanel.getWidth()/num,
            cantareas=windowGrafica.down('#treepanelareas').getSelectionModel().getSelection().length,
            cantmontos=windowGrafica.down('#checkboxmontos').getChecked().length,
            cantbarras=cantareas*cantmontos;
        return cantbarras>maginumber;
    },

    configurarColumnas: function(nuevas){
        var me=this,
            tree=me.getMainView(),
            columns=tree.columns;
        nuevas.forEach(function(x){
            tree.columnasEjecucion[0]['columns'].push(
                {
                    text: x['nombre'], width:150,align:'right',
                    tooltip:x['descripcion']?x['descripcion']:null,
                    dataIndex: 'fac_'+x['nombre'].toLowerCase(),
                    renderer:tree.formatoDinero,
                }
            );
            field=tree.getStore().model.getFields();
            field.push({name:'fac_'+x['nombre'].toLowerCase()});
            tree.getStore().model.setFields(field);
        });
        tree.reconfigure(tree.getStore(), tree.formarColumnas());
    },

    filterByEntity: function (cmb) {
        var tree = cmb.up('treepanel'),
            value = cmb.idValue;
        var filter= new Ext.util.Filter({
            id: 'idarea',
            property: 'idarea',
            value: value,
            'store': tree.getStore()
        });
        tree.getStore().filters.add(filter);
        tree.getStore().load();
    },

    clearFilterEntity: function (cmb) {
        var tree = cmb.up('treepanel');
        tree.getStore().filters.removeAtKey('idarea');
        tree.getStore().load();
        cmb.tree.selModel.deselectAll();
    }

});