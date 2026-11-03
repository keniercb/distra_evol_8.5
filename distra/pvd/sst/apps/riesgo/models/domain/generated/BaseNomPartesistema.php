<?php 
abstract class BaseNomPartesistema extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.nom_partesistema');
        $this->hasColumn(
            'idpartesistema',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_partesistemas')
        );
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idsistema', 'numeric', array('notnull' => true, 'primary' => false));
    }
}