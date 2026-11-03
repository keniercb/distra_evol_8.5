<?php

/**
 * @author Adrian Fernandez
 * 11-01-2013
 */
class ConfiguraciongeneralModel extends ZendExt_Model
{

    protected $global;
    private $confGeneral;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->global = ZendExt_GlobalConcept::getInstance();
        $this->confGeneral = new CfgGeneral();
    }

    public function CambiarLogotipo($parametros, $logotipo, $tabla)
    {

        $idestructura = $this->global->Estructura->idestructura;
        CfgGeneral::SetLogotipoEntidad(
            $parametros->idimagen, $idestructura,
            $logotipo
        );
        ComunImagesModel::guardarImagenDbApp(
            $parametros->idimagen, $tabla,
            'id' . $logotipo,
            $logotipo . '_entidad' . $this->global->Estructura->idestructura
            . '.jpg'
        );
    }

    public function CargarIdsLogotipos($logotipo)
    {

        if ($logotipo == 'logo') {
            return NomLogoService::GetTodosIdesLogos();
        } else {
            if ($logotipo == 'cunno') {
                return NomCunnoService::GetTodosIdesCunnos();
            }
        }
    }

    public function getConfiguracion($idestructura)
    {
        return $this->confGeneral->getConfiguracion($idestructura);
    }

    public function GuardarFormatos($parametros)
    {
        try {
            $cfg = Doctrine::getTable('CfgGeneral')->find(
                $parametros->idestructura
            );
            if (!$cfg) {
                $cfg = new CfgGeneral();
                $cfg->idestructura = $parametros->idestructura;
            }
            $cfg->idformatoruta = $parametros->idformatoruta;
            $cfg->save();
            return true;
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

}
