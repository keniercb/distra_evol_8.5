/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ax.onReady(function () {
    UCID.portal.cargarAcciones(window.frameElement.id, function () {
        this.controldisponibilidad = new LOG.trans.controldisponibilidad.View({
            acciones: acciones_reportes,
            busquedaBasica: true,
            busquedaAvanzada: true,
            idioma: LOG.util.UIManager.apply(LOG.trans.controldisponibilidad.Idioma, LOG.util.Idioma)
        });
        this.controldisponibilidad.show();
    });

}, true);

