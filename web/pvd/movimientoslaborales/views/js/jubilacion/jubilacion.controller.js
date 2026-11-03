/*
 * Jubilacion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Fuerzatrabajo
 * @uses Pvd.Fuerzatrabajo.Jubilacion
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Fuerzatrabajo.Jubilacion');

Pvd.Fuerzatrabajo.Jubilacion.Controlador = {   
    init: function (idioma, vista, modelo) {
        var node, buscar, reload;
        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stPersonasTrab.baseParams.idcargo = '';
            modelo.stPersonasTrab.baseParams = {idestructura: node.attributes.id};
            modelo.stPersonasTrab.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            buscar = false;
        });

        vista.tpEstructura.tree.on('click', function (n) {
            modelo.stPersonasTrab.removeAll();
            vista.sfBuscar.enable();
            node = n;
            if (n.attributes.idconcepto == 7) {
                modelo.stPersonasTrab.baseParams.idestructura = '';
                modelo.stPersonasTrab.baseParams = {idcargo: n.attributes.id};
            } else {
                modelo.stPersonasTrab.baseParams.idcargo = '';
                modelo.stPersonasTrab.baseParams = {idestructura: n.attributes.id};
            }
            modelo.stPersonasTrab.removeAll();
            
            if (reload == 1) {
                modelo.stPersonasTrab.load({
                    params: {
                        start: 0,
                        limit: modelo.stPersonasTrab.lastOptions.params.limit,
                        query: vista.sfBuscar.getValue()
                    }
                });
            } else {
                modelo.stPersonasTrab.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            }
            buscar = false;
        });

        modelo.stPersonasTrab.on('load', function (st, data) {
            vista.btnJubilar.disable();
            if (data.length == 0) {
                if (vista.sfBuscar.getValue() == '' && buscar == false) {
                    mostrarMensaje(1, "No existen datos que mostrar.");
                } else {
                    mostrarMensaje(1, "No existen datos que se correspondan con el criterio de búsqueda especificado.");
                }
            }
            reload = 1;
        });

        vista.gpPersonasTrab.getSelectionModel().on('rowselect', function () {
            vista.btnJubilar.enable();
        });

        vista.btnJubilar.on('click', function () {
            modelo.stTrayectoria.removeAll();
            vista.winJubilar.show();
            modelo.stTrayectoria.baseParams.idpersona = vista.gpPersonasTrab.getSelectionModel().getSelected().data.idpersona;
            modelo.stTrayectoria.load();

            modelo.stSalarios.removeAll();
            modelo.stSalarios.baseParams.idpersona = vista.gpPersonasTrab.getSelectionModel().getSelected().data.idpersona;
            modelo.stSalarios.load();
        });

        vista.btnCancelar.on('click', function () {
            vista.winJubilar.hide();
        });
    }
};