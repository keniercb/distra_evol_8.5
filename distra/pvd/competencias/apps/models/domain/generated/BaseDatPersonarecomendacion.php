<?php 
abstract class BaseDatPersonarecomendacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_idoneidad.dat_personarecomendacion');
        $this->hasColumn(
            'idpersonarecomendacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_idoneidad.sec_personarecomendacion')
        );
        $this->hasColumn('idpersonaproceso', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('recomendacion', 'character varying', null, array('notnull' => true, 'primary' => false));
    }
}