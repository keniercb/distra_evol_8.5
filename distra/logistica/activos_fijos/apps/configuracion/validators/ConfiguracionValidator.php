<?php

class ConfiguracionValidator
{

    private $_sConfGeneral, $_sContabilidad, $_idEstructura, $_idSubSistema;

    public function __construct()
    {
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_sContabilidad = ServiciosContabilidadFinanzasHelper::__init();

        $classEstructura = 'Estructura';
        $this->_idEstructura = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
        $this->_idSubSistema = LogisticaGlobal::SUBSISTEMA_AFT;
    }

    public function existeEstatusTecnicosConfigurados()
    {
        $estatusTecnico = new NomEstatustecnico();
        $estatus = $estatusTecnico->getCantEstatusTecnicos(array('idestructura' => $this->_idEstructura));
        return ($estatus == 0) ? false : true;
    }

    public function existeOperacionesConfiguradasSubSistema()
    {
        $operaciones = $this->_sConfGeneral->obtenerOperaciones(
            $this->_idEstructura, $this->_idSubSistema
        );

        return (count($operaciones) == 0) ? false : true;
    }

    public function existenCuentasConfiguradas()
    {
        if (ComunAFTModel::integradoContabilidad()) {

            $cuentas = $this->_sContabilidad->obtenerClasificadorCuentas($this->_idEstructura, 0, '');
            return (count($cuentas) == 0) ? false : true;
        } else {
            return true;
        }
    }

}
