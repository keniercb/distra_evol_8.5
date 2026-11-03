<?php

/**
 * Created by PhpStorm.
 * User: madrid
 * Date: 15/01/2016
 * Time: 10:49
 */
class ControlejecucionplanifModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    //Lista los niveles de actividad mayores que cero dada una entidad y un ejercicio
    public function listarNivelesAct($params) {
        $condiciones = array();
        $arraysalida = array_filter($params['id_especialidades']);
        if (empty($arraysalida)) {
            return -1;
        }
        $strEntidades = implode(',', $params['entidades']);
        $strEspecialidades = implode(',', $arraysalida);
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condic[] = "a.codigo LIKE '" . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condic[] = "upper(a.denominacion) LIKE  " . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    } else {
                        if ($datos['field'] == 'nivelactividadfinal') {
                            $sqlNNA = " SUM(x.nivelactividadfinal)";
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlNNA = $sqlNNA . "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlNNA = $sqlNNA . ">";
                                } else {
                                    $sqlNNA = $sqlNNA . "=";
                                }
                            }
                            $condiciones[] = $sqlNNA
                                    . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'nivelactvreal') {
                                $sqlNNA = " SUM(x.nivelactvreal)";
                                if ($datos['data']['comparison'] == 'lt') {
                                    $sqlNNA = $sqlNNA . "<";
                                } else {
                                    if ($datos['data']['comparison'] == 'gt') {
                                        $sqlNNA = $sqlNNA . ">";
                                    } else {
                                        $sqlNNA = $sqlNNA . "=";
                                    }
                                }
                                $condiciones[] = $sqlNNA
                                        . $datos['data']['value'];
                            } else {
                                if ($datos['field'] == 'pendiente') {
                                    $sqlNNA = "COALESCE((SUM(x.nivelactividadfinal) - COALESCE(SUM(x.nivelactvreal),0)),0)";
                                    if ($datos['data']['comparison'] == 'lt') {
                                        $sqlNNA = $sqlNNA . "<";
                                    } else {
                                        if ($datos['data']['comparison'] == 'gt'
                                        ) {
                                            $sqlNNA = $sqlNNA . ">";
                                        } else {
                                            $sqlNNA = $sqlNNA . "=";
                                        }
                                    }
                                    $condiciones[] = $sqlNNA
                                            . $datos['data']['value'];
                                }
                            }
                        }
                    }
                }
            }
        }
        $Having = "";
        foreach ($condiciones as $condicion) {
            if ($Having == "") {
                $Having = 'AND ' . $condicion;
            } else {
                $Having = $Having . " AND " . $condicion;
            }
        }

        $WHERE = "";

        foreach ($condic as $co) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $co;
            } else {
                $WHERE = $WHERE . " AND " . $co;
            }
        }

        if (!$params['start']) {
            $params['start'] = 0;
        }
        if (!$params['limit']) {
            $params['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$params['start']}
                          LIMIT  {$params['limit']}";
        $data = DatControlejecucionnivelactividad::listarNivelesAct(
                        $params, $strEspecialidades, $strEntidades, $WHERE, $offsetLimit, $Having
        );
        return $data;
    }

    //Lista los indicadores con cantidad mayor que cero dada una entidad, un plan y un ejercicio
    public function listarIndEjec($parametros) {
        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {

                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " ind.codigo LIKE '"
                            . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(ind.denominacion) LIKE  "
                                . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    } else {
                        if ($datos['field'] == 'cantfinal') {
                            $sqlNNA = "(p.cantidad + p.ajuste) ";
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlNNA = $sqlNNA . "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlNNA = $sqlNNA . ">";
                                } else {
                                    $sqlNNA = $sqlNNA . "=";
                                }
                            }
                            $condiciones[] = $sqlNNA . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'cantreal') {
                                $sqlNNA = " COALESCE (v.cantreal,0)";
                                if ($datos['data']['comparison'] == 'lt') {
                                    $sqlNNA = $sqlNNA . "<";
                                } else {
                                    if ($datos['data']['comparison'] == 'gt') {
                                        $sqlNNA = $sqlNNA . ">";
                                    } else {
                                        $sqlNNA = $sqlNNA . "=";
                                    }
                                }
                                $condiciones[] = $sqlNNA
                                        . $datos['data']['value'];
                            } else {
                                if ($datos['field'] == 'pendiente') {
                                    $sqlNNA = " ((p.cantidad + p.ajuste) - COALESCE (v.cantreal,0))";
                                    if ($datos['data']['comparison'] == 'lt') {
                                        $sqlNNA = $sqlNNA . "<";
                                    } else {
                                        if ($datos['data']['comparison'] == 'gt'
                                        ) {
                                            $sqlNNA = $sqlNNA . ">";
                                        } else {
                                            $sqlNNA = $sqlNNA . "=";
                                        }
                                    }
                                    $condiciones[] = $sqlNNA
                                            . $datos['data']['value'];
                                } else {
                                    if ($datos['field'] == 'umedida') {
                                        $condiciones[] = " p.idunidadmedida = "
                                                . $datos['data']['value'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";



        if ($parametros['glob'] == 'false' || $parametros['hoja']) {

            $data = DatControlejecucionplan::listarIndEjec(
                            $parametros, $WHERE, $offsetLimit
            );
        } else {
            $data = DatControlejecucionplan::listarIndEjecCons(
                            $parametros, $WHERE, $offsetLimit
            );
        }
        return $data;
    }

    //Lista la cantidad real de la ejecución dado un idplanificación
    public function listarEjecucionPlan($parametros) {

        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'cantidadreal') {
                    $sqlNNA = " cantidadreal";
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlNNA = $sqlNNA . "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlNNA = $sqlNNA . ">";
                        } else {
                            $sqlNNA = $sqlNNA . "=";
                        }
                    }
                    $condiciones[] = $sqlNNA . $datos['data']['value'];
                } else {
                    if ($datos['field'] == 'fechareal') {
                        if ($datos['data']['comparison'] == 'gt'
                        ) {
                            $fecha = (date_format(
                                            date_create($datos['data']['value']), 'd/m/Y'
                            ));
                            $condiciones[] = "   fechareal > '"
                                    . $fecha . "'";
                        }
                        if ($datos['data']['comparison'] == 'lt'
                        ) {
                            $fecha = (date_format(
                                            date_create($datos['data']['value']), 'd/m/Y'
                            ));
                            $condiciones[] = "   fechareal <  '"
                                    . $fecha
                                    . "'";
                        }
                        if ($datos['data']['comparison'] == 'eq'
                        ) {
                            $fecha = (date_format(
                                            date_create($datos['data']['value']), 'd/m/Y'
                            ));
                            $condiciones[] = "   fechareal = '"
                                    . $fecha
                                    . "'";
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";
        $data = DatControlejecucionplan::listarEjecucionPlan(
                        $parametros, $offsetLimit, $WHERE
        );
        return $data;
    }

    //Lista la cantidad real de la ejecución dado un idactividadentidad
    public function listarEjecucionNiveles($parametros) {
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";

        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'nivelactividadreal') {
                    $sqlNNA = " COALESCE (nivelactividadreal,0)";
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlNNA = $sqlNNA . "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlNNA = $sqlNNA . ">";
                        } else {
                            $sqlNNA = $sqlNNA . "=";
                        }
                    }
                    $condiciones[] = $sqlNNA
                            . $datos['data']['value'];
                } else {
                    if ($datos['field'] == 'fechareal') {
                        if ($datos['data']['comparison'] == 'gt'
                        ) {
                            $fecha = (date_format(
                                            date_create($datos['data']['value']), 'd/m/Y'
                            ));
                            $condiciones[] = "   fechareal > '"
                                    . $fecha . "'";
                        }
                        if ($datos['data']['comparison'] == 'lt'
                        ) {
                            $fecha = (date_format(
                                            date_create($datos['data']['value']), 'd/m/Y'
                            ));
                            $condiciones[] = "   fechareal <  '"
                                    . $fecha
                                    . "'";
                        }
                        if ($datos['data']['comparison'] == 'eq'
                        ) {
                            $fecha = (date_format(
                                            date_create($datos['data']['value']), 'd/m/Y'
                            ));
                            $condiciones[] = "   fechareal = '"
                                    . $fecha
                                    . "'";
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }

        $data = DatControlejecucionnivelactividad::listarEjecucionNiveles(
                        $parametros, $offsetLimit, $WHERE
        );
        return $data;
    }

    //Lista la desviación de la ejecución dado un idplanificación
    public function listarDesvPlan($parametros) {
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";

        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " ind.codigo LIKE '"
                            . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(ind.denominacion) LIKE  "
                                . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    } else {
                        if ($datos['field'] == 'cantidadreal') {
                            $sqlNNA = " COALESCE (cantidadreal,0)";
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlNNA = $sqlNNA . "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlNNA = $sqlNNA . ">";
                                } else {
                                    $sqlNNA = $sqlNNA . "=";
                                }
                            }
                            $condiciones[] = $sqlNNA
                                    . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'umedida') {
                                $condiciones[] = " ind.idumedida = "
                                        . $datos['data']['value'];
                            } else {
                                if ($datos['field'] == 'fechareal') {
                                    if ($datos['data']['comparison'] == 'gt'
                                    ) {
                                        $fecha = (date_format(
                                                        date_create(
                                                                $datos['data']['value']
                                                        ), 'd/m/Y'
                                        ));
                                        $condiciones[] = "   fechareal > '"
                                                . $fecha . "'";
                                    }
                                    if ($datos['data']['comparison'] == 'lt'
                                    ) {
                                        $fecha = (date_format(
                                                        date_create(
                                                                $datos['data']['value']
                                                        ), 'd/m/Y'
                                        ));
                                        $condiciones[] = "   fechareal <  '"
                                                . $fecha
                                                . "'";
                                    }
                                    if ($datos['data']['comparison'] == 'eq'
                                    ) {
                                        $fecha = (date_format(
                                                        date_create(
                                                                $datos['data']['value']
                                                        ), 'd/m/Y'
                                        ));
                                        $condiciones[] = "   fechareal = '"
                                                . $fecha
                                                . "'";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $data = DatDesviacionplan::listarDesvPlan(
                        $parametros, $offsetLimit, $WHERE
        );
        return $data;
    }

    //Lista la desviación real de la ejecución dado un idactividadentidad
    public function listarDesvNiveles($parametros) {
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";

        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " a.codigo LIKE '"
                            . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(a.denominacion) LIKE  " . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    } else {
                        if ($datos['field'] == 'nivelactividadrealxdesviacion'
                        ) {
                            $sqlNNA = " COALESCE (dniv.nivelactividadrealxdesviacion,0)";
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlNNA = $sqlNNA . "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlNNA = $sqlNNA . ">";
                                } else {
                                    $sqlNNA = $sqlNNA . "=";
                                }
                            }
                            $condiciones[] = $sqlNNA
                                    . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'fechareal') {
                                if ($datos['data']['comparison'] == 'gt'
                                ) {
                                    $fecha = (date_format(
                                                    date_create($datos['data']['value']), 'd/m/Y'
                                    ));
                                    $condiciones[] = "   dniv.fechareal > '"
                                            . $fecha . "'";
                                }
                                if ($datos['data']['comparison'] == 'lt'
                                ) {
                                    $fecha = (date_format(
                                                    date_create($datos['data']['value']), 'd/m/Y'
                                    ));
                                    $condiciones[] = "   dniv.fechareal <  '"
                                            . $fecha
                                            . "'";
                                }
                                if ($datos['data']['comparison'] == 'eq'
                                ) {
                                    $fecha = (date_format(
                                                    date_create($datos['data']['value']), 'd/m/Y'
                                    ));
                                    $condiciones[] = "   dniv.fechareal = '"
                                            . $fecha
                                            . "'";
                                }
                            }
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $data = DatDesviacionnivelactividad::listarDesvNiveles(
                        $parametros, $offsetLimit, $WHERE
        );
        return $data;
    }

    //Inserta la cantidad real de la ejecución dado un idplanificación
    public function insertarEjecPlan($params) {
        return DatControlejecucionplan::insertarEjecPlan($params);
    }

    //Inserta la cantidad real de la ejecución dado un idactividadentidad
    public function insertarEjecNiv($params) {
        return DatControlejecucionnivelactividad::insertarEjecNiv($params);
    }

    //Inserta la desviación de la ejecución dado un idplanificación
    public function insertarDesvPlanSust($params) {
        $params['iddesviacionplan'] = DatDesviacionplan::insertarDesvPlan(
                        $params
        );

        foreach ($params['ejec'] as $ejec) {
            if ($ejec->idplanificacion != null) {
                DatDesviacionplan::insertarDesvPlanPorSust($params);
            }
        }
        return true;
    }

    //Inserta la desviación de la ejecución dado un idactividadentidad
    public function insertarDesvNiv($params) {
        $params['iddesviacionnivelactividad'] = DatDesviacionnivelactividad::insertarDesvNiv($params);

        foreach ($params['ejec'] as $ejec) {
            if ($ejec->iddesviacionnivelactividad == null && $ejec->adicion == null
            ) {
                DatDesviacionnivelactividad::insertarDesvXSustNiv($params);
            }
        }
        return true;
    }

    //Lista la adicion en actividades
    public function listarAdicNivelesModel($parametros) {
        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " a.codigo LIKE '"
                            . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(a.denominacion) LIKE  " . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    } else {
                        if ($datos['field'] == 'nivelactividadrealxdesviacion'
                        ) {
                            $sqlNNA = " COALESCE (dniv.nivelactividadrealxdesviacion,0)";
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlNNA = $sqlNNA . "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlNNA = $sqlNNA . ">";
                                } else {
                                    $sqlNNA = $sqlNNA . "=";
                                }
                            }
                            $condiciones[] = $sqlNNA
                                    . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'fechareal') {
                                if ($datos['data']['comparison'] == 'gt'
                                ) {
                                    $fecha = (date_format(
                                                    date_create($datos['data']['value']), 'd/m/Y'
                                    ));
                                    $condiciones[] = "   dniv.fechareal > '"
                                            . $fecha . "'";
                                }
                                if ($datos['data']['comparison'] == 'lt'
                                ) {
                                    $fecha = (date_format(
                                                    date_create($datos['data']['value']), 'd/m/Y'
                                    ));
                                    $condiciones[] = "   dniv.fechareal <  '"
                                            . $fecha
                                            . "'";
                                }
                                if ($datos['data']['comparison'] == 'eq'
                                ) {
                                    $fecha = (date_format(
                                                    date_create($datos['data']['value']), 'd/m/Y'
                                    ));
                                    $condiciones[] = "   dniv.fechareal = '"
                                            . $fecha
                                            . "'";
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";

        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }


        return DatDesviacionnivelactividad::listarAdicNiveles(
                        $parametros, $offsetLimit, $WHERE
        );
    }

    //Lista los indicadores para adicionar una desviacion por adicion
    public function listarIndAddDesviacionAdicion($parametros) {
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";

        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " ind.codigo LIKE '"
                            . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(ind.denominacion) LIKE  "
                                . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $data = DatDesviacionplan::listarIndAddDesviacionAdicion(
                        $parametros, $WHERE, $offsetLimit
        );
        return $data;
    }

    //Lista los indicadores para adicionar una desviacion
    public function listarIndAddDesviacion($parametros) {
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";

        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " codigo LIKE '" . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(denominacion) LIKE  " . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    } else {
                        if ($datos['field'] == 'umedida') {
                            $condiciones[] = " idumedida = "
                                    . $datos['data']['value'];
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $data = DatDesviacionplan::listarIndAddDesviacion(
                        $parametros, $WHERE, $offsetLimit
        );
        return $data;
    }

    //Listar las desviaciones por adicion
    public function listarDesvAdicionesPlan($parametros) {
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";

        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " ind.codigo LIKE '"
                            . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(ind.denominacion) LIKE  "
                                . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    } else {
                        if ($datos['field'] == 'cantidadreal') {
                            $sqlNNA = " COALESCE (cantidadreal,0)";
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlNNA = $sqlNNA . "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlNNA = $sqlNNA . ">";
                                } else {
                                    $sqlNNA = $sqlNNA . "=";
                                }
                            }
                            $condiciones[] = $sqlNNA
                                    . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'umedida') {
                                $condiciones[] = " ind.idumedida = "
                                        . $datos['data']['value'];
                            } else {
                                if ($datos['field'] == 'fechareal') {
                                    if ($datos['data']['comparison'] == 'gt'
                                    ) {
                                        $fecha = (date_format(
                                                        date_create(
                                                                $datos['data']['value']
                                                        ), 'd/m/Y'
                                        ));
                                        $condiciones[] = "   fechareal > '"
                                                . $fecha . "'";
                                    }
                                    if ($datos['data']['comparison'] == 'lt'
                                    ) {
                                        $fecha = (date_format(
                                                        date_create(
                                                                $datos['data']['value']
                                                        ), 'd/m/Y'
                                        ));
                                        $condiciones[] = "   fechareal <  '"
                                                . $fecha
                                                . "'";
                                    }
                                    if ($datos['data']['comparison'] == 'eq'
                                    ) {
                                        $fecha = (date_format(
                                                        date_create(
                                                                $datos['data']['value']
                                                        ), 'd/m/Y'
                                        ));
                                        $condiciones[] = "   fechareal = '"
                                                . $fecha
                                                . "'";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $data = DatDesviacionplan::listarDesvAdicionesPlan(
                        $parametros, $offsetLimit, $WHERE
        );
        return $data;
    }

    //Lista las actividades para adicionar una desviacion
    public function listarActAddDesviacionModel($parametros
    ) {
        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " na.codigo LIKE '"
                            . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(na.denominacion) LIKE  " . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    }
                }
            }
        }

        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }


        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";

        return DatDesviacionnivelactividad::listarActAddDesviacion(
                        $parametros, $offsetLimit, $WHERE
        );
    }

}
