<?php

/**
 * Class GenerateProjectModel
 */
class GenerateProjectModel
{
    /**
     * @var identificador del proyecto
     */
    protected $idProyect = null;

    /**
     * @var dirección del proyecto en apps
     */
    private $appsPath;

    /**
     * @var dirección del proyecto en web
     */
    private $webPath;

    /**
     * @var array arquitectura de ficheros en web
     */
    private $arrWebArchitect
        = array(
            'nameProject' => 'projects/{}', 'js' => 'projects/{}/js', 'css' => 'projects/{}/css',
            'images' => 'projects/{}/images', 'idioma' => 'projects/{}/idioma', 'es' => 'projects/{}/idioma/es',
            'en' => 'projects/{}/idioma/en');

    /**
     * @var array arquitectura de ficheros en apps
     */
    private $arrAppsArchitect
        = array(
            'nameProject' => 'projects/{}', 'controllers' => 'projects/{}/controllers', 'json' => 'projects/{}/json',
            'services' => 'projects/{}/services', 'models' => 'projects/{}/models',
            'bussines' => 'projects/{}/models/bussines', 'domain' => 'projects/{}/models/domain',
            'generated' => 'projects/{}/models/domain/generated', 'views' => 'projects/{}/views',
            'scripts' => 'projects/{}/views/scripts', 'phtml' => 'projects/{}/views/scripts/{}');

    /**
     * @var DatProyectoconceptoModel
     */
    private $projectConfig;

    /**
     * @var object objClientSide Instancia de la clase GenerateClientSide
     */
    private $objClientSide;

    /**
     * @var object objServerSide Instancia de la clase GenerateServerSide
     */
    private $objServerSide;

    private $createdFiles;

    /**
     * Constructor
     */
    function __construct($objProject)
    {
        $this->projectConfig = $objProject;
        $this->idProyect = $objProject['idproyecto'];
    }

    /**
     * Funcion para crea un proyecto
     *
     * @param $idProject
     *
     * @throws Exception
     */
    public function generateProject($moduleName)
    {
        try {
            $this->createArchitectFile($this->idProyect);
            $this->objClientSide->generateJsFiles($this->projectConfig);
            $this->createdFiles['client'] = $this->objClientSide->getCreatedFuntions();
            $this->objServerSide->generatePhpFiles($this->projectConfig, $moduleName);
            //$this->createdFiles['server'] = $this->objServerSide->getCreatedFuntions();
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para crear la arquitectura del proyecto
     *
     * @param $nameProject
     */
    private function createArchitectFile($nameProject)
    {
        $projectPaths = $this->getDir();
        if (!empty($nameProject)) {
            $this->objServerSide = new GenerateServerSide(
                $nameProject, $projectPaths['appsPath'], $this->arrAppsArchitect
            );
            $this->objServerSide->createFileAppsProject();
            $this->objClientSide = new GenerateClientSide(
                $nameProject, $projectPaths['webPath'], $this->arrWebArchitect
            );
            $this->objClientSide->createFileWebProject();
        } else {
            throw new Exception('El nombre del proyecto es vacio', 3);
        }
    }

    /**
     * Function para obtener las direcciones de referencia para el proyecto
     *
     * @return array
     */
    private function getDir()
    {
        $moduloPath = Zend_Registry::getInstance()->config->modulo_path;
        $this->appsPath = $moduloPath;
        $this->webPath = str_replace('apps/pvd', 'web/pvd', $moduloPath);

        return array(
            'appsPath' => $this->appsPath, 'webPath' => $this->webPath);
    }

    /**
     * Devuelve un arreglo con los ficheros creados
     *
     * @return array
     */
    public function getCreatedFiles()
    {
        return $this->createdFiles;
    }


    //--------------Getters and Setters---------------------//
    /**
     * @return mixed
     */
    public function getAppsPath()
    {
        return $this->appsPath;
    }

    /**
     * @param mixed $appsPath
     */
    public function setAppsPath($appsPath)
    {
        $this->appsPath = $appsPath;
    }

    /**
     * @return array
     */
    public function getArrAppsArchitect()
    {
        return $this->arrAppsArchitect;
    }

    /**
     * @param array $arrAppsArchitect
     */
    public function setArrAppsArchitect($arrAppsArchitect)
    {
        $this->arrAppsArchitect = $arrAppsArchitect;
    }

    /**
     * @return array
     */
    public function getArrWebArchitect()
    {
        return $this->arrWebArchitect;
    }

    /**
     * @param array $arrWebArchitect
     */
    public function setArrWebArchitect($arrWebArchitect)
    {
        $this->arrWebArchitect = $arrWebArchitect;
    }

    /**
     * @return mixed
     */
    public function getIdProyect()
    {
        return $this->idProyect;
    }

    /**
     * @param mixed $idProyect
     */
    public function setIdProyect($idProyect)
    {
        $this->idProyect = $idProyect;
    }

    /**
     * @return mixed
     */
    public function getWebPath()
    {
        return $this->webPath;
    }

    /**
     * @param mixed $webPath
     */
    public function setWebPath($webPath)
    {
        $this->webPath = $webPath;
    }

}