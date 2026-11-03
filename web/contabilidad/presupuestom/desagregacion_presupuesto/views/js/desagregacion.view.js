Ext.namespace('Desagregacion');
Ext.QuickTips.init();
/*Ext.Msg.wait('Cargando... por favor espere!');
Ext.Ajax.request{
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        new Desagregacion.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
        Ext.Msg.hide();
    }
});*/

Desagregacion.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params, fecha, bandera, fechainicio) {

        function formatoMoneda(v) {
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
            v = String(v);
            var ps = v.split(".");
            var whole = ps[0];
            var sub = ps[1] ? "." + ps[1] : ".00";
            var r = /(\d+)(\d{3})/;
            while (r.test(whole))
                whole = whole.replace(r, "$1" + "," + "$2");
            v = whole + sub;
            if (v.charAt(0) == "-")//caso saldo negativo
                return "(" + v.substr(1) + ")";
            return v;
        }

        var scope = this;
        var fechaContable = fecha;
        var fechaInicio = fechainicio;
        scope.title = "";
        scope.tipo = params
        this.model = Desagregacion.Store.Model;
        this.model.init(scope.tipo, this);
        this.tipo_operacion = new Ext.data.SimpleStore({
            fields: ['operacion', 'operacion2'],
            data: [['01 (Salario)', 'Desagrego el Presupuesto para los mandos por salario'], ['02 (Otros Gastos)', 'Desagrego el Presupuesto para los mandos para otros gastos'], ['03 (Inversiones)', 'Desagrego el Presupuesto para los mandos por gastos capital']]
        });
        this.stTipoCuenta = new Ext.data.SimpleStore({
            fields: ['idcuenta', 'textometdconc'],
            data: [
                [1, 'Debito'], [2, 'Credito']
            ]
        });

        this.aux = new Ext.data.SimpleStore({
            fields: ['aux'],
            data: [[123], [254], [696]]
        });
        this.rowactionMod = new Ext.grid.RowActions({
            id: 'idRowactionn',
            actions: [
                {
                    id: 'modificar',
                    //tooltip: scope.etiquetas.lbToolDel,
                    iconCls: 'modificar',
                    tooltip: 'Modificar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });
        this.rowactionDel = new Ext.grid.RowActions({
            id: 'idRowaction',
            widthSlope: 30,
            align: 'right',
            //header: "",
            actions: [
                {
                    id: 'eliminar',
                    // tooltip: this.idioma.lbtpEliminar,
                    tooltip: 'Eliminar',
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16,
                    hideIndex: 'shEliminar',
                    //textIndex: 'um'
                },
            ]
        });

        scope.rowEditor = new Ext.Cont.RowEditor({
            cancelText: 'Cancelar',
            saveText: 'Aceptar',
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            //saveTooltip: this.idioma.lbToolRowEditorAceptar,
            //cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });
        scope.rowEditorConfig = new Ext.Cont.RowEditor({
            cancelText: 'Cancelar',
            saveText: 'Aceptar',
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            //saveTooltip: this.idioma.lbToolRowEditorAceptar,
            //cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });
        this.smoperacion = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        this.smoperacionnueva = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        this.smconfoperacion = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        this.smoperacion.row


            this.edircbCuenta = new Ext.form.ComboBox({
                typeAhead: true,
                mode: 'local',
                // disabled:true,
                fieldLabel: 'operacion',
                align: 'right',
                valueField: 'idcuenta',
                displayField: 'textometdconc',
                store: this.stTipoCuenta,
                triggerAction: 'all',
                lazyRender: true,
                allowBlank: false,
                disable: true,
            });
        this.cbDenominacion_Operacion = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            typeAhead: true,
            mode: 'local',
            align: 'right',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            store: this.model.store_operacion,
            triggerAction: 'all',
            lazyRender: true,
            allowBlank: false,
        })
        this.cbDenominacion_Operacion_Movimiento = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            typeAhead: true,
            mode: 'local',
            align: 'right',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            store: this.model.store_operacion,
            triggerAction: 'all',
            lazyRender: true,
            allowBlank: false,
        })

        this.titulocolumnaOperacion = (scope.tipo == 1) ? 'Operación debito' : 'Operación'

        this.GridConfig = new Ext.grid.EditorGridPanel({
            id: 'button-grid',
            sm: this.smconfoperacion,
            region: 'center',
            plugins: [scope.rowEditorConfig],
            cm: (scope.tipo == 1) ? new Ext.grid.ColumnModel([
                    {
                        id: 'tipo',
                        header: "Tipo",
                        width: 30,
                        sortable: true,
                        dataIndex: 'nombre_tipo',
                        disable: true,
                        align: 'left',
                        editor: new Ext.form.TextField({
                            allowBlank: false,
                            disabled: true,
                            store: this.model.store_desagregacion
                        })
                    }, {
                        header: this.titulocolumnaOperacion,
                        id: 'operacion',
                        dataIndex: 'nombre_operacion',
                        valueField: 'id',
                        align: 'left',
                        editor: scope.cbDenominacion_Operacion,
                        hidden: false
                    }, {
                        header: 'Operación credito',
                        id: 'operacion',
                        dataIndex: 'nombre_operacion_movimiento',
                        valueField: 'id_credito_movimiento',
                        align: 'left',
                        editor: scope.cbDenominacion_Operacion_Movimiento,
                        hidden: (scope.tipo == 1) ? false : true
                    }
                ])
                : new Ext.grid.ColumnModel([
                    {
                        id: 'tipo',
                        header: "Tipo",
                        width: 30,
                        sortable: true,
                        dataIndex: 'nombre_tipo',
                        align: 'left',
                        disable: true,
                        editor: new Ext.form.TextField({
                            allowBlank: false,
                            disabled: true,
                            store: this.model.store_desagregacion
                        })
                    },
                    {
                        header: this.titulocolumnaOperacion,
                        id: 'operacion',
                        dataIndex: 'nombre_operacion',
                        valueField: 'id',
                        align: 'left',
                        editor: scope.cbDenominacion_Operacion,
                        hidden: false
                    }
                ]),
            layout: 'fit',
            //sm: this.smoperacion,
            store: this.model.store_tipo_operacion,
            viewConfig: {
                forceFit: true
            },
            frame: true
        });
        //****--------- Botones-----------***********
        this.btnAdicionar = new Ext.Button({
            text: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar'
        });
        this.btnAdicionarPresupuesto = new Ext.Button({
            text: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar'
        });
        this.btnReporte = new Ext.Button({
            text: 'Vista Reporte',
            tooltip: 'Vista Reporte',
            disabled: true,
            iconCls: 'vistareporte'
        });
        this.btnDuplicar = new Ext.Button({
            text: 'Duplicar',
            disabled: true,
            iconCls: 'duplicar'
        });
        this.btnCancelar = new Ext.Button({
            text: 'Cancelar',
            disabled: true,
            iconCls: 'cancelar'
        });
        this.btnEliminar = new Ext.Button({
            text: 'Eliminar',
            disabled: true,
            iconCls: 'eliminar'
        });
        this.btnMod = new Ext.Button({
            text: 'Modificar',
            disabled: true,
            iconCls: 'modificar'
        });
        this.btnConfirmar = new Ext.Button({
            text: 'Confirmar',
            disabled: true,
            iconCls: 'confirmar'
        });
        this.btnPostear = new Ext.Button({
            text: 'Postear',
            disabled: true,
            iconCls: 'contabilidad'
        });
        this.btnConfiguracion = new Ext.Button({
            text: 'Configuracion',
            disabled: false,
            id: 'configuracion',
            iconCls: 'configuracion'
        });

        //****--------- Botones-----------***********
        //****--------- Grid-----------***********
        this.pagingBar = new Ext.PagingToolbar({
            pageSize: 30,
            displayInfo: true,
            clearFilter: true,
            store: this.model.stobteneragrupaciones,
            toggleHandler: function (btn, pressed) {
                var as = this.GridPrincipal.getView();
                as.showPreview = pressed;
                as.refresh();
            }
        });
        this.pagingBarGridPresupuesto = new Ext.PagingToolbar({
            pageSize: 30,
            displayInfo: true,
            clearFilter: true,
            store: this.model.store_desagregacion,
            toggleHandler: function (btn, pressed) {
                var as = this.GridPresupuesto.getView();
                as.showPreview = pressed;
                as.refresh();
            }
        });

        this.cbOperacion = new Ext.form.ComboBox({
            id: 'cbOperacion',
            header: "Tipo",
            width: 150,
            dataIndex: 'operacion2',
            valueField: 'operacion2',
            align: 'left',
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                mode: 'local',
                fieldLabel: 'operacion',
                align: 'left',
                valueField: 'operacion',
                displayField: 'operacion',
                store: scope.tipo_operacion,
                triggerAction: 'all',
                lazyRender: true,
                allowBlank: false
            })
        })

        this.entidadesEdit = new Ext.form.ComboBox({
            id: 'cbentidades',
            anchor: '100%',
            fieldLabel: 'Entidades',
            allowBlank: false,
            forceSelection: true,
            disabled: false,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 3,
            store: this.stentidades = new Ext.data.JsonStore({
                url: 'obtenerEntidadesParaBusqueda',
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'id'
                    }, {
                        name: 'text'
                    }
                ]
            }),
            valueField: 'id',
            displayField: 'text',
            autoLoad: true,
        });

        this.NAEEdit = new Ext.form.ComboBox({
            id: 'idcentrogrupo',
            anchor: '100%',
            fieldLabel: 'Grupo',
            allowBlank: false,
            forceSelection: true,
            disabled: false,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 3,
            store: this.stgrupo = new Ext.data.JsonStore({
                url: 'obtenerCentroCosto',
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'idcentrogrupo'
                    }, {
                        name: 'text'
                    }
                ]
            }),
            valueField: 'idcentrogrupo',
            displayField: 'text',
            autoLoad: true
        });

        scope.elementoGasto = new Ext.form.ComboBox({
            id: 'idelementoobjeto',
            anchor: '100%',
            fieldLabel: 'Epigrafe',
            allowBlank: false,
            forceSelection: true,
            disabled: false,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 3,
            store: this.stgrupo = new Ext.data.JsonStore({
                url: 'obtenerElementosGasto',
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'idelementoobjeto'
                    }, {
                        name: 'text'
                    }, {
                        name: 'concat'
                    }
                ]
            }),
            valueField: 'idelementoobjeto',
            displayField: 'concat',
            autoLoad: true
        });

        this.btnImportar = new Ext.Button({
            id:'btnImportar',
            text:'Importar',
            tooltip: 'Importar',
            tabIndex: 314,
            iconCls: 'importar',

        })

        /* scope.elementoGasto = new Ext.CONT.UIXCombo({
             emptyText: 'Seleccione...',//scope.etiquetas.txtSeleccione,
             invalidText: "Este campo es obligatorio.",
             allowBlank: true,
             loaded: false,
             fieldLabel: "Elementos de Gasto",
             tabIndex: 8
         }, {
             identificador: 'Elemento',
             displayText: 'text',
             url: 'obtenerElementosGasto',
             height: 200,
             autoLoad: true,
             singleSelect: true,
             reader: scope.jrelementogasto = new Ext.data.JsonReader({
                 id: 'idelementoobjeto'
                 //root: 'datos'
             }, [{
                 name: '_parent'
             }, {
                 name: '_is_leaf'
             }, {
                 name: 'idelementoobjeto'
             }, {
                 name: 'codigo',
                 mapping: 'concat'
             }, {
                 name: 'text'
             }])
         });*/

        this.comboespecialidad = new Ext.form.ComboBox({
            id: '_id',
            anchor: '100%',
            fieldLabel: 'Especialidad',
            allowBlank: false,
            forceSelection: true,
            disabled: false,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            // pageSize: 100,
            minChars: 2,
            store: this.stgrupo = new Ext.data.JsonStore({
                url: 'obtenerEspecialidad',
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: '_id'
                    }, {
                        name: 'text'
                    }
                ]
            }),
            valueField: '_id',
            displayField: 'text',
            autoLoad: true,
        });

        this.editUM = new Ext.form.ComboBox({
            id: 'cbentidades',
            anchor: '100%',
            fieldLabel: 'Entidades',
            allowBlank: false,
            forceSelection: true,
            //disabled: true,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 2,
            store: this.stentidades = new Ext.data.JsonStore({
                url: 'obtenerEntidadesParaBusqueda',
                baseParams: {
                    tipo: scope.tipo
                },
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'text'
                    }, {
                        name: 'idestructurae'
                    }
                ]

            }),
            autoLoad: true,
            valueField: 'idestructurae',
            displayField: 'text',
        });
        this.fechaoperacion = new Ext.form.DateField({
            fieldLabel: 'Fecha',//idioma.lbDesde,
            name: 'desdeintrv',
            id: 'desdeintrv',
            // vtype: 'daterange',
            // endDateField: 'hastaintrv',
            invalidText: 'El formato establecido: dd/mm/aaaa.',
            format: 'd/m/Y',
            readOnly: true,
            anchor: '95%'
        })

        var noComprobante = new Ext.Cmpaction();

//****** COLUMN MODEL DEL GRID DE LA VENTANA
        this.cmAdicionar = new Ext.grid.ColumnModel([
            scope.cbOperacion,
            {
                id: 'cbUM',
                header: "UM",
                align: 'left',
                width: 250,
                dataIndex: 'unidad_militar',
                valueField: 'unidadm',
                renderer: function (value, metadata, record, rowIndex, colIndex, storegrid) {
                    return record.data.unidad_militar;
                },
                editor: this.editUM
            },
            {
                header: "Especialidad",
                id: 'especialidad',
                dataIndex: 'especialidadcargar',
                valueField: 'especialidad',
                align: 'left',
                editor: this.comboespecialidad,
                width: 150
            },
            {
                header: "Grupo",
                id: 'grupo',
                dataIndex: 'descripcion_NAE',
                valueField: 'grupo',
                align: 'left',
                editor: this.NAEEdit,
                width: 150
            },
            {
                header: "Epigrafe",
                dataIndex: 'elemento_gasto',
                valueField: 'grupo',
                id: 'partida',
                align: 'left',
                editor: this.elementoGasto,
                width: 150
            },
            {
                id: 'cuenta',
                header: "Credito/Debito",
                align: 'left',
                width: 150,
                disable: true,
                dataIndex: 'string_cuenta',
                valueField: 'naturaleza_cuenta',
                editor: this.edircbCuenta
            },
            {
                header: "Importe",
                dataIndex: 'importe',
                id: 'importe',
                align: 'right',
                width: 180,
                renderer: formatoMoneda(),
                editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 9999999999999,
                    allowBlank: false
                })
            },
            scope.rowactionDel
        ]);

        //---COLUMN MODEL DEL GRIP PRINCIPAL DE AFUERA
        this.cm = new Ext.grid.ColumnModel([
            {
                header: "No",
                id: 'no',
                dataIndex: 'numerodoc',
                valueField: 'numerodoc',
                align: 'right',
                width: 10
            }, {
                header: "Fecha",
                dataIndex: 'fecha_operacion',
                valueField: 'fecha_operacion',
                id: 'fechaoperacion',
                width: 20,
                align: 'right',
                sortable: true,
                readOnly: true,
                // dateFormat: 'n/j/Y',
                format: 'd/m/Y',
                type: 'date',
                renderer: Ext.util.Format.dateRenderer('d/m/Y')

            }, {
                header: "Descripcion",
                id: 'Descripcion',
                dataIndex: 'descripcion',
                valueField: 'descripcion',
                align: 'right',
                width: 100
            }, {
                header: "Estado",
                id: 'Descripcion',
                dataIndex: 'nomEstado',
                valueField: 'idestado',
                align: 'right',
                width: 100
            }, {
                header: "Importe Debe",
                id: 'ImporteD',
                dataIndex: 'importedebe',
                valueField: 'importedebe',
                renderer: formatoMoneda(),
                align: 'right',
                width: 100
            }, {
                header: "Importe Haber",
                id: 'ImporteH',
                dataIndex: 'importehaber',
                valueField: 'importehaber',
                renderer: formatoMoneda(),
                align: 'right',
                width: 100
            }, {
                header: "Importe Total",
                renderer: formatoMoneda(),
                dataIndex: 'importe_total',
                valueField: 'importe_total',
                sortable: true,
                id: 'importe_total',
                align: 'right',

            },
            /* scope.rowactionMod,*/noComprobante/*,scope.rowactionDel*/
        ]);
        scope.lfdPeriodo = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });
        scope.lfdEjercicio = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });
        scope.lfdPeriodo.setText('Fecha contable: ' + fechaContable);
        scope.lfdEjercicio.setText('Ejercicio: ');

        scope.GridPrincipal = new Ext.grid.GridPanel({
            bbar: scope.pagingBar,
            clicksToEdit: 3,
            loadMask: true,
            singleSelect: false,
            id: 'button-grid',
            region: 'center',
            cm: scope.cm,
            layout: 'fit',
            sm: scope.smoperacion,
            store: scope.model.stobteneragrupaciones,
            plugins: [/*scope.rowEditor,*/noComprobante/*,scope.rowactionDel*/],
            /* handler: function () {
                 this.rowEditor.stopEditing();
                 this.rowEditor.startEditing(0, 0);
                             },*/
            viewConfig: {
                forceFit: true
            },

            tbar: [scope.btnAdicionarPresupuesto, '', '', '', scope.btnMod, '', '', '', scope.btnEliminar, '', '', '', scope.btnCancelar, '', '', '', scope.btnConfirmar, '', '', '', scope.btnPostear,'', '', '',scope.btnImportar, '|', scope.btnConfiguracion, '->', scope.lfdPeriodo, '', '', '', scope.lfdEjercicio, '', Caja.Componentes.cbEjercicio],
            frame: true
        });


        this.filters = new Ext.grid.GridFilters({
            filtersText: 'Búsqueda',
            filters: [
                //{type: 'numeric', dataIndex: 'no_doc_string'},
                {type: 'string', dataIndex: 'especialidadcargar'},
                {type: 'string', dataIndex: 'unidad_militar'}
            ]
        });
        this.lfTotalfiltrado = new Ext.form.Label({
            id: 'lfTotal1',
            text: '',
            style: 'font-weight:bold;',
            hidden:true,
            style:'<span style=color:red;font-weight:bold;>',

        });

        this.GridPresupuesto = new Ext.grid.EditorGridPanel({
            bbar: scope.pagingBarGridPresupuesto,
            clicksToEdit: 2,
            singleSelect: false,
            loadMask: true,
            id: 'buttonn-grid',
            region: 'center',
            cm: scope.cmAdicionar,
            layout: 'fit',
            viewConfig: {
                forceFit: true
            },
            sm: scope.smoperacionnueva,
            store: scope.model.store_desagregacion,
            plugins: [scope.filters, scope.rowEditor, scope.rowactionDel],
            tbar: [scope.btnAdicionar, '', '', '', scope.btnDuplicar, '->',scope.lfTotalfiltrado],
            frame: true
        });

        this.dfFecha = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            disabled: true,
            selectOnFocus: true,
            name: 'fechaem',
            // fieldLabel: etiquetas.lbTooFechaSolicitud,
            fieldLabel: 'Fecha',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            allowBlank: false,
            // maxValue: new Date(),
            value: fechaContable,
            minValue: fechaInicio,
            maxValue: fechaContable,
            readOnly: true,
            anchor: '95%'
            //width: 150
        });

        this.tacomentario = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            disabled: true,
            selectOnFocus: true,
            name: 'descripcion',
            id: 'tacometario',
            maxLength: 100,
            maxLengthText: 'Maximo 100 caracteres',
            fieldLabel: 'Descripcion',
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            //width:300,
            allowBlank: false,
            enableKeyEvents: true,
            anchor: '100%',

        });

        this.panelsur = new Ext.FormPanel({
            labelAlign: 'top',
            //height: 65,
            autoHeight: true,
            frame: true,
            region: 'south',
            layout: 'fit',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .12,
                    layout: 'form',
                    items: [this.dfFecha]
                }, {
                    columnWidth: .88,
                    layout: 'form',
                    margin: '0 0 0 0 10',
                    items: [this.tacomentario]
                }]
            }]
        });
        this.panelPresupuesto = new Ext.Panel({
            frame: false,
            layout: 'border',
            items: [this.panelsur, this.GridPresupuesto]
        });
        scope.winAdicionarPresupuesto = new Ext.Window({
            title: 'Adicionar nuevas operaciones',
            width: '100%',
            maximized: true,
            height: 700,
            layout: 'fit',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            maximizable: true,
            frame: true,
            items: this.panelPresupuesto,
            buttons: [
                this.btnAceptarConjuntoOperaciones = new Ext.Button({
                    iconCls: 'aceptar',
                    disabled: true,
                    //tooltip: etiquetas.lbBtnTooltipCerrar,
                    text: 'Aceptar',
                }),
                this.btnCerrarpanelpresupuesto = new Ext.Button({
                    iconCls: 'cerrar',
                    //tooltip: etiquetas.lbBtnTooltipCerrar,
                    text: 'Cerrar'
                    /*handler: function () {
                        //this.GridConfig.resumeEvents();
                        this.winAdicionarPresupuesto.hide();
                        this.model.store_desagregacion.baseParams.id_docpresupuesto = 0;
                        this.model.store_desagregacion.reload();
                        // this.GridConfig.removeAll();
                    }.bind(this)*/
                })
            ]
        });


        //--------PARA VISYUALIZAR LOS ELEMENTOS DESPUES DE CONFIRMAR OPERACION-------------------------------------------------------//

        this.cmMostrarDatos = new Ext.grid.ColumnModel([
            {
                id: 'cbOperacion',
                header: "Tipo",
                width: 150,
                dataIndex: 'operacion2',
                valueField: 'operacion2',
                align: 'left'
            }, {
                id: 'cbUM2',
                header: "UM",
                align: 'left',
                width: 250,
                dataIndex: 'unidad_militar',
                valueField: 'unidadm',
                renderer: function (value, metadata, record, rowIndex, colIndex, storegrid) {
                    return record.data.unidad_militar;
                }
            },
             {
                header: "Especialidad",
                id: 'especialidad2',
                dataIndex: 'especialidadcargar',
                valueField: 'especialidad',
                align: 'left',
                width: 150
            },
            {
                header: "Grupo",
                id: 'grupo2',
                dataIndex: 'descripcion_NAE',
                valueField: 'grupo',
                align: 'left',
                width: 200
            }, {
                header: "Epígrafe",
                dataIndex: 'elemento_gasto',
                valueField: 'grupo',
                id: 'partida2',
                align: 'left',
                width: 200
            }, {
                id: 'cuenta2',
                header: "Credito/Debito",
                align: 'left',
                width: 70,
                disable: true,
                dataIndex: 'string_cuenta',
                valueField: 'naturaleza_cuenta',
            }, {
                header: "Importe",
                dataIndex: 'importe',
                id: 'importe2',
                align: 'right',
                renderer: formatoMoneda(),
            }
        ]);

        this.GridOplast = new Ext.grid.EditorGridPanel({
            bbar: scope.pagingBarGridPresupuesto,
            singleSelect: false,
            loadMask: true,
            id: 'buttonn-grid',
            region: 'center',
            cm: scope.cmMostrarDatos,
            layout: 'fit',
            //plugins: [scope.filters2],
            viewConfig: {
                forceFit: true
            },
            sm: scope.smoperacionnueva,
            store: scope.model.store_desagregacion,
            frame: true
        });

        this.panelLastSave = new Ext.Panel({
            frame: false,
            layout: 'border',
            items: [this.GridOplast]
        });

        scope.winMostrarLastConfirmar = new Ext.Window({
            title: 'Operaciones',
            width: '65%',
            height: 700,
            layout: 'fit',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            maximizable: true,
            maximized: true,
            frame: true,
            items: this.panelLastSave,
            buttons: [
                this.btnCerrar = new Ext.Button({
                    iconCls: 'cerrar',
                    //tooltip: etiquetas.lbBtnTooltipCerrar,
                    text: 'Cerrar',
                    handler: function () {
                        //this.GridConfig.resumeEvents();
                        this.winMostrarLastConfirmar.hide();
                        this.model.store_desagregacion.baseParams.id_docpresupuesto = 0;
                        this.model.store_desagregacion.reload();
                        // this.GridConfig.removeAll();
                    }.bind(this)
                })
            ]
        });

        //****--------- Grid-----------***********
        this.pgeneral = new Ext.Panel({
            frame: false,
            layout: 'border',
            items: [this.GridConfig/*, this.panelsur*/],
        });

        scope.winConfig = new Ext.Window({
            title: 'Configuracion',
            width: '40%',
            height: 400,
            layout: 'fit',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            maximizable: true,
            frame: true,
            items: this.pgeneral,
            buttons: [
                this.btnCerrar = new Ext.Button({
                    iconCls: 'cerrar',
                    //tooltip: etiquetas.lbBtnTooltipCerrar,
                    text: 'Cerrar',
                    handler: function () {
                        //this.GridConfig.resumeEvents();
                        this.winConfig.hide();
                        // this.GridConfig.removeAll();

                    }.bind(this)
                })
            ]
        });


        //****--------- Paneles-----------***********

        if (scope.tipo == 3)
            scope.title = "Desagregacion del Presupuesto";
        else if (scope.tipo == 1)
            scope.title = "Movimiento del Presupuesto";
        else if (scope.tipo == 2)
            scope.title = "Asignacion del Presupuesto";
        this.panelPrincipal = new Ext.Panel({
            layout: 'border',
            title: scope.title,
            region: 'center',
            layout: 'fit',
            items: [scope.GridPrincipal]
        });
        //****--------- Paneles-----------***********
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            idioma: params.idioma,
            items: [this.panelPrincipal]
        });

        var controller = Desagregacion.Presupuesto.Controller;
        controller.init(params.idioma, this, this.model, scope.tipo, bandera);


        Desagregacion.Viewport.superclass.constructor.call(this, params);

    }


});
