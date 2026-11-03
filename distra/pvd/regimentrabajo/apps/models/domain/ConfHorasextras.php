<?php
class ConfHorasextras extends BaseConfHorasextras
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHorasextras')->find($id);
    }

    public function getLimites()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHorasextras conf')
            ->orderBy('conf.denominacion');
        return $query->execute()->toArray();
    }	
}
?>
