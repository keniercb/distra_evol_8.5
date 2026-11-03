<?php
class DatRegistromodelovac extends BaseDatRegistromodelovac
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('DatRegistromodelovac')->find($id);
    }

    public function getRegistrosmodelovac()
    {
        $query = Doctrine_Query::create()
            ->select('vac.idpersona')
            ->from('DatRegistromodelovac vac');
        return $query->execute()->toArray();
    }

    public function deleteRegitroModeloVac($idpersona, $anno)
    {
        try{
            $query = new Doctrine_Query ();
            $result = $query->delete('DatRegistromodelovac ')
                ->where("idpersona = ?",$idpersona)
                ->andWhere("anno = ?", $anno);
            $result->execute();
            return true;
        }
        catch(Exception $e)
        {
            throw $e;
        }
    }

}
?>
