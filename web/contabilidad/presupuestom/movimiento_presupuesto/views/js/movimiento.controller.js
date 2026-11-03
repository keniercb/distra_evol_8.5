
Ext.ns('Movimiento.Presupuesto');

Movimiento.Presupuesto.Controller = {
    /**
     *Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param view Vista del componente Banco.Ctabvar idancaria
     * @param model Modelo de la vista del componente Banco.Ctabancaria
     *
     */
    init: function(idioma, view, model) {
        var id=0;
        var scope = this;
        view.rowactionDel.on('action', function (grid, record, action, rowIndex, col, e) {
            var selecteds = view.smoperacion.getSelected();
            id = selecteds.json.iddesagregacion;
            switch (action) {
                case 'eliminar':
                    mostrarMensaje(2, "Seguro que desea eliminar", function (btnPress) {
                        if (btnPress === 'ok') {
                            scope.deleteMovimiento(id);
                        }
                    });
                    view.rowEditor.stopEditing(true);
                    break;
            }
        });
        this.deleteMovimiento = function (id) {
            Ext.Msg.wait('Eliminando datos.', 'Por favor espere...');
            Ext.Ajax.request({
                url: 'eliminarmovimiento',
                method: 'POST',
                params: {
                    iddesagregacion: id
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM == 1) {
                        var msg="Los datos han sido eliminados..."
                        mostrarMensaje(1, msg);
                        model.store_desagregacion.reload();
                        Ext.Msg.hide();
                    }
                }
            });
        };

        view.rowEditor.on({

            afteredit: function(editor, grid, changes, record, rowIndex){
                Ext.Msg.wait('Guardando datos...');
                scope.saveNewMovimiento();
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {


            }
        });
        this.saveNewMovimiento = function () {
            scope.selecteds = view.smoperacion.getSelected();
            if(scope.selecteds==undefined)
            {
                var arrayMovimiento = view.GridPrincipal.getStore().getModifiedRecords();
                var newMovimiento = new Array();
                for (i = 0; i < arrayMovimiento.length; i++) {
                    newMovimiento.push({
                        iddesagregacion: 0,
                        operacion: arrayMovimiento[i].data.operacion,
                        unidadm: arrayMovimiento[i].data.unidadm,
                        partida: arrayMovimiento[i].data.partida,
                        importe: arrayMovimiento[i].data.importe,
                        grupo: arrayMovimiento[i].data.grupo,
                        especialidad: arrayMovimiento[i].data.especialidad,
                        // idcajafondo: this.scope.panelFondo.smFondo.getSelected().data.idcajafondo
                    });
                }

                Ext.Ajax.request({
                    method: "POST",
                    url: "guardardatos",
                    params: {
                        iddesagregacion: 0,
                        operacion: newMovimiento[newMovimiento.length-1].operacion,
                        unidadm: newMovimiento[newMovimiento.length-1].unidadm,
                        partida: newMovimiento[newMovimiento.length-1].partida,
                        importe: newMovimiento[newMovimiento.length-1].importe,
                        grupo: newMovimiento[newMovimiento.length-1].grupo,
                        especialidad: newMovimiento[newMovimiento.length-1].especialidad

                    },
                    scope: this,
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);

                        //view.GridPrincipal.getStore().commitChanges();
                        Ext.Msg.hide();
                        mostrarMensaje(respuesta.codMsg, "Los Datos han sido guardados satifactoriamente");
                        //view.GridPrincipal.getStore().reload();
                        scope.selecteds=undefined;
                        model.store_desagregacion.reload();
                    }
                });
            }
            else{this.guardardesagregacion()}
        };

        this.guardardesagregacion=function(){
            Ext.Msg.wait('Guardando datos.', 'Por favor espere...');
            var selecteds = view.smoperacion.getSelected();
            Ext.Ajax.request({
                url: 'guardardatos',
                method: 'POST',
                params: {

                    iddesagregacion: selecteds.data.iddesagregacion,
                    operacion: selecteds.data.operacion,
                    unidadm: selecteds.data.unidadm,
                    partida: selecteds.data.partida,
                    importe: selecteds.data.importe,
                    grupo: selecteds.data.grupo,
                    especialidad: selecteds.data.especialidad

                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM == 1) {
                        var msg="Los datos han sido modificados..."
                        mostrarMensaje(1, msg);
                        scope.selecteds=undefined;
                        model.store_desagregacion.reload();
                        Ext.Msg.hide();
                    }
                }
            });
        }
        this.recordMovimiento = Ext.data.Record.create([
            {name: 'iddesagregacion', type: 'int'},
            {name: 'operacion', type: 'sting'},
            {name: 'um', type: 'sting'},
            {name: 'grupo', type: 'sting'},
            {name: 'especialidad', type: 'sting'},
            {name: 'partida', type: 'int'},
            {name: 'importe', type: 'int'}
        ]);
        view.btnAdicionar.on({
            click: function(){
                view.tfUM.editor=new Ext.form.TextField({
                    allowBlank: false,
                    disabled: true,
                    store: model.store_desagregacion
                });
                var recTal = new scope.recordMovimiento({
                    iddesagregacion:0,
                    operacion:'',
                    um:'',
                    grupo:'',
                    especialidad:'',
                    partida: null,
                    importe: null
                });
                view.rowEditor.stopEditing();
                model.store_desagregacion.insert(0, recTal);
                view.GridPrincipal.getView().refresh();
                view.rowEditor.startEditing(0, 0);
                view.cbOperacion.focus(true, 100);


            }
        })
    }
};        