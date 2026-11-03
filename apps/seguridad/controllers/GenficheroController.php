<?php

class GenficheroController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function genficheroAction()
    {
        $this->render();
    }

    public function rolesactivosAction()
    {
        $roles = array();
        if (extension_loaded('quarseg')) {
            $conexion=Quarseg\Database\Connection::getInstance($this, __FILE__);
            $keys = $conexion->getKeys();
            $rolKeys= array_keys($keys);
            foreach ($rolKeys as $key ) {
                $roles[] = array(
                    "text" => $key, 
                    "leaf" => true, 
                    "checked" => true
                );
            }
        }
        echo json_encode($roles);
    }

    public function compilarextensionAction()
    {
        $result = array();
        $loginroles = json_decode($this->_getParam("loginroles"));
        foreach ($loginroles as $rol) {
            $result["loginroles"][$rol] = self::generarContrasenna();
        }
        $path = dirname(__FILE__);
        $recursos = substr($path, 0, strrpos($path, 'seguridad') + 10) 
            . "comun/";
        $template = $recursos . 'recursos/tpl/fichero.tpl';
        $classview = new ZendExt_Templates_h2o($template);
        $plantilla = $classview->render($result);
        $file = fopen(
            "{$recursos}recursos/extension/quarseg"
            . "/quarseg/database/key/store.zep", "a+"
        );
        fwrite($file, $plantilla);
        fclose($file);
        if (is_file(
            "{$recursos}recursos/extension/quarseg/ext/modules/quarseg.la"
        )
        ) {
            unlink(
                "{$recursos}recursos/extension/quarseg/ext/modules/quarseg.la"
            );
        }
        exec(
            "cd {$recursos}recursos/extension/quarseg/ 2>&1; "
            . "zephir build 2>&1; cd quarseg/database/key/ ; rm store.zep "
        );
        exec(
            "cd {$recursos}recursos/extension/quarseg/ext/modules 2>&1 ; "
            . "zip -r {$recursos}recursos/extension/quarseg/quarseg.zip "
            . "quarseg.so -x .svn/ 2>&1; cd -"
        );
        $file = $recursos . "recursos/extension/quarseg/quarseg.zip";
        if (is_file($file)) {
            // Set Headers
            header('Content-Type: application/zip');
            header('Content-Type: application/force-download');
            header("Content-Disposition: attachment; filename=quarseg.zip");
            echo file_get_contents($file);
            if (is_file($recursos . "recursos/extension/quarseg/quarseg.zip")) {
                unlink($recursos . "recursos/extension/quarseg/quarseg.zip");
            }
        } else {
            die("File not exist !!");
        }
    }

    private function generarContrasenna()
    {
        return md5(uniqid(mt_rand(), true));
    }

}
