<?php
class ConfEstructurahorario extends BaseConfEstructurahorario
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfEstructurahorario')->find($id);
    }

    public function getByIdEstructura($idestructura)
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfEstructurahorario conf')
            ->where("conf.idestructura = '$idestructura'");
        return $query->execute()->toArray();
    }

    public function getEstructurahorario()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfEstructurahorario conf');
        return $query->execute()->toArray();
    }

    public function DelEstructurahorario()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfEstructurahorario x')
            ->execute();
        return true;
    }
}
?>
