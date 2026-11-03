<?php
class ConfCategoriacausas extends BaseConfCategoriacausas
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfCategoriacausas')->find($id);
    }

    public function existe($idcausa, $idcategoria)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfCategoriacausas m');
        if (!empty($idcategoria)) {
            $queryObj->addWhere("m.idcategoria = $idcategoria");
        }
        if (!empty($idcausa)) {
            $queryObj->addWhere("m.idcausa = $idcausa");
        }
        return $queryObj->fetchArray();
    }

    public function getcategorias()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT *
                FROM 
                  mod_personaext.nom_categoriapersona;";
        $result['datos'] = $conn->fetchAll($query);
        return $result;
    }

    public function getcategoriasbypersona($idpersona)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT cp.idcategoriapersona as idcategoriapersona
                FROM 
                  mod_personaext.dat_categoria cp
                  where cp.idpersona = $idpersona;";
        $result['datos'] = $conn->fetchAll($query);
        return $result;
    }

    public function getcategoriasbyid($idcategoria)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT cp.*
                FROM 
                  mod_personaext.nom_categoriapersona cp
                WHERE cp.idcategoriapersona = $idcategoria;";
        $result['datos'] = $conn->fetchAll($query);
        return $result;
    }

    public function getCausasByCateg($idcategoria)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfCategoriacausas m');
        if (!empty($idcategoria)) {
            $queryObj->addWhere("m.idcategoria = $idcategoria");
        }
        //print_r($queryObj->getSqlQuery());die;
        return $queryObj->fetchArray();
    }

    public function IdsCausasByCateg($idcategoria)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idcausa as idcausa')
            ->from('ConfCategoriacausas m');
        if (!empty($idcategoria)) {
            $queryObj->addWhere("m.idcategoria = $idcategoria");
        }
        //print_r($queryObj->getSqlQuery());die;
        return $queryObj->fetchArray();
    }

    public function DelCategCausa()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfCategoriacausas c')
            ->execute();
        return true;
    }


}
?>
