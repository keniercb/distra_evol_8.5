<?php 
abstract class BaseNomMedios extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sst.nom_medio');
        $this->hasColumn(
            'idmedio',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sst.sec_nommedio')
        );
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', array('notnull' => true, 'primary' => false));
    }
}