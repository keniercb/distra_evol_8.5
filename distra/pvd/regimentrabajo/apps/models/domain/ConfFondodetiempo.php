<?php
class ConfFondodetiempo extends BaseConfFondodetiempo
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfFondodetiempo')->find($id);
    }

    public function existeFT($idcategoria)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfFondodetiempo m');
        if (!empty($idcategoria)) {
            $queryObj->addWhere("m.idcategoria = $idcategoria");
        }
        return $queryObj->fetchArray();
    }

    public function getConfFondodetiempo()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfFondodetiempo m');
        return $queryObj->fetchArray();
    }

}
?>
