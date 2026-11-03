<?php
class ConfEstructurareloj extends BaseConfEstructurareloj
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfEstructurareloj')->find($id);
    }

    public function getByIdEstructura($idestructura)
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfEstructurareloj conf')
            ->where("conf.idestructura = '$idestructura'");
        return $query->execute()->toArray();
    }

    public function getEstructurareloj()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfEstructurareloj conf');
        return $query->execute()->toArray();
    }

    public function DelEstructurareloj()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfEstructurareloj x')
            ->execute();
        return true;
    }
}
?>
