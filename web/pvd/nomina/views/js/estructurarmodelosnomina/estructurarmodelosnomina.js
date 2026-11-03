/**
 * Clase para estructurar los modelo de nominas.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.Configuraciones.EstructurarModelosNomina
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.Configuraciones.EstructurarModelosNomina');
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
//Modelo
Pvd.Nomina.Configuraciones.EstructurarModelosNomina.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function (idioma) {

        this.expanderTipoNomina = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smTipoNomina = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.smObjeto = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.smOperacion = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });

        this.smCentrosCosto = new Ext.grid.RowSelectionModel({
            singleSelect: false,
        });

        this.smEGasto = new Ext.grid.RowSelectionModel({
            singleSelect: false,
        });

        this.smEstructurarModeloNomina = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });

        this.smSyncConceptosContables = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });

        this.smConfiguracion = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.storeTipoNomina = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerListadoTiposNomina',
            sortInfo: {field: 'orden', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idtiponomina"},
                [
                    {name: 'idtiponomina'},
                    {name: 'denominacion'},
                    {name: 'acumulavacaciones'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'descripcion'},
                    {name: 'orden'}
                ])
        });

        this.storeObjeto = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerObjetos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idobjeto"},
                [
                    {name: 'idobjeto'},
                    {name: 'denominacion'}
                ])
        });

        this.storeOperacion = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerOperaciones',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idoperacion"},
                [
                    {name: 'idoperacion'},
                    {name: 'denominacion'}
                ])
        });

        this.storeCentrosCosto = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerCentrosCosto',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idcentrogrupo"},
                [
                    {name: 'idcentrogrupo'},
                    {name: 'denominacion'}
                ])
        });

        this.storeEGasto = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerElementosGasto',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idelementoobjeto"},
                [
                    {name: 'idelementoobjeto'},
                    {name: 'denominacion'}
                ])
        });

        this.storeSyncConceptosContables = new Ext.data.GroupingStore({
            groupField: 'denomtiponomina',
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerEstrucrurasNominaSincronizarConceptosContables',
            sortInfo: {field: 'orden', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idestructuramodelodomina"},
                [
                    {name: 'idestructuramodelodomina'},
                    {name: 'denominacion'},
                    {name: 'denomtiponomina'},
                    {name: 'idtipocampo'},
                    {name: 'orden'}
                ])
        });

        this.storeListadoEstructurarModeloNomina = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerListadoEstructurasNomina',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idestructuramodelodomina"},
                [
                    {name: 'idestructuramodelodomina'},
                    {name: 'idtiponomina'},
                    {name: 'denominacion'},
                    {name: 'descripcion'},
                    {name: 'idtipocampo'},
                    {name: 'denomtipocampo'},
                    {name: 'idvalormostrar'},
                    {name: 'mostrarvalor'},
                    {name: 'orden'},
                    {name: 'ordenreporte'},
                    {name: 'visible'},
                    {name: 'vervisible'},
                    {name: 'sc_4_01'},
                    {name: 'versc_4_01'},
                    {name: 'sc_4_06'},
                    {name: 'correo'},
                    {name: 'vercorreo'},
                    {name: 'talonario'},
                    {name: 'vertalonario'},
                    {name: 'versc_4_06'},
                    {name: 'valoresnegativos'},
                    {name: 'vervaloresnegativos'},
                    {name: 'acumulaliquida'},
                    {name: 'acumulaliquidanomina'},
                    {name: 'diasimporte'},
                    {name: 'descuento'},
                    {name: 'verdescuento'},
                    {name: 'esconceptopagosalario'},
                    {name: 'verconceptopagosalario'},
                    {name: 'idperiodo'},
                    {name: 'comportamientocorreo'},
                    {name: 'vercomportamientocorreo'},
                    {name: 'tiporeferencia'},
                    {name: 'idmessnc'},
                    {name: 'messnc'}
                ])
        });

        this.storeConfiguracion = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerListadoConfoguraciones',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idcontabilizacion"},
                [
                    {name: 'idcontabilizacion'},
                    {name: 'idoperacion'},
                    {name: 'denomoperacion'},
                    {name: 'idcentrogrupo'},
                    {name: 'denomcentrocosto'},
                    {name: 'idelementoobjeto'},
                    {name: 'denomelementodelgasto'}
                ])
        });

        this.storeTipoCampo = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerListadoTipoCampo',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idtipocampo"},
                [
                    {name: 'idtipocampo'},
                    {name: 'denomtipocampo'}
                ])
        });

        this.storeValorMostrar = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerListadoValorMostrar',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idvalormostrar"},
                [
                    {name: 'idvalormostrar'},
                    {name: 'mostrarvalor'}
                ])
        });

        this.storePeriodos = new Ext.data.SimpleStore({
            fields: [{name: 'idperiodo'}, {name: 'periodo'}]
        });

        var tipos = [[1, 'Mismo'], [2, '1 anterior'], [3, '2 anterior'], [4, '3 anterior'], [5, '4 anterior'], [6, '5 anterior'], [7, '6 anterior']];
        this.storePeriodos.loadData(tipos);
        this.storeAcumulaLiquida = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerAcumulacionLiquidacion',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idacumulaliquida"},
                [
                    {name: 'idacumulaliquida'},
                    {name: 'acumulaliquida'}
                ])
        });

        this.storeTiporeferencia = new Ext.data.SimpleStore({
            fields: [{name: 'tiporeferencia'}, {name: 'denomtiporeferencia'}]
        });

        var tiposreferencia = [[1, 'Rangos de fechas'], [2, 'Periodos especificos']];
        this.storeTiporeferencia.loadData(tiposreferencia);

        this.storeVacacionesDiasImporte = new Ext.data.Store({
            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerVacacionesDiasImporte',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idvacacionesdiasimporte"},
                [
                    {name: 'idvacacionesdiasimporte'},
                    {name: 'diasimporte'}
                ])
        });


        //Comportamiento Correo
        this.storeComportamientoCorreo = new Ext.data.SimpleStore({
            fields: [{name: 'idcomportamientocorreo'}, {name: 'comportamientocorreo'}]
        });
        var comportamiento = [[0, 'Sin comportamiento'], [1, 'Desglose SBC'], [2, 'Suma'], [3, 'Resta'], [4, 'Pago por resultado']];
        this.storeComportamientoCorreo.loadData(comportamiento);

        this.storeMesSNC = new Ext.data.SimpleStore({
            fields: [{name: 'idmessnc'}, {name: 'messnc'}]
        });
        var messnc = [[1, '1 Mes Anterior'], [2, '1 Mes Posterior']];
        this.storeMesSNC.loadData(messnc);
    }
};

//Vista
Pvd.Nomina.Configuraciones.EstructurarModelosNomina.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Estructurar modelos de nóminas (Tipo: Pvd.Nomina.Configuracion.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        var self = this;
        this.idestructura = 0;
        this.cambio = 0;
        this.boton = 0;
        this.idtiponomina = 0;
        this.arbol = '';
        this.textoformula = '';
        this.arrTipo = new Array();
        this.arrChecked = new Array();
        this.arrIdChecked = new Array();
        this.arrIndicadores = new Array();
        this.arrIndicadoresResult = new Array();
        this.arrIdValorMostrar = new Array();
        this.textoComparar = "";
        this.idexpresionmatematica = -1;
        this.textoConceptosSistemas = "";
        this.accion = 'Add';
        this.form = null;
        this.indice = 0;
        this.idestructurarselect = null;
        this.idconceptocondicionado = null;
        this.idexpresionmatematicacondicion = -1;
        this.idexpresionmatematicaconcepto = -1;
        this.idformulacondicionconcepto = null;
        this.camposEstructuraNomina = new Array();

        this.btnSubir = new Ext.Button({
            id: 'idbtnSubir',
            iconCls: 'subir',
            disabled: true,
            text: '<u>S</u>ubir',
            tooltip: 'Intercambiar orden hacia arriba (<b>Alt+S</b>)'
        });

        this.btnBajar = new Ext.Button({
            id: 'idbtnBajar',
            iconCls: 'bajar',
            disabled: true,
            text: '<u>B</u>ajar',
            tooltip: 'Intercambiar orden hacia abajo (<b>Alt+B</b>)'
        });

        this.btnGuardarOrden = new Ext.Button({
            id: 'btnGuardarOrden',
            iconCls: 'guardar',
            disabled: true,
            text: '<u>G</u>uardar',
            tooltip: 'Guardar los cambios (<b>Alt+G</b>)'
        });
        //*************Replicar************************************************************************************************************************
        this.filasSelecionadas = new Array();

        this.idEstructura = null;

        this.btnReplicarCamposEMN = new Ext.Button({
            id: 'idBtnReplicarCamposEMN',
            iconCls: 'adicionar',
            disabled: true,
            text: '<u>R</u>eplicar',
            tooltip: 'Replicar campos de la estructura del modelo de nómina (<b>Alt+R</b>)',
            handler: function () {
                self.ventanaTipoReplica.show();
                //self.winEstructuraReplicar.show();
            }.createDelegate(this)
        });

        this.btnAceptarReplicar = new Ext.Button({
            id: 'btnAceptarReplicar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });

        this.pobjestructuraReplicar = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 7,
            nivelachequear: [3, 5]

        });

        this.winEstructuraReplicar = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closeAction: 'hide',
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructuraReplicar],
            buttons: [this.btnAceptarReplicar]
        });

        //Tipo de replica, por entidades o por tipos de pago
        this.rbEntidades = new Ext.form.Radio({
            id: 'rbEntidades',
            boxLabel: 'Entidades',
            name: 'tiporeplica',
            checked: true,
            inputValue: 1,
            height: 25,
        });

        this.rbTiposPago = new Ext.form.Radio({
            id: 'rbTiposPago',
            boxLabel: 'Tipos de pago',
            name: 'tiporeplica',
            inputValue: 2,
            height: 25,
        });

        this.rgTipoReplica = new Ext.form.RadioGroup({
            region: 'center',
            width: 220,
            autoHeight: true,
            hideLabel: true,
            columns: [1, 1],
            items: [
                this.rbEntidades, this.rbTiposPago
            ]
        });

        this.formularioTipoReplica = new Ext.FormPanel({
            id: 'idformularioAsociasion',
            autoWidth: true,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                title: '',
                autoWidth: true,
                autoHeight: true,
                region: 'center',
                items: [
                    this.rgTipoReplica
                ]
            }]
        });

        this.btnAceptarTipoReplica = new Ext.Button({
            id: 'btnAceptarTipoReplica',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana'
        });

        this.btnCancelarTipoReplica = new Ext.Button({
            id: 'btnCancelarTipoReplica',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaTipoReplica = new Ext.Window({
            region: 'center',
            title: 'Tipos de r&eacute;plica',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
            items: [this.formularioTipoReplica],
            //buttons: [this.btnCancelarAsociacion, this.btnAceptarAsociacion]
            bbar: ['->', this.btnCancelarTipoReplica, this.btnAceptarTipoReplica]
        });

        //Tipos de pago a replicar
        this.objTiposPagoReplicar = new Pvd.nomina.nomencladores.ListarTiposPagoComp({
            title: 'Tipos de pago',
            border: true,
            multiselect: true,
            region: 'center',
            split: true,
            width: '100%',
            height: '100%'
        });

        this.btnAceptarTiposPagoreplicar = new Ext.Button({
            id: 'btnAceptarTiposPagoreplicar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btCancelarTiposPagoreplicar = new Ext.Button({
            id: 'btCancelarTiposPagoreplicar',
            text: 'Cancelar',
            tooltip: 'Cancelar',
            iconCls: 'cancelar',
            handler: function () {
            }.createDelegate(this)
        });

        this.winTiposPagosreplicar = new Ext.Window({
            title: 'Tipos de pago',
            modal: true,
            height: 500,
            width: 600,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.objTiposPagoReplicar],
            buttons: [this.btCancelarTiposPagoreplicar, this.btnAceptarTiposPagoreplicar]
        });
        //***********************************Eliminar para varias estructuras al mismo tiempo******************************************************************************
        this.btnAceptarEliminar = new Ext.Button({
            id: 'btnAceptarEliminar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.pobjestrucEliminar = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 5,
            nivelachequear: [3, 5]
        });

        this.winEstructuraEliminar = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closeAction: 'hide',
            //closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.pobjestrucEliminar],
            buttons: [this.btnAceptarEliminar]
        });
        //Sincronizar Conceptos contables
        this.btnSyncConceptosContables = new Ext.Button({
            id: 'btnSyncConceptosContables',
            text: 'S<u>y</u>nc Concep. Cont.',
            tooltip: 'Sincronizar conceptos contables (<b>Alt+Y</b>)',
            disabled: false,
            iconCls: 'sincronizar',
            handler: function () {
            }.createDelegate(this)
        });

        this.gpSyncConceptosContables = new Ext.grid.GridPanel({
            id: 'gpSyncConceptosContables',
            title: '',
            region: 'center',
            columns: [modelo.smSyncConceptosContables,
                {
                    header: 'idestructuramodelodomina',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestructuramodelodomina'
                },
                {header: 'Denominaci&oacute;n', width: 100, sortable: true, dataIndex: 'denominacion'},
                {
                    header: 'Tipo de n&oacute;mina',
                    width: 80,
                    sortable: true,
                    dataIndex: 'denomtiponomina',
                    hidden: true
                },
                {
                    header: 'Tipo de campo',
                    width: 80,
                    sortable: true,
                    dataIndex: 'idtipocampo',
                    renderer: mostrarTipoCampo
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.storeSyncConceptosContables,
            sm: modelo.smSyncConceptosContables,
            loadMask: {msg: idioma.lbMaskGridCargando}
        });

        function mostrarTipoCampo(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('idtipocampo') == 2) {
                return 'Pago';
            } else if (record.get('idtipocampo') == 3) {
                return 'Agrupados';
            } else if (record.get('idtipocampo') == 4) {
                return 'Referencias a n&oacuteminas';
            }
        }

        this.btnAceptarSyncConceptosContables = new Ext.Button({
            id: 'btnAceptarSyncConceptosContables',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btCancelarSyncConceptosContables = new Ext.Button({
            id: 'btCancelarSyncConceptosContables',
            text: 'Cancelar',
            tooltip: 'Cancelar',
            iconCls: 'cancelar',
            handler: function () {
            }.createDelegate(this)
        });

        this.winTiposbtCancelarSyncConceptosContables = new Ext.Window({
            title: 'Listado de Conceptos Contables a sincronizar',
            modal: true,
            height: 400,
            width: 400,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.gpSyncConceptosContables],
            buttons: [this.btCancelarSyncConceptosContables, this.btnAceptarSyncConceptosContables]
        });

        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 5,
            nivelchequear: 3,

        });

        this.btnAceptarEntidad = new Ext.Button({
            id: 'btnAceptarEntidad',
            text: idioma.BtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            //icon: perfil.dirImg+'aceptar.png',
            disabled: true,
            iconCls: 'aceptar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });

        this.winEstructura = new Ext.Window({
            title: idioma.lbTitleEntidades,
            modal: true,
            height: 350,
            constrain: true,
            width: 300,
            closable: false,
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructura],
            buttons: [this.btnAceptarEntidad],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarEntidad.handler();
                    }
                }
            ]
        });

        //Buttones de Add, Mod, Elim, Ayud de tipos de nómina.
        this.btnAdicionarModeloNomina = new Ext.Button({
            id: 'idbtnAdicionarModeloNomina',
            disabled: true,
            text: idioma.BtnAdicionar,
            tooltip: idioma.textToolTipAddModeloNomina,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaModeloNomina',
            nextTab: 'btnModificarModeloNomina',
        });

        this.btnModificarModeloNomina = new Ext.Button({
            id: 'idbtnModificarModeloNomina',
            disabled: true,
            text: idioma.BtnModificar,
            tooltip: idioma.textToolTipModModeloNomina,
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAdicionarModeloNomina',
            nextTab: 'btnEliminarModeloNomina',
        });

        this.btnEliminarModeloNomina = new Ext.Button({
            id: 'idbtnEliminarModeloNomina',
            disabled: true,
            text: idioma.BtnEliminar,
            tooltip: idioma.textToolTipDelModeloNomina,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModificarModeloNomina',
            nextTab: 'btnAyudaModeloNomina',
        });

        this.btnConfigurarContabilizacion = new Ext.Button({
            id: 'idbtnConfigurarContabilizacion',
            disabled: true,
            hidden: true,
            text: 'Configurar contabilizaci&oacute;n (<b>Alt+F</b>)',
            tooltip: 'Configurar contabilizaci&oacute;n',
            iconCls: 'contabilidad',
            prevTab: 'btnModificarModeloNomina',
            nextTab: 'btnAyudaModeloNomina',
        });

        this.btnAyudaModeloNomina = new Ext.Button({
            id: 'idbtnAyudaModeloNomina',
            text: idioma.BtnAyuda,
            tooltip: idioma.textToolTipAyModeloNomina,
            //icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnEliminarModeloNomina',
            nextTab: 'btnAdicionarModeloNomina',

        });

        //Buscador
        this.tfbuscarTipoNomina = new Ext.form.TextField({
            id: 'tfbuscarTipoNomina',
            allowBlank: true,
            minLength: 1,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar',
            name: 'tfbuscador'
        });
        this.btnBuscarTipoNomina = new Ext.Button({
            disabled: false,
            id: 'btnBuscarTipoNomina',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar tipo de n&oacute;mina <b>(Alt+N)</b>',
            handler: function () {
                modelo.storeTipoNomina.load({
                    params: {
                        start: 0,
                        limit: 1000,
                        criterio: self.tfbuscarTipoNomina.getValue()
                    }
                });
            }
        });
        this.tfBuscarCampoEMN = new Ext.form.TextField({
            id: 'tfBuscarCampoEMN',
            allowBlank: true,
            minLength: 1,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar',
            name: 'tfbuscador',
            disabled: true
        });

        this.btnBuscarCampoEMN = new Ext.Button({
            disabled: true,
            id: 'btnBuscarCampoEMN',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar campo estructura modelo n&oacute;mina <b>(Alt+C)</b>',
            handler: function () {
                modelo.storeListadoEstructurarModeloNomina.load({
                    params: {
                        criterio: self.tfBuscarCampoEMN.getValue(),
                        start: 0,
                        limit: 1000
                    }
                });
            }
        });

        this.gpTipoNomina = new Ext.grid.GridPanel({
            id: 'gpTipoNomina',
            title: idioma.lbTitleTiposNomina,
            region: 'center',
            columns: [
                {header: 'idtiponomina', hidden: true, hideable: false, dataIndex: 'idtiponomina'},
                {header: idioma.lbColDenomTipoNomina, width: 420, sortable: true, dataIndex: 'denominacion'},
                {header: 'Orden', width: 50, sortable: true, dataIndex: 'orden', type: 'string'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeTipoNomina,
            sm: modelo.smTipoNomina,
            plugins: modelo.expanderTipoNomina,
            loadMask: {msg: idioma.lbMaskGridCargando},
            tbar: [this.tfbuscarTipoNomina, this.btnBuscarTipoNomina],
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeTipoNomina,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });

        //Elementos del grid de los GestConvenioss
        this.expanderDescripcion = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<b>Descripci&oacute;n:</b>&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.gpEstructurarNomina = new Ext.grid.GridPanel({
            id: 'gpEstructurarNomina',
            title: idioma.lbTitlePanelEstructurar,
            disabled: true,
            region: 'center',
            columns: [
                modelo.smEstructurarModeloNomina,
                this.expanderDescripcion,
                {header: 'Denominaci&oacute;n', width: 80, sortable: true, dataIndex: 'denominacion'},
                {header: 'Tipo de campo', width: 240, sortable: true, dataIndex: 'denomtipocampo'},
                {header: 'Valor a mostrar', width: 80, sortable: true, dataIndex: 'mostrarvalor'},
                {
                    header: '<center>Acumula/Liquida</center>',
                    width: 60,
                    sortable: true,
                    dataIndex: 'acumulaliquida',
                    renderer: mostrarAcumulaLiquida
                }, {
                    header: '<center>Vacaciones D&iacute;as/Importe</center>',
                    width: 60,
                    sortable: true,
                    dataIndex: 'diasimporte',
                    renderer: mostrarVacacionesDiasImporte
                },
                {header: 'Concepto pago salario', width: 60, sortable: true, dataIndex: 'verconceptopagosalario'},
                {header: 'Reporte de descuentos aplicados', width: 60, sortable: true, dataIndex: 'verdescuento'},
                {header: 'Acepta valores negativos', width: 60, sortable: true, dataIndex: 'vervaloresnegativos'},
                {header: 'Orden', width: 40, sortable: true, dataIndex: 'orden'},
                {header: 'Orden reporte', width: 40, sortable: true, dataIndex: 'ordenreporte'},
                {header: 'Visible', width: 40, sortable: true, dataIndex: 'vervisible'},
                {header: 'Visible SC-4-01', width: 60, sortable: true, dataIndex: 'versc_4_01'},
                {header: 'Visible SC-4-06', width: 60, sortable: true, dataIndex: 'versc_4_06'},
                {header: 'Talonario', width: 30, sortable: true, dataIndex: 'vertalonario'},
                {header: 'Mes Acumula SNC', width: 30, sortable: true, dataIndex: 'messnc'},
                {header: 'Comportamiento correo', sortable: true, dataIndex: 'vercomportamientocorreo'},

                {header: 'comportamientocorreo', sortable: true, hidden: true, dataIndex: 'comportamientocorreo'},
                {header: 'sc_4_01', sortable: true, hidden: true, dataIndex: 'sc_4_01'},
                {header: 'sc_4_06', sortable: true, hidden: true, dataIndex: 'sc_4_06'},
                {header: 'talonario', sortable: true, hidden: true, dataIndex: 'talonario'},
                {header: 'concepto pago salario', sortable: true, hidden: true, dataIndex: 'esconceptopagosalario'},
                {header: 'valoresnegativos', sortable: true, hidden: true, dataIndex: 'valoresnegativos'},
                {header: 'tiporeferencia', sortable: true, hidden: true, dataIndex: 'tiporeferencia'}

            ],
            stripeRows: true,
            border: false,
            width: '100%',
            heigth: '100%',
            plugins: this.expanderDescripcion,
            viewConfig: {forceFit: true},
            store: modelo.storeListadoEstructurarModeloNomina,
            sm: modelo.smEstructurarModeloNomina,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeListadoEstructurarModeloNomina,
                /*store: modelo.storeListadoEstructurarModeloNomina.load({
                   params: {
                       idtiponomina: self.idtiponomina,
                       idestructura: self.idestructura
                   }
                }),*/
                displayInfo: true
            })
        });

        function mostrarAcumulaLiquida(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('acumulaliquidanomina') == 1) {
                if (record.get('acumulaliquida') == 1) {
                    return '<center>Acumulaci&oacute;n en d&iacute;as</center>';
                } else if (record.get('acumulaliquida') == 2) {
                    return '<center>Acumulaci&oacute;n en importe</center>';
                } else {
                    return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cancelar.png" height=16 width=16 /></center>';
                }
            } else if (record.get('acumulaliquidanomina') == 2) {
                if (record.get('acumulaliquida') == 1) {
                    return '<center>Liquidaci&oacute;n en d&iacute;as</center>';
                } else if (record.get('acumulaliquida') == 2) {
                    return '<center>Liquidaci&oacute;n en importe</center>';
                } else {
                    return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cancelar.png" height=16 width=16 /></center>';
                }
            } else if (record.get('acumulaliquidanomina') == 4) {
                if (record.get('acumulaliquida') == 1) {
                    return '<center>Acumulaci&oacute;n en d&iacute;as</center>';
                } else if (record.get('acumulaliquida') == 2) {
                    return '<center>Acumulaci&oacute;n en importe</center>';
                }
                if (record.get('acumulaliquida') == 3) {
                    return '<center>Liquidaci&oacute;n en d&iacute;as</center>';
                } else if (record.get('acumulaliquida') == 4) {
                    return '<center>Liquidaci&oacute;n en importe</center>';
                } else {
                    return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cancelar.png" height=16 width=16 /></center>';
                }
            } else {
                return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cancelar.png" height=16 width=16 /></center>';
            }
        }

        function mostrarVacacionesDiasImporte(val, metaData, record, rowIndex, colIndex, store) {
            return (record.get('diasimporte') != 0) ? (record.get('diasimporte') == 1) ?
                '<center>Vacaciones en d&iacute;as</center>' :
                '<center>Vacaciones en importe</center>' :
                '<center><img src="/lib/ExtJS/temas/default/images/iconos/cancelar.png" height=16 width=16 /></center>';
        }

        this.panelTiposNomina = new Ext.Panel({
            id: 'idpanelTiposNomina',
            layout: 'fit',
            region: 'west',
            height: '100%',
            width: '30%',
            split: true,
            border: true,
            items: [this.gpTipoNomina]
        });

        this.pEstructurarNomina = new Ext.Panel({
            id: 'idpEstructurarNomina',
            region: 'center',
            height: 300,
            width: '70%',
            split: true,
            layout: 'fit',
            tbar: [this.btnAdicionarModeloNomina, this.btnModificarModeloNomina, this.btnEliminarModeloNomina, '|',
                this.btnSubir, this.btnBajar, this.btnGuardarOrden, '|', this.tfBuscarCampoEMN, this.btnBuscarCampoEMN,
                '->', this.btnReplicarCamposEMN, this.btnSyncConceptosContables, this.btnConfigurarContabilizacion, '->', this.btnAyudaModeloNomina],
            items: [this.gpEstructurarNomina],
            keys: [
                {
                    key: 'n',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnBuscarTipoNomina.handler();
                    }
                },
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarModeloNomina.disabled) {
                            self.btnEliminarModeloNomina.handler();
                        }
                    }
                },
                {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionarModeloNomina.handler();
                    }
                },
                {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarModeloNomina.disabled) {
                            self.btnModificarModeloNomina.handler();
                        }
                    }
                },
                {
                    key: 's',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnSubir.disabled) {
                            self.btnSubir.handler();
                        }
                    }
                },
                {
                    key: 'b',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnBajar.disabled) {
                            self.btnBajar.handler();
                        }
                    }
                },
                {
                    key: 'r',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnReplicarCamposEMN.disabled) {
                            self.btnReplicarCamposEMN.handler();
                        }
                    }
                }, {
                    key: 'c',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnBuscarCampoEMN.disabled) {
                            self.btnBuscarCampoEMN.handler();
                        }
                    }
                }, {
                    key: 'g',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnGuardarOrden.disabled) {
                            self.btnGuardarOrden.handler();
                        }
                    }
                }
            ]
        });

        //Campos ventana
        //1era fila
        this.tfDenominacion = new Ext.form.TextField({
            id: 'idtfDenominacion',
            fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2,
            name: 'denominacion',
            vtype : 'vtdenominaciones',
            allowBlank: false,
            anchor: '95%',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100,
            prevTab: 'idbtnAceptar',
            nextTab: 'idcbTipoCampo'
        });
        this.cbTipoCampo = new Ext.form.ComboBox({
            id: 'idcbTipoCampo', fieldLabel: idioma.lbColcbTipoCampo,
            tabIndex: 1, valueField: 'idtipocampo',
            displayField: 'denomtipocampo', hiddenName: 'idtipocampo',
            allowBlank: false, mode: 'local',
            prevTab: 'idtfDenominacion',
            nextTab: 'idcbAcumulacionLiquidacion',
            store: modelo.storeTipoCampo, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });
        this.cbTipoReferencia = new Ext.form.ComboBox({
            id: 'cbTipoReferencia', fieldLabel: 'Tipo de referencia',
            tabIndex: 1, valueField: 'tiporeferencia',
            displayField: 'denomtiporeferencia', hiddenName: 'tiporeferencia',
            allowBlank: true, mode: 'local',
            store: modelo.storeTiporeferencia, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '98%', value: 1,
            disabled: true
        });
        this.cbValorMostrar = new Ext.form.ComboBox({
            id: 'idcbValorMostrar', fieldLabel: idioma.lbColcbValorMostrar,
            tabIndex: 1, valueField: 'idvalormostrar',
            displayField: 'mostrarvalor', hiddenName: 'idvalormostrar',
            allowBlank: false, mode: 'local',
            store: modelo.storeValorMostrar, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%',
            prevTab: 'idcbVacacionesDiasImporte',
            nextTab: 'idnfOrden',
            disabled: true
        });
        this.cbPeriodos = new Ext.form.ComboBox({
            id: 'cbPeriodos', fieldLabel: 'Per&iacute;odos',
            tabIndex: 1, valueField: 'idperiodo',
            displayField: 'periodo', hiddenName: 'idperiodo',
            allowBlank: true, mode: 'local',
            store: modelo.storePeriodos, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '98%',
            disabled: true
        });
        //2da fila
        this.cbAcumulacionLiquidacion = new Ext.form.ComboBox({
            id: 'idcbAcumulacionLiquidacion', fieldLabel: idioma.lbColcbAcumulacionLiquidacion,
            tabIndex: 1, valueField: 'idacumulaliquida',
            displayField: 'acumulaliquida', hiddenName: 'idacumulaliquida',
            allowBlank: false, mode: 'local',
            store: modelo.storeAcumulaLiquida, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%',
            prevTab: 'idcbTipoCampo',
            nextTab: 'idcbVacacionesDiasImporte',
            disabled: true
        });
        this.cbVacacionesDiasImporte = new Ext.form.ComboBox({
            id: 'idcbVacacionesDiasImporte', fieldLabel: idioma.lbColcbVacacionesDiasImporte,
            tabIndex: 1, valueField: 'idvacacionesdiasimporte',
            displayField: 'diasimporte', hiddenName: 'idvacacionesdiasimporte',
            allowBlank: false, mode: 'local',
            store: modelo.storeVacacionesDiasImporte, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%',
            prevTab: 'idcbAcumulacionLiquidacion',
            nextTab: 'idcbValorMostrar'
        });
        this.cbDescuento = new Ext.form.Checkbox({
            id: 'idcbDescuento',
            fieldLabel: idioma.lbcbDescuento,
            bottonAlign: 'center',
            tabIndex: 2, name: 'descuento', anchor: '90%',
            prevTab: 'idnfOrdenReporte', nextTab: 'idcbAceptaValoresNegativos'

        });
        this.cbAceptaValoresNegativos = new Ext.form.Checkbox({
            id: 'idcbAceptaValoresNegativos',
            fieldLabel: idioma.lbcbAceptaValoresNegativos,
            bottonAlign: 'center',
            tabIndex: 2, name: 'valoresnegativos', anchor: '90%',
            prevTab: 'idcbDescuento', nextTab: 'idcbConceptoPagoSalario'
        });
        this.cbConceptoPagoSalario = new Ext.form.Checkbox({
            id: 'idcbConceptoPagoSalario',
            fieldLabel: idioma.lbcbConceptoPagoSalario,
            bottonAlign: 'center',
            tabIndex: 2, name: 'esconceptopagosalario', anchor: '98%',
            prevTab: 'idcbAceptaValoresNegativos', nextTab: 'idcbVisible'
        });
        //3era fila
        this.cbVisible = new Ext.form.Checkbox({
            id: 'idcbVisible',
            fieldLabel: idioma.lbcbVisible,
            bottonAlign: 'center',
            tabIndex: 2, name: 'visible', anchor: '90%',
            prevTab: 'idcbConceptoPagoSalario', nextTab: 'idcbSC_4_01',
            checked: true
        });
        this.nfOrden = new Ext.form.NumberField({
            id: 'idnfOrden', fieldLabel: idioma.lbColDenominacionOrden,
            tabIndex: 2, name: 'orden', allowBlank: false, anchor: '90%',
            blankText: idioma.lbErrorCampoVacio, prevTab: 'idcbValorMostrar', nextTab: 'idnfOrdenReporte'
        });
        this.cbSC_4_01 = new Ext.form.Checkbox({
            id: 'idcbSC_4_01',
            fieldLabel: idioma.lbColcbSC_4_01,
            bottonAlign: 'center',
            tabIndex: 2, name: 'sc_4_01', anchor: '90%',
            prevTab: 'idcbVisible', nextTab: 'idcbSC_4_06',
            checked: true
        });
        this.cbSC_4_06 = new Ext.form.Checkbox({
            id: 'idcbSC_4_06',
            fieldLabel: idioma.lbColcbSC_4_06,
            bottonAlign: 'center',
            tabIndex: 2, name: 'sc_4_06', anchor: '90%',
            prevTab: 'idcbSC_4_01', nextTab: 'idbtnCancelar',
            checked: true
        });
        this.nfOrdenReporte = new Ext.form.NumberField({
            id: 'idnfOrdenReporte', fieldLabel: idioma.lbColnfOrdenReporte,
            tabIndex: 2, name: 'ordenreporte', allowBlank: false, anchor: '98%',
            blankText: idioma.lbErrorCampoVacio,
            prevTab: 'idnfOrden', nextTab: 'idcbDescuento'
        });
        //4ta fila
        this.cbTalonario = new Ext.form.Checkbox({
            id: 'cbTalonario',
            fieldLabel: 'Visible talonario',
            bottonAlign: 'center',
            tabIndex: 2, name: 'talonario', anchor: '90%',
            prevTab: 'idcbSC_4_01', nextTab: 'idbtnCancelar',
            checked: true
        });
        this.cbCorreo = new Ext.form.Checkbox({
            id: 'cbCorreo',
            fieldLabel: 'Visible correo',
            bottonAlign: 'center',
            tabIndex: 2, name: 'correo', anchor: '90%',
            prevTab: 'cbTalonario', nextTab: 'idbtnCancelar',
            checked: true,
            listeners: {
                'check': function (combo, selected) {
                    (selected) ? self.cbComportamientoCorreo.enable() : self.cbComportamientoCorreo.disable();
                }
            }
        });
        this.cbComportamientoCorreo = new Ext.form.ComboBox({
            id: 'cbComportamientoCorreo', fieldLabel: 'Comportamiento correo',
            tabIndex: 1, valueField: 'idcomportamientocorreo',
            displayField: 'comportamientocorreo', hiddenName: 'idcomportamientocorreo',
            allowBlank: true, mode: 'local',
            store: modelo.storeComportamientoCorreo, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '99%',// disabled: true,
            value: 0,
            hiden: true
        });

        this.cbMesSNC = new Ext.form.ComboBox({
            id: 'cbMesSNC', fieldLabel: 'Mes Acumla SNC',
            tabIndex: 1, valueField: 'idmessnc',
            displayField: 'messnc', hiddenName: 'idmessnc',
            allowBlank: true, mode: 'local',
            store: modelo.storeMesSNC, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            triggerAction: 'all', anchor: '99%'
        });
        //5ta fila
        this.taDescripcion = new Ext.form.TextArea({
            id: 'idtaDescripcion',
            fieldLabel: 'Descripci&oacute;n',
            name: 'descripcion',
            hiddenname: 'descripcion',
            allowBlank: true,
            maxLength: 255,
            maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 255 caracteres.',
            anchor: '99.5%',
            blankText: idioma.lbErrorCampoVacio

        });

        //Buttons
        this.btnCancelar = new Ext.Button({
            id: 'idbtnCancelar',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            prevTab: 'idcbSC_4_06', nextTab: 'idbtnAplicar'
        });
        this.btnAplicar = new Ext.Button({
            id: 'idbtnAplicar',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: 'Guardar datos y limpiar los campos (<b>Alt+P</b>)',
            prevTab: 'idbtnCancelar',
            nextTab: 'idbtnAceptar'
        });
        this.btnAceptar = new Ext.Button({
            id: 'idbtnAceptar',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            prevTab: 'idbtnAplicar',
            nextTab: 'idtfDenominacion'
        });

        //Formulario
        this.formulario = new Ext.FormPanel({
            id: 'idformlarioTipoN',
            labelAlign: 'top',
            frame: true,
            width: 850,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .2, layout: 'form', items: [this.tfDenominacion]},
                        {columnWidth: .2, layout: 'form', items: [this.cbTipoCampo]},
                        {columnWidth: .2, layout: 'form', items: [this.cbTipoReferencia]},
                        {columnWidth: .2, layout: 'form', items: [this.cbValorMostrar]},
                        {columnWidth: .2, layout: 'form', items: [this.cbPeriodos]}
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .2, layout: 'form', items: [this.cbAcumulacionLiquidacion]},
                        {columnWidth: .2, layout: 'form', items: [this.cbVacacionesDiasImporte]},
                        {columnWidth: .2, layout: 'form', items: [this.cbDescuento]},
                        {columnWidth: .2, layout: 'form', items: [this.cbAceptaValoresNegativos]},
                        {columnWidth: .2, layout: 'form', items: [this.cbConceptoPagoSalario]}
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .2, layout: 'form', items: [this.cbVisible]},
                        {columnWidth: .2, layout: 'form', items: [this.nfOrden]},
                        {columnWidth: .2, layout: 'form', items: [this.cbSC_4_01]},
                        {columnWidth: .2, layout: 'form', items: [this.cbSC_4_06]},
                        {columnWidth: .2, layout: 'form', items: [this.nfOrdenReporte]}
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .4, layout: 'form', items: [this.cbTalonario]},
                        {columnWidth: .6, layout: 'form', items: [this.cbMesSNC]}
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: 1, layout: 'form', items: [this.taDescripcion]}
                    ]
                }
            ]
        });
        /* this.windowArbol = new Pvd.Nomina.Configuraciones.window.winSeleccionarDPA({
         idtiponomina: -1,
         });*/

        this.ventana = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            autoHeight: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formulario],
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptar.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelar.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicar.handler();
                    }
                }
            ]
        });
        /*Grid de objetos/Operaciones/Centros de Costo/Elementos del Gasto*/
        this.gpObjetos = new Ext.grid.GridPanel({
            id: 'gpObjetos',
            layout: 'fit',
            height: 510,
            title: 'Objetos',
            region: 'center',
            columns: [
                {header: 'idobjeto', hidden: true, hideable: false, dataIndex: 'idobjeto'},
                {header: 'Objeto', width: 420, sortable: true, dataIndex: 'denominacion'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            viewConfig: {forceFit: true},
            store: modelo.storeObjeto,
            sm: modelo.smObjeto,
            loadMask: {msg: idioma.lbMaskGridCargando}
        });

        this.gpOperacion = new Ext.grid.GridPanel({
            id: 'gpOperacion',
            layout: 'fit',
            height: 510,
            title: 'Operaciones',
            region: 'center',
            columns: [modelo.smOperacion, {
                header: 'idoperacion',
                hidden: true,
                hideable: false,
                dataIndex: 'idoperacion'
            }, {header: 'Operacion', width: 420, sortable: true, dataIndex: 'denominacion'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            viewConfig: {forceFit: true},
            store: modelo.storeOperacion,
            sm: modelo.smOperacion,
            loadMask: {msg: idioma.lbMaskGridCargando}
        });

        this.gpCentrosCosto = new Ext.grid.GridPanel({
            id: 'gpCentrosCosto',
            layout: 'fit',
            height: 510,
            title: 'Centros de costo',
            region: 'center',
            columns: [
                {header: 'idcentrogrupo', hidden: true, hideable: false, dataIndex: 'idcentrogrupo'},
                {header: 'C.C', width: 420, sortable: true, dataIndex: 'denominacion'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            viewConfig: {forceFit: true},
            store: modelo.storeCentrosCosto,
            sm: modelo.smCentrosCosto,
            loadMask: {msg: idioma.lbMaskGridCargando}
        });

        this.gpEGasto = new Ext.grid.GridPanel({
            id: 'gpEGasto',
            layout: 'fit',
            height: 510,
            title: 'Elementos del gasto',
            region: 'center',
            columns: [
                {header: 'idelementoobjeto', hidden: true, hideable: false, dataIndex: 'idelementoobjeto'},
                {header: 'E. gasto', width: 420, sortable: true, dataIndex: 'denominacion'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            viewConfig: {forceFit: true},
            store: modelo.storeEGasto,
            sm: modelo.smEGasto,
            loadMask: {msg: idioma.lbMaskGridCargando}
        });

        this.gpConfiguracion = new Ext.grid.GridPanel({
            id: 'gpConfiguracion',
            layout: 'fit',
            //height:600,
            title: 'Configuraci&oacute;n',
            region: 'center',
            columns: [
                {header: 'idcontabilizacion', hidden: true, hideable: false, dataIndex: 'idcontabilizacion'},
                {header: 'idoperacion', hidden: true, hideable: false, dataIndex: 'idoperacion'},
                {header: 'Operaci&oacute;n ', hideable: false, dataIndex: 'denomoperacion'},
                {header: 'idcentrogrupo', hidden: true, hideable: false, dataIndex: 'idcentrogrupo'},
                {header: 'C.C', hideable: false, dataIndex: 'denomcentrocosto'},
                {header: 'idelementoobjeto', hidden: true, hideable: false, dataIndex: 'idelementoobjeto'},
                {header: 'E. gasto', hideable: false, dataIndex: 'denomelementodelgasto'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            viewConfig: {forceFit: true},
            store: modelo.storeConfiguracion,
            sm: modelo.smConfiguracion,
            loadMask: {msg: idioma.lbMaskGridCargando}
        });

        /*Ventana con formulario para la contabilizacion*/
        this.formularioContabilizacion = new Ext.FormPanel({
            id: 'formularioContabilizacion',
            labelAlign: 'top',
            layout: 'fit',
            frame: true,
            //height: 600,
            width: '100%',
            height: '100%',
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .23,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'panel',
                                    border: true,
                                    layout: 'fit',
                                    items: [this.gpObjetos]
                                }
                            ]
                        },
                        {
                            columnWidth: .06,
                            layout: 'form',
                            anchor: '100%'
                        },
                        {
                            columnWidth: .23,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'panel',
                                    border: true,
                                    frame: false,
                                    layout: 'fit',
                                    items: [this.gpOperacion]
                                }
                            ]
                        },
                        {
                            columnWidth: .23,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'panel',
                                    border: true,
                                    layout: 'fit',
                                    items: [this.gpCentrosCosto]
                                }
                            ]
                        },
                        {
                            columnWidth: .06,
                            layout: 'form',
                            anchor: '100%'
                        },
                        {
                            columnWidth: .23,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'panel',
                                    border: true,
                                    frame: false,
                                    layout: 'fit',
                                    items: [this.gpEGasto]
                                }
                            ]
                        }
                    ]
                }
            ],
        });

        this.btnCancelarContabilizacion = new Ext.Button({
            id: 'btnCancelarContabilizacion',
            iconCls: 'cancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            // prevTab: 'iddfFFin',
            // nextTab: 'idbtnAplicar',
        });

        this.btnAplicarContabilizacion = new Ext.Button({
            id: 'btnAplicarContabilizacion',
            iconCls: 'aplicar',
            //icon: perfil.dirImg + 'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: 'Guardar datos y limpiar los campos (<b>Alt+P</b>)',
            // prevTab: 'idbtnAceptar',
            // nextTab: 'idbtnCancelar',
        });

        this.btnAceptarContabilizacion = new Ext.Button({
            id: 'btnAceptarContabilizacion',
            iconCls: 'aceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            //prevTab: 'idtfDenominacion',
            // nextTab: 'idbtnAplicar',
        });

        this.ventanaContabilizacion = new Ext.Window({
            modal: true,
            height: 600,
            width: 800,
            constrain: true,
            closeAction: 'hide',
            maximized: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioContabilizacion],
            buttons: [this.btnCancelarContabilizacion, this.btnAplicarContabilizacion, this.btnAceptarContabilizacion],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarContabilizacion.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarContabilizacion.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarContabilizacion.handler();
                    }
                }
            ]
        });

        ///////////////////////////////////Ventana Arbol//////////////////////////////////////////
        this.fpConceptosSistemas = new Pvd.Nomina.Configuraciones.form.FormSeleccionarDPA({
            id: 'fpConceptosSistemas',
            idtiponomina: this.idtiponomina,
            idestructura: this.idestructura,
        });

        this.btnAcpConceptosSistemas = new Ext.Button({
            disabled: false,
            id: 'btnAcpConceptosSistemas',
            // icon:perfil.dirImg+'aceptar.png',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
        });

        this.btnCancConceptosSistemas = new Ext.Button({
            disabled: false,
            id: 'btnCancConceptosSistemas',
            //icon:perfil.dirImg+'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
        });

        this.winSeleccionarConceptosSistemas = new Ext.Window({
            id: 'idwinSeleccionarConceptosSistemas',
            modal: true,
            layout: 'fit',
            constrain: true,
            closeAction: 'hide',
            title: 'Arbol de conceptos y sistemas de pago',
            resizable: false,
            width: 300,
            height: 380,
            buttons: [this.btnCancConceptosSistemas, this.btnAcpConceptosSistemas],
            items: [this.fpConceptosSistemas],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAcpConceptosSistemas.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancConceptosSistemas.handler();
                    }
                }
            ]
        });

        /*
         * Ventana general
         */
        this.winMostrarPaneles = new Ext.Window({
            modal: true,
            height: 600,
            width: 800,
            constrain: true,
            closeAction: 'hide',
            maximized: true,
            closable: true,
            resizable: false,
            layout: 'border',
            items: [this.pEstructurarNomina, this.panelTiposNomina]
        });
    }
};

//Controlador
Pvd.Nomina.Configuraciones.EstructurarModelosNomina.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Vista)
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo)
     */
    init: function (idioma, vista, modelo) {
        var tiporeplica = 1;
        //this.identidad = null;
        this.nodosseleccionados = new Array();
        this.nodosseleccionadosaeliminar = new Array();
        vista.pobjestructura.on('estructuraselecionada', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
            vista.btnAceptarEntidad.enable();
            vista.idestructura = nodo.id;

            //}
        }.createDelegate(this));

        vista.btnAceptarEntidad.setHandler(function () {
            vista.winMostrarPaneles.show();
            modelo.storeTipoNomina.load({params: {limit: 1000, start: 0}});
            modelo.storeTipoCampo.load();
            modelo.storeVacacionesDiasImporte.load();
        }.createDelegate(this));

        vista.btnSubir.setHandler(function () {

            vista.btnGuardarOrden.enable();
            var indexOriginal = modelo.smEstructurarModeloNomina.last;
            var indexPrevio = modelo.smEstructurarModeloNomina.last - 1;
            if (modelo.smEstructurarModeloNomina.hasPrevious()) {
                vista.btnBajar.enable();
                var indexOriginal = modelo.smEstructurarModeloNomina.last;
                var indexPrevio = modelo.smEstructurarModeloNomina.last - 1;

                invertirOrden(vista.gpEstructurarNomina.getStore(), indexPrevio, indexOriginal);
                modelo.smEstructurarModeloNomina.selectRow(indexPrevio);
            } else {
                vista.btnSubir.disable();
            }
        }.createDelegate(this));

        vista.btnBajar.setHandler(function () {
            vista.btnGuardarOrden.enable();
            var indexOriginal = modelo.smEstructurarModeloNomina.last;
            var indexPrevio = modelo.smEstructurarModeloNomina.last + 1;
            if (modelo.smEstructurarModeloNomina.hasNext()) {
                vista.btnSubir.enable();
                var indexOriginal = modelo.smEstructurarModeloNomina.last;
                var indexPrevio = modelo.smEstructurarModeloNomina.last + 1;
                invertirOrden(vista.gpEstructurarNomina.getStore(), indexPrevio, indexOriginal);
                modelo.smEstructurarModeloNomina.selectRow(indexPrevio);
            } else {
                vista.btnBajar.disable();
            }

        }.createDelegate(this));

        vista.btnGuardarOrden.setHandler(function () {
            var filasModificadas = dameIdOrden(vista.gpEstructurarNomina.getStore().modified);
            PVD.mostrarMascara('idMasGuardarOrden', 'Por favor espere...', 'Modificando orden de tipos de nóminas');
            /* PVD.mostrarMascara('idmaskadd', 'Por favor espere...', 'Enviando datos');
             Ext.Ajax.request({
             url: 'guardarFormulaCondicion',
             params:{idformulacondicionconcepto: vista.idformulacondicionconcepto,
             idexpresionmatematicacondicion: idexpresionmatematicacondicion,
             idconceptocondicionado: vista.idconceptocondicionado},
             callback: function(options, succes, response){
             PVD.ocultarMascara('idmaskadd');
             var respuesta = Ext.decode(response.responseText);
             if(respuesta== 'ok'){
             vista.idexpresionmatematicacondicion = -1;
             mostrarMensaje(1, 'La f&oacute;rmula de la condici&oacute;n fue guardada satisfactoriamente');
             modelo.storeConceptosCondicionados.load({params: {idestructuramodelodomina: vista.gpEstructurarNomina.getSelectionModel().getSelected().get('idestructuramodelodomina')}});
             }
             }*/
            Ext.Ajax.request({
                url: 'modificarOrdenEstructurasNomina',
                params: {
                    filasModificadas: Ext.encode(filasModificadas)
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idMasGuardarOrden');
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(1, 'Los tipos de nóminas han sido modificados satisfactoriamente.');
                        modelo.storeListadoEstructurarModeloNomina.load({
                            params: {
                                start: 0,
                                limit:1000
                            }
                        });

                    } else {
                        mostrarMensaje(3, 'Ocurrió un error al modificar los tipos de nóminas.');
                    }
                }
            });


        }.createDelegate(this));

        vista.winEstructura.show();

        modelo.storeListadoEstructurarModeloNomina.on('beforeload', function(){
            modelo.storeListadoEstructurarModeloNomina.baseParams.idtiponomina = vista.idtiponomina;
            modelo.storeListadoEstructurarModeloNomina.baseParams.idestructura = vista.idestructura
        })

        //Eventos del seleccion model del grid de tipos de nómina.
        modelo.smTipoNomina.on('rowselect', function () {
            vista.gpEstructurarNomina.enable();
            vista.idtiponomina = vista.gpTipoNomina.getSelectionModel().getSelected().get('idtiponomina');
            modelo.storeListadoEstructurarModeloNomina.load({
                params: {
                    start: 0,
                    limit: 1000
                }
            });
            vista.btnAdicionarModeloNomina.enable();
            vista.tfBuscarCampoEMN.enable();
            vista.btnBuscarCampoEMN.enable();
            vista.btnEliminarModeloNomina.disable();
            vista.btnModificarModeloNomina.disable();
            verificarAcumulacionLiquidacion();
            obtenerCamposEstructurasNominas(vista.idestructura, vista.idtiponomina);
        });

        //Eventos del seleccion model del grid de modelo de nómina.
        modelo.smEstructurarModeloNomina.on('rowselect', function () {
            vista.btnEliminarModeloNomina.enable();
            vista.btnModificarModeloNomina.enable();
            vista.btnConfigurarContabilizacion.enable();
            vista.btnSubir.enable();
            vista.btnBajar.enable();
            vista.btnReplicarCamposEMN.enable();

        });

        vista.gpObjetos.selModel.on('rowselect', function (gp, elm, i) {
            modelo.storeOperacion.load({params: {idobjeto: gp.getSelected().get('idobjeto')}});
        });

        vista.gpOperacion.selModel.on('rowselect', function (gp, elm, i) {
            modelo.storeCentrosCosto.load({params: {idoperacion: gp.getSelected().get('idoperacion')}});
        });

        vista.gpCentrosCosto.selModel.on('rowselect', function (gp, elm, i) {
            modelo.storeEGasto.load({
                params: {
                    idcentrogrupo: gp.getSelected().get('idcentrogrupo'),
                    idoperacion: vista.gpOperacion.getSelectionModel().getSelected().get('idoperacion')
                }
            });
        }.createDelegate(this));

        vista.btnAdicionarModeloNomina.setHandler(function () {
            mostrarVentanaAdicionar();
        });

        vista.btnModificarModeloNomina.setHandler(function () {
            mostrarVentanaModificar();
        });

        vista.btnEliminarModeloNomina.setHandler(function () {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminar, function (btn) {
                if (btn == "ok") {
                    vista.winEstructuraEliminar.show();
                }
            });

        });

        vista.btnSyncConceptosContables.on('click', function () {
            modelo.storeSyncConceptosContables.load({params: {idestructura: vista.idestructura}});
            vista.winTiposbtCancelarSyncConceptosContables.show();
        });

        vista.btCancelarSyncConceptosContables.on('click', function () {
            vista.winTiposbtCancelarSyncConceptosContables.hide();
        });

        vista.btnAceptarSyncConceptosContables.on('click', function () {
            var arrayidestnom = new Array();
            var arrayestructurasnominasync = vista.gpSyncConceptosContables.getSelectionModel().getSelections();
            for (var i = 0; i < arrayestructurasnominasync.length; i++) {
                arrayidestnom[i] = arrayestructurasnominasync[i].data.idestructuramodelodomina;
            }
            sincronizarConceptosContables(arrayidestnom);
        });

        function sincronizarConceptosContables(arrayidestnom) {
            mostrarMensaje(2, 'Est&aacute; seguro que desea sincronizar las Estructuras de N&oacute;mina como Conceptos contables', function (btn) {
                if (btn == 'ok') {
                    PVD.mostrarMascara('sync', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'sincronizarConceptosContables',
                        method: 'POST',
                        params: {
                            arrayidestnom: Ext.encode(arrayidestnom),
                            idestructura: vista.idestructura
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('sync');
                            var respuesta = Ext.decode(response.responseText);
                            if (respuesta == 'ok') {
                                mostrarMensaje(1, 'Las Estructuras de N&oacute;mina fueron sincronizadas como Conceptos contables satisfactoriamente');
                            }
                            vista.winTiposbtCancelarSyncConceptosContables.hide();
                        }
                    });
                }
            })
        }

        vista.gpSyncConceptosContables.getSelectionModel().on('rowselect', function (gp, index, rec) {
            if (gp.hasSelection()) {
                vista.btnAceptarSyncConceptosContables.enable();
            } else {
                vista.btnAceptarSyncConceptosContables.disable();
            }
        }.createDelegate(this));

        vista.gpSyncConceptosContables.getSelectionModel().on('rowdeselect', function (gp, index, rec) {
            if (gp.hasSelection()) {
                vista.btnAceptarSyncConceptosContables.enable();
            } else {
                vista.btnAceptarSyncConceptosContables.disable();
            }
        }.createDelegate(this));

        //Eventos del botón configurar contabilizacion.
        /* vista.btnConfigurarContabilizacion.on('click', function() {
         modelo.storeObjeto.load();
         modelo.storeOperacion.removeAll();
         modelo.storeCentrosCosto.removeAll();
         modelo.storeEGasto.removeAll();
         vista.ventanaContabilizacion.show();
         });*/
        vista.btnConfigurarContabilizacion.setHandler(function () {
            modelo.storeObjeto.load();
            modelo.storeOperacion.removeAll();
            modelo.storeCentrosCosto.removeAll();
            modelo.storeEGasto.removeAll();
            vista.ventanaContabilizacion.show();
        });

        //Evento del combo tipo campo
        vista.cbTipoCampo.on('select', function (cb, n, o) {
            var idtipocampo = cb.getValue();
            if (idtipocampo == 4) {
                vista.cbPeriodos.enable();
                vista.cbPeriodos.setValue(1);
                vista.cbTipoReferencia.enable();
                vista.cbTipoReferencia.setValue(1);
            }
            modelo.storeValorMostrar.removeAll();
            modelo.storeValorMostrar.load({params: {idtipocampo: idtipocampo}});
            vista.cbValorMostrar.setValue('');
            vista.cbValorMostrar.enable();
            if (idtipocampo == 3) {
                var arr = new Array();
                Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/estructurarmodelosnomina/cargarDatosIndicadores',
                    method: 'POST',
                    params: {idtiponomina: vista.idtiponomina},
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        vista.arrIndicadores = responseData;
                        vista.arrIndicadoresResult = ConvertiraArreglo(vista.arrIndicadores);
                    }
                });
            }
            // }
        });

        vista.cbTipoReferencia.on('select', function (cb, n, o) {
            if (cb.getValue() == 1) {
                vista.cbPeriodos.setValue('');
                vista.cbPeriodos.enable();
            } else {
                vista.cbPeriodos.setValue('');
                vista.cbPeriodos.disable();
            }
        });

        //Evento del combo tipo campo
        vista.cbValorMostrar.on('focus', function (cb) {
            vista.idexpresionmatematica = -1;
            vista.textoComparar = vista.cbValorMostrar.getValue();
            if (vista.accion == 'Mod') {
                vista.arrIdValorMostrar = vista.gpEstructurarNomina.getSelectionModel().getSelected().get('idvalormostrar');
            } else {
                vista.arrIdValorMostrar = null
            }
            var idtipocampo = vista.cbTipoCampo.getValue();
            if (idtipocampo == 2) {
                vista.form = new Pvd.Nomina.Configuraciones.form.FormSeleccionarDPA({
                    id: 'fpConceptosSistemas',
                    accion: vista.accion,
                    idtiponomina: vista.idtiponomina,
                    idestructura: vista.idestructura,
                    arrnodos: Ext.encode(vista.arrIdValorMostrar)
                });
                vista.winSeleccionarConceptosSistemas.add(vista.form);
                vista.winSeleccionarConceptosSistemas.show();

            } else if (idtipocampo == 3) {
                if (vista.accion == 'Mod') {
                    idvalorgrid = vista.gpEstructurarNomina.getSelectionModel().getSelected().get('idvalormostrar');
                    if (!isNaN(idvalorgrid)) {
                        vista.idexpresionmatematica = idvalorgrid;
                    } else {
                        vista.idexpresionmatematica = -1;
                    }
                } else {
                    vista.idexpresionmatematica = -1;
                }

                var arrDatos = vista.gpEstructurarNomina.getStore().getRange();
                var arrIndicadores = new Array();
                for (var i = 0; i < arrDatos.length; i++) {
                    if (arrDatos[i].data.idtipocampo != 1) {
                        var a = new Array();
                        a[0] = arrDatos[i].data.idestructuramodelodomina;
                        a[1] = arrDatos[i].data.denominacion;
                        a[2] = "Indicadores";
                        arrIndicadores.push(a);
                    }
                }

                this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                    title: 'Editor de expresiones matem&aacute;ticas',
                    idexpresionmatematica: (vista.accion == 'ADD' ? -1 : vista.idexpresionmatematica),
                    indicadores: arrIndicadores,
                    agrupado: 1,
                    mostrarCondicionales: true,
                    campoagrupar: 'Tipo',
                    mostrarFunciones: 2,
                    operadoresMostrar: [],
                    mostrarDenominacion: false
                });
                this.objExpMat.on('expresionsalvada', function (arr) {
                    vista.textoformula = arr.elementosMostrar;
                    vista.idexpresionmatematica = arr.idexpresionmatematica;
                    vista.cbValorMostrar.setValue(arr.elementosMostrar);
                    this.objExpMat.close();
                }.createDelegate(this));

                this.objExpMat.show();
            } else if (idtipocampo == 4) {
                if (vista.accion == 'Mod') {
                    idvalorgrid = vista.gpEstructurarNomina.getSelectionModel().getSelected().get('idvalormostrar');
                    if (!isNaN(idvalorgrid)) {
                        vista.idexpresionmatematica = idvalorgrid;
                    } else {
                        vista.idexpresionmatematica = -1;
                    }
                } else {
                    vista.idexpresionmatematica = -1;
                }

                this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                    title: 'Editor de expresiones matem&aacute;ticas',
                    idexpresionmatematica: (vista.accion == 'ADD' ? -1 : vista.idexpresionmatematica),
                    indicadores: vista.camposEstructuraNomina,
                    agrupado: 1,
                    campoagrupar: 'Tipo',
                    mostrarFunciones: 2,
                    mostrarCondicionales: true,
                    operadoresMostrar: [],
                    mostrarDenominacion: false
                });

                this.objExpMat.on('expresionsalvada', function (arr) {
                    vista.textoformula = arr.elementosMostrar;
                    vista.idexpresionmatematica = arr.idexpresionmatematica;
                    vista.cbValorMostrar.setValue(arr.elementosMostrar);
                    this.objExpMat.close();
                }.createDelegate(this));

                this.objExpMat.show();
            }
        });

        //Cambiar Accion 1era fila
        vista.tfDenominacion.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });
        vista.cbTipoCampo.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });
        vista.cbValorMostrar.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });
        vista.cbPeriodos.on('change', function () {
            vista.cambio = 1;
        });
        vista.cbTipoReferencia.on('change', function () {
            vista.cambio = 1;
        });
        //Cambiar Accion 2da fila
        vista.cbAcumulacionLiquidacion.on('change', function () {
            vista.cambio = 1;
        });
        vista.cbVacacionesDiasImporte.on('change', function () {
            vista.cambio = 1;
        });
        vista.cbDescuento.on('check', function (c, b) {
            vista.cambio = 1;
        });
        vista.cbAceptaValoresNegativos.on('check', function (c, b) {
            vista.cambio = 1;
        });
        vista.cbConceptoPagoSalario.on('check', function (c, b) {
            vista.cambio = 1;
        });

        //Cambiar Accion 3era fila
        vista.cbVisible.on('check', function (c, b) {
            vista.cambio = 1;
        });
        vista.nfOrden.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });
        vista.cbSC_4_01.on('check', function (c, b) {
            vista.cambio = 1;
        });
        vista.cbSC_4_06.on('check', function (c, b) {
            vista.cambio = 1;
        });
        vista.nfOrdenReporte.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        //Cambiar Accion 4ta fila
        vista.cbTalonario.on('check', function (c, b) {
            vista.cambio = 1;
        });
        vista.cbCorreo.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });
        vista.cbMesSNC.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });
        vista.cbComportamientoCorreo.on('change', function () {
            vista.cambio = 1;
        });

        //Cambiar Accion 5ta fila
        vista.taDescripcion.on('change', function (tf, n, o) {
            vista.cambio = 1;
        });

        //Eventos del botón aceptar.
        vista.btnAceptar.setHandler(function () {
            if (vista.cbConceptoPagoSalario.getValue() == false) {
                salvarFormulario(false);
                vista.ventana.hide();
                //Validando que no halla otro campo de acreditacion del salario
            } else {
                PVD.mostrarMascara('validarConceptoPagoSalario', 'Por favor espere...', 'Validando el Campo: Concepto pago salario.');
                Ext.Ajax.request({
                    url: 'validarConceptoPagoSalario',
                    method: 'POST',
                    params: {
                        identidad: vista.idestructura,
                        idtiponomina: vista.idtiponomina,
                        accion: vista.accion,
                        idestructurarmodelosnomiona: (vista.accion == 'Add')?(null):(vista.gpEstructurarNomina.getSelectionModel().getSelected().get('idestructuramodelodomina'))
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('validarConceptoPagoSalario');
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta == 'EXISTE-1') {
                            mostrarMensaje(3, 'Ya existe un campo con Concepto Pago Salario activo para este Tipo de N&oacute;mina en esta Entidad.');
                        } else if (respuesta == 'NO-EXISTE-1') {
                            salvarFormulario(false);
                            vista.ventana.hide();
                        }
                    }
                });
            }

        });

        vista.btnAplicar.setHandler(function () {
            vista.boton = 1;
            salvarFormulario();
        });

        vista.btnCancelar.setHandler(function () {
            vista.ventana.hide();
        });

        vista.btnCancelarContabilizacion.setHandler(function () {
            vista.ventanaContabilizacion.hide();
        });

        vista.btnAceptarContabilizacion.setHandler(function () {
            guardarConfiguracionContabilizacion();
        });

        vista.btnCancConceptosSistemas.setHandler(function () {
            ocultarArbol();
        });

        vista.btnAcpConceptosSistemas.setHandler(function () {
            capturarValoresArbol();
        });

        vista.cbTipoCampo.on('select', function (cb) {
            var acumulaliquida = vista.gpTipoNomina.getSelectionModel().getSelected().get('acumulavacaciones');
            if (acumulaliquida != 3) {
                if (cb.getValue() == 2 || cb.getValue() == 4 || cb.getValue() == 3) {
                    vista.cbAcumulacionLiquidacion.enable();
                    vista.cbVacacionesDiasImporte.enable();
                } else {
                    vista.cbAcumulacionLiquidacion.disable();
                    vista.cbAcumulacionLiquidacion.clearValue();

                    vista.cbVacacionesDiasImporte.disable();
                    vista.cbVacacionesDiasImporte.clearValue();
                }
            } else {
                vista.cbAcumulacionLiquidacion.disable();
                vista.cbAcumulacionLiquidacion.clearValue();

                vista.cbVacacionesDiasImporte.disable();
                vista.cbVacacionesDiasImporte.clearValue();
            }
            if (cb.getValue() == 4) {
                vista.cbPeriodos.enable();
            } else {
                vista.cbPeriodos.setValue();
                vista.cbPeriodos.disable();
                vista.cbTipoReferencia.setValue();
                vista.cbTipoReferencia.disable();
            }

        });

        //************************Replicar***************************//
        var arrayConceptos = new Array();
        vista.gpEstructurarNomina.getSelectionModel().on('rowselect', function (sm, index, rec) {
            vista.btnModificarModeloNomina.enable();
            vista.btnEliminarModeloNomina.enable();
            vista.btnReplicarCamposEMN.enable();
            vista.cbPeriodos.disable();

            var id = rec.id;
            var indiceFila = vista.filasSelecionadas.indexOf(id);
            if (indiceFila == -1) {
                vista.filasSelecionadas.push(id);
            }
            arrayConceptos = vista.filasSelecionadas;
        }.createDelegate(this));

        vista.gpEstructurarNomina.getSelectionModel().on('rowdeselect', function (sm, index, rec) {

            var id = rec.id;
            var indiceFila = vista.filasSelecionadas.indexOf(id);
            vista.filasSelecionadas.remove(id);
            if (vista.filasSelecionadas == 0) {
                vista.btnModificarModeloNomina.disable();
                vista.btnEliminarModeloNomina.disable();
                vista.btnReplicarCamposEMN.disable();
            }
            arrayConceptos = vista.filasSelecionadas;
        }.createDelegate(this));

        //Replica
        vista.pobjestructuraReplicar.on('uncheckednode', function (sm, nodo) {
            if (nodo.attributes.id != vista.idestructura) {
                var index = this.nodosseleccionados.indexOf(nodo.attributes.id);
                if (index > -1) {
                    this.nodosseleccionados.splice(index, 1);
                }
            }

        }.createDelegate(this));

        vista.pobjestructuraReplicar.on('checkednode', function (sm, nodo) {
            if (nodo.attributes.id != vista.idestructura) {
                this.nodosseleccionados.push(nodo.attributes.id);
            }
        }.createDelegate(this));

        vista.pobjestructuraReplicar.on('estructuraselecionada', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
            vista.btnAceptarReplicar.enable();
            vista.idEstructura = nodo.id;
            //}
        }.createDelegate(this));

        vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().on('rowselect', function (sm, index, r) {
            vista.btnAceptarTiposPagoreplicar.enable();
        });

        vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().on('rowdeselect', function (sm, index, r) {
            vista.btnAceptarTiposPagoreplicar.disable();
        });

        vista.btnCancelarTipoReplica.on('click', function () {
            vista.ventanaTipoReplica.hide();
        });

        vista.btnAceptarTipoReplica.on('click', function () {
            if (vista.rbTiposPago.getGroupValue() == 1) {
                tiporeplica = 1;//Entidades
                vista.winEstructuraReplicar.show();
            } else {
                tiporeplica = 2;//Tipos pagos
                vista.winTiposPagosreplicar.show();
                vista.objTiposPagoReplicar.Cargar();
            }
        });

        vista.btCancelarTiposPagoreplicar.on('click', function () {
            vista.winTiposPagosreplicar.hide();
        });

        vista.btnAceptarTiposPagoreplicar.on('click', function () {
            replicarDatos(vista.idestructura);
        }.createDelegate(this));

        vista.btnAceptarReplicar.setHandler(function () {
            replicarDatos();
        }.createDelegate(this));

        function replicarDatos(identidad) {
            var arrEntidades = new Array();
            var arrTiposPagosReplicar = new Array();
            if (tiporeplica == 1) {
                var s = vista.pobjestructuraReplicar.getSeleccionados();
                if (s.length <= 0) {
                    mostrarMensaje(3, 'Debe seleccionar una entidad.');
                    return;
                }

                for (var i = 0; i < s.length; i++) {
                    if (s[i].id != this.identidad) {
                        arrEntidades.push(s[i].id);
                    }
                }
                arrTiposPagosReplicar[0] = vista.gpTipoNomina.getSelectionModel().getSelected().data.idtiponomina;
            } else if (tiporeplica == 2) {
                arrEntidades[0] = identidad;
                if (vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().hasSelection()) {
                    var datostipospago = vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().getSelections();
                    Ext.each(datostipospago, function (rec) {
                        arrTiposPagosReplicar.push(rec.get('idtipopago'));
                    });
                }
            }


            var arrConceptos = new Array();
            var ac = vista.gpEstructurarNomina.getSelectionModel().getSelections();
            for (var i = 0; i < ac.length; i++) {
                arrConceptos.push(ac[i].data.idestructuramodelodomina);
            }
            if ((tiporeplica == 1 && arrEntidades.length > 0) || (tiporeplica == 2 && arrTiposPagosReplicar.length > 0)) {
                PVD.mostrarMascara('idbtnAceptarReplicar', 'Por favor espere...', 'Replicando las estructuras de nóminas');
                Ext.Ajax.request({
                    url: 'replicarconfiguracionesconceptosgeneralesnomina',
                    method: 'POST',
                    params: {
                        idConceptos: Ext.encode(arrConceptos),
                        arrEstructuras: Ext.encode(arrEntidades),
                        arrTiposPagosReplicar: Ext.encode(arrTiposPagosReplicar),
                        identidad: identidad,
                        tiporeplica: tiporeplica

                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('idbtnAceptarReplicar');
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.codigo == 'ADD-1') {
                            mostrarMensaje(1, 'Los campos de la estructura de la nómina han sido replicados satisfactoriamente.');

                        } else if (respuesta.codigo == 'NO-MODELO-NOMINA') {
                            mostrarMensaje(3, 'Por favor configure los m&oacute;delos de n&oacute;minas de los pagos seleccionados.');
                        }
                        vista.winEstructuraReplicar.hide();
                        vista.objTiposPagoReplicar.hide();
                        vista.ventanaTipoReplica.hide();
                    }
                });
            } else {
                mostrarMensaje(3, 'Por favor seleccione las entidades o los tipos de pagos');
            }
        }

        function dameIdOrden(array) {
            var miArray = new Array();
            for (var i = 0; i < array.length; i++) {
                miobjeto = {
                    idestructuramodelodomina: array[i].data.idestructuramodelodomina,
                    orden: array[i].data.orden
                }
                miArray.push(miobjeto);
            }
            return miArray;
        }

        function invertirOrden(storeOriginal, indexPrevio, indexOriginal) {
            var filaOriginal = storeOriginal.getAt(indexOriginal);
            var filaPrevia = storeOriginal.getAt(indexPrevio);
            var ordenOriginal = filaOriginal.data.orden;
            var ordenPrevio = filaPrevia.data.orden;

            storeOriginal.remove(filaOriginal);
            storeOriginal.insert(indexPrevio, filaOriginal);

            storeOriginal.getAt(indexOriginal).set('orden', ordenOriginal);
            storeOriginal.getAt(indexPrevio).set('orden', ordenPrevio);
            return storeOriginal;
        }

        function ocultarArbol() {
            vista.winSeleccionarConceptosSistemas.hide();
        }

        function ConvertiraArreglo(arrObj) {
            var a = new Array();
            for (var i = 0; i < arrObj.length; i++) {
                var arr = new Array();
                arr[0] = arrObj[i].idestructuramodelodomina;
                arr[1] = arrObj[i].denominacion;
                arr[2] = arrObj[i].agrupador;
                a[i] = arr;
            }
            return a;
        }

        function capturarValoresArbol() {

            var arrChecked = vista.form.items.items[1].getSelectionModel().tree.getChecked();
            var arrIdCheck = new Array();
            var arrtipoarbol = new Array();
            for (var j = 0; j < arrChecked.length; j++) {
                arrIdCheck[j] = arrChecked[j].id;
                arrtipoarbol[j] = arrChecked[j].attributes.tipo;
                if (j == arrChecked.length - 1) {
                    vista.textoConceptosSistemas = vista.textoConceptosSistemas + arrChecked[j].text;
                } else {
                    vista.textoConceptosSistemas = vista.textoConceptosSistemas + arrChecked[j].text + ',';
                }
            }
            if (vista.textoComparar != vista.textoConceptosSistemas) {
                vista.cambio = 1;
            }
            vista.arrTipo = arrtipoarbol;
            vista.arrIdChecked = arrIdCheck;
            vista.cbValorMostrar.setValue("");
            vista.cbValorMostrar.setValue(vista.textoConceptosSistemas);
            vista.textoConceptosSistemas = "";
            vista.winSeleccionarConceptosSistemas.hide();
        }

        function verificarAcumulacionLiquidacion() {
            var acumulaliquida = vista.gpTipoNomina.getSelectionModel().getSelected().get('acumulavacaciones');
            modelo.storeAcumulaLiquida.load({params: {acumulaliquida: acumulaliquida}});
            if (acumulaliquida != 3) {
                vista.cbAcumulacionLiquidacion.enable();

            } else {
                vista.cbAcumulacionLiquidacion.disable();
            }

        }

        /*
         *Función de mostrar la ventana de adicionar modelos de nómina.
         */
        function mostrarVentanaAdicionar() {
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerOrdenDisponible',
                method: 'POST',
                params: {identidad: vista.idestructura, idtiponomina: vista.idtiponomina},
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    //Acciones de la ventana adicionar
                    vista.cbPeriodos.disable();
                    vista.cbTipoReferencia.disable();
                    vista.cbTipoCampo.enable();
                    vista.formulario.getForm().reset();
                    vista.tfDenominacion.focus(true, 500);
                    vista.ventana.setTitle(idioma.lbTitleVentAdicionar);
                    vista.btnAplicar.show();
                    vista.ventana.show();
                    vista.btnCancelar.setNextElement('idbtnAplicar');
                    vista.btnAceptar.setPreviousElement('idbtnAplicar');
                    vista.accion = 'Add';
                    vista.cbAcumulacionLiquidacion.clearValue();
                    vista.cbVacacionesDiasImporte.clearValue();
                    vista.nfOrden.setValue(responseData.orden);
                    vista.nfOrdenReporte.setValue(responseData.ordenreporte);
                }
            });
        }

        function mostrarVentanaModificar() {
            vista.ventana.setTitle(idioma.lbTitleVentModificar);
            vista.cbTipoCampo.disable();
            vista.btnAplicar.hide();
            vista.tfDenominacion.focus(true, 500);
            vista.ventana.show();
            vista.formulario.getForm().loadRecord(vista.gpEstructurarNomina.getSelectionModel().getSelected());
            vista.cbTipoReferencia.setValue(vista.gpEstructurarNomina.getSelectionModel().getSelected().get('tiporeferencia'));
            console.info(vista.gpEstructurarNomina.getSelectionModel().getSelected());
            vista.cbValorMostrar.setValue(vista.gpEstructurarNomina.getSelectionModel().getSelected().get('mostrarvalor'));
            vista.cbAcumulacionLiquidacion.setValue(vista.gpEstructurarNomina.getSelectionModel().getSelected().get('acumulaliquida'));
            vista.cbVacacionesDiasImporte.setValue(vista.gpEstructurarNomina.getSelectionModel().getSelected().get('diasimporte'));
            vista.cbComportamientoCorreo.setValue(vista.gpEstructurarNomina.getSelectionModel().getSelected().get('comportamientocorreo'));
            var idtipocampo = vista.cbTipoCampo.getValue();

            modelo.storeValorMostrar.load({params: {idtipocampo: idtipocampo}});
            vista.accion = 'Mod';
            //Actualizar la tabulación deL formulario.
            vista.btnCancelar.setNextElement('idbtnAceptar');
            vista.btnAceptar.setPreviousElement('idbtnCancelar');
            vista.cbValorMostrar.enable();
            if (idtipocampo == 3) {
                Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/estructurarmodelosnomina/cargarDatosIndicadores',
                    method: 'POST',
                    params: {idtiponomina: vista.idtiponomina},
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        vista.arrIndicadores = responseData;
                        vista.arrIndicadoresResult = ConvertiraArreglo(vista.arrIndicadores);
                    }
                });
            }
            if (idtipocampo == 4) {
                vista.cbPeriodos.enable();
                vista.cbTipoReferencia.enable();
            } else {
                vista.cbPeriodos.disable();
                vista.cbTipoReferencia.disable();
            }
        }

        function guardarConfiguracionContabilizacion() {
            var idestructuramodelodomina = vista.gpEstructurarNomina.getSelectionModel().getSelected().get('idestructuramodelodomina');
            if (vista.gpObjetos.getSelectionModel().hasSelection()) {
                var idobjeto = vista.gpObjetos.getSelectionModel().getSelected().get('idobjeto');
            } else {
                mostrarMensaje(3, 'Por favor seleccione un objeto');
            }
            if (vista.gpOperacion.getSelectionModel().hasSelection()) {
                var idoperacion = vista.gpOperacion.getSelectionModel().getSelected().get('idoperacion');
            } else {
                mostrarMensaje(3, 'Por favor seleccione una operaci&oacute;n');
            }
            if (vista.gpCentrosCosto.getSelectionModel().hasSelection()) {
                var idcentrogrupo = vista.gpCentrosCosto.getSelectionModel().getSelected().get('idcentrogrupo');
            }
            if (vista.gpEGasto.getSelectionModel().hasSelection()) {
                var idelementodelgasto = vista.gpEGasto.getSelectionModel().getSelected().get('idelementoobjeto');
            }
            if (idobjeto && idoperacion) {
                PVD.mostrarMascara('idmaskaddmodconfcont', 'Enviando datos de la configuracion', 'Por favor espere...');
                Ext.Ajax.request({
                    url: 'guardarConfiguracionContabilizacion',
                    method: 'POST',
                    params: {
                        idestructuramodelodomina: idestructuramodelodomina,
                        idobjeto: idobjeto,
                        idoperacion: idoperacion,
                        idcentrogrupo: idcentrogrupo,
                        idelementodelgasto: idelementodelgasto,
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);

                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddmodconfcont');
                        if (responseData == "Ok") {
                            mostrarMensaje(1, "La configuraci&oacute;n se adicion&oacute; satisfactoriamente", function (btn) {
                                if (btn == 'ok') {
                                    modelo.storeCentrosCosto.load({params: {idoperacion: vista.gpOperacion.getSelectionModel().getSelected().get('idoperacion')}});
                                    modelo.storeEGasto.reload();
                                }
                            });
                        } else {
                            mostrarMensaje(3, "No se pudo adicionar la configuraci&oacute;n");
                        }


                    }
                });
            }

        }

        function salvarFormulario() {
            var arrValores = new Array();
            var cbvalormostrarcampo = vista.cbValorMostrar.getValue() + '';
            var descuento = (vista.cbDescuento.checked == true) ? 1 : 0;
            var visible = 0;
            var SC_4_01 = 0;
            var SC_4_06 = 0;
            var talonario = 0;
            var correo = 0;
            var comportamientocorreo = 0;
            var aceptavaloresnegativos = 0;
            var conceptopagosalario = 0;
            var idvalormostrar = 0;
            var idestructuramodelodomina = 0;
            var escampopersona = '';

            var urlAction = '/pvd/nomina/index.php/estructurarmodelosnomina/adicionarEstructurasNomina';
            var lbMsgEspera = idioma.lbMsgAdicionar;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionado;
            if (vista.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificar;
                lbMsgExito = idioma.lbMsgCorrectoModificado;
                urlAction = '/pvd/nomina/index.php/estructurarmodelosnomina/modificarEstructurasNomina';
                idestructuramodelodomina = vista.gpEstructurarNomina.getSelectionModel().getSelected().get('idestructuramodelodomina');
            }

            if (vista.cambio == 0) {
                if (vista.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventana.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenominacion.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido
                if (vista.formulario.getForm().isValid()) {
                    var cbTipoCampo = vista.cbTipoCampo.getValue() + "";
                    switch (cbTipoCampo) {
                        case '1':
                            idvalormostrar = cbvalormostrarcampo;
                            //Para salvar el codigo de si es un campo de persona
                            switch (cbvalormostrarcampo) {
                                case '1':
                                    escampopersona = 'cargo';
                                    break;
                                case '2' :
                                    escampopersona = 'sitlaboral';
                                    break;
                                case '3' :
                                    escampopersona = 'sexo';
                                    break;
                                case '4' :
                                    escampopersona = 'nombreapellidos';
                                    break;
                                case '5' :
                                    escampopersona = 'catpersona';
                                    break;
                                case '6' :
                                    escampopersona = 'catocupacional';
                                    break;
                                case '7' :
                                    escampopersona = 'numidentidad';
                                    break;
                                default :
                                    escampopersona = 'grado';
                                    break;
                            }
                            break;
                        case '2':
                            if (vista.arrIdChecked.length > 0) {
                                arrValores = vista.arrIdChecked;
                            } else {
                                arrValores = vista.gpEstructurarNomina.getSelectionModel().getSelected().get('idvalormostrar');
                            }
                            break;
                        case '3':
                            idvalormostrar = (vista.accion == 'Add') ? vista.idexpresionmatematica : vista.gpEstructurarNomina.getSelectionModel().getSelected().get('idvalormostrar');
                            break;
                        case '4':
                            idvalormostrar = (vista.accion == 'Add') ? vista.idexpresionmatematica : vista.gpEstructurarNomina.getSelectionModel().getSelected().get('idvalormostrar');
                            break;
                    }
                    visible = (vista.cbVisible.checked == true) ? 1 : 0;
                    SC_4_01 = (vista.cbSC_4_01.checked == true) ? 1 : 0;
                    SC_4_06 = (vista.cbSC_4_06.checked == true) ? 1 : 0;
                    talonario = (vista.cbTalonario.checked == true) ? 1 : 0;
                    correo = (vista.cbCorreo.checked == true) ? 1 : 0;
                    if (vista.cbCorreo.checked) {
                        vista.cbComportamientoCorreo.enable();
                        comportamientocorreo = vista.cbComportamientoCorreo.getValue();
                    } else {
                        comportamientocorreo = 0;
                        vista.cbComportamientoCorreo.disable();
                    }
                    aceptavaloresnegativos = (vista.cbAceptaValoresNegativos.checked == true) ? 1 : 0;
                    conceptopagosalario = (vista.cbConceptoPagoSalario.checked == true) ? 1 : 0;

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtipopago', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idestructuramodelodomina: idestructuramodelodomina,
                            idtiponomina: vista.idtiponomina,

                            denominacion: vista.tfDenominacion.getValue(),
                            descripcion: vista.taDescripcion.getValue(),
                            idtipocampo: vista.cbTipoCampo.getValue(),
                            acumulaliquida: vista.cbAcumulacionLiquidacion.getValue(),
                            periodo: vista.cbPeriodos.getValue(),
                            tiporeferencia: vista.cbTipoReferencia.getValue(),

                            diasimporte: vista.cbVacacionesDiasImporte.getValue(),
                            idvalormostrar: (vista.cbTipoCampo.getValue() != 2) ? idvalormostrar : Ext.encode(arrValores),
                            orden: vista.nfOrden.getValue(),
                            ordenreporte: vista.nfOrdenReporte.getValue(),

                            descuento: descuento,
                            aceptavaloresnegativos: aceptavaloresnegativos,
                            esconceptopagosalario: conceptopagosalario,

                            visible: visible,
                            SC_4_01: SC_4_01,
                            SC_4_06: SC_4_06,
                            talonario: talonario,
                            correo: correo,
                            comportamientocorreo: comportamientocorreo,
                            idmessnc: vista.cbMesSNC.getValue(),

                            textoformula: vista.textoformula,
                            identidad: vista.idestructura,
                            tipo: Ext.encode(vista.arrTipo),
                            escampopersona: escampopersona

                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtipopago');
                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, lbMsgExito, function () {
                                    if (vista.boton != 1) {
                                        vista.ventana.hide();
                                    } else {
                                        Ext.Ajax.request({
                                            url: '/pvd/nomina/index.php/estructurarmodelosnomina/obtenerOrdenDisponible',
                                            method: 'POST',
                                            params: {
                                                identidad: vista.idestructura,
                                                idtiponomina: vista.idtiponomina
                                            },
                                            callback: function (options, success, response) {
                                                var responseData = Ext.decode(response.responseText);
                                                //Acciones de la ventana adicionar
                                                vista.cbPeriodos.disable();
                                                vista.cbTipoReferencia.disable();
                                                vista.cbAcumulacionLiquidacion.clearValue();
                                                vista.cbVacacionesDiasImporte.clearValue();
                                                vista.nfOrden.setValue(responseData.orden);
                                                vista.nfOrdenReporte.setValue(responseData.ordenreporte);
                                            }
                                        });
                                    }
                                    vista.tfDenominacion.focus(true, 500);
                                    vista.formulario.getForm().reset();
                                    vista.gpEstructurarNomina.getStore().removeAll();
                                    vista.gpEstructurarNomina.getStore().load({
                                        params: {
                                            idtiponomina: vista.idtiponomina,
                                            idestructura: vista.idestructura,
                                            start:0,
                                            limit:1000
                                        }
                                    });
                                    vista.cambio = 0;
                                    vista.btnEliminarModeloNomina.disable();
                                    vista.btnModificarModeloNomina.disable();
                                    vista.cbValorMostrar.disable();
                                });

                            } else {
                                mostrarMensaje(responseData.codMsg, 'El campo de acumulaci&oacute;n/liquidaci&oacute;n que desea adicionar ya existe.');
                            }
                            vista.idexpresionmatematica = -1;
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
                vista.arrIdChecked = new Array();
                vista.textoformula = "";
            }
        }

        /*********************************Eliminar multiple*******************************/
        vista.pobjestrucEliminar.on('uncheckednode', function (sm, nodo) {
            var index = this.nodosseleccionadosaeliminar.indexOf(nodo.attributes.id);
            if (index > -1) {
                this.nodosseleccionadosaeliminar.splice(index, 1);
                estanNodosSeleccionados(this.nodosseleccionadosaeliminar);
            }
        }.createDelegate(this));


        vista.pobjestrucEliminar.on('checkednode', function (sm, nodo) {
            if (nodo.attributes.id != 'idraiz') {
                this.nodosseleccionadosaeliminar.push(nodo.attributes.id);
            } else {
                this.nodosseleccionadosaeliminar.push(nodo.id);
            }
            estanNodosSeleccionados(this.nodosseleccionadosaeliminar);
        }.createDelegate(this));

        /*vista.pobjestrucEliminar.on('estructuraselecionada', function (sm, nodo) {
            if (nodo.attributes.tipoestructura == 3 || nodo.attributes.tipoestructura == 5) {
                vista.btnAceptarEliminar.enable();
            }else{
                this.nodosseleccionadosaeliminar.push(nodo.id);
            }
        }.createDelegate(this));*/

        vista.btnAceptarEliminar.setHandler(function () {
            if (this.nodosseleccionadosaeliminar.length > 0) {
                eliminar(this.nodosseleccionadosaeliminar);
            } else {
                mostrarMensaje(3, 'Por favor seleccione una estructura para poder eliminar.');
            }
        }.createDelegate(this));

        function estanNodosSeleccionados(nodos) {
            if (nodos.length > 0) {
                vista.btnAceptarEliminar.enable();
            } else {
                vista.btnAceptarEliminar.disable();
            }
        }

        function eliminar(nodosseleccionadosaeliminar) {
            vista.idtiponomina = vista.gpTipoNomina.getSelectionModel().getSelected().get('idtiponomina');
            var datos = vista.gpEstructurarNomina.getSelectionModel().getSelections();

            var idestructuramodelodomina = new Array();
            var datos = vista.gpEstructurarNomina.getSelectionModel().getSelections();
            //console.info(datos);return;
            Ext.each(datos, function (rec) {
                idestructuramodelodomina.push({
                    idestructuramodelodomina: rec.get('idestructuramodelodomina')
                });
            });
            //Se muestra la máscara de espera.
            PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminar);
            //Enviando los datos al servidor.
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/estructurarmodelosnomina/eliminarEstructurasNomina',
                method: 'POST',
                params: {
                    idestructuramodelodomina: Ext.encode(idestructuramodelodomina),
                    idestructura: Ext.encode(nodosseleccionadosaeliminar)
                },
                callback: function (options, success, response) {
                    //Se oculta la máscara de espera.
                    PVD.ocultarMascara('idmaskeleminartipopago');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg) {
                        //Mostrando el mensaje de que se ha el tipo de nómina.
                        mostrarMensaje(1, idioma.lbMsgCorrectoEliminado, function () {

                        });
                        //Recargando el grid de tipos de nómina.
                        vista.gpEstructurarNomina.getStore().removeAll();
                        vista.gpEstructurarNomina.getStore().load({
                            params: {
                                idtiponomina: vista.idtiponomina,
                                idestructura: vista.idestructura,
                                start:0,
                                limit:1000
                            }
                        });
                        vista.winEstructuraEliminar.hide();
                    }
                }
            });
        }

        function obtenerCamposEstructurasNominas(pidentidad, pidtiponomina) {
            Ext.Ajax.request({
                url: 'obtenerCamposEstructurasNominas',
                params: {
                    identidad: pidentidad,
                    idtiponomina: pidtiponomina,
                    start:0,
                    limit:1000
                },
                callback: function (options, success, response) {
                    var r = Ext.decode(response.responseText);
                    vista.camposEstructuraNomina = new Array();
                    for (var i = 0; i < r.length; i++) {
                        var a = new Array();
                        a[0] = r[i].idestructuramodelodomina;
                        a[1] = r[i].campo;
                        a[2] = r[i].tiponomina;
                        vista.camposEstructuraNomina.push(a);
                    }
                }
            });
        }
    }
}


//Inicializando la vista.
UCID.portal.cargarEtiquetas('estructurarmodelosnomina', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    var modelo = Pvd.Nomina.Configuraciones.EstructurarModelosNomina.Modelo;
    modelo.init(idioma);

    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuraciones.EstructurarModelosNomina.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Configuraciones.EstructurarModelosNomina.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});
