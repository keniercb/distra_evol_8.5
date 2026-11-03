<?php

class DatArrendamiento extends BaseDatArrendamiento {

    public function setUp() {
        parent::setUp();
    }

    public function buscarArrendamiento($idaplicacioncartatec, $idindicador, $formatoredultadocomoarray = false) {
        $query = Doctrine_Query::create();
        if ($formatoredultadocomoarray) {
            return $query->from('DatArrendamiento arr')
                            ->where('arr.idaplicacioncartatec = ? AND arr.idindicador = ?', array($idaplicacioncartatec, $idindicador)
                            )->execute()->toArray(true);
        } else {
            return $query->from('DatArrendamiento arr')
                            ->where('arr.idaplicacioncartatec = ? AND arr.idindicador = ?', array($idaplicacioncartatec, $idindicador)
                            )->execute();
        }
    }

    public function listarArrendamientoDadoIdAplicAartaTecn($params) {
        $idapliccarta = $params['idaplicacioncartatec'];
        $start = $params['start'];
        $limit = $params['limit'];
        $query = "SELECT arr.idaplicacioncartatec,arr.idindicador,arr.plazoarrendamiento,arr.gasto,ind.denominacion,
                  ind.codigo,ind.descripcion,indplanif.precio as precioindicador
                  FROM mod_spouam.dat_arrendamiento arr
                  INNER JOIN mod_datosmaestros.nom_indicador ind ON(ind.idindicador = arr.idindicador)
                  INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif ON(ind.idindicador = indplanif.idindicador)
                  WHERE arr.idaplicacioncartatec = $idapliccarta
                  OFFSET $start LIMIT $limit";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarArrendamientoDadoIdAplicAartaTecnTotal($params) {
        $idapliccarta = $params['idaplicacioncartatec'];
        $query = "SELECT COUNT(idaplicacioncartatec) as total FROM mod_spouam.dat_arrendamiento arr WHERE arr.idaplicacioncartatec = $idapliccarta ";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function adicionarArrendamiento($params, $idindicador) {
        $query = "INSERT INTO mod_spouam.dat_arrendamiento (idaplicacioncartatec,idindicador,plazoarrendamiento,gasto)
                  VALUES (" . $params['idaplicacioncartatec'] . ",$idindicador,0,0);";
        $conn = Doctrine_Manager::connection();
        $conn->execute($query);
    }

    public function eliminarArrendamiento($params) {
        $idapliccarta = $params['idaplicacioncartatec'];
        $query = "DELETE FROM mod_spouam.dat_arrendamiento arr WHERE arr.idaplicacioncartatec = $idapliccarta
                  AND arr.idindicador IN (" . $params['indicadores'] . ");";
        $conn = Doctrine_Manager::connection();
        $conn->execute($query);
    }

}

//fin clase 