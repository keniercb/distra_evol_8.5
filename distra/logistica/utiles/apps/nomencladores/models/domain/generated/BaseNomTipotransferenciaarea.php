<?php

abstract class BaseNomTipotransferenciaarea extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tipotransferenciaarea');
        $this->hasColumn(
            'idtipotransferenciaarea', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_nomtransferenciaarea')
        );
        $this->hasColumn(
            'idnomtipoarea', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipotransferencia', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
