<?php

abstract class BaseDatNivelactividadporfechareal extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_spouam.dat_nivelactividadporfechareal');
        $this->hasColumn(
            'fechareal', 'timestamp without time zone', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fin', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'idactividadentidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idnivelactividadporfechareal', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_nivelactividadporfechareal')
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nivelactividadreal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatActividadentidad', array('local'   => 'idactividadentidad',
                                         'foreign' => 'idactividadentidad')
        );
        $this->hasOne(
            'SegUsuario',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
    }

}


