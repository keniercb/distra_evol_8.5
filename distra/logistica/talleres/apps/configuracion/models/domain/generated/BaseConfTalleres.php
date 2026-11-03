<?php

abstract class BaseConfTalleres extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.conf_talleres');
        $this->hasColumn(
            'idconftalleres', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_conftalleres')
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'centrocostosporactividad', 'numeric', 1, array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'comprobante', 'numeric', 1, array('notnull' => false, 'primary' => false)
        );
       $this->hasColumn(
            'cierrecondiferencia', 'numeric', 1, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'ordenproducto', 'numeric', 1, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cerraroperarios', 'numeric', 1, array('notnull' => false, 'primary' => false)
        );
//        $this->hasColumn(
//            'contratoobligatorio', 'numeric', 1, array('notnull' => false, 'primary' => false)
//        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}