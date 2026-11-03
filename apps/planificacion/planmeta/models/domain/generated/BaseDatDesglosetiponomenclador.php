<?php

abstract class BaseDatDesglosetiponomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desglosetiponomenclador');
        $this->hasColumn(
            'iddesglosetiponomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_desglosetiponomenclador')
        );
        $this->hasColumn(
            'idtiponomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddesglose', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'orden', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
