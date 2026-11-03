Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
UCID.portal.cargarEtiquetas('gestionarinstrumentobancario', cargarInterfaz);
Ext.Ajax.timeout = 6000000;
//variables globales
var chequenominativo = 0;
var idgridI, idt, nomtipodoc, acc;
var idinstbancario = 0, idanterior = 0, idoperacionliq = 0, idoperacionremb = 0, idoperacionope = 0;
var abrirventanaope = 0, operacion = 0, iddepositado = 0; //importePagado =
var cambio = false, soloLectura = false, abrioperacion = false, importedisponible = false;
// Variables globales para utilizarlas en los reportes preferentemente
var fechaactual, nameperiodo, namejerc, nameentidad, usuario, v_fechainicio, v_fechafin, telf, direc, email;
var arrayValues = new Array(); //almacena el record para el paginado

//Componentes de instrumento (botones)
var btnAdicionar, btnModificar, btnCertificar, btnCancelar, btnConfirmar, btnContabilizar, btnVerInstrumento,
    btngraficar, btnBusc;
var stinstrumentobanc, gpinstrumentobanc, sminstbanc;
//Componentes del formulario Instrumento
var tfimporteletras, cbtipoOpInstr, oldValueOpInst = '';
var tfpagado, cbrecibidopor, tfnumerodoc, tfimporte, tfresto;
var tacomentario;
var lfImporteTotalAllOperaciones;
var dfemision, dfaceptacion, dfvencimiento, tfvalidarnodocumento;
var stcuentabanc, sttipodoc, stcuentacontable, oldValueTipodoc;
var cbcuentabanc, cbtipodoc, cbxbeneficiario, idespecialidad, oldvalue;
var btnventana, btnrecibidopor, btnbeneficiario;
var stfiltrotipodoc, cbfiltrotipodoc, tfnumero, tffechaInicio, tffechaFin;
//var rbtnliquidar,rbtnpagoant,rbtnreembolso,rbtnoperacion;
var wininstbanc, winbuscarinstrumento, winCertificar;
//Componentes del formulario Liquidar
var rbtnfiscal;
var stmovimientoliq, stmovimientopa, stmovimientooper, stmonedatasa, strecibidopor, stbeneficiario, stcuentacontliqui;
var cbmovimientoliq;
var tffiscalliq, tfimportetotalliq, tfmonedaliq, tffechaliq, tfimpliq;
var tfrestoliq; //muestra el importe restante del instrumento en la ventana de las operaciones
var rdliquidar, stliquidar, smliquidar, cm0, gpliquidar, smliquidaciones, stliquidaciones, gpliquidaciones;
var stliq, cmaux, gpmostrarliquidar, smcorreccbanco, tpcuenta; // Para mostrar las liquidaciones
var fpliquidacion, winliquidacion;
var operaciondeliq = '';
//Componentes del formulario reembolso
var tfimporterev, tfmonedarev, cbxfcajarev, tffondorev;
var stcajero, stcaja;
var cbmovimientorev, cbcajero;
var rdreembolso, streembolso, smreembolsar, gpreembolso;
var fpreembolso, winreembolso;
var streemblso, smreembolsom, cmreembolso, gpmostrareembolso;
//Componentes del formulario operaciones
//var stcuenta, stcuentaoper;
//var cbcuentabancoper, cbcuentaoper;
var tfcuentaoper, tfimporteletrasoper, tfimporteoper, tfmonedaoper, tfclienteoper;
var tfimportetotaloper; //muestra el importe total de las operaciones
var tfrestooper; //muestra el importe restante del instrumento en la ventana de las operaciones
var stcuentadebitar, cbcuentadebitar, cbmovimientooper; // no  estaban  declarados
var stcuentaacreditar, cbcuentaacreditaroper; //muestra la contrapartida de la cuenta a debitar
var fpoperaciones, winoperaciones;
var stotras, smotras, cmotras, gpmostrarotras;
//Componentes del formulario pago anticipado
var stgridanticipo, smgridanticipo;
var tfnroinstrumento, tftipoinstrumento, tfimportecont, tfimporteorig, tfmoneda;
var tfimportetotalant; ////muestra el importe total de los anticipos
var tfrestopaa; //muestra el importe restante del instrumento en la ventana de los anticipos
var tacomentariopa;
var cbmovimientopaa;
var stcuentadebitarpa, cbcuentadebitarpa; // es la cuenta contable de banco q tiene una contrapartida  conocida como cuentaa a creditar
var cbcuentaacreditarpa, stcuentaacreditarpa;
var fppagoanticipado, winpanticipado;
var idanticipo;
var btnreloadcontrapartida;
//Este arreglo se utilza para los reembolsos cuando se esta modificando
var arrIdmovsCajaToSend = new Array();
// Store del mostrar
var stpagoant;
var reembasocc = new Array(); // Ademas del arreglo global de reembolsos

var lMask, lMasktemp;
var valoresEnVentRe = 0, valoresEnVentLiq = 0, valoresEnVentPa = 0, valoresEnVentOp = 0;
var importe_Y = 0, idTalonario = 0, idTalonariocertf = 0;
var arregl = new Array();
var arrLiquidarViejo = new Array();
var tfnumtemp, paneltemp, winsolicitud;
//var stTiposMovimientos;

var fpcancelacion, cbxoperacioncancelacion, stoperacioncancelacion, stmotivo; // Elementos para la WinCancelacion
var winMotivoCancelacion; // Window para cancelar instrmento desde origen
// variables para la contabilizacion
var descripcion_comprobante = '';
var detalle = '';
var fecha_comprobante = '';
var contabilizar = false;
var cancelar = false;

var tempRA = 0;
/*revisar, a lo mejor sobra--adolfo 17/02/2014*/
var tempRR = 0;
var tempRL = 0;
var tempRO = 0;

var presionandobtnaplicar = false;//variable utilizada para saber si estamos aplicando o adicionando

//para realizar las liquidaciones de las distintas operaciones
var cbcuentacontliqui, tfsaldoliquidar;
var arrliquidacion = new Array(); //arreglo para la liquidacion
var arroperliquidacion = new Array(); //arreglo de operaciones de la liquidacion
var arroperliquidacionaux = new Array(); //arreglo de operaciones de la liquidacion -- auxiliar
var arrtabliquidacion = new Array(); //arreglo para el tab de las liquidaciones
//para realizar las operaciones del instrumento
var arroperacioninst = new Array(); //arreglo para las operaciones del instrumento
var arroanticipoinst = new Array(); //arreglo para los anticipos del instrumento

var idfechacierrenomina = ''; //Variable que almacena el idfechacierrenomina
//Variable que se utiliza para almacenar los identificadores de los cobros o pagos anticipados para
//el el modificar de la devolución de cobros anticipados o el reintegro de los cobros anticipados, en el
//tab otras operaciones
var arridsanticiposMod = new Array();

//para el buscar
//var stEstado, comboEstado, stEjercicio, cmbEjercicio, dffechainicio, dffechafin, lMaskBuscar;
var tfbuscarnum, stEstado, stTiposMovimientos, stEjercicio, stPeriodo, comboEstado, cmbPeriodo, cmbEjercicio,
    dffechainicio, dffechafin, lMaskBuscar;
var stbeneficiariobuscar, cbxbeneficiariobuscar, btnbuscar, strecibidoporbuscar, cbxrecibidobuscar, btnbuscarrecpor;
var tfimportebuscar, cbtipodocbuscar, sttipodocbuscar;
var stcuentabancbuscar, cbcuentabancbuscar;
var stnumerocomprobantebuscar, cbnumerocomprobantebuscar;
// define a custom summary function
Ext.grid.GroupSummary.Calculations['totalCost'] = function (v, record, field) {
    return v;
};
var summary = new Ext.grid.GroupSummary();
var summary1 = new Ext.grid.GroupSummary();
var summary2 = new Ext.grid.GroupSummary();

var paramcertificacion; //almacena los parametros que se le pasan a la w2 certif para que los utilice el btn cancelar
var GroupingStore; //redefinicion del grouping
var noWindow = true; //para saber si hay alguna ventana abierta

var otrosmod = new Array(); //arreglo para las operaciones del instrumento a modificar
var tempO = 0;
var tempL = 0;
var tempA = 0;
var tempR = 0;

//Variable para controlar si se limpiaron los filtros del buscar
var clearFilter = true;
var beforeLoad = false;

//Variables para cargar los números de documentos para los botones
//de pasar adelante y pasar hacia detrás
var noDocUsados;
var generado;
var noDocUsadosCertf;
var generadoCertf;

function cargarInterfaz(perfil, etiquetas) {
//mensaje de mascara para la interfaz completa
    lMask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiquetas.lbMsgCargando
    });

    /****************************************************/
    ////////////////  INTERFAZ PRINCIPAL  ////////////////
    /****************************************************/
    /***** Botones *****/
    btnAdicionar = new Ext.Button({
        id: 'btnAdicionar',
        text: 'Ad<U>i</U>cionar',
        tooltip: 'Adicionar instrumento bancario <b>(Alt+I)</b>',
//        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        disabled: false,
        handler: function () {
            clickAdicionarInst();
        },
        abreviatura: 'add_instrumentobancario'

    });
    validate.addButton(btnAdicionar);

    btnModificar = new Ext.Button({
        id: 'btnModificar',
        text: '<U>M</U>odificar',
        tooltip: 'Modificar instrumento bancario <b>(Alt+M)</b>',
//        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'modificar',
        disabled: true,
        handler: function () {
            acc = 'mod';
            cambio = false;
            abrirVentana('Modificar instrumento bancario', 'inst');
//            cbtipoOpInstr.focus(false, 10); //(darle el foco a este combo)
            aplicarmodinst.hide(); //se oculta el btn de aplicar
        },
        abreviatura: 'add_instrumentobancario'

    });
    validate.addButton(btnModificar);

    btnCertificar = new Ext.Button({
        id: 'btnCertificar',
        text: 'Ce<U>r</U>tificar',
        tooltip: 'Certificar instrumento bancario <b>(Alt+R)</b>',
//        icon: perfil.dirImg + 'aprobar.png',
        iconCls: 'certificacion',
        disabled: true,
        handler: function () {
            clickCertificararInst('clicbtn');
        },
        abreviatura: 'certificar_instrumentobancario'

    });
    validate.addButton(btnCertificar);

    btnCancelar = new Ext.Button({
        id: 'btnCancelar',
        text: '<U>C</U>ancelar',
        tooltip: 'Cancelar instrumento bancario <b>(Alt+X)</b>',
//        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        disabled: true,
        handler: function () {
            clickCancelarInst();
        },
        abreviatura: 'cancelar_instrumentobancario'

    });
    validate.addButton(btnCancelar);

    btnConfirmar = new Ext.Button({
        id: 'btnConfirmar',
        text: 'Con<U>f</U>irmar',
        tooltip: 'Confirmar instrumento bancario <b>(Alt+F)</b>',
        disabled: true,
//        icon: perfil.dirImg + 'confirmar.png',
        iconCls: 'confirmar',
        handler: function () {
            clickConfirmarInst();
        },
        abreviatura: 'confirmar_instrumentobancario'

    });
    validate.addButton(btnConfirmar);

    btnContabilizar = new Ext.Button({
        text: 'Pos<U>t</U>ear',
        id: 'btnContabilizar',
        tooltip: 'Postear instrumento bancario <b>(Alt+T)</b>',
        disabled: true,
//        icon: perfil.dirImg + 'contabilidad.png',
        iconCls: 'contabilidad',
        handler: function () {
            clickContabilizarInst();
        },
        abreviatura: 'postear_instrumentobancario'

    });
    validate.addButton(btnContabilizar);

    btnVerInstrumento = new Ext.Button({
        id: 'btnVerInstrumento',
        text: 'Ver',
        tooltip: 'Ver detalles de la selecci\xF3n <b>(Alt+D)</b>',
//        icon: perfil.dirImg + 'ver.png',
        iconCls: 'ver',
        disabled: false,
        handler: function () {
            configurarPreView();
        },
        abreviatura: 'ver_instrumentobancario'

    });
    validate.addButton(btnVerInstrumento);

    btngraficar = new Ext.Button({
        id: 'btngraficar',
//        icon: perfil.dirImg + 'planificacion.png',
        iconCls: 'graficar',
        text: '<U>G</U>raficar',
        tooltip: 'Graficar instrumentos por estado <b>(Alt+G)</b>',
        disabled: true,
        hidden: true,
        handler: function () {
            GraficarEstadosInstrumento();
        },
        abreviatura: 'graficar_instrumentobancario'

    });
    // validate.addButton(btngraficar);

    btnAyuda = new Ext.Button({
        id: 'btnAyudainstbancario',
//        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: 'Ayuda',
        //tooltip: 'Mostrar ayuda de la funcionalidad <b>(Alt+H)</b>',
    });

    //Label para mostrar el período actual
    labelPeriodo = new Ext.form.Label({
        id: 'labelPeriodo',
        style: 'font-weight: bold;'
    });

    // Boton "Buscar"
    btnBusc = new Ext.Button({
        id: 'btnBusc',
        text: '<U>B</U>&uacute;squeda avanzada',
        tooltip: 'Buscar instrumento bancario <b>(Alt+B)</b>',
//        icon: perfil.dirImg + 'buscar.png',
        iconCls: 'buscaravanzada',
        handler: function () {
            buscarInstrumento();
        },
        abreviatura: 'busquedaavanzada_instrumentobancario'

    });
    validate.addButton(btnBusc);
    //Ocultando primero todos los botones
    //Validando permisos de acceso a los recurdos en los botones
    validate.checkPermisos();

    // Combox "Tipo de operacion": Entrada (Cobrar) o Salida (Pagar)
    stTiposMovimientos = new Ext.data.SimpleStore({
        fields: ['identradasalida', 'entradasalida'],
        sortInfo: {
            field: 'entradasalida',
            direction: 'ASC'
        },
        data: [
            [1, 'Entrada'], [2, 'Salida']]  // Entrada=Cobrar(+), Salida=Pagar(-)
    });
    cbtipoMovInstr = new Ext.form.ComboBox({
        fieldLabel: 'Tipo operaci\xF3n',
        disabledClass: 'disabled-component',
        id: 'cbtipoMovInstr',
        tpl: '<tpl for="."><div ext:qtip="{entradasalida}" class="x-combo-list-item">{entradasalida}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        mode: 'local',
        //disabled : true,
        editable: false,
        selectOnFocus: true,
        store: stTiposMovimientos,
        valueField: 'identradasalida',
        displayField: 'entradasalida',
        hiddenName: 'identradasalida',
        forceSelection: true,
        width: 90,
        emptyText: 'Seleccione...',
        anchor: '100%',
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        //allowBlank: true,
        listeners: {
            specialkey: function (field, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey);
            },
            keypress: function (t, e) {
                if (soloLectura || acc == 'mod')
                    e.stopEvent();
                else if ((e.getKey() == 8) || (e.getKey() == 46)) // Limpiar el combo
                    cbtipoMovInstr.clearValue();
                else if (e.getKey() == 13) // Buscar con enter
                    BuscarconEnter(e.getCharCode());
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbtipoMovInstr').getValue() != 'Seleccione...' && Ext.getCmp('cbtipoMovInstr').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbtipoMovInstr'), Ext.getCmp('cbtipoMovInstr').getRawValue());
                 });*/
            }
        }
    });
    /***** Filtrar busqueda *****/
    // TextField "numero"
    tfbuscarnum = new Ext.form.TextField({// Misma validacion que el numero de instrumento
        id: 'tfbuscarnum',
        fieldLabel: 'N&uacute;mero',
        name: 'tfbuscarnum',
        emptyText: '[Todos...]',
        anchor: '100%',
        maxLength: 16,
        //style : 'text-align:right;',
        maxLengthText: "Solo deben ser 16 caracteres.",
        regexText: "Solo se permiten n&uacute;meros.",
        maskRe: /^[a-zA-Z0-9 \.\/\-\_]+$/,
        regex: /^([0-9a-zA-Z \-\_\/\.]+ ?)+$/,
        listeners: {
            specialkey: function (tf, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey);
            },
            keypress: function (tf, e) {
                if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = new String(tf.getValue());
                    if (value.length >= 16)
                        e.stopEvent(); // Para que no escriba m?s de 16 caracteres
                }
            }
        }
    });
    // Combox "Tipo de Documento"
    sttipodocbuscar = new Ext.data.Store({
        url: 'cargartipoDocumento',
        reader: new Ext.data.JsonReader(
            {
                root: 'datos'
            },
            [
                {
                    name: 'iddoc',
                    mapping: 'idtipodocumento'
                },
                {
                    name: 'diasvigencia'
                },
                {
                    name: 'importemin'
                },
                {
                    name: 'importemax'
                },
                {
                    name: 'tienetalonario'
                },
                {
                    name: 'iddocumentos'
                },
                {
                    name: 'denominacion'
                }
            ]),
        sortInfo: {
            field: 'denominacion',
            direction: 'ASC'
        }
    });
    // Combox "Tipo documento"
    cbtipodocbuscar = new Ext.form.ComboBox({
        id: 'cbtipodocbuscar',
        fieldLabel: 'Tipo documento',
        mode: 'local',
        //emptyText : 'Seleccione...',
        emptyText: '[Todos...]',
        resizable: true,
        store: sttipodocbuscar,
        valueField: 'iddoc',
        displayField: 'denominacion',
        //forceSelection : true,
        /*maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        anchor: '100%',
        triggerAction: 'all',
        typeAhead: true,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            specialkey: function (tf, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey)
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbtipodocbuscar').getValue() != 'Seleccione...' && Ext.getCmp('cbtipodocbuscar').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbtipodocbuscar'), Ext.getCmp('cbtipodocbuscar').getRawValue());
                 });*/
            }
        }
    });
    // Combox "Numero de Comprobante"
    stnumerocomprobantebuscar = new Ext.data.Store({
        url: 'cargarNumComprobante',
        reader: new Ext.data.JsonReader(
            {
                root: 'datos'
            },
            [
                {
                    name: 'arriddoc',
                },
                {
                    name: 'numcomprobante'
                },
                {
                    name: 'idcomprobante'
                }
            ]),
        // sortInfo: {
        //     field: 'denominacion',
        //     direction: 'ASC'
        // }
    });
    // Combox "Numero Comprobante"
    cbnumerocomprobantebuscar = new Ext.form.ComboBox({
        id: 'idcbnumerocomprobantebuscar',
        fieldLabel: 'Num. Comprobante',
        mode: 'local',
        //emptyText : 'Seleccione...',
        emptyText: '[Todos...]',
        resizable: true,
        store: stnumerocomprobantebuscar,
        valueField: 'idcomprobante',
        displayField: 'numcomprobante',
        //forceSelection : true,
        /*maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        anchor: '100%',
        triggerAction: 'all',
        typeAhead: true,
        tpl: '<tpl for="."><div ext:qtip="{numcomprobante}" class="x-combo-list-item">{numcomprobante}</div></tpl>',
        listeners: {
            specialkey: function (tf, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey)
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbtipodocbuscar').getValue() != 'Seleccione...' && Ext.getCmp('cbtipodocbuscar').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbtipodocbuscar'), Ext.getCmp('cbtipodocbuscar').getRawValue());
                 });*/
            }
        }
    });
    // Combox "Estado"
    stEstado = new Ext.data.SimpleStore({
        id: 'stEstado',
        fields: ['idestado', 'estado'],
        data: [
            [0, '[Todos...]'], [5, 'Confirmado'], [6, 'Posteado'], [7, 'Cancelado'], [1, 'Guardado']]
    }); // [8, 'Guardado'],
    comboEstado = new Ext.form.ComboBox({
        id: 'comboEstado',
        disabledClass: 'disabled-component',
        fieldLabel: 'Estado',
        emptyText: '[Todos...]',
        editable: false,
        anchor: '100%',
        tpl: '<tpl for="."><div ext:qtip="{estado}" class="x-combo-list-item">{estado}</div></tpl>',
        resizable: true,
        hiddenName: 'idestado',
        valueField: 'idestado',
        displayField: 'estado',
        store: stEstado,
        autoCreate: true,
        typeAhead: true,
        selectOnFocus: true,
        triggerAction: 'all',
        readOnly: true,
        mode: 'local',
        //emptyText : 'Seleccione...',
        enableKeyEvents: true,
        //width:160,
        listeners: {
            specialkey: function (field, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey);
            },
            keypress: function (t, e) {
                if (soloLectura || acc == 'mod')
                    e.stopEvent();
                else if ((e.getKey() == 8) || (e.getKey() == 46)) // Limpiar el combo
                    comboEstado.clearValue();
                else if (e.getKey() == 13) // Buscar con enter
                    BuscarconEnter(e.getCharCode());
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('comboEstado').getValue() != 'Seleccione...' && Ext.getCmp('comboEstado').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('comboEstado'), Ext.getCmp('comboEstado').getRawValue());
                 });*/
            }
        }
    });
    // TextField "Importe"
    tfimportebuscar = new Ext.form.TextField({
        fieldLabel: 'Importe',
        id: 'tfimportebuscar',
        style: 'text-align:right;',
        anchor: '100%',
        regexText: 'Solo se permiten carateres num&eacute;ricos.',
        maskRe: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        regex: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        enableKeyEvents: true,
        listeners: {
            specialkey: function (field, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey);
            },
            blur: function (tf) {
                if (tf.isValid()) {
                    tfimportebuscar.setRawValue(saldo(tfimportebuscar.getValue()));
                }
            }
        }
    });
    // Combox "Ejercicio"
    stEjercicio = new Ext.data.JsonStore({
        url: 'getEjercicios',
        root: 'results',
        fields: ['idejercicio', 'nombre', 'inicio', 'fin']
        //lMaskBuscar.hide();//se oculta la mascara del buscar
    });
    cmbEjercicio = new Ext.form.ComboBox({
        id: 'cmbEjercicio',
        disabledClass: 'disabled-component',
        fieldLabel: 'Ejercicio',
        //emptyText: 'Seleccione...',
        emptyText: '[Actual...]',
        editable: true,
        forceSelection: true,
        store: stEjercicio,
        valueField: 'idejercicio',
        displayField: 'nombre',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        enableKeyEvents: true,
        //width:160,
        anchor: '100%',
        listeners: {
            specialkey: function (field, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey);
            },
            keypress: function (t, e) {
                if (soloLectura || acc == 'mod')
                    e.stopEvent();
                else if ((e.getKey() == 8) || (e.getKey() == 46)) { // Limpiar el combo
                    cmbEjercicio.clearValue();
                    cmbPeriodo.clearValue();
                    cmbPeriodo.setDisabled(true);
                }
            },
            select: function (cmbEjercicio, record, index) {
//Periodo
                stPeriodo.removeAll();
                cmbPeriodo.clearValue();
                cmbPeriodo.reset();
                cmbPeriodo.setDisabled(true);
                //se cargan las fechas del ejercicio
                dffechainicio.setRawValue(record.data.inicio);
                dffechainicio.setMinValue(record.data.inicio);
                dffechainicio.setMaxValue(record.data.fin);
                dffechafin.setRawValue(record.data.fin);
                dffechafin.setMinValue(record.data.inicio);
                dffechafin.setMaxValue(record.data.fin);
                stPeriodo.baseParams = {
                    idejercicio: record.get('idejercicio')
                };
                stPeriodo.load({
                    /*baseParams: {
                     idejercicio: record.get('idejercicio')
                     },*/
                    callback: function () {
                        if (!stPeriodo.getCount()) {
                            cmbPeriodo.setDisabled(true);
                        } else
                            cmbPeriodo.setDisabled(false);
                    }
                });
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cmbEjercicio').getValue() != 'Seleccione...' && Ext.getCmp('cmbEjercicio').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cmbEjercicio'), Ext.getCmp('cmbEjercicio').getRawValue());
                 });*/
            }
        }
    });
    // Combox "Periodo"
    stPeriodo = new Ext.data.JsonStore({
        url: 'getPeriodos',
        root: 'results',
        fields: ['idperiodo', 'nombre', 'inicio', 'fin']
    });
    cmbPeriodo = new Ext.form.ComboBox({
        id: 'cmbPeriodo',
        disabledClass: 'disabled-component',
        fieldLabel: 'Per&iacute;odo',
        //emptyText: 'Seleccione...',//miPerfil.msgseleccionar,
        emptyText: '[Actual...]',
        editable: true,
        forceSelection: true,
        store: stPeriodo,
        valueField: 'idperiodo', //id que mando para las tablas
        displayField: 'nombre', //valor que se le muestra al usuario
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        enableKeyEvents: true,
        // width:160,
        anchor: '100%',
        disabled: true,
        listeners: {
            specialkey: function (field, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey);
            },
            keypress: function (t, e) {
                if (soloLectura || acc == 'mod')
                    e.stopEvent();
                else if ((e.getKey() == 8) || (e.getKey() == 46)) { // Limpiar el combo
                    cmbPeriodo.clearValue();
                }
            },
            select: function (cmbEjercicio, record, index) {
//se cargan las fechas del ejercicio
                dffechainicio.setRawValue(record.data.inicio);
                dffechainicio.setMinValue(record.data.inicio);
                dffechainicio.setMaxValue(record.data.fin);
                dffechafin.setRawValue(record.data.fin);
                dffechafin.setMinValue(record.data.inicio);
                dffechafin.setMaxValue(record.data.fin);
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cmbPeriodo').getValue() != 'Seleccione...' && Ext.getCmp('cmbPeriodo').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cmbPeriodo'), Ext.getCmp('cmbPeriodo').getRawValue());
                 });*/
            }
        }
    });
    // DateField "Fecha inicio"
    dffechainicio = new Ext.form.DateField({
        fieldLabel: 'Fecha inicio',
        format: 'd/m/Y',
        name: 'fechainicio',
        id: 'dffechainicio',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        selectOnFocus: true,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Formato: dd/mm/aaaa',
        enableKeyEvents: true,
        anchor: '100%',
        listeners: {
            specialkey: function (field, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey);
            },
            'keypress': function (t, e) {
                if (soloLectura || acc == 'mod')
                    e.stopEvent();
                else if ((e.getKey() == 8) || (e.getKey() == 46)) { // Limpiar el combo
                    dffechainicio.setValue(null);
                }
            }
        }
    });
    // DateField "Fecha fin"
    dffechafin = new Ext.form.DateField({
        fieldLabel: 'Fecha fin',
        format: 'd/m/Y',
        name: 'fechafin',
        id: 'dffechafin',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        selectOnFocus: true,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Formato: dd/mm/aaaa',
        enableKeyEvents: true,
        anchor: '100%',
        listeners: {
            specialkey: function (field, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey);
            },
            'keypress': function (t, e) {
                if (soloLectura || acc == 'mod')
                    e.stopEvent();
                else if ((e.getKey() == 8) || (e.getKey() == 46)) { // Limpiar el combo
                    dffechafin.setValue(null);
                }
            }
        }
    });
    // Eventos Validaciones entre la fecha de inicio y la fecha fin
    dffechainicio.on('change', function () {
        dffechafin.setMinValue(dffechainicio.getRawValue());
    });
    dffechainicio.on('valid', function () {
        dffechafin.setMinValue(dffechainicio.getRawValue());
        if (dffechainicio.getRawValue() != '') {
            dffechafin.enable();
        }
    });
    dffechafin.on('change', function () {
        dffechainicio.setMaxValue(dffechafin.getRawValue());
    });
    //  Combox "Beneficiario"
    stbeneficiariobuscar = new Ext.data.Store({
//reader: new Ext.data.JsonReader({
        id: 'stbeneficiariobuscar',
        reader: new Ext.data.DataReader({
                id: 'rdbeneficiario'
            },
            [{
                name: 'id',
                type: 'string'
            },
                {
                    name: 'tipo'
                },
                {
                    name: 'denominacion'
                }
            ])
    });
    cbxbeneficiariobuscar = new Ext.form.ComboBox({
        fieldLabel: 'Beneficiario', //perfil.etiquetas.lbcbxbeneficiario,
        id: 'cbxbeneficiariobuscar',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        emptyText: '[Todos...]',
        mode: 'local',
        hideTrigger: true,
        store: stbeneficiariobuscar,
        valueField: 'id',
        displayField: 'denominacion',
        hiddenName: 'id',
        anchor: '100%',
        enableKeyEvents: true,
        triggerAction: 'all',
        //typeAhead: true, //Selecciona el primer elemento
        listeners: {
            change: function (cbx, newValue, oldValue) {
                if (acc == 'mod')
                    cbxbeneficiariobuscar.setRawValue(stinstrumentobanc.data.items[idgridI].get('beneficiario'));
            },
            /*keypress: function (t, e){
             if (soloLectura || acc=='mod')
             e.stopEvent();
             else	if ((e.getKey() == 8) || (e.getKey() == 46)){ // Limpiar el combo
             cbxbeneficiariobuscar.clearValue();
             //selectcasetipodoc(0);
             }else
             if(e.getKey() == 13){ // Buscar con enter
             buscargenerico(cbxbeneficiariobuscar,cbxbeneficiario,5);
             }
             },*/
            keypress: function (t, e) {
                if (e.getKey() == 13 && acc != 'mod') { // Buscar con enter
                    buscargenerico(stbeneficiariobuscar, cbxbeneficiariobuscar, 1);
                }
            },
            select: function () {
//rbtnreembolso.setDisabled(true);
                tipoventana(0);
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbxbeneficiariobuscar').getValue() != 'Seleccione...' && Ext.getCmp('cbxbeneficiariobuscar').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbxbeneficiariobuscar'), Ext.getCmp('cbxbeneficiariobuscar').getRawValue());
                 });*/
            }
        }
    });
    //  Boton "Buscar Beneficiario"
    btnbuscar = new Ext.Button({
        text: 'Buscar',
        tooltip: 'Buscar proveedor',
        //style : 'margin: 5 0 0 0',
        // disabled : true,
        id: 'btnbuscar',
//        icon: perfil.dirImg + 'buscar.png',
        iconCls: 'buscar',
        handler: function () {
//buscarTrabajador();
            buscargenerico(stbeneficiariobuscar, cbxbeneficiariobuscar, 5);
        }
    });
    //  Combox "Recibido Por"
    strecibidoporbuscar = new Ext.data.Store({
        reader: new Ext.data.DataReader(
            {
                id: 'strecibidoporbuscar'
            },
            [{
                name: 'id'
            },
                {
                    name: 'tipo'
                }, // 1-cliente, 2-proveedor, 3-personaexterna, 4-trabajador

                {
                    name: 'denominacion'
                }  // Nombre
            ])
    });
    cbxrecibidobuscar = new Ext.form.ComboBox({
        fieldLabel: 'Recibido por',
        id: 'cbxrecibidobuscar',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        emptyText: '[Todos...]',
        mode: 'local',
        hideTrigger: true,
        selectOnFocus: true,
        store: strecibidoporbuscar,
        valueField: 'id',
        displayField: 'denominacion',
        hiddenName: 'id',
        anchor: '100%',
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        listeners: {
            change: function (dfe, newValue, oldValue) {
                if (acc == 'mod' && newValue != oldValue)
                    cambio = true;
            },
            keypress: function (t, e) {
                if (e.getKey() == 13 && acc != 'mod') { // Buscar con enter
                    buscargenerico(strecibidoporbuscar, cbxrecibidobuscar, 1);
                }
            },
            /*keypress: function (t, e){
             if (e.getKey() == 8 || e.getKey() == 46){
             cbrecibidoporbuscar.clearValue();
             //selectcasetipodoc(0);
             }else if(e.getKey() == 13 && acc!='mod'){ // Buscar con enter
             buscargenerico(strecibidoporbuscar,cbrecibidoporbuscar,1);
             }
             },*/
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbxrecibidobuscar').getValue() != 'Seleccione...' && Ext.getCmp('cbxrecibidobuscar').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbxrecibidobuscar'), Ext.getCmp('cbxrecibidobuscar').getRawValue());
                 });*/
            }
        }
    });
    //  Boton "Buscar Recibido por"
    btnbuscarrecpor = new Ext.Button({
        text: 'Buscar',
        tooltip: 'Buscar receptor',
        id: 'btnbuscarrecpor',
//        icon: perfil.dirImg + 'buscar.png',
        iconCls: 'buscar',
        handler: function () {
            buscargenerico(strecibidoporbuscar, cbxrecibidobuscar, 1);
        }
    });
    // Combox "Cuenta Bancaria buscar"
    stcuentabancbuscar = new Ext.data.Store({
        url: 'cargarcuentabancaria',
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idcuentabancaria',
                type: 'string'
            },
            {
                name: 'nombrecuentabancaria',
                type: 'string'
            }
        ]),
        sortInfo: {
            field: 'nombrecuentabancaria',
            direction: 'ASC'
        } // DESC
    });
    cbcuentabancbuscar = new Ext.form.ComboBox({
        fieldLabel: 'Cuenta bancaria',
        disabledClass: 'disabled-component',
        id: 'cbcuentabancbuscar',
        //listWidth:300,
        resizable: true,
        tpl: '<tpl for="."><div ext:qtip="{nombrecuentabancaria}" class="x-combo-list-item">{nombrecuentabancaria}</div></tpl>', // Paramostrar los datos como detalle
        mode: 'local',
        emptyText: '[Todas...]',
        editable: true,
        store: stcuentabancbuscar,
        valueField: 'idcuentabancaria',
        displayField: 'nombrecuentabancaria',
        forceSelection: true,
        /*maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        blankText: 'Este campo es obligatorio.',
        anchor: '100%',
        triggerAction: 'all',
        enableKeyEvents: true,
        typeAhead: true,
        listeners: {
            keypress: function (t, e) {
                if (e.getKey() == 13) // Enter
                {
                    BuscarconEnter(e.getKey());
                    return;
                }
                if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
                {
                    cbcuentabancbuscar.clearValue();
                    cbcuentabancbuscar.focus();
                    return;
                }
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbcuentabancbuscar').getValue() != '[Todas]...' && Ext.getCmp('cbcuentabancbuscar').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbcuentabancbuscar'), Ext.getCmp('cbcuentabancbuscar').getRawValue());
                 });*/
            }
        }
    });

    stEspecialidad = this.stEspecialidad = new Ext.data.Store({
        url: 'getcomboiframeespecialidad',
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {name: 'idespecialidad'},
            {name: 'descripcionespecialidad', mapping: 'text'}
        ])
    });

    cbEspecialidadBuscar = this.cbcuenta = new Ext.contabilidad.util.linkedCombo({
        id: 'cbEspecialidadBuscar',
        fieldLabel: 'Especialidad',
        emptyText: '[Todas...]',
        store: stEspecialidad,
        displayField: 'descripcionespecialidad',
        valueField: 'idespecialidad',
        allowBlank: true,
        listHeight: 200,
        lazyRender: true,
        fnCreateNew: Ext.emptyFn,
        enableKeyEvents: true,
        listeners: {
            keypress: function (tf, event) {
                if (event.getKey() == 13) {
                    cbxtipobeneficiarioBuscar.focus(true, 100);
                } else if (event.getKey() == 8 || event.getKey() == 46) {
                    cbEspecialidadBuscar.clearValue();
                }
            },
            select: function () {
                cbxtipobeneficiarioBuscar.focus(true, 100);
            }
        }
    });

    // ComboIframe "Especialidad"
    /*comboIframe1buscar = new Ext.UCID.ComboIframe({
     fieldLabel: 'Especialidad',
     valueField: 'idespecialidad',
     displayField: 'descripcionespecialidad',
     id: 'comboIframe1buscar',
     emptyText: '[Todas...]',
     editable: true,
     resizable: true,
     idIframe: 'especialidad',
     url: 'getcomboiframeespecialidad',
     anchor: '100%',
     onSelectNodo: function(nodo) {
     if (nodo.attributes.id != 0) {
     var node = nodo;
     var codespecialidad = ''; //almacena el codigo de la especialidad
     while (node.parentNode.id != 0)
     {
     codespecialidad = nodo.parentNode.attributes.codespecialidad + codespecialidad + '.';
     node = node.parentNode;
     }
     //                idespecialidad='';
     //                idespecialidad=nodo.attributes.id;//se guarda el id de la especialidad
     cbEspecialidad.reset();
     cbEspecialidad.setValue(nodo.attributes.id);
     cbEspecialidad.setRawValue(codespecialidad + nodo.attributes.text);
     }
     else {
     cbEspecialidad.reset();
     // idespecialidad='';
     }
     }
     });*/

    ///-----Para el buscar con la nueva solucion de Beneficiario y Recibido por----------------------------------------------------
    //---Nuevo---
    // Store de Tipos
    // Create data store para el Tipos elementos
    sttipo = new Ext.data.SimpleStore({
        //fields:['tipo', 'descripcion'],
        fields: [{
            name: 'tipo',
            type: 'int'
        }, {
            name: 'descripcion',
            type: 'string'
        }],
        data: [[1, 'Cliente'], [2, 'Proveedor'], /*[3, 'Cliente proveedor'], */[4, 'Trabajador'], [5, 'Presupuesto'], [6, 'Entidad - todos los trabajadores']]
    });

    cbxtipobeneficiarioBuscar = new Ext.form.ComboBox({
        fieldLabel: 'Acreedor/Deudor',
        id: 'cbxtipobeneficiarioBuscar',
        tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        //style: 'margin:0 0 0 -8',
        emptyText: '[Todos...]',
        mode: 'local',
        readOnly: true,
        //allowBlank: false,
        store: sttipo,
        valueField: 'tipo',
        displayField: 'descripcion',
        hiddenName: 'tipo',
        forceSelection: true,
        anchor: '98%',
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        listeners: {
            keypress: function (tf, e) {
                if (e.getKey() == 8 || e.getKey() == 46) {
                    cbxtipobeneficiarioBuscar.clearValue();
                    cbxbeneficiarioBuscar.clearValue();
                }
                var charCode = e.charCode;
                if (e.getKey() == 13) // Enter
                {
                }
            }
        }
    });


    cbxtipobeneficiarioBuscar.on('select', function () {
        cbxbeneficiarioBuscar.clearValue();
        cbxbeneficiarioBuscar.markInvalid();
        cbxbeneficiarioBuscar.focus(true, 100);
        stbeneficiarioBuscar.reload();
        cbxbeneficiarioBuscar.enable();
    });

    //Combox "Beneficiario"
    stbeneficiarioBuscar = new Ext.data.Store({
        url: 'buscarbeneficiario',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'id'
            }, {
                name: 'tipo'
            }, {
                name: 'denomtipo',
                type: 'string'
            }, {
                name: 'nombre'
            }
            ])
    });

    stbeneficiarioBuscar.on('beforeload', function () {
        stbeneficiarioBuscar.baseParams.tipo = cbxtipobeneficiarioBuscar.getValue();
        stbeneficiarioBuscar.baseParams.tipoOperacion = (cbtipoOpInstr.getValue()) ? cbtipoOpInstr.getValue() : '';
    });

    cbxbeneficiarioBuscar = new Ext.form.ComboBox({
        //fieldLabel: 'Beneficiario', //perfil.etiquetas.lbcbxbeneficiario,
        //hideLabel: true,
        labelSeparator: '',
        disabledClass: 'disabled-component',
        id: 'cbxbeneficiarioBuscar',
        tpl: '<tpl for="."><div ext:qtip="{denomtipo}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        mode: 'remote',
        //allowBlank: false,
        hideTrigger: false,
        //disabled: true,
        editable: true,
        readOnly: false,
        selectOnFocus: true,
        store: stbeneficiarioBuscar,
        valueField: 'id',
        displayField: 'nombre',
        disabled: true,
        labelSeparator: '',
        //hiddenName: 'id',
        forceSelection: true,
        minChars: 3, //Para la nueva busqueda poner contraria esta linea
        pageSize: 10, //Para la nueva busqueda poner contraria esta linea
        anchor: '100%',
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        listeners: {
            keypress: function (t, e) {
                if ((e.getKey() == 8) || (e.getKey() == 46)) { // Limpiar el combo
                    cbxbeneficiarioBuscar.clearValue();
                    cbxtipobeneficiarioBuscar.clearValue();
                } else if (e.getKey() == 13) { // Buscar con enter
                    if (!cbxbeneficiarioBuscar.getValue())
                        cbxbeneficiarioBuscar.expand();
                    else
                        cbxtiporecibidoporBuscar.focus(false, 100);
                }
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbxbeneficiarioBuscar').getValue() != 'Seleccione...' && Ext.getCmp('cbxbeneficiarioBuscar').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbxbeneficiarioBuscar'), Ext.getCmp('cbxbeneficiarioBuscar').getRawValue());
                 });*/
            }
        }
    });

    //-------------
    cbxtiporecibidoporBuscar = new Ext.form.ComboBox({
        fieldLabel: 'Recibido por',
        id: 'cbxtiporecibidoporBuscar',
        tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        //style: 'margin:0 0 0 -8',
        emptyText: '[Todos...]',
        mode: 'local',
        readOnly: true,
        store: sttipo,
        //allowBlank: false,
        valueField: 'tipo',
        displayField: 'descripcion',
        hiddenName: 'tipo',
        forceSelection: true,
        anchor: '98%',
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        listeners: {
            select: function (combo, r, index) {
                //stelementos.removeAll();
            },
            keypress: function (tf, e) {
                if (e.getKey() == 8 || e.getKey() == 46) {
                    cbxtiporecibidoporBuscar.clearValue();
                    cbrecibidoporBuscar.clearValue();
                }
                var charCode = e.charCode;
                if (e.getKey() == 13) // Enter
                {
                }
            }
        }
    });

    cbxtiporecibidoporBuscar.on('select', function () {
        cbrecibidoporBuscar.enable();
        cbrecibidoporBuscar.reset();
        //cbrecibidopor.clearValue();
        cbrecibidoporBuscar.focus(true, 100);
        cbrecibidoporBuscar.markInvalid();
        strecibidoporBuscar.reload();
    });

    strecibidoporBuscar = new Ext.data.Store({
        url: 'buscarbeneficiario',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'id'
            }, {
                name: 'idtipo'
            }, {
                name: 'denomtipo',
                type: 'string'
            }, {
                name: 'nombre'
            }
            ])
    });

    strecibidoporBuscar.on('beforeload', function () {
        strecibidoporBuscar.baseParams.tipo = cbxtiporecibidoporBuscar.getValue()
    });

    cbrecibidoporBuscar = new Ext.form.ComboBox({
        //fieldLabel: 'Recibido por',
        //hideLabel: true,
        labelSeparator: '',
        disabledClass: 'disabled-component',
        id: 'cbrecibidoporBuscar',
        tpl: '<tpl for="."><div ext:qtip="{denomtipo}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        mode: 'remote',
        hideTrigger: false,
        //allowBlank:false,
        //disabled: true,
        //  editable: true,
        readOnly: false,
        selectOnFocus: true,
        //store: strecibidopor,
        store: strecibidoporBuscar,
        valueField: 'id',
        displayField: 'nombre',
        //hiddenName: 'id',
        forceSelection: true,
        anchor: '100%',
        minChars: 3, //Para la nueva busqueda poner contraria esta linea
        pageSize: 10, //Para la nueva busqueda poner contraria esta linea
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        /*allowBlank: false,
         blankText :'Este campo es obligatorio.',*/
        listeners: {
            change: function (dfe, newValue, oldValue) {
                if (acc == 'mod' && newValue != oldValue)
                    cambio = true;
            },
            keypress: function (t, e) {
                if (e.getKey() == 8 || e.getKey() == 46) {
                    cbrecibidoporBuscar.clearValue();
                    cbxtiporecibidoporBuscar.clearValue();
                } else if (e.getKey() == 13 && acc != 'mod') { // Buscar con enter
                    //buscargenerico(strecibidopor, cbrecibidopor, 1);
                    cbrecibidopor.expand();
                }
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbrecibidoporBuscar').getValue() != 'Seleccione...' && Ext.getCmp('cbrecibidoporBuscar').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbrecibidoporBuscar'), Ext.getCmp('cbrecibidoporBuscar').getRawValue());
                 });*/
            }
        }
    });
    //-------------------------------------------------------------------------

    fpbuscarinstrumento = new Ext.FormPanel({
        frame: true,
        id: 'fpbuscarinstrumento',
        autoHeight: true,
        region: 'center',
        //layout: 'fit',
        items: [{
            labelAlign: 'top',
            autoHeight: true,
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [tfbuscarnum]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [cbtipodocbuscar]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [comboEstado]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [tfimportebuscar]
            }]
        }, {
            labelAlign: 'top',
            autoHeight: true,
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [cmbEjercicio]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [cmbPeriodo]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [dffechainicio]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [dffechafin]
            }]
        }, {
            labelAlign: 'top',
            autoHeight: true,
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .5,
                items: [cbcuentabancbuscar]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [cbEspecialidadBuscar]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [cbnumerocomprobantebuscar]
            }]
        }, {
            labelAlign: 'top',
            autoHeight: true,
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 0',
                layout: 'form',
                columnWidth: .25,
                items: [/*cbxbeneficiariobuscar*/cbxtipobeneficiarioBuscar]
            }, {
                style: 'margin:0 0 0 0',
                layout: 'form',
                columnWidth: .75,
                items: [/*btnbuscar, */cbxbeneficiarioBuscar]
            }]
        }
//            , {
//                labelAlign: 'top',
//                autoHeight: true,
//                layout: 'column',
//                items: [{
//                        style: 'margin:0 0 0 0',
//                        layout: 'form',
//                        columnWidth: .25,
//                        items: [/*cbxrecibidobuscar*/cbxtiporecibidoporBuscar]
//                    }, {
//                        style: 'margin:0 0 0 0',
//                        layout: 'form',
//                        columnWidth: .75,
//                        items: [/*btnbuscarrecpor*/cbrecibidoporBuscar]
//                    }]
//            }
        ]
    });
    GroupingStore = Ext.extend(Ext.data.GroupingStore, {
        applySort: function () {
            Ext.data.GroupingStore.superclass.applySort.call(this);
            if (!this.groupOnSort && !this.remoteGroup) {
                var A = this.getGroupState();
                if (A && A != this.sortInfo.field) {
                    this.sortData('idcuentabancaria')
                }
            }
        }
    });
    /*****  Grid Instrumento *****/
    //stinstrumentobanc = new Ext.data.GroupingStore({
    stinstrumentobanc = new GroupingStore({
        url: 'cargargridinst',
        id: 'stinstrumentobanc',
        sortInfo: {
            field: 'fechacreacion',
            direction: 'ASC'
            //direction: 'DESC'
        },
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad',
            id: 'rdinstrumentobanc'
        }, [{
            name: 'fechacreacion',
            type: 'date',
            dateFormat: 'd/m/Y'
        },
            {
                name: 'numerodocumento',
                type: 'string'
            }, {
                name: 'tipooperacion',
                type: 'string'
            },
            {
                name: 'denominacion',
                type: 'string'
            },
            {
                name: 'importemo',
                type: 'float'
            },
            {
                name: 'importeor',
                type: 'float'
            },
            {
                name: 'importemb',
                type: 'float'
            },
            {
                name: 'comentario',
                type: 'string'
            },
            {
                name: 'idsolicitud',
                type: 'string'
            },
            {
                name: 'fecharecepcion'
            },
            {
                name: 'fechaemision'
            },
            {
                name: 'fechavencimiento'
            },
            {
                name: 'fechaalerta'
            },
            {
                name: 'alerta_vencimiento',
                type: 'boolean'
            },
            {
                name: 'idelaboradopor',
                type: 'string'
            },
            {
                name: 'idestadodoccomunfinanzas',
                type: 'string'
            },
            {
                name: 'estado',
                type: 'string'
            },
            {
                name: 'idcuentabancaria',
                type: 'string'
            },
            {
                name: 'cuentabancaria',
                type: 'string'
            },
            {
                name: 'idtasa',
                type: 'string'
            },
            {
                name: 'registrado'
            },
            {
                name: 'idmoneda',
                type: 'string'
            },
            {
                name: 'moneda',
                type: 'string'
            },
            {
                name: 'idtipodocumento'
            },
            {
                name: 'iddocumento',
                type: 'string'
            },
            {
                name: 'idinstrumentobancario',
                type: 'string'
            },
            {
                name: 'cargainicial'
            },
            {
                name: 'idbeneficiario',
                type: 'string'
            },
            {
                name: 'beneficiario',
                type: 'string'
            },
            {
                name: 'tipobeneficiario'
            },
            {
                name: 'idrecibido',
                type: 'string'
            },
            {
                name: 'recibe',
                type: 'string'
            },
            {
                name: 'tiporecibe'
            },
            {
                name: 'estadocuenta',
                type: 'boolean'
            },
            {
                name: 'numeroestadocuenta'
            },
            {
                name: 'fechaestadocuenta'
            },
            {
                name: 'numcomprobante'
            },
            {
                name: 'idtalonario',
                type: 'string'
            },
            {
                name: 'idespecialidad',
                type: 'string'
            },
            {
                name: 'descripcionespecialidad',
                type: 'string'
            },
            {
                name: 'id'/*este campo lo usa para mantener las selecciones entre paginas*/
            },
            {
                name: 'tipooperacionbnk'
            },
            {
                name: 'tienecertificado'
            },
            {
                name: 'fuecertificado'
            },
            {
                name: 'numinstorigen'
            },
            {
                name: 'numinstcreado'
            },
            {
                name: 'imgcargado'
            },
            {
                name: 'tienedoccertifica'
            },
            {
                name: 'tienenominativocertificado'
            },
            {
                name: 'idmetodocertificacion'
            },
            {
                name: 'showCmp'
            },
        ]),
        groupField: 'cuentabancaria',
        baseParams: {
            entradasalida: 0,
            numero: '',
            estado: ''
        },
        listeners: {
            load: function (r, options) {
                stliq.load();
                stpagoant.load();
                streemblso.load();
                stotras.load();
                if (beforeLoad) {
                    clearFilter = true;
                } else {
                    fpbuscarinstrumento.getForm().reset();
                }
                beforeLoad = false;
                Ext.getCmp('gpinstrumentobanc').getSelectionModel().selectFirstRow();
            },
            beforeload: function (s, options) {
                beforeLoad = true;
                stinstrumentobanc.clearFilter(true);
                if (!clearFilter) {
                    stinstrumentobanc.baseParams.buscando = 1;
                    stinstrumentobanc.baseParams.start = 0;
                    //MostrarEtiquetas(Ext.getBody(), 'Cargando...'); //para que se muestre al cargar
                    stinstrumentobanc.baseParams.numero = Ext.getCmp('tfbuscarnum').getValue();
                    stinstrumentobanc.baseParams.estado = Ext.getCmp('comboEstado').getValue();
                    stinstrumentobanc.baseParams.idejercicio = Ext.getCmp('cmbEjercicio').getValue();
                    stinstrumentobanc.baseParams.idperiodo = Ext.getCmp('cmbPeriodo').getValue();
                    stinstrumentobanc.baseParams.fechainicio = Ext.getCmp('dffechainicio').getRawValue();
                    stinstrumentobanc.baseParams.fechafin = Ext.getCmp('dffechafin').getRawValue();
                    if (Ext.getCmp('tfimportebuscar').getValue())
                        stinstrumentobanc.baseParams.importe = parseFloat(Ext.getCmp('tfimportebuscar').getValue());
                    else
                        stinstrumentobanc.baseParams.importe = '';
                    if (Ext.getCmp('cbtipodocbuscar').getRawValue()) {
                        stinstrumentobanc.baseParams.idtipodocumento = Ext.getCmp('cbtipodocbuscar').getValue();
                    } else {
                        stinstrumentobanc.baseParams.idtipodocumento = '';
                    }
                    if (Ext.getCmp('cbxbeneficiarioBuscar').getRawValue()) {
                        stinstrumentobanc.baseParams.idbeneficiario = Ext.getCmp('cbxbeneficiarioBuscar').getValue();
                    } else {
//Ext.getCmp('cbxbeneficiariobuscar').clearValue();
                        stinstrumentobanc.baseParams.idbeneficiario = '';
                    }
                    if (Ext.getCmp('cbrecibidoporBuscar').getRawValue()) {
                        stinstrumentobanc.baseParams.idrecibido = Ext.getCmp('cbrecibidoporBuscar').getValue();
                    } else {
//Ext.getCmp('cbxrecibidobuscar').clearValue();
                        stinstrumentobanc.baseParams.idrecibido = '';
                    }
                    if (Ext.getCmp('cbcuentabancbuscar').getRawValue()) {
                        stinstrumentobanc.baseParams.idcuentabancaria = Ext.getCmp('cbcuentabancbuscar').getValue();
                    } else {
                        stinstrumentobanc.baseParams.idcuentabancaria = '';
                    }
                    if (Ext.getCmp('cbEspecialidadBuscar').getRawValue()) {
                        stinstrumentobanc.baseParams.idespecialidad = Ext.getCmp('cbEspecialidadBuscar').getValue();
//                    stinstrumentobanc.baseParams.idespecialidad = Ext.getCmp('comboIframe1buscar').fSelect.values[0];
                    } else {
//Ext.getCmp('comboIframe1buscar').clearValue();
                        stinstrumentobanc.baseParams.idespecialidad = '';
                    }
                    if (Ext.getCmp('idcbnumerocomprobantebuscar').getRawValue()) {
                        stinstrumentobanc.baseParams.arriddoc = stnumerocomprobantebuscar.getAt(stnumerocomprobantebuscar.find('idcomprobante', Ext.getCmp('idcbnumerocomprobantebuscar').getValue())).json.arriddoc;
                    } else {
                        stinstrumentobanc.baseParams.arriddoc = '';
                    }
                }
                //--------
            }
        }
    });
    sminstbanc = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (smodel, rowIndex, record) {
                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpinstrumentobanc').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpinstrumentobanc').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });

    function mostrarImagen(value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.estadocuenta == true) {
            metaData.attr = 'ext:qtip="<b>Cargado por Estado de cuenta</b>"';
            return '<img ext:qtip="<b>Cargado por Estado de cuenta</b>" src="' + value + '" alt="' + record.get('imgcargado') + '" style="width:16px">';
        } else {
            return '';
        }
    }

    function mostrarImagenCertificado(value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.fuecertificado == true) {
            metaData.attr = 'ext:qtip="<b>Certificado - (Documento duplicado)</b>"';
            return '<img ext:qtip="<b>Certificado - (Documento duplicado)</b>" src="/contabilidad/comun/images/instconcertificado.png" alt="Certificado">';
        } else if (record.data.tienecertificado == true) {
            metaData.attr = 'ext:qtip="<b>Certificado - (Documento original)</b>"';
            return '<img ext:qtip="<b>Certificado - (Documento original)</b>" src="/contabilidad/comun/images/instyacertificado.png" alt="Certificado">';
        } else if (record.data.tienenominativocertificado == true) {
            metaData.attr = 'ext:qtip="<b>Certificado</b>"';
            return '<img ext:qtip="<b>Certificado</b>" src="/contabilidad/comun/images/instnominativocertificado.png" alt="Nominativo-Certificado">';
        } else {
            return '';
        }
    }

    var rowaction = new Ext.grid.RowActions({
        id: 'idRowaction',
        widthSlope: 100,
        header: "No. Comprobante",
        actions: [
            {
                id: 'vistareporte',
                // tooltip: this.idioma.lbtpEliminar,
                tooltip: 'Ver comprobante',
                iconCls: 'vistareporte',
                marginLeft: 5,
                width: 200,
                height: 16,
                hideIndex: 'showCmp',
                textIndex: 'numcomprobante'
            },
        ]
    });

    rowaction.on({
        action: function (grid, recordarray, icon, rowindex, colindex) {
            fShowReporteComprobante();
        },
        beforeaction: function (grid, rowIndex) {
        }
    });

    fShowReporteComprobante = function () {
        // Ext.Msg.wait(scope.etiquetas.lbCargando, scope.etiquetas.lbEspere);
        Ext.Msg.wait('Cargando...', 'Espere');
        var arrayIdCmp = gpinstrumentobanc.getSelectionModel().getSelected().json.arrayIdCmp;

        Ext.Ajax.request({
            url: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/registrodecomprobantes/" + 'obtenerDatosImprimirReporte',
            params: {
                reporteParams: Ext.encode(arrayIdCmp)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.dataSources.length > 0) {
                    fOpenWindowReportCmp({
                        datoGeneral: {
                            reporte: '100',
                            titulo: 'Comprobante de operaciones',
                        },
                        datoCuerpo: responseData.dataSources
                    });
                }
                Ext.MessageBox.hide();
            }
        });
    };

    fOpenWindowReportCmp = function (datosReporte) {
        defaultComponentsValue = {
            paperSize: "A4",
            orientation: "Horizontal",
            reportType: "HTML"
        };
        var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
        printView.show();
    };

    gpinstrumentobanc = new Ext.grid.GridPanel({
        frame: false,
        border: false,
        loadMask: true,
        store: stinstrumentobanc,
        region: 'center',
        sm: sminstbanc,
        id: 'gpinstrumentobanc',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        viewConfig: {
            forceFit: true
        },
        columns: [
            sminstbanc,
            {
                header: 'Fecha',
                width: 100,
                sortable: true,
                dataIndex: 'fechacreacion',
                renderer: function (v, m, r) {
                    return getQtip(v.format('d/m/Y'), m, r);
                }
            },
            {
                header: 'Fecha vencimiento',
                hidden: true,
                hideable: true,
                width: 100,
                sortable: true,
                dataIndex: 'fechavencimiento',
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            {
                header: 'Cuenta bancaria',
                hidden: true,
                sortable: true,
                dataIndex: 'cuentabancaria',
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            {
                header: 'Fecha alerta',
                hidden: true,
                hideable: true,
                width: 100,
                sortable: true,
                dataIndex: 'fechaalerta',
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            {
                header: 'No. estado de cuenta',
                hidden: true,
                hideable: true,
                width: 100,
                sortable: true,
                dataIndex: 'numeroestadocuenta',
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            {
                header: 'Fecha estado de cuenta',
                hidden: true,
                hideable: true,
                width: 100,
                sortable: true,
                dataIndex: 'fechaestadocuenta',
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            {
                header: 'No. documento',
                width: 120,
                sortable: true,
                dataIndex: 'numerodocumento',
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            }, {
                header: 'Tipo operaci\xF3n',
                width: 100,
                sortable: true,
                dataIndex: 'tipooperacion',
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            {
                header: 'idtipodocumento',
                width: 200,
                sortable: true,
                hidden: true,
                hideable: false,
                dataIndex: 'idtipodocumento'
            },
            {
                header: 'Tipo documento',
                width: 140,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            {
                header: 'Importe',
                width: 100,
                sortable: true,
                dataIndex: 'importemo',
                renderer: function (v, m, r) {
                    return getQtip(formatoMonedaABS(v), m, r);
                },
                align: 'right'
            },
            {
                header: 'Importeor',
                sortable: true,
                hidden: true,
                hideable: false,
                dataIndex: 'importeor',
                align: 'right'
            },
            {
                header: 'Estado',
                width: 100,
                sortable: true,
                dataIndex: 'estado',
                align: 'center',
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            {
//                header: 'Beneficiario',
                header: 'Acreedor/Deudor',
                width: 220,
                dataIndex: 'beneficiario',
                sortable: true,
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            {
                header: 'Especialidad',
                width: 220,
                hidden: true,
                dataIndex: 'descripcionespecialidad',
                sortable: true,
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            {
                header: 'Comentario',
                width: 220,
                sortable: true,
                dataIndex: 'comentario',
                id: 'expandir',
                renderer: function (v, m, r) {
                    return getQtip(v, m, r);
                }
            },
            // {
            //     header: 'No. CO',
            //     width: 60,
            //     dataIndex: 'numcomprobante',
            //     sortable: true,
            //     renderer: function(v, m, r) {
            //         return getQtip(v, m, r);
            //     }
            // },
            rowaction
            ,
            {
                header: 'idespecialidad',
                hidden: true,
                hideable: false,
                dataIndex: 'idespecialidad',
                sortable: true
            },
            {
                header: 'Certificado',
                width: 70,
                align: 'center',
                dataIndex: 'tienecertificado',
                renderer: mostrarImagenCertificado
            },
            {
                header: 'Cargado',
                width: 70,
                align: 'center',
                dataIndex: 'imgcargado',
                renderer: mostrarImagen
            }
        ],
        tbar: [btnAdicionar, btnModificar, btnCertificar, btnCancelar, btnConfirmar, btnContabilizar, '-',
            btnVerInstrumento, btngraficar, btnBusc, '->', labelPeriodo, btnAyuda],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: stinstrumentobanc,
            listeners: {
                'beforechange': function () {
                    instance = new PagingToolbarSelections({
                        'selections': Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections(),
                        'activePage': this.getPageData().activePage
                    });
                    instance.saveSelectionsOnPage(arrayValues);
                },
                'change': function () {
                    instance = new PagingToolbarSelections({
                        'activePage': this.getPageData().activePage
                    });
                    instance.setSelectionsOnPage(arrayValues, Ext.getCmp('gpinstrumentobanc'));
                }
            },
            displayInfo: true,
            displayMsg: 'Resultados de {0} - {1} de {2}',
            emptyMsg: "Ning&uacute;n resultado para mostrar.",
            clearFilter: true
        }),
        view: new Ext.grid.GroupingView(),
        plugins: rowaction,
        listeners: {
            rowdblclick: function (Grid, rowIndex, e) {
                RowDblClick(Grid, rowIndex, e);
                /** Evento para cargar los Tab**/
            }
        }
    });
    gpinstrumentobanc.getView().getRowClass = function (record, index, rowParams, store) {
        if (record.get('estadocuenta'))
            return 'FilaVerde';
        else if (record.get('idestadodoccomunfinanzas') == 7)
            return 'FilaRoja';
        else if (record.get('alerta_vencimiento'))
            return 'FilaMasRoja';
    }

    /*****  Tabs  *****/
//  Liquidaciones
    stliq = new Ext.data.GroupingStore({
        url: 'liquidacionesasociadas',
        sortInfo: {
            field: 'nro',
            direction: 'ASC'
        },
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad'
        }, [{
            name: 'id',
            type: 'string'
        },
            {
                name: 'idoperacion',
                type: 'string'
            }, {
                name: 'operacion',
                type: 'string'
            },
            {
                name: 'nro',
                type: 'string'
            },
            {
                name: 'fecha'
            },
            {
                name: 'tipodoc'
            },
            {
                name: 'docdenomin'
            },
            {
                name: 'liquidado'
            },
            {
                name: 'importe', type: 'float'
            },
            {
                name: 'comentario'
            },
            {
                name: 'edad', type: 'int'
            },
            {
                name: 'aliquidar', type: 'float'
            }
        ]),
        listeners: {
            beforeload: function (s, options) {
                stliq.removeAll();
                stliq.clearFilter(true);
                if (sminstbanc.getSelected()) {
                    stliq.baseParams.iddoc = sminstbanc.getSelected().data.idinstrumentobancario;
                } else
                    return false;
            }
        },
        groupField: 'operacion'
    });
    smliq = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpmostrarliquidar').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpmostrarliquidar').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });
    gpmostrarliquidar = new Ext.grid.EditorGridPanel({
        store: stliq,
        sm: smliq,
        id: 'gpmostrarliquidar',
        //autoExpandColumn : 'comentario',
        height: 100,
        width: 300,
        autoScroll: false,
        shadow: false,
        frame: true,
        plugins: summary,
        loadMask: true,
        columns: [
            {
                header: 'N&uacute;mero',
                sortable: true,
                width: 90,
                dataIndex: 'nro'
            },
            {
                header: 'Operaci\xF3n',
                sortable: true,
                hidden: true,
                width: 90,
                dataIndex: 'operacion'
            },
            {
                header: 'Fecha',
                sortable: false,
                width: 100,
                dataIndex: 'fecha',
                align: 'center'
            },
            {
                header: 'Tipo de documento',
                sortable: true,
                width: 200,
                dataIndex: 'docdenomin'
            },
            {
                header: 'Liquidado',
                sortable: true,
                width: 100,
                dataIndex: 'liquidado'
            },
            {
                header: 'Edad',
                sortable: true,
                width: 50,
                dataIndex: 'edad'
            },
            {
                header: 'Comentario',
                sortable: true,
                width: 300,
                dataIndex: 'comentario'
            },
            {
                header: 'Importe original',
                sortable: true,
                width: 100,
                align: 'right',
                dataIndex: 'importe',
                renderer: formatoMonedaABS,
                summaryType: 'sum',
                summaryRenderer: formatoMonedaABS
            },
            {
                header: 'A liquidar',
                sortable: true,
                width: 100,
                align: 'right',
                dataIndex: 'aliquidar',
                renderer: formatoMonedaABS,
                summaryType: 'sum',
                summaryRenderer: formatoMonedaABS
            }
        ],
        view: new Ext.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            enableNoGroups: false, // REQUIRED!
            hideGroupedColumn: true
        })
    });
    //  Anticipos
    stpagoant = new Ext.data.GroupingStore({
        url: 'anticiposasociados',
        sortInfo: {
            field: 'numero',
            direction: 'ASC'
        },
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad'
        }, [{
            name: 'iddocumento',
            type: 'string'
        },
            {
                name: 'idanticipo',
                type: 'string'
            },
            {
                name: 'numero'
            },
            {
                name: 'fecharecepcion'
            },
            {
                name: 'idoperacion',
                type: 'string'
            },
            {
                name: 'idtipodocumento',
                type: 'string'
            },
            {
                name: 'tipodoc'
            },
            {
                name: 'operacion'
            },
            {
                name: 'importemo', type: 'float'
            },
            {
                name: 'moneda'
            },
            {
                name: 'cuentacontable'
            },
            {
                name: 'cuentapartida'
            },
            {
                name: 'idmoneda',
                type: 'string'
            },
            {
                name: 'comentario'
            }
        ]),
        listeners: {
            beforeload: function (s, options) {
                stpagoant.removeAll();
                stpagoant.clearFilter(true);
                if (sminstbanc.getSelected()) {
                    stpagoant.baseParams.iddoc = sminstbanc.getSelected().data.idinstrumentobancario;
                } else
                    return false;
            }
        },
        groupField: 'operacion'
    });
    smpagoant = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpmostrarpagoant').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpmostrarpagoant').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });
    gpmostrarpagoant = new Ext.grid.EditorGridPanel({
        store: stpagoant,
        sm: smpagoant,
        id: 'gpmostrarpagoant',
        autoExpandColumn: 'comentario',
        height: 100,
        plugins: summary1,
        width: 300,
        autoScroll: false,
        shadow: false,
        frame: true,
        loadMask: true,
        forceFit: true,
        columns: [
            {
                header: 'No. contrato',
                sortable: true,
                width: 100,
                dataIndex: 'numero'
            },
            {
                header: etiquetas.lbFecha,
                sortable: true,
                width: 100,
                dataIndex: 'fecharecepcion',
                align: 'center',
                renderer: 'erpFecha'
            },
            {
                header: etiquetas.lbMoneda,
                sortable: true,
                width: 70,
                dataIndex: 'moneda',
                align: 'center'
            },
            {
                header: etiquetas.lbTipodedocumento,
                sortable: true,
                width: 140,
                dataIndex: 'tipodoc'
            },
            {
                header: etiquetas.lbOperacion,
                sortable: true,
                width: 150,
                dataIndex: 'operacion'
            },
            {
                header: etiquetas.lbComentario,
                sortable: true,
                width: 160,
                id: 'comentario',
                dataIndex: 'comentario'
            },
            {
                header: etiquetas.lbCuentacontable,
                sortable: true,
                width: 200,
                dataIndex: 'cuentacontable'
            },
            {
                header: etiquetas.lbCuentacontrapartida,
                sortable: true,
                width: 200,
                dataIndex: 'cuentapartida'
            },
            {
                header: etiquetas.lbImporteoriginal,
                sortable: true,
                width: 130,
                align: 'right',
                dataIndex: 'importemo',
                renderer: formatoMonedaABS,
                summaryType: 'sum',
                summaryRenderer: formatoMonedaABS
            }
        ],
        view: new Ext.grid.GroupingView({
            // forceFit: true,
            showGroupName: false,
            enableNoGroups: false, // REQUIRED!
            hideGroupedColumn: true
        })
    });
    // Reembolso
    streemblso = new Ext.data.Store({
        url: 'reembolsosasociados',
        sortInfo: {
            field: 'fecha',
            direction: 'ASC'
        },
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad'
        }, [{
            name: 'iddocumento',
            type: 'string'
        },
            {
                name: 'idsolicitudr',
                type: 'string'
            },
            {
                name: 'fecha'
            },
            {
                name: 'idcajero',
                type: 'string'
            },
            {
                name: 'nombrecajero'
            },
            {
                name: 'idfondo',
                type: 'string'
            },
            {
                name: 'nombrefondo'
            },
            {
                name: 'descripcionfondo'
            },
            {
                name: 'importemo'
            },
            {
                name: 'comentario'
            }
        ]),
        listeners: {
            beforeload: function (s, options) {
                streemblso.removeAll();
                streemblso.clearFilter(true);
                if (sminstbanc.getSelected()) {
                    streemblso.baseParams.iddoc = sminstbanc.getSelected().data.idinstrumentobancario;
                } else
                    return false;
            }
        }
    });
    smreembolsom = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpmostrareembolso').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpmostrareembolso').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });
    gpmostrareembolso = new Ext.grid.GridPanel({
        store: streemblso,
        sm: smreembolsom,
        id: 'gpmostrareembolso',
        height: 100,
        width: 300,
        autoScroll: false,
        shadow: false,
        frame: true,
        loadMask: true,
        columns: [
            {
                header: 'Fecha'/*perfil.etiquetas.lbGpTabRem3*/,
                sortable: true,
                width: 90,
                dataIndex: 'fecha',
                align: 'center',
                renderer: 'erpFecha'
            },
            {
                header: 'Fondo'/*perfil.etiquetas.lbGpTabRem1*/,
                sortable: true,
                width: 170,
                dataIndex: 'nombrefondo'
            },
            {
                header: 'Descripci\xF3n fondo'/*perfil.etiquetas.lbGpTabRem2*/,
                sortable: true,
                width: 200,
                dataIndex: 'descripcionfondo'
            },
            {
                header: 'Cajero'/*perfil.etiquetas.lbGpTabRem4*/,
                sortable: true,
                width: 170,
                dataIndex: 'nombrecajero'
            },
            {
                header: 'Importe original'/*perfil.etiquetas.lbGpTabRem6*/,
                sortable: true,
                width: 100,
                dataIndex: 'importemo',
                renderer: formatoMonedaABS,
                align: 'right'
            },
            {
                header: 'Comentario'/*perfil.etiquetas.lbGpTabRem5*/,
                sortable: true,
                width: 200,
                dataIndex: 'comentario'
            }
        ]
    });
    // Otras Operaciones
    stotras = new Ext.data.GroupingStore({
        url: 'otrasasociados',
        sortInfo: {
            field: 'operacion',
            direction: 'ASC'
        },
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad'
        }, [{
            name: 'idmovimiento',
            type: 'string'
        }, {
            name: 'iddocumento',
            type: 'string'
        }, {
            name: 'idtipomovimiento',
            type: 'string'
        }, {
            name: 'cuentabancaria'
        }, {
            name: 'cuentacontable'
        }, {
            name: 'cuentacontrapartida'
        }, {
            name: 'operacion'
        }, {
            name: 'importemo', type: 'float'
        }]),
        listeners: {
            beforeload: function (s, options) {
                stotras.removeAll();
                stotras.clearFilter(true);
                if (sminstbanc.getSelected()) {
                    stotras.baseParams.iddoc = sminstbanc.getSelected().data.idinstrumentobancario;
                } else
                    return false;
            }
        },
        groupField: 'operacion'
    });
    smotras = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpmostrarotras').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpmostrarotras').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });
    gpmostrarotras = new Ext.grid.EditorGridPanel({
        store: stotras,
        sm: smotras,
        plugins: summary2,
        id: 'gpmostrarotras',
        //autoExpandColumn : 'operacion',
        height: 100,
        width: 300,
        autoScroll: false,
        shadow: false,
        frame: true,
        loadMask: true,
        columns: [
            {
                header: etiquetas.lbOperacion,
                sortable: true,
                width: 300,
                dataIndex: 'operacion'
            },
            {
                header: etiquetas.lbCuentabancaria,
                sortable: true,
                width: 193,
                dataIndex: 'cuentabancaria'
            },
            {
                header: etiquetas.lbCuentacontrapartida,
                sortable: true,
                width: 193,
                dataIndex: 'cuentacontrapartida'
            },
            {
                header: etiquetas.lbCuentacontable,
                sortable: true,
                width: 193,
                dataIndex: 'cuentacontable'
            },
            {
                header: 'Moneda',
                sortable: true,
                width: 7,
                renderer: function () {
                    return sminstbanc.getSelected().get('moneda');
                }
            },
            {
                header: etiquetas.lbtfimporteorig,
                sortable: true,
                width: 110,
                align: 'right',
                dataIndex: 'importemo',
                renderer: formatoMonedaABS,
                summaryType: 'sum',
                summaryRenderer: formatoMonedaABS
            }
        ],
        view: new Ext.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            enableNoGroups: false, // REQUIRED!
            hideGroupedColumn: true
        })
    });
    tpcuenta = new Ext.TabPanel({
        activeTab: 0,
        id: 'tpcuenta',
        frame: true,
        // height : screen.height /2.7,
        //region : 'center',
        items: [{
            id: 'tab1',
            title: 'Liquidaciones', //perfil.etiquetas.lbTabLiq,
            layout: 'fit',
            items: gpmostrarliquidar
        }, {
            id: 'tab2',
            title: 'Cobros/Pagos anticipados', //perfil.etiquetas.lbTabAnt,
            layout: 'fit',
            items: gpmostrarpagoant
        }, /*{
             id: 'tab3',
             title : 'Reembolsos',//perfil.etiquetas.lbTabRem,
             layout : 'fit',
             items : gpmostrareembolso
             },*/{
            id: 'tab4',
            title: 'Otras operaciones', //perfil.etiquetas.lbTabOtros,
            layout: 'fit',
            items: gpmostrarotras
        }]
    });

    tpcuenta.on('beforetabchange', function (Tpan, newTab, currentTab) {
        //if (idinstbancario != 0 && idanterior != idinstbancario) {
        switch (newTab.getId()) {
            case "tab2":  // Pagos Anticipados
                if (stpagoant.getCount() <= 0)
                    stpagoant.load({
                        params: {
                            iddoc: idinstbancario
                        }
                    });
                break;
            case "tab1":  // Liquidaciones
                if (stliq.getCount() <= 0)
                    stliq.load({
                        params: {
                            iddoc: idinstbancario
                        }
                    });
                break;
            case "tab4":  // Otras Operaciones
                if (stotras.getCount() <= 0)
                    stotras.load({
                        params: {
                            iddoc: idinstbancario
                        }
                    });
                break;
        }
        //}
    });
    //contiene los tabs con las operaciones del instrumento bancario
    var poperaciones = new Ext.Panel({
        title: 'Operaciones del instrumento bancario',
        collapsible: true,
        id: 'poperaciones',
        collapsed: true,
        split: true,
        region: 'south',
        layout: 'fit',
        height: screen.height / 2.7,
        items: [tpcuenta]
    });
    //puerto de salida
    new Ext.Viewport({
        id: 'vpInstrumento',
        layout: 'border',
        items: [gpinstrumentobanc, poperaciones],
        keys: new Ext.KeyMap(document, [//teclas rapidas
            {//adicionar
                key: "i",
                alt: true,
                fn: function () {//muestra la ventana adicionar
                    if (noWindow)
                        clickAdicionarInst();
                }
            },
            {//modificar
                key: "m",
                alt: true,
                fn: function () {
                    if (noWindow && !btnModificar.disabled) {//si no hay ventana abierta
                        acc = 'mod';
                        cambio = false;
                        abrirVentana('Modificar instrumento bancario', 'inst');
//                        cbtipoOpInstr.focus(false, 10); //(darle el foco a este combo)
                        aplicarmodinst.hide(); //se oculta el btn de aplicar
                    }
                }
            },
            {//certificar
                key: "r",
                alt: true,
                fn: function () {
                    if (noWindow && !btnCertificar.disabled)//si no hay ventana abierta y el btn esta habilitado
                        clickCertificararInst('clicbtn');
                }
            },
            {//cancelar
                key: "x",
                alt: true,
                fn: function () {
                    if (noWindow && !btnCancelar.disabled)//si no hay ventana abierta y el btn esta habilitado
                        clickCancelarInst();
                }
            },
            {//confirmar
                key: "f",
                alt: true,
                fn: function () {
                    if (noWindow && !btnConfirmar.disabled)//si no hay ventana abierta y el btn esta habilitado
                        clickConfirmarInst();
                }
            },
            {//contabilizar
                key: "t",
                alt: true,
                fn: function () {
                    if (noWindow && !btnContabilizar.disabled)//si no hay ventana abierta y el btn esta habilitado
                        clickContabilizarInst();
                }
            },
            {//ver
                key: "d",
                alt: true,
                fn: function () {
                    if (noWindow && !btnVerInstrumento.disabled)//si no hay ventana abierta y el btn esta habilitado
                        configurarPreView();
                }
            },
            {//graficar
                key: "g",
                alt: true,
                fn: function () {
                    // if (noWindow && !btnVerInstrumento.disabled)//si no hay ventana abierta y el btn esta habilitado
                        // GraficarEstadosInstrumento();
                }
            },
            {//buscar
                key: "b",
                alt: true,
                fn: function () {
                    if (noWindow && !btnBusc.disabled)//si no hay ventana abierta y el btn esta habilitado
                        buscarInstrumento();
                }
            },
            {//ayuda
                key: "h",
                alt: true,
                fn: function () {
                    help.show('Mostrar ayuda de la funcionalidad', 'confin/banco/instrumento');
                }
            }
        ])
    });

    loadDataIni();
    /****************************************************/
    //////////  VENTANA  ADICIONAR - MODIFICAR  //////////
    /****************************************************/
    /*****  Primera Fila *****/
    // Combox "Tipo de Operacion"
    cbtipoOpInstr = new Ext.form.ComboBox({
        fieldLabel: 'Tipo operaci\xF3n',
        disabledClass: 'disabled-component',
        id: 'cbtipoOpInstr',
        tpl: '<tpl for="."><div ext:qtip="{entradasalida}" class="x-combo-list-item">{entradasalida}</div></tpl>', // Paramostrar los datos como detalle
        mode: 'local',
        //disabled : true,
        resizable: true,
        editable: false,
        selectOnFocus: true,
        store: stTiposMovimientos,
        valueField: 'identradasalida',
        displayField: 'entradasalida',
        forceSelection: true,
        anchor: '100%',
        emptyText: 'Seleccione...',
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        tabIndex: 1,
        allowBlank: false,
        listeners: {
            change: function (cbx, newValue, oldValue) {
                if (soloLectura)
                    cbtipoOpInstr.setValue(oldValue);
                if (acc == 'mod' && newValue != oldValue) {
                    cbtipoOpInstr.setValue(oldValue);
                }
            },
            keypress: function (t, e) {
                if (soloLectura || acc == 'mod') {
                    e.stopEvent();
                } else {
                    var charCode = e.charCode;
                    if (e.getKey() == 13) {// Enter
                        if (!cbtipoOpInstr.getValue())
                            cbtipoOpInstr.setValue(stTiposMovimientos.getAt(0).get('identradasalida'));
                        //cbtipoOpInstr.fireEvent('select',this.cbtipoOpInstr);
                        cbtipodoc.focus();
                        return;
                    } else if ((e.getKey() == 8) || (e.getKey() == 46)) {
                        cbtipoOpInstr.clearValue();
                        cbtipoOpInstr.focus();
                        limpiardatos();
                        return;
                    }
                }
            },
            beforeselect: function (combo, record, index) {
                oldValueOpInst = cbtipoOpInstr.getValue();
                var currentValue = record.data.identradasalida;

                if (oldValueOpInst == '' || oldValueOpInst != currentValue) {
                    if (acc != 'mod') {
                        if (sttabliquidar.getCount() || sttabanticipo.getCount() || sttaboperaciones.getCount()) {
                            mostrarMensaje(2, 'Esta acci&oacute;n eliminar&aacute; los datos generales y las operaciones configuradas.<br/>¿Est&aacute; seguro que desea realizar esta acci&oacute;n?', function (btn) {
                                if (btn == 'ok') {
                                    //Datos iniciales
                                    cargadatosiniciales(currentValue);

                                    //Borra las operaciones configuradas
                                    limpiarDatosOperaciones();

                                    cbtipoOpInstr.setValue(currentValue);
                                } else {
                                    return false;
                                }
                            });
                        } else {
                            cargadatosiniciales(currentValue);
                        }
                    }
                } else {
                    return false;
                }
            },
            select: function (combo, record, index) {
                // cbtipodoc.isValid();
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbtipoOpInstr').getValue() != 'Seleccione...' && Ext.getCmp('cbtipoOpInstr').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbtipoOpInstr'), Ext.getCmp('cbtipoOpInstr').getRawValue());
                 });*/
            }
        }
    });
    // Combox "Tipo de Documento"
    sttipodoc = new Ext.data.Store({
        url: 'cargartipoDocumento',
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'iddoc',
                mapping: 'idtipodocumento',
                type: 'string'
            },
            {
                name: 'diasvigencia',
                type: 'int'
            },
            {
                name: 'importemin'
            },
            {
                name: 'importemax'
            },
            {
                name: 'importecertifica'
            },
            {
                name: 'tienetalonario',
                type: 'int'
            },
            {
                name: 'iddocumentos'
            },
            {
                name: 'denominacion'
            }
        ]),
        sortInfo: {
            field: 'denominacion',
            direction: 'ASC'
        }
    });
    cbtipodoc = new Ext.form.ComboBox({
        fieldLabel: 'Tipo documento',
        disabledClass: 'disabled-component',
        id: 'cbtipodoc',
        mode: 'local',
        resizable: true,
        //emptyText: 'Seleccione...',
        editable: true,
        store: sttipodoc,
        valueField: 'iddoc',
        displayField: 'denominacion',
        forceSelection: true,
        anchor: '100%',
        triggerAction: 'all',
        /*  maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        allowBlank: false,
        enableKeyEvents: true,
        typeAhead: true,
        tabIndex: 2,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            change: function (cbx, newValue, oldValue) {
                if (soloLectura)
                    cbtipodoc.setValue(oldValue);
                if (acc == 'mod' && newValue != oldValue) {
                    cbtipodoc.setValue(oldValue);
                }
            },
            keypress: function (t, e) {
                if (soloLectura || acc == 'mod') {
                    e.stopEvent();
                } else {
                    var charCode = e.charCode;
                    if (e.getKey() == 13) {// Enter
                        if (!cbtipodoc.getValue())
                            cbtipodoc.setValue(sttipodoc.getAt(0).get('iddoc'));
                        //cbtipodoc.fireEvent('select',this.cbtipodoc);
                        cbcuentabanc.focus();
                        return;
                    }

                    if ((e.getKey() == 8) || (e.getKey() == 46)) {
                        cbtipodoc.clearValue();
                        cbtipodoc.focus(true, 100);
                        validatePrincipalForm();
                        return;
                    }

                    var value = cbtipodoc.getRawValue();
                    if (value.length >= 30 && charCode != 8 && charCode != 46) {
                        e.stopEvent(); // Para que no escriba m?s de 18 caracteres
                    } else {// a-z (97-122) y A-Z 65 al 90
                        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode == 32) {
                            var i = 0;
                            delete i;
                        } else
                            e.stopEvent();
                    }
                }
            },
            beforeselect: function (combo, record, index) {
                oldValueTipodoc = cbtipodoc.getValue();
                var currentValue = record.data.iddoc;

                if (oldValueTipodoc == '' || oldValueTipodoc != currentValue) {
                    if (sttabliquidar.getCount() || sttabanticipo.getCount() || sttaboperaciones.getCount()) {

                        combo.suspendEvents();

                        mostrarMensaje(2, 'Esta acci&oacute;n eliminar&aacute; los datos generales y las operaciones configuradas.<br/>¿Est&aacute; seguro que desea realizar esta acci&oacute;n?', function (btn) {
                            if (btn == 'ok') {
                                //Borra las operaciones configuradas
                                limpiarDatosOperaciones();

                                //Disparo el evento select
                                combo.resumeEvents();
                                combo.fireEvent('select', combo, record, index);
                            } else {
                                combo.setValue(oldValueTipodoc);
                                combo.resumeEvents();
                            }
                        });
                    }
                } else {
                    return false;
                }
            },
            select: function (combo, record, index) {
                selectcasetipodoc(1);

                var storeCB = cbcuentabanc.store;
                if (storeCB.getCount() == 1) {
                    var objcuentaB = storeCB.getAt(0).data;
                    cbcuentabanc.setValue(objcuentaB.idcuentabancaria);
                    cbcuentabanc.fireEvent('select', cbcuentabanc, storeCB.getAt(0), 0);
                }
                cbcuentabanc.focus();
                validatePrincipalForm();
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbtipodoc').getValue() != 'Seleccione...' && Ext.getCmp('cbtipodoc').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbtipodoc'), Ext.getCmp('cbtipodoc').getRawValue());
                 });*/
            }
        }
    });
    // Combox "Cuenta Bancaria"
    stcuentabanc = new Ext.data.Store({
        url: 'cargarcuentabancaria',
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idcuentabancaria',
                type: 'string'
            },
            {
                name: 'nombrecuentabancaria',
                type: 'string'
            },
            {
                name: 'idmoneda'
            },
            {
                name: 'codigoiso'
            }
        ]),
        sortInfo: {
            field: 'nombrecuentabancaria',
            direction: 'ASC'
        } // DESC
    });
    cbcuentabanc = new Ext.form.ComboBox({
        fieldLabel: 'Cuenta bancaria',
        disabledClass: 'disabled-component',
        id: 'cbcuentabanc',
        //listWidth:300,
        resizable: true,
        tpl: '<tpl for="."><div ext:qtip="{nombrecuentabancaria}" class="x-combo-list-item">{nombrecuentabancaria}</div></tpl>', // Paramostrar los datos como detalle
        mode: 'local',
        //emptyText: 'Seleccione...',
        editable: true,
        store: stcuentabanc,
        valueField: 'idcuentabancaria',
        displayField: 'nombrecuentabancaria',
        forceSelection: true,
        /*maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        anchor: '100%',
        triggerAction: 'all',
        enableKeyEvents: true,
        typeAhead: true,
        tabIndex: 3,
        listeners: {
            change: function (cbx, newValue, oldValue) {
                if (soloLectura || acc === 'mod')
                    cbcuentabanc.setValue(oldValue);
            },
            keypress: function (t, e) {
                if (soloLectura || acc === 'mod')
                    e.stopEvent();
                else {
                    var charCode = e.charCode;
                    if (e.getKey() == 13) { // Enter
                        if (!cbtipodoc.getValue())
                            cbtipodoc.setValue(sttipodoc.getAt(0).get('iddoc'));
                        if (tfnumerodoc.getValue() == '')
                            tfnumerodoc.focus(); //si no tiene talonario se le da el foco a no documento
                        else
                            dfemision.focus(); //si tiene talonario le da el foco a fecha emision
                    }
                    if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
                    {
                        cbcuentabanc.clearValue();
                        cbcuentabanc.focus(true, 100);
                        validatePrincipalForm();
                        return;
                    }
                    var value = cbcuentabanc.getRawValue();
                    if (value.length >= 30 && charCode != 8 && charCode != 46) {
                        e.stopEvent();
                    } else {
                        // a-z (97-122) y A-Z 65 al 90   48-57
                        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || charCode == 32) {
                            var i = 0;
                            delete i;
                        } else
                            e.stopEvent();
                    }
                }
            },
            beforeselect: function (combo, record, index) {
                var oldvalue = cbcuentabanc.getValue();
                var currentvalue = record.data.idcuentabancaria;

                if (oldvalue == '' || oldvalue != currentvalue) {
                    if (sttabliquidar.getCount() || sttabanticipo.getCount() || sttaboperaciones.getCount()) {

                        combo.suspendEvents();

                        mostrarMensaje(2, 'Esta acci&oacute;n eliminar&aacute; las operaciones configuradas.<br/>¿Est&aacute; seguro que desea realizar esta acci&oacute;n?', function (btn) {
                            if (btn == 'ok') {
                                //Borra las operaciones configuradas
                                limpiarDatosOperaciones();

                                //Disparo el evento select
                                combo.resumeEvents();
                                combo.fireEvent('select', combo, record, index);
                            } else {
                                combo.setValue(oldvalue);
                                combo.resumeEvents();
                            }
                        });
                    }
                } else {
                    return false;
                }
            },
            select: function () {
                validatePrincipalForm();

                idTalonario = 0;
                if (acc != 'mod'/* && tfnumerodoc.disabled*/) {
                    buscarnumerotalonario();
                }
                buscarmoneda();
                stcuentacontliqui.load({
                    params: {
                        idctabancaria: cbcuentabanc.getValue()
                    }
                });
                if (tfnumerodoc.getValue() === '')
                    tfnumerodoc.focus(true, 100); //si no tiene talonario se le da el foco a no documento
                else
                    dfemision.focus(true, 100); //si tiene talonario le da el foco a fecha emision

            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbcuentabanc').getValue() != 'Seleccione...' && Ext.getCmp('cbcuentabanc').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbcuentabanc'), Ext.getCmp('cbcuentabanc').getRawValue());
                 });*/
            }
        }
    });
    // TextField "Numero de Documento"
    tfnumerodoc = new Ext.form.TextField({
        fieldLabel: 'No. documento', //perfil.etiquetas.lbtfnrodocumento,
        disabled: true,
        disabledClass: 'disabled-component',
        id: 'tfnumerodoc',
        name: 'tfnumerodoc',
        style: 'text-align:right',
        editable: true,
        //regex: /^[a-zA-Z0-9\_\-]$/,
        maskRe: /^[a-zA-Z0-9\_\-]$/, // Cualquier car?cter alfanum?rico, incluido el de subrayado. Equivalente a [A-Za-z0-9\_\-].
//        regex: /^\w*$\-/,
//        maskRe: /^\w*\-$/, // Cualquier car?cter alfanum?rico, incluido el de subrayado. Equivalente a [A-Za-z0-9\_\-].
        regexText: "Solo se permiten n&uacute;meros, letras y gui\xF3n bajo.",
        maxLength: 16,
        minLength: 1,
        allowBlank: false,
        anchor: '100%',
        enableKeyEvents: true,
        listeners: {
            keypress: function (tf, e) {
                if (soloLectura || acc == 'mod')
                    e.stopEvent();
                else if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = NroDocNeto(tf.getValue());
                    if (value.length >= 16)
                        e.stopEvent(); // Para que no escriba mas de 16 caracteres
                }
                if (e.getKey() == 13) { // Enter, se le da el focus a la fecha emision
                    dfemision.focus();
                }
            }
        }
    });
    //btn chequeanterior
    var btnchequeanterior = new Ext.Button({
        tooltip: 'No. documento anterior',
        style: 'margin:-10 0 -10 0',
        disabled: true,
        id: 'btnchequeanterior',
//        icon: perfil.dirImg + 'anterior.png',
        iconCls: 'anterior',
        handler: function () {
            docSiquienteAnterior(false);
        }
    });
    //btn chequesiguiente
    var btnchequesiguiente = new Ext.Button({
        tooltip: 'No. documento siguiente',
        style: 'margin:-10 2 -10 0',
        disabled: true,
        id: 'btnchequesiguiente',
//        icon: perfil.dirImg + 'siguiente.png',
        iconCls: 'siguiente',
        handler: function () {
            docSiquienteAnterior(true);
        }
    });
    //btn cancelarcheque
    var btncancelarcheque = new Ext.Button({
        tooltip: 'Cancelar cheque',
        style: 'margin:-10 0 -10 0',
        disabled: true,
        id: 'btncancelarcheque',
//        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        handler: function () {
            if (Ext.getCmp('ppanel1').getForm().isValid() && Ext.getCmp('ppanel2').getForm().isValid()) {
                //se le pasa false porque no se esta cancelando un certificado en flujo normal
                mensajeCancelacion(false);
            } else {
                mostrarMensaje(1, 'Por favor verifique nuevamente que existen campos con valores incorrectos.');
            }
        }
    });
    var ppanel1 = new Ext.FormPanel({
//title : 'Datos del instrumento',
        id: 'ppanel1',
        frame: true,
        labelAlign: 'top',
        autoHeight: true,
        items: [{
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                columnWidth: .15,
                layout: 'form',
                items: [cbtipoOpInstr]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .25,
                items: [cbtipodoc]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .40,
                items: [cbcuentabanc]
            }, {
                style: 'margin:0 10 0 10',
                layout: 'form',
                columnWidth: .20,
                items: [tfnumerodoc]
            }]
        }],
        buttonAlign: 'right',
        buttons: [btnchequeanterior, btncancelarcheque, btnchequesiguiente]
    });
    /*****  Segunda Fila *****/
    //  DateField "Fecha Emision"
    dfemision = new Ext.form.DateField({
        fieldLabel: 'Fecha emisi\xF3n',
        disabledClass: 'disabled-component',
        name: 'dfemision',
        id: 'dfemision',
        anchor: '100%',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        disabled: true,
        allowBlank: false,
        invalidText: 'Formato: dd/mm/aaaa',
        selectOnFocus: true,
        editable: true,
        enableKeyEvents: true,
        format: 'd/m/Y',
        tabIndex: 4,
        listeners: {
            change: function (dfe, newValue, oldValue) {
                if (acc == 'mod' && newValue != oldValue)
                    cambio = true;
                //se buscan los dias de vigencia
                var diasvigencia = sttipodoc.getAt(sttipodoc.find('iddoc', cbtipodoc.getValue())).data.diasvigencia;
                var fecha = dfemision.getValue(); //se obtiene la fecha seleccionada
                fecha.setDate(fecha.getDate() + diasvigencia); //se le suma a la fecha los dias de vigencia de tipo doc
                dfvencimiento.setValue(fecha.format('d/m/Y')); //se carga la fecha de vencimiento calculada

                validatePrincipalForm();
            },
            keypress: function (t, e) {
                var charCode = e.charCode;
                if (e.getKey() == 13) // Enter
                {
//                    var date = dfemision.minValue;
                    if (!dfemision.getValue())
                        dfemision.setValue(fechaCont);

//                    dfaceptacion.setDisabled(false);
//                    dfaceptacion.focus();

                    // tfvalidarnodocumento.focus();
                    tfimporte.focus();
                    //se buscan los dias de vigencia
                    var diasvigencia = sttipodoc.getAt(sttipodoc.find('iddoc', cbtipodoc.getValue())).data.diasvigencia;
                    var fecha = dfemision.getValue(); //se obtiene la fecha seleccionada
                    fecha.setDate(fecha.getDate() + diasvigencia); //se le suma a la fecha los dias de vigencia de tipo doc
                    dfvencimiento.setValue(fecha.format('d/m/Y')); //se carga la fecha de vencimiento calculada
                    return;
                }
            },
            keyup: function () {
                validatePrincipalForm();
            }
        }
    });
    //  DateField "Fecha  Aceptacion"
    dfaceptacion = new Ext.form.DateField({
        fieldLabel: 'Fecha aceptaci\xF3n',
        disabledClass: 'disabled-component',
        disabled: true,
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        selectOnFocus: true,
        readOnly: false,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Formato: dd/mm/aaaa',
        editable: true,
        name: 'dfaceptacion',
        id: 'dfaceptacion',
        allowBlank: false,
        anchor: '100%',
        format: 'd/m/Y',
        enableKeyEvents: true,
        listeners: {
            change: function (dfe, newValue, oldValue) {
                if (acc == 'mod' && newValue != oldValue)
                    cambio = true;
            }/*,
             keypress: function(t, e) {

             if (e.getKey() == 13) // Enter
             {
             var date = dfaceptacion.minValue;
             if (!dfaceptacion.getValue()) {
             dfaceptacion.setValue(date);
             }

             tfvalidarnodocumento.focus();
             return;
             }
             },
             keyup: function() {
             validatePrincipalForm();
             }*/
        }
    });
    //  DateField "Fecha Vencimiento"
    dfvencimiento = new Ext.form.DateField({
        fieldLabel: 'Fecha vencimiento',
        disabledClass: 'disabled-component',
        disabled: true,
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        selectOnFocus: true,
        readOnly: false,
        editable: true,
        name: 'dfvencimiento',
        id: 'dfvencimiento',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Formato: dd/mm/aaaa',
        anchor: '100%',
        format: 'd/m/Y',
        listeners: {
            change: function (dfe, newValue, oldValue) {
                if (acc == 'mod' && newValue != oldValue)
                    cambio = true;
            }
        }
    });
    //tf para validar el nodocumento
    tfvalidarnodocumento = new Ext.form.TextField({
        fieldLabel: 'Validar no. documento',
        id: 'tfvalidarnodocumento',
        style: 'text-align:right',
        disabledClass: 'disabled-component',
        enableKeyEvents: true,
        // allowBlank: false,
        anchor: '100%',
        vtype: 'cadvalidator',
        initialValField: 'tfnumerodoc',
        // tabIndex: 5,
        listeners: {
            keypress: function (t, e) {
                if (e.getKey() == 13) // Enter
                {
                    tfimporte.focus();
                    return;
                }

            },
            keyup: function () {
                validatePrincipalForm();
            }
        }
    });
    var lfvacio = new Ext.form.Label({
        id: 'lfvacio',
        text: '.',
        anchor: '100%',
        style: '<span style=color:transparent;border:none;>'
    });
    //panel de la segunda fila
    var ppanel2 = new Ext.FormPanel({
        frame: true,
        id: 'ppanel2',
        labelAlign: 'top',
        autoHeight: true,
        items: [{
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .20,
                items: [dfemision]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .20,
                items: [dfvencimiento]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .20,
                items: [dfaceptacion]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .20,
                items: [lfvacio]
            }/*, {
                style: 'margin:0 10 0 10',
                layout: 'form',
                columnWidth: .20,
                items: [tfvalidarnodocumento]
            }*/]
        }]
    });
    /*****  Tercera Fila *****/
    //  TextField "Importe"
    tfimporte = new Ext.form.NumberField({
        fieldLabel: 'Importe',
        disabledClass: 'disabled-component',
        disabled: true,
        id: 'tfimporte',
        style: 'text-align:right;',
        anchor: '100%',
        decimalPrecision: 2, //lugares dep de la coma
        maxLength: 16, // Maximo 13 elementos, y 2 decimales, porque con 19 no convierte bien, se va el entero
        maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 16 caracteres.',
        maskRe: /^[0-9.\,]+$/,
        regex: /^[0-9]*.([0-9]{1,2})?$/,
        regexText: 'Este campo solo permite n&uacute;meros enteros de hasta 16 d&iacute;gitos con dos lugares decimales.',
        nanText: 'El valor es incorrecto',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        msgTarget: 'qtip',
        selectOnFocus: true,
        enableKeyEvents: true,
        tabIndex: 6,
        listeners: {
            change: function (tf, newValue, oldValue) {
                if (acc == 'mod') {
                    /*if ((newValue < stinstrumentobanc.data.items[idgridI].get('importemo')) || !tfimporte.getValue()) {
                     mostrarMensaje(1, 'El importe modificado tiene que ser mayor al importe del instrumento bancario seleccionado.');
                     devolverValorImpResto();
                     } else {*/
                    var val = calcularImporteTotalTab();
                    if (val <= newValue) {
                        tfresto.setRawValue(saldoformateado(parseFloat(newValue) - val)); //para q tome el  valor el campo  resto  en la ventana de crear instrumento

                    }
//                    }
                    // if (newValue !== oldValue)
                    //     cambio = true;
                    if (newValue !== stinstrumentobanc.data.items[idgridI].get('importemo')) {
                        cambio = true;
                    } else {
                        cambio = false;
                    }
                }
            },
            keyup: function (t, e) {
                if (acc == 'ins')
                    pagado();
                var num = tfimporte.getValue();
                if (t.isValid()) {
                    //tfimporteletras.setValue(convertir_a_letras(num));
                } else {
                    tfimporteletras.setValue('');
                }

                validatePrincipalForm();
            },
            blur: function (tf) {

                if (tf.isValid()) {
                    tfimporte.setRawValue(saldo(tfimporte.getValue()));
//                    if (acc == 'ins')
                    pagado();

                    // Aqui tambien verificar si el saldo de la cuenta tiene ese dinero disponible
                    if (RangoImporte(tfimporte.getValue())) {
                        tfimporteletras.setValue(convertir_a_letras(tfimporte.getValue()));
                    }
                }
            },
            keypress: function (tf, e) { // Para dejar solo 2 decimales
                if (e.getKey() != 8) {
                    if (e.getKey() == 13) // Enter
                    {
                        if (!tfimporte.getValue())
                            tfimporte.setValue(0);

                        if (RangoImporte(tfimporte.getValue())) {
                            cbxtipobeneficiario.focus(true, true);
                        }
                        return;
                    }
                }
            },
            invalid: function (tf, ms) {
                tfresto.reset();
                tfimporteletras.reset();
            }
        }
    });
    //  TextField "Resto"
    tfresto = new Ext.form.TextField({
        fieldLabel: 'Resto', //perfil.etiquetas.lbtfresto,
        disabled: true,
        id: 'tfresto',
        style: 'text-align:right;',
        disabledClass: 'disabled-component',
        allowBlank: true,
        editable: false,
        readOnly: true,
        //width:220
        anchor: '100%'
        /*
         listeners:{
         blur : function (){
         tfresto.setRawValue(saldo(tfresto.getValue()));
         }
         }*/
    });
    //  TextField "Pagado"
    tfpagado = new Ext.form.TextField({
        fieldLabel: 'Pagado',
        id: 'tfpagado',
        selectOnFocus: true,
        style: 'text-align:right;',
        disabledClass: 'disabled-component',
        //width:220,
        anchor: '100%',
        maxLength: 16,
        maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 19 caracteres.',
        maskRe: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        regex: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        regexText: 'Este campo solo permite n&uacute;meros.',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        enableKeyEvents: true,
        listeners: {
            change: function (tfi, newValue, oldValue) {
                if (soloLectura)
                    tfpagado.setValue(oldValue);
                if (acc == 'mod' && newValue != oldValue)
                    tfpagado.setValue(oldValue);
            },
            blur: function (tf) {
                if (tf.isValid())
                    tfpagado.setRawValue(saldo(tfpagado.getValue()));
            },
            keypress: function (tf, e) { // Para dejar solo 2 decimales
                if (soloLectura || acc == 'mod')
                    e.stopEvent();
                else if (e.getKey() != 8) //
                {
                    var value = new String(tf.getValue());
                    var position = value.indexOf(".", 0);
                    if (position > -1 && (e.getKey() == 37 || e.getKey() == 39))// Para que no permita desplazarse hacia izq o der
                        e.stopEvent();
                    if (position > -1 && e.getKey() == 46)// Para que solo permita un punto
                        e.stopEvent();
                    if (position > -1 && (value.length - position) > 2)// Para que solo permita 2 lugares decimales
                        e.stopEvent();
                    if (position == -1 && value.length >= 13 && e.getKey() != 46)// Para que escriba solo 13 caracteres antes del '.'
                        e.stopEvent();
                    if (value.length >= 16)// Para que escriba solo 16 caracteres
                        e.stopEvent();
                }
            }
        }
    });
    //  Checkbox "Letra Avalada"
    rckbtnavalada = new Ext.form.Checkbox({
        fieldLabel: 'Avalada', //perfil.etiquetas.lbchkAvalada,
        disabled: true,
        inputValue: 1
    });
    //  TextField "Importe en letras"
    tfimporteletras = new Ext.form.TextField({
        fieldLabel: 'Importe en letras', //perfil.etiquetas.lbtfimporteletras,
        id: 'tfimporteletras',
        disabledClass: 'disabled-component',
        //width:760,
        anchor: '100%',
        disabled: true,
        readOnly: true,
        allowBlank: false,
        blankText: 'Este campo es obligatorio.'
    });
    //panel tercera fila
    var ppanel33 = new Ext.FormPanel({
        frame: true,
        autoHeight: true,
        items: [{
            labelAlign: 'top',
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                columnWidth: .10,
                layout: 'form',
                items: [tfimporte]
            }, {
                style: 'margin:0 0 0 10',
                columnWidth: .70,
                layout: 'form',
                items: [tfimporteletras]
            }, {
                style: 'margin:0 0 0 10',
                columnWidth: .10,
                layout: 'form',
                items: [tfresto]
            }, {
                style: 'margin:0 0 0 10',
                columnWidth: .10,
                layout: 'form',
                items: [tfpagado]
            }, {
                style: 'margin:0 0 0 10',
                //columnWidth: .10,
                layout: 'form',
                items: [rckbtnavalada]
            }]
//            }, {
//                layout: 'column',
//                items: [{
//                    labelAlign: 'left',
//                    style: 'margin:0 10 0 5',
//                    columnWidth: 1,
//                    layout: 'form',
//                    items: [tfimporteletras]
//                }]
        }]
    });

    //---Nuevo---
    // Store de Tipos
    // Create data store para el Tipos elementos
    /*sttipo = new Ext.data.SimpleStore({
     //fields:['tipo', 'descripcion'],
     fields: [{
     name: 'tipo',
     type: 'int'
     }, {
     name: 'descripcion',
     type: 'string'
     }],
     data: [[1, 'Cliente'], [2, 'Proveedor'], [3, 'Cliente proveedor'], [4, 'Trabajador']]
     });*/

    cbxtipobeneficiario = new Ext.form.ComboBox({
        fieldLabel: 'Acreedor/Deudor',
        disabledClass: 'disabled-component',
        id: 'cbxtipobeneficiario',
        tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        //style: 'margin:0 0 0 -8',
        emptyText: 'Seleccione...',
        mode: 'local',
        readOnly: true,
        allowBlank: false,
        store: sttipo,
        valueField: 'tipo',
        displayField: 'descripcion',
        hiddenName: 'tipo',
        forceSelection: true,
        editable: false,
        anchor: '98%',
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        tabIndex: 7,
        listeners: {
            keypress: function (tf, e) {
                if (e.getKey() == 8 || e.getKey() == 46) {
                    cbxtipobeneficiario.clearValue();
                    cbxbeneficiario.clearValue();

                    validatePrincipalForm();
                }
                var charCode = e.charCode;
                if (e.getKey() == 13) // Enter
                {
                }
            },
            beforeselect: function (combo, record, index) {
                var oldvalue = cbxtipobeneficiario.getValue();
                var currentvalue = record.data.tipo;

                if (oldvalue == '' || oldvalue != currentvalue) {
                    if (sttabliquidar.getCount() || sttabanticipo.getCount() || sttaboperaciones.getCount()) {

                        combo.suspendEvents();

                        mostrarMensaje(2, 'Esta acci&oacute;n eliminar&aacute; las operaciones configuradas.<br/>¿Est&aacute; seguro que desea realizar esta acci&oacute;n?', function (btn) {
                            if (btn == 'ok') {
                                //Borra las operaciones configuradas
                                limpiarDatosOperaciones();

                                //Disparo el evento select
                                combo.resumeEvents();
                                combo.fireEvent('select', combo, record, index);
                            } else {
                                combo.setValue(oldvalue);
                                combo.resumeEvents();
                            }
                        });
                    }
                } else {
                    return false;
                }
            },
            select: function (combo, record, index) {
                validatePrincipalForm();
            }
        }
    });


    cbxtipobeneficiario.on('select', function () {
        cbxbeneficiario.clearValue();
        cbxbeneficiario.markInvalid();
        cbxbeneficiario.focus(true, 100);
        stbeneficiario.reload();
        cbxbeneficiario.enable();
    });

    //Combox "Beneficiario"
    stbeneficiario = new Ext.data.Store({
        url: 'buscarbeneficiario',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'id'
            }, {
                name: 'tipo'
            }, {
                name: 'denomtipo',
                type: 'string'
            }, {
                name: 'nombre'
            }
            ])
    });

    stbeneficiario.on('beforeload', function () {
        stbeneficiario.baseParams.tipo = cbxtipobeneficiario.getValue();
        stbeneficiario.baseParams.tipoOperacion = cbtipoOpInstr.getValue();
    });

    cbxbeneficiario = new Ext.form.ComboBox({
        //fieldLabel: 'Beneficiario', //perfil.etiquetas.lbcbxbeneficiario,
        //hideLabel: true,
        labelSeparator: '',
        disabledClass: 'disabled-component',
        id: 'cbxbeneficiario',
        tpl: '<tpl for="."><div ext:qtip="{denomtipo}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        mode: 'remote',
        allowBlank: false,
        hideTrigger: false,
        //disabled: true,
        editable: true,
        readOnly: false,
        selectOnFocus: true,
        store: stbeneficiario,
        valueField: 'id',
        displayField: 'nombre',
        disabled: true,
        //hiddenName: 'id',
        forceSelection: true,
        minChars: 3, //Para la nueva busqueda poner contraria esta linea
        pageSize: 10, //Para la nueva busqueda poner contraria esta linea
        anchor: '99%',
        enableKeyEvents: true,
        triggerAction: 'all',
        //typeAhead: true,
        listeners: {
            change: function (cbx, newValue, oldValue) {
                if (acc == 'mod')
                    cbxbeneficiario.setRawValue(stinstrumentobanc.data.items[idgridI].get('beneficiario'));
            },
            keypress: function (t, e) {
                if (soloLectura || acc == 'mod')
                    e.stopEvent();
                /*else if ((e.getKey() == 8) || (e.getKey() == 46)) { // Limpiar el combo
                    cbxbeneficiario.clearValue();
                    //selectcasetipodoc(0);
                    validatePrincipalForm();
                }*/ else if (e.getKey() == 13) { // Buscar con enter
                    if (!cbxbeneficiario.getValue()) {
                        // buscargenerico(stbeneficiario, cbxbeneficiario, 5);
                        cbxbeneficiario.expand();
                    } else {
//                        cbrecibidopor.focus(false, 100);
                        cbEspecialidad2.focus(false, 100);
                    }
                }
            },
            beforeselect: function (combo, record, index) {
                var oldvalue = cbxbeneficiario.getValue();
                var currentvalue = record.data.id;

                if (oldvalue == '' || oldvalue != currentvalue) {
                    if (sttabliquidar.getCount() || sttabanticipo.getCount() || sttaboperaciones.getCount()) {

                        combo.suspendEvents();

                        mostrarMensaje(2, 'Esta acci&oacute;n eliminar&aacute; las operaciones configuradas.<br/>¿Est&aacute; seguro que desea realizar esta acci&oacute;n?', function (btn) {
                            if (btn == 'ok') {
                                //Borra las operaciones configuradas
                                limpiarDatosOperaciones();

                                //Disparo el evento select
                                combo.resumeEvents();
                                combo.fireEvent('select', combo, record, index);
                            } else {
                                combo.setValue(oldvalue);
                                combo.resumeEvents();
                            }
                        });
                    }
                } else {
                    return false;
                }
            },
            select: function () {

//                cbxtiporecibidopor.focus(true, true);
                cbEspecialidad2.focus(false, 100);

                var index = sttipodoc.find('iddoc', cbtipodoc.getValue());
                if (index > -1) {
                    segunTipoDoc(sttipodoc.getAt(index).data.iddocumentos);
                }

                tipoventana(0);

                validatePrincipalForm();
            },
            focus: function () {
                validatePrincipalForm();
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbxbeneficiario').getValue() != 'Seleccione...' && Ext.getCmp('cbxbeneficiario').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbxbeneficiario'), Ext.getCmp('cbxbeneficiario').getRawValue());
                 });*/
            }
        }
    });

    //  Boton "Buscar Beneficiario"
    btnbeneficiario = new Ext.Button({
        text: 'Buscar',
        tooltip: 'Buscar beneficiario',
        style: 'margin: 5 0 0 0',
        disabled: true,
        id: 'btnbeneficiario',
//        icon: perfil.dirImg + 'buscar.png',
        iconCls: 'buscar',
        handler: function () {
//buscarTrabajador();
            buscargenerico(stbeneficiario, cbxbeneficiario, 5);
        }
    });
    //-------------
    cbxtiporecibidopor = new Ext.form.ComboBox({
        fieldLabel: 'Recibido por',
        id: 'cbxtiporecibidopor',
        tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        //style: 'margin:0 0 0 -8',
        emptyText: 'Seleccione...',
        mode: 'local',
        readOnly: true,
        editable: false,
        store: sttipo,
        allowBlank: true,
        valueField: 'tipo',
        displayField: 'descripcion',
        hiddenName: 'tipo',
        forceSelection: true,
        anchor: '98%',
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        tabIndex: 8,
        listeners: {
            select: function (combo, r, index) {
                //stelementos.removeAll();
            },
            keypress: function (tf, e) {
                if (e.getKey() == 8 || e.getKey() == 46) {
                    cbxtiporecibidopor.clearValue();
                    cbrecibidopor.clearValue();

                    validatePrincipalForm();
                }
                var charCode = e.charCode;
                if (e.getKey() == 13) // Enter
                {
                }
            }
        }
    });


    cbxtiporecibidopor.on('select', function () {
        validatePrincipalForm();

        cbrecibidopor.enable();
        cbrecibidopor.reset();
        //cbrecibidopor.clearValue();
        cbrecibidopor.focus(true, 100);
        cbrecibidopor.markInvalid();
        strecibidopor.reload();
    });

    //  Combox "Recibido Por"
    /*strecibidopor = new Ext.data.Store({
     reader: new Ext.data.DataReader(
     {
     id: 'strecibidopor'
     },
     [{
     name: 'id'
     },
     {
     name: 'tipo'
     }, // 1-cliente, 2-proveedor, 3-personaexterna, 4-trabajador

     {
     name: 'denominacion'
     }  // Nombre
     ])
     });*/

    strecibidopor = new Ext.data.Store({
        url: 'buscarbeneficiario',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'id'
            }, {
                name: 'idtipo'
            }, {
                name: 'denomtipo',
                type: 'string'
            }, {
                name: 'nombre'
            }
            ])
    });

    strecibidopor.on('beforeload', function () {
        strecibidopor.baseParams.tipo = cbxtiporecibidopor.getValue()
    });

    cbrecibidopor = new Ext.form.ComboBox({
        //fieldLabel: 'Recibido por',
        //hideLabel: true,
        labelSeparator: '',
        disabledClass: 'disabled-component',
        id: 'cbrecibidopor',
        tpl: '<tpl for="."><div ext:qtip="{denomtipo}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        mode: 'remote',
        hideTrigger: false,
        allowBlank: true,
        //disabled: true,
        //  editable: true,
        readOnly: false,
        selectOnFocus: true,
        //store: strecibidopor,
        store: strecibidopor,
        valueField: 'id',
        displayField: 'nombre',
        //hiddenName: 'id',
        forceSelection: true,
        anchor: '99%',
        minChars: 3, //Para la nueva busqueda poner contraria esta linea
        pageSize: 10, //Para la nueva busqueda poner contraria esta linea
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        /*allowBlank: false,
         blankText :'Este campo es obligatorio.',*/
        listeners: {
            change: function (dfe, newValue, oldValue) {
                if (acc == 'mod' && newValue != oldValue)
                    cambio = true;
            },
            keypress: function (t, e) {
                if (e.getKey() == 8 || e.getKey() == 46) {
                    cbrecibidopor.clearValue();
                    //selectcasetipodoc(0);
                    validatePrincipalForm();
                } else if (e.getKey() == 13 && acc != 'mod') { // Buscar con enter
                    //buscargenerico(strecibidopor, cbrecibidopor, 1);
                    cbrecibidopor.expand();
                }
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbrecibidopor').getValue() != 'Seleccione...' && Ext.getCmp('cbrecibidopor').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbrecibidopor'), Ext.getCmp('cbrecibidopor').getRawValue());
                 });*/
            },
            select: function () {
                cbEspecialidad2.focus(true, true);

                validatePrincipalForm();
            },
            focus: function () {
                validatePrincipalForm();
            }
        }
    });
    //  Boton "Buscar Recibido por"
    btnrecibidopor = new Ext.Button({
        text: 'Buscar',
        tooltip: 'Buscar receptor',
        style: 'margin: 5 0 0 0',
        disabled: true,
        id: 'btnrecibidopor',
//        icon: perfil.dirImg + 'buscar.png',
        iconCls: 'buscar',
        handler: function () {
            buscargenerico(strecibidopor, cbrecibidopor, 1);
        }
    });
    //comboiframe de la especialidad
//    comboIframe1 = new Ext.CONT.UIXCombo({
//        fieldLabel: 'Especialidad',
//        emptyText: 'Seleccione...',
//        hiddenTbar: true
//    }, {
//        identificador: 'Especialidad',
//        displayText: 'Especialidad',
//        singleSelect: true,
//        url: 'loadTreeEspecialidad',
//        reader: jrEspecialidad = new Ext.data.JsonReader({
//            id: 'idespecialidad'
//        }, [{
//                name: 'text',
//                mapping: 'especialidad'
//            }, {
//                name: 'codigo',
//                mapping: 'especialidad'
//            }, {
//                name: 'codespecialidad',
//                mapping: 'codespecialidad'
//            }, {
//                name: '_parent',
//                mapping: 'padre'
//            }, {
//                name: '_is_leaf',
//                mapping: 'leaf'
//            }, {
//                name: 'ordenizq'
//            }, {
//                name: 'ordender'
//            }, {
//                name: 'idespecialidad'
//            }])
//    });
//    comboIframe1.on('keypress', function(t, e) {
//        if (e.getKey() == 13) {
//            /*if (!scope.cbAddCuenta.disabled)
//             scope.cbAddCuenta.focus(true, 10);
//             else if (!scope.cbAddTipoDoc.disabled)
//             scope.cbAddTipoDoc.focus(true, 10);
//             else if (!scope.cbAddCondicionPago.disabled)
//             scope.cbAddCondicionPago.focus(true, 10);
//             else
//             scope.tfAddNumeroDocumento.focus(true, 10);*/
//        }
//        else if ((e.getKey() == 8) || (e.getKey() == 46)) // suprimir y borrar
//            this.clearValue();
//    });

    stEspecialidad2 = this.stEspecialidad = new Ext.data.Store({
        url: 'getcomboiframeespecialidad',
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {name: 'idespecialidad'},
            {name: 'descripcionespecialidad', mapping: 'text'}
        ])
    });

    cbEspecialidad2 = new Ext.contabilidad.util.linkedCombo({
        id: 'cbEspecialidad2',
        fieldLabel: 'Especialidad',
        labelWidth: 10,
        store: stEspecialidad2,
        displayField: 'descripcionespecialidad',
        valueField: 'idespecialidad',
        allowBlank: true,
        listHeight: 200,
        lazyRender: true,
        fnCreateNew: Ext.emptyFn,
        enableKeyEvents: true,
        anchor: '99.15%',
        tabIndex: 9,
        listeners: {
            keypress: function (tf, event) {
                if (event.getKey() == 13) {
                    tacomentario.focus(true, 100);
                } else if (event.getKey() == 8 || event.getKey() == 46) {
                    cbEspecialidad2.clearValue();
                    cbEspecialidad2.reset();
                }
            },
            select: function () {
                tacomentario.focus(true, 100);
            }
        }
    });

    /*comboIframe1 = new Ext.UCID.ComboIframe({
     fieldLabel: 'Especialidad',
     //allowBlank: false,                    comentado para XETID 31/10/2013---adolfo P/O de Lelo
     valueField: 'idespecialidad',
     displayField: 'descripcionespecialidad',
     id: 'comboIframe1',
     editable: false,
     resizable: true,
     idIframe: 'especialidad',
     onSelectNodo: function(nodo) {
     if (nodo.attributes.id != 0) {
     var node = nodo;
     var codespecialidad = ''; //almacena el codigo de la especialidad
     while (node.parentNode.id != 0)
     {
     codespecialidad = nodo.parentNode.attributes.codespecialidad + codespecialidad + '.';
     node = node.parentNode;
     }
     idespecialidad = '';
     idespecialidad = nodo.attributes.id; //se guarda el id de la especialidad
     comboIframe1.reset();
     comboIframe1.setValue(nodo.attributes.id);
     comboIframe1.setRawValue(codespecialidad + nodo.attributes.text);
     }
     else {
     comboIframe1.reset();
     idespecialidad = '';
     }
     },
     url: 'getcomboiframeespecialidad',
     anchor: '100%'
     });*/

    var ppanel4 = new Ext.FormPanel({
        frame: true,
        height: 115,
        items: [{
            layout: 'column',
            labelWidth: 100,
            items: [{
                //columnWidth: .87,
                columnWidth: .25,
                style: 'margin:0 0 0 5',
                layout: 'form',
                labelAlign: 'top',
                //items: [cbxbeneficiario, cbrecibidopor, cbEspecialidad2]
                items: [/*btnbeneficiario, */cbxtipobeneficiario /*, btnrecibidopor,*/ /*cbxtiporecibidopor*/]
            }, {
                //columnWidth: .13,
                columnWidth: .75,
                //style: 'margin:-5 0 0 13',
                style: 'margin:0 0 0 0',
                layout: 'form',
                labelAlign: 'top',
                //items: [/*btnbeneficiario, */cbxtipobeneficiario, btnrecibidopor]
                items: [cbxbeneficiario/*, /*cbrecibidopor*//*, cbEspecialidad2*/]
            }, {
                //columnWidth: .13,
                id: 'formespecialidad',
                columnWidth: 1,
                //style: 'margin:-5 0 0 13',
                style: 'margin:0 0 10 5',
                layout: 'form',
                labelAlign: 'top',
                items: [cbEspecialidad2]
            }
            ]
        }]
    });
    /*****  Quinta Fila *****/
    //  TextArea Comentario
    tacomentario = new Ext.form.TextField({
        fieldLabel: 'Comentario', //perfil.etiquetas.lbtaComentario,
        disabled: false,
        id: 'tacomentario',
        //height : 40,
        anchor: '100%',
        //maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\(\)\,\.\-\\\/\:\;\#]+$/,
        //regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\(\)\,\.\-\\\/\:\;\#]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\(\)\,\.\-\\\/\:\;\#]*)+$/,
        //regexText: 'Este campo solo permite letras y n&uacute;meros.',
        maxLength: 255,
        maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 255 caracteres.',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        enableKeyEvents: true,
        tabIndex: 10,
        listeners: {
            change: function (tfi, newValue, oldValue) {
                if (acc == 'mod' && newValue != oldValue)
                    cambio = true;
            },
            keypress: function (tf, event) {
                if (event.getKey() == event.ENTER) {
                    btnventana.focus();
                    event.stopEvent(); // Para que no escriba ENTER
                }
            },
            /*invalid: function(cmp, msg) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            },*/
            blur: function (cmp) {
                tacomentario.setValue(limpiarEspacios(tacomentario.getValue()));
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            }
        }
    });
    var ppanel5 = new Ext.FormPanel({
        frame: true,
        items: [{
//labelAlign : 'top',
            autoHeight: true,
            layout: 'column',
            items: [{
                style: 'margin:0 10 0 5',
                layout: 'form',
                columnWidth: 1,
                items: [tacomentario]
            }]
        }]
    });
    //panel que contiene los elementos del norte de la ventana instrumento
    fpadicionarinst = new Ext.Panel({
        region: 'north',
        autoHeight: true,
        items: [ppanel1, ppanel2, ppanel33, ppanel4, ppanel5]
    });
    //  Boton "Adicionar operaciones"
    btnventana = new Ext.Button({
        text: 'Adicionar',
        tooltip: 'Adicionar operaci\xF3n',
        disabled: false,
        id: 'btnventana',
//        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        tabIndex: 11,
        handler: function () {
            if (RangoImporte(tfimporte.getValue())) {
//              para que coja el tab de las liquidaciones
                if (Ext.getCmp('tpoperInstrumento').getActiveTab().id == 'taboper1') {
                    abrirventanaope = 1;
                    tipoventana();
                    if (!valoresEnVentRe && cbxbeneficiario.disabled && acc == 'add') // vacio y desabilitado : pongo reset
                    {
                        cbxbeneficiario.setDisabled(false);
                        btnbeneficiario.setDisabled(false);
                    }
                }

                var band = true;
                if (!(ppanel1.getForm().isValid() && ppanel2.getForm().isValid() && ppanel33.getForm().isValid() && ppanel4.getForm().isValid() && ppanel5.getForm().isValid()))
                    band = false;
                if (!cbxbeneficiario.getValue() && abrirventanaope == 2) {
                    cbxbeneficiario.markInvalid('Este campo es obligatorio.'/*perfil.etiquetas.lbtfMarkproveedor*/);
                    band = false;
                } else if (!cbxbeneficiario.getValue() && abrirventanaope == 4) {
                    cbxbeneficiario.markInvalid('Este campo es obligatorio.'/*perfil.etiquetas.lbtfMarkproveedor*/);
                    band = false;
                }
                if (band) {
                    if (valoresEnVentPa == 0) {
                        cbmovimientopaa.enable();
                    }
                    verificaSaldo(tfimporte.getValue());
                } else
                    mostrarMensaje(1, 'Por favor verifique nuevamente que hay campos con valores incorrectos.');
            }
        }
    });
    /*************INICIO TAB OPERACIONES DEL ADD INSTRUMENTO**************************/

    /*****************LIQUIDACIONES**************************/
    /*  Store del grid liquidar */
    sttabliquidar = new GroupingStore({
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'id'
            }, {
                name: 'nro'
            }, {
                name: 'docdenomin'
            }, {
                name: 'estado'
            }, {
                name: 'origen'
            }, {
                name: 'edad'
            }, {
                name: 'comentario'
            }, {
                name: 'impliquidar'
            }, {
                name: 'liquidarimp'
            }, {
                name: 'idoperacion'
            }, {
                name: 'descoperacion'
            }
            ]),
        sortInfo: {
            field: 'nro',
            direction: 'ASC'
        },
        groupField: 'descoperacion',
        // listeners: {
        //     add: function (store) {
        //     }
        // }
    });
    /* Check para seleccionar en el grid liquidar */
    smtabliquidar = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    /* GridPanel Liquidar  */
    gptabliquidar = new Ext.grid.GridPanel({
        id: 'gptabliquidar',
        region: 'center',
        autoExpandColumn: 'expandir',
        store: sttabliquidar,
        sm: smtabliquidar,
        autoScroll: true,
        frame: true,
        loadMask: true,
        columns: [
            {
                header: 'id',
                hidden: true,
                hideable: false,
                width: 70,
                dataIndex: 'id'
            },
            {
                header: 'N&uacute;mero',
                sortable: true,
                width: 70,
                dataIndex: 'nro'
            },
            {
                header: 'Tipo documento',
                sortable: true,
                width: 90,
                dataIndex: 'docdenomin'
            },
            {
                header: 'Estado',
                sortable: true,
                width: 90,
                dataIndex: 'estado'
            },
            {
                header: 'Origen',
                sortable: true,
                width: 90,
                dataIndex: 'origen'
            },
            {
                header: 'Edad',
                sortable: true,
                width: 80,
                dataIndex: 'edad'
            },
            {
                header: 'Comentario',
                sortable: true,
                width: 175,
                dataIndex: 'comentario',
                id: 'expandir'
            },
            {
                header: 'Importe',
                sortable: true,
                width: 75,
                dataIndex: 'impliquidar',
                renderer: formatoMonedaABS,
                align: 'right'
            },
            {
                header: 'A liquidar',
                sortable: true,
                width: 75,
                dataIndex: 'liquidarimp',
                align: 'right',
                renderer: formatoMonedaABS
            },
            {
                hidden: true,
                header: 'Operaci\xF3n',
                //hideable: true,
                dataIndex: 'descoperacion'
            }
        ],
        view: new Ext.grid.GroupingView()
    });
    /*****************ANTICIPOS**************************/
    //store del grid anticipo
    sttabanticipo = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad'
        }, [{
            name: 'nocontrato'
        }, {
            name: 'idctacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'comentario'
        }, {
            name: 'importe'
        }, {
            name: 'idoperacionpa'
        }, {
            name: 'descoperacionpa'
        }, {
            name: 'idctaoperacionpa'
        }, {
            name: 'idctacontrapartida'
        }, {
            name: 'nombrectacontrapartida'
        }
        ])
    });
    //sm del grid anticipo
    smtabanticipo = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    /* GridPanel anticipo  */
    gptabanticipo = new Ext.grid.GridPanel({
        store: sttabanticipo,
        region: 'center',
        id: 'gptabanticipo',
        autoScroll: true,
        autoExpandColumn: 'comentario',
        frame: true,
        sm: smtabanticipo,
        columns: [
            {
                id: 'nocontrato',
                width: 120,
                header: 'No. contrato',
                dataIndex: 'nocontrato'
            }, {
                id: 'idctacontable',
                hidden: true,
                hideable: false,
                dataIndex: 'idctacontable'
            }, {
                id: 'ctadebitar',
                width: 240,
                header: 'Cuenta de banco',
                dataIndex: 'ctacontable'
            }, {
                id: 'ctacontrapartida',
                width: 240,
                header: 'Cuenta contrapartida',
                dataIndex: 'nombrectacontrapartida'
            }, {
                id: 'descoperacionpa',
                width: 240,
                header: 'Operaci\xF3n',
                dataIndex: 'descoperacionpa'
            }, {
                id: 'comentario',
                header: 'Comentario',
                dataIndex: 'comentario'
            }, {
                id: 'importe',
                width: 140,
                header: 'Importe',
                align: 'right',
                renderer: formatoMonedaABS,
                dataIndex: 'importe'
            }, {
                id: 'idoperacionpa',
                hidden: true,
                hideable: false,
                header: 'idoper',
                dataIndex: 'idoperacionpa'
            }, {
                id: 'idctaoperacionpa',
                hidden: true,
                hideable: false,
                header: 'idctaoper',
                dataIndex: 'idctaoperacionpa'
            }]
    });
    /*****************OPERACIONES**************************/
    //store del grid operaciones
    sttaboperaciones = new Ext.data.Store({
        url: 'cargaroperacionesinstrumento',
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'idoperacion'
            }, {
                name: 'descoperacion'
            }, {
                name: 'idctacontable'
            }, {
                name: 'ctacontable'
            }, {
                name: 'ctabancaria'
            }, {
                name: 'importe'
            }, {
                name: 'idctaoperacion'
            }, {
                name: 'signo'
            }, {
                name: 'idctacontrapartida'
            }, {
                name: 'ctacontrapartida'
            }, {
                name: 'idmovimientocaja'
            }, {
                name: 'idfechacierrenomina'
            }, {
                name: 'idanticipo'
            }, {
                name: 'idclienteproveedor'
            }, {
                name: 'clienteproveedor'
            }
            ])
    });
    //sm de tab operaciones
    smtaboperaciones = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    /* GridPanel operaciones del instrumento  */
    gptaboperaciones = new Ext.grid.GridPanel({
        store: sttaboperaciones,
        id: 'gptaboperaciones',
        width: 852,
        autoScroll: true,
        autoExpandColumn: 'operacion',
        frame: true,
        loadMask: true,
        sm: smtaboperaciones,
        columns: [
            {
                id: 'idctacontable',
                hidden: true,
                hideable: false,
                dataIndex: 'idctacontable'
            }, {
                id: 'ctadebitar',
                width: 200,
                header: 'Cuenta de banco',
                dataIndex: 'ctacontable'
            }, {
                id: 'idoperacion',
                hidden: true,
                hideable: false,
                dataIndex: 'idoperacion'
            }, {
                id: 'operacion',
                header: 'Operaci\xF3n',
                dataIndex: 'descoperacion'
            }, {
                id: 'ctabancaria',
                width: 200,
                header: 'Cuenta contrapartida',
                dataIndex: 'ctacontrapartida'
            }, {
                id: 'moneda',
                width: 60,
                header: 'Moneda',
                dataIndex: 'moneda'
            }, {
                id: 'importe',
                width: 120,
                header: 'Importe',
                align: 'right',
                renderer: formatoMonedaABS,
                dataIndex: 'importe'
            }, {
                id: 'idctaoperacion',
                header: 'idctaoperacion',
                hidden: true,
                hideable: false,
                dataIndex: 'idctaoperacion'
            }]
    });
    //tab panel de las operaciones
    var tpoperInstrumento = new Ext.TabPanel({
        activeTab: 0,
        id: 'tpoperInstrumento',
        frame: true,
        items: [{
            id: 'taboper1',
            //disabled : true,
            title: 'Liquidaciones', //perfil.etiquetas.lbTabLiq,
            layout: 'fit',
            items: gptabliquidar
        }, {
            id: 'taboper2',
            //disabled : true,
            title: 'Cobros/Pagos anticipados', //perfil.etiquetas.lbTabAnt,
            layout: 'fit',
            items: gptabanticipo
        }, {
            id: 'taboper3',
            //disabled : true,
            title: 'Otras operaciones', //perfil.etiquetas.lbTabOtros,
            layout: 'fit',
            items: gptaboperaciones
        }/*, {
             id: 'taboper3',
             disabled : true,
             title : 'Reembolsos',//perfil.etiquetas.lbTabRem,
             layout : 'fit',
             items : gpmostrareembolso
             }*/],
        listeners: {
            tabchange: function (thisEl, tab) {
                if (tab.id == 'taboper1') {
                    abrirventanaope = 1;
                    tipoventana();
                    if (!valoresEnVentRe && cbxbeneficiario.disabled && acc == 'add') // vacio y desabilitado : pongo reset
                    {
                        cbxbeneficiario.setDisabled(false);
                        btnbeneficiario.setDisabled(false);
                    }
                } else if (tab.id == 'taboper2') {
                    abrirventanaope = 2;
                    tipoventana();
                    if (!valoresEnVentRe && cbxbeneficiario.disabled && acc == 'add') // vacio y desabilitado : pongo reset
                    {
                        cbxbeneficiario.setDisabled(false);
                        btnbeneficiario.setDisabled(false);
                    }
                } else if (tab.id == 'taboper3') {
                    abrirventanaope = 4;
                    tipoventana();
                    if (!valoresEnVentRe && cbxbeneficiario.disabled && acc == 'add') // vacio y desabilitado : pongo reset
                    {
                        cbxbeneficiario.setDisabled(false);
                        btnbeneficiario.setDisabled(false);
                    }
                }
                /*else if(tab.id == 'taboper3'){
                 abrirventanaope = 3;
                 desabilitaBeneficiario();
                 tipoventana();
                 }*/
            }
        }
    });
    var lfTitleTab = new Ext.form.Label({
        id: 'lfTitleTab',
        text: 'Operaciones del instrumento',
        style: 'color:#15428B;font:bold 11px tahoma,arial,verdana,sans-serif;'
    });

    lfImporteTotalAllOperaciones = new Ext.form.Label({
        id: 'lfImporteTotalAllOperaciones',
        text: '0.00',
        style: 'color:#15428B;font:bold 11px tahoma,arial,verdana,sans-serif;'
    });
    var vacio = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    var fpTabOperaciones = new Ext.FormPanel({
        tbar: ['&nbsp;', lfTitleTab, '->', '<b>Importe total:</b>', ' ', lfImporteTotalAllOperaciones, '-', btnventana, vacio],
        region: 'center',
        layout: 'fit',
        items: [tpoperInstrumento]
    });
    /*************FIN TAB OPERACIONES DEL ADD INSTRUMENTO**************************/

        //boton aplicar
    var aplicarmodinst = new Ext.Button({
//        icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            tabIndex: 13,
            handler: function () {
                presionandobtnaplicar = true;
                accionbtnAddModInstrumentoBancario();
            }
        });

    //  Ventana "Adicionar/Modificar instumento bancario"
    wininstbanc = new Ext.Window({
        autoValidate: false,
        constrain: true,
        layout: 'border',
        width: 800,
        height: 590,
        modal: true,
        border: false,
        resizable: true,
        closeAction: 'hide',
        items: [fpadicionarinst, fpTabOperaciones/*ppanel6*/],
        buttons: [{
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            tabIndex: 12,
            handler: function () {
                limpiardatos();
                cbtipodoc.reset();
                wininstbanc.hide();
                //  arrliquidacion = new Array();//se limpia el array para las liquidacion duda creo q no se usa
                arroperliquidacion = new Array();//se limpia el array de operaciones de la liquidacion
                arroperacioninst = new Array();//se limpia el array para las operaciones del instrumento
                arroanticipoinst = new Array();//se limpia el array para los anticipos del instrumento
                operaciondeliq = '';
            }
        }, aplicarmodinst, {
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            tabIndex: 14,
            handler: function () {
                presionandobtnaplicar = false;
                accionbtnAddModInstrumentoBancario();
            }
        }],
        listeners: {
            show: function (window) {
                //se borran los datos de los tab y sus respectivos array
                sttaboperaciones.removeAll(); // se limpia el grid info de las operaciones realizadas
                sttabanticipo.removeAll(); // se limpia el grid info de los anticipos realizadas
                sttabliquidar.removeAll(); // se limpia el grid info de las liquidaciones realizadas
                arrtabliquidacion = new Array(); //se limpia el arreglo del tab de las liquidaciones

                Ext.getCmp('taboper1').setDisabled(true);
                Ext.getCmp('taboper2').setDisabled(true);
                Ext.getCmp('taboper3').setDisabled(true);
                if (acc != 'mod') {
                    cbtipoOpInstr.focus(true, true);
                } else {
                    // tfvalidarnodocumento.focus(false, 10);
                }

                //Key map del inicio y fin del formulario
                var btnAccept = window.buttons[2];
                btnAccept.getEl().addKeyMap([
                    {
                        key: Ext.EventObject.TAB,
                        stopEvent: true,
                        fn: function () {
                            cbtipoOpInstr.focus(true, true);
                        }
                    }
                ]);

                cbtipoOpInstr.getEl().addKeyMap([
                    {
                        key: Ext.EventObject.TAB,
                        shift: true,
                        stopEvent: true,
                        fn: function () {
                            btnAccept.focus();
                        }
                    }
                ]);
                ppanel4.getForm().isValid();
                tacomentario.markInvalid('Este campo es obligatorio.');
                // tacomentario.isValid();
                ppanel1.getForm().isValid();
                ppanel2.getForm().isValid();
                ppanel33.getForm().isValid();

            },
            hide: function (Grid, rowIndex, e) {
                noWindow = true; //se pone en true para indicar que la ventana fue cerrada

                Ext.getCmp('btnchequeanterior').disable();
                Ext.getCmp('btnchequesiguiente').disable();
                cbtipoOpInstr.clearValue();

                limpiardatos();
                limpiarDatosOperaciones();
                cbtipodoc.reset();
                //btnAdicionar.focus();
            },
        }
    });

    //Función necesaria para adicionar un instrumento bancario
    function accionbtnAddModInstrumentoBancario() {
        ppanel1.getForm().isValid();
        ppanel2.getForm().isValid();
        if (ppanel4.getForm().isValid() && tacomentario.getValue() && ppanel1.getForm().isValid() && ppanel2.getForm().isValid()) {
            if (RangoImporte(tfimporte.getValue())) {
                var band = true;
                if (!(ppanel1.getForm().isValid() && ppanel2.getForm().isValid() && ppanel33.getForm().isValid() && ppanel4.getForm().isValid() && ppanel5.getForm().isValid()))
                    band = false;
                if (!cbxbeneficiario.getValue() && abrirventanaope == 2) {
                    cbxbeneficiario.markInvalid('Este campo es obligatorio.'/*perfil.etiquetas.lbtfMarkproveedor*/);
                    band = false;
                } else if (!cbxbeneficiario.getValue() && abrirventanaope == 4) {
                    cbxbeneficiario.markInvalid('Este campo es obligatorio.'/*perfil.etiquetas.lbtfMarkproveedor*/);
                    band = false;
                }
                if (band) {
                    if (valoresEnVentRe && strecibidopor.getAt(0).get('tipo') != 5) {
                        mostrarMensaje(3, 'El instrumento bancario solo puede ser recibido por una caja.');
                    } else if (valoresEnVentRe || valoresEnVentLiq || valoresEnVentPa || valoresEnVentOp || acc == 'mod') {
                        //caso en que se hacen instrumentos de salida
                        if (acc != 'mod' && !importedisponible && cbtipoOpInstr.getValue() == 2) {
                            MostrarEtiquetas(Ext.getBody(), 'Verificando saldo disponible de cuenta seleccionada...' /*perfil.etiquetas.lbMsgmaskTemp*/);
                            Ext.Ajax.request({
                                url: 'verificasaldo',
                                method: 'POST',
                                params: {
                                    idcta: cbcuentabanc.getValue()
                                },
                                callback: function (options, success, response) {
                                    lMasktemp.hide();
                                    if (success) {
                                        importedisponible = true;
                                        result = eval(Ext.decode(response.responseText));
                                        if (tfimporte.getValue() > parseFloat(result)) {
                                            mostrarMensaje(1, 'El importe introducido es mayor que el disponible en la cuenta seleccionada. Seleccione otra cuenta o introduzca otro importe.');
                                            tfimporte.markInvalid('El importe supera el disponible de la cuenta bancaria seleccionada.');
                                            cbcuentabanc.focus(true, true);
                                        } else {
                                            if (saldounformat(tfresto.getValue()) == 0) {
                                                //caso en que esta adicionando
                                                if (acc == 'ins') {
                                                    //se valida que no sea obligatorio certificarlo
                                                    indextipodoc = sttipodoc.find('iddoc', cbtipodoc.getValue());
                                                    //se obtiene el saldo obligatorio a certificar
                                                    impcertificar = parseFloat(sttipodoc.getAt(indextipodoc).data.importecertifica);
                                                    //se verifica si excede el importe obligatorio para certificar
                                                    if (impcertificar != 0 && impcertificar < parseFloat(tfimporte.getValue())) {
                                                        clickCertificararInst('flujo', 1); //indica que es en el flujo normal y btn aceptar
                                                        //wininstbanc.hide();  // se cierre la ventana del instrumento
                                                    } else {
                                                        //se adiciona sin necesidad de certificar
                                                        adicionarinstbanc(1);
                                                        //wininstbanc.hide(); // se cierre la ventana del instrumento
                                                    }
                                                    /*
                                                     sttaboperaciones.removeAll(); // se limpia el grid info de las operaciones realizadas
                                                     sttabanticipo.removeAll(); // se limpia el grid info de los anticipos realizadas
                                                     sttabliquidar.removeAll(); // se limpia el grid info de las liquidaciones realizadas
                                                     arrtabliquidacion = new Array(); //se limpia el arreglo del tab de las liquidaciones
                                                     */
                                                }

                                                if (acc == 'mod') {
                                                    if (modificarinstbanc())
                                                        wininstbanc.hide();
                                                }
                                            } else if (formatnegativo(tfresto.getValue()))
                                                mostrarMensaje(1, 'El importe ingresado es inferior al importe distribuido.');
                                            else
                                                mostrarMensaje(1, 'A&uacute;n le queda dinero por distribuir. <br>Le quedan ' + saldounformat(tfresto.getValue()) + ' pesos por distribuir.</br>');
                                        }
                                    }
                                }
                            });
                        } else {
                            //caso en que se hacen instrumentos de entrada
                            if (saldounformat(tfresto.getValue()) == 0) {
                                //caso en que esta adicionando
                                if (acc == 'ins') {
                                    //se valida que no sea obligatorio certificarlo
                                    indextipodoc = sttipodoc.find('iddoc', cbtipodoc.getValue());
                                    //se obtiene el saldo obligatorio a certificar
                                    impcertificar = parseFloat(sttipodoc.getAt(indextipodoc).data.importecertifica);
                                    //se verifica si excede el importe obligatorio para certificar
                                    if (impcertificar != 0 && impcertificar < parseFloat(tfimporte.getValue())) {
                                        clickCertificararInst('flujo', 1); //indica que es en el flujo normal y btn aceptar
                                        //wininstbanc.hide();  // se cierre la ventana del instrumento
                                    }
                                    //se adiciona sin necesidad de certificar
                                    else {
                                        adicionarinstbanc(1);// 1-Aceptar
                                        //wininstbanc.hide(); // se cierre la ventana del instrumento
                                    }
                                    /*
                                     sttaboperaciones.removeAll(); // se limpia el grid info de las operaciones realizadas
                                     sttabanticipo.removeAll(); // se limpia el grid info de los anticipos realizadas
                                     sttabliquidar.removeAll(); // se limpia el grid info de las liquidaciones realizadas
                                     arrtabliquidacion = new Array(); //se limpia el arreglo del tab de las liquidaciones
                                     */
                                }
                                if (acc == 'mod') {
                                    if (modificarinstbanc())
                                        wininstbanc.hide();
                                }
                            } else if (formatnegativo(tfresto.getValue()))
                                mostrarMensaje(1, 'El importe ingresado es inferior al importe distribuido.');
                            else
                                mostrarMensaje(1, 'A&uacute;n le quedan ' + saldounformat(tfresto.getValue()) + ' pesos por distribuir.');
                            //} else mostrarMensaje(1,'Debe completar los datos de la operaci\xF3n antes de guardar el instrumento.');
                        }
                    } else {
//                                mostrarMensaje(1, 'No ha seleccionado la operaci\xF3n que quiere realizar.');
                        mostrarMensaje(1, 'No hay operaciones asociadas al instrumento bancario.');
                    }
                } else
                    mostrarMensaje(1, 'Por favor verifique nuevamente que hay campos con valores incorrectos.');
            }
        } else {
            mostrarMensaje(1, 'Por favor verifique nuevamente que hay campos con valores incorrectos.');
            if (tacomentario.getValue() == '') {
                tacomentario.markInvalid('Este campo es obligatorio.');
            }
        }
    }

    /****************************************************/
    ////////////  VENTANA  NUMEMRO SOLICITUD  ////////////
    /****************************************************/
    //  TextField "Numero de Solicitud"
    tfnumtemp = new Ext.form.TextField({
        fieldLabel: 'N&uacute;mero de solicitud', // perfil.etiquetas.lbNumsolicitud,
        id: 'tfnumtemp',
        labelAlign: 'top',
        width: 200,
        disabledClass: 'disabled-component',
        allowBlank: false,
        editable: false
    });
    paneltemp = new Ext.FormPanel({
        id: 'paneltemp',
        labelAlign: 'top',
        region: 'center',
        height: 250,
        frame: true,
        items: [
            {
                layout: 'form',
                items: [{
                    width: 320,
                    layout: 'column',
                    items: [{
                        layout: 'form',
                        columnWidth: .99,
                        style: 'margin:0 0 0 11',
                        items: [tfnumtemp]
                    }]
                }]
            }
        ]
    });
    /****************************************************/
    ///////////////  VENTANA LIQUIDACIONES   /////////////
    /****************************************************/
    /*   Campo Fiscal  */
    tffiscalliq = new Ext.form.TextField({
        fieldLabel: 'Fiscal',
        id: 'tffiscalliq',
        readOnly: true,
        disabled: true,
        disabledClass: 'disabled-component',
        editable: false,
        allowBlank: false,
        anchor: '100%'
    });
    /*   Store de Combox Movimiento (operaciones) */
    stmovimientoliq = new Ext.data.Store({
        url: 'cargarmovimientos',
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad',
            id: 'idoperacion'
        }, [
            {
                name: 'idoperacion',
                type: 'string'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'idnomoperaciones',
                type: 'string'
            },
            {
                name: 'idcuenta',
                type: 'string'
            },
            {
                name: 'signo'
            }
        ]),
        sortInfo: {
            field: 'denominacion',
            direction: 'ASC'
        },
        listeners: {
            beforeload: function (s, options) {
                stmovimientoliq.clearFilter(true);
                stmovimientoliq.removeAll();
            },
            load: function (store, records, options) {
                if (Ext.isEmpty(cbmovimientoliq)) {
                    if (!Ext.isEmpty(operaciondeliq)) {
                        cbmovimientoliq.setValue(operaciondeliq);
                    } else {
                        cbmovimientoliq.clearValue();
                    }
                }
            }
        }
// DESC
    });
    stmonedatasa = new Ext.data.Store({
        url: 'buscarmoneda',
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idmoneda',
                type: 'string'
            },
            {
                name: 'moneda'
            },
            {
                name: 'idtasa',
                type: 'string'
            },
            {
                name: 'tasacompra'
            },
            {
                name: 'factordeconversion'
            }
        ])
    });
    /*   Combox Movimiento (Operaciones) Liquidaciones */
    cbmovimientoliq = new Ext.form.ComboBox({
        fieldLabel: 'Operaci\xF3n'/*perfil.etiquetas.lbcbMovimiento*/,
        disabledClass: 'disabled-component',
        id: 'cbmovimientoliq',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        mode: 'local',
        emptyText: 'Seleccione...',
        editable: true,
        store: stmovimientoliq,
        valueField: 'idoperacion',
        displayField: 'denominacion',
        hiddenName: 'idoperacion',
        forceSelection: true,
        anchor: '100%',
        triggerAction: 'all',
        /*maskRe : /^([0-9a-zA-Z \(\)\-\+\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \(\)\-\+\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        //allowBlank: false,
        enableKeyEvents: true,
        typeAhead: true,
        listeners: {
            change: function (cbx, newValue, oldValue) {
                /*if (acc == 'mod' && newValue != oldValue)
                 cbmovimientoliq.setValue(oldValue);*/
            },
            keypress: function (t, e) {
                if ((e.getKey() == 8) || (e.getKey() == 46)) {
                    cbmovimientoliq.clearValue();
                }
            },
            select: function () {
                //if (acc != 'mod')
                //cagarliquidacion();
            }/*,
             render: function (component) {
             component.getEl().on('mouseover', function () {
             if (Ext.getCmp('cbmovimientoliq').getValue() != 'Seleccione...' && Ext.getCmp('cbmovimientoliq').getValue().length > 0)
             fToolTipShow(Ext.getCmp('cbmovimientoliq'), Ext.getCmp('cbmovimientoliq').getRawValue());
             });
             }*/
        }
    });
    /*   Campos Importe  de ventana principal del adicionar instrumento*/
    tfimportetotalliq = new Ext.form.TextField({
        fieldLabel: 'Importe',
        id: 'tfimportetotalliq',
        readOnly: true,
        disabled: true,
        disabledClass: 'disabled-component',
        style: 'text-align:right;',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        selectOnFocus: true,
        anchor: '100%',
        listeners: {
            blur: function () {
                tfimportetotalliq.setRawValue(saldo(tfimportetotalliq.getValue()));
            }
        }
    });
    /*   Campos Moneda  */
    tfmonedaliq = new Ext.form.TextField({
        fieldLabel: 'Moneda',
        id: 'tfmonedaliq',
        readOnly: true,
        disabled: true,
        disabledClass: 'disabled-component',
        editable: false,
        allowBlank: false,
        anchor: '100%'
    });
    /*   Campos Fecha  */
    tffechaliq = new Ext.form.TextField({
        fieldLabel: 'Fecha',
        readOnly: true,
        disabled: true,
        disabledClass: 'disabled-component',
        editable: false,
        allowBlank: false,
        anchor: '100%'
    });
    tfimpliq = new Ext.form.NumberField({
        name: 'tfimpliq',
        id: 'tfimpliq',
        allowNegative: false,
        disabledClass: 'disabled-component',
        style: 'text-align:right;',
        allowDecimals: true,
        enableKeyEvents: true,
        listeners: {
            keypress: function (t, e) {
                if (String(t.getRawValue()) + String.fromCharCode(e.getKey()) > Math.abs(smliquidar.getSelected().data.impliquidar))
                    if ((e.getKey() != 8) && (e.getKey() != 46)) {
                        e.stopEvent();
                    }
            },
            change: function (cbx, newValue, oldValue) {
                if (newValue != oldValue)
                    cambio = true;
            },
            blur: function () {
                tfimpliq.setRawValue(saldo(tfimpliq.getValue()));
            }
        }
    });
    //  Campos "Resto" este campo es el  mismo que el campo resto  de la ventana crear instrumento
    tfrestoliq = new Ext.form.TextField({
        fieldLabel: 'Resto', //perfil.etiquetas.lbtfresto,
        disabled: true,
        id: 'tfrestoliq',
        style: 'text-align:right;',
        disabledClass: 'disabled-component',
        editable: false,
        readOnly: true,
        anchor: '100%'
    });
    /*  El reader del grid liquidar */
    rdliquidar = new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad'
        },
        [{
            name: 'id'
        },
            {
                name: 'nro',
                type: 'string'
            },
            {
                name: 'fecha'
            },
            {
                name: 'tipodoc'
            },
            {
                name: 'estado'
            },
            {
                name: 'idliquidacion',
                type: 'string'
            },
            {
                name: 'idderecho'
            },
            {
                name: 'comentario'
            },
            {
                name: 'impliquidar'
            },
            {
                name: 'liquidarimp'
            },
            {
                name: 'docdenomin'
            },
            {
                name: 'origen'
            },
            {
                name: 'fechavencimiento'
            },
            {
                name: 'edad'
            },
            {
                name: 'descoperacion'
            },
            {
                name: 'nombreclienteproveedortrabaj'
            },
            {
                name: 'idcuentacontable'
            },
            {
                name: 'ctacontable'
            },
            {
                name: 'impliquidado'
            },
            {
                name: 'imptotal'
            },
            {
                name: 'idcuentaduo'
            },
            {
                name: 'nomcuentaduo'
            }
        ]);
    /*  Store del grid liquidar */
    stliquidar = new Ext.data.Store({
        url: 'cargargridliquidar',
        reader: rdliquidar,
        sortInfo: {
            field: 'fecha',
            direction: 'ASC'
        }, // DESC
        listeners: {
            beforeload: function (s, options) {
                stliquidar.clearFilter(true);
                stliquidar.removeAll();
                if (acc == 'mod') {
                    idinstbancario = sminstbanc.getSelected().data.iddocumento;
                    stliquidar.baseParams.estado = 1;
                    stliquidar.baseParams.iddoc = idinstbancario;
                    stliquidar.baseParams.tipodoc = cbtipodoc.getValue();
                    stliquidar.baseParams.idclientesproveedores = cbxbeneficiario.getValue() ? cbxbeneficiario.getValue() : 0;
                } else {
                    if (stmonedatasa.getCount()) {
                        stliquidar.baseParams.estado = 0;
                        stliquidar.baseParams.fechaFin = dfemision.getRawValue();
                        stliquidar.baseParams.idclientesproveedores = cbxbeneficiario.getValue() ? cbxbeneficiario.getValue() : 0;
                        stliquidar.baseParams.todoslostrabajadores = (cbxtipobeneficiario.getValue() == 6) ? 1 : 0;

                        //stliquidar.baseParams.idcuentabancia = cbcuentabanc.getValue();
                        stliquidar.baseParams.idmoneda = stmonedatasa.getAt(0).get('idmoneda');
                        stliquidar.baseParams.signo = (cbtipoOpInstr.getValue() == 1) ? 1 : -1;//(1)-Derecho(Cliente)	 (-1)-Obligaciones(Proveedor)
                        stliquidar.baseParams.beneficiario = cbxbeneficiario.getValue() ? cbxbeneficiario.getRawValue() : 0; //Nombre para comprobar mensaje 		0-Fiscal
                        stliquidar.baseParams.idespecialidad = cbEspecialidad2.getValue() ? cbEspecialidad2.getValue() : 0; //id de la especialidad
                    } else
                        return false;
                }
            },
            load: function (st, records, opt) {
                if (cbcuentacontliqui.getValue()) {
                    cbcuentacontliqui.fireEvent('select', cbcuentacontliqui, stcuentacontliqui.getAt(0), 0);
                }
            }
        },
        baseParams: {
            numero: '',
            tipodoc: '',
            testado: '',
            fecha: ''
        }
    });
    /* Check para seleccionar en el grid liquidar */
    //smliquidar = new Ext.grid.RowSelectionModel({
    smliquidar = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        moveEditorOnEnter: false,
        listeners: {
            rowselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpliquidar').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpliquidar').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });
    smliquidar.on('beforerowselect', function (sm, rowIndex, keepExisting, record) {
        if (!cbcuentacontliqui.getValue()) {
            return false;
        }
    });
    //evento para que cargue las liquidaciones al seleccionar el dereuobli
    smliquidar.on('rowselect', function (sm, rowIndex, record) {
        stliquidaciones.removeAll(); //se limpia el grid
        var cont = 0; //contador para si hay que deshabilitar el tf del saldo a liquidar
        var records = smliquidar.getSelections();
        tfsaldoliquidar.reset(); //se limpia el campo importe a liquidar
        if (records.length >= 1) {
            for (var i = 0; i < records.length; i++) {
                if (!records[i].get('liquidarimp')) {
                    records[i].set('liquidarimp', records[i].get('impliquidar'));
                }
                if (records[i].get('liquidarimp') > 0 && records[i].get('idcuentacontable')) {
                    cont++;
                }
            }
            //     if (smliquidar.getSelections()[i].data.liquidarimp == 0) {
            //         tfsaldoliquidar.setValue(parseFloat(smliquidar.getSelections()[i].data.impliquidar) + parseFloat(tfsaldoliquidar.getValue()));
            //         tfsaldoliquidar.setRawValue(saldo(tfsaldoliquidar.getValue()));
            //         cont++;
            //         if (cont > 1)
            //             tfsaldoliquidar.disable(); //se deshabilita el campo inporte a liquidar
            //         Ext.getCmp('btnliquidar').enable(); //se habilita el btn liquidar
            //     }
        } else {//si solo seleccionaron 1 elemento (para que si cambia de operacion cargue las que estaban guardadas)
//if(smliquidar.getSelections().length==1)//si solo selecciono 1 se verifica que tenga liquidaciones
// stliquidaciones.removeAll();//se limpia el grid

            if (arroperliquidacion.length > 0) {
                // cargarLiquidaciones(); //se cargan las liquidaciones de la factura seleccionada

                /*	stliquidaciones.remove(stliquidaciones.getAt(index));//elimina el que estaba
                 stliquidaciones.insert(index, newrT);//adiciona la nueva fila con el importe actualizado
                 actualizarimporteliquidar();//se actualiza el importe a liquidar de la operacion*/
            }
            // if (smliquidar.getSelected().data.liquidarimp == 0)//si no tiene liquidaciones no se carga
            // {// else {//si no tiene liquidaciones se muestra el importe total a liquidar
            //     tfsaldoliquidar.setValue(parseFloat(smliquidar.getSelections()[0].data.impliquidar));
            //     tfsaldoliquidar.setRawValue(saldo(tfsaldoliquidar.getValue()));
            //     tfsaldoliquidar.enable(); //se habilita el campo inporte a liquidar
            //     Ext.getCmp('btnliquidar').enable(); //se habilita el btn liquidar
            // }// }
        }
        if (!record.get('idcuentacontable') && cbcuentacontliqui.getValue()) {
            var temp = stcuentacontliqui.getAt(stcuentacontliqui.find('idcuenta', cbcuentacontliqui.getValue()));
            record.set('idcuentacontable', temp.get('idcuenta'));
            record.set('ctacontable', temp.get('text'));
        }
        if (cont > 0) {
            btnLiquidarHandler([record]);
        }
    }, this);
    //evento para que cargue las liquidaciones al seleccionar el dereuobli
    smliquidar.on('rowdeselect', function (sm, rowIndex, record) {
        var cont = 0; //contador para si hay que deshabilitar el tf del saldo a liquidar
        // tfsaldoliquidar.setValue(0); //se limpia el campo importe a liquidar
        // if (smliquidar.getSelections().length > 1) {
        //     for (var i = 0; i < smliquidar.getSelections().length; i++)
        //         if (smliquidar.getSelections()[i].data.liquidarimp == 0) {
        //             tfsaldoliquidar.setValue(parseFloat(smliquidar.getSelections()[i].data.impliquidar) + parseFloat(tfsaldoliquidar.getValue()));
        //             tfsaldoliquidar.setRawValue(saldo(tfsaldoliquidar.getValue()));
        //             cont++;
        //             if (cont > 1)
        //                 tfsaldoliquidar.disable(); //se deshabilita el campo inporte a liquidar
        //             Ext.getCmp('btnliquidar').enable(); //se habilita el btn liquidar
        //         }
        // } else {//si solo seleccionaron 1 elemento
        //     if (smliquidar.getSelections().length == 1)//si solo selecciono 1 se verifica que tenga liquidaciones
        //         if (smliquidar.getSelected().data.liquidarimp != 0)//si no tiene liquidaciones no se carga
        //             cargarLiquidaciones(); //se cargan las liquidaciones de la factura seleccionada
        //         else {//si no tiene liquidaciones se muestra el importe total a liquidar
        //             stliquidaciones.removeAll(); //se limpia el grid
        //             tfsaldoliquidar.setValue(parseFloat(smliquidar.getSelections()[0].data.impliquidar));
        //             tfsaldoliquidar.setRawValue(saldo(tfsaldoliquidar.getValue()));
        //             tfsaldoliquidar.enable(); //se habilita el campo inporte a liquidar
        //             Ext.getCmp('btnliquidar').enable(); //se habilita el btn liquidar
        //         }
        // }

        // var records = smliquidar.getSelections();
        // tfsaldoliquidar.reset(); //se limpia el campo importe a liquidar
        // if (smliquidar.getSelections().length >= 1) {
        //     for (var i = 0; i < records.length; i++) {
        //         if (records[i].get('liquidarimp') > 0 && records[i].get('idcuentacontable')) {
        //             cont++;
        //         }
        //     }
        // }
        // if (cont > 0) {
        //     btnLiquidarHandler();
        // }
        record.set('liquidarimp', 0);
        var entro = false;
        for (var i = 0; i < arroperliquidacion.length; i++) {
            if (arroperliquidacion[i][0] === record.data.id) {
                arroperliquidacion.remove(arroperliquidacion[i]);
                entro = true;
                break;
            }
        }

        if (entro) {
            importeLiquidacion();
            pagadoOper();

            for (var i = 0; i < arrtabliquidacion.length; i++) {
                if (arrtabliquidacion[i][0] == record.data.id) {
                    arrtabliquidacion.remove(arrtabliquidacion[i]);
                    break;
                }
            }
        }

    }, this);
    //sumar la columna de importe del grid liquidar
    // acceder alos registros seleccionados
    seleccion = smliquidar.getSelections();
    if (seleccion.length)
        sumarimporteliq();
    /*  Columnas del Grid Liquidar */

    var nfLiquidarImp = new Ext.form.NumberField({
        maxLength: 19,
        disabled: false,
        style: 'text-align: right',
        allowBlank: false,
        allowNegative: false,
        anchor: '95%'
    });

    //store del cuenta contable liquidaciones
    stcuentacontliqui = new Ext.data.Store({
        url: 'cargarctascontables',
        reader: new Ext.data.JsonReader({
            id: 'rdcuentacontliqui'
        }, [{
            name: 'idcuenta'
        },
            {
                name: 'text'
            }
        ])
    });

    stcuentacontliqui.on('load', function (st, records, opts) {
        if (records.length === 1) {
            cbcuentacontliqui.setValue(records[0].get('idcuenta'));
            cbcuentacontliqui.fireEvent('select', cbcuentacontliqui, records[0], 0);
            // cbcuentacontliqui.setRawValue(records[0].get('text'));
        }
    });
    //combo cuenta contable liquidaciones
    cbcuentacontliqui = new Ext.form.ComboBox({
        mode: 'local',
        fieldLabel: 'Cuenta contable',
        disabledClass: 'disabled-component',
        tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>', // Paramostrar los datos como detalle
        id: 'cbcuentacontliqui',
        emptyText: 'Seleccione..',
        store: stcuentacontliqui,
        valueField: 'idcuenta',
        displayField: 'text',
        typeAhead: true,
        resizable: true,
        forceSelection: true,
        enableKeyEvents: true,
        triggerAction: 'all',
        editable: false,
        allowBlank: false,
        listWidth: 400,
        anchor: '100%',
        // width: 250,
        listeners: {
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbcuentacontliqui').getValue() != 'Seleccione...' && Ext.getCmp('cbcuentacontliqui').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbcuentacontliqui'), Ext.getCmp('cbcuentacontliqui').getRawValue());
                 });*/
            },
            keypress: function (tf, e) { // Para adicionar con el enter


                // if (e.getKey() == 13) // Enter
                // {
                //     if (smliquidar.getSelections().length > 1 && cbcuentacontliqui.isValid() && tfsaldoliquidar.isValid()) {//si se selecciono mas de una fila y los campos cta contable e importe son validos
                //         var arrayIds = new Array();
                //         for (var i = 0; i < smliquidar.getSelections().length; i++)
                //             if (smliquidar.getSelections()[i].data.liquidarimp == 0)
                //                 arrayIds.push(smliquidar.getSelections()[i].data.id);
                //         if (arrayIds.length > 1)//si se selecciono mas de uno que no se ha liquidado
                //             liquidarVariasFacturas(arrayIds);
                //     } else
                //         addfilaliquidacion('Add'); //se adiciona la unica fila
                //     return;
                // }

            },
            select: function (cb, record, index) {
                var recordsLiq = stliquidar.getRange();
                for (var i = 0; i < recordsLiq.length; i++) {
                    recordsLiq[i].set('idcuentacontable', record.get('idcuenta'));
                    recordsLiq[i].set('ctacontable', record.get('text'));
                }

                var recordsSel = smliquidar.getSelections();
                var flag = false;
                for (var i = 0; i < recordsSel.length; i++) {
                    if (recordsSel[i].get('liquidarimp') > 0 && recordsSel[i].get('idcuentacontable')) {
                        flag = true;
                    } else {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    btnLiquidarHandler(recordsSel);
                }
            }
        }
    });

    cm0 = new Ext.grid.ColumnModel([
        smliquidar,
        {
            header: 'id',
            hidden: true,
            hideable: false,
            width: 70,
            dataIndex: 'id'
        }, {
            header: 'idderecho',
            hidden: true,
            hideable: false,
            width: 70,
            dataIndex: 'idderecho'
        },
        {
            header: 'N&uacute;mero',
            sortable: true,
            width: 70,
            dataIndex: 'nro'
        },
        {
            header: 'Tipo documento',
            sortable: true,
            width: 90,
            dataIndex: 'docdenomin'
        },
        {
            header: 'Estado',
            sortable: true,
            width: 90,
            dataIndex: 'estado'
        },
        {
            header: 'Fecha',
            // hidden: true,
            width: 70,
            dataIndex: 'fecha',
            align: 'center',
            renderer: 'erpFecha'
        },
        {
            header: 'Origen',
            sortable: true,
            width: 90,
            dataIndex: 'origen',
            hidden: true
        },
        {
            header: 'Cuenta',
            sortable: true,
            width: 90,
            dataIndex: 'nomcuentaduo'
        },
        {
            header: 'Fecha vencimiento',
            hidden: true,
            width: 100,
            sortable: true,
            dataIndex: 'fechavencimiento',
            renderer: 'erpFecha'
        },
        {
            header: 'Edad',
            sortable: true,
            width: 80,
            dataIndex: 'edad'
        },
        {
            header: 'Liquidar a:',
            sortable: true,
            width: 250,
            dataIndex: 'nombreclienteproveedortrabaj',
            id: 'expandir'
        },
        {
            header: 'Comentario',
            sortable: true,
            width: 100,
            dataIndex: 'comentario',
            hidden: true,
        },
        {
            header: 'Importe total',
            sortable: true,
            width: 100,
            dataIndex: 'imptotal',
            renderer: formatoMonedaABS,
            align: 'right'
        },
        {
            header: 'Importe liquidado',
            sortable: true,
            width: 100,
            dataIndex: 'impliquidado',
            renderer: formatoMonedaABS,
            align: 'right'
        },
        {
            header: 'Importe pendiente',
            sortable: true,
            width: 100,
            dataIndex: 'impliquidar',
            renderer: formatoMonedaABS,
            align: 'right'
        },
        {
            header: 'Cuenta contable',
            sortable: false,
            width: 100,
            dataIndex: 'idcuentacontable',
            align: 'left',
            renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                return record.get('ctacontable');
            },
            hidden: true
            // editor: cbcuentacontliqui
        },
        {
            header: 'A liquidar',
            sortable: true,
            width: 75,
            dataIndex: 'liquidarimp',
            align: 'right',
            renderer: formatoMonedaABS,
            editor: nfLiquidarImp
        }
    ]);
    /*************FILTROS PARA LOS DERECHOS U OBLI DE LA LIQUIDACION***********************************/

    tfnumero = new Ext.form.TextField({
        maskRe: /^[0-9]$/,
        disabledClass: 'disabled-component',
        anchor: '100%',
        maxLength: 10,
        maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 10 caracteres.'
    });
    /**********************************************************************************************/
    /**********************************************************************************************/
    // Combox "Tipo de Documento"
    stfiltrotipodoc = new Ext.data.Store({
        url: 'cargarTipoDocCobPago',
        reader: new Ext.data.JsonReader(
            {
                root: 'datos'
            },
            [
                {
                    name: 'iddoc'//,
                    //mapping: 'idtipodocumento'
                },
                /*{
                 name: 'diasvigencia'
                 },
                 {
                 name: 'importemin'
                 },
                 {
                 name: 'importemax'
                 },
                 {
                 name: 'tienetalonario'
                 },*/
                {
                    name: 'iddocumentos'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'codigo'
                },
                {
                    name: 'concepto'
                }
            ]),
        sortInfo: {
            field: 'denominacion',
            direction: 'ASC'
        }
    });
    cbfiltrotipodoc = new Ext.form.ComboBox({
        id: 'cbfiltrotipodoc',
        disabledClass: 'disabled-component',
        mode: 'local',
        emptyText: 'Seleccione...',
        editable: true,
        resizable: true,
        store: stfiltrotipodoc,
        valueField: 'iddoc',
        displayField: 'denominacion',
        forceSelection: true,
        /*maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        anchor: '100%',
        listWidth: 305,
        triggerAction: 'all',
        typeAhead: true,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbfiltrotipodoc').getValue() != 'Seleccione...' && Ext.getCmp('cbfiltrotipodoc').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbfiltrotipodoc'), Ext.getCmp('cbfiltrotipodoc').getRawValue());
                 });*/
            }
        }
    });
    /**********************************************************************************************/
    /**********************************************************************************************/

    tffechaInicio = new Ext.form.DateField({
        disabledClass: 'disabled-component',
        format: 'd/m/Y',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        selectOnFocus: true,
        readOnly: false,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Formato: dd/mm/aaaa',
        editable: true,
        anchor: '95%'
    });

    tffechaFin = new Ext.form.DateField({
        disabledClass: 'disabled-component',
        format: 'd/m/Y',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        selectOnFocus: true,
        readOnly: false,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Formato: dd/mm/aaaa',
        editable: true,
        anchor: '95%'
    });

    tffechaInicio.on({
        change: function (dateField, newValue, oldValue) {
            tffechaFin.setMinValue(newValue);
        }
    });

    tffechaFin.on({
        change: function (dateField, newValue, oldValue) {
            tffechaInicio.setMaxValue(newValue);
        }
    });

    var btBuscar = new Ext.Button({
        text: 'Buscar',
        tooltip: 'Buscar derecho',
        disabled: false,
        id: 'btBuscar',
//        icon: perfil.dirImg + 'buscar.png',
        iconCls: 'buscar',
        handler: function () {
            if ((tfnumero.getValue() || cbfiltrotipodoc.getValue() || tffechaInicio.getValue()) || tffechaFin.getValue() && tfnumero.isValid()) {
                if (tfnumero.getValue())
                    stliquidar.baseParams.numero = tfnumero.getValue();
                if (cbfiltrotipodoc.getValue())
                    stliquidar.baseParams.tipodoc = cbfiltrotipodoc.getValue();
                if (tffechaInicio.getValue())
                    stliquidar.baseParams.fechainicio = tffechaInicio.getRawValue();

                if (tffechaFin.getValue())
                    stliquidar.baseParams.fechafin = tffechaFin.getRawValue();

                arroperliquidacionaux = new Array();
                arroperliquidacion = new Array();
                arrtabliquidacion = new Array();
                valoresEnVentLiq = 0;
                sttabliquidar.removeAll();
                stliquidar.removeAll();
                stliquidaciones.removeAll();
                cbmovimientoliq.reset();
                cbcuentacontliqui.reset();
                tfsaldoliquidar.reset();
                tfimportetotalliq.setValue('0.00');
                pagadoOper();

                stliquidar.reload({
                    callback: function (records) {
                        stliquidar.baseParams.numero = '';
                        stliquidar.baseParams.tipodoc = '';
                        stliquidar.baseParams.testado = '';
                        stliquidar.baseParams.fecha = '';

                        if (records.length === 0) {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.');
                        }
                    }
                });
            } else if (!tfnumero.isValid()) {
                mostrarMensaje(1, 'Por favor verifique nuevamente que hay campos con valores incorrectos.');
            } else {
                mostrarMensaje(1, 'Debe especificar un par&aacute;metro de b&uacute;squeda.');
            }
        }
    });
    var btnLimpiarLiquidar = new Ext.Button({
        text: 'Limpiar',
        tooltip: 'Limpiar filtros(s)',
        disabled: false,
        id: 'btnLimpiarLiquidar',
        iconCls: 'limpiar',
        handler: function () {
            //Limpiar liquidaciones
            tfnumero.reset();
            cbfiltrotipodoc.reset();
            tffechaInicio.reset();
            tffechaFin.reset();

            arroperliquidacionaux = new Array();
            arroperliquidacion = new Array();
            arrtabliquidacion = new Array();
            valoresEnVentLiq = 0;
            sttabliquidar.removeAll();
            stliquidar.removeAll();
            stliquidaciones.removeAll();
            cbmovimientoliq.reset();
            cbcuentacontliqui.reset();
            tfsaldoliquidar.reset();
            tfimportetotalliq.setValue('0.00');
            pagadoOper();

            stliquidar.baseParams.numero = '';
            stliquidar.baseParams.tipodoc = '';
            stliquidar.baseParams.testado = '';
            stliquidar.baseParams.fecha = '';
            stliquidar.baseParams.fechainicio = '';
            stliquidar.baseParams.fechafin = '';
            // stliquidar.baseParams.start = 0;
            // stliquidar.baseParams.limit = ptGpLiq.pageSize;
            stliquidar.reload();
        }
    });
    var ptGpLiq;
    /* GridPanel Liquidar  */
    gpliquidar = new Ext.grid.EditorGridPanel({
        store: stliquidar,
        width: 840,
        id: 'gpliquidar',
        region: 'center',
        tbar: ['N&uacute;mero:', tfnumero, ' ', 'Tipo documento: ', cbfiltrotipodoc, ' ', 'Fecha inicio: ', tffechaInicio, ' ', 'Fecha fin: ', tffechaFin, ' ', '-', btBuscar, '-', btnLimpiarLiquidar],
        height: 295,
        autoScroll: true,
        frame: true,
        loadMask: true,
        cm: cm0,
        sm: smliquidar,
        autoExpandColumn: 'expandir',
        /*bbar: ptGpLiq = new Ext.Cont.PagingToolbar({
            pageSize: 20,
            clearFilter: false,
            autoHeight: true,
            store: stliquidar,
            displayInfo: true,
            listeners: {
                'beforechange': function () {

                },
                'change': function () {
                    console.log('yooo');
                    arroperliquidacionaux = new Array();
                    arroperliquidacion = new Array();
                    arrtabliquidacion = new Array();
                    valoresEnVentLiq = 0;
                    sttabliquidar.removeAll();
                    // stliquidar.removeAll();
                    // stliquidaciones.removeAll();
                    // cbmovimientoliq.reset();
                    // cbcuentacontliqui.reset();
                    tfsaldoliquidar.reset();
                    tfimportetotalliq.setValue('0.00');
                    pagadoOper();
                }
            }
        })*/
    });

    // gpliquidar.removeListener('rowmousedown');

    gpliquidar.getView().getRowClass = function (record, index, rowParams, store) {
        if (record.get('liquidarimp') && record.get('idcuentacontable'))
            return 'FilaVerde';
    };

    gpliquidar.on({
        beforeedit: function (obj) {
            if (obj.field == 'liquidarimp') {
                nfLiquidarImp.maxValue = obj.record.get('impliquidar');
                if (!obj.record.data.liquidarimp) {
                    obj.record.set('liquidarimp', parseFloat(obj.record.get('impliquidar')));
                    smliquidar.selectRow(obj.row, true);
                }
            }
        },
        afteredit: function (obj) {
            // if (obj.field == 'idcuentacontable') {
            //     var temp = stcuentacontliqui.getAt(stcuentacontliqui.find('idcuenta', obj.value));
            //     obj.record.set('ctacontable', temp.get('text'));
            // }
            if (obj.record.get('liquidarimp') > 0 && obj.record.get('idcuentacontable')) {
                btnLiquidarHandler([obj.record]);
            }
            if (obj.value == 0) {
                smliquidar.deselectRow(obj.row);
            }
        },
        render: function () {
            if (gpliquidar.hasListener('rowmousedown')) {
                gpliquidar.events['rowmousedown'].clearListeners();
            }
            // gpliquidar.on('rowmousedown', function (g, rowIndex, e) {
            //     var sm = g.getSelectionModel();
            //     if(e.button !== 0 || sm.isLocked()){
            //         return;
            //     };
            //     var view = g.getView();
            //     if(e.shiftKey && sm.last !== false){
            //         var last = sm.last;
            //         sm.selectRange(last, rowIndex, !e.ctrlKey);
            //         sm.last = last; // reset the last
            //         view.focusRow(rowIndex);
            //     }else{
            //         var isSelected = sm.isSelected(rowIndex);
            //         if(e.ctrlKey && isSelected){
            //             sm.deselectRow(rowIndex);
            //         }else if(!isSelected || sm.getCount() > 1){
            //             sm.selectRow(rowIndex, !e.ctrlKey || e.shiftKey);
            //             view.focusRow(rowIndex);
            //         }
            //     }
            // });
        }
    });
    /**************LIQUIDACIONES*************************************************/
//adicionar liquidacion
    var btnliquidar = new Ext.Button({
        disabled: false,
        id: 'btnliquidar',
//        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        text: 'Adicionar',
        tooltip: 'Adicionar liquidaci\xF3n',
        handler: function () {
            // btnLiquidarHandler();
        }
    });
    // Boton modificar liquidacion
    var btnmodificarliq = new Ext.Button({
        id: 'btnmodificarliq',
        text: 'Modificar',
        tooltip: 'Modificar liquidaci\xF3n',
//        icon: perfil.dirImg + 'modificar.png ',
        iconCls: 'modificar',
        disabled: true,
        handler: function () {
            addfilaliquidacion('Mod');
        }
    });
    //elimianr liquidacion
    var btneliminar = new Ext.Button({
        disabled: true,
        id: 'btneliminarliquidacion',
//        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        text: 'Eliminar',
        tooltip: 'Eliminar liquidaci\xF3n',
        handler: function () {
            delfilaliquidacion();
        }
    });

    //tf saldo a liquidar
    tfsaldoliquidar = new Ext.form.NumberField({
//fieldLabel: perfil.etiquetas.lbentidad,
        name: 'tfsaldoliquidar',
        disabledClass: 'disabled-component',
        id: 'tfsaldoliquidar',
        style: 'text-align:right;',
        disabled: false,
        allowBlank: false,
        enableKeyEvents: true,
        emptyText: '0.00',
        width: 155,
        maxLength: 19,
        maxLengthText: 'Solo admite n&uacute;meros enteros de hasta 16 d&iacute;gitos. Con 2 cifras decimales.',
        listeners: {
            blur: function (field) {
                field.setRawValue(saldo(field.getValue()));
                field.isValid();
            },
            keypress: function (tf, e) { // Para adicionar con el enter

                if (e.getKey() == 13) // Enter
                {
                    if (smliquidar.getSelections().length > 1 && cbcuentacontliqui.isValid() && tfsaldoliquidar.isValid()) {//si se selecciono mas de una fila y los campos cta contable e importe son validos
                        var arrayIds = new Array();
                        for (var i = 0; i < smliquidar.getSelections().length; i++)
                            if (smliquidar.getSelections()[i].data.liquidarimp == 0)
                                arrayIds.push(smliquidar.getSelections()[i].data.id);
                        if (arrayIds.length > 1)//si se selecciono mas de uno que no se ha liquidado
                            liquidarVariasFacturas(arrayIds);
                    } else
                        addfilaliquidacion('Add'); //se adiciona la unica fila
                    return;
                }

            }
        }
    });
    //stliquidaciones
    stliquidaciones = new Ext.data.Store({
        url: 'cargargridliquidar',
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'idcuentacontable'
            },
                {
                    name: 'ctacontable'
                },
                {
                    name: 'importe'
                }
            ])
    });
    //smliquidaciones
    smliquidaciones = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpliquidaciones').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpliquidaciones').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });
    //evento para que habilite el btn eliminar, modificar liquidacion
    smliquidaciones.on('rowselect', function (t, e) {
        Ext.getCmp('btnmodificarliq').enable(); //se habilita el btn modificar liq
        Ext.getCmp('btneliminarliquidacion').enable(); //se habilita el btn eliminar liq
        cargardatosmodfilaliquidacion()//cargar las liquid
    }, this);
    //evento para que deshabilite el btn eliminar, modificar liquidacion
    smliquidaciones.on('rowdeselect', function (t, e) {
        Ext.getCmp('btnmodificarliq').disable(); //se deshabilita el btn modificar liq
        Ext.getCmp('btneliminarliquidacion').disable(); //se deshabilita el btn eliminar liq
    }, this);
    /* GridPanel liquidaciones  */
    gpliquidaciones = new Ext.grid.GridPanel({
        store: stliquidaciones,
        height: 210,
        id: 'gpliquidaciones',
        title: 'Liquidaciones realizadas',
        region: 'south',
        autoScroll: true,
        autoExpandColumn: 'ctacontable',
        frame: true,
        loadMask: true,
        sm: smliquidaciones,
        columns: [
            {
                id: 'idcuentacontable',
                hidden: true,
                hideable: false,
                dataIndex: 'idcuentacontable'
            },
            {
                id: 'ctacontable',
                //header: perfil.etiquetas.lbformula,
                header: 'Cuenta contable',
                dataIndex: 'ctacontable'
            },
            {
                id: 'importe',
                //header: perfil.etiquetas.lbformula,
                width: 100,
                align: 'right',
                header: 'Importe',
                dataIndex: 'importe',
                renderer: formatoMonedaABS
            }
        ],
        tbar: ['Cuenta contable:', cbcuentacontliqui, ' ', 'Saldo a liquidar:', tfsaldoliquidar, btnliquidar, btnmodificarliq, btneliminar]
    });

    var lfVacioLiq = new Ext.form.Label({
        id: 'lfVacioLiq',
        text: '.',
        anchor: '100%',
        style: '<span style=color:transparent;border:none;>'
    });

    /* Panel2 Agrupador de  fecha, importe y moneda */
    var ppanelliq2 = new Ext.Panel({
        frame: true,
        height: 60,
        region: 'north',
        layout: 'column',
        labelAlign: 'top',
        items: [{
            layout: 'form',
            style: 'margin:0 0 0 5',
            labelAlign: 'top',
            columnWidth: .25,
            items: [cbmovimientoliq]
        }, {
            layout: 'form',
            style: 'margin:0 0 0 5',
            labelAlign: 'top',
            columnWidth: .2,
            items: [cbcuentacontliqui]
        }, {
            layout: 'form',
            style: 'margin:0 0 0 5',
            labelAlign: 'top',
            columnWidth: .1,
            items: [tffechaliq]
        }, {
            layout: 'form',
            style: 'margin:0 0 0 5',
            labelAlign: 'top',
            columnWidth: .1,
            items: [tfmonedaliq]
        }, {
            layout: 'form',
            style: 'margin:0 0 0 5',
            labelAlign: 'top',
            columnWidth: .15,
            items: [tfrestoliq]
        }, {
            layout: 'form',
            style: 'margin:0 0 0 5',
            labelAlign: 'top',
            columnWidth: .15,
            items: [tfimportetotalliq]
        },
            {
                layout: 'form',
                style: 'margin:0 0 0 5',
                labelAlign: 'top',
                columnWidth: .5,
                items: [lfVacioLiq]
            }]
    });
    /******************** ventana Liquidar  *************************/
    winliquidacion = new Ext.Window({
        autoValidate: false,
        constrain: true,
        layout: 'border',
        //width : 850,
        //height : 430,
        resizable: false,
        modal: true,
        closeAction: 'hide',
        items: [ppanelliq2, gpliquidar/*, gpliquidaciones*/],
        buttons: [{
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                if (acc != 'mod') {
                    if (sttabliquidar.getCount() > 0) {
                        //Utilizando el auxiliar de arroperliquidacion
                        for (var i = 0, long = arroperliquidacionaux.length; i < long; i++) {
                            var find = false;
                            var index = 0;
                            for (var j = 0, longj = arroperliquidacion.length; j < longj; j++) {
                                if (arroperliquidacion[j][0] == arroperliquidacionaux[i][0]) {
                                    find = true;
                                    index = j;
                                    break;
                                }
                            }
                            if (find) {
                                //Si lo encontro actualiza
//                                    arroperliquidacion[index] = arroperliquidacionaux[i];
                                arroperliquidacion[index] = arroperliquidacionaux[i].slice();
                            } else {
                                //si no lo encontro lo adiciona
                                arroperliquidacion.push(arroperliquidacionaux[i]);
                            }
                        }

//                            pagado();//Se llama en el evento hide de la ventana
                        winliquidacion.hide();
                    } else {
                        abrioperacion = false;
                        valoresEnVentLiq = 0;
//                            pagado();//Se llama en el evento hide de la ventana
                        winliquidacion.hide();
                        //fpliquidacion.getForm().reset();
                        habilitaroperacion(0);
                        sttabliquidar.removeAll(); // se limpia el grid info de las liquidaciones realizadas
                        stliquidar.removeAll(); // se limpia el grid de las operaciones a liquidar
                        stliquidaciones.removeAll(); //se limpia el grid de las liquidaciones
                        arroperliquidacion = new Array(); //se limpia el array de las liquidaciones
                        cbmovimientoliq.reset(); //se el combo operaciones
                        cbcuentacontliqui.reset(); //se limpia el combo cuenta contable
                        tfsaldoliquidar.reset(); //se limpia el campo saldo a liquidar
                        //se limpian los campos del filtro
                        tfnumero.reset();
                        cbfiltrotipodoc.reset();
                        tffechaInicio.reset();
                        tffechaFin.reset();
                    }
                } else {
//                        pagado();//Se llama en el evento hide de la ventana
                    winliquidacion.hide();
                }
            }
        }, {
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                //Utilizando el auxiliar de arroperliquidacion
                arroperliquidacionaux = arroperliquidacion.map(function (x) {
                    return x;
                });
//                    for (var i = 0, long = arroperliquidacion.length; i < long; i++) {
//                        arroperliquidacionaux.push(arroperliquidacion[i]);
                //                    }

                operaciondeliq = cbmovimientoliq.getValue();
                if (acc != 'mod') {

                    if (arroperliquidacion.length) {
                        //                    var band = true;
//                    if (arroperliquidacion.length <= 0)
//                        band = false;
//                    if (tfimportetotalliq.getValue() == '0.00') {
//                        tfimportetotalliq.markInvalid('El importe no puede ser 0.00.');
//                        band = false;
                        //                    }
                        //if (band) {
                        valoresEnVentLiq = 1;
                        //arrayreembolsar();
                        abrioperacion = true;
                        //                            pagado();//Se llama en el evento hide de la ventana
                        soloLectura = true;
                        habilitaroperacion(1);
                        actualizaInfoTabLiquidaciones();
                        winliquidacion.hide();
                        //}
                        //else
                        //mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                    } else {
                        var msg = (cbtipoOpInstr.getValue() == 1) ? 'Debe adicionar al menos una liquidaci&oacute;n de cobro.' : 'Debe adicionar al menos una liquidaci&oacute;n de pago.';
                        mostrarMensaje(1, msg);
                    }
                } else {
                    actualizaInfoTabLiquidaciones();
                    //                        pagado();//Se llama en el evento hide de la ventana
                    winliquidacion.hide();
                }
            }
        }],
        listeners: {
            show: function (tf, e) {
                if (valoresEnVentLiq) {
                    stliquidar.fireEvent('datachanged');
                }
            },
            hide: function () {
                pagado();
            }
        }
    });
    /*******************************************************************************/
    /////////////////// FORMULARIO PAGO ANTICIPADO //////////////////////////////
    /*******************************************************************************/
    /* campo de texto nro de contrato */
    tfnocontrato = new Ext.form.TextField({
        fieldLabel: 'No. contrato',
        id: 'tfnocontrato',
        allowBlank: false,
        disabledClass: 'disabled-component',
        enableKeyEvents: true,
        anchor: '100%',
        value: 'S/N',
        maxLength: 10,
        maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 10 caracteres.',
        maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
        regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
        listeners: {
            keypress: function (tf, e) { // Para dejar solo 2 decimales
                if (e.getKey() == 13) {//para que adicione con el enter
                    addfilaanticipos('Add');
                    //se le da el foco al campo comentario
                    tacomentariopa.focus(false, 10);
                }
            },
            /*invalid: function(cmp, msg) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            },*/
            blur: function (cmp) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                } else {
                    cmp.setValue('S/N');
                }
            },
            keyup: function () {
                activateAddCPAnticipado('cpa');
            }
        }
    });
    /* campo de texto moneda */
    tfmoneda = new Ext.form.TextField({
        fieldLabel: 'Moneda', //perfil.etiquetas.lbtfmoneda,
        readOnly: true,
        id: 'tfmoneda',
        disabled: true,
        disabledClass: 'disabled-component',
        allowBlank: false,
        anchor: '100%'
    });
    //  Campos "Resto" este campo es el  mismo que el campo resto  de la ventana crear instrumento
    tfrestopaa = new Ext.form.TextField({
        fieldLabel: 'Resto', //perfil.etiquetas.lbtfresto,
        disabled: true,
        id: 'tfrestopaa',
        style: 'text-align:right;',
        disabledClass: 'disabled-component',
        editable: false,
        readOnly: true,
        anchor: '100%'
    });
    /* Campo de texto importe total de los anticipos*/
    tfimportetotalant = new Ext.form.TextField({
        fieldLabel: 'Importe total',
        readOnly: true,
        disabled: true,
        style: 'text-align:right',
        disabledClass: 'disabled-component',
        id: 'tfimportetotalant',
        allowBlank: false,
        anchor: '100%'
    });
    /*  text area  comentario*/
    tacomentariopa = new Ext.form.TextArea({
        fieldLabel: 'Comentario',
        disabled: false,
        id: 'tacomentariopa',
        maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
        regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
        regexText: 'Este campo solo permite letras y n&uacute;meros.',
        maxLength: 255,
        maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 255 caracteres.',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        anchor: '100%',
        enableKeyEvents: true,
        listeners: {
            change: function (cbx, newValue, oldValue) {
                if (newValue != oldValue)
                    cambio = true;
            },
            keypress: function (tf, event) {
                /* if (acc == 'mod')
                 e.stopEvent();
                 else*/ //duda
                if (event.getKey() == event.ENTER) {
                    addfilaanticipos('Add')
                }
//event.stopEvent();  // Para que no escriba ENTER
            },
            blur: function (cmp) {
                tacomentariopa.setValue(limpiarEspacios(tacomentariopa.getValue()));
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            },
            invalid: function (cmp, msg) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            },
            keyup: function () {
                activateAddCPAnticipado('cpa');
            }
        }
    });
    /*   Store de Combox Movimiento (operaciones) */
    stmovimientopa = new Ext.data.Store({
        url: 'cargarmovimientos',
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad',
            id: 'idoperacion'
        }, [
            {
                name: 'idoperacion',
                type: 'string'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'idnomoperaciones',
                type: 'string'
            },
            {
                name: 'idcuenta',
                type: 'string'
            },
            {
                name: 'signo'
            }
        ]),
        sortInfo: {
            field: 'denominacion',
            direction: 'ASC'
        },
        listeners: {
            beforeload: function (s, options) {
                stmovimientopa.clearFilter(true);
                stmovimientopa.removeAll();
            }
        }
// DESC
    });
    /*   Combox Movimiento (Operaciones) Pagos anticipados */
    cbmovimientopaa = new Ext.form.ComboBox({
        fieldLabel: 'Operaci\xF3n',
        disabledClass: 'disabled-component',
        id: 'cbmovimientopaa',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>', // Paramostrar los datos como detalle
        mode: 'local',
        emptyText: 'Seleccione...',
        editable: true,
        store: stmovimientopa, // lo toma del store de liquidacion, solo cambia en el momento que se manda a cargar
        valueField: 'idoperacion',
        displayField: 'denominacion',
        hiddenName: 'idoperacion',
        forceSelection: true,
        anchor: '100%',
        triggerAction: 'all',
        enableKeyEvents: true,
        typeAhead: true,
        /* maskRe : /^([0-9a-zA-Z \(\)\-\+\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \(\)\-\+\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        allowBlank: false,
        resizable: true,
        listeners: {
            change: function (cbx, newValue, oldValue) {
                if (newValue != oldValue)
                    cambio = true;
            },
            keypress: function (t, e) {
                if (/*(e.getKey() == 8) ||*/ (e.getKey() == 46)) {
                    cbmovimientopaa.clearValue();
                }
            },
            select: function (combo, record, index) {
                activateAddCPAnticipado('cpa');

//                MostrarEtiquetas(Ext.getBody(), 'Cargando cuentas...');
                habilitarcomentario(); //se habilita y limpia el comentario
                //buscarcuentaoperacion(cbmovimientopaa.getValue(), 'pa', {});
                //se le da el foco al combo de la cta contable
                cbcuentadebitarpa.focus(false, 10);
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbmovimientopaa').getValue() != 'Seleccione...' && Ext.getCmp('cbmovimientopaa').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbmovimientopaa'), Ext.getCmp('cbmovimientopaa').getRawValue());
                 });*/
            }

        }
    });
    /* Campo de texto importe en letras  anticipo*/
    tfimporteletraspa = new Ext.form.TextField({
        fieldLabel: 'Importe en letras', //perfil.etiquetas.lbtfimpletrasoper,
        id: 'tfimporteletraspa',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        disabledClass: 'disabled-component',
        readOnly: true,
        disabled: true,
        anchor: '100%'
    });
    /* Campo de texto importe anticipo */
    tfimportepa = new Ext.form.TextField({
        fieldLabel: 'Importe', //perfil.etiquetas.lbtfimporteoper,
        id: 'tfimportepa',
        style: 'text-align:right;',
        disabledClass: 'disabled-component',
        allowNegative: true,
        allowDecimals: true,
        selectOnFocus: true,
        maskRe: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        regex: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        regexText: 'Este campo solo permite n&uacute;meros.',
        maxLength: 16,
        maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 16 caracteres.',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        enableKeyEvents: true,
        anchor: '100%',
        listeners: {
            keyup: function (tf, e) {
                activateAddCPAnticipado('cpa');

                if (tf.isValid())
                    tfimporteletraspa.setValue(convertir_a_letras(tfimportepa.getValue()));
                else
                    tfimporteletraspa.setValue('');
            },
            blur: function (tf) {
                if (tf.isValid())
                    tfimportepa.setRawValue(saldo(tfimportepa.getValue()));
                else
                    tfimporteletraspa.setValue('');
            },
            keypress: function (tf, e) { // Para dejar solo 2 decimales
                // if (acc == 'mod')
                //  e.stopEvent();
                if (e.getKey() == 13) {//para que adicione con el enter
                    addfilaanticipos('Add');
                    //se le da el foco al campo importe
                    tfnocontrato.focus(false, 10);
                }
            }
        }
    });
    // Combox cuenta debitar--anticipo
    stcuentadebitarpa = new Ext.data.Store({
        url: 'cargarctascontables',
        reader: new Ext.data.JsonReader({
            id: 'rdcuentadebcontpa'
        }, [{
            name: 'idcuenta'
        },
            {
                name: 'text'
            }
        ])
    });
    //combo cuenta debitar --anticipo
    cbcuentadebitarpa = new Ext.form.ComboBox({
        tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>', // Paramostrar los datos como detalle
        id: 'cbcuentadebitarpa',
        disabledClass: 'disabled-component',
        //emptyText: 'Seleccione..',
        valueField: 'idcuenta',
        displayField: 'text',
        fieldLabel: 'Cuenta de banco',
        store: stcuentadebitarpa,
        typeAhead: true,
        resizable: true,
        triggerAction: 'all',
        mode: 'local',
        selectOnFocus: true,
        anchor: '100%',
        editable: true,
        allowBlank: false,
        enableKeyEvents: true,
        disabled: false,
        //listWidth: 400,
        listeners: {
            select: function () {
                activateAddCPAnticipado('cpa');

                //se le da el foco al campo importe
                tfimportepa.focus(false, 10);
                //tfimporteoper.reset();
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbcuentadebitarpa').getValue() != 'Seleccione...' && Ext.getCmp('cbcuentadebitarpa').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbcuentadebitarpa'), Ext.getCmp('cbcuentadebitarpa').getRawValue());
                 });*/
            }
        }
    });

    //Combo para cargar las cuentas de contrapartida para cobor o pago anticipado
    stcuentaacreditarpa = new Ext.data.Store({
        url: 'cargarcuentascontablescpaa',
        reader: new Ext.data.JsonReader({
            id: 'idcuenta'
        }, [{
            name: 'idcuenta'
        },
            {
                name: 'text'
            }
        ])
    });

    cbcuentaacreditarpa = new Ext.form.ComboBox({
        tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>', // Paramostrar los datos como detalle
        id: 'cbcuentaacreditarpa',
        disabledClass: 'disabled-component',
        emptyText: 'Seleccione..',
        valueField: 'idcuenta',
        displayField: 'text',
        fieldLabel: 'Cuenta contrapartida',
        store: stcuentaacreditarpa,
        typeAhead: true,
        resizable: true,
        triggerAction: 'all',
        mode: 'local',
        selectOnFocus: true,
        anchor: '100%',
        editable: false,
        allowBlank: false,
        enableKeyEvents: true,
        disabled: false
        //listWidth: 400,
    });

    /*******************formulario pago anticipado********** */
    fppagoanticipado = new Ext.FormPanel({
        frame: true,
        id: 'fppagoanticipado',
        region: 'north',
        height: 240,
        layout: 'fit',
        items: [{
            labelAlign: 'top',
            autoHeight: true,
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .52,
                items: [cbmovimientopaa]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .08,
                items: [tfmoneda]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .2,
                items: [tfrestopaa]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .2,
                items: [tfimportetotalant]
            }]
        }, {
            labelAlign: 'top',
            autoHeight: true,
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .5,
                items: [cbcuentadebitarpa]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .5,
                items: [cbcuentaacreditarpa]
            }]
        }, {
            labelAlign: 'top',
            autoHeight: true,
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .22,
                items: [tfimportepa]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .63,
                items: [tfimporteletraspa]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .15,
                items: [tfnocontrato]
            }]
        }, {
            labelAlign: 'top',
            style: 'margin:0 0 0 5',
            autoHeight: true,
            layout: 'form',
            items: [tacomentariopa]
        }]
    });
    // Boton adicionar anticipo
    var btnadicionaranticipo = new Ext.Button({
        id: 'btnadicionaranticipo',
        text: 'Adicionar',
        tooltip: 'Adicionar anticipo',
//        icon: perfil.dirImg + 'adicionar.png ',
        iconCls: 'adicionar',
        handler: function () {
            addfilaanticipos('Add');
        }
    });
    // Boton modificar anticipo
    var btnmodificaranticipo = new Ext.Button({
        id: 'btnmodificaranticipo',
        text: 'Modificar',
        tooltip: 'Modificar anticipo',
//        icon: perfil.dirImg + 'modificar.png ',
        iconCls: 'modificar',
        disabled: true,
        handler: function () {
            addfilaanticipos('Mod');
        }
    });
    // Boton eliminar anticipo
    var btneliminaranticipo = new Ext.Button({
        id: 'btneliminaranticipo',
        text: 'Eliminar',
        tooltip: 'Eliminar anticipo',
//        icon: perfil.dirImg + 'eliminar.png ',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            delfilaanticipos();
        }
    });
    //store del grid anticipo
    stgridanticipo = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad'
        }, [{
            name: 'nocontrato'
        }, {
            name: 'idctacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'comentario'
        }, {
            name: 'importe'
        }, {
            name: 'idoperacionpa'
        }, {
            name: 'descoperacionpa'
        }, {
            name: 'idctaoperacionpa'
        }, {
            name: 'idctacontrapartida'
        }, {
            name: 'nombrectacontrapartida'
        }
        ])
    });
    //sm del grid anticipo
    smgridanticipo = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpanticipo').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpanticipo').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });
    //evento al seleccionar una fila
    smgridanticipo.on('rowselect', function (t, e) {
        btnmodificaranticipo.enable(); //se habilita el bt modificar
        btneliminaranticipo.enable(); //se habilita el btn eliminar
        cargardatosmodfilaanticipos(); //se cargan los datos del anticipo a modificar
    }, this);
    //evento al deseleccionar una fila
    smgridanticipo.on('rowdeselect', function (t, e) {
        btnmodificaranticipo.disable(); //se deshabilita el bt modificar
        btneliminaranticipo.disable(); //se deshabilita el btn eliminar
    }, this);
    /* GridPanel anticipo  */
    gpanticipo = new Ext.grid.GridPanel({
        store: stgridanticipo,
        region: 'center',
        id: 'gpanticipo',
        autoScroll: true,
        autoExpandColumn: 'comentario',
        frame: true,
        sm: smgridanticipo,
        tbar: [btnadicionaranticipo, btnmodificaranticipo, btneliminaranticipo],
        columns: [
            {
                id: 'nocontrato',
                width: 120,
                header: 'No. contrato',
                dataIndex: 'nocontrato'
            }, {
                id: 'idctacontable',
                hidden: true,
                hideable: false,
                dataIndex: 'idctacontable'
            }, {
                id: 'ctadebitar',
                width: 240,
                header: 'Cuenta de banco',
                dataIndex: 'ctacontable'
            }, {
                id: 'contrapartida',
                width: 240,
                header: 'Cuenta contrapartida',
                dataIndex: 'nombrectacontrapartida'
            }, {
                id: 'descoperacionpa',
                width: 240,
                header: 'Operaci\xF3n',
                dataIndex: 'descoperacionpa'
            }, {
                id: 'comentario',
                header: 'Comentario',
                dataIndex: 'comentario'
            }, {
                id: 'importe',
                width: 140,
                header: 'Importe',
                align: 'right',
                renderer: formatoMonedaABS,
                dataIndex: 'importe'
            }, {
                id: 'idoperacionpa',
                hidden: true,
                hideable: false,
                header: 'idoper',
                dataIndex: 'idoperacionpa'
            }, {
                id: 'idctaoperacionpa',
                hidden: true,
                hideable: false,
                header: 'idctaoper',
                dataIndex: 'idctaoperacionpa'
            }]
    });
    /* ventana Pago Anticipado  */
    winpanticipado = new Ext.Window({
        autoValidate: false,
        constrain: true,
        layout: 'border',
        resizable: false,
        modal: true,
        closeAction: 'hide',
        items: [fppagoanticipado, gpanticipo],
        buttons: [{
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar', //perfil.etiquetas.lbBtnCancelar,
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                abrioperacion = false;

                if (sttabanticipo.getCount() > 0) {
                    valoresEnVentPa = 1;
                } else {
                    valoresEnVentPa = 0;
                }

                pagado();
                if (acc != 'mod') {
                    // fppagoanticipado.getForm().reset();
                    habilitaroperacion(0);
                    //pagado();
                }
                winpanticipado.hide();
                cargargridPanticipado();
            }
        }, {
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: 'Aceptar', //perfil.etiquetas.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                if (stgridanticipo.getCount() && acc != 'mod') {
                    //                    var band = true;
//                    if (!arroanticipoinst.length > 0)
//                        band = false;
//                    if (band) {
                    valoresEnVentPa = 1;
                    //arrayreembolsar();
                    abrioperacion = true;
                    soloLectura = true;

                    habilitaroperacion(1);

                    arroanticipoinst = creaDataAnticipos(stgridanticipo.data);//se actualiza el array con los datos del grid
                    pagado();
                    actualizaInfoTabAnticipos();
                    winpanticipado.hide();
//                    }
                } else if (acc == 'mod') {
                    //                    var band = true;
//                    if (!arroanticipoinst.length > 0)
//                        band = false;
//                    if (band) {
                    valoresEnVentPa = 1;
                    //arrayreembolsar();
                    abrioperacion = true;
                    soloLectura = true;

                    arroanticipoinst = creaDataAnticipos(stgridanticipo.data);//se actualiza el array con los datos del grid
                    pagado();
                    actualizaInfoTabAnticipos();
                    winpanticipado.hide();
//                    }
                } else {
                    var msg = (cbtipoOpInstr.getValue() == 1) ? 'Debe adicionar al menos un cobro anticipado.' : 'Debe adicionar al menos un pago anticipado.';
                    mostrarMensaje(1, msg);
                }
            }
        }]
    });
    /*******************************************************************************/
    //////////////////////////// FORMULARIO REEMBOLSO //////////////////////////////
    /*******************************************************************************/

    /*   Campo de texto importe */
    tfimporterev = new Ext.form.TextField({
        fieldLabel: 'Importe', //perfil.etiquetas.lbtfimporterev,
        //disabled : false,
        disabledClass: 'disabled-component',
        value: '0.00',
        //allowNegative : false,
        //allowDecimals : true,
        style: 'text-align:right;',
        id: 'tfimporterev',
        readOnly: true,
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        anchor: '100%',
        listeners: {
            blur: function () {
                tfimporterev.setRawValue(saldo(tfimporterev.getValue()));
            }
        }
    });
    /*   Campo de texto moneda */
    tfmonedarev = new Ext.form.TextField({
        fieldLabel: 'Moneda', //perfil.etiquetas.lbtfmonedarev,
        disabled: true,
        disabledClass: 'disabled-component',
        id: 'tfmonedaprov',
        readOnly: true,
        allowBlank: false,
        anchor: '100%'
    });
    /*   Store del combox caja  */
    stcaja = new Ext.data.Store({
        url: 'cargarcajas',
        sortInfo: {
            field: 'nombre',
            direction: 'ASC'
        }, // DESC
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idcaja',
                type: 'string'
            },
            {
                name: 'nombre'
            }
        ])
    });
    /*   Store del combox fondo  */
    stfondo = new Ext.data.Store({
        url: 'cargarfondos',
        sortInfo: {
            field: 'nombre',
            direction: 'ASC'
        }, // DESC
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idfondo',
                type: 'string'
            },
            {
                name: 'nombre'
            }
        ])
    });
    /*   evento del combox operaciones */
    // cbmovimientorev.on('select', BuscarValoresReembolso);


    /*   Store del combox cajero   */
    stcajero = new Ext.data.Store({
        url: 'cargarcomboCajero',
        sortInfo: {
            field: 'nombre',
            direction: 'ASC'
        }, // DESC
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idcajero',
                type: 'string'
            },
            {
                name: 'nombre'
            }
        ])
    });
    /*   Comox de cajas */
    cbxfcajarev = new Ext.form.ComboBox({
        fieldLabel: 'Caja', //perfil.etiquetas.lbtfcaja,
        id: 'cbxfcajarev',
        disabledClass: 'disabled-component',
        mode: 'local',
        tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        emptyText: 'Seleccione...',
        readOnly: true,
        editable: false,
        store: stcaja,
        valueField: 'idcaja',
        displayField: 'nombre',
        hiddenName: 'idcaja',
        forceSelection: true,
        disabled: true,
        anchor: '100%',
        allowBlank: false,
        triggerAction: 'all',
        enableKeyEvents: true,
        typeAhead: true,
        listeners: {
            select: function (combo, record, index) {
// Reiniciar componentes que dependen de el..
                tffondorev.reset();
                tfimporterev.setValue('0.00');
                cbcajero.reset();
                streembolso.removeAll();
                MostrarEtiquetas(Ext.getBody(), 'Cargando cajeros...'); // Mostrar mensaje de espera
                stcajero.load({
                    params: {
                        idcaja: cbxfcajarev.getValue()
                    },
                    callback: function (r, options, success) {
                        if (stcajero.getCount() > 0) {
                            cbcajero.reset();
                            cbcajero.enable();
                            MostrarEtiquetas(Ext.getBody(), 'Cargando fondos...'); // Mostrar mensaje de espera
                            stfondo.load({
                                params: {
                                    idcaja: cbxfcajarev.getValue(),
                                    idmoneda: stmonedatasa.getAt(0).get('idmoneda')
                                },
                                callback: function (r, options, success) {
                                    if (stfondo.getCount() > 0) {
                                        tffondorev.enable();
                                    } else {
                                        mostrarMensaje(1, 'No se encontraron fondos asociados a la caja seleccionada. Debe seleccionar otra caja.');
                                        cbxfcajarev.focus(true, true); // Darle el focus para q seleccione otra caja
                                        winreembolso.hide();
                                    }
                                    lMasktemp.hide();
                                }
                            });
                        } else {
                            mostrarMensaje(1, 'No se encontraron cajeros asociados a la caja seleccionada.');
                            cbxfcajarev.focus(true, true);
                            lMasktemp.hide();
                            winreembolso.hide();
                        }
                    }
                });
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbxfcajarev').getValue() != 'Seleccione...' && Ext.getCmp('cbxfcajarev').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbxfcajarev'), Ext.getCmp('cbxfcajarev').getRawValue());
                 });*/
            }
        }
    });
    /*   combox Cajeros Bancarios   */
    cbcajero = new Ext.form.ComboBox({
        fieldLabel: 'Cajero', //perfil.etiquetas.lbcbCajero,
        disabledClass: 'disabled-component',
        id: 'cbcajero',
        mode: 'local',
        tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        emptyText: 'Seleccione...', //perfil.etiquetas.lbtfSeleccione,
        //readOnly : true,
        editable: true,
        store: stcajero,
        valueField: 'idcajero',
        displayField: 'nombre',
        hiddenName: 'idcajero',
        forceSelection: true,
        disabled: true,
        anchor: '100%',
        /*maskRe : /^([0-9a-zA-Z \-\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \-\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        allowBlank: false,
        triggerAction: 'all',
        enableKeyEvents: true,
        typeAhead: true,
        listeners: {
            select: function (combo, record, index) {
                if (cbxfcajarev.getValue() && cbcajero.getValue() && tffondorev.getValue() && cbmovimientorev.getValue())
                    BuscarValoresReembolso();
                /*   evento del combox cajero */
            },
            keypress: function (t, e) {
                if (/*(e.getKey() == 8) ||*/ (e.getKey() == 46)) {
                    cbcajero.clearValue();
                }
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbcajero').getValue() != 'Seleccione...' && Ext.getCmp('cbcajero').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbcajero'), Ext.getCmp('cbcajero').getRawValue());
                 });*/
            }
        }
    });
    /*   CoboBox de fondos */
    tffondorev = new Ext.form.ComboBox({
        fieldLabel: 'Fondo', //perfil.etiquetas.lbtffondo,
        disabledClass: 'disabled-component',
        id: 'tffondorev',
        mode: 'local',
        tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        emptyText: 'Seleccione...',
        readOnly: true,
        editable: false,
        store: stfondo,
        valueField: 'idfondo',
        displayField: 'nombre',
        hiddenName: 'idfondo',
        forceSelection: true,
        disabled: false,
        anchor: '100%',
        allowBlank: false,
        triggerAction: 'all',
        enableKeyEvents: true,
        typeAhead: true,
        listeners: {
            select: function (combo, record, index) {
                if (cbxfcajarev.getValue() && cbcajero.getValue() && tffondorev.getValue() && cbmovimientorev.getValue())
                    BuscarValoresReembolso();
                /*   evento del combox cajero */
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('tffondorev').getValue() != 'Seleccione...' && Ext.getCmp('tffondorev').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('tffondorev'), Ext.getCmp('tffondorev').getRawValue());
                 });*/
            }
        }
    });
    /*   Combox Movimiento (Operaciones) Reembolsos */
    cbmovimientorev = new Ext.form.ComboBox({
        fieldLabel: 'Operaci\xF3n', //perfil.etiquetas.lbcbMovimiento,
        disabledClass: 'disabled-component',
        id: 'cbmovimientorev',
        mode: 'local',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        emptyText: 'Seleccione...', //perfil.etiquetas.lbtfSeleccione,
        editable: true,
        store: stmovimientoliq, // lo toma del store de liquidacion, solo cambia en el momento que se manda a cargar
        valueField: 'idoperacion',
        displayField: 'denominacion',
        hiddenName: 'idoperacion',
        forceSelection: true,
        anchor: '100%',
        triggerAction: 'all',
        /*maskRe : /^([0-9a-zA-Z \(\)\-\+\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \(\)\-\+\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        allowBlank: false,
        enableKeyEvents: true,
        typeAhead: true,
        listeners: {
            select: function (combo, record, index) {
                if (cbxfcajarev.getValue() && cbcajero.getValue() && tffondorev.getValue() && cbmovimientorev.getValue())
                    BuscarValoresReembolso();
                /*   evento del combox operaciones */
            },
            keypress: function (t, e) {
                if (/*(e.getKey() == 8) ||*/ (e.getKey() == 46)) {
                    cbmovimientorev.clearValue();
                }
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbmovimientorev').getValue() != 'Seleccione...' && Ext.getCmp('cbmovimientorev').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbmovimientorev'), Ext.getCmp('cbmovimientorev').getRawValue());
                 });*/
            }
        }

    });
    /*   evento del combox cajero */
    //cbcajero.on('select', BuscarValoresReembolso);

    /* reader del grid Reembolso */
    rdreembolso = new Ext.data.JsonReader({
        root: 'datos',
        totalProperty: 'cantidad'
    }, [
        {
            name: 'idsolicitudr',
            type: 'string'
        }, // Id de la solicitud de reembolso = idmovimiento
        {
            name: 'iddocumento',
            type: 'string'
        },
        {
            name: 'numero'
        },
        {
            name: 'fecha',
            mapping: 'fecha',
            type: 'date'
        },
        {
            name: 'importe',
            type: 'float'
        },
        {
            name: 'comentario',
            type: 'string'
        },
        {
            name: 'idestadodoccomunfinanzas',
            type: 'string'
        },
        {
            name: 'estado',
            type: 'string'
        }
    ]);
    /* Modo seleccion para seleccionar en el grid Reembolso */
    smreembolsar = new Ext.grid.CheckboxSelectionModel({
        moveEditorOnEnter: true,
        sortable: false,
        listeners: {
            selectionchange: function () {
                sumarimportereembolsar();
            }
        }
    });
    var cmgrid = new Ext.grid.ColumnModel([
        {
            sortable: false,
            hidden: true,
            dataIndex: 'idsolicitudr',
            header: 'idsolicitud',
            resizable: false,
            hideable: false
        },
        smreembolsar,
        {
            header: 'N&uacute;mero'/*perfil.etiquetas.lbGpRem1*/,
            width: 90,
            sortable: true,
            dataIndex: 'numero',
            hideable: true
        },
        //{header : perfil.etiquetas.lbGpRem2, width: 100, sortable: true, dataIndex : 'fecha', renderer: Ext.util.Format.dateRenderer('d/m/Y')},
        {
            header: 'Estado',
            width: 80,
            sortable: true,
            dataIndex: 'estado',
            hideable: true
        },
        {
            header: 'Comentario',
            width: 200,
            sortable: true,
            dataIndex: 'comentario',
            hideable: true
        },
        {
            header: 'Importe',
            width: 100,
            sortable: true,
            dataIndex: 'importe',
            renderer: formatoMonedaABS,
            align: 'right',
            hideable: true
        }
// {hidden:true, sortable: false, dataIndex : 'idcajero',  hideable: false},
// {hidden:true, sortable: false, dataIndex : 'idfondo', hideable: false },
//{name : 'fecha', type: 'date', dateFormat: 'd/m/Y'},
    ]);
    /*  Store del grid Reembolso  */
    streembolso = new Ext.data.Store({
        url: 'buscardatosreembolso',
        reader: rdreembolso,
        listeners: {
            beforeload: function (s, options) {
                streembolso.removeAll();
                streembolso.clearFilter(true);
                if (cbcajero.getValue() && tffondorev.getValue() && cbxfcajarev.getValue() && cbmovimientorev.getValue() && stmonedatasa.getCount()) {
                    streembolso.baseParams.idcajero = cbcajero.getValue();
                    streembolso.baseParams.idfondo = tffondorev.getValue();
                    streembolso.baseParams.idcaja = cbxfcajarev.getValue();
                    streembolso.baseParams.idtipomov = cbmovimientorev.getValue();
                    streembolso.baseParams.idmoneda = stmonedatasa.getAt(0).get('idmoneda');
                } else
                    return false;
            }
        }
    });
    /*   Grid de Reembolso  */
    gpreembolso = new Ext.grid.GridPanel({
        store: streembolso,
        region: 'center',
        iconCls: 'icon-grid',
        //autoExpandColumn : 'comentario',
        loadMask: true,
        autoScroll: true,
        frame: true,
        width: 650,
        height: 261,
        cm: cmgrid,
        sm: smreembolsar,
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: streembolso,
            displayInfo: true,
            displayMsg: 'Resultados de {0} - {1} de {2}',
            emptyMsg: "Ning&uacute;n resultado para mostrar."
        })
    });
    //gpreembolso.on('rowdblclick', RowClickReembolso);

    /* Panel1 Agrupador del combox cajero */
    var ppanelrev1 = new Ext.Panel({
        frame: false,
        layout: 'fit',
        items: [{
            items: [{
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .50,
                    items: [cbxfcajarev]
                }, {
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .50,
                    items: [tffondorev]
                }]
            }]
        }]
    });
    /* Panel2 Agrupador del combox caja, moneda, fondo e importe */
    var ppanelrev2 = new Ext.Panel({
        frame: false,
        layout: 'fit',
        items: [{
            items: [{
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .50,
                    items: [cbcajero, tfmonedarev]
                }, {
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .50,
                    items: [cbmovimientorev, tfimporterev]
                }]
            }]
        }]
    });
    /* Panel2 Agrupador del grid Reembolso */
    var ppanelrev3 = new Ext.Panel({
        frame: false,
        layout: 'fit',
        items: [gpreembolso]
    });
    /* Panel Agrupador general del todos los paneles (formulario Reembolso) */
    fpreembolso = new Ext.FormPanel({
        frame: true,
        id: 'fpreembolso',
        region: 'center',
        autoHeight: true,
        items: [ppanelrev1, ppanelrev2, ppanelrev3]
    });
    /******************** ventana Reembolso  *************************/
    winreembolso = new Ext.Window({
        autoValidate: false,
        constrain: true,
        //title : titulo,
        layout: 'fit',
        width: 525,
        height: 520,
        resizable: false,
        modal: true,
        closeAction: 'hide',
        items: fpreembolso,
        buttons: [{
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar', //perfil.etiquetas.lbBtnCancelar,
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                if (acc != 'mod') {
                    abrioperacion = false;
                    valoresEnVentRe = 0;
                    pagado();
                    winreembolso.hide();
                    fpreembolso.getForm().reset();
                    tfmonedarev.reset();
                    tfimporterev.reset();
                    streembolso.removeAll();
                    //stmovimientore.removeAll();
                    stfondo.removeAll();
                    stcajero.removeAll();
                    stcaja.removeAll();
                    habilitaroperacion(0);
                } else
                    winreembolso.hide();
            }
        }, {
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: 'Aceptar', //perfil.etiquetas.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                if (acc != 'mod') {
                    var band = true;
                    if (!fpreembolso.getForm().isValid())
                        band = false;
                    if (tfimporterev.getValue() == '0.00') {
                        tfimporterev.markInvalid('El importe no puede ser 0.00.');
                        band = false;
                    }
                    if (band) {
                        valoresEnVentRe = 1;
                        arrayreembolsar();
                        abrioperacion = true;
                        pagado();
                        soloLectura = true;
                        habilitaroperacion(1);
                        winreembolso.hide();
                    } else
                        mostrarMensaje(1, 'Por favor verifique nuevamente que hay campos con valores incorrectos.');
                } else
                    winreembolso.hide();
            }
        }]
    });
    /*******************************************************************************/
    ///////////////////////// FORMULARIO OPERACIONES //////////////////////////////
    /*******************************************************************************/
    // Boton adicionar operaciones
    var btnadicionaroper = new Ext.Button({
        id: 'btnadicionaroper',
        text: 'Adicionar',
        tooltip: 'Adicionar operaciones',
//        icon: perfil.dirImg + 'adicionar.png ',
        iconCls: 'adicionar',
        handler: function () {
            addfilaoperaciones('Add');
        }
    });
    // Boton modificar operaciones
    var btnmodificaroper = new Ext.Button({
        id: 'btnmodificaroper',
        text: 'Modificar',
        tooltip: 'Modificar operaciones',
//        icon: perfil.dirImg + 'modificar.png ',
        iconCls: 'modificar',
        disabled: true,
        handler: function () {
            addfilaoperaciones('Mod');
        }
    });
    // Boton eliminar operaciones
    var btneliminaroper = new Ext.Button({
        id: 'btneliminaroper',
        text: 'Eliminar',
        tooltip: 'Eliminar operaciones',
//        icon: perfil.dirImg + 'eliminar.png ',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            delfilaoperaciones();
        }
    });

    var btnImportar = new Ext.Button({
        id: 'btnImportarEnzona',
        text:'Importar',
        tooltip: 'Importar tarjetas prepagadas de combustible',
        hidden: true,
        iconCls: 'importar'
    });

    btnImportar.on({
        click: function () {
            //self.map.disable();
            // var winImportCmp = new SCFPrintData(new Object(), "/contabilidad/comun/SCFPrintView/", {
            //     reportType: "DISTRA_OPERACIONES_ENZONA",
            //     typeAction: 'import'
            // });
            // winImportCmp.show();
            // winImportCmp.doLayout();
            // winImportCmp.on({
            //     'show': function() {
            //         // self.map.disable();
            //     },
            //     'close': function() {
            //         //self.map.enable();
            //         // this.stRegistroComprobantes.load();
            //     }
            // });
            if (cbmovimientooper.getValue()) {
                var a = new Ext.ImportOperEnzona();
                a.on({
                    extraido: function (datos) {
                        addOperEnzona(datos);
                    }
                });
            }
        }
    });

    /* Campo de texto importe en letras operaciones */
    tfimporteletrasoper = new Ext.form.TextField({
        fieldLabel: 'Importe en letras', //perfil.etiquetas.lbtfimpletrasoper,
        id: 'tfimporteletrasoper',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        readOnly: true,
        disabled: true,
        disabledClass: 'disabled-component',
        anchor: '100%'
    });
    /* Campo de texto importe  operaciones*/
    tfimporteoper = new Ext.form.NumberField({
        fieldLabel: 'Importe', //perfil.etiquetas.lbtfimporteoper,
        id: 'tfimporteoper',
        style: 'text-align:right;',
        allowNegative: true,
        allowDecimals: true,
        selectOnFocus: true,
        maskRe: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        regex: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        regexText: 'Este campo solo permite n&uacute;meros.',
        maxLength: 16,
        maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 16 caracteres.',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        enableKeyEvents: true,
        disabledClass: 'disabled-component',
        anchor: '100%',
        listeners: {
            keyup: function (tf, e) {
                activateAddCPAnticipado('op');

                if (tf.isValid())
                    tfimporteletrasoper.setValue(convertir_a_letras(tfimporteoper.getValue()));
                else
                    tfimporteletrasoper.setValue('');
            },
            blur: function (tf) {
                if (tf.isValid())
                    tfimporteoper.setRawValue(saldo(tfimporteoper.getValue()));
                else
                    tfimporteletrasoper.setValue('');
            },
            keypress: function (tf, e) { // Para dejar solo 2 decimales
                //  if (acc == 'mod')
                // e.stopEvent();//duda
                if (e.getKey() == 13) //para que adicione con el enter
                    addfilaoperaciones();
            }
        }
    });
    /* Campo de texto moneda de las operaciones*/
    tfmonedaoper = new Ext.form.TextField({
        fieldLabel: 'Moneda',
        readOnly: true,
        disabled: true,
        disabledClass: 'disabled-component',
        id: 'tfmonedaoper',
        allowBlank: false,
        anchor: '100%'
    });
    //  Campos "Resto" este campo es el  mismo que el campo resto  de la ventana crear instrumento
    tfrestooper = new Ext.form.TextField({
        fieldLabel: 'Resto', //perfil.etiquetas.lbtfresto,
        disabled: true,
        id: 'tfrestooper',
        style: 'text-align:right;',
        disabledClass: 'disabled-component',
        editable: false,
        readOnly: true,
        anchor: '100%'
    });
    /* Campo de texto importe total de las operaciones*/
    tfimportetotaloper = new Ext.form.TextField({
        fieldLabel: 'Importe total',
        readOnly: true,
        disabled: true,
        style: 'text-align:right',
        disabledClass: 'disabled-component',
        id: 'tfimportetotaloper',
        allowBlank: false,
        anchor: '100%'
    });
    // Combox cuenta debitar--operaciones
    stcuentadebitar = new Ext.data.Store({
        url: 'cargarctascontables',
        reader: new Ext.data.JsonReader({
            id: 'rdcuentacontliqui'
        }, [{
            name: 'idcuenta'
        },
            {
                name: 'text'
            }
        ])
    });
    //combo cuenta debitar --operaciones
    cbcuentadebitar = new Ext.form.ComboBox({
        tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>', // Paramostrar los datos como detalle
        id: 'cbcuentadebitar',
        disabledClass: 'disabled-component',
        emptyText: 'Seleccione..',
        valueField: 'idcuenta',
        displayField: 'text',
        fieldLabel: 'Cuenta de banco',
        store: stcuentadebitar,
        typeAhead: true,
        resizable: true,
        triggerAction: 'all',
        mode: 'local',
        selectOnFocus: true,
        anchor: '100%',
        editable: true,
        allowBlank: false,
        enableKeyEvents: true,
        disabled: false,
        //listWidth: 400,
        listeners: {
            select: function () {
                //tfimporteoper.reset();

                activateAddCPAnticipado('op');
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbcuentadebitar').getValue() != 'Seleccione...' && Ext.getCmp('cbcuentadebitar').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbcuentadebitar'), Ext.getCmp('cbcuentadebitar').getRawValue());
                 });*/
            }
        }
    });

    //boton para volver a disparar el evento select del combo
    //operacion, para poder volver a cargar el combo de las cuentas de contrapartida
    btnreloadcontrapartida = new Ext.Button({
        id: 'btnreloadcontrapartida',
        text: '',
        tooltip: 'Recargar las cuentas de contrapartida',
        iconCls: 'recargar',
        disabled: false,
        handler: function () {
            if (cbmovimientooper.isValid()) {
                cbmovimientooper.fireEvent('select', cbmovimientooper);
            } else {
                cbmovimientooper.focus(true, true);
                mostrarMensaje(1, 'Debe seleccionar una operaci&oacute;n para poder cargar la cuentas de contrapartida.');
            }
        }
    });

    // Combox cuenta acreditar--operaciones
    stcuentaacreditar = new Ext.data.Store({
        url: 'cargarcuentaxoperacion',
        reader: new Ext.data.JsonReader({
            root: 'datos',
            id: 'idcuenta'
        }, [{
            name: 'idcuenta'
        },
            {
                name: 'text'
            }, {
                name: 'idmovimientocaja'
            }, {
                name: 'idanticipo'
            }
        ])
    });
    //combo cuenta a acreditar--operaciones
    /*cbcuentaacreditaroper = new Ext.form.ComboBox({
     id: 'cbcuentaacreditaroper',
     disabledClass: 'disabled-component',
     emptyText: 'Seleccione...',
     fieldLabel: 'Cuenta contrapartida',
     forceSelection: true,
     resizable: true,
     hideTrigger: false,
     allowBlank: false,
     store: stcuentaacreditar,
     readOnly: true,
     valueField: 'idcuenta',
     displayField: 'text',
     typeAhead: true,
     mode: 'local',
     triggerAction: 'all',
     selectOnFocus: true,
     anchor: '100%',
     enableKeyEvents: true,
     //disabled: true,
     listeners: {
     render: function(component) {
     }
     }
     });*/

    cbcuentaacreditaroper = new Ext.contabilidad.util.linkedCombo({
        id: 'cbcuentaacreditaroper',
        fieldLabel: 'Cuenta contrapartida',
        store: stcuentaacreditar,
        disabledClass: 'disabled-component',
        displayField: 'text',
        valueField: 'idcuenta',
        allowBlank: false,
        listHeight: 200,
        singleSelection: false,
        lazyRender: true,
        fnCreateNew: Ext.emptyFn,
        enableKeyEvents: true,
        anchor: '100%',
        disabled: true,
        hideTbar: true,
        listeners: {
            load: function (response) {
                var res = Ext.decode(response.responseText);
                if (res.datos.length === 0) {
                    mostrarMensaje(1, 'El modelo contable asociado a la operaci&oacute;n no est&aacute; configurado correctamente.');
                }
            }
        }
    });
    /*   Store de Combox Movimiento (operaciones) */
    stmovimientooper = new Ext.data.Store({
        url: 'cargarmovimientos',
        reader: new Ext.data.JsonReader({
            root: 'datos',
            // totalProperty: 'cantidad',
            id: 'idoperacion'
        }, [
            {
                name: 'idoperacion',
                type: 'string'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'idnomoperaciones',
                type: 'string'
            },
            {
                name: 'idcuenta',
                type: 'string'
            },
            {
                name: 'signo'
            }
        ]),
        sortInfo: {
            field: 'denominacion',
            direction: 'ASC'
        },
        listeners: {
            beforeload: function (s, options) {
                stmovimientooper.clearFilter(true);
                stmovimientooper.removeAll();
            }
        }
// DESC
    });
    /*   Combox Movimiento (Operaciones)  --operaciones*/
    cbmovimientooper = new Ext.form.ComboBox({
        fieldLabel: 'Operaci\xF3n', //perfil.etiquetas.lbcbMovimiento,
        disabledClass: 'disabled-component',
        id: 'cbmovimientooper',
        mode: 'local',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>', // Paramostrar los datos como detalle
        //emptyText: 'Seleccione...',
        editable: true,
        resizable: true,
        store: stmovimientooper, // lo toma del store de liquidacion, solo cambia en el momento que se manda a cargar
        valueField: 'idoperacion',
        displayField: 'denominacion',
        hiddenName: 'idoperacion',
        forceSelection: true,
        anchor: '100%',
        triggerAction: 'all',
        enableKeyEvents: true,
        typeAhead: true,
        /*maskRe : /^([0-9a-zA-Z \(\)\-\+\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \(\)\-\+\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        listeners: {
            change: function (cbx, newValue, oldValue) {
                if (newValue != oldValue)
                    cambio = true;
            },
            select: function () {
                activateAddCPAnticipado('op');

                var index = cbmovimientooper.store.find('idoperacion', cbmovimientooper.getValue());
                var objsel = cbmovimientooper.store.getAt(index).data;
                buscarcuentaoperacion(cbmovimientooper.getValue(), 'oper', objsel);
            },
            keypress: function (t, e) {
                if (acc == 'mod') {
                    e.stopEvent();
                } else {
                    if ((e.getKey() == 46)/*|| (e.getKey() == 8) */)
                        cbmovimientooper.clearValue();
                }
            },
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbmovimientooper').getValue() != 'Seleccione...' && Ext.getCmp('cbmovimientooper').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbmovimientooper'), Ext.getCmp('cbmovimientooper').getRawValue());
                 });*/
            }
        }
    });

    //

    var stbeneficia = new Ext.data.Store({
        url: 'buscarbeneficiario',
        //autoLoad: true,
        baseParams: {
            tipo: 3
        },
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'id'
            }, {
                name: 'tipo'
            }, {
                name: 'denomtipo',
                type: 'string'
            }, {
                name: 'nombre'
            }
            ])
    });

    // stbeneficia.on('beforeload', function () {
    //     stbeneficia.baseParams.tipo = cbxtipobeneficiario.getValue();
    //     stbeneficia.baseParams.tipoOperacion = cbtipoOpInstr.getValue();
    // });

    var cbxbeneficia = new Ext.form.ComboBox({
        fieldLabel: 'Acreedor/Deudor',
        disabledClass: 'disabled-component',
        id: 'cbxclienteprov',
        tpl: '<tpl for="."><div ext:qtip="{denomtipo}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        mode: 'remote',
        allowBlank: false,
        hideTrigger: false,
        //disabled: true,
        editable: true,
        readOnly: false,
        selectOnFocus: true,
        store: stbeneficia,
        valueField: 'id',
        displayField: 'nombre',
        disabled: false,
        //hiddenName: 'id',
        forceSelection: true,
        minChars: 3, //Para la nueva busqueda poner contraria esta linea
        pageSize: 10, //Para la nueva busqueda poner contraria esta linea
        anchor: '99%',
        enableKeyEvents: true,
        triggerAction: 'all',
        //typeAhead: true,
        listeners: {
            change: function (cbx, newValue, oldValue) {
                // if (acc == 'mod')
                //     cbxbeneficiario.setRawValue(stinstrumentobanc.data.items[idgridI].get('beneficiario'));
            },
            keypress: function (t, e) {
//                 if (soloLectura || acc == 'mod')
//                     e.stopEvent();
//                 /*else if ((e.getKey() == 8) || (e.getKey() == 46)) { // Limpiar el combo
//                     cbxbeneficiario.clearValue();
//                     //selectcasetipodoc(0);
//                     validatePrincipalForm();
//                 }*/ else if (e.getKey() == 13) { // Buscar con enter
//                     if (!cbxbeneficiario.getValue()) {
//                         // buscargenerico(stbeneficiario, cbxbeneficiario, 5);
//                         cbxbeneficiario.expand();
//                     } else {
// //                        cbrecibidopor.focus(false, 100);
//                         cbEspecialidad2.focus(false, 100);
//                     }
//                 }
            },
            beforeselect: function (combo, record, index) {
            },
            select: function () {
            },
            focus: function () {
            },
            render: function (component) {
            }
        }
    });
    /* Panel Agrupador general de todos los paneles (formulario operaciones) */
    fpoperaciones = new Ext.FormPanel({
        frame: true,
        id: 'fpoperaciones',
        height: 160,
        region: 'north',
        layout: 'fit',
        items: [{
            labelAlign: 'top',
            autoHeight: true,
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .52,
                items: [cbmovimientooper]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .08,
                items: [tfmonedaoper]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .2,
                items: [tfrestooper]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .2,
                items: [tfimportetotaloper]
            }]
        }, {
            labelAlign: 'top',
            autoHeight: true,
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .5,
                items: [cbcuentadebitar]
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .485,
                items: [cbcuentaacreditaroper]
            }, {
                style: 'margin:20 0 0 0',
                layout: 'form',
                columnWidth: .015,
                items: [btnreloadcontrapartida]
            }]
        }, {
            labelAlign: 'top',
            autoHeight: true,
            //width:200,
            layout: 'column',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .2,
                items: [tfimporteoper],
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .8,
                items: [tfimporteletrasoper],
                id: 'idtfimporteletrasoper'
            }, {
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .4,
                items: [cbxbeneficia],
                hidden: true,
                id: 'cbxbeneficia'
            }]
        }]
    });
    //grid operaciones
    //store del grid operaciones
    stgridoperaciones = new Ext.data.Store({
        url: 'cargaroperacionesinstrumento',
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'idoperacion'
            }, {
                name: 'descoperacion'
            }, {
                name: 'idctacontable'
            }, {
                name: 'ctacontable'
            }, {
                name: 'ctabancaria'
            }, {
                name: 'importe'
            }, {
                name: 'idctaoperacion'
            }, {
                name: 'signo'
            }, {
                name: 'idctacontrapartida'
            }, {
                name: 'ctacontrapartida'
            }, {
                name: 'idmovimientocaja'
            }, {
                name: 'idfechacierrenomina'
            }, {
                name: 'idanticipo'
            }, {
                name: 'idclienteproveedor'
            }, {
                name: 'clienteproveedor'
            }
            ])
    });
    //smliquidaciones
    smgridoperaciones = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpoperaciones').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
//                RowClick(smodel, rowIndex, record);
                Ext.getCmp('gpoperaciones').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });
    //evento para que se habilite el btn eliminar
    smgridoperaciones.on('rowselect', function (t, e) {
        btnmodificaroper.enable(); //se habilita el bt modificar
        btneliminaroper.enable(); //se habilita el btn eliminar
        cargardatosmodfilaoperaciones(); //se cargan los datos de la operacion a modificar
    }, this);
    //evento al deseleccionar una fila
    smgridoperaciones.on('rowdeselect', function (t, e) {
        btnmodificaroper.disable(); //se deshabilita el bt modificar
        btneliminaroper.disable(); //se deshabilita el btn eliminar

        /*para que no se resetee si  tiene un solo elemento*/
        if (stcuentadebitar.getCount() > 1) {
            Ext.getCmp('cbcuentadebitar').reset();//se limpia el combo cuenta contable a debitar
        }
        //limpiar los campos del formulario
        Ext.getCmp('cbcuentaacreditaroper').reset();
        Ext.getCmp('cbcuentaacreditaroper').getStore().removeAll();
        Ext.getCmp('cbcuentaacreditaroper').clearValue();
        cbmovimientooper.setValue('');
        //se limpia el campo importe de la operacion
        Ext.getCmp('tfimporteoper').reset();
        Ext.getCmp('tfimporteoper').__proto__.maxValue = undefined;
        //se limpia el campo importe letras de la operacion
        Ext.getCmp('tfimporteletrasoper').reset();

        Ext.getCmp('cbxclienteprov').reset();
        Ext.getCmp('cbxclienteprov').clearValue();

    }, this);
    /* GridPanel liquidaciones  */
    gpoperaciones = new Ext.grid.GridPanel({
        store: stgridoperaciones,
        height: 210,
        id: 'gpoperaciones',
        width: 852,
        region: 'center',
        autoScroll: true,
        autoExpandColumn: 'operacion',
        frame: true,
        loadMask: true,
        sm: smgridoperaciones,
        columns: [
            {
                id: 'idctacontable',
                hidden: true,
                hideable: false,
                dataIndex: 'idctacontable'
            }, {
                id: 'ctadebitar',
                width: 200,
                header: 'Cuenta de banco',
                dataIndex: 'ctacontable'
            }, {
                id: 'idoperacion',
                hidden: true,
                hideable: false,
                dataIndex: 'idoperacion'
            }, {
                id: 'operacion',
                header: 'Operaci\xF3n',
                dataIndex: 'descoperacion'
            }, {
                id: 'ctabancaria',
                width: 200,
                header: 'Cuenta contrapartida',
                dataIndex: 'ctacontrapartida'
            }, {
                id: 'moneda',
                width: 60,
                header: 'Moneda',
                dataIndex: 'moneda'
            }, {
                id: 'importe',
                width: 120,
                header: 'Importe',
                align: 'right',
                renderer: formatoMonedaABS,
                dataIndex: 'importe'
            }, {
                id: 'idctaoperacion',
                header: 'idctaoperacion',
                hidden: true,
                hideable: false,
                dataIndex: 'idctaoperacion'
            }, {
                id: 'clienteproveedorrr',
                header: 'Acreedor/Deudor',
                hidden: true,
                width: 200,
                dataIndex: 'clienteproveedor'
            }],
        tbar: [btnadicionaroper, btnmodificaroper, btneliminaroper, '->', btnImportar]
    });
    /*    ventana Operaciones     */
    winoperaciones = new Ext.Window({
        autoValidate: false,
        constrain: true,
        layout: 'border',
        resizable: false,
        modal: true,
        closeAction: 'hide',
        items: [fpoperaciones, gpoperaciones],
        buttons: [{
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: perfil.etiquetas.lbBtnCancelar,
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                abrioperacion = false;

                if (sttaboperaciones.getCount() > 0) {
                    valoresEnVentOp = 1;
                } else {
                    valoresEnVentOp = 0;
                }

                pagado();
                if (acc !== 'mod') {
                    habilitaroperacion(0);
                    //pagado();
                }
                winoperaciones.hide();
                fpoperaciones.getForm().reset();

                cbcuentaacreditaroper.reset();
                cbcuentaacreditaroper.clearValue();
                cbcuentaacreditaroper.setDisabled(true);
                //cargargridOper();

                arrIdmovsCajaToSend = new Array();
            }
        }, {
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            text: perfil.etiquetas.lbBtnAceptar,
            handler: function () {
                if (stgridoperaciones.getCount() == 0 && acc != 'mod') {
                    var msg = (cbtipoOpInstr.getValue() == 1) ? 'Debe adicionar al menos una operaci&oacute;n de cobro.' : 'Debe adicionar al menos una operaci&oacute;n de pago.';
                    mostrarMensaje(1, msg);
                } else {
                    //                    var band = true;
//                    if (!arroperacioninst.length > 0)//si no tiene operaciones
//                        band = false;
//                    if (band) {
                    valoresEnVentOp = 1;
                    //arrayreembolsar();
                    abrioperacion = true;
                    soloLectura = true;
                    habilitaroperacion(1);
                    arroperacioninst = creaDataOperaciones(stgridoperaciones.data);//se actualiza el array con los datos del grid
                    actualizaInfoTabOperaciones();//se actualiza el grid info de las operaciones
                    pagado();

                    arrIdmovsCajaToSend = new Array();
                    winoperaciones.hide();

                    cbcuentaacreditaroper.reset();
                    cbcuentaacreditaroper.clearValue();
                    cbcuentaacreditaroper.setDisabled(true);
//                    }
                }
            }
        }]
    });

    /*******************************************************************************/
    /////////////////////////   Motivo de Cancelacion	////////////////////////
    /*******************************************************************************/
    // ComboBox Motivo de cancelacion para cancelar sin llenar todos los datos
    stmotivo = new Ext.data.Store({
        url: 'cargarmotivocancelacion',
        reader: new Ext.data.JsonReader({
            root: 'datos',
            id: 'idmotivocancelacion'
        }, [
            {
                name: 'idmotivocancelacion',
                mapping: 'idmotivocancelacion',
                type: 'string'
            },
            {
                name: 'motivo',
                mapping: 'descripcion'
            }
        ]),
        sortInfo: {
            field: 'motivo',
            direction: 'ASC'
        },
        listeners: {
            beforeload: function (s, options) {
                stmotivo.clearFilter(true);
                stmotivo.removeAll();
            }
        }
    });
    cbmotivocancel = new Ext.form.ComboBox({
        fieldLabel: 'Motivo de cancelaci\xF3n',
        disabledClass: 'disabled-component',
        mode: 'local',
        name: 'cbmotivocancel',
        id: 'cbmotivocancel',
        tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
        resizable: true,
        emptyText: 'Seleccione...',
        store: stmotivo,
        valueField: 'idmotivocancelacion',
        displayField: 'motivo',
        editable: false,
        typeAhead: true,
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        anchor: '95%',
        triggerAction: 'all',
        listeners: {
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbmotivocancel').getValue() != 'Seleccione...' && Ext.getCmp('cbmotivocancel').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbmotivocancel'), Ext.getCmp('cbmotivocancel').getRawValue());
                 });*/
            }
        }
    });
    /************************************************************************************/
    /*************************FLUJO NORMAL SE CANCELA DESPUES DE CREADO******************/
    /************************************************************************************/
    // ComboBox Motivo de cancelacion
    var storemotivo = new Ext.data.Store({
        url: 'cargarmotivocancelacion',
        reader: new Ext.data.JsonReader({
            root: 'datos',
            id: 'idmotivocancelacion'
        }, [
            {
                name: 'idmotivocancelacion',
                mapping: 'idmotivocancelacion',
                type: 'string'
            },
            {
                name: 'motivo',
                mapping: 'descripcion'
            }
        ]),
        sortInfo: {
            field: 'motivo',
            direction: 'ASC'
        },
        listeners: {
            beforeload: function (s, options) {
                storemotivo.clearFilter(true);
                storemotivo.removeAll();
            }
        }
    });
    var cbxmotivo = new Ext.form.ComboBox({
        fieldLabel: 'Motivo de cancelaci\xF3n',
        disabledClass: 'disabled-component',
        mode: 'local',
        name: 'cbxmotivo',
        id: 'cbxmotivo',
        tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
        resizable: true,
        emptyText: 'Seleccione...',
        store: storemotivo,
        hiddenName: 'idmotivocancelacion',
        valueField: 'idmotivocancelacion',
        displayField: 'motivo',
        editable: false,
        typeAhead: true,
        msgTarget: 'qtip',
        /*maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
         regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        anchor: '95%',
        triggerAction: 'all',
        listeners: {
            render: function (component) {
                /*component.getEl().on('mouseover', function () {
                 if (Ext.getCmp('cbxmotivo').getValue() != 'Seleccione...' && Ext.getCmp('cbxmotivo').getValue().length > 0)
                 fToolTipShow(Ext.getCmp('cbxmotivo'), Ext.getCmp('cbxmotivo').getRawValue());
                 });*/
            }
        }
    });
    // ComboBox Operacion de cancelacion
    stoperacioncancelacion = new Ext.data.Store({
        id: 'stoperacioncancelacion',
        url: 'cargarmovimientoscancelacion',
        reader: new Ext.data.JsonReader({
            root: 'datos',
            id: 'idoperacion'
        }, [
            {
                name: 'idoperacion',
                type: 'string'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'idnomoperaciones',
                type: 'string'
            },
            {
                name: 'idcuenta',
                type: 'string'
            },
            {
                name: 'signo'
            }
        ]),
        sortInfo: {
            field: 'denominacion',
            direction: 'ASC'
        },
        listeners: {
            beforeload: function (s, options) {
                stoperacioncancelacion.clearFilter(true);
                stoperacioncancelacion.removeAll();
            }
        }
// DESC
    });
    // DateField Fecha de cancelacion
    var dffechacancelacion = new Ext.form.DateField({
        fieldLabel: 'Fecha de cancelaci\xF3n',
        disabledClass: 'disabled-component',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        selectOnFocus: true,
        readOnly: false,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Formato: dd/mm/aaaa',
        editable: true,
        allowBlank: false,
        format: 'd/m/Y',
        anchor: '95%',
        name: 'dffechacancelacion',
        id: 'dffechacancelacion'
    });
    fpcancelacion = new Ext.FormPanel({
        id: 'fpcancelacion',
        region: 'north',
        labelAlign: 'top',
        frame: true,
        border: true,
        layout: 'form',
        autoHeight: true,
        modal: true,
        plain: true,
        trackResetOnLoad: true,
        bodyStyle: 'padding:10px 0px 0px 20px',
        items: [cbxmotivo, dffechacancelacion] // AQUI LA MODIFICACION  -  cbxoperacioncancelacion
    });
    // Window para cancelar// Window para cancelar
    var winVentanaCancelar;

    /*@tienecertf indica que tiene certificado, ampara o es amparado y para ese
     *caso necesita realizar la validacion de la variable para tratarlos de manera
     *diferente en el negocio
     *@elements lista de elementos a cancelar*/
    function MuestraWinCancelacion(tienecertf) {
        if (!winVentanaCancelar) {
            winVentanaCancelar = new Ext.Window({
                autoValidate: false,
                constrain: true,
                title: 'Cancelar instrumento',
                modal: true,
                resizable: false,
                layout: 'fit',
                closeAction: 'hide',
                id: 'winVentanaCancelar',
                autoHeight: true,
                border: false,
                width: 300,
                height: 200,
                buttons: [{
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        fpcancelacion.getForm().reset();
                        winVentanaCancelar.hide();
                        noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                    }
                },
                    {
//                        icon: perfil.dirImg + 'aceptar.png',
                        iconCls: 'aceptar',
                        text: 'Aceptar',
                        tooltip: 'Guardar datos y cerrar ventana',
                        handler: function () {
                            if (fpcancelacion.getForm().isValid()) {
                                instance = new PagingToolbarSelections({
                                    'selections': Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections(),
                                    'activePage': Ext.getCmp('gpinstrumentobanc').getBottomToolbar().getPageData().activePage
                                });
                                arregloselect = instance.getSelectionsOnArray(arrayValues);

                                arregl = datosdeOperac('cancelar');

                                if (arregloselect[0].idestadodoccomunfinanzas == 6) {
                                    clickCancelarInstContabilizado();
                                } else {
                                    loadMessageBox('Cancelando');
                                    Ext.Ajax.request({
                                        url: 'cancelainstrumento',
                                        method: 'POST',
                                        params: {
                                            motivo: cbxmotivo.getValue(),
                                            elementos: Ext.encode(arregl),
                                            fecha: dffechacancelacion.getRawValue(),
                                            idoperacion: (cbxoperacioncancelacion) ? cbxoperacioncancelacion.getValue() : null,
                                            tienecertf: tienecertf
                                        },
                                        callback: function (options, success, response) {
                                            Ext.MessageBox.hide();//se oculta msg Cancelando...
                                            responseData = Ext.decode(response.responseText);
                                            respuesta = responseData.valor;
                                            if (respuesta == 1) {
                                                stinstrumentobanc.reload();
                                                winVentanaCancelar.hide();
                                                mostrarMensaje(1, 'El instrumento bancario ha sido cancelado satisfactoriamente.');
                                                noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                                            } else if (respuesta == -1) {
                                                stinstrumentobanc.reload();
                                                winVentanaCancelar.hide();
                                                mostrarMensaje(1, 'El instrumento bancario ha sido cancelado.');
                                                noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                                            }
                                        }
                                    });
                                }
                            } else {
                                mostrarMensaje(1, 'Por favor verifique nuevamente que hay campos con valores incorrectos.');
                            }
                            noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                        }
                    }],
                listeners: {
                    hide: function (elem) {
                        cambio = 0;
                        noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                    },
                    close: function (elem) {
                        cambio = 0;
                        noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                    },
                    show: function () {
                        winVentanaCancelar.center();
                    }
                }
            });

            fpcancelacion.getForm().reset();
            winVentanaCancelar.add(fpcancelacion);
            winVentanaCancelar.doLayout();
            winVentanaCancelar.show();
            winVentanaCancelar.center();
        } else {
            fpcancelacion.getForm().reset();
            winVentanaCancelar.add(fpcancelacion);
            winVentanaCancelar.doLayout();
            winVentanaCancelar.show();
            winVentanaCancelar.center();
        }
    }


    // Verificar instrumento para mostrar ventana de cancelacion
    /*@tienecertf indica que tiene certificado, ampara o es amparado y para ese
     *caso necesita realizar la validacion de la variable para tratarlos de manera
     *diferente en el negocio*/
    function VentanaCancelarInstrumento(tienecertf) {
        loadMask('Verificando datos...');
        instance = new PagingToolbarSelections({
            'selections': Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections(),
            'activePage': Ext.getCmp('gpinstrumentobanc').getBottomToolbar().getPageData().activePage
        });
        arregloselect = instance.getSelectionsOnArray(arrayValues);

        arrayIdDocs = new Array();
        for (var v = 0; v < arregloselect.length; v++) {
            datos = new Array();
            datos[0] = arregloselect[v].iddocumento;
            datos[1] = arregloselect[v].idestadodoccomunfinanzas;
            arrayIdDocs.push(datos);
        }
        Ext.Ajax.request({
            url: 'SePuedeCancelar',
            method: 'POST',
            params: {
                documentos: Ext.encode(arrayIdDocs)//se envian los seleccionados
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData == undefined) {
                    mostrarMensaje(3, 'El instrumento no se puede cancelar debido a que no se pudieron verificar los datos.');
                    lMask.hide();
                    noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                } else {
                    if (responseData.codMsg != undefined) {
                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        lMask.hide();
                        noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                    } else {
                        var result = eval(responseData.success);
                        switch (result) {
                            case 1 :
                                storemotivo.load({
                                    callback: function (options, success, response) {
                                        if (storemotivo.getCount() == 0) {
                                            lMask.hide();
                                            mostrarMensaje(1, 'El instrumento(s) bancarios(s) no se puede cancelar debido a que no se han configurado motivos de cancelaci\xF3n.');
                                            noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                                        } else {
                                            //dffechacancelacion.setMinValue(arregloselect.fechacreacion.format('d/m/Y'));
                                            dffechacancelacion.setMinValue(arregloselect[0].fechacreacion.format('d/m/Y'));
                                            dffechacancelacion.setMaxValue(responseData.fechafin);
                                            dffechacancelacion.setValue(responseData.fechacontable);
                                            fpcancelacion.getForm().reset();
                                            if (responseData.canceladoXexpediente == 1 || arregloselect[0].cargainicial == 1) {
                                                stoperacioncancelacion.load({
                                                    params: {
                                                        Xcredito: (arregloselect[0].registrado == 2) ? 1 : 0// 1- Salida Credito Negativo  0- Entrada Debito Positivo
                                                    },
                                                    callback: function (options, success, response) {
                                                        lMask.hide();
                                                        if (stoperacioncancelacion.getCount() == 0) {
                                                            mostrarMensaje(1, 'El instrumento(s) bancarios(s) no se puede cancelar debido a que no se han configurado operaciones de cancelaci\xF3n.');
                                                            noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                                                        } else {
                                                            fpcancelacion.getForm().reset();
                                                            var compx = fpcancelacion.findById('cbxoperacioncancelacion');
                                                            if (!compx) {
                                                                /** Definicion del combo **/
                                                                cbxoperacioncancelacion = new Ext.form.ComboBox({
                                                                    disabledClass: 'disabled-component',
                                                                    fieldLabel: 'Operaci\xF3n de cancelaci\xF3n',
                                                                    mode: 'local',
                                                                    id: 'cbxoperacioncancelacion',
                                                                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                                                                    resizable: true,
                                                                    emptyText: 'Seleccione...',
                                                                    store: stoperacioncancelacion,
                                                                    hiddenName: 'idoperacion',
                                                                    valueField: 'idoperacion',
                                                                    displayField: 'denominacion',
                                                                    editable: false,
                                                                    typeAhead: true,
                                                                    msgTarget: 'qtip',
                                                                    /* maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
                                                                     regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
                                                                     regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
                                                                    allowBlank: false,
                                                                    blankText: 'Este campo es obligatorio.',
                                                                    anchor: '95%',
                                                                    selectOnFocus: true,
                                                                    triggerAction: 'all',
                                                                    listeners: {
                                                                        render: function (component) {
                                                                            /*component.getEl().on('mouseover', function () {
                                                                             if (Ext.getCmp('cbxoperacioncancelacion').getValue() != 'Seleccione...' && Ext.getCmp('cbxoperacioncancelacion').getValue().length > 0)
                                                                             fToolTipShow(Ext.getCmp('cbxoperacioncancelacion'), Ext.getCmp('cbxoperacioncancelacion').getRawValue());
                                                                             });*/
                                                                        }
                                                                    }
                                                                });
                                                                fpcancelacion.add(cbxoperacioncancelacion);
                                                                fpcancelacion.setHeight(200);
                                                            }
                                                            MuestraWinCancelacion(tienecertf);
                                                            //cbxoperacioncancelacion.getEl().up('.x-form-item').setDisplayed(true);// show label
                                                            //winVentanaCancelar.show();

                                                        }
                                                    }
                                                });
                                            } else {
                                                lMask.hide();
                                                //cbxmotivo.clearValue();
                                                fpcancelacion.getForm().reset();
                                                var find = fpcancelacion.findById('cbxoperacioncancelacion');
                                                if (find) {
                                                    fpcancelacion.remove(find, true);
                                                    fpcancelacion.setHeight(150);
                                                }
                                                MuestraWinCancelacion(tienecertf);
                                                //cbxoperacioncancelacion.getEl().up('.x-form-item').setDisplayed(false); // hide label//cbxoperacioncancelacion.hideLabel = false;
                                            }
                                        }
                                    }
                                });
                                break;
                            case 2:
                                mostrarMensaje(1, 'El instrumento bancario no se puede cancelar debido a que los anticipos asociados est&aacute;n liquidados.'); // Si liquidados los anticipos asociados
                                lMask.hide();
                                break;
                            case 3:
                                mostrarMensaje(1, 'El instrumento bancario no se puede cancelar debido a que las solicitudes de reembolso asociadas est&aacute;n posteadas.'); // si tiene reembolsos contabilizados
                                lMask.hide();
                                break;
                            case 4:
                                var catDoc = arrayIdDocs.length;
                                var msg = (catDoc == 1) ? 'El instrumento bancario no se puede cancelar debido a que ha sido cargado por Estado de cuenta. Actualice los datos.' :
                                    'Existen instrumentos cargados por Estado de cuenta, antes de cancelar debe actualizar los datos.';
                                mostrarMensaje(1, msg);
                                lMask.hide();
                                break;
                            case 5:
                                var arrDocNominaCerradas = responseData.arrDocNominaCerradas;
                                var seleccionados = Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections();

                                seleccionados.forEach(function (item, index, allItems) {
                                    if (arrDocNominaCerradas[0] == item.data.iddocumento) {
                                        var msg = 'El documento para el pago de n&oacute;mina ' + item.data.denominacion + ' No. ' + item.data.numerodocumento + ' de la cuenta bancaria ' + item.data.cuentabancaria + ' no puede ser cancelado.';
                                        msg += ' <b>El cierre del per&iacute;odo de n&oacute;mina ha sido realizado.</b>';
                                        mostrarMensaje(1, msg, function () {
                                        });
                                        return;
                                    }
                                }, this);
                                lMask.hide();
                                break;
                            case 6:
                                mostrarMensaje(1, 'El instrumento bancario no se puede cancelar debido a que tiene asociado un pago de nómina de caja.');
                                lMask.hide();
                                break;
                            case 7:
                                mostrarMensaje(1, 'El instrumento bancario no se puede cancelar debido a que su estado a cambiado.');
                                lMask.hide();
                                break;
                            default :
                                mostrarMensaje(1, 'No se pudieron verificar los datos para cancelar.');
                                lMask.hide();
                                break;
                        }
                    }
                }
            }
        });
    }

    function CancelarInstrumento(btnPresionado) {
        if (btnPresionado == 'ok') {
            var compx = fpcancelacion.findById('cbxoperacioncancelacion');
            loadMask('Cancelando...');
            Ext.Ajax.request({
                url: 'cancelainstrumento',
                params: {
                    //iddocumento : sminstbanc.getSelected().data.iddocumento,
                    elementos: Ext.encode(arregl),
                    fechacancelacion: dffechacancelacion.getRawValue(),
                    idmotivocancelacion: cbxmotivo.getValue(),
                    idoperacion: compx ? cbxoperacioncancelacion.getValue() : 0
                },
                callback: function (options, success, response) {
                    lMask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData == undefined)
                        mostrarMensaje(3, 'El instrumento bancario seleccionado no se puede cancelar debido a  errores internos ocurridos durante la operaci\xF3n solicitada.');
                    else {
                        if (responseData.codMsg != undefined)
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        else {
                            switch (responseData.success) {
                                case 1:
                                    mostrarMensaje(1, 'El instrumento bancario ha sido cancelado satisfactoriamente.');
                                    winVentanaCancelar.hide();
                                    fpcancelacion.getForm().reset();
                                    cbxmotivo.clearValue();
                                    stinstrumentobanc.reload();
                                    break;
                                case 2:
                                    mostrarMensaje(1, 'El instrumento bancario seleccionado no se puede cancelar debido  a que los anticipos asociados est&aacute;n liquidados.');
                                    // Si liquidados los anticipos asociados
                                    break;
                                case 3:
                                    mostrarMensaje(1, 'El instrumento bancario seleccionado no se puede cancelar debido  a que las solicitudes de reembolso asociadas est&aacute;n posteadas.');
                                    // si tiene reembolsos contabilizados
                                    break;
                                case 4:
                                    mostrarMensaje(1, 'El instrumento bancario no se puede cancelar debido a que el instrumento seleccionado ha sido cargado a un estado de cuenta.');
                                    // si tiene reembolsos contabilizados
                                    break;
                                default:
                                    mostrarMensaje(3, 'Ocurrieron otros errores durante la operaci\xF3n solicitada.');
                                    break;
                            }
                        }
                    }
                }
            });
        }
    }

    function elementosIgualEstado() {
        instance = new PagingToolbarSelections({
            'selections': Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections(),
            'activePage': Ext.getCmp('gpinstrumentobanc').getBottomToolbar().getPageData().activePage
        });
        arrayElementos = instance.getSelectionsOnArray(arrayValues);

        if (arrayElementos.length > 1) {
            var element = arrayElementos[0].idestadodoccomunfinanzas;
            var cargaI = arrayElementos[0].cargainicial;
            for (var v = 0; v < arrayElementos.length; v++) {
                if (element != arrayElementos[v].idestadodoccomunfinanzas) {
                    mensajeDifEstados("Los instrumentos bancarios seleccionados tienen diferentes estados.");
                    return false;//caso en que tienen estados distintos
                } else if (arrayElementos[v].estadocuenta == true)
                    mensajeDifEstados("Existen instrumentos bancarios en la selecci\xF3n cargados en estado de cuenta.");//tienen un Estado de cuenta
                else if (v == arrayElementos.length - 1)
                    return true;//caso en que termino de iterar y son iguales
                else if (arrayElementos[v].cargainicial != cargaI)
                    mensajeDifEstados("Existen instrumentos bancarios en la selecci\xF3n que pertenecen a carga inicial.");
            }
        } else if (arrayElementos[0].estadocuenta != true)
            return true;//si solo un elemento y no esta en ningun estado de cuenta
        else
            mensajeDifEstados("El instrumento bancario seleccionado tiene asociado un estado de cuenta."); // decia--' instrumento bancario seleccionado tiene Estado de cuenta'
    }

    function loadMask(message) {
        lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: message
        });
        lMask.show();
    }

    function limpiarEspacios(s) {
        s = s.replace(/\s+/gi, ' '); //sacar espacios repetidos dejando solo uno
        s = s.replace(/^\s+|\s+$/gi, ''); //sacar espacios blanco principio y final
        return s;
    }

    //muestra el msg cuando la seleccion tiene diferentes estados
    function mensajeDifEstados(msg) {
        Ext.Msg.show({
            title: 'Confirmar',
            buttons: Ext.Msg.OKCANCEL,
            msg: msg + ' </br> &iquest;Quiere perder la selecci\xF3n?',
            icon: Ext.MessageBox.QUESTION,
            fn: confirmavarios
        });
    }

    //si se seleccionaron instrumentos con estados diferentes se elimina la seleccion
    function confirmavarios(btn) {
        if (btn == 'ok') {
            arrayValues = new Array();
            sminstbanc.clearSelections();
        }
    }

    //funcion para confirmar los instrumentos
    function confirma(btnPresionado) {
        if (btnPresionado == 'ok') {
            arregl = datosdeOperac('confirmar');
            loadMessageBox('Confirmando la selecci\xF3n');
            Ext.Ajax.request({
                url: 'confirmainstrumento',
                method: 'POST',
                params: {
                    elementos: Ext.encode(arregl)
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    var result = eval(Ext.decode(response.responseText));
                    if (arregl[1] > 1) {
                        switch (result) {
                            case 1:
                                mostrarMensaje(1, 'Los instrumentos bancarios han sido confirmados satisfactoriamente.');
                                stinstrumentobanc.reload();
                                break;
                            case 2:
                                mostrarMensaje(1, 'Los instrumentos bancarios no se pueden confirmar.');
                                break;
                            case 3:
                                mostrarMensaje(1, "No se puede realizar esta acción porque el estado del documento ha sido cambiado.<br><b>Por favor recargue la interfaz.</b>");
                                break;
                        }
                    } else {
                        switch (result) {
                            case 1:
                                mostrarMensaje(1, 'El instrumento bancario ha sido confirmado satisfactoriamente.');
                                stinstrumentobanc.reload();
                                break;
                            case 2:
                                mostrarMensaje(1, 'El instrumento bancario no se puede confirmar.');
                                break;
                            case 3:
                                mostrarMensaje(1, "No se puede realizar esta acción porque el estado del documento ha sido cambiado.<br><b>Por favor recargue la interfaz.</b>");
                                break;
                        }
                    }
                }
            });
        }
    }

    //confirma que se quiere cancelar
    function confirmaCancel(btn) {
        if (btn == 'ok')
            VentanaCancelarInstrumento(0);
        else
            noWindow = true;//se pone en true para indicar que la ventana fue cerrada
    }

    //muestra la ventana adicionar instrumento al dar click en el btn adicionar
    function clickAdicionarInst() {
        //se habilitan los campos
        cbtipodoc.setDisabled(false);
        cbtipoOpInstr.setDisabled(false);
        cbcuentabanc.setDisabled(false);
        //limpiar y actualizar datos
        limpiardatos();
        cbtipoOpInstr.reset();
        acc = 'ins';
        cambio = false;
        aplicarmodinst.show();//se muestra el btn  de modificar
//        aplicarmodinst.hide();//esto puede ser temporal, igal esta arriba la otra opción
        MostrarEtiquetas(Ext.getBody(), 'Cargando...');
        Ext.Ajax.request({
            url: 'loadDataAddInstrumento',
            callback: function (options, success, response) {

                tfnumero.setDisabled(false);
                cbfiltrotipodoc.setDisabled(false);
                tffechaInicio.setDisabled(false);
                tffechaFin.setDisabled(false);
                Ext.getCmp('btBuscar').setDisabled(false);
                Ext.getCmp('btnLimpiarLiquidar').setDisabled(false);

                responseData = Ext.decode(response.responseText);
                if (responseData.cuentas.datos.length > 0) {
                    stcuentabanc.loadData(responseData.cuentas);
                } else {
                    mostrarMensaje(1, "El instrumento bancario no se puede adicionar debido a que no existen cuentas bancarias configuradas para el subsistema.<br>- Las cuentas bancarias configuradas para el subsistema est&aacute;n cerradas.");
                    lMasktemp.hide(); // Ocultar mensaje
                    return false;
                }
                if (responseData.globals.datos['fechai']) {
                    fecha = responseData.globals.datos['fecha'];
                    fechaCont = responseData.globals.datos['fechaCont'];
                    dfemision.setMaxValue(fechaCont); //No se restringe la fecha de fin
                    dfemision.setMinValue(responseData.globals.datos['fechai']);
                    dfaceptacion.setMaxValue(responseData.globals.datos['fechafin']);
                    dfaceptacion.setMinValue(responseData.globals.datos['fechai']);
//                    dfvencimiento.setMaxValue(responseData.globals.datos['fechafin']);
//                    dfvencimiento.setMinValue(responseData.globals.datos['fechai']);
                } else {
                    mostrarMensaje(1, 'No encontrada fecha de inicio del per&iacute;odo.');
                    lMasktemp.hide(); // Ocultar mensaje
                    return false;
                }
                if (responseData.globals.datos['idmodeloe'] == 1) {
                    Ext.getCmp('formespecialidad').hide();
                    ppanel4.setHeight(65);
                } else {
                    Ext.getCmp('formespecialidad').show();
                    ppanel4.setHeight(115);
                }
                /*if (responseData.especialidades.length > 0) {
                 Ext.getCmp('gpEspecialidad').getStore().loadData(responseData.especialidades);
                 }*/
                lMasktemp.hide(); // Ocultar mensaje
                cbxtipobeneficiario.setDisabled(false);
//                cbrecibidopor.setDisabled(true);
                cbxbeneficiario.setDisabled(false);
                Ext.getCmp('taboper1').setDisabled(false);
                cbEspecialidad2.reset();
                abrirVentana('Adicionar instrumento bancario', 'inst');
//                cbtipoOpInstr.focus(false, 10);//****(darle el foco a este combo)
            }
        });
    }

    //certificar instrumento al dar click en el btncertificar
    //@indcase indica si fue por el btn certificar o por el flujo normal
    //@btn indica si es (0=btnaceptar, 1 = btnaplicar) en la ventana del instrumento
    function clickCertificararInst(indcase, btn) {
        loadMessageBox('Certificando la selecci\xF3n.');
        //caso en que se da clic en el btn certificar
        if (indcase == 'clicbtn') {
            if (elementosIgualEstado()) {
                instance = new PagingToolbarSelections({
                    'selections': Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections(),
                    'activePage': Ext.getCmp('gpinstrumentobanc').getBottomToolbar().getPageData().activePage
                });
                arreglocant = instance.getSelectionsOnArray(arrayValues);//se almacenan todos los elementos seleccionados
                if (arreglocant.length > 0) {
                    var arrayidCtasBank = new Array();//almacena los id de las bancarias para buscar los metodos de los bancos
                    //se recorre el array (arreglocant) para realizar validaciones
                    for (var i = 0; i < arreglocant.length; i++) {
                        if (!arreglocant[i].idtalonario) {//se verifica que tenga talonario(solo se certifican los cheques)
                            Ext.MessageBox.hide();
                            mostrarMensaje(1, 'El instrumento bancario ' + arreglocant[i].numerodocumento + ' no se puede certificar debido a que no tiene talonario v&aacute;lido.');
                            return;
                        }
                        arrayidCtasBank.push(arreglocant[i].idcuentabancaria);//se almacena el id de la cta bancaria
                    }
                    //se buscan los metodos de certificacion
                    Ext.Ajax.request({
                        url: 'buscarmetodobanco',
                        method: 'POST',
                        params: {
                            idctas: Ext.encode(arrayidCtasBank),
                            entradasalida: sminstbanc.getSelected().data.registrado
                            //entradasalida: arreglocant[0].tipooperacion
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            if (responseData.procede == -1) {//caso en que no se han configurado los metodos
                                mostrarMensaje(1, 'No se han configurado los m&eacute;todos de certificaci\xF3n.');
                                return;
                            } else if (responseData.procede == 0) {//caso en que son diferentes metodos
                                mostrarMensaje(1, 'Los instrumentos bancarios no se pueden certificar debido a que las sucursales asociadas <br>tienen diferentes m&eacute;todos de certificaci\xF3n.');
                                return;
                            } else {//caso en que se puede continuar con el proceso de certificacion
                                /*poner ==1*/
                                if (responseData.metodo == 1)//1= Cheque nominativo-certificado (METROPOLITANO)
                                    certificaMetropolitano(indcase, btn);
                                else if (responseData.metodo == 0) {//0= Cheque certificado (BANDEC)
                                    arreglocant[0].tipooperacion = sminstbanc.getSelected().data.registrado;
                                    if (arreglocant.length == 1) {//se verifica que solo exista un cheque a certificar para evitar problemas
                                        var paramCertif = new Array();//arreglo con los parametros a mostrar en la ventana de certificacion
                                        paramCertif[0] = arreglocant[0];//datos del sm
                                        paramCertif[1] = responseData.tipodoc;//tipo doc
                                        paramCertif[2] = responseData.banco;//datos del banco
                                        paramcertificacion = paramCertif;
                                        MostrarWinCertificar(paramCertif);
                                    } else//se muestra mensaje para perder la seleccion
                                        mensajeDifEstados('S\xF3lo puede certificar un instrumento bancario a la vez <br> por el m&eacute;todo (Cheque certificado).');
                                } else {
                                    //Esto pasa cuando la sucursal no tiene configurado
                                    //método de certificacion, o sea que se configurón como ninguno
                                    //responseData.metodo == -1
                                    mostrarMensaje(1, 'No se puede realizar la certificaci&oacute;n.<br>La sucursal de la cuenta bancaria no se tiene especificado un m&eacute;todo para certificar.');
                                    return;
                                }
                            }
                        }
                    });//fin del AJAX.REQUEST buscarmetodobanco
                }//fin de IF
            } else
                Ext.MessageBox.hide();//se oculta la mascara 'xertificando...'
        }
        //caso en que se esta adicionando y detecta que es obligatorio certificar
        else {
            //se verifica que tenga talonario (solo se certifican los cheques)
            if (idTalonario == 0) {
                Ext.MessageBox.hide();
                mostrarMensaje(1, 'El instrumento bancario ' + tfnumerodoc.getValue() + ' no  se puede  certificar debido a que no tiene talonario v&aacute;lido.');
                return;
            }
            arrayidCtasBank = new Array();//almacena el id de la cta banc para buscar los metodos de los bancos
            arrayidCtasBank.push(cbcuentabanc.getValue());
            //se buscan los metodos de certificacion

            Ext.Ajax.request({
                url: 'buscarmetodobanco',
                method: 'POST',
                params: {
                    idctas: Ext.encode(arrayidCtasBank),
                    entradasalida: cbtipoOpInstr.getValue()
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    if (responseData.procede == -1) {//caso en que no se han configurado los metodos
                        mostrarMensaje(1, 'No se han configurado los m&eacute;todos de certificaci\xF3n.');
                        return;
                    } else if (responseData.procede == 0) {//caso en que son diferentes metodos
                        mostrarMensaje(1, 'Los instrumentos bancarios no se pueden certificar debido a que las sucursales asociadas <br>tienen diferentes m&eacute;todos de certificaci\xF3n.');
                        return;
                    } else {//caso en que se puede continuar con el proceso de certificacion
                        /*poner ==1*/
                        if (responseData.metodo == 1)//1= Cheque nominativo-certificado (METROPOLITANO)
                            certificaMetropolitano(indcase, btn);
                        else if (responseData.metodo == 0) {//0= Cheque certificado (BANDEC)
                            //almacena los datos que se pasan como parametro a
                            //la variable param[0]
                            var arrayparam = {
                                'numerodocumento': tfnumerodoc.getValue(),
                                'denominacion': cbtipodoc.getRawValue(),
                                'idcuentabancaria': cbcuentabanc.getValue(),
                                'cuentabancaria': cbcuentabanc.getRawValue(),
                                'tipooperacion': cbtipoOpInstr.getValue(),
                                'importeor': tfimporte.getValue(),
                                'fechacreacion': dfemision.getRawValue(),
                                'iddocumento': 0, //id del instrumento (0 porque no se ha creado)
                                'importemo': tfimporte.getValue(),
                                'idmoneda': stmonedatasa.getAt(0).get('idmoneda')
                            };

                            //arreglo con los parametros a mostrar en la ventana de certificacion
                            var paramCertif = new Array();
                            paramCertif[0] = arrayparam;
                            paramCertif[1] = responseData.tipodoc;//tipo doc
                            paramCertif[2] = responseData.banco;//datos del banco
                            paramcertificacion = paramCertif;
                            MostrarWinCertificar(paramCertif, btn);

                        } else {
                            //Esto pasa cuando la sucursal no tiene configurado
                            //método de certificacion, o sea que se configuró como ninguno
                            //responseData.metodo == -1
                            //Se inserta normalmente el instrumento
                            adicionarinstbanc(btn);
                        }
                    }
                }
            });//fin del AJAX.REQUEST buscarmetodobanco
        }
        //certifica por el metodo metropolitano (Cheque nominativo-certificado)
        //@indcase indica si fue por el btn certificar o por el flujo normal (indcase== 'clicbtn')
        //@btnap indica si es (0=btnaceptar, 1 = btnaplicar) en la ventana del instrumento
        function certificaMetropolitano(indcase, btnap) {  //este metodo es viejo(erp) no se toco nada porque no lo entiendo
            var arrayidinst = new Array();//almacena los id de los instrumentos a certificar
            var arrayimportemo = new Array();//almacena el importe de los instrumentos a certificar
            var instacertificar = '';//almacena los # de los instrumentos a certificar
            if (indcase == 'clicbtn') {//caso que es por el btn
                for (var v = 0; v < arreglocant.length; v++) {
                    arrayidinst.push(arreglocant[v].iddocumento);//se almacena el id del inst
                    arrayimportemo.push(arreglocant[v].importemo);//se almacena el importe del inst
                    if (v == 0)
                        instacertificar += arreglocant[v].numerodocumento;
                    else
                        instacertificar += ',' + arreglocant[v].numerodocumento;
                }
                if (arreglocant.length > 1) // Si hay mas de 1 elemento
                    mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere certificar los instrumentos bancarios <br>'
                        + instacertificar + '<br> por el m&eacute;todo (Cheque nominativo-certificado)?', function (btn) {
                        certificarXmetro(btn, indcase, btnap);
                    });
                else
                    mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere certificar el instrumento bancario '
                        + instacertificar + '<br> por el m&eacute;todo (Cheque nominativo-certificado)?', function (btn) {
                        certificarXmetro(btn, indcase, btnap);
                    });

            } else {//caso en que es por el flujo normal
                //se obtiene el index del documento seleccionado
                indextipodoc = sttipodoc.find('iddoc', cbtipodoc.getValue());
                //se obtiene el saldo obligatorio a certificar
                impcertificar = parseFloat(sttipodoc.getAt(indextipodoc).data.importecertifica);
                //msg | tienes que certificarlo obligado porque se pasa del importe
                mostrarMensaje(2, 'El ' + cbtipodoc.getRawValue()
                    + ' que quiere adicionar excede el importe de $' + impcertificar + '</br>'
                    + ' y es obligatorio certificarlo.</br></br>'
                    + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                    + '&iquest;Est&aacute; seguro que quiere certificar el instrumento ' + tfnumerodoc.getValue() + '</br>'
                    + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                    + 'por el m&eacute;todo (Cheque nominativo-certificado)?', function (btn) {
                    certificarXmetro(btn, indcase, btnap);
                });
            }

            //verifica que se presione el btn ok para proceder a la certificacion metodo metropolitano
            function certificarXmetro(btnPresionado, indcase, btnap) {
                if (btnPresionado == 'ok' && indcase == 'clicbtn') {
                    loadMessageBox('Certificando la selecci\xF3n.');
                    Ext.Ajax.request({
                        url: 'certfnominativocertificado',
                        method: 'POST',
                        params: {
                            idinstrumento: Ext.encode(arrayidinst),
                            importemo: Ext.encode(arrayimportemo)
                        },
                        callback: function (options, success, response) {
                            var result = eval(Ext.decode(response.responseText));
                            Ext.MessageBox.hide();
                            switch (result) {
                                case 1://certifico bien
                                    if (arreglocant.length > 1) {
                                        mostrarMensaje(1, 'Los instrumentos bancarios han sido certificados satisfactoriamente.');
                                    } else {
                                        mostrarMensaje(1, 'El instrumento bancario ha sido certificado satisfactoriamente.');
                                    }
                                    stinstrumentobanc.reload();
                                    break;
                                case 2://no se han configurado los tipos de documentos para la entidad
                                    if (arreglocant.length > 1)
                                        mostrarMensaje(1, "<br>Los instrumentos bancarios no se pueden certificar debido a que no se han configurado los documentos.");
                                    else
                                        mostrarMensaje(1, '<br>El instrumento bancario no se puede certificar debido a que no se han configurado los documentos.');
                                    break;
                                case 3://no se ha configurado el tipo doc para certificar
                                    if (arreglocant.length > 1)
                                        mostrarMensaje(1, "<br>Los instrumentos bancarios no se pueden certificar debido a que el tipo de documento para certificar no ha sido configurado.");
                                    else
                                        mostrarMensaje(1, '<br>El instrumento bancario no se puede certificar debido a que el tipo de documento para certificar no ha sido configurado.');
                                    break;
                                case 4: //ocurrieron errores al certificar
                                    if (arreglocant.length > 1)
                                        mostrarMensaje(3, "<br>Los instrumentos bancarios no se pueden certificar por las siguientes razones:<br><br>- Ocurrieron errores durante la acci\xF3n.");
                                    else
                                        mostrarMensaje(3, '<br>El instrumento bancario no se puede certificar  por las siguientes razones:<br><br>- Ocurrieron errores durante la acci\xF3n.');
                                    break;
                                case 5: //viola el rango de importe
                                    if (arreglocant.length > 1)
                                        mostrarMensaje(1, "<br>Los instrumentos bancarios no se pueden certificar debido a que el importe de los instrumentos no se corresponde con el rango establecido para la certificaci\xF3n.");
                                    else
                                        mostrarMensaje(1, '<br>El instrumento bancario no se puede certificar debido a que el importe del instrumento no se corresponde con el rango establecido para la certificaci\xF3n.');
                                    break;
                            }//fin SWITCH
                        }//fin CALLBACK
                    });//fin AJAX.REQUEST
                }//fin del IF
                else if (btnPresionado == 'ok' && indcase != 'clicbtn') {
                    loadMessageBox('Certificando la selecci\xF3n.');
                    Ext.Ajax.request({
                        url: 'certfnominativocertificado',
                        method: 'POST',
                        params: {
                            idinstrumento: Ext.encode(arrayidinst),
                            importemo: Ext.encode(arrayimportemo),
                            datainst: Ext.encode(buildArrayDataInst())
                        },
                        callback: function (options, success, response) {
                            var result = eval(Ext.decode(response.responseText));
                            switch (result) {
                                case 1://certifico bien
                                    Ext.MessageBox.hide();//se oculta la mascara del Certificando...
                                    mostrarMensaje(1, 'El instrumento bancario ha sido adicionado y certificado satisfactoriamente.');

                                    if (presionandobtnaplicar == true) {
                                        //Aquí se presiona el botón Aplicar
                                        despuesdeAplicar();
                                    } else {
                                        //Aquí se presiona el botón Aceptar
                                        wininstbanc.hide();
                                    }


                                    limpiardatos(1, btnap);
                                    Ext.getCmp('taboper1').setDisabled(true);
                                    Ext.getCmp('taboper2').setDisabled(true);
                                    Ext.getCmp('taboper3').setDisabled(true);

                                    //MostrarEtiquetas(Ext.getBody(), 'Cargando...');//para que se muestre al cargar
                                    stinstrumentobanc.reload({
                                        callback: function () {
                                            //lMasktemp.hide();//se oculta la mascara
                                        }
                                    });
                                    break;
                                case 2://no se han configurado los tipos de documentos para la entidad
                                    mostrarMensaje(3, '<br>El instrumento bancario no se puede certificar debido a que no se han configurado los documentos.');
                                    break;
                                case 3://no se ha configurado el tipo doc para certificar
                                    mostrarMensaje(3, '<br>El instrumento bancario no se puede certificar debido a que el tipo de documento para certificar no ha sido configurado.');
                                    break;
                                case 4: //ocurrieron errores al certificar
                                    mostrarMensaje(3, '<br>El instrumento bancario no se puede certificar debido a que ocurrieron errores durante la acci\xF3n.');
                                    break;
                                case 5: //viola el rango de importe
                                    mostrarMensaje(3, '<br>El instrumento bancario no se puede certificar debido a que el importe del instrumento no se corresponde con el rango establecido para la certificaci\xF3n.');
                                    break;
                                case 6: //Ocurrió algún error al insertar el instrumento bancarioa
                                    mostrarMensaje(3, '<br>No se pudo insertar el instrumento bancario.');
                                    break;
                            }//fin SWITCH
                            // lMasktemp.hide();
                        }//fin CALLBACK
                    });//fin AJAX.REQUEST
                }//fin del IF
            }// fin FUNCION certificarXmetro()
        }// fin FUNCION certificaMetropolitano()
    }

    //cancelar instrumento al dar click en el btncancelar
    function clickCancelarInst() {
        if (elementosIgualEstado())//si tienen el mismo estado se muestra en una ventana los # de los que se quieren cancelar
        {
            noWindow = false;
            /*se pone en false para indicar que la ventana fue abierta*/
            instance = new PagingToolbarSelections({
                'selections': Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections(),
                'activePage': Ext.getCmp('gpinstrumentobanc').getBottomToolbar().getPageData().activePage
            });

            arregloselect = instance.getSelectionsOnArray(arrayValues);
            if (arregloselect.length > 1) {
                /*se comprueba que si hay mas de uno no este asociado*/
                var tienecert = false;//indica que no tiene certificado asociado
                for (i = 0; i < arregloselect.length; i++) {
                    if (arregloselect[i].tienecertificado || arregloselect[i].fuecertificado) {
                        tienecert = true;
                        break;
                    }
                }
                if (tienecert) {
                    mostrarMensaje(2, 'Existen en la selecci\xF3n elementos asociados a una certificaci\xF3n.' + ' </br> &iquest;Quiere perder la selecci\xF3n?', function (btn) {
                        if (btn == 'ok') {
                            arrayValues = new Array();
                            sminstbanc.clearSelections();
                            return;
                        }
                    });
                }//fin de if
                else {
                    var espacios = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                    var cadinstrumentos = '';
                    for (var v = 0; v < arregloselect.length; v++) {
                        cadinstrumentos += '-' + arregloselect[v].numerodocumento + '<br>';
                    }

                    Ext.Msg.show({
                        title: 'Confirmar',
                        buttons: Ext.Msg.OKCANCEL,
                        msg: 'La acci\xF3n cancelar&aacute; los instrumentos bancarios que<br> se relacionan a continuaci\xF3n:<br><br>' + cadinstrumentos + '</br>' + espacios + ' &iquest;Est&aacute; seguro que quiere continuar?',
                        icon: Ext.MessageBox.QUESTION,
                        fn: confirmaCancel
                    });
                }
            }
            //caso en que ampara un certificado
            else {
                if (arregloselect[0].tienecertificado) {
                    MessageBoxDialogs(2, 'El documento a cancelar es amparado por: ' + arregloselect[0].numinstcreado + '</br> &iquest;Est&aacute; seguro que desea cancelarlos?</br>', function (btn) {
                        if (btn == 'yes') {//se cancelan los dos
                            VentanaCancelarInstrumento(1);//se le pasa 1=ampara un certificado
                            return;
                        } else {
                            noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                        }
                    });
                    return;
                }//fin del if
                //caso en que ampara a un nominativo
                else if (arregloselect[0].fuecertificado) {
                    MessageBoxDialogs(2, 'El documento a cancelar ampara a ' + arregloselect[0].numinstorigen + '</br> &iquest;Quiere cancelar el documento y dejar disponible a </br>' + arregloselect[0].numinstorigen + '?</br>', function (btn) {
                        if (btn == 'yes') {//se cancela el certificado
                            VentanaCancelarInstrumento(2);//se le pasa 2=ampara un nominativo
                            return;
                        } else {
                            noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                        }
                    });
                    return;
                }//fin del else if
                else {

                    Ext.Msg.show({
                        title: 'Confirmar',
                        buttons: Ext.Msg.OKCANCEL,
                        msg: 'La acci\xF3n cancelar&aacute; el instrumento bancario seleccionado. </br> &iquest;Est&aacute; seguro que quiere continuar?',
                        icon: Ext.MessageBox.QUESTION,
                        fn: confirmaCancel
                    });
                }//fin del else
            }
        }
    }

    //confirmar instrumento al dar click en el btnconfirmar
    function clickConfirmarInst() {
        if (elementosIgualEstado()) {
            var arregl = datosdeOperac('confirmar');
            if (arregl == 0)
                return;
            else if (arregl[1] > 1) // Si hay mas de 1 elemento
                mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere confirmar los instrumentos bancarios seleccionados?', confirma);
            else
                mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere confirmar el instrumento bancario seleccionado?', confirma);
        }
    }

    /**
     * fLoadDataComprobante @description Carga los datos para mostrar el Comprobante de operaciones
     * @param tipoCont @description 1 Contabilizando, 2 Cancelando
     * @param params @description los datos de la cancelacion
     * @param certf @description indica si tiene un certificado asociado
     * @return void
     */
    function fLoadDataComprobante(tipoCont, params, certf) {
        Ext.Msg.wait('Mostrando comprobante de operaciones.', 'Por favor espere...');
        Ext.Ajax.request({
            url: 'loadDataComprobante',
            method: 'POST',
            params: {
                elementos: Ext.encode(params[0][2]['iddocumento']),
                fecha: dffechacancelacion.getRawValue(),
                idoperacion: (fpcancelacion.findById('cbxoperacioncancelacion')) ? cbxoperacioncancelacion.getValue() : 0,
                tipoCont: tipoCont,
                tipoOperacion: sminstbanc.getSelected()
            },
            callback: function (options, success, response) {
                // lMask.hide();//se oculta la mascara
                var responseData = Ext.decode(response.responseText);
                if (responseData.codM == -2) {
                    mostrarMensaje(1, "No se puede realizar esta acción porque el estado del documento ha sido cambiado.<br><b>Por favor recargue la interfaz.</b>");
                } else if (!Ext.isEmpty(responseData.fechaCont)) {
                    fShowComprobante(responseData, tipoCont, params, certf);
                }
            }
        });
    }

    //construir y mostrar el comprobante
    function fShowComprobante(respData, tipoContabilizacion, parametros, certf) {
        var idSubsistema = 12;//id de banco
        var idTipoComprobante = 3;//comprobante tipo operaciones
        var descripcion = 'Posteando ';
        descripcion = descripcion + respData.descripcion;
        var detalle = respData.detalle;

        // Ext.MessageBox.hide();
        var win = Ext.Cont.Comprobante.setIdSubsistema(idSubsistema)
            .setDetalle(detalle)
            .setObservacion(descripcion)
            .setFechaEmision(respData.fechaComp)
            .setAnotaciones(respData.dataComprobante)
            .setIdTipoComprante(3)
            .setTipoCont(1)
            .setAccion(1)
            .setAnulado(1)
            .iniciar();//
        win.onSaved(function (idComprobante, numComprobante, fechaComprobante) {
            loadMessageBox('Guardando datos del comprobante');
            if (tipoContabilizacion === 1)
                fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, parametros, certf);
            else
                fGuardarComprobanteCancel(idComprobante, numComprobante, fechaComprobante, parametros, certf);
        }).onClose(function () {
            noWindow = true;//para indicar que se cerro la ventana
            btnContabilizar.enable();
        })
        // Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaComp, respData.dataComprobante, 3, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
        //     loadMessageBox('Guardando datos del comprobante');
        //     if (tipoContabilizacion === 1)
        //         fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, parametros, certf);
        //     else
        //         fGuardarComprobanteCancel(idComprobante, numComprobante, fechaComprobante, parametros, certf);
        // }).onClose(function () {
        //     noWindow = true;//para indicar que se cerro la ventana
        //     btnContabilizar.enable();
        // });
    }

    //En esta function se determina si el importe de un asiento afecta por el debe o por el haber
    function fContDebitoCredito(debitoCredito, tipoContabilizacion) {
        var debCred = false;
        if (debitoCredito == 1)
            debCred = (tipoContabilizacion == 1) ? false : true;
        else if (debitoCredito == 0)
            debCred = (tipoContabilizacion == 1) ? true : false;
        return debCred;
    }

    function fGuardarComprobante(idComprobante, numeroComprobante, fechaComprobante, parametros, certf) {
        otherParams = {
            tienecertf: certf
        };

        Ext.Ajax.request({
            method: "POST",
            url: 'addInstContabilizado',
            params: {
                elementos: Ext.encode(parametros),
                otherParams: Ext.encode(otherParams),
                idComprobante: idComprobante,
                numComprobante: numeroComprobante,
                fechaComprobante: fechaComprobante
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                stinstrumentobanc.reload({
                    callback: function (options, success, response) {
                        mostrarMensaje(1, 'Posteo satisfactorio registrado en el comprobante ' + numeroComprobante + '.');
                    }
                });
            }
        });
    }

    function fGuardarComprobanteCancel(idComprobante, numeroComprobante, fechaComprobante, parametros, certf) {
        otherParams = {
            motivo: cbxmotivo.getValue(),
            fecha: dffechacancelacion.getRawValue(),
            idoperacion: (fpcancelacion.findById('cbxoperacioncancelacion')) ? cbxoperacioncancelacion.getValue() : 0,
            tienecertf: certf
        };

        Ext.Ajax.request({
            method: "POST",
            url: 'cancelInstContabilizado',
            params: {
                elementos: Ext.encode(parametros),
                otherParams: Ext.encode(otherParams),
                idComprobante: idComprobante,
                numComprobante: numeroComprobante,
                fechaComprobante: fechaComprobante
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                winVentanaCancelar.hide();
                stinstrumentobanc.reload({
                    callback: function (options, success, response) {
                        mostrarMensaje(1, 'Cancelaci\xF3n satisfactoria registrada en el comprobante ' + numeroComprobante + '.');
                    }
                });
            }
        });
    }

    /**
     * Accion del btn para contabilizar los instrumentos
     * @return void
     */
    function clickContabilizarInst() {
        noWindow = false;//se pone en false para indicar que la ventana fue abierta
        if (elementosIgualEstado()) {
            //para que mande si tiene certificado o no
            instance = new PagingToolbarSelections({
                'selections': Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections(),
                'activePage': Ext.getCmp('gpinstrumentobanc').getBottomToolbar().getPageData().activePage
            });
            arregloselect = instance.getSelectionsOnArray(arrayValues);
            if (arregloselect.length >= 1) {
                /*se comprueba que si hay mas de uno no este asociado*/
                var tienecertf = 0;//indica que no tiene certificado asociado
                for (var i = 0; i < arregloselect.length; i++) {
                    if (arregloselect[i].tienecertificado || arregloselect[i].fuecertificado) {
                        tienecertf = 1;
                        break;
                    }
                }
            }
            //-----------------------------------------------
            if (arregloselect > 1) {
                var mensaje = '&iquest;Est&aacute; seguro que quiere postear los instrumentos bancarios seleccionados?';
            } else {
                var mensaje = '&iquest;Est&aacute; seguro que quiere postear el instrumento bancario seleccionado?';
            }

            mostrarMensaje(2, mensaje, function (btnPress) {
                if (btnPress === 'ok') {
                    btnContabilizar.disable();
                    var params = datosdeOperac('contabilizar');
                    fLoadDataComprobante(1, params, tienecertf); //1 contabilizando
                }
            });
            //-----------------------------------------------
            // var params = datosdeOperac('contabilizar');
            // fLoadDataComprobante(1, params, tienecertf); //1 contabilizando
        } else
            noWindow = true;//se pone en true para indicar que la ventana fue cerrada
    }

    /**
     * Accion del btn para cancelar los instrumentos contabilizados
     * @return void
     */
    function clickCancelarInstContabilizado() {
        noWindow = false;//se pone en false para indicar que la ventana fue abierta
        if (elementosIgualEstado()) {
            //para que mande si tiene certificado o no
            instance = new PagingToolbarSelections({
                'selections': Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections(),
                'activePage': Ext.getCmp('gpinstrumentobanc').getBottomToolbar().getPageData().activePage
            });
            arregloselect = instance.getSelectionsOnArray(arrayValues);
            if (arregloselect.length >= 1) {
                /*se comprueba que si hay mas de uno no este asociado*/
                var tienecertf = 0;//indica que no tiene certificado asociado
                for (i = 0; i < arregloselect.length; i++) {
                    if (arregloselect[i].tienecertificado || arregloselect[i].fuecertificado) {
                        tienecertf = 1;
                        break;
                    }
                }
            }
            var params = datosdeOperac('cancelar');
            if (arregloselect[0].cargainicial == 0) {
                fLoadDataComprobante(2, params, tienecertf); //2 cancelando
            } else if (arregloselect[0].cargainicial == 1) {
                var fechaMovCan = dffechacancelacion.getRawValue();
                winVentanaCancelar.hide();
                var vc = new Ext.CICancelacion.Controller({
                    idMoneda: arregloselect[0].idmoneda,
                    idSubsistema: 12,
                    // funcionalidad: 1,//1-obligacion 2-anticipo
                    arrayIdObj: params[0][2]['iddocumento']
                });

                vc.on({
                    scope: this,
                    cancelar: function (responseData) {
                        if (responseData.codM == -2) {
                            mostrarMensaje(1, "No se puede realizar esta acción porque el estado del documento ha sido cambiado.<br><b>Por favor recargue la interfaz.</b>");
                        } else if (!Ext.isEmpty(responseData.fechaCont)) {
                            responseData.fechaComp = fechaMovCan;
                            fShowComprobante(responseData, 2, params, tienecertf);
                        }
                    }
                });
            }

        } else
            noWindow = true;//se pone en true para indicar que la ventana fue cerrada
    }

}
