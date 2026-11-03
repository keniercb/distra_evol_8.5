/*
 * Componente Ventana Evaluar técnica de selección.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Gestionarprocesoseleccion.EvaluarTecnica
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Gestionarprocesoseleccion');
Pvd.Seleccion.Gestionarprocesoseleccion.EvaluarTecnica = Ext.extend(Ext.Window, {
    layout: 'border',
    constrain: true,
    title: 'Evaluar t&eacute;cnica',
    initComponent: function ()
    {
        var self = this;
        var btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: this.idioma.btnFrmCancelar_text,
			tooltip: this.idioma.btnFrmCancelar_tooltips,
            handler: function ()
            {
                self.close();
            }
        });

        var btnAceptar = new Ext.Button({
            iconCls: 'guardar',
            text: this.idioma.btnFinalizar_text,
            tooltip: this.idioma.btnFinalizar_tooltips,
            handler: terminarEvaluacion
        });

        var objEval = new Ext.Evaluaciones.EvalTemplate({
            region: 'center',
            border: false,
            editable: true,
            nocargar: true,
            persona: this.persona,
            urlSave: '/pvd/seleccion/index.php/gestionarprocesoseleccion/saveDataIndicador',
            urlTemplate: '/pvd/seleccion/index.php/gestionarprocesoseleccion/loadPlanilla',
            //urlImportar: '/pvd/seleccion/index.php/gestionarprocesoseleccion/importarDatosExcel',
            baseParams: {
                idrecurso: this.persona.get('idresultadotecnica'),
                idplanilla: this.persona.get('idplanilla')
            }
        });

        this.items = [objEval];
        this.buttons = [btnCancelar, btnAceptar];
        Pvd.Seleccion.Gestionarprocesoseleccion.EvaluarTecnica.superclass.initComponent.call(this);

        function terminarEvaluacion() {
            mostrarMensaje(2, 'Por favor compruebe la evaluaci&oacute;n. ¿Est&aacute; seguro que desea finalizar?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    PVD.mostrarMascara('saveEvalFinal', '', 'Calculando el resultado final de la evaluaci&oacute;n');
                    Ext.Ajax.request({
                        url: 'guardarResultadoTecnica',
                        method: 'POST',
                        params: {
                            idproceso: self.idproceso,
                            idprocesotecnica: self.idprocesotecnica,
                            idmodelo: self.persona.get('idmodelo'),
                            idplanilla: self.persona.get('idplanilla'),
                            idresultadotecnica: self.persona.get('idresultadotecnica')
                        },
                        success: function (r) {
                            PVD.ocultarMascara('saveEvalFinal');
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                mostrarMensaje(1, 'La evaluaci&oacute;n ha sido concluida satisfactoriamente.');
                                self.fireEvent('evaluacionConcluida');
                                self.close();
                            } else if (responseData == false) {
                                mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                            }
                        }
                    });
                }
            });
        }
    }
});
