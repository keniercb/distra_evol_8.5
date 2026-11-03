<?php

abstract class ConfModelMetaDatos extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planificacion.conf_modelosmetadatos');
        $this->hasColumn(
            'idmodelosmetadatos', 'numeric', null,
            array('notnull' => false, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_modelosmetadatos_seq')
        );
        $this->hasColumn(
            'esquema', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tabla', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
    }

}

