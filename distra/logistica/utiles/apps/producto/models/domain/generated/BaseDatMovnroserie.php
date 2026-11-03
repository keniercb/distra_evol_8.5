<?php

abstract class BaseDatMovnroserie extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_movnroserie');
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnroserie', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idmovnumeroserie', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_movregistronumerico')
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 


