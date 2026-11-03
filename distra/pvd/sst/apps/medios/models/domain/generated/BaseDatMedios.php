<?php 
abstract class BaseDatMedios extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sst.dat_medio');
        $this->hasColumn(
            'iddmedio',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sst.sec_datmedio')
        );
        $this->hasColumn('idmedio', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', array('notnull' => true, 'primary' => false));

    }
}