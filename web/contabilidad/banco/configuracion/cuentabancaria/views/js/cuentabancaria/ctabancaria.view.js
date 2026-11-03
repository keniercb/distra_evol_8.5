//Empaquetando el componente Ctabancaria.
Ext.ns('Banco.Ctabancaria');

//Controller del componente Ctabancaria.
Banco.Ctabancaria.View = {
    /**
     * Inicializar la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param model Modelo de la vista del componente Ctabancaria.
     */
    init: function(idioma, model) {

        // boton adicionar cta bancaria
        this.btnAdicionar = new Ext.Button({
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.lbTooltipAddCtaBancaria,
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            abreviatura: 'add_cuentabancaria'

        });
        validate.addButton(this.btnAdicionar);
        // boton modificar cta bancaria
        this.btnModificar = new Ext.Button({
            text: idioma.lbBtnModificar,
            tooltip: idioma.lbTooltipModCtaBancaria,
//            icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            disabled: true,
            abreviatura: 'add_cuentabancaria'

        });
        validate.addButton(this.btnModificar);
        // boton eliminnar cta bancaria
        this.btnEliminar = new Ext.Button({
            text: idioma.lbBtnEliminar,
            tooltip: idioma.lbTooltipElimCtaBancaria,
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            disabled: true,
            abreviatura: 'del_cuentabancaria'

        });
        validate.addButton(this.btnEliminar);
        // boton ver cta bancaria
        this.btnVer = new Ext.Button({
            text: idioma.lbbtnVer,
            tooltip: idioma.lbTooltipVerDetalles,
//            icon: perfil.dirImg + 'ver.png',
            iconCls: 'ver',
            disabled: true,
            abreviatura: 'ver_cuentabancaria'

        });
        validate.addButton(this.btnVer);

        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();
        // boton ayuda de la funcionalidad
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudacuentabancaria',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            tooltip: idioma.lbTooltipAyudaCtaBancaria,
            text: idioma.lbBtnAyuda
        });
        //label disponibilidad de efectivo
        this.lbDispEfectivo = new Ext.form.Label({
            text: idioma.lbDispEfectivo,
            style: 'font-style: italic;font-weight: bold;'
        });

        //panel con la barra de botones al norte
        this.pBotones = new Ext.Panel({
            region: 'north',
            border: false,
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnVer, '->', this.btnAyuda]
        });

        //da formato a la columna Cerrada del listado de los documentos
        this.ChangeVal = function(val) {
            if (val == 1) {
                return '<span style="color:red;font-size:12px">' + idioma.lbMsgSi + '</span>';
            } else if (val == 0) {
                return '<span style="color:green;font-size:12px">' + idioma.lbMsgNo + '</span>';
            }
        };

        this.contextMenu = new Ext.menu.Menu({
            items: [
                {
                    id: 'menuAbrir',
                    iconCls: 'true verde',
                    text: 'Abrir',
                }, {
                    id: 'menuCerrar',
                    iconCls: 'false rojo',
                    text: 'Cerrar',
                }
            ]
        });

        //grid gestionar cta bancarias
        this.gpCtabancaria = new Ext.grid.GridPanel({
            border: false,
//            height: 500,
            region: 'center',
            stripeRows: true,
            autoExpandColumn: 'expandir',
            autoScroll: true,
            store: model.stCtabancaria,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
            loadMask: {
                store: model.stCtabancaria
            },
            columns: [{
                    dataIndex: 'nrocuenta',
                    hideable: false,
                    header: idioma.lbcolCtaBNo,
                    width: 200,
                    sortable: true
                }, {
                    header: idioma.lbcolCtaBNombre,
                    width: 240,
                    id: 'expandir',
                    dataIndex: 'nombrecuentabancaria',
                    sortable: true
                }, {
                    header: idioma.lbcolCtaBSaldoActual,
                    width: 180,
                    dataIndex: 'saldoenbancomo',
                    sortable: true,
                    align: 'right',
                    renderer: formatoMoneda
                }, {
                    header: idioma.lbcolCtaBMoneda,
                    width: 70,
                    dataIndex: 'codigoiso',
                    sortable: true,
                    align: 'center'

                }, {
                    header: idioma.lbcolCtaBApertura,
                    width: 100,
                    dataIndex: 'fechaapertura',
                    sortable: true,
                    align: 'center',
                    type: 'date',
                    dateFormat: 'd/m/Y'
                }, {
                    header: idioma.lbcolCtaBCerrada,
                    width: 80,
                    dataIndex: 'cerrada',
                    renderer: this.ChangeVal,
                    align: 'center',
                    sortable: true
                }, {
                    header: idioma.headerActivada,
                    width: 80,
                    dataIndex: 'activada',
                    renderer: this.ChangeVal,
                    align: 'center',
                    sortable: true
                }, {
                    header: 'Sobregiro',
                    width: 80,
                    dataIndex: 'permitirsobregiro',
                    renderer: this.ChangeVal,
                    align: 'center',
                    sortable: true
                }, {
                    width: 0,
                    dataIndex: 'idestructuracomun',
                    hidden: true,
                    hideable: false
                }, {
                    dataIndex: 'idcuentabancaria',
                    hidden: true,
                    hideable: false
                }],
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnVer, '->', this.lbDispEfectivo, this.btnAyuda],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                showGroupName: false,
                enableNoGroups: false, // REQUIRED!
                hideGroupedColumn: true,
                groupTextTpl: '{[values.rs[0].data.entidad]}'
            }),
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: model.stCtabancaria,
                displayInfo: true
            })
        });

        // GridPanel para las unidades usuarias del  tab en pesta�a 0
        this.gpUnidadesusuarias = new Ext.grid.GridPanel({
            frame: true,
            resizable: true,
            height: 100,
            width: 500,
            autoExpandColumn: 'expandir',
            store: model.stUnidadesusuarias,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {
                store: model.stUnidadesusuarias
            },
            columns: [
                {
                    header: idioma.lbcolUnidadUsuariaCodigo,
                    width: 70,
                    sortable: true,
                    dataIndex: 'codigo'
                }, {
                    header: idioma.lbcolUnidadUsuariaAbrev,
                    width: 150,
                    sortable: true,
                    dataIndex: 'abreviatura'
                }, {
                    header: idioma.lbcolUnidContNombre,
                    width: 150,
                    sortable: true,
                    dataIndex: 'denominacion',
                    id: 'expandir'
                }
            ]
        });

        // GridPanel para los estados de cuentas del  tab en pesta�a 1
        this.gpEstadocta = new Ext.grid.GridPanel({
            height: 100,
            width: 500,
            autoScroll: false,
            frame: true,
            resizable: true,
            autoExpandColumn: 'expandir',
            store: model.stEstadocta,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {
                store: model.stEstadocta
            },
            columns: [
                {
                    header: idioma.lbcolEstadoCtaNo,
                    width: 80,
                    sortable: true,
                    dataIndex: 'nroestado'
                },
                {
                    header: idioma.lbcolEstadoCtaFecha,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fecha',
                    align: 'center'
                },
                {
                    header: idioma.lbcolEstadoCtaSaldoI,
                    width: 120,
                    sortable: true,
                    dataIndex: 'saldoinicialmo',
                    renderer: formatoMoneda,
                    align: 'right'
                },
                {
                    header: idioma.lbcolEstadoCtaSaldo,
                    width: 100,
                    sortable: true,
                    dataIndex: 'saldofinalmo',
                    renderer: formatoMoneda,
                    align: 'right'
                },
                {
                    id: 'expandir',
                    header: "Contabilizado",
                    width: 100,
                    sortable: true,
                    dataIndex: 'contabilizado'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestadodecuenta',
                    id: 'idestadodecuenta'
                }
            ]
        });

        //pintar las operaciones pertenecientes a la carga inicial
        this.gpEstadocta.getView().getRowClass = function(record, index, rowParams, store) {
            if (record.data.saldoinicialmo == 'Carga inicial') {
                return 'FilaVerde';
            }
        };

        // GridPanel para las operaciones efectuadas del  tab en pesta�a 1
        this.gpOperaciones = new Ext.grid.GridPanel({
            frame: true,
            autoExpandColumn: 'expandir',
            height: 100,
            width: 500,
            autoScroll: false,
            store: model.stOperaciones,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {
                store: model.stOperaciones
            },
            columns: [
                {
                    header: idioma.lbcolOperacionesNoDoc,
                    width: 75,
                    sortable: true,
                    dataIndex: 'numerodocumento'
                }, {
                    header: idioma.lbcolOperacionesTipoDoc,
                    width: 120,
                    sortable: true,
                    dataIndex: 'DenomTipoDoc'
                }, {
                    header: idioma.lbcolOperacionesDescrip,
                    width: 120,
                    sortable: true,
                    dataIndex: 'comentario'
                }, {
                    header: idioma.lbcolEstadoCtaFecha,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fecharecepcion',
                    align: 'center'
                }, {
                    header: idioma.lbcolOperacionesImporte,
                    width: 120,
                    sortable: true,
                    dataIndex: 'importemo',
                    renderer: formatoMoneda,
                    align: 'right'
                }, {
                    id: 'expandir',
                    header: idioma.lbcolOperacionesTipoOper,
                    width: 120,
                    sortable: true,
                    dataIndex: 'nombretipomovimiento'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'iddocumento',
                    id: 'iddocumento'
                }
            ],
            viewConfig: {
                forceFit: true
            }
        });

        //pintar las operaciones pertenecientes a la carga inicial
        this.gpOperaciones.getView().getRowClass = function(record, index, rowParams, store) {
            if (record.data.nombretipomovimiento == idioma.lbCargaInicial)
                return 'FilaVerde';
        };

        //operaciones de la cta bancaria
        this.tpOperaciones = new Ext.TabPanel({
            activeTab: 0,
            frame: true,
            items: [this.tab1 = {
                    id: 'tab1',
                    title: idioma.lbTiTleTabGUnidadCtble,
                    layout: 'fit',
                    items: this.gpUnidadesusuarias
                }, {
                    id: 'tab2',
                    title: idioma.lbTiTleTabGEstadoCta,
                    layout: 'fit',
                    items: this.gpEstadocta
                }, {
                    id: 'tab3',
                    title: idioma.lbTiTleTabGOper,
                    layout: 'fit',
                    items: this.gpOperaciones
                }]
        });

        //operaciones de la cta bancaria
        this.pOperaciones = new Ext.Panel({
            title: idioma.lbTiTleTabG,
            collapsible: true,
            region: 'south',
            split: true,
            height: screen.height / 3.2,
            collapsed: true,
            layout: 'fit',
            items: this.tpOperaciones
        });

        //vp de cta bacnaria
        this.viewPort = new Ext.Viewport({
            layout: 'border',
            items: [/*this.pBotones, */this.gpCtabancaria, this.pOperaciones]
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

        //campos de la ventana adicionar
        this.cbTipocuenta = new Ext.form.ComboBox({
            fieldLabel: idioma.lbCampoTipocta,
            mode: 'local',
            store: model.stTipocuenta,
            tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
            resizable: true,
            //hiddenName:'idtipocuenta',
            emptyText: idioma.lbMsgemptyText,
            valueField: 'idtipocuenta',
            displayField: 'denom',
            editable: true,
            disabledClass: 'disabled-component',
            typeAhead: false,
            allowBlank: false,
            forceSelection: true,
            blankText: idioma.lbMsgReq,
            triggerAction: 'all',
            anchor: '100%',
            enableKeyEvents: true,
            selectOnFocus: true,
            tabIndex: 1
        });

        this.tfNctabancaria = new Ext.form.TextField({
            fieldLabel: idioma.lbcolCtaBNo,
            maxLength: 16,
            resizable: true,
            blankText: idioma.lbMsgReq,
            disabledClass: 'disabled-component',
            // xf3-�, �, �, �, �, �, �, xfc-�  letras,n&uacute;meros  y caracteres especiales '/','-','_','(',')','#'
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\(\)\#]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/,
            //maskRe : /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\(\)\#]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/,

            /* maxLengthText : 'El tama&ntilde;o requerido es de 16 caracteres.',
             maskRe : /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xd3\xc1\xc9\xcd\xda.#-]+ ?[a-zA-Z.#-]*)+$/,
             regex : /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xd3\xc1\xc9\xcd\xda.#-]+ ?[a-zA-Z.#-]*)+$/,
             regexText : 'Este campo solo permite .',*/
            regexText: idioma.lbCampoTipoctaregexText,
            maxLengthText: idioma.LbCampomaxLengthText16,
            allowBlank: false,
            msgTarget: 'qtip',
            anchor: '100%',
            enableKeyEvents: true,
            tabIndex: 2
        });


        this.dfApertura = new Ext.Cont.DateField({
            fieldLabel: idioma.lbCampoFechaApertura,
            allowBlank: false,
            disabledClass: 'disabled-component',
            format: 'd/m/Y',
            msgTarget: 'qtip',
            invalidText: idioma.lbFormatoFecha,
            blankText: idioma.lbMsgReq,
            anchor: '100%',
            enableKeyEvents: true,
            tabIndex: 3
        });

        this.tfNombre = new Ext.form.TextField({
            fieldLabel: idioma.lbcolCtaBNombre,
            maxLength: 60,
            // maskRe : /^([0-9a-zA-Z \"\-\_\/\(\)\xf3\xf1\xe1\xe9\xed\xfa\xd1-]+ ?[0-9a-zA-Z]*)+$/, // Solo letras y n?meros y espacios
            regex: /^([0-9a-zA-Z\.\"\-\_\/\(\)\xf3\xf1\xe1\xe9\xed\xfa\xd1-]+ ?[0-9a-zA-Z]*)+$/,
            maxLengthText: idioma.lbCampomaxLengthText,
            regexText: idioma.lbCampoNombrectaregexText,
            resizable: true,
            blankText: idioma.lbMsgReq,
            allowBlank: false,
            disabledClass: 'disabled-component',
            msgTarget: 'qtip',
            anchor: '100%',
            enableKeyEvents: true,
            tabIndex: 5
        });

        this.cbMoneda = new Ext.form.ComboBox({
            fieldLabel: idioma.lbcolCtaBMoneda,
            mode: 'local',
//            hiddenName: 'idmonedaentidad',
            disabledClass: 'disabled-component',
            //tpl: '<tpl for="."><div ext:qtip="{nombremoneda}" class="x-combo-list-item">{nombremoneda}</div></tpl>',
            resizable: true,
//            emptyText: idioma.lbMsgemptyText,
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            forceSelection: true,
            editable: true,
            typeAhead: true,
            blankText: idioma.lbMsgReq,
            allowBlank: false,
            anchor: '100%',
            triggerAction: 'all',
            enableKeyEvents: true,
            store: model.stMoneda,
            disabled: true,
            tabIndex: 4
        });

        this.chkbSobregiro = new Ext.form.Checkbox({
            // fieldLabel: 'Sobregiro',
            boxLabel: 'Sobregiro',
            hideLabel: true
        });

        this.tfSaldiniBanco = new Ext.form.TextField({
            fieldLabel: idioma.lbCampoSaldoiniBanco,
            blankText: idioma.lbMsgReq,
            maxLength: 19,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: idioma.LbCampomaxLengthText19,
            regexText: idioma.lbSoloNumregexText,
            style: 'text-align:right',
            emptyText: '0.00',
            value:0,
            anchor: '100%',
            disabledClass: 'disabled-component',
            enableKeyEvents: true,
            tabIndex: 6
        });

        this.tfSaldactualBanco = new Ext.form.TextField({
            fieldLabel: idioma.lbCampoSaldoactualBanco,
            blankText: idioma.lbMsgReq,
            maxLength: 19,
            maskRe: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            regex: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            maxLengthText: idioma.LbCampomaxLengthText19,
            regexText: idioma.lbSoloNumregexText,
            style: 'text-align:right',
            emptyText: '0.00',
            disabled: true,
            allowBlank: false,
            disabledClass: 'disabled-component',
            anchor: '100%',
            enableKeyEvents: true
        });

        this.cbBanco = new Ext.form.ComboBox({
            fieldLabel: idioma.lbCampoBanco,
            mode: 'local',
            hiddenName: 'idbanco',
            tpl: '<tpl for="."><div ext:qtip="{banco}" class="x-combo-list-item">{banco}</div></tpl>',
            resizable: true,
            emptyText: idioma.lbMsgemptyText,
            valueField: 'idbanco',
            displayField: 'banco',
            forceSelection: true,
            editable: false,
            typeAhead: true,
            blankText: idioma.lbMsgReq,
            allowBlank: false,
            anchor: '100%',
            triggerAction: 'all',
            enableKeyEvents: true,
            store: model.stBanco,
            tabIndex: 7
        });

        this.tfSaldiniLibro = new Ext.form.TextField({
            fieldLabel: idioma.lbCampoSaldoiniLibro,
            blankText: idioma.lbMsgReq,
            // maskRe:/^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            // regex :/^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            style: 'text-align:right',
            emptyText: '0.00',
            disabled: true,
            disabledClass: 'disabled-component',
            allowBlank: false,
            anchor: '100%'
        });

        this.tfSaldLibro = new Ext.form.TextField({
            fieldLabel: idioma.lbCampoSaldosegunLibro,
            blankText: idioma.lbMsgReq,
            //  maskRe:/^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            //  regex :/^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            style: 'text-align:right',
            emptyText: '0.00',
            disabled: true,
            disabledClass: 'disabled-component',
            allowBlank: false,
            anchor: '100%'
        });

        this.cbSucursalbanc = new Ext.form.ComboBox({
            fieldLabel: idioma.lbCampoSucursalBancaria,
            mode: 'local',
            resizable: true,
            hiddenName: 'idsucursal',
            tpl: '<tpl for="."><div ext:qtip="{numdir}" class="x-combo-list-item">{numdir}</div></tpl>',
            emptyText: idioma.lbMsgemptyText,
            valueField: 'idsucursal',
            displayField: 'numdir',
            forceSelection: true,
            editable: false,
            typeAhead: true,
            blankText: idioma.lbMsgReq,
            allowBlank: false,
            anchor: '100%',
            triggerAction: 'all',
            enableKeyEvents: true,
            store: model.stSucursalbanc,
            tabIndex: 8
        });

        //Grid editor donde se adicionan las cuentas contables que se asocian a la cuenta bancaria.
        this.grideditorCuentasContables = new Ext.Cont.Banco.GridEditor.Cuenta({
            id: 'cuentascontables',
            perfil: perfil,
            idioma: idioma,
            frame: true,
            cbMoneda: this.cbMoneda,
            viewConfig: {
                forceFit: true
            }
        });


        this.gpUnidadcontable = new Ext.grid.GridPanel({
            frame: true,
            store: model.stUnidadcontable,
            sm: new Ext.grid.CheckboxSelectionModel({
                singleSelect: false
            }),
            loadMask: {
                store: model.stUnidadcontable
            },
            columns: [
                new Ext.grid.CheckboxSelectionModel(),
                {
                    header: idioma.lbcolUnidadUsuariaCodigo,
                    width: 240,
                    sortable: true,
                    dataIndex: 'codigo'
                }, {
                    header: idioma.lbcolUnidContNombre,
                    width: 500,
                    sortable: true,
                    dataIndex: 'denominacion'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestructura',
                    id: 'idestructura'
                }],
            viewConfig: {
                forceFit: true
            }
        });

        this.tabs = new Ext.TabPanel({
            activeTab: 0,
            height: 200,
            frame: true,
            region: 'center',
            border: false,
            items: [{
                    id: 'tabsA1',
                    title: idioma.lbTiTleTabAddModCtaCtable,
                    layout: 'fit',
                    items: this.grideditorCuentasContables
                }, {
                    id: 'tabsA2',
                    title: idioma.lbTiTleTabGUnidadCtble,
                    //title:'Unidades usuarias',
                    layout: 'fit',
                    items: this.gpUnidadcontable
                }
                /*,{
                 id:'tabsA3',
                 title:'Sobregiro bancario',
                 //disabled:true,
                 layout:'fit',
                 items:this.fsSobregiro

                 }*/]
        });

        // Formulario Add y Mod Ctabancaria
        this.fpCtabancaria = new Ext.FormPanel({
            frame: true,
            region: 'north',
            layout: 'form',
            autoHeight: true,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .37,
                            layout: 'form',
                            items: this.cbTipocuenta
                        }, {
                            columnWidth: .63,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: this.tfNctabancaria
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            columnWidth: .21,
                            layout: 'form',
                            items: this.dfApertura
                        }, {
                            columnWidth: .10,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: this.cbMoneda
                        }, {
                            columnWidth: .11,
                            layout: 'form',
                            style: 'margin:10 0 0 10',
                            items: this.chkbSobregiro
                        }, {
                            columnWidth: .58,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: this.tfNombre
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [{
                            columnWidth: .21,
                            layout: 'form',
                            items: this.tfSaldiniBanco
                        }, {
                            columnWidth: .21,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: this.tfSaldactualBanco
                        }, {
                            columnWidth: .58,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: this.cbBanco
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            columnWidth: .21,
                            layout: 'form',
                            items: this.tfSaldiniLibro
                        }, {
                            columnWidth: .21,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: this.tfSaldLibro
                        }, {
                            columnWidth: .58,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: this.cbSucursalbanc
                        }]
                }/*,{//checkbox del  sobregiro

                 layout:'column',
                 style:'margin:10 10 0 0',
                 items: [ this.lbsobregiro, this.ckbsobregiro]
                 }*/]
        });

        //ventana add y mod Ctabancaria
        this.winCtabancaria = new Ext.Window({
            autoValidate: true,
            width: 800,
            height: 550,
            layout: 'border',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            frame: true,
            items: [this.fpCtabancaria, this.tabs],
            buttons: [this.btnCancelar = new Ext.Button({
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    tooltip: idioma.lbBtnTooltipCancelar,
                    text: idioma.lbBtnCancelar,
                    tabIndex: 9
                }), this.btnAplicar = new Ext.Button({
//                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'aplicar',
                    tooltip: idioma.lbBtnTooltipAplicar,
                    text: idioma.lbBtnAplicar,
                    tabIndex: 10
                }), this.btnAceptar = new Ext.Button({
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    tooltip: idioma.lbBtnTooltipAceptar,
                    text: idioma.lbBtnAceptar,
                    tabIndex: 11
                })]
        });

        //VENTANA  ver detalles de seleccion
        this.pPreView = new Ext.Panel({
            autoScroll: true
        });

        this.winVerdetalles = new Ext.Window({
            title: idioma.lbTitTVerDetalles,
            width: '70%',
            height: 500,
            layout: 'fit',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            maximizable: true,
            frame: true,
            items: this.pPreView,
            buttons: [
                this.btnCerrar = new Ext.Button({
//                    icon: perfil.dirImg + 'cerrar.png',
                    iconCls: 'cerrar',
                    tooltip: idioma.lbBtnTooltipCerrar,
                    text: idioma.lbBtnCerrar
                })
            ]
        });

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
        var model = Banco.Ctabancaria.Model;
        model.init();

        //Inicializar la vista.
        var view = Banco.Ctabancaria.View;
        view.init(etiquetas, model);

        //Inicializar controlador.
        var controller = Banco.Ctabancaria.Controller;
        Banco.Ctabancaria.Controller.init(etiquetas, view, model);
        controller.loadDataIni();
    }
});
