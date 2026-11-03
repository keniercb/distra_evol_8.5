
/*var idioma = LOG.util.UIManager.apply(LOG.lb.gestplanconteo.Idioma, LOG.util.Idioma);
var vistaPlanConteo = new LOG.lb.planconteoinventario.View({
    idioma: idioma
});
vistaPlanConteo.init();
vistaPlanConteo.view();*/

var idioma = LOG.util.UIManager.apply(LOG.lb.gestplanconteo.Idioma, LOG.util.Idioma);
/*var vistaPlanConteo= new LOG.lb.cierre.component.View({
    idioma: idioma
});
vistaPlanConteo.init();
vistaPlanConteo.view();*/
var vistaPlanConteo= new LOG.lb.planconteoinventario.View({
    idioma: idioma
});
vistaPlanConteo.attachPlugin(new LOG.lb.plugin.ComboDepositos({
    caso : 3
},0));
vistaPlanConteo.init();
vistaPlanConteo.view();
