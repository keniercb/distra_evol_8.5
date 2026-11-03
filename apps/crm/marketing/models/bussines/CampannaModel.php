<?php

class CampannaModel extends ZendExt_Model
{
    private $_campanna;
    private $_prioridad;
    private $_canal;
    private $_actividad;
    private $_producto;
    private $_datosmaestros;
    private $_seguridad;
    private $_logistica;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_campanna = new DatCampanna();
        $this->_prioridad = new NomPrioridad();
        $this->_canal = new NomCanal();
        $this->_actividad = new DatActividad();
        $this->_actividadmodel = new ActividadModel();
        $this->_producto = new DatCampannaProducto();
        $this->_productomodel = new ProductoModel();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_seguridad = new SeguridadComunicationInterface();
        $this->_logistica = new LogisticaComunicationInterface();
    }

    public function getCampanna($params)
    {
        $idestrucutura = $this->global->Estructura->idestructura;
        $result = $this->_campanna->getCampanna($params, $idestrucutura);
        foreach ($result['data'] as $key => $value) {
            if ($value['idusuario']) {
                $result['data'][$key]['nombreusuario'] = $this->_seguridad->getUserNameById($value['idusuario']);
            }
            if($value['idmoneda']){
                $moneda = $this->_datosmaestros->getMonedaById($value['idmoneda']);
                $result['data'][$key]['codigoiso'] = $moneda[0]['codigoiso'];
            }
        }
        return $result;
    }

    public function insert($params)
    {
        try {
            if ($params['idcampanna']) {
                $campanna = Doctrine::getTable('DatCampanna')->find($params['idcampanna']);
            } else {
                $campanna = new DatCampanna();
            }
            $idestructura = $this->global->Estructura->idestructura;
            $campanna->denominacion = $params['denominacion'];
            $campanna->codigo = $params['codigo'];
            $campanna->idmoneda = $params['idmoneda'];
            $campanna->fechainicio = $params['fechainicio'];
            $campanna->fechafin = $params['fechafin'];
            $campanna->costofijo = $params['costofijo'];
            $campanna->cantrespuestas = $params['cantrespuestas'] ? $params['cantrespuestas'] : null;
            $campanna->idprioridad = $params['idprioridad'];
            $campanna->idusuario = $params['idusuario'];
            $campanna->descripcion = $params['descripcion'];
            $campanna->idestructura = $idestructura;

            $campanna->save();

            $idcampacanna = $campanna->idcampanna;

            if ($idcampacanna) {
                $actividades = json_decode($params['acteliminadas']);
                $this->_actividadmodel->actdelete($actividades);

                $actividades = json_decode($params['actmodificadas']);
                foreach ($actividades as $key => $actividad) {
                    $actividad->idcampanna = $idcampacanna;
                    $this->_actividadmodel->actinsert($actividad);
                }

                $productos = json_decode($params['prodeliminados']);
                $this->_productomodel->delete($productos);

                $productos = json_decode($params['prodmodificados']);
                foreach ($productos as $key => $producto) {
                    $producto->idcampanna = $idcampacanna;
                    $this->_productomodel->insert($producto);
                }
            }
            return array('success' => true, 'msg' => '', 'code' => 1);
        } catch (Exception $e) {
            return array('success' => false, 'msg' => $e->getMessage(), 'code' => $e->getCode());
        }

    }

    public function campdelete($params)
    {
        try {
            foreach ($params as $idcampanna) {
                $campanna = Doctrine::getTable('DatCampanna')->find($idcampanna);
                if($campanna){
                    $campanna->delete();
                }
            }
            return array('success' => true, 'msg' => '', 'code' => 1);
        } catch (Doctrine_Exception $e) {
            return array('success' => false, 'msg' => $e->getMessage(), 'code' => $e->getCode());
        }
    }


    public function getPrioridad($params)
    {
        return $this->_prioridad->getPrioridad($params);
    }

    public function getCanal($params)
    {
        return $this->_canal->getCanal($params);
    }

    public function getProducto($params)
    {
        return $this->_logistica->getProductService($params);
    }

    public function getMoneda($params)
    {
        $result = $this->_datosmaestros->getMonedas($params['codigoiso'], $params['start'], $params['limit']);
        return array('data' => $result['datos'], 'count' => $result['cant']);
    }

    public function getCreadoPor($params)
    {
        return $this->_seguridad->getUsers($params['limit'], $params['start'], $params['nombre']);
    }
}
