/*
 * Ranking de trabajadores por cargo.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Competencia
 * @uses Pvd.Competencia.Rankingcargo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Competencia.Rankingcargo');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Competencia.Rankingcargo.Controlador = {
    init: function (idioma, vista, modelo) {
        var personaselect, node;

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            if (node.attributes.idconcepto == 7) {
                modelo.stPersonas.baseParams.idcargo = node.attributes.id;
                modelo.stPersonas.baseParams.idestructura =  null;
            } else {
                mostrarMensaje(8, 'Debe seleccionar un cargo');
            }
            modelo.stPersonas.removeAll();
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });
    }
};
