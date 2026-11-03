<?php

class CompartimentacionModel extends ZendExt_Model
{

    private $dirFolderComp;
    private $dirFileComp;
    private $idconfiguracion;

    public function CompartimentacionModel($idconfiguracion)
    {
        parent::ZendExt_Model();
        $this->idconfiguracion = $idconfiguracion;
        $register = Zend_Registry::getInstance();
        $this->dirFolderComp = $register->config->modulo_path .
            'comun/recursos/config_reccomplejas/config_' . $this->idconfiguracion;
        $this->dirFileComp = $this->dirFolderComp. '/compartimentacion.php';
    }

    public function getDataFile() {
        if (file_exists($this->dirFileComp)) {
            return file_get_contents($this->dirFileComp);
        }else{
            return $this->createFileCompartimentacion();
        }
    }

    public function createFileCompartimentacion() {
        //Genera el fichero PHP de compartimentacion
        $string = '<?php
/*
* Author: Javier Rodríguez López
* Version: 2.0
* Description:
* Fichero donde se debe configurar la compartimentacion para la configuración de las recuperaciones
* Este fichero se utiliza por la clase GenerarXMLModel
*/
function compartimentar_'.$this->idconfiguracion.'($extraParams)
{
    $sqlCompartimentacion = ZendExt_IoC::getInstance()->pvd->getSqlUserCompartimentacionPersona();
	$result["selectCompartimentacion"] = "";
    $result["fromCompartimentacion"] = "";
    $result["whereCompartimentacion"] = "";
    $result["paramsCompartimentacion"] = array();
    $result["arrIndices"] = array();

    return $result;
}
';

        file_put_contents($this->dirFileComp, $string);
        return $string;
    }

    public function saveFile($code) {
        if (file_exists($this->dirFileComp)) {
            file_put_contents($this->dirFileComp, $code);
            return true;
        }
    }
}