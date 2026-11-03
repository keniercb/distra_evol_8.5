Ext.define('Ext.ux.RangoFechasFilter', {
    extend: 'Ext.container.Container',
    alias: 'widget.rangofechafilter',
    itemId: 'rangofechasfilter',
    layout: 'hbox',
    parametroFiltro: 'fecha', //parametro que se usará para enviar el filtro al servidor
    buttonLimpiar: true, //si se va a mostrar el boton Limpiar (util si se necesita que al menos halla un valor de rango adicionado o sea un filtro obligatorio)
    buttonLimpiarCampos: true,
    textShow: 'emptyText', //donde mostrar el fechaInicialText y fechaFinalText puede ser: emptyText-> en el empty text del campo, fieldLabel->¡adivina donde!!!
    initialValue: 'vacio',  // puede ser: vacio->vacio, mesActual->de verdad tengo que explicarlo?
    fechaInicialText: 'Fecha de inicio', //nombre del primer campo de fecha
    fechaFinalText: 'Fecha de fin', //nombre del segundo campo de fecha
    buscarTooltip: 'Buscar por fechas', //tooltip del boton Buscar
    limpiarTooltip: 'Limpiar filtro por fechas', //tooltip del boton Limpiar
    initComponent: function () {
        var me = this;
        var hoy=new Date();
        me.items=[
            Ext.create('Ext.ux.FechaTrigger', {
                labelAlign: 'top',
                fieldLabel: me.textShow=='fieldLabel'?me.fechaInicialText:null,
                // labelWidth:
                name: 'fechainicio',
                itemId: 'fechainicio',
                margin: '0 2 0 0',
                emptyText: me.textShow=='emptyText'?me.fechaInicialText:'Seleccione...',
                // value: me.initialValue=='mesActual'?new Date(hoy.getFullYear(), hoy.getMonth(), 1):null,
                endDateField: 'fechafin',
                limpiarButton: me.buttonLimpiarCampos,
                listeners:{
                    change: function(){
                        me.checkFechasInicioFin();
                    }
                }
            }),
            Ext.create('Ext.ux.FechaTrigger', {
                labelAlign: 'top',
                fieldLabel: me.textShow=='fieldLabel'?me.fechaFinalText:null,
                name: 'fechafin',
                itemId: 'fechafin',
                margin: '0 2 0 0',
                emptyText: me.textShow=='emptyText'?me.fechaFinalText:'Seleccione...',
                // value: me.initialValue=='mesActual'?new Date(hoy.getFullYear(), hoy.getMonth()+1, 0):null,
                startDateField: 'fechainicio',
                limpiarButton: me.buttonLimpiarCampos,
                listeners:{
                    change: function(){
                        me.checkFechasInicioFin();
                    }
                }
            }),
            Ext.create('Ext.button.Button',{
                iconCls: 'buscar',
                tooltip: me.buscarTooltip,
                itemId: 'buscarfechas',
                disabled: true,
                ui:'default-toolbar-small',
                handler: function(){
                    me.functionFiltrar();
                }
            }),
            Ext.create('Ext.button.Button',{
                iconCls: 'limpiar',
                tooltip: me.limpiarTooltip,
                itemId: 'limpiarfechas',
                hidden: !me.buttonLimpiar,
                disabled: true,
                ui:'default-toolbar-small',
                handler: function(){
                    me.functionLimpiar();
                }
            })
        ];

        me.callParent();
    },
    listeners:{
        afterrender: function(yo){
            if(yo.initialValue=='mesActual'){
                var hoy=new Date(),
                    inicioMes=new Date(hoy.getFullYear(), hoy.getMonth(), 1),
                    finMes=new Date(hoy.getFullYear(), hoy.getMonth()+1, 0);
                yo.down('#fechainicio').setValue(inicioMes);
                yo.down('#fechafin').setValue(finMes);
                // yo.down('#fechainicio').fireEvent('change', yo.down('#fechainicio'), yo.down('#fechainicio').getValue());
                // yo.down('#fechafin').fireEvent('change', yo.down('#fechafin'), yo.down('#fechafin').getValue());
                // hitogrid=yo.getGrid();
                // if(hitogrid)yo.functionFiltrar();
            }
        }
    },
    getGrid: function(){
        var me=this, gridhitos=null;
        if(me.grid){
            console.log('grid si')
            gridhitos=me.grid;
        }else{
            console.log('up si')
            gridhitos=me.up('grid');
        }
        console.log('grid:', gridhitos)
        return gridhitos;
    },
    checkFechasInicioFin: function(){
        var me=this;
        me.down('#buscarfechas').setDisabled(
            !(me.down('#fechainicio').getValue() || me.down('#fechafin').getValue()));
    },
    functionFiltrar: function(){
        var me=this,
            gridhitos=me.getGrid();
        if(gridhitos)
            with(gridhitos.getStore()){
                // if(isLoading()){
                //     Ext.Ajax.abort(proxy.activeRequest);
                //     delete proxy.activeRequest;
                // }
                if(gridhitos.down('#fechainicio').getValue()){
                    proxy.extraParams['filter[50][field]']=me.parametroFiltro;
                    proxy.extraParams['filter[50][data][type]']='date';
                    proxy.extraParams['filter[50][data][comparison]']='gt';
                    proxy.extraParams['filter[50][data][value]']=gridhitos.down('#fechainicio').getValue();
                }else{
                    me.limpiarEntrada(gridhitos.getStore(), 'filter[50]');
                }
                if(gridhitos.down('#fechafin').getValue()){
                    proxy.extraParams['filter[51][field]']=me.parametroFiltro;
                    proxy.extraParams['filter[51][data][type]']='date';
                    proxy.extraParams['filter[51][data][comparison]']='lt';
                    proxy.extraParams['filter[51][data][value]']=gridhitos.down('#fechafin').getValue();
                }else{
                    me.limpiarEntrada(gridhitos.getStore(), 'filter[51]');
                }
                load();
                me.down('#limpiarfechas').setDisabled(false);
            }
    },
    functionLimpiar: function(){
        var me=this,
            gridhitos=me.getGrid();
        if(gridhitos)
            // with(gridhitos.getStore()){
                // if(proxy.extraParams['filter[40][field]']){
                //     delete proxy.extraParams['filter[40][field]'];
                //     delete proxy.extraParams['filter[40][data][type]'];
                //     delete proxy.extraParams['filter[40][data][comparison]'];
                //     delete proxy.extraParams['filter[40][data][value]'];
                // }
                me.limpiarEntrada(gridhitos.getStore(), 'filter[50]');
                me.down('#fechainicio').reset();
                // if(proxy.extraParams['filter[41][field]']){
                //     delete proxy.extraParams['filter[41][field]'];
                //     delete proxy.extraParams['filter[41][data][type]'];
                //     delete proxy.extraParams['filter[41][data][comparison]'];
                //     delete proxy.extraParams['filter[41][data][value]'];
                // }
                me.limpiarEntrada(gridhitos.getStore(), 'filter[51]');
                me.down('#fechafin').reset();
                gridhitos.getStore().load();
                me.down('#limpiarfechas').setDisabled(true);
            // }
    },
    limpiarEntrada: function(store, entrada){
        if(store.proxy.extraParams[entrada+'[field]']){
            delete store.proxy.extraParams[entrada+'[field]'];
            delete store.proxy.extraParams[entrada+'[data][type]'];
            delete store.proxy.extraParams[entrada+'[data][comparison]'];
            delete store.proxy.extraParams[entrada+'[data][value]'];
        }
    }
});