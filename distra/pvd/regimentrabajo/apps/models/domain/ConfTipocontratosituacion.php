<?php

class ConfTipocontratosituacion extends BaseConfTipocontratosituacion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($id)
    {
        return Doctrine::getTable('ConfTipocontratosituacion')->find($id);
    }

    public function gettipocontratosituacion()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfTipocontratosituacion m')
            ->orderby('m.idconcepto');
        return $queryObj->fetchArray();
    }

    public function gettipocontratosituacionbyconcepto($idconcepto)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfTipocontratosituacion m')
            ->where('m.idconcepto = ?', $idconcepto);
        return $queryObj->fetchArray();
    }

    public function gettipocontrato()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT *
                  FROM 
                  mod_fuerzatrabajo.nom_tipocontrato;";
        $result = $conn->fetchAll($query);
        return $result;
    }

    public function getsituacion()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT *
                  FROM 
                  mod_persona.nom_situacion;";
        $result = $conn->fetchAll($query);
        return $result;
    }

    public function Delete($idconcepto)
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfTipocontratosituacion c')
            ->where('c.idconcepto = ?', $idconcepto)
            ->execute();
        return true;
    }


}

?>
