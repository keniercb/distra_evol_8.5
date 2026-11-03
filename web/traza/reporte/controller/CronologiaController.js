Ext.define('Traces.controller.Cronologia', {
    extend: 'Ext.app.Controller',

    views: [
        'PanelCronologia',
        'GridpanelCronologia'
    ],

    refs: [
        {
            ref: 'panelCronologia',
            selector: 'panelCronologia'
        },
        {
            ref: 'gridpanelCronologia',
            selector: 'gridpanelCronologia'
        }
    ],

    init: function () {
        var me = this;
        me.control({
            'panelCronologia': {
                render: me.onRenderPanel
            },
            'panelCronologia button[action = cronologiaLimpiar]': {
                click: me.limpiarCronologia
            },
            'panelCronologia button[action = cronologiaBuscar]': {
                click: me.buscarCronologia
            },
            'panelCronologia datefield[name=fechafin_cronologia]': {
                change: me.cambiarValorMaximo
            },
            'panelCronologia datefield[name=fechainicio_cronologia]': {
                change: me.cambiarValorMinimo
            }/*,
            'panelCronologia [action = accChange]': {
                change: _this.activarBuscar
            },
            'panelCronologia':{
                beforeLoad: _this.cargarTrazas
            }*/

        });
    },

    onRenderPanel: function () {
        var me = this;
        me.getGridpanelCronologia().getStore().on('beforeload', function(store,operation,eOpts){
                var v = Ext.getCmp('tipoTraza_cronologia').value;
                var z = Ext.getCmp('usuario_cronologia').value;
                store.proxy.extraParams.fechainicio = Ext.getCmp('fechainicio_cronologia').getValue();
                store.proxy.extraParams.fechafin = Ext.getCmp('fechafin_cronologia').getValue();
                store.proxy.extraParams.usuarios = z == "" ? [] : new Array(z);
                store.proxy.extraParams.idtipotrazas = v == "" ? [] : new Array(v);
                store.proxy.extraParams.ippc = Ext.getCmp('comboIP_cronologia').getValue();
        });

        me.getGridpanelCronologia().getStore().load();

        me.keyMap = new Ext.util.KeyMap(Ext.get('panelCronologia'), [
            {
                key: "b",
                alt:true,
                fn: function(e,a){
                    a.browserEvent.preventDefault();
                    if(!Ext.getCmp('btnBuscar_cronologia').disabled){
                        me.buscarCronologia();
                    }
                }
            },
            {
                key: "l",
                alt:true,
                fn: function(e,a){
                    a.browserEvent.preventDefault();
                    if(!Ext.getCmp('btnLimpiar_cronologia').disabled){
                        me.limpiarCronologia();
                    }
                }
            }
        ]);

        //console.log('RENDER PANEL CRONOLOGIA!!!');

    },
   /* buscarCronologia: function () {
        alert('Buscar');
    },*/
    limpiarCronologia: function () {
        var me = this;
        Ext.getCmp('fechainicio_cronologia').reset();
        Ext.getCmp('fechafin_cronologia').reset();
        Ext.getCmp('usuario_cronologia').reset();
        Ext.getCmp('tipoTraza_cronologia').reset();
        Ext.getCmp('comboIP_cronologia').reset();
        //me.getGridpanelCronologia().getStore().removeAll();
        me.getGridpanelCronologia().getStore().loadPage(1, {
            params: {
                fechainicio: Ext.getCmp('fechainicio_cronologia').getValue(),
                fechafin: Ext.getCmp('fechafin_cronologia').getValue(),
                start: 0,
                limit: 20
            }
        });

    },
    cambiarValorMaximo: function(){
        Ext.getCmp('fechainicio_cronologia').setMaxValue(Ext.getCmp('fechafin_cronologia').getValue());
    },

    cambiarValorMinimo: function(){
        Ext.getCmp('fechafin_cronologia').setMinValue(Ext.getCmp('fechainicio_cronologia').getValue());
    },
    obtenerValores: function (){
        return{
            fechainicio  : Ext.getCmp('fechainicio_cronologia').getValue(),
            fechafin     : Ext.getCmp('fechafin_cronologia').getValue(),
            usuarios     : Ext.getCmp('usuario_cronologia').getValue(),
            idtipotrazas : Ext.getCmp('tipoTraza_cronologia').getValue(),
            ippc         : Ext.getCmp('comboIP_cronologia').getValue()
        }
    },
    existenFiltros: function(){
        var parametros = _this.obtenerValores();
        return !(parametros.usuario.length ==0 && parametros.tipotraza.length ==0 && parametros.comboIP == '');
    },
    //reload : function(){
    //    var me = this;
    //    me.storegrid = Ext.getCmp('gridpanelCronologia').getStore();
    //    me.storegrid.load({
    //        params : {
    //            start: 0,
    //            limit: me.pageSize
    //        }
    //    });
    //},
    buscarCronologia:function(){
        var me = this;
        var v = Ext.getCmp('tipoTraza_cronologia').value;
        var z = Ext.getCmp('usuario_cronologia').value;

        me.getGridpanelCronologia().getStore().loadPage(1, {
            params: {
                fechainicio: Ext.getCmp('fechainicio_cronologia').getValue(),
                fechafin: Ext.getCmp('fechafin_cronologia').getValue(),
                usuarios: z == "" ? [] : new Array(z),
                idtipotrazas: v == "" ? [] : new Array(v),
                ippc: Ext.getCmp('comboIP_cronologia').getValue(),
                start: 0//,
                //limit: Ext.getCmp('cbpagesize').getValue()
            }
        });
        //me.getGridpanelCronologia().getStore().load({
        //    params:{
        //        fechainicio    : Ext.getCmp('fechainicio_cronologia').getValue(),
        //        fechafin       : Ext.getCmp('fechafin_cronologia').getValue(),
        //        usuarios       : z,
        //        idtipotrazas   : v,
        //        ippc           : Ext.getCmp('comboIP_cronologia').getValue(),
        //        start:0,
        //        limit:20
        //    }
        //});
    }
});
