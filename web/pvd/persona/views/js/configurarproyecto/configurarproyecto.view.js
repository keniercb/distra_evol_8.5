/**
 * Interfaz para configurar proyectos
 *
 * @author Ing. Javier Rodríguez López
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('Ext.pvd.persona.configurarproyecto');

Ext.pvd.persona.configurarproyecto.Vista = {

    init: function (perfil, lang, model) {

        /**
         * Boton Adicionar proyecto
         * @type {Button}
         */
        this.btnAdd = new Ext.Button({
            text: lang.lbBtnAdd,
            tooltip: lang.ttpBtnAdd,
            iconCls: 'adicionar'
        });

        /**
         * Boton Modificar proyecto
         * @type {Button}
         */
        this.btnMod = new Ext.Button({
            text: lang.lbBtnMod,
            tooltip: lang.ttpBtnMod,
            iconCls: 'modificar',
            disabled: true
        });

        /**
         * Boton Eliminar proyecto
         * @type {Button}
         */
        this.btnDel = new Ext.Button({
            text: lang.lbBtnDel,
            tooltip: lang.ttpBtnDel,
            iconCls: 'eliminar',
            disabled: true
        });

        /**
         * Configura conceptos del proyecto
         * @type {Button}
         */
        this.btnConfig = new Ext.Button({
            text: lang.lbBtnConfig,
            tooltip: lang.ttpBtnConfig,
            iconCls: 'configuracion',
            disabled: true
        });

        /**
         * Genera la configuracion del proyecto
         * @type {Button}
         */
        this.btnGenerate = new Ext.Button({
            text: lang.lbBtnGenerate,
            tooltip: lang.ttpBtnGenerate,
            iconCls: 'generadorreportes',
            disabled: true
        });

        /**
         * Ayuda de la funcionalidad
         * @type {Button}
         */
        this.btnHelp = new Ext.Button({
            text: lang.lbBtnHelp,
            tooltip: lang.ttpBtnHelp,
            iconCls: 'ayuda'
        });

        this.btnAceptProj = new Ext.Button({
            text: lang.lbBtnAcept,
            tooltip: lang.ttpBtnAcept,
            iconCls: 'aceptar'
        });

        this.btnAplicProj = new Ext.Button({
            text: lang.lbBtnAplic,
            tooltip: lang.ttpBtnAplic,
            iconCls: 'aplicar'
        });

        this.btnCancelProj = new Ext.Button({
            text: lang.lbBtnCancel,
            tooltip: lang.ttpBtnCancel,
            iconCls: 'cancelar'
        });

        /**
         * Columnas del listado de personas
         * @type {Array}
         */
        this.cmProject = [new Ext.grid.RowNumberer(),
            {id: 'denominacion', header: 'Denominación', dataIndex: 'denominacion', sortable: true },
            {header: 'Recuperador complejo', dataIndex: 'idconfiguracion', sortable: true, width: 145},{
                header: 'Fuente de datos', dataIndex: 'fdatos', width: 145,
                editor: new Ext.form.ComboBox({
                    typeAhead: true,
                    store: new Ext.data.SimpleStore({
                        fields: [ 'nombre'],
                        data: [
                            ['Si'],
                            ['No']
                        ]
                    }),
                    triggerAction: 'all',
                    valueField: 'nombre',
                    hiddenName: 'fdatos',
                    name: 'fdatos',
                    editable: false,
                    forceSelection: true,
                    anchor: '100%',
                    displayField: 'nombre',
                    allowBlank: false,
                    mode: 'local'
                })
            }];

        /**
         * Modo de seleccion
         * @type {RowSelectionModel}
         */
        this.smProject = new Ext.grid.RowSelectionModel({singleSelect: true});

        /**
         * Listado de proyectos de persona
         * @type {GridPanel}
         */
        this.gpProject = new Ext.grid.EditorGridPanel({
            title: 'Listado de proyectos',
            clicksToEdit: 1,
            sm: this.smProject,
            store: model.stProject,
            columns: this.cmProject,
            autoExpandColumn: 'denominacion',
            margins: '5 5 5 5',
            region: 'center',
            tbar: [this.btnAdd, this.btnMod, this.btnDel, this.btnConfig, this.btnGenerate, '->', this.btnHelp],
            bbar: new Ext.PagingToolbar({
                store: model.stProject,
                displayInfo: true,
                pageSize: 15
            }),
            loadMask: {
                store: model.stProject
            }
        });

        this.tfDenominacion = new Ext.form.TextField({
            fieldLabel: lang.lbDenom,
            maxLength: 255,
            name: 'denominacion',
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ_ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ_ 0-9]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ_ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ_ 0-9]*)+$/,
            regexText:'Solo permite la entrada de caracteres alfanuméricos y los caracteres especiales (espacio -+_/\\.)'
        });

        this.tfIdProyecto = new Ext.form.TextField({
            fieldLabel: lang.lbIdProyecto,
            maxLength: 30,
            name: 'idproyecto',
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ_0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ_0-9]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ_0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ_0-9]*)+$/,
            regexText:'Solo permite la entrada de caracteres alfanuméricos y los caracteres especiales (espacio -+_/\\.)'
        });

        this.cbReccompleja = new Ext.form.ComboBox({
            msgTarget: 'qtip',
            mode: 'local',
            fieldLabel: lang.lbReccompleja,
            enableQtip: true,
            store: model.stReccomplejo,
            typeAhead: true,
            triggerAction: 'all',
            valueField: 'idconfiguracion',
            hiddenName: 'idconfiguracion',
            forceSelection: true,
            displayField: 'denominacion'
        });

        this.hfAction = new Ext.form.Hidden({
            name: 'action'
        });

        this.formProject = new Ext.form.FormPanel({
            frame: true,
            width: 380,
            region: 'center',
            defaults: {anchor: '100%', allowBlank: false},
            labelWidth: 150,
            margins: '5 5 5 5',
            items: [this.hfAction, this.tfIdProyecto, this.tfDenominacion, this.cbReccompleja]
        });

        this.WindFormProject = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            items: [this.formProject],
            buttons: [this.btnCancelProj, this.btnAplicProj, this.btnAceptProj]
        });

        var vp = new Ext.Viewport({
            layout: 'border',
            items: [this.gpProject]
        });
    }
};

var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
labels = Object();

UCID.portal.cargarEtiquetas('configurarproyecto', function (perfil, lang) {

    //Escogiendo la configuración del lang según la versión del MT.
    lang = (lang) ? lang : perfil.etiquetas;

    //Inicializando el model
    var model = Ext.pvd.persona.configurarproyecto.Modelo;
    model.init(perfil);

    //Inicializando la view.
    var view = Ext.pvd.persona.configurarproyecto.Vista;
    view.init(perfil, lang, model);

    //Inicializar controlador.
    var controller = Ext.pvd.persona.configurarproyecto.Controlador;
    controller.init(perfil, lang, view, model);
});