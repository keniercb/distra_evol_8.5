<?php
abstract class BaseDatInterrupcion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.dat_interrupcion');
        $this->hasColumn(
            'idinterrupcion',
            'numeric',
            null,
            array('notnull' => true,'primary' => true, 'sequence' => 'mod_fuerzatrabajo.sec_interrupcion')
        );
        $this->hasColumn('observacion', 'character varying', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('idmotivointerrupcion', 'numeric', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true,'primary' => true));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('horas', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}