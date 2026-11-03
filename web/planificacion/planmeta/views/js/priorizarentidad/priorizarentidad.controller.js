
Ext.ns('Planificacion.BalanceMaterial.Priorizarentidad')

//Controlador de la vista
Planificacion.BalanceMaterial.Priorizarentidad.Controlador = {
    init: function(idioma, vista, modelo) {
        this.vista = vista;
        this.modelo = modelo;
        modelo.stgpCentrosbalance.on('load', function() {
            vista.gridCentrosbalance.getSelectionModel().selectFirstRow();
        }, this);


        modelo.stgpEspecialidad.on('beforeload', function(st, opt) {
            st.baseParams.idcb = vista.gridCentrosbalance.getSelectionModel().getSelected().data.identidaddatosnomenclador;

        }, this);
        modelo.stgpEspecialidad.on('load', function() {
            vista.gridEspecialidad.getSelectionModel().selectFirstRow(true);
            if (modelo.stgpEspecialidad.getCount() > 0)
                vista.prioini = modelo.stgpEspecialidad.getAt(0).data.prioridad;
        }, this);

        modelo.stgpCentrosbalance.reload({
            params: {
                start: 0,
                limit: 20

            }
        });

        /*************TECLAS CALIENTES****************/
        vista.globalKeyMap.accessKey({
            key: 'Hh',
            alt: true
        }, function() {
            //this.mostrarAyuda('Priorizar centro de balance por especialidad');
        }, this);

        vista.globalKeyMap.accessKey({
            key: 'Ll',
            alt: true
        }, function() {
            this.limpiarIUCB(vista, modelo);
        }, this);

        vista.globalKeyMap.accessKey({
            key: 'Gg',
            alt: true
        }, function() {
            this.guardarPrioridad();
        }, this);


        /************* FIN TECLAS CALIENTES*************/

        vista.btnGuardar.on('click', function() {
            this.guardarPrioridad();
        }, this);

        vista.btnAyudaPrioEnt.on('click', function() {
            //this.mostrarAyuda('Priorizar centro de balance por especialidad');
        }, this);

        vista.btnBajar.on('click', function() {
            bajar = true;
            this.ordenarPrioridad('down', modelo, vista);
        }, this);

        vista.btnSubir.on('click', function() {

            subir = true;
            this.ordenarPrioridad('up', modelo, vista);
        }, this);

        vista.btnLimpiarFiltrosCB.on('click', function() {
            this.limpiarIUCB(vista, modelo);     }, this);
    },
    ordenarPrioridad: function(orden, modelo, vista) {
        var j = 0;
        var contpri = vista.prioini;
        var recordsSel = vista.gridEspecialidad.getSelectionModel().getSelected();
        modelo.stgpEspecialidad.each(function(rec) {
            if (modelo.stgpEspecialidad.getAt(j).data.idespecialidad == recordsSel.data.idespecialidad) {
                var tmpdata = eval(uneval(modelo.stgpEspecialidad.getAt(j).data));
                if (orden == 'up' && j - 1 >= 0) {
                    modelo.stgpEspecialidad.getAt(j).data = eval(uneval(modelo.stgpEspecialidad.getAt(j - 1).data));
                    modelo.stgpEspecialidad.getAt(j - 1).data = tmpdata;
                    modelo.stgpEspecialidad.getAt(j - 1).commit();
                    vista.gridEspecialidad.getSelectionModel().selectRow(j - 1);
                } else {
                    if (j + 1 < modelo.stgpEspecialidad.getCount()) {

                        modelo.stgpEspecialidad.getAt(j).data = eval(uneval(modelo.stgpEspecialidad.getAt(j + 1).data));
                        modelo.stgpEspecialidad.getAt(j + 1).data = tmpdata;
                        modelo.stgpEspecialidad.getAt(j + 1).commit();
                        vista.gridEspecialidad.getSelectionModel().selectRow(j + 1);
                    }
                }
                modelo.stgpEspecialidad.getAt(j).commit();
            }
            j++;
        });
        j = 0;
        modelo.stgpEspecialidad.each(function(rec) {
            modelo.stgpEspecialidad.getAt(j).data.prioridad = contpri++;
            modelo.stgpEspecialidad.getAt(j).commit();
            j++;
        });


    },
    guardarPrioridad: function(orden, modelo, vista) {
        var scope = this;
        mostrarMensaje(2, '¿Está seguro que quiere guardar la priorización de planes seleccionado?', function(btnPresionado) {

            if (btnPresionado == 'ok') {
                if (scope.modelo.stgpEspecialidad.getCount() != 0) {
                    scope.MostrarBarraProgreso('Guardando priorización de especialidades.');
                    array_especialidad = [];
                    for (var i = 0; i < scope.modelo.stgpEspecialidad.getCount(); i++) {
                        array_especialidad.push({
                            idespecialidad: scope.modelo.stgpEspecialidad.getAt(i).data.idespecialidad,
                            prioridad: scope.modelo.stgpEspecialidad.getAt(i).data.prioridad,
                            centrobalance: scope.vista.smGpCB.getSelected().data.identidaddatosnomenclador
                        })
                    }
                    Ext.Ajax.request({
                        url: 'actualizarPrioridad',
                        params: {
                            planes_prioridad: Ext.encode(array_especialidad)
                        },
                        callback: function(options, success, response) {

                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 21) {
                                mostrarMensaje(1, 'La priorización de las especialidades se ha guardado satisfactoriamente.');
                            } else
                            if (responseData.codMsg == 22)
                                mostrarMensaje(1, 'No existe especialidad asociada al centro de balance seleccionado.');
                            Ext.MessageBox.hide();
                        }
                    });
                } else {
                    mostrarMensaje(1, 'Debe existir al menos un plan para priorizar.');
                }
            }



        })
    },
    MostrarBarraProgreso: function(msg) {
        Ext.MessageBox.show({
            title: 'Por favor espere...',
            width: 300,
            wait: true,
            progress: true,
            closable: false,
            animEl: 'mb6',
            msg: msg
        });
    },
    limpiarIUCB: function(vista, modelo) {
        vista.filtroscentrobalance.clearFilters();
        this.limpiarIUEsp(vista, modelo);
    },
    limpiarIUEsp: function(vista, modelo) {
        vista.filtrosespecialidades.clearFilters();
    }
}