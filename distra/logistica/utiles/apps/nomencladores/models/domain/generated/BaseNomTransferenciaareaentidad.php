<?php

abstract class BaseNomTransferenciaareaentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_tipotransferenciaareaentidad');
        $this->hasColumn(
            'idtipotransferenciaentidad', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_nomtipotransferenciaareaentidad')
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
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

//fin clase 
