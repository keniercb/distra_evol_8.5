<?php
abstract class BaseNomTipoObra extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.nom_tipoobra');
        $this->hasColumn(
            'idtipoobra', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logpatrimonio.sec_tipoobra')
        );
        $this->hasColumn('denominacion', 'character varying', 60, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase
?>

