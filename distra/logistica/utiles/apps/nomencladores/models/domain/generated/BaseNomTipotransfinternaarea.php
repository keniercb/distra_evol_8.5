<?php

abstract class BaseNomTipotransfinternaarea extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.nom_tipotransfinternaarea');
        $this->hasColumn(
            'idtipotransfinternaarea', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_logfarmacia.sec_nomtipotransfinternaarea')
        );
        $this->hasColumn('iddeposito', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipotransfinterna', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
