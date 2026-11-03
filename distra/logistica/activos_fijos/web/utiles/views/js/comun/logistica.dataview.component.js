/**
 *  @autor: Jorge Luis Cuellar Mondeja
 *  @date: 12/09/2012
 *  
 *  @descripción: Extención del componente DataView para la representacion de varias imagenes
 *  y el cual incluye la opción de aumentar la imagen en el visor (visorImagenes.js)
 *  que se encuentra en este mismo directorio
 *  
 *  @version: 1.0
 **/

Ext.ns('logistica');

/**
 *  Arreglo auxiliar para el visor de imagenes
 **/
logistica.arrVisor = Array();

/**
 *  Funcion para levantar el visor de imagenes
 **/
logistica.getVisorImagenes = function(imagen){
    visorImagenes(logistica.arrVisor, imagen.id, '../../../../');
}

logistica.DataView = Ext.extend(Ext.DataView, {
    constructor: function(config){
        var _this = this;
                        
        this.store = new Ext.data.JsonStore({
            url : 'getimagenes',
            root : 'datos',
            fields : ['url'],
            listeners:{
                'add': function( store, records, index ){
                    logistica.arrVisor.push(records[0].get('url'));
                }
            }
        });
      
        this.getImagenes(config.urlController, config.param);
        
        this.multiSelect = true;
        this.overClass = 'x-view-over';
        this.itemSelector = 'div.thumb-wrap';
        this.emptyText = '';
        this.tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="{name}">',
            '<div class="thumb" width=100 height=100><img onDblClick="logistica.getVisorImagenes(this)" src="{url}" id="{url}"  /></div>', // title="{name}"
            '<span class="x-editable">{shortName}</span></div>',
            '</tpl>',
            '<div class="x-clear"></div>');
                            
        this.plugins = [new Ext.DataView.DragSelector(), new Ext.DataView.LabelEditor({
            dataIndex : 'name'
        })];

        
        logistica.DataView.superclass.constructor.apply(this, arguments);
    },
    getImagenes: function(urlController, param){
        var _this = this;
        
        Ext.Ajax.request({
            url : urlController + 'getimagenes',
            method : 'POST',
            params: param,
            callback : function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                
                for (var i = 0; i < rd.imagenes.length; i++) {
                    _this.store.insert(0, new _this.store.recordType({
                        url : urlController + 'getimagen?idimagen=' + rd.imagenes[i]
                    }, i));
                }
                
            }
        })
    }
})


logistica.getImagenes = {
    /**
     *  @config = {
     *      @urlController: dirección de la controladora que tiene el método que me dará el arreglo de los ids imagenes
     *      @param: {} -> parametros que necesite el método que me dará el arreglo de imagenes
     *  }
     *  
     *  @fn: funcion que se ejecutará después de cargada las imagenes
     **/
    init: function(config, fn){
        
        var _this = this;
        
        var pdv = new Ext.Panel({
            id : 'images-view',
            region : 'center',
            frame : true,
            autoScroll : true,
            layout : 'fit',
            items: [new logistica.DataView(config)]
        });
                        
        eval("fn(pdv)");

    }
}

// Ejemplo de como usar el componente
//
////var ve = new Ext.Window({
////    layout: 'border'
////});
//
//logistica.getImagenes.init({
//    urlController: '/logistica/activos_fijos/nomencladores/index.php/nomactivofijotangible/',
//    param: {
//        idactfijotang: 9000000068
//    }
//},function(objetoDataView){
////    ve.add(objeto);
////    ve.show();
////    ve.doLayout();
////    ve.maximize();
//})