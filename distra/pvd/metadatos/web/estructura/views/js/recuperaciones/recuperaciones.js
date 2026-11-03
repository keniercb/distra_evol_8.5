/**
 * @Created with PhpStorm.
 * @Author: Ing. Miguel Antonio Cabreja Aldana
 * @package distra
 * @subpackage Wand
 * @Date: 28/08/2015
 * @Version:@package_version@
 */
Ext.ns('PVD.Persona.ActivarPersona');

PVD.Persona.ActivarPersona.pActivar = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {
        var me = this;

        this.btnSync = new Ext.Button({
            text: 'Activar',
            disabled: true,
            iconCls: 'activarpersona',
            handler: function () {
                me.setFechaeliminado()
            }
        });
        /**
         *
         * @type {Ext.components.CmpReccomplejas.Interfaz}
         */
        this.persona = new Ext.components.CmpReccomplejas.Interfaz({
            title: 'Listado de personas',
            disabled: false,
            width: '100%',
            region: 'center',
            margins: '5 0 5 5 ',
            border: true,
            idconfiguracion: 'estructura',
            tituloReporte: 'Listado de personas',
            tituloConfiguracion: 'Configuración de la búsqueda',
            tituloGrid: 'Listado de personas',
            hideBtnRtf: true,
            mainToolBar: [/*this.btnSync, ,*/ '->',{
                text: 'Ayuda',
                iconCls: 'btn',
                icon: perfil.dirImg + 'ayuda.png'
            }],
            singleSelect: false,
            noUsarGestAvisos: true,
            useMap: false,
            autoLoadList: true,
            hideBtnOperCant: false,
            renderers: me.getRenderes()
        });


        this.items = [this.persona];

        PVD.Persona.ActivarPersona.pActivar.superclass.initComponent.call(this);

        this.persona.pReporte.gpReporte.getSelectionModel().on('rowselect', function (sm, rowIndex, rec) {
            this.recordpersona = rec;
            this.btnSync.enable();

        }, this);
    },
    getRenderes: function () {
        return Ext.apply({
            showSexo: function (val) {
                if (val === 'Femenino') {
                    return '<img ext:qtip="<b>Femenina</b> "src="../../views/images/persona/female.png" />';
                }
                return '<img ext:qtip="<b>Maculino</b>" src="../../views/images/persona/male.png" />';
            },
            showVerdaderoFalso: function (val) {
                if (val === true || val == 0 ||val == '0'|| val ) {
                    return '<img ext:qtip="<b>Es decisorio</b> "src="/metadatos/comun/recursos/iconos/checked.png" />';
                }
                return '<img ext:qtip="<b>No es decisorio</b>" src="/metadatos/comun/recursos/iconos/unchecked.png" />';
            }
        });

    },
    setFechaeliminado: function () {
        var me = this;
        var personas = this.persona.pReporte.gpReporte.getSelectionModel().getSelections();
        var arrayId = new Array();
        Ext.each(personas, function (rec) {
            arrayId.push(rec.get('idpersona'));
        });

        //PVD.mostrarMascara('mask', 'Por favor espere', 'Enviando datos al servidor...');
        Ext.Ajax.request({
            url: '/pvd/persona/projects/basetecnologica/index.php/basetecnologica/restPerson',
            method: 'POST',
            params: {
                arrPersons: Ext.encode(arrayId)
            },
            callback: function (options, success, response) {
                PVD.ocultarMascara('mask');
                var responseData = Ext.decode(response.responseText);
                me.persona.pReporte.gpReporte.getStore().reload();

            }
        })
    }
});