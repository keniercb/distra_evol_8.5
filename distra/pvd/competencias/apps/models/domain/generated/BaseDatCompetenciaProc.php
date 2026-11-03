<?php 
abstract class BaseDatCompetenciaProc extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_competencia.dat_competenciaproc');
        $this->hasColumn(
            'idcompetenciaproc', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_competencia.sec_dat_comptenciaproc')
        );
        $this->hasColumn('iddcompetencia', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproceso', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}