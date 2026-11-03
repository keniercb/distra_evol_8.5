 //Inicializando la vista.
 Ext.QuickTips.init();
 var perfil = window.parent.perfil;
 perfil.etiquetas = Object();
 
 UCID.portal.cargarEtiquetas('conciliacionbancaria', function() {
 //Inicializar el modelo
 var model = Banco.Conciliacion.Model;
 model.init();
 
 //Inicializar la vista.
 var view = Banco.Conciliacion.View;
 //El último parámetro es para que aparezca o no, en la interfaz el botón ayuda
 view.init(perfil.etiquetas, model, false);
 
 //Inicializar controlador.
 var controller = Banco.Conciliacion.Controller;
 controller.init(perfil.etiquetas, view, model);
 //se carga los datos iniciales y se valida la apertura
 controller.loadDataIni();
 });