<?php 
abstract class BaseDatCertificacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_competencia.dat_certificacion');
        $this->hasColumn(
            'idcertificacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_competencia.sec_certificacion')
        );
        $this->hasColumn('idcompetenciapersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersonaevaluacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idaccionparticipante', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
    }
}