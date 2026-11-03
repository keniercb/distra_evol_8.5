<?php

abstract class  BaseTempAprobacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('temp_aprobacion');
        $this->hasColumn(
            'idaprobacion', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_flujotrabajo.sec_tempaprobacion')
        );
        $this->hasColumn(
            'iddocumento', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtransicion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}


