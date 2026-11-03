<?php
class ConfHabilitarsesiones extends BaseConfHabilitarsesiones
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabilitarsesiones')->find($id);
    }

    public function getHabilitarsesiones()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabilitarsesiones conf');
        return $query->execute()->toArray();
    }	
}
?>
