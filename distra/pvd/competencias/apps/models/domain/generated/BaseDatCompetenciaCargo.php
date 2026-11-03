<?php 
abstract class BaseDatCompetenciaCargo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_competencia.dat_competenciacargo');
        $this->hasColumn(
            'idcompetenciacargo', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_competencia.sec_dat_competenciacargo')
        );
        $this->hasColumn('iddcompetencia', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcargo', 'numeric', null, array('notnull' => true, 'primary' => false));

    }
}