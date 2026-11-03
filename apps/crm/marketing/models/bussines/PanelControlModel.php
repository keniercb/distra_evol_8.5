<?php

class PanelControlModel extends ZendExt_Model
{
    private $_oportunidad;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_oportunidad = new DatOportunidad();
    }

    public function getCantOportunidadesMes($params)
    {
        $params['idestructura'] = $this->global->Estructura->idestructura;
        return $this->_oportunidad->getCantOportunidadesMes($params);
    }

    public function getClientesPotenciales($params)
    {
        $idestructura = $this->global->Estructura->idestructura;
        $params['filter'][] = array('field' => 'idestructura',
                                    'data'  => array('type' => 'numeric', 'value' => $idestructura));
        $params['filter'][] = array('field' => 'idtipo',
                                    'data'  => array('type' => 'numeric', 'value' => 3));
        return $this->_oportunidad->getClientesPotenciales($params);
    }

    public function getCampannasPotenciales($params)
    {
        $idestructura = $this->global->Estructura->idestructura;
        $params['filter'][] = array('field' => 'idestructura',
                                    'data'  => array('type' => 'numeric', 'value' => $idestructura));
        $params['filter'][] = array('field' => 'idtipo',
                                    'data'  => array('type' => 'numeric', 'value' => 3));
        return $this->_oportunidad->getCampannasPotenciales($params);
    }
}