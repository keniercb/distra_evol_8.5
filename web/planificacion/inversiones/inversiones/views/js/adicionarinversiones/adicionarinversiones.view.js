
////Ext.ns('Gestionar.adicionarinversiones');
//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
Utilidades.Cmp.vistaVentanaInversiones = function(opciones) {
    var _this = this;
    this.modeloVentanaInversiones = opciones.modelo;
    idioma = opciones.idioma;
    this.objci = opciones.objci;
    this.vistaInversionesSelectionModel = opciones.vistaInversionesSelectionModel;
    this.gridInversiones = opciones.gridInversiones;
    this.idInversionSelected = opciones.idInversionSelected;
    this.comboEjercicio = opciones.comboEjercicio;
    this.idOrganismo = opciones.idOrganismo;
    this.addmod = opciones.addmod;
    this.ctrFProp = false;
    this.ctrObj = false;
    this.ctrClasif = false;
    this.ctrEfecto = false;
    this.ctrTInv = false;
    this.ctrCaract = false;
    this.ctrProg = false;
    this.ctrGObra = false;
    this.ctrEstado = false;
    this.ctrSEstrag = false;
    this.ctrMonedas = false;
    this.barraCtrAddInversion;

    this.init = function() {

        /////////////////////////////////////

        _this.tfdenominacion = new Ext.form.TextField({
            xtype: 'textfield',
            //width: 500,
            anchor: '96%',
            //regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            //maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            //regexText: 'Este campo solo admite caracteres alfanúmericos',
            regexText: perfil.etiquetas.msgRTdenominInv,
            align: 'right',
            allowBlank: false,
            fieldLabel: 'Denominaci&oacute;n'
        });

        _this.tfFactibilidad = new Ext.form.TextField({
            xtype: 'textfield',
            //width: 500,
            anchor: '99%',
            //regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            //maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            //regexText: 'Este campo solo admite caracteres alfanúmericos',
            regexText: perfil.etiquetas.msgRTdenominInv,
            align: 'right',
            allowBlank: true,
            fieldLabel: 'Estudio de factibilidad'
        });

        _this.CmbFormaDePropiedad = new Ext.form.ComboBox({
            //width: 160,
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: this.modeloVentanaInversiones.stFormapropiedad,
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Forma de propiedad',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.CmbGrupoObra = new Ext.form.ComboBox({
            //width: 160,
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: this.modeloVentanaInversiones.stGrupoObra,
            valueField: 'idgrupoobra',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Grupo de obra',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.CmbEstado = new Ext.form.ComboBox({
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: this.modeloVentanaInversiones.stEstado,
            valueField: 'idestadoplaninversion',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Estado',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        });

        _this.CmbSectorEstrategico = new Ext.form.ComboBox({
            //width: 160,
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: this.modeloVentanaInversiones.stSectorEstrategico,
            valueField: 'idsectorestrategico',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Sector estrat\xE9gico',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.selModel = new Ext.grid.RowSelectionModel({
            //id: 'sm' + params.identificador,
            id: 'sm' + 'Objetivo',
            singleSelect: true,
        });

        _this.CmbObjetivo = new Ext.CONT.UIXCombo({
            name: 'CmbObjetivo',
            valueField: 'idobjetivo',
            displayField: 'denominacion',
            anchor: '92%',
            //id:'cbxOrganismo',
            emptyText: 'Seleccione...',
            allowBlank: false,
            fieldLabel: 'Objetivo',
            tabIndex: 2,
            xtype: 'treecombo',
        }, {store: this.modeloVentanaInversiones.stObjetivo,
            identificador: 'Objetivo',
            selModel: _this.selModel
        });
        //console.info(_this.CmbObjetivo.getSelModel());

        /* {
         identificador: 'Objetivo',
         displayText: 'Objetivo',
         //url: '/planificacion/planmeta/index.php/inversiones/listarComboObjetivo',
         url: '/planificacion/planmeta/index.php/inversiones/cargarDatosNomInversion',
         autoLoad: true,
         baseParams:{
         idNomInversion: 7,
         
         },
         singleSelect: true,
         //valueField: 'idorganismo',
         reader: this.jrSEctor = new Ext.data.JsonReader({
         id: 'idobjetivo',
         root: 'data'
         }, [{
         name: '_parent'
         }, {
         name: '_is_leaf'
         }, {
         name: 'text'
         }, {
         name: 'idobjetivo'
         }, {
         name: 'denominacion'
         }, {
         name: 'codigo',
         mapping: 'text'
         }])
         }*/

        /*_this.CmbObjetivo = new Ext.form.ComboBox({
         anchor: '92%',
         align: 'right',
         mode: 'local',
         store: this.modeloVentanaInversiones.stObjetivo,
         valueField: 'idobjetivo',
         displayField: 'denominacion',
         allowBlank: false,
         triggerAction: 'all',
         emptyText: 'Seleccione...',
         fieldLabel: 'Objetivo',
         tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
         });*/

        _this.CmbProgramada = new Ext.form.ComboBox({
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            store: this.modeloVentanaInversiones.stPrograma,
            valueField: 'idprogramada',
            displayField: 'denominacion',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Programa',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.cmbClasificacion = new Ext.form.ComboBox({
            anchor: '92%',
            align: 'right',
            valueField: 'idtipoinversion',
            displayField: 'denominacion',
            store: this.modeloVentanaInversiones.stClasificacion,
            allowBlank: false,
            triggerAction: 'all',
            mode: 'local',
            emptyText: 'Seleccione...',
            fieldLabel: 'Clasificaci&oacute;n',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.tfProvincia = new Ext.form.TextField({
            xtype: 'textfield',
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            editable: false,
            readOnly: true,
            fieldLabel: 'Provincia'
        });

        _this.CmbEfectoEnComercio = new Ext.form.ComboBox({
            anchor: '92%',
            align: 'right',
            mode: 'local',
            allowBlank: false,
            store: this.modeloVentanaInversiones.stEfecto,
            valueField: 'idefectocomercial',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Efecto',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.tfanalisis = new Ext.form.NumberField({
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            fieldLabel: 'Análisis post-inversión(meses)',
            regex: /^([0-9]*)+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/
        });

        _this.CmbTipoInversion = new Ext.form.ComboBox({
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            store: this.modeloVentanaInversiones.stTipoInversion,
            valueField: 'idtipoinversionprograma',
            displayField: 'denominacion',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Tipo de inversi&oacute;n',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.tfFechaInicio = new Ext.form.DateField({
            id: 'idFechaInicioN',
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            readOnly: true,
            endDateField: 'idFechaFinN',
            //anchor: '100%',
            fieldLabel: 'Fecha Inicio',
            format: 'd/m/Y',
            menuListeners: {
                select: function(df, date) {
                    if (_this.addmod == false) {
                        var fechamin = _this.gridInversiones.getSelectionModel().getSelected().data.fechamin;
                        if (fechamin != 'nolimit') {
                            var anno = date.format('d/m/Y').split('/');
                            anno = anno[2];
                            if (anno <= _this.gridInversiones.getSelectionModel().getSelected().data.fechamin) {
                                this.setValue(date);
                            } else {
                                mostrarMensaje(1, 'Ya existen valores para plan, anterior a la fecha seleccionada');
                            }
                        } else {
                            this.setValue(date);
                        }
                    }
                    else
                        this.setValue(date);
                }
            }
        });

        _this.CmbDesempeno = new Ext.form.ComboBox({
            anchor: '92%',
            align: 'right',
            mode: 'local',
            allowBlank: false,
            store: this.modeloVentanaInversiones.stDesempeno,
            valueField: 'iddatdesempenno',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Desempeño',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    _this.modeloVentanaInversiones.stDesempeno.reload();
                }
            }
        });

        _this.ChkFastTrack = new Ext.form.Checkbox({
            width: 50,
            align: 'right',
            allowBlank: false,
            fieldLabel: 'V&iacute;a r&aacute;pida',
            disabled: true,
            hideLabel: true
        });

        _this.ChkPreparacion = new Ext.form.Checkbox({
            width: 50,
            align: 'right',
            allowBlank: false,
            fieldLabel: 'Preparaci\xF3n',
            disabled: false,
            name: 'prueba',
            hideLabel: true
        });

        _this.CmbCaracteristica = new Ext.form.ComboBox({
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            triggerAction: 'all',
            store: this.modeloVentanaInversiones.stCaracteristica,
            valueField: 'idcaracteristica',
            displayField: 'denominacion',
            mode: 'local',
            emptyText: 'Seleccione...',
            fieldLabel: 'Caracter&iacute;stica'
        });

        _this.tfFechaFin = new Ext.form.DateField({
            id: 'idFechaFinN',
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            readOnly: true,
            startDateField: 'idFechaInicioN',
            fieldLabel: 'Fecha Fin',
            format: 'd/m/Y',
            menuListeners: {
                select: function(df, date) {
                    if (_this.addmod == false) {
                        var fechamax = _this.gridInversiones.getSelectionModel().getSelected().data.fechamax;
                        if (fechamax != 'nolimit') {
                            var anno = date.format('d/m/Y').split('/');
                            anno = anno[2];

                            if (anno >= _this.gridInversiones.getSelectionModel().getSelected().data.fechamax) {
                                this.setValue(date);
                            } else {
                                mostrarMensaje(1, 'Ya existen valores para plan, posterior a la fecha seleccionada');
                            }
                        } else {
                            this.setValue(date);
                        }
                    }
                    else
                        this.setValue(date);

                }
            }
        });

        _this.cmbMedioAmbiente = new Ext.form.ComboBox({
            id: 'idcmbInvMedioAmbienteN',
            anchor: '92%',
            align: 'right',
            allowBlank: false,
            store: this.modeloVentanaInversiones.stMedioAmbiente,
            valueField: 'idmedioambiente',
            displayField: 'denominacion',
            // forceSelection: true,
            typeAhead: true,
            mode: 'local',
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlMedioAmbiente,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    _this.modeloVentanaInversiones.stMedioAmbiente.reload();
                }
            }
        });

        _this.btnBuscarFactibilidad = new Ext.Button({
            disabled: false,
            id: 'btnBuscarFactibilidad',
            icon: perfil.dirImg + 'buscar.png',
            iconCls: 'btn',
            tooltip: 'Buscar estudio de factibilidad'
                    //text: 'Adicionar'
        });

        //botones del grid importacion
        _this.btnAdicionarImpor = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarImpor',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: 'Adicionar',
            text: 'Adicionar'
        });

        _this.btnEliminarImpor = new Ext.Button({
            disabled: true,
            id: 'btnEliminarImpor',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: 'Eliminar',
            text: 'Eliminar'
        });

        //botones del grid presupuesto
        _this.btnAdicionarPresupuesto = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarPresupuesto',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: 'Adicionar',
            text: 'Adicionar'
        });

        _this.btnEliminar = new Ext.Button({
            disabled: true,
            id: 'btnEliminar',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: 'Eliminar',
            text: 'Eliminar'
        });

        //botones del grid financiamiento
        _this.btnAdicionarFinan = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarFinan',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: 'Adicionar',
            text: 'Adicionar'
        });

        _this.btnEliminarFinan = new Ext.Button({
            disabled: true,
            id: 'btnEliminarFinan',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: 'Eliminar',
            text: 'Eliminar'
        });


        _this.fmAdicionarInversion = new Ext.form.FormPanel({
            width: 800,
            //height: 100,
            height: '70%',
            region: 'north',
            frame: true,
            border: false,
            labelAlign: 'top',
            autoScroll: true,
            items: [
                {
                    layout: 'column',
                    items: [{
                            columnWidth: .50,
                            layout: 'form',
                            items: [_this.tfdenominacion]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.CmbGrupoObra]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.CmbCaracteristica]
                        }]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.cmbClasificacion, _this.CmbFormaDePropiedad, _this.CmbObjetivo, _this.CmbProgramada]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.CmbTipoInversion, _this.tfProvincia, _this.CmbEfectoEnComercio, _this.tfanalisis]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.tfFechaInicio, _this.CmbDesempeno, _this.CmbSectorEstrategico,
                                {
                                    layout: 'column',
                                    items: [{
                                            columnWidth: .2,
                                            layout: 'form',
                                            items: [
                                                {
                                                    html: '<div style="margin-top:8px"></div>'
                                                }, {
                                                    html: '<p style="font-size: 12px "> V&iacute;a r&aacute;pida: </p>'
                                                }
                                            ]
                                        },
                                        {
                                            columnWidth: .8,
                                            layout: 'form',
                                            items: [_this.ChkFastTrack]
                                        }]
                                }]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.tfFechaFin, _this.cmbMedioAmbiente, _this.CmbEstado,
                                {
                                    layout: 'column',
                                    items: [{
                                            columnWidth: .2,
                                            layout: 'form',
                                            items: [//style="margin-top:2px"
                                                {
                                                    html: '<div style="margin-top:8px"></div>'
                                                }, {
                                                    html: '<p style="font-size: 12px "> Preparaci\xF3n: </p>'
                                                }
                                            ]
                                        },
                                        {
                                            columnWidth: .8,
                                            layout: 'form',
                                            items: [_this.ChkPreparacion]
                                        }]
                                }]
                        }
                    ]
                }, {
                    xtype: 'textarea',
                    id: 'idobservacionN',
                    anchor: '98%',
                    fieldLabel: 'Observaciones',
                    height: '40%',
//                    vtype:'vtdescripcion',
//                    maskRe: /^([A-Za-z0-9]|[,]|[.]|[:]|[/]|[;]|[_]|[-]|[(]|[)]|[\u005B]|[\u005D]|[\u00e1\u00e9\u00f3\u00ed\u00fa\u00FC\u00F1\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1])+([ ]?([A-Za-z0-9]|[,]|[.]|[:]|[/]|[;]|[_]|[-]|[(]|[)]|[\u005B]|[\u005D]|[\u00e1\u00e9\u00f3\u00ed\u00fa\u00FC\u00F1\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1]))*$/,
//                    regex: /^([A-Za-z0-9]|[,]|[.]|[:]|[/]|[;]|[_]|[-]|[(]|[)]|[\u005B]|[\u005D]|[\u00e1\u00e9\u00f3\u00ed\u00fa\u00FC\u00F1\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1])+([ ]?([A-Za-z0-9]|[,]|[.]|[:]|[/]|[;]|[_]|[-]|[(]|[)]|[\u005B]|[\u005D]|[\u00e1\u00e9\u00f3\u00ed\u00fa\u00FC\u00F1\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1]))*$/, 
                    listeners: {
                        specialkey: function(f, e) {
                            if (e.V) {
                                e.stopEvent();
                            }
                        }
                    }
                }
            ],
            listeners: {
                clientValidation: function() {
                    if (_this.ctrFProp && _this.ctrObj && _this.ctrClasif && _this.ctrEfecto && _this.ctrTInv && _this.ctrCaract && _this.ctrProg && _this.ctrGObra
                            && _this.ctrEstado && _this.ctrSEstrag && _this.ctrMonedas) {
                        _this.barraCtrAddInversion.hide();
                    }
                }
            }
        });

        _this.sm_importacion = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        _this.grid_Importacion = new Ext.grid.EditorGridPanel({
            title: 'Erogaci&oacute;n a l&iacutequido de importaci&oacute;n',
            frame: true,
            height: 250,
            region: 'north',
            sm: _this.sm_importacion,
            clicksToEdit: 1,
            autoExpandColumn: 'grid_Importacion',
            store: this.modeloVentanaInversiones.stImportacion,
            loadMask: {
                store: this.modeloVentanaInversiones.stImportacion
            },
            tbar: [_this.btnAdicionarImpor, _this.btnEliminarImpor],
            columns: [
                {
                    header: "Valor",
                    tooltip: 'Valor',
                    dataIndex: 'valor',
                    width: 200,
                    id: 'grid_Importacion',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        /*maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([1-9]+ ?[0-9]*)+$/,*/
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                        selectOnFocus: true,
                        emptyText: 'Seleccione...',
                        allowBlank: false
                    })
                }, {
                    header: "Moneda",
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 300,
                    sortable: true,
                    renderer: this.rendeMoneda,
                    editor: new Ext.form.ComboBox({
                        id: 'idmonedaim',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        store: this.modeloVentanaInversiones.stMonedas,
                        listeners: {
                            expand: function(combo) {
                                var idmonedaentidad = [];

                                for (var i = 0; i < _this.grid_Importacion.getStore().getCount(); i++) {
                                    var record = _this.grid_Importacion.getStore().getAt(i);
                                    if (record.data.moneda != '') {
                                        if (record.modified != null) {
                                            idmonedaentidad.push(record.data.moneda);
                                        } else {
                                            idmonedaentidad.push(record.data.idmonedaentidad);
                                        }
                                    }

                                }
                                if (idmonedaentidad.length > 0) {
                                    _this.modeloVentanaInversiones.stMonedas.reload({
                                        params: {
                                            idmonedaentidad: Ext.encode(idmonedaentidad),
                                            identidad: _this.idOrganismo
                                        },
                                        callback: function(r) {
                                            if (r.length == 0) {
                                                _this.modeloVentanaInversiones.stImportacion.remove(_this.sm_importacion.getSelected());
                                            }
                                        }
                                    });
                                }

                            }
                        }

                    })
                }]


        });


        _this.sm_presupuesto = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        _this.grid_Presupuesto = new Ext.grid.EditorGridPanel({
            title: 'Plan de preparaci&oacute;n',
            frame: true,
            height: 200,
            region: 'center',
            sm: _this.sm_presupuesto,
            clicksToEdit: 1,
            autoExpandColumn: 'grid_PresupuestoAdd',
            store: this.modeloVentanaInversiones.stPresupuesto,
            loadMask: {
                store: this.modeloVentanaInversiones.stPresupuesto
            },
            tbar: [_this.btnAdicionarPresupuesto, _this.btnEliminar],
            columns: [
                {
                    header: "Valor",
                    tooltip: 'Valor',
                    dataIndex: 'valor',
                    width: 250,
                    id: 'grid_PresupuestoAdd',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        /*maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([1-9]+ ?[0-9]*)+$/,*/
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                        selectOnFocus: true,
                        emptyText: 'Seleccione...',
                        allowBlank: false
                    })
                }, {
                    header: "Moneda",
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 300,
                    sortable: true,
                    renderer: this.rendeMoneda,
                    editor: new Ext.form.ComboBox({
                        id: 'idmonedap',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        store: this.modeloVentanaInversiones.stMonedas
                    })
                }]


        });

        _this.sm_financiamiento = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        _this.grid_Financiamiento = new Ext.grid.EditorGridPanel({
            title: 'Financiamiento',
            frame: true,
            sm: _this.sm_financiamiento,
            autoScroll: true,
            height: 250,
            region: 'south',
            loadMask: {
                store: this.modeloVentanaInversiones.store_Financiamiento
            },
            store: this.modeloVentanaInversiones.store_Financiamiento,
            tbar: [_this.btnAdicionarFinan, _this.btnEliminarFinan],
            columns: [
                {
                    header: "Quién Financia",
                    tooltip: 'Quién Financia',
                    dataIndex: 'financi',
                    width: 150,
                    sortable: true,
                    renderer: this.rendeFinancista,
                    editor: new Ext.form.ComboBox({
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idfinancista',
                        displayField: 'denominaciontipo',
                        store: this.modeloVentanaInversiones.stFinancista,
                        tpl: '<tpl for="."><div ext:qtip="{denominaciontipo}" class="x-combo-list-item">{denominaciontipo}</div></tpl>'
                    })
                }, {
                    header: "Como se financia",
                    tooltip: 'Como se financia',
                    dataIndex: 'tipo',
                    width: 150,
                    sortable: true,
                    renderer: this.rendeTipoFin,
                    editor: new Ext.form.ComboBox({
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idtipofinanciamiento',
                        displayField: 'denominaciontipo',
                        store: this.modeloVentanaInversiones.stTipoFinan,
                        tpl: '<tpl for="."><div ext:qtip="{denominaciontipo}" class="x-combo-list-item">{denominaciontipo}</div></tpl>'
                    })
                }, {
                    header: "Gracia",
                    tooltip: 'Gracia',
                    dataIndex: 'gracia',
                    width: 100,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                }, {
                    header: "Porciento Interés",
                    tooltip: 'Porciento',
                    dataIndex: 'porcientointeres',
                    width: 100,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                }, {
                    header: "Plazo de amortización",
                    tooltip: 'Plazo de amortización',
                    dataIndex: 'plazoamortizacion',
                    width: 170,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false,
                        decimalPrecision: 3
                    })
                }, {
                    header: "Valor",
                    tooltip: 'Valor',
                    dataIndex: 'valor',
                    width: 100,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.TextField({
                        disabledClass: 'disabled-component',
                        /*maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([1-9]+ ?[0-9]*)+$/,*/
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                        selectOnFocus: true,
                        allowBlank: false

                    })
                }, {
                    header: "Moneda",
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 200,
                    sortable: true,
                    renderer: this.rendeMoneda,
                    editor: new Ext.form.ComboBox({
                        id: 'idmoneda',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        store: this.modeloVentanaInversiones.stMonedas
                    })
                }]
        });


        _this.pPrincipal = new Ext.Panel({
            //height: 500,
            height: '70%',
            region: 'center',
            layout: 'fit',
            items: [_this.fmAdicionarInversion]
        });

        _this.tabAbajo = new Ext.TabPanel({
            id: 'tabAbajo',
            height: 220,
            //height: '25%',
            activeTab: 0,
            region: 'south',
            items: [_this.grid_Importacion, _this.grid_Presupuesto, _this.grid_Financiamiento]
        });


        _this.win_add_inversiones = new Ext.Window({
            width: 1000,
            height: 600,
            maximized: true,
            layout: 'border',
            closeAction: 'close',
            resizable: false,
            modal: true,
            html: '<script type="text/javascript">document.oncontextmenu = function(){return false;} </script>',
            items: [_this.pPrincipal, _this.tabAbajo],
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    tooltip: perfil.etiquetas.toolTipCancelarParam,
                    text: perfil.etiquetas.btnCancelar,
                    handler: function() {
                        _this.win_add_inversiones.close();
                        _this.tabAbajo.setActiveTab(0);
                    }
                }, {
                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'btn',
                    id: 'btnaplicar',
                    tooltip: perfil.etiquetas.toolTipAplicarWinAddInversion,
                    text: perfil.etiquetas.btnAplicar,
                    disable: false
                },
                {
                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'btn',
                    id: 'btnaceptar',
                    tooltip: perfil.etiquetas.toolTipAceptarWinAddInversion,
                    text: perfil.etiquetas.btnAceptar,
                    disable: false
                }]/*,
                 listeners: {
                 beforeshow: function() {
                 _this.modeloVentanaInversiones.stFormapropiedad.load();
                 _this.modeloVentanaInversiones.stObjetivo.load();
                 _this.modeloVentanaInversiones.stClasificacion.load();
                 _this.modeloVentanaInversiones.stEfecto.load();
                 _this.modeloVentanaInversiones.stTipoInversion.load();
                 _this.modeloVentanaInversiones.stCaracteristica.load();
                 _this.modeloVentanaInversiones.stMedioAmbiente.load();
                 _this.modeloVentanaInversiones.stPrograma.load();
                 _this.modeloVentanaInversiones.stGrupoObra.load();
                 _this.modeloVentanaInversiones.stEstado.load();
                 _this.modeloVentanaInversiones.stSectorEstrategico.load();
                 _this.modeloVentanaInversiones.stMonedas.load({
                 params: {
                 identidad: idorganismo
                 }});
                 _this.modeloVentanaInversiones.stGrupoObra.load();
                 _this.modeloVentanaInversiones.stEstado.load();
                 _this.modeloVentanaInversiones.stSectorEstrategico.load();
                 }
                 }*/

        });

        //Ventana que sale luego dar clic en el texfield Provincia
        _this.rootNodoDpt = {
            text: 'Cuba',
            id: 0
        };

        _this.ventanaDpt = new Ext.secodena.comun.window.winSelectDPA({
            rootNodo: _this.rootNodoDpt,
            sinTitulo: true,
            selPais: true,
            //id: 'winDPAPersonaN'
        });

    };

    this.rendeMoneda = function(idmoneda) {
        var index = _this.modeloVentanaInversiones.stMonedas.find('idmoneda', idmoneda);
        if (index > -1) {
            var record = _this.modeloVentanaInversiones.stMonedas.getAt(index);
            return record.get('denominacion');
        }
        return idmoneda;
    }

    this.rendeFinancista = function(idfinancista) {
        var index = _this.modeloVentanaInversiones.stFinancista.find('idfinancista', idfinancista);
        if (index > -1) {
            var record = _this.modeloVentanaInversiones.stFinancista.getAt(index);
            return record.get('denominaciontipo');
        }
        return idfinancista;
    }

    this.rendeTipoFin = function(idtipofinanciamiento) {
        var index = _this.modeloVentanaInversiones.stTipoFinan.find('idtipofinanciamiento', idtipofinanciamiento);
        if (index > -1) {
            var record = _this.modeloVentanaInversiones.stTipoFinan.getAt(index);
            return record.get('denominaciontipo');
        }
        return idtipofinanciamiento;
    };

    this.levantarVentanaInversiones = function(addMod, boolAceptar, bloq) {
        _this.modeloVentanaInversiones.stFinancista.reload();
        _this.modeloVentanaInversiones.stTipoFinan.reload();
        if (this.objci.acciones == true) {

            _this.ChkFastTrack.enable();

        } else {
            _this.ChkFastTrack.disable();
        }

        if(boolAceptar == false){
            Ext.getCmp('btnaceptar').hide();
            Ext.getCmp('btnaplicar').hide();
        }else{
            Ext.getCmp('btnaceptar').setVisible(true);
        }
        if (addMod == false) {
            if (_this.vistaInversionesSelectionModel.getSelected()) {
                var selecti = this.idInversionSelected;

            }

            Ext.getCmp('btnaplicar').hide();
            if(boolAceptar == true){
                Ext.getCmp('btnaceptar').setVisible(true);
            }
            
            _this.win_add_inversiones.setTitle(idioma.tlModInv);
            _this.tfdenominacion.setValue(this.gridInversiones.getSelectionModel().getSelected().data.denominacion);

            _this.modeloVentanaInversiones.stFormapropiedad.on('load', function() {
                _this.CmbFormaDePropiedad.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.idformapropiedad);
            });

            _this.modeloVentanaInversiones.stObjetivo.on('load', function() {
                row = Ext.getCmp('gp' + 'Objetivo').getStore().getById(_this.gridInversiones.getSelectionModel().getSelected().data.idobjetivo);
                indice = Ext.getCmp('gp' + 'Objetivo').getStore().indexOf(row);
                _this.CmbObjetivo.fSelect.display.push(Ext.getCmp('gp' + 'Objetivo').getStore().getAt(indice).data.codigo);
                _this.CmbObjetivo.fSelect.values.push(Ext.getCmp('gp' + 'Objetivo').getStore().getAt(indice).id);
                _this.CmbObjetivo.fSelect.valuesLoaded = _this.CmbObjetivo.fSelect.values;
                _this.CmbObjetivo.fSelect.index.push(indice);
                _this.CmbObjetivo.setValue(_this.CmbObjetivo.fSelect.display.join(", "));

            });

            _this.modeloVentanaInversiones.stClasificacion.on('load', function() {
                _this.cmbClasificacion.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.idtipoinversion);
            });
            if(bloq==1){
                _this.cmbClasificacion.disable();
            }
            _this.tfProvincia.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.provincia);

            _this.modeloVentanaInversiones.stEfecto.on('load', function() {
                _this.CmbEfectoEnComercio.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.idefectocomercial);
            });
            _this.modeloVentanaInversiones.stMedioAmbiente.on('load', function() {
                _this.cmbMedioAmbiente.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.idmedioambiente);
            });
            _this.modeloVentanaInversiones.stTipoInversion.on('load', function() {
                _this.CmbTipoInversion.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.idtipoinversionprograma);
            });
            _this.modeloVentanaInversiones.stPrograma.on('load', function() {
                _this.CmbProgramada.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.idprograma);
            });

            _this.tfFechaInicio.setValue(this.gridInversiones.getSelectionModel().getSelected().data.fechainicio);
            _this.tfFechaFin.setValue(this.gridInversiones.getSelectionModel().getSelected().data.fechafin);

            _this.modeloVentanaInversiones.stCaracteristica.on('load', function() {
                _this.CmbCaracteristica.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.idcaracteristica);
            });

            _this.tfanalisis.setValue(this.gridInversiones.getSelectionModel().getSelected().data.analpostinversiones);

            valueChkFastTrack = (this.gridInversiones.getSelectionModel().getSelected().data.fasttrack == 1) ? true : false;
            _this.ChkFastTrack.checked = valueChkFastTrack;

            valueChkPre = (this.gridInversiones.getSelectionModel().getSelected().data.preparacion == 1) ? true : false;
            _this.ChkPreparacion.checked = valueChkPre;

            Ext.getCmp('idobservacionN').setValue(this.gridInversiones.getSelectionModel().getSelected().data.observaciones);

            _this.modeloVentanaInversiones.stDesempeno.on('load', function() {
                _this.CmbDesempeno.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.iddatdesempenno);
            });

            _this.modeloVentanaInversiones.stGrupoObra.on('load', function() {
                _this.CmbGrupoObra.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.idgrupoobra);
            });

            _this.modeloVentanaInversiones.stEstado.on('load', function() {
                _this.CmbEstado.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.idestadoplaninversion);
            });

            _this.modeloVentanaInversiones.stSectorEstrategico.on('load', function() {
                _this.CmbSectorEstrategico.setValue(_this.gridInversiones.getSelectionModel().getSelected().data.idsectorestrategico);
            });


            this.modeloVentanaInversiones.stPresupuesto.reload({
                params: {
                    start: 0,
                    limit: 20,
                    identidad: this.idOrganismo,
                    idejercicio: _this.comboEjercicio.getValue(),
                    idinversion: this.idInversionSelected
                }
            });
            this.modeloVentanaInversiones.store_Financiamiento.load({
                params: {
                    start: 0,
                    limit: 20,
                    identidad: this.idOrganismo,
                    idejercicio: _this.comboEjercicio.getValue(),
                    idinversion: this.idInversionSelected
                }
            });
            this.modeloVentanaInversiones.stImportacion.reload({
                params: {
                    start: 0,
                    limit: 20,
                    identidad: this.idOrganismo,
                    idejercicio: _this.comboEjercicio.getValue(),
                    idinversion: this.idInversionSelected
                }
            });

            this.modeloVentanaInversiones.stMonedas.reload({
                params: {
                    identidad: this.idOrganismo
                }
            });

        } else {

            _this.win_add_inversiones.setTitle(idioma.tlAddInv);
            /*_this.CmbFormaDePropiedad.clearValue();
             _this.CmbObjetivo.clearValue();
             _this.tfdenominacion.reset();
             _this.tfFechaFin.reset();
             _this.tfProvincia.reset();
             _this.tfFechaInicio.reset();
             _this.cmbClasificacion.clearValue();
             _this.CmbEfectoEnComercio.clearValue();
             _this.cmbMedioAmbiente.clearValue();
             _this.CmbTipoInversion.clearValue();
             _this.CmbProgramada.clearValue();
             _this.CmbCaracteristica.clearValue();
             _this.CmbDesempeno.clearValue();
             _this.tfanalisis.reset();
             _this.Observacion.reset();*/
            this.modeloVentanaInversiones.store_Financiamiento.removeAll();
            this.modeloVentanaInversiones.stPresupuesto.removeAll();
            this.modeloVentanaInversiones.stImportacion.removeAll();
            this.modeloVentanaInversiones.stMonedas.removeAll();
        }

        _this.win_add_inversiones.on({
            beforeshow: function() {

                _this.tfdenominacion.focus(true, 700);
                _this.modeloVentanaInversiones.stFormapropiedad.load({
                    callback: function(options, success, response) {
                        _this.ctrFProp = true;
                    }
                });
                _this.modeloVentanaInversiones.stObjetivo.load({
                    callback: function(options, success, response) {
                        _this.ctrObj = true;
                    }
                });
                _this.modeloVentanaInversiones.stClasificacion.load({
                    callback: function(options, success, response) {
                        _this.ctrClasif = true;
                    }
                });
                _this.modeloVentanaInversiones.stEfecto.load({
                    callback: function(options, success, response) {
                        _this.ctrEfecto = true;
                    }
                });
                _this.modeloVentanaInversiones.stTipoInversion.load({
                    callback: function(options, success, response) {
                        _this.ctrTInv = true;
                    }
                });
                _this.modeloVentanaInversiones.stCaracteristica.load({
                    callback: function(options, success, response) {
                        _this.ctrCaract = true;
                    }
                });
                _this.modeloVentanaInversiones.stMedioAmbiente.load({
                    callback: function(options, success, response) {
                        _this.ctrObj = true;
                    }
                });
                _this.modeloVentanaInversiones.stPrograma.load({
                    callback: function(options, success, response) {
                        _this.ctrProg = true;
                    }
                });
                _this.modeloVentanaInversiones.stGrupoObra.load({
                    callback: function(options, success, response) {
                        _this.ctrGObra = true;
                    }
                });
                _this.modeloVentanaInversiones.stEstado.load({
                    callback: function(options, success, response) {
                        _this.ctrEstado = true;
                    }
                });
                _this.modeloVentanaInversiones.stSectorEstrategico.load({
                    callback: function(options, success, response) {
                        _this.ctrSEstrag = true;
                    }
                });
                _this.modeloVentanaInversiones.stMonedas.load({
                    callback: function(options, success, response) {
                        _this.ctrMonedas = true;
                    },
                    params: {
                        identidad: idorganismo
                    }});

            },
            show: function() {
                _this.openWin = false;

                _this.barraCtrAddInversion = Ext.MessageBox.show({
                    msg: 'Por favor espere...',
                    width: 270,
                    wait: true,
                    progress: true,
                    closable: false
                });

                document.oncontextmenu = function() {
                    return false;
                };
            },
            hide: function() {
                _this.openWin = true;
                //boolAceptar = true;
            },
            close: function() {
                boolAceptar = true;
            }
        });
        _this.win_add_inversiones.show();

    };

};