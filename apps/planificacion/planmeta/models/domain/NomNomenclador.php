<?php

class NomNomenclador extends BaseNomNomenclador {

    public function Setup() {
        parent::setUp();
    }

    public function listarNomenclador($node, $filtros) {
        $addWhere = "";
        if ($node != 0)
            $addWhere = " WHERE n.idpadre=$node AND n.idnomenclador!=$node";
        else
            $addWhere = " WHERE n.idnomenclador=n.idpadre";
        //trabajo con los filtros
        $addWhereFiltros = " AND TRUE ";
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos ['field'] == 'text') {
                    $addWhere .= " AND upper(n.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'descripcion') {
                    $addWhere .= " AND upper(n.{$datos ['field']}) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'activacion' || $datos['field'] == 'valordefecto') {
                    if ($datos['data']['value'])
                        $addWhere .= " AND n.{$datos ['field']}={$datos['data']['value']}";
                    else
                        $addWhere .= " AND n.{$datos ['field']}=0";
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT 
                        n.idnomenclador as id,
                        n.idnomenclador,
                        n.denominacion as text,
                        n.descripcion,
                        n.uri,
                        n.activacion,
                        n.valordefecto,
                        n.orden,
                        n.idpadre as _parent,
                        case
                            WHEN 
                          (
                            select count(*)
                            from mod_planificacion.nom_nomenclador n1
                            where n.parentpath @> n1.parentpath
                          ) = 1 then 1
                            ELSE 0
                          END as leaf,
                        count(*) OVER() as total
                      FROM
                        mod_planificacion.nom_nomenclador n 
                        $addWhere ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminarValorDefectoNomenclador($idpadre) {
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE
                    mod_planificacion.nom_nomenclador
                  SET
                    valordefecto = 0
                    WHERE idpadre = $idpadre AND idnomenclador!=$idpadre";
        $conn->execute($query);
    }

    public function eliminarNomenclador($idnomenclador) {
        try {
            $conn = Doctrine_Manager::connection();
            $query = "DELETE FROM mod_planificacion.nom_nomenclador
                  WHERE  idnomenclador = $idnomenclador";
            $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            return 1; //operacion realizada
        } catch (Exception $e) {
            return 0; //no se pudo eliminar porque está en uso
        }
    }

    public function activarDesactivar($params) {
        $addWhere = "";
        if ($params['activacion'] == 0)
            $addWhere = " AND valordefecto=0";
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE
                    mod_planificacion.nom_nomenclador
                  SET
                    activacion = {$params['activacion']}
                  WHERE
                    idnomenclador IN({$params['idnomenclador']}) $addWhere";
        $conn->execute($query);
    }

    function crearUriNomenclador($idnomenclador) {
        $paramsQuery = array($idnomenclador);
        $query = "select * from mod_planificacion.f_generarurinomencladorxid(?)";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getNomOrdenados($idpadre) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT n.idnomenclador
                  FROM mod_planificacion.nom_nomenclador n
                  WHERE idpadre = $idpadre AND idnomenclador!=$idpadre
                  ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getNomOrdenadosRaiz() {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT n.idnomenclador
                            FROM mod_planificacion.nom_nomenclador n
                            WHERE n.idpadre=n.idnomenclador
                            ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function actualizarOrdenNom($idnomenclador, $orden) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "UPDATE mod_planificacion.nom_nomenclador
                        SET orden = $orden
                        WHERE idnomenclador = $idnomenclador";
        $conn->execute($sqlQuery);
    }

    public function moverRama($params) {
        $arrayParametros = array();
        $arrayParametros[] = $params['idnodo'];
        $arrayParametros[] = $params['idviejopadre'];
        $arrayParametros[] = $params['idnuevopadre'];
        $conn = Doctrine_Manager:: connection();
        $query = "select * from mod_planificacion.f_moverarbol(?,?,?)";
        $res = $conn->execute($query, $arrayParametros);
        $result = $res->fetchAll();
        if ($result[0][f_moverarbol] == 1) {
            return 1;
        } else {
            return 2;
        }
    }

    public function getNomOrdenAlfabetico($idpadre) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT n.idnomenclador
                  FROM mod_planificacion.nom_nomenclador n
                  WHERE n.idpadre = $idpadre AND n.idnomenclador!=$idpadre
                  ORDER BY n.denominacion";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getNomOrdenAlfabeticoRaiz() {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT n.idnomenclador
                  FROM mod_planificacion.nom_nomenclador n
                  WHERE n.idpadre = n.idnomenclador
                  ORDER BY n.denominacion";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function servGetNomencladoresHijos($uripadre) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "WITH padre AS (SELECT parentpath
                     FROM mod_planificacion.nom_nomenclador
                     WHERE uri = '$uripadre')
                      SELECT idnomenclador,
                             idpadre,
                             parentpath,
                             denominacion,
                             descripcion,
                             activacion,
                             valordefecto,
                             orden,
                             uri
                      FROM mod_planificacion.nom_nomenclador n
                      WHERE (
                              SELECT parentpath
                              FROM padre
                            ) @> n.parentpath AND
                            nlevel(n.parentpath) =
                            (
                              SELECT nlevel(parentpath)
                              FROM padre
                            ) + 1
                      ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    //Servicio para obtener un array de los identificadores 
    //de los hijos de un nomenclador deterinado dado su uri
    public function servGetIdNomencladoresHijos($uripadre) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "WITH padre AS (SELECT parentpath
                     FROM mod_planificacion.nom_nomenclador
                     WHERE uri = '$uripadre')
                      SELECT idnomenclador
                      FROM mod_planificacion.nom_nomenclador n
                      WHERE (
                              SELECT parentpath
                              FROM padre
                            ) @> n.parentpath AND
                            nlevel(n.parentpath) =
                            (
                              SELECT nlevel(parentpath)
                              FROM padre
                            ) + 1
                      ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function servGetNomencladoresRama($uripadre, $excluirPadre = false) {
        $whereExcluirPadre = "";
        if ($excluirPadre)
            $whereExcluirPadre = "AND (SELECT parentpath FROM padre)<> n.parentpath";
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "
                        WITH padre AS (SELECT idnomenclador,
                                              idpadre,
                                              parentpath
                                       FROM mod_planificacion.nom_nomenclador
                                       WHERE uri = '$uripadre')

                          SELECT idnomenclador,
                                 idpadre,
                                 parentpath,
                                 CASE
                                   WHEN
                                 (
                                   select count(*)
                                   from mod_planificacion.nom_nomenclador n1
                                   where n.parentpath @> n1.parentpath
                                 ) = 1 then 1
                                   ELSE 0
                                 END as leaf,
                                 denominacion as text,
                                 descripcion,
                                 activacion,
                                 valordefecto,
                                 orden,
                                 uri
                          FROM mod_planificacion.nom_nomenclador n
                          WHERE (
                                  SELECT parentpath
                                  FROM padre
                                ) @> n.parentpath
                        $whereExcluirPadre 
                         ORDER BY n.parentpath";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function servGetNomencladoresById($arrayIdnomenclador) {
        $idnomencladores = implode(',', $arrayIdnomenclador);
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT idnomenclador,
                             idpadre,
                             parentpath,
                             denominacion,
                             descripcion,
                             activacion,
                             valordefecto,
                             orden,
                             uri
                      FROM mod_planificacion.nom_nomenclador n
                      WHERE idnomenclador IN($idnomencladores)
                      ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function servListarNomenclador($uri, $idnomencladores = null) {
        $obj = Doctrine::getTable('NomNomenclador')->findByDql("uri = '$uri'");
        $node = $obj[0]->idnomenclador;
        $addWhere = " AND n.idpadre=$node AND n.idnomenclador!=$node";
        if ($idnomencladores != null)
            $addWhere = $addWhere . " AND n.idnomenclador IN($idnomencladores)";
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT 
                        n.idnomenclador,
                        n.uri as id,
                        n.denominacion as text,
                        n.descripcion,
                        n.uri,
                        n.activacion,
                        n.valordefecto,
                        n.orden,
                        n.idpadre as _parent,
                        n.parentpath,
                        case
                            WHEN 
                          (
                            select count(*)
                            from mod_planificacion.nom_nomenclador n1
                            where n.parentpath @> n1.parentpath
                          ) = 1 then 1
                            ELSE 0
                          END as leaf,
                        count(*) OVER() as total
                      FROM
                        mod_planificacion.nom_nomenclador n 
                        WHERE n.activacion = 1 $addWhere 
                    ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function servListarNomencladorId($idnomenclador, $idnomencladores = null) {
        $node = $idnomenclador;
        $addWhere = " AND n.idpadre=$node AND n.idnomenclador!=$node";
        if ($idnomencladores != null)
            $addWhere = $addWhere . " AND n.idnomenclador IN($idnomencladores)";
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT 
                        n.idnomenclador  as id,
                        n.uri,
                        n.denominacion as text,
                        n.descripcion,
                        n.uri,
                        n.activacion,
                        n.valordefecto,
                        n.orden,
                        n.idpadre as _parent,
                        n.parentpath,
                        case
                            WHEN 
                          (
                            select count(*)
                            from mod_planificacion.nom_nomenclador n1
                            where n.parentpath @> n1.parentpath
                          ) = 1 then 1
                            ELSE 0
                          END as leaf,
                        count(*) OVER() as total
                      FROM
                        mod_planificacion.nom_nomenclador n 
                        WHERE n.activacion = 1 $addWhere 
                    ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function servGetNomencladoresByUri($uri) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT idnomenclador,
                             idpadre,
                             parentpath,
                             denominacion,
                             descripcion,
                             activacion,
                             valordefecto,
                             orden,
                             uri
                      FROM mod_planificacion.nom_nomenclador n
                      WHERE uri ='$uri'  
                      ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function servListarNomencladorByIdExcluir($idnomenclador, $idnomencladores = null) {
        $node = $idnomenclador;
        $addWhere = " AND n.idpadre=$node AND n.idnomenclador!=$node";
        if ($idnomencladores != null)
            $addWhere = $addWhere . " AND n.idnomenclador NOT IN($idnomencladores)";
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT 
                        n.idnomenclador  as id,
                        n.uri,
                        n.denominacion as text,
                        n.descripcion,
                        n.uri,
                        n.activacion,
                        n.valordefecto,
                        n.orden,
                        n.idpadre as _parent,
                        n.parentpath,
                        case
                            WHEN 
                          (
                            select count(*)
                            from mod_planificacion.nom_nomenclador n1
                            where n.parentpath @> n1.parentpath
                          ) = 1 then 1
                            ELSE 0
                          END as leaf,
                        count(*) OVER() as total
                      FROM
                        mod_planificacion.nom_nomenclador n 
                        WHERE n.activacion = 1 $addWhere 
                    ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    //servicio para traer un nomenclador dado su uri y la de su padre 
    //esto sirve para cuando hay nomencladores que se llaman igual y 
    //son de ramas distintas
    public function servGetNomencladoresByUriHijoByUriPadre($uriHijo, $uriPadre) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "WITH padre AS
                    (SELECT npadre.idnomenclador as idnompadre
                     FROM mod_planificacion.nom_nomenclador npadre
                     WHERE uri = '$uriPadre')
                    SELECT idnomenclador,
                           idpadre,
                           parentpath,
                           denominacion,
                           descripcion,
                           activacion,
                           valordefecto,
                           orden,
                           uri
                    FROM mod_planificacion.nom_nomenclador n
                         INNER JOIN padre p ON n.idpadre = p.idnompadre
                    WHERE n.uri = '$uriHijo'
                    ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    //obtiene los hijos de un nomenclador que son hojas  
    public function servGetNomencladoresHojaFamilia($uri) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT n.idnomenclador,
                            n.denominacion as text,
                            n.uri
                     FROM (
                            SELECT idnomenclador,
                                   denominacion,
                                   uri,
                                   CASE
                                     WHEN
                                   (
                                     SELECT COUNT(idnomenclador)
                                     FROM mod_planificacion.nom_nomenclador
                                     WHERE idpadre = f.idnomenclador AND
                                           idpadre <> idnomenclador
                                   ) = 0 then true
                                     else false
                                   END AS leaf
                            from mod_planificacion.nom_nomenclador f
                            where parentpath <@
                                  (
                                    SELECT parentpath
                                    from mod_planificacion.nom_nomenclador
                                    where uri = '$uri'
                                  )
                            ORDER BY nlevel(parentpath)
                          ) n
                     WHERE n.leaf = 'true'
                     ORDER BY n.denominacion";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }
    //servicio que pasandole la uri del padre y los hijos que se quieren incluir
     public function servGetNomencladoresByUriIncluir($uri, $uriincluir = null) {
        $conn = Doctrine_Manager::connection();
        if ($uriincluir != null)
            $addWhere = " AND n.uri IN($uriincluir)";
        $sqlQuery = "WITH padre AS (SELECT idnomenclador
               FROM mod_planificacion.nom_nomenclador n
               WHERE uri = '$uri'
               LIMIT 1)

                SELECT idnomenclador,
                       denominacion as text,
                       uri as id
                FROM mod_planificacion.nom_nomenclador n
                WHERE n.idpadre =
                      (
                        SELECT idnomenclador
                        FROM padre
                      ) AND
                      n.idnomenclador <> n.idpadre 
                      $addWhere
                ORDER BY n.orden";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }


}
