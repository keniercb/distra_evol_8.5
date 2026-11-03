<?php

class BaseDatPosicionFuegoIng extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_posicionfuegoing');
        $this->hasColumn('idposicionfuegoobras', 'numeric',19, array('notnull' => false, 'primary' => true ,'sequence' => 'sec_datposicionfuegoing'));
        $this->hasColumn('idregnumericoactivo', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipopuntofuego', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idposicionfuego', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric',19, array('notnull' => false, 'primary' => false));

    }
}
