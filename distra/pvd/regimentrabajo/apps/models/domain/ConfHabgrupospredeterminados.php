<?php
class ConfHabgrupospredeterminados extends BaseConfGrupospredeterminados
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabgrupospredeterminados')->find($id);
    }

    public function getHabilitargrupospredeterminados()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabgrupospredeterminados conf');
        return $query->execute()->toArray();
    }

    public function existe($idgrupo)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('ConfHabgrupospredeterminados c');
        if (!empty($idgrupo)) {
            $queryObj->addWhere("c.idgrupodescanso = $idgrupo");
        }
        return $queryObj->fetchArray();
    }

    public function Delgrupospredeterminados()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfHabgrupospredeterminados c')
            ->execute();
        return true;
    }


}
?>
