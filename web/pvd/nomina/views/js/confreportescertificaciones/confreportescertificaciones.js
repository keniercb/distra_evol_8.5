Ext.ns('Pvd.Nomina.ReportesyCertificaciones.ConfReportesyCertificaciones');
Ext.QuickTips.init();
var variablesGlobales = {};
//Modelo de la vista del componente Nomencladores de nóminas.
Pvd.Nomina.ReportesyCertificaciones.ConfReportesyCertificaciones.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function (idioma) {

        this.datosModelo = null;

        //Store para cargar los tipos de reportes y certificaciones
        this.stTiposRepCert = new Ext.data.Store({
            url: 'obtenerconfiguracionesreportescertificaciones',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idconfreportescertificaciones"},
                [
                    {name: 'idconfreportescertificaciones'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'comportamiento'}
                    ,
                    {name: 'comportamientoreportesc4'}
                    ,
                    {name: 'nivel'}
                    ,
                    {name: 'obligatorioprocesarlo'}
                    ,
                    {name: 'aprobacionelementos'}
                    ,
                    {name: 'aplicaren'}
                    ,
                    {name: 'mesessnc'}
                    ,
                    {name: 'tiposeleccionpersonas'}
                    ,
                    {name: 'denominaciontiposeleccionpersonas'}
                ])
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
                ])
        });

        this.stNivel = new Ext.data.SimpleStore({
            fields: [
                {name: 'valor'},
                {name: 'denominacion'}
            ]
        });

        this.stComportamiento = new Ext.data.SimpleStore({
            fields: [
                {name: 'deresultados'},
                {name: 'denominacioncomportamiento'}
            ]
        });

        this.stComportamientoReporte = new Ext.data.SimpleStore({
            fields: [
               {name:'represultados'},
               {name:'repdenominacion'}
            ]
        })

        this.stTipoSeleccionPersonas = new Ext.data.SimpleStore({
            fields: [
                {name: 'tiposeleccionpersonas'},
                {name: 'denominaciontiposeleccionpersonas'}
            ],
            data  : [
                [1, 'Todas las personas'],
                [2, 'Especificas']
            ]
        });

        this.stObligatorioProcesarlo = new Ext.data.SimpleStore({
            fields: [
                {name: 'valor'},
                {name: 'denominacion'}
            ]
        });

        this.stAprobacionElementos = new Ext.data.SimpleStore({
            fields: [
                {name: 'valor'},
                {name: 'denominacion'}
            ]
        });

        this.stAplicarEn = new Ext.data.SimpleStore({
            fields: [
                {name: 'valor'},
                {name: 'denominacion'}
            ]
        });

        this.stTipoValor = new Ext.data.SimpleStore({
            fields: [
                {name: 'valor'},
                {name: 'denominacion'}
            ]
        });

        this.stNivelAplicarValor = new Ext.data.SimpleStore({
            fields: [
                {name: 'valor'},
                {name: 'denominacion'}
            ]
        });

        this.stNomencladorReferencia = new Ext.data.SimpleStore({
            fields: [
                {name: 'idnomencladorreferencia'},
                {name: 'denominacion'},
                {name: 'tiponomenclador'}
            ]
        });

        this.stTiposNominas = new Ext.data.Store({
            url: 'obtenerTiposNominas',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idtiponomina"},
                [{name: 'idtiponomina'}
                    , {name: 'denominaciontiponomina'}
                ]),
        });

        this.stReportesAnteriores = new Ext.data.GroupingStore({
            url: 'obtenerVariablesReportesAnteriores',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idvariablesconfreportescertificaciones"},
                [{name: 'idvariablesconfreportescertificaciones'}
                    , {name: 'denominacion'}
                    , {name: 'tipovalor'}
                    , {name: 'idnomencladorreferencia'}
                    , {name: 'nivelaplicarvalor'}
                    , {name: 'idconfreportescertificaciones'}
                    , {name: 'lugaresdecimales'}
                    , {name: 'tipovariable'}
                    , {name: 'plantilla'}
                ]),
            sortInfo: {field: 'idconfreportescertificaciones', direction: "ASC"},
            groupField: 'plantilla',
            autoLoad: true,
        });

        this.stMesInicial = new Ext.data.GroupingStore({
            url: 'obtenerVariablesMesInicial',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idvariablesconfreportescertificaciones"},
                [{name: 'idvariablesconfreportescertificaciones'}
                    , {name: 'denominacion'}
                    , {name: 'tipovalor'}
                    , {name: 'idnomencladorreferencia'}
                    , {name: 'nivelaplicarvalor'}
                    , {name: 'idconfreportescertificaciones'}
                    , {name: 'lugaresdecimales'}
                    , {name: 'tipovariable'}
                    , {name: 'plantilla'}
                ]),
            sortInfo: {field: 'idconfreportescertificaciones', direction: "ASC"},
            groupField: 'plantilla',
            autoLoad: true,
        });

        this.cargarConfiguracion = function () {

            var a = new Array();
            for (var i = 0; i < this.datosModelo.nivel.length; i++) {
                var t = new Array();
                t[0] = this.datosModelo.nivel[i].valor;
                t[1] = this.datosModelo.nivel[i].denominacion;
                a[i] = t;
            }
            this.stNivel.loadData(a);

            var a = new Array();
            for (var i = 0; i < this.datosModelo.comportamiento.length; i++) {
                var t = new Array();
                t[0] = this.datosModelo.comportamiento[i].valor;
                t[1] = this.datosModelo.comportamiento[i].denominacion;
                a[i] = t;
            }
            this.stComportamiento.loadData(a);

            var a = new Array();
            for (var i = 0; i < this.datosModelo.comportamientoreporte.length; i++) {
                var t = new Array();
                t[0] = this.datosModelo.comportamientoreporte[i].valor;
                t[1] = this.datosModelo.comportamientoreporte[i].denominacion;
                a[i] = t;
            }
            this.stComportamientoReporte.loadData(a);

            var a = new Array();
            for (var i = 0; i < this.datosModelo.obligatorioprocesarlo.length; i++) {
                var t = new Array();
                t[0] = this.datosModelo.obligatorioprocesarlo[i].valor;
                t[1] = this.datosModelo.obligatorioprocesarlo[i].denominacion;
                a[i] = t;
            }
            this.stObligatorioProcesarlo.loadData(a);

            var a = new Array();
            for (var i = 0; i < this.datosModelo.aprobacionelementos.length; i++) {
                var t = new Array();
                t[0] = this.datosModelo.aprobacionelementos[i].valor;
                t[1] = this.datosModelo.aprobacionelementos[i].denominacion;
                a[i] = t;
            }
            this.stAprobacionElementos.loadData(a);

            var a = new Array();
            for (var i = 0; i < this.datosModelo.aplicaren.length; i++) {
                var t = new Array();
                t[0] = this.datosModelo.aplicaren[i].valor;
                t[1] = this.datosModelo.aplicaren[i].denominacion;
                a[i] = t;
            }
            this.stAplicarEn.loadData(a);

            var a = new Array();
            for (var i = 0; i < this.datosModelo.tipovalor.length; i++) {
                var t = new Array();
                t[0] = this.datosModelo.tipovalor[i].valor;
                t[1] = this.datosModelo.tipovalor[i].denominacion;
                a[i] = t;
            }
            this.stTipoValor.loadData(a);

            var a = new Array();
            for (var i = 0; i < this.datosModelo.nivelaplicarvalor.length; i++) {
                var t = new Array();
                t[0] = this.datosModelo.nivelaplicarvalor[i].valor;
                t[1] = this.datosModelo.nivelaplicarvalor[i].denominacion;
                a[i] = t;
            }
            this.stNivelAplicarValor.loadData(a);

            var a = new Array();
            var t = new Array();
            t[0] = -1;
            t[1] = 'Ninguno';
            t[2] = '999';
            a[0] = t;
            for (var i = 0; i < this.datosModelo.nomencladorreferencia.length; i++) {
                var t = new Array();
                t[0] = this.datosModelo.nomencladorreferencia[i].idnomencladorreferencia;
                t[1] = this.datosModelo.nomencladorreferencia[i].denominacion;
                t[2] = this.datosModelo.nomencladorreferencia[i].tiponomenclador;
                a[i + 1] = t;
            }

            this.stNomencladorReferencia.loadData(a);
        }
    }
};

//Vista del componente Nomencladores de nóminas.
Pvd.Nomina.ReportesyCertificaciones.ConfReportesyCertificaciones.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo).
     */
    init: function (perfil, idioma, modelo) {

        var self = this;

        this.cmTipoRepCert = new Ext.grid.ColumnModel([
            {
                id: 'idconfreportescertificaciones',
                header: "idconfreportescertificaciones",
                dataIndex: 'idconfreportescertificaciones',
                hidden: true,
                hideable: false
            },
            {
                header: "Denominaci&oacute;n",
                dataIndex: 'denominacion',
                width: 400
            },
            {
                header: "Nivel",
                dataIndex: 'nivel',
                hidden: true,
                width: 100,
                renderer: function (val) {
                    if (val != '' || val != null || val) {
                        return modelo.stNivel.getAt(modelo.stNivel.find('valor', val)).get('denominacion');
                    } else return val;
                }.createDelegate(this)
            },
            {
                header: "Comportamiento",
                dataIndex: 'denominacioncomportamiento',
                //hidden: true,
                width: 100,
                renderer: function (val, metaData, record, rowIndex, colIndex, store) {
                    if (record.get('comportamiento') == 2) {
                         return 'Reporte de vacaciones';
                    } else if (record.get('comportamiento') == 7) {
                        return 'Reporte de antiguedad';
                    }else if (record.get('comportamiento') == 3) {
                        return 'Reporte de Licencia de Maternidad';
                    }else if (record.get('comportamiento') == 4) {
                        return 'Reporte de ausencias';
                    }else if (record.get('comportamiento') == 8) {
                        return 'Reporte de Subsidios y Prestación Social';
                    }else if (record.get('comportamiento') == 5) {
                        return 'Reporte de evaluaciones individuales';
                    }else if (record.get('comportamiento') == 6) {
                        return 'Reporte de reintegros';
                    }else if (record.get('comportamiento') == 10) {
                        return 'Reporte de talleres';
                    }
                     else {
                        return 'Sin comportamiento';
                    };
                }.createDelegate(this)
            },{
                header: "Comportamiento Reporte SC-4-04",
                dataIndex:'comportamientoreportesc4',
                width:50,
                renderer: function (val, metaData, record, rowIndex, colIndex, store){
                    switch(val){
                       case '1': return 'Sin Comportamiento';
                       case '2': return 'Reporte de Vacaciones';
                       case '3': return 'Reporte de Subsidios';
                       case '4': return 'Reporte de Licencia de Maternidad';  
                       case '5': return 'Reporte de Pago a Destajo';  
                    }
                }.createDelegate(this)
            },
            {
                header: "Obligatorio procesar",
                dataIndex: 'obligatorioprocesarlo',
                hidden: true,
                width: 130,
                renderer: function (val) {
                    if (val != '' || val != null || val) {
                        return modelo.stObligatorioProcesarlo.getAt(modelo.stObligatorioProcesarlo.find('valor', val)).get('denominacion');
                    } else return val;
                }.createDelegate(this)
            },
            {
                header: "Aprobar elementos",
                dataIndex: 'aprobacionelementos',
                width: 130,
                hidden: true,
                renderer: function (val) {
                    if (val != '' || val != null || val) {
                        return modelo.stAprobacionElementos.getAt(modelo.stAprobacionElementos.find('valor', val)).get('denominacion');
                    } else return val;
                }.createDelegate(this)
            },
            {
                header: "Aplicar en",
                dataIndex: 'aplicaren',
                hidden: true,
                width: 100,
                renderer: function (val) {
                    if (val != '' || val != null || val) {
                        return modelo.stAplicarEn.getAt(modelo.stAplicarEn.find('valor', val)).get('denominacion');
                    } else return val;
                }.createDelegate(this)
            }
            ,
            {
                header: "Tipo selecci&oacute;n personas",
                dataIndex: 'denominaciontiposeleccionpersonas',
                width: 100,
                renderer: function (val, metaData, record, rowIndex, colIndex, store) {
                    if (record.get('tiposeleccionpersonas') == 1) {
                        return 'Todas las personas';
                    } else {
                        return 'Espec&iacute;ficas';
                    };
                }.createDelegate(this)
            },
            {
                header: "Meses",
                dataIndex: 'mesessnc',
                width: 100,
            }

        ]);

        this.cmTipoRepCert.defaultSortable = true;

        this.expanderDescripcionVariables = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;">' +
                '<p style="float: left; font-weight: bold">&nbsp;&nbsp;Descripci&oacute;n: &nbsp;</p> ' +
                '<p style="float: left;"> {descripcion}</p><br/>' +
                '</div>'
            ), enableCaching: false
        });

        function centrarValor(val) {
            return '<center>' + val + '</center>';
        };

        this.cmVariablesTipoRepCert = new Ext.grid.ColumnModel([
            {
                id: 'idvariablesconfreportescertificaciones',
                header: "idvariablesconfreportescertificaciones",
                dataIndex: 'idvariablesconfreportescertificaciones',
                hidden: true,
                hideable: false
            },
            {
                header: "idconfreportescertificaciones",
                dataIndex: 'idconfreportescertificaciones',
                hidden: true,
                hideable: false
            },
            {
                header: "Denominaci&oacute;n",
                dataIndex: 'denominacion',
                width: 350
            },
            this.expanderDescripcionVariables,
            {
                header: "Tipo de valor",
                dataIndex: 'tipovalor',
                hidden: true,
                width: 200,
                renderer: function (val) {
                    if (val != '' || val != null || val) {
                        return modelo.stTipoValor.getAt(modelo.stTipoValor.find('valor', val)).get('denominacion');
                    } else return val;
                }.createDelegate(this)
            },
            {
                header: "Cantidad de lugares decimales",
                dataIndex: 'lugaresdecimales',
                width: 100,
                renderer: centrarValor
            },
            {
                header: "idnomencladorreferencia",
                dataIndex: 'idnomencladorreferencia',
                width: 130,
                hidden: true,
                hideable: false
            },
            {
                header: "Nomenclador referencia",
                dataIndex: 'nomenclador',
                hidden: true,
                width: 200
            },
            {
                header: "Valor m&iacute;nimo",
                dataIndex: 'min',
                hidden: false,
                width: 50,
                renderer: centrarValor
            },
            {
                header: "Valor m&aacute;ximo",
                dataIndex: 'max',
                hidden: false,
                width: 50,
                renderer: centrarValor
            },
            {
                header: "Orden",
                dataIndex: 'orden',
                hidden: false,
                width: 50,
                renderer: centrarValor
            },
            {
                header: "Calculable",
                dataIndex: 'calculable',
                hidden: false,
                width: 50,
                renderer: function (val) {
                    if (val == 0) {
                        return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierreno.png" height=16 width=16 /></center>';
                    } else {
                        return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierresi.png" height=16 width=16 /></center>';
                    }
                }.createDelegate(this)
            },
            {
                header: "id formula",
                dataIndex: 'idexpresionmatematica',
                hidden: true,
            },
            {
                header: "F&oacute;rmula",
                dataIndex: 'textoexpresionmatematica',
                hidden: false,
                width: 250
            },
            {
                header: "F&oacute;rmula Hist.",
                dataIndex: 'textoexpresionmatematicahistoriconominasreportes',
                hidden: false,
                width: 250
            },
            {
                header: "Nivel aplicar valor",
                dataIndex: 'nivelaplicarvalor',
                width: 60,
                renderer: function (val) {
                    return '<center>' + ((val != '' || val != null || val) ? modelo.stNivelAplicarValor.getAt(modelo.stNivelAplicarValor.find('valor', val)).get('denominacion') : val) + '</center>';
                }.createDelegate(this)
            }

        ]);

        this.cmVariablesTipoRepCert.defaultSortable = true;

        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Ad<u>i</u>cionar tipo de reporte y certificación (<b>Alt+I</b>)',
//            icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });

        this.btnAdicionarVariables = new Ext.Button({
            id: 'btnAdicionarVariables',
            text: 'Ad<u>i</u>cionar',
            disabled: true,
            tooltip: 'Ad<u>i</u>cionar variable de tipo de reporte y certificación (<b>Alt+I</b>)',
//            icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });

        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: '<u>M</u>odificar',
            tooltip: '<u>M</u>odificar tipo de reporte y certificación (<b>Alt+M</b>)',
            disabled: true,
//            icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar'/*,
             prevTab: 'btnAddFormP',
             nextTab: 'btnElimFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });

        this.btnModificarVariables = new Ext.Button({
            id: 'btnModificarVariables',
            text: '<u>M</u>odificar',
            tooltip: '<u>M</u>odificar variable de tipo de reporte y certificación (<b>Alt+M</b>)',
            disabled: true,
//            icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar'/*,
             prevTab: 'btnAddFormP',
             nextTab: 'btnElimFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: 'Eliminar',
            tooltip: 'Eliminar tipo de reporte y certificación (<b>DEL</b>)',
            disabled: true,
//            icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar'/*,
             prevTab: 'btnModFormP',
             nextTab: 'btnAyudaFormP',*/
        });

        this.btnEliminarVariables = new Ext.Button({
            id: 'btnEliminarVariables',
            text: 'Eliminar',
            tooltip: 'Eliminar variable de tipo de reporte y certificación (<b>DEL</b>)',
            disabled: true,
//            icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar'/*,
             prevTab: 'btnModFormP',
             nextTab: 'btnAyudaFormP',*/
        });

        this.tfbuscar = new Ext.form.TextField({
            id:'tfbuscar',
            allowBlank : true,
            minLength: 1,
            enableKeyEvents: true,
            regexp : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width:120,
            emptyText: 'Criterio a buscar',
            name : 'tfbuscador'
        });
        this.btnBuscar = new Ext.Button({
            disabled : false,
            id : 'btnBuscar',
            iconCls : 'buscar',
            text : '<u>B</u>uscar',
            tooltip: 'Buscar reportes y certificaciones <b>(Alt+B)</b>',
            handler : function() {
                this.Buscar();
            }
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad',
            // icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',

        });

        this.gpTipoRepCert = new Ext.grid.GridPanel({
            title: 'Listado de tipo de reportes y certificaciones',
            region: 'north',
            layout: 'fit',
            split: true,
            store: modelo.stTiposRepCert,
            autoScroll: true,
            cm: this.cmTipoRepCert,
            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
            width: 600,
            height: 300,
            viewConfig: {forceFit: true},
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.stTiposRepCert,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),

        });

        this.gpVariablesTipoRepCert = new Ext.grid.GridPanel({
            title: 'Listado de variables de tipo de reportes y certificaciones',
            region: 'center',
            layout: 'fit',
//            disabled: true,
            store: modelo.stVariablesTiposRepCert,
            autoScroll: true,
            viewConfig: {forceFit: true},
            cm: this.cmVariablesTipoRepCert,
            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
            plugins: this.expanderDescripcionVariables,
            width: 600,
            height: 300,
            loadMask: {msg: 'Cargando...'}
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)',
//            icon: perfil.dirImg+'aceptar.png',
            iconCls: 'aceptar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
                this.winTipoRepCert.hide();
            }.createDelegate(this)
        });

        this.btnAceptarVariables = new Ext.Button({
            id: 'btnAceptarVariables',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)',
//            icon: perfil.dirImg+'aceptar.png',
            iconCls: 'aceptar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Ctrl+Alt+P</b>)',
//            icon: perfil.dirImg+'aplicar.png',
            iconCls: 'aplicar'/*,
             prevTab: 'btnAddFormP',
             nextTab: 'btnElimFormP',*/,
            handler: function () {
                this.winTipoRepCert.hide();
            }.createDelegate(this)
        });

        this.btnAplicarVariables = new Ext.Button({
            id: 'btnAplicarVariables',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Ctrl+Alt+P</b>)',
//            icon: perfil.dirImg+'aplicar.png',
            iconCls: 'aplicar'/*,
             prevTab: 'btnAddFormP',
             nextTab: 'btnElimFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });

        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
//            icon: perfil.dirImg+'cancelar.png',
            iconCls: 'cancelar'/*,
             prevTab: 'btnModFormP',idconfreportescertificaciones
             nextTab: 'btnAyudaFormP',*/,
            handler: function () {
                this.winTipoRepCert.hide();
            }.createDelegate(this)
        });

        this.btnCancelarVariables = new Ext.Button({
            id: 'btnCancelarVariables',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
//            icon: perfil.dirImg+'cancelar.png',
            iconCls: 'cancelar'/*,
             prevTab: 'btnModFormP',
             nextTab: 'btnAyudaFormP',*/,
            handler: function () {
                this.winVariablesTipoRepCert.hide();
            }.createDelegate(this)
        });

        this.tfDenominacion = new Ext.form.TextField({
            id: 'tfDenominacion',
            fieldLabel: 'Denominaci&oacute;n',
            allowBlank: false,
            anchor: '99%',
            maxLength: 50,
            blankText: 'Este campo es obligatorio.',
            vtype: 'vtdenominaciones'
        });

        this.cmbComportamiento = new Ext.form.ComboBox({
            id: 'cmbComportamiento',
            fieldLabel: 'Comportamiento',
            anchor: '99%',
            triggerAction: 'all',
            valueField: 'deresultados',
            displayField: 'denominacioncomportamiento',
            hiddenName: 'deresultados',
            allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.stComportamiento
        });

        this.cmbReporteSC4 = new Ext.form.ComboBox({
            id:'cmbReporteSC4',
            fieldLabel:'Comportamiento Reporte',
            anchor: '99%',
            triggerAction:'all',
            valueField:'represultados',
            displayField:'repdenominacion',
            hiddenName: 'represultados',
            allowBlank: false,
            mode:'local',
            blankText:'Este campo es obligatorio.',
            readOnly: true,
            store:modelo.stComportamientoReporte
        });  

        this.cmbTipoSeleccionPersonas = new Ext.form.ComboBox({
            id: 'cmbTipoSeleccionPersonas',
            fieldLabel: 'Tipo Selecci&oacute;n Personas',
            anchor: '99%',
            triggerAction: 'all',
            valueField: 'tiposeleccionpersonas',
            displayField: 'denominaciontiposeleccionpersonas',
            hiddenName: 'tiposeleccionpersonas',
            allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.stTipoSeleccionPersonas
        });

        this.tfDenominacionVariables = new Ext.form.TextField({
            id: 'tfDenominacionVariables',
            fieldLabel: 'Denominaci&oacute;n',
            allowBlank: false,
            anchor: '97%',
            maxLength: 50,
            blankText: 'Este campo es obligatorio.',
            vtype: 'vtdenominaciones'
        });

        this.cbNivel = new Ext.form.ComboBox({
            fieldLabel: 'Nivel',
            anchor: '98%',
            triggerAction: 'all',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.stNivel
        });

        this.cbTipoValor = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de valor',
            anchor: '90%',
            triggerAction: 'all',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.stTipoValor
        });

        this.nfCantidadLugaresDecimales = new Ext.form.NumberField({
            id: 'idnfCantidadLugaresDecimales', fieldLabel: 'Lugares decimales',
            name: 'lugaresdecimales', allowBlank: false,
            anchor: '95%',
            //blankText:idioma.lbErrorCampoVacio,
            maxLength: 6,
            //disabled                                                  : true,
            //maxLengthText:idioma.lbErrorCampoVacio,
            /*minLength:idioma.lbErrorCampoVacio,
             minLengthText:idioma.lbErrorCampoVacio,
             maskRe:idioma.lbErrorCampoVacio,
             regex:idioma.lbErrorCampoVacio,
             regexText:idioma.lbErrorCampoVacio*/
        });

        this.cbObligatorioProcesarlo = new Ext.form.ComboBox({
            fieldLabel: 'Obligatorio procesar',
            anchor: '98%',
            triggerAction: 'all',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            emptyText: 'Seleccione...',
            readOnly: true,
            store: modelo.stObligatorioProcesarlo
        });

        this.cbNomencladorReferencia = new Ext.form.ComboBox({
            fieldLabel: 'Nomenclador de referencia',
            anchor: '90%',
            triggerAction: 'all',
            valueField: 'idnomencladorreferencia',
            displayField: 'denominacion',
            hiddenName: 'idnomencladorreferencia',
            allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            emptyText: 'Seleccione...',
            readOnly: true,
            disabled: true,
            store: modelo.stNomencladorReferencia
        });

        this.cbAprobacionElementos = new Ext.form.ComboBox({
            fieldLabel: 'Aprobar elementos',
            anchor: '99%',
            triggerAction: 'all',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.stAprobacionElementos
        });

        this.cbNivelAplicarValor = new Ext.form.ComboBox({
            fieldLabel: 'Nivel aplicar valor',
            anchor: '88%',
            triggerAction: 'all',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.stNivelAplicarValor
        });

        this.cbAplicarEn = new Ext.form.ComboBox({
            fieldLabel: 'Aplicar en',
            anchor: '98%',
            triggerAction: 'all',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.stAplicarEn
        });

        this.nfmMesesSnc = new Ext.form.NumberField({
            id: 'mesessnc', fieldLabel: 'Meses',
            name: 'mesessnc',
            anchor: '95%',
            maxLength: 6,
            maxValue: 100,
            minValue: 1,
            //disabled: true,
            allowBlank: true,
            blankText: idioma.lbErrorCampoVacio
        });

        this.fpTipoRepCert = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            items: [
                this.tfDenominacion,
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.cmbTipoSeleccionPersonas]},
                       {columnWidth: .5, layout: 'form', items: [this.nfmMesesSnc]}
                    ]
               },this.cmbComportamiento, this.cmbReporteSC4
            ]
        });

        this.nfValorMinimo = new Ext.form.NumberField({
            id: 'idnfValorMinimo', fieldLabel: 'Valor m&iacute;nimo',
            name: 'valorminimo',
            anchor: '95%',
            maxLength: 12,
            maxValue: 999999999999,
            minValue: 0,
            allowBlank: false,
            blankText: idioma.lbErrorCampoVacio
        });

        this.nfValorMaximo = new Ext.form.NumberField({
            id: 'idnfValorMaximo', fieldLabel: 'Valor m&aacute;ximo',
            name: 'valormaximo',
            anchor: '95%',
            maxLength: 12,
            maxValue: 999999999999,
            minValue: 0,
            allowBlank: false,
            blankText: idioma.lbErrorCampoVacio
        });

        this.nfOrden = new Ext.form.NumberField({
            id: 'nfOrden', fieldLabel: 'Orden',
            name: 'orden',
            anchor: '73%',
            maxLength: 6,
            maxValue: 1000000,
            minValue: 0,
            allowBlank: false,
            blankText: idioma.lbErrorCampoVacio
        });

        this.chbEsCalculable = new Ext.form.Checkbox({
            id: 'idChbEsCalculable',
            fieldLabel: 'Es calculable',
            bottonAlign: 'center',
            tabIndex: 2, name: 'calculable', anchor: '95%'
        });

        this.chbNominasBuscarSNC = new Ext.form.Checkbox({
            id: 'chbNominasBuscarSNC',
            fieldLabel: 'Nominas',
            bottonAlign: 'center',
            tabIndex: 2, name: 'nominasbuscarsnc', anchor: '85%'
        });

        this.tfFormulaVariable = new Ext.form.TextField({
            id: 'idtfFormulaVariable', fieldLabel: 'F&oacute;rmula',
            name: 'variableformula',
            anchor: '99%',
            maxLength: 10000,
            maxLengthText: idioma.lbErrorCampoVacio,
            disabled: true
        });

        this.chbHistoricoNominasReportes = new Ext.form.Checkbox({
            id: 'chbHistoricoNominasReportes',
            fieldLabel: 'Hist&oacute;rico n&oacute;minas y reportes',
            bottonAlign: 'center',
            tabIndex: 2, name: 'calculablehistoriconominasreportes', anchor: '95%'
        });
//idexpresionmatematicahistoriconominasreportes
        this.tfFormulaHistoricoNominasReportes = new Ext.form.TextField({
            id: 'tfFormulaHistoricoNominasReportes', fieldLabel: 'F&oacute;rmula',
            name: 'variableformulahistoriconominasreportes',
            anchor: '95%',
            maxLength: 10000,
            maxLengthText: idioma.lbErrorCampoVacio,
            disabled: true
        });

        this.tfBusquedaReportesAnteriores = new Ext.form.TextField({
            id: 'tfBusquedaReportesAnteriores', fieldLabel: 'B&uacute;squeda en Reportes Anteriores',
            name: 'tfBusquedaReportesAnteriores',
            anchor: '97%',
            maxLength: 10000,
            maxLengthText: idioma.lbErrorCampoVacio,
            disabled: true,
            editable: false
        });

        this.tfVariableReporteMesInicial = new Ext.form.TextField({
            id: 'tfVariableReporteMesInicial', fieldLabel: 'Variable Reporte Mes Inicial',
            name: 'tfVariableReporteMesInicial',
            anchor: '97%',
            maxLength: 10000,
            maxLengthText: idioma.lbErrorCampoVacio,
            disabled: false,
            editable: false
        });

        this.taDescripcionVariables = new Ext.form.TextArea({
            id: 'taDescripcionVariables',
            name: 'descripcion',
            fieldLabel: 'Descripci&oacute;n',
            allowBlank: true,
            anchor: '97%',
        });



        this.fpVariablesTipoRepCert = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            width: 600,
            autoHeight: true,
            items: [
                {
                    layout: 'column',
                    items: [
                        //{columnWidth: .5, layout: 'form', items: [this.cbNomencladorReferencia]},
                        {columnWidth: .66, layout: 'form', items: [this.tfDenominacionVariables]},
                        {columnWidth: .34, layout: 'form', items: [this.cbNivelAplicarValor]}

                    ]
                },

                {
                    layout: 'column',
                    items: [
                        //{columnWidth: .5, layout: 'form', items: [this.cbNomencladorReferencia]},
                        {columnWidth: .35, layout: 'form', items: [this.nfCantidadLugaresDecimales]},
                        {columnWidth: .25, layout: 'form', items: [this.nfValorMinimo]},
                        {columnWidth: .25, layout: 'form', items: [this.nfValorMaximo]},
                        {columnWidth: .15, layout: 'form', items: [this.nfOrden]},
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {columnWidth: .33, layout: 'form', items: [this.chbEsCalculable]},
                        {columnWidth: .51, layout: 'form', items: [this.tfFormulaVariable]},
                        {columnWidth: .15, layout: 'form', items: [this.chbNominasBuscarSNC]}
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {columnWidth: .33, layout: 'form', items: [this.chbHistoricoNominasReportes]},
                        {columnWidth: .66, layout: 'form', items: [this.tfFormulaHistoricoNominasReportes]},
                        //{columnWidth: .33, layout: 'form', items: [this.nfmMesesSnc]}
                    ]
                },{
                    layout: 'column',
                    items: [

                        {columnWidth: 1, layout: 'form', items: [this.tfBusquedaReportesAnteriores]}
                    ]
                },{
                    layout: 'column',
                    items: [

                        {columnWidth: 1, layout: 'form', items: [this.tfVariableReporteMesInicial]}
                    ]
                },{
                    layout: 'column',
                    items: [

                        {columnWidth: 1, layout: 'form', items: [this.taDescripcionVariables]}
                    ]
                }
            ],
        });

        this.winTipoRepCert = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.fpTipoRepCert],
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

        //Ventana con las Variables de los Campos de Reportes que son Meses Iniciales
        this.smMesInicial = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.gpMesInicial = new Ext.grid.GridPanel({
            region: 'center',
            width: '500',
            height: 220,
            store: modelo.stMesInicial,
            loadMask: {msg: 'Por favor espere. Cargando datos ...'},
            sm: this.smMesInicial,
            columns: [
                {header: 'Denominaci&oacute;n', width: 350, dataIndex: 'denominacion'},
                {
                    header: 'idvariablesconfreportescertificaciones',
                    width: 350,
                    hidden: true,
                    dataIndex: 'idvariablesconfreportescertificaciones'
                },
                {header: 'plantilla', width: 350, hidden: true, dataIndex: 'plantilla'},
                {
                    header: 'idconfreportescertificaciones',
                    width: 350,
                    hidden: true,
                    dataIndex: 'idconfreportescertificaciones'
                },
            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),
        });

        this.btnAceptarMesInicial = new Ext.Button({
            id: 'btnAceptarMesInicial',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana'
        });

        this.btnCancelarMesInicial = new Ext.Button({
            id: 'btnCancelarMesInicial',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaMesInicial = new Ext.Window({
            region: 'center',
            title: 'Variable Mes Inicial Salarios Promedios',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
            items: [this.gpMesInicial],
            bbar: ['->', this.btnCancelarMesInicial, this.btnAceptarMesInicial]
        });

        //Ventana con las Variables de los Reportes a Buscar
        this.smReportesAnteriores = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.gpReportesAnteriores = new Ext.grid.GridPanel({
            region: 'center',
            width: '500',
            height: 220,
            store: modelo.stReportesAnteriores,
            loadMask: {msg: 'Por favor espere. Cargando datos ...'},
            sm: this.smReportesAnteriores,
            columns: [
                {header: 'Denominaci&oacute;n', width: 350, dataIndex: 'denominacion'},
                {
                    header: 'idvariablesconfreportescertificaciones',
                    width: 350,
                    hidden: true,
                    dataIndex: 'idvariablesconfreportescertificaciones'
                },
                {header: 'plantilla', width: 350, hidden: true, dataIndex: 'plantilla'},
                {
                    header: 'idconfreportescertificaciones',
                    width: 350,
                    hidden: true,
                    dataIndex: 'idconfreportescertificaciones'
                },
            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),
        });

        this.btnAceptarReportesAnteriores = new Ext.Button({
            id: 'btnAceptarReportesAnteriores',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana'
        });

        this.btnCancelarReportesAnteriores = new Ext.Button({
            id: 'btnCancelarReportesAnteriores',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaTipoReplica = new Ext.Window({
            region: 'center',
            title: 'Busqueda Reportes Anteriores',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
            items: [this.gpReportesAnteriores],
            //buttons: [this.btnCancelarAsociacion, this.btnAceptarAsociacion]
            bbar: ['->', this.btnCancelarReportesAnteriores, this.btnAceptarReportesAnteriores]
        });

        /********************************************************Ventana con las nominas que entran en el calculo del promedio***********************************************************/
        this.smTiposNominas = new Ext.grid.CheckboxSelectionModel({
            multiSelect: true
        });

        this.gpTiposNominas = new Ext.grid.GridPanel({
            id: 'idgpTiposNominas',
            title: 'Listado de Tipos de N&oacute;minas',
            region: 'center',
            columns: [this.smTiposNominas,
                {
                    header: 'idtiponomina',
                    hidden: true,
                    //hideable: false,
                    dataIndex: 'idtiponomina'
                },
                {
                    header: 'Tipo n&oacute;mina',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'denominaciontiponomina'
                }
            ],
            layout: 'fit',
            autoScroll: true,
            border: true,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.stTiposNominas,
            sm: this.smTiposNominas,
            loadMask: {msg: 'Cargando...'}
        });

        this.pTiposNomina = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            border: false,
            height: '100%',
            width: '100%',
            items: [this.gpTiposNominas]
        });

        this.btnAceptarTiposNominas = new Ext.Button({
            id: 'btnAceptarTiposNominas',
            text: 'Aceptar',
            tooltip: 'Aceptar (<b>Alt + X</b>)',
//            icon: perfil.dirImg+'cancelar.png',
            iconCls: 'aceptar'
        });

        this.btnCancelarTiposNominas = new Ext.Button({
            id: 'btnCancelarTiposNominas',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
//            icon: perfil.dirImg+'cancelar.png',
            iconCls: 'cancelar'/*,
             prevTab: 'btnModFormP',
             nextTab: 'btnAyudaFormP',*/,
            handler: function () {
                this.winTiposNominas.hide();
            }.createDelegate(this)
        });

        this.winTiposNominas = new Ext.Window({
            title: '',
            modal: true,
            width: 600,
            height: 400,
            closeAction: 'hide',
            closable: true,
            resizable: true,
            layout: 'border',
            items: [this.pTiposNomina],
            buttons: [this.btnCancelarTiposNominas, this.btnAceptarTiposNominas]
        });
        /*********************************************************************************************************************************************************************/

        this.winVariablesTipoRepCert = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.fpVariablesTipoRepCert],
            buttons: [this.btnCancelarVariables, this.btnAplicarVariables, this.btnAceptarVariables],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarVariables.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarVariables.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarVariables.handler();
                    }
                }
            ]
        });

        this.pVariablesTipoRepCert = new Ext.Panel({
            region: 'center',
            layout: 'border',
            split: true,
            width: 600,
            height: '35%',
            items: [this.gpVariablesTipoRepCert],
            tbar: [this.btnAdicionarVariables, this.btnModificarVariables, this.btnEliminarVariables],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        self.btnEliminarVariables.handler();
                    }
                },
                {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnModificarVariables.handler();
                    }
                },
                {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionarVariables.handler();
                    }
                }
            ]
        });

        //Vista general.
        new Ext.Viewport({
            layout: 'fit',
            items: [
                {
                    layout: 'border',
                    tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, '', '', '', '', '', '', '', '', this.tfbuscar, this.btnBuscar, '->', this.btnAyuda],
                    items: [this.gpTipoRepCert, this.pVariablesTipoRepCert],
                    keys: [
                        {
                            key: Ext.EventObject.DELETE,
                            stopEvent: true,
                            fn: function () {

                                self.btnEliminar.handler();
                            }
                        },
                        {
                            key: 'm',
                            alt: true,
                            stopEvent: true,
                            fn: function () {
                                self.btnModificar.handler();
                            }
                        },
                        {
                            key: 'i',
                            alt: true,
                            stopEvent: true,
                            fn: function () {

                                self.btnAdicionar.handler();
                            }
                        },
                        {
                            key: 'h',
                            alt: true,
                            stopEvent: true,
                            fn: function () {
                                self.btnAyuda.handler();
                            }
                        }
                    ]
                }
            ]

        });
    }
};

//Controlador de la vista del componente Nomencladores de nóminas.
Pvd.Nomina.ReportesyCertificaciones.ConfReportesyCertificaciones.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Vista)
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo)
     */
    init: function (idioma, vista, modelo) {
        var _this = this;
        this.accion = '';
        this.idexpresionmatematica = -1;
        var arraytiposnomina = new Array();

        var variables = {
            arrayindicadores: new Array(),
            idexpresionmatematica: -1,
            idexpresionmatematicahistoriconominasreportes: -1,
            idexpresionmatematicamarcada: -1,
            idexpresionmatematicamarcadahis: -1,
            idvariablesconfreportescertificacionesf: -1,
            idvariablesconfreportescertificacionesreportesanteriores: -1,
            idvariablesconfreportescertiicacionesmesinicial: -1,
            variablesreportecertificacionseleccionado: -1,
            orden: -1,
            accion: "ADD"
        };

        this.LimpiarFormulario = function () {
            vista.cbNivel.setValue(1);
            vista.cbObligatorioProcesarlo.setValue(1);
            vista.cbAprobacionElementos.setValue(1);
            vista.cbAplicarEn.setValue(1);
            vista.tfDenominacion.setValue('');
            vista.cmbComportamiento.setValue(0);
            vista.cmbTipoSeleccionPersonas.setValue(2);
            vista.tfDenominacion.focus();
        };

        this.LimpiarFormularioVariables = function () {
            vista.cbTipoValor.setValue('');
            vista.cbNomencladorReferencia.setValue(-1);
            vista.cbNomencladorReferencia.disable();
            vista.cbNivelAplicarValor.setValue(1);
            vista.tfDenominacionVariables.setValue('');
            vista.tfDenominacionVariables.focus();
            vista.tfFormulaHistoricoNominasReportes.setValue('');
            vista.tfBusquedaReportesAnteriores.setValue('');
            vista.tfVariableReporteMesInicial.setValue('');
            vista.tfFormulaVariable.setValue('');
            vista.tfFormulaVariable.disable();
            vista.chbEsCalculable.setValue(0);
            vista.chbNominasBuscarSNC.setValue(0);
            vista.tfFormulaHistoricoNominasReportes.setValue(0);
            vista.chbHistoricoNominasReportes.setValue(0);
            vista.taDescripcionVariables.setValue('');
            vista.nfOrden.setValue('');
            vista.nfValorMaximo.setValue('');
            vista.nfValorMinimo.setValue('');
            vista.nfCantidadLugaresDecimales.setValue('');
            vista.tfFormulaVariable.setValue('');
            vista.tfFormulaHistoricoNominasReportes.setValue('');
            vista.tfBusquedaReportesAnteriores.setValue('');
            vista.tfVariableReporteMesInicial.setValue('');
            vista.taDescripcionVariables.setValue('');

        };

        this.ObtenerDatosFormulario = function (accion) {
            if (accion == 'ADD') {
                return {
                    idconfreportescertificaciones: null,
                    denominacion: vista.tfDenominacion.getValue(),
                    comportamiento: vista.cmbComportamiento.getValue(),
                    comportamientoreporte: vista.cmbReporteSC4.getValue(),
                    tiposeleccionpersonas: vista.cmbTipoSeleccionPersonas.getValue(),
                    //  nivel                        : vista.cbNivel.getValue(),
                    //   obligatorioprocesarlo        : vista.cbObligatorioProcesarlo.getValue(),
                    aprobacionelementos: vista.cbAprobacionElementos.getValue(),
                    aplicaren: vista.cbAplicarEn.getValue()
                }
            } else if (accion == 'MOD') {
                return {
                    idconfreportescertificaciones: this.reportecertificacionseleccionado.data.idconfreportescertificaciones,
                    denominacion: vista.tfDenominacion.getValue(),
                    comportamiento: vista.cmbComportamiento.getValue(),
                    comportamientoreporte: vista.cmbReporteSC4.getValue(),
                    tiposeleccionpersonas: vista.cmbTipoSeleccionPersonas.getValue(),
                    // nivel                        : vista.cbNivel.getValue(),
                    // obligatorioprocesarlo        : vista.cbObligatorioProcesarlo.getValue(),
                    aprobacionelementos: vista.cbAprobacionElementos.getValue(),
                    aplicaren: vista.cbAplicarEn.getValue()
                }
            }
            else if (accion == 'DEL') {
                return {
                    idconfreportescertificaciones: this.reportecertificacionseleccionado.data.idconfreportescertificaciones
                }
            }
        }.createDelegate(this);

        this.ObtenerDatosFormularioVariables = function (accion) {
            if (accion == 'ADD') {
                return {
                    idvariablesconfreportescertificaciones: null,
                    denominacion: vista.tfDenominacionVariables.getValue(),
                    tipovalor: vista.cbTipoValor.getValue(),
                    idnomencladorreferencia: vista.cbNomencladorReferencia.getValue(),
                    nivelaplicarvalor: vista.cbNivelAplicarValor.getValue(),
                    idconfreportescertificaciones: this.reportecertificacionseleccionado.data.idconfreportescertificaciones,
                    lugaresdecimales: vista.nfCantidadLugaresDecimales.getValue(),
                    minimo: vista.nfValorMinimo.getValue(),
                    maximo: vista.nfValorMaximo.getValue(),
                    orden: vista.nfOrden.getValue(),
                    calculable: (vista.chbEsCalculable.checked == true ? 1 : 0),
                    buscarnominasnc: (vista.chbNominasBuscarSNC.checked == true ? 1 : 0),
                    historiconominasreportes: (vista.chbHistoricoNominasReportes.checked == true ? 1 : 0),
                    idexpresionmatematica: variables.idexpresionmatematica,
                    idexpresionmatematicahistoriconominasreportes: variables.idexpresionmatematicanominasreportes,
                    descripcion: vista.taDescripcionVariables.getValue(),
                    arraynominas: arraytiposnomina
                }
            } else if (accion == 'MOD') {
                return {
                    idvariablesconfreportescertificaciones: this.variablesreportecertificacionseleccionado.data.idvariablesconfreportescertificaciones,
                    denominacion: vista.tfDenominacionVariables.getValue(),
                    tipovalor: vista.cbTipoValor.getValue(),
                    idnomencladorreferencia: vista.cbNomencladorReferencia.getValue(),
                    nivelaplicarvalor: vista.cbNivelAplicarValor.getValue(),
                    idconfreportescertificaciones: this.reportecertificacionseleccionado.data.idconfreportescertificaciones,
                    lugaresdecimales: vista.nfCantidadLugaresDecimales.getValue(),
                    minimo: vista.nfValorMinimo.getValue(),
                    maximo: vista.nfValorMaximo.getValue(),
                    orden: vista.nfOrden.getValue(),
                    calculable: (vista.chbEsCalculable.checked == true ? 1 : 0),
                    buscarnominasnc: (vista.chbNominasBuscarSNC.checked == true ? 1 : 0),
                    idexpresionmatematica: variables.idexpresionmatematica,
                    historiconominasreportes: (vista.chbHistoricoNominasReportes.checked == true ? 1 : 0),
                    idexpresionmatematicahistoriconominasreportes: variables.idexpresionmatematicahistoriconominasreportes,
                    descripcion: vista.taDescripcionVariables.getValue(),
                    arraynominas: arraytiposnomina

                }
            }
            else if (accion == 'DEL') {
                return {
                    idvariablesconfreportescertificaciones: this.variablesreportecertificacionseleccionado.data.idvariablesconfreportescertificaciones
                }
            }
        }.createDelegate(this);

        this.VentanaTipoReporteCertificaciones = function (accion) {
            var titulo = 'Adicionar tipo de reporte y certificaciones';
            if (accion == 'ADD') {
                titulo = 'Adicionar tipo de reporte y certificaciones';
                vista.winTipoRepCert.setTitle(titulo);
                vista.btnAplicar.setVisible(true);
                vista.winTipoRepCert.show();
                this.LimpiarFormulario();

            } else if (accion == 'MOD') {
                titulo = 'Modificar tipo de reporte y certificaciones';
                vista.winTipoRepCert.setTitle(titulo);
                vista.btnAplicar.setVisible(false);
                vista.winTipoRepCert.show();
                vista.cbNivel.setValue(this.reportecertificacionseleccionado.data.nivel);
                vista.cbObligatorioProcesarlo.setValue(this.reportecertificacionseleccionado.data.obligatorioprocesarlo);
                vista.cbAprobacionElementos.setValue(this.reportecertificacionseleccionado.data.aprobacionelementos);
                vista.cbAplicarEn.setValue(this.reportecertificacionseleccionado.data.aplicaren);
                vista.tfDenominacion.setValue(this.reportecertificacionseleccionado.data.denominacion);
                vista.cmbComportamiento.setValue(this.reportecertificacionseleccionado.data.comportamiento);
                vista.cmbReporteSC4.setValue(this.reportecertificacionseleccionado.data.comportamientoreportesc4);
                vista.cmbTipoSeleccionPersonas.setValue(this.reportecertificacionseleccionado.data.tiposeleccionpersonas);
                vista.nfmMesesSnc.setValue(this.reportecertificacionseleccionado.data.mesessnc);
            }
        }.createDelegate(this)

        this.VentanaVariablesTipoReporteCertificaciones = function (accion) {
            var titulo = 'Adicionar variable de tipo de reporte y certificaciones';
            if (accion == 'ADD') {
                titulo = 'Adicionar variable de tipo de reporte y certificaciones';
                vista.winVariablesTipoRepCert.setTitle(titulo);
                vista.btnAplicarVariables.setVisible(true);
                vista.winVariablesTipoRepCert.show();
                this.LimpiarFormularioVariables();
                vista.nfCantidadLugaresDecimales.setValue("");

                vista.nfValorMinimo.setValue("");
                vista.nfValorMaximo.setValue("");
                vista.nfOrden.setValue("");
                vista.chbEsCalculable.setValue(0);
                vista.chbNominasBuscarSNC.setValue(0);
                vista.tfFormulaVariable.setValue("");
                vista.tfFormulaHistoricoNominasReportes.setValue("");
                vista.tfBusquedaReportesAnteriores.setValue("");
                //vista.nfCantidadLugaresDecimales.disable();
                if(vista.gpTipoRepCert.getSelectionModel().getSelected().get('comportamiento') == 50){
                    vista.tfBusquedaReportesAnteriores.enable();
                }else{
                    vista.tfBusquedaReportesAnteriores.disable();
                }
                var meses = vista.gpTipoRepCert.getSelectionModel().getSelected().get('tfVariableReporteMesInicial');
                if(meses){
                    vista.tfVariableReporteMesInicial.enable();
                }
            } else if (accion == 'MOD') {
                titulo = 'Modificar variable de tipo de reporte y certificaciones';
                vista.winVariablesTipoRepCert.setTitle(titulo);
                vista.btnAplicarVariables.setVisible(false);
                vista.winVariablesTipoRepCert.show();
                var idtipovalor = this.variablesreportecertificacionseleccionado.data.tipovalor;
                vista.cbTipoValor.setValue(idtipovalor);

                vista.cbNomencladorReferencia.enable();
                modelo.stNomencladorReferencia.clearFilter(true);

                if (idtipovalor == 1) {
                    modelo.stNomencladorReferencia.filter('tiponomenclador', '1', false, true);
                    vista.cbNomencladorReferencia.setValue(this.variablesreportecertificacionseleccionado.data.idnomencladorreferencia);
                    vista.nfCantidadLugaresDecimales.setValue("");
                } else if (idtipovalor == 5) {
                    modelo.stNomencladorReferencia.filter('tiponomenclador', '2', false, true);
                    vista.cbNomencladorReferencia.setValue(this.variablesreportecertificacionseleccionado.data.idnomencladorreferencia);
                    vista.nfCantidadLugaresDecimales.setValue("");
                } else if (idtipovalor == 2) {
                    vista.nfCantidadLugaresDecimales.setValue(this.variablesreportecertificacionseleccionado.data.lugaresdecimales);
                    vista.nfCantidadLugaresDecimales.enable();

                } else {
                    vista.cbNomencladorReferencia.disable();
                    vista.cbNomencladorReferencia.setValue(-1);
                    vista.nfCantidadLugaresDecimales.setValue("");
                }

                vista.cbNivelAplicarValor.setValue(this.variablesreportecertificacionseleccionado.data.nivelaplicarvalor);
                vista.tfDenominacionVariables.setValue(this.variablesreportecertificacionseleccionado.data.denominacion);

                vista.nfValorMinimo.setValue(this.variablesreportecertificacionseleccionado.data.min);
                vista.nfValorMaximo.setValue(this.variablesreportecertificacionseleccionado.data.max);
                vista.nfOrden.setValue(this.variablesreportecertificacionseleccionado.data.orden);
                vista.chbEsCalculable.setValue(this.variablesreportecertificacionseleccionado.data.calculable);
                vista.chbNominasBuscarSNC.setValue(this.variablesreportecertificacionseleccionado.data.nominasbuscarsnc);
                vista.chbHistoricoNominasReportes.setValue(this.variablesreportecertificacionseleccionado.data.calculablehistoriconominasreportes);
                //(vista.chbEsCalculable.checked == true ? 1 : 0),
                vista.tfFormulaVariable.setValue(this.variablesreportecertificacionseleccionado.data.textoexpresionmatematica);
                vista.tfFormulaHistoricoNominasReportes.setValue(this.variablesreportecertificacionseleccionado.data.textoexpresionmatematicahistoriconominasreportes);
                vista.tfBusquedaReportesAnteriores.setValue(this.variablesreportecertificacionseleccionado.data.denomvariablereporteanterior);
                vista.tfVariableReporteMesInicial.setValue(this.variablesreportecertificacionseleccionado.data.denomvariablemesinicial);

                if(vista.gpTipoRepCert.getSelectionModel().getSelected().get('comportamiento') == 50){
                    vista.tfBusquedaReportesAnteriores.enable();
                }else{
                    vista.tfBusquedaReportesAnteriores.disable();
                }

            }
        }.createDelegate(this)

        this.reportecertificacionseleccionado = null;

        vista.gpTipoRepCert.getSelectionModel().on('rowselect', function (sm, rowIndex, r) {
            this.reportecertificacionseleccionado = r;
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            vista.btnAdicionarVariables.enable();
            vista.gpVariablesTipoRepCert.enable();
            modelo.stVariablesTiposRepCert.baseParams.idconfreportescertificaciones = r.data.idconfreportescertificaciones;
            modelo.stVariablesTiposRepCert.load();

            //Cargando los indicadores
            Ext.Ajax.request({
                url: 'obtenerIndicadoresFormulas',
                method: 'POST',
                params: {
                    idconfreportescertificaciones: Ext.encode(r.data.idconfreportescertificaciones)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    variables.arrayindicadores = responseData.variables;
                }.createDelegate(this)
            });
        }.createDelegate(this));

        vista.gpTipoRepCert.getSelectionModel().on('rowdeselect', function (sm, rowIndex, r) {
            this.variablesreportecertificacionseleccionado = r;
            vista.btnAdicionarVariables.disable();
            vista.btnModificarVariables.disable();
            vista.btnEliminarVariables.disable();
            vista.gpVariablesTipoRepCert.disable();

        }.createDelegate(this));

        this.variablesreportecertificacionseleccionado = null;

        vista.gpVariablesTipoRepCert.getSelectionModel().on('rowselect', function (sm, rowIndex, r) {
            this.variablesreportecertificacionseleccionado = r;
            variables.idexpresionmatematicamarcada = r.data.idexpresionmatematica;
            variables.idexpresionmatematicamarcadahis = r.data.idexpresionmatematicahistoriconominasreportes;
            variables.variablesreportecertificacionseleccionado = r;
            variables.idvariablesconfreportescertificacionesf = r.data.idvariablesconfreportescertificaciones;
            vista.btnModificarVariables.enable();
            vista.btnEliminarVariables.enable();

        }.createDelegate(this));

        vista.gpVariablesTipoRepCert.getSelectionModel().on('rowdeselect', function (sm, rowIndex, r) {
            vista.btnModificarVariables.disable();
            vista.btnEliminarVariables.disable();

        }.createDelegate(this));

        vista.btnAdicionar.focus();

        vista.btnAdicionar.setHandler(function () {
            this.accion = 'ADD';
            vista.nfmMesesSnc.setValue('');
            this.VentanaTipoReporteCertificaciones(this.accion);
        }.createDelegate(this));

        vista.btnAdicionarVariables.setHandler(function () {
            this.accion = 'ADD';
            //console.info(variables.idexpresionmatematica);
            variables.idexpresionmatematica = null;
            variables.accion = 'ADD';
            this.VentanaVariablesTipoReporteCertificaciones(this.accion);
        }.createDelegate(this));

        vista.btnModificar.setHandler(function () {
            this.accion = 'MOD';
            if (this.reportecertificacionseleccionado) {
                this.VentanaTipoReporteCertificaciones(this.accion);
            } else {
                mostrarMensaje(1, 'Debe seleccionar un tipo de reporte y certificaci&oacute;n.');
            }
        }.createDelegate(this));

        vista.btnModificarVariables.setHandler(function () {
            this.accion = 'MOD';
            variables.accion = 'MOD';
            vista.taDescripcionVariables.setValue(vista.gpVariablesTipoRepCert.getSelectionModel().getSelected().get('descripcion'));
            vista.tfFormulaVariable.setValue(vista.gpVariablesTipoRepCert.getSelectionModel().getSelected().get('textoexpresionmatematica'));

            //Obteniendo el id de cada campo de formula para cuando se modifique otro campo no se borre la formula
            variables.idexpresionmatematica = vista.gpVariablesTipoRepCert.getSelectionModel().getSelected().get('idexpresionmatematica');
            variables.idexpresionmatematicahistoriconominasreportes = vista.gpVariablesTipoRepCert.getSelectionModel().getSelected().get('idexpresionmatematicahistoriconominasreportes');


            if (this.variablesreportecertificacionseleccionado) {
                this.VentanaVariablesTipoReporteCertificaciones(this.accion);
            } else {
                mostrarMensaje(1, 'Debe seleccionar una variable de tipo de reporte y certificaci&oacute;n.');
            }
        }.createDelegate(this));

        vista.btnEliminar.setHandler(function () {
            this.accion = 'DEL';
            if (this.reportecertificacionseleccionado) {
                mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar el tipo de reporte y certificaci&oacute;n seleccionado?', function (btn) {
                    if (btn == 'ok') {
                        this.ADDMODDELTipoReporteCertificaciones(this.accion, 'ACEPTAR', this.ObtenerDatosFormulario(this.accion));
                    } else return;
                }.createDelegate(this));
            } else {
                mostrarMensaje(1, 'Debe seleccionar un tipo de reporte y certificaci&oacute;n.');
            }
        }.createDelegate(this));

        vista.btnEliminarVariables.setHandler(function () {
            this.accion = 'DEL';
            if (this.variablesreportecertificacionseleccionado) {
                mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar la variable de tipo de reporte y certificaci&oacute;n seleccionado?', function (btn) {
                    if (btn == 'ok') {
                        this.ADDMODDELVariablesTipoReporteCertificaciones(this.accion, 'ACEPTAR', this.ObtenerDatosFormularioVariables(this.accion));
                    } else return;
                }.createDelegate(this));
            } else {
                mostrarMensaje(1, 'Debe seleccionar una variable de tipo de reporte y certificaci&oacute;n.');
            }
        }.createDelegate(this));

        vista.btnAceptar.setHandler(function () {
            this.ADDMODDELTipoReporteCertificaciones(this.accion, 'ACEPTAR', this.ObtenerDatosFormulario(this.accion));
        }.createDelegate(this));

        vista.btnAceptarVariables.setHandler(function () {
            this.ADDMODDELVariablesTipoReporteCertificaciones(this.accion, 'ACEPTAR', this.ObtenerDatosFormularioVariables(this.accion));
        }.createDelegate(this));

        vista.btnAplicar.setHandler(function () {
            this.ADDMODDELTipoReporteCertificaciones(this.accion, 'APLICAR', this.ObtenerDatosFormulario(this.accion));
        }.createDelegate(this));

        vista.btnAplicarVariables.setHandler(function () {
            this.ADDMODDELVariablesTipoReporteCertificaciones(this.accion, 'APLICAR', this.ObtenerDatosFormularioVariables(this.accion));
        }.createDelegate(this));

        vista.cbTipoValor.on('select', function (combo, r, index) {
            vista.cbNomencladorReferencia.enable();
            modelo.stNomencladorReferencia.clearFilter(true);
            vista.cbNomencladorReferencia.setValue('');
            if (r.data.valor == 1) {
                modelo.stNomencladorReferencia.filter('tiponomenclador', '1', false, true);
                // vista.nfCantidadLugaresDecimales.disable();
                vista.nfCantidadLugaresDecimales.setValue("");
            } else if (r.data.valor == 5) {
                modelo.stNomencladorReferencia.filter('tiponomenclador', '2', false, true);
                // vista.nfCantidadLugaresDecimales.disable();
                vista.nfCantidadLugaresDecimales.setValue("");
            } else if (r.data.valor == 2) {
                modelo.stNomencladorReferencia.filter('tiponomenclador', '2', false, true);
                vista.nfCantidadLugaresDecimales.enable()
            } else {
                vista.cbNomencladorReferencia.setValue(-1);
                vista.cbNomencladorReferencia.disable();
                // vista.nfCantidadLugaresDecimales.disable();
                vista.nfCantidadLugaresDecimales.setValue("");
            }

        }.createDelegate(this));

        vista.chbEsCalculable.on('check', function (cb, checked) {
            if (vista.chbEsCalculable.checked == true) {
                vista.tfFormulaVariable.setValue('  ');
                //vista.tfFormulaVariable.setValue(vista.smTarifa.getSelected().get('importeformula'));
                vista.tfFormulaVariable.enable();
                vista.chbNominasBuscarSNC.enable();
               // vista.nfmMesesSnc.setValue('  ');
                //vista.nfmMesesSnc.enable();
                vista.chbHistoricoNominasReportes.setValue(false);

            } else {
                vista.tfFormulaVariable.reset();
                vista.tfFormulaVariable.disable();
                vista.chbNominasBuscarSNC.disable();
                //vista.nfmMesesSnc.reset();
                //vista.nfmMesesSnc.disable();
            }
            if(checked == false){
                variables.idexpresionmatematica = -1;
            }

        });

        vista.chbNominasBuscarSNC.on('check', function (cb, checked) {
            if(checked == true){
                vista.winTiposNominas.show();
            }
        });

        vista.winTiposNominas.on('show', function(){
            modelo.stTiposNominas.load();
        });

        vista.btnAceptarTiposNominas.on('click', function(){
            if(vista.gpTiposNominas.getSelectionModel().hasSelection()){
                var denominaciontiposnomina = '';
                var rtiposnominas = vista.gpTiposNominas.getSelectionModel().getSelections();
                for (var i = 0; i < rtiposnominas.length; i++) {
                    var a = new Array();
                    arraytiposnomina[i] = rtiposnominas[i].data.idtiponomina;
                    if(denominaciontiposnomina == ''){
                        denominaciontiposnomina = rtiposnominas[i].data.denominaciontiponomina;
                    }else{
                        denominaciontiposnomina = denominaciontiposnomina + ', ' + rtiposnominas[i].data.denominaciontiponomina;
                    }

                }
                vista.taDescripcionVariables.setValue(denominaciontiposnomina);
                denominaciontiposnomina = '';
            }

            vista.winTiposNominas.hide();
        });

        vista.chbHistoricoNominasReportes.on('check', function (cb, rec, ind) {
            if (vista.chbHistoricoNominasReportes.checked == true) {
                vista.tfFormulaHistoricoNominasReportes.setValue('  ');
                //vista.tfFormulaVariable.setValue(vista.smTarifa.getSelected().get('importeformula'));
                vista.tfFormulaHistoricoNominasReportes.enable();
                vista.chbEsCalculable.setValue(false);
                // vista.nfmMesesSnc.setValue('  ');
                //vista.nfmMesesSnc.enable();

            } else {
                vista.tfFormulaHistoricoNominasReportes.reset();
                vista.tfFormulaHistoricoNominasReportes.disable();
                variables.idexpresionmatematicahistoriconominasreportes = -1;
                //vista.nfmMesesSnc.reset();
                //vista.nfmMesesSnc.disable();
            }

        });

        vista.btnBuscar.on('click', function () {
            modelo.stTiposRepCert.load({params: {start: 0, limit: 1000, criterio: vista.tfbuscar.getValue()}});
        });

        //Evento del textfield para Buscar en Reportes Anteriores
        vista.tfBusquedaReportesAnteriores.on('focus', function () {
            vista.ventanaTipoReplica.show();
        });

        vista.btnCancelarReportesAnteriores.on('click', function(){
            vista.ventanaTipoReplica.hide();
        });

        vista.btnAceptarReportesAnteriores.on('click', function(){
            vista.tfBusquedaReportesAnteriores.setValue('');
            variables.idvariablesconfreportescertificacionesreportesanteriores = vista.gpReportesAnteriores.getSelectionModel().getSelected().get('idvariablesconfreportescertificaciones');
            vista.ventanaTipoReplica.hide();
            vista.tfBusquedaReportesAnteriores.setValue(vista.gpReportesAnteriores.getSelectionModel().getSelected().get('denominacion'));
        });

        //Evento del textfield para Buscar el Mes Inicial para los Salarios Promedios
        vista.tfVariableReporteMesInicial.on('focus', function () {
            vista.ventanaMesInicial.show();
        });

        vista.btnCancelarMesInicial.on('click', function(){
            vista.ventanaMesInicial.hide();
        });

        vista.btnAceptarMesInicial.on('click', function(){
            vista.tfVariableReporteMesInicial.setValue('');
            variables.idvariablesconfreportescertiicacionesmesinicial = vista.gpMesInicial.getSelectionModel().getSelected().get('idvariablesconfreportescertificaciones');
            vista.ventanaMesInicial.hide();
            vista.tfVariableReporteMesInicial.setValue(vista.gpMesInicial.getSelectionModel().getSelected().get('denominacion'));
        });


        //Eventos de campo de importe o fórmula de historico. idexpresionmatematicanominasreportes

        vista.tfFormulaHistoricoNominasReportes.on('focus', function () {
            /////////////Variables del propio reporte////////////////
            var indhis = new Array();
            indhis = modelo.datosModelo.indicadorestiposnominas;

            for (var i = 0; i < variables.arrayindicadores.length; i++) {
                var a = new Array();
                a[0] = variables.arrayindicadores[i].idindicador;
                a[1] = variables.arrayindicadores[i].indicador;
                a[2] = variables.arrayindicadores[i].tipo;
                indhis.push(a);
            }
            var idexpresionmathis = -1;
            if(this.accion == 'ADD'){
                idexpresionmathis = -1;
            }else if(this.accion == 'MOD'){
                // if(variables.idexpresionmatematicamarcada != -1){
                idexpresionmathis =  variables.idexpresionmatematicamarcadahis;
                // }else{
                //    idexpresionmat = -1;
                // }
            }
            idexpresionmathis = (idexpresionmathis)?idexpresionmathis:-1;

            this.objExpMatHis = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: idexpresionmathis,
                indicadores: indhis,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                mostrarCondicionales: true,
                //operadoresMostrar: ['+', '-', '*', '/', 'pa', 'pc', 's', 'p'],
                mostrarDenominacion: false
            });

            this.objExpMatHis.on('expresionsalvada', function (arr) {
                variables.idexpresionmatematicahistoriconominasreportes = arr.idexpresionmatematica;
                vista.tfFormulaHistoricoNominasReportes.setValue(arr.elementosMostrar);
                //salvarExpresionMatematica(variables.idvariablesconfreportescertificacionesf , arr.idexpresionmatematica);
                this.objExpMatHis.close();
            }.createDelegate(this));

            this.objExpMatHis.show();

        }.createDelegate(this));

        //Eventos de campo de importe o fórmula. idexpresionmatematicanominasreportes

        vista.tfFormulaVariable.on('focus', function () {
            /////////////Variables del propio reporte////////////////
            var ind = new Array();
            modelo.stVariablesTiposRepCert.each(function (r) {
                //if(r.data.idvariablesconfreportescertificaciones<variables.idvariablesconfreportescertificacionesf){
                    var a = new Array();
                    a[0] = 'VAR_' + r.data.idvariablesconfreportescertificaciones;
                    a[1] = r.data.denominacion;
                    a[2] = 'Variables del reporte';
                    ind.push(a);
                //}
            });

            //Snc225
            var a = new Array();
            a[0] = 'CM_0';
            a[1] = 'Cantidad de meses (SNC - 225)';
            a[2] = 'SNC - 225';
            ind.push(a);
            var c = new Array();
            c[0] = 'ST_0';
            c[1] = 'Salario Total (SNC - 225)';
            c[2] = 'SNC - 225';
            ind.push(c);
            var c = new Array();
            c[0] = 'DA_0';
            c[1] = 'D&iacute;s habiles';
            c[2] = 'SNC - 225';
            ind.push(c);
            ////////////////////////////

           for (var i = 0; i < variables.arrayindicadores.length; i++) {
                var a = new Array();
                a[0] = variables.arrayindicadores[i].idindicador;
                a[1] = variables.arrayindicadores[i].indicador;
                a[2] = variables.arrayindicadores[i].tipo;
                ind.push(a);
            }
            var idexpresionmat = -1;
            if(this.accion == 'ADD'){
                idexpresionmat = -1;
            }else if(this.accion == 'MOD'){
               // if(variables.idexpresionmatematicamarcada != -1){
                idexpresionmat =  variables.idexpresionmatematicamarcada;
               // }else{
                //    idexpresionmat = -1;
               // }
            }

            idexpresionmat = (idexpresionmat)?idexpresionmat:-1;

                this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: idexpresionmat,
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                mostrarCondicionales: true,
                //operadoresMostrar: ['+', '-', '*', '/', 'pa', 'pc', 's', 'p'],
                mostrarDenominacion: false
            });

            this.objExpMat.on('expresionsalvada', function (arr) {
                variables.idexpresionmatematica = arr.idexpresionmatematica;
                vista.tfFormulaVariable.setValue(arr.elementosMostrar);
                //salvarExpresionMatematica(variables.idvariablesconfreportescertificacionesf , arr.idexpresionmatematica);
                this.objExpMat.close();
            }.createDelegate(this));

            this.objExpMat.show();

        }.createDelegate(this));

        function salvarExpresionMatematica(idvariablesconfreportescertificacionesf, idexpresionmatematica) {
            PVD.mostrarMascara('idmaskformula', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'adicionarFormulas',
                params: {
                    idvariablesconfreportescertificaciones: idvariablesconfreportescertificacionesf,
                    idexpresionmatematica: idexpresionmatematica
                },
                callback: function (options, succes, response) {
                    PVD.ocultarMascara('idmaskformula');
                    respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'ok') {
                        mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica se adicion&oacute; satisfactoriamente');
                        //vista.smIndicadores.clearSelections();
                        //vista.btnLimpiarFormulas.disable();
                        vista.taFormulaIndicador.disable();
                        vista.taFormulaIndicador.setValue('');
                    } else {
                        mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar');
                    }
                }
            });
        }

        this.ADDMODDELTipoReporteCertificaciones = function (accion, boton, datos) {
            var url = '';
            if (accion == 'ADD') {
                url = 'adicionarconfiguracionesreportescertificaciones';
            } else if (accion == 'MOD') {
                url = 'modificarconfiguracionesreportescertificaciones';
            } else if (accion == 'DEL') {
                url = 'eliminarconfiguracionesreportescertificaciones';
            }

            if (vista.fpTipoRepCert.getForm().isValid()) {
                console.log(datos)
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        idconfreportescertificaciones: (datos.idconfreportescertificaciones ? datos.idconfreportescertificaciones : null),
                        denominacion: (datos.denominacion ? datos.denominacion : null),
                        comportamiento: (datos.comportamiento ? datos.comportamiento : null),
                        comportamientoreporte: (datos.comportamientoreporte ? datos.comportamientoreporte : null),
                        tiposeleccionpersonas: (datos.tiposeleccionpersonas ? datos.tiposeleccionpersonas : null),
                        nivel: 1,//(datos.nivel ? datos.nivel : null),
                        obligatorioprocesarlo: 1,//(datos.obligatorioprocesarlo ? datos.obligatorioprocesarlo : null),
                        aprobacionelementos: (datos.aprobacionelementos ? datos.aprobacionelementos : null),
                        aplicaren: (datos.aplicaren ? datos.aplicaren : null),
                        meses: vista.nfmMesesSnc.getValue()
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codigo == 'ADD-1') {
                            mostrarMensaje(1, 'El tipo de reporte y certificaci&oacute;n se ha adicionado satisfactoriamente.');

                        } else if (respuesta.codigo == 'MOD-1') {
                            mostrarMensaje(1, 'El tipo de reporte y certificaci&oacute;n se ha modificado satisfactoriamente.');
                        }
                        else if (respuesta.codigo == 'DEL-1') {
                            mostrarMensaje(1, 'El tipo de reporte y certificaci&oacute;n ha sido eliminado satisfactoriamente.');
                        } else if (respuesta.codigo == 'DEL-2') {
                            mostrarMensaje(3, 'El tipo de reporte y certificaci&oacute;n no puede ser eliminado porque esta siendo usado.');
                        } else {
                            mostrarMensaje(3, respuesta.msg);
                        }

                        if (boton == 'APLICAR') {
                            this.LimpiarFormulario();
                        } else if (boton == 'ACEPTAR') {
                            vista.winTipoRepCert.hide();
                        }
                        if (accion == 'MOD' || accion == 'DEL') {
                            vista.gpTipoRepCert.getSelectionModel().clearSelections();
                            vista.btnModificar.disable();
                            vista.btnEliminar.disable();
                        }
                        vista.gpVariablesTipoRepCert.getStore().removeAll();
                        vista.gpVariablesTipoRepCert.disable();
                        modelo.stTiposRepCert.load({params: {start: 0, limit: 1000}});

                    }.createDelegate(this)
                });
            }
        };

        this.ADDMODDELVariablesTipoReporteCertificaciones = function (accion, boton, datos) {
            var url = '';
            if (accion == 'ADD') {
                url = 'adicionarvariablesconfiguracionesreportescertificaciones';
            } else if (accion == 'MOD') {
                url = 'modificarvariablesconfiguracionesreportescertificaciones';
            } else if (accion == 'DEL') {
                url = 'eliminarvariablesconfiguracionesreportescertificaciones';
            }

            PVD.mostrarMascara('idmasktiporeporte', 'Por favor espere...', 'Guardando los datos de la variable.');
            if (vista.fpVariablesTipoRepCert.getForm().isValid()) {
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        idvariablesconfreportescertificaciones: (datos.idvariablesconfreportescertificaciones ? datos.idvariablesconfreportescertificaciones : null),
                        denominacion: (datos.denominacion ? datos.denominacion : null),
                        tipovalor: 2,//(datos.tipovalor ? datos.tipovalor : null),
                        idnomencladorreferencia: (datos.idnomencladorreferencia ? datos.idnomencladorreferencia : null),
                        nivelaplicarvalor: (datos.nivelaplicarvalor ? datos.nivelaplicarvalor : null),
                        idconfreportescertificaciones: (datos.idconfreportescertificaciones ? datos.idconfreportescertificaciones : null),
                        lugaresdecimales: (datos.lugaresdecimales ? datos.lugaresdecimales : null),
                        orden: (datos.orden ? datos.orden : null),
                        min: (datos.minimo>=0 ? datos.minimo : null),
                        max: (datos.maximo>=0 ? datos.maximo : null),
                        calculable: datos.calculable,
                        calculablehistoriconominasreportes: datos.historiconominasreportes,
                        idexpresionmatematica: (variables.idexpresionmatematica ? variables.idexpresionmatematica : null),
                        idexpresionmatematicanominasreportes: (variables.idexpresionmatematicahistoriconominasreportes ? variables.idexpresionmatematicahistoriconominasreportes : null),
                        descripcion: datos.descripcion,
                        idvariablesconfreportescertificacionesreportesanteriores: (variables.idvariablesconfreportescertificacionesreportesanteriores == -1)?null:variables.idvariablesconfreportescertificacionesreportesanteriores,
                        idvariablesconfreportescertiicacionesmesinicial: (variables.idvariablesconfreportescertiicacionesmesinicial == -1)?null:variables.idvariablesconfreportescertiicacionesmesinicial,
                        arraytiposnomina: Ext.encode(arraytiposnomina)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('idmasktiporeporte');
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codigo == 'ADD-1') {
                            mostrarMensaje(1, 'La variable de tipo de reporte y certificaci&oacute;n se adicion&oacute; satisfactoriamente.');
                            arraytiposnomina = new Array();
                        } else if (respuesta.codigo == 'MOD-1') {
                            mostrarMensaje(1, 'La variable de tipo de reporte y certificaci&oacute;n se modific&oacute; satisfactoriamente.');
                            arraytiposnomina = new Array();
                        } else if (respuesta.codigo == 'DEL-1') {
                            mostrarMensaje(1, 'La variable de tipo de reporte y certificaci&oacute;n se elimin&oacute; satisfactoriamente.');
                            modelo.stVariablesTiposRepCert.load();
                        } else if (respuesta.codigo == 'ESTA-EN-USO') {
                            mostrarMensaje(3, 'La variable que desea eliminar est&aacute; en uso.');
                        } else {
                            mostrarMensaje(3, 'La variable de tipo de reporte y certificaci&oacute;n no se pudo eliminar.');
                        }

                        if (boton == 'APLICAR') {
                            _this.LimpiarFormularioVariables();
                        } else if (boton == 'ACEPTAR') {
                            if (respuesta.msg) {
                                this.LimpiarFormularioVariables();
                            } else {
                                vista.winVariablesTipoRepCert.hide();
                            }
                        }

                        if (accion == 'MOD' || accion == 'DEL') {
                            vista.gpVariablesTipoRepCert.getSelectionModel().clearSelections();
                            vista.btnModificarVariables.disable();
                            vista.btnEliminarVariables.disable();
                        }
                        variables.idexpresionmatematica = -1;
                        variables.idexpresionmatematicahistoriconominasreportes = -1;
                        modelo.stVariablesTiposRepCert.reload();
                        this.LimpiarFormularioVariables();

                        if (boton != 'APLICAR') {
                            vista.winVariablesTipoRepCert.hide();
                        }


                    }.createDelegate(this)
                });
            }
        };
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('confreportescertificaciones', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    variablesGlobales.perfil = arguments[0];

    /*Configuracion inicial*/
    //Hago la peticion para cargar los datos de nivel, obligatorioprocesarlo, aprobacionelementos y aplicaren
    PVD.mostrarMascara('idmaskcargardatosconfreportescertificaciones', idioma.lbMsgEspera, idioma.lbMsgEsperaEnviarDatos);
    Ext.Ajax.request({
        url: 'cargardatosconfreportescertificaciones',
        method: 'POST',
        callback: function (options, success, response) {
            PVD.ocultarMascara('idmaskcargardatosconfreportescertificaciones');
            //Inicializando el modelo
            var modelo = Pvd.Nomina.ReportesyCertificaciones.ConfReportesyCertificaciones.Modelo;
            modelo.init(idioma);

            modelo.datosModelo = Ext.decode(response.responseText);

            modelo.cargarConfiguracion();

            modelo.stTiposRepCert.load({params: {start: 0, limit: 1000}});

            //Inicializando la vista.
            var vista = Pvd.Nomina.ReportesyCertificaciones.ConfReportesyCertificaciones.Vista;
            vista.init(perfil, idioma, modelo);
            //Inicializar controlador.
            Pvd.Nomina.ReportesyCertificaciones.ConfReportesyCertificaciones.Controlador.init(idioma, vista, modelo);
        }.createDelegate(this)
    });

});
