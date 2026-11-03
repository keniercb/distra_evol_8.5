/**
 * Configuracion de los elementos salariales a la persona.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona');
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
    onLayout     : function (ct, target) {
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
//Modelo
Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function (idioma) {

        this.smPersona = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.smCargos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.smSituacionSer = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });


        this.smElementoSalarial = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.filasSelecionadas = new Array();

        this.smConceptoSituacion = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

//        this.smConceptoSituacion = new Ext.grid.RowSelectionModel({
//            singleSelect: true,
//            listeners: {
//                rowselect: function (sm, index, rec) {
//                    this.conceptoseleccionado = rec;
//                    /*if(rec.data.idformacalculo == 3){
//                     this.CargarEscalasXConcepto(rec.data.idconceptpelementsalarialessituacionservicio, false);
//
//                     }else{
//                     LimpiarGridEscalasXConceptos();
//
//                     }*/
//                }.createDelegate(this)
//            }
//        });

        this.smEscalaXConceptoSituacion = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.storePersona = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/obtenerListadoPersonas',
            //////baseParams : {tipo: this.tipo, idelemento: -1},
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root         : "datos",
                id           : "idpersona"
            }, [
                {name: 'idpersona'}
                ,
                {name: 'numid'}
                ,
                {name: 'nombre'}
                ,
                {name: 'snombre'}
                ,
                {name: 'papel'}
                ,
                {name: 'sapel'}
                ,
                {name: 'idsexo'}
                ,
                {name: 'idcategoriapersona'}
            ])
        });

        this.storeCargos = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/obtenerListadoCargos',
            //////baseParams : {tipo: this.tipo, idelemento: -1},
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root         : "datos",
                id           : "idcargo"
            }, [
                {name: 'idcargo'}
                ,
                {name: 'denomcargo'}
                ,
                {name: 'idsituacionlaboral'}
                ,
                {name: 'denomsituacionlaboral'}
                ,
                {name: 'idcargosocupados'}
            ])
        });

        this.stSituacionServ = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/obtenerSituacionesServ',
            //////baseParams : {tipo: this.tipo, idelemento: -1},
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root         : "datos",
                id           : "idsituacionlaboral"
            }, [
                {name: 'idsituacionlaboral'}
                ,
                {name: 'denominacion'}
            ])
        });

        this.storeConceptoPDGridSituacion = new Ext.data.GroupingStore({
            url       : '/pvd/nomina/index.php/configelementosalarialpersona/obtenerListadoConceptosPagoDescuento',
            groupField: 'denomtipoconcepto',
            baseParams: {idelemento: -1, idcargosocupados: null},
            sortInfo  : {field: 'idtipoconcepto', direction: "DESC"},
            reader    : new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root         : "datos",
                id           : "idconceptpelementsalarialessituacionservicio"
            }, [
                {name: 'idconceptpelementsalarialessituacionservicio'}
                ,
                {name: 'idconceptopercepciondescuento'}
                ,
                {name: 'denomconceptopercepciondescuento'}
                ,
                {name: 'idtipoconcepto'}
                ,
                {name: 'denomtipoconcepto'}
                ,
                {name: 'idtarifa'}
                ,
                {name: 'idformacalculo'}
                ,
                {name: 'denomtarifa'}
                ,
                {name: 'importetarifa'}
                ,
                {name: 'fechainicio'}
                ,
                {name: 'fechafin'}
                ,
                {name: 'idcargo'}
            ])
        });

        this.storeEscalaXConceptoGridSituacion = new Ext.data.GroupingStore({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/obtenerListadoEscalas',
            params: {idconfconceptospdelementossalariales: -1},
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idescalaelementosalarialsituacionservicio"
            }, [
                {name: 'idescalaelementosalarialsituacionservicio'}
                ,
                {name: 'idescalatarifa'}
                ,
                {name: 'escala'}
                ,
                {name: 'idconceptopercepciondescuento'}
                ,
                {name: 'importe'}
                ,
                {name: 'fechainicio'}
                ,
                {name: 'fechafin'}
                ,
                {name: 'idconceptpelementsalarialessituacionservicio'}
            ])
        });

        this.storePeriodoPago = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/cargarPeriodoPago',
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idperiodopago"
            }, [
                {name: 'idperiodopago'},
                {name: 'denominacion'}
            ])
        });

        this.storeGrupoEscala = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/cargarGrupoEscala',
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idgrupoescala"
            }, [
                {name: 'idgrupoescala'},
                {name: 'denominacion'}
            ])
        });

        this.storeSector = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/cargarSectorSalarial',
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idsectorsalarial"
            }, [
                {name: 'idsectorsalarial'},
                {name: 'denominacion'}
            ])
        });

        this.storeEscalaSueldoCargo = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/cargarEscalaSueldoxCargo',
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idescalasueldocargo"
            }, [
                {name: 'idescalasueldocargo'},
                {name: 'denominacion'}
            ])
        });

        this.storeConceptoSituacion = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/cargarConceptospagodescuento',
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idconceptopercepciondescuento"
            }, [
                {name: 'idconceptopercepciondescuento'},
                {name: 'denominacion'}
            ])
        });

        this.storeTarifaSituacion = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/cargarTarifas',
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idtarifa"
            }, [
                {name: 'idtarifa'},
                {name: 'denomtarifa'}
            ])
        });

        this.storeElementoSalarial = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/obtenerListadoConfigElementoSalarial',
            //////baseParams : {tipo: this.tipo, idelemento: -1},
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root         : "datos",
                id           : "idelementosalarialsituacionservicio"
            }, [
                {name: 'idelementosalarialsituacionservicio'}
                ,
                {name: 'idsistemapago'}
                ,
                {name: 'sistemapago'}
                ,
                {name: 'idperiodopago'}
                ,
                {name: 'periodopago'}
                ,
                {name: 'idgrupoescala'}
                ,
                {name: 'grupoescala'}
                ,
                {name: 'idsectorsalarial'}
                ,
                {name: 'sectorsalarial'}
                ,
                {name: 'idescalasueldocargo'}
                ,
                {name: 'escalasueldocargo'}
                ,
                {name: 'importe'}
                ,
                {name: 'fechainicio'}
                ,
                {name: 'fechafin'}
                ,
                {name: 'idcargoocupado'}
                ,
                {name: 'idpersona'}
                ,
                {name: 'idsalarioespecifico'}
                ,
                {name: 'denominacioncargo'}
            ])
        });

        this.storeDenomCargo = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/obtenerListadoDenomCargo',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root         : "datos",
                id           : "idsalarioespecifico"
            }, [
                {name: 'idsalarioespecifico'}
                ,
                {name: 'denominacion'}
                ,
                {name: 'salario'}

            ])
        });

        this.storeSectorSalarial = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/configelementosalarialpersona/obtenerListadoSectoresSalariales',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root         : "datos",
                id           : "idsectorsalarial"
            }, [
                {name: 'idsectorsalarial'}
                ,
                {name: 'denominacion'}

            ])
        });

        this.storeCargoSalarioEspecifico = new Ext.data.Store({
            //  url: '/pvd/nomina/index.php/configelementosalarialpersona/cargarCargoSalarioEspecifico',
            autoLoad: true,
            reader  : new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idsalarioespecifico"
            }, [
                {name: 'idsalarioespecifico'},
                {name: 'denominacioncargo'}
            ])
        });
    }
};

//Vista
Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo).
     */
    init: function (perfil, idioma, modelo) {

        var self = this;
        this.idestructura = 0;
        this.idpersona = 0;
        this.idcargo = 0;
        this.cambio = 0;
        this.boton = 0;
        this.flag = 0;
        this.idsueldocargo = 0;
        this.idcargosocupados = 0;
        this.elementosalarialsalario = 0;
        this.accionElemento = 'Add';
        this.accionConcepto = 'Add';
        this.accionEscala = 'Add';
        this.conceptoseleccionado = "";
        this.identidadstore = 0;
        //this.idelemsalsituacion = 0;
        //self = this;

        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout       : 'border',
            region       : 'center',
            nivel        : 5,
            nivelchequear: 3

        });


        this.btnAceptarEntidad = new Ext.Button({
            id      : 'btnAceptarEntidad',
            text    : idioma.BtnAceptar,
            tooltip : idioma.lbBtnAceptar,
//            icon: perfil.dirImg + 'aceptar.png',
            disabled: true,
            iconCls : 'aceptar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler : function () {
            }.createDelegate(this)
        });

        /*
         * Botones del panel de elementos salariales a la situacion de la persona
         */
        this.btnAdicionarElementoSalarial = new Ext.Button({
            id      : 'btnAdicionarElementoSalarial',
            text    : idioma.btnAdicionarElementoSalarial,
            disabled: true,
            tooltip : idioma.textToolTipbtnAdicionarElementoSalarial,
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls : 'adicionar',
            prevTab : 'btnAyudaElementoSalarial',
            nextTab : 'btnModificarElementoSalarial'
        });

        this.btnModificarElementoSalarial = new Ext.Button({
            id      : 'btnModificarElementoSalarial',
            text    : idioma.btnModificarElementoSalarial,
            tooltip : idioma.textToolTipbtnModificarElementoSalarial,
            disabled: true,
//            icon: perfil.dirImg + 'modificar.png',
            iconCls : 'modificar',
            prevTab : 'btnAdicionarElementoSalarial',
            nextTab : 'btnEliminarElementoSalarial'
        });

        this.btnEliminarElementoSalarial = new Ext.Button({
            id      : 'btnEliminarElementoSalarial',
            text    : idioma.btnEliminarElementoSalarial,
            tooltip : idioma.textToolTipbtnEliminarElementoSalarial,
            disabled: true,
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls : 'eliminar',
            prevTab : 'btnModificarElementoSalarial',
            nextTab : 'btnAyudaElementoSalarial'
        });

        this.btnAyudaElementoSalarial = new Ext.Button({
            id     : 'btnAyudaElementoSalarial',
            text   : idioma.btnAyudaElementoSalarial,
            tooltip: idioma.textToolTipbtnAyudaElementoSalarial,
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnEliminarElementoSalarial',
            nextTab: 'btnAdicionarElementoSalarial',

        });

        /*
         * Botones del panel de conceptos a la situacion de la persona
         */
        this.btnAdicionarConceptoSituacion = new Ext.Button({
            text    : idioma.btnAdicionarConceptoSituacion,
            tooltip : idioma.textToolTipbtnAdicionarConceptoSituacion,
            id      : 'idbtnAdicionarConceptoSituacion',
//            icon: perfil.dirImg + 'adicionar.png',
            disabled: true,
            iconCls : 'adicionar',
            prevTab : 'idbtnEliminarConceptoSituacion',
            nextTab : 'idbtnModificarConceptoSituacion'
        });

        this.btnModificarConceptoSituacion = new Ext.Button({
            id      : 'idbtnModificarConceptoSituacion',
            text    : idioma.btnModificarConceptoSituacion,
            tooltip : idioma.textToolTipbtnModificarConceptoSituacion,
//            icon: perfil.dirImg + 'modificar.png',
            disabled: true,
            iconCls : 'modificar',
            prevTab : 'idbtnAdicionarConceptoSituacion',
            nextTab : 'idbtnEliminarConceptoSituacion'
        });

        this.btnEliminarConceptoSituacion = new Ext.Button({
            id      : 'idbtnEliminarConceptoSituacion',
            text    : idioma.btnEliminarConceptoSituacion,
            tooltip : idioma.textToolTipbtnEliminarConceptoSituacion,
//            icon: perfil.dirImg + 'eliminar.png',
            disabled: true,
            iconCls : 'eliminar',
            prevTab : 'idbtnModificarConceptoSituacion',
            nextTab : 'idbtnAdicionarConceptoSituacion'
        });

        /*
         * Botones del panel de escala de la situacion de la persona
         */
        this.btnAdicionarEscalaSituacion = new Ext.Button({
            text    : idioma.btnAdicionarEscalaSituacion,
            tooltip : idioma.textToolTipbtnAdicionarEscalaSituacion,
            id      : 'idbtnAdicionarEscalaSituacion',
//            icon: perfil.dirImg + 'adicionar.png',
            disabled: true,
            iconCls : 'adicionar',
            prevTab : 'idbtnEliminarEscalaSituacion',
            nextTab : 'idbtnModificarEscalaSituacion'
        });

        this.btnExportar = new Ext.Toolbar.MenuButton({
            text    : 'Exportar',
            tooltip : 'Exportar',
            iconCls : 'exportar',
           //disabled: true,
            menu    : {
                items: [
                    {
                        text      : 'Elementos salariales  configurados',
                        handler: function (items, p) {
                            var winload = new Ext.PVD.comun.window.winLoad({
                                title  : 'Por favor espere...',
                                mensaje: 'Generando reporte'
                            });
                            winload.showMask();
                            //?identidad=' + self.idestructura + '&idpersona=' + self.idpersona

                            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/configelementosalarialpersona/exportarelementossalnoconfig?identidad=' + self.idestructura);
                            winload.close();
                        }
                    }
                ]}
        });

        this.btnModificarEscalaSituacion = new Ext.Button({
            id      : 'idbtnModificarEscalaSituacion',
            text    : idioma.btnModificarEscalaSituacion,
            tooltip : idioma.textToolTipbtnModificarEscalaSituacion,
//            icon: perfil.dirImg + 'modificar.png',
            disabled: true,
            iconCls : 'modificar',
            prevTab : 'idbtnAdicionarEscalaSituacion',
            nextTab : 'idbtnEliminarEscalaSituacion'
        });

        this.btnEliminarEscalaSituacion = new Ext.Button({
            id      : 'idbtnEliminarEscalaSituacion',
            text    : idioma.btnEliminarEscalaSituacion,
            tooltip : idioma.textToolTipbtnEliminarEscalaSituacion,
//            icon: perfil.dirImg + 'eliminar.png',
            disabled: true,
            iconCls : 'eliminar',
            prevTab : 'idbtnModificarEscalaSituacion',
            nextTab : 'idbtnAdicionarEscalaSituacion'
        });

        this.btnAceptarSalarioEspecifico = new Ext.Button({
            id     : 'btnAceptar',
            tooltip: 'Guardar',
//            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'aceptar',
            text   : 'Guardar'
        });

        this.winEstructura = new Ext.Window({
            title    : idioma.lbTitleEntidades,
            modal    : true,
            height   : 350,
            width    : 300,
            constrain: true,
            closable : false,
            resizable: false,
            layout   : 'fit',
            items    : [this.pobjestructura],
            buttons  : [this.btnAceptarEntidad]
        });

        /*
         * Grid de personas
         */
        this.gpPersonas = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            heigth            : '50%',
            width             : '100%',
            split             : true,
            region            : 'center',
            modulo            : 'NOMINA',
            funcionalidad     : 'CESP',
            singleSelect     : false,
            identidad         : this.idestructura,
            cantidadPorPaginas: 5000
        });

        this.pfichadelapersona = new Ext.pvd.persona.fichapersona.panelFichapersona({
            id     : 'pfichadelapersona',
            region : 'north',
            idficha: 'pfichadelapers',
            width  : '100%',
            height : '30%',
            border : true,
            split  : true,
            idCmp  : 'pfichadelapersona'
        });

        this.gpCargos = new Ext.grid.GridPanel({
            id        : 'idgpCargos',
            title     : idioma.lbTitleListadoCargos,
            disabled  : true,
            region    : 'south',
            split     : true,
            border    : false,
            columns   : [
                {header: idioma.lbColNombreCargo, width: 300, sortable: true, dataIndex: 'denomcargo'}
                ,
                {header: idioma.lbColNombreSituacion, width: 300, sortable: true, dataIndex: 'denomsituacionlaboral'}
            ],
            stripeRows: true,
            autoScroll: true,
            width     : '100%',
            heigth    : '20%',
            viewConfig: {forceFit: true},
            store     : modelo.storeCargos,
            sm        : modelo.smCargos,
            loadMask  : {msg: 'Cargando'}
        });

        /*
         * Grid de elementos salariales a la situacion de la persona
         */
        this.gpElementoSalarial = new Ext.grid.GridPanel({
            id        : 'idgpElementoSalarial',
            title     : idioma.lbTitleElementoSalarialSituacion ,
            region    : 'center',
            layout    : 'fit',
            disabled  : true,
            border    : false,
            columns   : [//,{header: 'idtipo', hidden:true, width: 200, sortable: true, dataIndex: 'idtipo'}
                {header: 'idelementosalarialsituacionservicio', hidden: true, hideable: false, dataIndex: 'idelementosalarialsituacionservicio'}
                ,
                {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idsistemapago'}
                ,
                {header: 'Sistema de pago', width: 100, sortable: true, dataIndex: 'sistemapago'}
                ,
                {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idperiodopago'}
                ,
                {header: 'Per&iacute;odo de pago', width: 100, sortable: true, dataIndex: 'periodopago'}
                ,
                {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idgrupoescala'}
                ,
                {header: 'Grupo escala', hidden: true, width: 100, sortable: true, dataIndex: 'grupoescala'}
                ,
                {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idsectorsalarial'}
                ,
                {header: 'Sector salarial', hidden: true, width: 100, sortable: true, dataIndex: 'sectorsalarial'}
                ,
                {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idsalarioespecifico'}
                ,
                {header: 'Cargo salario espec&iacute;fico', hidden: true, width: 100, sortable: true, dataIndex: 'denominacioncargo'}
                ,
                {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idescalasueldocargo'}
                ,
                {header: 'Escala sueldo por cargo', width: 140, sortable: true, dataIndex: 'escalasueldocargo'}
                ,
                {header: 'Sueldo por cargo', width: 100, sortable: true, dataIndex: 'importe'}
                ,
                {header: 'Fecha inicio', width: 100, sortable: true, dataIndex: 'fechainicio'}
                ,
                {header: 'Fecha fin', width: 70, sortable: true, dataIndex: 'fechafin'}
                ,
                {header: 'idcargoocupado', hidden: true, width: 70, sortable: true, dataIndex: 'idcargoocupado'}
            ],
            stripeRows: true,
            autoScroll: true,
            width     : '100%',
            heigth    : 500,
            viewConfig: {forceFit: true},
            store     : modelo.storeElementoSalarial,
            sm        : modelo.smElementoSalarial,
            loadMask  : {msg: 'Cargando'}
        });

        /*
         * Grid de escalas de la situacion de la persona
         */
        this.gpEscalaXConceptoSituacion = new Ext.grid.GridPanel({
            id        : 'idgpEscalaXConceptoSituacion',
            title     : idioma.lbTitleEscalasSituacion,
            region    : 'center',
            layout    : 'fit',
            disabled  : true,
            columns   : [
                {header: 'idescalaelementosalarialsituacionservicio', hidden: true, hideable: false, dataIndex: 'idescalaelementosalarialsituacionservicio'}
                ,
                {header: 'idescalatarifa', hidden: true, hideable: false, dataIndex: 'idescalatarifa'}
                ,
                {header: 'idconceptopercepciondescuento', hidden: true, hideable: false, dataIndex: 'idconceptopercepciondescuento'}
                ,
                {header: 'Escala', fixed: true, width: 150, sortable: true, dataIndex: 'escala'}
                ,
                {header: 'Importe', fixed: true, width: 200, sortable: true, dataIndex: 'importe'}
                ,
                {header: 'Fecha inicio', fixed: true, width: 80, sortable: true, dataIndex: 'fechainicio'}
                ,
                {header: 'Fecha fin', fixed: true, width: 80, sortable: true, dataIndex: 'fechafin'}
                ,
                {header: 'idconceptpelementsalarialessituacionservicio', hidden: true, hideable: false, dataIndex: 'idconceptpelementsalarialessituacionservicio'}
            ],
            stripeRows: true,
            autoScroll: true,
            width     : '100%',
            heigth    : '100%',
            border    : false,
            viewConfig: {forceFit: true},
            store     : modelo.storeEscalaXConceptoGridSituacion,
            sm        : modelo.smEscalaXConceptoSituacion,
            loadMask  : {msg: 'Cargando'}
        });

        /*
         * Grid de conceptos de la situacion de la persona
         */
        this.gpConceptoSituacion = new Ext.grid.GridPanel({
            id        : 'idgpConceptoSituacion',
            title     : idioma.lbTitleConceptosSituacion,
            region    : 'center',
            layout    : 'fit',
            border    : false,
            disabled  : true,
            columns   : [ modelo.smConceptoSituacion,
                {header: 'idconceptpelementsalarialessituacionservicio', hidden: true, hideable: false, dataIndex: 'idconceptpelementsalarialessituacionservicio'}
                ,
                {header: 'idconceptopercepciondescuento', hidden: true, hideable: false, dataIndex: 'idconceptopercepciondescuento'}
                ,
                {header: 'Conceptos', width: 230, sortable: true, dataIndex: 'denomconceptopercepciondescuento'}
                ,
                {header: 'idtipoconcepto', hidden: true, hideable: false, dataIndex: 'idtipoconcepto'}
                ,
                {header: 'Tipo de concepto', hidden: true, hideable: false, dataIndex: 'denomtipoconcepto'}
                ,
                {header: 'idtarifa', hidden: true, hideable: false, dataIndex: 'idtarifa'}
                ,
                {header: 'idformacalculo', hidden: true, hideable: false, dataIndex: 'idformacalculo'}
                ,
                {header: 'Tarifa', width: 60, sortable: true, dataIndex: 'denomtarifa'}
                ,
                {header: 'Importe', width: 60, sortable: true, dataIndex: 'importetarifa'}
                ,
                {header: 'fechainicio', hidden: true, hideable: false, dataIndex: 'fechainicio'}
                ,
                {header: 'fechafin', hidden: true, hideable: false, dataIndex: 'fechafin'}
                ,
                {header: 'idcargo', hidden: true, hideable: false, dataIndex: 'idcargo'}
            ],
            stripeRows: true,
            autoScroll: true,
            width     : '100%',
            heigth    : '100%',
            viewConfig: {forceFit: true},
            view      : new Ext.grid.GroupingView({
                forceFit    : true,
                groupTextTpl: '{text}'
            }),
            store     : modelo.storeConceptoPDGridSituacion,
            sm        : modelo.smConceptoSituacion,
            loadMask  : {msg: 'Cargando'},
            bbar      : new Ext.PagingToolbar({
                pageSize   : 1000,
                store      : modelo.storeConceptoPDGridSituacion,
                displayInfo: true,
                displayMsg : 'Mostrando  {0} - {1} de {2}',
                emptyMsg   : "0 Resultado a mostrar"
            })
        });

        /*
         *Paneles(general, izquierdo, tab con dos paneles de los cuales el derecho tiene tres paneles mas)
         */
        this.panelPersonasCargos = new Ext.Panel({
            id    : 'idpanelPersonasCargos',
            //layout: 'border',
            region: 'west',
            height: '100%',
            width : '50%',
            split : true,
            border: true,
            layout: 'ux.row',
            items : [
                {
                    rowHeight: .30,
                    width    : '100%',
                    border   : false,
                    split    : true,
                    layout   : 'fit',
                    items    : [this.pfichadelapersona]
                },
                {
                    rowHeight: .40,
                    width    : '100%',
                    border   : false,
                    split    : true,
                    layout   : 'fit',
                    items    : [this.gpPersonas]
                },
                {
                    rowHeight  : .30,
                    width      : '100%',
                    border     : false,
                    split      : true,
                    collapsible: true,
                    layout     : 'fit',
                    items      : [this.gpCargos]
                }
            ]
        });


        this.pconceptosescala = new Pvd.Nomina.gpconceptosescalacomp({
            tipo    : 2,
            region  : 'center',
            height  : '50%',
            width   : '50%',
            split   : true,
            border  : false,
            posicion: 2
        });

        this.panelCenter = new Ext.Panel({
            id    : 'idpanelCenter',
            region: 'center',
            height: '30%',
            width : '100%',
            layout: 'border',
            split : true,
            border: true,
            tbar  : [this.btnAdicionarConceptoSituacion, this.btnModificarConceptoSituacion, this.btnEliminarConceptoSituacion],
            items : [this.gpConceptoSituacion]
        });

        this.panelSouth = new Ext.Panel({
            id    : 'panelSouth',
            region: 'south',
            height: '30%',
            width : '100%',
            layout: 'border',
            border: true,
            split : true,
            tbar  : [this.btnAdicionarEscalaSituacion, this.btnModificarEscalaSituacion, this.btnEliminarEscalaSituacion],
            items : [this.gpEscalaXConceptoSituacion]
        });

        this.panelNorth = new Ext.Panel({
            //id: 'panelNorth',
            region: 'center',
            height: '50%',
            width : '50%',
            layout: 'border',
            border: true,
            split : true,
            tbar  : [this.btnAdicionarElementoSalarial, this.btnModificarElementoSalarial, this.btnEliminarElementoSalarial],
            keys  : [
                {
                    //Adicionar
                    key      : 'i',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAdicionarElementoSalarial.handler();
                    }
                },
                {
                    //Modificar
                    key      : 'm',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnModificarElementoSalarial.disabled) {
                            self.btnModificarElementoSalarial.handler();
                        }

                    }
                },
                {
                    //Eliminar
                    key      : Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnEliminarElementoSalarial.disabled) {
                            self.btnEliminarElementoSalarial.handler();
                        }
                    }
                }
            ],
            items : [this.gpElementoSalarial]
        });
        this.cbSectoralarialBuscar = new Ext.form.ComboBox({id: 'tfSectoralarialBuscar', fieldLabel: 'Sector salarial',
            tabIndex                                          : 1, valueField: 'idsectorsalarial',
            displayField                                      : 'denominacion', hiddenName: 'idsectorsalarial',
            allowBlank                                        : false, mode: 'local',
            prevTab                                           : 'cbSectoralarialBuscar',
            nextTab                                           : 'cbDenomCargo',
            store                                             : modelo.storeSectorSalarial, emptyText: 'Seleccione...',
            blankText                                         : idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction                                     : 'all', anchor: '90%'
        });

        //Combo Grupo Escala
        this.cbGrupoEscala = new Ext.form.ComboBox({id: 'idcbGrupoEscala', fieldLabel: idioma.lbColcbGrupoEscala,
            tabIndex                                  : 1, valueField: 'idgrupoescala',
            displayField                              : 'denominacion',
            allowBlank                                : false, mode: 'local',
            store                                     : modelo.storecbGrupoEscala,
            emptyText                                 : 'Seleccione...',
            // prevTab: 'idtfGrupoEscala',
            // nextTab: 'idcbEscalaSueldoCargo',
            blankText                                 : idioma.lbErrorCampoVacio, readOnly: true,
            disabled                                  : true,
            triggerAction                             : 'all', anchor: '90%'
        });

        //Combo Sector Salarial
        this.cbSector = new Ext.form.ComboBox({id: 'idcbSector', fieldLabel: idioma.lbColcbSectorSalarial,
            tabIndex                             : 1, valueField: 'idsectorsalarial',
            displayField                         : 'denominacion',
            allowBlank                           : false, mode: 'local',
            store                                : modelo.storeSector,
            emptyText                            : 'Seleccione...',
            // prevTab: 'idtfGrupoEscala',
            // nextTab: 'idcbEscalaSueldoCargo',
            blankText                            : idioma.lbErrorCampoVacio, readOnly: true,
            disabled                             : true,
            triggerAction                        : 'all', anchor: '90%'
        });

        //Combo salario Especifico
        this.cbCargoSalarioEspecifico = new Ext.form.ComboBox({id: 'idcbCargoSalarioEspecifico', fieldLabel: idioma.lbColcbCargoSalarioEspecifico,
            tabIndex                                             : 1, valueField: 'idsalarioespecifico',
            displayField                                         : 'denominacioncargo',
            allowBlank                                           : false, mode: 'local',
            store                                                : modelo.storeCargoSalarioEspecifico,
            emptyText                                            : 'Seleccione...',
            // prevTab: 'idcbSector',
            //nextTab: 'nfSueldoCargo',
            blankText                                            : idioma.lbErrorCampoVacio, readOnly: true,
            disabled                                             : true,
            triggerAction                                        : 'all', anchor: '90%'
        });

        this.cbDenomCargo = new Ext.form.ComboBox({id: 'cbDenomCargo', fieldLabel: 'Cargo',
            tabIndex                                 : 1, valueField: 'idsalarioespecifico',
            displayField                             : 'denominacion', hiddenName: 'idsalarioespecifico',
            allowBlank                               : false, mode: 'local',
            prevTab                                  : 'cbSectoralarialBuscar',
            nextTab                                  : 'nfSueldoporcargo',
            store                                    : modelo.storeDenomCargo, emptyText: 'Seleccione...',
            blankText                                : idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction                            : 'all', anchor: '90%'
        });

        this.nfSueldoporcargo = new Ext.form.NumberField({id: 'nfSueldoporcargo', fieldLabel: 'Sueldoporcargo',
            readOnly                                        : true, tabIndex: 2, name: 'importe', allowBlank: true, anchor: '90%'
        });
        this.formularioSueldoCargo = new Ext.FormPanel({
            labelAlign : 'top',
            frame      : true,
            height     : '50%',
            width      : '50%',
            border     : false,
            region     : 'center',
            buttonAlign: 'right',
            buttons    : [this.btnAceptarSalarioEspecifico],
            layout     : 'fit',
            //autoHeight: true,
            bodyStyle  : {
                padding: '10px 10px 10px 10px'
            },
            items      : [
                {layout  : 'column',
                    items: [
                        {columnWidth: .30, layout: 'form', items: [this.cbSectoralarialBuscar]},
                        {columnWidth: .30, layout: 'form', items: [this.cbDenomCargo]},
                        {columnWidth: .30, layout: 'form', items: [this.nfSueldoporcargo]}
                    ]
                }
            ]
        });

        this.panelSueldocargo = new Ext.Panel({
            region  : 'center',
            height  : '50%',
            width   : '50%',
            layout  : 'border',
            border  : false,
            disabled: true,
            split   : true,
            items   : [this.formularioSueldoCargo]
        });

        this.panelGeneral = new Ext.Panel({
            id    : 'idpanelGeneral',
            //layout: 'border',
            region: 'center',
            height: '100%',
            width : '50%',
            split : true,
            border: true,
            layout: 'ux.row',
            items : [
                {
                    rowHeight: .30,
                    width    : '100%',
                    border   : false,
                    layout   : 'fit',
                    items    : [this.panelNorth]
                },
                {
                    rowHeight: .40,
                    width    : '100%',
                    border   : false,
                    layout   : 'fit',
                    items    : [this.panelCenter]
                },
                {
                    rowHeight  : .30,
                    width      : '100%',
                    border     : false,
                    collapsible: true,
                    layout     : 'fit',
                    items      : [this.panelSouth]
                }
            ]
        });


        this.tpConceptosPersonaSituacion = new Ext.TabPanel({
            width            : 50,
            region           : 'center',
            activeTab        : 0,
            layoutOnTabChange: true,
            border           : false,
            hideBorders      : true,
            tbar             : ['->',this.btnExportar, this.btnAyudaElementoSalarial],
            frame            : true,
            items            : [
                {
                    id    : 'tabConceptosPersona',
                    title : idioma.lbTitleConceptosPersona,
                    layout: 'border',
                    region: 'center',
                    items : [this.pconceptosescala]
                },
                {
                    id    : 'tabConceptosSituacionServicio',
                    title : idioma.lbTitleConceptosServicio,
                    layout: 'border',
                    region: 'center',
                    items : [this.panelGeneral]
                }/*,
                 {
                 id    : 'tabSueldoporcargo',
                 title : 'Sueldo por cargo',
                 layout: 'fit',
                 region: 'center',
                 items : [this.panelSueldocargo]
                 }*/
            ]
        });


        this.pConceptosPersonaSituacion = new Ext.Panel({
            region: 'center',
            height: 300,
            width : '50%',
            split : true,
            layout: 'border',
            items : [this.tpConceptosPersonaSituacion]
        });
        /*
         * Items del formulario de elemento salarial a la situacion del servicio
         */
        this.cbPeriodoPago = new Ext.form.ComboBox({id: 'idcbPeriodoPago', fieldLabel: idioma.lbColcbPeriodopago,
            tabIndex                                  : 1, valueField: 'idperiodopago',
            displayField                              : 'denominacion', hiddenName: 'idperiodopago',
            allowBlank                                : false, mode: 'local',
            prevTab                                   : 'idcbSistemaPago',
            nextTab                                   : 'idcbGrupoEscala',
            store                                     : modelo.storePeriodoPago, emptyText: 'Seleccione...',
            blankText                                 : idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction                             : 'all', anchor: '90%'
        });

        this.cbSistemaPago = new Ext.components.TreeComboBox({
            anchor    : "90%",
            fieldLabel: idioma.lbColcbSistemapago,
            id        : 'idcbSistemaPago',
            prevTab   : 'btnAyudaTipoN',
            nextTab   : 'idcbPeriodoPago',
            allowBlank: false,
            treeConfig: {
                rootVisible: false,
                loader     : new Ext.tree.TreeLoader({
                    dataUrl        : '/pvd/nomina/index.php/configelementosalarialpersona/cargarSistemaPago',
                    preloadChildren: false,
                    listeners      : {
                        beforeload: function (treeLoader, node, response) {
                            this.cbSistemaPago.reset();
                            treeLoader.baseParams.idnodo = node.attributes.idnodo;
                            //treeLoader.baseParams.idconfiguracion = this.idconfiguracion;
                        }.createDelegate(this)
                    }
                }),
                border     : false,
                autoScroll : true,
                root       : new Ext.tree.AsyncTreeNode({
                    id       : '-1',
                    text     : 'Arbol',
                    idnodo   : '-1',
                    animate  : false,
                    draggable: false,
                    expanded : false
                }),
                listeners  : {
                    click: function (node, e) {
                        this.cambio = 1;
                    }
                }
            }
        });

        this.cbGrupoEscala = new Ext.form.ComboBox({id: 'idcbGrupoEscala', fieldLabel: idioma.lbColcbGrupoEscala,
            tabIndex                                  : 1, valueField: 'idgrupoescala',
            displayField                              : 'denominacion', hiddenName: 'idgrupoescala',
            allowBlank                                : false, mode: 'local',
            store                                     : modelo.storeGrupoEscala,
            emptyText                                 : 'Seleccione...',
            prevTab                                   : 'idcbPeriodoPago',
            nextTab                                   : 'idcbSector',
            blankText                                 : idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction                             : 'all', anchor: '90%'
        });

        this.cbSector = new Ext.form.ComboBox({id: 'idcbSector', fieldLabel: idioma.lbColcbSectorSalarial,
            tabIndex                             : 1, valueField: 'idsectorsalarial',
            displayField                         : 'denominacion', hiddenName: 'idsectorsalarial',
            allowBlank                           : false, mode: 'local',
            store                                : modelo.storeSector,
            emptyText                            : 'Seleccione...',
            prevTab                              : 'idcbGrupoEscala',
            nextTab                              : 'idcbEscalaSueldoCargo',
            blankText                            : idioma.lbErrorCampoVacio, readOnly: true,
            disabled                             : true,
            triggerAction                        : 'all', anchor: '90%'
        });

        this.cbEscalaSueldoCargo = new Ext.form.ComboBox({id: 'idcbEscalaSueldoCargo', fieldLabel: idioma.lbColcbEscalaSueldoCargo,
            tabIndex                                        : 1, valueField: 'idescalasueldocargo',
            displayField                                    : 'denominacion', hiddenName: 'idescalasueldocargo',
            allowBlank                                      : false, mode: 'local',
            store                                           : modelo.storeEscalaSueldoCargo,
            emptyText                                       : 'Seleccione...',
            prevTab                                         : 'idcbSector',
            nextTab                                         : 'nfSueldoCargo',
            blankText                                       : idioma.lbErrorCampoVacio, readOnly: true,
            //disabled: true,
            triggerAction                                   : 'all', anchor: '90%'
        });

        this.nfSueldoCargo = new Ext.form.NumberField({id: 'nfSueldoCargo', fieldLabel: idioma.lbColImporte,
            tabIndex                                     : 2, name: 'nfSueldoCargo', allowBlank: true, anchor: '90%',
            prevTab                                      : 'idcbEscalaSueldoCargo',
            nextTab                                      : 'iddfFInicioElemento'
            //disabled: true,
        });

        this.dfFInicioElemento = new Ext.form.DateField({id: 'iddfFInicioElemento', fieldLabel: idioma.lbColDesdeElemento,
            tabIndex                                       : 3, name: 'fechainicio', allowBlank: false,
            format                                         : 'd/m/Y', editable: true, readOnly: false,
            value                                          : new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText                                        : idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText                                    : idioma.invalidTextFecha, vtype: 'daterange',
            prevTab                                        : 'nfSueldoCargo',
            nextTab                                        : 'iddfFFinElemento',
            anchor                                         : '90%', endDateField: 'iddfFFinTipoN'
        });

        this.dfFFinElemento = new Ext.form.DateField({id: 'iddfFFinTipoN', fieldLabel: idioma.lbColHastaElemento,
            tabIndex                                    : 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format                                      : 'd/m/Y', editable: true, readOnly: false,
            maxText                                     : idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            invalidText                                 : idioma.invalidTextFecha,
            prevTab                                     : 'iddfFInicioElemento',
            nextTab                                     : 'idbtnCancelarElemento',
            vtype                                       : 'daterange', anchor: '90%', startDateField: 'iddfFInicioElemento'
        });

        this.checkTodasPersoServicios = new Ext.form.Checkbox({id: 'checkTodasPersoServicios',
            fieldLabel                                           : 'Todas las personas',
            tabIndex                                             : 1,
            name                                                 : 'todoscargos',
            anchor                                               : '90%'
        });

        this.cbCategoria = new Ext.components.TreeComboBox({
            anchor    : "99%",
            blankText : 'Este campo es obligatorio',
            fieldLabel: 'Categoría persona',
            id        : 'idcbCategoria',
            // prevTab: 'idbtnEliminarEscala',
            //nextTab: 'idnfImporte',
            treeConfig: {
                rootVisible: false,
                loader     : new Ext.tree.TreeLoader({
                    dataUrl        : '/pvd/persona/projects/basetecnologica/index.php/basetecnologica/getCategorias',
                    preloadChildren: false,
                    listeners      : {
                        beforeload: function (treeLoader, node, response) {
                            this.cbCategoria.reset();
                            // this.cbEscala.disable();
                            // treeLoader.baseParams.idtipoconceptopd = this.conceptoseleccionado.data.idtipoconceptopd;
                            //  treeLoader.baseParams.idconfconceptopercepciondescuento = this.conceptoseleccionado.data.idconfconceptospdelementossalariales;
                            // treeLoader.baseParams.idtarifa = this.conceptoseleccionado.data.idtarifa;
                            //  treeLoader.baseParams.tipo = this.tipo;
                        }.createDelegate(this),
                        load      : function (treeLoader, node, response) {
                            //  this.cbEscala.enable();

                        }.createDelegate(this)

                    }
                }),
                border     : false,
                autoScroll : true,
                listeners  : {
                    click: function (node, e) {
                        // console.info(node);
                        self.cambio = 1;
                    }
                }
            }
        });
        this.cbCategoriaPersona = new Ext.components.TreeComboBox({
            anchor    : "99%",
            allowBlank: true,
            blankText : 'Este campo es obligatorio',
            fieldLabel: 'Categoría persona',
            id        : 'idcbCategoriaPersona',
            // prevTab: 'idbtnEliminarEscala',
            //nextTab: 'idnfImporte',
            treeConfig: {
                rootVisible: false,
                loader     : new Ext.tree.TreeLoader({
                    dataUrl        : '/pvd/persona/projects/basetecnologica/index.php/basetecnologica/getCategorias',
                    preloadChildren: false,
                    listeners      : {
                        beforeload: function (treeLoader, node, response) {
                            this.cbCategoriaPersona.reset();
                            // this.cbEscala.disable();
                            // treeLoader.baseParams.idtipoconceptopd = this.conceptoseleccionado.data.idtipoconceptopd;
                            //  treeLoader.baseParams.idconfconceptopercepciondescuento = this.conceptoseleccionado.data.idconfconceptospdelementossalariales;
                            // treeLoader.baseParams.idtarifa = this.conceptoseleccionado.data.idtarifa;
                            //  treeLoader.baseParams.tipo = this.tipo;
                        }.createDelegate(this),
                        load      : function (treeLoader, node, response) {
                            //  this.cbEscala.enable();

                        }.createDelegate(this)

                    }
                }),
                border     : false,
                autoScroll : true,
                listeners  : {
                    click: function (node, e) {
                        // console.info(node);
                        self.cambio = 1;
                    }
                }
            }
        });

        /*
         * Formulario de elemento salarial a la situacion del servicio
         */
        this.formularioElemento = new Ext.FormPanel({
            id        : 'idformlarioElemento',
            labelAlign: 'top',
            frame     : true,
            width     : 460,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px'
            },
            items     : [
                {layout  : 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.cbSistemaPago]},
                        {columnWidth: .5, layout: 'form', items: [this.cbPeriodoPago]},
                    ]
                },
                {layout  : 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.cbEscalaSueldoCargo]},
                        {columnWidth: .5, layout: 'form', items: [this.nfSueldoCargo]},
                        //  {columnWidth: .33, layout: 'form', items: [this.cbGrupoEscala]},
                        //  {columnWidth: .33, layout: 'form', items: [this.cbSector]},
                        /* {columnWidth: .22, layout: 'form'*//*, items: [this.checkTodasPersoServicios]*//*},*/
                        // {columnWidth: .3, layout: 'form', items: [this.cbCategoria]}
                    ]
                },
                {layout  : 'column',
                    items: [

                        // {columnWidth: .25, layout: 'form', items: [this.cbCargoSalarioEspecifico]},
                        // {columnWidth: .25, layout: 'form', items: [this.nfSueldoCargo]},
                        {columnWidth: .5, layout: 'form', items: [this.dfFInicioElemento]},
                        {columnWidth: .5, layout: 'form', items: [this.dfFFinElemento]}
                    ]
                }
            ]
        });

        /*
         * Botones de la ventana de elemento salarial a la situacion del servicio
         */
        this.btnCancelarElemento = new Ext.Button({
            id     : 'idbtnCancelarElemento',
            iconCls: 'cancelar',
//            icon: perfil.dirImg + 'cancelar.png',
            text   : idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'iddfFFinElemento',
            nextTab: 'idbtnAplicarElemento'
        });

        this.btnAplicarElemento = new Ext.Button({
            id     : 'idbtnAplicarElemento',
            iconCls: 'aplicar',
//            icon: perfil.dirImg + 'aplicar.png',
            text   : idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarElemento',
            nextTab: 'idbtnAceptarElemento'
        });

        this.btnAceptarElemento = new Ext.Button({
            id     : 'idbtnAceptarElemento',
            iconCls: 'aceptar',
//            icon: perfil.dirImg + 'aceptar.png',
            text   : idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarElemento',
            nextTab: 'idtfDenomElemento'
        });

        //Ventana del elemento salarial a la situacion del servicio.
        this.ventanaElemento = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            closable   : true,
            constrain  : true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.formularioElemento],
            buttons    : [this.btnCancelarElemento, this.btnAplicarElemento, this.btnAceptarElemento]
        });

        /*
         * Items del formulario de conceptos de la situacion del servicio
         */
        this.cbConceptoSituacion = new Ext.form.ComboBox({id: 'idcbConceptoSituacion',
            fieldLabel                                      : idioma.lbColcbConcepto,
            tabIndex                                        : 1, valueField: 'idconceptopercepciondescuento',
            displayField                                    : 'denominacion', hiddenName: 'idconceptopercepciondescuento',
            allowBlank                                      : false, mode: 'local',
            store                                           : modelo.storeConceptoSituacion,
            emptyText                                       : 'Seleccione...',
            blankText                                       : 'Este campo es obligatorio', readOnly: true,
            emptyText                                       : 'Seleccione...',
            prevTab                                         : 'idbtnEliminarConceptoSituacion',
            nextTab                                         : 'idcbTarifaSituacion',
            triggerAction                                   : 'all', anchor: '90%'
        });

        this.cbTarifaSituacion = new Ext.form.ComboBox({id: 'idcbTarifaSituacion',
            fieldLabel                                    : idioma.lbColcbTarifa,
            tabIndex                                      : 1, valueField: 'idtarifa',
            displayField                                  : 'denomtarifa', hiddenName: 'idtarifa',
            allowBlank                                    : false, mode: 'local',
            store                                         : modelo.storeTarifaSituacion,
            emptyText                                     : 'Seleccione...',
            blankText                                     : 'Este campo es obligatorio', readOnly: true,
            emptyText                                     : 'Seleccione...',
            disabled                                      : true,
            prevTab                                       : 'idcbConceptoSituacion',
            nextTab                                       : 'iddfFInicioConceptoSituacion',
            triggerAction                                 : 'all', anchor: '90%'
        });

        this.checkTodosCargos = new Ext.form.Checkbox({id: 'idcheckTodosCargos',
            fieldLabel                                   : 'Todas las personas',
            tabIndex                                     : 1,
            name                                         : 'todoscargos',
            anchor                                       : '90%'
        });

        this.dfFInicioConceptoSituacion = new Ext.form.DateField({id: 'iddfFInicioConceptoSituacion',
            fieldLabel                                              : idioma.lbColDesdeConcepto,
            tabIndex                                                : 3, name: 'fechainicio', allowBlank: false,
            format                                                  : 'd/m/Y', editable: true, readOnly: false,
            value                                                   : new Date().format('d/m/Y'), maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText                                                 : 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            blankText                                               : 'Este campo es obligatorio.',
            invalidText                                             : 'Formato: dd/mm/aaaa.', vtype: 'daterange',
            prevTab                                                 : 'idcbTarifaSituacion',
            nextTab                                                 : 'iddfFFinConceptoSituacion',
            anchor                                                  : '90%', endDateField: 'iddfFFinConceptoSituacion'
        });

        this.dfFFinConceptoSituacion = new Ext.form.DateField({id: 'iddfFFinConceptoSituacion',
            fieldLabel                                           : idioma.lbColHastaConcepto,
            tabIndex                                             : 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format                                               : 'd/m/Y', editable: true, readOnly: false,
            maxText                                              : 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText                                              : 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            invalidText                                          : 'Formato: dd/mm/aaaa.',
            prevTab                                              : 'iddfFInicioConceptoSituacion',
            nextTab                                              : 'idbtnCancelarConceptoSituacion',
            vtype                                                : 'daterange', anchor: '90%', startDateField: 'iddfFInicioConceptoSituacion'
        });

        /*
         * Items del formulario de conceptos de la situacion del servicio
         */
        this.formularioConceptoSituacion = new Ext.FormPanel({
            id        : 'idformularioConceptoSituacion',
            labelAlign: 'top',
            frame     : true,
            width     : 600,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px'
            },
            items     : [
                {layout  : 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.cbConceptoSituacion]},
                        {columnWidth: .5, layout: 'form', items: [this.cbTarifaSituacion]},
                        //{columnWidth: .3, layout: 'form', items: [this.cbCategoriaPersona]}
                        // {columnWidth: .20, layout: 'form', items: [this.checkTodosCargos]}
                    ]
                },
                {layout  : 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioConceptoSituacion]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinConceptoSituacion]}
                    ]
                }
            ]
        });

        /*
         * Botones de la ventana de conceptos de la situacion del servicio
         */
        this.btnCancelarConceptoSituacion = new Ext.Button({
            id     : 'idbtnCancelarConceptoSituacion',
            iconCls: 'cancelar',
//            icon: perfil.dirImg + 'cancelar.png',
            text   : idioma.lbBtnCancelarConceptoSituacion,
            tooltip: idioma.textToolTipCancelarConceptoSituacion,
            prevTab: 'dfFFinConceptoSituacion',
            nextTab: 'idbtnAplicarConceptoSituacion'
        });

        this.btnAplicarConceptoSituacion = new Ext.Button({
            id     : 'idbtnAplicarConceptoSituacion',
            iconCls: 'aplicar',
//            icon: perfil.dirImg + 'aplicar.png',
            text   : idioma.lbBtnAplicarConceptoSituacion,
            tooltip: idioma.textToolTipAplicarConceptoSituacion,
            prevTab: 'btnCancelarConceptoSituacion',
            nextTab: 'idbtnAceptarConceptoSituacion'

        });

        this.btnAceptarConceptoSituacion = new Ext.Button({
            id     : 'idbtnAceptarConceptoSituacion',
            iconCls: 'aceptar',
//            icon: perfil.dirImg + 'aceptar.png',
            text   : idioma.lbBtnAceptarConceptoSituacion,
            tooltip: idioma.textToolTipAceptarConceptoSituacion,
            prevTab: 'idbtnAplicarConceptoSituacion',
            nextTab: 'idgpConceptoSituacion'

        });

        /*
         * Ventana de conceptos de la situacion del servicio
         */
        this.ventanaConceptoSituacion = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            closable   : true,
            constrain  : true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.formularioConceptoSituacion],
            buttons    : [this.btnCancelarConceptoSituacion, this.btnAplicarConceptoSituacion, this.btnAceptarConceptoSituacion]
        });

        this.checkTodosPersonasEliminar = new Ext.form.Checkbox({id: 'checkTodosPersonasEliminar',
            fieldLabel                                             : 'Todas las personas',
            tabIndex                                               : 1,
            name                                                   : 'todoseliminar',
            width                                                  : 140,
//            anchor                                                 : '100%'
        });

        /*
         * Items del formulario de eliminar conceptos de la situacion del servicio
         */
        this.formularioEliminarConceptoSituacion = new Ext.FormPanel({
            id        : 'formularioEliminarConceptoSituacion',
            labelAlign: 'left',
            frame     : true,
            width     : 140,
            autoHeight: true,
            bodyStyle : {
                padding: '5px 5px 5px 5px'
            },
            items     : this.checkTodosPersonasEliminar
        });

        /*
         * Botones de la ventana de eliminar conceptos de la situacion del servicio
         */
        this.btnCancelarEliminarConceptoSituacion = new Ext.Button({
            id     : 'btnCancelarEliminarConceptoSituacion',
            iconCls: 'cancelar',
//            icon: perfil.dirImg + 'cancelar.png',
            text   : 'Cancelar',
            tooltip: 'Cancelar',
            prevTab: 'dfFFinConceptoSituacion',
            nextTab: 'idbtnAplicarConceptoSituacion'
        });

        this.btnAceptarEliminarConceptoSituacion = new Ext.Button({
            id     : 'btnAceptarEliminarConceptoSituacion',
            iconCls: 'aceptar',
//            icon: perfil.dirImg + 'aceptar.png',
            text   : 'Aceptar',
            tooltip: 'Aceptar',
            prevTab: 'idbtnAplicarConceptoSituacion',
            nextTab: 'idgpConceptoSituacion'

        });

        /*
         * Ventana de eliminar conceptos de la situacion del servicio
         */
        this.ventanaEliminarConceptoSituacion = new Ext.Window({
            modal      : true,
            title      : 'Eliminar concepto de percepci&oacute;n y descuento',
            closeAction: 'hide',
            autoHeight : true,
            constrain  : true,
            closable   : true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.formularioEliminarConceptoSituacion],
            buttons    : [this.btnCancelarEliminarConceptoSituacion, this.btnAceptarEliminarConceptoSituacion]
        });

        /*
         * Items del formulario de conceptos de la situacion del servicio
         */
        this.cbEscalaSituacion = new Ext.components.TreeComboBox({
            anchor    : "90%",
            allowBlank: false,
            blankText : 'Este campo es obligatorio',
            fieldLabel: idioma.lbColcbEscalaSituacion,
            id        : 'idcbEscalaSituacion',
            prevTab   : 'idbtnEliminarEscalaSituacion',
            nextTab   : 'idnfImporteSituacion',
            treeConfig: {
                rootVisible: false,
                loader     : new Ext.tree.TreeLoader({
                    dataUrl        : '/pvd/nomina/index.php/configelementosalarialpersona/obtenerListadoEscalaXConcepto',
                    preloadChildren: false,
                    listeners      : {
                        beforeload: function (treeLoader, node, response) {
                            this.cbEscalaSituacion.reset();
                            this.cbEscalaSituacion.disable();
                            treeLoader.baseParams.idconceptopercepciondescuento = this.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptopercepciondescuento');
                            treeLoader.baseParams.idconfconceptopercepciondescuento = this.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptpelementsalarialessituacionservicio');
                            treeLoader.baseParams.idtarifa = this.gpConceptoSituacion.getSelectionModel().getSelected().get('idtarifa');
                            //treeLoader.baseParams.tipo = 0;
                        }.createDelegate(this),
                        load      : function (treeLoader, node, response) {
                            this.cbEscalaSituacion.enable();

                        }.createDelegate(this)

                    }
                }),
                border     : false,
                autoScroll : true,
                listeners  : {
                    click: function (node, e) {
                        this.cambio = 1;
                    }
                }
            }
        });
        this.nfImporteSituacion = new Ext.form.TextField({id: 'idnfImporteSituacion', fieldLabel: idioma.lbColcbImporteEscalaSituacion,
            tabIndex                                        : 2, name: 'importe', anchor: '90%', prevTab: 'idbtnAceptarTipoN', readOnly: true,
            allowBlank                                      : false, blankText: 'Este campo es obligatorio',
            prevTab                                         : 'idcbEscalaSituacion',
            nextTab                                         : 'dfFInicioEscalaSituacion',
            listeners                                       : {change: function (tf, n, o) {
                this.cambio = 1;
            }}
        });

        this.dfFInicioEscalaSituacion = new Ext.form.DateField({id: 'dfFInicioEscalaSituacion', fieldLabel: idioma.lbColDesdeEscalaSituacion,
            tabIndex                                              : 3, name: 'fechainicio', allowBlank: false, blankText: 'Este campo es obligatorio',
            format                                                : 'd/m/Y', editable: true, readOnly: false,
            value                                                 : new Date().format('d/m/Y'), maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText                                               : 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            invalidText                                           : 'Formato: dd/mm/aaaa.', vtype: 'daterange',
            prevTab                                               : 'idnfImporteSituacion',
            nextTab                                               : 'dfFFinEscalaSituacion',
            listeners                                             : {change: function (tf, n, o) {
                this.cambio = 1;
            }},
            anchor                                                : '90%', endDateField: 'dfFFinEscalaSituacion'
        });

        this.dfFFinEscalaSituacion = new Ext.form.DateField({id: 'dfFFinEscalaSituacion', fieldLabel: idioma.lbColHastaEscalaSituacion,
            tabIndex                                           : 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format                                             : 'd/m/Y', editable: true, readOnly: false,
            maxText                                            : 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText                                            : 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            invalidText                                        : 'Formato: dd/mm/aaaa.',
            prevTab                                            : 'dfFInicioEscalaSituacion',
            nextTab                                            : 'idbtnCancelarEscalaSituacion',
            listeners                                          : {change: function (tf, n, o) {
                this.cambio = 1;
            }},
            vtype                                              : 'daterange', anchor: '90%', startDateField: 'dfFInicioEscalaSituacion'
        });

        /*
         * Items del formulario de conceptos de la situacion del servicio
         */
        this.formularioEscalaSituacion = new Ext.FormPanel({
            id        : 'idformularioEscalaSituacion',
            labelAlign: 'top',
            frame     : true,
            width     : 420,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px'
            },
            items     : [
                {layout  : 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.cbEscalaSituacion]},
                        {columnWidth: .46, layout: 'form', items: [this.nfImporteSituacion]},
                        //{columnWidth: .3, layout: 'form', items: [this.cbCategoria]},
                    ]
                },
                {layout  : 'column',
                    items: [
                        {columnWidth: .54, layout: 'form', items: [this.dfFInicioEscalaSituacion]},
                        {columnWidth: .46, layout: 'form', items: [this.dfFFinEscalaSituacion]}
                    ]
                }
            ]
        });

        /*
         * Botones de la ventana de conceptos de la situacion del servicio
         */
        this.btnCancelarEscalaSituacion = new Ext.Button({
            id     : 'idbtnCancelarEscalaSituacion',
            iconCls: 'cancelar',
//            icon: perfil.dirImg + 'cancelar.png',
            text   : idioma.lbBtnCancelarEscalaSituacion,
            tooltip: idioma.textToolTipCancelarEscalaSituacion,
            prevTab: 'dfFFinEscalaSituacion',
            nextTab: 'idbtnAplicarEscalaSituacion'
        });

        this.btnAplicarEscalaSituacion = new Ext.Button({
            id     : 'idbtnAplicarEscalaSituacion',
            iconCls: 'aplicar',
//            icon: perfil.dirImg + 'aplicar.png',
            text   : idioma.lbBtnAplicarEscalaSituacion,
            tooltip: idioma.textToolTipAplicarEscalaSituacion,
            prevTab: 'idbtnCancelarEscalaSituacion',
            nextTab: 'idbtnAceptarEscalaSituacion'
        });

        this.btnAceptarEscalaSituacion = new Ext.Button({
            id     : 'idbtnAceptarEscalaSituacion',
            iconCls: 'aceptar',
//            icon: perfil.dirImg + 'aceptar.png',
            text   : idioma.lbBtnAceptarEscalaSituacion,
            tooltip: idioma.textToolTipAceptarEscalaSituacion,
            prevTab: 'idbtnAplicarEscalaSituacion',
            nextTab: 'idgpEscalaXConceptoSituacion'
        });

        /*
         * Ventana de conceptos de la situacion del servicio
         */
        this.ventanaEscalaSituacion = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            closable   : true,
            constrain  : true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.formularioEscalaSituacion],
            buttons    : [this.btnCancelarEscalaSituacion, this.btnAplicarEscalaSituacion, this.btnAceptarEscalaSituacion],
            listeners  : {
                show: function () {
                    if (this.accionEscala == 'Add' || this.accionEscala == 'Mod') {
                        if (this.cbEscalaSituacion.tree.rendered) {
                            this.cbEscalaSituacion.tree.getLoader().load(this.cbEscalaSituacion.tree.getRootNode());
                        }
                    }
                }.createDelegate(this)
            }
        });
        // ventana adicionar elementos salariales por situacion de servicio
        this.gpSitiacionesServ = new Ext.grid.GridPanel({
            id        : 'idgpSitiacionesServ',
            title     : idioma.lbTitleListadoSituacionServ,
            region    : 'center',
            border    : false,
            layout    : 'fit',
            columns   : [modelo.smSituacionSer
                , {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idsituacionlaboral'}
                , {header: idioma.lbColNombreSituacion, width: 200, sortable: true, dataIndex: 'denominacion'}
            ],
            stripeRows: true,
            autoScroll: true,
            width     : '80%',
            heigth    : '80%',
            viewConfig: {forceFit: true},
            store     : modelo.stSituacionServ,
            sm        : modelo.smSituacionSer,
            loadMask  : {msg: 'Cargando'}
        });

        this.btnCancelarSituacionServicio = new Ext.Button({
            id     : 'idbtnCancelarSituacionServicio',
            iconCls: 'cancelar',
//            icon: perfil.dirImg + 'cancelar.png',
            text   : idioma.lbBtnCancelarSituacionServicio,
            tooltip: idioma.textToolTipCancelarSituacionServicio
            //prevTab: 'dfFFinEscalaSituacion',
            //nextTab: 'idbtnAplicarEscalaSituacion',
        });

        this.btnAceptarSituacionServicio = new Ext.Button({
            id     : 'idbtnAceptarSituacionServicio',
            iconCls: 'aceptar',
//            icon: perfil.dirImg + 'aceptar.png',
            text   : idioma.lbBtnAceptarSituacionServicio,
            tooltip: idioma.textToolTipAceptarSituacionServicio
            //prevTab: 'idbtnAplicarEscalaSituacion',
            //nextTab: 'idgpEscalaXConceptoSituacion',
        });

        this.ventanaAddporSituacionServicio = new Ext.Window({
            modal      : true,
            title      : 'Adicionar por situación de servio',
            closeAction: 'hide',
            // autoHeight: true,
            layout     : 'fit',
            closable   : true,
            constrain  : true,
            height     : 340,
            width      : 310,
            resizable  : false,
            items      : [this.gpSitiacionesServ],
            buttons    : [this.btnCancelarSituacionServicio, this.btnAceptarSituacionServicio]
        });

        /*
         * Ventana de conceptos de la situacion del servicio
         */
        this.ventanaConceptoSituacion = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            autoHeight : true,
            closable   : true,
            constrain  : true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.formularioConceptoSituacion],
            buttons    : [this.btnCancelarConceptoSituacion, this.btnAplicarConceptoSituacion, this.btnAceptarConceptoSituacion]
        });

        /*
         * Ventana general
         */
        this.winMostrarConfElementosSalariales = new Ext.Window({
            title      : idioma.lbTitleConfiguracion,
            modal      : true,
            height     : 600,
            width      : 800,
            closeAction: 'hide',
            constrain  : true,
            maximized  : true,
            closable   : true,
            resizable  : false,
            layout     : 'border',
            items      : [this.panelPersonasCargos, this.pConceptosPersonaSituacion]
        });


    }
};

//Controlador
Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Vista)
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo)
     */
    init: function (idioma, vista, modelo) {

        var idsituacionservicio;
        //this.identidad = null;
        vista.pobjestructura.on('estructuraselecionada', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
                vista.btnAceptarEntidad.enable();
                vista.identidad = nodo.id;
                //self.identidadstore = nodo.id;
                //alert(nodo.id);
                vista.idestructura = nodo.id;

            //}
        }.createDelegate(this));

        vista.btnAceptarEntidad.setHandler(function () {
            vista.winMostrarConfElementosSalariales.show();
            vista.gpPersonas.CambiarEntidad(vista.idestructura);
            vista.gpPersonas.Buscar();
        }.createDelegate(this));

        vista.winMostrarConfElementosSalariales.on('show', function () {

        });

        vista.winEstructura.show();

        /**
         *Variables generales.
         */
        var ArrIdSituacionSer = new Array();


        //Eventos del objeto del ábol de entidades.
        vista.gpPersonas.on('personaselecionada', function (sel) {
            //Si es la primera persona que se marca porque sino todas esas peticiones parten el servidor
            var arrselmodelpersonas = vista.gpPersonas.smpersonas.getSelections();
            if(arrselmodelpersonas.length == 1){
                vista.idpersona = sel.data.idpersona;
                vista.pfichadelapersona.mostrarFicha(vista.idpersona);
//            vista.pfichadelapersona.resetIdEstructura(vista.idestructura);
//            vista.pfichadelapersona.mostrarFicha(vista.idpersona,vista.idestructura);
                modelo.storeCargos.load({params: {idpersona: vista.idpersona, identidad: vista.idestructura, limit: 1000, start: 0}});
                vista.gpCargos.enable();
                vista.pconceptosescala.storeEscalaXConceptoGrid.removeAll();
                vista.pconceptosescala.gpEscalaXConcepto.disable();
                vista.pconceptosescala.btnAdicionarEscala.disable();
                vista.pconceptosescala.btnModificarEscala.disable();
                vista.pconceptosescala.btnEliminarEscala.disable();

                vista.pconceptosescala.storeConceptoPDGrid.removeAll();
                vista.pconceptosescala.gpConcepto.disable();

                vista.btnAdicionarEscalaSituacion.disable();
                vista.btnModificarEscalaSituacion.disable();
                vista.btnEliminarEscalaSituacion.disable();

                vista.btnAdicionarConceptoSituacion.disable();
                vista.btnModificarConceptoSituacion.disable();
                vista.btnEliminarConceptoSituacion.disable();

                modelo.storeElementoSalarial.removeAll();
                vista.gpElementoSalarial.disable();
                vista.btnAdicionarElementoSalarial.disable();
                vista.btnModificarElementoSalarial.disable();
                vista.btnEliminarElementoSalarial.disable();

                LimpiarFormularioSueldoPorCargo();
            }
        });

        modelo.smCargos.on('rowselect', function (sel) {
            vista.idcargosocupados = vista.gpCargos.getSelectionModel().getSelected().get('idcargosocupados');
            idsituacionservicio = vista.gpCargos.getSelectionModel().getSelected().get('idsituacionlaboral');
            if (idsituacionservicio == null) {
                vista.idcargo = vista.gpCargos.getSelectionModel().getSelected().get('idcargo');
                vista.pconceptosescala.CargarElementosSalariales(vista.idcargo, vista.idestructura, vista.idcargosocupados);
                vista.pconceptosescala.storeEscalaXConceptoGrid.removeAll();
                vista.pconceptosescala.gpEscalaXConcepto.disable();
                vista.pconceptosescala.btnAdicionarEscala.disable();
                modelo.storeElementoSalarial.removeAll();
                vista.gpElementoSalarial.disable();
                vista.btnAdicionarElementoSalarial.disable();
                vista.tpConceptosPersonaSituacion.setActiveTab(0);
                vista.gpConceptoSituacion.disable();
                vista.btnAdicionarConceptoSituacion.disable();
                vista.btnModificarConceptoSituacion.disable();
                vista.btnEliminarConceptoSituacion.disable();
                modelo.storeConceptoPDGridSituacion.removeAll();
                LimpiarFormularioSueldoPorCargo();
                obtenerListadoFormularioSueldoPorCargo();
                modelo.storeConceptoSituacion.load({params: {idsituacionlaboral: 0}});
            } else {
                vista.tpConceptosPersonaSituacion.setActiveTab(1);
                vista.pconceptosescala.storeEscalaXConceptoGrid.removeAll();
                vista.pconceptosescala.storeConceptoPDGrid.removeAll();
                vista.pconceptosescala.gpEscalaXConcepto.disable();
                vista.pconceptosescala.gpConcepto.disable();
                vista.pconceptosescala.btnAdicionarEscala.disable();
                modelo.storeConceptoPDGridSituacion.removeAll();
                modelo.storeEscalaXConceptoGridSituacion.removeAll();
                vista.gpConceptoSituacion.disable();
                vista.gpEscalaXConceptoSituacion.disable();
                CargarElementosSalariales();
                LimpiarFormularioSueldoPorCargo();
                obtenerListadoFormularioSueldoPorCargo();
                modelo.storeConceptoSituacion.load({params: {idsituacionlaboral: idsituacionservicio}});
            }
        });

        modelo.smElementoSalarial.on('rowselect', function () {
            vista.btnModificarElementoSalarial.enable();
            vista.btnEliminarElementoSalarial.enable();
            //vista.btnAdicionarConceptoSituacion.enable();
            //vista.gpConceptoSituacion.enable();
            //var idcargo = vista.gpCargos.getSelectionModel().getSelected().get('idcargo');
            //modelo.storeConceptoPDGridSituacion.baseParams.idcargo = idcargo;
            //modelo.storeConceptoPDGridSituacion.load({params:{idelemsalsituacion: elementosituacion, limit:10, start:0}});
        });

//        var filasSelecionadas = new Array();
        modelo.smConceptoSituacion.on('rowselect', function (sm, index, rec) {
            vista.btnModificarConceptoSituacion.enable();
            vista.btnEliminarConceptoSituacion.enable();

            var id = rec.id;

            var indiceFila = modelo.filasSelecionadas.indexOf(id);
            if (indiceFila == -1) {
                modelo.filasSelecionadas.push(id);
            }
            console.info(modelo.filasSelecionadas);
            var idformacalculo = vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idformacalculo');
            if (idformacalculo == 3) {
                var idconfconcep = vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptpelementsalarialessituacionservicio');
                CargarEscalasXConcepto(idconfconcep, false);

            } else {
                LimpiarGridEscalasXConceptos();

            }
        });
        modelo.smConceptoSituacion.on('rowdeselect', function (sm, index, rec) {
            vista.btnModificarConceptoSituacion.enable();
            vista.btnEliminarConceptoSituacion.enable();

            var id = rec.id;
            var indiceFila = modelo.filasSelecionadas.indexOf(id);
            modelo.filasSelecionadas.remove(id);
            if (modelo.filasSelecionadas == 0) {
                vista.btnModificarConceptoSituacion.disable();
                vista.btnEliminarConceptoSituacion.disable();
            }
            console.info(modelo.filasSelecionadas);
        });

        vista.btnAceptarSituacionServicio.on('click', function () {
            var ArrIdSituacionLab = vista.gpSitiacionesServ.getSelectionModel().getSelections();

            for (var i = 0; i < ArrIdSituacionLab.length; i++) {
                ArrIdSituacionSer[i] = ArrIdSituacionLab[i].data.idsituacionlaboral;
            }
            vista.ventanaAddporSituacionServicio.hide();
        });

        vista.btnCancelarSituacionServicio.on('click', function () {
            vista.ventanaAddporSituacionServicio.hide();
        });

        modelo.smEscalaXConceptoSituacion.on('rowselect', function () {
            vista.btnModificarEscalaSituacion.enable();
            vista.btnEliminarEscalaSituacion.enable();
        });

        vista.btnAdicionarElementoSalarial.setHandler(function () {
            mostrarVentanaAdicionarElementoSituacion();
        });

        vista.btnModificarElementoSalarial.setHandler(function () {

            mostrarVentanaModificarElementoSituacion();
        });

        vista.btnEliminarElementoSalarial.setHandler(function () {
            eliminarElementoSalarialSituacion();
        });

        vista.btnAdicionarConceptoSituacion.on('click', function () {
            mostrarVentanaAdicionarConcepto();
        });

        vista.btnModificarConceptoSituacion.on('click', function () {
            mostrarVentanaModificarConcepto();
        });

        vista.btnEliminarConceptoSituacion.on('click', function () {
            vista.ventanaEliminarConceptoSituacion.show();
        });

        vista.btnCancelarEliminarConceptoSituacion.on('click', function () {
            vista.ventanaEliminarConceptoSituacion.hide();
        });

        vista.btnAceptarEliminarConceptoSituacion.on('click', function () {
            eliminarConceptoSituacion();
            vista.ventanaEliminarConceptoSituacion.hide();
        });

        vista.btnAdicionarEscalaSituacion.on('click', function () {
            mostrarVentanaAdicionarEscala();
        });

        vista.btnModificarEscalaSituacion.on('click', function () {
            mostrarVentanaModificarEscala();
        });

        vista.btnEliminarEscalaSituacion.on('click', function () {
            eliminarEscalaSituacion();
        });

        vista.btnAceptarSalarioEspecifico.on('click', function () {
            if (vista.idsueldocargo == 0) {
                guardarSalarioEspecifico();
            } else {
                modificarSalarioEspecifico();
            }
        });

        vista.cbConceptoSituacion.on('select', function (tf, n, o) {
            ActivarComboTarifa();
        });
        vista.cbEscalaSituacion.tree.on('click', function (t, n) {
            if (t.attributes.leaf == true) {
                CalcularImporte(t);
            } else {
                vista.cbEscalaSituacion.setRawValue("");
            }
        });

        vista.btnCancelarEscalaSituacion.on('click', function () {
            vista.ventanaEscalaSituacion.hide()
        });

        vista.btnCancelarElemento.on('click', function () {
            vista.ventanaElemento.hide()
        });

        vista.btnCancelarConceptoSituacion.on('click', function () {
            vista.ventanaConceptoSituacion.hide()
        });

        vista.btnAceptarElemento.on('click', function () {
            AdicionarModElemento();
        });

        vista.checkTodasPersoServicios.on('check', function (checkbox, checked) {
            if (checked) {
                vista.ventanaAddporSituacionServicio.show()
                modelo.stSituacionServ.load();
            }
        });


        vista.btnAplicarElemento.on('click', function () {
            vista.boton = 1;
            AdicionarModElemento();
        });

        vista.btnAplicarEscalaSituacion.on('click', function () {
            vista.boton = 1;
            AdicionarModConfiguracionEscala();
        });

        vista.btnAceptarEscalaSituacion.on('click', function () {
            AdicionarModConfiguracionEscala();
        });

        vista.btnAceptarConceptoSituacion.on('click', function () {
            AdicionarModificarConceptoPD();
        });

        vista.btnAplicarConceptoSituacion.on('click', function () {
            vista.boton = 1;
            AdicionarModificarConceptoPD();
        });

        /*vista.cbGrupoEscala.on('change', function(tf, n, o) {
         vista.cambio = 1;
         });*/

        /*vista.cbGrupoEscala.on('select', function(tf, n, o) {
         vista.cbSector.enable();
         ActivarImporteCambioGrupoEscala();
         });*/

        vista.cbSector.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.cbCargoSalarioEspecifico.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        /*vista.cbSector.on('select', function(tf, n, o) {
         vista.cbEscalaSueldoCargo.enable();
         ActivarImporteCambioSector();
         });*/


        vista.cbSectoralarialBuscar.on('select', function (tf, n, o) {
            BuscarCargosPorSectores();
        });

        vista.cbDenomCargo.on('select', function (tf, n, o) {
            vista.nfSueldoporcargo.setValue(n.data.salario);
        });

        vista.cbEscalaSueldoCargo.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.cbGrupoEscala.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.cbEscalaSueldoCargo.on('select', function (tf, n, o) {
            if (vista.cbEscalaSueldoCargo.getValue() == 1) {
                vista.cbGrupoEscala.reset();
                vista.cbGrupoEscala.enable();
                vista.cbSector.reset();
                vista.cbSector.disable();
                vista.cbCargoSalarioEspecifico.reset();
                vista.cbCargoSalarioEspecifico.disable();

                vista.nfSueldoCargo.disable();
                //  variablesTipoN.tiposalario = 0;
                ActivarImporteFijo();
            } else if (vista.cbEscalaSueldoCargo.getValue() == 2) {
                vista.cbGrupoEscala.reset();
                vista.cbGrupoEscala.disable();
                vista.cbSector.reset();
                vista.cbSector.enable();
                vista.cbCargoSalarioEspecifico.reset();
                vista.cbCargoSalarioEspecifico.enable();

                vista.nfSueldoCargo.reset();
                vista.nfSueldoCargo.disable();
                // variablesTipoN.tiposalario = 1;
            }
        });

        //Evento del combo escala
        vista.cbGrupoEscala.on('change', function (tf, n, o) {
            if (vista.cbSector.getValue()) {
                ActivarImporteGrupoEscalaSectorSalarial(vista.cbGrupoEscala.getValue(), vista.cbSector.getValue());
            }
        });

        //Evento del combo escala
        vista.cbGrupoEscala.on('select', function (tf, n, o) {
            vista.cbSector.enable();
            if (vista.cbSector.getValue()) {
                ActivarImporteGrupoEscalaSectorSalarial(vista.cbGrupoEscala.getValue(), vista.cbSector.getValue());
            }
        });

        //Evento del combo sector
        vista.cbSector.on('select', function (tf, n, o) {
            vista.cbEscalaSueldoCargo.enable();
            if (vista.cbEscalaSueldoCargo.getValue() == 1) {
                if (vista.cbGrupoEscala.getValue()) {
                    ActivarImporteGrupoEscalaSectorSalarial(vista.cbGrupoEscala.getValue(), vista.cbSector.getValue());
                }
            }
            if (vista.cbEscalaSueldoCargo.getValue() == 2) {
                vista.cbCargoSalarioEspecifico.enable();
                modelo.storeCargoSalarioEspecifico.load({params: {idsectorsalarial: vista.cbSector.getValue()}});
            }
        });

        //Evento del combo Cargo
        vista.cbCargoSalarioEspecifico.on('select', function (tf, n, o) {
            ActivarImporteSalarioEspecifico(vista.cbCargoSalarioEspecifico.getValue());
        });

        vista.cbSistemaPago.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.cbPeriodoPago.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.nfSueldoCargo.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.dfFInicioElemento.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.cbConceptoSituacion.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.cbTarifaSituacion.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.dfFInicioConceptoSituacion.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.dfFFinConceptoSituacion.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.cbEscalaSituacion.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.nfImporteSituacion.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.dfFInicioEscalaSituacion.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.dfFFinEscalaSituacion.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        vista.gpPersonas.gpPersonabuscar.selModel.on('rowdeselect', function (tf, n, o) {
            LimpiarTodo();
        });

        vista.pconceptosescala.btnEliminarEscala.on('click', function () {
            // var arreglo = vista.gpTipoNomina.getSelections();


            // var idsituacionlaboral = vista.gpCargos.getSelectionModel().getSelected().get('idsituacionlaboral');
            var idsituacionlaboral = vista.gpCargos.getSelectionModel().getSelected().get('idsituacionlaboral');
            var arreglo = vista.gpPersonas.gpPersonabuscar.getSelections();

            var idcategoriapersona = vista.gpPersonas.gpPersonabuscar.getSelectionModel().getSelected().data.idcategoriapersona;

            vista.pconceptosescala.eliminarEscala(arreglo, idsituacionlaboral, vista.idestructura, idcategoriapersona);
        });
        vista.pconceptosescala.btnAceptarEscala.on('click', function () {

            var idsituacionlaboral = vista.gpCargos.getSelectionModel().getSelected().get('idsituacionlaboral');
            var arreglo = vista.gpPersonas.gpPersonabuscar.getSelections();
            vista.pconceptosescala.AdicionarModConfiguracionEscala(0, arreglo, idsituacionlaboral, vista.idestructura);

        });

        vista.pconceptosescala.btnAplicarEscala.on('click', function () {

            var idsituacionlaboral = vista.gpCargos.getSelectionModel().getSelected().get('idsituacionlaboral');
            var arreglo = vista.gpPersonas.stpersonabuscar.getRange();
            vista.pconceptosescala.AdicionarModConfiguracionEscala(1, arreglo, idsituacionlaboral, vista.idestructura);
        });


        modelo.storePeriodoPago.load();
        modelo.storeGrupoEscala.load();
        modelo.storeSector.load();
        modelo.storeEscalaSueldoCargo.load();
        //  modelo.storeTarifaSituacion.load();
        modelo.storeDenomCargo.load();

        /*
         * Funcion para mostrar la ventana de adicionar elemento salarial a la situacion del servicio
         */
        function mostrarVentanaAdicionarElementoSituacion() {
            vista.formularioElemento.getForm().reset();
            vista.cbSistemaPago.setValue('');
            vista.cbSistemaPago.focus(true, 500);
            vista.ventanaElemento.setTitle(idioma.lbTitleVentAdicionarElemento);
            vista.btnAplicarElemento.show();
            vista.ventanaElemento.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarElemento.setNextElement('idbtnAplicarElemento');
            vista.btnAceptarElemento.setPreviousElement('idbtnAplicarElemento');
            vista.accionElemento = 'Add';
            vista.cbSistemaPago.setRawValue("");
            vista.checkTodasPersoServicios.enable();
        }

        /*function mostrarVentanaAddporSituacionSer(){
         vista.ventanaAddporSituacionServicio.enable();
         }*/

        function mostrarVentanaModificarElementoSituacion() {
            //vista.cbSector.enable();
            vista.cbEscalaSueldoCargo.enable();
            vista.cbSistemaPago.focus(true, 500);
            vista.ventanaElemento.setTitle(idioma.lbTitleVentModificarElemento);
            vista.btnAplicarElemento.hide();
            vista.ventanaElemento.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarElemento.setNextElement('idbtnAceptarElemento');
            vista.btnAceptarElemento.setPreviousElement('idbtnCancelarElemento');
            vista.formularioElemento.getForm().loadRecord(vista.gpElementoSalarial.getSelectionModel().getSelected());
            vista.accionElemento = 'Mod';
            vista.checkTodasPersoServicios.enable();
            var sistemapago = vista.gpElementoSalarial.getSelectionModel().getSelected().get('sistemapago');
            vista.cbSistemaPago.setValue('');
            vista.cbSistemaPago.setValue(sistemapago);

            var escala = Ext.getCmp('idcbEscalaSueldoCargo').getValue();

            if (escala == 1) {
                vista.cbGrupoEscala.reset();
                vista.cbGrupoEscala.setValue(vista.gpElementoSalarial.getSelectionModel().getSelected().data.idgrupoescala);
                vista.cbGrupoEscala.setRawValue(vista.gpElementoSalarial.getSelectionModel().getSelected().data.grupoescala);
                vista.cbGrupoEscala.enable();
                vista.cbSector.setValue(vista.gpElementoSalarial.getSelectionModel().getSelected().data.idsectorsalarial);
                vista.cbSector.setRawValue(vista.gpElementoSalarial.getSelectionModel().getSelected().data.sectorsalarial);
                vista.nfSueldoCargo.setValue(vista.gpElementoSalarial.getSelectionModel().getSelected().data.importe);
                vista.nfSueldoCargo.disable();
            } else if (escala == 2) {
                vista.cbSector.setValue(vista.gpElementoSalarial.getSelectionModel().getSelected().data.idsectorsalarial);
                vista.cbSector.setRawValue(vista.gpElementoSalarial.getSelectionModel().getSelected().data.sectorsalarial);
                vista.cbGrupoEscala.disable();
                //vista.cbCargoSalarioEspecifico.reset();
                vista.cbCargoSalarioEspecifico.enable();
                vista.cbSector.enable();
                vista.cbCargoSalarioEspecifico.setValue(vista.gpElementoSalarial.getSelectionModel().getSelected().get('idsalarioespecifico'));//console.info(vista.cbCargoSalarioEspecifico.getValue());
                vista.cbCargoSalarioEspecifico.setRawValue(vista.gpElementoSalarial.getSelectionModel().getSelected().get('denominacioncargo'));//console.info(vista.cbCargoSalarioEspecifico.getRawValue());

                vista.nfSueldoCargo.disable();
                vista.nfSueldoCargo.setValue(vista.gpElementoSalarial.getSelectionModel().getSelected().data.importe);

            }

            sistemapago = "";
            //vista.nfSueldoporcargo.setValue(vista.gpElementoSalarial.getSelectionModel().getSelected().get('importe'));
            /* var escala = Ext.getCmp('idcbEscalaSueldoCargo').getRawValue();
             if (escala == "Importe fijo") {
             Ext.getCmp('nfSueldoCargo').enable();
             Ext.getCmp('nfSueldoCargo').setValue('');
             }else if (escala == "Salario específico") {
             Ext.getCmp('nfSueldoCargo').disable();
             Ext.getCmp('nfSueldoCargo').setValue('');
             } else {
             Ext.Ajax.request({
             url: '/pvd/nomina/index.php/configelementosalarialpersona/buscarImporteSalarioEscala',
             method: 'POST',
             params: {idgrupoescala: Ext.getCmp('idcbGrupoEscala').getValue(),
             idsectorsalarial: Ext.getCmp('idcbSector').getValue()
             },
             callback: function(options, success, response) {
             responseData = Ext.decode(response.responseText);
             var result = responseData;
             if(result != -1){
             Ext.getCmp('nfSueldoCargo').enable();
             Ext.getCmp('nfSueldoCargo').setValue(result);
             }else{
             Ext.getCmp('nfSueldoCargo').enable();
             Ext.getCmp('nfSueldoCargo').setValue(0);
             }
             }
             });
             }*/
        }

        function mostrarVentanaAdicionarConcepto() {


            vista.formularioConceptoSituacion.getForm().reset();
            vista.cbConceptoSituacion.focus(true, 500);
            vista.ventanaConceptoSituacion.setTitle(idioma.lbTitleVentAdicionarConcepto);
            vista.btnAplicarConceptoSituacion.show();
            vista.ventanaConceptoSituacion.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarConceptoSituacion.setNextElement('idbtnAplicarConceptoSituacion');
            vista.btnAceptarConceptoSituacion.setPreviousElement('idbtnAplicarConceptoSituacion');
            vista.accionConcepto = 'Add';
            vista.checkTodosCargos.enable();


        }

        function mostrarVentanaModificarConcepto() {
            vista.ventanaConceptoSituacion.setTitle(idioma.lbTitleVentModificarConcepto);
            vista.btnAplicarConceptoSituacion.hide();
            vista.cbConceptoSituacion.focus(true, 500);
            vista.ventanaConceptoSituacion.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarConceptoSituacion.setNextElement('idbtnAceptarConceptoSituacion');
            vista.btnAceptarConceptoSituacion.setPreviousElement('idbtnCancelarConceptoSituacion');

            vista.cbTarifaSituacion.enable();
            vista.formularioConceptoSituacion.getForm().loadRecord(vista.gpConceptoSituacion.getSelectionModel().getSelected());
            vista.cbTarifaSituacion.setValue(vista.gpConceptoSituacion.getSelectionModel().getSelected().get('denomtarifa'));
            vista.accionConcepto = 'Mod';
            vista.checkTodosCargos.disable();
        }

        function mostrarVentanaAdicionarEscala() {
            vista.formularioEscalaSituacion.getForm().reset();
            vista.cbEscalaSituacion.focus(true, 500);
            vista.ventanaEscalaSituacion.setTitle(idioma.lbTitleVentAdicionarEscala);
            vista.btnAplicarEscalaSituacion.show();
            vista.ventanaEscalaSituacion.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarEscalaSituacion.setNextElement('idbtnAplicarEscalaSituacion');
            vista.btnAceptarEscalaSituacion.setPreviousElement('idbtnAplicarEscalaSituacion');
            vista.cbEscalaSituacion.setRawValue("");
            vista.accionEscala = 'Add';
        }

        function mostrarVentanaModificarEscala() {
            vista.formularioEscalaSituacion.getForm().reset();
            vista.cbEscalaSituacion.focus(true, 500);
            vista.ventanaEscalaSituacion.setTitle(idioma.lbTitleVentModificarEscala);
            vista.btnAplicarEscalaSituacion.hide();
            vista.ventanaEscalaSituacion.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarEscalaSituacion.setNextElement('idbtnAceptarEscalaSituacion');
            vista.btnAceptarEscalaSituacion.setPreviousElement('idbtnCancelarEscalaSituacion');
            vista.formularioEscalaSituacion.getForm().loadRecord(vista.gpEscalaXConceptoSituacion.getSelectionModel().getSelected());

            var escal = vista.gpEscalaXConceptoSituacion.getSelectionModel().getSelected().get('escala');
            vista.cbEscalaSituacion.setRawValue(escal);
            vista.cbEscalaSituacion.enable();
            vista.accionEscala = 'Mod';
        }

        function CalcularImporte(n) {
            var idescala = n.id;
            Ext.Ajax.request({
                url     : '/pvd/nomina/index.php/configelementosalarialpersona/calcularImporte',
                method  : 'POST',
                params  : {idescala: idescala
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var importe = responseData;
                    if (importe == -1) {
                        vista.nfImporteSituacion.setValue("0.00");
                    } else {
                        vista.nfImporteSituacion.setValue(importe);
                    }
                }
            });
        }

        function ActivarImporteCambioGrupoEscala() {
            var escala = Ext.getCmp('idcbEscalaSueldoCargo').getRawValue();
            var sector = Ext.getCmp('idcbSector').getRawValue();
            if (isNaN(escala) && isNaN(sector)) {
                if (escala == "Grupo escala") {
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/configelementosalarialpersona/buscarImporteSalarioEscala',
                        method  : 'POST',
                        params  : {idgrupoescala: Ext.getCmp('idcbGrupoEscala').getValue(),
                            idsectorsalarial    : Ext.getCmp('idcbSector').getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            var result = responseData;
                            if (result != -1) {
                                Ext.getCmp('nfSueldoCargo').enable();
                                Ext.getCmp('nfSueldoCargo').setValue(result);
                            } else {
                                Ext.getCmp('nfSueldoCargo').enable();
                                Ext.getCmp('nfSueldoCargo').setValue(0);
                            }
                        }
                    });
                }
            } else {
                var aux = 0;
            }
        }

        function ActivarImporteCambioSector() {
            var escala = Ext.getCmp('idcbEscalaSueldoCargo').getRawValue();
            var grupescala = Ext.getCmp('idcbGrupoEscala').getRawValue();
            if (isNaN(escala)) {
                if (escala == "Grupo escala") {
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/configelementosalarialpersona/buscarImporteSalarioEscala',
                        method  : 'POST',
                        params  : {idgrupoescala: Ext.getCmp('idcbGrupoEscala').getValue(),
                            idsectorsalarial    : Ext.getCmp('idcbSector').getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            var result = responseData;
                            if (result != -1) {
                                Ext.getCmp('nfSueldoCargo').enable();
                                Ext.getCmp('nfSueldoCargo').setValue(result);
                            } else {
                                Ext.getCmp('nfSueldoCargo').enable();
                                Ext.getCmp('nfSueldoCargo').setValue(0);
                            }
                        }
                    });
                }
            } else {
                var aux = 0;
            }
        }

        function ActivarImporteFijo() {
            var escala = Ext.getCmp('idcbEscalaSueldoCargo').getRawValue();
            if (escala == "Importe fijo") {
                Ext.getCmp('nfSueldoCargo').enable();
                Ext.getCmp('nfSueldoCargo').setValue('');
            } /*else if (escala == "Salario específico") {
             Ext.getCmp('nfSueldoCargo').disable();
             Ext.getCmp('nfSueldoCargo').setValue('');
             } */ else {
                var idgrupo = vista.cbGrupoEscala.getValue();
                var idsector = vista.cbSector.getValue();
                if (idgrupo == "" || idsector == "") {
                    Ext.getCmp('nfSueldoCargo').setValue('');
                    Ext.getCmp('nfSueldoCargo').enable();
                } else {
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/configelementosalarialpersona/buscarImporteSalarioEscala',
                        method  : 'POST',
                        params  : {idgrupoescala: Ext.getCmp('idcbGrupoEscala').getValue(),
                            idsectorsalarial    : Ext.getCmp('idcbSector').getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            var result = responseData;
                            if (result != -1) {
                                Ext.getCmp('nfSueldoCargo').enable();
                                Ext.getCmp('nfSueldoCargo').setValue(result);
                            } else {
                                Ext.getCmp('nfSueldoCargo').enable();
                                Ext.getCmp('nfSueldoCargo').setValue(0);
                            }
                        }
                    });
                }
            }
        }

        function ActivarImporteSalarioEspecifico() {
            Ext.Ajax.request({
                url     : '/pvd/nomina/index.php/configelementosalarialpersona/buscarImporteSalarioEspecifico',
                method  : 'POST',
                params  : {idsalarioespecifico: vista.cbCargoSalarioEspecifico.getValue()},
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var resp = responseData;
                    // vista.tfGrupoEscala.setValue(responseData.grupoescala);
                    vista.nfSueldoCargo.disable();
                    vista.nfSueldoCargo.readOnly = true;
                    vista.nfSueldoCargo.setValue(resp.salario);
                    //  vista.btnAceptarTipoN.show();
                }
            });
        }

        function ActivarImporteGrupoEscalaSectorSalarial() {
            Ext.Ajax.request({
                url     : '/pvd/nomina/index.php/configelementosalarialpersona/buscarImporteSalarioEscalaSectorsalarial',
                method  : 'POST',
                params  : {idgrupoescala: vista.cbGrupoEscala.getValue(),
                    denom               : vista.cbGrupoEscala.getRawValue(),
                    idsectorsalarial    : vista.cbSector.getValue()},
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var result = responseData;
                    vista.nfSueldoCargo.setValue(responseData.salario);
                    vista.nfSueldoCargo.disable();
                }
            });
        }

        function LimpiarGridEscalasXConceptos() {
            modelo.storeEscalaXConceptoGridSituacion.removeAll();
            vista.gpEscalaXConceptoSituacion.disable();
            vista.btnAdicionarEscalaSituacion.disable();
            vista.btnModificarEscalaSituacion.disable();
            vista.btnEliminarEscalaSituacion.disable();
        }

        function LimpiarFormularioSueldoPorCargo() {
            vista.cbSectoralarialBuscar.setValue("");
            vista.cbDenomCargo.setValue("");
            vista.nfSueldoporcargo.setValue("");
            vista.btnAceptarSalarioEspecifico.disable();
            vista.panelSueldocargo.disable();
        }

        function CargarElementosSalariales() {
            vista.gpElementoSalarial.enable();
            vista.btnAdicionarElementoSalarial.enable();
            vista.btnAdicionarConceptoSituacion.enable();
            var idpersonaentidad = vista.gpPersonas.gpPersonabuscar.getSelectionModel().getSelected().get('idpersona');
            var idcargo = vista.gpCargos.getSelectionModel().getSelected().get('idcargo');
            modelo.storeElementoSalarial.baseParams.idpersona = idpersonaentidad;
            modelo.storeElementoSalarial.baseParams.idcargo = idcargo;
            modelo.storeElementoSalarial.baseParams.idcargoocupado = vista.idcargosocupados;
            modelo.storeElementoSalarial.load({params: {limit: 1000, start: 0}});
            modelo.storeConceptoPDGridSituacion.baseParams.idcargosocupados = vista.idcargosocupados;
            modelo.storeConceptoPDGridSituacion.load({params: {idcargosocupados: vista.idcargosocupados, limit: 1000, start: 0}});
            vista.gpConceptoSituacion.enable();
            vista.btnModificarConceptoSituacion.disable();
            vista.btnEliminarConceptoSituacion.disable();
        }

        function obtenerListadoFormularioSueldoPorCargo() {
            var denominacionsector = "";
            var importe = "";
            Ext.Ajax.request({
                url     : '/pvd/nomina/index.php/configelementosalarialpersona/obtenerListadoFormularioSueldoPorCargo',
                method  : 'POST',
                params  : {idcargoocupado: vista.idcargosocupados
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var result = responseData;
                    if (result.flag == 5) {
                        mostrarMensaje(3, idioma.lbMsgErrorElementoSalarial, function () {
                        });
                    } else if (result.flag == 1 || result.flag == 2) {
                        GestionarSalarioEspecifico(result.idsueldoporcargo, result.flag, result.elementosalarial);
                    } else {
                        MostrarValoresSueldoPorCargo(result.idsueldoporcargo, result.elementosalarial, result.flag, result.denominacionsector, result.denomcargo, result.importe);
                    }
                }
            });
        }

        function GestionarSalarioEspecifico(idsueldoporcargo, flag, elementosalarialsalario) {
            vista.flag = flag;
            vista.elementosalarialsalario = elementosalarialsalario;
            vista.idsueldocargo = idsueldoporcargo;
            vista.nfSueldoporcargo.setValue("");
            vista.cbDenomCargo.setValue("");
            vista.cbSectoralarialBuscar.setValue("");
            vista.cbDenomCargo.enable();
            vista.btnAceptarSalarioEspecifico.enable();
            modelo.storeSectorSalarial.load({params: {desactivar: 0}});
            vista.panelSueldocargo.enable();
        }

        function BuscarCargosPorSectores() {
            vista.cbDenomCargo.setValue("");
            vista.nfSueldoporcargo.setValue("");
            var idsector = vista.cbSectoralarialBuscar.getValue();
            modelo.storeDenomCargo.load({params: {idsector: idsector}});
        }

        function MostrarValoresSueldoPorCargo(idsueldoporcargo, elementosalarial, flag, denominacionsector, denomcargo, importe) {
            vista.panelSueldocargo.enable();
            if (denomcargo == "") {
                vista.nfSueldoporcargo.setValue(importe);
                vista.cbSectoralarialBuscar.setValue(denominacionsector);
                vista.cbDenomCargo.disable();
                vista.btnAceptarSalarioEspecifico.disable();
                if (idsueldoporcargo == 0) {
                    modelo.storeSectorSalarial.load({params: {desactivar: 1}});
                } else {
                    modelo.storeSectorSalarial.load({params: {desactivar: 0}});
                }
            } else {
                vista.nfSueldoporcargo.setValue(importe);
                vista.cbSectoralarialBuscar.setValue(denominacionsector);
                vista.cbDenomCargo.setValue(denomcargo);
                vista.cbDenomCargo.enable();
                vista.btnAceptarSalarioEspecifico.enable();
                if (idsueldoporcargo == 0) {
                    modelo.storeSectorSalarial.load({params: {desactivar: 1}});
                } else {
                    modelo.storeSectorSalarial.load({params: {desactivar: 0}});
                }
                vista.idsueldocargo = idsueldoporcargo;
                vista.elementosalarialsalario = elementosalarial;
                vista.flag = flag;
            }
        }

        function CargarEscalasXConcepto(idconcepto, recargar) {
            vista.gpEscalaXConceptoSituacion.enable();
            modelo.storeEscalaXConceptoGridSituacion.removeAll();
            if (!recargar) {
                modelo.storeEscalaXConceptoGridSituacion.baseParams.idconfconceptospdelementossalariales = vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptpelementsalarialessituacionservicio');
                modelo.storeEscalaXConceptoGridSituacion.load();
            } else {
                modelo.storeEscalaXConceptoGridSituacion.reload();
            }
            vista.btnAdicionarEscalaSituacion.enable();
            vista.btnModificarEscalaSituacion.disable();
            vista.btnEliminarEscalaSituacion.disable();
        }

        function ActivarComboTarifa() {
            var idconcepto = vista.cbConceptoSituacion.getValue();
            // console.info(idconcepto);
            vista.cbTarifaSituacion.setValue('');
            vista.cbTarifaSituacion.disable();
            modelo.storeTarifaSituacion.load({params: {idconcepto: idconcepto}, callback: function (r) {
                if (r.length > 0) {
                    vista.cbTarifaSituacion.enable();
                } else mostrarMensaje(1, 'No existen tarifas configuradas para el concepto <b>' + vista.cbConceptoSituacion.getRawValue() + '</b>.');

            }});
        }

        function LimpiarTodo() {
            vista.gpConceptoSituacion.disable();
            vista.gpEscalaXConceptoSituacion.disable();
            modelo.storeConceptoPDGridSituacion.removeAll();
            modelo.storeEscalaXConceptoGridSituacion.removeAll();
        }

        function guardarSalarioEspecifico() {
            //Se muestra la máscara de espera.
            PVD.mostrarMascara('idmaskaddmodsalario', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgAdicionarSalario);
            Ext.Ajax.request({
                url     : '/pvd/nomina/index.php/configelementosalarialpersona/adicionarSalarioEspecifico',
                method  : 'POST',
                params  : {idsalarioespecifico: vista.cbDenomCargo.getValue(),
                    idelementosalarial        : vista.elementosalarialsalario,
                    flag                      : vista.flag
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);

                    //Ocultando máscara de enviar datos.
                    PVD.ocultarMascara('idmaskaddmodsalario');

                    if (responseData.codMsg == 1) {
                        mostrarMensaje(1, idioma.lbMsgCorrectoAdicionadoSalario, function () {
                        });

                    } else {
                        mostrarMensaje(2, 'Ya existe un salario específico asociado a esta situación del servicio', function () {
                        });
                    }
                }
            });
        }

        function modificarSalarioEspecifico() {
            //Se muestra la máscara de espera.
            PVD.mostrarMascara('idmaskaddmodsalario', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgModificarSalario);
            Ext.Ajax.request({
                url     : '/pvd/nomina/index.php/configelementosalarialpersona/modificarSalarioEspecifico',
                method  : 'POST',
                params  : {idsueldocargo: vista.idsueldocargo, idsalarioespecifico: vista.cbDenomCargo.getValue(),
                    idelementosalarial  : vista.elementosalarialsalario,
                    flag                : vista.flag
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);

                    //Ocultando máscara de enviar datos.
                    PVD.ocultarMascara('idmaskaddmodsalario');

                    if (responseData.codMsg == 1) {
                        mostrarMensaje(1, idioma.lbMsgCorrectoModificadoSalario, function () {
                        });

                    } else {
                        mostrarMensaje(2, 'Ya existe un salario específico asociado a esta situación del servicio', function () {
                        });
                    }
                }
            });
        }

        function AdicionarModElemento() {

            var persCategoria;
            var persSinCateg;
            var idsituacionlaboral = vista.gpCargos.getSelectionModel().getSelected().get('idsituacionlaboral');
            //console.info(idsituacionlaboral);
            var store = vista.gpPersonas.stpersonabuscar.getRange();
            /* Ext.each(store, function (obj) {
             //  console.info(obj);
             if (obj.data.idcategoriapersona == idsituacionlaboral) {
             persCategoria.push(obj.data.idpersona);
             }
             if (obj.data.idcategoriapersona == idsituacionlaboral) {
             persCategoria.push(obj.data.idpersona);
             }else if(!idsituacionlaboral){
             persCategorias.push(obj.data.idpersona);
             }

             });*/
            //var idcargoocupado = vista.gpCargos.getSelectionModel().getSelected().get('idcargosocupados');
            var checked = vista.checkTodasPersoServicios.getValue();
            var idelementosalarialsituacion = 0;
            var urlAction = '/pvd/nomina/index.php/configelementosalarialpersona/adicionarConfigElementoSalarial';
            var lbMsgEspera = 'Adicionando datos del elemento salarial de la situación del servicio...';
            var lbMsgExito = 'El elemento salarial de la situación del servicio ha sido adicionado satisfactoriamente.';
            if (vista.accionElemento == 'Mod') {
                idelementosalarialsituacion = vista.gpElementoSalarial.getSelectionModel().getSelected().get('idelementosalarialsituacionservicio');
                lbMsgEspera = 'Modificando datos del elemento salarial de la situación del servicio...';
                lbMsgExito = 'El elemento salarial de la situación del servicio ha sido modificado satisfactoriamente.';
                urlAction = '/pvd/nomina/index.php/configelementosalarialpersona/modificarConfigElementoSalarial';

            }
            if (vista.cambio == 0) {
                if (vista.accionElemento == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaElemento.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.cbSistemaPago.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                var idsistemap
                if (vista.formularioElemento.getForm().isValid()) {
                    var idsistemapagbool = vista.cbSistemaPago.getValue();
                    if (isNaN(idsistemapagbool)) {
                        idsistemap = vista.gpElementoSalarial.getSelectionModel().getSelected().get('idsistemapago');
                    } else {
                        idsistemap = idsistemapagbool;
                    }
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtipopago', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url     : urlAction,
                        method  : 'POST',
                        params  : {
                            arrayidsituacionlaboral: Ext.encode(ArrIdSituacionSer),
                            idelementosalarial     : idelementosalarialsituacion, idsistpago: idsistemap,
                            idperiodopago          : vista.cbPeriodoPago.getValue(),
                            idgrupoescala          : vista.cbGrupoEscala.getValue(),
                            idsector               : vista.cbSector.getValue(),
                            idescalasueldocargo    : vista.cbEscalaSueldoCargo.getValue(),
                            idsalarioespecifico    : vista.cbCargoSalarioEspecifico.getValue(),
                            importe                : vista.nfSueldoCargo.getValue(),
                            fechainicio            : vista.dfFInicioElemento.getRawValue(),
                            fechafin               : vista.dfFFinElemento.getRawValue(),
                            idpersona              : vista.idpersona,
                            idcargoocupado         : vista.idcargosocupados,
                            checked                : checked,
                            idsituacionlaboral     : idsituacionlaboral
                            //  arraypersCateg: idsituacionlaboral?Ext.encode(persCategoria): Ext.encode(persCategorias),

                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtipopago');

                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, lbMsgExito, function () {
                                    if (!vista.boton) {
                                        vista.ventanaElemento.hide();

                                    } else {
                                        vista.cbSistemaPago.focus(true, 500);
                                    }
                                    vista.formularioElemento.getForm().reset();
                                    vista.gpElementoSalarial.getStore().removeAll();
                                    //var idpers = idpersona
                                    vista.gpElementoSalarial.getStore().load({params: {idpers: vista.idpersona}});
                                    vista.cambio = 0;
                                    vista.btnEliminarElementoSalarial.disable();
                                    vista.btnAdicionarElementoSalarial.disable();
                                    vista.btnModificarElementoSalarial.disable();
                                    vista.cbSector.disable();
                                    vista.cbCargoSalarioEspecifico.disable();
                                    vista.cbGrupoEscala.disable();
                                    //vista.cbEscalaSueldoCargo.disable();
                                    LimpiarFormularioSueldoPorCargo();
                                    obtenerListadoFormularioSueldoPorCargo();

                                });

                            } else if (responseData.codMsg == 2) {
                                mostrarMensaje(2, 'Ya existe un elemento salarial asociado a esta persona', function () {
                                    if (!vista.boton) {
                                        vista.ventanaConceptoSituacion.hide();

                                    } else {
                                        vista.cbSistemaPago.focus(true, 500);
                                    }
                                });
                            } else {
                                (responseData.codMsg)
                                mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }
                    });

                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }

        }

        function eliminarElementoSalarialSituacion() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarTipoN, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTipoN);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/configelementosalarialpersona/eliminarConfigElementoSalarial',
                        method  : 'POST',
                        params  : {idelementosalarial: vista.gpElementoSalarial.getSelectionModel().getSelected().get('idelementosalarialsituacionservicio')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTipoN, function (btn) {
                                    var cantidad = modelo.storeElementoSalarial.getCount();
                                    if (cantidad >= 1) {
                                        vista.btnAdicionarElementoSalarial.enable();
                                        vista.btnModificarElementoSalarial.enable();
                                        vista.btnEliminarElementoSalarial.enable();
                                    }
                                    else {
                                        vista.btnAdicionarElementoSalarial.enable();
                                        vista.btnModificarElementoSalarial.disable();
                                        vista.btnEliminarElementoSalarial.disable();
                                    }

                                });
                                //Recargando el grid de tipos de nómina.
                                vista.gpElementoSalarial.getStore().removeAll();
                                vista.gpElementoSalarial.getStore().load({params: {idpersona: vista.idpersona, idcargoocupado: vista.idcargosocupados}});
                                LimpiarFormularioSueldoPorCargo();
                                obtenerListadoFormularioSueldoPorCargo();
                            }
                        }
                    });
                }

            });

        }

        function AdicionarModificarConceptoPD() {
            var idconceptopdSituacion = 0;
            var checked = vista.checkTodosCargos.getValue();

            var idsituacionlaboral = vista.gpCargos.getSelectionModel().getSelected().get('idsituacionlaboral');
            var categoria = vista.cbCategoriaPersona.getValue();
            var arrayDatos = new Array();
            var arreglo = vista.gpPersonas.stpersonabuscar.getRange();
            Ext.each(arreglo, function (obj) {
                if (obj.data.idcategoriapersona == categoria) { //milena
                    arrayDatos.push(obj.data.idpersona);
                }
            });
            var urlAction = '/pvd/nomina/index.php/configelementosalarialpersona/adicionarConceptoPagoDescuento';
            var lbMsgEspera = 'Adicionando datos del concepto de la situación del servicio...';
            var lbMsgExito = 'El concepto de la situación del servicio ha sido adicionado satisfactoriamente.';

            if (vista.accionConcepto == 'Mod') {
                lbMsgEspera = 'Modificando datos del concepto de la situación del servicio...';
                lbMsgExito = 'El concepto de la situación del servicio ha sido modificado satisfactoriamente.';
                urlAction = '/pvd/nomina/index.php/configelementosalarialpersona/modificarConceptoPagoDescuento';
            }
            if (vista.cambio == 0) {
                if (vista.accionConcepto == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaConceptoSituacion.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.cbConceptoSituacion.markInvalid('Este campo es obligatorio.');
                    vista.cbTarifaSituacion.markInvalid('Este campo es obligatorio.');
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            } else {
                if (vista.formularioConceptoSituacion.getForm().isValid()) {
                    var idtarifabool = vista.cbTarifaSituacion.getValue();
                    var idtarifa = 0;
                    if (isNaN(idtarifabool)) {
                        idtarifa = vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idtarifa');
                    } else {
                        idtarifa = idtarifabool;
                    }
                    if (vista.accionConcepto == 'Mod') {
                        idconceptopdSituacion = vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptpelementsalarialessituacionservicio');
                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmaskaddmodtipopago', 'Por favor espere…', 'Modificando datos del concepto de percepción y descuento de la situación del servicio');
                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            url     : urlAction,
                            method  : 'POST',
                            params  : {idconceptopdSituacion: idconceptopdSituacion,
                                idconcepto                  : vista.cbConceptoSituacion.getValue(),
                                idtarifa                    : idtarifa,
                                fechainicio                 : vista.dfFInicioConceptoSituacion.getRawValue(),
                                fechafin                    : vista.dfFFinConceptoSituacion.getRawValue(),
                                idcargosocupados            : vista.idcargosocupados,
                                idsituacionlaboral          : idsituacionlaboral,
                                idpersonas                  : Ext.enconde(arrayDatos),
                                identidad                   : vista.idestructura
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);

                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmaskaddmodtipopago');

                                if (responseData.codMsg == 2) {
                                    mostrarMensaje(1, 'El concepto de percepción y descuento de la situación del servicio ha sido modificado satisfactoriamente.', function () {
                                        if (!vista.boton) {
                                            vista.ventanaConceptoSituacion.hide();

                                        } else {
                                            vista.cbConceptoSituacion.focus(true, 500);
                                        }
                                        vista.formularioConceptoSituacion.getForm().reset();
                                        vista.gpConceptoSituacion.getStore().removeAll();
                                        vista.gpEscalaXConceptoSituacion.getStore().removeAll();
                                        vista.gpEscalaXConceptoSituacion.disable();
                                        modelo.storeConceptoPDGridSituacion.baseParams.idcargosocupados = vista.idcargosocupados;
                                        modelo.storeConceptoPDGridSituacion.load({params: {idcargosocupados: vista.idcargosocupados, limit: 1000, start: 0}});
                                        vista.cambio = 0;
                                        vista.btnEliminarConceptoSituacion.disable();
                                        vista.btnModificarConceptoSituacion.disable();
                                        vista.cbTarifaSituacion.disable();
                                    });

                                } else {
                                    if (responseData.codMsg)
                                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                }
                            }
                        });
                    } else {
                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmaskaddmodtipopago', 'Por favor espere…', 'Adicionando datos del concepto de percepción y descuento de la situación del servicio');
                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            url     : urlAction,
                            method  : 'POST',
                            params  : {idconcepto : vista.cbConceptoSituacion.getValue(),
                                idtarifa          : idtarifa,
                                fechainicio       : vista.dfFInicioConceptoSituacion.getRawValue(),
                                fechafin          : vista.dfFFinConceptoSituacion.getRawValue(),
                                idcargosocupados  : vista.idcargosocupados,
                                checked           : checked,
                                idsituacionlaboral: idsituacionlaboral,
                                idpersonas        : Ext.encode(arrayDatos),
                                identidad         : vista.idestructura
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);

                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmaskaddmodtipopago');

                                if (responseData.codMsg == 1) {
                                    mostrarMensaje(1, 'El concepto de percepción y descuento de la situación del servicio ha sido adicionado satisfactoriamente.', function () {
                                        if (!vista.boton) {
                                            vista.ventanaConceptoSituacion.hide();

                                        } else {
                                            vista.cbConceptoSituacion.focus(true, 500);
                                        }
                                        vista.formularioConceptoSituacion.getForm().reset();
                                        vista.gpConceptoSituacion.getStore().removeAll();
                                        modelo.storeConceptoPDGridSituacion.baseParams.idcargosocupados = vista.idcargosocupados;
                                        modelo.storeConceptoPDGridSituacion.load({params: {idcargosocupados: vista.idcargosocupados}});
                                        vista.cambio = 0;
                                        vista.btnEliminarConceptoSituacion.disable();
                                        vista.btnModificarConceptoSituacion.disable();
                                        vista.cbTarifaSituacion.disable();
                                    });

                                } else {
                                    if (responseData.codMsg)
                                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                }
                            }
                        });
                    }
                } else {
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            }
        }

        function eliminarConceptoSituacion() {

            var ifchecked = vista.checkTodosPersonasEliminar.getValue();
//            idconceptoPd = vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptpelementsalarialessituacionservicio');
            var arrayIdconceptoPd = modelo.filasSelecionadas;
            //idcargo = vista.gpCargos.getSelectionModel().getSelected().get('idcargo');
            var mensaje = '¿Está seguro que quiere eliminar el concepto de percepción y descuento seleccionado?';
            if (arrayIdconceptoPd.length > 1) {
                mensaje = '¿Está seguro que quiere eliminar los conceptos de percepción y descuento seleccionados?';
            }


            mostrarMensaje(2, mensaje, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', 'Por favor espere…', 'Eliminando datos del concepto de percepción y descuento ');
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/configelementosalarialpersona/eliminarConceptoPagoDescuento',
                        method  : 'POST',
                        params  : {
                            arrayIdconceptoPd: Ext.encode(arrayIdconceptoPd),
                            checked          : ifchecked
                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 1) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                var mensaje = 'El  concepto de percepción y descuento asociado al elemento salarial al cargo ha sido eliminado satisfactoriamente.';
                                if (arrayIdconceptoPd.length > 1) {
                                    mensaje = 'Los  conceptos de percepción y descuento asociados al elemento salarial al cargo han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje, function (btn) {

                                });
                                //Recargando el grid de tipos de nómina.
                                vista.formularioConceptoSituacion.getForm().reset();
                                vista.gpConceptoSituacion.getStore().removeAll();
                                vista.gpEscalaXConceptoSituacion.getStore().removeAll();
                                vista.gpEscalaXConceptoSituacion.disable();
                                modelo.storeConceptoPDGridSituacion.baseParams.idcargosocupados = vista.idcargosocupados;
                                modelo.storeConceptoPDGridSituacion.load({params: {idcargosocupados: vista.idcargosocupados}});
                                vista.cambio = 0;
                                vista.btnEliminarConceptoSituacion.disable();
                                //este.btnAdicionarEscala.disable();
                                vista.btnModificarConceptoSituacion.disable();
                            } else {
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, "El  concepto de percepción y descuento eliminar esta siendo usado");
                            }
                        }
                    });
                }

            });
        }

        function AdicionarModConfiguracionEscala() {
            var urlAction = '/pvd/nomina/index.php/configelementosalarialpersona/adicionarEscalaXConcepto';
            var lbMsgEspera = 'Adicionando datos de la escala...';
            var lbMsgExito = 'La escala ha sido adicionado satisfactoriamente.';
            var idsituacionlaboral = vista.gpCargos.getSelectionModel().getSelected().get('idsituacionlaboral');
            var categoria = vista.cbCategoria.getValue();
            var arrayDatos = new Array();
            // console.info(categoria);
            var arreglo = vista.gpPersonas.stpersonabuscar.getRange();
            //  console.info(arreglo);
            Ext.each(arreglo, function (obj) {
                if (!obj.data.idcategoriapersona == categoria) { //milena
                    arrayDatos.push(obj.data.idpersona);
                }
            });

            if (vista.accion == 'Mod') {
                lbMsgEspera = 'Modificando datos del elemento salarial...';
                lbMsgExito = 'La escala ha sido modificado satisfactoriamente.';
                //urlAction = '/pvd/nomina/index.php/gpconceptosescalacomp/modificarEscalaXConcepto';
            }
            if (vista.cambio == 0) {
                if (vista.accionEscala == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaEscalaSituacion.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.cbEscalaSituacion.markInvalid('Este campo es obligatorio.');
                    vista.nfImporteSituacion.markInvalid('Este campo es obligatorio.');
                    vista.dfFInicioEscalaSituacion.markInvalid('Este campo es obligatorio.');
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            } else {
                if (vista.formularioEscalaSituacion.getForm().isValid()) {
                    if (vista.accionEscala == 'Mod') {
                        var idestructur = "";
                        var denomescala = vista.cbEscalaSituacion.getValue();
                        var escala = vista.cbEscalaSituacion.getRawValue();

                        if (vista.cbEscalaSituacion.tree.getSelectionModel().getSelectedNode() == null) {
                            idestructur = vista.gpEscalaXConceptoSituacion.getSelectionModel().getSelected().get('idescalatarifa');
                        } else if (vista.cbEscalaSituacion.tree.rendered && !isNaN(denomescala)) {
                            idestructur = vista.cbEscalaSituacion.tree.getSelectionModel().getSelectedNode().id;
                        } else {
                            idestructur = vista.gpEscalaXConceptoSituacion.getSelectionModel().getSelected().get('idescalatarifa');
                        }
                        var idescala = vista.cbEscalaSituacion.getRawValue();

                        /*if (isNaN(idescala)) {
                         idestructur = self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idescalatarifa');
                         } else {
                         idestructur = idescala;
                         }*/

                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmaskaddmodtipopago', 'Por favor espere…', 'Modificando datos de la escala');
                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            url     : '/pvd/nomina/index.php/configelementosalarialpersona/modificarEscalaXConcepto',
                            method  : 'POST',
                            params  : {idescalaelementosalarialsituacionservicio: vista.gpEscalaXConceptoSituacion.getSelectionModel().getSelected().get('idescalaelementosalarialsituacionservicio'),
                                idestructuraescalar                             : idestructur,
                                idconceptopercepciondescuento                   : vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptopercepciondescuento'),
                                importe                                         : vista.nfImporteSituacion.getValue(),
                                fechainicio                                     : vista.dfFInicioEscalaSituacion.getRawValue(),
                                fechafin                                        : vista.dfFFinEscalaSituacion.getRawValue(),
                                idconceptpelementsalarialessituacionservicio    : vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptpelementsalarialessituacionservicio'),
                                idcargosocupados                                : vista.idcargosocupados,
                                idsituacionlaboral                              : idsituacionlaboral,
                                idpersonas                                      : Ext.encode(arrayDatos),
                                identidad                                       : vista.idestructura
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);

                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmaskaddmodtipopago');

                                if (responseData.codMsg == 1) {
                                    mostrarMensaje(1, 'La escala ha sido modificada satisfactoriamente.', function () {
                                        if (!vista.boton) {
                                            vista.ventanaEscalaSituacion.hide();


                                        } else {
                                            vista.cbEscalaSituacion.focus(true, 500);
                                        }
                                        vista.formularioEscalaSituacion.getForm().reset();
                                        vista.gpEscalaXConceptoSituacion.getStore().removeAll();
                                        CargarEscalasXConcepto(-1, true);
                                        vista.cambio = 0;
                                        vista.btnEliminarEscalaSituacion.disable();
                                        vista.btnModificarEscalaSituacion.disable();
                                    });

                                } else {
                                    if (responseData.codMsg)
                                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                }
                            }
                        });
                    } else {
                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmaskaddmodtipopago', 'Por favor espere…', 'Adicionando datos del concepto de percepción y descuento');
                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            //milena adicionar escalas cuando la persona tiene situacion

                            url     : '/pvd/nomina/index.php/configelementosalarialpersona/adicionarEscalaXConcepto',
                            method  : 'POST',
                            params  : {
                                idestructuraescalar                         : vista.cbEscalaSituacion.getValue(),
                                idconceptopercepciondescuento               : vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptopercepciondescuento'),
                                importe                                     : vista.nfImporteSituacion.getValue(),
                                fechainicio                                 : vista.dfFInicioConceptoSituacion.getRawValue(),
                                fechafin                                    : vista.dfFFinConceptoSituacion.getRawValue(),
                                idconceptpelementsalarialessituacionservicio: vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptpelementsalarialessituacionservicio'),
                                idcargosocupados                            : vista.idcargosocupados,
                                idsituacionlaboral                          : idsituacionlaboral,
                                idpersonas                                  : Ext.encode(arrayDatos),
                                identidad                                   : vista.idestructura

                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);

                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmaskaddmodtipopago');

                                if (responseData.codMsg == 1) {
                                    mostrarMensaje(1, 'La escala ha sido adicionada satisfactoriamente.', function () {
                                        if (!vista.boton) {
                                            vista.ventanaEscalaSituacion.hide();
                                            vista.cbEscalaSituacion.reset();
                                        } else {
                                            vista.cbEscalaSituacion.focus(true, 500);
                                        }
                                        vista.formularioEscalaSituacion.getForm().reset();
                                        vista.cambio = 0;
                                        CargarEscalasXConcepto(-1, true);
                                    });

                                } else if (responseData.codMsg == 2) {
                                    mostrarMensaje(2, 'Ya existe una escala asociada a este concepto', function () {
                                        if (!vista.boton) {
                                            vista.ventanaEscalaSituacion.hide();

                                        } else {
                                            vista.cbEscalaSituacion.focus(true, 500);
                                        }
                                    });
                                } else {
                                    if (responseData.codMsg)
                                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                }
                            }
                        });
                    }
                } else {
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            }
        }

        function eliminarEscalaSituacion() {
            //Mostrando el mensaje para aceptar el eliminar.
            var idsituacionlaboral = vista.gpCargos.getSelectionModel().getSelected().get('idsituacionlaboral');
            var categoria = vista.cbCategoria.getValue();
            var arrayDatos = new Array();
            var arreglo = vista.gpPersonas.stpersonabuscar.getRange();
            Ext.each(arreglo, function (obj) {
                if (!obj.data.idcategoriapersona /*== categoria*/) { //milena
                    arrayDatos.push(obj.data.idpersona);
                }
            });
            mostrarMensaje(2, '¿Está seguro que quiere eliminar la escala?', function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', 'Por favor espere…', 'Eliminando datos de la escala...');
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/configelementosalarialpersona/eliminarEscalaXConcepto',
                        method  : 'POST',
                        params  : {idconfescala          : vista.gpEscalaXConceptoSituacion.getSelectionModel().getSelected().get('idescalaelementosalarialsituacionservicio'),
                            idconceptopercepciondescuento: vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptopercepciondescuento'),
                            idsituacionlaboral           : idsituacionlaboral,
                            idpersonas                   : Ext.encode(arrayDatos),
                            identidad                    : vista.idestructura
                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, 'La escala ha sido eliminada satisfactoriamente.', function (btn) {

                                });
                                //Recargando el grid de tipos de nómina.
                                vista.formularioEscalaSituacion.getForm().reset();
                                vista.gpEscalaXConceptoSituacion.getStore().removeAll();
                                var idconfconceptopercepciondescuento = vista.gpConceptoSituacion.getSelectionModel().getSelected().get('idconceptpelementsalarialessituacionservicio');
                                modelo.storeEscalaXConceptoGridSituacion.load({params: {idconfconcepto: idconfconceptopercepciondescuento}});
                                vista.cambio = 0;
                                vista.btnEliminarEscalaSituacion.disable();
                                //este.btnAdicionarEscala.disable();
                                vista.btnModificarEscalaSituacion.disable();
                            }
                        }
                    });
                }

            });
        }
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('configelementosalarialpersona', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    var modelo = Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona.Modelo;
    modelo.init(idioma);

    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

    /*Configuracion inicial
     //Hago la peticion para cargar los datos iniciales
     PVD.mostrarMascara('idmaskcargardatosconceptosgenerales', 'Por favor espere...', 'Cargando datos de conceptos generales de n&oacute;mina');
     Ext.Ajax.request({
     url: 'obtenerconfiguracioninicial',
     method:'POST',
     callback: function (options,success,response){
     PVD.ocultarMascara('idmaskcargardatosconceptosgenerales');
     //Inicializando el modelo
     var modelo = Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona.Modelo;
     modelo.init(idioma);

     modelo.datosModelo = Ext.decode(response.responseText);

     //Inicializando la vista.
     var vista = Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona.Vista;
     vista.init(perfil, idioma, modelo);

     //Inicializar controlador.
     Pvd.Nomina.Configuraciones.ConfigElementosSalarialPersona.Controlador.init(idioma, vista, modelo);
     UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
     }.createDelegate(this)
     });*/
});
