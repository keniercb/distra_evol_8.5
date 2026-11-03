<?php

/**
 * ZendExt_GlobalConcept_Subsistema
 * Clase para obtener el concepto "Subsistema"
 *
 * @author Elianys Hurtado Sola, Yoandry Morejón Borbón
 * @package ZendExt
 * @subpackage GlobalConcept
 * @copyright ERP Cuba
 * @version 1.5.0
 */
class ZendExt_GlobalConcept_Subsistema implements ZendExt_GlobalConcept_IConcept
{

    public $idsubsistema = 0;
    public $denomsubsistema = '';
    public $uri = '';
    public $idestado = 0;
    public $estado = '';
    public $version = 0;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idestructura = $global->Estructura->idestructura;
        if ($idestructura) {
            $uriModule = Zend_Registry::get('config')->module_reference;
            $arrUriModule = explode('/', $uriModule);
            $uriSubsistema = new stdClass();
            if (count($arrUriModule) > 1) {
                $uriSubsistema->nivel1 = $arrUriModule[0];
                $uriSubsistema->nivel2 = "{$arrUriModule[0]}/{$arrUriModule[1]}";
                $uriSubsistema->nivel3 = "{$arrUriModule[1]}";
                $nivel2 = "{$arrUriModule[0]}_{$arrUriModule[1]}";
            } else {
                $uriSubsistema->nivel1 = $arrUriModule[0];
                $uriSubsistema->nivel2 = $arrUriModule[0];
                $uriSubsistema->nivel3 = $arrUriModule[0];
                $nivel2 = $arrUriModule[0];
            }
            $idCache = 'subsistema_pacsoft_' . $uriSubsistema->nivel1 . '_' . $nivel2;
            $objCache = ZendExt_Cache::getInstance();
            $subsistema = $objCache->load($idCache);
            if ($subsistema === false) {
                $integrator = ZendExt_IoC::getInstance();
                try {

                    if($integrator->isService("datosmaestros")){
                       $subsistema = $integrator->datosmaestros->obtenerSubsitemaURI($uriSubsistema, $idestructura);
                    }
                } catch (ZendExt_FastResponse_Exception $e) {
                    $logException = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
                    $logException->handle();
                }
                if (!is_object($subsistema) || !isset($subsistema->idsubsistema)) {
                    $subsistema = $integrator->portal->ObtenerSubsitemaURI($uriSubsistema);
                }
                if (is_object($subsistema) && isset($subsistema->idsubsistema))
                    $objCache->save($subsistema, $idCache);
            }
            if (is_object($subsistema) && isset($subsistema->idsubsistema)) {
                Zend_Registry::set('id_subsistema_pacsoft_instanciado', $subsistema->idsubsistema);
                $this->idsubsistema = $subsistema->idsubsistema;
                $this->uri = $subsistema->uri;
                $this->denomsubsistema = (isset($subsistema->denominacion)) ? $subsistema->denominacion : '';
                $this->idestado = $subsistema->idestado;
                $this->estado = $subsistema->estado;
                $this->version = $subsistema->version;
            }
        }
    }

    /**
     * Método que permite obtener el concepto
     * @return $this
     */
    public function ObtenerConcepto()
    {
        return $this;
    }

}
