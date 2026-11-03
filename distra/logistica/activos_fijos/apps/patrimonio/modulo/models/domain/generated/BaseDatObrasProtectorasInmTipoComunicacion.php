<?php

class BaseDatObrasProtectorasInmTipoComunicacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_tipocomunicacioning');        
        $this->hasColumn( 'idtipocomunicacioninm', 'numeric', null,
            array('type'     => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true)
        );

        $this->hasColumn('idobrasing', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn( 'idtipocomunicacion', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

    }
}
