Ext.define('Demanda.controller.AreasImplicadas', {
    extend: 'CRM.core.controller.Base',
    // refs: [
    //     {ref: 'GpAreasImplicadas', selector: 'gpareasimplicadas'},
    //     {ref: 'WinInsertArea', selector: 'wininsertarea'},
    //     // {ref: 'WinEditDemanda', selector: 'wineditdemanda'},
    //     {ref: 'WinEditSolicitud', selector: 'wineditsolicitud'}
    // ],
    init: function () {
        var me = this;
        me.getLang();
        //
        //     me.listen({
        //         component: {
        //             "gpareasimplicadas": {
        //                 selectionchange: this.onSelectionChangeAreasImplicadas
        //             },
        //             "gpareasimplicadas button[action=addareaimplicada]": {
        //                 click: this.showWinInsertArea
        //             },
        //             "gpareasimplicadas button[action=elimareaimplicada]": {
        //                 click: this.eliminarArea
        //             },
        //             "wininsertarea button[action=aceptar]":{
        //                 click: this.insertarArea
        //             },
        //             "wininsertarea button[action=cerrar]":{
        //                 click: this.closeWinInsertArea
        //             },
        //             "wininsertarea treepanel":{
        //                 selectionchange: this.onSelectionChangeTreeEstructura
        //             }
        //         }
        //     });
        // },
        // onSelectionChangeAreasImplicadas: function(sm, select){
        //     this.getGpAreasImplicadas().down('button[action=elimareaimplicada]').setDisabled( select.length == 0);
        // },
        // getWinInsertArea: function(){
        //     if(!this.wininsertarea){
        //         this.wininsertarea = new Ext.create('Demanda.view.WinInsertArea');
        //     }
        //     return this.wininsertarea;
        // },
        // showWinInsertArea: function(){
        //     var win = this.getWinInsertArea();
        //     win.show();
        //     win.down('treepanel').getSelectionModel().deselectAll();
        //
        //     console.log('win', win)
        //     console.log(' win.down(treepanel)',  win.down('treepanel'))
        //     console.log(' win.down(treepanel).getSelectionModel()',  win.down('treepanel').getSelectionModel())
        //     console.log(' win.down(treepanel).getSelectionModel().deselectAll()',  win.down('treepanel').getSelectionModel().deselectAll())
        //     // console.log('win.down(treepanel).getSelectionModel().deselectAll()', win.down('treepanel').getSelectionModel().deselectAll())
        //
        // },
        // eliminarArea: function(){
        //     var me = this;
        //
        //     mostrarMensaje(2, this.etiquetas.msgElimAreaImplicada, function (response) {
        //         if (response === 'ok') {
        //
        //             var gpArea =  me.getGpAreasImplicadas();
        //             gpArea.getStore().remove(gpArea.getSelectionModel().getSelection()[0]);
        //
        //             mostrarMensaje(1, me.etiquetas.msgSuccessDeleteAreaImplicada);
        //         }
        //     });
        // },
        // insertarArea: function(){
        //     var me = this,
        //         win = this.getWinInsertArea(),
        //         selected = win.tree.getSelectionModel().getSelection()[0],
        //         stArea = me.getGpAreasImplicadas().getStore(),
        //         desdecontrato=(me.getWinEditSolicitud()==null),
        //         idarearesponsable = (!desdecontrato)? me.getWinEditSolicitud().hfarea.getValue():null;
        //
        //         console.log('desdecontrato', desdecontrato)
        //         console.log('idarearesponsable', idarearesponsable)
        //
        //     if(stArea.find('idestructura', selected.get('id')) == -1){
        //         if(selected.get('id') != idarearesponsable){
        //
        //             stArea.add({
        //                 'idarea': 'new_'+Ext.id(),
        //                 'area': selected.get('text'),
        //                 'idestructura': selected.get('id')
        //             });
        //
        //             win.hide();
        //             // if(!desdecontrato)
        //             // mostrarMensaje(1, me.etiquetas.msgSuccessInsertAreaImplicada);
        //         }else{
        //             (!desdecontrato)
        //             mostrarMensaje(6, me.etiquetas.msgErrorAreaImplicadaEqualResponsable);
        //         }
        //     }else{
        //         (!desdecontrato)
        //         mostrarMensaje(6, me.etiquetas.msgErrorExistAreaImplicada);
        //     }
        // },
        // closeWinInsertArea: function(){
        //     this.getWinInsertArea().hide();
        // },
        // onSelectionChangeTreeEstructura: function(sm, select){
        //     this.getWinInsertArea().down('button[action=aceptar]').setDisabled( select.length == 0 );
    }
});