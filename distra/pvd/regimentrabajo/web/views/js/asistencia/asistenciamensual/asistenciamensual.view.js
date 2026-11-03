Ext.ns('Pvd.ControlAsistencia.Asistenciamensual');
//Vista del componente.
Pvd.ControlAsistencia.Asistenciamensual.Vista = {

    init: function(idioma, modelo) {
        var fech = document.getElementById('fecha').getAttributeNode('value').value;
        this.fecha = new Date(fech.split('/')[2],fech.split('/')[1]-1,fech.split('/')[0]);
        var f = this.fecha.format('d/m/Y');
        var explodeDate = f.split('/');
        this.fech = '01/' + explodeDate[1] + '/' + explodeDate[2];
        this.Maskara = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando datos..."});
        var scope = this;

        this.comboMeses = new Ext.form.ComboBox({
            id:'comboMeses',
            store: modelo.storeMeses,
            displayField:'denominacion',
            valueField:'idmes',
            typeAhead: true,
            mode: 'local',
            width:100,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            value:this.fecha.getMonth()+1
        });

        this.comboYear = new Ext.form.ComboBox({
            id:'comboYear',
            store: modelo.storeYear,
            displayField:'denominacion',
            valueField:'idyear',
            typeAhead: true,
            mode: 'local',
            width:100,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            selectOnFocus:true,
            value:this.fecha.getFullYear()
        });

        this.filtro = new Ext.form.TextField({
            id: 'filtro',
            name: 'filtro',
            hiddenname: 'filtro',
            minLength: 3,
            maxLength: 60,
            prevTab: 'btnAceptar',
            nextTab: 'fechainicio',
            regex:/^([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc]*)+$/,
            regexText: idioma.regexBusquedaNombre,
            emptyText:idioma.CriterioBuscar,
            anchor: '96%',
            allowBlank: true
        });

        //panel de estructura
        this.estructura = new Ext.estructura.panel.PanelEstructura({
            id:'estructura',
            margins: '0 0 0 0',
            border:false,
            split: true,
            //width: '25%',
            //region: 'center',
            //Otros parametros
            inicial : perfil.idestructuracomun
        });
        //panel de estructura

        this.tiporeporte = new Ext.form.ComboBox({
            id:'tiporeporte',
            store: modelo.storereporte,
            displayField:'denominacion',
            valueField:'idreporte',
            typeAhead: true,
            mode: 'local',
            width:150,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            selectOnFocus:true,
            value:1,
        });

        this.certificacion = new Ext.form.ComboBox({
            id:'certificacion',
            store: modelo.storecertificacion,
            displayField:'denominacion',
            valueField:'idcertificacion',
            typeAhead: true,
            mode: 'local',
            width:130,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            selectOnFocus:true,
            tpl:'<tpl for=".">'+
            '<tpl if="0==0"><div class="x-combo-list-item" >{icono} {denominacion}</div></tpl>'+
            '</tpl>',
        });

        this.btnLimpiarCert = new Ext.Button({
            id: 'limpiarCert',
            text: 'Limpiar',
            tooltip: 'Limpiar filtro(s)',
            iconCls: 'limpiar'
        });

        this.btnRestaurar = new Ext.Button({
            id: 'btnRestaurar',
            text: 'Recalcular',
            tooltip: 'Recalcular horas perdidas',
            hidden: true,
            iconCls: 'sincronizar'
        });

        this.tiporango = new Ext.form.ComboBox({
            id:'tiporango',
            store: modelo.storequincenal,
            displayField:'denominacion',
            valueField:'idrango',
            typeAhead: true,
            mode: 'local',
            width:150,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            selectOnFocus:true,
            value:1,
        });

        this.tipoanalisis = new Ext.form.ComboBox({
            id:'tipoanalisis',
            store: modelo.storeanalisis,
            displayField:'denominacion',
            valueField:'idanalisis',
            typeAhead: true,
            mode: 'local',
            width:120,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            selectOnFocus:true,
            value:1,
        });

        this.desde = new Ext.form.DateField({
            id: 'desde',
            name: 'fdesde',
            format: 'd/m/Y',
            readOnly: false,
            width:100,
            allowBlank: true,
            value:  this.fech,
            invalidText: idioma.invalidTextFecha,
            maxValue: this.fecha.format('d/m/Y'),
            allowBlank : false,
            blankText: idioma.lbCampoVacio,
            listeners:{change: function(tf, n,o){
                cambio = 1;
                if(tf.isValid() && scope.hasta.isValid() ){
                    scope.btnBuscar.enable();
                }else{
                    scope.btnBuscar.disable();
                }
            }}
        });

        this.hasta = new Ext.form.DateField({
            id: 'hasta',
            name: 'fhasta',
            format: 'd/m/Y',
            readOnly: false,
            width:100,
            allowBlank: true,
            invalidText: idioma.invalidTextFecha,
            value: this.fecha.format('d/m/Y'),
            maxValue: this.fecha.format('d/m/Y'),
            allowBlank : false,
            blankText: idioma.lbCampoVacio,
            listeners:{change: function(tf, n,o){
                cambio = 2;
                if(scope.desde.isValid() && tf.isValid() ){
                    scope.btnBuscar.enable();
                }else{
                    scope.btnBuscar.disable();
                }
            }}
        });

        this.btnCertificar = new Ext.Toolbar.MenuButton({
            text: 'Certificación',
            hidden:true,
            id: 'btnCertificacion',
            iconCls: 'certificacion',
            menu: {items: [
                {text: '<span style="color:#2b9c26;"><b>' + idioma.btnCertificarDenom + '</b></span>', iconCls: 'certificacion', icon: '', id: 'btnCertificar'},
                {text: '<span style="color:#c6bf18;"><b>' + idioma.btnQuitarCertificacion + '</b></span>', iconCls: 'certificacion', icon: '', id: 'btnQuitarCertificacion'}
            ]}
        });

        this.btnAprobar = new Ext.Toolbar.MenuButton({
            text: 'Aprobar',
            hidden:true,
            id: 'btnAprobar',
            iconCls: 'aprobar',
            menu: {items: [
                    {text: '<span style="color:#2da2fd"><b>' + idioma.btnAprobarDenom + '</b></span>', iconCls: 'aprobar', icon: '', id: 'btnAprobar1'},
                    {text: '<span style="color:#c6070c;"><b>' + idioma.btnDesaprobarDenom + '</b></span>', iconCls: 'desaprobar', icon: '', id: 'btnDesaprobar'}
                ]}
        });

        this.btnEnviarCorreo = new Ext.Button({
            id: 'btnEnviarCorreo',
            text: 'Enviar Correo',
            tooltip: 'Enviar correo electrónico',
            icon    : '/pvd/regimentrabajo/views/js/asistencia/asistenciamensual/images/enviarcorreo.png',
            iconCls : 'btn',
            hidden:true
        });

        this.smPersonas = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners: {
            }
        });

        this.createNodoLeyenda = function (accion, text, big)
        {
            var contenedor = big ? " contenedorLeyendaProyectoMayor" : " contenedorLeyendaProyecto";
            var div = "<div class='animacionContenedor" + accion + contenedor + "'><div class='iconLeyenda " + accion + "Leyend rotateLeyend'></div><div class='textLeyenda " + accion + "LeyendColor'>" + text + "</div>";
            return div;
        }

        this.labelaprobado = new Ext.form.Label(
            {
                html:'<span style="color:#c6070c;"><b>' + 'PERÍODO NO APROBADO' + '</b></span>',
                hidden:true
            }
        );

        this.ListadoPersonas = new Ext.grid.GridPanel({
            id:'listadoPersonas',
            region:'center',
            store: modelo.stListadoPersonas,
            autoScroll:true,
            loadMask: {msg: idioma.lbMsgmasklistado},
            sm: this.smPersonas,
            stripeRows: true,
            view: new Ext.grid.GroupingView({
                showGroupName:false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            columns: [this.smPersonas,
                {header: 'idpersona', width:100,hidden:true,hideable:false, dataIndex: 'idpersona'},
                {header: 'Nombre y apellidos', width:250, dataIndex: 'nombreapellidos'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.stListadoPersonas,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: idioma.lbMsgemptyMsg
            }),
            tbar:['-','Análisis: ',this.tiporeporte,/*'-',this.certificacion,'',
                this.btnLimpiarCert,*///this.btnRestaurar,
                {
                    xtype: 'label',
                    html : '&nbsp;&nbsp;&nbsp;&nbsp;'
                },
                {
                    xtype: 'label',
                    html : this.createNodoLeyenda('NuevaAsignacion', 'No Certificado', true)
                },
                {
                    xtype: 'label',
                    html : this.createNodoLeyenda('Asignado', 'Certificado')
                }/*,
                {
                    xtype: 'label',
                    html : this.createNodoLeyenda('OtraAsignado','Aprobado')
                }*/,this.labelaprobado,
                '->',this.btnCertificar,this.btnAprobar,this.btnEnviarCorreo
            ]
        });

        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.btnBuscar,
            tooltip: idioma.ttbtnBuscar,
            iconCls: 'buscar'
        });

        this.btnLimpiar = new Ext.Button({
            id: 'limpiar',
            text: idioma.btnLimpiar,
            tooltip: idioma.ttbtnLimpiar,
            iconCls: 'limpiar'
        });

        this.btnGenerarHoja = new Ext.Button({
            text: 'Hoja de Firma',
            tooltip: idioma.ttbtnExportarHoja,
            disabled: false,
            iconCls: 'documentos'
        });

        this.btnFondoTiempo = new Ext.Toolbar.MenuButton({
            text: 'Fondo de tiempo',
            id: 'btnFondotiempo',
            iconCls: 'reportes',
            menu: {items: [
                    {text: 'Configuracion del Modelo 241- 488-02 Utilización del Fondo de Tiempo', iconCls: 'configuracion', icon: '', id: 'btnConfig'},
                    {text: 'Modelo 241- 488-02 Utilización del Fondo de Tiempo', iconCls: 'reportes', icon: '', id: 'btnReporte'}
                ]}
        });

        this.smgridConceptos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.listadoConceptos = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeConceptos,
            border: false,
            sm: this.smgridConceptos,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridConceptos,
                {
                    header: 'idconcepto',
                    width: 100,
                    dataIndex: 'idconcepto',
                    hidden: true
                }, {
                    header: 'Conceptos',
                    width: 250,
                    dataIndex: 'concepto'
                }
            ]
        });

        this.pConceptos = new Ext.Panel({
            id: 'pConceptos',
            width: '50%',
            layout: 'fit',
            region: 'west',
            collapsible: true,
            split: true,
            items: [this.listadoConceptos],
        });

        this.smgridCausas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.listadoCausas = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeCausas,
            border: false,
            region: 'center',
            sm: this.smgridCausas,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridCausas,
                {
                    header: 'idcausa',
                    width: 100,
                    dataIndex: 'idcausa',
                    hidden: true
                }, {
                    header: 'Causas',
                    width: 300,
                    dataIndex: 'denominacion'
                }, {
                    header: 'idconcepto',
                    width: 100,
                    dataIndex: 'idconcepto',
                    hidden: true
                }, {
                    header: 'check',
                    width: 100,
                    dataIndex: 'check',
                    hidden: true
                }
            ]
        });

        this.pCausas = new Ext.Panel({
            id: 'pCausas',
            layout: 'fit',
            region: 'center',
            collapsible: true,
            split: true,
            items: [this.listadoCausas],
        });

        this.btnAceptarFT = new Ext.Button({
            id: 'btnAceptarFT',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            //disabled: true,
            iconCls: 'aceptar'
        });

        this.btnAplicarFT = new Ext.Button({
            id: 'btnAplicarFT',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Ctrl + Alt + P</b>)',
            //disabled: true,
            iconCls: 'aplicar'
        });

        this.btnCancelarFT = new Ext.Button({
            id: 'idbtnCancelarFT',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)'
        });


        this.winFondoTiempo = new Ext.Window({
            title: 'Configuración',
            modal: true,
            height: 500,
            width: 650,
            closable: false,
            constrain: true,
            autoValidate: false,
            resizable: true,
            layout: 'border',
            items: [this.pConceptos,this.pCausas],
            buttons: [this.btnCancelarFT, this.btnAplicarFT, this.btnAceptarFT]
        });

        this.trimestre = new Ext.form.ComboBox({
            id:'trimestre',
            store: modelo.storeTrimestre,
            fieldLabel: 'Trimestre',
            displayField:'denominacion',
            valueField:'idtrimestre',
            typeAhead: true,
            mode: 'local',
            width:100,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            selectOnFocus:true,
            value:1,
        });

        this.comboYearFT = new Ext.form.ComboBox({
            id:'comboYearFT',
            store: modelo.storeYear,
            fieldLabel: 'Año',
            displayField:'denominacion',
            valueField:'idyear',
            typeAhead: true,
            mode: 'local',
            width:100,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            selectOnFocus:true,
            value:this.fecha.getFullYear()
        });

        this.formTrimestre = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            width : '100%',
            autoHeight:true,
            autoShow:true,
            items:[
                {
                    layout:'column',
                    items:[{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.trimestre]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.comboYearFT]
                    }]
                }]
        });

        this.btnAceptarTrim = new Ext.Button({
            id: 'btnAceptarTrim',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            //disabled: true,
            iconCls: 'aceptar'
        });

        this.btnCancelarTrim = new Ext.Button({
            id: 'idbtnCancelarTrim',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)'
        });

        this.winTrimestre = new Ext.Window({
            title: 'Configuración',
            modal: true,
            height: 150,
            width: 300,
            closable: false,
            constrain: true,
            autoValidate: false,
            resizable: true,
            layout: 'fit',
            items: [this.formTrimestre],
            buttons: [this.btnCancelarTrim, this.btnAceptarTrim]
        });

        this.btnAyuda = new Ext.Button({
            id:'btnAyudaAsistMensual',
            text: idioma.btnAyuda,
            iconCls:'ayuda',
            disabled: false,
            tooltip:idioma.lbBtnAyuda
        });

        this.smApa = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        this.ListadoApa = new Ext.grid.GridPanel({
            id:'listadoApa',
            store: modelo.stListadoApa,
            region:'center',
            autoScroll:true,
            loadMask: {msg: idioma.lbMsgmasklistado},
            sm: this.smApa,
            stripeRows: true,
            view: new Ext.grid.GroupingView({
                groupByText:'->',
                groupTextTpl: '{text}'
            }),
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idpersona', width:100,hidden:true,hideable:false, dataIndex: 'idpersona'},
                {header: 'Nombre y apellidos', width:250, dataIndex: 'nombreapellidos'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stListadoApa,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: idioma.lbMsgemptyMsg
            })

        });

        this.Listadoinfoestadistica = new Ext.grid.GridPanel({
            id:'listadoInfoestadistica',
            //title:' ',
            store: modelo.stinfoestadistica,
            region:'center',
            autoScroll:true,
            loadMask: {msg: idioma.lbMsgmasklistado},
            sm: this.smPersonas,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idestructura', width:150,hidden:true, dataIndex: 'idestructura'},
                {header: 'Entidad|Área', width:250, dataIndex: 'entidad'},
                {header: 'Fondo de tiempo', width:100, dataIndex: 'ft'},
                {header: 'Tiempo real trabajado', width:140, dataIndex: 'trt'},
                {header: 'Horas perdidas', width:100, dataIndex: 'hp'},
                {header: 'Horas extras', width:100, dataIndex: 'he'},
                {header: 'Horas feriadas', width:100, dataIndex: 'hf'},
                {header: 'Horas feriadas trabajadas', width:150, dataIndex: 'hft'}
            ]
        });


        this.panel=new Pvd.ControlAsistencia.Informacionestadistica.informacionestadistica();


        this.estrucAsistencia = new Ext.estructura.panel.PanelEstructura({
            id: 'estrucAsistencia',
            margins: '0 0 0 0',
            border: false,
            inicial: perfil.idestructuracomun, //codigo|id, Indica a partir de que estructura debe abrir el arbol
            cargos: false, //Para que no salgan los cargos
            checker: true,  //Muestra si va user checked o restringe los elementos que solo pueden tener checked
        });

        this.fechaBuscar = new Ext.form.DateField({
            id: 'fecha',
            name: 'fecha',
            labelSeparator: ':',
            format: 'd/m/Y',
            readOnly: true,
            width: 160,
            allowBlank: false,
            maxValue: this.fecha.format('d/m/Y'),
            value: this.fecha.format('d/m/Y'),
            blankText: idioma.lbCampoVacio
        });

        this.btnBuscarAsistencia = new Ext.Button({
            id: 'btnBuscarAsistencia',
            text: idioma.btnBuscar,
            tooltip: idioma.lbbtnBuscar,
            iconCls: 'buscar'
        });

        this.smlistadoAsistencia = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.listadoAsistencia = new Ext.grid.GridPanel({
            id: 'listadoAsistencia',
            store: modelo.stlistadoAsistencia,
            autoScroll: true,
            sm: this.smlistadoAsistencia,
            stripeRows: true,
            tbar:['Fecha: ',this.fechaBuscar, this.btnBuscarAsistencia],
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idpersona', width: 100, hidden: true, hideable: false, dataIndex: 'idpersona'},
                {header: 'Nombre y apellidos', width: 250, dataIndex: 'nombreapellidos'},
                {header: 'Área', width: 250, dataIndex: 'nombreapellidos'},
                {header: 'Hora de entrada', width: 250, dataIndex: 'nombreapellidos'},
                {header: 'Hora de salida', width: 250, dataIndex: 'nombreapellidos'},
                {header: 'Hora de entrada extra', width: 250, dataIndex: 'nombreapellidos'},
                {header: 'Hora de salida extra', width: 250, dataIndex: 'nombreapellidos'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stlistadoAsistencia,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: idioma.lbMsgemptyMsg
            })
        });

        function color(val, metaData, record, rowIndex, colIndex, store){
            return '<span style="-moz-border-radius: 50px; -webkit-border-radius: 50px; border-radius: 50px; cursor: pointer; float: left; width: 10px; height: 10px; background:'+record.json['color']+'; color:'+record.json['color']+'"></span>';
        }

        this.causas = new Ext.grid.GridPanel({
            id: 'gridCausas',
            store: modelo.stlistadoCausas,
            autoScroll: true,
            loadMask: {msg: idioma.lbMsgmasklistado},
            stripeRows: true,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idcausa', width: 100, hidden: true, hideable: false, dataIndex: 'idcausa'},
                {header: 'Causa', width: 200, hideable: false, dataIndex: 'denominacion'},
                {header: 'Abreviatura', width: 100, dataIndex: 'abreviatura'},
                {header: 'Color', width: 50, dataIndex: 'color',renderer:color}
            ]
        });

        this.Valores = new Ext.grid.GridPanel({
            id: 'gridValores',
            store: modelo.storeValores,
            autoScroll: true,
            loadMask: {msg: idioma.lbMsgmasklistado},
            stripeRows: true,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idvalor', width: 100, hidden: true, hideable: false, dataIndex: 'idvalor'},
                {header: 'Indicador', width: 250, hideable: false, dataIndex: 'denominacion'},
                {header: 'Abreviatura', width: 100, dataIndex: 'abreviatura'}
            ]
        });

        this.tabsLeyenda = new Ext.TabPanel({
            region:'center',
            activeTab: 0,
            border: false,
            defaults: {
                xtype:'panel',
                layout: 'border'
            },
            items: [
                {
                    title:'Listado de causas',
                    id: 'causa',
                    layout:'fit',
                    items:[this.causas]
                },
                {
                    title:'Listado de indicadores',
                    id: 'indicadores',
                    layout:'fit',
                    items:[this.Valores]
                }
            ]
        });

        this.panelLeyenda = new Ext.Panel({
            region  : 'center',
            border  : false,
            disabled: false,
            layout  : 'border',
            items   : [this.tabsLeyenda]
        });

        this.tabs = new Ext.TabPanel({
            region:'center',
            activeTab: 0,
            border: false,
            defaults: {
                xtype:'panel',
                layout: 'border'
            },
            items: [
                {
                    title:idioma.ttTabControlAsist,
                    id: 'controlasistencia',
                    items:[this.ListadoPersonas]
                },
                {
                    title:idioma.ttTabResumenCausa,
                    id: 'apa',
                    layout:'fit',
                },
                {
                    title:'Histórico',
                    id: 'historico',
                    layout:'fit'
                }
            ]
        });

        this.trt = new Ext.form.Checkbox({
            name: 'trt',
            id: 'trt',
            anchor: '100%',
            boxLabel: 'Tiempo real trabajado',
            hideLabel: true
        });

        this.ft = new Ext.form.Checkbox({
            name: 'ft',
            id: 'ft',
            anchor: '100%',
            boxLabel: 'Fondo de tiempo',
            hideLabel: true
        });

        this.hp = new Ext.form.Checkbox({
            name: 'hp',
            id: 'hp',
            anchor: '100%',
            boxLabel: 'Horas perdidas',
            hideLabel: true
        });

        this.he = new Ext.form.Checkbox({
            name: 'he',
            id: 'he',
            anchor: '100%',
            boxLabel: 'Horas extras',
            hideLabel: true
        });

        this.hf = new Ext.form.Checkbox({
            name: 'hf',
            id: 'hf',
            anchor: '100%',
            boxLabel: 'Horas feriadas',
            hideLabel: true
        });

        this.hft = new Ext.form.Checkbox({
            name: 'hft',
            id: 'hft',
            anchor: '100%',
            boxLabel: 'Horas feriadas trabajadas',
            hideLabel: true
        });

        this.formulario = new Ext.FormPanel({
            labelAlign: 'left',
            frame:true,
            width : '100%',
            autoHeight:true,
            autoShow:true,
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                labelAlign: 'left',
                items: [this.ft]
            },{
                columnWidth:.5,
                layout: 'form',
                labelAlign: 'left',
                items: [this.trt]
            },{
                columnWidth:.5,
                layout: 'form',
                labelAlign: 'left',
                items: [this.hp]
            },{
                columnWidth:.5,
                layout: 'form',
                labelAlign: 'left',
                items: [this.he]
            },{
                columnWidth:.5,
                layout: 'form',
                labelAlign: 'left',
                items: [this.hf]
            },{
                columnWidth:.5,
                layout: 'form',
                labelAlign: 'left',
                items: [this.hft]
            }]

        });

        this.btnCancelar = new Ext.Button({
            id:'btnCancelar',
            iconCls:'cancelar',
            text:'Cancelar'
        });

        this.btnAceptar = new Ext.Button({
            id:'btnAceptar',
            iconCls:'aceptar',
            text:'Aceptar',
        });

        this.ventanaExcel = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            layout: 'fit',
            title: 'Exportar Excel',
            width: 550,
            height: 160,
            items: [this.formulario],
            buttons: [
                this.btnCancelar,
                this.btnAceptar
            ]
        });

        // this.a3 = new Ext.form.Checkbox({
        //     name: 'a3',
        //     id: 'a3',
        //     anchor: '100%',
        //     boxLabel: 'Hoja A3',
        //     hideLabel: true,
        // });
        //
        // this.a4 = new Ext.form.Checkbox({
        //     name: 'a4',
        //     id: 'a4',
        //     anchor: '100%',
        //     boxLabel: 'Hoja A4',
        //     hideLabel: true,
		// 	checked:true,
        // });

        this.cbFormatohoja = new Ext.form.ComboBox({
            fieldLabel: 'Formato:',
            labelSeparator: '',
            editable: true,
            store: modelo.stformato,
            valueField: 'idformato',
            displayField: 'formato',
            hiddenName: 'idformato',
            mode: 'local',
            triggerAction: 'all',
            value:2,
            readOnly: true,
            allowBlank: true,
            anchor: '90%',
            emptyText: 'Seleccione...',
            blankText:'Este campo es obligatorio',
        });

        // this.formulariohojas = new Ext.FormPanel({
        //     labelAlign: 'left',
        //     frame:true,
        //     width : '100%',
        //     autoHeight:true,
        //     autoShow:true,
        //     layout:'column',
        //     // items:[//cbFormatohoja
		// 	// {
        //     //     columnWidth:.5,
        //     //     layout: 'form',
        //     //     labelAlign: 'left',
        //     //     items: [this.a4]
        //     // },{
        //     //     columnWidth:.5,
        //     //     layout: 'form',
        //     //     labelAlign: 'left',
        //     //     items: [this.a3]
        //     // }]
        // });

        this.btnCancelarhojas = new Ext.Button({
            id:'btnCancelar',
            iconCls:'cancelar',
            text:'Cancelar'
        });

        this.btnAceptarhojas = new Ext.Button({
            id:'btnAceptar',
            iconCls:'aceptar',
            text:'Aceptar',
        });

        this.ventanaHojas = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            layout: 'fit',
            title: 'Seleccionar tipo de hoja',
            width: 350,
            height: 130,
            items: [{
                xtype: 'fieldset',
                id: 'tipohoja',
                name: 'tipohoja',
                title: 'Tipo de hoja',
                autoHeight: true,
                defaultType: 'radio',
                items: [/*this.formulariohojas*/this.cbFormatohoja]
            }],
            buttons: [
                this.btnCancelarhojas,
                this.btnAceptarhojas
            ]
        });

        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            iconCls: 'exportar',
            menu: {items: [
                {text: 'Resumen de la Asistencia <span style="color:#d1200a;">' + '(*.pdf)', iconCls: 'informe', icon: '', id: 'exportarpdf', handler: onItemClick},
                {text: 'Resumen de la Asistencia <span style="color:#2b9c26;">' + '(*.xls)', iconCls: 'informe', icon: '', id: 'exportarexcel', handler: onItemClick},'-',
                {text: 'Modelo SC-4-05 - Prenómina <span style="color:#d1200a;">' + '(*.pdf)', iconCls: 'informe', icon: '', id: 'exportarapapdf', handler: onItemClick},
                {text: 'Modelo SC-4-05 - Prenómina <span style="color:#2b9c26;">' + '(*.xls)', iconCls: 'informe', icon: '', id: 'exportarapaexcel', handler: onItemClick},
                {text: 'Modelo SC-4-05 - Prenómina <span style="color:#2da2fd">' + '(*.json)', iconCls: 'informe', icon: '', id: 'exportarapajson', handler: onItemClick}
            ]}
        });

        function onItemClick(items){
            if(items.id == 'exportarpdf'){
                    var idpersonas = new Array();
                    var seleccionados = scope.ListadoPersonas.getSelectionModel().getSelections();
                    if(seleccionados.length > 0){
                        Ext.each(seleccionados, function (rec) {
                            idpersonas.push(rec.data.idpersona);
                        });
                    }
                    var params = Ext.urlEncode({
                        idpersonas:Ext.encode(idpersonas),
                        idestructura: scope.estructura.tree.getSelectionModel().getSelectedNode().id,
                        mes: scope.comboMeses.getValue(),
                        year: scope.comboYear.getValue(),
                        filtro: scope.filtro.getValue(),
                        denomestructura:scope.estructura.tree.getSelectionModel().getSelectedNode().text,
                        fecha: scope.fechaBuscar.getRawValue(),
                        quincena:scope.tiporango.value,
                        tiporeporte:scope.tiporeporte.value,
                        analisis:scope.tipoanalisis.value,
                        fdesde:scope.desde.getRawValue(),
                        fhasta:scope.hasta.getRawValue()
                    });
                    var idIframe = Ext.id();
                    new Ext.Window({
                        title: 'Reporte de asistencia del mes',
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
                                '/pvd/regimentrabajo/index.php/asistenciamensual/generarPdfReporte?'+params
                            }
                        }
                    }).show();
                    Ext.getCmp('winregistro').maximize();
                    PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
                    document.getElementById(idIframe).onload = function () {
                        PVD.ocultarMascara('rep01');
                    }
            }else if(items.id == 'exportarexcel'){
                var winload = new Ext.PVD.comun.window.winLoad({
                        title: 'Por favor espere...',
                        mensaje: 'Generando reporte'
                    });
                    winload.showMask();
                    var fecha = scope.fechaBuscar.getRawValue();
                    var idpersonas = new Array();
                    var seleccionados = scope.ListadoPersonas.getSelectionModel().getSelections();
                    if(seleccionados.length > 0){
                        Ext.each(seleccionados, function (rec) {
                            idpersonas.push(rec.data.idpersona);
                        });
                    }
                    var params = Ext.urlEncode({
                        idpersonas:Ext.encode(idpersonas),
                        idestructura: scope.estructura.tree.getSelectionModel().getSelectedNode().id,
                        mes: scope.comboMeses.getValue(),
                        year: scope.comboYear.getValue(),
                        filtro: scope.filtro.getValue(),
                        denomestructura:scope.estructura.tree.getSelectionModel().getSelectedNode().text,
                        fecha: fecha,
                        quincena:scope.tiporango.value,
                        tiporeporte:scope.tiporeporte.value,
                        analisis:scope.tipoanalisis.value,
                        fdesde:scope.desde.getRawValue(),
                        fhasta:scope.hasta.getRawValue()
                    });
                    var iframe = document.createElement("iframe");
                    iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/regimentrabajo/index.php/asistenciamensual/exportarExcel?'+params;
                    iframe.style.display = 'none';
                    iframe.onload = function () {
                        winload.hideMask();
                    }
                    document.body.appendChild(iframe);
            }else if(items.id == 'exportarapapdf'){
                scope.ventanaHojas.show();
            }else if(items.id == 'exportarapaexcel'){
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Generando reporte'
                });

                winload.showMask();
                var fecha = scope.fechaBuscar.getRawValue();
                var idpersonas = new Array();
                var seleccionados = scope.ListadoPersonas.getSelectionModel().getSelections();
                if(seleccionados.length > 0){
                    Ext.each(seleccionados, function (rec) {
                        idpersonas.push(rec.data.idpersona);
                    });
                }
                var params = Ext.urlEncode({
                    idpersonas:Ext.encode(idpersonas),
                    idestructura: scope.estructura.tree.getSelectionModel().getSelectedNode().id,
                    mes: scope.comboMeses.getValue(),
                    year: scope.comboYear.getValue(),
                    filtro: scope.filtro.getValue(),
                    denomestructura:scope.estructura.tree.getSelectionModel().getSelectedNode().text,
                    fecha: fecha,
                    quincena:scope.tiporango.value,
                    tiporeporte:scope.tiporeporte.value,
                    analisis:scope.tipoanalisis.value,
                    fdesde:scope.desde.getRawValue(),
                    fhasta:scope.hasta.getRawValue()
                });
                var iframe = document.createElement("iframe");
                iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/regimentrabajo/index.php/asistenciamensual/exportarExcelAPA?'+params;
                iframe.style.display = 'none';
                iframe.onload = function () {
                    winload.hideMask();
                }
                document.body.appendChild(iframe);
            }else if(items.id == 'exportarapajson'){
                var idpersonas = new Array();
                    var seleccionados = scope.ListadoPersonas.getSelectionModel().getSelections();
                    if(seleccionados.length > 0){
                        Ext.each(seleccionados, function (rec) {
                            idpersonas.push(rec.data.idpersona);
                        });
                    }
                    var fecha = scope.fechaBuscar.getRawValue();
                    var params = Ext.urlEncode({
                        idpersonas:Ext.encode(idpersonas),
                        idestructura: scope.estructura.tree.getSelectionModel().getSelectedNode().id,
                        mes: scope.comboMeses.getValue(),
                        year: scope.comboYear.getValue(),
                        filtro: scope.filtro.getValue(),
                        denomestructura:scope.estructura.tree.getSelectionModel().getSelectedNode().text,
                        fecha: fecha,
                        quincena:scope.tiporango.value,
                        analisis:scope.tipoanalisis.value,
                        fdesde:scope.desde.getRawValue(),
                        fhasta:scope.hasta.getRawValue(),
                        causas:1
                    });
                    var idIframe = Ext.id();
                    new Ext.Window({
                        title: 'Reporte por causas de la asistencia del mes',
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
                                '/pvd/regimentrabajo/index.php/asistenciamensual/generarJsonReporteAPA?'+params
                            }
                        }
                    }).show();
                    Ext.getCmp('winregistro').maximize();
                    //PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
                    var winload = new Ext.PVD.comun.window.winLoad({
                        title: 'Por favor espere...',
                        mensaje: 'Generando reporte'
                    });

                    winload.showMask();
                    document.getElementById(idIframe).onload = function () {
                       // PVD.ocultarMascara('rep01');
                        winload.hideMask();
                    }
            }
        }
        
        this.lbtexto = new Ext.form.Label(
            {               
                text: ' Rango: ',
            }
        );

        this.lbmes = new Ext.form.Label(
            {
                text: ' Mes: ',
            }
        );

        this.lbanno = new Ext.form.Label(
            {
                text: ' Año: ',
            }
        );

        this.lbfdesde = new Ext.form.Label(
            {
                text: ' Fecha inicio: ',
            }
        );

        this.lbfhasta = new Ext.form.Label(
            {
                text: ' Fecha fin: ',
            }
        );

        this.panelCenter = new Ext.Panel({
            region  : 'center',
            border  : false,
            disabled: false,
            layout  : 'border',
            items   : [this.tabs],
            tbar:['Analisis: ',this.tipoanalisis,'-',this.lbfdesde,this.desde,'-',this.lbfhasta,this.hasta,this.lbanno,this.comboYear,'-',this.lbmes,this.comboMeses,'-',this.lbtexto,this.tiporango,'  ',this.filtro,'-',this.btnBuscar,this.btnLimpiar,'-', this.btnExportar,this.btnGenerarHoja,'-',this.btnFondoTiempo ,'->', this.btnAyuda]
        });

// Para el APA
        this.vp = new Ext.Viewport({
            layout:'border',
            items: [{
                region:'west',
                width:'25%',
                margins:'0 0 0 0',
                collapsible: true,
                collapseMode:'mini',
                split:true,
                border:false,
                layout:'border',
                items:[
                    {
                        title:'Estructura',
                        region:'center',//'north',
                        layout:'fit',
                        height:350,
                        items:[this.estructura]
                    }/*,
                    {
                        title:'Leyenda',
                        region:'center',
                        layout:'fit',
                        items:[this.panelLeyenda]
                    }*/
                ]
            },
                        this.panelCenter
                ]
        });
    }
};
//Inicializando la vista.
UCID.portal.cargarEtiquetas('asistenciamensual', function(perfil, idioma){

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.Asistenciamensual.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.Asistenciamensual.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.Asistenciamensual.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.frameElement.id);

});