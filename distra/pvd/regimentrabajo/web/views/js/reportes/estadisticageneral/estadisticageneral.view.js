Ext.ns('Pvd.ControlAsistencia.EstadisticaGeneral');
//Vista del componente.
Pvd.ControlAsistencia.EstadisticaGeneral.Vista = {

    init: function (idioma, modelo) {

        var fech = document.getElementById('fecha').getAttributeNode('value').value;
        var fechfinmes = document.getElementById('fecha').getAttributeNode('value').value;
        this.fecha = new Date(fech.split('/')[2], fech.split('/')[1] - 1, fech.split('/')[0])
        var scope=this;
        this.Maskara = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando datos..."});
        this.idestructura = perfil.idestructuracomun;
        this.denomestructura = '';

        var f = this.fecha.format('d/m/Y');
        var explodeDate = f.split('/');
        this.fech = '01/' + explodeDate[1] + '/' + explodeDate[2];

        function diasEnUnMes(mes, año) {
            return new Date(año, mes, 0).getDate();
        }

        this.fechfinmes = diasEnUnMes(explodeDate[1], explodeDate[2])+ '/' + explodeDate[1] + '/' + explodeDate[2];

        this.fechaBuscar = new Ext.form.DateField({
            id: 'fecha',
            name: 'fecha',
            labelSeparator: ':',
            format: 'd/m/Y',
            readOnly: true,
            width: 150,
            allowBlank: false,
            maxValue: this.fecha.format('d/m/Y'),
            value: this.fecha.format('d/m/Y')
        });

        this.desde = new Ext.form.DateField({
            id: 'desde',
            name: 'fdesde',
            format: 'd/m/Y',
            readOnly: false,
            width: 100,
            allowBlank: true,
            value:  this.fech,
            invalidText: idioma.invalidTextFecha,
            maxValue: this.fecha.format('d/m/Y'),
            allowBlank : false,
            blankText: idioma.lbCampoVacio,
            vtype:'daterange',
            endDateField: 'hasta'
        });

        this.hasta = new Ext.form.DateField({
            id: 'hasta',
            name: 'fhasta',
            format: 'd/m/Y',
            readOnly: false,
            width: 100,
            allowBlank: true,
            invalidText: idioma.invalidTextFecha,
            value: this.fechfinmes,
            //maxValue: this.fechfinmes,
            allowBlank : false,
            blankText: idioma.lbCampoVacio,
            vtype:'daterange',
            startDateField: 'desde'
        });

        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.btnBuscarDenom,
            tooltip: idioma.lbbtnBuscarEst,
            iconCls: 'buscar'
        });

        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.btnLimpiar,
            tooltip: idioma.lbbtnLimpiar,
            iconCls: 'limpiar'
        });

        this.btnGrafica = new Ext.Button({
            text: 'Gráfica',
            tooltip: 'Gráficar la asistencia',
            disabled: false,
            iconCls: 'graficar',
            enableToggle:true
        });

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

        this.btnAyuda = new Ext.Button({
            id:'btnAyudaPartFecha',
            text: idioma.btnAyuda,
            iconCls:'ayuda',
            disabled: false,
            tooltip:idioma.lbBtnAyuda
        });

        //panel de estructura
        this.EstructuraTree = new Ext.estructura.panel.PanelEstructura({
            id:'EstructuraTree',
            region: 'center',
            split:true,
            margins: '0 0 0 0',
            border:false,
            //Otros parametros
            inicial : perfil.idestructuracomun,//codigo|id, Indica a partir de que estructura debe abrir el arbol
            //cargos: false, //Para que no salgan los cargos
            //checker: true | [2,7,9],  //Muestra si va user checked o restringe los elementos que solo pueden tener checked
            //checked: {
            //  concepto: [3]
            //}  //Marca chequeado todos o las estructuras especificas
            //limit: [1,2,3,4,5,6,7,8,9]  //Define los conceptos que no se deben expandir
            //menu: false //Muestra u oculta el context menu por defecto true
        });

        this.panelestructura = new Ext.Panel({
            items:[this.EstructuraTree],
            title:'Estructura',
            region:'west',
            layout:'fit',
            split:true,
            width: 330,
            collapsible: true,
            frame:false,
            margins: '0 0 0 0',
            cmargins: '0 0 0 0'
        });

        scope.EstructuraTree.on('dameseleccion', function (obj, data) {
            if(data == false)
                this.idestructura = scope.EstructuraTree.inicial;
            else{
                this.idestructura = data.id;
                this.denomestructura = data.attributes.denominacion;
            }
        },this);

        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            iconCls: 'exportar',
            menu: {items: [
                {text: 'Reporte estadístico de la asistencia <span style="color:#d1200a;">' + '(*.pdf)', iconCls: 'informe', icon: '', id: 'exportarpdf', handler: onItemClick},
                {text: 'Reporte estadístico de la asistencia <span style="color:#2b9c26;">' + '(*.xls)', iconCls: 'informe', icon: '', id: 'exportarexcel', handler: onItemClick}
            ]}
        });

        function onItemClick(items){
            if(items.id == 'exportarpdf'){
                var params = Ext.urlEncode({
                    idestructura: scope.idestructura,
                    desde: scope.desde.getRawValue(),
                    hasta: scope.hasta.getRawValue(),
                    tiporeporte:scope.tiporeporte.value
                });
                var idIframe = Ext.id();
                new Ext.Window({
                    title: 'Reporte de la asistencia',
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
                            '/pvd/regimentrabajo/index.php/estadisticageneral/exportarestadistico?'+params
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
                var params = Ext.urlEncode({
                    tiporeporte:scope.tiporeporte.value
                });
                winload.showMask();
                var iframe = document.createElement("iframe");
                iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/regimentrabajo/index.php/estadisticageneral/exportarestadisticoExcel?'+params;
                iframe.style.display = 'none';
                iframe.onload = function () {
                    winload.hideMask();
                }
                document.body.appendChild(iframe);
            }
        }

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        this.Listado = new Ext.grid.GridPanel({
            id:'listadoest',
            store: modelo.stListado,
            region:'center',
            autoScroll:true,
            split:true,
            sm: this.sm,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'Unidad Empresarial de Base', width:250, dataIndex: 'estructura'}
            ]
        });

        this.combografica = new Ext.form.ComboBox({
            store: modelo.storeTipografica,
            width:160,
            displayField:'denominacion',
            valueField:'idtipo',
            hiddenName:'idtipo',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            value:1,
            emptyText:'Seleccione...',
            selectOnFocus:true,
        });


        this.grafica = new Ext.components.HighchartPanel({
            id:'graficaParteporFecha',
            border : true,
            layout:'fit',
            margins: '0 0 0 0'
        });

        this.panelgrafica = new Ext.Panel({
            id:'panelgrafica',
            title: 'Gráfica',
            layout:'fit',
            region: 'east',
            split:true,
            width:'25%',
            margins: '0 0 0 0',
            collapsible: true,
            collapsed: true,
            tbar: ['Análisis:', '', this.combografica],
            items:[this.grafica]
        });

        this.filtro = new Ext.form.TextField({
            id: 'filtro',
            name: 'filtro',
            hiddenname: 'filtro',
            emptyText: 'Criterio a buscar...',
            prevTab: 'btnAceptar',
            minLength: 3,
            maxLength: 60,
            nextTab: 'fechainicio',
            regex:/^([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc]*)+$/,
            anchor: '96%',
            allowBlank: true
        });

        this.btnBuscarNominal = new Ext.Button({
            id: 'btnBuscarNominal',
            text: idioma.btnBuscarDenom,
            tooltip: idioma.lbbtnBuscar,
            iconCls: 'buscar'
        });

        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.btnLimpiar,
            tooltip: idioma.lbbtnLimpiar,
            iconCls: 'limpiar'
        });

        this.agrupador = new Ext.form.ComboBox({
            id:'agrupador',
            store: modelo.storeagrupador,
            displayField:'denominacion',
            valueField:'idagrupador',
            typeAhead: true,
            mode: 'local',
            width:150,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            selectOnFocus:true,
            value:1,
        });

        this.btnExportarNominal = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            iconCls: 'exportar',
            menu: {items: [
                {text: 'Reporte nominal de la asistencia <span style="color:#d1200a;">' + '(*.pdf)', iconCls: 'informe', icon: '', id: 'exportarnominalpdf', handler: onItemClickNominal},
                {text: 'Reporte nominal de la asistencia <span style="color:#2b9c26;">' + '(*.xls)', iconCls: 'informe', icon: '', id: 'exportarnominalexcel', handler: onItemClickNominal}
            ]}
        });

        function onItemClickNominal(items){
            if(items.id == 'exportarnominalpdf'){
                var cant = modelo.stListadonominal.getCount();

                var params = Ext.urlEncode({
                    idestructura: scope.idestructura,
                    desde: scope.desde.getRawValue(),
                    hasta: scope.hasta.getRawValue(),
                    tiporeporte:scope.tiporeporte.value,
                    estructura: scope.denomestructura,
                    agrupador:scope.agrupador.value
                });

                var idIframeNominal = Ext.id();
                new Ext.Window({
                    title: 'Reporte nominal',
                    width: 800,
                    height: 500,
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable: true,
                    id: 'win',
                    constrainHeader: true,
                    border: false,
                    modal: true,
                    items: {
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            id: idIframeNominal,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host +
                            '/pvd/regimentrabajo/index.php/estadisticageneral/exportar?' + params
                        }
                    }
                }).show();
                Ext.getCmp('win').maximize();
                PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando el reporte nominal en formato PDF.');
                document.getElementById(idIframeNominal).onload = function () {
                    PVD.ocultarMascara('rep01');
                }
            }else if(items.id == 'exportarnominalexcel'){
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Generando reporte'
                });
                winload.showMask();
                var iframe = document.createElement("iframe");
                iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/regimentrabajo/index.php/estadisticageneral/exportarnominalExcel?';
                iframe.style.display = 'none';
                iframe.onload = function () {
                    winload.hideMask();
                };
                document.body.appendChild(iframe);
            }
        }

        this.smListado = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        this.Maskara = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando..."});

        function formatDate(value,metaData, record, rowIndex, colIndex, store) {
            if(value){
                return (value instanceof Date) ? value.format('d/m/Y') : value;
            }else{

            }

        };

        function horas(val, metaData, record, rowIndex, colIndex, store) {
            if (val) {
                var fh = val.split(' ');
                if (fh.length > 1) {
                    var horacompleta = fh[1].split(':');
                    return horacompleta[0] + ':' + horacompleta[1];
                }
                else {
                    return val;
                }
            }
            else {

            }
        }

        this.Listado = new Ext.grid.GridPanel({
            id:'listadonominal',
            title: ' ',
            store: modelo.stListadonominal,
            region: 'center',
            layout:'fit',
            width : '100%',
            loadMask: {msg: 'Cargando...'},
            sm: this.smListado,
            stripeRows: true,
            viewConfig: {
                forceFit: true,
                getRowClass: function (rec, ind) {
                }
            },
            view: new Ext.grid.GroupingView({
                groupByText: ' ',
                enableGroupingMenu:false,
                enableNoGroups:false,
                showGroupName:false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            columns: [new Ext.grid.RowNumberer({width :40}),

                {header: 'idpersona', width :100,hidden:true,hideable:false, dataIndex: 'idpersona'},
                {header: 'Nombres y Apellidos', width: 150, dataIndex: 'nombreapellidos'},
                {header: 'Cargo', width: 200,hidden:false, dataIndex: 'denomcargo'},
                {header: 'Area', width: 150,hidden:true, dataIndex: 'denomarea'},
                {
                    header: 'Fecha entrada',
                    width: 80,
                    dataIndex: 'fechaentrada',
                    renderer: formatDate
                },{
                    header: 'Hora entrada',
                    width: 80,
                    dataIndex: 'fechahoraentrada',
                    renderer: horas
                },
                {
                    header: 'Fecha salida',
                    width: 80,
                    dataIndex: 'fechasalida',
                    renderer: formatDate
                },
                {
                    header: 'Hora salida',
                    width: 80,
                    dataIndex: 'fechahorasalida',
                    renderer: horas
                },
                {header: 'fecharegistro',width:150,hidden:true, dataIndex: 'fecharegistro'},
                {header: 'Causa',width:150, dataIndex: 'denominacion'},
                {header: 'Desde',  width: 80, dataIndex: 'fdesde', renderer: formatDate},
                {header: 'Hasta', width: 80, dataIndex: 'fhasta', renderer: formatDate},
                {header: 'Perdidas', width: 60, dataIndex: 'hrsdescontadas',renderer: horas},
                {header: 'idpersonacontrola', width: 100,hidden:true,hideable:false, dataIndex: 'idpersonacontrola'},
                {header: 'Controlado por ', width: 150, dataIndex: 'personacontrola'},
                {header: 'idpersonamodifica', width: 100,hidden:true,hideable:false, dataIndex: 'idpersonamodifica'},
                {header: 'Modificado por ', width: 150, dataIndex: 'personamodifica'},
                {header: 'idpersonacertifica', width: 100,hidden:true,hideable:false, dataIndex: 'idpersonacertifica'},
                {header: 'Certificado por ', width: 150, dataIndex: 'personacertifica'},
                {header: 'Observaciones',width:150, dataIndex: 'observacion'},
                {header: 'agrupador',width:150,hidden:true, dataIndex: 'agrupador'},
            ],
            tbar:['Nombres y apellidos: ',this.filtro,'-',this.btnBuscarNominal,this.btnLimpiar,'-','Agrupador: ',this.agrupador,'-',this.btnExportarNominal]
        });

        this.btnCerrar = new Ext.Button({
            id:'btnCerrar',
            iconCls:'cerrar',
            tooltip:idioma.lbBtnCanc,
            text:'Cerrar'
        });

        this.panelCenterNominal = new Ext.Panel({
            region  : 'center',
            border  : false,
            disabled: false,
            layout  : 'fit',
            items   : [this.Listado]
        });

        this.winReporteNominal = new Ext.Window({
            title:'Reporte Nominal',
            layout:'fit',
            width : '100%',
            height : 400,
            maximizable: true,
            closable:true,
            resizable:true,
            closeAction: 'hide',
            items:[this.panelCenterNominal],
            modal: true,
            buttons: [this.btnCerrar]
        });

        this.causas = new Ext.grid.GridPanel({
            id: 'gridCausas',
            store: modelo.stlistadoCausas,
            autoScroll: true,
            loadMask: {msg: idioma.lbMsgmasklistado},
            stripeRows: true,
            columns: [
                {header: 'idcausa', width: 100, hidden: true, hideable: false, dataIndex: 'idcausa'},
                {header: 'Abreviatura', width: 70, dataIndex: 'abreviatura'},
                {header: 'Causa', width: 160, hideable: false, dataIndex: 'denominacion'}
            ]
        });

        this.panelcausas = new Ext.Panel({
            region  : 'center',
            border  : false,
            layout  : 'fit',
            items   : [this.causas]
        });

        this.vp = new Ext.Viewport({
            layout:'border',
            items:[this.panelestructura,{
                id:'listadovp',
                tbar: ['Fecha inicio:',this.desde,'-','Fecha fin:',this.hasta,'-','Tipo de reporte: ',this.tiporeporte,'-',this.btnBuscar,'-',this.btnExportar,'-',this.btnGrafica,'-','->',this.btnAyuda],
                region:'center',
                layout:'fit'
            },this.panelgrafica]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('estadisticageneral', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.EstadisticaGeneral.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.EstadisticaGeneral.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.EstadisticaGeneral.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.frameElement.id);

});