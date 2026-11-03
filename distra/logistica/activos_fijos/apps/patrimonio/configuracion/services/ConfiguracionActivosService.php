<?php

$dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/activos_fijos/comun/config.php';
include_once $dir;
set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);

class ConfiguracionActivosService extends ZendExt_Model
{

    private $_mConfTipoMedio;

    /**
     *
     */
    public function __construct()
    {
        $this->_mConfTipoMedio = new ConfiguraciontipomedioModel();
    }

    public function initPluginsModel()
    {
        $this->_mConfTipoMedio->loadPluginsFromFile('listapluginsconf')->buildRelations();
    }

    /**
     *
     */
    public function getJsConfigActivos()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps . '/logistica/activos_fijos/configuracion/views/' .
            'scripts/configuracionactivosfijos/configuracionactivosfijos.phtml';

        return file_get_contents($dirPhtml);
    }

    /**
     *
     */
    public function getConfiguracionPG($idEstructura)
    {
        return ConfparametrosgeneralesModel::getConfiguracionPG($idEstructura);
    }

    /**
     *
     */
    public function getNextEstatusTecDadoOperacion($idOperacion, $idestado)
    {
        return CfgEstadosEntidad::getNextEstatusTecDadoOperacion($idOperacion, $idestado);
    }

    /**
     *
     */
    public function getConfiguracion($idEstructura)
    {
        $confGeneral = new CfgGeneral();
        return $confGeneral->getConfiguracion($idEstructura);
    }

    /**
     *
     */
    public function InterfazByIdOperacion($idOperacion)
    {
        $mComunAFT = ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        return $mComunAFT->InterfazByIdOperacion($idOperacion);
    }

    /**
     *
     */
    public function getCfgEstadosPorOperacion($idOperacion, $idEstatus, $idEstructura)
    {
        return CfgEstadosEntidad::getEstatusPorOperacion($idOperacion, $idEstatus, $idEstructura);
    }

    /**
     *
     */
    public function getIdsEstadosInicialesPorOperacion($idOperacion)
    {
        $cfg = CfgEstadosEntidad::getEstatusPorOperacion($idOperacion);
        $idEstatus = array();

        foreach ($cfg as $estado) {
            $idEstatus[] = $estado['idestado'];
        }
        return $idEstatus;
    }

    /**
     *
     */
    public function getCategorias($idEstructura = false)
    {
        if (!$idEstructura) {
            $classEstructura = 'Estructura';
            $idEstructura = $this->global->$classEstructura->idestructura;
        }
        return NomCategoriasproducto::devolverCategoriasEntidad($idEstructura);
    }

    /**
     *
     */
    public function getResponsableByIdArea($idAreaResp)
    {
        $obj = new ConfparametrosgeneralesModel();
        return $obj->getResponsableByIdArea($idAreaResp);
    }

    /**
     *
     */
    public function getEspecialidadByIdUsuario($idusuario)
    {
        $obj = new ConfparametrosgeneralesModel();
        return $obj->getEspecialidadByIdUser($idusuario);
    }

    public function updateUsoDepConfiguracionPG($idEstructura, $valor = 1)
    {
        return ConfparametrosgeneralesModel::updateUsoDepreciacion($idEstructura, $valor);
    }

    public function getResponsableByAreaAndPerson($idAreaResp, $idPersona = false)
    {
        $obj = new ConfparametrosgeneralesModel();
        return $obj->getResponsableByAreaAndPerson($idAreaResp, $idPersona);
    }

    /**
     *
     */
    public function findTipoMedioById($idtipomedio)
    {
        return $this->_mConfTipoMedio->findTipoMedioByArrayIdes(array('idtipomedio' => $idtipomedio));
    }

    /**
     *
     */
    public function getConfDatPorNaturaleza($idNaturaleza, $idEntidad, $useDepreciacion = true)
    {
        $this->initPluginsModel();
        $datos = $this->_mConfTipoMedio->findTipoMedioByArrayIdes(array('idtipomedio' => $idNaturaleza));
        return $this->_mConfTipoMedio->getLabelNameObjectsFromData($datos[0], $idEntidad, $useDepreciacion);
    }

}
