/**
 * Created by Miguel Antonio on 18/01/2016.
 */
Ext.ns('Ext.SUIN.Consultar');
Ext.SUIN.Consultar.panelDatos = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {
        var me = this
        me.recDatos = new Ext.data.Record.create({
            name: 'idpersona'
        }, {
            name: 'numid'
        }, {
            name: 'nombre'
        }, {
            name: 'snombre'
        }, {
            name: 'papel'
        }, {
            name: 'sapel'
        }, {
            name: 'nompa'
        }, {
            name: 'nomma'
        }, {
            name: 'fechanacimiento'
        }, {
            name: 'fallecido'
        }, {
            name: 'fechafallecido'
        }, {
            name: 'talla'
        }, {
            name: 'peso'
        }, {
            name: 'tomo'
        }, {
            name: 'folio'
        }, {
            name: 'annoregistrocivil'
        }, {
            name: 'huella'
        }, {
            name: 'idcolorpelo'
        }, {
            name: 'idcolorojos'
        }, {
            name: 'idcolorpiel'
        }, {
            name: 'idregistrocivil'
        }, {
            name: 'idregistrocivil'
        }, {
            name: 'idpaisnac'
        }, {
            name: 'idprovincianac'
        }, {
            name: 'idmunicipionac'
        }, {
            name: 'idprovincianac'
        }, {
            name: 'idprovinciares'
        }, {
            name: 'idmunicipiores'
        }, {
            name: 'fechares'
        }, {
            name: 'direccion'
        }, {
            name: 'fechaactualizacion'
        }, {
            name: 'paisprovmuni'
        }, {
            name: 'provmunicres'
        }, {
            name: 'registrocivil'
        }, {
            name: 'fallecido'
        }, {
            name: 'fechafallecido'
        });
        this.buscador = new Ext.Persona.pBuscadorSUIN({
            width: '50%',
            region: 'west',
            margins: '5 5 5 5'
        });

        /*this.fichaPersonaSUIN = new Ext.SUIN.Consultar.FichaPersonaDetail({
         width: '50%',
         region: 'center',
         margins: '5 5 5 0',
         layout: 'fit',

         });*/
        this.fichaPersonaSUIN = new Ext.SUIN.Consultar.pFicha({
            width: '50%',
            region: 'center',
            margins: '5 5 5 0',
            layout: 'fit',
        })

        this.items = [this.buscador, this.fichaPersonaSUIN]
        Ext.SUIN.Consultar.panelDatos.superclass.initComponent.call(this)
        this.buscador.on('rowselect', function (rec) {

            var data = new Array();
            var row = new me.recDatos({
                idpersona: rec.get('idpersona'),
                numid: rec.get('numid'),
                nombre: rec.get('nombre'),
                snombre: rec.get('snombre'),
                papel: rec.get('papel'),
                sapel: rec.get('sapel'),
                sexo: rec.get('sexo') == 1 ? 'Masculino' : 'Femenino',
                nompa: rec.get('nompa'),
                nomma: rec.get('nomma'),
                fechanacimiento: rec.get('fechanacimiento'),
                fallecido: rec.get('fallecido'),
                fechafallecido: rec.get('fechafallecido'),
                talla: rec.get('talla'),
                peso: rec.get('peso'),
                tomo: rec.get('tomo'),
                folio: rec.get('folio'),
                annoregistrocivil: rec.get('annoregistrocivil'),
                huella: rec.get('huella') == 't' ? true : false,
                idcolorpelo: rec.get('idcolorpelo'),
                idcolorojos: rec.get('idcolorojos'),
                idcolorpiel: rec.get('idcolorpiel'),
                idregistrocivil: rec.get('idregistrocivil'),
                idpaisnac: rec.get('idpaisnac'),
                idprovincianac: rec.get('idprovincianac'),
                idmunicipionac: rec.get('idmunicipionac'),
                idprovinciares: rec.get('idprovinciares'),
                idmunicipiores: rec.get('idmunicipiores'),
                direccion: rec.get('direccion'),
                fechares: rec.get('fechares'),
                fechaactualizacion: rec.get('fechaactualizacion'),
                paisprovmuni: rec.get('paisprovmuni'),
                provmunicres: rec.get('provmunicres'),
                registrocivil: rec.get('registrocivil'),
                colorojos: rec.get('colorojos'),
                colorpelo: rec.get('colorpelo'),
                colorpiel: rec.get('colorpiel'),

            });
            me.fichaPersonaSUIN.loadData(row);
        })
    }

});