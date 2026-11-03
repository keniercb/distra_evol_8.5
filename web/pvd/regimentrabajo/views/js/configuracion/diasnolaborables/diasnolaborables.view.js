Ext.QuickTips.init();
Ext.ns('Ext.Zeolides.Diasnolaborables');

Ext.Zeolides.Diasnolaborables.Vista = {

    init: function (idioma, modelo) {

        this.fecha = new Date().format("d/m/Y");
        this.MaskEnviarDatos = new Ext.LoadMask(Ext.getBody(), {msg:idioma.MaskEnviarDatos});
        this.MaskEliminarDatos = new Ext.LoadMask(Ext.getBody(), {msg:idioma.MaskEliminarDatos});
        this.MsgCargandoGrid = new Ext.LoadMask(Ext.getBody(), {msg:idioma.MsgCargandoGrid});
        var scope=this;
        var fech = new Date();
        this.annoactual = fech.getFullYear();
        this.anno = this.annoactual+2;

        /*** BOTONES GENERALES DE LA INTERFAZ PRINCIPAL ***/
            //Botón para la ayuda
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaDiasNoLab',
            text: idioma.lBtnAyuda,
            tooltip: idioma.textToolTipAyuda,
            iconCls: 'ayuda'
        });
        //Botón para generar el documento con las configuraciones de los RTD
        this.btnExportar = new Ext.Button({
            id      : 'btnExportar',
            text    : idioma.btnExportarText,
            tooltip : idioma.btnExportarToolTip,
            iconCls : 'documentos'
        });
        //Botón para establecer los limites másximos para las horas extras
        this.btnLimitar = new Ext.Button({
            id      : 'btnLimitar',
            text    : idioma.btnLimitarText,
            tooltip : idioma.btnLimitarToolTip,
            disabled:true,
            iconCls : 'rango'
        });

        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar1',
            text: idioma.BtnLimpiar,
            tooltip: idioma.lbBtnLimpiar,
            iconCls:'limpiar',
            disabled:true
        });

        this.btnRangoFechas = new Ext.Toolbar.MenuButton({
            text: 'Rangos de fechas',
            tooltip: idioma.ttbtnConfig,
            iconCls: 'exportar',
            menu: {items: [
                {text: 'Mensual', iconCls: 'btn', icon: '', id: 'rangomensual', handler: onItemClick/*,tooltip: idioma.lbbtnExportarNom*/},
                {text: 'Quincenal', iconCls: 'btn', icon: '', id: 'rangoquincenal', handler: onItemClick/*,tooltip: idioma.lbbtnExportarEst*/}
            ]}
        });

        this.btnPlanificacion = new Ext.Toolbar.MenuButton({
            text: 'PLanificar',
            tooltip: idioma.ttbtnPlanif,
            iconCls: 'planificar',
            menu: {items: [
                {text: 'Turnos fijos', iconCls: 'btn', icon: '',disabled: true, id: 'turnosfijos'/*, handler: onItemClick*/,tooltip: idioma.ttPLanificarTFijos},
                {text: 'Turnos rotativos', iconCls: 'btn', icon: '', id: 'turnosrotativos'/*, handler: onItemClick*/,tooltip: idioma.ttPLanificarTRotativos}
            ]}
        });

        this.desdeplanif = new Ext.form.DateField({
            id: 'desdeplanif',
            fieldLabel:'Fecha inicio',
            name: 'fdesde',
            format: 'd/m/Y',
            readOnly: false,
            anchor: '90%',
            allowBlank: true,
            allowBlank:false,
            blankText:idioma.lbCampoVacio
        });

        this.hastaplanif = new Ext.form.DateField({
            id: 'hasta',
            fieldLabel:'Fecha fin',
            name: 'fhasta',
            format: 'd/m/Y',
            readOnly: false,
            anchor: '90%',
            allowBlank: true,
            startDateField: 'desdeplanif',
            maxValue: new Date(this.anno, 12, 31),
            allowBlank:false,
            blankText:idioma.lbCampoVacio
        });

        this.cbturnoPlanif = new Ext.form.ComboBox({
            store: modelo.storeTurnoTrabajo,
            fieldLabel: 'Turno de trabajo',
            displayField:'denominacion',
            typeAhead: true,
            mode: 'local',
            enableKeyEvents:true,
            emptyText: 'Seleccione...',
            anchor: '90%',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            valueField:'idturnotrabajo',
            name:'idturnotrabajo',
            hiddenname:'idturnotrabajo'
        });

        this.tipodiaPlanif = new Ext.form.ComboBox({
            id:'tipodiaPlanif',
            labelSeparator:':',
            editable:false,
            name :'idtipodedia',
            fieldLabel:idioma.lbTipoDia,
            valueField:'idtipodedia',
            displayField:'denominacion',
            hiddenName:'idtipodedia',
            mode: 'local',
            triggerAction: 'all',
            forceSelection:true,
            typeAhead: true,
            selectOnFocus:true,
            allowBlank:false,
            blankText:idioma.lbCampoVacio,
            emptyText:'Seleccione...',
            anchor:'90%',
            store:modelo.storeTipodia
        });

        this.formularioPlanif = new Ext.FormPanel({
            labelAlign: 'left',
            frame:true,
            width : '100%',
            autoHeight:true,
            autoShow:true,
            items:[
                {
                    layout:'column',
                    items:[
                        {
                            columnWidth:.5,
                            layout: 'form',
                            labelAlign:'top',
                            items: [this.desdeplanif]
                        },
                        {
                            columnWidth:.5,
                            layout: 'form',
                            labelAlign:'top',
                            items: [this.hastaplanif]
                        }]
                },
                {
                    xtype: 'checkboxgroup',
                    fieldLabel: 'Días de la semana',
                    itemCls: 'x-check-group-alt',
                    allowBlank:false,
                    blankText:idioma.lbCampoVacio,
                    columns: 2,
                    items: [
                        {boxLabel: 'Lunes', name: 'lunes', id: 1},
                        {boxLabel: 'Viernes', name: 'viernes',id: 5},
                        {boxLabel: 'Martes', name: 'martes',id: 2},
                        {boxLabel: 'Sábado', name: 'sabado',id: 6},
                        {boxLabel: 'Miercoles', name: 'miercoles',id: 3},
                        {boxLabel: 'Domingo', name: 'domingo',id: 7},
                        {boxLabel: 'Jueves', name: 'jueves',id: 4}
                    ]
                },
                {
                    layout:'column',
                    items:[{
                        columnWidth:.5,
                        layout: 'form',
                        labelAlign:'top',
                        items: [this.tipodiaPlanif]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        labelAlign:'top',
                        items: [this.cbturnoPlanif]
                    }]
                }

            ]
        });

        this.btnCancelar = new Ext.Button({
            id:'btnCancelar',
            iconCls:'cancelar',
            tooltip:idioma.lbBtnCanc,
            prevTab: 'descripcion',
            nextTab: 'btnAplicar',
            text:idioma.lbtnCancelar
        });

        this.btnAplicar = new Ext.Button({
            id:'btnAplicar',
            iconCls:'aplicar',
            prevTab: 'btnCancelar',
            nextTab: 'btn Aceptar',
            text:idioma.lbtnAplicar,
            tooltip:idioma.lbBtnAplic
        });

        this.btnAceptar = new Ext.Button({
            id:'btnAceptar',
            iconCls:'aceptar',
            prevTab: 'btnAplicar',
            nextTab: 'denominacion',
            text:idioma.lbtnAceptar,
            tooltip:idioma.lbBtnAcep
        });

        this.winPlanif = new Ext.Window({
            title       : 'Planificar calendario',
            closeAction : 'hide',
            resizable   : false,
            width       : 480,
            height      : 280,
            layout      : 'fit',
            modal       : true,
            buttons     : [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            items       : [this.formularioPlanif]
        });

        /*ventana para planificar turnos rotativos*/

        this.cbRegimenTrabajo = new Ext.form.ComboBox({
            id:'cbRegimenTrabajo',
            labelSeparator:':',
            editable:false,
            name :'idregimentrabajo',
            fieldLabel:idioma.lbCbRegimentrabajo,
            valueField:'idregimentrabajo',
            displayField:'denominacion',
            hiddenName:'idregimentrabajo',
            mode: 'local',
            triggerAction: 'all',
            forceSelection:true,
            typeAhead: true,
            selectOnFocus:true,
            allowBlank:false,
            blankText:idioma.lbCampoVacio,
            emptyText:'Seleccione...',
            anchor:'98%',
            store:modelo.storeCbRegimentrabajo
        });

        this.desdeTT = new Ext.form.DateField({
            id: 'desdeTT',
            fieldLabel:'Fecha inicio',
            name: 'fdesde',
            format: 'd/m/Y',
            anchor: '98%',
            allowBlank: false,
        });

        this.hastaTT = new Ext.form.DateField({
            id: 'hastaTT',
            fieldLabel:'Fecha fin',
            name: 'fhasta',
            format: 'd/m/Y',
            anchor: '98%',
            allowBlank: false
        });

        this.formularioWinTT = new Ext.FormPanel({
            id:'formularioWinTT',
            labelAlign: 'top',
            frame:true,
            width : '100%',
            height:62,
            items:[
                {
                    layout:'column',
                    items:[{
                        columnWidth:.4,
                        layout: 'form',
                        items:[this.cbRegimenTrabajo]
                    },{
                        columnWidth:.3,
                        layout: 'form',
                        items: [this.desdeTT]
                    },{
                        columnWidth:.3,
                        layout: 'form',
                        items: [this.hastaTT]
                    }
                    ]
                }

            ]
        });

        this.btnSubirGrupo = new Ext.Button({
            id:'btnSubirGrupo',
            iconCls:'subir',
            disabled: true,
            tooltip:idioma.lbBtnSubirtt,
            text:idioma.lbtnSubir
        });

        this.btnBajarGrupo = new Ext.Button({
            id:'btnBajarGrupo',
            iconCls:'bajar',
            disabled: true,
            text:idioma.lbtnBajar,
            tooltip:idioma.lbBtnBajartt
        });

        this.rotar = new Ext.form.Checkbox({
            name : 'rotar',
            id : 'rotar',
            anchor:'100%',
            hideLabel:true
        });

        this.smgridGrupos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gridGrupos = new Ext.grid.GridPanel({
            title:idioma.gpGruposTitle,
            id:'gridGrupos',
            store: modelo.storeGrupos,
            columns: [
                // new Ext.grid.RowNumberer(),
                { header: "idgrupodescanso", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idgrupodescanso'},
                { header: "Denominaci&oacute;n", width: 100, menuDisabled:true, dataIndex: 'denominacion'},
                { header: "orden", width: 150, menuDisabled:true, hidden:true, hideable: false, dataIndex: 'orden'}
            ],
            height: 300,
            width: 300,
            viewConfig:{
                forceFit: true,
            },
            loadMask:{msg :idioma.MsgCargandoGrid},
            sm: this.smgridGrupos,
            tbar:[this.btnSubirGrupo, this.btnBajarGrupo, '->', 'Rotar turnos:', this.rotar]
        });

        this.smgridTurnos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gridTurnos = new Ext.grid.GridPanel({
            title:idioma.gpTurnosTitle,
            id:'gridTurnos',
            store: modelo.storeTurnos,
            sm: this.smgridTurnos,
            columns: [
                new Ext.grid.RowNumberer(),
                { header: "idturnotrabajo", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idturnotrabajo'},
                { header: "Denominaci&oacute;n", width: 150, menuDisabled:true, dataIndex: 'denominacion'},
                { header: "Hora de inicio", width: 150, menuDisabled:true, dataIndex: 'horainicio'},
                { header: "Hora de fin", width: 150, menuDisabled:true, dataIndex: 'horafin'},
                this.smgridTurnos
            ],
            height: 300,
            width: 300,
            viewConfig:{
                forceFit: true,
            },
            loadMask:{msg :idioma.MsgCargandoGrid}
        });

        this.btnCancelartt = new Ext.Button({
            id:'btnCancelartt',
            iconCls:'cancelar',
            tooltip:idioma.lbBtnCanc,
            // prevTab: 'descripcion',
            nextTab: 'btnAplicartt',
            text:idioma.lbtnCancelar
        });

        this.btnAplicartt = new Ext.Button({
            id:'btnAplicartt',
            iconCls:'aplicar',
            prevTab: 'btnCancelartt',
            nextTab: 'btn Aceptartt',
            text:idioma.lbtnAplicar,
            tooltip:idioma.lbBtnAplic
        });

        this.btnAceptartt = new Ext.Button({
            id:'btnAceptartt',
            iconCls:'aceptar',
            prevTab: 'btnAplicartt',
            // nextTab: 'denominacion',
            text:idioma.lbtnAceptar,
            tooltip:idioma.lbBtnAcep
        });

        this.winPlaniftt = new Ext.Window({
            title       : 'Planificar calendario para turnos rotativos',
            closeAction : 'hide',
            resizable   : false,
            width       : 600,
            height      : 400,
            layout      : 'border',
            modal       : true,
            buttons     : [this.btnCancelartt, this.btnAplicartt, this.btnAceptartt],
            items       : [
                {
                    region:'north',
                    layout: 'fit',
                    height: 60,
                    items: [
                        this.formularioWinTT
                    ]
                },
                {
                    region:'center',
                    layout: 'border',
                    items: [
                        {
                            region:'west',
                            width: '50%',
                            items: [
                                this.gridGrupos
                            ]
                        },
                        {
                            region:'center',
                            items: [
                                this.gridTurnos
                            ]
                        }

                    ]
                }
            ]
        });
        /*ventana para planificar turnos rotativos*/

        function onItemClick(items){

            if(items.text == 'Mensual'){
                scope.winRangoFechas.show();
                modelo.storeRangoFechas.load({params:{anno:scope.annoactual}});
            }else if(items.text == 'Quincenal'){
                scope.winRangoFechasQuincenal.show();
                modelo.storeRangoFechasQuincenal.load({params:{anno:scope.annoactual}});
            }
        }

        function ActivarColores(val, metaData, record, rowIndex, colIndex, store) {
            if(record.get('predeterminado') == 1){
                return '<span style="color:#33aa33;"><b>' + val + '</b></span>';
            }else
            {
                return val;
            }

        }
        
        /*** GRID LISTADO DE REGIMEN Y GRUPOS DE TRABAJO Y DESCANSO ***/
        //selectionmodel del grid principal
        this.smgridGruposRegimen = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        //grid de grupos por regimen de trabajo
        this.gridGruposRegimen = new Ext.grid.GridPanel({
            region:'center',
            //title:idioma.gpTitle,
            id:'gridGruposRegimen',
            store: modelo.storeGruposRegimen,
            columns: [
                new Ext.grid.RowNumberer(),
                { header: "idgrupodescanso", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idgrupodescanso'},
                { header: "idregimentrabajo", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idregimentrabajo'},
                { header: "Denominaci&oacute;n", width: 80, menuDisabled:true, dataIndex: 'denominacion',renderer:ActivarColores},
                { header: "R&eacute;gimen de trabajo: ",  hidden:true, width: 300, menuDisabled:true, dataIndex: 'denregimentrabajo'},
                {header: 'Predeterminado', width: 30, dataIndex: 'predeterminado',renderer: function (val) {
                        if (val == 1)return '</center></span><span style=" color:' + '#33aa33' + '"><b>&#10004;</b></span>'; else return '';
                    }},
            ],
            height: 300,
            width: 300,
            view: new Ext.grid.GroupingView({
                forceFit:true,
                groupTextTpl: '{group}'
            }),
            loadMask:{msg :idioma.MsgCargandoGrid},
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: modelo.storeGruposRegimen,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: idioma.lbMsgemptyMsg
            }),
            sm: this.smgridGruposRegimen
        });

        this.cbRegimenTrabajoPers = new Ext.form.ComboBox({
            id:'cbRegimenTrabajoPers',
            editable:false,
            name :'idregimentrabajo',
            valueField:'idregimentrabajo',
            displayField:'denominacion',
            hiddenName:'idregimentrabajo',
            mode: 'local',
            triggerAction: 'all',
            forceSelection:true,
            typeAhead: true,
            selectOnFocus:true,
            allowBlank:false,
            blankText:idioma.lbCampoVacio,
            emptyText:'Seleccione...',
            anchor:'98%',
            store:modelo.storeCbRegimentrabajoPer
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            emptyText: idioma.lbEmptyTextBuscar,
            minLength: 3,
            maxLength: 60,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 140,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscarpers = new Ext.Button({
            id: 'btnBuscarpers',
            tooltip: idioma.lbbtnBuscar,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiarpers = new Ext.Button({
            id: 'btnLimpiarpers',
            tooltip: idioma.lbbtnLimpiar,
            iconCls: 'limpiar'
        });

        this.smPersona = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        //grid de personas por grupo
        this.gridPersonas = new Ext.grid.GridPanel({
            region:'center',
            id:'gridPersonas',
            store: modelo.fuenteDatosListado,
            sm: this.smPersona,
            tbar:['Régimen de trabajo: ',this.cbRegimenTrabajoPers,'-','Nombre y apellidos: ',this.tfbuscar,this.btnBuscarpers,this.btnLimpiarpers],
            columns: [
                new Ext.grid.RowNumberer(),
                { header: "idpersona", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idpersona'},
                { header: "idgrupodescanso", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idgrupodescanso'},
                { header: "idregimentrabajo", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idregimentrabajo'},
                { header: "grupodescanso", hidden:true,width: 150, menuDisabled:true, dataIndex: 'grupodescanso'},
                { header: "Nombre y Apellidos", width: 150, menuDisabled:true, dataIndex: 'nombreapellidos'},
                {header: "Cargo", width: 90, menuDisabled: true, dataIndex: 'denomcargo'},
                {header: "Área", width: 90, menuDisabled: true, dataIndex: 'denomarea'}
            ],
            height: 300,
            width: 300,
            view: new Ext.grid.GroupingView({
                forceFit:true,
                groupTextTpl: '{group}'
            }),
            loadMask:{msg :idioma.MsgCargandoGrid}
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
                    title:'Listado de grupos de trabajo',
                    id: 'gridGruposRegimen1',
                    layout:'fit',
                    items:[this.gridGruposRegimen]
                },
                {
                    title:'Listado de personas',
                    id: 'gridPersonas1',
                    layout:'fit',
                    items:[this.gridPersonas]
                }
            ]
        });

        /*** PANEL INFORMATIVO ***/       
            //Campo para el promedio mensual
        this.lInfo = new Ext.form.Label({
            id:'lInfo'
        });
        //Grid para mostrar el resumen por meses
        this.gpResumen = new Ext.grid.GridPanel({
            id       : 'gpResumen',
            title    : idioma.gpResumenTitle,
            store    : modelo.storeResumenRTD,
            loadMask : {msg :idioma.MsgCargandoGrid},
            tbar     : ['-', this.lInfo, '-'],
            columns  : [
                {header : "Mes",           dataIndex : 'mes',      width: 150},
                {header : "Total (horas)", dataIndex : 'cantidad', width: 80}
            ]
        });

        var columns = new Array();
        var continentGroupRow = new Array();

        columns.push(new Ext.grid.RowNumberer());
        columns.push({
            header: 'Mes', width: 100, dataIndex: 'mes'
        });

        continentGroupRow.push({header: ' ', align: 'center', colspan: 2});
        continentGroupRow.push({header: 'Total Quincena (Horas)', align: 'center', colspan: 2});
        continentGroupRow.push({header: ' ', align: 'center', colspan: 1});

        columns.push({header: '1ra quincena', width: 100, dataIndex: 'primquincena'});
        columns.push({header: '2da quincena', width: 100, dataIndex: 'segquincena'});
        columns.push({
            header: 'Total (Horas)', width: 100, dataIndex: 'cantidad'
        });

        this.group = new Ext.ux.grid.ColumnHeaderGroup({
            rows: [continentGroupRow]
        });

        this.cmQuincenal = new Ext.grid.ColumnModel(columns);

        //Campo para el promedio mensual
        this.lInfoQuin = new Ext.form.Label({
            id:'lInfoQuin'
        });

        this.gpResumenQuincenal = new Ext.grid.GridPanel({
            id       : 'gpResumenQuincenal',
            title    : idioma.gpResumenTitle,
            store    : modelo.storeResumenQuincenal,
            loadMask : {msg :idioma.MsgCargandoGrid},
            tbar     : ['-', this.lInfoQuin, '-'],
            cm:this.cmQuincenal,
            plugins:[scope.group]
        });

        this.panelInformativo = new Ext.Panel({
            id: 'panelInformativo',
            region: 'center',
            layout     : 'card',
            activeItem: 0,
            items: [this.gpResumen,this.gpResumenQuincenal],
            height:250,
        });

        /*** PANEL INFORMATIVO ***/
        
        /******CONFIGURAR RANGOS DE FECHAS******/
        function formatDate(value,metaData, record, rowIndex, colIndex, store) {
            //console.info(record);
            if(value){
                return (value instanceof Date) ? value.format('d/m/Y') : value;
            }
        };

        this.desde = new Ext.form.DateField({
            id: 'desde',
            name: 'fdesde',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
        });

        this.hasta = new Ext.form.DateField({
            id: 'hasta',
            name: 'fhasta',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true
        });
        
        this.btnGuardarFechas = new Ext.Button({
            id       : 'btnGuardar',
            iconCls  : 'guardar',
            text     : idioma.btnGuardar,
            tooltip  : idioma.ttbtnGuardarRango
        });

        this.btnEliminarPeriodo = new Ext.Button({
            id       : 'btnEliminar',
            iconCls  : 'eliminar',
            text     : idioma.BtnEliminar,
            tooltip  : idioma.lbBtnEliminarPeriodo
        });

        this.btnCerrarWinMes = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: idioma.lbBtnCerrar,
        });

        this.gpRangoFechas = new Ext.grid.EditorGridPanel({
            id       : 'gpRangoFechas',
            store    : modelo.storeRangoFechas,
            loadMask : {msg :idioma.MsgCargandoGrid},
            tbar     : ['->',this.btnGuardarFechas],
            columns  : [new Ext.grid.RowNumberer(),
                {header : "Mes",           dataIndex : 'mes',      width: 150},
                {header : "Desde",           dataIndex : 'desde',      width: 100, editor: this.desde, renderer: formatDate},
                {header : "Hasta",           dataIndex : 'hasta',      width: 100,/* editor: this.hasta, */renderer: formatDate},
            ],
            tbar:[this.btnGuardarFechas,this.btnEliminarPeriodo]
        });

        this.winRangoFechas = new Ext.Window({
            title       : 'Rangos de Fechas',
            closeAction : 'hide',
            resizable   : false,
            width       : 400,
            height      : 400,
            layout      : 'fit',
            modal       : true,
            buttons     : [this.btnCerrarWinMes],
            items       : [this.gpRangoFechas]
        });
        /******CONFIGURAR RANGOS DE FECHAS******/

        /******CONFIGURAR RANGOS DE FECHAS QUINCENAL******/
        function formatDatequincenal(value,metaData, record, rowIndex, colIndex, store) {
            if(value){
                return (value instanceof Date) ? value.format('d/m/Y') : value;
            }
        };

        function Estilo(val,meta,rec,row,col,store){
            Ext.each(store.reader.jsonData.datos, function (recs) {
                var data = recs.mes.split(' ');
                if(data[0] == '2da'){
                    meta.css = 'weekend';
                    return val;
                }else{
                    return val;
                }
            });
        }

        this.desdeprimquincena = new Ext.form.DateField({
            id: 'desdeprimquincena',
            name: 'fdesdeprimquincena',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
        });

        this.desdesegquincena = new Ext.form.DateField({
            id: 'desdesegquincena',
            name: 'fdesdesegquincena',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
        });

        this.hastaprimquincena = new Ext.form.DateField({
            id: 'hastaprimquincena',
            name: 'fhastaprimquincena',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
        });

        this.hastasegquincena = new Ext.form.DateField({
            id: 'hastasegquincena',
            name: 'fhastasegquincena',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
        });

        this.btnGuardarFechasQuincenal = new Ext.Button({
            id       : 'btnGuardarQuincenal',
            iconCls  : 'guardar',
            text     : idioma.btnGuardar,
            tooltip  : idioma.ttbtnGuardarRango,
        });

        this.btnEliminarPeriodosQuin = new Ext.Button({
            id       : 'btnEliminarQuin',
            iconCls  : 'eliminar',
            text     : idioma.BtnEliminar,
            tooltip  : idioma.lbBtnEliminarPeriodo
        });

        this.btnCerrarWinQuin = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: idioma.lbBtnCerrar,
        });

        var columns = new Array();
        var continentGroupRow = new Array();

        columns.push(new Ext.grid.RowNumberer());
        columns.push({
            header: 'Mes', width: 100, dataIndex: 'mes'
        });

        continentGroupRow.push({header: ' ', align: 'center', colspan: 2});
        continentGroupRow.push({header: '1ra Quincena', align: 'center', colspan: 2});
        continentGroupRow.push({header: '2da Quincena', align: 'center', colspan: 2});

        columns.push({header: 'Desde', width: 80, dataIndex: 'desdeprimquincena',editor: this.desdeprimquincena,renderer: formatDatequincenal});
        columns.push({header: 'Hasta', width: 80, dataIndex: 'hastaprimquincena',editor: this.hastaprimquincena,renderer: formatDatequincenal});
        columns.push({header: 'Desde', width: 80, dataIndex: 'desdesegquincena',editor: this.desdesegquincena,renderer: formatDatequincenal});
        columns.push({header: 'Hasta', width: 80, dataIndex: 'hastasegquincena',editor: this.hastasegquincena,renderer: formatDatequincenal});

        this.group = new Ext.ux.grid.ColumnHeaderGroup({
            rows: [continentGroupRow]
        });

        this.cmQuincenal = new Ext.grid.ColumnModel(columns);

        this.gpRangoFechasQuincenal = new Ext.grid.EditorGridPanel({
            id       : 'gpRangoFechasQuincenal',
            store    : modelo.storeRangoFechasQuincenal,
            loadMask : {msg :idioma.MsgCargandoGrid},
            plugins: [scope.group],
            cm: scope.cmQuincenal,
            tbar:[this.btnGuardarFechasQuincenal,this.btnEliminarPeriodosQuin]
        });

        this.winRangoFechasQuincenal = new Ext.Window({
            title       : 'Rangos de Fechas',
            closeAction : 'hide',
            resizable   : false,
            width       : 470,
            height      : 400,
            layout      : 'fit',
            modal       : true,
            buttons     : [this.btnCerrarWinQuin],
            items       : [this.gpRangoFechasQuincenal]
        });
        /******CONFIGURAR RANGOS DE FECHAS QUINCENAL******/

        /*** CONFIGURACION DEL CALENDARIO ***/
        this.arrFecha = this.fecha.split("/");
        this.datePicker = new Ext.ux.DatePickerPlus({
            clickRepeater: false,
            startDay:1,
            format:'d/m/Y',
            value: new Date(this.arrFecha[2], 0, this.arrFecha[0]),	//only the month counts here and is used as starting month to be displayed
            noOfMonth : 12, //(Ext.lib.Dom.getViewHeight()>600?9:4), //9 ,
            noOfMonthPerRow : 4,//(Ext.lib.Dom.getViewWidth()>1024?3:2), //4,
            multiSelection: true,
            allowMouseWheel:false,
            showWeekNumber: false,
            weekendText: 'Fin de semana',//LBRSTR__WEEKENDTEXT,
            showActiveDate:true,
            summarizeHeader:true,
            renderPrevNextButtons:false,
            renderPrevNextYearButtons:true,
            listeners: {
                select: function(dp,date) {
                    var allStringDates=[];
                    if (Ext.isDate(date)) {
                        allStringDates.push(date.format('d/m/Y'));
                    }
                    else {
                        Ext.each(date,function(c){
                            allStringDates.push(c.format('d/m/Y'));
                        },this);
                    }
                    console.info(allStringDates);
                    Ext.MessageBox.alert('Date(s) Selected', 'You have chosen the following day(s):<br>'+allStringDates.join('<br>'));
                }
            },
            eventDates : function(year) {
                var dates = [];
                return dates;
            }
        });

        /*** FORMULARIO ***/
            //Combobox para el tipo de día
        this.tipodia = new Ext.form.ComboBox({
            id:'tipodia',
            labelSeparator:':',
            editable:false,
            name :'idtipodedia',
            fieldLabel:idioma.lbTipoDia,
            valueField:'idtipodedia',
            displayField:'denominacion',
            hiddenName:'idtipodedia',
            mode: 'local',
            triggerAction: 'all',
            forceSelection:true,
            typeAhead: true,
            selectOnFocus:true,
            allowBlank:false,
            blankText:idioma.lbCampoVacio,
            emptyText:'Seleccione...',
            anchor:'50%',
            disabled:true,
            store:modelo.storeTipodia,
        });

        this.cbHoras = new Ext.form.TimeField({
            id: 'cbHoras',
            anchor: '60%',
            fieldLabel  : 'Horas',
            name: 'hora',
            hiddenname:'hora',
            emptyText: 'Seleccione...',
            format: 'H:i',
            minValue: '00:00',
            enableKeyEvents: true,
            maxValue: '23:59',
            value:'08:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)'
        });

        this.cbturno = new Ext.form.ComboBox({
            store: modelo.storeTurnoTrabajo,
            fieldLabel: 'Turno de trabajo',
            displayField:'denominacion',
            typeAhead: true,
            mode: 'local',
            enableKeyEvents:true,
            emptyText: 'Seleccione...',
            anchor: '50%',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            valueField:'idturnotrabajo',
            name:'idturnotrabajo',
            disabled:true,
            hiddenname:'idturnotrabajo'

        });

        //Botón para guardar la configuración
        this.btnGuardar = new Ext.Button({
            id:'btnGuardar',
            iconCls:'guardar',
            disabled:true,
            text:idioma.btnGuardar,
            tooltip:idioma.ttbtnGuardar,
        });

        //Botón para limpiar la configuración
        this.btnEliminar = new Ext.Button({
            id       : 'btnEliminar',
            text     : idioma.BtnEliminar,
            tooltip  : idioma.lbBtnEliminar,
            iconCls  : 'eliminar',
            disabled : true
        });

        //Formulario
        this.formularioGuardar = new Ext.FormPanel({
            id:'formularioGuardar',
            labelAlign: 'top',
            frame:true,
            width : '100%',
            height:100,
            region:'south',
            buttons:[this.btnGuardar,this.btnEliminar],
            items:[
                {
                layout:'column',
                items:[{
						columnWidth:.5,
						layout: 'form',
						items:[this.tipodia]
					},{
                    columnWidth:.5,
                    layout: 'form',
                    items: [this.cbturno]
                }
                    ]
                }
            ]
        });

        //panel para la leyenda
        this.plantillaFoto = new Ext.Template(
            '<div></div>'
        );
        this.plantillaFoto.compile();

        //funcion para construir la leyenda
        modelo.storeTipodia.on('load',function(){
          var table =  Leyenda();
            var Leyend = new Ext.Panel({
                id:'Leyend',
                bodyBorder : false,
                border : false,
                frame:true,
                layout:'fit',
                html:table
            });
            this.panelLeyenda.add(Leyend);
        }.createDelegate(this));

        function Leyenda()
        {
            var compDiv =  modelo.storeTipodia.getCount()/3;

            var Div = Math.floor(compDiv);
            var restoDiv = modelo.storeTipodia.getCount()%3;

            var arrRecs = modelo.storeTipodia.getRange();
            var cont = 0;

            var tabla = "<table width='720' border='0'>";
            tabla+="<tr ><td colspan='3' ><div class='textLeyenda'><center><u>TIPOS DE DÍA</u></center></div></td></tr> ";
            tabla+="<tr align='center'><td colspan='3' ><div class='textLeyenda'></div></td></tr> ";
            for(var x = 0; x < Div; x++)
            {
                tabla+= "<tr>";
                    tabla+= "<td width='210'><div class='iconLeyenda' style='background:"+arrRecs[cont].data.color+"'></div><div class='textLeyenda'>"+arrRecs[cont].data.denominacion+" </div></td>";
                    tabla+= "<td width='210'><div class='iconLeyenda' style='background:"+arrRecs[cont+1].data.color+"'></div><div class='textLeyenda'>"+arrRecs[cont+1].data.denominacion+" </div></td>";
                    tabla+= "<td width='210'><div class='iconLeyenda' style='background:"+arrRecs[cont+2].data.color+"'></div><div class='textLeyenda'>"+arrRecs[cont+2].data.denominacion+" </div></td>";
                tabla+= "</tr>";
                cont+=3;
            }

            if(restoDiv > 0)
            {
                tabla+= "<tr>";
                if(restoDiv == 1)
                {
                    tabla+= "<td width='210'><div class='iconLeyenda' style='background:"+arrRecs[cont].data.color+"'></div><div class='textLeyenda'>"+arrRecs[cont].data.denominacion+" </div></td>";
                    tabla+= "<td width='210'><div></div></td>";
                    tabla+= "<td width='210'><div></div></td>";
                }
                else
                {
                    tabla+= "<td width='210'><div class='iconLeyenda' style='background:"+arrRecs[cont].data.color+"'></div><div class='textLeyenda'>"+arrRecs[cont].data.denominacion+" </div></td>";
                    tabla+= "<td width='210'><div class='iconLeyenda' style='background:"+arrRecs[cont+1].data.color+"'></div><div class='textLeyenda'>"+arrRecs[cont+1].data.denominacion+" </div></td>";
                    tabla+= "<td width='210'><div></div></td>";
                }
                tabla += "</tr>";
            }
            tabla += "</table>";

            return tabla;
        }
        //funcion para construir la leyenda


        this.panelLeyenda = new Ext.Panel({
            id:'panelLeyenda',
           // title:'Leyenda',
            //collapsible:true,
            width : '100%',
            heigth: 230,
            bodyBorder : false,
            border : false,
            frame:true,
            layout:'fit'
        });

        this.panelDatepicker = new Ext.Panel({
            id:'panelDatepicker',
            region:'center',
            width : '100%',
            heigth: 230,
            bodyBorder : false,
            autoScroll:true,
            border : false,
            frame:true,
            layout:'fit',
            disabled: true,
            items:[this.datePicker]
        });

        /*** VENTANA PARA CONFIGURAR LIMETES DE HORAS EXTRAS ***/
            //Horas límites
        this.tfHorasLimites = new Ext.form.NumberField({
            name       : 'limite',
            maxLength  : 3,
            anchor     : '100%',
            allowBlank : false
        });
        //Grid
        this.gpLimites = new Ext.grid.EditorGridPanel({
            store        : modelo.stLimites,
            height       : 200,
            loadMask     : true,
            width        : '100%',
            border       : false,
            autoScroll   : true,
            clicksToEdit : 1,
            region       : 'center',
            columns      : [new Ext.grid.RowNumberer(),
                {header : 'Denominación', dataIndex : 'denominacion', width : 200},
                {header : 'Horas',        dataIndex : 'limite',       width : 100, sortable: true, editor: this.tfHorasLimites}
            ]
        });
        // Boton para guardar los límites
        this.btnGuardarLim = new Ext.Button({
            text    : idioma.btnGuardar,
            tooltip : idioma.ttbtnGuardarLim,
            iconCls : 'guardar'
        });
        //Ventana
        this.winLimitar = new Ext.Window({
            title       : 'Límites para horas extras',
            closeAction : 'hide',
            resizable   : false,
            width       : 400,
            height      : 200,
            layout      : 'fit',
            modal       : true,
            buttons     : [this.btnGuardarLim],
            items       : [this.gpLimites]
        });


        //Vista general
        this.vp = new Ext.Viewport({
            layout: 'fit',
            items: [
                {
                    layout:'border',
                    margins:'0 0 0 0',
                    tbar:[this.btnExportar,/* this.btnLimitar,this.btnLimpiar,/*this.btnRangoFechas,this.btnPlanificar,*/ this.btnPlanificacion,'->',this.btnAyuda],
                    items:[
                        {
                            region:'center',
                            layout:'border',
                            width:'48%',
                            margins:'0 0 0 0',
                            items  : [
                                { //Grid RTD y Grupos
                                    region     : 'north',
                                    layout     : 'border',
                                    split      : true,
                                    height     : 350,
                                    autoScroll : true,
                                    items      : [this.tabs]
                                },{ //Grid para el resumen
                                    region     : 'center',
                                    id         : 'resumen',
                                    layout     : 'fit',
                                    split      : true,
                                    autoScroll : true,
                                    items      : [this.panelInformativo]
                                }
                            ]
                        },{
                            region:'east',
                            margins:'0 0 0 0',
                            layout:'border',
                            split      : true,
                            width:'53%',
                            items:[
                                {
                                    region:'center',
                                    layout:'border',
                                    height: 610,
                                    width: 720,
                                    split      : true,
                                    margins:'0 0 0 0',
                                    items:[ this.panelDatepicker,this.formularioGuardar]
                                    },{
                                        region:'south',
                                        margins:'0 0 0 0',
                                        border: false,
                                        collapseMode:'mini',
                                        collapsible:true,
                                        collapsed:false,
                                        layout:'fit',
                                        split:true,
                                        width:'100%',
                                        height: 150,
                                        items:[this.panelLeyenda]
                                    }]
                                }
                            ]
                        }
                    ]
        });

    }

};

//Inicializando la vista.
function Cargar () {
    //Escogiendo la configuraci?n del idioma seg?n la versi?n del MT.
    var idioma = Ext.Zeolides.Diasnolaborables.Idioma;
    //Inicializando el modelo
    var modelo = Ext.Zeolides.Diasnolaborables.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Ext.Zeolides.Diasnolaborables.Vista;
    vista.init(idioma, modelo);
    //Inicializar controlador.
    var controller = Ext.Zeolides.Diasnolaborables.Controlador;
    controller.init(idioma, vista, modelo);


};
Ext.onReady(function(){
    Ext.QuickTips.init();
Cargar();
});



//
