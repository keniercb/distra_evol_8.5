<?php
/*
 * Descripcion: Clase para leer el xml de campos de la persona
 * Autor: Ing. Yadir Martinez Vergara
 * */
class NXML extends ZendExt_Model{
    private $direccionXml;

    public function NXML($nombre_xml) {
        parent::ZendExt_Model();
        $register = Zend_Registry::getInstance();
        $this->direccionXml = $register->config->modulo_path.'comun/recursos/xml/'.$nombre_xml;
    }

    function getXML(){
        //Verifico que exista un archivo con ese nombre
        if (file_exists($this->direccionXml)) {
            $xmldoc = simplexml_load_file($this->direccionXml);
            return $xmldoc;
        }
        else {
            exit('No existe el archivo '.$nameFile);
        }
    }

    public function LeerDatosCamposPersona($arrValores, $todos){
        $xml = $this->getXML();
        //print_r($xml);die;
        $cantidad = count($xml->campo);
        $arrCampos = array();
        if($todos == 1){
            for($i = 0; $i < $cantidad; $i++){
                $arrCampos[] = $xml->campo[$i];
            }
        }else{
            foreach($arrValores as $i => $v){
                for($i = 0; $i < $cantidad; $i++){
                    if($xml->campo[$i]->valor == $v){
                        $arrCampos[] = $xml->campo[$i];
                    }
                }
            }
        }

        return $arrCampos;
    }

}

?>
