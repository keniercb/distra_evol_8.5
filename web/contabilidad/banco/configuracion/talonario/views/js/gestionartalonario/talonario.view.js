//Empaquetando el componente talonario.
Ext.ns('Banco.Talonario');

//Vista del componente Documento.
Banco.Talonario.View = {
    /**
     * Inicializar la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU .
     * @param model Modelo de la vista del componente Talonario ).
     */
    init: function(idioma, model) {

        //Me dice si hay alguna ventana abierta
        this.windowopen = false;
        //para cargar los datos del modificar
        this.action = false;

        // boton adicionar talonario
        this.btnAdicionar = new Ext.Button({
            //tooltip: "Adicionar tipo de documento (<b>Alt+A</b>)",
            tooltip: idioma.lbTooltipAdd,
            text: idioma.lbBtnAdicionar,
            selectOnFocus: true,
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar'/*,
             disabled: true*/,
            abreviatura: 'add_talonario'

        });
        validate.addButton(this.btnAdicionar);

        // boton modificar talonario
        this.btnModificar = new Ext.Button({
            //tooltip: "Modificar tipo de documento (<b>Alt+M</b>)",
            tooltip: idioma.lbTooltipMod,
            text: idioma.lbBtnModificar,
//            icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            disabled: true,
            abreviatura: 'add_talonario'

        });
        validate.addButton(this.btnModificar);

        // boton eliminnar talonario
        this.btnEliminar = new Ext.Button({
            //tooltip: "Eliminar tipo de documento (<b>Alt+E<b>)",
            tooltip: idioma.lbTooltipElim,
            text: idioma.lbBtnEliminar,
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            disabled: true,
            abreviatura: 'del_talonario'

        });
        validate.addButton(this.btnEliminar);

        //boton graficar talonario
        this.btnGraficar = new Ext.Button({
            //tooltip: 'Graficar talonarios por estado (<b>Alt+G</b>)',
            tooltip: idioma.lbTooltipGraf,
            text: idioma.lbBtnGraficar,
//            icon: perfil.dirImg + 'planificacion.png',
            iconCls: 'graficar',
            abreviatura: 'graficar_talonario'

        });
        validate.addButton(this.btnGraficar);

        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();

        // boton ayuda talonario
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudatalonario',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            tooltip: idioma.lbTooltipAyuda,
            text: idioma.lbBtnAyuda
        });

        this.showImage = function(value, metaData, record, rowIndex, colIndex, store) {
            if (record.data.estado === 1) {
                metaData.attr = 'ext:qtip="' + '<b>Talonario en uso</b>"';
                return '<img src="' + value + '" alt="' + record.get('imgestado') + '" style="width:16px">';
            } else if (record.data.estado === 0) {
                metaData.attr = 'ext:qtip="' + '<b>Talonario agotado</b>"';
                return '<img src="' + value + '" alt="' + record.get('imgestado') + '" style="width:16px">';
            } else {
                metaData.attr = 'ext:qtip="' + '<b>Talonario disponible</b>"';
                return '';
            }
        };

        this.gpTalonario = new Ext.grid.GridPanel({
            border: false,
            stripeRows: true,
            autoScroll: true,
            autoExpandColumn: 'expandir',
            store: model.stTalonario,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {
                store: model.stTalonario
            },
            columns: [{
                    header: idioma.lbOrden,
                    width: 20,
                    dataIndex: 'orden',
                    align: 'center',
                    sortable: true
                }, {
                    id: 'expandir',
                    header: idioma.lbTitCodigo,
                    width: 250,
                    hidden: true,
                    hideable: false,
                    dataIndex: 'numerocta',
                    sortable: true
                }, {
                    header: idioma.lbTitDenom,
                    width: 600,
                    hidden: true,
                    hideable: false,
                    dataIndex: 'nombrecta'                    
                }, {
                    header: idioma.lbTipodoc,
                    dataIndex: 'documento',
                    sortable: true
                }, {
                    header: idioma.lbNuminicio,
                    width: 30,
                    align: 'right',
                    dataIndex: 'numeroinicio'
                }, {
                    header: idioma.lbNumfin,
                    width: 30,
                    align: 'right',
                    dataIndex: 'numerofin'
                }, {
                    header: idioma.lbDisponible,
                    width: 30,
                    align: 'right',
                    dataIndex: 'disponible'
                }, {
                    header: 'text',
                    dataIndex: 'text',
                    hidden: true,
                    hideable: false
                }, {
                    header: idioma.lbEstado,
                    align: 'center',
                    hidden: true,
                    hideable: false,
                    width: 20,
                    dataIndex: 'estado'
                }, {
                    header: 'Estado',
                    align: 'center',
                    renderer: this.showImage,
                    width: 20,
                    dataIndex: 'imgestado'
                }, {
                    header: 'idtalonario',
                    dataIndex: 'idtalonario',
                    hidden: true,
                    hideable: false
                }, {
                    header: 'idcuentabancaria',
                    dataIndex: 'idcuentabancaria',
                    hidden: true,
                    hideable: false
                }, {
                    header: 'idparteformato',
                    dataIndex: 'idparteformato',
                    hidden: true,
                    hideable: false
                }, {
                    header: 'tipodocumentos',
                    dataIndex: 'tipodocumentos',
                    hidden: true,
                    hideable: false
                }
            ],
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnGraficar, '->', this.btnAyuda,'<p></p>'],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                showGroupName: false,
                enableNoGroups: false, // REQUIRED!
                hideGroupedColumn: true,
                groupTextTpl: '{[values.rs[0].data.text]}'  // '{text} {[values.rs[0].data.codigo]}'
            }),
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: model.stTalonario,
                displayInfo: true
            })
        });

        //Vista general del talonario
        new Ext.Viewport({
            layout: 'fit',
            items: this.gpTalonario
        });

        /*
         *componente add y mod talonario
         **/

        //combo formato de talonario   
        this.cbformato = new Ext.form.ComboBox({
            id: 'cbformato',
            //emptyText: idioma.lbNEemptyText,
            fieldLabel: idioma.lbFormato,
            resizable: true,
            forceSelection: true,
            editable: true,
            store: model.stformato,
            valueField: 'idparteformato',
            displayField: 'nombre',
            typeAhead: true,
            enableKeyEvents: true,
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '98%',
            tabIndex: 1
        });

        //numero de inicio del talonario
        this.tfnuminicio = new Ext.form.TextField({
            id: 'tfnuminicio',
            fieldLabel: idioma.lbNuminicio,
            anchor: '97%',
            maxLength: 16,
            style: 'text-align:right;',
            maskRe: /^([0-9]+ ?[0-9]*)+$/, // Solo numeros y sin decimales
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: idioma.lbSoloNumregexText,
            allowNegative: false,
            allowDecimals: false,
            allowBlank: false,
            enableKeyEvents: true,
            selectOnFocus: true,
            tabIndex: 2
        });

        //numero de fin del talonario
        this.tfnumfinal = new Ext.form.TextField({
            id: 'tfnumfinal',
            fieldLabel: idioma.lbNumfin,
            maxLength: 16,
            anchor: '100%',
            maskRe: /^([0-9]+ ?[0-9]*)+$/, // Solo n?meros y sin decimales
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: idioma.lbSoloNumregexText,
            style: 'text-align:right;',
            allowNegative: false,
            allowDecimals: false,
            allowBlank: false,
            enableKeyEvents: true,
            selectOnFocus: true,
            tabIndex: 3
        });

        this.tfdisponibles = new Ext.form.NumberField({
            fieldLabel: idioma.lbDisponible,
            name: 'disponibles',
            id: 'tfdisponibles',
            style: 'text-align:right;',
            readOnly: true,
            allowBlank: false,
            anchor: '100%',
            tabIndex: 5
        });

        this.cbcuentaBanc = new Ext.form.ComboBox({
            id: 'cbcuentaBanc',
            lbNEemptyText: idioma.lbNEemptyText,
            fieldLabel: idioma.lbCtabancaria,
            tpl: '<tpl for="."><div ext:qtip="{nombrecuentabancaria}" class="x-combo-list-item">{nombrecuentabancaria}</div></tpl>', // Paramostrar los datos como detalle
            resizable: true,
            forceSelection: true,
            editable: true,
            store: model.stctaBancaria,
            valueField: 'idcuentabancaria',
            displayField: 'nombrecuentabancaria',
            hiddenName: 'idcuentabancaria',
            typeAhead: true,
            enableKeyEvents: true,
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '99%',
            tabIndex: 4
        });

        this.spinner = new Ext.form.SpinnerField({
            id: 'spinner',
            fieldLabel: idioma.lbOrdenUso,
            enableKeyEvents: true,
            allowBlank:false,
            maskRe: /^[0-9]$/,
            minValue: 1,
            value: 1
        });

        //muestra los tipos de documentos
        this.gptipodoc = new Ext.grid.GridPanel({
            title: idioma.lbTiposdoc,
            store: model.sttipodoc,
            sm: new Ext.grid.CheckboxSelectionModel({
                singleSelect: true
            }),
            frame: true,
            autoExpandColumn: 'denominacion',
            height: 290,
            columns: [new Ext.grid.CheckboxSelectionModel(),
                {
                    header: idioma.lbcodigo,
                    width: 200,
                    sortable: true,
                    dataIndex: 'codigo'
                },
                {
                    id: 'denominacion',
                    header: idioma.lbdenominacion,
                    width: 250,
                    sortable: true,
                    dataIndex: 'denominacion'
                }
            ]
        });

        //agrupa los campos de add y mod talonario
        this.fpTalonario = new Ext.FormPanel({
            frame: true,
            labelAlign: 'top',
            height: 400,
            trackResetOnLoad: true,
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.cbformato]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [this.tfnuminicio]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [this.tfnumfinal]
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            columnWidth: .75,
                            layout: 'form',
                            items: [this.cbcuentaBanc]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [this.tfdisponibles]
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'form',
                            items: this.spinner
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'fit',
                            items: [this.gptipodoc]
                        }]
                }]
        });

        //ventana add y mod talonario
        this.winTalonario = new Ext.Window({
            autoValidate: false,
            bodyStyle: 'padding:5px 5px 5px',
            width: 700,
            border: false,
            autoHeight: true,
            layout: 'fit',
            modal: true,
            closeAction: 'hide',
            resizable: true,
            minWidth: 360,
            frame: true,
            constrain: true,
            items: this.fpTalonario,
            buttons: [this.btnCancelar = new Ext.Button({
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    tooltip: idioma.lbBtnTooltipCancelar,
                    text: idioma.lbBtnCancelar,
                    tabIndex: 5
                }), this.btnAplicar = new Ext.Button({
//                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'aplicar',
                    tooltip: idioma.lbBtnTooltipAplicar,
                    text: idioma.lbBtnAplicar,
                    tabIndex: 6
                }), this.btnAceptar = new Ext.Button({
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    tooltip: idioma.lbBtnTooltipAceptar,
                    text: idioma.lbBtnAceptar,
                    tabIndex: 7
                })]
        });

        //muestra el grafico de los talonarios
        this.winGraficar = new Ext.Window({
            title: idioma.lbTitleEstado,
            height: 550,
            bodyStyle: 'padding:10px 7px 10px 7px',
            html: '<div id="container" style="width: 720px; height: 500px; margin: 0 auto"></div>',
            layout: 'fit',
            modal: true,
            closeAction: 'hide',
            resizable: false,
            width: 750,
            constrain: true
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

    }
};

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
        var model = Banco.Talonario.Model;
        model.init();

        //Inicializar la vista.
        var view = Banco.Talonario.View;
        view.init(etiquetas, model);

        //Inicializar controlador.
        Banco.Talonario.Controller.init(etiquetas, view, model);
    }
});

