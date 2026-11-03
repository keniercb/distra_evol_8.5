<?php

class ResultadoEvaluacionService extends ZendExt_Model
{

    /**
     * Obtiene listada de evaluados por periodo evaluativo
     *
     * @param      $idperiodoproceso
     * @param null $estado 0- No Evaluado, 1- Evaluado, 2- En reclamacion, 3- No evaluado
     *
     * @return mixed
     */
    public function getEvaluadosByPeriodo($idperiodoproceso, $estado = null)
    {
        $objDomain = new DatEvalpersonaevaluacion();
        $data = $objDomain->getEvaluadosByPeriodo($idperiodoproceso, $estado);

        $k = 0;
        while ($k < count($data)) {
            $v = $data[$k];
            if ($v['nopersona'] == 1) {
                $eval = $v['evaluacion'];
                $state = $v['estado'];
                array_splice($data, $k, 1);
                $personas = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, null, $v['idpersona']);
                if ($personas->quantity > 0) {
                    foreach ($personas->data as $pers) {
                        if (!self::existePersona($data, 'idpersona', array($pers['idpersona'], $pers['idarea']))) {
                            $data[] = array(
                                'idpersonaevaluado' => $pers['idpersona'],
                                'idpersona' => $pers['idpersona'],
                                'evaluacion' => $eval,
                                'valor' => $eval,
                                'estado' => $state,
                                'nopersona' => 0
                            );
                        }
                    }
                }
            } else {
                $k++;
            }
        }
        for($i = 0;$i<count($data);$i++){
            if($data[$i]['estado']==1){
                $idpersonaevaluacion = $data[$i]['idpersonaevaluacion'];

                $sql = "SELECT ie.valor ,ie.idindicadorplanilla,ip.idindicador
				 FROM mod_evaluaciones.dat_evalindicadoresevaluacion AS ie
				 inner join mod_evaluaciones.dat_evalindicadoresplanilla ip on (ip.idindicadorplanilla = ie.idindicadorplanilla)
				where ie.idpersonaevaluacion = $idpersonaevaluacion";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $resultindeval = $conn->fetchAll($sql);

                $contador = 0;
                for($j = 0;$j<count($resultindeval);$j++){
                    $data[$i]['indicadores'][$contador]['idindicador'] = $resultindeval[$j]['idindicador'];
                    $data[$i]['indicadores'][$contador]['valorindicador']= $resultindeval[$j]['valor'];

                    $contador++;
                }
            }
        }

        return $data;
    }
    public function getEvaluadosByPeriodoTRD($idperiodoproceso, $estado = null)
    {   $cant = 0;
        $objDomain = new DatEvalpersonaevaluacion();
        for($i =0;$i<count($idperiodoproceso);$i++){
            $data = $objDomain->getEvaluadosByPeriodoNomina($idperiodoproceso[$i], $estado);
            $k = 0;
            while ($k < count($data)) {
                $v = $data[$k];

                if ($v['nopersona'] == 1) {
                    $evaluacion = $v['evaluacion'];
                    $state = $v['estado'];
                    array_splice($data, $k, 1);
                    $personas = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, null, $v['idpersona']);
                    if ($personas->quantity > 0) {
                        foreach ($personas->data as $pers) {
                            if (!self::existePersona($data, 'idpersona', $pers['idpersona'])) {

                                $data[] = array(
                                    'idpersonaevaluado' => $pers['idpersona'],
                                    'idpersona' => $pers['idpersona'],
                                    'evaluacion' => $evaluacion,
                                    'valor' => $evaluacion,
                                    'estado' => $state,
                                    'nopersona' => 0
                                );
                            }
                        }
                    }
                } else {
                    $k++;
                }

            }

            for($j =0;$j<count($data);$j++){
                $datafinal[$cant]['idpersonaevaluacion'] = $data[$j]['idpersonaevaluacion'];
                $datafinal[$cant]['idpersonaevaluador'] = $data[$j]['idpersonaevaluador'];
                $datafinal[$cant]['idpersonaevaluado'] = $data[$j]['idpersonaevaluado'];
                $datafinal[$cant]['idpersona'] = $data[$j]['idpersona'];
                $datafinal[$cant]['evaluacion'] = $data[$j]['evaluacion'];
                $datafinal[$cant]['valor'] = $data[$j]['valor'];
                $datafinal[$cant]['idescala'] = $data[$j]['idescala'];
                $datafinal[$cant]['nopersona'] = $data[$j]['nopersona'];
                $datafinal[$cant]['estado'] = $data[$j]['estado'];
                $datafinal[$cant]['causanoevaluado'] = $data[$j]['causanoevaluado'];
                $cant++;
            }
        }
        return $datafinal;
    }

    /**
     * Devuelve todas las evaluaciones correspondientes a una persona
     *
     * @param      $idpersona
     * @param null $idprocesoevaluativo
     *
     * @return array Evaluaciones persona
     */
    public function getEvaluacionesPersona($idpersona, $limit, $start, $idprocesoevaluativo = null)
    {
        $objDomain = new DatEvalpersonaevaluacion();
        $response = new stdClass();
        $response->data = $objDomain->getEvaluacionesPersona($idpersona, $limit, $start, $idprocesoevaluativo);
        $response->quantity = $objDomain->getCantEvaluacionesPersona($idpersona, $idprocesoevaluativo);

        return $response;
    }

    private static function existePersona($array, $clave, $id)
    {
        foreach ($array as $v) {
            foreach ($id as $i) {
                if ($v[$clave] == $i) {
                    return true;
                }
            }
        }
        return false;
    }

    public function getPlanillasByPeriodo()
    {
        $objDomain = new DatEvalpersonaevaluacion();
        $data = $objDomain->getPlanillasByPeriodo();
        return $data;
    }

}