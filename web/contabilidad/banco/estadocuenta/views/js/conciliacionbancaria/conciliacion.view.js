//Empaquetando el componente conciliacion
Ext.ns('Banco.Conciliacion');
Banco.Conciliacion.View = {
    /**
     * Inicializar la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param model Modelo de la vista del componente Conciliacion.
     * @param presentbtnAyuda Variable para que aparezca o no el botón ayuda.
     */
    init: function(idioma, model, presentbtnAyuda) {

        //Me dice si hay alguna ventana abierta
        this.windowopen = false;
        this.actionbtn = '';//saber si se esta add o mod
        scope = this;

        //adicionar conciliacion
        this.btnConciliar = new Ext.Button({
            text: idioma.lbBtnConciliar,
            tooltip: idioma.textToolTipConciliar,
//            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'conciliar',
            abreviatura: 'conciliar_conciliacionbancaria'

        });

        //eliminar conciliacion
        this.btnEliminar = new Ext.Button({
            disabled: true,
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipDel,
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            abreviatura: 'eliminar_conciliacionbancaria'

        });

        //modificar conciliacion
        this.btnVer = new Ext.Button({
            disabled: true,
            text: idioma.lbBtnVer,
            tooltip: idioma.textToolTipVer,
//            icon: perfil.dirImg + 'ver.png',
            iconCls: 'ver',
            abreviatura: 'ver_conciliacionbancaria'

        });

        this.btnImprimirConc = new Ext.Button({
            disabled: false,
            text: idioma.lbimprimirConciliacion,
            tooltip: idioma.tooltipimprimirConciliacion,
            iconCls: 'reportes',
            abreviatura: 'verreporteconciliacion_conciliacionbancaria'

        });

        if (validate) {
            validate.addButton(this.btnConciliar);
            validate.addButton(this.btnEliminar);
            validate.addButton(this.btnVer);
            validate.addButton(this.btnImprimirConc);

            //Ocultando primero todos los botones
            //Validando permisos de acceso a los recurdos en los botones
            validate.checkPermisos();
        }

        //ayuda
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaconciliacion',
            disabled: false,
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipHelp,
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda'
        });

        //Label para mostrar el período actual
        this.labelPeriodo = new Ext.form.Label({
            id: 'labelPeriodo',
            style: 'font-weight: bold;'
        });

        this.btnBuscar = new Ext.Button({
            disabled: true,
            // text: '<u>B</u>uscar',
            text: idioma.lbBtnBuscar,
            tooltip: idioma.tooltipBtnBuscarConc,
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'buscar'
        });

        this.dfBuscar = new Ext.Cont.DateField({
            msgTarget: 'qtip',
            invalidText: idioma.lbFormatoFecha,
            allowBlank: true,
            enableKeyEvents: true,
            width: 140,
            format: 'd/m/Y',
            selectOnFocus: true
        });

        //grid con el listado de las conciliaciones almacenadas
        this.gpConciliaciones = new Ext.grid.GridPanel({
            border: false,
            layout: 'fit',
            autoExpandColumn: 'expandir',
            frame: true,
            store: model.stConciliaciones,
            loadMask: true,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            columns: [
                {
                    header: idioma.lbGridFechaConc,
                    width: 130,
                    sortable: true,
                    dataIndex: 'fecha',
                    renderer: Ext.util.Format.dateRenderer('d/m/Y')
                }, {
                    header: idioma.lbGridConciliada,
                    width: 80,
                    id: 'expandir',
                    sortable: true,
                    dataIndex: 'conciliado',
                    renderer: function(v) {
                        return (v == 1) ? idioma.lbGridConciliadaSi : idioma.lbGridConciliadaNo;
                    }
                }, /*{
                 header: idioma.lbGridSaldoLibro,
                 width: 130,
                 align: 'right',
                 sortable: true,
                 renderer: formatoMonedaABS,
                 dataIndex: 'saldoactuallibro'
                 },*/{
                    header: idioma.lbGridSaldoAjustadoLibro,
                    width: 130,
                    align: 'right',
                    sortable: true,
                    //renderer: formatoMonedaABS,
                    renderer: formatoMoneda,
                    dataIndex: 'saldoajustadolibro'
                }, {
                    header: idioma.lbGridSaldoBanco,
                    width: 130,
                    align: 'right',
                    sortable: true,
                    //renderer: formatoMonedaABS,
                    renderer: formatoMoneda,
                    dataIndex: 'saldoactualbanco'
                },
                {
                    header: idioma.lbGridDiferencia,
                    width: 80,
                    align: 'right',
                    sortable: true,
                    renderer: function(v, metadata, record, rowIdex, colIndex, store) {
                        var dif = parseFloat(record.data.saldoactualbanco) - parseFloat(record.data.saldoajustadolibro);

                        var style = (dif == 0.0) ? 'font-weight:bold;' : 'color:red;font-weight:bold;';

                        return '<span style="' + style + '">' + formatoMonedaABS(dif) + '</span>';
                    }
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'text'
                }
            ],
            tbar: [idioma.lbFecha, scope.dfBuscar, scope.btnBuscar],
            bbar: this.paginToolbar = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: model.stConciliaciones,
                displayInfo: true,
                clearFilter: true
            }),
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: idioma.lbGridTplConciliacion
            })
        });

        var tbar = (presentbtnAyuda) ? [this.btnConciliar, this.btnEliminar, this.btnVer, this.btnImprimirConc, '->', this.labelPeriodo, '-', this.btnAyuda]
                : [this.btnConciliar, this.btnEliminar, this.btnVer, this.btnImprimirConc, '->', this.labelPeriodo];

        //Vista general de la conciliacion
        this.viewPort = new Ext.Viewport({
            layout: 'fit',
            items: [{
                    layout: 'fit',
                    tbar: tbar,
                    items: [scope.gpConciliaciones]
                }]
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

        /******************************************************************************/
        //label para simular column vacia
        this.lfDatosConciliacion = new Ext.form.Label({
            id: 'lfvacio',
            text: idioma.lbMonedaSucursal,
            style: 'font:12px tahoma,arial,verdana,sans-serif;',
            anchor: '100%'
        });
        //Fecha conciliacion
//        this.dfFechaConciliacion = new Ext.Cont.DateField({
//            fieldLabel: idioma.lbGridFechaConc,
//            disabledClass: 'disabled-component',
//            msgTarget: 'qtip',
//            invalidText: idioma.lbFormatoFecha,
//            blankText: idioma.lbMsgReq,
//            editable: true,
//            allowBlank: false,
//            anchor: '100%',
//            format: 'd/m/Y',
//            enableKeyEvents: true
//        });

        this.dfFechaConciliacion = new Ext.form.DateField({
            fieldLabel: idioma.lbGridFechaConc,
            disabledClass: 'disabled-component',
            msgTarget: 'qtip',
            invalidText: idioma.lbFormatoFecha,
            blankText: idioma.lbMsgReq,
            editable: true,
            allowBlank: false,
            anchor: '100%',
            format: 'd/m/Y',
            enableKeyEvents: true,
            tabIndex: 1
        });

        //combo de la cta bancaria
        this.cbCuentaBancaria = new Ext.form.ComboBox({
            fieldLabel: idioma.lbCtaBanc,
            tpl: '<tpl for="."><div ext:qtip="{nombrecuentabancaria}" class="x-combo-list-item">{nombrecuentabancaria}</div></tpl>', // Para mostrar los datos como detalle
            resizable: true,
            disabledClass: 'disabled-component',
            anchor: '100%',
            typeAhead: true,
            //emptyText: idioma.lbEmptyMsg,
            triggerAction: 'all',
            /* maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n�meros y espacios
             regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
             regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
            allowBlank: false,
            displayField: 'nombrecuentabancaria',
            valueField: 'idcuenta',
            store: model.stCuentaBancaria,
            mode: 'local',
            forceSelection: true,
            enableKeyEvents: true,
            tabIndex: 2
        });
        //store para Metodo de conciliacion
        this.stTipoConciliacion = new Ext.data.SimpleStore({
            fields: ['idtipoconciliacion', 'nombremetodo'],
            data: [['0', idioma.lbSaldoAjust], ['1', idioma.lbSaldoSegunLibro], ['2', idioma.lbSaldoSegunBanco]]
        });
        //combo para Metodo de conciliacion
        this.cbTipoConciliacion = new Ext.form.ComboBox({
            fieldLabel: idioma.lbMetodo,
            tpl: '<tpl for="."><div ext:qtip="{nombremetodo}" class="x-combo-list-item">{nombremetodo}</div></tpl>',
            resizable: true,
            mode: 'local',
            editable: false,
            store: scope.stTipoConciliacion,
            valueField: 'idtipoconciliacion',
            displayField: 'nombremetodo',
            hiddenName: 'idtipoconciliacion',
            allowBlank: false,
            width: 140,
            triggerAction: 'all',
            enableKeyEvents: true,
            typeAhead: true
        });
        //total del debito en libro
        this.tfTotaldebLibro = new Ext.form.TextField({
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            disabled: true,
            width: 120
        });
        //total de las cuentas contables
        this.tfTotalctaCont = new Ext.form.TextField({
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            disabled: true,
            width: 120
        });
        //total del credito en banco
        this.tfTotalcredBanco = new Ext.form.TextField({
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            disabled: true,
            width: 120
        });
        //total del debito en banco
        this.tfTotaldebBanco = new Ext.form.TextField({
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            disabled: true,
            width: 120
        });
        //total del credito en libro
        this.tfTotalcredLibro = new Ext.form.TextField({
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            disabled: true,
            width: 120
        });
        /******************************************************************************/

        //    *****	PANEL DEL METODO DE CONCILIACION SALDO AJUSTADO*****/
        //saldo actual libro metodo saldo ajustado
        this.tfSaldoActLibroAjust = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: idioma.lbSaldoActual,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //credito en libro metodo saldo ajustado
        this.tfCreditoLibroAjust = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '- ' + idioma.lbCreditoLibro,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //debito en libro metodo saldo ajustado
        this.tfDebitoLibroAjust = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '+ ' + idioma.lbDebitoLibro,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //saldo ajustado libro metodo saldo ajustado
        this.tfSaldoAjustLibroAjust = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '= ' + idioma.lbSaldoAjust,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });

        //saldo actual banco metodo saldo ajustado
        this.tfSaldoActBancoAjust = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: idioma.lbSaldoActual,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //debito en banco metodo saldo ajustado
        this.tfDebitoBancoAjust = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '- ' + idioma.lbDebitoBanco,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //credito en banco metodo saldo ajustado
        this.tfCreditoBancoAjust = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '+ ' + idioma.lbCreditoBanco,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //saldo ajustado banco metodo saldo ajustado
        this.tfSaldoAjustBancoAjust = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '= ' + idioma.lbSaldoAjust,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //panel saldo ajustado
        this.pSaldoAjustado = new Ext.Panel({
            hidden: true,
            border: false,
            items: [{
                    title: idioma.lbSaldoSegunLibro,
                    frame: true,
                    border: false,
                    // height: 160,
                    items: [{
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoActLibroAjust
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfCreditoBancoAjust
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfDebitoBancoAjust
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoAjustLibroAjust
                        }]
                }, {
                    title: idioma.lbSaldoSegunBanco,
                    frame: true,
                    border: false,
                    // height: 175,
                    items: [{
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoActBancoAjust
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfCreditoLibroAjust
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfDebitoLibroAjust
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoAjustBancoAjust
                        }]
                }
            ]
        });

        /*****	PANEL DEL METODO DE CONCILIACION SALDO SEGUN LIBRO*****/
        //saldo actual en libro metodo segun libro
        this.tfSaldoActLibroLib = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: idioma.lbSaldoActual,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //credito en libro metodo segun libro
        this.tfCreditoLibroLib = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '+ ' + idioma.lbCreditoLibro,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //debito en libro metodo segun libro
        this.tfDebitoLibroLib = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '- ' + idioma.lbDebitoLibro,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //saldo ajustado en libro metodo segun libro
        this.tfSaldoAjustLibroLib = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '= ' + idioma.lbSaldoAjust,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });

        //saldo actual en banco metodo segun libro
        this.tfSaldoActBancoLib = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: idioma.lbSaldoActual,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //debito en banco metodo segun libro
        this.tfDebitoBancoLib = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '- ' + idioma.lbDebitoBanco,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //credito en banco metodo segun libro
        this.tfCreditoBancoLib = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '+ ' + idioma.lbCreditoBanco,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //saldo ajustado en banco metodo segun libro
        this.tfSaldoAjustBancoLib = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '= ' + idioma.lbSaldoAjust,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //panel saldo segun libro
        this.pSegunLibro = new Ext.Panel({
            hidden: false,
            border: false,
            items: [{
                    title: idioma.lbSaldoSegunLibro,
                    frame: true,
                    border: false,
                    // height: 305,
                    items: [{
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoActLibroLib
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfCreditoLibroLib
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfDebitoLibroLib
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfCreditoBancoLib
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfDebitoBancoLib
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoAjustLibroLib
                        }]
                }, {
                    title: idioma.lbSaldoSegunBanco,
                    frame: true,
                    border: false,
                    // height: 88,
                    items: [{
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:10 0 0 10',
                            items: scope.tfSaldoActBancoLib
                        }, {
                            hidden: true,
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoAjustBancoLib
                        }]
                }
            ]
        });

        /*****	PANEL DEL METODO DE CONCILIACION SALDO SEGUN BANCO*****/
        //saldo actual en libro metodo segun banco
        this.tfSaldoActLibroBanc = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: idioma.lbSaldoActual,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //credito en libro metodo segun banco
        this.tfCreditoLibroBanc = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '- ' + idioma.lbCreditoLibro,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //debito en libro metodo segun banco
        this.tfDebitoLibroBanc = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '+ ' + idioma.lbDebitoLibro,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //saldo ajustado en libro metodo segun banco
        this.tfSaldoAjustLibroBanc = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '= ' + idioma.lbSaldoAjust,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //saldo actual en banco metodo segun banco
        this.tfSaldoActBancoBanc = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: idioma.lbSaldoActual,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //debito en banco metodo segun banco
        this.tfDebitoBancoBanc = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '+ ' + idioma.lbDebitoBanco,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //credito en banco metodo segun banco
        this.tfCreditoBancoBanc = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '- ' + idioma.lbCreditoBanco,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //saldo ajustado en banco metodo segun banco
        this.tfSaldoAjustBancoBanc = new Ext.form.TextField({
            style: 'text-align: right',
            fieldLabel: '= ' + idioma.lbSaldoAjust,
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 135
        });
        //saldo segun banco
        this.pSegunBanco = new Ext.Panel({
            hidden: true,
            border: false,
            items: [{
                    title: idioma.lbSaldoSegunBanco,
                    frame: true,
                    border: false,
                    // height: 270,
                    items: [{
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoActBancoBanc
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfCreditoBancoBanc
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfDebitoBancoBanc
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfDebitoLibroBanc
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:14 0 0 10',
                            items: scope.tfCreditoLibroBanc
                        }, {
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoAjustBancoBanc
                        }
                    ]
                }, {
                    title: idioma.lbSaldoSegunLibro,
                    frame: true,
                    // height: 65,
                    border: false,
                    items: [{
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoActLibroBanc
                        }, {
                            hidden: true,
                            labelAlign: 'right',
                            layout: 'form',
                            labelWidth: 165,
                            style: 'margin:5 0 0 10',
                            items: scope.tfSaldoAjustLibroBanc
                        }]
                }]
        });
        //grid Crédito en banco
        this.gpCreditoBanco = new Ext.grid.GridPanel({
            store: model.stCreditoBanco,
            frame: true,
            loadMask: true,
            disableSelection: true,
            autoScroll: true,
            autoExpandColumn: 'dif',
            columns: [
                {
                    header: idioma.lbGridNoEstCta,
                    width: 280,
                    sortable: true,
                    dataIndex: 'nroestado'
                },
                {
                    id: 'dif',
                    header: idioma.lbGridDifConcCre,
                    width: 250,
                    align: 'right',
                    sortable: true,
                    renderer: formatoMonedaABS,
                    dataIndex: 'diferenciamo'
                }
            ],
            bbar: ['->', idioma.lbGridTotalDifConc, scope.tfTotalcredBanco]
        });
        //grid Debito en banco
        this.gpDebitoBanco = new Ext.grid.GridPanel({
            store: model.stDebitoBanco,
            frame: true,
            loadMask: true,
            disableSelection: true,
            autoScroll: true,
            autoExpandColumn: 'dif',
            columns: [
                {
                    header: idioma.lbGridNoEstCta,
                    width: 280,
                    sortable: true,
                    dataIndex: 'nroestado'
                },
                {
                    id: 'dif',
                    header: idioma.lbGridDifConcDeb,
                    width: 250,
                    align: 'right',
                    sortable: true,
                    renderer: formatoMonedaABS,
                    dataIndex: 'diferenciamo'
                }],
            bbar: ['->', idioma.lbGridTotalDifConc, scope.tfTotaldebBanco]
        });
        //credito en libro
        this.gpCreditoLibro = new Ext.grid.GridPanel({
            store: model.stCreditoLibro,
            frame: true,
            height: 380,
            loadMask: true,
            disableSelection: true,
            autoScroll: true,
            autoExpandColumn: 'importe',
            columns: [
                {
                    header: idioma.lbGridNoDocumento,
                    width: 100,
                    sortable: true,
                    dataIndex: 'numerodocumento'
                },
                {
                    header: idioma.lbGridFechaOperEstCta,
                    width: 75,
                    sortable: true,
                    dataIndex: 'fecha',
                    renderer: 'erpFecha'
                },
                {
                    header: idioma.lbGridOrigenConc,
                    width: 70,
                    sortable: true,
                    dataIndex: 'origen'
                },
                {
                    header: idioma.lbGridTipoDocOperEstCta,
                    width: 155,
                    sortable: true,
                    renderer: tipodoc,
                    dataIndex: 'denomtipodoc'
                },
                {
                    header: idioma.lbGridImporte,
                    width: 130,
                    id: 'importe',
                    sortable: true,
                    align: 'right',
                    renderer: formatoMonedaABS,
                    dataIndex: 'importemo'
                }],
            bbar: ['->', idioma.lbGridTotalImporte, scope.tfTotalcredLibro]
        });
        //grid Débito en libro
        this.gpDebitoLibro = new Ext.grid.GridPanel({
            store: model.stDebitoLibro,
            frame: true,
            height: 380,
            loadMask: true,
            disableSelection: true,
            autoScroll: true,
            autoExpandColumn: 'importe',
            columns: [
                {
                    header: idioma.lbGridNoDocumento,
                    width: 100,
                    sortable: true,
                    dataIndex: 'numerodocumento'
                },
                {
                    header: idioma.lbGridFechaOperEstCta,
                    width: 75,
                    sortable: true,
                    dataIndex: 'fecha',
                    renderer: 'erpFecha'
                },
                {
                    header: idioma.lbGridOrigenConc,
                    width: 70,
                    sortable: true,
                    dataIndex: 'origen'
                },
                {
                    header: idioma.lbGridTipoDocOperEstCta,
                    width: 155,
                    sortable: true,
                    renderer: tipodoc,
                    dataIndex: 'denomtipodoc'
                },
                {
                    header: idioma.lbGridImporte,
                    id: 'importe',
                    width: 130,
                    sortable: true,
                    align: 'right',
                    renderer: formatoMonedaABS,
                    dataIndex: 'importemo'
                }],
            bbar: ['->', idioma.lbGridTotalImporte, scope.tfTotaldebLibro]
        });
        //datos de las ctas contables
        this.gpCtaContable = new Ext.grid.GridPanel({
            store: model.stCtaContable,
            frame: true,
            height: 380,
            loadMask: true,
            disableSelection: true,
            autoScroll: true,
            autoExpandColumn: 'importe',
            columns: [
                {
                    header: idioma.lbGridCtaContable,
                    width: 390,
                    sortable: true,
                    dataIndex: 'nombrecuentacontable'
                },
                {
                    header: idioma.lbGridImporte,
                    id: 'importe',
                    width: 200,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'importe',
                    //renderer: formatoMonedaABS
                    renderer: formatoMoneda
                }],
            bbar: ['->', idioma.lbGridTotalImporte, scope.tfTotalctaCont]
        });
        //datos de la concialiacione
        this.tpDatosConciliacion = new Ext.TabPanel({
            activeTab: 0,
            height: 400,
            frame: true,
            border: false,
            items: [
                {
                    title: idioma.lbCreditoBanco,
                    layout: 'fit',
                    items: scope.gpCreditoBanco
                },
                {
                    title: idioma.lbDebitoBanco,
                    layout: 'fit',
                    items: scope.gpDebitoBanco
                },
                {
                    title: idioma.lbCreditoLibro2,
                    layout: 'fit',
                    items: scope.gpCreditoLibro
                },
                {
                    title: idioma.lbDebitoLibro2,
                    layout: 'fit',
                    items: scope.gpDebitoLibro
                },
                {
                    title: idioma.lbGridCtaContable,
                    layout: 'fit',
                    items: scope.gpCtaContable
                }
            ]
        });
        //ventana de la conciliacion bancaria	
        this.winConcBancaria = new Ext.Window({
            // title: idioma.lbGridConcBancaria,
            width: Ext.lib.Dom.getViewWidth() * 0.80,
            height: Ext.lib.Dom.getViewHeight() * 0.98,
            border: false,
            constrain: true,
            // height: 585,
            modal: true,
            resizable: false,
            closeAction: 'hide',
            layout: 'border',
            items: [{
                    region: 'north',
                    height: 70,
                    frame: true,
                    items: [{
                            layout: 'column',
                            items: [{
                                    labelWidth: 110,
                                    layout: 'form',
                                    columnWidth: .25,
                                    items: scope.dfFechaConciliacion
                                }, {
                                    style: 'margin:0 0 0 10',
                                    layout: 'form',
                                    columnWidth: .75,
                                    items: scope.cbCuentaBancaria
                                }]
                        }, {
                            style: 'margin:10 0 0 0',
                            layout: 'form',
                            items: scope.lfDatosConciliacion
                        }]
                }, {
                    layout: 'column',
                    region: 'center',
                    frame: true,
                    border: false,
                    items: [{
                            columnWidth: .35,
                            items: [{
                                    frame: true,
                                    items: [{
                                            style: 'margin:0 0 0 5',
                                            labelWidth: 135,
                                            labelAlign: 'right',
                                            layout: 'form',
                                            border: false,
                                            items: [scope.cbTipoConciliacion]
                                        }]
                                }, scope.pSaldoAjustado, scope.pSegunLibro, scope.pSegunBanco]
                        }, {
                            columnWidth: .65,
                            border: false,
                            items: scope.tpDatosConciliacion
                        }]
                }],
            buttons: [this.btnCancelar = new Ext.Button({
                    id: 'btnCancelar',
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    text: idioma.lbBtnCancelar,
                    tooltip: idioma.textToolTipCancelar,
                    tabIndex: 3
                }), this.btnAplicar = new Ext.Button({
                    id: 'btnAplicar',
//                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'aplicar',
                    disabled: true,
                    text: idioma.lbBtnAplicar,
                    tooltip: idioma.textToolTipAplicar,
                    tabIndex: 4
                }), this.btnAceptar = new Ext.Button({
                    id: 'btnAceptar',
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    disabled: true,
                    text: idioma.lbBtnAceptar,
                    tooltip: idioma.textToolTipAceptar,
                    tabIndex: 5
                }), this.btnCerrar = new Ext.Button({
                    id: 'btnCerrar',
//                    icon: perfil.dirImg + 'cerrar.png',
                    iconCls: 'cerrar',
                    text: idioma.lbBtnCerrar,
                    tooltip: idioma.lbBtnTooltipCerrar,
                    tabIndex: 3
                })]
        });
        //funcion para el tipo de documento
        function tipodoc(v) {
            return (v) ? v : '<i>no definido</i>';
        }
    }
};