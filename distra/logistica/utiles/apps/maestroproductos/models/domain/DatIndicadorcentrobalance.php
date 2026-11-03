<?php

/**
 * DatDatIndicadorcentrobalance
 *
 *
 * @ author Drisis Silvia D?az Rodriguez
 * @ package Planificaci�n
 * @ subpackage Planificaci�n Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class DatIndicadorcentrobalance extends BaseDatIndicadorcentrobalance
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne(
            'DatEntidaddatosnomenclador',
            array('local' => 'identidaddatosnomenclador', 'foreign' => 'identidaddatosnomenclador')
        );
    }

    //SE LISTAN TODOS LOS INDICADORES APROBADOS POR EL CENTRO DE BALANCE PASO POR PARAMETRO
    //ES DECIR POR $identdatnom
//    public function listarIndAprobPorCB($identdatnom)
//    {
//        $query = new Doctrine_Query();
//        $indicent = $query->select('dicb.idindicador, dicb.idindicadorcentrobalance, dicb.identidaddatosnomenclador')
//            ->from('DatIndicadorcentrobalance dicb, dicb.NomIndicador d')
//            ->where('dicb.identidaddatosnomenclador =?', $identdatnom)
//            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
//            ->execute();
//        return $indicent;
//    }
//
//    public function ListarIndEntDatNom($identdatnom)
//    {
//        $query = new Doctrine_Query();
//        $indicent = $query->select('dicb.idindicadorcentrobalance, dicb.idindicador, dicb.identidaddatosnomenclador')
//            ->from('DatIndicadorcentrobalance dicb')
//            ->where('dicb.identidaddatosnomenclador =?', $identdatnom)
//            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
//            ->execute();
//        return $indicent;
//    }
//
//    public function buscarInd($idindicador)
//    {
//        $query = new Doctrine_Query();
//        $indicent = $query->from('DatIndicadorcentrobalance dicb')
//            ->where('dicb.idindicador =?', $idindicador)
//            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
//            ->execute();
//        return $indicent;
//    }

//    public function modificarCB($idindicador, $idcentrobalance) {
//        $query = new Doctrine_Query();
//        $cb = explode(',', $idcentrobalance);
//        $data = $query->from('DatIndicadorcentrobalance dicb')
//                ->where('dicb.idindicador =?', $idindicador)
//                ->whereIn('dicb.identidaddatosnomenclador', $cb)
//                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
//                ->execute();
//        $existe = false;
//        $idcb = null;
//        foreach ($data as $value) {
//            foreach ($cb as $c){
//                $idcb = $c;
//                if ($value['identidaddatosnomenclador]'] == $c) {
//                    $existe = true;
//                    break;
//                }
//            }
//            if (!$existe) {
//                $centrobal = new DatIndicadorcentrobalance();
//                $centrobal->idindicador = $idindicador;
//                $centrobal->identidaddatosnomenclador = $idcb;
//                $centrobal->save();
//                $existe = true;
//            }
//        }
//        /*Terminar el insertar */
//        
//        $conn = Doctrine_Manager::connection();
//        $query = "DELETE 
//                 FROM mod_planificacion.dat_indicadorcentrobalance
//                 WHERE idindicador = ? 
//                 AND identidaddatosnomenclador NOT IN ($idcentrobalance)";
//        $conn->execute($query, array($idindicador));
//        /* Termina el eliminar */
//    }

//    public function buscarIdentiCB($idindicador)
//    {
//        $query = new Doctrine_Query();
//        $indicent = $query->select('dicb.identidaddatosnomenclador, dedn.identidad')
//            ->from('DatIndicadorcentrobalance dicb,dicb.DatEntidaddatosnomenclador dedn')
//            ->where(
//                'dicb.identidaddatosnomenclador = dedn.identidaddatosnomenclador AND dicb.idindicador =?',
//                 $idindicador
//            )
//            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
//            ->execute();
//        return $indicent;
//    }
//
//    public function buscarVariosIdentiCB($array_idindicadores)
//    {
//        $query = new Doctrine_Query();
//        $arrayIndicent = $query->select('dicb.idindicador,dicb.identidaddatosnomenclador, dedn.identidad')
//            ->from('DatIndicadorcentrobalance dicb,dicb.DatEntidaddatosnomenclador dedn')
//            ->addWhere('dicb.identidaddatosnomenclador = dedn.identidaddatosnomenclador ')
//            ->whereIn('dicb.idindicador', $array_idindicadores)
//            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
//            ->execute();
//        return $arrayIndicent;
//    }
//
//    public function EliminarCBInd($idind)
//    {
//        $query = new Doctrine_Query();
//        $query->delete('DatIndicadorcentrobalance')
//            ->from('DatIndicadorcentrobalance')
//            ->where('idindicador=?', $idind)
//            ->execute();
//    }
//
//    public function ExisteIndAsociadoCB($idcb)
//    {
//        $conn = Doctrine_Manager::connection();
//        $query = " SELECT d.idindicadorcentrobalance AS d__idindicadorcentrobalance 
//                   FROM mod_planificacion.dat_indicadorcentrobalance d 
//                   WHERE (d.identidaddatosnomenclador = ?)";
//        $var = $conn->execute($query, array($idcb));
//        $resp = $var->fetchAll(PDO::FETCH_ASSOC);
//        if ($resp[0]['d__idindicadorcentrobalance'])
//            return true;
//        else
//            return false;
//    }

}