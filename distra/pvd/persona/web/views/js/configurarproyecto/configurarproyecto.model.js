/**
 * Modelos de funcionalidad de configurar proyectos
 *
 * @author Ing. Javier Rodríguez López
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */
Ext.ns('Ext.pvd.persona.configurarproyecto');

Ext.pvd.persona.configurarproyecto.Modelo = {

    init: function (perfil) {

        /**
         * Store del Recuperador complejo
         * @type {Store}
         */
        this.stReccomplejo = new Ext.data.Store({
            url: 'cargarCbxRcompleja',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idconfiguracion'},
                {name: 'denominacion'}
            ])
        });

        /**
         * Store del grid de proyectos de persona
         * @type {Store}
         */
        this.stProject = new Ext.data.Store({
            url: 'getTodosProyectos',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {name: 'idproyecto'},
                {name: 'idconfiguracion'},
                {name: 'denominacion'},
                {name: 'servidor'},
                {name: 'puerto'},
                {name: 'basedato'},
                {name: 'usuario'},
                {name: 'contrasena'},
                {
                    name: 'fdatos', convert: function (v) {
                    return v == 0 ? 'No' : 'Si';
                }
                },
            ])
        });

    }

};