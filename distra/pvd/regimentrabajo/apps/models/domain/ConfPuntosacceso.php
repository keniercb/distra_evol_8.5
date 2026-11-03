<?php
class ConfPuntosacceso extends BaseConfPuntosacceso
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfPuntosacceso')->find($id);
    }

    public function getPuntosAcceso()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfPuntosacceso conf');
        return $query->execute()->toArray();
    }

    public function EliminarPuntosAcceso()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfPuntosacceso x')
            ->execute();
        return true;
    }
}
?>
