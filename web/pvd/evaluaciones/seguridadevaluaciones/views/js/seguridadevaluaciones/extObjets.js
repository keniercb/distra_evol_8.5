/**
 * Archivo para crear objetos que ser�n reutilizados en la interfaz*
 * 
 * @author Tte. Ing. Javier Rodr�guez L�pez*
 * @package PVD *
 * @subpackage Evaluaciones *
 * @copyright UCID-ERP Cuba 10 *
 */
 Ext.namespace("SeguridadEvaluaciones");
 SeguridadEvaluaciones.showBtnCancel = Ext.extend(Ext.Button, {
	initComponent: function(){		
		Ext.apply(this, {
			iconCls:'cancelar',
			text:perfil.etiquetas.lbBtnCancelar
		});
		SeguridadEvaluaciones.showBtnCancel.superclass.initComponent.call(this);
	}
});
