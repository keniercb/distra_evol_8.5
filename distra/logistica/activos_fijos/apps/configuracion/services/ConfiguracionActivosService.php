<?php

$dir = Zend_Registry::getInstance()->get('config')->dir_aplication.'/logistica/activos_fijos/comun/config.php';
include_once $dir;
set_include_path(get_include_path().PATH_SEPARATOR.$config['include_path']);

class ConfiguracionActivosService extends ZendExt_Model
{
    private $_mConfTipoMedio;
    private $tipo;

    /**
     * ConfiguracionActivosService constructor.
     * @param int $tipo (La variable tipo es para saber si se usa de patrimonio(1) o AFT (0))
     */
    public function __construct($tipo = 0)
    {
        $this->_mConfTipoMedio = new ConfiguraciontipomedioModel($tipo);
        $this->tipo = $tipo;
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
        $dirPhtml = $dirApps.'/logistica/activos_fijos/configuracion/views/'.
            'scripts/configuracionactivosfijos/configuracionactivosfijos.phtml';

        return file_get_contents($dirPhtml);
    }


    /**
     * @param $idEstructura
     * @param int $tipo (La variable tipo es para saber si se usa de patrimonio(1) o AFT (0))
     * @return array
     */

     public function getConfiguracionPG($idEstructura, $tipo = 0)
    {
        return ConfparametrosgeneralesModel::getConfiguracionPG($idEstructura, $tipo);
    }
    
    public function usaCompletamientoEntidad($idEstructura)
    {
        return ConfparametrosgeneralesModel::usaCompletamientoEntidad($idEstructura);
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
    public function findTipoMedioByIdTrans($idtipomedio)
    {
        return $this->_mConfTipoMedio->findTipoMedioByArrayIdesTrans(array('idtipomedio' => $idtipomedio));
    }

    /**
     *
     */
    //public function getConfDatPorNaturaleza($idNaturaleza, $idEntidad, $useDepreciacion = true)
	public function getConfDatPorNaturaleza($idNaturaleza, $idEntidad, $useDepreciacion = false)
    {

        if ($this->tipo == 1) {//para patrimonio
            $this->_mConfTipoMedio->setBaseModel(new CfgTipoMedioPatrimonio());
            $datos = $this->_mConfTipoMedio->findTipoMedioByArrayIdes(array('idtipomedio' => $idNaturaleza));
            return $this->_mConfTipoMedio->getLabelNameObjectsFromData(
                    $datos[0], $idEntidad, $useDepreciacion//en caso de que deprecie hay que poner el 3er params en true
            );
        } else {
            $this->initPluginsModel();
            $datos = $this->_mConfTipoMedio->findTipoMedioByArrayIdes(array('idtipomedio' => $idNaturaleza));
            return $this->_mConfTipoMedio->getLabelNameObjectsFromData(
                    $datos[0], $idEntidad, $useDepreciacion
            );
        }
    }

    public function getCamposIdentificador()
    {
        $cfg = new ConfiguracionidentificadormedioModel();
        return $cfg->getCamposIdentificador();
    }

}
