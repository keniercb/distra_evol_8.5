<?php

class DatIndicadorviaadquisicion extends BaseDatIndicadorviaadquisicion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatIndicadorviaadquisicionorganosatisface', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasMany(
            'DatIndicadorviaadquisicionorganosatisface',
            array('local' => 'idviaadquisicion', 'foreign' => 'idviaadquisicion')
        );
        $this->hasOne('NomViaadquisicion', array('local' => 'idviaadquisicion', 'foreign' => 'idviaadquisicion'));
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
    }

//    public function ObtenerViasAdquis($idindicador)
//    {
//        $query = new Doctrine_Query (); //********AQUI
//
//        $temp = $query->select('m.idviaadquisicion')
//            ->from('DatIndicadorviaadquisicion m')
//            ->where('m.idindicador=?', $idindicador)
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        //print_r($temp);die;
//        //se crea un arreglo con las 3 posibles vias de adquisicion del indicador en false
//        // $result = array('5' => false, '6' => false, '7' => false); //array('5' => false, '6' => false, 
//        '7' => false);
//
//        foreach ($temp as $value) {
//            if ($value['idviaadquisicion'] == '6') { //OACE
//                $result['6'] = true;
//            }
//            if ($value['idviaadquisicion'] == '5') { //SI
//                $result['5'] = true;
//            }
//            if ($value['idviaadquisicion'] == '7') { //ID
//                $result['7'] = true;
//            }
//        }
//        return $result;
//    }
//
//    public function EliminarVAdqInd($idind)
//    {
//        $query = new Doctrine_Query();
//        $query->delete('n.idviaadquisicion, n.idindicador')
//            ->from('DatIndicadorviaadquisicion n')
//            ->where('n.idindicador=?', $idind)
//            ->execute();
//    }
//
//    public function ObtenerViasAdquisIndicadorAsociado($idindicador)
//    {
//        $query = new Doctrine_Query (); //********AQUI
//        $temp = $query->select('m.idviaadquisicion,nv.denominacion')
//            ->from('DatIndicadorviaadquisicion m')
//            ->innerjoin('m.NomViaadquisicion nv')
//            ->where('m.idindicador=?', $idindicador)
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $temp;
//    }
//
//    public function listarTodasLasVias()
//    {
//        $query = new Doctrine_Query ();
//        $temp = $query->select('via.idviaadquisicion,via.denominacion')
//            ->from('NomViaadquisicion via')
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $temp;
//    }

}
