<?php

abstract class BaseDatEstatustecnicoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_estatustecnicoentidad');
        $this->hasColumn(
            'idestatustecnicoentidad', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false,
            'unsigned' => false, 'primary' => true,
            'sequence' => 'sec_datestatustecnicoentidad')
        );
        $this->hasColumn(
            'idestatustecnico', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
