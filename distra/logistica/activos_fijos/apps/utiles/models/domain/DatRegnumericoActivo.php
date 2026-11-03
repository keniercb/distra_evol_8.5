<?php

/**
 *  Jorge Luis Cuellar Mondeja 28/10/2011
 */
class DatRegnumericoActivo extends BaseDatRegnumericoActivo
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();

        $this->hasOne('DatRegnumerico', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
        $this->hasOne('DatPlantilla', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
        $this->hasOne('NomEstatustecnico', array('local' => 'idestatustecnico', 'foreign' => 'idestatustecnico'));
        $this->hasOne('NomColor', array('local' => 'idcolorprim', 'foregin' => 'idcolor'));
        $this->hasOne('NomTipocombustible', array('local' => 'idtipocombustible', 'foregin' => 'idtipocombustible'));
        $this->hasOne('DatEstructuraubicacion', array('local' => 'idubicacion', 'foregin' => 'idestructuraubicacion'));
        $this->hasOne('NomActividadMedio', array('local' => 'idactividad', 'foregin' => 'idactividad'));
        $this->hasOne('NomCategoriasproducto', array('local' => 'idcategoria', 'foregin' => 'idcategoria'));
        $this->hasOne('DatResponsable', array('local' => 'idresponsable', 'foreign' => 'idresponsable'));
        $this->hasMany('DatRecursoRegNumericoActivo', array('local' => 'idregnumerico',
            'foreign' => 'idregnumericoactivo'));

        if(class_exists('DatRegistroespecialidad'))
        $this->hasOne('DatRegistroespecialidad', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));

        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatRegnumericoActivo',
            'properties' => array('local' => 'idregnumerico',
                'foreign' => 'idregnumerico'));

        $numeroRegistro = new DatRegnumerico();

        LogisticaDoctrineHelper::__init()->tryInyectRelactions($numeroRegistro, $array);
    }

}
