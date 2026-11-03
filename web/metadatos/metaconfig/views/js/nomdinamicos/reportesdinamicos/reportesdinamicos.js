Ext.ns('Misitio.Funciones');

Misitio.Funciones.VentanaAdministracionReportes = function (parametros) {

    var conceptoSeleccionado = undefined;
    var self = this;
    var filtroEntidad = new Array();

    var configReporte = new Array(
        {nombre: 'id', index: 'idreporte', tipo: 'texto', nulo: true},
        {nombre: 'Denominación', index: 'denominacion', tipo: 'texto', nulo: false, ancho: 200,
            mostraFiltro:true},
        {nombre: 'Consulta', index: 'consulta', tipo: 'texto', nulo: true, ancho: 300, estextarea: false},
        /*{nombre: 'Nombre en BD', index: 'nombreenbd', tipo: 'texto', nulo: true, ancho: 100},*/
        {nombre: 'Descripción', index: 'descripcion', tipo: 'texto', nulo: false, ancho: 100, estextarea: true}

        /* , {

             nombre: 'Tipo de reporte',
             index: 'idtiporeporte',
             tipo: 'lista',
             nulo: true,
             ancho: 100,
             fijo: false,
             tabla: 'tablas_creadas.nom_tiporeporte',
             campoValor: 'idtiporeporte',
             campoAmostrar: 'denomtiporeporte'
         }*/
    );
    var configuracionMensajes = {
        femenino: true,
        numero: ['configuración del reporte', 'configuración de los reportes']
    };

    this.pNomReporte = new Misitio.Panel_Gestion.GestionGridPanel({
        id: 'panelReportes',
        region: 'center',
        collapsible: true,
        animCollapse: true,
        split: true,
        anchoForm: 320,
        urlGuardar: 'guardarNomReporte',
        width: screen.width * 0.5,
        autoScroll: true,
        nombre: 'configuración del reporte',
        configuracionMensajes: configuracionMensajes,
        configuracion: configReporte,
        tabla: 'mod_nomdinamicos.nom_reporte',
        idtabla: 'idreporte'
    });

    var panelMaestro = new Ext.Panel({
        id: 'panelMaestroReporte',
        layout: 'fit',
        region: 'center',
        collapsible: true,
        width: screen.width * 0.5,
        split: true,
        items: [self.pNomReporte]
    });


    var configAtributosReportes = new Array(
        {

            nombre: 'id',
            index: 'idatributoreporte',
            tipo: 'numero',
            nulo: true
        }
        , {
            nombre: 'Orden',
            index: 'orden',
            tipo: 'numero',
            nulo: true,
            tamannoForm: 0.2,
            ancho: 50
        }
        , {
            nombre: 'Denominación',
            index: 'denominacion',
            tipo: 'texto',
            ancho: 150,
            tamannoForm: 0.8,
            mostraFiltro:true,

            nulo: false
        }
        , {
            nombre: 'Ancho',
            index: 'ancho',
            tipo: 'numero',
            nulo: true,
            tamannoForm: 0.2,
            ancho: 50
        }

        , {
            nombre: 'Header del grid',
            index: 'gridheader',
            tipo: 'texto',
            mostraFiltro:true,
            ancho: 150,
            tamannoForm: 0.8,
            nulo: false
        }
        , {

            nombre: 'Buscador',
            index: 'mostrarfiltro',
            tipo: 'logico',
            nulo: true,
            tamannoForm: 0.2,
            ancho: 100
        }
        , {

            nombre: 'Tipo de atributo',
            index: 'tipo',
            tipo: 'lista',
            nulo: true,
            ancho: 100,
            tamannoForm: 0.8,
            fijo: false,
            tabla: 'mod_nomdinamicos.nom_tipoatributo',
            campovalor: 'idtipoatributo',
            campoamostrar: 'denomtipoatributo'
        }


        , {
            nombre: 'Descripción',
            index: 'descripcion',
            tipo: 'texto',
            estextarea: true,
            nulo: true
        }
        , {

            nombre: 'idreporte',
            index: 'idreporte',
            tipo: 'numero',
            nulo: true
        }
    );


    var configuracionMensajes = {
        femenino: false,
        numero: ['atributo del reporte', 'atributos de los reportes']
    };

    this.pAtributosReportes = new Misitio.Panel_Gestion.GestionGridPanelDetalle({
        id: 'pAtributosReportes',
        region: 'center',
        collapsible: true,
        animCollapse: true,
        split: true,
        region: 'east',
        anchoForm: 370,
        columnaDetalle: 'idreporte',
        autoCargar: false,
        width: screen.width * 0.5,
        autoScroll: true,
        nombre: 'atributo del reporte',
        configuracionMensajes: configuracionMensajes,
        configuracion: configAtributosReportes,
        tabla: 'mod_nomdinamicos.conf_atributoreporte',
        idtabla: 'idatributoreporte'
    });

    var lastFilaseleccionada;
    var btnMostrarReporteSeleccionado = new Ext.Button({
        text: "Ver reporte seleccionado",
        hidden: false,
        disabled: true,
        tooltip: "Ver reporte seleccionado",
        iconCls: 'ver',
        id: "btnMostrarReporteSeleccionado" + parametros.id,
        handler: function () {

            cargarConfiguracion(lastFilaseleccionada);
        }
    });


    function cargarConfiguracion(lastFilaSeleccionada) {


        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});

        var panel = null;

        if (lastFilaSeleccionada != null) {

            myMask.show();
            Ext.Ajax.request({
                url: 'gestionarAccionesGenericas',
                method: 'POST',
                params: {
                    metodo: 'cargarConfiguracionReporte',
                    idreporte: lastFilaSeleccionada.id
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);

                    if (respuesta.success) {
                        if (respuesta.datos[0] != undefined) {

                            var parametros = {
                                consulta: lastFilaSeleccionada.data.consulta,
                                configuracion: respuesta.datos,
                                id: 'reporte' + lastFilaSeleccionada.id,
                                titulo: lastFilaSeleccionada.data.denominacion + ': ' + lastFilaSeleccionada.data.descripcion
                            };

                            Misitio.Funciones.VentanaReportes(parametros);
                        } else {
                            Ext.Msg.show({
                                title: 'Error',
                                msg: 'Configuración aún incompleta.',
                                buttons: Ext.Msg.OK,
                                animEl: 'elIda',
                                icon: Ext.MessageBox.ERROR
                            });
                        }

                        myMask.hide();
                    } else {
                        myMask.hide();
                        var error = respuesta.error;
                        mostrarError(error, self, 2);
                    }

                }
            });

        }


    };

    this.pPrincipal = new Misitio.Panel_Gestion.GestionPanelMaestroDetalle({
        id: 'pmdReportes',
        collapsible: true,
        columnaMaestro: 'idreporte',
        panelDetalle: self.pAtributosReportes,
        panelMaestro: panelMaestro,
        split: true
    });

    panelMaestro.items.items[0].on('render', function () {
        panelMaestro.items.items[0].getTopToolbar().addButton(btnMostrarReporteSeleccionado);

        panelMaestro.items.items[0].btnVerDetalles.on('enable', function () {
            panelMaestro.items.items[0].getTopToolbar().items.items[4].enable();

        });

        panelMaestro.items.items[0].btnVerDetalles.on('disable', function () {
            panelMaestro.items.items[0].getTopToolbar().items.items[4].disable();
        });

    });

    panelMaestro.items.items[0].on('elementochequeado', function (parametro) {
        lastFilaseleccionada = panelMaestro.items.items[0].lastFilaseleccionada;
    });

    //panelMaestro.items.items[0].tbar.addButton(btnMostrarReporteSeleccionado);


    var ventanaReportes = new Ext.Window({
        title: parametros.titulo,
        modal: true,
        enableTabScroll: true,
        height: screen.height * 0.50,
        width: screen.width * 0.50,
        closable: true,
        resizable: false,
        maximizable: true,
        constrain: true,
        minimizable: true,
        layout: 'fit',
        items: [self.pPrincipal]
    });

    return ventanaReportes;


};