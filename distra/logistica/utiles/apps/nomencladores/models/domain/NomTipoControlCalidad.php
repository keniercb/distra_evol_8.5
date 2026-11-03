<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 8:57
 */
class NomTipoControlCalidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.nom_tipocontrolcalidad');
        $this->hasColumn(
            'idtipocontrolcalidad', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                'sequence' => 'mod_logproduccion.sec_tipocontrolcalidad')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idunidadmedida', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatTipoControlCalidadEntidad', array('local'   => 'idtipocontrolcalidad',
                                          'foreign' => 'idtipocontrolcalidad')
        );

    }
}