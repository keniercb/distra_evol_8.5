
/*var idioma = LOG.util.UIManager.apply(LOG.lb.gestplanconteo.Idioma, LOG.util.Idioma);
 var vistaPlanConteo = new LOG.lb.planconteoinventario.View({
 idioma: idioma
 });
 vistaPlanConteo.init();
 vistaPlanConteo.view();*/
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.lb.gestplanconteo.Idioma, LOG.util.Idioma);
    idioma.porcietoNoPermitido = "El per\xedodo no est\xe1 en estado de Elaboraci\xf3n.";
    idioma.msgAdicionandoPlan = "Guardando datos del plan de conteo";
    /*var vistaPlanConteo= new LOG.lb.cierre.component.View({
     idioma: idioma
     });
     vistaPlanConteo.init();
     vistaPlanConteo.view();*/
    var vistaPlanConteo = new LOG.lb.planconteoaft.View({
        idioma: idioma
    });
    LOG.util.Idioma.lbDepositos = '&Aacute;rea de responsabilidad';
    //vistaPlanConteo.attachPlugin(new LOG.lb.plugin.ComboDepositos({tipo: 0}));
    vistaPlanConteo.init();
    
    vistaPlanConteo.view();
});
