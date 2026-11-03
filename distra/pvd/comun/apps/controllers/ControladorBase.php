<?php

/**
 * Controlador para gestionar los tipos de certificaciones.
 *
 * @author Tte. Darien.
 * @package Presentación.
 * @subpackage ComponentesBase.
 * @category .
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class ControladorBase extends ZendExt_Controller_Secure
{
    /**
     * @var
     */
    /**
     * @var
     */
    /**
     * @var
     */
    protected $objetoConfig,
        $objetoComponente,
        $response;

    /**
     *
     */
    public function init()
    {
        parent::init();
        //$this->response = new Response();
    }

    /*public function postDispatch()
    {
        parent::postDispatch();
        if ($this->response->mostrarResponse())
            echo $this->response->getJson();
    }*/

    //['cssBase' => 'rrhh', 'archivoBase' => 'rrhh', 'scriptAcc' => true]
    /**
     * @param $modulo
     * @param $componente
     * @param $service
     * @param $config
     * @throws Exception
     */
    public function cargaInicial($modulo, $componente, $service, $config)
    {

        $this->initConfigComponente($modulo, $componente);
        $this->conformarObjetoConfigGeneral($config);
        $this->cargarLibreriasBase($config);
        $this->cargarFicherosFromServices($service);
        $this->cargarFicherosComponente();
    }

    //return void
    /**
     * @param $modulo
     * @param $componente
     * @throws Exception
     */
    private function initConfigComponente($modulo, $componente)
    {
        $this->initArchivoConfiguracion();
        if ($this->objetoConfig->existeComponente($modulo, $componente)) {
            $this->objetoComponente = new Componente($modulo, $componente, array("estructura" => $this->objetoConfig,
                    "idiomaUsuario" => $this->global->Perfil->idioma)
            );
        } else
            throw new Exception('El componente especificado no existe.');
    }

    //return void

    /**
     *
     */
    public function initArchivoConfiguracion()
    {
        $arrayConfig = array("dirExt" => $this->view->dir_extjs,
            "dirExtUcid" => $this->view->dir_ucid,
            "dirExtCss" => $this->view->dir_ext_ccs,
            "userTema" => $this->global->Perfil->tema);
        $this->objetoConfig = new ConfiguracionBase($arrayConfig);
    }

    //return void

    /**
     * @param $config
     */
    private function conformarObjetoConfigGeneral($config)
    {
        $objetoConfigScript = 'var ConfigGral = {};';
        $accionScript = ($config['scriptAcc']) ? $this->getScriptAcciones() : '';
        $dirModuloScript = $this->getScriptDirModulo();
        $iconosScript = $this->getScriptIconos();

        //$this->view->headScript()->appendScript($objetoConfigScript . $accionScript . $dirModuloScript . $iconosScript);
    }

    //return void

    /**
     * @return string
     */
    private function getScriptAcciones()
    {
        return "ConfigGral.acciones = [" . $this->getAccionesAutorizadasFormaString() . '];';
    }

    //return void

    /**
     * @return string
     */
    private function getAccionesAutorizadasFormaString()
    {
        $accAutorizadas = $this->getAccionesAutorizadas();
        $listadoAcc;
        foreach ($accAutorizadas as $valor)
            $listadoAcc .= "'" . $valor . "',";
        return $listadoAcc;
    }

    //return void

    /**
     * @return mixed
     */
    private function getAccionesAutorizadas()
    {
        $certificado = $this->global->Perfil->certificado;
        $idusuario = $this->global->Perfil->idusuario;
        $idestructura = $this->global->Estructura->idestructura;
        $funcionalidadesPermitidas = $this->integrator->seguridad->getFunctionalitiesUser($certificado, $idusuario, $idestructura);
        return $this->integrator->seguridad->ObtenerAccionesByArrayFunc($idusuario, $idestructura, $funcionalidadesusuario);
    }

    //return void

    /**
     * @return string
     */
    private function getScriptDirModulo()
    {
        return 'ConfigGral.dirModule = {' . $this->getModulosUtilizaFormaString() . '};';
    }

    //return void

    /**
     * @return string
     */
    private function getModulosUtilizaFormaString()
    {
        $modUtiliza = $this->objetoComponente->getModulosUtiliza();
        $listadoMod;
        foreach ($modUtiliza as $llave => $valor)
            $listadoMod .= $llave . ":'" . $valor . "',";
        return $listadoMod;
    }

    //return string

    /**
     * @return string
     */
    private function getScriptIconos()
    {
        return "ConfigGral.iconos = {" . $this->objetoConfig->getDireccionIconosString() . '};';
    }

    //String

    /**
     * @param $config
     */
    private function cargarLibreriasBase($config)
    {
        $this->cargarFicherosBaseLibreria($config);
        $this->cargarFicherosBaseCss($config);
        $this->cargarFicherosBaseArchivo($config);
    }

    //return string

    /**
     * @param $config
     */
    private function cargarFicherosBaseLibreria($config)
    {

        $preferencias = ($config['dirBaseExtjs']) ? $config['dirBaseExtjs'] : 'default';
        $this->inscrustarDireccionFicheros($this->objetoConfig->getArchivosBaseLibreria($preferencias));
    }

    //String

    /**
     * @param $dirFicheros
     */
    private function inscrustarDireccionFicheros($dirFicheros)
    {
        foreach ($dirFicheros as $value) {
            switch ($value[0]) {
                case 'css':
                    $this->view->headLink()->appendStylesheet($value[1]);
                    break;
                case 'service':
                    $this->view->headScript()->append($value[1]);
                    break;
                default:
                    $this->view->headScript()->appendFile($value[1]);
                    break;
            }
        }
    }

    //return array.

    /**
     * @param $config
     */
    private function cargarFicherosBaseCss($config)
    {
        $preferencias = ($config['cssBase']) ? $config['cssBase'] : 'default';
        $this->inscrustarDireccionFicheros($this->objetoConfig->getArchivoBaseCss($preferencias));
    }

    //return string

    /**
     * @param $config
     */
    private function cargarFicherosBaseArchivo($config)
    {
        $preferencias = ($config['archivoBase']) ? $config['archivoBase'] : 'default';
        $this->inscrustarDireccionFicheros($this->objetoConfig->getArchivosBase($preferencias));
    }

    //return void

    /**
     * @param $service
     */
    private function cargarFicherosFromServices($service)
    {
        if (is_array($service) && !empty($service)) {
            foreach ($service as $k => $v) {
                if(is_string($v)){
                    $this->view->headScript()->appendScript("//*******SERVICES******</script>" . $v . "<script>//*******END SERVICES*********");
                }elseif(is_array($service)){
                    $this->inscrustarDireccionFicheros(array(
                        array('service', $service)
                    ));
                }
            }
        }
       /*if (!empty($service)) {
            $this->inscrustarDireccionFicheros(array(
                array('service', $service)
            ));
        }*/
    }

    /**
     *
     */
    private function cargarFicherosComponente()
    {
        $this->inscrustarDireccionFicheros($this->objetoComponente->getArchivosRequeridos());
    }

}
