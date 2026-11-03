var arrElementosGridPlugin = new Array();
var arrGridDepreciacion = new Array();
var arrConfDatosNaturalezas = new Array();
var arrElementosGridCodigoNew = new Array();
var arrCampos = new Array();
var arrNomencladoresPlugins = new Array();
var camposColumnTable = new Array();
var activCamposTransp = new Array();
var activCamposBuque = new Array();




if (typeof Ext.aft.plugins != 'undefined'){

   // if (typeof Ext.aft.plugins.Transportacion != 'undefined') {
        window.setTimeout(function() {
            Ext.Ajax.request({
                url: '/logistica/activos_fijos/configuracion/index.php/confparametrosgenerales/cargarconfiguracion',
                params:{
                    tipo: 0
                },
                method: 'POST',
                callback: function (options, success, response) {
                    var resp = Ext.decode(response.responseText);

                    if (typeof Ext.aft.plugins.Transportacion != 'undefined') {
                        activCamposTransp.push((resp[0].transporte));
                        if (resp[0].transporte != 0) {
                            arrElementosGridPlugin.push(Ext.aft.plugins.Transportacion.ElementosGridTransportacionPlugin);
                            // arrGridDepreciacion.push(Ext.aft.plugins.Transportacion.GridDepreciacion);
                            arrConfDatosNaturalezas.push(Ext.aft.plugins.Transportacion.ConfDatosNaturalezas);
                            arrElementosGridCodigoNew.push(Ext.aft.plugins.Transportacion.ElementosGridTransportacionCodigoNew);
                            arrCampos.push(Ext.aft.plugins.Transportacion.Campos);
                            Ext.apply(camposColumnTable, Ext.aft.plugins.Transportacion.CamposColumnTable);
                            //camposColumnTable.push(Ext.aft.plugins.Transportacion.CamposColumnTable);//ver a Osmel
                            arrNomencladoresPlugins.push(Ext.aft.plugins.Transportacion.Nomencladores);
                       }
                    }
                    if (typeof Ext.aft.plugins.buque != 'undefined') {
                        activCamposBuque.push((resp[0].buque));
                       if (resp[0].buque != 0) {
                           arrElementosGridPlugin.push(Ext.aft.plugins.buque.ElementosGridBuquePlugin);
                           arrConfDatosNaturalezas.push(Ext.aft.plugins.buque.ConfDatosNaturalezas);
                           arrElementosGridCodigoNew.push(Ext.aft.plugins.buque.ElementosGridBuqueCodigoNew);
                           arrCampos.push(Ext.aft.plugins.buque.Campos);
                           //Ext.apply(camposColumnTable, Ext.aft.plugins.Transportacion.CamposColumnTable);
                           //camposColumnTable.push(Ext.aft.plugins.Transportacion.CamposColumnTable);//ver a Osmel
                           // arrNomencladoresPlugins.push(Ext.aft.plugins.Transportacion.Nomencladores);
                       }
                    }
                }
            });
        }, 900);
   // }
}