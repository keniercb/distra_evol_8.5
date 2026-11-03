/**
 * @Created por XETID-RRHH.
 * @Author: Ing. Miguel Antonio Cabreja Aldana
 * @Date: 14/10/2014
 * @Time: 15:43
 * @Version:1.0
 */
Ext.ns('PVD.Persona.NomTipoRegimen');

PVD.Persona.NomTipoRegimen.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de r&eacute;gimen de trabajo',
    /**
     * Títulos de los componentes del formulario
     */
    tfDenomination: 'Denominación',
    tfHorastrabajodiarias:'Horas de trabajo',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo r&eacute;gimen de trabajo',
    titleWindMod: 'Modificar tipo r&eacute;gimen de trabajo',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo r&eacute;gimen de trabajo <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo r&eacute;gimen de trabajo <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo r&eacute;gimen de trabajo <b>(DEL)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de r&eacute;gimen(es) de trabajo(s) se ha(n) sido eliminado(s) satisfactoriamente',
    msgNotDel: 'El tipo r&eacute;gimen de trabajo seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo r&eacute;gimen de trabajo ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo r&eacute;gimen de trabajo que quiere adicionar ya existe.',
    msgNotMod: 'El tipo r&eacute;gimen de trabajo ya existe.',
    msgMod: 'El tipo r&eacute;gimen de trabajo ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de r&eacute;gimen(es) de trabajo(s) seleccionado(s).?'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoRegimen.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        this.lang = PVD.Persona.NomTipoRegimen.Lang;

        this.mapping = [
            {name: 'idregimentrabajo'},
            {name: 'denominacion'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];

        this.url = {
            getAll: '/pvd/persona/projects/cayococo/index.php/nomregimentrabajo/getTipoRegimenTrabajo',
            add: '/pvd/persona/projects/cayococo/index.php/nomregimentrabajo/addTipoRegimenTrabajo',
            mod: '/pvd/persona/projects/cayococo/index.php/nomregimentrabajo/modTipoRegimenTrabajo',
            del: '/pvd/persona/projects/cayococo/index.php/nomregimentrabajo/delTipoRegimenTrabajo',
            expt: '/pvd/persona/projects/cayococo/index.php/nomregimentrabajo/showReport'
        };

        this.title = this.lang.gpTitle;

        PVD.Persona.NomTipoRegimen.ViewGrid.superclass.initComponent.call(this);

    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoRegimen.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/projects/cayococo/index.php/nomregimentrabajo/getTipoRegimenTrabajo',
    mapping: [
        {name: 'idregimentrabajo'},
        {name: 'denominacion'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idregimentrabajo';
        this.displayField = 'denominacion';
        this.name = 'idregimentrabajo';
        this.hiddenName = 'idregimentrabajo';
        PVD.Persona.NomTipoRegimen.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tiporegimentrabajo', PVD.Persona.NomTipoRegimen.ViewCombo);
