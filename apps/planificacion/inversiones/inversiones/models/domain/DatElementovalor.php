<?php

class DatElementovalor extends BaseDatElementovalor {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatEtapaElementoinversion', array('local' => 'idelemento', 'foreign' => 'idetapaelementoinversion'));
    }

    public function getByid($idelementovalor) {
        return Doctrine::getTable('DatElementovalor')->find($idelementovalor)->toArray();
    }

    public function eliminarValor($parametros, $idInver, $idUser) {
        $query = new Doctrine_Query();
        $query->delete()
                ->from('DatElementovalor ')
                ->whereIn('idelementovalor', $parametros['idelementovalor'])
                ->execute();
        $des = "Se eliminó el elemento_valor: {$parametros['idelementovalor'][0]}";
//        HisTrazasinversionesModel::seveTrazasInversiones('Inversión_Elemento_Valor', 'eliminar', 'dat_elementovalor', 
//                $idInver, $des, $idUser);
        return 1;
    }

    public function eliminarValorPorIdEInv($idetapaelementoinversion) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatElementovalor e')
                        ->where('e.idelemento = ? ', array($idetapaelementoinversion))
                        ->execute();
    }

    public function adicionarElem($params, $arre, $idUser) {
        if ($arre['idelementovalor'] != '') {
            $acc = 'modificar';
            $des = "Se modificó el valor del elemento: {$arre['idelementovalor']} a: {$arre['valor']} de la monedaEntidad {$arre['idmoneda']}";
            $conn = Doctrine_Manager::connection();

            if($arre['valor'] != 0){
                $query = "UPDATE mod_planifinversiones.dat_elementovalor 
                             SET idmonedaentidad = '" . $arre['idmoneda'] . "',
                                 valor = '" . $arre['valor'] . "'


                              WHERE  idelementovalor = " . $arre['idelementovalor'] . "
                                ";
            }else{
                $query = "DELETE FROM 
                        mod_planifinversiones.dat_elementovalor 
                      WHERE 
                        idelementovalor = {$arre['idelementovalor']}";
            }
            $total = $conn->execute($query);
        } else {
            $acc = 'adicionar';
            $des = "Se adicionó valor al elemento: {$params['idelemento']} en la monedaEntidad: {$arre['idmoneda']} con valor: {$arre['valor']}";
            $elemento = new DatElementovalor();
            $elemento->idelemento = $params['idelemento'];
            $elemento->idmonedaentidad = $arre['idmoneda'];
            $elemento->valor = $arre['valor'];
            $elemento->save();
        }
        //Insertar Traza
//        HisTrazasinversionesModel::seveTrazasInversiones('Inversión_Elemento_Valor', $acc, 'dat_elementovalor', 
//                $params['idinversion'], $des, $idUser);
        return 1;
    }

//    public function listarValorPorElem($params) {
//        $query = new Doctrine_Query ();
//        return $query
//            ->from('DatElementovalor e')
//            ->where('e.idelemento = ? ', array($params['idelemento']))
//            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
//            ->execute();
//    }

    public function listarValorPorElem($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    ev.valor,
                    ev.idmonedaentidad,
                    ev.idelementovalor
                FROM
                    mod_planifinversiones.dat_elementovalor ev
                    INNER JOIN mod_planifinversiones.dat_etapaelementoinversion eei ON (ev.idelemento = eei.idetapaelementoinversion)
                WHERE
                    eei.idetapaelementoinversion  =  " . $params['idelemento'];
// print_r($sql);die;
        $datosListar = $conn->execute($sql);
//pre_r($datosListar);die;

        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

//    public function listarValorPorElem($params) {
//        $cadenaSELECT = " SELECT COALESCE(SUM(elv.valor),0) ";
//        $cadenaJOIN = " FROM mod_planifinversiones.dat_etapainversion ei
//                        INNER JOIN mod_planifinversiones.dat_etapaelementoinversion eeli ON (eeli.idetapainversion = ei.idetapainversion)
//                        INNER JOIN mod_planifinversiones.dat_elementovalor elv ON (eeli.idetapaelementoinversion = elv.idelemento)
//                        INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = elv.idmonedaentidad AND me.idmonedaentidad = {$moneda})";
//        $cadenaWHERE = " WHERE ei.idetapainversion = {$params['idetapainversion']} ";
//        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
//pre_r($cadenaQUERY);die;
//        $conn = Doctrine_Manager::connection();
//        $datosListar = $conn->execute($cadenaQUERY);
//        $datos = $datosListar->fetchAll(PDO::FETCH_COLUMN);
//
//        $result = $datos[0];
//        return $result;
//    }

    public function CargarValorEquiposXInver($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT coalesce (sum(eq.importe), 0) as importe, coalesce (sum(eq.importedivisa), 0) as importedivisa
                FROM  mod_planifinversiones.dat_etapainversion ei 
                inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                left JOIN mod_planifinversiones.dat_etapaequipos eq ON(ei.idetapainversion = eq.idetapainversion)
                WHERE ei.idetapainversion = " . $params['idetapainversion'] . " AND ne.denominacion = '" . $params['denominacionetapa'] . "'";
        $datosListar = $conn->execute($sql);
        //  print_r($sql);die;

        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function contenidoPorIdEtapa($idetapa) {
        $query = new Doctrine_Query();
        $datos = $query->select("de.idelementovalor")
                ->from("DatElementovalor de")
                ->innerJoin('de.DatEtapaElementoinversion n')
                ->addWhere("n.idetapainversion=?", $idetapa)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $datos;
    }

    public function CargarElemement($idetapa) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planifinversiones.dat_etapaelementoinversion.idetapaelementoinversion
from mod_planifinversiones.dat_etapainversion
 INNER JOIN mod_planifinversiones.dat_etapaelementoinversion ON mod_planifinversiones.dat_etapainversion.idetapainversion = mod_planifinversiones.dat_etapaelementoinversion.idetapainversion
	 WHERE mod_planifinversiones.dat_etapainversion.idetapainversion =  " . $idetapa;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

}
