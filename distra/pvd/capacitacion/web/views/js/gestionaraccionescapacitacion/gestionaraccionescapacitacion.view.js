/*
 * Gestionar accion de capacitacion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Gestionaraccion
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Capacitacion.Gestionaraccion');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz/////////////////////////////////////////////////////////

Pvd.Capacitacion.Gestionaraccion.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaC',
            iconCls: 'ayuda',
            tooltip: idioma.textToolTipAyuda,
            text: idioma.BtnAyuda
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarNDC,
            iconCls: 'adicionar',
            hidden: true
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificarNDC,
            iconCls: 'modificar',
            hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarNDC,
            iconCls: 'eliminar',
            hidden: true
        });

        //Botón para ejecutar la acción.
        this.btnEjecutar = new Ext.Button({
            id: 'btnEjecutar',
            text: 'Ejecutar',
            disabled: true,
            tooltip: 'Ejecutar acci&oacute;n de capacitaci&oacute;n <b>(Alt+J)</b>',
            iconCls: 'ejecutar'
        });

        //Botón para exportar plan.
        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: '<u>E</u>xportar',
            tooltip: 'Exportar plan de capacitaci&oacute;n <b>(Alt+E)</b>',
            iconCls: 'exportar'
        });

        this.btnLeyenda = new Pvd.Plugins.Leyenda.btnLeyenda({
            param_html: '<span class="leyendaIni"></span><b class="leyendaTextIni">&nbsp;Iniciada</b><br/><span class="leyendaTerm"></span><b class="leyendaTextTerm">&nbsp;Terminada</b><br/><span class="leyendaAtr"></span><b class="leyendaTextAtr">&nbsp;Atrasada</b><br/><hr/><span class="leyendaEval"></span><b class="leyendaTextEval">&nbsp;Sin evaluaci&oacute;n de impacto</b>',
            param_width: 190
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
            cargos: false,
            inicial: perfil.idestructuracomun,
            split: true,
            region: 'center'
        });

        //color del estado
        function colorEstado(val, metaData, record) {
            if(val != null && record.data.estado == 2) {
                return '<span style="color:#1e9408;"><b>' + val + '</b></span>';
            } else if(val != null && record.data.estado == 3) {
                return '<span style="color:#111ad1;"><b>' + val + '</b></span>';
            } else if(val != null && record.data.estado == 4) {
                return '<span style="color:#d11608;"><b>' + val + '</b></span>';
            } else {
                return val;
            }
        }

        this.expanderAcc = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Duraci&oacute;n: </b>{duracion} d&iacute;as</p>' +
                '<b>Lugar:</b> {lugar}</p><b>Categor&iacute;as:</b> {categorias}</p><b>Necesidades:</b>' +
                ' {necesidades}</p>'
            )
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            this.expanderAcc,
            {
                header: '',
                width: 100,
                hidden: true,
                dataIndex: 'estructura',
                sortable : false
            },{
                header: 'Denominaci&oacute;n',
                width: 350,
                dataIndex: 'denominacion',
                sortable : false,
                renderer: colorEstado
            }, {
                header: 'Modo de formaci&oacute;n',
                width: 250,
                sortable : false,
                dataIndex: 'modoformacion',
                renderer: colorEstado
            }, {
                header: 'Fecha inicio',
                width: 100,
                sortable : false,
                dataIndex: 'fdesde',
                renderer: colorEstado
            }, {
                header: 'Fecha fin',
                width: 100,
                sortable : false,
                dataIndex: 'fhasta',
                renderer: colorEstado
            }, {
                header: 'Fecha inicio real',
                width: 100,
                sortable : false,
                dataIndex: 'frdesde',
                renderer: colorEstado
            }, {
                header: 'Fecha fin real',
                width: 100,
                sortable : false,
                dataIndex: 'frhasta',
                renderer: colorEstado
            }
        ]);

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stAcciones,
            pageSize: 15,
            disabled: true,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        this.dfFInicioBuscar = new Ext.form.DateField({
            id: 'dfFInicioBuscar',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: true,
            endDateField: 'dfFFinBuscar',
            readOnly: true,
            maxValue: '31/12/2100',
            minValue: '01/01/1900'
        });

        this.dfFInicioBuscar.on('valid',function(n, m, o){
            if (self.btnBuscar.disabled) {
                self.btnBuscar.enable();
            }
            if (self.btnLimpiar.disabled) {
                self.btnLimpiar.enable();
            }
        });

        this.dfFFinBuscar = new Ext.form.DateField({
            id: 'dfFFinBuscar',
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: true,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFInicioBuscar'
        });

        this.dfFFinBuscar.on('valid',function(n, m, o){
            if (self.btnBuscar.disabled) {
                self.btnBuscar.enable();
            }
            if (self.btnLimpiar.disabled) {
                self.btnLimpiar.enable();
            }
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            tooltip: idioma.lbBtnBuscar,
            disabled: true,
            iconCls: 'buscar',
            handler: function ()
            {
                modelo.stAcciones.load({params:{
                    query: self.sfBuscar.getValue(),
                    desde: self.dfFInicioBuscar.getRawValue(),
                    hasta: self.dfFFinBuscar.getRawValue(),
                    start: 0,
                    limit: 15}});
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            tooltip: idioma.lbBtnLimpiar,
            disabled: true,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.sfBuscar.reset();
                self.dfFInicioBuscar.reset();
                self.dfFFinBuscar.reset();
                modelo.stAcciones.load({params:{start:0,limit:15}});
                self.btnLimpiar.disable();
            }.createDelegate(this)
        });

        //Listado de acciones de capacitacion.
        this.gpAcciones = new Ext.grid.GridPanel({
            region: 'north',
            split: true,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Acciones" : "Acci&oacute;n"]})'
            }),
            height: 400,
            plugins: this.expanderAcc,
            border: false,
            tbar: ['Buscar acci&oacute;n: ', this.sfBuscar,'-',
                'Fecha inicio:', this.dfFInicioBuscar, '-',
                'Fecha fin:', this.dfFFinBuscar,
                this.btnBuscar,
                this.btnLimpiar,
            ],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stAcciones,
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stAcciones,
                displayInfo: true
            })
        });

        //Botón para adicionar participantes.
        this.btnAdicionarParticip = new Ext.Button({
            id: 'btnAdicionarParticip',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarP,
            iconCls: 'adicionar',
            //hidden: true
        });

        //Botón para eliminar participantes.
        this.btnEliminarParticip = new Ext.Button({
            id: 'btnEliminarParticip',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarP,
            iconCls: 'eliminar',
            //hidden: true
        });

        //Botón para resultado final
        this.btnResultados = new Ext.Button({
            id: 'btnResultados',
            text: 'Resultados',
            tooltip: 'Resultados',
            iconCls: 'ficha',
            //hidden: true
        });

        //Botón para evaluar
        this.btnEvaluar = new Ext.Button({
            id: 'btnEvaluar',
            text: 'Evaluar',
            tooltip: 'Realizar evaluaci&oacute;n de impacto',
            iconCls: 'evaluar',
            //hidden: true
        });

        function terminado(val) {
            if(val == 1) {
                return '<span style="color: #33aa33;">' + '&#10004;' + '</span>';
            }
        }

        //color de alerta
        function coloralerta(val, metaData, record) {
            if(val != null && record.data.alerta == 1) {
                return '<span style="color:#dd9b3c;"><b>' + val + '</b></span>';
            } else {
                return val;
            }
        }

        this.columnasgppart = new Ext.grid.ColumnModel([
            {
                header: 'No. identidad',
                width: 100,
                sortable : false,
                dataIndex: 'numid',
                renderer: coloralerta
            },{
                header: 'Nombre y apellidos',
                width: 250,
                dataIndex: 'nombreyapellidos',
                sortable : false,
                renderer: coloralerta
            },
            {
                header: 'Cargo',
                width: 250,
                sortable : false,
                dataIndex: 'cargo',
                renderer: coloralerta
            },
            {
                header: 'Categoría ocupacional',
                width: 200,
                sortable : false,
                dataIndex: 'categoria',
                renderer: coloralerta
            },
            {
                header: 'Resultado final',
                width: 90,
                align: 'center',
                sortable : false,
                dataIndex: 'resultado',
                renderer: coloralerta
            },
            {
                header: 'Terminado',
                width: 60,
                align: 'center',
                sortable : false,
                dataIndex: 'terminado',
                renderer: terminado
            }
        ]);

        //Listado de participantes.
        this.gpParticipantes = new Ext.grid.GridPanel({
            id: 'gpParticipantes',
            tbar: [this.btnAdicionarParticip, this.btnEliminarParticip, this.btnResultados, this.btnEvaluar],
            title: 'Participantes',
            region: 'center',
            border: false,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stParticipantes,
            autoScroll: true,
            cm: this.columnasgppart,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stParticipantes,
                displayInfo: true
            })
        });

        //Add participantes

        this.sfBuscarPer = new Ext.app.SearchField({
            store: modelo.stPersonas,
            pageSize: 15,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        this.smselectPer = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.chbMostrarTodas = new Ext.form.Checkbox({
            id: 'chbMostrarTodas',
            boxLabel: 'Mostrar todas las personas',
            hidden: false,
            labelSeparator : '',
            name: 'mostrar',
            anchor: '98%'
        });

        this.gpPersonas = new Ext.grid.GridPanel({
            //title   : 'Listado de personas',
            tbar: ['Buscar persona: ', this.sfBuscarPer, '-', this.chbMostrarTodas],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            store   : modelo.stPersonas,
            sm: this.smselectPer,
            loadMask: {msg: 'Cargando ...'},
            columns : [this.smselectPer,
                {
                    header   : 'No. identidad',
                    width    : 100,
                    dataIndex: 'numid'
                }, {
                    header   : 'Apellidos y nombres',
                    width    : 200,
                    dataIndex: 'nombreyapellidos'
                }, {
                    header   : 'Cargo',
                    width    : 250,
                    dataIndex: 'cargo'
                }, {
                    header   : 'Categor&iacute;a ocupacional',
                    width    : 200,
                    dataIndex: 'categoria'
                }, {
                    width    : 200,
                    hidden   : true,
                    dataIndex: 'entidad_area'
                }
            ],
            bbar    : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : modelo.stPersonas,
                displayInfo: true
            })
        });

        this.btnCancelarPart = new Ext.Button({
            //nextTab: 'cbTipo',
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarPart = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        //Ventana con el listado de personas
        this.windPersonas= new Ext.Window({
            modal: true,
            buttons: [
                this.btnCancelarPart,
                this.btnAceptarPart
            ],
            title: idioma.msgAddPart,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 800,
            height: 400,
            items: [this.gpPersonas]
        });
//////////////////////////////cursos/////////////////////////////////
        this.expandercursos = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><b>Profesor:</b> {profesor}</p><br>'
            )
        });
        this.columnasgpcursos = new Ext.grid.ColumnModel([
            this.expandercursos,
            {
                header: 'Denominaci&oacute;n',
                width: 350,
                dataIndex: 'denominacion',
                sortable : false,
                renderer: colorEstado
            },
            {
                header: 'Fecha inicio',
                width: 100,
                sortable : false,
                dataIndex: 'fdesde',
                renderer: colorEstado
            },
            {
                header: 'Fecha fin',
                width: 100,
                sortable : false,
                dataIndex: 'fhasta',
                renderer: colorEstado
            },
            {
                header: 'Fecha inicio real',
                width: 100,
                sortable : false,
                dataIndex: 'frdesde',
                renderer: colorEstado
            },
            {
                header: 'Fecha fin real',
                width: 100,
                sortable : false,
                dataIndex: 'frhasta',
                renderer: colorEstado
            }
        ]);

        //Botón para adicionar curso.
        this.btnAdicionarCurso = new Ext.Button({
            id: 'btnAdicionarCurso',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarC,
            iconCls: 'adicionar',
            //hidden: true
        });

        //Boton para modificar.
        this.btnModificarCurso = new Ext.Button({
            id: 'btnModificarCurso',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificarC,
            iconCls: 'modificar',
            //hidden: true
        });

        //Botón para eliminar curso.
        this.btnEliminarCurso = new Ext.Button({
            id: 'btnEliminarCurso',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarC,
            iconCls: 'eliminar',
            //hidden: true
        });

        //Botón para ejecutar el curso.
        this.btnEjecutarC = new Ext.Button({
            id: 'btnEjecutarC',
            disabled: true,
            text: 'Ejecutar',
            tooltip: 'Ejecutar curso de capacitaci&oacute;n',
            iconCls: 'ejecutar'
        });

        //Listado de cursos.
        this.gpCursos = new Ext.grid.GridPanel({
            id: 'gpCursos',
            title: 'Cursos',
            tbar: [this.btnAdicionarCurso,
                this.btnModificarCurso,
                this.btnEliminarCurso,
                this.btnEjecutarC,
            ],
            region: 'center',
            border: false,
            plugins: this.expandercursos,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stCursos,
            autoScroll: true,
            cm: this.columnasgpcursos
        });

        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar',
            text: '<u>G</u>uardar',
            disabled: true,
            tooltip: 'Guardar datos <b>(Alt+G)</b>',
            iconCls: 'guardar'
        });

        this.smselectAseg = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.columnasgpaseg = new Ext.grid.ColumnModel([
            this.smselectAseg,
            {
                header: 'Denominaci&oacute;n',
                width: 250,
                dataIndex: 'denominacion',
                sortable : false
            }
        ]);

        //Listado de aseguramientos.
        this.gpAseguramientos = new Ext.grid.GridPanel({
            id: 'gpAseguramientos',
            sm: this.smselectAseg,
            title: 'Aseguramientos',
            tbar: [this.btnGuardar],
            region: 'center',
            border: false,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stAseguramientos,
            autoScroll: true,
            cm: this.columnasgpaseg
        });

        // Componentes para adicionar y modificar acciones de capacitación

        this.tfdenom = new Ext.form.TextField({
            id: 'tfdenomc',
            fieldLabel: 'Denominaci&oacute;n de la acci&oacute;n de capacitaci&oacute;n',
            allowBlank : false,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            anchor: '99%',
            name : 'denominacion'
        });

        this.cbModoFormacion = new Ext.form.ComboBox({
            store: modelo.stModoFormacion,
            fieldLabel: 'Modo de formaci&oacute;n',
            anchor: '98%',
            height: 100,
            id: 'cbModoFormacion',
            hiddenName:'idmodoformacion',
            displayField: 'denominacion',
            valueField: 'idmodoformacion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        var fecha = new Date();

        this.dfFInicioA = new Ext.form.DateField({
            id: 'dfFInicioA',
            allowBlank: false,
            fieldLabel: 'Fecha inicio',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor:'98%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            readOnly : true,
            maxValue: '31/12/2100',
            minValue:'01/01/1900',
            vtype: 'daterange'
        });

        this.dfFFinA = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            allowBlank: false,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'98%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            startDateField: 'dfFInicioA',
            vtype:'daterange'
        });

        this.nfDuracion = new Ext.form.NumberField({
            fieldLabel: 'Duraci&oacute;n(D&iacute;as)',
            allowBlank: true,
            anchor:'98%',
            minLength: 1,
            enableKeyEvents: true,
            allowDecimals: false,
            minValue: 1
        });

        this.tfLugar = new Ext.form.TextField({
            id: 'tflugar',
            fieldLabel: 'Lugar',
            allowBlank : true,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            anchor: '98%',
            name : 'lugar'
        });

        this.cbCategorias = new Ext.ux.form.LovCombo({
            store: modelo.stCategorias,
            displayField: 'denominacion',
            fieldLabel: 'Categor&iacute;as ocupacionales',
            mode: 'local',
            allowBlank : true,
            anchor: '99%',
            hiddenName: 'iddominio',
            typeAhead: true,
            enableQtip: true,
            triggerAction: 'all',
            editable: false,
            emptyText:'Seleccione...',
            listeners: {
                render: function(combo) {
                    this.triggers[1].remove();
                },
                beforeselect: function(combo, record, index) {
                    this.valueField = 'idcategoria';
                },
                blur: function() {
                    this.valueField = 'idcategoria';
                    this.isValid();
                    if (this.getRawValue() != '') {
                        this.clearInvalid();
                    }
                }
            }
        });

        this.chbEspCurso = new Ext.form.Checkbox({
            boxLabel: 'Especificar curso',
            hideLabel : true,
            name: 'curso',
            anchor: '100%'
        });

        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            region: 'east',
            width: 400,
            id: 'formularioGestion',
            title: 'Datos b&aacute;sicos',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenom]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.cbModoFormacion]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFInicioA]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFFinA]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.nfDuracion]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.tfLugar]
                    },{
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.cbCategorias]
                    },{
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.chbEspCurso]
                    }]
            }]
        });

        this.smselectAccNec = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.columnasgpan= new Ext.grid.ColumnModel([
            this.smselectAccNec,
            {
                header: 'Necesidades de capacitación',
                width: 350,
                dataIndex: 'denominacion',
                sortable : false
            }
        ]);

        //Listado de necesidades.
        this.gpAccionNecesidades = new Ext.grid.GridPanel({
            id: 'gpAccionNecesidades',
            sm: this.smselectAccNec,
            title: 'Necesidades de capacitación',
            region: 'center',
            border: false,
            height: 300,
            width: 400,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stAccionNecesidades,
            autoScroll: true,
            cm: this.columnasgpan
        });

        this.tbaddAccion = new Ext.TabPanel({
            id: 'tbaddAccion',
            region: 'center',
            margins: '0 0 0 0',
            height: '100%',
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.formularioGestion, this.gpAccionNecesidades],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });

        this.pDatosAccion = new Ext.Panel({
            layout: 'border',
            region: 'center',
            autoScroll: true,
            border: false,
            items: [this.gpAccionNecesidades, this.formularioGestion]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicariam',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 800,
            height: 390,
            items: [this.pDatosAccion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.tfdenom.focus(true, 500);
                }
            }
        });

        //Add curso

        this.cbCurso = new Ext.form.ComboBox({
            store: modelo.stCursosNom,
            fieldLabel: 'Curso',
            anchor: '99%',
            height: 100,
            id: 'cbCurso',
            hiddenName:'idcurso',
            displayField: 'denominacion',
            valueField: 'idcurso',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });


        this.taDescripcionCur = new Ext.form.TextArea({
            fieldLabel: 'Descripci&oacute;n',
            name: 'descripcion',
            anchor: '99%',
            height: 100,
            hiddenname: 'descripcion',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            allowBlank:	true
        });

        var fecha = new Date();

        this.dfFInicioC = new Ext.form.DateField({
            id: 'dfFInicioC',
            allowBlank: false,
            fieldLabel: 'Fecha inicio',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            //value: fecha.format('d/m/Y'),
            editable: false,
            readOnly : true,
            maxValue: '31/12/2100',
            minValue:'01/01/1900',
            vtype: 'daterange'
        });

        this.dfFFinC = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            allowBlank: false,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            startDateField: 'dfFInicioC',
            vtype:'daterange'
        });

        this.tfProfesor = new Ext.form.TextField({
            id: 'tfProfesor',
            fieldLabel: 'Profesor',
            allowBlank: true,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            anchor: '99%',
            name: 'profesor'
        });

        //Formulario de gestion.
        this.formularioGestionCurso = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.cbCurso]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.taDescripcionCur]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFInicioC]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFFinC]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tfProfesor]
                    }]
            }]
        });

        this.btnCancelarCurso = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAplicarCurso = new Ext.Button({
            id: 'btnAplicarCurso',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

        this.btnAceptarCurso = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        //Ventana de gestion.
        this.ventanaGestionCurso = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 350,
            items: [this.formularioGestionCurso],
            buttons: [
                this.btnCancelarCurso,
                this.btnAplicarCurso,
                this.btnAceptarCurso
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.cbCurso.focus(true, 500);
                }
            }
        });

        ///////////////Evaluar//////////////////////

        // Area de texto observación
        this.taObservacion = new Ext.form.TextArea({
            fieldLabel: 'Observaci&oacute;n',
            name: 'observacion',
            anchor:	'99%',
            height: 80,
            hiddenname: 'observacion',
            maxLength: 500,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            allowBlank:	true
        });

        this.tfResultadoCurso = new Ext.form.TextField({
            maxLength: 50,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            anchor:	'99%',
            name : 'resultado'
        });

        this.colgpcursos = new Ext.grid.ColumnModel([
            {
                header: 'Denominaci&oacute;n',
                width: 300,
                dataIndex: 'denominacion',
                sortable : false
            },
            {
                header: 'Resultado',
                width: 60,
                sortable : false,
                dataIndex: 'resultadocurso',
                editor: this.tfResultadoCurso
            }
        ]);

        //Listado de cursos a evaluar.
        this.gpCursosEval = new Ext.grid.EditorGridPanel({
            id: 'gpCursosEval',
            title: 'Listado de cursos',
            clicksToEdit: 1,
            region: 'center',
            border: false,
            height: 200,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stCursosEval,
            autoScroll: true,
            cm: this.colgpcursos
        });

        this.fsCursos = new Ext.form.FieldSet({
            title: 'Resultado de los cursos',
            name: 'chcursos',
            id: 'chcursos',
            checkboxToggle: true,
            collapsed: true,
            layout: 'column',
            autoHeight: true,
            width: 400,
            items: [
                {
                    columnWidth: 1.0,
                    layout: 'form',
                    items: this.gpCursosEval
                }
            ]
        });

        this.chbTerminado= new Ext.form.Checkbox({
            fieldLabel: 'Terminado',
            hidden: false,
            name: 'terminado',
            anchor: '100%'
        });

        this.tfResultado = new Ext.form.TextField({
            fieldLabel: 'Resultado final',
            //allowBlank : false,
            maxLength: 50,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            anchor:	'99%',
            name : 'resultadofinal'
        });

        //Formulario de resultados.
        this.formResultados = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth:0.3,
                        layout: 'form',
                        items: [this.chbTerminado]
                    },{
                        columnWidth: 0.7,
                        layout: 'form',
                        items: [this.tfResultado]
                    },{
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.taObservacion]
                    },{
                        columnWidth:1.0,
                        id: 'fsCursos',
                        layout: 'form',
                        items: [this.fsCursos]
                    }]
            }]
        });

        this.btnCancelarEv = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarEv = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        //Ventana de Resultados.
        this.windResultados = new Ext.Window({
            modal: true,
            title: 'Resultados del participante',
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 440,
            height: 280,
            items: [this.formResultados],
            buttons: [
                this.btnCancelarEv,
                this.btnAceptarEv
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.chbTerminado.focus(true, 500);
                }
            }
        });

        //Evaluacion de impacto//

        //Botón para adicionar.
        this.btnAdicionarInd = new Ext.Button({
            id: 'btnAdicionar',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarI,
            iconCls: 'adicionar'
        });

        //Boton para modificar.
        this.btnModificarInd = new Ext.Button({
            id: 'btnModificarInd',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificarI,
            iconCls: 'modificar'
        });

        //Botón para eliminar.
        this.btnEliminarInd = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarI,
            iconCls: 'eliminar'
        });

        this.btnExportarEval = new Ext.Button({
            id: 'btnExportarEval',
            text: '<u>E</u>xportar',
            tooltip: 'Exportar evaluaci&oacute;n de impacto',
            iconCls: 'exportar'
        });

        this.expanderind = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Complemento:</b>{complemento}</p><br>'
            )
        });

        this.columnasgpind = new Ext.grid.ColumnModel([
            this.expanderind,
            {
                header: 'Denominaci&oacute;n',
                width: 260,
                dataIndex: 'indicador',
                sortable : false
            },
            {
                header: 'Evaluaci&oacute;n',
                width: 100,
                dataIndex: 'valor',
                sortable : false
            },
            {
                header: '',
                hidden: true,
                width: 250,
                sortable : false,
                dataIndex: 'periodo'
            }
        ]);

        //Listado de indicadores del participante.
        this.gpIndicadoresPart = new Ext.grid.GridPanel({
            tbar: [this.btnAdicionarInd, this.btnModificarInd, this.btnEliminarInd, this.btnExportarEval],
            title: 'Listado de indicadores',
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Indicadores" : "Indicador"]})'
            }),
            frame: true,
            region: 'center',
            plugins: this.expanderind,
            border: true,
            height: 200,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stIndPartic,
            autoScroll: true,
            cm: this.columnasgpind
        });

        this.smselectNecVen = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.columnasgpnec = new Ext.grid.ColumnModel([
            this.smselectNecVen,
            {
                header: 'Necesidad de capacitaci&oacute;n',
                width: 250,
                dataIndex: 'necesidad',
                sortable : false
            },
            {
                header: 'F. de satisfacci&oacute;n',
                width: 115,
                sortable : false,
                dataIndex: 'fvencida'
            }
        ]);

        this.btnGuardarNecVen = new Ext.Button({
            id: 'btnGuardar',
            text: '<u>G</u>uardar',
            tooltip: 'Guardar datos <b>(Alt+G)</b>',
            iconCls: 'guardar'
        });

        //Listado de necesidades vencidas.
        this.gpNecesidadesVen = new Ext.grid.GridPanel({
            title: 'Listado de necesidades de capacitaci&oacute;n satisfechas',
            tbar: [this.btnGuardarNecVen],
            region: 'center',
            sm: this.smselectNecVen,
            border: true,
            frame: true,
            height: 200,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stNecesidadesVencidas,
            autoScroll: true,
            cm: this.columnasgpnec
        });

        //Formulario de evaluar.
        this.formEvaluar = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.gpIndicadoresPart]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.gpNecesidadesVen]
                    }]
            }]
        });

        this.btnCancelarEI = new Ext.Button({
            iconCls: 'cerrar',
            tooltip: 'Cerrar ventana <b>(Ctrl+Alt+X)</b>',
            text: 'Cerrar'
        });

        //Ventana de evaluar.
        this.windEvaluar = new Ext.Window({
            modal: true,
            title: 'Realizar evaluaci&oacute;n de impacto',
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 440,
            height: 500,
            items: [this.formEvaluar],
            buttons: [
                this.btnCancelarEI
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.taObservacion.focus(true, 500);
                }
            }
        });

        //Add indicador//

        this.cbPeriodo = new Ext.form.ComboBox({
            store: modelo.stPeriodos,
            fieldLabel: 'Periodo',
            anchor: '99%',
            height: 100,
            hiddenName:'idperiodo',
            displayField: 'denominacion',
            valueField: 'idperiodo',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbIndicador = new Ext.form.ComboBox({
            store: modelo.stIndicadores,
            fieldLabel: 'Indicador',
            anchor: '99%',
            height: 100,
            hiddenName:'idindicador',
            displayField: 'denominacion',
            valueField: 'idindicador',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbEvaluacion = new Ext.form.ComboBox({
            store: modelo.stValores,
            fieldLabel: 'Evaluaci&oacute;n',
            anchor: '98%',
            height: 100,
            hiddenName:'idvalor',
            displayField: 'valor',
            valueField: 'idvalor',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true
        });

        this.dfFechaEval = new Ext.form.DateField({
            id: 'dfFechaEval',
            allowBlank: false,
            fieldLabel: 'Fecha de evaluaci&oacute;n',
            name: 'fecha',
            hiddenname: 'fecha',
            anchor:'98%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            readOnly : true,
            maxValue: '31/12/2100',
            minValue:'01/01/1900',
            vtype: 'daterange'
        });

        this.taObservacionInd = new Ext.form.TextArea({
            fieldLabel: 'Complemento',
            name: 'complemento',
            anchor:	'99%',
            height: 80,
            hiddenname: 'complemento',
            maxLength: 500,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            allowBlank:	true
        });

        //Formulario de gestion.
        this.formAddInd = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth:1.0,
                    layout: 'form',
                    items: [this.cbPeriodo]
                },{
                    columnWidth:1.0,
                    layout: 'form',
                    items: [this.cbIndicador]
                },{
                    columnWidth:0.5,
                    layout: 'form',
                    items: [this.cbEvaluacion]
                },{
                    columnWidth:0.5,
                    layout: 'form',
                    items: [this.dfFechaEval]
                },{
                    columnWidth:1.0,
                    layout: 'form',
                    items: [this.taObservacionInd]
                }]
            }]
        });

        this.btnCancelarInd= new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAplicarInd = new Ext.Button({
            id: 'btnAplicarInd',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

        this.btnAceptarInd = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        //Ventana de gestion de indicador.
        this.windAddInd = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 330,
            items: [this.formAddInd],
            buttons: [
                this.btnCancelarInd,
                this.btnAplicarInd,
                this.btnAceptarInd
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.cbPeriodo.focus(true, 500);
                }
            }
        });

        //Ejecutar//

        this.dfDesde = new Ext.form.DateField({
            id: 'dfDesde',
            allowBlank: false,
            fieldLabel: 'Fecha inicio',
            name: 'frdesde',
            hiddenname: 'frdesde',
            anchor:'97%',
            format:'d/m/Y',
            //value: fecha.format('d/m/Y'),
            editable: false,
            readOnly : true,
            maxValue: fecha.format('d/m/Y'),
            minValue:'01/01/1900',
            vtype: 'daterange'
        });

        this.dHasta = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            allowBlank: true,
            name: 'frhasta',
            hiddenname:'frhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue: fecha.format('d/m/Y'),
            minValue:'01/01/1900',
            startDateField: 'dfDesde',
            vtype:'daterange'
        });

        this.taObservacionEjec = new Ext.form.TextArea({
            fieldLabel: 'Observaci&oacute;n',
            name: 'observacion',
            anchor:	'99%',
            height: 80,
            hiddenname: 'observacion',
            maxLength: 500,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            allowBlank:	true
        });

        //Formulario de gestion.
        this.formEjec = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfDesde]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dHasta]
                    },{
                        columnWidth:1.0,
                        id: 'colObservaciones',
                        layout: 'form',
                        items: [this.taObservacionEjec]
                }]
            }]
        });

        this.btnCancelarEjec= new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarEjec = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        //Ventana de gestion.
        this.windEjec = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 130,
            items: [this.formEjec],
            buttons: [
                this.btnCancelarEjec,
                this.btnAceptarEjec
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.dfDesde.focus(true, 500);
                }
            }
        });
//Exportar plan de capacitacion
        this.dfDesdePlan = new Ext.form.DateField({
            id: 'dfDesdePlan',
            allowBlank: false,
            fieldLabel: 'Fecha inicio',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            //value: fecha.format('d/m/Y'),
            editable: false,
            readOnly : true,
            maxValue: '01/01/2100',
            minValue:'01/01/1900',
            vtype: 'daterange'
        });

        this.dHastaPlan = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            allowBlank: false,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue: '01/01/2100',
            minValue:'01/01/1900',
            startDateField: 'dfDesdePlan',
            vtype:'daterange'
        });

        //Formulario de gestion.
        this.formFechaPlan = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth:0.5,
                    layout: 'form',
                    items: [this.dfDesdePlan]
                },{
                    columnWidth:0.5,
                    layout: 'form',
                    items: [this.dHastaPlan]
                }]
            }]
        });

        this.btnCancelarPlan= new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarPlan = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        //Ventana de gestion.
        this.windFechasPlan = new Ext.Window({
            title: 'Seleccionar periodo',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 130,
            items: [this.formFechaPlan],
            buttons: [
                this.btnCancelarPlan,
                this.btnAceptarPlan
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.dfDesdePlan.focus(true, 500);
                }
            }
        });

        this.tabPanel = new Ext.TabPanel({
            id: 'idrepind',
            region: 'center',
            disabled: true,
            split: true,
            margins: '0 0 0 0',
            height: '100%',
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.gpParticipantes, this.gpAseguramientos, this.gpCursos],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });

        //Vista general
        new Ext.Viewport({
            layout: 'border',
            items: [
                {region: 'west',
                    xtype: 'panel',
                    id: 'east-panel',
                    autoHeight: false,
                    split: true,
                    width: '25%',
                    border: false,
                    collapsible: true,
                    title: 'Estructura organizativa',
                    layout: 'fit',
                    items: [this.tpEstructura]
                },{region: 'center',
                    xtype: 'panel',
                    id: 'center-panel',
                    title: 'Acciones de capacitaci&oacute;n',
                    autoHeight: false,
                    split: true,
                    width: '75%',
                    border: false,
                    tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnEjecutar, this.btnExportar, '->', this.btnLeyenda, this.btnAyuda],
                    layout: 'border',
                    items: [this.gpAcciones, this.tabPanel]
                }

            ]
        });

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionaraccionescapacitacion', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Capacitacion.Gestionaraccion.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Capacitacion.Gestionaraccion.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Capacitacion.Gestionaraccion.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});