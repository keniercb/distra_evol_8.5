/**
 * Created by lilianne on 27/01/15.
 */

Ext.define('Conf.view.gestsist.contextMenu', {
    extend: "Ext.menu.Menu",
    alias: 'widget.contextMenu',

    initComponent: function () {
        this.id = 'contextMenu';
        this.items = [];
        var subsistema = Ext.create('Ext.menu.Item', {
            id: 'addsubistema',
            iconCls: 'adicionar',
            text: perfil.etiquetas.adicionarSub,//'Adicionar subistema',
            action:'insertarSubsistema'
        });
        var funcionalidad = Ext.create('Ext.menu.Item', {
            id: 'addfuncionalidad',
            iconCls: 'adicionar',
            text: perfil.etiquetas.adicionarFunc,//'Adicionar funcionalidad',
            action:'insertarFuncionalidad'
        });
        var recurso = Ext.create('Ext.menu.Item', {
            id: 'addrecurso',
            iconCls: 'adicionar',
            text: perfil.etiquetas.adicionarRec,//'Adicionar recurso',
            action:'insertarRecurso'
        });
        var eliminarSub = Ext.create('Ext.menu.Item', {
            id: 'elimsubsistema',
            iconCls: 'eliminar',
            text: perfil.etiquetas.eliminarSub,//'Eliminar subsistema',
            action:'eliminarcomponente'
        });
        var eliminarFuc = Ext.create('Ext.menu.Item', {
            id: 'elimfuncionalidad',
            iconCls: 'eliminar',
            text: perfil.etiquetas.eliminarFunc,//'Eliminar funcionalidad',
            action:'eliminarcomponente'
        });
        var eliminarRec = Ext.create('Ext.menu.Item', {
            id: 'elimrecurso',
            iconCls: 'eliminar',
            text: perfil.etiquetas.eliminarRec,//'Eliminar recuso',
            action:'eliminarcomponente'
        });

        if(!this.record.isRoot()) {
            if (this.record.raw.type == 'sistema') {
                this.items.push(subsistema);
                this.items.push(funcionalidad);
                this.items.push(eliminarSub);
            }
            else if (this.record.raw.type == 'funcionalidad') {
                this.items.push(recurso);
                this.items.push(eliminarFuc);
            }
            else {
                this.items.push(eliminarRec);
            }
        }
        else{
            this.items.push(subsistema);
        }


        this.callParent(arguments);
    }
});
