//Empaquetando el componente tipo cta bancaria.
Ext.ns('Banco.Tipoctabancaria');

//Vista del componente Tipo cta bancaria.
Banco.Tipoctabancaria.View = {
    /**
     * Inicializar la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param model Modelo de la vista del componente Usuario (Tipo: Sauxe.CasoEstudio.Usuario.Modelo).
     */
    init: function(idioma, model) {

        //Me dice si hay alguna ventana abierta
        this.windowopen = false;


        // boton adicionar  tipo de cta bancaria
        this.btnAdicionar = new Ext.Button({
            // text : 'Adicionar',
            text: idioma.lbBtnAdicionar,
            //tooltip: "Adicionar tipo de cuenta bancaria (<b>Alt+A</b>)",
            tooltip: idioma.lbTooltipAddTipoCta,
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            abreviatura: 'add_tipocuentabancaria'

        });
        validate.addButton(this.btnAdicionar);
        // boton modificar tipo de cta bancaria
        this.btnModificar = new Ext.Button({
            //text : 'Modificar',
            text: idioma.lbBtnModificar,
            //tooltip: "Modificar tipo de cuenta bancaria (<b>Alt+M</b>)",
            tooltip: idioma.lbTooltipModTipoCta,
//            icon: perfil.dirImg + 'modificar.png',
            disabled: true,
            iconCls: 'modificar',
            abreviatura: 'add_tipocuentabancaria'

        });
        validate.addButton(this.btnModificar);
        // boton eliminnar tipo de cta bancaria
        this.btnEliminar = new Ext.Button({
            //text : 'Eliminar',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.lbTooltipElimTipoCta,
//            icon: perfil.dirImg + 'eliminar.png',
            disabled: true,
            iconCls: 'eliminar',
            abreviatura: 'del_tipocuentabancaria'

        });
        validate.addButton(this.btnEliminar);

        // boton eliminnar tipo de cta bancaria
        this.btnHeredar = new Ext.Button({
            //text : 'Heredar',
            text: idioma.lbBtnHeredar,
            //tooltip: "Heredar tipo de cuenta bancaria (<b>Alt+E<b>)",
            tooltip: idioma.lbTooltipHeredar,
//            icon: '/contabilidad/comun/images/heredar.png',
            //disabled: true,
            hidden: true,
            iconCls: 'heredar',
            abreviatura: 'heredar_tipocuentabancaria'

        });
        validate.addButton(this.btnHeredar);
        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();

        // boton ayuda para tipo de cta bancaria
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudatipocuentabancaria',
            tooltip: idioma.lbTooltipAyudaTipoCta,
            iconCls: 'ayuda',
//            icon: perfil.dirImg + 'ayuda.png',
            text: idioma.lbBtnAyuda
        });

        this.gpTipoCtaB = new Ext.grid.GridPanel({
            border: false,
            stripeRows: true,
            autoScroll: true,
            autoExpandColumn: 'expandir',
            store: model.stTipoCtaB,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {
                store: model.stTipoCtaB
            },
            columns: [{
                    hidden: true,
                    dataIndex: 'idtipocuenta',
                    hideable: false
                }, {
                    id: 'expandir',
                    header: idioma.lbTitCodigo,
                    width: 250,
                    dataIndex: 'codigo',
                    sortable: true
                }, {
                    header: idioma.lbTitDenom,
                    width: 600,
                    dataIndex: 'denominacion',
                    sortable: true
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'version'
                }, {
                    header: "Entidad",
                    width: 0,
                    dataIndex: 'idestructuracomun',
                    hideable: false
                }
            ],
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnHeredar, '->', this.btnAyuda,'<p></p>'],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                showGroupName: false,
                enableNoGroups: false, // REQUIRED!
                hideGroupedColumn: true,
                groupTextTpl: '{[values.rs[0].data.entidad]}'  // '{text} {[values.rs[0].data.codigo]}'
            }),
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: model.stTipoCtaB,
                displayInfo: true
            })
        });
        
        //pintar los documentos en uso
        this.gpTipoCtaB.getView().getRowClass = function(record) {
            if (record.get('libre') == '0') {
                return 'FilaVerde';
            }
        };

        //Vista general del Documento
        new Ext.Viewport({
            layout: 'fit',
            items: [this.gpTipoCtaB]
        });



        //para las teclas de acceso rapido
        this.globalKeyMap = new Ext.KeyMap(document);
        this.globalKeyMap.accessKey = function(key, handler, scope) {
            var h = function(n, e) {
                e.preventDefault();
                handler.call(scope || this, n, e);
            };
            this.on(key, h, scope);
        };

        //FIN DE LA VENTANA PRINCIPAL

        //VENTANA ADD y  MOD tipo cta  bancaria 

        // codigo  para add y  mod tipo cta bancaria
        this.tfcodigo = new Ext.form.NumberField({
            id: 'tfcodigo',
            //fieldLabel : 'C&oacute;digo',
            fieldLabel: idioma.lbTitCodigo,
            msgTarget: 'qtip',
            name: 'codigo',
            selectOnFocus: true,
            maxLength: 16,
            //maxLengthText : 'El tama&ntilde;o requerido es de 16 d&iacute;gitos.',
            //maxLengthText: idioma.lbCampomaxLengthText16,
            allowBlank: false,
            blankText: idioma.lbMsgReq,
            //maskRe : /^\d*$/, // Solo n?meros
            regex: /^\d*$/,
            regexText: idioma.lbSoloNumregexText,
            anchor: '100%',
            enableKeyEvents: true

        });

        // denominacion  para add y  mod tipo cta bancaria
        this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacion',
            //fieldLabel : 'Denominaci&oacute;n',
            fieldLabel: idioma.lbTitDenom,
            msgTarget: 'qtip',
            name: 'denominacion',
            //name:'descripcion',
            selectOnFocus: true,
            maxLength: 255,
            allowBlank: false,
            blankText: idioma.lbMsgReq,
            // regexText: idioma.lbCampoDenomctaregexText,
                    //maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
                    //regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, 

                    //  maskRe :/^([0-9a-zA-Z \"\-\_\/\(\)\xf3\xf1\xe1\xe9\xed\xfa\xd1-]+ ?[0-9a-zA-Z]*)+$/,  // Solo letras, n?meros y espacios y  algunos caracteres especiales ( - , _ , ( , ) , / , " )
            // regex: /^[0-9a-zA-Z\"\-\_\/\(\)\xf3\xf1\xe1\xe9\xed\xfa\xd1-]+ ?[0-9a-zA-Z\"\-\_\/\(\)\xf3\xf1\xe1\xe9\xed\xfa\xd1-\s]*$/,
            // maxLengthText:'El tama&ntilde;o m&aacute;ximo requerido es de 255 caracteres.',
            maxLengthText: idioma.lbCampomaxLengthText255,
            anchor: '100%',
            enableKeyEvents: true
        });


        // Formulario Add y Mod Documento
        this.fpTipoCtaB = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            layout: 'form',
            border: false,
            bodyStyle: 'padding:5px 5px 5px 5px',
            trackResetOnLoad: true,
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .3,
                            layout: 'form',
                            items: this.tfcodigo
                        }, {
                            columnWidth: .7,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: this.tfdenominacion
                        }]
                }]
        });

        //ventana add y mod documento
        this.winTipoCtaB = new Ext.Window({
            autoValidate: false,
            bodyStyle: 'padding:5px 5px 5px',
            //title : 'Adicionar tipo de cuenta',
            title: idioma.lbTitleAddTipoCta,
            width: 500,
            height: 170,
            layout: 'fit',
            modal: true,
            constrain: true,
            closeAction: 'hide',
            resizable: true,
            frame: true,
            items: this.fpTipoCtaB,
            buttons: [this.btnCancelar = new Ext.Button({
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    tooltip: idioma.lbBtnTooltipCancelar,
                    text: idioma.lbBtnCancelar
                }), this.btnAplicar = new Ext.Button({
//                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'aplicar',
                    tooltip: idioma.lbBtnTooltipAplicar,
                    text: idioma.lbBtnAplicar
                }), this.btnAceptar = new Ext.Button({
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    tooltip: idioma.lbBtnTooltipAceptar,
                    text: idioma.lbBtnAceptar
                })]
        });

        //FIN DE LA VENTANA ADD y  MOD tipo cta  bancaria 

        // VENTANA DEL  HEREDAR
        // GridPanel para los estados de cuentas del  tab en pesta�a 1
        this.gpHeredar = new Ext.grid.GridPanel({
            frame: true,
            resizable: true,
            stripeRows: true,
            autoScroll: true,
            collapsible: true,
//            loadMask: true,
            autoExpandColumn: 'expandir',
            store: model.stHeredar,
            sm: new Ext.grid.CheckboxSelectionModel({
                singleSelect: false
            }),
            /*loadMask: {
             store: model.stHeredar
             },*/
            columns: [new Ext.grid.CheckboxSelectionModel(),
                {
                    hidden: true,
                    dataIndex: 'idtipocuenta',
                    hideable: false
                }, {
                    id: 'expandir',
                    header: idioma.lbTitCodigo,
                    width: 250,
                    dataIndex: 'codigo',
                    sortable: true
                }, {
                    header: idioma.lbTitDenom,
                    width: 600,
                    dataIndex: 'denominacion',
                    sortable: true
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'version'
                }, {
                    header: "Entidad",
                    width: 0,
                    dataIndex: 'idestructuracomun',
                    hidden: true
                }],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: model.stHeredar,
                displayInfo: true,
                displayMsg: idioma.lbMsgDisplay,
                emptyMsg: idioma.lbMsgEmpty
            })
        });

        // ventana del  heredar
        this.winHeredar = new Ext.Window({
            //bodyStyle : 'padding:5px 5px 5px',
            //title:'Heredar tipo de cuenta bancaria',
            title: idioma.lbTitleHerTipoCta,
            width: 800,
            height: 500,
            layout: 'fit',
            modal: true,
            constrain: true,
            closeAction: 'hide',
            resizable: true,
            frame: true,
            items: this.gpHeredar,
            buttons: [this.btnCancelarH = new Ext.Button({
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    tooltip: idioma.lbBtnTooltipCancelar,
                    text: idioma.lbBtnCancelar
                }), this.btnAplicarH = new Ext.Button({
//                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'aplicar',
                    tooltip: idioma.lbBtnTooltipAplicar,
                    text: idioma.lbBtnAplicar,
                    disabled: true
                }), this.btnAceptarH = new Ext.Button({
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    tooltip: idioma.lbBtnTooltipAceptar,
                    text: idioma.lbBtnAceptar,
                    disabled: true
                })]
        });
        //FIN DE LA VENTANA HEREDAR
    }
};

/*

//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil
perfil.etiquetas = Object();

UCID.portal.cargarEtiquetas('tipoctabancaria', function() {

    //Inicializar el modelo
    var model = Banco.Tipoctabancaria.Model;
    model.init();

    //Inicializar la vista.
    var view = Banco.Tipoctabancaria.View;
    view.init(perfil.etiquetas, model);

    //Inicializar controlador.
//    /var controller = Banco.Tipoctabancaria.Controller;
    Banco.Tipoctabancaria.Controller.init(perfil.etiquetas, view, model);
    //controller.loadDataIni();
});

*/

//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil;

Ext.Ajax.request({
        method : "POST", 
        url : "cargaretiquetas",
		 callback : function(options, success, response)
        {
		   var etiquetas = Ext.decode(response.responseText);
		   
		   //Inicializar el modelo
		   var model = Banco.Tipoctabancaria.Model;
		   model.init();

		   //Inicializar la vista.
		   var view = Banco.Tipoctabancaria.View;
		   view.init( etiquetas, model);

		   //Inicializar controlador.
		   //var controller = Banco.Tipoctabancaria.Controller;
		   Banco.Tipoctabancaria.Controller.init(etiquetas, view, model);
		  //controller.loadDataIni();
	  }
 });




