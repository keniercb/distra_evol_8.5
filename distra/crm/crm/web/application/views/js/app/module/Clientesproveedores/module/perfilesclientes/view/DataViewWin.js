var fileref = document.createElement("link");
fileref.setAttribute("rel", "stylesheet");
fileref.setAttribute("type", "text/css");
fileref.setAttribute("href", "../../views/js/app/module/Clientesproveedores/module/perfilesclientes/css/data-view.css");
document.getElementsByTagName("head")[0].appendChild(fileref);

Ext.define('PerfilesClientes.view.DataViewWin', {
    extend: 'Ext.view.View',
    store: this.store,
    multiSelect: true,
    alias: 'widget.DataViewWin',
    height: 0,
    trackOver: true,
    overItemCls: 'x-item-over',
    itemSelector: 'div.thumb-wrap',
    //emptyText: 'No images to display',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<article class="content scrollable" style="height: 280px">' +
            '<a name="Datos_generales{idclientesproveedores}" class="jumpsection">' + me.etiquetas.lbDatosGenerales + me.etiquetas.lbPersonaCls + '{[this.clasificacion(values.idclasificacion)]}</a>' +
            '<table class="mytable">' +
            '<tr><td class="td1">' + me.etiquetas.lbDescripcion + '</td><td class="td2 mgn">{[this.porDefinir(values.descripcion)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbCodigo + '</td><td class="td2 mgn">{[this.porDefinir(values.codigo)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbCorreo + '</td><td class="td2 mgn">{[this.valueRaw(values.correo)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbTelefono + '</td><td class="td2 mgn">{[this.porDefinir(values.telefono)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbDireccion + '</td><td class="td2 mgn">{[this.porDefinir(values.direccion)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbUsuario + '</td><td class="td2 mgn">{[this.porDefinir(values.nombreusuario)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbClasificacion + '</td><td class="td2 mgn">{[this.porDefinir(values.tipocliente)]}</td></tr>' +
            '</table>' +
            '</article>' +
            '</tpl>',
            {
                clasificacion: function (idclasificacion) {
                    if (idclasificacion == 1) {
                        return me.etiquetas.lbPersonaJuridica;
                    }
                },
                valueRaw: function (correo) {
                    return correo ? '<a href="mailto:' + correo + '">' + correo + '</a>' : '<span><b style="color:#d9534f">' + me.etiquetas.lbPorDefinir + '</b></spam>';
                },
                porDefinir: function (value) {
                    return value ? value : '<span><b style="color:#d9534f">' + me.etiquetas.lbPorDefinir + '</b></spam>';
                }
            }
        );
        me.callParent();
    }
});