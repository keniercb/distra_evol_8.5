<?php
class DatExportarModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarEspecialidades()
    {
        $nomenclador = new ZendExt_Nomencladores_ADT ();
        $especialidades = $nomenclador->selectParam('nom_especialidad', array('idespecialidad', 'denespecialidad'));
        return $especialidades;
    }
}
