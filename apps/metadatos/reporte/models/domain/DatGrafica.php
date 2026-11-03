<?php

/**
 * Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class DatGrafica extends BaseDatGrafica
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatGraficaUsuario', array('local' => 'idgrafica', 'foreign' => 'idgrafica'));
    }

    /**
     * Devuelve el ultimo identifcador de la tabla.
     *
     * @return mixed, devuelve el último identificador.
     * @author     : Ing. Pedro Alberto Jiménez
     * @copyright  Copyright (c) 2013 xetid
     */
    public function ultimoId()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll('Select max(idgrafica) + 1 as max from mod_estructuracomp.dat_grafica');
        if ($result[0]['max'] == "") {
            return 1;
        } else {
            return $result[0]['max'];
        }
    }

    /**
     * Devuelve un arreglo con la configuración almacenada.
     *
     * @param  array $datos Datos del filtro a aplicar para obtener la información.
     * @param        $usuario
     *
     * @return array, devuelve un arreglo con las denominaciones, descripciones y configuraciones de la gráfica
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    public static function obtenerConfiguracion($datos, $usuario)
    {
        $query = Doctrine_Query::create()
            ->select("dg.*,(CASE WHEN dgu.idgrafica IS NOT NULL AND idusuario = $usuario THEN 1 ELSE 0 END) as defecto")
            ->from('DatGrafica dg')
            ->leftJoin('dg.DatGraficaUsuario dgu')
            ->where('idgrafica <> 0')->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->orderBy('defecto DESC, idgrafica ASC');
        $filtro = array();
        $filtroValores = array();
        if ($datos['denominacion']) {
            $filtro[] = "denominacion ILIKE '%{$datos['denominacion']}%'";
        }
        if (count($filtro)) {
            $where = implode(' AND ', $filtro);
            $query->addWhere($where, $filtroValores);
        }
        $result['datos'] = $query->limit($datos['limit'])->offset($datos['start'])->execute();
        return $result;
    }

    /**
     *   Devuelve si existe o no una denominación dada.
     *
     * @param string $denominacion Denominación de la configuración.
     * @param bool   $id
     *
     * @return bool, TRUE si existe, FALSE si no existe.
     * @author    : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function existeDenominacion($denominacion, $id = FALSE)
    {
        $query = Doctrine_Query::create();
        $query->from('DatGrafica ')->where("LOWER(denominacion) = LOWER('$denominacion')");
        if (is_numeric($id)) {
            $query->andwhere("idgrafica <> $id");
        }
        $resultado = $query->execute()->count();
        if ($resultado > 0) {
            return TRUE;
        }
        return FALSE;
    }

    /**
     *   Devuelve las condiciones que serán aplicadas en la selección de valores
     * según la configuración dada.
     *
     * @param int   $idtabla       Identificador de la tabla.
     * @param array $configuracion Arreglo con la configuración a graficar.
     * @param array $idestructuras Identificadores de la estructura.
     *
     * @return array, arreglo que contiene las dos condiciones a aplicar.
     * @autor     : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    static function  obtenerCondiciones($idtabla, $configuracion, $idestructuras)
    {
        $where = "1=1";
        $whereGeneral = "1=1";
        $whereConRef = "1=1";
        $flag = FALSE;
        $idConcepto = $configuracion[0];
        foreach ($configuracion as $i => $value) {
            if ($i > 0) {
                self::getWhere(
                    $idtabla, $idestructuras, $value, $idConcepto, $whereGeneral, $where, $whereConRef, $flag
                );
            }
        }
        if ($where != "1=1") { //Caso en el que lleva las 2 condiciones al final
            $whereGeneral .= " AND ";
            $whereGeneral .= $where;
            if ($flag) {
                $whereGeneral .= ")";
            }
        } else {
            if ($flag) { //Caso de que tenga whereGeneral y no tiene where
                $whereGeneral .= ")";
            }
        }
        return array('where' => ($idtabla == 'idnomcargo') ? $where : $whereConRef, 'whereGeneral' => $whereGeneral);
    }

    /**
     *   Devuelve el arreglo de valores a graficar.
     *
     * @param array $condiciones   Arreglo de condiciones a aplicar.
     * @param int   $concepto      Identificador del concepto.
     * @param array $idestructuras Identificadores de la estructura.
     *
     * @return array, arreglo con los valores a graficar.
     * @autor     : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    static function obtenerValores($condiciones, $concepto, $idestructuras)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $whereGeneral = $condiciones['whereGeneral'];
        $where = $condiciones['where'];
        $sql = DatGrafica::obtenerConsultaConcepto($concepto, $where, $whereGeneral, $idestructuras);
        $valores[0] = $concepto;
        $valores[] = $conn->fetchAll($sql);
        return $valores;
    }

    /**
     *   Devuelve la consulta que seleccionará los valores de acuerdo a la restricción.
     *
     * @param int    $concepto      Identficador del concepto.
     * @param string $where         Condición.
     * @param string $whereGeneral  Condición general.
     * @param array  $idestructuras Identificadores de la estructura.
     *
     * @return string, cadena con la consulta a ejecutar.
     * @autor     : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function obtenerConsultaConcepto($concepto, $where, $whereGeneral, $idestructuras)
    {
        $perfil = Util::getPerfilGlobal();
        $dominio = $perfil->iddominio;
        if (count($idestructuras) > 0) {
            $condiciones = DatGrafica::condiciones($idestructuras);
            $limites = DatGrafica::condiciones($idestructuras, 'f');
            $limitesTres = DatGrafica::condiciones($idestructuras, 'f3');
        }
        $where .= $condiciones;
        if ($concepto < 5) {
            $sql = "SELECT distinct UPPER(m.denominacion) as denominacion,
                               CASE
                                WHEN m.abreviatura <> '' THEN m.abreviatura ELSE m.denominacion
                               END AS abreviatura,
                               (SELECT count(dm.denominacion)
                                    FROM mod_estructuracomp.dat_estructura dm
                                    INNER JOIN mod_estructuracomp.nom_filaestruc fila ON(dm.idestructura = fila.idfila)
                                    WHERE LOWER(m.denominacion) = LOWER(dm.denominacion) AND dm.idconcepto = $concepto
                                    AND $where)
                               AS cantidad,
                               (
                                SELECT MIN(f3.nivel)
                                FROM mod_estructuracomp.nom_filaestruc f3
                                INNER JOIN mod_estructuracomp.dat_estructura c3
                                ON c3.idestructura = f3.idfila AND c3.idestado = 0
                                WHERE c3.denominacion ILIKE (m.denominacion)
                                AND f3.fechafin IS NULL AND f3.dominiofila[1]=1::bit
                                AND f3.idconcepto IN (5,6,8) $limitesTres
                               ) AS nivel
                            FROM mod_estructuracomp.dat_estructura m
                            INNER JOIN mod_estructuracomp.nom_filaestruc f on(f.idfila = m.idestructura)
                            WHERE f.fechafin IS NULL AND f.dominiofila [$dominio]=1::bit AND
                                  m.idestado = 0 AND m.idconcepto = $concepto AND $whereGeneral $limites
                            ORDER BY nivel";
        } else {
            if ($concepto == 7) {
                $sql = "SELECT DISTINCT cg.idnomcargo as id,
                                      nc.denominacion,
                                      CASE
                                        WHEN nc.abreviatura <> '' THEN nc.abreviatura ELSE nc.denominacion
                                      END AS abreviatura,
                                      (
                                        SELECT SUM(dm.cantidad)
                                        FROM mod_estructuracomp.dat_cargo dm
                                        INNER JOIN mod_estructuracomp.nom_filaestruc fila on(fila.idfila = dm.idcargo)
                                        LEFT JOIN mod_estructuracomp.dat_cargocivil cc
                                        ON (cc.idcargo = dm.idcargo AND cc.idproyecto = dm.idproyecto)
                                        LEFT JOIN mod_estructuracomp.dat_cargomilitar cm
                                        ON (cm.idcargo = dm.idcargo AND cm.idproyecto = dm.idproyecto)
                                        where fila.fechafin IS NULL AND fila.dominiofila [$dominio]=1::bit AND
                                        dm.idestado = 0 AND dm.idnomcargo = cg.idnomcargo and $where
                                      ) AS cantidad,
                                      (
                                        SELECT SUM(dm.cantidadreal)
                                        FROM mod_estructuracomp.dat_cargo dm
                                        INNER JOIN mod_estructuracomp.nom_filaestruc fila on(fila.idfila = dm.idcargo)
                                        LEFT JOIN mod_estructuracomp.dat_cargocivil cc
                                        ON (cc.idcargo = dm.idcargo AND cc.idproyecto = dm.idproyecto)
                                        LEFT JOIN mod_estructuracomp.dat_cargomilitar cm
                                        ON (cm.idcargo = dm.idcargo AND cm.idproyecto = dm.idproyecto)
                                        where fila.fechafin IS NULL AND fila.dominiofila [$dominio]=1::bit AND
                                        dm.idestado = 0 AND dm.idnomcargo = cg.idnomcargo and $where
                                      ) AS cantidadreal,
                                       (
                                      SELECT MIN(f3.nivel)
                                      FROM mod_estructuracomp.nom_filaestruc f3
                                      INNER JOIN mod_estructuracomp.dat_cargo c3
                                      ON c3.idcargo = f3.idfila AND c3.idestado = 0
                                      WHERE c3.idnomcargo = cg.idnomcargo AND f3.fechafin IS NULL
                                      AND f3.dominiofila[1]=1::bit AND f3.idconcepto = 7 $limitesTres
                                     ) AS nivel
                              FROM mod_estructuracomp.dat_cargo cg
                              INNER JOIN mod_estructuracomp.nom_filaestruc f on(f.idfila = cg.idcargo)
                              INNER JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = cg.idnomcargo)
                              LEFT JOIN mod_estructuracomp.dat_cargocivil cc
                              ON (cc.idcargo = cg.idcargo AND cc.idproyecto = cg.idproyecto)
                              LEFT JOIN mod_estructuracomp.dat_cargomilitar cm
                              ON (cm.idcargo = cg.idcargo AND cm.idproyecto = cg.idproyecto)
                              WHERE f.fechafin IS NULL AND f.dominiofila [$dominio]=1::bit AND
                                  cg.idestado = 0 AND $whereGeneral $limites
                              ORDER BY nivel, denominacion";
            } else {
                if ($concepto == 9) {
                    $sql = "SELECT DISTINCT m.idnommedio as id,
                              ( SELECT SUM(dm.cantidad)
                                    FROM mod_estructuracomp.dat_medio dm
                                    LEFT JOIN mod_estructuracomp.nom_tipomedio tm ON (tm.idtipomedio = dm.idtipomedio)
                                    INNER JOIN mod_estructuracomp.nom_filaestruc fila ON(dm.idmedio = fila.idfila)
                                    WHERE dm.idnommedio = m.idnommedio AND $where) AS cantidad,
                                    (
                                      SELECT MIN(f3.nivel)
                                      FROM mod_estructuracomp.nom_filaestruc f3
                                      INNER JOIN mod_estructuracomp.dat_medio c3
                                      ON c3.idmedio = f3.idfila AND c3.idestado = 0
                                      WHERE c3.idnommedio = m.idnommedio AND f3.fechafin IS NULL
                                      AND f3.dominiofila[1]=1::bit AND f3.idconcepto = 9 $limitesTres
                                     ) AS nivel
                            FROM mod_estructuracomp.dat_medio m
                            INNER JOIN mod_estructuracomp.nom_filaestruc f on(f.idfila = m.idmedio)
                            WHERE f.fechafin IS NULL AND f.dominiofila [$dominio]=1::bit AND
                                  m.idestado = 0 AND  $whereGeneral $limites
                            ORDER BY nivel";
                } else {
                    $sql = "SELECT distinct UPPER(m.denominacion) as denominacion,
                              CASE
                                WHEN m.abreviatura <> '' THEN m.abreviatura ELSE m.denominacion
                               END AS abreviatura,
                              ( SELECT count(dm.denominacion)
                                    FROM mod_estructuracomp.dat_estructuraop dm
                                    INNER JOIN mod_estructuracomp.nom_filaestruc fila ON(dm.idestructuraop = fila
                                    .idfila)
                                    WHERE LOWER(m.denominacion) = LOWER(dm.denominacion) AND dm.idconcepto = $concepto
                                    AND $where)
                               AS cantidad,
                               (
                                SELECT MIN(f3.nivel)
                                FROM mod_estructuracomp.nom_filaestruc f3
                                INNER JOIN mod_estructuracomp.dat_estructuraop c3
                                ON c3.idestructuraop = f3.idfila AND c3.idestado = 0
                                WHERE c3.denominacion ILIKE (m.denominacion) AND f3.fechafin IS NULL
                                AND f3.dominiofila[1]=1::bit AND f3.idconcepto IN (5,6,8) $limitesTres
                               ) AS nivel
                            FROM mod_estructuracomp.dat_estructuraop m
                            INNER JOIN mod_estructuracomp.nom_filaestruc f on(f.idfila = m.idestructuraop)
                            WHERE f.fechafin IS NULL AND f.dominiofila [$dominio]=1::bit AND
                                  m.idestado = 0 AND m.idconcepto = $concepto AND $whereGeneral $limites
                            ORDER BY nivel";
                }
            }
        }
        return $sql;
    }

    /**
     * @param $alias
     * @param $aliasInner
     * @param $tabla
     * @param $campoId
     * @param $valores
     * @param $condiciones
     * @param $dominio
     *
     * @return string
     */
    private function generateSqlBasico($alias, $aliasInner, $tabla, $campoId, $valores, $condiciones, $dominio)
    {
        $sql = " AND $campoId IN (
                            SELECT $campoId from mod_estructuracomp.$tabla $alias
                            INNER JOIN mod_estructuracomp.nom_filaestruc fila on(fila.idfila = $alias.$campoId)
                            WHERE fila.fechafin IS NULL AND fila.dominiofila [$dominio]=1::bit AND
                              $alias.idestado = 0 AND denominacion IN (
                              SELECT $aliasInner.denominacion
                              FROM mod_estructuracomp.$tabla $aliasInner
			                        WHERE $alias.$campoId in($valores)
			                      ) $condiciones";
        return $sql;
    }

    /**
     * @param $alias
     * @param $aliasCC
     * @param $aliasCM
     * @param $valores
     * @param $condiciones
     * @param $dominio
     *
     * @return string
     */
    private function generateSqlCargo($alias, $aliasCC, $aliasCM, $valores, $condiciones, $dominio)
    {
        $sql = " AND $alias.idnomcargo IN (
                            SELECT $alias.idnomcargo from mod_estructuracomp.dat_cargo $alias
                            INNER JOIN  mod_estructuracomp.nom_filaestruc fila ON(fila.idfila = $alias.idcargo)
                            LEFT JOIN mod_estructuracomp.dat_cargocivil $aliasCC
                            ON ($aliasCC.idcargo = $alias.idcargo AND $aliasCC.idproyecto = $alias.idproyecto)
                            LEFT JOIN mod_estructuracomp.dat_cargomilitar $aliasCM
                            ON ($aliasCM.idcargo = $alias.idcargo AND $aliasCM.idproyecto = $alias.idproyecto)
                            WHERE fila.fechafin IS NULL AND fila.dominiofila [$dominio]=1::bit AND
                              $alias.idestado = 0 AND $alias.idnomcargo IN ($valores) $condiciones";
        return $sql;
    }

    /**
     * @param $alias
     * @param $valores
     * @param $condiciones
     * @param $dominio
     *
     * @return string
     */
    private function generateSqlMedio($alias, $valores, $condiciones, $dominio)
    {
        $sql = " AND m.idnommedio IN (
                            SELECT idnommedio from mod_estructuracomp.dat_medio $alias
                            INNER JOIN mod_estructuracomp.nom_filaestruc fila ON (fila.idfila = $alias.idmedio)
                            WHERE fila.fechafin IS NULL AND fila.dominiofila [$dominio]=1::bit AND
                                $alias.idestado = 0 AND $alias.idnommedio IN($valores) $condiciones";
        return $sql;
    }

    /**
     *   Devuelve la restricción de la estructura para el concepto a graficar
     *
     * @param int   $concepto      Identficador del concepto.
     * @param array $idestructuras Identificadores de la estructura.
     * @param array $valores       Identificadores de los valores de la propiedad.
     *
     * @return string, cadena con la restricción.
     * @autor     : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function construirWhereGeneral($concepto, $idestructuras, $valores)
    {
        $perfil = Util::getPerfilGlobal();
        $dominio = $perfil->iddominio;
        if (count($idestructuras)) {
            $condiciones = DatGrafica::condiciones($idestructuras);
        } else {
            $condiciones = '';
        }
        if ($concepto == 9) {
            $sql = self::generateSqlMedio('dam', $valores, $condiciones, $dominio);
        } else {
            if ($concepto == 7) {
                $sql = self::generateSqlCargo('cg', 'cc', 'cm', $valores, $condiciones, $dominio);
            } else {
                if ($concepto < 5) {
                    $clase = 'dat_estructura';
                    $id = 'idestructura';
                } else {
                    $clase = 'dat_estructuraop';
                    $id = 'idestructuraop';
                }
                $sql = self::generateSqlBasico('dm', 'de', $clase, $id, $valores, $condiciones, $dominio);
            }
        }
        return $sql;
    }

    /**
     *   Devuelve las condiciones según los padres seleccionados.
     *
     * @param array  $idestructuras Identificadores de la estructura.
     * @param string $alias         .
     *
     * @return string, cadena con la restricción.
     * @author     : Ing. Pedro Alberto Jiménez
     * @copyright  Copyright (c) 2013 xetid
     */
    function condiciones($idestructuras, $alias = 'fila')
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $idestructuras = implode(',', $idestructuras);
        $sql = "SELECT fila.parent_path
                FROM mod_estructuracomp.nom_filaestruc fila
                WHERE fila.fechafin IS NULL AND fila.idfila in($idestructuras)";
        $sqlResult = $conn->fetchAll($sql);
        $contador = count($sqlResult);
        $condiciones = DatGrafica::dameStringCondiciones($contador, $sqlResult, $alias);
        return $condiciones;
    }

    /**
     *   Devuelve una cadena con las condiciones según los padres seleccionados.
     *
     * @param int    $contador  Cantidad de condiciones a crear.
     * @param array  $sqlResult Valores izquierdo y derecho de cada padre.
     * @param string $alias     .
     *
     * @return string, cadena con la restricción.
     * @author     : Ing. Pedro Alberto Jiménez
     * @copyright  Copyright (c) 2013 xetid
     */
    function dameStringCondiciones($contador, $sqlResult, $alias = 'fila')
    {
        $condiciones = '';
        if ($contador > 0) {
            $parent_path = $sqlResult[0]['parent_path'];
            if ($contador == 1) {
                $condiciones .= " AND ($alias.parent_path operator (public.<@) '$parent_path')";
            }
            if ($contador > 1) {
                $condiciones .= " AND ($alias.parent_path operator (public.<@) '$parent_path')";
                for ($i = 1; $i < $contador; $i++) {
                    if ($i < $contador - 1) {
                        $condiciones .= " OR ($alias.parent_path operator (public.<@) '$parent_path')";
                    } else {
                        $condiciones .= " OR ($alias.parent_path operator (public.<@) '$parent_path'))";
                    }
                }
            }
        }
        return $condiciones;
    }

    /**
     *   Devuelve un arreglo con los identificadores de los valores que persisten en la
     * estructura de acuerdo a una configuración dada.
     *
     * @param int   $idconcepto          Identificador del concepto.
     * @param int   $idconceptopropiedad Identificador de la relación entre el concepto y la propiedad.
     * @param array $idvalores           Valores asociados a la propiedad.
     *
     * @return array, arreglo de valores.
     * @author     : Ing. Pedro Alberto Jiménez
     * @copyright  Copyright (c) 2013 xetid
     */
    function valoresActuales($idconcepto, $idconceptopropiedad, $idvalores)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $info = NomConceptoPropiedadModel::buscarConceptoPropiedad($idconceptopropiedad);
        $tabla = $info['referencia'];
        $id = $info['identificador'];
        $whereInner = NomConceptoPropiedadModel::getCondValuesByPro($idconceptopropiedad, $id, $idvalores, $idconcepto);
        $where = $whereInner['where'];
        $inner = $whereInner['inner'];
        $sql = "select distinct p.$id as text from mod_estructuracomp.$tabla p $inner
            where $where";
        $data = $conn->fetchAll($sql);
        return $data;
    }

    /**
     *   Devuelve un arreglo agrupado por denominacion, es una funcionalidad auxiliar de la función
     * mostrarEstructuras() que se encuentra en EstructuraModel.
     *
     * @param array $resultado Información a mostrar.
     *
     * @return string, cadena con la restricción.
     * @author     : Ing. Pedro Alberto Jiménez
     * @copyright  Copyright (c) 2013 xetid
     */
    function validarDenominaciones($resultado)
    {
        $result = array();
        //Validar que las denominaciones que se repitan se envien una sola vez
        foreach ($resultado as $index => $value) {
            if (count($result) > 0) {
                $flag = FALSE;
                foreach ($result as $i => $value) {
                    if ($result[$i]['denominacion'] == $resultado[$index]['denominacion']) {
                        $flag = TRUE;
                    }
                }
                if (!$flag) {
                    $result[] = $value;
                }
            } else {
                $result[0] = $value;
            }
        }
        return $result;
    }

    /**
     * @param $idtabla
     * @param $idestructuras
     * @param $value
     * @param $idConcepto
     * @param $whereGeneral
     * @param $where
     * @param $whereConRef
     * @param $flag
     */
    private static function getWhere(
        $idtabla, $idestructuras, $value, $idConcepto, &$whereGeneral, &$where, &$whereConRef, &$flag
    )
    {
        $idConceptoPropiedad = $value[0];
        $valores = $value[1];
        $valores = implode(',', $valores);
        $campos = NomConceptoPropiedadModel::buscarConceptoPropiedad($idConceptoPropiedad);
        $cmp = $campos['identificador'];
        if ($cmp == 'idmedio') {
            $cmp = 'idnommedio';
        }
        if ($cmp == $idtabla) {
            $whereGeneral .= DatGrafica::construirWhereGeneral($idConcepto, $idestructuras, $valores);
            $flag = TRUE;
        } else {
            $aux = "dm";
            $where .= " AND $cmp IN ($valores)";
            $whereConRef .= " AND $aux.$cmp IN ($valores)";
        }
    }
}