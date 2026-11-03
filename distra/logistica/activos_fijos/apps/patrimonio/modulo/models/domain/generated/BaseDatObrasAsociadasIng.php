<?php

class BaseDatObrasAsociadasIng extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_obrasasociadasing');
        $this->hasColumn('idregnumerico', 'numeric',19, array('notnull' => false, 'primary' => true));
        $this->hasColumn('cantidad', 'numeric',19, array('notnull' => false, 'primary' => false));

    }
}
