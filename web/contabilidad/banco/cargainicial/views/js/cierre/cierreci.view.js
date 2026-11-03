Ext.namespace('Banco.Cierreci');

Banco.Cierreci.View = {
    inicio: function(perfil, idioma, modelo) {

        this.lfdPeriodo = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });

        //mensaje de mascara para la interfaz completa, cuando carga la interfaz
        this.lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: idioma.lblMaskmsg
        });

        //mascara para realizar el cierre
        this.lMaskRelCierre = new Ext.LoadMask(Ext.getBody(), {});

        //mascara para realizar el reporte de la carga inicial
        this.reportMask = new Ext.LoadMask(Ext.getBody(), {});

        this.btnCierre = new Ext.Button({
            id: 'btnCierre',
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'cierre',
            tooltip: idioma.btnCierretooltip,
            text: idioma.btnCierretext,
            abreviatura: 'realizarcierre_cierre'

        });
        validate.addButton(this.btnCierre);

        //boton de la vista previa
        this.btnVP = new Ext.Button({
            id: 'btnVP',
            tooltip: idioma.btnVPtooltip,
//            icon: perfil.dirImg + 'imprimir.png',
            iconCls: 'vistaprevia',
            text: idioma.btnVPtext,
            abreviatura: 'vistaprevia_cierre'

        });
        validate.addButton(this.btnVP);

        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();

        // boton ayuda cierre carga inicial
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudacierreCI',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.lbTooltipAyuda,
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda'
        });

        this.area = new Ext.form.TextArea({
            value: '',
            inputType: 'text',
            readOnly: true
        });

        this.panel1 = new Ext.Panel({
            layout: 'fit',
            border: false,
            tbar: [this.btnCierre, this.btnVP, '->', this.btnAyuda],
            items: this.area
        });

        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            title: idioma.lbpanelTitle,
            tbar: ['->', this.lfdPeriodo],
            items: this.panel1
        });

        this.MiView = new Ext.Viewport({
            layout: 'fit',
            renderTo: document.body,
            items: this.panel
        });

        this.globalKeyMap = new Ext.KeyMap(document);
        this.globalKeyMap.accessKey = function(key, handler, scope) {
            var h = function(n, e) {
                e.preventDefault();
                handler.call(scope || this, n, e);
            };
            this.on(key, h, scope);
        };
    }
};


Ext.QuickTips.init();
//Inicializar la interfaz.
UCID.portal.cargarEtiquetas('gestionarcierre', function(perfil, idioma) {

    //Escogiendo la configuracion del idioma
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializar model
    var modelo = Banco.Cierreci.Model;
    modelo.inicio();

    //Inicializar view
    var vista = Banco.Cierreci.View;
    vista.inicio(perfil, idioma, modelo);

    //Inicializar controller
    Banco.Cierreci.Controller.inicio(idioma, vista, modelo);
});