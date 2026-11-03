<?php
class ConfHabusuarios extends BaseConfUsuarios
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabusuarios')->find($id);
    }

    public function getAllUsuarios()
    {
        $sql = "SELECT idusuario, nombreusuario as usuario
                    FROM 
                      mod_seguridad.seg_usuario 
                      where activo = true;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getUsuarios()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabusuarios conf');
        return $query->execute()->toArray();
    }

    public function existe($idusuario)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('ConfHabusuarios c');
        if (!empty($idusuario)) {
            $queryObj->addWhere("c.idusuario = $idusuario");
        }
        return $queryObj->fetchArray();
    }

    public function Delusuario()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfHabusuarios c')
            ->execute();
        return true;
    }


}
?>
