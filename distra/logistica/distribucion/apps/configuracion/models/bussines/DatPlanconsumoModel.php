<?php

class DatPlanconsumoModel extends BaseModel
{

    private $planDomain;
    private $idestructura;
    private $maestroProducto;

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->planDomain = new DatPlanconsumo();
        $this->maestroProducto = new MaestroProductoModel();
        $this->idestructura = $this->global->Estructura->idestructura;
    }

    public function modificarColumna($arrDatos, $value, $columna)
    {
        $date = date('d-m-y');
        $fecha = self::getfecha($date);
        $planesConsumo = new Doctrine_Collection('DatPlanconsumo');
        foreach ($arrDatos as $datos) {
            $planconsumo = Doctrine::getTable('DatPlanconsumo')->find($datos->idplanconsumo);
            if ($columna == 'planconsumo' && $planconsumo) {
                $planconsumo->pendiente = $value - ($planconsumo->entregado + $planconsumo->enproceso);
            }
            $planconsumo->$columna = $value;
            $fechacolumna = 'fecha' . $columna;
            $planconsumo->$fechacolumna = $fecha;
            $planesConsumo->add($planconsumo);
        }
        if ($planesConsumo->count() > 0) {
            $code = $planesConsumo->save();
        }
        return $code;
    }

    public function eliminarValores($arrDatos)
    {
        foreach ($arrDatos as $dato) {
            $planconsumo = Doctrine::getTable('DatPlanconsumo')->findByDql(
                'idplanconsumo =?', array($dato->idplanconsumo)
            );
            $result = $planconsumo[0]->delete();
            $error = array();
            if ($result == false) {
                $error[] = $dato->idplanconsumo;
            }
        }
        if (empty($error)) {
            return true;
        } else {
            return $error;
        }
    }

    public function asociarClientesProductos($uiParams)
    {
        $flags = false;
        $uiParams['productos'] = (is_array($uiParams['productos'])) ? $uiParams['productos']
            : array($uiParams['productos']);
        $uiParams['clientes'] = (is_array($uiParams['clientes'])) ? $uiParams['clientes']
            : array('idcliente' => $uiParams['clientes']);
        $planesConsumo = new Doctrine_Collection('DatPlanconsumo');
        foreach ($uiParams['clientes'] as $cliente) {
            foreach ($uiParams['productos'] as $producto) {
                if ($this->planDomain->checkExistencia($cliente->idcliente, $producto) == 0) {
                    $obj = new DatPlanconsumo();
                    $obj->idcliente = $cliente->idcliente;
                    $obj->idcontrato = $cliente->idcontrato;
                    $obj->idproducto = $producto;
                    $obj->idestructura = $uiParams['idestructura'];
                    $planesConsumo->add($obj);
                } else {
                    $flags = true;
                }
            }
        }
        if ($planesConsumo->count() > 0) {
            $code = $planesConsumo->save();
        }
        return array("code" => $code, "flags" => $flags);
    }

    public function importarDatas($params)
    {
        $planesConsumo = new Doctrine_Collection('DatPlanconsumo');
        $code = -1;
        $exists = Array();
        foreach ($params['datos'] as $data) {
            if ($this->planDomain->checkExistencia($data['idcliente'], $data['idproducto']) == 0) {
                unset($data['idplanconsumo']);
                $obj = new DatPlanconsumo();
                $obj->synchronizeWithArray($data);
                $obj->idestructura = $params['idestructura'];
                $planesConsumo->add($obj);
            } else {
                array_push($exists, $data);
            }
        }
        if ($planesConsumo->count() > 0) {
            try {
                $code = $planesConsumo->save();
                return array("success" => true, "codigoMsg" => 1, "exists" => $exists);
            } catch (Exception $exc) {
                return array("success" => false, "codigoMsg" => 1);
            }
        }
        return array("success" => false, "codigoMsg" => 3, "exists" => $exists);
    }

    public function cargarPlanConsumo($params)
    {
        $params['idestructura'] = $this->idestructura;
        $query = $this->planDomain->getQueryPlanConsumo();
        $query = $this->planDomain->addWhereQuery($query, $params);
        $this->maestroProducto->addQueryNomIndicador(
            $query, $aliasExterno = 'dpc', 'i', 'ih'
        );
        $total = $query->count();
        $datos = $this->planDomain->addQueryLimits($query, $params)->fetchArray();
        $nro = $params['start'] + 1;
        $n = 0; //
        $data = array();
        foreach ($datos as $value) {
            $data[$n]['nro'] = $nro++;
            $data[$n]['idplanconsumo'] = $value['idplanconsumo'];
            $data[$n]['idcliente'] = $value['idcliente'];
            $data[$n]['idcontrato'] = $value['idcontrato'];
            $data[$n]['idproducto'] = $value['idproducto'];
            $data[$n]['idestructura'] = $value['idestructura'];
            $data[$n]['planconsumo'] = $value['planconsumo'];
            $data[$n]['politicacobertura'] = (!empty($value['politicacobertura'])) ? $value['politicacobertura'] : 0;
            $data[$n]['existencia'] = $value['existencia'];
            $data[$n]['maximo'] = $value['maximo'];
            $data[$n]['minimo'] = $value['minimo'];
            $data[$n]['fechaplanconsumo'] = $value['fechaplanconsumo'];
            $data[$n]['fechapoliticacobertura'] = $value['fechapoliticacobertura'];
            $data[$n]['fechaexistencia'] = $value['fechaexistencia'];
            $data[$n]['fechaminimo'] = $value['fechaminimo'];
            $data[$n]['fechamaximo'] = $value['fechamaximo'];
            $data[$n]['codigo'] = $value['codigo'];
            $data[$n]['descripcion'] = $value['denominacion'];
            $data[$n]['enproceso'] = (!empty($value['enproceso'])) ? $value['enproceso'] : 0;
            $data[$n]['entregado'] = (!empty($value['entregado'])) ? $value['entregado'] : 0;
            $data[$n]['pendiente'] = (!empty($value['pendiente'])) ? $value['pendiente'] : 0;
            $data[$n]['um'] = $value['um'];
            $cliente = $this->configuracionHelper->getClientesProveedorByParams(
                array('notin'=>0,'ids'=>($params['idcliente']) ? $params['idcliente'] : $value['idcliente']),$this->idestructura);
            $data[$n]['cliente'] = $cliente['datos'][0]['nombre'];
            $data[$n]['contrato'] = $cliente['datos'][0]['codigo'];
            if (!empty($data[$n]['planconsumo']) OR $data[$n]['planconsumo'] != 0) {
                $porciento = ($data[$n]['entregado'] * 100) / $data[$n]['planconsumo'];
            }

            $data[$n]['pciento'] = ($porciento > 0) ? $porciento : 0;
            $n++;
        }
        return array('total' => $total, 'datos' => $data);
    }

    public function modificarFila($arrDatos)
    {
        $date = date('d-m-y');
        $fecha = self::getfecha($date);
        $datplanconsumo = Doctrine :: getTable('DatPlanconsumo')->find($arrDatos->idplanconsumo);
        unset($arrDatos->idplanconsumo);
        foreach ($arrDatos as $columna => $value) {
            $datplanconsumo->$columna = $value;
            $dcol = "fecha" . $columna;
            if ($columna == 'planconsumo') {
                $datplanconsumo->pendiente = $value - ($datplanconsumo->entregado + $datplanconsumo->enproceso);
            }
            $datplanconsumo->$dcol = $fecha;
        }
        $datplanconsumo->trySave();
        return array('success' => true, 'fechaactualizacion' => $fecha);
    }

    public function getfecha($fechas)
    {
        $fecha = split('[/-]', $fechas);
        return (strlen($fecha[0]) == 4) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : $fechas;
    }

    public function actualizarExistenciaPlanConsumo($idcliente, $idproducto, $idcontrato, $cantidadfac)
    {
        $dat = $this->planDomain->obtenerIDPlanConsumo($idcliente, $idproducto, $idcontrato);
        $planconsumo = Doctrine::getTable('DatPlanconsumo')->find($dat[0]['idplanconsumo']);
        $fechact = Date('d/m/Y');
        $existenciaact = ($planconsumo->existencia - (($planconsumo->planconsumo / 365) * ($fechact
                        - $planconsumo->fechaexistencia))) + $cantidadfac;
        $planconsumo->existencia = $existenciaact;
        return $planconsumo->trySave();
    }

    public function getDatosConsumoCritico($fechacontable, $limit, $start)
    {
        return $this->planDomain->getDatosConsumoCritico($fechacontable, $limit, $start);
    }

    public function getDatosPlanConsumo($idestructura, $idproducto)
    {
        return $this->planDomain->getDatosPlanConsumo($idestructura, $idproducto);
    }

    public function getPlanConsumoByProductoCliente($idestructura, $idproductos, $idclientes)
    {
        return $this->planDomain->getPlanConsumoByProductoCliente($idestructura, $idproductos, $idclientes);
    }

}
