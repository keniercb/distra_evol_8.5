<?php

class OportunidadModel extends ZendExt_Model
{
    private $_oportunidad;
    private $_prioridad;
    private $_campanna;
    private $_canal;
    private $_tipo;
    private $_datosmaestros;
    private $_seguridad;
    private $_clientemodel;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_oportunidad = new DatOportunidad();
        $this->_prioridad = new NomPrioridad();
        $this->_campanna = new DatCampanna();
        $this->_canal = new NomCanal();
        $this->_tipo = new NomTipo();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_seguridad = new SeguridadComunicationInterface();
        $this->_clientemodel = new ClienteModel();
    }

    public function getOportunidad($params)
    {
        $idestrucutura = $this->global->Estructura->idestructura;
        $result = $this->_oportunidad->getOportunidad($params, $idestrucutura);
        foreach ($result['data'] as $key => $value) {
            if ($value['idusuario']) {
                $result['data'][$key]['nombreusuario'] = $this->_seguridad->getUserNameById($value['idusuario']);
            }
        }
        return $result;
    }

    public function insert($params)
    {
        try {
            if ($params['idoportunidad']) {
                $oportunidad = Doctrine::getTable('DatOportunidad')->find($params['idoportunidad']);
            } else {
                $oportunidad = new DatOportunidad();
            }

            $idestructura = $this->global->Estructura->idestructura;
            $oportunidad->denominacion = $params['denominacion'];
            $oportunidad->ingresoestimado = $params['ingresoestimado'] ? $params['ingresoestimado'] : null;
            $oportunidad->fecha = $params['fecha'];
            $oportunidad->idusuario = $params['idusuario'];
            $oportunidad->descripcion = $params['descripcion'];
            $oportunidad->idcampanna = $params['idcampanna'];
            $oportunidad->idprioridad = $params['idprioridad'];
            $oportunidad->idcanal = $params['idcanal'];
            $oportunidad->idtipo = $params['idtipo'];
            $oportunidad->idestructura = $idestructura;

            $oportunidad->save();

            $idoportunidad = $oportunidad->idoportunidad;
            if ($idoportunidad) {
                $clientes = json_decode($params['delclients']);
                if ($clientes) {
                    $this->_clientemodel->delete($clientes);
                }

                $clientes = json_decode($params['modclients']);
                foreach ($clientes as $cliente) {
                    $this->_clientemodel->insert($cliente, $idoportunidad);
                }
            }
            return array('success' => true, 'msg' => '', 'code' => 1);
        } catch (Exception $e) {
            return array('success' => false, 'msg' => $e->getMessage(), 'code' => $e->getCode());
        }
    }

    public function delete($params)
    {
        try {
            foreach ($params as $idoportunidad) {
                $oportunidad = Doctrine::getTable('DatOportunidad')->find($idoportunidad);
                if ($oportunidad) {
                    $oportunidad->delete();
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

    public function getCampannaAsociada($params)
    {
        $idestructura = $this->global->Estructura->idestructura;
        return $this->_campanna->getCampanna($params, $idestructura);
    }

    public function getTipo($params)
    {
        return $this->_tipo->getTipo($params);
    }

    public function getCanal($params)
    {
        return $this->_canal->getCanal($params);
    }

    public function getCliente($params)
    {
        $filtro = array();
        if ($params['filtro']) {
            $temp = json_decode($params['filtro']);
            foreach ($temp as $key => $value) {
                $filtro[$key] = $value;
            }
        }
        $result = $this->_datosmaestros->getClientes($filtro, $params['start'], $params['limit']);
        return $result;
    }

    public function getCreadoPor($params)
    {
        return $this->_seguridad->getUsers($params['limit'], $params['start'], $params['nombre']);
    }
}
