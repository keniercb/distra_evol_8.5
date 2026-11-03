<?php

abstract class BaseDatCampannaProducto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmmarketing.dat_campannaproducto');
        $this->hasColumn('idcampannaproducto', 'numeric', 19,array('notnull'  => true, 'primary' => true,'sequence' => 'mod_crmmarketing.sec_campannaproducto'));
        $this->hasColumn('idproducto', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcampanna', 'numeric', 19,array('notnull' => true, 'primary' => false));
        $this->hasColumn('precio', 'numeric',array('notnull' => true, 'primary' => false));
    }

}