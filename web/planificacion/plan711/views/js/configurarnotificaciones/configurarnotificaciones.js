var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('configurarnotificaciones', cargarAcciones);
var objciPlanes = {};
objciPlanes.acciones = [];

var listademodificados = [];


function cargarAcciones() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url);
    cargarInterfazSolicitud();
}

function cargarInterfazSolicitud() {
    rolepersona = perfil.idrol;
    agregarmodificar();
    //mascaras
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    //carga de datos por defecto

    btnAyudaConfiguracion = new Ext.Button({
        id: 'btnAyudaConfiguracion',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu
    });
    
    btnListaUsuarios = new Ext.Toolbar.Button({
        tooltip: 'Lista de usuarios a notificar',
        id: 'btnListaUsuarios',
        iconCls: 'actualizar',
        handler: function () {
            ListaDeUsuarios();
        }
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

    cbTipoPlan = new Ext.form.ComboBox({
        id: 'cbTipoPlan',
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
                if (rec.data.iddatos == 1254) {
                    cbCC1.enable();
                    btnAdicionarCfgEstado.disable();
                    
                }else{
                    cbCC1.reset();
                    cbCC1.disable();
                    btnAdicionarCfgEstado.enable();
                }
                gpCfgEstado.enable();
                gpCfgSS.enable();
                stCfgEstado.reload();
                stCfgSS.reload();
                
            }
        }
    });

    stTipoCC = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoCC.baseParams.uri = 2;
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
                stCfgEstado.reload();
                btnAdicionarCfgEstado.enable();
            }
        }
    });

    /**
     * Grid de Estado
     */
    btnAdicionarCfgEstado = new Ext.Toolbar.Button({
        tooltip: 'Adicionar',
        id: 'btnAdicionarCfgEstado',
        iconCls: 'adicionar',
        handler: function () {
            winFp(1,1);
        }
    });

    btnEliminarCfgEstado = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Eliminar',
        id: 'btnEliminarCfgEstado',
        iconCls: 'eliminar',
        handler: function () {
            Eliminar(smCfgEstado.getSelected().data.idnotificaciones711, 1);
        }
    });

    btnModificarCfgEstado = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Modificar',
        id: 'btnModificarCfgEstado',
        iconCls: 'modificar',
        handler: function () {
            winFp(1,2);
        }
    });

    cmCfgEstado = new Ext.grid.ColumnModel([
        {
            header: 'Estado de aprobación',
            dataIndex: 'estadoaprobacion',
            width: 200,
            align: 'left'
        }, {
            header: 'Rol notificado',
            dataIndex: 'listaroles',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        }, {
            header: 'Notificación',
            dataIndex: 'textonotificacion',
            id: 'expandir',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        }, {
            header: 'Para consolidación',
            dataIndex: 'paraconsolidacion',
            width: 100,
            hidden: true,
            align: 'rigth',
            renderer: renderActivado
        }
    ]);

    //store del grid Estado
    stCfgEstado = new Ext.data.Store({
        url: 'listarConfiguraciones',
        reader: new Ext.data.JsonReader({
            //id: 'iddatoscodigo',
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idnotificaciones711'
            }, {
                name: 'idestado'
            }, {
                name: 'idestadoaprobacion'
            }, {
                name: 'estadoaprobacion'
            }, {
                name: 'listaidrol'
            }, {
                name: 'listaroles'
            }, {
                name: 'textonotificacion'
            }, {
                name: 'paraconsolidacion'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                Ext.Ajax.timeout = 6400000;
                stCfgEstado.baseParams.start = 0;
                stCfgEstado.baseParams.notificacion = 1;
                stCfgEstado.baseParams.idtipoplan = cbTipoPlan.getValue();
                stCfgEstado.baseParams.idcc = cbCC1.getValue();
            },
            load: function (str, rec, obj) {
                btnEliminarCfgEstado.disable();
                btnModificarCfgEstado.disable();
            }
        }
    });

    smCfgEstado = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            beforerowselect: function (sm, y, z, record) {
                btnEliminarCfgEstado.enable();
                if (cbTipoPlan.getValue() == 1254 && cbCC1.getValue()!= "") {
                    btnModificarCfgEstado.enable();
                }
                if (cbTipoPlan.getValue() == 1255) {
                    btnModificarCfgEstado.enable();
                }
            }
        }
    });

    gpCfgEstado = new Ext.grid.GridPanel({
        disabled: true,
        frame: true,
        title: 'Notificación por estado de aprobación',
        stripeRows: true,
        store: stCfgEstado,
        sm: smCfgEstado,
        autoExpandColumn: 'expandir',
        cm: cmCfgEstado,
        tbar: [btnAdicionarCfgEstado, btnModificarCfgEstado, btnEliminarCfgEstado],
        region: 'center',
        layout: 'fit',
        width: '50%',
        loadMask: {
            msg: 'Cargando...'
        },
        listeners: {
        }
    });

    /**
     * Grid de SS
     */
    btnAdicionarCfgSS = new Ext.Toolbar.Button({
        tooltip: 'Adicionar',
        id: 'btnAdicionarCfgSS',
        iconCls: 'adicionar',
        handler: function () {
            winFp(2,1);
        }
    });

    btnEliminarCfgSS = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Eliminar',
        id: 'btnEliminarCfgSS',
        iconCls: 'eliminar',
        handler: function () {
            Eliminar(smCfgSS.getSelected().data.idnotificaciones711, 2);
        }
    });

    btnModificarCfgSS = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Modificar',
        id: 'btnModificarCfgSS',
        iconCls: 'modificar',
        handler: function () {
            winFp(2,2);
        }
    });

    cmCfgSS = new Ext.grid.ColumnModel([
        {
            header: 'Situacion de pedido',
            dataIndex: 'situacionpedido',
            width: 200,
            align: 'left'
        }, {
            header: 'Rol notificado',
            dataIndex: 'listaroles',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        }, {
            header: 'Notificación',
            dataIndex: 'textonotificacion',
            id: 'expandir',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        }, {
            header: 'Para consolidación',
            dataIndex: 'paraconsolidacion',
            width: 100,
            hidden: true,
            align: 'rigth',
            renderer: renderActivado
        }
    ]);

    //store del grid SS
    stCfgSS = new Ext.data.Store({
        url: 'listarConfiguraciones',
        reader: new Ext.data.JsonReader({
            //id: 'iddatoscodigo',
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idnotificaciones711'
            }, {
                name: 'idestado'
            }, {
                name: 'idsituacionpedido'
            }, {
                name: 'situacionpedido'
            }, {
                name: 'listaidrol'
            }, {
                name: 'listaroles'
            }, {
                name: 'textonotificacion'
            }, {
                name: 'paraconsolidacion'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                Ext.Ajax.timeout = 6400000;
                stCfgSS.baseParams.start = 0;
                stCfgSS.baseParams.notificacion = 2;
                stCfgSS.baseParams.idtipoplan = cbTipoPlan.getValue();
            },
            load: function (str, rec, obj) {                
                btnEliminarCfgSS.disable();
                btnModificarCfgSS.disable();
            }
        }
    });

    smCfgSS = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            beforerowselect: function (sm, y, z, record) {
                btnEliminarCfgSS.enable();
                btnModificarCfgSS.enable();
            }
        }
    });

    gpCfgSS = new Ext.grid.GridPanel({
        disabled: true,
        frame: true,
        title: 'Notificación por situación de pedido',
        stripeRows: true,
        store: stCfgSS,
        sm: smCfgSS,
        autoExpandColumn: 'expandir',
        cm: cmCfgSS,
        tbar: [btnAdicionarCfgSS, btnModificarCfgSS, btnEliminarCfgSS],
        region: 'east',
        layout: 'fit',
        width: '50%',
        loadMask: {
            msg: 'Cargando la planificación...'
        },
        listeners: {}
    });

    pPrincipal = new Ext.Panel({
        layout: 'border',
        region: 'center',
        tbar: [btnListaUsuarios,'-','Tipo plan: ', cbTipoPlan, '-', 'Concepto de compras: ', cbCC1],
        items: [gpCfgEstado, gpCfgSS]
    });
    pGeneral = new Ext.Panel({
        layout: 'border',
        items: [pPrincipal]
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

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function renderActivado(val, m) {
    if (val == false) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    } 
    if (val == true) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    }
}

function renderTienePersona(val, m) {
//    console.log(val);
    
    if (val > 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    }else{
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    }
}