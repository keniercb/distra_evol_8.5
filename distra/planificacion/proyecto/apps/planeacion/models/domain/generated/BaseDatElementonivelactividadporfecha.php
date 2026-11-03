<?php

abstract class BaseDatElementonivelactividadporfecha extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_elementonivelactividadporfecha');
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
            'idelementonivelactividadporfecha', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planifintegracion.sec_elementonivelactividadporfecha')
        );
        $this->hasColumn(
            'nivelactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();       
        $this->hasOne(
            'DatElementonivelactividad', array('local'   => 'idactividadentidad',
                                         'foreign' => 'idactividadentidad')
        );
    }

}


