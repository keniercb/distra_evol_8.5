Ext.ns('Pvd.Plugins.Leyenda');
Pvd.Plugins.Leyenda.idioma = {
    "es": {
        "titulo": 'Leyenda'
    }
}
Pvd.Plugins.Leyenda.btnLeyenda = Ext.extend(Ext.Button, {
    id: 'BtnLeyenda',
    iconCls: 'mostrar',
    text: 'Leyenda',
    enableToggle: true,
    initComponent: function() {
        var self = this;
        this.WinLeyenda = new Ext.Window({
            id : 'WinLeyenda',
            closable: false,
            bodyBorder : false,
            border: false,
            constrain: true,
            hideBorders: true,
            html: '<div style="margin: 5px"><p style="color: #15428b"><b><u>' + Pvd.Plugins.Leyenda.idioma.es.titulo + '</u>:</b></p>' + this.param_html + '</div>',
            height: this.param_height,
            width: this.param_width
        });
        this.on('toggle', function(btn, pressed) {
            if(pressed) {
                var anchoBtn = self.getEl().getWidth();
                var altoBtn = self.getEl().getHeight();
                var x = self.getEl().getX();
                var y = self.getEl().getY();
                var posX = x + anchoBtn;
                var posY = y + altoBtn;
                self.WinLeyenda.setPosition(posX, posY);
                self.WinLeyenda.show();
            }
            else {
                self.WinLeyenda.hide();
            }
        });
        Pvd.Plugins.Leyenda.btnLeyenda.superclass.initComponent.call(this);
    }
});