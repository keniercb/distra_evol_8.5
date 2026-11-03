//Empaquetando el componente tipo documento.
Ext.ns('Banco.Documento');

//Vista del componente Documento.
Banco.Documento.View = {
    /**
     * Inicializar la vista.
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param model Modelo de la vista del componente Usuario (Tipo: Sauxe.CasoEstudio.Usuario.Modelo).
     */
    init: function (idioma, model) {

        //Me dice si hay alguna ventana abierta
        this.windowopen = false;

        // boton adicionar documento
        this.btnAdicionar = new Ext.Button({
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.lbTooltipAdicionar,
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            abreviatura: 'add_instrumentopago'

        });
        validate.addButton(this.btnAdicionar);

        // boton modificar documento
        this.btnModificar = new Ext.Button({
            text: idioma.lbBtnModificar,
            tooltip: idioma.lbTooltipModificar,
//            icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            disabled: true,
            abreviatura: 'add_instrumentopago'

        });
        validate.addButton(this.btnModificar);

        // boton eliminnar documento
        this.btnEliminar = new Ext.Button({
            text: idioma.lbBtnEliminar,
            tooltip: idioma.lbTooltipEliminar,
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            disabled: true,
            abreviatura: 'del_instrumentopago'

        });
        validate.addButton(this.btnEliminar);

        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();
        // boton ayuda documento
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudainstpago',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            tooltip: idioma.lbTooltipAyuda,
            text: idioma.lbBtnAyuda
        });
        //da formato a varias columnas del listado de los documentos
        this.ChangeVal = function (val) {
            if (val)
                return '<span style="color:red;font-size:12px"> Si </span>';
            else
                return '<span style="color:#000099;font-size:12px"> No </span>';
        };
        //grid documentos
        this.gpdocumentos = new Ext.grid.GridPanel({
            border: false,
            stripeRows: true,
            autoExpandColumn: 'expandir',
            store: model.stTipoDocumentos,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {
                store: model.stTipoDocumentos
            },
            columns: [{
                hidden: true,
                dataIndex: 'idtipodoctalonario',
                hideable: false
            }, {
                //header : 'Denominaci&oacute;n',
                header: idioma.lbTitDenom,
                width: 250,
                id: 'expandir',
                dataIndex: 'denominacion',
                sortable: true
            }, {
                //header : 'C&oacute;digo',
                header: idioma.lbTitCodigo,
                width: 75,
                dataIndex: 'codigo',
                sortable: true,
                align: 'center'
            }, {
                //header : 'Importe m&iacute;nimo',
                header: idioma.lbTitImportmin,
                width: 120,
                dataIndex: 'importemin',
                sortable: true,
                renderer: 'erpMoneyParentesis',
                align: 'right'
            }, {
                //header : 'Importe m&aacute;ximo',
                header: idioma.lbTitImportmax,
                width: 120,
                dataIndex: 'importemax',
                sortable: true,
                renderer: 'erpMoneyParentesis',
                align: 'right'
            }, {
                //header : 'Importe certificar',
//					header : idioma.lbTitImportcer,
                header: idioma.lbTipooblig,
                width: 180,
                dataIndex: 'importecertifica',
                sortable: true,
                renderer: 'erpMoneyParentesis',
                align: 'right'
            }, {
                //header : 'Vigencia',
                header: idioma.lbTitVig,
                width: 70,
                dataIndex: 'vigencia',
                sortable: true,
                align: 'center'
            }, {
                //header : 'Cobro',
                header: idioma.lbTitCobro,
                width: 60,
                dataIndex: 'cobro',
                sortable: true,
                renderer: this.ChangeVal,
                align: 'center'
            }, {
                //header : 'Talonario',
                header: idioma.lbTitTalonario,
                dataIndex: 'talonariocobro',
                width: 70,
                renderer: this.ChangeVal,
                align: 'center'
            }, {
                //header : 'Pago',
                header: idioma.lbTitPago,
                width: 60,
                dataIndex: 'pago',
                sortable: true,
                renderer: this.ChangeVal,
                align: 'center'
            }, {
                //header : 'Talonario',
                header: idioma.lbTitTalonario,
                width: 70,
                dataIndex: 'talonario',
                renderer: this.ChangeVal,
                align: 'center'
            }, {
                //header : 'Certifica',
                header: idioma.lbTitCertifica,
                id: 'idcertifica',
                width: 70,
                dataIndex: 'certifica',
                renderer: this.ChangeVal,
                align: 'center'
            }],
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, '->', this.btnAyuda, '<p></p>'],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: model.stTipoDocumentos,
                displayInfo: true
            })
        });
        //pintar los documentos en uso
        this.gpdocumentos.getView().getRowClass = function (record) {
            if (record.get('asociado'))
                return 'FilaVerde';
        };

        //Vista general del Documento
        new Ext.Viewport({
            layout: 'fit',
            items: [this.gpdocumentos]
        });

        /*
         *componente add y mod Documento
         **/

        //combo tipo Documento
        this.cbTipodoc = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbTipodoc',
            fieldLabel: idioma.lbTipodoc,
            mode: 'local',
            hiddenName: 'iddoc',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            resizable: true,
            //emptyText:'Seleccione...',
            emptyText: idioma.lbEmptyText,
            store: model.stCbTipodoc,
            valueField: 'iddoc',
            displayField: 'denominacion',
            forceSelection: true,
            editable: true,
            typeAhead: true,
            regexText: idioma.regexText,
            allowBlank: false,
            anchor: '95%',
            triggerAction: 'all',
            enableKeyEvents: true,
            tabIndex: 1
        });

        // Periodo de vigencia del Documento
        this.tfvigencia = new Ext.form.TextField({
            id: 'tfvigencia',
            fieldLabel: idioma.lbTitVig,
            maxLength: 4,
            maxLengthText: idioma.maxLengthText,
            maskRe: /^[0-9]$/,
            regex: /^[0-9]+$/,
            regexText: idioma.maxLengthText,
            msgTarget: 'qtip',
            allowBlank: false,
            selectOnFocus: true,
            width: '95%',
            disabled: false,
            enableKeyEvents: true,
            tabIndex: 2
        });

        // Importe minimo del instrumento de un instrumento de pago
        this.tfImporteMin = new Ext.form.TextField({
            id: 'tfImporteMin',
            //fieldLabel: 'Importe m&iacute;nimo',
            fieldLabel: idioma.lbTitImportmin,
            style: 'text-align:right',
            maxLength: 19,
            maxLengthText: idioma.regexTextnum,
            maskRe: /^([0-9.] ?[0-9.]*)+$/,
            regex: /^([0-9.] ?[0-9.]*)+$/,
            regexText: idioma.regexTextnum,
            disabled: false,
            allowBlank: false,
            width: '95%',
            selectOnFocus: true,
            enableKeyEvents: true,
            tabIndex: 3
        });

        // Importe maximo del instrumento de un instrumento de pago
        this.tfImporteMax = new Ext.form.TextField({
            id: 'tfImporteMax',
            //fieldLabel: 'Importe m&aacute;ximo',
            fieldLabel: idioma.lbTitImportmax,
            style: 'text-align:right',
            maxLength: 19,
            maxLengthText: idioma.regexTextnum,
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            regex: /^([0-9.]+ ?[0-9.]*)+$/,
            regexText: idioma.regexTextnum,
            disabled: false,
            allowBlank: false,
            width: '95%',
            selectOnFocus: true,
            enableKeyEvents: true,
            tabIndex: 4
        });

        // si el Documento es para instrumentos de cobro
        this.ckbCobro = new Ext.form.Checkbox({
            id: 'ckbCobro',
            hideLabel: true,
            //boxLabel : 'Cobro',//perfil.etiquetas.lbchkAvalada,
            boxLabel: idioma.lbTitCobro,
            disabled: false,
            inputValue: 1,
            tabIndex: 5
        });
        // si el Documento (cobro) tiene talonarios
        this.ckbTalcobro = new Ext.form.Checkbox({
            id: 'ckbTalcobro',
            hideLabel: true,
            //boxLabel : 'Talonario',//perfil.etiquetas.lbchkAvalada,
            boxLabel: idioma.lbTitTalonario,
            disabled: false,
            inputValue: 1,
            tabIndex: 6
        });

        // si el Documento es para instrumentos de pago
        this.ckbPago = new Ext.form.Checkbox({
            id: 'ckbPago',
            hideLabel: true,
            //boxLabel : 'Pago',//perfil.etiquetas.lbchkAvalada,
            boxLabel: idioma.lbTitPago,
            disabled: false,
            inputValue: 2,
            tabIndex: 7
        });

        // si el Documento tiene talonarios para PAGO
        this.ckbTalpago = new Ext.form.Checkbox({
            id: 'ckbTalpago',
            hideLabel: true,
            //boxLabel : 'Talonario',//perfil.etiquetas.lbchkAvalada,
            boxLabel: idioma.lbTitTalonario,
            disabled: false,
            inputValue: 1,
            tabIndex: 8
        });

        // si el Documento se utiliza para certificar
        this.ckbcertifica = new Ext.form.Checkbox({
            id: 'ckbcertifica',
            hideLabel: true,
            //boxLabel : 'Certifica documento'//perfil.etiquetas.lbchkAvalada,
            boxLabel: idioma.lbTitCertificadoc,
            tabIndex: 10
        });

        // Importe maximo a partir del cual es obligatorio certificar
        this.tfImporteCertf = new Ext.form.TextField({
            id: 'tfImporteCertf',
            //fieldLabel: 'Importe obligatorio certificar',
            fieldLabel: idioma.lbTipooblig,
            style: 'text-align:right',
            maxLength: 19,
            maxLengthText: idioma.regexTextnum,
            value: '0.00',
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            regex: /^([0-9.]+ ?[0-9.]*)+$/,
            regexText: idioma.regexTextnum,
            width: '98%',
            enableKeyEvents: true,
            selectOnFocus: true,
            tabIndex: 9
        });

        this.fpDocumento = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            trackResetOnLoad: true,
            layout: 'form',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.cbTipodoc]
                        },
                        {
                            style: 'margin: 0 0 0 5',
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.tfvigencia]
                        },
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.tfImporteMin]
                        },
                        {
                            style: 'margin: 0 0 0 5',
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.tfImporteMax]
                        },
                    ]
                },
                {
                    layout: 'column',
                    xtype: 'fieldset',
                    autoHeight: true,
                    title: 'Entrada/Salida <b style="color:red">*</b>',
                    items: [
                        {
                            xtype: 'fieldset',
                            title: idioma.lbTitEntrada,
                            anchor: '95%',
                            columnWidth: .5,
                            autoHeight: true,
                            layout: 'column',
                            items: [{
                                layout: 'form',
                                style: 'margin: -5 0 0 5',
                                columnWidth: .4,
                                items: this.ckbCobro
                            },
                                {
                                    layout: 'form',
                                    style: 'margin: -5 0 0 15',
                                    columnWidth: .6,
                                    items: this.ckbTalcobro
                                }]
                        },
                        {
                            xtype: 'fieldset',
                            //title: 'Salida',
                            title: idioma.lbTitSalida,
                            anchor: '95%',
                            columnWidth: .5,
                            style: 'margin: 0 0 0 10',
                            autoHeight: true,
                            layout: 'column',
                            items: [{
                                layout: 'form',
                                style: 'margin: -5 0 0 5',
                                columnWidth: .4,
                                items: this.ckbPago
                            },
                                {
                                    layout: 'form',
                                    style: 'margin: -5 0 0 15',
                                    columnWidth: .6,
                                    items: this.ckbTalpago
                                }]
                        },
                    ]
                },
                {
                    layout: 'column',
                    xtype: 'fieldset',
                    autoHeight: true,
                    title: idioma.lbTitCertificacion,
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.tfImporteCertf]
                        },
                        {
                            style: 'margin: -5 0 0 20',
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.ckbcertifica]
                        },
                    ]
                },
            ]
        });

        // Formulario Add y Mod Documento
        // this.fpDocumento = new Ext.FormPanel({
        //     labelAlign: 'top',
        //     frame: true,
        //     trackResetOnLoad: true,
        //     layout: 'form',
        //     items: [{
        //         layout: 'column',
        //         items: [{
        //             columnWidth: .5,
        //             layout: 'form',
        //             items: [this.cbTipodoc, this.tfImporteMin,
        //                 {
        //                     xtype: 'fieldset',
        //                     //title: 'Entrada',
        //                     title: idioma.lbTitEntrada,
        //                     anchor: '95%',
        //                     autoHeight: true,
        //                     layout: 'column',
        //                     items: [{
        //                         layout: 'form',
        //                         style: 'margin: -5 0 0 5',
        //                         columnWidth: .4,
        //                         items: this.ckbCobro
        //                     },
        //                         {
        //                             layout: 'form',
        //                             style: 'margin: -5 0 0 15',
        //                             columnWidth: .6,
        //                             items: this.ckbTalcobro
        //                         }]
        //                 }]
        //         }, {
        //             columnWidth: .5,
        //             layout: 'form',
        //             items: [this.tfvigencia, this.tfImporteMax,
        //                 {
        //                     xtype: 'fieldset',
        //                     //title: 'Salida',
        //                     title: idioma.lbTitSalida,
        //                     anchor: '95%',
        //                     autoHeight: true,
        //                     layout: 'column',
        //                     items: [{
        //                         layout: 'form',
        //                         style: 'margin: -5 0 0 5',
        //                         columnWidth: .4,
        //                         items: this.ckbPago
        //                     },
        //                         {
        //                             layout: 'form',
        //                             style: 'margin: -5 0 0 15',
        //                             columnWidth: .6,
        //                             items: this.ckbTalpago
        //                         }]
        //                 }]
        //         }]
        //     }, {
        //         layout: 'form',
        //         items: [{
        //             xtype: 'fieldset',
        //             //title:'Certificaci&oacute;n',
        //             title: idioma.lbTitCertificacion,
        //             anchor: '98%',
        //             autoHeight: true,
        //             layout: 'column',
        //             items: [{
        //                 layout: 'form',
        //                 style: 'margin: 0 0 0 0',
        //                 columnWidth: .5,
        //                 items: this.tfImporteCertf
        //             },
        //                 {
        //                     layout: 'form',
        //                     style: 'margin: -5 0 0 20',
        //                     columnWidth: .5,
        //                     items: this.ckbcertifica
        //                 }]
        //         }]
        //     }]
        // });

        //ventana add y mod documento
        this.winDocumento = new Ext.Window({
            autoValidate: false,
            bodyStyle: 'padding:5px 5px 5px',
            width: 440,
            height: 360,
            layout: 'fit',
            modal: true,
            closeAction: 'hide',
            resizable: true,
            frame: true,
            constrain: true,
            items: this.fpDocumento,
            buttons: [this.btnCancelar = new Ext.Button({
//                    icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                tooltip: idioma.lbBtnTooltipCancelar,
                text: idioma.lbBtnCancelar,
                tabIndex: 11
            }), this.btnAplicar = new Ext.Button({
//                    icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'aplicar',
                tooltip: idioma.lbBtnTooltipAplicar,
                text: idioma.lbBtnAplicar,
                tabIndex: 12
            }), this.btnAceptar = new Ext.Button({
//                    icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                tooltip: idioma.lbBtnTooltipAceptar,
                text: idioma.lbBtnAceptar,
                tabIndex: 13
            })]
        });

        //para las teclas de acceso rapido
        this.globalKeyMap = new Ext.KeyMap(document);
        this.globalKeyMap.accessKey = function (key, handler, scope) {
            var h = function (n, e) {
                e.preventDefault();
                handler.call(scope || this, n, e);
            };
            this.on(key, h, scope);
        };

    }
};
/*
//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil
perfil.etiquetas = Object();

UCID.portal.cargarEtiquetas('tipodocumento', function() {

    //Inicializar el modelo
    var model = Banco.Documento.Model;
    model.init();

    //Inicializar la vista.
    var view = Banco.Documento.View;
    view.init(perfil.etiquetas, model);

    //Inicializar controlador.
    var controller = Banco.Documento.Controller;
    Banco.Documento.Controller.init(perfil.etiquetas, view, model, controller);
});
*/

//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil;

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        var etiquetas = Ext.decode(response.responseText);

        //Inicializar el modelo
        var model = Banco.Documento.Model;
        model.init();

        //Inicializar la vista.
        var view = Banco.Documento.View;
        view.init(etiquetas, model);

        //Inicializar controlador.
        var controller = Banco.Documento.Controller;
        Banco.Documento.Controller.init(etiquetas, view, model, controller);

    }
});


