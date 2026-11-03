<?php

class BaseDatObrasProtectorasInmuebleIng extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_obrasing');
        $this->hasColumn('idobrasing', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('iddesignacion', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idventilacion', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idsistemaenergetico', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcaracteristicaconstructiva', 'numeric',19, array('notnull' => false, 'primary' => false));        
        $this->hasColumn('transformador', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('climatizacion', 'numeric',1,array('notnull' => false, 'primary' => false));
        $this->hasColumn('horizontal', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('vertical', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('puerta', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('capital', 'numeric',1, array('notnull' => false, 'primary' => false));

    }
}
