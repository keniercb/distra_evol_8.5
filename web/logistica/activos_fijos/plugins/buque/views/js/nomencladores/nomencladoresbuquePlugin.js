/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.ns('Ext.aft.plugins.Transportacion');
Ext.aft.plugins.Transportacion.Nomencladores = {
    init: function(viewport, accion){
        if(accion == "NOMTCOMBUST"){
            viewport.addNodoTree("Tipo combustible", 'tipocombustible', '/logistica/activos_fijos/configuracion/index.php/nomencladoresgeneralesaft/', 'NomTipocombustible', "Tipo combustible");
        }
        return viewport;
    }
};


