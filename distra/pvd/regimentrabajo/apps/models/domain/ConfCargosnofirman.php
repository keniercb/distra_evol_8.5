<?php
class ConfCargosnofirman extends BaseConfCargosnofirman
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfCargosnofirman')->find($id);
    }

    public function getByIdCargo($idcargo)
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfCargosnofirman conf')
            ->where("conf.idcargo = '$idcargo'");
        return $query->execute()->toArray();
    }

    public function getCargosnofirman()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfCargosnofirman conf');
        return $query->execute()->toArray();
    }

    public function DelCargosnofirman()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfCargosnofirman x')
            ->execute();
        return true;
    }
}
?>
