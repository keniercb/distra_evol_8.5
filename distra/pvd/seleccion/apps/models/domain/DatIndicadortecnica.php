<?php
class DatIndicadortecnica extends BaseDatIndicadortecnica
{
	public function setUp()
    {
        parent :: setUp();
    }	
		
	public function getById($idindicadortecnica)
    {
        return Doctrine::getTable('DatIndicadortecnica')->find($idindicadortecnica);
    }	
	
	public function getIndicadorSeleccion($idresultadotecnica, $idindicadorplanilla)
    {
        $query = new Doctrine_Query (); 
        $result = $query->from('DatIndicadortecnica it')
						->where("it.idresultadotecnica = '$idresultadotecnica' and it.idindicadorplanilla = '$idindicadorplanilla'")
						->execute(); 
        $obj = $result->toArray(); 
		return $obj[0];
    }
	
	public function getDatosIndicadorById($idindicadortecnica)
    {
        $query = new Doctrine_Query (); 
        $result = $query->from('DatIndicadortecnica it')
						->where("it.idindicadortecnica = '$idindicadortecnica'")
						->execute(); 
        $obj = $result->toArray(); 
		return $obj[0];
    }

    public function getIndicadorSeleccionByIdresultadotecnica($idresultadotecnica)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatIndicadortecnica it')
            ->where("it.idresultadotecnica = '$idresultadotecnica'")
            ->execute();
        return $result->toArray();
    }

    public function updateValorIndicador($idindicadorplanilla, $resultado, $idresultadotecnica)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('DatIndicadortecnica')
                ->where("idindicadorplanilla = '$idindicadorplanilla' and idresultadotecnica = '$idresultadotecnica'");
            $query->set('resultado', "'$resultado'");
            $query->execute();
            return true;
        } catch (Exception $exc) {
            return false;
        }
    }
}
