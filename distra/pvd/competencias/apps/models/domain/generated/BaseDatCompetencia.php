<?php 
abstract class BaseDatCompetencia extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_competencia.dat_competencia');
        $this->hasColumn(
            'iddcompetencia', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_competencia.sec_dat_competencia')
        );
        $this->hasColumn('idcompetencia', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idclasifcompetencia', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idvalorescala', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
    }
}