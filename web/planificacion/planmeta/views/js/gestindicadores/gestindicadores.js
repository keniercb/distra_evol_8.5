Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('gestindicadores', /*cargarInterfaz*/listarOrganos);
var mensaje, stCmbCentroBalance, cbcentrobalance, cbviaadquisicion1,ventana = false,ayuda = false, cbOrganoS, stCmbOrganoS, stCmbViaAdq;
var fpGest, winFpGest, stCmbNaturaleza, stCmbPlandirecto, modoace = false;
var control = 0;
var idarbol, anode;
objci = {};
add = true, addhijo = false;
var indic, accion_ind, checkvia = [], auxdel = false,stsustimp,auxdesact = false ,stoace, stimpdirecta, organos = [], id = [];
var field = 'denominacion', direction = 'ASC';
var flag1 = false, flag2 = true, flag3 = false, flag4 = false,key = false, flag5 = false, flag6 = false;
var modificando = false;


function mostrarDetalles(btn) {
    if (btn == 'yes') {
        irDetalles();
    } else if (btn == 'no') {
        Mod();
    }
}
function cargarInterfaz() {
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando,
        removeMask: false
    });
    // inicio ---botones del gestionar de indicadores----

    btnAdd = new Ext.Button({
        
        text: perfil.etiquetas.lbBtnAdicionar,
        disabled: false,
        id: 'btnAdd',
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAdd,
        handler: function() {
			accion_ind = 'add';
			key = true;
            accionBotonAdicionar();
			key = false;
			ventana = true;
        }
    });
    
    //boton modificar
   
    btnMod = new Ext.Button({
        disabled: true,
        id: 'btnMod',
        hidden: true,
        tabIndex: 2,
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnMod + '(<b>Alt+M</b>)',
        text: perfil.etiquetas.lbBtnModificar,
        handler: function() {
			accion_ind = 'mod';
            control = 1;
            modificando = true;
            validar();
	   ventana = true;
        }
    });
    
	
    btnDel = new Ext.Button({
        disabled: true,
        id: 'btnDel',
        tabIndex: 3,
        hidden: true,
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnDel + '(<b>DEL</b>)',
        text: perfil.etiquetas.lbBtnEliminar,
        handler: function() {
            accion_ind = 'del';
            control = 1;
            validar();
            map.disable();
        }
    });
    btnMultEnt = new Ext.Button({
        disabled: false,
        id: 'btnMultEnt',
        icon: perfil.dirImg + 'asociar.png',
        iconCls: 'btn',
        hidden: true,
        tooltip: perfil.etiquetas.lbTtbtnGestAsoc,
        text: perfil.etiquetas.lbBtnGestAsoc,
        handler: function() {
            if (pMultiEnt.isVisible()) {
                Ext.getCmp('btnaddih').show();
                trEnt.getSelectionModel().clearSelections();
                Ext.getCmp('btnasociar').hide();
                Ext.getCmp('btnquitarasociar').hide();
                pMultiEnt.hide();
                Ext.getCmp('ckasociado').reset();
                Ext.getCmp('ckasociado').disable();
                Ext.getCmp('ckasociado').hide();
                Ext.getCmp('btnasociado').hide();
                stGpGest.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
                btnAdd.show();
                btnMod.show();
                btnDel.show();
                btnAct.show();
                btnDes.show();
            } else {
                pMultiEnt.setTitle(perfil.etiquetas.lbEstructura);
                pMultiEnt.show();
                Ext.getCmp('btnaddih').hide();
                Ext.getCmp('ckasociado').setValue(true);
                Ext.getCmp('ckasociado').enable();
                Ext.getCmp('ckasociado').show();
                Ext.getCmp('btnasociado').show();
                btnAdd.hide();
                btnMod.hide();
                btnDel.hide();
                btnAct.hide();
                btnDes.hide();
            }
            myView.doLayout();
        }
    });
    btnAct = new Ext.Button({
        disabled: true,
        id: 'btnAct',
        hidden: true,
        tabIndex: 4,
        icon: perfil.dirImg + 'habilitar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAct + '(<b>Alt+X</b>)',
        text: perfil.etiquetas.lbBtnActivar,
        handler: function() {
            accion_ind = 'act'
            control = 1;
            validar();
        }
    });
    
    var Coeficientec = {
        xtype: 'numberfield',
        id: 'Coefic',
		 regex: /^[0-9]{1}[0-9]?[.]?[0-9]?[0-9]?$/,//^[0-9]{1}[0-9]?[.]?[0-9]?[0-9]?$/
         regexText: 'Solo admite números enteros positivos de hasta 2 dígitos. Hasta 2 cifras decimales.</b>',
        width: 100,
        height: 25,
		maxValue:99.99,
		maxText :'Solo admite números enteros positivos de hasta 2 dígitos. Hasta 2 cifras decimales.</b>',
		minValue:0,
		minText:'Solo admite números enteros positivos de hasta 2 dígitos. Hasta 2 cifras decimales.</b>',
        fieldLabel: 'Coeficiente',
        editable: true
    };
    
    
    btnDes = new Ext.Button({
        disabled: true,
        id: 'btnDes',
        hidden: true,
        tabIndex: 5,
        icon: perfil.dirImg + 'deshabilitar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnDes + '(<b>Alt+F</b>)',
        text: perfil.etiquetas.lbBtnDesactivar,
        handler: function() {
            accion_ind = 'desact'
            control = 1;
            validar();
        }
    });
    btnExportar = new Ext.Button({
        disabled: false,
        tabIndex: 6,
        hidden: true,
        id: 'btnExportar',
        icon: perfil.dirImg + 'exportar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnExportar + '(<b>Alt+E</b>)',
        text: perfil.etiquetas.lbBtnExportar,
        handler: function() {
            exportarindicadores();

        }
    });
    
    
    btnAprobar = new Ext.Button({
        disabled: true,
        tabIndex: 7,
        hidden: true,
        id: 'btnAprobar',
        icon: perfil.dirImg + 'aprobar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAprobar + '(<b>Alt+Q</b>)',
        text: perfil.etiquetas.lbBtnAprobar,
        handler: function() {
            accion_ind = 'aprob'
            control = 1;
            validar();
        }
    });
    btnDesaprobar = new Ext.Button({
        disabled: true,
        tabIndex: 8,
        hidden: true,
        id: 'btnDesaprobar',
        icon: perfil.dirImg + 'desaprobar.png', 
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnDesaprobar + '(<b>Alt+W</b>)',
        text: perfil.etiquetas.lbBtnDesaprobar,
        handler: function() {
            accion_ind = 'desaprob'
            control = 1;
            validar();
        }
    });
    btnAyu = new Ext.Button({
        disabled: false,
        id: 'btnAyu',
        tabIndex: 9,
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
        text: perfil.etiquetas.lbBtnAyuda,
        handler: function() {
            mostrarAyuda('Indicadores');

        }
    });
    btnLimpiarIndicadores = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarIndicadores',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbBtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            limpiarfiltros();
        }
    });

    // fin ---botones del gestionar de indicadores----




    /**************************////////////////////////
    stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        listeners: {
            load: function(t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);

                idejercicioactual = t.reader.jsonData.idejercicioactual.idejercicio;

            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }])
    });
    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function(cb, rec, index) {

                if (idejercicioactual != cbEjercicio.getValue()) {
                    Ext.getCmp('btnAdd').disable();
                }
                else
                {
                    Ext.getCmp('btnAdd').enable();

                }

                stGpGest.reload({
                    params: {
                        limit: 20,
                        start: 0
                    }
                });

            }
        }
    });
    stCmbCentroB = new Ext.data.Store({
        url: 'listarCentroBalance',
        id: 'stCmbCentroB',
        reader: new Ext.data.JsonReader({
            root: 'data',
           id: 'denom'           
        },
        [{
                name: 'identidaddatosnomenclador'
            }, {
                name: 'denom'
            }]),
        listeners: {
            beforeload: function() {
                mymask.show();
            },
            load: function() {
                mostrarVentana();
            }
        }
    });

    stCmbViaAdq = new Ext.data.Store({
        url: 'listarViaAdq',
        id: 'stCmbViaAdq',
        autoload: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idviaadquisicion'
        },
        [{
                name: 'idviaadquisicion'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function() {
                flag6 = true;
            }
        }
    });

    stCmbFormato = new Ext.data.Store({
        url: 'listarFormatos',
            autoLoad : true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'nombre'
            }, {
                name: 'idformato'
            }]),
        listeners: {
            load: function() {
                flag1 = true;
            }
        }
    });
    stCmbPaises = new Ext.data.Store({
        url: 'listarPaises',
               autoLoad : true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idpais'
            }, {
                name: 'nombrepais'
            }]),
        listeners: {
            load: function() {
                flag2 = true;
            }
        }
    });

    stCmbPlandirecto = new Ext.data.Store({
        url: 'listarTodosPlanes',        
            autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
        }, [{
                name: 'idmodelo'
            }, {
                name: 'denominacion'
            }]),
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function() {
            }
        }
    });

    stCmbNaturaleza = new Ext.data.Store({
        url: 'listarNaturaleza',
               autoLoad : true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'naturaleza'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function() {
                flag3 = true;
            }
        }
    });
    stCmbOrganoS = new Ext.data.Store({
        url: 'listarorganoSatisface',
               autoLoad : true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'denominacion'
            }, {
                name: 'idorganosatisface'
            }])
    });
   
    stCmbUM = new Ext.data.Store({
        url: 'cargarUM',
         autoLoad: true,
        listeners: {
            load: function() {
                flag5 = true;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }])
    });
    // inicio ----- definicion del grid de indicadores fuente de los datos del grid de indicadores
    stGpGest = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listar',
        listeners: {
            beforeload: function() {
                Ext.Ajax.timeout = 600000;
                stGpGest.baseParams.idarbol = (gpGest.getSelectionModel().hasSelection()) ? gpGest.getSelectionModel().getSelected().data.idarbol : idarbol;
                stGpGest.baseParams.anode = (gpGest.getSelectionModel().hasSelection()) ? gpGest.getSelectionModel().getSelected().data.idindicador : anode;
                idarbol = null;
                anode = null;
                stGpGest.baseParams.idejercicio = cbEjercicio.getValue();
                stGpGest.baseParams.ordender = (gpGest.getSelectionModel().hasSelection()) ? gpGest.getSelectionModel().getSelected().data.ordender : null;
                stGpGest.baseParams.ordenizq = (gpGest.getSelectionModel().hasSelection()) ? gpGest.getSelectionModel().getSelected().data.ordenizq : null;
                stGpGest.baseParams.rector = objci.acciones.rector;
               setTituloFiltrar();
            },
            load: function() {
                if (stGpGest.getTotalCount() == 0) {
                    stGpGest.removeAll();
                    trEnt.getSelectionModel().clearSelections();
                }
                siexisteIndicadorFiltrado();
                if (!flag1 || !flag2 || !flag3 || !flag5 || !flag6) {
                    Ext.getCmp('cbFiltroCB').store.reload();
                    stCmbUM.reload();
                    stCmbPaises.reload();
                    stCmbNaturaleza.reload();
                    stCmbPlandirecto.reload();
                    stCmbFormato.reload();
                    stCmbViaAdq.reload();
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'final',
            root: 'data',
            id: 'idindicador'
        }, // campos a tener en cuenta en la carga de
        // indicadores
        [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
            }, {
                name: 'idcb'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'coeficiente'
            },{
                name: 'estado'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'nivel'
            },
             {
                name: 'idpais'
            }, {
                name: 'nivelarbol'
            }, {
                name: 'idarbol'
            }, {
                name: 'idpadre'
            }, {
                name: 'flete'
            }, {
                name: 'idformato'
            }, {
                name: 'contingencia'
            }, {
                name: 'idnaturaleza'
            }, {
                name: 'naturaleza'
            }, {
                name: '_is_leaf'
            }, {
                name: '_parent'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'ordenizq'
            }, {
                name: 'ordender'
            }, {
                name: 'orgabasteccentral'
            }, {
                name: 'sustimp'
            }, {
                name: 'denomviaadquisicion'
            }, {
                name: 'denomorgansatisface'
            }, {
                name: 'DatIndicadorviaadquisicion'
            }, {
                name: 'DatIndicadorviaadquisicionorganosatisface'
            }, {
                name: 'NomOrganosatisface'
            }, {
                name: 'impdirecta'
            }, {
                name: 'denocentrobalance'
            }, {
                name: 'denoum'
            }, {
                name: 'denompais'
            }, {
                name: 'data'
            }, {
                name: 'idmodelo'
            }, {
                name: 'denmodelo'
            }, {
                name: 'uso'
            }])
    });


    // Configuracion de columnas del gris de indicadores
    cmGpGest = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            id: 'columncodigo',
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            tooltip: 'Código',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNopieza,
            width: 90,
            sortable: true,
            dataIndex: 'numeropieza',
            tooltip: 'Número de pieza',
            renderer: renderNopieza
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            tooltip: 'Denominación',
            renderer: crearToolTip,
            sortable: true
        }, {
            header: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            sortable: true,
            tooltip: 'Descripción',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            width: 80,
            sortable: true,
            dataIndex: 'denoum',
            tooltip: 'Unidad de Medida',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPrecio,
            width: 80,
            sortable: true,
            tooltip: 'Precio',
            dataIndex: 'precio',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPrecioInicial,
            width: 80,
            sortable: true,
            dataIndex: 'preciodivisa',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCoeficiente,
            width: 80,
            sortable: true,
            dataIndex: 'coeficiente',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCentroBalance,
            width: 130,
            sortable: true,
            tooltip: 'Centro de Balance',
            renderer: crearToolTip,
            dataIndex: 'denocentrobalance'


        }, {
            header: perfil.etiquetas.lbActivado,
            width: 60,
            sortable: true,
            dataIndex: 'estado',
            renderer: modificarEstado,
            hidden: true
        }, {
            header: perfil.etiquetas.lbAprobado,
            width: 60,
            sortable: true,
            tooltip: 'Aprobado',
            dataIndex: 'idaprobacion',
            renderer: modificarEstadoAprobacion,
            hidden: false
        }, {
            header: perfil.etiquetas.lbNivPlanif,
            width: 65,
            sortable: true,
            dataIndex: 'nivel',
            tooltip: 'Nivel de planificación',
            renderer: modificarEstado
        }, {
            header: perfil.etiquetas.lbNivel,
            width: 60,
            sortable: true,
            dataIndex: 'nivelarbol',
            tooltip: 'Nivel',
            renderer: modificarNivel
        }, {
            header: perfil.etiquetas.lblbFlete,
            width: 80,
            sortable: false,
            dataIndex: 'flete',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbContingencia,
            width: 80,
            sortable: false,
            dataIndex: 'contingencia',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNaturaleza,
            width: 80,
            sortable: false,
            dataIndex: 'naturaleza',
            tooltip: 'Naturaleza',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbViaAdquisicion,
            width: 80,
            sortable: false,
            renderer: renderDenomviaadquisicion,
            dataIndex: 'denomviaadquisicion',
            tooltip: 'Vía de Adquisición',
            hidden: true

        }, {
            header: perfil.etiquetas.lbOrgansatisface,
            width: 80,
            sortable: false,
            renderer: renderOrgansatisface,
            dataIndex: 'denomorgansatisface',
            tooltip: 'Organo que Satisface',
            hidden: true
        }, {
            header: perfil.etiquetas.lbPais,
            width: 80,
            sortable: false,
            dataIndex: 'denompais',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPlanDirecto,
            width: 80,
            sortable: false,
            renderer: renderPlandirecto,
            dataIndex: 'idmodelo',
            tooltip: 'Plan Directo',
            hidden: true
        }, {
            header: perfil.etiquetas.lbEnUso,
            width: 60,
            sortable: true,
            dataIndex: 'uso',
            renderer: modificarUso,
            hidden: true
        }]);

    // Filtros para cada columna de indicadores
    filtrosindicadores = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'listado',
                dataIndex: 'denoum',
                idcombo: 'cbFiltroUM',
                urlcb: 'cargarUM',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stCmbUM,
                autoload: true,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'coeficiente'
            }, {
                type: 'listado',
                dataIndex: 'denocentrobalance',
                idcombo: 'cbFiltroCB',
                urlcb: 'listarCentroBalance',
                idstore: 'stcbFiltroCb',
                valueFieldcb: 'identidaddatosnomenclador',
                displayFieldcb: 'denom',
                width: 200,
                autoload: true,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>'
                        
            }, {
                type: 'boolean',
                dataIndex: 'estado'
            }, {
                type: 'boolean',
                dataIndex: 'idaprobacion'
            }, {
                type: 'boolean',
                dataIndex: 'nivel'
            }, {
                type: 'list',
                dataIndex: 'nivelarbol',
                options: [{
                        idnivelarbol: 1,
                        nivelarbol: perfil.etiquetas.lbGenérico
                    },
                    {
                        idnivelarbol: 2,
                        nivelarbol: perfil.etiquetas.lbSubgenérico
                    },
                    {
                        idnivelarbol: 3,
                        nivelarbol: perfil.etiquetas.lbEspecífico
                    },
                    {
                        idnivelarbol: 4,
                        nivelarbol: perfil.etiquetas.lbSurtido
                    }],
                id: 'idnivelarbol',
                labelField: 'nivelarbol'
            }, {
                type: 'numeric',
                dataIndex: 'flete'
            }, {
                type: 'numeric',
                dataIndex: 'contingencia'
            }, {
                type: 'listado',
                dataIndex: 'denompais',
                idcombo: 'cbFiltroPaises',
                urlcb: 'listarPaises',
                valueFieldcb: 'idpais',
                displayFieldcb: 'nombrepais',
                st: stCmbPaises,
                autoload: true,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'denomviaadquisicion',
                idcombo: 'cbviaadquisicion',
                urlcb: 'listarViaadquisicion',
                valueFieldcb: 'idviaadquisicion',
                displayFieldcb: 'denominacion',
                st: stCmbViaAdq,
                autoload: true,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }, {
                type: 'string',
                dataIndex: 'denomorgansatisface'
            }, {
                type: 'listado',
                dataIndex: 'naturaleza',
                idcombo: 'cbFiltroNaturaleza',
                urlcb: 'listarNaturaleza',
                valueFieldcb: 'naturaleza',
                displayFieldcb: 'denominacion',
                st: stCmbNaturaleza,
                autoload: true,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }, {
                type: 'listado',
                dataIndex: 'idmodelo',
                idcombo: 'cbplandirectofiltro',
                urlcb: 'listarTodosPlanes',
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                st: stCmbPlandirecto,
                autoload: true,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }, {
                type: 'boolean',
                dataIndex: 'uso'
            }]
    });

    stCbPaginado = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });

    //combo del modo donde muestro la cantidad de elementos por paginas del grid
    cbPaginado = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 55,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('pgTreeGrid').pageSize = record.data.idnumpag;
                Ext.getCmp('pgTreeGrid').doLoad(Ext.getCmp('pgTreeGrid').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });

    // DefiniciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de la seleccion de elementos de indicadores
    smGpGest = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(x, y, w) {
                habilitarModificar(true);
                (trEnt.getSelectionModel().getSelectedNode() && !Ext.getCmp('ckasociado').getValue()) ? Ext.getCmp('btnasociar').show() : Ext.getCmp('btnasociar').hide();
                (trEnt.getSelectionModel().getSelectedNode() && Ext.getCmp('ckasociado').getValue()) ? Ext.getCmp('btnquitarasociar').show() : Ext.getCmp('btnquitarasociar').hide();
                if (w.data.idaprobacion >= 3 || idejercicioactual != cbEjercicio.getValue()) {
                    btnMod.disable();
                }
                if (smGpGest.getSelected().data.idaprobacion != 4 || idejercicioactual != cbEjercicio.getValue()) {
                    btnAct.disable();
                }
                else {
                    btnAct.enable();
                }
                if (smGpGest.getSelected().data.uso != 1 || idejercicioactual != cbEjercicio.getValue()) {
                    Ext.getCmp('btnVerIndicadoresUso').disable();
                } else {
                    Ext.getCmp('btnVerIndicadoresUso').enable();
                }
                if (idejercicioactual == cbEjercicio.getValue()) {
                if (smGpGest.getSelected().data.estado == 1) {
                    btnDes.enable();
                    btnAct.disable();
                }
                else {
                    btnDes.disable();
                    btnAct.enable();
                }
                }
                else {
                    btnDes.disable();
                    btnAct.disable();
                }
                if (idejercicioactual == cbEjercicio.getValue()) {
				if (w.data.nivelarbol == 4)
                    Ext.getCmp('btnaddih').disable();
                else
                    Ext.getCmp('btnaddih').enable();
                }
                else
                    Ext.getCmp('btnaddih').disable();

                Ext.getCmp('btnAdd').disable();



            },
            rowdeselect: function(s, n, r) {
                if (idejercicioactual == cbEjercicio.getValue()) {
                if (smGpGest.getSelections().length == 0)
                    habilitarModificar(false);
                else
                    habilitarModificar(true);
                }
                else
                    habilitarModificar(false);
                if (idejercicioactual == cbEjercicio.getValue())
                Ext.getCmp('btnAdd').enable();
            }
        }
    });

	fpCoeficiente = new Ext.FormPanel({
        id: 'fpCoeficiente',
        autoHeight: true,
        width: 400,
        height: 2000,
        frame: true,
        labelAlign: 'top',
        items: [
                {
                layout: 'column',
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [Coeficientec]
                    }
                ]
            }
            

        ]
    });
	winCalcularcoeficiente = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        width: 180,
        height: 1000,
        title: 'Aplicar coeficiente',
        autoHeight: true,
        items: fpCoeficiente,
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                tooltip: 'Cancelar',
                tabIndex: 33,
                text: 'Cancelar',
                handler: function() {
                  	Ext.getCmp('Coefic').reset();
					winCalcularcoeficiente.hide();
                }
            },{
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                tooltip: 'Aceptar el coeficiente',
                tabIndex: 33,
                text: 'Aceptar',
                handler: function() {
                    CalcularCoeficiente();
                }
            }]
    });

    // Grid para los indicadores
    gpGest = new Ext.ux.maximgb.treegrid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        title: perfil.etiquetas.lbSinFiltradoTitle,
        store: stGpGest,
        master_column_id: 'columncodigo',
        sm: smGpGest,
        region: 'center',
        root_title: perfil.etiquetas.lbGpRootTitle,
        autoExpandColumn: 'expandir',
        stripeRows: true,
        cm: cmGpGest,
        bbar: new Ext.ux.maximgb.treegrid.PagingToolbar({
            pageSize: 20,
            store: stGpGest,
            displayInfo: true,
            items: ['-', btnLimpiarIndicadores, '-', {
                    xtype: 'tbtext',
                    text: 'Resultados por p&aacute;gina : '
                }, cbPaginado],
            id: 'pgTreeGrid'
        }),
        md: new Ext.menu.Menu({// Menu de clic derecho para los elementos seleccionados
            id: 'md',
            items: [{
                    text: perfil.etiquetas.lbTtbtnAddHijo,
                    icon: perfil.dirImg + 'adicionar.png',
                    iconCls: 'btn',
                    id: 'btnaddih',
                    handler: function() {
                        add = true;
                        addhijo = true;
                        accion_ind = 'addhijo';
                        if (winFpGest) {
                            Ext.getCmp('btnaplicar').show();
                        }
                        validar()
                    }
                }, {
                    text: perfil.etiquetas.lbCalcoeficiente,
                    icon: perfil.dirImg + 'adicionar.png',
                    iconCls: 'btn',
                    id: 'calcoeficiente',
                    handler: function() {
                     winCalcularcoeficiente.show();
                    }
                },{
                    text: perfil.etiquetas.lbAsociar,
                    icon: perfil.dirImg + 'adicionar.png',
                    iconCls: 'btn',
                    id: 'btnasociar',
                    handler: function() {
                        asociarIndicador(1);
                    }
                }, {
                    text: perfil.etiquetas.lbEliminarAsoc,
                    icon: perfil.dirImg + 'adicionar.png',
                    iconCls: 'btn',
                    id: 'btnquitarasociar',
                    handler: function() {
                        asociarIndicador(0);
                    }
                }, {
                    text: perfil.etiquetas.lbNivelPlanif,
                    icon: perfil.dirImg + 'definir.png',
                    iconCls: 'btn',
                    id: 'btndefinirnivel',
                    handler: function() {
                        accion_ind = 'definirnivel';
                        control = 1;
                        validar();
                    }
                }, {
                    text: perfil.etiquetas.lbEliminarNivelPlanif,
                    icon: perfil.dirImg + 'definir.png',
                    iconCls: 'btn',
                    id: 'btnquitarnivel',
                    handler: function() {
                        accion_ind = 'quitarnivel'
                        control = 1;
                        validar();
                    }
                }, {
                    text: 'Ver Indicadores en uso',
                    icon: perfil.dirImg + 'ver.png',
                    iconCls: 'btn',
                    id: 'btnVerIndicadoresUso',
                    handler: function() {
                        verIndicadorEnUso();
                    }
                }]
        }),
        plugins: filtrosindicadores,
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                gpGest.getSelectionModel().selectRow(r);
                validarMenu();// funcion para ver que muestro
                gpGest.md.showAt(e.getXY());
            }
        }
    });
    // fin----- definicion del grid de indicadores

    // View port para la interfaz
    
    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'border',
            id: 'idpanel',
            items: [pMultiEnt, gpGest],
            tbar: [btnAdd, btnMod, btnDel, btnAct, btnDes,
                btnExportar, btnAprobar, btnDesaprobar, {
                    xtype: 'checkbox',
                    hidden: true,
                    id: 'ckasociado',
                    listeners: {
                        check: function() {
                            smGpGest.clearSelections();
                            stGpGest.reload({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });
                        }
                    }
                }, {
                    xtype: 'tbbutton',
                    hidden: true,
                    id: 'btnasociado',
                    text: perfil.etiquetas.lbMostrarAsociacion,
                    handler: function() {
                        if (Ext.getCmp('ckasociado').getValue() == true)
                            Ext.getCmp('ckasociado')
                                    .setValue(false)
                        else
                            Ext.getCmp('ckasociado').setValue(true)
                    }
                }, btnMultEnt, '-', 'Ejercicio:', cbEjercicio, '->', btnAyu]
        })
    });
       
   btnAyu.focus();
   cbOrganoSatisface = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        fieldLabel: perfil.etiquetas.lbOrgansatisface,
        displayField: 'denominacion',
        disabled: true,
        id: 'cbOrganoSatisface',
        valueField: 'idorganosatisface',
        store: stCmbOrganoS,
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'organoSatisface',
        triggerAction: 'all',
        editable: true,
        allowBlank: false,
        listWidth: 350,
        anchor: '95%',
        mode: 'local',
        emptyText: perfil.etiquetas.lbSeleccione,
		listeners: {
			change : function( field,newValue,oldValue ){
			modoace = true;
			}
		}
    });

    cbPlandirecto = new Ext.form.ComboBox({
        emptyText: perfil.etiquetas.lbSeleccione,
        id: 'cbplandirecto',
        anchor: '95%',
        tabIndex: 20,
        displayField: 'denominacion',
        valueField: 'idmodelo',
        hiddenName: 'idmodelo',
        loadingText: perfil.etiquetas.lbCargando,
        store: stCmbPlandirecto,
        mode: 'remote',
        typeAhead: true,
        autoload: true,
        forceSelection: true,
        triggerAction: 'all',
        fieldLabel: perfil.etiquetas.lbPlanDirecto,
		listeners: {
			change : function( field,newValue,oldValue ){
			modoace = true;
			}
		}
    });

    cbpais = new Ext.form.ComboBox({
        emptyText: perfil.etiquetas.lbSeleccione,
        id: 'cbpais',
        anchor: '95%',
        tabIndex: 20,
        displayField: 'nombrepais',
        valueField: 'idpais',
        hiddenName: 'idpais',
        allowBlank: false,
        store: stCmbPaises, 
        mode: 'local',
        typeAhead: true,
        forceSelection: true,
        triggerAction: 'all',
        fieldLabel: perfil.etiquetas.lbPais,
		listeners: {
			change : function( field,newValue,oldValue ){
			modoace = true;
			}
		}
    });
    cbum = new Ext.form.ComboBox({
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        id: 'cbum',
        tabIndex: 22,
        anchor: '95%',
        displayField: 'denominacionunidadmedida',
        valueField: 'idunidadmedida',
        hiddenName: 'idunidadmedida',
        allowBlank: false,
        listWidth: 180,
        store: stCmbUM, 
        mode: 'local',
        typeAhead: true,
        forceSelection: true,
        triggerAction: 'all',
        fieldLabel: perfil.etiquetas.lbUM,
		listeners: {
			change : function( field,newValue,oldValue ){
			modoace = true;
			}
		}
    });
    cbnaturaleza = new Ext.form.ComboBox({
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        id: 'cbnaturaleza',
        tabIndex: 24,
        anchor: '95%',
        //readOnly : true,
        editable: false,
        displayField: 'denominacion',
        valueField: 'naturaleza',
        hiddenName: 'naturaleza',
        allowBlank: false,
        store: stCmbNaturaleza, 
        mode: 'local',
        triggerAction: 'all',
        fieldLabel: perfil.etiquetas.lbNaturaleza,
		listeners: {
			change : function( field,newValue,oldValue ){
			modoace = true;
			}
		}
        
    });
   

    cbcentrobalance = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        fieldLabel: perfil.etiquetas.lbCentroBalance,
        id: 'cbcentrobalance',
        displayField: 'denom',
        valueField: 'identidaddatosnomenclador',
        store: stCmbCentroB, 
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'idcentrobalance',
        triggerAction: 'all',
        editable: true,
        allowBlank: false,
        enableQtip: true,
        listWidth: 300,
        anchor: '95%',
        mode: 'local',
        tabIndex: 17,
        emptyText: perfil.etiquetas.lbSeleccione,

        listeners: {
            select: function(t, r, i) {
                if (gpGest.getSelectionModel().getSelected() != undefined) {
                    if (addhijo && gpGest.getSelectionModel().getSelected().data.nivelarbol == 2)
                        cbcentrobalance.setValue(stCmbCentroB.getAt(i).data.identidaddatosnomenclador);
                    else if (gpGest.getSelectionModel().getSelected().data.nivelarbol > 2)
                        cbcentrobalance.setValue(stCmbCentroB.getAt(i).data.identidaddatosnomenclador);
                }
            },
			change: function( field,newValue,oldValue ){
				modoace = true;
			}
        }
    });
    cbviaadquisicion1 = new Ext.form.ComboBox({
        xtype: 'combo',
        fieldLabel: perfil.etiquetas.lbVíaAdq,
        id: 'cbviaadquisicion1',
        displayField: 'denominacion',
        valueField: 'idviaadquisicion',
        store: stCmbViaAdq, 
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'idviaadquisicion',
        triggerAction: 'all',
        editable: true,
        allowBlank: false,
        listWidth: 300,
        anchor: '95%',
        mode: 'local',
        tabIndex: 17,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function(t, r, i) {
                                        
                    cbOrganoSatisface.enable();
                    cbOrganoSatisface.reset();
                    stCmbOrganoS.reload({
                        params: {
                            via: cbviaadquisicion1.getValue()
                        }
                    });
                    Ext.getCmp('contingencia').reset();
                    Ext.getCmp('flete').reset();
                    if (cbviaadquisicion1.getValue()==3) {
                        Ext.getCmp('contingencia').enable();
                        Ext.getCmp('flete').enable();
                    }
                    else {
                        Ext.getCmp('contingencia').disable();
                        Ext.getCmp('flete').disable();
                        
                    }
                    

            },
			change : function( field,newValue,oldValue ){
				modoace = true;
			}
        }
    });


    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ii',
            alt: true,
            fn: function() {
                if (!btnAdd.hidden ) {
                    if (!btnAdd.disabled) {
						ventana = true;
                        accionBotonAdicionar();
                    }
                }
            }
        }
        ,
        {
            key: 'Mm',
            alt: true,
            fn: function() {
                if (!btnMod.hidden ) {
                    if (!btnMod.disabled && auxdel == false && auxdesact == false) {
						ventana =true;
                        accion_ind = 'mod';
                        control = 1;
                        validar()
                    }
                }
            }
        }
        ,
        {
            key: 46,
            fn: function() {
                if (!btnDel.hidden ) {
                    if(ventana == false ){
						if(!btnDel.disabled && auxdesact == false){
						accion_ind = 'del'
                        control = 1;
                        validar();
						}
					}else{
						if(!btnDel.disabled && winFpGest.hidden && auxdesact == false){
						accion_ind = 'del'
                        control = 1;
                        validar();
						}
					}
                       
                    }
                }
            }
        ,
        {
            key: 'Xx',
            alt: true,
            fn: function() {
					if(ventana == false ){
					 if (!btnAct.hidden && auxdel == false ) {
					 if (!btnAct.disabled) {
                        accion_ind = 'act'
                        control = 1;
                        validar();
                    }
					}
					}else{
					 if (!btnAct.hidden && winFpGest.hidden && auxdel == false ) {
						if (!btnAct.disabled) {
                        accion_ind = 'act'
                        control = 1;
                        validar();
                    }
                }
					}
               
            }
        },
        {
            key: 'Ff',
            alt: true,
            fn: function() {
                if (!btnDes.hidden && (ventana == false || winFpGest.hidden) && auxdel == false ) {
                    if (!btnDes.disabled) {
                        accion_ind = 'desact'
                        control = 1;
                        validar();
                    }

                }
            }
        }
        ,
        {
            key: 'Qq',
            alt: true,
            fn: function() {
                if (!btnAprobar.hidden && winFpGest.hidden  && auxdel == false && auxdesact == false) {
                    if (!btnAprobar.disabled) {
                        accion_ind = 'aprob'
                        control = 1;
                        validar();
                    }

                }
            }
        },
        {
            key: 'Ww',
            alt: true,
            fn: function() {
                if (!btnDesaprobar.hidden && winFpGest.hidden  && auxdel == false && auxdesact == false) {
                    if (!btnDesaprobar.disabled) {
                        accion_ind = 'desaprob'
                        control = 1;
                        validar();
                    }

                }
            }
        }
        ,
        {
            key: 'Ee',
            alt: true,
            fn: function() {
                if (!btnExportar.hidden && winFpGest.hidden && auxdel == false && auxdesact == false) {
                    if (!btnExportar.disabled)
                        exportarindicadores();

                }

            }
        }
        ,
        {
            key: 'Hh',
            alt: true,
            fn: function() {
               if (!btnAyu.hidden) {
						mostrarAyuda('Indicadores');
					if(ventana == false ){
						if(!btnAyu.disabled && auxdesact == false){
							mostrarAyuda('Indicadores');
						}
					}else{
						if(!btnAyu.disabled && winFpGest.hidden && auxdesact == false){
							mostrarAyuda('Indicadores');
						}
					}
				}	
			}         
        }
		,
        {
            key: 'Ll',
            alt: true,
            fn: function() {
                if (!btnLimpiarIndicadores.hidden && winFpGest.hidden && auxdel == false && auxdesact == false) {
                    if (!btnLimpiarIndicadores.disabled)
                        limpiarfiltros();

                }

            }
        }

    ]);
    mymask.show();
    cargaInicial();
}
// Endof cargarInterfaz
function cargaInicial() {
    Ext.Ajax.request({
        url: 'cargaInicial',
        callback: function(options, success, response) {
            objci = Ext.decode(response.responseText);
            if (!objci.codMsg) {
                objci.acciones = [];
                UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
                    for (i in acciones_reportes) {
                        objci.acciones[acciones_reportes[i].abreviatura] = true;
                    }
                    if (objci.acciones.rector)// organo rector
                    {
                        btnDel.show();
                        Ext.getCmp('cbFiltroCB').enable();
                        Ext.getCmp('btnAdd').enable();
                        stGpGest.reload({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                    } else if (objci.compEntidad == null) {
                        Ext.getBody().mask(perfil.etiquetas.msgSinPermisos);
                    } else {
                        Ext.getCmp('cbFiltroCB').setValue(objci.compEntidad);
                        Ext.getCmp('cbFiltroCB').disable();
                        // Event
                        Ext.getCmp('btnAdd').disable();
                        stGpGest.reload({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                    }
                    mymask.hide();
                })
            } else if (objci.codMsg == 21) {
                mostrarMensaje(3, perfil.etiquetas.msgNoFormatoInd)
            } else {
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
            }


        }
    });
}

function validarMenu() {
    var contact = 0;
    var nivelincorrecto = 0;
    var nivelcorrecto = 0;
    var nivelcorrectosindefnivel = 0;
    var contdesact = 0;
    if (smGpGest.getSelections().length == 1) {
        if (objci.acciones.rector)// Es rector siempre ver
            Ext.getCmp('btnaddih').setVisible(true);
        else // Comprobar que el nivel sea mayor que 1
        if (gpGest.getSelectionModel().getSelected().data.nivelarbol > 1)
            Ext.getCmp('btnaddih').setVisible(true);
        else
            Ext.getCmp('btnaddih').setVisible(false);

        if (gpGest.getSelectionModel().getSelected().data.nivelarbol > 2 )
        {
            
            if (gpGest.getSelectionModel().getSelected().data.nivel == 0) {
                Ext.getCmp('btnquitarnivel').setVisible(false);
                Ext.getCmp('btndefinirnivel').setVisible(true);
            } else {
                Ext.getCmp('btndefinirnivel').setVisible(false);
                Ext.getCmp('btnquitarnivel').setVisible(true);
            }
            
        }
        else {
            Ext.getCmp('btndefinirnivel').setVisible(false);
            Ext.getCmp('btnquitarnivel').setVisible(false);
        }
    } else {
        Ext.getCmp('btnVerIndicadoresUso').disable();
        for (j = 0; j < smGpGest.getSelections().length; j++) {
            if (smGpGest.getSelections()[j].data.nivel == 1)
                contact++;
            else
                contdesact++;
            if (smGpGest.getSelections()[j].data.nivelarbol <= 2)
                nivelincorrecto++;

            else {
                nivelcorrecto++;
                if (smGpGest.getSelections()[j].data.nivel == 0)
                    nivelcorrectosindefnivel++;
            }

        }
        if (nivelincorrecto == 0) {
            if (contact == 0) {
                Ext.getCmp('btndefinirnivel').setVisible(true);
                Ext.getCmp('btnquitarnivel').setVisible(false);
            }
            else {
                if (contdesact == 0) {
                    Ext.getCmp('btnquitarnivel').setVisible(true);
                    Ext.getCmp('btndefinirnivel').setVisible(false);
                }
                else {
                    Ext.getCmp('btndefinirnivel').setVisible(true);
                    Ext.getCmp('btnquitarnivel').setVisible(true);
                }
            }
        }
        else {
            if (nivelcorrecto == 0) {
                Ext.getCmp('btndefinirnivel').setVisible(false);
                Ext.getCmp('btnquitarnivel').setVisible(false);

            }
            else {
                if (nivelcorrectosindefnivel == nivelcorrecto) {
                    Ext.getCmp('btndefinirnivel').setVisible(true);
                    Ext.getCmp('btnquitarnivel').setVisible(false);
                }
                else {
                    if (nivelcorrectosindefnivel == 0) {
                        Ext.getCmp('btndefinirnivel').setVisible(false);
                        Ext.getCmp('btnquitarnivel').setVisible(true);
                    }
                    else {
                        Ext.getCmp('btndefinirnivel').setVisible(true);
                        Ext.getCmp('btnquitarnivel').setVisible(true);
                    }
                }
            }
        }
        Ext.getCmp('btnaddih').setVisible(false);
    }
    if( gpGest.getSelectionModel().getSelected().data.idaprobacion>2){
         Ext.getCmp('btndefinirnivel').setVisible(false);
                    Ext.getCmp('btnquitarnivel').setVisible(false);
    }
}


function organosQueSatisface() {
    var cadena = '';
    var conteo = 0;
    var conteo1 = 0;
    var arreglo = [];
    for (i = 0; i < gpGest.getSelectionModel().getSelected().data.DatIndicadorviaadquisicion.length; i++)
        if (gpGest.getSelectionModel().getSelected().data.DatIndicadorviaadquisicion[i] != undefined)
            for (j = 0; j < gpGest.getSelectionModel().getSelected().data.DatIndicadorviaadquisicion[i].DatIndicadorviaadquisicionorganosatisface.length; j++)
                arreglo.push(gpGest.getSelectionModel().getSelected().data.DatIndicadorviaadquisicion[i].DatIndicadorviaadquisicionorganosatisface[j].idorganosatisface);
var pos = 0;
    for (a in arreglo) {
        if (pos > 0)
            cadena = cadena + ',' + arreglo.pop();
        else
            cadena = arreglo.pop();
        pos++;
    }
    return cadena;
}

function renderUM(value) {
    return getRawValue(value, Ext.getCmp('cbum'));
}

function renderPais(value) {
    return getRawValue(value, cbpais);
}
function renderDenomviaadquisicion(value) {
    if (value == null)
        return '-';
    else
        return value; 
}
function renderOrgansatisface(value) {
    if (value == null)
        return '-';
    else
        return value;
}

function renderPlandirecto(val, x, rec) {
    if (val == null)
        return '-';
    else
        return rec.data.denmodelo;
}

function renderNopieza(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value == "" || value == null)
        return '-';
    else
        return value;
}
function renderCB(value) {
    return getRawValue(value, Ext.getCmp('cbFiltroCB'));// Ext.getCmp('cbcentrobalance')
}

function getRawValue(v, cmb) {
    var arrid = (v != null) ? v.split(",") : '';
    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
                ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
                : '');
        for (var j = 1; j < arrid.length; j++) {
            str += ((cmb.store.find(cmb.valueField, arrid[j]) != -1) ? ','
                    + cmb.store.getAt(cmb.store.find(cmb.valueField,
                            arrid[j])).data[cmb.displayField] : '');
        }
    }
    return str;
}

function cambiarEstado(e) {
    var aux = smGpGest.getSelections();
    for (pos in aux) {
        if (aux[pos].data) {
            if ((!objci.acciones.rector)
                    && (aux[pos].data.nivelarbol < 3 || aux[pos].data.idaprobacion > 3)) {
                mostrarMensaje(1, perfil.etiquetas.msg3 + aux[pos].data.denominacion
                        + perfil.etiquetas.msg4);
                aux[pos] = '';
            }
        }
    }
    var arreglo = [];
    for (pos in aux) {
        if (aux[pos].id)
            arreglo.push([aux[pos].id, aux[pos].data.idarbol, aux[pos].data.ordender, aux[pos].data.ordenizq, aux[pos].data.idaprobacion]);
    }
    if (arreglo.length > 0) {
        function cambiar() {
                mymask.show();
                Ext.Ajax.request({
                    url: 'activar',
                    params: {
                        idindicador: Ext.encode(arreglo),
                        estado: e
						},
                    method: 'POST',
                    callback: function(options, success, response) {
                        mymask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgM == 1) {
                            if (e == 1)
                                mostrarMensaje(1, perfil.etiquetas.msgExitoActivado);
                            else
                                mostrarMensaje(1, perfil.etiquetas.msgExitoDesactivado);
                        }
                        else if ((responseData.codMsgM == 25)) {
                            if (e == 1)
                                mostrarMensaje(1, perfil.etiquetas.msgErrorActivar);
                            else
                                mostrarMensaje(1, perfil.etiquetas.msgErrorDesactivar);
                        }
                        anode = smGpGest.getSelected().data._parent;
                        smGpGest.clearSelections();
                        gpGest.getStore().reload();
                        control = 0;
                    }
                });
			auxdesact = false;
        }
        if (e == 1){
		auxdesact = true;
                cambiar();
		}
        else{
		auxdesact = true;
                cambiar();
		}
           
    }
}

function cambiarEstadoAprobacion(estadoAprobacion) {
    var aux = smGpGest.getSelections();
    for (pos in aux) {
        if (aux[pos].data) {
            if ((!objci.acciones.rector) && (aux[pos].data.nivelarbol < 3 || aux[pos].data.idaprobacion > 3)) {

                mostrarMensaje(1, perfil.etiquetas.msg3 + aux[pos].data.denominacion
                        + perfil.etiquetas.msg4);
                aux[pos] = '';
            }
        }
    }

    var arreglo = [];
    for (pos in aux) {
        if (aux[pos].id) {
            arreglo.push([aux[pos].id, aux[pos].data.idarbol, aux[pos].data.ordender, aux[pos].data.ordenizq, aux[pos].data.idaprobacion]);
        }

    }
    if (arreglo.length > 0) {
        function cambiar() {
                if (estadoAprobacion == 3 && objci.acciones.rector)
                    estadoAprobacion = 4;
                mymask.show();
                Ext.Ajax.request({
                    url: 'gestionarAprobacion',
                    timeout: 7200000, //max 2horas
                    params: {
                        idindicador: Ext.encode(arreglo),
                        idaprobacion: estadoAprobacion
                    },
                    method: 'POST',
                    callback: function(options, success, response) {
                        mymask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgM == 1) {
                            if (estadoAprobacion == 3 || estadoAprobacion == 4)
                                mostrarMensaje(1, perfil.etiquetas.msgEstadoAprobado);
                            else
                                mostrarMensaje(1, perfil.etiquetas.msgEstadoDesaprobado);
                        }
                        else if (responseData.codMsgM == 21) {
                            mostrarMensaje(3, perfil.etiquetas.msgNoAprobarEnUso);
                        }
                        else {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                        }
                        anode = smGpGest.getSelected().data._parent;
                        smGpGest.clearSelections();
                        gpGest.getStore().reload();
                        control = 0;
                    }
                });
        }
        if (estadoAprobacion == 3){
        cambiar();
		}
		else{
                cambiar();
		}
           
    }

}


function detallesIndicador(indicadores) {

    mymask.show();
    Ext.Ajax.request({
        url: 'validarUsoIndicadorDesp',
        params: {
            idindicador: Ext.encode(indicadores)
        },
        callback: function(options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 21) {
                Ext.MessageBox.buttonText.yes = "Detalles";
                Ext.MessageBox.buttonText.no = "Continuar";
                Ext.MessageBox.buttonText.cancel = "Cancelar";
                Ext.MessageBox.show({
                    title: 'Advertencia',
                    msg: perfil.etiquetas.msgAlertuso,
                    buttons: Ext.MessageBox.YESNOCANCEL,
                    fn: mostrarDetalles,
                    icon: Ext.MessageBox.INFO
                });
            } else
                Mod();
        }
    })
}



function longnivel(n, f) {
    mymask.show();
    Ext.Ajax.request({
        url: 'longNivel',
        params: {
            nivel: n,
            idformato: f
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData) {
                if (responseData.codMsg == 20) {
                    Ext.getCmp('codigo').maxLength = responseData.longitud;
                    Ext.getCmp('codigo').minLength = responseData.longitud;
                    Ext.getCmp('codigo').minLengthText = perfil.etiquetas.msgTamañoCodigo + responseData.longitud + perfil.etiquetas.msgTamañoCodigo1;
                    Ext.getCmp('codigo').maxLengthText = perfil.etiquetas.msgTamañoCodigo + responseData.longitud + perfil.etiquetas.msgTamañoCodigo1;
                    Ext.getCmp('digitos').setValue(responseData.longitud);
                    if (responseData.longitud <= 0)
                        mostrarMensaje(1,
                                perfil.etiquetas.msgOtroNivel,
                                function() {
                                    winFpGest.hide();
                                });
                } else {
                    mostrarMensaje(3,
                            perfil.etiquetas.msgErrorAction);
                    fpGest.destroy();
                    winFpGest.hide();
                }
            }

        }
    });
}

function asociarIndicador(t) {
    if (t == 1) {
        mostrarMensaje(2, perfil.etiquetas.msgSeguroAsociar, asociar);
    } else {
        mostrarMensaje(2, perfil.etiquetas.msgSeguroDesasociar, asociar);
    }
    function asociar(btnPresionado) {
        if (btnPresionado == 'ok') {
            mymask.show();
            Ext.Ajax.request({
                url: 'asociarIndEntidad',
                params: {
                    idindicador: smGpGest.getSelected().id,
                    asociacion: t,
                    identidad: trEnt.getSelectionModel().getSelectedNode().id
                },
                method: 'POST',
                callback: function(options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(1, responseData.mensaje);
                    } else
                        mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                    gpGest.getStore().reload({
                        params: {
                            anode: smGpGest.getSelected().data._parent
                        }
                    });
                }
            });
        }
    }
}

function nivelPlanificacion(t) {
    if (t == 0) {
        mostrarMensaje(2, perfil.etiquetas.msgNivelPlanif, nivelPlanif);
    } else {
        mostrarMensaje(2, perfil.etiquetas.msgEliminarNivelPlanif,
                nivelPlanif);
    }
    function nivelPlanif(btnPresionado) {
        if (btnPresionado == 'ok') {
            mymask.show();
            var arreglo = smGpGest.getSelections();
            var indicadores = [];
            for (var i = 0; arreglo.length > i; i++) {
                indicadores.push(arreglo[i].data);
            }
            Ext.Ajax.request({
                url: 'definirnivelPLanificacion',
                params: {
                    idindicadores: Ext.encode(indicadores),
                    bandera: 1,
                    defnivel: t
                },
                method: 'POST',
                callback: function(options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        if (responseData.codMsgM == 1) {
                            if (t == 0)
                                mostrarMensaje(1, perfil.etiquetas.msgDefinirNivP);
                            else
                                mostrarMensaje(1, perfil.etiquetas.msgEliminarNivP);
                            parent = gpGest.getStore().getRootNodes();
                        } else if (responseData.codMsgM == 22) {
                            if (t == 0) {
                                mostrarMensaje(3, perfil.etiquetas.msgErrorDefinirNPUso);
                                gpGest.getStore().reload({});
                            }
                            else
                                mostrarMensaje(3, perfil.etiquetas.msgErrorNivelUso);
                        }
                        else if (responseData.codMsgM == 23) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorRama);
                        }
                        else {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
							}
                    }
                    else {
                        mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                    }
                    anode = smGpGest.getSelected().data._parent;
                    smGpGest.clearSelections();
                    gpGest.getStore().reload({
                        params: {
                            anode: anode
                        }
                    });
                    control = 0;
                }
            });
        }
    }
}
/**/
function winAddIndicador() {
    fpGest = new Ext.FormPanel({
        id: 'fpGest',
        enableKeyEvents: true,
        frame: true,
        autoHeight: true,
        autoWidth: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 0.25,
                        layout: 'form',
                        items: [{
                                xtype: 'combo',
                                tabIndex: 16,
                                emptyText: perfil.etiquetas.lbSeleccione,
                                loadingText: perfil.etiquetas.lbCargando,
                                id: 'cbformato',
                                disabled: true,
                                anchor: '95%',
                                readOnly: true,
                                displayField: 'nombre',
                                valueField: 'idformato',
                                hiddenName: 'idformato',
                                allowBlank: false,
                                listeners: {
                                    select: function(c, r, i) {
                                        longnivel((smGpGest.getSelected() && addhijo) ? Number(gpGest.getSelectionModel().getSelected().data.nivelarbol) + 1 : 1, r.data.idformato);
                                        if (smGpGest.getSelected() && addhijo) {
                                            Ext.getCmp('nivel').setValue(gpGest
                                                    .getStore().getNodeDepth(smGpGest
                                                    .getSelected())
                                                    + 1);
                                            Ext.getCmp('padre').setValue(smGpGest
                                                    .getSelected().data.codigo);
                                        } else {
                                            Ext.getCmp('nivel').setValue(1);
                                            Ext.getCmp('padre').setValue();
                                        }
                                    },
									change : function( field,newValue,oldValue ){
										modoace = true;
									}
                                },
                                store: stCmbFormato,
                                mode: 'local',
                                triggerAction: 'all',
                                fieldLabel: 'Formato'
                            }, {
                                xtype: 'textfield',
                                id: 'denominacion',
                                tabIndex: 18,
                                fieldLabel: perfil.etiquetas.lbDenominacion,
                                anchor: '95%',
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-])+$/,
	                            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ_-])$/,
                                regexText: 'Sólo admite caracteres alfanuméricos.',
                                maxLength: 255,
                                allowBlank: false,
								listeners: {
									change : function( field,newValue,oldValue ){
										modoace = true;
									}
								}

                            }, {
                                xtype: 'hidden',
                                id: 'idindicador'
                            }, {
                                xtype: 'hidden',
                                id: 'idpadre'
                            }, {
                                xtype: 'hidden',
                                id: 'cod_padre'
                            }]
                    }, {
                        columnWidth: 0.5,
                        layout: 'column',
                        items: [{
                                columnWidth: 1,
                                layout: 'column',
                                items: [{
                                        columnWidth: .5,
                                        layout: 'form',
                                        items: [{
                                                xtype: 'numberfield',
                                                id: 'nivel',
                                                anchor: '95%',
                                                fieldLabel: perfil.etiquetas.lbNivel,
                                                disabled: true,
												listeners: {
												change : function( field,newValue,oldValue){
													modoace = true;
												}
												}
                                            }]
                                    }, {
                                        columnWidth: .5,
                                        layout: 'form',
                                        items: [{
                                                xtype: 'numberfield',
                                                id: 'digitos',
                                                anchor: '95%',
                                                fieldLabel: perfil.etiquetas.lbCantidadDigitos,
                                                disabled: true,
												listeners: {
												change : function( field,newValue,oldValue){
													modoace = true;
												}
												}
                                            }]
                                    }]
                            }, {
                                columnWidth: 1,
                                layout: 'column',
                                items: [{
                                        columnWidth: .5,
                                        layout: 'form',
                                        items: [{
                                                xtype: 'textfield',
                                                id: 'padre',
                                                style: 'text-align:right',
                                                anchor: '95%',
                                                fieldLabel: perfil.etiquetas.lbCodigoPadre,
                                                disabled: true,
												listeners: {
												change : function( field,newValue,oldValue){
													modoace = true;
												}
												}
                                            }]
                                    }, {
                                        columnWidth: .5,
                                        layout: 'form',
                                        items: [{
                                                xtype: 'textfield',
                                                id: 'codigo',
                                                tabIndex: 19,
                                                regex: /^\d+$/,
                                                maskRe: /^\d+$/,
                                                regexText: perfil.etiquetas.lbMsgSoloNum,
                                                anchor: '95%',
                                                fieldLabel: perfil.etiquetas.lbCodigo,
                                                allowBlank: false,
                                                blankText: perfil.etiquetas.lbRequerido,
												listeners: {
												change : function( field,newValue,oldValue){
													modoace = true;
												}
												}
                                            }]
                                    }]
                            }]
                    }, {
                        columnWidth: .25,
                        layout: 'form',
                        items: [cbcentrobalance, cbpais]
                    }, {
                        columnWidth: .25,
                        layout: 'form',
                        items: [{
                                xtype: 'numberfield',
                                id: 'precio',
                                tabIndex: 21,
                                decimalPrecision: 6,
                                anchor: '95%',
                                value: 0,
                                regex: /^([0-9]+[.]*[0-9]*)$/, 
								regexText: "No es un valor correcto.",
                                maxLengthText: perfil.etiquetas.lbTPrecio,
                                maxLength: 19,
                                allowBlank: false,
                                minValue: 0,
                                fieldLabel: perfil.etiquetas.lbPrecio,
								listeners: {
									change : function( field,newValue,oldValue){
										modoace = true;
									}
								}
                            }]
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: [cbum]
                    }, {
                        columnWidth: .25,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                id: 'numeropieza',
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*['"]*(\/)*)*$/,
                                regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales (-, _, ", ' + "'" + " y /).",
                                maxLength: 255,
                                anchor: '95%',
                                fieldLabel: perfil.etiquetas.lbNopieza,
								listeners: {
									change : function( field,newValue,oldValue){
										modoace = true;
									}
								}
                            }]
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: [cbnaturaleza]
                    },{
                        columnWidth: .5,
                        layout: 'column',
                        items: [{
                                columnWidth: .5,
                                layout: 'form',
                                items: [{
                                        xtype: 'numberfield',
                                        id: 'preciodivisa',
                                        decimalPrecision: 6,
                                        anchor: '95%',
                                        value: 0,
                                        regex: /^([0-9.]+ ?[0-9 .]*)+$/,
                                        maxLengthText: perfil.etiquetas.lbTPrecio,
                                        maxLength: 19,
                                        allowBlank: false,
                                        minValue: 0,
                                        fieldLabel: perfil.etiquetas.lbPrecioDiv,
										listeners: {
											change : function( field,newValue,oldValue ){
												modoace = true;
											}
										}
                                    }]
                            }, {
                                columnWidth: .5,
                                layout: 'form',
                                items: [cbviaadquisicion1]
                            }]
                    }, {
                        columnWidth: .25,
                        layout: 'form',
                        items: [{
                                xtype: 'numberfield',
                                id: 'flete',
                                tabIndex: 28,
                                allowBlank: false,
                                value: 0,
                                maxValue: 100,
                                minValue: 0,
                                decimalPrecision: 6,
                                disabled: true,
                                anchor: '95%',
                                validator: function() {
                                    if (Ext.getCmp('flete').getValue() < 0)
                                        return false;
                                    if (Ext.getCmp('contingencia').getValue() + Ext.getCmp('flete').getValue() > 100)
                                        return false;
                                    else
                                        Ext.getCmp('contingencia').clearInvalid();
                                    return true;
                                },
								listeners: {
									change : function( field,newValue,oldValue){
										modoace = true;
									}
								},
                                invalidText: perfil.etiquetas.lbRequerido1,
                                fieldLabel: perfil.etiquetas.lbFleteSeguro + '(%)'
                            }]
                    }, {
                        columnWidth: .25,
                        layout: 'form',
                        items: [{
                                xtype: 'numberfield',
                                tabIndex: 29,
                                id: 'contingencia',
                                allowBlank: false,
                                disabled: true,
                                value: 0,
                                decimalPrecision: 6,
                                maxValue: 101,
                                minValue: 0,
                                anchor: '95%',
                                validator: function() {
                                    if (Ext.getCmp('contingencia').getValue() < 0)
                                        return false;
                                    if (Ext.getCmp('contingencia').getValue() + Ext.getCmp('flete').getValue() > 100)
                                        return false;
                                    else
                                        Ext.getCmp('flete').clearInvalid();
                                    return true;
                                },
								listeners: {
									change : function( field,newValue,oldValue){
										modoace = true;
									}
								},
                                invalidText: perfil.etiquetas.lbRequerido1,
                                fieldLabel: perfil.etiquetas.lbContingencia + '(%)',
                                disabled : true
                            }]
                    }]
            }, {
                columnWidth: 0.1,
                layout: 'column',
                items: [{
                        layout: 'form',
                        columnWidth: .25,
                        items: [cbPlandirecto]
                    }, {
                        layout: 'form',
                        columnWidth: .25,
                        items: [cbOrganoSatisface]
                    }]
            }, {
                xtype: 'textarea',
                id: 'descripcion',
                tabIndex: 30,
                blankText: perfil.etiquetas.lbRequerido,
                anchor: '100%',
                maxLength: 255,
                fieldLabel: perfil.etiquetas.lbDescripcion,
                editable: false,
				listeners: {
					change : function( field,newValue,oldValue){
						modoace = true;
					}
				}
            }]
    });
    winFpGest = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        width: 700,
        constrain: true,
        autoHeight: true,
        items: fpGest,
        listeners:{
            'beforeshow':function()
            {
                Ext.getCmp('denominacion').focus(true,500); 
            }
        },  //botones
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                tooltip: 'Cerrar ventana sin guardar los datos',
                tabIndex: 33,
                text: perfil.etiquetas.lbBtnCancelar,
                handler: function() {
                    winFpGest.hide();
                    cbOrganoSatisface.reset();
                    cbOrganoSatisface.disable();
                    cbOrganoSatisface.clearValue();
                    Ext.getCmp('contingencia').reset();
                    Ext.getCmp('contingencia').disable();
                    Ext.getCmp('flete').reset();
                    Ext.getCmp('flete').disable();
                }
            }, {
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                tooltip: 'Guardar datos y limpiar los campos',
                tabIndex: 32,
                id: 'btnaplicar',
                text: perfil.etiquetas.lbAplicar,
                handler: function() {
                    if (objci.acciones.rector){
                        adicionarindicador(true)}
                   else if (Ext.getCmp('nivel').getValue() > 2){
                        adicionarindicador(true)}
                    else
                        mostrarMensaje(3, perfil.etiquetas.msgNoPermisoNivel);
                    
                }
            }, { 
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                tooltip: 'Guardar datos y cerrar ventana',
                tabIndex: 31,
                id: 'addAdd1',
				text: perfil.etiquetas.lbBtnAceptar,
                handler: function() {
				accion_validar_modificado();
                }
            }]
    });
}


function accion_validar_modificado(){

if(accion_ind == "mod"){
	if(modoace == true){
		  if (objci.acciones.rector){                    
			df = 0;
			   adicionarindicador(false);
			   }
		 else if (Ext.getCmp('nivel').getValue() > 2){
			  adicionarindicador(false);
			   df = 0;
		 } else
				mostrarMensaje(3, perfil.etiquetas.msgNoPermisoNivel); 
	}
	else{
		mostrarMensaje(1, 'Debe realizar al menos una modificación.');  
	}   
} else{         
	if (objci.acciones.rector){                    
		df = 0;
		adicionarindicador(false);
	} else if (Ext.getCmp('nivel').getValue() > 2){
		adicionarindicador(false);
		df = 0;
	} else
		mostrarMensaje(3, perfil.etiquetas.msgNoPermisoNivel);
}
modoace = false;				 
}


function Mod() {
    mymask.show();
    add = false;
    stCmbCentroB.reload({
        params: {
            idpadre: gpGest.getSelectionModel().getSelected().data.idpadre,
            idindicador: gpGest.getSelectionModel().getSelected().data.idindicador
        }
    });
}

function mostrarVenatanaModificar() {
    add = false;
    mensaje = perfil.etiquetas.msgGuardandoModificar;
    addhijo = false;
    if (!winFpGest) {
        winAddIndicador();
    }
    winFpGest.show();
    upFpGest();
    Ext.getCmp('denominacion').setValue(gpGest.getSelectionModel()
            .getSelected().data.denominacion);
    Ext.getCmp('precio')
            .setValue(gpGest.getSelectionModel().getSelected().data.precio);
    Ext.getCmp('preciodivisa')
            .setValue(gpGest.getSelectionModel().getSelected().data.preciodivisa);
    Ext.getCmp('cbplandirecto')
            .setValue(gpGest.getSelectionModel().getSelected().data.idmodelo);
    Ext.getCmp('descripcion').setValue(gpGest.getSelectionModel()
            .getSelected().data.descripcion);
    Ext.getCmp('nivel').setValue(gpGest.getSelectionModel()
            .getSelected().data.nivelarbol);
    (gpGest.getSelectionModel().getSelected().data._parent != null) ? Ext
            .getCmp('padre')
            .setValue(stGpGest.getById(gpGest.getSelectionModel()
                    .getSelected().data._parent).data.codigo) : Ext
            .getCmp('padre').setValue('');
    var cod = (gpGest.getSelectionModel().getSelected().data._parent != null)
            ? gpGest.getSelectionModel().getSelected().data.codigo
            .toString()
            .substring(stGpGest.getById(gpGest.getSelectionModel()
                    .getSelected().data._parent).data.codigo.length)
            : gpGest.getSelectionModel().getSelected().data.codigo
            .toString();
    Ext.getCmp('codigo').maxLength = cod.length;
    Ext.getCmp('codigo').minLength = cod.length;
    Ext.getCmp('codigo').setValue(cod);
    Ext.getCmp('digitos').setValue(cod.length);
    Ext.getCmp('btnaplicar').hide();
    Ext.getCmp('idindicador').setValue(gpGest.getSelectionModel()
            .getSelected().data.idindicador);
    Ext
            .getCmp('cbum')
            .setValue(gpGest.getSelectionModel().getSelected().data.idumedida);
    Ext.getCmp('cbnaturaleza').setValue(gpGest.getSelectionModel()
            .getSelected().data.idnaturaleza);
    Ext.getCmp('cbpais')
            .setValue(gpGest.getSelectionModel().getSelected().data.idpais);
    Ext.getCmp('numeropieza').setValue(gpGest.getSelectionModel()
            .getSelected().data.numeropieza);
    Ext.getCmp('cbcentrobalance').setValue(gpGest.getSelectionModel()
            .getSelected().data.idcentrobalance);
  
    cbviaadquisicion1.setValue(gpGest.getSelectionModel().getSelected().data.DatIndicadorviaadquisicion[0].idviaadquisicion);
      cbOrganoSatisface.enable();
       var aux = [];
        for (i = 0; i < gpGest.getSelectionModel().getSelected().data.DatIndicadorviaadquisicion[0].DatIndicadorviaadquisicionorganosatisface.length; i++) {
        if(i!=gpGest.getSelectionModel().getSelected().data.DatIndicadorviaadquisicion[0].DatIndicadorviaadquisicionorganosatisface.length-1)
        aux += gpGest.getSelectionModel().getSelected().data.DatIndicadorviaadquisicion[0].DatIndicadorviaadquisicionorganosatisface[i].idorganosatisface + ',';
    else
      aux += gpGest.getSelectionModel().getSelected().data.DatIndicadorviaadquisicion[0].DatIndicadorviaadquisicionorganosatisface[i].idorganosatisface;
    
     
    }
     stCmbOrganoS.reload({
       params: {
        via: cbviaadquisicion1.getValue()
        },
        callback:function(){
          cbOrganoSatisface.setValue(aux);  
        }
       });
      
    Ext.getCmp('flete')
            .setValue(gpGest.getSelectionModel().getSelected().data.flete);
    Ext.getCmp('flete').enable();
    Ext.getCmp('contingencia').setValue(gpGest.getSelectionModel()
            .getSelected().data.contingencia);
    Ext.getCmp('contingencia').enable();
    Ext.getCmp('codigo').disable();
    winFpGest.doLayout();
}

function setTituloFiltrar() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosindicadores.getFiltrosActivos() == undefined
            || filtrosindicadores.getFiltrosActivos().length == 0) {
        gpGest.setTitle(perfil.etiquetas.lbSinFiltradoTitle);
    } else {
        for (i = 0; i < filtrosindicadores.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "codigo") {//
                aux = perfil.etiquetas.lbCodigo;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "precio") {//
                aux = perfil.etiquetas.lbPrecio;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "denoum") {//
                aux = perfil.etiquetas.lbUM;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "numeropieza") {

                aux = perfil.etiquetas.lbNopieza;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "denocentrobalance") {
                aux = perfil.etiquetas.lbCentroBalance;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "estado") {
                aux = perfil.etiquetas.lbEstado;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "idaprobacion") {
                aux = perfil.etiquetas.lbAprobacion;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "denomviaadquisicion") {
                aux = perfil.etiquetas.lbViaAdquisicion;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "denomorgansatisface") {
                aux = perfil.etiquetas.lbOrganosSatisface;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "nivelarbol") {
                aux = perfil.etiquetas.lbNivelArbol;
            } 
            else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "flete") {
                aux = perfil.etiquetas.lblbFlete;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "contingencia") {
                aux = perfil.etiquetas.lbContingencia;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "denompais") {
                aux = perfil.etiquetas.lbPais;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "naturaleza") {
                aux = perfil.etiquetas.lbNaturaleza;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "nivel") {
                aux = perfil.etiquetas.lbNivPlanif;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "idmodelo") {
                aux = perfil.etiquetas.lbPlanDirecto;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "uso") {
                aux = 'uso';
            }
            if (i == filtrosindicadores.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        gpGest.setTitle(perfil.etiquetas.lbFiltradoPor + ': ' + filtrado_por);
        filtrado_por = "";

    }
}

function upFpGest() {
    fpGest.getForm().reset();

    winFpGest.setTitle(((add)
            ? perfil.etiquetas.lbTitWinAdd
            : perfil.etiquetas.lbTitWinMod));
    if (add) {
        if (addhijo) {
            Ext.getCmp('cbformato').setValue(gpGest.getSelectionModel()
                    .getSelected().data.idformato);
            Ext.getCmp('idpadre').setValue(gpGest.getSelectionModel()
                    .getSelected().data.idindicador);
            Ext.getCmp('padre').setValue(gpGest.getSelectionModel()
                    .getSelected().data.codigo);
            longnivel((smGpGest.getSelected() && addhijo) ? Number(gpGest.getSelectionModel().getSelected().data.nivelarbol) + 1 : 1, smGpGest.getSelected().data.idformato);

            if (gpGest.getSelectionModel().getSelected() == undefined)
                Ext.getCmp('nivel').setValue(gpGest.getStore().getNodeDepth(smGpGest.getSelected()) + 2);
            else
                Ext.getCmp('nivel').setValue(Number(gpGest.getSelectionModel().getSelected().data.nivelarbol) + 1);
            Ext.getCmp('codigo').enable();
            Ext.getCmp('denominacion').enable();
            Ext.getCmp('descripcion').enable();
            Ext.getCmp('numeropieza').enable();
        } else {
            Ext.getCmp('cbformato').setValue(objci.idformatoInd);
            Ext.getCmp('digitos').setValue(3);
            Ext.getCmp('codigo').maxLength = 3;
            Ext.getCmp('codigo').minLength = 3;
            Ext.getCmp('codigo').minLengthText = perfil.etiquetas.msgTamañoCodigo + 3 + perfil.etiquetas.msgTamañoCodigo1;
            Ext.getCmp('codigo').maxLengthText = perfil.etiquetas.msgTamañoCodigo + 3 + perfil.etiquetas.msgTamañoCodigo1;
            Ext.getCmp('padre').setValue();
            Ext.getCmp('nivel').setValue(1);

        }
    } else {
        Ext.getCmp('cbformato').setValue(gpGest.getSelectionModel()
                .getSelected().data.idformato);
        (gpGest.getStore().getNodeDepth(smGpGest.getSelected()) == null) ? Ext
                .getCmp('idpadre').setValue(gpGest.getSelectionModel()
                .getSelected().data.idindicador) : Ext
                .getCmp('idpadre').setValue(gpGest.getSelectionModel()
                .getSelected().data._parent);
        Ext.getCmp('padre')
                .setValue(gpGest.getSelectionModel().getSelected().data.codigo);
        Ext.getCmp('nivel').setValue(gpGest.getStore().getNodeDepth(smGpGest
                .getSelected())
                + 2);
        Ext.getCmp('codigo').disable();
    }
    Ext.getCmp('padre').disable();
}

function HabilitarEntradas(caso) {
    Ext.getCmp('cbformato').disable();
    Ext.getCmp('padre').disable();
    if (objci.acciones.rector)
        Ext.getCmp('cbcentrobalance').enable();
    else
        Ext.getCmp('cbcentrobalance').disable();
    switch (caso) {
        case 'Mod' :
            Ext.getCmp('codigo').disable();
            Ext.getCmp('padre').disable();
            break;
        default :
            Ext.getCmp('codigo').enable();
            Ext.getCmp('padre').enable();
            Ext.getCmp('cbformato').enable();
            Ext.getCmp('cbcentrobalance').enable();
            break;
    }
}

function validarCB() {
    if (Ext.getCmp('nivel').getValue() > 2)
        if (Ext.getCmp('cbcentrobalance').getValue().toString().split(',').length > 1)
            return false;
    return true

}

function adicionarindicador(apl) {
    if (fpGest.getForm().isValid()) {
        
        if (validarCB()) {
            if (accion_ind == 'mod')
                var dimensaje = perfil.etiquetas.msgSegModificar
            else
                var dimensaje = perfil.etiquetas.msgSegAdicionar
            HabilitarEntradas('');
            mymask.show();
            fpGest.getForm().submit({
                url: 'adicionar',
                params: {                    
                    nivelarbol: Ext.getCmp('nivel').getValue()
               },
                failure: function(form, action) {
                    Ext.getCmp('cbformato').disable();
                    Ext.getCmp('padre').disable();
                    mymask.hide();
                    responseData = action.result;
                    if (responseData.mensaje == 'add') {
                        mensaje = perfil.etiquetas.msgAdicionado;
                        mostrarMensaje(1, conformarMensaje(mensaje));
                    cbOrganoSatisface.reset();
                    cbOrganoSatisface.disable();
                    cbOrganoSatisface.clearValue();
                    Ext.getCmp('contingencia').reset();
                    Ext.getCmp('contingencia').disable();
                    Ext.getCmp('flete').reset();
                    Ext.getCmp('flete').disable();
                    } else if (responseData.mensaje == 'mod') {
                        mensaje = perfil.etiquetas.msgModificado;
                        mostrarMensaje(1, conformarMensaje(mensaje));
                    } else if (responseData.mensaje == 'nopermiso') {
                        mostrarMensaje(3, perfil.etiquetas.msgNoPermiso);
                    } else {
                        mostrarMensaje(responseData.codMsg,
                                responseData.mensaje);
                    }
                    if (responseData.codMsgM == 1) {
                        if (!apl && responseData.codMsgM == 1) {
                            cbviaadquisicion1.reset();
                            cbOrganoSatisface.reset();
                            winFpGest.hide();

                        } else if (apl) {
                            cbnaturaleza.reset();
                            cbpais.reset();
                            cbum.reset();
                            cbcentrobalance.reset();
                            Ext.getCmp('denominacion').reset();
                            Ext.getCmp('descripcion').reset();
                            Ext.getCmp('codigo').reset();
                            Ext.getCmp('flete').reset();
                            Ext.getCmp('contingencia').reset();
                            Ext.getCmp('precio').setValue(0);
                            Ext.getCmp('preciodivisa').setValue('0');
                            Ext.getCmp('numeropieza').reset();
                            Ext.getCmp('padre').disable();
                            cbPlandirecto.reset();
                            cbviaadquisicion1.reset();
                            cbOrganoSatisface.reset();
                           /* cbOrganoS1.reset();
                            cbOrganoS2.reset();
                            cbOrganoS3.reset();
                            cbOrganoS4.reset();
                            cbOrganoS5.reset();
                            cbOrganoS1.disable();
                            cbOrganoS2.disable();
                            cbOrganoS3.disable();
                            cbOrganoS4.disable();
                            cbOrganoS5.disable();*/
                        }
                        if (smGpGest.getSelected() && addhijo && !apl)
                        {
                            smGpGest.clearSelections();
                            gpGest.getStore().reload();
                        }

                        else if (!apl && smGpGest.getSelected() && smGpGest.getSelected().data._parent != null && ((smGpGest.getSelected() && !add))) {
                            anode = smGpGest.getSelected().data._parent;
                            smGpGest.clearSelections();
                            gpGest.getStore().reload();
                        }
                        else if (!apl) {
                            smGpGest.clearSelections();
                            gpGest.getStore().reload({
                                params: {
                                    anode: null
                                }
                            });
                        }
                        btnMod.disable();
                        btnDel.disable();
                    }
                    control = 0;
                    if (Ext.getCmp('btnaplicar').hidden)
                        HabilitarEntradas('Mod');
                }

            });
        } else
            mostrarMensaje(3, perfil.etiquetas.msgCantidadCBNivel)
        //        } else
        //            mostrarMensaje(1, perfil.etiquetas.msgViaAdquicisionObligatoria);
    } else
        mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);

}

function validar() {
    mymask.show();
    Ext.Ajax.request({
        url: 'permisoParaOperaciones',
        params: {
            idindicador: smGpGest.getSelected().id,
            operacion: accion_ind,
            rector: objci.acciones.rector
        },
        callback: function(options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 24) {
                switch (accion_ind) {
                    case 'del' :
                        {
							accion_ind = "del";
                            eliminarIndicador();
                        }
                        break;
                    case 'act' :
                        {
                            cambiarEstado(1);
                            mymask.hide();
                        }
                        break;
                    case 'desact' :
                        {
                            cambiarEstado(0);
                            mymask.hide();
                        }
                        break;
                    case 'definirnivel' :
                        {
                            nivelPlanificacion(0)
                        }
                        break;
                    case 'quitarnivel' :
                        {
                            nivelPlanificacion(1)
                        }
                        break;
                    case 'mod' :
                        {
                            validarUsoIndicador();
                            //  Mod();
                        }
                        break;
                    case 'addhijo' :
                        {
                            stCmbCentroB.reload({
                                params: {
                                    //                                ad_hijo: true
                                    idpadre: gpGest.getSelectionModel().getSelected().data.idindicador
                                            //                                idindicador : gpGest.getSelectionModel().getSelected().data.idindicador
                                }
                            });
                            
                      }
                        break;
                    case 'aprob' :
                        {
                            cambiarEstadoAprobacion(3);
                        }
                        break;
                    case 'desaprob' :
                        {

                            cambiarEstadoAprobacion(1);
                        }
                }
            } else if (responseData.codMsgM == 21) {
                mostrarMensaje(3, perfil.etiquetas.msgErrorUsadoModelo);
                mymask.hide();
            }
            else if (responseData.codMsgM == 22) {
                mostrarMensaje(3, perfil.etiquetas.msgErrorUsadoNorma);
                mymask.hide();
            }
            else if (responseData.codMsgM == 23) {
                switch (accion_ind) {
                    case 'del' :
                        {
                            mensaje = perfil.etiquetas.msgEliminar;
                            break;
                        }
                    case 'act' :
                        {
                            mensaje = perfil.etiquetas.msgActivar;
                            break;
                        }
                    case 'desact' :
                        {
                            mensaje = perfil.etiquetas.msgDesactivar;
                            break;
                        }
                    case 'mod' :
                        {
                            mensaje = perfil.etiquetas.msgModificar;
                            break;
                        }
                    case 'addhijo' :
                        {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAprobado2)
                            break;
                        }
                }
                //                mostrarMensaje(3, perfil.etiquetas.msgErrorAprobado);/**/
                if (accion_ind != 'addhijo')
                    mostrarMensaje(3, perfil.etiquetas.msgErrorAprobado3);
                //                    mostrarMensaje(3, conformarMensajeErrorAprobado(mensaje));
                mymask.hide();
            }
            else if (responseData.codMsgM == 25) {
                mostrarMensaje(3, perfil.etiquetas.msgNoPermiso);
                mymask.hide();
            }
            else {
                (mostrarMensaje(3, perfil.etiquetas.msgErrorAction));
                mymask.hide();
            }
        }
    });
}
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function validarUsoIndicador() {
    mymask.show();
    Ext.Ajax.request({
        url: 'validarUsoIndicador',
        params: {
            idindicador: smGpGest.getSelected().id
        },
        callback: function(options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 21) {
                Ext.MessageBox.buttonText.yes = "Detalles";
                Ext.MessageBox.buttonText.no = "Continuar";
                Ext.MessageBox.buttonText.cancel = "Cancelar";
                Ext.MessageBox.show({
                    title: 'Advertencia',
                    msg: perfil.etiquetas.msgAlertuso,
                    buttons: Ext.MessageBox.YESNOCANCEL,
                    fn: mostrarDetalles,
                    icon: Ext.MessageBox.INFO
                });
            } else
                Mod();
        }
    })
}

function eliminarIndicador() {
	auxdel = true;
    var aux = smGpGest.getSelections();
    for (pos in aux) {
        if (aux[pos].data) {
            if ((!objci.acciones.rector)
                    && (/*aux[pos].data.identidad.length > 1
                     || */aux[pos].data.nivelarbol < 3 || aux[pos].data.idaprobacion > 3)) {
                mostrarMensaje(1, perfil.etiquetas.msg3 + aux[pos].data.denominacion
                        + perfil.etiquetas.msg5, function(){
						})
                aux[pos] = '';
            }
        }
    }
    var arreglo = [];
    for (pos in aux) {
        if (aux[pos].id)
            arreglo.push(aux[pos].id);
    }
    if (arreglo.length > 0) {
        function del(btnPresionado) {
             map.enable();
            if (btnPresionado == 'ok') {
				auxdel = false;
                var aux = smGpGest.getSelections();
                var arreglo = [];

                for (pos in aux) {
                    if (aux[pos].id)
                        //   arreglo.push(aux[pos].id);
                        arreglo.push([aux[pos].id, aux[pos].data.idarbol, aux[pos].data.ordender, aux[pos].data.ordenizq, aux[pos].data.idaprobacion]);

                }
                mymask.show();
                Ext.Ajax.request({
                    url: 'eliminar',
                    params: {
                        idindicador: Ext.encode(arreglo)
                    },
                    callback: function(options, success, response) {
                        mymask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgM == 1) {
                            if (smGpGest.getSelected()) {
                                anode = smGpGest.getSelected().data._parent;
                                if (parent == null) {
                                    smGpGest.clearSelections();
                                    gpGest.getStore().reload({
                                        params: {
                                            anode: anode
                                        }
                                    });
                                } else {
                                    smGpGest.clearSelections();

                                }
                            } else {
                                gpGest.getStore().reload();
                            }
                            mostrarMensaje(1, perfil.etiquetas.msgEliminado);
                            gpGest.getStore().reload({
                                params: {
                                    anode: anode
                                }
                            });
                        } else if (responseData.codMsgM == 21) {
                            mostrarMensaje(1, perfil.etiquetas.msgNoAprobarEnUso);
                        }
                        control = 0;
                    }
                });
            }else{
			auxdel = false;
			}
        }
        mostrarMensaje(2, perfil.etiquetas.msgEliminarInd, del);
    }
    else{
        map.enable();
    }
	accion_ind = "";
}

function modificarEstado(val, m) {
    // m.attr = 'ext:qtip="'+ val + '"';
    if (val == 1)
    {
        m.attr = 'ext:qtip="' + "Rector" + '"';
        m.css = 'icondistra-true verde';
        //return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
    }
    else {
        m.attr = 'ext:qtip="' + "No" + '"';
        m.css = 'icondistra-false rojo';
        //return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
    }
}

function modificarUso(val,metaData) {
    if (val == 1)
        //return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
    //return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
        metaData.css = 'icondistra-true verde';
    metaData.css = 'icondistra-false rojo';
}

function modificarNivel(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    switch (value)
    {
        case '1':
            return perfil.etiquetas.lbGenérico
            break;
        case '2':
            return perfil.etiquetas.lbSubgenérico
            break;
        case '3':
            return perfil.etiquetas.lbEspecífico
            break;
        default:
            return perfil.etiquetas.lbSurtido
    }
    return x
}

function modificarEstadoAprobacion(val, m) {


    if (val < 2) {
        m.attr = 'ext:qtip="' + "No" + '"';
        m.css = 'icondistra-false rojo';
        //return '<span><img src=' + perfil.dirImg + 'no.png' + '>';

    }

    else if (val == 4) {
        m.attr = 'ext:qtip="' + "Rector" + '"';
       // return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
        m.css = 'icondistra-true verde';
    }
    else if (val == 3) {
        m.attr = 'ext:qtip="' + "Si" + '"';
        return '<span><img src=' + perfil.dirImg + 'yes.png' + '>';

    }
    else {
        m.attr = 'ext:qtip="' + "Si" + '"';
        return '<span><img src=' + perfil.dirImg + 'yes(azul).png' + '>';

    }
}




function Recursivo(padre) {
    if (padre == 1) {
        padremax = padretemp1;
    } else {
        padretemp = gpGest.getStore().getById(padre).data._parent;
        if (padretemp != null) {
            padretemp1 = gpGest.getStore().getById(padre).data._parent;
        } else {
            padretemp1 = padre;
            padretemp = 1;
        }
        Recursivo(padretemp);
    }
    return padremax;
}

function definirnivel(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        Ext.Ajax.request({
            url: 'definirnivelPLanificacion',
            params: {
                idindicador: smGpGest.getSelected().id,
                bandera: 0,
                ind: indic,
                der: smGpGest.getSelected().data.ordender,
                izq: smGpGest.getSelected().data.ordenizq,
                defnivel: 0
            },
            method: 'POST',
            callback: function(options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {
                    mostrarMensaje(1, perfil.etiquetas.msgDefinirNivP);
                } else
                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                parent = smGpGest.getSelected().data._parent;
                if (parent != null) {
                    pparent = gpGest.getStore().getById(parent).data._parent;
                    if (pparent != null) {
                        padre1 = Recursivo(pparent);
                        padre2 = gpGest.getStore().getById(padre1).data._parent;
                        if (padre2 == null) {
                            gpGest.getStore().reload({
                                params: {
                                    anode: padre2
                                }
                            });
                        }
                    } else {
                        gpGest.getStore().reload({
                            params: {
                                anode: pparent
                            }
                        });
                    }
                } else {
                    gpGest.getStore().reload({
                        params: {
                            anode: parent
                        }
                    });
                }
            }
        });
    }
}

function habilitarModificar(bandera) {
    if (bandera) {
        if (smGpGest.getSelections().length == 1) {
            if (objci.acciones.rector) {
                activarDesactivar();
                aprobarDesaprobar();
                Ext.getCmp('btnMod').enable();
                if (idejercicioactual == cbEjercicio.getValue())
                Ext.getCmp('btnDel').enable();
            } else {
                if (smGpGest.getSelected().get('nivelarbol') > 2) {
                    if (smGpGest.getSelected().get('idaprobacion') < 4) {
                        activarDesactivar();
                        aprobarDesaprobar();
                        Ext.getCmp('btnMod').enable();
                        if (idejercicioactual == cbEjercicio.getValue())
                        Ext.getCmp('btnDel').enable();
                    } else
                        desactivarTodos();
                } else
                    desactivarTodos();
            }
        } else {
            Ext.getCmp('btnMod').disable();
            aprobarDesaprobar(true);
            activarDesactivar(true);
            if (idejercicioactual == cbEjercicio.getValue())
            Ext.getCmp('btnDel').enable();
        }
    } else
        desactivarTodos();
}

function desactivarTodos() {
    Ext.getCmp('btnMod').disable();
    Ext.getCmp('btnDel').disable();
    Ext.getCmp('btnDes').disable();
    Ext.getCmp('btnAct').disable();
    Ext.getCmp('btnAprobar').disable();
    Ext.getCmp('btnDesaprobar').disable();
}

function activarDesactivar(multi) {
    if (multi) {
        btnAct.enable();
        btnDes.enable();
    } else {
        if (smGpGest.getSelected().get('estado') == '0') {
            btnAct.enable();
            btnDes.disable();
        } else {
            btnAct.disable();
            btnDes.enable();
        }
    }
}

function aprobarDesaprobar(multi) {
    if (multi) {
        if (idejercicioactual == cbEjercicio.getValue()) {
        btnAprobar.enable();
        btnDesaprobar.enable();
        }
        else {
            btnAprobar.disable();
            btnDesaprobar.disable();
        }
    } else {
        if (idejercicioactual == cbEjercicio.getValue()) {
        if (smGpGest.getSelected().get('idaprobacion') == '1' || (smGpGest.getSelected().get('idaprobacion') == '3' && objci.acciones.rector)) {
            btnAprobar.enable();
            btnDesaprobar.disable();
        } else {
            btnAprobar.disable();
            btnDesaprobar.enable();
        }
    }
        else {
            btnAprobar.disable();
            btnDesaprobar.disable();
        }
    }

}

function limpiarfiltros() {

    control = 0;
    smGpGest.clearSelections(true);
    if (!smGpGest.getSelected())
        filtrosindicadores.clearFilters();


}

function exportarindicadores() {

    winNomProd = new Ext.UCID.WinIframe({
        title: 'Exportar indicadores',
        idIframe: 'iframenomprod',
        id: 'nomprod',
        url: 'nuevoexportar',
        width: 900,
        idejercicio: cbEjercicio.getValue(),
        doAction: function(rec) {
            // procesarecordsNomProductos(rec);
        },
        height: 500,
        modal: true,
        closeAction: 'close',
        buttons: [{
                handler: function() {
                    winNomProd.close();
                },
                text: 'Cancelar',
                iconCls: 'btn',
                icon: perfil.dirImg + 'cancelar.png'
            }//,
            //        {
            //            handler:function(){
            //                opciones=false;
            //                winNomProd.doAction(winNomProd.dataIframe);
            //            },
            //            text:'Aplicar',
            //            iconCls:'btn',
            //            icon:perfil.dirImg+'aceptar.png'
            //        },
            //        {
            //            handler:function(){
            //                opciones=true;
            //                winNomProd.doAction(winNomProd.dataIframe);
            //            },
            //            text:'Aceptar',
            //            iconCls:'btn',
            //            icon:perfil.dirImg+'aceptar.png'
            //        }

        ]

    });

    winNomProd.show();

}

/*function mostrarAyuda(opcion) {
    var urlayuda = "../../../comun/templates/Ayuda/Configuracion/Indicadores/" + opcion + ".html";
    window.open(urlayuda, "Ayuda", "width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes");
}*/

function mostrarAyuda(referencia, title) {
    var title = 'Indicadores';
    var referencia = 'gestindicadores'; //esto puede ser el id del boton o cualquier cosa que lo identifique
    help.show(title, referencia);
}

function conformarMensaje(mesg) {
    mesg = perfil.etiquetas.msg1 + mesg + perfil.etiquetas.msg2;
    return mesg;
}

function conformarMensajeErrorAprobado(mesg) {
    mesg = perfil.etiquetas.msgErrorAprobado + perfil.etiquetas.msgErrorAprobado1;
    return mesg;
}

function accionBotonAdicionar() {
  stCmbPaises.reload();
  stCmbNaturaleza.reload();
  stCmbViaAdq.reload();
  stCmbUM.reload();  
  stCmbPlandirecto.reload();
  
    stCmbCentroB.reload({
        params: {
            idpadre: null,
            idindicador: null
        }
    });
    add = true;
    addhijo = false;
    mensaje = perfil.etiquetas.msgGuardandoAdicionar;
    if (!winFpGest) {
        winAddIndicador();
    }
    winFpGest.show();
    smGpGest.clearSelections();
    upFpGest();
    Ext.getCmp('btnaplicar').show();
    Ext.getCmp('codigo').enable();
    Ext.getCmp('denominacion').enable();
    Ext.getCmp('descripcion').enable();
    Ext.getCmp('cbum').enable();
    Ext.getCmp('cbnaturaleza').enable();
    Ext.getCmp('cbpais').enable();
    Ext.getCmp('numeropieza').enable();
    winFpGest.doLayout();
}

function siexisteIndicadorFiltrado() {
    if (filtrosindicadores.getFiltrosActivos().length > 0 && stGpGest.getCount() == 0)
        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');

}

function mostrarVentana() {
    //    if(flag1 && flag2 && flag3 && flag4){
    if (!add) {
        mostrarVenatanaModificar();
        if(gpGest.getSelectionModel().hasSelection())
		cbcentrobalance.setValue(gpGest.getSelectionModel().getSelected().data.idcb);
    }
    else {
        if (!winFpGest) {
            winAddIndicador();
            winFpGest.show();
            upFpGest();
            winFpGest.doLayout();
        } else {
            upFpGest();
            winFpGest.show();
        }
    }
    mymask.hide();
//    }
}

function listarOrganos() {
    Ext.Ajax.request({
        url: 'listarOqsatisface',
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            array = responseData.data;
            for (i = 0; i < array.length; i++) {

                if (array[i].idorganosatisface != 42 && array[i].idorganosatisface != 43 && array[i].idorganosatisface != 44)
                    organos.push([array[i].idorganosatisface, array[i].denominacion]);
                else
                    id.push([array[i].idorganosatisface, array[i].denominacion]);
            }
            cargarInterfaz();
        }
    })
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
    function fToolTipShow(component, text)
    {
        if (!component.ttp)
            component.ttp = new Ext.ToolTip({
                target: component.getEl(),
                autoHeight: true,
                autoWidth: true,
                autoHide: true,
                maxWidth: 200,
                anchor: 'left',
                title: text,
                trackMouse: true
            });
        else
            component.ttp.setTitle(text);
    }
}
function esActual() {

    Ext.Ajax.request({
        url: 'getEjercicios',
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.idejercicioactual.idejercicio == cbEjercicio.getValue()) {
                return true;
            }
            else {
                return false;
            }
        }
    });
}

function verIndicadorEnUso() {
//combo ejercicio para la ventana de indicadores en uso
    stCbejercicio1 = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        listeners: {
            load: function(t, n, e) {
                cbEjercicio1.setValue(t.reader.jsonData.idejercicioactual.idejercicio);

                idejercicioactual = t.reader.jsonData.idejercicioactual.idejercicio;
                storeDetallesPlanes.load({
                    params: {
                        limit: 20,
                        idejercicio: cbEjercicio1.getValue(),
                        idindicador: smGpGest.getSelected().id,
                        start: 0
                    }
                });
                storeDetallesActividades.load({
                    params: {
                        idejercicio: cbEjercicio1.getValue(),
                        idindicador: smGpGest.getSelected().id,
                        limit: 20,
                        start: 0
                    }
                });
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }])
    });

    cbEjercicio1 = new Ext.form.ComboBox({
        id: 'cbEjercicio1',
        store: stCbejercicio1,
        // disabled: true,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        //enableKeyEvents: true,
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function(cb, rec, index) {

                if (idejercicioactual != cbEjercicio.getValue()) {
                    Ext.getCmp('btnAdd').disable();
                }
                else
                {
                    Ext.getCmp('btnAdd').enable();

                }

                storeDetallesPlanes.reload({
                    params: {
                        limit: 20,
                        idejercicio: cbEjercicio1.getValue(),
                        idindicador: smGpGest.getSelected().id,
                        start: 0
                    }
                });
                storeDetallesActividades.reload({
                    params: {
                        idejercicio: cbEjercicio1.getValue(),
                        idindicador: smGpGest.getSelected().id,
                        limit: 20,
                        start: 0
                    }
                });

            }
        }
    });
    /**************************////////////////////////
    btnExportarenuso = new Ext.Button({
        disabled: false,
        tabIndex: 6,
        // hidden: false,
        id: 'btnExportarenuso',
        icon: perfil.dirImg + 'exportar.png',
        iconCls: 'btn',
        //tooltip: perfil.etiquetas.lbTtbtnExportar + '(<b>Alt+E</b>)',
        text: perfil.etiquetas.lbBtnExportar,
        handler: function() {
            exportar();
            //window.open('exportarIndicadoresAExcel?identidad=' + objci.compEntidad);
            //exportarindicadores();

        }
    });
    btnLimpiarFiltrosPlanes = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosPlanes',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbBtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            limpiarfiltrosPlanes();
        }
    });

    btnLimpiarFiltrosAct = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosAct',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbBtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            limpiarfiltrosActividades();
        }
    });
    stCmbEspecialidad = new Ext.data.Store({
        url: 'listarHijosRector',
        storeId: 'stCmbEspecialidad',
        //        autoLoad : true,
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 120000;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identi'
        }, [{
                name: 'identi'
            }, {
                name: 'denominacion'
            }])
    });
    stCmbEspecialidad.load();
    filtrosPlanes = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'especialidad',
                idcombo: 'identi',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                st: stCmbEspecialidad,
                mode: 'local'
            }, {
                type: 'string',
                dataIndex: 'entidad'
            }, {
                type: 'listado',
                dataIndex: 'plan',
                idcombo: 'cbplandirectofiltro',
                urlcb: 'listarTodosPlanes',
                //            idstore : 'stcbFiltroNaturaleza',// stCmbNaturaleza
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                st: stCmbPlandirecto,
                autoload: false,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }, {
                type: 'numeric',
                dataIndex: 'necesidad'
            }, {
                type: 'numeric',
                dataIndex: 'importetotal'
            }]
    });
    storeDetallesPlanes = new Ext.data.Store({
        url: 'listarPlanesConIndicador',
        listeners: {
            beforeload: function() {
                storeDetallesPlanes.removeAll();
                storeDetallesPlanes.baseParams.idejercicio = cbEjercicio1.getValue();
                storeDetallesPlanes.baseParams.idindicador = smGpGest.getSelected().id;

            }
        },
        baseParams: {
            start: 0,
            limit: 20
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        },
        [{
                name: 'especialidad',
            }, {
                name: 'entidad',
            }, {
                name: 'plan',
            }, {
                name: 'necesidad',
            }, {
                name: 'importetotal',
            }]
                )
    });
    gridDetallesPlanes = new Ext.grid.GridPanel({
        store: storeDetallesPlanes,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        columns: [{
                id: 'especialidad',
                header: "Especialidad",
                width: 180,
                sortable: true,
                dataIndex: 'especialidad'
            }, {
                id: 'entidad',
                header: "Entidad",
                width: 180,
                sortable: true,
                dataIndex: 'entidad'
            }, {
                id: 'plan',
                header: "Plan",
                width: 180,
                sortable: true,
                dataIndex: 'plan'
            }, {
                id: 'necesidad',
                header: "Necesidad",
                width: 100,
                sortable: true,
                dataIndex: 'necesidad'
            }, {
                id: 'importetotal',
                header: "Importe Total",
                width: 100,
                sortable: true,
                dataIndex: 'importetotal'
            }

        ],
        stripeRows: true,
        autoExpandColumn: 'importetotal',
        frame: true,
        height: 210,
        width: 773,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: storeDetallesPlanes,
            displayInfo: true,
            items: [btnLimpiarFiltrosPlanes, '-'],
            id: 'pgDetallesPlanes'
        }),
        plugins: filtrosPlanes
    });

    storeDetallesActividades = new Ext.data.Store({
        url: 'listarActividadesConIndicador',
        listeners: {
            beforeload: function() {
                storeDetallesActividades.baseParams.idejercicio = cbEjercicio1.getValue();
                storeDetallesActividades.baseParams.idindicador = smGpGest.getSelected().id;

            }
        },
        baseParams: {
            start: 0,
            limit: 20
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'codigo',
                // mapping : 'NomActividad.codigo'
            }, {
                name: 'denominacion',
                //  mapping : 'NomActividad.denominacion'
            }, {
                name: 'norma',
                //  mapping : 'DatNorma.norma'
            }, {
                name: 'base',
                //  mapping : 'DatNorma.base'
            }, {
                name: 'necesidad',
                //    mapping : 'DatNorma.necesidad'
            }])
    });

    filtrosdetallesActividades = new Ext.grid.GridFilters({
        //id:'cbFiltroCB',
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'norma'
            }, {
                type: 'numeric',
                dataIndex: 'base'
            }, {
                type: 'numeric',
                dataIndex: 'necesidad'
            }]
    });

    gridDetallesActividades = new Ext.grid.GridPanel({
        store: storeDetallesActividades,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        columns: [
            {
                id: 'codigo',
                header: "C&oacute;digo",
                width: 180,
                sortable: true,
                dataIndex: 'codigo'
            }, {
                id: 'denominacion',
                header: "Denominaci&oacute;n",
                width: 220,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                id: 'norma',
                header: "Norma",
                width: 100,
                sortable: true,
                dataIndex: 'norma'
            }, {
                id: 'base',
                header: "Base",
                width: 100,
                sortable: true,
                dataIndex: 'base'
            }, {
                id: 'necesidad',
                header: "Necesidad",
                width: 100,
                sortable: true,
                dataIndex: 'necesidad'
            }

        ],
        stripeRows: true,
        autoExpandColumn: 'necesidad',
        height: 345,
        width: 773,
        frame: true,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: storeDetallesActividades,
            displayInfo: true,
            items: [btnLimpiarFiltrosAct, '-'],
            id: 'pgDetallesActividades'
        }),
        plugins: filtrosdetallesActividades,
        tbar: [btnExportarenuso, '-', 'Ejercicio:', cbEjercicio1]
    });


    panelDetalles = new Ext.FormPanel({
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        width: 800,
        height: 600,
        layout: 'border',
        items: [{
                title: 'Planes',
                region: 'south',
                height: 230,
                width: 790,
                autoExpandColumn: 'expandir',
                //   margins: '0 0 0 0',
                items: [gridDetallesPlanes]
            }, {
                title: 'Actividades',
                region: 'center',
                height: 330,
                width: 790,
                autoExpandColumn: 'expandir',
                //margins: '10 10 0 0',
                items: [gridDetallesActividades],
            }],
        tbar: [
            'Código: ', smGpGest.getSelected().data.codigo, '-', 'Denominación: ', smGpGest.getSelected().data.denominacion, '-', 'No.pieza: ', smGpGest.getSelected().data.numeropieza == null ? '--' : smGpGest.getSelected().data.numeropieza, '-', 'UM: ', smGpGest.getSelected().data.denoum, '-', 'Precio: ', smGpGest.getSelected().data.precio],
    });

    winIndEnUso = new Ext.Window({
        modal: true,
        id: 'idWinDetalles',
        title: 'Indicadores en Normas',
        layout: 'fit',
        constrain: true,
        width: 800,
        height: 620,
        closeAction: 'destroy',
        items: panelDetalles,
        resizable: false,
        buttons: [{
                text: 'Cancelar',
                iconCls: 'btn',
                icon: perfil.dirImg + 'cancelar.png',
                handler: function() {
                    Ext.getCmp('idWinDetalles').destroy();
                }
            }]
    }).show();
}
function limpiarfiltrosPlanes() {
    filtrosPlanes.clearFilters();
}

function limpiarfiltrosActividades() {
    filtrosdetallesActividades.clearFilters();

}

function exportar() {
    Ext.Ajax.timeout = 600000;
    var win = window.open('exportar?idejercicio=' + cbEjercicio1.getValue() +
            '&idindicador=' + smGpGest.getSelected().id +
            '&fxc1=' + Ext.encode(filtrosPlanes.getFilterData()) +
            '&fxc=' + Ext.encode(filtrosdetallesActividades.getFilterData()));
    mascaraExportar('perfil.etiquetas.lbExportandoActvs', 'perfil.etiquetas.lbEsperePorFavor', win);
}

function CalcularCoeficiente() {

    if (Ext.getCmp('Coefic').getValue()) {
	  mymask.show();
        arrayidindicadores = [];

        if (smGpGest.getSelections().length > 0) {
            for (i = 0; i < smGpGest.getSelections().length; i++) {
               
                    arrayidindicadores.push(smGpGest.getSelections()[i].data.idindicador);
                
            }
        }
        Ext.Ajax.request({
            url: 'calcularCoeficiente',
			timeout: 72000000, //max 10horas
            params: {
                arrayidindicadores:Ext.encode(arrayidindicadores),
                //identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo,
               // idejercicio: cbEjercicio.getValue(),
                coeficiente: Ext.getCmp('Coefic').getValue()

            }
            ,
          callback: function(options, success, response) {
		    mymask.hide();
            responseData = Ext.decode(response.responseText);
        
            if (responseData.codMsg == 22) {
               
                    mostrarMensaje(1, perfil.etiquetas.msgCalculoCoefOk, function() {
					Ext.getCmp('Coefic').reset();
					winCalcularcoeficiente.hide();
					    smGpGest.clearSelections();       
                      gpGest.getStore().reload();  
                        return;
                    });
            
            }         
            if (responseData.codMsg == 20) {
                mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
               gpGest.getStore().reload();
                return;
            }
        }

        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgErrorCoeficiente);
    }
}
