/**
 * @name analisisP - Vista de la interfaz.
 * @package   Pvd.Persona
 * @uses      Pvd.Persona.AnalisisP
 * @copyright XETID.
 * @author    Centro RRHH. Divisi�n Gesti�n de Entidades. XETID.
 *            Orestes Rodr�guez Lorenzo - Osiel Fundora Ramírez
 * @version   1.0
 */
Ext.ns('Pvd.Persona.AnalisisP');



Ext.QuickTips.init();
Pvd.Persona.AnalisisP.Vista = {
    init: function() {
        //Vista general
        new Ext.Viewport({
            layout: 'fit',
            items: [(new Maestro.Reporte.MenuApp({idmodule:'persona'})).getMainView()]
        });
    }
};



