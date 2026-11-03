<?php
abstract class BaseNomCausaaccidente extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstaccidente.nom_causaaccidente');
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idcausaaccidente', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_causaaccidente')
        );
        $this->hasColumn(
            'idcausaaccidente',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstaccidente.sec_causaaccidente')
        );
    }
}