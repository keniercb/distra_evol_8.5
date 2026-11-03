/**
 * Created by lily on 16/02/15.
 */
//Ext.require([
//    'Conf.model.Subsistema'
//]);
Ext.define('Conf.store.StoreTree', {
    extend  : 'Ext.data.TreeStore',
    model: 'Conf.model.Subsistema',
    root: {
        text: Ext.widget('idioma_es').idioma.textstore,//'Sistemas',
        id: '0',
        expanded: true
    }

});