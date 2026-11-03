<?php

/**
 *
 */
class NomencladoresActivosService extends ZendExt_Model
{

    private $_mEstatus, $_mActividadMedio;

    /**
     *
     */
    public function __construct()
    {
        $this->_mEstatus = new EstatusModel();
        $this->_mActividadMedio = new ActividadMedioModel();
    }

    /**
     * Devuelve una instancia de la clase
     *
     * @return EstatusModel
     */
    public function getObjNomEstatusModel()
    {
        return $this->_mEstatus;
    }

    /**
     * Devuelve una instancia de la clase
     *
     * @return ActividadMedioModel
     */
    public function getObjNomActividadMedioModel()
    {
        return $this->_mActividadMedio;
    }

    /**
     * Devuele solo los estados técnicos con algún estado operativo por defecto
     */
    public function getEstatusTecnicos($parametros)
    {
        $oEstatusTecnico = new NomEstatustecnico();
        return $oEstatusTecnico->getEstatusTecnicos($parametros);
    }

    /**
     * Devuele solo los estados operativos
     */
    public function getEstatusOperativos($parametros)
    {
        $oEstatusOperativo = new NomEstatusoperativo();
        return $oEstatusOperativo->getEstatusOperativos($parametros);
    }

    /**
     * Devuele los estados operativos que se usan en la entidad
     */
    public function getEstatusTecUsanEntidad($idestructura)
    {
        $oEstatusTecnico = new NomEstatustecnico();
        return $oEstatusTecnico->getEstatusTecUsanEntidad($idestructura);
    }

    /**
     *  Devuelve un objeto Doctrine_Query $query->InnerJoin/leftJoin('NomEstatustecnico')
     */
    public function getJoinEstadoTecnico($query, $aliasTbOrigen, $aliasPropio, $parametros, $innerJoin)
    {
        return NomEstatustecnico::getJoinEstadoTecnico($query, $aliasTbOrigen, $aliasPropio, $parametros, $innerJoin);
    }

    public function getJoinEstadoOperativo($query, $aliasOrigen, $aliasPropio, $parametros, $innerJoin)
    {
        return NomEstatusoperativo::getJoinEstadoOperativo($query, $aliasOrigen, $aliasPropio, $parametros, $innerJoin);
    }

    /**
     *
     */
    public function getEstatusTecById($id)
    {
        return $this->_mEstatus->getEstatusTecById($id);
    }

    /**
     *
     */
    public function getMetodosDepreciacion()
    {
        return NomDepreciacion::getMetodosDepreciacion();
    }

    /**
     *
     */
    public function getColorById($idColor)
    {
        return NomColor::getColorById($idColor);
    }

    /**
     *
     */
    public function getColoresHabilitados($iddenom)
    {
        return NomColor::getColoresHabilitados($iddenom);
    }

    /**
     *
     */
    public function getColoresHabilitadosEntidad($entidad)
    {
        return NomColor::getColoresHabilitadosEntidad($entidad);
    }

    /**
     *
     */
    public function getActividades()
    {
        return NomActividadMedio::getActividades();
    }

}
