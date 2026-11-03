Ext.ns('Pvd.Nomina.Gestionarantiguedad');
//Tipo de layout auxiliar
Ext.ns('Ext.ux.layout');
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize: true,

    // private
    isValidParent: function (c, target) {
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout: function (ct, target) {
        var rs = ct.items.items, len = rs.length, r, i;

        if (!this.innerCt) {
            target.addClass('ux-row-layout-ct');
            this.innerCt = target.createChild({cls: 'x-row-inner'});
        }
        this.renderAll(ct, this.innerCt);

        var size = target.getViewSize();

        if (size.width < 1 && size.height < 1) { // display none?
            return;
        }

        var h = size.height - target.getPadding('tb'),
            ph = h;

        this.innerCt.setSize({height: h});

        // some rows can be percentages while others are fixed
        // so we need to make 2 passes

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (!r.rowHeight) {
                ph -= (r.getSize().height + r.getEl().getMargins('tb'));
            }
        }

        ph = ph < 0 ? 0 : ph;

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (r.rowHeight) {
                r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
            }
        }
    }

    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;
Ext.QuickTips.init();


Pvd.Nomina.Gestionarantiguedad.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar cargos ocupados (Tipo: Pvd.Nomina.Pagos.GestionarCargosOcupados.Modelo).
     */
    init: function (perfil, modelo, date) {
        this.idpersona = 0;
        this.identidad = null;
        this.idpersonacuentabancariamn = null;
        this.idpersonacuentabancariacuc = null;
        this.filasSeleccionadas = null;
        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnCargarPersonas = new Ext.Button({
            id: 'idbtnCargarEntidad',
            text: 'Aceptar',
            // tooltip: idioma.textToolTipGuardarNSist,
            icon: 'aceptar',
            iconCls: 'aceptar',
            prevTab: 'idbtnCargarEntidad',
            nextTab: 'idbtnCargarEntidad'
        });
        //Botón  para adicionar el cargo de la persona selecionada.
        this.btnGuardar = new Ext.Button({
            id: 'idbtnGuardar',
            text: 'Aplicar',
            // tooltip: idioma.btnAdicionarToolTip,
            iconCls: 'aplicar',
            //iconCls: 'btn',
            //disabled: true,
            //prevTab: 'idbtnEliminar',
            //nextTab: 'idbtnModificar'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
            //icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',

        });

        this.btnExportarExcel = new Ext.Button({
            disabled : false,
            id : 'btnExportarExcel',
            iconCls : 'exportar',
            text : 'Exportar',
            tooltip: 'Exportar'

        });

        this.btnBuscar = new Ext.Button({
            disabled: false,
            id: 'btnBuscar',
            //icon :'buscar',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar personas',

        });

        this.btnLimpiar = new Ext.Button({
            disabled: false,
            id: 'btnBuscar',
            //icon :'buscar',
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar filtros',

        });

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            minLength: 3,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar...',
            name: 'tfbuscador'

        });

        //Vista para el componente Buscar estructura
        this.winEstEntidades = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: '30%',
            constrain: true,
            closable: false,
            resizable: false,
            layout: 'fit',
            items: [this.pEstEntidades],
            buttons: [this.btnCargarPersonas]
        });

        this.pfichadelapersona = new Ext.pvd.persona.fichapersona.panelFichapersona({
            id: 'pfichadelapersona',
            region: 'north',
            idficha: 'pfichadelapers',
            height: 160,
            width: '50%',
            border: true,
            split: true,
            idCmp: 'pfichadelapersona'
        });
        this.tfMonto = new Ext.form.NumberField({
            name: 'montotal',
            width: '80%',
            id: 'nfMontoTotal',
            allowNegative: false,
            allowBlank: false

        });
        this.dfMes = new Ext.form.NumberField({
            name: 'mes',
            width: '80%',
            id: 'nfmes',
            allowNegative: false,
            maxValue: 11,
            allowBlank: false

        });

        this.tffecha = new Ext.form.DateField({
            format: 'd/m/Y',
            name: 'fecha',
            id: 'nffecha',
            readOnly: false,
            allowBlank: false,
            width: '80%'
          //  value: new Date().format('d/m/Y'),
        });

       /* this.dfFechaReg = new Ext.form.DateField({
            format: 'd/m/Y',
            name: 'fecharegistro',
            id: 'dfFechaReg',
            readOnly: false,
            allowBlank: false,
            anchor: '90%'

        });*/

        this.bgpPersonas = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            heigth: '50%',
            width: '100%',
            split: true,
            region: 'center',
            modulo: 'NOMINA',
            funcionalidad: 'CESP',
            identidad: this.idestructura,
            cantidadPorPaginas: 5000
        });

        this.checkReporte = new Ext.form.Checkbox({
            id: 'checkReporte',
            name: 'reporteantiguedad'
        });

        this.smPersonas = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.gpPersonas = new Ext.grid.EditorGridPanel({
            id: 'idgpPersonas',
            //title:'Personas',
            region: 'west',
            columns: [new Ext.grid.RowNumberer(),{header: 'CI', width: 200, dataIndex: 'numid', hidden: true}
                , {header: 'Cargo ', width: 300, dataIndex: 'cargo', renderer: cambiarColores}
                , {header: 'Nombre y apellidos', width: 200, dataIndex: 'nombreapellidos', renderer: cambiarColores}
                , {
                    header: 'Fecha de certificaci&oacute;n',
                    width: 150,
                    dataIndex: 'fechacert',
                    renderer: formatDate,
                    renderer: cambiarColores,
                    editor: this.tffecha
                }

                , {
                    header: 'Años de servicio',
                    width: 150,
                    sortable: true,
                    dataIndex: 'valor',
                    renderer: fnRenderExportar,
                    renderer: cambiarColores,
                    editor: this.tfMonto
                }
                , {
                    header: 'Meses de servicio',
                    width: 150,
                    sortable: true,
                    dataIndex: 'mesesservicio',
                    renderer: fnRenderExportar,
                    renderer: cambiarColores,
                    editor: this.dfMes
                }
                , {
                    header: 'Antiguedad en la entidad',
                    width: 150,
                    sortable: true,
                    dataIndex: 'annosserventidad',
                    renderer: cambiarColores
                }
                , {
                    header: 'Antiguedad general',
                    width: 150,
                    sortable: true,
                    dataIndex: 'antuguedad',
                    renderer: cambiarColores
                }, {
                    header: "Reporte Antiguedad",
                    dataIndex: 'reporteantiguedad',
                    width: 100,
                    editor: this.checkReporte,
                    renderer: cambiarColoresCheck
                }
                , {header: ' ', width: 100, dataIndex: 'identidad', hidden: true}
                , {header: ' ', width: 100, dataIndex: 'entidad', hidden: true}
                , {
                    header: 'Plantilla nominal', hidden: true, dataIndex: 'nombreplantilla',
                    renderer: function (val) {
                        var arrval = val.split("-");
                        return '<span style="color:green;">' + arrval[1] + '</span>';
                    }
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            layout: 'fit',
            width: '100%',
            heigth: 400,
            frame: true,
            clicksToEdit: 1,
            tbar: [this.btnExportarExcel,'|','Buscar persona:', this.tfbuscar, this.btnBuscar, this.btnLimpiar,'->',this.btnAyuda, this.btnGuardar],
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text}'
            }),
            store: modelo.stPersonas,
            sm: this.smPersonas,
            loadMask: {text: 'Cargando...'},
            bbar:new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.stPersonas,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });




        function fnRenderExportar(val) {

            return '<center>' + val + '<\center>';
        };

        function formatDate(value) {
            // console.info(value);
            return (value instanceof Date) ? value.format('d/m/Y') : value;

        };

        function cambiarColoresCheck(val, metaData, record, rowIndex, colIndex, store) {
            //console.info(val);
            var annos = record.data.antuguedad.split(" ")[0];
            var meses = record.data.antuguedad.split(" ")[3];
            if (record.data.antuguedad == null || record.data.antuguedad == 0 || record.data.antuguedad == '0 años y 0 meses') {
                if(val == true){
                    return '<center><span style="color:blue">' + 'Si' + '</span></center>';
                }else{
                    return '<center><span style="color:blue">' + 'No' + '</span></center>';
                }

            } else if (meses == "1" && annos == "1"
                || meses == "1" && annos == "5"
                || meses == "1" && annos == "10"
                || meses == "1" && annos == "15"
                || meses == "1" && annos == "20"
                || meses == "1" && annos == "25"
                || meses == "1" && annos == "30") {
                if(val == true){
                    return '<center><span style="color:red">' + 'Si' + '</span></center>';
                }else{
                    return '<center><span style="color:red">' + 'No' + '</span></center>';
                }

            } else {
                if(val == true){
                    return '<center><span style="color:green">' + 'Si' + '</span></center>';
                }else{
                    return '<center><span style="color:green">' + 'No' + '</span></center>';
                }

            }
        }

        function cambiarColores(val, metaData, record, rowIndex, colIndex, store) {
            var annos = record.data.antuguedad.split(" ")[0];
            var meses = record.data.antuguedad.split(" ")[3];
            if (record.data.antuguedad == null || record.data.antuguedad == 0 || record.data.antuguedad == '0 años y 0 meses') {
                return '<span style="color:blue">' + val + '</span>';
            } else if (meses == "1" && annos == "1"
                || meses == "1" && annos == "5"
                || meses == "1" && annos == "10"
                || meses == "1" && annos == "15"
                || meses == "1" && annos == "20"
                || meses == "1" && annos == "25"
                || meses == "1" && annos == "30") {
                return '<span style="color:red">' + val + '</span>';
            } else {
                return '<span style="color:green">' + val + '</span>';
            }
        }



        this.pEastFichaGpCargos = new Ext.Panel({
            region: 'center',
            layout: 'border',
            width: '100%',
            border: false,
            split: true,
            layout: 'ux.row',
            items: [{
                rowHeight: .25,
                width: '100%',
                border: false,
                split: true,
                layout: 'fit',
                items: [this.pfichadelapersona]
            }, {
                rowHeight: .75,
                width: '100%',
                border: false,
                split: true,
                layout: 'fit',
                items: [this.gpPersonas]
            }, /*{
             rowHeight: .20,
             width: '100%',
             border:false,
             split: true,
             collapsible:true,
             layout:'border',
             // items:[this.gpCuentaBanc,this.gpNumerocontable]
             },*/{
                rowHeight: .30,
                width: '100%',
                border: false,
                split: true,
                collapsible: true,
                layout: 'fit'
                // items:[this.gpTipopago]
            }]
        });

        this.winCargosOcupados = new Ext.Window({
            title: 'Ficha persona',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'border',
            items: [this.pEastFichaGpCargos]
        });

    }
};
UCID.portal.cargarEtiquetas('gestionarcertificaciondeannosservicios', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Nomina.Gestionarantiguedad.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Nomina.Gestionarantiguedad.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Gestionarantiguedad.Controlador.init(idioma, vista, modelo);
});