<?php 
abstract class BaseDatExtensionprep extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.dat_extensionprep');
        $this->hasColumn(
            'idextensionprep',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_extensionprep')
        );
        $this->hasColumn('idreciengraduado', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('tiempo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fextension', 'date', array('notnull' => true, 'primary' => false));
    }
}