<?php

class ReadWriteConfiguracion
{

    const DIR_FILE_JSON = '/recursos/json/config.json';

    const DIR_FILE_XML = '/recursos/xml/config.xml';

    private static $instance;
    private static $isUpdated;

    private $dir_abs,
        $fileManager,
        $config,
        $modules,
        $modulesBySusbsistemas;

    function __construct()
    {
        $this->fileManager = new ZendExt_File ();
        $this->modulesBySusbsistemas = new stdClass();
        $dir_www = $_SERVER['DOCUMENT_ROOT'];
        $dir = str_replace('web', 'apps', $dir_www) . '/pvd';
        if (is_dir($dir)) {
            $this->dir_abs = $dir;
        } else {
            throw new Exception('La direcion de referencia del modulo es incorrecta.');
        }
        $this->config = $this->getDepedencias();
        self::$isUpdated = false;
    }

    static public function getInstance() {
        if (!isset(self::$instance) || self::$isUpdated)
            self::$instance = new self();
        return self::$instance;
    }

    private function getDepedencias()
    {
        $array = array();
        $d = dir($this->dir_abs);
        while ($f = $d->read()) {
            if ($f == '.' || $f == '..' || substr($f, 0, 1) == '.') continue;
            switch ($f) {
                case 'comun':
                    if (is_dir($this->dir_abs . '/' . $f)) {
                        $modules = $this->readAndDecodeFileJson($this->dir_abs . '/' . $f);
                        if (count($modules) > 0) {
                            $this->loadDirByModule($f, $this->dir_abs . '/' . $f, self::getModulesByDataFile($modules));
                            $array = array_merge($array, $modules);
                        }
                    }
                    break;
                default:
                    if (is_dir($this->dir_abs . '/' . $f . '/comun')) {
                        $modules = $this->readAndDecodeFileJson($this->dir_abs . '/' . $f . '/comun');
                        if (count($modules) > 0) {
                            $this->loadDirByModule($f, $this->dir_abs . '/' . $f . '/comun', self::getModulesByDataFile($modules));
                            $array = array_merge($array, $modules);
                        }
                    }
                    break;
            }
        }
        $d->close();
        return $array;
    }

    public function getConfigModules()
    {
        return $this->config;
    }

    private function loadDirByModule($subsistem, $dir, $modules)
    {
        $this->modulesBySusbsistemas->$subsistem = array(
            'dir' => $dir,
            'modules' => $modules
        );
        foreach ($modules as $v) {
            $this->modules->$v = $subsistem;
        }

    }

    public function getSubsistemByModule($module)
    {
        return $this->modules->$module;
    }

    static function getModulesByDataFile($data)
    {
        $array = array();
        foreach ($data as $k => $v) {
            array_push($array, $k);
        }
        return $array;
    }

    /**
     * Lee el fichero xml de configuracion en formato XML
     * @param string $dirFile
     * @return array
     */
    private function readAndDecodeFileXML($dirFile)
    {
        $prueba = simplexml_load_string(file_get_contents($dirFile . self::DIR_FILE_XML));
        $json = json_encode($prueba);
        $array = json_decode($json, TRUE);
    }

    /**
     * Lee el fichero de configuracion en formato JSON
     * @param string $dirFile
     * @return array
     * @throws Exception
     */
    private function readAndDecodeFileJson($dirFile)
    {
        if (file_exists($dirFile . self::DIR_FILE_JSON)) {
            if (is_readable($dirFile . self::DIR_FILE_JSON)) {
                return Zend_Json::decode(file_get_contents($dirFile . self::DIR_FILE_JSON));
            } else
                throw new Exception('El archivo no existe o no se pudo leer en la direccion: ' . $dirFile . self::DIR_FILE_JSON);
        }
    }

    public function writeInFileJson(array $data, $subsistem)
    {
        $dataSubsistem = $this->modulesBySusbsistemas->$subsistem;
        $dirFile = $dataSubsistem['dir'] . self::DIR_FILE_JSON;
        if (is_writable($dirFile)) {
            file_put_contents($dirFile, Zend_Json::encode($this->getDataByModules($data, $dataSubsistem)));
            self::$isUpdated = true;
        } else
            throw new Exception('El archivo no existe o no se pudo leer.');
    }

    private function writeInFileXml(array $data, $dirFile)
    {

    }

    private function getDataByModules($data, $subsistem)
    {
        $newData = new stdClass();
        foreach ($subsistem['modules'] as $v) {
            $newData->$v = $data[$v];
        }
        return $newData;
    }
} 