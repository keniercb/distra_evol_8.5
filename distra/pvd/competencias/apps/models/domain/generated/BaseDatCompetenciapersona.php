<?php 
abstract class BaseDatCompetenciapersona extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_competencia.dat_competenciapersona');
        $this->hasColumn(
            'idcompetenciapersona', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_competencia.sec_dat_competenciapersona')
        );
        $this->hasColumn('idcompetencia', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idvalorescala', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}