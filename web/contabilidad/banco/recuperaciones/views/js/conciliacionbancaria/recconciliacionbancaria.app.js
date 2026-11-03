//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil;

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function(options, success, response)
    {
        var etiquetas = Ext.decode(response.responseText);

        //Inicializar el modelo
        var modelo = Banco.Recuperaciones.Conciliacion.Model;
        modelo.inicio();

        //Inicializar la vista.
        var vista = Banco.Recuperaciones.Conciliacion.View;
        //último parámetro para saber si lo abre por conciliacion o por su fuljo normal
        //true es si esta por el flujo normal y false es cuando se abre por conciliacion
        vista.inicio(perfil, etiquetas, modelo, true);

        //Inicializar controlador.
        Banco.Recuperaciones.Conciliacion.Controller.inicio(etiquetas, vista, modelo);
    }
});