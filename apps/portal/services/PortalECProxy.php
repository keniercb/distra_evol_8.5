<?php

class PortalECProxy
{

    private static $_instance = null;

    private $_defaultDomain = array(
        'iddominio' => 1,
        'denominacion' => 'Sin dominio',
        'descripcion' => 'Sin dominio',
        'seguridad' => 1,
        'idpadre' => 1,
        'lft' => 1,
        'rgt' => 2
    );

    private $_defaultStructure = array(
        'id' => '100000001',
        '_parent' => '100000001',
        'text' => 'Sin estructura',
        'leaf' => true,
        'checked' => true,
        'unchecked' => false,
        '_lft' => 1,
        '_rgt' => 2,
        'access' => true,
        'fechafin' => '31/12/2018'
    );

    private function __construct()
    {
    }

    public static function getInstance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function log(ZendExt_FastResponse_Exception $e)
    {
        if (Zend_Registry::get('config')->development) {
            $exceptionLog = new ZendExt_Exception_Log(
                new ZendExt_Exception('NOCONTROLLED', $e)
            );
            $exceptionLog->handle();
        }
    }

    public function DameEstructura($idEstructura)
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos->DameEstructura(
                $idEstructura
            );
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);
            $structureObj = new stdClass();
            $structureObj->idestructura = '100000001';
            $structureObj->idprefijo = 1;
            $structureObj->denominacion = 'Sin estructura';
            $structureObj->abreviatura = 'SE';
            $structureObj->idnomeav = 1;
            $structureObj->idpadre = '100000001';
            $structureObj->idorgano = 1;
            $structureObj->idnivelestr = 1;
            $structureObj->idespecialidad = 1;
            $structureObj->iddpt = 1;
            $structureObj->codigo = 1001;
            $structureObj->plantilla = false;
            $structureObj->ctp = 1;
            $structureObj->ctg = 1;

            return array($structureObj);
        }
    }
}