/**
 * @extends Ext.Panel
 * @xtype
 * @autor   Centro Capital Humano - Ing. Yaricel Guerra Velázquez
 * @version 1.0.0
 */
Ext.ns('PVD.Plantilla');

PVD.Plantilla.Contenedor = Ext.extend(Ext.Window, {
    width: 1000,
    height: 800,
    id: 'winplantilla',
    maskDisabled: false,
    animCollapse: false,
    maximizable: true,
    constrain: true,
    border: false,
    modal: true,
    initComponent: function () {
        var self = this;
        if (self.idplantilla) {
            var idIframe = (!Ext.isEmpty(this.idIframe))?this.idIframe:Ext.id();
            var url = (self.url)? self.url:'/pvd/maestro/documentos/index.php/plantillaexp/generarPdf';
            var params = Ext.urlEncode({
                idplantilla : self.idplantilla,
                idpersona: self.idpersona,
                orientacion: self.orientacion,
                formato: self.formato,
                margenes: (self.margenes)?self.margenes:'5, 5, 5, 8'
            });
            this.title = self.title || 'Exportar documento';
            this.items = {
                xtype: 'component',
                autoEl: {
                    tag: 'iframe',
                    id: idIframe,
                    style: 'height: 100%; width: 100%; border: none',
                    src: document.location.protocol + '//' + document.location.host +
                    url+'?' + params
                }
            }

        } else {
            mostrarMensaje(6, "El documento no se puede mostrar porque no ha especificado el identificador de la plantilla.");
        }
        this.on('show', function () {
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando documento.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        });
        PVD.Plantilla.Contenedor.superclass.initComponent.call(this);
    }
});