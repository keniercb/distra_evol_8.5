<?php

class DatFichacosto extends BaseDatFichacosto
{

    public function setUp()
    {
        parent::setUp();
    }

    public function exportarFichaCosto($params)
    {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT z.uriconcepto,
                           sum(COALESCE(z.importe, 0)) as importetotal
                    FROM ((
                            SELECT dn.uridatosnomenclador as uriconcepto,
                                   COALESCE(sum(indp.precio * norm.necesidad), 0) as importe
                            FROM mod_spouam.dat_fichacosto fic
                                 INNER JOIN mod_planificacion.nom_datosnomenclador dn ON
                                    fic.iddatosnomenclador = dn.iddatosnomenclador
                                 INNER join mod_datosmaestros.nom_naturaleza nat on (
                                   nat.idnaturaleza = fic.idnaturaleza)
                                 INNER join mod_datosmaestros.nom_indicador ind on (ind.idnaturaleza
                                   = fic.idnaturaleza)
                                 INNER join mod_datosmaestros.nom_indicadorplanif indp on (
                                   indp.idindicador = ind.idindicador)
                                 INNER join mod_planificacion.dat_norma norm on (ind.idindicador =
                                   norm.idindicador AND norm.idejercicio = {$params['idejercicio']})
                                 INNER join mod_spouam.dat_cartatecnologicaactividad cta on (
                                   norm.idactividad = cta.idactividad)
                                 INNER join mod_spouam.dat_cartatecnologica ct on (
                                   cta.idcartatecnologica = ct.idcartatecnologica AND
                                   ct.idcartatecnologica = {$params['idcartatecnologica']})
                            WHERE indp.nivelplanif = 1 AND
                                  indp.idaprobacion = 4 AND
                                  ind.estado = 1
                            group by dn.uridatosnomenclador
                         )
                    UNION (
                            SELECT  dn.uridatosnomenclador as uriconcepto,
                                   CASE
                                     WHEN ind.idnaturaleza IS NULL then 0
                                   END as importe
                            FROM mod_spouam.dat_fichacosto fic
                                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON
                                    fic.iddatosnomenclador = dn.iddatosnomenclador
                                 INNER join mod_datosmaestros.nom_naturaleza nat on (
                                   nat.idnaturaleza = fic.idnaturaleza)
                                 LEFT join mod_datosmaestros.nom_indicador ind on (ind.idnaturaleza
                                   = fic.idnaturaleza AND ind.estado = 1)
                                 LEFT join mod_datosmaestros.nom_indicadorplanif indp on (
                                   indp.idindicador = ind.idindicador AND indp.nivelplanif = 1 AND
                                   indp.idaprobacion = 4)
                            group by dn.uridatosnomenclador,
                                     ind.idnaturaleza
                          )) z
                    GROUP BY z.uriconcepto";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarnaturaleza()
    {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idnaturaleza AS naturaleza, denominacion
                    FROM mod_datosmaestros.nom_naturaleza";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }


    public function listarnaturalezaficha($params)
    {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $condiciones[] = "upper(nat." .$datos['field']. ") LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                }
                else if ($datos['field'] == 'naturaleza'){
                    $condiciones[] .= "(to_char(nat.idnaturaleza,'9999999999s') LIKE '%". $datos['data']['value']."%')" ;
                }
            }
        }//Fin de los filtros
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $con = Doctrine_Manager::connection();
        $query = "SELECT idnaturaleza AS naturaleza,
                           denominacion,
                           count(*) over() as total
                    FROM mod_datosmaestros.nom_naturaleza nat
                    WHERE idnaturaleza NOT IN (
                            SELECT idnaturaleza
                            FROM mod_spouam.dat_fichacosto)
                            $WHERE $delimitando";

        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function guardarConfiguracionNaturaleza($params)
    {
        $idfichacosto = $params->idfichacosto;
        $iddatosnomenclador = $params->iddatosnomenclador;
        $con = Doctrine_Manager::connection();
        $query = "UPDATE 
                      mod_spouam.dat_fichacosto 
                    SET 
                      iddatosnomenclador = $iddatosnomenclador
                    WHERE 
                      idfichacosto ='$idfichacosto'";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function listarfichacosto($params)
    {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'idnaturaleza' || $datos['field'] == 'iddatosnomenclador') {
                    $condiciones[] = "fc." . $datos['field'] . " = " . $datos['data']['value'];
                }
            }
        }//Fin de los filtros
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'WHERE ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $con = Doctrine_Manager::connection();
        $query = "SELECT 
                      idfichacosto,
                      idnaturaleza,
                      iddatosnomenclador,
                      count(*) over() as total
                    FROM 
                      mod_spouam.dat_fichacosto fc
                      $WHERE
                      $delimitando
                       ";

        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function eliminarrelacionficha($params)
    {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE 
                    FROM mod_spouam.dat_fichacosto 
                  WHERE 
                    idfichacosto IN($params)";
        $conn->execute($query);
        return true;
    }


}

//fin clase 