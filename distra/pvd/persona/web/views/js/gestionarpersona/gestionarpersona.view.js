/**
 * Funcionalidad para gestionar personas generico
 *
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2013
 */
Ext.QuickTips.init();
Ext.ns('Ext.PersonaGenerico');

Ext.PersonaGenerico.ViewBase = function (config) {
    UCID.portal.cargarAcciones(window.frameElement.id);
    //UCID.portal.cargarAcciones(window.frameElement.id);
    config = config || {};
    this.id = Ext.id();
    this.initialConfig = config;

    Ext.apply(this, config);
    Ext.PersonaGenerico.ViewBase.superclass.constructor.call(this);
    this.initComponent();
    this.syncLang();
};

Ext.extend(Ext.PersonaGenerico.ViewBase, Ext.util.Observable, {
    idioma: Ext.PersonaGenerico.idioma,
    arrBtn: new Array(),

    initComponent: function () {
        this.initVista();
    },

    initVista: function () {
        this.initPanelPerfil();
        this.initReccompleja();

        /**
         * Contenedor
         * @type {Viewport}
         */
        var vp = new Ext.Viewport({
            layout: 'border',
            items: [this.pFicha, this.objRecComplejas]

        });

        /**
         * Instancia del portal de conceptos
         * @type {GestPersonalConcept}
         */
        this.winGestPersonalConcept = new Ext.Component.GestPersonalConcept({
            configPersona: this.configPersona,
            parent: this
        });

        if (this.controller) {
            new this.controller({
                view: this,
                idioma: this.idioma
            });
        } else {
            new Ext.PersonaGenerico.ControllerBase({
                view: this,
                idioma: this.idioma
            });
        }
    },

    initButtons: function () {
        var me=this;
        this.btnAyuda = this.btnAyuda || new Ext.Button({
                iconCls: 'ayuda',
                id: 'btnAyuda_registro',
                tooltip: 'Ayuda de la funcionalidad <b>(Alt+H)</b>',
                text: this.idioma.lbBtnAyuda
            });

        /**
         * Boton de adicionar personas
         * @type {Button}
         */
        this.btnAdd = this.btnAdd || new Ext.Button({
                iconCls: 'adicionar',
                disabled: true,
                id: 'registroPersonaAdd',
                hidden: true,
                tooltip: this.idioma.ttBtnAdiocnar,
                text: this.idioma.lbBtnAdicionar
            });

        /**
         * Boton de modificar los datos personales
         * @type {Button}
         */
        this.btnMod = this.btnMod || new Ext.Button({
                iconCls: 'modificar',
                disabled: true,
                id: 'registroPersonaMod',
                hidden: true,
                tooltip: this.idioma.ttBtnModificar,
                text: this.idioma.lbBtnModificar
            });

        this.btnView = this.btnView || new Ext.Button({
                iconCls: 'ver',
                id: 'registroPersonaView',
                disabled: true,
                tooltip: this.idioma.ttBtnVer,
                hidden: true,
                text: this.idioma.lbBtnVer
            });

        this.btnGestDoc = this.btnGestDoc || new Ext.Button({
                id: 'personaDocumentos',
                iconCls: 'documentos',
                disabled: true,
                hidden: true,
                tooltip: this.idioma.ttBtnGestDoc,
                text: this.idioma.lbBtnGestDoc
            });
            
        this.btnGestDocumentos = new Ext.Button({
            id: 'btnGestDocumentos',
            iconCls: 'gestionardocumentosprimarios',
            disabled: true,
            hidden: false,
            tooltip: this.idioma.ttBtnGestDocumentos,
            text: this.idioma.lbBtnGestDocumentos
        });

        /**
         * Boton de eliminar personas
         * @type {Button}
         */
        this.btnDel = new Ext.Button({
            id: 'registroPersonaDel',
            hidden: true,
            iconCls: 'eliminar',
            disabled: true,
            tooltip: this.idioma.ttBtnEliminar,
            text: this.idioma.lbBtnEliminar
        });

        this.btnReportPlanilla = new Ext.menu.Item({
            text: 'Datos del cuadro',
            disabled: false,
            iconCls: 'informe',
            handler:function () {
                me.showReportesNuevos('getPlanillaCuadro', 'pdf');
            }
        });

        this.btnFichaPersona = new Ext.menu.Item({
            text: 'Ficha de la persona',
            disabled: false,
            iconCls: 'informe',
            handler:function () {
                me.showReportesNuevos('generarPdfFicha', 'pdf');
            }
        });

        this.btnExpedientePersona = new Ext.menu.Item({
            text: 'Expediente de la persona',
            disabled: false,
            iconCls: 'informe',
            handler: function () {
                me.showReportesNuevos('generarRTFExpediente', 'doc');
            }
        });

        this.btnReportPerfil = new Ext.menu.Item({
            text: 'Síntesis Biográfica',
            iconCls: 'comprobante',
            handler:function () {
                me.showReportesNuevos('getPerfilCuadro', 'doc');
            }
        });

        this.btnReport = new Ext.Button({
            text: 'Reportes',
            id: 'btnReport',
            hidden: true,
            iconCls: 'recuperaciones',
            tooltip:'Reportes',
            menu: new Ext.menu.Menu({
                items: [this.btnReportPlanilla, this.btnFichaPersona, this.btnExpedientePersona]
            })
        });
        this.btnExport = new Ext.Button({
            id: 'personabtnexport',
            iconCls: 'exportar',
            disabled: true,
            hidden: true,
            tooltip: this.idioma.ttBtnExportar,
            text: this.idioma.lbBtnExportar
        });

        this.btnImport = new Ext.Button({
            id: 'personabtnimport',
            iconCls: 'importar',
            disabled: true,
            hidden: true,
            tooltip: this.idioma.ttBtnImportar,
            text: this.idioma.lbBtnImportar
        });
        this.btnImportarPersExcel = new Ext.Button({
            text: 'Importar Excel',
            id: 'btnImportarPersExcel',
            tooltip: 'Importar persona <b>(Ctrl+Alt+I)<b/>',
            iconCls: 'importar',
            disabled: true,
            hidden: true
        });

        this.btnSyncActivoFAR = new Ext.Button({
            id: 'syncactivofar',
            text: 'Sync',
            tooltip: 'Actualizar personas desde activo FAR',
            iconCls: 'actualizar',
            hidden: true
        });
    },

    initBtnHandlers: function () {
        var me = this;
       me.btnReportPlanilla.setHandler(function () {
            this.showReportesNuevos('getPlanillaCuadro', 'pdf');
        }, this);

        me.btnReportPerfil.setHandler(function () {
            this.showReportesNuevos('getPerfilCuadro', 'doc');
        }, this);
        me.btnFichaPersona.setHandler(function () {
            this.showReportesNuevos('generarPdfFicha', 'pdf');
        }, this);
    },
    showReportesNuevos: function (url, type) {
        var me=this;

        if (type == 'pdf') {
            var params = Ext.urlEncode({
                destino: 'I',
                idpersona: this.getSelection()[0].get('idpersona')
            });
            var idIframeResolucion = Ext.id();
            var w = new Ext.Window({
                title: 'Reporte: ' + name,
                width: 800,
                height: 500,
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrainHeader: true,
                border: false,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframeResolucion,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/persona/projects/basetecnologica/index.php/basetecnologica/' + url + '?' + params
                    }
                }
            });
            w.show();
            w.maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando vista previa del reporte.');
            document.getElementById(idIframeResolucion).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        } else {
            PVD.mostrarMascara('idplanillasend', 'Enviando....', 'Generando reporte...');
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                params: {
                    idpersona: this.getSelection()[0].get('idpersona')
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idplanillasend');
                    var respuesta = Ext.decode(response.responseText);
                    window.open(respuesta.url);
                }
            });
        }
        ;
        /* */
    },
    getSelection: function () {
        return this.objRecComplejas.pReporte.gpReporte.getSelectionModel().getSelections();
    },
    initPanelPerfil: function () {
        this.foto = new Ext.XTemplate(
            '<tpl for="."><div ">' +
            '<center><img src="{foto}" ' +
            'style=" cursor: pointer ;' +
            'border-radius: 10%;' +
            'width: 180px; height: 180px;' +
            'box-shadow: inset 0px 0px 10px #000, 0px 0px 10px #000; title="Ampliar"/><center>' +
            '</div></tpl>'
        );
        this.foto.compile();

        this.infoPersona = new Ext.XTemplate();

        /**
         * Componente para mostrar la ficha de la persona
         * @type {Panel}
         */
        this.pFicha = this.pFicha || new Ext.Panel({
                margins: '5 0 5 5',
                cmargins: '5 5 5 5',
                split: true,
                collapsible: true,
                collapsed: true,
                title: this.idioma.lbFicha,
                width: '25%',
                region: 'west',
                layout: 'border',
                items: [
                    {
                        region: 'north',
                        height: 200,
                        border: false,
                        bodyStyle: 'padding:10px',
                        id: 'pFoto'
                    },
                    {
                        region: 'center',
                        height: 200,
                        border: false,
                        bodyStyle: 'padding:10px',
                        id: 'pInfo'
                    }
                ]
            });
    },

    initReccompleja: function () {
        /**
         * Instancia del recuperador complejo
         * @type {Interfaz}
         */

        this.objRecComplejas = this.objRecComplejas || new Ext.components.CmpReccomplejas.Interfaz({
                margins: '5 5 5 0',
                title: this.idioma.lb_Reccomplejas_title,
                width: '75%',
                region: 'center',
                border: true,
                idconfiguracion: this.configPersona.idreccomplejas,
                tituloReporte: this.idioma.lb_Reccomplejas_tituloReporte,
                tituloConfiguracion: this.idioma.lb_Reccomplejas_tituloConfiguracion,
                tituloGrid: this.idioma.lb_Reccomplejas_tituloGrid,
                ttpBtnBuscar: this.idioma.ttpBtnBuscar,
                mainToolBar: (this.arrBtn.length > 0) ? this.arrBtn : this.addButtons(),
                hideBtnRtf: true,
                singleSelect: false,
                noUsarGestAvisos: true, //False si voy a usar el componente de Gestionar avisos
                useMap: false,
                hideBtnOperCant: false,
                renderers: this.getRenderes(),
                viewGridConfig: Ext.apply({}, this.viewGridConfig()),
                autoLoadList: true
            });
    },

    addButtons: function (btn) {
        this.initButtons();

        this.arrBtn = [this.btnAdd, this.btnMod, this.btnDel,  this.btnReport, this.btnGestDoc, '-', this.btnView, this.btnSyncActivoFAR, '-', this.btnExport, this.btnImport, this.btnImportarPersExcel];

        if (Ext.isArray(btn)) {
            Ext.each(btn, function (rec) {
                this.arrBtn.push(rec);
            }, this);
        }
        this.arrBtn.push('->');
        this.arrBtn.push(this.btnAyuda);
        return this.arrBtn;
    },

    getRenderes: function () {
        return Ext.apply({
            showSexo: function (val) {
                if (val === 'Femenino' || val === '0') {
                    return '<center><img ext:qtip="<b>Femenina</b> "src="../../../../views/images/persona/female.png" /></center>';
                } else {
                    return '<center><img ext:qtip="<b>Maculino</b>" src="../../../../views/images/persona/male.png" /></center>';
                }
            },
            markEliminados: function (val, meta, rec) {
                if (!Ext.isEmpty(rec.get('feliminado'))) {
                    meta.attr = 'style="color:red;"';
                }
                return val;
            }
        }, this.renderersReccompleja());
    },

    renderersReccompleja: function () {
        return {};
    },

    viewGridConfig: function () {
        return {};
    },

    syncLang: function () {
        if (typeof this.lang == 'object') {
            Ext.apply(this.idioma, this.lang);
        }
    }
});

Ext.PersonaGenerico.WinImportarPersona = Ext.extend(Ext.Window, {
    modal: true,
    closeAction: 'hide',
    constrain: true,
    autoHeight: true,
    resizable: false,
    layout: 'fit',
    border: false,
    initComponent: function () {

        this.title = Ext.PersonaGenerico.idioma.titleWinImportarPersona;

        this.initButtons();
        this.initForm();

        Ext.PersonaGenerico.WinImportarPersona.superclass.initComponent.call(this);
    },
    initButtons: function () {
        var me = this,
            idiom = Ext.PersonaGenerico.idioma;

        me.btnCancel = new Ext.Button({
            iconCls: 'cancelar',
            text: idiom.lbtnCancelar,
            tooltip: idiom.ttBtnCancelar,
        });

        me.btnAccept = new Ext.Button({
            iconCls: 'aceptar',
            text: idiom.lbtnAceptar,
            tooltip: idiom.ttBtnAceptar,
        });

        me.buttons = [me.btnCancel, me.btnAccept];
    },
    initForm: function () {
        var me = this,
            idiom = Ext.PersonaGenerico.idioma;

        me.fufArchivo = new Ext.form.FileUploadField({
            width: '100%',
            fieldLabel: idiom.lbFieldFichero,
            emptyText: idiom.emptyTextSelectArchivo,
            regex: /^.+\.(zip)$/i,
            regexText: idiom.lbInvalidFieldUploadFile,
            allowBlank: false,
            blankText: idiom.validationEmptyField,
            name: 'personafile',
            buttonCfg: {
                text: idiom.lbBtnSearchFile,
                iconCls: 'buscar'
            }
        });

        me.form = new Ext.FormPanel({
            frame: true,
            fileUpload: true,
            labelAlign: 'top',
            bodyStyle: {padding: '10px 10px 10px 10px'},
            width: 300,
            autoHeight: true,
            items: [me.fufArchivo]
        });

        me.items = [me.form];
    }
});
