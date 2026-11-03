Ext.ns('Pvd.ControlAsistencia.Informacionestadistica');
/**
 * Autor: Mayler Navarro Diaz
 */
 Ext.QuickTips.init();

	var variables = {
			accion: null,
			btnpress: 'acp'
		};
	var remitidohacia;
	var devueltoa;
	var idefp;
	var idregistro;
	var p;
	var modif;
	var datos;
    var idsolicitudrecursoimpugnacion;
    var idpersona;
var noexamen;
var terminacion=false;
var fechasennalada;
var tipojuicio;
var idtipoprocedimiento;
var idlugar;
var idlogeado;
var idpersonaacusada;

var idplanificacionjuicio;

var idlugarcelebracion;
var idtipojuicio;
var san;
var sentencia;

    var persona='';
    var nuevo;
    var integrantes;
    var idtribunal;
    var arregloStore;
    var arregloidpersona=new Array();
    var arreglonompersona=new Array();

var arregloinsertar=new Array();
var arregloeliminar=new Array();
var cambio = 0;
var cambio1 = 0;
var cambio2 = 0;
var cambio3 = 0;
var cambio4 = 0;
var vista=1;
var efp;
var persona;
var idregistroexamenprocedesp;
var fecharegistro;

var fase;


UCID.portal.cargarEtiquetas('asistenciamensual', function(perfil, idioma){

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;




});
Pvd.ControlAsistencia.Informacionestadistica.informacionestadistica = Ext.extend(Ext.Panel, {
    width : '100%',
    region:'center',
    layout:'border',
    frame: false,
    initComponent: function (idioma,modelo) {

        this.modelo = Pvd.ControlAsistencia.Informacionestadistica.Modelo;
        var idioma = Pvd.ControlAsistencia.Informacionestadistica.Idioma;
        this.modelo.init();

        var self = this;
        this.treeConfig = {
            loader: {
                dataUrl: '/tribunales/index.php/gestjuiciooral/getEstructura',
                uiProviders: {
                    'columna': Ext.tree.TreeNodeUI
                }
            },
            border: false,
            autoScroll: true,
            rootVisible: false,
            listeners: {
                click: function(node, e) {
                    cambio = 1;
                }
            },
            root: {
                text: 'Estructura',
                id: 'root',
                animate: false,
                draggable: false,
                expanded: false
            }

        }


        this.treeConfigDev = {
            loader: {
                dataUrl: '/tribunales/index.php/gestsesiondispositiva/getfiscalia',
                uiProviders: {
                    'columna': Ext.tree.TreeNodeUI
                }
            },
            border: false,
            autoScroll: true,
            rootVisible: false,
            listeners: {
                click: function(node, e) {
                    cambio2 = 1;
                }
            },
            root: {
                text: 'Estructura',
                id: 'root',
                animate: false,
                draggable: false,
                expanded: false
            }
        }


        this.storePersonas = new Ext.data.GroupingStore({
            url: '/tribunales/index.php/examen/listarPersonas',
            reader: new Ext.data.JsonReader({

                root: 'datos',
                id: 'idpersona'
            }, [
                {name: 'idpersona'},
                {name: 'nombreyapellidos'},
                {name: 'sexo'}

            ]),
            sortInfo: {field: 'sexo', direction: "DESC"},
            groupField: 'sexo'
        });


        this.smPersonas = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false
        });
        this.Listadoinfoestadistica = new Ext.grid.GridPanel({
            id:'listadoInfoestadistica',
            title:' ',
            store: this.modelo.stinfoestadistica,
            autoScroll:true,
            loadMask: {msg: idioma.lbMsgmasklistado},
            sm: this.smPersonas,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'Indicadores', width:300,hideable:false, dataIndex: 'denominacion'},
                {header: 'U/M', width:50, dataIndex: 'unidadmedida'},
                {header: 'Valores', width:100, dataIndex: 'datos'}
            ],
        });


        this.plistadoPersona = new Ext.Panel({
            id: 'plistadoPersona',
            layout: 'fit',
            region: 'center',
            collapsible: true,
            split: true,
            items:[this.Listadoinfoestadistica]
        });
        this.smListadoRegimen = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });
        this.cmlistadoregimentrabajo = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
            {header:'Denominación', width: 235,	sortable: true,	dataIndex: 'denominacion'},
            {header: 'Fecha inicio', width: 100, dataIndex: 'fdesde'},
            {header: 'Fecha fin', width: 100, dataIndex: 'fhasta'}
            ,this.smListadoRegimen
        ]);

        this.gplistadoreporte = new Ext.grid.GridPanel({
            id: 'listadoPersonasRT',
            height:200,
            loadMask: {msg: 'Cargando...'},
            cm: this.cmlistadoregimentrabajo,
            title:idioma.lbListadoReporte,
            stripeRows: true,
            autoScroll:true,
            store:this.modelo.stTregimen,
            sm: this.smListadoRegimen,
            bbar:new Ext.PagingToolbar({
                pageSize: 15,
                store: this.modelo.stTregimen,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: idioma.lbemptyMsg
            })
        });

        this.pgrupoPersona = new Ext.Panel({
            id: 'pgrupoPersona',
            width:'50%',
            layout: 'fit',
            region: 'west',
            collapsible: true,
            split: true,
            items:[this.gplistadoreporte],
        });

        this.btnAyuda = new Ext.Button({
            id:'btnAyudaAsistMensual',
            text: idioma.btnAyuda,
            iconCls:'ayuda',
            disabled: false,
            tooltip:idioma.lbBtnAyuda
        });

        this.pGeneral = new Ext.Panel({
            width : '100%',
            region:'center',
            layout:'border',
            items: [this.pgrupoPersona,this.plistadoPersona]
        });

		this.items= [this.pGeneral];

        Pvd.ControlAsistencia.Informacionestadistica.informacionestadistica.superclass.initComponent.call(this);

        Pvd.ControlAsistencia.Informacionestadistica.Controlador.init(idioma, this, this.modelo);
    }


})


/*var a=new Tribunales.Registprocedespecial.examen();
this.regionp=new Ext.Viewport({
    layout:'border',
    items:[a]
});*/







