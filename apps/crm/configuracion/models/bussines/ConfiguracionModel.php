<?php

class ConfiguracionModel extends ZendExt_Model
{

    private $dirFolderComp;
    private $dirFileComp;
    private $register;

//    private $idconfiguracion;

    public function ConfiguracionModel()
    {
        parent::ZendExt_Model();
//        $this->idconfiguracion = $idconfiguracion;
        $this->register = Zend_Registry::getInstance();

        $strtemp=explode('/', $this->register->config->modulo_path);
        $dir=realpath(dirname(__FILE__));
        $pos=0;
//        foreach ($strtemp as $v){
//            if($pos<count($strtemp)-2){
//                $dir.=$v.'/';
//                $pos++;
//            }
//        }

        $this->dirFolderComp = $dir .
            '/../../../comun/recursos/server_config.ini';
//        print_r(file_exists($this->dirFolderComp));die;
//        $this->dirFolderComp =
//            'D:\WWW\distra-beta\zeolides\web\crm\index.php';
//        $this->dirFileComp = $this->dirFolderComp . '/configuracion.php';
    }

    public function getDataFile()
    {
        return file_get_contents($this->dirFolderComp);

    }

    public function saveFile($code)
    {
        if (file_exists($this->dirFolderComp)) {
            file_put_contents($this->dirFolderComp, $code);
            return true;
        }
    }
}