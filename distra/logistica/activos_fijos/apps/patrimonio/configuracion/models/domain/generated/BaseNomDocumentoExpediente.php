<?php
abstract class BaseNomDocumentoExpediente extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.nom_expedienteactivo');
        $this->hasColumn(
            'idexpediente', 'numeric', null, array('notnull' => true, 'primary' => true,'sequence' => 'mod_logpatrimonio.sec_nomexpedienteactivo')
        );
        $this->hasColumn('idtabla', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('culminacion', 'numeric', null, array('notnull' => false, 'primary' => false));
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

