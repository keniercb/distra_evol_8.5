/*
 * Validar persona.
 *
 * @author Ing. Eddy Santana Navarro
 * @package Pvd.Riesgo
 * @uses Pvd.Persona.Validarpersona
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Persona.Validarpersona');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Persona.Validarpersona.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaValidarPersona',
            iconCls: 'ayuda',
            text: 'Ayuda'
        });

        this.btnValidar = new Ext.Button({
            disabled: true,
            id: 'btnValidar',
            text: 'Validar',
            tooltip: 'Validar',
            iconCls: 'ok',
            hidden: false
        });
        
        this.buscador = new Pvd.Persona.Validarpersona.Buscador();
        
        this.nfNumid = new Ext.form.NumberField({
            allowDecimals: false,
            allowNegative: false,
            width: 100,
            minLength: 3,
            maxLength: 11,
            anchor: '100%',
            enableKeyEvents: true,
            listeners: {                    
                specialkey: function(t, e) {
                    if (e.keyCode == 13 && self.tfNombre.isValid()) {
                        self.btnBuscar.handler();
                    }
                }.createDelegate(this)
            }
        });
        
        this.tfNombre = new Ext.form.TextField({
            readOnly: false,
            maxLength: 120,
            width: 100,
            maskRe: /^([a-zA-ZáéíóúñüÑ]+ ?[a-zA-ZáéíóúñüÑ]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ]+ ?[a-zA-ZáéíóúñüÑ]*)+$/,
            regexText: 'Solo admite letras.',
            anchor: '100%',
            emptyText: '',
            listeners: {
                specialkey: function(t, e) {
                    if (e.keyCode == 13 && self.tfNombre.isValid()) {
                        self.btnBuscar.handler();
                    }
                }.createDelegate(this)
            }
        });
        
        this.tfPapel = new Ext.form.TextField({
            readOnly: false,
            maxLength: 120,
            width: 100,
            maskRe: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ]*)+$/,
            regexText: 'Solo admite letras.',
            anchor: '100%',
            emptyText: '',
            listeners: {
                specialkey: function(t, e) {
                    if (e.keyCode == 13 && self.tfNombre.isValid()) {
                        self.btnBuscar.handler();
                    }
                }.createDelegate(this)
            }
        });
        
        this.tfSapel = new Ext.form.TextField({
            readOnly: false,
            maxLength: 120,
            width: 100,
            maskRe: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ]*)+$/,
            regexText: 'Solo admite letras.',
            anchor: '100%',
            emptyText: '',
            listeners: {
                specialkey: function(t, e) {
                    if (e.keyCode == 13 && self.tfNombre.isValid()) {
                        self.btnBuscar.handler();
                    }
                }.createDelegate(this)
            }
        });
        
        this.btnBuscar = new Ext.Button({
            disabled: false,
            text: 'Buscar',
            tooltip: 'Buscar <b>(Alt + B)</b>',
            iconCls: 'buscar'
        });
        
        this.btnLimpiar = new Ext.Button({
            disabled: false,
            text: 'Limpiar',
            tooltip: 'Limpiar <b>(Alt + L)</b>',
            iconCls: 'limpiar'
        });

        this.smselect = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            {
                header: 'No. identidad',
                width: 100,
                dataIndex: 'numid',
                sortable : false
            },
            {
                header: 'Nombre',
                width: 120,
                dataIndex: 'nombre',
                sortable : false
            },
            {
                header: 'Segundo nombre',
                width: 120,
                sortable : false,
                dataIndex: 'snombre'
            },
            {
                header: 'Primer apellido',
                width: 120,
                sortable : false,
                dataIndex: 'papel'
            },
            {
                header: 'Segundo apellido',
                width: 120,
                sortable : false,
                dataIndex: 'sapel'
            },
            {
                header: 'Sexo',
                width: 40,
                dataIndex: 'sexo',
                renderer: function (val) {
                    if (val === '1') {
                        return '<center><img ext:qtip="<b>Maculino</b>" src="../../views/images/persona/male.png" /></center>';
                    } else {
                        return '<center><img ext:qtip="<b>Femenina</b> "src="../../views/images/persona/female.png" /></center>';
                    }
                }
            },
            {
                header: 'Fuente',
                width: 90,
                sortable : false,
                dataIndex: 'fuente'
            },
            {
                header: 'Fecha validaci&oacute;n',
                width: 100,
                sortable : false,
                dataIndex: 'fechadevalidacion'
            },
            {
                header: 'Hora validaci&oacute;n',
                width: 100,
                sortable : false,
                dataIndex: 'horadevalidacion'
            }
        ]);

        //Listado de riesgos.
        this.gpPersonas = new Ext.grid.GridPanel({
            title: 'Listado de personas',
            region: 'center',
            //height: 400,
            split: true,
            sm: this.smselect,
            //plugins: this.expander,
            border: false,
            tbar: [' No. identidad: ', this.nfNumid, '-', ' Nombre: ', this.tfNombre, '-', ' Primer apellido: ', this.tfPapel, '-', ' Segundo apellido: ', this.tfSapel, '-', this.btnBuscar, this.btnLimpiar],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stPersonas,
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stPersonas,
                displayInfo: true
            })
        });
        
        //Vista general
        new Ext.Viewport({
            layout: 'border',
            items: [
                {region: 'center',
                    xtype: 'panel',
                    id: 'center-panel',
                    autoHeight: false,
                    split: true,
                    width: '100%',
                    border: false,
                    layout: 'border',
                    tbar: [this.btnValidar,  '->', this.btnAyuda],
                    items: [this.gpPersonas]
                }
            ]
        });

    }
}
;

//Inicializando la vista.
UCID.portal.cargarEtiquetas('validarpersona', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Persona.Validarpersona.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Persona.Validarpersona.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Persona.Validarpersona.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});