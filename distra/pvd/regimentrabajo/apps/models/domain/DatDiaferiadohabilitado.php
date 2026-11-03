<?php
class DatDiaferiadohabilitado extends BaseDatDiaferiadohabilitado
 { 
   public function setUp() 
    {   parent::setUp(); 
    }

    public function GetDiaFeriadoHabilitado($idpersona,$fecha)
    {
        $query = Doctrine_Query::create()
               ->select('*')
               ->from('DatDiaferiadohabilitado dfa')
               ->where("dfa.fecha = CAST('$fecha' as date) and dfa.idpersona = ".$idpersona);
        return $query->execute()->toArray();
    }

    public function GetDiasFeriadosHabByDateRange($idpersona,$fdesde,$fhasta)
    {
        $query = Doctrine_Query::create()
           ->select('*')
           ->from('DatDiaferiadohabilitado dfa')
            ->where("dfa.fecha >= cast('" . $fdesde . "' as date) and dfa.fecha <= cast('" . $fhasta .
                "' as date) and dfa.idpersona = " . $idpersona . "");
        return $query->execute()->toArray();
    }

    public function delDiasFeriadosHabByIdpersonas($idpersonascargos, $dates)
    {
        try {
            if (count($idpersonascargos) > 0) {
                $idpersonas = $this->getArrayColumn($idpersonascargos, 'idpersona');
                //$idcargos = $this->getArrayColumn($idpersonascargos, 'idcargo');
                $query = new Doctrine_Query ();
                $result = $query->delete()
                    ->from('DatDiaferiadohabilitado x')
                    ->whereIn('x.idpersona', $idpersonas)
                    //->whereIn('x.idcargo', $idcargos)
                    ->andWhereIn('x.fecha', $dates)
                    ->execute();
            }
            return true;
        } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }
    }

    public function getArrayColumn($array, $columna)
    {
        $arr = array_map(function ($element) use ($columna) {
            return (!empty($element[$columna])) ? $element[$columna] : 0;
        }, $array);
        return $arr;
    }

}//fin clase 
?>
