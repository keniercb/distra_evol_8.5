/**
 * @Created por XETID-RRHH.
 * @Author: Ing. Miguel Antonio Cabreja Aldana
 * @Date: 11/12/2014
 * @Time: 9:14
 * @Version:1.0
 */
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('capturarhuella', cargarInterfaz);
function cargarInterfaz() {

    var perfil = arguments[0];
    var labels = arguments[1];
    var gest = new PVD.Persona.Fingerprint.pCapturarHuella({
        region: 'center',
        server: "10.12.29.14:8080",
        protocol: "TCP"

    });

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [gest]
    });

}
