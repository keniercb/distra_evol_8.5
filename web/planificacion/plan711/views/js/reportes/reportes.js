var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('reportes', cargarAccionesPlanes);
var objciPlanes = {};
objciPlanes.acciones = [];

//variables auxialiares
var plan, empimp, cc, ff, entidad, idreporte, anno, tiposalida, idejercicio;

function cargarAccionesPlanes() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url);
        cargarInterfazSolicitud();
}

function cargarInterfazSolicitud() {
    rolepersona = perfil.idrol;
//mascaras
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    mymask.show();
    btnAyudaGestSolicitudes = new Ext.Button({
        id: 'btnAyudaReportes',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
    });

    /***
     * Stores comunes
     */

    stCbejercicioPlanes = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            },{
                name: 'idplan711'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }, {
                name: 'uridatosnomenclador'
            }]),
        listeners: {
            beforeload: function () {
                stCbejercicioPlanes.baseParams.tipo = 1254;
            },
            load: function (t) {
            }
        }
    });
    
    stCbejercicioPlanesFAR = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            },{
                name: 'idplan711'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }, {
                name: 'uridatosnomenclador'
            }]),
        listeners: {
            beforeload: function () {
                stCbejercicioPlanesFAR.baseParams.tipo = 1255;
            },
            load: function (t) {
            }
        }
    });
        
    stEmpresaImp = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stEmpresaImp.baseParams.uri = 3;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    stEntidades = new Ext.data.Store({
        url: 'listarEntidades',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'identidad'
            }, {
                name: 'nombreentidad'
            }]),
        listeners: {
            beforeload: function () {
                stEntidades.baseParams.node = 100000532;
            },
            load: function (t) {
            }
        },
    });
    
    stTipoCC = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoCC.baseParams.uri = 2;
                stTipoCC.baseParams.rolepersona = rolepersona;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    stTipoCCFAR = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoCCFAR.baseParams.uri = 18;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    stTipoFuentesF = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoFuentesF.baseParams.uri = 1;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
	
    stTipoPlan = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoPlan.baseParams.uri = 16;
            },
            load: function (t) {
				mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
	
    stSituacionPedido = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stSituacionPedido.baseParams.uri = 4;
            },
            load: function (t) {
				mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
	
    //***********************
    
         //Elementos del tab1    
    cbEjercicioPlanes1 = new Ext.form.ComboBox({
        id: 'cbEjercicioPlan1',
        width: 150,
        disabled: false,
        fieldLabel: 'Plan',
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                idejercicio = rec.data.idejercicio;
                cbEntidades1.enable();
                cbCC1.enable();
                btnGenerarReporte1.enable();
                btnLimpiarParam1.enable();
            }
        }
    });
    
    cbEntidades1 = new Ext.form.ComboBox({
        id: 'cbEntidades1',
        width: 150,
        disabled: true,
        fieldLabel: 'Entidades',
        store: stEntidades,
        displayField: 'nombreentidad',
        valueField: 'identidad',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    cbCC1 = new Ext.form.ComboBox({
        id: 'idcbCC1',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Conceptos de compras',
        store: stTipoCC,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                cc=rec.data.denominacion;
                //ControlarBotones();
            }
        }
    });
    
    btnGenerarReporte1 = new Ext.Button({
        iconCls: 'reportes',
        id: 'btnGenerarReporte1',
        text: 'Generar reporte',
        tooltip: 'Generar reporte',
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes1.getValue();
            anno = cbEjercicioPlanes1.getRawValue();
            entidad = cbEntidades1.getValue();
            cc = cbCC1.getValue();
            ff = "";
            empimp = "";
            idreporte = 1;
            ObtenerReporte();
        }
    });
    
    btnLimpiarParam1 = new Ext.Button({
        iconCls: 'limpiar',
        disabled: true,
        id: 'btnLimpiarParam1',
        text: 'Limpiar',
        tooltip: 'Limpiar',
        handler: function () {
            cbEjercicioPlanes1.reset();
            cbCC1.reset();
            cbEntidades1.reset();

            cbCC1.disable();
            cbEntidades1.disable();
            btnGenerarReporte1.disable();
            entidad = "";
            cc = "";
        }
    });
    
         //Elementos del tab2
    cbEjercicioPlanes2 = new Ext.form.ComboBox({
        id: 'cbEjercicioPlanes2',
        width: 150,
        disabled: false,
        fieldLabel: 'Plan',
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                idejercicio = rec.data.idejercicio;
                cbCC2.enable();
                cbEntidades2.enable();
                cbFF2.enable();
                cbEmpresasImp2.enable();
                btnGenerarReporte2.enable();
                btnLimpiarParam2.enable();
            }
        }
    });
    
    cbEntidades2 = new Ext.form.ComboBox({
        id: 'cbEntidades2',
        width: 150,
        disabled: true,
        fieldLabel: 'Entidades',
        store: stEntidades,
        displayField: 'nombreentidad',
        valueField: 'identidad',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    cbFF2 = new Ext.form.ComboBox({
        id: 'idcbFF2',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Fuentes  de financiamiento',
        store: stTipoFuentesF,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    cbEmpresasImp2 = new Ext.form.ComboBox({
        id: 'idcbEmpresasImp2',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Empresas importadoras',
        store: stEmpresaImp,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                cbCC.enable();
                empimp=rec.data.denominacion;
                //ControlarBotones();
            }
        }
    });
    
    cbCC2 = new Ext.form.ComboBox({
        id: 'idcbCC2',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Conceptos de compras',
        store: stTipoCC,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                cc=rec.data.denominacion;
                //ControlarBotones();
            }
        }
    });
    
    btnGenerarReporte2 = new Ext.Button({
        iconCls: 'reportes',
        id: 'btnGenerarReporte2',
        text: 'Generar reporte',
        tooltip: 'Generar reporte',
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes2.getValue();
            anno = cbEjercicioPlanes2.getRawValue();
            entidad = cbEntidades2.getValue();
            cc = cbCC2.getValue();
            ff = cbFF2.getValue();
            empimp = cbEmpresasImp2.getValue();
            idreporte = 2;
            ObtenerReporte();
        }
    });
    
    btnLimpiarParam2 = new Ext.Button({
        iconCls: 'limpiar',
        disabled: true,
        id: 'btnLimpiarParam2',
        text: 'Limpiar',
        tooltip: 'Limpiar',
        handler: function () {
            cbEjercicioPlanes2.reset();
            cbCC2.reset();
            cbEntidades2.reset();
            cbFF2.reset();
            cbEmpresasImp2.reset();


            cbCC2.disable();
            cbEntidades2.disable();
            cbFF2.disable();
            cbEmpresasImp2.disable();
            btnGenerarReporte2.disable();

            entidad = "";
            cc = "";
            ff = "";
            empimp = "";
        }
    });

         //Elementos del tab3
    cbEjercicioPlanes3 = new Ext.form.ComboBox({
        id: 'cbEjercicioPlanes3',
        width: 150,
        disabled: false,
        fieldLabel: 'Plan',
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                idejercicio=rec.data.idejercicio;
                btnGenerarReporte3.enable();
                btnLimpiarParam3.enable();
            }
        }
    });
    
    cbEntidades3 = new Ext.form.ComboBox({
        id: 'cbEntidades3',
        width: 150,
        disabled: false,
        fieldLabel: 'Entidades',
        store: stEntidades,
        displayField: 'nombreentidad',
        valueField: 'identidad',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    cbFF3 = new Ext.form.ComboBox({
        id: 'idcbFF3',
        emptyText: 'Seleccione',
        width: 150,
        disabled: false,
        fieldLabel: 'Fuentes  de financiamiento',
        store: stTipoFuentesF,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    cbEmpresasImp3 = new Ext.form.ComboBox({
        id: 'idcbEmpresasImp3',
        emptyText: 'Seleccione',
        width: 150,
        disabled: false,
        fieldLabel: 'Empresas importadoras',
        store: stEmpresaImp,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                cbCC.enable();
                empimp=rec.data.denominacion;
                //ControlarBotones();
            }
        }
    });
    
    cbCC3 = new Ext.form.ComboBox({
        id: 'idcbCC3',
        emptyText: 'Seleccione',
        width: 150,
        disabled: false,
        fieldLabel: 'Conceptos de compras',
        store: stTipoCC,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                cc=rec.data.denominacion;
                //ControlarBotones();
            }
        }
    });
    
    btnGenerarReporte3 = new Ext.Button({
        iconCls: 'reportes',
        id: 'btnGenerarReporte3',
        text: 'Generar reporte',
        tooltip: 'Generar reporte',
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes3.getValue();
            anno = cbEjercicioPlanes3.getRawValue();
            entidad = cbEntidades3.getValue();
            cc = cbCC3.getValue();
            ff = cbFF3.getValue();
            empimp = cbEmpresasImp3.getValue();
            idreporte = 3;
            ObtenerReporte();
        }
    });
    
    btnLimpiarParam3 = new Ext.Button({
        iconCls: 'limpiar',
        disabled: true,
        id: 'btnLimpiarParam3',
        text: 'Limpiar',
        tooltip: 'Limpiar',
        handler: function () {
            cbEjercicioPlanes3.reset();
            cbCC3.reset();
            cbEntidades3.reset();
            cbFF3.reset();
            cbEmpresasImp3.reset();
        }
    });
    
         //Elementos del tab4     
    cbEjercicioPlanes4 = new Ext.form.ComboBox({
        id: 'cbEjercicioPlanes4',
        width: 150,
        disabled: false,
        fieldLabel: 'Plan',
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                idejercicio = rec.data.idejercicio;

                cbEntidades4.enable();
                cbCC4.enable();
                cbFF4.enable();
                cbEmpresasImp4.enable();

                btnGenerarReporte4.enable();
                btnLimpiarParam4.enable();
            }
        }
    });
    
    cbEntidades4 = new Ext.form.ComboBox({
        id: 'cbEntidades4',
        width: 150,
        disabled: true,
        fieldLabel: 'Entidades',
        store: stEntidades,
        displayField: 'nombreentidad',
        valueField: 'identidad',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    cbFF4 = new Ext.form.ComboBox({
        id: 'idcbFF4',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Fuentes  de financiamiento',
        store: stTipoFuentesF,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    cbCC4 = new Ext.form.ComboBox({
        id: 'idcbCC4',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Conceptos de compras',
        store: stTipoCC,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                cc=rec.data.denominacion;
                //ControlarBotones();
            }
        }
    });
    
    cbEmpresasImp4 = new Ext.form.ComboBox({
        id: 'idcbEmpresasImp3',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Empresas importadoras',
        store: stEmpresaImp,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                //cbCC.enable();
                empimp=rec.data.denominacion;
                //ControlarBotones();
            }
        }
    });
    
    btnGenerarReporte4 = new Ext.Button({
        iconCls: 'reportes',
        id: 'btnGenerarReporte4',
        text: 'Generar reporte',
        tooltip: 'Generar reporte',
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes4.getValue();
            anno = cbEjercicioPlanes4.getRawValue();
            entidad = cbEntidades4.getValue();
            cc = cbCC4.getValue();
            ff = cbFF4.getValue();
            empimp = cbEmpresasImp4.getValue();
            idreporte = 4;
            ObtenerReporte();
        }
    });
    
    btnLimpiarParam4 = new Ext.Button({
        iconCls: 'limpiar',
        disabled: true,
        id: 'btnLimpiarParam4',
        text: 'Limpiar',
        tooltip: 'Limpiar',
        handler: function () {
            cbEjercicioPlanes4.reset();
            cbCC4.reset();
            cbEntidades4.reset();
            cbFF4.reset();
            cbEmpresasImp4.reset();

            entidad = "";
            cc = "";
            ff = "";
            empimp = "";

            cbEntidades4.disable();
            cbCC4.disable();
            cbFF4.disable();
            cbEmpresasImp4.disable();
            btnGenerarReporte4.disable();
        }
    });
    
         //Elementos del tab5
    stTipoSalida = new Ext.data.SimpleStore({
        fields: ['tiposalida', 'tipo'],
        data : [['Presentado', 1],['Contratado', 2],['Suministrado', 3]]
        });
        
    cbTipoSalida5 = new Ext.form.ComboBox({
        id: 'cbTipoSalida5',
        width: 150,
        disabled: true,
        fieldLabel: 'Dato de salida',
        store: stTipoSalida,
        displayField: 'tiposalida',
        valueField: 'tipo',
        typeAhead: true,
        mode: 'local',
        forceSelection: false,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    cbEjercicioPlanes5 = new Ext.form.ComboBox({
        id: 'cbEjercicioPlanes5',
        width: 150,
        disabled: false,
        fieldLabel: 'Plan',
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                idejercicio=rec.data.idejercicio;
                cbCC5.enable();
            }
        }
    });
    
    cbEntidades5 = new Ext.form.ComboBox({
        id: 'cbEntidades5',
        width: 150,
        disabled: true,
        fieldLabel: 'Entidades',
        store: stEntidades,
        displayField: 'nombreentidad',
        valueField: 'identidad',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
        
    cbCC5 = new Ext.form.ComboBox({
        id: 'idcbCC5',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Conceptos de compras',
        store: stTipoCC,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                cbTipoSalida5.enable();
                cbEntidades5.enable();
                btnGenerarReporte5.enable();
                btnLimpiarParam5.enable();
                cc = rec.data.denominacion;
            }
        }
    });
    
    btnGenerarReporte5 = new Ext.Button({
        iconCls: 'reportes',
        id: 'btnGenerarReporte5',
        text: 'Generar reporte',
        tooltip: 'Generar reporte',
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes5.getValue();
            anno = cbEjercicioPlanes5.getRawValue();
            tiposalida = cbTipoSalida5.getValue();
            entidad = cbEntidades5.getValue();
            cc = cbCC5.getValue();
            ff = "";
            empimp = "";
            idreporte = 5;
            ObtenerReporte();
        }
    });
    
    btnLimpiarParam5 = new Ext.Button({
        iconCls: 'limpiar',
        disabled: true,
        id: 'btnLimpiarParam5',
        text: 'Limpiar',
        tooltip: 'Limpiar',
        handler: function () {
            cbEjercicioPlanes5.reset();
            cbCC5.reset();
            cbEntidades5.reset();
            cbTipoSalida5.reset();

            cbCC5.disable();
            cbEntidades5.disable();
            cbTipoSalida5.disable();
            btnGenerarReporte5.disable();
            tiposalida = "";
            entidad = "";
            cc = "";
        }
    });
    
            //Elementos del tab6    
    cbEjercicioPlanes6 = new Ext.form.ComboBox({
        //id: 'cbEjercicioPlanes6',
        width: 150,
        disabled: false,
        fieldLabel: 'Plan',
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                idejercicio=rec.data.idejercicio;
                cbCC6.enable();
            }
        }
    });
        
    cbCC6 = new Ext.form.ComboBox({
        //id: 'idcbCC6',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Conceptos de compras',
        store: stTipoCC,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                btnGenerarReporte6.enable();
                btnLimpiarParam6.enable();
                cc = rec.data.denominacion;
            }
        }
    });
    
    btnGenerarReporte6 = new Ext.Button({
        iconCls: 'reportes',
        //id: 'btnGenerarReporte6',
        text: 'Generar reporte',
        tooltip: 'Generar reporte',
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes6.getValue();
            anno = cbEjercicioPlanes6.getRawValue();
            entidad = "";
            cc = cbCC6.getValue();
            ff = "";
            empimp = "";
            idreporte = 6;
            ObtenerReporte();
        }
    });
    
    btnLimpiarParam6 = new Ext.Button({
        iconCls: 'limpiar',
        disabled: true,
        //id: 'btnLimpiarParam6',
        text: 'Limpiar',
        tooltip: 'Limpiar',
        handler: function () {
            cbEjercicioPlanes6.reset();
            cbCC6.reset();

            cc = "";
            cbCC6.disable();
            btnGenerarReporte6.disable();
        }
    });
    
         //Elementos del tab7
    stTipoSalidaFAR = new Ext.data.SimpleStore({
        fields: ['tiposalida', 'tipo'],
        data : [['Plan', 1],['Código', 2],['Entidades', 3]]
        });
        
    cbTipoSalida7 = new Ext.form.ComboBox({
        id: 'cbTipoSalida7',
        width: 150,
        disabled: false,
        fieldLabel: 'Dato de salida',
        store: stTipoSalidaFAR,
        displayField: 'tiposalida',
        valueField: 'tipo',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                cbEjercicioPlanes7.enable();
                if(rec.data.tipo==3){
                    cbEntidades7.enable();
                    cbCC7.disable();
                    cbCC7.reset();
                }
                if(rec.data.tipo==2){
                    cbCC7.enable();
                    cbEntidades7.disable();
                    cbEntidades7.reset();
                }
            }
        }
    });
    
    cbEjercicioPlanes7 = new Ext.form.ComboBox({
        id: 'cbEjercicioPlanes7',
        width: 150,
        disabled: true,
        fieldLabel: 'Plan',
        store: stCbejercicioPlanesFAR,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                idejercicio=rec.data.idejercicio;
                btnGenerarReporte7.enable();
                btnLimpiarParam7.enable();
            }
        }
    });
    
    cbEntidades7 = new Ext.form.ComboBox({
        id: 'cbEntidades7',
        width: 150,
        disabled: true,
        fieldLabel: 'Entidades',
        store: stEntidades,
        displayField: 'nombreentidad',
        valueField: 'identidad',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
        
    cbCC7 = new Ext.form.ComboBox({
        id: 'idcbCC7',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Códigos',
        store: stTipoCCFAR,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    btnGenerarReporte7 = new Ext.Button({
        iconCls: 'reportes',
        id: 'btnGenerarReporte7',
        text: 'Generar reporte',
        tooltip: 'Generar reporte',
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes7.getValue();
            anno = cbEjercicioPlanes7.getRawValue();
            tiposalida = cbTipoSalida7.getValue();
            entidad = cbEntidades7.getValue();
            cc = cbCC7.getValue();
            ff = "";
            empimp = "";
            idreporte = 7;
            ObtenerReporte();
        }
    });
    
    btnLimpiarParam7 = new Ext.Button({
        iconCls: 'limpiar',
        disabled: true,
        id: 'btnLimpiarParam7',
        text: 'Limpiar',
        tooltip: 'Limpiar',
        handler: function () {
            cbEjercicioPlanes7.reset();
            cbCC7.reset();
            cbEntidades7.reset();
            cbTipoSalida7.reset();
        }
    });
    
         //Elementos del tab8    
    cbEjercicioPlanes8 = new Ext.form.ComboBox({
        id: 'cbEjercicioPlanes8',
        width: 150,
        disabled: false,
        fieldLabel: 'Plan',
        store: stCbejercicioPlanesFAR,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                idejercicio=rec.data.idejercicio;
                btnGenerarReporte8.enable();
                cbEntidades8.enable();
                cbCC8.enable();
                btnLimpiarParam8.enable();
            }
        }
    });
    
    cbEntidades8 = new Ext.form.ComboBox({
        id: 'cbEntidades8',
        width: 150,
        disabled: true,
        fieldLabel: 'Entidades',
        store: stEntidades,
        displayField: 'nombreentidad',
        valueField: 'identidad',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
        
    cbCC8 = new Ext.form.ComboBox({
        id: 'idcbCC8',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Códigos',
        store: stTipoCCFAR,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                cc=rec.data.denominacion;
                //ControlarBotones();
            }
        }
    });
    
    btnGenerarReporte8 = new Ext.Button({
        iconCls: 'reportes',
        id: 'btnGenerarReporte8',
        text: 'Generar reporte',
        tooltip: 'Generar reporte',
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes8.getValue();
            anno = cbEjercicioPlanes8.getRawValue();
            entidad = cbEntidades8.getValue();
            cc = cbCC8.getValue();
            ff = "";
            empimp = "";
            idreporte = 8;
            ObtenerReporte();
        }
    });
    
    btnLimpiarParam8 = new Ext.Button({
        iconCls: 'limpiar',
        disabled: true,
        id: 'btnLimpiarParam8',
        text: 'Limpiar',
        tooltip: 'Limpiar',
        handler: function () {
            cbEjercicioPlanes8.reset();
            cbCC8.reset();
            cbEntidades8.reset();
        }
    });    
    
         //Elementos del tab9    
    cbEjercicioPlanes9 = new Ext.form.ComboBox({
        id: 'cbEjercicioPlanes9',
        width: 150,
        disabled: false,
        fieldLabel: 'Plan',
        store: stCbejercicioPlanesFAR,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
				stDescripGen.reload();
                idejercicio=rec.data.idejercicio;
                cbDescripGen9.enable();
                btnLimpiarParam9.enable();
            }
        }
    });
    
	stDescripGen = new Ext.data.Store({
        url: 'SolicitudesConsolidadas',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idsolicitud711'
            }, {
                name: 'descripcion'
            }]),
        listeners: {
            beforeload: function () {
                stDescripGen.baseParams.idplan711 = cbEjercicioPlanes9.getValue();
            },
            load: function (t) {
            }
        },
    });
	
    cbDescripGen9 = new Ext.form.ComboBox({
        id: 'cbDescripGen9',
        width: 350,
        disabled: true,
        fieldLabel: 'Descripción General',
        store: stDescripGen,
        displayField: 'descripcion',
        valueField: 'idsolicitud711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        //anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                btnGenerarReporte9.enable();
            }
        }
    });
        
    
    btnGenerarReporte9 = new Ext.Button({
        iconCls: 'reportes',
        id: 'btnGenerarReporte9',
        text: 'Generar reporte',
        tooltip: 'Generar reporte',
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes9.getValue();
            anno = "";
            entidad = cbDescripGen9.getValue();
            cc = "";
            ff = "";
            empimp = "";
            idreporte = 9;
            ObtenerReporte();
        }
    });
    
    btnLimpiarParam9 = new Ext.Button({
        iconCls: 'limpiar',
        disabled: true,
        id: 'btnLimpiarParam9',
        text: 'Limpiar',
        tooltip: 'Limpiar',
        handler: function () {
            cbEjercicioPlanes9.reset();
            cbDescripGen9.reset();
        }
    });    

         //Elementos del tab10
	cbTipoPlan10 = new Ext.form.ComboBox({
        id: 'cbTipoPlan10',
        width: 150,
        disabled: false,
        fieldLabel: 'Tipo plan',
        store: stTipoPlan,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
				stEjercicio.baseParams.tipo = rec.data.iddatos;
				mymask.show();
				stEjercicio.reload();
                cbEjercicioPlanes10.enable();
				if(cbTipoPlan10.getValue()==1254){
					ff = "";
					chkConsolidado10.reset();	
					chkConsolidado10.disable();				
				}
                if(cbTipoPlan10.getValue()==1255){
                    ff = "";
                    chkConsolidado10.reset();   
                    chkConsolidado10.enable();             
                }
            }
        }
    });
	
	stEjercicio = new Ext.data.Store({
        url: 'getEjercicios',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            },{
                name: 'idplan711'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }, {
                name: 'uridatosnomenclador'
            }]),
        listeners: {
            beforeload: function () {
            },
            load: function (t) {
				mymask.hide();
            }
        }
    });
	
    cbEjercicioPlanes10 = new Ext.form.ComboBox({
        id: 'cbEjercicioPlanes10',
        width: 150,
        disabled: true,
        fieldLabel: 'Plan',
        store: stEjercicio,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                idejercicio=rec.data.idejercicio;
                btnGenerarReporte10.enable();
                cbEntidades10.enable();
				cbSituacionPedido10.enable();
				
                btnLimpiarParam10.enable();
            }
        }
    });
    
	chkConsolidado10 = new Ext.form.Checkbox({
        id: 'chkConsolidado10',
        align: 'right',
		hiddenLabel: true,
        fieldLabel: 'Consolidados',
        disabled: true,
        listeners: {
            check: function (ck, t) {
				ff = 1;
            }
        }
    });
	
	cbSituacionPedido10 = new Ext.form.ComboBox({
        id: 'idcbCC8',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        fieldLabel: 'Situación del pedido',
        store: stSituacionPedido,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
                cc=rec.data.denominacion;
                //ControlarBotones();
            }
        }
    });

    cbEntidades10 = new Ext.form.ComboBox({
        id: 'cbEntidades10',
        width: 150,
        disabled: true,
        fieldLabel: 'Entidades',
        store: stEntidades,
        displayField: 'nombreentidad',
        valueField: 'identidad',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
        
    
    btnGenerarReporte10 = new Ext.Button({
        iconCls: 'reportes',
        id: 'btnGenerarReporte10',
        disabled: true,
        text: 'Generar reporte',
        tooltip: 'Generar reporte',
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes10.getValue();
            anno = cbEjercicioPlanes10.getRawValue();
            entidad = cbEntidades10.getValue();
            cc = cbSituacionPedido10.getValue();
            empimp = "";
            idreporte = 10;
            ObtenerReporte();
        }
    });
    
    btnLimpiarParam10 = new Ext.Button({
        iconCls: 'limpiar',
        disabled: true,
        id: 'btnLimpiarParam10',
        text: 'Limpiar',
        tooltip: 'Limpiar',
        handler: function () {
            cbTipoPlan10.reset();
            cbEjercicioPlanes10.reset();
            cbEntidades10.reset();
            cbSituacionPedido10.reset();
            chkConsolidado10.reset();
			ff = "";
            cbEjercicioPlanes10.disable();
            cbEntidades10.disable();
            cbSituacionPedido10.disable();
            chkConsolidado10.disable();
        }
    });    
    	//****************************entidades********************************
    nomPlanificacion = [{
            text: '<span class="icondistra-archivo sipac-azul"></span>' + 'Finanzas, Total de importaciones',
            titulo: 'Finanzas, Total de importaciones',
            leaf: true,
            referencia: '',
            idtexto: 'tab1',
            id: 1,
            iconCls: 'imagen-none'
        }, {
            text: '<span class="icondistra-archivo sipac-azul"></span>' + 'Finanzas, Total de importaciones por importadora',
            titulo: 'Finanzas, Total de importaciones por importadora',
            leaf: true,
            referencia: '',
            idtexto: 'tab2',
            id: 2,
            iconCls: 'imagen-none'
        }, 
        /*{
            text: '<span class="icondistra-archivo sipac-azul"></span>' + 'Finanzas, Total de importaciones por fuente de financiamiento',
            titulo: 'Finanzas, Total de importaciones por fuente de financiamiento',
            leaf: true,
            referencia: '',
            idtexto: 'tab3',
            id: 3,
            iconCls: 'imagen-none'
        },*/ {
            text: '<span class="icondistra-archivo sipac-azul"></span>' + 'Aseguramiento, Total de importaciones por bienes intermedios',
            titulo: 'Aseguramiento, Total de importaciones por bienes intermedios',
            leaf: true,
            referencia: '',
            idtexto: 'tab4',
            id: 4,
            iconCls: 'imagen-none'
        }, {
            text: '<span class="icondistra-archivo sipac-azul"></span>' + 'Aseguramiento, Resumen importación',
            titulo: 'Aseguramiento, Resumen importación',
            leaf: true,
            referencia: '',
            idtexto: 'tab5',
            id: 5,
            iconCls: 'imagen-none'
        }, {
            text: '<span class="icondistra-archivo sipac-azul"></span>' + 'Aseguramiento, Información para GAE',
            titulo: 'Aseguramiento, Información para GAE',
            leaf: true,
            referencia: '',
            idtexto: 'tab6',
            id: 6,
            iconCls: 'imagen-none'
        }, {
            text: '<span class="icondistra-archivo sipac-azul"></span>' + 'Plan FAR, Valores generales del Plan FAR',
            titulo: 'Plan FAR, Valores generales del Plan FAR',
            leaf: true,
            referencia: '',
            idtexto: 'tab7',
            id: 7,
            iconCls: 'imagen-none'
        }, {
            text: '<span class="icondistra-archivo sipac-azul"></span>' + 'Plan FAR, Valores por codigos y entidades del Plan FAR',
            titulo: 'Plan FAR, Valores por codigos y entidades del Plan FAR',
            leaf: true,
            referencia: '',
            idtexto: 'tab8',
            id: 8,
            iconCls: 'imagen-none'
        }, {
            text: '<span class="icondistra-archivo sipac-azul"></span>' + 'Plan FAR, Desglose de un consolidado',
            titulo: 'Plan FAR, Desglose de un consolidado',
            leaf: true,
            referencia: '',
            idtexto: 'tab9',
            id: 9,
            iconCls: 'imagen-none'
        }, {
            text: '<span class="icondistra-archivo sipac-azul"></span>' + 'General, Solicitudes realizadas',
            titulo: 'General, Solicitudes realizadas',
            leaf: true,
            referencia: '',
            idtexto: 'tab10',
            id: 10,
            iconCls: 'imagen-none'
        }];

    // Arbol de los Tipos de  Nomencladores	
    tpTipoNom = new Ext.tree.TreePanel({
        useArrows: true,
        width: 250,
        region: 'west',
        frame: false,
        margins: '3 3 3 3',
        autoScroll: true,
        loader: new Ext.tree.TreeLoader(),
        root: new Ext.tree.AsyncTreeNode({
            text: 'Listado de reportes del sistema',
            expanded: true,
            id: 'up',
            children: nomPlanificacion
        }),
        rootVisible: true,
        listeners: {
            click: function(nodo) {
                if (nodo.id != 'up' && nodo.id != 'ur') {
                    if (tabDetallesEmbarques.getItem(nodo.attributes.idtexto) == undefined) {
                        ActivarTab(nodo);
                    } else {
                        tabDetallesEmbarques.setActiveTab(tabDetallesEmbarques.getItem(nodo.attributes.idtexto));
                    }
                }
            }
        }
    });

    pReportes = new Ext.Panel({
        //title: 'Lista de reportes',
        layout: 'fit',
        region: 'west',
        width: 350,
        collapsible: true,
        split: true,
        disabled: false,
        items: [tpTipoNom]
    });
    
    //**************grid panel solicitudes****************************
    btnLimpiarSol711 = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            filtrosSolicitudes711.clearFilters();
        }
    });
    
    tabDetallesEmbarques = new Ext.TabPanel({
        activeTab: 0,
        region: 'center',
        plain:true,
        defaults:{autoScroll: true},
        listeners: {
             tabchange : function (panel,tab){                 
                 tab.doLayout(true);                 
             }
        }
    });

    pPestannas = new Ext.Panel({
        id: 'pPestannas',
        title: 'Reportes',
        split: true,
        disabled: false,
        region: 'center',
        layout: 'border',
        //tbar: ['Plan: ', cbEjercicioPlanes, '-','Empresa Importadora: ',cbEmpresasImp,'-','Código de planificación: ',cbCC],
        items: [tabDetallesEmbarques]
    });
    
    //****************panel principal*******************
    pGeneral = new Ext.Panel({
        layout: 'border',
        tbar: ['->', btnAyudaGestSolicitudes],
        items: [pReportes, pPestannas]
    });
    //******************viewport*****************
    myViewPlanes = new Ext.Viewport({
        layout: 'fit',
        items: [pGeneral],
        listeners: {
            afterlayout: function (e) {
            claseMask();
            }
        }
    });
    
    function claseMask() {
        var claseMask = document.getElementsByClassName('ext-el-mask');
        var maskEstructura = claseMask.item(0);
        var maskDistribucion = claseMask.item(1);
        (maskEstructura != null) ? maskEstructura.style.zIndex = '0' : null;
        (maskDistribucion != null) ? maskDistribucion.style.zIndex = '0' : null;
    }
}

function ActivarTab(nodo){
    console.log(nodo.attributes.idtexto);
    paneltab = null;
    panelelemento = null;
    switch (nodo.id) {
            case 1:
                panelelemento = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    height: 350,
                    defaults:{labelAlign:'top'},
                    items: [{
                            xtype: 'fieldset',
                            autoHeight: true,
                            layout: 'column',
                            buttonAlign:'center',
                            items: [{
                                    columnWidth: 0.3,
                                    layout: 'form',
                                    items: cbEjercicioPlanes1
                                }, {
                                    columnWidth: 0.3,
                                    layout: 'form',
                                    items: cbEntidades1
                                }, {
                                    columnWidth: 0.3,
                                    layout: 'form',
                                    items: cbCC1
                                }
                            ],
                            buttons: [btnGenerarReporte1,btnLimpiarParam1]
                        }]
                });
                paneltab = new Ext.Panel({
                    title: nodo.attributes.titulo,
                    layout: 'fit',
                    //closable : true,
                    id: nodo.attributes.idtexto,
                    items:[panelelemento]                    
                }); 
            break;
            case 2:
                panelelemento = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    height: 350,
                    defaults:{labelAlign:'top'},
                    items: [{
                            xtype: 'fieldset',
                            autoHeight: true,
                            layout: 'column',
                            buttonAlign:'center',
                            items: [{
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEjercicioPlanes2
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEntidades2
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbFF2
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEmpresasImp2
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbCC2
                                }
                            ],
                            buttons: [btnGenerarReporte2,btnLimpiarParam2]
                        }]
                });
                paneltab = new Ext.Panel({
                    title: nodo.attributes.titulo,
                    layout: 'fit',
                    //closable : true,
                    id: nodo.attributes.idtexto,
                    items:[panelelemento] 
                }); 
            break;
            case 3:
                panelelemento = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    height: 350,
                    defaults:{labelAlign:'top'},
                    items: [{
                            xtype: 'fieldset',
                            autoHeight: true,
                            layout: 'column',
                            buttonAlign:'center',
                            items: [{
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEjercicioPlanes3
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEntidades3
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbFF3
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEmpresasImp3
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbCC3
                                }
                            ],
                            buttons: [btnGenerarReporte3,btnLimpiarParam3]
                        }]
                });
                paneltab = new Ext.Panel({
                    title: nodo.attributes.titulo,
                    layout: 'fit',
                    //closable : true,
                    id: nodo.attributes.idtexto,
                    items:[panelelemento]                    
                }); 
            break;
            case 4:
                panelelemento = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    height: 350,
                    defaults:{labelAlign:'top'},
                    items: [{
                            xtype: 'fieldset',
                            autoHeight: true,
                            layout: 'column',
                            buttonAlign:'center',
                            items: [{
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEjercicioPlanes4
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEntidades4
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbFF4
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbCC4
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEmpresasImp4
                                }
                            ],
                            buttons: [btnGenerarReporte4,btnLimpiarParam4]
                        }]
                });
                paneltab = new Ext.Panel({
                    title: nodo.attributes.titulo,
                    layout: 'fit',
                    //closable : true,
                    id: nodo.attributes.idtexto,
                    items:[panelelemento]                    
                }); 
            break;
            case 5:
                panelelemento = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    height: 350,
                    defaults:{labelAlign:'top'},
                    items: [{
                            xtype: 'fieldset',
                            autoHeight: true,
                            layout: 'column',
                            buttonAlign:'center',
                            items: [
                                {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEjercicioPlanes5
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbCC5
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbTipoSalida5
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEntidades5
                                }
                            ],
                            buttons: [btnGenerarReporte5,btnLimpiarParam5]
                        }]
                });
                paneltab = new Ext.Panel({
                    title: nodo.attributes.titulo,
                    layout: 'fit',
                    //closable : true,
                    id: nodo.attributes.idtexto,
                    items:[panelelemento],
                    closeAction : 'close'
                }); 
            break;
            case 6:
                console.log('sd');
                panelelemento = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    height: 350,
                    defaults:{labelAlign:'top'},
                    items: [{
                            xtype: 'fieldset',
                            autoHeight: true,
                            layout: 'column',
                            buttonAlign:'center',
                            items: [
                                {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEjercicioPlanes6
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbCC6
                                }
                            ],
                            buttons: [btnGenerarReporte6,btnLimpiarParam6]
                        }]
                });
                paneltab = new Ext.Panel({
                    title: nodo.attributes.titulo,
                    layout: 'fit',
                    //closable : true,
                    items:[panelelemento],
                    id: nodo.attributes.idtexto,
                }); 
            break;
            case 7:
                panelelemento = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    height: 350,
                    defaults:{labelAlign:'top'},
                    items: [{
                            xtype: 'fieldset',
                            autoHeight: true,
                            layout: 'column',
                            buttonAlign:'center',
                            items: [
                                {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbTipoSalida7
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEjercicioPlanes7
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbCC7
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEntidades7
                                }
                            ],
                            buttons: [btnGenerarReporte7,btnLimpiarParam7]
                        }]
                });
                paneltab = new Ext.Panel({
                    title: nodo.attributes.titulo,
                    layout: 'fit',
                    //closable : true,
                    id: nodo.attributes.idtexto,
                    items:[panelelemento],
                    closeAction : 'close'
                }); 
            break;
            case 8:
                panelelemento = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    height: 350,
                    defaults:{labelAlign:'top'},
                    items: [{
                            xtype: 'fieldset',
                            autoHeight: true,
                            layout: 'column',
                            buttonAlign:'center',
                            items: [
                                {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEjercicioPlanes8
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEntidades8
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbCC8
                                }
                            ],
                            buttons: [btnGenerarReporte8,btnLimpiarParam8]
                        }]
                });
                paneltab = new Ext.Panel({
                    title: nodo.attributes.titulo,
                    layout: 'fit',
                    //closable : true,
                    items:[panelelemento],
                    id: nodo.attributes.idtexto,
                }); 
            break;
			case 9:
                panelelemento = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    height: 350,
                    defaults:{labelAlign:'top'},
                    items: [{
                            xtype: 'fieldset',
                            autoHeight: true,
                            layout: 'column',
                            buttonAlign:'center',
                            items: [
                                {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEjercicioPlanes9
                                }, {
                                    columnWidth: 0.8,
                                    layout: 'form',
                                    items: cbDescripGen9
                                }
                            ],
                            buttons: [btnGenerarReporte9,btnLimpiarParam9]
                        }]
                });
                paneltab = new Ext.Panel({
                    title: nodo.attributes.titulo,
                    layout: 'fit',
                    //closable : true,
                    items:[panelelemento],
                    id: nodo.attributes.idtexto,
                }); 
            break;
			case 10:
                panelelemento = new Ext.FormPanel({
                    labelWidth: 75,
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    height: 350,
                    defaults:{labelAlign:'top'},
                    items: [{
                            xtype: 'fieldset',
                            autoHeight: true,
                            layout: 'column',
                            buttonAlign:'center',
                            items: [
                                {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbTipoPlan10
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEjercicioPlanes10
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbEntidades10
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: cbSituacionPedido10
                                }, {
                                    columnWidth: 0.2,
                                    layout: 'form',
                                    items: chkConsolidado10
                                }
                            ],
                            buttons: [btnGenerarReporte10,btnLimpiarParam10]
                        }]
                });
                paneltab = new Ext.Panel({
                    title: nodo.attributes.titulo,
                    layout: 'fit',
                    //closable : true,
                    items:[panelelemento],
                    id: nodo.attributes.idtexto,
                }); 
            break;
    }
    
    tabDetallesEmbarques.add(paneltab);
    tabDetallesEmbarques.activate(paneltab);   
}

function ObtenerReporte(){
    //plan, empimp, cc, ff, entidad, idreporte;
    var win = window.open('obtenerReporte?plan='+ plan+'&idpl='+plan+'&idejercicio='+idejercicio+'&anno='+anno+'&tiposalida='+tiposalida+'&entidad='+entidad+'&cc='+cc+'&ff='+ff+'&empimp='+empimp+'&idreporte='+idreporte);
}