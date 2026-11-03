<?php
abstract class BaseDatInterrupto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.dat_interrupto');
        $this->hasColumn(
            'idinterrupto',
            'numeric',
            null,
            array('notnull' => true,'primary' => true, 'sequence' => 'mod_fuerzatrabajo.sec_interrupto')
        );
        $this->hasColumn('idsituacionlaboralp', 'numeric', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('idinterrupcion', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('horas', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('reubicado', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('idsituacionint', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('idcausanoreubicado', 'numeric', null, array('notnull' => false,'primary' => false));
    }
}