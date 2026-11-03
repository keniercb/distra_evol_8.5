<?php

class SeguridadECProxy
{

    private static $_instance = null;

    private $defaultDomain
        = array(
            'iddominio'    => 1,
            'denominacion' => 'Sin dominio',
            'descripcion'  => 'Sin dominio',
            'seguridad'    => 1,
            'idpadre'      => 1,
            'lft'          => 1,
            'rgt'          => 2
        );

    private $defaultStructure
        = array(
            'id'        => '100000001',
            '_parent'   => '100000001',
            'text'      => 'Sin estructura',
            'leaf'      => true,
            'checked'   => true,
            'unchecked' => false,
            '_lft'      => 1,
            '_rgt'      => 2,
            'access'    => true,
            'fechafin'  => '31/12/2048'
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

    public function buscarIdEstructurasDominio(
        $iddominio, $arrayIdestructura, $tipoEAV, $nomtipoEAV = 0
    )
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->buscarIdEstructurasDominio(
                    $iddominio, $arrayIdestructura, $tipoEAV, $nomtipoEAV
                );
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return array(
                array(
                    'idfila'       => $this->defaultStructure['id'],
                    'idestructura' => $this->defaultStructure['id'],
                    'text'         => $this->defaultStructure['text']
                )
            );
        }
    }

    public function getIdsEntityByRoleIndex($iddominio,$arrayAccesos){
        try {
            return ZendExt_IoC::getInstance()->metadatos->getIdsEntityByRoleIndex($iddominio, $arrayAccesos);
        }catch (Exception $e){
            return array(
                array(
                    'idfila'       => $this->defaultStructure['id'],
                    'idestructura' => $this->defaultStructure['id'],
                    'text'         => $this->defaultStructure['text']
                )
            );
        }
    }

    public function getAccess($identidad, $iddominio, $arrayAccesos)
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->getAccess($identidad, $iddominio, $arrayAccesos);
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return $arrayAccesos[0]['identidad'];
        }
    }

    public function loadAccessDomain($idestructura, $arrayAccess)
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->loadAccessDomain($idestructura, $arrayAccess);
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return array($this->defaultStructure);
        }
    }

    public function DatosDominioDadoID($iddominio)
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->DatosDominioDadoID($iddominio);
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return array($this->defaultDomain);
        }
    }

    public function cargarComboDominioBuscar($filtroDominio)
    {
        try {
            $arraydominios = ZendExt_IoC::getInstance()->metadatos
                ->cargarComboDominioBuscar($filtroDominio);
            $arrayDom = array(
                'iddominio' => 0, 
                'denominacion' => 'S/D',
                'descripcion' => 'S/D'
            );
            $arraydominios['datos'][count($arraydominios['datos'])] = $arrayDom;

            return $arraydominios;
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return array(
                'cant'  => 1,
                'datos' => array($this->defaultDomain)
            );
        }
    }

    public function BuscarDominio($limit, $start)
    {
        try {
            $arraydominios = ZendExt_IoC::getInstance()->metadatos
                ->BuscarDomio($limit, $start);
            $arrayDom = array(
                'iddominio' => 0, 
                'denominacion' => 'S/D',
                'descripcion' => 'S/D'
            );
            $arraydominios['datos'][count($arraydominios['datos'])] = $arrayDom;

            return $arraydominios;
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return array(
                'cant'  => 1,
                'datos' => array($this->defaultDomain)
            );
        }
    }

    public function buscarHijosEstructurasDadoArray(
        $accessId, $domainId, $structureId, $checked
    )
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->buscarHijosEstructurasDadoArray(
                    $accessId, $domainId, $structureId, $checked
                );
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);
            if (!$accessId) {
                $this->defaultStructure['checked'] = false;
                $this->defaultStructure['access'] = false;
            }

            return array($this->defaultStructure);
        }
    }

    public function accesoDadoArrayNoRol(
        $domainId, $unselectedRolesAccess, $selectedStructures
    )
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->accesoDadoArrayNoRol(
                    $domainId, $unselectedRolesAccess, $selectedStructures
                );
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return array('id' => $this->defaultStructure['id']);
        }
    }

    public function verificarAccesoEstrucExternas(
        $domainId, $unselectedRolesAccess, $selectedStructuresArray
    )
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->verificarAccesoEstrucExternas(
                    $domainId, $unselectedRolesAccess, $selectedStructuresArray
                );
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return true;
        }
    }

    public function asignarAccesoRoles($iddominio, $idacceso, $array)
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->asignarAccesoRoles($iddominio, $idacceso, $array);
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);
        }
    }

    public function cantAccesoFilas($entityId, $domainId)
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->cantAccesoFilas($entityId, $domainId);
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return 0;
        }
    }

    public function buscarArbolHijosDominio(array $domainIdsList)
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->buscarArbolHijosDominio($domainIdsList);
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return array($this->defaultDomain);
        }
    }

    public function cargarArbolDominios($domainId)
    {
        try {
            return ZendExt_IoC::getInstance()->metadatos
                ->cargarArbolDominios($domainId);
        } catch (ZendExt_FastResponse_Exception $e) {
            $this->log($e);

            return array($this->defaultDomain);
        }
    }
}