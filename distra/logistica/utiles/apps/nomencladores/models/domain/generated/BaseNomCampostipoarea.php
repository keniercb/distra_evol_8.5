<?php

abstract class BaseNomCampostipoarea extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('nom_campostipoarea');
        $this->hasColumn(
            'idnomcamposarea', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'nom_campostipoarea')
        );
        $this->hasColumn(
            'capacidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnomtipoarea', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'producto', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'um', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase

