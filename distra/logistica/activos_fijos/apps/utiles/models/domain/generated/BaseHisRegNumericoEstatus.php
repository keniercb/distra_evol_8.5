<?php

/**
 *    Jorge Luis Cuellar Mondeja 06/11/2015
 */
abstract class BaseHisRegNumericoEstatus extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.his_regnumericoestatus');
        $this->hasColumn(
            'idregnumericoestatus', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logactivofijotangible.sec_regnumericoestatus')
        );
        $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestatustecnico', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantdias', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('deprecia', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
