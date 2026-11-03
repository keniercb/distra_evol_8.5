<?php

class DatIndicadorviaadquisicionorganosatisface extends BaseDatIndicadorviaadquisicionorganosatisface
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatIndicadorviaadquisicion', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne(
            'DatIndicadorviaadquisicion', array('local' => 'idviaadquisicion', 'foreign' => 'idviaadquisicion')
        );
        $this->hasOne('NomOrganosatisface', array('local' => 'idorganosatisface', 'foreign' => 'idorganosatisface'));
        $this->hasMany(
            'DatDesgviaadquisorgsat',
            array('local'   => 'idindicadorviaadquisicionorganosatisface',
                  'foreign' => 'idindicadorviaadquisicionorganosatisface')
        );
    }

    /* public function DevolverViasAdd($idindicador)
      {
      $query = new Doctrine_Query();
      $temp = $query->select('m.idviaadquisicion, m.idorganosatisface')
      ->from('DatIndicadorviaadquisicionorganosatisface m')
      ->where('m.idindicador=?', $idindicador)
      ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
      ->execute();

      return $result;
      } */

//    public function EliminarVAdqInd($idind)
//    {
//        $query = new Doctrine_Query();
//        $query->delete('n.idviaadquisicion, n.idindicador, n.idorganosatisface')
//            ->from('DatIndicadorviaadquisicionorganosatisface n')
//            ->where('n.idindicador=?', $idind)
//            ->execute();
//    }
//
//    public function obtenerOrganoSatisfIndicadorAsociado($idindicador)
//    {
//        $query = new Doctrine_Query (); //********AQUI
//        $temp = $query->select('m.idorganosatisface,nv.denominacion')
//            ->from('DatIndicadorviaadquisicionorganosatisface m')
//            ->innerjoin('m.NomOrganosatisface nv')
//            ->where('m.idindicador=?', $idindicador)
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//
////        print_r($query->getSqlQuery($idindicador));die;
//        return $temp;
//    }
//
//    public function obtenerId($idindicador, $organo, $via)
//    {
//
//        $query = new Doctrine_Query (); //********AQUI
//        $temp = $query->select('m.idindicadorviaadquisicionorganosatisface')
//            ->from('DatIndicadorviaadquisicionorganosatisface m')
//            ->where(
//                'm.idindicador=? AND m.idorganosatisface=? AND m.idviaadquisicion=?',
//                array($idindicador, $organo, $via)
//            )
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//
//        return $temp[0]['idindicadorviaadquisicionorganosatisface'];
//    }

}
