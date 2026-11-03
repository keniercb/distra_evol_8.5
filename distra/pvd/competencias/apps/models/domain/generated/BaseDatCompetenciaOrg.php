<?php 
abstract class BaseDatCompetenciaOrg extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_competencia.dat_competenciaorg');
        $this->hasColumn(
            'idcompetenciaorg', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_competencia.sec_dat_competenciaorg')
        );
        $this->hasColumn('iddcompetencia', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}