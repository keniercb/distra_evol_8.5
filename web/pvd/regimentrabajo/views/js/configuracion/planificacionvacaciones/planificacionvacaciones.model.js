Ext.ns('Pvd.ControlAsistencia.PlanificacionVacaciones');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.PlanificacionVacaciones.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {

        this.fuenteDatosListado = new Ext.data.GroupingStore({
            remoteSort: true,
            remoteGroup: true,
            url: 'getPersonasporcargo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name: 'idpersona'}, {name: 'numid'}, {name: 'nombreapellidos'}, {name: 'denomcargo'}, {name: 'area'}, {name: 'saldodic'}, {name: 'importedic'},
                    {name: 'saldovacacumuladas'}, {name: 'importevacacumuladas'}, {name: 'priquinenero'}, {name: 'segquinenero'}, {name: 'priquinfebrero'}, {name: 'segquinfebrero'},
                    {name: 'priquinmarzo'}, {name: 'segquinmarzo'}, {name: 'priquinabril'}, {name: 'segquinabril'}, {name: 'priquinmayo'},
                    {name: 'segquinmayo'}, {name: 'priquinjunio'}, {name: 'segquinjunio'}, {name: 'priquinjulio'}, {name: 'segquinjulio'},
                    {name: 'priquinagosto'}, {name: 'segquinagosto'}, {name: 'priquinseptiembre'}, {name: 'segquinseptiembre'}, {name: 'priquinoctubre'},
                    {name: 'segquinoctubre'}, {name: 'priquinnoviembre'}, {name: 'segquinnoviembre'}, {name: 'priquindiciembre'}, {name: 'segquindiciembre'}, {name: 'bandera'}]
            ),
            sortInfo: {field: 'area', direction: "ASC"},
            groupField: 'area',
            listeners: {
                load: function (st, recs, opt) {
                    if (recs.length == 0)
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    if (st.reader.jsonData.personaspasadasvac.length > 0 && st.reader.jsonData.personasproxvac.length > 0) {
                        // mostrarMensaje(1, 'Las personas que se listan a continuación están próximas a vencer el límite de días acumulados de vacaciones: ' + '<ul>' + st.reader.jsonData.personasproxvac + '</ul>');
                        // mostrarMensaje(3, 'Las personas que se listan a continuación vencieron el límite de días acumulados de vacaciones: ' + '<ul>' + st.reader.jsonData.personaspasadasvac + '</ul>');
                        mostrarMensaje(8, 'Hay personas que excedieron el límite de días acumulados de vacaciones <span style="color: red"><b> (rojo)</b> </span> y otras que están próximas a vencer <span style="color: orange"><b> (naranja) </b></span>.');
                    } else if (st.reader.jsonData.personaspasadasvac.length == 0 && st.reader.jsonData.personasproxvac.length > 0) {
                        //mostrarMensaje(1, 'Las personas que se listan a continuación están próximas a vencer el límite de días acumulados de vacaciones: ' + '<ul>' + st.reader.jsonData.personasproxvac + '</ul>');
                        mostrarMensaje(8, 'Hay personas que están próximas a vencer el límite de días acumulados de vacaciones  <span style="color: orange"><b> (naranja) </b> </span>.');
                    } else if (st.reader.jsonData.personaspasadasvac.length > 0 && st.reader.jsonData.personasproxvac.length == 0) {
                        // mostrarMensaje(3, 'Las personas que se listan a continuación vencieron el límite de días acumulados de vacaciones: ' + '<ul>' + st.reader.jsonData.personaspasadasvac + '</ul>');
                        mostrarMensaje(8, 'Hay personas que excedieron el límite de días acumulados de vacaciones <span style="color: red"><b> (rojo) </b></span>.');
                    }
                }
            }
        });

        this.storeYear = new Ext.data.SimpleStore({
            fields: [{name: 'idyear'}, {name: 'denominacion'}]
        });

        this.storeValores = new Ext.data.SimpleStore({
            fields: ['valor'],
            data: [['7'], ['10'], ['15'], ['20'], ['30']]
        });

        this.fuenteDatosListadoModeloVac = new Ext.data.GroupingStore({
            remoteSort: true,
            //remoteGroup: true,
            url: 'getPersonasModeloVac',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idplanvacaciones", totalProperty: "cantidad"},
                [{name: 'idplanvacaciones'}, {name: 'idpersona'}, {name: 'noidentidad'}, {name: 'idarea'}, {name: 'nombreapellidos'}, {name: 'vacacumuladas'}, {name: 'quincena'}
                    , {name: 'diashabiles'}, {name: 'fdesde'}, {name: 'fhasta'}, {name: 'diasnaturales'}, {name: 'idmes'}, {name: 'mes'}, {name: 'anno'}, {name: 'bandera'}, {name: 'idgrupodescanso'}, {name: 'origen'}]
            ),
            sortInfo: {field: 'mes', direction: "ASC"},
            groupField: 'mes',
            listeners: {
                load: function (st, recs, opt) {
                    if (recs.length == 0)
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    if (st.reader.jsonData.personassinvac.length > 0)
                        mostrarMensaje(8, 'Existen personas que no tienen suficientes vacaciones acumuladas por lo cual no se le podrá generar su modelo de vacaciones <span style="color: red"><b> (rojo) </b></span>.');
                    // mostrarMensaje(1, 'Las personas que se listan a continuación no tienen suficientes vacaciones acumuladas por lo cual no se le generará su modelo de vacaciones: ' + st.reader.jsonData.personassinvac);
                }
            }
        });

        this.recQrElement = new Ext.data.Record.create(
            {name: 'idplanvacaciones'}, {name: 'idpersona'}, {name: 'noidentidad'}, {name: 'idarea'}, {name: 'nombreapellidos'}, {name: 'vacacumuladas'}, {name: 'quincena'}
            , {name: 'diashabiles'}, {name: 'fdesde'}, {name: 'fhasta'}, {name: 'diasnaturales'}, {name: 'idmes'}, {name: 'mes'}, {name: 'anno'}, {name: 'bandera'}
        );

        this.storePersona = new Ext.data.GroupingStore({
            url: 'getPersonasAll',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "cantidad"},
                [{name: 'idpersona'}, {name: 'numid'}, {name: 'nombreapellidos'}, {name: 'denomcargo'}, {name: 'denomarea'}]
            ),
            sortInfo: {field: 'denomarea', direction: "ASC"},
            groupField: 'denomarea'
        });

        this.storecomboPersona = new Ext.data.Store({
            //  url   : '/pvd/maestro/configuraciones/index.php/confpiefirma/obtenerTipoFirma',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idpersona"
            }, [
                {name: 'idpersona'}

                ,
                {name: 'persona'}

            ])
        });

        this.storePersonaSS = new Ext.data.GroupingStore({
            url: 'getPersonasAll',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "cantidad"},
                [{name: 'idpersona'}, {name: 'numid'}, {name: 'nombreapellidos'}, {name: 'denomcargo'}, {name: 'denomarea'}]
            ),
            sortInfo: {field: 'denomarea', direction: "ASC"},
            groupField: 'denomarea'
        });

        this.storecomboPersonaSS = new Ext.data.Store({
            //  url   : '/pvd/maestro/configuraciones/index.php/confpiefirma/obtenerTipoFirma',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idpersona"
            }, [
                {name: 'idpersona'}

                ,
                {name: 'persona'}

            ])
        });

        this.storeRevisadopor = new Ext.data.GroupingStore({
            url: 'getPersonasAll',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "cantidad"},
                [{name: 'idpersona'}, {name: 'numid'}, {name: 'nombreapellidos'}, {name: 'denomcargo'}, {name: 'denomarea'}]
            ),
            sortInfo: {field: 'denomarea', direction: "ASC"},
            groupField: 'denomarea'
        });

        this.storecomboRevisadopor = new Ext.data.Store({
            //  url   : '/pvd/maestro/configuraciones/index.php/confpiefirma/obtenerTipoFirma',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idpersona"
            }, [
                {name: 'idpersona'}

                ,
                {name: 'persona'}

            ])
        });

        this.storeAprobadopor = new Ext.data.GroupingStore({
            url: 'getPersonasAll',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "cantidad"},
                [{name: 'idpersona'}, {name: 'numid'}, {name: 'nombreapellidos'}, {name: 'denomcargo'}, {name: 'denomarea'}]
            ),
            sortInfo: {field: 'denomarea', direction: "ASC"},
            groupField: 'denomarea'
        });

        this.storecomboAprobadopor = new Ext.data.Store({
            //  url   : '/pvd/maestro/configuraciones/index.php/confpiefirma/obtenerTipoFirma',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idpersona"
            }, [
                {name: 'idpersona'}

                ,
                {name: 'persona'}

            ])
        });

    }

};

