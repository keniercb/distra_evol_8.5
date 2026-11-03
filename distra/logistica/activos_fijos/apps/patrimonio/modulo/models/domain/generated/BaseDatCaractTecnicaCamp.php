<?php

class BaseDatCaractTecnicaCamp extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_caracteristicainmcamp');
        $this->hasColumn('idcaracteristicainmcamp', 'numeric', 19,array('notnull' => true, 'primary' => true, 
            'sequence' => 'mod_logpatrimonio.sec_dat_caracteristicainmcamp'));         
        $this->hasColumn('idregnumerico', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipocontruccion', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestatustecnico', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('porciento', 'numeric', 3, array('notnull' => false, 'primary' => false));        
    }
}
