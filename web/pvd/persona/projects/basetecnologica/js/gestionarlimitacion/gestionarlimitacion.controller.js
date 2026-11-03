Ext.ns('Ext.component.persona');                                                                                                                                                               
Ext.component.persona.Controlador={
	init: function(perfil,idioma, vista, modelo) {
		modelo.store.load();
		/*----------  Trabajo en el formulario  ----------*/
		vista.panelForm.collapse();
		//Abrir formulario
		vista.btnAdicionar.on('click', function() {
			vista.panelForm.expand(true);
		});
		//Cerrar formulario
		vista.btnCancelar.on('click', function() {
			vista.panelForm.collapse(true);
		});
		vista.btnAceptar.on('click', function() {
			console.info(modelo.storeCausas);
		});
	}
}