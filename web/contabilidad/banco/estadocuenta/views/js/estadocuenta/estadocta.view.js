//Empaquetando el componente estado de cuenta
Ext.ns('Banco.Estadocta');

//Vista del componente estado de cuenta.
Banco.Estadocta.View = {
    /**
     * Inicializar la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param model Modelo de la vista del componente Estadocta.
     */
    init: function(idioma, model) {

        //Me dice si hay alguna ventana abierta
        this.windowopen = false;
        this.finicio = '';
        this.ffin = '';
        this.arrayValues = new Array();//para el paginado
        this.actionbtn = '';//saber si se esta add o mod
        scope = this;

        //adicionar EstadoCta
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            disabled: false,
            //text : 'Adicionar',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipadicionar,
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            abreviatura: 'add_estadodecuenta'

        });
        validate.addButton(this.btnAdicionar);

        //modificar EstadoCta
        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            disabled: true,
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipMod,
//            icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            abreviatura: 'add_estadodecuenta'

        });
        validate.addButton(this.btnModificar);

        //eliminar EstadoCta
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            disabled: true,
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipDel,
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            abreviatura: 'del_estadodecuenta'

        });

        this.btnActualizarDep = new Ext.Button({
            id: 'btnActualizarDep',
            disabled: false,
            text: idioma.lbActDep,
            tooltip: idioma.tooltipActDep,
            iconCls: 'actualizar'
        });


      validate.addButton(this.btnEliminar);

        //conciliar EstadoCta
        this.btnConciliar = new Ext.Button({
            id: 'btnConciliar',
            text: idioma.lbBtnConciliar,
            tooltip: idioma.textToolTipConciliar,
//            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'conciliar',
            abreviatura: 'conciliar_estadodecuenta'
        });
        validate.addButton(this.btnConciliar);
        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();

        //ayuda
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaestadocuenta',
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
            id: 'btnBuscar',
            disabled: true,
            text: '<u>B</u>uscar',
            tooltip: idioma.tooltipBtnBuscarEstCuen,
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'buscar'
        });

        this.dfFechaInicio = new Ext.Cont.DateField({
            id: 'dfFechaInicio',
            msgTarget: 'qtip',
            // fieldLabel: 'Fecha incicio',
            invalidText: idioma.lbFormatoFecha,
            allowBlank: true,
            enableKeyEvents: true,
            width: 140,
            format: 'd/m/Y',
            selectOnFocus: true
        });

        this.dfFechaFin = new Ext.Cont.DateField({
            id: 'dfFechaFin',
            msgTarget: 'qtip',
            // fieldLabel: 'Fecha fin',
            invalidText: idioma.lbFormatoFecha,
            allowBlank: true,
            enableKeyEvents: true,
            width: 140,
            format: 'd/m/Y',
            selectOnFocus: true
        });

        this.cbCtaBanc = new Ext.form.ComboBox({
            // mode: 'local',
            //emptyText: idioma.lbEmptyMsg,
            store: model.stCuentaBanc,
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
            resizable: true,
            disabledClass: 'disabled-component',
            valueField: 'idcuentabancaria',
            displayField: 'text',
            selectOnFocus: true,
            allowBlank: true,
            typeAhead: true,
            forceSelection: true,
            anchor: '100%',
            triggerAction: 'all',
            // enableKeyEvents: true,
            // tabIndex: 1
        });

        //muestra la img de si esta conciliado o no
        this.showImage = function(value, metaData, record, rowIndex, colIndex, store) {
            if (record.data.conciliado === 1) {
                metaData.attr = 'ext:qtip="' + '<b>Conciliado</b>"';
                return '<img ext:qtip="<b>Conciliado</b>" src="' + value + '" alt="' + record.get('imgconciliado') + '" style="width:16px">';
            } else {
                metaData.attr = 'ext:qtip="' + '<b>No conciliado</b>"';
                return '<img ext:qtip="<b>No conciliado</b>" src="' + value + '" alt="' + record.get('imgconciliado') + '" style="width:16px">';
            }
        };

        //grid gestionar estado de cuenta
        this.gpEstadocuenta = new Ext.grid.GridPanel({
            //title : idioma.lbTitleEstCta,
            border: false,
            region: 'center',
            store: model.stEstadocuenta,
            frame: true,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {
                store: model.stEstadocuenta
            },
            autoExpandColumn: 'direccion',
            height: 260,
            width: 500,
            autoScroll: false,
            forceFit: true,
            columns: [
                {
                    id: 'idcuentabancaria',
                    hidden: true,
                    width: 130,
                    sortable: true,
                    dataIndex: 'idcuentabancaria',
                    hideable: false
                },
                {
                    header: idioma.lbGridNoEstCta,
                    width: 130,
                    sortable: true,
                    dataIndex: 'nroestado'
                },
                {
                    header: idioma.lbGridNoCtaBanc,
                    width: 150,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'nrocuenta'
                },
                {
                    header: idioma.lbGridNombCtaBanc,
                    width: 150,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'nombrecuentab'
                }, {
                    header: idioma.lbFecha,
                    width: 80,
                    sortable: true,
                    align: 'center',
                    dataIndex: 'fecha',
                    renderer: function(v) {
                        return v.format('d/m/Y');
                    }
                },
                {
                    header: idioma.lbSaldoIni,
                    width: 130,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'saldoinical',
                    renderer: formatoMoneda
                },
                {
                    header: idioma.lbSaldoFin,
                    width: 130,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'saldofinal',
                    renderer: formatoMoneda
                },
                {
                    header: idioma.lbDiferencia,
                    width: 100,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'diferencia',
                    renderer: formatoMoneda
                },
                {
                    id: 'direccion',
                    header: idioma.lbCorreccion,
                    width: 80,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'correccion',
                    renderer: formatoMoneda
                }, /*{
                    header: idioma.lbGridConciliado,
                    align: 'center',
                    renderer: this.showImage,
                    width: 60,
                    dataIndex: 'imgconciliado'
                }*/
            ],
            tbar: [/*idioma.lbFechaBuscar*/ 'Fecha Inicio: ', this.dfFechaInicio, 'Fecha Fin: ', this.dfFechaFin, 'Cuenta Bancaria: ', this.cbCtaBanc, this.btnBuscar],
            bbar: this.paginToolbar = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: model.stEstadocuenta,
                clearFilter: true,
                displayInfo: true
            }),
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: idioma.lbGridTplEstCta
            })
        });

        //operaciones cargadas por el banco
        this.gdOperCargadas = new Ext.grid.EditorGridPanel({
            store: model.stOperCargadas,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            forceFit: false,
            loadMask: true,
            border: false,
            plugins: new Ext.grid.GroupSummary(),
            autoExpandColumn: 'descripcion',
            height: 150,
            width: 500,
            autoScroll: false,
            columns: [{
                    header: idioma.lbGridNoDocAddOper,
                    width: 100,
                    sortable: true,
                    dataIndex: 'nodocumento'
                }, {
                    header: idioma.lbGridTipoDocAddOper,
                    width: 150,
                    sortable: true,
                    dataIndex: 'tipoinstrumento'
                }, {
                    header: idioma.lbDebito,
                    width: 100,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'debito',
                    renderer: formatoMoneda,
                    summaryType: 'sum',
                    summaryRenderer: formatoMoneda
                }, {
                    header: idioma.lbCredito,
                    width: 100,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'credito',
                    renderer: formatoMoneda,
                    summaryType: 'sum',
                    summaryRenderer: formatoMoneda
                }, {
                    header: idioma.lbGridOrigOperEstCta,
                    width: 100,
                    sortable: true,
                    dataIndex: 'origen',
                    align: 'center'
                }, {
                    id: 'descripcion',
                    header: idioma.lbGridDescripcion,
                    width: 150,
                    sortable: true,
                    dataIndex: 'descripcion'
                }],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                showGroupName: false,
                enableNoGroups: false, // REQUIRED!
                hideGroupedColumn: true
            })
        });

        //grid diferencias y correcciones
        this.gdCorrecBanco = new Ext.grid.EditorGridPanel({
            store: model.stCorrecBanco,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            forceFit: false,
            loadMask: true,
            border: false,
            plugins: new Ext.grid.GroupSummary(),
            autoExpandColumn: 'expand',
            height: 150,
            width: 500,
            autoScroll: false,
            columns: [{
                    header: idioma.lbGridImpiDifEstCta,
                    width: 130,
                    align: 'right',
                    dataIndex: 'importeinicialmo',
                    renderer: formatoMoneda
                }, {
                    header: idioma.lbGridImpcDifEstCta,
                    width: 130,
                    align: 'right',
                    dataIndex: 'importemo',
                    renderer: formatoMoneda,
                    summaryType: 'sum',
                    summaryRenderer: formatoMoneda
                }, {
                    header: idioma.lbGridDifpDifEstCta,
                    width: 130,
                    align: 'right',
                    dataIndex: 'diferencia',
                    renderer: formatoMoneda,
                    summaryType: 'sum',
                    summaryRenderer: formatoMoneda
                }, {
                    id: 'expand',
                    header: idioma.lbGridDescripcion,
                    width: 130,
                    dataIndex: 'descripcion'
                }, {
                    header: "grupingfield",
                    hidden: true,
                    hideable: false,
                    dataIndex: 'grupingfield'
                }],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                showGroupName: false,
                enableNoGroups: false, // REQUIRED!
                hideGroupedColumn: true
            })
        });

        //Grid panel para mostrar los detalles de los depositos
        this.smTabDepositos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.gpTabDepositos = new Ext.grid.GridPanel({
            store: model.stTabDepositos,
            border: false,
            split: true,
            loadMask: true,
            autoExpandColumn: 'descripcion',
            sm: this.smTabDepositos,
            // viewConfig: {
            //     forceFit: true
            // },
            forceFit: true,
            columns: [
                {
                    header: idioma.lbGridNoDocAddOper,
                    width: 140,
                    sortable: true,
                    dataIndex: 'nodocumento'
                },
                {
                    header: idioma.lbGridTipoDocAddOper,
                    width: 160,
                    sortable: true,
                    dataIndex: 'tipodoc'
                }, {
                    header: idioma.lbImporte,
                    width: 140,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'importe',
                    renderer: formatoMoneda
                }, {
                    header: idioma.lbFecha,
                    width: 120,
                    sortable: true,
                    align: 'center',
                    dataIndex: 'fecha'
                }, {
                    id: 'descripcion',
                    header: idioma.lbGridDescripcion,
                    width: 100,
                    sortable: true,
                    dataIndex: 'descripcion'
                }]
        });

        //tab de las operaciones y diferencias
        this.tpCuenta = new Ext.TabPanel({
            activeTab: 0,
            frame: true,
            items: [{
                    title: idioma.lbTitleOperTpEstCta,
                    layout: 'fit',
                    items: this.gdOperCargadas
                }, {
                    title: idioma.lbTitleTabDepositos,
                    layout: 'fit',
                    items: this.gpTabDepositos
                }, {
                    title: idioma.lbTitleDifTpEstCta,
                    layout: 'fit',
                    items: this.gdCorrecBanco
                }]
        });

        //panel colapsable de las operaciones y diferencias
        this.pOperaciones = new Ext.Panel({
            title: idioma.lbTitleOperCorrecTpEstCta,
            collapsible: true,
            collapsed: true,
            region: 'south',
            split: true,
            layout: 'fit',
            height: screen.height / 2.7,
            items: [this.tpCuenta]
        });

        //Vista general del Estado de cta
        this.viewPort = new Ext.Viewport({
            layout: 'border',
            items: [
                {
                    region: 'center',
                    layout: 'border',
                    tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnConciliar, '->', this.labelPeriodo, '-', this.btnAyuda],
                    items: [this.gpEstadocuenta]
                },
                this.pOperaciones
            ]
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

        //*componente add y mod Estado cta
        //ventana add y mod Estado cta

        this.btnAddOperacion = new Ext.Button({
            id: 'btnAddOperacion',
            disabled: true,
            text: idioma.lbBtnAdd,
            tooltip: idioma.textToolTipOperAdd,
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            tabIndex: 3
        });

        //elimina la operacion del grid operaciones
        this.btnDelOperacion = new Ext.Button({
            id: 'btnDelOperacion',
            disabled: true,
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipOperElim,
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            tabIndex: 4
        });

        //btn para registra las diferencias
        this.btnDifBanco = new Ext.Button({
            id: 'btnDifBanco',
            disabled: true,
            text: idioma.lbDiferencias,
            tooltip: idioma.lbTitleDifBanco,
//            icon: perfil.dirImg + 'diferenciaconbanco.png',
            iconCls: 'diferenciaconbanco',
            tabIndex: 5
        });

        //debito acumulado por las operaciones del estado cta
        this.tfdebito = new Ext.form.TextField({
            id: 'tfdebito',
            fieldLabel: idioma.lbDebito,
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            readOnly: true,
            disabled: true,
            allowBlank: false,
            value: '0.00',
            anchor: '100%'
        });

        //credito acumulado por las operaciones del estado cta
        this.tfcredito = new Ext.form.TextField({
            id: 'tfcredito',
            fieldLabel: idioma.lbCredito,
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            readOnly: true,
            disabled: true,
            value: '0.00',
            allowBlank: false,
            anchor: '100%'
        });

        //operaciones a cargar en estado de cta
        this.gpOperaciones = new Ext.grid.GridPanel({
            store: model.stOperaciones,
            title: idioma.titleInstTrans,
            // region: 'north',
            region: 'west',
            border: true,
            height: 200,
            width: Ext.lib.Dom.getViewWidth() * 0.60,
            split: true,
            autoExpandColumn: 'descripcion',
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            /*viewConfig: {
                forceFit: true
            },*/
            forceFit: true,
            autoScroll: true,
            tbar: [this.btnAddOperacion, this.btnDelOperacion, '->', idioma.lbTotalDeb, this.tfdebito, ' ', idioma.lbTotalCre, this.tfcredito],
            columns: [{
                    header: idioma.lbGridNoDocAddOper,
                    width: 100,
                    sortable: true,
                    dataIndex: 'nodocumento'
                },
                {
                    header: idioma.lbGridTipoDocAddOper,
                    width: 100,
                    sortable: true,
                    dataIndex: 'tipoinstrumento'
                }, {
                    header: idioma.lbDebito,
                    width: 80,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'debito',
                    renderer: formatoMoneda
                }, {
                    header: idioma.lbCredito,
                    width: 80,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'credito',
                    renderer: formatoMoneda
                }, {
                    header: idioma.lbFecha,
                    width: 80,
                    sortable: true,
                    align: 'center',
                    dataIndex: 'fecha'
                }, {
                    id: 'descripcion',
                    header: idioma.lbGridDescripcion,
                    width: 100,
                    sortable: true,
                    dataIndex: 'descripcion'
                }]
        });

        //importe acumulado de los depositos seleccionados
        this.tfimportedepositos = new Ext.form.TextField({
            id: 'tfimportedepositos',
            //fieldLabel: idioma.lbDebito,
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            readOnly: true,
            disabled: true,
            allowBlank: false,
            value: '0.00',
            anchor: '100%'
        });

        //Grid panel para los depósitos
        this.smDepositos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.filters = new Ext.grid.GridFilters({
            filtersText: 'Búsqueda',
            local: true,
            filters: [
                {type: 'string', dataIndex: 'importe'},
                {type: 'string', dataIndex: 'fecha'},
                {type: 'string', dataIndex: 'descripcion'}
            ]
        });

        this.gpDepositos = new Ext.grid.GridPanel({
            store: model.stDepositos,
            title: idioma.titleDepositos,
            region: 'center',
            height: 200,
            border: false,
            anchor: '100%',
            /*viewConfig: {
                forceFit: true
            },*/
            forceFit: true,
            plugins: this.filters,
            split: true,
            autoExpandColumn: 'descripcion',
            sm: this.smDepositos,
            autoScroll: true,
            tbar: [this.btnActualizarDep, '->', idioma.lbTotalImpDep, this.tfimportedepositos],
            columns: [
                this.smDepositos,
                {
                    header: idioma.lbGridNoDocAddOper,
                    width: 80,
                    sortable: true,
                    dataIndex: 'nodocumento'
                },
                {
                    header: idioma.lbGridTipoDocAddOper,
                    width: 90,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'tipodoc'
                }, {
                    header: idioma.lbImporte,
                    width: 80,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'importe',
                    renderer: formatoMoneda
                }, {
                    header: idioma.lbFecha,
                    width: 80,
                    sortable: true,
                    align: 'center',
                    dataIndex: 'fecha'
                }, {
                    id: 'descripcion',
                    header: idioma.lbGridDescripcion,
                    width: 100,
                    sortable: true,
                    dataIndex: 'descripcion',
                    renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(record.data.idestadocuenta)) {
                            this.smDepositos.selectRow(rowIndex, true);
                        }
                        return value;
                    }.bind(this)
                }]
        });

        //cta bancaria del estado cta
        this.cbCuentaBanc = new Ext.form.ComboBox({
            id: 'cbCuentaBanc',
            fieldLabel: idioma.lbCtaBanc,
            mode: 'local',
            //emptyText: idioma.lbEmptyMsg,
            store: model.stCuentaBanc,
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
            resizable: true,
            disabledClass: 'disabled-component',
            valueField: 'idcuentabancaria',
            displayField: 'text',
            selectOnFocus: true,
            allowBlank: false,
            typeAhead: true,
            forceSelection: true,
            anchor: '100%',
            triggerAction: 'all',
            enableKeyEvents: true,
            tabIndex: 1
        });

        //numero del estado de cta
        /*this.tfnumero = new Ext.form.NumberField({
         id: 'tfnumero',
         fieldLabel: idioma.lbNumeroCta,
         disabled: false,
         readOnly: false,
         disabledClass: 'disabled-component',
         style: 'text-align: right',
         maxLength: 20,
         allowBlank: false,
         maskRe: /^\d*$/, // Números y letras
         regex: /^\d*$/,
         regexText: 'Este campo solo permite n&uacute;meros.',
         anchor: '100%',
         allowDecimals: false,
         allowNegative: false
         });*/

        this.tfnumero = new Ext.form.NumberField({
            id: 'tfnumero',
            fieldLabel: idioma.lbNumeroCta,
            disabled: false,
            readOnly: false,
            disabledClass: 'disabled-component',
            style: 'text-align: right',
            maxLength: 10,
            allowBlank: false,
            allowNegative:false,
             enableKeyEvents: true,
            maskRe: /^([0-9\(1)]+ ?[0-9]*)+$/,
            regexText: idioma.validatetfnumero,
            maxLengthText: idioma.validateLongtfnumero,
            anchor: '100%'
        });

        //saldo inicial de la cta
        this.tfsaldoini = new Ext.form.TextField({
            id: 'tfsaldoini',
            fieldLabel: idioma.lbSaldoIni,
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            readOnly: true,
            disabled: true,
            allowBlank: false,
            value: '0.00',
            anchor: '100%'
        });

        //saldo final de la cta
        this.tfsaldofin = new Ext.form.TextField({
            id: 'tfsaldofin',
            fieldLabel: idioma.lbSaldoFin,
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            readOnly: true,
            disabled: true,
            allowBlank: false,
            value: '0.00',
            anchor: '100%'
        });

        //dif acumulada por las operaciones del estado cta
        this.tfdifdebito = new Ext.form.TextField({
            id: 'tfdifdebito',
            fieldLabel: idioma.lbDebito,
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            readOnly: true,
            disabled: true,
            value: '0.00',
            anchor: '100%'
        });

        //dif acumulada por las operaciones del estado cta
        this.tfdifcredito = new Ext.form.TextField({
            id: 'tfdifcredito',
            fieldLabel: idioma.lbCredito,
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            readOnly: true,
            disabled: true,
            value: '0.00',
            anchor: '100%'
        });

        //label para simular column vacia
        this.lfvacio = new Ext.form.Label({
            id: 'lfvacio',
            text: '.',
            anchor: '100%',
            style: '<span style=color:transparent;border:none;>'
        });

        //fecha del estado de cta
//        this.dfEstadoCta = new Ext.Cont.DateField({
        this.dfEstadoCta = new Ext.form.DateField({
            id: 'dfEstadoCta',
            fieldLabel: idioma.lbFecha,
            msgTarget: 'qtip',
            invalidText: idioma.lbFormatoFecha,
            blankText: idioma.lbMsgReq,
            allowBlank: false,
            enableKeyEvents: true,
            anchor: '100%',
            format: 'd/m/Y',
            selectOnFocus: true,
            tabIndex: 2
        });

        //fp add y mod estado cta
        this.fpEstadoCta = new Ext.FormPanel({
            frame: true,
            height: 150,
            region: 'north',
            border: false,
            //bbar: ['->', this.btnDifBanco],
            items: [{
                    labelAlign: 'top',
                    layout: 'column',
                    items: [{
                            columnWidth: .6,
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            items: this.cbCuentaBanc
                        }, {
                            columnWidth: .25,
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            items: this.tfnumero
                        }, {
                            columnWidth: .15,
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            items: this.dfEstadoCta
                        }]
                }, {
                    labelAlign: 'top',
                    layout: 'column',
                    items: [{
                            columnWidth: .30,
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            items: [this.tfsaldoini/*, this.tfdebito*/]
                        }, {
                            columnWidth: .30,
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            items: [this.tfsaldofin/*, this.tfcredito*/]
                        }/*, {
                            columnWidth: .16,
                            items: [this.lfvacio]
                        }*/, {
                            columnWidth: .4,
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    anchor: '100%',
                                    title: idioma.lbTitleDifBanco,
                                    autoHeight: true,
                                    items: [{
                                            layout: 'column',
                                            items: [{
                                                    columnWidth: .4,
                                                    layout: 'form',
                                                    items: [this.tfdifdebito]
                                                }, {
                                                    columnWidth: .4,
                                                    style: 'margin:0 0 0 5',
                                                    layout: 'form',
                                                    items: [this.tfdifcredito]
                                                }, {
                                                    columnWidth: .2,
                                                    style: 'margin:17 0 0 5',
                                                    layout: 'form',
                                                    items: [this.btnDifBanco]
                                                }]
                                        }]
                                }]
                        }]
                }]
        });

        //ventana del add y mod estado de cta
        this.winEstadocta = new Ext.Window({
            autoValidate: true,
            constrain: true,
            bodyStyle: 'padding:5px 5px 5px',
            width: 430,
            height: 360,
            layout: 'border',
            modal: true,
            closeAction: 'hide',
            resizable: true,
            frame: true,
            items: [this.fpEstadoCta, {
                    region: 'center',
                    layout: 'border',
                    border: false,
                    items: [this.gpOperaciones, this.gpDepositos]
                }],
            buttons: [this.btnCancelar = new Ext.Button({
                    id: 'btnCancelar',
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    text: idioma.lbBtnCancelar,
                    tooltip: idioma.textToolTipCancelar,
                    tabIndex: 6
                }), this.btnAplicar = new Ext.Button({
                    id: 'btnAplicar',
//                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'aplicar',
                    text: idioma.lbBtnAplicar,
                    tooltip: idioma.textToolTipAplicar,
                    tabIndex: 7
                }), this.btnAceptar = new Ext.Button({
                    id: 'btnAceptar',
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    text: idioma.lbBtnAceptar,
                    tooltip: idioma.textToolTipAceptar,
                    tabIndex: 8
                })]
        });

        //datos de la ventana operaciones
        //grid operaciones
        this.gpaddoper = new Ext.grid.GridPanel({
            store: model.staddoper,
            frame: true,
            autoExpandColumn: 'descripcion',
            width: 700,
            sm: new Ext.grid.CheckboxSelectionModel({
                singleSelect: false
            }),
            // viewConfig: {
            //     forceFit: true
            // },
            forceFit: true,
            /*loadMask: {
             store: model.staddoper
             },*/
            loadMask: true,
            autoScroll: true,
            columns: [new Ext.grid.CheckboxSelectionModel(),
                {
                    header: idioma.lbGridNoDocAddOper,
                    width: 100,
                    sortable: true,
                    dataIndex: 'nodocumento'
                },
                {
                    header: idioma.lbGridTipoDocAddOper,
                    width: 150,
                    sortable: true,
                    dataIndex: 'tipoinstrumento'
                }, {
                    header: idioma.lbDebito,
                    width: 80,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'debito',
                    renderer: formatoMonedaABS
                }, {
                    header: idioma.lbCredito,
                    width: 80,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'credito',
                    renderer: formatoMonedaABS
                }, {
                    header: idioma.lbFecha,
                    width: 90,
                    sortable: true,
                    dataIndex: 'fecha',
                    align: 'center'
                }, {
                    id: 'descripcion',
                    header: idioma.lbGridDescripcion,
                    width: 200,
                    sortable: true,
                    dataIndex: 'descripcion'
                }],
            bbar: this.pagintoolbaraddoper = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: model.staddoper,
                displayInfo: true,
                listeners: {
                    beforechange: function() {
                        instance = new PagingToolbarSelections({
                            'selections': scope.gpaddoper.getSelectionModel().getSelections(),
                            'activePage': this.getPageData().activePage
                        });
                        instance.saveSelectionsOnPage(scope.arrayValues);
                    },
                    change: function() {
                        instance = new PagingToolbarSelections({
                            'activePage': this.getPageData().activePage
                        });
                        instance.setSelectionsOnPage(scope.arrayValues, scope.gpaddoper);
                    }
                }
            })
        });

        //ventana de las operaciones
        this.winOperaciones = new Ext.Window({
            autoValidate: false,
            constrain: true,
            title: idioma.lbTitleAddOperTransito,
            layout: 'fit',
            width: 750,
            height: 500,
            modal: true,
            closeAction: 'hide',
            items: this.gpaddoper,
            buttons: [this.btnCancOper = new Ext.Button({
//                    icon: perfil.dirImg + 'cancelar.png',
                    id: 'btnCancOper',
                    iconCls: 'cancelar',
                    text: idioma.lbBtnCancelar,
                    tooltip: idioma.textToolTipCancelar
                }), this.btnApliOper = new Ext.Button({
//                    icon: perfil.dirImg + 'aplicar.png',
                    id: 'btnApliOper',
                    iconCls: 'aplicar',
                    text: idioma.lbBtnAplicar,
                    tooltip: idioma.textToolTipAplicar,
                    disabled: true
                }), this.btnAcepOper = new Ext.Button({
//                    icon: perfil.dirImg + 'aceptar.png',
                    id: 'btnAcepOper',
                    iconCls: 'aceptar',
                    text: idioma.lbBtnAceptar,
                    tooltip: idioma.textToolTipAceptar,
                    disabled: true
                })]
        });

        //componentes de la diferencia

        // define a custom summary function
        Ext.grid.GroupSummary.Calculations['totalCost'] = function(v, record, field) {
            return v;
        };

        this.gpDiferencias = new Ext.grid.EditorGridPanel({
            store: model.stDiferencias,
            frame: true,
            height: 310,
            border: true,
            anchor: '100',
            autoExpandColumn: 'descripcion',
            autoScroll: true,
            plugins: new Ext.grid.GroupSummary(),
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            forceFit: true,
            tbar: [this.btnAddDif = new Ext.Button({
                    id: 'btnAddDif',
//                    icon: perfil.dirImg + 'adicionar.png',
                    iconCls: 'adicionar',
                    disabled: true,
                    text: idioma.lbBtnAdd,
                    tooltip: idioma.textToolTipDifAdd
                }), this.btnDelDif = new Ext.Button({
                    id: 'btnDelDif',
//                    icon: perfil.dirImg + 'eliminar.png',
                    disabled: true,
                    iconCls: 'eliminar',
                    text: idioma.lbBtnEliminar,
                    tooltip: idioma.textToolTipDifElim
                }),
                this.btnCorregirDif = new Ext.Button({
                    id: 'btnCorregirDif',
//                    icon: perfil.dirImg + 'nuevacorrconbanco.png',
                    iconCls: 'nuevacorrconbanco',
                    disabled: true,
                    text: idioma.lbBtnCorregir,
                    tooltip: idioma.lbTitleCorrecDif
                })],
            columns: [{
                    align: 'right',
                    hidden: true,
                    dataIndex: 'gruopfield'
                }, {
                    header: idioma.lbDebito,
                    columnWidth: .2,
                    align: 'right',
                    sortable: true,
                    dataIndex: 'debito',
                    renderer: formatoMoneda,
                    summaryType: 'sum',
                    summaryRenderer: formatoMoneda
                }, {
                    header: idioma.lbCredito,
                    columnWidth: .2,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'credito',
                    renderer: formatoMoneda,
                    summaryType: 'sum',
                    summaryRenderer: formatoMoneda
                }, {
                    id: 'descripcion',
                    header: idioma.lbGridDescripcion,
                    align: 'left',
                    columnWidth: .8,
                    sortable: true,
                    dataIndex: 'descripcion'
                }],
            view: new Ext.grid.GroupingView({
                forceFit: false,
                showGroupName: false,
                enableNoGroups: false, // REQUIRED!
                hideGroupedColumn: true
            })

        });
        scope.gpDiferencias.getView().getRowClass = function(record, index, rowParams, store) {
            if (record.get('nuevo'))
                return 'FilaRoja';
        };

        //debito o credito de las diferencias
        // this.tfdebcred = new Ext.form.TextField({
        //     id: 'tfdebcred',
        //     disabled: false,
        //     fieldLabel: idioma.lbImporte,
        //     style: 'text-align: right',
        //     disabledClass: 'disabled-component',
        //     anchor: '100%',
        //     enableKeyEvents: true,
        //     selectOnFocus: true,
        //     maskRe: /^([0-9 \,\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        //     regex: /^([0-9 \,\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        //     maxLength: 19,
        //     allowBlank: false,
        //     regexText: idioma.msgErrorDigitos,
        //     maxLengthText: idioma.msgErrorDigitos
        // });

        this.tfdebcred = new Ext.form.NumberField({
            id: 'tfdebcred',
            disabled: false,
            fieldLabel: idioma.lbImporte,
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            decimalPrecision: 2,
            anchor: '100%',
            enableKeyEvents: true,
            allowNegative: false,
            selectOnFocus: true,
            maskRe: /^([0-9 \,\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            regex: /^([0-9 \,\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            maxLength: 16,
            allowBlank: false,
            regexText: idioma.msgErrorDigitos,
            maxLengthText: idioma.msgErrorDigitos
        });

        //comentario de las diferencias
        this.tacoment = new Ext.form.TextArea({
            fieldLabel: idioma.lbComent,
            anchor: '100%',
            height: 50,
            disabledClass: 'disabled-component',
            maskRe: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\;\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-ó, ñ, á, é, í, ú, Ñ, xfc-ü   Espacios y caracteres especiales
            regex: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-ó, ñ, á, é, í, ú, Ñ, xfc-ü  Espacios y caracteres especiales
            maxLength: 255,
             maxLengthText: idioma.validateLongtacomentario,
            allowBlank: false,
            regexText: idioma.lbregexTextComentarioDif,
            enableKeyEvents: true,
            selectOnFocus: true
        });

        //radio para el debito
        this.rbtndebito = new Ext.form.Radio({
            boxLabel: idioma.lbDebito,
            hideLabel: true,
            name: 'fav-color',
            inputValue: 'rbtndebito',
            checked: true
        });

        //radio para el credito
        this.rbtncredito = new Ext.form.Radio({
            boxLabel: idioma.lbCredito,
            hideLabel: true,
            name: 'fav-color',
            inputValue: 'rbtncredito'
        });

        //panel diferencas del banco
        this.fpdifbanco = new Ext.FormPanel({
            frame: true,
            border: false,
            height: 420,
            layout: 'form',
            labelAlign: 'top',
            items: [{
                    rowHeight: .25,
                    labelAlign: 'top',
                    layout: 'column',
                    items: [{
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .32,
                            items: [{
                                    layout: 'column',
                                    items: [{
                                            layout: 'form',
                                            columnWidth: .5,
                                            items: [scope.rbtndebito]
                                        }, {
                                            style: 'margin:0 0 0 25',
                                            layout: 'form',
                                            columnWidth: .5,
                                            items: [scope.rbtncredito]
                                        }]
                                }, {
                                    layout: 'form',
                                    columnWidth: .3,
                                    items: [scope.tfdebcred]
                                }]
                        }, {
                            labelAlign: 'top',
                            style: 'margin:5 5 0 10',
                            layout: 'form',
                            columnWidth: .68,
                            items: [scope.tacoment]
                        }]
                }, {
                    style: 'margin:5 5 0 5',
                    columnWidth: 1,
                    layout: 'fit',
                    items: [scope.gpDiferencias]
                }]
        });

        //ventana de las diferencias
        this.winDiferencias = new Ext.Window({
            autoValidate: false,
            constrain: true,
            title: idioma.lbTitleDifCorrecBanco,
            layout: 'fit',
            width: 670,
            minWidth: 670,
            autoHeight: true,
            modal: true,
            closeAction: 'hide',
            items: scope.fpdifbanco,
            buttons: [this.btnCancDif = new Ext.Button({
                    id: 'btnCancDif',
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    text: idioma.lbBtnCancelar,
                    tooltip: idioma.textToolTipCancelar
                }), this.btnAcepDif = new Ext.Button({
                    id: 'btnAcepDif',
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    text: idioma.lbBtnAceptar,
                    tooltip: idioma.textToolTipAceptar
                })]
        });

        //importe de la difererencia
        this.tfimportedif = new Ext.form.TextField({
            fieldLabel: idioma.lbDiferencia,
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            disabled: true,
            width: 140
        });

        //importe de la  correccion
        this.tfimportecorrec = new Ext.form.TextField({
            fieldLabel: idioma.lbCorreccion,
            style: 'text-align: right',
            selectOnFocus: true,
            disabledClass: 'disabled-component',
            width: 140,
            maskRe: /^([0-9\,\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            regex: /^([0-9\,\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            maxLength: 19,
            allowBlank: false,
            enableKeyEvents: true
        });

        //ventana de las correcciones
        this.winCorreccion = new Ext.Window({
            autoValidate: true,
            constrain: true,
            title: idioma.lbTitleCorrecDif,
            layout: 'form',
            //labelWidth: 10,
            width: 285,
            modal: true,
            autoHeight: true,
            bodyStyle: 'padding:5px;',
            closeAction: 'hide',
            items: [{
                    layout: 'form',
                    frame: true,
                    items: [this.tfimportedif, this.tfimportecorrec]
                }],
            buttons: [this.btnCancCorrecc = new Ext.Button({
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    text: idioma.lbBtnCancelar,
                    tooltip: idioma.textToolTipCancelar
                }), this.btnAcepCorrecc = new Ext.Button({
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    text: idioma.lbBtnAceptar,
                    tooltip: idioma.textToolTipAceptar
                })]
        });



    }
};
/*
 //Inicializando la vista.
 Ext.QuickTips.init();
 var perfil = window.parent.perfil
 perfil.etiquetas = Object();

 UCID.portal.cargarEtiquetas('estadocuenta', function(){

 //Inicializar el modelo
 var model = Banco.Estadocta.Model;
 model.init();

 //Inicializar la vista.
 var view = Banco.Estadocta.View;
 view.init(perfil.etiquetas,model);

 //Inicializar controlador.
 var controller = Banco.Estadocta.Controller;
 Banco.Estadocta.Controller.init(perfil.etiquetas,view,model);
 //se manda a cargar la fecha contable
 controller.loadDataIni();
 //controller.cargarFechaContable();
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
        var model = Banco.Estadocta.Model;
        model.init();

        //Inicializar la vista.
        var view = Banco.Estadocta.View;
        view.init(etiquetas, model);

        //Inicializar controlador.
        var controller = Banco.Estadocta.Controller;
        Banco.Estadocta.Controller.init(etiquetas, view, model);
        //se manda a cargar la fecha contable
        controller.loadDataIni();
        //controller.cargarFechaContable();
    }
});
