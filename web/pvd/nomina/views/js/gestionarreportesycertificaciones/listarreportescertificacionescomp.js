
/**
 Uso:Componente para listar los reportes y certificaciones con sus personas.

  * ---------------------------------------------

  * 19 de Junio de 2013 |   Nomina
  *

  * @extends Ext.Panel
  * @xtype
  * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
  * @version 1.0.0
  */
Ext.ns('Pvd.Nomina.ReportesyCertificaciones');
Ext.QuickTips.init();
Pvd.Nomina.ReportesyCertificaciones.Utils = function() {
    return {
        loadMask : function(msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg : msj
            });
            this.lMask.show();
        },
        hideMask : function() {
            this.lMask.hide();
        }
    }
};
var utils = new Pvd.Nomina.ReportesyCertificaciones.Utils();

/*Componente*/
Pvd.Nomina.ReportesyCertificaciones.panelListarReportesCertificacionesPersonasComp = Ext.extend(Ext.Panel,{
    width:500,
    height:400,
    border: false,
    cantidadPorPagina: 15,
    modoVisualizacion: 1, // 1 se visualizan los reportes con las personas, 2 se visualizan los reportes
    modoMostrar: 1, // 1 se visualizan los reportes vigentes, 2 se visualizan todos los reportes
    identidad: -1,
    initComponent: function() {
		this.region = (this.region ? this.region : 'center');
		this.layout = (this.layout ? this.layout : 'border');
		this.cantidadPorPagina = (this.cantidadPorPagina ? this.cantidadPorPagina : 15);
        this.modoVisualizacion = (this.modoVisualizacion ? this.modoVisualizacion : 1);
        this.modoMostrar = (this.modoMostrar ? this.modoMostrar : 1);
        this.identidad = (this.identidad ? this.identidad : -1);

        this.stReportesCertificaciones = new Ext.data.GroupingStore({
		    url: '/pvd/nomina/index.php/listarreportesycertificacionescomp/obtenerreportesycertificaciones',
            baseParams: {modomostrar: this.modoMostrar, identidad: -1},
            sortInfo: {field: 'fechainicio', direction: "ASC"},
            groupField: 'confreportescertificaciones',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idreportescertificaciones" },
			[ 	 {name: 'idreportescertificaciones'}
				,{name: 'idconfreportescertificaciones'}
				,{name: 'confreportescertificaciones'}
				,{name: 'nivel'}
				,{name: 'fechainicio'}
				,{name: 'fechafin'}
				,{name: 'estado'}
                ,{name: 'identidad'}
                ,{name: 'idusuario'}
			])
		});

		this.cmReportesCertificaciones = new Ext.grid.ColumnModel([{
               id:'idreportescertificaciones',
               header: "idreportescertificaciones",
               dataIndex: 'idreportescertificaciones',
               hidden: true,
               hideable: false
            },{
               header: "idconfreportescertificaciones",
               dataIndex: 'idconfreportescertificaciones',
               hidden: true,
               hideable: false
            },{
               header: "Tipo",
               dataIndex: 'confreportescertificaciones',
               hidden: true,
               hideable: false
            },{
               header: "Nivel",
               dataIndex: 'nivel',
               hidden: true,
               hideable: false
            },{
               header: "Fecha de inicio",
               dataIndex: 'fechainicio',
               width: 100
            },{
               header: "Fecha de fin",
               dataIndex: 'fechafin',
               width: 100
            },{
               header: "Estado del reporte",
               dataIndex: 'estado',
               width: 150,
               hidden: true,
               hideable: false
            },{
               header: "identidad",
               dataIndex: 'identidad',
               hidden: true,
               hideable: false
            },{
               header: "idusuario",
               dataIndex: 'idusuario',
               hidden: true,
               hideable: false
            }
        ]);
        this.cmReportesCertificaciones.defaultSortable = true;
        this.reportecertificacionseleccionado = null;
        this.gpReportesCertificaciones = new Ext.grid.GridPanel({
			    title: 'Listado de reportes y certificaciones',
                store: this.stReportesCertificaciones,
                region: 'center',
                loadMask: {text: 'Cargando...'},
                width: '100%',
				cm: this.cmReportesCertificaciones,
				viewConfig: {
					forceFit: true
				},
				split: true,
                view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
                sm: new Ext.grid.RowSelectionModel({
					singleSelect: true,
					listeners: {
						rowselect: function(sm, index, record){
							this.fireEvent('reporteycertificacionseleccionado', record);
							this.gpPersonasReportesCertificaciones.enable();
							this.reportecertificacionseleccionado = record;
							this.CargarPersonasReportesCertificaciones();
						}.createDelegate(this)
					}
				}),
				bbar:new Ext.PagingToolbar({
					pageSize: this.cantidadPorPagina,
					store: this.stReportesCertificaciones,
					displayInfo: true,
					displayMsg: 'Mostrando  {0} - {1} de {2}',
					emptyMsg: "0 Resultado a mostrar"
				})
         });


         this.stPersonasReportesCertificaciones = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/listarreportesycertificacionescomp/obtenerpersonasreportesycertificaciones',
            baseParams: {idreportescertificaciones:  -1, nivel: -1},
            sortInfo: {field: 'denominacion', direction: "ASC"},
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idelementosreportescertificaciones" },
			[ 	 {name: 'idelementosreportescertificaciones'}
				,{name: 'idreportescertificaciones'}
				,{name: 'denominacion'}
				,{name: 'idelemento'}
				,{name: 'aprobado'}
			])
		});

		this.smPersonasReportesCertificaciones = new Ext.grid.CheckboxSelectionModel({
					singleSelect: false,
					listeners: {
						rowselect: function(sm, index, record){
							this.fireEvent('personareporteycertificacionseleccionado', record);
						}.createDelegate(this)
					}
		});

		this.cmPersonasReportesCertificaciones = new Ext.grid.ColumnModel([this.smPersonasReportesCertificaciones, {
               id:'idelementosreportescertificaciones',
               header: "idelementosreportescertificaciones",
               dataIndex: 'idelementosreportescertificaciones',
               hidden: true,
               hideable: false
            },{
               header: "idreportescertificaciones",
               dataIndex: 'idreportescertificaciones',
               hidden: true,
               hideable: false
            },{
               header: "idelemento",
               dataIndex: 'idelemento',
               hidden: true,
               hideable: false
            },{
               header: "aprobado",
               dataIndex: 'aprobado',
               hidden: true,
               hideable: false
            },{
               header: "Nombre y apellidos",
               dataIndex: 'denominacion',
               width: 250
            }
        ]);
        this.cmPersonasReportesCertificaciones.defaultSortable = true;

		this.gpPersonasReportesCertificaciones = new Ext.grid.GridPanel({
			title: 'Listado de personas',
			split: true,
			store: this.stPersonasReportesCertificaciones,
			region: 'east',
			loadMask: {text: 'Cargando...'},
			width: 250,
			cm: this.cmPersonasReportesCertificaciones,
			viewConfig: {
				forceFit: true
			},
			sm: this.smPersonasReportesCertificaciones
		});

		this.CargarReportesCertificaciones = function(){
			this.stReportesCertificaciones.removeAll();
			this.stPersonasReportesCertificaciones.removeAll();
			this.gpPersonasReportesCertificaciones.disable();
			this.stReportesCertificaciones.baseParams.modomostrar = this.modoMostrar;
			this.stReportesCertificaciones.baseParams.identidad = this.identidad;
			this.stReportesCertificaciones.load({params: {limit: this.cantidadPorPagina, start: 0}});
		}

		this.CargarPersonasReportesCertificaciones = function(){
			this.stPersonasReportesCertificaciones.removeAll();
			this.stPersonasReportesCertificaciones.baseParams.idreportescertificaciones = this.reportecertificacionseleccionado.data.idreportescertificaciones;
			this.stPersonasReportesCertificaciones.baseParams.nivel = this.reportecertificacionseleccionado.data.nivel;
			this.stPersonasReportesCertificaciones.load();
		}

		this.CambiarEntidad = function(identidad){
			this.identidad = identidad;
		}

        this.items  =  (this.modoVisualizacion == 2 ? [this.gpReportesCertificaciones] : [this.gpReportesCertificaciones, this.gpPersonasReportesCertificaciones]);
        Pvd.Nomina.ReportesyCertificaciones.panelListarReportesCertificacionesPersonasComp.superclass.initComponent.call(this);
    },
    getSelectedRows: function(){
		return this.gpPersonasReportesCertificaciones.getSelectionModel().getSelections();
	}

});
