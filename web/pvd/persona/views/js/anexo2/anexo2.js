/**
 * @name analisisP - Vista de la interfaz.
 * @package   Pvd.Persona
 * @uses      Pvd.Persona.AnalisisP
 * @copyright XETID.
 * @author    Centro RRHH. Divisi�n Gesti�n de Entidades. XETID.
 *            Orestes Rodr�guez Lorenzo - Osiel Fundora Ramírez
 * @version   1.0
 */
Ext.ns('Pvd.Persona.Anexo2');
Ext.QuickTips.init();

new Ext.Viewport({
    layout: 'fit',
    items: [(new Maestro.Reporte.MenuApp({idmodule:'persona'})).getMainView()]
});
