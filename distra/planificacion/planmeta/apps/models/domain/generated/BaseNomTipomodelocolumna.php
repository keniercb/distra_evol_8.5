<?php

abstract class BaseNomTipomodelocolumna extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tipomodelocolumna');
        $this->hasColumn(
            'idtipomodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcolumna', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcampo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipomodelocolumna', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_tipomodelocolumna')
        );
        $this->hasColumn(
            'idtipocolumna', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
             $this->hasColumn(
            'idtiponomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
