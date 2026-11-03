Ext.ns('Pvd.Nomina.Gestionarantiguedad');

//Controlador de la vista del componente Gestionar cargos ocupados.
Pvd.Nomina.Gestionarantiguedad.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Configurar variables globales (Tipo: Pvd.Nomina.Pagos.GestionarCargosOcupados.Vista)
     * @param modelo Modelo de la vista del componente Gestionar cargos ocupados (Tipo: Pvd.Nomina.Pagos.GestionarCargosOcupados.Modelo)
     */
    init: function (idioma, vista, modelo) {
        /**
         *Variables generales.
         */
        var variables = {
            identidad: 0,
            idcargo: 0,
            idpersona: 0,
            persona: 0,
            numerocontable: 0,
            idpersonacdgocontable: 0,
            accion: '',
            url: '',
            boton: '',
            path: null,
            cambio: 0,
            asociadoalcargo: 0,
            idplantillanominal: null,
            boolpersonas: 0,
            personasAux: 0,
            antiguedad: null
        };

        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();

        //Eventos del objeto del ábol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
            variables.identidad = nodo.id;
            vista.identidad = nodo.id;
            vista.btnCargarPersonas.enable();
            // modelo.stcbCajaCajero.load();
            // vista.pPersonas.CambiarEntidad(variables.identidad);
            // } else {
            //     variables.identidad = null;
            //     vista.btnCargarPersonas.disable();
            // }
        });

        //Eventos del botón cargar personas a partir de la entidad selecionada.
        vista.btnCargarPersonas.on('click', function () {

            // modelo.stPersonas.load({params: {identidad: variables.identidad}});
            modelo.stPersonas.baseParams.identidad = variables.identidad;
            modelo.stPersonas.load({params: {limit: 1000, start: 0}});
            vista.winCargosOcupados.show();
            vista.winCargosOcupados.maximize();


            //if (record.data.antuguedad == null)
            //    return '<span style="color:red;">' + val + '</span>';
            //else
            //    return '<span style="color:green;">' + val + '</span>';
            //else return val;
        });

        vista.gpPersonas.getSelectionModel().on('rowselect', function (sm, index, record) {
            vista.filasSeleccionadas = sm.getSelections();
            vista.pfichadelapersona.mostrarFicha(record.data.idpersona);
            //   variables.personasAux = record;
            /*if (variables.estado == 1) {
             vista.btnEliminarPersona.enable();
             vista.btnExcluirPersona.enable();
             } else {
             vista.btnEliminarPersona.disable();
             vista.btnExcluirPersona.disable();
             vista.btnAdicionarPersona.disable();
             }
             if (record.data.excluido != 1) {
             vista.gpVariablesPersonas.disable();
             modelo.stVariablesPersona.removeAll();
             vista.gpCargos.enable();
             modelo.CargarCargosOcupadosPersona(variables.identidad, variables.personasperiodospagos.data.idpersona, variables.periodopagogrid.data.idperiodopago, record.data.idpersonaelaborarpagos);
             }*/
        });

        vista.btnGuardar.on('click', function () {

            // capturar todas las personas que tienen info y los que haya modificado

            var datos = modelo.stPersonas.getModifiedRecords();

            var rango = modelo.stPersonas.getRange();//console.info(rango);

            var annos = ' ';
            var meses = ' ';
            var fechacer = ' ';
            var arrTodos = new Array();


            Ext.each(rango, function (rec) {
                arrTodos.push({
                    idpersona: rec.data.idpersona,
                    identidad: rec.data.identidad,
                    valor: rec.data.valor,
                    faltaentidad: rec.data.fechacert,
                    mes: rec.data.mesesservicio,
                    antiguedad: rec.data.antuguedad,
                    reporteantiguedad: rec.data.reporteantiguedad
                });
            });


            PVD.mostrarMascara('maskantiguedad', 'Por favor espere...', 'Guardando datos');
            Ext.Ajax.request({
                timeout: 50000000,
                url: 'addAnnosservicios',
                method: 'POST',
                params: {
                    datos: Ext.encode(arrTodos)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    PVD.ocultarMascara('maskantiguedad');
                    if (respuesta == 'ok') {
                        mostrarMensaje(1, 'Los años de servicios han sido guardados satisfactoriamente');
                        modelo.stPersonas.load({params: {identidad: variables.identidad, limit: 1000, start: 0}});
                    }
                }.createDelegate(this)
            });
            modelo.stPersonas.removeAll();
        });


        vista.btnBuscar.on('click', function () {
            modelo.stPersonas.load({
                params: {
                    identidad: variables.identidad,
                    texto: vista.tfbuscar.getValue(),
                    limit: 1000,
                    start: 0
                }
            });
        });
        vista.btnLimpiar.on('click', function () {
            vista.tfbuscar.reset();
            //  modelo.stPersonas.load({params: {identidad: variables.identidad}});
            modelo.stPersonas.load({params: {identidad: variables.identidad, limit: 1000, start: 0}});

        });

        vista.btnExportarExcel.on('click', function () {
            exportarAnnosservicios();
            //   alert('Exportar');
            //   Ext.Ajax.request({
            //       url: 'exportarAnnosservicios',
            //       method: 'POST',
            //       params: {
            //           id:variables.identidad,
            //       },
            //       callback: function (options,success,response){
            //           var respuesta = Ext.decode(response.responseText);
            //           if(respuesta.codigo == "OK"){
            //               window.open(respuesta.dir);
            //           }
            //       }.createDelegate(this)
            //   });


            //      modelo.stPersonas.load({params: {identidad: variables.identidad, texto: vista.tfbuscar.getValue()}});


        });

        function exportarAnnosservicios() {
            // console.info('sss');
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });

            winload.showMask();
            window.open(document.location.protocol + '//' + window.location.host + '\/pvd/nomina/index.php/gestionarcertificaciondeannosservicios/exportarAnnosservicios?identidad=' + variables.identidad);
            winload.hideMask();
//
//            var iframecont = document.createElement("iframe");
//            iframecont.src = document.location.protocol + '//' + document.location.host+'/pvd/nomina/index.php/gestionarcertificaciondeannosservicios/exportarAnnosservicios?identidad=' + variables.identidad;
//            //    iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/gestionarcertificaciondeannosservicios/?idestructura=' + vista.idestructura;
//            iframecont.style.display = 'none';
//            that=this;
//            iframecont.onload = function(){
//                //PVD.ocultarMascara('rep01');
//                winload.hideMask();
//                //that.destroy();
//            }
//            document.body.appendChild(iframecont);


        }


    }
}
