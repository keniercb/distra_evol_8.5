/**
 * Created by me on 19/01/16.
 */
Ext.define('Traces.store.GridStore', {
    require: ['Ext.data.TreeStore'],
    extend: 'Ext.data.TreeStore',
    root: {
        iconCls: 'usuario',
        text: 'Usuarios',
        tipo: 'inicio',
        expanded: true
    },
    model: 'Traces.model.TreeModel',
    proxy: {
        type: 'ajax',
        url: 'cargarhijos',
        reader: {
            type: 'json',
            successProperty: 'success'
        }
    },
    clearOnLoad: false,
    listeners: {
        beforeload: function (store, op) {

            var fecha = op.node.data.tipo === 'sesion' ? op.node.data.fecha:undefined
            var sesion;
            if (op.node.data.tipo == 'trace') {
                var flag = true,
                    id = op.node.parentNode;
                while (flag) {
                    if (id.data.tipo == 'sesion') {
                        sesion = id.data.identidad;
                        flag = false;
                    } else
                        id = id.parentNode;
                }
            } else
                sesion = op.node.data.usuario_sesion;

            op.params.params = Ext.JSON.encode({
                                tipo: op.node.data.tipo,
                                fechainicio: (typeof fecha !== 'undefined') ? fecha:Ext.getCmp('iddesde') ? Ext.getCmp('iddesde').getValue() : new Date(),
                                fechafin: (typeof fecha !== 'undefined') ? fecha:Ext.getCmp('idhasta') ? Ext.getCmp('idhasta').getValue() : new Date(),
                                usuario: Ext.getCmp('combousuario') ? Ext.getCmp('combousuario').value :[],
                                ippc: Ext.getCmp('comboip') ? Ext.getCmp('comboip').getValue() : null,
                                idcategoriatraza: Ext.getCmp('combosubsistema') ? Ext.getCmp('combosubsistema').getValue() : null,
                                idtipotraza: Ext.getCmp('combotipo') ? Ext.getCmp('combotipo').value :[],
                                value: op.node.data.identidad,
                                idseccion: sesion,
                                usuario_sesion: op.node.data.usuario_sesion
                            });
        },
        load: function (store, node, records, success) {
            function hayFiltro() {
                if (Ext.getCmp('iddesde').getValue() != new Date() || Ext.getCmp('idhasta').getValue() != new Date() ||
                    Ext.getCmp('combousuarios').value != [] || Ext.getCmp('combosubsistema').getValue() != null ||
                    Ext.getCmp('comboip').getValue() != null || Ext.getCmp('combotipo').value != [])
                    return true;
            }

            if (success) {
                if (Ext.getCmp('grid').getRootNode().hasChildNodes() == false && hayFiltro())
                    mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.'/*msgNoDataSearch*/);
                else if (Ext.getCmp('grid').getRootNode().hasChildNodes() == false)
                    mostrarMensaje(1, 'No existen datos que mostrar.'/*msgNoData*/);
            }
        }
    }
});
