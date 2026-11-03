<?php
class ConfEstructuras extends BaseConfEstructuras
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfEstructuras')->find($id);
    }

    public function getByIdEst($idestructura)
    {
        $queryObj = Doctrine_Query::create()
            ->from('ConfEstructuras m')
            ->where("m.idestructura = '$idestructura'");
        return $queryObj->fetchOne();
    }

    public function getConfigEstructuras()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idestructura, m.idpadre')
            ->from('ConfEstructuras m');
        return $queryObj->fetchArray();
    }

    public function getEstructuras()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfEstructuras conf');
        return $query->execute()->toArray();
    }

    public function existeEntidadByPadre($idpadre, $idestructura)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idestructura')
            ->from('ConfEstructuras m')
            ->where("m.idestructura = $idestructura AND m.idpadre = $idpadre");
        return $queryObj->fetchArray();
    }

    public function existe($idestructura, $idpadre)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfEstructuras m');
        if (!empty($idestructura)) {
            $queryObj->addWhere("m.idestructura = $idestructura");
        }
        if (!empty($idpadre)) {
            $queryObj->addWhere("m.idpadre = $idpadre");
        }
        return $queryObj->fetchArray();
    }

    public function idsEstructByPadre($idpadre)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idestructura')
            ->from('ConfEstructuras m')
            ->where("m.idpadre = $idpadre");
        return $queryObj->fetchArray();
    }
}
?>
