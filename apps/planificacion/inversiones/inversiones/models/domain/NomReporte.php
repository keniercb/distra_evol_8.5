<?php

class NomReporte extends BaseNomReporte {
    
    public function setUp() {
        parent :: setUp();
    }

    public function getNomReporte() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                nr.idreporte,
                nr.codigo,
                nr.denominacion,
                nr.descripcion,
                nr.configuracion,
                nr.categoria
              FROM 
                mod_planifinversiones.nom_reporte nr 
                ORDER BY nr.categoria";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getReporteByIdReporte($idRpt) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                nr.idreporte,
                nr.codigo,
                nr.denominacion,
                nr.descripcion,
                nr.configuracion
              FROM 
                mod_planifinversiones.nom_reporte nr
              WHERE
                nr.idreporte = $idRpt";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getConfiguracionByIdReporte($idReporte) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                nr.configuracion
              FROM 
                mod_planifinversiones.nom_reporte nr
              WHERE
                nr.idreporte = $idReporte";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function savePie($objNomReporte) {
        //print_r($objNomReporte);die;
        $objNomReporte->save();
        return true;
    }

}
