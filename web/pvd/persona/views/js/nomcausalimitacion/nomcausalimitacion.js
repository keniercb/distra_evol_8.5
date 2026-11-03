/**
 * @author Ing. Yaricel Guerra Velázquez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomCausalimitacion');
/**
 * Vista en forma de formulario
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCausalimitacion.ViewForm = Ext.extend(PVD.Persona.CmpNomenclador.ViewForm, {

    initComponent: function () {
        PVD.Persona.NomCausalimitacion.ViewForm.superclass.initComponent.call(this);
    }

});


/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCausalimitacion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        this.lang = PVD.Persona.NomCausalimitacion.Lang;
        this.referencia = 'nomcausalimitacion';
        this.mapping = [
            {name: 'idcausalimitacion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.title = this.lang.titleGrid;
        this.url = {
            getAll: '/pvd/persona/index.php/nomcausalimitacion/getAllCausa',
            add: '/pvd/persona/index.php/nomcausalimitacion/addCausa',
            mod: '/pvd/persona/index.php/nomcausalimitacion/modCausa',
            del: '/pvd/persona/index.php/nomcausalimitacion/delCausa',
            expt: '/pvd/persona/index.php/nomcausalimitacion/showReport'
        };
        PVD.Persona.NomCausalimitacion.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCausalimitacion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcausalimitacion/getActiveCausa',
    mapping: [
        {name: 'idcausalimitacion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcausalimitacion';
        this.displayField = 'denominacion';
        this.hiddenName = 'idcausalimitacion';
        PVD.Persona.NomCausalimitacion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_causalimitacion', PVD.Persona.NomCausalimitacion.ViewCombo);

PVD.Persona.NomCausalimitacion.Lang = {
    titleGrid: 'Listado de limitaciones',
    /**
     * Títulos de la ventana de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar causa de limitación',
    titleWindMod: 'Modificar causa de limitación',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar causa de limitación <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar causa de limitación <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar causa de limitación <b>(DEL)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) causa(s) ha(n) sido eliminada(s) satisfactoriamente',
    msgNotDel: 'La causa seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La causa ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La causa que desea adicionar ya existe.',
    msgNotMod: 'La causa ya existe.',
    msgMod: 'La causa ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la causa',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la causa seleccionada?',


    msgAskDelS: '¿Está seguro que quiere eliminar la causa seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las causas seleccionadas?',
    msgDelS: 'La causa  ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las causas han sido eliminadas satisfactoriamente.'

}

