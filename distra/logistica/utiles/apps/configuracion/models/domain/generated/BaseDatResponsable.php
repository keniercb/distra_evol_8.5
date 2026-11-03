<?php

/**
 * Created by PhpStorm.
 * User: Yoendy
 * Date: 6/08/14
 * Time: 15:19
 */
abstract class BaseDatResponsable extends Doctrine_Record
{


    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_responsable');
        $this->hasColumn('idresponsable', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'sec_datresponsable'));
        $this->hasColumn('tipo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

} 
