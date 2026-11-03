Ext.ns('Pvd.ControlAsistencia.PlanificacionVacaciones');
//Vista del componente.
Pvd.ControlAsistencia.PlanificacionVacaciones.Vista = {

    init: function (idioma, modelo) {
        var self = this;
        this.fecha = new Date();
        this.filtro = '';

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaRTDMasivo',
            text: idioma.btnAyuda,
            iconCls: 'ayuda',
            disabled: false,
            tooltip: idioma.lbBtnAyuda
        });

        this.estructura = new Ext.estructura.panel.PanelEstructura({
            region: 'center',
            split: true,
            margins: '5 0 5 5',
            cmargins: '5 5 5 5',
            width: '25%',
            //Otros parametros
            inicial: perfil.idestructuracomun // codigo|id, Indica a partir de que estructura debe abrir el arbol
        });
        this.estructura.tree.enableDD = true;

        this.comboYear = new Ext.form.ComboBox({
            id: 'comboYear',
            store: modelo.storeYear,
            displayField: 'denominacion',
            valueField: 'idyear',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            width: 150,
            value: this.fecha.getFullYear()
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            emptyText: idioma.lbMsgcriterioBuscar,
            minLength: 3,
            maxLength: 60,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.lbBtnBuscar,
            tooltip: idioma.textToolTipBusPersona,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.lbBtnLimpiar,
            tooltip: idioma.textToolTipLimpiar,
            iconCls: 'limpiar'
        });

        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardar,
            iconCls: 'guardar'
        });

        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: 'Generar',
            iconCls: 'documentos',
            menu: {
                items: [
                    {
                        text: 'Planificación de Vacaciones <span style="color:red">' + '(*.pdf)' + '</span>',
                        iconCls: 'informe',
                        icon: '',
                        id: 'exportarplanifvaca',
                        handler: onItemClick
                    }, '-',
                    {
                        text: 'Acta de Posposición de Vacaciones <span style="color:red">' + '(*.pdf)' + '</span>',
                        iconCls: 'informe',
                        icon: '',
                        id: 'actapospvaca',
                        handler: onItemClick
                    }, '-',
                    {
                        text: 'Modelo SC-404 Vacaciones <span style="color:red">' + '(*.pdf)' + '</span>',
                        iconCls: 'informe',
                        icon: '',
                        id: 'exportarsc',
                        handler: onItemClick
                    }
                ]
            }
        });

        function ActivarColoresListado(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('bandera') == 1) {
                metaData.attr = 'ext:qtip="Esta persona venció el límite de días acumulados de vacaciones"';
                return '<span style="color: red"><b>' + val + '</b></span>';
            } else if (record.get('bandera') == 2) {
                metaData.attr = 'ext:qtip="Esta persona está próxima a vencer el límite de días acumulados de vacaciones"';
                return '<span style="color:orange"><b>' + val + '</b></span>';
            } else {
                return val;
            }
        }

        var smPersona = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {}
        });

        var columns = new Array();
        var continentGroupRow = new Array();

        columns.push(smPersona);
        columns.push({
            header: 'idpersona', width: 100, hidden: true, dataIndex: 'idpersona'
        });
        columns.push({
            header: 'No.identidad', width: 90, dataIndex: 'numid', renderer: ActivarColoresListado
        });
        columns.push({
            header: 'Nombre y apellidos', width: 200, dataIndex: 'nombreapellidos', renderer: ActivarColoresListado
        });
        columns.push({
            header: 'Cargo', width: 200, dataIndex: 'denomcargo', renderer: ActivarColoresListado
        });
        columns.push({
            header: 'Área', width: 100, hidden: true, dataIndex: 'area'
        });
        columns.push({
            header: 'bandera', width: 105, hidden: true, dataIndex: 'bandera'
        });

        continentGroupRow.push({header: ' ', align: 'center', colspan: 7});

       /* columns.push({
            header: 'Días', width: 70, dataIndex: 'saldodic', renderer: ActivarColoresListado
        });
        columns.push({
            header: 'Importe', width: 70, dataIndex: 'importedic', renderer: ActivarColoresListado
        });*/
        columns.push({
            header: 'Días', width: 70, dataIndex: 'saldovacacumuladas', renderer: ActivarColoresListado
        });
        columns.push({
            header: 'Importe', width: 70, dataIndex: 'importevacacumuladas', renderer: ActivarColoresListado
        });

        //continentGroupRow.push({header: 'Sub Mayor Vac. Enero', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Vacaciones acumuladas', align: 'center', colspan: 2});

        continentGroupRow.push({header: 'Enero', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Febrero', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Marzo', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Abril', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Mayo', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Junio', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Julio', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Agosto', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Septiembre', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Octubre', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Noviembre', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Diciembre', align: 'center', colspan: 2});

        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinenero', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinenero',
                name: 'priquinenero',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinenero', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinenero',
                name: 'segquinenero',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinfebrero', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinfebrero',
                name: 'priquinfebrero',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinfebrero', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinfebrero',
                name: 'segquinfebrero',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinmarzo', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinmarzo',
                name: 'priquinmarzo',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinmarzo', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinmarzo',
                name: 'segquinmarzo',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinabril', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinabril',
                name: 'priquinabril',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinabril', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinabril',
                name: 'segquinabril',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinmayo', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinmayo',
                name: 'priquinmayo',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinmayo', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinmayo',
                name: 'segquinmayo',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinjunio', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinjunio',
                name: 'priquinjunio',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinjunio', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinjunio',
                name: 'segquinjunio',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinjulio', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinjulio',
                name: 'priquinjulio',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinjulio', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinjulio',
                name: 'segquinjulio',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinagosto', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinagosto',
                name: 'priquinagosto',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinagosto', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinagosto',
                name: 'segquinagosto',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinseptiembre', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinseptiembre',
                name: 'priquinseptiembre',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinseptiembre', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinseptiembre',
                name: 'segquinseptiembre',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinoctubre', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinoctubre',
                name: 'priquinoctubre',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinoctubre', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinoctubre',
                name: 'segquinoctubre',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquinnoviembre', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquinnoviembre',
                name: 'priquinnoviembre',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquinnoviembre', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquinnoviembre',
                name: 'segquinnoviembre',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '1ra Quin', width: 60, dataIndex: 'priquindiciembre', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'priquindiciembre',
                name: 'priquindiciembre',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });
        columns.push({
            header: '2da Quin', width: 60, dataIndex: 'segquindiciembre', renderer: ActivarColoresListado,
            editor: new Ext.form.ComboBox({
                id: 'segquindiciembre',
                name: 'segquindiciembre',
                store: modelo.storeValores,
                displayField: 'valor',
                valueField: 'valor',
                hiddenName: 'valor',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus: true,
                width: '100%'
            })
        });

        this.group = new Ext.ux.grid.ColumnHeaderGroup({
            rows: [continentGroupRow]
        });

        this.cmPersona = new Ext.grid.ColumnModel(columns);

        this.listado = new Ext.grid.EditorGridPanel({
            id: 'listadoPersonas123',
            title: 'Listado de personas',
            store: modelo.fuenteDatosListado,
            loadMask: {msg: idioma.lbMsgmasklistado},
            height: 527,
            plugins: [self.group],
            cm: self.cmPersona,
            sm: smPersona,
            stripeRows: true,
            view: new Ext.grid.GroupingView({
                groupByText: ' ',
                enableGroupingMenu: false,
                enableNoGroups: false,
                showGroupName: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            tbar: [
                this.btnGuardar, '-', 'Año: ',
                this.comboYear, '-',
                this.tfbuscar, '',
                this.btnBuscar,
                this.btnLimpiar, '-',
                this.btnExportar, '->',
                this.btnAyuda
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.fuenteDatosListado,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: "Ning&uacute;n resultado para mostrar"

            }),
        });

        //textfield para el buscar
        this.tfbuscarVac = new Ext.form.TextField({
            id: 'tfbuscarVac',
            allowBlank: true,
            emptyText: idioma.lbMsgcriterioBuscar,
            minLength: 3,
            maxLength: 60,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscarVac = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.lbBtnBuscar,
            tooltip: idioma.textToolTipBusPersona,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiarVac = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.lbBtnLimpiar,
            tooltip: idioma.textToolTipLimpiar,
            iconCls: 'limpiar'
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: 'Eliminar',
            tooltip: 'Eliminar Vacaciones <b>(DEL)</b>',
            iconCls: 'eliminar'
        });

        this.desde = new Ext.form.DateField({
            id: 'desde',
            name: 'fentrada',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
        });

        this.hasta = new Ext.form.DateField({
            id: 'hasta',
            name: 'fsalida',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
        });

        this.btnGenerar = new Ext.Button({
            iconCls: 'exportar',
            text: 'Generar',
            tooltip: 'Generar Modelo de Vacaciones y Registrar Vacaciones <b>(Alt+G)</b>',
        });

        function ActivarColores(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('bandera') == 1) {
                metaData.attr = 'ext:qtip="Esta persona no tiene suficientes días acumulados de vacaciones"';
                return '<span style="color:red"><b>' + val + '</b></span>';
            } else {
                return val;
            }
        }

        function formatDatev(value, metaData, record, rowIndex, colIndex, store) {
            if (value) {
                return (value instanceof Date) ? value.format('d/m/Y') : value;
            }
        };

        function ActivarColoresOrigen(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('origen') == 0) {
                metaData.attr = 'ext:qtip="Estas vacaciones vienen del módulo Gestionar asistencia"';
                return '<span style="color:blue"><b>' + 'Gestionar asistencia' + '</b></span>';
            } else {
                metaData.attr = 'ext:qtip="Estas vacaciones vienen del Plan de vacaciones"';
                return '<span style="color:green"><b>' + 'Plan de vacaciones' + '</b></span>';
            }
        }

        this.smPersonaVac = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {}
        });

        this.listadoModeloVac = new Ext.grid.EditorGridPanel({
            id: 'listadoModeloVac',
            title: 'Listado de personas',
            store: modelo.fuenteDatosListadoModeloVac,
            loadMask: {msg: idioma.lbMsgmasklistado},
            height: 527,
            sm: this.smPersonaVac,
            columns: [this.smPersonaVac,
                {header: 'idpersona', width: 50, hidden: true, dataIndex: 'idpersona'},
                {header: 'idplanvacaciones', width: 50, hidden: true, dataIndex: 'idplanvacaciones'},
                {header: 'No.Identidad', width: 90, dataIndex: 'noidentidad', renderer: ActivarColores},
                {header: 'Nombre y apellidos', width: 200, dataIndex: 'nombreapellidos', renderer: ActivarColores},
                {header: 'Vac. Acumuladas', width: 105, dataIndex: 'vacacumuladas', renderer: ActivarColores},
                {header: 'Quincena', width: 70, dataIndex: 'quincena', renderer: ActivarColores},
                {header: 'Días Naturales', width: 90, dataIndex: 'diasnaturales', renderer: ActivarColores},
                {header: 'Días Hábiles', width: 80, dataIndex: 'diashabiles', renderer: ActivarColores},
                {header: 'Desde', width: 70, dataIndex: 'fdesde', editor: this.desde, renderer: formatDatev},
                {header: 'Hasta', width: 70, dataIndex: 'fhasta', editor: this.hasta, renderer: formatDatev},
                {header: 'idgrupodescanso', width: 70,hidden: true, dataIndex: 'idgrupodescanso'},
                {header: 'mes', width: 50, hidden: true, dataIndex: 'mes'},
                {header: 'Origen', width: 150, dataIndex: 'origen', renderer: ActivarColoresOrigen}
            ],
            stripeRows: true,
            tbar: [
                this.tfbuscarVac, '',
                this.btnBuscarVac, '-',
                this.btnLimpiarVac, '-', '->', '-', this.btnEliminar, '-', this.btnGenerar, '-'
            ],
            view: new Ext.grid.GroupingView({
                groupByText: ' ',
                enableGroupingMenu: false,
                enableNoGroups: false,
                showGroupName: false,
                groupTextTpl: '{text} ({[values.rs.length]})'
            })
        });

        this.btnCerrar = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: idioma.lbBtnCanc,
        });

        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: true,
            constrain: true,
            layout: 'fit',
            title: 'Generar Modelo de Vacaciones',
            width: 950,
            height: 550,
            items: [this.listadoModeloVac],
            buttons: [
                this.btnCerrar
            ]
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: idioma.lbBtnCanc,
        });

        ////////////////////////////////PIE DE FIRMA PARA EL MODELO DE VACACIONES///////////////////////////////////

        //textfield para el buscar
        this.tfbuscarRevisadopor = new Ext.form.TextField({
            id: 'tfbuscarRevisadopor',
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscarRevisadopor = new Ext.Button({
            id: 'btnBuscarRevisadopor',
            text: 'Buscar',
            tooltip: idioma.textToolTipBusPersona,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiarRevisadopor = new Ext.Button({
            id: 'btnLimpiarRevisadopor',
            text: 'Limpiar',
            tooltip: idioma.textToolTipLimpiar,
            iconCls: 'limpiar'
        });

        this.smRevisadopor = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.gpRevisadopor = new Ext.grid.GridPanel({
            id: 'gpRevisadopor',
            tbar: [this.tfbuscarRevisadopor, this.btnBuscarRevisadopor, this.btnLimpiarRevisadopor],
            store: modelo.storeRevisadopor,
            loadMask: {msg: 'Cargando...'},
            sm: this.smRevisadopor,
            width: '100%',
            stripeRows: true,
            height: 527,
            view: new Ext.grid.GroupingView({
                groupByText: ' ',
                groupTextTpl: '{text} ({[values.rs.length]})'
            }),
            columns: [this.smRevisadopor,
                {
                    header: 'idpersona',
                    width: 100,
                    hidden: true,
                    hiddeable: false,
                    dataIndex: 'idpersona',
                    id: 'idpersona'
                },
                {header: 'Carné de identidad', width: 120, dataIndex: 'numid'},
                {header: 'Nombre y apellidos', width: 225, dataIndex: 'nombreapellidos'},
                {header: 'Área', hidden: true, width: 200, dataIndex: 'denomarea'},
                {header: 'Cargo', width: 300, dataIndex: 'denomcargo'}

            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.storeRevisadopor,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: 'No hay resultado(s) que mostrar'
            })
        });

        this.btnAceptarRevisadopor = new Ext.Button({
            id: 'btnAceptarRevisadopor',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.btnCancelarRevisadopor = new Ext.Button({
            id: 'btnCancelarRevisadopor',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)'
        });

        this.winRevisadopor = new Ext.Window({
            title: 'Personas',
            modal: true,
            height: 500,
            width: '50%',
            closable: false,
            constrain: true,
            autoValidate: false,
            resizable: true,
            layout: 'fit',
            items: [self.gpRevisadopor],
            buttons: [self.btnCancelarRevisadopor, self.btnAceptarRevisadopor]
        });

        this.cbRevisadopor = new Ext.form.ComboBox({
            fieldLabel: 'Revisado por',
            anchor: '100%',
            triggerAction: 'all',
            valueField: 'idpersona',
            displayField: 'persona',
            hiddenName: 'persona',
            name: 'idpersona',
            allowBlank: true,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.storecomboRevisadopor
        });

        //textfield para el buscar
        this.tfbuscarAprobadopor = new Ext.form.TextField({
            id: 'tfbuscarAprobadopor',
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscarAprobadopor = new Ext.Button({
            id: 'btnBuscarAprobadopor',
            text: 'Buscar',
            tooltip: idioma.textToolTipBusPersona,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiarAprobadopor = new Ext.Button({
            id: 'btnLimpiarAprobadopor',
            text: 'Limpiar',
            tooltip: idioma.textToolTipLimpiar,
            iconCls: 'limpiar'
        });

        this.smAprobadopor = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.gpAprobadopor = new Ext.grid.GridPanel({
            id: 'gpAprobadopor',
            tbar: [this.tfbuscarAprobadopor, this.btnBuscarAprobadopor, this.btnLimpiarAprobadopor],
            store: modelo.storeAprobadopor,
            loadMask: {msg: 'Cargando...'},
            sm: this.smAprobadopor,
            width: '100%',
            stripeRows: true,
            height: 527,
            view: new Ext.grid.GroupingView({
                groupByText: ' ',
                groupTextTpl: '{text} ({[values.rs.length]})'
            }),
            columns: [this.smAprobadopor,
                {
                    header: 'idpersona',
                    width: 100,
                    hidden: true,
                    hiddeable: false,
                    dataIndex: 'idpersona',
                    id: 'idpersona'
                },
                {header: 'Carné de identidad', width: 120, dataIndex: 'numid'},
                {header: 'Nombre y apellidos', width: 225, dataIndex: 'nombreapellidos'},
                {header: 'Área', hidden: true, width: 200, dataIndex: 'denomarea'},
                {header: 'Cargo', width: 300, dataIndex: 'denomcargo'}

            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.storeAprobadopor,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: 'No hay resultado(s) que mostrar'
            })
        });


        this.btnAceptarAprobadopor = new Ext.Button({
            id: 'btnAceptarAprobadopor',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.btnCancelarAprobadopor = new Ext.Button({
            id: 'btnCancelarAprobadopor',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)'
        });

        this.winAprobadopor = new Ext.Window({
            title: 'Personas',
            modal: true,
            height: 500,
            width: '50%',
            closable: false,
            constrain: true,
            autoValidate: false,
            resizable: true,
            layout: 'fit',
            items: [self.gpAprobadopor],
            buttons: [self.btnCancelarAprobadopor, self.btnAceptarAprobadopor]
        });

        this.cbAprobadopor = new Ext.form.ComboBox({
            fieldLabel: 'Aprobado por',
            anchor: '100%',
            triggerAction: 'all',
            valueField: 'idpersona',
            displayField: 'persona',
            hiddenName: 'persona',
            name: 'idpersona',
            allowBlank: true,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.storecomboAprobadopor
        });

        this.formulario = new Ext.FormPanel({
            labelAlign: 'left',
            frame: true,
            width: '100%',
            autoHeight: true,
            autoShow: true,
            items: [{
                xtype: 'fieldset',
                title: '',
                autoHeight: true,
                items: [{
                    xtype: 'checkbox',
                    boxLabel: 'Modelo con datos',
                    hideLabel: true,
                    id: 'datos',
                    name: 'datos',
                    checked: true
                }]
            }, {
                xtype: 'fieldset',
                id: 'piefirma',
                name: 'piefirma',
                title: 'Pie de Firma',
                autoHeight: true,
                items: [
                    this.cbRevisadopor, this.cbAprobadopor]
            }]
        });

        this.ventanaRadios = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: true,
            constrain: true,
            layout: 'fit',
            title: '',
            width: 400,
            height: 225,
            items: [this.formulario],
            buttons: [
                this.btnCancelar, this.btnAceptar
            ]
        });
        ////////////////////////////////PIE DE FIRMA PARA EL MODELO DE VACACIONES///////////////////////////////////

        ////////////////////////////////PIE DE FIRMA PARA EL ACTA DE POSPOSICION DE VACACIONES///////////////////////////////////

        //textfield para el buscar
        this.tfbuscarPersWin = new Ext.form.TextField({
            id: 'tfbuscarPersWin',
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscarPersWin = new Ext.Button({
            id: 'btnBuscarPersWin',
            text: 'Buscar',
            tooltip: '',
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiarPersWin = new Ext.Button({
            id: 'btnLimpiarPersWin',
            text: 'Limpiar',
            tooltip: '',
            iconCls: 'limpiar'
        });

        this.smPFP = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.gpPersonas = new Ext.grid.GridPanel({
            id: 'gpPersonas',
            tbar: [this.tfbuscarPersWin, this.btnBuscarPersWin, this.btnLimpiarPersWin],
            store: modelo.storePersona,
            loadMask: {msg: 'Cargando...'},
            sm: this.smPFP,
            width: '100%',
            stripeRows: true,
            height: 527,
            view: new Ext.grid.GroupingView({
                groupByText: ' ',
                groupTextTpl: '{text} ({[values.rs.length]})'
            }),
            columns: [this.smPFP,
                {
                    header: 'idpersona',
                    width: 100,
                    hidden: true,
                    hiddeable: false,
                    dataIndex: 'idpersona',
                    id: 'idpersona'
                },
                {header: 'Carné de identidad', width: 120, dataIndex: 'numid'},
                {header: 'Nombre y apellidos', width: 225, dataIndex: 'nombreapellidos'},
                {header: 'Área', hidden: true, width: 200, dataIndex: 'denomarea'},
                {header: 'Cargo', width: 300, dataIndex: 'denomcargo'}

            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.storePersona,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: 'No hay resultado(s) que mostrar'
            })
        });

        this.btnAceptarPersonas = new Ext.Button({
            id: 'btnAceptarPersonas',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.btnCancelarPersonas = new Ext.Button({
            id: 'idbtnCancelarPersonas',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)'
        });

        this.winPersonas = new Ext.Window({
            title: 'Personas',
            modal: true,
            height: 500,
            width: '52%',
            closable: false,
            constrain: true,
            autoValidate: false,
            resizable: true,
            layout: 'fit',
            items: [self.gpPersonas],
            buttons: [self.btnCancelarPersonas, self.btnAceptarPersonas]
        });

        this.cbPersona = new Ext.form.ComboBox({
            fieldLabel: 'Jefe de Área',
            anchor: '100%',
            triggerAction: 'all',
            valueField: 'idpersona',
            displayField: 'persona',
            hiddenName: 'persona',
            name: 'idpersona',
            //allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.storecomboPersona
        });

        //textfield para el buscar
        this.tfbuscarPersWinSS = new Ext.form.TextField({
            id: 'tfbuscarPersWinSS',
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscarPersWinSS = new Ext.Button({
            id: 'btnBuscarPersWin',
            text: 'Buscar',
            tooltip: idioma.textToolTipBusPersona,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiarPersWinSS = new Ext.Button({
            id: 'btnLimpiarPersWin',
            text: 'Limpiar',
            tooltip: idioma.textToolTipLimpiar,
            iconCls: 'limpiar'
        });

        this.smPFPSS = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.gpPersonasSS = new Ext.grid.GridPanel({
            id: 'gpPersonasSS',
            tbar: [this.tfbuscarPersWinSS, this.btnBuscarPersWinSS, this.btnLimpiarPersWinSS],
            store: modelo.storePersonaSS,
            loadMask: {msg: 'Cargando...'},
            sm: this.smPFPSS,
            width: '100%',
            stripeRows: true,
            height: 527,
            view: new Ext.grid.GroupingView({
                groupByText: ' ',
                groupTextTpl: '{text} ({[values.rs.length]})'
            }),
            columns: [this.smPFPSS,
                {
                    header: 'idpersona',
                    width: 100,
                    hidden: true,
                    hiddeable: false,
                    dataIndex: 'idpersona',
                    id: 'idpersona'
                },
                {header: 'Carné de identidad', width: 120, dataIndex: 'numid'},
                {header: 'Nombre y apellidos', width: 225, dataIndex: 'nombreapellidos'},
                {header: 'Área', hidden: true, width: 200, dataIndex: 'denomarea'},
                {header: 'Cargo', width: 300, dataIndex: 'denomcargo'}

            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.storePersonaSS,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: 'No hay resultado(s) que mostrar'
            })
        });

        this.btnAceptarPersonasSS = new Ext.Button({
            id: 'btnAceptarPersonas',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.btnCancelarPersonasSS = new Ext.Button({
            id: 'idbtnCancelarPersonas',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)'
        });

        this.winPersonasSS = new Ext.Window({
            title: 'Personas',
            modal: true,
            height: 500,
            width: '50%',
            closable: false,
            constrain: true,
            autoValidate: false,
            resizable: true,
            layout: 'fit',
            items: [self.gpPersonasSS],
            buttons: [self.btnCancelarPersonasSS, self.btnAceptarPersonasSS]
        });

        this.cbPersonaSS = new Ext.form.ComboBox({
            fieldLabel: 'Miembro de la Sección Sindical',
            anchor: '100%',
            triggerAction: 'all',
            valueField: 'idpersona',
            displayField: 'persona',
            hiddenName: 'persona',
            name: 'idpersona',
            //allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.storecomboPersonaSS
        });

        this.btnAceptarPieFirma = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
        });

        this.btnCancelarPieFirma = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: idioma.lbBtnCanc,
        });

        this.formularioPieFirma = new Ext.FormPanel({
            labelAlign: 'left',
            frame: true,
            width: '100%',
            autoHeight: true,
            autoShow: true,
            items: [
                this.cbPersona, this.cbPersonaSS]
        });

        this.ventanaPieFirma = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: true,
            constrain: true,
            layout: 'fit',
            title: 'Pie de Firma',
            width: 400,
            height: 135,
            items: [this.formularioPieFirma],
            buttons: [
                this.btnCancelarPieFirma, this.btnAceptarPieFirma
            ]
        });
        ////////////////////////////////PIE DE FIRMA PARA EL ACTA DE POSPOSICION DE VACACIONES///////////////////////////////////

        function onItemClick(items) {
            if (items.id == 'exportarplanifvaca') {
                var denomestructura = self.estructura.tree.getSelectionModel().getSelectedNode().text;
                var idestructura = self.estructura.tree.getSelectionModel().getSelectedNode().id;
                var fecha = new Date();
                var idpersonas = new Array();
                var seleccionados = self.listado.getSelectionModel().getSelections();
                if (seleccionados.length > 0) {
                    Ext.each(seleccionados, function (rec) {
                        idpersonas.push(rec.data.idpersona);
                    });
                }
                var params = Ext.urlEncode({
                    anno: self.comboYear.getValue(),
                    estructura: denomestructura,
                    idestructura: idestructura,
                    idconcepto: self.idconcepto,
                    fecha: fecha.format('d/m/Y'),
                    idpersonas: Ext.encode(idpersonas),
                    filtro: self.tfbuscar.getValue()
                });
                var idIframe = Ext.id();
                new Ext.Window({
                    title: 'Reporte Plan de Vacaciones',
                    width: 800,
                    height: 500,
                    id: 'winregistro',
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable: true,
                    constrainHeader: true,
                    border: false,
                    modal: true,
                    items: {
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            id: idIframe,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host +
                            '/pvd/regimentrabajo/index.php/planificacionvacaciones/exportar?' + params
                        }
                    }
                }).show();
                Ext.getCmp('winregistro').maximize();
                PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
                document.getElementById(idIframe).onload = function () {
                    PVD.ocultarMascara('rep01');
                }
            } else if (items.id == 'actapospvaca') {
                self.cbPersona.setValue('');
                self.cbPersonaSS.setValue('');
                self.ventanaPieFirma.show();
            } else if (items.id == 'exportarsc') {
                self.filtro = self.tfbuscar.getValue();
                self.ventanaGestion.show();
                modelo.fuenteDatosListadoModeloVac.removeAll();
                var idestructura = self.estructura.tree.getSelectionModel().getSelectedNode().id;
                var idpersonas = new Array();
                var seleccionados = self.listado.getSelectionModel().getSelections();
                if (seleccionados.length > 0) {
                    Ext.each(seleccionados, function (rec) {
                        idpersonas.push(rec.data.idpersona);
                    });
                }
                modelo.fuenteDatosListadoModeloVac.load({
                    params: {
                        idpersonas: Ext.encode(idpersonas),
                        anno: self.comboYear.getValue(), idestructura: idestructura, filtro: self.filtro
                    }
                });
                var seleccionadosplanvac = modelo.fuenteDatosListadoModeloVac.data.items;
                if (seleccionadosplanvac.length == 0) {
                    self.btnGenerar.disable();
                    self.btnEliminar.disable();
                } else {
                    self.btnGenerar.enable();
                    self.btnEliminar.enable();
                }

            }
        }

        this.vp = new Ext.Viewport({
            layout: 'border',
            items: [{
                items: [this.estructura],
                title: idioma.lbTitPanelEst,
                region: 'west',
                layout: 'fit',
                width: '27%',
                collapsible: true,
                frame: false,
                border: false,
            }, {
                region: 'center',
                layout: 'fit',
                border: false,
                items: [this.listado]
            }
            ]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('planificacionvacaciones', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.PlanificacionVacaciones.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.PlanificacionVacaciones.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.PlanificacionVacaciones.Controlador.init(idioma, vista, modelo);

});