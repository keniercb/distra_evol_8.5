<?php 
abstract class BaseDatAccionparticipante extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_accionparticipante');
        $this->hasColumn(
            'idaccionparticipante',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_accionparticipante')
        );
        $this->hasColumn('idaccion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('terminado', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('resultado', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', array('notnull' => true, 'primary' => false));
    }
}