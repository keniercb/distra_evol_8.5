/**
 Uso:Componente para listar los periodos por destajo
 * @extends   Ext.Panel
 * @xtype
 * @autor     Linea Capital Humano - Ing. Aroldo L. Hechavarría Hechavarría
 */
Ext.ns('Pvd.Nomina.Pagos.PagoDestajo');

Pvd.Nomina.Pagos.PagoDestajo.Modelo = {
    init: function () {

        //Store del listado de personas brigada.
        this.storePersonasBrigada = new Ext.data.GroupingStore({
            url: 'obtenerListadoPersonasBrigada',
            sortInfo: {field: 'denominacion', direction: "DESC"},
            groupField: 'denominacion',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idpersonabrigada"
            }, [
                {name: 'idpersona'},
                {name: 'idpersonabrigada'},
                {name: 'grupoescala'},
                {name: 'importe'},
                {name: 'trt'},
                {name: 'ft'},
                {name: 'evaluacion'},
                {name: 'salarioeval'},
                {name: 'salariotrt'},
                {name: 'montocobrar'},
                {name: 'numid'},
                {name: 'denominacion'},
                {name: 'nombreapellidos'},
                {name: 'ordenunico'}
            ])
        });

        //Store del listado de personas brigada.
        this.storeConvenios = new Ext.data.GroupingStore({
            url: 'obtenerListadoConvenios',
            sortInfo: {field: 'idconvenio', direction: "DESC"},
            groupField: 'obra',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idconvenio"
            }, [
                {name: 'idconvenio'},
                {name: 'denominacion'},
                {name: 'obra'},
                {name: 'importe'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'descripcion'},
                {name: 'denomsumaxobra'}
            ])
        });
        
        this.stPeriodosDestajo = new Ext.data.GroupingStore({
            url: 'obtenerPeriodosPagoDestajo',
            sortInfo: {field: 'iddatpagodestajo', direction: "DESC"},
            groupField: 'anno',
            reader: new Ext.data.JsonReader({
                root: "datos",
                autoLoad: true,
                totalProperty: "cantidad",
                id: "iddatpagodestajo"
            }, [
                {name: 'iddatpagodestajo'},
                {name: 'fechacierre'},
                {name: 'periodo'},
                {name: 'anno'},
                {name: 'estado'},
            ])
        });
        
        //Store del listado de tipos de destajo.
        this.storeDestajo = new Ext.data.Store({
           url: '/pvd/nomina/index.php/nomtipodestajo/obtenerListadoDestajo',
           autoLoad: true,
           reader:new Ext.data.JsonReader(
           {totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idnomtipodestajo" }, 
           [ 	 {name: 'idnomtipodestajo'}
               ,{name: 'denominacion'}		
               ,{name: 'fechainicio'}	
               ,{name: 'fechafin'}	
               ,{name: 'descripcion'}	
           ])
       });
        
       //Store del listado de tipos de destajo.
       this.storeSeleccionBrigada = new Ext.data.Store({
            url: 'obtenerListadoPlantillaNominal',
            reader:new Ext.data.JsonReader(
            {
                totalProperty: "cantidad",
                autoLoad:true, 
                root: "datos", 
                id: "idplantillanominal" 
            }, 
            [ 	 {name: 'idplantillanominal'}
                ,{name: 'denominacion'}		
                ,{name: 'fechainicio'}		
                ,{name: 'fechafin'}		
                ,{name: 'descripcion'}		
                ,{name: 'identidad'}		
                ,{name: 'codigo'}		
                ,{name: 'idarea'}		
                ,{name: 'orden'}		
                ,{name: 'idcentrocosto'}		
                ,{name: 'idestructurasincroniza'}		
            ])
        });
        
        //Store del listado de tipos de destajo.
        this.storeConfiguracion = new Ext.data.Store({
             url: 'obtenerListadoConfPagoDestajo',
             reader:new Ext.data.JsonReader(
             {
                 totalProperty: "cantidad",
                 autoLoad:true, 
                 root: "datos", 
                 id: "idconfpagodestajo" 
             }, 
             [ 	 {name: 'idconfpagodestajo'}
                 ,{name: 'denominacion'}		
                 ,{name: 'tipoentrada'}		
                 ,{name: 'entrada'}		
                 ,{name: 'idformula'}		
                 ,{name: 'descripcion'}		
                 ,{name: 'identidad'}		
                 ,{name: 'orden'}		
                 ,{name: 'denomformula'}		
             ])
         });

         this.storeTipoEntrada = new Ext.data.SimpleStore({
            fields: ['id', 'denominacion'],
            data: [
                [1, 'Reportes'],
                [2, 'Tipo de pagos']
            ]
        });

        this.storeEntrada = new Ext.data.Store({
            url: 'obtenerListadoEntrada',
            reader:new Ext.data.JsonReader(
            {
                totalProperty: "cantidad",
                autoLoad:true, 
                root: "datos", 
                id: "id" 
            }, 
            [ 	 
                {name: 'denominacion'}	
            ])
        });

        this.storeObra = new Ext.data.Store({
            url: 'obtenerListadoObraEntidad',
            reader:new Ext.data.JsonReader(
            {
                totalProperty: "cantidad",
                autoLoad:true, 
                root: "datos", 
                id: "id" 
            }, 
            [ 	 
                {name: 'denominacion'}	
            ])
        });
        
        //Store del listado de tipos de destajo.
        this.storeTipoReporte = new Ext.data.Store({
            url: 'obteneridconfreportescertificaciones',
            reader:new Ext.data.JsonReader(
            {
                totalProperty: "cantidad",
                autoLoad:true, 
                root: "datos"
            }, 
            [ 	 
            {name: 'idconfreportescertificaciones'}		
            ]),
            listeners: {
                beforeload: function () {
                },
                load: function (t, n, e) {
                    idconfreportescertificaciones = t.reader.jsonData.datos[0].idconfreportescertificaciones;
                }
            }
     
         });

        //Store para cargar las variables de tipos de reportes y certificaciones
        this.stVariablesTiposRepCert = new Ext.data.Store({
            url: 'obtenervariablesconfiguracionesreportescertificaciones',
            baseParams: {idconfreportescertificaciones: -1},
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idvariablesconfreportescertificaciones"
                },
                [
                    {name: 'idvariablesconfreportescertificaciones'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'tipovalor'}
                    ,
                    {name: 'idnomencladorreferencia'}
                    ,
                    {name: 'nomenclador'}
                    ,
                    {name: 'tiponomenclador'}
                    ,
                    {name: 'nivelaplicarvalor'}
                    ,
                    {name: 'idconfreportescertificaciones'}
                    ,
                    {name: 'lugaresdecimales'}
                    ,
                    {name: 'min'}
                    ,
                    {name: 'max'}
                    ,
                    {name: 'calculable'}
                    ,
                    {name: 'idexpresionmatematica'}
                    ,
                    {name: 'textoexpresionmatematica'}
                    ,
                    {name: 'textoexpresionmatematicahistoriconominasreportes'}
                    ,
                    {name: 'descripcion'}
                    ,
                    {name: 'orden'}
                    ,
                    {name: 'calculablehistoriconominasreportes'}
                    ,
                    {name: 'idexpresionmatematicahistoriconominasreportes'}
                    ,
                    {name: 'idvariablesconfreportescertificacionesreportesanteriores'}
                    ,
                    {name: 'denomvariablereporteanterior'}
                    ,
                    {name: 'idvariablesconfreportescertiicacionesmesinicial'}
                    ,
                    {name: 'denomvariablemesinicial'}
            ]),
            listeners: {
                beforeload: function () {
                },
                load: function (t, n, e) {
                    datosvariable = t.reader.jsonData.datos;
                }
            }
        });

    }
};

