/*
 * Gestionar riesgo.
 *
 * @author Ing. Beatriz Selema Alvarez
 * @package Pvd.Riesgo
 * @uses Pvd.Riesgo.Gestionarriesgo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Medios.Gestionarmedio');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Medios.Gestionarmedio.Controlador = {
    init: function (idioma, vista, modelo) {

       var accion, node, rgselect, jefeinmed, tutorselect, objselect;

        vista.ventanaGestion.on('beforeshow', function () {
            modelo.stNomMedios.load();
         //   modelo.stMedios.load();

        });

        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stMedios.baseParams.idcargo = '';
            modelo.stMedios.baseParams = {idestructura: node.attributes.id};
            modelo.stMedios.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            vista.btnAdicionar.enable();
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            if (node.attributes.idconcepto == 7) {
                modelo.stMedios.baseParams.idcargo = node.attributes.id;
               // vista.btnAdicionar.disable();
            } else {
                modelo.stMedios.baseParams.idestructura =  node.attributes.id;
                vista.btnAdicionar.enable();
            }
            modelo.stMedios.removeAll();
            modelo.stMedios.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.gpMedios.getSelectionModel().on('rowselect', function () {
            objselect = vista.gpMedios.getSelectionModel().getSelected().data;
            if (vista.gpMedios.getSelectionModel().getSelections().length == 1) {
                vista.btnModificar.enable();
                var rg = vista.gpMedios.getSelectionModel().getSelected().data;
            } else {
                vista.btnModificar.disable();
            }
            vista.btnEliminar.enable();
        });

        vista.gpMedios.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpMedios.getSelectionModel().getSelections().length == 0) {
                vista.btnEliminar.disable();
                vista.btnModificar.disable();
            }
            if (vista.gpMedios.getSelectionModel().getSelections().length == 1) {
                vista.btnModificar.enable();
            }
        });

        modelo.stMedios.on('load', function () {
            vista.gpMedios.getSelectionModel().clearSelections();
            vista.sfBuscar.enable();
            vista.btnEliminar.disable();
            vista.btnModificar.disable();
        });

        vista.btnEliminar.on('click', function () {
            eliminar();
        });

        vista.btnAdicionar.on('click', function () {
            accion = 'add';
            vista.ventanaGestion.show();
            vista.btnAplicar.show();
            vista.ventanaGestion.setTitle(idioma.msgAdd);
            vista.formularioGestion.getForm().reset();
        });

        vista.btnModificar.on('click', function () {
            accion = 'mod';
            var obj = vista.gpMedios.getSelectionModel().getSelected().data;
            vista.btnAplicar.hide();
            vista.ventanaGestion.setTitle(idioma.msgMod);
            vista.formularioGestion.getForm().loadRecord(vista.gpMedios.getSelectionModel().getSelected());
            vista.ventanaGestion.show();
            vista.cbNomMedios.setValue(obj.idmedio);
            vista.cbNomMedios.setRawValue(obj.denominacion);
            vista.nfCant.setValue(obj.cantidad);

        });
        
        vista.btnAceptar.on('click', function () {
            guardarDatos('ACP');
        });

        vista.btnAplicar.on('click', function () {
            guardarDatos('APL');
        });

        vista.btnCancelar.on('click', function () {
            vista.ventanaGestion.hide();
        });

        function guardarDatos(btnpress)
        {
            if(vista.formularioGestion.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addMedio' : 'updateMedio'),
                    params: {
                        iddmedio: accion == 'add' ? -1 : vista.gpMedios.getSelectionModel().getSelected().data.iddmedio,
                        idmedio: vista.cbNomMedios.getValue(),
                        idestructura: node.id,
                        cantidad: vista.nfCant.getValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, idioma.msgModSucces);
                            }else{
                                mostrarMensaje(1, idioma.msgAddSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                vista.ventanaGestion.hide();
                            }
                            vista.formularioGestion.getForm().reset();
                            modelo.stMedios.removeAll();
                            modelo.stMedios.reload();
                        } else {
                            mostrarMensaje(6,idioma.msgExistem);
                        }
                    }
                });
            }
        }

        function eliminar()
        {
            var ids = new Array();
            var s = vista.gpMedios.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.iddmedio);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el medio seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los medios seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteMedio',
                        params: {idsmedios: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El medio seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los medios seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El medio ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los medios han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stMedios.removeAll();
                            modelo.stMedios.reload();
                        }
                    });
                }
            });
        }

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imlhbx',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        if(!vista.btnAdicionar.disabled){
                            accion = 'add';
                            vista.ventanaGestion.show();
                            vista.btnAplicar.show();
                            vista.ventanaGestion.setTitle(idioma.msgAdd);
                            vista.formularioGestion.getForm().reset();
                        }
                        break;
                    }
                    case 77:{ //m para modificar
                        if(!vista.btnModificar.disabled){
                            accion = 'mod';
                            var obj = vista.gpMedios.getSelectionModel().getSelected().data;
                            vista.btnAplicar.hide();
                            vista.ventanaGestion.setTitle(idioma.msgMod);
                            vista.formularioGestion.getForm().loadRecord(vista.gpMedios.getSelectionModel().getSelected());
                            vista.ventanaGestion.show();
                            vista.cbNomMedios.setValue(obj.idmedio);
                            vista.cbNomMedios.setRawValue(obj.denominacion);
                            vista.nfCant.setValue(obj.cantidad);

                        }
                        break;
                    }
                    case 76:{ //l para limpiar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger1Click();
                        }
                        break;
                    }
                    case 66:{ //b para buscar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger2Click();
                        }
                        break;
                    }
                    case 88:
                    { //x para cancelar
                        if (!vista.btnCancelar.disabled) {
                            vista.ventanaGestion.hide();
                        }
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.btnEliminar.disabled){
                    eliminar();
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.btnAceptar.isVisible()){
                    vista.btnAceptar.focus();
                    guardarDatos('ACP');
                }
            }
        },{
            key: 'p',
            alt: true,
            ctrl: true,
            //stopEvent: true,
            fn: function () {
                if (!vista.btnAplicar.disabled) {
                    guardarDatos('APL');
                }
            }
        }]);
    }
};
