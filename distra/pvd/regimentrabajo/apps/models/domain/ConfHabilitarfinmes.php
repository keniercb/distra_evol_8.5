<?php
class ConfHabilitarfinmes extends BaseConfHabilitarfinmes
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabilitarfinmes')->find($id);
    }

    public function getHabilitarfinmes()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabilitarfinmes conf');
        return $query->execute()->toArray();
    }	
}
?>
