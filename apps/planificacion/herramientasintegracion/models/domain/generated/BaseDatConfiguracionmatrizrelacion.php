<?php

abstract class BaseDatConfiguracionmatrizrelacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_configuracionmatrizrelacion');
        $this->hasColumn('idconfiguracionmatrizrelacion', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_configuracionmatrizrelacion'));
        $this->hasColumn('tipodato', 'boolean', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('totaldatos', 'boolean', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('cantrelaciones', 'boolean', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('porciento', 'boolean', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('promedio', 'boolean', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('nombrerelacion', 'text', null, array ('notnull' => true,'primary' => false));
    }


}

