<?php

abstract class BaseDatActividadentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_tipoaprobacionorgdemandante');
        $this->hasColumn(
            'idtipoaprobacionorgdemandante', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_tipoaprobacionorgdemandante')
        );
        $this->hasColumn(
            'idtipoaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idorganodemandante', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
