<?php

abstract class BaseNomCampostipoubicacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.nom_campostipoubicacion');
        $this->hasColumn(
            'idcampotipoubicacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_campostipoubicacion')
        );
        $this->hasColumn('producto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('capacidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('volumen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('um', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipoubicacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('peso', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

