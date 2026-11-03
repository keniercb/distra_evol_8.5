<?php

/**
 * ZendExt_GlobalConcept_Estructura
 * Clase para obtener el concepto "Estructura"
 *
 * @author Elianys Hurtado Sola
 * @package ZendExt
 * @subpackage GlobalConcept
 * @copyright ERP Cuba 
 * @version 1.5.0
 */
class ZendExt_GlobalConcept_Estructura implements ZendExt_GlobalConcept_IConcept
{

    public $idestructura = 0;
    public $denominacion = '';
    public $abreviatura = '';
    public $idespecialidad = 0;
    public $idorgano = 0;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $register = Zend_Registry::getInstance();
        if (isset($register->session)) {
            if (isset($register->session->entidad->idestructura)) {
                $this->idestructura = $register->session->entidad->idestructura;
                $this->denominacion = $register->session->entidad->denominacion;
                $this->abreviatura = $register->session->entidad->abreviatura;
                $this->idespecialidad = $register->session->entidad->idespecialidad;
                $this->idorgano = $register->session->entidad->idorgano;
            }
        }
    }

    /**
     * Método para obtener el concepto
     * @return $this
     */
    public function ObtenerConcepto()
    {
        return $this;
    }

}
