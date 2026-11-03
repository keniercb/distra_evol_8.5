/**
 * Panel para la gestion de las mediciones del componente Curva de conflicto
 *
 * @copyright XETID Cuba
 * @author Ing. Frank David Corona Prendes
 * @version 1.0
 */
Planificacion.Integracion.MedicionesPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    border: false,
    //constrain: true,
    initComponent: function() {
        var me = this;
        //me.disabled = !(me.objproyecto.get('fechainicio'));
        me.idCmp = this.id;
        me.comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.CurvaconflictoController();
        me.region = (me.region) ? me.region : 'west';
        me.etiquetas = me.controller._getLabel('Curvaconflicto');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        //me.title = (me.title) ? me.title : me.etiquetas.titlePanelMediciones;

        me.validatorProyecto = new ExtExtend.FormValidator();

        me.idestudiocurvaconflicto = (me.idestudiocurvaconflicto) ? me.idestudiocurvaconflicto : null;
        me.recordproyectos = (me.recordproyectos) ? me.recordproyectos : null;

        me.btnGenerarDiagrama = new me.comps.buttons.btnGraficar({
            text: me.etiquetas.btnGenerardiag,
            tooltip: 'Graficar curva de conflicto',
            disabled: true,
            handler: function() {
                me.generarGraficoCurvaconflicto({
                    native: false,
                    type: 'line-smoothed',
                    title: 'Diagrama curva de conflicto para el proyecto ' + me.recordproyectos.nombreproyecto,
                    uri: '/planificacion/herramientasintegracion/index.php/curvaconflicto/obtenerdatosgrafico',
                    idestudio: me.idestudiocurvaconflicto,
                    idproyecto: me.recordproyectos.idproyecto
                });
            }
        });

        me.btnRecargarmediciones = new me.comps.buttons.btnActualizar({
            tooltip: 'Actualizar mediciones',
            handler: function() {
                me.stMediciones.reload();
            }
        });
        me.btnGuardarMediciones = new me.comps.buttons.btnGuardar({
            text: 'Guardar',
            tooltip: 'Guardar mediciones',
            disabled: true,
            handler: function() {
                if (!me.btnGuardarMediciones.disabled) {
                    me.controller._insertItem('mediciones', me);
                    me.controller.guardarMediciones({
                        datosVariables: me.gpMediciones.getChanges()
                    });
                }
            }
        });
        //-------------------------------------------------------------------------------------------------------------- Record de grid de intensidades
        me.recordMediciones = Ext.data.Record.create([
            {name: 'idmedicion', type: 'int'}, {name: 'idestudiocurvaconflicto', type: 'int'},
            {name: 'fechamedicion'},{name: 'valormedicion'},{name: 'descripcion'}
        ]);
        me.stMediciones = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo + "curvaconflicto/getmediciones",
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idmedicion',
                totalProperty: 'cantidad_filas'
            }, me.recordMediciones),
            listeners: {
                beforeload: function(th) {
                    Secodena.mostrarMascara('mascaraInt', 'Cargando');
                    th.baseParams = {
                        idestudiocurvaconflicto: me.idestudiocurvaconflicto
                    };
                },
                load: function() {
                    Secodena.ocultarMascara('mascaraInt');
                    me.initValidatorMediciones();
                }
            }
        });
        me.smMediciones = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function (obj) {
                    if (obj.hasSelection()) {
                        me.taDescripcion.setValue(obj.getSelected().data.descripcion);
                    }
                }
            }
        });

        var columnModelMediciones = [];
        if(me.objproyecto.get('escala')){

            coldownload = function(value, metadata, record) {
                return "<img title='Obtener la medici&oacute;n utilizando el m&eacute;todo de Heilderberg.' src='" + perfil.dirImg + "asociar.png'/>";
            };

            var columnaFecha = (me.objproyecto.get('fromproblema')) ?
                {header: me.etiquetas.headerFecha, width: 200, sortable: true, dataIndex: 'fechamedicion', id: 'expandir&' + me.idCmp} :
                {header: me.etiquetas.headerFecha, width: 200, sortable: true, dataIndex: 'fechamedicion', id: 'expandir&' + me.idCmp,
                    editor: new me.comps.fields.dateField({
                        alloBlank: false, format: ('d/m/Y')
                    })
                };

            columnModelMediciones = [
                new Ext.grid.RowNumberer(),
                columnaFecha,
                {header: me.etiquetas.headerMedicion, width: 100, sortable: true, dataIndex: 'valormedicion', align: 'center'},
                {header: '', width: 27, sortable: false, menuDisabled: true, editable: true, renderer: coldownload,
                    editor: new me.comps.fields.fieldDenom({
                        allowBlank: true, clicksToEdit: 1,
                        listeners: {
                            focus: function() {
                                me.cargarHeilderberg();
                            }
                        }
                    })
                },
                {hidden: true, dataIndex: 'descripcion'}
            ];
        }else{
            columnModelMediciones = [
                new Ext.grid.RowNumberer(),
                {header: me.etiquetas.headerFecha, width: 200, sortable: true, dataIndex: 'fechamedicion', id: 'expandir&' + me.idCmp,
                    editor: new me.comps.fields.dateField({
                        alloBlank: false, format: ('d/m/Y')
                    })
                },
                {header: me.etiquetas.headerMedicion, width: 100, sortable: true, dataIndex: 'valormedicion', align: 'center',
                    editor: new me.comps.fields.numberField({
                        allowDecimals: true,
                        allowNegative: false
                    })
                },
                {hidden: true, dataIndex: 'descripcion'}
            ];
        }
        me.cmMediciones = new Ext.grid.ColumnModel(columnModelMediciones);
        me.cmMediciones.defaultSortable = true;

        me.gpMediciones = new me.comps.containers.grids.rowEditorGrid({
            frame: true,
            title: (me.title) ? '<b>' + me.title + '</b>': '<b>' + me.etiquetas.titlePanelMediciones + '</b>',
            store: me.stMediciones,
            id: 'idgpMediciones',
            //cls: 'x-toolbar',
            cm: me.cmMediciones,
            sm: me.smMediciones,
            region: 'center',
            stripeRows: true,
            addButtonTTip: me.etiquetas.ttpGipM,
            delButtonTTip: me.etiquetas.ttpGipM,
            clicksToEdit: 2,
            editable: true,
            overCls: 'x-grid3-row-over',
            ctCls: 'x-grid3-row-selected',
            autoExpandColumn: 'expandir&' + me.idCmp,
            delButtonMsg: '¿Está seguro que quiere eliminar la medición seleccionada?',
            anchor: '100%',
            defaults: {autoScroll: true},
            plugins: [new me.comps.plugins.grid.changesValidator],
            tbarButtons: ['->', me.btnGenerarDiagrama],
            listeners: {
                validateedit: function(e) {
                    if (e.field == 'fechamedicion') {
                        e.value = e.value.format('d/m/Y');
                    }
                }
            }
        });

        me.taDescripcion = new Ext.form.HtmlEditor({
            region: 'south',
            name: 'descripcion',
            anchor: '100%',
            enableAlignments: false,
            enableColors: false,
            enableFont: false,
            enableFontSize: false,
            enableFormat: false,
            enableLinks: false,
            enableLists: false,
            enableSourceEdit: false,
            listeners: {
                sync: function (th, string) {
                    if (th.getValue()) {
                        if (me.smMediciones.hasSelection()) {
                            me.smMediciones.getSelected().set('descripcion', th.getValue());
                        }
                    }
                    th.focus();
                }
            }
        });
        me.panelDescripcion = new Ext.Panel(    {
            title: 'Valoración de la medición',
            region: 'south',
            height: 250,
            layout: 'fit',
            frame: true,
            items: [me.taDescripcion],
            bbar: ['->', me.btnRecargarmediciones, me.btnGuardarMediciones]
        });

        me.items = [me.gpMediciones, me.panelDescripcion];
        me.initValidatorMediciones();
        me.keys = [
            {key: 'i', alt: true, scope: me, stopEvent: true, fn: function() {me.gpMediciones.onAdd();}},
            {key: Ext.EventObject.DELETE, scope: me, stopEvent: true, fn: function() {me.gpMediciones.onDel();}},
            {key: 'z', ctrl: true, alt: true, scope: me, stopEvent: true, fn: function() {me.btnRecargarmediciones.handler.call();}},
            {key: 'g', alt: true, scope: me, stopEvent: true, fn: function() {me.btnGuardarMediciones.handler.call();}},
            {key: 'm', ctrl: true, alt: true, scope: me, stopEvent: true, fn: function() {me.btnGenerarDiagrama.handler.call();}}
        ];
        this.on('resize', function (obj, adjWidth, adjHeight, rawWidth, rawHeight) {
            me.altura = adjHeight;
            me.ancho = adjWidth;
        });
        Planificacion.Integracion.MedicionesPanel.superclass.initComponent.call(me);
    },
    cargarHeilderberg: function() {
        var me = this;
        //----------------------------------------------------------------------- Medidas internacionales
        me.recMedidasInternacionales = [
            [1, 'Bajo',  'Oscila entre medidas no oficiales de manejo de conflicto y el empleo de discursos políticos de confrontación y/o medidas proteccionistas'],
            [2, 'Medio', 'Medidas diplomáticas oficiales pacíficas, de cooperación y amistad'],
            [3, 'Alto',  'Sanciones diplomáticas y condenas internacionales']
        ];
        me.stMedidasInternacionales = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recMedidasInternacionales,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbMedidasInternacionales = new Ext.form.ComboBox({
            fieldLabel: 'Medidas internacionales',
            anchor: '95%',
            store: me.stMedidasInternacionales,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });

        //----------------------------------------------------------------------- Medidas nacionales
        me.recMedidasNacionales = [
            [1, 'Bajo',  'Alta discrecionalidad en el manejo de medidas comunicacionales y educativos, judiciales y legales, económicos y sociales'],
            [2, 'Medio', 'Estructura en desarrollo de las medidas comunicacionales y educativos, judiciales y legales, económicos y sociales aplicables'],
            [3, 'Alto',  'Empleo estable y estructurado de medidas comunicacionales y educativos, judiciales y legales, económicos y sociales']
        ];
        me.stMedidasNacionales = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recMedidasNacionales,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbMedidasNacionales = new Ext.form.ComboBox({
            fieldLabel: 'Medidas nacionales',
            anchor: '100%',
            store: me.stMedidasNacionales,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });

        //----------------------------------------------------------------------- Medios politicos
        me.recMediosPoliticos = [
            [1, 'Bajo', 'Vulnerabilidad de las instituciones democráticas, debilitamiento de las estructuras económicas formales, fragmentación de la sociedad civil, estado de conmoción interna y/o externa, fragmentación de la sociedad, éxodo poblacional, escaso acceso de la población a los servicios públicos, pobreza/hambruna de la población'],
            [2, 'Medio', 'Instituciones democráticas en transición, estructuras económicas formales no consolidadas, reajuste de la sociedad civil, paz inestable, nivel medio de agresiones desde la estructura política y económica a la sociedad, éxodo poblacional en proceso, disminuido acceso de la población a los servicios públicos, igualdad en desarrollo y niveles medios de pobreza/hambruna de la población'],
            [3, 'Alto', 'Sólidas instituciones democráticas, fortalecidas estructuras económicas formales, consolidada sociedad civil, paz duradera interna y externa, sociedad estructurada y armónica, ausencia de éxodo poblacional, acceso pleno de la población a los servicios públicos, igualdad en todos los ámbitos y erradicación de la pobreza/hambruna de la población']
        ];
        me.stMediosPoliticos = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recMediosPoliticos,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbMediosPoliticos = new Ext.form.ComboBox({
            fieldLabel: 'Medios políticos',
            anchor: '95%',
            store: me.stMediosPoliticos,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });


        //----------------------------------------------------------------------- Privados de libertad
        me.recPrivadosLibertad = [
            [1, 'Bajo',  '< 289 privados de libertad por c/100 hab.'],
            [2, 'Medio', '> 290  ≤ 559 privados de libertad por c/100 hab.'],
            [3, 'Alto',  '> 560 privados de libertad por c/100 hab.']
        ];
        me.stPrivadosLibertad = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recPrivadosLibertad,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbPrivadosLibertad = new Ext.form.ComboBox({
            fieldLabel: 'Privados de libertad',
            anchor: '100%',
            store: me.stPrivadosLibertad,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });


        //----------------------------------------------------------------------- Conflictividad social
        me.recConflictividadSocial = [
            [1, 'Bajo', '< 1 conflicto, entendiéndose este por enfrentamientos con el gobierno, con uso de  violencia entre ambas partes, en las cuales al menos una de ellas es el gobierno de un Estado, con el saldo de  al menos 25 muertes por año'],
            [2, 'Medio', 'De 2 a 3 conflictos, entendiéndose estos por enfrentamientos con el gobierno, con uso de  violencia entre ambas partes, en las cuales al menos una de ellas es el gobierno de un Estado, con el saldo de  al menos 25 muertes por año'],
            [3, 'Alto', '> 3 conflictos, entendiéndose estos por enfrentamientos con el gobierno, con uso de  violencia entre ambas partes, en las cuales al menos una de ellas es el gobierno de un Estado, con el saldo de  al menos 25 muertes por año']
        ];
        me.stConflictividadSocial = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recConflictividadSocial,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbConflictividadSocial = new Ext.form.ComboBox({
            fieldLabel: 'Conflictividad social',
            anchor: '95%',
            store: me.stConflictividadSocial,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });

        //----------------------------------------------------------------------- Inestabilidad politica
        me.recInestabilidadPolitica = [
            [1, 'Bajo', 'Países bajo un estable imperio de la Ley, no existen o son muy pocos los prisioneros políticos, la tortura y los homicidios políticos'],
            [2, 'Medio', 'Son aceptadas las detenciones ilimitadas, con o sin juicio, debido a opiniones políticas contrarias al régimen. Abundan las detenciones políticas, ejecuciones, homicidios políticos y la brutalidad policial, pero afectan solamente a los involucrados en asuntos políticos e ideológicos'],
            [3, 'Alto', 'Violencia expandida a toda la población, los líderes políticos y militares no tienen límites en el empleo de medios para alcanzar sus objetivos personales o ideológicos, los asesinatos, desapariciones y torturas son comunes, así como son públicas las violaciones a los derechos civiles y políticos']
        ];
        me.stInestabilidadPolitica = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recInestabilidadPolitica,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbInestabilidadPolitica = new Ext.form.ComboBox({
            fieldLabel: 'Inestabilidad política',
            anchor: '100%',
            store: me.stConflictividadSocial,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            width: '100%',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });

        //----------------------------------------------------------------------- Armas
        me.recArmas = [
            [1, 'Bajo', 'Empleo de armas ligeras'],
            [2, 'Medio', 'Bajo empleo de armas pesadas'],
            [3, 'Alto', 'Alto empleo de armas pesadas']
        ];
        me.stArmas = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recArmas,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbArmas = new Ext.form.ComboBox({
            fieldLabel: 'Armas',
            anchor: '95%',
            store: me.stArmas,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });


        //----------------------------------------------------------------------- Combatientes
        me.recCombatientes = [
            [1, 'Bajo', '≤ 50'],
            [2, 'Medio', '> 50  ≤ 400'],
            [3, 'Alto', '> 400']
        ];
        me.stCombatientes = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recCombatientes,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbCombatientes = new Ext.form.ComboBox({
            fieldLabel: 'Combatientes',
            anchor: '100%',
            store: me.stCombatientes,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });

        //----------------------------------------------------------------------- Fallecidos por conflicto
        me.recFallecidosConflicto = [
            [1, 'Bajo', '≤ 20'],
            [2, 'Medio', '> 20  ≤ 60'],
            [3, 'Alto', '> 60']
        ];
        me.stFallecidosConflicto = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recFallecidosConflicto,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbFallecidosConflicto = new Ext.form.ComboBox({
            fieldLabel: 'Fallecidos por conflicto',
            anchor: '95%',
            store: me.stFallecidosConflicto,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });

        //----------------------------------------------------------------------- Refugiados y desplazados internos
        me.recRefugiadosDesplazados = [
            [1, 'Bajo', '≤ 50'],
            [2, 'Medio', '> 50  ≤ 400'],
            [3, 'Alto', '> 400']
        ];
        me.stRefugiadosDesplazados = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recRefugiadosDesplazados,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbRefugiadosDesplazados = new Ext.form.ComboBox({
            fieldLabel: 'Refugiados y desplazados internos',
            anchor: '100%',
            store: me.stRefugiadosDesplazados,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });

        //----------------------------------------------------------------------- Destruccion
        me.recDestruccion = [
            [1, 'Bajo', '≤ 50'],
            [2, 'Medio', '> 50  ≤ 400'],
            [3, 'Alto', '> 400']
        ];
        me.stDestruccion = new Ext.data.SimpleStore({
            autoLoad: true,
            data: me.recDestruccion,
            fields: [
                {name: 'id'},
                {name: 'valor'},
                {name: 'descripcion'}
            ]
        });
        me.cbDestruccion = new Ext.form.ComboBox({
            fieldLabel: 'Destrucción',
            anchor: '95%',
            store: me.stDestruccion,
            displayField: 'valor',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            extendField: 'descripcion',
            enableQtip: true
        });

        me.btnCancelar = new me.comps.buttons.btnCancelar({
            handler: function() {
                me.winValormedicion.destroy();
            }
        });

        me.btnAceptar = new me.comps.buttons.btnAceptar({
            handler: function() {
                me.barometroHeilderberg();
            }
        });

        me.panelNoViolentos = new Ext.Panel({
            title: 'Conflictos no violentos',
            labelAlign: 'top',
            layout: 'form',
            region: 'center',
            frame: true,
            items: [
                {
                    layout: 'column',
                    anchor: '100%',
                    defaults:{columnWidth: .5, layout: 'form', labelAlign: 'top'},
                    items: [
                        {items: [me.cbMedidasInternacionales, me.cbMediosPoliticos, me.cbConflictividadSocial]},
                        {items: [me.cbMedidasNacionales, me.cbPrivadosLibertad, me.cbInestabilidadPolitica]}
                    ]
                }
            ]
        });

        me.panelViolentos = new Ext.Panel({
            title: 'Conflictos violentos',
            labelAlign: 'top',
            layout: 'form',
            region: 'south',
            height: 185,
            frame: true,
            items: [
                {
                    layout: 'column',
                    anchor: '100%',
                    defaults:{columnWidth: .5, layout: 'form', labelAlign: 'top'},
                    items: [
                        {items: [me.cbArmas, me.cbFallecidosConflicto, me.cbDestruccion]},
                        {items: [me.cbCombatientes, me.cbRefugiadosDesplazados]}
                    ]
                }
            ]
        });
        me.winValormedicion = new Ext.Window({
            closable: true,
            constrain: true,
            frame: true,
            closeAction: 'destroy',
            bodyStyle: 'padding:5px 5px 0',
            title: me.etiquetas.titleWinHeilderberg,
            labelWidth: '100%',
            layout: 'border',
            hideLabel: false,
            columns: 2,
            modal: true,
            height: 440,
            width: 600,
            items: [me.panelNoViolentos, me.panelViolentos],
            buttons: [me.btnCancelar, me.btnAceptar],
            keys: [
                {key: Ext.EventObject.ENTER, scope: me, stopEvent: true, fn: function() {me.btnAceptar.handler.call();}},
                {key: 'x', alt: true, scope: me, stopEvent: true, fn: function() {me.btnCancelar.handler.call();}}
            ]
        });
        me.winValormedicion.show();
    },
    initValidatorMediciones: function() {
        var me = this;
        var fields = {grid: me.gpMediciones, descrip: me.taDescripcion};
        var botones = [me.btnGuardarMediciones];
        me.initValidator(me.validatorProyecto, fields, botones);
    },
    initValidator: function(validator, fields, buttons) {
        var res = [];
        ExtExtend.Utils.each(fields, function(i, v) {
            res.push(v);
        });
        validator = new ExtExtend.FormValidator({
            buttons: buttons,
            fields: res
        });
    },
    barometroHeilderberg: function() {
        var me = this;
        var valormedicion = 0;

        var conSig = [];
            conSig[0] = [1,1,2];
            conSig[1] = [1,2,3];
            conSig[2] = [2,3,3];

        var conSigAux = [];
            conSigAux[0] = [1,2,3];
            conSigAux[1] = [2,3,4];
            conSigAux[2] = [3,4,5];

        var cbMedidasInter          = me.cbMedidasInternacionales.getValue() - 1,
            cbMedidasNac            = me.cbMedidasNacionales.getValue() - 1,
            cbMediosPol             = me.cbMediosPoliticos.getValue() - 1,
            cbPribadosLib           = me.cbPrivadosLibertad.getValue() - 1,
            cbConflictividadSocial  = me.cbConflictividadSocial.getValue() - 1,
            cbInestabilidadPol      = me.cbInestabilidadPolitica.getValue() - 1,
            cbArmas                 = me.cbArmas.getValue() - 1,
            cbCombatientes          = me.cbCombatientes.getValue() - 1,
            cbFallecidos            = me.cbFallecidosConflicto.getValue() - 1,
            cbRefugiados            = me.cbRefugiadosDesplazados.getValue() - 1,
            cbDestruccion           = me.cbDestruccion.getValue() - 1;

        var medidasTomadas      = conSig[cbMedidasInter][cbMedidasNac],                     // Medidas tomadas
            mediosConflictoNV   = conSig[medidasTomadas - 1][cbMediosPol],                  // Medios en conflictos no violentos
            mediosConflictoV    = conSig[cbArmas][cbCombatientes],                          // Medios en conflictos violentos
            mediosConflicto     = conSig[mediosConflictoNV - 1][mediosConflictoV - 1];      // Medios del conflicto
        var amenazasEstabilidad = conSig[cbConflictividadSocial][cbInestabilidadPol],       // Amenazas a la estabilidad
            consecuenciasCNV    = conSig[amenazasEstabilidad - 1][cbPribadosLib],           // Consecuencias en conflictos no violentos
            amenazasExistencia  = conSig[cbRefugiados][cbDestruccion],                      // Amenazas a la existencia
            consecuenciasCV     = conSig[amenazasExistencia - 1][cbFallecidos],             // Consecuencias en conflictos violentos
            consecuencias       = conSig[consecuenciasCNV - 1][consecuenciasCV - 1];        // Consecuencias del conflicto
        var intensidadConflicto = conSigAux[mediosConflicto - 1][consecuencias - 1];        // Intensidad del conflicto

        me.smMediciones.getSelected().set('valormedicion', intensidadConflicto);
        me.winValormedicion.destroy();
    },
    generarGraficoCurvaconflicto: function(ob) {
        var me = this;
        var win = new Ext.incidencia.chart.representacion.AmChartWinView({
            uri: ob.uri,
            type: ob.type,
            title: ob.title,
            theme: ob.theme,
            native: ob.native,
            graphic: ob.graphic,
            idestudio: ob.idestudio,
            idproyecto: ob.idproyecto,
            altura: (me.altura - 25)
        });
        win.show();
    }
});
Ext.reg('Planificacion.Integracion.MedicionesPanel', Planificacion.Integracion.MedicionesPanel);