Ext.define('RecupClientesProveedores.controller.Main', {
    extend: 'CRM.core.controller.Base',
    confEnt: null,
    refs: [
        {ref: 'MainView', selector: 'recupclientesproveedores_view'},
        {ref: 'WinBusqAvanz', selector: 'winbusquedaavanzada'},
        {ref: 'WinDetallesCP', selector: 'windetallescp'},
    ],
    requires: [
		'GestionContrato.view.DetailsWindow',
    ],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            component: {
                "recupclientesproveedores_view": {
                    render: this.onRenderList,
                    selectionchange: this.onSelectionChangeList,
                    itemdblclick: this.showWinDetalles,
                },
                "recupclientesproveedores_view button[action=verdetalles]": {
                    click: this.showWinDetalles,
                },
                "windetallescp button[action=cerrar]": {
                    click: this.hideWinDetallesCP,
                },
                "recupclientesproveedores_view button[action=generarreporte]": {
                    click: this.generarReporte,
                },
                "recupclientesproveedores_view button[action=filtros]": {
                    click: this.mostrarFiltros,
                },
                "recupclientesproveedores_view button[action=busquedaavanzada]": {
                    click: this.showWinBusquedaAvanzada,
                },
                "winbusquedaavanzada button[action=cancelar]": {
                    click: this.hideWinBusquedaAvanzada,
                },
                "winbusquedaavanzada button[action=buscar]": {
                    click: this.searchBusquedaAvanzada,
                },
                "winbusquedaavanzada form combobox": {
                    change: this.changeComboBusqAvanzada,
                },
                "recupclientesproveedores_view form button[action=buscarform]": {
                    click: this.searchClientesProveedores,
                },
                "recupclientesproveedores_view form button[action=limpiarform]": {
                    click: this.cleanSearchClientesProveedores,
                },
            }
        });
    },
    onRenderList: function(elem){
        elem.getStore().load();
    },
    onSelectionChangeList: function(sm, select){
        var gpClientesP = this.getMainView();

        gpClientesP.down('button[action=verdetalles]').setDisabled( select.length != 1);
    },
    showWinDetalles: function(){
        var recordSelected = this.getMainView().getSelectionModel().getSelection()[0];
        this.loadDetallesClienteProveedor(recordSelected.get('idclientesproveedores'));
        this.getWinDetalles().show(recordSelected);
    },
    getWinDetalles: function(){
        if(!this.windetalles){
            this.windetalles = new Ext.create('RecupClientesProveedores.view.WinDetallesCP');
        }
        return this.windetalles;
    },
    hideWinDetallesCP: function(){
        this.getWinDetalles().hide();
    } ,
    mostrarFiltros: function(){
        var formFiltros = this.getMainView().getDockedComponent(2);
        formFiltros.setVisible(!formFiltros.isVisible());
    },
    showWinBusquedaAvanzada: function(){
         this.getWinBusqAvan().show();
    },
    getWinBusqAvan: function(){
        if(!this.winbusqavan){
            this.winbusqavan = new Ext.create('RecupClientesProveedores.view.WinBusquedaAvanzada');
        }
        return this.winbusqavan;
    },
    hideWinBusquedaAvanzada: function(){
        this.getWinBusqAvan().hide();
    },
    searchBusquedaAvanzada: function(){
        var form = this.getWinBusqAvan().down('form');
        if( form.isValid() ){
            this.searchClientesProveedores();
            this.getWinBusqAvan().hide();
        }
    },
    changeComboBusqAvanzada: function(cb, newVal, oldVal){
        var ffin = this.getWinBusqAvan().down('form datefield[name=fechafin]');

        ffin.setDisabled(newVal != 5);
        ffin.setVisible(newVal == 5);
    },
    searchClientesProveedores: function(){
        var form = this.getMainView().getDockedComponent(2),
            values = form.getValues(),
            store = this.getMainView().getStore(),
            busqAvanz = this.getFiltersWinBuscarAvanzada()
            filters = [];
        
        store.clearFilter(true);
        console.log('values:', values);
        for(i in values){
            if(!Ext.isEmpty(values[i]))
                filters.push({property:i, value: values[i]});
        }

        if(busqAvanz)
            filters.push(busqAvanz);

        store.addFilter(filters);
    },
    getFiltersWinBuscarAvanzada: function(){
        var form = this.getWinBusqAvan().down('form'),
            values = form.getValues();
        
        if( form.isValid() && (values['fechainicio'] || values['fechafin']) ){
            return {property:'fechafirma', value: Ext.encode(values) };
        }else
            return null;
    },
    cleanSearchClientesProveedores: function(comp){
        var form = comp.findParentByType('form'),
            store = this.getMainView().getStore(),
            formBA = this.getWinBusqAvan().down('form');
            
            form.getForm().reset();
            formBA.getForm().reset();
            store.clearFilter();
    },
    loadDetallesClienteProveedor: function(idclientep){
        var me = this,
            windetalles = me.getWinDetalles();

        Ext.Ajax.request({
            url: UtilsFn.buildUrl( 'getClienteProveedorDetalles', me),
            params: {idclienteproveedor: idclientep},
            callback: function (options, success, response) {
               
                var info = Ext.decode(response.responseText);
                
                if(info.success){
                    windetalles.showLoadingMask(false);
                    windetalles.loadDetallesList(info['datos']);
                }
            },
            scope: me
        });
    },
    generarReporte: function(){
        var me = this,
            store = this.getMainView().getStore(),
            filters = new Array(),
            result = {};

        store.filters.each(function(filter){
            filters.push({'property': filter.property, 'value': filter.value});
        }, me);
        
        if(filters.length)
            result.filter = Ext.encode(filters);

        var src = document.location.protocol + '//' + document.location.host + UtilsFn.buildUrl({action: 'exportarDatos'}, ModuleMgr.get('RecupClientesProveedores'));
        window.open(src+'?'+ Ext.urlEncode(result) );
    }
});