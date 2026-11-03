Ext.define('GestionContratoImportacion.controller.WindowProducto', {
    extend: 'Ext.app.Controller',

    refs: [
        {ref: 'winProducto', selector: 'windowproductoimportacion'},
        {ref: 'winServicio', selector: 'windowservicioimportacion'},
        {ref: 'gridProducto', selector: 'gridproductoimportacion'}
    ],

    init: function () {

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'windowproductoimportacion searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'windowproductoimportacion button[action=acept], windowproductoimportacion button[action=apply], windowservicioimportacion button[action=acept], windowservicioimportacion button[action=apply]': {
                    click: this.onSave
                },
                'windowproductoimportacion gridpanel,windowservicioimportacion gridpanel': {
                    selectionchange: this.onSelectionChange
                }
            }
        });
    },

    onSave: function (btn) {
        var window = btn.up('window'),
            gridproducto = window.gridproducto,
            stproducto = gridproducto.getStore(),
            records = window.grid.getSelectionModel().getSelection(),
            alias = window.xtype,
            datos_json='';
        if(records.length==1)
            if(window.datosAdicionales){
                if(window.datosAdicionales.items.length!=0) {
                    datos_json = window.datosAdicionales.getForm().getValues();
                }
            }
        Ext.each(records, function (record) {
            var index = stproducto.find('idindicador', record.data.idindicador || record.data.idactividad);
            var seguir=true;
            if(index!=-1){
                Ext.each(stproducto.getRange(), function(value, key){
                    if(value.get('datos_json_encode')==Ext.encode(datos_json))
                        seguir=false;
                });
            }
            if (index == -1 || seguir) {
                stproducto.add({
                    idindicador: record.data.idindicador,
                    denominacion: record.data.denominacion,
                    codigo: record.data.codigoproveedor,
                    codigoproveedor: record.data.codigoproveedor,
                    cantidad: 1,
                    idactividad: record.data.idactividad,
                    unidadmedida: record.data.dumedida || 'Unidad',
                    precio: record.data.precio,
                    preciodivisa: record.data.preciodivisa,
                    preciototal: parseFloat(record.data.precio),
                    preciodivisatotal: parseFloat(record.data.preciodivisa),
                    tipo: record.data.tipo || 2,
                    monto: 0,
                    datos_json: datos_json,
                    datos_json_encode: typeof datos_json=='Object'?Ext.encode(datos_json):datos_json,
                });
                Ext.each(gridproducto.up('window').extrafields, function (value, index) {
                    if (gridproducto.up('window').down('#montomoneda_' + value.codigoiso.toLowerCase())) {
                        // if (!gridproducto.up('window').down('#montomoneda_' + value.codigoiso.toLowerCase()).introducidoManual)
                            gridproducto.up('window').down('#montomoneda_' + value.codigoiso.toLowerCase()).validate();
                    }
                })
            }
        });
        stproducto.fireEvent('update', stproducto);
        stproducto.fireEvent('addall', stproducto);
        if (gridproducto.up('window').formaPago && Ext.isFunction(gridproducto.up('window').formaPago.cambiarMontosPorHitosIndicadores)) {
            gridproducto.up('window').formaPago.cambiarMontosPorHitosIndicadores();
            gridproducto.up('window').formaPago.comprobarValidezMontos();
        } else if(Ext.isFunction(gridproducto.up('window').cambiarMontosPorHitosIndicadores)){
            gridproducto.up('window').cambiarMontosPorHitosIndicadores();
        }
        if(btn.action=='acept') {
            window.grid.getSelectionModel().deselectAll();
            window.close();
        }
    },

    onSearch: function (field) {
        var grid = this.getWinProducto().grid;
        grid.getStore().load({
            params: {
                denominacion: field.getValue()
            }
        });
    },

    onClear: function () {
        var grid = this.getWinProducto().grid;
        grid.getStore().load();
    },

    onSelectionChange: function (sm, records) {
        var window = sm.view.up('gridpanel').up('window'),
            btn = window.btnAceptar, btn2 = window.btnAplicar;
        if (records.length > 0) {
            btn.enable();
            btn2.enable();
        } else {
            btn.disable();
            btn2.disable();
        }
    }
});

