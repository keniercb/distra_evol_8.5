
/*
 * Compartimentacion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Compartimentacion
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Maestro.Compartimentacion');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Maestro.Compartimentacion.Controlador = {

    init: function(idioma, vista, modelo) {
         var busc = 0;
         modelo.stUsuarios.load({params: {start:0, limit: 15}});

        vista.gpUsuarios.getSelectionModel().on('rowselect', function () {
            modelo.stCompartimentaciones.load();
            vista.gpCompartimentaciones.enable();
        });

        vista.gpUsuarios.getSelectionModel().on('rowdeselect', function () {
            vista.gpCompartimentaciones.getSelectionModel().clearSelections();
        });

        vista.gpCompartimentaciones.getSelectionModel().on('rowselect', function () {
            vista.btnGuardar.enable();
        });
        
        vista.gpCompartimentaciones.getSelectionModel().on('rowdeselect', function () {
            vista.btnGuardar.enable();
        });

        modelo.stUsuarios.on('load', function () {
            vista.gpCompartimentaciones.disable();
            vista.btnGuardar.disable();
            var cant = modelo.stUsuarios.getCount();
            if (cant > 0) {
                vista.gpUsuarios.getSelectionModel().selectFirstRow();
            }
            if (busc == 1 && cant==0) {
                mostrarMensaje(1, 'No existen datos que coincidan con el criterio de b&uacute;squeda especificado.');
            } else if (cant==0) {
                mostrarMensaje(1, 'No existen datos que mostrar.');
            }
            busc = 0;
        });

        modelo.stUsuarios.on('beforeload', function () {
            vista.gpUsuarios.getSelectionModel().clearSelections();
        });

        modelo.stCompartimentaciones.on('load', function () {
            Ext.Ajax.request({
                url: 'getCompartByUsuario',
                params: {idusuario: vista.gpUsuarios.getSelectionModel().getSelected().data.idusuario},
                callback: function (){
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    var objrec = [];
                    for (i=0; i<responseData.length; i++) {
                        var obj = modelo.stCompartimentaciones.getById(responseData[i].idcompartimentacion);
                        objrec.push(obj);
                    }
                    vista.smCom.selectRecords(objrec);
                }
            });
        });

        vista.btnGuardar.on('click', function () {
            guardarConfig();
        });

        vista.btnBuscar.on('click', function () {
            if (vista.tfbuscar.getValue() == '') {
                mostrarMensaje('Debe especificar un criterio de b&uacute;squeda.');
            } else {
                busc = 1;
                modelo.stUsuarios.load({params: {start:0, limit: 15, filtro: vista.tfbuscar.getValue()}});

            }
        });

        vista.btnLimpiar.on('click', function () {
            vista.tfbuscar.reset();
            modelo.stUsuarios.load({params: {start:0, limit: 15}});
        });

        function guardarConfig()
        {
            var ids = new Array();
            var s = vista.gpCompartimentaciones.getSelectionModel().getSelections();
            if (s.length > 0) {
                for(i = 0; i < s.length; i++) {
                    ids.push(s[i].data.idcompartimentacion);
                }
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: 'guardarConfiguracion',
                    params: {
                        idusuario: vista.gpUsuarios.getSelectionModel().getSelected().data.idusuario,
                        compartimentaciones: Ext.encode(ids)
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente.');
                        } else
                            mostrarMensaje(3,'Ocurrió un error mientras se guardaban los datos.');
                        vista.btnGuardar.disable();
                    }
                });
            }  else {
                mostrarMensaje(3,'Debe seleccionar alguna compartimentación.');
            }
        }

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'g',//p para guardar
                alt: true,
                fn: function(){
                    if(vista.btnGuardar.isVisible()){
                        guardarConfig();
                    }
                }
            },{
                key: 'b',
                alt: true,
                fn: function(){
                    if (vista.tfbuscar.getValue() == '') {
                        mostrarMensaje('Debe especificar un criterio de b&uacute;squeda.');
                    } else {
                        busc = 1;
                        modelo.stUsuarios.load({params: {start:0, limit: 15, filtro: vista.tfbuscar.getValue()}});

                    }
                }
            },{
                key: 'l',//p para guardar
                alt: true,
                fn: function(){
                    vista.tfbuscar.reset();
                    modelo.stUsuarios.load({params: {start:0, limit: 15}});
                }
            }
        ]);
    }
}
