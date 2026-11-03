/**
 * Created by lily on 3/02/15.
 */

Ext.define('Conf.model.ModelStoreGrid', {
    extend : 'Ext.data.Model',
    fields  : [
        {name : 'idfuncionalidad'},
        {name : 'idaccion'},
        {name : 'denominacion'},
        {name : 'descripcion'},
        {name : 'checked'}
    ]

});