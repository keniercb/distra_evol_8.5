<?php
class ConfEstructuratempus extends BaseConfEstructuratempus
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfEstructuratempus')->find($id);
    }

    public function getByIdEstructura($idestructura)
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfEstructuratempus conf')
            ->where("conf.idestructura = '$idestructura'");
        return $query->execute()->toArray();
    }

    public function getEstructuratempus()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfEstructuratempus conf');
        return $query->execute()->toArray();
    }

    public function DelEstructuratempus()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfEstructuratempus x')
            ->execute();
        return true;
    }
}
?>
