<?php

class DatFormula extends BaseDatFormula {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatFormulatablacalorica', array('local' => 'idformula', 'foreign' => 'idformula')
        );
        $this->hasMany(
                'NomIndicador', array('local' => 'idindicadorsalida', 'foreign' => 'idindicador')
        );
        $this->hasMany(
                'NomDatosnomenclador', array('local' => 'idagrupacion', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'DatFormulaactividad', array('local' => 'idformula', 'foreign' => 'idformula')
        );
    }

    public function getFormulasNutri($parametros) {
        if (isset($parametros->idactividad)) {
            $WhereActv = " fa.idactividad = $parametros->idactividad";
            $JOIN = "INNER JOIN mod_planificacion.dat_formulaactividad fa ON (fa.idformula = f.idformula)";
            $WhereEnt = "";
        } else {
            $WhereActv = "";
            $JOIN = "";
            $WhereEnt = "f.identidad IN ($parametros->identidad)";
        }
        $condiciones = array();
        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $datos) {
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(f.{$datos['field']}) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } elseif ($datos['field'] == 'codigoind') {
                    $condiciones[] = " ind.codigo LIKE '{$datos['data']['value']}%'";
                } elseif ($datos['field'] == 'denomindicador') {
                    $condiciones[] = "upper(ind.{$datos['field']}) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } elseif ($datos['field'] == 'cantidadsalida' || $datos['field'] == 'kcalformula') {
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
                } elseif ($datos['field'] == 'estado' || $datos['field'] == 'tipoporciento') {
                    $value = 0;
                    if ($datos['data']['value'] == "SI" || $datos['data']['value'] == "S�?" || $datos['data']['value'] == "sí" || $datos['data']['value'] == "Sí" || $datos['data']['value'] == "Aprobada" || $datos['data']['value'] == "Porcentual") {
                        $value = 1;
                    }
                    $condiciones[] = "f." . $datos['field'] . " = " . $value;
                } elseif ($datos['field'] == 'normada') {
                    if ($datos['data']['value'] == "SI" || $datos['data']['value'] == "S�?" || $datos['data']['value'] == "sí" || $datos['data']['value'] == "Sí") {
                        $sqlSigno = "<>";
                    } else {
                        $sqlSigno = "=";
                    }
                    $condiciones[] = " (COALESCE((
                                   SELECT ftc.idformula
                                   FROM mod_planificacion.dat_formulatablacalorica ftc
                                   where ftc.idformula = f.idformula
                                   limit 1), 0)) " . $sqlSigno . " 0 ";
                } elseif ($datos['field'] == 'idumedida') {
                    $condiciones[] = "ind.idumedida = " . $datos['data']['value'] . " ";
                } elseif ($datos['field'] == 'idagrupacion' || $datos['field'] == 'idusuario') {
                    $condiciones[] = "f." . $datos['field'] . " = " . $datos['data']['value'];
                } elseif ($datos['field'] == 'fecha') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $condiciones[] = "f." . $datos['field'] . $sqlSigno . "'" . $fecha . "'";
                }
            }
        }//Fin de los filtros
        $conn = Doctrine_Manager::connection();
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            $WHERE = $WHERE . " AND " . $condicion;
        }
        $delimitando = "";
        if ($parametros->start != null && $parametros->limit) {
            $start = $parametros->start;
            $limit = $parametros->limit;
            $delimitando = " LIMIT $limit OFFSET $start";
        }
        $sql = "SELECT f.idformula,
                        f.denominacion,
                        f.descripcion,
                        f.fecha,
                        f.idusuario,
                        f.estado,
                        ind.codigo as codigoind,
                        ind.denominacion as denomindicador,
                        ind.idumedida,
                        f.cantidadsalida,
                        f.kcalformula,
                        COALESCE((
                                   SELECT ftc.idformula
                                   FROM mod_planificacion.dat_formulatablacalorica ftc
                                   where ftc.idformula = f.idformula
                                   limit 1
                        ), 0) as normada,
                        f.tipoporciento,
                        f.idagrupacion,
                        count(*) over() as total
                 FROM mod_planificacion.dat_formula f
                      INNER JOIN mod_datosmaestros.nom_indicador ind ON (f.idindicadorsalida =
                        ind.idindicador)
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (ind.idindicador =
                        indp.idindicador)
                      INNER JOIN mod_datosmaestros.nom_unidadmedida um ON (ind.idumedida =
                        um.idunidadmedida)
                      INNER JOIN mod_planificacion.nom_datosnomenclador nom ON (f.idagrupacion =
                        nom.iddatosnomenclador)
                      INNER JOIN mod_seguridad.seg_usuario us ON (f.idusuario = us.idusuario)
                      $JOIN
                 WHERE " . $WhereEnt . $WhereActv . $WHERE .
                "ORDER BY f.idformula " . $delimitando;
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getindicadoresTCFormula($parametros) {
        $condiciones = array();
        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $datos) {
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
        if ($parametros->start != null && $parametros->limit) {
            $start = $parametros->start;
            $limit = $parametros->limit;
            $delimitando = " LIMIT $limit OFFSET $start";
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
                            count(*) OVER() as total
                 FROM mod_planificacion.dat_tablacalorica tc
                      INNER JOIN mod_datosmaestros.nom_indicador ind ON ind.idindicador =
                        tc.idindicador
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON indp.idindicador =
                        ind.idindicador 
                        WHERE tc.estado= 1 
                                /*AND tc.idtablacalorica NOT IN ({$parametros->idtablacalorica})*/ " . $WHERE . $delimitando;
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarComponentes($parametros) {
        $condiciones = array();
        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " ind.codigo LIKE '{$datos['data']['value']}%'";
                } elseif ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(ind.{$datos['field']}) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } elseif ($datos['field'] == 'precio') {
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
                } elseif ($datos['field'] == 'cantidad') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $condiciones[] = " (CASE
                                            WHEN um.abreviaturaunidadmedida = 'UNO' THEN round(tcf.cantidad, 0)
                                            ELSE round(tcf.cantidad, 6)
                                        END) " . $sqlSigno . $datos['data']['value'];
                } elseif ($datos['field'] == 'porciento') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $condiciones[] = "tcf." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                } elseif ($datos['field'] == 'importe') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $condiciones[] = "(indp.precio + tcf.cantidad)" . $sqlSigno . $datos['data']['value'];
                } elseif ($datos['field'] == 'kcal' || $datos['field'] == 'grasas' || $datos['field'] == 'proteinas' || $datos['field'] == 'carbohidratos') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $condiciones[] = "(tcf.cantidad * tc.{$datos['field']} / tc.cantidad)" . $sqlSigno . $datos['data']['value'];
                } elseif ($datos['field'] == 'estado') {
                    $value = 0;
                    if ($datos['data']['value'] == "SI" || $datos['data']['value'] == "S�?" || $datos['data']['value'] == "sí" || $datos['data']['value'] == "Sí") {
                        $value = 1;
                    }
                    $condiciones[] = "tc.estado = " . $value;
                } elseif ($datos['field'] == 'idumedida') {
                    $condiciones[] = "ind.idumedida = " . $datos['data']['value'] . " ";
                }
            }
        }//Fin de los filtros
        $conn = Doctrine_Manager::connection();
        $WHERE = "WHERE tc.idtablacalorica IN (SELECT ft.idtablacalorica FROM mod_planificacion.dat_formulatablacalorica ft WHERE ft.idformula={$parametros->idformula})
                    AND tcf.idformula = {$parametros->idformula}";
        foreach ($condiciones as $condicion) {
            $WHERE = $WHERE . " AND " . $condicion;
        }
        $query = "SELECT tc.idtablacalorica,
                        ind.codigo,
                        ind.denominacion,
                        ind.descripcion,
                        ind.idumedida,
                        indp.precio,
                        tcf.cantidad as cantidadabsoluta,
                        (CASE
                           WHEN um.abreviaturaunidadmedida = 'UNO' THEN round(round(tcf.cantidad+0.49, 0), 6)
                           ELSE round(tcf.cantidad, 6)
                         END) as cantidad,
                        tcf.porciento,
                        round((tcf.cantidad * tc.kcal / tc.cantidad), 6) as kcal,
                        round((tcf.cantidad * tc.grasas / tc.cantidad), 6) as grasas,
                        round((tcf.cantidad * tc.proteinas / tc.cantidad), 6) as proteinas,
                        round((tcf.cantidad * tc.carbohidratos / tc.cantidad), 6) as
                          carbohidratos,
                        round((indp.precio * (CASE
                           WHEN um.abreviaturaunidadmedida = 'UNO' THEN round(round(tcf.cantidad+0.49, 0), 6)
                           ELSE round(tcf.cantidad, 6)
                         END)), 6) as importe,
                        tc.estado,
                        count(*) OVER() as total
                 FROM mod_planificacion.dat_tablacalorica tc
                      INNER JOIN mod_datosmaestros.nom_indicador ind ON ind.idindicador =
                        tc.idindicador
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON indp.idindicador =
                        ind.idindicador
                      INNER JOIN mod_datosmaestros.nom_unidadmedida um ON um.idunidadmedida =
                        ind.idumedida
                       INNER JOIN mod_planificacion.dat_formulatablacalorica tcf ON tcf.idtablacalorica =
                        tc.idtablacalorica
                        " . $WHERE . "
                        LIMIT $parametros->limit OFFSET $parametros->start";
        $data = $conn->execute($query)
                ->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerIdUsuaios() {
        $query = Doctrine_Query::create();
        $query->select('distinct(user.idusuario) as idusuario')
                ->from('SegUsuario user')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    public function adicionarFormulasNutricionales($parametros) {
        $obj = new DatFormula();
        $obj->identidad = $parametros->identidad;
        $obj->denominacion = $parametros->denominacion;
        $obj->descripcion = $parametros->descripcion;
        $obj->idindicadorsalida = $parametros->idindicadorsalida;
        $obj->idagrupacion = $parametros->idagrupacion;
        $obj->idusuario = $parametros->idusuario;
        $obj->cantidadsalida = $parametros->cantidadsalida;
        $obj->tipoporciento = $parametros->tipoporciento;
        $obj->kcalformula = $parametros->kcalformula;
        $obj->estado = $parametros->estado;
        $obj->save();
        return true;
    }

    public function getAgrupaciones() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT nom.denominacion, nom.iddatosnomenclador as idagrupacion
                FROM mod_planificacion.nom_datosnomenclador nom
                INNER JOIN mod_planificacion.nom_tiponomenclador tnm 
                ON (nom.idtiponomenclador = tnm.idtiponomenclador)
                WHERE tnm.uritiponomenclador = 'Agrupaciónpecuaria'";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getIndicadores($parametros) {
        $condiciones = array();
        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " ind.codigo LIKE '{$datos['data']['value']}%'";
                } elseif ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion' || $datos['field'] == 'numeropieza') {
                    $condiciones[] = "upper(ind.{$datos['field']}) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } elseif ($datos['field'] == 'idumedida') {
                    $condiciones[] = "ind.idumedida = " . $datos['data']['value'] . " ";
                } elseif ($datos['field'] == 'precio' || $datos['field'] == 'precioventa') {
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

        $conn = Doctrine_Manager::connection();
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT ind.idindicador,
                        ind.codigo,
                        ind.denominacion,
                        ind.descripcion,
                        ind.idumedida,
                        ind.numeropieza,
                        indp.precio,
                        indp.precioventa,
                        count(*) over() as total
                 FROM mod_datosmaestros.nom_indicador ind
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (ind.idindicador =
                        indp.idindicador)
                 WHERE indp.nivelplanif = 1 AND
                       ind.nivel = 4 AND
                       ind.estado = 1 AND
                       indp.idaprobacion = 4 AND
                       indp.precio > 0" . $WHERE . " 
                        LIMIT $parametros->limit OFFSET $parametros->start";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function ActualizarEstado($idformula, $estado, $usuario) {
        $conn = Doctrine_Manager::connection();
        //Validando que no permita aprobar una fórmula que no esté 'normada'
        $Where = "";
        if ($estado == 1) {
            $Where = " AND (COALESCE((
                                   SELECT ftc.idformula
                                   FROM mod_planificacion.dat_formulatablacalorica ftc
                                   where ftc.idformula = $idformula
                                   limit 1), 0)) <> 0";
        }
        //fin
        $sql = "UPDATE mod_planificacion.dat_formula
            SET estado = $estado, idusuario = $usuario WHERE idformula = $idformula" . $Where;
        $result = $conn->execute($sql);
        return $result;
    }

    public function modificarFormulasNutricionales($params) {
        $objformula = Doctrine::getTable('DatFormula')->find($params->idformula);
        $objformula->denominacion = $params->denominacion;
        $objformula->descripcion = $params->descripcion;
        $objformula->idagrupacion = $params->idagrupacion;
        $objformula->idindicadorsalida = $params->idindicadorsalida;
        $objformula->idusuario = $params->idusuario;
        $objformula->kcalformula = $params->kcalformula;
        $objformula->cantidadsalida = $params->cantidadsalida;
        $objformula->tipoporciento = $params->tipoporciento;
        $objformula->save();
        return true;
    }

    public function adicionarNormaAFormula($parametros) {
        $formula = Doctrine::getTable('DatFormula')->findByDql("idformula = $parametros->idformula");
        if ($formula[0]->tipoporciento == 1) {
            foreach ($parametros->arraytablac as $tabla) {
                $tablacalorica = Doctrine::getTable('DatTablacalorica')->findByDql("idtablacalorica = $tabla->idtablacalorica");
                $parametros->idtablacalorica = $tabla->idtablacalorica;
                self::eliminarRelacion($parametros);
                $obj = new DatFormulatablacalorica();
                $obj->idformula = $parametros->idformula;
                $obj->idtablacalorica = $tabla->idtablacalorica;
                $caloriasquenecesito = ($tabla->porciento * $tabla->kcalformula) / 100;
                $obj->cantidad = ($caloriasquenecesito * $tablacalorica[0]->cantidad) / $tablacalorica[0]->kcal;
                $obj->porciento = $tabla->porciento;
                $obj->save();
                self::actualizarEnuso($tabla->idtablacalorica);
            }
        } else {
            foreach ($parametros->arraytablac as $tabla) {
                $parametros->idtablacalorica = $tabla->idtablacalorica;
                self::eliminarRelacion($parametros);
                $obj = new DatFormulatablacalorica();
                $obj->idformula = $parametros->idformula;
                $obj->idtablacalorica = $tabla->idtablacalorica;
                $obj->cantidad = $tabla->cantidad;
                $obj->save();
                self::actualizarkalorias($parametros);
                self::actualizarEnuso($tabla->idtablacalorica);
            }
        }
        return true;
    }

    public function actualizarkalorias($parametros) {
        $conn = Doctrine_Manager::connection();
        $total = " SELECT sum((t.kcal * ft.cantidad)/t.cantidad) as kcaltotal
            FROM mod_planificacion.dat_tablacalorica t
            INNER JOIN mod_planificacion.dat_formulatablacalorica ft ON t.idtablacalorica=ft.idtablacalorica
            WHERE ft.idformula={$parametros->idformula};";
        $datos = $conn->execute($total)->fetchAll(PDO::FETCH_ASSOC);
        $conn = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planificacion.dat_formula
            SET kcalformula = " . $datos[0]['kcaltotal'] . "
            WHERE mod_planificacion.dat_formula.idformula = "
                . $parametros->idformula . " ";
        $conn->execute($sql);
    }

    public function actualizarEnuso($idtablacalorica) {
        $tablacalorica = Doctrine::getTable('DatTablacalorica')->findByDql(
                "idtablacalorica = $idtablacalorica"
        );

        $tablacalorica[0]->enuso = 1;
        $tablacalorica->save();
    }

    public function eliminarRelacion($parametros) {

        $sqlQuery = " DELETE
            FROM mod_planificacion.dat_formulatablacalorica ft
            WHERE ft.idformula={$parametros->idformula} AND ft.idtablacalorica={$parametros->idtablacalorica};";
        $conn = Doctrine_Manager::connection();
        $conn->execute($sqlQuery);
    }

    public function EliminarFormula($params) {
        $sqlQuery = " DELETE FROM mod_planificacion.dat_formula df
        WHERE df.idformula IN ($params->idformuladesg);";

        $conn = Doctrine_Manager::connection();
        $conn->execute($sqlQuery);
        return true;
    }

    public function eliminarNormaAFormula($params) {
        $sqlQuery = " DELETE FROM mod_planificacion.dat_formulatablacalorica df
        WHERE df.idformula={$params->idformula} AND df.idtablacalorica IN ($params->arrayidtablacdesg);";

        $conn = Doctrine_Manager::connection();
        $conn->execute($sqlQuery);
        return true;
    }

    public function cargarIndicadorSalidad($parametros) {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT df.cantidadsalida,ind.idindicador,ind.codigo, ind.denominacion, ind.idumedida,um.denominacionunidadmedida as denomum
FROM mod_planificacion.dat_formula df
INNER JOIN mod_datosmaestros.nom_indicador ind  ON(ind.idindicador = df.idindicadorsalida)
INNER JOIN mod_datosmaestros.nom_unidadmedida um ON(ind.idumedida = um.idunidadmedida)
WHERE df.idformula={$parametros->idformula};";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarActividades($parametros) {

        if ($parametros->asociardesa == 1) {
            $WHERE = "AND factv.idformula is null OR factv.idformula <> {$parametros->idformula}";
        } else {
            $WHERE = "AND factv.idformula = {$parametros->idformula}";
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT (actv.idactividad),actv.codigo,actv.denominacion,actv.descripcion,actv.estado,actv.idaprobacion,
       actv.normada,count(*) over() as total
FROM mod_planificacion.nom_actividad actv
     LEFT JOIN mod_planificacion.dat_formulaactividad factv ON (factv.idactividad = actv.idactividad)
WHERE actv.estado = 0 AND actv.idaprobacion = 1 AND actv.nivel = 4 $WHERE
OFFSET $parametros->start LIMIT $parametros->limit";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarUsuarios() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT (u.idusuario),
                        u.nombreusuario
                 FROM mod_seguridad.seg_usuario u
                 where u.activo = TRUE";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function comprobarActividad($idactividad) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT n.idindicador, n.idactividad, count(*) over()
                FROM mod_planificacion.dat_norma n
                INNER JOIN mod_planificacion.nom_actividad act ON(act.idactividad = n.idactividad)
                WHERE  n.idactividad = $idactividad;";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function eliminarRealacionNormaActividad($idactividad) {
        $sqlQuery = "DELETE FROM mod_planificacion.dat_norma n
                      WHERE n.idactividad = $idactividad;";
        $conn = Doctrine_Manager::connection();
        $conn->execute($sqlQuery);
    }

    public function eliminarRelacionActvFormula($parametros) {
        $sqlQuery = " DELETE FROM mod_planificacion.dat_formulaactividad df
            WHERE df.idformula={$parametros->idformula} AND df.idactividad IN ($parametros->idactividad);";
        $conn = Doctrine_Manager::connection();
        $conn->execute($sqlQuery);
    }

    public function crearRelacionActvFormula($parametros) {
        $obj = new DatFormulaactividad();
        $obj->idactividad = $parametros->idactividad;
        $obj->idformula = $parametros->idformula;
        $obj->save();
    }

    public function crearRealacionNormaActividad($parametros) {
        $sqlQuery = "INSERT INTO mod_planificacion.dat_norma(idindicador, idactividad, cantbase,
                     cantplanif,idejercicio)
                     VALUES ($parametros->idindicador,$parametros->idactividad,1,$parametros->cantidadplanif,$parametros->idejercicio); ";
        $conn = Doctrine_Manager::connection();
        $conn->execute($sqlQuery);
    }

    public function obtenerIndTablaCaloricaDadoIdFormula($idformula) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT tc.idindicador, tfc.cantidad
                FROM mod_planificacion.dat_tablacalorica tc
                INNER JOIN mod_planificacion.dat_formulatablacalorica tfc ON (tc.idtablacalorica = tfc.idtablacalorica)
                WHERE tfc.idformula = $idformula";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function mostrarAnalisiNutricional() {
        $sql = "select count(tablename) from pg_tables where schemaname = 'mod_planificacion' AND tablename = 'dat_formula'";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}
