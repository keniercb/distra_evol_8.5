<?php

/**
 * gestionarterminoModel
 *
 * @author  Ing.Rodain Terrer Molina
 * @version 1.0
 */
class terminopagoModel extends ZendExt_Model
{

    function __construct()
    {
        parent::ZendExt_Model();
    }

    public function registrarCondicion(
        $post, $mora, $dpp, $descuentos, $plazoCuotas, $delmora, $deldpp,
        $deldescuentos, $delplazo
    ) {
        try {
            $idestructura = $this->global->Estructura->idestructura;
            $denominacion = $post['denominacion'];
            $id = $post['idterminopago'];
            $predeterminado = $post['predeterminado'];

            if ($post['plazo']) {
                $plazo = $post['plazo'];
            }

            if ($post['tiempo']) {
                $tiempo = $post['tiempo'];
            }

            $idterminopago = DatTerminopago::registrarTerminoPago(
                $idestructura, $tiempo, $plazo, $descuentos, $dpp, $mora,
                $denominacion, $id, $predeterminado
            );

            if (count($plazoCuotas) == 0) {
                if (count($mora) > 0 || count($delmora) > 0) {
                    DatMora::registrarMora($idterminopago, $mora, $delmora);
                }

                if (count($descuentos) > 0 || count($deldescuentos) > 0) {
                    DatDescuentosVenta::registrarDescuentoVenta(
                        $idterminopago, $descuentos, $deldescuentos
                    );
                }
                if (count($dpp) > 0 || count($deldpp) > 0) {
                    DatDpp::registrarDpp($idterminopago, $dpp, $deldpp);
                }
            } else {
                DatCuotas::registrarPlazoCuotas(
                    $idterminopago, $plazoCuotas, $delplazo
                );
            }

            return true;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetCondiciones($post)
    {
        $idestructura = $this->global->Estructura->idestructura;
        $condiciones = DatTerminopago::GetCondiciones($post, $idestructura);

        foreach ($condiciones['data'] as &$c) {
//            print($c['aplazos']);
//            print_r($c);die;
            if ($c['aplazos'] == 0) {
                if ($c['mora'] == 1) {
                    $mora = DatMora::getMora($c['idterminodepago']);
                    $construirMora = $this->contruirMora($mora, 'mora');
                    $c['construirMora'] = $construirMora;
                } else {
                    $c['construirMora'] = '- SIN CONFIGURAR';
                }

                if ($c['dpp'] == 1) {
                    $dpp = DatDpp::getDpp($c['idterminodepago']);
                    $construirDpp = $this->contruirMora($dpp, 'dpp');
                    $c['construirDpp'] = $construirDpp;
                } else {
                    $c['construirDpp'] = '- SIN CONFIGURAR';
                }

                if ($c['descventa'] == 1) {
                    $descventa = DatDescuentosVenta::getDescuentosVenta(
                        $c['idterminodepago']
                    );
                    $construirDV = $this->contruirMora($descventa, 'descventa');
                    $c['construirDV'] = $construirDV;
                } else {
                    $c['construirDV'] = '- SIN CONFIGURAR';
                }
                $c['construirCuotas'] = '- SIN CONFIGURAR';
                $c['usado'] = DatCuotas::enUso($c['idterminodepago']);
            } else {
                $cuotas = DatCuotas::getCuotas($c['idterminodepago']);

                $construirCuotas = $this->contruirMora($cuotas, 'cuotas');
                $c['construirCuotas'] = $construirCuotas;
                $c['construirMora'] = '- SIN CONFIGURAR';
                $c['construirDpp'] = '- SIN CONFIGURAR';
                $c['construirDV'] = '- SIN CONFIGURAR';
                $c['usado'] = 0;
            }

            if ($c['idumplazo'] == 1) {
                $c['tiempo'] = 'Día(s)';
            } elseif ($c['idumplazo'] == 2) {
                $c['tiempo'] = 'Semana(s)';
            } elseif ($c['idumplazo'] == 3) {
                $c['tiempo'] = 'Mes(es)';
            } else {
                $c['tiempo'] = 'Año(s)';
            }
        }
        //print_r($condiciones);die;
        return $condiciones;
    }

    public function GetCondicionesCombo()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $condiciones = DatTerminopago::GetCondicionesCombo($idestructura);

        return $condiciones;
    }

    public function deletePayCondition($conditions)
    {
        try {
            foreach ($conditions as $condition) {
                DatTerminopago::delTerminoPago($condition->idterminodepago);
            }
            return 1;
        } catch (Exception $e) {
            return $e->getCode();
        }
    }

    public function activeCondition($post)
    {
        $idEstructura = $this->global->Estructura->idestructura;

        $a = Doctrine_Manager::getInstance();
        $va = $a->getCurrentConnection();

        $activa = DatTerminopago::GetActiva($idEstructura);
        if ($activa->idterminodepago) {
            $activa->predeterminado = 0;
            $activa->save();
        }

        $terminopago = Doctrine::getTable('DatTerminopago')->find(
            $post['idterminodepago']
        );
        $terminopago->predeterminado = 1;
        $terminopago->save();

        $va->commit();
        $va->beginTransaction();

        $response['success'][]
            = array('idcondicionpago' => $post['idterminodepago'],
                    'denominacion'    => $post['denominacion']);

        return $response;
    }

    public function contruirMora($array, $action)
    {
        $string = "";
        if ($action == 'mora') {
            foreach ($array as $m) {
                $string .= "    - Incremento de un " . $m['porciento']
                    . "% en caso de pagar después de los " . $m['dias']
                    . " días.<br>";
            }
        }
        if ($action == 'dpp') {
            foreach ($array as $d) {
                $string
                    .= "    - " . $d['porciento'] . "% de descuento dentro de los "
                    . $d['dias'] . " días.<br>";
            }
        }
        if ($action == 'descventa') {
            foreach ($array as $dv) {
                $string .= "    - " . $dv['porciento']
                    . "% de descuento en caso de comprar entre " . $dv['min']
                    . " y " . $dv['max'] . ".<br>";
            }
        }
        if ($action == 'cuotas') {
            $string .= "El siguiente término de pago tiene " . count($array)
                . " plazos. Los términos de pagos a aplicar en cada plazo son:<br>";
            foreach ($array as $c) {
                $terminoPago = DatTerminopago::GetTerminoPagoPorId(
                    $c['idterminoaplicable']
                );
                $string
                    .= "    - " . $terminoPago[0]['nombre'] . " con un pago del "
                    . $c['porciento'] . "%.<br>";
            }
        }
        return $string;
    }

    public function loadDataMod($idterminodepago)
    {
        $plazos = array();
        $mora = DatMora::getMora($idterminodepago);
        $dpp = DatDpp::getDpp($idterminodepago);
        $descventa = DatDescuentosVenta::getDescuentosVenta($idterminodepago);
        $cuotas = DatCuotas::getCuotas($idterminodepago);

        if (count($cuotas) > 0) {
            foreach ($cuotas as $index => $c) {
                $terminoPago = DatTerminopago::GetTerminoPagoPorId(
                    $c['idterminoaplicable']
                );
                $plazos[$index]['idterminodepago'] = $c['idterminoaplicable'];
                $plazos[$index]['porciento'] = $c['porciento'];
                $plazos[$index]['idcuota'] = $c['idcuota'];
                $plazos[$index]['nombre'] = $terminoPago[0]['nombre'];
            }
        }

        return array('mora'      => $mora, 'dpp' => $dpp,
                     'descventa' => $descventa, 'cuotas' => $plazos);
    }


    function adicionarcondicion($obj)
    {
        try {
            $obj->save();
            return true;
        } catch (Doctrine_Exception $e) {
            throw new ZendExt_Exception('CONT001', $e);
        }
    }

    //esto es solo para carga inicial
    public static function ModificarCondicionPago(
        $idcond, $dpp, $mora, $plazo, $idestructuracomun
    ) {
        $obj = Doctrine::getTable('DatCondicionpago')->find($idcond);
        $obj->dpp = $dpp;
        $obj->mora = $mora;
        $obj->plazo = $plazo;
        $obj->idestructuracomun = $idestructuracomun;
        $obj->save();
    }

    /* Implementacion del codigo nuevo */

    public function Insertar($datCondicionpago)
    {
        try {
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $datCondicionpago->save();

            $va->commit();
            $va->beginTransaction();

            return $datCondicionpago->idcondicionpago;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function cargarCondiciones($post)
    {
        $start
            = isset($post['start']) && is_numeric($post['start']) ? $post['start']
            : 0;
        $limit
            = isset($post['limit']) && is_numeric($post['start']) ? $post['limit']
            : 20;
        $utfOcho = array("à" => "À", "è" => "È", "ì" => "Ì", "ò" => "Ò",
                         "ù" => "Ù", "á" => "Á", "é" => "É", "í" => "Í",
                         "ó" => "Ó", "ú" => "Ú", "â" => "Â", "ê" => "Ê",
                         "î" => "Î", "ô" => "Ô", "û" => "Û", "ç" => "Ç");
        $data = array();
        $paging = array();
        $estructura = $this->global->Estructura->idestructura;
        if (isset($post['denominacion']) && isset($post['plazo'])
            && isset($post['descuento'])
            && isset($post['mora'])
        ) {
            $data = $this->getPayConditions(
                $estructura, $post['denominacion'], $post['plazo'],
                $post['descuento'], $post['mora']
            );
        } else {
            $data = $this->getPayConditions($estructura);
        }
        if (count($data) > 0) {
            foreach ($data as &$condition) {
                /* aqui va el nombre verdadero cunado se defina este campo en BD */
                if (isset($post['denominacion'])
                    && $post['denominacion'] != -1
                ) { // para la busqueda
                    $condition['denominacion'] = str_replace(
                        strtr($post['denominacion'], $utfOcho),
                        "<span style=\"background-color: rgb(255, 255, 0);\">"
                        . strtr($post['denominacion'], $utfOcho) . "</span>",
                        strtr($condition['denominacion'], $utfOcho)
                    );
                }
                if (isset($post['plazo'])
                    && $post['plazo'] != -1
                ) { // para la busqueda
                    $condition['plazo'] = str_replace(
                        strtr($post['plazo'], $utfOcho),
                        "<span style=\"background-color: rgb(255, 255, 0);\">"
                        . strtr($post['plazo'], $utfOcho) . "</span>",
                        strtr($condition['plazo'], $utfOcho)
                    );
                }
                if (isset($post['descuento'])
                    && $post['descuento'] != -1
                ) { // para la busqueda
                    $condition['dpp'] = str_replace(
                        strtr($post['descuento'], $utfOcho),
                        "<span style=\"background-color: rgb(255, 255, 0);\">"
                        . strtr($post['descuento'], $utfOcho) . "</span>",
                        strtr($condition['dpp'], $utfOcho)
                    );
                }
                if (isset($post['mora'])
                    && $post['mora'] != -1
                ) { // para la busqueda
                    $condition['mora'] = str_replace(
                        strtr($post['mora'], $utfOcho),
                        "<span style=\"background-color: rgb(255, 255, 0);\">"
                        . strtr($post['mora'], $utfOcho) . "</span>",
                        strtr($condition['mora'], $utfOcho)
                    );
                }
            }
        }

        $paging = array(
            'success' => true,
            'total'   => count($data),
            'data'    => array_splice($data, $start, $limit)
        );
        return $paging;
    }

    private function getPayConditions(
        $idestructura, $denominacion = null, $plazo = null, $descuento = null,
        $mora = null
    ) {
        $arrayConditions = array("idestructuracomun = $idestructura");
        if ($denominacion != null && $denominacion != -1) {
            $arrayConditions[]
                = "lower(denominacion) ILIKE lower('%$denominacion%')";
        }
        if ($plazo != null && $plazo != -1) {
            $arrayConditions[] = "plazo = $plazo";
        }
        if ($descuento != null && $descuento != -1) {
            $arrayConditions[] = "dpp = $descuento";
        }
        if ($mora != null && $mora != -1) {
            $arrayConditions[] = "mora = $mora";
        }
        $condition = implode(" AND ", $arrayConditions);
        $data = DatCondicionpago::GetByConditionSQLVersion($condition);
        return $data;
    }

    public function registerPayCondition($post)
    {
        $estructura = $this->global->Estructura->idestructura;
        $response = array('code'    => 1, 'errors' => array(),
                          'success' => array(), 'idgenerado' => -1);
        if (isset($post['idcondicionpago']) && isset($post['denominacion'])
            && isset($post['plazo'])
            && isset($post['dpp'])
            && isset($post['mora'])
        ) {

            if ($post['idcondicionpago'] == -1) {
                $modelDomain = new DatCondicionpago();
                $nameAvailable = $this->denominacionDisponible(
                    $post['denominacion'], $estructura
                );
                $alreadyExist = (isset($post['noverify'])) ? false
                    : $this->verificaExistencia($post, $estructura);
            } else {
                $modelDomain = Doctrine::getTable('DatCondicionpago')->find(
                    $post['idcondicionpago']
                );
                $nameAvailable = $this->denominacionDisponible(
                    $post['denominacion'], $estructura,
                    $modelDomain->idcondicionpago
                );
                $alreadyExist = false;
            }
            if ($nameAvailable) {
                if (!$alreadyExist) {
                    $modelDomain->plazo = $post['plazo'];
                    $modelDomain->dpp = $post['dpp'];
                    $modelDomain->mora = $post['mora'];
                    $modelDomain->denominacion = $post['denominacion'];
                    $modelDomain->idestructuracomun = $estructura;
                    /* campos adicionales */
                    $modelDomain->activo = 0;

                    $idgenerado = $this->Insertar($modelDomain);
                    if (!is_numeric($idgenerado)) {
                        /* ocurrio un error al insertar | modificar */
                        $response['code'] = 2;
                    } else {
                        $response['idgenerado'] = $idgenerado;
                    }
                } else {
                    /* ya existe una condicion de pago con el mismo plazo, descuento y mora */
                    $response['code'] = 5;
                    $response['errors'][] = array('plazo'     => $post['plazo'],
                                                  'descuento' => $post['dpp'],
                                                  'mora'      => $post['mora']);
                }
            } else {
                /* la denominacion esta siendo usada por otra condicion de pago */
                $response['code'] = 4;
                $response['errors'][]
                    = array('denominacion' => $post['denominacion']);
            }
        } else {
            /* faltan datos */
            $response['code'] = 3;
        }
        return $response;
    }

    public function verificaExistencia($post, $idestructura)
    {
        $conditions
            = "idestructuracomun = ? AND dpp = ? AND plazo = ? AND mora = ?";
        $params = array($idestructura, $post['dpp'], $post['plazo'],
                        $post['mora']);
        $data = DatCondicionpago::GetByCondition($conditions, $params, true);
        return count($data) > 0;
    }

    public function denominacionDisponible(
        $denominacion, $idestructura, $idcondicionpago = null
    ) {
        if ($idcondicionpago != null) {
            $conditions
                = "idestructuracomun = ? AND denominacion = ? AND idcondicionpago <> ?";
            $params = array($idestructura, $denominacion, $idcondicionpago);
        } else {
            $conditions = "idestructuracomun = ? AND denominacion = ?";
            $params = array($idestructura, $denominacion);
        }
        $data = DatCondicionpago::GetByCondition($conditions, $params, true);
        return count($data) == 0;
    }

    public function generateDenominacionByPattern($pattern)
    {
        $idestructura = $this->global->Estructura->idestructura;
        $conditions
            = "idestructuracomun = ? AND denominacion ILIKE '%" . $pattern . "%'";
        $params = array($idestructura);

        $data = DatCondicionpago::GetByCondition($conditions, $params, true);
        $total = count($data);
        return $pattern . "(#$total)";
    }


    public function activePayCondition($post)
    {
        $idEstructura = $this->global->Estructura->idestructura;
        $response = array('code'    => 1, 'errors' => array(),
                          'success' => array());
        if (!empty($post)) {
            $activaOld = DatCondicionpago::GetByCondition(
                "activo = ? AND idestructuracomun = ?", array(1, $idEstructura)
            );
            if (count($activaOld) > 0) {
                $activaOld = $activaOld[0];
                $activaOld->activo = 0;
                $this->Insertar($activaOld);
            }
            $newActiva = DatCondicionpago::GetById($post['idcondicionpago']);
            $newActiva->activo = 1;
            $result = $this->Insertar($newActiva);
            if (is_numeric($result)) {
                $response['success'][]
                    = array('idcondicionpago' => $post['idcondicionpago'],
                            'denominacion'    => $post['denominacion']);
            }
        } else {
            $response['code'] = 2;
            $response['errors'][] = array('iderror' => 1);
        }
        return $response;
    }

    public function gestionarUso($params){
        try{
            $ids = json_decode($params['idterminospagos']);
            $idestructura = $this->global->Estructura->idestructura;
            if($params['usar']=='true'){
                $oper='activar';
                foreach ($ids as $value) {
                    $this->usarEnEntidad($value, $idestructura);
                }
            }else{
                $oper='desactivar';
                $this->noUsarEnEntidad($ids, $idestructura);
            }
            return array('success'=>true, 'operacion'=>$oper);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function usarEnEntidad($idterminopago, $idestructura){
        try {
            $instance = Doctrine::getTable('DatTerminopagoEntidad')
                ->findByDql('idterminodepago=? AND idestructuracomun=?',
                    array($idterminopago, $idestructura));
            if($instance->count()==0){
                $instance = new DatTerminopagoEntidad();
                $instance->idterminodepago = $idterminopago;
                $instance->idestructuracomun = $idestructura;
                $instance->save();
//                return $instance->idterminodepago;
            }
            return 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function noUsarEnEntidad($ids, $idestructura){
        try {
            $query = Doctrine_Query::create()
                ->delete('DatTerminopagoEntidad')
                ->whereIn('idterminodepago', $ids)
                ->addWhere('idestructuracomun = ?', $idestructura)
                ->execute();
//            return $query;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}
