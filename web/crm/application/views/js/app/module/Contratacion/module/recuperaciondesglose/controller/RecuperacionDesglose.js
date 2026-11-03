Ext.define('RecuperacionDesglose.controller.RecuperacionDesglose', {
    extend: 'CRM.core.controller.Base',
    confEnt: null,
    refs: [
        {ref: 'Main', selector: 'mainrecuperaciondesglose'},
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
                '#stMainStore':{
                    load: function(store, records, success){
                        if(success){
                            // records.forEach(function(x){
                            //     x.get('pago').forEach(function(y){
                            //         fields=store.model.getFields();
                            //         fields.push('montomoneda_'+y['moneda'].toLowerCase()+'_'+y['idmoneda']);
                            //         store.model.setFields(fields);
                            //         x.set('montomoneda_'+y['moneda'].toLowerCase()+'_'+y['idmoneda'],
                            //             parseFloat(y['monto']))
                            //     });
                            // })
                        }
                    }
                },
            },
            component: {
                'mainrecuperaciondesglose': {
                    // itemdblclick: this.onDobleClick,
                    selectionchange: this.selectItem,
                    itemcontextmenu: this.showContextMenu,
                    // afterrender: this.afterRenderMain,
                    resize: this.afterRenderMain
                },
                'mainrecuperaciondesglose button[action], menuitem[action]':{
                    click: me.onButtonClick
                },
                'mainrecuperaciondesglose pickerfield[localId]':{
                    select: this.selectCombo,
                    change: this.changeCombo
                }
            }
        });
    },
    afterRenderMain: function(grid){
        var me=this, sumacolumnas=0, columnaSelect=null;
        grid.columns.forEach(function(x){
            if(x.width && x.dataIndex && x.dataIndex!='descripcion')
                sumacolumnas+=x.width
            if(x.dataIndex=='descripcion')columnaSelect=x;
        })
        // setTimeout(function(){
        //     console.log('sumacolumnas:', sumacolumnas, sumacolumnas+2)
        //     console.log('grid.widt:', grid.getWidth())
        //     console.log('largo column:', grid.getWidth()-sumacolumnas)
            sumacolumnas=sumacolumnas+2;
            if(grid.getWidth()>sumacolumnas){
                columnaSelect.width=grid.getWidth()-sumacolumnas;
                grid.reconfigure(null, null);
            }
        // },300)
        // columnaSelect.width=grid.getWidth()-sumacolumnas
    },
    onButtonClick: function(cmp){
        var me=this;
       // console.log('onButtonClick', cmp.action)
        switch(cmp.action){
            case 'detalleshito':
                me.verDetalleHito(cmp.up('grid'));break;
            case 'detallescontrato':
                me.verDetalleContrato(cmp);break;
            case 'detallesdesgloses':
                me.verDetalleDesglose(cmp);break;
            case 'mostrartipos':
                me.mostrarTipos(cmp);break;
            case 'realizarfiltros':
                me.realizarFiltros(cmp);break;
            case 'limpiarfiltros':
                me.limpiarFiltros(cmp);break;
        }
    },
    verDetalleHito: function(grid){
        var record = grid.getSelectionModel().getSelection()[0],
            monedas=grid.store.proxy.reader.jsonData.monedasentidad;
        Ext.create('Facturacion.view.DetailsWindow',{
            idcontrato:record.data.idcontrato, extrafields: monedas}
        ).show(record);
    },
    verDetalleContrato: function(cmp){
        var me=this, grid = cmp.up('grid'),
            record = grid.getSelectionModel().getSelection()[0];
        if(record.get('idcontrato')){
            var mask = new Ext.LoadMask(cmp,
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
    verDetalleDesglose: function(cmp){
        var me=this,
            grid=cmp.up('grid'),
            seleccionado=grid.getSelectionModel().getSelection()[0],
            monedas=grid.store.proxy.reader.jsonData.monedasentidad;
        var win=Ext.create('Ext.window.Window',{
            title: 'Desgloses',
            modal: true,
            resizable:false,
            contrain: true,
            layout: 'fit',
            height: window.innerHeight<600?window.innerHeight*0.9:600,
            width: window.innerWidth<1000?window.innerWidth*0.9:1000,
            items:[
                Ext.create('DesgloseContrato.view.TabHitosAreas',{
                    extrafields: monedas
                })
            ],
            buttons:[
                {
                    text: 'Cerrar',
                    iconCls: 'icondistra-cerrar',
                    tooltip: 'Cerrar',
                    handler: function () {
                        win.close();
                    }
                }
            ]
        });
        win.show(null, function(){
            win.down('#tabpanelhitos').establecerMontoTotal(seleccionado.get('montototal'));
            win.down('#tabpanelhitos').configurarMonedasHito(seleccionado);
            win.down('#tabpanelhitos').cargarGrids(seleccionado.data.idhito);
        });
    },
    selectItem: function(sm, records){
        // console.log('selectItem:', records.length, records.length!=1)
        var me=this, grid=me.getMain();
        grid.down('#detalleshito').setDisabled(records.length!=1);
        grid.down('#detallescontrato').setDisabled(records.length!=1);
        grid.down('#detallesdesgloses').setDisabled(records.length!=1);
    },
    showContextMenu: function (view, record, item, index, e, eOpts) {
        console.log('rerererere')
        e.stopEvent();
        var grid = view.up('grid'),
            sm = view.up('grid').getSelectionModel();
        if (sm.getCount() <= 1)
            sm.select(record);
        var menu=this.createContextMenu(grid);
        if (menu.items.length > 0)
            menu.showAt(e.getXY());
    },
    createContextMenu: function (grid) {
        var me=this;
        return me.getMain().down('#buttonacciones').menu;
        // return Ext.create('Ext.menu.Menu', {
        //     itemId: 'contextMenuRecuperacionDesglose',
        //     plain: true,
        //     items: [
        //         {
        //             text: 'Ver hito',
        //             action: 'detalleshito',
        //             iconCls: 'detalles',
        //             handler: function(){
        //                 me.verDetalleHito(grid);
        //             }
        //         },
        //         {
        //             text: 'Ver contrato',
        //             action: 'detallescontrato',
        //             iconCls: 'detalles',
        //             handler: function(yo){
        //                 me.verDetalleContrato(yo);
        //             }
        //         }
        //     ]
        // });
    },
    mostrarTipos: function(cmp){
        var me=this, grid=cmp.up('grid'), tooltip='Mostrando:', presentes=[];
        cmp.menu.items.items.forEach(function(x){
            if(x.checked){
                presentes.push(x.itemId);
                tooltip+='<br/>-'+x.nombre;
            }
        })
        with(grid.getStore().proxy){
            if(extraParams['filter[42][data][value]'] && extraParams['filter[42][data][value]']==presentes.toString() ||
                !extraParams['filter[42][field]'] && presentes.length==cmp.menu.items.length){
                mostrarMensaje(8, 'Son los elementos mostrados actualmente.');
                // setTimeout(function(){mostrarMensaje(8, 'Tienes que fijarte mejor.')}, 4000)
                // setTimeout(function(){mostrarMensaje(8, 'No puedes estar dando click asi a lo loco.')}, 8000)
            }else{
                if(presentes.length<cmp.menu.items.length){
                    extraParams['filter[42][field]']='mostrartipos';
                    extraParams['filter[42][data][type]']='other';
                    extraParams['filter[42][data][value]']=presentes.toString();

                    // presentes.forEach(function(x){
                    //     aux=x.split('_');
                    //     grid.getStore().proxy.extraParams['filter['+aux[1]+'][field]']=aux[0];
                    //     grid.getStore().proxy.extraParams['filter['+aux[1]+'][data][type]']='other';
                    //     grid.getStore().proxy.extraParams['filter['+aux[1]+'][data][value]']=true;
                    // })
                }else{
                    delete extraParams['filter[42][field]'];
                    delete extraParams['filter[42][data][type]'];
                    delete extraParams['filter[42][data][value]'];
                    // presentes.forEach(function(x){
                    //     aux=x.split('_');
                    //     if(grid.getStore().proxy.extraParams['filter['+aux[1]+'][field]']){
                    //         delete grid.getStore().proxy.extraParams['filter['+aux[1]+'][field]'];
                    //         delete grid.getStore().proxy.extraParams['filter['+aux[1]+'][data][type]'];
                    //         delete grid.getStore().proxy.extraParams['filter['+aux[1]+'][data][value]'];
                    //     }
                    // })
                }
                grid.getStore().load();
                cmp.setTooltip(tooltip);
            }
        }
    },
    realizarFiltros: function(cmp){
        var me=this, main=me.getMain(), tooltip='Filtros', cant=0;
        cmp.up('form').queryBy(function(x){
            if(Ext.isFunction(x.getValue) && x.parametro){
                with(main.getStore()){
                    if(x.getValue() && (x.multiSelect?x.getValue().length>0:true)){
                        cant++;
                        console.log('FieldLabel:', x.fieldLabel, x.getValue())
                        tooltip+='<br/>-'+x.fieldLabel;
                        proxy.extraParams['filter['+x.parametro['numero']+'][field]']=x.parametro['field'];
                        proxy.extraParams['filter['+x.parametro['numero']+'][data][type]']=x.parametro['type'];
                        proxy.extraParams['filter['+x.parametro['numero']+'][data][value]']=Ext.isArray(x.getValue())?Ext.encode(x.getValue()):x.getValue();
                    }else{
                        if(proxy.extraParams['filter['+x.parametro['numero']+'][field]']){
                            delete proxy.extraParams['filter['+x.parametro['numero']+'][field]'];
                            delete proxy.extraParams['filter['+x.parametro['numero']+'][data][type]'];
                            delete proxy.extraParams['filter['+x.parametro['numero']+'][data][value]'];
                        }
                    }
                }
            }
        })
        main.getStore().load({
            callback:function(){
                main.down('#mostrarfiltros').setTooltip(tooltip);
                main.down('#limpiarfiltros').setDisabled(cant==0);
                main.down('#mostrarfiltros').setText((cant>0?'<b>Filtros ('+cant+')</b>':'Filtros'));
            }
        });
    },

    limpiarFiltros: function(cmp){
        var me=this, main=me.getMain();
        main.down('#limpiarfiltros').setDisabled(true);
        main.down('#toolbarfiltros').down('form').getForm().reset();
        me.realizarFiltros(cmp);
    },

    selectCombo: function (combo, records) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);
        console.log('selectCombo:', hiddenField)
        if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.valorId]);
        }
    },

    changeCombo: function (combo, value) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);
        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
    },
});