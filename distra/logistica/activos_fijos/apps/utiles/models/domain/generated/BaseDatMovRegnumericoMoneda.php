<?php

/**
 *    Jorge Luis Cuellar Mondeja 28/10/2011
 */
class BaseDatMovRegnumericoMoneda extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_movregnumericomoneda');
        $this->hasColumn('idmovregnumericomoneda', 'numeric', null, array('notnull' => false, 'primary' => true,
            'sequence' => 'mod_logactivofijotangible.sec_movregnumericomoneda'));
        $this->hasColumn('idmovregnumerico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmoneda', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('depreciacionacumulada', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valorcontable', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valoradquisicion', 'numeric', null, array('notnull' => false, 'primary' => false));

    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
