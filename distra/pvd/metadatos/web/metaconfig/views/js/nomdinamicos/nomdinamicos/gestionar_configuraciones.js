/**
 * Autor: Tte. Ing. Roberto León Socarrás
 */
Ext.ns('PVD.Persona.Nomdinamicos');
PVD.Persona.Nomdinamicos.GestionarConfiguraciones = {
    init: function (idioma, panelMDM, configuracion) {
        var self = this;

        this.configConfTexto = new Array(
            {
                nombre: 'id',
                index: 'idconftexto',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Denominación',
                index: 'denominacion',
                tipo: 'texto',
                nulo: false,
                ancho: 250,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 0.7

            }
            , {
                nombre: 'Es TextArea',
                index: 'estextarea',
                tipo: 'logico',
                nulo: true,
                ancho: 80,
                mostraFiltro: false,
                tamannoForm: 0.3
            }
            , {
                nombre: 'Tamaño máximo texto',
                index: 'maxlengthtext',
                tipo: 'numero',
                nulo: true,
                ancho: 200,
                mostraFiltro: false,
                tamannoForm: 0.7
            }
            , {
                nombre: 'Es Contraseña',
                index: 'espass',
                tipo: 'logico',
                nulo: true,
                ancho: 80,
                mostraFiltro: false,
                tamannoForm: 0.3
            }
            , {
                nombre: 'Expresión regular',
                index: 'idexpresionregular',
                tipo: 'lista',
                nulo: true,
                fijo: false,
                tabla: 'mod_nomdinamicos.nom_expresionregular',
                campovalor: 'idexpresionregular',
                campoamostrar: 'denominacion',
                ancho: 120,
                mostraFiltro: false,
                tamannoForm: 1
            }
            /* , {
                 nombre    : 'idconftipoatributo',
                 index     : 'idconftipoatributo',
                 tipo      : 'numero',
                 oculto      : true,
                 nulo: true
             }*/
        );

        var configuracionMensajes = {femenino: true, numero: ['configuración de texto', 'cofiguraciones de textos']};

        this.pConfTexto = new Misitio.Panel_Gestion.GestionGridPanel({
            region: 'center',
            id: 'idconftexto',
            nombre: 'configuración de texto',
            configuracionMensajes: configuracionMensajes,
            collapsible: true,
            anchoForm: 320,
            autoScroll: true,
            animeCollapse: true,
            autoCargar: false,
            urlListar: 'listarGenerico',
            urlGuardar: 'guardarGenerico',
            urlEliminar: 'eliminarGenerico',
            tabla: 'mod_nomdinamicos.conf_texto',
            idtabla: 'idconftexto',
            configuracion: self.configConfTexto
        });

        this.configConfFecha = new Array(
            {
                nombre: 'id',
                index: 'idconffecha',
                tipo: 'numero',
                nulo: false
            }
            , {
                nombre: 'Denominación',
                index: 'denominacion',
                tipo: 'texto',
                nulo: false,
                unico: true,
                ancho: 250,
                mostraFiltro: true,
                tamannoForm: 1
            }
            , {
                nombre: 'Formato',
                index: 'format',
                tipo: 'texto',
                tipo: 'texto',
                nulo: true,
                unico: false,
                ancho: 80,
                mostraFiltro: true,
                tamannoForm: 0.7
            }
            , {
                nombre: 'Solo lectura',
                index: 'readonly',
                tipo: 'logico',
                nulo: true,
                unico: false,
                ancho: 80,
                mostraFiltro: false,
                tamannoForm: 0.3
            }
        );

        var configuracionMensajes = {femenino: true, numero: ['configuración de fecha', 'cofiguraciones de fechas']};
        this.pConfFecha = new Misitio.Panel_Gestion.GestionGridPanel({
            region: 'center',
            id: 'idconffecha',
            nombre: 'configuración de fecha',
            configuracionMensajes: configuracionMensajes,
            collapsible: true,
            anchoForm: 320,
            autoScroll: true,
            animeCollapse: true,
            autoCargar: false,
            urlListar: 'listarGenerico',
            urlGuardar: 'guardarGenerico',
            urlEliminar: 'eliminarGenerico',
            tabla: 'mod_nomdinamicos.conf_fecha',
            idtabla: 'idconffecha',
            configuracion: self.configConfFecha
        });


        this.configConfNumero = new Array(
            {

                nombre: 'id',
                index: 'idconfnumero',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Denominación',
                index: 'denominacion',
                tipo: 'texto',
                nulo: false,
                unico: true,
                ancho: 250,
                mostraFiltro: true,
                tamannoForm: 1
            }
            , {
                nombre: 'Permite decimales',
                index: 'allowdecimals',
                tipo: 'logico',
                nulo: true,
                ancho: 80,
                mostraFiltro: false,
                tamannoForm: 0.33
            }
            , {
                nombre: 'Permite negativos',
                index: 'allownegative',
                tipo: 'logico',
                nulo: true,
                ancho: 80,
                mostraFiltro: false,
                tamannoForm: 0.33
            }
            , {
                nombre: 'Cantidad cifras decimales',
                index: 'decimalprecision',
                tipo: 'numero',
                nulo: true,
                ancho: 80,
                mostraFiltro: false,
                tamannoForm: 0.33
            }
        );

        var configuracionMensajes = {femenino: true, numero: ['configuración de número', 'cofiguraciones de números']};
        this.pConfNumero = new Misitio.Panel_Gestion.GestionGridPanel({
            region: 'center',
            id: 'idconfnumero',
            nombre: 'configuración de número',
            configuracionMensajes: configuracionMensajes,
            collapsible: true,
            anchoForm: 320,
            autoScroll: true,
            animeCollapse: true,
            autoCargar: false,
            urlListar: 'listarGenerico',
            urlGuardar: 'guardarGenerico',
            urlEliminar: 'eliminarGenerico',
            tabla: 'mod_nomdinamicos.conf_numero',
            idtabla: 'idconfnumero',
            configuracion: self.configConfNumero
        });

        this.configConfLogico = new Array(
            {

                nombre: 'id',
                index: 'idconflogico',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Denominación',
                index: 'denominacion',
                tipo: 'texto',
                nulo: false,
                ancho: 250,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 0.80

            }

            , {
                nombre: 'Chequeado',
                index: 'checked',
                tipo: 'logico',
                nulo: true,
                tamannoForm: 0.20
            }
        );


        var configuracionMensajes = {femenino: true, numero: ['configuración de lógico', 'cofiguraciones de lógicos']};

        this.pConfLogico = new Misitio.Panel_Gestion.GestionGridPanel({
            region: 'center',
            id: 'idconflogico',
            nombre: 'configuración de lógico',
            configuracionMensajes: configuracionMensajes,
            collapsible: true,
            anchoForm: 320,
            autoScroll: true,
            animeCollapse: true,
            autoCargar: false,
            urlListar: 'listarGenerico',
            urlGuardar: 'guardarGenerico',
            urlEliminar: 'eliminarGenerico',
            tabla: 'mod_nomdinamicos.conf_logico',
            idtabla: 'idconflogico',
            configuracion: self.configConfLogico
        });

        this.configConfLista = new Array(
            {

                nombre: 'id',
                index: 'idconflista',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Denominación',
                index: 'denominacion',
                tipo: 'texto',
                nulo: false,
                unico: true,
                ancho: 250,
                mostraFiltro: true,
                tamannoForm: 1

            }
            , {
                nombre: 'Tabla',
                index: 'tabla',
                tipo: 'texto',
                nulo: true,
                fijo: false,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 1
            }
            , {
                nombre: 'Campo valor',
                index: 'campovalor',
                tipo: 'texto',
                nulo: true,
                unico: false,
                mostraFiltro: true,
                tamannoForm: 1
            }
            , {
                nombre: 'Campo a mostrar',
                index: 'campoamostrar',
                tipo: 'texto',
                nulo: true,
                unico: false,
                mostraFiltro: true,
                tamannoForm: 1
            }
            , {
                nombre: 'Consulta',
                index: 'consulta',
                tipo: 'texto',
                nulo: true,
                estextarea: true,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1
            }
            , {
                nombre: 'Plantilla',
                index: 'tpl',
                tipo: 'texto',
                nulo: true,
                estextarea: true,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1
            }
        );

        var configuracionMensajes = {femenino: true, numero: ['configuración de lista', 'cofiguraciones de listas']};

        this.pConfLista = new Misitio.Panel_Gestion.GestionGridPanel({
            region: 'center',
            id: 'idconflista',
            nombre: 'configuración de lista',
            configuracionMensajes: configuracionMensajes,
            collapsible: true,
            anchoForm: 320,
            autoScroll: true,
            animeCollapse: true,
            autoCargar: false,
            urlListar: 'listarGenerico',
            urlGuardar: 'guardarGenerico',
            urlEliminar: 'eliminarGenerico',
            tabla: 'mod_nomdinamicos.conf_lista',
            idtabla: 'idconflista',
            configuracion: self.configConfLista
        });

        this.configRegExp = new Array(
            {

                nombre: 'id',
                index: 'idexpresionregular',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Denominación',
                index: 'denominacion',
                tipo: 'texto',
                nulo: false,
                unico: true,
                ancho: 250,
                mostraFiltro: true,
                tamannoForm: 1

            }
            , {
                nombre: 'Expresión regular',
                index: 'expresionregular',
                tipo: 'texto',
                nulo: true,
                fijo: false,
                unico: false,
                ancho: 250,
                mostraFiltro: false,
                tamannoForm: 1
            }
            , {
                nombre: 'Mensaje',
                index: 'mensaje',
                tipo: 'texto',
                ancho: 250,
                nulo: true,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1
            },
            {
                nombre: 'Descripción',
                index: 'descripcion',
                tipo: 'texto',
                nulo: true,
                estextarea: true,
                ancho: 250,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1
            }
        );

        var configuracionMensajes = {femenino: true, numero: ['expresión regular', 'expresiones regulares']};

        this.pRegExp = new Misitio.Panel_Gestion.GestionGridPanel({
            region: 'center',
            id: 'idexpresionregular',
            nombre: 'expresión regular',
            configuracionMensajes: configuracionMensajes,
            collapsible: true,
            anchoForm: 320,
            autoScroll: true,
            animeCollapse: true,
            autoCargar: false,
            urlListar: 'listarGenerico',
            urlGuardar: 'guardarGenerico',
            urlEliminar: 'eliminarGenerico',
            tabla: 'mod_nomdinamicos.nom_expresionregular',
            idtabla: 'idexpresionregular',
            configuracion: self.configRegExp
        });

        this.configMensajes = new Array(
            {

                nombre: 'id',
                index: 'idmensaje',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Denominación',
                index: 'denominacion',
                tipo: 'texto',
                nulo: false,
                unico: true,
                ancho: 250,
                mostraFiltro: true,
                tamannoForm: 1

            }
            , {
                nombre: 'Singular',
                index: 'singular',
                tipo: 'texto',
                nulo: false,
                unico: false,
                ancho: 150,
                mostraFiltro: false,
                tamannoForm: 1
            }
            , {
                nombre: 'Plural',
                index: 'plural',
                tipo: 'texto',
                ancho: 150,
                nulo: false,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1
            },
            {
                nombre: 'Femenino',
                index: 'femenino',
                tipo: 'logico',
                ancho: 120,
                nulo: true,
                tamannoForm: 1
            }
        );

        var configuracionMensajes = {
            femenino: true,
            numero: ['configuración de mensaje', 'configuraciones de mensajes']
        };

        this.pMensaje = new Misitio.Panel_Gestion.GestionGridPanel({
            region: 'center',
            id: 'idmensaje',
            nombre: 'configuración de mensaje',
            configuracionMensajes: configuracionMensajes,
            collapsible: true,
            anchoForm: 320,
            autoScroll: true,
            animeCollapse: true,
            autoCargar: false,
            urlListar: 'listarGenerico',
            urlGuardar: 'guardarGenerico',
            urlEliminar: 'eliminarGenerico',
            tabla: 'mod_nomdinamicos.nom_mensaje',
            idtabla: 'idmensaje',
            configuracion: self.configMensajes
        });

        this.configConfMaestroDetalle = new Array(
            {
                nombre: 'id',
                index: 'idmaestrodetalle',
                tipo: 'numero',
                nulo: true
            }, {
                nombre: 'Denominación',
                index: 'denominacion',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 1

            }, {
                nombre: 'Id configuración',
                index: 'idconfiguracion',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: true,
                tamannoForm: 1

            }, {
                nombre: 'Identificador',
                index: 'identificador',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: true,
                tamannoForm: 1

            }
            , {
                nombre: 'Id entidad maestro',
                index: 'identidadmaestro',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1

            }, {
                nombre: 'id entidad detalle',
                index: 'identidaddetalle',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1

            }, {
                nombre: 'Id atributo maestro',
                index: 'idatributomaestro',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1

            }, {
                nombre: 'Id atributo detalle',
                index: 'idatributodetalle',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1

            }
        );

        var configuracionMensajes = {
            femenino: true,
            numero: ['configuración maestro-detalle', 'cofiguraciones maestro-detalle']
        };

        this.pConfMaestroDetalle = new Misitio.Panel_Gestion.GestionGridPanel({
            region: 'center',
            id: 'idconfmaestrodetalleo',
            nombre: 'configuración maestro-detalle',
            configuracionMensajes: configuracionMensajes,
            collapsible: true,
            anchoForm: 320,
            autoScroll: true,
            animeCollapse: true,
            autoCargar: false,
            urlListar: 'listarGenerico',
            urlGuardar: 'guardarGenerico',
            urlEliminar: 'eliminarGenerico',
            tabla: 'mod_nomdinamicos.conf_maestrodetalle',
            idtabla: 'idmaestrodetalle',
            configuracion: self.configConfMaestroDetalle
        });
        /*******Prueba Maestro detalle multiple********************************************************************************************************************/

        this.configConfMaestro = new Array(
            {
                nombre: 'id',
                index: 'idconfmaestro',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Denominación',
                index: 'denominacion',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 1

            }
            , {
                nombre: 'Identificador',
                index: 'identificador',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 1

            }
            , {
                nombre: 'Id configuración',
                index: 'idconfiguracion',
                tipo: 'lista',
                nulo: true,
                fijo: false,
                tabla: 'mod_nomdinamicos.nom_configuracion',
                campovalor: 'idconfiguracion',
                campoamostrar: 'denominacion',
                ancho: 120,
                mostraFiltro: false,
                tamannoForm: 1

            }
            , {
                nombre: 'Id entidad maestro',
                index: 'identidadmaestro',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1

            }
            , {
                nombre: 'Id atributo maestro',
                index: 'idatributomaestro',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1

            }
        );

        var configuracionMensajes = {
            femenino: true,
            numero: ['configuración del maestro', 'cofiguraciones de los maestros']
        };

        this.pConfMaestro = new Misitio.Panel_Gestion.GestionGridPanel({
            region: 'center',
            id: 'idconfmaestro',
            nombre: 'configuración del maestro',
            configuracionMensajes: configuracionMensajes,
            collapsible: true,
            anchoForm: 320,
            autoScroll: true,
            animeCollapse: true,
            autoCargar: false,
            tabla: 'mod_nomdinamicos.conf_maestro',
            idtabla: 'idconfmaestro',
            configuracion: self.configConfMaestro
        });

        this.configConfDetalle = new Array(
            {
                nombre: 'id',
                index: 'idconfdetalle',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Id entidad detalle',
                index: 'identidaddetalle',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: true,
                tamannoForm: 1

            }
            , {
                nombre: 'Id atributo detalle',
                index: 'idatributodetalle',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: true,
                tamannoForm: 1

            },
            {
                nombre: 'Id columna maestro',
                index: 'idconfmaestro',
                tipo: 'oculto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1
            }
        );

        var configuracionMensajes = {
            femenino: true,
            numero: ['configuración del detalle', 'cofiguraciones de los detalles']
        };

        this.pConfDetalle = new Misitio.Panel_Gestion.GestionGridPanelDetalle({
            nombre: 'configuración del detalle',
            configuracionMensajes: configuracionMensajes,
            id: 'panelDetalles',
            region: 'east',
            width: screen.width * 0.5,
            anchoForm: 320,
            columnaDetalle: 'idconfmaestro',
            autoCargar: false,
            collapsible: true,
            animCollapse: true,
            split: true,
            autoScroll: true,
            tabla: 'mod_nomdinamicos.conf_detalle',
            idtabla: 'idconfdetalle',
            configuracion: self.configConfDetalle
        });

        var panelMaestro = self.pConfMaestro;
        var panelDetalle = self.pConfDetalle;
        panelDetalle.disable();
        panelMaestro.csm.on('rowselect', function (sm, rowIndex, r) {
            if (sm.getSelections().length > 0) {
                panelDetalle.btnAdicionar.enable();
                panelDetalle.enable();
                panelDetalle.valorcolumnaDetalle = r.data['idconfmaestro'];
                panelDetalle.store.load();
            } else {
                panelDetalle.btnAdicionar.disable();
                panelDetalle.store.removeAll();
                panelDetalle.disable();
            }
        });
        panelMaestro.csm.on('rowdeselect', function (sm, rowIndex, r) {
            if (sm.getSelections().length > 0) {
                panelDetalle.btnAdicionar.enable();
                panelDetalle.enable();
            } else {
                panelDetalle.btnAdicionar.disable();
                panelDetalle.store.removeAll();
                panelDetalle.disable();
            }
        });


        var items = [self.pConfMaestro, self.pConfDetalle];


        this.pConfMaestroDetallesMultiple = new Ext.Panel({
            id: 'pConfMaestroDetallesMultiple',
            collapsible: true,
            layout: 'border',
            columnaMaestro: 'idconfmaestro',
            split: true,
            items: items
        });
        /*******Prueba Maestro detalle multiple********************************************************************************************************************/
        /*******Prueba nomenclador********************************************************************************************************************/

        var configuracionMensajes = {
            femenino: false,
            numero: ['color de piel', 'colores de piel']
        };

        this.pNomenclador = new Misitio.Panel_Gestion.GestionNomenclador({
            nombre: 'color de piel',
            configuracionMensajes: configuracionMensajes,
            id: 'panelNomenclador',
            region: 'center',
            width: screen.width * 0.5,
            autoCargar: false,
            collapsible: true,
            animCollapse: true,
            split: true,
            autoScroll: true,
            tabla: 'mod_personaprueba.nom_colorpiel',
            idtabla: 'idcolorpiel'
        });
        /*******Prueba nomenclador********************************************************************************************************************/


        /*******Panel de configuracion de nomencladores********************************************************************************************************************/


        var configuracionMensajes = {
            femenino: true,
            numero: ['configuración del agrupador', 'cofiguraciones de los agrupadores']
        };

        this.pNomAgrupador = new Misitio.Panel_Gestion.GestionNomenclador({
            id: 'panelNomAgrupador',
            region: 'center',
            collapsible: true,
            animCollapse: true,
            split: true,
            width: screen.width * 0.5,
            autoScroll: true,
            nombre: 'configuración del agrupador',
            configuracionMensajes: configuracionMensajes,
            tabla: 'mod_nomdinamicos.nom_agrupador',
            idtabla: 'idagrupador'
        });

        var panelMaestro = new Ext.Panel({
            id: 'panelMaestro',
            layout: 'fit',
            region: 'center',
            collapsible: true,
            split: true,
            items: [self.pNomAgrupador]
        });

        this.configConfNomenclador = new Array(
            {
                nombre: 'id',
                index: 'idconfnomenclador',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Denominación',
                index: 'denominacion',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 1

            }
            , {
                nombre: 'Nombre tabla',
                index: 'nombretabla',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1

            }
            , {
                nombre: 'Id tabla',
                index: 'idtabla',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: false,
                tamannoForm: .5

            }
            , {
                nombre: 'Identificador',
                index: 'identificador',
                tipo: 'texto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: true,
                tamannoForm: .5

            }
            , {
                nombre: 'Singular',
                index: 'singular',
                tipo: 'texto',
                nulo: false,
                unico: false,
                ancho: 150,
                mostraFiltro: false,
                tamannoForm: 1
            }
            , {
                nombre: 'Plural',
                index: 'plural',
                tipo: 'texto',
                ancho: 150,
                nulo: false,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1
            }
            , {
                nombre: 'Femenino',
                index: 'femenino',
                tipo: 'logico',
                ancho: 120,
                nulo: true,
                tamannoForm: 1
            }
            , {
                nombre: 'idconfmaestro',
                index: 'idagrupador',
                tipo: 'oculto',
                nulo: false,
                ancho: 200,
                unico: false,
                mostraFiltro: false,
                tamannoForm: 1
            }
        );

        var configuracionMensajes = {
            femenino: true,
            numero: ['configuración del nomenclador', 'cofiguraciones de los nomencladores']
        };

        this.pConfNomenclador = new Misitio.Panel_Gestion.GestionGridPanelDetalle({
            nombre: 'configuración del detalle',
            configuracionMensajes: configuracionMensajes,
            id: 'pConfNomenclador',
            region: 'east',
            anchoForm: 320,
            urlGuardar: 'guardarConfNomenclador',
            columnaDetalle: 'idagrupador',
            autoCargar: false,
            width: screen.width * 0.5,
            collapsible: true,
            animCollapse: true,
            split: true,
            autoScroll: true,
            tabla: 'mod_nomdinamicos.conf_nomenclador',
            idtabla: 'idconfnomenclador',
            configuracion: self.configConfNomenclador
        });
        this.btnMostrarNomencladorSeleccionado = new Ext.Button({
            text: "Ver nomenclador",
            disabled: true,
            tooltip: "Ver nomenclador seleccionado",
            iconCls: 'ver',
            id: "btnMostrarNomencladorSeleccionado",
            handler: function () {
                cargarConfiguracionNomenclador(self.pConfNomenclador.csm.getSelected());
            }.createDelegate(this)
        });

        function cargarConfiguracionNomenclador(lastFilaSeleccionada) {
            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});

            var respuesta = new Array();

            if (Ext.getCmp('ventananm' + lastFilaSeleccionada.id) == null) {

                var configuracionMensajes = {
                    femenino: lastFilaSeleccionada.data.femenino,
                    numero: [lastFilaSeleccionada.data.singular, lastFilaSeleccionada.data.plural]
                };
                var nuevo = new Misitio.Panel_Gestion.GestionNomenclador({
                    title: lastFilaSeleccionada.data.denominacion,
                    nombre: lastFilaSeleccionada.data.denominacion,
                    configuracionMensajes: configuracionMensajes,
                    id: 'nomenclador' + lastFilaSeleccionada.id,
                    region: 'center',
                    tabla: lastFilaSeleccionada.data.nombretabla,
                    idtabla: lastFilaSeleccionada.data.idtabla
                });




                var ventanaConceptoSeleccionado = new Ext.Window({
                    modal: true,
                    enableTabScroll: true,
                    id: 'ventananm' + lastFilaSeleccionada.id,
                    closeAction: 'hide',
                    height: screen.height * 0.50,
                    width: screen.width * 0.50,
                    closable: true,
                    resizable: false,
                    maximizable: true,
                    constrain: true,
                    minimizable: true,
                    layout: 'fit',
                    items: [nuevo]
                });

                ventanaConceptoSeleccionado.show();
            } else {
                var configuracionMensajes = {
                    femenino: lastFilaSeleccionada.data.femenino,
                    numero: [lastFilaSeleccionada.data.singular, lastFilaSeleccionada.data.plural]
                };
                
                Ext.getCmp('nomenclador' + lastFilaSeleccionada.id).ventanaGestion.destroy();

                var nuevo = new Misitio.Panel_Gestion.GestionNomenclador({
                    title: lastFilaSeleccionada.data.denominacion,
                    nombre: lastFilaSeleccionada.data.denominacion,
                    //configuracionMensajes: configuracion.configuracionMensajes,
                    id: 'nomenclador' + lastFilaSeleccionada.id,
                    region: 'center',
                    tabla: lastFilaSeleccionada.data.nombretabla,
                    idtabla: lastFilaSeleccionada.data.idtabla
                });

                Ext.getCmp('ventananm' + lastFilaSeleccionada.id).remove('nomenclador' + lastFilaSeleccionada.id);
                Ext.getCmp('ventananm' + lastFilaSeleccionada.id).add(nuevo);

                Ext.getCmp('ventananm' + lastFilaSeleccionada.id).show();
            }
            myMask.hide();

        }

        self.pConfNomenclador.on('render', function () {
            self.pConfNomenclador.getTopToolbar().addButton(self.btnMostrarNomencladorSeleccionado);
            self.pConfNomenclador.btnEliminar.on('enable', function () {
                self.pConfNomenclador.getTopToolbar().items.items[4].enable();
            });

            self.pConfNomenclador.btnEliminar.on('disable', function () {
                self.pConfNomenclador.getTopToolbar().items.items[4].disable();
            });
        });


        this.pmdConfiguracionNomenclador = new Misitio.Panel_Gestion.GestionPanelMaestroDetalle({
            id: 'pmdConfiguracionNomenclador',
            collapsible: true,
            columnaMaestro: 'idagrupador',
            panelDetalle: self.pConfNomenclador,
            panelMaestro: panelMaestro,
            split: true
        });

        /*******Panel de configuracion de nomencladores********************************************************************************************************************/

        var activopConfTexto = false, activoppConfNumero = false,
            activoppConfFecha = false, activoppConfLogico = false,
            activopRegExp = false, activopMensaje = false,
            activopPanelNomenclador = false,
            activopPanelConfNomenclador = false,
            activopPanel1 = false,
            activopMaestroDetalle = false,
            activopMaestroDetalleMultiple = false,
            activoppConfLista = false;
        this.tbpActivo = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            maskDisabled: false,
            enableTabScroll: true,
            border: true,
            items: [
                {
                    id: 'conftexto',
                    title: 'Configuración texto',
                    layout: 'fit',
                    items: [self.pConfTexto],
                    listeners: {
                        activate: function (tab) {
                            if (!activopConfTexto) {
                                tab.initialConfig.items[0].cargarElementos(tab.initialConfig.items[0]);
                                activopConfTexto = true;
                            }

                        }
                    }
                }
                , {
                    id: 'confnumero',
                    title: 'Configuración número',
                    layout: 'fit',
                    items: [self.pConfNumero],
                    listeners: {
                        activate: function (tab) {
                            if (!activoppConfNumero) {
                                tab.initialConfig.items[0].cargarElementos(tab.initialConfig.items[0]);
                                activoppConfNumero = true;
                            }

                        }
                    }
                }
                , {
                    id: 'conffecha',
                    title: 'Configuración fecha',
                    layout: 'fit',
                    items: [self.pConfFecha],
                    listeners: {
                        activate: function (tab) {
                            if (!activoppConfFecha) {
                                tab.initialConfig.items[0].cargarElementos(tab.initialConfig.items[0]);
                                activoppConfFecha = true;
                            }

                        }
                    }
                }
                , {
                    id: 'conflogico',
                    title: 'Configuración lógico',
                    layout: 'fit',
                    items: [self.pConfLogico],
                    listeners: {
                        activate: function (tab) {
                            if (!activoppConfLogico) {
                                tab.initialConfig.items[0].cargarElementos(tab.initialConfig.items[0]);
                                activoppConfLogico = true;
                            }
                        }

                    }
                }
                , {
                    id: 'conflista',
                    title: 'Configuración lista',
                    layout: 'fit',
                    items: [self.pConfLista],
                    listeners: {
                        activate: function (tab) {
                            if (!activoppConfLista) {
                                tab.initialConfig.items[0].cargarElementos(tab.initialConfig.items[0]);
                                activoppConfLista = true;
                            }
                        }
                    }
                }
                , {
                    id: 'confmensaje',
                    title: 'Configuración de mensaje',
                    layout: 'fit',
                    items: [self.pMensaje],
                    listeners: {
                        activate: function (tab) {
                            if (!activopMensaje) {
                                tab.initialConfig.items[0].cargarElementos(tab.initialConfig.items[0]);
                                activopMensaje = true;
                            }
                        }
                    }
                }
                , {
                    id: 'regexp',
                    title: 'Expresión regular',
                    layout: 'fit',
                    items: [self.pRegExp],
                    listeners: {
                        activate: function (tab) {
                            if (!activopRegExp) {
                                tab.initialConfig.items[0].cargarElementos(tab.initialConfig.items[0]);
                                activopRegExp = true;
                            }
                        }
                    }
                }
                , {
                    id: 'nomenclador',
                    title: 'Configuración del nomenclador',
                    layout: 'fit',
                    items: [self.pmdConfiguracionNomenclador],
                    listeners: {
                        activate: function (tab) {
                            if (!activopPanelConfNomenclador) {
                                //tab.initialConfig.items[0].cargarElementos(tab.initialConfig.items[0]);
                                activopPanelConfNomenclador = true;
                            }
                        }
                    }
                }
                , {
                    id: 'MD',
                    title: 'Configuración maestro-detalle',
                    layout: 'fit',
                    items: [self.pConfMaestroDetalle],
                    listeners: {
                        activate: function (tab) {
                            if (!activopMaestroDetalle) {
                                tab.initialConfig.items[0].cargarElementos(tab.initialConfig.items[0]);
                                activopMaestroDetalle = true;
                            }
                        }
                    }
                }
                , {
                    id: 'MDM',
                    title: 'Configuración maestro-detalle múltiple',
                    layout: 'fit',
                    items: [self.pConfMaestroDetallesMultiple],
                    listeners: {
                        activate: function (tab) {
                            if (!activopMaestroDetalleMultiple) {
                                tab.initialConfig.items[0].initialConfig.items[0].cargarElementos(tab.initialConfig.items[0].initialConfig.items[0]);
                                activopMaestroDetalleMultiple = true;
                            }
                        }
                    }
                }
                /*, {
                    id: 'panel',
                    title: 'Panel prueba',
                    closable: true,
                    layout: 'fit',
                    items: [panel],
                    listeners: {
                        activate: function (tab) {
                            if (!activopPanel) {
                                tab.initialConfig.items[0].actualizarVista(tab.initialConfig.items[0]);
                                activopPanel = true;
                            }
                        }
                    }
                }*/
                , {
                    id: 'panel1',
                    title: 'Panel otra prueba',
                    layout: 'fit',
                    closable: true,
                    items: [Misitio.Funciones.VentanaConceptos({
                        id: 'ida',
                        identificadorconfiguracion: 'a'
                    })],
                    listeners: {
                        activate: function (tab) {
                            if (!activopPanel1) {
                                //tab.initialConfig.items[0].actualizarVista(tab.initialConfig.items[0]);
                                activopPanel1 = true;
                            }
                        }
                    }
                },
                {
                    id: 'panel33',
                    title: 'Panel otra prueba++',
                    layout: 'fit',
                    closable: true,
                    items: [self.pNomenclador],
                    listeners: {
                        activate: function (tab) {
                            if (!activopPanelNomenclador) {
                                tab.initialConfig.items[0].actualizarVista(tab.initialConfig.items[0]);
                                activopPanelNomenclador = true;
                            }
                        }
                    }
                }
               /* , {
                    id: 'panelMD',
                    title: 'Panel Maestro-Detalle Multiple',
                    layout: 'fit',

                    items: [panelMDM]

                }*/
                , {
                    id: 'panelNomencladoresSimples',
                    title: 'Panel Nomencladores Simples',
                    layout: 'fit',
                    items: [Misitio.Funciones.VentanaNomencladoresSimples({
                        id: 'NomencladoresSimples',
                        identificadorconfiguracion: 'a'
                    })]

                }, {
                    id: 'panelMaestroDetalle',
                    title: 'Panel conceptos maestro-detalle',
                    layout: 'fit',
                    items: [Misitio.Funciones.VentanaMaestroDetalleOptimizada({
                        id: 'MaestroDetalle',
                        identificadorconfiguracion: 'a'
                    })]

                }
            ],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }

            }
        });

    }
};