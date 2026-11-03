Ext.ns('Pvd.ControlAsistencia.PartePorFecha');
//Vista del componente.
Pvd.ControlAsistencia.PartePorFecha.Vista = {

    init: function (idioma, modelo) {

        //this.fecha = new Date();
        var fech = document.getElementById('fecha').getAttributeNode('value').value;
        this.fecha = new Date(fech.split('/')[2], fech.split('/')[1] - 1, fech.split('/')[0]);
        var scope = this;
        var hora;
        var minutos;
        var segundos;
        hora = this.fecha.getHours();
        minutos = this.fecha.getMinutes();
        segundos = this.fecha.getSeconds();
        this.horareporte = hora + ':' + minutos + ':' + segundos;
        this.idestructura = perfil.idestructuracomun;
        this.denomestructura = '';

        this.fechaBuscar = new Ext.form.DateField({
            id: 'fecha',
            name: 'fecha',
            labelSeparator: ':',
            format: 'd/m/Y',
            readOnly: true,
            width: 100,
            allowBlank: false,
            //maxValue: this.fecha.format('d/m/Y'),
            value: this.fecha.format('d/m/Y')
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

        this.filtro = new Ext.form.TextField({
            id: 'filtro',
            name: 'filtro',
            hiddenname: 'filtro',
            emptyText: 'Criterio a buscar...',
            prevTab: 'btnAceptar',
            minLength: 3,
            maxLength: 60,
            nextTab: 'fechainicio',
            regex: /^([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc]*)+$/,
            anchor: '96%',
            allowBlank: true
        });


        this.cbCausa = new Ext.ux.form.LovCombo({
            store: modelo.storeCausasAusencia,
            displayField: 'denominacion',
            fieldLabel: 'Causa de ausencia',
            mode: 'local',
            anchor: '98%',
            hiddenName: 'idcausa',
            typeAhead: true,
            enableQtip: true,
            triggerAction: 'all',
            editable: false,
            //disabled:true,
            emptyText: 'Seleccione...',
            listeners: {
                render: function (combo) {
                    this.triggers[1].remove();
                },
                beforeselect: function (combo, record, index) {
                    this.valueField = 'idcausa';
                },
                blur: function () {
                    this.valueField = 'idcausa';
                    this.isValid();
                    if (this.getRawValue() != '') {
                        this.clearInvalid();
                    }
                },
                collapse: function () {
                }

            }
        });

        this.cbTurnoTrabajo = new Ext.form.ComboBox({
            store: modelo.storeTurnoTrabajo,
            fieldLabel: 'Turno de trabajo',
            anchor: '60%',
            displayField: 'denominacion',
            valueField: 'idturnotrabajo',
            hiddenName: 'idturnotrabajo',
            typeAhead: true,
            mode: 'local',
            //forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            //selectOnFocus:true,
        });

        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
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

        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: idioma.btnExportar,
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        text: 'Reporte nominal <span style="color:#d1200a;">' + '(*.pdf)',
                        iconCls: 'informe',
                        icon: '',
                        id: 'repnominal',
                        handler: onItemClick
                    },
                    {
                        text: 'Reporte nominal <span style="color:#2b9c26;">' + '(*.xls)',
                        iconCls: 'informe',
                        icon: '',
                        id: 'repnominalexcel',
                        handler: onItemClick
                    }, '-',
                    {
                        text: 'Reporte estadístico <span style="color:#d1200a;">' + '(*.pdf)',
                        iconCls: 'informe',
                        icon: '',
                        id: 'repestadistico',
                        handler: onItemClick
                    },
                    {
                        text: 'Reporte estadístico <span style="color:#2b9c26;">' + '(*.xls)',
                        iconCls: 'informe',
                        icon: '',
                        id: 'repestadisticoexcel',
                        handler: onItemClick
                    }
                ]
            }
        });

        function onItemClick(items) {
            var idturno = scope.cbTurnoTrabajo.getValue();
            var idestructura = scope.idestructura;
            var idcausa = scope.cbCausa.getValue();
            var agrupador = scope.agrupador.value;

            if (items.id == 'repnominal') {
                var params = Ext.urlEncode({
                    agrupador:agrupador
                });
                var idIframeNominal = Ext.id();
                new Ext.Window({
                    title: 'Reporte nominal',
                    width: 800,
                    height: 500,
                    id: 'idnominal',
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
                            id: idIframeNominal,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host +
                            '/pvd/regimentrabajo/index.php/parteporfecha/exportar?' + params
                        }
                    }
                }).show();
                Ext.getCmp('idnominal').maximize();
                PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando el reporte nominal en formato PDF.');
                document.getElementById(idIframeNominal).onload = function () {
                    PVD.ocultarMascara('rep01');
                }
            } else if (items.id == 'repnominalexcel') {
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Generando reporte'
                });
                winload.showMask();
                var iframe = document.createElement("iframe");
                iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/regimentrabajo/index.php/parteporfecha/exportarnominalExcel?';
                iframe.style.display = 'none';
                iframe.onload = function () {
                    winload.hideMask();
                }
                document.body.appendChild(iframe);
            } else if (items.id == 'repestadistico') {
                var params = Ext.urlEncode({
                    agrupador:agrupador
                });
                var idIframeEstadistico = Ext.id();
                new Ext.Window({
                    title: 'Reporte estadístico',
                    width: 800,
                    height: 500,
                    id: 'idestadistica',
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
                            id: idIframeEstadistico,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host +
                            '/pvd/regimentrabajo/index.php/parteporfecha/exportarest?' + params
                        }
                    }
                }).show();
                Ext.getCmp('idestadistica').maximize();
                PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando el reporte estadístico en formato PDF.');
                document.getElementById(idIframeEstadistico).onload = function () {
                    PVD.ocultarMascara('rep01');
                }
            } else if (items.id == 'repestadisticoexcel') {
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Generando reporte'
                });
                winload.showMask();
                var iframe = document.createElement("iframe");
                iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/regimentrabajo/index.php/parteporfecha/exportarestadisticoExcel?';
                iframe.style.display = 'none';
                iframe.onload = function () {
                    winload.hideMask();
                }
                document.body.appendChild(iframe);
            }

        }

        this.btnGrafica = new Ext.Button({
            text: 'Gráfica',
            tooltip: 'Gráficar la asistencia',
            disabled: false,
            iconCls: 'graficar'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaPartFecha',
            text: idioma.btnAyuda,
            iconCls: 'ayuda',
            disabled: false,
            tooltip: idioma.lbBtnAyuda
        });

        //panel de estructura
        this.EstructuraTree = new Ext.estructura.panel.PanelEstructura({
            id: 'EstructuraTree',
            region: 'center',
            split: true,
            margins: '0 0 0 0',
            border: false,
            //Otros parametros
            inicial: perfil.idestructuracomun,//codigo|id, Indica a partir de que estructura debe abrir el arbol
            //cargos: false, //Para que no salgan los cargos
            //checker: true | [2,7,9],  //Muestra si va user checked o restringe los elementos que solo pueden tener checked
            //checked: {
            //  concepto: [3]
            //}  //Marca chequeado todos o las estructuras especificas
            //limit: [1,2,3,4,5,6,7,8,9]  //Define los conceptos que no se deben expandir
            //menu: false //Muestra u oculta el context menu por defecto true
        });

        scope.EstructuraTree.on('dameseleccion', function (obj, data) {
            if (data == false)
                this.idestructura = scope.EstructuraTree.inicial;
            else {
                this.idestructura = data.id;
                this.denomestructura = data.attributes.denominacion;
            }
        }, this);

        this.panelestructura = new Ext.Panel({
            items: [this.EstructuraTree],
            title: 'Estructura',
            region: 'west',
            layout: 'fit',
            width: '25%',
            split:true,
            collapsible: true,
            frame: false,
            margins: '0 0 0 0',
            cmargins: '0 0 0 0'
        });

        function formatDate(value, metaData, record, rowIndex, colIndex, store) {
            if (value) {
                return (value instanceof Date) ? value.format('d/m/Y') : value;
            } else {

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

        function formatCausa(value, metaData, record, rowIndex, colIndex, store) {
            if (value == 'Sin registro de asistencia' || value == 'Sin Causa') {
                return '';
            } else {
                return value;
            }

        };

        this.smListado = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.Maskara = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});

        this.Listado = new Ext.grid.GridPanel({
            id: 'listado',
            store: modelo.stListado,
            loadMask: {msg: 'Cargando...'},
            width: '60%',
            sm: this.smListado,
            stripeRows: true,
            viewConfig: {
                forceFit: true,
                getRowClass: function (rec, ind) {
                }
            },
            view: new Ext.grid.GroupingView({
                groupByText: ' ',
                enableGroupingMenu: false,
                enableNoGroups: false,
                showGroupName: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            columns: [new Ext.grid.RowNumberer({width: 30}),
                {header: 'idpersona', width: 100, hidden: true, hideable: false, dataIndex: 'idpersona'},
                {header: 'No.Identidad', width: 90, dataIndex: 'numid'},
                {header: 'idarea', width: 100, hidden: true, hideable: false, dataIndex: 'idarea'},
                {header: 'Nombre y apellidos', width: 170, dataIndex: 'nombreapellidos'},
                {header: 'Cargo', width: 230, dataIndex: 'denomcargo'},
                {header: 'Área', width: 200, dataIndex: 'denomarea'},
                {
                    header: 'Fecha entrada',
                    width: 90,
                    dataIndex: 'fechaentrada',
                    renderer: formatDate
                }, {
                    header: 'Hora entrada',
                    width: 80,
                    dataIndex: 'fechahoraentrada',
                    editor: this.horaentrada,
                    renderer: horas
                },
                {
                    header: 'Fecha salida',
                    width: 80,
                    dataIndex: 'fechasalida',
                    renderer: formatDate
                },
                {
                    header: 'Hora de salida',
                    width: 100,
                    dataIndex: 'fechahorasalida',
                    editor: this.horasalida,
                    renderer: horas
                },
                {header: 'Causa'/*, hidden: true*/, width: 150, dataIndex: 'causa', renderer: formatCausa},
                {header: 'Desde', width: 90, dataIndex: 'fdesde', editor: this.desde, renderer: formatDate},
                {header: 'Hasta', width: 90, dataIndex: 'fhasta', editor: this.hasta, renderer: formatDate},
                {header: 'fecharegistro', width: 100, dataIndex: 'fecharegistro', hidden: true, hideable: false},
                {header: 'Horas descontadas', width: 110, dataIndex: 'hrsdescontadas'},
                {header: 'Horas extras', width: 80, dataIndex: 'horasextras'},
                {
                    header: 'idpersonacontrola',
                    width: 100,
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idpersonacontrola'
                },
                {header: 'Controlado por ', width: 170, dataIndex: 'personacontrola'},
                {
                    header: 'idpersonamodifica',
                    width: 100,
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idpersonamodifica'
                },
                {header: 'Modificado por ', width: 170, dataIndex: 'personamodifica'},
                {
                    header: 'idpersonacertifica',
                    width: 100,
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idpersonacertifica'
                },
                {header: 'Certificado por ', width: 170, dataIndex: 'personacertifica'},
                {header: 'agrupador', width: 100, hidden: true, hideable: false, dataIndex: 'agrupador'},
            ],
            tbar: ['Nombre y apellidos:', this.filtro, '-', 'Causas:', this.cbCausa, '-', 'Turno: ', this.cbTurnoTrabajo, '-', this.btnBuscar, this.btnLimpiar]

        });


        this.panellistado = new Ext.Panel({
            title: 'Listado de personas',
            region: 'center',
            layout: 'fit',
            margins: '0 0 0 0',
            items: [this.Listado],
            tbar: ['Fecha:', this.fechaBuscar, '-','Agrupador:',this.agrupador,'-', this.btnExportar, '-', this.btnGrafica, '->', this.btnAyuda]
        });


        this.plantilla = new Ext.XTemplate(
            '<div >',
            '<tpl for=".">',
            '<p><center><b>Reporte</b></center></p>',
            '<p><b>Presentes:</b> {presentes}<br/>',
            '<b>Ausentes:</b> {ausentes}</p><br/>',
            '</tpl>',
            '</div>'
        );
        this.plantilla.compile();
        var defecto = {
            presentes: 'x',
            ausentes: 'y'
        };

        this.panel = new Ext.Panel({
            id: 'panel',
            layout: 'fit',
            frame: true,
            region: 'west',
            width: 200,
            margins: '0 0 0 0',
            listeners: {
                render: function () {
                    this.plantilla.overwrite(this.panel.body, defecto);
                }.createDelegate(this)
            }
        });

        this.grafica = new Ext.components.HighchartPanel({
            id: 'graficaParteporFecha',
            border: true,
            split: true,
            chartType: 'column',
            chartDatas: {name: 'sin datos', data: [['data', 0]]},
            chartTitle: 'Gráfica',
            chartCategories: ['Causas de ausencia']
        });

        this.wingrafica = new Ext.Window({
            title: 'Gráfica',
            closable: true,
            width: 800,
            height: 550,
            constrain: true,
            modal: true,
            closeAction: 'hide',
            plain: true,
            layout: 'fit',
            items: this.grafica
        });

        this.vp = new Ext.Viewport({
            layout: 'border',
            items: [this.panelestructura, this.panellistado]

        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('parteporfecha', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.PartePorFecha.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.PartePorFecha.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.PartePorFecha.Controlador.init(idioma, vista, modelo);

});