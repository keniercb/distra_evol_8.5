Ext.define('BaseModule.controller.ElementWindow', {
    extend: 'Ext.app.Controller',

    activeWindows: 0,       //contador de ventanas abiertas

    init: function () {

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'elementwindow': {
                    'show': this.onShow
                },
                'elementwindow button[action]': {
                    'click': this.onClickAction
                },
                'htmleditor button[action=addvar]': {
                    click: this.onClickAction
                },
                'tinyhtmleditor, tinymceeditor':{
                    clickBtnAddElement: this.showWindowSelectElem
                },
                'elementwindow button[action=acept]':{
                    click: this.insertElementEditor
                },
                'elementtree': {
                    beforeload: this.onBeforeLoadTree,
                    load: this.onLoadTree,
                    selectionchange: this.onSelectTreeNode
                }
            }
        });

    },
    onBeforeLoadTree: function (store, operation) {
        var me = this;
        console.log('onBeforeLoadTree:', store.isLoading())
        // if(store.isLoading()){
        //     Ext.Ajax.abort(store.proxy.activeRequest);
        //     delete store.proxy.activeRequest;
        // }
        if (operation.node.data.depth == 0) {
            this.loadmask = new Ext.LoadMask(store.treepanel.el, {msg: me.etiquetas.msgLoading});
            this.loadmask.show();
        }
        store.proxy.extraParams = {
            idTipoContrato: store.window.tipocontrato,
            idelemento: operation.node.data.idelemento
        }
    },
    onLoadTree: function (store, operation, nodes) {
        if(this.loadmask)
            this.loadmask.hide();
        console.log('load treeee:')
        Ext.Array.each(nodes, function (node, index, countriesItSelf) {
            console.log('elemento:', node.data.depth, '->', node.data.leaf)
            if (node.data.depth == 1 && !node.data.leaf) {
                store.load({node: node});
            }
        });
    },
    onShow: function (window) {
        var store = window.tree.store;
        store.treepanel = window.tree;
        store.window = window;
        store.load();
    },
    onClickAction: function (btn) {
        switch (btn.action) {
            case 'acept':
                this.onSave(btn);
                break;
            case 'addvar':
                this.showWindow(btn);
                break;
        }
    },
    onSave: function (btn) {
        // var me = this,
        //     window = btn.up('window'),
        //     tree = window.down('elementtree'),
        //     selection = tree.getSelectionModel().getSelection(),
        //     editor = window.btnAddVar.editor;
        //
        // Ext.each(selection, function (record) {
        //     editor.addVar(record.data.idelemento,record.data.denominacion,false);
        // });
        // window.close();
    },
    onSelectTreeNode: function (sm, records) {
        var count = records.length,
            me = this,
            window = sm.view.up('window'),
            tree = window.down('elementtree'),
            widget = this.noWidget(records);

        if ((count == 1 || (tree.multiSelect && count > 1)) && !widget) {
            window.btnAceptar.enable();
        } else {
            if (widget) {
                mostrarMensaje(8, me.etiquetas.msgNoValidElement.replace(/<#>/g, widget));
            }
            window.btnAceptar.disable();
        }
    },
    noWidget: function (records) {
        var nowidget = false;
        Ext.each(records, function (record) {
            if (record.data.tipo != 'widget') {
                nowidget = record.data.denominacion;
                return false;
            }
        });

        return nowidget;
    },
    showWindow: function (cmp) {
        var editor = cmp.up('htmleditor'),
            tipocontrato = editor.tipocontrato;

        if (true) {
            var win = Ext.create('BaseModule.view.ElementWindow', {
                title: 'Seleccionar elemento',
                tipocontrato: tipocontrato,
                btnAddVar: cmp
            });
            win.show();
        } else {
            mostrarMensaje(6,this.etiquetas.msgSelectTipo);
        }
    },
    showWindowSelectElem: function(cmp){
        console.log('showWindowSelectElem', cmp)
        var me=this, tipocontrato = cmp.tipocontrato;
        console.log(tipocontrato)
        if (true) {
            // var win = Ext.create('BaseModule.view.ElementWindow', {
            //     title: 'Seleccionar elemento',
            //     tipocontrato: tipocontrato,
            //     editor: cmp
            // });
            var win=Ext.create('Ext.window.Window', {
                title: 'Seleccionar variable',
                layout: 'fit',
                width: window.innerWidth*0.7,
                height: window.innerHeight*0.8,
                tipocontrato: tipocontrato,
                editor: cmp,
                items: Ext.create('ConfContratacion.view.GridVariables',{sinBotones:true}),
                buttons: [
                    {
                        text: 'Cancelar',
                        iconCls: 'icondistra-cancelar',
                        tooltip: 'Cancelar',
                        handler: function () {
                            win.close();
                        }
                    },
                    {
                        text: 'Seleccionar',
                        iconCls: 'icondistra-aceptar',
                        tooltip: 'Seleccionar variable',
                        action: 'seleccionarvariable',
                        handler: function () {
                            console.log(this)
                            me.insertElementEditor(this);
                        }
                    }
                ]
            })
            win.show();
        } else {
            mostrarMensaje(6,this.etiquetas.msgSelectTipo);
        }
    },
    insertElementEditor: function(btn){
        var me = this,
            win = btn.up('window'),
            grid = win.down('grid'),
            selection = grid.getSelectionModel().getSelection();
console.log(win.editor)
        Ext.each(selection, function (record) {
            win.editor.addElement(record.data.idvariable, record.data.nombre, false);
        });

        win.close();
    }
});
