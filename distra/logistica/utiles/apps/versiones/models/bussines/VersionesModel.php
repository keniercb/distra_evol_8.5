<?php

/**
 * @author Lisbeth
 */
class VersionesModel extends BaseModel {

    private $sConfGeneral;

    /**
     *
     */
    public function __construct() {
        parent::__construct();
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    /**
     *
     */
    public static function getInstance() {
        return new VersionesModel;
    }

    public function getProyectos()
    {
        $dir_index = $_SERVER['SCRIPT_FILENAME'];
        $dir_base_index = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'distra/logistica';
        $listadoDirectorios = scandir($dir_base_index);
        $arrProyectos = array();
        foreach ($listadoDirectorios as $key => $value) {
            $changelogPath = $dir_base_index . '/' . $value . '/CHANGELOG.md';
            if(file_exists($changelogPath)){
                $name = str_replace('_', ' ', $value);
                array_push($arrProyectos, array(
                    'dir' => $value . '/CHANGELOG.md',
                    'id' => $value,
                    'name' => ucfirst($name)
                ));
            }
        }
        //print_r($listDirFiltrados);die;
        return $arrProyectos;
    }
    public function leerFichero($changelog){
        
        $dir_index = $_SERVER['SCRIPT_FILENAME'];
        $dir_base_index = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'distra/logistica';
        $changelog = $dir_base_index . '/' . $changelog;
        if(!file_exists($changelog)){
            die('Fichero no existente');
        }

        $fichero_texto = fopen ($changelog, "r");
        $size = filesize($changelog);
        
        $contenido_fichero = fread($fichero_texto, $size);
        return $contenido_fichero;
    }
}
