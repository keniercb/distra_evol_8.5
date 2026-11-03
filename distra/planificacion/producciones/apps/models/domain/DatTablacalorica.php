<?php

class DatTablacalorica extends BaseDatTablacalorica {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatFormulatablacalorica', array('local' => 'idtablacalorica', 'foreign' =>
            'idtablacalorica')
        );

        $this->hasMany(
                'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }

    public function listarTablacalorica($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "ind." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(ind." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } else
                if ($datos['field'] == 'idumedida') {
                    $condiciones[] = "ind.idumedida = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'precio' || $datos['field'] == 'cantidad' ||
                        $datos['field'] == 'kcal' || $datos['field'] == 'grasas' ||
                        $datos['field'] == 'proteinas' || $datos['field'] == 'carbohidratos'
                ) {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    if ($datos['field'] == 'precio') {
                        $condiciones[] = "indp." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                    } else {
                        $condiciones[] = "tc." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                    }
                } else if ($datos['field'] == 'enuso' || $datos['field'] == 'estado') {
                    //print_r($datos['data']['value']);die;
                    if ($datos['data']['value'] == 'Sí') {
                        $valor = 1;
                    } else {
                        $valor = 0;
                    }
                    $condiciones[] = "tc." . $datos['field'] . " =" . $valor;
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

        $conn = Doctrine_Manager::connection();
        $query = "SELECT tc.idtablacalorica,
                        ind.codigo,
                        ind.denominacion,
                        ind.descripcion,
                        ind.idumedida,
                        indp.precio,
                        tc.cantidad,
                        tc.kcal,
                        tc.grasas,
                        tc.proteinas,
                        tc.carbohidratos,
                        tc.enuso,
                        tc.estado,
                        count(*) OVER() as total
                 FROM mod_planificacion.dat_tablacalorica tc
                      INNER JOIN mod_datosmaestros.nom_indicador ind ON ind.idindicador =
                        tc.idindicador
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON indp.idindicador =
                        ind.idindicador
                       $WHERE $delimitando";

        $data = $conn->execute($query)
                ->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarIndicadoresAddTablaCalorica($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "ind." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion' || $datos['field'] == 'numeropieza') {
                    $condiciones[] = "upper(ind." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } else
                if ($datos['field'] == 'idumedida') {
                    $condiciones[] = "ind.idumedida = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'precio') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $condiciones[] = "indp." . $datos['field'] . $sqlSigno . $datos['data']['value'];
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
        $start = $params['start'];
        $limit = $params['limit'];

        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                        ind.idindicador,
                        ind.codigo,
                        ind.numeropieza,
                        ind.denominacion,
                        ind.descripcion,
                        ind.idumedida,
                        um.abreviaturaunidadmedida as unidadmedida,
                        indp.precio,
                        count(*) OVER() as total
                     FROM mod_datosmaestros.nom_indicador ind
                       LEFT JOIN mod_datosmaestros.nom_indicadorplanif indp
                       ON ( ind.idindicador = indp.idindicador)
                       LEFT JOIN mod_datosmaestros.dat_indicadorcentrobalance indc
                       ON( ind.idindicador = indc.idindicador )
                       INNER JOIN mod_datosmaestros.nom_unidadmedida um ON um.idunidadmedida =
                        ind.idumedida
                      WHERE indp.nivelplanif = 1 AND ind.estado = 1  AND indp.precio > 0
                       AND ( indp.idaprobacion = 4 ) AND ind.idindicador NOT IN(SELECT idindicador
                        FROM mod_planificacion.dat_tablacalorica
                       )
                       AND indc.identidaddatosnomenclador is not null " . $WHERE . "
                       ORDER BY ind.codigo                         
                       LIMIT $limit OFFSET $start";

        $data = $conn->execute($query)
                ->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarFormulasRelacionadas($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(f." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } else
                if ($datos['field'] == 'salida') {
                    $condiciones[] = "upper(ind.denominacion) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } else
                if ($datos['field'] == 'idumedida') {
                    $condiciones[] = "ind.idumedida = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'cantidadsalida' || $datos['field'] == 'kcalformula') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $condiciones[] = "f." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                } else
                if ($datos['field'] == 'tipoporciento' || $datos['field'] == 'estado') {
                    if ($datos['data']['value'] == 'Sí') {
                        $valor = 1;
                    } else {
                        $valor = 0;
                    }
                    $condiciones[] = "f." . $datos['field'] . " =" . $valor;
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
        if ($params['start']!=null && $params['limit']) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " LIMIT $limit OFFSET $start";
        }
        $idtablacalorica = $params['idtablacalorica'];

        $conn = Doctrine_Manager::connection();
        $query = "SELECT f.idformula,
                        f.denominacion,
                        f.descripcion,
                        f.tipoporciento,
                        f.idindicadorsalida,
                        ind.denominacion as salida,
                        f.cantidadsalida,
                        ind.idumedida,
                        f.kcalformula,
                        f.estado,
                        ftc.cantidad,
                        ftc.porciento,
                        count(*) OVER() AS total
                 FROM mod_planificacion.dat_formula f
                      INNER JOIN mod_planificacion.dat_formulatablacalorica ftc ON ftc.idformula
                        = f.idformula
                      INNER JOIN mod_planificacion.dat_tablacalorica tc ON ftc.idtablacalorica =
                        tc.idtablacalorica
                      INNER JOIN mod_datosmaestros.nom_indicador ind ON ind.idindicador =
                        f.idindicadorsalida
                 WHERE tc.idtablacalorica = $idtablacalorica " . $WHERE . "                        
                 $delimitando";

        $data = $conn->execute($query)
                ->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarIndicadorEnLaFormula($params) {
        $idtablacalorica = $params['idtablacalorica'];
        $idformula = $params['idformula'];

        $conn = Doctrine_Manager::connection();
        $query = "SELECT f.idformula,
                        (CASE
                           WHEN um.abreviaturaunidadmedida = 'UNO' THEN round(round(ftc.cantidad + 0.49, 0), 6)
                           ELSE round(ftc.cantidad, 6)
                         END) as cantidad,
                        ftc.porciento,
                        round((ftc.cantidad * tc.kcal / tc.cantidad),6) as kcal,
                        (ftc.cantidad * tc.grasas / tc.cantidad) as grasas,
                        (ftc.cantidad * tc.proteinas / tc.cantidad) as proteinas,
                        (ftc.cantidad * tc.carbohidratos / tc.cantidad) as carbohidratos,
                        (indp.precio * (CASE
                           WHEN um.abreviaturaunidadmedida = 'UNO' THEN round(round(ftc.cantidad + 0.49, 0), 6)
                           ELSE round(ftc.cantidad, 6)
                         END)) as importe,
                        count(*) OVER() AS total
                 FROM mod_planificacion.dat_formula f
                    INNER JOIN mod_planificacion.dat_formulatablacalorica ftc ON ftc.idformula
                      = f.idformula
                    INNER JOIN mod_planificacion.dat_tablacalorica tc ON ftc.idtablacalorica =
                      tc.idtablacalorica
                    INNER JOIN mod_datosmaestros.nom_indicador ind ON ind.idindicador =
                      tc.idindicador
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON indp.idindicador =
                      ind.idindicador
                    INNER JOIN mod_datosmaestros.nom_unidadmedida um ON um.idunidadmedida =
                        ind.idumedida
                 WHERE f.idformula = $idformula AND
                       tc.idtablacalorica = $idtablacalorica";

        $data = $conn->execute($query)
                ->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function eliminarIndicadoresTablaCalorica($idindicadores) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE 
                    FROM mod_planificacion.dat_tablacalorica 
                  WHERE 
                    idtablacalorica IN($idindicadores) AND
                 enuso = 0;";
        $conn->execute($query);
        return true;
    }

    public function activarIndicadoresTablaCalorica($idindicadores, $estado) {
        $WHERE = "";
        if ($estado == 1) {
            $WHERE = "AND kcal > 0";
        }
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE 
                    mod_planificacion.dat_tablacalorica 
                  SET 
                    estado = $estado
                  WHERE 
                    idtablacalorica IN($idindicadores)" . $WHERE . ";";
        $conn->execute($query);
        return true;
    }

    public function actualizarIndicadoresTablaCalorica($conn, $indicador) {
        $query = "UPDATE 
                    mod_planificacion.dat_tablacalorica 
                  SET 
                    cantidad = {$indicador->cantidad},
                    kcal = {$indicador->kcal},
                    grasas = {$indicador->grasas},
                    proteinas = {$indicador->proteinas},
                    carbohidratos = {$indicador->carbohidratos}
                  WHERE 
                    idtablacalorica = {$indicador->idtablacalorica}";
        $conn->execute($query);
        return true;
    }

    public function actualizarIndicadoresTablaCaloricaEnUso($conn, $formula, $kcalformula) {
        $query = "UPDATE mod_planificacion.dat_formula
                    SET
                        kcalformula = $kcalformula
                    WHERE
                        idformula = {$formula['idformula']}";
        $conn->execute($query);
        return true;
    }

    public function actualizarIndicadoresTablaCaloricaEnUsoPorcentual($conn, $indicador, $formula, $cantidad) {
        $query = "UPDATE mod_planificacion.dat_formulatablacalorica
                    SET cantidad = $cantidad
                    WHERE idtablacalorica = {$indicador->idtablacalorica} AND
                          idformula = {$formula['idformula']}";
        $conn->execute($query);
        return true;
    }

}
