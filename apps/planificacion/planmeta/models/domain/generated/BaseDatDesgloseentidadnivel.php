<?php

abstract class BaseDatDesgloseentidadnivel extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desgloseentidadnivel');
        $this->hasColumn(
            'iddesgloseentidadnivel', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_desgloseentidadnivel')
        );
        $this->hasColumn(
            'idactividadentidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nivelactivdesglosado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
         $this->hasColumn(
                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fecha', 'timestamp', null, array('default' => 'now()', 'notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


