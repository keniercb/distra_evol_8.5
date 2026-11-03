/*
 * Validar persona.
 *
 * @author Ing. Eddy Santana Navarro
 * @package Pvd.Riesgo
 * @uses Pvd.Persona.Validarpersona
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Persona.Validarpersona');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Persona.Validarpersona.Controlador = {
    init: function (idioma, vista, modelo) {

        var objselect;

        modelo.stPersonas.load({params: {start: 0, limit: 15}});

        vista.gpPersonas.getSelectionModel().on('rowselect', function () {
            objselect = vista.gpPersonas.getSelectionModel().getSelected().data;            
            vista.btnValidar.enable();
        });

        vista.gpPersonas.getSelectionModel().on('rowdeselect', function () {
            vista.btnValidar.disable();
        });

        modelo.stPersonas.on('load', function () {
            vista.gpPersonas.getSelectionModel().clearSelections();
        });
        
        vista.btnValidar.setHandler(function ()
        {
            vista.buscador.show();
        });
        
        vista.buscador.on('rowselect', function (r) {
            var idpersona = objselect.idpersona;
            var values = [];
            Ext.each(r, function (v) {
                values.push({
                    nombre: v.data.nombre,
                    snombre: v.data.snombre,
                    papel: v.data.papel,
                    sapel: v.data.sapel,
                    idsuin: v.data.idsuin,
                    sexo: v.data.sexo,
                    numid: v.data.numid
                });
            }, this);
            PVD.mostrarMascara('validarpers', 'Por favor espere...');
            Ext.Ajax.request({
                url: 'validaPersona',
                method: 'POST',
                params: {
                    arrValidar: Ext.encode(values),
                    idpersona: idpersona,
                    idfuente: vista.buscador.store.baseParams.fuente
                },
                callback: function (options, success, response) {
                    if (success) {
                        PVD.ocultarMascara('validarpers');
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codigo == 2) {
                            mostrarMensaje(3, "Existe otra persona en el sistema con el mismo identificador del SUIN de los datos con los que se quiere actualizar.");
                        } else {
                            mostrarMensaje(1, 'La persona ha sido validada correctamente');
                            modelo.stPersonas.reload();
                            vista.buscador.hide();
                        }
                    }

                }
            });
        }, this);
        
        vista.btnBuscar.setHandler(function ()
        {
            modelo.stPersonas.load({params: {
                start: 0, 
                limit: 15,
                numid: vista.nfNumid.getValue(),
                nombre: vista.tfNombre.getValue(),
                papel: vista.tfPapel.getValue(),
                sapel: vista.tfSapel.getValue()
            }});
        });
        
        vista.btnLimpiar.setHandler(function ()
        {
            vista.nfNumid.reset();
            vista.tfNombre.reset();
            vista.tfPapel.reset();
            vista.tfSapel.reset();
            modelo.stPersonas.load({params: {start: 0, limit: 15}});
        });

        
        
        function ejemplo(btnpress)
        {
            
        }

        

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'lb',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {                    
                    case 76:{ //l para limpiar
                        if (!vista.btnLimpiar.disabled) {
                            vista.btnLimpiar.handler();
                        }
                        break;
                    }
                    case 66:{ //b para buscar
                        if (!vista.btnBuscar.disabled) {
                            vista.btnBuscar.handler();
                        }
                        break;
                    }
                }
            }
        },{
            key: 'p',
            alt: true,
            ctrl: true,
            //stopEvent: true,
            fn: function () {
//                if(vista.btnAplicarMed.isVisible()){
//                    guardarDatosMed('APL');
//                } else if(vista.btnAplicarRec.isVisible()){
//                    guardarDatosRec('APL');
//                } else if(vista.btnAplicar.isVisible()){
//                    guardarDatos('APL');
//                }
            }
        }]);
    }
};
