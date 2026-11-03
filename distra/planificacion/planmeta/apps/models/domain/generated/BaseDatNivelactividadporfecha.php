<?php

abstract class BaseDatNivelactividadporfecha extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_nivelactividadporfecha');
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idactividadentidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idnivelactividadporfecha', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_nivelactividadporfecha')
        );
        $this->hasColumn(
            'nivelactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatNivelactividadporfechareal',
            array('local'   => 'idnivelactividadporfecha',
                  'foreign' => 'idnivelactividadporfecha')
        );
        $this->hasOne(
            'DatActividadentidad', array('local'   => 'idactividadentidad',
                                         'foreign' => 'idactividadentidad')
        );
    }

}


