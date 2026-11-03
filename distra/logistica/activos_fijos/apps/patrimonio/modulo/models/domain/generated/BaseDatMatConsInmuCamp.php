<?php

class BaseDatMatConsInmuCamp extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_materialesconstruccioncamp');
        $this->hasColumn(
            'idmaterialesconstcamp', 'numeric', 19, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logpatrimonio.sec_datmaterialesconstruccioncamp')
        );
        $this->hasColumn('idcaracteristicainmcamp', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmaterialconstruccion', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

}
