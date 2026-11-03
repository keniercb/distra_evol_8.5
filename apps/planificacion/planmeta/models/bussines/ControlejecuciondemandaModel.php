<?php

/**
 * Created by PhpStorm.
 * User: madrid
 * Date: 15/01/2016
 * Time: 10:49
 */
class ControlejecuciondemandaModel extends ZendExt_Model {

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
        $data = DatControlejecucionnivelactividadDemanda::listarNivelesAct(
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

        $data = DatControlejecucionplanDemanda::listarIndEjec(
                        $parametros, $WHERE, $offsetLimit
        );


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
        $data = DatControlejecucionplanDemanda::listarEjecucionPlan(
                        $parametros, $offsetLimit, $WHERE
        );
        return $data;
    }

    public function listarEjecucionAdicion($parametros) {

        $condiciones = array();
        $WHERE = "";
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";
        $data = DatControlejecucionplanDemanda::listarEjecucionAdicion(
                        $parametros, $offsetLimit, $WHERE
        );
        return $data;
    }

    public function listarEjecucionDesviacion($parametros) {

        $condiciones = array();
        $WHERE = "";
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";
        $data = DatControlejecucionplanDemanda::listarEjecucionDesviacion(
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

        $data = DatControlejecucionnivelactividadDemanda::listarEjecucionNiveles(
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
        $data = DatDesviacionplanDemanda::listarDesvPlan(
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
        $data = DatDesviacionnivelactividadDemanda::listarDesvNiveles(
                        $parametros, $offsetLimit, $WHERE
        );
        return $data;
    }

    //Inserta la cantidad real de la ejecución dado un idplanificación
    public function insertarEjecPlan($params) {
        return DatControlejecucionplanDemanda::insertarEjecPlan($params);
    }

    public function insertarEjecfueradePlanyDesv($params) {
        return DatControlejecucionplanDemanda::insertarEjecfueradePlanyDesv($params);
    }

    public function insertarFueradePlan($params) {
        return DatControlejecucionplanDemanda::insertarFueradePlan($params);
    }

    public function insertarContratacion($params) {
        return DatContrataciondemanda::insertarContratacion($params);
    }

    //Inserta la cantidad real de la ejecución dado un idactividadentidad
    public function insertarEjecNiv($params) {
        return DatControlejecucionnivelactividadDemanda::insertarEjecNiv($params);
    }

    //Inserta la desviación de la ejecución dado un idplanificación
    public function insertarDesvPlanSust($params) {
        $params['iddesviacionplandemanda'] = DatDesviacionplanDemanda::insertarDesvPlan(
                        $params
        );

        foreach ($params['ejec'] as $ejec) {
            if ($ejec->idplanificacion != null) {
                DatDesviacionplanDemanda::insertarDesvPlanPorSust($params);
            }
        }
        return true;
    }

    //Inserta la desviación de la ejecución dado un idactividadentidad
    public function insertarDesvNiv($params) {
        $params['iddesviacionnivelactividaddemanda'] = DatDesviacionnivelactividadDemanda::insertarDesvNiv($params);

        foreach ($params['ejec'] as $ejec) {
            if ($ejec->iddesviacionnivelactividaddemanda == null && $ejec->adicion == null
            ) {
                DatDesviacionnivelactividadDemanda::insertarDesvXSustNiv($params);
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


        return DatDesviacionnivelactividadDemanda::listarAdicNiveles(
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
        $data = DatDesviacionplanDemanda::listarIndAddDesviacionAdicion(
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
        $data = DatDesviacionplanDemanda::listarIndAddDesviacion(
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

        $data = DatDesviacionplanDemanda::listarDesvAdicionesPlan(
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

        return DatDesviacionnivelactividadDemanda::listarActAddDesviacion(
                        $parametros, $offsetLimit, $WHERE
        );
    }

    //Gráfica ejecución global x entidad
    public function graficaEjecucionglobalxentidad($params) {
        if ($params['tipo'] == 'plan') {
            return DatControlejecucionplanDemanda::graficaEjecucionglobalxentidad(
                            $params
            );
        } else {
            if ($params['tipo'] == 'activ') {
                return DatControlejecucionnivelactividadDemanda::graficaEjecucionglobalxentidadAct(
                                $params
                );
            }
        }
    }

    //Gráfica ejecución global x entidad (Ingreso/Gasto)
    public function graficaEjecucionglobalxentidadIngresoGasto($params) {
        return DatControlejecucionplanDemanda::graficaEjecucionglobalxentidadIngresoGasto(
                        $params
        );
    }

    //Gráfica ejecución global x entidad x plan
    public function graficaEjecucionglobalxentidadxplan($params) {
        return DatControlejecucionplanDemanda::graficaEjecucionglobalxentidadxplan(
                        $params
        );
    }

    //Gráfica ejecución global x entidad x clasificación del plan
    public function graficaEjecucionglobalxentidadxClasifplan($params) {
        $dat = DatControlejecucionplanDemanda::graficaEjecucionglobalxentidadxClasifplan(
                        $params
        );

        foreach ($dat as $key => $value) {
            $categorias[$key] = $value['plan'];
            $importeplan[$key] = (double) $value['importeplan'];
            $importeejecutado[$key] = (double) $value['importeejecutado'];
            $importesustitucion[$key] = (double) $value['importesustitucion'];
            $importeadicion[$key] = (double) $value['importeadicion'];
            $importetotalejecutado[$key] = (double) $value['importetotalejecutado'];
        }

        $dataPlanificado = Array(
            "name" => 'Planificado',
            "type" => 'column',
            "data" => $importeplan
        );
        $dataEjec = Array(
            "name" => 'Ejecutado por plan',
            "type" => 'column',
            "data" => $importeejecutado
        );
        $dataSust = Array(
            "name" => 'Ejecutado por sustitución',
            "type" => 'column',
            "data" => $importesustitucion
        );
        $dataAdicion = Array(
            "name" => 'Ejecutado por adición',
            "type" => 'column',
            "data" => $importeadicion
        );

        $datat = Array(
            "type" => 'spline',
            "name" => 'Total ejecutado',
            "data" => $importetotalejecutado
        );
        $series = Array($dataPlanificado, $dataEjec, $dataSust, $dataAdicion,
            $datat);

        $result = Array($series, $categorias);
        return $result;
    }

    //Gráfica ejecución x entidad x trimestres
    public function graficaEjecucionglobalxentidadxtrimestre($params) {
        if ($params['tipo'] == 'plan') {
            $dat[0] = DatControlejecucionplanDemanda::graficaEjecucionglobalxentidadejecutadoxtrimestre(
                            $params
            );
            $dat[1] = DatControlejecucionplanDemanda::graficaEjecucionglobalxentidadadicionadoxtrimestre(
                            $params
            );
            $dat[2] = DatControlejecucionplanDemanda::graficaEjecucionglobalxentidadsustituirxtrimestre(
                            $params
            );
        } else {
            if ($params['tipo'] == 'activ') {
                $dat[0] = DatControlejecucionnivelactividadDemanda::graficaEjecucionglobalxentidadejecutadoxtrimestreAct(
                                $params
                );


                $dat[1] = DatControlejecucionnivelactividadDemanda::graficaEjecucionglobalxentidadadicionadoxtrimestreAct(
                                $params
                );
                $dat[2] = DatControlejecucionnivelactividadDemanda::graficaEjecucionglobalxentidadsustituirxtrimestreAct(
                                $params
                );
            }
        }

        $categorias[0] = 'Trimestre I';
        $categorias[1] = 'Trimestre II';
        $categorias[2] = 'Trimestre III';
        $categorias[3] = 'Trimestre IV';

        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre1'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre2'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre3'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre4'];

        $adicion[] = (double) $dat[1][0]['adiciontrimestre1'];
        $adicion[] = (double) $dat[1][0]['adiciontrimestre2'];
        $adicion[] = (double) $dat[1][0]['adiciontrimestre3'];
        $adicion[] = (double) $dat[1][0]['adiciontrimestre4'];

        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre1'];
        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre2'];
        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre3'];
        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre54'];

        $total[] = (double) ($importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $total[] = (double) ($importeejecutado[1] + $adicion[1] + $sustitucion[1] +
                $importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $total[] = (double) ($importeejecutado[2] + $adicion[2] + $sustitucion[2] +
                $importeejecutado[1] + $adicion[1] + $sustitucion[1] +
                $importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $total[] = (double) ($importeejecutado[3] + $adicion[3] + $sustitucion[3] +
                $importeejecutado[2] + $adicion[2] + $sustitucion[2] +
                $importeejecutado[1] + $adicion[1] + $sustitucion[1] +
                $importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $data = Array(
            array(
                "name" => 'Ejecutado',
                "data" => $importeejecutado
            ), array(
                "name" => 'Adición',
                "data" => $adicion
            ), array(
                "name" => 'Sustitución',
                "data" => $sustitucion
            ), array(
                "name" => 'Total',
                "data" => $total
            )
        );

        $result = Array($data, $categorias);

        return $result;
    }

    //Gráfica ejecución x entidad x vías de adquisición
    public function graficaEjecucionglobalxentidadxVA($params) {
        if ($params['tipo'] == 'plan') {
            $dat = DatControlejecucionplanDemanda::graficaEjecucionglobalxentidadxVA(
                            $params
            );
            $acum = 0;
            foreach ($dat as $key => $value) {
                $categorias[$key] = $value['viaadquisicion'];
                $importeplan[$key] = (double) $value['importeplan'];
                $importeejecutado[$key] = (double) $value['importeejecutado'];
                $importesustitucion[$key] = (double) $value['importesustitucion'];
                $importeadicion[$key] = (double) $value['importeadicion'];
                $importetotalejecutado[$key] = (double) $value['importetotalejecutado'];
                $acum += (double) $value['importetotalejecutado'];
                $importetotalejecutadoacum[$key] = (double) $acum;
            }
        } else {
            if ($params['tipo'] == 'activ') {
                $dat = DatControlejecucionnivelactividadDemanda::graficaEjecucionglobalxentidadxAct(
                                $params
                );
                foreach ($dat as $key => $value) {
                    $categorias[$key] = $value['denominacion'];
                    $importeplan[$key] = (double) $value['nivel'];
                    $importeejecutado[$key] = (double) $value['nivelejecutado'];
                    $importesustitucion[$key] = (double) $value['sustitucion'];
                    $importeadicion[$key] = (double) $value['adicion'];
                    $importetotalejecutado[$key] = (double) $value['totalejecutado'];
                }
            }
        }
        $dataPlanificado = Array(
            "name" => 'Planificado',
            "type" => 'column',
            "data" => $importeplan
        );
        $dataEjec = Array(
            "name" => 'Ejecutado por plan',
            "type" => 'column',
            "data" => $importeejecutado
        );
        $dataSust = Array(
            "name" => 'Ejecutado por sustitución',
            "type" => 'column',
            "data" => $importesustitucion
        );
        $dataAdicion = Array(
            "name" => 'Ejecutado por adición',
            "type" => 'column',
            "data" => $importeadicion
        );

        $datat = Array(
            "type" => 'spline',
            "name" => 'Total ejecutado',
            "data" => $importetotalejecutado
        );
        if ($params['tipo'] == 'plan') {

            $dataacum = Array(
                "type" => 'spline',
                "name" => 'Total ejecutado acumulado',
                "data" => $importetotalejecutadoacum
            );
            $series = Array($dataPlanificado, $dataEjec, $dataSust,
                $dataAdicion, $datat, $dataacum);
        } else {
            if ($params['tipo'] == 'activ') {
                $series = Array($dataPlanificado, $dataEjec, $dataSust,
                    $dataAdicion, $datat);
            }
        }

        $result = Array($series, $categorias);
        return $result;
    }

    //Gráfica ejecución x entidad x meses
    public function graficaEjecucionglobalxentidadxmeses($params) {
        if ($params['tipo'] == 'plan') {
            $dat[0] = DatControlejecucionplanDemanda::graficaEjecucionglobalxentidadejecutadoxmeses(
                            $params
            );

            $dat[1] = DatControlejecucionplanDemanda::graficaEjecucionglobalxentidadadicionadoxmeses(
                            $params
            );
            $dat[2] = DatControlejecucionplanDemanda::graficaEjecucionglobalxentidadsustituirxmeses(
                            $params
            );
        } else {
            if ($params['tipo'] == 'activ') {
                $dat[0] = DatControlejecucionnivelactividadDemanda::graficaEjecucionglobalxentidadejecutadoxmesesAct(
                                $params
                );

                $dat[1] = DatControlejecucionnivelactividadDemanda::graficaEjecucionglobalxentidadadicionadoxmesesAct(
                                $params
                );
                $dat[2] = DatControlejecucionnivelactividadDemanda::graficaEjecucionglobalxentidadsustituirxmesesAct(
                                $params
                );
            }
        }

        $categorias[0] = 'Enero';
        $categorias[1] = 'Febrero';
        $categorias[2] = 'Marzo';
        $categorias[3] = 'Abril';
        $categorias[4] = 'Mayo';
        $categorias[5] = 'Junio';
        $categorias[6] = 'Julio';
        $categorias[7] = 'Agosto';
        $categorias[8] = 'Septiembre';
        $categorias[9] = 'Octubre';
        $categorias[10] = 'Noviembre';
        $categorias[11] = 'Diciembre';

        $importeejecutado[] = (double) $dat[0][0]['ejecutadoenero'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadofebrero'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadomarzo'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadoabril'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadomayo'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadojunio'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadojulio'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadoagosto'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadoseptiembre'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadooctubre'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadonoviembre'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadodiciembre'];


        $adicion[] = (double) $dat[1][0]['adicionenero'];
        $adicion[] = (double) $dat[1][0]['adicionfebrero'];
        $adicion[] = (double) $dat[1][0]['adicionmarzo'];
        $adicion[] = (double) $dat[1][0]['adicionabril'];
        $adicion[] = (double) $dat[1][0]['adicionmayo'];
        $adicion[] = (double) $dat[1][0]['adicionjunio'];
        $adicion[] = (double) $dat[1][0]['adicionjulio'];
        $adicion[] = (double) $dat[1][0]['adicionagosto'];
        $adicion[] = (double) $dat[1][0]['adicionseptiembre'];
        $adicion[] = (double) $dat[1][0]['adicionoctubre'];
        $adicion[] = (double) $dat[1][0]['adicionnoviembre'];
        $adicion[] = (double) $dat[1][0]['adiciondiciembre'];

        $sustitucion[] = (double) $dat[2][0]['sustitucionenero'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionfebrero'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionmarzo'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionabril'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionmayo'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionjunio'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionjulio'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionagosto'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionseptiembre'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionoctubre'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionnoviembre'];
        $sustitucion[] = (double) $dat[2][0]['sustituciondiciembre'];

        $totacum = (double) ($importeejecutado[0] + $adicion[0] + $sustitucion[0]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[1] + $adicion[1] + $sustitucion[1]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[2] + $adicion[2] + $sustitucion[2]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[3] + $adicion[3] + $sustitucion[3]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[4] + $adicion[4] + $sustitucion[4]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[5] + $adicion[5] + $sustitucion[5]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[6] + $adicion[6] + $sustitucion[6]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[7] + $adicion[7] + $sustitucion[7]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[8] + $adicion[8] + $sustitucion[8]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[9] + $adicion[9] + $sustitucion[9]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[10] + $adicion[10] + $sustitucion[10]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[11] + $adicion[11] + $sustitucion[11]);
        $total[] = $totacum;

        $data = Array(
            array(
                "name" => 'Ejecutado',
                "data" => $importeejecutado
            ), array(
                "name" => 'Adición',
                "data" => $adicion
            ), array(
                "name" => 'Sustitución',
                "data" => $sustitucion
            ), array(
                "name" => 'Total',
                "data" => $total
            )
        );

        $result = Array($data, $categorias);

        return $result;
    }

    //Gráfica ejecución de indicadores más valiosos
    public function graficaEjecucionMasValiosos($params) {
        if ($params['tipo'] == 'plan') {
            return DatControlejecucionplanDemanda::graficaEjecucionMasValiosos(
                            $params
            );
        } else {
            if ($params['tipo'] == 'activ') {
                return DatControlejecucionnivelactividadDemanda::graficaEjecucionMasValiososAct(
                                $params
                );
            }
        }
    }

    //Indicadores fuera de plan más valiosos(adiciones)
    public function graficaIndicadoresFueraPlanMasValiosos($params) {
        if ($params['tipo'] == 'plan') {
            return DatControlejecucionplanDemanda::graficaIndicadoresFueraPlanMasValiosos(
                            $params
            );
        } else {
            if ($params['tipo'] == 'activ') {
                return DatControlejecucionnivelactividadDemanda::graficaIndicadoresFueraPlanMasValiososAct(
                                $params
                );
            }
        }
    }

    //Indicadores ejecutados más valiosos
    public function graficaIndicadoresMasEjecutados($params) {
        if ($params['tipo'] == 'plan') {
            return DatControlejecucionplanDemanda::graficaIndicadoresMasEjecutados(
                            $params
            );
        } else {
            if ($params['tipo'] == 'activ') {
                return DatControlejecucionnivelactividadDemanda::graficaIndicadoresMasEjecutadosAct(
                                $params
                );
            }
        }
    }

    public function listarreporteDemanda($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT edn.identidad as cb,
       ind.idindicador,
       ind.codigo,
       ind.denominacion,
       (
         SELECT list(DISTINCT os.denominacion)
         FROM mod_datosmaestros.nom_organosatisface os
              INNER JOIN
                mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios
                ON ind.idindicador = ios.idindicador AND ios.idorganosatisface =
                os.idorganosatisface
         WHERE os.idorganosatisface IN (29, 27)/*este filtro ponlo en una var addwhere*/
       ) as organo,
       SUM(p.cantidad + p.ajuste) as cantplanificada,
      round(((SUM(p.precio*(p.cantidad+p.ajuste))) +
                 (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                 SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100))- ( COALESCE(SUM(cpe*p.precio),0) ),3) as importeplan,
                 COALESCE(cont.cantidadcontratada,0)as cantcontratada,
       COALESCE(cont.preciocontratado,0) as preciocontratado,
       COALESCE(cont.cantidadcontratada,0)*COALESCE(cont.preciocontratado,0) as importecontratado,
       SUM(COALESCE(ce.cantidadreal, 0)) as cantejecutada,
       (SUM(p.precio * COALESCE(ce.cantidadreal, 0))) +(((SUM(p.precio *
         COALESCE(ce.cantidadreal, 0))) * ip.flete) / 100) +(((SUM(p.precio *
         COALESCE(ce.cantidadreal, 0))) * ip.contingencia) / 100) as
         importeejecutado
FROM mod_planificacion.dat_planificacion p
INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON p.idcentrobalance=cb.identidaddatosnomenclador
 INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
       ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
       ind.idindicador
     LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
       p.idplanificacion = ce.idplanificacion
     INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON
       p.idcentrobalance = edn.identidaddatosnomenclador
        LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON p.idplanificacion=cont.idplanificacion
        LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
      ae.idindicador  AND ae.idejercicio = 15)
     LEFT JOIN mod_planificacion.dat_odcte odcte on (ip.idindicador =
      odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
       odcte.idmodelo AND odcte.idejercicio = 15)
where cb.identidad IN(100530091)  AND
      p.idejercicio = 15 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4
GROUP BY ind.idindicador,
         ind.denominacion,
         edn.identidad,
         ip.flete,
         ip.contingencia,cont.cantidadcontratada,cont.preciocontratado
ORDER BY ind.codigo";
        /* SELECT edn.identidad as cb,
          ind.idindicador,
          ind.codigo,
          ind.denominacion,
          (
          SELECT list(DISTINCT os.denominacion)
          FROM mod_datosmaestros.nom_organosatisface os
          INNER JOIN
          mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios
          ON ind.idindicador = ios.idindicador AND ios.idorganosatisface =
          os.idorganosatisface
          WHERE os.idorganosatisface IN (29, 27)
          ) as organo,
          SUM(p.cantidad + p.ajuste) as cantplanificada,
          round(((SUM(p.precio*(p.cantidad+p.ajuste))) +
          (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
          SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100))- ( COALESCE(SUM(cpe*p.precio),0) ),3) as importeplan,
          COALESCE(cont.cantidadcontratada,0)as cantcontratada,
          COALESCE(cont.preciocontratado,0) as preciocontratado,
          COALESCE(cont.cantidadcontratada,0)*COALESCE(cont.preciocontratado,0) as importecontratado,
          SUM(COALESCE(ce.cantidadreal, 0)) as cantejecutada,
          (SUM(p.precio * COALESCE(ce.cantidadreal, 0))) +(((SUM(p.precio *
          COALESCE(ce.cantidadreal, 0))) * ip.flete) / 100) +(((SUM(p.precio *
          COALESCE(ce.cantidadreal, 0))) * ip.contingencia) / 100) as
          importeejecutado
          FROM mod_planificacion.dat_planificacion p
          INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON p.idcentrobalance=cb.identidaddatosnomenclador
          INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
          INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
          ind.idindicador
          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
          ind.idindicador
          LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
          p.idplanificacion = ce.idplanificacion
          INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON
          p.idcentrobalance = edn.identidaddatosnomenclador
          LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON p.idplanificacion=cont.idplanificacion
          LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
          ae.idindicador  AND ae.idejercicio = 15)
          LEFT JOIN mod_planificacion.dat_odcte odcte on (ip.idindicador =
          odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
          odcte.idmodelo AND odcte.idejercicio = 15)
          where cb.identidad IN(100530091)  AND
          p.idejercicio = 15 AND
          ip.nivelplanif = 1 AND
          ip.idaprobacion = 4 AND
          p.idaprobaciondemanda = 4
          GROUP BY ind.idindicador,
          ind.denominacion,
          edn.identidad,
          ip.flete,
          ip.contingencia,cont.cantidadcontratada,cont.preciocontratado
          ORDER BY ind.codigo */

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarRelacionCBxOACE($idejercicio, $cb, $org) {
        if ($org != null || $org != "") {
            $cadenaJOIN = "LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios ON ind.idindicador = ios.idindicador
      LEFT JOIN mod_datosmaestros.nom_organosatisface osa ON osa.idorganosatisface = ios.idorganosatisface";
            $cadenaWhere = "AND osa.idorganosatisface IN($org)";
        } else {
            $cadenaJOIN = "";
            $cadenaWhere = "";
        }
        $conn = Doctrine_Manager::connection();

        $sql = "SELECT COALESCE(s.cantfinal, 0) as cantfinal,
       COALESCE(s.importe, 0) as importe,
       COALESCE(s.cantreal, 0) as cantreal,
       COALESCE(s.importecontratado, 0) as importecontratado,
       COALESCE(s.importeejecutado, 0) as importeejecutado,
       COALESCE(s.cantcontratada, 0) as cantcontratada,
       s.codigo,
       s.idindicador,
       s.idunidadmedida,
       s.denominacion,

       (
         SELECT list(DISTINCT os.denominacion)
         FROM mod_datosmaestros.nom_organosatisface os
              INNER JOIN
                mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios
                ON s.idindicador = ios.idindicador AND ios.idorganosatisface =
                os.idorganosatisface

       ) as organo



FROM (WITH valioso AS (SELECT COALESCE(sum(cantidadreal), 0) as cantreal,
                        idplanificacion
                 FROM mod_planificacion.dat_controlejecucionplandemanda
                 GROUP BY idplanificacion)
SELECT DISTINCT (p.idplanificacion),
       p.idindicador,
       ind.codigo,
       ind.denominacion,
       p.precio,
       round(((p.precio * SUM((p.cantidad + p.ajuste))) +(((p.precio * SUM((
       p.cantidad + p.ajuste) * ip.flete))) / 100) +(((p.precio * SUM((
       p.cantidad + p.ajuste) * ip.contingencia))) / 100)) -(COALESCE(SUM(cpe),
        0) * p.precio), 3) as importe,
       p.idunidadmedida,
       sum(p.cantidad + p.ajuste) as cantfinal,
       COALESCE(cont.cantidadcontratada, 0) as cantcontratada,
       COALESCE(cont.preciocontratado, 0) as preciocontratado,
       COALESCE(cont.cantidadcontratada, 0) * COALESCE(cont.preciocontratado, 0)
        as importecontratado,
       COALESCE(v.cantreal, 0) as cantreal,
       ((COALESCE(cont.cantidadcontratada, 0)) - COALESCE(v.cantreal, 0)) as  pendiente,
       COALESCE(round(((cont.cantidadcontratada * 100) /(p.cantidad + p.ajuste)), 1), 0) as pcontratado,
       CASE
         WHEN COALESCE(cont.cantidadcontratada, 0) <> 0 THEN round(((COALESCE(
         sum(COALESCE(v.cantreal, 0)), 0) * 100) /(COALESCE(
         cont.cantidadcontratada, 0))), 1)
         ELSE 0
       END as pejecutado,
       (
         SELECT ind.denominacion
         from mod_planificacion.dat_desviacionplanxsustituciondemanda ds
              left JOIN mod_planificacion.dat_desviacionplandemanda d on
               d.iddesviacionplandemanda = ds.iddesviacionplandemanda
              INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
               ind.idindicador
         where p.idplanificacion = ANY (ds.idplanificacion)
       ) as indsustituido,
       (SUM(p.precio * COALESCE(v.cantreal, 0))) +(((SUM(p.precio *
         COALESCE(v.cantreal, 0))) * ip.flete) / 100) +(((SUM(p.precio *
         COALESCE(v.cantreal, 0))) * ip.contingencia) / 100) as
         importeejecutado

FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON
      p.idcentrobalance = cb.identidaddatosnomenclador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
      em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
     LEFT JOIN valioso v ON (p.idplanificacion = v.idplanificacion)
     LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON
      p.idplanificacion = cont.idplanificacion
     LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
      ae.idindicador AND ae.idejercicio = $idejercicio)
     LEFT JOIN mod_planificacion.dat_odcte odcte on (ip.idindicador =
      odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
       odcte.idmodelo AND odcte.idejercicio = $idejercicio)
     INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv ON
      ip.idindicador = iv.idindicador
     INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON iv.idviaadquisicion
      = via.idviaadquisicion

    $cadenaJOIN


where cb.identidad IN($cb) AND
      p.idejercicio = $idejercicio AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      (p.idaprobaciondemanda = 4 OR
      p.idaprobaciondemanda = 5) AND
      (p.cantidad + p.ajuste) > 0 AND
      ind.estado = 1 $cadenaWhere
GROUP BY p.idplanificacion,ip.flete,ip.contingencia,
         ind.codigo,
         ind.denominacion,
         ind.numeropieza,
         cont.cantidadcontratada,
         cont.preciocontratado,
         v.cantreal
ORDER BY ind.codigo)s

GROUP BY s.cantfinal,
         s.importe,
         s.cantreal,
         s.importecontratado,
         s.importeejecutado,
         s.cantcontratada,
         s.codigo,
         s.idindicador,s.idunidadmedida,s.denominacion ";


        /* $sql
          = "SELECT edn.identidad as cb,
          ind.idindicador,
          ind.codigo,
          ind.denominacion,
          (
          SELECT list(DISTINCT os.denominacion)
          FROM mod_datosmaestros.nom_organosatisface os
          INNER JOIN
          mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios
          ON ind.idindicador = ios.idindicador AND ios.idorganosatisface =
          os.idorganosatisface
          WHERE os.idorganosatisface ={$org}
          ) as organo,
          SUM(p.cantidad + p.ajuste) as cantplanificada,
          round(((SUM(p.precio*(p.cantidad+p.ajuste))) +
          (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
          SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100))- ( COALESCE(SUM(cpe*p.precio),0) ),3) as importeplan,
          COALESCE(cont.cantidadcontratada,0)as cantcontratada,
          COALESCE(cont.preciocontratado,0) as preciocontratado,
          COALESCE(cont.cantidadcontratada,0)*COALESCE(cont.preciocontratado,0) as importecontratado,

          SUM(COALESCE(ce.cantidadreal, 0)) as cantejecutada,

          (SUM(p.precio * COALESCE(ce.cantidadreal, 0))) +(((SUM(p.precio *
          COALESCE(ce.cantidadreal, 0))) * ip.flete) / 100) +(((SUM(p.precio *
          COALESCE(ce.cantidadreal, 0))) * ip.contingencia) / 100) as
          importeejecutado

          FROM mod_planificacion.dat_planificacion p
          INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON p.idcentrobalance=cb.identidaddatosnomenclador
          INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
          INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
          ind.idindicador
          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
          ind.idindicador
          LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
          p.idplanificacion = ce.idplanificacion
          INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON
          p.idcentrobalance = edn.identidaddatosnomenclador
          LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON p.idplanificacion=cont.idplanificacion
          LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
          ae.idindicador  AND ae.idejercicio = {$idejercicio})
          LEFT JOIN mod_planificacion.dat_odcte odcte on (ip.idindicador =
          odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
          odcte.idmodelo AND odcte.idejercicio = {$idejercicio})
          where cb.identidad IN ({$cb})  AND
          p.idejercicio = {$idejercicio} AND
          ip.nivelplanif = 1 AND
          ip.idaprobacion = 4
          AND (p.idaprobaciondemanda = 4 OR p.idaprobaciondemanda = 5)
          GROUP BY ind.idindicador,
          ind.denominacion,
          edn.identidad,
          ip.flete,
          ip.contingencia,cont.cantidadcontratada,cont.preciocontratado
          HAVING (SELECT list(DISTINCT os.denominacion)
          FROM mod_datosmaestros.nom_organosatisface os
          INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios ON ind.idindicador = ios.idindicador AND ios.idorganosatisface = os.idorganosatisface
          WHERE ios.idorganosatisface = {$org}) <> NULL
          OR
          (SELECT list(DISTINCT os.denominacion)
          FROM mod_datosmaestros.nom_organosatisface os
          INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios ON ind.idindicador = ios.idindicador AND ios.idorganosatisface = os.idorganosatisface
          WHERE ios.idorganosatisface = {$org}) <> ''
          ORDER BY organo"; */

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function listarResumenCB($idejercicio, $cb, $org) {
        if ($org != null || $org != "") {
            $cadenaJOIN = "LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios ON ind.idindicador = ios.idindicador
      LEFT JOIN mod_datosmaestros.nom_organosatisface osa ON osa.idorganosatisface = ios.idorganosatisface";
            $cadenaWhere = "AND osa.idorganosatisface IN($org)";
        } else {
            $cadenaJOIN = "";
            $cadenaWhere = "";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT COALESCE(s.cantfinal,0) as cantfinal, COALESCE(s.importe,0) as importe, COALESCE(s.cantreal,0) as cantreal,COALESCE(s.importecontratado,0) as importecontratado
,COALESCE(s.importeejecutado,0) as importeejecutado,COALESCE(s.cantcontratada,0) as cantcontratada
 FROM( WITH valioso AS (SELECT COALESCE(sum(cantidadreal), 0) as cantreal,
                        idplanificacion
                 FROM mod_planificacion.dat_controlejecucionplandemanda
                 GROUP BY idplanificacion)
SELECT DISTINCT (p.idplanificacion),
       p.idindicador,
       ind.codigo,
       ind.denominacion,
       p.precio,
       round(((p.precio * SUM((p.cantidad + p.ajuste))) +(((p.precio * SUM((
       p.cantidad + p.ajuste) * ip.flete))) / 100) +(((p.precio * SUM((
       p.cantidad + p.ajuste) * ip.contingencia))) / 100)) -(COALESCE(SUM(cpe),
        0) * p.precio), 3) as importe,
       p.idunidadmedida,
       sum(p.cantidad + p.ajuste) as cantfinal,
       COALESCE(cont.cantidadcontratada, 0) as cantcontratada,
       COALESCE(cont.preciocontratado, 0) as preciocontratado,
       COALESCE(cont.cantidadcontratada, 0) * COALESCE(cont.preciocontratado, 0)
        as importecontratado,
       COALESCE(v.cantreal, 0) as cantreal,
       ((COALESCE(cont.cantidadcontratada, 0)) - COALESCE(v.cantreal, 0)) as  pendiente,
       COALESCE(round(((cont.cantidadcontratada * 100) /(p.cantidad + p.ajuste)), 1), 0) as pcontratado,
       CASE
         WHEN COALESCE(cont.cantidadcontratada, 0) <> 0 THEN round(((COALESCE(
         sum(COALESCE(v.cantreal, 0)), 0) * 100) /(COALESCE(
         cont.cantidadcontratada, 0))), 1)
         ELSE 0
       END as pejecutado,
       (
         SELECT ind.denominacion
         from mod_planificacion.dat_desviacionplanxsustituciondemanda ds
              left JOIN mod_planificacion.dat_desviacionplandemanda d on
               d.iddesviacionplandemanda = ds.iddesviacionplandemanda
              INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
               ind.idindicador
         where p.idplanificacion = ANY (ds.idplanificacion)
       ) as indsustituido,
       (SUM(p.precio * COALESCE(v.cantreal, 0))) +(((SUM(p.precio *
         COALESCE(v.cantreal, 0))) * ip.flete) / 100) +(((SUM(p.precio *
         COALESCE(v.cantreal, 0))) * ip.contingencia) / 100) as
         importeejecutado

FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON
      p.idcentrobalance = cb.identidaddatosnomenclador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
      em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
     LEFT JOIN valioso v ON (p.idplanificacion = v.idplanificacion)
     LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON
      p.idplanificacion = cont.idplanificacion
     LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
      ae.idindicador AND ae.idejercicio = $idejercicio)
     LEFT JOIN mod_planificacion.dat_odcte odcte on (ip.idindicador =
      odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
       odcte.idmodelo AND odcte.idejercicio = $idejercicio)
     INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv ON
      ip.idindicador = iv.idindicador
     INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON iv.idviaadquisicion
      = via.idviaadquisicion $cadenaJOIN
where cb.identidad IN($cb) AND
      p.idejercicio = $idejercicio AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      (p.idaprobaciondemanda = 4 OR
      p.idaprobaciondemanda = 5) AND
      (p.cantidad + p.ajuste) > 0 AND
      ind.estado = 1 $cadenaWhere
GROUP BY p.idplanificacion,ip.flete,ip.contingencia,
         ind.codigo,
         ind.denominacion,
         ind.numeropieza,
         cont.cantidadcontratada,
         cont.preciocontratado,
         v.cantreal
ORDER BY ind.codigo )s
GROUP BY s.cantfinal,s.importe,s.cantreal,s.importecontratado,s.importeejecutado,s.cantcontratada
";

        /* $sql
          = "SELECT edn.identidad as cb,
          ind.idindicador,
          ind.codigo,
          ind.denominacion,
          SUM(p.cantidad + p.ajuste) as cantplanificada,
          round(((SUM(p.precio*(p.cantidad+p.ajuste))) +
          (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
          SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100))- ( COALESCE(SUM(cpe*p.precio),0) ),3) as importeplan,
          COALESCE(cont.cantidadcontratada,0)as cantcontratada,
          COALESCE(cont.preciocontratado,0) as preciocontratado,
          COALESCE(cont.cantidadcontratada,0)*COALESCE(cont.preciocontratado,0) as importecontratado,
          SUM(COALESCE(ce.cantidadreal, 0)) as cantejecutada,
          (SUM(p.precio * COALESCE(ce.cantidadreal, 0))) +(((SUM(p.precio *
          COALESCE(ce.cantidadreal, 0))) * ip.flete) / 100) +(((SUM(p.precio *
          COALESCE(ce.cantidadreal, 0))) * ip.contingencia) / 100) as
          importeejecutado
          FROM mod_planificacion.dat_planificacion p
          INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON p.idcentrobalance=cb.identidaddatosnomenclador
          INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
          INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
          ind.idindicador
          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
          ind.idindicador
          LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
          p.idplanificacion = ce.idplanificacion
          INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON
          p.idcentrobalance = edn.identidaddatosnomenclador
          LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON p.idplanificacion=cont.idplanificacion
          LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
          ae.idindicador  AND ae.idejercicio = {$idejercicio})
          LEFT JOIN mod_planificacion.dat_odcte odcte on (ip.idindicador =
          odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
          odcte.idmodelo AND odcte.idejercicio = {$idejercicio})
          where cb.identidad ={$cb}  AND
          p.idejercicio = {$idejercicio} AND
          ip.nivelplanif = 1 AND
          ip.idaprobacion = 4
          AND (p.idaprobaciondemanda = 4 OR p.idaprobaciondemanda = 5)
          GROUP BY ind.idindicador,
          ind.denominacion,
          edn.identidad,
          ip.flete,
          ip.contingencia,cont.cantidadcontratada,cont.preciocontratado
          "; */
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarPendientesCB($idejercicio, $cb, $org) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT COALESCE((s.cantfinal),0) as cantfinal, COALESCE(sum(s.importe),0) as importe, COALESCE(sum(s.cantreal),0) as cantreal,COALESCE(sum(s.importecontratado),0) as importecontratado
,COALESCE(sum(s.importeejecutado),0) as importeejecutado,COALESCE(sum(s.cantcontratada),0) as cantcontratada, COALESCE(sum(s.pendiente),0) as pendiente, s.codigo FROM(

WITH valioso AS (SELECT COALESCE(sum(cantidadreal), 0) as cantreal,
                        idplanificacion
                 FROM mod_planificacion.dat_controlejecucionplandemanda
                 GROUP BY idplanificacion)
SELECT DISTINCT (p.idplanificacion),
       p.idindicador,
       ind.codigo,
       ind.denominacion,
       p.precio,

       round(((p.precio * SUM((p.cantidad + p.ajuste))) +(((p.precio * SUM((
       p.cantidad + p.ajuste) * ip.flete))) / 100) +(((p.precio * SUM((
       p.cantidad + p.ajuste) * ip.contingencia))) / 100)) -(COALESCE(SUM(cpe),
        0) * p.precio), 3) as importe,

       p.idunidadmedida,

       sum(p.cantidad + p.ajuste) as cantfinal,

       COALESCE(cont.cantidadcontratada, 0) as cantcontratada,

       COALESCE(cont.preciocontratado, 0) as preciocontratado,

       COALESCE(cont.cantidadcontratada, 0) * COALESCE(cont.preciocontratado, 0) as importecontratado,

       COALESCE(v.cantreal, 0) as cantreal,

       ((COALESCE(cont.cantidadcontratada, 0)) - COALESCE(v.cantreal, 0)) as  pendiente,

       COALESCE(round(((cont.cantidadcontratada * 100) /(p.cantidad + p.ajuste)), 1), 0) as pcontratado,

       CASE
         WHEN COALESCE(cont.cantidadcontratada, 0) <> 0 THEN round(((COALESCE(
         sum(COALESCE(v.cantreal, 0)), 0) * 100) /(COALESCE(
         cont.cantidadcontratada, 0))), 1)
         ELSE 0
       END as pejecutado,
       (
         SELECT ind.denominacion
         from mod_planificacion.dat_desviacionplanxsustituciondemanda ds
              left JOIN mod_planificacion.dat_desviacionplandemanda d on
               d.iddesviacionplandemanda = ds.iddesviacionplandemanda
              INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
               ind.idindicador
         where p.idplanificacion = ANY (ds.idplanificacion)
       ) as indsustituido,

       (SUM(p.precio * COALESCE(v.cantreal, 0))) +(((SUM(p.precio *
         COALESCE(v.cantreal, 0))) * ip.flete) / 100) +(((SUM(p.precio *
         COALESCE(v.cantreal, 0))) * ip.contingencia) / 100) as
         importeejecutado


FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON
      p.idcentrobalance = cb.identidaddatosnomenclador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
      em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
     LEFT JOIN valioso v ON (p.idplanificacion = v.idplanificacion)
     LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON
      p.idplanificacion = cont.idplanificacion
     LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
      ae.idindicador AND ae.idejercicio = $idejercicio)
     LEFT JOIN mod_planificacion.dat_odcte odcte on (ip.idindicador =
      odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
       odcte.idmodelo AND odcte.idejercicio = $idejercicio)
     INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv ON
      ip.idindicador = iv.idindicador
     INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON iv.idviaadquisicion
      = via.idviaadquisicion

       LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios ON ind.idindicador = ios.idindicador
      LEFT JOIN mod_datosmaestros.nom_organosatisface osa ON osa.idorganosatisface = ios.idorganosatisface

where cb.identidad IN ($cb) AND
      p.idejercicio = $idejercicio AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      (p.idaprobaciondemanda = 4 OR
      p.idaprobaciondemanda = 5) AND
      (p.cantidad + p.ajuste) > 0 AND
      ind.estado = 1 AND osa.idorganosatisface IN ($org)
GROUP BY p.idplanificacion,ip.flete,ip.contingencia,
         ind.codigo,
         ind.denominacion,
         ind.numeropieza,
         cont.cantidadcontratada,
         cont.preciocontratado,
         v.cantreal
ORDER BY ind.codigo
)s
GROUP BY
s.cantfinal,s.importe,s.cantreal,s.importecontratado,s.importeejecutado,s.cantcontratada,s.codigo";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

}
