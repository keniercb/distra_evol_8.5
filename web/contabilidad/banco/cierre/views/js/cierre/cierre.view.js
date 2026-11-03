Ext.namespace('Banco.Cierre');

Banco.Cierre.View = {
    inicio: function(perfil, idioma, modelo) {

        this.lfdPeriodo = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });

        this.btnCPC = new Ext.Button({
            id: 'btnCPC',
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'cerrarperiodo',
            tooltip: idioma.lbbtnCPCtooltip,
            text: idioma.textbtnCPC,
            abreviatura: 'cierreperiodo_cierre'

        });
        validate.addButton(this.btnCPC);

        this.btnCD = new Ext.Button({
            id: 'btnCD',
            tooltip: idioma.lbbtnCDtooltip,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'cierrediario',
            disabled: true,
            hidden: true,
            text: idioma.textbtnCD
        });

        this.btnCEC = new Ext.Button({
            id: 'btnCEC',
            tooltip: idioma.lbbtnCECtooltip,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'cierreejercicio',
            text: idioma.textbtnCEC,
            abreviatura: 'cierreejercicio_cierre'

        });
        validate.addButton(this.btnCEC);

        this.btnCCB = new Ext.Button({
            id: 'btnCCB',
            tooltip: idioma.lbbtnCCBtooltip,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'cierre',
            text: idioma.textbtnCCB,
            abreviatura: 'cierreoperacionesbancarias_cierre'

        });
        validate.addButton(this.btnCCB);

        //boton de la vista previa***************************************
        this.btnVP = new Ext.Button({
            id: 'btnVP',
            tooltip: idioma.lbbtnVPtooltip,
//            icon: perfil.dirImg + 'imprimir.png',
            iconCls: 'vistaprevia',
            text: idioma.textbtnVP,
            abreviatura: 'vistaprevia_cierre'

        });
        validate.addButton(this.btnVP);
        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();
        // boton ayuda cierre
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudacierre',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.lbTooltipAyuda,
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda'
        });
        
        this.btnBorrarbanco = new Ext.Button({
            text: 'Borrar datos de banco',
            tooltip: 'Borrar datos de banco',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'aceptar',
            hidden: true
        });

        this.area = new Ext.form.TextArea({
            value: '',
            inputType: 'text',
            readOnly: true
        });

        this.panel1 = new Ext.Panel({
            layout: 'fit',
            border: false,
            tbar: [this.btnCCB, '', '', this.btnCPC, '', '', this.btnCEC, '', '', this.btnCD, /*'', '', this.btnVP,*/ '->', this.btnBorrarbanco, this.btnAyuda],
            items: this.area
        });

        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            title: idioma.lbpanelTitle,
            tbar: ['->', this.lfdPeriodo],
            items: this.panel1
        });

        this.viewPort = new Ext.Viewport({
            layout: 'fit',
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

        //Mascara de cargar datos
        this.lMaskk = new Ext.LoadMask(Ext.getBody(), {
            msg: idioma.lblMaskkMsg
        });

        //Mascara para realizar cierre
        this.MaskRealCierre = new Ext.LoadMask(Ext.getBody(), {});

        this.smlistadocuentas = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.grdlistadocuentas = new Ext.grid.GridPanel({
            collapsible: true,
            region: 'center',
            store: modelo.stlistadocuentas,
            sm: this.smlistadocuentas,
            autoExpandColumn: 'direccion',
            height: 400,
            autoScroll: false,
            columns: [
                {
                    header: idioma.headergrdlistadocuentas1,
                    width: 150,
                    sortable: true,
                    dataIndex: 'nrocuenta'
                },
                {
                    header: idioma.headergrdlistadocuentas2,
                    sortable: true,
                    dataIndex: 'nombrecuentabancaria',
                    id: 'direccion'
                },
                {
                    header: idioma.headergrdlistadocuentas3,
                    width: 120,
                    sortable: true,
                    dataIndex: 'nombremoneda'
                },
                {
                    header: idioma.headergrdlistadocuentas4,
                    width: 120,
                    sortable: true,
                    dataIndex: 'saldoenbancomo',
                    align: 'right'
                }]
        });

        this.winAbrir = new Ext.Window({
            width: 750,
            height: 500,
            resizable: false,
            constrain: true,
            layout: 'fit',
            closeAction: 'hide',
            modal: true,
            title: idioma.titlewinAbrir,
            items: [this.grdlistadocuentas],
            buttons: [{
                    //btnCerrar
                    text: idioma.btnCerrarText,
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cerrar',
                    tooltip: idioma.tooltipBtnCerrar
                },
                {
                    //btnRealizarCierre
                    text: idioma.btnRealizarCierreText,
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'cierre',
                    disabled: true,
                    tooltip: idioma.tooltipRealizarcierre
                }]
        });
    }
};


/*
 
 
 Ext.QuickTips.init();
 //Inicializar la interfaz.
 UCID.portal.cargarEtiquetas('cierre', function(perfil, idioma) {
 
 //Escogiendo la configuración del idioma
 idioma = (idioma) ? idioma : perfil.etiquetas;
 
 //Inicializar model
 var modelo = Banco.Cierre.Model;
 modelo.inicio();
 
 //Inicializar view
 var vista = Banco.Cierre.View;
 vista.inicio(perfil, idioma, modelo);
 
 //Inicializar controller
 Banco.Cierre.Controller.inicio(idioma, vista, modelo);
 });
 
 
 */
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
        var modelo = Banco.Cierre.Model;
        modelo.inicio();

        //Inicializar la vista.
        var vista = Banco.Cierre.View;
        vista.inicio(perfil, etiquetas, modelo);
        //vista.inicio(perfil,idioma, modelo);

        //Inicializar controlador.
        Banco.Cierre.Controller.inicio(etiquetas, vista, modelo);

    }
});
