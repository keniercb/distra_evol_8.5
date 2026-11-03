
<?php
abstract class BaseHisCierresesion extends HisTraza
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_traza.his_cierresesion');
        $this->hasColumn('idtraza', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('ippc', 'character varying', 50, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
