Ext.define('SolicitudPago.controller.MainWindow', {
    extend: 'Ext.app.Controller',

    refs: [
        {ref: 'solicitudPagoWindow', selector: 'sp_solicitudpagowindow'},
        {ref: 'facturaWindow', selector: 'sp_facturawindow'},
        {ref: 'gridFacturas', selector: 'sp_gridfacturas'},
    ],

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {},
            component: {
                // 'sp_solicitudpagowindow':{
                //     render:this.comprobarValidez
                // },
                // 'sp_gridfacturas button[action],sp_gridfacturas menuitem[action]':{
                //     click: this.onClickAction
                // },
                // 'sp_facturawindow':{
                //     render:this.comprobarValidez
                // },
                // 'sp_facturawindow button[action]':{
                //     click:this.onClickFactura
                // }
            }
        });
    },
    // comprobarValidez: function(window){
    //     console.log('hago render', window)
    //     window.down('form').on('validitychange',function(form, valido){
    //         console.log('validezzz', valido)
    //         window.btnAceptar.setDisabled(!valido)
    //     });
    // },
    // onClickFactura: function(button){
    //     var self=this;
    //     console.log('onClickFactura:', button)
    //     if(button.action=='acept'){
    //         var window=button.up('window');
    //         console.log('grid', window.down('grid'))
    //         console.log('grid2', self.getGridFacturas())
    //         if(self.getGridFacturas()){
    //             var store=self.getGridFacturas().getStore();
    //             store.add(window.down('form').getForm().getValues());
    //             window.close();
    //         }
    //     }
    // },
    // onClickAction: function (cmp) {
    //     var me = this;
    //     switch (cmp.action) {
    //         case 'detfactura':
    //             this.WindowFactura('det');
    //             break;
    //         case 'addfactura':
    //             this.WindowFactura('add', 'Adicionar factura');
    //             break;
    //         case 'modfactura':
    //             this.WindowFactura('mod', 'Modificar factura');
    //             break;
    //         case 'delfactura':
    //             this.delFactura();
    //             break;
    //     }
    // },
    //
    // WindowFactura: function(caso, title){
    //     var me=this;
    //     console.log('crear ventana')
    //     var win=Ext.create('SolicitudPago.view.WindowFactura',{
    //         detalles: caso=='det',
    //         title: title
    //     });
    //     win.show(null, function(){
    //         console.log('antes de mostrara')
    //         var selected=me.getGridFacturas().selModel.getSelection();
    //         if(caso!='add' && selected.length==1){
    //             win.down('form').loadRecord(selected[0])
    //         }
    //     });
    // },
    // delFactura:function(){
    //     var me=this;
    //     console.log('del:');
    //     var dialog = Ext.create('Ext.window.MessageBox', {
    //         buttonAlign: 'center',
    //         buttons: [
    //             {
    //                 text: 'Aceptar',
    //                 iconCls: 'aceptar',
    //                 handler: function () {
    //                     console.log('del aceptar:', me.getGridFacturas().selModel.getSelection())
    //                     var selected=me.getGridFacturas().selModel.getSelection();
    //                     me.getGridFacturas().getStore().remove(selected);
    //                     dialog.close();
    //                 }
    //             },
    //             {
    //                 text: 'Cancelar',
    //                 iconCls: 'cancelar',
    //                 handler: function () {
    //                     dialog.close();
    //                 }
    //             }
    //         ]
    //     });
    //     dialog.show({
    //         title:'Confirmación',
    //         msg: 'Esta seguro seguro',
    //         icon: Ext.MessageBox.QUESTION,
    //     });
    // }
});
