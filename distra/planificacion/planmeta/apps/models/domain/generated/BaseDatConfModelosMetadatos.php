<?php

abstract class BaseDatConfModelosMetadatos extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planificacion.conf_modelosmetadatos');
        $this->hasColumn(
            'idmodelosmetadatos', 'numeric', null,
            array('notnull' => false, 'primary' => true,
                  'sequence' => 'mod_planificacion.conf_modelosmetadatos')
        );
        $this->hasColumn(
            'esquema', 'character varying', 30,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tabla', 'character varying', 30,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 50,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 50,
            array('notnull' => true, 'primary' => false)
        );
    }

}

