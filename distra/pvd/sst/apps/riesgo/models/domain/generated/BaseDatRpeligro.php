<?php 
abstract class BaseDatRpeligro extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.dat_rpeligro');
        $this->hasColumn(
            'idrpeligro',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_rpeligro')
        );
        $this->hasColumn('idriesgo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpeligro', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('observaciones', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}